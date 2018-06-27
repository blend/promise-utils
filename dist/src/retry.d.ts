export interface RetryOpts {
    maxAttempts: number;
    isRetryable?: (err: Error) => boolean;
}
export declare function retry<T extends Function>(fn: T, retryOpts: RetryOpts): T;
