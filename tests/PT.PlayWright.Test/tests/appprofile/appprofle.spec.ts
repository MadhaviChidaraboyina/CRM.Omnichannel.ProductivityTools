import { test } from "../../fixtures/pt/pt.fixture";
import * as selectors from "../../pages/selectors.json";
import { AppNames } from "../../utils/app.constants";
import { UserApp } from "../../utils/test.settings";
import { AppsPage, UserApps, UserEmail } from "../../utils/test.utils";
import * as data from "../../data/test.data.json";
import { CustomerServiceWorkspaceAppsPage } from "../../pages/livechat/apps/customer.service.workspace";
import { CustomerServiceAdminAppsPage } from "../../pages/livechat/apps/customer.service.admin.center";
import { AppProfileHelper } from "../../helper/appprofile-helper";
import { AppProfileConstants } from "../../utils/app.constants";

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

test.describe.serial("@AppProfile: Custom App Profile Tests", () => {
  let cswAppsPage: CustomerServiceWorkspaceAppsPage;
  let csAdminApps: CustomerServiceAdminAppsPage;

  test.beforeAll(async ({ appsFixture }) => {
    cswAppsPage = AppsPage(usersCSWApps, appsFixture);
    csAdminApps = AppsPage(usersAdminApps, appsFixture);
  });

  test.beforeAll(async ({ appsFixture }) => {
    await AppProfileHelper.getInstance().CreateAppProfile();
  });

  test("Test Case 1986287: Verify when OC channel is disabled for a profile, presence should not load for the corresponding user. ", async ({}) => {
    await csAdminApps.reload();
    //Validate HelpLauncher is present
    await csAdminApps.CustomProfilePage.searchAppProfile(AppProfileConstants.TestAppProfileName);

    await cswAppsPage.PresenseDialog.IsAgentPresenseLoaded();
    //Validate HelpLauncher is present
    await cswAppsPage.ValidateElementVisible(
      selectors.PresencePage.HelpLauncher
    );
    await csAdminApps.CustomProfilePage.enableChannelProvider();
    //Validate PresenceDialog is visible
    await cswAppsPage.ValidateElementVisible(
      selectors.PresencePage.PresenceDialog
    );
  }); 
});
