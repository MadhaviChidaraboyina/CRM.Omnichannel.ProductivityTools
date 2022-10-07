import { BrowserContext, Page } from "playwright";
import { Constants } from "../../../common/constants";
import { LiveChatPage } from "../../../../pages/LiveChat";
import { Macros } from "../../../macropages/macrosAdmin";
import { OrgDynamicsCrmStartPage } from "../../../../pages/org-dynamics-crm-start.page";
import { TestHelper } from "../../../../helpers/test-helper";
import { TestSettings } from "../../../../configuration/test-settings";
import { AgentScript } from "integration-tests/agentScript/pages/agentScriptAdmin";
import { AgentChat } from "pages/AgentChat";

describe("Productivity Pane Test Scenerios - ", () => {
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
    ///Test Case 2045250: [Productivity Pane: Smart Assist] : Setup smart assist using customer service hub for similar case and article suggestions
    ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045250
    ///<summary>
    it("Test Case 2045250: [Productivity Pane: Smart Assist] : Setup smart assist using customer service hub for similar case and article suggestions", async () => {
        agentPage = await agentContext.newPage();
        try {
            //Login as admin and create case
            await adminStartPage.navigateToOrgUrlAndSignIn(
                TestSettings.AdminAccountEmail,
                TestSettings.AdminAccountPassword
            );
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.GoToServiceManagement();
            await macrosAdminPage.SetupSmartAssist();
            //validating simmilar suggestions and KB suggestions
            await macrosAdminPage.ValidateThePage(Constants.SimilarSuggestionsinCSH);
            await macrosAdminPage.ValidateThePage(Constants.KBSuggestionsinCSH);
            await macrosAdminPage.EnableSuggestionsInCSH();
        } finally {
            console.log("validation Successfully");
        }
    });

    ///<summary>
    /// Test Case 2045254: [Productivity Pane: Smart Assist] : Validate if KB and similar case sugestions are turned back on from CSH, it doesn't break
    ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045254
    ///<summary>
    it("Test Case 2045254: [Productivity Pane: Smart Assist] : Validate if KB and similar case sugestions are turned back on from CSH, it doesn't break", async () => {
        agentPage = await agentContext.newPage();
        try {
            //Login as admin and create case & TurnOffSuggestions
            await adminStartPage.navigateToOrgUrlAndSignIn(
                TestSettings.AdminAccountEmail,
                TestSettings.AdminAccountPassword
            );
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.createCase(Constants.CaseTitleName);
            await macrosAdminPage.TurnOffSuggestions(adminPage, adminStartPage);
            //Initiate session and validate
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
            await macrosAdminPage.InitiateSession(
                Constants.CaseTitleName,
                Constants.CaseLink1
            );
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
            await macrosAdminPage.InitiateSession(
                Constants.CaseTitleName,
                Constants.CaseLink1
            );
            await macrosAdminPage.ValidateThePage(Constants.CloseSession1);
            await macrosAdminPage.ValidateThePage(Constants.Smartassist);
        } finally {
            await macrosAdminPage.deleteCaseInCSH(
                adminPage,
                adminStartPage,
                Constants.CaseTitleName
            );
        }
    });

    ///<summary>
    ///Test Case Test Case 2045258: [Productivity Pane: Smart Assist] : Verify focus is Returning to opened article when card is clicked again
    ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045258
    ///<summary>
    it("Test Case 2045258: [Productivity Pane: Smart Assist] : Verify focus is Returning to opened article when card is clicked again", async () => {
        agentPage = await agentContext.newPage();
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        try {
            // Login as Admin
            await adminStartPage.navigateToOrgUrlAndSignIn(
                TestSettings.AdminAccountEmail,
                TestSettings.AdminAccountPassword
            );
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
            await macrosAdminPage.CreateCaseInCSW(
                Constants.CaseTitleName
            );
            await macrosAdminPage.InitiateSession(
                Constants.CaseTitleName,
                Constants.CaseLink1
            );
            await macrosAdminPage.ValidateThePage(Constants.ValKBSuggestionsinCSW);
            // Open Similar Cards and validate it
            await macrosAdminPage.OpenValidateArticle(
                Constants.KArticleOpen
            );
            await macrosAdminPage.OpenCaseSession(
                Constants.KArticleHome
            );
            await macrosAdminPage.OpenValidateArticle(
                Constants.KArticleOpen
            );
        } finally {
            await macrosAdminPage.deleteCase(
                adminPage,
                adminStartPage,
                Constants.CaseTitleName
            );
        }
    });

    ///<summary>
    ///Test Case 2045261: [Productivity Pane: Smart Assist] : Verify Copy URL action with appropriate contextual message
    ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045261
    ///<summary>
    it("Test Case 2045261: [Productivity Pane: Smart Assist] : Verify Copy URL action with appropriate contextual message", async () => {
        agentPage = await agentContext.newPage();
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        try {
            // Login as Admin
            await adminStartPage.navigateToOrgUrlAndSignIn(
                TestSettings.AdminAccountEmail,
                TestSettings.AdminAccountPassword
            );
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
            await macrosAdminPage.CreateCaseInCSW(
                Constants.CaseTitleName
            );
            await macrosAdminPage.InitiateSession(
                Constants.CaseTitleName,
                Constants.CaseLink1
            );
            await macrosAdminPage.ValidateThePage(Constants.ValKBSuggestionsinCSW);
            // Copy URL and validate it
            await macrosAdminPage.CopyURL();
            await macrosAdminPage.ValidateThePage(Constants.ProperMsgForCopyURL);
        } finally {
            await macrosAdminPage.deleteCase(
                adminPage,
                adminStartPage,
                Constants.CaseTitleName
            );
        }
    });

    ///<summary>
    ///Test Case 2045262: [Productivity Pane: Smart Assist] : Verify Email URL action is working
    ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045262
    ///</summary>
    it("Test Case 2045262: [Productivity Pane: Smart Assist] : Verify Email URL action is working", async () => {
        agentPage = await agentContext.newPage();
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        try {
            await adminStartPage.navigateToOrgUrlAndSignIn(
                TestSettings.AdminAccountEmail,
                TestSettings.AdminAccountPassword
            );
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.GoToServiceManagement();
            await macrosAdminPage.SetupSmartAssist();
            //validating simmilar suggestions and KB suggestions
            await macrosAdminPage.ValidateThePage(Constants.SimilarSuggestionsinCSH);
            await macrosAdminPage.ValidateThePage(Constants.KBSuggestionsinCSH);
            await macrosAdminPage.EnableSuggestionsInCSH();
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToCustomerServiceWorkspace();
            await macrosAdminPage.CreateCaseInCSW(
                Constants.CaseTitleName
            );
            await macrosAdminPage.InitiateSession(
                Constants.CaseTitleName,
                Constants.CaseLink1
            );
            //validating simmilar suggestions in samrt assist
            await macrosAdminPage.ValidateThePage(Constants.ValKBSuggestionsinCSW);
            await macrosAdminPage.EmailURL();
            //validating the email body contains the URL
            await macrosAdminPage.ValidateTheEmailBody(Constants.Email);
            await macrosAdminPage.ValidateThePage(Constants.NewMail);
        } finally {
            await macrosAdminPage.deleteCase(
                adminPage,
                adminStartPage,
                Constants.CaseTitleName
            );
        }
    });

    ///<summary>
    /// Test Case 2045263: [Productivity Pane: Smart Assist] : Verify Email content action worked
    ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045263
    ///<summary>
    it("Test Case 2045263: [Productivity Pane: Smart Assist] : Verify Email content action worked", async () => {
        agentPage = await agentContext.newPage();
        try {
            //Login as admin and create case
            await adminStartPage.navigateToOrgUrlAndSignIn(
                TestSettings.AdminAccountEmail,
                TestSettings.AdminAccountPassword
            );
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
            await macrosAdminPage.InitiateSession(
                Constants.CaseTitleName,
                Constants.CaseLink1
            );
            await macrosAdminPage.ValidateThePage(Constants.CloseSession1);
            await macrosAdminPage.ValidateThePage(Constants.ValKBSuggestionsinCSW);
            await macrosAdminPage.EmailContent();
            await macrosAdminPage.ValidateTheEmailBody(Constants.Email);
            await macrosAdminPage.ValidateThePage(Constants.NewMail);
        } finally {
            await macrosAdminPage.deleteCaseInCSH(
                adminPage,
                adminStartPage,
                Constants.CaseTitleName
            );
        }
    });

    ///<summary>
    ///Test Case 2045253: [Productivity Pane: Smart Assist] : Validate if KB and similar case sugestions are turned off from CSH, message is shown on smart assist
    ///Test Case Link: https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045253
    ///</summary>
    it("Test Case 2045253: [Productivity Pane: Smart Assist] : Validate if KB and similar case sugestions are turned off from CSH, message is shown on smart assist", async () => {
        agentPage = await agentContext.newPage();
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        try {
            //Login as admin and create case
            await adminStartPage.navigateToOrgUrlAndSignIn(
                TestSettings.AdminAccountEmail,
                TestSettings.AdminAccountPassword
            );
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.createCase(Constants.CaseTitleName);
            await macrosAdminPage.TurnOffSuggestions(adminPage, adminStartPage);
            //Initiate Session and Validate
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToCustomerServiceWorkspace();
            await macrosAdminPage.InitiateSession(
                Constants.CaseTitleName,
                Constants.CaseLink1
            );
            await macrosAdminPage.VerifyReloadSuggestionsInCSW();
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToCustomerServiceWorkspace();
            await macrosAdminPage.InitiateSession(
                Constants.CaseTitleName,
                Constants.CaseLink1
            );
            await macrosAdminPage.VerifySuggestionsInCSW();
        } finally {
            await macrosAdminPage.deleteCaseInCSH(
                adminPage,
                adminStartPage,
                Constants.CaseTitleName
            );
            await macrosAdminPage.TurnOnSuggestions();
        }
    });

    ///<summary>
    ///Test Case 2045252: [Productivity Pane: Smart Assist] : Verify if smart assist is available with default configuration
    ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045252
    ///<summary>
    it("Test Case 2045252: [Productivity Pane: Smart Assist] : Verify if smart assist is available with default configuration", async () => {
        agentPage = await agentContext.newPage();
        try {
            //Login as admin and create case
            await adminStartPage.navigateToOrgUrlAndSignIn(
                TestSettings.AdminAccountEmail,
                TestSettings.AdminAccountPassword
            );
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.createCase(Constants.CaseTitleName);
            //Initiate session
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToCustomerServiceWorkspace();
            await macrosAdminPage.GoToCases();
            await macrosAdminPage.InitiateSession(
                Constants.CaseTitleName,
                Constants.CaseLink1
            );
            await macrosAdminPage.ValidateThePage(Constants.CloseSession1);
            await macrosAdminPage.ValidateThePage(Constants.Smartassist);
        } finally {
            await macrosAdminPage.deleteCaseInCSH(
                adminPage,
                adminStartPage,
                Constants.CaseTitleName
            );
        }
    });

    ///<summary>
    ///Test Case 2045297: [Productivity Pane: Knowledge Search] : Validate all available actions from knowledge search control (search, link, etc.)
    /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045297
    ///</summary>
    it("Test Case 2045297: [Productivity Pane: Knowledge Search] : Validate all available actions from knowledge search control (search, link, etc.)", async () => {
        agentPage = await agentContext.newPage();
        try {
            //Login as admin and create case
            await adminStartPage.navigateToOrgUrlAndSignIn(
                TestSettings.AdminAccountEmail,
                TestSettings.AdminAccountPassword
            );
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.createCase(Constants.CaseTitleName);
            //Initiate session
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToCustomerServiceWorkspace();
            await macrosAdminPage.InitiateSession(
                Constants.CaseTitleName,
                Constants.CaseLink1
            );
            //Open Knowledge search tool and validate given conditions
            await macrosAdminPage.ClickProductivityPaneTool(Constants.KStool);
            await macrosAdminPage.ValidateThePage(Constants.KStool);
            await macrosAdminPage.ValidateThePage(Constants.ValidateKSResults);
            await macrosAdminPage.ValidateThePage(Constants.SearchKSArticle);
            await macrosAdminPage.ValidateThePage(Constants.KSLinkBtn);
        } finally {
            await macrosAdminPage.deleteCase(
                adminPage,
                adminStartPage,
                Constants.CaseTitleName
            );
        }
    });

    ///<summary>
    ///Test Case 2045280: [Productivity Pane: Smart Assist] : Verify Copy resolution action with appropriate contextual message
    ///Test Case Link: https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045280
    ///</summary>
    it("Test Case 2045280: [Productivity Pane: Smart Assist] : Verify Copy resolution action with appropriate contextual message", async () => {
        agentPage = await agentContext.newPage();
        const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        const agentChat = new AgentChat(agentPage);
        const agentScriptAdminPage = new AgentScript(adminPage);
        try {
            //Login as admin and create case
            await adminStartPage.navigateToOrgUrlAndSignIn(
                TestSettings.AdminAccountEmail,
                TestSettings.AdminAccountPassword
            );
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.createCase(Constants.CaseTitleName);
            //Initiate Session and Validate
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToCustomerServiceWorkspace();
            await macrosAdminPage.InitiateSession(
                Constants.CaseTitleName,
                Constants.CaseLink1
            );
            await macrosAdminPage.VerifyCopyResolution();
        } finally {
            await macrosAdminPage.deleteCaseInCSH(
                adminPage,
                adminStartPage,
                Constants.CaseTitleName
            );
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
            await adminStartPage.navigateToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
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
});