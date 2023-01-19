import { BrowserContext, Page } from "playwright";
import { Constants } from "../../common/constants";
import { Macros } from "../../macropages/macrosAdmin";
import { OrgDynamicsCrmStartPage } from "../../../pages/org-dynamics-crm-start.page";
import { TestHelper } from "../../../helpers/test-helper";
import { TestSettings } from "../../../configuration/test-settings";
import { enableglobalsearch } from "helpers/odata-helper";

describe("Navigation and GlobalSearch - ", () => {
  let adminContext: BrowserContext;
  let adminPage: Page;
  let adminStartPage: OrgDynamicsCrmStartPage;
  let agentPage: Page;
  let agentContext: BrowserContext;
  let macrosAdminPage: Macros;
  let rnd;

  beforeAll(async () => {
    await enableglobalsearch();
  });

  beforeEach(async () => {
    adminContext = await browser.newContext({
      viewport: TestSettings.CustomViewport,
      extraHTTPHeaders: {
        origin: "",
      },
    });
    agentContext = await browser.newContext({
      viewport: TestSettings.CustomViewport,
      acceptDownloads: true,
      extraHTTPHeaders: {
        origin: "",
      },
    });
    adminPage = await adminContext.newPage();
    adminStartPage = new OrgDynamicsCrmStartPage(adminPage);
    macrosAdminPage = new Macros(adminPage);
  });
  afterEach(async () => {
    TestHelper.dispose(agentContext);
    TestHelper.dispose(adminContext);
  });

  ///<summary>
  ///Test Case 2907346: [CSW] [Navigation][Global Search] When an Entity record is searched and opened by clicking on that Entity record from Global Search and non-Home Session is in Background,the entity record should open in new Session.
  ///Test Case Link  https://dev.azure.com/dynamicscrm/OneCRM/_workitems/edit/2907346
  ///<summary>
  it("Test Case 2907346: [CSW] [Navigation][Global Search]When an Entity record is  searched and opened by clicking on that Entity record from Global Search and Home Session is in Background,the entity record should open in new Session.", async () => {
    agentPage = await agentContext.newPage();
    //Login as admin and create two cases and initiate it and verify
    await adminStartPage.navigateToOrgUrlAndSignIn(
      TestSettings.AdminAccountEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await adminStartPage.navigateToURL(Constants.NewUI);
    await adminStartPage.waitForAgentStatusIcon();
    await macrosAdminPage.CreateCaseInCSW(
      Constants.CaseTitleName
    );
    await macrosAdminPage.CreateCaseInCSW(
      Constants.CaseTitleName2
    );
    await macrosAdminPage.waitForDomContentLoaded();
    const recordName = await macrosAdminPage.verifyRecordInGlobalSearch(Constants.CaseTitleName2);
    expect(recordName).toBeTruthy();
  });

  ///<summary>
  ///Test Case 2907352: [CSW] [Navigation][Global Search] When an Entity record is searched and click enter and open entity record from search results from Global Search and  Home Session is in Background,the entity record should open in new Session.
  ///Test Case Link  https://dev.azure.com/dynamicscrm/OneCRM/_workitems/edit/2907352
  ///<summary>
  it("Test Case 2907352: [CSW] [Navigation][Global Search] When an Entity record is searched and click enter and open entity record from search results from Global Search and  Home Session is in Background,the entity record should open in new Session.", async () => {
    agentPage = await agentContext.newPage();
    //Login as admin and create two cases and initiate it and verify
    await adminStartPage.navigateToOrgUrlAndSignIn(
      TestSettings.AdminAccountEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await adminStartPage.navigateToURL(Constants.NewUI);
    await adminStartPage.waitForAgentStatusIcon();
    await macrosAdminPage.CreateCaseInCSW(
      Constants.CaseTitleName
    );
    await macrosAdminPage.CreateCaseInCSW(
      Constants.CaseTitleName2
    );
    await macrosAdminPage.waitForDomContentLoaded();
    const searchTab = await macrosAdminPage.verifySearchTab(Constants.CaseTitleName2);
    expect(searchTab).toBeTruthy();

    const newSessionTab = await macrosAdminPage.verifyNewssionTab(
      Constants.ValidationOfRecord
    );
    await macrosAdminPage.waitForDomContentLoaded();
    expect(newSessionTab).toBeTruthy();
  });

  ///<summary>
  ///Test Case 2907353: [CSW] [Navigation][Global Search] When an Entity record is searched and click enter and open entity record from search results from Global Search and  Home Session is in Background,the entity record should open in new Session.
  ///Test Case Link  https://dev.azure.com/dynamicscrm/OneCRM/_workitems/edit/2907353
  ///<summary>
  it("Test Case 2907353: [CSW] [Navigation][Global Search] When an Entity record is searched and click enter and open entity record from search results from Global Search and  Home Session is in Background,the entity record should open in new Session.", async () => {
    agentPage = await agentContext.newPage();
    //Login as admin and create two cases and initiate it and verify
    await adminStartPage.navigateToOrgUrlAndSignIn(
      TestSettings.AdminAccountEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await adminStartPage.navigateToURL(Constants.NewUI);
    await adminStartPage.waitForAgentStatusIcon();
    await macrosAdminPage.CreateCaseInCSW(
      Constants.CaseTitleName
    );
    await macrosAdminPage.CreateCaseInCSW(
      Constants.CaseTitleName2
    );
    await macrosAdminPage.waitForDomContentLoaded();
    const otherSessionTab = await macrosAdminPage.verifyNewssionTab(Constants.AutomationCase);
    expect(otherSessionTab).toBeTruthy();

    const searchTab = await macrosAdminPage.verifySearchTab(
      Constants.CaseTitleName2
    );
    await macrosAdminPage.waitForDomContentLoaded();
    expect(searchTab).toBeTruthy();

    const newSessionTab = await macrosAdminPage.verifyNewssionTab(
      Constants.ValidationOfRecord
    );
    await macrosAdminPage.waitForDomContentLoaded();
    expect(newSessionTab).toBeTruthy();
  });

  ///<summary>
  ///Test Case 2907354: [CSW] [Navigation][Global Search] When an Entity record is searched and click enter and open entity record from search results from Global Search and  Home Session is in Background,the entity record should open in new Session.
  ///Test Case Link  https://dev.azure.com/dynamicscrm/OneCRM/_workitems/edit/2907354
  ///<summary>
  it("Test Case 2907354: [CSW] [Navigation][Global Search] When an Entity record is searched and click enter and open entity record from search results from Global Search and  Home Session is in Background,the entity record should open in new Session.", async () => {
    agentPage = await agentContext.newPage();
    //Login as admin and create two cases and initiate it and verify
    await adminStartPage.navigateToOrgUrlAndSignIn(
      TestSettings.AdminAccountEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await adminStartPage.navigateToURL(Constants.NewUI);
    await adminStartPage.waitForAgentStatusIcon();
    await macrosAdminPage.CreateCaseInCSW(
      Constants.CaseTitleName
    );
    await macrosAdminPage.CreateCaseInCSW(
      Constants.CaseTitleName2
    );
    await macrosAdminPage.waitForDomContentLoaded();
    const searchTab = await macrosAdminPage.verifySearchTab(Constants.CaseTitleName2);
    expect(searchTab).toBeTruthy();

    await macrosAdminPage.CloseTab(Constants.SearchTabClose);

    const newSessionTab = await macrosAdminPage.OpenRecentSearchCases();
    await macrosAdminPage.waitForDomContentLoaded(); 
    expect(newSessionTab).toBeTruthy();
  });
});
