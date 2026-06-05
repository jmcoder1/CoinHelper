import { ActionRowBuilder, ButtonBuilder, User } from "discord.js";

export const notifyReactorWithComponents = async (
  user: User,
  content: string,
  components: ActionRowBuilder<ButtonBuilder>[],
): Promise<boolean> => {
  try {
    await user.send({ content, components });
    return true;
  } catch {
    return false;
  }
};
