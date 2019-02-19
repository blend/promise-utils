"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
function timeout(fn, expirationTime, errorMessage) {
    errorMessage =
        errorMessage || `Could not resolve ${fn.name || '<anonymous>'} within ${expirationTime} ms`;
    // tslint:disable-next-line:typedef no-any (typedef is hacked because we're hijacking fn)
    return async function race() {
        return Promise.race([
            new Promise((__, reject) => {
                setTimeout(() => reject(new Error(errorMessage)), expirationTime);
            }),
            fn.apply(this, arguments),
        ]);
        // tslint:disable-next-line:no-any (need to cast to any because we hacked together the typedef)
    };
}
exports.timeout = timeout;
//# sourceMappingURL=timeout.js.map