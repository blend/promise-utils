import * as _ from 'lodash';

import test from 'ava';

import * as promiseUtils from '../src/index';

test('returns empty array when given no input', async t => {
  const output = await promiseUtils.filter(null as any, _.identity);
  t.deepEqual(output, []);
});

test('filters arrays and maintains order', async t => {
  const input = [1, 2, 3, 4, 5, 6, 7, 8];

  let nextIndexToRelease = input.length - 1;
  const getNextIndexToRelease = () => nextIndexToRelease;

  const output = await promiseUtils.filter(input, async (value: any, index: number) => {
    // Returns in reverse order
    while (getNextIndexToRelease() !== index) {
      await promiseUtils.immediate();
    }
    nextIndexToRelease--;
    return value > 3;
  });
  t.deepEqual(output, [4, 5, 6, 7, 8]);
});

test('filters arrays with indices and maintains order', async t => {
  const input = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

  let nextIndexToRelease = input.length - 1;
  const getNextIndexToRelease = () => nextIndexToRelease;

  const output = await promiseUtils.filter(input, async (value: any, index: number) => {
    // Returns in reverse order
    while (getNextIndexToRelease() !== index) {
      await promiseUtils.immediate();
    }
    nextIndexToRelease--;
    return index % 2 === 0;
  });
  t.deepEqual(output, ['a', 'c', 'e', 'g']);
});

test('filters objects with numeric keys', async t => {
  const input = { 1: 'asdf', 2: 'abcd' };
  const output = await promiseUtils.filter(input, async (value, i) => {
    return (i as any) === 1 || (i as any) === 2;
  });
  t.deepEqual(output, []);
});

test('filters objects', async t => {
  const input = { a: 1, b: 2, c: 3 };
  const output = await promiseUtils.filter(input, async (value: any) => {
    return value > 1;
  });
  t.deepEqual(output, [2, 3]);
});

test('filters objects without keys', async t => {
  const input = { a: 1, b: 2, c: 3 };
  const output = await promiseUtils.filter(input, async (value: any, key: any) => {
    return key !== 'b';
  });
  t.deepEqual(output, [1, 3]);
});
