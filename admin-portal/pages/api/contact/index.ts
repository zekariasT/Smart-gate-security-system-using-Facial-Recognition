// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import PocketBase, { Collection, SchemaField } from "pocketbase";
import { queryParameters } from "ra-core/dist/cjs/dataProvider/fetch";
import { start } from "repl";
import formidable from "formidable";
import { IContact } from "../../../constants/types";
import { ContactSchema } from "../../../constants/schema";
import { sanitizeQuery } from "../../../constants/scripts";
import fs from "fs";
import { blob } from "stream/consumers";
type ListRequest = {
    pagination?: { page: number; perPage: number };
    sort?: { field: string; order: string };
    range?: Array<number>;
    filter?: Object;
    meta?: Object;
};

export const config = {
    api: {
        bodyParser: false,
    },
};

const DB_HOST = process.env.DB_HOST;
const DB_EMAIL = process.env.DB_EMAIL || "localhost";
const DB_PASS = process.env.DB_PASS || "pass";

const CONTACT = "contact";

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

    let contactCollection: Collection | void = await client.collections
        .getOne(CONTACT)
        .catch((err) => console.log(err));

    // Create collection when none are found
    if (!contactCollection) {
        //First time connection
        console.log("Creating contact collection");
        contactCollection = await client.collections
            .create({
                name: CONTACT,
                type: "base",

                schema: ContactSchema,
            })
            .then((res) => {
                console.log("Contact collection created");
                return res;
            })
            .catch((err) => {
                console.error(err);
                res.end({ error: err });
            });
    }

    const form = formidable({ multiples: true }); // multiples means req.files will be an array
    form.parse(req, async (err, fields, files) => {
        if (req.method === "POST") {
            const { name, user_id }: IContact = fields;
            console.log({ name, user_id });
            const newContact: IContact | { err: string } = await client
                .collection(CONTACT)
                .create({ name: name, user_id: user_id })
                .catch((err) => {
                    console.log(err);
                    return { err };
                });
            const answerString = JSON.stringify(newContact);
            const data = JSON.parse(answerString);
            return res.send({
                message: "Contact created successfully",
                data: data,
            });
        } else if (req.method === "GET") {
            const Request: ListRequest = req.query;

            console.log({ query: req.query, at: "/contact" });

            let records = await client
                .collection(CONTACT)
                .getList<Array<IContact>>(
                    Request.pagination?.page,
                    Request.pagination?.perPage,
                    {
                        filter: sanitizeQuery(Request.filter),
                    }
                );

            return res
                .setHeader("Content-Range", `${records.items.length}`)
                .json([...records.items]);
        }
    });
}
