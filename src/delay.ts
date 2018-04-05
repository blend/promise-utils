export async function delay<T>(delayTime: number, value: T): Promise<T> {
  return new Promise(
    (resolve: (__: T) => void): number => setTimeout(() => resolve(value), delayTime),
  );
}

export async function immediate<T>(value: T): Promise<T> {
  return delay(0, value);
}
