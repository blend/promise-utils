import test from 'ava';

import * as promiseUtils from '../src/index';

test('throws wrapped error', async t => {
  const err = await promiseUtils.invert(
    promiseUtils.transformErrors(
      async () => {
        throw new Error('broken');
      },
      () => {
        throw new Error('real error');
      }
    )()
  );
  t.is(err.message, 'real error');
});

test('returns a new result', async t => {
  const message = await promiseUtils.transformErrors(
    async () => {
      throw new Error('broken');
    },
    () => 'swallowed!'
  )();
  t.is(message, 'swallowed!');
});
