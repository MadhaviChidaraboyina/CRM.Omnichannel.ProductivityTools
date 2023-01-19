import { AgentChat } from "../../../pages/AgentChat";
import { BrowserContext, Page } from "playwright";
import { Constants } from "../../common/constants";
import { LiveChatPage } from "../../../pages/LiveChat";
import { Macros } from "../../macropages/macrosAdmin";
import { OrgDynamicsCrmStartPage } from "../../../pages/org-dynamics-crm-start.page";
import { TestHelper } from "../../../helpers/test-helper";
import { TestSettings } from "../../../configuration/test-settings";
import { AgentScript } from "../../agentScript/pages/agentScriptAdmin";
import { MacrosPage } from "../../../pages/Macros";
import { EntityNames } from "../../../Utility/Constants";
import { AppProfileHelper } from "helpers/appprofile-helper";
import { FunctionEB } from "../LivechatScenerios/ebFunction";
import { ConstantsEB } from "../LivechatScenerios/ebConstants";

describe("Live Chat - ", () => {
  let adminContext: BrowserContext;
  let adminPage: Page;
  let adminStartPage: OrgDynamicsCrmStartPage;
  let agentPage: Page;
  let agentContext: BrowserContext;
  let liveChatContext: BrowserContext;
  let liveChatPage: LiveChatPage;
  let macrosAdminPage: Macros;
  let agentChat: AgentChat;
  let rnd: any;
  let ebAdminPage: FunctionEB;

  beforeAll(async () => {
    await AppProfileHelper.getInstance().CreateAppProfile();
  });

  beforeEach(async () => {
    adminContext = await browser.newContext({
      viewport: TestSettings.Viewport,
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
    // await AppProfileHelper.getInstance().CreateAppProfile();
    agentChat = new AgentChat(adminPage);
    ebAdminPage = new FunctionEB(adminPage);
  });
  afterEach(async () => {
    TestHelper.dispose(adminContext);
    TestHelper.dispose(liveChatContext);
    TestHelper.dispose(agentContext);
  });

  ///<summary>
  ///Test Case 1790567: Verify slugs are working in expression builder with equal to condition
  ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1790567
  ///</summary>
  it("Test Case 1790567: Verify slugs are working in expression builder with equal to condition", async () => {
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
      ConstantsEB.ExpressionBuilderAgentScript1 + rnd,
      Constants.UniqueName + rnd
    );
    const agentScriptStep1 = await agentChat.createAgentScriptStepbyXRMAPI(
      ConstantsEB.ExpressionBuilderAgentScript1 + rnd,
      Constants.UniqueName + rnd + rnd,
      Constants.AgentscriptStepOrder,
      Constants.MacroAgentScriptStep,
      agentScript1.id,
      Constants.OpenNewFormMacroName,
      workflowID1
    );
    await macrosAdminPage.OpenAgentScriptandSave(
      ConstantsEB.ExpressionBuilderAgentScript1 + rnd
    );
    // Create False condition
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await macrosAdminPage.createMacro(Constants.OpenKBSearchMacroName);
    const workflowID2 = await macrosAdminPage.getLatestMacro(
      agentChat,
      Constants.OpenKBSearchMacroName
    );
    const agentScript2 = await agentChat.createAgentScriptbyXRMAPI(
      ConstantsEB.ExpressionBuilderAgentScript2 + rnd,
      Constants.UniqueName + rnd + rnd + rnd
    );
    const agentScriptStep2 = await agentChat.createAgentScriptStepbyXRMAPI(
      ConstantsEB.ExpressionBuilderAgentScript2 + rnd,
      Constants.UniqueName + rnd + rnd + rnd + rnd,
      Constants.AgentscriptStepOrder,
      Constants.MacroAgentScriptStep,
      agentScript2.id,
      Constants.OpenKBSearchMacroName,
      workflowID2
    );
    await macrosAdminPage.OpenAgentScriptandSave(
      ConstantsEB.ExpressionBuilderAgentScript2 + rnd
    );
    // End off Agent Scripts
    const session =
      await agentChat.createChildSesionWithAgentScriptInExpressionBuilderbyXRMAPI1(
        Constants.SlugName,
        Constants.SlugName,
        ConstantsEB.ExpressionBuilderSession + rnd,
        Constants.UniqueName + rnd,
        agentScript1.id,
        agentScript2.id
      );

    await ebAdminPage.AddSessionToProfileWithPerameter(
      ConstantsEB.AppProfileUser3,
      ConstantsEB.ExpressionBuilderSession + rnd
    );
    await ebAdminPage.addTwoAgentScriptToSesssionTemplateWithParameter(
      ConstantsEB.ExpressionBuilderSession + rnd,
      ConstantsEB.ExpressionBuilderAgentScript1 + rnd,
      ConstantsEB.ExpressionBuilderAgentScript2 + rnd
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
      ConstantsEB.ExpressionBuilderAgentScript2 + rnd,
      ConstantsEB.OpenNewFormTitle,
      ConstantsEB.OpenKBSearchTitle
    );
    await macrosAdminPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await macrosAdminPage.deleteSessionTemplatebyXRM(
      agentChat,
      EntityNames.Session,
      session.id
    );
  });

  ///<summary>
  ///Test Case 1790571: Verify session connectors are working in expression builder
  ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1790571
  ///</summary>
  it("Test Case 1790571: Verify session connectors are working in expression builder", async () => {
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
      ConstantsEB.ExpressionBuilderAgentScript1 + rnd,
      Constants.UniqueName + rnd
    );
    const agentScriptStep1 = await agentChat.createAgentScriptStepbyXRMAPI(
      ConstantsEB.ExpressionBuilderAgentScript1 + rnd,
      Constants.UniqueName + rnd + rnd,
      Constants.AgentscriptStepOrder,
      Constants.MacroAgentScriptStep,
      agentScript1.id,
      Constants.OpenNewFormMacroName,
      workflowID1
    );
    await macrosAdminPage.OpenAgentScriptandSave(
      ConstantsEB.ExpressionBuilderAgentScript1 + rnd
    );
    // Create False condition
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await macrosAdminPage.createMacro(Constants.OpenKBSearchMacroName);
    const workflowID2 = await macrosAdminPage.getLatestMacro(
      agentChat,
      Constants.OpenKBSearchMacroName
    );
    const agentScript2 = await agentChat.createAgentScriptbyXRMAPI(
      ConstantsEB.ExpressionBuilderAgentScript2 + rnd,
      Constants.UniqueName + rnd + rnd + rnd
    );
    const agentScriptStep2 = await agentChat.createAgentScriptStepbyXRMAPI(
      ConstantsEB.ExpressionBuilderAgentScript2 + rnd,
      Constants.UniqueName + rnd + rnd + rnd + rnd,
      Constants.AgentscriptStepOrder,
      Constants.MacroAgentScriptStep,
      agentScript2.id,
      Constants.OpenKBSearchMacroName,
      workflowID2
    );
    await macrosAdminPage.OpenAgentScriptandSave(
      ConstantsEB.ExpressionBuilderAgentScript2 + rnd
    );
    // End off Agent Scripts
    const session =
      await agentChat.createChildSesionWithAgentScriptInExpressionBuilderbyXRMAPI1(
        ConstantsEB.ExpressionBuilderMatchedText,
        ConstantsEB.ExpressionBuilderMatchedText,
        ConstantsEB.ExpressionBuilderSession + rnd,
        Constants.UniqueName + rnd,
        agentScript1.id,
        agentScript2.id
      );

    await ebAdminPage.AddSessionToProfileWithPerameter(
      ConstantsEB.AppProfileUser3,
      ConstantsEB.ExpressionBuilderSession + rnd
    );
    await ebAdminPage.addTwoAgentScriptToSesssionTemplateWithParameter(
      ConstantsEB.ExpressionBuilderSession + rnd,
      ConstantsEB.ExpressionBuilderAgentScript1 + rnd,
      ConstantsEB.ExpressionBuilderAgentScript2 + rnd
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
      ConstantsEB.ExpressionBuilderAgentScript2 + rnd,
      ConstantsEB.OpenNewFormTitle,
      ConstantsEB.OpenKBSearchTitle
    );
    await macrosAdminPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await macrosAdminPage.deleteSessionTemplatebyXRM(
      agentChat,
      EntityNames.Session,
      session.id
    );
  });

  ///<summary>
  ///Test Case 1794804: Verify Static values are working in expression builder with false condition
  ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1794804
  ///</summary>
  it("Test Case 1794804: Verify Static Values are Working in Expression Builder with False Condition", async () => {
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
      ConstantsEB.ExpressionBuilderAgentScript1 + rnd,
      Constants.UniqueName + rnd
    );
    const agentScriptStep1 = await agentChat.createAgentScriptStepbyXRMAPI(
      ConstantsEB.ExpressionBuilderAgentScript1 + rnd,
      Constants.UniqueName + rnd + rnd,
      Constants.AgentscriptStepOrder,
      Constants.MacroAgentScriptStep,
      agentScript1.id,
      Constants.OpenNewFormMacroName,
      workflowID1
    );
    await macrosAdminPage.OpenAgentScriptandSave(
      ConstantsEB.ExpressionBuilderAgentScript1 + rnd
    );
    // Create False condition
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await macrosAdminPage.createMacro(Constants.OpenKBSearchMacroName);
    const workflowID2 = await macrosAdminPage.getLatestMacro(
      agentChat,
      Constants.OpenKBSearchMacroName
    );
    const agentScript2 = await agentChat.createAgentScriptbyXRMAPI(
      ConstantsEB.ExpressionBuilderAgentScript2 + rnd,
      Constants.UniqueName + rnd + rnd + rnd
    );
    const agentScriptStep2 = await agentChat.createAgentScriptStepbyXRMAPI(
      ConstantsEB.ExpressionBuilderAgentScript2 + rnd,
      Constants.UniqueName + rnd + rnd + rnd + rnd,
      Constants.AgentscriptStepOrder,
      Constants.MacroAgentScriptStep,
      agentScript2.id,
      Constants.OpenKBSearchMacroName,
      workflowID2
    );
    await macrosAdminPage.OpenAgentScriptandSave(
      ConstantsEB.ExpressionBuilderAgentScript2 + rnd
    );
    // End off Agent Scripts
    const session =
      await agentChat.createChildSesionWithAgentScriptInExpressionBuilderbyXRMAPI1(
        ConstantsEB.ExpressionBuilderMatchedText,
        ConstantsEB.ExpressionBuilderMatchedText,
        ConstantsEB.ExpressionBuilderSession + rnd,
        Constants.UniqueName + rnd,
        agentScript1.id,
        agentScript2.id
      );

    await ebAdminPage.AddSessionToProfileWithPerameter(
      ConstantsEB.AppProfileUser3,
      ConstantsEB.ExpressionBuilderSession + rnd
    );
    await ebAdminPage.addTwoAgentScriptToSesssionTemplateWithParameter(
      ConstantsEB.ExpressionBuilderSession + rnd,
      ConstantsEB.ExpressionBuilderAgentScript1 + rnd,
      ConstantsEB.ExpressionBuilderAgentScript2 + rnd
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
      ConstantsEB.ExpressionBuilderAgentScript2 + rnd,
      ConstantsEB.OpenNewFormTitle,
      ConstantsEB.OpenKBSearchTitle
    );
    await macrosAdminPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await macrosAdminPage.deleteSessionTemplatebyXRM(
      agentChat,
      EntityNames.Session,
      session.id
    );
  });

  ///<summary>
  ///Test Case 1790578: Verify Static values are working in expression builder with true condition
  ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1790578
  ///</summary>
  it("1790578: Static Values are Working in Expression Builder with True Condition", async () => {
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
      ConstantsEB.ExpressionBuilderAgentScript1 + rnd,
      Constants.UniqueName + rnd
    );
    const agentScriptStep1 = await agentChat.createAgentScriptStepbyXRMAPI(
      ConstantsEB.ExpressionBuilderAgentScript1 + rnd,
      Constants.UniqueName + rnd + rnd,
      Constants.AgentscriptStepOrder,
      Constants.MacroAgentScriptStep,
      agentScript1.id,
      Constants.OpenNewFormMacroName,
      workflowID1
    );
    await macrosAdminPage.OpenAgentScriptandSave(
      ConstantsEB.ExpressionBuilderAgentScript1 + rnd
    );
    // Create False condition
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await macrosAdminPage.createMacro(Constants.OpenKBSearchMacroName);
    const workflowID2 = await macrosAdminPage.getLatestMacro(
      agentChat,
      Constants.OpenKBSearchMacroName
    );
    const agentScript2 = await agentChat.createAgentScriptbyXRMAPI(
      ConstantsEB.ExpressionBuilderAgentScript2 + rnd,
      Constants.UniqueName + rnd + rnd + rnd
    );
    const agentScriptStep2 = await agentChat.createAgentScriptStepbyXRMAPI(
      ConstantsEB.ExpressionBuilderAgentScript2 + rnd,
      Constants.UniqueName + rnd + rnd + rnd + rnd,
      Constants.AgentscriptStepOrder,
      Constants.MacroAgentScriptStep,
      agentScript2.id,
      Constants.OpenKBSearchMacroName,
      workflowID2
    );
    await macrosAdminPage.OpenAgentScriptandSave(
      ConstantsEB.ExpressionBuilderAgentScript2 + rnd
    );
    // End off Agent Scripts
    const session =
      await agentChat.createChildSesionWithAgentScriptInExpressionBuilderbyXRMAPI1(
        ConstantsEB.ExpressionBuilderMatchedText,
        ConstantsEB.ExpressionBuilderMatchedText,
        ConstantsEB.ExpressionBuilderSession + rnd,
        Constants.UniqueName + rnd,
        agentScript1.id,
        agentScript2.id
      );

    await ebAdminPage.AddSessionToProfileWithPerameter(
      ConstantsEB.AppProfileUser3,
      ConstantsEB.ExpressionBuilderSession + rnd
    );
    await ebAdminPage.addTwoAgentScriptToSesssionTemplateWithParameter(
      ConstantsEB.ExpressionBuilderSession + rnd,
      ConstantsEB.ExpressionBuilderAgentScript1 + rnd,
      ConstantsEB.ExpressionBuilderAgentScript2 + rnd
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
      ConstantsEB.ExpressionBuilderAgentScript2 + rnd,
      Constants.OpenNewFormTitle,
      Constants.OpenNewFormTitle
    );
    await macrosAdminPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await macrosAdminPage.deleteSessionTemplatebyXRM(
      agentChat,
      EntityNames.Session,
      session.id
    );
  });

  ///<summary>
  ///Test Case 1802338: Verify an error pop up is showing if wrong data provides in expression builder
  ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_testPlans/execute?planId=2338666&suiteId=2347473
  ///</summary>
  it("Test Case 1802338: Verify an error pop up is showing if wrong data provides in expression builder", async () => {
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
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
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
    await macrosAdminPage.OpenAgentScriptandSave(
      Constants.ExpressionBuilderAgentScript2 + rnd
    );
    // End off Agent Scripts
    const session =
      await agentChat.createChildSesionWithAgentScriptInExpressionBuilderbyXRMAPI1(
        Constants.ExpressionBuilderInvalidValue,
        Constants.ExpressionBuilderMatchedText,
        Constants.ExpressionBuilderSession + rnd,
        Constants.UniqueName + rnd,
        agentScript1.id,
        agentScript2.id
      );
    await macrosAdminPage.OpenValidateExpressionBuilder(
      Constants.ExpressionBuilderSession + rnd
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
