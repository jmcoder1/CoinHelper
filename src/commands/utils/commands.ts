import { Balance } from "../balance";
import { CoinFlip } from "../coinflip";
import { Give } from "../give";
import { Preview } from "../preview";
import { TextToImage } from "../textToImage";
import { Withdraw } from "../withdraw";
import { Command } from "./types";

export const Commands: Command[] = [
  Balance,
  CoinFlip,
  Give,
  Preview,
  TextToImage,
  Withdraw,
];
