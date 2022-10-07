import { AgentChat } from '../../../pages/AgentChat'
import { BrowserContext, Page } from 'playwright'
import { Constants } from '../../common/constants'
import { LiveChatPage } from '../../../pages/LiveChat'
import { Macros } from "../../macropages/macrosAdmin";
import { OrgDynamicsCrmStartPage } from '../../../pages/org-dynamics-crm-start.page'
import { TestHelper } from '../../../helpers/test-helper'
import { TestSettings } from '../../../configuration/test-settings'

describe("App Profile - ", () => {
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
      viewport: TestSettings.Viewport,extraHTTPHeaders: {
        origin: "",
    },
    });
    liveChatContext = await browser.newContext({
      viewport: TestSettings.Viewport,extraHTTPHeaders: {
        origin: "",
    },
      acceptDownloads: true,
    });
    agentContext = await browser.newContext({
      viewport: TestSettings.Viewport,extraHTTPHeaders: {
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
