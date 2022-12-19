import { BrowserContext, Page } from "playwright";
import { Constants } from "../../common/constants";
import { LiveChatPage } from "../../../pages/LiveChat";
import { Macros } from "../../macropages/macrosAdmin";
import { OrgDynamicsCrmStartPage } from "../../../pages/org-dynamics-crm-start.page";
import { TestHelper } from "../../../helpers/test-helper";
import { TestSettings } from "../../../configuration/test-settings";
import { AppProfileHelper } from "helpers/appprofile-helper";
import { stringFormat } from "../../../Utility/Constants";
import { AgentScript } from "../../../integration-tests/agentScript/pages/agentScriptAdmin";
import { AgentChat } from "../../../pages/AgentChat";
import { ConstantMS } from "../MultiSessionTestcases/msConstants";
import { FunctionMS } from "../MultiSessionTestcases/msFunction";

describe("Multi Session - ", () => {
  let adminContext: BrowserContext;
  let adminPage: Page;
  let adminStartPage: OrgDynamicsCrmStartPage;
  let agentPage: Page;
  let agentChat: AgentChat;
  let agentContext: BrowserContext;
  let liveChatContext: BrowserContext;
  let liveChatPage: LiveChatPage;
  let macrosAdminPage: Macros;
  let rnd: any;
  const agentScriptAdminPage = new AgentScript(adminPage);
  var caseNameList: string[] = [];
  let msessionAdminPage: FunctionMS;

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
    agentChat = new AgentChat(adminPage);
    msessionAdminPage = new FunctionMS(adminPage);
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

    //Login as admin
    await adminStartPage.navigateToOrgUrlAndSignIn(
      TestSettings.MultiSessionEmail,
      TestSettings.AdminAccountPassword
    );

    //Validating Customer Service Dashboard
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await macrosAdminPage.ValidateDashboard(
      Constants.CustomerServiceManagerDashBoard
    );
  });

  ///<summary>
  ///Test Case 1945844: [Multi Session] Verify the Subject functionality
  ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1945844
  ///</summary>
  it("Test Case 1945844: [Multi Session] Verify the Subject functionality", async () => {
    rnd = agentScriptAdminPage.RandomNumber();
    await adminStartPage.navigateToOrgUrlAndSignIn(
      TestSettings.MultiSessionEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);

    await macrosAdminPage.CreateSubjectsFromHub(
      Constants.SubjectName,
      Constants.SubjectName2,
      Constants.SubjectName3
    );
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await adminStartPage.waitForAgentStatusIcon();

    //Creating case
    await macrosAdminPage.CreateCaseForSubjectsInCSW(
      Constants.CaseTitleName2 + rnd,
      Constants.SubjectName
    );
    await macrosAdminPage.InitiateSession(
      Constants.CaseTitleName2 + rnd,
      stringFormat(Constants.SpecificCaseLink2, rnd)
    );

    //Validating subject field
    await macrosAdminPage.ValidateThePage(Constants.CWSSubjectInputField);
    await macrosAdminPage.ValidateSubjectField();

    await macrosAdminPage.GoToHome();
    await macrosAdminPage.InitiateTab(
      Constants.CaseTitleName2 + rnd,
      stringFormat(Constants.SpecificCaseLink2, rnd)
    );

    //Validating subject field
    await macrosAdminPage.ValidateThePage(Constants.CWSSubjectInputField);
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
    await agentChat.waitforTimeout();

    var CaseTitleName = Constants.CaseTitleName + rnd;
    var CaseTitleName2 = Constants.CaseTitleName2 + rnd;

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
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage)

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
    await macrosAdminPage.ValidateThePage(
      stringFormat(Constants.TitleTag, CaseUserName)
    );
    await macrosAdminPage.ValidateThePage(
      stringFormat(Constants.TitleTag, Constants.XRMContact)
    );
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
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage)
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
      TestSettings.MacroAccountEmail,
      TestSettings.AdminAccountPassword
    );
    await agentChat.goToMyApp(Constants.CustomerServiceWorkspace);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);

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
    await macrosAdminPage.ValidateThePage(Constants.ResolveStatemant);

    //Reactivate case and Validate
    await macrosAdminPage.ReactivateCase();
    await macrosAdminPage.ValidateTimeLine(Constants.ValidateReactivateCase1);

    //Cancel case and validate
    await macrosAdminPage.CancelCase();
    await macrosAdminPage.ValidateTimeLine(Constants.ValidateReactivateCase1);

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
    await macrosAdminPage.ValidateTimeLine(Constants.CaseResolved);

    //Reactivate case and Validate
    await macrosAdminPage.ReactivateCase();
    await macrosAdminPage.ValidateTimeLine(Constants.ValidateReactivateCase);
    //Cancel case and validate
    await macrosAdminPage.CancelCase();
    await macrosAdminPage.ValidateTimeLine(Constants.CanceledCase);
    await macrosAdminPage.ReactivateCase();
  });

  ///<summary>
  ///Test Case 1942194: [Multi Session][Productivity Pane] Productivity pane maintains collapsed state during session switch events
  ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1942194
  ///</summary>
  it("Test Case 1942194: [Multi Session][Productivity Pane] Productivity pane maintains collapsed state during session switch events", async () => {
    rnd = agentScriptAdminPage.RandomNumber();
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
    await macrosAdminPage.SwitchBackToPreviousSession(
      stringFormat(Constants.XRMSpecificCaseLink1, rnd)
    );
    await macrosAdminPage.ValidateThePage(Constants.ProductivityPaneEnable);
  });

  ///<summary>
  ///Test Case 1942193: [Multi Session][Productivity Pane] Productivity pane expanded once existing case is open
  ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_testPlans/execute?planId=2627279&suiteId=2627282
  ///</summary>
  it("Test Case 1942193: [Multi Session][Productivity Pane] Productivity pane expanded once existing case is open", async () => {
    rnd = agentScriptAdminPage.RandomNumber();

    //Login as admin and create cases
    await agentChat.navigateToOrgUrlAndSignIn(
      TestSettings.MultiSessionEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToCustomerServiceWorkspace();
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
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
    await macrosAdminPage.SwitchBackToPreviousSession(
      stringFormat(Constants.XRMSpecificCaseLink1, rnd)
    );
    await macrosAdminPage.isElementVisible(Constants.ProductivityPaneEnable);
    await macrosAdminPage.SwitchBackToPreviousSession(
      stringFormat(Constants.XRMSpecificCaseLink2, rnd)
    );
    await macrosAdminPage.isElementVisible(Constants.ProductivityPaneEnable);
  });

  ///<summary>
  ///Test Case 1942192: [Multi Session] View CSM dashboards
  ///Test Case Link  https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1942192
  ///<summary>
  it("Test Case 1942192: [Multi Session] View CSM dashboards", async () => {
    agentPage = await agentContext.newPage();
    liveChatPage = new LiveChatPage(await liveChatContext.newPage());
    //Login as crmadmin
    await adminStartPage.navigateToOrgUrlAndSignIn(
      TestSettings.MultiSessionEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await macrosAdminPage.ClickDropDown(Constants.DashboardSelector);
    //Validate page
    await macrosAdminPage.ValidateThePage(Constants.ServiceManagerDashboard);
    await macrosAdminPage.ValidateThePage(
      Constants.ServiceOperationsDashboard
    );
    await macrosAdminPage.ValidateThePage(
      Constants.ServicePerformanceDashboard
    );
  });

  ///<summary>
  ///Test Case 1942183: [Multi Session] Email state persistence in multisession
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1942183
  ///</summary>
  it("Test Case 1942183: [Multi Session] Email state persistence in multisession", async () => {
    rnd = agentScriptAdminPage.RandomNumber();
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
    await macrosAdminPage.InitiateSession(
      CaseUserName,
      stringFormat(Constants.XRMSpecificCaseLink1, rnd)
    );

    //Open Email Editor and fill data
    await macrosAdminPage.EmailEditor();

    //Initiate session
    await macrosAdminPage.GoToHome();
    await macrosAdminPage.InitiateSession(
      CaseUserName2,
      stringFormat(Constants.XRMSpecificCaseLink2, rnd)
    );

    //switch to previous session and validate
    await macrosAdminPage.SwitchBackToPreviousSession(stringFormat(Constants.SpecificCaseTitleNameVal, CaseUserName));
    await macrosAdminPage.ValidateThePage(Constants.FocusOnEmailTab);
  });

  ///<summary>
  ///Test Case 1942180: [Multi Session] Open Customer Service workspace as an agent
  ///Test Case Link  https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1942180
  ///<summary>
  it("Test Case 1942180: [Multi Session] Open Customer Service workspace as an agent", async () => {
    liveChatPage = new LiveChatPage(await liveChatContext.newPage());

    //Login as crmadmin
    await adminStartPage.navigateToOrgUrlAndSignIn(
      TestSettings.MultiSessionEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);

    //Validate page
    await macrosAdminPage.ValidateDashboard(
      Constants.ValidateServiceAgentDashboard
    );
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
    await macrosAdminPage.ValidateThePage(
      stringFormat(Constants.SpecificCaseTitleNameVal, CaseUserName)
    );
    await macrosAdminPage.ValidateThePage(
      stringFormat(Constants.SpecificCaseTitleName2Val, CaseUserName2)
    );
  });

  ///<summary>
  ///Test Case 1945916: [Multi Session] Verify Merge Operation on multiple cases from Case grid page and activities getting tied to primary case after merge.
  ///Test Case Link  https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1945916
  ///<summary>
  it("Test Case 1945916: [Multi Session] Verify Merge Operation on multiple cases from Case grid page and activities getting tied to primary case after merge.", async () => {
    await agentChat.navigateToOrgUrlAndSignIn(
      TestSettings.MultiSessionEmail,
      TestSettings.AdminAccountPassword
    );
    await adminPage.setViewportSize({ width: 1300, height: 850 });// viewport changed due to UI validation
    await agentChat.goToMyApp(Constants.CustomerServiceWorkspace);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage)

    await agentChat.waitForAgentStatusIcon();
    await agentChat.waitForAgentStatus();
    await agentChat.setAgentStatusToAvailable();

    var CaseUserName = Constants.FParent1
    var CaseUserName2 = Constants.FCase1;
    var CaseUserName3 = Constants.FCase2;

    caseNameList = [CaseUserName, CaseUserName2, CaseUserName3];

    //Create two child cases and one parent case
    await macrosAdminPage.createIncidents(agentChat, caseNameList);

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
    await macrosAdminPage.MergeCasesIntoParent(Constants.First);

    //Open parent case and verify details
    await macrosAdminPage.ParentCaseDetails(Constants.First);
    await macrosAdminPage.VerifyParentCase();
  });

  ///<summary>
  ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1945661
  ///<summary>
  it("Test Case 1945661: [Multi Session] Verify Routing Rule on Case Form.", async () => {
    rnd = agentScriptAdminPage.RandomNumber();
    await agentChat.navigateToOrgUrlAndSignIn(
      TestSettings.MultiSessionEmail,
      TestSettings.AdminAccountPassword
    );
    await agentChat.goToMyApp(Constants.CustomerServiceHub);
    await macrosAdminPage.GoToServiceManagement();
    await macrosAdminPage.CreatePublicQueue(Constants.UserQueue + rnd);
    await macrosAdminPage.CreateRoutingRule(
      Constants.RuleName,
      Constants.RuleItemName,
      Constants.UserQueue + rnd,
      rnd
    );
    await adminPage.waitForTimeout(2000);

    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await macrosAdminPage.createCaseFromCSWSiteMap(Constants.CaseTitleName + rnd);

    await macrosAdminPage.AddPriorityToCase();

    // Save and Route the case and validate it
    await macrosAdminPage.SaveAndRoute(
      Constants.CaseTitleName + rnd,
      stringFormat(Constants.SpecificCaseLink1, rnd)
    );
    await adminPage.waitForTimeout(2000);
    await macrosAdminPage.ValidateTimeLine(stringFormat(Constants.TextTag, Constants.UserQueue + rnd));

    await macrosAdminPage.GoToHome();
    await macrosAdminPage.InitiateTab(
      Constants.CaseTitleName + rnd,
      stringFormat(Constants.SpecificCaseLink1, rnd)
    );
    await macrosAdminPage.ValidateTimeLine(stringFormat(Constants.TextTag, Constants.UserQueue + rnd));
    await macrosAdminPage.SaveAndRouteInTab(rnd);
    await macrosAdminPage.ValidateTimeLine(stringFormat(Constants.TextTag, Constants.UserQueue + rnd));
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
    await macrosAdminPage.ResolveCaseAsInformation(
      Constants.ResolutionTypeInputField,
      Constants.AutomationResolutionField
    );
    await macrosAdminPage.ValidateThePage(
      Constants.CaseStatusInformationProvided
    );
    await macrosAdminPage.ValidateThePage(Constants.CaseResolved);
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
    await macrosAdminPage.ResolveCaseAsInformation(
      Constants.ResolutionTypeInputField,
      Constants.AutomationResolutionField
    );
    await macrosAdminPage.ValidateThePage(
      Constants.CaseStatusInformationProvided
    );
    await macrosAdminPage.ValidateThePage(Constants.CaseResolved);
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
  ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1945864
  ///<summary>
  it("Test Case 1945864: [Multi Session] Creation of Queue and able to add case/activities to queue and perform Queue operation(Route/ pick/Release/remove) with users (CSR & CSM)", async () => {
    agentPage = await agentContext.newPage();
    rnd = agentScriptAdminPage.RandomNumber();
    liveChatPage = new LiveChatPage(await liveChatContext.newPage());
    const CaseTitleName = Constants.CaseTitleName + rnd;
    try {
      // //Login as Admin
      await adminStartPage.navigateToOrgUrlAndSignIn(
        TestSettings.MultiSessionEmail,
        TestSettings.AdminAccountPassword
      );
      await adminPage.setViewportSize({ width: 1300, height: 600 });
      await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
      await adminStartPage.waitForDomContentLoaded();
      await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
      // Create a Private Queue
      await macrosAdminPage.navigateToBasicQueues();
      await macrosAdminPage.CreatePrivateQueue(Constants.QueueTitle);
      await macrosAdminPage.CreatePrivateQueue(Constants.QueueTitle2);

      // navigate to CSW, add private queue and Validate it
      await macrosAdminPage.openAppLandingPage(adminPage);
      await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
      await macrosAdminPage.CreateCaseInCSW(CaseTitleName);
      await macrosAdminPage.InitiateSession(
        CaseTitleName,
        stringFormat(Constants.SpecificCaseLink1, rnd)
      );
      await macrosAdminPage.ValidateThePage(Constants.VerifyCreated);
      await macrosAdminPage.AddCaseToQueue(Constants.QueueTitle);
      await macrosAdminPage.QueueItemDetails();
      await macrosAdminPage.ValidateThePage(Constants.QueueLinkTitle1);
      await macrosAdminPage.SaveAndClose(Constants.SaveAndCloseQueueItem1);
      await macrosAdminPage.ValidateTimeLine(Constants.QueueLinkTitle);

      // Create Task and add private queue to it
      await macrosAdminPage.CreateTask(Constants.TaskTitle);
      await macrosAdminPage.ValidateThePage(Constants.VerifyCreated);
      await macrosAdminPage.AddTaskToQueue(Constants.QueueTitle2);

      //Perform Operations on created Case
      await macrosAdminPage.GoToHome();
      await macrosAdminPage.OpenQueuesFromCWS(Constants.AllQueues);
      await macrosAdminPage.ValidateThePage(stringFormat(Constants.SpecificCaseLinkinQueItem, rnd));
      await macrosAdminPage.SelectRow(CaseTitleName);
      await macrosAdminPage.ClickRouteOperation(Constants.QueueTitle2);
      await macrosAdminPage.ValidateThePage(Constants.QueueLinkTitle2);
      await macrosAdminPage.ClickOperation(
        Constants.Pick,
        Constants.ConfirmPickOperation
      );
      await macrosAdminPage.ValidateThePage(
        stringFormat(Constants.CSMOwner, TestSettings.InboxUser2)
      );
      await macrosAdminPage.ClickOperation(
        Constants.Release,
        Constants.ConfirmReleaseOperation
      );
      await macrosAdminPage.ValidateNotPresent(
        stringFormat(Constants.CSMOwner, TestSettings.InboxUser2)
      );
      await macrosAdminPage.ClickReleaseOperation(
        Constants.Remove,
        Constants.ConfirmRemoveOperation
      );
      await macrosAdminPage.ValidateNotPresent(CaseTitleName);

      //Perform Operations on Created Task
      await macrosAdminPage.ValidateThePage(Constants.TaskBtn);
      await macrosAdminPage.SelectRow(Constants.TaskTitle);
      await macrosAdminPage.ClickRouteOperation(Constants.QueueTitle);
      await macrosAdminPage.ValidateThePage(Constants.QueueLinkTitle);
      await macrosAdminPage.ClickOperation(
        Constants.Pick,
        Constants.ConfirmPickOperation
      );
      await macrosAdminPage.ValidateThePage(
        stringFormat(Constants.CSMOwner, TestSettings.InboxUser2)
      );
      await macrosAdminPage.ClickOperation(
        Constants.Release,
        Constants.ConfirmReleaseOperation
      );
      await macrosAdminPage.ValidateNotPresent(
        stringFormat(Constants.CSMOwner, TestSettings.InboxUser2)
      );
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
      await macrosAdminPage.ValidateThePage(
        stringFormat(Constants.CSMOwner, TestSettings.InboxUser2)
      );
      await macrosAdminPage.ClickOperation(
        Constants.Release,
        Constants.ConfirmReleaseOperation
      );
      await macrosAdminPage.ValidateNotPresent(
        stringFormat(Constants.CSMOwner, TestSettings.InboxUser2)
      );
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
      await macrosAdminPage.ValidateThePage(
        stringFormat(Constants.CSMOwner, TestSettings.InboxUser2)
      );
      await macrosAdminPage.ClickOperation(
        Constants.Release,
        Constants.ConfirmReleaseOperation
      );
      await macrosAdminPage.ValidateNotPresent(
        stringFormat(Constants.CSMOwner, TestSettings.InboxUser2)
      );
      await macrosAdminPage.ClickReleaseOperation(
        Constants.Remove,
        Constants.ConfirmRemoveOperation
      );
      await macrosAdminPage.ValidateNotPresent(Constants.TaskTitle2);
    } finally {
    }
  });

  ///<summary>
  ///Test Case 1945833: [Multi Session] Verify Case Entitlements.
  ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1945833
  ///</summary>
  it("Test Case 1945833: [Multi Session] Verify Case Entitlements", async () => {
    rnd = agentScriptAdminPage.RandomNumber();
    agentPage = await agentContext.newPage();
    liveChatPage = new LiveChatPage(await liveChatContext.newPage());
    await adminStartPage.navigateToOrgUrlAndSignIn(TestSettings.MultiSessionEmail, TestSettings.AdminAccountPassword);
    await adminPage.setViewportSize({ width: 1300, height: 600 });// viewport changed due to UI validation
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdmincenter);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    const Entitlement1 = Constants.EntName1 + rnd;
    const Entitlement2 = Constants.EntName2 + rnd;
    const Entitlement3 = Constants.EntName3 + rnd;
    const Case1 = Constants.Case1 + rnd;
    const Case2 = Constants.Case22 + rnd;
    const Case3 = Constants.AutomationCaseTitle + rnd;

    //creating Entitlements
    await macrosAdminPage.GoToServiceTerms();
    await macrosAdminPage.CreateEntitlements(Entitlement1);
    await macrosAdminPage.DecRemainingOnForCaseCreation();
    await macrosAdminPage.Totalterms(Constants.TtermsforEnt);
    await macrosAdminPage.CreateEntitlements(Entitlement2);
    await macrosAdminPage.Totalterms(Constants.TtermsforEnt2);
    await macrosAdminPage.CreateEntitlements(Entitlement3);
    await macrosAdminPage.DecRemainingOnForCaseCreation();
    await macrosAdminPage.Totalterms(Constants.TtermsforEnt);

    //select Entitlements in case and verifying the Entitlement field
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await macrosAdminPage.createCaseFromCSWSiteMap(Case1);
    await macrosAdminPage.InitiateSession(Case1, stringFormat(Constants.Case1link, rnd));
    await macrosAdminPage.GoToEntField();
    await macrosAdminPage.ChooseEntitlement(Entitlement1, stringFormat(Constants.ChooseEnt1, rnd));

    //verfying Emtitlement Remaining terms is decreased by 1
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdmincenter);
    await macrosAdminPage.GoToServiceTerms();
    await macrosAdminPage.OpenEntitlement(Entitlement1, stringFormat(Constants.ChooseEnt1, rnd));
    await macrosAdminPage.ValidateThePage(Constants.RemTermsInEnt1);
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await macrosAdminPage.InitiateSession(Case1, stringFormat(Constants.Case1link, rnd));
    await macrosAdminPage.ChooseEnt1ToEnt2(stringFormat(Constants.ChooseEnt2, rnd));

    //verifing the case auto saved
    await macrosAdminPage.ValidateThePage(Constants.VerifyCreated);
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    await macrosAdminPage.GoToServiceTerms();
    await macrosAdminPage.OpenEntitlement(Entitlement1, stringFormat(Constants.ChooseEnt1, rnd));

    //verifing the Entitlements remaining terms increased by 1
    await macrosAdminPage.ValidateThePage(Constants.RemTerms2InEnt1);
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await macrosAdminPage.InitiateSession(Case1, stringFormat(Constants.Case1link, rnd));
    await macrosAdminPage.ResolveCase(Constants.ResolutionName);
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdmincenter);
    await macrosAdminPage.GoToServiceTerms();
    await macrosAdminPage.OpenEntitlement(Entitlement2, stringFormat(Constants.ChooseEnt2, rnd));

    //verfying Emtitlement Remaining terms is decreased by 1
    await macrosAdminPage.ValidateThePage(Constants.RemTermsInEnt2);
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await macrosAdminPage.OpenAllCases();
    await macrosAdminPage.InitiateSession(Case1, stringFormat(Constants.Case1link, rnd));
    await macrosAdminPage.ReactivateCase();
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdmincenter);
    await macrosAdminPage.GoToServiceTerms();
    await macrosAdminPage.OpenEntitlement(Entitlement2, stringFormat(Constants.ChooseEnt2, rnd));

    //verifing the Entitlements remaining terms increased by 1
    await macrosAdminPage.ValidateThePage(Constants.RemTerms2InEnt2);
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await macrosAdminPage.InitiateSession(Case1, stringFormat(Constants.Case1link, rnd));
    await macrosAdminPage.DoNotDecrementEntitlementTerms();
    await macrosAdminPage.ResolveCase(Constants.ResolutionName);
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    await macrosAdminPage.GoToServiceTerms();
    await macrosAdminPage.OpenEntitlement(Entitlement2, stringFormat(Constants.ChooseEnt2, rnd));

      //verifing the Entitlements remaining terms is 10
      await macrosAdminPage.ValidateThePage(Constants.RemTerms2InEnt2);

    //create another case and select Entitlement
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await macrosAdminPage.createCaseFromCSWSiteMap(Case2);
    await macrosAdminPage.InitiateSession(Case2, stringFormat(Constants.Case2link, rnd));
    await macrosAdminPage.GoToEntField();
    await macrosAdminPage.ChooseEntitlement(Entitlement1, stringFormat(Constants.ChooseEnt1, rnd));
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdmincenter);
    await macrosAdminPage.GoToServiceTerms();
    await macrosAdminPage.OpenEntitlement(Entitlement1, stringFormat(Constants.ChooseEnt1, rnd));

    //verifing the Entitlements remaining terms decreased by 1
    await macrosAdminPage.ValidateThePage(Constants.RemTermsInEnt1);
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await macrosAdminPage.InitiateSession(Case2, stringFormat(Constants.Case2link, rnd));
    await macrosAdminPage.DoNotDecrementEntitlementTerms();
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    await macrosAdminPage.GoToServiceTerms();
    await macrosAdminPage.OpenEntitlement(Entitlement1, stringFormat(Constants.ChooseEnt1, rnd));

    //verifing the Entitlements remaining terms count 20
    await macrosAdminPage.ValidateThePage(Constants.RemTerms2InEnt1);
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await macrosAdminPage.createCaseFromCSWSiteMap(Case3);
    await macrosAdminPage.InitiateSession(Case3, stringFormat(Constants.SpecificCaseLink1, rnd));
    await macrosAdminPage.GoToEntField();
    await macrosAdminPage.ChooseEntitlement(Entitlement3, stringFormat(Constants.ChooseEnt3, rnd));
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    await macrosAdminPage.GoToServiceTerms();
    await macrosAdminPage.OpenEntitlement(Entitlement3, stringFormat(Constants.ChooseEnt3, rnd));

    //verifing the Entitlements remaining terms decreased by 1
    await macrosAdminPage.ValidateThePage(Constants.RemTermsInEnt3);
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await macrosAdminPage.InitiateTab(Case3, stringFormat(Constants.SpecificCaseLink1, rnd));
    await macrosAdminPage.DoNotDecrementEntitlementTerms();
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    await macrosAdminPage.GoToServiceTerms();
    await macrosAdminPage.OpenEntitlement(Entitlement3, stringFormat(Constants.ChooseEnt3, rnd));

      //verifing the Entitlements remaining terms count 20
      await macrosAdminPage.ValidateThePage(Constants.RemTerms2InEnt3);
    },
    60 * 20 * 1000
  );
});
