// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import PocketBase, { SchemaField } from "pocketbase";
import { queryParameters } from "ra-core/dist/cjs/dataProvider/fetch";
import { start } from "repl";
import formidable from "formidable";

type IDetection = {
    id?: string;
    prediction?: string;
    image_location?: string;
    detection_date?: number;
};

type ICapture = {
    start_date: string;
    detections: Array<IDetection>;
};

type Response = {
    message?: string;
    error?: string;
};

export const config = {
    api: {
        bodyParser: false,
    },
};

const DB_HOST = process.env.DB_HOST;
const DB_EMAIL = process.env.DB_EMAIL || "localhost";
const DB_PASS = process.env.DB_PASS || "pass";

const CAPTURE = "capture";
const DETECTION = "detection";

const client = new PocketBase(DB_HOST);

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Response>
) {
    const form = new formidable.IncomingForm();
    let body: IDetection = {};
    let Image = null;

    form.parse(req, (err, fields, files) => {
        body = fields;
    });

    await client.admins
        .authWithPassword(DB_EMAIL, DB_PASS)
        .then(() => console.log("DB Logged in"))
        .catch((err) => console.log(err));

    // Check if the collection exists
    let captureCollection = await client.collections
        .getOne(CAPTURE)
        .catch(() => null);

    // Create collection when none are found
    if (!captureCollection) {
        //First time connection
        console.log("Creating collections");
        const detectionCollection = await client.collections
            .create({
                name: DETECTION,
                type: "base",
                schema: [
                    {
                        name: "prediction",
                        type: "text",
                        system: false,
                        required: true,
                        unique: false,
                    },
                    {
                        name: "image_location",
                        type: "text",
                        system: false,
                        required: true,
                        unique: true,
                    },
                    {
                        name: "detection_date",
                        type: "date",
                        required: true,
                        unique: true,
                    },
                ],
            })
            .then((res) => {
                console.log("Detection collection created");
                return res;
            })
            .catch((err) => {
                console.error(err);
                return res.send({ error: err });
            });

        await client.collections
            .create({
                name: CAPTURE,
                type: "base",
                schema: [
                    {
                        name: "start_date",
                       type: "date",
                        required: true,
                        unique: true,
                    },
                    {
                        name: "detections",
                        type: "relation",
                        system: false,
                        required: false,
                        unique: false,
                        options: {
                            maxSelect: null,
                            collectionId: detectionCollection?.id,
                            cascadeDelete: false,
                        },
                    },
                ],
            })
            .then(() => console.log("Capture collection created"))
            .catch((err) => {
                console.error(err);
                return res.send({ error: err });
            });
    }

    const { prediction, image_location, detection_date } = body;

    //Save detection
    const detection = await client.collection(DETECTION).create<IDetection>({
        prediction,
        image_location,
        detection_date,
    });

    let start_date: Date | string = new Date();
    start_date = new Date(start_date.setUTCHours(0, 0, 0, 0));

    let capture = await client
        .collection(CAPTURE)
        .getList(1, 1, { start_date: start_date });

    if (capture.items.length) {
        const detections = [...capture.items[0].detections, detection.id];
        const collectionId = capture.items[0].id;

        await client
            .collection(CAPTURE)
            .update(collectionId, { detections: detections });
    } else {
        await client.collection(CAPTURE).create<ICapture>({
            start_date: start_date,
            detections: detection.id,
        });
    }

    res.send({ message: "saved" });
}
