import type { ConfigurationProp } from "."
import { Score, getScores } from "../../lib/postgres/arcade-world-scores-table"

// const localFetcher = async (url: string): Promise<{
//     message?: string;
//     scores: Score[]
// }> => {
//     const res = await fetch(url)
//     const data: {
//         message?: string;
//         scores: Score[]
//     } = await res.json()

//     if (res.status !== 200) {
//         throw new Error(data.message)
//     }
//     return data
// }

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
    console.log('postgres score request', url)

    const response = await getScores()


    return {
        message: "",
        scores: response.result ?? []
    }
}

const makeFetcher = (config: ConfigurationProp) => {
    // if (config.dataBaseType === 'LOCAL') {
    //     return localFetcher;
    // }
    if ((config.dataBaseType === 'POSTGRES'))
        return postgresFetcher
    return dummyFetcher;
}

export { makeFetcher }