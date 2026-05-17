import {
  DISBOARD_BOT_ID,
  getDisboardBumpUser,
  hasSuccessfulBumpMessage,
  isDisboardBot,
  isDisboardBumpRewardMessage,
} from "./disboardBump";

const disboardAuthor = { bot: true, id: DISBOARD_BOT_ID, username: "DISBOARD" };
const otherBotAuthor = { bot: true, id: "123", username: "OtherBot" };

const bumper = { id: "999", username: "fueltool", avatarURL: () => null };

const baseMessage = (overrides: Record<string, unknown> = {}) =>
  ({
    author: { bot: false, id: "456", username: "Human" },
    content: "",
    embeds: [],
    mentions: { users: { first: () => undefined } },
    interaction: null,
    ...overrides,
  }) as any;

describe("disboardBump", () => {
  describe("isDisboardBot", () => {
    it("matches DISBOARD by id", () => {
      expect(isDisboardBot(baseMessage({ author: disboardAuthor }))).toBe(true);
    });

    it("rejects other bots", () => {
      expect(isDisboardBot(baseMessage({ author: otherBotAuthor }))).toBe(false);
    });
  });

  describe("hasSuccessfulBumpMessage", () => {
    it("detects Bump done! in content", () => {
      expect(
        hasSuccessfulBumpMessage(baseMessage({ content: "Bump done! 👍" }))
      ).toBe(true);
    });

    it("detects Bump done! in embed description", () => {
      expect(
        hasSuccessfulBumpMessage(
          baseMessage({
            embeds: [{ description: "Bump done! 👍 Check it out on DISBOARD." }],
          })
        )
      ).toBe(true);
    });

    it("rejects unrelated messages", () => {
      expect(hasSuccessfulBumpMessage(baseMessage({ content: "Please wait" }))).toBe(
        false
      );
    });
  });

  describe("getDisboardBumpUser", () => {
    it("prefers slash-command invoker from interaction metadata", () => {
      const message = baseMessage({
        interaction: { user: bumper },
        mentions: { users: { first: () => ({ id: "other" }) } },
      });

      expect(getDisboardBumpUser(message)).toBe(bumper);
    });

    it("falls back to first mention when interaction is missing", () => {
      const message = baseMessage({
        mentions: { users: { first: () => bumper } },
      });

      expect(getDisboardBumpUser(message)).toBe(bumper);
    });

    it("returns null when neither interaction nor mention exists", () => {
      expect(getDisboardBumpUser(baseMessage())).toBeNull();
    });
  });

  describe("isDisboardBumpRewardMessage", () => {
    it("is true for a typical DISBOARD bump reply", () => {
      const message = baseMessage({
        author: disboardAuthor,
        embeds: [{ description: "Bump done! 👍 Check it out on DISBOARD." }],
        interaction: { user: bumper },
      });

      expect(isDisboardBumpRewardMessage(message)).toBe(true);
    });

    it("is false without a resolvable bumper", () => {
      const message = baseMessage({
        author: disboardAuthor,
        embeds: [{ description: "Bump done! 👍" }],
      });

      expect(isDisboardBumpRewardMessage(message)).toBe(false);
    });
  });
});
