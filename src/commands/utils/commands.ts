import { AddCurrency } from "../addCurrency";
import { Balance } from "../balance";
import { BoughtCoins } from "../boughtCoins";
import { CoinFlip } from "../coinflip";
import { Give } from "../give";
import { NewChannel } from "../newChannel";
import { PaidRequest } from "../paidRequest";
import { Preview } from "../preview";
import { Request } from "../request";
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
  PaidRequest,
  Request,
  BoughtCoins,
];
