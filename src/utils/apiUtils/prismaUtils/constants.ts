// Channel names for the guilds
export const ANNOUNCEMENT_CHANNEL_NAME = "announcement";
export const LEVELS_CHANNEL_NAME = "levels";
export const INVITES_CHANNEL_NAME = "invites";
export const ECONOMY_CHANNEL_NAME = "economy";
export const COMMANDS_CHANNEL_NAME = "commands";
export const PLAY_CHANNEL_NAME = "play";
export const PREVIEW_CHANNEL_NAME = "preview";
export const BOUGHT_COINS_CHANNEL_NAME = "bought-coins";
export const AI_GEN_IMAGE_TIPS_CHANNEL_NAME = "ai-gen-image-tips";
export const AI_IMAGE_CHANNEL_NAME = "ai-image";
export const NEW_CHANNEL_MOD_CHANNEL_NAME = "new-channel-mod";
export const DM_REQUEST_CHANNEL_NAME = "dm-request";
export const ROLEPLAY_REQUEST_CHANNEL_NAME = "roleplay-request";
export const SAUCE_REQUEST_CHANNEL_NAME = "sauce-request";
export const CAPTION_REQUEST_CHANNEL_NAME = "caption-request";
export const TRANSLATION_REQUEST_CHANNEL_NAME = "translation-request";

// Channel names for the guilds
export const PREVIEW_ROLE_NAME = "preview";
export const NEW_CHANNEL_ROLE_NAME = "new-channel";
export const DELETE_MESSAGE_ROLE_NAME = "delete-message";
export const MANAGE_REQUEST_ROLE_NAME = "manage-request";
export const BRONZE_ROLE_NAME = "bronze";
export const SILVER_ROLE_NAME = "silver";
export const GOLD_ROLE_NAME = "gold";
export const DIAMOND_ROLE_NAME = "diamond";

export const TIER_ROLE_NAMES = [
  BRONZE_ROLE_NAME,
  SILVER_ROLE_NAME,
  GOLD_ROLE_NAME,
  DIAMOND_ROLE_NAME,
] as const;

export const OP_GUILD = {
  id: "1271527781716725973",
  name: "OnePieceHentaiZ",
  currencyName: "Berry",
  currencyPluralName: "Berries",
  channels: [
    {
      discordId: "1271844114597548154",
      name: ANNOUNCEMENT_CHANNEL_NAME,
    },
    {
      discordId: "1317619314349572188",
      name: LEVELS_CHANNEL_NAME,
    },
    {
      discordId: "1271884184733880441",
      name: INVITES_CHANNEL_NAME,
    },
    {
      discordId: "1272985796844191765",
      name: ECONOMY_CHANNEL_NAME,
    },
    {
      discordId: "1273675917910081589",
      name: COMMANDS_CHANNEL_NAME,
    },
    {
      discordId: "1278903155836456961",
      name: PLAY_CHANNEL_NAME,
    },
    {
      discordId: "1278515096233967616",
      name: PREVIEW_CHANNEL_NAME,
    },
    {
      discordId: "1279224913978462218",
      name: BOUGHT_COINS_CHANNEL_NAME,
    },
    {
      discordId: "1283114792248147998",
      name: AI_IMAGE_CHANNEL_NAME,
    },
    {
      discordId: "1362130473173913760",
      name: NEW_CHANNEL_MOD_CHANNEL_NAME,
    },
    {
      discordId: "1271843643036012625",
      name: DM_REQUEST_CHANNEL_NAME,
    },
    {
      discordId: "1271846932893011999",
      name: ROLEPLAY_REQUEST_CHANNEL_NAME,
    },
    {
      discordId: "1363625638468255887",
      name: SAUCE_REQUEST_CHANNEL_NAME,
    },
    {
      discordId: "1366202246823411742",
      name: CAPTION_REQUEST_CHANNEL_NAME,
    },
    {
      discordId: "1366202159867105340",
      name: TRANSLATION_REQUEST_CHANNEL_NAME,
    },
  ],
  images: {
    currency:
      "https://static.wikia.nocookie.net/onepiece/images/c/cb/Wano_Country%27s_Gold.png/revision/latest?cb=20200210015552",
  },
  roles: [
    {
      discordId: "1302671208386396160",
      name: PREVIEW_ROLE_NAME,
    },
    {
      discordId: "1302671235444117624",
      name: NEW_CHANNEL_ROLE_NAME,
    },
    {
      discordId: "1362894473499246835",
      name: DELETE_MESSAGE_ROLE_NAME,
    },
    {
      discordId: "1363636566160834640",
      name: MANAGE_REQUEST_ROLE_NAME,
    },
    { discordId: "1272730232792809472", name: BRONZE_ROLE_NAME },
    { discordId: "1272730425357504512", name: SILVER_ROLE_NAME },
    { discordId: "1272730473319108668", name: GOLD_ROLE_NAME },
    { discordId: "1272730498300379217", name: DIAMOND_ROLE_NAME },
  ],
  removalReasons: [
    {
      title: "Rule 1: You must be 18+",
      value: "This is an adult-only NSFW server",
    },
    {
      title: "Rule 2: No doxxing",
      value: "No doxxing",
    },
    {
      title: "Rule 3: Using @everyone ping",
      value: "Do not use the @everyone ping",
    },
    {
      title: "Rule 4: No paywall content",
      value: "No paywall content",
    },
    { title: "Rule 5: No leaks", value: "No leaks" },
    { title: "Rule 6: OP theme", value: "All content must be OP-themed" },
    { title: "Rule 7: No IRL pictures", value: "No IRL pictures" },
    {
      title: "Rule 8: Captions only",
      value: "Captions must be burned or side by side the media",
    },
    {
      title: "Inappropriate request",
      value: "Request in the wrong channel",
    },
    {
      title: "Repost",
      value: "Your post is a repost",
    },
  ],
};

