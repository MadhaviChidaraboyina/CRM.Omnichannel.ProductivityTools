import { BrowserContext, Page } from "playwright";
import { Constants } from "../../../common/constants";
import { LiveChatPage } from "../../../../pages/LiveChat";
import { Macros } from "../../../macropages/macrosAdmin";
import { OrgDynamicsCrmStartPage } from "../../../../pages/org-dynamics-crm-start.page";
import { TestHelper } from "../../../../helpers/test-helper";
import { TestSettings } from "../../../../configuration/test-settings";
import { AgentScript } from "integration-tests/agentScript/pages/agentScriptAdmin";
import { AgentChat } from "pages/AgentChat";
import { EntityNames } from "Utility/Constants";

describe("Macro Test Scenerios - ", () => {
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
  const agentScriptAdminPage = new AgentScript(adminPage);
  var caseNameList: string[] = [];

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
      extraHTTPHeaders: {
        origin: "",
      },
    });
    agentContext = await browser.newContext({
      viewport: TestSettings.Viewport,
      acceptDownloads: true,
      extraHTTPHeaders: {
        origin: "",
      },
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
  ///Test Case 2313858: [Macros] Verify record is link to the conversation using 'Link record to the conversation' action in the macros.
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2313858
  ///</summary>
  it("Test Case 2313858: [Macros] Verify record is link to the conversation using 'Link record to the conversation' action in the macros.", async () => {
    agentPage = await agentContext.newPage();
    rnd = agentScriptAdminPage.RandomNumber();
    //Login as admin and create cases
    await agentChat.navigateToOrgUrlAndSignIn(
      TestSettings.MacrosAgentEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    const accountid = await macrosAdminPage.createAccountAndGetAccountId(
      Constants.AccountName2 + rnd
    );
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);

    await macrosAdminPage.createMacro(
      Constants.LinkRecordMacroName,
      accountid
    );
    await adminStartPage.waitForDomContentLoaded();
    const workflowID = await macrosAdminPage.getLatestMacro(
      agentChat,
      Constants.LinkRecordMacroName
    );

    const agentScript = await agentChat.createAgentScriptbyXRMAPI(
      Constants.LinkRecordAgentScriptName + rnd,
      Constants.UniqueName + rnd
    );
    const agentScriptStep = await agentChat.createAgentScriptStepbyXRMAPI(
      Constants.LinkRecordAgentScriptName + rnd,
      Constants.UniqueName + rnd + rnd,
      Constants.AgentscriptStepOrder,
      Constants.MacroAgentScriptStep,
      agentScript.id,
      Constants.LinkRecordMacroName,
      workflowID
    );
    await macrosAdminPage.OpenAgentScriptandSave(
      Constants.LinkRecordAgentScriptName + rnd
    );
    await macrosAdminPage.addAgentScripttoDefaultChatSessionWithParameter(
      Constants.LinkRecordAgentScriptName + rnd
    );
    //Run Macro
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToCustomerServiceWorkspace();
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    const caseTitle = await macrosAdminPage.createCaseWithAPI(
      Constants.CaseTitleName
    );
    await macrosAdminPage.InitiateSession(
      caseTitle,
      Constants.LinkStart + caseTitle + Constants.LinkEnd
    );
    const runValidateLinkRecordMacro =
      await macrosAdminPage.runMacroInSessionAndValidate(
        Constants.LinkRecordAgentScriptName + rnd,
        Constants.LinkRecordTitle
      );
    expect(runValidateLinkRecordMacro).toBeTruthy();
    await adminStartPage.waitForDomContentLoaded();
    await macrosAdminPage.deletAgentScriptStepByXRM(
      agentChat,
      EntityNames.AgentScriptStep,
      agentScriptStep.id
    );
    await adminStartPage.waitForDomContentLoaded();
    await macrosAdminPage.deleteAgentScriptByXRM(
      agentChat,
      EntityNames.AgentScript,
      agentScript.id
    );
    await adminStartPage.waitForDomContentLoaded();
    await agentChat.deleteRecordbyXRM(EntityNames.Macros, workflowID);
  });

  ///<summary>
  ///Test Case 2313863: [Macros] Verify record is unlink to the conversation using 'UnLink record from the conversation' action in the macros.
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2313863
  ///</summary>
  it("Test Case 2313863: [Macros] Verify record is unlink to the conversation using 'UnLink record to the conversation' action in the macros.", async () => {
    agentPage = await agentContext.newPage();
    rnd = agentScriptAdminPage.RandomNumber();
    //Login as admin and create cases
    await agentChat.navigateToOrgUrlAndSignIn(
      TestSettings.MacrosAgentEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    
    const accountId1 = await macrosAdminPage.createAccountAndGetAccountId(
      Constants.AccountName1 + rnd
    );
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    
    await macrosAdminPage.createMacro(
      Constants.LinkRecordMacroName,
      accountId1
    );
    await macrosAdminPage.createMacro(
      Constants.UnlinkRecordMacroName,
      accountId1
    );
    // link macro validations
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    const workflowID1 = await macrosAdminPage.getLatestMacro(
      agentChat,
      Constants.LinkRecordMacroName
    );

    const agentScript1 = await agentChat.createAgentScriptbyXRMAPI(
      Constants.LinkRecordAgentScriptName + rnd,
      Constants.UniqueName + rnd
    );
    const agentScriptStep1 = await agentChat.createAgentScriptStepbyXRMAPI(
      Constants.LinkRecordAgentScriptName + rnd,
      Constants.UniqueName + rnd + rnd,
      Constants.AgentscriptStepOrder,
      Constants.MacroAgentScriptStep,
      agentScript1.id,
      Constants.LinkRecordMacroName,
      workflowID1
    );
    await macrosAdminPage.OpenAgentScriptandSave(
      Constants.LinkRecordAgentScriptName + rnd
    );
    await macrosAdminPage.addAgentScripttoDefaultChatSessionWithParameter(
      Constants.LinkRecordAgentScriptName + rnd
    );
    //Run Macro
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToCustomerServiceWorkspace();
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    const caseTitle = await macrosAdminPage.createCaseWithAPI(
      Constants.CaseTitleName
    );
    await macrosAdminPage.InitiateSession(
      caseTitle,
      Constants.LinkStart + caseTitle + Constants.LinkEnd
    );
    const runValidateLinkRecordMacro =
      await macrosAdminPage.runMacroInSessionAndValidate(
        Constants.LinkRecordAgentScriptName + rnd,
        Constants.LinkRecordTitle
      );
    expect(runValidateLinkRecordMacro).toBeTruthy();

    // unlink macro validations
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    const workflowID2 = await macrosAdminPage.getLatestMacro(
      agentChat,
      Constants.UnlinkRecordMacroName
    );

    const agentScript2 = await agentChat.createAgentScriptbyXRMAPI(
      Constants.UnlinkRecordAgentScriptName + rnd,
      Constants.UniqueName + rnd + rnd + rnd
    );
    const agentScriptStep2 = await agentChat.createAgentScriptStepbyXRMAPI(
      Constants.UnlinkRecordAgentScriptName + rnd,
      Constants.UniqueName + rnd + rnd + rnd + rnd,
      Constants.AgentscriptStepOrder,
      Constants.MacroAgentScriptStep,
      agentScript2.id,
      Constants.UnlinkRecordMacroName,
      workflowID2
    );
    await macrosAdminPage.OpenAgentScriptandSave(
      Constants.UnlinkRecordAgentScriptName + rnd
    );
    await macrosAdminPage.addAgentScripttoDefaultChatSessionWithParameter(
      Constants.UnlinkRecordAgentScriptName + rnd
    );
    //Run Macro
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToCustomerServiceWorkspace();
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    const caseTitle1 = await macrosAdminPage.createCaseWithAPI(
      Constants.CaseTitleName
    );
    await macrosAdminPage.InitiateSession(
      caseTitle1,
      Constants.LinkStart + caseTitle1 + Constants.LinkEnd
    );
    const runValidateUnlinkRecordMacro =
      await macrosAdminPage.runMacroInSessionAndValidate(
        Constants.UnlinkRecordAgentScriptName + rnd,
        Constants.UnlinkRecordTitle
      );
    expect(runValidateUnlinkRecordMacro).toBeTruthy();
    await adminStartPage.waitForDomContentLoaded();
    await macrosAdminPage.deletAgentScriptStepByXRM(
      agentChat,
      EntityNames.AgentScriptStep,
      agentScriptStep1.id
    );
    await adminStartPage.waitForDomContentLoaded();
    await macrosAdminPage.deleteAgentScriptByXRM(
      agentChat,
      EntityNames.AgentScript,
      agentScript1.id
    );
    await adminStartPage.waitForDomContentLoaded();
    await agentChat.deleteRecordbyXRM(EntityNames.Macros, workflowID1);
    await adminStartPage.waitForDomContentLoaded();
    await macrosAdminPage.deletAgentScriptStepByXRM(
      agentChat,
      EntityNames.AgentScriptStep,
      agentScriptStep2.id
    );
    await adminStartPage.waitForDomContentLoaded();
    await macrosAdminPage.deleteAgentScriptByXRM(
      agentChat,
      EntityNames.AgentScript,
      agentScript2.id
    );
    await adminStartPage.waitForDomContentLoaded();
    await agentChat.deleteRecordbyXRM(EntityNames.Macros, workflowID2);
  });

  ///<summary>
  /// Test Case 1805099: [Macros] Verify KB article link is copied using ‘Search Knowledge base article’ action in the chat window using 'Send KB article' in macro
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1805099
  ///</summary>
  it("Test Case 1805099: [Macros] Verify KB article link is copied using ‘Search Knowledge base article’ action in the chat window using 'Send KB article' in macro", async () => {
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
    
    await macrosAdminPage.createMacro(Constants.OpenKBSearchMacroName);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    const workflowID = await macrosAdminPage.getLatestMacro(
      agentChat,
      Constants.OpenKBSearchMacroName
    );
    const agentScript = await agentChat.createAgentScriptbyXRMAPI(
      Constants.OpenKBSearchAgentScriptName + rnd,
      Constants.UniqueName + rnd
    );
    const agentScriptStep = await agentChat.createAgentScriptStepbyXRMAPI(
      Constants.OpenKBSearchAgentScriptName + rnd,
      Constants.UniqueName + rnd + rnd,
      Constants.AgentscriptStepOrder,
      Constants.MacroAgentScriptStep,
      agentScript.id,
      Constants.OpenKBSearchMacroName,
      workflowID
    );
    await macrosAdminPage.OpenAgentScriptandSave(
      Constants.OpenKBSearchAgentScriptName + rnd
    );
    await macrosAdminPage.addAgentScripttoDefaultChatSessionWithParameter(
      Constants.OpenKBSearchAgentScriptName + rnd
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
        Constants.OpenKBSearchAgentScriptName + rnd,
        Constants.OpenKBSearchTitleName
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
});
