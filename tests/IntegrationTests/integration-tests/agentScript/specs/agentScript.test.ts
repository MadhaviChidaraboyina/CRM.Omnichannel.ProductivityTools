import { AdminPage } from "../../../pages/AdminPage";
import { AgentChat } from "../../../pages/AgentChat";
import { AgentScript } from "../pages/agentScriptAdmin";
import { BrowserContext } from "playwright";
import { Constants } from "../../common/constants";
import { LiveChatPage } from "../../../pages/LiveChat";
import { MacrosPage } from "../../../pages/Macros";
import { OrgDynamicsCrmStartPage } from "../../../pages/org-dynamics-crm-start.page";
import { TestHelper } from "../../../helpers/test-helper";
import { TestSettings } from "../../../configuration/test-settings";

describe("Agent Scripts- ", () => {
  let adminPage: AdminPage;
  let agentContext: BrowserContext;
  let liveChatPage: LiveChatPage;
  let liveChatContext:BrowserContext;

  beforeEach(async () => {
    agentContext = await browser.newContext({
      viewport: TestSettings.Viewport,
    });
    liveChatContext = await browser.newContext({
      viewport: TestSettings.Viewport, acceptDownloads: true,
    }); 
    adminPage = new AdminPage(await agentContext.newPage());
    await adminPage.loginAndNavigateToAdminApp();
    });
  afterEach(async () => {
    await TestHelper.dispose(agentContext);
  });

  ///<summary>
  ///Test Case 1593399: Verify Admin is able to associate agent scripts to session template
  ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_testPlans/execute?planId=2478602&opId=3561&suiteId=2478606
  ///</summary>
  it("Test Case 1593399: Verify Admin is able to associate agent scripts to session template", async () => {
    let page = await agentContext.newPage();
    const macrosPage = new MacrosPage(page);
    const agentScriptAdminPage = new AgentScript(page);
    try {
      await macrosPage.navigateToOrgUrl();
      await agentScriptAdminPage.createSessionTemplate();
      await agentScriptAdminPage.createAgentScript(Constants.AgentScriptName, Constants.AgentScriptUniqueName);
      await agentScriptAdminPage.addAgentScriptToSesssionTemplate();
    }
    finally {
      await agentScriptAdminPage.deleteSessionTemplate();
      await agentScriptAdminPage.deleteAgentScript(Constants.AgentScript);
      await macrosPage?.closePage();
    }
  });

  ///<summary>
  ///Test Case 1802338: Verify an error pop up is showing if wrong data provides in expression builder
  ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_testPlans/execute?planId=2338666&suiteId=2347473
  ///</summary>
  it("Test Case 1802338: Verify an error pop up is showing if wrong data provides in expression builder", async () => {
    let page = await agentContext.newPage();
    const macrosPage = new MacrosPage(page);
    const agentScriptAdminPage = new AgentScript(page);
    try {
      await macrosPage.navigateToOrgUrl();
      await agentScriptAdminPage.createSessionTemplate();
      await agentScriptAdminPage.createAgentScript(Constants.AgentScriptName, Constants.AgentScriptUniqueName);
      await agentScriptAdminPage.createAgentScript(Constants.AgentscriptName2, Constants.AgentScriptUniqueName2);
      await agentScriptAdminPage.addTwoAgentScriptToSesssionTemplate(Constants.AgentScriptName, Constants.AgentscriptName2);
      await agentScriptAdminPage.sessionBuilder();
      await macrosPage.prerequisiteForExpressionBuilder();
      await agentScriptAdminPage.addOdataConditionForExpressionBuilder();
    }
    finally {
      await agentScriptAdminPage.deleteSessionTemplate();
      await agentScriptAdminPage.deleteAgentScript(Constants.AgentScript);
      await agentScriptAdminPage.deleteAgentScript(Constants.AgentScript2);
      await macrosPage?.closePage();
    }
  });

  ///<summary>
  ///Test Case 1790578: Verify Static values are working in expression builder with true condition
  ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_testPlans/define?planId=2368886&suiteId=2368890
  ///</summary>
  it("Static Values are Working in Expression Builder with True Condition", async () => {
    let page = await agentContext.newPage();
    let agentPage = new AgentChat(page);
    const macrosPage = new MacrosPage(page);
    const agentScriptAdminPage = new AgentScript(page); 
    let agentStartPage = new OrgDynamicsCrmStartPage(page);
    
    try {
      await macrosPage.navigateToOrgUrl();
      await agentScriptAdminPage.createGenericSessionTemplate(adminPage);
      await agentScriptAdminPage.createAgentScript(Constants.AgentScriptName ,Constants.AgentScriptUniqueName);
      await agentScriptAdminPage.createAgentScript(Constants.AgentscriptName2,Constants.AgentScriptUniqueName2);
      await agentScriptAdminPage.addTwoAgentScriptToSesssionTemplate(Constants.AgentScriptName,Constants.AgentscriptName2);
      await macrosPage.prerequisiteForExpressionBuilder();
      await agentScriptAdminPage.addStaticValueConditionForExpressionBuilder(Constants.StaticValueTrueCondition,Constants.StaticValueTrueCondition);
      await agentScriptAdminPage.associateSessionTemplateToaWorkStream();
      await agentScriptAdminPage.goToApps();
      await agentStartPage.goToOmnichannelForCustomers();
    
      liveChatPage = new LiveChatPage(await liveChatContext.newPage());
      await liveChatPage.open(TestSettings.LCWUrl);
      await liveChatPage.initiateChat();
      await liveChatPage.sendMessage("Hi", "en");
      await liveChatPage.getUniqueChat(liveChatPage, agentPage);
      await agentScriptAdminPage.validateAgentScriptsForExpressionBuilder(Constants.AgentScriptName);
      await liveChatPage.closeChat();
    }
    finally {
      await macrosPage?.closePage();
    }
  });

  ///<summary>
  ///Test Case 1794804: Verify Static values are working in expression builder with false condition
  ///https://dynamicscrm.visualstudio.com/OneCRM/_testPlans/define?planId=2368886&suiteId=2368890
  ///</summary>
  it("Static Values are Working in Expression Builder with False Condition", async () => {
    let page = await agentContext.newPage();
    let agentPage = new AgentChat(page);
    const macrosPage = new MacrosPage(page);
    const agentScriptAdminPage = new AgentScript(page); 
    let agentStartPage = new OrgDynamicsCrmStartPage(page);
    
    try {
      await macrosPage.navigateToOrgUrl();
      await agentScriptAdminPage.createGenericSessionTemplate(adminPage);
      await agentScriptAdminPage.createAgentScript(Constants.AgentScriptName ,Constants.AgentScriptUniqueName);
      await agentScriptAdminPage.createAgentScript(Constants.AgentscriptName2,Constants.AgentScriptUniqueName2);
      await agentScriptAdminPage.addTwoAgentScriptToSesssionTemplate(Constants.AgentScriptName,Constants.AgentscriptName2);
      await macrosPage.prerequisiteForExpressionBuilder();
      await agentScriptAdminPage.addStaticValueConditionForExpressionBuilder(Constants.StaticValueTrueCondition,Constants.StaticValueFalseCondition);
      await agentScriptAdminPage.associateSessionTemplateToaWorkStream();
      await agentScriptAdminPage.goToApps();
      await agentStartPage.goToOmnichannelForCustomers();
    
      liveChatPage = new LiveChatPage(await liveChatContext.newPage());
      await liveChatPage.open(TestSettings.LCWUrl);
      await liveChatPage.initiateChat();
      await liveChatPage.sendMessage("Hi", "en");
      await liveChatPage.getUniqueChat(liveChatPage, agentPage);
      await agentScriptAdminPage.validateAgentScriptsForExpressionBuilder(Constants.AgentscriptName2);
      await liveChatPage.closeChat();
    }
    finally {
      await macrosPage?.closePage();
    }
  });

  ///<summary>
  ///Test Case 1790567: Verify slugs are working in expression builder with equal to condition
  ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1790567
  ///</summary>
  it("Test Case 1790567: Verify slugs are working in expression builder with equal to condition", async () => {
    let page = await agentContext.newPage();
    const macrosPage = new MacrosPage(page);
    let agentPage = new AgentChat(page);
    const agentScriptAdminPage = new AgentScript(page);
    let agentStartPage = new OrgDynamicsCrmStartPage(page);
    try {
      await macrosPage.navigateToOrgUrl();
      await agentScriptAdminPage.createGenericSessionTemplate(adminPage);
      await agentScriptAdminPage.createAgentScript(Constants.AgentScriptName, Constants.AgentScriptUniqueName);
      await agentScriptAdminPage.createAgentScript(Constants.AgentscriptName2, Constants.AgentScriptUniqueName2);
      await agentScriptAdminPage.addTwoAgentScriptToSesssionTemplate(Constants.AgentScriptName, Constants.AgentscriptName2);
      await agentScriptAdminPage.sessionBuilder();
      await macrosPage.prerequisiteForExpressionBuilder();
      await agentScriptAdminPage.addSlugOrSessionConditionForExpressionBuilder(Constants.SlugName,Constants.CustomerName);
      await agentScriptAdminPage.associateSessionTemplateToaWorkStream();
      await agentScriptAdminPage.goToApps();
      await agentStartPage.goToOmnichannelForCustomers();
    
      liveChatPage = new LiveChatPage(await liveChatContext.newPage());
      await liveChatPage.open(TestSettings.LCWUrl);
      await liveChatPage.initiateChat();
      await liveChatPage.sendMessage("Hi", "en");
      await liveChatPage.getUniqueChat(liveChatPage, agentPage);
      await agentScriptAdminPage.validateAgentScriptsForExpressionBuilder(Constants.AgentScriptName);
      await liveChatPage.closeChat();
    }
    finally {
      await macrosPage?.closePage();
    }
  });

  ///<summary>
  ///Test Case 1790571: Verify session connectors are working in expression builder
  ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/1790571
  ///</summary>
  it("Test Case 1790571: Verify session connectors are working in expression builder", async () => {
    let page = await agentContext.newPage();
    const macrosPage = new MacrosPage(page);
    let agentPage = new AgentChat(page);
    const agentScriptAdminPage = new AgentScript(page);
    let agentStartPage = new OrgDynamicsCrmStartPage(page);
    try {
      await macrosPage.navigateToOrgUrl();
      await agentScriptAdminPage.createGenericSessionTemplate(adminPage);
      await agentScriptAdminPage.createAgentScript(Constants.AgentScriptName, Constants.AgentScriptUniqueName);
      await agentScriptAdminPage.createAgentScript(Constants.AgentscriptName2, Constants.AgentScriptUniqueName2);
      await agentScriptAdminPage.addTwoAgentScriptToSesssionTemplate(Constants.AgentScriptName, Constants.AgentscriptName2);
      await agentScriptAdminPage.sessionBuilder();
      await macrosPage.prerequisiteForExpressionBuilder();
      await agentScriptAdminPage.addSlugOrSessionConditionForExpressionBuilder(Constants.SessionName,Constants.CustomerName);
      await agentScriptAdminPage.associateSessionTemplateToaWorkStream();
      await agentScriptAdminPage.goToApps();
      await agentStartPage.goToOmnichannelForCustomers();
    
      liveChatPage = new LiveChatPage(await liveChatContext.newPage());
      await liveChatPage.open(TestSettings.LCWUrl);
      await liveChatPage.initiateChat();
      await liveChatPage.sendMessage("Hi", "en");
      await liveChatPage.getUniqueChat(liveChatPage, agentPage);
      await agentScriptAdminPage.validateAgentScriptsForExpressionBuilder(Constants.AgentScriptName);
      await liveChatPage.closeChat();
    }
    finally {
      await macrosPage?.closePage();
    }
  });

  ///<summary>
  ///Test Case 1717166: Verify Admin can use the slugs in agent assist step titles
  ///https://dynamicscrm.visualstudio.com/OneCRM/_testPlans/define?planId=2368886&suiteId=2368890
  ///</summary>
  it("Admin can use the slugs in agent assist step titles", async () => {
    let page = await agentContext.newPage();
    let constant = new Constants();
    let agentPage = new AgentChat(page);
    const macrosPage = new MacrosPage(page);
    const agentScriptAdminPage = new AgentScript(page); 
    let agentStartPage = new OrgDynamicsCrmStartPage(page);
    try {
      await macrosPage.navigateToOrgUrl();
      await agentScriptAdminPage.createAgentScript(Constants.AgentScriptName ,Constants.AgentScriptUniqueName);
      await agentScriptAdminPage.addAgentScriptTitle(Constants.SelectOptionText);
      await agentScriptAdminPage.addAgentScripttoDefaultChatSession();
      await agentScriptAdminPage.goToApps();
      await agentStartPage.goToOmnichannelForCustomers();

      liveChatPage = new LiveChatPage(await liveChatContext.newPage());
      await liveChatPage.open(TestSettings.LCWUrl);
      await liveChatPage.initiateChat();
      await liveChatPage.sendMessage("Hi", "en");
      await liveChatPage.getUniqueChat(liveChatPage, agentPage);
      const slugvalidateResult=await agentScriptAdminPage.validateSlugName();
      expect(slugvalidateResult).toBeTruthy();
      await liveChatPage.closeChat();
    }
    finally {
      await agentScriptAdminPage.goToApps();
      await agentStartPage.goToOmnichannelAdministration();
      await agentScriptAdminPage.deleteAgentScripthavingSteps(Constants.AgentScript);
      await macrosPage?.closePage();
    }
  });
});