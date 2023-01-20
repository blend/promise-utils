const DEFAULT_MAP_PARALLELISM = 10;

/**
 * Produces a new collection of values by mapping each value in coll through the async iteratee
 * function. The iteratee is called with an item from coll and the key (or index) of that item.
 *
 * Note, that since this function applies the iteratee to each item in parallel, there is no
 * guarantee that the iteratee functions will complete in order. However, the results array will be
 * in the same order as the original coll.
 *
 * WARNING: because of how the iteratee is applied, there is a possibility that if your
 * input is an array of promises, they could be settled before the iteratee is applied - if they
 * reject in this scenario, it would result in an unhandledRejection. As such, you should use
 * settleAll to deal with arrays of promises, which will avoid this scenario.
 *
 * @param {Array | Iterable | Object} input - A collection to iterate over.
 * @param {AsyncFunction} iteratee - An async function to apply to each item in coll. The iteratee
 *     should return the transformed item. Invoked with (item, key).
 */
export async function map<T, V>(
  input: readonly T[],
  iteratee: (value: T, index: number) => Promise<V>,
): Promise<V[]>;
export async function map<T, V>(
  input: readonly T[],
  iteratee: (value: T) => Promise<V>,
): Promise<V[]>;
export async function map<T extends Object, V>(
  input: T,
  iteratee: (value: T[keyof T], key: string) => Promise<V>,
): Promise<V[]>;
export async function map<T extends Object, V>(
  input: T,
  iteratee: (value: T[keyof T]) => Promise<V>,
): Promise<V[]>;
// tslint:disable-next-line:no-any (types are enforced by overload signatures, validated by tests)
export async function map(input: any, iteratee: any): Promise<any[]> {
  return mapLimit(input, DEFAULT_MAP_PARALLELISM, iteratee);
}

/**
 * The same as map but runs a maximum of limit async operations at a time with the same ordering
 * guarantees.
 *
 * @param {Array | Iterable | Object} input - A collection to iterate over.
 * @param {number} limit - The maximum number of async operations at a time.
 * @param {AsyncFunction} iteratee - An async function to apply to each item in coll. The iteratee
 *     should complete with the transformed item. Invoked with (item, key).
 */
export async function mapLimit<T, V>(
  input: readonly T[],
  limit: number,
  iteratee: (value: T, index: number) => Promise<V>,
): Promise<V[]>;
export async function mapLimit<T, V>(
  input: readonly T[],
  limit: number,
  iteratee: (value: T) => Promise<V>,
): Promise<V[]>;
export async function mapLimit<T extends Object, V>(
  input: T,
  limit: number,
  iteratee: (value: T[keyof T], key: string) => Promise<V>,
): Promise<V[]>;
export async function mapLimit<T extends Object, V>(
  input: T,
  limit: number,
  iteratee: (value: T[keyof T]) => Promise<V>,
): Promise<V[]>;
// tslint:disable-next-line:no-any (types are enforced by overload signatures, validated by tests)
export async function mapLimit<V>(input: any, limit: number, iteratee: any): Promise<V[]> {
  if (!input) {
    return [];
  }

  const isArray = Array.isArray(input);
  const size = (() => {
    if (isArray) {
      return input.length;
    }

    let count = 0;
    for (const __ in input) {
      ++count;
    }
    return count;
  })();

  const allValues = new Array(size);
  const results = new Array(size);

  let i = 0;
  for (const key in input) {
    const possiblyNumericKey = isArray ? i : key;
    allValues[size - 1 - i] = [input[key], i, possiblyNumericKey];
    ++i;
  }

  const execute = async () => {
    while (allValues.length > 0) {
      // tslint:disable-next-line:no-any
      const [val, index, key] = allValues.pop();
      results[index] = await iteratee(val, key);
    }
  };

  const allExecutors = [];
  for (let j = 0; j < limit; ++j) {
    allExecutors.push(execute());
  }
  await Promise.all(allExecutors);

  return results;
}

/**
 * The same as mapLimit but with only 1 operation at a time, and maintains the ordering guarantees
 * of map.
 *
 * @param {Array | Iterable | Object} input - A collection to iterate over.
 * @param {AsyncFunction} iteratee - An async function to apply to each item in coll. The iteratee
 *     should complete with the transformed item. Invoked with (item, key).
 */
export async function mapSeries<T, V>(
  input: readonly T[],
  iteratee: (value: T, index: number) => Promise<V>,
): Promise<V[]>;
export async function mapSeries<T, V>(
  input: readonly T[],
  iteratee: (value: T) => Promise<V>,
): Promise<V[]>;
export async function mapSeries<T extends Object, V>(
  input: T,
  iteratee: (value: T[keyof T], key: string) => Promise<V>,
): Promise<V[]>;
export async function mapSeries<T extends Object, V>(
  input: T,
  iteratee: (value: T[keyof T]) => Promise<V>,
): Promise<V[]>;
// tslint:disable-next-line:no-any (types are enforced by overload signatures, validated by tests)
export async function mapSeries(input: any, iteratee: any): Promise<any[]> {
  return mapLimit(input, 1, iteratee);
}

/**
 * The same as map but will flatten the results.
 *
 * @param {Array | Iterable | Object} input - A collection to iterate over.
 * @param {AsyncFunction} iteratee - An async function to apply to each item in coll. The iteratee
 *     should complete with the transformed item. Invoked with (item, key).
 */
export async function flatMap<T, V>(
  input: readonly T[],
  iteratee: (value: T, index: number) => Promise<V | V[]>,
): Promise<V[]>;
export async function flatMap<T, V>(
  input: readonly T[],
  iteratee: (value: T) => Promise<V | V[]>,
): Promise<V[]>;
export async function flatMap<T extends Object, V>(
  input: T,
  iteratee: (value: T[keyof T], key: string) => Promise<V | V[]>,
): Promise<V[]>;
export async function flatMap<T extends Object, V>(
  input: T,
  iteratee: (value: T[keyof T]) => Promise<V | V[]>,
): Promise<V[]>;
// tslint:disable-next-line:no-any (types are enforced by overload signatures, validated by tests)
export async function flatMap(input: any, iteratee: any): Promise<any[]> {
  if (!input) {
    return [];
  }
  let output = [];
  const nestedOutput = await map(input, iteratee);
  for (const partialOutput of nestedOutput) {
    // tslint:disable-next-line:no-any (could possibly be an array)
    if (partialOutput && (partialOutput as any).length !== undefined) {
      // tslint:disable-next-line:no-any (is definitely an array)
      output = output.concat(partialOutput) as any[];
    } else {
      output.push(partialOutput);
    }
  }
  return output;
}
