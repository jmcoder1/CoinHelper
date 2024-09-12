import { Guild } from "./types";

export const APP_NAME = "CoinHelper";

export const OP_GUILD: Guild = {
  id: "1271527781716725973",
  name: "OnePieceHentaiZ",
  currencyName: "Berry",
  currencyPluralName: "Berries",
  channels: {
    invitesChannelId: "1271884184733880441",
    economyChannelId: "1272985796844191765",
    playChannelId: "1278903155836456961",
  },
  images: {
    loading: [
      "https://iili.io/dNgXyas.gif",
      "https://media.discordapp.net/attachments/1274743214053789738/1278381923357687879/D5DA5DC2-9DA6-47CB-AB82-0B8D9E2DF4C2.gif?ex=66d730f1&is=66d5df71&hm=7136b0eb19e3ee2e9c57a3a3d7f694b066c9f330ee6e80f0f154b981d50de504&=&width=454&height=545",
      "https://media.discordapp.net/attachments/1274743214053789738/1276663756767756388/9d86b4df30c39c52a8e526d0110f0d58.gif?ex=66d78846&is=66d636c6&hm=9ea71a24f7211b55aadb36e991e61a68fefa8b5401b47bfa0058cbe5c655b3cd&=&width=800&height=450",
      "https://media.discordapp.net/attachments/1274743214053789738/1276663709627846707/cf83367216908fd516a2db837fde9a46.gif?ex=66d7883b&is=66d636bb&hm=7c23fbcea87f2610127512cd66befc5838f393706fd80fa94de9e60cfc21856c&=&width=969&height=545",
      "https://media.discordapp.net/attachments/1274743214053789738/1276663574512533588/6859c7326c0ccf349c7b9f7c0c4a6316.gif?ex=66d7881b&is=66d6369b&hm=586061f140de50da16e85f64497932f028602adc0739df68bb0538e0d6c34456&=&width=969&height=545",
    ],
  },
};

export const BMB_GUILD: Guild = {
  id: "1215158193634938921",
  name: "BMB",
  currencyName: "Coin",
  currencyPluralName: "Coins",
  channels: {
    invitesChannelId: "1216937502368071772",
    economyChannelId: "1283233463121477763",
    playChannelId: "1283234433763115122",
  },
  images: {
    loading: [],
  },
};
export const guilds: Guild[] = [OP_GUILD, BMB_GUILD];
