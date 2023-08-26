import type { NextApiRequest, NextApiResponse } from 'next';
import { userIdToDeleteStatement } from '../../../../lib/database/user-table';
import { Maybe } from '../../../../lib/database/types';
import { sendResponse } from '../../../../lib/database/results-to-response';

const deleteUser = async (id?: string): Promise<Maybe<number>> => {
    if (!id) {
        return { error: 'no id', errorCategory: 'BAD_INPUT' }
    }
    const result = await userIdToDeleteStatement(id)
    const { rowCount } = result
    if (rowCount === 0) {
        return { result: rowCount, error: `no user with id ${id}`, errorCategory: 'NO_MATCHING_RECORD' }
    }
    return { result: rowCount }
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Maybe<number>>
) {
    if (req.method !== 'DELETE') {
        return sendResponse(res, { error: `${req.method} not supported`, errorCategory: 'METHOD_NOT_SUPPORTED' })
    }

    const { id } = req.query
    const idAsString = Array.isArray(id) ? id[0] ?? '' : id
    const result = await deleteUser(idAsString)
    return sendResponse(res, result)
}
