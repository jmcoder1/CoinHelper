import { toBalanceUpdate } from "./toBalanceUpdate";

const MOCK_USER = {
  id: "1057036912210231437",
  username: "bobicus",
  name: "Bob",
  avatarURL: () => "testdoao",
};

const DISCORD_CLIENT = {
  users: {
    cache: {
      get: () => undefined,
    },
    fetch: async () => MOCK_USER,
  },
} as any;

describe("toBalanceUpdate from strings", () => {
  it("normal join = amount, userId, reason", async () => {
    await expect(
      toBalanceUpdate(
        DISCORD_CLIENT,
        "<@1057036912210231437> just joined. They were invited by <@1206422067919061032> who now has 12 invites!",
      ),
    ).resolves.toEqual({
      cashAmount: 100,
      user: {
        id: "1057036912210231437",
        name: "bobicus",
        iconURL: "testdoao",
      },
      reason: "join <@1057036912210231437>",
    });
  });

  it("invited herself = null", async () => {
    await expect(
      toBalanceUpdate(
        DISCORD_CLIENT,
        "<@1057036912210231437> has invited himself!",
      ),
    ).resolves.toEqual(null);
  });

  it("unkown inviter", async () => {
    await expect(
      toBalanceUpdate(
        DISCORD_CLIENT,
        "I am unable to tell you who invited <@1057036912210231437>. Maybe a temporary invite.!",
      ),
    ).resolves.toEqual(null);
  });

  it("vanity inviter", async () => {
    await expect(
      toBalanceUpdate(
        DISCORD_CLIENT,
        "<@1057036912210231437> has arrived by using the vanity invite 12",
      ),
    ).resolves.toEqual(null);
  });

  it("normal leave", async () => {
    await expect(
      toBalanceUpdate(
        DISCORD_CLIENT,
        "<@1057036912210231437> has left. He was invited by <@1206422067919061032>",
      ),
    ).resolves.toEqual({
      cashAmount: -110,
      user: {
        id: "1057036912210231437",
        name: "bobicus",
        iconURL: "testdoao",
      },
      reason: "leave <@1057036912210231437>",
    });
  });

  it("unkown inviter leave", async () => {
    await expect(
      toBalanceUpdate(
        DISCORD_CLIENT,
        "I don't know who invited <@1057036912210231437>",
      ),
    ).resolves.toEqual(null);
  });

  it("vanity inviter leave", async () => {
    await expect(
      toBalanceUpdate(
        DISCORD_CLIENT,
        "<@1057036912210231437> was invited using a vanity invite.",
      ),
    ).resolves.toEqual(null);
  });

  it("returns null when inviter cannot be fetched", async () => {
    const clientWithoutUser = {
      users: {
        cache: { get: () => undefined },
        fetch: async () => {
          throw new Error("Unknown User");
        },
      },
    } as any;

    await expect(
      toBalanceUpdate(
        clientWithoutUser,
        "<@1057036912210231437> just joined. They were invited by <@1206422067919061032> who now has 12 invites!",
      ),
    ).resolves.toEqual(null);
  });
});
