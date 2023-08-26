import { Maybe } from "../types"
import { Score, ScoreTableInterface, validateScore } from "./types"

const mockScores: Score[] = [
    {
        createdAt: new Date(20 * 1000 * 60).toString(),
        id: 1,
        score: 42,
        gameId: 'moon-lander',
        name: 'test player',
    }
]

const getScoresForId = async (gameId?: string): Promise<Maybe<Score[]>> => {
    return { result: mockScores.filter(score => score.gameId === gameId) }
}

const selectAll = async (): Promise<Maybe<Score[]>> => {
    return { result: [...mockScores] }
}

const insertNew = async (body: Record<string, unknown>): Promise<Maybe<number>> => {
    if (!validateScore(body)) {
        return { error: 'missing or invalid input', errorCategory: 'BAD_INPUT' }
    }
    const { name, score, gameId } = body
    mockScores.push({
        name, score, gameId,
        createdAt: new Date().toISOString(),
        id: 1 + Math.max(...mockScores.map(score => score.id)),
    })

    return { result: 1 }
}

export const localScoreTable: ScoreTableInterface = {
    getScoresForId, selectAll, insertNew
}