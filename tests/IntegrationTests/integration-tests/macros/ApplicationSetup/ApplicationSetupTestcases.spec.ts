import { BrowserContext, Page } from "playwright";
import { Constants } from "../../common/constants";
import { Macros } from "../../macropages/macrosAdmin";
import { OrgDynamicsCrmStartPage } from "../../../pages/org-dynamics-crm-start.page";
import { TestHelper } from "../../../helpers/test-helper";
import { TestSettings } from "../../../configuration/test-settings";

describe("Application Setup - ", () => {
  let adminContext: BrowserContext;
  let adminPage: Page;
  let adminStartPage: OrgDynamicsCrmStartPage;
  let agentPage: Page;
  let agentContext: BrowserContext;
  let macrosAdminPage: Macros;

  beforeEach(async () => {
    adminContext = await browser.newContext({
      viewport: TestSettings.Viewport, extraHTTPHeaders: {
        origin: "",
      },
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
    TestHelper.dispose(agentContext);
  });

  ///<summary>
  ///Test Case 2045176: [Application Setup] : Verify if app allows access only to system administrator and system customizers
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045176
  ///</summary>
  it("Test Case 2045176: [Application Setup] : Verify if app allows access only to system administrator and system customizers", async () => {
    agentPage = await agentContext.newPage();
    try {
      //Login as admin automated and redirected to OrgUrl
      await adminStartPage.navigateToOrgUrlAndSignIn(
        TestSettings.ApplicationSetupEmail,
        TestSettings.AdminAccountPassword
      );
      await adminStartPage.goToCSWAppDesigner();
      await macrosAdminPage.ValidateAppDesigner(Constants.ValCSWDesignerPage);
      await macrosAdminPage.GoToLandingPage();
      await adminStartPage.goToCSWManageRoles();
      await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
      await macrosAdminPage.ValidateThePage(Constants.ValidateCSW);
      await macrosAdminPage.ValidateThePage(Constants.Home);
      await macrosAdminPage.ValidateThePage(
        Constants.CustomerServiceAgentDashboard
      );
    } finally {
      console.log("validation Successfully");
    }
  });

  ///<summary>
  ///Test Case 2045183: [Application Setup] : Verify Queues in Customer WorkSpace App that are created in Customer Service Hub
  ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045183
  ///<summary>
  it("Test Case 2045183: [Application Setup] : Verify Queues in Customer WorkSpace App that are created in Customer Service Hub", async () => {
    agentPage = await agentContext.newPage();
    try {
      //Login as admin automated and redirected to OrgUrl
      await adminStartPage.navigateToOrgUrlAndSignIn(
        TestSettings.ApplicationSetupEmail,
        TestSettings.AdminAccountPassword
      );
      await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
      // Create a public Queue
      await macrosAdminPage.GoToServiceManagement();
      await macrosAdminPage.CreatePublicQueue(Constants.QueueTitle);
      await macrosAdminPage.GoToServices();
      // Create cases and add queue to that
      await macrosAdminPage.createCase(Constants.CaseTitleName);
      await macrosAdminPage.createCase(Constants.CaseTitleName2);
      await macrosAdminPage.createCase(Constants.CaseTitleName3);
      await macrosAdminPage.AddQueueToExistingCases(
        Constants.CaseTitleName,
        Constants.QueueTitle
      );
      await macrosAdminPage.AddQueueToExistingCases(
        Constants.CaseTitleName2,
        Constants.QueueTitle
      );
      await macrosAdminPage.AddQueueToExistingCases(
        Constants.CaseTitleName3,
        Constants.QueueTitle
      );
      // Navigating to CSW and validate the linked cases
      await macrosAdminPage.openAppLandingPage(adminPage);
      await adminStartPage.goToCustomerServiceWorkspace();
      await macrosAdminPage.OpenCasesLinkedToQueue(Constants.QueueTitleText);
      await macrosAdminPage.ValidateThePage(Constants.CaseLink1);
      await macrosAdminPage.ValidateThePage(Constants.CaseLink2);
      await macrosAdminPage.ValidateThePage(Constants.CaseLink3);
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
      await macrosAdminPage.deleteCase(
        adminPage,
        adminStartPage,
        Constants.CaseTitleName3
      );
      await macrosAdminPage.deleteQueue(
        adminPage,
        adminStartPage,
        Constants.QueueTitle
      );
    }
  });

  //<summary>
  ///Test Case 2045177: [Application Setup] : Verify if site map entries are available
  ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045177
  ///<summary>
  it("Test Case 2045177: [Application Setup] : Verify if site map entries are available.", async () => {
    agentPage = await agentContext.newPage();
    try {
      //Login as admin automated and redirected to OrgUrl
      await adminStartPage.navigateToOrgUrlAndSignIn(
        TestSettings.ApplicationSetupEmail,
        TestSettings.AdminAccountPassword
      );
      // Open App Designer and Validate Page
      await adminStartPage.goToCSWAppDesigner();
      await macrosAdminPage.SiteMapInAppDesigner();
      await macrosAdminPage.ValidateAppDesigner(
        Constants.DashboardDesignerEntity
      );
      await macrosAdminPage.ValidateAppDesigner(
        Constants.AccountsDesignerEntity
      );
      await macrosAdminPage.ValidateAppDesigner(Constants.CasesDesignerEntity);
      // Go To CSW and validate the page
      await macrosAdminPage.GoToLandingPage();
      await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
      await macrosAdminPage.OpenSiteMapInCSW();
      await macrosAdminPage.ValidateThePage(Constants.DashboardRunTimeEntity);
      await macrosAdminPage.ValidateThePage(Constants.AccountsRunTimeEntity);
      await macrosAdminPage.ValidateThePage(Constants.CasesRunTimeEntity);
    } finally {
      console.log("validation Successfully");
    }
  });

  ///<summary>
  ///Test Case 2045181: [Application Setup] c: Verify if CSR and CSM security roles have access to productivity pane related entities
  ///Test Case Link  https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045181
  ///<summary>
  it("Test Case 2045181: [Application Setup] : Verify if CSR and CSM security roles have access to productivity pane related entities", async () => {
    agentPage = await agentContext.newPage();
    try {
      //Login as admin automated and redirected to OrgUrl
      await adminStartPage.navigateToOrgUrlAndSignIn(
        TestSettings.ApplicationSetupEmail,
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
      await macrosAdminPage.ValidateThePage(Constants.Smartassist);
      await macrosAdminPage.ValidateThePage(Constants.KnowledgeArticle);
      await macrosAdminPage.ClickProductivityPaneTool(Constants.AStool);
      //Validate page
      await macrosAdminPage.ValidateThePage(Constants.Agentscripts);
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
});
