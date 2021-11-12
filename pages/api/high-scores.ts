// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getScores } from '../../modules/database';
import { ScoreData } from "../../modules/ScoreData";




export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ScoreData>
) {

  const data = await getScores();
  
  res.status(200).json(data)
}
