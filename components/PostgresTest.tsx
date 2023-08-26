import { useState } from 'react'
import { Maybe } from '../lib/database/types'
import { insertScore, getAllScores, Score } from '../lib/database/arcade-world-scores-table'

export const PostgresTest = () => {

  const [scores, setScores] = useState<Score[]>([])
  const [errors, setErrors] = useState<string[]>([])

  const addMaybeError = (maybe: Maybe<unknown>) => {
    if (!maybe.error) { return }
    setErrors([...errors, maybe.error])
  }

  const getThem = async () => {
    const data = await getAllScores()
    addMaybeError(data)
    if (data.result) {
      setScores(data.result)
    }
  }



  const addRandomScore = async (gameId: string) => {
    const insert = await insertScore({
      name: 'test player',
      score: Math.floor(Math.random() * 100),
      gameId,
    })

    getThem()
  }

  return (
    <div>
      <hr></hr>
      <p>Postgress test</p>
      <button onClick={getThem}>get data</button>
      <button onClick={() => addRandomScore('moon-lander')}>add moon-lander random score</button>
      <button onClick={() => addRandomScore('asteroid-field')}>add asteroid-field random score</button>

      <table>
        <thead>
          <tr>
            <th>name</th>
            <th>score</th>
            <th>gameId</th>
            <th>createdAt</th>
          </tr>
        </thead>
        <tbody>
          {scores.map(score => (

            <tr key={score.id}>
              <td>{score.name}</td>
              <td>{score.score}</td>
              <td>{score.gameId}</td>
              <td>{score.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        <strong>ERRORS: </strong>
        <em>{errors.join("; ")}</em>
      </p>
      <hr></hr>
    </div>
  )
}