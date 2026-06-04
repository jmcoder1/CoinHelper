import OpenAI from "openai";
import {
  HF_ROLEPLAY_BASE_URL,
  HF_ROLEPLAY_MODEL,
  JSON_RESPONSE_INSTRUCTION,
} from "../constants";

export interface RoleplayChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface CallRoleplayModelParams {
  systemPrompt: string;
  messages: RoleplayChatMessage[];
  thinkingMode: boolean;
}

let cachedClient: OpenAI | null = null;

const getClient = (): OpenAI => {
  if (!cachedClient) {
    cachedClient = new OpenAI({
      baseURL: HF_ROLEPLAY_BASE_URL,
      apiKey: process.env.HF_TOKEN,
    });
  }
  return cachedClient;
};

export const callRoleplayModel = async ({
  systemPrompt,
  messages,
  thinkingMode,
}: CallRoleplayModelParams): Promise<string> => {
  const client = getClient();

  const response = await client.chat.completions.create({
    model: HF_ROLEPLAY_MODEL,
    messages: [
      {
        role: "system",
        content: `${systemPrompt}\n\n${JSON_RESPONSE_INSTRUCTION}`,
      },
      ...messages.map((message) => ({
        role: message.role,
        content: message.content,
      })),
    ],
    temperature: thinkingMode ? 1 : 0.9,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("Roleplay model returned empty content");

  return content;
};
