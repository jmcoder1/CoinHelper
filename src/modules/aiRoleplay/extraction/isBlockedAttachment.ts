import { Attachment } from "discord.js";
import { BLOCKED_CONTENT_TYPES } from "./attachmentContentTypes";

export const isBlockedAttachment = (attachment: Attachment): boolean =>
  Boolean(
    attachment.contentType && BLOCKED_CONTENT_TYPES.has(attachment.contentType),
  );
