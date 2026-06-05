export const AI_ROLEPLAY_BUTTON_PREFIX = "ai-rp";

export const HF_ROLEPLAY_BASE_URL = "https://router.huggingface.co/v1";
export const HF_ROLEPLAY_MODEL = "deepseek-ai/DeepSeek-V4-Pro:novita";

export const SESSION_TTL_MS = 60 * 60 * 1000;

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
`.trim();
