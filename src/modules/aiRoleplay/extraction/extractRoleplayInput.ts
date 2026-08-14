import { Message } from "discord.js";
import { ExtractRoleplayInputResult } from "../types";
import { isImageAttachment } from "../../../utils/apiUtils/discordUtils/attachmentContentTypes";

export const extractRoleplayInput = (
  message: Message,
): ExtractRoleplayInputResult | null => {
  const caption = (message.content ?? "").trim();
  if (!caption) return null;

  const imageAttachment = message.attachments.find(isImageAttachment);

  return {
    caption,
    imageUrl: imageAttachment?.url ?? null,
  };
};
