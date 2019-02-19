/**
 * Sets a time limit on an asynchronous function. If the function does return callback within
 * the specified milliseconds, it will be called with a timeout error.
 *
 * @param {AsyncFunction} fn - The async function to limit in time.
 * @param {number} expirationTime - The specified time limit.
 * @param {string} errorMessage - The message that should be sent if the function times out
 * @returns Returns a wrapped function that will throw an error if it takes too long. Invoke this
 *     function with the same parameters as you would fn.
 */
export declare function timeout<T extends Function>(fn: T, expirationTime: number, errorMessage?: string): T;
