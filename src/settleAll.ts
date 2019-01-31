import * as _ from 'lodash';
import { map } from './map';

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
export async function settleAll<T, V>(
  promises: Promise<T>[],
  // tslint:disable-next-line:no-any
  errFn: (err: Error) => V = _.identity,
): Promise<{ errors: V[]; results: T[] }> {
  const res: { errors: V[]; results: T[] } = { errors: [], results: [] };
  await map(promises, async (p: Promise<T>) => {
    try {
      res.results.push(await p);
    } catch (err) {
      res.errors.push(errFn(err));
    }
  });
  return res;
}
