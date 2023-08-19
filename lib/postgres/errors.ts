import { PostgresException, ErrorCategory } from "./types";


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

export const categoryToHttpCode = (category?: ErrorCategory): number => {

    switch (category) {
        case "NO_MATCHING_RECORD":
            return 404
        case "DB_ERROR":
        default:
            return 500
    }

}