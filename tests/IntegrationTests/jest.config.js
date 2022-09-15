// eslint-disable-next-line @typescript-eslint/no-var-requires
const { pathsToModuleNameMapper } = require("ts-jest/utils");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { compilerOptions } = require("./tsconfig.json");

module.exports = {
  roots: ["."],
  preset: "jest-playwright-preset",
  testRunner: "jest-circus/runner",
  setupFilesAfterEnv: ["expect-playwright", "./jest.setup.js"],
  testEnvironment: "./configuration/CustomEnvironment.js",
  testMatch: [
    "**/integration-tests/**/?(*.)+(spec|test).+(ts|tsx|js)",
    "**/?(*.)+(spec|test).+(ts|tsx|js)"
  ],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  testResultsProcessor: "jest-junit",
  testPathIgnorePatterns: ["/dist/", "/node_modules/"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  // The directory where Jest should output its coverage files
  coverageDirectory: "./testResults/coverage",
  coverageReporters: ["text", "cobertura", "lcov", "json-summary"],
  collectCoverage: false,
  coverageThreshold: {
      global: {
          branches: 0,
          functions: 0,
          lines: 0,
          statements: 0
      }
  },
  reporters: [
      "default",
      [
        "jest-trx-results-processor",
        {
          outputFile: "./testResults/test-results.trx",
        },
      ],
      [
        "jest-junit",
        {
            suiteName: "LiveChatWidget e2e tests",
            outputDirectory: "./reports/",
            outputName: "./junit.xml",
            usePathForSuiteName: "true",
            includeConsoleOutput: "true",
        },
    ],
    [
        "jest-html-reporters",
        {
            publicPath: "./reports/",
            filename: "report.html",
            expand: true,
        },
    ],
  ],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
  modulePaths: ["<rootDir>"],
}
