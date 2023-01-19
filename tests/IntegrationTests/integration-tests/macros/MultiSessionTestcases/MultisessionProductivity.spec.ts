import { BrowserContext, Page } from "playwright";
import { Constants } from "../../common/constants";
import { LiveChatPage } from "../../../pages/LiveChat";
import { Macros } from "../../macropages/macrosAdmin";
import { OrgDynamicsCrmStartPage } from "../../../pages/org-dynamics-crm-start.page";
import { TestHelper } from "../../../helpers/test-helper";
import { TestSettings } from "../../../configuration/test-settings";
import { AppProfileHelper } from "helpers/appprofile-helper";
import { stringFormat } from "../../../Utility/Constants";
import { AgentScript } from "../../../integration-tests/agentScript/pages/agentScriptAdmin";
import { AgentChat } from "../../../pages/AgentChat";
import { ConstantMS } from "../MultiSessionTestcases/msConstants";
import { FunctionMS } from "../MultiSessionTestcases/msFunction";

describe("Multi Session - ", () => {
  let adminContext: BrowserContext;
  let adminPage: Page;
  let adminStartPage: OrgDynamicsCrmStartPage;
  let agentPage: Page;
  let agentChat: AgentChat;
  let agentContext: BrowserContext;
  let liveChatContext: BrowserContext;
  let liveChatPage: LiveChatPage;
  let macrosAdminPage: Macros;
  let rnd: any;
  const agentScriptAdminPage = new AgentScript(adminPage);
  var caseNameList: string[] = [];
  let msessionAdminPage: FunctionMS;

  beforeAll(async () => {
    await AppProfileHelper.getInstance().CreateAppProfile();
  });

  beforeEach(async () => {
    adminContext = await browser.newContext({
      viewport: TestSettings.CustomViewport,
      extraHTTPHeaders: {
        origin: "",
      },
    });
    liveChatContext = await browser.newContext({
      viewport: TestSettings.CustomViewport,
      extraHTTPHeaders: {
        origin: "",
      },
      acceptDownloads: true,
    });
    agentContext = await browser.newContext({
      viewport: TestSettings.CustomViewport,
      extraHTTPHeaders: {
        origin: "",
      },
      acceptDownloads: true,
    });
    adminPage = await adminContext.newPage();
    adminStartPage = new OrgDynamicsCrmStartPage(adminPage);
    macrosAdminPage = new Macros(adminPage);
    agentChat = new AgentChat(adminPage);
    msessionAdminPage = new FunctionMS(adminPage);
  });
  afterEach(async () => {
    TestHelper.dispose(adminContext);
    TestHelper.dispose(liveChatContext);
    TestHelper.dispose(agentContext);
  });

  ///<summary>
  ///Test Case 1942194: [Multi Session][Productivity Pane] Productivity pane maintains collapsed state during session switch events
  ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1942194
  ///</summary>
  it("Test Case 1942194: [Multi Session][Productivity Pane] Productivity pane maintains collapsed state during session switch events", async () => {
    rnd = agentScriptAdminPage.RandomNumber();
    await agentChat.navigateToOrgUrlAndSignIn(
      TestSettings.MultiSessionEmail,
      TestSettings.AdminAccountPassword
    );

    await agentChat.goToMyApp(Constants.CustomerServiceWorkspace);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);

    var CaseUserName = Constants.XRMCaseName + rnd;
    var CaseUserName2 = Constants.XRMCaseName2 + rnd;
    caseNameList = [CaseUserName, CaseUserName2];
    await macrosAdminPage.createIncidents(agentChat, caseNameList);

    //Navigate to CSW and intitiate sessions
    await macrosAdminPage.InitiateSession(
      CaseUserName,
      stringFormat(Constants.XRMSpecificCaseLink1, rnd)
    );
    await macrosAdminPage.GoToHome();
    //await adminPage.setViewportSize({ width: 1300, height: 600 }); /
    await macrosAdminPage.InitiateSession(
      CaseUserName2,
      stringFormat(Constants.XRMSpecificCaseLink2, rnd)
    );
    await macrosAdminPage.ClickProductivityPaneTool(Constants.SAtool);
    await macrosAdminPage.ValidateThePage(Constants.ProductivityPaneDisable);

    //Validate that Productivity pane maintains collapsed state during session switch events
    await macrosAdminPage.waitForDomContentLoaded();
    await macrosAdminPage.SwitchBackToPreviousSession(
      stringFormat(Constants.XRMSpecificCaseLink1, rnd)
    );
    await macrosAdminPage.waitForDomContentLoaded();
    await macrosAdminPage.ValidateThePage(Constants.ProductivityPaneEnable);
  });
});
