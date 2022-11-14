import { BrowserContext, Page } from "playwright";
import { Constants } from "../../common/constants";
import { LiveChatPage } from "../../../pages/LiveChat";
import { Macros } from "../../macropages/macrosAdmin";
import { OrgDynamicsCrmStartPage } from "../../../pages/org-dynamics-crm-start.page";
import { TestHelper } from "../../../helpers/test-helper";
import { TestSettings } from "../../../configuration/test-settings";
import { stringFormat } from "../../../Utility/Constants";
import { AgentScript } from "../../../integration-tests/agentScript/pages/agentScriptAdmin";
import { AgentChat } from "../../../pages/AgentChat";

describe("Multi Session - ", () => {
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
    agentChat = new AgentChat(adminPage)
  });
  afterEach(async () => {
    TestHelper.dispose(adminContext);
    TestHelper.dispose(liveChatContext);
    TestHelper.dispose(agentContext);
  });

  ///<summary>
  ///Test Case 1942189: [Multi Session] Open Customer Service workspace as a Customer Service Manager
  ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1942189
  ///</summary>
  it("Test Case 1942189: [Multi Session] Open Customer Service workspace as a Customer Service Manager", async () => {
    agentPage = await agentContext.newPage();
    liveChatPage = new LiveChatPage(await liveChatContext.newPage());
    try {
      //Login as admin and create cases
      await adminStartPage.navigateToOrgUrlAndSignIn(
        TestSettings.MultiSessionEmail,
        TestSettings.AdminAccountPassword
      );
      //Validating Customer Service
      await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
      //await adminStartPage.waitForAgentStatusIcon();
      await macrosAdminPage.ValidateDashboard(
        Constants.CustomerServiceManagerDashBoard
      );
    } finally {
      console.log("validation Successfully");
    }
  });

  ///<summary>
  ///Test Case 1945844: [Multi Session] Verify the Subject functionality
  ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1945844
  ///</summary>
  it("Test Case 1945844: [Multi Session] Verify the Subject functionality", async () => {
    agentPage = await agentContext.newPage();
    liveChatPage = new LiveChatPage(await liveChatContext.newPage());
    try {
      await adminStartPage.navigateToOrgUrlAndSignIn(
        TestSettings.MultiSessionEmail,
        TestSettings.AdminAccountPassword
      );
      await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
      await macrosAdminPage.GoToServiceManagement();
      await macrosAdminPage.CreateSubjectsFromHub(
        Constants.SubjectName,
        Constants.SubjectName2,
        Constants.SubjectName3
      );
      await macrosAdminPage.openAppLandingPage(adminPage);
      await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
      // await adminStartPage.waitForAgentStatusIcon();
      //Creating Subjects
      await macrosAdminPage.CreateCaseForSubjectsInCSW(
        Constants.CaseTitleName2,
        Constants.SubjectName
      );
      await macrosAdminPage.InitiateSession(
        Constants.CaseTitleName2,
        Constants.CaseLink2
      );
      //validating subject field
      await macrosAdminPage.ValidateThePage(Constants.CWSSubjectInputField);
      await macrosAdminPage.ValidateSubjectField();
      await macrosAdminPage.GoToHome();
      await macrosAdminPage.InitiateTab(
        Constants.CaseTitleName2,
        Constants.CaseLink2
      );
      //validating subject field
      await macrosAdminPage.ValidateThePage(Constants.CWSSubjectInputField);
      await macrosAdminPage.ValidateSubjectField();
    } finally {
      await macrosAdminPage.deleteCase(
        adminPage,
        adminStartPage,
        Constants.CaseTitleName2
      );
      await macrosAdminPage.DeleteSubject(adminPage, adminStartPage);
    }
  });

  ///<summary>
  ///Test Case 1991369: [Multi Session][E2E] Verify Multisession functionality in CSW app
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1991369
  ///</summary>
  it("Test Case 1991369: [Multi Session][E2E] Verify Multisession functionality in CSW app", async () => {
    agentPage = await agentContext.newPage();
    rnd = agentScriptAdminPage.RandomNumber();
    //Login as admin and create cases
    await agentChat.navigateToOrgUrlAndSignIn(
      TestSettings.MultiSessionEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToCustomerServiceWorkspace();
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage)

    var CaseTitleName = Constants.CaseTitleName + rnd
    var CaseTitleName2 = Constants.CaseTitleName2 + rnd

    caseNameList = [CaseTitleName, CaseTitleName2];

    await macrosAdminPage.createIncidents(agentChat, caseNameList);

    //Initiate session and validate
    await macrosAdminPage.InitiateSession(
      CaseTitleName,
      Constants.SpecificCaseLink1.replace("{0}", rnd)
    );
    await macrosAdminPage.ValidateThePage(Constants.ProductivityPaneEnable);
    //Initiate session and open any tool in Productivity Pane
    await macrosAdminPage.GoToHome();
    await macrosAdminPage.InitiateSession(
      Constants.CaseTitleName2 + rnd,
      Constants.SpecificCaseLink2.replace("{0}", rnd)
    );
    await macrosAdminPage.ValidateThePage(Constants.ProductivityPaneEnable);
    await macrosAdminPage.ClickProductivityPaneTool(Constants.KArticleOpen);
    //Initiate session
    await macrosAdminPage.GoToHome();
    await macrosAdminPage.InitiateTab(
      Constants.CaseTitleName + rnd,
      Constants.SpecificCaseLink1.replace("{0}", rnd)
    );
    //Collapse and Expand the Productivity pane and validate
    await macrosAdminPage.CollapseExpandPane();
    await macrosAdminPage.ValidateThePage(Constants.ProductivityPaneEnable);
  });

  ///<summary>
  ///Test Case 1946076: [Multi Session] Verify Quick create action for Case entity and Activities
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1946076
  ///</summary>
  it("Test Case 1946076: [Multi Session] Verify Quick create action for Case entity and Activities", async () => {
    rnd = agentScriptAdminPage.RandomNumber();
    await agentChat.navigateToOrgUrlAndSignIn(
      TestSettings.MultiSessionEmail,
      TestSettings.AdminAccountPassword
    );

    await agentChat.goToMyApp(Constants.CustomerServiceWorkspace);
    await agentChat.waitforTimeout();

    var CaseUserName = Constants.XRMCaseName + rnd;
    caseNameList = [CaseUserName];

    await macrosAdminPage.createIncidents(agentChat, caseNameList);

    //Validate & Initiate one Session
    await macrosAdminPage.ValidateThePage(Constants.Notification);
    await macrosAdminPage.InitiateSession(
      CaseUserName,
      stringFormat(Constants.XRMSpecificCaseLink1, rnd)
    );

    //Validate Username & customer
    await macrosAdminPage.ValidateThePage(stringFormat(Constants.TitleTag, CaseUserName));
    await macrosAdminPage.ValidateThePage(stringFormat(Constants.TitleTag, Constants.XRMContact));
  });

  ///<summary>
  ///Test Case 1946046: [Multi Session] Verify Case Assoication action from Case Grid
  ///Test Case Link  https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1946046
  ///<summary>
  it("Test Case 1946046: [Multi Session] Verify Case Assoication action from Case Grid", async () => {
    agentPage = await agentContext.newPage();
      //Login as crmadmin
      await adminStartPage.navigateToOrgUrlAndSignIn(
        TestSettings.MultiSessionEmail,
        TestSettings.AdminAccountPassword
      );
      await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
      await agentChat.waitforTimeout();
      const Case1_Child1 = Constants.Case1_Child1
      const Case1_Child2 = Constants.Case1_Child2
      const Case2_Child1 = Constants.Case2_Child1
      const Case2_Child2 = Constants.Case2_Child2
      const Case1 = Constants.Case1
      const Case2 = Constants.Case2
      const Case3 = Constants.Case3

      caseNameList = [Case1_Child1, Case1_Child2, Case2_Child1, Case2_Child2, Case1, Case2, Case3];
      await macrosAdminPage.createIncidents(agentChat, caseNameList);
      await macrosAdminPage.GoToCases();
      //Associate two child cases with one parent case and Valiadte
      await macrosAdminPage.AssociateCases(
        Constants.Case1,
        Constants.DialogText
      );
      //Associate two child cases with one parent case and validate
      await macrosAdminPage.AssociateCases(
        Constants.Case2,
        Constants.DialogText
      );
      //Associate two child cases with one parent case and validate
      await macrosAdminPage.AssociateCases(
        Constants.AssociateCase3,
        Constants.ErrorDialog
      );
  });

  ///<summary>
  ///Test Case 1945859: [Multi Session] Create and Convert Activities (Task, Email, Phone Call, Fax, Letter, Appointment & Custom Activity) to Case.
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1945859
  ///</summary>
  it("Test Case 1945859: [Multi Session] Create and Convert Activities (Task, Email, Phone Call, Fax, Letter, Appointment & Custom Activity) to Case.", async () => {
    rnd = agentScriptAdminPage.RandomNumber();

    await agentChat.navigateToOrgUrlAndSignIn(
      TestSettings.MultiSessionEmail,
      TestSettings.AdminAccountPassword
    );

    await agentChat.goToMyApp(Constants.CustomerServiceWorkspace);
    await agentChat.waitforTimeout();

    var CaseUserName = Constants.XRMCaseName + rnd;
    caseNameList = [CaseUserName];

    await macrosAdminPage.createIncidents(agentChat, caseNameList);

    await macrosAdminPage.InitiateSession(
      CaseUserName,
      stringFormat(Constants.XRMSpecificCaseLink1, rnd)
    );

    //Create Task and convert it to case and validate
    await macrosAdminPage.CreateTask(Constants.TaskName + rnd);
    await macrosAdminPage.ConvertTaskToCase();
    await macrosAdminPage.ValidateTimeLine(Constants.TaskToCaseValidation);

    //Resolve case and validate
    await macrosAdminPage.ResolveCase(Constants.ResolutionName);
    await macrosAdminPage.ValidateTimeLine(Constants.ValidateResolveCase);

    //Reactivate case and Validate
    await macrosAdminPage.ReactivateCase();
    await macrosAdminPage.ValidateTimeLine(Constants.ValidateReactivateCase);

    //Cancel case and validate
    await macrosAdminPage.CancelCase();
    await macrosAdminPage.ValidateTimeLine(Constants.ValidateReactivateCase);

    //Reactivate case and delete
    await macrosAdminPage.ReactivateCase();
    await macrosAdminPage.DeleteCase();
    await macrosAdminPage.closeTaskTab();

    //Initiate session, Resolve it and Validate
    await macrosAdminPage.GoToHome();
    await macrosAdminPage.InitiateSession(
      CaseUserName,
      stringFormat(Constants.XRMSpecificCaseLink1, rnd)
    );
    await macrosAdminPage.ResolveCase(Constants.ResolutionName);
    await macrosAdminPage.ValidateTimeLine(Constants.ValidateResolveCase);

    //Reactivate case and Validate
    await macrosAdminPage.ReactivateCase();
    await macrosAdminPage.ValidateTimeLine(Constants.ValidateReactivateCase);

    //Cancel case and validate
    await macrosAdminPage.CancelCase();
    await macrosAdminPage.ValidateTimeLine(Constants.CaseClosed);
    await macrosAdminPage.ReactivateCase();
  });

  ///<summary>
  ///Test Case 1942194: [Multi Session][Productivity Pane] Productivity pane maintains collapsed state during session switch events
  ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1942194
  ///</summary>
  it("Test Case 1942194: [Multi Session][Productivity Pane] Productivity pane maintains collapsed state during session switch events", async () => {
    rnd = agentScriptAdminPage.RandomNumber();
    await agentChat.navigateToOrgUrlAndSignIn(
      TestSettings.AdminAccountEmail,
      TestSettings.AdminAccountPassword
    );

    await agentChat.goToMyApp(Constants.CustomerServiceWorkspace);
    await agentChat.waitforTimeout();

    //To enable new layout improvements
    await macrosAdminPage.enableLayoutImprovements(adminPage);

    var CaseUserName = Constants.XRMCaseName + rnd;
    var CaseUserName2 = Constants.XRMCaseName2 + rnd;

    caseNameList = [CaseUserName, CaseUserName2];

    await macrosAdminPage.createIncidents(agentChat, caseNameList);

    //Navigate to CSW and intitiate sessions
    await macrosAdminPage.InitiateSession(
      CaseUserName,
      stringFormat(Constants.XRMSpecificCaseLink1, rnd)
    );
    await macrosAdminPage.GoToHome();
    await macrosAdminPage.InitiateSession(
      CaseUserName2,
      stringFormat(Constants.XRMSpecificCaseLink2, rnd)
    );
    await macrosAdminPage.ClickProductivityPaneTool(Constants.SAtool);
    await macrosAdminPage.ValidateThePage(Constants.ProductivityPaneDisable);

    //Validate that Productivity pane maintains collapsed state during session switch events
    await macrosAdminPage.SwitchBackToPreviousSession(stringFormat(Constants.XRMSpecificCaseLink1, rnd));
    await macrosAdminPage.ValidateThePage(Constants.ProductivityPaneEnable);
    await macrosAdminPage.disableLayoutImprovements(adminPage);
  });

  ///<summary>
  ///Test Case 1942193: [Multi Session][Productivity Pane] Productivity pane expanded once existing case is open
  ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_testPlans/execute?planId=2627279&suiteId=2627282
  ///</summary>
  it("Test Case 1942193: [Multi Session][Productivity Pane] Productivity pane expanded once existing case is open", async () => {
    rnd = agentScriptAdminPage.RandomNumber();

    //Login as admin and create cases
    await agentChat.navigateToOrgUrlAndSignIn(
      TestSettings.AdminAccountEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToCustomerServiceWorkspace();
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage)
    await agentChat.waitforTimeout();

    var CaseUserName = Constants.XRMCaseName + rnd;
    var CaseUserName2 = Constants.XRMCaseName2 + rnd;

    caseNameList = [CaseUserName, CaseUserName2];

    await macrosAdminPage.createIncidents(agentChat, caseNameList);

    //Initiate two Sessions and Validate Productivity pane
    await macrosAdminPage.InitiateSession(
      CaseUserName,
      stringFormat(Constants.XRMSpecificCaseLink1, rnd)
    );

    await macrosAdminPage.GoToHome();
    await macrosAdminPage.InitiateSession(
      CaseUserName2,
      stringFormat(Constants.XRMSpecificCaseLink2, rnd)
    );
    await macrosAdminPage.SwitchBackToPreviousSession(stringFormat(Constants.XRMSpecificCaseLink1, rnd));
    await macrosAdminPage.isElementVisible(Constants.ProductivityPaneEnable);
    await macrosAdminPage.SwitchBackToPreviousSession(stringFormat(Constants.XRMSpecificCaseLink2, rnd));
    await macrosAdminPage.isElementVisible(Constants.ProductivityPaneEnable);
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
  ///Test Case 1942183: [Multi Session] Email state persistence in multisession
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1942183
  ///</summary>
  it("Test Case 1942183: [Multi Session] Email state persistence in multisession", async () => {
    agentPage = await agentContext.newPage();
    try {
      //Login as admin and create
      await adminStartPage.navigateToOrgUrlAndSignIn(
        TestSettings.MultiSessionEmail,
        TestSettings.AdminAccountPassword
      );
      await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
      await macrosAdminPage.createCase(Constants.CaseTitleName);
      await macrosAdminPage.createCase(Constants.CaseTitleName2);
      //Initiate session
      await macrosAdminPage.openAppLandingPage(adminPage);
      await adminStartPage.goToCustomerServiceWorkspace();
      await macrosAdminPage.InitiateSession(
        Constants.CaseTitleName,
        Constants.CaseLink1
      );
      //Open Email Editor and fill data
      await macrosAdminPage.EmailEditor();
      //Initiate session
      await macrosAdminPage.GoToHome();
      await macrosAdminPage.InitiateSession(
        Constants.CaseTitleName2,
        Constants.CaseLink2
      );
      //switch to previous session and validate
      await macrosAdminPage.SwitchBackToPreviousSession(Constants.Firstcase);
      await macrosAdminPage.ValidateThePage(Constants.FocusOnEmailTab);
    } finally {
      await macrosAdminPage.deleteCaseInCSH(
        adminPage,
        adminStartPage,
        Constants.CaseTitleName
      );
      await macrosAdminPage.deleteCaseInCSH(
        adminPage,
        adminStartPage,
        Constants.CaseTitleName2
      );
    }
  });

  ///<summary>
  ///Test Case 1942180: [Multi Session] Open Customer Service workspace as an agent
  ///Test Case Link  https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1942180
  ///<summary>
  it("Test Case 1942180: [Multi Session] Open Customer Service workspace as an agent", async () => {
    agentPage = await agentContext.newPage();
    liveChatPage = new LiveChatPage(await liveChatContext.newPage());
    try {
      //Login as crmadmin
      await adminStartPage.navigateToOrgUrlAndSignIn(
        TestSettings.MultiSessionEmail,
        TestSettings.AdminAccountPassword
      );
      await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
      // await adminStartPage.waitForAgentStatusIcon();
      //validate page
      await macrosAdminPage.ValidateDashboard(
        Constants.ValidateServiceAgentDashboard
      );
    } finally {
    }
  });

  ///<summary>
  ///Test Case 1942179: [Multi Session] Verify General multisession navigation
  ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_testPlans/execute?planId=2627279&suiteId=2627282
  ///</summary>
  it("Test Case 1942179: [Multi Session] Verify General multisession navigation", async () => {
    rnd = agentScriptAdminPage.RandomNumber();

    //Login as admin and create cases
    await agentChat.navigateToOrgUrlAndSignIn(
      TestSettings.MultiSessionEmail,
      TestSettings.AdminAccountPassword
    );

    await agentChat.goToMyApp(Constants.CustomerServiceWorkspace);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);

    var CaseUserName = Constants.XRMCaseName + rnd;
    var CaseUserName2 = Constants.XRMCaseName2 + rnd;

    caseNameList = [CaseUserName, CaseUserName2];

    await macrosAdminPage.createIncidents(agentChat, caseNameList);

    //Initiate one Session and Tab
    await macrosAdminPage.InitiateSession(
      CaseUserName,
      stringFormat(Constants.XRMSpecificCaseLink1, rnd)
    );
    await macrosAdminPage.GoToHome();
    await macrosAdminPage.InitiateTab(
      CaseUserName2,
      stringFormat(Constants.XRMSpecificCaseLink2, rnd)
    );

    //Validating title of opened Session and Tab
    await macrosAdminPage.ValidateThePage(stringFormat(Constants.SpecificCaseTitleNameVal, CaseUserName));
    await macrosAdminPage.ValidateThePage(stringFormat(Constants.SpecificCaseTitleName2Val, CaseUserName2));
  });

  ///<summary>
  ///Test Case 1945916: [Multi Session] Verify Merge Operation on multiple cases from Case grid page and activities getting tied to primary case after merge.
  ///Test Case Link  https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1945916
  ///<summary>
  it("Test Case 1945916: [Multi Session] Verify Merge Operation on multiple cases from Case grid page and activities getting tied to primary case after merge.", async () => {
    agentPage = await agentContext.newPage();
    try {
      //Login as crmadmin
      await adminStartPage.navigateToOrgUrlAndSignIn(
        TestSettings.MultiSessionEmail,
        TestSettings.AdminAccountPassword
      );
      await adminPage.setViewportSize({ width: 1300, height: 600 }) //viewport is changed due to validations
      //Create two child Cases and one parent case
      await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
      await macrosAdminPage.createCase(Constants.FCase1);
      await macrosAdminPage.createCase(Constants.FCase2);
      await macrosAdminPage.createCase(Constants.FParent1);
      //Initiate first child case and add Note in it
      await macrosAdminPage.openAppLandingPage(adminPage);
      await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
      //   await adminStartPage.waitForAgentStatusIcon();
      await macrosAdminPage.InitiateSession(
        Constants.FCase1,
        Constants.ChildCaseLink1
      );
      await macrosAdminPage.AddNote(Constants.AddButton, Constants.Note);
      //Initiate secound child case and add post in it
      await macrosAdminPage.GoToHome();
      await macrosAdminPage.InitiateSession(
        Constants.FCase2,
        Constants.ChildCaseLink2
      );
      await macrosAdminPage.AddPost(Constants.AddButton, Constants.Post);
      //Go to cases grid and merge two child cases with one parent case
      await macrosAdminPage.GoToHome();
      await macrosAdminPage.GoToCases();
      await macrosAdminPage.MergeCases(Constants.First);
      //Open parent case and verify details
      await macrosAdminPage.ParentCaseDetails(Constants.First);
      await macrosAdminPage.VerifyParentCase();
    } finally {
      await macrosAdminPage.deleteCase(
        adminPage,
        adminStartPage,
        Constants.FCase1
      );
      await macrosAdminPage.deleteCase(
        adminPage,
        adminStartPage,
        Constants.FCase2
      );
      await macrosAdminPage.deleteCase(
        adminPage,
        adminStartPage,
        Constants.FParent1
      );
    }
  });

  ///<summary>
  ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1945661
  ///<summary>
  it("Test Case 1945661: [Multi Session] Verify Routing Rule on Case Form.", async () => {
    agentPage = await agentContext.newPage();
    liveChatPage = new LiveChatPage(await liveChatContext.newPage());
    try {
      //Login as Admin and create public queue and routing rule
      await adminStartPage.navigateToOrgUrlAndSignIn(
        TestSettings.MultiSessionEmail,
        TestSettings.AdminAccountPassword
      );
      await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
      await macrosAdminPage.GoToServiceManagement();
      await macrosAdminPage.CreatePublicQueue(Constants.QueueTitle);
      await macrosAdminPage.CreateRoutingRole(
        Constants.RuleName,
        Constants.RuleItemName,
        Constants.QueueTitle
      );
      await adminPage.waitForTimeout(2000);

      // Navigate to CSW and create case
      await macrosAdminPage.openAppLandingPage(adminPage);
      await adminStartPage.goToCustomerServiceWorkspace();
      await macrosAdminPage.createCaseFromCSWSiteMap(Constants.CaseTitleName);
      await adminPage.waitForTimeout(2000);
      await macrosAdminPage.AddPriorityToCase();

      // Save and Route the case and validate it
      await macrosAdminPage.SaveAndRoute(
        Constants.CaseTitleName,
        Constants.CaseLink1
      );
      await adminPage.waitForTimeout(2000);
      await macrosAdminPage.ValidateTimeLine(Constants.QueueLinkTitle);
      await macrosAdminPage.GoToHome();
      await macrosAdminPage.InitiateTab(
        Constants.CaseTitleName,
        Constants.CaseLink1
      );
      await macrosAdminPage.ValidateTimeLine(Constants.QueueLinkTitle);
      await macrosAdminPage.SaveAndRouteInTab();
      await macrosAdminPage.ValidateTimeLine(Constants.QueueLinkTitle);
    } finally {
      await macrosAdminPage.deleteRoutingRule(
        adminPage,
        adminStartPage,
        Constants.RuleName
      );
      await macrosAdminPage.deleteCase(
        adminPage,
        adminStartPage,
        Constants.CaseTitleName
      );
      await macrosAdminPage.deleteQueue(
        adminPage,
        adminStartPage,
        Constants.QueueTitle
      );
    }
  });

  ///<summary>
  ///Test Case 1945699: [Multi Session] Verify Case creation along with timeline wall
  ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1945699
  ///<summary>
  it("Test Case 1945699: [Multi Session] Verify Case creation along with timeline wall", async () => {
    rnd = agentScriptAdminPage.RandomNumber();

    await agentChat.navigateToOrgUrlAndSignIn(
      TestSettings.MultiSessionEmail,
      TestSettings.AdminAccountPassword
    );

    await agentChat.goToMyApp(Constants.CustomerServiceWorkspace);
    await agentChat.waitforTimeout();

    var CaseUserName = Constants.XRMCaseName + rnd;
    caseNameList = [CaseUserName];

    await macrosAdminPage.createIncidents(agentChat, caseNameList);

    await macrosAdminPage.InitiateSession(
      CaseUserName,
      stringFormat(Constants.XRMSpecificCaseLink1, rnd)
    );
    await macrosAdminPage.ValidateThePage(Constants.CaseStatusInProgress);
    await macrosAdminPage.ValidateTimeLine(Constants.CaseCreated);

    // Resolve Case and Validate the Page
    await macrosAdminPage.ResolvecaseAsInformation(
      Constants.ResolutionTypeInputField,
      Constants.AutomationResolutionField
    );
    await macrosAdminPage.ValidateThePage(
      Constants.CaseStatusInformationProvided
    );
    await macrosAdminPage.ValidateThePage(Constants.CaseResolved);
    await macrosAdminPage.ValidateTimeLine(Constants.CaseClosed);
    await macrosAdminPage.ValidateThePage(Constants.FormISReadonly);
    await macrosAdminPage.GoToMoreCommands();
    await macrosAdminPage.ValidateNotPresent(Constants.ResolveCaseBtn);
    await macrosAdminPage.ValidateNotPresent(Constants.CancleCaseBtn);

    // Reactivate Case and Validate it
    await macrosAdminPage.ReactivateCase();
    await macrosAdminPage.ValidateThePage(Constants.CaseStatusInProgress);
    await macrosAdminPage.ValidateTimeLine(Constants.ValidateReactivateCase);
    await macrosAdminPage.GoToMoreCommands();
    await macrosAdminPage.ValidateNotPresent(Constants.ReactivateBtn);

    // Cancel Case and validate it
    await macrosAdminPage.CancelCase();
    await macrosAdminPage.ValidateThePage(Constants.CaseStatusCancelled);
    await macrosAdminPage.ValidateTimeLine(Constants.CaseClosed);
    await macrosAdminPage.ValidateThePage(Constants.FormISReadonly);
    await macrosAdminPage.GoToMoreCommands();
    await macrosAdminPage.ValidateNotPresent(Constants.ResolveCaseBtn);
    await macrosAdminPage.ValidateNotPresent(Constants.CancleCaseBtn);

    // Reactivate Case and validate it
    await macrosAdminPage.ReactivateCase();
    await macrosAdminPage.ValidateThePage(Constants.CaseStatusInProgress);
    await macrosAdminPage.ValidateTimeLine(Constants.ValidateReactivateCase);
    await macrosAdminPage.GoToMoreCommands();
    await macrosAdminPage.ValidateNotPresent(Constants.ReactivateBtn);

    // Initiate Existing Session
    await macrosAdminPage.GoToHome();
    await macrosAdminPage.InitiateSession(
      CaseUserName,
      stringFormat(Constants.XRMSpecificCaseLink1, rnd)
    );
    await macrosAdminPage.ValidateThePage(Constants.CaseStatusInProgress);
    await macrosAdminPage.ValidateTimeLine(Constants.CaseCreated);

    // Resolve Case and validate it
    await macrosAdminPage.ResolvecaseAsInformation(
      Constants.ResolutionTypeInputField,
      Constants.AutomationResolutionField
    );
    await macrosAdminPage.ValidateThePage(
      Constants.CaseStatusInformationProvided
    );
    await macrosAdminPage.ValidateThePage(Constants.CaseResolved);
    await macrosAdminPage.ValidateTimeLine(Constants.CaseClosed);
    await macrosAdminPage.ValidateThePage(Constants.FormISReadonly);
    await macrosAdminPage.GoToMoreCommands();
    await macrosAdminPage.ValidateNotPresent(Constants.ResolveCaseBtn);
    await macrosAdminPage.ValidateNotPresent(Constants.CancleCaseBtn);

    // Reactivate case and validate it
    await macrosAdminPage.ReactivateCase();
    await macrosAdminPage.ValidateThePage(Constants.CaseStatusInProgress);
    await macrosAdminPage.ValidateTimeLine(Constants.ValidateReactivateCase);
    await macrosAdminPage.GoToMoreCommands();
    await macrosAdminPage.ValidateNotPresent(Constants.ReactivateBtn);

    // Cancel case and validate it
    await macrosAdminPage.CancelCase();
    await macrosAdminPage.ValidateThePage(Constants.CaseStatusCancelled);
    await macrosAdminPage.ValidateTimeLine(Constants.CaseClosed);
    await macrosAdminPage.ValidateThePage(Constants.FormISReadonly);
    await macrosAdminPage.GoToMoreCommands();
    await macrosAdminPage.ValidateNotPresent(Constants.ResolveCaseBtn);
    await macrosAdminPage.ValidateNotPresent(Constants.CancleCaseBtn);

    // Reactivate case and validate it
    await macrosAdminPage.ReactivateCase();
    await macrosAdminPage.ValidateThePage(Constants.CaseStatusInProgress);
    await macrosAdminPage.ValidateTimeLine(Constants.ValidateReactivateCase);
    await macrosAdminPage.GoToMoreCommands();
    await macrosAdminPage.ValidateNotPresent(Constants.ReactivateBtn);
  });

  ///<summary>
  ///Test Case 1945864: [Multi Session] Creation of Queue and able to add case/activities to queue and perform Queue operation(Route/ pick/Release/remove) with users (CSR & CSM)
  ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1945864s
  ///<summary>
  it("Test Case 1945864: [Multi Session] Creation of Queue and able to add case/activities to queue and perform Queue operation(Route/ pick/Release/remove) with users (CSR & CSM)", async () => {
    agentPage = await agentContext.newPage();
    liveChatPage = new LiveChatPage(await liveChatContext.newPage());
    try {
      // //Login as Admin
      await adminStartPage.navigateToOrgUrlAndSignIn(
        TestSettings.MultiSessionEmail,
        TestSettings.AdminAccountPassword
      );
      await adminPage.setViewportSize({ width: 1300, height: 600 });
      await adminStartPage.goToMyApp(Constants.CustomerServiceHub);

      //Create Private Queues
      await macrosAdminPage.GoToServiceManagement();
      await macrosAdminPage.CreatePrivateQueue(Constants.QueueTitle);
      await macrosAdminPage.CreatePrivateQueue(Constants.QueueTitle2);

      // navigate to CSW, add private queue and Validate it
      await macrosAdminPage.openAppLandingPage(adminPage);
      await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
      await macrosAdminPage.CreateCaseInCSW(Constants.CaseTitleName);
      await macrosAdminPage.InitiateSession(
        Constants.CaseTitleName,
        Constants.CaseLink1
      );
      await macrosAdminPage.ValidateThePage(Constants.VerifyCreated);
      await macrosAdminPage.AddCaseToQueue(Constants.QueueTitle);
      await macrosAdminPage.QueueItemDetails();
      await macrosAdminPage.ValidateThePage(Constants.QueueLinkTitle);
      await macrosAdminPage.SaveAndClose(Constants.SaveAndCloseQueueItem);
      await macrosAdminPage.ValidateTimeLine(Constants.QueueLinkTitle);

      // Create Task and add private queue to it
      await macrosAdminPage.GoToHome();
      await macrosAdminPage.CreateTask(Constants.TaskTitle);
      await macrosAdminPage.ValidateThePage(Constants.VerifyCreated);
      await macrosAdminPage.AddTaskToQueue(Constants.QueueTitle2);

      //Perform Operations on created Case
      await macrosAdminPage.GoToHome();
      await macrosAdminPage.OpenQueuesFromCWS(Constants.AllQueues);
      await macrosAdminPage.ValidateThePage(Constants.CaseLink1);
      await macrosAdminPage.SelectRow(Constants.CaseTitleName);
      await macrosAdminPage.ClickRouteOperation(Constants.QueueTitle2);
      await macrosAdminPage.ValidateThePage(Constants.QueueLinkTitle2);
      await macrosAdminPage.ClickOperation(
        Constants.Pick,
        Constants.ConfirmPickOperation
      );
      await macrosAdminPage.ValidateThePage(stringFormat(Constants.CSMOwner, TestSettings.InboxUser2));
      await macrosAdminPage.ClickOperation(
        Constants.Release,
        Constants.ConfirmReleaseOperation
      );
      await macrosAdminPage.ValidateNotPresent(stringFormat(Constants.CSMOwner, TestSettings.InboxUser2));
      await macrosAdminPage.ClickReleaseOperation(
        Constants.Remove,
        Constants.ConfirmRemoveOperation
      );
      await macrosAdminPage.ValidateNotPresent(Constants.CaseTitleName);

      //Perform Operations on Created Task
      await macrosAdminPage.ValidateThePage(Constants.TaskBtn);
      await macrosAdminPage.SelectRow(Constants.TaskTitle);
      await macrosAdminPage.ClickRouteOperation(Constants.QueueTitle);
      await macrosAdminPage.ValidateThePage(Constants.QueueLinkTitle);
      await macrosAdminPage.ClickOperation(
        Constants.Pick,
        Constants.ConfirmPickOperation
      );
      await macrosAdminPage.ValidateThePage(stringFormat(Constants.CSMOwner, TestSettings.InboxUser2));
      await macrosAdminPage.ClickOperation(
        Constants.Release,
        Constants.ConfirmReleaseOperation
      );
      await macrosAdminPage.ValidateNotPresent(stringFormat(Constants.CSMOwner, TestSettings.InboxUser2));
      await macrosAdminPage.ClickReleaseOperation(
        Constants.Remove,
        Constants.ConfirmRemoveOperation
      );
      await macrosAdminPage.ValidateNotPresent(Constants.TaskTitle);

      // Navigate to CSH and create Public queues
      await macrosAdminPage.openAppLandingPage(adminPage);
      await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
      await macrosAdminPage.GoToServiceManagement();
      await macrosAdminPage.CreatePublicQueue(Constants.QueueTitle3);
      await macrosAdminPage.CreatePublicQueue(Constants.QueueTitle4);

      // Navigate to CSE and add public queue to Case
      await macrosAdminPage.openAppLandingPage(adminPage);
      await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
      await macrosAdminPage.CreateCaseInCSW(Constants.CaseTitleName2);
      await macrosAdminPage.InitiateSession(
        Constants.CaseTitleName2,
        Constants.CaseLink2
      );
      await macrosAdminPage.ValidateThePage(Constants.VerifyCreated);
      await macrosAdminPage.AddCaseToQueue(Constants.QueueTitle3);
      await macrosAdminPage.QueueItemDetails();
      await macrosAdminPage.ValidateThePage(Constants.QueueLinkTitle3);
      await macrosAdminPage.SaveAndClose(Constants.SaveAndCloseQueueItem);
      await macrosAdminPage.ValidateTimeLine(Constants.QueueLinkTitle3);

      // Create Task and add public queue
      await macrosAdminPage.GoToHome();
      await macrosAdminPage.CreateTask(Constants.TaskTitle2);
      await macrosAdminPage.ValidateThePage(Constants.VerifyCreated);
      await macrosAdminPage.AddTaskToQueue(Constants.QueueTitle4);

      //Perform operations on case
      await macrosAdminPage.GoToHome();
      await macrosAdminPage.OpenQueuesFromCWS(Constants.AllQueues);
      await macrosAdminPage.ValidateThePage(Constants.CaseLink2);
      await macrosAdminPage.SelectRow(Constants.CaseTitleName2);
      await macrosAdminPage.ClickRouteOperation(Constants.QueueTitle4);
      await macrosAdminPage.ValidateThePage(Constants.QueueLinkTitle4);
      await macrosAdminPage.ClickOperation(
        Constants.Pick,
        Constants.ConfirmPickOperation
      );
      await macrosAdminPage.ValidateThePage(stringFormat(Constants.CSMOwner, TestSettings.InboxUser2));
      await macrosAdminPage.ClickOperation(
        Constants.Release,
        Constants.ConfirmReleaseOperation
      );
      await macrosAdminPage.ValidateNotPresent(stringFormat(Constants.CSMOwner, TestSettings.InboxUser2));
      await macrosAdminPage.ClickReleaseOperation(
        Constants.Remove,
        Constants.ConfirmRemoveOperation
      );
      await macrosAdminPage.ValidateNotPresent(Constants.CaseTitleName2);

      //Perform Operations on Task
      await macrosAdminPage.ValidateThePage(Constants.TaskLinkTitle2);
      await macrosAdminPage.SelectRow(Constants.TaskTitle2);
      await macrosAdminPage.ClickRouteOperation(Constants.QueueTitle3);
      await macrosAdminPage.ValidateThePage(Constants.QueueLinkTitle3);
      await macrosAdminPage.ClickOperation(
        Constants.Pick,
        Constants.ConfirmPickOperation
      );
      await macrosAdminPage.ValidateThePage(stringFormat(Constants.CSMOwner, TestSettings.InboxUser2));
      await macrosAdminPage.ClickOperation(
        Constants.Release,
        Constants.ConfirmReleaseOperation
      );
      await macrosAdminPage.ValidateNotPresent(stringFormat(Constants.CSMOwner, TestSettings.InboxUser2));
      await macrosAdminPage.ClickReleaseOperation(
        Constants.Remove,
        Constants.ConfirmRemoveOperation
      );
      await macrosAdminPage.ValidateNotPresent(Constants.TaskTitle2);
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
      await macrosAdminPage.deleteTask(
        adminPage,
        adminStartPage,
        Constants.TaskTitle
      );
      await macrosAdminPage.deleteTask(
        adminPage,
        adminStartPage,
        Constants.TaskTitle2
      );
      await macrosAdminPage.deleteQueue(
        adminPage,
        adminStartPage,
        Constants.QueueTitle
      );
      await macrosAdminPage.deleteQueue(
        adminPage,
        adminStartPage,
        Constants.QueueTitle2
      );
      await macrosAdminPage.deleteQueue(
        adminPage,
        adminStartPage,
        Constants.QueueTitle3
      );
      await macrosAdminPage.deleteQueue(
        adminPage,
        adminStartPage,
        Constants.QueueTitle4
      );
    }
  });

  ///<summary>
  ///Test Case 1945833: [Multi Session] Verify Case Entitlements.
  ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1945833
  ///</summary>
  it("Test Case 1945833: [Multi Session] Verify Case Entitlements", async () => {
    agentPage = await agentContext.newPage();
    liveChatPage = new LiveChatPage(await liveChatContext.newPage());
    await adminStartPage.navigateToOrgUrlAndSignIn(TestSettings.MultiSessionEmail, TestSettings.AdminAccountPassword);
    await adminPage.setViewportSize({ width: 1300, height: 600 });// viewport changed due to UI validation
    await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
    await macrosAdminPage.GoToServiceManagement();

    //creating Entitlements
    await macrosAdminPage.CreateEntitlements(Constants.EntName1);
    await macrosAdminPage.DecRemainingOnForCaseCreation();
    await macrosAdminPage.Totalterms(Constants.TtermsforEnt);
    await macrosAdminPage.CreateEntitlements(Constants.EntName2);
    await macrosAdminPage.Totalterms(Constants.TtermsforEnt2);
    await macrosAdminPage.CreateEntitlements(Constants.EntName3);
    await macrosAdminPage.DecRemainingOnForCaseCreation();
    await macrosAdminPage.Totalterms(Constants.TtermsforEnt);

    //select Entitlements in case and verifying the Entitlement field
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await macrosAdminPage.createCaseFromCSWSiteMap(Constants.Case1);
    await macrosAdminPage.InitiateSession(Constants.Case1, Constants.CaseLink);
    await macrosAdminPage.GoToEntField();
    await macrosAdminPage.ChooseEntitlement(Constants.EntName1, Constants.ChooseEnt1);

    //verfying Emtitlement Remaining terms is decreased by 1
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
    await macrosAdminPage.GoToServiceManagement();
    await macrosAdminPage.OpenEntitlement(Constants.EntName1, Constants.ChooseEnt1);
    await macrosAdminPage.ValidateThePage(Constants.RemTermsInEnt1);
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await macrosAdminPage.InitiateSession(Constants.Case1, Constants.CaseLink);
    await macrosAdminPage.ChooseEnt1ToEnt2(Constants.ChooseEnt2);

    //verifing the case auto saved
    await macrosAdminPage.ValidateThePage(Constants.VerifyCreated);
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
    await macrosAdminPage.GoToServiceManagement();
    await macrosAdminPage.OpenEntitlement(Constants.EntName1, Constants.ChooseEnt1);

    //verifing the Entitlements remaining terms increased by 1
    await macrosAdminPage.ValidateThePage(Constants.RemTerms2InEnt1);
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await macrosAdminPage.InitiateSession(Constants.Case1, Constants.CaseLink);
    await macrosAdminPage.ResolveCase(Constants.ResolutionName);
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
    await macrosAdminPage.GoToServiceManagement();
    await macrosAdminPage.OpenEntitlement(Constants.EntName2, Constants.ChooseEnt2);

    //verfying Emtitlement Remaining terms is decreased by 1
    await macrosAdminPage.ValidateThePage(Constants.RemTermsInEnt2);
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await macrosAdminPage.OpenAllCases();
    await macrosAdminPage.InitiateSession(Constants.Case1, Constants.CaseLink);
    await macrosAdminPage.ReactivateCase();
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
    await macrosAdminPage.GoToServiceManagement();
    await macrosAdminPage.OpenEntitlement(Constants.EntName2, Constants.ChooseEnt2);

    //verifing the Entitlements remaining terms increased by 1
    await macrosAdminPage.ValidateThePage(Constants.RemTerms2InEnt2);
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await macrosAdminPage.InitiateSession(Constants.Case1, Constants.CaseLink);
    await macrosAdminPage.DoNotDecrementEntitlementTerms();
    await macrosAdminPage.ResolveCase(Constants.ResolutionName);
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
    await macrosAdminPage.GoToServiceManagement();
    await macrosAdminPage.OpenEntitlement(Constants.EntName2, Constants.ChooseEnt2);

    //verifing the Entitlements remaining terms is 10
    await macrosAdminPage.ValidateThePage(Constants.RemTerms2InEnt2);

    //create another case and select Entitlement
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await macrosAdminPage.createCaseFromCSWSiteMap(Constants.Case22);
    await macrosAdminPage.InitiateSession(Constants.Case2, Constants.CaseLink22);
    await macrosAdminPage.GoToEntField();
    await macrosAdminPage.ChooseEntitlement(Constants.EntName1, Constants.ChooseEnt1);
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
    await macrosAdminPage.GoToServiceManagement();
    await macrosAdminPage.OpenEntitlement(Constants.EntName1, Constants.ChooseEnt1);

    //verifing the Entitlements remaining terms decreased by 1
    await macrosAdminPage.ValidateThePage(Constants.RemTermsInEnt1);
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await macrosAdminPage.InitiateSession(Constants.Case2, Constants.CaseLink22);
    await macrosAdminPage.DoNotDecrementEntitlementTerms();
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
    await macrosAdminPage.GoToServiceManagement();
    await macrosAdminPage.OpenEntitlement(Constants.EntName1, Constants.ChooseEnt1);

    //verifing the Entitlements remaining terms count 20
    await macrosAdminPage.ValidateThePage(Constants.RemTerms2InEnt1);
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await macrosAdminPage.createCaseFromCSWSiteMap(Constants.AutomationCaseTitle);
    await macrosAdminPage.InitiateSession(Constants.AutomationCaseTitle, Constants.CaseLink1);
    await macrosAdminPage.GoToEntField();
    await macrosAdminPage.ChooseEntitlement(Constants.EntName3, Constants.ChooseEnt3);
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
    await macrosAdminPage.GoToServiceManagement();
    await macrosAdminPage.OpenEntitlement(Constants.EntName3, Constants.ChooseEnt3);

    //verifing the Entitlements remaining terms decreased by 1
    await macrosAdminPage.ValidateThePage(Constants.RemTermsInEnt3);
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await macrosAdminPage.InitiateTab(Constants.AutomationCaseTitle, Constants.CaseLink1);
    await macrosAdminPage.DoNotDecrementEntitlementTerms();
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
    await macrosAdminPage.GoToServiceManagement();
    await macrosAdminPage.OpenEntitlement(Constants.EntName3, Constants.ChooseEnt3);

    //verifing the Entitlements remaining terms count 20
    await macrosAdminPage.ValidateThePage(Constants.RemTerms2InEnt3);
  });
});
