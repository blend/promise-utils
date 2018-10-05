import * as _ from 'lodash';

export function memoize<FnType extends Function>(
  fn: FnType,
  hasher: Function = _.identity,
): FnType {
  // tslint:disable:no-any (unfortunately we can't give the FnType any more clarity or it limits
  // what you can do with it)
  const memos: Map<any, any> = new Map();
  const queues: Map<any, Promise<any>> = new Map();

  return ((async (...args: any[]): Promise<any> => {
    const key: any = hasher(...args);
    if (memos.has(key)) {
      return memos.get(key)!;
    } else if (queues.has(key)) {
      return await queues.get(key)!;
    }

    const promise: Promise<any> = fn(...args);
    queues.set(key, promise);

    try {
      const ret: any = await queues.get(key)!;
      memos.set(key, ret);
      return ret;
    } finally {
      queues.delete(key);
    }
  }) as any) as FnType;
  // tslint:enable:no-any (unfortunately we can't give the FnType any more clarity or it limits what
  // you can do with it)
}
