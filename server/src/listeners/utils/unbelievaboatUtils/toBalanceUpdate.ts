import { toUserId } from "../discordUtils/toUserId";

const JOIN_AMOUNT = 100;
const LEAVE_AMOUNT = -110;

export const toBalanceUpdate = (invite: string) => {
  const invitedByIndex = invite.toLowerCase().indexOf("invited by");
  if (invitedByIndex === -1) return null;

  const words = invite.split(" ");
  const isJoin = invite.toLowerCase().indexOf("join") != -1;
  const inviteeMention = words[0];
  const inviterUserId = toUserId(words[words.indexOf("by") + 1]);

  return {
    cashAmount: isJoin ? JOIN_AMOUNT : LEAVE_AMOUNT,
    userId: inviterUserId,
    reason: `${isJoin ? "join" : "leave"} ${inviteeMention}`,
  };
};
