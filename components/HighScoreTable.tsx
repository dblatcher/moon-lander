import { ScoreData } from "../modules/data-access/ScoreData";


function formatDate(dateValue: number | null | undefined, asTime = false): string {
  if (!dateValue) { return "N/A" }
  const date = new Date(dateValue);
  if (isNaN(date.valueOf())) {
    return "invalid date";
  }
  return asTime ? date.toLocaleTimeString() : date.toLocaleDateString()
}


export default function HighScoreTable(props: {
  data: ScoreData
  displayErrors?: boolean
}) {

  const { data, displayErrors } = props

  if (displayErrors && data.message) {
    return <p>{data.message}</p>
  }

  return <table>
    <thead>
      <tr>
        <th>Player</th>
        <th>Score</th>
        <th>Date</th>
        <th>Time</th>
      </tr>
    </thead>
    <tbody>
      {data.scores.map((entry, index) => (
        <tr key={index}>
          <td>{entry.name}</td>
          <td>{entry.score}</td>
          <td>{formatDate(entry.created)}</td>
          <td>{formatDate(entry.created, true)}</td>
        </tr>
      ))}
    </tbody>
  </table>
}
