import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ChannelType,
  Client,
  CommandInteraction,
  EmbedBuilder,
} from "discord.js";
import { Command } from "./utils/types";
import { updateBalance } from "../utils/apiUtils/unbelievaboatUtils/updateBalance";
import { getChannelById } from "../utils/apiUtils/discordUtils/getChannelById";
import { endInteraction } from "./utils/endnteraction";
import { tryAsyncAwait } from "../utils/tryAsyncAwait";
import {
  ANNOUNCEMENT_CHANNEL_NAME,
  ECONOMY_CHANNEL_NAME,
  NEW_CHANNEL_ROLE_NAME,
} from "../utils/apiUtils/prismaUtils/constants";
import { prisma } from "../utils/apiUtils/prismaUtils/prisma";

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
  run: async (
    client: Client,
    interaction: CommandInteraction
  ): Promise<boolean> => {
    if (!interaction.guild)
      return endInteraction(
        interaction,
        "This command can only be used in a server."
      );
    if (!interaction.user)
      return endInteraction(interaction, "User not found.");

    const interactionGuild = interaction.guild;

    const guild = await prisma.guild.findUnique({
      where: { discordId: interactionGuild.id },
    });
    if (!guild) return endInteraction(interaction, "Guild not found.");

    // Fetch the guild currency
    const guildCurrency = await prisma.guildCurrency.findFirst({
      where: { guildId: guild.id },
    });
    if (!guildCurrency)
      return endInteraction(interaction, "Guild currency not found.");

    // Fetch the economy guild channel

    const name = interaction.options.get("name")?.value as number;
    const duplicateChannelId = interaction.options.get("duplicate-channel")
      ?.value as string;
    const creditUserId = interaction.options.get("credit")?.value as string;

    const creditUser = interactionGuild.members.cache.get(creditUserId);
    if (!creditUser)
      return endInteraction(interaction, "Credit user not found.");

    const economyGuildChannel = await prisma.guildChannel.findFirst({
      where: {
        guildId: guild.id,
        name: ECONOMY_CHANNEL_NAME,
      },
    });
    if (!economyGuildChannel)
      return endInteraction(interaction, "Economy channel not found.");

    const [, errorUpdateBalance] = await tryAsyncAwait(() =>
      updateBalance(client, {
        user: {
          name: creditUser.user.username,
          id: creditUser.user.id,
          guild: {
            id: guild.discordId,
            currencyPluralName: guildCurrency.namePlural,
            economyChannelId: economyGuildChannel.discordId,
            currencyImage: guildCurrency.iconSrc,
          },
          iconURL: creditUser.user.displayAvatarURL(),
        },
        cashAmount: 100,
        reason: `New channel suggestion by ${creditUser.user.username}`,
      })
    );
    if (errorUpdateBalance)
      return endInteraction(interaction, "Error updating balance.");

    const duplicateChannel = await getChannelById(client, duplicateChannelId);
    if (!duplicateChannel || duplicateChannel.type !== ChannelType.GuildText)
      return endInteraction(interaction, "Duplicate channel not found.");

    // new name should ass the name text to an existing channel. So that 🔞🥉🍑-ass becomes 🔞🥉🍑-{name}
    const newName =
      duplicateChannel.name.substring(
        0,
        duplicateChannel.name.indexOf("-") + 1
      ) + name;

    const [newChannel, newChannelError] = await tryAsyncAwait(() =>
      duplicateChannel.clone({
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
      })
    );
    if (!newChannel || newChannelError)
      return endInteraction(
        interaction,
        "Error duplicating channel" + newChannelError
      );

    const resultEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("New Channel Created")
      .addFields({
        name: newChannel.name,
        value: `"${newChannel.name}" has been created successfully!`,
      });

    const newChannelGuildRole = await prisma.guildRole.findFirst({
      where: {
        guildId: guild.id,
        name: NEW_CHANNEL_ROLE_NAME,
      },
    });
    if (!newChannelGuildRole)
      return endInteraction(
        interaction,
        NEW_CHANNEL_ROLE_NAME + " role not found."
      );

    const newChannelModChannel = await getChannelById(
      client,
      newChannelGuildRole.discordId
    );
    if (!newChannelModChannel || !newChannelModChannel.isTextBased())
      return endInteraction(interaction, "New channel mod channel not found.");

    await newChannelModChannel.send({ embeds: [resultEmbed] });

    const announcementGuildChannel = await prisma.guildChannel.findFirst({
      where: {
        guildId: guild.id,
        name: ANNOUNCEMENT_CHANNEL_NAME,
      },
    });
    if (!announcementGuildChannel)
      return endInteraction(
        interaction,
        ANNOUNCEMENT_CHANNEL_NAME + " role not found."
      );

    const announcementChannel = await getChannelById(
      client,
      announcementGuildChannel.discordId
    );
    if (!announcementChannel || !announcementChannel.isTextBased())
      return endInteraction(interaction, "Announcement channel not found.");

    await announcementChannel.send({
      content: `<@&${newChannelGuildRole.discordId}> The new channel <#${newChannel.id}> has been added thanks to <@${creditUser.user.id}>`,
    });

    return endInteraction(interaction, "New channel created successfully.");
  },
};
