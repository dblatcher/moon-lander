import { NextApiResponse } from "next"
import { Maybe } from "./types"
import { categoryToHttpCode } from "./errors"

export const sendResponse = <T,>(res: NextApiResponse<Maybe<T>>, result: Maybe<T>, happyCode = 200) => {
    if (result.result && !result.error) {
        return res.status(happyCode).json(result)
    }
    return res.status(categoryToHttpCode(result.errorCategory)).json(result)
}