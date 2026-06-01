const DISCORD_API_BASE = "https://discord.com/api/v10";

export const discordApiFetch = async <T>(path: string): Promise<T> => {
  const token = process.env.DISCORD_TOKEN;
  if (!token) {
    throw new Error("DISCORD_TOKEN is not configured in .env.production");
  }

  const response = await fetch(`${DISCORD_API_BASE}${path}`, {
    headers: {
      Authorization: `Bot ${token}`,
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Discord API error ${response.status}: ${body}`);
  }

  return response.json() as Promise<T>;
};
