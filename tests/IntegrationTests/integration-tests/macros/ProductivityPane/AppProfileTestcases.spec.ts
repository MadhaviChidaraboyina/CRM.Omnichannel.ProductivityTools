import { AgentChat } from '../../../pages/AgentChat'
import { BrowserContext, Page } from 'playwright'
import { Constants } from '../../common/constants'
import { LiveChatPage } from '../../../pages/LiveChat'
import { Macros } from "../../macropages/macrosAdmin";
import { OrgDynamicsCrmStartPage } from '../../../pages/org-dynamics-crm-start.page'
import { TestHelper } from '../../../helpers/test-helper'
import { TestSettings } from '../../../configuration/test-settings'
import { AgentScript } from 'integration-tests/agentScript/pages/agentScriptAdmin';
import { AppProfileHelper } from 'helpers/appprofile-helper';
import { EntityAttributes, EntityNames, stringFormat } from 'Utility/Constants';

describe("App Profile - ", () => {
  let adminContext: BrowserContext;
  let adminPage: Page;
  let adminStartPage: OrgDynamicsCrmStartPage;
  let agentPage: Page;
  let agentContext: BrowserContext;
  let liveChatContext: BrowserContext;
  let liveChatPage: LiveChatPage;
  let macrosAdminPage: Macros;
  let agentChat: AgentChat;
  let agentScriptAdminPage = new AgentScript(adminPage);

  beforeAll(async () => {
    await AppProfileHelper.getInstance().CreateAppProfile();
  })
  var caseNameList: string[] = [];


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
    agentScriptAdminPage = new AgentScript(adminPage);
    agentChat = new AgentChat(adminPage);
  });
  afterEach(async () => {
    TestHelper.dispose(adminContext);
    TestHelper.dispose(liveChatContext);
    TestHelper.dispose(agentContext);
  });

  ///<summary>
  ///Test Case 2045214: [App Profile Manager] : Verify Shift click, control click, actions with admin with Default App Profile
  ///Test Case Link  https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045214
  ///<summary>
  it("Test Case 2045214: [App Profile Manager] : Verify Shift click, control click, actions with admin with Default App Profile", async () => {
    agentPage = await agentContext.newPage();
    const rnd = agentScriptAdminPage.RandomNumber();
    try {
      //Login as admin and create case
      await adminStartPage.navigateToOrgUrlAndSignIn(
        TestSettings.AdminAccountEmail,
        TestSettings.AdminAccountPassword
      );
      await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
      await adminStartPage.waitForDomContentLoaded();
      await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage)
      const CaseTitleName = Constants.CaseTitleName + rnd
      const userNamePrefix = Constants.AutomationContact + rnd
      let contact = await agentChat.createContactRecord(userNamePrefix);
      await agentChat.createIncidentRecord(CaseTitleName, contact[EntityAttributes.Id], EntityNames.Contact);

      //Initiate session and validate
      await macrosAdminPage.InitiateSession(
        Constants.CaseTitleName,
        Constants.CaseLink1
      );
      await macrosAdminPage.ValidateThePage(Constants.CloseSession1);
      await macrosAdminPage.ValidateThePage(Constants.Smartassist);
      await macrosAdminPage.ClickProductivityPaneTool(Constants.AStool);
      //Validate page
      await macrosAdminPage.ValidateThePage(Constants.Agentscripts);
      await macrosAdminPage.ClickProductivityPaneTool(Constants.KStool);
      await macrosAdminPage.ValidateThePage(Constants.Knowledgesearch);
      await macrosAdminPage.CloseSession(Constants.CloseSession1);
      await macrosAdminPage.InitiateTab(
        Constants.CaseTitleName,
        Constants.CaseLink1
      );
      await macrosAdminPage.ValidateThePage(Constants.TabNoProdu);
      await macrosAdminPage.CloseTab(Constants.CloseTab);
      //Initiate Session and validate page
      await macrosAdminPage.InitiateSession(
        Constants.CaseTitleName,
        Constants.CaseLink1
      );
      await macrosAdminPage.ValidateThePage(Constants.ProductivityPaneEnable);
      await macrosAdminPage.ValidateThePage(Constants.ValidateSuggestion);
      //Open Agent Script tool and validate
      await macrosAdminPage.ClickProductivityPaneTool(Constants.AStool);
      await macrosAdminPage.ValidateThePage(Constants.AStool);
      //Open Knowledge search tool and validate
      await macrosAdminPage.ClickProductivityPaneTool(Constants.KStool);
      await macrosAdminPage.ValidateThePage(Constants.ValidateKSResults);
    } finally {
    }
  });

  ///<summary>
  ///Test Case 2045219: [App Profile Manager] : Verify Shift click, control click, actions with csm(roles csr manager, app access, productivity tool user) with Default App Profile
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045219
  ///</summary>
  it("Test Case 2045219: [App Profile Manager] : Verify Shift click, control click, actions with csm(roles csr manager, app access, productivity tool user) with Default App Profile", async () => {
    agentPage = await agentContext.newPage();
    const rnd = agentScriptAdminPage.RandomNumber();
    try {
      //Login as admin and create case
      await adminStartPage.navigateToOrgUrlAndSignIn(
        TestSettings.AdminAccountEmail,
        TestSettings.AdminAccountPassword
      );
      await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
      await adminStartPage.waitForDomContentLoaded();
      await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage)
      const CaseTitleName = Constants.CaseTitleName + rnd
      const userNamePrefix = Constants.AutomationContact + rnd
      let contact = await agentChat.createContactRecord(userNamePrefix);
      await agentChat.createIncidentRecord(CaseTitleName, contact[EntityAttributes.Id], EntityNames.Contact);
      await macrosAdminPage.InitiateTab(
        Constants.CaseTitleName,
        Constants.CaseLink1
      );
      await macrosAdminPage.ValidateThePage(Constants.TabNoProdu);
      await macrosAdminPage.CloseTab(Constants.CloseTab);
      //Initiate Session and validate page
      await macrosAdminPage.InitiateSession(
        Constants.CaseTitleName,
        Constants.CaseLink1
      );
      await macrosAdminPage.ValidateThePage(Constants.ProductivityPaneEnable);
      await macrosAdminPage.ValidateThePage(Constants.ValidateSuggestion);
      //Open Agent Script tool and validate
      await macrosAdminPage.ClickProductivityPaneTool(Constants.AStool);
      await macrosAdminPage.ValidateThePage(Constants.AStool);
      //Open Knowledge search tool and validate
      await macrosAdminPage.ClickProductivityPaneTool(Constants.KStool);
      await macrosAdminPage.ValidateThePage(Constants.ValidateKSResults);
    } finally {
    }
  });

  ///<summary>
  ///Test Case 2045223: [App Profile Manager] : Verify Shift click, control click, actions with csr(roles csr, app access, productivity tool user) with Default App Profile
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045223
  ///</summary>
  it.skip("Test Case 2045223: [App Profile Manager] : Verify Shift click, control click, actions with csr(roles csr, app access, productivity tool user) with Default App Profile", async () => {
    agentPage = await agentContext.newPage();
    try {
      //Login as admin and create case
      await adminStartPage.navigateToOrgUrlAndSignIn(
        TestSettings.AdminAccountEmail,
        TestSettings.AdminAccountPassword
      );
      await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
      await macrosAdminPage.createCase(Constants.CaseTitleName);
      //Initiate Tab and validate Page and close tab
      await macrosAdminPage.openAppLandingPage(adminPage);
      await adminStartPage.goToCustomerServiceWorkspace();
      await macrosAdminPage.InitiateTab(
        Constants.CaseTitleName,
        Constants.CaseLink1
      );
      await macrosAdminPage.ValidateThePage(Constants.TabNoProdu);
      await macrosAdminPage.CloseTab(Constants.CloseTab);
      //Initiate Session and validate page
      await macrosAdminPage.InitiateSession(
        Constants.CaseTitleName,
        Constants.CaseLink1
      );
      await macrosAdminPage.ValidateThePage(Constants.ProductivityPaneEnable);
      await macrosAdminPage.ValidateThePage(Constants.ValidateSuggestion);
      //Open Agent Script tool and validate
      await macrosAdminPage.ClickProductivityPaneTool(Constants.AStool);
      await macrosAdminPage.ValidateThePage(Constants.AStool);
      //Open Knowledge search tool and validate
      await macrosAdminPage.ClickProductivityPaneTool(Constants.KStool);
      await macrosAdminPage.ValidateThePage(Constants.ValidateKSResults);
    } finally {
      await macrosAdminPage.deleteCase(
        adminPage,
        adminStartPage,
        Constants.CaseTitleName
      );
    }
  });

  ///<summary>
  ///Test Case 1968344: Verify default app profile associated for a user with default OC agent/OC supervisor/CSR/CSM role
  ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1968344
  ///</summary>
  it.skip("Test Case 1968344: Verify default app profile associated for a user with default OC agent/OC supervisor/CSR/CSM role", async () => {
    agentPage = await agentContext.newPage();
    liveChatPage = new LiveChatPage(await liveChatContext.newPage());
    try {
      await adminStartPage.navigateToOrgUrlAndSignIn(
        TestSettings.AdminAccountEmail,
        TestSettings.AdminAccountPassword
      );
      await adminStartPage.goToMyApp(Constants.OmnichannelCustomerservice);
      //Validating Dashboard
      await macrosAdminPage.ValidateDashboard(
        Constants.OmnichannelAgentDashBoard
      );
      await macrosAdminPage.ClickDropDown(Constants.DashboardSelector);
      await macrosAdminPage.ValidateDashboard(
        Constants.CustomerServiceRepresentativeDashBoard
      );
      await macrosAdminPage.ValidateNotPresent(
        Constants.OmnichannelSupervisorDashboard
      );
      await macrosAdminPage.ValidateDashboard(
        Constants.OmnichannelAgentDashBoard
      );
      await macrosAdminPage.ValidateDashboard(
        Constants.CustomerServiceManagerDashBoard
      );
      await macrosAdminPage.ValidateDashboard(
        Constants.OmnichannelOngoingConversationsDashboard
      );
    } finally {
      console.log("validation Successfully");
    }
  });

  ///<summary>
  ///Test Case 1968349: Verify admin E2E experience in configuring Channel provider tab for an app profile
  ///Test Case Link  https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1968349
  ///<summary>
  it("Test Case 1968349: Verify admin E2E experience in configuring Channel provider tab for an app profile", async () => {
    agentPage = await agentContext.newPage();
    try {
      //Login as admin and create two cases and initiate it and verify
      await adminStartPage.navigateToOrgUrlAndSignIn(
        TestSettings.AdminAccountEmail,
        TestSettings.AdminAccountPassword
      );
      await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
      await macrosAdminPage.createAppProfile();
      await macrosAdminPage.createChannel();
      await macrosAdminPage.thirdPartyChannel();
    } finally {
      console.log("validation Successfully");
    }
  });

  ///<summary>
  ///Test Case 1968350: Verify default values present in an OOTB OC app profile
  ///Test Case Link  https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1968350
  ///<summary>
  it("Test Case 1968350: Verify default values present in an OOTB OC app profile", async () => {
    agentPage = await agentContext.newPage();
    try {
      //Login as admin and create two cases and initiate it and verify
      await adminStartPage.navigateToOrgUrlAndSignIn(
        TestSettings.AdminAccountEmail,
        TestSettings.AdminAccountPassword
      );
      await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
      await macrosAdminPage.ocDefaultAppProfile();
      await macrosAdminPage.ValidateThePage(Constants.NoEntitySession);
      await macrosAdminPage.cswDefaultAppProfile();
      await macrosAdminPage.ValidateThePage(Constants.EntitySession);
      await macrosAdminPage.cswDefaultChannelAppProfile();
      await macrosAdminPage.ValidateThePage(Constants.EntitySession);
      await macrosAdminPage.cswDefaultProductivityPane();
      await macrosAdminPage.ValidateThePage(
        Constants.ProductivityPaneDefaultMode
      );
      await macrosAdminPage.cswDefaultChannel();
      await macrosAdminPage.ValidateThePage(Constants.ChannelProvider);
    } finally {
      console.log("validation Successfully");
    }
  });

  ///<summary>
  ///Test Case 2056506: 2042783 Agent script , smart assist, knowledge article icons should load for both custom and default app profiles
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2056506
  ///</summary>
  it.skip("Test Case 2056506: 2042783 Agent script , smart assist, knowledge article icons should load for both custom and default app profiles", async () => {
    agentPage = await agentContext.newPage();
    const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
    liveChatPage = new LiveChatPage(await liveChatContext.newPage());
    const agentChat = new AgentChat(agentPage);
    try {
      //Login as admin and create case
      await adminStartPage.navigateToOrgUrlAndSignIn(
        TestSettings.AdminAccountEmail,
        TestSettings.AdminAccountPassword
      );
      //Login as agent and accept chat and validate
      await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(TestSettings.AdminAccountEmail,
        agentStartPage,
        agentChat
      );
      await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);
      await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);
      await macrosAdminPage.ValidateThePage(Constants.AStool);
      await macrosAdminPage.ValidateThePage(Constants.SAtool);
      await macrosAdminPage.ValidateThePage(Constants.KStool);
      //Closing Chat
      await agentChat.closeUnusedChat();
      await liveChatPage.closeChat();
      //Create new app profile
      await adminStartPage.goToCustomerServiceAdmincenter();
      await macrosAdminPage.createAppProfile();
      await macrosAdminPage.AddUsers(TestSettings.InboxUser);
      await macrosAdminPage.AddEntitySession(
        Constants.SessionTemplateinPowerApps
      );
      await macrosAdminPage.EnableProductivityPane();
      //Login as agent and accept chat and valiate
      await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(TestSettings.AdminAccountEmail,
        agentStartPage,
        agentChat
      );
      await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);
      await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);
      await macrosAdminPage.ValidateThePage(Constants.AStool);
      await macrosAdminPage.ValidateThePage(Constants.SAtool);
      await macrosAdminPage.ValidateThePage(Constants.KStool);
      //Closing Chat
      await agentChat.closeUnusedChat();
      await liveChatPage.closeChat();
    } finally {
      await adminPage.reload();
      await macrosAdminPage.deleteAppProfile(adminPage, adminStartPage);
      await agentChat.closeUnusedChat();
      await liveChatPage.closeChat();
    }
  });


  ///<summary>
  ///Test Case 1968342: Verify default app profile associated for a user with default OC Agent/OC Supervisor
  ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1968342
  ///</summary>
  it("Test Case 1968342: Verify default app profile associated for a user with default OC Agent/OC Supervisor", async () => {
    agentPage = await agentContext.newPage();
    liveChatPage = new LiveChatPage(await liveChatContext.newPage());
    try {
      await adminStartPage.navigateToOrgUrlAndSignIn(
        TestSettings.AdminAccountEmail,
        TestSettings.AdminAccountPassword
      );
      await adminStartPage.goToMyApp(Constants.OmnichannelCustomerservice);
      //Validating Dashboard
      await macrosAdminPage.ValidateDashboard(
        Constants.OmnichannelAgentDashBoard
      );
      await macrosAdminPage.ValidateOCCSDashboard(
        Constants.OmnichannelOngoingConversationDashBoard
      );
      await macrosAdminPage.ValidateOCCSDashboard(
        Constants.OmnichannelIntradayInsightsDashboard
      );
    } finally {
      console.log("validation Successfully");
    }
  });
});
