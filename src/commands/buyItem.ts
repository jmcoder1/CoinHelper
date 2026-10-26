import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  Client,
  CommandInteraction,
  GuildMember,
} from "discord.js";
import { Command } from "./utils/types";
import { client as unbelievaboatClient } from "../utils/apiUtils/unbelievaboatUtils/client";
import { updateBalance } from "../utils/apiUtils/unbelievaboatUtils/updateBalance";
import { endInteraction } from "./utils/endnteraction";
import { tryAsyncAwait } from "../utils/tryAsyncAwait";
import { prisma } from "../utils/apiUtils/prismaUtils/prisma";
import { ECONOMY_CHANNEL_NAME } from "../utils/apiUtils/prismaUtils/constants";
import {
  findActiveStoreItemByName,
  formatRoleList,
  missingActionRoleIds,
  missingRequirementRoleIds,
} from "./utils/storeItems";

export const BuyItem: Command = {
  name: "buy-item",
  description: "Buy a store item with coins",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "item",
      description: "Item name (see /show-items)",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  run: async (
    client: Client,
    interaction: CommandInteraction
  ): Promise<boolean> => {
    await interaction.deferReply({ ephemeral: true });

    if (!interaction.guild)
      return endInteraction(
        interaction,
        "This command can only be used in a server."
      );

    const interactionGuild = interaction.guild;
    const itemName = interaction.options.get("item")?.value as
      | string
      | undefined;
    if (!itemName?.trim())
      return endInteraction(interaction, "Please provide an item name.");

    const [member, memberError] = await tryAsyncAwait(() =>
      interaction.member instanceof GuildMember
        ? Promise.resolve(interaction.member)
        : interactionGuild.members.fetch(interaction.user.id)
    );
    if (!member || memberError)
      return endInteraction(interaction, "Could not load your member profile.");

    const guild = await prisma.guild.findUnique({
      where: { discordId: interactionGuild.id },
    });
    if (!guild) return endInteraction(interaction, "Guild not found.");

    const guildCurrency = await prisma.guildCurrency.findFirst({
      where: { guildId: guild.id },
    });
    if (!guildCurrency)
      return endInteraction(interaction, "Guild currency not found.");

    const economyGuildChannel = await prisma.guildChannel.findFirst({
      where: {
        guildId: guild.id,
        name: ECONOMY_CHANNEL_NAME,
      },
    });
    if (!economyGuildChannel)
      return endInteraction(interaction, "Economy channel not found.");

    const item = await findActiveStoreItemByName(guild.id, itemName);
    if (!item)
      return endInteraction(
        interaction,
        `Item "${itemName.trim()}" was not found. Use \`/show-items\` to see the store.`
      );

    if (item.roleActions.length === 0)
      return endInteraction(
        interaction,
        `"${item.name}" has no roles configured. Ask a mod to fix the store item.`
      );

    const missingReqs = missingRequirementRoleIds(member, item);
    if (missingReqs.length > 0)
      return endInteraction(
        interaction,
        `You need these roles first: ${formatRoleList(interactionGuild, missingReqs)}`
      );

    const rolesToAdd = missingActionRoleIds(member, item);
    if (rolesToAdd.length === 0)
      return endInteraction(
        interaction,
        `You already own "${item.name}".`
      );

    const cashBalance = (
      await unbelievaboatClient.getUserBalance(
        interactionGuild.id,
        interaction.user.id
      )
    ).cash;

    if (cashBalance < item.price)
      return endInteraction(
        interaction,
        `You need ${item.price} ${guildCurrency.namePlural} to buy "${item.name}" (you have ${cashBalance}).`
      );

    const [, payError] = await tryAsyncAwait(() =>
      updateBalance(client, {
        user: {
          id: interaction.user.id,
          name: member.displayName,
          iconURL: member.user.avatarURL() || undefined,
          guild: {
            id: guild.discordId,
            currencyPluralName: guildCurrency.namePlural,
            economyChannelId: economyGuildChannel.discordId,
            currencyImage: guildCurrency.iconSrc,
          },
        },
        cashAmount: -item.price,
        reason: `Purchased store item "${item.name}"`,
      })
    );
    if (payError)
      return endInteraction(interaction, "Error charging your balance.");

    const [, roleError] = await tryAsyncAwait(() =>
      member.roles.add(rolesToAdd, `Store purchase: ${item.name}`)
    );
    if (roleError) {
      await tryAsyncAwait(() =>
        updateBalance(client, {
          user: {
            id: interaction.user.id,
            name: member.displayName,
            iconURL: member.user.avatarURL() || undefined,
            guild: {
              id: guild.discordId,
              currencyPluralName: guildCurrency.namePlural,
              economyChannelId: economyGuildChannel.discordId,
              currencyImage: guildCurrency.iconSrc,
            },
          },
          cashAmount: item.price,
          reason: `Refund for failed store purchase "${item.name}"`,
        })
      );
      return endInteraction(
        interaction,
        "Could not add the role(s). Your coins were refunded. Ask a mod to check bot role permissions."
      );
    }

    await tryAsyncAwait(() =>
      prisma.storePurchase.create({
        data: {
          guildId: guild.id,
          storeItemId: item.id,
          userId: interaction.user.id,
          itemName: item.name,
          pricePaid: item.price,
        },
      })
    );

    return endInteraction(
      interaction,
      `Purchased **${item.iconEmoji ? `${item.iconEmoji} ` : ""}${item.name}** for ${item.price} ${guildCurrency.namePlural}.\nGranted: ${formatRoleList(interactionGuild, rolesToAdd)}`
    );
  },
};
