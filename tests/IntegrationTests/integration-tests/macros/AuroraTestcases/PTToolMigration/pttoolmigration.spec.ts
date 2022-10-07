import { BrowserContext, Page } from "playwright";
import { Constants } from "../../../common/constants";
import { Macros } from "../../../macropages/macrosAdmin";
import { OrgDynamicsCrmStartPage } from "../../../../pages/org-dynamics-crm-start.page";
import { TestHelper } from "../../../../helpers/test-helper";
import { TestSettings } from "../../../../configuration/test-settings";

describe("PTToolMigration Test Scenerios - ", () => {
    let adminContext: BrowserContext;
    let adminPage: Page;
    let adminStartPage: OrgDynamicsCrmStartPage;
    let agentPage: Page;
    let agentContext: BrowserContext;
    let liveChatContext: BrowserContext;
    let macrosAdminPage: Macros;

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
    ///Test Case 2245402: [P.Tool Migration] Verify content updates of each tool when switching sessions (including smart assist cards and agent scripts)
    /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2245402
    ///</summary>
    it("Test Case 2245402: [P.Tool Migration] Verify content updates of each tool when switching sessions (including smart assist cards and agent scripts)", async () => {
        agentPage = await agentContext.newPage();
        try {
            //Login as 'Admin automated' and redirected to OrgUrl
            await adminStartPage.navigateToOrgUrlAndSignIn(
                TestSettings.AdminAccountEmail,
                TestSettings.AdminAccountPassword
            );
            await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
            await macrosAdminPage.InitiateSession(
                Constants.CaseTitleName,
                Constants.CaseLink1
            );
            //Open suggestions card and validate
            await macrosAdminPage.OpenSuggestionLink(Constants.KArticleOpen);
            await macrosAdminPage.ValidateThePage(Constants.ValidateSuggestion);
            //Initiate session open suggesion card
            await macrosAdminPage.GoToHome();
            await macrosAdminPage.InitiateSession(
                Constants.CaseTitleName2,
                Constants.CaseLink2
            );
            await macrosAdminPage.ClickProductivityPaneTool(Constants.KStool);
            await macrosAdminPage.OpenSuggestionLink(Constants.KSToolData);
            await macrosAdminPage.ValidateThePage(Constants.KStool);
            //switch to previous session and validate
            await macrosAdminPage.SwitchBackToPreviousSession(Constants.Firstcase);
            await macrosAdminPage.ValidateThePage(Constants.ValidateSuggestion);
        } finally {
            console.log("Test Case Executed Successfully");
        }
    });

    ///<summary>
    ///Test Case 2245446: [P.Tool Migration] Ensure the badge number on smart assist can be accumulated and cached/restored along with session switch.
    /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2245446
    ///</summary>
    it("Test Case 2245446: [P.Tool Migration] Ensure the badge number on smart assist can be accumulated and cached/restored along with session switch.", async () => {
        agentPage = await agentContext.newPage();
        try {
            //Login as 'Admin automated' and redirected to OrgUrl
            await adminStartPage.navigateToOrgUrlAndSignIn(
                TestSettings.AdminAccountEmail,
                TestSettings.AdminAccountPassword
            );
            await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
            await macrosAdminPage.InitiateSession(
                Constants.CaseTitleName,
                Constants.CaseLink1
            );
            await macrosAdminPage.ValidateThePage(Constants.BadgeNum);
            //Initiate session and validate
            await macrosAdminPage.GoToHome();
            await macrosAdminPage.InitiateSession(
                Constants.CaseTitleName3,
                Constants.CaseLink3
            );
            await macrosAdminPage.ValidateThePage(Constants.NoBadgeNum);
            //switch to previous session and validate
            await macrosAdminPage.SwitchBackToPreviousSession(Constants.Firstcase);
            await macrosAdminPage.ValidateThePage(Constants.BadgeNum);
        } finally {
            console.log("Test Case Executed Successfully");
        }
    });

});