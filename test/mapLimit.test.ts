import * as _ from 'lodash';

import { TestContext, default as test } from 'ava';

import * as promiseUtils from '../src/index';

test('returns all values', async (t: TestContext): Promise<void> => {
  const output = await promiseUtils.mapLimit(_.range(10), 5, async n => n * n);
  t.deepEqual(output, _.map(_.range(10), n => n * n));
});

test('handles null input group', async (t: TestContext): Promise<void> => {
  const output = await promiseUtils.mapLimit(null as any, 5, _.identity);
  t.deepEqual(output, []);
});

test('handles empty input group', async (t: TestContext): Promise<void> => {
  const output = await promiseUtils.mapLimit([], 5, _.identity);
  t.deepEqual(output, []);
});
