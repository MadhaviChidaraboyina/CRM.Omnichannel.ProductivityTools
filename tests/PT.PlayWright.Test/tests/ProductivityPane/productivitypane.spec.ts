import { test } from "../../fixtures/pt/pt.fixture";
import { AppNames, CustomerServiceAgentConstants } from "../../utils/app.constants";
import { LiveChatWidget, UserApp } from "../../utils/test.settings";
import {
    AppsPage,
    GetLiveChatWidgetPage,
    RandomNumber,
    UserApps,
    UserEmail,
} from "../../utils/test.utils";
import * as data from "../../data/test.data.json";
import { CustomerServiceWorkspaceAppsPage } from "../../pages/livechat/apps/customer.service.workspace";
import { CustomerServiceAdminAppsPage } from "../../pages/livechat/apps/customer.service.admin.center";
import { LiveChatWidgetPage } from "../../pages/livechat/customer/live.chat.widget.page";
import { expect } from "@playwright/test";
import { AgentPresenseStatus } from "../../utils/livechat/livechat.constants";
import * as selectors from "../../pages/selectors.json";

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
const widget = data.Users.ConversationSummary.livechatwidget;
const LCWwidget: LiveChatWidget = { widgetName: widget[0].Name };

test.use({
    usersApps: [usersCSWApps, usersAdminApps],
    liveChatWidgets: [LCWwidget],
});

test.describe.serial("@Productivity Pane Scenarios ", () => {
    let cswAppsPage: CustomerServiceWorkspaceAppsPage;
    let csAdminApps: CustomerServiceAdminAppsPage;
    let liveChatWidgetPage: LiveChatWidgetPage;

    test.beforeAll(async ({ appsFixture, liveChatWidgetFixture }) => {
        cswAppsPage = AppsPage(usersCSWApps, appsFixture);
        csAdminApps = AppsPage(usersAdminApps, appsFixture);
        liveChatWidgetPage = GetLiveChatWidgetPage(
            LCWwidget,
            liveChatWidgetFixture
        );
    });

    ///<summary>
    ///Test Case 2762878: [Productivity Pane: Smart Assist] : Verify Link article to case action; save and see added on Associated Knowledge Articles grid
    /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2762878
    ///</summary>
    test("Test Case 2762878: [Productivity Pane: Smart Assist] : Verify Link article to case action; save and see added on Associated Knowledge Articles grid", async ({ }) => {
        await csAdminApps.reload();
        //Navigate to Insights -> Suggestions for agents
        await csAdminApps.InsightsPagePage.navigateToSuggestionsForAgents();
        //Verify Setup smart assist is available for similar case and article suggestions
        await csAdminApps.ValidateThePageElement(selectors.CustomerServiceAdminPage.EnableSimilarCaseSuggestions);
        await csAdminApps.ValidateThePageElement(selectors.CustomerServiceAdminPage.EnableKnowledgeArticleSuggestions);
        await cswAppsPage.AgentDashboardPage.ValidateHome();
        var CaseTitleName = CustomerServiceAgentConstants.CaseTitleName;
        caseNameList = [CaseTitleName];
        await cswAppsPage.AgentDashboardPage.createIncidents(caseNameList);
        await cswAppsPage.ChatConversationControl.RefreshAllTab();
        await cswAppsPage.AgentDashboardPage.InitiateSessionUsingLink(CaseTitleName, selectors.CustomerServiceWorkspace.CaseTitleLink);
        //Verify that KB suggestions should be shown on smart assist      
        await cswAppsPage.ValidateThePageElement(selectors.CustomerServiceWorkspace.SmartAssist);
        await cswAppsPage.ValidateThePageElement(selectors.CustomerServiceWorkspace.KnowledgeArticle);
        await cswAppsPage.ValidateThePageElement(selectors.CustomerServiceWorkspace.KnowledgeArticleSuggestions);
        //Click on Link action for any article
        await cswAppsPage.AgentDashboardPage.LinkAction();   
        await cswAppsPage.ValidateThePageElement(selectors.CustomerServiceWorkspace.ArticleLinkedMessage);
        await cswAppsPage.AgentDashboardPage.ClickSaveCase();
        //Navigate to Associated Knowledge Articles grid and verify article is linked successfully
        await cswAppsPage.AgentDashboardPage.NavigateToDetailsTab();
        await cswAppsPage.ValidateThePageElement(selectors.CustomerServiceWorkspace.LinkedArticleToCase);       
    });
});
