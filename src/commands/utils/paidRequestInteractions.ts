import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  Client,
  GuildMember,
  Message,
  ModalBuilder,
  ModalSubmitInteraction,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { updateBalance } from "../../utils/apiUtils/unbelievaboatUtils/updateBalance";
import { prisma } from "../../utils/apiUtils/prismaUtils/prisma";
import {
  ECONOMY_CHANNEL_NAME,
  MANAGE_REQUEST_ROLE_NAME,
} from "../../utils/apiUtils/prismaUtils/constants";

const PAID_REQUEST_ACCEPT_BUTTON_ID = "paid-request-accept";
const PAID_REQUEST_DELETE_BUTTON_ID = "paid-request-delete";
const PAID_REQUEST_ACCEPT_MODAL_ID = "paid-request-accept-modal";
const REQUEST_DELETE_BUTTON_ID = "request-delete";

const pendingPaidRequests = new Set<string>();

const USER_MENTION_REGEX = /^<@!?(\d+)>$/;
const USER_MENTION_SEARCH_REGEX = /<@!?(\d+)>/;
const USER_ID_REGEX = /^\d{17,20}$/;

interface PaidRequestButtonData {
  amount: number;
  requesterId: string;
}

interface PaidRequestModalData extends PaidRequestButtonData {
  channelId: string;
  messageId: string;
}

export const createPaidRequestAcceptButtonId = (
  requesterId: string,
  amount: number
) => `${PAID_REQUEST_ACCEPT_BUTTON_ID}:${requesterId}:${amount}`;

export const createPaidRequestDeleteButtonId = (requesterId: string) =>
  `${PAID_REQUEST_DELETE_BUTTON_ID}:${requesterId}`;

export const createRequestDeleteButtonId = (requesterId: string) =>
  `${REQUEST_DELETE_BUTTON_ID}:${requesterId}`;

const createPaidRequestAcceptModalId = ({
  amount,
  channelId,
  messageId,
  requesterId,
}: PaidRequestModalData) =>
  `${PAID_REQUEST_ACCEPT_MODAL_ID}:${requesterId}:${amount}:${channelId}:${messageId}`;

export const createRequestDeleteActionRow = (
  requesterId: string,
  isClosed = false,
  customId = createRequestDeleteButtonId(requesterId)
) =>
  new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(customId)
      .setLabel("Delete Request")
      .setStyle(ButtonStyle.Danger)
      .setDisabled(isClosed)
  );

interface PaidRequestActionRowOptions {
  acceptDisabled?: boolean;
  deleteDisabled?: boolean;
}

const toActionRowOptions = (
  options: boolean | PaidRequestActionRowOptions = false
): Required<PaidRequestActionRowOptions> => {
  if (typeof options === "boolean") {
    return { acceptDisabled: options, deleteDisabled: options };
  }
  return {
    acceptDisabled: options.acceptDisabled ?? false,
    deleteDisabled: options.deleteDisabled ?? false,
  };
};

export const createPaidRequestActionRows = (
  requesterId: string,
  amount: number,
  options: boolean | PaidRequestActionRowOptions = false
) => {
  const { acceptDisabled, deleteDisabled } = toActionRowOptions(options);

  return [
    new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId(createPaidRequestAcceptButtonId(requesterId, amount))
        .setLabel("Accept")
        .setStyle(ButtonStyle.Success)
        .setDisabled(acceptDisabled)
    ),
    createRequestDeleteActionRow(
      requesterId,
      deleteDisabled,
      createPaidRequestDeleteButtonId(requesterId)
    ),
  ];
};

const parseAmount = (value: string) => {
  const amount = Number.parseInt(value, 10);
  return Number.isNaN(amount) ? null : amount;
};

const parseAcceptButtonData = (customId: string): PaidRequestButtonData | null => {
  if (!customId.startsWith(`${PAID_REQUEST_ACCEPT_BUTTON_ID}:`)) return null;

  const [, requesterId, amountValue] = customId.split(":");
  const amount = parseAmount(amountValue);
  if (!requesterId || amount === null) return null;

  return { requesterId, amount };
};

const parseDeleteButtonData = (customId: string): Pick<
  PaidRequestButtonData,
  "requesterId"
> | null => {
  if (!customId.startsWith(`${PAID_REQUEST_DELETE_BUTTON_ID}:`)) return null;

  const [, requesterId] = customId.split(":");
  if (!requesterId) return null;

  return { requesterId };
};

const parseRequestDeleteButtonData = (customId: string): Pick<
  PaidRequestButtonData,
  "requesterId"
> | null => {
  if (!customId.startsWith(`${REQUEST_DELETE_BUTTON_ID}:`)) return null;

  const [, requesterId] = customId.split(":");
  if (!requesterId) return null;

  return { requesterId };
};

