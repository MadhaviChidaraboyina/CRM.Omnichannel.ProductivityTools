import { AgentChat } from "../../../pages/AgentChat";
import { BrowserContext, Page } from "playwright";
import { Constants } from "../../common/constants";
import { LiveChatPage } from "../../../pages/LiveChat";
import { Macros } from "../../macros/pages/macrosAdmin";
import { OrgDynamicsCrmStartPage } from "../../../pages/org-dynamics-crm-start.page";
import { TestHelper } from "../../../helpers/test-helper";
import { TestSettings } from "../../../configuration/test-settings";
import { AgentScript } from "../../../integration-tests/agentScript/pages/agentScriptAdmin";

describe("Macro testcases - ", () => {
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
            const result = await agentPage.evaluate(async () => {
                const ctrl = await (window as any).Microsoft.ProductivityMacros.runMacro("AutoFillMacro", { timeout: 10000 });
                return ctrl;
            });
            expect(result).toBe(Constants.ActionPerformedSuccessfully);
            //Check API result on UI
            const accountsLoadResult = await macrosAdminPage.verifyOpenedTab(agentPage, Constants.AutofilledAccountName);
            expect(accountsLoadResult).toBeTruthy();
            //End live chat
            //await macrosAdminPage.closeConversation(agentPage, agentChat);
            await agentChat.closeUnusedChat();
            await liveChatPage.closeChat();
        }
        finally {
            await macrosAdminPage.deleteMacro(adminStartPage, Constants.AutoFillFieldsWithData);
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
            //await macrosAdminPage.closeConversation(agentPage, agentChat);
            await agentChat.closeUnusedChat();
            await liveChatPage.closeChat();
        }
        finally {
            await macrosAdminPage.deleteMacro(adminStartPage, Constants.OpenControl);
            await macrosAdminPage.deleteApplicationTab(adminStartPage, Constants.ControlApplicationTab);
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
            //await macrosAdminPage.closeConversation(agentPage, agentChat);
            await agentChat.closeUnusedChat();
            await liveChatPage.closeChat();
        }
        finally {
            await macrosAdminPage.deleteMacro(adminStartPage, Constants.ThirdPartyWebsiteAppTabName);
            await macrosAdminPage.deleteApplicationTab(adminStartPage, Constants.ThirdPartyWebsiteApplicationTab);
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
            //await macrosAdminPage.closeConversation(agentPage, agentChat);
            await agentChat.closeUnusedChat();
            await liveChatPage.closeChat();
        }
        finally {
            await macrosAdminPage.deleteMacro(adminStartPage, Constants.OpenNewAccount);
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
            //await macrosAdminPage.closeConversation(agentPage, agentChat);
            await agentChat.closeUnusedChat();
            await liveChatPage.closeChat();
        }
        finally {
            await macrosAdminPage.deleteMacro(adminStartPage, Constants.OpenKBSearch);
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
            //await macrosAdminPage.closeConversation(agentPage, agentChat);
            await agentChat.closeUnusedChat();
            await liveChatPage.closeChat();
        }
        finally {
            await macrosAdminPage.deleteCase(adminPage, adminStartPage, Constants.AutomationCaseTitle);
            await macrosAdminPage.deleteMacro(adminStartPage, Constants.OpenExistingRecord);
        }
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
            //await macrosAdminPage.closeConversation(agentPage, agentChat);
            await agentChat.closeUnusedChat();
            await liveChatPage.closeChat();
        }
        finally {
            await macrosAdminPage.deleteMacro(adminStartPage, Constants.OpenAccountGrid);
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
            //await macrosAdminPage.closeConversation(agentPage, agentChat);
            await agentChat.closeUnusedChat();
            await liveChatPage.closeChat();
        }
        finally {
            await macrosAdminPage.deleteMacro(adminStartPage, Constants.DoRelevanceSearch);
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
            //await macrosAdminPage.closeConversation(agentPage, agentChat);
            await agentChat.closeUnusedChat();
            await liveChatPage.closeChat();
        }
        finally {
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
            //await macrosAdminPage.closeConversation(agentPage, agentChat);
            await agentChat.closeUnusedChat();
            await liveChatPage.closeChat();
        }
        finally {
            await macrosAdminPage.deleteCase(adminPage, adminStartPage, Constants.AutomationCaseTitle)
            await macrosAdminPage.deleteMacro(adminStartPage, Constants.UpdateAccount);
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
        finally {
            await macrosAdminPage.deleteMacro(adminStartPage, Constants.OpenKBSearch);
        }
    });

    ///<summary>
    ///Test Case 2662215: Verify tab info from Context post Refresh Session Context Macro Action.
    ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2662215
    ///<summary> 
    it("Test Case 2662215: Verify tab info from Context post Refresh Session Context Macro Action.", async () => {
        agentPage = await agentContext.newPage();
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        try {
            // Login As Admin and create macro
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
            await macrosAdminPage.createResolveSessionMacro(Constants.RefreshSessionContextTitle, Constants.IncidentID);
            // Create AgentScript and Add Macro to it's agentScript step
            await macrosAdminPage.AgentScriptInCSAdminCenter(Constants.AgentScriptName, Constants.AgentScriptUniqueName);
            await macrosAdminPage.AgentScriptStep(Constants.AgentScriptStepName2, Constants.AgentscriptUniquename, Constants.RefreshSessionContextTitle);
            // Create Session and Add agentscript to it
            await macrosAdminPage.SessionInCSAdminCenter(Constants.SessionTemplateName, Constants.SessionTemplateUniqueName);
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
        finally {
            await macrosAdminPage.DeleteSession(adminPage, adminStartPage, Constants.SessionTemplateName);
            await macrosAdminPage.DeleteAppProfile(adminPage, adminStartPage, Constants.Name);
        }
    });
});