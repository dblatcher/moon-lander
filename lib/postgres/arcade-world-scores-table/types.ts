export type ScoreData = {
    name: string
    score: number
    gameId: string
}

export type Score = ScoreData & {
    createdAt: string
    id: number
}
