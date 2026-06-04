import { Attachment } from "discord.js";
import { IMAGE_CONTENT_TYPES } from "./attachmentContentTypes";

export const isImageAttachment = (attachment: Attachment): boolean =>
  Boolean(
    attachment.contentType && IMAGE_CONTENT_TYPES.has(attachment.contentType),
  );
