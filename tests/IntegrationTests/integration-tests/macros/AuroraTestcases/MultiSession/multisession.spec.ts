import { BrowserContext, Page } from "playwright";
import { Constants } from "../../../common/constants";
import { LiveChatPage } from "../../../../pages/LiveChat";
import { Macros } from "../../../macropages/macrosAdmin";
import { OrgDynamicsCrmStartPage } from "../../../../pages/org-dynamics-crm-start.page";
import { TestHelper } from "../../../../helpers/test-helper";
import { TestSettings } from "../../../../configuration/test-settings";
import { AgentScript } from "integration-tests/agentScript/pages/agentScriptAdmin";

describe("MultiSession Test Scenerios - ", () => {
    let adminContext: BrowserContext;
    let adminPage: Page;
    let adminStartPage: OrgDynamicsCrmStartPage;
    let agentPage: Page;
    let agentContext: BrowserContext;
    let liveChatContext: BrowserContext;
    let liveChatPage: LiveChatPage;
    let macrosAdminPage: Macros;
    let rnd: any;
    const agentScriptAdminPage = new AgentScript(adminPage);

    beforeEach(async () => {
        adminContext = await browser.newContext({
            viewport: TestSettings.Viewport,
        });
        liveChatContext = await browser.newContext({
            viewport: TestSettings.Viewport,
            acceptDownloads: true,
        });
        agentContext = await browser.newContext({
            viewport: TestSettings.Viewport,
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
    ///Test Case 1942196: [Multi Session][Productivity Pane][Similar Cases] Adaptive cards correctly displayed
    ///Test Case Link: https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1942196
    ///</summary>
    it("Test Case 1942196: [Multi Session][Productivity Pane][Similar Cases] Adaptive cards correctly displayed", async () => {
        agentPage = await agentContext.newPage();
        liveChatPage = new LiveChatPage(await liveChatContext.newPage());
        try {
            //Login as admin and create case
            await adminStartPage.navigateToOrgUrlAndSignIn(
                TestSettings.AdminAccountEmail,
                TestSettings.AdminAccountPassword
            );
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.createCase(Constants.CaseTitleName);
            //Initiate Session and Validate
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToCustomerServiceWorkspace();
            await macrosAdminPage.InitiateSession(
                Constants.CaseTitleName,
                Constants.CaseLink1
            );
            await macrosAdminPage.ValidateTheStausOwnerTitleConfidenceAndResolution();
        } finally {
            await macrosAdminPage.deleteCaseInCSH(
                adminPage,
                adminStartPage,
                Constants.CaseTitleName
            );
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
            await adminStartPage.navigateToOrgUrlAndSignIn(
                TestSettings.AdminAccountEmail,
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
            //Click Unlink to case  and validate
            await macrosAdminPage.LinkAndUnlinkCase(Constants.ClickLinkcase);
            await macrosAdminPage.ValidateThePage(Constants.UnlinkCase);
            await macrosAdminPage.LinkAndUnlinkCase(Constants.ClickUnlinkCase);
            await macrosAdminPage.ValidateThePage(Constants.LinkToCase);
            //Open connections and validate
            await macrosAdminPage.RelatedPage();
            await macrosAdminPage.ValidateThePage(Constants.ConnectionNoData);
        } finally {
            await macrosAdminPage.deleteCaseInCSH(
                adminPage,
                adminStartPage,
                Constants.CaseTitleName
            );
        }
    });

    ///<summary>
    ///Test Case 1942197: [Multi Session][Productivity Pane][Similar Cases] Open suggestion with single click on card title
    /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1942197
    ///</summary>
    it("Test Case 1942197: [Multi Session][Productivity Pane][Similar Cases] Open suggestion with single click on card title", async () => {
        agentPage = await agentContext.newPage();
        rnd = agentScriptAdminPage.RandomNumber();
        //Login as admin and create case
        await adminStartPage.navigateToOrgUrlAndSignIn(
            TestSettings.AdminAccountEmail,
            TestSettings.AdminAccountPassword
        );
        await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
        await macrosAdminPage.createCase(Constants.CaseTitleName + rnd);
        //Initiate session and open suggesion card and validate
        await macrosAdminPage.openAppLandingPage(adminPage);
        await adminStartPage.goToCustomerServiceWorkspace();
        await macrosAdminPage.InitiateSession(
            Constants.CaseTitleName + rnd,
            Constants.SpecificCaseLink1.replace("{0}", rnd)
        );
        await macrosAdminPage.ValidateThePage(Constants.ProductivityPaneEnable);
        await macrosAdminPage.ClickProductivityPaneTool(
            Constants.SimilarCaseOpen
        );
        await macrosAdminPage.ValidateThePage(Constants.ProductivityPaneEnable);
    });

    ///<summary>
    ///Test Case 1942199: [Multi Session][Productivity Pane][Similar Cases] Re-open suggestion with single click on card title (follows prior scenario)
    /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1942199
    ///</summary>
    it("Test Case 1942199: [Multi Session][Productivity Pane][Similar Cases] Re-open suggestion with single click on card title (follows prior scenario)", async () => {
        agentPage = await agentContext.newPage();
        try {
            //Login as admin and create case
            await adminStartPage.navigateToOrgUrlAndSignIn(
                TestSettings.AdminAccountEmail,
                TestSettings.AdminAccountPassword
            );
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            await macrosAdminPage.createCase(Constants.CaseTitleName);
            //Initiate session and open any two suggesion cards and validate
            await macrosAdminPage.openAppLandingPage(adminPage);
            await adminStartPage.goToCustomerServiceWorkspace();
            await macrosAdminPage.InitiateSession(
                Constants.CaseTitleName,
                Constants.CaseLink1
            );
            await macrosAdminPage.ValidateThePage(Constants.ProductivityPaneEnable);
            await macrosAdminPage.ClickProductivityPaneTool(
                Constants.SimilarCaseOpen
            );
            await macrosAdminPage.GoToHome();
            await macrosAdminPage.InitiateSession(
                Constants.CaseTitleName,
                Constants.CaseLink1
            );
            await macrosAdminPage.ValidateThePage(Constants.ProductivityPaneEnable);
        } finally {
            await macrosAdminPage.deleteCaseInCSH(
                adminPage,
                adminStartPage,
                Constants.CaseTitleName
            );
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
            await adminStartPage.navigateToOrgUrlAndSignIn(
                TestSettings.AdminAccountEmail,
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
            //Click link to case button and validate
            await macrosAdminPage.LinkAndUnlinkCase(Constants.ClickLinkcase);
            await macrosAdminPage.ValidateThePage(Constants.UnlinkCase);
            await macrosAdminPage.LinkAndUnlinkCase(Constants.ClickUnlinkCase);
            await macrosAdminPage.ValidateThePage(Constants.LinkToCase);
            //Open connections and valiadte
            await macrosAdminPage.RelatedPage();
            await macrosAdminPage.ValidateThePage(Constants.ConnectionNewCase);
        } finally {
            await macrosAdminPage.deleteCaseInCSH(
                adminPage,
                adminStartPage,
                Constants.CaseTitleName
            );
        }
    });
});