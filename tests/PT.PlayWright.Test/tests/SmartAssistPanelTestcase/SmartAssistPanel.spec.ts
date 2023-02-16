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
  ///Test Case 2763153: [Productivity Pane: Smart Assist] : Verify Delete similar case from Associated Similar Cases grid, close and reopen case, suggestion should be unlinked and Linked to case label removed
  ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2763153
  ///<summary>
  test.only("Test Case 2763153: [Productivity Pane: Smart Assist] : Verify Delete similar case from Associated Similar Cases grid, close and reopen case, suggestion should be unlinked and Linked to case label removed" , async ({}) => {
    let rnd = RandomNumber();
    await csAdminApps.reload();
    // customer service admin center => insights
     await csAdminApps.CustomProfilePage.checkForSuggestion();
    // customer serivce workspace to the linked case in similar case suggestion
     await cswAppsPage.PresenseDialog.LinkAndUnlinkCase(selectors.CommonConstants.ClickLinkCase);
     // customer serivce workspace going to related => connection
     await cswAppsPage.PresenseDialog.OpenSuggessionCase();
     //deleteing the AssociatedRecords in connections
     await cswAppsPage.PresenseDialog.DeleteAssociatedRecord();
     }); 
});
