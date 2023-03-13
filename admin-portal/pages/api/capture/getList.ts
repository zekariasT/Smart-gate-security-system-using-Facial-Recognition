// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import PocketBase from "pocketbase";

export const config = {
    api: {
        bodyParser: false,
    },
};

type Request = {
    pagination: { page: number; perPage: number };
    sort: { field: string; order: string };
    filter: Object;
    meta: Object;
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
    await client.admins
        .authWithPassword(DB_EMAIL, DB_PASS)
        .then(() => console.log("DB Logged in"))
        .catch((err) => console.log(err));

    if (req.method === "POST") {
        return res.send({ error: "Wrong method" });
    }

    let request = req.body;

    console.log(req.query);
    let records = await client
        .collection(CAPTURE)
        .getList(
            request.pagination.page,
            request.pagination.perPage,
            request.filter
        );

    res.json(records);
}
