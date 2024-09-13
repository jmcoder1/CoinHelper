import { Collection } from "discord.js";
import { getRandInt } from "./getRandInt";

// TODO: fix types
export const getRandCollectionElement = (coll: Collection<string, any>) =>
  coll.at(getRandInt(coll.size));
