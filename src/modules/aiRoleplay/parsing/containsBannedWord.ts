import { ROLEPLAY_BANNED_WORDS } from "../constants";
import { containsAnyOf } from "./containsAnyOf";

export const containsBannedWord = (text: string): boolean =>
  containsAnyOf(ROLEPLAY_BANNED_WORDS, text);
