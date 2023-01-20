import test from 'ava';
import * as _ from 'lodash';

import * as promiseUtils from '../src/index';

test('returns all values', async t => {
  const output = await promiseUtils.flatMap(_.range(10), async n => n * n);
  t.deepEqual(output, _.flatMap(_.range(10), n => n * n));
});

test('flattens', async t => {
  const output = await promiseUtils.flatMap(_.range(10), async n => [n, n]);
  t.deepEqual(output, _.flatMap(_.range(10), n => [n, n]));
});

test('ignores empty arrays', async t => {
  const output = await promiseUtils.flatMap(_.range(10), async n => (n % 2 === 0 ? [] : [n, n]));
  t.deepEqual(output, _.flatMap(_.range(10), n => (n % 2 === 0 ? [] : [n, n])));
});

test('works for objects', async t => {
  const input = { a: 1, b: 2, c: 3, d: 4 };
  const output = await promiseUtils.map(input, async (a, b) => [b, a]);
  t.deepEqual(output, _.toPairs(input));
});

test('works for objects without keys', async t => {
  const input = { a: 1, b: 2, c: 3, d: 4 };
  const output = await promiseUtils.flatMap(input, async a => a);
  t.deepEqual(output, _.flatMap(input));
});

test('handles null input group', async t => {
  const output = await promiseUtils.flatMap(null as any, _.identity);
  t.deepEqual(output, []);
});

test('handles empty input group', async t => {
  const output = await promiseUtils.flatMap([], _.identity);
  t.deepEqual(output, []);
});

test('handles large sub-lists', async t => {
  const output = await promiseUtils.flatMap(_.range(10), async () => _.range(1_000_000));
  t.is(output.length, 10_000_000);
});