const parseAcceptModalData = (customId: string): PaidRequestModalData | null => {
  if (!customId.startsWith(`${PAID_REQUEST_ACCEPT_MODAL_ID}:`)) return null;

  const [, requesterId, amountValue, channelId, messageId] = customId.split(":");
  const amount = parseAmount(amountValue);
  if (!requesterId || amount === null || !channelId || !messageId) return null;

  return { requesterId, amount, channelId, messageId };
};

const parseLegacyPaidRequestButtonData = (
  interaction: ButtonInteraction
): PaidRequestButtonData | null => {
  const message = interaction.message as any;
  const requesterId =
    message?.interactionMetadata?.user?.id ?? message?.interaction?.user?.id;
  const bountyField = interaction.message.embeds[0]?.fields.find(
    (field) => field.name === "Bounty"
  );
  const amount = parseAmount(bountyField?.value ?? "");

  if (!requesterId || amount === null) return null;

  return { requesterId, amount };
};

const parseRequesterIdFromMessageMention = (message: Message) => {
  const requesterMatch =
    message.embeds[0]?.description?.match(USER_MENTION_SEARCH_REGEX) ??
    message.content.match(USER_MENTION_SEARCH_REGEX);

  return requesterMatch?.[1] ?? null;
};

const isPaidRequestClosed = (message: Message) =>
  message.components.some((row: any) =>
    row.components.some(
      (component: any) =>
        typeof component.customId === "string" &&
        (component.customId === "accept" ||
          component.customId.startsWith(PAID_REQUEST_ACCEPT_BUTTON_ID)) &&
        component.disabled
    )
  );

const findMemberByInput = async (
  member: GuildMember,
  rawInput: string
): Promise<GuildMember | null> => {
  const input = rawInput.trim();
  const mentionMatch = input.match(USER_MENTION_REGEX);
  const userId = mentionMatch?.[1] ?? (USER_ID_REGEX.test(input) ? input : null);

  if (userId)
    return member.guild.members.fetch(userId).catch(() => null) as Promise<GuildMember | null>;

  const normalizedInput = input.toLowerCase();
  return (
    member.guild.members.cache.find((candidate) => {
      const username = candidate.user.username.toLowerCase();
      const displayName = candidate.displayName.toLowerCase();

      return (
        username === normalizedInput || displayName === normalizedInput
      );
    }) ?? null
  );
};

const canManagePaidRequest = async (
  member: GuildMember,
  requesterId: string
) => {
  if (member.user.id === requesterId) return true;

  const guild = await prisma.guild.findUnique({
    where: { discordId: member.guild.id },
  });
  if (!guild) return false;

  const manageRequestGuildRole = await prisma.guildRole.findFirst({
    where: {
      guildId: guild.id,
      name: MANAGE_REQUEST_ROLE_NAME,
    },
  });
  if (!manageRequestGuildRole) return false;

  return member.roles.cache.has(manageRequestGuildRole.discordId);
};

export const handlePaidRequestButtonInteraction = async (
  interaction: ButtonInteraction
): Promise<void> => {
  const isLegacyAccept = interaction.customId === "accept";
  const isLegacyDelete = interaction.customId === "delete";

  const acceptData = parseAcceptButtonData(interaction.customId);
  const deleteData = parseDeleteButtonData(interaction.customId);
  const requestDeleteData = parseRequestDeleteButtonData(interaction.customId);

  if (
    !acceptData &&
    !deleteData &&
    !requestDeleteData &&
    !isLegacyAccept &&
    !isLegacyDelete
  )
    return;

  if (!interaction.guild) {
    await interaction.reply({
      content: "This action can only be performed in a server.",
      ephemeral: true,
    });
    return;
  }

  const fallbackData = parseLegacyPaidRequestButtonData(interaction);

  if (acceptData || isLegacyAccept) {
    const acceptButtonData = acceptData ?? fallbackData;
    if (!acceptButtonData) {
      await interaction.reply({
        content: "This request could not be opened for acceptance.",
        ephemeral: true,
      });
      return;
    }

    if (pendingPaidRequests.has(interaction.message.id)) {
      await interaction.reply({
        content: "This request is already being processed.",
        ephemeral: true,
      });
      return;
    }

    const modal = new ModalBuilder()
      .setCustomId(
        createPaidRequestAcceptModalId({
          amount: acceptButtonData.amount,
          channelId: interaction.channelId,
          messageId: interaction.message.id,
          requesterId: acceptButtonData.requesterId,
        })
      )
      .setTitle("Accept Request");

    const usernameInput = new TextInputBuilder()
      .setCustomId("username")
      .setLabel("Who fulfilled this request?")
      .setPlaceholder("username, @mention, or user ID")
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    modal.addComponents(
      new ActionRowBuilder<TextInputBuilder>().addComponents(usernameInput)
    );

    try {
      await interaction.showModal(modal);
    } catch (error) {
      console.error("Error showing paid request accept modal:", error);
      if (interaction.replied || interaction.deferred) return;

      await interaction
        .reply({
          content:
            "Could not open the accept form. Please try again in a moment. If this keeps happening, contact staff.",
          ephemeral: true,
        })
        .catch(() => null);
    }
    return;
  }

  const requesterId =
    requestDeleteData?.requesterId ??
    deleteData?.requesterId ??
    fallbackData?.requesterId ??
    parseRequesterIdFromMessageMention(interaction.message);
  if (!requesterId) {
    await interaction.reply({
      content:
        "This request was created with an older format and can no longer be managed.",
      ephemeral: true,
    });
    return;
  }

  if (interaction.user.id !== requesterId) {
    await interaction.reply({
      content: "You cannot delete this request.",
      ephemeral: true,
    });
    return;
  }

  try {
    await interaction.message.delete();
    await interaction.reply({
      content: "The request has been deleted.",
      ephemeral: true,
    });
  } catch (error) {
    console.error("Error deleting the request:", error);
    await interaction.reply({
      content: "Failed to delete the request. Please try again later.",
      ephemeral: true,
    });
  }
};

