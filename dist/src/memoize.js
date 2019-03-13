"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
function memoize(fn, 
// tslint:disable-next-line:no-any (w/o type for Function args, can't assert a type here)
hasher = (arg) => arg, timeoutMs) {
    // tslint:disable:no-any (unfortunately we can't give the FnType any more clarity or it limits
    // what you can do with it)
    const memos = new Map();
    const queues = new Map();
    return (async (...args) => {
        const key = hasher(...args);
        if (memos.has(key)) {
            if (!timeoutMs || Date.now() < memos.get(key).expiration) {
                return memos.get(key).value;
            }
        }
        if (queues.has(key)) {
            return await queues.get(key);
        }
        const promise = fn(...args);
        queues.set(key, promise);
        try {
            const ret = await queues.get(key);
            memos.set(key, { value: ret, expiration: Date.now() + (timeoutMs || 0) });
            return ret;
        }
        finally {
            queues.delete(key);
        }
    });
    // tslint:enable:no-any (unfortunately we can't give the FnType any more clarity or it limits what
    // you can do with it)
}
exports.memoize = memoize;
//# sourceMappingURL=memoize.js.map