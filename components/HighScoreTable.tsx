import { ScoreData } from "../modules/ScoreData";


export default function HighScoreTable(props: {
  data: ScoreData
}) {

  const {data} = props

  if (!data) {
    return <p>Nothing in scores yet</p>
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
