import { Client, ThreadChannel } from "discord.js";

export const fetchRoleplayThread = async (
  client: Client,
  threadId: string,
): Promise<ThreadChannel | null> => {
  const channel = await client.channels.fetch(threadId);
  if (!channel?.isThread()) return null;
  return channel;
};
