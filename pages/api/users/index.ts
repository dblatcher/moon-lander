import type { NextApiRequest, NextApiResponse } from 'next'
import { seed } from '../../../lib/postgres/seed-users';
import { parseError, ERROR_CODES } from '../../../lib/postgres/errors';
import { User, Maybe } from '../../../lib/postgres/types';
import { emailToSelectStatement, selectAllUsersStatement, userToInsertStatement } from '../../../lib/postgres/statements';
import { sendResponse } from '../../../lib/postgres/results-to-response';


const selectAll = async (): Promise<Maybe<User[]>> => {
    try {
        const result = await selectAllUsersStatement();
        return { result: result.rows }
    } catch (error) {
        const postgresException = parseError(error)

        if (postgresException?.code === ERROR_CODES.undefined_table) {
            console.log(
                'Table does not exist, creating and seeding it with dummy data now...'
            )
            try {
                await seed()
                const result = await selectAllUsersStatement();
                return { result: result.rows }
            } catch (seedError) {
                return { error: 'seed fail', errorCategory: 'DB_ERROR' }
            }
        }

        return { error: 'get all fail', errorCategory: 'DB_ERROR' }
    }
}

const insertNew = async (body: Record<string, unknown>): Promise<Maybe<User>> => {
    const { email, name, image } = body
    if (typeof email !== 'string' || typeof name !== 'string' || typeof image !== 'string') {
        return { error: 'missing input', errorCategory: 'BAD_INPUT' }
    }

    try {
        // insert statements have a NO NOTHING clause for email conflicts
        // TO DO - handle as an SQL exception?
        const insertResult = await userToInsertStatement({ email, name, image })
        if (insertResult.rowCount === 0) {
            return { error: 'could not insert', errorCategory: 'BAD_INPUT' }
        }
        const selectNewResult = await emailToSelectStatement(email)
        const [newUser] = selectNewResult.rows
        return { result: newUser }
    } catch (error) {
        console.log(error)
        return { error: 'insert fail', errorCategory: 'DB_ERROR' }
    }
}


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Maybe<User[]> | Maybe<User>>
) {

    if (req.method === 'POST') {
        const insertResult = await insertNew(req.body)
        return sendResponse(res, insertResult)
    }

    const selectResult = await selectAll()
    return sendResponse(res, selectResult)
}
