const REQUIRED_BOT_ENV = [
  "DATABASE_URL",
  "DISCORD_TOKEN",
  "UNBELIEVABOAT_TOKEN",
  "AWS_S3_ACCESS_KEY_ID",
  "AWS_S3_SECRET_ACCESS_KEY",
  "HF_TOKEN",
] as const;

const assertRequiredEnv = (): void => {
  const missing = REQUIRED_BOT_ENV.filter((key) => !process.env[key]?.trim());
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`,
    );
  }
};

/** Load env for the Discord bot. Dev uses .env via dotenv-safe; prod uses Railway/host env. */
export const loadBotEnv = (): void => {
  if (process.env.NODE_ENV === "production") {
    assertRequiredEnv();
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require("dotenv-safe/config");
};
