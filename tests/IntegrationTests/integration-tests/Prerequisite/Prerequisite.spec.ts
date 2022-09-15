import { TestSettings } from "configuration/test-settings";
import { TestHelper } from "helpers/test-helper";
import { Constants } from "integration-tests/common/constants";
import { Macros } from "integration-tests/macropages/macrosAdmin";
import { OrgDynamicsCrmStartPage } from "pages/org-dynamics-crm-start.page";
import { BrowserContext, Page } from "playwright-core";

 describe("Prerequisite - ", () => {
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
      await macrosAdminPage.createCase(Constants.CaseTitleName);
      await macrosAdminPage.createCase(Constants.CaseTitleName2);
      await macrosAdminPage.openAppLandingPage(adminPage);
      await adminStartPage.goToCustomerServiceAdmincenter();
      // AppProfile with OneApps ProductivityPane
      await macrosAdminPage.createAppProfile();
      await macrosAdminPage.AddUsers(TestSettings.InboxUser);
      await macrosAdminPage.EnableProductivityPane();
    } finally {
      console.log("Objects required for testing are created Successfully");
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
      await macrosAdminPage.createCase(Constants.CaseTitleName);
      //Initiate session and Validate
      await macrosAdminPage.openAppLandingPage(adminPage);
      await adminStartPage.goToCustomerServiceAdmincenter();
      // AppProfile with ProductivityPane
      await macrosAdminPage.createAppProfile();
      await macrosAdminPage.AddUsers(TestSettings.InboxUser1);
    } finally {
      console.log("Objects required for testing are created Successfully");
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
      await macrosAdminPage.createCase(Constants.CaseTitleName);
      //Initiate session and validate
      await macrosAdminPage.openAppLandingPage(adminPage);
      await adminStartPage.goToCustomerServiceAdmincenter();
      // AppProfile with OneApps ProductivityPane
      await macrosAdminPage.createAppProfile();
      await macrosAdminPage.AddUsers(TestSettings.InboxUser2);
      await macrosAdminPage.EnableOneAppsInProductivityPane();
    } finally {
      console.log("Objects required for testing are created Successfully");
    }
  });

  it("Used when Productivity Pane show Two features with MSTeam(User3)", async () => {
    agentPage = await agentContext.newPage();
    try {
      //Login as 'Admin automated' and redirected to OrgUrl
      await adminStartPage.navigateToOrgUrlAndSignIn(
        TestSettings.AdminAccountEmail,
        TestSettings.AdminAccountPassword
      );
      await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
      await macrosAdminPage.createCase(Constants.CaseTitleName);
      await macrosAdminPage.GoToServiceManagement();
      await macrosAdminPage.EnableMSTeamChat();
      //Initiate session and validate
      await macrosAdminPage.openAppLandingPage(adminPage);
      await adminStartPage.goToCustomerServiceAdmincenter();
      // AppProfile with TwoApps ProductivityPane
      await macrosAdminPage.createAppProfile();
      await macrosAdminPage.AddUsers(TestSettings.InboxUser3);
      await macrosAdminPage.EnableTwoAppsInProductivityPane();
    } finally {
      console.log("Objects required for testing are created Successfully");
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
      await macrosAdminPage.createCase(Constants.CaseTitleName);
      await macrosAdminPage.createCase(Constants.CaseTitleName2);
      //Initiate session and validate
      await macrosAdminPage.openAppLandingPage(adminPage);
      await adminStartPage.goToCustomerServiceAdmincenter();
      // AppProfile with Minimize ProductivityPane
      await macrosAdminPage.createAppProfile();
      await macrosAdminPage.AddUsers(TestSettings.InboxUser4);
      await macrosAdminPage.MinimizeProductivityPane();
    } finally {
      console.log("Objects required for testing are created Successfully");
    }
  });

  it("Normaly used when changing productivity pane features.", async () => {
    agentPage = await agentContext.newPage();
    try {
      //Login as 'Admin automated' and redirected to OrgUrl
      await adminStartPage.navigateToOrgUrlAndSignIn(
        TestSettings.AdminAccountEmail5,
        TestSettings.AdminAccountPassword
      );
      await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
      await macrosAdminPage.createCase(Constants.CaseTitleName);
      await macrosAdminPage.createCase(Constants.CaseTitleName2);
    } finally {
      console.log("Objects required for testing are created Successfully");
    }
  });
});
