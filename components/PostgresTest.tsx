import { useState } from 'react'
import { getUsers, addUser, getUser } from "../lib/postgres/client-side"
import { User } from '../lib/postgres/types'

export const PostgresTest = () => {

  const [users, setUsers] = useState<User[]>([])


  const getThem = async () => {
    const data = await getUsers()
    if (data.result) {
      setUsers(data.result)
    } else {
      console.error(data)
    }
  }

  const addOneAndGetThem = async () => {
    const name = Math.random().toString().substring(2)
    const newUser = {
      name,
      email: `${name}@example.com`,
      image: 'https://pbs.twimg.com/profile_images/1576257734810312704/ucxb4lHy_400x400.jpg'
    }
    const data = await addUser(newUser)
    if (data.result) {
      setUsers(data.result)
    } else {
      console.error(data)
    }
  }

  const getOne = async (id: number) => {
    const data = await getUser(id.toString())
    console.table(data)
  }

  return (
    <div>
      <p>Postgress test</p>
      <button onClick={getThem}>get data</button>
      <button onClick={addOneAndGetThem}>add data</button>
      <button onClick={() => getOne(-1)}>log user -  will fail</button>

      <div>
        {users.map(user => (

          <li key={user.id}>
            <span>{user.name}</span>
            <button onClick={() => getOne(user.id)}>log user</button>
          </li>
        ))}
      </div>
    </div>
  )
}