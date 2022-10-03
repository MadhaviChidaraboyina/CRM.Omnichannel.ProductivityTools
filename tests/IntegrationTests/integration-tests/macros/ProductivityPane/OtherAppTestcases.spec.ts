import { AgentChat } from "../../../pages/AgentChat";
import { BrowserContext, Page } from "playwright";
import { Constants } from "../../common/constants";
import { LiveChatPage } from "../../../pages/LiveChat";
import { Macros } from "../../macropages/macrosAdmin";
import { OrgDynamicsCrmStartPage } from "../../../pages/org-dynamics-crm-start.page";
import { TestHelper } from "../../../helpers/test-helper";
import { TestSettings } from "../../../configuration/test-settings";

describe("Live Chat - ", () => {
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
  });
  afterEach(async () => {
    TestHelper.dispose(adminContext);
    TestHelper.dispose(liveChatContext);
    TestHelper.dispose(agentContext);
  });

  /// <summary>
  /// Test Case 2484337: Verify modify/override the appsettings from app level.
  /// </summary>
  it.skip("Test Case 2484337: Verify modify/override the appsettings from app level.", async () => {
    agentPage = await agentContext.newPage();
    const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
    liveChatPage = new LiveChatPage(await liveChatContext.newPage());
    const agentChat = new AgentChat(agentPage);
    try {
      await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);
      //Login as 'Admin automated' and redirected to OrgUrl
      await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(TestSettings.AdminAccountEmail,
        agentStartPage,
        agentChat
      );
      await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);
      //Check API response through console
      const resultSuppressSessionCloseWarning = await agentPage.evaluate(
        async () => {
          await (window as any).Xrm.Utility.getGlobalContext().saveSettingValue(
            "msdyn_SuppressSessionCloseWarning",
            true
          );
          const ctrl = await (
            window as any
          ).Xrm.Utility.getGlobalContext().getCurrentAppSettings()[
            "msdyn_SuppressSessionCloseWarning"
          ];
          return ctrl;
        }
      );
      expect(resultSuppressSessionCloseWarning).toBeTruthy();
      const resultMultisessionNavigationImprovements = await agentPage.evaluate(
        async () => {
          await (window as any).Xrm.Utility.getGlobalContext().saveSettingValue(
            "msdyn_MultisessionNavigationImprovements",
            true
          );
          const ctrl = await (
            window as any
          ).Xrm.Utility.getGlobalContext().getCurrentAppSettings()[
            "msdyn_MultisessionNavigationImprovements"
          ];
          return ctrl;
        }
      );
      expect(resultMultisessionNavigationImprovements).toBeTruthy();
      const resultOpenDeeplinkInNewSession = await agentPage.evaluate(
        async () => {
          await (window as any).Xrm.Utility.getGlobalContext().saveSettingValue(
            "msdyn_OpenDeeplinkInNewSession",
            true
          );
          const ctrl = await (
            window as any
          ).Xrm.Utility.getGlobalContext().getCurrentAppSettings()[
            "msdyn_OpenDeeplinkInNewSession"
          ];
          return ctrl;
        }
      );
      expect(resultOpenDeeplinkInNewSession).toBeTruthy();
    } finally {
      //await macrosAdminPage.closeConversation(agentPage, agentChat);
      await agentChat.closeUnusedChat();
      await liveChatPage.closeChat();
    }
  });

  ///<summary>
  ///Test Case 2586434: verify resolve slug problem with boolean value,turn value to string.
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2586434
  ///</summary>
  it("Test Case 2586434: verify resolve slug problem with boolean value,turn value to string.", async () => {
    agentPage = await agentContext.newPage();
    try {
      //Login as 'Admin automated' and redirected to OrgUrl
      await adminStartPage.navigateToOrgUrlAndSignIn(
        TestSettings.AdminAccountEmail,
        TestSettings.AdminAccountPassword
      );
      await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
      await macrosAdminPage.createCase(Constants.CaseTitleName);
      await macrosAdminPage.openAppLandingPage(adminPage);
      await adminStartPage.goToCustomerServiceWorkspace();
      await macrosAdminPage.InitiateSession(
        Constants.CaseTitleName,
        Constants.CaseLink1
      );

      //Check API Response through Console
      const servicestage = await adminPage.evaluate(async () => {
        var context = await (window as any).Microsoft.Apm.getFocusedSession().getContext();
        const ctrl = await context.resolveSlug("{anchor.servicestage}");
        return ctrl;
      });
      expect(servicestage).toBeTruthy();
      const routecase = await adminPage.evaluate(async () => {
        var context = await (window as any).Microsoft.Apm.getFocusedSession().getContext();
        const ctrl = await context.resolveSlug("{anchor.routecase}");
        return ctrl;
      });
      expect(routecase).toBeTruthy();
      const followuptaskcreated = await adminPage.evaluate(async () => {
        var context = await (window as any).Microsoft.Apm.getFocusedSession().getContext();
        const ctrl = await context.resolveSlug("{anchor.followuptaskcreated}");
        return ctrl;
      });
      expect(followuptaskcreated).toBeTruthy();
      const _accountid_value = await adminPage.evaluate(async () => {
        var context = await (window as any).Microsoft.Apm.getFocusedSession().getContext();
        const ctrl = await context.resolveSlug("{anchor._accountid_value}");
        return ctrl;
      });
      expect(_accountid_value).toBe("");
    } finally {
      await macrosAdminPage.deleteCaseInCSH(
        adminPage,
        adminStartPage,
        Constants.CaseTitleName
      );
    }
  });

  ///<summary>
  ///Test Case Test Case 2674539: Verify alwaysRender parameter for Third Party Website is supported.
  ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2674539
  ///<summary>
  it("Test Case 2674539: Verify alwaysRender parameter for Third Party Website is supported.", async () => {
    agentPage = await agentContext.newPage();
    liveChatPage = new LiveChatPage(await liveChatContext.newPage());
    try {
      //Login as 'Admin automated' and redirected to OrgUrl
      await adminStartPage.navigateToOrgUrlAndSignIn(
        TestSettings.AdminAccountEmail,
        TestSettings.AdminAccountPassword
      );
      await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
      // create a application tab and validate it
      await macrosAdminPage.GoToServiceManagement();
      await macrosAdminPage.CreateTabInApplicationTab(
        Constants.ThirdPartyWebsiteApplicationTab,
        Constants.ThirdPartyWebsiteApplicationTabUniqueName,
        Constants.ThirdPartyWebsiteOptionValue
      );
      await macrosAdminPage.AddParametersToAppTab(
        Constants.ParameterName,
        Constants.ParameterUniqueName,
        Constants.ValueAsTrue
      );
      await macrosAdminPage.ValidateThePage(Constants.ParameterAsAlwaysRender);
      await macrosAdminPage.SaveAndClose(Constants.SaveAndCloseButton);
    } finally {
      await macrosAdminPage.DeleteApplicationTabInCSH(
        adminPage,
        adminStartPage,
        Constants.ThirdPartyWebsiteApplicationTab
      );
    }
  });

  ///<summary>
  ///Test Case Test Case 2669759: Verify new session can be initiate from the new case(empty case).
  ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2669759
  ///<summary>
  it("Test Case 2669759: Verify new session can be initiate from the new case(empty case).", async () => {
    agentPage = await agentContext.newPage();
    liveChatPage = new LiveChatPage(await liveChatContext.newPage());
    try {
      //Login as 'Admin automated' and redirected to OrgUrl
      await adminStartPage.navigateToOrgUrlAndSignIn(
        TestSettings.AdminAccountEmail,
        TestSettings.AdminAccountPassword
      );
      await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
      // create a case and validate it
      await macrosAdminPage.CreateCaseInCSW(
        Constants.CaseTitleName
      );
      await macrosAdminPage.InitiateSession(
        Constants.CaseTitleName,
        Constants.CaseLink1
      );
      await macrosAdminPage.ValidateThePage(Constants.CloseSession1);
      // open empty case and validate it
      await macrosAdminPage.NewCaseFromNewSession();
      await macrosAdminPage.ValidateThePage(Constants.CloseEmptyCase);
    } finally {
      await macrosAdminPage.deleteCase(
        adminPage,
        adminStartPage,
        Constants.CaseTitleName
      );
    }
  });
});
