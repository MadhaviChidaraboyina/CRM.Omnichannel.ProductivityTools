import { BrowserContext, Page } from "playwright";
import { Constants } from "../../common/constants";
import { Macros } from "../../macropages/macrosAdmin";
import { OrgDynamicsCrmStartPage } from "../../../pages/org-dynamics-crm-start.page";
import { TestHelper } from "../../../helpers/test-helper";
import { TestSettings } from "../../../configuration/test-settings";
import { AgentChat } from "pages/AgentChat";
import { AppProfileHelper } from "helpers/appprofile-helper";
import { stringFormat } from "Utility/Constants";
import { AgentScript } from "integration-tests/agentScript/pages/agentScriptAdmin";

describe("Application Setup - ", () => {
  let adminContext: BrowserContext;
  let adminPage: Page;
  let adminStartPage: OrgDynamicsCrmStartPage;
  let agentPage: Page;
  let agentContext: BrowserContext;
  let macrosAdminPage: Macros;
  let agentChat: AgentChat;
  var caseNameList: string[] = [];
  let rnd: any;
  const agentScriptAdminPage = new AgentScript(adminPage);
 
  beforeAll(async () => {
   await AppProfileHelper.getInstance().CreateAppProfile();
  })

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
    agentChat = new AgentChat(adminPage);
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
      await adminStartPage.waitForAgentStatusIcon();
      await macrosAdminPage.ValidateThePage(Constants.ValidateCSW);
      await macrosAdminPage.ValidateThePage(Constants.Home1);
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
    rnd = agentScriptAdminPage.RandomNumber();
      //Login as admin automated and redirected to OrgUrl
      await adminStartPage.navigateToOrgUrlAndSignIn(
        TestSettings.MacrosAgentEmail,
        TestSettings.AdminAccountPassword
      );      
      await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
      await adminStartPage.waitForDomContentLoaded();
      await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
      // Create a public Queue
      await macrosAdminPage.navigateToBasicQueues();
      var QueueTitle = Constants.QueueTitle + rnd;
      await macrosAdminPage.CreatePublicQueue(QueueTitle);
      await macrosAdminPage.openAppLandingPage(adminPage);
      await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
      await adminStartPage.waitForDomContentLoaded();
      await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
      var CaseTitleName = Constants.CaseTitleName + rnd;
      var CaseTitleName2 = Constants.CaseTitleName2 + rnd;
      var CaseTitleName3 = Constants.CaseTitleName3 + rnd;
      caseNameList = [CaseTitleName,CaseTitleName2,CaseTitleName3];
      await macrosAdminPage.createIncidents(agentChat, caseNameList);
      await adminStartPage.waitForDomContentLoaded();
      await macrosAdminPage.addQueueToCase(
        CaseTitleName,
        QueueTitle
      );
      await macrosAdminPage.addQueueToCase(
        CaseTitleName2,
        QueueTitle
      );
      await macrosAdminPage.addQueueToCase(
        CaseTitleName3,
        QueueTitle
      );
      // Navigating to CSW and validate the linked cases      
      await macrosAdminPage.casesLinkedToQueue(Constants.QueueTitleTextName);
      await macrosAdminPage.ValidateThePage(Constants.CaseTitleLink1);
      await macrosAdminPage.ValidateThePage(Constants.CaseTitleLink2);
      await macrosAdminPage.ValidateThePage(Constants.CaseTitleLink3);   
  });


  //<summary>
  ///Test Case 2045177: [Application Setup] : Verify if site map entries are available
  ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045177
  ///<summary>
  it("Test Case 2045177: [Application Setup] : Verify if site map entries are available.", async () => {
       //Login as admin automated and redirected to OrgUrl
       await adminStartPage.navigateToOrgUrlAndSignIn(
        TestSettings.ApplicationSetupEmail,
        TestSettings.AdminAccountPassword
      );
      // Open App Designer and Validate Page
      await adminStartPage.goToCSWAppDesigner();
      await adminStartPage.waitForDomContentLoaded(); 
      await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
      await macrosAdminPage.ValidateAppDesigner(Constants.PanelApp);
      await macrosAdminPage.ValidateAppDesigner(Constants.AccountsDesignerEntity);
      await macrosAdminPage.ValidateAppDesigner(Constants.CasesDesignerEntity);
      // Go To CSW and validate the page
      await macrosAdminPage.GoToLandingPage();
      await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
      await adminStartPage.waitForDomContentLoaded();
      await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
      await macrosAdminPage.OpenSiteMapInCSW();
      await macrosAdminPage.ValidateThePage(Constants.DashboardRunTimeEntity);
      await macrosAdminPage.ValidateThePage(Constants.AccountsRunTimeEntity);
      await macrosAdminPage.ValidateThePage(Constants.CasesRunTimeEntity);
  });

  ///<summary>
  ///Test Case 2045181: [Application Setup] c: Verify if CSR and CSM security roles have access to productivity pane related entities
  ///Test Case Link  https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045181
  ///<summary>
  it("Test Case 2045181: [Application Setup] : Verify if CSR and CSM security roles have access to productivity pane related entities", async () => {
    agentPage = await agentContext.newPage();
      //Login as admin automated and redirected to OrgUrl
      await adminStartPage.navigateToOrgUrlAndSignIn(
        TestSettings.ApplicationSetupEmail,
        TestSettings.AdminAccountPassword
      );
      await adminStartPage.goToCustomerServiceWorkspace();
      await adminStartPage.waitForDomContentLoaded();
      await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
      await adminStartPage.waitForAgentStatusIcon();
      //Create Case through XRM WebAPI
      await agentChat.waitforTimeout();
      var CaseTitleName = Constants.CaseTitleName
      caseNameList = [CaseTitleName];
      await macrosAdminPage.createIncidents(agentChat, caseNameList);

      await macrosAdminPage.InitiateSession(
        Constants.CaseTitleName,
        (Constants.LinkStart+CaseTitleName+Constants.LinkEnd)
      );
      await macrosAdminPage.ValidateThePage(Constants.Smartassist);
      await macrosAdminPage.ValidateThePage(Constants.KnowledgeArticle);
      await macrosAdminPage.ClickProductivityPaneTool(Constants.AStool);
      //Validate page
      await macrosAdminPage.ValidateThePage(Constants.Agentscripts);
      await macrosAdminPage.ClickProductivityPaneTool(Constants.KStool);
      await macrosAdminPage.ValidateThePage(Constants.Knowledgesearch);
  });
});
