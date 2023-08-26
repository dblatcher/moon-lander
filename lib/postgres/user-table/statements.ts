import { sql } from '@vercel/postgres'
import { User, UserData } from './types'

// TO DO - option without ON CONFLICT
export const userToInsertStatement = (user: UserData) => sql`
INSERT INTO users (name, email, image)
VALUES (${user.name}, ${user.email}, ${user.image})
ON CONFLICT (email) DO NOTHING;
`

export const userIdToDeleteStatement = (id: string) => sql`
DELETE FROM users WHERE id = ${id};
`

export const selectAllUsersStatement = () => sql<User>`SELECT * FROM Users;`

export const userIdToSelectStatement = (id: string) => sql<User>`SELECT * FROM Users WHERE id = ${id}`
export const emailToSelectStatement = (email: string) => sql<User>`SELECT * FROM Users WHERE email = ${email}`

export const createUsersTable = () => sql`
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  image VARCHAR(255),
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
`