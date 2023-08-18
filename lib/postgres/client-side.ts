import { User, UserData, Maybe } from "./types"

export const getUsers = async (): Promise<Maybe<User[]>> => {
    const response = await fetch('/api/users')
    return await response.json()
}

export const getUser = async (id: number): Promise<Maybe<User>> => {
    const response = await fetch(`/api/users/${id}`)
    return await response.json()
}

export const addUser = async (user: UserData): Promise<Maybe<User[]>> => {
    const response = await fetch('/api/users', {
        method: 'POST',
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user)
    })
    return await response.json()
}

export const deleteUser = async (id: number): Promise<Maybe<number>> => {
    const response = await fetch(`/api/users/delete/${id}`, {
        method: 'DELETE',
        credentials: "same-origin",
    })

    return response.json()
}
