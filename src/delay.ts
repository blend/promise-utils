export async function delay<T>(delayTime: number, value: T): Promise<T>;
export async function delay<T>(delayTime: number): Promise<void>;
// tslint:disable-next-line:no-any typedef (typed by overload signatures)
export async function delay(delayTime: any, value?: any) {
  return new Promise(
    // tslint:disable-next-line:no-any (typed by overload signatures)
    (resolve: (__: any) => void): number => setTimeout(() => resolve(value), delayTime),
  );
}

export async function immediate<T>(value: T): Promise<T>;
export async function immediate<T>(): Promise<void>;
// tslint:disable-next-line:no-any typedef (typed by overload signatures)
export async function immediate(value?: any) {
  return delay(0, value);
}
