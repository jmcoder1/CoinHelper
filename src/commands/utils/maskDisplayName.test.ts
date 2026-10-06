import { maskDisplayName } from "./maskDisplayName";

describe("maskDisplayName", () => {
  it("keeps the first 3 characters and stars the rest", () => {
    expect(maskDisplayName("JojoMasala")).toBe("Joj*******");
  });

  it("stars the end of a 4 character name", () => {
    expect(maskDisplayName("Alex")).toBe("Ale*");
  });

  it("stars short names after the first character", () => {
    expect(maskDisplayName("Bo")).toBe("B*");
  });

  it("returns stars for a blank name", () => {
    expect(maskDisplayName("   ")).toBe("***");
  });
});
