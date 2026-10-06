import { TextBasedChannel } from "discord.js";
import { prisma } from "../prismaUtils/prisma";
import { PARTNER_PROMO_CHANNEL_NAME } from "../prismaUtils/constants";
import { isPartnerPromoOnCooldown } from "./isPartnerPromoOnCooldown";
import { partnerPromoKey } from "./partnerPromoKey";

const lastPromoAt = new Map<string, number>();

/**
 * After a positive economy payout, ping the user once per day with a
 * clickbait line that points at the configured partner channel.
 */
export const maybeSendPartnerPromo = async (
  economyChannel: TextBasedChannel,
  guildDiscordId: string,
  userId: string,
  now = Date.now(),
) => {
  const key = partnerPromoKey(guildDiscordId, userId);
  if (isPartnerPromoOnCooldown(lastPromoAt.get(key), now)) return;

  const guild = await prisma.guild.findUnique({
    where: { discordId: guildDiscordId },
    select: { id: true },
  });
  if (!guild) return;

  const partnerChannel = await prisma.guildChannel.findFirst({
    where: {
      guildId: guild.id,
      name: PARTNER_PROMO_CHANNEL_NAME,
    },
  });
  if (!partnerChannel) return;

  lastPromoAt.set(key, now);
  await economyChannel.send(
    `<@${userId}> Want to earn 3000 more coins? Check <#${partnerChannel.discordId}>`,
  );
};
