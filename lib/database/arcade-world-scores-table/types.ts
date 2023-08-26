import { Maybe } from "../types"

export type ScoreData = {
    name: string
    score: number
    gameId: string
}

export type Score = ScoreData & {
    createdAt: string
    id: number
}

export type ScoreTableInterface = {
    getScoresForId: { (gameId?: string): Promise<Maybe<Score[]>> },
    selectAll: { (): Promise<Maybe<Score[]>> },
    insertNew: { (body: Record<string, unknown>): Promise<Maybe<number>> }
}

export const validateScore = (value: unknown): value is Score => {

    if (!value || typeof value !== 'object') {
        return false
    }
    const { name, score, gameId } = value as Record<string, unknown>;
    if (typeof score !== 'number' || typeof name !== 'string' || typeof gameId !== 'string') {
        return false
    }
    return true
}