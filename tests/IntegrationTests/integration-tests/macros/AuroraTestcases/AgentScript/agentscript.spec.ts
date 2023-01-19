import { BrowserContext, Page } from "playwright";
import { Constants } from "../../../common/constants";
import { Macros } from "../../../macropages/macrosAdmin";
import { OrgDynamicsCrmStartPage } from "../../../../pages/org-dynamics-crm-start.page";
import { TestHelper } from "../../../../helpers/test-helper";
import { TestSettings } from "../../../../configuration/test-settings";
import { LiveChatPage } from "pages/LiveChat";
import { AgentChat } from "pages/AgentChat";
import { EntityNames } from "Utility/Constants";

describe("AgentScript Test Scenerios - ", () => {
    let adminContext: BrowserContext;
    let adminPage: Page;
    let adminStartPage: OrgDynamicsCrmStartPage;
    let agentPage: Page;
    let agentContext: BrowserContext;
    let liveChatContext: BrowserContext;
    let liveChatPage: LiveChatPage;
    let macrosAdminPage: Macros;
    let rnd: any;
    let agentChat: AgentChat;

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
  ///Test Case 2056506: 2042783 Agent script , smart assist, knowledge article icons should load for both custom and default app profiles
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2056506
  ///</summary>
  it("Test Case 2056506: 2042783 Agent script , smart assist, knowledge article icons should load for both custom and default app profiles", async () => {
    rnd = macrosAdminPage.RandomNumber();
    try {
      //Login as admin and create case
      await adminStartPage.navigateToOrgUrlAndSignIn(
        TestSettings.MacrosAgentEmail,
        TestSettings.AdminAccountPassword
      );
      await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
      await adminStartPage.waitForDomContentLoaded();
      await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
      await agentChat.waitForAgentStatusIcon();
      const CaseTitleName = await macrosAdminPage.createCaseWithAPI(
        Constants.CaseTitleName
      );
      await macrosAdminPage.InitiateSession(
        CaseTitleName,
        Constants.LinkStart + CaseTitleName + Constants.LinkEnd
      );
      await macrosAdminPage.ValidateThePage(Constants.AStool);
      await macrosAdminPage.ValidateThePage(Constants.SAtool);
      await macrosAdminPage.ValidateThePage(Constants.KStool);
      //Create new app profile
      await macrosAdminPage.openAppLandingPage(adminPage);
      await adminStartPage.goToCustomerServiceAdmincenter();
      await adminStartPage.waitForDomContentLoaded();
      await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
      await macrosAdminPage.createAppProfileByPerameter(rnd);
      await macrosAdminPage.AddUsers(TestSettings.InboxUser);
      await macrosAdminPage.EnableProductivityPane();
      //Login as agent and accept chat and valiate
      await macrosAdminPage.openAppLandingPage(adminPage);
      await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
      await adminStartPage.waitForDomContentLoaded();
      await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
      await agentChat.waitForAgentStatusIcon();
      const CaseTitleName1 = await macrosAdminPage.createCaseWithAPI(
        Constants.CaseTitleName
      );
      await macrosAdminPage.InitiateSession(
        CaseTitleName1,
        Constants.LinkStart + CaseTitleName1 + Constants.LinkEnd
      );
      await macrosAdminPage.ValidateThePage(Constants.AStool);
      await macrosAdminPage.ValidateThePage(Constants.SAtool);
      await macrosAdminPage.ValidateThePage(Constants.KStool);
    } finally {
      await macrosAdminPage.deleteAppProfileWithPerameter(adminPage, adminStartPage,rnd);
    }
  });

  ///<summary>
  ///Test Case 1785761: [Sanity][All Channels] Verify Agent scripts are loading in Productivity pane, Macros are running and expression builder is executing as per inputs
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1785761
  ///</summary>
  it("Test Case 1785761: [Sanity][All Channels] Verify Agent scripts are loading in Productivity pane, Macros are running and expression builder is executing as per inputs", async () => {
    agentPage = await agentContext.newPage();
    rnd = macrosAdminPage.RandomNumber();
    await agentChat.navigateToOrgUrlAndSignIn(
      TestSettings.AdminAccountEmail3,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    // Create True condition
    await macrosAdminPage.createMacro(Constants.OpenNewFormMacroName);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    const workflowID1 = await macrosAdminPage.getLatestMacro(
      agentChat,
      Constants.OpenNewFormMacroName
    );
    const agentScript1 = await agentChat.createAgentScriptbyXRMAPI(
      Constants.ExpressionBuilderAgentScript1 + rnd,
      Constants.UniqueName + rnd
    );
    const agentScriptStep1 = await agentChat.createAgentScriptStepbyXRMAPI(
      Constants.ExpressionBuilderAgentScript1 + rnd,
      Constants.UniqueName + rnd + rnd,
      Constants.AgentscriptStepOrder,
      Constants.MacroAgentScriptStep,
      agentScript1.id,
      Constants.OpenNewFormMacroName,
      workflowID1
    );
    await macrosAdminPage.OpenAgentScriptandSave(
      Constants.ExpressionBuilderAgentScript1 + rnd
    );
    // Create False condition
    await macrosAdminPage.createMacro(Constants.OpenKBSearchMacroName);
    const workflowID2 = await macrosAdminPage.getLatestMacro(
      agentChat,
      Constants.OpenKBSearchMacroName
    );
    const agentScript2 = await agentChat.createAgentScriptbyXRMAPI(
      Constants.ExpressionBuilderAgentScript2 + rnd,
      Constants.UniqueName + rnd + rnd + rnd
    );
    const agentScriptStep2 = await agentChat.createAgentScriptStepbyXRMAPI(
      Constants.ExpressionBuilderAgentScript2 + rnd,
      Constants.UniqueName + rnd + rnd + rnd + rnd,
      Constants.AgentscriptStepOrder,
      Constants.MacroAgentScriptStep,
      agentScript2.id,
      Constants.OpenKBSearchMacroName,
      workflowID2
    );
    await adminStartPage.waitForDomContentLoaded();
    await macrosAdminPage.OpenAgentScriptandSave(
      Constants.ExpressionBuilderAgentScript2 + rnd
    );
    // End off Agent Scripts
    const session =
      await agentChat.createChildSesionWithAgentScriptInExpressionBuilderbyXRMAPI1(
        Constants.SlugName,
        Constants.SlugName,
        Constants.ExpressionBuilderSession + rnd,
        Constants.UniqueName + rnd,
        agentScript1.id,
        agentScript2.id
      );

    await macrosAdminPage.AddSessionToProfileWithPerameter(
      Constants.AppProfileUser3,
      Constants.ExpressionBuilderSession + rnd
    );
    await macrosAdminPage.addTwoAgentScriptToSesssionTemplateWithParameter(
      Constants.ExpressionBuilderSession + rnd,
      Constants.ExpressionBuilderAgentScript1 + rnd,
      Constants.ExpressionBuilderAgentScript2 + rnd
    );
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await agentChat.waitForAgentStatusIcon();
    const CaseTitleName = await macrosAdminPage.createCaseWithAPI(
      Constants.CaseTitleName
    );
    await macrosAdminPage.InitiateSession(
      CaseTitleName,
      Constants.LinkStart + CaseTitleName + Constants.LinkEnd
    );
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await agentChat.waitForAgentStatusIcon();
    //validate ExpressionBuilder
    await macrosAdminPage.runTrueMacroAndValidate(
      Constants.ExpressionBuilderAgentScript2 + rnd,
      Constants.OpenNewFormTitle,
      Constants.OpenKBSearchTitle
    );
    await macrosAdminPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await macrosAdminPage.deleteSessionTemplatebyXRM(
      agentChat,
      EntityNames.Session,
      session.id
    );
  });
});
