import { User } from "discord.js";

export const notifyReactor = async (
  user: User,
  message: string,
): Promise<void> => {
  try {
    await user.send(message);
  } catch {
    // DMs disabled — caller may fall back to channel notice if needed.
  }
};
