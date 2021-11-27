interface Score {
  name: string, score: number, created?: number | null
}

type ScoreData = {
  message: string
  scores: Score[]
}

function validateScore(score: any): boolean {
  if (typeof score != 'object' || score === null) return false;

  if (
    typeof score.name !== 'string' ||
    typeof score.score !== 'number' ||
    (typeof score.created !== 'undefined' && typeof score.created !== 'number' && score.created !== null)
  ) { return false }

  return true
}

export type { ScoreData, Score }
export { validateScore }