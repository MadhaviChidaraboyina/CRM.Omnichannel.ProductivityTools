import { AgentChat } from "../../../pages/AgentChat";
import { BrowserContext, Page } from "playwright";
import {
  Constants,
  EntityAttributes,
  EntityNames,
} from "../../common/constants";
import { LiveChatPage } from "../../../pages/LiveChat";
import { Macros } from "../../macropages/macrosAdmin";
import { OrgDynamicsCrmStartPage } from "../../../pages/org-dynamics-crm-start.page";
import { TestHelper } from "../../../helpers/test-helper";
import { TestSettings } from "../../../configuration/test-settings";
import { AgentScript } from "../../agentScript/pages/agentScriptAdmin";
import { MacrosPage } from "../../../pages/Macros";

describe("Live Chat - ", () => {
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

  // ///<summary>  alreay exist in another folder
  // ///Test Case 2253513: [Macros] Verify dashboard application template is opened in new tab using 'Open application tab' action in macros
  // /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_testPlans/execute?planId=2532163&opId=3593&suiteId=2532167
  // ///</summary>
  // it("Test Case 2253513: [Macros] Verify dashboard application template is opened in new tab using 'Open application tab' action in macros", async () => {
  //     agentPage = await agentContext.newPage();
  //     liveChatPage = new LiveChatPage(await liveChatContext.newPage());
  //     try {
  //         //Login as 'Admin automated' and redirected to OrgUrl
  //         await adminStartPage.navigateToOrgUrlAndSignIn(
  //             TestSettings.LiveChatPTEAccountEmail,
  //             TestSettings.AdminAccountPassword
  //         );
  //         await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
  //         const urlId = await macrosAdminPage.createApplicationTabAndGetId(
  //             Constants.DashboardName,
  //             Constants.DashboardUniqueName,
  //             Constants.DashboardOptionValue
  //         );
  //         await macrosAdminPage.createMacroFromOmnichannelAdminCenterApp(
  //             Constants.DashboardMacro,
  //             urlId
  //         );
  //         await macrosAdminPage.createAgentScript(
  //             Constants.DascboardAgentScriptName,
  //             Constants.TitleUniqueName,
  //             Constants.DashboardMacro
  //         );
  //         await macrosAdminPage.waitForTimeout();
  //         await macrosAdminPage.addAgentScripttoDefaultChatSession();
  //         //Run Macro
  //         await macrosAdminPage.waitForTimeout();
  //         await macrosAdminPage.openAppLandingPage(adminPage);
  //         await adminStartPage.goToMyApp(Constants.CustomerServiceWorkspace);
  //         await macrosAdminPage.waitForTimeout();
  //         await macrosAdminPage.skipCSWBug();
  //         await macrosAdminPage.CreateCaseInCSW(Constants.CaseTitleName);
  //         await macrosAdminPage.InitiateSession(
  //             Constants.CaseTitleName,
  //             Constants.CaseLink1
  //         );
  //         const openEntityRecordTabUsingMacro =
  //             await macrosAdminPage.runMacroInSessionAndValidate(
  //                 Constants.DashboardAgentScriptName,
  //                 Constants.DashboardTitle
  //               );
  //         expect(openEntityRecordTabUsingMacro).toBeTruthy();

  //     } finally {
  //         await macrosAdminPage.deleteAgentScriptnNew(adminPage, adminStartPage, Constants.DascboardAgentScriptName);
  //         await macrosAdminPage.deleteApplicationTabusingOmnichannelAdminCenter(
  //             Constants.DashboardName
  //         );
  //         await macrosAdminPage.deleteMacroFromOmnichannelAdminCenterApp(
  //             Constants.DashboardMacro
  //         );
  //         //await macrosAdminPage.removeAgentScripttoDefaultCaseSession();
  //     }
  // });

  ///<summary>
  ///Test Case 1805118: [Macros] Verify entity view application template is opened in new tab using 'Open application tab' action in macros
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_testPlans/execute?planId=2532163&opId=3593&suiteId=2532167
  ///</summary>
  it("Test Case 1805118: [Macros] Verify entity view application template is opened in new tab using 'Open application tab' action in macros", async () => {
    agentPage = await agentContext.newPage();
    const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
    liveChatPage = new LiveChatPage(await liveChatContext.newPage());
    const agentChat = new AgentChat(agentPage);
    try {
      //Login as admin and create macro
      await adminStartPage.navigateToOrgUrlAndSignIn(
        TestSettings.LiveChatPTEAccountEmail,
        TestSettings.AdminAccountPassword
      );
      await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
      const applicationTabId =
        await macrosAdminPage.createApplicationTabAndGetId(
          Constants.EntityListApplicationTab,
          Constants.EntityListApplicationTabUniqueName,
          Constants.EntityListOptionValue
        );
      await macrosAdminPage.createMacro(
        Constants.OpenEntityList,
        applicationTabId
      );

      //Login as agent and accept chat
      await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(
        TestSettings.LiveChatPTEAccountEmail,
        agentStartPage,
        agentChat
      );
      await agentChat.waitForAgentStatusIcon();
      await agentChat.waitForAgentStatus();
      await agentChat.setAgentStatusToAvailable();

      //Initiate live chat with agent
      await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);
      await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);

      //Check API response through console
      const result = await agentPage.evaluate(async () => {
        const ctrl = await (
          window as any
        ).Microsoft.ProductivityMacros.runMacro("OpenEntityList");
        return ctrl;
      });
      expect(result).toBe(Constants.ActionPerformedSuccessfully);

      //Check API result on UI
      const openEntityListResult = await macrosAdminPage.verifyOpenedTab(
        agentPage,
        Constants.EntityListTab
      );
      expect(openEntityListResult).toBeTruthy();

      //End live chat

      await agentChat.closeUnusedChat();
      await liveChatPage.closeChat();
    } finally {
      await macrosAdminPage.deleteMacro(
        adminStartPage,
        Constants.OpenEntityList
      );
      await macrosAdminPage.deleteApplicationTab(
        adminStartPage,
        Constants.EntityListApplicationTab
      );
    }
  });

  ///<summary>
  ///Test Case 1802338: Verify an error pop up is showing if wrong data provides in expression builder
  ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_testPlans/execute?planId=2338666&suiteId=2347473
  ///</summary>
  // it("Test Case 1802338: Verify an error pop up is showing if wrong data provides in expression builder", async () => {
  //     let page = await agentContext.newPage();
  //     const macrosPage = new MacrosPage(page);
  //     const agentScriptAdminPage = new AgentScript(page);
  //     try {
  //         await macrosPage.navigateToOrgUrl();
  //         await agentScriptAdminPage.createSessionTemplate();
  //         await agentScriptAdminPage.createAgentScript(Constants.AgentScriptName, Constants.AgentScriptUniqueName);
  //         await agentScriptAdminPage.createAgentScript(Constants.AgentscriptName2, Constants.AgentScriptUniqueName2);
  //         await agentScriptAdminPage.addTwoAgentScriptToSesssionTemplate(Constants.AgentScriptName, Constants.AgentscriptName2);
  //         await agentScriptAdminPage.sessionBuilder();
  //         await macrosPage.prerequisiteForExpressionBuilder();
  //         await agentScriptAdminPage.addOdataConditionForExpressionBuilder();
  //     }
  //     finally {
  //         await agentScriptAdminPage.deleteSessionTemplate();
  //         await agentScriptAdminPage.deleteAgentScript(Constants.AgentScript);
  //         await agentScriptAdminPage.deleteAgentScript(Constants.AgentScript2);
  //         await macrosPage?.closePage();
  //     }
  // });

  ///<summary>
  ///Test Case 2367015: [Macros] Verify cloning of current record by using 'Clone current record' action in the Productivity Automation.
  ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2367015
  ///<summary>
  // it("Test Case 2367015: [Macros] Verify cloning of current record by using 'Clone current record' action in the Productivity Automation.", async () => {
  //   agentPage = await agentContext.newPage();
  //   const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
  //   liveChatPage = new LiveChatPage(await liveChatContext.newPage());
  //   const agentChat = new AgentChat(agentPage);
  //   try {
  //     // Login As Admin and create macro
  //     await adminStartPage.navigateToOrgUrlAndSignIn(
  //       TestSettings.LiveChatPTEAccountEmail,
  //       TestSettings.AdminAccountPassword
  //     );
  //     await adminStartPage.goToMyApp(Constants.OmnichannelAdminCenterApp);
  //     await macrosAdminPage.CreateCloneCurrentMacro(
  //       Constants.CloneCurrentMacro,
  //       Constants.RecordName
  //     );
  //     macrosAdminPage.AddAgentScriptToSession(Constants.AgentScriptName);

  //     //Login as agent and accept chat
  //     await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(
  //       TestSettings.LiveChatPTEAccountEmail,
  //       agentStartPage,
  //       agentChat
  //     );
  //     // Initiate live chat with agent
  //     await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);
  //     await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);

  //     const result = await agentPage.evaluate(async () => {
  //       const ctrl = await (
  //         window as any
  //       ).Microsoft.ProductivityMacros.runMacro("CloneCurrentMacro");
  //       return ctrl;
  //     });
  //     expect(result).toBe(Constants.ActionPerformedSuccessfully);

  //     //Check API result on UI
  //     const relevenceSearchResult = await macrosAdminPage.verifyOpenedTab(
  //       agentPage,
  //       Constants.NewConversation
  //     );
  //     expect(relevenceSearchResult).toBeTruthy();

  //     //End live chat

  //     await agentChat.closeUnusedChat();
  //     await liveChatPage.closeChat();
  //   } finally {
  //     await macrosAdminPage.deleteMacro(
  //       adminStartPage,
  //       Constants.CloneCurrentMacro
  //     );
  //   }
  // });

  ///<summary>
  ///Test Case 1790571: Verify session connectors are working in expression builder
  ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1790571
  ///</summary>
  // it("Test Case 1790571: Verify session connectors are working in expression builder", async () => {
  //     agentPage = await agentContext.newPage();
  //     const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
  //     liveChatPage = new LiveChatPage(await liveChatContext.newPage());
  //     const agentScriptAdminPage = new AgentScript(page);
  //     const agentChat = new AgentChat(agentPage);
  //     const macrosPage = new MacrosPage(page);
  //     try {
  //         await adminStartPage.navigateToOrgUrlAndSignIn(TestSettings.LiveChatPTEAccountEmail, TestSettings.AdminAccountPassword);
  //         await adminStartPage.goToMyApp(Constants.OmnichannelAdminCenterApp);
  //         await macrosAdminPage.CreateSessionTemplate(Constants.SessionTemplateinPowerApps);
  //         //await macrosAdminPage.createAgentScriptWithoutMacro(Constants.AgentScriptName, Constants.AgentScriptUniqueName);
  //         //await macrosAdminPage.createAgentScriptWithoutMacro(Constants.AgentscriptName2, Constants.AgentScriptUniqueName2);
  //         await macrosAdminPage.InitiateSessionTemplate(Constants.SessionTemplateName, Constants.SessionLink);
  //         //await macrosAdminPage.addTwoAgentScriptToSesssionTemplate(Constants.AgentScriptName, Constants.AgentscriptName2);
  //         await macrosPage.prerequisiteForExpressionBuilder();
  //         await adminStartPage.addSlugOrSessionConditionForExpressionBuilder(Constants.SessionName, Constants.CustomerName);
  //         await macrosAdminPage.associateSessionTemplateToaWorkStream();

  //         await macrosAdminPage.addAgentScripttoDefaultChatSession();

  //         //Login as agent and accept chat
  //         await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(TestSettings.LiveChatPTEAccountEmail, agentStartPage, agentChat);
  //         await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);
  //         await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);

  //         //Validating Agent script for Expression Builder
  //         await agentScriptAdminPage.validateAgentScriptsForExpressionBuilder(Constants.AgentScriptName);

  //         //Closing Chat

  //         await agentChat.closeUnusedChat();
  //         await liveChatPage.closeChat();
  //     }
  //     finally {
  //         await macrosAdminPage.deleteSessionTemplate(adminPage, adminStartPage, Constants.SessionTemplateName);
  //         //await macrosAdminPage.deleteAgentScript(Constants.AgentScriptName);
  //     }
  // });

  

  ///<summary>
  ///Test Case 2253523: [Macros] Verify entity search application template  is opened in new tab using 'Open application tab' action in macros
  /// Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_testPlans/execute?planId=2532163&opId=3593&suiteId=2532167
  ///</summary>
  // it("Test Case 2253523: [Macros] Verify entity view application template is opened in new tab using 'Open application tab' action in macros", async () => {
  //   agentPage = await agentContext.newPage();
  //   const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
  //   liveChatPage = new LiveChatPage(await liveChatContext.newPage());
  //   const agentChat = new AgentChat(agentPage);
  //   try {
  //     //Login as admin and create macro
  //     await adminStartPage.navigateToOrgUrlAndSignIn(
  //       TestSettings.LiveChatPTEAccountEmail,
  //       TestSettings.AdminAccountPassword
  //     );
  //     await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
  //     const applicationTabId =
  //       await macrosAdminPage.createApplicationTabAndGetId(
  //         Constants.EntitySearchApplicationTab,
  //         Constants.EntitySearchApplicationTabUniqueName,
  //         Constants.EntitySearchOptionValue
  //       );
  //     await macrosAdminPage.InsertParametersInSearchApplicationTab(
  //       adminStartPage,
  //       Constants.EntitySearchApplicationTab
  //     );
  //     await macrosAdminPage.createMacro(
  //       Constants.EntitySearch,
  //       applicationTabId
  //     );
  //     //Login as agent and accept chat
  //     await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(
  //       TestSettings.LiveChatPTEAccountEmail,
  //       agentStartPage,
  //       agentChat
  //     );

  //     await agentChat.waitForAgentStatusIcon();
  //     await agentChat.waitForAgentStatus();
  //     await agentChat.setAgentStatusToAvailable();

  //     //Initiate live chat with agent
  //     await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);

  //     await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);

  //     //Check API response through console
  //     const result = await agentPage.evaluate(async () => {
  //       const ctrl = await (
  //         window as any
  //       ).Microsoft.ProductivityMacros.runMacro("EntitySearch");
  //       return ctrl;
  //     });
  //     expect(result).toBe(Constants.ActionPerformedSuccessfully);

  //     //Check API result on UI
  //     const openEntityListResult = await macrosAdminPage.verifyOpenedTab(
  //       agentPage,
  //       Constants.EntitySearchTab
  //     );
  //     expect(openEntityListResult).toBeTruthy();

  //     //End live chat
  //     await macrosAdminPage.closeConversation(agentPage, agentChat);
  //     await liveChatPage.closeChat();
  //   } finally {
  //     await macrosAdminPage.deleteMacro(adminStartPage, Constants.EntitySearch);
  //     await macrosAdminPage.deleteApplicationTab(
  //       adminStartPage,
  //       Constants.EntitySearchApplicationTab
  //     );
  //   }
  // });

  ///<summary>
  ///Test Case 2313873: [Macros] Verify that tab is focused using 'Focus on the tab' action in the macros.
  ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2313873
  ///</summary>
