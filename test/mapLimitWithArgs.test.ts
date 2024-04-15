import * as _ from 'lodash';

import test from 'ava';

import * as promiseUtils from '../src/index';

test('returns all values', async t => {
  const maxRangeNum = 10;
  const argNum = 2;
  const output = await promiseUtils.mapLimitWithArgs(
    _.range(maxRangeNum),
    5,
    async (n, m) => n * n * m,
    argNum,
  );
  t.deepEqual(_.sortBy(output), _.sortBy(_.map(_.range(maxRangeNum), n => n * n * argNum)));
});

test('handles null input group', async t => {
  const output = await promiseUtils.mapLimitWithArgs(null as any, 5, _.identity);
  t.deepEqual(output, []);
});

test('handles empty input group', async t => {
  const output = await promiseUtils.mapLimitWithArgs([], 5, _.identity);
  t.deepEqual(output, []);
});
