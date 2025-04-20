export interface Guild {
  id: string;
  name: string;
  currencyName: string;
  currencyPluralName: string;
  channels: {
    announcementChannelId: string;
    invitesChannelId: string;
    levelsChannelId: string;
    economyChannelId: string;
    playChannelId: string;
    previewChannelId: string;
    boughtCoinsChannelId: string;
    aiGenImageTipsId: string;
    newChannelModId: string;
    dmRequestChannelId: string;
    roleplayRequestChannelId: string;
  };
  images: {
    currency: string[];
    coinFlip: string[];
    insufficientBalance: string[];
    gameWin: string[];
    gameLost: string[];
  };
  roles: {
    previewRoleId: string;
    newChannelRoleId: string;
    deleteMessageRoleId: string;
  };
  removalReasons:
    | {
        title: string;
        value: string;
      }[]
    | undefined;
}
