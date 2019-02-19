import * as _ from 'lodash';

import test from 'ava';

import * as promiseUtils from '../src/index';

test('returns all values', async t => {
  const output = await promiseUtils.map(_.range(10), async n => n * n);
  t.deepEqual(output, _.map(_.range(10), n => n * n));
});

test('runs with indices', async t => {
  const output = await promiseUtils.map(_.reverse(_.range(10)), async (n, i) => i * i);
  t.deepEqual(output, _.map(_.range(10), n => n * n));
});

test('works for objects', async t => {
  const input = { a: 1, b: 2, c: 3, d: 4 };
  const output = await promiseUtils.map(input, async (a, b) => [b, a]);
  t.deepEqual(output, _.toPairs(input));
});

test('works for objects without keys', async t => {
  const input = { a: 1, b: 2, c: 3, d: 4 };
  const output = await promiseUtils.map(input, async a => a);
  t.deepEqual(output, _.map(input));
});

test('handles null input group', async t => {
  const output = await promiseUtils.map(null as any, _.identity);
  t.deepEqual(output, []);
});

test('handles empty input group', async t => {
  const output = await promiseUtils.map([], _.identity);
  t.deepEqual(output, []);
});
