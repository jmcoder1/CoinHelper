import { Awaitable, Client, Events, Interaction } from "discord.js";
import {
  handlePaidRequestButtonInteraction,
  handlePaidRequestModalSubmit,
} from "../commands/utils/paidRequestInteractions";
import {
  tryHandleAiRoleplayButton,
  tryHandleAiRoleplayDuoInvite,
  tryHandleAiRoleplayEnd,
  tryHandleAiRoleplayModePick,
  tryHandleAiRoleplayRolePick,
} from "../modules/aiRoleplay";
import { handleSlashCommand } from "./utils/handleSlashCommand";
import { tryAsyncAwait } from "../utils/tryAsyncAwait";
import { Listener } from "./utils/types";

export interface InteractionCreateListener extends Listener {
  event: Events.InteractionCreate;
  fn: (interaction: Interaction, client: Client) => Awaitable<void>;
}

export const interactionCreate: InteractionCreateListener = {
  event: Events.InteractionCreate,
  fn: async (interaction: Interaction, client: Client) => {
    if (interaction.isButton()) {
      const [modePickHandled] = await tryAsyncAwait(() =>
        tryHandleAiRoleplayModePick(client, interaction),
      );
      if (modePickHandled) return;

      const [duoInviteHandled] = await tryAsyncAwait(() =>
        tryHandleAiRoleplayDuoInvite(client, interaction),
      );
      if (duoInviteHandled) return;

      const [rolePickHandled] = await tryAsyncAwait(() =>
        tryHandleAiRoleplayRolePick(client, interaction),
      );
      if (rolePickHandled) return;

      const [endHandled] = await tryAsyncAwait(() =>
        tryHandleAiRoleplayEnd(client, interaction),
      );
      if (endHandled) return;

      const [handled] = await tryAsyncAwait(() =>
        tryHandleAiRoleplayButton(client, interaction),
      );
      if (handled) return;

      await tryAsyncAwait(() => handlePaidRequestButtonInteraction(interaction));
      return;
    }

    if (interaction.isModalSubmit()) {
      await tryAsyncAwait(() => handlePaidRequestModalSubmit(interaction, client));
      return;
    }

    if (!interaction.isChatInputCommand()) return;

    await tryAsyncAwait(() => handleSlashCommand(client, interaction));
  },
};