export const BMB_GUILD = {
  id: "1215158193634938921",
  name: "Bang My Bully",
  currencyName: "Coin",
  currencyPluralName: "Coins",
  channels: [
    {
      discordId: "1216937367676649563",
      name: ANNOUNCEMENT_CHANNEL_NAME,
    },
    {
      discordId: "1317536726838677576",
      name: LEVELS_CHANNEL_NAME,
    },
    {
      discordId: "1216937502368071772",
      name: INVITES_CHANNEL_NAME,
    },
    {
      discordId: "1283233463121477763",
      name: ECONOMY_CHANNEL_NAME,
    },
    {
      discordId: "1283233956828811388",
      name: COMMANDS_CHANNEL_NAME,
    },
    {
      discordId: "1283234433763115122",
      name: PLAY_CHANNEL_NAME,
    },
    {
      discordId: "1283252619388911697",
      name: PREVIEW_CHANNEL_NAME,
    },
    {
      discordId: "1283233838763606086",
      name: BOUGHT_COINS_CHANNEL_NAME,
    },
    {
      discordId: "1302472227840725012",
      name: AI_GEN_IMAGE_TIPS_CHANNEL_NAME,
    },
    {
      discordId: "1295968174839435306",
      name: AI_IMAGE_CHANNEL_NAME,
    },
    {
      discordId: "1359643627269390336",
      name: NEW_CHANNEL_MOD_CHANNEL_NAME,
    },
    {
      discordId: "1283252315465191566",
      name: DM_REQUEST_CHANNEL_NAME,
    },
    {
      discordId: "1283252490753671178",
      name: ROLEPLAY_REQUEST_CHANNEL_NAME,
    },
    {
      discordId: "1319411062189195304",
      name: SAUCE_REQUEST_CHANNEL_NAME,
    },
    {
      discordId: "1362188356024406117",
      name: CAPTION_REQUEST_CHANNEL_NAME,
    },
    {
      discordId: "1318962911380635648",
      name: TRANSLATION_REQUEST_CHANNEL_NAME,
    },
  ],
  images: {
    currency:
      "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExNzhqd2I1OHhycXNmNTAwb3UybzU4NHcweDF0Y2t2Y21sbm1ya2p4byZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/4ZcXo1CQTZypGNpR4z/giphy.webp",
  },
  roles: [
    { discordId: "1301614832277000244", name: PREVIEW_ROLE_NAME },
    {
      discordId: "1301614797292441642",
      name: NEW_CHANNEL_ROLE_NAME,
    },
    {
      discordId: "1362890996865695875",
      name: DELETE_MESSAGE_ROLE_NAME,
    },
    {
      discordId: "1363636001674756096",
      name: MANAGE_REQUEST_ROLE_NAME,
    },
    { discordId: "1283227873418940488", name: BRONZE_ROLE_NAME },
    { discordId: "1283227827553959977", name: SILVER_ROLE_NAME },
    { discordId: "1283227791441264743", name: GOLD_ROLE_NAME },
    { discordId: "1283227691251794044", name: DIAMOND_ROLE_NAME },
  ],
  removalReasons: [
    {
      title: "Rule 1: You must be 18+",
      value: "This is an adult-only NSFW server",
    },
    {
      title: "Rule 2: No doxxing",
      value: "No doxxing",
    },
    {
      title: "Rule 3: Using @everyone ping",
      value: "Do not use the @everyone ping",
    },
    {
      title: "Rule 4: No paywall content",
      value: "No paywall content",
    },
    { title: "Rule 5: No leaks", value: "No leaks" },
    { title: "Rule 6: Bully theme", value: "All content must be bully-themed" },
    { title: "Rule 7: No IRL pictures", value: "No IRL pictures" },
    {
      title: "Rule 8: Captions only",
      value: "Captions must be burned or side by side the media",
    },
    {
      title: "Inappropriate request",
      value: "Request in the wrong channel",
    },
    {
      title: "Repost",
      value: "Your post is a repost",
    },
  ],
};

