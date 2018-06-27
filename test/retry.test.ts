import { TestContext, default as test } from 'ava';

import * as promiseUtils from '../src/index';

test('fails eventually', async (t: TestContext): Promise<void> => {
  await t.throws(
    promiseUtils.retry(() => { throw new Error('testing failures'); }, { maxAttempts: 3 })(),
    /testing failure/,
  );
});

test('honors immediate failure scenarios', async (t: TestContext): Promise<void> => {
  let count = 0;
  const testFn = async () => {
    if (count++ === 0) {
      throw new Error('Not a retryable error');
    } else { return true; }
  };
  await t.throws(
    promiseUtils.retry(
      testFn,
      {
        maxAttempts: 3, isRetryable:
        err => err.message !== 'Not a retryable error',
      },
    )(),
    /Not a retryable error/,
  );
});

test('succeeds on retry', async (t: TestContext): Promise<void> => {
  let count = 0;
  const testFn = async () => {
    if (count++ === 0) {
      throw new Error('retryable error');
    } else { return true; }
  };
  t.true(await promiseUtils.retry(testFn, { maxAttempts: 3 })());
});
