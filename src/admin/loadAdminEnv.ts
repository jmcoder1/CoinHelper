import path from "path";

const dotenv = require("dotenv") as {
  config: (options: { path: string }) => { error?: Error };
};

const projectRoot = path.join(__dirname, "../..");

export const loadAdminEnv = (): void => {
  const result = dotenv.config({
    path: path.join(projectRoot, ".env.production"),
  });

  if (result.error) {
    throw new Error(
      `Failed to load .env.production: ${result.error.message}`,
    );
  }
};
