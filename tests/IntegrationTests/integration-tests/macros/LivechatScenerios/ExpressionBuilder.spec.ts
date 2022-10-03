import { AgentChat } from "../../../pages/AgentChat";
import { BrowserContext, Page } from "playwright";
import { Constants } from "../../common/constants";
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

    beforeEach(async () => {
        adminContext = await browser.newContext({
            viewport: TestSettings.Viewport,
        });
        liveChatContext = await browser.newContext({
            viewport: TestSettings.Viewport, acceptDownloads: true, extraHTTPHeaders: {
                origin: "",
            },
        });
        agentContext = await browser.newContext({
            viewport: TestSettings.Viewport, acceptDownloads: true, extraHTTPHeaders: {
                origin: "",
            },
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
            await agentScriptAdminPage.navigateToOrgUrlAndSignIn(TestSettings.LiveChatPTEAccountEmail, TestSettings.AdminAccountPassword);
            await agentScriptAdminPage.goToMyApp(Constants.CustomerServiceAdminCenter);
            await adminStartPage.navigateToSiteMap();
            await agentScriptAdminPage.createGenericSessionTemplate(adminPage);
            await agentScriptAdminPage.createAgentScript(Constants.AgentScriptName, Constants.AgentScriptUniqueName);
            await agentScriptAdminPage.createAgentScript(Constants.AgentscriptName2, Constants.AgentScriptUniqueName2);
            await agentScriptAdminPage.InitiateSession(Constants.SessionTemplateName, Constants.SessionLink);
            await agentScriptAdminPage.addTwoAgentScriptToSesssionTemplate(Constants.AgentScriptName, Constants.AgentscriptName2);
            await macrosPage.prerequisiteForExpressionBuilder();
            await agentScriptAdminPage.addSlugOrSessionConditionForExpressionBuilder(Constants.SlugName, Constants.CustomerName);
            await agentScriptAdminPage.associateSessionTemplateToaWorkStream();
            await agentScriptAdminPage.goToApps();
            await agentStartPage.goToOmnichannelForCustomers();

            liveChatPage = new LiveChatPage(await liveChatContext.newPage());
            await liveChatPage.open(TestSettings.LivechatBloburl);
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
            await adminStartPage.navigateToOrgUrlAndSignIn(TestSettings.LiveChatPTEAccountEmail, TestSettings.AdminAccountPassword);
            await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
            await adminStartPage.navigateToSiteMap();
            await agentScriptAdminPage.createGenericSessionTemplate(adminPage);
            await agentScriptAdminPage.createAgentScript(Constants.AgentScriptName, Constants.AgentScriptUniqueName);
            await agentScriptAdminPage.createAgentScript(Constants.AgentscriptName2, Constants.AgentScriptUniqueName2);
            await agentScriptAdminPage.InitiateSession(Constants.SessionTemplateName, Constants.SessionLink);
            await agentScriptAdminPage.addTwoAgentScriptToSesssionTemplate(Constants.AgentScriptName, Constants.AgentscriptName2);
            await macrosPage.prerequisiteForExpressionBuilder();
            await agentScriptAdminPage.addSlugOrSessionConditionForExpressionBuilder(Constants.SessionName, Constants.CustomerName);
            await agentScriptAdminPage.associateSessionTemplateToaWorkStream();
            await agentScriptAdminPage.goToApps();
            await agentStartPage.goToOmnichannelForCustomers();

            liveChatPage = new LiveChatPage(await liveChatContext.newPage());
            await liveChatPage.open(TestSettings.LivechatBloburl);
            await liveChatPage.initiateChat();
            await liveChatPage.sendMessage("Hi", "en");
            await liveChatPage.getUniqueChat(liveChatPage, agentPage);
            await agentScriptAdminPage.validateAgentScriptsForExpressionBuilder(Constants.AgentScriptName);
            await liveChatPage.closeChat();
        }
        finally {
            await agentScriptAdminPage.deleteAgentScriptTemplate(Constants.AgentScriptName, agentStartPage);
            await agentScriptAdminPage.deleteSession(Constants.SessionTemplateName);
            await macrosPage?.closePage();
        }
    });
});