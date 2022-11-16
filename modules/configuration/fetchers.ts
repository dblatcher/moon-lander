import type { ConfigurationProp } from "."
import type { ScoreData } from "../data-access/ScoreData"

const fetcher = async (url: string): Promise<ScoreData> => {
    const res = await fetch(url)
    const data: ScoreData = await res.json()

    if (res.status !== 200) {
        throw new Error(data.message)
    }
    return data
}

const dummyFetcher = async (url: string): Promise<ScoreData> => {
    return {
        message: "",
        scores: []
    }
}

const makeFetcher = (config: ConfigurationProp) => {
    if (config.dataBaseType === 'LOCAL') {
        return fetcher;
    }
    return dummyFetcher;
}

export { makeFetcher }