import { TestContext, default as test } from 'ava';

import * as promiseUtils from '../src/index';

test('throws error when promise resolves', async (t: TestContext): Promise<void> => {
  try {
    await promiseUtils.invert(Promise.resolve('test'), 'Should not resolve');
    t.fail('The promise did not reject');
  } catch (err) {
    t.is(err.message, 'Should not resolve');
  }
});

test('returns reject value when promise rejects', async (t: TestContext): Promise<void> => {
  const ret: any = await promiseUtils.invert(Promise.reject('test'), 'Should not resolve');
  t.is(ret, 'test');
});
