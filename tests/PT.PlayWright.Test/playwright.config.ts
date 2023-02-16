import type { PlaywrightTestConfig } from '@playwright/test';
import path from "path";
const outPutDir = path.join(".", "generated/tests");
const jUnitTestResults = path.join(outPutDir, "test-results/test-results.xml")

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const timeInMin: number = 60 * 1000;
const config: PlaywrightTestConfig = {
  globalSetup: "./global-setup",
  testDir: './tests',
  //testDir: "../pt.PlayWright.Test/tests",//TODO:add script in parent package json folder to execute this cmd
  /* Maximum time one test can run for. */
  timeout: 80 * 10000,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 100000
  },
  /* Run tests in files in parallel */
  fullyParallel: false,
  outputDir: process.env.OUTPUTDIR || outPutDir, 
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: 0,
  /* Opt out of parallel tests on CI. */
  // workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ["list", { open: "never" }],
    ["junit", { outputFile: jUnitTestResults }]
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    headless: true,
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: Number.parseInt(process.env.ACTION_TIMEOUT || "2") * timeInMin,
    navigationTimeout: Number.parseInt(process.env.NAVIGATION_TIMEOUT || "2") * timeInMin,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  /* Configure projects for major browsers */
  // projects: [
  //   // {
  //   //   name: 'Presence',
  //   //   testMatch: /.*presence.*\.spec\.ts/,
  //   //   use: {
  //   //     headless:false,
  //   //     channel: 'chrome',
  //   //   },
  //   // },
  //   // {
  //   //   name: 'Notification',
  //   //   testMatch: /.*notification.*\.spec\.ts/,
  //   //   use: {
  //   //     channel: 'chrome',
  //   //   },
  //   // },
  //   // {
  //   //   name: 'NonLiveChatTests',
  //   //   fullyParallel: true,
  //   //   //testMatch: /.*chat.*\.spec\.ts/,
  //   //   grepInvert: /@ptlivechatuser/,
  //   //   // use: {
  //   //   //   channel: 'chrome',
  //   //   // },
  //   // },
  //   // {
  //   //   name: 'LiveChatTests',
  //   //   fullyParallel: false,
  //   //   //testMatch: /.*chat.*\.spec\.ts/,
  //   //   grep: /@ptlivechatuser/,
  //   //   // use: {
  //   //   //   channel: 'chrome',
  //   //   // },
  //   // },
  // ],
};

export default config;
