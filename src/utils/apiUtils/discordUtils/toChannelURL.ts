export const toChannelURL = ({
  serverId,
  channelId,
}: {
  serverId: string;
  channelId: string;
}) => `https://discord.com/channels/${serverId}/${channelId}`;
