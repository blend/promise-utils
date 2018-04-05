export function timeout<T extends Function>(
  fn: T,
  expirationTime: number,
  errorMessage: string,
): T {
  // tslint:disable-next-line:typedef no-any (typedef is hacked because we're hijacking fn)
  return async function race(this: any) {
    return Promise.race([
      new Promise(
        (__: Function, reject: Function): void => {
          setTimeout((): void => reject(new Error(errorMessage)), expirationTime);
        },
      ) as Promise<never>,
      fn.apply(this, arguments),
    ]);
    // tslint:disable-next-line:no-any (need to cast to any because we hacked together the typedef)
  } as any as T;
}
