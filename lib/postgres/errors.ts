import { PostgresException } from "./types";


export const ERROR_CODES = {
    undefined_table: "42P01"
}

export const parseError = (error: unknown): PostgresException | undefined => {
    if (!error || typeof error !== 'object') {
        return undefined
    }
    const record = error as Record<string, unknown>;

    if (typeof record['code'] !== 'string') {
        return
    }

    return record as PostgresException
}