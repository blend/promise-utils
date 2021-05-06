import { settleAll } from './settleAll';

/**
 * Attempts to resolve all promises in promises in parallel.
 * This does essentially what `Promise.all` does, but we have found that Promise.all
 * is unsafe when multiple promises reject. This will handle failures appropriately,
 * though it will defer handling until the last promise has resolved/rejected.
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
      const otherErrors = [];
      for (let i = 1; i < intermediateResults.errors.length; ++i) {
        otherErrors.push(intermediateResults.errors[i]);
      }
      // tslint:disable-next-line:no-any (intentionally augmenting error)
      (primaryError as any).otherErrors = otherErrors;
    }
    throw primaryError;
  }

  return intermediateResults.results;
}
