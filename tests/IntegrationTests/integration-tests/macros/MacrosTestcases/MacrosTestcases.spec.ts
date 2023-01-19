import { AgentChat } from "../../../pages/AgentChat";
import { BrowserContext, Page } from "playwright";
import { Constants, EntityAttributes } from "../../common/constants";
import { LiveChatPage } from "../../../pages/LiveChat";
import { Macros } from "../../macropages/macrosAdmin";
import { OrgDynamicsCrmStartPage } from "../../../pages/org-dynamics-crm-start.page";
import { TestHelper } from "../../../helpers/test-helper";
import { TestSettings } from "../../../configuration/test-settings";
import { AgentScript } from "../../agentScript/pages/agentScriptAdmin";
import { AppProfileHelper } from "helpers/appprofile-helper";
import { EntityNames, stringFormat } from "../../../Utility/Constants";
import { ConstantsMacros } from "./macrosConstants";
import { FunctionMacros } from "./macrosFunction";

describe("Macro testcases - ", () => {
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
  const agentScriptAdminPage = new AgentScript(adminPage);
  var caseNameList: string[] = [];
  let macrosFunction: FunctionMacros;

  beforeAll(async () => {
    await AppProfileHelper.getInstance().CreateAppProfile();
  });

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
    });
    agentContext = await browser.newContext({
      viewport: TestSettings.Viewport,
      acceptDownloads: true,
    });
    adminPage = await adminContext.newPage();
    adminStartPage = new OrgDynamicsCrmStartPage(adminPage);
    macrosAdminPage = new Macros(adminPage);
    agentChat = new AgentChat(adminPage);
    macrosFunction = new FunctionMacros(adminPage);
  });
  afterEach(async () => {
    TestHelper.dispose(adminContext);
    TestHelper.dispose(liveChatContext);
    TestHelper.dispose(agentContext);
  });

  /// <summary>
  /// Test Case 1760324: [Macros] Verify data is autofilled when using "Autofill form fields"
  /// Prerequisites:- 1. Admin user
  ///                 2. ChatWorkStream
  ///                 3. ChatSession and associate it with ChatWorkStream
  /// </summary>
  it("Test Case 1760324: [Macros] Verify data is autofilled when using Autofill form fields", async () => {
    agentPage = await agentContext.newPage();
    rnd = agentScriptAdminPage.RandomNumber();
    //Login as admin and create cases
    await agentChat.navigateToOrgUrlAndSignIn(
      TestSettings.MacrosAgentEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await macrosAdminPage.createMacro(Constants.AutoFillMacroName);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    const workflowID = await macrosAdminPage.getLatestMacro(
      agentChat,
      Constants.AutoFillMacroName
    );
    await adminStartPage.waitForDomContentLoaded();
    const agentScript = await agentChat.createAgentScriptbyXRMAPI(
      Constants.AutoFillAgentScriptName + rnd,
      Constants.UniqueName + rnd
    );
    await adminStartPage.waitForDomContentLoaded();
    const agentScriptStep = await agentChat.createAgentScriptStepbyXRMAPI(
      Constants.AutoFillAgentScriptName + rnd,
      Constants.UniqueName + rnd + rnd,
      Constants.AgentscriptStepOrder,
      Constants.MacroAgentScriptStep,
      agentScript.id,
      Constants.AutoFillMacroName,
      workflowID
    );
    await macrosAdminPage.OpenAgentScriptandSave(
      Constants.AutoFillAgentScriptName + rnd
    );
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await macrosAdminPage.addAgentScripttoDefaultChatSessionWithParameter(
      Constants.AutoFillAgentScriptName + rnd
    );
    //Run Macro
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    const caseTitle = await macrosAdminPage.createCaseWithAPI(
      Constants.CaseTitleName
    );
    await macrosAdminPage.InitiateSession(
      caseTitle,
      Constants.LinkStart + caseTitle + Constants.LinkEnd
    );
    const runValidateAutoFillMacro =
      await macrosAdminPage.runMacroInSessionAndValidate(
        Constants.AutoFillAgentScriptName + rnd,
        Constants.AutoFillTitle
      );
    expect(runValidateAutoFillMacro).toBeTruthy();
    await adminStartPage.waitForDomContentLoaded();
    await macrosAdminPage.deletAgentScriptStepByXRM(
      agentChat,
      EntityNames.AgentScriptStep,
      agentScriptStep.id
    );
    await adminStartPage.waitForDomContentLoaded();
    await macrosAdminPage.deleteAgentScriptByXRM(
      agentChat,
      EntityNames.AgentScript,
      agentScript.id
    );
  });

  ///<summary>
  ///Test Case 2253509: [Macros] Verify custom control application template is opened in new tab using 'Open application tab' action in macros
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2253509
  ///</summary>
  it("Test Case 2253509: [Macros] Verify custom control application template is opened in new tab using 'Open application tab' action in macros", async () => {
    agentPage = await agentContext.newPage();
    rnd = agentScriptAdminPage.RandomNumber();
    liveChatPage = new LiveChatPage(await liveChatContext.newPage());
    //Login as admin and create macro
    await adminStartPage.navigateToOrgUrlAndSignIn(
      TestSettings.MacrosAgentEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    const applicationTabId = await macrosFunction.createApplicationTabAndGetId(
      Constants.ControlApplicationTab,
      Constants.ControlApplicationTabUniqueName + rnd,
      Constants.ControlOptionValue
    );
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await macrosAdminPage.createMacro(
      Constants.ControlMacroName,
      applicationTabId
    );
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    const workflowID = await macrosAdminPage.getLatestMacro(
      agentChat,
      Constants.ControlMacroName
    );
    await adminStartPage.waitForDomContentLoaded();
    const agentScript = await agentChat.createAgentScriptbyXRMAPI(
      Constants.ControlAgentScriptName + rnd,
      Constants.UniqueName + rnd
    );
    await adminStartPage.waitForDomContentLoaded();
    const agentScriptStep = await agentChat.createAgentScriptStepbyXRMAPI(
      Constants.ControlAgentScriptName + rnd,
      Constants.UniqueName + rnd + rnd,
      Constants.AgentscriptStepOrder,
      Constants.MacroAgentScriptStep,
      agentScript.id,
      Constants.ControlMacroName,
      workflowID
    );

    await macrosAdminPage.OpenAgentScriptandSave(
      Constants.ControlAgentScriptName + rnd
    );
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await macrosAdminPage.addAgentScripttoDefaultChatSessionWithParameter(
      Constants.ControlAgentScriptName + rnd
    );
    //Run Macro
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    const caseTitle = await macrosAdminPage.createCaseWithAPI(
      Constants.CaseTitleName
    );
    await macrosAdminPage.InitiateSession(
      caseTitle,
      Constants.LinkStart + caseTitle + Constants.LinkEnd
    );
    const openEntityRecordTabUsingMacro =
      await macrosAdminPage.runMacroInSessionAndValidate(
        Constants.ControlAgentScriptName + rnd,
        ConstantsMacros.ControlTitle
      );
    expect(openEntityRecordTabUsingMacro).toBeTruthy();
    await adminStartPage.waitForDomContentLoaded();
    await agentChat.deleteRecordbyXRM(
      EntityNames.AgentScriptStep,
      agentScriptStep.id
    );
    await adminStartPage.waitForDomContentLoaded();
    await agentChat.deleteRecordbyXRM(EntityNames.AgentScript, agentScript.id);
    await agentChat.deleteRecordbyXRM(EntityNames.Macros, workflowID);
  });

  ///<summary>
  ///Test Case 2253531: [Macros] Verify third party website application template is opened in new tab using 'Open application tab' action in macros
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2253531
  ///</summary>
  it("Test Case 2253531: [Macros] Verify third party website application template is opened in new tab using 'Open application tab' action in macros", async () => {
    agentPage = await agentContext.newPage();
    rnd = agentScriptAdminPage.RandomNumber();
    liveChatPage = new LiveChatPage(await liveChatContext.newPage());
    //Login as admin and create macro
    await adminStartPage.navigateToOrgUrlAndSignIn(
      TestSettings.MacrosAgentEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);

    const applicationTabId = await macrosFunction.createApplicationTabAndGetId(
      Constants.ThirdPartyWebsiteApplicationTab,
      Constants.ThirdPartyWebsiteApplicationTabUniqueName + rnd,
      Constants.ThirdPartyWebsiteOptionValue
    );
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);

    await macrosAdminPage.createMacro(
      Constants.ThirdPartyWebsiteMacroName,
      applicationTabId
    );
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    const workflowID = await macrosAdminPage.getLatestMacro(
      agentChat,
      Constants.ThirdPartyWebsiteMacroName
    );
    await adminStartPage.waitForDomContentLoaded();
    const agentScript = await agentChat.createAgentScriptbyXRMAPI(
      Constants.ThirdPartyWebsiteAgentScriptName + rnd,
      Constants.UniqueName + rnd
    );
    await adminStartPage.waitForDomContentLoaded();
    const agentScriptStep = await agentChat.createAgentScriptStepbyXRMAPI(
      Constants.ThirdPartyWebsiteAgentScriptName + rnd,
      Constants.UniqueName + rnd + rnd,
      Constants.AgentscriptStepOrder,
      Constants.MacroAgentScriptStep,
      agentScript.id,
      Constants.ThirdPartyWebsiteMacroName,
      workflowID
    );
    await adminStartPage.waitForDomContentLoaded();
    await macrosAdminPage.OpenAgentScriptandSave(
      Constants.ThirdPartyWebsiteAgentScriptName + rnd
    );
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await macrosAdminPage.addAgentScripttoDefaultChatSessionWithParameter(
      Constants.ThirdPartyWebsiteAgentScriptName + rnd
    );
    //Run Macro
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await macrosAdminPage.waitForDomContentLoaded();
    await macrosAdminPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    const caseTitle = await macrosAdminPage.createCaseWithAPI(
      Constants.CaseTitleName
    );
    await macrosAdminPage.InitiateSession(
      caseTitle,
      Constants.LinkStart + caseTitle + Constants.LinkEnd
    );
    const openEntityRecordTabUsingMacro =
      await macrosAdminPage.runMacroInSessionAndValidate(
        Constants.ThirdPartyWebsiteAgentScriptName + rnd,
        ConstantsMacros.ThirdPartyWebsiteTitle
      );
    expect(openEntityRecordTabUsingMacro).toBeTruthy();
    await adminStartPage.waitForDomContentLoaded();
    await agentChat.deleteRecordbyXRM(
      EntityNames.AgentScriptStep,
      agentScriptStep.id
    );
    await macrosAdminPage.waitForDomContentLoaded();
    await agentChat.deleteRecordbyXRM(EntityNames.AgentScript, agentScript.id);
    await macrosAdminPage.waitForDomContentLoaded();
    await agentChat.deleteRecordbyXRM(EntityNames.Macros, workflowID);
  });

  ///<summary>
  ///Test Case 1586360 - Create and runmacro opennewform end to end testing scenario create and run macro end to end testing scenario
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1586360
  ///</summary>
  it("Test Case 1586360: Create and runmacro opennewform end to end testing scenario create and run macro end to end testing scenario", async () => {
    agentPage = await agentContext.newPage();
    rnd = agentScriptAdminPage.RandomNumber();
    //Login as admin and create macro
    await adminStartPage.navigateToOrgUrlAndSignIn(
      TestSettings.MacrosAgentEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);

    await macrosAdminPage.createMacro(Constants.OpenNewFormMacroName);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    const workflowID = await macrosAdminPage.getLatestMacro(
      agentChat,
      Constants.OpenNewFormMacroName
    );
    const agentScript = await agentChat.createAgentScriptbyXRMAPI(
      Constants.OpenNewFormAgentScriptName + rnd,
      Constants.UniqueName + rnd
    );
    const agentScriptStep = await agentChat.createAgentScriptStepbyXRMAPI(
      Constants.OpenNewFormAgentScriptName + rnd,
      Constants.UniqueName + rnd + rnd,
      Constants.AgentscriptStepOrder,
      Constants.MacroAgentScriptStep,
      agentScript.id,
      Constants.OpenNewFormMacroName,
      workflowID
    );
    await macrosAdminPage.OpenAgentScriptandSave(
      Constants.OpenNewFormAgentScriptName + rnd
    );
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await macrosAdminPage.addAgentScripttoDefaultChatSessionWithParameter(
      Constants.OpenNewFormAgentScriptName + rnd
    );
    //Run Macro
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    const caseTitle = await macrosAdminPage.createCaseWithAPI(
      Constants.CaseTitleName
    );
    await macrosAdminPage.InitiateSession(
      caseTitle,
      Constants.LinkStart + caseTitle + Constants.LinkEnd
    );
    const openEntityRecordTabUsingMacro =
      await macrosAdminPage.runMacroInSessionAndValidate(
        Constants.OpenNewFormAgentScriptName + rnd,
        Constants.OpenNewFormTitle
      );
    expect(openEntityRecordTabUsingMacro).toBeTruthy();
    await adminStartPage.waitForDomContentLoaded();
    await macrosAdminPage.deletAgentScriptStepByXRM(
      agentChat,
      EntityNames.AgentScriptStep,
      agentScriptStep.id
    );
    await adminStartPage.waitForDomContentLoaded();
    await macrosAdminPage.deleteAgentScriptByXRM(
      agentChat,
      EntityNames.AgentScript,
      agentScript.id
    );
    await adminStartPage.waitForDomContentLoaded();
    await agentChat.deleteRecordbyXRM(EntityNames.Macros, workflowID);
  });

  ///<summary>
  ///Test Case 1588015: Create and runmacro openkbsearch end to end testing scenario
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1588015
  ///</summary>
  it("Test Case 1588015: Create and runmacro openkbsearch end to end testing scenario", async () => {
    agentPage = await agentContext.newPage();
    rnd = agentScriptAdminPage.RandomNumber();
    //Login as admin and create macro
    await adminStartPage.navigateToOrgUrlAndSignIn(
      TestSettings.MacrosAgentEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await macrosAdminPage.createMacro(Constants.OpenKBSearchMacroName);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    const workflowID = await macrosAdminPage.getLatestMacro(
      agentChat,
      Constants.OpenKBSearchMacroName
    );
    const agentScript = await agentChat.createAgentScriptbyXRMAPI(
      Constants.OpenKBSearchAgentScriptName + rnd + rnd,
      Constants.UniqueName + rnd
    );
    const agentScriptStep = await agentChat.createAgentScriptStepbyXRMAPI(
      Constants.OpenKBSearchAgentScriptName + rnd + rnd,
      Constants.UniqueName + rnd + rnd,
      Constants.AgentscriptStepOrder,
      Constants.MacroAgentScriptStep,
      agentScript.id,
      Constants.OpenKBSearchMacroName,
      workflowID
    );
    await macrosAdminPage.OpenAgentScriptandSave(
      Constants.OpenKBSearchAgentScriptName + rnd + rnd
    );
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await macrosAdminPage.addAgentScripttoDefaultChatSessionWithParameter(
      Constants.OpenKBSearchAgentScriptName + rnd + rnd
    );
    //Run Macro
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    const caseTitle = await macrosAdminPage.createCaseWithAPI(
      Constants.CaseTitleName
    );
    await macrosAdminPage.InitiateSession(
      caseTitle,
      Constants.LinkStart + caseTitle + Constants.LinkEnd
    );
    const openEntityRecordTabUsingMacro =
      await macrosAdminPage.runMacroInSessionAndValidate(
        Constants.OpenKBSearchAgentScriptName + rnd + rnd,
        Constants.OpenKBSearchTitle
      );
    expect(openEntityRecordTabUsingMacro).toBeTruthy();
    await adminStartPage.waitForDomContentLoaded();
    await macrosAdminPage.deletAgentScriptStepByXRM(
      agentChat,
      EntityNames.AgentScriptStep,
      agentScriptStep.id
    );
    await adminStartPage.waitForDomContentLoaded();
    await macrosAdminPage.deleteAgentScriptByXRM(
      agentChat,
      EntityNames.AgentScript,
      agentScript.id
    );
    await adminStartPage.waitForDomContentLoaded();
    await agentChat.deleteRecordbyXRM(EntityNames.Macros, workflowID);
  });

  /// <summary>
  /// TC 1576284:- Verify OpenExistingForm macro action
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1576284
  ///</summary>
  it("Test Case 1576284: Verify OpenExistingForm macro action", async () => {
    agentPage = await agentContext.newPage();
    rnd = agentScriptAdminPage.RandomNumber();
    //Login as admin and create macro
    await adminStartPage.navigateToOrgUrlAndSignIn(
      TestSettings.MacrosAgentEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);

    const incidentId = await macrosAdminPage.createCaseAndGetIncidentId();
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);

    await macrosAdminPage.createMacro(
      Constants.OpenExistingFormMacroName,
      incidentId
    );
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    const workflowID = await macrosAdminPage.getLatestMacro(
      agentChat,
      Constants.OpenExistingFormMacroName
    );
    const agentScript = await agentChat.createAgentScriptbyXRMAPI(
      Constants.OpenExistingFormAgentScriptName + rnd,
      Constants.UniqueName + rnd
    );
    const agentScriptStep = await agentChat.createAgentScriptStepbyXRMAPI(
      Constants.OpenExistingFormAgentScriptName + rnd,
      Constants.UniqueName + rnd + rnd,
      Constants.AgentscriptStepOrder,
      Constants.MacroAgentScriptStep,
      agentScript.id,
      Constants.OpenExistingFormMacroName,
      workflowID
    );
    await macrosAdminPage.OpenAgentScriptandSave(
      Constants.OpenExistingFormAgentScriptName + rnd
    );
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await macrosAdminPage.addAgentScripttoDefaultChatSessionWithParameter(
      Constants.OpenExistingFormAgentScriptName + rnd
    );
    //Run Macro
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    const caseTitle = await macrosAdminPage.createCaseWithAPI(
      Constants.CaseTitleName
    );
    await macrosAdminPage.InitiateSession(
      caseTitle,
      Constants.LinkStart + caseTitle + Constants.LinkEnd
    );
    const openEntityRecordTabUsingMacro =
      await macrosAdminPage.runMacroInSessionAndValidate(
        Constants.OpenExistingFormAgentScriptName + rnd,
        Constants.OpenExistingFormTitle
      );
    expect(openEntityRecordTabUsingMacro).toBeTruthy();
    await adminStartPage.waitForDomContentLoaded();
    await macrosAdminPage.deletAgentScriptStepByXRM(
      agentChat,
      EntityNames.AgentScriptStep,
      agentScriptStep.id
    );
    await adminStartPage.waitForDomContentLoaded();
    await macrosAdminPage.deleteAgentScriptByXRM(
      agentChat,
      EntityNames.AgentScript,
      agentScript.id
    );
    await adminStartPage.waitForDomContentLoaded();
    await agentChat.deleteRecordbyXRM(EntityNames.Macros, workflowID);
  });

  ///<summary>
  ///Test Case 1580586: Verify OpenGrid macro action
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1580586
  ///</summary>
  it("Test Case 1580586: Verify OpenGrid macro action", async () => {
    agentPage = await agentContext.newPage();
    rnd = agentScriptAdminPage.RandomNumber();
    liveChatPage = new LiveChatPage(await liveChatContext.newPage());
    //Login as admin and create macro
    await adminStartPage.navigateToOrgUrlAndSignIn(
      TestSettings.MacrosAgentEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);

    await macrosAdminPage.createMacro(Constants.OpenGridMacroName);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    const workflowID = await macrosAdminPage.getLatestMacro(
      agentChat,
      Constants.OpenGridMacroName
    );
    const agentScript = await agentChat.createAgentScriptbyXRMAPI(
      Constants.OpenGridAgentScriptName + rnd,
      Constants.UniqueName + rnd
    );
    const agentScriptStep = await agentChat.createAgentScriptStepbyXRMAPI(
      Constants.OpenGridAgentScriptName + rnd,
      Constants.UniqueName + rnd + rnd,
      Constants.AgentscriptStepOrder,
      Constants.MacroAgentScriptStep,
      agentScript.id,
      Constants.OpenGridMacroName,
      workflowID
    );
    await macrosAdminPage.OpenAgentScriptandSave(
      Constants.OpenGridAgentScriptName + rnd
    );
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await macrosAdminPage.addAgentScripttoDefaultChatSessionWithParameter(
      Constants.OpenGridAgentScriptName + rnd
    );
    //Run Macro
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    const caseTitle = await macrosAdminPage.createCaseWithAPI(
      Constants.CaseTitleName
    );
    await macrosAdminPage.InitiateSession(
      caseTitle,
      Constants.LinkStart + caseTitle + Constants.LinkEnd
    );
    const openEntityRecordTabUsingMacro =
      await macrosAdminPage.runMacroInSessionAndValidate(
        Constants.OpenGridAgentScriptName + rnd,
        Constants.OpenGridTitle
      );
    expect(openEntityRecordTabUsingMacro).toBeTruthy();
    await adminStartPage.waitForDomContentLoaded();
    await agentChat.deleteRecordbyXRM(
      EntityNames.AgentScriptStep,
      agentScriptStep.id
    );
    await adminStartPage.waitForDomContentLoaded();
    await agentChat.deleteRecordbyXRM(EntityNames.AgentScript, agentScript.id);
    await adminStartPage.waitForDomContentLoaded();
    await agentChat.deleteRecordbyXRM(EntityNames.Macros, workflowID);
  });

  ///<summary>
  ///Test Case 1580626: Verify DoRelevanceSearch macro action
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1580626
  ///</summary>
  it("Test Case 1580626: Verify DoRelevanceSearch macro action", async () => {
    agentPage = await agentContext.newPage();
    rnd = agentScriptAdminPage.RandomNumber();
    liveChatPage = new LiveChatPage(await liveChatContext.newPage());
    //Login as admin and create macro
    await adminStartPage.navigateToOrgUrlAndSignIn(
      TestSettings.MacrosAgentEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);

    await macrosAdminPage.createMacro(Constants.DoRelevanceSearchMacroName);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    const workflowID = await macrosAdminPage.getLatestMacro(
      agentChat,
      Constants.DoRelevanceSearchMacroName
    );
    await adminStartPage.waitForDomContentLoaded();
    const agentScript = await agentChat.createAgentScriptbyXRMAPI(
      Constants.DoRelevanceSearchAgentScriptName + rnd,
      Constants.UniqueName + rnd
    );
    await adminStartPage.waitForDomContentLoaded();
    const agentScriptStep = await agentChat.createAgentScriptStepbyXRMAPI(
      Constants.DoRelevanceSearchAgentScriptName + rnd,
      Constants.UniqueName + rnd + rnd,
      Constants.AgentscriptStepOrder,
      Constants.MacroAgentScriptStep,
      agentScript.id,
      Constants.DoRelevanceSearchMacroName,
      workflowID
    );
    await macrosAdminPage.OpenAgentScriptandSave(
      Constants.DoRelevanceSearchAgentScriptName + rnd
    );
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await macrosAdminPage.addAgentScripttoDefaultChatSessionWithParameter(
      Constants.DoRelevanceSearchAgentScriptName + rnd
    );
    //Run Macro
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    const caseTitle = await macrosAdminPage.createCaseWithAPI(
      Constants.CaseTitleName
    );
    await macrosAdminPage.InitiateSession(
      caseTitle,
      Constants.LinkStart + caseTitle + Constants.LinkEnd
    );
    const openEntityRecordTabUsingMacro =
      await macrosAdminPage.runMacroInSessionAndValidate(
        Constants.DoRelevanceSearchAgentScriptName + rnd,
        ConstantsMacros.DoRelevanceSearchTitle
      );
    expect(openEntityRecordTabUsingMacro).toBeTruthy();
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await agentChat.deleteRecordbyXRM(
      EntityNames.AgentScriptStep,
      agentScriptStep.id
    );
    await adminStartPage.waitForDomContentLoaded();
    await agentChat.deleteRecordbyXRM(EntityNames.AgentScript, agentScript.id);
    await adminStartPage.waitForDomContentLoaded();
    await agentChat.deleteRecordbyXRM(EntityNames.Macros, workflowID);
  });

  ///<summary>
  ///Test Case 1580630: Verify ResolveCase macro action
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1580630
  ///</summary>
  it("Test Case 1580630: Verify ResolveCase macro action", async () => {
    agentPage = await agentContext.newPage();
    rnd = macrosAdminPage.RandomNumber();
    //Login as admin and create macro
    await agentChat.navigateToOrgUrlAndSignIn(
      TestSettings.MacrosAgentEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);

    await macrosAdminPage.createMacro(
      Constants.ResolveCaseMacroName,
      Constants.IncidentID
    );
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    const workflowID = await macrosAdminPage.getLatestMacro(
      agentChat,
      Constants.ResolveCaseMacroName
    );
    const agentScript = await macrosAdminPage.createAgentScriptByXRMAPI(
      agentChat,
      Constants.ResolveCaseAgentScriptName + rnd,
      Constants.UniqueName + rnd
    );
    const agentScriptStep = await macrosAdminPage.createAgentScriptStepbyXRMAPI(
      agentChat,
      Constants.ResolveCaseAgentScriptName + rnd,
      Constants.UniqueName + rnd + rnd,
      Constants.AgentscriptStepOrder,
      Constants.MacroAgentScriptStep,
      agentScript.id,
      Constants.ResolveCaseMacroName,
      workflowID
    );
    await macrosAdminPage.OpenAgentScriptandSave(
      Constants.ResolveCaseAgentScriptName + rnd
    );
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await macrosAdminPage.addAgentScripttoDefaultChatSessionWithParameter(
      Constants.ResolveCaseAgentScriptName + rnd
    );
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    const caseTitle = await macrosAdminPage.createCaseWithAPI(
      Constants.CaseTitleName
    );
    await macrosAdminPage.InitiateSession(
      caseTitle,
      Constants.LinkStart + caseTitle + Constants.LinkEnd
    );
    //Run Macro and Validate
    const runAndValidateMacro =
      await macrosAdminPage.runMacroInSessionAndValidate(
        Constants.ResolveCaseAgentScriptName + rnd,
        Constants.ResolveStatemant
      );
    expect(runAndValidateMacro).toBeTruthy();
    await adminStartPage.waitForDomContentLoaded();
    await macrosAdminPage.deletAgentscriptStepbyXRM(
      agentChat,
      EntityNames.AgentScriptStep,
      agentScriptStep.id
    );
    await adminStartPage.waitForDomContentLoaded();
    await macrosAdminPage.deleteAgentScriptbyXRM(
      agentChat,
      EntityNames.AgentScript,
      agentScript.id
    );
    await adminStartPage.waitForDomContentLoaded();
    await agentChat.deleteRecordbyXRM(EntityNames.Macros, workflowID);
  });

  ///<summary>
  ///Test Case 1580680: verify update an existing record macro action
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1580680
  ///</summary>
  it("Test Case 1580680: verify update an existing record macro action", async () => {
    agentPage = await agentContext.newPage();
    rnd = macrosAdminPage.RandomNumber();
    //Login as admin and create macro
    await agentChat.navigateToOrgUrlAndSignIn(
      TestSettings.MacrosAgentEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);

    const incidentId = await macrosAdminPage.createCaseAndGetIncidentId();
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);

    await macrosAdminPage.createMacro(
      Constants.UpdateAccountMacroName,
      incidentId
    );
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    const workflowID = await macrosAdminPage.getLatestMacro(
      agentChat,
      Constants.UpdateAccountMacroName
    );
    const agentScript = await macrosAdminPage.createAgentScriptByXRMAPI(
      agentChat,
      Constants.UpdateAccountAgentScriptName + rnd,
      Constants.UniqueName + rnd
    );
    const agentScriptStep = await macrosAdminPage.createAgentScriptStepbyXRMAPI(
      agentChat,
      Constants.UpdateAccountAgentScriptName + rnd,
      Constants.UniqueName + rnd + rnd,
      Constants.AgentscriptStepOrder,
      Constants.MacroAgentScriptStep,
      agentScript.id,
      Constants.UpdateAccountMacroName,
      workflowID
    );
    await macrosAdminPage.OpenAgentScriptandSave(
      Constants.UpdateAccountAgentScriptName + rnd
    );
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await macrosAdminPage.addAgentScripttoDefaultChatSessionWithParameter(
      Constants.UpdateAccountAgentScriptName + rnd
    );
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    const caseTitle = await macrosAdminPage.createCaseWithAPI(
      Constants.CaseTitleName
    );
    await macrosAdminPage.InitiateSession(
      caseTitle,
      Constants.LinkStart + caseTitle + Constants.LinkEnd
    );
    //Run Macro and Validate
    const runAndValidateMacro =
      await macrosAdminPage.runMacroInSessionAndValidate(
        Constants.UpdateAccountAgentScriptName + rnd,
        Constants.UpdateAccountTitle
      );
    expect(runAndValidateMacro).toBeTruthy();
    await adminStartPage.waitForDomContentLoaded();
    await macrosAdminPage.deletAgentscriptStepbyXRM(
      agentChat,
      EntityNames.AgentScriptStep,
      agentScriptStep.id
    );
    await adminStartPage.waitForDomContentLoaded();
    await macrosAdminPage.deleteAgentScriptbyXRM(
      agentChat,
      EntityNames.AgentScript,
      agentScript.id
    );
    await adminStartPage.waitForDomContentLoaded();
    await agentChat.deleteRecordbyXRM(EntityNames.Macros, workflowID);
  });

  ///<summary>
  ///Test Case 1717129: Verify Admin can disable/deactivate an existing macros
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_testPlans/execute?planId=2532163&opId=3593&suiteId=2532167
  ///</summary>
  it("Test Case 1717129: Verify Admin can disable/deactivate an existing macros", async () => {
    //Login as admin and create & deactivate macro
    await adminStartPage.navigateToOrgUrlAndSignIn(
      TestSettings.MacrosAgentEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);

    await macrosAdminPage.createMacro(Constants.TestMacro);
    await macrosAdminPage.deactivateMacro(Constants.TestMacro);
    //Check if macro deactivated
    const deactivateMacroResult = await macrosAdminPage.verifyMacroDeactivated(
      adminStartPage,
      Constants.TestMacro
    );
    expect(deactivateMacroResult).toBeTruthy();
  });

  ///<summary>
  ///Test Case 2662215: Verify tab info from Context post Refresh Session Context Macro Action.
  ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2662215
  ///<summary>
  it("Test Case 2662215: Verify tab info from Context post Refresh Session Context Macro Action.", async () => {
    agentPage = await agentContext.newPage();
    rnd = macrosAdminPage.RandomNumber();
    //Login as admin and create macro
    await agentChat.navigateToOrgUrlAndSignIn(
      TestSettings.MacrosAgentEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await macrosAdminPage.createMacro(
      Constants.RefreshSessionMacroName,
      Constants.IncidentID
    );
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    const workflowID = await macrosAdminPage.getLatestMacro(
      agentChat,
      Constants.RefreshSessionMacroName
    );
    await adminStartPage.waitForDomContentLoaded();
    const agentScript = await macrosAdminPage.createAgentScriptByXRMAPI(
      agentChat,
      Constants.RefreshSessionAgentScriptName + rnd,
      Constants.UniqueName + rnd
    );
    await adminStartPage.waitForDomContentLoaded();
    const agentScriptStep = await macrosAdminPage.createAgentScriptStepbyXRMAPI(
      agentChat,
      Constants.RefreshSessionAgentScriptName + rnd,
      Constants.UniqueName + rnd + rnd,
      Constants.AgentscriptStepOrder,
      Constants.MacroAgentScriptStep,
      agentScript.id,
      Constants.RefreshSessionMacroName,
      workflowID
    );
    await macrosAdminPage.OpenAgentScriptandSave(
      Constants.RefreshSessionAgentScriptName + rnd
    );
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await macrosAdminPage.addAgentScripttoDefaultChatSessionWithParameter(
      Constants.RefreshSessionAgentScriptName + rnd
    );
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    const caseTitle = await macrosAdminPage.createCaseWithAPI(
      Constants.CaseTitleName
    );
    await macrosAdminPage.InitiateSession(
      caseTitle,
      Constants.LinkStart + caseTitle + Constants.LinkEnd
    );
    //Run Macro and Validate
    const runAndValidateMacro =
      await macrosAdminPage.runMacroInSessionAndValidate(
        Constants.RefreshSessionAgentScriptName + rnd,
        Constants.ResolveStatemant
      );
    expect(runAndValidateMacro).toBeTruthy();
    await adminStartPage.waitForDomContentLoaded();
    await macrosAdminPage.deletAgentscriptStepbyXRM(
      agentChat,
      EntityNames.AgentScriptStep,
      agentScriptStep.id
    );
    await adminStartPage.waitForDomContentLoaded();
    await macrosAdminPage.deleteAgentScriptbyXRM(
      agentChat,
      EntityNames.AgentScript,
      agentScript.id
    );
  });

  ///<summary>
  ///Test Case 2464821: Open Dashboard Application tab using Macro.
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2464821
  ///</summary>
  it("Test Case 2464821: Open Dashboard Application tab using Macros.", async () => {
    agentPage = await agentContext.newPage();
    //Login as admin and create macro
    await adminStartPage.navigateToOrgUrlAndSignIn(
      TestSettings.MacrosAgentEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    const applicationTabId = await macrosFunction.createApplicationTabAndGetId(
      Constants.DashboardApplicationTab,
      Constants.DashboardApplicationTabUniqueName + rnd,
      Constants.DashboardOptionValue
    );
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);

    await macrosAdminPage.createMacro(
      Constants.DashboardMacroName,
      applicationTabId
    );
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    const workflowID = await macrosAdminPage.getLatestMacro(
      agentChat,
      Constants.DashboardMacroName
    );
    await adminStartPage.waitForDomContentLoaded();
    const agentScript = await agentChat.createAgentScriptbyXRMAPI(
      Constants.DashboardAgentScriptName + rnd,
      Constants.UniqueName + rnd
    );

    const agentScriptStep = await agentChat.createAgentScriptStepbyXRMAPI(
      Constants.DashboardAgentScriptName + rnd,
      Constants.UniqueName + rnd + rnd,
      Constants.AgentscriptStepOrder,
      Constants.MacroAgentScriptStep,
      agentScript.id,
      Constants.DashboardMacroName,
      workflowID
    );

    await macrosAdminPage.OpenAgentScriptandSave(
      Constants.DashboardAgentScriptName + rnd
    );
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await macrosAdminPage.addAgentScripttoDefaultChatSessionWithParameter(
      Constants.DashboardAgentScriptName + rnd
    );
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    const caseTitle = await macrosAdminPage.createCaseWithAPI(
      Constants.CaseTitleName
    );
    await macrosAdminPage.InitiateSession(
      caseTitle,
      Constants.LinkStart + caseTitle + Constants.LinkEnd
    );
    //Run macro
    const runValidateDashboardMacro =
      await macrosAdminPage.runMacroInSessionAndValidate(
        Constants.DashboardAgentScriptName + rnd,
        ConstantsMacros.DashboardTitle
      );
    expect(runValidateDashboardMacro).toBeTruthy();
    await adminStartPage.waitForDomContentLoaded();
    await macrosAdminPage.deletAgentScriptStepByXRM(
      agentChat,
      EntityNames.AgentScriptStep,
      agentScriptStep.id
    );
    await adminStartPage.waitForDomContentLoaded();
    await macrosAdminPage.deleteAgentScriptByXRM(
      agentChat,
      EntityNames.AgentScript,
      agentScript.id
    );
    await adminStartPage.waitForDomContentLoaded();
    await agentChat.deleteRecordbyXRM(EntityNames.Macros, workflowID);
  });

  ///<summary>
  ///Test Case 2464820: Open Control Application tab using Macro.
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2464820
  ///</summary>
  it("Test Case 2464820: Open Control Application tab using Macros.", async () => {
    agentPage = await agentContext.newPage();
    rnd = macrosAdminPage.RandomNumber();
    //Login as admin and create macro
    await agentChat.navigateToOrgUrlAndSignIn(
      TestSettings.MacrosAgentEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);

    const applicationTabId = await macrosFunction.createApplicationTabAndGetId(
      Constants.ControlApplicationTab,
      Constants.ControlApplicationTabUniqueName + rnd,
      Constants.ControlOptionValue
    );
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);

    await macrosAdminPage.createMacro(
      Constants.ControlMacroName,
      applicationTabId
    );
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    const workflowID = await macrosAdminPage.getLatestMacro(
      agentChat,
      Constants.ControlMacroName
    );
    const agentScript = await agentChat.createAgentScriptbyXRMAPI(
      Constants.ControlAgentScriptName + rnd,
      Constants.UniqueName + rnd
    );

    const agentScriptStep = await agentChat.createAgentScriptStepbyXRMAPI(
      Constants.ControlAgentScriptName + rnd,
      Constants.UniqueName + rnd + rnd,
      Constants.AgentscriptStepOrder,
      Constants.MacroAgentScriptStep,
      agentScript.id,
      Constants.ControlMacroName,
      workflowID
    );

    await macrosAdminPage.OpenAgentScriptandSave(
      Constants.ControlAgentScriptName + rnd
    );
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await macrosAdminPage.addAgentScripttoDefaultChatSessionWithParameter(
      Constants.ControlAgentScriptName + rnd
    );
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    const caseTitle = await macrosAdminPage.createCaseWithAPI(
      Constants.CaseTitleName
    );
    await macrosAdminPage.InitiateSession(
      caseTitle,
      Constants.LinkStart + caseTitle + Constants.LinkEnd
    );
    //Run Macro and Validate
    const runAndValidateMacro =
      await macrosAdminPage.runMacroInSessionAndValidate(
        Constants.ControlAgentScriptName + rnd,
        ConstantsMacros.ControlTitle
      );
    expect(runAndValidateMacro).toBeTruthy();
    await adminStartPage.waitForDomContentLoaded();
    await macrosAdminPage.deletAgentScriptStepByXRM(
      agentChat,
      EntityNames.AgentScriptStep,
      agentScriptStep.id
    );
    await adminStartPage.waitForDomContentLoaded();
    await macrosAdminPage.deleteAgentScriptByXRM(
      agentChat,
      EntityNames.AgentScript,
      agentScript.id
    );
    await adminStartPage.waitForDomContentLoaded();
    await agentChat.deleteRecordbyXRM(EntityNames.Macros, workflowID);
  });

  ///<summary>
  ///Test Case 2464805: Open Entity List Application tab using Macro.
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2464805
  ///</summary>
  it("Test Case 2464805: Open Entity List Application tab using Macros.", async () => {
    agentPage = await agentContext.newPage();
    rnd = agentScriptAdminPage.RandomNumber();
    //Login as admin and create cases
    await agentChat.navigateToOrgUrlAndSignIn(
      TestSettings.MacrosAgentEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdmincenter);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);

    const urlId = await macrosFunction.createApplicationTabAndGetId(
      Constants.EntityListApplicationTab,
      Constants.EntityListApplicationTabUniqueName + rnd,
      Constants.EntityListOptionValue
    );
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);

    await macrosAdminPage.createMacro(Constants.EntityListMacroName, urlId);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    const workflowID = await macrosAdminPage.getLatestMacro(
      agentChat,
      Constants.EntityListMacroName
    );
    const agentScript = await agentChat.createAgentScriptbyXRMAPI(
      Constants.EntityListAgentScriptName + rnd,
      Constants.UniqueName + rnd
    );
    const agentScriptStep = await agentChat.createAgentScriptStepbyXRMAPI(
      Constants.EntityListAgentScriptName + rnd,
      Constants.UniqueName + rnd + rnd,
      Constants.AgentscriptStepOrder,
      Constants.MacroAgentScriptStep,
      agentScript.id,
      Constants.EntityListMacroName,
      workflowID
    );
    await macrosAdminPage.OpenAgentScriptandSave(
      Constants.EntityListAgentScriptName + rnd
    );
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await macrosAdminPage.addAgentScripttoDefaultChatSessionWithParameter(
      Constants.EntityListAgentScriptName + rnd
    );
    //Run Macro
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    const caseTitle = await macrosAdminPage.createCaseWithAPI(
      Constants.CaseTitleName
    );
    await macrosAdminPage.InitiateSession(
      caseTitle,
      Constants.LinkStart + caseTitle + Constants.LinkEnd
    );
    const runValidateEntityListMacro =
      await macrosAdminPage.runMacroInSessionAndValidate(
        Constants.EntityListAgentScriptName + rnd,
        ConstantsMacros.EntityListTitle
      );
    expect(runValidateEntityListMacro).toBeTruthy();
    await adminStartPage.waitForDomContentLoaded();
    await macrosAdminPage.deletAgentScriptStepByXRM(
      agentChat,
      EntityNames.AgentScriptStep,
      agentScriptStep.id
    );
    await adminStartPage.waitForDomContentLoaded();
    await macrosAdminPage.deleteAgentScriptByXRM(
      agentChat,
      EntityNames.AgentScript,
      agentScript.id
    );
    await adminStartPage.waitForDomContentLoaded();
    await agentChat.deleteRecordbyXRM(EntityNames.Macros, workflowID);
  });

  ///<summary>
  ///Test Case 2464824: Open Third Party Website Application tab using Macro.
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2464824
  ///</summary>
  it("Test Case 2464824: Open Third Party Website Application tab using Macros.", async () => {
    agentPage = await agentContext.newPage();
    rnd = agentScriptAdminPage.RandomNumber();

    //Login as admin and create cases
    await agentChat.navigateToOrgUrlAndSignIn(
      TestSettings.MacrosAgentEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);

    const applicationTabId = await macrosFunction.createApplicationTabAndGetId(
      Constants.ThirdPartyWebsiteApplicationTab,
      Constants.ThirdPartyWebsiteApplicationTabUniqueName + rnd,
      Constants.ThirdPartyWebsiteOptionValue
    );
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);

    await macrosAdminPage.createMacro(
      Constants.ThirdPartyWebsiteMacroName,
      applicationTabId
    );

    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);

    const workflowID = await macrosAdminPage.getLatestMacro(
      agentChat,
      Constants.ThirdPartyWebsiteMacroName
    );

    const agentScript = await macrosAdminPage.createAgentScriptByXRMAPI(
      agentChat,
      Constants.ThirdPartyWebsiteAgentScriptName + rnd,
      Constants.UniqueName + rnd
    );

    const agentScriptStep = await macrosAdminPage.createAgentScriptStepbyXRMAPI(
      agentChat,
      Constants.ThirdPartyWebsiteAgentScriptName + rnd,
      Constants.UniqueName + rnd + rnd,
      Constants.AgentscriptStepOrder,
      Constants.MacroAgentScriptStep,
      agentScript.id,
      Constants.ThirdPartyWebsiteMacroName,
      workflowID
    );

    await macrosAdminPage.OpenAgentScriptandSave(
      Constants.ThirdPartyWebsiteAgentScriptName + rnd
    );
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await macrosAdminPage.addAgentScripttoDefaultChatSessionWithParameter(
      Constants.ThirdPartyWebsiteAgentScriptName + rnd
    );
    //Run Macro
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    const caseTitle = await macrosAdminPage.createCaseWithAPI(
      Constants.CaseTitleName
    );
    await macrosAdminPage.InitiateSession(
      caseTitle,
      Constants.LinkStart + caseTitle + Constants.LinkEnd
    );
    const runValidateTPWMacro =
      await macrosAdminPage.runMacroInSessionAndValidate(
        Constants.ThirdPartyWebsiteAgentScriptName + rnd,
        ConstantsMacros.ThirdPartyWebsiteTitle
      );
    expect(runValidateTPWMacro).toBeTruthy();
    await adminStartPage.waitForDomContentLoaded();
    await macrosAdminPage.deletAgentscriptStepbyXRM(
      agentChat,
      EntityNames.AgentScriptStep,
      agentScriptStep.id
    );
    await adminStartPage.waitForDomContentLoaded();
    await macrosAdminPage.deleteAgentScriptbyXRM(
      agentChat,
      EntityNames.AgentScript,
      agentScript.id
    );
    await adminStartPage.waitForDomContentLoaded();
    await agentChat.deleteRecordbyXRM(EntityNames.Macros, workflowID);
  });

  ///<summary>
  ///Test Case 2464823: Open Search Application tab using Macro.
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2464823
  ///</summary>
  it("Test Case 2464823: Open Search Application tab using Macros.", async () => {
    agentPage = await agentContext.newPage();
    rnd = agentScriptAdminPage.RandomNumber();
    //Login as admin and create cases
    await agentChat.navigateToOrgUrlAndSignIn(
      TestSettings.MacrosAgentEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);

    const applicationTabId = await macrosFunction.createApplicationTabAndGetId(
      Constants.SearchApplicationTab,
      Constants.UniqueName + rnd,
      Constants.EntitySearchOptionValue
    );
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);

    await macrosAdminPage.createMacro(
      Constants.SearchMacroName,
      applicationTabId
    );
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    const workflowID = await macrosAdminPage.getLatestMacro(
      agentChat,
      Constants.SearchMacroName
    );
    await adminStartPage.waitForDomContentLoaded();
    const agentScript = await agentChat.createAgentScriptbyXRMAPI(
      Constants.SearchAgentScriptName + rnd,
      Constants.UniqueName + rnd
    );
    await adminStartPage.waitForDomContentLoaded();
    const agentScriptStep = await agentChat.createAgentScriptStepbyXRMAPI(
      Constants.SearchAgentScriptName + rnd,
      Constants.UniqueName + rnd + rnd,
      Constants.AgentscriptStepOrder,
      Constants.MacroAgentScriptStep,
      agentScript.id,
      Constants.SearchMacroName,
      workflowID
    );
    await adminStartPage.waitForDomContentLoaded();
    await macrosAdminPage.OpenAgentScriptandSave(
      Constants.SearchAgentScriptName + rnd
    );
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await macrosAdminPage.addAgentScripttoDefaultChatSessionWithParameter(
      Constants.SearchAgentScriptName + rnd
    );
    //Run Macro
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    const caseTitle = await macrosAdminPage.createCaseWithAPI(
      Constants.CaseTitleName
    );
    await macrosAdminPage.InitiateSession(
      caseTitle,
      Constants.LinkStart + caseTitle + Constants.LinkEnd
    );
    const runValidateSearchMacro =
      await macrosAdminPage.runMacroInSessionAndValidate(
        Constants.SearchAgentScriptName + rnd,
        ConstantsMacros.SearchTitle
      );
    expect(runValidateSearchMacro).toBeTruthy();
    await adminStartPage.waitForDomContentLoaded();
    await macrosAdminPage.deletAgentScriptStepByXRM(
      agentChat,
      EntityNames.AgentScriptStep,
      agentScriptStep.id
    );
    await adminStartPage.waitForDomContentLoaded();
    await macrosAdminPage.deleteAgentScriptByXRM(
      agentChat,
      EntityNames.AgentScript,
      agentScript.id
    );
    await adminStartPage.waitForDomContentLoaded();
    await agentChat.deleteRecordbyXRM(EntityNames.Macros, workflowID);
  });

  ///<summary>
  ///Test Case 2464818: Open Web Resource Application tab using Macro.
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2464818
  ///</summary>
  it("Test Case 2464818: Open Web Resource Application tab using Macros.", async () => {
    agentPage = await agentContext.newPage();
    rnd = agentScriptAdminPage.RandomNumber();
    //Login as admin and create macro
    await adminStartPage.navigateToOrgUrlAndSignIn(
      TestSettings.MacrosAgentEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);

    const urlId = await macrosFunction.createApplicationTabAndGetId(
      Constants.WebResourceApplicationTab,
      Constants.WebResourceApplicationTabUniqueName + rnd,
      Constants.WebResourceOptionValue
    );
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);

    await macrosAdminPage.createMacro(Constants.WebResourceMacroName, urlId);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    const workflowID = await macrosAdminPage.getLatestMacro(
      agentChat,
      Constants.WebResourceMacroName
    );
    const agentScript = await agentChat.createAgentScriptbyXRMAPI(
      Constants.WebResourceAgentScriptName + rnd,
      Constants.UniqueName + rnd
    );
    const agentScriptStep = await agentChat.createAgentScriptStepbyXRMAPI(
      Constants.WebResourceAgentScriptName + rnd,
      Constants.UniqueName + rnd + rnd,
      Constants.AgentscriptStepOrder,
      Constants.MacroAgentScriptStep,
      agentScript.id,
      Constants.WebResourceMacroName,
      workflowID
    );
    await macrosAdminPage.OpenAgentScriptandSave(
      Constants.WebResourceAgentScriptName + rnd
    );
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await macrosAdminPage.addAgentScripttoDefaultChatSessionWithParameter(
      Constants.WebResourceAgentScriptName + rnd
    );
    //Run Macro
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    const caseTitle = await macrosAdminPage.createCaseWithAPI(
      Constants.CaseTitleName
    );
    await macrosAdminPage.InitiateSession(
      caseTitle,
      Constants.LinkStart + caseTitle + Constants.LinkEnd
    );
    const openEntityRecordTabUsingMacro =
      await macrosAdminPage.runMacroInSessionAndValidate(
        Constants.WebResourceAgentScriptName + rnd,
        ConstantsMacros.WebResourceTitle
      );
    expect(openEntityRecordTabUsingMacro).toBeTruthy();
    await adminStartPage.waitForDomContentLoaded();
    await macrosAdminPage.deletAgentScriptStepByXRM(
      agentChat,
      EntityNames.AgentScriptStep,
      agentScriptStep.id
    );
    await adminStartPage.waitForDomContentLoaded();
    await macrosAdminPage.deleteAgentScriptByXRM(
      agentChat,
      EntityNames.AgentScript,
      agentScript.id
    );
    await adminStartPage.waitForDomContentLoaded();
    await agentChat.deleteRecordbyXRM(EntityNames.Macros, workflowID);
  });

  ///<summary>
  ///Test Case 2453339: Open Entity Record Application tab using Macro.
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2453339
  ///</summary>
  it("Test Case 2453339: Open Entity Record Application tab using Macros", async () => {
    agentPage = await agentContext.newPage();
    rnd = agentScriptAdminPage.RandomNumber();
    //Login as admin and create macro
    await adminStartPage.navigateToOrgUrlAndSignIn(
      TestSettings.MacrosAgentEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);

    const applicationTabId = await macrosFunction.createApplicationTabAndGetId(
      Constants.EntityRecordApplicationTab,
      Constants.EntityRecordApplicationTabUniqueName + rnd,
      Constants.EntityRecordOptionValue
    );
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);

    await macrosAdminPage.createMacro(
      Constants.EntityRecordMacroName,
      applicationTabId
    );
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    const workflowID = await macrosAdminPage.getLatestMacro(
      agentChat,
      Constants.EntityRecordMacroName
    );
    const agentScript = await agentChat.createAgentScriptbyXRMAPI(
      Constants.EntityRecordAgentScriptName + rnd,
      Constants.UniqueName + rnd
    );
    const agentScriptStep = await agentChat.createAgentScriptStepbyXRMAPI(
      Constants.EntityRecordAgentScriptName + rnd,
      Constants.UniqueName + rnd + rnd,
      Constants.AgentscriptStepOrder,
      Constants.MacroAgentScriptStep,
      agentScript.id,
      Constants.EntityRecordMacro,
      workflowID
    );
    await macrosAdminPage.OpenAgentScriptandSave(
      Constants.EntityRecordAgentScriptName + rnd
    );
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await macrosAdminPage.addAgentScripttoDefaultChatSessionWithParameter(
      Constants.EntityRecordAgentScriptName + rnd
    );
    //Run Macro
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await macrosAdminPage.waitForDomContentLoaded();
    await macrosAdminPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    
    const CaseTitleName = await macrosAdminPage.createCaseWithAPI(
      Constants.CaseTitleName
    );
    await macrosAdminPage.InitiateSession(
      CaseTitleName,
      Constants.LinkStart + CaseTitleName + Constants.LinkEnd
    );
    const runAndValidateMacro =
      await macrosAdminPage.runMacroInSessionAndValidate(
        Constants.EntityRecordAgentScriptName + rnd,
        Constants.EntityRecordTitle
      );
    expect(runAndValidateMacro).toBeTruthy();
    await adminStartPage.waitForDomContentLoaded();
    await agentChat.deleteRecordbyXRM(
      EntityNames.AgentScriptStep,
      agentScriptStep.id
    );
    await adminStartPage.waitForDomContentLoaded();
    await agentChat.deleteRecordbyXRM(EntityNames.AgentScript, agentScript.id);
    await adminStartPage.waitForDomContentLoaded();
    await agentChat.deleteRecordbyXRM(EntityNames.Macros, workflowID);
  });

  ///<summary>
  /// Test Case 1760322: [Macros] Verify KB article is opening at agent side when using 'Open Knowledgebase article' in macro
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1760322
  ///</summary>
  it("Test Case 1760322: [Macros] Verify KB article is opening at agent side when using 'Open Knowledgebase article' in macro", async () => {
    agentPage = await agentContext.newPage();
    rnd = agentScriptAdminPage.RandomNumber();
    //Login as admin and create macro
    await adminStartPage.navigateToOrgUrlAndSignIn(
      TestSettings.MacrosAgentEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);

    const kbArticleId = await macrosAdminPage.createKbArticleAndGetId();
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);

    await macrosAdminPage.createMacro(
      Constants.OpenKbArticleMacroName,
      kbArticleId
    );
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    const workflowID = await macrosAdminPage.getLatestMacro(
      agentChat,
      Constants.OpenKbArticleMacroName
    );
    const agentScript = await agentChat.createAgentScriptbyXRMAPI(
      Constants.OpenKbArticleAgentScriptName + rnd,
      Constants.UniqueName + rnd
    );
    const agentScriptStep = await agentChat.createAgentScriptStepbyXRMAPI(
      Constants.OpenKbArticleAgentScriptName + rnd,
      Constants.UniqueName + rnd + rnd,
      Constants.AgentscriptStepOrder,
      Constants.MacroAgentScriptStep,
      agentScript.id,
      Constants.OpenKbArticleMacroName,
      workflowID
    );
    await macrosAdminPage.OpenAgentScriptandSave(
      Constants.OpenKbArticleAgentScriptName + rnd
    );
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await macrosAdminPage.addAgentScripttoDefaultChatSessionWithParameter(
      Constants.OpenKbArticleAgentScriptName + rnd
    );
    //Run Macro
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    const caseTitle = await macrosAdminPage.createCaseWithAPI(
      Constants.CaseTitleName
    );
    await macrosAdminPage.InitiateSession(
      caseTitle,
      Constants.LinkStart + caseTitle + Constants.LinkEnd
    );
    const openEntityRecordTabUsingMacro =
      await macrosAdminPage.runMacroInSessionAndValidate(
        Constants.OpenKbArticleAgentScriptName + rnd,
        ConstantsMacros.OpenKbArticleTitle
      );
    expect(openEntityRecordTabUsingMacro).toBeTruthy();
    await adminStartPage.waitForDomContentLoaded();
    await macrosAdminPage.deletAgentScriptStepByXRM(
      agentChat,
      EntityNames.AgentScriptStep,
      agentScriptStep.id
    );
    await adminStartPage.waitForDomContentLoaded();
    await macrosAdminPage.deleteAgentScriptByXRM(
      agentChat,
      EntityNames.AgentScript,
      agentScript.id
    );
    await adminStartPage.waitForDomContentLoaded();
    await agentChat.deleteRecordbyXRM(EntityNames.Macros, workflowID);
  });

  ///<summary>
  ///Test Case 2366983: [Macros] Verify can search the knowledge base for the populated phrase by using 'Search the knowledge base for the populated phrase' action in the Productivity Automation.
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2366983
  ///</summary>
  it("Test Case 2366983: [Macros] Verify can search the knowledge base for the populated phrase by using 'Search the knowledge base for the populated phrase' action in the Productivity Automation.", async () => {
    agentPage = await agentContext.newPage();
    rnd = agentScriptAdminPage.RandomNumber();
    //Login as admin and create cases
    await agentChat.navigateToOrgUrlAndSignIn(
      TestSettings.MacrosAgentEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await macrosAdminPage.createMacro(Constants.SearchPhraseForPopulatedPhrase);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    const workflowID = await macrosAdminPage.getLatestMacro(
      agentChat,
      Constants.SearchPhraseForPopulatedPhrase
    );
    await adminStartPage.waitForDomContentLoaded();
    const agentScript = await macrosAdminPage.createAgentScriptByXRMAPI(
      agentChat,
      Constants.SearchPhraseAgentScript,
      Constants.SearchPhraseAgentScriptUniqueName + rnd
    );
    await adminStartPage.waitForDomContentLoaded();
    const agentScriptStep = await macrosAdminPage.createAgentScriptStepbyXRMAPI(
      agentChat,
      Constants.SearchPhraseAgentScript,
      Constants.SearchPhraseAgentScriptUniqueName + rnd + rnd,
      Constants.AgentscriptStepOrder,
      Constants.MacroAgentScriptStep,
      agentScript.id,
      Constants.SearchPhraseForPopulatedPhrase,
      workflowID
    );

    await macrosAdminPage.OpenAgentScriptandSave(
      Constants.SearchPhraseAgentScript
    );
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await macrosAdminPage.addAgentScripttoDefaultChatSessionWithParameter(
      Constants.SearchPhraseAgentScript
    );

    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    const caseTitle = await macrosAdminPage.createCaseWithAPI(
      Constants.CaseTitleName
    );
    await macrosAdminPage.InitiateSession(
      caseTitle,
      Constants.LinkStart + caseTitle + Constants.LinkEnd
    );
    //Run Macro in a session & verify tab opened
    const macroResult = await macrosAdminPage.runMacroInSessionAndValidate(
      Constants.SearchPhraseAgentScript,
      ConstantsMacros.SearchPhraseTabName
    );
    expect(macroResult).toBeTruthy();
    await adminStartPage.waitForDomContentLoaded(); 
    await macrosAdminPage.deletAgentscriptStepbyXRM(
      agentChat,
      EntityNames.AgentScriptStep,
      agentScriptStep.id
    );
    await adminStartPage.waitForDomContentLoaded();
    await macrosAdminPage.deleteAgentScriptbyXRM(
      agentChat,
      EntityNames.AgentScript,
      agentScript.id
    );
  });

  ///<summary>
  ///Test Case 2313868: [Macros] Verify tab is refreshed using 'Refresh the tab' action in the macros.
  ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2313868
  ///</summary>
  it("Test Case 2313868: [Macros] Verify tab is refreshed using 'Refresh the tab' action in the macros.", async () => {
    agentPage = await agentContext.newPage();
    rnd = agentScriptAdminPage.RandomNumber();

    //Login as admin and create cases
    await agentChat.navigateToOrgUrlAndSignIn(
      TestSettings.MacrosAgentEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);

    await macrosAdminPage.createMacro(Constants.OpenRefreshTab);
    const workflowID = await macrosAdminPage.getLatestMacro(
      agentChat,
      Constants.OpenRefreshTab
    );
    const agentScript = await macrosAdminPage.createAgentScriptByXRMAPI(
      agentChat,
      Constants.RefreshTabAgentScript,
      Constants.RefreshTabAgentScriptUniqueName + rnd
    );

    const agentScriptStep = await macrosAdminPage.createAgentScriptStepbyXRMAPI(
      agentChat,
      Constants.RefreshTabAgentScript,
      Constants.RefreshTabAgentScriptUniqueName + rnd + rnd,
      Constants.AgentscriptStepOrder,
      Constants.MacroAgentScriptStep,
      agentScript.id,
      Constants.OpenRefreshTab,
      workflowID
    );
    await macrosAdminPage.OpenAgentScriptandSave(
      Constants.RefreshTabAgentScript
    );
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await macrosAdminPage.addAgentScripttoDefaultChatSessionWithParameter(
      Constants.RefreshTabAgentScript
    );
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    const caseTitle = await macrosAdminPage.createCaseWithAPI(
      Constants.CaseTitleName
    );
    await macrosAdminPage.InitiateSession(
      caseTitle,
      Constants.LinkStart + caseTitle + Constants.LinkEnd
    );
    //Run Macro in a session
    const macroResult = await macrosAdminPage.runMacroInSessionAndValidate(
      Constants.RefreshTabAgentScript,
      ConstantsMacros.RefreshTabTitle
    );
    expect(macroResult).toBeTruthy();
    await adminStartPage.waitForDomContentLoaded();
    await macrosAdminPage.deletAgentscriptStepbyXRM(
      agentChat,
      EntityNames.AgentScriptStep,
      agentScriptStep.id
    );
    await adminStartPage.waitForDomContentLoaded();
    await macrosAdminPage.deleteAgentScriptbyXRM(
      agentChat,
      EntityNames.AgentScript,
      agentScript.id
    );
    await adminStartPage.waitForDomContentLoaded();
    await agentChat.deleteRecordbyXRM(EntityNames.Macros, workflowID);
  });

  ///<summary>
  ///Test Case 2366971: [Macros] Verify existing record is opened  using 'Open an existing record' action in the Productivity Automation.
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2366971
  ///</summary>
  it("Test Case 2366971: [Macros] Verify existing record is opened using 'Open an existing record' action in the Productivity Automation.", async () => {
    agentPage = await agentContext.newPage();
    rnd = agentScriptAdminPage.RandomNumber();
    //Login as admin and create macro
    await adminStartPage.navigateToOrgUrlAndSignIn(
      TestSettings.MacrosAgentEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);

    const accountId = await macrosAdminPage.createAccountAndGetId(
      Constants.AccountName + rnd
    );
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);

    await macrosAdminPage.createMacro(
      Constants.ExistingRecordMacroName,
      accountId
    );
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    const workflowID = await macrosAdminPage.getLatestMacro(
      agentChat,
      Constants.ExistingRecordMacroName
    );
    const agentScript = await agentChat.createAgentScriptbyXRMAPI(
      Constants.ExistingRecordAgentScriptName + rnd,
      Constants.UniqueName + rnd
    );
    const agentScriptStep = await agentChat.createAgentScriptStepbyXRMAPI(
      Constants.ExistingRecordAgentScriptName + rnd,
      Constants.UniqueName + rnd + rnd,
      Constants.AgentscriptStepOrder,
      Constants.MacroAgentScriptStep,
      agentScript.id,
      Constants.ExistingRecordMacroName,
      workflowID
    );
    await macrosAdminPage.OpenAgentScriptandSave(
      Constants.ExistingRecordAgentScriptName + rnd
    );
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await macrosAdminPage.addAgentScripttoDefaultChatSessionWithParameter(
      Constants.ExistingRecordAgentScriptName + rnd
    );
    //Run Macro
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    const caseTitle = await macrosAdminPage.createCaseWithAPI(
      Constants.CaseTitleName
    );
    await macrosAdminPage.InitiateSession(
      caseTitle,
      Constants.LinkStart + caseTitle + Constants.LinkEnd
    );
    const openEntityRecordTabUsingMacro =
      await macrosAdminPage.runMacroInSessionAndValidate(
        Constants.ExistingRecordAgentScriptName + rnd,
        ConstantsMacros.ExistRecordTitleName
      );
    expect(openEntityRecordTabUsingMacro).toBeTruthy();
    await adminStartPage.waitForDomContentLoaded();
    await macrosAdminPage.deletAgentScriptStepByXRM(
      agentChat,
      EntityNames.AgentScriptStep,
      agentScriptStep.id
    );
    await adminStartPage.waitForDomContentLoaded();
    await macrosAdminPage.deleteAgentScriptByXRM(
      agentChat,
      EntityNames.AgentScript,
      agentScript.id
    );
    await adminStartPage.waitForDomContentLoaded();
    await agentChat.deleteRecordbyXRM(EntityNames.Macros, workflowID);
  });

  ///<summary>
  ///Test Case 2253528: [Macros] Verify web resources application template is opened in new tab using 'Open application tab' action in macros
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_testPlans/execute?planId=2532163&opId=3593&suiteId=2532167
  // ///</summary>
  it("Test Case 2253528: [Macros] Verify web resources application template is opened in new tab using 'Open application tab' action in macros", async () => {
    agentPage = await agentContext.newPage();
    rnd = agentScriptAdminPage.RandomNumber();
    //Login as admin and create macro
    await adminStartPage.navigateToOrgUrlAndSignIn(
      TestSettings.MacrosAgentEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);

    const applicationTabId = await macrosFunction.createApplicationTabAndGetId(
      Constants.WebResourceApplicationTab,
      Constants.UniqueName + rnd,
      Constants.WebResourceOptionValue
    );
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);

    await macrosAdminPage.createMacro(
      Constants.WebResourcesMacroName,
      applicationTabId
    );
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    const workflowID = await macrosAdminPage.getLatestMacro(
      agentChat,
      Constants.WebResourcesMacroName
    );
    const agentScript = await agentChat.createAgentScriptbyXRMAPI(
      Constants.WebResourcesAgentScriptName + rnd,
      Constants.UniqueName + rnd
    );
    const agentScriptStep = await agentChat.createAgentScriptStepbyXRMAPI(
      Constants.WebResourcesAgentScriptName + rnd,
      Constants.UniqueName + rnd + rnd,
      Constants.AgentscriptStepOrder,
      Constants.MacroAgentScriptStep,
      agentScript.id,
      Constants.WebResourcesMacroName,
      workflowID
    );
    await macrosAdminPage.OpenAgentScriptandSave(
      Constants.WebResourcesAgentScriptName + rnd
    );
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await macrosAdminPage.addAgentScripttoDefaultChatSessionWithParameter(
      Constants.WebResourcesAgentScriptName + rnd
    );
    //Run Macro
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    const caseTitle = await macrosAdminPage.createCaseWithAPI(
      Constants.CaseTitleName
    );
    await macrosAdminPage.InitiateSession(
      caseTitle,
      Constants.LinkStart + caseTitle + Constants.LinkEnd
    );
    const openEntityRecordTabUsingMacro =
      await macrosAdminPage.runMacroInSessionAndValidate(
        Constants.WebResourcesAgentScriptName + rnd,
        ConstantsMacros.WebResourcesTitle
      );
    expect(openEntityRecordTabUsingMacro).toBeTruthy();
    await adminStartPage.waitForDomContentLoaded();
    await macrosAdminPage.deletAgentScriptStepByXRM(
      agentChat,
      EntityNames.AgentScriptStep,
      agentScriptStep.id
    );
    await adminStartPage.waitForDomContentLoaded();
    await macrosAdminPage.deleteAgentScriptByXRM(
      agentChat,
      EntityNames.AgentScript,
      agentScript.id
    );
    await adminStartPage.waitForDomContentLoaded();
    await agentChat.deleteRecordbyXRM(EntityNames.Macros, workflowID);
  });

  /// <summary>
  /// Test Case 1580682:- Verify DraftEmail macro action
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1580682
  /// </summary>
  it("Test Case 1580682: Verify DraftEmail macro action", async () => {
    agentPage = await agentContext.newPage();
    rnd = agentScriptAdminPage.RandomNumber();
    //Login as admin and create macro
    await adminStartPage.navigateToOrgUrlAndSignIn(
      TestSettings.MacrosAgentEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);

    const incidentId = await macrosAdminPage.createCaseAndGetIncidentId();
    await macrosAdminPage.waitForDomContentLoaded();
    const incidentEmailTemplateId =
      await macrosAdminPage.CreateEmailTemplateAndGetId();
    await macrosAdminPage.waitForDomContentLoaded();
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);

    await macrosAdminPage.createMacro(
      Constants.CreateDraftEmailMacroName,
      incidentEmailTemplateId,
      incidentId
    );
    await macrosAdminPage.waitForDomContentLoaded();
    const workflowID = await macrosAdminPage.getLatestMacro(
      agentChat,
      Constants.CreateDraftEmailMacroName
    );
    const agentScript = await agentChat.createAgentScriptbyXRMAPI(
      Constants.CreateDraftEmailAgentScriptName + rnd,
      Constants.UniqueName + rnd
    );
    const agentScriptStep = await agentChat.createAgentScriptStepbyXRMAPI(
      Constants.CreateDraftEmailAgentScriptName + rnd,
      Constants.UniqueName + rnd + rnd,
      Constants.AgentscriptStepOrder,
      Constants.MacroAgentScriptStep,
      agentScript.id,
      Constants.CreateDraftEmailMacroName,
      workflowID
    );
    await macrosAdminPage.OpenAgentScriptandSave(
      Constants.CreateDraftEmailAgentScriptName + rnd
    );
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await macrosAdminPage.addAgentScripttoDefaultChatSessionWithParameter(
      Constants.CreateDraftEmailAgentScriptName + rnd
    );
    //Run Macro
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    const caseTitle = await macrosAdminPage.createCaseWithAPI(
      Constants.CaseTitleName
    );
    await macrosAdminPage.InitiateSession(
      caseTitle,
      Constants.LinkStart + caseTitle + Constants.LinkEnd
    );
    const openEntityRecordTabUsingMacro =
      await macrosAdminPage.runMacroInSessionAndValidate(
        Constants.CreateDraftEmailAgentScriptName + rnd,
        Constants.CreateDraftEmailTitle
      );
    expect(openEntityRecordTabUsingMacro).toBeTruthy();
    await adminStartPage.waitForDomContentLoaded();
    await macrosAdminPage.deletAgentScriptStepByXRM(
      agentChat,
      EntityNames.AgentScriptStep,
      agentScriptStep.id
    );
    await adminStartPage.waitForDomContentLoaded(); 
    await macrosAdminPage.deleteAgentScriptByXRM(
      agentChat,
      EntityNames.AgentScript,
      agentScript.id
    );
    await adminStartPage.waitForDomContentLoaded();
    await agentChat.deleteRecordbyXRM(EntityNames.Macros, workflowID);
  });

  ///<summary>
  ///Test Case 1795816: [Runtime]: Verify details are showing properly when script step and macro step fails
  ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1795816
  ///</summary>
  it("Test Case 1795816: [Runtime]: Verify details are showing properly when script step and macro step fails.", async () => {
    agentPage = await agentContext.newPage();
    rnd = agentScriptAdminPage.RandomNumber();
    //Login as admin and create macro
    await adminStartPage.navigateToOrgUrlAndSignIn(
      TestSettings.MacrosAgentEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);

    await macrosAdminPage.createMacro(Constants.FailMacroName);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    const workflowID = await macrosAdminPage.getLatestMacro(
      agentChat,
      Constants.FailMacroName
    );
    const agentScript = await agentChat.createAgentScriptbyXRMAPI(
      Constants.FailAgentScriptName + rnd,
      Constants.UniqueName + rnd
    );
    await macrosAdminPage.OpenAgentScriptandSave(
      Constants.FailAgentScriptName + rnd
    );
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await macrosAdminPage.addAgentScripttoDefaultChatSessionWithParameter(
      Constants.FailAgentScriptName + rnd
    );
    //Run Macro
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    const caseTitle = await macrosAdminPage.createCaseWithAPI(
      Constants.CaseTitleName
    );
    await macrosAdminPage.InitiateSession(
      caseTitle,
      Constants.LinkStart + caseTitle + Constants.LinkEnd
    );
    const openEntityRecordTabUsingMacro =
      await macrosAdminPage.runFailMacroAndValidate(
        Constants.FailAgentScriptName + rnd,
        ConstantsMacros.FailTitle
      );
    expect(openEntityRecordTabUsingMacro).toBeTruthy();
    await macrosAdminPage.deleteAgentScriptByXRM(
      agentChat,
      EntityNames.AgentScript,
      agentScript.id
    );
    await agentChat.deleteRecordbyXRM(EntityNames.Macros, workflowID);
  });

  ///<summary>
  ///Test Case 2367015: [Macros] Verify cloning of current record by using 'Clone current record' action in the Productivity Automation.
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2367015
  ///</summary>
  it("Test Case 2367015: [Macros] Verify cloning of current record by using 'Clone current record' action in the Productivity Automation.", async () => {
    agentPage = await agentContext.newPage();
    rnd = agentScriptAdminPage.RandomNumber();
    //Login as admin and create macro
    await adminStartPage.navigateToOrgUrlAndSignIn(
      TestSettings.MacrosAgentEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await macrosAdminPage.CreateCloneCurrentMacro(
      Constants.CloneRecordMacroName,
      Constants.RecordName
    );
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    const workflowID = await macrosAdminPage.getLatestMacro(
      agentChat,
      Constants.CloneRecordMacroName
    );
    await macrosAdminPage.waitForDomContentLoaded();
    const agentScript = await agentChat.createAgentScriptbyXRMAPI(
      Constants.CloneRecordAgentScriptName + rnd,
      Constants.UniqueName + rnd
    );
    await macrosAdminPage.waitForDomContentLoaded();
    const agentScriptStep = await agentChat.createAgentScriptStepbyXRMAPI(
      Constants.CloneRecordAgentScriptName + rnd,
      Constants.UniqueName + rnd + rnd,
      Constants.AgentscriptStepOrder,
      Constants.MacroAgentScriptStep,
      agentScript.id,
      Constants.CloneRecordMacroName,
      workflowID
    );
    await macrosAdminPage.waitForDomContentLoaded();
    await macrosAdminPage.OpenAgentScriptandSave(
      Constants.CloneRecordAgentScriptName + rnd
    );
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await macrosAdminPage.addAgentScripttoDefaultChatSessionWithParameter(
      Constants.CloneRecordAgentScriptName + rnd
    );
    //Run Macro
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await macrosAdminPage.waitForDomContentLoaded();
    await macrosAdminPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    const caseTitle = await macrosAdminPage.createCaseWithAPI(
      Constants.CaseTitleName
    );
    await macrosAdminPage.InitiateSession(
      caseTitle,
      Constants.LinkStart + caseTitle + Constants.LinkEnd
    );
    const openEntityRecordTabUsingMacro =
      await macrosAdminPage.runMacroInSessionAndValidate(
        Constants.CloneRecordAgentScriptName + rnd,
        ConstantsMacros.CloneRecordTitle
      );
    expect(openEntityRecordTabUsingMacro).toBeTruthy();
    await adminStartPage.waitForDomContentLoaded();
    await macrosAdminPage.deletAgentScriptStepByXRM(
      agentChat,
      EntityNames.AgentScriptStep,
      agentScriptStep.id
    );
    await adminStartPage.waitForDomContentLoaded();
    await macrosAdminPage.deleteAgentScriptByXRM(
      agentChat,
      EntityNames.AgentScript,
      agentScript.id
    );
  });

  ///<summary>
  ///Test Case 2253523: [Macros] Verify entity search application template  is opened in new tab using 'Open application tab' action in macros
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2253523
  ///</summary>
  it("Test Case 2253523: [Macros] Verify entity view application template is opened in new tab using 'Open application tab' action in macros", async () => {
    agentPage = await agentContext.newPage();
    rnd = agentScriptAdminPage.RandomNumber();
    //Login as admin and create cases
    await agentChat.navigateToOrgUrlAndSignIn(
      TestSettings.MacrosAgentEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);

    const applicationTabId = await macrosFunction.createApplicationTabAndGetId(
      Constants.EntitySearchApplicationTab,
      Constants.EntitySearchApplicationTabUniqueName + rnd,
      Constants.EntitySearchOptionValue
    );
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);

    await macrosAdminPage.createMacro(
      Constants.EntitySearchMacroName,
      applicationTabId
    );
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    const workflowID = await macrosAdminPage.getLatestMacro(
      agentChat,
      Constants.EntitySearchMacroName
    );
    await adminStartPage.waitForDomContentLoaded();
    const agentScript = await agentChat.createAgentScriptbyXRMAPI(
      Constants.EntitySearchAgentScriptName + rnd + rnd,
      Constants.UniqueName + rnd
    );
    const agentScriptStep = await agentChat.createAgentScriptStepbyXRMAPI(
      Constants.EntitySearchAgentScriptName + rnd + rnd,
      Constants.UniqueName + rnd + rnd,
      Constants.AgentscriptStepOrder,
      Constants.MacroAgentScriptStep,
      agentScript.id,
      Constants.EntitySearchMacroName,
      workflowID
    );
    await adminStartPage.waitForDomContentLoaded();
    await macrosAdminPage.OpenAgentScriptandSave(
      Constants.EntitySearchAgentScriptName + rnd + rnd
    );
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await macrosAdminPage.addAgentScripttoDefaultChatSessionWithParameter(
      Constants.EntitySearchAgentScriptName + rnd + rnd
    );
    //Run Macro
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    const caseTitle = await macrosAdminPage.createCaseWithAPI(
      Constants.CaseTitleName
    );
    await macrosAdminPage.InitiateSession(
      caseTitle,
      Constants.LinkStart + caseTitle + Constants.LinkEnd
    );
    const runValidateEntitySearchMacro =
      await macrosAdminPage.runMacroInSessionAndValidate(
        Constants.EntitySearchAgentScriptName + rnd + rnd,
        Constants.EntitySearchTitle
      );
    expect(runValidateEntitySearchMacro).toBeTruthy();
    await adminStartPage.waitForDomContentLoaded();
    await macrosAdminPage.deletAgentScriptStepByXRM(
      agentChat,
      EntityNames.AgentScriptStep,
      agentScriptStep.id
    );
    await adminStartPage.waitForDomContentLoaded(); 
    await macrosAdminPage.deleteAgentScriptByXRM(
      agentChat,
      EntityNames.AgentScript,
      agentScript.id
    );
    await adminStartPage.waitForDomContentLoaded();
    await agentChat.deleteRecordbyXRM(EntityNames.Macros, workflowID);
  });

  ///<summary>
  ///Test Case 2367023: [Macros] Verify cloning of input record by using 'Clone input record' action in the Productivity Automation.
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2367023
  ///</summary>
  it("Test Case 2367023: [Macros] Verify cloning of input record by using 'Clone input record' action in the Productivity Automation.", async () => {
    agentPage = await agentContext.newPage();
    rnd = agentScriptAdminPage.RandomNumber();
    //Login as admin and create cases
    await agentChat.navigateToOrgUrlAndSignIn(
      TestSettings.MacrosAgentEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);

    const account = await macrosAdminPage.createAccountAndGetId(
      Constants.AccountName2 + rnd
    );
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);

    await macrosAdminPage.CreateCloneCurrentMacro(
      Constants.CloneRecordMacroName,
      account
    );
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    const workflowID = await macrosAdminPage.getLatestMacro(
      agentChat,
      Constants.CloneRecordMacroName
    );
    await adminStartPage.waitForDomContentLoaded();
    const agentScript = await agentChat.createAgentScriptbyXRMAPI(
      Constants.CloneRecordAgentScriptName + rnd,
      Constants.UniqueName + rnd
    );
    await adminStartPage.waitForDomContentLoaded();
    const agentScriptStep = await agentChat.createAgentScriptStepbyXRMAPI(
      Constants.CloneRecordAgentScriptName + rnd,
      Constants.UniqueName + rnd + rnd,
      Constants.AgentscriptStepOrder,
      Constants.MacroAgentScriptStep,
      agentScript.id,
      Constants.CloneRecordMacroName,
      workflowID
    );
    await macrosAdminPage.OpenAgentScriptandSave(
      Constants.CloneRecordAgentScriptName + rnd
    );
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await macrosAdminPage.addAgentScripttoDefaultChatSessionWithParameter(
      Constants.CloneRecordAgentScriptName + rnd
    );
    //Run Macro
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    const caseTitle = await macrosAdminPage.createCaseWithAPI(
      Constants.CaseTitleName
    );
    await macrosAdminPage.InitiateSession(
      caseTitle,
      Constants.LinkStart + caseTitle + Constants.LinkEnd
    );
    const runValidateCloneRecordMacro =
      await macrosAdminPage.runMacroInSessionAndValidate(
        Constants.CloneRecordAgentScriptName + rnd,
        Constants.CloneRecordTitle
      );
    expect(runValidateCloneRecordMacro).toBeTruthy();
    await adminStartPage.waitForDomContentLoaded();
    await macrosAdminPage.deletAgentScriptStepByXRM(
      agentChat,
      EntityNames.AgentScriptStep,
      agentScriptStep.id
    );
    await adminStartPage.waitForDomContentLoaded();
    await macrosAdminPage.deleteAgentScriptByXRM(
      agentChat,
      EntityNames.AgentScript,
      agentScript.id
    );
  });

  ///<summary>
  ///Test Case 2313873: [Macros] Verify that tab is focused using 'Focus on the tab' action in the macros.
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2313873
  ///</summary>
  it("Test Case 2313873: [Macros] Verify that tab is focused using 'Focus on the tab' action in the macros.", async () => {
    agentPage = await agentContext.newPage();
    rnd = agentScriptAdminPage.RandomNumber();
    //Login as admin and create cases
    await agentChat.navigateToOrgUrlAndSignIn(
      TestSettings.MacrosAgentEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    const accountid = await macrosAdminPage.createAccountAndGetId(
      Constants.AccountName2 + rnd
    );
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await macrosAdminPage.createMacro(Constants.FocustabMacroName, accountid);
    await adminStartPage.waitForDomContentLoaded();
    const workflowID = await macrosAdminPage.getLatestMacro(
      agentChat,
      Constants.FocustabMacroName
    );
    await adminStartPage.waitForDomContentLoaded();
    const agentScript = await agentChat.createAgentScriptbyXRMAPI(
      Constants.FocustabAgentScriptName + rnd,
      Constants.UniqueName + rnd
    );
    await adminStartPage.waitForDomContentLoaded();
    const agentScriptStep = await agentChat.createAgentScriptStepbyXRMAPI(
      Constants.FocustabAgentScriptName + rnd,
      Constants.UniqueName + rnd + rnd,
      Constants.AgentscriptStepOrder,
      Constants.MacroAgentScriptStep,
      agentScript.id,
      Constants.FocustabMacroName,
      workflowID
    );
    await adminStartPage.waitForDomContentLoaded();
    await macrosAdminPage.OpenAgentScriptandSave(
      Constants.FocustabAgentScriptName + rnd
    );
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await macrosAdminPage.addAgentScripttoDefaultChatSessionWithParameter(
      Constants.FocustabAgentScriptName + rnd
    );
    await adminStartPage.waitForDomContentLoaded();
    //Run Macro
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    const caseTitle = await macrosAdminPage.createCaseWithAPI(
      Constants.CaseTitleName
    );
    await macrosAdminPage.InitiateSession(
      caseTitle,
      Constants.LinkStart + caseTitle + Constants.LinkEnd
    );
    const runValidateFocustabMacro =
      await macrosAdminPage.runMacroInSessionAndValidate(
        Constants.FocustabAgentScriptName + rnd,
        Constants.FocustabTitle
      );
    expect(runValidateFocustabMacro).toBeTruthy();
    await adminStartPage.waitForDomContentLoaded();
    await macrosAdminPage.deletAgentScriptStepByXRM(
      agentChat,
      EntityNames.AgentScriptStep,
      agentScriptStep.id
    );
    await adminStartPage.waitForDomContentLoaded();
    await macrosAdminPage.deleteAgentScriptByXRM(
      agentChat,
      EntityNames.AgentScript,
      agentScript.id
    );
  });

  /// <summary>
  /// Test Case 2367026: [Macros] Verify record is saved by using 'Save the record' action in the Productivity Automation.
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2367026
  /// </summary>
  it("Test Case 2367026: [Macros] Verify record is saved by using 'Save the record' action in the Productivity Automation.", async () => {
    agentPage = await agentContext.newPage();
    rnd = agentScriptAdminPage.RandomNumber();
    //Login as admin and create cases
    await agentChat.navigateToOrgUrlAndSignIn(
      TestSettings.MacrosAgentEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);

    await macrosAdminPage.createMacro(Constants.SaveRecordMacroName);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    const workflowID = await macrosAdminPage.getLatestMacro(
      agentChat,
      Constants.SaveRecordMacroName
    );

    const agentScript = await agentChat.createAgentScriptbyXRMAPI(
      Constants.SaveRecordAgentScriptName + rnd,
      Constants.UniqueName + rnd
    );
    const agentScriptStep = await agentChat.createAgentScriptStepbyXRMAPI(
      Constants.SaveRecordAgentScriptName + rnd,
      Constants.UniqueName + rnd + rnd,
      Constants.AgentscriptStepOrder,
      Constants.MacroAgentScriptStep,
      agentScript.id,
      Constants.SaveRecordMacroName,
      workflowID
    );
    await macrosAdminPage.OpenAgentScriptandSave(
      Constants.SaveRecordAgentScriptName + rnd
    );
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await macrosAdminPage.addAgentScripttoDefaultChatSessionWithParameter(
      Constants.SaveRecordAgentScriptName + rnd
    );
    //Run Macro
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    const caseTitle = await macrosAdminPage.createCaseWithAPI(
      Constants.CaseTitleName
    );
    await macrosAdminPage.InitiateSession(
      caseTitle,
      Constants.LinkStart + caseTitle + Constants.LinkEnd
    );
    const runValidateSaveRecordMacro =
      await macrosAdminPage.runMacroInSessionAndValidate(
        Constants.SaveRecordAgentScriptName + rnd,
        ConstantsMacros.SaveRecordTitle
      );
    expect(runValidateSaveRecordMacro).toBeTruthy();
    await adminStartPage.waitForDomContentLoaded();
    await macrosAdminPage.deletAgentScriptStepByXRM(
      agentChat,
      EntityNames.AgentScriptStep,
      agentScriptStep.id
    );
    await adminStartPage.waitForDomContentLoaded();
    await macrosAdminPage.deleteAgentScriptByXRM(
      agentChat,
      EntityNames.AgentScript,
      agentScript.id
    );
    await adminStartPage.waitForDomContentLoaded();
    await agentChat.deleteRecordbyXRM(EntityNames.Macros, workflowID);
  });

  ///<summary>
  ///Test Case 2253513: [Macros] Verify dashboard application template is opened in new tab using 'Open application tab' action in macros
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_testPlans/execute?planId=2532163&opId=3593&suiteId=2532167
  ///</summary>
  it("Test Case 2253513: [Macros] Verify dashboard application template is opened in new tab using 'Open application tab' action in macros", async () => {
    agentPage = await agentContext.newPage();
    const rnd = agentScriptAdminPage.RandomNumber();
    liveChatPage = new LiveChatPage(await liveChatContext.newPage());
    //Login as 'Admin automated' and redirected to OrgUrl
    await adminStartPage.navigateToOrgUrlAndSignIn(
      TestSettings.MacrosAgentEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    const urlId = await macrosFunction.createApplicationTabAndGetId(
      Constants.DashboardName,
      Constants.DashboardUniqueName + rnd,
      Constants.DashboardOptionValue
    );
    await macrosAdminPage.createMacro(Constants.DashboardMacroName, urlId);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    const workflowID = await macrosAdminPage.getLatestMacro(
      agentChat,
      Constants.DashboardMacroName
    );
    const agentScript = await agentChat.createAgentScriptbyXRMAPI(
      Constants.DascboardAgentScriptName + rnd,
      Constants.UniqueName + rnd
    );
    const agentScriptStep = await agentChat.createAgentScriptStepbyXRMAPI(
      Constants.DascboardAgentScriptName + rnd,
      Constants.UniqueName + rnd + rnd,
      Constants.AgentscriptStepOrder,
      Constants.MacroAgentScriptStep,
      agentScript.id,
      Constants.DashboardMacroName,
      workflowID
    );
    await macrosAdminPage.OpenAgentScriptandSave(
      Constants.DascboardAgentScriptName + rnd
    );
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await macrosAdminPage.addAgentScripttoDefaultChatSessionWithParameter(
      Constants.DascboardAgentScriptName + rnd
    );
    //Run Macro
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    const caseTitle = await macrosAdminPage.createCaseWithAPI(
      Constants.CaseTitleName
    );
    await macrosAdminPage.InitiateSession(
      caseTitle,
      Constants.LinkStart + caseTitle + Constants.LinkEnd
    );
    const openEntityRecordTabUsingMacro =
      await macrosAdminPage.runMacroInSessionAndValidate(
        Constants.DascboardAgentScriptName + rnd,
        ConstantsMacros.DashboardTitle
      );
    expect(openEntityRecordTabUsingMacro).toBeTruthy();
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitForDomContentLoaded();
    await agentChat.deleteRecordbyXRM(
      EntityNames.AgentScriptStep,
      agentScriptStep.id
    );
    await adminStartPage.waitForDomContentLoaded();
    await agentChat.deleteRecordbyXRM(EntityNames.AgentScript, agentScript.id);
    await adminStartPage.waitForDomContentLoaded();
    await agentChat.deleteRecordbyXRM(EntityNames.Macros, workflowID);
  });

  ///<summary>
  ///Test Case 1593439: [Runtime]: Verify agent script control: Step type specific functionality
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1593439
  ///</summary>
  it("Test Case 1593439: [Runtime]: Verify agent script control: Step type specific functionality", async () => {
    agentPage = await agentContext.newPage();
    rnd = agentScriptAdminPage.RandomNumber();
    //Login as admin and create macro
    await adminStartPage.navigateToOrgUrlAndSignIn(
      TestSettings.MacroAccountEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    await macrosAdminPage.CreateCloneCurrentMacro(
      Constants.CloneRecordMacroName,
      Constants.RecordName
    );
    await macrosAdminPage.waitForTimeout();
    const workflowID = await macrosAdminPage.getLatestMacro(
      agentChat,
      Constants.CloneRecordMacroName
    );
    const agentScript = await agentChat.createAgentScriptbyXRMAPI(
      Constants.CloneRecordAgentScriptName,
      Constants.TitleUniqueName + rnd
    );
    const agentScriptStep1 = await agentChat.createAgentScriptStepbyXRMAPI(
      Constants.CloneRecordAgentScriptName,
      Constants.TitleUniqueName + rnd + rnd,
      Constants.AgentscriptStepOrderforMacro,
      Constants.MacroAgentScriptStep,
      agentScript.id,
      Constants.CloneRecordMacroName,
      workflowID
    );
    const agentScriptStep2 = await agentChat.createAgentScriptStepbyXRMAPI(
      Constants.CloneRecordAgentScriptName,
      Constants.TitleUniqueName + rnd + rnd + rnd,
      Constants.AgentscriptStepOrderforText,
      Constants.TextAgentScriptStep,
      agentScript.id,
      Constants.CloneRecordMacroName,
      workflowID
    );
    const agentScriptStep3 = await agentChat.createAgentScriptStepbyXRMAPI(
      Constants.CloneRecordAgentScriptName,
      Constants.TitleUniqueName + rnd + rnd + rnd + rnd,
      Constants.AgentscriptStepOrderforScript,
      Constants.ScriptAgentScript,
      agentScript.id,
      Constants.CloneRecordAgentScriptName,
      workflowID
    );
    await macrosAdminPage.OpenAgentScriptandSave(
      Constants.CloneRecordAgentScriptName
    );
    await macrosAdminPage.addAgentScripttoDefaultChatSessionWithParameter(
      Constants.CloneRecordAgentScriptName
    );
    //Run Macro
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    const caseTitle = await macrosAdminPage.createCaseWithAPI(
      Constants.CaseTitleName
    );
    await macrosAdminPage.InitiateSession(
      caseTitle,
      Constants.LinkStart + caseTitle + Constants.LinkEnd
    );
    await macrosAdminPage.validateMacroInSession(
      Constants.CloneRecordAgentScriptName
    );
    await macrosAdminPage.deletAgentScriptStepByXRM(
      agentChat,
      EntityNames.AgentScriptStep,
      agentScriptStep1.id
    );
    await macrosAdminPage.deletAgentScriptStepByXRM(
      agentChat,
      EntityNames.AgentScriptStep,
      agentScriptStep2.id
    );
    await macrosAdminPage.deletAgentScriptStepByXRM(
      agentChat,
      EntityNames.AgentScriptStep,
      agentScriptStep3.id
    );
    await macrosAdminPage.deleteAgentScriptByXRM(
      agentChat,
      EntityNames.AgentScript,
      agentScript.id
    );
    await agentChat.deleteRecordbyXRM(EntityNames.Macros, workflowID);
  });

});
