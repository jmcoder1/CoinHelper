export interface Guild {
  id: string;
  name: string;
  currencyName: string;
  currencyPluralName: string;
  channels: {
    invitesChannelId: string;
    economyChannelId: string;
    playChannelId: string;
  };
  images: { loading: string[] };
}
