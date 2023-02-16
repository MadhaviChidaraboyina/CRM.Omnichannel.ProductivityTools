import { BrowserContext, Page } from "playwright";
import { Constants } from "../../common/constants";
import { Macros } from "../../macropages/macrosAdmin";
import { OrgDynamicsCrmStartPage } from "../../../pages/org-dynamics-crm-start.page";
import { TestHelper } from "../../../helpers/test-helper";
import { TestSettings } from "../../../configuration/test-settings";

describe("Navigation and ViewRecord - ", () => {
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
    ///Test Case 2907355: [CSW] [Navigation] [Quick Create]When any entity record is created using Quick Create with Home Session in Background and clicked on View Record,it should open in new Session.
    ///Test Case Link  https://dev.azure.com/dynamicscrm/OneCRM/_workitems/edit/2907355
    ///<summary>        
    it("Test Case 2907355: [CSW] [Navigation] [Quick Create]When any entity record is created using Quick Create with Home Session in Background and clicked on View Record,it should open in new Session.", async () => {
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
            Constants.GlobalCaseTitleName
        );
        const boolean = await macrosAdminPage.verifyViewRecord()
        expect(boolean).toBeTruthy();
    });

});
