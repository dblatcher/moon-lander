import { NextApiRequest, NextApiResponse } from "next"

import { Score, selectScoresForGameIdStatement } from "../../../lib/postgres/arcade-world-scores-table"
import { Maybe } from "../../../lib/postgres/types"
import { sendResponse } from "../../../lib/postgres/results-to-response"
import { ERROR_CODES, parseError } from "../../../lib/postgres/errors"


const getScoresForId = async (gameId?:string):Promise<Maybe<Score[]>> => {

    if (!gameId) {
        return { error: 'no id', errorCategory: 'BAD_INPUT' }
    }
    try {
        const result = await selectScoresForGameIdStatement(gameId);
        return { result: result.rows }
    } catch (error) {
        const postgresException = parseError(error)
        if (postgresException?.code === ERROR_CODES.undefined_table) {
            return { error: 'no scores', errorCategory: 'NO_MATCHING_RECORD' }
        }
        return { error: 'get scores failed', errorCategory: 'DB_ERROR' }
    }    
}


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Maybe<Score[]>>
) {
    const { gameId } = req.query
    const idAsString = Array.isArray(gameId) ? gameId[0] ?? '' : gameId
    const result = await getScoresForId(idAsString)
    return sendResponse(res, result)
}
