import { Client, Message } from "discord.js";
import { updateBalance } from "../../utils/apiUtils/unbelievaboatUtils/updateBalance";
import {
  BUMP_REWARD_AMOUNT,
  getDisboardBumpUser,
  isDisboardBumpRewardMessage,
} from "./discordUtils/disboardBump";
import { tryAsyncAwait } from "../../utils/tryAsyncAwait";

export interface HandleDisboardBumpContext {
  guildDiscordId: string;
  currencyPluralName: string;
  currencyImage: string;
  economyChannelId: string;
}

export const handleDisboardBump = async (
  client: Client,
  message: Message,
  context: HandleDisboardBumpContext
): Promise<boolean> => {
  if (!isDisboardBumpRewardMessage(message)) return false;

  const user = getDisboardBumpUser(message)!;
  console.log(`${user.username} used the /bump command.`);

  await tryAsyncAwait(() =>
    updateBalance(client, {
      user: {
        id: user.id,
        name: user.username,
        iconURL: user.avatarURL() ?? undefined,
        guild: {
          id: context.guildDiscordId,
          currencyPluralName: context.currencyPluralName,
          economyChannelId: context.economyChannelId,
          currencyImage: context.currencyImage,
        },
      },
      cashAmount: BUMP_REWARD_AMOUNT,
      reason: `You have been rewarded ${BUMP_REWARD_AMOUNT} ${context.currencyPluralName} for bumping the server.`,
    }),
  );

  return true;
};
