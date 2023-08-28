import { NextApiRequest, NextApiResponse } from "next"
import { Score, localScoreTable, postgresScoreTable } from "../../../lib/database/arcade-world-scores-table"
import { sendResponse } from "../../../lib/database/results-to-response"
import { Maybe } from "../../../lib/database/types"
import { getSharedConfig } from "../../../modules/configuration"


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Maybe<Score[]>>
) {
    const { dataBaseType } = getSharedConfig()
    const table = dataBaseType === 'POSTGRES' ? postgresScoreTable : localScoreTable;

    const { gameId } = req.query
    const idAsString = Array.isArray(gameId) ? gameId[0] ?? '' : gameId
    const result = await table.getScoresForId(idAsString)
    return sendResponse(res, result)
}
