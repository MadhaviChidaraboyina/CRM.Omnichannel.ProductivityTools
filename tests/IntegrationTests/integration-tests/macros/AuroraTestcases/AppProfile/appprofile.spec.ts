import { BrowserContext, Page } from "playwright";
import { Constants, EntityAttributes, EntityNames } from "../../../common/constants";
import { Macros } from "../../../macropages/macrosAdmin";
import { OrgDynamicsCrmStartPage } from "../../../../pages/org-dynamics-crm-start.page";
import { TestHelper } from "../../../../helpers/test-helper";
import { TestSettings } from "../../../../configuration/test-settings";
import { AgentChat } from "pages/AgentChat";
import { stringFormat } from "Utility/Constants";
import { AgentScript } from "integration-tests/agentScript/pages/agentScriptAdmin";

describe("App Profile Test Scenerios - ", () => {
    let adminContext: BrowserContext;
    let adminPage: Page;
    let adminStartPage: OrgDynamicsCrmStartPage;
    let agentPage: Page;
    let agentContext: BrowserContext;
    let liveChatContext: BrowserContext;
    let macrosAdminPage: Macros;
    let agentChat: AgentChat;
    var caseNameList: string[] = [];
    let agentScriptAdminPage = new AgentScript(adminPage);

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
    ///Test Case 2045219: [App Profile Manager] : Verify Shift click, control click, actions with csm(roles csr manager, app access, productivity tool user) with Default App Profile
    /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045219
    ///</summary>
    it("Test Case 2045219: [App Profile Manager] : Verify Shift click, control click, actions with csm(roles csr manager, app access, productivity tool user) with Default App Profile", async () => {
        agentPage = await agentContext.newPage();
        const rnd = agentScriptAdminPage.RandomNumber();
        //Login as admin and create case
        await adminStartPage.navigateToOrgUrlAndSignIn(
            TestSettings.AdminAccountEmail,
            TestSettings.AdminAccountPassword
        );
        await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
        await adminStartPage.waitForAgentStatusIcon();
        await adminStartPage.waitForDomContentLoaded();
        await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage)
        const CaseTitleName = Constants.CaseTitleName + rnd
        const userNamePrefix = Constants.AutomationContact + rnd
        let contact = await agentChat.createContactRecord(userNamePrefix);
        await agentChat.createIncidentRecord(CaseTitleName, contact[EntityAttributes.Id], EntityNames.Contact);
        await macrosAdminPage.InitiateTab(
            CaseTitleName,
            stringFormat(Constants.SpecificCaseLink1, rnd)
        );
        await macrosAdminPage.ValidateThePage(Constants.TabNoProdu);
        await macrosAdminPage.CloseTabSession(CaseTitleName);
        await macrosAdminPage.switchToCustomerServiceAgentDashboard();
        //Initiate Session and validate page
        await macrosAdminPage.InitiateSession(
            CaseTitleName,
            stringFormat(Constants.SpecificCaseLink1, rnd)
        );
        await macrosAdminPage.ValidateThePage(Constants.ProductivityPaneEnable);
        await macrosAdminPage.ValidateThePage(Constants.ValidateSuggestion);
        //Open Agent Script tool and validate
        await macrosAdminPage.ClickProductivityPaneTool(Constants.AStool);
        await macrosAdminPage.ValidateThePage(Constants.AStool);
        //Open Knowledge search tool and validate
        await macrosAdminPage.ClickProductivityPaneTool(Constants.KStool);
        await macrosAdminPage.ValidateThePage(Constants.ValidateKSResults);
    });

    ///<summary>
    ///Test Case 2045223: [App Profile Manager] : Verify Shift click, control click, actions with csr(roles csr, app access, productivity tool user) with Default App Profile
    /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045223
    ///</summary>
    it("Test Case 2045223: [App Profile Manager] : Verify Shift click, control click, actions with csr(roles csr, app access, productivity tool user) with Default App Profile", async () => {
        //Login as admin and create case
        await adminStartPage.navigateToOrgUrlAndSignIn(
            TestSettings.MacrosAgentEmail,
            TestSettings.AdminAccountPassword
        );
        await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
        await adminStartPage.waitForDomContentLoaded();
        await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage)
        const caseTitle = await macrosAdminPage.createCaseWithAPI(
          Constants.CaseTitleName
        );
        await macrosAdminPage.InitiateSession(
          caseTitle,
          Constants.LinkStart + caseTitle + Constants.LinkEnd
        );
        await macrosAdminPage.ValidateThePage(Constants.ProductivityPaneEnable);
        await macrosAdminPage.ValidateThePage(Constants.ValidateSuggestion);
        //Open Agent Script tool and validate
        await macrosAdminPage.ClickProductivityPaneTool(Constants.AStool);
        await macrosAdminPage.ValidateThePage(Constants.AStool);
        //Open Knowledge search tool and validate
        await macrosAdminPage.ClickProductivityPaneTool(Constants.KStool);
        await macrosAdminPage.ValidateThePage(Constants.ValidateKSResults);        
        await macrosAdminPage.CloseSession(Constants.CloseSession1);
        //Initiate Session and validate page
        await macrosAdminPage.InitiateTab(
          caseTitle,
          Constants.LinkStart + caseTitle + Constants.LinkEnd
        );
        await macrosAdminPage.ValidateNotPage(Constants.ProductivityPaneEnable);
    });

    ///<summary>
  ///Test Case 1968344: Verify default app profile associated for a user with default OC agent/OC supervisor/CSR/CSM role
  ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1968344
  ///</summary>
  it("Test Case 1968344: Verify default app profile associated for a user with default OC agent/OC supervisor/CSR/CSM role", async () => {
    await adminStartPage.navigateToOrgUrlAndSignIn(
      TestSettings.AdminAccountEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.OmnichannelCustomerservice);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await adminStartPage.waitForAgentStatusIcon();

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
      Constants.OmnichannelAgentDashBoard2
    );
    await macrosAdminPage.ValidateDashboard(
      Constants.CustomerServiceManagerOmnichannel
    );
    await macrosAdminPage.ValidateDashboard(
      Constants.OmnichannelOngoingConversationsDashboard
    );
  });

  ///<summary>
  ///Test Case 1968342: Verify default app profile associated for a user with default OC Agent/OC Supervisor
  ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1968342
  ///</summary>
  it("Test Case 1968342: Verify default app profile associated for a user with default OC Agent/OC Supervisor", async () => {
    agentPage = await agentContext.newPage();
    await adminStartPage.navigateToOrgUrlAndSignIn(
      TestSettings.AdminAccountEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);

    //Validating Dashboard
    await macrosAdminPage.ValidateDashboard(
      Constants.CustomerServiceAgentDashboard1
    );
    await macrosAdminPage.ClickDropDown(Constants.DashboardSelector);
    await macrosAdminPage.ValidateDashboard(
      Constants.OmnichannelAgentDashboard1
    );
    await macrosAdminPage.ValidateOCCSDashboard(
      Constants.OmnichannelOngoingConversationDashBoard
    );
  });
});