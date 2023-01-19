import { BrowserContext, Page } from "playwright";
import { Macros } from "../../macropages/macrosAdmin";
import { OrgDynamicsCrmStartPage } from "../../../pages/org-dynamics-crm-start.page";
import { TestHelper } from "../../../helpers/test-helper";
import { TestSettings } from "../../../configuration/test-settings";
import { AgentChat } from "../../../pages/AgentChat";
import { Constants } from "integration-tests/common/constants";
import { AgentChatConstants } from "Utility/Constants";

describe("Navigation QuickCreate Case", () => {
    let adminContext: BrowserContext;
    let adminPage: Page;
    let adminStartPage: OrgDynamicsCrmStartPage;
    let macrosAdminPage: Macros;
    let agentChat: AgentChat;

    beforeEach(async () => {
        adminContext = await browser.newContext({
            viewport: TestSettings.Viewport, extraHTTPHeaders: {
                origin: "",
            },
        });
        adminPage = await adminContext.newPage();
        adminStartPage = new OrgDynamicsCrmStartPage(adminPage);
        macrosAdminPage = new Macros(adminPage);
        agentChat = new AgentChat(adminPage)
    });
    afterEach(async () => {
        TestHelper.dispose(adminContext);
    });

    ///<summary>
    ///Test Case 2907371: [CSW] [Navigation] [Timeline] Task should open in new session
    ///Test Case Link https://dev.azure.com/dynamicscrm/OneCRM/_workitems/edit/2907371
    ///</summary>
    it("Test Case 2907371: [CSW] [Navigation] [Timeline] Task should open in new session", async () => {
        //Login as admin and create cases
        await adminStartPage.navigateToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
        await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
        await adminStartPage.navigateToURL(Constants.NewUI);
        await adminStartPage.waitForAgentStatusIcon();
        var caseNameList = [Constants.CaseTitleName];
        await macrosAdminPage.createIncidents(agentChat, caseNameList);
        await macrosAdminPage.InitiateSession(
            Constants.CaseTitleName,
            Constants.CaseLink1
        );
        await macrosAdminPage.CreateTask(Constants.TaskName);
        await macrosAdminPage.verifyViewTabRecord(Constants.TaskLink.replace("{0}", Constants.TaskName));
    });

    ///<summary>
    ///Test Case 2907372: [CSW] [Navigation] [Timeline] Appointment should open in new session
    ///Test Case Link https://dev.azure.com/dynamicscrm/OneCRM/_workitems/edit/2907372
    ///</summary>
    it("Test Case 2907372: [CSW] [Navigation] [Timeline] Appointment should open in new session", async () => {
        await adminStartPage.navigateToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
        await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
        await adminStartPage.navigateToURL(Constants.NewUI);
        await adminStartPage.waitForAgentStatusIcon();
        var caseNameList = [Constants.CaseTitleName];
        await macrosAdminPage.createIncidents(agentChat, caseNameList);
        await macrosAdminPage.InitiateSession(
            Constants.CaseTitleName,
            Constants.CaseLink1
        );
        await macrosAdminPage.createAppointmentinTimeline();
        await macrosAdminPage.verifyViewTabRecord(Constants.TaskLink.replace("{0}", AgentChatConstants.AppointmentActivity));
    });

    ///<summary>
    ///Test Case 2907373: [CSW] [Navigation] [Timeline] Phone Call should open in new session
    ///Test Case Link https://dev.azure.com/dynamicscrm/OneCRM/_workitems/edit/2907373
    ///</summary>
    it("Test Case 2907373: [CSW] [Navigation] [Timeline] Phone Call should open in new session", async () => {
        await adminStartPage.navigateToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
        await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
        await adminStartPage.navigateToURL(Constants.NewUI);
        await adminStartPage.waitForAgentStatusIcon();
        var caseNameList = [Constants.CaseTitleName];
        await macrosAdminPage.createIncidents(agentChat, caseNameList);
        await macrosAdminPage.InitiateSession(
            Constants.CaseTitleName,
            Constants.CaseLink1
        );
        await macrosAdminPage.createPhoneCallinTimeline();
        await macrosAdminPage.verifyViewTabRecord(Constants.TaskLink.replace("{0}", AgentChatConstants.PhoneCallActivity));
    });
});

