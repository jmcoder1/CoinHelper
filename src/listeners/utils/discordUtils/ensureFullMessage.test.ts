import { ensureFullMessage } from "./ensureFullMessage";

describe("ensureFullMessage", () => {
  it("returns the message when body is already present", async () => {
    const message = {
      partial: false,
      content: "hello",
      attachments: { size: 0 },
      embeds: [],
      guildId: "1",
      fetch: jest.fn(),
    };

    await expect(ensureFullMessage(message as any)).resolves.toBe(message);
    expect(message.fetch).not.toHaveBeenCalled();
  });

  it("fetches when guild gateway body is empty", async () => {
    const fetched = { id: "fetched" };
    const message = {
      id: "1",
      partial: false,
      content: "",
      attachments: { size: 0 },
      embeds: [],
      guildId: "guild",
      fetch: jest.fn().mockResolvedValue(fetched),
    };

    await expect(ensureFullMessage(message as any)).resolves.toBe(fetched);
    expect(message.fetch).toHaveBeenCalled();
  });

  it("fetches partial messages", async () => {
    const fetched = { id: "fetched" };
    const message = {
      id: "1",
      partial: true,
      fetch: jest.fn().mockResolvedValue(fetched),
    };

    await expect(ensureFullMessage(message as any)).resolves.toBe(fetched);
    expect(message.fetch).toHaveBeenCalled();
  });
});
