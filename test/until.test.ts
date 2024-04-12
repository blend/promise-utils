import * as sinon from 'sinon';

import test from 'ava';

import * as delay from '../src/delay';
import * as promiseUtils from '../src/index';

const sandbox = sinon.createSandbox();

test('fails eventually', async (t) => {
  await t.throwsAsync(
    promiseUtils.until(() => Promise.resolve(0), { maxAttempts: 3 }),
    { instanceOf: Error, message: /Could not complete function within/ },
  );
});

test.serial('delays appropriately', async (t) => {
  let count = 0;
  const testFn = async () => {
    if (count++ === 0) {
      return false;
    } else {
      return true;
    }
  };
  const delayStub = sandbox.stub(delay, 'delay');

  t.true(
    await promiseUtils.until(testFn, {
      maxAttempts: 3,
      delayMs: 100,
    })(),
  );
  t.is(delayStub.callCount, 1);
  t.is(delayStub.args[0][0], 100);
});

test('succeeds on retry', async (t) => {
  let count = 0;
  const testFn = async () => {
    if (count++ === 0) {
      return false;
    } else {
      return true;
    }
  };
  t.true(await promiseUtils.until(testFn, { maxAttempts: 3 })());
});

test('currys multiple args properly', async (t) => {
  const expectedFirstArg: string = 'first';
  const expectedSecondArg: string = 'second';

  const testFn = async (firstArg: string, secondArg: string) => {
    t.is(firstArg, expectedFirstArg);
    t.is(secondArg, expectedSecondArg);
    return true;
  };

  await promiseUtils.until(testFn, { maxAttempts: 1 })(expectedFirstArg, expectedSecondArg);
});
