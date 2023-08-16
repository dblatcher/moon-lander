import type { NextApiRequest, NextApiResponse } from 'next'
import { sql, QueryResult, QueryResultRow } from '@vercel/postgres';
import { seed } from '../../lib/postgres/seed';
import { parseError, ERROR_CODES } from '../../lib/postgres/errors';

type Data = {
    users?: QueryResult<QueryResultRow>
    error?: string
}



const getAll = async (res: NextApiResponse<Data>) => {
    try {
        const users = await sql`SELECT * FROM Users;`;
        return res.status(200).json({ users })
    } catch (error) {
        const postgresException = parseError(error)

        if (postgresException?.code === ERROR_CODES.undefined_table) {
            console.log(
                'Table does not exist, creating and seeding it with dummy data now...'
            )
            try {
                await seed()
                const users = await sql`SELECT * FROM Users;`;
                return res.status(200).json({ users })
            } catch (seedError) {
                return res.status(500).json({ error: 'seed fail' })
            }
        }

        return res.status(500).json({ error: 'get all fail' })
    }
}

const handlePost = async (
    req: NextApiRequest,
    res: NextApiResponse<Data>
) => {
    console.log(req.body)
    const { email, name, image } = req.body
    if (typeof email !== 'string' || typeof name !== 'string' || typeof image !== 'string') {
        return res.status(400).json({ error: 'invalid input' })
    }

    try {
        await sql`INSERT INTO Users (Email, Name, Image) VALUES (${email}, ${name}, ${image});`;
    } catch (error) {
        console.log(error)
        return res.status(400).json({ error: 'insert fail' })
    }

    return getAll(res)
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {

    if (req.method === 'POST') {
        return handlePost(req, res)
    }

    return getAll(res)
}
