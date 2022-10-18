import { BrowserContext, Page } from "playwright";
import { Constants } from "../../common/constants";
import { Macros } from "../../macropages/macrosAdmin";
import { OrgDynamicsCrmStartPage } from "../../../pages/org-dynamics-crm-start.page";
import { TestHelper } from "../../../helpers/test-helper";
import { TestSettings } from "../../../configuration/test-settings";
import { AgentScript } from "integration-tests/agentScript/pages/agentScriptAdmin";

describe("Live Chat - ", () => {
    let adminContext: BrowserContext;
    let adminPage: Page;
    let adminStartPage: OrgDynamicsCrmStartPage;
    let agentPage: Page;
    let agentContext: BrowserContext;
    let macrosAdminPage: Macros;
    let rnd: any;
    const agentScriptAdminPage = new AgentScript(adminPage);

    beforeEach(async () => {
        adminContext = await browser.newContext({
            viewport: TestSettings.Viewport, extraHTTPHeaders: {
                origin: "",
            },
        });
        agentContext = await browser.newContext({
            viewport: TestSettings.Viewport, acceptDownloads: true, extraHTTPHeaders: {
                origin: "",
            },
        });
        adminPage = await adminContext.newPage();
        adminStartPage = new OrgDynamicsCrmStartPage(adminPage);
        macrosAdminPage = new Macros(adminPage);
    });
    afterEach(async () => {
        TestHelper.dispose(adminContext);
        TestHelper.dispose(agentContext);
    });

    ///<summary>
    ///Test Case 2045306: [Productivity Pane: Agent Guidance] : Verify if knowledge search is available with default configuration
    ///Test Case Link  https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045306
    ///<summary> 
    it("Test Case 2045306: [Productivity Pane: Agent Guidance] : Verify if knowledge search is available with default configuration", async () => {
        agentPage = await agentContext.newPage();
        rnd = agentScriptAdminPage.RandomNumber();
        try {
            //Login as admin and create case
            await adminStartPage.navigateToOrgUrlAndSignIn(TestSettings.MacrosAgentEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.createCase(Constants.CaseTitleName + rnd);
            //Initiate session
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToCustomerServiceWorkspace();
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName + rnd, Constants.RandomCaseLink.replace("{0}", rnd));
            await macrosAdminPage.ClickProductivityPaneTool(Constants.KStool);
            await macrosAdminPage.ValidateThePage(Constants.Knowledgesearch);
        }
        finally {
            await macrosAdminPage.deleteCase(adminPage, adminStartPage, Constants.CaseTitleName);
        }
    });

    ///<summary>
    ///Test Case 2040740: Verify If KB search is disabled on productivity pane from app profiler, it should not appear for agent
    ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2040740
    ///</summary>
    it("Test Case 2040740: Verify If KB search is disabled on productivity pane from app profiler, it should not appear for agent", async () => {
        agentPage = await agentContext.newPage();
        try {
            await adminStartPage.navigateToOrgUrlAndSignIn(TestSettings.MacrosAgentEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);

            //Creating App Profile
            await macrosAdminPage.createAppProfile();
            await macrosAdminPage.AddUsers(TestSettings.InboxUser);
            await macrosAdminPage.EnableTwoAppsInProductivityPane();
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToCustomerServiceWorkspace();
            await macrosAdminPage.CreateCaseInCSW(Constants.CaseTitleName);
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName, Constants.CaseLink1);
            await macrosAdminPage.ValidateNotPresent(Constants.KStool);
        }
        finally {
            await adminPage.reload();
            await macrosAdminPage.deleteAppProfile(adminPage, adminStartPage);
            await macrosAdminPage.deleteCase(adminPage, adminStartPage, Constants.CaseTitleName);
        }
    });

    ///<summary>
    ///Test Case 2464836: Verify additional tabs with the Entity List defined in session template can be opened.
    /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_testPlans/execute?planId=2555818&opId=3594&suiteId=2555823
    ///</summary>
    it.skip("Test Case 2464836: Verify additional tabs with the Entity List defined in session template can be opened.", async () => {
        agentPage = await agentContext.newPage();
        try {
            //Login as admin
            await adminStartPage.navigateToOrgUrlAndSignIn(TestSettings.MacrosAgentEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
            await macrosAdminPage.createApplicationTab(Constants.EntityListApplicationTab, Constants.EntityListApplicationTabUniqueName, Constants.EntityListOptionValue);
            await macrosAdminPage.insertEntityListParameters();
            await macrosAdminPage.createEntitySessionTemplate();
            await macrosAdminPage.addAppTabtoSession(Constants.EntityListApplicationTab, Constants.ApplicationTabSearchResult);

            //Create App Profile and Add User
            await macrosAdminPage.createAppProfile();
            await macrosAdminPage.AddUsers(TestSettings.InboxUser);
            await macrosAdminPage.AddEntitySession(Constants.SessionTemplateinPowerApps);
            await macrosAdminPage.EnableProductivityPane();
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.createCase(Constants.CaseTitleName);

            //Validate the App Profile
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToCustomerServiceWorkspace();

            //Validating The Title of Application Tab by running the Macro
            const VisibleResult = await macrosAdminPage.ValidateAppTab(adminPage, Constants.AccountAppTab);
            expect(VisibleResult).toBeTruthy();

            //Adding slugs in application Tab templates
            await macrosAdminPage.AddSlugToEntityListAppTab(adminStartPage);

            //Validating The Slug
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToCustomerServiceWorkspace();
            const VisibleSlug = await macrosAdminPage.ValidateAppTab(adminPage, Constants.AccountAppTab);
            expect(VisibleSlug).toBeTruthy();
        }
        finally {
            await adminPage.reload();
            await macrosAdminPage.deleteCase(adminPage, adminStartPage, Constants.AutomationCaseTitle);
            await macrosAdminPage.deleteApplicationTabWithCSAdminCenter(adminStartPage, Constants.EntityListApplicationTab);
            await macrosAdminPage.deleteSessionTemplate(adminPage, adminStartPage, Constants.SessionTemplateName);
            await macrosAdminPage.deleteAppProfile(adminPage, adminStartPage);
        }
    });

    ///<summary>
    ///Test Case 1946052: [Multi Session] Verify Parent-Child relationship on Case Form
    ///Test Case Link  https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1946052
    ///<summary>       
    it.skip("Test Case 1946052: [Multi Session] Verify Parent-Child relationship on Case Form", async () => {
        agentPage = await agentContext.newPage();
        try {
            //Login as admin
            await adminStartPage.navigateToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);

            // create four child cases and two parent cases
            await macrosAdminPage.createCase(Constants.FiCase1);
            await macrosAdminPage.createCase(Constants.FiCase2);
            await macrosAdminPage.createCase(Constants.FiCase3);
            await macrosAdminPage.createCase(Constants.FiCase4);
            await macrosAdminPage.createCase(Constants.FiParent2);
            await macrosAdminPage.createCase(Constants.FiParent1);
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);

            //add notes
            await macrosAdminPage.InitiateSession(Constants.FiCase1, Constants.FiChildCaseLink1);
            await macrosAdminPage.AddNote(Constants.AddButton, Constants.Note);
            await macrosAdminPage.GoToHome();

            //add post
            await macrosAdminPage.InitiateSession(Constants.FiCase2, Constants.FiChildCaseLink2);
            await macrosAdminPage.AddPost(Constants.AddButton, Constants.Post);
            await macrosAdminPage.GoToHome();

            //add Task
            await macrosAdminPage.InitiateSession(Constants.FiCase3, Constants.FiChildCaseLink3);
            await macrosAdminPage.AddTask(Constants.AddButton, Constants.Task);

            //Associate and merge child and parent cases
            await macrosAdminPage.GoToCases();
            await macrosAdminPage.AssociateCases(Constants.SeFirst, Constants.ErrorDialog);
            await macrosAdminPage.AssociateCases(Constants.SeSecound, Constants.ErrorDialog);
            await macrosAdminPage.mergeCase(Constants.MergeFirst);
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.parentChildCase(Constants.DontAllow);

            //Initiate session and resolve case
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
            await macrosAdminPage.InitiateSession(Constants.FiParent1, Constants.FiChildParent1);
            await macrosAdminPage.ResolveCase(Constants.ResolutionName);
            await macrosAdminPage.ValidateThePage(Constants.ErrorIcon);
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.parentChildCase(Constants.Allow);
            await macrosAdminPage.openAppLandingPage(adminPage);

            //Initiate session and validate
            await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
            await macrosAdminPage.InitiateSession(Constants.FiParent1, Constants.FiChildParent1);
            await macrosAdminPage.details();
            await macrosAdminPage.ValidateThePage(Constants.Active);

            //cancel case and validate
            await macrosAdminPage.CancelCase();
            await macrosAdminPage.ValidateThePage(Constants.Cancled);
            await macrosAdminPage.ReactivateCase();

            //create child case and resolve and validate
            await macrosAdminPage.createChildCase();
            await macrosAdminPage.ResolveCase(Constants.ResolutionName);
            await macrosAdminPage.ValidateThePage(Constants.Resolved);
        }
        finally {
            await macrosAdminPage.deleteCase(adminPage, adminStartPage, Constants.FiCase1);
            await macrosAdminPage.deleteCase(adminPage, adminStartPage, Constants.FiCase2);
            await macrosAdminPage.deleteCase(adminPage, adminStartPage, Constants.FiCase3);
            await macrosAdminPage.deleteCase(adminPage, adminStartPage, Constants.FiCase4);
            await macrosAdminPage.deleteCase(adminPage, adminStartPage, Constants.CaseTitleName);
            await macrosAdminPage.deleteCase(adminPage, adminStartPage, Constants.FiParent1);
            await macrosAdminPage.deleteCase(adminPage, adminStartPage, Constants.FiParent2);
        }
    });

    ///<summary>
    ///Test Case 1946073: [Multi Session] E2E testing for Cases Entity
    /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1946073
    ///</summary>
    it.skip("Test Case 1946073: [Multi Session] E2E testing for Cases Entity", async () => {
        agentPage = await agentContext.newPage();
        try {
            await adminStartPage.navigateToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
            await macrosAdminPage.createAdvancedQueue(Constants.QueueTitle);
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.createCase(Constants.CaseTitleName2);
            await macrosAdminPage.createCase(Constants.CaseTitleName4);
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
            await macrosAdminPage.GoToCases();
            await macrosAdminPage.createCaseFromCSWSiteMap(Constants.CaseTitleName);
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName, Constants.CaseLink1);
            await macrosAdminPage.ValidateTimeLine(Constants.CaseCreated);
            await macrosAdminPage.AddCaseToQueue(Constants.QueueTitle);
            await macrosAdminPage.ValidateTimeLine(Constants.QueueInTimeLine);
            await macrosAdminPage.QueueItemDetails();
            await macrosAdminPage.ValidateThePage(Constants.QueueLinkTitle);
            await macrosAdminPage.SaveAndClose(Constants.SaveAndCloseBtn2);

            //Resolve case and validate
            await macrosAdminPage.ResolveCase(Constants.ResolutionName);
            await macrosAdminPage.ValidateTimeLine(Constants.CaseClosed);

            //Reactivate case and Validate
            await macrosAdminPage.ReactivateCase();
            await macrosAdminPage.ValidateThePage(Constants.ValidateReactivateCase);

            //Cancel case and valiadte
            await macrosAdminPage.CancelCase();
            await macrosAdminPage.ValidateThePage(Constants.CaseClosed);
            await macrosAdminPage.ReactivateCase();

            //Add Note and Post for a case in timeline
            await macrosAdminPage.AddNote(Constants.AddButton, Constants.Note);
            await macrosAdminPage.AddPost(Constants.AddButton, Constants.Post);

            //perform operations on existing case
            await macrosAdminPage.GoToHome();
            await macrosAdminPage.InitiateSession(Constants.CaseTitleName4, Constants.CaseLink4);
            await macrosAdminPage.ValidateTimeLine(Constants.CaseCreated);
            await macrosAdminPage.AddCaseToQueue(Constants.QueueTitle);
            await macrosAdminPage.ValidateTimeLine(Constants.QueueInTimeLine);
            await macrosAdminPage.QueueItemDetails();
            await macrosAdminPage.ValidateThePage(Constants.QueueLinkTitle);
            await macrosAdminPage.SaveAndClose(Constants.SaveAndCloseBtn2);
            //Resolve case and validate
            await macrosAdminPage.ResolveCase(Constants.ResolutionName);
            await macrosAdminPage.ValidateTimeLine(Constants.CaseClosed);
            //Reactivate case and Validate
            await macrosAdminPage.ReactivateCase();
            await macrosAdminPage.ValidateThePage(Constants.ValidateReactivateCase);
            //Cancel case and valiadte
            await macrosAdminPage.CancelCase();
            await macrosAdminPage.ValidateThePage(Constants.CaseClosed);
            await macrosAdminPage.ReactivateCase();
            await macrosAdminPage.AddNote(Constants.AddButton, Constants.Note);
            await macrosAdminPage.AddPost(Constants.AddButton, Constants.Post);

            //perform operation by selecting single case
            await macrosAdminPage.GoToHome();
            await macrosAdminPage.SelectRow(Constants.CaseTitleName2);
            await macrosAdminPage.AddCaseToQueue(Constants.QueueTitle);
            await macrosAdminPage.selectTheRow();
            await macrosAdminPage.ResolveCase(Constants.ResolutionName);
            await macrosAdminPage.closeSearchresult();

            //Merge to Cases
            await macrosAdminPage.MergeCases(Constants.CaseTitleName);
        }
        finally {
            await macrosAdminPage.deleteCaseInCSH(adminPage, adminStartPage, Constants.CaseTitleName);
            await macrosAdminPage.deleteCaseInCSH(adminPage, adminStartPage, Constants.CaseTitleName2);
            await macrosAdminPage.deleteCaseInCSH(adminPage, adminStartPage, Constants.CaseTitleName4);
            await macrosAdminPage.deleteQueue(adminPage, adminStartPage, Constants.QueueTitle);
        }
    });

    ///<summary>
    ///Test Case 2045187: [Navigation and Gestures] : Verify if records can be opened as sessions from queue item views
    ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045187
    ///</summary>
    it.skip("Test Case 2045187: [Navigation and Gestures] : Verify if records can be opened as sessions from queue item views", async () => {
        agentPage = await agentContext.newPage();
        try {
            await adminStartPage.navigateToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.GoToServiceManagement();

            //creating Queue
            await macrosAdminPage.CreatePublicQueue(Constants.QueueName);
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
            await macrosAdminPage.createCaseFromCSWSiteMap(Constants.Case1);
            await macrosAdminPage.InitiateSession(Constants.Case1, Constants.CaseLink);

            //add queue to the case
            await macrosAdminPage.AddCaseToQueue(Constants.QueueName);
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
            await macrosAdminPage.OpenQueueFromCSWSiteMap();

            //Validating the Queue grid
            await macrosAdminPage.ValidateThePage(Constants.QueuesGridInCSW);
            await macrosAdminPage.SelectAllItemsAllQueues();
            //await macrosAdminPage.OpenQueueItem(Constants.Case1);

            //validating opened session
            await macrosAdminPage.ValidateThePage(Constants.CaseSession);
        }
        finally {
            await macrosAdminPage.deleteCase(adminPage, adminStartPage, Constants.Case11);
            await macrosAdminPage.DeleteQueue(adminPage, adminStartPage, Constants.QueueName);
        }
    });  
});


