import { BrowserContext, Page } from "playwright";
import { Macros } from "../../macropages/macrosAdmin";
import { OrgDynamicsCrmStartPage } from "../../../pages/org-dynamics-crm-start.page";
import { TestHelper } from "../../../helpers/test-helper";
import { TestSettings } from "../../../configuration/test-settings";
import { Constants } from "integration-tests/common/constants";
import { AgentChat } from "pages/AgentChat";

describe("Navigation QuickCreate Case", () => {
  let adminContext: BrowserContext;
  let adminPage: Page;
  let adminStartPage: OrgDynamicsCrmStartPage;
  let macrosAdminPage: Macros;
  let agentChat: AgentChat;
  var caseNameList: string[] = [];

  beforeEach(async () => {
    adminContext = await browser.newContext({
      viewport: TestSettings.Viewport, extraHTTPHeaders: {
        origin: "",
      },
    });
    adminPage = await adminContext.newPage();
    adminStartPage = new OrgDynamicsCrmStartPage(adminPage);
    macrosAdminPage = new Macros(adminPage);
    agentChat = new AgentChat(adminPage);
  });
  afterEach(async () => {
    TestHelper.dispose(adminContext);
  });

  ///<summary>
  ///Test Case 2907356: [CSW] [Navigation] [Quick Create] When any entity record is created using Quick Create with non-Home Session in Background and clicked on View Record, it should open in new Session.
  ///Test Case Link https://dev.azure.com/dynamicscrm/OneCRM/_workitems/edit/2907356
  ///</summary>
  it("Test Case 2907356: [CSW] [Navigation] [Quick Create] When any entity record is created using Quick Create with non-Home Session in Background and clicked on View Record, it should open in new Session.", async () => {
    //Login as admin and create cases
    await adminStartPage.navigateToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await adminStartPage.navigateToURL(Constants.NewUI);
    await adminStartPage.waitForAgentStatusIcon();
    caseNameList = [Constants.CaseTitleName];
    await macrosAdminPage.createIncidents(agentChat, caseNameList);
    await macrosAdminPage.InitiateSession(
      Constants.CaseTitleName,
      Constants.CaseLink1
    );
    await macrosAdminPage.quickCreateCaseInCSW(Constants.CaseTitleName2);
    const recordExist = await macrosAdminPage.verifyViewTabRecord(Constants.CaseLink2);
    expect(recordExist).toBeTruthy();
  });

});