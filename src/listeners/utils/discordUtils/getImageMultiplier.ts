export const getImageMultiplier = (channelName: string) => {
  if (channelName.includes("🪨")) return 5;
  if (channelName.includes("🥉")) return 10;
  if (channelName.includes("🥈")) return 15;
  if (channelName.includes("🥇")) return 20;
  if (channelName.includes("💎")) return 25;

  return 0;
};
