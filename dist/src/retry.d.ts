export interface RetryOpts {
    maxAttempts: number;
    isRetryable?: (err: Error) => boolean;
    delayMs?: number;
}
/**
 * Attempts to get a successful response from task no more than times times before returning an
 * error. If the task is successful, the callback will be passed the result of the successful
 * task. If all attempts fail, the callback will be passed the error and result (if any) of the
 * final attempt.
 *
 * @param {AsyncFunction} fn - An async function to retry.
 * @param {RetryOpts} opts
 *     - maxAttempts - The number of attempts to make before giving up.
 *     - delayMs - The time to wait between retries, in milliseconds. The default is 0.
 *     - isRetryable - An optional synchronous function that is invoked on erroneous result. If it
 *           returns true the retry attempts will continue; if the function returns false the retry
 *           flow is aborted with the current attempt's error and result being returned. Invoked
 *           with (err).
 * @returns A wrapped version of function that performs retries
 */
export declare function retry<T extends Function>(fn: T, retryOpts: RetryOpts): T;
