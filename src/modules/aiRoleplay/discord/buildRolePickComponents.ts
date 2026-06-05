import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { RoleplayRole } from "../types";
import {
  createRolePickButtonId,
  RolePickPlayerSlot,
} from "./createRolePickButtonId";

export const buildRolePickComponents = (
  pendingId: string,
  roles: RoleplayRole[],
  playerSlot?: RolePickPlayerSlot,
): ActionRowBuilder<ButtonBuilder>[] => {
  const row = new ActionRowBuilder<ButtonBuilder>();

  roles.forEach((role, index) => {
    row.addComponents(
      new ButtonBuilder()
        .setCustomId(createRolePickButtonId(pendingId, index, playerSlot))
        .setLabel(role.label)
        .setStyle(ButtonStyle.Secondary),
    );
  });

  return [row];
};
