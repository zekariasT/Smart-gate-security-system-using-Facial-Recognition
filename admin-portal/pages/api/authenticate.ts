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
    const { username, password } = req.body;

    const client = new PocketBase(DB_HOST);

    //Login with admins
    await client.admins
        .authWithPassword(DB_EMAIL, DB_PASS)
        .then(() => console.log("DB Logged in"))
        .catch((err) => console.log(err));

    await client.collections
        .getOne("users")
        .then((collection) => {
            console.log(collection);
            if (!collection) throw new Error("DB not initialized!");
        })
        .catch((error) => {
            throw new Error(error);
        });

    let authData = await client
        .collection("users")
        .authWithPassword(req.body.username, req.body.password)
        .catch((err) => {
            throw new Error(err);
        });

    console.log(`Credentials are valid :${client.authStore.isValid}`);

    const token = client.authStore.token;

    res.status(200).json({ fullName: username, token, id: authData.record.id });
}
