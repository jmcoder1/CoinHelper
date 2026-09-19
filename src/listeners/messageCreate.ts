import { Awaitable, ChannelType, Events, Message, User } from "discord.js";
import { toBalanceUpdate } from "../utils/apiUtils/unbelievaboatUtils/toBalanceUpdate";
import { updateBalance } from "../utils/apiUtils/unbelievaboatUtils/updateBalance";
import { findNumImages } from "./utils/discordUtils/findNumImages";
import { getImageMultiplier } from "./utils/discordUtils/getImageMultiplier";
import { ensureFullMessage } from "./utils/discordUtils/ensureFullMessage";
import { Listener } from "./utils/types";
import { toUserId } from "./utils/discordUtils/toUserId";
import { handleDisboardBump } from "./utils/handleDisboardBump";
import { prisma } from "../utils/apiUtils/prismaUtils/prisma";
import {
  ECONOMY_CHANNEL_NAME,
  INVITES_CHANNEL_NAME,
  LEVELS_CHANNEL_NAME,
} from "../utils/apiUtils/prismaUtils/constants";
import { tryAsyncAwait } from "../utils/tryAsyncAwait";
import {
  economyLog,
  summarizeAttachments,
} from "./utils/economyPayoutLog";

export interface MessageCreateListener extends Listener {
  event: Events.MessageCreate;
  fn: (message: Message) => Awaitable<void>;
}

