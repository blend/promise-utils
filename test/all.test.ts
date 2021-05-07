import test from 'ava';

import * as promiseUtils from '../src/index';

test('throws errors in order with multiple errors', async t => {
  const testPromises: Promise<any>[] = [
    promiseUtils.invert(promiseUtils.delay(500, null), 'delayed error'),
    promiseUtils.delay(500, { success: true }),
    Promise.resolve(3),
    Promise.reject(new Error('failed')),
    Promise.resolve('success'),
    Promise.reject('also failed'),
  ];
  const err = await promiseUtils.invert(promiseUtils.all(testPromises));
  t.is(err.message, 'delayed error... and 2 other errors');
  t.deepEqual(err.otherErrors, [new Error('failed'), 'also failed']);
});

test('returns values in order of array not execution speed', async t => {
  const testPromises: Promise<any>[] = [
    promiseUtils.delay(500, { success: true }),
    Promise.resolve(3),
    Promise.resolve('success'),
  ];
  const res = await promiseUtils.all(testPromises);
  t.deepEqual(res, [{ success: true }, 3, 'success']);
});

test('throws single error', async t => {
  const testPromises: Promise<any>[] = [
    Promise.reject(new Error('failed')),
    Promise.resolve('success'),
  ];
  const err = await promiseUtils.invert(promiseUtils.all(testPromises));
  t.deepEqual(err, new Error('failed'));
});

test('settles null value', async t => {
  const res = await promiseUtils.all(null as any);
  t.deepEqual(res, []);
});

test('works for results', async t => {
  const testPromises: Promise<any>[] = [Promise.resolve('a'), Promise.resolve('b')];
  const res = await promiseUtils.all(testPromises);
  t.deepEqual(res, ['a', 'b']);
});

test('handles empty promise array', async t => {
  const res = await promiseUtils.all([]);
  t.deepEqual(res, []);
});
