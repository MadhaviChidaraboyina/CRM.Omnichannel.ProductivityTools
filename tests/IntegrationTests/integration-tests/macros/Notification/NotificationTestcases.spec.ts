import { BrowserContext, Page } from "playwright";
import { Constants } from "../../common/constants";
import { OrgDynamicsCrmStartPage } from "../../../pages/org-dynamics-crm-start.page";
import { TestHelper } from "../../../helpers/test-helper";
import { TestSettings } from "../../../configuration/test-settings";
import { Macros } from "integration-tests/macropages/macrosAdmin";
import { AgentScript } from "integration-tests/agentScript/pages/agentScriptAdmin";
import { getGUID } from "helpers/odata-helper";

describe("Notification - ", () => {
    let adminContext: BrowserContext;
    let adminPage: Page;
    let adminStartPage: OrgDynamicsCrmStartPage;
    let agentPage: Page;
    let agentContext: BrowserContext;
    let liveChatContext: BrowserContext;
    let macrosAdminPage: Macros;
    let rnd: any;
    const agentScriptAdminPage = new AgentScript(adminPage);

    beforeEach(async () => {
        adminContext = await browser.newContext({
            viewport: TestSettings.Viewport, extraHTTPHeaders: {
                origin: "",
            }
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
    ///Test Case 2907345: [CSW] [Navigation][Notification] Focus should shift back to previous session when changed to other session and clicked on previous Notification Hyperlink.
    /// Test Case Link https://dev.azure.com/dynamicscrm/OneCRM/_workitems/edit/2907345
    ///</summary>
    it("Test Case 2907345: [CSW] [Navigation][Notification] Focus should shift back to previous session when changed to other session and clicked on previous Notification Hyperlink.", async () => {
        agentPage = await agentContext.newPage();
        rnd = agentScriptAdminPage.RandomNumber();
        try {
            //Login as 'Admin automated' and redirected to OrgUrl
            await adminStartPage.navigateToOrgUrlAndSignIn(
                TestSettings.AdminAccountEmail1,
                TestSettings.AdminAccountPassword
            );
            await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
            await macrosAdminPage.CreateCaseInCSW(Constants.Case1 + rnd);
            await macrosAdminPage.CreateCaseInCSW(Constants.Case2 + rnd);
            await macrosAdminPage.enableNewLayout();
            const incidentId = await macrosAdminPage.incidentId(Constants.Case1 + rnd);
            const UserUrl1 = `${TestSettings.OrgUrl}/api/data/V9.2/systemusers?$filter=domainname eq '${TestSettings.AdminAccountEmail1}'`;
            const userId = await getGUID(UserUrl1);
            await macrosAdminPage.enableNotificationText();
            await macrosAdminPage.enableNotificationIcon(userId, incidentId);
            await macrosAdminPage.CSWAppDesignerPage();
            await macrosAdminPage.enableInAppNotificatiosAndValidate(Constants.Case1 + rnd);
        } finally {
            //await macrosAdminPage.disableNewLayout();
        }
    });
});
