import { Score } from "../lib/postgres/arcade-world-scores-table";


function formatDate(dateValue: string | null | undefined, asTime = false): string {
  if (!dateValue) { return "N/A" }
  const date = new Date(dateValue);
  if (isNaN(date.valueOf())) {
    return "invalid date";
  }
  return asTime ? date.toLocaleTimeString() : date.toLocaleDateString()
}


export default function HighScoreTable(props: {
  scores?: Score[]
  errorMessage?: string
  displayErrors?: boolean
}) {

  const { displayErrors, errorMessage, scores } = props

  if (displayErrors && errorMessage) {
    return <p>{errorMessage}</p>
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
      {scores?.map((entry, index) => (
        <tr key={index}>
          <td>{entry.name}</td>
          <td>{entry.score}</td>
          <td>{formatDate(entry.createdAt)}</td>
          <td>{formatDate(entry.createdAt, true)}</td>
        </tr>
      ))}
    </tbody>
  </table>
}
