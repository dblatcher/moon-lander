import type { NextApiRequest, NextApiResponse } from 'next';
import { Score, localScoreTable, postgresScoreTable } from "../../../lib/postgres/arcade-world-scores-table"
import { sendResponse } from '../../../lib/postgres/results-to-response';
import { Maybe } from '../../../lib/postgres/types';
import { getStaticConfiguration } from '../../../modules/configuration';



export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Maybe<Score[]>> | NextApiResponse<Maybe<number>>
) {
    const { dataBaseType } = getStaticConfiguration()

    if (req.method === 'POST') {
        const insertResult = dataBaseType === 'POSTGRES' ? await postgresScoreTable.insertNew(req.body) : await localScoreTable.insertNew(req.body)
        return sendResponse(res as NextApiResponse<Maybe<number>>, insertResult)
    }

    const selectResult = dataBaseType === 'POSTGRES' ? await postgresScoreTable.selectAll() : await localScoreTable.selectAll()
    return sendResponse(res as NextApiResponse<Maybe<Score[]>>, selectResult)
}
