/**
 * Caches the results of an async function. It takes a synchronous hasher that uses the input to
 * the function to determine when to return a memoized result.
 *
 * If no hash function is specified, the first argument is used as a hash key, which may work
 * reasonably if it is a string or a data type that converts to a distinct string. Note that objects
 * and arrays will not behave reasonably. Neither will cases where the other arguments are
 * significant. In such cases, specify your own hash function.
 *
 * WARNING: This function uses memory for each unique hasher output and does not clean it up, even
 * after the timeout has passed. If you have many unique values that could hash and they shift over
 * time, you will need to manage the memory of the map. The return of this function does expose
 * memory management operations; if this sounds like your use case, setInterval(memoizedFn.clear,
 * timeoutMs) is a good starting point.
 *
 * @param {AsyncFunction} fn - The async function to proxy and cache results from.
 * @param {Function} hasher - An optional function for generating a custom hash for storing
 *     results. It has all the arguments applied to it and must be synchronous.
 * @returns a memoized version of fn
 */
// tslint:disable:no-any defining it this way is more precise than Function so is still preferable
export function memoize<FnType extends (...args: any[]) => Promise<any>>(
  fn: FnType,
  // tslint:disable:no-any hasher can return any value that can be used as a map key
  hasher: (...args: Parameters<FnType>) => any = (...args) => args[0],
  timeoutMs?: number,
): FnType & { reset: FnType; clear: () => void } {
  // tslint:disable:no-any (unfortunately we can't give the FnType any more clarity or it limits
  // what you can do with it)
  const memos: Map<any, { value: any; expiration: number }> = new Map();
  const queues: Map<any, Promise<any>> = new Map();

  const returnFn = ((async (...args: Parameters<FnType>): Promise<any> => {
    const key = hasher(...args);
    if (memos.has(key)) {
      if (!timeoutMs || Date.now() < memos.get(key)!.expiration) {
        return memos.get(key)!.value;
      }
    }

    if (queues.has(key)) {
      return await queues.get(key)!;
    }

    const promise = fn(...args);
    queues.set(key, promise);

    try {
      const ret = await queues.get(key)!;
      memos.set(key, { value: ret, expiration: Date.now() + (timeoutMs || 0) });
      return ret;
    } finally {
      queues.delete(key);
    }
  }) as any) as FnType;

  const reset = (...args: Parameters<FnType>): void => {
    const key = hasher(...args);
    if (memos.has(key)) {
      memos.delete(key);
    }
  };

  const clear = (): void => {
    memos.clear();
  };

  (returnFn as any).reset = reset;
  (returnFn as any).clear = clear;

  return returnFn as FnType & { reset: FnType; clear: () => void };
  // tslint:enable:no-any (unfortunately we can't give the FnType any more clarity or it limits what
  // you can do with it)
}
