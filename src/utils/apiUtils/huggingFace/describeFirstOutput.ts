export const describeFirstOutput = (value: unknown): Record<string, unknown> => {
  if (value === null || value === undefined) {
    return { type: typeof value, value: String(value) };
  }
  if (typeof value === "string") {
    return {
      type: "string",
      length: value.length,
      prefix: value.slice(0, 120),
    };
  }
  if (typeof value === "object") {
    const o = value as Record<string, unknown>;
    return {
      type: "object",
      keys: Object.keys(o),
      url: typeof o.url === "string" ? o.url.slice(0, 200) : undefined,
      path: typeof o.path === "string" ? o.path.slice(0, 200) : undefined,
    };
  }
  return { type: typeof value };
};
