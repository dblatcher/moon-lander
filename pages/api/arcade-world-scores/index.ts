import type { NextApiRequest, NextApiResponse } from 'next';
import { Score, localScoreTable, postgresScoreTable } from "../../../lib/database/arcade-world-scores-table"
import { sendResponse } from '../../../lib/database/results-to-response';
import { Maybe } from '../../../lib/database/types';
import { getStaticConfiguration } from '../../../modules/configuration';


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Maybe<Score[]>> | NextApiResponse<Maybe<number>>
) {
    const { dataBaseType } = getStaticConfiguration()
    const table = dataBaseType === 'POSTGRES' ? postgresScoreTable : localScoreTable;

    if (req.method === 'POST') {
        const insertResult = await table.insertNew(req.body)
        return sendResponse(res as NextApiResponse<Maybe<number>>, insertResult)
    }

    const selectResult = await table.selectAll()
    return sendResponse(res as NextApiResponse<Maybe<Score[]>>, selectResult)
}
