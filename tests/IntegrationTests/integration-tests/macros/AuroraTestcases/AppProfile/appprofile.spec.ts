import { BrowserContext, Page } from "playwright";
import { Constants } from "../../../common/constants";
import { Macros } from "../../../macropages/macrosAdmin";
import { OrgDynamicsCrmStartPage } from "../../../../pages/org-dynamics-crm-start.page";
import { TestHelper } from "../../../../helpers/test-helper";
import { TestSettings } from "../../../../configuration/test-settings";

describe("App Profile Test Scenerios - ", () => {
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
    ///Test Case 2045219: [App Profile Manager] : Verify Shift click, control click, actions with csm(roles csr manager, app access, productivity tool user) with Default App Profile
    /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045219
    ///</summary>
    it("Test Case 2045219: [App Profile Manager] : Verify Shift click, control click, actions with csm(roles csr manager, app access, productivity tool user) with Default App Profile", async () => {
        agentPage = await agentContext.newPage();
        try {
            //Login as admin and create case
            await adminStartPage.navigateToOrgUrlAndSignIn(
                TestSettings.AdminAccountEmail,
                TestSettings.AdminAccountPassword
            );
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.createCase(Constants.CaseTitleName);
            //Initiate Tab and validate Page and close tab
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToCustomerServiceWorkspace();
            await macrosAdminPage.InitiateTab(
                Constants.CaseTitleName,
                Constants.CaseLink1
            );
            await macrosAdminPage.ValidateThePage(Constants.TabNoProdu);
            await macrosAdminPage.CloseTab(Constants.CloseTab);
            //Initiate Session and validate page
            await macrosAdminPage.InitiateSession(
                Constants.CaseTitleName,
                Constants.CaseLink1
            );
            await macrosAdminPage.ValidateThePage(Constants.ProductivityPaneEnable);
            await macrosAdminPage.ValidateThePage(Constants.ValidateSuggestion);
            //Open Agent Script tool and validate
            await macrosAdminPage.ClickProductivityPaneTool(Constants.AStool);
            await macrosAdminPage.ValidateThePage(Constants.AStool);
            //Open Knowledge search tool and validate
            await macrosAdminPage.ClickProductivityPaneTool(Constants.KStool);
            await macrosAdminPage.ValidateThePage(Constants.ValidateKSResults);
        } finally {
            await macrosAdminPage.deleteCase(
                adminPage,
                adminStartPage,
                Constants.CaseTitleName
            );
        }
    });

    ///<summary>
    ///Test Case 2045223: [App Profile Manager] : Verify Shift click, control click, actions with csr(roles csr, app access, productivity tool user) with Default App Profile
    /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045223
    ///</summary>
    it("Test Case 2045223: [App Profile Manager] : Verify Shift click, control click, actions with csr(roles csr, app access, productivity tool user) with Default App Profile", async () => {
        agentPage = await agentContext.newPage();
        try {
            //Login as admin and create case
            await adminStartPage.navigateToOrgUrlAndSignIn(
                TestSettings.AdminAccountEmail,
                TestSettings.AdminAccountPassword
            );
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.createCase(Constants.CaseTitleName);
            //Initiate Tab and validate Page and close tab
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToCustomerServiceWorkspace();
            await macrosAdminPage.InitiateTab(
                Constants.CaseTitleName,
                Constants.CaseLink1
            );
            await macrosAdminPage.ValidateThePage(Constants.TabNoProdu);
            await macrosAdminPage.CloseTab(Constants.CloseTab);
            //Initiate Session and validate page
            await macrosAdminPage.InitiateSession(
                Constants.CaseTitleName,
                Constants.CaseLink1
            );
            await macrosAdminPage.ValidateThePage(Constants.ProductivityPaneEnable);
            await macrosAdminPage.ValidateThePage(Constants.ValidateSuggestion);
            //Open Agent Script tool and validate
            await macrosAdminPage.ClickProductivityPaneTool(Constants.AStool);
            await macrosAdminPage.ValidateThePage(Constants.AStool);
            //Open Knowledge search tool and validate
            await macrosAdminPage.ClickProductivityPaneTool(Constants.KStool);
            await macrosAdminPage.ValidateThePage(Constants.ValidateKSResults);
        } finally {
            await macrosAdminPage.deleteCase(
                adminPage,
                adminStartPage,
                Constants.CaseTitleName
            );
        }
    });

});