import { Message } from "discord.js";

export const disableMessageButtons = async (
  message: Message,
): Promise<void> => {
  try {
    await message.edit({ components: [] });
  } catch (error) {
    console.error("Failed to disable roleplay message buttons:", error);
  }
};
