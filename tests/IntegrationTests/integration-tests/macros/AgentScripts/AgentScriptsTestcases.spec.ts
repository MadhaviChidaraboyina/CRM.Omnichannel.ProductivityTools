import { BrowserContext, Page } from "playwright";
import { Constants } from "../../common/constants";
import { Macros } from "../../macropages/macrosAdmin";
import { OrgDynamicsCrmStartPage } from "../../../pages/org-dynamics-crm-start.page";
import { TestHelper } from "../../../helpers/test-helper";
import { TestSettings } from "../../../configuration/test-settings";
import { AppProfileHelper } from "helpers/appprofile-helper";
import { AgentChat } from "pages/AgentChat";

describe("Agent Scripts - ", () => {
  let adminContext: BrowserContext;
  let adminPage: Page;
  let adminStartPage: OrgDynamicsCrmStartPage;
  let agentPage: Page;
  let agentContext: BrowserContext;
  let macrosAdminPage: Macros;
  let agentChat: AgentChat;
  let rnd: any;

  beforeAll(async () => {
    await AppProfileHelper.getInstance().CreateAppProfile();
  })

  beforeEach(async () => {
    adminContext = await browser.newContext({
      viewport: TestSettings.Viewport, extraHTTPHeaders: {
        origin: "",
      },
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
    TestHelper.dispose(agentContext);
  });


  ///<summary>
  ///Test Case 1577436: Verify Admin is able to configure agent scripts
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1577436
  ///</summary>
  it("Test Case 1577436: Verify Admin is able to configure agent scripts", async () => {
    agentPage = await agentContext.newPage();
    try {
      //Login as admin automated and redirected to OrgUrl
      await adminStartPage.navigateToOrgUrlAndSignIn(
        TestSettings.AgentScriptEmail,
        TestSettings.AdminAccountPassword
      );
      await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
      await macrosAdminPage.createMacro(
        Constants.SearchPhraseForPopulatedPhrase
      );
      await macrosAdminPage.createAgentScriptWithoutSteps(
        Constants.AgentscriptName2,
        Constants.AgentScriptUniqueName2
      );
      await macrosAdminPage.createAgentScriptforMultipleSteps(
        Constants.AgentScriptName1,
        Constants.AgentScriptUniqueName1,
        Constants.SearchPhraseForPopulatedPhrase,
        Constants.SelectOptionText,
        Constants.SelectOptionScript
      );
      //Validating The Title of Application Tab by running the Macro
      const VisibleAgentScriptSteps =
        await macrosAdminPage.ValidateStepsinAgentScript(
          adminPage,
          Constants.AgentScriptName1
        );
      expect(VisibleAgentScriptSteps).toBeTruthy();
    } finally {
      await macrosAdminPage.deleteMacro(
        adminStartPage,
        Constants.SearchPhraseForPopulatedPhrase
      );
    }
  });

  ///<summary>
  ///Test Case 1593399: Verify Admin is able to associate agent scripts to session template
  ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_testPlans/execute?planId=2478602&opId=3561&suiteId=2478606
  ///</summary>
  it("Test Case 1593399: Verify Admin is able to associate agent scripts to session template", async () => {
    agentPage = await agentContext.newPage();

    //Login as admin automated and redirected to OrgUrl
    await adminStartPage.navigateToOrgUrlAndSignIn(
      TestSettings.MacroAccountEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);

    await macrosAdminPage.createResolveSessionMacro(
      Constants.RefreshSessionContextTitle,
      Constants.IncidentID
    );

    // Create AgentScript and Add Macro to it's agentScript step
    await agentChat.createAgentScriptbyXRMAPI(Constants.AgentScriptName,
      Constants.AgentScriptUniqueName + rnd);

    // Create Session and Add agentscript to it
    await macrosAdminPage.SessionInCSAdminCenter(
      Constants.SessionTemplateName,
      Constants.SessionTemplateUniqueName
    );
    await macrosAdminPage.AddAgentScriptToSession(Constants.AgentScriptName);
  });
});
