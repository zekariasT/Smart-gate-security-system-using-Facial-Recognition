// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { PB, loginPB } from "../../database/pocketbase";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const token = JSON.stringify(req.body);

    // TODO check if token is correct

    return res.status(200).send({ valid: true });
}
