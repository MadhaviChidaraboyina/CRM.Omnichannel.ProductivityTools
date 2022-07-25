import { BrowserContext, Page } from "playwright";
import { Constants } from "../../common/constants";
import { LiveChatPage } from "../../../pages/LiveChat";
import { Macros } from "../../macros/pages/macrosAdmin";
import { OrgDynamicsCrmStartPage } from "../../../pages/org-dynamics-crm-start.page";
import { TestHelper } from "../../../helpers/test-helper";
import { TestSettings } from "../../../configuration/test-settings";

describe("Application Setup - ", () => {
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
    ///Test Case 2045176: [Application Setup] : Verify if app allows access only to system administrator and system customizers
    /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045176
    ///</summary>
    it("Test Case 2045176: [Application Setup] : Verify if app allows access only to system administrator and system customizers", async () => {
        agentPage = await agentContext.newPage();
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        try {
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
        finally {
            console.log("validation Successfully");
        }
    });

    ///<summary>
    ///Test Case 2045183: [Application Setup] : Verify Queues in Customer WorkSpace App that are created in Customer Service Hub
    ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045183
    ///<summary>
    it("Test Case 2045183: [Application Setup] : Verify Queues in Customer WorkSpace App that are created in Customer Service Hub", async () => {
        agentPage = await agentContext.newPage();
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        try {
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
        finally {
            await macrosAdminPage.deleteCase(adminPage, adminStartPage, Constants.CaseTitleName);
            await macrosAdminPage.deleteCase(adminPage, adminStartPage, Constants.CaseTitleName2);
            await macrosAdminPage.deleteCase(adminPage, adminStartPage, Constants.CaseTitleName3);
            await macrosAdminPage.deleteQueue(adminPage, adminStartPage, Constants.QueueTitle);
        }
    });
});