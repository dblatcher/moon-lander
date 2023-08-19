import type { NextApiRequest, NextApiResponse } from 'next'
import { seed } from '../../../lib/postgres/seed-users';
import { parseError, ERROR_CODES, categoryToHttpCode } from '../../../lib/postgres/errors';
import { User, Maybe } from '../../../lib/postgres/types';
import { selectAllUsersStatement, userToInsertStatement } from '../../../lib/postgres/statements';


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

const handleGet = async (res: NextApiResponse<Maybe<User[]>>) => {
    const selectResult = await selectAll()
    if (selectResult.result && !selectResult.error) {
        return res.status(200).json(selectResult)
    }
    return res.status(categoryToHttpCode(selectResult.errorCategory)).json(selectResult)
}

const handlePost = async (
    req: NextApiRequest,
    res: NextApiResponse<Maybe<User[]>>
) => {
    const { email, name, image } = req.body
    if (typeof email !== 'string' || typeof name !== 'string' || typeof image !== 'string') {
        return res.status(400).json({ error: 'invalid input' })
    }

    try {
        await userToInsertStatement({ email, name, image })
    } catch (error) {
        console.log(error)
        return res.status(400).json({ error: 'insert fail' })
    }

    return handleGet(res)
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Maybe<User[]>>
) {

    if (req.method === 'POST') {
        return handlePost(req, res)
    }

    return handleGet(res)
}
