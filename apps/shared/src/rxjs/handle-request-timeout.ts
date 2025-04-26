import { throwError, timeout } from 'rxjs';

export const handleRequestTimeout = (timeoutMs: number = 10000) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  timeout<any, any>({
    each: timeoutMs,
    with: () => throwError(() => new Error('Request timed out')),
  });
