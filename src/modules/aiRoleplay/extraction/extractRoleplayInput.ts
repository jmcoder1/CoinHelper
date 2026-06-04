import { Message } from "discord.js";
import { ExtractRoleplayInputResult } from "../types";
import { isBlockedAttachment } from "./isBlockedAttachment";
import { isImageAttachment } from "./isImageAttachment";

export const extractRoleplayInput = (
  message: Message,
): ExtractRoleplayInputResult | null => {
  if (message.attachments.some(isBlockedAttachment)) return null;

  const imageAttachment = message.attachments.find(isImageAttachment);
  const caption = (message.content ?? "").trim();

  if (!caption && !imageAttachment) return null;

  return {
    caption: caption || "(no caption)",
    imageUrl: imageAttachment?.url ?? null,
  };
};
