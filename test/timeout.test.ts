import { TestContext, default as test } from 'ava';

import * as promiseUtils from '../src/index';

test('resolves appropriate value when function finishes first', async (t: TestContext): Promise<
  void
> => {
  const ret = await promiseUtils.timeout(
    () => true,
    1000,
    'Test function did not complete within 1 second',
  )();
  t.is(ret, true);
});

test('handles argument passing appropriately', async (t: TestContext): Promise<void> => {
  const ret = await promiseUtils.timeout(
    async (a: string, b: string, c: string) => promiseUtils.immediate(b),
    1000,
    'Test function did not complete within 1 second',
  )('who cares', 'really important', 'garbage');
  t.is(ret, 'really important');
});

test('throws errors when delays are too long', async (t: TestContext): Promise<void> => {
  const ret = await promiseUtils.invert(
    promiseUtils.timeout(
      async () => promiseUtils.delay(50, undefined),
      0,
      'Test function completed too fast!',
    )(),
    'Race should have failed!',
  );
  t.is(ret.message, 'Test function completed too fast!');
});
