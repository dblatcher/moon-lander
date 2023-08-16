
export const PostgresTest = () => {

  const getData = async () => {
    const response = await fetch('/api/users')
    const data = await response.json()
    console.log({ data })
  }

  return (
    <div>
      <p>Postgress test</p>
      <button onClick={getData}>get data</button>
    </div>
  )
}