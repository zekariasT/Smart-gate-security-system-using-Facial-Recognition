// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import PocketBase, { SchemaField } from "pocketbase";
import { queryParameters } from "ra-core/dist/cjs/dataProvider/fetch";
import { start } from "repl";
import formidable from "formidable";
import { sanitizeQuery } from "../../../constants/scripts";
import { IListRequest } from "../../../constants/types";

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
    res: NextApiResponse
) {
    await client.admins
        .authWithPassword(DB_EMAIL, DB_PASS)
        .then(() => console.log("DB Logged in"))
        .catch((err) => console.log(err));

    if (req.method === "POST") {
        return res.send({ error: "Wrong method" });
    } else if (req.method === "GET") {
        const Request: IListRequest = req.query;

        console.log({ query: req.query, at: "/detection" });

        let records = await client
            .collection(DETECTION)
            .getList(Request.pagination?.page, 1000, {
                filter: sanitizeQuery(Request.filter), //sanitize query converts React Admin query into pocketbase queries.
            });

        return res
            .setHeader("Content-Range", `${records.items.length}`)
            .json([...records.items]);
    }
}
