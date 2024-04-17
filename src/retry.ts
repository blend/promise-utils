import { delay } from './delay';

export interface BaseRetryOpts {
  maxAttempts: number;
  delayMs?: number;
}

export interface RetryOpts extends BaseRetryOpts {
  isRetryable?: (err: Error) => boolean;
}

/**
 * Attempts to get a successful response from task no more than maxAttempts times before
 * returning an error. If the task is successful, the return will be the result of the
 * successful task. If all attempts fail, it will throw the error of the final attempt.
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
    let lastErr: Error = new Error(
      `Could not complete function within ${retryOpts.maxAttempts} attempts`,
    );
    for (let i = 0; i < retryOpts.maxAttempts; ++i) {
      try {
        return await fn(...args);
      } catch (err) {
        if (err instanceof Error && (!retryOpts.isRetryable || retryOpts.isRetryable(err))) {
          lastErr = err;
        } else {
          throw err;
        }
      }
      if (retryOpts.delayMs && i < retryOpts.maxAttempts - 1) {
        await delay(retryOpts.delayMs);
      }
    }
    throw lastErr;
    // tslint:disable-next-line:no-any (casting as any to preserve original function type)
  }) as any) as T;
}

/**
 * Attempts to get a truthy response from task no more than maxAttempts times before
 * throwing an error. If the task is successful, it will return the result of the
 * successful task. If all attempts fail, it will throw an error indicating as such.
 *
 * @param {AsyncFunction} fn - An async function to retry.
 * @param {BaseRetryOpts} opts
 *     - maxAttempts - The number of attempts to make before giving up.
 *     - delayMs - The time to wait between retries, in milliseconds. The default is 0.
 * @returns A wrapped version of fn that performs retries on falsey results
 */
export function until<
  // tslint:disable-next-line:no-any (need to support arbitrary args)
  T extends (...args: any[]) => Promise<any>
>(fn: T, retryOpts: BaseRetryOpts): T {
  // tslint:disable-next-line:no-any (need to support arbitrary args)
  return (async (...args: any[]): Promise<any> => {
    for (let i = 0; i < retryOpts.maxAttempts; ++i) {
      const result = await fn(...args);
      if (!!result) {
        return result;
      }
      if (retryOpts.delayMs) {
        await delay(retryOpts.delayMs);
      }
    }
    throw new Error(`Could not complete function within ${retryOpts.maxAttempts} attempts`);
  }) as T;
}
