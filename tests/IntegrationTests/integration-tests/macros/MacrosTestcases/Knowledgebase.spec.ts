import { AgentChat } from "../../../pages/AgentChat";
import { BrowserContext, Page } from "playwright";
import { Constants, EntityAttributes, EntityNames } from "../../common/constants";
import { LiveChatPage } from "../../../pages/LiveChat";
import { Macros } from "../../macropages/macrosAdmin";
import { OrgDynamicsCrmStartPage } from "../../../pages/org-dynamics-crm-start.page";
import { TestHelper } from "../../../helpers/test-helper";
import { TestSettings } from "../../../configuration/test-settings";
import { stringFormat } from "Utility/Constants";
import { AgentScript } from "../../agentScript/pages/agentScriptAdmin";

describe("Macro testcases - ", () => {
  let adminContext: BrowserContext;
  let adminPage: Page;
  let adminStartPage: OrgDynamicsCrmStartPage;
  let agentPage: Page;
  let agentContext: BrowserContext;
  let liveChatContext: BrowserContext;
  let liveChatPage: LiveChatPage;
  let macrosAdminPage: Macros;
  let agentChat: AgentChat;
  let rnd: any;
  var caseNameList: string[] = [];
  const agentScriptAdminPage = new AgentScript(adminPage);

  beforeEach(async () => {
    adminContext = await browser.newContext({
      viewport: TestSettings.Viewport,
      extraHTTPHeaders: {
        origin: "",
      },
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
    agentChat = new AgentChat(adminPage);
  });
  afterEach(async () => {
    TestHelper.dispose(adminContext);
    TestHelper.dispose(liveChatContext);
    TestHelper.dispose(agentContext);
  });


  ///<summary>
  ///Test Case 2760596: Verify ability to set page tab label when using 'Search the knowledge base for the populated phrase' macro.
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2760596
  ///</summary>
  it("Test Case 2760596: Verify ability to set page tab label when using 'Search the knowledge base for the populated phrase' macro.", async () => {
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
    // create macro of blank type, create agent script and add agent script to chat session
    await macrosAdminPage.createMacro(
      Constants.KnowledgeBaseBlankMacroName
    );
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    const workflowIDBlank = await macrosAdminPage.getLatestMacro(agentChat, Constants.KnowledgeBaseBlankMacroName);
    const agentScriptBlank = await macrosAdminPage.createAgentScriptByXRMAPI(agentChat,
      Constants.KnowledgeBaseBlankAgentScriptName + rnd,
      Constants.UniqueName + rnd);
    const agentScriptStepBlank = await macrosAdminPage.createAgentScriptStepbyXRMAPI(agentChat,
      Constants.KnowledgeBaseBlankAgentScriptName + rnd,
      Constants.UniqueName + rnd + rnd,
      Constants.AgentscriptStepOrder,
      Constants.MacroAgentScriptStep,
      agentScriptBlank.id,
      Constants.KnowledgeBaseBlankMacroName,
      workflowIDBlank);

    await macrosAdminPage.OpenAgentScriptandSave(Constants.KnowledgeBaseBlankAgentScriptName + rnd);

    // create macro of PText type, create agent script and add agent script to chat session
    await macrosAdminPage.createMacro(
      Constants.KnowledgeBasePTextMacroName
    );
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    const workflowIDPText = await macrosAdminPage.getLatestMacro(agentChat, Constants.KnowledgeBasePTextMacroName);
    const agentScriptPText = await macrosAdminPage.createAgentScriptByXRMAPI(agentChat,
      Constants.KnowledgeBasePTextAgentScriptName + rnd,
      Constants.UniqueName + rnd + rnd);
    const agentScriptStepPText = await macrosAdminPage.createAgentScriptStepbyXRMAPI(agentChat,
      Constants.KnowledgeBasePTextAgentScriptName + rnd,
      Constants.UniqueName + rnd + rnd + rnd,
      Constants.AgentscriptStepOrder,
      Constants.MacroAgentScriptStep,
      agentScriptPText.id,
      Constants.KnowledgeBasePTextMacroName,
      workflowIDPText);
  
    await macrosAdminPage.OpenAgentScriptandSave(Constants.KnowledgeBasePTextAgentScriptName + rnd);

    // create macro of Slug type, create agent script and add agent script to chat session
    await macrosAdminPage.createMacro(
      Constants.KnowledgeBaseSlugMacroName
    );
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    const workflowIDSlug = await macrosAdminPage.getLatestMacro(agentChat, Constants.KnowledgeBaseSlugMacroName);
    const agentScriptSlug = await macrosAdminPage.createAgentScriptByXRMAPI(agentChat,
      Constants.KnowledgeBaseSlugAgentScriptName + rnd,
      Constants.UniqueName + rnd + rnd + rnd);
    const agentScriptStepSlug = await macrosAdminPage.createAgentScriptStepbyXRMAPI(agentChat,
      Constants.KnowledgeBaseSlugAgentScriptName + rnd,
      Constants.UniqueName + rnd + rnd + rnd + rnd,
      Constants.AgentscriptStepOrder,
      Constants.MacroAgentScriptStep,
      agentScriptSlug.id,
      Constants.KnowledgeBaseSlugMacroName,
      workflowIDSlug);

      await macrosAdminPage.OpenAgentScriptandSave(Constants.KnowledgeBaseSlugAgentScriptName + rnd);

    // create macro of Rnd type, create agent script and add agent script to chat session
    await macrosAdminPage.createMacro(
      Constants.KnowledgeBaseRndMacroName
    );
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage); 
    const workflowIDRnd = await macrosAdminPage.getLatestMacro(agentChat, Constants.KnowledgeBaseRndMacroName);
    const agentScriptRnd = await macrosAdminPage.createAgentScriptByXRMAPI(agentChat,
      Constants.KnowledgeBaseRndAgentScriptName + rnd,
      Constants.UniqueName + rnd + rnd + rnd + rnd);
    const agentScriptStepRnd = await macrosAdminPage.createAgentScriptStepbyXRMAPI(agentChat,
      Constants.KnowledgeBaseRndAgentScriptName + rnd,
      Constants.UniqueName + rnd + rnd + rnd + rnd + rnd,
      Constants.AgentscriptStepOrder,
      Constants.MacroAgentScriptStep,
      agentScriptRnd.id,
      Constants.KnowledgeBaseRndMacroName,
      workflowIDRnd);

    await macrosAdminPage.OpenAgentScriptandSave(Constants.KnowledgeBaseRndAgentScriptName + rnd); 
    await macrosAdminPage.addFourAgentScriptToDefaultSesssionTemplateWithParameter(
      Constants.KnowledgeBaseBlankAgentScriptName + rnd,
      Constants.KnowledgeBasePTextAgentScriptName + rnd,
      Constants.KnowledgeBaseSlugAgentScriptName + rnd,
      Constants.KnowledgeBaseRndAgentScriptName + rnd
    );

    // Run Macro and validate all four scenarios
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await macrosAdminPage.waitForDomContentLoaded();
    await macrosAdminPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    const caseTitle = await macrosAdminPage.createCaseWithAPI(
      Constants.CaseTitleName
    );
    await macrosAdminPage.InitiateSession(
      caseTitle,
      Constants.LinkStart + caseTitle + Constants.LinkEnd
    );
    const validateBlankString =
      await macrosAdminPage.runMacroInSessionAndValidate(
        Constants.KnowledgeBaseBlankAgentScriptName + rnd,
        Constants.KBArticlelinkTitle
      );
    expect(validateBlankString).toBeTruthy();
    await macrosAdminPage.CloseSession(Constants.CloseSession1);

    await macrosAdminPage.GoToHome();
    await macrosAdminPage.waitForDomContentLoaded();
    await macrosAdminPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    const caseTitle1 = await macrosAdminPage.createCaseWithAPI(
      Constants.CaseTitleName
    );
    await macrosAdminPage.InitiateSession(
      caseTitle1,
      Constants.LinkStart + caseTitle1 + Constants.LinkEnd
    );
    const validatePlainText =
      await macrosAdminPage.runMacroInSessionAndValidate(
        Constants.KnowledgeBasePTextAgentScriptName + rnd,
        Constants.KBArticlelinkPTextTitle
      );
    expect(validatePlainText).toBeTruthy();
    await macrosAdminPage.CloseSession(Constants.CloseSession1);

    await macrosAdminPage.GoToHome();
    await macrosAdminPage.waitForDomContentLoaded();
    await macrosAdminPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    const caseTitle2 = await macrosAdminPage.createCaseWithAPI(
      Constants.CaseTitleName
    );
    await macrosAdminPage.InitiateSession(
      caseTitle2,
      Constants.LinkStart + caseTitle2 + Constants.LinkEnd
    );
    const validateSlugValue =
      await macrosAdminPage.runMacroInSessionAndValidate(
        Constants.KnowledgeBaseSlugAgentScriptName + rnd,
        Constants.KBArticlelinkTitle
      );
    expect(validateSlugValue).toBeTruthy();
    await macrosAdminPage.CloseSession(Constants.CloseSession1);

    await macrosAdminPage.GoToHome();
    await macrosAdminPage.waitForDomContentLoaded();
    await macrosAdminPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    const caseTitle3 = await macrosAdminPage.createCaseWithAPI(
      Constants.CaseTitleName
    );
    await macrosAdminPage.InitiateSession(
      caseTitle3,
      Constants.LinkStart + caseTitle3 + Constants.LinkEnd
    );
    const validateRandomString =
      await macrosAdminPage.runMacroInSessionAndValidate(
        Constants.KnowledgeBaseRndAgentScriptName + rnd,
        Constants.KBArticlelinkRndTitle
      );
    expect(validateRandomString).toBeTruthy();

    await macrosAdminPage.deletAgentscriptStepbyXRM(agentChat, EntityNames.AgentScriptStep, agentScriptStepBlank.id);
    await macrosAdminPage.deletAgentscriptStepbyXRM(agentChat, EntityNames.AgentScriptStep, agentScriptStepPText.id);
    await macrosAdminPage.deletAgentscriptStepbyXRM(agentChat, EntityNames.AgentScriptStep, agentScriptStepSlug.id);
    await macrosAdminPage.deletAgentscriptStepbyXRM(agentChat, EntityNames.AgentScriptStep, agentScriptStepRnd.id);

    await macrosAdminPage.deleteAgentScriptbyXRM(agentChat, EntityNames.AgentScript, agentScriptBlank.id);
    await macrosAdminPage.deleteAgentScriptbyXRM(agentChat, EntityNames.AgentScript, agentScriptPText.id);
    await macrosAdminPage.deleteAgentScriptbyXRM(agentChat, EntityNames.AgentScript, agentScriptSlug.id);
    await macrosAdminPage.deleteAgentScriptbyXRM(agentChat, EntityNames.AgentScript, agentScriptRnd.id);

    await agentChat.deleteRecordbyXRM(EntityNames.Macros, workflowIDBlank);
    await agentChat.deleteRecordbyXRM(EntityNames.Macros, workflowIDPText);
    await agentChat.deleteRecordbyXRM(EntityNames.Macros, workflowIDSlug);
    await agentChat.deleteRecordbyXRM(EntityNames.Macros, workflowIDRnd);
    
  });
});