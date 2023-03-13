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
    if (req.method === "POST") {
        return res.send({ error: "Wrong method" });
    }

    await client.admins
        .authWithPassword(DB_EMAIL, DB_PASS)
        .then(async () => {
            const { id } = req.query;

            let record = await client
                .collection(DETECTION)
                .getOne(typeof id === "string" ? id : "default");

            return res.json({
                ...record,
            });
        })
        .catch((err) => {
            console.log(err);
            return res.send({ err });
        });
}
