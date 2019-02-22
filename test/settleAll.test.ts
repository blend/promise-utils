import test from 'ava';

import * as promiseUtils from '../src/index';

test('returns settled promise values in order when no errFn provided', async t => {
  const testPromises: Promise<any>[] = [
    promiseUtils.invert(promiseUtils.delay(500, null), 'delayed error'),
    promiseUtils.delay(500, { success: true }),
    Promise.resolve(3),
    Promise.reject(new Error('failed')),
    Promise.resolve('success'),
    Promise.reject('also failed'),
  ];
  const res = await promiseUtils.settleAll(testPromises);
  t.deepEqual(res, {
    errors: [new Error('delayed error'), new Error('failed'), 'also failed'],
    results: [{ success: true }, 3, 'success'],
  });
});

test('runs and returns result of errFn on failed promises', async t => {
  const testPromises: Promise<any>[] = [
    Promise.resolve('a'),
    Promise.reject(new Error('errorA')),
    Promise.reject(new Error('errorB')),
    Promise.resolve('b'),
  ];
  const errFn = (err: Error) => err.message;
  const res = await promiseUtils.settleAll(testPromises, errFn);
  t.deepEqual(res, {
    errors: ['errorA', 'errorB'],
    results: ['a', 'b'],
  });
});

test('handles empty promise array', async t => {
  const res = await promiseUtils.settleAll([]);
  t.deepEqual(res, {
    errors: [],
    results: [],
  });
});
