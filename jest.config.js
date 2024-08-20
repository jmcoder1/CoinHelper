module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFiles: ["dotenv/config"],
  testTimeout: 100000,
  globals: { fetch: global.fetch },
};
