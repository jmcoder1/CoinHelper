export const bufferMagicHex = (buf: ArrayBuffer, n = 16) => {
  const slice = new Uint8Array(buf.slice(0, Math.min(buf.byteLength, n)));
  return Array.from(slice, (b) => b.toString(16).padStart(2, "0")).join(" ");
};
