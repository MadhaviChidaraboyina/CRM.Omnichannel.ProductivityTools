import { BrowserContext, Page } from "playwright";
import { Constants } from "../../../common/constants";
import { Macros } from "../../../macropages/macrosAdmin";
import { OrgDynamicsCrmStartPage } from "../../../../pages/org-dynamics-crm-start.page";
import { TestHelper } from "../../../../helpers/test-helper";
import { TestSettings } from "../../../../configuration/test-settings";
import { LiveChatPage } from "pages/LiveChat";
import { AgentChat } from "pages/AgentChat";

describe("AgentScript Test Scenerios - ", () => {
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
    ///Test Case 2056506: 2042783 Agent script , smart assist, knowledge article icons should load for both custom and default app profiles
    /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2056506
    ///</summary>
    it("Test Case 2056506: 2042783 Agent script , smart assist, knowledge article icons should load for both custom and default app profiles", async () => {
        agentPage = await agentContext.newPage();
        const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        const agentChat = new AgentChat(agentPage);
        try {
            //Login as admin and create case
            await adminStartPage.navigateToOrgUrlAndSignIn(
                TestSettings.AdminAccountEmail,
                TestSettings.AdminAccountPassword
            );
            //Login as agent and accept chat and validate
            await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(TestSettings.AdminAccountEmail,
                agentStartPage,
                agentChat
            );
            await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);
            await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);
            await macrosAdminPage.ValidateThePage(Constants.AStool);
            await macrosAdminPage.ValidateThePage(Constants.SAtool);
            await macrosAdminPage.ValidateThePage(Constants.KStool);
            //Closing Chat
            await agentChat.closeUnusedChat();
            await liveChatPage.closeChat();
            //Create new app profile
            await adminStartPage.goToCustomerServiceAdmincenter();
            await macrosAdminPage.createAppProfile();
            await macrosAdminPage.AddUsers(TestSettings.InboxUser);
            await macrosAdminPage.AddEntitySession(
                Constants.SessionTemplateinPowerApps
            );
            await macrosAdminPage.EnableProductivityPane();
            //Login as agent and accept chat and valiate
            await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(TestSettings.AdminAccountEmail,
                agentStartPage,
                agentChat
            );
            await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);
            await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);
            await macrosAdminPage.ValidateThePage(Constants.AStool);
            await macrosAdminPage.ValidateThePage(Constants.SAtool);
            await macrosAdminPage.ValidateThePage(Constants.KStool);
            //Closing Chat
            await agentChat.closeUnusedChat();
            await liveChatPage.closeChat();
        } finally {
            await adminPage.reload();
            await macrosAdminPage.deleteAppProfile(adminPage, adminStartPage);
            await agentChat.closeUnusedChat();
            await liveChatPage.closeChat();
        }
    });

    ///<summary>
    ///Test Case 1785761: [Sanity][All Channels] Verify Agent scripts are loading in Productivity pane, Macros are running and expression builder is executing as per inputs
    /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1785761
    ///</summary>
    it("Test Case 1785761: [Sanity][All Channels] Verify Agent scripts are loading in Productivity pane, Macros are running and expression builder is executing as per inputs", async () => {
        agentPage = await agentContext.newPage();
        const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        const agentChat = new AgentChat(agentPage);
        try {
            //Login as admin and create macro
            await adminStartPage.navigateToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
            await macrosAdminPage.createMacro(Constants.OpenFocustab);

            //Initiate live chat with agent
            await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);

            //Login as agent and accept chat
            await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(TestSettings.AdminAccountEmail,
                agentStartPage, agentChat);
            await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);

            //Check API response through console
            const result = await agentPage.evaluate(async () => {
                const ctrl = await (window as any).Microsoft.ProductivityMacros.runMacro("FocustabMacro");
                return ctrl;
            });
            expect(result).toBe(Constants.ActionPerformedSuccessfully);

            //End live chat
            await macrosAdminPage.closeConversation(agentPage, agentChat);
            await liveChatPage.closeChat();
        }
        finally {
            await macrosAdminPage.deleteMacro(adminStartPage, Constants.OpenFocustab);
        }
    });
});