import { CommandInteraction, EmbedBuilder } from "discord.js";
import { tryAsyncAwait } from "../../utils/tryAsyncAwait";
import { CURRENCY_NAME_PLURAL } from "../../utils/constants";

interface ValidateAmountDataProps {
  amount: number;
  cost: number;
  cashBalance: number;
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
  const { amount, cost, cashBalance } = data;
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

  if (amount > cashBalance) {
    embed.addFields({
      name: `Not enough ${CURRENCY_NAME_PLURAL}`,
      value: `You do not have ${amount} ${CURRENCY_NAME_PLURAL}! Please enter a lower amount`,
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
