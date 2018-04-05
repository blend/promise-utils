export declare function map<T, V>(input: T[], iteratee: (value: T) => Promise<V>): Promise<V[]>;
export declare function mapLimit<T, V>(input: T[], limit: number, iteratee: (value: T) => Promise<V>): Promise<V[]>;
