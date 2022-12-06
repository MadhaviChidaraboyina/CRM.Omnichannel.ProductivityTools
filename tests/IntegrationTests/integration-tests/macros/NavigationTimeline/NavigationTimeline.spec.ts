import { BrowserContext, Page } from "playwright";
import { Constants } from "../../common/constants";
import { Macros } from "../../macropages/macrosAdmin";
import { OrgDynamicsCrmStartPage } from "../../../pages/org-dynamics-crm-start.page";
import { TestHelper } from "../../../helpers/test-helper";
import { TestSettings } from "../../../configuration/test-settings";

describe("Navigation and Timeline - ", () => {
    let adminContext: BrowserContext;
    let adminPage: Page;
    let adminStartPage: OrgDynamicsCrmStartPage;
    let agentPage: Page;
    let agentContext: BrowserContext;
    let liveChatContext: BrowserContext;
    let macrosAdminPage: Macros;

    beforeEach(async () => {
        adminContext = await browser.newContext({
            viewport: TestSettings.Viewport, extraHTTPHeaders: {
                origin: "",
            },
        });
        liveChatContext = await browser.newContext({
            viewport: TestSettings.Viewport, extraHTTPHeaders: {
                origin: "",
            }, acceptDownloads: true,
        });
        agentContext = await browser.newContext({
            viewport: TestSettings.Viewport, extraHTTPHeaders: {
                origin: "",
            }, acceptDownloads: true,
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
    ///Test Case 2907374: [CSW] [Navigation] [Timeline] Email should open in new App Tab
    ///Test Case Link: https://dev.azure.com/dynamicscrm/OneCRM/_workitems/edit/2907374
    ///<summary>
    it("Test Case 2907374: [CSW] [Navigation] [Timeline] Email should open in new App Tab", async () => {
        agentPage = await agentContext.newPage();

        //Login as admin and create case in CSH app
        await adminStartPage.navigateToOrgUrlAndSignIn(
            TestSettings.AdminAccountEmail,
            TestSettings.AdminAccountPassword
        );
        await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
        await macrosAdminPage.createCase(Constants.CaseTitleName);

        //Go to CSW app
        await macrosAdminPage.openAppLandingPage(adminPage);
        await adminStartPage.goToCustomerServiceWorkspace();

        await adminStartPage.navigateToURL(Constants.NewUI);

        //Initiate session and validate email is opened in new app tab
        await macrosAdminPage.InitiateSession(
            Constants.CaseTitleName,
            Constants.CaseLink1
        );
        const PageValidate = await macrosAdminPage.verifyEmailOpenedInNewAppTab();
        expect(PageValidate).toEqual(true);
    });
});