import type { ConfigurationProp } from "."
import { Score, getScoresForGame } from "../../lib/postgres/arcade-world-scores-table"

const dummyFetcher = async (url: string): Promise<{
    message?: string;
    scores: Score[]
}> => {
    return {
        message: "",
        scores: []
    }
}

const apiFetcher = async (gameId: string): Promise<{
    message?: string;
    scores: Score[]
}> => {

    const response = await getScoresForGame(gameId)

    return {
        message: response.error,
        scores: response.result ?? []
    }
}

const makeFetcher = (config: ConfigurationProp) => {
    if ((config.dataBaseType !== 'NONE'))
        return apiFetcher
    return dummyFetcher;
}

export { makeFetcher }