export interface Guild {
  id: string;
  name: string;
  currencyName: string;
  currencyPluralName: string;
  channels: {
    invitesChannelId: string;
    economyChannelId: string;
    playChannelId: string;
    previewChannelId: string;
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
  };
}
