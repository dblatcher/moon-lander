import type { ConfigurationProp } from "."
import { getUsers } from "../../lib/postgres/user-table/client-side"
import type { Score, ScoreData } from "../data-access/ScoreData"

const localFetcher = async (url: string): Promise<ScoreData> => {
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

const postgresFetcher = async (url: string): Promise<ScoreData> => {
    console.log('postgres score request', url)

    const response = await getUsers()

    const scores: Score[] = []
    if (response.result) {
        scores.push(...response.result.map(user => ({
            name: user.name,
            score: 42,
        })))
    }


    return {
        message: "",
        scores
    }
}

const makeFetcher = (config: ConfigurationProp) => {
    if (config.dataBaseType === 'LOCAL') {
        return localFetcher;
    }
    if ((config.dataBaseType === 'POSTGRES'))
        return postgresFetcher
    return dummyFetcher;
}

export { makeFetcher }