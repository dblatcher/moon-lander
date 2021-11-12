interface Score {
  name: string, score: number
}

type ScoreData = {
  message: string
  scores: Score[]
}

export type { ScoreData, Score }