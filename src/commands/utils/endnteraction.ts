import { CommandInteraction } from "discord.js";
import { tryAsyncAwait } from "../../utils/tryAsyncAwait";

export const endInteraction = async (
  interaction: CommandInteraction,
  message: string
) => {
  const [res, error] = await tryAsyncAwait(() =>
    interaction.reply({
      content: message,
      ephemeral: true,
    })
  );
  if (!res || error) {
    console.error(`Error replying to interaction: ${interaction}`, error);
    return false;
  }

  console.log("Interaction ended:", interaction.user.username, message);
  return true;
};
