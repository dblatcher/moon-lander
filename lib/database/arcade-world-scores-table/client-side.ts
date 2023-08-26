import { Maybe } from "../types"
import { Score, ScoreData } from "./types"

export const getAllScores = async (): Promise<Maybe<Score[]>> => {
    const response = await fetch('/api/arcade-world-scores')
    return await response.json()
}

export const getScoresForGame = async (gameId: string): Promise<Maybe<Score[]>> => {
    const response = await fetch(`/api/arcade-world-scores/${gameId}`)
    return await response.json()
}

export const insertScore = async (score: ScoreData): Promise<Maybe<number>> => {
    const response = await fetch('/api/arcade-world-scores', {
        method: 'POST',
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(score)
    })
    return await response.json()
}

