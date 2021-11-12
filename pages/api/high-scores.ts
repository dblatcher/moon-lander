// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { ScoreData } from "../../modules/ScoreData";


const staticTestData = {
  message: "this is test data",
  scores: [
    { name: "Linda", score: 220 },
    { name: "Bob", score: 110 },
  ]
}


export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ScoreData>
) {
  res.status(200).json(staticTestData)
}
