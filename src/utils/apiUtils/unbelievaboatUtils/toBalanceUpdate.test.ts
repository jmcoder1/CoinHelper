import { OP_GUILD } from "../discordUtils/constants";
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
    // normal join
    expect(
      toBalanceUpdate(
        DISCORD_CLIENT,
        "<@1057036912210231437> just joined. They were invited by <@1206422067919061032> who now has 12 invites!",
        {
          guildId: OP_GUILD.id,
          currencyPluralName: OP_GUILD.currencyPluralName,
          economyChannelId: OP_GUILD.channels.economyChannelId,
        }
      )
    ).toEqual({
      cashAmount: 100,
      user: {
        id: "1057036912210231437",
        name: "bobicus",
        iconURL: "testdoao",
        guild: {
          id: OP_GUILD.id,
          currencyPluralName: OP_GUILD.currencyPluralName,
          economyChannelId: OP_GUILD.channels.economyChannelId,
        },
      },
      reason: "join <@1057036912210231437>",
    });
  });

  it("invited herself = null", async () => {
    // invited himself
    expect(
      toBalanceUpdate(
        DISCORD_CLIENT,
        "<@1057036912210231437> has invited himself!",
        {
          guildId: OP_GUILD.id,
          currencyPluralName: OP_GUILD.currencyPluralName,
          economyChannelId: OP_GUILD.channels.economyChannelId,
        }
      )
    ).toEqual(null);
  });

  it("unkown inviter", async () => {
    expect(
      toBalanceUpdate(
        DISCORD_CLIENT,
        "I am unable to tell you who invited <@1057036912210231437>. Maybe a temporary invite.!",
        {
          guildId: OP_GUILD.id,
          currencyPluralName: OP_GUILD.currencyPluralName,
          economyChannelId: OP_GUILD.channels.economyChannelId,
        }
      )
    ).toEqual(null);
  });

  it("vanity inviter", async () => {
    expect(
      toBalanceUpdate(
        DISCORD_CLIENT,
        "<@1057036912210231437> has arrived by using the vanity invite 12",
        {
          guildId: OP_GUILD.id,
          currencyPluralName: OP_GUILD.currencyPluralName,
          economyChannelId: OP_GUILD.channels.economyChannelId,
        }
      )
    ).toEqual(null);
  });

  it("normal leave", async () => {
    expect(
      toBalanceUpdate(
        DISCORD_CLIENT,
        "<@1057036912210231437> has left. He was invited by <@1206422067919061032>",
        {
          guildId: OP_GUILD.id,
          currencyPluralName: OP_GUILD.currencyPluralName,
          economyChannelId: OP_GUILD.channels.economyChannelId,
        }
      )
    ).toEqual({
      cashAmount: -110,
      user: {
        id: "1057036912210231437",
        name: "bobicus",
        iconURL: "testdoao",
        guild: {
          id: OP_GUILD.id,
          currencyPluralName: OP_GUILD.currencyPluralName,
          economyChannelId: OP_GUILD.channels.economyChannelId,
        },
      },
      reason: "leave <@1057036912210231437>",
    });
  });

  it("unkown inviter leave", async () => {
    expect(
      toBalanceUpdate(
        DISCORD_CLIENT,
        "I don't know who invited <@1057036912210231437>",
        {
          guildId: OP_GUILD.id,
          currencyPluralName: OP_GUILD.currencyPluralName,
          economyChannelId: OP_GUILD.channels.economyChannelId,
        }
      )
    ).toEqual(null);
  });

  it("vanity inviter leave", async () => {
    expect(
      toBalanceUpdate(
        DISCORD_CLIENT,
        "<@1057036912210231437> was invited using a vanity invite.",
        {
          guildId: OP_GUILD.id,
          currencyPluralName: OP_GUILD.currencyPluralName,
          economyChannelId: OP_GUILD.channels.economyChannelId,
        }
      )
    ).toEqual(null);
  });
});
