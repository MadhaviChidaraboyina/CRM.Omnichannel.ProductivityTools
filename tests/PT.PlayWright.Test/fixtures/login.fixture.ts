import { Browser, test } from "@playwright/test";
import { UserPage } from "../users-storage-state/user";
import { PTTestSettings, UserApp } from "../utils/test.settings";

export type LoginFixture = {
  loginFixture: void;
};

type ExtendParams = Parameters<
  typeof test.extend<{}, PTTestSettings & LoginFixture>
>;

export const ptLoginFixture: ExtendParams[0] = {
  usersApps: [
    [{ userName: "agent name", password: "ss", appName: "serviceapp" }],
    { scope: "worker", option: true },
  ],
  loginFixture: [
    async ({ browser, usersApps }, use) => {
      await use(await GetUsersPage(usersApps, browser));
    },
    {
      scope: "worker",
    },
  ],
};

async function GetUsersPage(agentUsers: UserApp[], browser: Browser) {
  await Promise.all(
    agentUsers.map(async (user) => {
      await UserPage.Login(user);
    })
  );
}
