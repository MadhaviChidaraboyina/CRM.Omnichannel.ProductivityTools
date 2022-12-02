import { BrowserContext, Page } from "playwright";
import { Macros } from "../../macropages/macrosAdmin";
import { OrgDynamicsCrmStartPage } from "../../../pages/org-dynamics-crm-start.page";
import { TestHelper } from "../../../helpers/test-helper";
import { TestSettings } from "../../../configuration/test-settings";
import { AgentChat } from "../../../pages/AgentChat";
import { Constants } from "integration-tests/common/constants";

describe("Navigation QuickCreate Case", () => {
  let adminContext: BrowserContext;
  let adminPage: Page;
  let adminStartPage: OrgDynamicsCrmStartPage;
  let macrosAdminPage: Macros;
  let agentChat: AgentChat;

  beforeEach(async () => {
    adminContext = await browser.newContext({
      viewport: TestSettings.Viewport, extraHTTPHeaders: {
        origin: "",
      },
    });
    adminPage = await adminContext.newPage();
    adminStartPage = new OrgDynamicsCrmStartPage(adminPage);
    macrosAdminPage = new Macros(adminPage);
    agentChat = new AgentChat(adminPage)
  });
  
  afterEach(async () => {
    TestHelper.dispose(adminContext);
  });

  ///<summary>
  ///Test Case 2907357: [CSW] [Navigation] [Site Map]When any entity is opened from Sitemap, it should open in New App Tab and all the functionality of entity form [command bar, Timeline and Productivity Panel] should work fine.
  ///Test Case Link https://dev.azure.com/dynamicscrm/OneCRM/_workitems/edit/2907357
  ///</summary>
  it("Test Case 2907357: [CSW] [Navigation] [Site Map]When any entity is opened from Sitemap, it should open in New App Tab and all the functionality of entity form [command bar, Timeline and Productivity Panel] should work fine.", async () => {
    //Login as admin and create cases
    await adminStartPage.navigateToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await adminStartPage.navigateToURL(Constants.NewUI);
    await adminStartPage.waitForAgentStatusIcon();
    var caseNameList = [Constants.CaseTitleName,];
    await macrosAdminPage.createIncidents(agentChat, caseNameList);
    await macrosAdminPage.InitiateSession(
      Constants.CaseTitleName,
      Constants.CaseLink1
    );
    await macrosAdminPage.ValidateThePage(Constants.Smartassist);
    await macrosAdminPage.ClickProductivityPaneTool(Constants.KStool);
    await macrosAdminPage.ValidateThePage(Constants.Knowledgesearch);
    await macrosAdminPage.ValidateThePage(Constants.TimelineTile);
  });
});