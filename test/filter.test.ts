import * as _ from 'lodash';

import test from 'ava';

import * as promiseUtils from '../src/index';

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

test('returns empty array when given no input', async t => {
  const output = await promiseUtils.filter(null as any, _.identity);
  t.deepEqual(output, []);
});

test('filters arrays and maintains order', async t => {
  const input = [1, 2, 3, 4, 5, 6, 7, 8];
  const output = await promiseUtils.filter(input, async (value: any) => {
    await delay(_.random(5000)); // Add a variable delay to ensure we don't maintain order by luck
    return value > 3;
  });
  t.deepEqual(output, [4, 5, 6, 7, 8]);
});

test('filters arrays with indices and maintains order', async t => {
  const input = [1, 2, 3, 4, 5, 6, 7, 8];
  const output = await promiseUtils.filter(input, async (value: any, i: number) => {
    await delay(_.random(5000)); // Add a variable delay to ensure we don't maintain order by luck
    return i % 2 === 0;
  });
  t.deepEqual(output, [1, 3, 5, 7]);
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
