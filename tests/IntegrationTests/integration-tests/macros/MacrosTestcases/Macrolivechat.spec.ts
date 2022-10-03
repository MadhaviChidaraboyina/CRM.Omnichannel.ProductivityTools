import { AgentChat } from "../../../pages/AgentChat";
import { BrowserContext, Page } from "playwright";
import { Constants } from "../../common/constants";
import { LiveChatPage } from "../../../pages/LiveChat";
import { Macros } from "../../macropages/macrosAdmin";
import { OrgDynamicsCrmStartPage } from "../../../pages/org-dynamics-crm-start.page";
import { TestHelper } from "../../../helpers/test-helper";
import { TestSettings } from "../../../configuration/test-settings";
import { AgentScript } from "../../agentScript/pages/agentScriptAdmin";
import { MacrosPage } from "../../../pages/Macros";

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
            viewport: TestSettings.Viewport, extraHTTPHeaders: {
                origin: "",
            },
        });
        liveChatContext = await browser.newContext({
            viewport: TestSettings.Viewport, acceptDownloads: true, extraHTTPHeaders: {
                origin: "",
            },
        });
        agentContext = await browser.newContext({
            viewport: TestSettings.Viewport, acceptDownloads: true, extraHTTPHeaders: {
                origin: "",
            },
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
    ///Test Case 2253513: [Macros] Verify dashboard application template is opened in new tab using 'Open application tab' action in macros
    /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_testPlans/execute?planId=2532163&opId=3593&suiteId=2532167
    ///</summary>
    it("Test Case 2253513: [Macros] Verify dashboard application template is opened in new tab using 'Open application tab' action in macros", async () => {
        agentPage = await agentContext.newPage();
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        try {
            //Login as 'Admin automated' and redirected to OrgUrl
            await adminStartPage.navigateToOrgUrlAndSignIn(
                TestSettings.MacrosAgentEmail,
                TestSettings.AdminAccountPassword
            );
            await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
            const urlId = await macrosAdminPage.createApplicationTabAndGetId(
                Constants.DashboardName,
                Constants.DashboardUniqueName,
                Constants.DashboardOptionValue
            );
            await macrosAdminPage.createMacroFromOmnichannelAdminCenterApp(
                Constants.DashboardMacro,
                urlId
            );
            await macrosAdminPage.createAgentScript(
                Constants.DascboardAgentScriptName,
                Constants.TitleUniqueName,
                Constants.DashboardMacro
            );
            await macrosAdminPage.waitForTimeout();
            await macrosAdminPage.addAgentScripttoDefaultChatSessionbyParameterization(Constants.DascboardAgentScriptName);
            //Run Macro
            await macrosAdminPage.waitForTimeout();// it is mandatory to load UI elements
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
            await macrosAdminPage.waitForTimeout();
            //await macrosAdminPage.skipCSWBug();
            await macrosAdminPage.CreateCaseInCSW(Constants.CaseTitleName);
            await macrosAdminPage.InitiateSession(
                Constants.CaseTitleName,
                Constants.CaseLink1
            );

            const openEntityRecordTabUsingMacro =
                await macrosAdminPage.runDashboardMacroInSessionAndValidate(
                    Constants.DascboardAgentScriptName, Constants.DashboardTitle
                );
            expect(openEntityRecordTabUsingMacro).toBeTruthy();

        } finally {
            await macrosAdminPage.deleteAgentScriptnNew(adminPage, adminStartPage, Constants.DascboardAgentScriptName);

            await macrosAdminPage.deleteInactiveAgentScript(Constants.DascboardAgentScriptName);
            await macrosAdminPage.deleteApplicationTabusingOmnichannelAdminCenter(
                Constants.DashboardName
            );
            await macrosAdminPage.deleteMacroFromOmnichannelAdminCenterApp(
                Constants.DashboardMacro
            );
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
            await adminStartPage.navigateToOrgUrlAndSignIn(TestSettings.MacrosAgentEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
            const applicationTabId = await macrosAdminPage.createApplicationTabAndGetId(Constants.WebResourceApplicationTab, Constants.WebResourceApplicationTabUniqueName, Constants.WebResourceOptionValue);
            await macrosAdminPage.createMacro(Constants.OpenWebResource, applicationTabId);

            await macrosAdminPage.createAgentScript(
                Constants.DashboardOpenSourceScriptName,
                Constants.TitleUniqueName,
                Constants.OpenWebResource
            );
            await macrosAdminPage.waitForTimeout();
            await macrosAdminPage.addAgentScripttoDefaultChatSessionbyParameterization2(Constants.DashboardOpenSourceScriptName, Constants.DashboardOpenSourceAgentScript);
            //Run Macro
            await macrosAdminPage.waitForTimeout();// it is mandatory to load UI elements
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
            await macrosAdminPage.waitForTimeout();
            //await macrosAdminPage.skipCSWBug();
            await macrosAdminPage.CreateCaseInCSW(Constants.CaseTitleName);
            await macrosAdminPage.InitiateSession(
                Constants.CaseTitleName,
                Constants.CaseLink1
            );

            const openEntityRecordTabUsingMacro =
                await macrosAdminPage.runDashboardMacroInSessionAndValidate(
                    Constants.DashboardOpenSourceScriptName, Constants.WebResourceTab
                );
            expect(openEntityRecordTabUsingMacro).toBeTruthy();
        }
        finally {
            await macrosAdminPage.deleteAgentScriptnNew(adminPage, adminStartPage, Constants.DashboardOpenSourceScriptName);

            await macrosAdminPage.deleteInactiveAgentScript(Constants.DashboardOpenSourceScriptName);
            await macrosAdminPage.deleteApplicationTabusingOmnichannelAdminCenter(
                Constants.WebResourceApplicationTab
            );
            await macrosAdminPage.deleteMacroFromOmnichannelAdminCenterApp(
                Constants.OpenWebResource
            );
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
            await adminStartPage.navigateToOrgUrlAndSignIn(TestSettings.MacrosAgentEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            const accountId = await macrosAdminPage.createAccountAndGetId(Constants.AccountName);
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
            await macrosAdminPage.createMacro(Constants.ExistingRecord, accountId);

            //Initiate live chat with agent
            await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);

            //Login as agent and accept chat
            await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(TestSettings.MacrosAgentEmail, agentStartPage, agentChat);
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

            await agentChat.closeUnusedChat();
            await liveChatPage.closeChat();
        }
        finally {
            await macrosAdminPage.deleteMacro(adminStartPage, Constants.ExistingRecord);
            await macrosAdminPage.deleteAccount(adminPage, adminStartPage, Constants.AccountName);
        }
    });


    /// <summary>
    /// TC 1580682:- Verify DraftEmail macro action
    /// </summary>
    it.skip("Test Case 1580682: Verify DraftEmail macro action", async () => {
        agentPage = await agentContext.newPage();
        const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        const agentChat = new AgentChat(agentPage);
        try {
            //Login as admin and create macro
            await adminStartPage.navigateToOrgUrlAndSignIn(TestSettings.MacrosAgentEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            const incidentId = await macrosAdminPage.createCaseAndGetIncidentId();
            const incidentEmailTemplateId = await macrosAdminPage.CreateEmailTemplateAndGetId();
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
            await macrosAdminPage.createMacro(Constants.CreateDraftEmail, incidentEmailTemplateId, incidentId);

            //Initiate live chat with agent
            await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);

            //Login as agent and accept chat
            await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(TestSettings.MacrosAgentEmail, agentStartPage, agentChat);
            await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);

            //Check API response through console
            const result = await agentPage.evaluate(async () => {
                const ctrl = await (window as any).Microsoft.ProductivityMacros.runMacro("CreateDraftEmail");
                return ctrl;
            });
            expect(result).toBe(Constants.ActionPerformedSuccessfully);

            //Check API result on UI
            const openDraftEmailResult = await macrosAdminPage.verifyOpenedTab(agentPage, Constants.NewEmailTitle);
            expect(openDraftEmailResult).toBeTruthy();

            //End live chat

            await agentChat.closeUnusedChat();
            await liveChatPage.closeChat();
        }
        finally {
            await macrosAdminPage.deleteMacro(adminStartPage, Constants.CreateDraftEmail);
            await macrosAdminPage.deleteCase(adminPage, adminStartPage, Constants.AutomationCaseTitle);
            await macrosAdminPage.deleteEmailTemplate(adminPage, adminStartPage, Constants.EmailTemplateName);
        }
    });

    /// <summary>
    /// Test Case 2367026: [Macros] Verify record is saved by using 'Save the record' action in the Productivity Automation.
    /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2367026
    /// </summary>
    it.skip("Test Case 2367026: [Macros] Verify record is saved by using 'Save the record' action in the Productivity Automation.", async () => {
        agentPage = await agentContext.newPage();
        const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        const agentChat = new AgentChat(agentPage);
        try {
            //Login as admin and create macro
            await adminStartPage.navigateToOrgUrlAndSignIn(TestSettings.MacrosAgentEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.OmnichannelAdminCenterApp);
            await macrosAdminPage.createMacroFromOmnichannelAdminCenterApp(Constants.SaveRecord);

            //Initiate live chat with agent
            await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);

            //Login as agent and accept chat
            await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(TestSettings.MacrosAgentEmail, agentStartPage, agentChat);
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

            await agentChat.closeUnusedChat();
            await liveChatPage.closeChat();
        }
        finally {
            await macrosAdminPage.deleteMacroFromOmnichannelAdminCenterApp(
                Constants.ControlMacro
            );
            await macrosAdminPage.deleteAccountLinkUnlink(adminPage, adminStartPage, Constants.AutofilledAccountName);
        }
    });

    ///<summary>
    ///Test Case 1795816: [Runtime]: Verify details are showing properly when script step and macro step fails
    /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_testPlans/execute?planId=2576813&opId=3606&suiteId=2576817
    ///</summary>
    it.skip("Test Case 1795816: [Runtime]: Verify details are showing properly when script step and macro step fails.", async () => {
        agentPage = await agentContext.newPage();
        const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        const agentChat = new AgentChat(agentPage);
        try {
            await adminStartPage.navigateToOrgUrlAndSignIn(TestSettings.MacrosAgentEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.OmnichannelAdminCenterApp);
            await macrosAdminPage.createMacroFromOmnichannelAdminCenterApp(Constants.MacroFail, Constants.Urlid);
            await macrosAdminPage.createAgentScript(Constants.AgentScriptName, Constants.TitleUniqueName, Constants.EntityListMacro);
            await macrosAdminPage.addAgentScripttoDefaultChatSession();

            //Login as agent and accept chat
            await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(TestSettings.MacrosAgentEmail, agentStartPage, agentChat);
            await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);
            await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);

            //Validating The Title of Application Tab by running the Macro
            const MFailMacro = await macrosAdminPage.runMacroAndValidate(agentPage, Constants.MFailTitleTab);
            expect(MFailMacro).toBeTruthy();

            //Closing Chat

            await agentChat.closeUnusedChat();
            await liveChatPage.closeChat();
        }
        finally {
            await macrosAdminPage.deleteAgentScript(Constants.AgentScriptName);
            await macrosAdminPage.deleteMacro(adminStartPage, Constants.MacroFail);
        }
    });

    ///<summary>
    ///Test Case 1802338: Verify an error pop up is showing if wrong data provides in expression builder
    ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_testPlans/execute?planId=2338666&suiteId=2347473
    ///</summary>
    it.skip("Test Case 1802338: Verify an error pop up is showing if wrong data provides in expression builder", async () => {
        let page = await agentContext.newPage();
        const macrosPage = new MacrosPage(page);
        const agentScriptAdminPage = new AgentScript(page);
        try {
            await macrosPage.navigateToOrgUrl();
            await agentScriptAdminPage.createSessionTemplate();
            await agentScriptAdminPage.createAgentScript(Constants.AgentScriptName, Constants.AgentScriptUniqueName);
            await agentScriptAdminPage.createAgentScript(Constants.AgentscriptName2, Constants.AgentScriptUniqueName2);
            await agentScriptAdminPage.addTwoAgentScriptToSesssionTemplate(Constants.AgentScriptName, Constants.AgentscriptName2);
            await agentScriptAdminPage.sessionBuilder();
            await macrosPage.prerequisiteForExpressionBuilder();
            await agentScriptAdminPage.addOdataConditionForExpressionBuilder();
        }
        finally {
            await agentScriptAdminPage.deleteSessionTemplate();
            await agentScriptAdminPage.deleteAgentScript(Constants.AgentScript);
            await agentScriptAdminPage.deleteAgentScript(Constants.AgentScript2);
            await macrosPage?.closePage();
        }
    });

    ///<summary>
    ///Test Case 2045302: [Productivity Pane: Agent Guidance] : Validate knowledge search control in both case session and conversation session (actions are slightly different)
    /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045302
    ///</summary>
    it.skip("Test Case 2045302: [Productivity Pane: Agent Guidance] : Validate knowledge search control in both case session and conversation session (actions are slightly different)", async () => {
        agentPage = await agentContext.newPage();
        const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        const agentChat = new AgentChat(agentPage);
        try {
            //Login as admin and create case
            await adminStartPage.navigateToOrgUrlAndSignIn(TestSettings.MacrosAgentEmail, TestSettings.AdminAccountPassword);
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
            await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(TestSettings.MacrosAgentEmail, agentStartPage, agentChat);
            await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);
            await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);

            //validate kb search
            const KbSearch = await macrosAdminPage.OpenKbSearchAndValidate(agentPage);
            expect(KbSearch).toBeTruthy();

            //Closing Chat

            await agentChat.closeUnusedChat();
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
    it.skip("Test Case 1577428: Verify Admin of the company can configure the custom activities to be tracked as part of user navigation and those would be listed in the navigation tab.", async () => {
        agentPage = await agentContext.newPage();
        const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        const agentChat = new AgentChat(agentPage);
        try {
            //Login as admin and create case
            await adminStartPage.navigateToOrgUrlAndSignIn(TestSettings.MacrosAgentEmail, TestSettings.AdminAccountPassword);

            //Login as agent and accept chat
            await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(TestSettings.MacrosAgentEmail, agentStartPage, agentChat);
            await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);
            await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);

            //Closing Chat

            await agentChat.closeUnusedChat();
            await liveChatPage.closeChat();
            await macrosAdminPage.OpenClosedItem(agentChat);
            await macrosAdminPage.ValidateThePage(Constants.History);
        }
        finally {
            console.log("validation Successfully");
        }
    });

    ///<summary>
    ///Test Case 2367015: [Macros] Verify cloning of current record by using 'Clone current record' action in the Productivity Automation.
    ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2367015
    ///<summary> 
    it.skip("Test Case 2367015: [Macros] Verify cloning of current record by using 'Clone current record' action in the Productivity Automation.", async () => {
        agentPage = await agentContext.newPage();
        const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        const agentChat = new AgentChat(agentPage);
        try {
            // Login As Admin and create macro
            await adminStartPage.navigateToOrgUrlAndSignIn(TestSettings.MacrosAgentEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.OmnichannelAdminCenterApp);
            await macrosAdminPage.CreateCloneCurrentMacro(Constants.CloneCurrentMacro, Constants.RecordName);
            macrosAdminPage.AddAgentScriptToSession(Constants.AgentScriptName);

            // Initiate live chat with agent
            await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);

            //Login as agent and accept chat
            await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(TestSettings.MacrosAgentEmail, agentStartPage, agentChat);
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

            await agentChat.closeUnusedChat();
            await liveChatPage.closeChat();
        }
        finally {
            await macrosAdminPage.deleteMacro(adminStartPage, Constants.CloneCurrentMacro);
        }
    });




    ///<summary>
    ///Test Case 1577427: Verify Agent can see the user navigation history in the customer summary > under Navigation tab.
    ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1577427
    ///</summary>
    it.skip("Test Case 1577427: Verify Agent can see the user navigation history in the customer summary > under Navigation tab", async () => {
        agentPage = await agentContext.newPage();
        const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        const agentChat = new AgentChat(agentPage);
        try {
            await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);
            //Login as agent and accept chat
            await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(TestSettings.MacrosAgentEmail, agentStartPage, agentChat);
            await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);

            await agentChat.closeUnusedChat();
            await liveChatPage.closeChat();
            await adminStartPage.navigateToOrgUrlAndSignIn(TestSettings.MacrosAgentEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.OmnichannelCustomerservice);
            await macrosAdminPage.openClosedWorkItems();
            await macrosAdminPage.ValidateThePage(Constants.History);
            await macrosAdminPage.ValidateThePage(Constants.Transcript);
        }
        finally {
            console.log("validation Successfully");
        }
    });

    ///<summary>
    ///Test Case 1790578: Verify Static values are working in expression builder with true condition
    ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_testPlans/define?planId=2368886&suiteId=2368890
    ///</summary>
    it.skip("1790578: Static Values are Working in Expression Builder with True Condition", async () => {
        let page = await agentContext.newPage();
        let agentPage = new AgentChat(page);
        const macrosPage = new MacrosPage(page);
        const agentScriptAdminPage = new AgentScript(page);
        let agentStartPage = new OrgDynamicsCrmStartPage(page);

        try {
            await macrosPage.navigateToOrgUrl();
            await agentScriptAdminPage.createGenericSessionTemplate(adminPage);
            await agentScriptAdminPage.createAgentScript(Constants.AgentScriptName, Constants.AgentScriptUniqueName);
            await agentScriptAdminPage.createAgentScript(Constants.AgentscriptName2, Constants.AgentScriptUniqueName2);
            await agentScriptAdminPage.addTwoAgentScriptToSesssionTemplate(Constants.AgentScriptName, Constants.AgentscriptName2);
            await macrosPage.prerequisiteForExpressionBuilder();
            await agentScriptAdminPage.addStaticValueConditionForExpressionBuilder(Constants.StaticValueTrueCondition, Constants.StaticValueTrueCondition);
            await agentScriptAdminPage.associateSessionTemplateToaWorkStream();
            await agentScriptAdminPage.goToApps();
            await agentStartPage.goToOmnichannelForCustomers();

            liveChatPage = new LiveChatPage(await liveChatContext.newPage());
            await liveChatPage.open(TestSettings.LCWUrl);
            await liveChatPage.initiateChat();
            await liveChatPage.sendMessage("Hi", "en");
            await liveChatPage.getUniqueChat(liveChatPage, agentPage);
            await agentScriptAdminPage.validateAgentScriptsForExpressionBuilder(Constants.AgentScriptName);
            await liveChatPage.closeChat();
        }
        finally {
            await macrosPage?.closePage();
        }
    });

    ///<summary>
    ///Test Case 1717166: Verify Admin can use the slugs in agent assist step titles
    ///https://dynamicscrm.visualstudio.com/OneCRM/_testPlans/define?planId=2368886&suiteId=2368890
    ///</summary>
    it.skip("Admin can use the slugs in agent assist step titles", async () => {
        let page = await agentContext.newPage();
        let constant = new Constants();
        let agentPage = new AgentChat(page);
        const macrosPage = new MacrosPage(page);
        const agentScriptAdminPage = new AgentScript(page);
        let agentStartPage = new OrgDynamicsCrmStartPage(page);
        try {
            await macrosPage.navigateToOrgUrl();
            await agentScriptAdminPage.createAgentScript(Constants.AgentScriptName, Constants.AgentScriptUniqueName);
            await agentScriptAdminPage.addAgentScriptTitle(Constants.SelectOptionText);
            await agentScriptAdminPage.addAgentScripttoDefaultChatSession();
            await agentScriptAdminPage.goToApps();
            await agentStartPage.goToOmnichannelForCustomers();

            liveChatPage = new LiveChatPage(await liveChatContext.newPage());
            await liveChatPage.open(TestSettings.LCWUrl);
            await liveChatPage.initiateChat();
            await liveChatPage.sendMessage("Hi", "en");
            await liveChatPage.getUniqueChat(liveChatPage, agentPage);
            const slugvalidateResult = await agentScriptAdminPage.validateSlugName();
            expect(slugvalidateResult).toBeTruthy();
            await liveChatPage.closeChat();
        }
        finally {
            await agentScriptAdminPage.goToApps();
            await agentStartPage.goToOmnichannelAdministration();
            await agentScriptAdminPage.deleteAgentScripthavingSteps(Constants.AgentScript);
            await macrosPage?.closePage();
        }
    });

    ///<summary>
    ///Test Case 1794804: Verify Static values are working in expression builder with false condition
    ///https://dynamicscrm.visualstudio.com/OneCRM/_testPlans/define?planId=2368886&suiteId=2368890
    ///</summary>
    it.skip("Static Values are Working in Expression Builder with False Condition", async () => {
        let page = await agentContext.newPage();
        let agentPage = new AgentChat(page);
        const macrosPage = new MacrosPage(page);
        const agentScriptAdminPage = new AgentScript(page);
        let agentStartPage = new OrgDynamicsCrmStartPage(page);

        try {
            await macrosPage.navigateToOrgUrl();
            await agentScriptAdminPage.createGenericSessionTemplate(adminPage);
            await agentScriptAdminPage.createAgentScript(Constants.AgentScriptName, Constants.AgentScriptUniqueName);
            await agentScriptAdminPage.createAgentScript(Constants.AgentscriptName2, Constants.AgentScriptUniqueName2);
            await agentScriptAdminPage.addTwoAgentScriptToSesssionTemplate(Constants.AgentScriptName, Constants.AgentscriptName2);
            await macrosPage.prerequisiteForExpressionBuilder();
            await agentScriptAdminPage.addStaticValueConditionForExpressionBuilder(Constants.StaticValueTrueCondition, Constants.StaticValueFalseCondition);
            await agentScriptAdminPage.associateSessionTemplateToaWorkStream();
            await agentScriptAdminPage.goToApps();
            await agentStartPage.goToOmnichannelForCustomers();

            liveChatPage = new LiveChatPage(await liveChatContext.newPage());
            await liveChatPage.open(TestSettings.LCWUrl);
            await liveChatPage.initiateChat();
            await liveChatPage.sendMessage("Hi", "en");
            await liveChatPage.getUniqueChat(liveChatPage, agentPage);
            await agentScriptAdminPage.validateAgentScriptsForExpressionBuilder(Constants.AgentscriptName2);
            await liveChatPage.closeChat();
        }
        finally {
            await macrosPage?.closePage();
        }
    });

    ///<summary>
    ///Test Case 1790571: Verify session connectors are working in expression builder
    ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1790571
    ///</summary>
    it.skip("Test Case 1790571: Verify session connectors are working in expression builder", async () => {
        agentPage = await agentContext.newPage();
        const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        const agentScriptAdminPage = new AgentScript(page);
        const agentChat = new AgentChat(agentPage);
        const macrosPage = new MacrosPage(page);
        try {
            await adminStartPage.navigateToOrgUrlAndSignIn(TestSettings.MacrosAgentEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.OmnichannelAdminCenterApp);
            await macrosAdminPage.CreateSessionTemplate(Constants.SessionTemplateinPowerApps);
            //await macrosAdminPage.createAgentScriptWithoutMacro(Constants.AgentScriptName, Constants.AgentScriptUniqueName);
            //await macrosAdminPage.createAgentScriptWithoutMacro(Constants.AgentscriptName2, Constants.AgentScriptUniqueName2);
            await macrosAdminPage.InitiateSessionTemplate(Constants.SessionTemplateName, Constants.SessionLink);
            //await macrosAdminPage.addTwoAgentScriptToSesssionTemplate(Constants.AgentScriptName, Constants.AgentscriptName2);
            await macrosPage.prerequisiteForExpressionBuilder();
            await adminStartPage.addSlugOrSessionConditionForExpressionBuilder(Constants.SessionName, Constants.CustomerName);
            await macrosAdminPage.associateSessionTemplateToaWorkStream();

            await macrosAdminPage.addAgentScripttoDefaultChatSession();

            //Login as agent and accept chat
            await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(TestSettings.MacrosAgentEmail, agentStartPage, agentChat);
            await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);
            await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);

            //Validating Agent script for Expression Builder
            await agentScriptAdminPage.validateAgentScriptsForExpressionBuilder(Constants.AgentScriptName);

            //Closing Chat

            await agentChat.closeUnusedChat();
            await liveChatPage.closeChat();
        }
        finally {
            await macrosAdminPage.deleteSessionTemplate(adminPage, adminStartPage, Constants.SessionTemplateName);
            //await macrosAdminPage.deleteAgentScript(Constants.AgentScriptName);
        }
    });

    ///</summary>
    ///Test Case 1760325: [Macros] Verify Slugs, Session connectors are working in conditions in Macros
    /// Test Case Link https://dev.azure.com/dynamicscrm/OneCRM/_workitems/edit/1760325
    ///</summary>
    it.skip("Test Case 1760325: [Macros] Verify Slugs, Session connectors are working in conditions in Macros", async () => {
        agentPage = await agentContext.newPage();
        const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
        const liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        const agentChat = new AgentChat(agentPage);
        try {
            //Login as admin and create macro
            await adminStartPage.navigateToOrgUrlAndSignIn(TestSettings.MacrosAgentEmail, TestSettings.AdminAccountPassword);
            adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
            await macrosAdminPage.createMacro(Constants.SlugAndSessionConnector);

            //Initiate live chat with agent
            await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);

            //Login as agent and accept chat
            await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS
                (TestSettings.MacrosAgentEmail, agentStartPage, agentChat);
            await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);

            //Check API response through console
            const result = await agentPage.evaluate(async () => {
                const ctrl = await (window as any).Microsoft.ProductivityMacros.runMacro("SlugAndSessionConnector");
                return ctrl;
            });
            expect(result).toBe(Constants.ActionPerformedSuccessfully);

            //Check API result on UI
            const accountsLoadResult = await macrosAdminPage.verifyOpenedTab(agentPage, Constants.AccountsMyActiveAccountsTab);
            expect(accountsLoadResult).toBeTruthy();
            const casesLoadResult = await macrosAdminPage.verifyOpenedTab(agentPage, Constants.CasesGrid);
            expect(casesLoadResult).toBeTruthy();

            //End live chat
            await macrosAdminPage.closeConversation(agentPage, agentChat);
            await liveChatPage.closeChat();
        }
        finally {
            await macrosAdminPage.deleteMacro(adminStartPage, Constants.SlugAndSessionConnector);
        }
    });

    ///<summary>
    ///Test Case 1593439: [Runtime]: Verify agent script control: Step type specific functionality
    /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1593439
    ///</summary>
    it.skip("Test Case 1593439: [Runtime]: Verify agent script control: Step type specific functionality", async () => {
        agentPage = await agentContext.newPage();
        const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        const agentChat = new AgentChat(agentPage);
        try {
            await adminStartPage.navigateToOrgUrlAndSignIn(TestSettings.MacrosAgentEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
            await macrosAdminPage.createMacro(Constants.OpenAccountGrid);
            await macrosAdminPage.AgentScriptInCSAdminCenter(Constants.AgentscriptName2, Constants.AgentScriptUniqueName2);
            await macrosAdminPage.AgentScriptInCSAdminCenter(Constants.AgentScriptName1, Constants.AgentScriptUniqueName1);
            await macrosAdminPage.agentScriptStepforText(Constants.TextAgentScriptStep, Constants.TextUniqueName, Constants.TargetScriptValue1, Constants.ActionTypeText);
            await macrosAdminPage.AgentScriptStep(Constants.MacroAgentScriptStep, Constants.MacroUniqueName, Constants.OpenAccountGrid);
            await macrosAdminPage.agentScriptStepforScript(Constants.ScriptAgentScript, Constants.ScriptUniqueName, Constants.TargetScriptValue1, Constants.AgentScriptStep2);
            await macrosAdminPage.genericSession(Constants.GenericSessionTemplateName, Constants.GenericSessionUniqueName);
            await macrosAdminPage.AddAgentScriptToSession(Constants.AgentScriptName1);
            await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);
            await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(TestSettings.MacrosAgentEmail,
                agentStartPage, agentChat);

            await macrosAdminPage.runFlowMacroAndValidate(agentPage);
            await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);
            const OpenedTab = await macrosAdminPage.runMacroAndValidate(agentPage, Constants.OpenGridVerification);
            expect(OpenedTab).toBeTruthy();
            const Visitor = await macrosAdminPage.runTextAndValidate(agentPage, Constants.Visitor);
            expect(Visitor).toBeTruthy();
            const AgentScript = await macrosAdminPage.runScriptAndValidate(agentPage, Constants.ScriptValidation);
            expect(AgentScript).toBeTruthy();
        }
        finally {
            await macrosAdminPage.deleteAgentScript(Constants.AgentScriptName1);
            await macrosAdminPage.deleteAgentScript(Constants.AgentscriptName2);
            await macrosAdminPage.deleteSessionTemplate(adminPage, adminStartPage, Constants.SessionTemplateName);
        }
    });

    ///<summary>
    ///Test Case 1785761: [Sanity][All Channels] Verify Agent scripts are loading in Productivity pane, Macros are running and expression builder is executing as per inputs
    /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1785761
    ///</summary>
    it.skip("Test Case 1785761: [Sanity][All Channels] Verify Agent scripts are loading in Productivity pane, Macros are running and expression builder is executing as per inputs", async () => {
        agentPage = await agentContext.newPage();
        const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        const agentChat = new AgentChat(agentPage);
        try {
            //Login as admin and create macro
            await adminStartPage.navigateToOrgUrlAndSignIn(TestSettings.MacrosAgentEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
            await macrosAdminPage.createMacro(Constants.OpenFocustab);

            //Initiate live chat with agent
            await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);

            //Login as agent and accept chat
            await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(TestSettings.MacrosAgentEmail,
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

    ///<summary>
    ///Test Case 2253523: [Macros] Verify entity search application template  is opened in new tab using 'Open application tab' action in macros
    /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_testPlans/execute?planId=2532163&opId=3593&suiteId=2532167
    ///</summary>
    it.skip("Test Case 2253523: [Macros] Verify entity view application template is opened in new tab using 'Open application tab' action in macros", async () => {
        agentPage = await agentContext.newPage();
        const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        const agentChat = new AgentChat(agentPage);
        try {
            //Login as admin and create macro
            await adminStartPage.navigateToOrgUrlAndSignIn(TestSettings.MacrosAgentEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
            const applicationTabId = await macrosAdminPage.createApplicationTabAndGetId(Constants.EntitySearchApplicationTab, Constants.EntitySearchApplicationTabUniqueName, Constants.EntitySearchOptionValue);
            await macrosAdminPage.InsertParametersInSearchApplicationTab(adminStartPage, Constants.EntitySearchApplicationTab);
            await macrosAdminPage.createMacro(Constants.EntitySearch, applicationTabId);

            //Initiate live chat with agent
            await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);

            //Login as agent and accept chat
            await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(TestSettings.MacrosAgentEmail, agentStartPage, agentChat);
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
        finally {
            await macrosAdminPage.deleteMacro(adminStartPage, Constants.EntitySearch);
            await macrosAdminPage.deleteApplicationTab(adminStartPage, Constants.EntitySearchApplicationTab);
        }
    });

    ///<summary>
    ///Test Case 2313873: [Macros] Verify that tab is focused using 'Focus on the tab' action in the macros.
    ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2313873
    ///</summary>
    it.skip("Test Case 2313873: [Macros] Verify that tab is focused using 'Focus on the tab' action in the macros.", async () => {
        agentPage = await agentContext.newPage();
        const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        const agentChat = new AgentChat(agentPage);
        try {
            //Login as admin and create macro
            await adminStartPage.navigateToOrgUrlAndSignIn(TestSettings.MacrosAgentEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
            await macrosAdminPage.createMacro(Constants.OpenFocustab);

            //Initiate live chat with agent
            await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);

            //Login as agent and accept chat
            await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(TestSettings.MacrosAgentEmail, agentStartPage, agentChat);
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

    //<summary>
    ///Test Case 2367023: [Macros] Verify cloning of input record by using 'Clone input record' action in the Productivity Automation.
    /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_testPlans/execute?planId=2532163&opId=3593&suiteId=2532168
    ///</summary>
    it.skip("Test Case 2367023: [Macros] Verify cloning of input record by using 'Clone input record' action in the Productivity Automation.", async () => {
        agentPage = await agentContext.newPage();
        const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        const agentChat = new AgentChat(agentPage);
        try {
            //Login as admin and create macro
            await adminStartPage.navigateToOrgUrlAndSignIn(TestSettings.MacrosAgentEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            const account = await macrosAdminPage.createAccountAndGetAccountId(Constants.AccountName2);
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToMyApp(Constants.CustomerServiceAdmincenter);
            await macrosAdminPage.createMacro(Constants.CloneInputRecord, account);

            //Initiate live chat with agent
            await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);

            //Login as agent and accept chat
            await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(TestSettings.MacrosAgentEmail,
                agentStartPage, agentChat);
            await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);
            const result = await agentPage.evaluate(async () => {
                const ctrl = await (window as any).Microsoft.ProductivityMacros.runMacro("CloneInputRecord");
                return ctrl;
            });
            expect(result).toBe(Constants.ActionPerformedSuccessfully);

            //Check API result on UI
            const relevenceSearchResult = await macrosAdminPage.verifyOpenedTab(agentPage, Constants.NewAccountTab);
            expect(relevenceSearchResult).toBeTruthy();

            //End live chat
            await macrosAdminPage.closeConversation(agentPage, agentChat);
            await liveChatPage.closeChat();
        }
        finally {
            await macrosAdminPage.deleteMacro(adminStartPage, Constants.CloneInputRecord);
        }
    });

    ///<summary>
    ///Test Case 2411747: Verify OC old Customer Summary and new customer summary having it as anchor tab and additional tab (regular tab)
    /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2411747
    ///</summary>
    it.skip("Test Case 2411747: Verify OC old Customer Summary and new customer summary having it as anchor tab and additional tab (regular tab)", async () => {
        agentPage = await agentContext.newPage();
        const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        const agentChat = new AgentChat(agentPage);
        try {
            await adminStartPage.navigateToOrgUrlAndSignIn(TestSettings.MacrosAgentEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.OmnichannelAdminCenterApp);
            await macrosAdminPage.createApplicationTabInOC(Constants.OldCustomerSummary, Constants.OldCustomerSummaryUniqueName, Constants.EntityRecordOptionValue);
            await macrosAdminPage.insertParametersInOldSustumersummary();
            await macrosAdminPage.genericSession(Constants.SessionTemplateName, Constants.SessionTemplateUniqueName);
            await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);
            // Login as agent and accept chat
            await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(TestSettings.MacrosAgentEmail, agentStartPage, agentChat);
            await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);
            const CustomerSummaryTab = await macrosAdminPage.verifyOpenedTab(agentPage, Constants.CustomerSummaryTab);
            expect(CustomerSummaryTab).toBeTruthy();
            await macrosAdminPage.closeConversation(agentPage, agentChat);
            await liveChatPage.closeChat();

            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToMyApp(Constants.OmnichannelAdminCenterApp);
            await macrosAdminPage.openGenericSession(Constants.CustomerSummary, Constants.AnchorTabSearchResult);
            await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);
            await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(TestSettings.MacrosAgentEmail, agentStartPage, agentChat);
            await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);
            const CustomerSummaryAppTab = await macrosAdminPage.verifyOpenedTab(agentPage, Constants.CustomerSummaryConversation);
            expect(CustomerSummaryAppTab).toBeTruthy();
            await macrosAdminPage.closeConversation(agentPage, agentChat);
            await liveChatPage.closeChat();

            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToMyApp(Constants.OmnichannelAdminCenterApp);
            await macrosAdminPage.chooseSecondAnchorTab();
            await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(TestSettings.MacrosAgentEmail, agentStartPage, agentChat);
            await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);
            const OldCustomerSummaryTab = await macrosAdminPage.verifyOpenedTab(agentPage, Constants.OldCustomerSummaryConversation);
            expect(OldCustomerSummaryTab).toBeTruthy();
            await macrosAdminPage.closeConversation(agentPage, agentChat);
            await liveChatPage.closeChat();

            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToMyApp(Constants.OmnichannelAdminCenterApp);
            await macrosAdminPage.openGenericSession(Constants.OldCustomerSummary, Constants.AppTabSearchReasult);
            await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(TestSettings.MacrosAgentEmail, agentStartPage, agentChat);
            await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);
            const OldCustomerSummaryAppTab = await macrosAdminPage.verifyOpenedTab(agentPage, Constants.OldCustomerSummaryConversation);
            expect(OldCustomerSummaryAppTab).toBeTruthy();
            await macrosAdminPage.closeConversation(agentPage, agentChat);
            await liveChatPage.closeChat();
        }
        finally {
            await macrosAdminPage.deleteApplicationTabWithCSAdminCenter(adminStartPage, Constants.OldCustomerSummary);
            await macrosAdminPage.deleteSessionTemplate(adminPage, adminStartPage, Constants.SessionTemplateName);
        }
    });

    ///<summary>
    ///Test Case 2412690: Verify Knowledge search as anchor tab and also as an additional (Regular ) tab.
    ///Test Case Link  https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2412690
    ///</summary>
    it.skip("Test Case 2412690: Verify Knowledge search as anchor tab and also as an additional (Regular ) tab.", async () => {
        agentPage = await agentContext.newPage();
        const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        const agentChat = new AgentChat(agentPage);
        try {
            await adminStartPage.navigateToOrgUrlAndSignIn(TestSettings.MacrosAgentEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
            await macrosAdminPage.anchorTabKnowledgeSearch();
            await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);
            await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(TestSettings.MacrosAgentEmail,
                agentStartPage, agentChat);
            await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);
            const KnowledgeSearchAppTab = await macrosAdminPage.verifyOpenedTab(agentPage, Constants.KnowledgearticleSearch);
            expect(KnowledgeSearchAppTab).toBeTruthy();

            //End live chat
            await macrosAdminPage.closeConversation(agentPage, agentChat);
            await liveChatPage.closeChat();
        }
        finally {
            await macrosAdminPage.deleteSessionTemplate(adminPage, adminStartPage, Constants.SessionTemplateName);
        }
    });
});
