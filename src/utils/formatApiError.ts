/** Format errors for logs without dumping Axios request configs (which include auth tokens). */
export const formatApiError = (error: unknown): string => {
  if (error == null) return "Unknown error";
  if (typeof error === "string") return error;

  if (isAxiosLike(error)) {
    const status = error.response?.status;
    const data = error.response?.data;
    let apiMessage: string | undefined;
    if (typeof data === "string") {
      apiMessage = data;
    } else if (data && typeof data === "object") {
      apiMessage = data.message ?? data.error;
    }

    const method = error.config?.method?.toUpperCase();
    const url = error.config?.url;
    const baseMessage = error.message || "Request failed";

    const parts = [baseMessage];
    if (status != null) parts.push(`status=${status}`);
    if (apiMessage) parts.push(`api=${apiMessage}`);
    if (method || url) {
      parts.push(`request=${[method, url].filter(Boolean).join(" ")}`);
    }
    return parts.join(" | ");
  }

  if (error instanceof Error) {
    return error.message || error.name;
  }

  return String(error);
};

type AxiosLikeError = {
  message?: string;
  isAxiosError?: boolean;
  config?: { method?: string; url?: string };
  response?: {
    status?: number;
    data?: { message?: string; error?: string } | string;
  };
};

const isAxiosLike = (error: unknown): error is AxiosLikeError => {
  if (!error || typeof error !== "object") return false;
  const candidate = error as AxiosLikeError;
  return (
    candidate.isAxiosError === true ||
    candidate.response != null ||
    (candidate.config != null &&
      (candidate.config.url != null || candidate.config.method != null))
  );
};
