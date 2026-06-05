import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { createDuoInviteButtonId } from "./createDuoInviteButtonId";

export const buildDuoInviteComponents = (
  pendingId: string,
): ActionRowBuilder<ButtonBuilder>[] => {
  const row = new ActionRowBuilder<ButtonBuilder>();

  row.addComponents(
    new ButtonBuilder()
      .setCustomId(createDuoInviteButtonId(pendingId, "accept"))
      .setLabel("Accept")
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId(createDuoInviteButtonId(pendingId, "decline"))
      .setLabel("Decline")
      .setStyle(ButtonStyle.Danger),
  );

  return [row];
};
