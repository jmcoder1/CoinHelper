import { formatApiError } from "./formatApiError";

type AsyncReturnType<T extends (...args: any) => Promise<any>> = T extends (
  ...args: any
) => Promise<infer R>
  ? R
  : any;

export const tryAsyncAwait = async <F extends () => any>(
  fn: F
): Promise<[AsyncReturnType<F>, null] | [null, any]> => {
  try {
    const data = await fn();
    return [data, null];
  } catch (error) {
    console.error("error", formatApiError(error));
    return [null, error];
  }
};
