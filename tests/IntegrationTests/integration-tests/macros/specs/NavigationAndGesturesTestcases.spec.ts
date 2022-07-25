import { BrowserContext, Page } from "playwright";
import { Constants } from "../../common/constants";
import { LiveChatPage } from "../../../pages/LiveChat";
import { Macros } from "../../macros/pages/macrosAdmin";
import { OrgDynamicsCrmStartPage } from "../../../pages/org-dynamics-crm-start.page";
import { TestHelper } from "../../../helpers/test-helper";
import { TestSettings } from "../../../configuration/test-settings";

describe("Navigation and Gestures - ", () => {
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
    ///Test Case 2045186: [Navigation and Gestures] : Verify if records can be opened as sessions from case views
    ///Test Case Link  https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045186
    ///<summary>        
    it("Test Case 2045186: [Navigation and Gestures] : Verify if records can be opened as sessions from case views", async () => {
        agentPage = await agentContext.newPage();
        try {
            //Login as admin and create two cases and initiate it and verify
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.createCase(Constants.CaseTitleName);
            //Initiate session and validate
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
            await macrosAdminPage.GoToCases();
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName, Constants.CaseLink1);
            await macrosAdminPage.ValidateThePage(Constants.CloseSession1);
        }
        finally {
            await macrosAdminPage.deleteCaseInCSH(adminPage, adminStartPage, Constants.CaseTitleName);
        }
    });

    ///<summary>
    ///Test Case 2045190: [Navigation and Gestures] : Verify if records can be opened as tabs from case views
    /// Test Case Link hhttps://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045190
    ///</summary>
    it("Test Case 2045190: [Navigation and Gestures] : Verify if records can be opened as tabs from case views)", async () => {
        agentPage = await agentContext.newPage();
        try {
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
        finally {
            await macrosAdminPage.deleteCaseInCSH(adminPage, adminStartPage, Constants.CaseTitleName);
        }
    });

    ///<summary>
    ///Test Case 2045193: [Navigation and Gestures] : Verify if records can be opened as tabs from queue views
    ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045193
    ///<summary> 
    it("Test Case 2045193: [Navigation and Gestures] : Verify if records can be opened as tabs from queue views", async () => {
        agentPage = await agentContext.newPage();
        try {
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
        finally {
            await macrosAdminPage.deleteCase(adminPage, adminStartPage, Constants.CaseTitleName);
            await macrosAdminPage.deleteQueue(adminPage, adminStartPage, Constants.QueueTitle);
        }
    });

    ///<summary>
    ///Test Case Test Case 2045196: [Navigation and Gestures] : Verifiy if records can be opened in line from views
    ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045196
    ///<summary>
    it("Test Case 2045196: [Navigation and Gestures] : Verifiy if records can be opened in line from views", async () => {
        agentPage = await agentContext.newPage();
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        try {
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
        finally {
            await macrosAdminPage.deleteCase(adminPage, adminStartPage, Constants.CaseTitleName);
        }
    });
});