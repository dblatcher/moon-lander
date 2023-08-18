import type { NextApiRequest, NextApiResponse } from 'next'
import { sql } from '@vercel/postgres';
import { seed, userToInsertStatus } from '../../../lib/postgres/seed-users';
import { parseError, ERROR_CODES } from '../../../lib/postgres/errors';
import { User,Maybe } from '../../../lib/postgres/types';



const getAll = async (res: NextApiResponse<Maybe<User[]>>) => {
    try {
        const result = await sql<User>`SELECT * FROM Users;`;
        return res.status(200).json({ result: result.rows })
    } catch (error) {
        const postgresException = parseError(error)

        if (postgresException?.code === ERROR_CODES.undefined_table) {
            console.log(
                'Table does not exist, creating and seeding it with dummy data now...'
            )
            try {
                await seed()
                const result = await sql<User>`SELECT * FROM Users;`;
                return res.status(200).json({ result: result.rows })
            } catch (seedError) {
                return res.status(500).json({ error: 'seed fail' })
            }
        }

        return res.status(500).json({ error: 'get all fail' })
    }
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
        await userToInsertStatus({ email, name, image })
    } catch (error) {
        console.log(error)
        return res.status(400).json({ error: 'insert fail' })
    }

    return getAll(res)
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Maybe<User[]>>
) {

    if (req.method === 'POST') {
        return handlePost(req, res)
    }

    return getAll(res)
}
