import { Message, ThreadAutoArchiveDuration } from "discord.js";
import { ROLEPLAY_THREAD_NAME } from "./buildRoleplayThreadName";

export const createRoleplayThread = async (starterMessage: Message) =>
  starterMessage.startThread({
    name: ROLEPLAY_THREAD_NAME,
    autoArchiveDuration: ThreadAutoArchiveDuration.OneDay,
    reason: "AI roleplay session",
  });
