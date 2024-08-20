import { messageCreate } from "../../messageCreate";
import { ready } from "../../ready";

export const listeners = [ready, messageCreate] as const;
