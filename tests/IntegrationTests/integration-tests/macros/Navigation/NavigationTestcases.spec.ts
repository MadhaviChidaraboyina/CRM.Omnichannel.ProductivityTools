import { BrowserContext, Page } from "playwright";
import { Constants } from "../../common/constants";
import { OrgDynamicsCrmStartPage } from "../../../pages/org-dynamics-crm-start.page";
import { TestHelper } from "../../../helpers/test-helper";
import { TestSettings } from "../../../configuration/test-settings";
import { Macros } from "integration-tests/macropages/macrosAdmin";
import { AgentScript } from "integration-tests/agentScript/pages/agentScriptAdmin";

describe("Navigation - ", () => {
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
  ///Test Case 2907364: [CSW] [Navigation] [Navigate Button] Navigation through Navigate Button on Entity Form should open in New Tab
  /// Test Case Link https://dev.azure.com/dynamicscrm/OneCRM/_workitems/edit/2907364
  ///</summary>
  it("Test Case 2907364: [CSW] [Navigation] [Navigate Button] Navigation through Navigate Button on Entity Form should open in New Tab", async () => {
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
      const incidentId = await macrosAdminPage.incidentId(Constants.Case1 + rnd);
      await macrosAdminPage.enableNewLayout();
      await macrosAdminPage.CSWAppDesignerPage();
      const data = `function navigateCase() {
        Xrm.Navigation.navigateTo(
        {pageType: "entityrecord",
        entityName: "incident",
        entityId: "`+ incidentId + `"}
        )
      }`
      const webresource = {
        name: "TextFile" + rnd + ".js",
        mimeType: "application/javascript",
        buffer: Buffer.from(data),
      };
      await macrosAdminPage.editCommandBar(Constants.labelName +rnd,Constants.Case2 + rnd,Constants.Case1 + rnd,webresource);
    } finally {
      await macrosAdminPage.disableNewLayout();
    }
  });
});
