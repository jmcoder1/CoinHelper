import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ChannelType,
  Client,
  CommandInteraction,
  EmbedBuilder,
} from "discord.js";
import { Command } from "./utils/types";
import { getGuildInfoById } from "../utils/apiUtils/discordUtils/getGuildInfoById";
import { updateBalance } from "../utils/apiUtils/unbelievaboatUtils/updateBalance";
import { getChannelById } from "../utils/apiUtils/discordUtils/getChannelById";

export const NewChannel: Command = {
  name: "new-channel",
  description: "Create a new channel",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "name",
      description: "New channel name",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "duplicate-channel",
      description: "Channel to duplicate",
      type: ApplicationCommandOptionType.Channel,
      required: true,
    },
    {
      name: "credit",
      description: "User who suggested",
      type: ApplicationCommandOptionType.Mentionable,
      required: true,
    },
  ],
  run: async (client: Client, interaction: CommandInteraction) => {
    if (!interaction.guild || !interaction.user) return;

    const guildInfo = getGuildInfoById(interaction.guild.id);
    if (!guildInfo) return null;

    const name = interaction.options.get("name")?.value as number;
    const duplicateChannelId = interaction.options.get("duplicate-channel")
      ?.value as string;
    const creditUserId = interaction.options.get("credit")?.value as string;

    const creditUser = interaction.guild.members.cache.get(creditUserId);
    if (!creditUser) {
      await interaction.reply({
        content: "Credit User not found",
        ephemeral: true,
      });
      return;
    }

    await updateBalance(client, {
      user: {
        name: creditUser.user.username,
        id: creditUser.user.id,
        guild: {
          id: interaction.guild.id,
          currencyPluralName: guildInfo.currencyPluralName,
          economyChannelId: guildInfo.channels.economyChannelId,
        },
        iconURL: creditUser.user.displayAvatarURL(),
      },
      cashAmount: 100,
      reason: `New channel suggestion by ${creditUser.user.username}`,
    });

    const duplicateChannel = await getChannelById(client, duplicateChannelId);
    if (!duplicateChannel || duplicateChannel.type !== ChannelType.GuildText) {
      await interaction.reply({
        content: "Duplicate channel not found",
        ephemeral: true,
      });
      return;
    }
    // new name should ass the name text to an existing channel. So that 🔞🥉🍑-ass becomes 🔞🥉🍑-{name}
    const newName =
      duplicateChannel.name.substring(
        0,
        duplicateChannel.name.indexOf("-") + 1
      ) + name;

    const newChannel = await duplicateChannel.clone({
      name: newName,
      type: ChannelType.GuildText,
      parent: duplicateChannel.parent,
      permissionOverwrites: duplicateChannel.permissionOverwrites.cache.map(
        (overwrite) => ({
          id: overwrite.id,
          allow: overwrite.allow.bitfield,
          deny: overwrite.deny.bitfield,
          type: overwrite.type,
        })
      ),
    });

    await interaction.reply({
      content: `Channel `,
      ephemeral: true,
    });

    const resultEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("New Channel Created")
      .addFields({
        name: newChannel.name,
        value: `"${newChannel.name}" has been created successfully!`,
      });

    const newChannelModChannel = await getChannelById(
      client,
      guildInfo.channels.newChannelModId
    );
    if (newChannelModChannel?.isTextBased())
      await newChannelModChannel.send({ embeds: [resultEmbed] });

    return;
  },
};
