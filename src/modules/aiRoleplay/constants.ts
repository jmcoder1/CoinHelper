export const AI_ROLEPLAY_BUTTON_PREFIX = "ai-rp";
export const AI_ROLEPLAY_ROLE_PREFIX = "ai-rp-role";
export const AI_ROLEPLAY_MODE_PREFIX = "ai-rp-mode";
export const AI_ROLEPLAY_DUO_INVITE_PREFIX = "ai-rp-duo";
export const AI_ROLEPLAY_END_PREFIX = "ai-rp-end";

export const ROLEPLAY_MODE_SOLO = "solo";
export const ROLEPLAY_MODE_DUO = "duo";

export const PENDING_STATUS_PICK_MODE = "pick_mode";
export const PENDING_STATUS_PICK_PARTNER = "pick_partner";
export const PENDING_STATUS_AWAIT_PARTNER = "await_partner_accept";
export const PENDING_STATUS_PICK_ROLE = "pick_role";

export const SESSION_STATUS_ACTIVE = "active";
export const SESSION_STATUS_ENDED = "ended";

export const ROLEPLAY_PLAYER_INITIATOR = "i";
export const ROLEPLAY_PLAYER_PARTNER = "p";

export const PENDING_START_TTL_MS = 10 * 60 * 1000;
export const MAX_ROLEPLAY_ROLES = 5;

export const HF_ROLEPLAY_BASE_URL = "https://router.huggingface.co/v1";
export const HF_ROLEPLAY_MODEL = "deepseek-ai/DeepSeek-V4-Pro:novita";

export const SESSION_TTL_MS = 60 * 60 * 1000;

export const MIN_CHOICES = 3;
export const MAX_CHOICES = 3;
export const CHOICE_MAX_LENGTH = 50;
export const DISCORD_BUTTON_LABEL_MAX = 80;

export const ROLEPLAY_BANNED_WORDS = [
  "lolicon",
  "shotacon",
  "loli",
  "shota",
  "cub",
  "young",
  "underage",
  "baby",
  "toddler",
  "child",
  "teenager",
  "chibi",
] as const;

export const JSON_RESPONSE_INSTRUCTION = `
Respond with valid JSON only, no markdown fences:
{"story":"your roleplay paragraphs here","choices":["choice 1","choice 2","choice 3"]}
Provide exactly 3 choices in the choices array.
Each choice must be a short action phrase, maximum ${CHOICE_MAX_LENGTH} characters.
No full sentences. Examples: "Beg for mercy", "Stay silent", "Fight back".
Escape double quotes inside story text with backslash. Use \\n for line breaks inside strings, not literal newlines.
`.trim();

export const PARSE_RETRY_INSTRUCTION = `
Your previous response was not valid JSON. Reply with valid JSON only, no markdown fences.
{"story":"...","choices":["choice 1","choice 2","choice 3"]}
Provide exactly 3 choices. Escape double quotes in story text. Use \\n for line breaks inside strings.
`.trim();
