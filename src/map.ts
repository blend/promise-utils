import * as _ from 'lodash';

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
  if (!input) {
    return [];
  }

  // tslint:disable-next-line:no-any
  const stack: any[] = _.reverse(input.map ? _.clone(input) : _.toPairs(input));
  return await flatMap(_.range(limit), async () => {
    const partialOutput: V[] = [];
    while (!_.isEmpty(stack)) {
      // tslint:disable-next-line:no-any
      const val: any = stack.pop();
      if (input.map) {
        partialOutput.push(await iteratee(val, stack.length));
      } else {
        partialOutput.push(await iteratee(...(_.reverse(val))));
      }
    }
    return partialOutput;
  });
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
