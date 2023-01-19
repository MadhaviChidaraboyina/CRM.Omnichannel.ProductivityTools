import { BrowserContext, Page } from "playwright";
import { Constants } from "../../../common/constants";
import { LiveChatPage } from "../../../../pages/LiveChat";
import { Macros } from "../../../macropages/macrosAdmin";
import { OrgDynamicsCrmStartPage } from "../../../../pages/org-dynamics-crm-start.page";
import { TestHelper } from "../../../../helpers/test-helper";
import { TestSettings } from "../../../../configuration/test-settings";
import { AgentChat } from "pages/AgentChat";
import { MacrosPage } from "pages/Macros";
import { AgentScript } from "integration-tests/agentScript/pages/agentScriptAdmin";
import { AgentChatConstants,EntityNames } from "Utility/Constants";

describe("Admin Test Scenerios - ", () => {
  let adminContext: BrowserContext;
  let adminPage: Page;
  let adminStartPage: OrgDynamicsCrmStartPage;
  let agentPage: Page;
  let agentContext: BrowserContext;
  let liveChatContext: BrowserContext;
  let liveChatPage: LiveChatPage;
  let macrosAdminPage: Macros;
  let rnd: any;
  const agentScriptAdminPage = new AgentScript(adminPage);
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
///Test Case 1968350: Verify default values present in an OOTB OC app profile
///Test Case Link  https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1968350
///<summary>
it("Test Case 1968350: Verify default values present in an OOTB OC app profile", async () => {
  //Login as admin and create two cases and initiate it and verify
  await adminStartPage.navigateToOrgUrlAndSignIn(
    TestSettings.MacrosAgentEmail,
    TestSettings.AdminAccountPassword
  );
  await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
  await adminStartPage.waitForDomContentLoaded();
  await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
  await macrosAdminPage.createAppProfile();
  await macrosAdminPage.ValidateAppProfile();
  await macrosAdminPage.OpenFunctionAndValidate(Constants.AppProfileSession,Constants.AppProfileSessionValidate);
  await macrosAdminPage.OpenFunctionAndValidate(Constants.AppProfileProductivity,Constants.AppProfileProductivityValidate);
  await macrosAdminPage.OpenFunctionAndValidate(Constants.AppProfileChannel,Constants.AppProfileChannelValidate);
});

  ///<summary>
  ///Test Case 1577427: Verify Agent can see the user navigation history in the customer summary > under Navigation tab.
  ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1577427
  ///</summary>
  it("Test Case 1577427: Verify Agent can see the user navigation history in the customer summary > under Navigation tab", async () => {
    agentPage = await agentContext.newPage();
    const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
    liveChatPage = new LiveChatPage(await liveChatContext.newPage());
    const agentChat = new AgentChat(agentPage);
    try {
      await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(
        TestSettings.LiveChatPTEAccountEmail,
        agentStartPage,
        agentChat
      );
      await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);
      //Login as agent and accept chat
      await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);
      await agentChat.closeUnusedChat();
      await liveChatPage.closeChat();
      await adminStartPage.navigateToOrgUrlAndSignIn(
        TestSettings.LiveChatPTEAccountEmail,
        TestSettings.AdminAccountPassword
      );
      await adminStartPage.goToMyApp(Constants.OmnichannelCustomerservice);
      await adminStartPage.waitForAgentStatusIcon();
      await adminStartPage.OpenCloseWorkItem();
      await adminStartPage.Page.waitForTimeout(
        AgentChatConstants.ThirtyThousand
      );
      await adminStartPage.ValidateThePage(Constants.History);
      await adminStartPage.ValidateThePage(Constants.Transcript);
    } finally {
      console.log("validation Successfully");
    }
  });

  ///<summary>
  ///Test Case 1577428: Verify Admin of the company can configure the custom activities to be tracked as part of user navigation and those would be listed in the navigation tab.
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1577428
  ///</summary>
  it("Test Case 1577428: Verify Admin of the company can configure the custom activities to be tracked as part of user navigation and those would be listed in the navigation tab.", async () => {
    agentPage = await agentContext.newPage();
    const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
    liveChatPage = new LiveChatPage(await liveChatContext.newPage());
    const agentChat = new AgentChat(agentPage);
    try {
      //Login as admin and create case

      await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(
        TestSettings.LiveChatPTEAccountEmail,
        agentStartPage,
        agentChat
      );

      //Login as agent and accept chat
      await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);
      await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);

      await adminStartPage.navigateToOrgUrlAndSignIn(
        TestSettings.LiveChatPTEAccountEmail,
        TestSettings.AdminAccountPassword
      );

      //Closing Chat

      await agentChat.closeUnusedChat();
      await liveChatPage.closeChat();
      await adminStartPage.goToMyApp(Constants.OmnichannelCustomerservice);
      await adminStartPage.waitForAgentStatusIcon();
      await adminStartPage.OpenCloseWorkItem();
      await adminStartPage.Page.waitForTimeout(
        AgentChatConstants.ThirtyThousand
      );
      await macrosAdminPage.ValidateThePage(Constants.History);
    } finally {
      console.log("validation Successfully");
    }
  });

  ///<summary>
  ///Test Case 2411747: Verify OC old Customer Summary and new customer summary having it as anchor tab and additional tab (regular tab)
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2411747
  ///</summary>
  it("Test Case 2411747: Verify OC old Customer Summary and new customer summary having it as anchor tab and additional tab (regular tab)", async () => {
    agentPage = await agentContext.newPage();
    const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
    liveChatPage = new LiveChatPage(await liveChatContext.newPage());
    const agentChat = new AgentChat(agentPage); 
      await adminStartPage.navigateToOrgUrlAndSignIn(
        TestSettings.LiveChatPTEAccountEmail,
        TestSettings.AdminAccountPassword
      );
      await adminStartPage.goToMyApp(Constants.OmnichannelAdminCenterApp);
      await adminStartPage.validatePopup();
      const summaryname= await macrosAdminPage.createApplicationTabInOC(
        Constants.OldCustomerSummary,
        Constants.OldCustomerSummaryUniqueName,
        Constants.EntityRecordOptionValue
      );
      await macrosAdminPage.insertParametersInOldSustumersummary(summaryname);
      await macrosAdminPage.genericSession(
        Constants.SessionTemplateName,
        Constants.SessionTemplateUniqueName
      ); 
      // Login as agent and accept chat
      await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(
        TestSettings.LiveChatPTEAccountEmail,
        agentStartPage,
        agentChat
      );
      await agentChat.waitForAgentStatusIcon();
      await agentChat.waitForAgentStatus(); 
      await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);
      await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);
      const CustomerSummaryTab = await macrosAdminPage.verifyOpenedTab(
        agentPage,
        Constants.CustomerSummaryTab
      );
      expect(CustomerSummaryTab).toBeTruthy();
      await macrosAdminPage.closeConversation(agentPage, agentChat);
      await liveChatPage.closeChat();

      await macrosAdminPage.openAppLandingPage(adminPage);
      await adminStartPage.goToMyApp(Constants.OmnichannelAdminCenterApp);
      await macrosAdminPage.openGenericSession(
        Constants.CustomerSummary,
        Constants.AnchorTabSearchResult
      );
      await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);
      await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(
        TestSettings.LiveChatPTEAccountEmail,
        agentStartPage,
        agentChat
      );
      await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);
      const CustomerSummaryAppTab = await macrosAdminPage.verifyOpenedTab(
        agentPage,
        Constants.CustomerSummaryConversation
      );
      expect(CustomerSummaryAppTab).toBeTruthy();
      await macrosAdminPage.closeConversation(agentPage, agentChat);
      await liveChatPage.closeChat();

      await macrosAdminPage.openAppLandingPage(adminPage);
      await adminStartPage.goToMyApp(Constants.OmnichannelAdminCenterApp);
      await macrosAdminPage.chooseSecondAnchorTab();
      await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(
        TestSettings.LiveChatPTEAccountEmail,
        agentStartPage,
        agentChat
      );
      await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);
      const OldCustomerSummaryTab = await macrosAdminPage.verifyOpenedTab(
        agentPage,
        Constants.OldCustomerSummaryConversation
      );
      expect(OldCustomerSummaryTab).toBeTruthy();
      await macrosAdminPage.closeConversation(agentPage, agentChat);
      await liveChatPage.closeChat();

      await macrosAdminPage.openAppLandingPage(adminPage);
      await adminStartPage.goToMyApp(Constants.OmnichannelAdminCenterApp);
      await macrosAdminPage.openGenericSession(
        Constants.OldCustomerSummary,
        Constants.AppTabSearchReasult
      );
      await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(
        TestSettings.LiveChatPTEAccountEmail,
        agentStartPage,
        agentChat
      );
      await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);
      const OldCustomerSummaryAppTab = await macrosAdminPage.verifyOpenedTab(
        agentPage,
        Constants.OldCustomerSummaryConversation
      );
      expect(OldCustomerSummaryAppTab).toBeTruthy();
      await macrosAdminPage.closeConversation(agentPage, agentChat);
      await liveChatPage.closeChat(); 
  });

  ///<summary>
  ///Test Case 2412690: Verify Knowledge search as anchor tab and also as an additional (Regular ) tab.
  ///Test Case Link  https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2412690
  ///</summary>
  it("Test Case 2412690: Verify Knowledge search as anchor tab and also as an additional (Regular ) tab.", async () => {
    agentPage = await agentContext.newPage();
    const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
    liveChatPage = new LiveChatPage(await liveChatContext.newPage());
    const agentChat = new AgentChat(agentPage);
    await adminStartPage.navigateToOrgUrlAndSignIn(
      TestSettings.AdminAccountEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    await macrosAdminPage.anchorTabKnowledgeSearch();
    await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(
      TestSettings.AdminAccountEmail,
      agentStartPage,
      agentChat
    );
    await agentChat.waitForAgentStatusIcon();
    await agentChat.waitForAgentStatus();
    await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);
    await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);
    const KnowledgeSearchAppTab = await macrosAdminPage.verifyOpenedTab(
      agentPage,
      Constants.KStool
    );
    expect(KnowledgeSearchAppTab).toBeTruthy();
    //End live chat
    await macrosAdminPage.closeConversation(agentPage, agentChat);
    await liveChatPage.closeChat();
  });

  ///<summary>
  ///Test Case 2418287: Verify Notification should resolve odata and slug.
  ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2418287
  ///<summary>
  it("Test Case 2418287: Verify Notification should resolve odata and slug.", async () => {
    agentPage = await agentContext.newPage();
    const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
    const agentChat = new AgentChat(agentPage);
    rnd = agentScriptAdminPage.RandomNumber();

    // Login As Admin and create Queue
    await adminStartPage.navigateToOrgUrlAndSignIn(
      TestSettings.AdminAccountEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    const queuename= await macrosAdminPage.createAdvancedQueue(Constants.QueueName);
    await macrosAdminPage.AddUsers(Constants.User);

    //Create Notification and workstream
    await macrosAdminPage.notification(Constants.NotificationName);
    await macrosAdminPage.createRecordWorkStream(Constants.WorkStreamName, queuename);
    await macrosAdminPage.createIntakeRule(Constants.IntakeRuleName);
    await macrosAdminPage.addNotificationInWorkStream();

    // Create routing rule
    await macrosAdminPage.createRecordRouting(Constants.AssociateCase3);
    await macrosAdminPage.createRoutingRuleSet(
      Constants.RuleName,
      Constants.RuleItemName,
      Constants.QueueName
    );

    // login to Omnichannel for customer service
    await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(
      TestSettings.AdminAccountEmail,
      agentStartPage,
      agentChat
    );
    await macrosAdminPage.openAppLandingPage(adminPage);

    // Create a case and route it to queue
    await adminStartPage.goToMyApp(Constants.CustomerServiceHub);

    const Case_TitleName = Constants.CaseTitleName + rnd;
    await macrosAdminPage.createCase(Case_TitleName);
    await macrosAdminPage.AddQueueToExistingCases(
      Case_TitleName,
      Constants.QueueName
    );
    await macrosAdminPage.applyRoutingRuleToCase(Case_TitleName);

    //Verify the case title in the notification
    await macrosAdminPage.ValidateThePage(
      Constants.LinkStart + Case_TitleName + Constants.LinkEnd
    );

    //This tescase has an existing bug so cannot verify the customer name.
    //Please refer the bug for more information https://dev.azure.com/dynamicscrm/OneCRM/_workitems/edit/2625406
  });

  ///<summary>
  ///Test Case 1846840: To verify that agent presence is set to "Inactive" if Missed notifications settings is turned on and agent misses a notification
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1846840
  ///</summary>
  it("Test Case 1846840: To verify that agent presence is set to Inactive if Missed notifications settings is turned on and agent misses a notification", async () => {
    agentPage = await agentContext.newPage();
    const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
    liveChatPage = new LiveChatPage(await liveChatContext.newPage());
    const agentChat = new AgentChat(agentPage);
    try {
      //Login as admin automated and redirected to OrgUrl
      await adminStartPage.navigateToOrgUrlAndSignIn(
        TestSettings.AdminAccountEmail,
        TestSettings.AdminAccountPassword
      );
      await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
      await macrosAdminPage.TurnOnMissedNotifications();
      //Initiate live chat with agent
      await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);
      //Login as agent and accept chat
      await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(
        TestSettings.LiveChatPTEAccountEmail,
        agentStartPage,
        agentChat
      );
      await macrosAdminPage.StatusPresence(agentChat);
      //End live chat
      await agentChat.closeUnusedChat();
      await liveChatPage.closeChat();
    } finally {
      console.log("validation Successfully");
    }
  });

  ///<summary>
  ///Test Case 2353026: Verify Add new contact button on 'Customer Summary' is working
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2353026
  ///</summary>
  it("Test Case 2353026: Verify Add new contact button on 'Customer Summary' is working", async () => {
    agentPage = await agentContext.newPage();
    const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
    liveChatPage = new LiveChatPage(await liveChatContext.newPage());
    const agentChat = new AgentChat(agentPage);

    await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(
      TestSettings.AdminAccountEmail,
      agentStartPage,
      agentChat
    );
    await agentChat.waitForAgentStatusIcon();
    await agentChat.waitForAgentStatus(); 
    await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);
    await agentChat.acceptInvitationToChat();
    await macrosAdminPage.initiateNewContactTab(agentPage);
  });

  ///<summary>
  ///Test Case 1717166: Verify Admin can use the slugs in agent assist step titles
  ///https://dynamicscrm.visualstudio.com/OneCRM/_testPlans/define?planId=2368886&suiteId=2368890
  ///</summary>
  it("Test Case 1717166: Admin can use the slugs in agent assist step titles", async () => {
    let page = await agentContext.newPage();
    let constant = new Constants();
    let agentPage = new AgentChat(page);
    const macrosPage = new MacrosPage(page);
    const agentScriptAdminPage = new AgentScript(page);
    let agentStartPage = new OrgDynamicsCrmStartPage(page);
    try {
      await macrosPage.navigateToOrgUrl();
      await agentScriptAdminPage.createAgentScript(
        Constants.AgentScriptName,
        Constants.AgentScriptUniqueName
      );
      await agentScriptAdminPage.addAgentScriptTitle(
        Constants.SelectOptionText
      );
      await agentScriptAdminPage.addAgentScripttoDefaultChatSession();
      await agentScriptAdminPage.goToApps();
      await agentStartPage.goToOmnichannelForCustomers();

      liveChatPage = new LiveChatPage(await liveChatContext.newPage());
      await liveChatPage.open(TestSettings.LCWUrl);
      await liveChatPage.initiateChat();
      await liveChatPage.sendMessage("Hi", "en");
      await liveChatPage.getUniqueChat(liveChatPage, agentPage);
      const slugvalidateResult = await agentScriptAdminPage.validateSlugName();
      expect(slugvalidateResult).toBeTruthy();
      await liveChatPage.closeChat();
    } finally {
      await agentScriptAdminPage.goToApps();
      await agentStartPage.goToOmnichannelAdministration();
      await agentScriptAdminPage.deleteAgentScripthavingSteps(
        Constants.AgentScript
      );
      await macrosPage?.closePage();
    }
  });

  ///</summary>
  ///Test Case 1760325: [Macros] Verify Slugs, Session connectors are working in conditions in Macros
  /// Test Case Link https://dev.azure.com/dynamicscrm/OneCRM/_workitems/edit/1760325
  ///</summary>
  it("Test Case 1760325: [Macros] Verify Slugs, Session connectors are working in conditions in Macros", async () => {
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
    await macrosAdminPage.createMacro(Constants.SlugsMacroName);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    const workflowID = await macrosAdminPage.getLatestMacro(
      agentChat,
      Constants.SlugsMacroName
    );
    const agentScript = await agentChat.createAgentScriptbyXRMAPI(
      Constants.SlugsAgentScriptName + rnd,
      Constants.UniqueName + rnd
    );
    const agentScriptStep = await agentChat.createAgentScriptStepbyXRMAPI(
      Constants.SlugsAgentScriptName + rnd,
      Constants.UniqueName + rnd + rnd,
      Constants.AgentscriptStepOrder,
      Constants.MacroAgentScriptStep,
      agentScript.id,
      Constants.SlugsMacroName,
      workflowID
    );
    await macrosAdminPage.OpenAgentScriptandSave(
      Constants.SlugsAgentScriptName + rnd
    );
    await macrosAdminPage.addAgentScripttoDefaultChatSessionWithParameter(
      Constants.SlugsAgentScriptName + rnd
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
        Constants.SlugsAgentScriptName + rnd,
        Constants.SlugsTitle
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
});
