import { NextApiRequest, NextApiResponse } from "next"
import { Score, localScoreTable, postgresScoreTable } from "../../../lib/postgres/arcade-world-scores-table"
import { sendResponse } from "../../../lib/postgres/results-to-response"
import { Maybe } from "../../../lib/postgres/types"
import { getStaticConfiguration } from "../../../modules/configuration"


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Maybe<Score[]>>
) {
    const { dataBaseType } = getStaticConfiguration()
    const { gameId } = req.query
    const idAsString = Array.isArray(gameId) ? gameId[0] ?? '' : gameId
    const result = dataBaseType === 'POSTGRES'
        ? await postgresScoreTable.getScoresForId(idAsString)
        : await localScoreTable.getScoresForId(idAsString)
    return sendResponse(res, result)
}
