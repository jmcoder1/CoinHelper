import { GuildMember, Message } from "discord.js";
import { prisma } from "../../../utils/apiUtils/prismaUtils/prisma";
import { getAppSettingNumber } from "../../../utils/apiUtils/prismaUtils/getAppSetting";
import {
  APP_SETTING_NEW_MEMBER_IMAGE_LIMIT,
  DEFAULT_NEW_MEMBER_IMAGE_LIMIT,
} from "../../../utils/apiUtils/prismaUtils/tierImageLimits";
import {
  BRONZE_ROLE_NAME,
  DIAMOND_ROLE_NAME,
  GOLD_ROLE_NAME,
  SILVER_ROLE_NAME,
  TIER_ROLE_NAMES,
} from "../../../utils/apiUtils/prismaUtils/constants";

export type ImagePostLimitTier =
  | "new"
  | typeof BRONZE_ROLE_NAME
  | typeof SILVER_ROLE_NAME
  | typeof GOLD_ROLE_NAME
  | typeof DIAMOND_ROLE_NAME;

export interface MemberImagePostLimit {
  /** null = unlimited (diamond) */
  maxImages: number | null;
  tier: ImagePostLimitTier;
}

const TIER_PRIORITY: ImagePostLimitTier[] = [
  DIAMOND_ROLE_NAME,
  GOLD_ROLE_NAME,
  SILVER_ROLE_NAME,
  BRONZE_ROLE_NAME,
];

const resolveTierFromRoles = (
  memberRoleIds: Set<string>,
  tierRoleIdByName: Map<string, string>,
): ImagePostLimitTier => {
  for (const tierName of TIER_PRIORITY) {
    const roleId = tierRoleIdByName.get(tierName);
    if (roleId && memberRoleIds.has(roleId)) return tierName;
  }
  return "new";
};

const limitForTier = (
  tier: ImagePostLimitTier,
  tierImageLimitByName: Map<string, number | null>,
  newMemberLimit: number,
): number | null => {
  if (tier === DIAMOND_ROLE_NAME) {
    return tierImageLimitByName.get(DIAMOND_ROLE_NAME) ?? null;
  }

  if (tier === "new") return newMemberLimit;

  const tierLimit = tierImageLimitByName.get(tier);
  if (tierLimit !== undefined) return tierLimit;

  return newMemberLimit;
};

export const getMemberImagePostLimit = async (
  message: Message,
  guildId: number,
): Promise<MemberImagePostLimit | null> => {
  if (!message.guild) return null;

  const newMemberLimit = await getAppSettingNumber(
    APP_SETTING_NEW_MEMBER_IMAGE_LIMIT,
    DEFAULT_NEW_MEMBER_IMAGE_LIMIT,
  );

  const tierRoles = await prisma.guildRole.findMany({
    where: {
      guildId,
      name: { in: [...TIER_ROLE_NAMES] },
    },
  });

  const tierRoleIdByName = new Map(
    tierRoles.map((role) => [role.name, role.discordId]),
  );
  const tierImageLimitByName = new Map(
    tierRoles.map((role) => [role.name, role.imageLimit]),
  );

  let member: GuildMember | null = message.member;
  if (!member) {
    member = await message.guild.members
      .fetch(message.author.id)
      .catch(() => null);
  }
  if (!member) return { maxImages: newMemberLimit, tier: "new" };

  const memberRoleIds = new Set(member.roles.cache.keys());
  const tier = resolveTierFromRoles(memberRoleIds, tierRoleIdByName);

  return {
    tier,
    maxImages: limitForTier(tier, tierImageLimitByName, newMemberLimit),
  };
};
