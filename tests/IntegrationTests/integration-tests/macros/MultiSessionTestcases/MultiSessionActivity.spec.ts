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
    agentChat = new AgentChat(adminPage);
    msessionAdminPage = new FunctionMS(adminPage);
  });
  afterEach(async () => {
    TestHelper.dispose(adminContext);
    TestHelper.dispose(liveChatContext);
    TestHelper.dispose(agentContext);
  });

  ///<summary>
  ///Test Case 1945859: [Multi Session] Create and Convert Activities (Task, Email, Phone Call, Fax, Letter, Appointment & Custom Activity) to Case.
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1945859
  ///</summary>
  it("Test Case 1945859: [Multi Session] Create and Convert Activities (Task, Email, Phone Call, Fax, Letter, Appointment & Custom Activity) to Case.", async () => {
    rnd = agentScriptAdminPage.RandomNumber();
    await agentChat.navigateToOrgUrlAndSignIn(
      TestSettings.MultiSessionEmail,
      TestSettings.AdminAccountPassword
    );
    await agentChat.goToMyApp(Constants.CustomerServiceWorkspace);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);

    var CaseUserName = Constants.XRMCaseName + rnd;
    caseNameList = [CaseUserName];
    await macrosAdminPage.createIncidents(agentChat, caseNameList);
    await macrosAdminPage.InitiateSession(
      CaseUserName,
      stringFormat(Constants.XRMSpecificCaseLink1, rnd)
    );
    //Create Task and convert it to case and validate
    await macrosAdminPage.CreateTask(Constants.TaskName + rnd);
    await macrosAdminPage.ConvertTaskToCase();
    await macrosAdminPage.ValidateTimeLine(Constants.TaskToCaseValidation);
    //Resolve case and validate
    await macrosAdminPage.ResolveCase(Constants.ResolutionName);
    await macrosAdminPage.ValidateThePage(Constants.ResolveStatemant);

    //Reactivate case and Validate
    await macrosAdminPage.ReactivateCase();
    await macrosAdminPage.ValidateTimeLine(Constants.ValidateReactivateCase1);

    //Cancel case and validate
    await macrosAdminPage.CancelCase();
    await macrosAdminPage.ValidateTimeLine(Constants.ValidateReactivateCase1);

    //Reactivate case and delete
    await macrosAdminPage.ReactivateCase();
    await macrosAdminPage.DeleteCase();
    await macrosAdminPage.closeTaskTab();
    //Initiate session, Resolve it and Validate
    await macrosAdminPage.GoToHome();
    await macrosAdminPage.InitiateSession(
      CaseUserName,
      stringFormat(Constants.XRMSpecificCaseLink1, rnd)
    );
    await macrosAdminPage.ResolveCase(Constants.ResolutionName);
    await macrosAdminPage.ValidateTimeLine(Constants.CaseResolved);

    //Reactivate case and Validate
    await macrosAdminPage.ReactivateCase();
    await macrosAdminPage.ValidateTimeLine(Constants.ValidateReactivateCase);
    //Cancel case and validate
    await macrosAdminPage.CancelCase();
    await macrosAdminPage.ValidateTimeLine(Constants.CanceledCase);
    await macrosAdminPage.ReactivateCase();
  });
});
