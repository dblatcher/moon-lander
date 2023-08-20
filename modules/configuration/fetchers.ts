import type { ConfigurationProp } from "."
import { Score, getScores } from "../../lib/postgres/arcade-world-scores-table"

const dummyFetcher = async (url: string): Promise<{
    message?: string;
    scores: Score[]
}> => {
    return {
        message: "",
        scores: []
    }
}

const postgresFetcher = async (url: string): Promise<{
    message?: string;
    scores: Score[]
}> => {

    const response = await getScores()

    return {
        message: response.error,
        scores: response.result ?? []
    }
}

const makeFetcher = (config: ConfigurationProp) => {
    if ((config.dataBaseType === 'POSTGRES'))
        return postgresFetcher
    return dummyFetcher;
}

export { makeFetcher }