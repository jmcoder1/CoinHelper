import { Attachment, Collection } from "discord.js";

export const findNumImages = (attachments: Collection<string, Attachment>) => {
  let numImages = 0;
  for (let i = 0; i < attachments.size; i++) {
    const attachment = attachments.at(i);
    if (!attachment) return;

    if (
      attachment.contentType &&
      [
        "image/gif",
        "image/jpeg",
        "image/png",
        "image/tiff",
        "image/vnd.microsoft.icon",
        "image/x-icon",
        "image/vnd.djvu",
        "image/svg+xml",
      ].includes(attachment.contentType)
    )
      numImages = numImages + 1;
  }
  return numImages;
};
