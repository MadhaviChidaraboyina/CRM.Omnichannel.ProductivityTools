import { BrowserContext, Page } from "playwright";
import { Constants } from "../../common/constants";
import { OrgDynamicsCrmStartPage } from "../../../pages/org-dynamics-crm-start.page";
import { TestHelper } from "../../../helpers/test-helper";
import { TestSettings } from "../../../configuration/test-settings";
import { Macros } from "integration-tests/macropages/macrosAdmin";

describe("P.Tool Migration - ", () => {
  let adminContext: BrowserContext;
  let adminPage: Page;
  let adminStartPage: OrgDynamicsCrmStartPage;
  let agentPage: Page;
  let agentContext: BrowserContext;
  let liveChatContext: BrowserContext;
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
  ///Test Case 2241691: [P.Tool Migration] Ensure all the productivity tools are disabled when productivity pane is turned off in APM
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2241691
  ///</summary>
  it("Test Case 2241691: [P.Tool Migration] Ensure all the productivity tools are disabled when productivity pane is turned off in APM", async () => {
    agentPage = await agentContext.newPage();
    try {
      //Login as 'Admin automated' and redirected to OrgUrl
      await adminStartPage.navigateToOrgUrlAndSignIn(
        TestSettings.AdminAccountEmail1,
        TestSettings.AdminAccountPassword
      );
      await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
      await macrosAdminPage.InitiateSession(
        Constants.CaseTitleName,
        Constants.CaseLink1
      );
      await macrosAdminPage.GoToHome();
      await macrosAdminPage.ValidateNotPage(Constants.ProductivityPaneEnable);
    } finally {
      console.log("Test Case Executed Successfully");
    }
  });

  ///<summary>
  ///Test Case 2242816: [P.Tool Migration] Ensure state persistence for tool selection in each session.
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2242816
  ///</summary>
  it.skip("Test Case 2242816: [P.Tool Migration] Ensure state persistence for tool selection in each session.", async () => {
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
  ///Test Case 2245240: [P.Tool Migration] Verify the "happy path": productivity tools appear when a new session is created.
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2245240
  ///</summary>
  it.skip("Test Case 2245240: [P.Tool Migration] Verify the productivity tools appear when a new session is created.", async () => {
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
      //Open AgentScript tool in productivity pane
      await macrosAdminPage.ClickProductivityPaneTool(Constants.AStool);
      //Open Knowledge search tool in productivity pane
      await macrosAdminPage.ClickProductivityPaneTool(Constants.KStool);
      //Close Sesssion and validate page
      await macrosAdminPage.CloseSession(Constants.CloseSession1);
      await macrosAdminPage.ValidateThePage(Constants.NoProductivityPane);
      //Initiate session
      await macrosAdminPage.InitiateSession(
        Constants.CaseTitleName2,
        Constants.CaseLink2
      );
      //Open AgentScript tool in productivity pane
      await macrosAdminPage.ClickProductivityPaneTool(Constants.AStool);
      //Open Knowledge search tool in productivity pane
      await macrosAdminPage.ClickProductivityPaneTool(Constants.KStool);
      //Close Sesssion and validate page
      await macrosAdminPage.CloseSession(Constants.CloseSession2);
      await macrosAdminPage.ValidateThePage(Constants.NoProductivityPane);
    } finally {
      console.log("Test Case Executed Successfully");
    }
  });

  ///<summary>
  ///Test Case 2245402: [P.Tool Migration] Verify content updates of each tool when switching sessions (including smart assist cards and agent scripts)
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2245402
  ///</summary>
  it.skip("Test Case 2245402: [P.Tool Migration] Verify content updates of each tool when switching sessions (including smart assist cards and agent scripts)", async () => {
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
    } finally {
      console.log("Test Case Executed Successfully");
    }
  });

  ///<summary>
  ///Test Case 2268077: [P.Tool Migration] Ensure state persistence for app side panes state (collapsed/expanded) in each session
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2268077
  ///</summary>
  it.skip("Test Case 2268077: [P.Tool Migration] Ensure state persistence for app side panes state (collapsed/expanded) in each session", async () => {
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
  ///Test Case 2390525: [P.Tool Migration] Ensure all the buttons on the smart assist cards behave the same as those before migration.
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2390525
  ///</summary>
  it.skip("Test Case 2390525: [P.Tool Migration] Ensure all the buttons on the smart assist cards behave the same as those before migration.", async () => {
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
  ///Test Case 2241720: [P.Tool Migration] Initial panes state respects APM config pane mode and initial pane selection is the first enabled tool. Respect user behaviors once any app side panes are loaded.
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2241720
  ///</summary>
  it.skip("Test Case 2241720: [P.Tool Migration] Initial panes state respects APM config pane mode and initial pane selection is the first enabled tool. Respect user behaviors once any app side panes are loaded.", async () => {
    agentPage = await agentContext.newPage();
    try {
      //Login as 'Admin automated' and redirected to OrgUrl
      await adminStartPage.navigateToOrgUrlAndSignIn(
        TestSettings.AdminAccountEmail2,
        TestSettings.AdminAccountPassword
      );
      await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
      await macrosAdminPage.InitiateSession(
        Constants.CaseTitleName,
        Constants.CaseLink1
      );
      await macrosAdminPage.ValidateThePage(Constants.AStool);
    } finally {
      console.log("Test Case Executed Successfully");
    }
  });

  ///<summary>
  ///Test Case 2245437: [P.Tool Migration] Ensure the specific productivity tools that are disabled in APM are not displayed in CSW app.
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2245437
  ///</summary>
  it.skip("Test Case 2245437: [P.Tool Migration] Ensure the specific productivity tools that are disabled in APM are not displayed in CSW app.", async () => {
    agentPage = await agentContext.newPage();
    try {
      //Login as 'Admin automated' and redirected to OrgUrl
      await adminStartPage.navigateToOrgUrlAndSignIn(
        TestSettings.AdminAccountEmail3,
        TestSettings.AdminAccountPassword
      );
      await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
      await macrosAdminPage.createCase(Constants.CaseTitleName);
      //Create app profile and Add Users and Session
      await macrosAdminPage.openAppLandingPage(adminPage);
      await adminStartPage.goToCustomerServiceWorkspace();
      await macrosAdminPage.InitiateSession(
        Constants.CaseTitleName,
        Constants.CaseLink1
      );
      await macrosAdminPage.ValidateThePage(Constants.SAtool);
      await macrosAdminPage.ValidateThePage(Constants.AStool);
    } finally {
      console.log("Test Case Executed Successfully");
    }
  });

  ///<summary>
  ///Test Case 2245445: [P.Tool Migration] Ensure app side pane rail is still rendered even if there is only one pane loaded.
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2245445
  ///</summary>
  it.skip("Test Case 2245445: [P.Tool Migration] Ensure app side pane rail is still rendered even if there is only one pane loaded.", async () => {
    agentPage = await agentContext.newPage();
    try {
      //Login as 'Admin automated' and redirected to OrgUrl
      await adminStartPage.navigateToOrgUrlAndSignIn(
        TestSettings.AdminAccountEmail2,
        TestSettings.AdminAccountPassword
      );
      await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
      await macrosAdminPage.InitiateSession(
        Constants.CaseTitleName,
        Constants.CaseLink1
      );
      await macrosAdminPage.ValidateThePage(Constants.AStool);
    } finally {
      console.log("Test Case Executed Successfully");
    }
  });

  ///<summary>
  ///Test Case 2241678: [P.Tool Migration] Ensure productivity tools are hidden in the home session except Teams control
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2241678
  ///</summary>
  it.skip("Test Case 2241678: [P.Tool Migration] Ensure productivity tools are hidden in the home session except Teams control", async () => {
    agentPage = await agentContext.newPage();
    try {
      //Login as 'Admin automated' and redirected to OrgUrl
      await adminStartPage.navigateToOrgUrlAndSignIn(
        TestSettings.AdminAccountEmail,
        TestSettings.AdminAccountPassword
      );
      await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
      await macrosAdminPage.ValidateNotPage(Constants.ProductivityPaneEnable);
      await macrosAdminPage.InitiateSession(
        Constants.CaseTitleName,
        Constants.CaseLink1
      );
      await macrosAdminPage.ValidateThePage(Constants.ProductivityPaneEnable);
      //Validate Home page and close session
      await macrosAdminPage.GoToHome();
      await macrosAdminPage.ValidateNotPage(Constants.ProductivityPaneEnable);
      await macrosAdminPage.CloseSessions(
        Constants.CloseSession1,
        Constants.GoToCloseSession1
      );
      //Initiate Tab and validate Page and close
      await macrosAdminPage.InitiateTab(
        Constants.CaseTitleName,
        Constants.CaseLink1
      );
      await macrosAdminPage.ValidateNotPage(Constants.ProductivityPaneEnable);
      await macrosAdminPage.CloseTab(Constants.CloseTab);

      //Initiate Session and validate page
      await macrosAdminPage.InitiateSession(
        Constants.CaseTitleName,
        Constants.CaseLink1
      );
      await macrosAdminPage.ValidateThePage(Constants.ProductivityPaneEnable);
      //Validate Home page and close session
      await macrosAdminPage.GoToHome();
      await macrosAdminPage.ValidateNotPage(Constants.ProductivityPaneEnable);
      await macrosAdminPage.CloseSessions(
        Constants.CloseSession1,
        Constants.GoToCloseSession1
      );
      //Initiate Session and validate page
      await macrosAdminPage.InitiateSession(
        Constants.CaseTitleName2,
        Constants.CaseLink2
      );
      await macrosAdminPage.ValidateThePage(Constants.ProductivityPaneEnable);
      //Validate Home page and close session
      await macrosAdminPage.GoToHome();
      await macrosAdminPage.ValidateNotPage(Constants.ProductivityPaneEnable);
      await macrosAdminPage.CloseSessions(
        Constants.CloseSession2,
        Constants.GoToCloseSession2
      );
    } finally {
      console.log("Test Case Executed Successfully");
    }
  });

  ///<summary>
  ///Test Case 2245423: [P.Tool Migration] Ensure the productivity tools cannot be closed
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2245423
  ///</summary>
  it("Test Case 2245423: [P.Tool Migration] Ensure the productivity tools cannot be closed", async () => {
    agentPage = await agentContext.newPage();
    try {
      //Login as 'Admin automated' and redirected to OrgUrl
      await adminStartPage.navigateToOrgUrlAndSignIn(
        TestSettings.AdminAccountEmail5,
        TestSettings.AdminAccountPassword
      );
      await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
      await macrosAdminPage.createCase(Constants.CaseTitleName);
      //Create app profile and Add Users and Session
      await macrosAdminPage.openAppLandingPage(adminPage);
      await adminStartPage.goToCustomerServiceAdmincenter();
      await macrosAdminPage.createAppProfile();
      await macrosAdminPage.AddUsers(TestSettings.InboxUser5);
      await macrosAdminPage.AddEntitySession(
        Constants.SessionTemplateinPowerApps
      );
      await macrosAdminPage.EnableProductivityPane();
      //Initiate session and validate
      await macrosAdminPage.openAppLandingPage(adminPage);
      await adminStartPage.goToCustomerServiceWorkspace();
      await macrosAdminPage.InitiateSession(
        Constants.CaseTitleName,
        Constants.CaseLink1
      );
      await macrosAdminPage.ValidateThePage(Constants.ProductivityPaneEnable);
      await macrosAdminPage.ClickProductivityPaneTool(Constants.AStool);
      await macrosAdminPage.ValidateThePage(Constants.AStool);
      await macrosAdminPage.ClickProductivityPaneTool(Constants.SAtool);
      await macrosAdminPage.ValidateThePage(Constants.SAtool);
      //delete app profile
      await macrosAdminPage.deleteAppProfile(adminPage, adminStartPage);
      //Create new app profile
      await macrosAdminPage.openAppLandingPage(adminPage);
      await adminStartPage.goToCustomerServiceAdmincenter();
      await macrosAdminPage.createAppProfile();
      await macrosAdminPage.AddUsers(TestSettings.InboxUser5);
      await macrosAdminPage.AddEntitySession(
        Constants.SessionTemplateinPowerApps
      );
      await macrosAdminPage.EnableOneAppsInProductivityPane();
      //Initiate session and validate
      await macrosAdminPage.openAppLandingPage(adminPage);
      await adminStartPage.goToCustomerServiceWorkspace();
      await macrosAdminPage.InitiateSession(
        Constants.CaseTitleName,
        Constants.CaseLink1
      );
      await macrosAdminPage.ValidateThePage(Constants.AStool);
    } finally {
      await macrosAdminPage.maximizeDeleteAppProfile(
        adminPage,
        adminStartPage,
        Constants.AppProfileName1,
        Constants.AppProfileNameLink1
      );
      await macrosAdminPage.deleteCase(
        adminPage,
        adminStartPage,
        Constants.CaseTitleName
      );
    }
  });

  ///<summary>
  ///Test Case 2245446: [P.Tool Migration] Ensure the badge number on smart assist can be accumulated and cached/restored along with session switch.
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2245446
  ///</summary>
  it.skip("Test Case 2245446: [P.Tool Migration] Ensure the badge number on smart assist can be accumulated and cached/restored along with session switch.", async () => {
    agentPage = await agentContext.newPage();
    try {
      //Login as 'Admin automated' and redirected to OrgUrl
      await adminStartPage.navigateToOrgUrlAndSignIn(
        TestSettings.AdminAccountEmail4,
        TestSettings.AdminAccountPassword
      );
      await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
      await macrosAdminPage.InitiateSession(
        Constants.CaseTitleName,
        Constants.CaseLink1
      );
      await macrosAdminPage.ValidateThePage(Constants.BadgeNum);
      //Initiate session and validate
      await macrosAdminPage.GoToHome();
      await macrosAdminPage.InitiateSession(
        Constants.CaseTitleName3,
        Constants.CaseLink3
      );
      await macrosAdminPage.ValidateThePage(Constants.NoBadgeNum);
      //switch to previous session and validate
      await macrosAdminPage.SwitchBackToPreviousSession(Constants.Firstcase);
      await macrosAdminPage.ValidateThePage(Constants.BadgeNum);
    } finally {
      console.log("Test Case Executed Successfully");
    }
  });

  ///<summary>
  ///Test Case 2271691: [P.Tool Migration] Teams control integration: Teams is not hidden on home session where its collapsed/expanded state respects APM pane mode.
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2271691
  ///</summary>
  it("Test Case 2271691: [P.Tool Migration] Teams control integration: Teams is not hidden on home session where its collapsed/expanded state respects APM pane mode.", async () => {
    agentPage = await agentContext.newPage();
    try {
      //Login as 'Admin automated' and redirected to OrgUrl
      await adminStartPage.navigateToOrgUrlAndSignIn(
        TestSettings.AdminAccountEmail3,
        TestSettings.AdminAccountPassword
      );
      await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
      await macrosAdminPage.createCase(Constants.CaseTitleName);
      //Create app profile and Add Users and Session
      await macrosAdminPage.openAppLandingPage(adminPage);
      await adminStartPage.goToCustomerServiceWorkspace();
      await macrosAdminPage.InitiateSession(
        Constants.CaseTitleName,
        Constants.CaseLink1
      );
      await macrosAdminPage.ValidateThePage(Constants.MSTeamstool);
    } finally {
      await macrosAdminPage.DisableMSTeamChat(adminPage, adminStartPage);
      await macrosAdminPage.deleteCase(
        adminPage,
        adminStartPage,
        Constants.CaseTitleName
      );
    }
  });
});
