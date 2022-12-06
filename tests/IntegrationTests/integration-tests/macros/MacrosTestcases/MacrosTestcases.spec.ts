import { AgentChat } from "../../../pages/AgentChat";
import { BrowserContext, Page } from "playwright";
import { Constants } from "../../common/constants";
import { LiveChatPage } from "../../../pages/LiveChat";
import { Macros } from "../../macropages/macrosAdmin";
import { OrgDynamicsCrmStartPage } from "../../../pages/org-dynamics-crm-start.page";
import { TestHelper } from "../../../helpers/test-helper";
import { TestSettings } from "../../../configuration/test-settings";
import { AgentScript } from "../../agentScript/pages/agentScriptAdmin";
import { AppProfileHelper } from "helpers/appprofile-helper";
import { EntityNames, stringFormat } from "Utility/Constants";

describe("Macro testcases - ", () => {
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
    await macrosAdminPage.createMacro(Constants.AutoFillFieldsWithData);
    const workflowID = await macrosAdminPage.getLatestMacro(
      agentChat,
      Constants.AutoFillFieldsWithData
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
      Constants.AutoFillFieldsWithData,
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
          workflowID);

    await macrosAdminPage.OpenAgentScriptandSave(
      Constants.ControlAgentScriptName
    );
    await macrosAdminPage.addAgentScripttoDefaultChatSessionWithParameter(
      Constants.ControlAgentScriptName
    );
    //Run Macro
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await macrosAdminPage.createCaseWithAPI(Constants.CaseTitleName);
    await macrosAdminPage.InitiateSession(
      Constants.CaseTitleName,
      Constants.CaseLink1
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
          workflowID);

    await macrosAdminPage.OpenAgentScriptandSave(
      Constants.ThirdPartyWebsiteAgentScriptName
    );
    await macrosAdminPage.addAgentScripttoDefaultChatSessionWithParameter(
      Constants.ThirdPartyWebsiteAgentScriptName
    );
    //Run Macro
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
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
    //Login as admin and create cases
    await agentChat.navigateToOrgUrlAndSignIn(
      TestSettings.MacroAccountEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdmincenter);
    await macrosAdminPage.createMacro(Constants.OpenNewFormMacroName);
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
      Constants.TitleUniqueName + rnd,
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
    await adminStartPage.goToCustomerServiceWorkspace();
    await adminStartPage.waitForDomContentLoaded();
    const caseTitle = await macrosAdminPage.createCaseWithAPI(
      Constants.CaseTitleName
    );
    await macrosAdminPage.InitiateSession(
      caseTitle,
      Constants.LinkStart + caseTitle + Constants.LinkEnd
    );
    const runValidateOpenNewFormMacro =
      await macrosAdminPage.runMacroInSessionAndValidate(
        Constants.OpenNewFormAgentScriptName,
        Constants.OpenNewFormTitle
      );
    expect(runValidateOpenNewFormMacro).toBeTruthy();
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
    //Login as admin and create cases
    await agentChat.navigateToOrgUrlAndSignIn(
      TestSettings.MacroAccountEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdmincenter);
    await macrosAdminPage.createMacro(Constants.OpenKBSearchMacroName);
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
      Constants.TitleUniqueName + rnd,
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
    await adminStartPage.goToCustomerServiceWorkspace();
    await adminStartPage.waitForDomContentLoaded();
    const caseTitle = await macrosAdminPage.createCaseWithAPI(
      Constants.CaseTitleName
    );
    await macrosAdminPage.InitiateSession(
      caseTitle,
      Constants.LinkStart + caseTitle + Constants.LinkEnd
    );
    const runValidateOpenKBSearchMacro =
      await macrosAdminPage.runMacroInSessionAndValidate(
        Constants.OpenKBSearchAgentScriptName,
        Constants.OpenKBSearchTitle
      );
    expect(runValidateOpenKBSearchMacro).toBeTruthy();
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
    liveChatPage = new LiveChatPage(await liveChatContext.newPage());
    try {
      //Login as admin and create macro
      await adminStartPage.navigateToOrgUrlAndSignIn(
        TestSettings.AdminAccountEmail,
        TestSettings.AdminAccountPassword
      );
      await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
      const incidentId = await macrosAdminPage.createCaseAndGetIncidentId();

      await macrosAdminPage.openAppLandingPage(adminPage);
      await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
      await macrosAdminPage.createMacro(
        Constants.OpenExistingFormMacroName,
        incidentId
      );
      await macrosAdminPage.createAgentScript(
        Constants.OpenExistingFormAgentScriptName,
        Constants.TitleUniqueName,
        Constants.OpenExistingFormMacroName
      );
      await macrosAdminPage.addAgentScripttoDefaultChatSessionWithParameter(
        Constants.OpenExistingFormAgentScriptName
      );
      //Run Macro
      await macrosAdminPage.openAppLandingPage(adminPage);
      await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
      await macrosAdminPage.CreateCaseInCSW(Constants.CaseTitleName);
      await macrosAdminPage.InitiateSession(
        Constants.CaseTitleName,
        Constants.CaseLink1
      );
      const runValidateExistingFormMacro =
        await macrosAdminPage.runMacroInSessionAndValidate(
          Constants.OpenExistingFormAgentScriptName,
          Constants.OpenExistingFormTitle
        );
      expect(runValidateExistingFormMacro).toBeTruthy();
    } finally {
      await macrosAdminPage.deleteAgentScriptnNew(
        adminPage,
        adminStartPage,
        Constants.OpenExistingFormAgentScriptName
      );
      await macrosAdminPage.deleteMacroFromOmnichannelAdminCenterApp(
        Constants.OpenExistingFormMacroName
      );
      await macrosAdminPage.removeAgentScripttoDefaultCaseSession();
    }
  });

  ///<summary>
  ///Test Case 1580586: Verify OpenGrid macro action
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_testPlans/execute?planId=2478602&opId=3561&suiteId=2478606
  ///</summary>
  it.skip("Test Case 1580586: Verify OpenGrid macro action", async () => {
    agentPage = await agentContext.newPage();
    const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
    liveChatPage = new LiveChatPage(await liveChatContext.newPage());
    const agentChat = new AgentChat(agentPage);
    try {
      //Login as admin and create macro
      await adminStartPage.navigateToOrgUrlAndSignIn(
        TestSettings.AdminAccountEmail,
        TestSettings.AdminAccountPassword
      );
      await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
      await macrosAdminPage.createMacro(Constants.OpenAccountGrid);

      //Initiate live chat with agent
      await macrosAdminPage.initiateLiveChatWithMacroAgent(liveChatPage);
      //Login as agent and accept chat
      await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(
        TestSettings.AdminAccountEmail,
        agentStartPage,
        agentChat
      );
      await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);
      //Check API response through console
      const result = await agentPage.evaluate(async () => {
        const ctrl = await (
          window as any
        ).Microsoft.ProductivityMacros.runMacro("OpenAccountGrid");
        return ctrl;
      });
      expect(result).toBe(Constants.ActionPerformedSuccessfully);
      //Check API result on UI
      const accountsLoadResult = await macrosAdminPage.verifyOpenedTab(
        agentPage,
        Constants.AccountsMyActiveAccountsTab
      );
      expect(accountsLoadResult).toBeTruthy();
      //End live chat
      //await macrosAdminPage.closeConversation(agentPage, agentChat);
      await agentChat.closeUnusedChat();
      await liveChatPage.closeChat();
    } finally {
      await macrosAdminPage.deleteMacro(
        adminStartPage,
        Constants.OpenAccountGrid
      );
    }
  });

  ///<summary>
  ///Test Case 1580626: Verify DoRelevanceSearch macro action
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_testPlans/execute?planId=2509247&opId=3586&suiteId=2509251
  ///</summary>
  it.skip("Test Case 1580626: Verify DoRelevanceSearch macro action", async () => {
    agentPage = await agentContext.newPage();
    const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
    liveChatPage = new LiveChatPage(await liveChatContext.newPage());
    const agentChat = new AgentChat(agentPage);
    try {
      //Login as admin and create macro
      await adminStartPage.navigateToOrgUrlAndSignIn(
        TestSettings.AdminAccountEmail,
        TestSettings.AdminAccountPassword
      );
      await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
      await macrosAdminPage.createMacro(Constants.DoRelevanceSearch);
      //Initiate live chat with agent
      await macrosAdminPage.initiateLiveChatWithMacroAgent(liveChatPage);
      //Login as agent and accept chat
      await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(
        TestSettings.AdminAccountEmail,
        agentStartPage,
        agentChat
      );
      await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);
      //Check API response through console
      const result = await agentPage.evaluate(async () => {
        const ctrl = await (
          window as any
        ).Microsoft.ProductivityMacros.runMacro("DoRelevanceSearch");
        return ctrl;
      });
      expect(result).toBe(Constants.ActionPerformedSuccessfully);
      //Check API result on UI
      const relevenceSearchResult = await macrosAdminPage.verifyOpenedTab(
        agentPage,
        Constants.SearchTab
      );
      expect(relevenceSearchResult).toBeTruthy();
      //End live chat
      //await macrosAdminPage.closeConversation(agentPage, agentChat);
      await agentChat.closeUnusedChat();
      await liveChatPage.closeChat();
    } finally {
      await macrosAdminPage.deleteMacro(
        adminStartPage,
        Constants.DoRelevanceSearch
      );
    }
  });

  ///<summary>
  ///Test Case 1580630: Verify ResolveCase macro action
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_testPlans/execute?planId=2509247&opId=3586&suiteId=2509251
  ///</summary>
  it.skip("Test Case 1580630: Verify ResolveCase macro action", async () => {
    agentPage = await agentContext.newPage();
    const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
    liveChatPage = new LiveChatPage(await liveChatContext.newPage());
    const agentChat = new AgentChat(agentPage);
    try {
      //Login as admin and create macro
      await adminStartPage.navigateToOrgUrlAndSignIn(
        TestSettings.AdminAccountEmail,
        TestSettings.AdminAccountPassword
      );
      await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
      const incidentId = await macrosAdminPage.createCaseAndGetIncidentId();
      await macrosAdminPage.openAppLandingPage(adminPage);
      await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
      await macrosAdminPage.createMacro(Constants.ResolveCase, incidentId);
      //Initiate live chat with agent
      await macrosAdminPage.initiateLiveChatWithMacroAgent(liveChatPage);
      //Login as agent and accept chat
      await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(
        TestSettings.AdminAccountEmail,
        agentStartPage,
        agentChat
      );
      await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);
      //Check API response through console
      const result = await agentPage.evaluate(async () => {
        const ctrl = await (
          window as any
        ).Microsoft.ProductivityMacros.runMacro("ResolveCase");
        return ctrl;
      });
      expect(result).toBe(Constants.ActionPerformedSuccessfully);
      //Check API result on UI
      const resolveCaseResult = await macrosAdminPage.verifyResolveCase(
        adminPage,
        adminStartPage
      );
      expect(resolveCaseResult).toBeTruthy();
      //End live chat
      //await macrosAdminPage.closeConversation(agentPage, agentChat);
      await agentChat.closeUnusedChat();
      await liveChatPage.closeChat();
    } finally {
      await macrosAdminPage.deleteCase(
        adminPage,
        adminStartPage,
        Constants.AutomationCaseTitle
      );
      await macrosAdminPage.deleteMacro(adminStartPage, Constants.ResolveCase);
    }
  });

  ///<summary>
  ///Test Case 1580680: verify update an existing record macro action
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_testPlans/execute?planId=2509247&opId=3586&suiteId=2509251
  ///</summary>
  it.skip("Test Case 1580680: verify update an existing record macro action", async () => {
    agentPage = await agentContext.newPage();
    const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
    liveChatPage = new LiveChatPage(await liveChatContext.newPage());
    const agentChat = new AgentChat(agentPage);
    try {
      //Login as admin and create macro
      await adminStartPage.navigateToOrgUrlAndSignIn(
        TestSettings.AdminAccountEmail,
        TestSettings.AdminAccountPassword
      );
      await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
      const incidentId = await macrosAdminPage.createCaseAndGetIncidentId();
      await macrosAdminPage.openAppLandingPage(adminPage);
      await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
      await macrosAdminPage.createMacro(Constants.UpdateAccount, incidentId);
      //Initiate live chat with agent
      await macrosAdminPage.initiateLiveChatWithMacroAgent(liveChatPage);
      //Login as agent and accept chat
      await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(
        TestSettings.AdminAccountEmail,
        agentStartPage,
        agentChat
      );
      await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);
      //Check API response through console
      const result = await agentPage.evaluate(async () => {
        const ctrl = await (
          window as any
        ).Microsoft.ProductivityMacros.runMacro("UpdateAccount");
        return ctrl;
      });
      expect(result).toBe(Constants.ActionPerformedSuccessfully);
      //Check API result on UI
      const updateAccountResult = await macrosAdminPage.verifyUpdateAccount(
        adminPage,
        adminStartPage,
        Constants.AutomationCaseTitle
      );
      expect(updateAccountResult).toBeTruthy();
      //End live chat
      //await macrosAdminPage.closeConversation(agentPage, agentChat);
      await agentChat.closeUnusedChat();
      await liveChatPage.closeChat();
    } finally {
      await macrosAdminPage.deleteCase(
        adminPage,
        adminStartPage,
        Constants.AutomationCaseTitle
      );
      await macrosAdminPage.deleteMacro(
        adminStartPage,
        Constants.UpdateAccount
      );
    }
  });

  ///<summary>
  ///Test Case 1717129: Verify Admin can disable/deactivate an existing macros
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_testPlans/execute?planId=2532163&opId=3593&suiteId=2532167
  ///</summary>
  it("Test Case 1717129: Verify Admin can disable/deactivate an existing macros", async () => {
    try {
      //Login as admin and create & deactivate macro
      await adminStartPage.navigateToOrgUrlAndSignIn(
        TestSettings.AdminAccountEmail,
        TestSettings.AdminAccountPassword
      );
      await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
      await macrosAdminPage.createMacro(Constants.OpenKBSearch);
      await macrosAdminPage.deactivateMacro(Constants.OpenKBSearch);
      //Check if macro deactivated
      const deactivateMacroResult =
        await macrosAdminPage.verifyMacroDeactivated(
          adminStartPage,
          Constants.OpenKBSearch
        );
      expect(deactivateMacroResult).toBeTruthy();
    } finally {
      await macrosAdminPage.deleteMacro(adminStartPage, Constants.OpenKBSearch);
    }
  });

  ///<summary>
  ///Test Case 2662215: Verify tab info from Context post Refresh Session Context Macro Action.
  ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2662215
  ///<summary>
  it.skip("Test Case 2662215: Verify tab info from Context post Refresh Session Context Macro Action.", async () => {
    agentPage = await agentContext.newPage();
    liveChatPage = new LiveChatPage(await liveChatContext.newPage());
    try {
      // Login As Admin and create macro
      await adminStartPage.navigateToOrgUrlAndSignIn(
        TestSettings.AdminAccountEmail,
        TestSettings.AdminAccountPassword
      );
      await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
      await macrosAdminPage.createResolveSessionMacro(
        Constants.RefreshSessionContextTitle,
        Constants.IncidentID
      );
      // Create AgentScript and Add Macro to it's agentScript step
      await macrosAdminPage.AgentScriptInCSAdminCenter(
        Constants.AgentScriptName,
        Constants.AgentScriptUniqueName
      );
      await macrosAdminPage.AgentScriptStep(
        Constants.AgentScriptStepName2,
        Constants.AgentscriptUniquename,
        Constants.RefreshSessionContextTitle
      );
      // Create Session and Add agentscript to it
      await macrosAdminPage.SessionInCSAdminCenter(
        Constants.SessionTemplateName,
        Constants.SessionTemplateUniqueName
      );
      await macrosAdminPage.AddAgentScriptToSession(Constants.AgentScriptName);
      // Create AppProfile and Add user,session and enable PT
      await macrosAdminPage.createAppProfile();
      await macrosAdminPage.AddUsers(Constants.CRMUser);
      await macrosAdminPage.AddSessionToProfile(Constants.SessionNameType);
      await macrosAdminPage.EnableProductivityPane();
      // Navigate to CSH and create Cases
      await macrosAdminPage.openAppLandingPage(adminPage);
      await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
      await macrosAdminPage.createCase(Constants.CaseTitleName);
      await macrosAdminPage.createCase(Constants.CaseTitleName2);
      // Navigate to CSW, initiate session, run macro and validate it.
      await macrosAdminPage.openAppLandingPage(adminPage);
      await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
      await macrosAdminPage.GoToCases();
      await macrosAdminPage.InitiateSession(
        Constants.CaseTitleName,
        Constants.CaseLink1
      );
      await macrosAdminPage.ClickProductivityPaneTool(Constants.AStool);
      await macrosAdminPage.RunMacro();
      await macrosAdminPage.ValidateThePage(Constants.ResolveStatemant);
      await macrosAdminPage.GoToCases();
      await macrosAdminPage.InitiateSession(
        Constants.CaseTitleName2,
        Constants.CaseLink2
      );
      await macrosAdminPage.RunMacro();
      await macrosAdminPage.ValidateThePage(Constants.ResolveStatemant);
    } finally {
      await adminPage.reload();
      await macrosAdminPage.DeleteSession(
        adminPage,
        adminStartPage,
        Constants.SessionTemplateName
      );
      await macrosAdminPage.DeleteAppProfile(
        adminPage,
        adminStartPage,
        Constants.Name
      );
    }
  });

  ///<summary>
  ///Test Case 2464821: Open Dashboard Application tab using Macro.
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2464821
  ///</summary>
  it.skip("Test Case 2464821: Open Dashboard Application tab using Macros.", async () => {
    agentPage = await agentContext.newPage();
    liveChatPage = new LiveChatPage(await liveChatContext.newPage());
    try {
      //Login as admin and create macro
      await adminStartPage.navigateToOrgUrlAndSignIn(
        TestSettings.AdminAccountEmail,
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
      await macrosAdminPage.createAgentScript(
        Constants.DashboardAgentScriptName,
        Constants.TitleUniqueName,
        Constants.DashboardMacroName
      );
      await macrosAdminPage.addAgentScripttoDefaultChatSessionWithParameter(
        Constants.DashboardAgentScriptName
      );
      //Run Macro
      await macrosAdminPage.openAppLandingPage(adminPage);
      await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
      await macrosAdminPage.CreateCaseInCSW(Constants.CaseTitleName);
      await macrosAdminPage.InitiateSession(
        Constants.CaseTitleName,
        Constants.CaseLink1
      );
      const runValidateDashboardMacro =
        await macrosAdminPage.runMacroInSessionAndValidate(
          Constants.DashboardAgentScriptName,
          Constants.DashboardTitle
        );
      expect(runValidateDashboardMacro).toBeTruthy();
    } finally {
      await macrosAdminPage.deleteAgentScriptnNew(
        adminPage,
        adminStartPage,
        Constants.DashboardAgentScriptName
      );
      await macrosAdminPage.deleteApplicationTabusingOmnichannelAdminCenter(
        Constants.DashboardApplicationTab
      );
      await macrosAdminPage.deleteMacroFromOmnichannelAdminCenterApp(
        Constants.DashboardMacroName
      );
      await macrosAdminPage.removeAgentScripttoDefaultCaseSession();
    }
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
    liveChatPage = new LiveChatPage(await liveChatContext.newPage());
    try {
      //Login as admin and create macro
      await adminStartPage.navigateToOrgUrlAndSignIn(
        TestSettings.AdminAccountEmail,
        TestSettings.AdminAccountPassword
      );
      await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
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
      await macrosAdminPage.createAgentScript(
        Constants.ThirdPartyWebsiteAgentScriptName,
        Constants.TitleUniqueName,
        Constants.ThirdPartyWebsiteMacroName
      );
      await macrosAdminPage.addAgentScripttoDefaultChatSessionWithParameter(
        Constants.ThirdPartyWebsiteAgentScriptName
      );
      //Run Macro
      await macrosAdminPage.openAppLandingPage(adminPage);
      await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
      await macrosAdminPage.CreateCaseInCSW(Constants.CaseTitleName);
      await macrosAdminPage.InitiateSession(
        Constants.CaseTitleName,
        Constants.CaseLink1
      );
      const runValidateTPWMacro =
        await macrosAdminPage.runMacroInSessionAndValidate(
          Constants.ThirdPartyWebsiteAgentScriptName,
          Constants.ThirdPartyWebsiteTitle
        );
      expect(runValidateTPWMacro).toBeTruthy();
    } finally {
      await macrosAdminPage.deleteAgentScriptnNew(
        adminPage,
        adminStartPage,
        Constants.ThirdPartyWebsiteAgentScriptName
      );
      await macrosAdminPage.deleteApplicationTabusingOmnichannelAdminCenter(
        Constants.ThirdPartyWebsiteApplicationTab
      );
      await macrosAdminPage.deleteMacroFromOmnichannelAdminCenterApp(
        Constants.ThirdPartyWebsiteMacroName
      );
      await macrosAdminPage.removeAgentScripttoDefaultCaseSession();
    }
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
    //Login as admin and create cases
    await agentChat.navigateToOrgUrlAndSignIn(
      TestSettings.MacroAccountEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdmincenter);
    const urlId = await macrosAdminPage.createApplicationTabAndGetId(
      Constants.WebResourceApplicationTab,
      Constants.WebResourceApplicationTabUniqueName,
      Constants.WebResourceOptionValue
    );
    await macrosAdminPage.createMacro(Constants.WebResourceMacroName, urlId);
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
      Constants.TitleUniqueName + rnd,
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
    await adminStartPage.goToCustomerServiceWorkspace();
    await adminStartPage.waitForDomContentLoaded();
    const caseTitle = await macrosAdminPage.createCaseWithAPI(
      Constants.CaseTitleName
    );
    await macrosAdminPage.InitiateSession(
      caseTitle,
      Constants.LinkStart + caseTitle + Constants.LinkEnd
    );
    const runValidateWebResourceMacro =
      await macrosAdminPage.runMacroInSessionAndValidate(
        Constants.WebResourceAgentScriptName,
        Constants.WebResourceTitle
      );
    expect(runValidateWebResourceMacro).toBeTruthy();
    // await macrosAdminPage.deletAgentScriptStepByXRM(
    //   agentChat,
    //   EntityNames.AgentScriptStep,
    //   agentScriptStep.id
    // );
    // await macrosAdminPage.deleteAgentScriptByXRM(
    //   agentChat,
    //   EntityNames.AgentScript,
    //   agentScript.id
    // );
    // await agentChat.deleteRecordbyXRM(EntityNames.Macros, workflowID);
  });

  ///<summary>
  ///Test Case 2453339: Open Entity Record Application tab using Macro.
  ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_testPlans/execute?planId=2606066&opId=3617&suiteId=2606071
  ///</summary>
  it.skip("Test Case 2453339: Open Entity Record Application tab using Macros", async () => {
    agentPage = await agentContext.newPage();
    const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
    liveChatPage = new LiveChatPage(await liveChatContext.newPage());
    const agentChat = new AgentChat(agentPage);
    const agentScriptAdminPage = new AgentScript(adminPage);
    try {
      await adminStartPage.navigateToOrgUrlAndSignIn(
        TestSettings.AdminAccountEmail,
        TestSettings.AdminAccountPassword
      );
      await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
      const urlId = await macrosAdminPage.createApplicationTabAndGetId(
        Constants.EntityRecordApplicationTab,
        Constants.EntityRecordApplicationTabUniqueName,
        Constants.EntityRecordOptionValue
      );
      await macrosAdminPage.createMacroFromOmnichannelAdminCenterApp(
        Constants.EntityRecordMacro,
        urlId
      );
      await macrosAdminPage.createAgentScript(
        Constants.AgentScriptName,
        Constants.TitleUniqueName,
        Constants.EntityRecordMacro
      );
      await macrosAdminPage.addAgentScripttoDefaultChatSession();
      //Login as agent and accept chat
      await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(
        TestSettings.AdminAccountEmail,
        agentStartPage,
        agentChat
      );
      await macrosAdminPage.initiateLiveChatWithMacroAgent(liveChatPage);
      await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);
      //Validating The Title of Application Tab by running the Macro
      const EntityRecordUsingMacro = await macrosAdminPage.runMacroAndValidate(
        agentPage,
        Constants.EntityRecordTabTitle
      );
      expect(EntityRecordUsingMacro).toBeTruthy();
      //Closing Chat
      await agentChat.closeUnusedChat();
      await liveChatPage.closeChat();
      //Updating The Title of Existing and Inserting Entity Name in Entity Record Application Tab
      await macrosAdminPage.openAppLandingPage(adminPage);
      await adminStartPage.goToMyApp(Constants.OmnichannelAdminCenterApp);
      await macrosAdminPage.updateTitleOfApplicationTab(
        Constants.ChangeEntityRecorditleTab,
        Constants.EntityRecordTabTitleSelect,
        Constants.EntityRecordTabTitleSelect1,
        Constants.EntityRecordApplicationTab
      );
      await macrosAdminPage.insertEntityRecordParameters();
      //Login as agent and accept chat
      await macrosAdminPage.openOmnichannelForCS(
        agentStartPage,
        agentPage,
        agentChat
      );
      await macrosAdminPage.initiateLiveChatWithMacroAgent(liveChatPage);
      await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);
      //Validating The Changed Title of Application Tab by running the Macro
      const EntityRecordUsingMacroRechecking =
        await macrosAdminPage.runMacroAndValidate(
          agentPage,
          Constants.ChangeEntityRecordTab
        );
      expect(EntityRecordUsingMacroRechecking).toBeTruthy();
      //Closing Chat
      await agentChat.closeUnusedChat();
      await liveChatPage.closeChat();
      //Inserting Macro Parameter
      await macrosAdminPage.insertMacroParameter(
        Constants.EntityRecordMacroSearch,
        Constants.EntityRecordMacroSearch1,
        Constants.EntityRecordMacro,
        Constants.EntityName,
        Constants.EntityLogicalNameIncident
      );
      //Login as agent and accept chat
      await macrosAdminPage.openOmnichannelForCS(
        agentStartPage,
        agentPage,
        agentChat
      );
      await macrosAdminPage.initiateLiveChatWithMacroAgent(liveChatPage);
      await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);
      //Validating The Changed Title of Application Tab by running the Macro
      const entityRecordUsingMacroRechecking =
        await macrosAdminPage.runMacroAndValidate(
          agentPage,
          Constants.ChangeEntityRecordTab
        );
      expect(entityRecordUsingMacroRechecking).toBeTruthy();
      //Closing Chat
      await agentChat.closeUnusedChat();
      await liveChatPage.closeChat();
    } finally {
      await macrosAdminPage.deleteAgentScript(Constants.AgentScriptName);
      await macrosAdminPage.deleteApplicationTabusingOmnichannelAdminCenter(
        Constants.EntityRecordApplicationTab
      );
      await macrosAdminPage.deleteMacroFromOmnichannelAdminCenterApp(
        Constants.EntityRecordMacro
      );
    }
  });

  ///<summary>
  /// Test Case 1760322: [Macros] Verify KB article is opening at agent side when using 'Open Knowledgebase article' in macro
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1760322
  ///</summary>
  it.skip("Test Case 1760322: [Macros] Verify KB article is opening at agent side when using 'Open Knowledgebase article' in macro", async () => {
    agentPage = await agentContext.newPage();
    const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
    liveChatPage = new LiveChatPage(await liveChatContext.newPage());
    const agentChat = new AgentChat(agentPage);
    try {
      //Login as admin and create macro
      await adminStartPage.navigateToOrgUrlAndSignIn(
        TestSettings.AdminAccountEmail,
        TestSettings.AdminAccountPassword
      );
      await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
      const kbArticleId = await macrosAdminPage.createKbArticleAndGetId();
      await macrosAdminPage.openAppLandingPage(adminPage);
      await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
      await macrosAdminPage.createMacro(Constants.OpenKbArticle, kbArticleId);
      //Initiate live chat with agent
      await macrosAdminPage.initiateLiveChatWithMacroAgent(liveChatPage);
      //Login as agent and accept chat
      await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(
        TestSettings.AdminAccountEmail,
        agentStartPage,
        agentChat
      );
      await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);
      //Check API response through console
      const result = await agentPage.evaluate(async () => {
        const ctrl = await (
          window as any
        ).Microsoft.ProductivityMacros.runMacro("OpenKbArticle");
        return ctrl;
      });
      expect(result).toBe(Constants.ActionPerformedSuccessfully);
      //Check API result on UI
      const OpenedKbArticleVerification = await macrosAdminPage.verifyOpenedTab(
        agentPage,
        Constants.OpenedKnowledgeTab
      );
      expect(OpenedKbArticleVerification).toBeTruthy();
      //End live chat
      await agentChat.closeUnusedChat();
      await liveChatPage.closeChat();
    } finally {
      await macrosAdminPage.deleteKbArticle(
        adminPage,
        adminStartPage,
        Constants.KnowledgeArticleTitle
      );
      await macrosAdminPage.deleteMacro(
        adminStartPage,
        Constants.OpenKbArticle
      );
    }
  });

  ///Test Case 1805118: [Macros] Verify entity view application template is opened in new tab using 'Open application tab' action in macros
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1805118
  ///</summary>
  it("Test Case 1805118: [Macros] Verify entity view application template is opened in new tab using 'Open application tab' action in macros", async () => {
    agentPage = await agentContext.newPage();
    liveChatPage = new LiveChatPage(await liveChatContext.newPage());
    try {
      //Login as admin and create macro
      await adminStartPage.navigateToOrgUrlAndSignIn(
        TestSettings.AdminAccountEmail,
        TestSettings.AdminAccountPassword
      );
      await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
      const applicationTabId =
        await macrosAdminPage.createApplicationTabAndGetId(
          Constants.EntitySearchApplicationTab,
          Constants.EntitySearchApplicationTabUniqueName,
          Constants.EntitySearchOptionValue
        );
      await macrosAdminPage.createMacro(
        Constants.EntitySearchMacroName,
        applicationTabId
      );
      await macrosAdminPage.createAgentScript(
        Constants.EntitySearchAgentScriptName,
        Constants.TitleUniqueName,
        Constants.EntitySearchMacroName
      );
      await macrosAdminPage.addAgentScripttoDefaultChatSessionWithParameter(
        Constants.EntitySearchAgentScriptName
      );
      //Run Macro
      await macrosAdminPage.openAppLandingPage(adminPage);
      await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
      await macrosAdminPage.CreateCaseInCSW(Constants.CaseTitleName);
      await macrosAdminPage.InitiateSession(
        Constants.CaseTitleName,
        Constants.CaseLink1
      );
      const openEntityRecordTabUsingMacro =
        await macrosAdminPage.runMacroInSessionAndValidate(
          Constants.EntitySearchAgentScriptName,
          Constants.EntitySearchTitle
        );
      expect(openEntityRecordTabUsingMacro).toBeTruthy();
    } finally {
      await macrosAdminPage.deleteAgentScriptnNew(
        adminPage,
        adminStartPage,
        Constants.EntitySearchAgentScriptName
      );
      await macrosAdminPage.deleteApplicationTabusingOmnichannelAdminCenter(
        Constants.EntitySearchApplicationTab
      );
      await macrosAdminPage.deleteMacroFromOmnichannelAdminCenterApp(
        Constants.EntitySearchMacroName
      );
      await macrosAdminPage.removeAgentScripttoDefaultCaseSession();
    }
  });

  ///<summary>
  ///Test Case 2366983: [Macros] Verify can search the knowledge base for the populated phrase by using 'Search the knowledge base for the populated phrase' action in the Productivity Automation.
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2366983
  ///</summary>
  it.skip("Test Case 2366983: [Macros] Verify can search the knowledge base for the populated phrase by using 'Search the knowledge base for the populated phrase' action in the Productivity Automation.", async () => {
    agentPage = await agentContext.newPage();
    const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
    liveChatPage = new LiveChatPage(await liveChatContext.newPage());
    const agentChat = new AgentChat(agentPage);
    try {
      //Login as admin and create macro
      await adminStartPage.navigateToOrgUrlAndSignIn(
        TestSettings.AdminAccountEmail,
        TestSettings.AdminAccountPassword
      );
      await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
      await macrosAdminPage.createMacro(
        Constants.SearchPhraseForPopulatedPhrase
      );
      //Initiate live chat with agent
      await macrosAdminPage.initiateLiveChatWithMacroAgent(liveChatPage);
      //Login as agent and accept chat
      await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(
        TestSettings.AdminAccountEmail,
        agentStartPage,
        agentChat
      );
      await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);
      //Check API response through console
      const result = await agentPage.evaluate(async () => {
        const ctrl = await (
          window as any
        ).Microsoft.ProductivityMacros.runMacro(
          "SearchPhraseForPopulatedPhrase"
        );
        return ctrl;
      });
      expect(result).toBe(Constants.ActionPerformedSuccessfully);
      //Check API result on UI
      const searchPhrasePopulatedResult = await macrosAdminPage.verifyOpenedTab(
        agentPage,
        Constants.SearchPhraseTabName
      );
      expect(searchPhrasePopulatedResult).toBeTruthy();
      //End live chat
      await agentChat.closeUnusedChat();
      await liveChatPage.closeChat();
    } finally {
      await macrosAdminPage.deleteMacro(
        adminStartPage,
        Constants.SearchPhraseForPopulatedPhrase
      );
    }
  });

  ///<summary>
  ///Test Case 2313868: [Macros] Verify tab is refreshed using 'Refresh the tab' action in the macros.
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2313868
  ///</summary>
  it.skip("Test Case 2313868: [Macros] Verify tab is refreshed using 'Refresh the tab' action in the macros.", async () => {
    agentPage = await agentContext.newPage();
    const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
    liveChatPage = new LiveChatPage(await liveChatContext.newPage());
    const agentChat = new AgentChat(agentPage);
    try {
      //Login as admin and create macro
      await adminStartPage.navigateToOrgUrlAndSignIn(
        TestSettings.AdminAccountEmail,
        TestSettings.AdminAccountPassword
      );
      await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
      await macrosAdminPage.createMacro(Constants.OpenRefreshTab);
      //Initiate live chat with agent
      await macrosAdminPage.initiateLiveChatWithMacroAgent(liveChatPage);
      //Login as agent and accept chat
      await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(
        TestSettings.AdminAccountEmail,
        agentStartPage,
        agentChat
      );
      await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);
      //Check API response through console
      const result = await agentPage.evaluate(async () => {
        const ctrl = await (
          window as any
        ).Microsoft.ProductivityMacros.runMacro("RefreshTabMacro");
        return ctrl;
      });
      expect(result).toBe(Constants.ActionPerformedSuccessfully);
      //End live chat
      await agentChat.closeUnusedChat();
      await liveChatPage.closeChat();
    } finally {
      await macrosAdminPage.deleteMacro(
        adminStartPage,
        Constants.OpenRefreshTab
      );
    }
  });

  ///<summary>
  ///Test Case 2253513: [Macros] Verify dashboard application template is opened in new tab using 'Open application tab' action in macros
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2253513
  ///</summary>

  // same testcase is available in macrolivechat.spec.ts- that is fixed and working fine.so we skipped
  it.skip("Test Case 2253513: [Macros] Verify dashboard application template is opened in new tab using 'Open application tab' action in macros", async () => {
    agentPage = await agentContext.newPage();
    liveChatPage = new LiveChatPage(await liveChatContext.newPage());
    try {
      //Login as 'Admin automated' and redirected to OrgUrl
      await adminStartPage.navigateToOrgUrlAndSignIn(
        TestSettings.AdminAccountEmail,
        TestSettings.AdminAccountPassword
      );
      await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
      const urlId = await macrosAdminPage.createApplicationTabAndGetId(
        Constants.DashboardName,
        Constants.DashboardUniqueName,
        Constants.DashboardOptionValue
      );
      await macrosAdminPage.createMacroFromOmnichannelAdminCenterApp(
        Constants.DashboardMacro,
        urlId
      );
      await macrosAdminPage.createAgentScript(
        Constants.DascboardAgentScriptName,
        Constants.TitleUniqueName,
        Constants.DashboardMacro
      );
      await macrosAdminPage.addAgentScripttoDefaultChatSession();
      //Run Macro
      await macrosAdminPage.openAppLandingPage(adminPage);
      await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
      await macrosAdminPage.createCase(Constants.CaseTitleName);
      await macrosAdminPage.InitiateSession(
        Constants.CaseTitleName,
        Constants.CaseLink1
      );
      const openEntityRecordTabUsingMacro =
        await macrosAdminPage.runMacroInSessionAndValidate(
          Constants.DascboardAgentScriptName,
          Constants.DashboardTitle
        );
      expect(openEntityRecordTabUsingMacro).toBeTruthy();
    } finally {
      await macrosAdminPage.removeSlugFromAgentScript(
        Constants.AgentScriptName,
        Constants.AgentScriptLink
      );
      await macrosAdminPage.deleteAgentScript(Constants.AgentScriptName);
      await macrosAdminPage.deleteApplicationTabusingOmnichannelAdminCenter(
        Constants.DashboardName
      );
      await macrosAdminPage.deleteMacroFromOmnichannelAdminCenterApp(
        Constants.DashboardMacro
      );
    }
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
  ///Test Case 2366971: [Macros] Verify existing record is opened  using 'Open an existing record' action in the Productivity Automation.
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2366971
  ///</summary>
  it("Test Case 2366971: [Macros] Verify existing record is opened using 'Open an existing record' action in the Productivity Automation.", async () => {
    agentPage = await agentContext.newPage();
    rnd = agentScriptAdminPage.RandomNumber();
    //Login as admin and create cases
    await agentChat.navigateToOrgUrlAndSignIn(
      TestSettings.MacroAccountEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
    const accountId = await macrosAdminPage.createAccountAndGetId(
      Constants.AccountName + rnd
    );
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    await macrosAdminPage.createMacro(Constants.ExistingRecordMacroName, accountId);
    const workflowID = await macrosAdminPage.getLatestMacro(
      agentChat,
      Constants.ExistingRecordMacroName
    );
    const agentScript = await agentChat.createAgentScriptbyXRMAPI(
      Constants.ExistingRecordAgentScriptName,
      Constants.TitleUniqueName + rnd
    );
    const agentScriptStep = await agentChat.createAgentScriptStepbyXRMAPI(
      Constants.ExistingRecordAgentScriptName,
      Constants.TitleUniqueName + rnd,
      Constants.AgentscriptStepOrder,
      Constants.MacroAgentScriptStep,
      agentScript.id,
      Constants.ExistingRecordMacroName,
      workflowID
    );
    await macrosAdminPage.OpenAgentScriptandSave(
      Constants.ExistingRecordAgentScriptName
    );
    await macrosAdminPage.addAgentScripttoDefaultChatSessionWithParameter(
      Constants.ExistingRecordAgentScriptName
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
    const runValidateExistingRecordMacro =
      await macrosAdminPage.runMacroInSessionAndValidate(
        Constants.ExistingRecordAgentScriptName,
        Constants.ExistingRecordTitle
      );
    expect(runValidateExistingRecordMacro).toBeTruthy();
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
});
