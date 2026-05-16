import type { ImagePostLimitTier } from "./getMemberImagePostLimit";

const tierLabel: Record<ImagePostLimitTier, string> = {
  new: "New members",
  bronze: "Bronze members",
  silver: "Silver members",
  gold: "Gold members",
  diamond: "Diamond members",
};

export const formatImageLimitExceededMessage = (
  tier: ImagePostLimitTier,
  maxImages: number,
  postedCount: number
): string => {
  const label = tierLabel[tier];
  const imageWord = maxImages === 1 ? "image" : "images";
  return `${label} can only post ${maxImages} ${imageWord} at a time. You posted ${postedCount}.`;
};
