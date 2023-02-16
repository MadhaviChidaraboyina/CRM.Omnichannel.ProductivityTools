import { BrowserContext, Page } from "playwright";
import { Constants } from "../../common/constants";
import { Macros } from "../../macropages/macrosAdmin";
import { OrgDynamicsCrmStartPage } from "../../../pages/org-dynamics-crm-start.page";
import { TestHelper } from "../../../helpers/test-helper";
import { TestSettings } from "../../../configuration/test-settings";

describe("Navigation and GlobalSearch - ", () => {
    let adminContext: BrowserContext;
    let adminPage: Page;
    let adminStartPage: OrgDynamicsCrmStartPage;
    let agentPage: Page;
    let agentContext: BrowserContext;
    let macrosAdminPage: Macros;

    beforeEach(async () => {
        adminContext = await browser.newContext({
            viewport: TestSettings.Viewport, extraHTTPHeaders: {
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
        TestHelper.dispose(agentContext);
        TestHelper.dispose(adminContext);
    });

    ///<summary>
    ///Test Case 2907347: [CSW] [Navigation][Global Search] When an Entity record is searched and opened by clicking on that Entity record from Global Search and non-Home Session is in Background,the entity record should open in new Session.
    ///Test Case Link  https://dev.azure.com/dynamicscrm/OneCRM/_workitems/edit/2907347
    ///<summary>        
    it("Test Case 2907347: [CSW] [Navigation][Global Search] When an Entity record is searched and opened by clicking on that Entity record from Global Search and non-Home Session is in Background,the entity record should open in new Session.", async () => {
        agentPage = await agentContext.newPage();
        //Login as admin and create two cases and initiate it and verify
        await adminStartPage.navigateToOrgUrlAndSignIn(
          TestSettings.AdminAccountEmail, 
          TestSettings.AdminAccountPassword
        );
        await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
        await adminStartPage.waitForDomContentLoaded();
        await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
        await adminStartPage.navigateToURL(Constants.NewUI);
        await adminStartPage.waitForAgentStatusIcon();
        await macrosAdminPage.CreateCaseInCSW(
            Constants.CaseTitleName
        );
        await macrosAdminPage.CreateCaseInCSW(
            Constants.CaseTitleName2
        );
        await adminStartPage.waitForDomContentLoaded();
        await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
        const recordName = await macrosAdminPage.verifyRecordInGlobalSearch(Constants.CaseTitleName2);
        expect(recordName).toBeTruthy();
    });
});
