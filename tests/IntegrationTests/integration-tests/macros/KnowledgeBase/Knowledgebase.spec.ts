import { BrowserContext, Page } from "playwright";
import { Constants } from "../../common/constants";
import { LiveChatPage } from "../../../pages/LiveChat";
import { Macros } from "../../macropages/macrosAdmin";
import { OrgDynamicsCrmStartPage } from "../../../pages/org-dynamics-crm-start.page";
import { TestHelper } from "../../../helpers/test-helper";
import { TestSettings } from "../../../configuration/test-settings";

describe("Macro testcases - ", () => {
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
    try {
      //Login as admin and create macro
      await adminStartPage.navigateToOrgUrlAndSignIn(
        TestSettings.MacroAccountEmail,
        TestSettings.AdminAccountPassword
      );
      await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
      // create Macros of four types
      await macrosAdminPage.createUpdateMacro(Constants.KnowledgeBaseBlankMacroName,Constants.KnowledgeBasePSBlank);
      await macrosAdminPage.createUpdateMacro(Constants.KnowledgeBasePTextMacroName,Constants.KnowledgeBasePSText);
      await macrosAdminPage.createUpdateMacro(Constants.KnowledgeBaseSlugMacroName,Constants.SlugName);
      await macrosAdminPage.createUpdateMacro(Constants.KnowledgeBaseRndMacroName,Constants.KnowledgeBasePSRandom);
      // create Agent Script of four types and attach corresponding Macros 
      await macrosAdminPage.createAgentScript(
        Constants.KnowledgeBaseBlankAgentScriptName,
        Constants.TitleUniqueName,
        Constants.KnowledgeBaseBlankMacroName
      );
      await macrosAdminPage.createAgentScript(
        Constants.KnowledgeBasePTextAgentScriptName,
        Constants.TitleUniqueName,
        Constants.KnowledgeBasePTextMacroName
      );
      await macrosAdminPage.createAgentScript(
        Constants.KnowledgeBaseSlugAgentScriptName,
        Constants.TitleUniqueName,
        Constants.KnowledgeBaseSlugMacroName
      );
      await macrosAdminPage.createAgentScript(
        Constants.KnowledgeBaseRndAgentScriptName,
        Constants.TitleUniqueName,
        Constants.KnowledgeBaseRndMacroName
      );
      // add all Agent Scripts to default session
      await macrosAdminPage.addAgentScripttoDefaultChatSessionWithParameter(
        Constants.KnowledgeBaseBlankAgentScriptName
      );
      await macrosAdminPage.addAgentScripttoDefaultChatSessionWithParameter(
        Constants.KnowledgeBasePTextAgentScriptName
      );
      await macrosAdminPage.addAgentScripttoDefaultChatSessionWithParameter(
        Constants.KnowledgeBaseSlugAgentScriptName
      );
      await macrosAdminPage.addAgentScripttoDefaultChatSessionWithParameter(
        Constants.KnowledgeBaseRndAgentScriptName
      );
      // Run Macro and validte all four scenarios
      await macrosAdminPage.openAppLandingPage(adminPage);
      await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
      await macrosAdminPage.CreateCaseInCSW(Constants.CaseTitleName);
      await macrosAdminPage.InitiateSession(
        Constants.CaseTitleName,
        Constants.CaseLink1
      );
      const validateBlankString =
        await macrosAdminPage.runMacroInSessionAndValidate(
          Constants.KnowledgeBaseBlankAgentScriptName,
          Constants.KBArticlelinkTitle
        );
      expect(validateBlankString).toBeTruthy();
      await macrosAdminPage.CloseSession(Constants.CloseSession1);
      await macrosAdminPage.GoToHome();
      await macrosAdminPage.InitiateSession(
        Constants.CaseTitleName,
        Constants.CaseLink1
      );
      const validatePlainText =
        await macrosAdminPage.runMacroInSessionAndValidate(
          Constants.KnowledgeBasePTextAgentScriptName,
          Constants.KBArticlelinkPTextTitle
        );
      expect(validatePlainText).toBeTruthy();
      await macrosAdminPage.CloseSession(Constants.CloseSession1);
      await macrosAdminPage.GoToHome();
      await macrosAdminPage.InitiateSession(
        Constants.CaseTitleName,
        Constants.CaseLink1
      );
      const validateSlugValue =
        await macrosAdminPage.runMacroInSessionAndValidate(
          Constants.KnowledgeBaseSlugAgentScriptName,
          Constants.KBArticlelinkTitle
        );
      expect(validateSlugValue).toBeTruthy();
      await macrosAdminPage.CloseSession(Constants.CloseSession1);
      await macrosAdminPage.GoToHome();
      await macrosAdminPage.InitiateSession(
        Constants.CaseTitleName,
        Constants.CaseLink1
      );
      const validateRandomString =
        await macrosAdminPage.runMacroInSessionAndValidate(
          Constants.KnowledgeBaseRndAgentScriptName,
          Constants.KBArticlelinkRndTitle
        );
      expect(validateRandomString).toBeTruthy();
    } finally {
      await macrosAdminPage.deleteAgentScriptnNew(
        adminPage,
        adminStartPage,
        Constants.KnowledgeBaseRString
      );
      await macrosAdminPage.deleteMacroFromOmnichannelAdminCenterApp(
        Constants.KnowledgeBaseRString
      );
      await macrosAdminPage.removeAgentScripttoDefaultCaseSession();
    }
  });
});