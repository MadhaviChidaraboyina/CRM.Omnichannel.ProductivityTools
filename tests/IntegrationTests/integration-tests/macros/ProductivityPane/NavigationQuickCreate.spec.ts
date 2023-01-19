import { BrowserContext, Page } from "playwright";
import { Macros } from "../../macropages/macrosAdmin";
import { OrgDynamicsCrmStartPage } from "../../../pages/org-dynamics-crm-start.page";
import { TestHelper } from "../../../helpers/test-helper";
import { TestSettings } from "../../../configuration/test-settings";
import { Constants } from "integration-tests/common/constants";
import { AgentChat } from "pages/AgentChat";
import { AgentScript } from "integration-tests/agentScript/pages/agentScriptAdmin";
import { stringFormat } from "../../../Utility/Constants";

describe("Navigation QuickCreate Case", () => {
  let adminContext: BrowserContext;
  let adminPage: Page;
  let adminStartPage: OrgDynamicsCrmStartPage;
  let macrosAdminPage: Macros;
  let agentChat: AgentChat;
  let agentContext: BrowserContext;
  let agentScriptAdminPage: AgentScript;
  let agentPage: Page;
  let rnd;
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
    agentScriptAdminPage = new AgentScript(adminPage);
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
    rnd = agentScriptAdminPage.RandomNumber();
    //Login as admin and create cases
    await adminStartPage.navigateToOrgUrlAndSignIn(
      TestSettings.AdminAccountEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await adminStartPage.navigateToURL(Constants.NewUI);
    await adminStartPage.waitForAgentStatusIcon();
    var CaseTitleName = Constants.CaseTitleName + rnd;
    caseNameList = [CaseTitleName];
    await macrosAdminPage.createIncidents(agentChat, caseNameList);
    await macrosAdminPage.InitiateSession(
      CaseTitleName,
      stringFormat(Constants.SpecificCaseLink1, rnd)
    );
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await macrosAdminPage.quickCreateCaseInCSW(Constants.CaseTitleName2 + rnd);
    const recordExist = await macrosAdminPage.verifyViewTabRecord(Constants.SpecificCaseLink2.replace("{0}", rnd));
    expect(recordExist).toBeTruthy();
    });
});