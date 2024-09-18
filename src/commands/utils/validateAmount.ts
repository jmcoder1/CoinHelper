import { CommandInteraction, EmbedBuilder } from "discord.js";
import { tryAsyncAwait } from "../../utils/tryAsyncAwait";

interface ValidateAmountDataProps {
  amount: number;
  cost: number;
  balance: number;
  currencyPluralName: string;
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
  const { amount, cost, balance, currencyPluralName } = data;
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

  if (!isSuccesful)
    await tryAsyncAwait(() =>
      interaction.reply({
        ephemeral: true,
        embeds: [embed],
      })
    );

  return isSuccesful;
};
