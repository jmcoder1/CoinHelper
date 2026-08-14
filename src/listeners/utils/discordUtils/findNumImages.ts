import { Attachment, Collection } from "discord.js";
import {
  isImageAttachment,
  isVideoAttachment,
} from "../../../utils/apiUtils/discordUtils/attachmentContentTypes";

export const findNumImages = (attachments: Collection<string, Attachment>) => {
  let numImages = 0;
  for (let i = 0; i < attachments.size; i++) {
    const attachment = attachments.at(i);
    if (!attachment) return;

    if (isImageAttachment(attachment) || isVideoAttachment(attachment))
      numImages = numImages + 1;
  }
  return numImages;
};
