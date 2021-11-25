// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { resetDataBase } from '../../modules/database';



export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    if (req.method === "POST") {

        const { body } = req;
        console.log("RESET SCORES POST", body) ;


        if (body.password !== process.env.SCORE_RESET_PASSWORD) {
            res.status(403).send(null);
            return;
        }

        const successfullyReset = await resetDataBase();
    
        if (successfullyReset) {
            res.status(200).send({});
        } else {
            res.status(500).send({});
        }
        return
    }

    res.status(405).send(null);
}
