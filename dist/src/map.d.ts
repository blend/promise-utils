/**
 * Produces a new collection of values by mapping each value in coll through the iteratee
 * function. The iteratee is called with an item from coll and a callback for when it has finished
 * processing. Each of these callback takes 2 arguments: an error, and the transformed item from
 * coll. If iteratee passes an error to its callback, the main callback (for the map function) is
 * immediately called with the error.
 *
 * Note, that since this function applies the iteratee to each item in parallel, there is no
 * guarantee that the iteratee functions will complete in order. However, the results array will be
 * in the same order as the original coll.
 *
 * @param {Array | Iterable | Object} input - A collection to iterate over.
 * @param {AsyncFunction} iteratee - An async function to apply to each item in coll. The iteratee
 *     should return the transformed item. Invoked with (item, key).
 */
export declare function map<T, V>(input: T[], iteratee: (value: T, index: number) => Promise<V>): Promise<V[]>;
export declare function map<T, V>(input: T[], iteratee: (value: T) => Promise<V>): Promise<V[]>;
export declare function map<T extends Object, V>(input: T, iteratee: (value: T[keyof T], key: string) => Promise<V>): Promise<V[]>;
export declare function map<T extends Object, V>(input: T, iteratee: (value: T[keyof T]) => Promise<V>): Promise<V[]>;
/**
 * The same as map but runs a maximum of limit async operations at a time with the same ordering
 * guarantees.
 *
 * @param {Array | Iterable | Object} input - A collection to iterate over.
 * @param {number} limit - The maximum number of async operations at a time.
 * @param {AsyncFunction} iteratee - An async function to apply to each item in coll. The iteratee
 *     should complete with the transformed item. Invoked with (item, key).
 */
export declare function mapLimit<T, V>(input: T[], limit: number, iteratee: (value: T, index: number) => Promise<V>): Promise<V[]>;
export declare function mapLimit<T, V>(input: T[], limit: number, iteratee: (value: T) => Promise<V>): Promise<V[]>;
export declare function mapLimit<T extends Object, V>(input: T, limit: number, iteratee: (value: T[keyof T], key: string) => Promise<V>): Promise<V[]>;
export declare function mapLimit<T extends Object, V>(input: T, limit: number, iteratee: (value: T[keyof T]) => Promise<V>): Promise<V[]>;
/**
 * The same as mapLimit but with only 1 operation at a time, and maintains the ordering guarantees
 * of map.
 *
 * @param {Array | Iterable | Object} input - A collection to iterate over.
 * @param {AsyncFunction} iteratee - An async function to apply to each item in coll. The iteratee
 *     should complete with the transformed item. Invoked with (item, key).
 */
export declare function mapSeries<T, V>(input: T[], iteratee: (value: T, index: number) => Promise<V>): Promise<V[]>;
export declare function mapSeries<T, V>(input: T[], iteratee: (value: T) => Promise<V>): Promise<V[]>;
export declare function mapSeries<T extends Object, V>(input: T, iteratee: (value: T[keyof T], key: string) => Promise<V>): Promise<V[]>;
export declare function mapSeries<T extends Object, V>(input: T, iteratee: (value: T[keyof T]) => Promise<V>): Promise<V[]>;
/**
 * The same as map but will flatten the results.
 *
 * @param {Array | Iterable | Object} input - A collection to iterate over.
 * @param {AsyncFunction} iteratee - An async function to apply to each item in coll. The iteratee
 *     should complete with the transformed item. Invoked with (item, key).
 */
export declare function flatMap<T, V>(input: T[], iteratee: (value: T, index: number) => Promise<V | V[]>): Promise<V[]>;
export declare function flatMap<T, V>(input: T[], iteratee: (value: T) => Promise<V | V[]>): Promise<V[]>;
export declare function flatMap<T extends Object, V>(input: T, iteratee: (value: T[keyof T], key: string) => Promise<V | V[]>): Promise<V[]>;
export declare function flatMap<T extends Object, V>(input: T, iteratee: (value: T[keyof T]) => Promise<V | V[]>): Promise<V[]>;
