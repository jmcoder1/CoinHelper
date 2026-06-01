declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      PORT: string;
      DISCORD_CLIENT_ID: string;
      DISCORD_PUBLIC_KEY_: string;
      DISCORD_CLIENT_SECRET: string;
      DISCORD_TOKEN: string;
      UNBELIEVABOAT_TOKEN: string;
      AWS_S3_ACCESS_KEY_ID: string;
      AWS_S3_SECRET_ACCESS_KEY: string;
      HF_TOKEN: string;
      ADMIN_API_KEY: string;
      ADMIN_PORT: string;
    }
  }
}

export {}
