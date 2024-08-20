declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      DISCORD_CLIENT_ID: string;
      DISCORD_PUBLIC_KEY_: string;
      DISCORD_CLIENT_SECRET: string;
      DISCORD_TOKEN: string;
      UNBELIEVABOAT_TOKEN: string;
    }
  }
}

export {}