export const messageCreate: MessageCreateListener = {
  event: Events.MessageCreate,
  fn: async (rawMessage: Message) => {
    if (!rawMessage.guildId) return;

    const gatewayAttachments = rawMessage.attachments.size;
    const mayBeImagePost =
      gatewayAttachments > 0 ||
      (rawMessage.content === "" &&
        rawMessage.embeds.length === 0 &&
        !rawMessage.author.bot);

    const guild = await prisma.guild.findUnique({
      where: { discordId: rawMessage.guildId },
    });
    if (!guild) {
      if (mayBeImagePost || gatewayAttachments > 0) {
        economyLog("image-post", "skip: guild not in database", {
          guildId: rawMessage.guildId,
          messageId: rawMessage.id,
          gatewayAttachments,
        });
      }
      return;
    }

    const message = await ensureFullMessage(
      rawMessage,
      mayBeImagePost || gatewayAttachments > 0 ? "image-post" : undefined,
    );
    if (!message) {
      if (mayBeImagePost || gatewayAttachments > 0) {
        economyLog("image-post", "skip: ensureFullMessage returned null", {
          guildId: rawMessage.guildId,
          messageId: rawMessage.id,
        });
      }
      return;
    }

    const attachments = summarizeAttachments(message.attachments);
    const hasAttachments = message.attachments.size > 0;

    const guildCurrency = await prisma.guildCurrency.findFirst({
      where: { guildId: guild.id },
    });
    if (!guildCurrency) {
      if (hasAttachments) {
        economyLog("image-post", "skip: no guild currency configured", {
          guildId: guild.discordId,
          messageId: message.id,
          attachments,
        });
      }
      return;
    }

    const economyGuildChannel = await prisma.guildChannel.findFirst({
      where: {
        guildId: guild.id,
        name: ECONOMY_CHANNEL_NAME,
      },
    });
    if (!economyGuildChannel) {
      if (hasAttachments) {
        economyLog("image-post", "skip: no economy channel configured", {
          guildId: guild.discordId,
          messageId: message.id,
          attachments,
        });
      }
      return;
    }

    const bumpContext = {
      guildDiscordId: guild.discordId,
      currencyPluralName: guildCurrency.namePlural,
      currencyImage: guildCurrency.iconSrc,
      economyChannelId: economyGuildChannel.discordId,
    };

    if (await handleDisboardBump(message.client, message, bumpContext)) return;

    const invitesGuildChannel = await prisma.guildChannel.findFirst({
      where: {
        guildId: guild.id,
        name: INVITES_CHANNEL_NAME,
      },
    });
    if (!invitesGuildChannel) {
      if (hasAttachments) {
        economyLog(
          "image-post",
          "skip: no invites channel configured (blocks image payout path)",
          {
            guildId: guild.discordId,
            messageId: message.id,
            attachments,
          },
        );
      }
      return;
    }

    const levelsGuildChannel = await prisma.guildChannel.findFirst({
      where: {
        guildId: guild.id,
        name: LEVELS_CHANNEL_NAME,
      },
    });
    if (!levelsGuildChannel) {
      if (hasAttachments) {
        economyLog(
          "image-post",
          "skip: no levels channel configured (blocks image payout path)",
          {
            guildId: guild.discordId,
            messageId: message.id,
            attachments,
          },
        );
      }
      return;
    }

    if (invitesGuildChannel.discordId === message.channelId) {
      const balanceUpdate = await toBalanceUpdate(
        message.client,
        message.content,
      );
      if (balanceUpdate) {
        await tryAsyncAwait(() =>
          updateBalance(message.client, {
            cashAmount: balanceUpdate.cashAmount,
            user: {
              id: balanceUpdate.user.id,
              name: balanceUpdate.user.name,
              iconURL: balanceUpdate.user.iconURL,
              guild: {
                id: guild.discordId,
                currencyPluralName: guildCurrency.namePlural,
                economyChannelId: economyGuildChannel.discordId,
                currencyImage: guildCurrency.iconSrc,
              },
            },
            reason: balanceUpdate.reason,
          }),
        );
      }
    } else if (levelsGuildChannel.discordId === message.channelId) {
      const recipientMention = message.content.split(" ")[0];
      const recipientUserId = toUserId(recipientMention);
      if (!recipientUserId) return;

      const cached = message.client.users.cache.get(recipientUserId);
      let user: User;
      try {
        user = cached ?? (await message.client.users.fetch(recipientUserId));
      } catch {
        return;
      }

      await tryAsyncAwait(() =>
        updateBalance(message.client, {
          user: {
            id: user.id,
            name: user.username,
            guild: {
              id: guild.discordId,
              currencyPluralName: guildCurrency.namePlural,
              economyChannelId: economyGuildChannel.discordId,
              currencyImage: guildCurrency.iconSrc,
            },
            iconURL: user.avatarURL() || undefined,
          },
          cashAmount: 25,
          reason: "New Level",
        }),
      );
    } else {
      if (!hasAttachments) return;

      economyLog("image-post", "evaluating image payout", {
        guildId: guild.discordId,
        channelId: message.channelId,
        channelName:
          message.channel.type === ChannelType.GuildText
            ? message.channel.name
            : null,
        channelType: message.channel.type,
        messageId: message.id,
        authorId: message.author?.id ?? null,
        authorBot: message.author?.bot ?? null,
        gatewayAttachments,
        attachmentCount: message.attachments.size,
        attachments,
      });

      const num = findNumImages(message.attachments) ?? 0;
      if (!num || num === 0) {
        economyLog(
          "image-post",
          "skip: no countable image/video attachments (check contentType)",
          { messageId: message.id, attachments },
        );
        return;
      }

      if (message.channel.type != ChannelType.GuildText) {
        economyLog("image-post", "skip: channel is not GuildText", {
          messageId: message.id,
          channelType: message.channel.type,
        });
        return;
      }

      const imageMultiplier = getImageMultiplier(message.channel.name);
      if (imageMultiplier === 0) {
        economyLog(
          "image-post",
          "skip: channel name has no tier emoji (🪨🥉🥈🥇💎)",
          {
            messageId: message.id,
            channelName: message.channel.name,
          },
        );
        return;
      }

      const cashAmount = num * imageMultiplier;
      if (cashAmount === 0) {
        economyLog("image-post", "skip: cashAmount is 0", {
          messageId: message.id,
          num,
          imageMultiplier,
        });
        return;
      }

      if (!message.author) {
        economyLog("image-post", "skip: message has no author", {
          messageId: message.id,
        });
        return;
      }

      if (message.author.bot) {
        economyLog("image-post", "skip: author is a bot", {
          messageId: message.id,
          authorId: message.author.id,
        });
        return;
      }

      economyLog("image-post", "paying image reward", {
        authorId: message.author.id,
        numImages: num,
        imageMultiplier,
        cashAmount,
        economyChannelId: economyGuildChannel.discordId,
        channelName: message.channel.name,
      });

      const [, payError] = await tryAsyncAwait(() =>
        updateBalance(message.client, {
          user: {
            id: message.author!.id,
            name: message.author!.username,
            iconURL: message.author!.avatarURL() || undefined,
            guild: {
              id: guild.discordId,
              currencyPluralName: guildCurrency.namePlural,
              economyChannelId: economyGuildChannel.discordId,
              currencyImage: guildCurrency.iconSrc,
            },
          },
          cashAmount,
          reason: `${num} image posts in <#${message.channel.id}>`,
        }),
      );
      if (payError) {
        economyLog("image-post", "image reward failed", {
          authorId: message.author.id,
          cashAmount,
          error:
            payError instanceof Error ? payError.message : String(payError),
        });
        return;
      }

      economyLog("image-post", "image reward ok", {
        authorId: message.author.id,
        cashAmount,
      });

      const [, ledgerError] = await tryAsyncAwait(() =>
        prisma.imageCoinPayout.create({
          data: {
            messageId: message.id,
            guildId: guild.id,
            userId: message.author!.id,
            channelId: message.channelId,
            cashAmount,
          },
        }),
      );
      if (ledgerError) {
        economyLog("image-post", "ImageCoinPayout ledger write failed", {
          messageId: message.id,
          error:
            ledgerError instanceof Error
              ? ledgerError.message
              : String(ledgerError),
        });
      } else {
        economyLog("image-post", "ImageCoinPayout ledger write ok", {
          messageId: message.id,
          cashAmount,
        });
      }
    }
  },
};
