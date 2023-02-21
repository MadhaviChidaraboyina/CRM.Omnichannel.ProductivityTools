import { test } from "../../fixtures/pt/pt.fixture";
import * as selectors from "../../pages/selectors.json";
import { AppNames } from "../../utils/app.constants";
import { UserApp } from "../../utils/test.settings";
import { AppsPage, UserApps, UserEmail, RandomNumber } from "../../utils/test.utils";
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

  ///<summary>
  ///Test Case 2732761: [App Profile Manager] : Verify Shift click, control click, actions with csr(roles csr, app access, productivity tool user) With Custom App Profile
  ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2732761
  ///<summary>
  test("Test Case 2732761: [App Profile Manager] : Verify Shift click, control click, actions with csr(roles csr, app access, productivity tool user) With Custom App Profile" , async ({}) => {
    let rnd = RandomNumber();
    await csAdminApps.reload();
    // customer service admin center => workspaces => creating Agent experience profile.
    await csAdminApps.CustomProfilePage.createingTheCustomProfileCSAC();
    // Validate the Productivity pane is enable or not 
    await csAdminApps.CustomProfilePage.ValiadatetheProductivitypane();
    // customer serivce workspace => going to case by apply key Shift in Case study.
    await cswAppsPage.PresenseDialog.verifyShiftClick(selectors.CommonConstants.AutomationCase);
    //validating the productivty panel are avaliable in the 
    await cswAppsPage.PresenseDialog.verifySmartAssistTabs();
     // clicking control key and Checking the Productivity pane
    await cswAppsPage.PresenseDialog.verifyControlClick(selectors.CommonConstants.AutomationCase); 
     }); 
});