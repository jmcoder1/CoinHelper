import axios from "axios";
import { API_IMAGE_ENDPOINT, NEGATIVE_TAGS, QUALITY_TAGS } from "../constants";
import { tryAsyncAwait } from "../../../tryAsyncAwait";

interface TextToImageData {
  input: string;
  model: "nai-diffusion-3" | "nai-diffusion-furry-3";
  seed: number | null;
}

export const fetchTextToImage = async (
  accessToken: string,
  data: TextToImageData
): Promise<{ buffer: string } | null> => {
  const { input, model, seed } = data;

  const newInput = input + QUALITY_TAGS;
  const body = {
    input: newInput,
    action: "generate",
    model,
    parameters: {
      width: 1216,
      height: 832,
      scale: 5,
      sampler: "k_euler_ancestral",
      steps: 23,
      seed,
      n_samples: 1,
      ucPreset: 0,
      uc: "lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry",
      qualityToggle: true,
      sm: false,
      sm_dyn: false,
      dynamic_thresholding: false,
      controlnet_strength: 1,
      legacy: false,
      add_original_image: false,
      uncond_scale: 1,
      cfg_rescale: 0,
      noise_schedule: "native",
      legacy_v3_extend: false,
      extra_noise_seed: 1,
      negative_prompt: NEGATIVE_TAGS,
      reference_image_multiple: [],
      reference_information_extracted_multiple: [],
      reference_strength_multiple: [],
    },
  };

  const [res, error] = await tryAsyncAwait(() =>
    axios.post(API_IMAGE_ENDPOINT + "/ai/generate-image", body, {
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      responseType: "arraybuffer",
    })
  );
  if (!res || error) {
    console.error(error);
    return null;
  }

  return { buffer: res.data };
};
