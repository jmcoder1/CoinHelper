import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { RoleplayRole } from "../types";
import { createRolePickButtonId } from "./createRolePickButtonId";

export const buildRolePickComponents = (
  pendingId: string,
  roles: RoleplayRole[],
): ActionRowBuilder<ButtonBuilder>[] => {
  const row = new ActionRowBuilder<ButtonBuilder>();

  roles.forEach((role, index) => {
    row.addComponents(
      new ButtonBuilder()
        .setCustomId(createRolePickButtonId(pendingId, index))
        .setLabel(role.label)
        .setStyle(ButtonStyle.Secondary),
    );
  });

  return [row];
};
