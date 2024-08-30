import { CommandInteraction, EmbedBuilder } from "discord.js";
import { tryAsyncAwait } from "../../utils/tryAsyncAwait";
import { CURRENCY_NAME_PLURAL } from "../../utils/constants";

export const validateAmount = async (
  amount: number,
  interaction: CommandInteraction,
  cashBalance: number
) => {
  const embed = new EmbedBuilder()
    .setColor(0xff0000)
    .setTitle("Coin Flip")
    .setImage(
      "https://media1.tenor.com/m/nk19aL-uMiUAAAAC/playing-cards-praetorian.gif"
    )
    .setAuthor({
      name: interaction.user.username,
      iconURL: interaction.user.avatarURL() || undefined,
    });

  if (amount < 0) {
    embed.addFields({
      name: "Invalid amonut",
      value: `Please enter a positive amount`,
    });
    await tryAsyncAwait(() =>
      interaction.reply({
        ephemeral: true,
        embeds: [embed],
      })
    );
    return;
  } else if (amount < 50) {
    embed.addFields({
      name: "Invalid amonut",
      value: `Please enter an amount greater or equal to 50`,
    });
    await tryAsyncAwait(() =>
      interaction.reply({
        ephemeral: true,
        embeds: [embed],
      })
    );
    return;
  } else if (amount > cashBalance) {
    embed.addFields({
      name: `Not enough ${CURRENCY_NAME_PLURAL}`,
      value: `You do not have ${amount} ${CURRENCY_NAME_PLURAL}! Please enter a lower amount`,
    });
    embed.setColor(0xff0000);
    await tryAsyncAwait(() =>
      interaction.reply({
        ephemeral: true,
        embeds: [embed],
      })
    );
    return;
  }
};
