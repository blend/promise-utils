import * as _ from 'lodash';

// tslint:disable-next-line:no-any (returns the rejection which is untyped)
export async function invert<T>(promise: Promise<T>, message: string): Promise<any> {
  return promise.then(
    (res: T): void => { throw new Error(message); },
    _.identity,
  );
}
