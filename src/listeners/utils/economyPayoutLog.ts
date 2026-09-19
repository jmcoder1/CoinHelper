import { Attachment, Collection } from "discord.js";
import {
  isImageAttachment,
  isVideoAttachment,
} from "../../utils/apiUtils/discordUtils/attachmentContentTypes";

export type EconomyPayoutScope =
  | "reaction-add"
  | "reaction-remove"
  | "image-post";

export const economyLog = (
  scope: EconomyPayoutScope,
  message: string,
  details?: Record<string, unknown>,
) => {
  if (details && Object.keys(details).length > 0) {
    console.log(`[economy:${scope}] ${message}`, details);
    return;
  }
  console.log(`[economy:${scope}] ${message}`);
};

export const summarizeAttachments = (
  attachments: Collection<string, Attachment>,
) =>
  [...attachments.values()].map((attachment) => ({
    id: attachment.id,
    name: attachment.name,
    contentType: attachment.contentType ?? null,
    countedAsImageOrVideo:
      isImageAttachment(attachment) || isVideoAttachment(attachment),
  }));
