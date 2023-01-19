import { BrowserContext, Page } from "playwright";
import { Constants } from "../../../common/constants";
import { LiveChatPage } from "../../../../pages/LiveChat";
import { Macros } from "../../../macropages/macrosAdmin";
import { OrgDynamicsCrmStartPage } from "../../../../pages/org-dynamics-crm-start.page";
import { TestHelper } from "../../../../helpers/test-helper";
import { TestSettings } from "../../../../configuration/test-settings";
import { AgentScript } from "integration-tests/agentScript/pages/agentScriptAdmin";
import { AgentChat } from "pages/AgentChat";
import { stringFormat } from "Utility/Constants";

describe("Productivity Pane Test Scenerios - ", () => {
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
  let rnd: any;
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
  ///Test Case 2045250: [Productivity Pane: Smart Assist] : Setup smart assist using customer service hub for similar case and article suggestions
  ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045250
  ///<summary>
  it("Test Case 2045250: [Productivity Pane: Smart Assist] : Setup smart assist using customer service hub for similar case and article suggestions", async () => {
    //Login as admin and create case
    await adminStartPage.navigateToOrgUrlAndSignIn(
      TestSettings.MacrosAgentEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await macrosAdminPage.SetupSmartAssist();
    //validating simmilar suggestions and KB suggestions
    await macrosAdminPage.ValidateThePage(Constants.SimilarSuggestionsinCSH);
    await macrosAdminPage.ValidateThePage(Constants.KBSuggestionsinCSH);
    await macrosAdminPage.EnableSuggestionsInCSH();
  });

  ///<summary>
  /// Test Case 2045254: [Productivity Pane: Smart Assist] : Validate if KB and similar case sugestions are turned back on from CSH, it doesn't break
  ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045254
  ///<summary>
  it("Test Case 2045254: [Productivity Pane: Smart Assist] : Validate if KB and similar case sugestions are turned back on from CSH, it doesn't break", async () => {
    //Login as admin and create case & TurnOffSuggestions
    await adminStartPage.navigateToOrgUrlAndSignIn(
      TestSettings.MacrosAgentEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await macrosAdminPage.SetupSmartAssist();
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await macrosAdminPage.TurnOffSuggestions();
    await adminStartPage.waitForDomContentLoaded();

    var CaseTitleName = Constants.CaseTitleName;
    caseNameList = [CaseTitleName];
    await macrosAdminPage.createIncidents(agentChat, caseNameList);
    await adminStartPage.waitforTimeout();
    await adminStartPage.waitForDomContentLoaded();

    //Initiate session and validate
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    var CaseTitleName = Constants.CaseTitleName;
    caseNameList = [CaseTitleName];
    await macrosAdminPage.createIncidents(agentChat, caseNameList);
    await macrosAdminPage.InitiateSession(CaseTitleName, Constants.CaseLink1);
    await adminStartPage.waitForDomContentLoaded();
    await macrosAdminPage.ValidateThePage(Constants.CloseSession1);
    await macrosAdminPage.ValidateThePage(Constants.Smartassist);
    await adminStartPage.waitForDomContentLoaded();
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await macrosAdminPage.SetupSmartAssist();
    //validating simmilar suggestions and KB suggestions
    await macrosAdminPage.ValidateThePage(Constants.SimilarSuggestionsinCSH);
    await macrosAdminPage.ValidateThePage(Constants.KBSuggestionsinCSH);
    await macrosAdminPage.EnableSuggestionsInCSH();
    await macrosAdminPage.waitForTimeout();
    await adminStartPage.waitForDomContentLoaded();
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    var CaseTitleName = Constants.CaseTitleName;
    caseNameList = [CaseTitleName];
    await macrosAdminPage.createIncidents(agentChat, caseNameList);
    await macrosAdminPage.InitiateSession(CaseTitleName, Constants.CaseLink1);
    await macrosAdminPage.ValidateThePage(Constants.CloseSession1);
    await macrosAdminPage.ValidateThePage(Constants.Smartassist);
  });

  ///<summary>
  ///Test Case Test Case 2045258: [Productivity Pane: Smart Assist] : Verify focus is Returning to opened article when card is clicked again
  ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045258
  ///<summary>
  it("Test Case 2045258: [Productivity Pane: Smart Assist] : Verify focus is Returning to opened article when card is clicked again", async () => {
    // Login as Admin
    await adminStartPage.navigateToOrgUrlAndSignIn(
      TestSettings.MacrosAgentEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdmincenter);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await macrosAdminPage.SetupSmartAssist();
    await macrosAdminPage.ValidateThePage(Constants.SimilarSuggestionsinCSH);
    await macrosAdminPage.ValidateThePage(Constants.KBSuggestionsinCSH);
    await macrosAdminPage.EnableSuggestionsInCSH();
    // Navigate to CSW and validate suggestion
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    var CaseTitleName = Constants.CaseTitleName;
    caseNameList = [CaseTitleName];
    await macrosAdminPage.createIncidents(agentChat, caseNameList);
    await macrosAdminPage.InitiateSession(CaseTitleName, Constants.CaseLink1);
    await macrosAdminPage.ValidateThePage(Constants.ValKBSuggestionsinCSW);
    // Open Similar Cards and validate it
    await macrosAdminPage.OpenValidateArticle(Constants.KArticleOpen);
    await macrosAdminPage.OpenCaseSession(Constants.KArticleHome);
    await macrosAdminPage.OpenValidateArticle(Constants.KArticleOpen);
  });

  ///<summary>
  ///Test Case 2045261: [Productivity Pane: Smart Assist] : Verify Copy URL action with appropriate contextual message
  ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045261
  ///<summary>
  it("Test Case 2045261: [Productivity Pane: Smart Assist] : Verify Copy URL action with appropriate contextual message", async () => {
    // Login as Admin
    await adminStartPage.navigateToOrgUrlAndSignIn(
      TestSettings.MacrosAgentEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdmincenter);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    // Enable Suggestions in CSH
    await macrosAdminPage.SetupSmartAssist();
    await macrosAdminPage.ValidateThePage(Constants.SimilarSuggestionsinCSH);
    await macrosAdminPage.ValidateThePage(Constants.KBSuggestionsinCSH);
    await macrosAdminPage.EnableSuggestionsInCSH();
    // Navigate to CSW and validate Suggestions
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    var CaseTitleName = Constants.CaseTitleName;
    caseNameList = [CaseTitleName];
    await macrosAdminPage.createIncidents(agentChat, caseNameList);
    await macrosAdminPage.InitiateSession(CaseTitleName, Constants.CaseLink1);
    await macrosAdminPage.ValidateThePage(Constants.ValKBSuggestionsinCSW);
    // Copy URL and validate it
    await macrosAdminPage.CopyURL();
    await macrosAdminPage.ValidateThePage(Constants.ProperMsgForCopyURL);
  });

  ///<summary>
  ///Test Case 2045262: [Productivity Pane: Smart Assist] : Verify Email URL action is working
  ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045262
  ///</summary>
  it("Test Case 2045262: [Productivity Pane: Smart Assist] : Verify Email URL action is working", async () => {
    // Login as Admin
    await adminStartPage.navigateToOrgUrlAndSignIn(
      TestSettings.MacrosAgentEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdmincenter);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await macrosAdminPage.SetupSmartAssist();
    //validating simmilar suggestions and KB suggestions
    await macrosAdminPage.ValidateThePage(Constants.SimilarSuggestionsinCSH);
    await macrosAdminPage.ValidateThePage(Constants.KBSuggestionsinCSH);
    await macrosAdminPage.EnableSuggestionsInCSH();
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    var CaseTitleName = Constants.CaseTitleName;
    caseNameList = [CaseTitleName];
    await macrosAdminPage.createIncidents(agentChat, caseNameList);
    await macrosAdminPage.InitiateSession(CaseTitleName, Constants.CaseLink1);
    //validating simmilar suggestions in samrt assist
    await macrosAdminPage.ValidateThePage(Constants.ValKBSuggestionsinCSW);
    await macrosAdminPage.EmailURL();
    //validating the email body contains the URL
    await macrosAdminPage.ValidateTheEmailBody(Constants.Email);
    await macrosAdminPage.ValidateThePage(Constants.NewMail);
  });

  ///<summary>
  /// Test Case 2045263: [Productivity Pane: Smart Assist] : Verify Email content action worked
  ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045263
  ///<summary>
  it("Test Case 2045263: [Productivity Pane: Smart Assist] : Verify Email content action worked", async () => {
    // Login as Admin
    await adminStartPage.navigateToOrgUrlAndSignIn(
      TestSettings.MacrosAgentEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdmincenter);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    // Enable Suggestions in CSH
    await macrosAdminPage.SetupSmartAssist();
    await macrosAdminPage.ValidateThePage(Constants.SimilarSuggestionsinCSH);
    await macrosAdminPage.ValidateThePage(Constants.KBSuggestionsinCSH);
    await macrosAdminPage.EnableSuggestionsInCSH();
    // Navigate to CSW and validate Suggestions
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    var CaseTitleName = Constants.CaseTitleName;
    caseNameList = [CaseTitleName];
    await macrosAdminPage.createIncidents(agentChat, caseNameList);
    await macrosAdminPage.InitiateSession(CaseTitleName, Constants.CaseLink1);
    await macrosAdminPage.ValidateThePage(Constants.ValKBSuggestionsinCSW);
    await macrosAdminPage.EmailContent();
    await macrosAdminPage.ValidateTheEmailBody(Constants.Email);
    await macrosAdminPage.ValidateThePage(Constants.NewMail);
  });

  ///<summary>
  ///Test Case 2045253: [Productivity Pane: Smart Assist] : Validate if KB and similar case sugestions are turned off from CSH, message is shown on smart assist
  ///Test Case Link: https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045253
  ///</summary>
  it("Test Case 2045253: [Productivity Pane: Smart Assist] : Validate if KB and similar case sugestions are turned off from CSH, message is shown on smart assist", async () => {
    //Login as admin and create case
    await adminStartPage.navigateToOrgUrlAndSignIn(
      TestSettings.MacrosAgentEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await macrosAdminPage.SetupSmartAssist();
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await macrosAdminPage.TurnOffSuggestions();
    //Initiate Session and Validate
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage); 
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    var CaseTitleName = Constants.CaseTitleName;
    caseNameList = [CaseTitleName];
    await macrosAdminPage.createIncidents(agentChat, caseNameList);
    await macrosAdminPage.waitForTimeout();
    await macrosAdminPage.InitiateSession(CaseTitleName, Constants.CaseLink1);
    await macrosAdminPage.waitForTimeout();
    await adminStartPage.waitForDomContentLoaded(); 
    await macrosAdminPage.ValidateSessionPage(Constants.CaseSuggestion);
    await macrosAdminPage.ValidateSessionPage(Constants.KbSuggestion);
  });

  ///<summary>
  ///Test Case 2045252: [Productivity Pane: Smart Assist] : Verify if smart assist is available with default configuration
  ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045252
  ///<summary>
  it("Test Case 2045252: [Productivity Pane: Smart Assist] : Verify if smart assist is available with default configuration", async () => {
    //Login as admin and create case
    await adminStartPage.navigateToOrgUrlAndSignIn(
      TestSettings.MacrosAgentEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    var CaseTitleName = Constants.CaseTitleName;
    caseNameList = [CaseTitleName];
    await macrosAdminPage.createIncidents(agentChat, caseNameList);
    await macrosAdminPage.InitiateSession(CaseTitleName, Constants.CaseLink1);
    await macrosAdminPage.ValidateThePage(Constants.CloseSession1);
    await macrosAdminPage.ValidateThePage(Constants.Smartassist);
  });

  ///<summary>
  ///Test Case 2045297: [Productivity Pane: Knowledge Search] : Validate all available actions from knowledge search control (search, link, etc.)
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045297
  ///</summary>
  it("Test Case 2045297: [Productivity Pane: Knowledge Search] : Validate all available actions from knowledge search control (search, link, etc.)", async () => {
    //Login as admin and create case
    await adminStartPage.navigateToOrgUrlAndSignIn(
      TestSettings.MacrosAgentEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    var CaseTitleName = Constants.CaseTitleName;
    caseNameList = [CaseTitleName];
    await macrosAdminPage.createIncidents(agentChat, caseNameList);
    await macrosAdminPage.InitiateSession(CaseTitleName, Constants.CaseLink1);
    //Open Knowledge search tool and validate given conditions
    await macrosAdminPage.ValidateThePage(Constants.KStool);
    await macrosAdminPage.OpenFunction(Constants.KStool);
    await macrosAdminPage.ValidateThePage(Constants.ValidateKSResults);
    await macrosAdminPage.ValidateThePage(Constants.SearchKSArticle);
    await macrosAdminPage.ValidateThePage(Constants.KSLinkBtn);
  });

  ///<summary>
  ///Test Case 2045280: [Productivity Pane: Smart Assist] : Verify Copy resolution action with appropriate contextual message
  ///Test Case Link: https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045280
  ///</summary>
  it("Test Case 2045280: [Productivity Pane: Smart Assist] : Verify Copy resolution action with appropriate contextual message", async () => {
    // Login as Admin
    await adminStartPage.navigateToOrgUrlAndSignIn(
      TestSettings.MacrosAgentEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdmincenter);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    // Enable Suggestions in CSH
    await macrosAdminPage.SetupSmartAssist();
    await macrosAdminPage.ValidateThePage(Constants.SimilarSuggestionsinCSH);
    await macrosAdminPage.ValidateThePage(Constants.KBSuggestionsinCSH);
    await macrosAdminPage.EnableSuggestionsInCSH();
    // Navigate to CSW and validate Suggestions
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await macrosAdminPage.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    var CaseTitleName = Constants.CaseTitleName;
    caseNameList = [CaseTitleName];
    await macrosAdminPage.createIncidents(agentChat, caseNameList);
    await macrosAdminPage.InitiateSession(CaseTitleName, Constants.CaseLink1);
    await macrosAdminPage.ValidateThePage(Constants.ValKBSuggestionsinCSW);
    // Copy URL and validate it
    await macrosAdminPage.VerifyCopyResolution();
    await macrosAdminPage.ValidateThePage(Constants.MessageForCopyResolution);
    await macrosAdminPage.deleteCaseInCSH(
      adminPage,
      adminStartPage,
      Constants.CaseTitleName
    );
  });

  ///<summary>
  ///Test Case 2045302: [Productivity Pane: Agent Guidance] : Validate knowledge search control in both case session and conversation session (actions are slightly different)
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045302
  ///</summary>
  it("Test Case 2045302: [Productivity Pane: Agent Guidance] : Validate knowledge search control in both case session and conversation session (actions are slightly different)", async () => {
    agentPage = await agentContext.newPage();
    const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
    liveChatPage = new LiveChatPage(await liveChatContext.newPage());
    const agentChat = new AgentChat(agentPage);
    //Login as admin and create case
    await adminStartPage.navigateToOrgUrlAndSignIn(
      TestSettings.AdminAccountEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
    await adminStartPage.waitForDomContentLoaded();
    await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
    await agentChat.waitForAgentStatusIcon();
    var CaseTitleName = Constants.CaseTitleName;
    caseNameList = [CaseTitleName];
    await macrosAdminPage.createIncidents(agentChat, caseNameList);
    await macrosAdminPage.InitiateSession(CaseTitleName, Constants.CaseLink1);
    await macrosAdminPage.ClickProductivityPaneTool(Constants.KStool);
    await macrosAdminPage.ValidateThePage(Constants.KStool);
    await macrosAdminPage.ValidateThePage(Constants.KSLinkBtn);
    await macrosAdminPage.MoreActions();
    await macrosAdminPage.ValidateThePage(Constants.CopyURL);
    await macrosAdminPage.ValidateThePage(Constants.EmailURL);
    await macrosAdminPage.ValidateThePage(Constants.EmailContent);

    //Login as agent and accept chat
    await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(
      TestSettings.AdminAccountEmail,
      agentStartPage,
      agentChat
    );
    await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);
    await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);

    //validate kb search
    const KbSearch = await macrosAdminPage.OpenKbSearchAndValidate(agentPage);
    expect(KbSearch).toBeTruthy();

    //Closing Chat

    await agentChat.closeUnusedChat();
    await liveChatPage.closeChat();
  });
});
