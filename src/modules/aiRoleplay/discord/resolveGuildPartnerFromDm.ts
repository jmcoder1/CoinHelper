import { Guild, Message } from "discord.js";
import { extractFirstMentionedUserId } from "./extractFirstMentionedUserId";

const SNOWFLAKE_RE = /^\d{17,20}$/;

export type ResolveGuildPartnerResult =
  | { ok: true; userId: string }
  | {
      ok: false;
      reason: "empty" | "not_found" | "self" | "bot" | "ambiguous";
      matches?: string[];
    };

const matchesQuery = (
  query: string,
  username: string,
  displayName: string,
  globalName: string | null,
): boolean => {
  const lower = query.toLowerCase();
  return (
    username.toLowerCase() === lower ||
    displayName.toLowerCase() === lower ||
    globalName?.toLowerCase() === lower
  );
};

const formatMemberLabel = (username: string, displayName: string): string =>
  displayName !== username ? `${displayName} (@${username})` : `@${username}`;

export const resolveGuildPartnerFromDm = async (
  message: Message,
  guild: Guild,
  initiatorId: string,
): Promise<ResolveGuildPartnerResult> => {
  const fromMention = extractFirstMentionedUserId(message, initiatorId);
  if (fromMention) {
    const member = await guild.members.fetch(fromMention).catch(() => null);
    if (!member) return { ok: false, reason: "not_found" };
    if (member.user.bot) return { ok: false, reason: "bot" };
    return { ok: true, userId: fromMention };
  }

  let query = message.content.trim();
  if (!query) return { ok: false, reason: "empty" };
  if (query.startsWith("@")) query = query.slice(1).trim();
  if (!query) return { ok: false, reason: "empty" };

  if (SNOWFLAKE_RE.test(query)) {
    if (query === initiatorId) return { ok: false, reason: "self" };

    const member = await guild.members.fetch(query).catch(() => null);
    if (!member) return { ok: false, reason: "not_found" };
    if (member.user.bot) return { ok: false, reason: "bot" };
    return { ok: true, userId: member.id };
  }

  const searchResults = await guild.members
    .search({ query, limit: 10 })
    .catch(() => null);

  if (!searchResults || searchResults.size === 0) {
    return { ok: false, reason: "not_found" };
  }

  const candidates = [...searchResults.values()].filter(
    (member) => member.id !== initiatorId && !member.user.bot,
  );

  if (candidates.length === 0) {
    return { ok: false, reason: "not_found" };
  }

  const exactMatches = candidates.filter((member) =>
    matchesQuery(
      query,
      member.user.username,
      member.displayName,
      member.user.globalName,
    ),
  );

  if (exactMatches.length === 1) {
    return { ok: true, userId: exactMatches[0].id };
  }

  if (exactMatches.length > 1) {
    return {
      ok: false,
      reason: "ambiguous",
      matches: exactMatches.map((member) =>
        formatMemberLabel(member.user.username, member.displayName),
      ),
    };
  }

  if (candidates.length === 1) {
    return { ok: true, userId: candidates[0].id };
  }

  return {
    ok: false,
    reason: "ambiguous",
    matches: candidates.map((member) =>
      formatMemberLabel(member.user.username, member.displayName),
    ),
  };
};
