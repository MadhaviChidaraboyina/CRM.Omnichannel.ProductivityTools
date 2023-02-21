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
  test("Test Case 2763116: [Productivity Pane: Smart Assist] : Verify Link similar case to case action; save and see added on Associated Similar Cases grid", async ({}) => {
    //Turn On the suggestions for similar cases 
    await csAdminApps.CustomProfilePage.TurnOnSuggetions();
    //open the record in CSW
    await cswAppsPage.PresenseDialog.SelectCase();
    //Link similarCases
    const ReceivedCurrentSimilarCase=await cswAppsPage.PresenseDialog.Linksimilarcasetocaseaction();
    //Verify that appropriate message should be shown after clicking link and case should linked to opened case session
    await cswAppsPage.PresenseDialog.VerifyLinksimilarcasetocaseaction(ReceivedCurrentSimilarCase);
    //Unlink Similarcases
    await cswAppsPage.PresenseDialog.UnLinksimilarcasetocaseaction();
    await cswAppsPage.PresenseDialog.closePage();
    await csAdminApps.CustomProfilePage.ClosePage();
  });
});