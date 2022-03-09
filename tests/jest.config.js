module.exports = {
  "roots": ["."],
  "testMatch": [
    "**/__tests__/**/*.+(ts|tsx|js)",
    "**/?(*.)+(spec|test).+(ts|tsx|js)"
  ],
  "transform": {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  // The directory where Jest should output its coverage files
  coverageDirectory: "../drop/coverage",
  coverageReporters: ["text", "cobertura", "lcov", "json-summary"],

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
