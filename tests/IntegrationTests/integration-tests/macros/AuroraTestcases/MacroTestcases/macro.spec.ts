import { BrowserContext, Page } from "playwright";
import { Constants } from "../../../common/constants";
import { LiveChatPage } from "../../../../pages/LiveChat";
import { Macros } from "../../../macropages/macrosAdmin";
import { OrgDynamicsCrmStartPage } from "../../../../pages/org-dynamics-crm-start.page";
import { TestHelper } from "../../../../helpers/test-helper";
import { TestSettings } from "../../../../configuration/test-settings";
import { AgentScript } from "integration-tests/agentScript/pages/agentScriptAdmin";
import { AgentChat } from "pages/AgentChat";

describe("Macro Test Scenerios - ", () => {
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
    ///Test Case 2313858: [Macros] Verify record is link to the conversation using 'Link record to the conversation' action in the macros.
    /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2313858
    ///</summary>
    it("Test Case 2313858: [Macros] Verify record is link to the conversation using 'Link record to the conversation' action in the macros.", async () => {
        agentPage = await agentContext.newPage();
        const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        const agentChat = new AgentChat(agentPage);
        try {
            //Login as admin and create macro
            await adminStartPage.navigateToOrgUrlAndSignIn(
                TestSettings.AdminAccountEmail,
                TestSettings.AdminAccountPassword
            );
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            const accountId1 = await macrosAdminPage.createAccountAndGetAccountId(
                Constants.AccountName1
            );
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
            await macrosAdminPage.createMacro(Constants.LinkRecordMacro, accountId1);
            //Initiate live chat with agent
            await macrosAdminPage.initiateLiveChatWithMacroAgent(liveChatPage);
            //Login as agent and accept chat
            await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(
                TestSettings.AdminAccountEmail,
                agentStartPage,
                agentChat
            );
            await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);
            //Check API response through console
            const result = await agentPage.evaluate(async () => {
                const ctrl = await (
                    window as any
                ).Microsoft.ProductivityMacros.runMacro("LinkRecordMacro");
                return ctrl;
            });
            expect(result).toBe(Constants.ActionPerformedSuccessfully);
            //Check API result on UI
            const LinkRecordVerification = await macrosAdminPage.VerifyLinkedMacro(
                agentPage
            );
            expect(LinkRecordVerification).toBeTruthy();
            //End live chat
            await agentChat.closeUnusedChat();
            await liveChatPage.closeChat();
        } finally {
            await macrosAdminPage.deleteAccountLinkUnlink(
                adminPage,
                adminStartPage,
                Constants.AccountName1
            );
            await macrosAdminPage.deleteMacro(
                adminStartPage,
                Constants.LinkRecordMacro
            );
        }
    });
    ///<summary>
    ///Test Case 2313863: [Macros] Verify record is unlink to the conversation using 'UnLink record from the conversation' action in the macros.
    /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2313863
    ///</summary>
    it("Test Case 2313863: [Macros] Verify record is unlink to the conversation using 'UnLink record to the conversation' action in the macros.", async () => {
        agentPage = await agentContext.newPage();
        const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        const agentChat = new AgentChat(agentPage);
        try {
            //Login as admin and create macro
            await adminStartPage.navigateToOrgUrlAndSignIn(
                TestSettings.AdminAccountEmail,
                TestSettings.AdminAccountPassword
            );
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            const accountId1 = await macrosAdminPage.createAccountAndGetAccountId(
                Constants.AccountName1
            );
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
            await macrosAdminPage.createMacro(Constants.LinkRecordMacro, accountId1);
            await macrosAdminPage.createMacro(
                Constants.UnlinkRecordMacro,
                accountId1
            );
            //Initiate live chat with agent
            await macrosAdminPage.initiateLiveChatWithMacroAgent(liveChatPage);
            //Login as agent and accept chat
            await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(
                TestSettings.AdminAccountEmail,
                agentStartPage,
                agentChat
            );
            await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);
            //Check API response through console
            const result1 = await agentPage.evaluate(async () => {
                const ctrl = await (
                    window as any
                ).Microsoft.ProductivityMacros.runMacro("LinkRecordMacro");
                return ctrl;
            });
            expect(result1).toBe(Constants.ActionPerformedSuccessfully);
            const result = await agentPage.evaluate(async () => {
                const ctrl = await (
                    window as any
                ).Microsoft.ProductivityMacros.runMacro("UnlinkRecordMacro");
                return ctrl;
            });
            expect(result).toBe(Constants.ActionPerformedSuccessfully);
            //Check API result on UI
            const UnlinkRecordVerification =
                await macrosAdminPage.VerifyUnlinkedMacro(agentPage);
            expect(UnlinkRecordVerification).toBeTruthy();
            //End live chat
            await agentChat.closeUnusedChat();
            await liveChatPage.closeChat();
        } finally {
            await macrosAdminPage.deleteAccountLinkUnlink(
                adminPage,
                adminStartPage,
                Constants.AccountName1
            );
            await macrosAdminPage.deleteMacro(
                adminStartPage,
                Constants.LinkRecordMacro
            );
            await macrosAdminPage.deleteMacro(
                adminStartPage,
                Constants.UnlinkRecordMacro
            );
        }
    });

    ///<summary>
    /// Test Case 1805099: [Macros] Verify KB article link is copied using ‘Search Knowledge base article’ action in the chat window using 'Send KB article' in macro
    /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1805099
    ///</summary>
    it("Test Case 1805099: [Macros] Verify KB article link is copied using ‘Search Knowledge base article’ action in the chat window using 'Send KB article' in macro", async () => {
        agentPage = await agentContext.newPage();
        const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        const agentChat = new AgentChat(agentPage);
        try {
            //Login as admin and create macro
            await adminStartPage.navigateToOrgUrlAndSignIn(
                TestSettings.AdminAccountEmail,
                TestSettings.AdminAccountPassword
            );
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.EnableKbUrlLink();
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
            await macrosAdminPage.createMacro(Constants.SendKbArticle);
            //Initiate live chat with agent
            await macrosAdminPage.initiateLiveChatWithMacroAgent(liveChatPage);
            //Login as agent and accept chat
            await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(
                TestSettings.AdminAccountEmail,
                agentStartPage,
                agentChat
            );
            await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);
            //Check API response through console
            const result = await agentPage.evaluate(async () => {
                const ctrl = await (
                    window as any
                ).Microsoft.ProductivityMacros.runMacro("SendKbArticle");
                return ctrl;
            });
            expect(result).toBe(Constants.ActionPerformedSuccessfully);
            const SendKbArticleVerification = await macrosAdminPage.VerifyKbUrlLink(
                agentPage
            );
            expect(SendKbArticleVerification).toBeTruthy();
            //End live chat
            await agentChat.closeUnusedChat();
            await liveChatPage.closeChat();
        } finally {
            await macrosAdminPage.deleteMacro(
                adminStartPage,
                Constants.SendKbArticle
            );
        }
    });
});