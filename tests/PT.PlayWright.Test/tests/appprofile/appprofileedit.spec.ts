import { test } from "../../fixtures/pt/pt.fixture";
 import { AppNames, ChannelProviderConstants } from "../../utils/app.constants";
import { UserApp } from "../../utils/test.settings";
import { AppsPage, RandomNumber, UserApps, UserEmail } from "../../utils/test.utils";
import * as data from "../../data/test.data.json";
import { CustomerServiceWorkspaceAppsPage } from "../../pages/livechat/apps/customer.service.workspace";
import { CustomerServiceAdminAppsPage } from "../../pages/livechat/apps/customer.service.admin.center";
import { AppProfileHelper } from "../../helper/appprofile-helper";
import { AppProfileConstants } from "../../utils/app.constants";
import { PTProviderHelper } from "../../helper/ptprovider-helper";
import { expect } from "@playwright/test";
 
const agentUsers = data.Users.AppProfile.agent;
const usersCSWApps: UserApp = UserApps(
  UserEmail(agentUsers[0].userName),
  AppNames.CSWorkspaceAppName
);
const adminUsers = data.Users.AppProfile.admin;
const usersAdminApps: UserApp = UserApps(
  UserEmail(adminUsers[0].userName),
  AppNames.CSAdminCenterAppName
);

test.use({
  usersApps: [usersCSWApps, usersAdminApps],
});

test.describe.serial("@AppProfile: Custom App Profile Edit Tests", () => {
  let cswAppsPage: CustomerServiceWorkspaceAppsPage;
  let csAdminApps: CustomerServiceAdminAppsPage;

  test.beforeAll(async ({ appsFixture }) => {
    cswAppsPage = AppsPage(usersCSWApps, appsFixture);
    csAdminApps = AppsPage(usersAdminApps, appsFixture);
  });

  test.beforeAll(async ({ appsFixture }) => {
    await AppProfileHelper.getInstance().CreateAppProfile();
  }); 
 
  test("Test Case 1968349: Verify admin E2E experience in configuring Third Party Channel provider tab for an app profile", async ({}) => {
    
    let rnd = RandomNumber();
    const channelProviderName = ChannelProviderConstants.TestChannelProvider + rnd;
    await PTProviderHelper.getInstance().createThirdPartyChannelProvider(
      channelProviderName,
      ChannelProviderConstants.TestChannelProviderUniqueName + rnd
    );
    await csAdminApps.reload();
    await csAdminApps.CustomProfilePage.searchAppProfile(AppProfileConstants.TestAppProfileName);
    await csAdminApps.CustomProfilePage.addandEditChannelProvider(channelProviderName);
    expect(
      await csAdminApps.CustomProfilePage.validateProvider(channelProviderName)
    );
  });
});
