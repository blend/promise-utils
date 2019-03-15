import * as _ from 'lodash';
import * as sinon from 'sinon';

import test from 'ava';

import * as promiseUtils from '../src/index';

const sandbox = sinon.createSandbox();

test('stores values', async t => {
  const fnToMemoize = sandbox
    .stub()
    .onFirstCall()
    .returns('correct');
  const memoized = promiseUtils.memoize(fnToMemoize);

  const ret = await promiseUtils.map(_.range(100), val => memoized('identical'));
  _.each(ret, val => t.is(val, 'correct'));
});

test('honors hasher', async t => {
  const fnToMemoize = sandbox
    .stub()
    .onFirstCall()
    .returns('first');
  const memoized = promiseUtils.memoize(fnToMemoize);

  const ret = await promiseUtils.map(_.range(100), val => memoized(val));
  const cacheCount = _.filter(ret, val => val === 'first').length;
  t.is(cacheCount, 1);
});

test('typescript def works for multiple args', async t => {
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

test('honors user provided hasher', async t => {
  const fnToMemoize = sandbox
    .stub()
    .onFirstCall()
    .returns('first');
  const memoized = promiseUtils.memoize(fnToMemoize, () => 1);

  const ret = await promiseUtils.map(_.range(100), memoized);
  const cacheCount = _.filter(ret, val => val === 'first').length;
  t.is(cacheCount, 100);
});

test('uses memos on subsequent calls (tested by coverage)', async t => {
  const fnToMemoize = sandbox
    .stub()
    .onFirstCall()
    .returns('first')
    .onSecondCall()
    .throws(new Error('this should not happen'));
  const memoized = promiseUtils.memoize(fnToMemoize, () => 1);

  const ret = await promiseUtils.map(_.range(100), val => memoized(val));
  const cacheCount = _.filter(ret, val => val === 'first').length;
  t.is(cacheCount, 100);
  const ret2 = await promiseUtils.map(_.range(100), memoized);
  const cacheCount2 = _.filter(ret2, val => val === 'first').length;
  t.is(cacheCount2, 100);
});

test('reset resets a memo', async t => {
  const fnToMemoize = sandbox
    .stub()
    .onFirstCall()
    .returns('first')
    .onSecondCall()
    .returns('second')
    .onThirdCall()
    .returns('third');
  const memoized = promiseUtils.memoize(fnToMemoize);

  const ret = await promiseUtils.map(_.range(100), val => memoized(1));
  const ret2 = await promiseUtils.map(_.range(100), val => memoized(2));
  const cacheCount = _.filter(ret, val => val === 'first').length;
  const cacheCount2 = _.filter(ret2, val => val === 'second').length;
  t.is(cacheCount, 100);
  t.is(cacheCount2, 100);
  memoized.reset(1);
  const ret3 = await promiseUtils.map(_.range(100), val => memoized(2));
  const ret4 = await promiseUtils.map(_.range(100), val => memoized(1));
  const cacheCount3 = _.filter(ret3, val => val === 'second').length;
  const cacheCount4 = _.filter(ret4, val => val === 'third').length;
  t.is(cacheCount3, 100);
  t.is(cacheCount4, 100);
});

test('clear resets all memos', async t => {
  const fnToMemoize = sandbox
    .stub()
    .onFirstCall()
    .returns('first')
    .onSecondCall()
    .returns('second')
    .onThirdCall()
    .returns('third')
    .onCall(3)
    .returns('fourth');
  const memoized = promiseUtils.memoize(fnToMemoize);

  const ret = await promiseUtils.map(_.range(100), val => memoized(1));
  const ret2 = await promiseUtils.map(_.range(100), val => memoized(2));
  const cacheCount = _.filter(ret, val => val === 'first').length;
  const cacheCount2 = _.filter(ret2, val => val === 'second').length;
  t.is(cacheCount, 100);
  t.is(cacheCount2, 100);
  memoized.clear();
  const ret3 = await promiseUtils.map(_.range(100), val => memoized(2));
  const ret4 = await promiseUtils.map(_.range(100), val => memoized(1));
  const cacheCount3 = _.filter(ret3, val => val === 'third').length;
  const cacheCount4 = _.filter(ret4, val => val === 'fourth').length;
  t.is(cacheCount3, 100);
  t.is(cacheCount4, 100);
});

test('uses memos on subsequent calls with timeout', async t => {
  const fnToMemoize = sandbox
    .stub()
    .onFirstCall()
    .returns('first')
    .onSecondCall()
    .throws(new Error('this should not happen'));
  const memoized = promiseUtils.memoize(fnToMemoize, () => 1, 1000);

  const ret = await promiseUtils.mapLimit(_.range(100), 100, val => memoized(val));
  const cacheCount = _.filter(ret, val => val === 'first').length;
  t.is(cacheCount, 100);
  const ret2 = await promiseUtils.mapLimit(_.range(100), 100, memoized);
  const cacheCount2 = _.filter(ret2, val => val === 'first').length;
  t.is(cacheCount2, 100);
});

test('invalidates cache after timeout', async t => {
  const fnToMemoize = sandbox
    .stub()
    .onFirstCall()
    .returns('first')
    .onSecondCall()
    .throws(new Error('should throw here'));
  const memoized = promiseUtils.memoize(fnToMemoize, () => 1, 100);
  const clock = sinon.useFakeTimers();

  const ret = await promiseUtils.map(_.range(100), memoized);
  const cacheCount = _.filter(ret, val => val === 'first').length;
  t.is(cacheCount, 100);

  clock.tick(200);
  const err = await promiseUtils.invert(memoized(1), 'Not correctly invalidating expect');
  t.is(err.message, 'should throw here');

  clock.restore();
});
