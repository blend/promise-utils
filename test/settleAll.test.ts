import test from 'ava';

import * as promiseUtils from '../src/index';

test('returns settled promise values in order when no errFn provided', async (t) => {
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

test('settles null value', async (t) => {
  const res = await promiseUtils.settleAll(null as any);
  t.deepEqual(res, {
    errors: [],
    results: [],
  });
});

test('runs and returns result of errFn on failed promises', async (t) => {
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

test('allows errFn to take an index', async (t) => {
  const testPromises: Promise<any>[] = [
    Promise.reject(new Error('errorA')),
    Promise.reject(new Error('errorB')),
    Promise.reject(new Error('errorC')),
  ];
  const errFn = (err: Error, ind: number) => `${ind}-${err.message}`;
  const res = await promiseUtils.settleAll(testPromises, errFn);
  t.deepEqual(res, {
    errors: ['0-errorA', '1-errorB', '2-errorC'],
    results: [],
  });
});

test('allows errFn to take async functions', async (t) => {
  const testPromises: Promise<any>[] = [
    Promise.reject(new Error('errorA')),
    Promise.reject(new Error('errorB')),
    Promise.reject(new Error('errorC')),
  ];
  const errFn = async (err: Error) => `async-${err.message}`;
  const res = await promiseUtils.settleAll(testPromises, errFn);
  t.deepEqual(res, {
    errors: ['async-errorA', 'async-errorB', 'async-errorC'],
    results: [],
  });
});

test('handles empty promise array', async (t) => {
  const res = await promiseUtils.settleAll([]);
  t.deepEqual(res, {
    errors: [],
    results: [],
  });
});
