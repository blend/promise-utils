/**
 * Caches the results of an async function. When creating a hash to store function results against,
 * the callback is omitted from the hash and an optional hash function can be used.
 *
 * If no hash function is specified, the first argument is used as a hash key, which may work
 * reasonably if it is a string or a data type that converts to a distinct string. Note that objects
 * and arrays will not behave reasonably. Neither will cases where the other arguments are
 * significant. In such cases, specify your own hash function.
 *
 * @param {AsyncFunction} fn - The async function to proxy and cache results from.
 * @param {Function} hasher - An optional function for generating a custom hash for storing
 *     results. It has all the arguments applied to it and must be synchronous.
 * @returns a memoized version of fn
 */
export function memoize<FnType extends Function>(
  fn: FnType,
  // tslint:disable-next-line:no-any (w/o type for Function args, can't assert a type here)
  hasher: Function = (arg: any) => arg,
  timeoutMs?: number,
): FnType {
  // tslint:disable:no-any (unfortunately we can't give the FnType any more clarity or it limits
  // what you can do with it)
  const memos: Map<any, { value: any; expiration: number }> = new Map();
  const queues: Map<any, Promise<any>> = new Map();

  return ((async (...args: any[]): Promise<any> => {
    const key: any = hasher(...args);
    if (memos.has(key)) {
      if (!timeoutMs || Date.now() < memos.get(key)!.expiration) {
        return memos.get(key)!.value;
      }
    }

    if (queues.has(key)) {
      return await queues.get(key)!;
    }

    const promise: Promise<any> = fn(...args);
    queues.set(key, promise);

    try {
      const ret: any = await queues.get(key)!;
      memos.set(key, { value: ret, expiration: Date.now() + (timeoutMs || 0) });
      return ret;
    } finally {
      queues.delete(key);
    }
  }) as any) as FnType;
  // tslint:enable:no-any (unfortunately we can't give the FnType any more clarity or it limits what
  // you can do with it)
}
