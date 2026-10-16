/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "node",
  roots: ["<rootDir>/tests"],
  testMatch: ["**/*.test.ts"],
  transform: {
    "^.+\\.ts$": ["ts-jest", { tsconfig: "tsconfig.test.json" }],
  },
  globalSetup: "<rootDir>/tests/helpers/global-setup.ts",
  setupFiles: ["<rootDir>/tests/helpers/env.ts"],
  setupFilesAfterEnv: ["<rootDir>/tests/helpers/silence-logs.ts"],
  silent: true, // esconde console.log/console.error da aplicação
};
