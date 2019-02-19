import test from 'ava';

import * as promiseUtils from '../src/index';

test('throws error when promise resolves', async t => {
  try {
    await promiseUtils.invert(Promise.resolve('test'), 'Should not resolve');
    t.fail('The promise did not reject');
  } catch (err) {
    t.is(err.message, 'Should not resolve');
  }
});

test('uses default message', async t => {
  try {
    await promiseUtils.invert(Promise.resolve('test'));
    t.fail('The promise did not reject');
  } catch (err) {
    t.is(err.message, 'Expected promise to reject');
  }
});

test('returns reject value when promise rejects', async t => {
  const ret: any = await promiseUtils.invert(Promise.reject('test'), 'Should not resolve');
  t.is(ret, 'test');
});
