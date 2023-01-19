import { BrowserContext, Page } from "playwright";
import { Constants } from "../../common/constants";
import { LiveChatPage } from "../../../pages/LiveChat";
import { Macros } from "../../macropages/macrosAdmin";
import { OrgDynamicsCrmStartPage } from "../../../pages/org-dynamics-crm-start.page";
import { TestHelper } from "../../../helpers/test-helper";
import { TestSettings } from "../../../configuration/test-settings";
import { AppProfileHelper } from "helpers/appprofile-helper";
import { stringFormat } from "../../../Utility/Constants";
import { AgentScript } from "../../../integration-tests/agentScript/pages/agentScriptAdmin";
import { AgentChat } from "../../../pages/AgentChat";
import { ConstantMS } from "../MultiSessionTestcases/msConstants";
import { FunctionMS } from "../MultiSessionTestcases/msFunction";

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
    msessionAdminPage = new FunctionMS(adminPage);
  });
  afterEach(async () => {
    TestHelper.dispose(adminContext);
    TestHelper.dispose(liveChatContext);
    TestHelper.dispose(agentContext);
  });

  ///<summary>
  ///Test Case 1946046: [Multi Session] Verify Case Assoication action from Case Grid
  ///Test Case Link  https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1946046
  ///<summary>
  it("Test Case 1946046: [Multi Session] Verify Case Assoication action from Case Grid", async () => {
    agentPage = await agentContext.newPage();
    agentChat = new AgentChat(adminPage);
    //Login as crmadmin
    await adminStartPage.navigateToOrgUrlAndSignIn(
      TestSettings.MultiSessionEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await agentChat.waitforTimeout();

    const Case1_Child1 = Constants.Case1_Child1;
    const Case1_Child2 = Constants.Case1_Child2;
    const Case2_Child1 = Constants.Case2_Child1;
    const Case2_Child2 = Constants.Case2_Child2;
    const Case1 = Constants.Case1;
    const Case2 = Constants.Case2;
    const Case3 = Constants.Case3;

    caseNameList = [
      Case1_Child1,
      Case1_Child2,
      Case2_Child1,
      Case2_Child2,
      Case1,
      Case2,
      Case3,
    ];
    await macrosAdminPage.createIncidents(agentChat, caseNameList);
    await agentChat.waitforTimeout();

    //Associate two child cases with one parent case and Valiadte
    await macrosAdminPage.AssociateCases(Constants.Case1, Constants.DialogText);

    //Associate two child cases with one parent case and validate
    await macrosAdminPage.AssociateCases(Constants.Case2, Constants.DialogText);

    //Associate two child cases with one parent case and validate
    await macrosAdminPage.AssociateCases(
      Constants.AssociateCase3,
      Constants.ErrorDialog
    );
  });
});
