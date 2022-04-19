module.exports = {
  roots: ["."],
  testMatch: [
    "**/tests/**/?(*.)+(spec|test).+(ts|tsx|js)",
    "**/?(*.)+(spec|test).+(ts|tsx|js)"
  ],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  // The directory where Jest should output its coverage files
  coverageDirectory: "../drop/coverage",
  coverageReporters: ["text", "cobertura", "lcov", "json-summary"],
  collectCoverage: true,
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
        outputFile: "../drop/testResults/test-results.trx",
      },
    ],
  ],
}
