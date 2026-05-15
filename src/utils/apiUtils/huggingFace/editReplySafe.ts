import { CommandInteraction } from "discord.js";
import { tryAsyncAwait } from "../../tryAsyncAwait";
import { logTextToImageStepError } from "./logging/textToImageStepError";

export const editReplySafe = async (
  interactionId: string,
  interaction: CommandInteraction,
  content: string
): Promise<boolean> => {
  const [, err] = await tryAsyncAwait(() =>
    interaction.editReply({ content })
  );
  if (err) {
    logTextToImageStepError(interactionId, "editReply failed", err);
    return false;
  }
  return true;
};
