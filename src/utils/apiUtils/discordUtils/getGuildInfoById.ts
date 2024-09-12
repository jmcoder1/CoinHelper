import { guilds } from "./constants";
import { Guild } from "./types";

export const getGuildInfoById = (id: string): Guild | null => {
  for (let i = 0; i < guilds.length; i++) {
    const server = guilds[i];
    if (server.id === id) return server;
  }

  return null;
};
