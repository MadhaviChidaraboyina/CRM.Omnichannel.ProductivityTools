import { AgentChat } from "../../../pages/AgentChat";
import { BrowserContext, Page } from "playwright";
import { Constants } from "../../common/constants";
import { LiveChatPage } from "../../../pages/LiveChat";
import { Macros } from "../../macropages/macrosAdmin";
import { OrgDynamicsCrmStartPage } from "../../../pages/org-dynamics-crm-start.page";
import { TestHelper } from "../../../helpers/test-helper";
import { TestSettings } from "../../../configuration/test-settings";
import { AppProfileHelper, appProfileNames } from "helpers/appprofile-helper";
import { AgentScript } from "integration-tests/agentScript/pages/agentScriptAdmin";

describe("Productivity Pane Testcases - ", () => {
  let adminContext: BrowserContext;
  let adminPage: Page;
  let adminStartPage: OrgDynamicsCrmStartPage;
  let agentPage: Page;
  let agentContext: BrowserContext;
  let liveChatContext: BrowserContext;
  let liveChatPage: LiveChatPage;
  let macrosAdminPage: Macros;
  let agentChat: AgentChat;
  var caseNameList: string[] = [];
  let rnd: any;
  const agentScriptAdminPage = new AgentScript(adminPage);

  beforeAll(async () => {
    await AppProfileHelper.getInstance().CreateAppProfile();
  })

  beforeAll(async () => {
    await AppProfileHelper.getInstance().CreateAppProfile();
  })

  beforeEach(async () => {
    adminContext = await browser.newContext({
      viewport: TestSettings.Viewport, extraHTTPHeaders: {
        origin: "",
      },
    });
    liveChatContext = await browser.newContext({
      viewport: TestSettings.Viewport, extraHTTPHeaders: {
        origin: "",
      },
      acceptDownloads: true,
    });
    agentContext = await browser.newContext({
      viewport: TestSettings.Viewport, extraHTTPHeaders: {
        origin: "",
      },
      acceptDownloads: true,
    });
    adminPage = await adminContext.newPage();
    adminStartPage = new OrgDynamicsCrmStartPage(adminPage);
    macrosAdminPage = new Macros(adminPage);
    agentChat = new AgentChat(adminPage);

  });
  afterEach(async () => {
    TestHelper.dispose(adminContext);
    TestHelper.dispose(liveChatContext);
    TestHelper.dispose(agentContext);
  });

  ///<summary>
  ///Test Case 2045304: [Productivity Pane: Agent Guidance] : Validate if knowledge search control turn off in APM, it will disappear in PP.
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045304
  ///</summary>
  it("Test Case 2045304: [Productivity Pane: Agent Guidance] : Validate if knowledge search control turn off in APM, it will disappear in PP.", async () => {
    agentPage = await agentContext.newPage();
    rnd = agentScriptAdminPage.RandomNumber();
    try {
      //Login as admin and create case
      await adminStartPage.navigateToOrgUrlAndSignIn(
        TestSettings.AdminAccountEmail5,
        TestSettings.AdminAccountPassword
      );
      await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
      const appProfileTest5 = appProfileNames.appProfileTest5;
      await macrosAdminPage.OpenappProfile(appProfileTest5);
      const booleanvalue = await macrosAdminPage.validatePane();
      if (booleanvalue) {
        await macrosAdminPage.EnableTwoAppsInProductivityPane();
        await macrosAdminPage.openAppLandingPage(adminPage);
        await adminStartPage.goToCustomerServiceWorkspace();
        await macrosAdminPage.CreateCaseInCSW(Constants.CaseTitleName);
        await macrosAdminPage.InitiateSession(
          Constants.CaseTitleName,
          Constants.CaseLink1
        );
        await macrosAdminPage.ValidateThePage(Constants.KStool);
      } else {
        console.log("pane is already enabled")
        await macrosAdminPage.openAppLandingPage(adminPage);
        await adminStartPage.goToCustomerServiceWorkspace();
        await macrosAdminPage.CreateCaseInCSW(Constants.CaseTitleName);
        await macrosAdminPage.InitiateSession(
          Constants.CaseTitleName,
          Constants.CaseLink1
        );
        const NoKSTool = await macrosAdminPage.verifyOpenedTab(
          agentPage,
          Constants.KStool
        );
        expect(NoKSTool).toBeFalsy();
      }
    } finally {
    }
  });

  ///<summary>
  ///Test Case 2045296: [Productivity Pane: Knowledge Search] : Verify if knowledge search is available with default configuration
  ///Test Case Link  https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045296
  ///<summary>
  it("Test Case 2045296: [Productivity Pane: Knowledge Search] : Verify if knowledge search is available with default configuration", async () => {
    agentPage = await agentContext.newPage();
    try {
      //Login as admin and create case
      await adminStartPage.navigateToOrgUrlAndSignIn(
        TestSettings.AdminAccountEmail,
        TestSettings.AdminAccountPassword
      );
      // await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
      // await macrosAdminPage.createCase(Constants.CaseTitleName);
      // //Initiate session
      // await macrosAdminPage.openAppLandingPage(adminPage);
      await adminStartPage.goToCustomerServiceWorkspace();
      //Create Case through XRM WebAPI
      await agentChat.waitforTimeout();
      var CaseTitleName = Constants.CaseTitleName
      caseNameList = [CaseTitleName];
      await macrosAdminPage.createIncidents(agentChat, caseNameList);

      await macrosAdminPage.InitiateSession(
        Constants.CaseTitleName,
        Constants.CaseLink1
      );
      await macrosAdminPage.ClickProductivityPaneTool(Constants.KStool);
      await macrosAdminPage.ValidateThePage(Constants.Knowledgesearch);
    } finally {
      await macrosAdminPage.deleteCase(
        adminPage,
        adminStartPage,
        Constants.CaseTitleName
      );
    }
  });
});
