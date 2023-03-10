import { BrowserContext, Page } from "playwright";
import { Constants } from "../../common/constants";
import { OrgDynamicsCrmStartPage } from "../../../pages/org-dynamics-crm-start.page";
import { TestHelper } from "../../../helpers/test-helper";
import { TestSettings } from "../../../configuration/test-settings";
import { Macros } from "integration-tests/macropages/macrosAdmin";
import { AppProfileHelper, appProfileNames } from "helpers/appprofile-helper";
import { AgentScript } from "integration-tests/agentScript/pages/agentScriptAdmin";
import { AgentChat } from "pages/AgentChat";
import { EntityAttributes, EntityNames } from "Utility/Constants";

describe("P.Tool Migration - ", () => {
  let adminContext: BrowserContext;
  let adminPage: Page;
  let adminStartPage: OrgDynamicsCrmStartPage;
  let agentPage: Page;
  let agentContext: BrowserContext;
  let liveChatContext: BrowserContext;
  let macrosAdminPage: Macros;
  let agentScriptAdminPage: AgentScript;
  let rnd;
  var caseNameList: string[] = [];
  let agentChat: AgentChat;
  var caseNameList2: string[] = [];
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
      extraHTTPHeaders: {
        origin: "",
      },
      acceptDownloads: true,
    });
    agentContext = await browser.newContext({
      viewport: TestSettings.Viewport,
      extraHTTPHeaders: {
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
      await adminStartPage.waitForDomContentLoaded();
      await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
      var CaseUserName = Constants.CaseTitleName;
      caseNameList = [CaseUserName];
      await macrosAdminPage.createIncidents(agentChat, caseNameList);
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
  it("Test Case 2242816: [P.Tool Migration] Ensure state persistence for tool selection in each session.", async () => {
    agentPage = await agentContext.newPage();
    rnd = agentScriptAdminPage.RandomNumber();

    //Login as 'Admin automated' and redirected to OrgUrl
    await adminStartPage.navigateToOrgUrlAndSignIn(
      TestSettings.MacrosAgentEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    var CaseUserName = Constants.CaseTitleName + rnd;
    var CaseUserName2 = Constants.CaseTitleName2 + rnd;
    caseNameList = [CaseUserName, CaseUserName2];
    await macrosAdminPage.createIncidents(agentChat, caseNameList);
    await macrosAdminPage.InitiateSession(
      CaseUserName,
      Constants.LinkStart + CaseUserName + Constants.LinkEnd
    );
    //click on any tool in productivy pane
    await macrosAdminPage.ClickProductivityPaneTool(Constants.AStool);
    //Initiate session
    await macrosAdminPage.GoToHome();
    await macrosAdminPage.InitiateSession(
      CaseUserName2 ,
      Constants.LinkStart + CaseUserName2 + Constants.LinkEnd
    );
    //click on any tool in productivity pane
    await macrosAdminPage.ClickProductivityPaneTool(Constants.KStool);
    //switch to previous session and validate
    await macrosAdminPage.SwitchBackToPreviousSession(Constants.Firstcase);
    await macrosAdminPage.ValidateThePage(Constants.AStool);
    //switch to previous session and validate
    await macrosAdminPage.SwitchBackToPreviousSession(Constants.Secondcase);
    await macrosAdminPage.ValidateThePage(Constants.KStool);
  });

  ///<summary>
  ///Test Case 2245240: [P.Tool Migration] Verify the "happy path": productivity tools appear when a new session is created.
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2245240
  ///</summary>
  it("Test Case 2245240: [P.Tool Migration] Verify the productivity tools appear when a new session is created.", async () => {
    agentPage = await agentContext.newPage();
    rnd = agentScriptAdminPage.RandomNumber();

    //Login as 'Admin automated' and redirected to OrgUrl
    await adminStartPage.navigateToOrgUrlAndSignIn(
      TestSettings.MacrosAgentEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    var CaseUserName = Constants.CaseTitleName + rnd;
    var CaseUserName2 = Constants.CaseTitleName2 + rnd;
    caseNameList = [CaseUserName, CaseUserName2];
    await macrosAdminPage.createIncidents(agentChat, caseNameList);
    await macrosAdminPage.InitiateSession(
      CaseUserName,
      Constants.LinkStart + CaseUserName + Constants.LinkEnd
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
      CaseUserName2,
      Constants.LinkStart + CaseUserName2 + Constants.LinkEnd
    );
    //Open AgentScript tool in productivity pane
    await macrosAdminPage.ClickProductivityPaneTool(Constants.AStool);
    //Open Knowledge search tool in productivity pane
    await macrosAdminPage.ClickProductivityPaneTool(Constants.KStool);
    //Close Sesssion and validate page
    await macrosAdminPage.CloseSession(Constants.CloseSession2);
    await macrosAdminPage.ValidateThePage(Constants.NoProductivityPane);
  });

  ///<summary>
  ///Test Case 2268077: [P.Tool Migration] Ensure state persistence for app side panes state (collapsed/expanded) in each session
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2268077
  ///</summary>
  it("Test Case 2268077: [P.Tool Migration] Ensure state persistence for app side panes state (collapsed/expanded) in each session", async () => {
    agentPage = await agentContext.newPage();
      //Login as 'Admin automated' and redirected to OrgUrl
      await adminStartPage.navigateToOrgUrlAndSignIn(
        TestSettings.MacrosAgentEmail,
        TestSettings.AdminAccountPassword
      );
      await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
      await adminStartPage.waitForDomContentLoaded();
      await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
      var CaseUserName = Constants.CaseTitleName + rnd;
      var CaseUserName2 = Constants.CaseTitleName2 + rnd;
      caseNameList = [CaseUserName, CaseUserName2];
      await macrosAdminPage.createIncidents(agentChat, caseNameList);
      await macrosAdminPage.InitiateSession(
        CaseUserName,
        Constants.LinkStart + CaseUserName + Constants.LinkEnd
      );
      //click on any tool in productivy pane
      await macrosAdminPage.ClickProductivityPaneTool(Constants.AStool);
      //Initiate session
      await macrosAdminPage.GoToHome();
      await macrosAdminPage.InitiateSession(
        CaseUserName2,
        Constants.LinkStart + CaseUserName2 + Constants.LinkEnd
      );
      //click on any tool in productivity pane
      await macrosAdminPage.ClickProductivityPaneTool(Constants.KStool);
      //switch to previous session and validate
      await macrosAdminPage.SwitchBackToPreviousSession(Constants.Firstcase);
      await macrosAdminPage.ValidateThePage(Constants.AStool);
      //switch to previous session and validate
      await macrosAdminPage.SwitchBackToPreviousSession(Constants.Secondcase);
      await macrosAdminPage.ValidateThePage(Constants.KStool);
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

      await agentChat.waitForAgentStatusIcon();
      await agentChat.waitForAgentStatus();
      await agentChat.setAgentStatusToAvailable();

      await agentChat.waitforTimeout();
      var CaseUserName = Constants.CaseTitleName;
      caseNameList = [CaseUserName];
      await macrosAdminPage.createIncidents(agentChat, caseNameList);

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
  it("Test Case 2241720: [P.Tool Migration] Initial panes state respects APM config pane mode and initial pane selection is the first enabled tool. Respect user behaviors once any app side panes are loaded.", async () => {
    agentPage = await agentContext.newPage();
    //Login as 'Admin automated' and redirected to OrgUrl
    await adminStartPage.navigateToOrgUrlAndSignIn(
      TestSettings.AdminAccountEmail3,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToCustomerServiceAdmincenter();
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);

    // AppProfile with OneApps ProductivityPane
    const appProfileTest3 = appProfileNames.appProfileTest3;
    await macrosAdminPage.OpenappProfile(appProfileTest3);
    const booleanvalue = await macrosAdminPage.validatePane();
    if (booleanvalue) {
      await macrosAdminPage.EnableOneAppsInProductivityPane();
    } else {
      console.log("pane is already enabled");
    }
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await adminStartPage.waitforTimeout();
    await macrosAdminPage.CreateCaseInCSW(Constants.CaseTitleName);
    await macrosAdminPage.InitiateSession(
      Constants.CaseTitleName,
      Constants.CaseLink1
    );
    await macrosAdminPage.ValidateThePage(Constants.AStool);
  });

  ///<summary>
  ///Test Case 2245437: [P.Tool Migration] Ensure the specific productivity tools that are disabled in APM are not displayed in CSW app.
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2245437
  ///</summary>
  it("Test Case 2245437: [P.Tool Migration] Ensure the specific productivity tools that are disabled in APM are not displayed in CSW app.", async () => {
    agentPage = await agentContext.newPage();

    //Login as 'Admin automated' and redirected to OrgUrl
    await adminStartPage.navigateToOrgUrlAndSignIn(
      TestSettings.AdminAccountEmail3,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToCustomerServiceWorkspace();
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);

    var CaseUserName = Constants.CaseTitleName;
    caseNameList = [CaseUserName];
    await macrosAdminPage.createIncidents(agentChat, caseNameList);

    await adminStartPage.navigateToURL(Constants.AppSidePanes);

    await macrosAdminPage.InitiateSession(CaseUserName, Constants.CaseLink1);

    //Validate productivity tools that are disabled in APM are not displayed
    await macrosAdminPage.ValidateNotPresent(Constants.SAtool);
    await macrosAdminPage.ValidateNotPresent(Constants.AStool);
  });

  ///<summary>
  ///Test Case 2245445: [P.Tool Migration] Ensure app side pane rail is still rendered even if there is only one pane loaded.
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2245445
  ///</summary>
  it("Test Case 2245445: [P.Tool Migration] Ensure app side pane rail is still rendered even if there is only one pane loaded.", async () => {
    agentPage = await agentContext.newPage();
    try {
      //Login as 'Admin automated' and redirected to OrgUrl
      await adminStartPage.navigateToOrgUrlAndSignIn(
        TestSettings.AdminAccountEmail3,
        TestSettings.AdminAccountPassword
      );
      await adminStartPage.goToCustomerServiceAdmincenter();
      await adminStartPage.waitForDomContentLoaded();
      await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
      // AppProfile with OneApps ProductivityPane
      const appProfileTest3 = appProfileNames.appProfileTest3;
      await macrosAdminPage.OpenappProfile(appProfileTest3);
      const booleanvalue = await macrosAdminPage.validatePane();
      if (booleanvalue) {
        await macrosAdminPage.EnableOneAppsInProductivityPane();
      } else {
        console.log("pane is already enabled");
      }
      await macrosAdminPage.openAppLandingPage(adminPage);
      await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
      await adminStartPage.waitForDomContentLoaded();
      await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
      await agentChat.waitforTimeout();
      var CaseUserName = Constants.CaseTitleName;
      caseNameList = [CaseUserName];
      await macrosAdminPage.createIncidents(agentChat, caseNameList);

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
  it("Test Case 2241678: [P.Tool Migration] Ensure productivity tools are hidden in the home session except Teams control", async () => {
    agentPage = await agentContext.newPage();
    //Login as 'Admin automated' and redirected to OrgUrl
    await adminStartPage.navigateToOrgUrlAndSignIn(
      TestSettings.AdminAccountEmail6,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
 
    await macrosAdminPage.ValidateNotPage(Constants.ProductivityPaneEnable);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    var CaseUserName = Constants.CaseTitleName;
    caseNameList = [CaseUserName];
    await macrosAdminPage.createIncidents(agentChat, caseNameList);
    await macrosAdminPage.InitiateSession(
      CaseUserName,
      Constants.LinkStart + CaseUserName + Constants.LinkEnd
    );
    await macrosAdminPage.ValidateThePage(Constants.MSTeamstool);
    //Validate Home page and close session
    await macrosAdminPage.GoToHome();
    await macrosAdminPage.ValidateNotPage(Constants.ProductivityPaneEnable);
    var CaseTitleName2 = Constants.CaseTitleName;
    caseNameList2 = [CaseTitleName2];
    await macrosAdminPage.createIncidents(agentChat, caseNameList2);
    //Initiate Tab and validate Page and close
    await macrosAdminPage.InitiateTab(
      CaseTitleName2,
      Constants.LinkStart + CaseTitleName2 + Constants.LinkEnd
    );
    await macrosAdminPage.ValidateNotPage(Constants.ProductivityPaneEnable);
    await macrosAdminPage.CloseTab(Constants.CloseSessionInCSW);
    //Initiate Session and validate page
    await macrosAdminPage.InitiateSession(
      CaseUserName,
      Constants.LinkStart + CaseUserName + Constants.LinkEnd
    );
    await macrosAdminPage.ValidateThePage(Constants.MSTeamstool);
    //Validate Home page and close session
    await macrosAdminPage.GoToHome();
    await macrosAdminPage.ValidateNotPage(Constants.ProductivityPaneEnable);
    //Initiate Session and validate page
    await macrosAdminPage.InitiateSession(
      CaseTitleName2,
      Constants.LinkStart + CaseTitleName2 + Constants.LinkEnd
    );
    await macrosAdminPage.ValidateThePage(Constants.MSTeamstool);
    //Validate Home page and close session
    await macrosAdminPage.GoToHome();
    await macrosAdminPage.ValidateNotPage(Constants.ProductivityPaneEnable);
    console.log("Test Case Executed Successfully");
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
        TestSettings.AdminAccountEmail6,
        TestSettings.AdminAccountPassword
      );
      await adminStartPage.goToCustomerServiceAdmincenter();
      await adminStartPage.waitForDomContentLoaded();
      await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
      const appProfileTest6 = appProfileNames.appProfileTest6;
      await macrosAdminPage.OpenappProfile(appProfileTest6);
      const booleanvalue = await macrosAdminPage.validatePane();
      if (booleanvalue) {
        await macrosAdminPage.AddEntitySession(
          Constants.SessionTemplateinPowerApps
        );
        await macrosAdminPage.EnableProductivityPane();
        //Initiate session and validate
        await macrosAdminPage.openAppLandingPage(adminPage);
        await adminStartPage.goToCustomerServiceWorkspace();
        await adminStartPage.waitForDomContentLoaded();
        await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
        var CaseTitleName = Constants.CaseTitleName + rnd;
        caseNameList = [CaseTitleName];
        await macrosAdminPage.createIncidents(agentChat, caseNameList);
        await macrosAdminPage.InitiateSession(
         Constants.CaseTitleName,
         Constants.SpecificCaseLink1.replace("{0}", rnd)
        );
        await macrosAdminPage.ValidateThePage(Constants.ProductivityPaneEnable);
        await macrosAdminPage.ClickProductivityPaneTool(Constants.AStool);
        await macrosAdminPage.ValidateThePage(Constants.AStool);
        await macrosAdminPage.ClickProductivityPaneTool(Constants.SAtool);
        await macrosAdminPage.ValidateThePage(Constants.SAtool);
      } else {
        console.log("pane is already enabled");
        await macrosAdminPage.openAppLandingPage(adminPage);
        await adminStartPage.goToCustomerServiceWorkspace();
        await macrosAdminPage.CreateCaseInCSW(Constants.CaseTitleName);
        await macrosAdminPage.InitiateSession(
          Constants.CaseTitleName,
          Constants.CaseLink1
        );
        await macrosAdminPage.ValidateThePage(Constants.ProductivityPaneEnable);
        await macrosAdminPage.ClickProductivityPaneTool(Constants.AStool);
        await macrosAdminPage.ValidateThePage(Constants.AStool);
        await macrosAdminPage.ClickProductivityPaneTool(Constants.SAtool);
        await macrosAdminPage.ValidateThePage(Constants.SAtool);
      }
    } finally {
    }
  });

  ///<summary>
  ///Test Case 2271691: [P.Tool Migration] Teams control integration: Teams is not hidden on home session where its collapsed/expanded state respects APM pane mode.
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2271691
  ///</summary>
  it("Test Case 2271691: [P.Tool Migration] Teams control integration: Teams is not hidden on home session where its collapsed/expanded state respects APM pane mode.", async () => {
    agentPage = await agentContext.newPage();
    rnd = agentScriptAdminPage.RandomNumber();
    //Login as 'Admin automated' and redirected to OrgUrl
    await adminStartPage.navigateToOrgUrlAndSignIn(
      TestSettings.AdminAccountEmail6,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToCustomerServiceWorkspace();
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);

    var CaseTitleName = Constants.CaseTitleName + rnd;
    caseNameList = [CaseTitleName];
    await macrosAdminPage.createIncidents(agentChat, caseNameList);

    await macrosAdminPage.InitiateSession(
      Constants.CaseTitleName,
      Constants.SpecificCaseLink1.replace("{0}", rnd)
    );

    //Validate Teams is not hidden
    await macrosAdminPage.ValidateThePage(Constants.MSTeamstool);
  });
});
