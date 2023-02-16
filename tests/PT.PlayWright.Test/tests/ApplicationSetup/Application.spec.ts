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

  test.beforeAll(async ({ appsFixture }) => {
    cswAppsPage = AppsPage(usersCSWApps, appsFixture);
    csAdminApps = AppsPage(usersAdminApps, appsFixture);
  });

  test.beforeAll(async ({ appsFixture }) => {
    await AppProfileHelper.getInstance().CreateAppProfile();
  });

  test("Test Case 2045183: [Application Setup] : Verify Queues in Customer WorkSpace App that are created in Customer Service Hub", async ({}) => {
    let rnd = RandomNumber();
    await csAdminApps.reload();
    //Validate HelpLauncher is present
    var QueueTitleName = selectors.CommonConstants.AutomationQueue + rnd;
    await csAdminApps.CustomProfilePage.CreatePublicQueue(
      QueueTitleName
    );
    var CaseTitleName = selectors.CommonConstants.AutomationCase + rnd;
    var CaseTitleName1 = selectors.CommonConstants.AutomationCase2 + rnd;
    var CaseTitleName2 = selectors.CommonConstants.AutomationCase3 + rnd;
    caseNameList = [CaseTitleName,CaseTitleName1,CaseTitleName2];
    await cswAppsPage.AgentDashboardPage.createIncidents(caseNameList);
    await cswAppsPage.AgentDashboardPage.AddQueueToExistingCases(
      QueueTitleName,
      CaseTitleName2
    );
    await cswAppsPage.AgentDashboardPage.AddQueueToExistingCases(
      QueueTitleName,
      CaseTitleName1
    );
    await cswAppsPage.AgentDashboardPage.AddQueueToExistingCases(
      QueueTitleName,
      CaseTitleName
    );
    await cswAppsPage.AgentDashboardPage.OpenCasesLinkedToQueue(QueueTitleName);
    await cswAppsPage.ValidateElementVisible(
      selectors.CommonConstants.LinkStart+( CaseTitleName2)+selectors.CommonConstants.LinkEnd
    );
    await cswAppsPage.ValidateElementVisible(
      selectors.CommonConstants.LinkStart+( CaseTitleName1)+selectors.CommonConstants.LinkEnd
    );
    await cswAppsPage.ValidateElementVisible(
      selectors.CommonConstants.LinkStart+( CaseTitleName)+selectors.CommonConstants.LinkEnd
    );
  });
});
