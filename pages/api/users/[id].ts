import { NextApiRequest, NextApiResponse } from "next/dist/shared/lib/utils"
import { Maybe, User } from "../../../lib/postgres/types"
import { ERROR_CODES, parseError } from "../../../lib/postgres/errors"
import { userIdToSelectStatement } from "../../../lib/postgres/statements"
import { sendResponse } from "../../../lib/postgres/results-to-response"


const getUserById = async (id?: string): Promise<Maybe<User>> => {
    if (!id) {
        return { error: 'no id', errorCategory: 'BAD_INPUT' }
    }
    try {
        const result = await userIdToSelectStatement(id);
        const [user] = result.rows
        if (!user) {
            return { error: `no user with id ${id}`, errorCategory: 'NO_MATCHING_RECORD' }
        }
        return { result: user }
    } catch (error) {
        const postgresException = parseError(error)
        if (postgresException?.code === ERROR_CODES.undefined_table) {
            return { error: 'no users', errorCategory: 'NO_MATCHING_RECORD' }
        }
        return { error: 'get all fail', errorCategory: 'DB_ERROR' }
    }
}


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Maybe<User>>
) {
    const { id } = req.query
    const idAsString = Array.isArray(id) ? id[0] ?? '' : id
    const result = await getUserById(idAsString)
    return sendResponse(res, result)
}
