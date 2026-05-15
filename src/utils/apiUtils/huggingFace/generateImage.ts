import {
  HF_ENDPOINT,
  HF_SPACE_ID,
  NEGATIVE_PROMPT,
  PROMPT_PREFIX,
} from "./constants";
import { buildSeed } from "./buildSeed";
import { describeFirstOutput } from "./describeFirstOutput";
import { extractImageUrl } from "./extractImageUrl";
import { hfError } from "./logging/hfError";
import { hfLog } from "./logging/hfLog";
import { safeJsonPreview } from "./logging/safeJsonPreview";

// @gradio/client ships as ESM-only; we are emitting CommonJS. Use a
// Function-wrapped dynamic import so TS doesn't transpile it to require().
const dynamicImport = new Function(
  "specifier",
  "return import(specifier)"
) as <T = unknown>(specifier: string) => Promise<T>;

export interface GenerateImageResult {
  url: string;
  seed: number;
}

export const generateImage = async (
  userPrompt: string,
  requestId: string
): Promise<GenerateImageResult> => {
  hfLog(requestId, "generateImage start", {
    userPromptLength: userPrompt.length,
    hasHfToken: Boolean(process.env.HF_TOKEN),
    space: HF_SPACE_ID,
    endpoint: HF_ENDPOINT,
  });

  const gradio = await dynamicImport<typeof import("@gradio/client")>(
    "@gradio/client"
  );

  const token = process.env.HF_TOKEN as `hf_${string}` | undefined;
  hfLog(requestId, "connecting Gradio client", { withToken: Boolean(token) });

  const client = await gradio.Client.connect(HF_SPACE_ID, token ? { token } : {});

  hfLog(requestId, "Gradio client connected", {
    root: client.config?.root,
    root_url: client.config?.root_url,
  });

  const seed = buildSeed();
  const prompt = `${PROMPT_PREFIX}${userPrompt}`;

  hfLog(requestId, "calling predict", {
    seed,
    fullPromptLength: prompt.length,
    negativePromptLength: NEGATIVE_PROMPT.length,
  });

  const result = await client.predict(HF_ENDPOINT, {
    param_0: prompt,
    param_1: NEGATIVE_PROMPT,
    param_2: seed,
    param_3: 1024,
    param_4: 1024,
    param_5: 7,
    param_6: 28,
    param_7: "DPM++ 2M SDE Karras",
    param_8: "1024 x 1024",
    param_9: false,
    param_10: 0.55,
    param_11: 1.5,
    param_12: "",
    param_13: 1,
  });

  hfLog(requestId, "predict returned", {
    resultType: result?.type,
    endpoint: result?.endpoint,
    fn_index: result?.fn_index,
    dataIsArray: Array.isArray(result?.data),
    dataLength: Array.isArray(result?.data) ? result.data.length : null,
    dataPreview: safeJsonPreview(result?.data),
  });

  const data = result?.data as unknown;
  const first = Array.isArray(data) ? data[0] : undefined;
  hfLog(requestId, "parsed output[0]", describeFirstOutput(first));

  const url = extractImageUrl(first);
  if (!url) {
    hfError(
      requestId,
      "no image URL in Gradio response",
      undefined,
      describeFirstOutput(first)
    );
    throw new Error("Hugging Face response did not include an image URL.");
  }

  hfLog(requestId, "extracted image URL", {
    urlLength: url.length,
    urlPrefix: url.slice(0, 200),
    isAbsolute: /^https?:\/\//i.test(url),
  });

  return { url, seed };
};
