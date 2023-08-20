import type { NextApiRequest, NextApiResponse } from 'next'
import { parseError, ERROR_CODES } from '../../../lib/postgres/errors';
import { Maybe } from '../../../lib/postgres/types';
import { sendResponse } from '../../../lib/postgres/results-to-response';
import { Score, selectAllScoresStatement, createTable, scoreToInsertStatement } from '../../../lib/postgres/arcade-world-scores-table';


const selectAll = async (): Promise<Maybe<Score[]>> => {
    try {
        const result = await selectAllScoresStatement();
        return { result: result.rows }
    } catch (error) {
        const postgresException = parseError(error)

        if (postgresException?.code === ERROR_CODES.undefined_table) {
            try {
                await createTable()
                const result = await selectAllScoresStatement();
                return { result: result.rows }
            } catch (seedError) {
                return { error: 'seed fail', errorCategory: 'DB_ERROR' }
            }
        }

        return { error: 'get all fail', errorCategory: 'DB_ERROR' }
    }
}

const insertNew = async (body: Record<string, unknown>): Promise<Maybe<number>> => {
    const { name, score, gameId } = body
    if (typeof score !== 'number' || typeof name !== 'string' || typeof gameId !== 'string') {
        return { error: 'missing or invalid input', errorCategory: 'BAD_INPUT' }
    }

    try {
        // insert statements have a NO NOTHING clause for email conflicts
        // TO DO - handle as an SQL exception?
        const insertResult = await scoreToInsertStatement({ score, name, gameId })
        if (insertResult.rowCount === 0) {
            return { error: 'could not insert', errorCategory: 'BAD_INPUT' }
        }
        return { result: insertResult.rowCount }
    } catch (error) {
        console.log(error)
        return { error: 'insert fail', errorCategory: 'DB_ERROR' }
    }
}


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Maybe<Score[]>> | NextApiResponse<Maybe<number>>
) {

    if (req.method === 'POST') {
        const insertResult = await insertNew(req.body)
        return sendResponse(res as NextApiResponse<Maybe<number>>, insertResult)
    }

    const selectResult = await selectAll()
    return sendResponse(res as NextApiResponse<Maybe<Score[]>>, selectResult)
}
