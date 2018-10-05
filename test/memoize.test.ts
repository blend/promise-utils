import * as _ from 'lodash';
import * as sinon from 'sinon';

import { TestContext, default as test } from 'ava';

import * as promiseUtils from '../src/index';

const sandbox = sinon.createSandbox();

test('stores values', async (t: TestContext): Promise<void> => {
  const fnToMemoize = sandbox
    .stub()
    .onFirstCall()
    .returns('correct');
  const memoized = promiseUtils.memoize(fnToMemoize);

  const ret = await promiseUtils.map(_.range(100), val => memoized('identical'));
  _.each(ret, val => t.is(val, 'correct'));
});

test('honors hasher', async (t: TestContext): Promise<void> => {
  const fnToMemoize = sandbox
    .stub()
    .onFirstCall()
    .returns('first');
  const memoized = promiseUtils.memoize(fnToMemoize);

  const ret = await promiseUtils.map(_.range(100), val => memoized(val));
  const cacheCount = _.filter(ret, val => val === 'first').length;
  t.is(cacheCount, 1);
});

test('typescript def works for multiple args', async (t: TestContext): Promise<void> => {
  let count = 0;
  async function stuffToMemoize(a: string, b: number): Promise<boolean> {
    if (count === 0) {
      ++count;
      return true;
    }
    return false;
  }

  const memoized = promiseUtils.memoize(stuffToMemoize);

  const ret = await promiseUtils.map(_.range(100), async val => memoized(`${val}`, 1));
  const cacheCount = _.filter(ret).length;
  t.is(cacheCount, 1);
});

test('honors user provided hasher', async (t: TestContext): Promise<void> => {
  const fnToMemoize = sandbox
    .stub()
    .onFirstCall()
    .returns('first');
  const memoized = promiseUtils.memoize(fnToMemoize, () => 1);

  const ret = await promiseUtils.map(_.range(100), memoized);
  const cacheCount = _.filter(ret, val => val === 'first').length;
  t.is(cacheCount, 100);
});

test('uses memos on subsequent calls (tested by coverage)', async (t: TestContext): Promise<
  void
> => {
  const fnToMemoize = sandbox
    .stub()
    .onFirstCall()
    .returns('first');
  const memoized = promiseUtils.memoize(fnToMemoize, () => 1);

  const ret = await promiseUtils.map(_.range(100), val => memoized(val));
  const cacheCount = _.filter(ret, val => val === 'first').length;
  t.is(cacheCount, 100);
  const ret2 = await promiseUtils.map(_.range(100), memoized);
  const cacheCount2 = _.filter(ret2, val => val === 'first').length;
  t.is(cacheCount2, 100);
});
