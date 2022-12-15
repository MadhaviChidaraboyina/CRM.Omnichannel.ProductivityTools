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

  beforeAll(async () => {
    await AppProfileHelper.getInstance().CreateAppProfile();
  })

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
      TestSettings.MacroAccountEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    await adminStartPage.waitForDomContentLoaded();
    await macrosAdminPage.createMacro(Constants.AutoFillMacroName);
    await agentChat.waitforTimeout();
    const workflowID = await macrosAdminPage.getLatestMacro(
      agentChat,
      Constants.AutoFillMacroName
    );
    const agentScript = await agentChat.createAgentScriptbyXRMAPI(
      Constants.AutoFillAgentScriptName,
      Constants.TitleUniqueName + rnd
    );
    const agentScriptStep = await agentChat.createAgentScriptStepbyXRMAPI(
      Constants.AutoFillAgentScriptName,
      Constants.TitleUniqueName + rnd,
      Constants.AgentscriptStepOrder,
      Constants.MacroAgentScriptStep,
      agentScript.id,
      Constants.AutoFillMacroName,
      workflowID
    );
    await macrosAdminPage.OpenAgentScriptandSave(
      Constants.AutoFillAgentScriptName
    );
    await macrosAdminPage.addAgentScripttoDefaultChatSessionWithParameter(
      Constants.AutoFillAgentScriptName
    );
    //Run Macro
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    var CaseUserName = Constants.XRMCaseName + rnd;
    caseNameList = [CaseUserName];
    await macrosAdminPage.createIncidents(agentChat, caseNameList);
    await macrosAdminPage.InitiateSession(
      CaseUserName,
      stringFormat(Constants.XRMSpecificCaseLink1, rnd)
    );
    const runValidateAutoFillMacro =
      await macrosAdminPage.runMacroInSessionAndValidate(
        Constants.AutoFillAgentScriptName,
        Constants.AutoFillTitle
      );
    expect(runValidateAutoFillMacro).toBeTruthy();
    await macrosAdminPage.deletAgentScriptStepByXRM(
      agentChat,
      EntityNames.AgentScriptStep,
      agentScriptStep.id
    );
    await macrosAdminPage.deleteAgentScriptByXRM(
      agentChat,
      EntityNames.AgentScript,
      agentScript.id
    );
    await agentChat.deleteRecordbyXRM(EntityNames.Macros, workflowID);
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
      TestSettings.MacroAccountEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    const applicationTabId = await macrosAdminPage.createApplicationTabAndGetId(
      Constants.ControlApplicationTab,
      Constants.ControlApplicationTabUniqueName,
      Constants.ControlOptionValue
    );
    await macrosAdminPage.createMacro(
      Constants.ControlMacroName,
      applicationTabId
    );
    await macrosAdminPage.waitForTimeout();
    const workflowID = await macrosAdminPage.getLatestMacro(
      agentChat,
      Constants.ControlMacroName
    );
    const agentScript = await agentChat.createAgentScriptbyXRMAPI(
      Constants.ControlAgentScriptName,
      Constants.TitleUniqueName + rnd
    );

    const agentScriptStep = await agentChat.createAgentScriptStepbyXRMAPI(
      Constants.ControlAgentScriptName,
      Constants.TitleUniqueName + rnd + rnd,
      Constants.AgentscriptStepOrder,
      Constants.MacroAgentScriptStep,
      agentScript.id,
      Constants.ControlMacroName,
      workflowID
    );

    await macrosAdminPage.OpenAgentScriptandSave(
      Constants.ControlAgentScriptName
    );
    await macrosAdminPage.addAgentScripttoDefaultChatSessionWithParameter(
      Constants.ControlAgentScriptName
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
    const openEntityRecordTabUsingMacro =
      await macrosAdminPage.runMacroInSessionAndValidate(
        Constants.ControlAgentScriptName,
        Constants.ControlTitle
      );
    expect(openEntityRecordTabUsingMacro).toBeTruthy();
    await agentChat.deleteRecordbyXRM(
      EntityNames.AgentScriptStep,
      agentScriptStep.id
    );
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
      TestSettings.MacroAccountEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    const applicationTabId = await macrosAdminPage.createApplicationTabAndGetId(
      Constants.ThirdPartyWebsiteApplicationTab,
      Constants.ThirdPartyWebsiteApplicationTabUniqueName,
      Constants.ThirdPartyWebsiteOptionValue
    );
    await macrosAdminPage.createMacroFromOmnichannelAdminCenterApp(
      Constants.ThirdPartyWebsiteMacroName,
      applicationTabId
    );
    await macrosAdminPage.waitForTimeout();
    const workflowID = await macrosAdminPage.getLatestMacro(
      agentChat,
      Constants.ThirdPartyWebsiteMacroName
    );
    const agentScript = await agentChat.createAgentScriptbyXRMAPI(
      Constants.ThirdPartyWebsiteAgentScriptName,
      Constants.TitleUniqueName + rnd
    );

    const agentScriptStep = await agentChat.createAgentScriptStepbyXRMAPI(
      Constants.ThirdPartyWebsiteAgentScriptName,
      Constants.TitleUniqueName + rnd + rnd,
      Constants.AgentscriptStepOrder,
      Constants.MacroAgentScriptStep,
      agentScript.id,
      Constants.ThirdPartyWebsiteMacroName,
      workflowID
    );

    await macrosAdminPage.OpenAgentScriptandSave(
      Constants.ThirdPartyWebsiteAgentScriptName
    );
    await macrosAdminPage.addAgentScripttoDefaultChatSessionWithParameter(
      Constants.ThirdPartyWebsiteAgentScriptName
    );
    //Run Macro
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await macrosAdminPage.waitForDomContentLoaded();
    await macrosAdminPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await agentChat.waitForAgentStatusIcon();
    await macrosAdminPage.CreateCaseInCSW(Constants.CaseTitleName);
    await macrosAdminPage.InitiateSession(
      Constants.CaseTitleName,
      Constants.CaseLink1
    );
    const openEntityRecordTabUsingMacro =
      await macrosAdminPage.runMacroInSessionAndValidate(
        Constants.ThirdPartyWebsiteAgentScriptName,
        Constants.ThirdPartyWebsiteTitle
      );
    expect(openEntityRecordTabUsingMacro).toBeTruthy();
    await agentChat.deleteRecordbyXRM(
      EntityNames.AgentScriptStep,
      agentScriptStep.id
    );
    await agentChat.deleteRecordbyXRM(EntityNames.AgentScript, agentScript.id);
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
      TestSettings.MacroAccountEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    await macrosAdminPage.createMacro(Constants.OpenNewFormMacroName);
    await macrosAdminPage.waitForTimeout();
    const workflowID = await macrosAdminPage.getLatestMacro(
      agentChat,
      Constants.OpenNewFormMacroName
    );
    const agentScript = await agentChat.createAgentScriptbyXRMAPI(
      Constants.OpenNewFormAgentScriptName,
      Constants.TitleUniqueName + rnd
    );
    const agentScriptStep = await agentChat.createAgentScriptStepbyXRMAPI(
      Constants.OpenNewFormAgentScriptName,
      Constants.TitleUniqueName + rnd + rnd,
      Constants.AgentscriptStepOrder,
      Constants.MacroAgentScriptStep,
      agentScript.id,
      Constants.OpenNewFormMacroName,
      workflowID
    );
    await macrosAdminPage.OpenAgentScriptandSave(
      Constants.OpenNewFormAgentScriptName
    );
    await macrosAdminPage.addAgentScripttoDefaultChatSessionWithParameter(
      Constants.OpenNewFormAgentScriptName
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
    const openEntityRecordTabUsingMacro =
      await macrosAdminPage.runMacroInSessionAndValidate(
        Constants.OpenNewFormAgentScriptName,
        Constants.OpenNewFormTitle
      );
    expect(openEntityRecordTabUsingMacro).toBeTruthy();
    await macrosAdminPage.deletAgentScriptStepByXRM(
      agentChat,
      EntityNames.AgentScriptStep,
      agentScriptStep.id
    );
    await macrosAdminPage.deleteAgentScriptByXRM(
      agentChat,
      EntityNames.AgentScript,
      agentScript.id
    );
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
      TestSettings.MacroAccountEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    await macrosAdminPage.createMacro(Constants.OpenKBSearchMacroName);
    await macrosAdminPage.waitForTimeout();
    const workflowID = await macrosAdminPage.getLatestMacro(
      agentChat,
      Constants.OpenKBSearchMacroName
    );
    const agentScript = await agentChat.createAgentScriptbyXRMAPI(
      Constants.OpenKBSearchAgentScriptName,
      Constants.TitleUniqueName + rnd
    );
    const agentScriptStep = await agentChat.createAgentScriptStepbyXRMAPI(
      Constants.OpenKBSearchAgentScriptName,
      Constants.TitleUniqueName + rnd + rnd,
      Constants.AgentscriptStepOrder,
      Constants.MacroAgentScriptStep,
      agentScript.id,
      Constants.OpenKBSearchMacroName,
      workflowID
    );
    await macrosAdminPage.OpenAgentScriptandSave(
      Constants.OpenKBSearchAgentScriptName
    );
    await macrosAdminPage.addAgentScripttoDefaultChatSessionWithParameter(
      Constants.OpenKBSearchAgentScriptName
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
    const openEntityRecordTabUsingMacro =
      await macrosAdminPage.runMacroInSessionAndValidate(
        Constants.OpenKBSearchAgentScriptName,
        Constants.OpenKBSearchTitle
      );
    expect(openEntityRecordTabUsingMacro).toBeTruthy();
    await macrosAdminPage.deletAgentScriptStepByXRM(
      agentChat,
      EntityNames.AgentScriptStep,
      agentScriptStep.id
    );
    await macrosAdminPage.deleteAgentScriptByXRM(
      agentChat,
      EntityNames.AgentScript,
      agentScript.id
    );
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
      TestSettings.MacroAccountEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
    const incidentId = await macrosAdminPage.createCaseAndGetIncidentId();
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    await macrosAdminPage.createMacro(Constants.OpenExistingFormMacroName,incidentId);
    await macrosAdminPage.waitForTimeout();
    const workflowID = await macrosAdminPage.getLatestMacro(
      agentChat,
      Constants.OpenExistingFormMacroName
    );
    const agentScript = await agentChat.createAgentScriptbyXRMAPI(
      Constants.OpenExistingFormAgentScriptName,
      Constants.TitleUniqueName + rnd
    );
    const agentScriptStep = await agentChat.createAgentScriptStepbyXRMAPI(
      Constants.OpenExistingFormAgentScriptName,
      Constants.TitleUniqueName + rnd + rnd,
      Constants.AgentscriptStepOrder,
      Constants.MacroAgentScriptStep,
      agentScript.id,
      Constants.OpenExistingFormMacroName,
      workflowID
    );
    await macrosAdminPage.OpenAgentScriptandSave(
      Constants.OpenExistingFormAgentScriptName
    );
    await macrosAdminPage.addAgentScripttoDefaultChatSessionWithParameter(
      Constants.OpenExistingFormAgentScriptName
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
    const openEntityRecordTabUsingMacro =
      await macrosAdminPage.runMacroInSessionAndValidate(
        Constants.OpenExistingFormAgentScriptName,
        Constants.OpenExistingFormTitle
      );
    expect(openEntityRecordTabUsingMacro).toBeTruthy();
    await macrosAdminPage.deletAgentScriptStepByXRM(
      agentChat,
      EntityNames.AgentScriptStep,
      agentScriptStep.id
    );
    await macrosAdminPage.deleteAgentScriptByXRM(
      agentChat,
      EntityNames.AgentScript,
      agentScript.id
    );
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
      TestSettings.MacroAccountEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await macrosAdminPage.createMacro(Constants.OpenGridMacroName);
    //Creation of agentScripts Using XRM API's
    await macrosAdminPage.waitForTimeout();// to load the page we need to timeout
    const workflowID = await macrosAdminPage.getLatestMacro(agentChat, Constants.OpenGridMacroName);
    const agentScript = await agentChat.createAgentScriptbyXRMAPI(
      Constants.OpenGridAgentScriptName,
      Constants.TitleUniqueName + rnd);
    const agentScriptStep = await agentChat.createAgentScriptStepbyXRMAPI(
      Constants.OpenGridAgentScriptName,
      Constants.TitleUniqueName + rnd + rnd,
      Constants.AgentscriptStepOrder,
      Constants.MacroAgentScriptStep,
      agentScript.id,
      Constants.OpenGridMacroName,
      workflowID);
    await macrosAdminPage.OpenAgentScriptandSave(Constants.OpenGridAgentScriptName);
    await macrosAdminPage.addAgentScripttoDefaultChatSessionWithParameter(
      Constants.OpenGridAgentScriptName
    );
    //Run Macro
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await adminStartPage.waitForDomContentLoaded();
    await agentChat.waitforTimeout();// Default timeout is required to load the page 
    await agentChat.waitForAgentStatusIcon();
    var CaseUserName = Constants.CaseTitleName;
    caseNameList = [CaseUserName];
    await macrosAdminPage.createIncidents(agentChat, caseNameList);
    await macrosAdminPage.InitiateSession(
      Constants.CaseTitleName,
      Constants.CaseLink1
    );
    const openEntityRecordTabUsingMacro =
      await macrosAdminPage.runMacroInSessionAndValidate(
        Constants.OpenGridAgentScriptName,
        Constants.OpenGridTitle
      );
    expect(openEntityRecordTabUsingMacro).toBeTruthy();
    await agentChat.deleteRecordbyXRM(EntityNames.AgentScriptStep, agentScriptStep.id);
    await agentChat.deleteRecordbyXRM(EntityNames.AgentScript, agentScript.id);
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
      TestSettings.MacroAccountEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await macrosAdminPage.createMacro(Constants.DoRelevanceSearchMacroName);

    await agentChat.waitforTimeout();
    const workflowID = await macrosAdminPage.getLatestMacro(agentChat, Constants.DoRelevanceSearchMacroName);
    const agentScript = await agentChat.createAgentScriptbyXRMAPI(
      Constants.DoRelevanceSearchAgentScriptName,
      Constants.TitleUniqueName + rnd);
    const agentScriptStep = await agentChat.createAgentScriptStepbyXRMAPI(
      Constants.DoRelevanceSearchAgentScriptName,
      Constants.TitleUniqueName + rnd,
      Constants.AgentscriptStepOrder,
      Constants.MacroAgentScriptStep,
      agentScript.id,
      Constants.DoRelevanceSearchMacroName,
      workflowID);
    await macrosAdminPage.OpenAgentScriptandSave(Constants.DoRelevanceSearchAgentScriptName);

    await macrosAdminPage.addAgentScripttoDefaultChatSessionWithParameter(
      Constants.DoRelevanceSearchAgentScriptName
    );
    //Run Macro
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);

    await agentChat.waitforTimeout();
    await agentChat.waitForAgentStatusIcon();
    var CaseUserName = Constants.CaseTitleName;
    caseNameList = [CaseUserName];
    await macrosAdminPage.createIncidents(agentChat, caseNameList);
    await macrosAdminPage.InitiateSession(
      Constants.CaseTitleName,
      Constants.CaseLink1
    );
    const openEntityRecordTabUsingMacro =
      await macrosAdminPage.runMacroInSessionAndValidate(
        Constants.DoRelevanceSearchAgentScriptName,
        Constants.DoRelevanceSearchTitle
      );
    expect(openEntityRecordTabUsingMacro).toBeTruthy();
    await agentChat.deleteRecordbyXRM(EntityNames.AgentScriptStep, agentScriptStep.id);
    await agentChat.deleteRecordbyXRM(EntityNames.AgentScript, agentScript.id);
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
      TestSettings.MacroAccountEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await macrosAdminPage.createResolveSessionMacro(
      Constants.ResolveCaseMacroName,
      Constants.IncidentID
    );
    await agentChat.waitforTimeout();
    const workflowID = await macrosAdminPage.getLatestMacro(
      agentChat,
      Constants.ResolveCaseMacroName
    );
    const agentScript = await macrosAdminPage.createAgentScriptByXRMAPI(
      agentChat,
      Constants.ResolveCaseAgentScriptName,
      Constants.UniqueName + rnd
    );
    const agentScriptStep = await macrosAdminPage.createAgentScriptStepbyXRMAPI(
      agentChat,
      Constants.ResolveCaseAgentScriptName,
      Constants.UniqueName + rnd + rnd,
      Constants.AgentscriptStepOrder,
      Constants.MacroAgentScriptStep,
      agentScript.id,
      Constants.ResolveCaseMacroName,
      workflowID
    );
    await macrosAdminPage.OpenAgentScriptandSave(
      Constants.ResolveCaseAgentScriptName
    );
    await macrosAdminPage.addAgentScripttoDefaultChatSessionWithParameter(
      Constants.ResolveCaseAgentScriptName
    );
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await adminStartPage.waitForDomContentLoaded();
    await agentChat.waitforTimeout();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    var CaseUserName = Constants.XRMCaseName + rnd;
    caseNameList = [CaseUserName];
    await macrosAdminPage.createIncidents(agentChat, caseNameList);
    await macrosAdminPage.InitiateSession(
      CaseUserName,
      stringFormat(Constants.XRMSpecificCaseLink1, rnd)
    );
    //Run Macro and Validate
    const runAndValidateMacro =
      await macrosAdminPage.runMacroInSessionAndValidate(
        Constants.ResolveCaseAgentScriptName,
        Constants.ResolveStatemant
      );
    expect(runAndValidateMacro).toBeTruthy();
    await macrosAdminPage.deletAgentscriptStepbyXRM(
      agentChat,
      EntityNames.AgentScriptStep,
      agentScriptStep.id
    );
    await macrosAdminPage.deleteAgentScriptbyXRM(
      agentChat,
      EntityNames.AgentScript,
      agentScript.id
    );
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
      TestSettings.MacroAccountEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    const incidentId = await macrosAdminPage.createCaseAndGetIncidentId();
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    await macrosAdminPage.createMacro(
      Constants.UpdateRecordMacroName,
      incidentId
    );
    await agentChat.waitforTimeout();
    const workflowID = await macrosAdminPage.getLatestMacro(
      agentChat,
      Constants.UpdateRecordMacroName
    );
    const agentScript = await macrosAdminPage.createAgentScriptByXRMAPI(
      agentChat,
      Constants.UpdateRecordAgentScriptName,
      Constants.UniqueName + rnd
    );
    const agentScriptStep = await macrosAdminPage.createAgentScriptStepbyXRMAPI(
      agentChat,
      Constants.UpdateRecordAgentScriptName,
      Constants.UniqueName + rnd + rnd,
      Constants.AgentscriptStepOrder,
      Constants.MacroAgentScriptStep,
      agentScript.id,
      Constants.UpdateRecordMacroName,
      workflowID
    );
    await macrosAdminPage.OpenAgentScriptandSave(
      Constants.UpdateRecordAgentScriptName
    );
    await macrosAdminPage.addAgentScripttoDefaultChatSessionWithParameter(
      Constants.UpdateRecordAgentScriptName
    );
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await adminStartPage.waitForDomContentLoaded();
    await agentChat.waitforTimeout();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    var CaseUserName = Constants.XRMCaseName + rnd;
    caseNameList = [CaseUserName];
    await macrosAdminPage.createIncidents(agentChat, caseNameList);
    await macrosAdminPage.InitiateSession(
      CaseUserName,
      stringFormat(Constants.XRMSpecificCaseLink1, rnd)
    );
    //Run Macro and Validate
    const runAndValidateMacro =
      await macrosAdminPage.runMacroInSessionAndValidate(
        Constants.UpdateRecordAgentScriptName,
        Constants.UpdateRecordTitle
      );
    expect(runAndValidateMacro).toBeTruthy();
    await macrosAdminPage.deletAgentscriptStepbyXRM(
      agentChat,
      EntityNames.AgentScriptStep,
      agentScriptStep.id
    );
    await macrosAdminPage.deleteAgentScriptbyXRM(
      agentChat,
      EntityNames.AgentScript,
      agentScript.id
    );
    await agentChat.deleteRecordbyXRM(EntityNames.Macros, workflowID);
  });

  ///<summary>
  ///Test Case 1717129: Verify Admin can disable/deactivate an existing macros
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_testPlans/execute?planId=2532163&opId=3593&suiteId=2532167
  ///</summary>
  it("Test Case 1717129: Verify Admin can disable/deactivate an existing macros", async () => {
    //Login as admin and create & deactivate macro
    await adminStartPage.navigateToOrgUrlAndSignIn(
      TestSettings.AdminAccountEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    await macrosAdminPage.createMacro(Constants.TestMacro);
    await macrosAdminPage.deactivateMacro(Constants.TestMacro);
    //Check if macro deactivated
    const deactivateMacroResult =
      await macrosAdminPage.verifyMacroDeactivated(
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
      TestSettings.MacroAccountEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await macrosAdminPage.createResolveSessionMacro(
      Constants.RefreshSessionMacroName,
      Constants.IncidentID
    );
    await agentChat.waitforTimeout();
    const workflowID = await macrosAdminPage.getLatestMacro(
      agentChat,
      Constants.RefreshSessionMacroName
    );
    const agentScript = await macrosAdminPage.createAgentScriptByXRMAPI(
      agentChat,
      Constants.RefreshSessionAgentScriptName,
      Constants.UniqueName + rnd
    );
    const agentScriptStep = await macrosAdminPage.createAgentScriptStepbyXRMAPI(
      agentChat,
      Constants.RefreshSessionAgentScriptName,
      Constants.UniqueName + rnd,
      Constants.AgentscriptStepOrder,
      Constants.MacroAgentScriptStep,
      agentScript.id,
      Constants.OpenKbArticle,
      workflowID
    );
    await macrosAdminPage.OpenAgentScriptandSave(
      Constants.RefreshSessionAgentScriptName
    );
    await macrosAdminPage.addAgentScripttoDefaultChatSessionWithParameter(
      Constants.RefreshSessionAgentScriptName
    );
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await adminStartPage.waitForDomContentLoaded();
    await agentChat.waitforTimeout();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await agentChat.waitForAgentStatusIcon();
    var CaseUserName = Constants.XRMCaseName + rnd;
    caseNameList = [CaseUserName];
    await macrosAdminPage.createIncidents(agentChat, caseNameList);
    await macrosAdminPage.InitiateSession(
      CaseUserName,
      stringFormat(Constants.XRMSpecificCaseLink1, rnd)
    );
    //Run Macro and Validate
    const runAndValidateMacro =
      await macrosAdminPage.runMacroInSessionAndValidate(
        Constants.RefreshSessionAgentScriptName,
        Constants.ResolveStatemant
      );
    expect(runAndValidateMacro).toBeTruthy();
    await macrosAdminPage.deletAgentscriptStepbyXRM(
      agentChat,
      EntityNames.AgentScriptStep,
      agentScriptStep.id
    );
    await macrosAdminPage.deleteAgentScriptbyXRM(
      agentChat,
      EntityNames.AgentScript,
      agentScript.id
    );
    await macrosAdminPage.deleteAgentScriptbyXRM(agentChat, EntityNames.Macros, workflowID);
  });

  ///<summary>
  ///Test Case 2464821: Open Dashboard Application tab using Macro.
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2464821
  ///</summary>
  it("Test Case 2464821: Open Dashboard Application tab using Macros.", async () => {
    agentPage = await agentContext.newPage();
    //Login as admin and create macro
    await adminStartPage.navigateToOrgUrlAndSignIn(
      TestSettings.MacroAccountEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    const applicationTabId =
      await macrosAdminPage.createApplicationTabAndGetId(
        Constants.DashboardApplicationTab,
        Constants.DashboardApplicationTabUniqueName,
        Constants.DashboardOptionValue
      );
    await macrosAdminPage.createMacroFromOmnichannelAdminCenterApp(
      Constants.DashboardMacroName,
      applicationTabId
    );
    const workflowID = await macrosAdminPage.getLatestMacro(agentChat, Constants.DashboardMacro);
    const agentScript = await agentChat.createAgentScriptbyXRMAPI(
      Constants.DashboardAgentScriptName,
      Constants.TitleUniqueName + rnd);

    const agentScriptStep = await agentChat.createAgentScriptStepbyXRMAPI(
      Constants.DashboardAgentScriptName,
      Constants.TitleUniqueName + rnd + rnd,
      Constants.AgentscriptStepOrder,
      Constants.MacroAgentScriptStep,
      agentScript.id,
      Constants.DashboardMacroName,
      workflowID);

    await macrosAdminPage.OpenAgentScriptandSave(Constants.DashboardAgentScriptName);

    await macrosAdminPage.addAgentScripttoDefaultChatSessionWithParameter(
      Constants.DashboardAgentScriptName
    );
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);

    var CaseUserName = Constants.XRMCaseName;
    caseNameList = [CaseUserName];

    //Create case & initiate session
    await macrosAdminPage.createIncidents(agentChat, caseNameList);
    await macrosAdminPage.InitiateSession(
      Constants.CaseTitleName,
      Constants.CaseLink1
    );

    //Run macro
    const runValidateDashboardMacro =
      await macrosAdminPage.runMacroInSessionAndValidate(
        Constants.DashboardAgentScriptName,
        Constants.DashboardTitle
      );
    expect(runValidateDashboardMacro).toBeTruthy();

    await macrosAdminPage.deletAgentScriptStepByXRM(agentChat, EntityNames.AgentScriptStep, agentScriptStep.id);
    await macrosAdminPage.deleteAgentScriptByXRM(agentChat, EntityNames.AgentScript, agentScript.id);
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
      TestSettings.MacroAccountEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    const applicationTabId = await macrosAdminPage.createApplicationTabAndGetId(
      Constants.ControlApplicationTab,
      Constants.ControlApplicationTabUniqueName,
      Constants.ControlOptionValue
    );
    await macrosAdminPage.createMacro(
      Constants.ControlMacroName,
      applicationTabId
    );
    const workflowID = await macrosAdminPage.getLatestMacro(
      agentChat,
      Constants.ControlMacroName
    );
    const agentScript = await agentChat.createAgentScriptbyXRMAPI(
      Constants.ControlAgentScriptName,
      Constants.UniqueName + rnd
    );
    const agentScriptStep = await agentChat.createAgentScriptStepbyXRMAPI(
      Constants.ControlAgentScriptName,
      Constants.UniqueName + rnd,
      Constants.AgentscriptStepOrder,
      Constants.MacroAgentScriptStep,
      agentScript.id,
      Constants.ControlMacroName,
      workflowID
    );
    await macrosAdminPage.OpenAgentScriptandSave(
      Constants.ControlAgentScriptName
    );
    await macrosAdminPage.addAgentScripttoDefaultChatSessionWithParameter(
      Constants.ControlAgentScriptName
    );
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    var CaseUserName = Constants.XRMCaseName + rnd;
    caseNameList = [CaseUserName];
    await macrosAdminPage.createIncidents(agentChat, caseNameList);
    await macrosAdminPage.InitiateSession(
      CaseUserName,
      stringFormat(Constants.XRMSpecificCaseLink1, rnd)
    );
    //Run Macro and Validate
    const runAndValidateMacro =
      await macrosAdminPage.runMacroInSessionAndValidate(
        Constants.ControlAgentScriptName,
        Constants.ControlTitle
      );
    expect(runAndValidateMacro).toBeTruthy();
    await macrosAdminPage.deletAgentScriptStepByXRM(
      agentChat,
      EntityNames.AgentScriptStep,
      agentScriptStep.id
    );
    await macrosAdminPage.deleteAgentScriptByXRM(
      agentChat,
      EntityNames.AgentScript,
      agentScript.id
    );
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
      TestSettings.MacroAccountEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdmincenter);
    const urlId = await macrosAdminPage.createApplicationTabAndGetId(
      Constants.EntityListApplicationTab,
      Constants.EntityListApplicationTabUniqueName,
      Constants.EntityListOptionValue
    );
    await macrosAdminPage.createMacro(Constants.EntityListMacroName, urlId);
    await agentChat.waitforTimeout();
    const workflowID = await macrosAdminPage.getLatestMacro(
      agentChat,
      Constants.EntityListMacroName
    );
    const agentScript = await agentChat.createAgentScriptbyXRMAPI(
      Constants.EntityListAgentScriptName,
      Constants.TitleUniqueName + rnd
    );
    const agentScriptStep = await agentChat.createAgentScriptStepbyXRMAPI(
      Constants.EntityListAgentScriptName,
      Constants.TitleUniqueName + rnd,
      Constants.AgentscriptStepOrder,
      Constants.MacroAgentScriptStep,
      agentScript.id,
      Constants.EntityListMacroName,
      workflowID
    );
    await macrosAdminPage.OpenAgentScriptandSave(
      Constants.EntityListAgentScriptName
    );
    await macrosAdminPage.addAgentScripttoDefaultChatSessionWithParameter(
      Constants.EntityListAgentScriptName
    );
    //Run Macro
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToCustomerServiceWorkspace();
    await adminStartPage.waitForDomContentLoaded();
    const caseTitle = await macrosAdminPage.createCaseWithAPI(
      Constants.CaseTitleName
    );
    await macrosAdminPage.InitiateSession(
      caseTitle,
      Constants.LinkStart + caseTitle + Constants.LinkEnd
    );
    const runValidateEntityListMacro =
      await macrosAdminPage.runMacroInSessionAndValidate(
        Constants.EntityListAgentScriptName,
        Constants.EntityListTitle
      );
    expect(runValidateEntityListMacro).toBeTruthy();
    await macrosAdminPage.deletAgentScriptStepByXRM(
      agentChat,
      EntityNames.AgentScriptStep,
      agentScriptStep.id
    );
    await macrosAdminPage.deleteAgentScriptByXRM(
      agentChat,
      EntityNames.AgentScript,
      agentScript.id
    );
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
      TestSettings.MacroAccountEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);

    const applicationTabId =
      await macrosAdminPage.createApplicationTabAndGetId(
        Constants.ThirdPartyWebsiteApplicationTab,
        Constants.ThirdPartyWebsiteApplicationTabUniqueName,
        Constants.ThirdPartyWebsiteOptionValue
      );
    await macrosAdminPage.createMacroFromOmnichannelAdminCenterApp(
      Constants.ThirdPartyWebsiteMacroName,
      applicationTabId
    );

    await agentChat.waitforTimeout();

    const workflowID = await macrosAdminPage.getLatestMacro(agentChat, Constants.ThirdPartyWebsiteMacroName);

    const agentScript = await macrosAdminPage.createAgentScriptByXRMAPI(agentChat,
      Constants.ThirdPartyWebsiteAgentScriptName,
      Constants.TitleUniqueName + rnd);

    const agentScriptStep = await macrosAdminPage.createAgentScriptStepbyXRMAPI(agentChat,
      Constants.ThirdPartyWebsiteAgentScriptName,
      Constants.TitleUniqueName + rnd,
      Constants.AgentscriptStepOrder,
      Constants.MacroAgentScriptStep,
      agentScript.id,
      Constants.ThirdPartyWebsiteMacroName,
      workflowID);

    await macrosAdminPage.OpenAgentScriptandSave(Constants.ThirdPartyWebsiteAgentScriptName);

    await macrosAdminPage.addAgentScripttoDefaultChatSessionWithParameter(
      Constants.ThirdPartyWebsiteAgentScriptName
    );
    //Run Macro
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await agentChat.waitForAgentStatusIcon();

    var CaseUserName = Constants.XRMCaseName + rnd;
    caseNameList = [CaseUserName];

    await macrosAdminPage.createIncidents(agentChat, caseNameList);
    await macrosAdminPage.InitiateSession(
      CaseUserName,
      stringFormat(Constants.XRMSpecificCaseLink1, rnd)
    );
    const runValidateTPWMacro =
      await macrosAdminPage.runMacroInSessionAndValidate(
        Constants.ThirdPartyWebsiteAgentScriptName,
        Constants.ThirdPartyWebsiteTitle
      );
    expect(runValidateTPWMacro).toBeTruthy();
    await macrosAdminPage.deletAgentscriptStepbyXRM(agentChat, EntityNames.AgentScriptStep, agentScriptStep.id);
    await macrosAdminPage.deleteAgentScriptbyXRM(agentChat, EntityNames.AgentScript, agentScript.id);
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
      TestSettings.MacroAccountEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    await adminStartPage.waitForDomContentLoaded();
    const applicationTabId = await macrosAdminPage.createApplicationTabAndGetId(
      Constants.SearchApplicationTab,
      Constants.TitleUniqueName,
      Constants.EntitySearchOptionValue
    );
    await macrosAdminPage.createMacroFromOmnichannelAdminCenterApp(
      Constants.SearchMacroName,
      applicationTabId
    );
    const workflowID = await macrosAdminPage.getLatestMacro(
      agentChat,
      Constants.SearchMacroName
    );

    const agentScript = await agentChat.createAgentScriptbyXRMAPI(
      Constants.SearchAgentScriptName,
      Constants.TitleUniqueName + rnd
    );
    const agentScriptStep = await agentChat.createAgentScriptStepbyXRMAPI(
      Constants.SearchAgentScriptName,
      Constants.TitleUniqueName + rnd,
      Constants.AgentscriptStepOrder,
      Constants.MacroAgentScriptStep,
      agentScript.id,
      Constants.SearchMacroName,
      workflowID
    );
    await macrosAdminPage.OpenAgentScriptandSave(
      Constants.SearchAgentScriptName
    );
    await macrosAdminPage.addAgentScripttoDefaultChatSessionWithParameter(
      Constants.SearchAgentScriptName
    );
    //Run Macro
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToCustomerServiceWorkspace();
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    var CaseUserName = Constants.XRMCaseName + rnd;
    caseNameList = [CaseUserName];
    await macrosAdminPage.createIncidents(agentChat, caseNameList);
    await macrosAdminPage.InitiateSession(
      CaseUserName,
      stringFormat(Constants.XRMSpecificCaseLink1, rnd)
    );
    const runValidateSearchMacro =
      await macrosAdminPage.runMacroInSessionAndValidate(
        Constants.SearchAgentScriptName,
        Constants.SearchTitle
      );
    expect(runValidateSearchMacro).toBeTruthy();
    await macrosAdminPage.deletAgentScriptStepByXRM(
      agentChat,
      EntityNames.AgentScriptStep,
      agentScriptStep.id
    );
    await macrosAdminPage.deleteAgentScriptByXRM(
      agentChat,
      EntityNames.AgentScript,
      agentScript.id
    );
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
      TestSettings.MacroAccountEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    const urlId = await macrosAdminPage.createApplicationTabAndGetId(
      Constants.WebResourceApplicationTab,
      Constants.WebResourceApplicationTabUniqueName,
      Constants.WebResourceOptionValue
    );
    await macrosAdminPage.createMacroFromOmnichannelAdminCenterApp(
      Constants.WebResourceMacroName,
      urlId
    );
    await macrosAdminPage.waitForTimeout();
    const workflowID = await macrosAdminPage.getLatestMacro(
      agentChat,
      Constants.WebResourceMacroName
    );
    const agentScript = await agentChat.createAgentScriptbyXRMAPI(
      Constants.WebResourceAgentScriptName,
      Constants.TitleUniqueName + rnd
    );
    const agentScriptStep = await agentChat.createAgentScriptStepbyXRMAPI(
      Constants.WebResourceAgentScriptName,
      Constants.TitleUniqueName + rnd + rnd,
      Constants.AgentscriptStepOrder,
      Constants.MacroAgentScriptStep,
      agentScript.id,
      Constants.WebResourceMacroName,
      workflowID
    );
    await macrosAdminPage.OpenAgentScriptandSave(
      Constants.WebResourceAgentScriptName
    );
    await macrosAdminPage.addAgentScripttoDefaultChatSessionWithParameter(
      Constants.WebResourceAgentScriptName
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
    const openEntityRecordTabUsingMacro =
      await macrosAdminPage.runMacroInSessionAndValidate(
        Constants.WebResourceAgentScriptName,
        Constants.WebResourceTitle
      );
    expect(openEntityRecordTabUsingMacro).toBeTruthy();
    await macrosAdminPage.deletAgentScriptStepByXRM(
      agentChat,
      EntityNames.AgentScriptStep,
      agentScriptStep.id
    );
    await macrosAdminPage.deleteAgentScriptByXRM(
      agentChat,
      EntityNames.AgentScript,
      agentScript.id
    );
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
      TestSettings.MacroAccountEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    const applicationTabId =
      await macrosAdminPage.createApplicationTabAndGetId(
        Constants.EntityRecordApplicationTab,
        Constants.EntityRecordApplicationTabUniqueName,
        Constants.EntityRecordOptionValue
      );
    await macrosAdminPage.createMacroFromOmnichannelAdminCenterApp(
      Constants.EntityRecordMacroName,
      applicationTabId
    );
    await agentChat.waitforTimeout();// Default timeout is required to load the page 
    const workflowID = await macrosAdminPage.getLatestMacro(agentChat, Constants.EntityRecordMacroName);
    const agentScript = await agentChat.createAgentScriptbyXRMAPI(
      Constants.EntityRecordAgentScriptName,
      Constants.TitleUniqueName + rnd);
    const agentScriptStep = await agentChat.createAgentScriptStepbyXRMAPI(
      Constants.EntityRecordAgentScriptName,
      Constants.TitleUniqueName + rnd + rnd,
      Constants.AgentscriptStepOrder,
      Constants.MacroAgentScriptStep,
      agentScript.id,
      Constants.EntityRecordMacro,
      workflowID);
    await macrosAdminPage.OpenAgentScriptandSave(Constants.EntityRecordAgentScriptName);
    await macrosAdminPage.addAgentScripttoDefaultChatSessionWithParameter(
      Constants.EntityRecordAgentScriptName
    );
    //Run Macro
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await macrosAdminPage.waitForDomContentLoaded();
    await macrosAdminPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await agentChat.waitForAgentStatusIcon();
    const CaseTitleName = await macrosAdminPage.createCaseWithAPI(
      Constants.CaseTitleName
    );
    await macrosAdminPage.InitiateSession(
      CaseTitleName,
      (Constants.LinkStart + CaseTitleName + Constants.LinkEnd)
    );
    const runAndValidateMacro =
      await macrosAdminPage.runMacroInSessionAndValidate(
        Constants.EntityRecordAgentScriptName,
        Constants.EntityRecordTitle
      );
    expect(runAndValidateMacro).toBeTruthy();
    await agentChat.deleteRecordbyXRM(EntityNames.AgentScriptStep, agentScriptStep.id);
    await agentChat.deleteRecordbyXRM(EntityNames.AgentScript, agentScript.id);
    await agentChat.deleteRecordbyXRM(EntityNames.Macros, workflowID);
    await agentChat.deleteRecordbyXRM(EntityNames.ApplicationTabTemplate, applicationTabId);
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
      TestSettings.MacroAccountEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
    const kbArticleId = await macrosAdminPage.createKbArticleAndGetId();
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    await macrosAdminPage.createMacro(
      Constants.OpenKbArticleMacroName,
      kbArticleId
    );
    await macrosAdminPage.waitForTimeout();
    const workflowID = await macrosAdminPage.getLatestMacro(
      agentChat,
      Constants.OpenKbArticleMacroName
    );
    const agentScript = await agentChat.createAgentScriptbyXRMAPI(
      Constants.OpenKbArticleAgentScriptName,
      Constants.TitleUniqueName + rnd
    );
    const agentScriptStep = await agentChat.createAgentScriptStepbyXRMAPI(
      Constants.OpenKbArticleAgentScriptName,
      Constants.TitleUniqueName + rnd + rnd,
      Constants.AgentscriptStepOrder,
      Constants.MacroAgentScriptStep,
      agentScript.id,
      Constants.OpenKbArticleMacroName,
      workflowID
    );
    await macrosAdminPage.OpenAgentScriptandSave(
      Constants.OpenKbArticleAgentScriptName
    );
    await macrosAdminPage.addAgentScripttoDefaultChatSessionWithParameter(
      Constants.OpenKbArticleAgentScriptName
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
    const openEntityRecordTabUsingMacro =
      await macrosAdminPage.runMacroInSessionAndValidate(
        Constants.OpenKbArticleAgentScriptName,
        Constants.OpenKbArticleTitle
      );
    expect(openEntityRecordTabUsingMacro).toBeTruthy();
    await macrosAdminPage.deletAgentScriptStepByXRM(
      agentChat,
      EntityNames.AgentScriptStep,
      agentScriptStep.id
    );
    await macrosAdminPage.deleteAgentScriptByXRM(
      agentChat,
      EntityNames.AgentScript,
      agentScript.id
    );
    await agentChat.deleteRecordbyXRM(EntityNames.Macros, workflowID);
  });

  ///Test Case 1805118: [Macros] Verify entity view application template is opened in new tab using 'Open application tab' action in macros
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1805118
  ///</summary>
  it("Test Case 1805118: [Macros] Verify entity view application template is opened in new tab using 'Open application tab' action in macros", async () => {
    agentPage = await agentContext.newPage();
    rnd = agentScriptAdminPage.RandomNumber();
    //Login as admin and create cases
    await agentChat.navigateToOrgUrlAndSignIn(
      TestSettings.MacroAccountEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    const applicationTabId = await macrosAdminPage.createApplicationTabAndGetId(
      Constants.EntitySearchApplicationTab,
      Constants.EntitySearchApplicationTabUniqueName,
      Constants.EntitySearchOptionValue
    );
    await macrosAdminPage.createMacro(
      Constants.EntitySearchMacroName,
      applicationTabId
    );

    const workflowID = await macrosAdminPage.getLatestMacro(
      agentChat,
      Constants.EntitySearchMacroName
    );

    const agentScript = await agentChat.createAgentScriptbyXRMAPI(
      Constants.EntitySearchAgentScriptName,
      Constants.TitleUniqueName + rnd
    );
    const agentScriptStep = await agentChat.createAgentScriptStepbyXRMAPI(
      Constants.EntitySearchAgentScriptName,
      Constants.TitleUniqueName + rnd,
      Constants.AgentscriptStepOrder,
      Constants.MacroAgentScriptStep,
      agentScript.id,
      Constants.EntitySearchMacroName,
      workflowID
    );
    await macrosAdminPage.OpenAgentScriptandSave(
      Constants.EntitySearchAgentScriptName
    );
    await macrosAdminPage.addAgentScripttoDefaultChatSessionWithParameter(
      Constants.EntitySearchAgentScriptName
    );
    //Run Macro
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToCustomerServiceWorkspace();
    await adminStartPage.waitForDomContentLoaded();
    const caseTitle = await macrosAdminPage.createCaseWithAPI(
      Constants.CaseTitleName
    );
    await macrosAdminPage.InitiateSession(
      caseTitle,
      Constants.LinkStart + caseTitle + Constants.LinkEnd
    );
    const runValidateEntitySearchMacro =
      await macrosAdminPage.runMacroInSessionAndValidate(
        Constants.EntitySearchAgentScriptName,
        Constants.EntitySearchTitle
      );
    expect(runValidateEntitySearchMacro).toBeTruthy();
    await macrosAdminPage.deletAgentScriptStepByXRM(
      agentChat,
      EntityNames.AgentScriptStep,
      agentScriptStep.id
    );
    await macrosAdminPage.deleteAgentScriptByXRM(
      agentChat,
      EntityNames.AgentScript,
      agentScript.id
    );
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
      TestSettings.MacroAccountEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);

    await macrosAdminPage.createMacro(
      Constants.SearchPhraseForPopulatedPhrase
    );
    await agentChat.waitforTimeout();
    const workflowID = await macrosAdminPage.getLatestMacro(agentChat, Constants.SearchPhraseForPopulatedPhrase);

    const agentScript = await macrosAdminPage.createAgentScriptByXRMAPI(agentChat,
      Constants.SearchPhraseAgentScript,
      Constants.SearchPhraseAgentScriptUniqueName + rnd);

    const agentScriptStep = await macrosAdminPage.createAgentScriptStepbyXRMAPI(agentChat,
      Constants.SearchPhraseAgentScript,
      Constants.SearchPhraseAgentScriptUniqueName + rnd,
      Constants.AgentscriptStepOrder,
      Constants.MacroAgentScriptStep,
      agentScript.id,
      Constants.SearchPhraseForPopulatedPhrase,
      workflowID);

    await macrosAdminPage.OpenAgentScriptandSave(Constants.SearchPhraseAgentScript);
    await macrosAdminPage.addAgentScripttoDefaultChatSessionWithParameter(
      Constants.SearchPhraseAgentScript
    );

    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await agentChat.waitForAgentStatusIcon();

    var CaseUserName = Constants.XRMCaseName + rnd;
    caseNameList = [CaseUserName];

    await macrosAdminPage.createIncidents(agentChat, caseNameList);
    await macrosAdminPage.InitiateSession(
      CaseUserName,
      stringFormat(Constants.XRMSpecificCaseLink1, rnd)
    );
    //Run Macro in a session & verify tab opened
    const macroResult = await macrosAdminPage.runMacroInSessionAndValidate(
      Constants.SearchPhraseAgentScript,
      Constants.SearchPhraseTabName
    );
    expect(macroResult).toBeTruthy();

    await macrosAdminPage.deletAgentscriptStepbyXRM(agentChat, EntityNames.AgentScriptStep, agentScriptStep.id);
    await macrosAdminPage.deleteAgentScriptbyXRM(agentChat, EntityNames.AgentScript, agentScript.id);
    await macrosAdminPage.deleteAgentScriptbyXRM(agentChat, EntityNames.Macros, workflowID);
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
    const workflowID = await macrosAdminPage.getLatestMacro(agentChat, Constants.OpenRefreshTab);
    const agentScript = await macrosAdminPage.createAgentScriptByXRMAPI(agentChat,
      Constants.RefreshTabAgentScript,
      Constants.RefreshTabAgentScriptUniqueName + rnd);

    const agentScriptStep = await macrosAdminPage.createAgentScriptStepbyXRMAPI(agentChat,
      Constants.RefreshTabAgentScript,
      Constants.RefreshTabAgentScriptUniqueName + rnd,
      Constants.AgentscriptStepOrder,
      Constants.MacroAgentScriptStep,
      agentScript.id,
      Constants.OpenRefreshTab,
      workflowID);
    await macrosAdminPage.OpenAgentScriptandSave(Constants.RefreshTabAgentScript);

    await macrosAdminPage.addAgentScripttoDefaultChatSessionWithParameter(
      Constants.RefreshTabAgentScript
    );
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToCustomerServiceWorkspace();
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await agentChat.waitForAgentStatusIcon();

    var CaseUserName = Constants.XRMCaseName + rnd;
    caseNameList = [CaseUserName];

    await macrosAdminPage.createIncidents(agentChat, caseNameList);
    await macrosAdminPage.InitiateSession(
      CaseUserName,
      stringFormat(Constants.XRMSpecificCaseLink1, rnd)
    );
    //Run Macro in a session
    const macroResult = await macrosAdminPage.runMacroInSessionAndValidate(
      Constants.RefreshTabAgentScript,
      stringFormat(Constants.SpanTag, CaseUserName)
    );
    expect(macroResult).toBeTruthy();

    await macrosAdminPage.deletAgentscriptStepbyXRM(agentChat, EntityNames.AgentScriptStep, agentScriptStep.id);
    await macrosAdminPage.deleteAgentScriptbyXRM(agentChat, EntityNames.AgentScript, agentScript.id);
    await macrosAdminPage.deleteAgentScriptbyXRM(agentChat, EntityNames.Macros, workflowID);
  });

  ///<summary>
  ///Test Case 2253513: [Macros] Verify dashboard application template is opened in new tab using 'Open application tab' action in macros
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2253513
  ///</summary>
  // it.skip("Test Case 2253513: [Macros] Verify dashboard application template is opened in new tab using 'Open application tab' action in macros", async () => {
  //   agentPage = await agentContext.newPage();
  //   liveChatPage = new LiveChatPage(await liveChatContext.newPage());
  //   try {
  //     //Login as 'Admin automated' and redirected to OrgUrl
  //     await adminStartPage.navigateToOrgUrlAndSignIn(
  //       TestSettings.MacroAccountEmail,
  //       TestSettings.AdminAccountPassword
  //     );
  //     await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
  //     const urlId = await macrosAdminPage.createApplicationTabAndGetId(
  //       Constants.DashboardName,
  //       Constants.DashboardUniqueName,
  //       Constants.DashboardOptionValue
  //     );
  //     await macrosAdminPage.createMacroFromOmnichannelAdminCenterApp(
  //       Constants.DashboardMacro,
  //       urlId
  //     );
  //     await macrosAdminPage.createAgentScript(
  //       Constants.DascboardAgentScriptName,
  //       Constants.TitleUniqueName,
  //       Constants.DashboardMacro
  //     );
  //     await macrosAdminPage.addAgentScripttoDefaultChatSession();
  //     //Run Macro
  //     await macrosAdminPage.openAppLandingPage(adminPage);
  //     await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
  //     await macrosAdminPage.createCase(Constants.CaseTitleName);
  //     await macrosAdminPage.InitiateSession(
  //       Constants.CaseTitleName,
  //       Constants.CaseLink1
  //     );
  //     const openEntityRecordTabUsingMacro =
  //       await macrosAdminPage.runMacroInSessionAndValidate(
  //         Constants.DascboardAgentScriptName,
  //         Constants.DashboardTitle
  //       );
  //     expect(openEntityRecordTabUsingMacro).toBeTruthy();
  //   } finally {
  //     await macrosAdminPage.deleteAgentScriptnNew(
  //       adminPage,
  //       adminStartPage,
  //       Constants.DascboardAgentScriptName
  //     );
  //     await macrosAdminPage.deleteApplicationTabusingOmnichannelAdminCenter(
  //       Constants.DashboardName
  //     );
  //     await macrosAdminPage.deleteMacroFromOmnichannelAdminCenterApp(
  //       Constants.DashboardMacro
  //     );
  //     await macrosAdminPage.removeAgentScripttoDefaultCaseSession();
  //   }
  // });

  ///<summary>
  ///Test Case 2366971: [Macros] Verify existing record is opened  using 'Open an existing record' action in the Productivity Automation.
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2366971
  ///</summary>
  it("Test Case 2366971: [Macros] Verify existing record is opened using 'Open an existing record' action in the Productivity Automation.", async () => {
    agentPage = await agentContext.newPage();
    const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
    liveChatPage = new LiveChatPage(await liveChatContext.newPage());
    const agentChat = new AgentChat(agentPage);
    try {
      //Login as admin and create macro
      await adminStartPage.navigateToOrgUrlAndSignIn(
        TestSettings.MacrosAgentEmail,
        TestSettings.AdminAccountPassword
      );
      await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
      const accountId = await macrosAdminPage.createAccountAndGetId(
        Constants.AccountName
      );
      await macrosAdminPage.openAppLandingPage(adminPage);
      await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
      await macrosAdminPage.createMacro(Constants.ExistingRecord, accountId);

      //Initiate live chat with agent
      await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);

      //Login as agent and accept chat
      await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(
        TestSettings.MacrosAgentEmail,
        agentStartPage,
        agentChat
      );
      await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);

      //Check API response through console
      const result = await agentPage.evaluate(async () => {
        const ctrl = await (
          window as any
        ).Microsoft.ProductivityMacros.runMacro("Open an existing record");
        return ctrl;
      });
      expect(result).toBe(Constants.ActionPerformedSuccessfully);

      //Check API result on UI
      const openEntityListResult = await macrosAdminPage.verifyOpenedTab(
        agentPage,
        Constants.EntityRecordTab
      );
      expect(openEntityListResult).toBeTruthy();

      //End live chat

      await agentChat.closeUnusedChat();
      await liveChatPage.closeChat();
    } finally {
      await macrosAdminPage.deleteMacro(
        adminStartPage,
        Constants.ExistingRecord
      );
      await macrosAdminPage.deleteAccount(
        adminPage,
        adminStartPage,
        Constants.AccountName
      );
    }
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
      TestSettings.MacroAccountEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    const applicationTabId = await macrosAdminPage.createApplicationTabAndGetId(
      Constants.WebResourceApplicationTab,
      Constants.UniqueName + rnd,
      Constants.WebResourceOptionValue
    );
    await macrosAdminPage.createMacro(
      Constants.WebResourcesMacroName,
      applicationTabId
    );
    await macrosAdminPage.waitForTimeout();
    const workflowID = await macrosAdminPage.getLatestMacro(
      agentChat,
      Constants.WebResourcesMacroName
    );
    const agentScript = await agentChat.createAgentScriptbyXRMAPI(
      Constants.WebResourcesAgentScriptName,
      Constants.TitleUniqueName + rnd
    );
    const agentScriptStep = await agentChat.createAgentScriptStepbyXRMAPI(
      Constants.WebResourcesAgentScriptName,
      Constants.TitleUniqueName + rnd + rnd,
      Constants.AgentscriptStepOrder,
      Constants.MacroAgentScriptStep,
      agentScript.id,
      Constants.WebResourcesMacroName,
      workflowID
    );
    await macrosAdminPage.OpenAgentScriptandSave(
      Constants.WebResourcesAgentScriptName
    );
    await macrosAdminPage.addAgentScripttoDefaultChatSessionWithParameter(
      Constants.WebResourcesAgentScriptName
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
    const openEntityRecordTabUsingMacro =
      await macrosAdminPage.runMacroInSessionAndValidate(
        Constants.WebResourcesAgentScriptName,
        Constants.WebResourcesTitle
      );
    expect(openEntityRecordTabUsingMacro).toBeTruthy();
    await macrosAdminPage.deletAgentScriptStepByXRM(
      agentChat,
      EntityNames.AgentScriptStep,
      agentScriptStep.id
    );
    await macrosAdminPage.deleteAgentScriptByXRM(
      agentChat,
      EntityNames.AgentScript,
      agentScript.id
    );
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
      TestSettings.MacroAccountEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
    const incidentId = await macrosAdminPage.createCaseAndGetIncidentId();
    const incidentEmailTemplateId =
      await macrosAdminPage.CreateEmailTemplateAndGetId();
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    await macrosAdminPage.createMacro(
      Constants.CreateDraftEmailMacroName,
      incidentEmailTemplateId,
      incidentId
    );
    await macrosAdminPage.waitForTimeout();
    const workflowID = await macrosAdminPage.getLatestMacro(
      agentChat,
      Constants.CreateDraftEmailMacroName
    );
    const agentScript = await agentChat.createAgentScriptbyXRMAPI(
      Constants.CreateDraftEmailAgentScriptName,
      Constants.TitleUniqueName + rnd
    );
    const agentScriptStep = await agentChat.createAgentScriptStepbyXRMAPI(
      Constants.CreateDraftEmailAgentScriptName,
      Constants.TitleUniqueName + rnd + rnd,
      Constants.AgentscriptStepOrder,
      Constants.MacroAgentScriptStep,
      agentScript.id,
      Constants.CreateDraftEmailMacroName,
      workflowID
    );
    await macrosAdminPage.OpenAgentScriptandSave(
      Constants.CreateDraftEmailAgentScriptName
    );
    await macrosAdminPage.addAgentScripttoDefaultChatSessionWithParameter(
      Constants.CreateDraftEmailAgentScriptName
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
    const openEntityRecordTabUsingMacro =
      await macrosAdminPage.runMacroInSessionAndValidate(
        Constants.CreateDraftEmailAgentScriptName,
        Constants.CreateDraftEmailTitle
      );
    expect(openEntityRecordTabUsingMacro).toBeTruthy();
    await macrosAdminPage.deletAgentScriptStepByXRM(
      agentChat,
      EntityNames.AgentScriptStep,
      agentScriptStep.id
    );
    await macrosAdminPage.deleteAgentScriptByXRM(
      agentChat,
      EntityNames.AgentScript,
      agentScript.id
    );
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
      TestSettings.MacroAccountEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    await macrosAdminPage.createMacro(
      Constants.FailMacroName
    );
    await macrosAdminPage.waitForTimeout();
    const workflowID = await macrosAdminPage.getLatestMacro(
      agentChat,
      Constants.FailMacroName
    );
    const agentScript = await agentChat.createAgentScriptbyXRMAPI(
      Constants.FailAgentScriptName,
      Constants.TitleUniqueName + rnd
    );
    await macrosAdminPage.OpenAgentScriptandSave(
      Constants.FailAgentScriptName
    );
    await macrosAdminPage.addAgentScripttoDefaultChatSessionWithParameter(
      Constants.FailAgentScriptName
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
    const openEntityRecordTabUsingMacro =
      await macrosAdminPage.runFailMacroAndValidate(
        Constants.FailAgentScriptName,
        Constants.FailTitle
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
    const agentScriptStep = await agentChat.createAgentScriptStepbyXRMAPI(
      Constants.CloneRecordAgentScriptName,
      Constants.TitleUniqueName + rnd + rnd,
      Constants.AgentscriptStepOrder,
      Constants.MacroAgentScriptStep,
      agentScript.id,
      Constants.CloneRecordMacroName,
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
    await macrosAdminPage.waitForDomContentLoaded();
    await macrosAdminPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await agentChat.waitForAgentStatusIcon();
    const caseTitle = await macrosAdminPage.createCaseWithAPI(
      Constants.CaseTitleName
    );
    await macrosAdminPage.InitiateSession(
      caseTitle,
      Constants.LinkStart + caseTitle + Constants.LinkEnd
    );
    const openEntityRecordTabUsingMacro =
      await macrosAdminPage.runMacroInSessionAndValidate(
        Constants.CloneRecordAgentScriptName,
        Constants.CloneRecordTitle
      );
    expect(openEntityRecordTabUsingMacro).toBeTruthy();
    await macrosAdminPage.deletAgentScriptStepByXRM(
      agentChat,
      EntityNames.AgentScriptStep,
      agentScriptStep.id
    );
    await macrosAdminPage.deleteAgentScriptByXRM(
      agentChat,
      EntityNames.AgentScript,
      agentScript.id
    );
    await agentChat.deleteRecordbyXRM(EntityNames.Macros, workflowID);
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
      TestSettings.MacroAccountEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    const applicationTabId = await macrosAdminPage.createApplicationTabAndGetId(
      Constants.EntitySearchApplicationTab,
      Constants.EntitySearchApplicationTabUniqueName,
      Constants.EntitySearchOptionValue
    );
    await macrosAdminPage.createMacro(
      Constants.EntitySearchMacroName,
      applicationTabId
    );

    const workflowID = await macrosAdminPage.getLatestMacro(
      agentChat,
      Constants.EntitySearchMacroName
    );

    const agentScript = await agentChat.createAgentScriptbyXRMAPI(
      Constants.EntitySearchAgentScriptName,
      Constants.TitleUniqueName + rnd
    );
    const agentScriptStep = await agentChat.createAgentScriptStepbyXRMAPI(
      Constants.EntitySearchAgentScriptName,
      Constants.TitleUniqueName + rnd,
      Constants.AgentscriptStepOrder,
      Constants.MacroAgentScriptStep,
      agentScript.id,
      Constants.EntitySearchMacroName,
      workflowID
    );
    await macrosAdminPage.OpenAgentScriptandSave(
      Constants.EntitySearchAgentScriptName
    );
    await macrosAdminPage.addAgentScripttoDefaultChatSessionWithParameter(
      Constants.EntitySearchAgentScriptName
    );
    //Run Macro
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToCustomerServiceWorkspace();
    await adminStartPage.waitForDomContentLoaded();
    const caseTitle = await macrosAdminPage.createCaseWithAPI(
      Constants.CaseTitleName
    );
    await macrosAdminPage.InitiateSession(
      caseTitle,
      Constants.LinkStart + caseTitle + Constants.LinkEnd
    );
    const runValidateEntitySearchMacro =
      await macrosAdminPage.runMacroInSessionAndValidate(
        Constants.EntitySearchAgentScriptName,
        Constants.EntitySearchTitle
      );
    expect(runValidateEntitySearchMacro).toBeTruthy();
    await macrosAdminPage.deletAgentScriptStepByXRM(
      agentChat,
      EntityNames.AgentScriptStep,
      agentScriptStep.id
    );
    await macrosAdminPage.deleteAgentScriptByXRM(
      agentChat,
      EntityNames.AgentScript,
      agentScript.id
    );
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
      TestSettings.MacroAccountEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
    const account = await macrosAdminPage.createAccountAndGetAccountId(
      Constants.AccountName2 + rnd
    );
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    await adminStartPage.waitForDomContentLoaded();
    await macrosAdminPage.CreateCloneCurrentMacro(
      Constants.CloneRecordMacroName,
      account
    );
    const workflowID = await macrosAdminPage.getLatestMacro(
      agentChat,
      Constants.CloneRecordMacroName
    );
    const agentScript = await agentChat.createAgentScriptbyXRMAPI(
      Constants.CloneRecordAgentScriptName,
      Constants.TitleUniqueName + rnd
    );
    const agentScriptStep = await agentChat.createAgentScriptStepbyXRMAPI(
      Constants.CloneRecordAgentScriptName,
      Constants.TitleUniqueName + rnd,
      Constants.AgentscriptStepOrder,
      Constants.MacroAgentScriptStep,
      agentScript.id,
      Constants.CloneRecordMacroName,
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
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    var CaseUserName = Constants.XRMCaseName + rnd;
    caseNameList = [CaseUserName];
    await macrosAdminPage.createIncidents(agentChat, caseNameList);
    await macrosAdminPage.InitiateSession(
      CaseUserName,
      stringFormat(Constants.XRMSpecificCaseLink1, rnd)
    );
    const runValidateCloneRecordMacro =
      await macrosAdminPage.runMacroInSessionAndValidate(
        Constants.CloneRecordAgentScriptName,
        Constants.CloneRecordTitle
      );
    expect(runValidateCloneRecordMacro).toBeTruthy();
    await macrosAdminPage.deletAgentScriptStepByXRM(
      agentChat,
      EntityNames.AgentScriptStep,
      agentScriptStep.id
    );
    await macrosAdminPage.deleteAgentScriptByXRM(
      agentChat,
      EntityNames.AgentScript,
      agentScript.id
    );
  });
});
