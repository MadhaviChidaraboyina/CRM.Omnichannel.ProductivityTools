import { AgentChat } from '../../../pages/AgentChat'
import { BrowserContext, Page } from 'playwright'
import { Constants } from '../../common/constants'
import { LiveChatPage } from '../../../pages/LiveChat'
import { Macros } from "../../macropages/macrosAdmin";
import { OrgDynamicsCrmStartPage } from '../../../pages/org-dynamics-crm-start.page'
import { TestHelper } from '../../../helpers/test-helper'
import { TestSettings } from '../../../configuration/test-settings'
import { AgentScript } from 'integration-tests/agentScript/pages/agentScriptAdmin';
import { EntityAttributes, EntityNames, stringFormat } from 'Utility/Constants';
import { AppProfileHelper } from 'helpers/appprofile-helper';

describe("App Profile - ", () => {
  let adminContext: BrowserContext;
  let adminPage: Page;
  let adminStartPage: OrgDynamicsCrmStartPage;
  let agentPage: Page;
  let agentContext: BrowserContext;
  let liveChatContext: BrowserContext;
  let liveChatPage: LiveChatPage;
  let macrosAdminPage: Macros;
  let agentChat: AgentChat;
  var caseNameList: string[] = [];
  let agentScriptAdminPage = new AgentScript(adminPage);

  beforeAll(async () => {
    await AppProfileHelper.getInstance().CreateAppProfile();
  })

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
    agentChat = new AgentChat(adminPage);
  });
  afterEach(async () => {
    TestHelper.dispose(adminContext);
    TestHelper.dispose(liveChatContext);
    TestHelper.dispose(agentContext);
  });

  ///<summary>
  ///Test Case 2045214: [App Profile Manager] : Verify Shift click, control click, actions with admin with Default App Profile
  ///Test Case Link  https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045214
  ///<summary>
  it("Test Case 2045214: [App Profile Manager] : Verify Shift click, control click, actions with admin with Default App Profile", async () => {
    agentPage = await agentContext.newPage();
    const rnd = agentScriptAdminPage.RandomNumber();
    //Login as admin and create case
    await adminStartPage.navigateToOrgUrlAndSignIn(
      TestSettings.AdminAccountEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);

    //Create Case through XRM WebAPI
    await agentChat.waitforTimeout();
    var CaseTitleName = Constants.CaseTitleName + rnd;
    caseNameList = [CaseTitleName];
    await macrosAdminPage.createIncidents(agentChat, caseNameList);
    //Initiate session and validate
    await macrosAdminPage.InitiateSession(
      CaseTitleName,
      stringFormat(Constants.SpecificCaseLink1, rnd)
    );
    await macrosAdminPage.ValidateThePage(Constants.CloseSession1);
    await macrosAdminPage.ValidateThePage(Constants.Smartassist);
    await macrosAdminPage.ClickProductivityPaneTool(Constants.AStool);
    //Validate page
    await macrosAdminPage.ValidateThePage(Constants.Agentscripts);
    await macrosAdminPage.ClickProductivityPaneTool(Constants.KStool);
    await macrosAdminPage.ValidateThePage(Constants.Knowledgesearch);
    await macrosAdminPage.CloseSession(Constants.CloseSession1);
    await macrosAdminPage.GoToHome();
    await macrosAdminPage.InitiateSession(
      CaseTitleName,
      stringFormat(Constants.SpecificCaseLink1, rnd)
    );
    await macrosAdminPage.ValidateThePage(Constants.TabNoProdu);
    await macrosAdminPage.CloseSession(Constants.CloseSession1);
    await macrosAdminPage.GoToHome();
    //Initiate Session and validate page
    await macrosAdminPage.InitiateSession(
      CaseTitleName,
      stringFormat(Constants.SpecificCaseLink1, rnd)
    );
    await macrosAdminPage.ValidateThePage(Constants.ProductivityPaneEnable);
    await macrosAdminPage.ValidateThePage(Constants.ValidateSuggestion);
    //Open Agent Script tool and validate
    await macrosAdminPage.ClickProductivityPaneTool(Constants.AStool);
    await macrosAdminPage.ValidateThePage(Constants.AStool);
    //Open Knowledge search tool and validate
    await macrosAdminPage.ClickProductivityPaneTool(Constants.KStool);
    await macrosAdminPage.ValidateThePage(Constants.ValidateKSResults);
  });

  ///<summary>
  ///Test Case 1968349: Verify admin E2E experience in configuring Channel provider tab for an app profile
  ///Test Case Link  https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1968349
  ///<summary>
  it("Test Case 1968349: Verify admin E2E experience in configuring Channel provider tab for an app profile", async () => {
    const rnd = agentScriptAdminPage.RandomNumber();
    //Login as admin and create two cases and initiate it and verify
    await adminStartPage.navigateToOrgUrlAndSignIn(
      TestSettings.MacrosAgentEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await macrosAdminPage.createAppProfile();
    await macrosAdminPage.createRandomChannel(rnd);
    await macrosAdminPage.AddChannel(Constants.ChannelName+rnd);
});
});
