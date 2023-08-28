import { Maybe } from "../types"
import { Score, ScoreTableInterface, validateScore } from "./types"

const mockScores: Score[] = [
    {
        createdAt: new Date(20 * 1000 * 60).toString(),
        id: 1,
        score: 42,
        gameId: 'moon-lander',
        name: 'test player',
    },
    {
        createdAt: new Date(20 * 1000 * 60).toString(),
        id: 2,
        score: 22,
        gameId: 'moon-lander',
        name: 'test player2',
    },
    {
        createdAt: new Date(20 * 1000 * 60).toString(),
        id: 3,
        score: 142,
        gameId: 'moon-lander',
        name: 'test player',
    },
    {
        createdAt: new Date(20 * 1000 * 60).toString(),
        id: 4,
        score: 142,
        gameId: 'asteroid-field',
        name: 'test player',
    },
]

const getScoresForId = async (gameId?: string): Promise<Maybe<Score[]>> => {
    return { result: mockScores.filter(score => score.gameId === gameId).sort((a, b) => b.score - a.score) }
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