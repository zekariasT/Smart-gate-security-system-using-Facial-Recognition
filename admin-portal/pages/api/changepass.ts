// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import PocketBase, { Collection, SchemaField } from "pocketbase";

const DB_HOST = process.env.DB_HOST;
const DB_EMAIL = process.env.DB_EMAIL || "localhost";
const DB_PASS = process.env.DB_PASS || "pass";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const parsedBody = JSON.parse(req.body);

    const { id, password, oldPassword, username, passwordConfirm } = parsedBody;

    const client = new PocketBase(DB_HOST);

    await client.admins
        .authWithPassword(DB_EMAIL, DB_PASS)
        .then(() => console.log("DB Logged in"))
        .catch((err) => console.log(err));

    await client.collections
        .getOne("users")
        .then((collection) => {
            if (!collection) throw new Error("DB not initialized!");
        })
        .catch((error) => {
            throw new Error(error);
        });

    const data = {
        username,
        emailVisibility: false,
        password,
        passwordConfirm,
        oldPassword,
    };

    //Update current passwords
    const resp = await client
        .collection("users")
        .update(id, data)
        .catch((err) => {
            console.log({ err });
        });

    if (resp?.id) {
        console.log(`Password changed`);
        return res.status(200).json({ success: true, resp });
    } else {
        console.log(`Password change failed`);
        return res.status(200).json({ success: false, resp });
    }
}
