import { Client, CommandInteraction } from "discord.js";
import { Commands } from "../../commands/utils/commands";
import { tryAsyncAwait } from "../../utils/tryAsyncAwait";

export const handleSlashCommand = async (
  client: Client,
  interaction: CommandInteraction
): Promise<void> => {
  const slashCommand = Commands.find((c) => c.name === interaction.commandName);
  if (!slashCommand) {
    await tryAsyncAwait(() =>
      interaction.followUp({ content: "An error has occurred" })
    );
    return;
  }

  // await interaction.deferReply();

  slashCommand.run(client, interaction);
};