//   it("Test Case 2313873: [Macros] Verify that tab is focused using 'Focus on the tab' action in the macros.", async () => {
//     agentPage = await agentContext.newPage();
//     const agentStartPage = new OrgDynamicsCrmStartPage(agentPage);
//     liveChatPage = new LiveChatPage(await liveChatContext.newPage());
//     const agentChat = new AgentChat(agentPage);
//     try {
//       //Login as admin and create macro
//       await adminStartPage.navigateToOrgUrlAndSignIn(
//         TestSettings.LiveChatPTEAccountEmail,
//         TestSettings.AdminAccountPassword
//       );
//       await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
//       await macrosAdminPage.createMacro(Constants.OpenFocustab);

//       //Login as agent and accept chat
//       await macrosAdminPage.loginAsAgentAndOpenOmnichannelForCS(
//         TestSettings.LiveChatPTEAccountEmail,
//         agentStartPage,
//         agentChat
//       );

//       await agentChat.waitForAgentStatusIcon();
//       await agentChat.waitForAgentStatus();
//       await agentChat.setAgentStatusToAvailable();

//       //Initiate live chat with agent
//       await macrosAdminPage.initiateLiveChatWithAgent(liveChatPage);

//       await macrosAdminPage.acceptLiveChatAsAgent(liveChatPage, agentChat);

//       //Check API response through console
//       const result = await agentPage.evaluate(async () => {
//         const ctrl = await (
//           window as any
//         ).Microsoft.ProductivityMacros.runMacro("FocustabMacro");
//         return ctrl;
//       });
//       expect(result).toBe(Constants.ActionPerformedSuccessfully);

//       //End live chat
//       await macrosAdminPage.closeConversation(agentPage, agentChat);
//       await liveChatPage.closeChat();
//     } finally {
//       await macrosAdminPage.deleteMacro(adminStartPage, Constants.OpenFocustab);
//     }
//   });
});
