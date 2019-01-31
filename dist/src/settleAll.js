"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const map_1 = require("./map");
/**
 * Attempts to settle all promises in promises in parallel, calling errFn when a promise rejects.
 * Similar to Promise.all, but does not fail fast. For resolved promises, the result array contains
 * the resolved value at the same index as the promise. For rejected promises, the result array
 * contains the return value of errFn at the same index as the promise.
 *
 * @param {Promise<T>[]} promises - An array of promises to attempt to settle.
 * @param {Function} errFn - The function to call when a promise rejects.
 *
 * @returns A list of resolved and rejected values of promises.
 */
async function settleAll(promises, 
// tslint:disable-next-line:no-any
errFn = _.identity) {
    const res = { errors: [], results: [] };
    await map_1.map(promises, async (p) => {
        try {
            res.results.push(await p);
        }
        catch (err) {
            res.errors.push(errFn(err));
        }
    });
    return res;
}
exports.settleAll = settleAll;
//# sourceMappingURL=settleAll.js.map