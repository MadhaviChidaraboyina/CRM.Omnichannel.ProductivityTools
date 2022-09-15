import { AgentChat } from "../../../pages/AgentChat";
import { BrowserContext, Page } from "playwright";
import { Constants } from "../../common/constants";
import { LiveChatPage } from "../../../pages/LiveChat";
import { Macros } from "../../macropages/macrosAdmin";
import { OrgDynamicsCrmStartPage } from "../../../pages/org-dynamics-crm-start.page";
import { TestHelper } from "../../../helpers/test-helper";
import { TestSettings } from "../../../configuration/test-settings";

describe("Live Chat - ", () => {
  let adminContext: BrowserContext;
  let adminPage: Page;
  let adminStartPage: OrgDynamicsCrmStartPage;
  let agentPage: Page;
  let agentContext: BrowserContext;
  let liveChatContext: BrowserContext;
  let liveChatPage: LiveChatPage;
  let macrosAdminPage: Macros;

  beforeEach(async () => {
    adminContext = await browser.newContext({
      viewport: TestSettings.Viewport,
    });
    liveChatContext = await browser.newContext({
      viewport: TestSettings.Viewport,
      acceptDownloads: true,
    });
    agentContext = await browser.newContext({
      viewport: TestSettings.Viewport,
      acceptDownloads: true,
    });
    adminPage = await adminContext.newPage();
    adminStartPage = new OrgDynamicsCrmStartPage(adminPage);
    macrosAdminPage = new Macros(adminPage);
  });
  afterEach(async () => {
    TestHelper.dispose(adminContext);
    TestHelper.dispose(liveChatContext);
    TestHelper.dispose(agentContext);
  });

  ///<summary>
  ///Test Case 1846840: To verify that agent presence is set to "Inactive" if Missed notifications settings is turned on and agent misses a notification
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1846840
  ///</summary>
  it("Test Case 1846840: To verify that agent presence is set to Inactive if Missed notifications settings is turned on and agent misses a notification", async () => {
    agentPage = await agentContext.newPage();
    const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
    liveChatPage = new LiveChatPage(await liveChatContext.newPage());
    const agentChat = new AgentChat(agentPage);
    try {
      //Login as admin automated and redirected to OrgUrl
      await adminStartPage.navigateToOrgUrlAndSignIn(
        TestSettings.LiveChatPTEAccountEmail,
        TestSettings.AdminAccountPassword
      );
      await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
      await macrosAdminPage.TurnOnMissedNotifications();
      //Initiate live chat with agent
      await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);
      //Login as agent and accept chat
      await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(TestSettings.LiveChatPTEAccountEmail,
        agentStartPage,
        agentChat
      );
      await macrosAdminPage.StatusPresence(agentChat);
      //End live chat
      await agentChat.closeUnusedChat();
      await liveChatPage.closeChat();
    } finally {
      console.log("validation Successfully");
    }
  });

  ///<summary>
  ///Test Case 2353026: Verify Add new contact button on 'Customer Summary' is working
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2353026
  ///</summary>
  it("Test Case 2353026: Verify Add new contact button on 'Customer Summary' is working", async () => {
    agentPage = await agentContext.newPage();
    const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
    liveChatPage = new LiveChatPage(await liveChatContext.newPage());
    const agentChat = new AgentChat(agentPage);
    try {
      await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(TestSettings.LiveChatPTEAccountEmail, agentStartPage, agentChat);
      await macrosAdminPage.StatusPresence(agentChat);
      await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);
      await agentChat.acceptInvitationToChat();
      await macrosAdminPage.initiateNewContactTab(agentPage);
      //End live chat
      //await agentChat.closeOCAgentChatConversation();
      //await liveChatPage.closeChat();
    }
    finally {
      console.log("validation Successfully");
    }
  });
});
