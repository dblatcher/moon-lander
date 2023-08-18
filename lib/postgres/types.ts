export type PostgresException = {
    name: string;
    code: string;
    message: string;
}

export type UserData = {
    email: string
    image: string
    name: string
}

export type User = UserData & {
    createdAt: string
    id: number
}