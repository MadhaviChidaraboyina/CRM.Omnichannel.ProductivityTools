import { TestSettings } from "configuration/test-settings";
import { TestHelper } from "helpers/test-helper";
import { Constants } from "integration-tests/common/constants";
import { Macros } from "integration-tests/macropages/macrosAdmin";
import { OrgDynamicsCrmStartPage } from "pages/org-dynamics-crm-start.page";
import { BrowserContext, Page } from "playwright-core";


describe("P.Tool Migration - ", () => {
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

    it("Normaly used by all test case.", async () => {
        agentPage = await agentContext.newPage();
        try {
            //Login as 'Admin automated' and redirected to OrgUrl
            await adminStartPage.navigateToOrgUrlAndSignIn(
                TestSettings.AdminAccountEmail,
                TestSettings.AdminAccountPassword
            );
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            // Delete Case
            await macrosAdminPage.deleteAllCase(Constants.CaseTitleName);
            await macrosAdminPage.deleteAllCase(Constants.CaseTitleName2);

        } finally {
            await macrosAdminPage.deleteAppProfile(adminPage, adminStartPage);
        }
    });

    it("Used when Productivity Pane not showing", async () => {
        agentPage = await agentContext.newPage();
        try {
            //Login as 'Admin automated' and redirected to OrgUrl
            await adminStartPage.navigateToOrgUrlAndSignIn(
                TestSettings.AdminAccountEmail1,
                TestSettings.AdminAccountPassword
            );
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            // Delete Case
            await macrosAdminPage.deleteAllCase(Constants.CaseTitleName);
        } finally {
            await macrosAdminPage.deleteAppProfile(adminPage, adminStartPage);
        }
    });

    it("Used when Productivity Pane show one features", async () => {
        agentPage = await agentContext.newPage();
        try {
            //Login as 'Admin automated' and redirected to OrgUrl
            await adminStartPage.navigateToOrgUrlAndSignIn(
                TestSettings.AdminAccountEmail2,
                TestSettings.AdminAccountPassword
            );
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            // Delete Case
            await macrosAdminPage.deleteAllCase(Constants.CaseTitleName);
        } finally {
            await macrosAdminPage.deleteAppProfile(adminPage, adminStartPage);
        }
    });

    it("Used when Productivity Pane show Two features", async () => {
        agentPage = await agentContext.newPage();
        try {
            //Login as 'Admin automated' and redirected to OrgUrl
            await adminStartPage.navigateToOrgUrlAndSignIn(
                TestSettings.AdminAccountEmail3,
                TestSettings.AdminAccountPassword
            );
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            // Delete Case
            await macrosAdminPage.deleteAllCase(Constants.CaseTitleName);
        } finally {
            await macrosAdminPage.deleteAppProfile(adminPage, adminStartPage);
        }
    });

    it("Used when Productivity Pane show in minimize view", async () => {
        agentPage = await agentContext.newPage();
        try {
            //Login as 'Admin automated' and redirected to OrgUrl
            await adminStartPage.navigateToOrgUrlAndSignIn(
                TestSettings.AdminAccountEmail4,
                TestSettings.AdminAccountPassword
            );
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            // Delete Case
            await macrosAdminPage.deleteAllCase(Constants.CaseTitleName);
            await macrosAdminPage.deleteAllCase(Constants.CaseTitleName2);
        } finally {
            await macrosAdminPage.deleteAppProfile(adminPage, adminStartPage);
        }
    });

    it("Used when Productivity Pane show MSTeam option", async () => {
        agentPage = await agentContext.newPage();
        try {
            //Login as 'Admin automated' and redirected to OrgUrl
            await adminStartPage.navigateToOrgUrlAndSignIn(
                TestSettings.AdminAccountEmail5,
                TestSettings.AdminAccountPassword
            );
            await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
            // Delete Case
            await macrosAdminPage.deleteAllCase(Constants.CaseTitleName);
        } finally {
            await macrosAdminPage.deleteAppProfile(adminPage, adminStartPage);
        }
    });
});