export const handlePaidRequestModalSubmit = async (
  interaction: ModalSubmitInteraction,
  client: Client
): Promise<void> => {
  const modalData = parseAcceptModalData(interaction.customId);
  if (!modalData) return;

  if (!interaction.guild) {
    await interaction.reply({
      content: "This action can only be performed in a server.",
      ephemeral: true,
    });
    return;
  }

  await interaction.deferReply({ ephemeral: true });

  const actingMember = await interaction.guild.members
    .fetch(interaction.user.id)
    .catch(() => null);
  if (!actingMember) {
    await interaction.editReply("This action can only be performed in a server.");
    return;
  }

  const hasPermission = await canManagePaidRequest(
    actingMember,
    modalData.requesterId
  );
  if (!hasPermission) {
    await interaction.editReply(
      "You do not have permission to perform this action."
    );
    return;
  }

  const guild = await prisma.guild.findUnique({
    where: { discordId: interaction.guild.id },
  });
  if (!guild) {
    await interaction.editReply("Guild not found.");
    return;
  }

  const guildCurrency = await prisma.guildCurrency.findFirst({
    where: { guildId: guild.id },
  });
  if (!guildCurrency) {
    await interaction.editReply("Guild currency not found.");
    return;
  }

  const economyGuildChannel = await prisma.guildChannel.findFirst({
    where: {
      guildId: guild.id,
      name: ECONOMY_CHANNEL_NAME,
    },
  });
  if (!economyGuildChannel) {
    await interaction.editReply(ECONOMY_CHANNEL_NAME + " channel not found.");
    return;
  }

  const channel = await client.channels.fetch(modalData.channelId).catch(() => null);
  if (!channel?.isTextBased() || !("messages" in channel)) {
    await interaction.editReply("Request channel not found.");
    return;
  }

  const requestMessage = await channel.messages
    .fetch(modalData.messageId)
    .catch(() => null);
  if (!requestMessage) {
    await interaction.editReply("Request message not found.");
    return;
  }

  if (isPaidRequestClosed(requestMessage)) {
    await interaction.editReply(
      "This request has already been completed or closed."
    );
    return;
  }

  if (pendingPaidRequests.has(requestMessage.id)) {
    await interaction.editReply("This request is already being processed.");
    return;
  }

  pendingPaidRequests.add(requestMessage.id);

  try {
    const fulfillerInput = interaction.fields.getTextInputValue("username");
    const fulfiller = await findMemberByInput(actingMember, fulfillerInput);
    if (!fulfiller) {
      await interaction.editReply(
        `User "${fulfillerInput}" not found in the server.`
      );
      return;
    }

    await requestMessage.edit({
      components: [
        ...createPaidRequestActionRows(
          modalData.requesterId,
          modalData.amount,
          { acceptDisabled: true, deleteDisabled: false }
        ),
      ],
    });

    try {
      await updateBalance(client, {
        user: {
          name: fulfiller.user.username,
          id: fulfiller.user.id,
          guild: {
            id: guild.discordId,
            currencyPluralName: guildCurrency.namePlural,
            economyChannelId: economyGuildChannel.discordId,
            currencyImage: guildCurrency.iconSrc,
          },
          iconURL: fulfiller.user.displayAvatarURL(),
        },
        cashAmount: modalData.amount,
        reason: `Bounty for fulfilling a request.`,
      });
    } catch (error) {
      console.error("Error awarding paid request bounty:", error);
      await requestMessage.edit({
        components: [
          ...createPaidRequestActionRows(
            modalData.requesterId,
            modalData.amount,
            false
          ),
        ],
      });

      await interaction.editReply(
        "There was an error awarding the bounty. No coins were awarded."
      );
      return;
    }

    await interaction.editReply(
      `The bounty of ${modalData.amount} ${guildCurrency.namePlural} has been successfully transferred to ${fulfiller.user.username}.`
    );
  } finally {
    pendingPaidRequests.delete(requestMessage.id);
  }
};
