import { settleAll } from './settleAll';

/**
 * Attempts to resolve all promises in promises in parallel.
 * This does essentially what `Promise.all` does, but we have found that Promise.all
 * is unsafe when multiple promises reject. This will handle failures appropriately,
 * though it will defer handling until the last promise has resolved/rejected.
 *
 * In the case of a rejection, the thrown error will be the rejection of the first
 * promise in the array (as opposed to the first promise to be rejected temporally),
 * with all other errors attached in the `otherErrors` property.
 *
 * @param {Promise<T>[]} promises - An array of promises to attempt to resolve.
 * @returns A list of resolved values of promises.
 */
export async function all<T>(promises: readonly Promise<T>[]): Promise<T[]> {
  const intermediateResults = await settleAll(promises);
  if (intermediateResults.errors && intermediateResults.errors.length > 0) {
    const primaryError = intermediateResults.errors[0];
    if (intermediateResults.errors.length > 1 && primaryError instanceof Error) {
      primaryError.message = `${primaryError.message}... and ${intermediateResults.errors.length -
        1} other errors`;
      // tslint:disable-next-line:no-any (intentionally augmenting error)
      (primaryError as any).otherErrors = intermediateResults.errors.slice(1);
    }
    throw primaryError;
  }

  return intermediateResults.results;
}
