export const hfLog = (
  requestId: string,
  message: string,
  meta?: Record<string, unknown>
) => {
  console.log("[text-to-image/hf]", message, { requestId, ...meta });
};
