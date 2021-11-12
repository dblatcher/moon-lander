// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { resetDataBase } from '../../modules/database';


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    const successfullyReset = await resetDataBase();

    if (successfullyReset) {
        res.status(200).send({});
    } else {
        res.status(500).send({});
    }
}
