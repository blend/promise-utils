import test from 'ava';

import * as promiseUtils from '../src/index';

test('resolves appropriate value when function finishes first', async t => {
  const ret = await promiseUtils.timeout(
    () => true,
    1000,
    'Test function did not complete within 1 second'
  )();
  t.is(ret, true);
});

test('handles argument passing appropriately', async t => {
  const ret = await promiseUtils.timeout(
    async (a: string, b: string, c: string) => promiseUtils.immediate(b),
    1000,
    'Test function did not complete within 1 second'
  )('who cares', 'really important', 'garbage');
  t.is(ret, 'really important');
});

test('throws errors when delays are too long', async t => {
  const ret = await promiseUtils.invert(
    promiseUtils.timeout(
      async () => promiseUtils.delay(50, undefined),
      0,
      'Test function completed too fast!'
    )()
  );
  t.is(ret.message, 'Test function completed too fast!');
});

test('uses default error message', async t => {
  const ret = await promiseUtils.invert(
    promiseUtils.timeout(async () => promiseUtils.delay(50, undefined), 0)()
  );
  t.is(ret.message, 'Could not resolve <anonymous> within 0 ms');
});

test('default error message uses function name', async t => {
  const ret = await promiseUtils.invert(
    promiseUtils.timeout(async function delay() {
      await promiseUtils.delay(50, undefined);
    }, 0)()
  );
  t.is(ret.message, 'Could not resolve delay within 0 ms');
});