export const Tt_GUILD = {
  id: "1323043338903097445",
  name: "Sissytopia",
  currencyName: "Coin",
  currencyPluralName: "Coins",
  channels: [
    {
      discordId: "1323046507552702536",
      name: ANNOUNCEMENT_CHANNEL_NAME,
    },
    {
      discordId: "1323753964340252703",
      name: LEVELS_CHANNEL_NAME,
    },
    {
      discordId: "1323046385141944320",
      name: INVITES_CHANNEL_NAME,
    },
    {
      discordId: "1323745285893263502",
      name: ECONOMY_CHANNEL_NAME,
    },
    {
      discordId: "1323760643580624896",
      name: COMMANDS_CHANNEL_NAME,
    },
    {
      discordId: "1323747470295171142",
      name: PLAY_CHANNEL_NAME,
    },
    {
      discordId: "1323047319259840663",
      name: PREVIEW_CHANNEL_NAME,
    },
    {
      discordId: "1323753795251077212",
      name: BOUGHT_COINS_CHANNEL_NAME,
    },
    {
      discordId: "1323760824572968970",
      name: AI_IMAGE_CHANNEL_NAME,
    },
    {
      discordId: "1362130610595827863",
      name: NEW_CHANNEL_MOD_CHANNEL_NAME,
    },
    {
      discordId: "1323455646087123006",
      name: DM_REQUEST_CHANNEL_NAME,
    },
    {
      discordId: "1323455695319732244",
      name: ROLEPLAY_REQUEST_CHANNEL_NAME,
    },
    {
      discordId: "1323455587736096928",
      name: SAUCE_REQUEST_CHANNEL_NAME,
    },
    {
      discordId: "1364066523701973062",
      name: CAPTION_REQUEST_CHANNEL_NAME,
    },
    {
      discordId: "1364066632955330644",
      name: TRANSLATION_REQUEST_CHANNEL_NAME,
    },
  ],
  images: {
    currency:
      "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExc29vcnB1aHFyeGFqcTRzMW43aTIxMTZ5Zms2d2tvOXV6bHduNDdrOSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/oXCoG04rCxSSs/200w.webp",
  },
  roles: [
    { discordId: "1323742269005893652", name: PREVIEW_ROLE_NAME },
    { discordId: "1323742298126811158", name: NEW_CHANNEL_ROLE_NAME },

    {
      discordId: "1362893885528867086",
      name: DELETE_MESSAGE_ROLE_NAME,
    },
    {
      discordId: "1363636851793199314",
      name: MANAGE_REQUEST_ROLE_NAME,
    },
    { discordId: "1323436068741054475", name: BRONZE_ROLE_NAME },
    { discordId: "1323435938109718582", name: SILVER_ROLE_NAME },
    { discordId: "1323435890231742474", name: GOLD_ROLE_NAME },
    { discordId: "1323435854261125140", name: DIAMOND_ROLE_NAME },
  ],
  removalReasons: [
    {
      title: "Rule 1: You must be 18+",
      value: "This is an adult-only NSFW server",
    },
    {
      title: "Rule 2: No doxxing",
      value: "No doxxing",
    },
    {
      title: "Rule 3: Using @everyone ping",
      value: "Do not use the @everyone ping",
    },
    {
      title: "Rule 4: No paywall content",
      value: "No paywall content",
    },
    { title: "Rule 5: No leaks", value: "No leaks" },
    { title: "Rule 6: Sissy theme", value: "All content must be sissy-themed" },
    { title: "Rule 7: No IRL pictures", value: "No IRL pictures" },
    {
      title: "Rule 8: Captions only",
      value: "Captions must be burned or side by side the media",
    },
    {
      title: "Inappropriate request",
      value: "Request in the wrong channel",
    },
    {
      title: "Repost",
      value: "Your post is a repost",
    },
  ],
};

