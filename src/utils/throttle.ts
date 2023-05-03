export type ThrottledFunction<T extends (...args: any) => any> = (
  ...args: Parameters<T>
) => ReturnType<T>;

export function throttle<T extends (...args: any) => any>(
  func: T,
  ms: number
): ThrottledFunction<T> {
  let inThrottle: boolean;
  let lastResult: ReturnType<T>;

  return function (this: any, ...args): ReturnType<T> {
    if (!inThrottle) {
      inThrottle = true;

      setTimeout(() => (inThrottle = false), ms);

      lastResult = func.apply(this, args);
    }

    return lastResult;
  };
}
