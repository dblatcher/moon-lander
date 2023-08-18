import { User, UserData } from "./types"

export const getUsers = async (): Promise<{
    users: User[]
}> => {
    const response = await fetch('/api/users')
    const data = await response.json() as { users: User[] }
    return data
}

export const getUser = async (id: string): Promise<{
    user: User
}> => {
    const response = await fetch(`/api/users/${id}`)
    const data = await response.json() as { user: User }
    return data
}

export const addUser = async (user: UserData): Promise<{
    users: User[]
}> => {
    const response = await fetch('/api/users', {
        method: 'POST',
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user)
    })
    const data = await response.json() as { users: User[] }
    return data
}