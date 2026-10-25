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

const IMAGE_EXTENSIONS = new Set([
  "avif",
  "gif",
  "jpeg",
  "jpg",
  "png",
  "tif",
  "tiff",
  "ico",
  "svg",
  "webp",
]);

const VIDEO_EXTENSIONS = new Set([
  "mp4",
  "mpeg",
  "mpg",
  "ogg",
  "ogv",
  "mov",
  "webm",
  "m4v",
]);

/** Strip parameters (`image/webp; charset=binary` → `image/webp`). */
export const normalizeContentType = (
  contentType?: string | null
): string | null => {
  if (!contentType) return null;
  const base = contentType.split(";")[0]?.trim().toLowerCase();
  return base || null;
};

const extensionOf = (name?: string | null): string | null => {
  if (!name) return null;
  const bare = name.split(/[?#]/)[0] ?? name;
  const dot = bare.lastIndexOf(".");
  if (dot < 0 || dot === bare.length - 1) return null;
  return bare.slice(dot + 1).toLowerCase();
};

export const isImageContentType = (contentType?: string | null) => {
  const normalized = normalizeContentType(contentType);
  return Boolean(normalized && IMAGE_CONTENT_TYPES.has(normalized));
};

export const isVideoContentType = (contentType?: string | null) => {
  const normalized = normalizeContentType(contentType);
  return Boolean(normalized && VIDEO_CONTENT_TYPES.has(normalized));
};

export const isImageAttachment = (attachment: Attachment) => {
  if (isImageContentType(attachment.contentType)) return true;
  const ext = extensionOf(attachment.name);
  return Boolean(ext && IMAGE_EXTENSIONS.has(ext));
};

export const isVideoAttachment = (attachment: Attachment) => {
  if (isVideoContentType(attachment.contentType)) return true;
  const ext = extensionOf(attachment.name);
  return Boolean(ext && VIDEO_EXTENSIONS.has(ext));
};
