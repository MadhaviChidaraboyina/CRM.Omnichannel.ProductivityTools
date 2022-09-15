import { AgentChat } from "../../../pages/AgentChat";
import { BrowserContext, Page } from "playwright";
import { Constants } from "../../common/constants";
import { LiveChatPage } from "../../../pages/LiveChat";
import { Macros } from "../../macropages/macrosAdmin";
import { OrgDynamicsCrmStartPage } from "../../../pages/org-dynamics-crm-start.page";
import { TestHelper } from "../../../helpers/test-helper";
import { TestSettings } from "../../../configuration/test-settings";
import { AgentScript } from "../../agentScript/pages/agentScriptAdmin";

describe("Macro testcases - ", () => {
  let adminContext: BrowserContext;
  let adminPage: Page;
  let adminStartPage: OrgDynamicsCrmStartPage;
  let agentPage: Page;
  let agentContext: BrowserContext;
  let liveChatContext: BrowserContext;
  let liveChatPage: LiveChatPage;
  let macrosAdminPage: Macros;

  beforeEach(async () => {
    adminContext = await browser.newContext({
      viewport: TestSettings.Viewport,
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
    liveChatPage = new LiveChatPage(await liveChatContext.newPage());
    try {
      //Login as admin and create macro
      await adminStartPage.navigateToOrgUrlAndSignIn(
        TestSettings.AdminAccountEmail,
        TestSettings.AdminAccountPassword
      );
      await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
      await macrosAdminPage.createMacro(Constants.AutoFillMacroName);
      await macrosAdminPage.createAgentScript(
        Constants.AutoFillAgentScriptName,
        Constants.TitleUniqueName,
        Constants.AutoFillMacroName
      );
      await macrosAdminPage.addAgentScripttoDefaultChatSessionWithParameter(
        Constants.AutoFillAgentScriptName
      );
      //Run Macro
      await macrosAdminPage.openAppLandingPage(adminPage);
      await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
      await macrosAdminPage.CreateCaseInCSW(Constants.CaseTitleName);
      await macrosAdminPage.InitiateSession(
        Constants.CaseTitleName,
        Constants.CaseLink1
      );
      const runValidateAutoFillMacro =
        await macrosAdminPage.runMacroInSessionAndValidate(
          Constants.AutoFillAgentScriptName,
          Constants.AutoFillTitle
        );
      expect(runValidateAutoFillMacro).toBeTruthy();
    } finally {
      await macrosAdminPage.deleteAgentScriptnNew(
        adminPage,
        adminStartPage,
        Constants.AutoFillAgentScriptName
      );
      await macrosAdminPage.deleteMacroFromOmnichannelAdminCenterApp(
        Constants.AutoFillMacroName
      );
      await macrosAdminPage.removeAgentScripttoDefaultCaseSession();
    }
  });

  ///<summary>
  ///Test Case 2253509: [Macros] Verify custom control application template is opened in new tab using 'Open application tab' action in macros
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2253509
  ///</summary>
  it("Test Case 2253509: [Macros] Verify custom control application template is opened in new tab using 'Open application tab' action in macros", async () => {
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
          Constants.ControlApplicationTab,
          Constants.ControlApplicationTabUniqueName,
          Constants.ControlOptionValue
        );
      await macrosAdminPage.createMacro(
        Constants.ControlMacroName,
        applicationTabId
      );
      await macrosAdminPage.createAgentScript(
        Constants.ControlAgentScriptName,
        Constants.TitleUniqueName,
        Constants.ControlMacroName
      );
      await macrosAdminPage.addAgentScripttoDefaultChatSessionWithParameter(
        Constants.ControlAgentScriptName
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
          Constants.ControlAgentScriptName,
          Constants.ControlTitle
        );
      expect(openEntityRecordTabUsingMacro).toBeTruthy();
    } finally {
      await macrosAdminPage.deleteAgentScriptnNew(
        adminPage,
        adminStartPage,
        Constants.ControlAgentScriptName
      );
      await macrosAdminPage.deleteApplicationTabusingOmnichannelAdminCenter(
        Constants.ControlApplicationTab
      );
      await macrosAdminPage.deleteMacroFromOmnichannelAdminCenterApp(
        Constants.ControlMacroName
      );
      await macrosAdminPage.removeAgentScripttoDefaultCaseSession();
    }
  });

  ///<summary>
  ///Test Case 2253531: [Macros] Verify third party website application template is opened in new tab using 'Open application tab' action in macros
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2253531
  ///</summary>
  it("Test Case 2253531: [Macros] Verify third party website application template is opened in new tab using 'Open application tab' action in macros", async () => {
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
      await macrosAdminPage.createMacro(
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
      const openEntityRecordTabUsingMacro =
        await macrosAdminPage.runMacroInSessionAndValidate(
          Constants.ThirdPartyWebsiteAgentScriptName,
          Constants.ThirdPartyWebsiteTitle
        );
      expect(openEntityRecordTabUsingMacro).toBeTruthy();
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
  ///TC 1586360 - Create and runmacro opennewform end to end testing scenario create and run macro end to end testing scenario
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1586360
  ///</summary>
  it("Test Case 1586360: Create and runmacro opennewform end to end testing scenario", async () => {
    agentPage = await agentContext.newPage();
    liveChatPage = new LiveChatPage(await liveChatContext.newPage());
    try {
      //Login as admin and create macro
      await adminStartPage.navigateToOrgUrlAndSignIn(
        TestSettings.AdminAccountEmail,
        TestSettings.AdminAccountPassword
      );
      await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
      await macrosAdminPage.createMacro(Constants.OpenNewFormMacroName);
      await macrosAdminPage.createAgentScript(
        Constants.OpenNewFormAgentScriptName,
        Constants.TitleUniqueName,
        Constants.OpenNewFormMacroName
      );
      await macrosAdminPage.addAgentScripttoDefaultChatSessionWithParameter(
        Constants.OpenNewFormAgentScriptName
      );
      //Run Macro
      await macrosAdminPage.openAppLandingPage(adminPage);
      await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
      await macrosAdminPage.CreateCaseInCSW(Constants.CaseTitleName);
      await macrosAdminPage.InitiateSession(
        Constants.CaseTitleName,
        Constants.CaseLink1
      );
      const runValidateNewFormMacro =
        await macrosAdminPage.runMacroInSessionAndValidate(
          Constants.OpenNewFormAgentScriptName,
          Constants.OpenNewFormTitle
        );
      expect(runValidateNewFormMacro).toBeTruthy();
    } finally {
      await macrosAdminPage.deleteAgentScriptnNew(
        adminPage,
        adminStartPage,
        Constants.OpenNewFormAgentScriptName
      );
      await macrosAdminPage.deleteMacroFromOmnichannelAdminCenterApp(
        Constants.OpenNewFormMacroName
      );
      await macrosAdminPage.removeAgentScripttoDefaultCaseSession();
    }
  });

  ///<summary>
  ///Test Case 1588015: Create and runmacro openkbsearch end to end testing scenario
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1588015
  ///</summary>
  it("Test Case 1588015: Create and runmacro openkbsearch end to end testing scenario", async () => {
    agentPage = await agentContext.newPage();
    liveChatPage = new LiveChatPage(await liveChatContext.newPage());
    try {
      //Login as admin and create macro
      await adminStartPage.navigateToOrgUrlAndSignIn(
        TestSettings.AdminAccountEmail,
        TestSettings.AdminAccountPassword
      );
      await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
      await macrosAdminPage.createMacro(Constants.OpenKBSearchMacroName);
      await macrosAdminPage.createAgentScript(
        Constants.OpenKBSearchAgentScriptName,
        Constants.TitleUniqueName,
        Constants.OpenKBSearchMacroName
      );
      await macrosAdminPage.addAgentScripttoDefaultChatSessionWithParameter(
        Constants.OpenKBSearchAgentScriptName
      );
      //Run Macro
      await macrosAdminPage.openAppLandingPage(adminPage);
      await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
      await macrosAdminPage.CreateCaseInCSW(Constants.CaseTitleName);
      await macrosAdminPage.InitiateSession(
        Constants.CaseTitleName,
        Constants.CaseLink1
      );
      const runValidateKBSearchMacro =
        await macrosAdminPage.runMacroInSessionAndValidate(
          Constants.OpenKBSearchAgentScriptName,
          Constants.OpenKBSearchTitle
        );
      expect(runValidateKBSearchMacro).toBeTruthy();
    } finally {
      await macrosAdminPage.deleteAgentScriptnNew(
        adminPage,
        adminStartPage,
        Constants.OpenKBSearchAgentScriptName
      );
      await macrosAdminPage.deleteMacroFromOmnichannelAdminCenterApp(
        Constants.OpenKBSearchMacroName
      );
      await macrosAdminPage.removeAgentScripttoDefaultCaseSession();
    }
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
  ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_testPlans/execute?planId=2606066&opId=3617&suiteId=2606071
  ///</summary>
  it.skip("Test Case 2464820: Open Control Application tab using Macros.", async () => {
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
        Constants.ControlApplicationTab,
        Constants.ControlApplicationTabUniqueName,
        Constants.ControlOptionValue
      );
      await macrosAdminPage.createMacroFromOmnichannelAdminCenterApp(
        Constants.ControlMacro,
        urlId
      );
      await macrosAdminPage.createAgentScript(
        Constants.AgentScriptName,
        Constants.TitleUniqueName,
        Constants.ControlMacro
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
      const openEntityRecordTabUsingMacro =
        await macrosAdminPage.runMacroAndValidate(
          agentPage,
          Constants.ControlTab
        );
      expect(openEntityRecordTabUsingMacro).toBeTruthy();
      //Closing Chat
      await agentChat.closeUnusedChat();
      await liveChatPage.closeChat();
      //Updating The Title of Existing and Inserting Control Parameters in Control Application Tab
      await macrosAdminPage.openAppLandingPage(adminPage);
      await adminStartPage.goToMyApp(Constants.OmnichannelAdminCenterApp);
      await macrosAdminPage.updateTitleOfApplicationTab(
        Constants.ChangedControlTitle,
        Constants.SearchControlApplicationTab,
        Constants.SearchControlApplicationTab1,
        Constants.ControlApplicationTab
      );
      await macrosAdminPage.insertControlParameters();
      //Login as agent and accept chat
      await macrosAdminPage.openOmnichannelForCS(
        agentStartPage,
        agentPage,
        agentChat
      );
      await macrosAdminPage.initiateLiveChatWithMacroAgent(liveChatPage);
      await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);
      //Validating The Changed Title of Application Tab by running the Macro
      const openDashboardTabUsingMacroRechecking =
        await macrosAdminPage.runMacroAndValidate(
          agentPage,
          Constants.ControltabTitle
        );
      expect(openDashboardTabUsingMacroRechecking).toBeTruthy();
      //Closing Chat
      await agentChat.closeUnusedChat();
      await liveChatPage.closeChat();
      //Inserting Macro Parameter
      await macrosAdminPage.insertMacroParameter(
        Constants.SearchControlMacro,
        Constants.SearchControlMacro1,
        Constants.ControlMacro,
        Constants.AttributeNameControl,
        Constants.AttributeValueControl
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
      const openEntityRecordTabUsingMacroRechecking =
        await macrosAdminPage.runMacroAndValidate(
          agentPage,
          Constants.ControltabTitle
        );
      expect(openEntityRecordTabUsingMacroRechecking).toBeTruthy();
      //Closing Chat
      await agentChat.closeUnusedChat();
      await liveChatPage.closeChat();
    } finally {
      await macrosAdminPage.deleteAgentScript(Constants.AgentScriptName);
      await macrosAdminPage.deleteApplicationTabusingOmnichannelAdminCenter(
        Constants.ControlApplicationTab
      );
      await macrosAdminPage.deleteMacroFromOmnichannelAdminCenterApp(
        Constants.ControlMacro
      );
    }
  });

  ///<summary>
  ///Test Case 2464805: Open Entity List Application tab using Macro.
  ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_testPlans/execute?planId=2606066&opId=3617&suiteId=2606071
  ///</summary>
  it.skip("Test Case 2464805: Open Entity List Application tab using Macros.", async () => {
    agentPage = await agentContext.newPage();
    const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
    liveChatPage = new LiveChatPage(await liveChatContext.newPage());
    const agentChat = new AgentChat(agentPage);
    const agentScriptAdminPage = new AgentScript(adminPage);
    try {
      await adminStartPage.navigateToOrgUrlAndSignIn(
        TestSettings.MacrosAgentEmail,
        TestSettings.AdminAccountPassword
      );
      await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
      const urlId = await macrosAdminPage.createApplicationTabAndGetId(
        Constants.EntityListApplicationTab,
        Constants.EntityListApplicationTabUniqueName,
        Constants.EntityListOptionValue
      );
      await macrosAdminPage.createMacroFromOmnichannelAdminCenterApp(
        Constants.EntityListMacro,
        urlId
      );
      await macrosAdminPage.createAgentScript(
        Constants.AgentScriptName,
        Constants.TitleUniqueName,
        Constants.EntityListMacro
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
      const openEntityRecordTabUsingMacro =
        await macrosAdminPage.runMacroAndValidate(
          agentPage,
          Constants.EntityListTab
        );
      expect(openEntityRecordTabUsingMacro).toBeTruthy();
      //Closing Chat
      await agentChat.closeUnusedChat();
      await liveChatPage.closeChat();
      //Updating The Title of Existing and Inserting EntityName in Entity List Application Tab
      await macrosAdminPage.openAppLandingPage(adminPage);
      await adminStartPage.goToMyApp(Constants.OmnichannelAdminCenterApp);
      await macrosAdminPage.updateTitleOfApplicationTab(
        Constants.ChangeEntityListTitleTab,
        Constants.EntityListSearch,
        Constants.EntityListSearch1,
        Constants.EntityListApplicationTab
      );
      await macrosAdminPage.insertEntityListParameters();
      //Login as agent and accept chat
      await macrosAdminPage.openOmnichannelForCS(
        agentStartPage,
        agentPage,
        agentChat
      );
      await macrosAdminPage.initiateLiveChatWithMacroAgent(liveChatPage);
      await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);
      //Validating The Changed Title of Application Tab by running the Macro
      const openEntityListTabUsingMacroRechecking =
        await macrosAdminPage.runMacroAndValidate(
          agentPage,
          Constants.ChangeEntityListTab
        );
      expect(openEntityListTabUsingMacroRechecking).toBeTruthy();
      //Closing Chat
      await agentChat.closeUnusedChat();
      await liveChatPage.closeChat();
      //Inserting Macro Parameter
      await macrosAdminPage.insertMacroParameter(
        Constants.EntitySearchMacro,
        Constants.EntitySearchMacro1,
        Constants.EntityListMacro,
        Constants.AttributeNameEntityList,
        Constants.AttributeValueEntityList
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
      const openEntityRecordTabUsingMacroRechecking =
        await macrosAdminPage.runMacroAndValidate(
          agentPage,
          Constants.ChangeEntityListTab
        );
      expect(openEntityRecordTabUsingMacroRechecking).toBeTruthy();
      //Closing Chat
      await agentChat.closeUnusedChat();
      await liveChatPage.closeChat();
    } finally {
      await macrosAdminPage.deleteAgentScript(Constants.AgentScriptName);
      await macrosAdminPage.deleteApplicationTabusingOmnichannelAdminCenter(
        Constants.EntityListApplicationTab
      );
      await macrosAdminPage.deleteMacroFromOmnichannelAdminCenterApp(
        Constants.EntityListMacro
      );
    }
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
          Constants.SearchApplicationTab,
          Constants.TitleUniqueName,
          Constants.EntitySearchOptionValue
        );
      await macrosAdminPage.createMacroFromOmnichannelAdminCenterApp(
        Constants.SearchMacroName,
        applicationTabId
      );
      await macrosAdminPage.createAgentScript(
        Constants.SearchAgentScriptName,
        Constants.TitleUniqueName,
        Constants.SearchMacroName
      );
      await macrosAdminPage.addAgentScripttoDefaultChatSessionWithParameter(
        Constants.SearchAgentScriptName
      );
      //Run Macro
      await macrosAdminPage.openAppLandingPage(adminPage);
      await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
      await macrosAdminPage.CreateCaseInCSW(Constants.CaseTitleName);
      await macrosAdminPage.InitiateSession(
        Constants.CaseTitleName,
        Constants.CaseLink1
      );
      const runValidateSearchMacro =
        await macrosAdminPage.runMacroInSessionAndValidate(
          Constants.SearchAgentScriptName,
          Constants.SearchTitle
        );
      expect(runValidateSearchMacro).toBeTruthy();
    } finally {
      await macrosAdminPage.deleteAgentScriptnNew(
        adminPage,
        adminStartPage,
        Constants.SearchAgentScriptName
      );
      await macrosAdminPage.deleteApplicationTabusingOmnichannelAdminCenter(
        Constants.SearchApplicationTab
      );
      await macrosAdminPage.deleteMacroFromOmnichannelAdminCenterApp(
        Constants.SearchMacroName
      );
      await macrosAdminPage.removeAgentScripttoDefaultCaseSession();
    }
  });

  ///<summary>
  ///Test Case 2464818: Open Web Resource Application tab using Macro.
  ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_testPlans/execute?planId=2606066&opId=3617&suiteId=2606071
  ///</summary>
  it.skip("Test Case 2464818: Open Web Resource Application tab using Macros.", async () => {
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
        Constants.WebResourceApplicationTab,
        Constants.WebResourceApplicationTabUniqueName,
        Constants.WebResourceOptionValue
      );
      await macrosAdminPage.createMacroFromOmnichannelAdminCenterApp(
        Constants.WebResourceMacro,
        urlId
      );
      await macrosAdminPage.createAgentScript(
        Constants.AgentScriptName,
        Constants.TitleUniqueName,
        Constants.WebResourceMacro
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
      const EntitySearchUsingMacro = await macrosAdminPage.runMacroAndValidate(
        agentPage,
        Constants.WebResourceTab
      );
      expect(EntitySearchUsingMacro).toBeTruthy();
      //Closing Chat
      await agentChat.closeUnusedChat();
      await liveChatPage.closeChat();
      //Updating The Title of Existing and Inserting WebResource Name in WebResource Application Tab
      await macrosAdminPage.openAppLandingPage(adminPage);
      await adminStartPage.goToMyApp(Constants.OmnichannelAdminCenterApp);
      await macrosAdminPage.updateTitleOfApplicationTab(
        Constants.ChangeWebResourceTitleTab,
        Constants.WebResourceTabTitle,
        Constants.WebResourceTabTitle1,
        Constants.WebResourceApplicationTab
      );
      await macrosAdminPage.insertWebResourceParameters();
      //Login as agent and accept chat
      await macrosAdminPage.openOmnichannelForCS(
        agentStartPage,
        agentPage,
        agentChat
      );
      await macrosAdminPage.initiateLiveChatWithMacroAgent(liveChatPage);
      await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);

      //Validating The Changed Title of Application Tab by running the Macro
      const EntitySearchUsingMacroRechecking =
        await macrosAdminPage.runMacroAndValidate(
          agentPage,
          Constants.ChangeWebResourceTab
        );
      expect(EntitySearchUsingMacroRechecking).toBeTruthy();
      //Closing Chat
      await agentChat.closeUnusedChat();
      await liveChatPage.closeChat();
      //Inserting Macro Parameter
      await macrosAdminPage.insertMacroParameter(
        Constants.WebResourceMacroSearch,
        Constants.WebResourceMacroSearch1,
        Constants.WebResourceMacro,
        Constants.WebResourceAttributeName1,
        Constants.WebResourceAttributeValue
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
      const webResourceTabUsingMacroRechecking =
        await macrosAdminPage.runMacroAndValidate(
          agentPage,
          Constants.ChangeWebResourceTab
        );
      expect(webResourceTabUsingMacroRechecking).toBeTruthy();
      //Closing Chat
      await agentChat.closeUnusedChat();
      await liveChatPage.closeChat();
    } finally {
      await macrosAdminPage.deleteAgentScript(Constants.AgentScriptName);
      await macrosAdminPage.deleteApplicationTabusingOmnichannelAdminCenter(
        Constants.WebResourceApplicationTab
      );
      await macrosAdminPage.deleteMacroFromOmnichannelAdminCenterApp(
        Constants.WebResourceMacro
      );
    }
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

  ///<summary>
  /// Test Case 1805099: [Macros] Verify KB article link is copied using ‘Search Knowledge base article’ action in the chat window using 'Send KB article' in macro
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1805099
  ///</summary>
  it.skip("Test Case 1805099: [Macros] Verify KB article link is copied using ‘Search Knowledge base article’ action in the chat window using 'Send KB article' in macro", async () => {
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
      await macrosAdminPage.EnableKbUrlLink();
      await macrosAdminPage.openAppLandingPage(adminPage);
      await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
      await macrosAdminPage.createMacro(Constants.SendKbArticle);
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
        ).Microsoft.ProductivityMacros.runMacro("SendKbArticle");
        return ctrl;
      });
      expect(result).toBe(Constants.ActionPerformedSuccessfully);
      const SendKbArticleVerification = await macrosAdminPage.VerifyKbUrlLink(
        agentPage
      );
      expect(SendKbArticleVerification).toBeTruthy();
      //End live chat
      await agentChat.closeUnusedChat();
      await liveChatPage.closeChat();
    } finally {
      await macrosAdminPage.deleteMacro(
        adminStartPage,
        Constants.SendKbArticle
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
  ///Test Case 2313858: [Macros] Verify record is link to the conversation using 'Link record to the conversation' action in the macros.
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2313858
  ///</summary>
  it.skip("Test Case 2313858: [Macros] Verify record is link to the conversation using 'Link record to the conversation' action in the macros.", async () => {
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
      const accountId1 = await macrosAdminPage.createAccountAndGetAccountId(
        Constants.AccountName1
      );
      await macrosAdminPage.openAppLandingPage(adminPage);
      await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
      await macrosAdminPage.createMacro(Constants.LinkRecordMacro, accountId1);
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
        ).Microsoft.ProductivityMacros.runMacro("LinkRecordMacro");
        return ctrl;
      });
      expect(result).toBe(Constants.ActionPerformedSuccessfully);
      //Check API result on UI
      const LinkRecordVerification = await macrosAdminPage.VerifyLinkedMacro(
        agentPage
      );
      expect(LinkRecordVerification).toBeTruthy();
      //End live chat
      await agentChat.closeUnusedChat();
      await liveChatPage.closeChat();
    } finally {
      await macrosAdminPage.deleteAccountLinkUnlink(
        adminPage,
        adminStartPage,
        Constants.AccountName1
      );
      await macrosAdminPage.deleteMacro(
        adminStartPage,
        Constants.LinkRecordMacro
      );
    }
  });

  ///<summary>
  ///Test Case 2313863: [Macros] Verify record is unlink to the conversation using 'UnLink record from the conversation' action in the macros.
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2313863
  ///</summary>
  it.skip("Test Case 2313863: [Macros] Verify record is unlink to the conversation using 'UnLink record to the conversation' action in the macros.", async () => {
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
      const accountId1 = await macrosAdminPage.createAccountAndGetAccountId(
        Constants.AccountName1
      );
      await macrosAdminPage.openAppLandingPage(adminPage);
      await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
      await macrosAdminPage.createMacro(Constants.LinkRecordMacro, accountId1);
      await macrosAdminPage.createMacro(
        Constants.UnlinkRecordMacro,
        accountId1
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
      const result1 = await agentPage.evaluate(async () => {
        const ctrl = await (
          window as any
        ).Microsoft.ProductivityMacros.runMacro("LinkRecordMacro");
        return ctrl;
      });
      expect(result1).toBe(Constants.ActionPerformedSuccessfully);
      const result = await agentPage.evaluate(async () => {
        const ctrl = await (
          window as any
        ).Microsoft.ProductivityMacros.runMacro("UnlinkRecordMacro");
        return ctrl;
      });
      expect(result).toBe(Constants.ActionPerformedSuccessfully);
      //Check API result on UI
      const UnlinkRecordVerification =
        await macrosAdminPage.VerifyUnlinkedMacro(agentPage);
      expect(UnlinkRecordVerification).toBeTruthy();
      //End live chat
      await agentChat.closeUnusedChat();
      await liveChatPage.closeChat();
    } finally {
      await macrosAdminPage.deleteAccountLinkUnlink(
        adminPage,
        adminStartPage,
        Constants.AccountName1
      );
      await macrosAdminPage.deleteMacro(
        adminStartPage,
        Constants.LinkRecordMacro
      );
      await macrosAdminPage.deleteMacro(
        adminStartPage,
        Constants.UnlinkRecordMacro
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
});
