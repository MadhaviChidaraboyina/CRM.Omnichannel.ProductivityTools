import { AgentChat } from "../../../pages/AgentChat";
import { BrowserContext, Page } from "playwright";
import { Constants } from "../../common/constants";
import { LiveChatPage } from "../../../pages/LiveChat";
import { Macros } from "../pages/macrosAdmin";
import { OrgDynamicsCrmStartPage } from "../../../pages/org-dynamics-crm-start.page";
import { TestHelper } from "../../../helpers/test-helper";
import { TestSettings } from "../../../configuration/test-settings";
import { AgentScript } from "../../../integration-tests/agentScript/pages/agentScriptAdmin";

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
            viewport: TestSettings.Viewport, acceptDownloads: true,
        });
        agentContext = await browser.newContext({
            viewport: TestSettings.Viewport, acceptDownloads: true,
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
    ///Test Case 1580586: Verify OpenGrid macro action
    /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_testPlans/execute?planId=2478602&opId=3561&suiteId=2478606
    ///</summary>
    it("Test Case 1580586: Verify OpenGrid macro action", async () => {
        agentPage = await agentContext.newPage();
        const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        const agentChat = new AgentChat(agentPage);
        try {
            //Login as admin and create macro
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
            await macrosAdminPage.createMacro(Constants.OpenAccountGrid);

            //Initiate live chat with agent
            await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);

            //Login as agent and accept chat
            await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(agentStartPage, agentChat);
            await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);

            //Check API response through console
            const result = await agentPage.evaluate(async () => {
                const ctrl = await (window as any).Microsoft.ProductivityMacros.runMacro("OpenAccountGrid");
                return ctrl;
            });
            expect(result).toBe(Constants.ActionPerformedSuccessfully);

            //Check API result on UI
            const accountsLoadResult = await macrosAdminPage.verifyOpenedTab(agentPage, Constants.AccountsMyActiveAccountsTab);
            expect(accountsLoadResult).toBeTruthy();

            //End live chat
            await macrosAdminPage.closeConversation(agentPage, agentChat);
            await liveChatPage.closeChat();
        }
        finally 
        {
            await macrosAdminPage.deleteMacro(adminStartPage,Constants.OpenAccountGrid);
        }
    });

    ///<summary>
    ///Test Case 1580626: Verify DoRelevanceSearch macro action
    /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_testPlans/execute?planId=2509247&opId=3586&suiteId=2509251
    ///</summary>
    it("Test Case 1580626: Verify DoRelevanceSearch macro action", async () => {
        agentPage = await agentContext.newPage();
        const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        const agentChat = new AgentChat(agentPage);
        try {
            //Login as admin and create macro
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
            await macrosAdminPage.createMacro(Constants.DoRelevanceSearch);

            //Initiate live chat with agent
            await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);

            //Login as agent and accept chat
            await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(agentStartPage, agentChat);
            await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);

            //Check API response through console
            const result = await agentPage.evaluate(async () => {
                const ctrl = await (window as any).Microsoft.ProductivityMacros.runMacro("DoRelevanceSearch");
                return ctrl;
            });
            expect(result).toBe(Constants.ActionPerformedSuccessfully);

            //Check API result on UI
            const relevenceSearchResult = await macrosAdminPage.verifyOpenedTab(agentPage, Constants.SearchTab);
            expect(relevenceSearchResult).toBeTruthy();

            //End live chat
            await macrosAdminPage.closeConversation(agentPage, agentChat);
            await liveChatPage.closeChat();
        }
        finally 
        {
            await macrosAdminPage.deleteMacro(adminStartPage,Constants.DoRelevanceSearch);
        }
    });

    ///<summary>
    ///Test Case 1580630: Verify ResolveCase macro action
    /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_testPlans/execute?planId=2509247&opId=3586&suiteId=2509251
    ///</summary>
    it("Test Case 1580630: Verify ResolveCase macro action", async () => {
        agentPage = await agentContext.newPage();
        const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        const agentChat = new AgentChat(agentPage);
        try {
            //Login as admin and create macro
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            const incidentId = await macrosAdminPage.createCaseAndGetIncidentId();
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
            await macrosAdminPage.createMacro(Constants.ResolveCase, incidentId);

            //Initiate live chat with agent
            await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);

            //Login as agent and accept chat
            await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(agentStartPage, agentChat);
            await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);

            //Check API response through console
            const result = await agentPage.evaluate(async () => {
                const ctrl = await (window as any).Microsoft.ProductivityMacros.runMacro("ResolveCase");
                return ctrl;
            });
            expect(result).toBe(Constants.ActionPerformedSuccessfully);

            //Check API result on UI
            const resolveCaseResult = await macrosAdminPage.verifyResolveCase(adminPage, adminStartPage);
            expect(resolveCaseResult).toBeTruthy();

            //End live chat
            await macrosAdminPage.closeConversation(agentPage, agentChat);
            await liveChatPage.closeChat();
        }
        finally 
        {
            await macrosAdminPage.deleteCase(adminPage, adminStartPage, Constants.AutomationCaseTitle)
            await macrosAdminPage.deleteMacro(adminStartPage, Constants.ResolveCase);
        }
    });

    ///<summary>
    ///Test Case 1580680: verify update an existing record macro action
    /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_testPlans/execute?planId=2509247&opId=3586&suiteId=2509251
    ///</summary>
    it("Test Case 1580680: verify update an existing record macro action", async () => {
        agentPage = await agentContext.newPage();
        const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        const agentChat = new AgentChat(agentPage);
        try {
            //Login as admin and create macro
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            const incidentId = await macrosAdminPage.createCaseAndGetIncidentId();
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
            await macrosAdminPage.createMacro(Constants.UpdateAccount, incidentId);

            //Initiate live chat with agent
            await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);

            //Login as agent and accept chat
            await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(agentStartPage, agentChat);
            await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);

            //Check API response through console
            const result = await agentPage.evaluate(async () => {
                const ctrl = await (window as any).Microsoft.ProductivityMacros.runMacro("UpdateAccount");
                return ctrl;
            });
            expect(result).toBe(Constants.ActionPerformedSuccessfully);

            //Check API result on UI
            const updateAccountResult = await macrosAdminPage.verifyUpdateAccount(adminPage, adminStartPage, Constants.AutomationCaseTitle);
            expect(updateAccountResult).toBeTruthy();

            //End live chat
            await macrosAdminPage.closeConversation(agentPage, agentChat);
            await liveChatPage.closeChat();
        }
        finally {
            await macrosAdminPage.deleteCase(adminPage, adminStartPage, Constants.AutomationCaseTitle)
            await macrosAdminPage.deleteMacro(adminStartPage, Constants.UpdateAccount);
        }
    });

    ///<summary>
    ///Test Case 1588015: Create and runmacro openkbsearch end to end testing scenario
    /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_testPlans/execute?planId=2509247&opId=3586&suiteId=2509251
    ///</summary>
    it("Test Case 1588015: Create and runmacro openkbsearch end to end testing scenario", async () => {
        agentPage = await agentContext.newPage();
        const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        const agentChat = new AgentChat(agentPage);
        try {
            //Login as admin and create macro
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
            await macrosAdminPage.createMacro(Constants.OpenKBSearch);

            //Initiate live chat with agent
            await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);

            //Login as agent and accept chat
            await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(agentStartPage, agentChat);
            await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);

            //Check API response through console
            const result = await agentPage.evaluate(async () => {
                const ctrl = await (window as any).Microsoft.ProductivityMacros.runMacro("OpenKBSearch");
                return ctrl;
            });
            expect(result).toBe(Constants.ActionPerformedSuccessfully);

            //Check API result on UI
            const knowledgeSearchResult = await macrosAdminPage.verifyOpenedTab(agentPage, Constants.KnowledgeSearchTab);
            expect(knowledgeSearchResult).toBeTruthy();

            //End live chat
            await macrosAdminPage.closeConversation(agentPage, agentChat);
            await liveChatPage.closeChat();
        }
        finally 
        {
            await macrosAdminPage.deleteMacro(adminStartPage, Constants.OpenKBSearch);
        }
    });

    ///<summary>
    ///TC 1586360 - Create and runmacro opennewform end to end testing scenario
    /// create and run macro end to end testing scenario
    ///</summary>
    it("Test Case 1586360: Create and runmacro opennewform end to end testing scenario", async () => {
        agentPage = await agentContext.newPage();
        const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        const agentChat = new AgentChat(agentPage);
        try {
            //Login as admin and create macro
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
            await macrosAdminPage.createMacro(Constants.OpenNewAccount);

            //Initiate live chat with agent
            await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);

            //Login as agent and accept chat
            await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(agentStartPage, agentChat);
            await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);

            //Check API response through console
            const result = await agentPage.evaluate(async () => {
                const ctrl = await (window as any).Microsoft.ProductivityMacros.runMacro("OpenNewAccount");
                return ctrl;
            });
            expect(result).toBe(Constants.ActionPerformedSuccessfully);

            //Check API result on UI
            const accountsLoadResult = await macrosAdminPage.verifyOpenedTab(agentPage, Constants.NewAccountTab);
            expect(accountsLoadResult).toBeTruthy();

            //End live chat
            await macrosAdminPage.closeConversation(agentPage, agentChat);
            await liveChatPage.closeChat();
        }
        finally 
        {
            await macrosAdminPage.deleteMacro(adminStartPage, Constants.OpenNewAccount);
        }
    });

    /// <summary>
    /// TC 1576284:- Verify OpenExistingForm macro action
    /// </summary>
    it("Test Case 1576284: Verify OpenExistingForm macro action", async () => {
        agentPage = await agentContext.newPage();
        const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        const agentChat = new AgentChat(agentPage);
        try {
            //Login as admin and create macro
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            const incidentId = await macrosAdminPage.createCaseAndGetIncidentId();
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
            await macrosAdminPage.createMacro(Constants.OpenExistingRecord, incidentId);

            //Initiate live chat with agent
            await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);

            //Login as agent and accept chat
            await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(agentStartPage, agentChat);
            await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);

            //Check API response through console
            const result = await agentPage.evaluate(async () => {
                const ctrl = await (window as any).Microsoft.ProductivityMacros.runMacro("OpenExistingRecord");
                return ctrl;
            });
            expect(result).toBe(Constants.ActionPerformedSuccessfully);

            //Check API result on UI
            const caseLoadResult = await macrosAdminPage.verifyOpenedTab(agentPage, Constants.OpenedExistingRecord);
            expect(caseLoadResult).toBeTruthy();

            //End live chat
            await macrosAdminPage.closeConversation(agentPage, agentChat);
            await liveChatPage.closeChat();
        }
        finally 
        {
            await macrosAdminPage.deleteCase(adminPage, adminStartPage, Constants.AutomationCaseTitle);
            await macrosAdminPage.deleteMacro(adminStartPage, Constants.OpenExistingRecord);
        }
    });

    ///<summary>
    ///Test Case 2253513: [Macros] Verify dashboard application template is opened in new tab using 'Open application tab' action in macros
    /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_testPlans/execute?planId=2532163&opId=3593&suiteId=2532167
    ///</summary>
    it("Test Case 2253513: [Macros] Verify dashboard application template is opened in new tab using 'Open application tab' action in macros", async () => {
        agentPage = await agentContext.newPage();
        const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        const agentChat = new AgentChat(agentPage);
        try {
            //Login as admin and create macro
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
            const applicationTabId = await macrosAdminPage.createApplicationTabAndGetId(Constants.DashboardApplicationTab, Constants.DashboardApplicationTabUniqueName, Constants.DashboardOptionValue);
            await macrosAdminPage.createMacro(Constants.OpenDashboard, applicationTabId, Constants.Dashboardid);

            //Initiate live chat with agent
            await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);

            //Login as agent and accept chat
            await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(agentStartPage, agentChat);
            await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);

            //Check API response through console
            const result = await agentPage.evaluate(async () => {
                const ctrl = await (window as any).Microsoft.ProductivityMacros.runMacro("OpenDashboard");
                return ctrl;
            });
            expect(result).toBe(Constants.ActionPerformedSuccessfully);

            //Check API result on UI
            const openDashboardResult = await macrosAdminPage.verifyOpenedTab(agentPage, Constants.DashboardTab);
            expect(openDashboardResult).toBeTruthy();

            //End live chat
            await macrosAdminPage.closeConversation(agentPage, agentChat);
            await liveChatPage.closeChat();
        }
        finally 
        {
            await macrosAdminPage.deleteMacro(adminStartPage, Constants.OpenDashboard);
            await macrosAdminPage.deleteApplicationTab(adminStartPage, Constants.DashboardApplicationTab);
        }
    });

    ///<summary>
    ///Test Case 1805118: [Macros] Verify entity view application template is opened in new tab using 'Open application tab' action in macros
    /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_testPlans/execute?planId=2532163&opId=3593&suiteId=2532167
    ///</summary>
    it("Test Case 1805118: [Macros] Verify entity view application template is opened in new tab using 'Open application tab' action in macros", async () => {
        agentPage = await agentContext.newPage();
        const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        const agentChat = new AgentChat(agentPage);
        try {
            //Login as admin and create macro
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
            const applicationTabId = await macrosAdminPage.createApplicationTabAndGetId(Constants.EntityListApplicationTab, Constants.EntityListApplicationTabUniqueName, Constants.EntityListOptionValue);
            await macrosAdminPage.createMacro(Constants.OpenEntityList, applicationTabId);

            //Initiate live chat with agent
            await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);

            //Login as agent and accept chat
            await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(agentStartPage, agentChat);
            await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);

            //Check API response through console
            const result = await agentPage.evaluate(async () => {
                const ctrl = await (window as any).Microsoft.ProductivityMacros.runMacro("OpenEntityList");
                return ctrl;
            });
            expect(result).toBe(Constants.ActionPerformedSuccessfully);

            //Check API result on UI
            const openEntityListResult = await macrosAdminPage.verifyOpenedTab(agentPage, Constants.EntityListTab);
            expect(openEntityListResult).toBeTruthy();

            //End live chat
            await macrosAdminPage.closeConversation(agentPage, agentChat);
            await liveChatPage.closeChat();
        }
        finally 
        {
            await macrosAdminPage.deleteMacro(adminStartPage, Constants.OpenEntityList);
            await macrosAdminPage.deleteApplicationTab(adminStartPage, Constants.EntityListApplicationTab);
        }
    });

    ///<summary>
    ///Test Case 2253528: [Macros] Verify web resources application template is opened in new tab using 'Open application tab' action in macros
    /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_testPlans/execute?planId=2532163&opId=3593&suiteId=2532167
    ///</summary>
    it("Test Case 2253528: [Macros] Verify web resources application template is opened in new tab using 'Open application tab' action in macros", async () => {
        agentPage = await agentContext.newPage();
        const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        const agentChat = new AgentChat(agentPage);
        try {
            //Login as admin and create macro
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
            const applicationTabId = await macrosAdminPage.createApplicationTabAndGetId(Constants.WebResourceApplicationTab, Constants.WebResourceApplicationTabUniqueName, Constants.WebResourceOptionValue);
            await macrosAdminPage.createMacro(Constants.OpenWebResource, applicationTabId);

            //Initiate live chat with agent
            await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);

            //Login as agent and accept chat
            await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(agentStartPage, agentChat);
            await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);

            //Check API response through console
            const result = await agentPage.evaluate(async () => {
                const ctrl = await (window as any).Microsoft.ProductivityMacros.runMacro("OpenWebResource");
                return ctrl;
            });
            expect(result).toBe(Constants.ActionPerformedSuccessfully);

            //Check API result on UI
            const openWebResourceResult = await macrosAdminPage.verifyOpenedTab(agentPage, Constants.WebResourceTab);
            expect(openWebResourceResult).toBeTruthy();

            //End live chat
            await macrosAdminPage.closeConversation(agentPage, agentChat);
            await liveChatPage.closeChat();
        }
        finally 
        {
            await macrosAdminPage.deleteMacro(adminStartPage, Constants.OpenWebResource);
            await macrosAdminPage.deleteApplicationTab(adminStartPage, Constants.WebResourceApplicationTab);
        }
    });

    ///<summary>
    ///Test Case 2253509: [Macros] Verify custom control application template is opened in new tab using 'Open application tab' action in macros
    /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_testPlans/execute?planId=2532163&opId=3593&suiteId=2532167
    ///</summary>
    it("Test Case 2253509: [Macros] Verify custom control application template is opened in new tab using 'Open application tab' action in macros", async () => {
        agentPage = await agentContext.newPage();
        const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        const agentChat = new AgentChat(agentPage);
        try {
            //Login as admin and create macro
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
            const applicationTabId = await macrosAdminPage.createApplicationTabAndGetId(Constants.ControlApplicationTab, Constants.ControlApplicationTabUniqueName, Constants.ControlOptionValue);
            await macrosAdminPage.createMacro(Constants.OpenControl, applicationTabId);

            //Initiate live chat with agent
            await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);

            //Login as agent and accept chat
            await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(agentStartPage, agentChat);
            await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);

            //Check API response through console
            const result = await agentPage.evaluate(async () => {
                const ctrl = await (window as any).Microsoft.ProductivityMacros.runMacro("OpenControl");
                return ctrl;
            });
            expect(result).toBe(Constants.ActionPerformedSuccessfully);

            //Check API result on UI
            const openControlTabResult = await macrosAdminPage.verifyOpenedTab(agentPage, Constants.ControlTab);
            expect(openControlTabResult).toBeTruthy();

            //End live chat
            await macrosAdminPage.closeConversation(agentPage, agentChat);
            await liveChatPage.closeChat();
        }
        finally 
        {
            await macrosAdminPage.deleteMacro(adminStartPage, Constants.OpenControl);
            await macrosAdminPage.deleteApplicationTab(adminStartPage, Constants.ControlApplicationTab);
        }
    });

    ///<summary>
    ///Test Case 1717129: Verify Admin can disable/deactivate an existing macros
    /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_testPlans/execute?planId=2532163&opId=3593&suiteId=2532167
    ///</summary>
    it("Test Case 1717129: Verify Admin can disable/deactivate an existing macros", async () => {
        try {
            //Login as admin and create & deactivate macro
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
            await macrosAdminPage.createMacro(Constants.OpenKBSearch);
            await macrosAdminPage.deactivateMacro(adminStartPage, Constants.OpenKBSearch);

            //Check if macro deactivated
            const deactivateMacroResult = await macrosAdminPage.verifyMacroDeactivated(adminStartPage, Constants.OpenKBSearch);
            expect(deactivateMacroResult).toBeTruthy();

        }
        finally 
        {
            await macrosAdminPage.deleteMacro(adminStartPage, Constants.OpenKBSearch);
        }
    });

    ///<summary>
    /// Test Case 1760322: [Macros] Verify KB article is opening at agent side when using 'Open Knowledgebase article' in macro
    /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1760322
    ///</summary>
    it("Test Case 1760322: [Macros] Verify KB article is opening at agent side when using 'Open Knowledgebase article' in macro", async () => {
        agentPage = await agentContext.newPage();
        const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        const agentChat = new AgentChat(agentPage);
        try {
            //Login as admin and create macro
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            const kbArticleId = await macrosAdminPage.createKbArticleAndGetId();
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
            await macrosAdminPage.createMacro(Constants.OpenKbArticle, kbArticleId);

            //Initiate live chat with agent
            await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);

            //Login as agent and accept chat
            await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(agentStartPage, agentChat);
            await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);

            //Check API response through console
            const result = await agentPage.evaluate(async () => {
                const ctrl = await (window as any).Microsoft.ProductivityMacros.runMacro("OpenKbArticle");
                return ctrl;
            });
            expect(result).toBe(Constants.ActionPerformedSuccessfully);

            // //Check API result on UI
            const OpenedKbArticleVerification = await macrosAdminPage.verifyOpenedTab(agentPage, Constants.OpenedKnowledgeTab);
            expect(OpenedKbArticleVerification).toBeTruthy();

            //End live chat
            await macrosAdminPage.closeConversation(agentPage, agentChat);
            await liveChatPage.closeChat();
        }
        finally 
        {
            await macrosAdminPage.deleteKbArticle(adminPage, adminStartPage, Constants.KnowledgeArticleTitle)
            await macrosAdminPage.deleteMacro(adminStartPage, Constants.OpenKbArticle);
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
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.EnableKbUrlLink();
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
            await macrosAdminPage.createMacro(Constants.SendKbArticle);

            //Initiate live chat with agent
            await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);

            //Login as agent and accept chat
            await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(agentStartPage, agentChat);
            await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);

            //Check API response through console
           const result = await agentPage.evaluate(async () => {
                const ctrl = await (window as any).Microsoft.ProductivityMacros.runMacro("SendKbArticle");
        return ctrl;
            });
           expect(result).toBe(Constants.ActionPerformedSuccessfully);
           const SendKbArticleVerification = await macrosAdminPage.VerifyKbUrlLink(agentPage);
            expect(SendKbArticleVerification).toBeTruthy();

            //End live chat
            await macrosAdminPage.closeConversation(agentPage, agentChat);
            await liveChatPage.closeChat();
        }
        finally 
        {
            await macrosAdminPage.deleteMacro(adminStartPage, Constants.SendKbArticle);
        }
    });

    ///<summary>
    ///Test Case 2253523: [Macros] Verify entity search application template  is opened in new tab using 'Open application tab' action in macros
    /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_testPlans/execute?planId=2532163&opId=3593&suiteId=2532167
    ///</summary>
    it("Test Case 1805118: [Macros] Verify entity view application template is opened in new tab using 'Open application tab' action in macros", async () => {
        agentPage = await agentContext.newPage();
        const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        const agentChat = new AgentChat(agentPage);
        try {
            //Login as admin and create macro
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
            const applicationTabId = await macrosAdminPage.createApplicationTabAndGetId(Constants.EntitySearchApplicationTab, Constants.EntitySearchApplicationTabUniqueName, Constants.EntitySearchOptionValue);
            await macrosAdminPage.InsertParametersInSearchApplicationTab(adminStartPage, Constants.EntitySearchApplicationTab);
            await macrosAdminPage.createMacro(Constants.EntitySearch, applicationTabId);

            //Initiate live chat with agent
            await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);

            //Login as agent and accept chat
            await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(agentStartPage, agentChat);
            await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);

            //Check API response through console
            const result = await agentPage.evaluate(async () => {
                const ctrl = await (window as any).Microsoft.ProductivityMacros.runMacro("EntitySearch");
                return ctrl;
            });
            expect(result).toBe(Constants.ActionPerformedSuccessfully);

            //Check API result on UI
            const openEntityListResult = await macrosAdminPage.verifyOpenedTab(agentPage, Constants.EntitySearchTab);
            expect(openEntityListResult).toBeTruthy();

            //End live chat
            await macrosAdminPage.closeConversation(agentPage, agentChat);
            await liveChatPage.closeChat();
        }
        finally 
        {
            await macrosAdminPage.deleteMacro(adminStartPage, Constants.EntitySearch);
            await macrosAdminPage.deleteApplicationTab(adminStartPage, Constants.EntitySearchApplicationTab);
        }
    });

    ///<summary>
    ///Test Case 2366971: [Macros] Verify existing record is opened  using 'Open an existing record' action in the Productivity Automation.
    /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_testPlans/execute?planId=2532163&opId=3593&suiteId=2532167
    ///</summary>
    it("Test Case 2366971: [Macros] Verify existing record is opened using 'Open an existing record' action in the Productivity Automation.", async () => {
        agentPage = await agentContext.newPage();
        const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        const agentChat = new AgentChat(agentPage);
        try {
            //Login as admin and create macro
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            const accountId = await macrosAdminPage.createAccountAndGetId(Constants.AccountName);
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
            await macrosAdminPage.createMacro(Constants.ExistingRecord, accountId);

            //Initiate live chat with agent
            await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);

            //Login as agent and accept chat
            await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(agentStartPage, agentChat);
            await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);

            //Check API response through console
            const result = await agentPage.evaluate(async () => {
                const ctrl = await (window as any).Microsoft.ProductivityMacros.runMacro("Open an existing record");
                return ctrl;
            });
            expect(result).toBe(Constants.ActionPerformedSuccessfully);

            //Check API result on UI
            const openEntityListResult = await macrosAdminPage.verifyOpenedTab(agentPage, Constants.EntityRecordTab);
            expect(openEntityListResult).toBeTruthy();

            //End live chat
            await macrosAdminPage.closeConversation(agentPage, agentChat);
            await liveChatPage.closeChat();
        }
        finally {
            await macrosAdminPage.deleteMacro(adminStartPage, Constants.ExistingRecord);
            await macrosAdminPage.deleteAccount(adminPage, adminStartPage,Constants.AccountName);
        }
    });

    /// <summary>
	/// TC 1580682:- Verify DraftEmail macro action
	/// </summary>
    it("Test Case 1580682: Verify DraftEmail macro action", async () => {
        agentPage = await agentContext.newPage();
        const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        const agentChat = new AgentChat(agentPage);
        try {
            //Login as admin and create macro
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            const incidentId = await macrosAdminPage.createCaseAndGetIncidentId();
            const incidentEmailTemplateId = await macrosAdminPage.CreateEmailTemplateAndGetId();
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
            await macrosAdminPage.createMacro(Constants.CreateDraftEmail, incidentEmailTemplateId, incidentId);
            
            //Initiate live chat with agent
            await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);

            //Login as agent and accept chat
            await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(agentStartPage, agentChat);
            await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);

            //Check API response through console
            const result = await agentPage.evaluate(async () => {
                const ctrl = await (window as any).Microsoft.ProductivityMacros.runMacro("CreateDraftEmail");
                return ctrl;
            });
            expect(result).toBe(Constants.ActionPerformedSuccessfully);

            //Check API result on UI
            const openDraftEmailResult = await macrosAdminPage.verifyOpenedTab(agentPage,Constants.NewEmailTitle);
            expect(openDraftEmailResult).toBeTruthy();

            //End live chat
            await macrosAdminPage.closeConversation(agentPage, agentChat);
            await liveChatPage.closeChat();
        }
        finally {
            await macrosAdminPage.deleteMacro(adminStartPage,Constants.CreateDraftEmail);
            await macrosAdminPage.deleteCase(adminPage, adminStartPage, Constants.AutomationCaseTitle);
            await macrosAdminPage.deleteEmailTemplate(adminPage, adminStartPage, Constants.EmailTemplateName);
        }
    });

    /// <summary>
	/// Test Case 1760324: [Macros] Verify data is autofilled when using "Autofill form fields"
	/// Prerequisites:- 1. Admin user
	///                 2. ChatWorkStream
	///                 3. ChatSession and associate it with ChatWorkStream
	/// </summary>
    it("Test Case 1760324: [Macros] Verify data is autofilled when using Autofill form fields", async () => {
        agentPage = await agentContext.newPage();
        const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        const agentChat = new AgentChat(agentPage);
        const agentScriptAdminPage = new AgentScript(adminPage);
        try {
            //Login as admin and create macro
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
            await macrosAdminPage.createMacro(Constants.AutoFillFieldsWithData);

            //Initiate live chat with agent
            await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);

            //Login as agent and accept chat
            await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(agentStartPage, agentChat);
            await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);

            //Check API response through console
            const result = await agentPage.evaluate(async () => {
                const ctrl = await (window as any).Microsoft.ProductivityMacros.runMacro("AutoFillMacro", { timeout: 10000 });
                return ctrl;
            });
            expect(result).toBe(Constants.ActionPerformedSuccessfully);

            //Check API result on UI
            const accountsLoadResult = await macrosAdminPage.verifyOpenedTab(agentPage, Constants.AutofilledAccountName);
            expect(accountsLoadResult).toBeTruthy();

            //End live chat
            await macrosAdminPage.closeConversation(agentPage, agentChat);
            await liveChatPage.closeChat();
        }
        finally 
        {
           await macrosAdminPage.deleteMacro(adminStartPage, Constants.AutoFillFieldsWithData);
        }
    });

    ///<summary>
    ///Test Case 2253531: [Macros] Verify third party website application template is opened in new tab using 'Open application tab' action in macros
    /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2253531
    ///</summary>
    it("Test Case 2253531: [Macros] Verify third party website application template is opened in new tab using 'Open application tab' action in macros", async () => {
        agentPage = await agentContext.newPage();
        const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        const agentChat = new AgentChat(agentPage);
        try {
            //Login as admin and create macro
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
            const applicationTabId = await macrosAdminPage.createApplicationTabAndGetId(Constants.ThirdPartyWebsiteApplicationTab, Constants.ThirdPartyWebsiteApplicationTabUniqueName, Constants.ThirdPartyWebsiteOptionValue);
            await macrosAdminPage.createMacro(Constants.ThirdPartyWebsiteAppTabName, applicationTabId);

            //Initiate live chat with agent
            await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);

            //Login as agent and accept chat
            await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(agentStartPage, agentChat);
            await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);

            //Check API response through console
            const result = await agentPage.evaluate(async () => {
            const ctrl = await (window as any).Microsoft.ProductivityMacros.runMacro("ThirdPartyWebsiteAppTabName");
            return ctrl;
            });
            expect(result).toBe(Constants.ActionPerformedSuccessfully);

            //Check API result on UI
            const thirdPartyWebsiteResultResult = await macrosAdminPage.verifyOpenedTab(agentPage, Constants.ThirdPartyWebsiteTab);
            expect(thirdPartyWebsiteResultResult).toBeTruthy();

            //End live chat
            await macrosAdminPage.closeConversation(agentPage, agentChat);
            await liveChatPage.closeChat();
        }
        finally 
        {
            await macrosAdminPage.deleteMacro(adminStartPage, Constants.ThirdPartyWebsiteAppTabName);
            await macrosAdminPage.deleteApplicationTab(adminStartPage, Constants.ThirdPartyWebsiteApplicationTab);
        }
    });

    ///<summary>
    ///Test Case 2366983: [Macros] Verify can search the knowledge base for the populated phrase by using 'Search the knowledge base for the populated phrase' action in the Productivity Automation.
    /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2366983
    ///</summary>
    it("Test Case 2366983: [Macros] Verify can search the knowledge base for the populated phrase by using 'Search the knowledge base for the populated phrase' action in the Productivity Automation.", async () => {
        agentPage = await agentContext.newPage();
        const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        const agentChat = new AgentChat(agentPage);
        try {
            //Login as admin and create macro
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.createMacro(Constants.SearchPhraseForPopulatedPhrase);

            //Initiate live chat with agent
            await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);

            //Login as agent and accept chat
            await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(agentStartPage, agentChat);
            await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);

            //Check API response through console
            const result = await agentPage.evaluate(async () => {
            const ctrl = await (window as any).Microsoft.ProductivityMacros.runMacro("SearchPhraseForPopulatedPhrase");
            return ctrl;
            });
            expect(result).toBe(Constants.ActionPerformedSuccessfully);

            //Check API result on UI
            const searchPhrasePopulatedResult = await macrosAdminPage.verifyOpenedTab(agentPage, Constants.SearchPhraseTabName);
            expect(searchPhrasePopulatedResult).toBeTruthy();

            //End live chat
            await macrosAdminPage.closeConversation(agentPage, agentChat);
            await liveChatPage.closeChat();
        }
        finally {
            await macrosAdminPage.deleteMacro(adminStartPage, Constants.SearchPhraseForPopulatedPhrase);
        }
    });

    ///<summary>
    ///Test Case 2313868: [Macros] Verify tab is refreshed using 'Refresh the tab' action in the macros.
    /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2313868
    ///</summary>
    it("Test Case 2313868: [Macros] Verify tab is refreshed using 'Refresh the tab' action in the macros.", async () => {
        agentPage = await agentContext.newPage();
        const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        const agentChat = new AgentChat(agentPage);
        try {
            //Login as admin and create macro
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
            await macrosAdminPage.createMacro(Constants.OpenRefreshTab );

            //Initiate live chat with agent
            await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);

            //Login as agent and accept chat
            await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(agentStartPage, agentChat);
            await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);

            //Check API response through console
            const result = await agentPage.evaluate(async () => {
                const ctrl = await (window as any).Microsoft.ProductivityMacros.runMacro("RefreshTabMacro");
                return ctrl;
            });
            expect(result).toBe(Constants.ActionPerformedSuccessfully);

            //End live chat
            await macrosAdminPage.closeConversation(agentPage, agentChat);
            await liveChatPage.closeChat();
        }
        finally {
            await macrosAdminPage.deleteMacro(adminStartPage, Constants.OpenRefreshTab);
        }
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
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            const accountId1 = await macrosAdminPage.createAccountAndGetAccountId(Constants.AccountName1);
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
            await macrosAdminPage.createMacro(Constants.LinkRecordMacro, accountId1);

            //Initiate live chat with agent
            await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);

            //Login as agent and accept chat
            await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(agentStartPage, agentChat);
            await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);
 
            //Check API response through console
            const result = await agentPage.evaluate(async () => {
                const ctrl = await (window as any).Microsoft.ProductivityMacros.runMacro("LinkRecordMacro");
                return ctrl;
            });
            expect(result).toBe(Constants.ActionPerformedSuccessfully);

            //Check API result on UI
            const LinkRecordVerification = await macrosAdminPage.VerifyLinkedMacro(agentPage);
            expect(LinkRecordVerification).toBeTruthy();

            //End live chat
            await macrosAdminPage.closeConversation(agentPage, agentChat);
            await liveChatPage.closeChat();
        }
        finally {
            await macrosAdminPage.deleteAccountLinkUnlink(adminPage, adminStartPage, Constants.AccountName1) 
            await macrosAdminPage.deleteMacro(adminStartPage, Constants.LinkRecordMacro);
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
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            const accountId1 = await macrosAdminPage.createAccountAndGetAccountId(Constants.AccountName1);
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
            await macrosAdminPage.createMacro(Constants.LinkRecordMacro, accountId1);
            await macrosAdminPage.createMacro(Constants.UnlinkRecordMacro, accountId1);

            //Initiate live chat with agent
            await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);

            //Login as agent and accept chat
            await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(agentStartPage, agentChat);
            await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);
 
            //Check API response through console
            const result1 = await agentPage.evaluate(async () => {
                const ctrl = await (window as any).Microsoft.ProductivityMacros.runMacro("LinkRecordMacro");
                return ctrl;
            });
            expect(result1).toBe(Constants.ActionPerformedSuccessfully);

            const result = await agentPage.evaluate(async () => {
                const ctrl = await (window as any).Microsoft.ProductivityMacros.runMacro("UnlinkRecordMacro");
                return ctrl;
            });
            expect(result).toBe(Constants.ActionPerformedSuccessfully);

            //Check API result on UI
            const UnlinkRecordVerification = await macrosAdminPage.VerifyUnlinkedMacro(agentPage);
            expect(UnlinkRecordVerification).toBeTruthy();

            //End live chat
            await macrosAdminPage.closeConversation(agentPage, agentChat);
            await liveChatPage.closeChat();
        }
        finally {
            await macrosAdminPage.deleteAccountLinkUnlink(adminPage, adminStartPage, Constants.AccountName1);
            await macrosAdminPage.deleteMacro(adminStartPage, Constants.LinkRecordMacro);
            await macrosAdminPage.deleteMacro(adminStartPage, Constants.UnlinkRecordMacro);
        }
    });

    /// <summary>
	/// Test Case 2484337: Verify modify/override the appsettings from app level.
	/// </summary>
    it("Test Case 2484337: Verify modify/override the appsettings from app level.", async () => {
        agentPage = await agentContext.newPage();
        const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        const agentChat = new AgentChat(agentPage);
        try {
            await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);
            await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(agentStartPage, agentChat);
            await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);

            //Check API response through console
            const resultSuppressSessionCloseWarning = await agentPage.evaluate(async () => {
                await (window as any).Xrm.Utility.getGlobalContext().saveSettingValue('msdyn_SuppressSessionCloseWarning',true);
                const ctrl = await (window as any).Xrm.Utility.getGlobalContext().getCurrentAppSettings()['msdyn_SuppressSessionCloseWarning'];
                return ctrl;   
            });
            expect(resultSuppressSessionCloseWarning).toBeTruthy();
            const resultMultisessionNavigationImprovements = await agentPage.evaluate(async () => {
                await (window as any).Xrm.Utility.getGlobalContext().saveSettingValue('msdyn_MultisessionNavigationImprovements',true);
                const ctrl = await (window as any).Xrm.Utility.getGlobalContext().getCurrentAppSettings()['msdyn_MultisessionNavigationImprovements'];
                return ctrl;   
            });
            expect(resultMultisessionNavigationImprovements).toBeTruthy();
            const resultOpenDeeplinkInNewSession = await agentPage.evaluate(async () => {
                await (window as any).Xrm.Utility.getGlobalContext().saveSettingValue('msdyn_OpenDeeplinkInNewSession',true);
                const ctrl = await (window as any).Xrm.Utility.getGlobalContext().getCurrentAppSettings()['msdyn_OpenDeeplinkInNewSession'];
                return ctrl;   
            });
            expect(resultOpenDeeplinkInNewSession).toBeTruthy();
        }
        finally {
            await macrosAdminPage.closeConversation(agentPage, agentChat);
            await liveChatPage.closeChat();
        }
    });

    /// <summary>
	/// Test Case 2367026: [Macros] Verify record is saved by using 'Save the record' action in the Productivity Automation.
    /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2367026
	/// </summary>
    it("Test Case 2367026: [Macros] Verify record is saved by using 'Save the record' action in the Productivity Automation.", async () => {
        agentPage = await agentContext.newPage();
        const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        const agentChat = new AgentChat(agentPage);
        try {
            //Login as admin and create macro
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.OmnichannelAdminCenterApp);
            await macrosAdminPage.createMacroFromOmnichannelAdminCenterApp(Constants.SaveRecord);

            //Initiate live chat with agent
            await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);

            //Login as agent and accept chat
            await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(agentStartPage, agentChat);
            await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);

            //Check API response through console
            const result = await agentPage.evaluate(async () => {
                const ctrl = await (window as any).Microsoft.ProductivityMacros.runMacro("SaveRecord");
                return ctrl;
            });
            expect(result).toBe(Constants.ActionPerformedSuccessfully);

            //Check API result on UI
            const accountsLoadResult = await macrosAdminPage.verifyOpenedTab(agentPage, Constants.AutofilledAccountName);
            expect(accountsLoadResult).toBeTruthy();

            //End live chat
            await macrosAdminPage.closeConversation(agentPage, agentChat);
            await liveChatPage.closeChat();
        }
        finally {
            await macrosAdminPage.deleteMacroFromOmnichannelAdminCenterApp(adminStartPage, Constants.SaveRecord);
            await macrosAdminPage.deleteAccountLinkUnlink(adminPage, adminStartPage, Constants.AutofilledAccountName);
        }
    });

    ///<summary>
    ///Test Case 2464821: Open Dashboard Application tab using Macro.
    /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_testPlans/execute?planId=2606066&opId=3617&suiteId=2606071
    ///</summary>
    it("Test Case 2464821: Open Dashboard Application tab using Macros.", async () =>{
        agentPage = await agentContext.newPage();
        const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        const agentChat = new AgentChat(agentPage);
        try{
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.OmnichannelAdminCenterApp);
            const urlId=await macrosAdminPage.createApplicationTabAndGetId(Constants.DashboardName,Constants.DashboardUniqueName,Constants.DashboardOptionValue);
            await macrosAdminPage.createMacroFromOmnichannelAdminCenterApp(Constants.DashboardMacro,urlId);
            await macrosAdminPage.createAgentScript(Constants.AgentScriptName,Constants.TitleUniqueName,Constants.DashboardMacro);
            await macrosAdminPage.addAgentScripttoDefaultChatSession();
            
            //Login as agent and accept chat
            await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(agentStartPage, agentChat);
            await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);
            await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);

            // //Validating The Title of Application Tab by running the Macro
            const openEntityRecordTabUsingMacro=await macrosAdminPage.runMacroAndValidate(agentPage,Constants.DashboardTitle);
            expect(openEntityRecordTabUsingMacro).toBeTruthy();

            //Closing Chat
            await macrosAdminPage.closeConversation(agentPage, agentChat);
            await liveChatPage.closeChat();

            //Updating The Title of Existing and Inserting DashboardId in Dashboard Application Tab
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            const getDashboardId=await macrosAdminPage.GetDashboardId();
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToMyApp(Constants.OmnichannelAdminCenterApp);
            await macrosAdminPage.updateTitleOfApplicationTab(Constants.ChangeDashboardTitle,Constants.DashboardSearch,Constants.DashboardName);
            await macrosAdminPage.insertDashboardParameters(getDashboardId);

            //Login as agent and accept chat
            await macrosAdminPage.openOmnichannelForCS(agentStartPage,agentPage, agentChat);
            await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);
            await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);
            
            //Validating The Changed Title of Application Tab by running the Macro
            const openDashboardTabUsingMacroRechecking=await macrosAdminPage.runMacroAndValidate(agentPage,Constants.ChangeDashboardTitleTab);
            expect(openDashboardTabUsingMacroRechecking).toBeTruthy();

            //Closing Chat
            await macrosAdminPage.closeConversation(agentPage, agentChat);
            await liveChatPage.closeChat();
            
            //Inserting Macro Parameter
            await macrosAdminPage.insertMacroParameter(Constants.DashboardMacroSearch,Constants.DashboardMacro,Constants.AttributeNameDashboard,getDashboardId);

            //Login as agent and accept chat
            await macrosAdminPage.openOmnichannelForCS(agentStartPage,agentPage, agentChat);
            await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);
            await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);

            //Validating The Changed Title of Application Tab by running the Macro
            const openEntityRecordTabUsingMacroRechecking=await macrosAdminPage.runMacroAndValidate(agentPage,Constants.ChangeDashboardTitleTab);
            expect(openEntityRecordTabUsingMacroRechecking).toBeTruthy();

            // //Closing Chat
            await macrosAdminPage.closeConversation(agentPage, agentChat);
            await liveChatPage.closeChat();
        }
        finally
        {
            await macrosAdminPage.deleteAgentScript(Constants.AgentScriptName);
            await macrosAdminPage.deleteApplicationTabusingOmnichannelAdminCenter(Constants.DashboardName);
            await macrosAdminPage.deleteMacroFromOmnichannelAdminCenterApp(adminStartPage,Constants.DashboardMacro);
        }
    })

    ///<summary>
    ///Test Case 2464820: Open Control Application tab using Macro.
    ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_testPlans/execute?planId=2606066&opId=3617&suiteId=2606071
    ///</summary>
    it("Test Case 2464820: Open Control Application tab using Macros.", async () =>{
        agentPage = await agentContext.newPage();
        const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        const agentChat = new AgentChat(agentPage);
        const agentScriptAdminPage = new AgentScript(adminPage);
        try{
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.OmnichannelAdminCenterApp);
            const urlId=await macrosAdminPage.createApplicationTabAndGetId(Constants.ControlApplicationTab,Constants.ControlApplicationTabUniqueName,Constants.ControlOptionValue);
            await macrosAdminPage.createMacroFromOmnichannelAdminCenterApp(Constants.ControlMacro,urlId);
            await macrosAdminPage.createAgentScript(Constants.AgentScriptName,Constants.TitleUniqueName,Constants.ControlMacro);
            await macrosAdminPage.addAgentScripttoDefaultChatSession();
            
            // //Login as agent and accept chat
            await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(agentStartPage, agentChat);
            await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);
            await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);

            // //Validating The Title of Application Tab by running the Macro
            const openEntityRecordTabUsingMacro=await macrosAdminPage.runMacroAndValidate(agentPage,Constants.ControlTab);
            expect(openEntityRecordTabUsingMacro).toBeTruthy();

            // // //Closing Chat
            await macrosAdminPage.closeConversation(agentPage, agentChat);
            await liveChatPage.closeChat();

            //Updating The Title of Existing and Inserting Control Parameters in Control Application Tab
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToMyApp(Constants.OmnichannelAdminCenterApp);
            await macrosAdminPage.updateTitleOfApplicationTab(Constants.ChangedControlTitle,Constants.SearchControlApplicationTab,Constants.ControlApplicationTab);
            await macrosAdminPage.insertControlParameters();

            //Login as agent and accept chat
            await macrosAdminPage.openOmnichannelForCS(agentStartPage,agentPage, agentChat);
            await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);
            await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);
            
            //Validating The Changed Title of Application Tab by running the Macro
            const openDashboardTabUsingMacroRechecking=await macrosAdminPage.runMacroAndValidate(agentPage,Constants.ControltabTitle);
            expect(openDashboardTabUsingMacroRechecking).toBeTruthy();

            //Closing Chat
            await macrosAdminPage.closeConversation(agentPage, agentChat);
            await liveChatPage.closeChat();
            
            //Inserting Macro Parameter
            await macrosAdminPage.insertMacroParameter(Constants.SearchControlMacro,Constants.ControlMacro,Constants.AttributeNameControl,Constants.AttributeValueControl);

            //Login as agent and accept chat
            await macrosAdminPage.openOmnichannelForCS(agentStartPage,agentPage, agentChat);
            await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);
            await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);

            //Validating The Changed Title of Application Tab by running the Macro
            const openEntityRecordTabUsingMacroRechecking=await macrosAdminPage.runMacroAndValidate(agentPage,Constants.ControltabTitle);
            expect(openEntityRecordTabUsingMacroRechecking).toBeTruthy();

            //Closing Chat
            await macrosAdminPage.closeConversation(agentPage, agentChat);
            await liveChatPage.closeChat();
        }
        finally
        {
            await macrosAdminPage.deleteAgentScript(Constants.AgentScriptName);
            await macrosAdminPage.deleteApplicationTabusingOmnichannelAdminCenter(Constants.ControlApplicationTab);
            await macrosAdminPage.deleteMacroFromOmnichannelAdminCenterApp(adminStartPage,Constants.ControlMacro);
        }
    });

    ///<summary>
    ///Test Case 2464805: Open Entity List Application tab using Macro.
    ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_testPlans/execute?planId=2606066&opId=3617&suiteId=2606071
    ///</summary>
    it("Test Case 2464805: Open Entity List Application tab using Macros.", async () =>{
        agentPage = await agentContext.newPage();
        const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        const agentChat = new AgentChat(agentPage);
        const agentScriptAdminPage = new AgentScript(adminPage);
        try{
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.OmnichannelAdminCenterApp);
            const urlId=await macrosAdminPage.createApplicationTabAndGetId(Constants.EntityListApplicationTab,Constants.EntityListApplicationTabUniqueName,Constants.EntityListOptionValue );
            await macrosAdminPage.createMacroFromOmnichannelAdminCenterApp(Constants.EntityListMacro,urlId);
            await macrosAdminPage.createAgentScript(Constants.AgentScriptName,Constants.TitleUniqueName,Constants.EntityListMacro);
            await macrosAdminPage.addAgentScripttoDefaultChatSession();
            
            //Login as agent and accept chat
            await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(agentStartPage, agentChat);
            await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);
            await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);

            //Validating The Title of Application Tab by running the Macro
            const openEntityRecordTabUsingMacro=await macrosAdminPage.runMacroAndValidate(agentPage,Constants.EntityListTab );
            expect(openEntityRecordTabUsingMacro).toBeTruthy();

            //Closing Chat
            await macrosAdminPage.closeConversation(agentPage, agentChat);
            await liveChatPage.closeChat();

            //Updating The Title of Existing and Inserting EntityName in Entity List Application Tab
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToMyApp(Constants.OmnichannelAdminCenterApp);
            await macrosAdminPage.updateTitleOfApplicationTab(Constants.ChangeEntityListTitleTab,Constants.EntityListSearch,Constants.EntityListApplicationTab);
            await macrosAdminPage.insertEntityListParameters();

            //Login as agent and accept chat
            await macrosAdminPage.openOmnichannelForCS(agentStartPage,agentPage, agentChat);
            await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);
            await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);
            
            //Validating The Changed Title of Application Tab by running the Macro
            const openEntityListTabUsingMacroRechecking=await macrosAdminPage.runMacroAndValidate(agentPage,Constants.ChangeEntityListTab);
            expect(openEntityListTabUsingMacroRechecking).toBeTruthy();

            //Closing Chat
            await macrosAdminPage.closeConversation(agentPage, agentChat);
            await liveChatPage.closeChat();
            
            //Inserting Macro Parameter
            await macrosAdminPage.insertMacroParameter(Constants.EntitySearchMacro,Constants.EntityListMacro,Constants.AttributeNameEntityList,Constants.AttributeValueEntityList);

            //Login as agent and accept chat
            await macrosAdminPage.openOmnichannelForCS(agentStartPage,agentPage, agentChat);
            await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);
            await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);

            //Validating The Changed Title of Application Tab by running the Macro
            const openEntityRecordTabUsingMacroRechecking=await macrosAdminPage.runMacroAndValidate(agentPage,Constants.ChangeEntityListTab);
            expect(openEntityRecordTabUsingMacroRechecking).toBeTruthy();

            //Closing Chat
            await macrosAdminPage.closeConversation(agentPage, agentChat);
            await liveChatPage.closeChat();
        }
        finally
        {
            await macrosAdminPage.deleteAgentScript(Constants.AgentScriptName);
            await macrosAdminPage.deleteApplicationTabusingOmnichannelAdminCenter(Constants.EntityListApplicationTab);
            await macrosAdminPage.deleteMacroFromOmnichannelAdminCenterApp(adminStartPage,Constants.EntityListMacro);
        }
    });

    ///<summary>
    ///Test Case 2464824: Open Third Party Website Application tab using Macro.
    ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_testPlans/execute?planId=2606066&opId=3617&suiteId=2606071
    ///</summary>
    it("Test Case 2464824: Open Third Party Website Application tab using Macros.", async () =>{
        agentPage = await agentContext.newPage();
        const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        const agentChat = new AgentChat(agentPage);
        const agentScriptAdminPage = new AgentScript(adminPage);
        try{
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.OmnichannelAdminCenterApp);
            const urlId=await macrosAdminPage.createApplicationTabAndGetId(Constants.ThirdPartyWebsiteApplicationTab,Constants.ThirdPartyWebsiteApplicationTabUniqueName,Constants.ThirdPartyWebsiteOptionValue );
            await macrosAdminPage.createMacroFromOmnichannelAdminCenterApp(Constants.ThirdPartyWebsiteMacro,urlId);
            await macrosAdminPage.createAgentScript(Constants.AgentScriptName,Constants.TitleUniqueName,Constants.ThirdPartyWebsiteMacro);
            await macrosAdminPage.addAgentScripttoDefaultChatSession();
            
            //Login as agent and accept chat
            await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(agentStartPage, agentChat);
            await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);
            await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);

            //Validating The Title of Application Tab by running the Macro
            const ThirdPartyWebsiteUsingMacro=await macrosAdminPage.runMacroAndValidate(agentPage,Constants.ThirdPartyWebsiteTab );
            expect(ThirdPartyWebsiteUsingMacro).toBeTruthy();

            //Closing Chat
            await macrosAdminPage.closeConversation(agentPage, agentChat);
            await liveChatPage.closeChat();

            //Updating The Title of Existing and Inserting data in Third Party Website Application Tab
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToMyApp(Constants.OmnichannelAdminCenterApp);
            await macrosAdminPage.updateTitleOfApplicationTab(Constants.ChangeThirdParyWebsiteTitleTab,Constants.ThirdPartyWebsiteSearch,Constants.ThirdPartyWebsiteApplicationTab);
            await macrosAdminPage.insertThirdPartyParameters();

            //Login as agent and accept chat
            await macrosAdminPage.openOmnichannelForCS(agentStartPage,agentPage, agentChat);
            await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);
            await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);
            
            //Validating The Changed Title of Application Tab by running the Macro
            const ThirdPartyWebsiteUsingMacroRechecking=await macrosAdminPage.runMacroAndValidate(agentPage,Constants.ChangeThirdPartyWebsiteListTab);
            expect(ThirdPartyWebsiteUsingMacroRechecking).toBeTruthy();

            //Closing Chat
            await macrosAdminPage.closeConversation(agentPage, agentChat);
            await liveChatPage.closeChat();
            
            //Inserting Macro Parameter
            await macrosAdminPage.insertMacroParameter(Constants.ThirdPartyWebsiteSearchMacro,Constants.ThirdPartyWebsiteMacro,Constants.AttributeNameThirdPartyWebsite,Constants.AttributeValueThirdPartyWebsite,Constants.AttributeName2ThirdPartyWebsite,Constants.AttributeValue2ThirdPartyWebsite);

            //Login as agent and accept chat
            await macrosAdminPage.openOmnichannelForCS(agentStartPage,agentPage, agentChat);
            await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);
            await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);

            //Validating The Changed Title of Application Tab by running the Macro
            const thirdPartyWebsiteabUsingMacroRechecking=await macrosAdminPage.runMacroAndValidate(agentPage,Constants.ChangeThirdPartyWebsiteListTab);
            expect(thirdPartyWebsiteabUsingMacroRechecking).toBeTruthy();

            //Closing Chat
            await macrosAdminPage.closeConversation(agentPage, agentChat);
            await liveChatPage.closeChat();
        }
        finally
        {
            await macrosAdminPage.deleteAgentScript(Constants.AgentScriptName);
            await macrosAdminPage.deleteApplicationTabusingOmnichannelAdminCenter(Constants.ThirdPartyWebsiteApplicationTab);
            await macrosAdminPage.deleteMacroFromOmnichannelAdminCenterApp(adminStartPage,Constants.ThirdPartyWebsiteMacro);
        }
    });

    ///<summary>
    ///Test Case 2464823: Open Search Application tab using Macro.
    ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_testPlans/execute?planId=2606066&opId=3617&suiteId=2606071
    ///</summary>
    it("Test Case 2464823: Open Search Application tab using Macros.", async () =>{
        agentPage = await agentContext.newPage();
        const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        const agentChat = new AgentChat(agentPage);
        const agentScriptAdminPage = new AgentScript(adminPage);
        try{
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.OmnichannelAdminCenterApp);
            const urlId=await macrosAdminPage.createApplicationTabAndGetId(Constants.EntitySearchApplicationTab,Constants.EntitySearchApplicationTabUniqueName,Constants.EntitySearchOptionValue );
            await macrosAdminPage.createMacroFromOmnichannelAdminCenterApp(Constants.EntitySearchMacroName,urlId);
            await macrosAdminPage.createAgentScript(Constants.AgentScriptName,Constants.TitleUniqueName,Constants.EntitySearchMacroName);
            await macrosAdminPage.addAgentScripttoDefaultChatSession();
            
            //Login as agent and accept chat
            await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(agentStartPage, agentChat);
            await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);
            await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);

            //Validating The Title of Application Tab by running the Macro
            const EntitySearchUsingMacro=await macrosAdminPage.runMacroAndValidate(agentPage,Constants.EntitySearchTab  );
            expect(EntitySearchUsingMacro).toBeTruthy();

            //Closing Chat
            await macrosAdminPage.closeConversation(agentPage, agentChat);
            await liveChatPage.closeChat();

            //Updating The Title of Existing and Inserting Search Text and Type in EntitySearch Application Tab
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToMyApp(Constants.OmnichannelAdminCenterApp);
            await macrosAdminPage.updateTitleOfApplicationTab(Constants.ChangeEntitySearchTitleTab,Constants.EntitySearchTabTitle,Constants.EntitySearchApplicationTab);
            await macrosAdminPage.insertEntitySearchParameters();

            //Login as agent and accept chat
            await macrosAdminPage.openOmnichannelForCS(agentStartPage,agentPage, agentChat);
            await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);
            await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);
            
            //Validating The Changed Title of Application Tab by running the Macro
            const EntitySearchUsingMacroRechecking=await macrosAdminPage.runMacroAndValidate(agentPage,Constants.ChangeEntitySearchListTab);
            expect(EntitySearchUsingMacroRechecking).toBeTruthy();

            //Closing Chat
            await macrosAdminPage.closeConversation(agentPage, agentChat);
            await liveChatPage.closeChat();
            
            //Inserting Macro Parameter
            await macrosAdminPage.insertMacroParameter(Constants.EntitySearchMacroSearch,Constants.EntitySearchMacroName,Constants.AttributeNameEntitySearch,Constants.AttributeValueEntitySearch,Constants.AttributeName2EntitySearch,Constants.AttributeValue2EntitySearch);

            //Login as agent and accept chat
            await macrosAdminPage.openOmnichannelForCS(agentStartPage,agentPage, agentChat);
            await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);
            await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);

            //Validating The Changed Title of Application Tab by running the Macro
            const entitySearchTabUsingMacroRechecking=await macrosAdminPage.runMacroAndValidate(agentPage,Constants.ChangeEntitySearchListTab);
            expect(entitySearchTabUsingMacroRechecking).toBeTruthy();

            //Closing Chat
            await macrosAdminPage.closeConversation(agentPage, agentChat);
            await liveChatPage.closeChat();
        }
        finally
        {
            await macrosAdminPage.deleteAgentScript(Constants.AgentScriptName);
            await macrosAdminPage.deleteApplicationTabusingOmnichannelAdminCenter(Constants.EntitySearchApplicationTab );
            await macrosAdminPage.deleteMacroFromOmnichannelAdminCenterApp(adminStartPage,Constants.EntitySearchMacroName);
        }
    });

    ///<summary>
    ///Test Case 2464818: Open Web Resource Application tab using Macro.
    ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_testPlans/execute?planId=2606066&opId=3617&suiteId=2606071
    ///</summary>
    it("Test Case 2464818: Open Web Resource Application tab using Macros.", async () =>{
        agentPage = await agentContext.newPage();
        const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        const agentChat = new AgentChat(agentPage);
        const agentScriptAdminPage = new AgentScript(adminPage);
        try{
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.OmnichannelAdminCenterApp);
            const urlId=await macrosAdminPage.createApplicationTabAndGetId(Constants.WebResourceApplicationTab,Constants.WebResourceApplicationTabUniqueName,Constants.WebResourceOptionValue);
            await macrosAdminPage.createMacroFromOmnichannelAdminCenterApp(Constants.WebResourceMacro,urlId);
            await macrosAdminPage.createAgentScript(Constants.AgentScriptName,Constants.TitleUniqueName,Constants.WebResourceMacro);
            await macrosAdminPage.addAgentScripttoDefaultChatSession();
            
            //Login as agent and accept chat
            await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(agentStartPage, agentChat);
            await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);
            await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);

            //Validating The Title of Application Tab by running the Macro
            const EntitySearchUsingMacro=await macrosAdminPage.runMacroAndValidate(agentPage,Constants.WebResourceTab );
            expect(EntitySearchUsingMacro).toBeTruthy();

            //Closing Chat
            await macrosAdminPage.closeConversation(agentPage, agentChat);
            await liveChatPage.closeChat();

            //Updating The Title of Existing and Inserting WebResource Name in WebResource Application Tab
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToMyApp(Constants.OmnichannelAdminCenterApp);
            await macrosAdminPage.updateTitleOfApplicationTab(Constants.ChangeWebResourceTitleTab,Constants.WebResourceTabTitle,Constants.WebResourceApplicationTab);
            await macrosAdminPage.insertWebResourceParameters();

            //Login as agent and accept chat
            await macrosAdminPage.openOmnichannelForCS(agentStartPage,agentPage, agentChat);
            await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);
            await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);
            
            //Validating The Changed Title of Application Tab by running the Macro
            const EntitySearchUsingMacroRechecking=await macrosAdminPage.runMacroAndValidate(agentPage,Constants.ChangeWebResourceTab);
            expect(EntitySearchUsingMacroRechecking).toBeTruthy();

            //Closing Chat
            await macrosAdminPage.closeConversation(agentPage, agentChat);
            await liveChatPage.closeChat();
            
            //Inserting Macro Parameter
            await macrosAdminPage.insertMacroParameter(Constants.WebResourceMacroSearch,Constants.WebResourceMacro,Constants.WebResourceAttributeName1,Constants.WebResourceAttributeValue);

            //Login as agent and accept chat
            await macrosAdminPage.openOmnichannelForCS(agentStartPage,agentPage, agentChat);
            await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);
            await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);

            //Validating The Changed Title of Application Tab by running the Macro
            const webResourceTabUsingMacroRechecking=await macrosAdminPage.runMacroAndValidate(agentPage,Constants.ChangeWebResourceTab);
            expect(webResourceTabUsingMacroRechecking).toBeTruthy();

            //Closing Chat
            await macrosAdminPage.closeConversation(agentPage, agentChat);
            await liveChatPage.closeChat();
        }
        finally
        {
            await macrosAdminPage.deleteAgentScript(Constants.AgentScriptName);
            await macrosAdminPage.deleteApplicationTabusingOmnichannelAdminCenter(Constants.WebResourceApplicationTab);
            await macrosAdminPage.deleteMacroFromOmnichannelAdminCenterApp(adminStartPage,Constants.WebResourceMacro);
        }
    });

    ///<summary>
    ///Test Case 2453339: Open Entity Record Application tab using Macro.
    ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_testPlans/execute?planId=2606066&opId=3617&suiteId=2606071
    ///</summary>
    it("Test Case 2453339: Open Entity Record Application tab using Macros", async () =>{
        agentPage = await agentContext.newPage();
        const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        const agentChat = new AgentChat(agentPage);
        const agentScriptAdminPage = new AgentScript(adminPage);
        try{
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.OmnichannelAdminCenterApp);
            const urlId=await macrosAdminPage.createApplicationTabAndGetId(Constants.EntityRecordApplicationTab,Constants.EntityRecordApplicationTabUniqueName,Constants.EntityRecordOptionValue );
            await macrosAdminPage.createMacroFromOmnichannelAdminCenterApp(Constants.EntityRecordMacro,urlId);
            await macrosAdminPage.createAgentScript(Constants.AgentScriptName,Constants.TitleUniqueName,Constants.EntityRecordMacro);
            await macrosAdminPage.addAgentScripttoDefaultChatSession();
            
            //Login as agent and accept chat
            await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(agentStartPage, agentChat);
            await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);
            await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);

            //Validating The Title of Application Tab by running the Macro
            const EntityRecordUsingMacro=await macrosAdminPage.runMacroAndValidate(agentPage,Constants.EntityRecordTabTitle );
            expect(EntityRecordUsingMacro).toBeTruthy();

            //Closing Chat
            await macrosAdminPage.closeConversation(agentPage, agentChat);
            await liveChatPage.closeChat();

            //Updating The Title of Existing and Inserting Entity Name in Entity Record Application Tab
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToMyApp(Constants.OmnichannelAdminCenterApp);
            await macrosAdminPage.updateTitleOfApplicationTab(Constants.ChangeEntityRecorditleTab,Constants.EntityRecordTabTitleSelect,Constants.EntityRecordApplicationTab);
            await macrosAdminPage.insertEntityRecordParameters();

            //Login as agent and accept chat
            await macrosAdminPage.openOmnichannelForCS(agentStartPage,agentPage, agentChat);
            await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);
            await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);
            
            //Validating The Changed Title of Application Tab by running the Macro
            const EntityRecordUsingMacroRechecking=await macrosAdminPage.runMacroAndValidate(agentPage,Constants.ChangeEntityRecordTab);
            expect(EntityRecordUsingMacroRechecking).toBeTruthy();

            //Closing Chat
            await macrosAdminPage.closeConversation(agentPage, agentChat);
            await liveChatPage.closeChat();
            
            //Inserting Macro Parameter
            await macrosAdminPage.insertMacroParameter(Constants.EntityRecordMacroSearch,Constants.EntityRecordMacro,Constants.EntityName,Constants.EntityLogicalNameIncident);

            //Login as agent and accept chat
            await macrosAdminPage.openOmnichannelForCS(agentStartPage,agentPage, agentChat);
            await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);
            await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);

            //Validating The Changed Title of Application Tab by running the Macro
            const entityRecordUsingMacroRechecking=await macrosAdminPage.runMacroAndValidate(agentPage,Constants.ChangeEntityRecordTab);
            expect(entityRecordUsingMacroRechecking).toBeTruthy();

            //Closing Chat
            await macrosAdminPage.closeConversation(agentPage, agentChat);
            await liveChatPage.closeChat();
        }
        finally
        {
            await macrosAdminPage.deleteAgentScript(Constants.AgentScriptName);
            await macrosAdminPage.deleteApplicationTabusingOmnichannelAdminCenter(Constants.EntityRecordApplicationTab);
            await macrosAdminPage.deleteMacroFromOmnichannelAdminCenterApp(adminStartPage,Constants.EntityRecordMacro);
        }
    });
    
    ///<summary>
    ///Test Case 1795816: [Runtime]: Verify details are showing properly when script step and macro step fails
    /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_testPlans/execute?planId=2576813&opId=3606&suiteId=2576817
    ///</summary>
    it("Test Case 1795816: [Runtime]: Verify details are showing properly when script step and macro step fails.", async () =>{
        agentPage = await agentContext.newPage();
        const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        const agentChat = new AgentChat(agentPage);
        try{
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.OmnichannelAdminCenterApp);
            await macrosAdminPage.createMacroFromOmnichannelAdminCenterApp(Constants.MacroFail,Constants.Urlid);
            await macrosAdminPage.createAgentScript(Constants.AgentScriptName,Constants.TitleUniqueName,Constants.EntityListMacro);
            await macrosAdminPage.addAgentScripttoDefaultChatSession();

            //Login as agent and accept chat
            await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(agentStartPage, agentChat);
            await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);
            await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);

            //Validating The Title of Application Tab by running the Macro
            const MFailMacro=await macrosAdminPage.runMacroAndValidate(agentPage,Constants.MFailTitleTab);
            expect(MFailMacro).toBeTruthy();

            //Closing Chat
            await macrosAdminPage.closeConversation(agentPage, agentChat);
            await liveChatPage.closeChat();
        }
        finally{
            await macrosAdminPage.deleteAgentScript(Constants.AgentScriptName);
            await macrosAdminPage.deleteMacro(adminStartPage,Constants.MacroFail);
        }
    });

    ///<summary>
    ///Test Case 2586434: verify resolve slug problem with boolean value,turn value to string.
    /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2586434
    ///</summary>
    it("Test Case 2586434: verify resolve slug problem with boolean value,turn value to string.", async () => {
        agentPage = await agentContext.newPage();
        try {
            //Login as admin and create case and initiate
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.createCase(Constants.CaseTitleName);
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToCustomerServiceWorkspace();
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName, Constants.CaseLink1);

             //Check API Response through Console
            const servicestage = await agentPage.evaluate(async () => {
                const ctrl = await (window as any).context.resolveSlug("{anchor.servicestage}");
                return ctrl; 
            });
            expect(servicestage).toBeTruthy();
            const routecase = await agentPage.evaluate(async () => {
                const ctrl = await (window as any).context.resolveSlug("{anchor.routecase}");
                return ctrl; 
            });
            expect(routecase).toBeTruthy();
            const followuptaskcreated = await agentPage.evaluate(async () => {
                const ctrl = await (window as any).context.resolveSlug("{anchor.followuptaskcreated}");
                return ctrl; 
            });
            expect(followuptaskcreated).toBeTruthy();
            const _accountid_value = await agentPage.evaluate(async () => {
                const ctrl = await (window as any).context.resolveSlug("{anchor._accountid_value}");
                return ctrl; 
            });
            expect(_accountid_value).toBeTruthy();  
        }
        finally {
            await macrosAdminPage.deleteCaseInCSH(adminPage, adminStartPage, Constants.CaseTitleName);
        }
    });

    ///<summary>
    ///Test Case 2242816: [P.Tool Migration] Ensure state persistence for tool selection in each session.
    /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2242816
    ///</summary>
    it("Test Case 2242816: [P.Tool Migration] Ensure state persistence for tool selection in each session.", async () => {
        agentPage = await agentContext.newPage();
        try {
            //Login as admin and create two cases 
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.createCase(Constants.CaseTitleName);
            await macrosAdminPage.createCase(Constants.CaseTitleName2);

            //Initiate session
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToCustomerServiceWorkspace();
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName, Constants.CaseLink1);
 
            //click on any tool in productivy pane
            await macrosAdminPage.ClickProductivityPaneTool(Constants.AStool); 
 
            //Initiate session
             await macrosAdminPage.GoToHome();
             await macrosAdminPage.InitiateSession(Constants.CaseTitleName2, Constants.CaseLink2);
 
            //click on any tool in productivity pane
            await macrosAdminPage.ClickProductivityPaneTool(Constants.KStool); 
 
            //switch to previous session and validate
            await macrosAdminPage.SwitchBackToPreviousSession(Constants.Firstcase);
            await macrosAdminPage.ValidateThePage(Constants.AStool);
 
            //switch to previous session and validate
            await macrosAdminPage.SwitchBackToPreviousSession(Constants.Secondcase);
            await macrosAdminPage.ValidateThePage(Constants.KStool);
         
        }
        finally {
            await macrosAdminPage.deleteCaseInCSH(adminPage, adminStartPage, Constants.CaseTitleName);
            await macrosAdminPage.deleteCaseInCSH(adminPage, adminStartPage, Constants.CaseTitleName2);
        }
    });
     
    ///<summary>
    ///Test Case 2268077: [P.Tool Migration] Ensure state persistence for app side panes state (collapsed/expanded) in each session
    /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2268077
    ///</summary>
    it("Test Case 2268077: [P.Tool Migration] Ensure state persistence for app side panes state (collapsed/expanded) in each session", async () => {
        agentPage = await agentContext.newPage();
        try {
            //Login as admin and create two cases and initiate it and verify
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.createCase(Constants.CaseTitleName);
            await macrosAdminPage.createCase(Constants.CaseTitleName2);

            //Initiate session
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToCustomerServiceWorkspace();
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName, Constants.CaseLink1);
 
            //click on any tool in productivy pane
            await macrosAdminPage.ClickProductivityPaneTool(Constants.AStool); 
 
            //Initiate session
            await macrosAdminPage.GoToHome();
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName2, Constants.CaseLink2);
 
            //click on any tool in productivity pane
            await macrosAdminPage.ClickProductivityPaneTool(Constants.KStool); 
 
            //switch to previous session and validate
            await macrosAdminPage.SwitchBackToPreviousSession(Constants.Firstcase);
            await macrosAdminPage.ValidateThePage(Constants.AStool);
 
            //switch to previous session and validate
            await macrosAdminPage.SwitchBackToPreviousSession(Constants.Secondcase);
            await macrosAdminPage.ValidateThePage(Constants.KStool);
         }

        finally {
            await macrosAdminPage.deleteCaseInCSH(adminPage, adminStartPage, Constants.CaseTitleName);
            await macrosAdminPage.deleteCaseInCSH(adminPage, adminStartPage, Constants.CaseTitleName2);
        }
    });

    ///<summary>
    ///Test Case 2245240: [P.Tool Migration] Verify the "happy path": productivity tools appear when a new session is created.
    /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2245240
    ///</summary>
    it("Test Case 2245240: [P.Tool Migration] Verify the productivity tools appear when a new session is created.", async () => {
        agentPage = await agentContext.newPage();
        try {
            //Login as admin and two create cases 
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.createCase(Constants.CaseTitleName);

            await macrosAdminPage.createCase(Constants.CaseTitleName2);

            //Initiate session
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToCustomerServiceWorkspace();
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName, Constants.CaseLink1); 
            
            //Open AgentScript tool in productivity pane
            await macrosAdminPage.ClickProductivityPaneTool(Constants.AStool);

            //Open Knowledge search tool in productivity pane
            await macrosAdminPage.ClickProductivityPaneTool(Constants.KStool);

            //Close Sesssion and validate page
            await macrosAdminPage.CloseSession(Constants.CloseSession1);
            await macrosAdminPage.ValidateThePage(Constants.NoProductivityPane);

            //Initiate session
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName2, Constants.CaseLink2);
            
            //Open AgentScript tool in productivity pane
            await macrosAdminPage.ClickProductivityPaneTool(Constants.AStool);

            //Open Knowledge search tool in productivity pane
            await macrosAdminPage.ClickProductivityPaneTool(Constants.KStool);

             //Close Sesssion and validate page
            await macrosAdminPage.CloseSession(Constants.CloseSession2);
            await macrosAdminPage.ValidateThePage(Constants.NoProductivityPane);
        }
        finally {
            await macrosAdminPage.deleteCaseInCSH(adminPage, adminStartPage, Constants.CaseTitleName);
            await macrosAdminPage.deleteCaseInCSH(adminPage, adminStartPage, Constants.CaseTitleName2);
        }
    });

    ///<summary>
    ///Test Case 2241678: [P.Tool Migration] Ensure productivity tools are hidden in the home session except Teams control
    /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2241678
    ///</summary>
    it("Test Case 2241678: [P.Tool Migration] Ensure productivity tools are hidden in the home session except Teams control", async () => {
        agentPage = await agentContext.newPage();
        try {
            //Login as admin and create cases
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.createCase(Constants.CaseTitleName);
            await macrosAdminPage.createCase(Constants.CaseTitleName2);

            //Initiate Session and validate page
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToCustomerServiceWorkspace();
            await macrosAdminPage.ValidateThePage(Constants.HomeNoProdu);
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName, Constants.CaseLink1);
            await macrosAdminPage.ValidateThePage(Constants.ProductivityPaneEnable);

            //Validate Home page and close session
            await macrosAdminPage.GoToHome();
            await macrosAdminPage.ValidateThePage(Constants.HomeNoProdu);
            await macrosAdminPage.CloseSession(Constants.CloseSession1);

            //Initiate Tab and validate Page and close
            await macrosAdminPage.InitiateTab(Constants.CaseTitleName, Constants.CaseLink1);
            await macrosAdminPage.ValidateThePage(Constants.TabNoProdu);
            await macrosAdminPage.CloseTab(Constants.CloseTab);

             //Initiate Session and validate page
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName, Constants.CaseLink1);
            await macrosAdminPage.ValidateThePage(Constants.ProductivityPaneEnable);

            //Validate Home page and close session
            await macrosAdminPage.GoToHome();
            await macrosAdminPage.ValidateThePage(Constants.HomeNoProdu);
            await macrosAdminPage.CloseSession(Constants.CloseSession1);

            //Initiate Session and validate page
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName2, Constants.CaseLink2);
            await macrosAdminPage.ValidateThePage(Constants.ProductivityPaneEnable);

            //Validate Home page and close session
            await macrosAdminPage.GoToHome();
            await macrosAdminPage.ValidateThePage(Constants.HomeNoProdu);
            await macrosAdminPage.CloseSession(Constants.CloseSession1);
        }
        finally {
            await macrosAdminPage.deleteCaseInCSH(adminPage, adminStartPage, Constants.CaseTitleName);
            await macrosAdminPage.deleteCaseInCSH(adminPage, adminStartPage, Constants.CaseTitleName2);
        }
    });

    ///<summary>
    ///Test Case 2390525: [P.Tool Migration] Ensure all the buttons on the smart assist cards behave the same as those before migration.
    /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2390525
    ///</summary>
    it("Test Case 2390525: [P.Tool Migration] Ensure all the buttons on the smart assist cards behave the same as those before migration.", async () => {
        agentPage = await agentContext.newPage();
        try {
            //Login as admin and create case
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.createCase(Constants.CaseTitleName);

            //Initiate Session and Validate
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToCustomerServiceWorkspace();
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName, Constants.CaseLink1);
            await macrosAdminPage.ValidateThePage(Constants.SuggestionCards);
            await macrosAdminPage.OpenSuggestionCard(Constants.ClickingCard1);
            await macrosAdminPage.OpenSuggestionCard(Constants.ClickingCard2);
        }
        finally {
            await macrosAdminPage.deleteCaseInCSH(adminPage, adminStartPage, Constants.CaseTitleName);
        }
    });
    
    ///<summary>
    ///Test Case 2245446: [P.Tool Migration] Ensure the badge number on smart assist can be accumulated and cached/restored along with session switch.
    /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2245446
    ///</summary>
    it("Test Case 2245446: [P.Tool Migration] Ensure the badge number on smart assist can be accumulated and cached/restored along with session switch.", async () => {
        agentPage = await agentContext.newPage();
        try {
            //Login as admin and creates
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.createCase(Constants.CaseTitleName);
            await macrosAdminPage.createCase(Constants.CaseTitleName3);

            //Initiate session and validate
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToCustomerServiceWorkspace();
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName, Constants.CaseLink1);
            await macrosAdminPage.ValidateThePage(Constants.BadgeNum);

            //Initiate session and validate
            await macrosAdminPage.GoToHome();
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName3, Constants.CaseLink3);
            await macrosAdminPage.ValidateThePage(Constants.NoBadgeNum);

            //switch to previous session and validate
            await macrosAdminPage.SwitchBackToPreviousSession(Constants.Firstcase);
            await macrosAdminPage.ValidateThePage(Constants.BadgeNum);
        }
        finally {
            await macrosAdminPage.deleteCaseInCSH(adminPage, adminStartPage, Constants.CaseTitleName);
            await macrosAdminPage.deleteCaseInCSH(adminPage, adminStartPage, Constants.CaseTitleName3);
        }
    });

    ///<summary>
    ///Test Case 2245402: [P.Tool Migration] Verify content updates of each tool when switching sessions (including smart assist cards and agent scripts)
    /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2245402
    ///</summary>
    it("Test Case 2245402: [P.Tool Migration] Verify content updates of each tool when switching sessions (including smart assist cards and agent scripts)", async () => {
        agentPage = await agentContext.newPage();
        try {
            //Login as admin and create casea
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.createCase(Constants.CaseTitleName);
            await macrosAdminPage.createCase(Constants.CaseTitleName3);

            //initiate session
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToCustomerServiceWorkspace();
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName, Constants.CaseLink1);

            //Open suggestions card and validate
            await macrosAdminPage.OpenSuggestionCard(Constants.ClickingCard1);
            await macrosAdminPage.ValidateThePage(Constants.ToolData);

            //Initiate session open suggesion card
            await macrosAdminPage.GoToHome();
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName2, Constants.CaseLink2);
            await macrosAdminPage.ClickProductivityPaneTool(Constants.KStool);
            await macrosAdminPage.OpenSuggestionCard(Constants.KSToolData);

            //switch to previous session and validate
            await macrosAdminPage.SwitchBackToPreviousSession(Constants.Firstcase);
            await macrosAdminPage.ValidateThePage(Constants.ToolData);
        }
        finally {
            await macrosAdminPage.deleteCaseInCSH(adminPage, adminStartPage, Constants.CaseTitleName);
            await macrosAdminPage.deleteCaseInCSH(adminPage, adminStartPage, Constants.CaseTitleName3);
        }
    });

    ///<summary>
    ///Test Case 1942183: [Multi Session] Email state persistence in multisession
    /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1942183
    ///</summary>
    it("Test Case 1942183: [Multi Session] Email state persistence in multisession", async () => {
        agentPage = await agentContext.newPage();
        try {
            //Login as admin and create
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.createCase(Constants.CaseTitleName);

            //Initiate session
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToCustomerServiceWorkspace();
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName, Constants.CaseLink1);

            //Open Email Editor and fill data
            await macrosAdminPage.EmailEditor();

            //Initiate session
            await macrosAdminPage.GoToHome();
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName2, Constants.CaseLink2);

            //switch to previous session and validate
            await macrosAdminPage.SwitchBackToPreviousSession(Constants.Firstcase);
            await macrosAdminPage.ValidateThePage(Constants.FocusOnEmailTab);
        }
        finally {
            await macrosAdminPage.deleteCaseInCSH(adminPage, adminStartPage, Constants.CaseTitleName);
        }
    });

    ///<summary>
    ///Test Case 1991369: [Multi Session][E2E] Verify Multisession functionality in CSW app
    /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1991369
    ///</summary>
    it("Test Case 1991369: [Multi Session][E2E] Verify Multisession functionality in CSW app", async () => {
        agentPage = await agentContext.newPage();
        try {
            //Login as admin and create cases
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.createCase(Constants.CaseTitleName);
            await macrosAdminPage.createCase(Constants.CaseTitleName2);

            //Initiate session and validate
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToCustomerServiceWorkspace();
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName, Constants.CaseLink1);
            await macrosAdminPage.ValidateThePage(Constants.ProductivityPaneEnable);

            //Initiate session and open any tool in Productivity Pane
            await macrosAdminPage.GoToHome();
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName2, Constants.CaseLink2);
            await macrosAdminPage.ClickProductivityPaneTool(Constants.SAtool);

            //Initiate session
            await macrosAdminPage.GoToHome();
            await macrosAdminPage.InitiateTab(Constants.CaseTitleName, Constants.CaseLink1);
        
            //switch to previous session and open suggesion card and validate
            await macrosAdminPage.SwitchBackToPreviousSession(Constants.OpenPreviousSession);
            await macrosAdminPage.OpenSuggestionCard(Constants.ClickingCard1);
            await macrosAdminPage.ValidateThePage(Constants.ToolData);
        }
        finally {
            await macrosAdminPage.deleteCaseInCSH(adminPage, adminStartPage, Constants.CaseTitleName);
            await macrosAdminPage.deleteCaseInCSH(adminPage, adminStartPage, Constants.CaseTitleName2);
        }
    });

    ///<summary>
    ///Test Case 1942197: [Multi Session][Productivity Pane][Similar Cases] Open suggestion with single click on card title
    /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1942197
    ///</summary>
    it("Test Case 1942197: [Multi Session][Productivity Pane][Similar Cases] Open suggestion with single click on card title", async () => {
        agentPage = await agentContext.newPage();
        try {
            //Login as admin and create case
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.createCase(Constants.CaseTitleName);

            //Initiate session and open suggesion card and validate
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToCustomerServiceWorkspace();
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName, Constants.CaseLink1);
            await macrosAdminPage.OpenSuggestionCard(Constants.ClickingCard1);
            await macrosAdminPage.ValidateThePage(Constants.ToolData);
        }
        finally {
            await macrosAdminPage.deleteCaseInCSH(adminPage, adminStartPage, Constants.CaseTitleName);
        }
    });

    ///<summary>
    ///Test Case 1942199: [Multi Session][Productivity Pane][Similar Cases] Re-open suggestion with single click on card title (follows prior scenario)
    /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1942199
    ///</summary>
    it("Test Case 1942199: [Multi Session][Productivity Pane][Similar Cases] Re-open suggestion with single click on card title (follows prior scenario)", async () => {
        agentPage = await agentContext.newPage();
        try {
            //Login as admin and create case
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.createCase(Constants.CaseTitleName);

            //Initiate session and open any two suggesion cards and validate
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToCustomerServiceWorkspace();
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName, Constants.CaseLink1);
            await macrosAdminPage.OpenSuggestionCard(Constants.ClickingCard1);
            await macrosAdminPage.OpenSuggestionCard(Constants.ClickingCard3);
            await macrosAdminPage.ValidateThePage(Constants.ToolData);
        }
        finally {
            await macrosAdminPage.deleteCaseInCSH(adminPage, adminStartPage, Constants.CaseTitleName);
        }
    });

    ///<summary>
    ///Test Case 1942201: [Multi Session][Productivity Pane][Similar Cases] Link similar case to active case from suggestion card
    /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1942201
    ///</summary>
    it("Test Case 1942201: [Multi Session][Productivity Pane][Similar Cases] Link similar case to active case from suggestion card", async () => {
        agentPage = await agentContext.newPage();
        try {
            //Login as admin and create case
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.createCase(Constants.CaseTitleName);

            //Initiate session 
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToCustomerServiceWorkspace();
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName, Constants.CaseLink1);

            //Click link to case button and validate
            await macrosAdminPage.LinkAndUnlinkCase(Constants.ClickLinkcase);
            await macrosAdminPage.ValidateThePage(Constants.LinkToCase);
            await macrosAdminPage.ValidateThePage(Constants.UnlinkCase);

            //Open connections and valiadte
            await macrosAdminPage.RelatedPage();
            await macrosAdminPage.ValidateThePage(Constants.ConnectionNewCase);
        }
        finally {
            await macrosAdminPage.deleteCaseInCSH(adminPage, adminStartPage, Constants.CaseTitleName);
        }
    });

    ///<summary>
    ///Test Case 1942209: [Multi Session][Productivity Pane][Similar Cases] Unlink similar case from active case from suggestion card (follows prior scenario)
    /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1942209
    ///</summary>
    it("Test Case 1942209: [Multi Session][Productivity Pane][Similar Cases] Unlink similar case from active case from suggestion card (follows prior scenario)", async () => {
        agentPage = await agentContext.newPage();
        try {
            //Login as admin and create case
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.createCase(Constants.CaseTitleName);

            //Initiate session
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToCustomerServiceWorkspace();
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName, Constants.CaseLink1);

            //Click Unlink to case  and validate
            await macrosAdminPage.LinkAndUnlinkCase(Constants.ClickLinkcase);
            await macrosAdminPage.LinkAndUnlinkCase(Constants.ClickUnlinkcase);
            await macrosAdminPage.ValidateThePage(Constants.LinkCase);

            //Open connections and validate
            await macrosAdminPage.RelatedPage();
            await macrosAdminPage.ValidateThePage(Constants.ConnectionNoData);
        }
        finally {
            await macrosAdminPage.deleteCaseInCSH(adminPage, adminStartPage, Constants.CaseTitleName);
        }
    });

    ///<summary>
    ///Test Case 1942194: [Multi Session][Productivity Pane] Productivity pane maintains collapsed state during session switch events
    ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1942194
    ///</summary>
    it("Test Case 1942194: [Multi Session][Productivity Pane] Productivity pane maintains collapsed state during session switch events", async () =>{
        agentPage = await agentContext.newPage();
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        try{
            //Login as crmadmin and create case
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.createCase(Constants.CaseTitleName);
            await macrosAdminPage.createCase(Constants.CaseTitleName2);

            //Navigate to CSW and intitiate sessions
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToCustomerServiceWorkspace();
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName, Constants.CaseLink1);
            await macrosAdminPage.GoToHome();
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName2, Constants.CaseLink2);
            await macrosAdminPage.ClickProductivityPaneTool(Constants.SAtool);
            await macrosAdminPage.ValidateThePage(Constants.ProductivityPaneDisable);
            await macrosAdminPage.SwitchBackToPreviousSession(Constants.CaseLink1);
            await macrosAdminPage.ValidateThePage(Constants.ProductivityPaneEnable);
        }
        finally
        {
            await macrosAdminPage.deleteCase(adminPage, adminStartPage, Constants.CaseTitleName);
            await macrosAdminPage.deleteCase(adminPage, adminStartPage, Constants.CaseTitleName2);
        }
    });
    
    ///<summary>
    ///Test Case 1942180: [Multi Session] Open Customer Service workspace as an agent
    ///Test Case Link  https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1942180
    ///<summary>       
    it("Test Case 1942180: [Multi Session] Open Customer Service workspace as an agent", async () =>{
        agentPage = await agentContext.newPage();
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        try{
            //Login as crmadmin
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);

            //validate page
            await macrosAdminPage.ValidateDashboard(Constants.ValidateServiceAgentDashboard);
        }
        finally{}     
    });

    ///<summary>
    ///Test Case 1942192: [Multi Session] View CSM dashboards
    ///Test Case Link  https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1942192
    ///<summary>       
    it("Test Case 1942192: [Multi Session] View CSM dashboards", async () =>{
        agentPage = await agentContext.newPage();
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        try{
            //Login as crmadmin
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
            await macrosAdminPage.ClickDropDown(Constants.DashboardSelector);

            //Validate page
            await macrosAdminPage.ValidateThePage(Constants.ServiceManagerDashboard);
            await macrosAdminPage.ValidateThePage(Constants. ServiceOperationsDashboard);
            await macrosAdminPage.ValidateThePage(Constants.ServicePerformanceDashboard);
        }
        finally
        {
            await macrosAdminPage.CloseDropDown(Constants.DashboardSelector);
        }
    }); 

    ///<summary>
    ///Test Case 1945859: [Multi Session] Create and Convert Activities (Task, Email, Phone Call, Fax, Letter, Appointment & Custom Activity) to Case.
    /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1945859
    ///</summary>
    it("Test Case 1945859: [Multi Session] Create and Convert Activities (Task, Email, Phone Call, Fax, Letter, Appointment & Custom Activity) to Case.", async () => {
        agentPage = await agentContext.newPage();
        try{
            //Login as admin and create case
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.createCase(Constants.CaseTitleName);

            //Create Task and conver it to case and validate
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToCustomerServiceWorkspace();
            await macrosAdminPage.CreateTask(Constants.TaskName);
            await macrosAdminPage.ConvertTaskToCase();
            await macrosAdminPage.ValidateThePage(Constants.TaskToCaseValidation);

            //Resolve case and validate
            await macrosAdminPage.ResolveCase(Constants.ResolutionName);
            await macrosAdminPage.ValidateThePage(Constants.ValidateResolveCase);

            //Reactivate case and Validate
            await macrosAdminPage.ReactivateCase();
            await macrosAdminPage.ValidateThePage(Constants.ValidateReactivateCase);

            //Cancel case and valiadte
            await macrosAdminPage.CancelCase();
            await macrosAdminPage.ValidateThePage(Constants.ValidateCloseCase);

            //Reactivate case and delete
            await macrosAdminPage.ReactivateCase();
            await macrosAdminPage.DeleteCase();

            //Initiate case and Resolve it and Validate
            await macrosAdminPage.GoToHome();
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName, Constants.CaseLink1);
            await macrosAdminPage.ResolveCase(Constants.ResolutionName);
            await macrosAdminPage.ValidateThePage(Constants.ValidateResolveCase);

            //Reactivate case and Validate
            await macrosAdminPage.ReactivateCase();
            await macrosAdminPage.ValidateThePage(Constants.ValidateReactivateCase);

            //Cancel case and valiadte
            await macrosAdminPage.CancelCase();
            await macrosAdminPage.ValidateThePage(Constants.ValidateCloseCase);
            await macrosAdminPage.ReactivateCase();
        }
        finally{
            await macrosAdminPage.deleteCaseInCSH(adminPage, adminStartPage, Constants.CaseTitleName);
        }
    });

    ///<summary>
    ///Test Case 1946076: [Multi Session] Verify Quick create action for Case entity and Activities
    /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1946076
    ///</summary>
    it("Test Case 1946076: [Multi Session] Verify Quick create action for Case entity and Activities", async () => {
        agentPage = await agentContext.newPage();
        try{
            //Login as admin and create case In CSW
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToCustomerServiceWorkspace();

            //Create case and Validate
            await macrosAdminPage.CreateCaseInCSW(Constants.CaseTitleName, Constants.CasePriority);
            await macrosAdminPage.ValidateThePage(Constants.Notification);

            //Initiate Session and Validate
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName, Constants.CaseLink1);
            await macrosAdminPage.ValidateThePage(Constants.ValidateCaseTitle);
            await macrosAdminPage.ValidateThePage(Constants.ValidateCustomer);
        }
        finally{
            await macrosAdminPage.deleteCaseInCSH(adminPage, adminStartPage, Constants.CaseTitleName);
        }
    });

    ///<summary>
    ///Test Case 1946046: [Multi Session] Verify Case Assoication action from Case Grid
    ///Test Case Link  https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1946046
    ///<summary>       
    it("Test Case 1946046: [Multi Session] Verify Case Assoication action from Case Grid", async () =>{
        agentPage = await agentContext.newPage();
        try{
            //Login as crmadmin
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            
            //Create four child Cases and three parent cases
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.createCase(Constants.Case1_Child1);
            await macrosAdminPage.createCase(Constants.Case1_Child2);
            await macrosAdminPage.createCase(Constants.Case2_Child1);
            await macrosAdminPage.createCase(Constants.Case2_Child2);
            await macrosAdminPage.createCase(Constants.Case1);
            await macrosAdminPage.createCase(Constants.Case2);
            await macrosAdminPage.createCase(Constants.Case3);

            //Open Cases grid and Associate them
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
            await macrosAdminPage.GoToCases();
            
            //Associate two child cases with one parent case and Valiadte
            await macrosAdminPage.AssociateCases(Constants.Case1,Constants.DialogText);

             //Associate two child cases with one parent case and validate
            await macrosAdminPage.AssociateCases(Constants.Case2,Constants.DialogText);

             //Associate two child cases with one parent case and validate
            await macrosAdminPage.AssociateCases(Constants.AssociateCase3, Constants.ErrorDialog);
        }
        finally{
            await macrosAdminPage.deleteCase(adminPage, adminStartPage, Constants.Case1);
            await macrosAdminPage.deleteCase(adminPage, adminStartPage, Constants.Case2);
            await macrosAdminPage.deleteCase(adminPage, adminStartPage, Constants.Case3);
            await macrosAdminPage.deleteCase(adminPage, adminStartPage, Constants.Case1_Child1);
            await macrosAdminPage.deleteCase(adminPage, adminStartPage, Constants.Case1_Child2);
            await macrosAdminPage.deleteCase(adminPage, adminStartPage, Constants.Case2_Child1);
            await macrosAdminPage.deleteCase(adminPage, adminStartPage, Constants.Case2_Child2);
        }  
    }); 

    ///<summary>
    ///Test Case 1945916: [Multi Session] Verify Merge Operation on multiple cases from Case grid page and activities getting tied to primary case after merge.
    ///Test Case Link  https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1945916
    ///<summary>       
    it("Test Case 1945916: [Multi Session] Verify Merge Operation on multiple cases from Case grid page and activities getting tied to primary case after merge.", async () =>{
        agentPage = await agentContext.newPage();
        try{
            //Login as crmadmin
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
           
            //Create two child Cases and one parent case
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.createCase(Constants.FCase1);
            await macrosAdminPage.createCase(Constants.FCase2);
            await macrosAdminPage.createCase(Constants.FParent1);

            //Initiate first child case and add Note in it
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
            await macrosAdminPage.InitiateSession(Constants.FCase1, Constants.ChildCaseLink1);
            await macrosAdminPage.AddNote(Constants.AddButton, Constants.Note);

            //Initiate secound child case and add post in it
            await macrosAdminPage.GoToHome();
            await macrosAdminPage.InitiateSession(Constants.FCase2, Constants.ChildCaseLink2);
            await macrosAdminPage.AddPost(Constants.AddButton, Constants.Post);

            //Go to cases grid and merge two child cases with one parent case
            await macrosAdminPage.GoToHome();
            await macrosAdminPage.GoToCases();
            await macrosAdminPage.MergeCases(Constants.First);

            //Open parent case and verify details 
            await macrosAdminPage.ParentCaseDetails(Constants.First);
            await macrosAdminPage.VerifyParentCase();
        }
        finally{
            await macrosAdminPage.deleteCase(adminPage, adminStartPage, Constants.FCase1);
            await macrosAdminPage.deleteCase(adminPage, adminStartPage, Constants.FCase2);
            await macrosAdminPage.deleteCase(adminPage, adminStartPage, Constants.FParent1);
        }
    }); 

    ///<summary>
    ///Test Case 2045219: [App Profile Manager] : Verify Shift click, control click, actions with csm(roles csr manager, app access, productivity tool user) with Default App Profile
    /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045219
    ///</summary>
    it("Test Case 2045219: [App Profile Manager] : Verify Shift click, control click, actions with csm(roles csr manager, app access, productivity tool user) with Default App Profile", async () => {
        agentPage = await agentContext.newPage();
        try{
            //Login as admin and create case
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.createCase(Constants.CaseTitleName);

            //Initiate Tab and validate Page and close tab
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToCustomerServiceWorkspace();
            await macrosAdminPage.InitiateTab(Constants.CaseTitleName, Constants.CaseLink1);
            await macrosAdminPage.ValidateThePage(Constants.TabNoProdu);
            await macrosAdminPage.CloseTab(Constants.CloseTab);

            //Initiate Session and validate page
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName, Constants.CaseLink1);
            await macrosAdminPage.ValidateThePage(Constants.ProductivityPaneEnable);
            await macrosAdminPage.ValidateThePage(Constants.ValidateSuggestion);

            //Open Agent Script tool and validate
            await macrosAdminPage.ClickProductivityPaneTool(Constants.AStool);
            await macrosAdminPage.ValidateThePage(Constants.AStool);

            //Open Knowledge search tool and validate
            await macrosAdminPage.ClickProductivityPaneTool(Constants.KStool);
            await macrosAdminPage.ValidateThePage(Constants.ValidateKSResults);
        }
        finally{
            await macrosAdminPage.deleteCase(adminPage, adminStartPage, Constants.CaseTitleName);
        }
    });

    ///<summary>
    ///Test Case 2045223: [App Profile Manager] : Verify Shift click, control click, actions with csr(roles csr, app access, productivity tool user) with Default App Profile
    /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045223
    ///</summary>
    it("Test Case 2045223: [App Profile Manager] : Verify Shift click, control click, actions with csr(roles csr, app access, productivity tool user) with Default App Profile", async () => {
        agentPage = await agentContext.newPage();
        try{
            //Login as admin and create case
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.createCase(Constants.CaseTitleName);

            //Initiate Tab and validate Page and close tab
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToCustomerServiceWorkspace();
            await macrosAdminPage.InitiateTab(Constants.CaseTitleName, Constants.CaseLink1);
            await macrosAdminPage.ValidateThePage(Constants.TabNoProdu);
            await macrosAdminPage.CloseTab(Constants.CloseTab);

            //Initiate Session and validate page
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName, Constants.CaseLink1);
            await macrosAdminPage.ValidateThePage(Constants.ProductivityPaneEnable);
            await macrosAdminPage.ValidateThePage(Constants.ValidateSuggestion);

            //Open Agent Script tool and validate
            await macrosAdminPage.ClickProductivityPaneTool(Constants.AStool);
            await macrosAdminPage.ValidateThePage(Constants.AStool);

            //Open Knowledge search tool and validate
            await macrosAdminPage.ClickProductivityPaneTool(Constants.KStool);
            await macrosAdminPage.ValidateThePage(Constants.ValidateKSResults);
        }
        finally{
            await macrosAdminPage.deleteCase(adminPage, adminStartPage, Constants.CaseTitleName);
        }
    });

    ///<summary>
    ///Test Case 2045297: [Productivity Pane: Knowledge Search] : Validate all available actions from knowledge search control (search, link, etc.)
    /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045297
    ///</summary>
    it("Test Case 2045297: [Productivity Pane: Knowledge Search] : Validate all available actions from knowledge search control (search, link, etc.)", async () => {
        agentPage = await agentContext.newPage();
        try{
            //Login as admin and create case
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.createCase(Constants.CaseTitleName);

            //Initiate session
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToCustomerServiceWorkspace();
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName, Constants.CaseLink1);

            //Open Knowledge search tool and validate given conditions
            await macrosAdminPage.ClickProductivityPaneTool(Constants.KStool);
            await macrosAdminPage.ValidateThePage(Constants.KStool);
            await macrosAdminPage.ValidateThePage(Constants.ValidateKSResults);
            await macrosAdminPage.ValidateThePage(Constants.SearchKSArticle);
            await macrosAdminPage.ValidateThePage(Constants.KSLinkBtn);
        }
        finally{
            await macrosAdminPage.deleteCase(adminPage, adminStartPage, Constants.CaseTitleName);
        }
    });
    ///<summary>
    ///Test Case 1942193: [Multi Session][Productivity Pane] Productivity pane expanded once existing case is open
    ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_testPlans/execute?planId=2627279&suiteId=2627282
    ///</summary>
    it("Test Case 1942193: [Multi Session][Productivity Pane] Productivity pane expanded once existing case is open", async () =>{
        agentPage = await agentContext.newPage();
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        try
        {
            //Login as admin and create cases
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.createCase(Constants.CaseTitleName);
            await macrosAdminPage.createCase(Constants.CaseTitleName2);

            //Initiate two Session and Validating Productivity pane
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName, Constants.CaseLink1);
            await macrosAdminPage.GoToHome();
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName2, Constants.CaseLink2);
            await macrosAdminPage.SwitchBackToPreviousSession(Constants.CaseLink1);
            await macrosAdminPage.ValidateThePage(Constants.ProductivityPaneEnable);
            await macrosAdminPage.SwitchBackToPreviousSession(Constants.CaseLink2);
            await macrosAdminPage.ValidateThePage(Constants.ProductivityPaneEnable); 
        }
        finally
        {
            await macrosAdminPage.deleteCase(adminPage, adminStartPage, Constants.CaseTitleName);
            await macrosAdminPage.deleteCase(adminPage, adminStartPage, Constants.CaseTitleName2);
        }
    });    

    ///<summary>
    ///Test Case 1942179: [Multi Session] Verify General multisession navigation
    ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_testPlans/execute?planId=2627279&suiteId=2627282
    ///</summary>
    it("Test Case 1942179: [Multi Session] Verify General multisession navigation", async () =>{
        agentPage = await agentContext.newPage();
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        try
        {
            //Login as admin and create cases
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.createCase(Constants.CaseTitleName);
            await macrosAdminPage.createCase(Constants.CaseTitleName2);

            //Initiate one Session and Tab
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName, Constants.CaseLink1);
            await macrosAdminPage.GoToHome();
            await macrosAdminPage.InitiateTab(Constants.CaseTitleName2, Constants.CaseLink2);
            
            //Validating Opening Session and Tab
            await macrosAdminPage.ValidateThePage(Constants.CaseTitleNameVal);
            await macrosAdminPage.ValidateThePage(Constants.CaseTitleName2Val);
        }
        finally
        {
            await macrosAdminPage.deleteCase(adminPage, adminStartPage, Constants.CaseTitleName);
            await macrosAdminPage.deleteCase(adminPage, adminStartPage, Constants.CaseTitleName2);
        }
    });

    ///<summary>
    ///Test Case 1942189: [Multi Session] Open Customer Service workspace as a Customer Service Manager
    ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1942189
    ///</summary>
    it("Test Case 1942189: [Multi Session] Open Customer Service workspace as a Customer Service Manager", async () =>{
        agentPage = await agentContext.newPage();
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        try
        {
            //Login as admin and create cases
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
    
            //Validating Customer Service 
            await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
            await macrosAdminPage.ValidateDashboard(Constants.CustomerServiceManagerDashBoard);
        }
        finally
        {
            console.log("validation Successfully");
        }
    });

    ///<summary>
    ///Test Case 1945844: [Multi Session] Verify the Subject functionality
    ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1945844
    ///</summary>
    it("Test Case 1945844: [Multi Session] Verify the Subject functionality", async () =>{
        agentPage = await agentContext.newPage();
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        try
        {
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.GoToServiceManagement();
            await macrosAdminPage.CreateSubjectsFromHub(Constants.SubjectName, Constants.SubjectName2, Constants.SubjectName3);
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);

            //Creating Subjects
            await macrosAdminPage.CreateCaseForSubjectsInCSW(Constants.CaseTitleName2, Constants.SubjectName);
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName2, Constants.CaseLink2);

            //validating subject field
            await macrosAdminPage.ValidateThePage(Constants.CWSSubjectInputField);
            await macrosAdminPage.ValidateSubjectField(Constants.SubField, Constants.Parent, Constants.Child1);
            await macrosAdminPage.GoToHome();
            await macrosAdminPage.InitiateTab(Constants.CaseTitleName2, Constants.CaseLink2);

            //validating subject field
            await macrosAdminPage.ValidateThePage(Constants.CWSSubjectInputField);
            await macrosAdminPage.ValidateSubjectField(Constants.SubField, Constants.Parent, Constants.Child1);
        }
        finally
        {
            await macrosAdminPage.deleteCase(adminPage, adminStartPage, Constants.CaseTitleName2);
            await macrosAdminPage.DeleteSubject(adminPage, adminStartPage);
        }
    }); 

    ///<summary>
    ///Test Case 1945833: [Multi Session] Verify Case Entitlements.
    ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1945833
    ///</summary>
    it("Test Case 1945833: [Multi Session] Verify the Subject functionality", async () =>{
        agentPage = await agentContext.newPage();
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        try
        {
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.GoToServiceManagement();

            //creating Entitlements
            await macrosAdminPage.CreateEntitlements(Constants.EntName1);
            await macrosAdminPage.DecRemainingOnForCaseCreation();
            await macrosAdminPage.Totalterms(Constants.TtermsforEnt);
            await macrosAdminPage.CreateEntitlements(Constants.EntName2);
            await macrosAdminPage.Totalterms(Constants.TtermsforEnt2);
            await macrosAdminPage.CreateEntitlements(Constants.EntName3);
            await macrosAdminPage.DecRemainingOnForCaseCreation();
            await macrosAdminPage.Totalterms(Constants.TtermsforEnt);

            //select Entitlements in case and verifying the Entitlement field
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
            await macrosAdminPage.createCaseFromCSWSiteMap(Constants.Case1);
            await macrosAdminPage.InitiateSession(Constants.Case1, Constants.CaseLink);
            await macrosAdminPage.GoToEntField();
            await macrosAdminPage.ChooseEntitlement(Constants.EntName1, Constants.ChooseEnt1);

            //verfying Emtitlement Remaining terms is decreased by 1
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.GoToServiceManagement();
            await macrosAdminPage.OpenEntitlement(Constants.EntName1, Constants.ChooseEnt1);
            await macrosAdminPage.ValidateThePage(Constants.RemTermsInEnt1);
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
            await macrosAdminPage.InitiateSession(Constants.Case1, Constants.CaseLink);
            await macrosAdminPage.ChooseEnt1ToEnt2(Constants.ChooseEnt2);

            //verifing the case auto saved
            await macrosAdminPage.ValidateThePage(Constants.VerifyCreated);
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.GoToServiceManagement();
            await macrosAdminPage.OpenEntitlement(Constants.EntName1, Constants.ChooseEnt1);

            //verifing the Entitlements remaining terms increased by 1
            await macrosAdminPage.ValidateThePage(Constants.RemTerms2InEnt1);
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
            await macrosAdminPage.InitiateSession(Constants.Case1, Constants.CaseLink);
            await macrosAdminPage.ResolveCase(Constants.ResolutionName);
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.GoToServiceManagement();
            await macrosAdminPage.OpenEntitlement(Constants.EntName2, Constants.ChooseEnt2);

            //verfying Emtitlement Remaining terms is decreased by 1
            await macrosAdminPage.ValidateThePage(Constants.RemTermsInEnt2);
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
            await macrosAdminPage.OpenAllCases();
            await macrosAdminPage.InitiateSession(Constants.Case1, Constants.CaseLink);
            await macrosAdminPage.ReactivateCase();
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.GoToServiceManagement();
            await macrosAdminPage.OpenEntitlement(Constants.EntName2, Constants.ChooseEnt2);

            //verifing the Entitlements remaining terms increased by 1
            await macrosAdminPage.ValidateThePage(Constants.RemTerms2InEnt2);
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
            await macrosAdminPage.InitiateSession(Constants.Case1, Constants.CaseLink);
            await macrosAdminPage.DoNotDecrementEntitlementTerms();
            await macrosAdminPage.ResolveCase(Constants.ResolutionName);
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.GoToServiceManagement();
            await macrosAdminPage.OpenEntitlement(Constants.EntName2, Constants.ChooseEnt2);

            //verifing the Entitlements remaining terms is 10
            await macrosAdminPage.ValidateThePage(Constants.RemTerms2InEnt2);

            //create another case and select Entitlement
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
            await macrosAdminPage.createCaseFromCSWSiteMap(Constants.Case22);
            await macrosAdminPage.InitiateSession(Constants.Case2, Constants.CaseLink22);
            await macrosAdminPage.GoToEntField();
            await macrosAdminPage.ChooseEntitlement(Constants.EntName1, Constants.ChooseEnt1);
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.GoToServiceManagement();
            await macrosAdminPage.OpenEntitlement(Constants.EntName1, Constants.ChooseEnt1);

            //verifing the Entitlements remaining terms decreased by 1
            await macrosAdminPage.ValidateThePage(Constants.RemTermsInEnt1);
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
            await macrosAdminPage.InitiateSession(Constants.Case2, Constants.CaseLink22);
            await macrosAdminPage.DoNotDecrementEntitlementTerms();
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.GoToServiceManagement();
            await macrosAdminPage.OpenEntitlement(Constants.EntName1, Constants.ChooseEnt1);

            //verifing the Entitlements remaining terms count 20
            await macrosAdminPage.ValidateThePage(Constants.RemTerms2InEnt1);
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
            await macrosAdminPage.createCaseFromCSWSiteMap(Constants.AutomationCaseTitle);
            await macrosAdminPage.InitiateSession(Constants.AutomationCaseTitle, Constants.CaseLink1);
            await macrosAdminPage.GoToEntField();
            await macrosAdminPage.ChooseEntitlement(Constants.EntName3, Constants.ChooseEnt3);
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.GoToServiceManagement();
            await macrosAdminPage.OpenEntitlement(Constants.EntName3, Constants.ChooseEnt3);

            //verifing the Entitlements remaining terms decreased by 1
            await macrosAdminPage.ValidateThePage(Constants.RemTermsInEnt3);
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
            await macrosAdminPage.InitiateTab(Constants.AutomationCaseTitle, Constants.CaseLink1);
            await macrosAdminPage.DoNotDecrementEntitlementTerms();
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.GoToServiceManagement();
            await macrosAdminPage.OpenEntitlement(Constants.EntName3, Constants.ChooseEnt3);

            //verifing the Entitlements remaining terms count 20
            await macrosAdminPage.ValidateThePage(Constants.RemTerms2InEnt3);
        }
        finally 
        {
            await macrosAdminPage.deleteCase(adminPage, adminStartPage, Constants.Case11);
            await macrosAdminPage.deleteCase(adminPage, adminStartPage, Constants.AutomationCaseTitle);
            await macrosAdminPage.GoToServiceManagement();
            await macrosAdminPage.DeleteEntitlement(Constants.Entitlement);
        }
    }); 

    ///<summary>
    ///Test Case 2045187: [Navigation and Gestures] : Verify if records can be opened as sessions from queue item views
    ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045187
    ///</summary>
    it("Test Case 2045187: [Navigation and Gestures] : Verify if records can be opened as sessions from queue item views", async () =>{
        agentPage = await agentContext.newPage();
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        try
        {
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.GoToServiceManagement();

            //creating Queue
            await macrosAdminPage.CreatePublicQueue(Constants.QueueName);
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
            await macrosAdminPage.createCaseFromCSWSiteMap(Constants.Case1);
            await macrosAdminPage.InitiateSession(Constants.Case1, Constants.CaseLink);

            //add queue to the case
            await macrosAdminPage.AddCaseToQueue(Constants.QueueName);
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
            await macrosAdminPage.OpenQueueFromCSWSiteMap();

            //Validating the Queue grid
            await macrosAdminPage.ValidateThePage(Constants.QueuesGridInCSW);
            await macrosAdminPage.SelectAllItemsAllQueues();
            //await macrosAdminPage.OpenQueueItem(Constants.Case1);

            //validating opened session
            await macrosAdminPage.ValidateThePage(Constants.CaseSession);
        }
        finally
        {
            await macrosAdminPage.deleteCase(adminPage, adminStartPage, Constants.Case11);
            await macrosAdminPage.DeleteQueue(adminPage, adminStartPage, Constants.QueueName);
        }
    });

    ///<summary>
    ///Test Case 2045262: [Productivity Pane: Smart Assist] : Verify Email URL action is working
    ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045262
    ///</summary>
    it("Test Case 2045262: [Productivity Pane: Smart Assist] : Verify Email URL action is working", async () =>{
        agentPage = await agentContext.newPage();
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        try
        {
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.GoToServiceManagement();
            await macrosAdminPage.SetupSmartAssist();

            //validating simmilar suggestions and KB suggestions
            await macrosAdminPage.ValidateThePage(Constants.SimilarSuggestionsinCSH);
            await macrosAdminPage.ValidateThePage(Constants.KBSuggestionsinCSH);
            await macrosAdminPage.EnableSuggestionsInCSH();
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToCustomerServiceWorkspace();
            await macrosAdminPage.CreateCaseInCSW(Constants.CaseTitleName, Constants.CasePriority);
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName, Constants.CaseLink1);

            //validating simmilar suggestions in samrt assist
            await macrosAdminPage.ValidateThePage(Constants.ValKBSuggestionsinCSW);
            await macrosAdminPage.EmailURL();

            //validating the email body contains the URL
            await macrosAdminPage.ValidateTheEmailBody(Constants.Email);
            await macrosAdminPage.ValidateThePage(Constants.NewMail);
        }
        finally
        {
            await macrosAdminPage.deleteCase(adminPage, adminStartPage, Constants.CaseTitleName);
        }
    });

    ///<summary>
    ///Test Case 2045186: [Navigation and Gestures] : Verify if records can be opened as sessions from case views
    ///Test Case Link  https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045186
    ///<summary>        
    it("Test Case 2045186: [Navigation and Gestures] : Verify if records can be opened as sessions from case views", async () => {
        agentPage = await agentContext.newPage();
        try
        {
            //Login as admin and create two cases and initiate it and verify
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.createCase(Constants.CaseTitleName);
            //Initiate session and validate
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
            await macrosAdminPage.GoToCases();
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName,Constants.CaseLink1);
            await macrosAdminPage.ValidateThePage(Constants.CloseSession1);
        }
        finally 
        {    
            await macrosAdminPage.deleteCaseInCSH(adminPage, adminStartPage, Constants.CaseTitleName);
        }
    });

    ///<summary>
    ///Test Case 2045306: [Productivity Pane: Agent Guidance] : Verify if knowledge search is available with default configuration
    ///Test Case Link  https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045306
    ///<summary> 
    it("Test Case 2045306: [Productivity Pane: Agent Guidance] : Verify if knowledge search is available with default configuration", async () => {
        agentPage = await agentContext.newPage();
        try
        {
            //Login as admin and create case
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.createCase(Constants.CaseTitleName);
            //Initiate session
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToCustomerServiceWorkspace();
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName, Constants.CaseLink1);
            await macrosAdminPage.ClickProductivityPaneTool(Constants.KStool); 
            await macrosAdminPage.ValidateThePage(Constants.Knowledgesearch);
        }
        finally
        {
            await macrosAdminPage.deleteCase(adminPage, adminStartPage, Constants.CaseTitleName);        
        }
    });

    ///<summary>
    ///Test Case  2045181: [Application Setup] c: Verify if CSR and CSM security roles have access to productivity pane related entities
    ///Test Case Link  https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045181
    ///<summary> 
    it("Test Case  2045181: [Application Setup] : Verify if CSR and CSM security roles have access to productivity pane related entities", async () => {
        agentPage = await agentContext.newPage();
        try
        {
            //Login as admin and create case
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.createCase(Constants.CaseTitleName);
            //Initiate session
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToCustomerServiceWorkspace();
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName, Constants.CaseLink1);
            await macrosAdminPage.ValidateThePage(Constants.Smartassist);
            await macrosAdminPage.ValidateThePage(Constants.KnowledgeArticle);
            await macrosAdminPage.ValidateThePage(Constants.ClickingCard2); 
            await macrosAdminPage.ClickProductivityPaneTool(Constants.AStool); 
            //Validate page
            await macrosAdminPage.ValidateThePage(Constants. Agentscripts);
            await macrosAdminPage.ClickProductivityPaneTool(Constants.KStool); 
            await macrosAdminPage.ValidateThePage(Constants.Knowledgesearch);
        }
        finally
        {
            await macrosAdminPage.deleteCase(adminPage, adminStartPage, Constants.CaseTitleName);    
        }          
    });

    ///<summary>
    ///Test Case 2045190: [Navigation and Gestures] : Verify if records can be opened as tabs from case views
    /// Test Case Link hhttps://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045190
    ///</summary>
    it("Test Case 2045190: [Navigation and Gestures] : Verify if records can be opened as tabs from case views)", async () => {
        agentPage = await agentContext.newPage();
        try 
        {
            //Login as admin and create case
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.createCase(Constants.CaseTitleName);

            //Initiate session 
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToCustomerServiceWorkspace();
            await macrosAdminPage.GoToCases();
            await macrosAdminPage.InitiateTab(Constants.CaseTitleName, Constants.CaseLink1);
            await macrosAdminPage.ValidateThePage(Constants.CloseTab);
        }
        finally
        {
            await macrosAdminPage.deleteCaseInCSH(adminPage, adminStartPage, Constants.CaseTitleName);
        }
    });

    ///<summary>
    ///Test Case 2045250: [Productivity Pane: Smart Assist] : Setup smart assist using customer service hub for similar case and article suggestions
    ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045250
    ///<summary> 
    it("Test Case 2045250: [Productivity Pane: Smart Assist] : Setup smart assist using customer service hub for similar case and article suggestions", async () => {
        agentPage = await agentContext.newPage();
        try 
        {
            //Login as admin and create case
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.GoToServiceManagement();
            await macrosAdminPage.SetupSmartAssist();

            //validating simmilar suggestions and KB suggestions
            await macrosAdminPage.ValidateThePage(Constants.SimilarSuggestionsinCSH);
            await macrosAdminPage.ValidateThePage(Constants.KBSuggestionsinCSH);
            await macrosAdminPage.EnableSuggestionsInCSH();
        }
        finally
        {
            await macrosAdminPage.TurnOffSuggestions(adminPage, adminStartPage);  
        }
    });

    ///<summary>
    ///Test Case 2045296: [Productivity Pane: Knowledge Search] : Verify if knowledge search is available with default configuration
    ///Test Case Link  https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045296
    ///<summary> 
    it("Test Case 2045296: [Productivity Pane: Knowledge Search] : Verify if knowledge search is available with default configuration", async () => {
        agentPage = await agentContext.newPage();
        try 
        {
            //Login as admin and create case
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.createCase(Constants.CaseTitleName);
           //Initiate session
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToCustomerServiceWorkspace();
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName, Constants.CaseLink1);
            await macrosAdminPage.ClickProductivityPaneTool(Constants.KStool); 
            await macrosAdminPage.ValidateThePage(Constants.Knowledgesearch); 
        }
        finally
        {
            await macrosAdminPage.deleteCase(adminPage, adminStartPage, Constants.CaseTitleName);    
        }
    });
     
    ///<summary>
    ///Test Case 2045252: [Productivity Pane: Smart Assist] : Verify if smart assist is available with default configuration 
    ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045252
    ///<summary>       
    it("Test Case 2045252: [Productivity Pane: Smart Assist] : Verify if smart assist is available with default configuration", async () => {
        agentPage = await agentContext.newPage();
        try
        {
            //Login as admin and create case
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.createCase(Constants.CaseTitleName);

            //Initiate session
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToCustomerServiceWorkspace();
            await macrosAdminPage.GoToCases();
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName, Constants.CaseLink1);
            await macrosAdminPage.ValidateThePage(Constants.CloseSession1);
            await macrosAdminPage.ValidateThePage(Constants.Smartassist);
        }
        finally
        {
            await macrosAdminPage.deleteCaseInCSH(adminPage, adminStartPage, Constants.CaseTitleName);
        }     
    });

    ///<summary>
    ///Test Case 2045214: [App Profile Manager] : Verify Shift click, control click, actions with admin with Default App Profile  
    ///Test Case Link  https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045214
    ///<summary>       
    it("Test Case 2045214: [App Profile Manager] : Verify Shift click, control click, actions with admin with Default App Profile", async () => {
        agentPage = await agentContext.newPage();
        try 
        {
            //Login as admin and create case
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.createCase(Constants.CaseTitleName);
            //Initiate session and validate
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName, Constants.CaseLink1);
            await macrosAdminPage.ValidateThePage(Constants.CloseSession1);
            await macrosAdminPage.ValidateThePage(Constants.Smartassist);
            await macrosAdminPage.ClickProductivityPaneTool(Constants.AStool); 
            //Validate page
            await macrosAdminPage.ValidateThePage(Constants. Agentscripts);
            await macrosAdminPage.ClickProductivityPaneTool(Constants.KStool); 
            await macrosAdminPage.ValidateThePage(Constants.Knowledgesearch);
            await macrosAdminPage.CloseSession(Constants.CloseSession1);
            await macrosAdminPage.InitiateTab(Constants.CaseTitleName, Constants.CaseLink1);
            await macrosAdminPage.ValidateThePage(Constants.CloseTab);
        }
        finally
        {
            await macrosAdminPage.deleteCaseInCSH(adminPage, adminStartPage, Constants.CaseTitleName);
        }         
    });

    ///<summary>
    /// Test Case 2045254: [Productivity Pane: Smart Assist] : Validate if KB and similar case sugestions are turned back on from CSH, it doesn't break
    ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045254
    ///<summary> 
    it("Test Case 2045254: [Productivity Pane: Smart Assist] : Validate if KB and similar case sugestions are turned back on from CSH, it doesn't break", async () => {
        agentPage = await agentContext.newPage();
        try 
        {
            //Login as admin and create case & TurnOffSuggestions
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub); 
            await macrosAdminPage.createCase(Constants.CaseTitleName);
            await macrosAdminPage.TurnOffSuggestions(adminPage, adminStartPage);  
            //Initiate session and validate
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName, Constants.CaseLink1);
            await macrosAdminPage.ValidateThePage(Constants.CloseSession1);
            await macrosAdminPage.ValidateThePage(Constants.Smartassist);
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub); 
            await macrosAdminPage.GoToServiceManagement();
            await macrosAdminPage.SetupSmartAssist();

            //validating simmilar suggestions and KB suggestions
            await macrosAdminPage.ValidateThePage(Constants.SimilarSuggestionsinCSH);
            await macrosAdminPage.ValidateThePage(Constants.KBSuggestionsinCSH);
            await macrosAdminPage.EnableSuggestionsInCSH();
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName, Constants.CaseLink1);
            await macrosAdminPage.ValidateThePage(Constants.CloseSession1);
            await macrosAdminPage.ValidateThePage(Constants.Smartassist);
        }
        finally
        {
            await macrosAdminPage.deleteCaseInCSH(adminPage, adminStartPage, Constants.CaseTitleName);
        }
});

    ///<summary>
    /// Test Case 2045263: [Productivity Pane: Smart Assist] : Verify Email content action worked
    ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045263
    ///<summary> 
    it("Test Case 2045263: [Productivity Pane: Smart Assist] : Verify Email content action worked", async () => {
        agentPage = await agentContext.newPage();
        try 
        {
            //Login as admin and create case
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.createCase(Constants.CaseTitleName);
            await macrosAdminPage.GoToServiceManagement();
            await macrosAdminPage.SetupSmartAssist();

            //validating simmilar suggestions and KB suggestions
            await macrosAdminPage.ValidateThePage(Constants.SimilarSuggestionsinCSH);
            await macrosAdminPage.ValidateThePage(Constants.KBSuggestionsinCSH);
            await macrosAdminPage.EnableSuggestionsInCSH();
            //Initiate session and validate
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName, Constants.CaseLink1);
            await macrosAdminPage.ValidateThePage(Constants.CloseSession1);
            await macrosAdminPage.ValidateThePage(Constants.ValKBSuggestionsinCSW);
            await macrosAdminPage.EmailContent();
            await macrosAdminPage.ValidateTheEmailBody(Constants.Email);
            await macrosAdminPage.ValidateThePage(Constants.NewMail);   
        }
        finally
        {
            await macrosAdminPage.deleteCaseInCSH(adminPage, adminStartPage, Constants.CaseTitleName);
        }
    });

    ///<summary>
    ///Test Case 1945699: [Multi Session] Verify Case creation along with timeline wall
    ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1945699
    ///<summary>       
    it("Test Case 1945699: [Multi Session] Verify Case creation along with timeline wall", async () =>{
        agentPage = await agentContext.newPage();
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        try
        {
            // Login as Admin and create case
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
            await macrosAdminPage.createCaseFromCSWSiteMap(Constants.CaseTitleName);
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName, Constants.CaseLink1);
            await macrosAdminPage.ValidateThePage(Constants.CaseStatusInProgress);
            await macrosAdminPage.ValidateTimeLine(Constants.CaseCreated);

            // Resolve Case and Validate the Page
            await macrosAdminPage.ResolvecaseAsInformation(Constants.ResolutionTypeInputField,Constants.AutomationResolutionField);
            await macrosAdminPage.ValidateThePage(Constants.CaseStatusInformationProvided);
            await macrosAdminPage.ValidateThePage(Constants.CaseResolved);
            await macrosAdminPage.ValidateTimeLine(Constants.CaseClosed);
            await macrosAdminPage.ValidateThePage(Constants.FormISReadonly);
            await macrosAdminPage.GoToMoreCommands();
            await macrosAdminPage.ValidateNotPresent(Constants.ResolveCaseBtn);
            await macrosAdminPage.ValidateNotPresent(Constants.CancleCaseBtn);

            // Reactivate Case and Validate it
            await macrosAdminPage.ReactivateCase();
            await macrosAdminPage.ValidateThePage(Constants.CaseStatusInProgress);
            await macrosAdminPage.ValidateTimeLine(Constants.ValidateReactivateCase);
            await macrosAdminPage.GoToMoreCommands();
            await macrosAdminPage.ValidateNotPresent(Constants.ReactivateBtn);

            // Cancle Case and validate it
            await macrosAdminPage.CancelCase();
            await macrosAdminPage.ValidateThePage(Constants.CaseStatusCancelled);
            await macrosAdminPage.ValidateTimeLine(Constants.CaseClosed);
            await macrosAdminPage.ValidateThePage(Constants.FormISReadonly);
            await macrosAdminPage.GoToMoreCommands();
            await macrosAdminPage.ValidateNotPresent(Constants.ResolveCaseBtn);
            await macrosAdminPage.ValidateNotPresent(Constants.CancleCaseBtn);

            // Reactivate Case and validate it
            await macrosAdminPage.ReactivateCase();
            await macrosAdminPage.ValidateThePage(Constants.CaseStatusInProgress);
            await macrosAdminPage.ValidateTimeLine(Constants.ValidateReactivateCase);
            await macrosAdminPage.GoToMoreCommands();
            await macrosAdminPage.ValidateNotPresent(Constants.ReactivateBtn);

            // Initiate Existing Session
            await macrosAdminPage.GoToHome();
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName, Constants.CaseLink1);
            await macrosAdminPage.ValidateThePage(Constants.CaseStatusInProgress);
            await macrosAdminPage.ValidateTimeLine(Constants.CaseCreated);

            // Resolve Case and validate it
            await macrosAdminPage.ResolvecaseAsInformation(Constants.ResolutionTypeInputField,Constants.AutomationResolutionField);
            await macrosAdminPage.ValidateThePage(Constants.CaseStatusInformationProvided);
            await macrosAdminPage.ValidateThePage(Constants.CaseResolved);
            await macrosAdminPage.ValidateTimeLine(Constants.CaseClosed);
            await macrosAdminPage.ValidateThePage(Constants.FormISReadonly);
            await macrosAdminPage.GoToMoreCommands();
            await macrosAdminPage.ValidateNotPresent(Constants.ResolveCaseBtn);
            await macrosAdminPage.ValidateNotPresent(Constants.CancleCaseBtn);

            // Reactivate case and validate it
            await macrosAdminPage.ReactivateCase();
            await macrosAdminPage.ValidateThePage(Constants.CaseStatusInProgress);
            await macrosAdminPage.ValidateTimeLine(Constants.ValidateReactivateCase);
            await macrosAdminPage.GoToMoreCommands();
            await macrosAdminPage.ValidateNotPresent(Constants.ReactivateBtn);

            // Cancle case and validate it
            await macrosAdminPage.CancelCase();
            await macrosAdminPage.ValidateThePage(Constants.CaseStatusCancelled);
            await macrosAdminPage.ValidateTimeLine(Constants.CaseClosed);
            await macrosAdminPage.ValidateThePage(Constants.FormISReadonly);
            await macrosAdminPage.GoToMoreCommands();
            await macrosAdminPage.ValidateNotPresent(Constants.ResolveCaseBtn);
            await macrosAdminPage.ValidateNotPresent(Constants.CancleCaseBtn);

            // Reactivate case and validate it
            await macrosAdminPage.ReactivateCase();
            await macrosAdminPage.ValidateThePage(Constants.CaseStatusInProgress);
            await macrosAdminPage.ValidateTimeLine(Constants.ValidateReactivateCase);
            await macrosAdminPage.GoToMoreCommands();
            await macrosAdminPage.ValidateNotPresent(Constants.ReactivateBtn);         
            await macrosAdminPage.GoToMoreCommands();

            // Clear TimeLine Part
            await macrosAdminPage.ClearTimeLine(Constants.ValidateReactivateCase);
            await macrosAdminPage.ClearTimeLine(Constants.CaseClosed);
            await macrosAdminPage.ClearTimeLine(Constants.ValidateReactivateCase);
            await macrosAdminPage.ClearTimeLine(Constants.CaseClosed);
        }
        finally
        {
            await macrosAdminPage.deleteCase(adminPage,adminStartPage,Constants.CaseTitleName);        
        }
    });   

    ///<summary>
    ///Test Case 2045183: [Application Setup] : Verify Queues in Customer WorkSpace App that are created in Customer Service Hub
    ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045183
    ///<summary>
    it("Test Case 2045183: [Application Setup] : Verify Queues in Customer WorkSpace App that are created in Customer Service Hub", async () =>{
        agentPage = await agentContext.newPage();
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        try
        {
            //Login as Admin
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);

            // Create a public Queue
            await macrosAdminPage.GoToServiceManagement();
            await macrosAdminPage.CreatePublicQueue(Constants.QueueTitle);
            await macrosAdminPage.GoToServices();

            // Create cases and add queue to that
            await macrosAdminPage.createCase(Constants.CaseTitleName);
            await macrosAdminPage.createCase(Constants.CaseTitleName2);
            await macrosAdminPage.createCase(Constants.CaseTitleName3);
            await macrosAdminPage.AddQueueToExistingCases(Constants.CaseTitleName, Constants.QueueTitle);  
            await macrosAdminPage.AddQueueToExistingCases(Constants.CaseTitleName2, Constants.QueueTitle);           
            await macrosAdminPage.AddQueueToExistingCases(Constants.CaseTitleName3, Constants.QueueTitle);
            
            // Navigating to CSW and validate the linked cases
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToCustomerServiceWorkspace();
            await macrosAdminPage.OpenCasesLinkedToQueue(Constants.QueueTitleText);
            await macrosAdminPage.ValidateThePage(Constants.CaseLink1);
            await macrosAdminPage.ValidateThePage(Constants.CaseLink2);
            await macrosAdminPage.ValidateThePage(Constants.CaseLink3);
        }
        finally
        {
            await macrosAdminPage.deleteCase(adminPage,adminStartPage,Constants.CaseTitleName);
            await macrosAdminPage.deleteCase(adminPage,adminStartPage,Constants.CaseTitleName2);
            await macrosAdminPage.deleteCase(adminPage,adminStartPage,Constants.CaseTitleName3);
            await macrosAdminPage.deleteQueue(adminPage,adminStartPage,Constants.QueueTitle);   
        }
    });

    ///<summary>
    ///Test Case 2045261: [Productivity Pane: Smart Assist] : Verify Copy URL action with appropriate contextual message
    ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045261
    ///<summary>
    it("Test Case 2045261: [Productivity Pane: Smart Assist] : Verify Copy URL action with appropriate contextual message", async () =>{
        agentPage = await agentContext.newPage();
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        try
        {
            // Login as Admin
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);

            // Enable Suggestions in CSH
            await macrosAdminPage.GoToServiceManagement();
            await macrosAdminPage.SetupSmartAssist();
            await macrosAdminPage.ValidateThePage(Constants.SimilarSuggestionsinCSH);
            await macrosAdminPage.ValidateThePage(Constants.KBSuggestionsinCSH);
            await macrosAdminPage.EnableSuggestionsInCSH();

            // Navigate to CSW and validate Suggestions
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToCustomerServiceWorkspace();
            await macrosAdminPage.CreateCaseInCSW(Constants.CaseTitleName, Constants.CasePriority);
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName, Constants.CaseLink1);
            await macrosAdminPage.ValidateThePage(Constants.ValKBSuggestionsinCSW);

            // Copy URL and validate it
            await macrosAdminPage.CopyURL();
            await macrosAdminPage.ValidateThePage(Constants.ProperMsgForCopyURL);
        }
        finally
        {
            await macrosAdminPage.deleteCase(adminPage,adminStartPage,Constants.CaseTitleName);
            await macrosAdminPage.TurnOffSuggestions(adminPage,adminStartPage);
        }
    });

    ///<summary>
    ///Test Case Test Case 2045196: [Navigation and Gestures] : Verifiy if records can be opened in line from views
    ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045196
    ///<summary>
    it("Test Case 2045196: [Navigation and Gestures] : Verifiy if records can be opened in line from views", async () =>{
        agentPage = await agentContext.newPage();
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        try
        {
            // Login as Admin and create a case
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.createCase(Constants.CaseTitleName);

            // Navigate to CSW and validate page
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToCustomerServiceWorkspace();
            await macrosAdminPage.GoToCases();
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName, Constants.CaseLink1);
            await macrosAdminPage.ValidateThePage(Constants.CloseSession1);
            await macrosAdminPage.ValidateThePage(Constants.CaseInTab);
        }
        finally
        {
            await macrosAdminPage.deleteCase(adminPage,adminStartPage,Constants.CaseTitleName);
        }
    });

    ///<summary>
    ///Test Case Test Case 2045258: [Productivity Pane: Smart Assist] : Verify focus is Returning to opened article when card is clicked again
    ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045258
    ///<summary>
    it("Test Case 2045258: [Productivity Pane: Smart Assist] : Verify focus is Returning to opened article when card is clicked again", async () =>{
        agentPage = await agentContext.newPage();
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        try
        {
            // Login as Admin
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);

            // Enable Suggestions in CSH
            await macrosAdminPage.GoToServiceManagement();
            await macrosAdminPage.SetupSmartAssist();
            await macrosAdminPage.ValidateThePage(Constants.SimilarSuggestionsinCSH);
            await macrosAdminPage.ValidateThePage(Constants.KBSuggestionsinCSH);
            await macrosAdminPage.EnableSuggestionsInCSH();

            // Navigate to CSW and validate suggestion
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
            await macrosAdminPage.CreateCaseInCSW(Constants.CaseTitleName, Constants.CasePriority);
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName, Constants.CaseLink1);
            await macrosAdminPage.ValidateThePage(Constants.ValKBSuggestionsinCSW);

            // Open Similar Cards and validate it
            await macrosAdminPage.OpenSimilarCard(Constants.OpenFirstCard);
            await macrosAdminPage.OpenSimilarCard(Constants.OpenSecondCard);
            await macrosAdminPage.ValidateThePage(Constants.FocusSecondCard);
            await macrosAdminPage.OpenSimilarCard(Constants.OpenFirstCard);
            await macrosAdminPage.ValidateThePage(Constants.FocusFirstCard);
        }
        finally
        {
            await macrosAdminPage.deleteCase(adminPage,adminStartPage,Constants.CaseTitleName);
            await macrosAdminPage.TurnOffSuggestions(adminPage,adminStartPage);
        }
    });

    ///<summary>
    ///Test Case Test Case 2669759: Verify new session can be initiate from the new case(empty case).
    ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2669759
    ///<summary>
    it("Test Case 2669759: Verify new session can be initiate from the new case(empty case).", async () =>{
        agentPage = await agentContext.newPage();
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        try{
            // login in as Admin
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);

            // create a case and validate it
            await macrosAdminPage.CreateCaseInCSW(Constants.CaseTitleName, Constants.CasePriority);
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName, Constants.CaseLink1);
            await macrosAdminPage.ValidateThePage(Constants.CloseSession1);

            // open empty case and validate it
            await macrosAdminPage.NewCaseFromNewSession();
            await macrosAdminPage.ValidateThePage(Constants.CloseEmptyCase);
        }
        finally{
            await macrosAdminPage.deleteCase(adminPage,adminStartPage,Constants.CaseTitleName);
        }
    });

    ///<summary>
    ///Test Case Test Case 2674539: Verify alwaysRender parameter for Third Party Website is supported.
    ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2674539
    ///<summary>
    it("Test Case 2674539: Verify alwaysRender parameter for Third Party Website is supported.", async () =>{
        agentPage = await agentContext.newPage();
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        try
        {
            // Login as Admin
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);

            // create a application tab and validate it
            await macrosAdminPage.GoToServiceManagement();
            await macrosAdminPage.CreateTabInApplicationTab(Constants.ThirdPartyWebsiteApplicationTab,Constants.ThirdPartyWebsiteApplicationTabUniqueName,Constants.ThirdPartyWebsiteOptionValue );
            await macrosAdminPage.AddParametersToAppTab(Constants.ParameterName, Constants.ParameterUniqueName, Constants.ValueAsTrue);
            await macrosAdminPage.ValidateThePage(Constants.ParameterAsAlwaysRender);
            await macrosAdminPage.SaveAndClose(Constants.SaveAndCloseButton);
        }  
        finally
        {
            await macrosAdminPage.DeleteApplicationTabInCSH(adminPage,adminStartPage,Constants.ThirdPartyWebsiteApplicationTab);
        }
    });

    ///<summary>
    ///Test Case 1945864: [Multi Session] Creation of Queue and able to add case/activities to queue and perform Queue operation(Route/ pick/Release/remove) with users (CSR & CSM)
    ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1945864s
    ///<summary>      
    it("Test Case 1945864: [Multi Session] Creation of Queue and able to add case/activities to queue and perform Queue operation(Route/ pick/Release/remove) with users (CSR & CSM)", async () =>{
        agentPage = await agentContext.newPage();
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        try
        {
            // //Login as Admin
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);

            //Create Private Queues
            await macrosAdminPage.GoToServiceManagement();
            await macrosAdminPage.CreatePrivateQueue(Constants.QueueTitle);
            await macrosAdminPage.CreatePrivateQueue(Constants.QueueTitle2);

            // navigate to CSW, add private queue and Validate it
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
            await macrosAdminPage.CreateCaseInCSW(Constants.CaseTitleName, Constants.CasePriority);
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName, Constants.CaseLink1);
            await macrosAdminPage.ValidateThePage(Constants.VerifyCreated);
            await macrosAdminPage.AddCaseToQueue(Constants.QueueTitle);
            await macrosAdminPage.QueueItemDetails();
            await macrosAdminPage.ValidateThePage(Constants.QueueLinkTitle);
            await macrosAdminPage.SaveAndClose(Constants.SaveAndCloseBtn2);
            await macrosAdminPage.ValidateTimeLine(Constants.QueueLinkTitle);

            // Create Task and add private queue to it
            await macrosAdminPage.GoToHome();
            await macrosAdminPage.CreateTask(Constants.TaskTitle);
            await macrosAdminPage.ValidateThePage(Constants.VerifyCreated);
            await macrosAdminPage.AddTaskToQueue(Constants.QueueTitle2);

            //Perform Operations on created Case
            await macrosAdminPage.GoToHome();
            await macrosAdminPage.OpenQueuesFromCWS(Constants.AllQueues);
            await macrosAdminPage.ValidateThePage(Constants.CaseLink1);
            await macrosAdminPage.SelectRow(Constants.CaseTitleName);
            await macrosAdminPage.ClickRouteOperation(Constants.QueueTitle2);
            await macrosAdminPage.ValidateThePage(Constants.QueueLinkTitle2);
            await macrosAdminPage.ClickOperation(Constants.Pick,Constants.ConfirmPickOperation);
            await macrosAdminPage.ValidateThePage(Constants.CSMOwner);
            await macrosAdminPage.ClickOperation(Constants.Release, Constants.ConfirmReleaseOperation);
            await macrosAdminPage.ValidateNotPresent(Constants.CSMOwner);
            await macrosAdminPage.ClickReleaseOperation(Constants.Remove, Constants.ConfirmRemoveOperation);
            await macrosAdminPage.ValidateNotPresent(Constants.CaseTitleName);

            //Perform Operations on Created Task
            await macrosAdminPage.ValidateThePage(Constants.TaskBtn);
            await macrosAdminPage.SelectRow(Constants.TaskTitle);
            await macrosAdminPage.ClickRouteOperation(Constants.QueueTitle);
            await macrosAdminPage.ValidateThePage(Constants.QueueLinkTitle);
            await macrosAdminPage.ClickOperation(Constants.Pick,Constants.ConfirmPickOperation);
            await macrosAdminPage.ValidateThePage(Constants.CSMOwner);
            await macrosAdminPage.ClickOperation(Constants.Release, Constants.ConfirmReleaseOperation);
            await macrosAdminPage.ValidateNotPresent(Constants.CSMOwner);
            await macrosAdminPage.ClickReleaseOperation(Constants.Remove, Constants.ConfirmRemoveOperation);
            await macrosAdminPage.ValidateNotPresent(Constants.TaskTitle);

            // Navigate to CSH and create Public queues
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.GoToServiceManagement();
            await macrosAdminPage.CreatePublicQueue(Constants.QueueTitle3);
            await macrosAdminPage.CreatePublicQueue(Constants.QueueTitle4);

            // Navigate to CSE and add public queue to Case
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
            await macrosAdminPage.CreateCaseInCSW(Constants.CaseTitleName2, Constants.CasePriority);
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName2, Constants.CaseLink2);
            await macrosAdminPage.ValidateThePage(Constants.VerifyCreated);
            await macrosAdminPage.AddCaseToQueue(Constants.QueueTitle3);
            await macrosAdminPage.QueueItemDetails();
            await macrosAdminPage.ValidateThePage(Constants.QueueLinkTitle3);
            await macrosAdminPage.SaveAndClose(Constants.SaveAndCloseBtn2);
            await macrosAdminPage.ValidateTimeLine(Constants.QueueLinkTitle3);

            // Create Task and add public queue
            await macrosAdminPage.GoToHome();
            await macrosAdminPage.CreateTask(Constants.TaskTitle2);
            await macrosAdminPage.ValidateThePage(Constants.VerifyCreated);
            await macrosAdminPage.AddTaskToQueue(Constants.QueueTitle4);

            //Perform operations on case
            await macrosAdminPage.GoToHome();
            await macrosAdminPage.OpenQueuesFromCWS(Constants.AllQueues);
            await macrosAdminPage.ValidateThePage(Constants.CaseLink2);
            await macrosAdminPage.SelectRow(Constants.CaseTitleName2);
            await macrosAdminPage.ClickRouteOperation(Constants.QueueTitle4);
            await macrosAdminPage.ValidateThePage(Constants.QueueLinkTitle4);
            await macrosAdminPage.ClickOperation(Constants.Pick,Constants.ConfirmPickOperation);
            await macrosAdminPage.ValidateThePage(Constants.CSMOwner);
            await macrosAdminPage.ClickOperation(Constants.Release, Constants.ConfirmReleaseOperation);
            await macrosAdminPage.ValidateNotPresent(Constants.CSMOwner);
            await macrosAdminPage.ClickReleaseOperation(Constants.Remove, Constants.ConfirmRemoveOperation);
            await macrosAdminPage.ValidateNotPresent(Constants.CaseTitleName2);

            //Perform Operations on Task
            await macrosAdminPage.ValidateThePage(Constants.TaskLinkTitle2);
            await macrosAdminPage.SelectRow(Constants.TaskTitle2);
            await macrosAdminPage.ClickRouteOperation(Constants.QueueTitle3);
            await macrosAdminPage.ValidateThePage(Constants.QueueLinkTitle3);
            await macrosAdminPage.ClickOperation(Constants.Pick,Constants.ConfirmPickOperation);
            await macrosAdminPage.ValidateThePage(Constants.CSMOwner);
            await macrosAdminPage.ClickOperation(Constants.Release, Constants.ConfirmReleaseOperation);
            await macrosAdminPage.ValidateNotPresent(Constants.CSMOwner);
            await macrosAdminPage.ClickReleaseOperation(Constants.Remove, Constants.ConfirmRemoveOperation);
            await macrosAdminPage.ValidateNotPresent(Constants.TaskTitle2);
        }
        finally
        {
            await macrosAdminPage.deleteCase(adminPage,adminStartPage,Constants.CaseTitleName);
            await macrosAdminPage.deleteCase(adminPage,adminStartPage,Constants.CaseTitleName2);
            await macrosAdminPage.deleteTask(adminPage,adminStartPage,Constants.TaskTitle);
            await macrosAdminPage.deleteTask(adminPage,adminStartPage,Constants.TaskTitle2);                                                                            
            await macrosAdminPage.deleteQueue(adminPage,adminStartPage,Constants.QueueTitle);   
            await macrosAdminPage.deleteQueue(adminPage,adminStartPage,Constants.QueueTitle2);                                                                               
            await macrosAdminPage.deleteQueue(adminPage,adminStartPage,Constants.QueueTitle3);   
            await macrosAdminPage.deleteQueue(adminPage,adminStartPage,Constants.QueueTitle4); 
        }
    });

    ///<summary>
    ///Test Case 2241691: [P.Tool Migration] Ensure all the productivity tools are disabled when productivity pane is turned off in APM
    /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2241691
    ///</summary>
    it("Test Case 2241691: [P.Tool Migration] Ensure all the productivity tools are disabled when productivity pane is turned off in APM", async () => {
        agentPage = await agentContext.newPage();
        try {
            //Login as admin and create case
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.createCase(Constants.CaseTitleName);

            //Create app profile and Add Users and Session
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToCustomerServiceAdmincenter();
            await macrosAdminPage.createAppProfile();
            await macrosAdminPage.AddUsers(Constants.User2);
            await macrosAdminPage.AddEntitySession(Constants.SessionTemplateinPowerApps);

            //Initiate session and Validate
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToCustomerServiceWorkspace();
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName, Constants.CaseLink1);
            await macrosAdminPage.ValidateThePage(Constants.NoProductivityPane);
        }
        finally {
            await macrosAdminPage.deleteAppProfile();
            await macrosAdminPage.deleteCase(adminPage, adminStartPage, Constants.CaseTitleName);
        }
    });

    ///<summary>
    ///Test Case 2241720: [P.Tool Migration] Initial panes state respects APM config pane mode and initial pane selection is the first enabled tool. Respect user behaviors once any app side panes are loaded.
    /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2241720
    ///</summary>
    it("Test Case 2241720: [P.Tool Migration] Initial panes state respects APM config pane mode and initial pane selection is the first enabled tool. Respect user behaviors once any app side panes are loaded.", async () => {
        agentPage = await agentContext.newPage();
        try {
            //Login as admin and create case
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.createCase(Constants.CaseTitleName);

            ////Create app profile and Add Users and Session
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToCustomerServiceAdmincenter();
            await macrosAdminPage.createAppProfile();
            await macrosAdminPage.AddUsers(Constants.User2);
            await macrosAdminPage.AddEntitySession(Constants.SessionTemplateinPowerApps);
            await macrosAdminPage.EnableOneAppsInProductivityPane();

            //Initiate session and validate
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToCustomerServiceWorkspace();
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName, Constants.CaseLink1);
            await macrosAdminPage.ValidateThePage(Constants.AStool);
        }
        finally {
            await macrosAdminPage.deleteAppProfile();
            await macrosAdminPage.deleteCase(adminPage, adminStartPage, Constants.CaseTitleName);
        }
    });

    ///<summary>
    ///Test Case 2245423: [P.Tool Migration] Ensure the productivity tools cannot be closed
    /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2245423
    ///</summary>
    it("Test Case 2245423: [P.Tool Migration] Ensure the productivity tools cannot be closed", async () => {
        agentPage = await agentContext.newPage();
        try {
            //Login as admin and create case
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.createCase(Constants.CaseTitleName);

            //Create app profile and Add Users and Session
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToCustomerServiceAdmincenter();
            await macrosAdminPage.createAppProfile();
            await macrosAdminPage.AddUsers(Constants.User2);
            await macrosAdminPage.AddEntitySession(Constants.SessionTemplateinPowerApps);
            await macrosAdminPage.ProductivityPane();

            //Initiate session and validate
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToCustomerServiceWorkspace();
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName, Constants.CaseLink1);
            await macrosAdminPage.ValidateThePage(Constants.ProductivityPaneEnable);
            await macrosAdminPage.ClickProductivityPaneTool(Constants.AStool);
            await macrosAdminPage.ValidateThePage(Constants.AStool);
            await macrosAdminPage.ClickProductivityPaneTool(Constants.KStool);
            await macrosAdminPage.ValidateThePage(Constants.KStool);

            //delete app profile
            await macrosAdminPage.deleteAppProfile();

            //Create new app profile
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToCustomerServiceAdmincenter();
            await macrosAdminPage.createAppProfile();
            await macrosAdminPage.AddUsers(Constants.User2);
            await macrosAdminPage.AddEntitySession(Constants.SessionTemplateinPowerApps);
            await macrosAdminPage.EnableOneAppsInProductivityPane();

            //Initiate session and validate
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToCustomerServiceWorkspace();
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName, Constants.CaseLink1);
            await macrosAdminPage.ValidateThePage(Constants.AStool);
        }
        finally {
            await macrosAdminPage.deleteAppProfile();
            await macrosAdminPage.deleteCase(adminPage, adminStartPage, Constants.CaseTitleName);
        }
    });

    ///<summary>
    ///Test Case 2245437: [P.Tool Migration] Ensure the specific productivity tools that are disabled in APM are not displayed in CSW app.
    /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2245437
    ///</summary>
    it("Test Case 2245437: [P.Tool Migration] Ensure the specific productivity tools that are disabled in APM are not displayed in CSW app.", async () => {
        agentPage = await agentContext.newPage();
        try {
            //Login as admin and create case
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.createCase(Constants.CaseTitleName);

            //Create app profile and Add Users and Session
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToCustomerServiceAdmincenter();
            await macrosAdminPage.createAppProfile();
            await macrosAdminPage.AddUsers(Constants.User2);
            await macrosAdminPage.AddEntitySession(Constants.SessionTemplateinPowerApps);
            await macrosAdminPage.EnableTwoAppsInProductivityPane();


            //Initiate session and validate
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToCustomerServiceWorkspace();
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName, Constants.CaseLink1);
            await macrosAdminPage.ValidateThePage(Constants.SAtool);
            await macrosAdminPage.ValidateThePage(Constants.AStool);
        }
        finally {
            await macrosAdminPage.deleteAppProfile();
            await macrosAdminPage.deleteCase(adminPage, adminStartPage, Constants.CaseTitleName);
        }
    });

    ///<summary>
    ///Test Case 2245445: [P.Tool Migration] Ensure app side pane rail is still rendered even if there is only one pane loaded.
    /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2245445
    ///</summary>
    it("Test Case 2245445: [P.Tool Migration] Ensure app side pane rail is still rendered even if there is only one pane loaded.", async () => {
        agentPage = await agentContext.newPage();
        try {
            //Login as admin and create case
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.createCase(Constants.CaseTitleName);

            //Create app profile and Add Users and Session
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToCustomerServiceAdmincenter();
            await macrosAdminPage.createAppProfile();
            await macrosAdminPage.AddUsers(Constants.User2);
            await macrosAdminPage.AddEntitySession(Constants.SessionTemplateinPowerApps);
            await macrosAdminPage.EnableOneAppsInProductivityPane();

            //Initiate session and validate
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToCustomerServiceWorkspace();
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName, Constants.CaseLink1);
            await macrosAdminPage.ValidateThePage(Constants.AStool);
        }
        finally {
            await macrosAdminPage.deleteAppProfile();
            await macrosAdminPage.deleteCase(adminPage, adminStartPage, Constants.CaseTitleName);
        }
    });

    ///<summary>
    ///Test Case 2271691: [P.Tool Migration] Teams control integration: Teams is not hidden on home session where its collapsed/expanded state respects APM pane mode.
    /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2271691
    ///</summary>
    it("Test Case 2271691: [P.Tool Migration] Teams control integration: Teams is not hidden on home session where its collapsed/expanded state respects APM pane mode.", async () => {
        agentPage = await agentContext.newPage();
        try {
            //Login as admin and create case
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.createCase(Constants.CaseTitleName);

            //Create app profile and Add Users and Session
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToCustomerServiceAdmincenter();
            await macrosAdminPage.createAppProfile();
            await macrosAdminPage.AddUsers(Constants.User2);
            await macrosAdminPage.AddEntitySession(Constants.SessionTemplateinPowerApps);
            await macrosAdminPage.EnableMSTeamsAppsInProductivityPane();

            //Initiate session and validate
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToCustomerServiceWorkspace();
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName, Constants.CaseLink1);
            await macrosAdminPage.ValidateThePage(Constants.MSTeamstool);
        }
        finally {
            await macrosAdminPage.deleteAppProfile();
            await macrosAdminPage.deleteCase(adminPage, adminStartPage, Constants.CaseTitleName);
        }
    });

    ///<summary>
    ///Test Case 2040740: Verify If KB search is disabled on productivity pane from app profiler, it should not appear for agent
    ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2040740
    ///</summary>
    it("Test Case 2040740: Verify If KB search is disabled on productivity pane from app profiler, it should not appear for agent", async () =>{
        agentPage = await agentContext.newPage();
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        try
        {
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);

            //Creating App Profile
            await macrosAdminPage.createAppProfile();
            await macrosAdminPage.AddUsers(Constants.User);
            await macrosAdminPage.EnableTwoAppsInProductivityPane();
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToCustomerServiceWorkspace();
            await macrosAdminPage.CreateCaseInCSW(Constants.CaseTitleName, Constants.CasePriority);
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName, Constants.CaseLink1);
            await macrosAdminPage.ValidateNotPresent(Constants.KStool);
        }
        finally
        {
            await macrosAdminPage.deleteCase(adminPage,adminStartPage, Constants.CaseTitleName);
        }
    });

    ///<summary>
    ///Test Case 1968342: Verify default app profile associated for a user with default OC Agent/OC Supervisor
    ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1968342
    ///</summary>
    it("Test Case 1968342: Verify default app profile associated for a user with default OC Agent/OC Supervisor", async () =>{
        agentPage = await agentContext.newPage();
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        try
        {
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.OmnichannelCustomerservice);
            
            //Validating Dashboard
            await macrosAdminPage.ValidateDashboard(Constants.OmnichannelAgentDashBoard);
            await macrosAdminPage.ValidateThePage(Constants.OmnichannelOngoingConversationDashBoard);
            await macrosAdminPage.ValidateThePage(Constants.OmnichannelIntradayInsightsDashboard);
        }
        finally
        {
            console.log("validation Successfully");
        }
    });

    ///<summary>
    ///Test Case 1968344: Verify default app profile associated for a user with default OC agent/OC supervisor/CSR/CSM role
    ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1968344
    ///</summary>
    it("Test Case 1968344: Verify default app profile associated for a user with default OC agent/OC supervisor/CSR/CSM role", async () =>{
        agentPage = await agentContext.newPage();
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        try
        {
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.OmnichannelCustomerservice);

            //Validating Dashboard
            await macrosAdminPage.ValidateDashboard(Constants.OmnichannelAgentDashBoard);
            await macrosAdminPage.ClickDropDown(Constants.DashboardSelector);
            await macrosAdminPage.ValidateDashboard(Constants.CustomerServiceRepresentativeDashBoard);
            await macrosAdminPage.ValidateNotPresent(Constants.OmnichannelSupervisorDashboard);
            await macrosAdminPage.ValidateDashboard(Constants.OmnichannelAgentDashBoard);
            await macrosAdminPage.ValidateDashboard(Constants.CustomerServiceManagerDashBoard);
            await macrosAdminPage.ValidateDashboard(Constants.OmnichannelOngoingConversationsDashboard);
        }
        finally
        {
            console.log("validation Successfully");
        }
    });

    ///<summary>
    ///Test Case 1942196: [Multi Session][Productivity Pane][Similar Cases] Adaptive cards correctly displayed
    ///Test Case Link: https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1942196
    ///</summary>
    it("Test Case 1942196: [Multi Session][Productivity Pane][Similar Cases] Adaptive cards correctly displayed", async () =>{
        agentPage = await agentContext.newPage();
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        try{
            //Login as admin and create case
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.createCase(Constants.CaseTitleName);

            //Initiate Session and Validate
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToCustomerServiceWorkspace();
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName, Constants.CaseLink1);
            await macrosAdminPage.ValidateTheStausOwnerTitleConfidenceAndResolution();
        }
        finally {
            await macrosAdminPage.deleteCaseInCSH(adminPage, adminStartPage, Constants.CaseTitleName);
        }  
    });

    ///<summary>
    ///Test Case 2045253: [Productivity Pane: Smart Assist] : Validate if KB and similar case sugestions are turned off from CSH, message is shown on smart assist
    ///Test Case Link: https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045253
    ///</summary>
    it("Test Case 1942196: Test Case 2045253: [Productivity Pane: Smart Assist] : Validate if KB and similar case sugestions are turned off from CSH, message is shown on smart assist", async () =>{
        agentPage = await agentContext.newPage();        
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        try{
            //Login as admin and create case
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.createCase(Constants.CaseTitleName);
            await macrosAdminPage.TurnOffSuggestions(adminPage, adminStartPage);

            //Initiate Session and Validate
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToCustomerServiceWorkspace();
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName, Constants.CaseLink1);
            await macrosAdminPage.VerifySuggestionsInCSW();
        }
        finally {
            await macrosAdminPage.deleteCaseInCSH(adminPage, adminStartPage, Constants.CaseTitleName);
            await macrosAdminPage.TurnOnSuggestions();
        }  
    });

    ///<summary>
    ///Test Case 2045280: [Productivity Pane: Smart Assist] : Verify Copy resolution action with appropriate contextual message
    ///Test Case Link: https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045280
    ///</summary>
    it("Test Case 2045280: [Productivity Pane: Smart Assist] : Verify Copy resolution action with appropriate contextual message", async () =>{
        agentPage = await agentContext.newPage();
        const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        const agentChat = new AgentChat(agentPage);
        const agentScriptAdminPage = new AgentScript(adminPage);
        try{
            //Login as admin and create case
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.createCase(Constants.CaseTitleName);

            //Initiate Session and Validate
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToCustomerServiceWorkspace();
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName, Constants.CaseLink1);
            await macrosAdminPage.VerifyCopyResolution();
        }
        finally {
            await macrosAdminPage.deleteCaseInCSH(adminPage, adminStartPage, Constants.CaseTitleName);
        }  
    });

    ///<summary>
    ///Test Case 1577436: Verify Admin is able to configure agent scripts
    /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1577436
    ///</summary>
    it("Test Case 1577436: Verify Admin is able to configure agent scripts", async () => {
        agentPage = await agentContext.newPage();
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        try {
            //Login as admin and create macro
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
            await macrosAdminPage.createMacro(Constants.SearchPhraseForPopulatedPhrase);
            await macrosAdminPage.createAgentScriptWithoutSteps(Constants.AgentscriptName2, Constants.AgentScriptUniqueName2);
            await macrosAdminPage.createAgentScriptforMultipleSteps(Constants.AgentScriptName1,Constants.AgentScriptUniqueName1,Constants.SearchPhraseForPopulatedPhrase,Constants.SelectOptionText, Constants.SelectOptionScript);
            //Validating The Title of Application Tab by running the Macro
            const VisibleAgentScriptSteps=await macrosAdminPage.ValidateStepsinAgentScript(adminPage,Constants.AgentScriptName1);
            expect(VisibleAgentScriptSteps).toBeTruthy();
        }
        finally {
            await macrosAdminPage.deleteAgentScript(Constants.AgentScriptName1);
            await macrosAdminPage.deleteAgentScriptwithoutSteps(Constants.AgentscriptName2);
            await macrosAdminPage.deleteMacro(adminStartPage, Constants.SearchPhraseForPopulatedPhrase);
        }
    });

    ///<summary>
    ///Test Case 2464836: Verify additional tabs with the Entity List defined in session template can be opened.
    /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_testPlans/execute?planId=2555818&opId=3594&suiteId=2555823
    ///</summary>
    it("Test Case 2464836: Verify additional tabs with the Entity List defined in session template can be opened.", async () => {
        agentPage = await agentContext.newPage();
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
    try {
        //Login as admin
        await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
        await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
        await macrosAdminPage.createApplicationTab(Constants.EntityListApplicationTab, Constants.EntityListApplicationTabUniqueName, Constants.EntityListOptionValue);
        await macrosAdminPage.insertEntityListParameters();
        await macrosAdminPage.createEntitySessionTemplate();
        await macrosAdminPage. addAppTabtoSession(Constants.EntityListApplicationTab, Constants.ApplicationTabSearchResult);

        //Create App Profile and Add User
        await macrosAdminPage.createAppProfile();
        await macrosAdminPage.AddUsers(Constants.User);
        await macrosAdminPage.AddEntitySession(Constants.SessionTemplateinPowerApps);
        await macrosAdminPage.ProductivityPane();
        await macrosAdminPage.openAppLandingPage(adminPage);
        await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
        await macrosAdminPage.createCase(Constants.CaseTitleName);

        //Validate the App Profile
        await macrosAdminPage.openAppLandingPage(adminPage);
        await adminStartPage.goToCustomerServiceWorkspace();
        
        //Validating The Title of Application Tab by running the Macro
        const VisibleResult=await macrosAdminPage.ValidateAppTab(adminPage,Constants.AccountAppTab);
        expect(VisibleResult).toBeTruthy();

        //Adding slugs in application Tab templates
        await macrosAdminPage.AddSlugToEntityListAppTab(adminStartPage);

        //Validating The Slug
        await macrosAdminPage.openAppLandingPage(adminPage);
        await adminStartPage.goToCustomerServiceWorkspace();
        const VisibleSlug=await macrosAdminPage.ValidateAppTab(adminPage,Constants.AccountAppTab);
        expect(VisibleSlug).toBeTruthy();
    }
    finally {
        await macrosAdminPage.deleteCase(adminPage, adminStartPage, Constants.AutomationCaseTitle);
        await macrosAdminPage.deleteApplicationTabWithCSAdminCenter(adminStartPage, Constants.EntityListApplicationTab);
        await macrosAdminPage.deleteSessionTemplate(Constants.SessionTemplateName);
        await macrosAdminPage.deleteAppProfile();
    }
    });

    ///<summary>
    ///Test Case 2045304: [Productivity Pane: Agent Guidance] : Validate if knowledge search control turn off in APM, it will disappear in PP.
    /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045304
    ///</summary>
    it("Test Case 2045304: [Productivity Pane: Agent Guidance] : Validate if knowledge search control turn off in APM, it will disappear in PP.", async () => {
        agentPage = await agentContext.newPage();
        try {
            //Login as admin and create case
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.createCase(Constants.CaseTitleName);

            //Initiate session and validate
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToCustomerServiceWorkspace();
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName, Constants.CaseLink1);
            await macrosAdminPage.ValidateThePage(Constants.KStool);

            //Create Profile and disable KB search
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToCustomerServiceAdmincenter();
            await macrosAdminPage.createAppProfile();
            await macrosAdminPage.AddUsers(Constants.User2);
            await macrosAdminPage.AddEntitySession(Constants.SessionTemplateinPowerApps);
            await macrosAdminPage.EnableTwoAppsInProductivityPane();

            //Initiate session and validate
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToCustomerServiceWorkspace();
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName, Constants.CaseLink1);
            const NoKSTool = await macrosAdminPage.verifyOpenedTab(agentPage, Constants.KStool);
            expect(NoKSTool).toBeTruthy();
        }
        finally {
            await macrosAdminPage.deleteCase(adminPage, adminStartPage, Constants.CaseTitleName);
        }
    });

    ///<summary>
    ///Test Case 2045302: [Productivity Pane: Agent Guidance] : Validate knowledge search control in both case session and conversation session (actions are slightly different)
    /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045302
    ///</summary>
    it("Test Case 2045302: [Productivity Pane: Agent Guidance] : Validate knowledge search control in both case session and conversation session (actions are slightly different)", async () => {
        agentPage = await agentContext.newPage();
        const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        const agentChat = new AgentChat(agentPage);
        try {
            //Login as admin and create case
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.createCase(Constants.CaseTitleName);

            //Initiate session and validate kb search
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToCustomerServiceWorkspace();
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName, Constants.CaseLink1);
            await macrosAdminPage.ClickProductivityPaneTool(Constants.KStool);
            await macrosAdminPage.ValidateThePage(Constants.KStool);
            await macrosAdminPage.ValidateThePage(Constants.KSLinkBtn);
            await macrosAdminPage.MoreActions();
            await macrosAdminPage.ValidateThePage(Constants.CopyURL);
            await macrosAdminPage.ValidateThePage(Constants.EmailURL);
            await macrosAdminPage.ValidateThePage(Constants.EmailContent);

            //Login as agent and accept chat
            await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(agentStartPage, agentChat);
            await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);
            await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);

            //validate kb search
            const KbSearch=await macrosAdminPage.OpenKbSearchAndValidate(agentPage);
            expect(KbSearch).toBeTruthy();

            //Closing Chat
            await macrosAdminPage.closeConversation(agentPage, agentChat);
            await liveChatPage.closeChat();
        }
        finally {
            await macrosAdminPage.deleteCase(adminPage, adminStartPage, Constants.CaseTitleName);
        }
    });

    ///<summary>
    ///Test Case 1577428: Verify Admin of the company can configure the custom activities to be tracked as part of user navigation and those would be listed in the navigation tab.
    /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1577428
    ///</summary>
    it("Test Case 1577428: Verify Admin of the company can configure the custom activities to be tracked as part of user navigation and those would be listed in the navigation tab.", async () => {
        agentPage = await agentContext.newPage();
        const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        const agentChat = new AgentChat(agentPage);
        try {
            //Login as admin and create case
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
        
             //Login as agent and accept chat
             await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(agentStartPage, agentChat);
             await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);
             await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);

            //Closing Chat
            await macrosAdminPage.closeConversation(agentPage, agentChat);
            await liveChatPage.closeChat();
            await macrosAdminPage.OpenClosedItem(agentChat);
            await macrosAdminPage.ValidateThePage(Constants.History);
        }
        finally {
            console.log("validation Successfully");
        }
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
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);

            //Login as agent and accept chat and validate
            await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(agentStartPage, agentChat);
            await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);
            await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);
            await macrosAdminPage.ValidateThePage(Constants.AStool); 
            await macrosAdminPage.ValidateThePage(Constants.SAtool); 
            await macrosAdminPage.ValidateThePage(Constants.KStool); 

            //Closing Chat
            await macrosAdminPage.closeConversation(agentPage, agentChat);
            await liveChatPage.closeChat();

            //Create new app profile
            await adminStartPage.goToCustomerServiceAdmincenter();
            await macrosAdminPage.createAppProfile();
            await macrosAdminPage.AddUsers(Constants.User2);
            await macrosAdminPage.AddEntitySession(Constants.SessionTemplateinPowerApps);
            await macrosAdminPage.ProductivityPane();

            //Login as agent and accept chat and validate
            await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(agentStartPage, agentChat);
            await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);
            await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);
            await macrosAdminPage.ValidateThePage(Constants.AStool); 
            await macrosAdminPage.ValidateThePage(Constants.SAtool); 
            await macrosAdminPage.ValidateThePage(Constants.KStool); 
        }
        finally {
            await macrosAdminPage.closeConversation(agentPage, agentChat);
            await liveChatPage.closeChat();
        }
    });   
         
    ///<summary>
    ///Test Case 1846842: [Missed Notification] Verify that Agent presence does not change to "Inactive" if Missed notifications settings is turned off and agent misses a notification
    /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1846842
    ///</summary>
    it("Test Case 1846842: [Missed Notification] Verify that Agent presence does not change to Inactive if Missed notifications settings is turned off and agent misses a notification", async () => {
        agentPage = await agentContext.newPage();
        const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        const agentChat = new AgentChat(agentPage);
        try
        {
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
            await macrosAdminPage.TurnOnMissedNotifications();

            //Initiate live chat with agent
            await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);

            //Login as agent and accept chat
            await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(agentStartPage, agentChat);
            
            //End live chat
            await liveChatPage.closeChat();  
        }
        finally
        {
            console.log("validation Successfully");   
        }
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
        try
        {
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
            await macrosAdminPage.TurnOnMissedNotifications();
            //Initiate live chat with agent
            await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);

            //Login as agent and accept chat
            await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(agentStartPage, agentChat);
            await macrosAdminPage.StatusPresence(agentChat);

            //End live chat
            await liveChatPage.closeChat();  
        }
        finally
        {
            console.log("validation Successfully");
        }
    });

    ///<summary>
    ///Test Case 1945661: [Multi Session] Verify Routing Rule on Case Form.
    ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1945661
    ///<summary>      
    it("Test Case 1945661: [Multi Session] Verify Routing Rule on Case Form.", async () =>{
        agentPage = await agentContext.newPage();
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        try
        {
            //Login as Admin and create public queue and routing rule
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.GoToServiceManagement();
            await macrosAdminPage.CreatePublicQueue(Constants.QueueTitle);
            await macrosAdminPage.CreateRoutingRole(Constants.RuleName,Constants.RuleItemName,Constants.QueueTitle);
           

            // Navigate to CSW and create case
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToCustomerServiceWorkspace();
            await macrosAdminPage.createCaseFromCSWSiteMap(Constants.CaseTitleName);
            await macrosAdminPage.AddPriorityToCase();

            // Save and Route the case and validate it
            await macrosAdminPage.SaveAndRoute(Constants.CaseTitleName,Constants.CaseLink1);
            await macrosAdminPage.ValidateTimeLine(Constants.QueueLinkTitle);
            await macrosAdminPage.GoToHome();
            await macrosAdminPage.InitiateTab(Constants.CaseTitleName, Constants.CaseLink1);
            await macrosAdminPage.ValidateTimeLine(Constants.QueueLinkTitle);
            await macrosAdminPage.SaveAndRouteInTab();
            await macrosAdminPage.ValidateTimeLine(Constants.QueueLinkTitle);
        }
        finally
        {
            await macrosAdminPage.deleteRoutingRule(adminPage,adminStartPage,Constants.RuleName);  
            await macrosAdminPage.deleteCase(adminPage,adminStartPage,Constants.CaseTitleName);                   
            await macrosAdminPage.deleteQueue(adminPage,adminStartPage,Constants.QueueTitle);   
        }
    });

    ///<summary>
    ///Test Case 2662215: Verify tab info from Context post Refresh Session Context Macro Action.
    ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2662215
    ///<summary> 
    it("Test Case 2662215: Verify tab info from Context post Refresh Session Context Macro Action.", async () =>{
        agentPage = await agentContext.newPage();
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        try
        {
            // Login As Admin and create macro
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
            await macrosAdminPage.createResolveSessionMacro(Constants.RefreshSessionContextTitle, Constants.IncidentID);
            
            // Create AgentScript and Add Macro to it's agentScript step
            await macrosAdminPage.AgentScriptInCSAdminCenter(Constants.AgentScriptName,Constants.AgentScriptUniqueName);
            await macrosAdminPage.AgentScriptStep(Constants.AgentScriptStepName2,Constants.AgentscriptUniquename,Constants.RefreshSessionContextTitle);
            
            // Create Session and Add agentscript to it
            await macrosAdminPage.SessionInCSAdminCenter(Constants.SessionTemplateName,Constants.SessionTemplateUniqueName);
            await macrosAdminPage.AddAgentScriptToSession(Constants.AgentScriptName);
            
            // Create AppProfile and Add user,session and enable PT
            await macrosAdminPage.createAppProfile();
            await macrosAdminPage.AddUsers(Constants.CRMUser);
            await macrosAdminPage.AddSessionToProfile(Constants.SessionNameType);
            await macrosAdminPage.ProductivityPane();
            
            // Navigate to CSH and create Cases
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.createCase(Constants.CaseTitleName);
            await macrosAdminPage.createCase(Constants.CaseTitleName2);
            
            // Navigate to CSW, initiate session, run macro and validate it.
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
            await macrosAdminPage.GoToCases();
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName, Constants.CaseLink1);
            await macrosAdminPage.ClickProductivityPaneTool(Constants.AStool);
            await macrosAdminPage.RunMacro();
            await macrosAdminPage.ValidateThePage(Constants.ResolveStatemant);
            await macrosAdminPage.GoToCases();
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName2, Constants.CaseLink2);
            await macrosAdminPage.RunMacro();
            await macrosAdminPage.ValidateThePage(Constants.ResolveStatemant);
        }
        finally
        {
            await macrosAdminPage.deleteAgentScript(Constants.AgentScriptName);
            await macrosAdminPage.DeleteSession(adminPage,adminStartPage,Constants.SessionTemplateName);
            await macrosAdminPage.deleteMacro(adminStartPage,Constants.RefreshSessionContextTitle);
            await macrosAdminPage.DeleteAppProfile(adminPage,adminStartPage,Constants.Name);
        }
    });

    ///<summary>
    ///Test Case 2367015: [Macros] Verify cloning of current record by using 'Clone current record' action in the Productivity Automation.
    ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2367015
    ///<summary> 
    it("Test Case 2367015: [Macros] Verify cloning of current record by using 'Clone current record' action in the Productivity Automation.", async () =>{
        agentPage = await agentContext.newPage();
        const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        const agentChat = new AgentChat(agentPage);
        try
        {
            // Login As Admin and create macro
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.OmnichannelAdminCenterApp);
            await macrosAdminPage.CreateCloneCurrentMacro(Constants.CloneCurrentMacro,Constants.RecordName);
            macrosAdminPage.AddAgentScriptToSession(Constants.AgentScriptName);

            // Initiate live chat with agent
            await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);

            //Login as agent and accept chat
            await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(agentStartPage, agentChat);
            await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);

            const result = await agentPage.evaluate(async () => {
                const ctrl = await (window as any).Microsoft.ProductivityMacros.runMacro("CloneCurrentMacro");
                return ctrl;
            });
            expect(result).toBe(Constants.ActionPerformedSuccessfully);

            //Check API result on UI
            const relevenceSearchResult = await macrosAdminPage.verifyOpenedTab(agentPage, Constants.NewConversation);
            expect(relevenceSearchResult).toBeTruthy();

            //End live chat
            await macrosAdminPage.closeConversation(agentPage, agentChat);
            await liveChatPage.closeChat();
            }
        finally
        {
            await macrosAdminPage.deleteMacro(adminStartPage,Constants.CloneCurrentMacro);
        }
    });

    //<summary>
    ///Test Case 2045177: [Application Setup] : Verify if site map entries are available
    ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045177
    ///<summary> 
    it("Test Case 2045177: [Application Setup] : Verify if site map entries are available.", async () =>{
        agentPage = await agentContext.newPage();
        try
        {
            // Login As Admin
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            
            // Open App Designer and Validate Page
            await adminStartPage.goToCSWAppDesigner();
            await macrosAdminPage.SiteMapInAppDesigner();
            await macrosAdminPage.ValidateAppDesigner(Constants.DashboardDesignerEntity);
            await macrosAdminPage.ValidateAppDesigner(Constants.AccountsDesignerEntity);
            await macrosAdminPage.ValidateAppDesigner(Constants.CasesDesignerEntity);
 
            // Go To CSW and validate the page
            await macrosAdminPage.GoToLandingPage();
            await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
            await macrosAdminPage.OpenSiteMapInCSW();
            await macrosAdminPage.ValidateThePage(Constants.DashboardRunTimeEntity);
            await macrosAdminPage.ValidateThePage(Constants.AccountsRunTimeEntity);
            await macrosAdminPage.ValidateThePage(Constants.CasesRunTimeEntity);
        }
        finally
        {
            console.log("validation Successfully");
        }
    });

    ///<summary>
    ///Test Case 1577427: Verify Agent can see the user navigation history in the customer summary > under Navigation tab.
    ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1577427
    ///</summary>
    it("Test Case 1577427: Verify Agent can see the user navigation history in the customer summary > under Navigation tab", async () =>{
        agentPage = await agentContext.newPage();
        const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        const agentChat = new AgentChat(agentPage);
        try
        {
            await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);
            //Login as agent and accept chat
            await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(agentStartPage, agentChat);
            await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);
            await macrosAdminPage.closeConversation(agentPage, agentChat);
            await liveChatPage.closeChat();
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.OmnichannelCustomerservice);
            await macrosAdminPage.openClosedWorkItems();
            await macrosAdminPage.ValidateThePage(Constants.History);
            await macrosAdminPage.ValidateThePage(Constants.Transcript);
        }    
        finally
        {
            console.log("validation Successfully");
        }
    });

    ///<summary>
    ///Test Case 2045176: [Application Setup] : Verify if app allows access only to system administrator and system customizers
    /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045176
    ///</summary>
    it("Test Case 2045176: [Application Setup] : Verify if app allows access only to system administrator and system customizers", async () => {
        agentPage = await agentContext.newPage();
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        try
        {
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToCSWAppDesigner();
            await macrosAdminPage.ValidateAppDesigner(Constants.ValCSWDesignerPage);
            await macrosAdminPage.GoToLandingPage();
            await adminStartPage.goToCSWManageRoles();
            await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
            await macrosAdminPage.ValidateThePage(Constants.ValidateCSW);
            await macrosAdminPage.ValidateThePage(Constants.Home);
            await macrosAdminPage.ValidateThePage(Constants.CustomerServiceAgentDashboard);
        }
        finally
        {
            console.log("validation Successfully");
        }
    });

    ///<summary>
    ///Test Case 2045193: [Navigation and Gestures] : Verify if records can be opened as tabs from queue views
    ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045193
    ///<summary> 
    it("Test Case 2045193: [Navigation and Gestures] : Verify if records can be opened as tabs from queue views", async () =>{
        agentPage = await agentContext.newPage();
        try
        {
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);

            // Create a public Queue
            await macrosAdminPage.GoToServiceManagement();
            await macrosAdminPage.CreatePublicQueue(Constants.QueueTitle);
            await macrosAdminPage.GoToServices();
            await macrosAdminPage.createCase(Constants.CaseTitleName);
            await macrosAdminPage.AddQueueToExistingCases(Constants.CaseTitleName, Constants.QueueTitle); 
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToCustomerServiceWorkspace();
            await macrosAdminPage.casesLinkedToQueue(Constants.QueueTitleText); 
            await macrosAdminPage.ValidateThePage(Constants.CaseLink1);
        }
        finally
        {   
            await macrosAdminPage.deleteCase(adminPage,adminStartPage,Constants.CaseTitleName);
            await macrosAdminPage.deleteQueue(adminPage,adminStartPage,Constants.QueueTitle); 
        }
    });

    ///<summary>
    ///Test Case 1968349: Verify admin E2E experience in configuring Channel provider tab for an app profile
    ///Test Case Link  https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1968349
    ///<summary>        
    it("Test Case 1968349: Verify admin E2E experience in configuring Channel provider tab for an app profile", async () => {
        agentPage = await agentContext.newPage();
        try
        {
            //Login as admin and create two cases and initiate it and verify
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
            await macrosAdminPage.createAppProfile();
            await macrosAdminPage.createChannel();
            await macrosAdminPage.thirdPartyChannel();
        }
        finally
        {   
            console.log("validation Successfully"); 
        }
    });

    ///<summary>
    ///Test Case 1968350: Verify default values present in an OOTB OC app profile
    ///Test Case Link  https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1968350
    ///<summary>        
    it("Test Case 1968350: Verify default values present in an OOTB OC app profile", async () => {
        agentPage = await agentContext.newPage();
        try
        {
            //Login as admin and create two cases and initiate it and verify
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
            await macrosAdminPage.ocDefaultAppProfile();
            await macrosAdminPage.ValidateThePage(Constants.NoEntitySession);

            await macrosAdminPage.cswDefaultAppProfile();
            await macrosAdminPage.ValidateThePage(Constants.EntitySession);
            
            await macrosAdminPage.cswDefaultChannelAppProfile();
            await macrosAdminPage.ValidateThePage(Constants.EntitySession);
            await macrosAdminPage.cswDefaultProductivityPane();
            await macrosAdminPage.ValidateThePage(Constants.ProductivityPaneDefaultMode);
            await macrosAdminPage.cswDefaultChannel();
            await macrosAdminPage.ValidateThePage(Constants.ChannelProvider);
        }
        finally
        {
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
        try
        {
            await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);   
            await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(agentStartPage, agentChat);
            await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);
            await macrosAdminPage.initiateNewContactTab(agentPage);
            
            //End live chat
            await macrosAdminPage.closeConversation(agentPage, agentChat);
            await liveChatPage.closeChat();
        }
        finally
        {   
            console.log("validation Successfully"); 
        }
    });

    ///<summary>
    /// Test Case 2681623: Verify the CSW page load without any error after initiating a case session.
    /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2681623
    ///</summary> 
    it("Test Case 2681623: Verify the CSW page load without any error after initiating a case session.", async () => {
        agentPage = await agentContext.newPage();
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        try
        {
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.createCase(Constants.CaseTitleName);
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName, Constants.CaseLink1);

            //Varify the Page
            await macrosAdminPage.ValidateThePage(Constants.CasePage);
        }
        finally
        {
            await macrosAdminPage.deleteCase(adminPage,adminStartPage,Constants.CaseTitleName);
        }
    });

    ///<summary>
    ///Test Case 2519810: Modifying the value of the template parameter "alwaysRender" to true will display a warning message atop the form.
    ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2519810
    ///<summary> 
    it("Test Case 2519810: Modifying the value of the template parameter alwaysRender to true will display a warning message atop the form.", async () =>{
        agentPage = await agentContext.newPage();
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        try
        {
            // Login As Admin and create macro
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
            await macrosAdminPage.createApplicationTabAndGetId(Constants.ThirdPartyWebsiteAppTabName, Constants.ThirdPartyWebsiteApplicationTabUniqueName, Constants.ThirdPartyWebsiteOptionValue);
            await macrosAdminPage.AddParametersToAppTab(Constants.ParameterName, Constants.ParameterUniqueName, Constants.ValueAsFalse);
            await macrosAdminPage.changeValueOfalwaysRender();

            //VarifyResult
            await macrosAdminPage.ValidateThePage(Constants.WarningNotification);
        }
        finally
        {
            await macrosAdminPage.deleteApplicationTabWithCSAdminCenter(adminPage, Constants.ThirdPartyWebsiteAppTabName);
        }
    });
});