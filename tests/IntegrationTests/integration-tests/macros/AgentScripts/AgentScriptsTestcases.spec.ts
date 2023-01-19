import { BrowserContext, Page } from "playwright";
import { Constants } from "../../common/constants";
import { Macros } from "../../macropages/macrosAdmin";
import { OrgDynamicsCrmStartPage } from "../../../pages/org-dynamics-crm-start.page";
import { TestHelper } from "../../../helpers/test-helper";
import { TestSettings } from "../../../configuration/test-settings";
import { AppProfileHelper } from "helpers/appprofile-helper";
import { EntityNames } from "Utility/Constants";
import { AgentChat } from "pages/AgentChat";
import { AgentScript } from "integration-tests/agentScript/pages/agentScriptAdmin";

describe("Agent Scripts - ", () => {
  let adminContext: BrowserContext;
  let adminPage: Page;
  let adminStartPage: OrgDynamicsCrmStartPage;
  let agentPage: Page;
  let agentContext: BrowserContext;
  let macrosAdminPage: Macros;
  let agentChat: AgentChat;
  let rnd: any;
  const agentScriptAdminPage = new AgentScript(adminPage);

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
    rnd = agentScriptAdminPage.RandomNumber();
    //Login as admin and create macro
    await adminStartPage.navigateToOrgUrlAndSignIn(
      TestSettings.MacrosAgentEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await macrosAdminPage.validatePopup();
    await macrosAdminPage.createMacro(Constants.OpenNewFormMacroName);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    const workflowID = await macrosAdminPage.getLatestMacro(
      agentChat,
      Constants.OpenNewFormMacroName
    );
    await adminStartPage.waitForDomContentLoaded();
    const agentScript = await agentChat.createAgentScriptbyXRMAPI(
      Constants.OpenNewFormAgentScriptName + rnd,
      Constants.UniqueName + rnd
    );
    await adminStartPage.waitForDomContentLoaded();
    const agentScriptStep = await agentChat.createAgentScriptStepbyXRMAPI(
      Constants.OpenNewFormAgentScriptName + rnd,
      Constants.UniqueName + rnd + rnd,
      Constants.AgentscriptStepOrder,
      Constants.MacroAgentScriptStep,
      agentScript.id,
      Constants.OpenNewFormMacroName,
      workflowID
    );
    await adminStartPage.waitForDomContentLoaded();
    await macrosAdminPage.OpenAgentScriptandSave(
      Constants.OpenNewFormAgentScriptName + rnd
    );
    await adminStartPage.waitForDomContentLoaded();
    await macrosAdminPage.addAgentScripttoDefaultChatSessionWithParameter(
      Constants.OpenNewFormAgentScriptName + rnd
    );
    //Run Macro
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    const caseTitle = await macrosAdminPage.createCaseWithAPI(
      Constants.CaseTitleName
    );
    await macrosAdminPage.InitiateSession(
      caseTitle,
      Constants.LinkStart + caseTitle + Constants.LinkEnd
    );
    const openEntityRecordTabUsingMacro =
      await macrosAdminPage.runMacroInSessionAndValidate(
        Constants.OpenNewFormAgentScriptName + rnd,
        Constants.OpenNewFormTitle
      );
    expect(openEntityRecordTabUsingMacro).toBeTruthy();
    await macrosAdminPage.deletAgentScriptStepByXRM(
      agentChat,
      EntityNames.AgentScriptStep,
      agentScriptStep.id
    );
    await macrosAdminPage.deleteAgentScriptByXRM(
      agentChat,
      EntityNames.AgentScript,
      agentScript.id
    );
    await agentChat.deleteRecordbyXRM(EntityNames.Macros, workflowID);
  });

  ///<summary>
  ///Test Case 1593399: Verify Admin is able to associate agent scripts to session template
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1593399
  ///</summary>
  it("Test Case 1593399: Verify Admin is able to associate agent scripts to session template", async () => {
    agentPage = await agentContext.newPage();
    rnd = agentScriptAdminPage.RandomNumber();
    //Login as admin and create cases
    await agentChat.navigateToOrgUrlAndSignIn(
      TestSettings.AgentScriptEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await macrosAdminPage.createMacro(Constants.AutoFillMacroName);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await macrosAdminPage.validatePopup();

    const workflowID = await macrosAdminPage.getLatestMacro(
      agentChat,
      Constants.AutoFillMacroName
    );
    const agentScript = await agentChat.createAgentScriptbyXRMAPI(
      Constants.AutoFillAgentScriptName + rnd,
      Constants.UniqueName + rnd
    );
    const agentScriptStep = await agentChat.createAgentScriptStepbyXRMAPI(
      Constants.AutoFillAgentScriptName + rnd,
      Constants.UniqueName + rnd + rnd,
      Constants.AgentscriptStepOrder,
      Constants.MacroAgentScriptStep,
      agentScript.id,
      Constants.AutoFillMacroName,
      workflowID
    );
    await macrosAdminPage.OpenAgentScriptandSave(
      Constants.AutoFillAgentScriptName + rnd
    );
    await macrosAdminPage.addAgentScripttoDefaultChatSessionWithParameter(
      Constants.AutoFillAgentScriptName + rnd
    );
    //Run Macro
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    const caseTitle = await macrosAdminPage.createCaseWithAPI(
      Constants.CaseTitleName
    );
    await macrosAdminPage.InitiateSession(
      caseTitle,
      Constants.LinkStart + caseTitle + Constants.LinkEnd
    );
    const runValidateAutoFillMacro =
      await macrosAdminPage.runMacroInSessionAndValidate(
        Constants.AutoFillAgentScriptName + rnd,
        Constants.AutoFillTitle
      );
    expect(runValidateAutoFillMacro).toBeTruthy();
    await macrosAdminPage.deletAgentScriptStepByXRM(
      agentChat,
      EntityNames.AgentScriptStep,
      agentScriptStep.id
    );
    await macrosAdminPage.deleteAgentScriptByXRM(
      agentChat,
      EntityNames.AgentScript,
      agentScript.id
    );
    await agentChat.deleteRecordbyXRM(EntityNames.Macros, workflowID);
    });
});
