import { BrowserContext, Page } from "playwright";
import { Constants } from "../../common/constants";
import { LiveChatPage } from "../../../pages/LiveChat";
import { Macros } from "../../macropages/macrosAdmin";
import { OrgDynamicsCrmStartPage } from "../../../pages/org-dynamics-crm-start.page";
import { TestHelper } from "../../../helpers/test-helper";
import { TestSettings } from "../../../configuration/test-settings";
import { AppProfileHelper } from "helpers/appprofile-helper";
import { stringFormat } from "../../../Utility/Constants";
import { AgentScript } from "../../agentScript/pages/agentScriptAdmin";
import { AgentChat } from "../../../pages/AgentChat";
import { ConstantMS } from "./msConstants";
import { FunctionMS } from "./msFunction";

describe("Multi Session - ", () => {
  let adminContext: BrowserContext;
  let adminPage: Page;
  let adminStartPage: OrgDynamicsCrmStartPage;
  let agentPage: Page;
  let agentChat: AgentChat;
  let agentContext: BrowserContext;
  let liveChatContext: BrowserContext;
  let liveChatPage: LiveChatPage;
  let macrosAdminPage: Macros;
  let rnd: any;
  const agentScriptAdminPage = new AgentScript(adminPage);
  var caseNameList: string[] = [];
  let msessionAdminPage: FunctionMS;

  beforeAll(async () => {
    await AppProfileHelper.getInstance().CreateAppProfile();
  });

  beforeEach(async () => {
    adminContext = await browser.newContext({
      viewport: TestSettings.Viewport,
      extraHTTPHeaders: {
        origin: "",
      },
    });
    liveChatContext = await browser.newContext({
      viewport: TestSettings.Viewport,
      extraHTTPHeaders: {
        origin: "",
      },
      acceptDownloads: true,
    });
    agentContext = await browser.newContext({
      viewport: TestSettings.Viewport,
      extraHTTPHeaders: {
        origin: "",
      },
      acceptDownloads: true,
    });
    adminPage = await adminContext.newPage();
    adminStartPage = new OrgDynamicsCrmStartPage(adminPage);
    macrosAdminPage = new Macros(adminPage);
    agentChat = new AgentChat(adminPage);
    msessionAdminPage = new FunctionMS(adminPage);
  });
  afterEach(async () => {
    TestHelper.dispose(adminContext);
    TestHelper.dispose(liveChatContext);
    TestHelper.dispose(agentContext);
  });

  ///<summary>
  ///Test Case 1942180: [Multi Session] Open Customer Service workspace as an agent
  ///Test Case Link  https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1942180
  ///<summary>
  it("Test Case 1942180: [Multi Session] Open Customer Service workspace as an agent", async () => {
    liveChatPage = new LiveChatPage(await liveChatContext.newPage());

    //Login as crmadmin
    await adminStartPage.navigateToOrgUrlAndSignIn(
      TestSettings.MultiSessionEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);

    await adminStartPage.waitForDomContentLoaded();
    //Validate page
    await macrosAdminPage.ValidateDashboard(
      Constants.DashboardLandingTitle
    );
  });
});
