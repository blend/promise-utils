import * as sinon from 'sinon';

import { TestContext, default as test } from 'ava';

import * as delay from '../src/delay';
import * as promiseUtils from '../src/index';

const sandbox = sinon.createSandbox();

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

test.serial('delays appropriately', async (t: TestContext): Promise<void> => {
  let count = 0;
  const testFn = async () => {
    if (count++ === 0) {
      throw new Error('first fail');
    } else {
      return true;
    }
  };
  const delayStub = sandbox.stub(delay, 'delay');

  t.true(await promiseUtils.retry(
    testFn,
    {
      maxAttempts: 3,
      delayMs: 100,
    },
  )());
  t.is(delayStub.callCount, 1);
  t.is(delayStub.args[0][0], 100);
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

test('currys multiple args properly', async (t: TestContext): Promise<void> => {
  const expectedFirstArg: string = 'first';
  const expectedSecondArg: string = 'second';

  const testFn = async (firstArg: string, secondArg: string) => {
    t.is(firstArg, expectedFirstArg);
    t.is(secondArg, expectedSecondArg);
  };

  await promiseUtils.retry(testFn, { maxAttempts: 1 })(
    expectedFirstArg,
    expectedSecondArg,
  );
});
