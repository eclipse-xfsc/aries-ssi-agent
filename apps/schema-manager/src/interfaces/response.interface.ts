export interface Response<T = unknown> {
  statusCode: number;
  message: string;
  data?: T;
  error?: unknown;
}
