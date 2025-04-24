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
import { getGuildInfoById } from "../utils/apiUtils/discordUtils/getGuildInfoById";
import { updateBalance } from "../utils/apiUtils/unbelievaboatUtils/updateBalance";
import { findNumImages } from "./utils/discordUtils/findNumImages";

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
    const guildInfo = getGuildInfoById(reaction.message.guildId);
    if (!guildInfo) return;

    const message = !reaction.message.author
      ? await reaction.message.fetch()
      : reaction.message;

    // has no author
    if (!message.author) return;

    // is bot
    if (user.bot) return;

    // is self reacting
    if (message.author.id === user.id) return;

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
            id: guildInfo.id,
            currencyPluralName: guildInfo.currencyPluralName,
            economyChannelId: guildInfo.channels.economyChannelId,
            currencyImage: guildInfo.images.currency[0],
          },
        },
        cashAmount: 5,
        reason: `<@${user.id}> positively reacted to your message ${message.url}`,
      });

      // Check the total number of reactions on the message
      const totalReactions = reaction.message.reactions.cache.reduce(
        (count, reaction) => count + reaction.count,
        0
      );

      // Award additional coins based on reaction thresholds
      if (totalReactions > 25) {
        await updateBalance(message.client, {
          user: {
            id: message.author.id,
            name: message.author.username,
            iconURL: message.author.avatarURL() || undefined,
            guild: {
              id: guildInfo.id,
              currencyPluralName: guildInfo.currencyPluralName,
              economyChannelId: guildInfo.channels.economyChannelId,
              currencyImage: guildInfo.images.currency[0],
            },
          },
          cashAmount: 100,
          reason: `Your message ${message.url} received more than 25 reactions!`,
        });
      } else if (totalReactions > 10) {
        await updateBalance(message.client, {
          user: {
            id: message.author.id,
            name: message.author.username,
            iconURL: message.author.avatarURL() || undefined,
            guild: {
              id: guildInfo.id,
              currencyPluralName: guildInfo.currencyPluralName,
              economyChannelId: guildInfo.channels.economyChannelId,
              currencyImage: guildInfo.images.currency[0],
            },
          },
          cashAmount: 50,
          reason: `Your message ${message.url} received more than 10 reactions!`,
        });
      }
    } else if (
      guildInfo.removalReasons &&
      guildInfo.removalReasons.length > 0 &&
      reaction.emoji.name === QUESTION_EMOJI
    ) {
      const member = await reaction.message.guild?.members.fetch(user.id);
      const requiredRoleId = guildInfo.roles.deleteMessageRoleId; // Replace with the actual role ID
      if (!member?.roles.cache.has(requiredRoleId)) return;

      // Create a dropdown (select menu)
      const options = guildInfo.removalReasons.map((reaction) => {
        return {
          label: reaction.title,
          value: reaction.value,
          description: reaction.value,
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

          try {
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

          // Send the message content to the user
          await message.author?.send({
            content: `Your post has been deleted.\n\nReason: ${
              interaction.values[0]
            }\n\nMessage content:\n${reaction.message.content || "No content"}`,
          });

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
