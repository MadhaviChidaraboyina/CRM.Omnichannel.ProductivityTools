import { BrowserContext, Page } from "playwright";
import { Constants } from "../../common/constants";
import { LiveChatPage } from "../../../pages/LiveChat";
import { Macros } from "../../macropages/macrosAdmin";
import { OrgDynamicsCrmStartPage } from "../../../pages/org-dynamics-crm-start.page";
import { TestHelper } from "../../../helpers/test-helper";
import { TestSettings } from "../../../configuration/test-settings";
import { AgentChatConstants } from "Utility/Constants";
import { AppProfileHelper } from "helpers/appprofile-helper";

describe("Navigation and Gestures - ", () => {
    let adminContext: BrowserContext;
    let adminPage: Page;
    let adminStartPage: OrgDynamicsCrmStartPage;
    let agentPage: Page;
    let agentContext: BrowserContext;
    let liveChatContext: BrowserContext;
    let liveChatPage: LiveChatPage;
    let macrosAdminPage: Macros;

    beforeAll(async () => {
        await AppProfileHelper.getInstance().CreateAppProfile();
    })

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
    ///Test Case 2045186: [Navigation and Gestures] : Verify if records can be opened as sessions from case views
    ///Test Case Link  https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045186
    ///<summary>        
    it("Test Case 2045186: [Navigation and Gestures] : Verify if records can be opened as sessions from case views", async () => {
        agentPage = await agentContext.newPage();
        let casetitle;
        try {
            //Login as admin and create two cases and initiate it and verify
            await adminStartPage.navigateToOrgUrlAndSignIn(TestSettings.AgentEmailSecond, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            casetitle = await macrosAdminPage.createCaseForNandG(Constants.CaseTitleName);
            //Initiate session and validate
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
            await adminStartPage.waitUntilSelectorIsVisible(AgentChatConstants.AgentScreenAvailablitySelector,
                AgentChatConstants.Five, adminStartPage.Page, Constants.FourThousandsMiliSeconds);
            await macrosAdminPage.GoToCases();
            await macrosAdminPage.InitiateNandGSession(casetitle, casetitle);
            await macrosAdminPage.ValidateNandGThePage(casetitle);
        }
        finally {
            await macrosAdminPage.deleteCaseInCSH(adminPage, adminStartPage, casetitle);
        }
    });

    ///<summary>
    ///Test Case 2045190: [Navigation and Gestures] : Verify if records can be opened as tabs from case views
    /// Test Case Link hhttps://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045190
    ///</summary>
    it("Test Case 2045190: [Navigation and Gestures] : Verify if records can be opened as tabs from case views)", async () => {
        agentPage = await agentContext.newPage();
        let casetitle;
        try {
            //Login as admin and create case
            await adminStartPage.navigateToOrgUrlAndSignIn(TestSettings.AgentEmailSecond, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            casetitle = await macrosAdminPage.createCaseForNandG(Constants.CaseTitleName);
            //Initiate session 
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
            await adminStartPage.waitUntilSelectorIsVisible(AgentChatConstants.AgentScreenAvailablitySelector,
                AgentChatConstants.Five, adminStartPage.Page, Constants.FourThousandsMiliSeconds);
            await macrosAdminPage.GoToCases();
            await macrosAdminPage.InitiateNandGTab(casetitle, casetitle);
            await macrosAdminPage.ValidateClosePage(casetitle);
        }
        finally {
            await macrosAdminPage.deleteCaseInCSH(adminPage, adminStartPage, casetitle);
        }
    });

    ///<summary>
    ///Test Case 2045193: [Navigation and Gestures] : Verify if records can be opened as tabs from queue views
    ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045193
    ///<summary> 
    it("Test Case 2045193: [Navigation and Gestures] : Verify if records can be opened as tabs from queue views", async () => {
        agentPage = await agentContext.newPage();
        let casetitle;
        try {
            await adminStartPage.navigateToOrgUrlAndSignIn(TestSettings.AgentEmailSecond, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            // Create a public Queue
            await macrosAdminPage.GoToServiceManagement();
            await macrosAdminPage.CreatePublicQueue(Constants.QueueTitle);
            await macrosAdminPage.GoToServices();
            casetitle = await macrosAdminPage.createCaseForNandG(Constants.CaseTitleName);
            await macrosAdminPage.AddQueueToExistingCases(casetitle, Constants.QueueTitle);
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
            await adminStartPage.waitUntilSelectorIsVisible(AgentChatConstants.AgentScreenAvailablitySelector,
                AgentChatConstants.Five, adminStartPage.Page, Constants.FourThousandsMiliSeconds);
            await macrosAdminPage.casesLinkedToQueue(Constants.QueueTitleText);
            await macrosAdminPage.ValidateTheQueueTitle(Constants.QueueNameText);
        }
        finally {
            await macrosAdminPage.deleteCase(adminPage, adminStartPage, casetitle);
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
        let casetitle;
        try {
            // Login as Admin and create a case
            await adminStartPage.navigateToOrgUrlAndSignIn(TestSettings.AgentEmailSecond, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            casetitle = await macrosAdminPage.createCaseForNandG(Constants.CaseTitleName);
            // Navigate to CSW and validate page
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToCustomerServiceWorkspace();
            await macrosAdminPage.GoToCases();
            await macrosAdminPage.InitiateNandGSession(casetitle, casetitle);
            await macrosAdminPage.ValidateNandGThePage(casetitle);
            await macrosAdminPage.ValidateClosePageinTab(casetitle);
        }
        finally {
            await macrosAdminPage.deleteCase(adminPage, adminStartPage, casetitle);
        }
    });
});