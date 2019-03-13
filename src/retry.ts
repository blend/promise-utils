import { delay } from './delay';

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
export function retry<T extends Function>(fn: T, retryOpts: RetryOpts): T {
  // tslint:disable-next-line:no-any (casting as any to preserve original function type)
  return ((async (...args: any[]): Promise<any> => {
    let lastErr: Error = new Error(`Could not complete function within ${retryOpts.maxAttempts}`);
    for (let i = 0; i < retryOpts.maxAttempts; ++i) {
      try {
        return await fn(...args);
      } catch (err) {
        if (retryOpts.isRetryable && !retryOpts.isRetryable(err)) {
          throw err;
        }
        lastErr = err;
      }
      if (retryOpts.delayMs) {
        await delay(retryOpts.delayMs);
      }
    }
    throw lastErr;
    // tslint:disable-next-line:no-any (casting as any to preserve original function type)
  }) as any) as T;
}
