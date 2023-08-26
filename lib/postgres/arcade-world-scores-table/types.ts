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
