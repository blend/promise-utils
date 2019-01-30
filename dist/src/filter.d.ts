/**
 * Returns a new array of all the values in coll which pass an async truth test. This operation is
 * performed in parallel, but the results array will be in the same order as the original.
 *
 * @param coll {Array | Object} A collection to iterate over.
 * @param predicate {Function} - A truth test to apply to each item in coll. Invoked with (item,
 *     key/index), must return a boolean.
 * @returns The filtered collection
 */
export declare function filter<T, V>(input: T[], predicate: (value: T, index: number) => Promise<V>): Promise<T[]>;
export declare function filter<T, V>(input: T[], predicate: (value: T) => Promise<V>): Promise<T[]>;
export declare function filter<T extends Object, V>(input: T, predicate: (value: T[keyof T], key: keyof T) => Promise<V>): Promise<T[keyof T][]>;
export declare function filter<T extends Object, V>(input: T, predicate: (value: T[keyof T]) => Promise<V>): Promise<T[keyof T][]>;
