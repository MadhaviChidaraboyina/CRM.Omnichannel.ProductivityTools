import { test } from "../../fixtures/pt/pt.fixture";
import { AppNames } from "../../utils/app.constants";
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
test.describe.serial("@Admin Test Scenerios ", () => {
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
  test("Test Case 2045253: [Productivity Pane: Smart Assist] : Validate if KB and similar case sugestions are turned off from CSH, message is shown on smart assist", async ({}) => {
    //turnoff suggestions in insights
    await csAdminApps.CustomProfilePage.TurnOffSuggetions();
    //verify AI suggestions not turned on
    await cswAppsPage.PresenseDialog.ValidateKBAndSimilarCases();
    //turnonsuggestions in insights
    await csAdminApps.CustomProfilePage.TurnOnSuggetions();
  });
});