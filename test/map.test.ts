import * as _ from 'lodash';

import { TestContext, default as test } from 'ava';

import * as promiseUtils from '../src/index';

test('returns all values', async (t: TestContext): Promise<void> => {
  const output = await promiseUtils.map(_.range(10), async n => n * n);
  t.deepEqual(output, _.map(_.range(10), n => n * n));
});

test('handles null input group', async (t: TestContext): Promise<void> => {
  const output = await promiseUtils.map(null as any, _.identity);
  t.deepEqual(output, []);
});

test('handles empty input group', async (t: TestContext): Promise<void> => {
  const output = await promiseUtils.map([], _.identity);
  t.deepEqual(output, []);
});
