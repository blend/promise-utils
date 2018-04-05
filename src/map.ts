import * as _ from 'lodash';

export async function map<T, V>(
  input: T[],
  iteratee: (value: T) => Promise<V>,
): Promise<V[]> {
  if (!input || !input.map) {
    return [];
  }
  return Promise.all(input.map(iteratee));
}

export async function mapLimit<T, V>(
  input: T[],
  limit: number,
  iteratee: (value: T) => Promise<V>,
): Promise<V[]> {
  let output: V[] = [];
  for (const inputGroup of _.chunk(input, limit)) {
    output = _.concat(output, await map(inputGroup, iteratee));
  }
  return output;
}
