import {
  ApplicationCommandType,
  Client,
  CommandInteraction,
  EmbedBuilder,
} from "discord.js";
import { Command } from "./utils/types";
import { endInteraction } from "./utils/endnteraction";
import { prisma } from "../utils/apiUtils/prismaUtils/prisma";
import {
  formatRoleList,
  listActiveStoreItems,
} from "./utils/storeItems";

export const ShowItems: Command = {
  name: "show-items",
  description: "Show store items available for purchase",
  type: ApplicationCommandType.ChatInput,
  options: [],
  run: async (
    _client: Client,
    interaction: CommandInteraction
  ): Promise<boolean> => {
    await interaction.deferReply({ ephemeral: true });

    if (!interaction.guild)
      return endInteraction(
        interaction,
        "This command can only be used in a server."
      );

    const interactionGuild = interaction.guild;

    const guild = await prisma.guild.findUnique({
      where: { discordId: interactionGuild.id },
    });
    if (!guild) return endInteraction(interaction, "Guild not found.");

    const guildCurrency = await prisma.guildCurrency.findFirst({
      where: { guildId: guild.id },
    });
    if (!guildCurrency)
      return endInteraction(interaction, "Guild currency not found.");

    const items = await listActiveStoreItems(guild.id);
    if (items.length === 0)
      return endInteraction(
        interaction,
        "No store items are listed right now."
      );

    const embed = new EmbedBuilder()
      .setColor(0xf1c40f)
      .setTitle("Store")
      .setDescription(
        `Buy with \`/buy-item item:<name>\`.\nPrices are in ${guildCurrency.namePlural}.`
      );

    for (const item of items) {
      const reqIds = item.roleRequirements.map((row) => row.discordRoleId);
      const actionIds = item.roleActions.map((row) => row.discordRoleId);
      const icon = item.iconEmoji ? `${item.iconEmoji} ` : "";
      const lines = [
        item.description?.trim() || "_No description_",
        `**Price:** ${item.price} ${guildCurrency.namePlural}`,
        `**Grants:** ${formatRoleList(interactionGuild, actionIds)}`,
      ];
      if (reqIds.length > 0) {
        lines.push(
          `**Requires:** ${formatRoleList(interactionGuild, reqIds)}`
        );
      }
      embed.addFields({
        name: `${icon}${item.name}`.slice(0, 256),
        value: lines.join("\n").slice(0, 1024),
      });
    }

    await interaction.editReply({ embeds: [embed] });
    return true;
  },
};
