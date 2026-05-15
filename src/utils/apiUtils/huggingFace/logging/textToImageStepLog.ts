const PREFIX = "[text-to-image]";

export const logTextToImageStep = (
  interactionId: string,
  step: string,
  meta?: Record<string, unknown>
) => {
  console.log(PREFIX, step, { interactionId, ...meta });
};
