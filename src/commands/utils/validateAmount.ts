import {
  Client,
  CommandInteraction,
  EmbedBuilder,
  TextChannel,
} from "discord.js";
import { getChannelById } from "../../utils/apiUtils/discordUtils/getChannelById";

interface ValidateAmountDataProps {
  amount: number;
  cost: number;
  balance: number;
  currencyPluralName: string;
  client: Client;
  channelId: string;
}

interface ValidateAmountEventProps {
  interaction: CommandInteraction;
  embedProps: {
    title: string;
    image: string;
  };
}

export const validateAmount = async (
  data: ValidateAmountDataProps,
  event: ValidateAmountEventProps
): Promise<boolean> => {
  const { amount, cost, balance, currencyPluralName, channelId, client } = data;
  const { interaction, embedProps } = event;

  const embed = new EmbedBuilder()
    .setColor(0xff0000)
    .setTitle(embedProps.title)
    .setImage(embedProps.image)
    .setAuthor({
      name: interaction.user.username,
      iconURL: interaction.user.avatarURL() || undefined,
    });

  let isSuccesful = true;
  if (amount < 0) {
    embed.addFields({
      name: "Invalid amonut",
      value: `Please enter a positive amount`,
    });
    isSuccesful = false;
  }

  if (amount < cost) {
    embed.addFields({
      name: "Invalid amonut",
      value: `Please enter an amount greater or equal to ${cost}`,
    });
    isSuccesful = false;
  }

  if (amount > balance) {
    embed.addFields({
      name: `Not enough ${currencyPluralName}`,
      value: `You do not have ${amount} ${currencyPluralName}! Please enter a lower amount`,
    });
    isSuccesful = false;
  }

  if (!isSuccesful) {
    const economyChannel = (await getChannelById(
      client,
      channelId
    )) as TextChannel;
    await economyChannel.send({ embeds: [embed] });
  }

  return isSuccesful;
};
