import { useState } from 'react'
import { getUsers, addUser, getUser } from "../lib/postgres/client-side"
import { User } from '../lib/postgres/types'

export const PostgresTest = () => {

  const [users, setUsers] = useState<User[]>([])


  const getThem = async () => {
    const data = await getUsers()
    setUsers(data.users)
  }

  const addOneAndGetThem = async () => {
    const name = Math.random().toString().substring(2)
    const newUser = {
      name,
      email: `${name}@example.com`,
      image: 'https://pbs.twimg.com/profile_images/1576257734810312704/ucxb4lHy_400x400.jpg'
    }
    const data = await addUser(newUser)
    setUsers(data.users)
  }

  const getOne =async () => {
    const data = await getUser('3')
    console.table(data.user)
  }

  return (
    <div>
      <p>Postgress test</p>
      <button onClick={getOne}>get one</button>
      <button onClick={getThem}>get data</button>
      <button onClick={addOneAndGetThem}>add data</button>

      <div>
        {users.map(user => (

          <li key={user.id}>
            <span>{user.name}</span>
          </li>
        ))}
      </div>
    </div>
  )
}