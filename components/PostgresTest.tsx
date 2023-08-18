import { useState } from 'react'
import { getUsers, addUser, getUser, deleteUser } from "../lib/postgres/client-side"
import { Maybe, User } from '../lib/postgres/types'

export const PostgresTest = () => {

  const [users, setUsers] = useState<User[]>([])
  const [errors, setErrors] = useState<string[]>([])

  const addMaybeError = (maybe: Maybe<unknown>) => {
    if (!maybe.error) { return }
    setErrors([...errors, maybe.error])
  }

  const getThem = async () => {
    const data = await getUsers()
    addMaybeError(data)
    if (data.result) {
      setUsers(data.result)
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
    addMaybeError(data)
    if (data.result) {
      setUsers(data.result)
    }
  }

  const getOne = async (id: number) => {
    const data = await getUser(id)
    addMaybeError(data)
    console.table(data)
  }

  const deleteOne = async (id: number) => {
    const data = await deleteUser(id)
    addMaybeError(data)
    await getThem()
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
            <button onClick={() => deleteOne(user.id)}>delete user</button>
          </li>
        ))}
      </div>
      <p>
        <strong>ERRORS: </strong>
        <em>{errors.join("; ")}</em>
      </p>
    </div>
  )
}