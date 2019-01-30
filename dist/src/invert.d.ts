/**
 * Inverts the given promise - i.e. throws an error if it completes successfully and returns the
 * error if it throws one.
 *
 * @param {Promise} promise - the promise to invert
 * @param {string} message - the message to throw if the promise resolves
 * @returns the error thrown by the promise
 */
export declare function invert<T>(promise: Promise<T>, message: string): Promise<any>;
