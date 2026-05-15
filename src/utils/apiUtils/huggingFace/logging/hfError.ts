export const hfError = (
  requestId: string,
  message: string,
  err?: unknown,
  meta?: Record<string, unknown>
) => {
  console.error("[text-to-image/hf]", message, { requestId, ...meta, err });
};
