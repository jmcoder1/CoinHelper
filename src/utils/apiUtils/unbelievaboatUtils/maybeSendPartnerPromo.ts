import { TextBasedChannel } from "discord.js";
import { PARTNER_TICKET_CHANNEL_ID } from "../prismaUtils/constants";
import { isPartnerPromoOnCooldown } from "./isPartnerPromoOnCooldown";
import { partnerPromoKey } from "./partnerPromoKey";

const lastPromoAt = new Map<string, number>();

/**
 * After a positive economy payout, ping the user once per day with a
 * clickbait line that points at the partner ticket channel.
 * Only sends in the server that actually contains that channel.
 */
export const maybeSendPartnerPromo = async (
  economyChannel: TextBasedChannel,
  guildDiscordId: string,
  userId: string,
  now = Date.now(),
  link?: string,
) => {
  const key = `${partnerPromoKey(guildDiscordId, userId)}:${link ? "link" : "channel"}`;
  if (isPartnerPromoOnCooldown(lastPromoAt.get(key), now)) return;

  const partnerChannel = await economyChannel.client.channels.fetch(
    PARTNER_TICKET_CHANNEL_ID,
  );
  if (!partnerChannel?.isTextBased() || partnerChannel.isDMBased()) return;
  if (partnerChannel.guildId !== guildDiscordId) return;

  lastPromoAt.set(key, now);
  const destination = link ?? `<#${PARTNER_TICKET_CHANNEL_ID}>`;
  await economyChannel.send(
    `<@${userId}> Want to earn 3000 more coins? Check ${destination}`,
  );
};
