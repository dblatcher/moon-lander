
export const PostgresTest = () => {

  const getData = async () => {
    const response = await fetch('/api/users')
    const data = await response.json()
    console.log({ data })
  }
  const addData = async () => {
    const response = await fetch('/api/users', {
      method: 'POST',
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: 'test', email: 'test@example.com', image: 'https://pbs.twimg.com/profile_images/1576257734810312704/ucxb4lHy_400x400.jpg', })
    })
    const data = await response.json()
    console.log({ data })
  }

  return (
    <div>
      <p>Postgress test</p>
      <button onClick={getData}>get data</button>
      <button onClick={addData}>add data</button>
    </div>
  )
}