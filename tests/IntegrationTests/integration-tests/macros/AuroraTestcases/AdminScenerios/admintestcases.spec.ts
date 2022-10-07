import { BrowserContext, Page } from "playwright";
import { Constants } from "../../../common/constants";
import { LiveChatPage } from "../../../../pages/LiveChat";
import { Macros } from "../../../macropages/macrosAdmin";
import { OrgDynamicsCrmStartPage } from "../../../../pages/org-dynamics-crm-start.page";
import { TestHelper } from "../../../../helpers/test-helper";
import { TestSettings } from "../../../../configuration/test-settings";
import { AgentChat } from "pages/AgentChat";

describe("Admin Test Scenerios - ", () => {
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
    ///Test Case 1968350: Verify default values present in an OOTB OC app profile
    ///Test Case Link  https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1968350
    ///<summary>
    it("Test Case 1968350: Verify default values present in an OOTB OC app profile", async () => {
        agentPage = await agentContext.newPage();
        try {
            //Login as admin and create two cases and initiate it and verify
            await adminStartPage.navigateToOrgUrlAndSignIn(
                TestSettings.AdminAccountEmail,
                TestSettings.AdminAccountPassword
            );
            await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
            await macrosAdminPage.ocDefaultAppProfile();
            await macrosAdminPage.ValidateThePage(Constants.NoEntitySession);
            await macrosAdminPage.cswDefaultAppProfile();
            await macrosAdminPage.ValidateThePage(Constants.EntitySession);
            await macrosAdminPage.cswDefaultChannelAppProfile();
            await macrosAdminPage.ValidateThePage(Constants.EntitySession);
            await macrosAdminPage.cswDefaultProductivityPane();
            await macrosAdminPage.ValidateThePage(
                Constants.ProductivityPaneDefaultMode
            );
            await macrosAdminPage.cswDefaultChannel();
            await macrosAdminPage.ValidateThePage(Constants.ChannelProvider);
        } finally {
            console.log("validation Successfully");
        }
    });


    ///<summary>
    ///Test Case 1577427: Verify Agent can see the user navigation history in the customer summary > under Navigation tab.
    ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1577427
    ///</summary>
    it("Test Case 1577427: Verify Agent can see the user navigation history in the customer summary > under Navigation tab", async () => {
        agentPage = await agentContext.newPage();
        const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        const agentChat = new AgentChat(agentPage);
        try {
            await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);
            //Login as agent and accept chat
            await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(TestSettings.AdminAccountEmail, agentStartPage, agentChat);
            await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);

            await agentChat.closeUnusedChat();
            await liveChatPage.closeChat();
            await adminStartPage.navigateToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
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
            await adminStartPage.navigateToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);

            //Login as agent and accept chat
            await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(TestSettings.AdminAccountEmail, agentStartPage, agentChat);
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
    ///Test Case 2411747: Verify OC old Customer Summary and new customer summary having it as anchor tab and additional tab (regular tab)
    /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2411747
    ///</summary>
    it("Test Case 2411747: Verify OC old Customer Summary and new customer summary having it as anchor tab and additional tab (regular tab)", async () => {
        agentPage = await agentContext.newPage();
        const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        const agentChat = new AgentChat(agentPage);
        try {
            await adminStartPage.navigateToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.OmnichannelAdminCenterApp);
            await macrosAdminPage.createApplicationTabInOC(Constants.OldCustomerSummary, Constants.OldCustomerSummaryUniqueName, Constants.EntityRecordOptionValue);
            await macrosAdminPage.insertParametersInOldSustumersummary();
            await macrosAdminPage.genericSession(Constants.SessionTemplateName, Constants.SessionTemplateUniqueName);
            await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);
            // Login as agent and accept chat
            await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(TestSettings.AdminAccountEmail, agentStartPage, agentChat);
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
    it("Test Case 2412690: Verify Knowledge search as anchor tab and also as an additional (Regular ) tab.", async () => {
        agentPage = await agentContext.newPage();
        const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        const agentChat = new AgentChat(agentPage);
        try {
            await adminStartPage.navigateToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
            await macrosAdminPage.anchorTabKnowledgeSearch();
            await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);
            await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(TestSettings.AdminAccountEmail,
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

    ///<summary>
    ///Test Case 2418287: Verify Notification should resolve odata and slug.
    ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2418287
    ///<summary> 
    it("Test Case 2418287: Verify Notification should resolve odata and slug.", async () => {
        agentPage = await agentContext.newPage();
        const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
        const agentChat = new AgentChat(agentPage);
        try {
            // Login As Admin and create Queue
            await adminStartPage.navigateToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
            await macrosAdminPage.createAdvancedQueue(Constants.QueueName);
            await macrosAdminPage.AddUsers(Constants.User);

            //Create Notification and workstream
            await macrosAdminPage.notification(Constants.NotificationName);
            await macrosAdminPage.createRecordWorkStream(Constants.WorkStreamName);
            await macrosAdminPage.createIntakeRule(Constants.IntakeRuleName);
            await macrosAdminPage.addNotificationInWorkStream();

            // Create routing rule
            await macrosAdminPage.createRecordRouting(Constants.AssociateCase3);
            await macrosAdminPage.createRoutingRuleSet(Constants.RuleName, Constants.RuleItemName, Constants.QueueName);

            // login to Omnichannel for customer service
            await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(TestSettings.AdminAccountEmail, agentStartPage, agentChat);
            await macrosAdminPage.openAppLandingPage(adminPage);

            // Create a case and route it to queue
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.createCase(Constants.CaseTitleName);
            await macrosAdminPage.AddQueueToExistingCases(Constants.CaseTitleName, Constants.QueueName);
            await macrosAdminPage.applyRoutingRuleToCase(Constants.CaseTitleName);

            //Verify the case title in the notification
            await macrosAdminPage.validateTheNotification(agentPage, Constants.CaseLink1);

            //This tescase has an existing bug so cannot verify the customer name.
            //Please refer the bug for more information https://dev.azure.com/dynamicscrm/OneCRM/_workitems/edit/2625406
        }
        finally {
            await macrosAdminPage.deleteCase(adminPage, adminStartPage, Constants.CaseTitleName);
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
            await macrosAdminPage.deleteRoutingRuleSet();
            await macrosAdminPage.deleteRecordWorkstream(Constants.WorkStreamName);
            await macrosAdminPage.deleteAdvanceQueue(Constants.QueueName);
            await macrosAdminPage.deleteRecordRouting();
            await macrosAdminPage.deleteNotification(Constants.NotificationName);
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
        try {
            //Login as admin automated and redirected to OrgUrl
            await adminStartPage.navigateToOrgUrlAndSignIn(
                TestSettings.AdminAccountEmail,
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
        }
        finally {
            console.log("validation Successfully");
        }
    });
});