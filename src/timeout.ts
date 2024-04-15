/**
 * Sets a time limit on an asynchronous function. If the function does return within
 * the specified milliseconds, it will throw a timeout error.
 *
 * WARNING: due to limitations of node, this does not actually abort the pending promise. If you
 * need to prevent continuation of the operations within the function, you need to essentially
 * create progress checkers that determine whether the function should terminate if sufficient time
 * has passed.
 *
 * @param {AsyncFunction} fn - The async function to limit in time.
 * @param {number} expirationTime - The specified time limit.
 * @param {string} errorMessage - The message that should be sent if the function times out
 * @returns Returns a wrapped function that will throw an error if it takes too long. Invoke this
 *     function with the same parameters as you would fn.
 */
export function timeout<T extends Function>(
  fn: T,
  expirationTime: number,
  errorMessage?: string
): T {
  errorMessage =
    errorMessage || `Could not resolve ${fn.name || '<anonymous>'} within ${expirationTime} ms`;
  // tslint:disable-next-line:typedef no-any (typedef is hacked because we're hijacking fn)
  return (async function race(this: any) {
    return Promise.race([
      new Promise((__: Function, reject: Function): void => {
        setTimeout((): void => reject(new Error(errorMessage)), expirationTime);
      }) as Promise<never>,
      fn.apply(this, arguments),
    ]);
    // tslint:disable-next-line:no-any (need to cast to any because we hacked together the typedef)
  } as any) as T;
}
