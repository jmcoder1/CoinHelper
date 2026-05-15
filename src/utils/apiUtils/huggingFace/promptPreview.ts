export const promptPreview = (p: string, max = 200) =>
  p.length <= max ? p : `${p.slice(0, max)}…(${p.length} chars total)`;
