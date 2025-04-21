import { Collection } from "discord.js";
import { getRandInt } from "./getRandInt";

// TODO: fix types
export const getRandCollectionElement = <T extends any>(
  coll: Collection<string, T>
) => coll.at(getRandInt(coll.size));
