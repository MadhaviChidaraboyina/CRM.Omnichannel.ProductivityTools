import { test } from "../../fixtures/pt/pt.fixture";
import { AppNames, CustomerServiceAgentConstants, AppProfileConstants } from "../../utils/app.constants";
import { UserApp } from "../../utils/test.settings";
import {
    AppsPage,
    RandomNumber,
    UserApps,
    UserEmail,
} from "../../utils/test.utils";
import * as data from "../../data/test.data.json";
import { CustomerServiceWorkspaceAppsPage } from "../../pages/livechat/apps/customer.service.workspace";
import { expect } from "@playwright/test";
import { AgentPresenseStatus } from "../../utils/livechat/livechat.constants";
import * as selectors from "../../pages/selectors.json";
import { CustomerServiceAdminAppsPage } from "../../pages/livechat/apps/customer.service.admin.center";

var caseNameList: string[] = [];
const agentUsers = data.Users.ConversationSummary.agent;
const usersCSWApps: UserApp = UserApps(
    UserEmail(agentUsers[0].userName),
    AppNames.CSWorkspaceAppName
);
const adminUsers = data.Users.ConversationSummary.admin;
const usersAdminApps: UserApp = UserApps(
    UserEmail(adminUsers[0].userName),
    AppNames.CSAdminCenterAppName
);

test.use({
    usersApps: [usersCSWApps, usersAdminApps],
});

test.describe.serial("@Agent Script Scenarios ", () => {
    let cswAppsPage: CustomerServiceWorkspaceAppsPage;
    let csAdminApps: CustomerServiceAdminAppsPage;

    test.beforeAll(async ({ appsFixture }) => {
        cswAppsPage = AppsPage(usersCSWApps, appsFixture);
        csAdminApps = AppsPage(usersAdminApps, appsFixture);
    });

    ///<summary>
    ///Test Case 2056506: 2042783 Agent script , smart assist, knowledge article icons should load for both custom and default app profiles
    /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2056506
    ///</summary>
    test("Test Case 2056506: 2042783 Agent script , smart assist, knowledge article icons should load for both custom and default app profiles", async ({ }) => {
        let rnd = RandomNumber();

        const AppProfileName = AppProfileConstants.AppProfileName1 + rnd;
        const AppProfileUniqueName = AppProfileConstants.AppProfileUniqueName + rnd;

        await cswAppsPage.PresenseDialog.VerifySetAgentPresenseStatus(
            AgentPresenseStatus.Available
        );
        await cswAppsPage.AgentDashboardPage.ValidateHome();
        var CaseTitleName = CustomerServiceAgentConstants.CaseTitleName;
        caseNameList = [CaseTitleName];
        await cswAppsPage.AgentDashboardPage.createIncidents(caseNameList);
        await cswAppsPage.ChatConversationControl.RefreshAllTab();
        await cswAppsPage.AgentDashboardPage.InitiateSessionUsingLink(CaseTitleName, selectors.CustomerServiceWorkspace.CaseTitleLink);
        //In default app profile check for Agent script, smart assist, knowledge article icons in productivity pane.
        await cswAppsPage.ValidateThePageElement(selectors.CustomerServiceWorkspace.KStool);
        await cswAppsPage.ValidateThePageElement(selectors.CustomerServiceWorkspace.AStool);
        await cswAppsPage.ValidateThePageElement(selectors.CustomerServiceWorkspace.SAtool);
        await csAdminApps.reload();
        //Create custom app profile, Add user, initiate session
        await csAdminApps.WorkSpacesPagePage.createAppProfileByParameter(AppProfileName, AppProfileUniqueName);
        await csAdminApps.WorkSpacesPagePage.AddUsers(AppProfileConstants.TestUser);
        await csAdminApps.WorkSpacesPagePage.EnableProductivityPane();
        await cswAppsPage.ChatConversationControl.HomeSession();
        await cswAppsPage.ChatConversationControl.RefreshAllTab();
        await cswAppsPage.AgentDashboardPage.createIncidents(caseNameList);
        await cswAppsPage.ChatConversationControl.RefreshAllTab();
        await cswAppsPage.AgentDashboardPage.InitiateSessionUsingLink(CaseTitleName, selectors.CustomerServiceWorkspace.CaseTitleLink);
        //check for Agent script, smart assist, knowledge article icons in productivity pane.
        await cswAppsPage.ValidateThePageElement(selectors.CustomerServiceWorkspace.KStool);
        await cswAppsPage.ValidateThePageElement(selectors.CustomerServiceWorkspace.AStool);
        await cswAppsPage.ValidateThePageElement(selectors.CustomerServiceWorkspace.SAtool);
        await csAdminApps.WorkSpacesPagePage.DeleteAppProfileWithParameter(AppProfileName);
    });
});