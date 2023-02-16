import { test } from "../../fixtures/pt/pt.fixture";
import * as selectors from "../../pages/selectors.json";
import { AppNames } from "../../utils/app.constants";
import { UserApp } from "../../utils/test.settings";
import {
  AppsPage,
  UserApps,
  UserEmail,
  RandomNumber,
} from "../../utils/test.utils";
import * as data from "../../data/test.data.json";
import { CustomerServiceWorkspaceAppsPage } from "../../pages/livechat/apps/customer.service.workspace";
import { CustomerServiceAdminAppsPage } from "../../pages/livechat/apps/customer.service.admin.center";
import { AppProfileHelper } from "../../helper/appprofile-helper";
import { stringFormat } from "../../utils/test.utils";

var caseNameList: string[] = [];
const agentUsers = data.Users.ChannelIntegrations.agent;
const usersCSWApps: UserApp = UserApps(
  UserEmail(agentUsers[0].userName),
  AppNames.CSWorkspaceAppName
);
const adminUsers = data.Users.ChannelIntegrations.admin;
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
  let rnd = RandomNumber();

  test.beforeAll(async ({ appsFixture }) => {
    cswAppsPage = AppsPage(usersCSWApps, appsFixture);
    csAdminApps = AppsPage(usersAdminApps, appsFixture);
  });

  test.beforeAll(async ({ appsFixture }) => {
    await AppProfileHelper.getInstance().CreateAppProfile();
  });

  test("Test Case 2253509: [Macros] Verify custom control application template is opened in new tab using 'Open application tab' action in macros", async ({}) => {
    await csAdminApps.reload();
    //Validate HelpLauncher is present
    var CaseTitleName = selectors.CommonConstants.AutomationCase + rnd;
    caseNameList = [CaseTitleName];
    await cswAppsPage.AgentDashboardPage.createIncidents(caseNameList);
    await cswAppsPage.AgentDashboardPage.InitiateSessionUsingLink(
      CaseTitleName,
      stringFormat(selectors.CommonConstants.AutomationCaseRndlink, rnd)
    );
    await cswAppsPage.AgentDashboardPage.runMacroInSessionAndValidateUsingCodegen(
      selectors.CommonConstants.OdataAgentScriptName,
      selectors.CommonConstants.OdataValidationTitle
    );
  });
});
