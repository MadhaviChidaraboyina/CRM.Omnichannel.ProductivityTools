import { BrowserContext, Page } from "playwright";
import { Constants } from "../../common/constants";
import { Macros } from "../../macros/pages/macrosAdmin";
import { OrgDynamicsCrmStartPage } from "../../../pages/org-dynamics-crm-start.page";
import { TestHelper } from "../../../helpers/test-helper";
import { TestSettings } from "../../../configuration/test-settings";

describe("P.Tool Migration - ", () => {
    let adminContext: BrowserContext;
    let adminPage: Page;
    let adminStartPage: OrgDynamicsCrmStartPage;
    let agentPage: Page;
    let agentContext: BrowserContext;
    let liveChatContext: BrowserContext;
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
            await macrosAdminPage.GoToHome();
            await macrosAdminPage.ValidateThePage(Constants.NoProductivityPane);
        }
        finally {
            console.log("validation Successfully");
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
});