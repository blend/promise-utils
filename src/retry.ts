import * as _ from 'lodash';

import { delay } from './delay';

export interface RetryOpts {
  maxAttempts: number;
  isRetryable?: (err: Error) => boolean;
  delayMs?: number;
}

export function retry<T extends Function>(fn: T, retryOpts: RetryOpts): T {
  // tslint:disable-next-line:no-any (casting as any to preserve original function type)
  return (async (...args: any[]): Promise<any> => {
    let lastErr: Error = new Error(`Could not complete function within ${retryOpts.maxAttempts}`);
    for (const __ of _.range(retryOpts.maxAttempts)) {
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
  }) as any as T;
}
