import { map } from './map';

export async function filter<T, V>(
  input: T[], predicate: (value: T, index: number) => Promise<V>,
): Promise<T[]>;
export async function filter<T, V>(
  input: T[], predicate: (value: T) => Promise<V>,
): Promise<T[]>;
export async function filter<T extends Object, V>(
  input: T, predicate: (value: T[keyof T], key: keyof T) => Promise<V>,
): Promise<T[keyof T][]>;
export async function filter<T extends Object, V>(
  input: T, predicate: (value: T[keyof T]) => Promise<V>,
): Promise<T[keyof T][]>;
// tslint:disable-next-line:no-any (types are enforced by overload signatures, validated by tests)
export async function filter(input: any, predicate: any): Promise<any[]> {
  if (!input) {
    return [];
  }

  // tslint:disable-next-line:no-any
  const output: any[] = [];
  // tslint:disable-next-line:no-any
  await map(input, async (value: any, key: any) => {
    if (await predicate(value, key)) {
      output.push(value);
    }
  });
  return output;
}
