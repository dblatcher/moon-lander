import { sql } from '@vercel/postgres'
import { UserData } from './types'


// TO DO - option without ON CONFLICT
export const userToInsertStatus = (user: UserData) => sql`
INSERT INTO users (name, email, image)
VALUES (${user.email}, ${user.name}, ${user.image})
ON CONFLICT (email) DO NOTHING;
`

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
  const createTable = await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      image VARCHAR(255),
      "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
    `

  console.log(`Created "users" table`)
  const users = await Promise.all(defaultUsers.map(userToInsertStatus))
  console.log(`Seeded ${users.length} users`)

  return {
    createTable,
    users,
  }
}