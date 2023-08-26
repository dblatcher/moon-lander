import { UserData } from './types'
import { createUsersTable, userToInsertStatement } from './statements'

const defaultUsers: UserData[] = [
  {
    email: 'bob@burger.com',
    image: 'https://pbs.twimg.com/profile_images/1576257734810312704/ucxb4lHy_400x400.jpg',
    name: 'Bob Belcher',
  },
  {
    email: 'teddy@handyman.com',
    image: 'https://wifflegif.com/tags/7994-teddy-gifs?page=2',
    name: 'Teddy',
  },
]

export async function seed() {
  const createTable = await createUsersTable()

  console.log(`Created "users" table`)
  const users = await Promise.all(defaultUsers.map(userToInsertStatement))
  console.log(`Seeded ${users.length} users`)

  return {
    createTable,
    users,
  }
}