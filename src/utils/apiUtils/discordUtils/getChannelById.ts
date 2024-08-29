import { Channel, Client } from "discord.js";

export const getChannelById = async (
  client: Client<boolean>,
  channelId: string
) => await (client.channels.cache.get(channelId.toString()) as Channel).fetch();
