/** Channel-name emojis that mark rock → diamond media channels. */
export const TIER_CHANNEL_EMOJIS = ["🪨", "🥉", "🥈", "🥇", "💎"] as const;

/** Default guild setting for roleplay-channel name emoji (+50 media bonus). */
export const DEFAULT_ROLEPLAY_CHANNEL_EMOJI = "🗣️";

/** Flat coin bonus added once per media post in a roleplay-marked channel. */
export const ROLEPLAY_CHANNEL_POST_BONUS = 50;

const TIER_CHANNEL_MULTIPLIERS: Record<
  (typeof TIER_CHANNEL_EMOJIS)[number],
  number
> = {
  "🪨": 5,
  "🥉": 10,
  "🥈": 15,
  "🥇": 20,
  "💎": 25,
};

/** True when the Discord channel name includes a rock→diamond tier emoji. */
export const isRockDiamondChannel = (channelName: string): boolean =>
  TIER_CHANNEL_EMOJIS.some((emoji) => channelName.includes(emoji));

export const getImageMultiplier = (channelName: string): number => {
  for (const emoji of TIER_CHANNEL_EMOJIS) {
    if (channelName.includes(emoji)) return TIER_CHANNEL_MULTIPLIERS[emoji];
  }
  return 0;
};

/** True when the channel name includes the guild's configured roleplay emoji. */
export const isRoleplayBonusChannel = (
  channelName: string,
  roleplayChannelEmoji: string | null | undefined
): boolean => {
  const emoji = (roleplayChannelEmoji || DEFAULT_ROLEPLAY_CHANNEL_EMOJI).trim();
  if (!emoji) return false;
  return channelName.includes(emoji);
};
