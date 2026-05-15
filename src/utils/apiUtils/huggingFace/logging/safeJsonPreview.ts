export const safeJsonPreview = (value: unknown, maxString = 400): string => {
  try {
    return JSON.stringify(
      value,
      (_key, v) => {
        if (typeof v === "string" && v.length > maxString) {
          return `${v.slice(0, maxString)}…(${v.length} chars total)`;
        }
        return v;
      },
      0
    );
  } catch {
    return String(value);
  }
};
