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
  };
  images: {
    loading: string[];
    currency: string[];
    coinFlip: string[];
    insufficientBalance: string[];
    gameWin: string[];
    gameLost: string[];
  };
  notifications: {
    previewRoleId: string;
    newChannelRoleId: string;
  };
}
