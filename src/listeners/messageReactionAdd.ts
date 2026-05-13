import {
  ActionRowBuilder,
  Awaitable,
  ComponentType,
  Events,
  MessageReaction,
  PartialMessageReaction,
  PartialUser,
  StringSelectMenuBuilder,
  StringSelectMenuInteraction,
  User,
} from "discord.js";
import { Listener } from "./utils/types";
import { updateBalance } from "../utils/apiUtils/unbelievaboatUtils/updateBalance";
import { findNumImages } from "./utils/discordUtils/findNumImages";
import { prisma } from "../utils/apiUtils/prismaUtils/prisma";
import {
  DELETE_MESSAGE_ROLE_NAME,
  ECONOMY_CHANNEL_NAME,
} from "../utils/apiUtils/prismaUtils/constants";
import {
  REACTION_REWARD_AMOUNT,
  TEN_PLUS_REACTION_BONUS,
  TEN_PLUS_REACTION_THRESHOLD,
  TWENTY_FIVE_PLUS_REACTION_BONUS,
  TWENTY_FIVE_PLUS_REACTION_THRESHOLD,
} from "./utils/reactionThresholds";

export interface MessageReactionAddListener extends Listener {
  event: Events.MessageReactionAdd;
  fn: (
    reaction: MessageReaction | PartialMessageReaction,
    user: User | PartialUser
  ) => Awaitable<void>;
}

export const INCREMENTOR_EMOJI = "🔥";
export const QUESTION_EMOJI = "❓";

