type GradioFileLike = { url?: string; path?: string; orig_name?: string };

export const extractImageUrl = (value: unknown): string | null => {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") {
    const file = value as GradioFileLike;
    if (typeof file.url === "string") return file.url;
    if (typeof file.path === "string") return file.path;
  }
  return null;
};
