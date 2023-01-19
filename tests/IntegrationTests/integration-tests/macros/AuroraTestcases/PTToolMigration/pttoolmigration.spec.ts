import { BrowserContext, Page } from "playwright";
import { Constants } from "../../../common/constants";
import { Macros } from "../../../macropages/macrosAdmin";
import { OrgDynamicsCrmStartPage } from "../../../../pages/org-dynamics-crm-start.page";
import { TestHelper } from "../../../../helpers/test-helper";
import { TestSettings } from "../../../../configuration/test-settings";
import { AgentChat } from "pages/AgentChat";
import { AgentScript } from "../../../agentScript/pages/agentScriptAdmin";

describe("PTToolMigration Test Scenerios - ", () => {
    let adminContext: BrowserContext;
    let adminPage: Page;
    let adminStartPage: OrgDynamicsCrmStartPage;
    let agentPage: Page;
    let agentContext: BrowserContext;
    let liveChatContext: BrowserContext;
    let macrosAdminPage: Macros;
    let agentChat: AgentChat;
    var caseNameList: string[] = [];
    let rnd: any;
    const agentScriptAdminPage = new AgentScript(adminPage);

    beforeEach(async () => {
        adminContext = await browser.newContext({
            viewport: TestSettings.Viewport,
            extraHTTPHeaders: {
                origin: "",
            },
        });
        liveChatContext = await browser.newContext({
            viewport: TestSettings.Viewport,
            acceptDownloads: true,
            extraHTTPHeaders: {
                origin: "",
            },
        });
        agentContext = await browser.newContext({
            viewport: TestSettings.Viewport,
            acceptDownloads: true,
            extraHTTPHeaders: {
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
        TestHelper.dispose(liveChatContext);
        TestHelper.dispose(agentContext);
    });

    ///<summary>
  ///Test Case 2245402: [P.Tool Migration] Verify content updates of each tool when switching sessions (including smart assist cards and agent scripts)
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2245402
  ///</summary>
  it("Test Case 2245402: [P.Tool Migration] Verify content updates of each tool when switching sessions (including smart assist cards and agent scripts)", async () => {
    //Login as 'Admin automated' and redirected to OrgUrl
    await adminStartPage.navigateToOrgUrlAndSignIn(
      TestSettings.MacrosAgentEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    var CaseUserName = Constants.CaseTitleName;
    var CaseUserName2 = Constants.CaseTitleName2;
    caseNameList = [CaseUserName, CaseUserName2];
    await macrosAdminPage.createIncidents(agentChat, caseNameList);
    await macrosAdminPage.InitiateSession(
      Constants.CaseTitleName,
      Constants.CaseLink1
    );
    //Open suggestions card and validate
    await macrosAdminPage.OpenSuggestionLink(Constants.KArticleOpen);
    await macrosAdminPage.ValidateThePage(Constants.ValidateSuggestion);
    //Initiate session open suggesion card
    await macrosAdminPage.GoToHome();
    await macrosAdminPage.InitiateSession(
      Constants.CaseTitleName2,
      Constants.CaseLink2
    );
    await macrosAdminPage.ClickProductivityPaneTool(Constants.KStool);
    await macrosAdminPage.OpenSuggestionLink(Constants.KSToolData);
    await macrosAdminPage.ValidateThePage(Constants.KStool);
    //switch to previous session and validate
    await macrosAdminPage.SwitchBackToPreviousSession(Constants.Firstcase);
    await macrosAdminPage.ValidateThePage(Constants.ValidateSuggestion);
  });

  ///<summary>
  ///Test Case 2245446: [P.Tool Migration] Ensure the badge number on smart assist can be accumulated and cached/restored along with session switch.
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2245446
  ///</summary>
  it("Test Case 2245446: [P.Tool Migration] Ensure the badge number on smart assist can be accumulated and cached/restored along with session switch.", async () => {
    agentPage = await agentContext.newPage();
    rnd = agentScriptAdminPage.RandomNumber();
    //Login as 'Admin automated' and redirected to OrgUrl
    await adminStartPage.navigateToOrgUrlAndSignIn(
      TestSettings.MacrosAgentEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    const CaseTitleName = await macrosAdminPage.createCaseWithAPI(
      Constants.CaseTitleName
    );
    await macrosAdminPage.InitiateSession(
      CaseTitleName,
      Constants.LinkStart + CaseTitleName + Constants.LinkEnd
    );
    await macrosAdminPage.ShowBadgeNumber();
    await macrosAdminPage.ValidateThePage(Constants.BadgeNum);
    //Initiate session and validate
    await macrosAdminPage.GoToHome();
    const CaseTitleName1 = await macrosAdminPage.createCaseWithAPI(
      Constants.XRMCaseName
    );
    await macrosAdminPage.InitiateSession(
      CaseTitleName1,
      Constants.LinkStart + CaseTitleName1 + Constants.LinkEnd
    );
    await macrosAdminPage.ValidateThePage(Constants.NoBadgeNum);
    //switch to previous session and validate
    await macrosAdminPage.SwitchBackToPreviousSession(
      Constants.LinkStart + CaseTitleName + Constants.LinkEnd
    );
    await macrosAdminPage.ValidateThePage(Constants.BadgeNum);
  });
});