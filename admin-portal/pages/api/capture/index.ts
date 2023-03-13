// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import PocketBase, { SchemaField } from "pocketbase";
import formidable from "formidable";

import { CaptureSchema, DetectionSchema } from "../../../constants/schema";
import { ICapture, IDetection, IListRequest } from "../../../constants/types";
import { sanitizeQuery } from "../../../constants/scripts";
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
    res: NextApiResponse
) {
    //Login with admins
    await client.admins
        .authWithPassword(DB_EMAIL, DB_PASS)
        .then(() => console.log("DB Logged in"))
        .catch((err) => console.log(err));

    
    if (req.method === "POST") {
        const form = formidable({ multiples: true }); // multiples means req.files will be an array
        let body: IDetection = {};
        let Image = null;

        // Check if the collection exists
        let captureCollection = await client.collections
            .getOne(CAPTURE)
            .catch(() => null);

        // Create collection when none are found
        if (!captureCollection) {
            //First time connection
            console.log("Creating collections");

            captureCollection = await client.collections
                .create({
                    name: CAPTURE,
                    type: "base",
                    schema: CaptureSchema,
                })
                .then(async (newCollection) => {
                    console.log("Capture collection created");
                    const detectionSchema = DetectionSchema(
                        newCollection?.id || ""
                    );
                    await client.collections
                        .create({
                            name: DETECTION,
                            type: "base",
                            schema: detectionSchema,
                        })
                        .then((res) => {
                            console.log("Detection collection created");
                            return res;
                        })
                        .catch((err) => {
                            console.error(err);
                            console.error("err in detection");
                        });
                    return newCollection;
                })
                .catch((err) => {
                    console.error(err);
                    return null;
                });
        }

        //Parse form
        form.parse(req, async (err, fields, files) => {
            const { prediction, image_location, detection_date } = fields;

            let start_date: Date | string | number = new Date();
            start_date = new Date(start_date.setUTCHours(0, 0, 0, 0));
            start_date = start_date.toISOString().split("T")[0];
            let capture = await client
                .collection(CAPTURE)
                .getList(1, 1, {
                    filter: `(date~'${start_date}')`,
                })
                .then((res) => res)
                .catch(() => ({
                    items: [],
                }));

            console.log(`${capture.items.length} capture items found`);

            if (capture.items.length > 0) {
                const captureCount = capture.items[0].capture_count;

                const captureId = capture.items[0].id;

                await client
                    .collection(CAPTURE)
                    .update(captureId, { capture_count: captureCount + 1 })
                    .then(async () => {
                        console.log("saved capture");
                        //Save detection
                        await client
                            .collection(DETECTION)
                            .create<IDetection>({
                                prediction,
                                image_location,
                                detection_date,
                                capture: captureId,
                            })
                            .then(() => console.log("saved capture"));
                    });
            } else {
                const currentDate = new Date(
                    new Date().setUTCHours(0, 0, 0, 0)
                );
                await client
                    .collection(CAPTURE)
                    .create<ICapture>({
                        date: currentDate,
                        capture_count: 1,
                    })
                    .then(async (capture) => {
                        console.log("capture save");
                        await client.collection(DETECTION).create<IDetection>({
                            prediction,
                            image_location,
                            detection_date,
                            capture: capture.id,
                        });
                    })
                    .catch((err) => console.log(err));
            }

            res.end({ message: "saved" });
        });
    } else if (req.method === "GET") {
        
        //Returns list of captures
        
        const Request: IListRequest = req.query;

        console.log({ query: req.query, at: "/capture" });
        
        let records = await client
            .collection(CAPTURE)
            .getList(Request.pagination?.page, Request.pagination?.perPage, {
                filter: sanitizeQuery(Request.filter),
            });

        return res
            .setHeader("Content-Range", `${records.items.length}`)
            .json([...records.items]);
    }

    return res.send({ done: true });
}
