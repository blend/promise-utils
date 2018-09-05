export declare function filter<T, V>(input: T[], predicate: (value: T, index: number) => Promise<V>): Promise<T[]>;
export declare function filter<T, V>(input: T[], predicate: (value: T) => Promise<V>): Promise<T[]>;
export declare function filter<T extends Object, V>(input: T, predicate: (value: T[keyof T], key: keyof T) => Promise<V>): Promise<T[keyof T][]>;
export declare function filter<T extends Object, V>(input: T, predicate: (value: T[keyof T]) => Promise<V>): Promise<T[keyof T][]>;
