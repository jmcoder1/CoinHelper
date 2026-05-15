const PREFIX = "[text-to-image]";

export const logTextToImageStepError = (
  interactionId: string,
  step: string,
  err?: unknown,
  meta?: Record<string, unknown>
) => {
  console.error(PREFIX, step, { interactionId, ...meta, err });
};
