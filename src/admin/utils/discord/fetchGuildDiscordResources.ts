import { discordApiFetch } from "./discordApiFetch";

/** Guild text and announcement channels only. */
const ASSIGNABLE_CHANNEL_TYPES = new Set([0, 5]);

type DiscordApiChannel = {
  id: string;
  name: string;
  type: number;
};

type DiscordApiRole = {
  id: string;
  name: string;
  managed: boolean;
};

export type DiscordGuildChannel = {
  id: string;
  name: string;
  type: number;
};

export type DiscordGuildRole = {
  id: string;
  name: string;
};

export const fetchGuildDiscordResources = async (
  discordGuildId: string,
): Promise<{ channels: DiscordGuildChannel[]; roles: DiscordGuildRole[] }> => {
  const [channels, roles] = await Promise.all([
    discordApiFetch<DiscordApiChannel[]>(`/guilds/${discordGuildId}/channels`),
    discordApiFetch<DiscordApiRole[]>(`/guilds/${discordGuildId}/roles`),
  ]);

  return {
    channels: channels
      .filter((channel) => ASSIGNABLE_CHANNEL_TYPES.has(channel.type))
      .map((channel) => ({
        id: channel.id,
        name: channel.name,
        type: channel.type,
      }))
      .sort((a, b) => a.name.localeCompare(b.name)),
    roles: roles
      .filter(
        (role) => role.id !== discordGuildId && role.name !== "@everyone",
      )
      .map((role) => ({
        id: role.id,
        name: role.name,
      }))
      .sort((a, b) => a.name.localeCompare(b.name)),
  };
};
