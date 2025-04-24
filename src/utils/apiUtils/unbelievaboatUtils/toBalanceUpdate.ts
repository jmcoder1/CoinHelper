import { Client, User } from "discord.js";
import { toUserId } from "../../../listeners/utils/discordUtils/toUserId";

const JOIN_AMOUNT = 100;
const LEAVE_AMOUNT = -110;

interface ToBalanceUpdateOutput {
  cashAmount: number;
  user: {
    id: string;
    name: string;
    iconURL: string | undefined;
  };
  reason: string;
}

export const toBalanceUpdate = (
  client: Client,
  invite: string
): ToBalanceUpdateOutput | null => {
  const invitedByIndex = invite.toLowerCase().indexOf("invited by");
  if (invitedByIndex === -1) return null;

  const words = invite.split(" ");
  const isJoin = invite.toLowerCase().indexOf("join") != -1;
  const inviteeMention = words[0];
  const inviterUserId = toUserId(words[words.indexOf("by") + 1]);

  const inviter = client.users.cache.get(inviterUserId) as User;

  return {
    cashAmount: isJoin ? JOIN_AMOUNT : LEAVE_AMOUNT,
    user: {
      id: inviter.id,
      name: inviter.username,
      iconURL: inviter.avatarURL() || undefined,
    },
    reason: `${isJoin ? "join" : "leave"} ${inviteeMention}`,
  };
};
