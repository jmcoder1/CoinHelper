import {
  EmbedBuilder,
  Message,
  MessageReaction,
  PartialMessageReaction,
  TextChannel,
} from "discord.js";
import { prisma } from "../../../utils/apiUtils/prismaUtils/prisma";
import { FEATURED_MEDIA_CHANNEL_NAME } from "../../../utils/apiUtils/prismaUtils/constants";
import { updateBalance } from "../../../utils/apiUtils/unbelievaboatUtils/updateBalance";
import { tryAsyncAwait } from "../../../utils/tryAsyncAwait";
import { isImageAttachment } from "../../../utils/apiUtils/discordUtils/attachmentContentTypes";
import {
  TEN_PLUS_REACTION_BONUS,
  TEN_PLUS_REACTION_THRESHOLD,
} from "../reactionThresholds";
import { economyLog } from "../economyPayoutLog";
import { countDesignatedLikes } from "./designatedLikeEmojis";

type GuildCurrencyRow = {
  namePlural: string;
  iconSrc: string;
};

type TryFeatureParams = {
  message: Message;
  triggeringReaction?: MessageReaction | PartialMessageReaction;
  guild: { id: number; discordId: string };
  guildCurrency: GuildCurrencyRow;
  economyChannelId: string;
};

/**
 * When designated likes reach 10+, pay the 10+ bonus once and forward the media
 * post to the admin-mapped featured-media channel (if configured).
 * Not clawed back if likes drop.
 */
export const tryFeatureMediaAtTenLikes = async (
  params: TryFeatureParams
): Promise<void> => {
  const { message, triggeringReaction, guild, guildCurrency, economyChannelId } =
    params;

  const likeCount = countDesignatedLikes(message, triggeringReaction);
  if (likeCount < TEN_PLUS_REACTION_THRESHOLD) return;

  const author = message.author;
  if (!author) return;

  const existing = await prisma.featuredMediaPost.findUnique({
    where: { messageId: message.id },
  });
  if (existing) {
    economyLog("reaction-add", "skip: already featured this message", {
      messageId: message.id,
      likeCount,
    });
    return;
  }

  const featuredGuildChannel = await prisma.guildChannel.findFirst({
    where: {
      guildId: guild.id,
      name: FEATURED_MEDIA_CHANNEL_NAME,
    },
  });

  const [, claimError] = await tryAsyncAwait(() =>
    prisma.featuredMediaPost.create({
      data: {
        messageId: message.id,
        guildId: guild.id,
        userId: author.id,
        sourceChannelId: message.channelId,
        featuredChannelId: featuredGuildChannel?.discordId ?? "",
        cashAmount: TEN_PLUS_REACTION_BONUS,
      },
    })
  );
  if (claimError) {
    economyLog("reaction-add", "skip: featured claim race", {
      messageId: message.id,
      error:
        claimError instanceof Error ? claimError.message : String(claimError),
    });
    return;
  }

  economyLog("reaction-add", "paying 10+ feature bonus", {
    authorId: author.id,
    reactionCount: likeCount,
    cashAmount: TEN_PLUS_REACTION_BONUS,
    messageId: message.id,
  });

  const [, payError] = await tryAsyncAwait(() =>
    updateBalance(message.client, {
      user: {
        id: author.id,
        name: author.username,
        iconURL: author.avatarURL() || undefined,
        guild: {
          id: guild.discordId,
          currencyPluralName: guildCurrency.namePlural,
          economyChannelId,
          currencyImage: guildCurrency.iconSrc,
        },
      },
      cashAmount: TEN_PLUS_REACTION_BONUS,
      reason: featuredGuildChannel
        ? `Your message ${message.url} received ${TEN_PLUS_REACTION_THRESHOLD}+ likes and was featured!`
        : `Your message ${message.url} received ${TEN_PLUS_REACTION_THRESHOLD}+ likes!`,
    })
  );
  if (payError) {
    economyLog("reaction-add", "10+ feature bonus failed", {
      authorId: author.id,
      messageId: message.id,
      error: payError instanceof Error ? payError.message : String(payError),
    });
    await tryAsyncAwait(() =>
      prisma.featuredMediaPost.delete({ where: { messageId: message.id } })
    );
    return;
  }

  economyLog("reaction-add", "10+ feature bonus ok", {
    authorId: author.id,
    cashAmount: TEN_PLUS_REACTION_BONUS,
  });

  if (!featuredGuildChannel) {
    economyLog("reaction-add", "skip forward: featured-media channel not configured", {
      guildId: guild.discordId,
      messageId: message.id,
    });
    return;
  }

  const featuredChannel = await message.client.channels
    .fetch(featuredGuildChannel.discordId)
    .catch(() => null);
  if (!featuredChannel || !featuredChannel.isTextBased()) {
    economyLog("reaction-add", "featured forward failed: channel missing", {
      featuredChannelId: featuredGuildChannel.discordId,
      messageId: message.id,
    });
    return;
  }

  const firstImage = [...message.attachments.values()].find((attachment) =>
    isImageAttachment(attachment)
  );

  const embed = new EmbedBuilder()
    .setColor(0xf1c40f)
    .setAuthor({
      name: author.username,
      iconURL: author.avatarURL() || undefined,
    })
    .setDescription(
      [
        `Featured post by <@${author.id}>`,
        message.content?.trim() ? message.content.trim() : null,
        `[Jump to original](${message.url})`,
      ]
        .filter(Boolean)
        .join("\n\n")
    )
    .setTimestamp(message.createdAt);

  if (firstImage) {
    embed.setImage(firstImage.url);
  } else {
    const mediaLinks = [...message.attachments.values()]
      .map((attachment) => `[${attachment.name}](${attachment.url})`)
      .join("\n");
    if (mediaLinks) {
      embed.addFields({ name: "Media", value: mediaLinks });
    }
  }

  const [sent, sendError] = await tryAsyncAwait(() =>
    (featuredChannel as TextChannel).send({ embeds: [embed] })
  );
  if (sendError || !sent) {
    economyLog("reaction-add", "featured forward send failed", {
      messageId: message.id,
      error:
        sendError instanceof Error ? sendError.message : String(sendError),
    });
    return;
  }

  await tryAsyncAwait(() =>
    prisma.featuredMediaPost.update({
      where: { messageId: message.id },
      data: { featuredChannelMessageId: sent.id },
    })
  );

  economyLog("reaction-add", "featured forward ok", {
    messageId: message.id,
    featuredMessageId: sent.id,
    featuredChannelId: featuredGuildChannel.discordId,
  });
};
