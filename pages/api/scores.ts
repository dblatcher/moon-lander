// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getStaticConfiguration } from '../../modules/configuration';
import { LocalDatabase } from '../../modules/data-access/LocalDataBase';
import { Score, ScoreData, validateScore } from "../../modules/data-access/ScoreData";

// TO DO - add more implementations
const config = getStaticConfiguration()
const dbInstance = config.dataBaseType == 'LOCAL' 
    ? new LocalDatabase()
    : new LocalDatabase();


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ScoreData | null>
) {

  if (req.method === "GET") {
    const data = await dbInstance.getScores();
    res.status(200).json(data)
    return;
  }

  if (req.method === "PUT") {
    const { body: score } = req;

    if (!validateScore(score)) {
      res.status(400).send(null)
    }
    
    const addScoreSucceeded = await dbInstance.addScore(score as Score);
    
    if (addScoreSucceeded) {
      res.status(200).json(score)
    } else {
      res.status(500).send(null)
    }
    return
  }

  res.status(405).send(null);
}
