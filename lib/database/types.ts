export type PostgresException = {
    name: string;
    code: string;
    message: string;
}

export type ErrorCategory = 'DB_ERROR' | 'NO_MATCHING_RECORD' | 'BAD_INPUT' | 'METHOD_NOT_SUPPORTED'

export type Maybe<T> = {
    result?: T;
    error?: string;
    errorCategory?: ErrorCategory
}