export const messageReactionAdd: MessageReactionAddListener = {
  event: Events.MessageReactionAdd,
  fn: async (
    reaction: MessageReaction | PartialMessageReaction,
    user: User | PartialUser
  ) => {
    // Fetch partial reaction if necessary
    if (reaction.partial)
      try {
        await reaction.fetch();
      } catch (error) {
        console.error("Failed to fetch reaction:", error);
        return;
      }

    // Fetch partial user if necessary
    if (user.partial)
      try {
        await user.fetch();
      } catch (error) {
        console.error("Failed to fetch user:", error);
        return;
      }

    if (!reaction.message.guildId) return;

    const message = !reaction.message.author
      ? await reaction.message.fetch()
      : reaction.message;

    // has no author
    if (!message.author) return;

    // is bot
    if (user.bot) return;

    // is self reacting
    if (message.author.id === user.id) return;

    const guild = await prisma.guild.findUnique({
      where: { discordId: reaction.message.guildId },
    });
    if (!guild) return;

    // Fetch the guild currency
    const guildCurrency = await prisma.guildCurrency.findFirst({
      where: { guildId: guild.id },
    });
    if (!guildCurrency) return;

    // Fetch the economy guild channel
    const economyGuildChannel = await prisma.guildChannel.findFirst({
      where: {
        guildId: guild.id,
        name: ECONOMY_CHANNEL_NAME,
      },
    });
    if (!economyGuildChannel) return;

    // Check if the required data exists
    if (!guildCurrency || !economyGuildChannel) return;

    if (reaction.emoji.name === INCREMENTOR_EMOJI) {
      // has no images
      const numImages = findNumImages(message.attachments);
      if (numImages === 0) return;

      await updateBalance(message.client, {
        user: {
          id: message.author.id,
          name: message.author.username,
          iconURL: message.author.avatarURL() || undefined,
          guild: {
            id: guild.discordId,
            currencyPluralName: guildCurrency.namePlural,
            economyChannelId: economyGuildChannel.discordId,
            currencyImage: guildCurrency.iconSrc,
          },
        },
        cashAmount: REACTION_REWARD_AMOUNT,
        reason: `<@${user.id}> positively reacted to your message ${message.url}`,
      });

      const incrementorReactionCount = reaction.count;

      // Only award the threshold bonus when the 🔥 reaction count crosses up.
      if (
        incrementorReactionCount ===
        TWENTY_FIVE_PLUS_REACTION_THRESHOLD + 1
      ) {
        await updateBalance(message.client, {
          user: {
            id: message.author.id,
            name: message.author.username,
            iconURL: message.author.avatarURL() || undefined,
            guild: {
              id: guild.discordId,
              currencyPluralName: guildCurrency.namePlural,
              economyChannelId: economyGuildChannel.discordId,
              currencyImage: guildCurrency.iconSrc,
            },
          },
          cashAmount: TWENTY_FIVE_PLUS_REACTION_BONUS,
          reason: `Your message ${message.url} received more than ${TWENTY_FIVE_PLUS_REACTION_THRESHOLD} reactions!`,
        });
      } else if (
        incrementorReactionCount ===
        TEN_PLUS_REACTION_THRESHOLD + 1
      ) {
        await updateBalance(message.client, {
          user: {
            id: message.author.id,
            name: message.author.username,
            iconURL: message.author.avatarURL() || undefined,
            guild: {
              id: guild.discordId,
              currencyPluralName: guildCurrency.namePlural,
              economyChannelId: economyGuildChannel.discordId,
              currencyImage: guildCurrency.iconSrc,
            },
          },
          cashAmount: TEN_PLUS_REACTION_BONUS,
          reason: `Your message ${message.url} received more than ${TEN_PLUS_REACTION_THRESHOLD} reactions!`,
        });
      }
    } else if (reaction.emoji.name === QUESTION_EMOJI) {
      const member = await reaction.message.guild?.members.fetch(user.id);

      const deleteMessageGuildRole = await prisma.guildRole.findFirst({
        where: {
          guildId: guild.id,
          name: DELETE_MESSAGE_ROLE_NAME,
        },
      });
      if (!deleteMessageGuildRole) return;

      const requiredRoleId = deleteMessageGuildRole.discordId;
      const hasRequiredRole = member?.roles.cache.has(requiredRoleId);
      if (!hasRequiredRole) return;

      const guildRemovalReasons = await prisma.guildRemovalReason.findMany({
        where: { guildId: guild.id },
      });
      if (!guildRemovalReasons) return;

      // Create a dropdown (select mencu)
      const options = guildRemovalReasons.map((removalReason: any) => {
        return {
          label: removalReason.title,
          value: removalReason.value,
          description: removalReason.description,
        };
      });
      const selectMenu = new StringSelectMenuBuilder()
        .setCustomId("message-options")
        .setPlaceholder("Choose an action")
        .addOptions(options);

      const actionRow =
        new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
          selectMenu
        );

      // Send the dropdown as a reply
      const dropdownMessage = await reaction.message.channel.send({
        content: `What would you like to do with this message?`,
        components: [actionRow],
      });

      // Create a collector to handle dropdown interactions
      const collector = dropdownMessage.createMessageComponentCollector({
        componentType: ComponentType.StringSelect,
        time: 60000, // 1 minute
      });

      collector.on(
        "collect",
        async (interaction: StringSelectMenuInteraction) => {
          if (interaction.customId !== "message-options") return;

          // Check if the user has the required role
          const member = await reaction.message.guild?.members.fetch(
            interaction.user.id
          );
          if (!member?.roles.cache.has(requiredRoleId)) {
            await interaction.reply({
              content:
                "You do not have the required role to perform this action.",
              ephemeral: true, // Only visible to the user
            });
            return;
          }
          try {
            // Forward the message content to the user
            // Check if the message author is still a member of the guild
            const authorMember = message.author
              ? await reaction.message.guild?.members
                  .fetch(message.author.id)
                  .catch(() => null)
              : null;

            if (message.author && authorMember)
              await message.author.send({
                content: `Your post is being deleted.\n\nReason: ${
                  interaction.values[0]
                }\n\nMessage content:\n${
                  reaction.message.content || "No content"
                }`,
              });

            // Delete the original message
            await reaction.message.delete();
          } catch (error) {
            console.error("Failed to delete message:", error);
            await interaction.reply({
              content: "Failed to delete the message.",
              ephemeral: true,
            });
            return;
          }

          await interaction.reply({
            content:
              "The message has been deleted, and its content has been sent to the user.",
            ephemeral: true,
          });

          // Clean up the dropdown message
          await dropdownMessage.delete();
          await interaction.editReply({
            content: "The dropdown has been processed and closed.",
          });
        }
      );

      collector.on("end", async () => {
        try {
          // Check if the dropdown message still exists
          const fetchedMessage = await dropdownMessage.channel.messages.fetch(
            dropdownMessage.id
          );

          // If the message exists, edit it to indicate expiration
          await fetchedMessage.edit({
            content: "The dropdown has expired.",
            components: [],
          });
        } catch (error) {
          if (error.code === 10008) {
            console.error("Dropdown message was already deleted.");
          } else {
            console.error("Failed to edit the dropdown message:", error);
          }
        }
      });
    }
  },
};
