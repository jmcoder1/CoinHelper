import { toBalanceUpdate } from "./toBalanceUpdate";

const DISCORD_CLIENT = {
  users: {
    cache: {
      get: () => {
        return {
          id: "1057036912210231437",
          username: "bobicus",
          name: "Bob",
          avatarURL: () => "testdoao",
        };
      },
    },
  },
} as any;

describe("toBalanceUpdate from strings", () => {
  it("normal join = amount, userId, reason", async () => {
    expect(
      toBalanceUpdate(
        DISCORD_CLIENT,
        "<@1057036912210231437> just joined. They were invited by <@1206422067919061032> who now has 12 invites!",
      ),
    ).toEqual({
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
    expect(
      toBalanceUpdate(
        DISCORD_CLIENT,
        "<@1057036912210231437> has invited himself!",
      ),
    ).toEqual(null);
  });

  it("unkown inviter", async () => {
    expect(
      toBalanceUpdate(
        DISCORD_CLIENT,
        "I am unable to tell you who invited <@1057036912210231437>. Maybe a temporary invite.!",
      ),
    ).toEqual(null);
  });

  it("vanity inviter", async () => {
    expect(
      toBalanceUpdate(
        DISCORD_CLIENT,
        "<@1057036912210231437> has arrived by using the vanity invite 12",
      ),
    ).toEqual(null);
  });

  it("normal leave", async () => {
    expect(
      toBalanceUpdate(
        DISCORD_CLIENT,
        "<@1057036912210231437> has left. He was invited by <@1206422067919061032>",
      ),
    ).toEqual({
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
    expect(
      toBalanceUpdate(
        DISCORD_CLIENT,
        "I don't know who invited <@1057036912210231437>",
      ),
    ).toEqual(null);
  });

  it("vanity inviter leave", async () => {
    expect(
      toBalanceUpdate(
        DISCORD_CLIENT,
        "<@1057036912210231437> was invited using a vanity invite.",
      ),
    ).toEqual(null);
  });
});
