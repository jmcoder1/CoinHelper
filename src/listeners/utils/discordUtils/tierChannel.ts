/** Channel-name emojis that mark rock → diamond media channels. */
export const TIER_CHANNEL_EMOJIS = ["🪨", "🥉", "🥈", "🥇", "💎"] as const;

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
