import * as _ from 'lodash';

function chunkObject<T extends Object>(input: T, limit: number): Partial<T>[] {
  return _(input)
    .toPairs()
    .chunk(limit)
    // (adding types breaks the compiler, but the inferred types work just fine)
    // tslint:disable:typedef
    .map(pairList => _.reduce(
      pairList,
      (acc, pair) => _.defaults(acc, { [pair[0]]: pair[1] }),
      {} as Partial<T>,
    ))
    // tslint:enable:typedef
    .value();
}

export async function map<T, V>(
  input: T[], iteratee: (value: T, index: number) => Promise<V>,
): Promise<V[]>;
export async function map<T, V>(input: T[], iteratee: (value: T) => Promise<V>): Promise<V[]>;
export async function map<T extends Object, V>(
  input: T, iteratee: (value: T[keyof T], key: string) => Promise<V>,
): Promise<V[]>;
export async function map<T extends Object, V>(
  input: T, iteratee: (value: T[keyof T]) => Promise<V>,
): Promise<V[]>;
// tslint:disable-next-line:no-any (types are enforced by overload signatures, validated by tests)
export async function map(input: any, iteratee: any): Promise<any[]> {
  if (!input) {
    return [];
  }
  return Promise.all(_.map(input, iteratee));
}

export async function mapLimit<T, V>(
  input: T[], limit: number, iteratee: (value: T, index: number) => Promise<V>,
): Promise<V[]>;
export async function mapLimit<T, V>(
  input: T[], limit: number, iteratee: (value: T) => Promise<V>,
): Promise<V[]>;
export async function mapLimit<T extends Object, V>(
  input: T, limit: number, iteratee: (value: T[keyof T], key: string) => Promise<V>,
): Promise<V[]>;
export async function mapLimit<T extends Object, V>(
  input: T, limit: number, iteratee: (value: T[keyof T]) => Promise<V>,
): Promise<V[]>;
// tslint:disable-next-line:no-any (types are enforced by overload signatures, validated by tests)
export async function mapLimit<V>(input: any, limit: number, iteratee: any): Promise<V[]> {
  let output: V[] = [];
  if (!input) {
    return output;
  }

  const inputGroups: {}[] = input.map ? _.chunk(input, limit) : chunkObject(input, limit);

  for (const inputGroup of inputGroups) {
    output = _.concat(output, await map(inputGroup, iteratee) as V[]);
  }
  return output;
}

export async function mapSeries<T, V>(
  input: T[], iteratee: (value: T, index: number) => Promise<V>,
): Promise<V[]>;
export async function mapSeries<T, V>(input: T[], iteratee: (value: T) => Promise<V>): Promise<V[]>;
export async function mapSeries<T extends Object, V>(
  input: T, iteratee: (value: T[keyof T], key: string) => Promise<V>,
): Promise<V[]>;
export async function mapSeries<T extends Object, V>(
  input: T, iteratee: (value: T[keyof T]) => Promise<V>,
): Promise<V[]>;
// tslint:disable-next-line:no-any (types are enforced by overload signatures, validated by tests)
export async function mapSeries(input: any, iteratee: any): Promise<any[]> {
  return mapLimit(input, 1, iteratee);
}

export async function flatMap<T, V>(
  input: T[], iteratee: (value: T, index: number) => Promise<V | V[]>,
): Promise<V[]>;
export async function flatMap<T, V>(
  input: T[], iteratee: (value: T) => Promise<V | V[]>,
): Promise<V[]>;
export async function flatMap<T extends Object, V>(
  input: T, iteratee: (value: T[keyof T], key: string) => Promise<V | V[]>,
): Promise<V[]>;
export async function flatMap<T extends Object, V>(
  input: T, iteratee: (value: T[keyof T]) => Promise<V | V[]>,
): Promise<V[]>;
// tslint:disable-next-line:no-any (types are enforced by overload signatures, validated by tests)
export async function flatMap(input: any, iteratee: any): Promise<any[]> {
  if (!input) {
    return [];
  }
  return _.flatten(await map(input, iteratee));
}
