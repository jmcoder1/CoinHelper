declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      DISCORD_CLIENT_ID: string;
      DISCORD_PUBLIC_KEY_: string;
      DISCORD_CLIENT_SECRET: string;
      DISCORD_TOKEN: string;
      UNBELIEVABOAT_TOKEN: string;
      NOVEL_API_USERNAME: string;
      NOVEL_API_PASSWORD: string;
      AWS_S3_ACCESS_KEY_ID: string;
      AWS_S3_SECRET_ACCESS_KEY: string;
    }
  }
}

export {}
