import { ResolveGuildPartnerResult } from "./resolveGuildPartnerFromDm";

export const buildPartnerResolveErrorMessage = (
  result: Extract<ResolveGuildPartnerResult, { ok: false }>,
): string => {
  switch (result.reason) {
    case "empty":
      return "Reply with your partner's **@username**, **display name**, or **user ID** (they must be in the server).";
    case "self":
      return "You can't duo roleplay with yourself. Name someone else.";
    case "bot":
      return "You can't invite a bot. Pick a server member.";
    case "not_found":
      return "No server member matched that. Try their @username, display name, or user ID.";
    case "ambiguous":
      return `Several members matched. Be more specific or use their user ID:\n${(result.matches ?? []).map((name) => `• ${name}`).join("\n")}`;
  }
};
