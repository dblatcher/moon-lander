import type { NextApiRequest, NextApiResponse } from 'next';
import { userIdToDeleteStatement } from '../../../../lib/postgres/statements';
import { Maybe } from '../../../../lib/postgres/types';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Maybe<number>>
) {
    if (req.method !== 'DELETE') {
        return res.status(405).json({ error: `${req.method} not supported` })
    }

    const { id } = req.query
    if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: `no id provided` })
    }

    const result = await userIdToDeleteStatement(id)
    const { rowCount } = result

    if (rowCount === 0) {
        return res.status(404).json({ result: rowCount, error: `no user with id ${id}` })
    }
    return res.status(200).json({ result: rowCount })
}
