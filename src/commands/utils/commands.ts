import { AddCurrency } from "../addCurrency";
import { Balance } from "../balance";
import { CoinFlip } from "../coinflip";
import { Give } from "../give";
import { NewChannel } from "../newChannel";
import { Preview } from "../preview";
import { TextToImage } from "../textToImage";
import { Command } from "./types";

export const Commands: Command[] = [
  AddCurrency,
  Balance,
  CoinFlip,
  Give,
  Preview,
  TextToImage,
  NewChannel,
];
