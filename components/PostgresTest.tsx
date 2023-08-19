import { useState } from 'react'
import { getUsers, addUser, getUser, deleteUser } from "../lib/postgres/client-side"
import { Maybe, User, UserData } from '../lib/postgres/types'

const randomUser = () => {
  const name = Math.random().toString().substring(2)
  return {
    name,
    email: `${name}@example.com`,
    image: 'https://pbs.twimg.com/profile_images/1576257734810312704/ucxb4lHy_400x400.jpg'
  }
}

const fixedUser = {
  name: 'test',
  email: `test@example.com`,
  image: 'https://pbs.twimg.com/profile_images/1576257734810312704/ucxb4lHy_400x400.jpg'
}

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

  const addOneAndGetThem = async (newUser: UserData) => {
    const data = await addUser(newUser)
    addMaybeError(data)
    await getThem()
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
      <hr></hr>
      <p>Postgress test</p>
      <button onClick={getThem}>get data</button>
      <button onClick={() => addOneAndGetThem(randomUser())}>add random user</button>
      <button onClick={() => addOneAndGetThem(fixedUser)}>add fixed user</button>
      <button onClick={() => getOne(-1)}>log user -  will fail</button>

      <table>
        <thead>
          <tr>
            <th>name</th>
            <th>email</th>
            <th>log</th>
            <th>delete</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (

            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <button onClick={() => getOne(user.id)}>log user</button>
              </td>
              <td>
                <button onClick={() => deleteOne(user.id)}>delete user</button>
              </td>
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