import { Attachment } from "discord.js";

export const IMAGE_CONTENT_TYPES = new Set([
  "image/avif",
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/tiff",
  "image/vnd.microsoft.icon",
  "image/x-icon",
  "image/vnd.djvu",
  "image/svg+xml",
  "image/webp",
]);

export const VIDEO_CONTENT_TYPES = new Set([
  "video/mp4",
  "video/mpeg",
  "video/ogg",
  "video/quicktime",
  "video/webm",
]);

export const isImageContentType = (contentType?: string | null) =>
  Boolean(contentType && IMAGE_CONTENT_TYPES.has(contentType));

export const isVideoContentType = (contentType?: string | null) =>
  Boolean(contentType && VIDEO_CONTENT_TYPES.has(contentType));

export const isImageAttachment = (attachment: Attachment) =>
  isImageContentType(attachment.contentType);

export const isVideoAttachment = (attachment: Attachment) =>
  isVideoContentType(attachment.contentType);
