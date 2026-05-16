import { GuildMember, Message } from "discord.js";
import { prisma } from "../../../utils/apiUtils/prismaUtils/prisma";
import {
  BRONZE_ROLE_NAME,
  DIAMOND_ROLE_NAME,
  GOLD_ROLE_NAME,
  NEW_MEMBER_IMAGE_LIMIT,
  SILVER_ROLE_NAME,
  TIER_IMAGE_LIMIT_BY_ROLE_NAME,
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
  tierRoleIdByName: Map<string, string>
): ImagePostLimitTier => {
  for (const tierName of TIER_PRIORITY) {
    const roleId = tierRoleIdByName.get(tierName);
    if (roleId && memberRoleIds.has(roleId)) return tierName;
  }
  return "new";
};

const limitForTier = (tier: ImagePostLimitTier): number | null => {
  if (tier === DIAMOND_ROLE_NAME) return null;
  if (tier === "new") return NEW_MEMBER_IMAGE_LIMIT;
  return TIER_IMAGE_LIMIT_BY_ROLE_NAME[tier] ?? NEW_MEMBER_IMAGE_LIMIT;
};

export const getMemberImagePostLimit = async (
  message: Message,
  guildId: number
): Promise<MemberImagePostLimit | null> => {
  if (!message.guild) return null;

  const tierRoles = await prisma.guildRole.findMany({
    where: {
      guildId,
      name: { in: [...TIER_ROLE_NAMES] },
    },
  });

  const tierRoleIdByName = new Map(
    tierRoles.map((role) => [role.name, role.discordId])
  );

  let member: GuildMember | null = message.member;
  if (!member) {
    member = await message.guild.members
      .fetch(message.author.id)
      .catch(() => null);
  }
  if (!member) return { maxImages: NEW_MEMBER_IMAGE_LIMIT, tier: "new" };

  const memberRoleIds = new Set(member.roles.cache.keys());
  const tier = resolveTierFromRoles(memberRoleIds, tierRoleIdByName);

  return {
    tier,
    maxImages: limitForTier(tier),
  };
};
