import { NextApiRequest, NextApiResponse } from "next/dist/shared/lib/utils"
import { User } from "../../../lib/postgres/types"
import { sql } from "@vercel/postgres"
import { ERROR_CODES, parseError } from "../../../lib/postgres/errors"

type Data = {
    user?: User
    error?: string
}


const getUserById = async (id: string, res: NextApiResponse<Data>) => {
    try {
        const result = await sql<User>`SELECT * FROM Users WHERE id = ${id}`;

        return res.status(200).json({ user: result.rows[0] })
    } catch (error) {
        const postgresException = parseError(error)

        if (postgresException?.code === ERROR_CODES.undefined_table) {
            return res.status(404).json({ error: 'no users' })

        }

        return res.status(500).json({ error: 'get all fail' })
    }
}


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const { id } = req.query
    console.log({ id })
    const idAsString = Array.isArray(id) ? id[0] ?? '' : id

    return getUserById(idAsString, res)
}
