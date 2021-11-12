interface Score {
  name: string, score: number
}

type ScoreData = {
  message: string
  scores: Score[]
}

function validateScore(score: any): boolean {
  if (typeof score != 'object' || score === null) return false;

  if (
    typeof score.name !== 'string' ||
    typeof score.score !== 'number'
  ) { return false }

  return true
}

export type { ScoreData, Score }
export { validateScore }