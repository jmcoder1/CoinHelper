import {
  AttachmentBuilder,
  ChannelType,
  EmbedBuilder,
  Message,
  MessageCreateOptions,
  MessageReaction,
  PartialMessageReaction,
  TextChannel,
} from "discord.js";
import { prisma } from "../../../utils/apiUtils/prismaUtils/prisma";
import { FEATURED_MEDIA_CHANNEL_NAME } from "../../../utils/apiUtils/prismaUtils/constants";
import { updateBalance } from "../../../utils/apiUtils/unbelievaboatUtils/updateBalance";
import { tryAsyncAwait } from "../../../utils/tryAsyncAwait";
import {
  isImageAttachment,
  isVideoAttachment,
} from "../../../utils/apiUtils/discordUtils/attachmentContentTypes";
import {
  TEN_PLUS_REACTION_BONUS,
  TEN_PLUS_REACTION_THRESHOLD,
} from "../reactionThresholds";
import { economyLog } from "../economyPayoutLog";
import { countDesignatedLikes } from "./designatedLikeEmojis";
import { isRockDiamondChannel } from "./tierChannel";

/** Vote emojis the bot adds on each featured/contest post. */
export const FEATURED_VOTE_EMOJIS = ["👍", "👎"] as const;

const buildFeaturedForwardPayload = (
  message: Message,
  author: NonNullable<Message["author"]>,
  options: { attachFiles: boolean }
): MessageCreateOptions => {
  const caption = message.content?.trim() || null;
  const attachments = [...message.attachments.values()];
  const firstImage = attachments.find((attachment) =>
    isImageAttachment(attachment)
  );
  const firstVideo = attachments.find((attachment) =>
    isVideoAttachment(attachment)
  );

  const embed = new EmbedBuilder()
    .setColor(0xf1c40f)
    .setAuthor({
      name: author.displayName || author.username,
      iconURL: author.displayAvatarURL(),
      url: message.url,
    })
    .setDescription(
      [caption, `[View original](${message.url})`].filter(Boolean).join("\n\n")
    )
    .setFooter({ text: `Featured · ${TEN_PLUS_REACTION_THRESHOLD}+ likes` })
    .setTimestamp(message.createdAt);

  // Prefer re-attaching media so videos/gifs render natively in Discord.
  if (options.attachFiles && attachments.length > 0) {
    return {
      content: `🔥 Featured · <@${author.id}>`,
      embeds: [embed],
      files: attachments.map(
        (attachment) =>
          new AttachmentBuilder(attachment.url, {
            name: attachment.name || "media",
          })
      ),
    };
  }

  // Fallback when re-attach fails (file too large, etc.): embed image, bare
  // video URL in content so Discord can unfurl a player.
  if (firstImage) {
    embed.setImage(firstImage.url);
  }

  const contentParts = [`🔥 Featured · <@${author.id}>`];
  if (!firstImage && firstVideo) {
    contentParts.push(firstVideo.url);
  }

  return {
    content: contentParts.join("\n"),
    embeds: [embed],
  };
};

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

  if (
    message.channel.type !== ChannelType.GuildText ||
    !isRockDiamondChannel(message.channel.name)
  ) {
    return;
  }

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

  const channel = featuredChannel as TextChannel;
  let [sent, sendError] = await tryAsyncAwait(() =>
    channel.send(buildFeaturedForwardPayload(message, author, { attachFiles: true }))
  );

  if (sendError || !sent) {
    economyLog("reaction-add", "featured forward with files failed; retrying fallback", {
      messageId: message.id,
      error:
        sendError instanceof Error ? sendError.message : String(sendError),
    });
    [sent, sendError] = await tryAsyncAwait(() =>
      channel.send(
        buildFeaturedForwardPayload(message, author, { attachFiles: false })
      )
    );
  }

  if (sendError || !sent) {
    economyLog("reaction-add", "featured forward send failed", {
      messageId: message.id,
      error:
        sendError instanceof Error ? sendError.message : String(sendError),
    });
    return;
  }

  const featuredMessage = sent;

  for (const emoji of FEATURED_VOTE_EMOJIS) {
    const [, reactError] = await tryAsyncAwait(() =>
      featuredMessage.react(emoji)
    );
    if (reactError) {
      economyLog("reaction-add", "featured vote react failed", {
        featuredMessageId: featuredMessage.id,
        emoji,
        error:
          reactError instanceof Error
            ? reactError.message
            : String(reactError),
      });
    }
  }

  await tryAsyncAwait(() =>
    prisma.featuredMediaPost.update({
      where: { messageId: message.id },
      data: { featuredChannelMessageId: featuredMessage.id },
    })
  );

  economyLog("reaction-add", "featured forward ok", {
    messageId: message.id,
    featuredMessageId: featuredMessage.id,
    featuredChannelId: featuredGuildChannel.discordId,
  });
};
