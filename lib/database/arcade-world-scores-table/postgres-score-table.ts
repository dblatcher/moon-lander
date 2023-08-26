
import { createTable, scoreToInsertStatement, selectAllScoresStatement, selectScoresForGameIdStatement } from "./statements"
import { Score, ScoreTableInterface } from "./types"
import { ERROR_CODES, parseError } from "../errors"
import { Maybe } from "../types"


const getScoresForId = async (gameId?: string): Promise<Maybe<Score[]>> => {

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


export const postgresScoreTable: ScoreTableInterface = {
    getScoresForId, selectAll, insertNew
}