import { Attachment, Collection } from "discord.js";
import { isBlockedAttachment } from "./isBlockedAttachment";

export const hasBlockedMedia = (
  attachments: Collection<string, Attachment>,
): boolean => attachments.some(isBlockedAttachment);
