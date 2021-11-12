import { ScoreData } from "../modules/ScoreData";


export default function HighScoreTable(props: {
  data: ScoreData

  displayErrors?: boolean
}) {

  const { data, displayErrors } = props

  if (displayErrors && data.message) {
    return <p>{data.message}</p>
  }

  return <div>

    <table>
      <tbody>
        {data.scores.map((entry, index) => (
          <tr key={index}>
            <td>{entry.name}</td>
            <td>{entry.score}</td>
          </tr>
        ))}
      </tbody>
    </table>

  </div>

}