export const CUCK_GUILD = {
  id: "1367954490237386882",
  name: "CuckCaptions",
  currencyName: "Coin",
  currencyPluralName: "Coins",
  channels: [
    {
      discordId: "1367954492619755621",
      name: ANNOUNCEMENT_CHANNEL_NAME,
    },
    {
      discordId: "1367954493144301578",
      name: LEVELS_CHANNEL_NAME,
    },
    {
      discordId: "1367954492619755619",
      name: INVITES_CHANNEL_NAME,
    },
    {
      discordId: "1367954493144301580",
      name: ECONOMY_CHANNEL_NAME,
    },
    {
      discordId: "1367954493144301579",
      name: COMMANDS_CHANNEL_NAME,
    },
    {
      discordId: "1367954493144301581",
      name: PLAY_CHANNEL_NAME,
    },
    {
      discordId: "1367954492821078067",
      name: PREVIEW_CHANNEL_NAME,
    },
    {
      discordId: "1367954492821078076",
      name: BOUGHT_COINS_CHANNEL_NAME,
    },
    {
      discordId: "1367954493144301582",
      name: AI_GEN_IMAGE_TIPS_CHANNEL_NAME,
    },
    {
      discordId: "1367954493144301583",
      name: AI_IMAGE_CHANNEL_NAME,
    },
    {
      discordId: "1367954497803911189",
      name: NEW_CHANNEL_MOD_CHANNEL_NAME,
    },
    {
      discordId: "1367954493299359823",
      name: DM_REQUEST_CHANNEL_NAME,
    },
    {
      discordId: "1367954493484044358",
      name: ROLEPLAY_REQUEST_CHANNEL_NAME,
    },
    {
      discordId: "1367954493484044361",
      name: SAUCE_REQUEST_CHANNEL_NAME,
    },
    {
      discordId: "1367954493484044362",
      name: CAPTION_REQUEST_CHANNEL_NAME,
    },
    {
      discordId: "1367954493484044363",
      name: TRANSLATION_REQUEST_CHANNEL_NAME,
    },
  ],
  images: {
    currency:
      "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExNzhqd2I1OHhycXNmNTAwb3UybzU4NHcweDF0Y2t2Y21sbm1ya2p4byZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/4ZcXo1CQTZypGNpR4z/giphy.webp",
  },
  roles: [
    { discordId: "1367954490237386886", name: PREVIEW_ROLE_NAME },
    {
      discordId: "1367954490237386887",
      name: NEW_CHANNEL_ROLE_NAME,
    },
    {
      discordId: "1367954490329796639",
      name: DELETE_MESSAGE_ROLE_NAME,
    },
    {
      discordId: "1367954490329796638",
      name: MANAGE_REQUEST_ROLE_NAME,
    },
    { discordId: "1367954490317344911", name: BRONZE_ROLE_NAME },
    { discordId: "1367954490317344912", name: SILVER_ROLE_NAME },
    { discordId: "1367954490317344913", name: GOLD_ROLE_NAME },
    { discordId: "1367954490317344914", name: DIAMOND_ROLE_NAME },
  ],
  removalReasons: [
    {
      title: "Rule 1: You must be 18+",
      value: "This is an adult-only NSFW server",
    },
    {
      title: "Rule 2: No doxxing",
      value: "No doxxing",
    },
    {
      title: "Rule 3: Using @everyone ping",
      value: "Do not use the @everyone ping",
    },
    {
      title: "Rule 4: No paywall content",
      value: "No paywall content",
    },
    { title: "Rule 5: No leaks", value: "No leaks" },
    { title: "Rule 6: Cuck theme", value: "All content must be cuck-themed" },
    { title: "Rule 7: No IRL pictures", value: "No IRL pictures" },
    {
      title: "Rule 8: Captions only",
      value: "Captions must be burned or side by side the media",
    },
    {
      title: "Inappropriate request",
      value: "Request in the wrong channel",
    },
    {
      title: "Repost",
      value: "Your post is a repost",
    },
  ],
};
export const guilds = [OP_GUILD, BMB_GUILD, Tt_GUILD, CUCK_GUILD];
