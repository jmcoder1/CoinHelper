import { Guild as DiscordGuild, GuildMember } from "discord.js";
import { prisma } from "../../utils/apiUtils/prismaUtils/prisma";

export const listActiveStoreItems = (guildId: number) =>
  prisma.storeItem.findMany({
    where: {
      guildId,
      listed: true,
      deletedAt: null,
    },
    include: {
      roleActions: true,
      roleRequirements: true,
    },
    orderBy: [{ price: "asc" }, { name: "asc" }],
  });

export const findActiveStoreItemByName = (guildId: number, name: string) =>
  prisma.storeItem.findFirst({
    where: {
      guildId,
      listed: true,
      deletedAt: null,
      name: { equals: name.trim(), mode: "insensitive" },
    },
    include: {
      roleActions: true,
      roleRequirements: true,
    },
  });

export type StoreItemWithRoles = NonNullable<
  Awaited<ReturnType<typeof findActiveStoreItemByName>>
>;

export const roleMention = (discordRoleId: string) => `<@&${discordRoleId}>`;

export const formatRoleList = (
  discordGuild: DiscordGuild,
  roleIds: string[]
): string => {
  if (roleIds.length === 0) return "None";
  return roleIds
    .map((id) => {
      const role = discordGuild.roles.cache.get(id);
      return role ? `${roleMention(id)} (${role.name})` : roleMention(id);
    })
    .join(", ");
};

export const missingRequirementRoleIds = (
  member: GuildMember,
  item: StoreItemWithRoles
): string[] =>
  item.roleRequirements
    .map((row) => row.discordRoleId)
    .filter((roleId) => !member.roles.cache.has(roleId));

/** Action roles the member does not already have. */
export const missingActionRoleIds = (
  member: GuildMember,
  item: StoreItemWithRoles
): string[] =>
  item.roleActions
    .map((row) => row.discordRoleId)
    .filter((roleId) => !member.roles.cache.has(roleId));
