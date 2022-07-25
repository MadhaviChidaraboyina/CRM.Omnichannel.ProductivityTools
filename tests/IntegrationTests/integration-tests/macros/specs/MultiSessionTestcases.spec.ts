import { BrowserContext, Page } from "playwright";
import { Constants } from "../../common/constants";
import { LiveChatPage } from "../../../pages/LiveChat";
import { Macros } from "../../macros/pages/macrosAdmin";
import { OrgDynamicsCrmStartPage } from "../../../pages/org-dynamics-crm-start.page";
import { TestHelper } from "../../../helpers/test-helper";
import { TestSettings } from "../../../configuration/test-settings";

describe("Multi Session - ", () => {
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
            viewport: TestSettings.Viewport, acceptDownloads: true,
        });
        agentContext = await browser.newContext({
            viewport: TestSettings.Viewport, acceptDownloads: true,
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
    ///Test Case 1942189: [Multi Session] Open Customer Service workspace as a Customer Service Manager
    ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1942189
    ///</summary>
    it("Test Case 1942189: [Multi Session] Open Customer Service workspace as a Customer Service Manager", async () => {
        agentPage = await agentContext.newPage();
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        try {
            //Login as admin and create cases
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            //Validating Customer Service 
            await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
            await macrosAdminPage.ValidateDashboard(Constants.CustomerServiceManagerDashBoard);
        }
        finally {
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
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.GoToServiceManagement();
            await macrosAdminPage.CreateSubjectsFromHub(Constants.SubjectName, Constants.SubjectName2, Constants.SubjectName3);
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
            //Creating Subjects
            await macrosAdminPage.CreateCaseForSubjectsInCSW(Constants.CaseTitleName2, Constants.SubjectName);
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName2, Constants.CaseLink2);
            //validating subject field
            await macrosAdminPage.ValidateThePage(Constants.CWSSubjectInputField);
            await macrosAdminPage.ValidateSubjectField(Constants.SubField, Constants.Parent, Constants.Child1);
            await macrosAdminPage.GoToHome();
            await macrosAdminPage.InitiateTab(Constants.CaseTitleName2, Constants.CaseLink2);
            //validating subject field
            await macrosAdminPage.ValidateThePage(Constants.CWSSubjectInputField);
            await macrosAdminPage.ValidateSubjectField(Constants.SubField, Constants.Parent, Constants.Child1);
        }
        finally {
            await macrosAdminPage.deleteCase(adminPage, adminStartPage, Constants.CaseTitleName2);
            await macrosAdminPage.DeleteSubject(adminPage, adminStartPage);
        }
    });

    ///<summary>
    ///Test Case 1991369: [Multi Session][E2E] Verify Multisession functionality in CSW app
    /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1991369
    ///</summary>
    it("Test Case 1991369: [Multi Session][E2E] Verify Multisession functionality in CSW app", async () => {
        agentPage = await agentContext.newPage();
        try {
            //Login as admin and create cases
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.createCase(Constants.CaseTitleName);
            await macrosAdminPage.createCase(Constants.CaseTitleName2);
            //Initiate session and validate
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToCustomerServiceWorkspace();
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName, Constants.CaseLink1);
            await macrosAdminPage.ValidateThePage(Constants.ProductivityPaneEnable);
            //Initiate session and open any tool in Productivity Pane
            await macrosAdminPage.GoToHome();
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName2, Constants.CaseLink2);
            await macrosAdminPage.ClickProductivityPaneTool(Constants.SAtool);
            //Initiate session
            await macrosAdminPage.GoToHome();
            await macrosAdminPage.InitiateTab(Constants.CaseTitleName, Constants.CaseLink1);
            //switch to previous session and open suggesion card and validate
            await macrosAdminPage.SwitchBackToPreviousSession(Constants.OpenPreviousSession);
            await macrosAdminPage.OpenSuggestionCard(Constants.ClickingCard1);
            await macrosAdminPage.ValidateThePage(Constants.ToolData);
        }
        finally {
            await macrosAdminPage.deleteCaseInCSH(adminPage, adminStartPage, Constants.CaseTitleName);
            await macrosAdminPage.deleteCaseInCSH(adminPage, adminStartPage, Constants.CaseTitleName2);
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
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToCustomerServiceWorkspace();
            //Create case and Validate
            await macrosAdminPage.CreateCaseInCSW(Constants.CaseTitleName, Constants.CasePriority);
            await macrosAdminPage.ValidateThePage(Constants.Notification);
            //Initiate Session and Validate
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName, Constants.CaseLink1);
            await macrosAdminPage.ValidateThePage(Constants.ValidateCaseTitle);
            await macrosAdminPage.ValidateThePage(Constants.ValidateCustomer);
        }
        finally {
            await macrosAdminPage.deleteCaseInCSH(adminPage, adminStartPage, Constants.CaseTitleName);
        }
    });

    ///<summary>
    ///Test Case 1946046: [Multi Session] Verify Case Assoication action from Case Grid
    ///Test Case Link  https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1946046
    ///<summary>       
    it("Test Case 1946046: [Multi Session] Verify Case Assoication action from Case Grid", async () => {
        agentPage = await agentContext.newPage();
        try {
            //Login as crmadmin
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            //Create four child Cases and three parent cases
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.createCase(Constants.Case1_Child1);
            await macrosAdminPage.createCase(Constants.Case1_Child2);
            await macrosAdminPage.createCase(Constants.Case2_Child1);
            await macrosAdminPage.createCase(Constants.Case2_Child2);
            await macrosAdminPage.createCase(Constants.Case1);
            await macrosAdminPage.createCase(Constants.Case2);
            await macrosAdminPage.createCase(Constants.Case3);
            //Open Cases grid and Associate them
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
            await macrosAdminPage.GoToCases();
            //Associate two child cases with one parent case and Valiadte
            await macrosAdminPage.AssociateCases(Constants.Case1, Constants.DialogText);
            //Associate two child cases with one parent case and validate
            await macrosAdminPage.AssociateCases(Constants.Case2, Constants.DialogText);
            //Associate two child cases with one parent case and validate
            await macrosAdminPage.AssociateCases(Constants.AssociateCase3, Constants.ErrorDialog);
        }
        finally {
            await macrosAdminPage.deleteCase(adminPage, adminStartPage, Constants.Case1);
            await macrosAdminPage.deleteCase(adminPage, adminStartPage, Constants.Case2);
            await macrosAdminPage.deleteCase(adminPage, adminStartPage, Constants.Case3);
        }
    });

    ///<summary>
    ///Test Case 1945859: [Multi Session] Create and Convert Activities (Task, Email, Phone Call, Fax, Letter, Appointment & Custom Activity) to Case.
    /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1945859
    ///</summary>
    it("Test Case 1945859: [Multi Session] Create and Convert Activities (Task, Email, Phone Call, Fax, Letter, Appointment & Custom Activity) to Case.", async () => {
        agentPage = await agentContext.newPage();
        try {
            //Login as admin and create case
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.createCase(Constants.CaseTitleName);
            //Create Task and conver it to case and validate
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToCustomerServiceWorkspace();
            await macrosAdminPage.CreateTask(Constants.TaskName);
            await macrosAdminPage.ConvertTaskToCase();
            await macrosAdminPage.ValidateThePage(Constants.TaskToCaseValidation);
            //Resolve case and validate
            await macrosAdminPage.ResolveCase(Constants.ResolutionName);
            await macrosAdminPage.ValidateThePage(Constants.ValidateResolveCase);
            //Reactivate case and Validate
            await macrosAdminPage.ReactivateCase();
            await macrosAdminPage.ValidateThePage(Constants.ValidateReactivateCase);
            //Cancel case and valiadte
            await macrosAdminPage.CancelCase();
            await macrosAdminPage.ValidateThePage(Constants.ValidateCloseCase);
            //Reactivate case and delete
            await macrosAdminPage.ReactivateCase();
            await macrosAdminPage.DeleteCase();
            //Initiate case and Resolve it and Validate
            await macrosAdminPage.GoToHome();
            await macrosAdminPage.GoToCases();
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName, Constants.CaseLink1);
            await macrosAdminPage.ResolveCase(Constants.ResolutionName);
            await macrosAdminPage.ValidateThePage(Constants.ValidateResolveCase);
            //Reactivate case and Validate
            await macrosAdminPage.ReactivateCase();
            await macrosAdminPage.ValidateThePage(Constants.ValidateReactivateCase);
            //Cancel case and valiadte
            await macrosAdminPage.CancelCase();
            await macrosAdminPage.ValidateThePage(Constants.ValidateCloseCase);
            await macrosAdminPage.ReactivateCase();
        }
        finally {
            await macrosAdminPage.deleteCaseInCSH(adminPage, adminStartPage, Constants.CaseTitleName);
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
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.createCase(Constants.CaseTitleName);
            //Initiate session
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToCustomerServiceWorkspace();
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName, Constants.CaseLink1);
            //Click Unlink to case  and validate
            await macrosAdminPage.LinkAndUnlinkCase(Constants.ClickLinkcase);
            await macrosAdminPage.ValidateThePage(Constants.UnlinkCase);
            await macrosAdminPage.LinkAndUnlinkCase(Constants.ClickUnlinkCase);
            await macrosAdminPage.ValidateThePage(Constants.LinkToCase);
            //Open connections and validate
            await macrosAdminPage.RelatedPage();
            await macrosAdminPage.ValidateThePage(Constants.ConnectionNoData);
        }
        finally {
            await macrosAdminPage.deleteCaseInCSH(adminPage, adminStartPage, Constants.CaseTitleName);
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
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.createCase(Constants.CaseTitleName);
            //Initiate session 
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToCustomerServiceWorkspace();
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName, Constants.CaseLink1);
            //Click link to case button and validate
            await macrosAdminPage.LinkAndUnlinkCase(Constants.ClickLinkcase);
            await macrosAdminPage.ValidateThePage(Constants.UnlinkCase);
            await macrosAdminPage.LinkAndUnlinkCase(Constants.ClickUnlinkCase);
            await macrosAdminPage.ValidateThePage(Constants.LinkToCase);
            //Open connections and valiadte
            await macrosAdminPage.RelatedPage();
            await macrosAdminPage.ValidateThePage(Constants.ConnectionNewCase);
        }
        finally {
            await macrosAdminPage.deleteCaseInCSH(adminPage, adminStartPage, Constants.CaseTitleName);
        }
    });

    ///<summary>
    ///Test Case 1942199: [Multi Session][Productivity Pane][Similar Cases] Re-open suggestion with single click on card title (follows prior scenario)
    /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1942199
    ///</summary>
    it("Test Case 1942199: [Multi Session][Productivity Pane][Similar Cases] Re-open suggestion with single click on card title (follows prior scenario)", async () => {
        agentPage = await agentContext.newPage();
        try {
            //Login as admin and create case
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.createCase(Constants.CaseTitleName);
            //Initiate session and open any two suggesion cards and validate
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToCustomerServiceWorkspace();
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName, Constants.CaseLink1);
            await macrosAdminPage.OpenSuggestionCard(Constants.ClickingCard1);
            await macrosAdminPage.OpenSuggestionCard(Constants.ClickingCard1);
            await macrosAdminPage.ValidateThePage(Constants.ToolData);
        }
        finally {
            await macrosAdminPage.deleteCaseInCSH(adminPage, adminStartPage, Constants.CaseTitleName);
        }
    });

    ///<summary>
    ///Test Case 1942197: [Multi Session][Productivity Pane][Similar Cases] Open suggestion with single click on card title
    /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1942197
    ///</summary>
    it("Test Case 1942197: [Multi Session][Productivity Pane][Similar Cases] Open suggestion with single click on card title", async () => {
        agentPage = await agentContext.newPage();
        try {
            //Login as admin and create case
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.createCase(Constants.CaseTitleName);
            //Initiate session and open suggesion card and validate
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToCustomerServiceWorkspace();
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName, Constants.CaseLink1);
            await macrosAdminPage.OpenSuggestionCard(Constants.ClickingCard1);
            await macrosAdminPage.ValidateThePage(Constants.ToolData);
        }
        finally {
            await macrosAdminPage.deleteCaseInCSH(adminPage, adminStartPage, Constants.CaseTitleName);
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
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.createCase(Constants.CaseTitleName);
            //Initiate Session and Validate
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToCustomerServiceWorkspace();
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName, Constants.CaseLink1);
            await macrosAdminPage.ValidateTheStausOwnerTitleConfidenceAndResolution();
        }
        finally {
            await macrosAdminPage.deleteCaseInCSH(adminPage, adminStartPage, Constants.CaseTitleName);
        }
    });

    ///<summary>
    ///Test Case 1942194: [Multi Session][Productivity Pane] Productivity pane maintains collapsed state during session switch events
    ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1942194
    ///</summary>
    it("Test Case 1942194: [Multi Session][Productivity Pane] Productivity pane maintains collapsed state during session switch events", async () => {
        agentPage = await agentContext.newPage();
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        try {
            //Login as crmadmin and create case
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.createCase(Constants.CaseTitleName);
            await macrosAdminPage.createCase(Constants.CaseTitleName2);
            //Navigate to CSW and intitiate sessions
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToCustomerServiceWorkspace();
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName, Constants.CaseLink1);
            await macrosAdminPage.GoToHome();
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName2, Constants.CaseLink2);
            await macrosAdminPage.ClickProductivityPaneTool(Constants.SAtool);
            await macrosAdminPage.ValidateThePage(Constants.ProductivityPaneDisable);
            await macrosAdminPage.SwitchBackToPreviousSession(Constants.CaseLink1);
            await macrosAdminPage.ValidateThePage(Constants.ProductivityPaneEnable);
        }
        finally {
            await macrosAdminPage.deleteCase(adminPage, adminStartPage, Constants.CaseTitleName);
            await macrosAdminPage.deleteCase(adminPage, adminStartPage, Constants.CaseTitleName2);
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
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.createCase(Constants.CaseTitleName);
            await macrosAdminPage.createCase(Constants.CaseTitleName2);
            //Initiate two Session and Validating Productivity pane
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName, Constants.CaseLink1);
            await macrosAdminPage.GoToHome();
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName2, Constants.CaseLink2);
            await macrosAdminPage.SwitchBackToPreviousSession(Constants.CaseLink1);
            await macrosAdminPage.ValidateThePage(Constants.ProductivityPaneEnable);
            await macrosAdminPage.SwitchBackToPreviousSession(Constants.CaseLink2);
            await macrosAdminPage.ValidateThePage(Constants.ProductivityPaneEnable);
        }
        finally {
            await macrosAdminPage.deleteCase(adminPage, adminStartPage, Constants.CaseTitleName);
            await macrosAdminPage.deleteCase(adminPage, adminStartPage, Constants.CaseTitleName2);
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
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
            await macrosAdminPage.ClickDropDown(Constants.DashboardSelector);
            //Validate page
            await macrosAdminPage.ValidateThePage(Constants.ServiceManagerDashboard);
            await macrosAdminPage.ValidateThePage(Constants.ServiceOperationsDashboard);
            await macrosAdminPage.ValidateThePage(Constants.ServicePerformanceDashboard);
        }
        finally {
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
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.createCase(Constants.CaseTitleName);
            await macrosAdminPage.createCase(Constants.CaseTitleName2);
            //Initiate session
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToCustomerServiceWorkspace();
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName, Constants.CaseLink1);
            //Open Email Editor and fill data
            await macrosAdminPage.EmailEditor();
            //Initiate session
            await macrosAdminPage.GoToHome();
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName2, Constants.CaseLink2);
            //switch to previous session and validate
            await macrosAdminPage.SwitchBackToPreviousSession(Constants.Firstcase);
            await macrosAdminPage.ValidateThePage(Constants.FocusOnEmailTab);
        }
        finally {
            await macrosAdminPage.deleteCaseInCSH(adminPage, adminStartPage, Constants.CaseTitleName);
            await macrosAdminPage.deleteCaseInCSH(adminPage, adminStartPage, Constants.CaseTitleName2);
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
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
            //validate page
            await macrosAdminPage.ValidateDashboard(Constants.ValidateServiceAgentDashboard);
        }
        finally { }
    });

    ///<summary>
    ///Test Case 1942179: [Multi Session] Verify General multisession navigation
    ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_testPlans/execute?planId=2627279&suiteId=2627282
    ///</summary>
    it("Test Case 1942179: [Multi Session] Verify General multisession navigation", async () => {
        agentPage = await agentContext.newPage();
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        try {
            //Login as admin and create cases
            await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.createCase(Constants.CaseTitleName);
            await macrosAdminPage.createCase(Constants.CaseTitleName2);
            //Initiate one Session and Tab
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName, Constants.CaseLink1);
            await macrosAdminPage.GoToHome();
            await macrosAdminPage.InitiateTab(Constants.CaseTitleName2, Constants.CaseLink2);
            //Validating Opening Session and Tab
            await macrosAdminPage.ValidateThePage(Constants.CaseTitleNameVal);
            await macrosAdminPage.ValidateThePage(Constants.CaseTitleName2Val);
        }
        finally {
            await macrosAdminPage.deleteCase(adminPage, adminStartPage, Constants.CaseTitleName);
            await macrosAdminPage.deleteCase(adminPage, adminStartPage, Constants.CaseTitleName2);
        }
    });
});