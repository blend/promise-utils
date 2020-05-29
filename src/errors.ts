/**
 * Rather than just blanket propagating errors, allows you to specify an error handler that can
 * transform it to something useful or throw a wrapped error.
 *
 * @param {Function} fn - An async function to wrap
 * @param {Function} errorHandler
 *     - a function that will process any errors produced by the original function
 *     Note that this can be used to either return something that isn't an error (for expected
 *     errors), to add additional context to an error and throw that error, or even just to create
 *     side effects for error throwing (e.g. logging)
 * @returns A wrapped version of function that uses error handler
 */
export function transformErrors<T extends Function>(fn: T, errorHandler: Function): T {
  // tslint:disable-next-line:no-any (casting as any to preserve original function type)
  return ((async (...args: any[]): Promise<any> => {
    try {
      return await fn(...args);
    } catch (err) {
      return errorHandler(err);
    }
    // tslint:disable-next-line:no-any (casting as any to preserve original function type)
  }) as any) as T;
}
