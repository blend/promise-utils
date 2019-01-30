/**
 * Optionally returns a value after a delay. This is useful if you want to add jitter or need to
 * wait for some external reason.
 *
 * @param {number} delayTime - the amount of milliseconds to wait before returning
 * @optionalParam {any} value - the value to return after the delay
 * @returns value - if defined
 */
export declare function delay<T>(delayTimeMs: number, value: T): Promise<T>;
export declare function delay<T>(delayTimeMs: number): Promise<void>;
/**
 * Optionally returns a value after deferring execution. This is useful if you need to wait for
 * anything left on the event loop.
 *
 * @optionalParam {any} value - the value to return
 * @returns value - if defined
 */
export declare function immediate<T>(value: T): Promise<T>;
export declare function immediate<T>(): Promise<void>;
