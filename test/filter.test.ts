import * as _ from 'lodash';

import test from 'ava';

import * as promiseUtils from '../src/index';

test('returns empty array when given no input', async t => {
  const output = await promiseUtils.filter(null as any, _.identity);
  t.deepEqual(output, []);
});

test('filters arrays', async t => {
  const input = [1, 2];
  const output = await promiseUtils.filter(input, async (value: any) => {
    return value === 2;
  });
  t.deepEqual(output, [2]);
});

test('filters arrays with indices', async t => {
  const input = [1, 2];
  const output = await promiseUtils.filter(input, async (value: any, i: number) => {
    return i === 1;
  });
  t.deepEqual(output, [2]);
});

test('filters objects with numeric keys', async t => {
  const input = { 1: 'asdf', 2: 'abcd' };
  const output = await promiseUtils.filter(input, async (value, i) => {
    return (i as any) === 1 || (i as any) === 2;
  });
  t.deepEqual(output, []);
});

test('filters objects', async t => {
  const input = { a: 1, b: 2 };
  const output = await promiseUtils.filter(input, async (value: any) => {
    return value === 2;
  });
  t.deepEqual(output, [2]);
});

test('filters objects without keys', async t => {
  const input = { a: 1, b: 2 };
  const output = await promiseUtils.filter(input, async (value: any, key: any) => {
    return key === 'b';
  });
  t.deepEqual(output, [2]);
});
