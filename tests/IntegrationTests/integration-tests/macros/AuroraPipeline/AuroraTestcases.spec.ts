import { BrowserContext, Page } from "playwright";
import { Constants } from "../../common/constants";
import { LiveChatPage } from "../../../pages/LiveChat";
import { Macros } from "../../macropages/macrosAdmin";
import { OrgDynamicsCrmStartPage } from "../../../pages/org-dynamics-crm-start.page";
import { TestHelper } from "../../../helpers/test-helper";
import { TestSettings } from "../../../configuration/test-settings";
import { AgentChatConstants } from "Utility/Constants";

describe("Navigation and Gestures - ", () => {
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
  });
  afterEach(async () => {
    TestHelper.dispose(adminContext);
    TestHelper.dispose(liveChatContext);
    TestHelper.dispose(agentContext);
  });

  ///<summary>
  ///Test Case 2045186: [Navigation and Gestures] : Verify if records can be opened as sessions from case views
  ///Test Case Link  https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045186
  ///<summary>
  it("Test Case 2045186: [Navigation and Gestures] : Verify if records can be opened as sessions from case views", async () => {
    agentPage = await agentContext.newPage();
    let casetitle;
    try {
      //Login as admin and create two cases and initiate it and verify
      await adminStartPage.navigateToOrgUrlAndSignIn(
        TestSettings.AgentEmailSecond,
        TestSettings.AdminAccountPassword
      );
      await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
      casetitle = await macrosAdminPage.createCaseForNandG(
        Constants.CaseTitleName
      );
      //Initiate session and validate
      await macrosAdminPage.openAppLandingPage(adminPage);
      await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
      await adminStartPage.waitUntilSelectorIsVisible(
        AgentChatConstants.AgentScreenAvailablitySelector,
        AgentChatConstants.Five,
        adminStartPage.Page,
        Constants.FourThousandsMiliSeconds
      );
      await macrosAdminPage.GoToCases();
      await macrosAdminPage.InitiateNandGSession(casetitle, casetitle);
      await macrosAdminPage.ValidateNandGThePage(casetitle);
    } finally {
      await macrosAdminPage.deleteCaseInCSH(
        adminPage,
        adminStartPage,
        casetitle
      );
    }
  });

  ///<summary>
  ///Test Case 2045306: [Productivity Pane: Agent Guidance] : Verify if knowledge search is available with default configuration
  ///Test Case Link  https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045306
  ///<summary>
  it("Test Case 2045306: [Productivity Pane: Agent Guidance] : Verify if knowledge search is available with default configuration", async () => {
    agentPage = await agentContext.newPage();
    try {
      //Login as admin and create case
      await adminStartPage.navigateToOrgUrlAndSignIn(
        TestSettings.MacrosAgentEmail,
        TestSettings.AdminAccountPassword
      );
      await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
      await macrosAdminPage.createCase(Constants.CaseTitleName);
      //Initiate session
      await macrosAdminPage.openAppLandingPage(adminPage);
      await adminStartPage.goToCustomerServiceWorkspace();
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

  ///<summary>
  ///Test Case 1942192: [Multi Session] View CSM dashboards
  ///Test Case Link  https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1942192
  ///<summary>
  it("Test Case 1942192: [Multi Session] View CSM dashboards", async () => {
    agentPage = await agentContext.newPage();
    liveChatPage = new LiveChatPage(await liveChatContext.newPage());
    try {
      //Login as crmadmin
      await adminStartPage.navigateToOrgUrlAndSignIn(
        TestSettings.MultiSessionEmail,
        TestSettings.AdminAccountPassword
      );
      await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
      //   await adminStartPage.waitForAgentStatusIcon();
      await macrosAdminPage.ClickDropDown(Constants.DashboardSelector);
      //Validate page
      await macrosAdminPage.ValidateThePage(Constants.ServiceManagerDashboard);
      await macrosAdminPage.ValidateThePage(
        Constants.ServiceOperationsDashboard
      );
      await macrosAdminPage.ValidateThePage(
        Constants.ServicePerformanceDashboard
      );
    } finally {
      await macrosAdminPage.CloseDropDown(Constants.DashboardSelector);
    }
  });

  ///<summary>
  ///Test Case 1946076: [Multi Session] Verify Quick create action for Case entity and Activities
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1946076
  ///</summary>
  it("Test Case 1946076: [Multi Session] Verify Quick create action for Case entity and Activities", async () => {
    agentPage = await agentContext.newPage();
    try {
      //Login as admin and create case In CSW
      await adminStartPage.navigateToOrgUrlAndSignIn(
        TestSettings.MultiSessionEmail,
        TestSettings.AdminAccountPassword
      );
      await adminStartPage.goToCustomerServiceWorkspace();
      //Create case and Validate
      await macrosAdminPage.CreateCaseInCSW(Constants.CaseTitleName);
      await macrosAdminPage.ValidateThePage(Constants.Notification);
      //Initiate Session and Validate
      await macrosAdminPage.InitiateSession(
        Constants.CaseTitleName,
        Constants.CaseLink1
      );
      await macrosAdminPage.ValidateThePage(Constants.ValidateCaseTitle);
      await macrosAdminPage.ValidateThePage(Constants.ValidateCustomer);
    } finally {
      await macrosAdminPage.deleteCaseInCSH(
        adminPage,
        adminStartPage,
        Constants.CaseTitleName
      );
    }
  });

  ///<summary>
  ///Test Case 1942196: [Multi Session][Productivity Pane][Similar Cases] Adaptive cards correctly displayed
  ///Test Case Link: https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1942196
  ///</summary>
  it("Test Case 1942196: [Multi Session][Productivity Pane][Similar Cases] Adaptive cards correctly displayed", async () => {
    agentPage = await agentContext.newPage();
    liveChatPage = new LiveChatPage(await liveChatContext.newPage());
    try {
      //Login as admin and create case
      await adminStartPage.navigateToOrgUrlAndSignIn(
        TestSettings.MultiSessionEmail,
        TestSettings.AdminAccountPassword
      );
      await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
      await macrosAdminPage.createCase(Constants.CaseTitleName);
      //Initiate Session and Validate
      await macrosAdminPage.openAppLandingPage(adminPage);
      await adminStartPage.goToCustomerServiceWorkspace();
      await macrosAdminPage.InitiateSession(
        Constants.CaseTitleName,
        Constants.CaseLink1
      );
      await macrosAdminPage.ValidateTheStausOwnerTitleConfidenceAndResolution();
    } finally {
      await macrosAdminPage.deleteCaseInCSH(
        adminPage,
        adminStartPage,
        Constants.CaseTitleName
      );
    }
  });

  ///<summary>
  ///Test Case 1942209: [Multi Session][Productivity Pane][Similar Cases] Unlink similar case from active case from suggestion card (follows prior scenario)
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1942209
  ///</summary>
  it("Test Case 1942209: [Multi Session][Productivity Pane][Similar Cases] Unlink similar case from active case from suggestion card (follows prior scenario)", async () => {
    agentPage = await agentContext.newPage();
    try {
      //Login as admin and create case
      await adminStartPage.navigateToOrgUrlAndSignIn(
        TestSettings.MultiSessionEmail,
        TestSettings.AdminAccountPassword
      );
      await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
      await macrosAdminPage.createCase(Constants.CaseTitleName);
      //Initiate session
      await macrosAdminPage.openAppLandingPage(adminPage);
      await adminStartPage.goToCustomerServiceWorkspace();
      await macrosAdminPage.InitiateSession(
        Constants.CaseTitleName,
        Constants.CaseLink1
      );
      //Click Unlink to case  and validate
      await macrosAdminPage.LinkAndUnlinkCase(Constants.ClickLinkcase);
      await macrosAdminPage.ValidateThePage(Constants.UnlinkCase);
      await macrosAdminPage.LinkAndUnlinkCase(Constants.ClickUnlinkCase);
      await macrosAdminPage.ValidateThePage(Constants.LinkToCase);
      //Open connections and validate
      await macrosAdminPage.RelatedPage();
      await macrosAdminPage.ValidateThePage(Constants.ConnectionNoData);
    } finally {
      await macrosAdminPage.deleteCaseInCSH(
        adminPage,
        adminStartPage,
        Constants.CaseTitleName
      );
    }
  });

  ///<summary>
  ///Test Case 1942201: [Multi Session][Productivity Pane][Similar Cases] Link similar case to active case from suggestion card
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1942201
  ///</summary>
  it("Test Case 1942201: [Multi Session][Productivity Pane][Similar Cases] Link similar case to active case from suggestion card", async () => {
    agentPage = await agentContext.newPage();
    try {
      //Login as admin and create case
      await adminStartPage.navigateToOrgUrlAndSignIn(
        TestSettings.MultiSessionEmail,
        TestSettings.AdminAccountPassword
      );
      await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
      await macrosAdminPage.createCase(Constants.CaseTitleName);
      //Initiate session
      await macrosAdminPage.openAppLandingPage(adminPage);
      await adminStartPage.goToCustomerServiceWorkspace();
      await macrosAdminPage.InitiateSession(
        Constants.CaseTitleName,
        Constants.CaseLink1
      );
      //Click link to case button and validate
      await macrosAdminPage.LinkAndUnlinkCase(Constants.ClickLinkcase);
      await macrosAdminPage.ValidateThePage(Constants.UnlinkCase);
      await macrosAdminPage.LinkAndUnlinkCase(Constants.ClickUnlinkCase);
      await macrosAdminPage.ValidateThePage(Constants.LinkToCase);
      //Open connections and valiadte
      await macrosAdminPage.RelatedPage();
      await macrosAdminPage.ValidateThePage(Constants.ConnectionNewCase);
    } finally {
      await macrosAdminPage.deleteCaseInCSH(
        adminPage,
        adminStartPage,
        Constants.CaseTitleName
      );
    }
  });

  ///<summary>
  ///Test Case 1942193: [Multi Session][Productivity Pane] Productivity pane expanded once existing case is open
  ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_testPlans/execute?planId=2627279&suiteId=2627282
  ///</summary>
  it("Test Case 1942193: [Multi Session][Productivity Pane] Productivity pane expanded once existing case is open", async () => {
    agentPage = await agentContext.newPage();
    liveChatPage = new LiveChatPage(await liveChatContext.newPage());
    try {
      //Login as admin and create cases
      await adminStartPage.navigateToOrgUrlAndSignIn(
        TestSettings.MultiSessionEmail,
        TestSettings.AdminAccountPassword
      );
      await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
      await macrosAdminPage.createCase(Constants.CaseTitleName);
      await macrosAdminPage.createCase(Constants.CaseTitleName2);
      //Initiate two Session and Validating Productivity pane
      await macrosAdminPage.openAppLandingPage(adminPage);
      await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
      // await adminStartPage.waitForAgentStatusIcon();
      await macrosAdminPage.InitiateSession(
        Constants.CaseTitleName,
        Constants.CaseLink1
      );
      await macrosAdminPage.GoToHome();
      await macrosAdminPage.InitiateSession(
        Constants.CaseTitleName2,
        Constants.CaseLink2
      );
      await macrosAdminPage.SwitchBackToPreviousSession(Constants.CaseLink1);
      await macrosAdminPage.ValidateThePage(Constants.ProductivityPaneEnable);
      await macrosAdminPage.SwitchBackToPreviousSession(Constants.CaseLink2);
      await macrosAdminPage.ValidateThePage(Constants.ProductivityPaneEnable);
    } finally {
      await macrosAdminPage.deleteCase(
        adminPage,
        adminStartPage,
        Constants.CaseTitleName
      );
      await macrosAdminPage.deleteCase(
        adminPage,
        adminStartPage,
        Constants.CaseTitleName2
      );
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
  ///Test Case Test Case 2674539: Verify alwaysRender parameter for Third Party Website is supported.
  ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2674539
  ///<summary>
  it("Test Case 2674539: Verify alwaysRender parameter for Third Party Website is supported.", async () => {
    agentPage = await agentContext.newPage();
    liveChatPage = new LiveChatPage(await liveChatContext.newPage());
    try {
      //Login as 'Admin automated' and redirected to OrgUrl
      await adminStartPage.navigateToOrgUrlAndSignIn(
        TestSettings.AdminAccountEmail,
        TestSettings.AdminAccountPassword
      );
      await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
      // create a application tab and validate it
      await macrosAdminPage.GoToServiceManagement();
      await macrosAdminPage.CreateTabInApplicationTab(
        Constants.ThirdPartyWebsiteApplicationTab,
        Constants.ThirdPartyWebsiteApplicationTabUniqueName,
        Constants.ThirdPartyWebsiteOptionValue
      );
      await macrosAdminPage.AddParametersToAppTab(
        Constants.ParameterName,
        Constants.ParameterUniqueName,
        Constants.ValueAsTrue
      );
      await macrosAdminPage.ValidateThePage(Constants.ParameterAsAlwaysRender);
      await macrosAdminPage.SaveAndClose(Constants.SaveAndCloseButton);
    } finally {
      await macrosAdminPage.DeleteApplicationTabInCSH(
        adminPage,
        adminStartPage,
        Constants.ThirdPartyWebsiteApplicationTab
      );
    }
  });

  ///<summary>
  ///Test Case Test Case 2669759: Verify new session can be initiate from the new case(empty case).
  ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2669759
  ///<summary>
  it("Test Case 2669759: Verify new session can be initiate from the new case(empty case).", async () => {
    agentPage = await agentContext.newPage();
    liveChatPage = new LiveChatPage(await liveChatContext.newPage());
    try {
      //Login as 'Admin automated' and redirected to OrgUrl
      await adminStartPage.navigateToOrgUrlAndSignIn(
        TestSettings.AdminAccountEmail,
        TestSettings.AdminAccountPassword
      );
      await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
      // create a case and validate it
      await macrosAdminPage.CreateCaseInCSW(Constants.CaseTitleName);
      await macrosAdminPage.InitiateSession(
        Constants.CaseTitleName,
        Constants.CaseLink1
      );
      await macrosAdminPage.ValidateThePage(Constants.CloseSession1);
      // open empty case and validate it
      await macrosAdminPage.NewCaseFromNewSession();
      await macrosAdminPage.ValidateThePage(Constants.CloseEmptyCase);
    } finally {
      await macrosAdminPage.deleteCase(
        adminPage,
        adminStartPage,
        Constants.CaseTitleName
      );
    }
  });

  ///<summary>
  ///Test Case 2045297: [Productivity Pane: Knowledge Search] : Validate all available actions from knowledge search control (search, link, etc.)
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045297
  ///</summary>
  it("Test Case 2045297: [Productivity Pane: Knowledge Search] : Validate all available actions from knowledge search control (search, link, etc.)", async () => {
    agentPage = await agentContext.newPage();
    try {
      //Login as admin and create case
      await adminStartPage.navigateToOrgUrlAndSignIn(
        TestSettings.AdminAccountEmail,
        TestSettings.AdminAccountPassword
      );
      await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
      await macrosAdminPage.createCase(Constants.CaseTitleName);
      //Initiate session
      await macrosAdminPage.openAppLandingPage(adminPage);
      await adminStartPage.goToCustomerServiceWorkspace();
      await macrosAdminPage.InitiateSession(
        Constants.CaseTitleName,
        Constants.CaseLink1
      );
      //Open Knowledge search tool and validate given conditions
      await macrosAdminPage.ClickProductivityPaneTool(Constants.KStool);
      await macrosAdminPage.ValidateThePage(Constants.KStool);
      await macrosAdminPage.ValidateThePage(Constants.ValidateKSResults);
      await macrosAdminPage.ValidateThePage(Constants.SearchKSArticle);
      await macrosAdminPage.ValidateThePage(Constants.KSLinkBtn);
    } finally {
      await macrosAdminPage.deleteCase(
        adminPage,
        adminStartPage,
        Constants.CaseTitleName
      );
    }
  });

  ///<summary>
  ///Test Case 2045252: [Productivity Pane: Smart Assist] : Verify if smart assist is available with default configuration
  ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045252
  ///<summary>
  it("Test Case 2045252: [Productivity Pane: Smart Assist] : Verify if smart assist is available with default configuration", async () => {
    agentPage = await agentContext.newPage();
    try {
      //Login as admin and create case
      await adminStartPage.navigateToOrgUrlAndSignIn(
        TestSettings.AdminAccountEmail,
        TestSettings.AdminAccountPassword
      );
      await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
      await macrosAdminPage.createCase(Constants.CaseTitleName);
      //Initiate session
      await macrosAdminPage.openAppLandingPage(adminPage);
      await adminStartPage.goToCustomerServiceWorkspace();
      await macrosAdminPage.GoToCases();
      await macrosAdminPage.InitiateSession(
        Constants.CaseTitleName,
        Constants.CaseLink1
      );
      await macrosAdminPage.ValidateThePage(Constants.CloseSession1);
      await macrosAdminPage.ValidateThePage(Constants.Smartassist);
    } finally {
      await macrosAdminPage.deleteCaseInCSH(
        adminPage,
        adminStartPage,
        Constants.CaseTitleName
      );
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
      await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
      await macrosAdminPage.createCase(Constants.CaseTitleName);
      //Initiate session
      await macrosAdminPage.openAppLandingPage(adminPage);
      await adminStartPage.goToCustomerServiceWorkspace();
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

  ///<summary>
  ///Test Case 2390525: [P.Tool Migration] Ensure all the buttons on the smart assist cards behave the same as those before migration.
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2390525
  ///</summary>
  it("Test Case 2390525: [P.Tool Migration] Ensure all the buttons on the smart assist cards behave the same as those before migration.", async () => {
    agentPage = await agentContext.newPage();
    try {
      //Login as 'Admin automated' and redirected to OrgUrl
      await adminStartPage.navigateToOrgUrlAndSignIn(
        TestSettings.AdminAccountEmail,
        TestSettings.AdminAccountPassword
      );
      await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
      await macrosAdminPage.InitiateSession(
        Constants.CaseTitleName,
        Constants.CaseLink1
      );
      await macrosAdminPage.ValidateThePage(Constants.SuggestionCards);
      await macrosAdminPage.ValidateThePage(Constants.KAsuggestion);
      await macrosAdminPage.ValidateThePage(Constants.SCsuggestion);
    } finally {
      console.log("Test Case Executed Successfully");
    }
  });

  ///<summary>
  ///Test Case 2045219: [App Profile Manager] : Verify Shift click, control click, actions with csm(roles csr manager, app access, productivity tool user) with Default App Profile
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045219
  ///</summary>
  it("Test Case 2045219: [App Profile Manager] : Verify Shift click, control click, actions with csm(roles csr manager, app access, productivity tool user) with Default App Profile", async () => {
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
  ///Test Case 2045223: [App Profile Manager] : Verify Shift click, control click, actions with csr(roles csr, app access, productivity tool user) with Default App Profile
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045223
  ///</summary>
  it("Test Case 2045223: [App Profile Manager] : Verify Shift click, control click, actions with csr(roles csr, app access, productivity tool user) with Default App Profile", async () => {
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
  ///Test Case 2045214: [App Profile Manager] : Verify Shift click, control click, actions with admin with Default App Profile
  ///Test Case Link  https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045214
  ///<summary>
  it("Test Case 2045214: [App Profile Manager] : Verify Shift click, control click, actions with admin with Default App Profile", async () => {
    agentPage = await agentContext.newPage();
    try {
      //Login as admin and create case
      await adminStartPage.navigateToOrgUrlAndSignIn(
        TestSettings.AdminAccountEmail,
        TestSettings.AdminAccountPassword
      );
      await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
      await macrosAdminPage.createCase(Constants.CaseTitleName);
      //Initiate session and validate
      await macrosAdminPage.openAppLandingPage(adminPage);
      await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
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
      await macrosAdminPage.ValidateThePage(Constants.CloseTab);
    } finally {
      await macrosAdminPage.deleteCaseInCSH(
        adminPage,
        adminStartPage,
        Constants.CaseTitleName
      );
    }
  });

  ///<summary>
  ///Test Case 2242816: [P.Tool Migration] Ensure state persistence for tool selection in each session.
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2242816
  ///</summary>
  it("Test Case 2242816: [P.Tool Migration] Ensure state persistence for tool selection in each session.", async () => {
    agentPage = await agentContext.newPage();
    try {
      //Login as 'Admin automated' and redirected to OrgUrl
      await adminStartPage.navigateToOrgUrlAndSignIn(
        TestSettings.AdminAccountEmail,
        TestSettings.AdminAccountPassword
      );
      await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
      await macrosAdminPage.InitiateSession(
        Constants.CaseTitleName,
        Constants.CaseLink1
      );
      //click on any tool in productivy pane
      await macrosAdminPage.ClickProductivityPaneTool(Constants.AStool);
      //Initiate session
      await macrosAdminPage.GoToHome();
      await macrosAdminPage.InitiateSession(
        Constants.CaseTitleName2,
        Constants.CaseLink2
      );
      //click on any tool in productivity pane
      await macrosAdminPage.ClickProductivityPaneTool(Constants.KStool);
      //switch to previous session and validate
      await macrosAdminPage.SwitchBackToPreviousSession(Constants.Firstcase);
      await macrosAdminPage.ValidateThePage(Constants.AStool);
      //switch to previous session and validate
      await macrosAdminPage.SwitchBackToPreviousSession(Constants.Secondcase);
      await macrosAdminPage.ValidateThePage(Constants.KStool);
    } finally {
      console.log("Test Case Executed Successfully");
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
});
