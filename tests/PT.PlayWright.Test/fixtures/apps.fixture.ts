import { Browser, test } from "@playwright/test";
import { AppLandingPage } from "../pages/app.landing.page";
import { BasePage } from "../pages/base.page";
import { UserPage } from "../users-storage-state/user";
import { AppsOrgUrl } from "../utils/app.constants";
import {
  PTTestSettings,
  UserApp,
} from "../utils/test.settings";

export type AppsFixture = {
  appsFixture: Map<string, BasePage>;
};

type ExtendParams = Parameters<
  typeof test.extend<{}, PTTestSettings & AppsFixture>
>;

export const ptAppsFixture: ExtendParams[0] = {
  usersApps: [
    [{ userName: "agent name", password: "ss", appName: "serviceapp" }],
    { scope: "worker", option: true },
  ],
  appsFixture: [
    async ({ browser, usersApps }, use) => {
      await use(await GetUsersAppsPage(usersApps, browser));
    },
    {
      scope: "worker",
    },
  ],
};

async function GetUsersAppsPage(agentUsers: UserApp[], browser: Browser) {
  let userApps = new Map<string, BasePage>();
  await Promise.all(
    agentUsers.map(async (user) => {
      // get logged in user page
      const userPage = await UserPage.create(browser, user);
      const appPage = await getAppsPage(userPage, user.appName);
      userApps.set(user.appName + user.userName, appPage);
    })
  );
  return userApps;
}

async function getAppsPage(userPage: UserPage, appName: string) {
  const appLandingPage = new AppLandingPage(userPage.page);
  await appLandingPage.NavigateTo(AppsOrgUrl);
  return await appLandingPage.NaviateToApp(appName);
}
