import { AgentChat, SearchOptions } from "../../../pages/AgentChat";
import { Constants } from "../../common/constants";
import { IFrameConstants, IFrameHelper } from "../../../Utility/IFrameHelper";
import { Page } from "playwright";
import { TestSettings } from "../../../configuration/test-settings";
import { OrgDynamicsCrmStartPage } from "../../../pages/org-dynamics-crm-start.page";

export class Macros {
  adminPage: any;
  constructor(page: Page) {
    this.adminPage = page;
  }

  public async createMacro(macroName: string, ...params: any[]) {
    await this.adminPage.click(Constants.ProductivitySiteMap);
    await this.adminPage.waitForSelector(Constants.ManageMacros, { timeout: 10000 });
    await this.adminPage.click(Constants.ManageMacros);
    await this.adminPage.click(Constants.NewButton);
    await this.adminPage.fill(Constants.NameField, macroName);
    const iframeParent = await (await this.adminPage.waitForSelector(Constants.MacroDesignerIFrame)).contentFrame();
    const iframeChild = await (await iframeParent.waitForSelector(Constants.MacroDesignerIFrameChild)).contentFrame();
    await iframeChild.click(Constants.StartMacroExecutionBtn);
    await iframeChild.click(Constants.NewStepBtn);
    switch (macroName) {

      case Constants.OpenAccountGrid:
        await iframeChild.click(Constants.OpenRecordGrid);
        await iframeChild.fill(Constants.EntityLogicalNameField, Constants.EntityLogicalNameAccount);
        await iframeChild.fill(Constants.ViewIDField, Constants.ViewID);
        await iframeChild.fill(Constants.ViewTypeField, Constants.ViewType);
        break;

      case Constants.DoRelevanceSearch:
        await iframeChild.click(Constants.DoARelevanceSearchBasedOnThePhrase);
        await iframeChild.fill(Constants.SearchStringField, Constants.SearchString);
        break;

      case Constants.ResolveCase:
        await iframeChild.click(Constants.ActionToResolveCase);
        await iframeChild.fill(Constants.BillableTimeInputField, Constants.Ten);
        await iframeChild.fill(Constants.IncidentIdInputField, params[0]);
        await iframeChild.fill(Constants.ResolutionInputField, Constants.CaseResolution);
        break;

      case Constants.UpdateAccount:
        await iframeChild.click(Constants.UpdateAnExistingRecord);
        await iframeChild.fill(Constants.EntityLogicalNameField, Constants.EntityLogicalNameIncident);
        await this.checkAndCloseDynamicContentPopUp(iframeChild);
        await iframeChild.fill(Constants.EntityRecordIdInputField, params[0]);
        await this.checkAndCloseDynamicContentPopUp(iframeChild);
        await iframeChild.click(Constants.ShowAdvancedOptions);
        await iframeChild.fill(Constants.AttributeName1InputField, Constants.AttributeNameDescription);
        await iframeChild.fill(Constants.AttributeValue1InputField, Constants.AttributeValueDescription);
        break;

      case Constants.OpenKBSearch:
        await iframeChild.click(Constants.SearchKnowledgeArticleBasedOnPhrase);
        await iframeChild.fill(Constants.SearchStringField, Constants.SearchString);
        break;

      case Constants.OpenKbArticle:
        await iframeChild.click(Constants.OpenKnowledgeBaseArticle);
        await iframeChild.fill(Constants.EntityRecordIdField, params[0]);
        break;

      case Constants.OpenNewAccount:
        await iframeChild.click(Constants.OpenNewForm);
        await iframeChild.fill(Constants.EntityLogicalNameField, Constants.EntityLogicalNameAccount);
        break;

      case Constants.OpenExistingRecord:
        await iframeChild.click(Constants.OpenExistingRecordForm);
        await iframeChild.fill(Constants.EntityRecordIDField, params[0]);
        await iframeChild.fill(Constants.EntityLogicalNameField, Constants.EntityLogicalNameIncident);
        break;

      case Constants.OpenDashboard:
        await iframeChild.click(Constants.OpenApplicationTab);
        await iframeChild.fill(Constants.PageTypeInputField, Constants.Dashboard);
        await this.checkAndCloseDynamicContentPopUp(iframeChild);
        await iframeChild.fill(Constants.ApplicationTemplateIdInputField, params[0]);
        await this.checkAndCloseDynamicContentPopUp(iframeChild);
        await iframeChild.click(Constants.ShowAdvancedOptions);
        await iframeChild.fill(Constants.AttributeName1InputField, Constants.AttributeNameDashboard);
        await iframeChild.fill(Constants.AttributeValue1InputField, params[1]);
        break;

      case Constants.OpenEntityList:
        await iframeChild.click(Constants.OpenApplicationTab);
        await iframeChild.fill(Constants.PageTypeInputField, Constants.EntityList);
        await this.checkAndCloseDynamicContentPopUp(iframeChild);
        await iframeChild.fill(Constants.ApplicationTemplateIdInputField, params[0]);
        await this.checkAndCloseDynamicContentPopUp(iframeChild);
        await iframeChild.click(Constants.ShowAdvancedOptions);
        await iframeChild.fill(Constants.AttributeName1InputField, Constants.EntityName);
        await iframeChild.fill(Constants.AttributeValue1InputField, Constants.EntityLogicalNameIncident);
        break;

      case Constants.OpenWebResource:
        await iframeChild.click(Constants.OpenApplicationTab);
        await iframeChild.fill(Constants.PageTypeInputField, Constants.WebResource);
        await this.checkAndCloseDynamicContentPopUp(iframeChild);
        await iframeChild.fill(Constants.ApplicationTemplateIdInputField, params[0]);
        await this.checkAndCloseDynamicContentPopUp(iframeChild);
        await iframeChild.click(Constants.ShowAdvancedOptions);
        await iframeChild.fill(Constants.AttributeName1InputField, Constants.WebResourceName);
        await iframeChild.fill(Constants.AttributeValue1InputField, Constants.WebResourceValue);
        break;

      case Constants.OpenControl:
        await iframeChild.click(Constants.OpenApplicationTab);
        await iframeChild.fill(Constants.PageTypeInputField, Constants.Control);
        await this.checkAndCloseDynamicContentPopUp(iframeChild);
        await iframeChild.fill(Constants.ApplicationTemplateIdInputField, params[0]);
        await this.checkAndCloseDynamicContentPopUp(iframeChild);
        await iframeChild.click(Constants.ShowAdvancedOptions);
        await iframeChild.fill(Constants.AttributeName1InputField, Constants.AttributeNameControl);
        await iframeChild.fill(Constants.AttributeValue1InputField, Constants.AttributeValueControl);
        break;

      case Constants.SendKbArticle:
        await iframeChild.click(Constants.SearchKnowledgeArticleBasedOnPhrase);
        await iframeChild.fill(Constants.SearchStringField, Constants.SearchKb);
        await iframeChild.click(Constants.NewStepBtn);
        await iframeChild.click(Constants.OmnichannelConnector);
        await iframeChild.click(Constants.SendKbArticleInChat);
        break;

      case Constants.EntitySearch:
        await iframeChild.click(Constants.OpenApplicationTab);
        await iframeChild.fill(Constants.PageTypeInputField, Constants.Search);
        await this.checkAndCloseDynamicContentPopUp(iframeChild);
        await iframeChild.fill(Constants.ApplicationTemplateIdInputField, params[0]);
        await this.checkAndCloseDynamicContentPopUp(iframeChild);
        await iframeChild.click(Constants.ShowAdvancedOptions);
        await iframeChild.fill(Constants.AttributeName1InputField, Constants.AttributeNameControl);
        await iframeChild.fill(Constants.AttributeValue1InputField, Constants.AttributeValueControl);
        break;

      case Constants.ExistingRecord:
        await iframeChild.click(Constants.OpenExistingRecordForm);
        await iframeChild.fill(Constants.EntityLogicalName,Constants.Account);
        await this.checkAndCloseDynamicContentPopUp(iframeChild);
        await iframeChild.fill(Constants.EntityRecordID,params[0]);
        break;

      case Constants.CreateDraftEmail:
          await iframeChild.click(Constants.OpenDraftEmailForm);
          await iframeChild.fill(Constants.CaseEmailTemplateId, params[0]);
          await iframeChild.fill(Constants.EntityRecordIDField, params[1]);
          await iframeChild.fill(Constants.EmailRecipientsField, Constants.EmailID);
          await iframeChild.fill(Constants.EntityLogicalNameField, Constants.EntityLogicalNameIncident);
          break;   

      case Constants.AutoFillFieldsWithData:
        await iframeChild.click(Constants.OpenNewForm);
        await iframeChild.fill(Constants.EntityLogicalNameField, Constants.EntityLogicalNameAccount);
        await iframeChild.click(Constants.NewStepBtn);
        await iframeChild.click(Constants.AutofillDataForm);
        await iframeChild.fill(Constants.EntityLogicalNameField, Constants.EntityLogicalNameAccount);
        await iframeChild.click(Constants.ShowAdvancedOptions);
        await iframeChild.fill(Constants.AttributeName1InputField, Constants.AttributeNameValue);
        await iframeChild.fill(Constants.AttributeValue1InputField, Constants.AttributeValue);
        break;
        
      case Constants.ThirdPartyWebsiteAppTabName:
        await iframeChild.click(Constants.OpenApplicationTab);
        await iframeChild.fill(Constants.PageTypeInputField, Constants.ThirdPartyWebsitePage);
        await this.checkAndCloseDynamicContentPopUp(iframeChild);
        await iframeChild.fill(Constants.ApplicationTemplateIdInputField, params[0]);
        await this.checkAndCloseDynamicContentPopUp(iframeChild);
        await iframeChild.click(Constants.ShowAdvancedOptions);
        await iframeChild.fill(Constants.AttributeName1InputField, Constants.ThirdPartyUrl);
        await iframeChild.fill(Constants.AttributeValue1InputField, Constants.ThirdPartyUrlValue);
        break;

      case Constants.SearchPhraseForPopulatedPhrase:
        await iframeChild.click(Constants.SearchPhraseForPopulatedPhraseMacro);
        await iframeChild.fill(Constants.SearchPhraseStringField, Constants.SearchPhraseValue);
        break;

      case Constants.OpenRefreshTab:
        await iframeChild.click(Constants.GetCurrentTab);
        await iframeChild.click(Constants.NewStepBtn);
        await iframeChild.click(Constants.RefreshTab);
        await iframeChild.click(Constants.TabId);
        await iframeChild.waitForSelector(Constants.SelectTabId,{timeout:4000});
        await iframeChild.click(Constants.SelectTabId);
        break;
  
      case Constants.LinkRecordMacro:
        await iframeChild.click(Constants.OmnichannelConnector);
        await iframeChild.click(Constants.LinkRecord);
        await iframeChild.fill(Constants.EntityLogicalNameField, Constants.EntityLogicalNameAccount);
        await iframeChild.fill(Constants.EntityPrimaryNameField, Constants.EntityPrimaryName);
        await iframeChild.fill(Constants.EntityRecordIdInput, params[0]);
        break;
  
      case Constants.UnlinkRecordMacro:
        await iframeChild.click(Constants.OmnichannelConnector);
        await iframeChild.click(Constants.UnlinkRecord);
        await iframeChild.fill(Constants.EntityLogicalNameField, Constants.EntityLogicalNameAccount);
        await iframeChild.fill(Constants.EntityPrimaryNameField, Constants.EntityPrimaryName);
        await iframeChild.fill(Constants.EntityRecordIdInput, params[0]);
        break;
    
    }
    await iframeParent.click(Constants.SaveAndCloseButton2);
    await this.adminPage.waitForTimeout(3000);
  }

  public async deleteMacro(startPage, macroName: string) {
    try {
      await this.openAppLandingPage(this.adminPage);
      await startPage.goToMyApp(Constants.CustomerServiceAdminCenter);
      await this.adminPage.click(Constants.ProductivitySiteMap);
      await this.adminPage.waitForSelector(Constants.ManageMacros, { timeout: 10000 });
      await this.adminPage.click(Constants.ManageMacros);
      await this.adminPage.fill(Constants.ProcessSearchThisViewInputField, macroName);
      await this.adminPage.click(Constants.SearchThisViewStartBtn);
      await this.adminPage.click(Constants.RefreshBtn);
      await this.adminPage.waitForSelector(Constants.SelectAllRowsBtn, { timeout: 10000 });
      await this.adminPage.click(Constants.SelectAllRowsBtn);
      await this.adminPage.click(Constants.DeleteButton);
      await this.adminPage.click(Constants.ConfirmDelete);
    }
    catch (error) {
      console.log(`Delete Macro failed with error: ${error.message}`);
    }
  }

  public async deleteApplicationTab(startPage, applicationTabName: string) {
    try {
      await this.openAppLandingPage(this.adminPage);
      await startPage.goToMyApp(Constants.CustomerServiceAdminCenter);
      await this.adminPage.click(Constants.WorkspaceSiteMap);
      await this.adminPage.waitForSelector(Constants.ManageApplicationTab, { timeout: 10000 });
      await this.adminPage.click(Constants.ManageApplicationTab);
      await this.adminPage.fill(Constants.SearchThisViewInputField, applicationTabName);
      await this.adminPage.click(Constants.SearchThisViewStartBtn);
      await this.adminPage.click(Constants.RefreshBtn);
      await this.adminPage.waitForSelector(Constants.SelectAllRowsBtn, { timeout: 10000 });
      await this.adminPage.click(Constants.SelectAllRowsBtn);
      await this.adminPage.click(Constants.DeleteButton);
      await this.adminPage.click(Constants.ConfirmDeleteButton);
    }
    catch (error) {
      console.log(`Delete Application Tab failed with error: ${error.message}`);
    }
  }

  public async closeConversation(page: Page, agentChat: AgentChat) {
    const iframeCC = await IFrameHelper.GetIframe(
      page,
      IFrameConstants.IframeCC
    );
    await agentChat.waitUntilSelectorIsVisible(
      Constants.EndConversationButtonXPath,
      Constants.Three,
      iframeCC
    );
    await iframeCC.$eval(
      Constants.EndConversationButtonXPath,
      (el) => (el as HTMLElement).click()
    );
    await iframeCC.waitForSelector(
      Constants.EndConversationButtonDisabledXPath
    );
    await page.$eval(
      Constants.RemoveConversationButtonClass,
      (el) => (el as HTMLElement).click()
    );
  }

  public async loginAsAdminAndOpenOmnichannelAdministration(adminStartPage) {
    await adminStartPage.goToOrgUrlAndSignIn(TestSettings.AdminAccountEmail, TestSettings.AdminAccountPassword);
    await adminStartPage.goToOmnichannelAdministration();
  }

  public async initiateLiveChatWithAgent(liveChatPage) {
    await liveChatPage.open(TestSettings.LCWUrl);
    await liveChatPage.initiateChat();
    await liveChatPage.sendMessage("Hi", "en");
  }

  public async loginAsAgentAndOpenOmnichannelForCS(agentStartPage, agentChat) {
    await agentStartPage.goToOrgUrlAndSignIn(TestSettings.AgentAccountEmail, TestSettings.AgentAccountPassword);
    await agentStartPage.goToOmnichannelForCustomers();
    await agentChat.waitForAgentStatusIcon();
    await agentChat.waitForAgentStatus();
    await agentChat.setAgentStatusToAvailable();
  }

  public async acceptLiveChatAsAgent(liveChatPage, agentChat) {
    await liveChatPage.getUniqueChat(liveChatPage, agentChat);
  }

  public async createCaseAndGetIncidentId() {
    await this.adminPage.click(Constants.CasesSitemapBtn);
    await this.adminPage.click(Constants.NewCaseBtn);
    await this.adminPage.fill(Constants.CaseTitleInputField, Constants.AutomationCaseTitle);
    await this.adminPage.click(Constants.CutomerSearchIcon);
    await this.adminPage.click(Constants.CustomerLooupResult);
    await this.adminPage.click(Constants.SaveButton);
    await this.adminPage.click(Constants.RefreshBtn);
    return this.getIdFromUrl(await this.adminPage.url());
  }

  public async getIdFromUrl(url: string) {
    const params = url.split('?')[1].split('&');
    for (let element of params) {
      const pair = element.split('=');
      if (pair[0] === 'id') {
        return pair[1];
      }
    }
  }

  public async createKbArticleAndGetId() {
    await this.adminPage.click(Constants.KnowledgeArticleSitemapBtn);
    await this.adminPage.click(Constants.NewArticleBtn);
    await this.adminPage.fill(Constants.KnowledgeArticlInputField, Constants.KnowledgeArticleTitle);
    await this.adminPage.click(Constants.SaveKbBtn);
    await this.adminPage.click(Constants.MoreCommandsForKnowledgeArticle);
    await this.adminPage.click(Constants.PublishKbSubGrid);
    await this.adminPage.click(Constants.PublishBtn);
    return this.getIdFromUrl(await this.adminPage.url());
  }

  public async createAccountAndGetAccountId(accountName: string) {
    await this.adminPage.click(Constants.AccountSitemapBtn);
    await this.adminPage.click(Constants.NewAccountBtn);
    await this.adminPage.fill(Constants.AccountNameInputField, accountName);
    await this.adminPage.click(Constants.SaveButton);
    await this.adminPage.click(Constants.ThreeDots);
    await this.adminPage.click(Constants.RefreshBtn);
    return this.getIdFromUrl(await this.adminPage.url());
  }

  public async deleteAccountLinkUnlink(adminPage: Page, adminStartPage,accountName: string){
    await this.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
    await this.adminPage.click(Constants.AccountsSitemapBtn);
    await this.adminPage.fill(Constants.AccountSearchThisViewInputField, accountName);
    await this.adminPage.click(Constants.SearchThisViewStartBtn);
    await this.adminPage.click(Constants.RefreshBtn);
    await this.adminPage.waitForSelector(Constants.SelectAllRowsBtn, { timeout: 10000 });
    await this.adminPage.click(Constants.SelectAllRowsBtn);
    await this.adminPage.click(Constants.DeleteButton);
    await this.adminPage.click(Constants.ConfirmDeleteButton);
  }

  public async openAppLandingPage(page: Page) {
    await page.click(Constants.LandingPage);
  }

  public async verifyResolveCase(adminPage: Page, adminStartPage) {
    await this.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
    await adminPage.click(Constants.CasesSitemapBtn);
    await adminPage.click(Constants.ViewSelector);
    await adminPage.click(Constants.ResolvedCasesView);
    await adminPage.fill(Constants.SearchBox, Constants.AutomationCaseTitle);
    await adminPage.click(Constants.SearchThisViewStartBtn);
    try {
      await adminPage.waitForSelector(Constants.AutomationCaseLink);
      return true;
    }
    catch {
      return false;
    }
  }

  public async deleteCase(page: Page, startPage, caseName) {
    await this.openAppLandingPage(page);
    await startPage.goToMyApp(Constants.CustomerServiceHub);
    await page.click(Constants.CasesSitemapBtn);
    await page.click(Constants.ViewSelector);
    await page.click(Constants.AllCasesView);
    await page.fill(Constants.SearchBox, caseName);
    await page.click(Constants.SearchThisViewStartBtn);
    await page.click(Constants.SelectAllRowsBtn);
    await page.click(Constants.DeleteButton);
    await page.click(Constants.ConfirmDelete);
  }

  public async deleteKbArticle(page: Page, startPage, kbArticleName) {
    await this.openAppLandingPage(page);
    await startPage.goToMyApp(Constants.CustomerServiceHub);
    await page.click(Constants.KnowledgeArticleSitemapBtn);
    await page.click(Constants.ViewSelector);
    await page.click(Constants.AllArticleView);
    await page.fill(Constants.SearchBox, kbArticleName);
    await page.click(Constants.SearchThisViewStartBtn);
    await page.click(Constants.SelectAllRowsBtn);
    await this.adminPage.waitForTimeout(4000);
    await page.click(Constants.DeleteButton);
    await page.click(Constants.ConfirmDeleteButton);
  }

  public async verifyUpdateAccount(adminPage: Page, adminStartPage, caseName) {
    await this.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
    await adminPage.click(Constants.CasesSitemapBtn);
    await adminPage.click(Constants.ViewSelector);
    await adminPage.click(Constants.AllCasesView);
    await adminPage.fill(Constants.SearchBox, caseName);
    await adminPage.click(Constants.SearchThisViewStartBtn);
    await adminPage.click(Constants.AutomationCaseLink);
    const desription = await (await adminPage.waitForSelector(Constants.CaseDescription)).textContent();
    return (desription === Constants.AttributeValueDescription) ? true : false;
  }

  public async checkAndCloseDynamicContentPopUp(page) {
    try {
      await page.waitForSelector(Constants.DynamicContentPopUpActive, { timeout: 1000 });
      await page.click(Constants.AddDynamiceContentBtn)
    }
    catch (error) {
      console.log(`No dynamic content pop up`)
    }
  }

  public async getDashboardId() {
    await this.adminPage.click(Constants.DashboardsStemapBtn);
    return this.getIdFromUrl(await this.adminPage.url());
  }

  public async createAccountAndGetId(name) {
    await this.adminPage.click(Constants.AccountsSitemapBtn);
    await this.adminPage.click(Constants.NewButton);
    await this.adminPage.click(Constants.AccountFieldName);
    await this.adminPage.fill(Constants.AccountFieldName, name);
    await this.adminPage.keyboard.press("Tab");
    await this.adminPage.click(Constants.SaveButton);
    await this.adminPage.click(Constants.RefreshBtn);
    return this.getIdFromUrl(await this.adminPage.url());
  }

  public async createApplicationTabAndGetId(name, uniqueName, pageTypeOptionValue) {
    await this.adminPage.click(Constants.WorkspaceSiteMap);
    await this.adminPage.waitForTimeout(4000);
    await this.adminPage.click(Constants.ManageApplicationTab);
    await this.adminPage.click(Constants.NewButton);
    await this.adminPage.fill(Constants.NameField, name);
    await this.adminPage.fill(Constants.UniqueNameField, uniqueName);
    await this.adminPage.fill(Constants.TitleInputField, name);
    await this.adminPage.click(Constants.PageTypeDropdown);
    (await this.adminPage.$(Constants.PageTypeDropdown))?.selectOption(pageTypeOptionValue);
    await this.adminPage.keyboard.press("Tab");
    await this.adminPage.click(Constants.SaveButton);
    await this.adminPage.click(Constants.RefreshBtn);
    return this.getIdFromUrl(await this.adminPage.url());
  }

  public async verifyOpenedTab(page: Page, tabName: string) {
    try {
      await page.waitForSelector(tabName);
      return true;
    }
    catch {
      return false;
    }
  }

  public async InsertParametersInSearchApplicationTab(startPage, EntitySearchApplicationTab: any) {
    await this.openAppLandingPage(this.adminPage);
    await startPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    await this.adminPage.click(Constants.WorkspaceSiteMap);
    //Time delay for loading Manage Application Tab
    await this.adminPage.waitForTimeout(4000);
    await this.adminPage.click(Constants.ManageApplicationTab);
    await this.adminPage.fill(Constants.SearchThisViewInputField, EntitySearchApplicationTab);
    await this.adminPage.click(Constants.SearchThisViewStartBtn);
    await this.adminPage.click(Constants.RefreshBtn);
    await this.adminPage.click(Constants.GetSearchApplicationTab);
    //Time delay for Search Text Box
    await this.adminPage.waitForTimeout(4000);
    await this.adminPage.click(Constants.SearchTextBox);
    //Time delay for Search Text Input Box
    await this.adminPage.waitForTimeout(4000);
    await this.adminPage.waitForSelector(Constants.SearchTextInputBox);
    await this.adminPage.fill(Constants.SearchTextInputBox, Constants.SearchTextValue);
    await this.adminPage.click(Constants.SearchTypeBox);
    await this.adminPage.fill(Constants.SearchTypeInputBox, Constants.SearchTypeValue);
    //Time delay for Save EmailBtn
    await this.adminPage.waitForTimeout(4000);
    await this.adminPage.click(Constants.SaveEmailBtn);
  }

  public async deactivateMacro(startPage, macroName) {
    try {
      await this.openAppLandingPage(this.adminPage);
      await startPage.goToMyApp(Constants.CustomerServiceAdminCenter);
      await this.adminPage.click(Constants.ProductivitySiteMap);
      await this.adminPage.waitForTimeout(4000);
      await this.adminPage.click(Constants.ManageMacros);
      await this.adminPage.click(Constants.ViewSelector);
      await this.adminPage.click(Constants.ActiveMacrosView);
      await this.adminPage.fill(Constants.SearchThisViewInputField, macroName);
      await this.adminPage.click(Constants.SearchThisViewStartBtn);
      await this.adminPage.click(Constants.RefreshBtn);
      await this.adminPage.waitForSelector(Constants.SelectAllRowsBtn, { timeout: 10000 });
      await this.adminPage.click(Constants.SelectAllRowsBtn);
      await this.adminPage.click(Constants.DeactivateBtn);
      await this.adminPage.click(Constants.ConfirmDeactivateBtn);
    }
    catch (error) {
      console.log(`Deactivate Macro failed with error: ${error.message}`);
    }
  }

  public async verifyMacroDeactivated(startPage, macroName) {
    await this.openAppLandingPage(this.adminPage);
    await startPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    await this.adminPage.click(Constants.ProductivitySiteMap);
    await this.adminPage.waitForTimeout(4000);
    await this.adminPage.click(Constants.ManageMacros);
    await this.adminPage.click(Constants.ViewSelector);
    await this.adminPage.click(Constants.DraftMacrosView);
    await this.adminPage.fill(Constants.SearchThisViewInputField, macroName);
    await this.adminPage.click(Constants.SearchThisViewStartBtn);
    await this.adminPage.click(Constants.RefreshBtn);
    try {
      await this.adminPage.waitForSelector(Constants.OpenKBSearchMacro);
      return true;
    }
    catch {
      return false;
    }
  }

  public async EnableKbUrlLink() {
    await this.adminPage.click(Constants.ServiceSiteBtn);
    await this.adminPage.click(Constants.ServiceManagementBtn);
    await this.adminPage.click(Constants.KnowledgeSettingBtn);
    try {
      await this.adminPage.waitForSelector(Constants.EnableExternalPortalYes, { timeout: 3000 });
    }
    catch {
      await this.adminPage.click(Constants.EnableExternalPortalNo);
      await this.adminPage.fill(Constants.UrlTextBox, Constants.KbUrl);
      await this.adminPage.click(Constants.SaveBtn);
    }
  }

  public async VerifyKbUrlLink(page: Page) {
    const iframeParent = await (await page.waitForSelector(Constants.ChatPageDesignerIframe)).contentFrame();
    const iframeChild = iframeParent.childFrames()[0];
    const description = await (await iframeChild.waitForSelector(Constants.MessageInputBox)).textContent();
    return (description.startsWith("http")) ? true : false;
  }

  public async deleteAccount(adminPage: Page, adminStartPage,accountName: string){
    await this.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
    await this.adminPage.click(Constants.AccountsSitemapBtn);
    await this.adminPage.fill(Constants.SearchThisViewInputField, accountName);
    await this.adminPage.click(Constants.SearchThisViewStartBtn);
    await this.adminPage.click(Constants.RefreshBtn);
    await this.adminPage.waitForSelector(Constants.SelectAllRowsBtn, { timeout: 10000 });
    await this.adminPage.click(Constants.SelectAllRowsBtn);
    await this.adminPage.click(Constants.DeleteButton);
    await this.adminPage.click(Constants.ConfirmDeleteButton);
  }

  public async CreateEmailTemplateAndGetId(){
    await this.adminPage.click(Constants.EmailTemplateSiteMapBtn);
    await this.adminPage.click(Constants.NewEmailTemplateBtn);
    await this.adminPage.fill(Constants.EmailTemplateNameInputField, Constants.EmailTemplateName);
    await this.adminPage.click(Constants.Category);
    (await this.adminPage.$(Constants.Category))?.selectOption(Constants.CategoryValue);
    await this.adminPage.keyboard.press("Tab");
    await this.adminPage.waitForSelector(Constants.SelectedCategoryTitle);
    await this.adminPage.click(Constants.CreateBtn);
    const iframeParent = await (await this.adminPage.waitForSelector('[title="Designer"]')).contentFrame();
    const iframeChild = await (await iframeParent.waitForSelector(Constants.EmailIFrame)).contentFrame(); 
    await iframeChild.fill(Constants.EmailTemplateSubjectInputField,Constants.EmailTemplateSubject);
    await this.adminPage.keyboard.press("Enter");
    await this.adminPage.click(Constants.SaveEmailBtn);
    const url = await this.adminPage.url();
    const  params = url.split('?')[1].split('&');
    for(var element of params){
      const pair = element.split('=');
      if (pair[0] === 'id') {
        return pair[1];
      }
    }
  }

  public async deleteEmailTemplate(page: Page, startPage, emailTemplateName) {
    await this.openAppLandingPage(page);
    await startPage.goToMyApp(Constants.CustomerServiceHub);
    await this.adminPage.click(Constants.EmailTemplateSiteMapBtn);
    await page.click(Constants.ViewSelector);
    await page.click(Constants.AllEmailTemplatesView);
    await page.fill(Constants.SearchBox, emailTemplateName);
    await page.click(Constants.SearchThisViewStartBtn);
    await page.click(Constants.SelectAllRowsBtn);
    await page.click(Constants.DeleteButton);
    await page.click(Constants.ConfirmDeleteButton);
  }
  
  public async VerifyLinkedMacro(page: Page) {
    const iframeParent = await (await page.waitForSelector(Constants.ChatPageDesignerIframe)).contentFrame();
    const iframeChild = iframeParent.childFrames()[0];
  try {
    await iframeChild.waitForSelector(Constants.ChatHeaderTitle);
    return true;
  }
  catch {
    return false;
  }
}
  public async createMacroFromOmnichannelAdminCenterApp(macroName: string, ...params: any[]){
    await this.adminPage.waitForSelector(Constants.AgentExperience);
    await this.adminPage.click(Constants.AgentExperience);
    await this.adminPage.waitForSelector(Constants.ManageMacros);
    await this.adminPage.click(Constants.ManageMacros);
    await this.adminPage.click(Constants.NewButton);
    await this.adminPage.fill(Constants.NameField, macroName);
    const iframeParent = await (await this.adminPage.waitForSelector(Constants.MacroDesignerIFrame)).contentFrame();
    const iframeChild = await (await iframeParent.waitForSelector(Constants.MacroDesignerIFrameChild)).contentFrame();
    await iframeChild.click(Constants.StartMacroExecutionBtn);
    await iframeChild.click(Constants.NewStepBtn);
    switch (macroName) {
      case Constants.SaveRecord:
        await iframeChild.click(Constants.OpenNewForm);
        await iframeChild.fill(Constants.EntityLogicalNameField, Constants.EntityLogicalNameAccount);
        await iframeChild.click(Constants.ShowAdvancedOptions);
        await iframeChild.fill(Constants.AttributeName1InputField, Constants.AttributeNameValue);
        await iframeChild.fill(Constants.AttributeValue1InputField, Constants.AttributeValue);
        await iframeChild.click(Constants.NewStepBtn);
        await iframeChild.click(Constants.SaveRecordAction);
        break;
      case Constants.DashboardMacro:
        await iframeChild.click(Constants.OpenApplicationTab);
        await iframeChild.fill(Constants.PageTypeInputField, Constants.Dashboard);
        await this.checkAndCloseDynamicContentPopUp(iframeChild);
        await iframeChild.fill(Constants.ApplicationTemplateIdInputField, params[0]);
        break;
      case Constants.ControlMacro:
        await iframeChild.click(Constants.OpenApplicationTab);
        await iframeChild.fill(Constants.PageTypeInputField, Constants.Control);
        await this.checkAndCloseDynamicContentPopUp(iframeChild);
        await iframeChild.fill(Constants.ApplicationTemplateIdInputField, params[0]);
        break;
      case Constants.EntityListMacro:
        await iframeChild.click(Constants.OpenApplicationTab);
        await iframeChild.fill(Constants.PageTypeInputField, Constants.EntityList);
        await this.checkAndCloseDynamicContentPopUp(iframeChild);
        await iframeChild.fill(Constants.ApplicationTemplateIdInputField, params[0]);
        break;
      case Constants.ThirdPartyWebsiteMacro:
        await iframeChild.click(Constants.OpenApplicationTab);
        await iframeChild.fill(Constants.PageTypeInputField, Constants.ThirdPartyWebsite);
        await this.checkAndCloseDynamicContentPopUp(iframeChild);
        await iframeChild.fill(Constants.ApplicationTemplateIdInputField, params[0]);
        break;
      case Constants.WebResourceMacro:
        await iframeChild.click(Constants.OpenApplicationTab);
        await iframeChild.fill(Constants.PageTypeInputField, Constants.WebResource);
        await this.checkAndCloseDynamicContentPopUp(iframeChild);
        await iframeChild.fill(Constants.ApplicationTemplateIdInputField, params[0]);
        break;
      case Constants.EntityRecordMacro:
        await iframeChild.click(Constants.OpenApplicationTab);
        await iframeChild.fill(Constants.PageTypeInputField, Constants.EntityRecord);
        await this.checkAndCloseDynamicContentPopUp(iframeChild);
        await iframeChild.fill(Constants.ApplicationTemplateIdInputField, params[0]);
        break;
      case Constants.MacroFails:
        await iframeChild.click(Constants.OpenApplicationTab);
        await iframeChild.fill(Constants.PageTypeInputField, Constants.MacroFail);
        await this.checkAndCloseDynamicContentPopUp(iframeChild);
        await iframeChild.fill(Constants.ApplicationTemplateIdInputField, params[0]);
        await this.checkAndCloseDynamicContentPopUp(iframeChild);
        break;
}
  await iframeParent.click(Constants.SaveAndCloseButton2);
  //Macro is saved in draft form that's why added some delay to save it in a activated form.
  await this.adminPage.waitForTimeout(3000);
}      
    
  public async deleteMacroFromOmnichannelAdminCenterApp(adminStartPage:OrgDynamicsCrmStartPage,macroName:string){
    await this.openAppLandingPage(this.adminPage);
    await adminStartPage.goToMyApp(Constants.OmnichannelAdminCenterApp);
    await this.adminPage.waitForSelector(Constants.AgentExperience);
    await this.adminPage.click(Constants.AgentExperience);
    await this.adminPage.waitForSelector(Constants.ManageMacros);
    await this.adminPage.click(Constants.ManageMacros);
    await this.adminPage.waitForSelector(Constants.SearchMacro);
    await this.adminPage.fill(Constants.SearchMacro,macroName);
    await this.adminPage.click(Constants.SearchThisViewStartBtn);
    await this.adminPage.click(Constants.RefreshBtn);
    await this.adminPage.waitForSelector(Constants.SelectAllRowsBtn, { timeout: 10000 });
    await this.adminPage.click(Constants.SelectAllRowsBtn);
    await this.adminPage.click(Constants.DeleteButton);
    await this.adminPage.click(Constants.ConfirmDeleteButton);
  }

  public async VerifyUnlinkedMacro(page: Page) {
    const iframeParent = await (await page.waitForSelector(Constants.ChatPageDesignerIframe)).contentFrame();
    const iframeChild = iframeParent.childFrames()[0];
  try {
    await iframeChild.waitForSelector(Constants.ChatHeaderTitle);
    return true;
  }
  catch {
    return false;
  }
}

  public async GetDashboardId(){
    await this.adminPage.click(Constants.DashboardSitemap);
    return await this.getIdFromUrl(await this.adminPage.url());
}

  public async updateTitleOfApplicationTab(name:string,selectapplicationtab:string,searchapplicationtab:string){
    await this.adminPage.click(Constants.AgentExperience);
    await this.adminPage.click(Constants.ManageApplicationTab);
    await this.adminPage.click(Constants.SearchBox);
    await this.adminPage.fill(Constants.SearchBox,searchapplicationtab);
    await this.adminPage.click(Constants.SearchThisViewStartBtn);
    await this.adminPage.click(selectapplicationtab);
    await this.adminPage.click(Constants.TitleInputField);
    await this.adminPage.keyboard.press(Constants.ControlPlusAPlusDelete);
    await this.adminPage.fill(Constants.TitleInputField,name);
    await this.adminPage.click(Constants.SaveButton);
}

  public async insertDashboardParameters(urlId:any){
    await this.adminPage.click(Constants.AgentExperience);
    await this.adminPage.click(Constants.ManageApplicationTab);
    await this.adminPage.fill(Constants.SearchBox,Constants.DashboardName);
    await this.adminPage.click(Constants.SearchThisViewStartBtn);
    await this.adminPage.click(Constants.DashboardSearch);
    await this.adminPage.click(Constants.SearchTextBox);
    await this.adminPage.waitForSelector(Constants.SearchTextInputBox);
    await this.adminPage.waitForTimeout(2000);
    await this.adminPage.click(Constants.SearchTextInputBox);
    await this.adminPage.fill(Constants.SearchTextInputBox,urlId);
    await this.adminPage.waitForTimeout(4000);
    await this.adminPage.click(Constants.Save);
    await this.adminPage.waitForTimeout(4000);
}

  public async openOmnichannelForCS(agentStartPage: OrgDynamicsCrmStartPage, agentPage: Page, agentChat: AgentChat) {
    await this.openAppLandingPage(agentPage);
    await agentStartPage.goToOmnichannelForCustomers();
    await agentChat.waitForAgentStatusIcon();
    await agentChat.waitForAgentStatus();
    await agentChat.setAgentStatusToAvailable();
}

  public async runMacroAndValidate(agentChat:any,entitylisttitle:string){
    //Time Delay for Loading Productivity Pane
    await agentChat.waitForSelector(Constants.NavigateToAgentScript,{setTimeout:10000});
    await agentChat.waitForTimeout(4000);
    await agentChat.click(Constants.NavigateToAgentScript);
    await agentChat.waitForTimeout(4000);
    await agentChat.click(Constants.MacroRunButton);
    await agentChat.waitForTimeout(4000);
    const MacroValidate = await agentChat.isVisible(entitylisttitle);
    return MacroValidate;
}
  public async insertMacroParameter(macroSearch:string,macroname:string,...params: any[]){
    await this.adminPage.waitForSelector(Constants.AgentExperience);
    await this.adminPage.click(Constants.AgentExperience);
    await this.adminPage.waitForSelector(Constants.ManageMacros);
    await this.adminPage.click(Constants.ManageMacros);
    await this.adminPage.fill(Constants.SearchBox,macroname);
    await this.adminPage.click(Constants.SearchThisViewStartBtn);
    await this.adminPage.click(macroSearch);
    const iframeParent = await (await this.adminPage.waitForSelector(Constants.MacroDesignerIFrame)).contentFrame();
    const iframeChild = await (await iframeParent.waitForSelector(Constants.MacroDesignerIFrameChild)).contentFrame();
    switch(macroname){
      case Constants.DashboardMacro:
        await iframeChild.click(Constants.OpeningApplicationTabWithinMacro);
        await iframeChild.click(Constants.ShowAdvancedOptions);
        await iframeChild.fill(Constants.AttributeName1InputField, params[0]);
        await iframeChild.fill(Constants.AttributeValue1InputField, params[1]);
        break;
      case Constants.ControlMacro:
        await iframeChild.click(Constants.OpeningApplicationTabWithinMacro);
        await iframeChild.click(Constants.ShowAdvancedOptions);
        await iframeChild.fill(Constants.AttributeName1InputField, params[0]);
        await iframeChild.fill(Constants.AttributeValue1InputField, params[1]);
        break;
      case Constants.EntityListMacro:
        await iframeChild.click(Constants.OpeningApplicationTabWithinMacro);
        await iframeChild.click(Constants.ShowAdvancedOptions);
        await iframeChild.fill(Constants.AttributeName1InputField, params[0]);
        await iframeChild.fill(Constants.AttributeValue1InputField, params[1]);
        break;  
      case Constants.ThirdPartyWebsiteMacro:
        await iframeChild.click(Constants.OpeningApplicationTabWithinMacro);
        await iframeChild.click(Constants.ShowAdvancedOptions);
        await iframeChild.fill(Constants.AttributeName1InputField, params[0]);
        await iframeChild.fill(Constants.AttributeValue1InputField, params[1]);
        await iframeChild.click(Constants.AddNewItem);
        await iframeChild.fill(Constants.AttributeName2InputField, params[2]);
        await iframeChild.fill(Constants.AttributeValue2InputField, params[3]);
        break;
      case Constants.EntitySearchMacroName:
        await iframeChild.click(Constants.OpeningApplicationTabWithinMacro);
        await iframeChild.click(Constants.ShowAdvancedOptions);
        await iframeChild.fill(Constants.AttributeName1InputField, params[0]);
        await iframeChild.fill(Constants.AttributeValue1InputField, params[1]);
        await iframeChild.click(Constants.AddNewItem);
        await iframeChild.fill(Constants.AttributeName2InputField, params[2]);
        await iframeChild.fill(Constants.AttributeValue2InputField, params[3]);
        break;
      case Constants.WebResourceMacro:
        await iframeChild.click(Constants.OpeningApplicationTabWithinMacro);
        await iframeChild.click(Constants.ShowAdvancedOptions);
        await iframeChild.fill(Constants.AttributeName1InputField, params[0]);
        await iframeChild.fill(Constants.AttributeValue1InputField, params[1]);
        break;
      case Constants.EntityRecordMacro:
        await iframeChild.click(Constants.OpeningApplicationTabWithinMacro);
        await iframeChild.click(Constants.ShowAdvancedOptions);
        await iframeChild.fill(Constants.AttributeName1InputField, params[0]);
        await iframeChild.fill(Constants.AttributeValue1InputField, params[1]);
        break;
}
    await iframeParent.click(Constants.SaveAndCloseButton2);
    await this.adminPage.waitForTimeout(3000);
}
      
  public async deleteAgentScript(agentScript:string){
    await this.adminPage.waitForSelector(Constants.AgentExperience);
    await this.adminPage.click(Constants.AgentExperience);
    await this.adminPage.waitForSelector(Constants.ManagedAgentScript);
    await this.adminPage.click(Constants.ManagedAgentScript);
    await this.adminPage.click(Constants.SearchBox);
    await this.adminPage.fill(Constants.SearchBox,agentScript);
    await this.adminPage.click(Constants.SearchThisViewStartBtn);
    await this.adminPage.click(Constants.SelectAgentScript);
    await this.adminPage.waitForSelector(Constants.SelectAllRowsBtn, { timeout: 10000 });
    await this.adminPage.click(Constants.SelectAllRowsBtn);
    await this.adminPage.click(Constants.AgentScriptStepTitle);
    await this.adminPage.click(Constants.DeleteAgentScriptStepTitle);
    await this.adminPage.click(Constants.DeleteStepTitle);
    await this.adminPage.waitForTimeout(2000);
    await this.adminPage.click(Constants.DeleteButton);
    await this.adminPage.waitForTimeout(2000);
    await this.adminPage.click(Constants.ConfirmDelete);
    await this.adminPage.waitForTimeout(2000);
}

  public async createAgentScript(AgentScriptName:any,AgentScriptUniqueName: any,MacroName:any){
    await this.adminPage.waitForSelector(Constants.AgentExperience);
    await this.adminPage.click(Constants.AgentExperience);
    await this.adminPage.waitForSelector(Constants.ManagedAgentScript);
    await this.adminPage.click(Constants.ManagedAgentScript);
    try{
      await this.adminPage.waitForSelector(`//*[@title="` +AgentScriptName  + `"]`, { timeout: 3000 });
    }
    catch{
      await this.adminPage.click(Constants.NewButton);
      await this.adminPage.fill(Constants.NameField,AgentScriptName);
      await this.adminPage.fill(Constants.UniqueNameField,AgentScriptUniqueName);
      await this.adminPage.click(Constants.SaveEmailBtn);
      await this.adminPage.click(Constants.AgentScriptStepTitle);
      await this.adminPage.click(Constants.NewAgentScriptStep);
      //Time Delay for filling AgentScriptName
      await this.adminPage.waitForTimeout(3000);
      await this.adminPage.fill(Constants.NameField,Constants.AgentScriptStepName);
      //Time Delay for AgentScriptUniqueName
      await this.adminPage.waitForTimeout(3000);
      await this.adminPage.waitForSelector(Constants.UniqueNameField,{timeout:3000});
      await this.adminPage.fill(Constants.UniqueNameField,Constants.AgentscriptUniquename);
      //Time Delay for filling Order
      await this.adminPage.waitForTimeout(4000);
      await this.adminPage.click(Constants.AgentscriptStepOrderfield);
      await this.adminPage.fill(Constants.AgentscriptStepOrderfield,Constants.AgentscriptStepOrder);
      //Time Delay for Clicking Selector Step
      await this.adminPage.waitForTimeout(4000);

    switch(MacroName){
      case Constants.DashboardMacro:
        const dashboardActiontype=await this.adminPage.$(Constants.AgentscriptSelectorStep);
        await dashboardActiontype?.selectOption(Constants.SelectOptionMacro);
        await this.adminPage.keyboard.press(Constants.TabKeyboardbutton);
        await this.adminPage.click(Constants.TargetMacroLookupResult);
        await this.adminPage.fill(Constants.TargetMacroLookupResult,Constants.DashboardMacro);
        await this.adminPage.click(Constants.DashboardAplicationTab);
        break;
      case Constants.ControlMacro:
        const ControlActiontype=await this.adminPage.$(Constants.AgentscriptSelectorStep);
          await ControlActiontype?.selectOption(Constants.SelectOptionMacro);
          await this.adminPage.keyboard.press(Constants.TabKeyboardbutton);
          await this.adminPage.click(Constants.TargetMacroLookupResult);
          await this.adminPage.fill(Constants.TargetMacroLookupResult,Constants.ControlMacro);
          await this.adminPage.click(Constants.SelectControlMacro);
          break;
      case Constants.EntityListMacro:
        const EntityListActiontype=await this.adminPage.$(Constants.AgentscriptSelectorStep);
            await EntityListActiontype?.selectOption(Constants.SelectOptionMacro);
            await this.adminPage.keyboard.press(Constants.TabKeyboardbutton);
            await this.adminPage.click(Constants.TargetMacroLookupResult);
            await this.adminPage.fill(Constants.TargetMacroLookupResult,Constants.EntityListMacro);
            await this.adminPage.click(Constants.EntityListAplicationTab);
            break;
      case Constants.ThirdPartyWebsiteMacro:
        const ThirdPartyActiontype=await this.adminPage.$(Constants.AgentscriptSelectorStep);
            await ThirdPartyActiontype?.selectOption(Constants.SelectOptionMacro);
            await this.adminPage.keyboard.press(Constants.TabKeyboardbutton);
            await this.adminPage.click(Constants.TargetMacroLookupResult);
            await this.adminPage.fill(Constants.TargetMacroLookupResult,Constants.ThirdPartyWebsiteMacro);
            await this.adminPage.click(Constants.SearhThirdPartyMacro);
            break;
      case Constants.EntitySearchMacroName:
        const SearchActiontype=await this.adminPage.$(Constants.AgentscriptSelectorStep);
            await SearchActiontype?.selectOption(Constants.SelectOptionMacro);
            await this.adminPage.keyboard.press(Constants.TabKeyboardbutton);
            await this.adminPage.click(Constants.TargetMacroLookupResult);
            await this.adminPage.fill(Constants.TargetMacroLookupResult,Constants.EntitySearchMacroName);
            await this.adminPage.click(Constants.SearhTypeMacro);
            break;
      case Constants.WebResourceMacro:
        const WebResourceActiontype=await this.adminPage.$(Constants.AgentscriptSelectorStep);
            await WebResourceActiontype?.selectOption(Constants.SelectOptionMacro);
            await this.adminPage.keyboard.press(Constants.TabKeyboardbutton);
            await this.adminPage.click(Constants.TargetMacroLookupResult);
            await this.adminPage.fill(Constants.TargetMacroLookupResult,Constants.WebResourceMacro);
            await this.adminPage.click(Constants.WebResourceTypeMacro);
            break;
      case Constants.EntityRecordMacro:
        const EntityRecordActiontype=await this.adminPage.$(Constants.AgentscriptSelectorStep);
            await EntityRecordActiontype?.selectOption(Constants.SelectOptionMacro);
            await this.adminPage.keyboard.press(Constants.TabKeyboardbutton);
            await this.adminPage.click(Constants.TargetMacroLookupResult);
            await this.adminPage.fill(Constants.TargetMacroLookupResult,Constants.EntityRecordMacro);
            await this.adminPage.click(Constants.EntityRecordTypeMacro);
            break;
      case Constants.MacroFail:
        const MFActiontype=await this.adminPage.$(Constants.AgentscriptSelectorStep);
            await MFActiontype?.selectOption(Constants.SelectOptionMacro);
            await this.adminPage.keyboard.press(Constants.TabKeyboardbutton);
            await this.adminPage.click(Constants.TargetMacroLookupResult);
            await this.adminPage.fill(Constants.TargetMacroLookupResult,Constants.MacroFail);
            await this.adminPage.click(Constants.MFmacro);
            break;
  }
    await this.adminPage.waitForSelector(Constants.SaveAndCloseButton,{timeout:3000});
    await this.adminPage.click(Constants.SaveAndCloseButton);
    await this.adminPage.click(Constants.SaveAndCloseButton);
  }
}

  public async addAgentScripttoDefaultChatSession(){
    await this.adminPage.waitForSelector(Constants.AgentExperience);
    await this.adminPage.click(Constants.AgentExperience);
    await this.adminPage.waitForSelector(Constants.ManagedSession);
    await this.adminPage.click(Constants.ManagedSession);
    await this.adminPage.click(Constants.ChatSession);
    await this.adminPage.waitForSelector(Constants.AgentScriptsTab);
    await this.adminPage.click(Constants.AgentScriptsTab);
    await this.adminPage.click(Constants.MoreCommandsForAgentScript);
    await this.adminPage.click(Constants.AddExistingAgentScriptsBtn);
    await this.adminPage.click(Constants.LookForRecordsField);
    await this.adminPage.fill(Constants.LookForRecordsField, Constants.AgentScriptName);
    await this.adminPage.click(Constants.AgentScriptNameSearchResult);
    await this.adminPage.waitForSelector(Constants.AddBtn);
    await this.adminPage.click(Constants.AddBtn);
    await this.adminPage.waitForSelector(Constants.AgentScript);
    const visible = await this.adminPage.isVisible(Constants.AgentScript);
    //Time Delay for Checking The Visibility of AgentScript
    await this.adminPage.waitForTimeout(4000);
    expect(visible).toBeTruthy();
    await this.adminPage.click(Constants.SaveAndCloseButton);
}

  public async insertControlParameters(){
    await this.adminPage.click(Constants.AgentExperience);
    await this.adminPage.click(Constants.ManageApplicationTab);
    await this.adminPage.fill(Constants.SearchBox,Constants.ControlApplicationTab);
    await this.adminPage.click(Constants.SearchThisViewStartBtn);
    await this.adminPage.click(Constants.SearchControlApplicationTab);
    await this.adminPage.waitForSelector(Constants.SearchTextBox);
    await this.adminPage.click(Constants.SearchTextBox);
    await this.adminPage.waitForSelector(Constants.SearchTextInputBox);
    await this.adminPage.waitForTimeout(2000);
    await this.adminPage.click(Constants.SearchTextInputBox);
    await this.adminPage.fill(Constants.SearchTextInputBox,Constants.AttributeValueControl);
    await this.adminPage.waitForTimeout(4000);
    await this.adminPage.click(Constants.Save);
    await this.adminPage.waitForTimeout(3000)
}

  public async deleteApplicationTabusingOmnichannelAdminCenter(dashboardapplicationtab:string){
    await this.adminPage.waitForSelector(Constants.AgentExperience);
    await this.adminPage.click(Constants.AgentExperience);
    await this.adminPage.waitForSelector(Constants.ManageApplicationTab);
    await this.adminPage.click(Constants.ManageApplicationTab);
    await this.adminPage.waitForSelector(Constants.SearchMacro);
    await this.adminPage.fill(Constants.SearchMacro,dashboardapplicationtab);
    await this.adminPage.click(Constants.SearchThisViewStartBtn);
    await this.adminPage.click(Constants.RefreshBtn);
    await this.adminPage.waitForSelector(Constants.SelectAllRowsBtn, { timeout: 10000 });
    await this.adminPage.click(Constants.SelectAllRowsBtn);
    await this.adminPage.click(Constants.DeleteButton);
    await this.adminPage.click(Constants.ConfirmDeleteButton);
    
  }

  public async insertEntityListParameters(){
    await this.adminPage.click(Constants.AgentExperience);
    await this.adminPage.click(Constants.ManageApplicationTab);
    await this.adminPage.fill(Constants.SearchBox,Constants.EntityListApplicationTab);
    await this.adminPage.click(Constants.SearchThisViewStartBtn);
    await this.adminPage.click(Constants.EntityListSearch);
    await this.adminPage.waitForSelector(Constants.SearchTextBox);
    await this.adminPage.click(Constants.SearchTextBox);
    await this.adminPage.waitForSelector(Constants.SearchTextInputBox);
    await this.adminPage.waitForTimeout(2000);
    await this.adminPage.click(Constants.SearchTextInputBox);
    await this.adminPage.fill(Constants.SearchTextInputBox,Constants.CategoryValue);
    await this.adminPage.waitForTimeout(4000);
    await this.adminPage.click(Constants.Save);
    await this.adminPage.waitForTimeout(3000)
}

  public async insertThirdPartyParameters(){
    await this.adminPage.click(Constants.AgentExperience);
    await this.adminPage.click(Constants.ManageApplicationTab);
    await this.adminPage.fill(Constants.SearchBox,Constants.EntitySearchApplicationTab );
    await this.adminPage.click(Constants.SearchThisViewStartBtn);
    await this.adminPage.click(Constants.EntitySearchTabTitle);
    await this.adminPage.waitForSelector(Constants.SearchTextBox);
    await this.adminPage.click(Constants.SearchTextBox);
    await this.adminPage.waitForSelector(Constants.SearchTextInputBox);
    await this.adminPage.waitForTimeout(2000);
    await this.adminPage.click(Constants.SearchTextInputBox);
    await this.adminPage.fill(Constants.SearchTextInputBox,Constants.SearchTextValue);
    await this.adminPage.waitForSelector(Constants.SearchTypeBox);
    await this.adminPage.click(Constants.SearchTypeBox);
    await this.adminPage.waitForSelector(Constants.SearchTypeInputBox);
    await this.adminPage.waitForTimeout(2000);
    await this.adminPage.click(Constants.SearchTypeInputBox);
    await this.adminPage.fill(Constants.SearchTypeInputBox,Constants.SearchTypeValue );
    await this.adminPage.waitForTimeout(4000);
    await this.adminPage.click(Constants.Save);
    await this.adminPage.waitForTimeout(3000);
}

  public async insertEntitySearchParameters(){
    await this.adminPage.click(Constants.AgentExperience);
    await this.adminPage.click(Constants.ManageApplicationTab);
    await this.adminPage.fill(Constants.SearchBox,Constants.EntitySearchApplicationTab);
    await this.adminPage.click(Constants.SearchThisViewStartBtn);
    await this.adminPage.click(Constants.EntitySearchTabTitle);
    await this.adminPage.waitForSelector(Constants.SearchTextBox);
    await this.adminPage.click(Constants.SearchTextBox);
    await this.adminPage.waitForSelector(Constants.SearchTextInputBox);
    await this.adminPage.waitForTimeout(2000);
    await this.adminPage.click(Constants.SearchTextInputBox);
    await this.adminPage.fill(Constants.SearchTextInputBox,Constants.ThirdPartyUrlValue);
    await this.adminPage.waitForTimeout(4000);
    await this.adminPage.click(Constants.Save);
    await this.adminPage.waitForTimeout(3000)
}

  public async insertWebResourceParameters(){
    await this.adminPage.click(Constants.AgentExperience);
    await this.adminPage.click(Constants.ManageApplicationTab);
    await this.adminPage.fill(Constants.SearchBox,Constants.WebResourceApplicationTab);
    await this.adminPage.click(Constants.SearchThisViewStartBtn);
    await this.adminPage.click(Constants.WebResourceTabTitle);
    await this.adminPage.waitForSelector(Constants.SearchTypeBox);
    await this.adminPage.click(Constants.SearchTypeBox);
    await this.adminPage.waitForSelector(Constants.SearchTypeInputBox);
    await this.adminPage.waitForTimeout(2000);
    await this.adminPage.click(Constants.SearchTypeInputBox);
    await this.adminPage.fill(Constants.SearchTypeInputBox,Constants.WebResourceValue);
    await this.adminPage.waitForTimeout(4000);
    await this.adminPage.click(Constants.Save);
    await this.adminPage.waitForTimeout(3000)
}

  public async insertEntityRecordParameters(){
    await this.adminPage.click(Constants.AgentExperience);
    await this.adminPage.click(Constants.ManageApplicationTab);
    await this.adminPage.fill(Constants.SearchBox,Constants.EntityRecordApplicationTab);
    await this.adminPage.click(Constants.SearchThisViewStartBtn);
    await this.adminPage.click(Constants.EntityRecordTabTitleSelect);
    await this.adminPage.waitForSelector(Constants.EntityNameBox);
    await this.adminPage.click(Constants.EntityNameBox);
    await this.adminPage.waitForSelector(Constants.EntityNameInputBox);
    await this.adminPage.waitForTimeout(2000);
    await this.adminPage.click(Constants.EntityNameInputBox);
    await this.adminPage.fill(Constants.EntityNameInputBox,Constants.EntityLogicalNameIncident);
    await this.adminPage.waitForTimeout(4000);
    await this.adminPage.click(Constants.Save);
    await this.adminPage.waitForTimeout(3000);
}

  public async createCase(CaseName:any) { 
    await this.adminPage.click(Constants.CaseSitemapBtn);
    await this.adminPage.click(Constants.NewCaseBtn);
    await this.adminPage.fill(Constants.CaseTitleInputField, CaseName);
    await this.adminPage.click(Constants.CutomerNameSearchIcon);
    await this.adminPage.click(Constants.CustomerNameLooupResult);
    await this.adminPage.click(Constants.SaveTheBtn);
    await this.adminPage.click(Constants.RefreshTheBtn);
}

  public async deleteCaseInCSH(page: Page, startPage:any, caseName:any) {
    await this.openAppLandingPage(page);
    await startPage.goToMyApp(Constants.CustomerServiceHub);
    await page.click(Constants.CaseSitemapBtn);
    await page.click(Constants.ViewTheSelector);
    await page.click(Constants.ViewTheAllCases);
    await page.fill(Constants.SearchOption, caseName);
    await page.click(Constants.SearchTheView);
    await page.click(Constants.SelectAllTheRowsBtn);
    await page.click(Constants.DeleteButton);
    await page.click(Constants.ConfirmDeleteButton);
}

  public async InitiateSession(InitiateOne:any, Click:any){  
    await this.adminPage.click(Constants.SearchOption, { timeout: 50000 });
    await this.adminPage.fill(Constants.SearchOption, InitiateOne);
    await this.adminPage.waitForTimeout(3000);
    await this.adminPage.click(Constants.SearchTheView);
    await this.adminPage.click(Click);
    await this.adminPage.waitForTimeout(8000);
}

  public async CloseSession(closeSession:any){
    await this.adminPage.click(closeSession);
    await this.adminPage.click(Constants.ClickCloseSession);
}

  public async CloseTab(closeTab:any){
    await this.adminPage.click(closeTab);
    await this.adminPage.click(Constants.ClickCloseTab);
}

  public async ValidateThePage(ValidateHome:any){
    //Time delay to perform the action
    await this.adminPage.waitForSelector(ValidateHome,{timeout:3000});
    const PageValidate = await this.adminPage.isVisible(ValidateHome);
    expect(PageValidate).toBeTruthy(); 
}

  public async GoToHome(){
    await this.adminPage.click(Constants.Home);
    await this.adminPage.waitForTimeout(2000);
}  

  public async ClickProductivityPaneTool(OpenTool:any){
    await this.adminPage.click(OpenTool);
    await this.adminPage.waitForTimeout(2000);
}

public async InitiateTab(InitiateOne:any, ClickTab:any){
  await this.adminPage.click(Constants.SearchOption, { timeout: 50000 });  
  await this.adminPage.fill(Constants.SearchOption, InitiateOne);
  await this.adminPage.waitForTimeout(3000);
  await this.adminPage.click(Constants.SearchTheView);
  await this.adminPage.waitForTimeout(3000);
  await this.adminPage.click(ClickTab,{modifiers:['Control']});
  await this.adminPage.waitForTimeout(2000);
}

  public async OpenSuggestionCard(ClickTool:any){
    await this.adminPage.click(ClickTool);
    await this.adminPage.waitForTimeout(3000);
}

  public async EmailEditor(){
    await this.adminPage.click(Constants.AddButton, { timeout: 50000 });  
    await this.adminPage.click(Constants.EmailField, { timeout: 50000 });  
    await this.adminPage.waitForTimeout(3000);
    await this.adminPage.fill(Constants.SubjectField, Constants.SubjectData);
    await this.adminPage.waitForTimeout(3000);
}

  public async SwitchBackToPreviousSession(PreviousSession:any){
    await this.adminPage.click(PreviousSession);
    await this.adminPage.waitForTimeout(5000);
}

  public async LinkAndUnlinkCase(ClickLinkBtn:any){
    await this.adminPage.click(ClickLinkBtn);
    await this.adminPage.waitForTimeout(5000);
}

  public async RelatedPage(){
    await this.adminPage.click(Constants.Related);
    await this.adminPage.waitForTimeout(3000);
    await this.adminPage.click(Constants.Connections);
    await this.adminPage.click(Constants.RefreshBtn);
    await this.adminPage.waitForTimeout(3000);
}

  public async ValidateDashboard(ValidateAgentDashboard:any){
    //Delay for app tab to be visible
    await this.adminPage.waitForSelector(ValidateAgentDashboard,{timeout:4000});
    const PageValidate = await this.adminPage.isVisible(ValidateAgentDashboard);
    expect(PageValidate).toBeTruthy();
  }

  public async ClickDropDown(Click:any){
    await this.adminPage.click(Click);
    await this.adminPage.waitForTimeout(8000);
  }

  public async CloseDropDown(Click:any){
    await this.adminPage.click(Click);
    await this.adminPage.waitForTimeout(8000);
  }

  public async CreateTask(TaskName:any){
    await this.adminPage.click(Constants.TaskNewTab);
    await this.adminPage.click(Constants.Activities);
    //Time delay to load page
    await this.adminPage.waitForSelector(Constants.Taskbtn, { timeout: 10000 });
    await this.adminPage.click(Constants.Taskbtn);
    await this.adminPage.fill(Constants.TaskSubjectField, TaskName);
    await this.adminPage.click(Constants.SaveTask);
    //Time delay to save the task page
    await this.adminPage.waitForTimeout(3000);
 }

  public async ConvertTaskToCase(){
    await this.adminPage.click(Constants.MoreOptionInTask);
    await this.adminPage.click(Constants.ConvertTo);
    await this.adminPage.click(Constants.ToCase);
    //Time delay to convert case
    await this.adminPage.waitForSelector(Constants.LookupCustomerField, { timeout: 10000 });
    await this.adminPage.click(Constants.LookupCustomerField);
    await this.adminPage.click(Constants.TaskCustomer);
    await this.adminPage.click(Constants.Convert);
    await this.adminPage.waitForTimeout(3000);
 }

  public async ResolveCase(ResolutionName:String){
    await this.adminPage.click(Constants.MoreOptionInCase);
    await this.adminPage.click(Constants.ResolveCaseBtn);
    //Time delay to load reslove page
    await this.adminPage.waitForSelector(Constants.Resolution, { timeout: 10000 });
    await this.adminPage.fill(Constants.Resolution, ResolutionName);
    await this.adminPage.click(Constants.SaveResolveCase);
    await this.adminPage.waitForTimeout(3000);
 }

  public async ReactivateCase(){
    await this.adminPage.click(Constants.ReactivateCase);
    await this.adminPage.click(Constants.ConfirmReactivate);
    await this.adminPage.waitForTimeout(3000);
}

  public async CancelCase(){
    await this.adminPage.click(Constants.MoreOptionInCase);
    await this.adminPage.click(Constants.CancleCase);
    //Time delay to load cancel page
    await this.adminPage.waitForSelector(Constants.ConfirmCancleCase, { timeout: 10000 });
    await this.adminPage.click(Constants.ConfirmCancleCase);
    await this.adminPage.waitForTimeout(3000);
 }

  public async DeleteCase(){
    await this.adminPage.click(Constants.MoreOptionInCase);
    await this.adminPage.click(Constants.DeleteCase);
    await this.adminPage.click(Constants.ConfirmDeleteCase);
    await this.adminPage.waitForTimeout(3000);
 }

  public async CreateCaseInCSW(CaseName:any, Priority:any){
    await this.adminPage.click(Constants.CreateCaseBtn, { timeout: 50000 }); 
    await this.adminPage.click(Constants.CustomerField);
    await this.adminPage.click(Constants.CaseCustomer);
    //time delay to load customer
    await this.adminPage.waitForSelector(Constants.CaseTitleField, { timeout: 10000 });
    await this.adminPage.fill(Constants.CaseTitleField, CaseName);
    await this.adminPage.click(Constants.CasePriorityField, Priority);
    await this.adminPage.click(Constants.SaveAndClose);
    await this.adminPage.waitForTimeout(3000);
 }

  public async AddNote(ClickAddButton:any, Data:any){
    await this.adminPage.click(ClickAddButton, { timeout: 50000 });  
    await this.adminPage.click(Data, { timeout: 50000 });  
    await this.adminPage.fill(Constants.NoteTitle, Constants.NoteTitleData);
    await this.adminPage.click(Constants.AddNoteBtn);
    await this.adminPage.click(Constants.RefreshBtn);
 }

  public async AddPost(ClickAddButton:any, Data:any){
    await this.adminPage.click(ClickAddButton, { timeout: 5000 });  
    await this.adminPage.click(Data, { timeout: 50000 });  
    await this.adminPage.fill(Constants.PostField, Constants.PostData);
    await this.adminPage.click(Constants.AddPostBtn);
    await this.adminPage.click(Constants.RefreshBtn);
 }

  public async AddTask(ClickAddButton:any, Data:any){
    await this.adminPage.click(ClickAddButton, { timeout: 5000 });  
    await this.adminPage.click(Data, { timeout: 50000 });  
    await this.adminPage.fill(Constants.Subject, Constants.SubjectForTask);
    await this.adminPage.click(Constants.SaveSubject);
    await this.adminPage.click(Constants.RefreshBtn);
 }

  public async GoToCases(){
    await this.adminPage.click(Constants.AddBtnInCase, { timeout: 5000 }); 
    //Time delay to load case grid
    await this.adminPage.click(Constants.Cases, { timeout: 5000 }); 
    await this.adminPage.waitForTimeout(3000);
 }

  public async AssociateCases(SelectCase:any, Validate:any){
    await this.adminPage.click(Constants.SearchOption, { timeout: 50000 });
    await this.adminPage.fill(Constants.SearchOption, SelectCase);
    await this.adminPage.click(Constants.StartSearch);
    //Time delay to load search content
    await this.adminPage.waitForSelector(Constants.SelectAll, { timeout: 10000 });
    await this.adminPage.click(Constants.SelectAll);
    await this.adminPage.click(Constants.ClickAssociateBtn);
    //Time delay to associate page
    await this.adminPage.waitForSelector(Constants.SelectRelation, { timeout: 10000 });
    await this.adminPage.click(Constants.SelectRelation);
    await this.adminPage.click(Constants.SetBtn);
    //Time delay to load associated page
    await this.adminPage.waitForTimeout(2000);
    const visible = await this.adminPage.isVisible(Validate);
    await this.adminPage.waitForTimeout(4000);
    expect(visible).toBeTruthy();
    await this.adminPage.click(Constants.Confirmation);
    await this.adminPage.waitForTimeout(3000);
 }

  public async MergeCases(SelectCase:any){
    await this.adminPage.click(Constants.SearchOption, { timeout: 50000 });
    await this.adminPage.fill(Constants.SearchOption, SelectCase);
    await this.adminPage.click(Constants.StartSearch);
    //Time delay to load search content
    await this.adminPage.waitForSelector(Constants.SelectAll, { timeout: 10000 });
    await this.adminPage.click(Constants.SelectAll);
    await this.adminPage.click(Constants.MergeCaseBtn);
    //Time delay to merge page
    await this.adminPage.waitForSelector(Constants.SelectRelation, { timeout: 10000 });
    await this.adminPage.click(Constants.SelectRelation);
    await this.adminPage.click(Constants.MergeBtn);
    //Time delay to load merged page
    await this.adminPage.waitForSelector(Constants.Confirmation, { timeout: 10000 });
    await this.adminPage.click(Constants.Confirmation);
    await this.adminPage.waitForTimeout(3000);
 }

  public async ParentCaseDetails(SelectCase:any){
    await this.adminPage.click(Constants.SearchOption, { timeout: 50000 });
    await this.adminPage.fill(Constants.SearchOption, SelectCase);
    await this.adminPage.click(Constants.StartSearch);
    //Time delay to load search content
    await this.adminPage.waitForSelector(Constants.ClickParent, { timeout: 10000 });
    await this.adminPage.click(Constants.ClickParent);
    await this.adminPage.waitForTimeout(3000);
 }

  public async VerifyParentCase(){
    await this.adminPage.click(Constants.DetailsBtn);
    //Time delay to load merged cases
    await this.adminPage.waitForTimeout(2000);
    const visible1 = await this.adminPage.isVisible(Constants.CaseCancelled);
    await this.adminPage.waitForTimeout(2000);
    expect(visible1).toBeTruthy();
    await this.adminPage.click(Constants.FirstCase2);
    //Time delay to open case
    await this.adminPage.waitForTimeout(2000);
    const visible2 = await this.adminPage.isVisible(Constants.PostValidate);
    await this.adminPage.waitForTimeout(2000);
    expect(visible2).toBeTruthy();
  }

  public async GoToServiceManagement(){
    await this.adminPage.click(Constants.ServiceSiteBtn);
    await this.adminPage.click(Constants.ServiceManagementBtn);
  }

  public async CreateSubjectsFromHub(TitleName:any, TitleName2:any, TitleName3:any){
    await this.adminPage.click(Constants.Subjects);
    await this.adminPage.click(Constants.NewSubjectBtn);
    await this.adminPage.fill(Constants.TitleField, TitleName);
    await this.adminPage.click(Constants.SaveAndCloseBtn);
    await this.adminPage.click(Constants.NewSubjectBtn);
    await this.adminPage.fill(Constants.TitleField, TitleName2);
    //Time delay to load search content
    await this.adminPage.click(Constants.SubjectSearchIcon, {timeout:4000});
    await this.adminPage.fill(Constants.LooupForSubject,Constants.SubjectName);
    await this.adminPage.click(Constants.SubName);
    await this.adminPage.click(Constants.SaveAndCloseBtn);
    await this.adminPage.click(Constants.NewSubjectBtn);
    await this.adminPage.fill(Constants.TitleField, TitleName3);
    //Time delay to load search content
    await this.adminPage.click(Constants.SubjectSearchIcon, {timeout:4000});
    await this.adminPage.fill(Constants.LooupForSubject, Constants.SubjectName2, {timeout:4000});
    await this.adminPage.click(Constants.SelectSubject2);
    await this.adminPage.click(Constants.SaveAndCloseBtn);
    await this.adminPage.waitForTimeout(4000);
  }

  public async CreateCaseForSubjectsInCSW(CaseName:any, SubName:any) {
    await this.adminPage.click(Constants.NewCaseBtn);
    await this.adminPage.fill(Constants.CaseTitleInputField, CaseName);
    await this.adminPage.click(Constants.CutomerNameSearchIcon);
    await this.adminPage.click(Constants.CustomerLooupResult);
    await this.adminPage.click(Constants.CSWSubjectField);
    //Time delay to load search content
    await this.adminPage.fill(Constants.SubjectSearchIcon, SubName, {timeout:4000});
    //Time delay to fill in search content
    await this.adminPage.waitForTimeout(2000);
    await this.adminPage.keyboard.press("Enter");
    await this.adminPage.click(Constants.ChooseParent);
    await this.adminPage.click(Constants.SaveTheBtn2);
    await this.adminPage.click(Constants.RefreshTheBtn);
  }

  public async ValidateSubjectField(SubField, Parent, Child1){
    await this.adminPage.click(Constants.CSWSubjectField);
    await this.adminPage.click(Constants.Parent);
    await this.adminPage.click(Constants.Child1);
    //Time delay to load search content
    await this.adminPage.waitForSelector(Constants.CSWSubjectField,{timeout:4000});
    const PageValidate = await this.adminPage.isVisible(Constants.Parent, Constants.Child1);
    expect(PageValidate).toBeTruthy();
  }

  public async DeleteSubject(page:Page, startPage) {
    await this.openAppLandingPage(page);
    await startPage.goToMyApp(Constants.CustomerServiceHub);
    await this.adminPage.click(Constants.ServiceSiteBtn);
    await this.adminPage.click(Constants.ServiceManagementBtn);
    await this.adminPage.click(Constants.Subjects);
    //Time delay to load search content
    await this.adminPage.click(Constants.SearchBtn, { timeout: 4000 });
    await this.adminPage.fill(Constants.SearchBoxinSub, Constants.SubjectName);
    await this.adminPage.click(Constants.ChooseParent);
    await this.adminPage.click(Constants.SubDeleteBtn);
    await this.adminPage.click(Constants.ConfirmDeleteBtn);
    //Time delay to action perform
    await this.adminPage.waitForTimeout(3000);
    //Time delay to load search content
    await this.adminPage.click(Constants.SearchBtn, { timeout: 4000 });
    await this.adminPage.fill(Constants.SearchBoxinSub, Constants.SubjectName2,{ timeout: 4000 });
    await this.adminPage.click(Constants.ChooseChild1);
    await this.adminPage.click(Constants.SubDeleteBtn);
    await this.adminPage.click(Constants.ConfirmDeleteBtn);
    await this.adminPage.waitForTimeout(3000);
    //Time delay to load search content
    await this.adminPage.click(Constants.SearchBtn, { timeout: 4000 });
    //Time delay to fill in search content
    await this.adminPage.fill(Constants.SearchBoxinSub, Constants.SubjectName3, { timeout: 4000 });
    await this.adminPage.click(Constants.ChooseChild2);
    await this.adminPage.click(Constants.SubDeleteBtn);
    await this.adminPage.click(Constants.ConfirmDeleteBtn);
  }

  public async CreateEntitlements(ENT:any){
    await this.adminPage.click(Constants.Entitlements);
    await this.adminPage.click(Constants.NewButton);
    await this.adminPage.fill(Constants.EntitlementName, ENT);
    //Time delay to load search content
    await this.adminPage.click(Constants.PrimaryCustomer, { timeout: 20000 });
    //Time delay to load search content
    await this.adminPage.click(Constants.CustomerNameResult, { timeout: 20000 });
    await this.adminPage.click(Constants.StartDate);
    await this.adminPage.click(Constants.ChooseStartDate);
    await this.adminPage.click(Constants.EndDate);
    await this.adminPage.click(Constants.ChooseEndDate);
    await this.adminPage.click(Constants.Save);
  }

  public async DecRemainingOnForCaseCreation(){
    await this.adminPage.click(Constants.DecRemainingOn);  
    await this.adminPage.click(Constants.CaseResolution1);
    await this.adminPage.keyboard.press('ArrowDown');
    await this.adminPage.keyboard.press('Enter');
    await this.adminPage.click(Constants.Save);
  }

  public async Totalterms(totalTerms:any){
    await this.adminPage.click(Constants.TotalTerms);
    await this.adminPage.fill(Constants.TotalTerms, totalTerms);
    await this.adminPage.click(Constants.Save);
    await this.adminPage.click(Constants.Activate);
    await this.adminPage.click(Constants.ConfirmActivate);
  }

  public async createCaseFromCSWSiteMap(CaseName:any) {
    await this.adminPage.click(Constants.CSWSitemapBtn);
    await this.adminPage.click(Constants.Cases);
    await this.adminPage.click(Constants.NewCaseBtn);
    await this.adminPage.fill(Constants.CaseTitleInputField, CaseName);
    await this.adminPage.click(Constants.CutomerNameSearchIcon);
    await this.adminPage.click(Constants.CustomerNameLooupResult);
    await this.adminPage.click(Constants.SaveAndCloseButton);
    await this.adminPage.click(Constants.RefreshTheBtn);
  }

  public async GoToEntField(){
    await this.adminPage.click(Constants.Detais);
    await this.adminPage.click(Constants.EntField);
  }

  public async ChooseEntitlement(ENT:any, chooseEnt:any){
    await this.adminPage.click(Constants.EntField);
    await this.adminPage.click(Constants.SearchEntFeild);
    await this.adminPage.fill(Constants.EntField, ENT);
    await this.adminPage.click(chooseEnt);
    await this.adminPage.click(Constants.SaveAndCloseButton);
    await this.adminPage.click(Constants.RefreshTheBtn);
  }

  public async OpenEntitlement(EntName:any, Ent){
    await this.adminPage.click(Constants.Entitlements);
    await this.adminPage.fill(Constants.EntSearchBox, EntName);
    await this.adminPage.click(Constants.SearchThisViewStartBtn); 
    await this.adminPage.click(Ent);
    await this.adminPage.waitForTimeout(3000);
  }

  public async ChooseEnt1ToEnt2(chooseEnt:any){
    await this.adminPage.click(Constants.Detais);
    await this.adminPage.click(Constants.ClickEntField);
    await this.adminPage.click(Constants.SearchEntFeild);
    //Time delay to perform action
    await this.adminPage.click(chooseEnt, { timeout:4000});
    await this.adminPage.waitForTimeout(4000);
  }

  public async OpenAllCases(){
    await this.adminPage.click(Constants.MyActiveCases);
    await this.adminPage.click(Constants.AllCases);
  }

  public async DoNotDecrementEntitlementTerms(){
    await this.adminPage.click(Constants.MoreCommandsForCase);
    await this.adminPage.click(Constants.DoNotDecrementEntitlementTerms);
    await this.adminPage.click(Constants.Ok);
  }

  public async DeleteEntitlement(EntName:any){
    await this.adminPage.click(Constants.Entitlements);
    await this.adminPage.fill(Constants.EntSearchBox, EntName);
    await this.adminPage.click(Constants.SearchThisViewStartBtn);
    await this.adminPage.click(Constants.SelectAllRowsBtn);
    await this.adminPage.click(Constants.Deactivate);
    await this.adminPage.click(Constants.ConfirmDeactivate);
    await this.adminPage.click(Constants.SelectAllRowsBtn);
    await this.adminPage.click(Constants.DeleteButton);
    await this.adminPage.click(Constants.ConfirmDeleteButton);
  }

  public async CreatePublicQueue(QueueName: any){
    await this.adminPage.click(Constants.QueueBtn);
    await this.adminPage.click(Constants.NewBtn);
    await this.adminPage.fill(Constants.TitleField, QueueName);
    await this.adminPage.waitForTimeout(3000);
    await this.adminPage.click(Constants.SaveAndCloseButton);
    await this.adminPage.waitForTimeout(3000);
  }

  public async AddCaseToQueue(Queue:any){
    await this.adminPage.click(Constants.MoreCommandsForCase);
    await this.adminPage.click(Constants.AddQueue);
    await this.adminPage.fill(Constants.SearchIcon, Queue);
    //Time delay to fill in search content
    await this.adminPage.waitForTimeout(3000);
    await this.adminPage.click(Constants.QueueSearchResult);
    await this.adminPage.click(Constants.Add);
    await this.adminPage.click(Constants.RefreshBtn);
  }

  public async OpenQueueFromCSWSiteMap(){
    await this.adminPage.click(Constants.CSWSitemapBtn);
    await this.adminPage.click(Constants.QueueFromCSW);
    //Time delay to perform the action
    await this.adminPage.waitForTimeout(4000);
  }

  public async SelectAllItemsAllQueues(){
    await this.adminPage.click(Constants.ItemImWorkingOnDropDown);
    await this.adminPage.click(Constants.AllItems);
    await this.adminPage.click(Constants.SelectQueueFilter);
    await this.adminPage.click(Constants.AllQueues);
  }

  public async OpenQueueItem(Queue:any,Click:any){
    //Time delay to load search content
    await this.adminPage.click(Constants.QueueSearchBox, { timeout: 4000 });  
    await this.adminPage.fill(Constants.QueueSearchBox, Queue);
    //Time delay to fill in search content
    await this.adminPage.waitForTimeout(3000);
    await this.adminPage.click(Click,{modifiers:['Control']});
    //Time delay to perform action
    await this.adminPage.waitForTimeout(4000);
  }

  public async DeleteQueue(page:Page, startPage, Que:any){
    await this.openAppLandingPage(page);
    await startPage.goToMyApp(Constants.CustomerServiceHub);
    await this.adminPage.click(Constants.ServiceSiteBtn);
    await this.adminPage.click(Constants.ServiceManagementBtn);
    await this.adminPage.click(Constants.QueueBtn);
    //Time delay to load search content
    await this.adminPage.click(Constants.QueueSearchBoxHub, { timeout: 50000 });  
    await this.adminPage.fill(Constants.QueueSearchBoxHub, Que);
    await this.adminPage.click(Constants.SearchThisViewStartBtn);
    await this.adminPage.click(Constants.SelectAllRowsBtn);
    await this.adminPage.click(Constants.DeleteButton);
    await this.adminPage.click(Constants.ConfirmDelete);
  }

  public async SetupSmartAssist(){
    await this.adminPage.click(Constants.SettingBtn);
    await this.adminPage.click(Constants.ManageSuggestions);
    await this.adminPage.waitForTimeout(2000);
  }

  public async EnableSuggestionsInCSH(){
    await this.adminPage.click(Constants.EnableSimilarSuggestions);
    //Time delay to perform action
    await this.adminPage.waitForTimeout(2000);
    await this.adminPage.click(Constants.EnableKBSuggestions);
    //Time delay to perform action
    await this.adminPage.click(Constants.SaveAndCloseButton, { timeout: 50000 });
    //Time delay to perform action
    await this.adminPage.waitForTimeout(8000);
  }

  public async EmailURL(){
    await this.adminPage.click(Constants.MoreOption);
    await this.adminPage.click(Constants.EmailURL);
  }

  public async ValidateTheEmailBody(Email:any){
    await this.adminPage.waitForSelector(Email, {timeout:4000});
    const PageValidate = await this.adminPage.isVisible(Constants.Emailform, Constants.Body);
    expect(PageValidate).toBeTruthy();
  }

  public async TurnOffSuggestions(page: Page, startPage:any){
    await this.openAppLandingPage(page);
    await startPage.goToMyApp(Constants.CustomerServiceHub);
    await page.click(Constants.ServiceSiteBtn);
    await page.click(Constants.ServiceManagementBtn);
    await page.click(Constants.SettingBtn);
    await page.click(Constants.ManageSuggestions);
    await page.click(Constants.SimilarSuggestions);
    await page.click(Constants.KBSuggestions);
    await page.click(Constants.SaveAndCloseButton);
    await page.waitForTimeout(4000);
  }

  public async EmailContent(){
    await this.adminPage.click(Constants.MoreOption);
    await this.adminPage.click(Constants.EmailContent);
  }

  public async CopylURL(){
    await this.adminPage.click(Constants.MoreOption);
    await this.adminPage.click(Constants.CopyURL);
  }

  public async ValidateTimeLine(Status: any){
    await this.adminPage.click(Constants.FirstAutoPost);
    //Time delay to perform the action
    await this.adminPage.waitForSelector(Status,{timeout:4000});
    const PageValidate = await this.adminPage.isVisible(Status);
    expect(PageValidate).toBeTruthy(); 
  }

  public async ResolvecaseAsInformation(SelecetResolutionType:any, Resolution: any){
    await this.adminPage.click(Constants.MoreCommands);
    await this.adminPage.click(Constants.ResolveCaseButton);
    await this.adminPage.click(SelecetResolutionType);
    await this.adminPage.keyboard.press("ArrowDown");
    await this.adminPage.keyboard.press("Enter");
    await this.adminPage.fill(Constants.ResolutionInputField, Resolution);
    await this.adminPage.click(Constants.ResolveBtn);
  }

  public async GoToMoreCommands(){
    await this.adminPage.click(Constants.MoreCommands);
    //Time delay to perform the action
    await this.adminPage.waitForTimeout(500);
  }

  public async ValidateNotPresent(tabName: string){
    try {
      await page.waitForSelector(tabName);
      return false;
    }
    catch {
      return true;
    }
  }

  public async ClearTimeLine(Status: any){
    await this.adminPage.click(Status);
    //Time delay to perform the action
    await this.adminPage.click(Constants.Delete,{timeout:4000});
    //Time delay to perform the action
    await this.adminPage.waitForTimeout(500);
    await this.adminPage.click(Constants.ConfirmDeleteCase);
  }

  public async deleteQueue(page: Page, startPage:any, QueueName:any) {
    await this.openAppLandingPage(page);
    await startPage.goToMyApp(Constants.CustomerServiceHub);
    await this.adminPage.click(Constants.ServiceSiteBtn);
    await this.adminPage.click(Constants.ServiceManagementBtn);
    await page.click(Constants.QueueBtn);
    await page.fill(Constants.SearchOption, QueueName);
    await page.click(Constants.SearchTheView);
    await page.click(Constants.SelectAllTheRowsBtn);
    await page.click(Constants.DeleteButton);
    await page.click(Constants.ConfirmDeleteButton);  
  }

  public async SaveAndClose(SaveAndClose:any){
    await this.adminPage.click(SaveAndClose);
  }

  public async AddTaskToQueue(Queue:any){
    await this.adminPage.click(Constants.MoreOptionInTask);
    await this.adminPage.click(Constants.AddQueue);
    await this.adminPage.fill(Constants.SearchIcon,Queue);
    //Time delay to perform the action
    await this.adminPage.waitForTimeout(1000);
    await this.adminPage.click(Constants.QueueSearchResult);
    await this.adminPage.click(Constants.Add);
    await this.adminPage.click(Constants.RefreshBtn);
  }

  public async GoToServices(){
    await this.adminPage.click(Constants.ServiceManagement);
    await this.adminPage.click(Constants.Services);
  }

  public async AddQueueToExistingCases(Case: any, Queue: any) { 
    await this.adminPage.click(Constants.CaseSitemapBtn);
    await this.adminPage.click(Constants.SearchBox);  
    await this.adminPage.fill(Constants.SearchBox, Case);
    await this.adminPage.click(Constants.SearchTheView);
    await this.adminPage.click(Constants.SelectAllTheRowsBtn);
    await this.adminPage.click(Constants.MoreCommands);
    await this.adminPage.click(Constants.AddQueue);
    await this.adminPage.fill(Constants.SearchIcon,Queue);
    //Time delay to perform the action
    await this.adminPage.waitForTimeout(3000);
    await this.adminPage.click(Constants.QueueSearchResult);
    await this.adminPage.click(Constants.Add);
  }

  public async OpenCasesLinkedToQueue(Queue :any){
    await this.adminPage.click(Constants.CSWSitemapBtn);
    await this.adminPage.click(Constants.Queues);
    await this.adminPage.click(Constants.ItemsDropDown);
    await this.adminPage.click(Constants.AllItems);
    await this.adminPage.click(Constants.SelectQueueFilter);
    await this.adminPage.click(Queue);
  }

  public async CopyURL(){
    await this.adminPage.click(Constants.MoreOption);
    await this.adminPage.click(Constants.CopyURL);
  }

  public async OpenSiteMapCasesFromCSW(){
    await this.adminPage.click(Constants.CSWSitemapBtn);
    await this.adminPage.click(Constants.Cases);
  }

  public async OpenSimilarCard(card:any){
    await this.adminPage.click(card);
    //Time delay to perform the action
    await this.adminPage.waitForTimeout(1000);
  }

  public async NewCaseFromNewSession(){
    await this.adminPage.click(Constants.NewButton);
    //Time delay to perform the action
    await this.adminPage.waitForTimeout(1000);
  }

  public async CreateTabInApplicationTab(name:any, uniqueName:any, pageTypeOptionValue:string){
    await this.adminPage.click(Constants.ApplicationTabsSitemapBtn);
    await this.adminPage.click(Constants.NewButton);
    await this.adminPage.fill(Constants.NameField, name);
    await this.adminPage.fill(Constants.UniqueNameField, uniqueName);
    await this.adminPage.click(Constants.PageTypeDropdown);
    (await this.adminPage.$(Constants.PageTypeDropdown))?.selectOption(pageTypeOptionValue);
    await this.adminPage.keyboard.press("Tab");
    await this.adminPage.click(Constants.SaveButton);
    await this.adminPage.click(Constants.RefreshBtn);
  }

  public async AddParametersToAppTab(Parameter: any, UniqueName: any, Value: any){
    await this.adminPage.click(Constants.MoreCommandsForParameters);
    await this.adminPage.click(Constants.NewTemplateParameter);
    await this.adminPage.fill(Constants.NameField,Parameter);
    await this.adminPage.fill(Constants.UniqueNameField, UniqueName);
    await this.adminPage.fill(Constants.ValueSelector, Value);
    await this.adminPage.click(Constants.SaveAndCloseButton);
  }

  public async DeleteApplicationTabInCSH(page: Page, startPage:any, ApplicationTab:any)
  {
    await this.openAppLandingPage(page);
    await startPage.goToMyApp(Constants.CustomerServiceHub);
    await page.click(Constants.ServiceSiteBtn);
    await page.click(Constants.ServiceManagementBtn);
    await page.click(Constants.ApplicationTabsSitemapBtn);
    await page.fill(Constants.SearchOption, ApplicationTab);
    await page.click(Constants.SearchTheView);
    await page.click(Constants.SelectAllTheRowsBtn);
    await page.click(Constants.DeleteButton);
    await page.click(Constants.ConfirmDeleteButton);
  }

  public async CreatePrivateQueue(QueueName:any){
    await this.adminPage.click(Constants.QueueBtn);
    await this.adminPage.click(Constants.NewButton);
    await this.adminPage.fill(Constants.NameField, QueueName);
    //Time delay to perform the action
    await this.adminPage.waitForTimeout(1000);
    await this.adminPage.click(Constants.TypeField);
    await this.adminPage.keyboard.press("ArrowDown");
    await this.adminPage.keyboard.press("Enter");
    await this.adminPage.click(Constants.SaveAndCloseButton);
  }

  public async QueueItemDetails(){
    await this.adminPage.click(Constants.MoreCommands);
    await this.adminPage.click(Constants.QueueItemDetails);
  }

  public async OpenQueuesFromCWS(AllQueues:any){
    await this.adminPage.click(Constants.CSWSitemapBtn);
    await this.adminPage.click(Constants.Queues);
    await this.adminPage.click(Constants.ItemsDropDown);
    await this.adminPage.click(Constants.AllItems);
    await this.adminPage.click(Constants.SelectQueueFilter);
    await this.adminPage.click(AllQueues);
  }

  public async SelectRow(TaskName:any){
    //Time delay to perform the action
    await this.adminPage.click(Constants.SearchBox, { timeout: 4000 });  
    await this.adminPage.fill(Constants.SearchBox, TaskName);
    //delay to enter the case
    await this.adminPage.waitForTimeout(2000);
    await this.adminPage.click(Constants.SearchThisViewStartBtn);
    await this.adminPage.click(Constants.SelectTheItem);
  }

  public async ClickRouteOperation(Queue:any){
    await this.adminPage.click(Constants.RouteBtn);
    //Time delay to perform the action
    await this.adminPage.waitForTimeout(1000);
    await this.adminPage.fill(Constants.SearchIconforRoute, Queue);
    //Time delay to perform the action
    await this.adminPage.waitForTimeout(3000);
    await this.adminPage.click(Constants.QueueSearchResult);
    await this.adminPage.click(Constants.ConfirmRouteBtn);
    await this.adminPage.click(Constants.SelectRow);
  }

  public async ClickOperation(OperationBtn: any, ConfirmBtn: any){
    await this.adminPage.click(OperationBtn);
    await this.adminPage.click(ConfirmBtn);
    //Time delay to perform the action
    await this.adminPage.waitForTimeout(2000);
    await this.adminPage.click(Constants.SelectRow);
  }

  public async ClickReleaseOperation(OperationBtn: any, ConfirmBtn: any){
    await this.adminPage.click(OperationBtn);
    await this.adminPage.click(ConfirmBtn);
    //Time delay to perform the action
    await this.adminPage.waitForTimeout(2000);
    await this.adminPage.click(Constants.CloseSearch);
  }
  
  public async deleteTask(page: Page, startPage:any, TaskName:any) {
    await this.openAppLandingPage(page);
    await startPage.goToMyApp(Constants.CustomerServiceHub);
    await page.click(Constants.ActivitiesFromSitemap);
    await page.click(Constants.SearchBox);  
    await page.fill(Constants.SearchBox, TaskName);
    await page.click(Constants.SearchTheView);
    await page.click(Constants.SelectAllTheRowsBtn);
    await page.click(Constants.DeleteButton);
    await page.click(Constants.ConfirmDeleteButton); 
  }
  
  public async createAppProfile(){
    await this.adminPage.click(Constants.WorkspaceSiteMap);
    await this.adminPage.click(Constants.ManageAgentExperienceProfile);
    await this.adminPage.click(Constants.NewAppProfile);
    await this.adminPage.fill(Constants.NameBox, Constants.Name);
    await this.adminPage.fill(Constants.UniqueNameBox, Constants.UniqueName);
    await this.adminPage.click(Constants.CreateAppProfile);
    await this.adminPage.waitForTimeout(5000);
  }

  public async AddUsers(User:String){
    await this.adminPage.waitForSelector(Constants.AddUsers);
    await this.adminPage.click(Constants.AddUsers);
    await this.adminPage.waitForSelector(Constants.SearchUser);
    await this.adminPage.click(Constants. SearchUser, User);
    await this.adminPage.fill(Constants. SearchUser, User);
    await this.adminPage.waitForSelector(Constants.SelectAllBtn);
    await this.adminPage.waitForTimeout(3000);
    await this.adminPage.click(Constants.SelectAllBtn);
    await this.adminPage.click(Constants.AddUser);
  }

  public async AddEntitySession(SessionTemplateName:string){
    await this.adminPage.waitForSelector(Constants.AddEntitySessionTemplate, { timeout: 10000 });
    await this.adminPage.click(Constants.AddEntitySessionTemplate);
    await this.adminPage.click(Constants.AddSession);
    await this.adminPage.click(Constants.SessionTemplateEntity);
    await this.adminPage.click(Constants.Case);
    await this.adminPage.click(Constants.SessionTemplateDropDown);
    await this.adminPage.click(SessionTemplateName);
    await this.adminPage.click(Constants.AddSessionTemplate);
    await this.adminPage.click(Constants.SaveAndCloseButton2);
}

  public async ProductivityPane(){
    await this.adminPage.waitForSelector(Constants.TurnOn, {timeout:10000});
    await this.adminPage.click(Constants.TurnOn);
    await this.adminPage.click(Constants.TurnonProductivityPane);
    await this.adminPage.click(Constants.DefaultMode);
    await this.adminPage.click(Constants.TurnOnAgentScript);
    await this.adminPage.click(Constants.TurnOnKnowledgeSearch);
    await this.adminPage.click(Constants.TurnOnSmartAssist);
    await this.adminPage.click(Constants.SaveAndCloseButton2);
  }

  public async deleteAppProfile(){
    await this.adminPage.openAppLandingPage(page);
    await this.adminPage.click(Constants.CustomerServiceAdmincenter);
    await this.adminPage.click(Constants.WorkspaceSiteMap);
    await this.adminPage.click(Constants.ManageAgentExperienceProfile);
    await this.adminPage.waitForSelector(Constants.SearchAppProfile, { timeout: 10000 });
    await this.adminPage.waitForSelector(Constants.SearchAppProfile);
    await this.adminPage.fill(Constants.SearchAppProfile, Constants.Name);
    await this.adminPage.click(Constants.OpenAppProfile);
    await this.adminPage.click(Constants.DeleteProfile);
    await this.adminPage.click(Constants.ConfirmDelete);
  }

  public async deleteSessionTemplate(SessionTemplateName: string) {
    await this.openAppLandingPage(page);
    await this.adminPage.goToCustomerServiceAdmincenter();
    await this.adminPage.waitForSelector(Constants.WorkspaceSiteMap);
    await this.adminPage.click(Constants.WorkspaceSiteMap);
    await this.adminPage.click(Constants.ManagedSession);
    await this.adminPage.waitForSelector(Constants.SessionSearchThisView);
    await this.adminPage.fill(Constants.SessionSearchThisView, SessionTemplateName);
    await this.adminPage.click(Constants.SearchThisViewStartBtn);
    await this.adminPage.click(Constants.RefreshBtn);
    await this.adminPage.waitForSelector(Constants.SelectAllRowsBtn, { timeout: 10000 });
    await this.adminPage.click(Constants.SelectAllRowsBtn);
    await this.adminPage.click(Constants.DeleteButton);
    await this.adminPage.click(Constants.ConfirmDeleteButton);
  }

  public async EnableOneAppsInProductivityPane(){
    await this.adminPage.waitForSelector(Constants.TurnOn, {timeout:10000});
    await this.adminPage.click(Constants.TurnOn);
    await this.adminPage.click(Constants.TurnonProductivityPane);
    await this.adminPage.click(Constants.DefaultMode);
    await this.adminPage.click(Constants.TurnOnAgentScript);
    await this.adminPage.click(Constants.SaveAndCloseButton2);
  }

  public async EnableTwoAppsInProductivityPane(){
    await this.adminPage.waitForSelector(Constants.TurnOn, {timeout:10000});
    await this.adminPage.click(Constants.TurnOn);
    await this.adminPage.click(Constants.TurnonProductivityPane);
    await this.adminPage.click(Constants.DefaultMode);
    await this.adminPage.click(Constants.TurnOnAgentScript);
    await this.adminPage.click(Constants.TurnOnSmartAssist);
    await this.adminPage.click(Constants.SaveAndCloseButton2);
  }

  public async EnableMSTeamsAppsInProductivityPane(){
    await this.adminPage.waitForSelector(Constants.TurnOn, {timeout:10000});
    await this.adminPage.click(Constants.TurnOn);
    await this.adminPage.click(Constants.TurnonProductivityPane);
    await this.adminPage.click(Constants.DefaultMode);
    await this.adminPage.click(Constants.TurnOnMSTeams);
    await this.adminPage.click(Constants.SaveAndCloseButton2);
  }

  public async ValidateTheStausOwnerTitleConfidenceAndResolution(){
    expect(Constants.SimilarCaseTitle).toContain('Open similar case');
    expect(Constants.SimilarCaseConfidenceLevel).toContain('confidence');
    expect(Constants.CheckResolution).toContain('a');
    expect(Constants.CaseStatusAndOwner).toContain('Resolved');
    expect(Constants.CaseStatusAndOwner).toContain('CustomerService Web Staging');
  }

  public async VerifySuggestionsInCSW(){
    const caseSuggestion = await this.adminPage.isVisible(Constants.CaseSuggestion);
    expect(caseSuggestion).toBeTruthy();
    const kbSuggestion = await this.adminPage.isVisible(Constants.CaseSuggestion);
    expect(kbSuggestion).toBeTruthy();
  }

  public async TurnOnSuggestions(){
    await this.adminPage.click(Constants.ServiceSiteBtn);
    await this.adminPage.click(Constants.ServiceManagementBtn);
    await this.adminPage.click(Constants.InsightsSettings);
    await this.adminPage.click(Constants.ManageSuggestions);
    await this.adminPage.waitForTimeout(2000); 
    await this.adminPage.click(Constants.TurnOnCaseSuggestions);
    await this.adminPage.click(Constants.TurnOnKbSuggestions);
    await this.adminPage.click(Constants.SaveAndCloseButton);
    await this.adminPage.waitForTimeout(12000);
  }

  public async VerifyCopyResolution(){
    await this.adminPage.click(Constants.MoreCommandsInCaseSuggestion);
    await this.adminPage.click(Constants.CopyResolution);
    const copyResolution = await this.adminPage.isVisible(Constants.MessageForCopyResolution);
    expect(copyResolution).toBeTruthy();
  }

  public async createAgentScriptforMultipleSteps(AgentScriptName1:string,AgentScriptUniqueName1:string,MacroName:any, agentscriptTexttype:any, agentscriptScripttype:any){
    await this.adminPage.click(Constants.ProductivitySiteMap);
    await this.adminPage.waitForSelector(Constants.ManageAgentScript, {timeout:2000});
    await this.adminPage.click(Constants.ManageAgentScript);
  try{
    await this.adminPage.waitForSelector(`//*[@title="` +AgentScriptName1  + `"]`, { timeout: 3000 });
  }
  catch{
    await this.adminPage.click(Constants.NewButton);
    await this.adminPage.fill(Constants.NameField,AgentScriptName1);
    await this.adminPage.fill(Constants.UniqueNameField,AgentScriptUniqueName1);
    await this.adminPage.click(Constants.SaveEmailBtn);
    await this.adminPage.click(Constants.AgentScriptStepTitle);
    await this.adminPage.click(Constants.NewAgentScriptStep);
    //Time Delay for filling AgentScriptName
    await this.adminPage.waitForTimeout(3000);
    await this.adminPage.fill(Constants.AgentScriptStepNameBox,Constants.AgentScriptStepName);
    //Time Delay for AgentScriptUniqueName
    await this.adminPage.waitForTimeout(3000);
    await this.adminPage.waitForSelector(Constants.AgentscriptstepUniquenameBox,{timeout:3000});
    await this.adminPage.fill(Constants.AgentscriptstepUniquenameBox,Constants.AgentscriptUniquename0);
    //Time Delay for filling Order
    await this.adminPage.waitForTimeout(4000);
    await this.adminPage.click(Constants.AgentscriptStepOrderfield);
    await this.adminPage.fill(Constants.AgentscriptStepOrderfield,Constants.AgentscriptStepOrderforMacro);
    //Time Delay for Clicking Selector Step
    await this.adminPage.waitForTimeout(4000);
    switch(MacroName){
      case Constants.SearchPhraseForPopulatedPhrase:
        const macroActiontype=await this.adminPage.$(Constants.AgentscriptSelectorStep);
        await macroActiontype?.selectOption(Constants.SelectOptionMacro);
        await this.adminPage.keyboard.press(Constants.TabKeyboardbutton);
        await this.adminPage.click(Constants.TargetMacroLookupResult);
        await this.adminPage.fill(Constants.TargetMacroLookupResult,Constants.SearchPhraseForPopulatedPhrase);
        await this.adminPage.click(Constants.SearchPhraseForPopulatedPhraseForm);
        break;
    }
    // Time Delay To save and close the agent script
    await this.adminPage.waitForSelector(Constants.SaveAndCloseButton,{timeout:3000});
    await this.adminPage.click(Constants.SaveAndCloseButton);
    await this.adminPage.click(Constants.AgentScriptStepTitle);
    await this.adminPage.click(Constants.NewAgentScriptStep);
    //Time Delay for filling AgentScriptName
    await this.adminPage.waitForTimeout(3000);
    await this.adminPage.fill(Constants.AgentScriptStepNameBox,Constants.AgentScriptStepName1);
    //Time Delay for AgentScriptUniqueName
    await this.adminPage.waitForTimeout(3000);
    await this.adminPage.waitForSelector(Constants.AgentscriptstepUniquenameBox,{timeout:3000});
    await this.adminPage.fill(Constants.AgentscriptstepUniquenameBox,Constants.AgentscriptUniquename1);
    //Time Delay for filling Order
    await this.adminPage.waitForTimeout(4000);
    await this.adminPage.click(Constants.AgentscriptStepOrderfield);
    await this.adminPage.fill(Constants.AgentscriptStepOrderfield,Constants.AgentscriptStepOrderforText);
    //Time Delay for Clicking Selector Step
    await this.adminPage.waitForTimeout(4000);
    await this.adminPage.click(Constants.SaveAndCloseButton);
    switch(agentscriptTexttype){
      case Constants.SelectOptionText:
        await this.adminPage.click(Constants.AgentscriptSelectorStep);
        const textActiontype=await this.adminPage.$(Constants.AgentscriptSelectorStep);
        textActiontype?.selectOption(Constants.SelectOptionText);
        await this.adminPage.keyboard.press(Constants.TabKeyboardbutton);
        await this.adminPage.waitForSelector(Constants.TextAreaInstruction,{timeout:3000});
        await this.adminPage.fill(Constants.TextAreaInstruction,Constants.TextInstructionValue);
        break;
    }
    // Time Delay To save and close the agent script
    await this.adminPage.waitForSelector(Constants.SaveAndCloseButton,{timeout:3000});
    await this.adminPage.click(Constants.SaveAndCloseButton);
    await this.adminPage.click(Constants.AgentScriptStepTitle);
    await this.adminPage.click(Constants.NewAgentScriptStep);
    //Time Delay for filling AgentScriptName
    await this.adminPage.waitForTimeout(3000);
    await this.adminPage.fill(Constants.AgentScriptStepNameBox,Constants.AgentScriptStepName2);
    //Time Delay for AgentScriptUniqueName
    await this.adminPage.waitForTimeout(3000);
    await this.adminPage.waitForSelector(Constants.AgentscriptstepUniquenameBox,{timeout:3000});
    await this.adminPage.fill(Constants.AgentscriptstepUniquenameBox,Constants.AgentscriptUniquename2);
    //Time Delay for filling Order
    await this.adminPage.waitForTimeout(4000);
    await this.adminPage.click(Constants.AgentscriptStepOrderfield);
    await this.adminPage.fill(Constants.AgentscriptStepOrderfield,Constants.AgentscriptStepOrderforScript);
    //Time Delay for Clicking Selector Step
    await this.adminPage.waitForTimeout(4000);
    await this.adminPage.click(Constants.SaveAndCloseButton);
    switch(agentscriptScripttype){
      case Constants.SelectOptionScript:
        await this.adminPage.click(Constants.AgentscriptSelectorStep);
        const textActiontype=await this.adminPage.$(Constants.AgentscriptSelectorStep);
        textActiontype?.selectOption(Constants.SelectOptionScript);
        await this.adminPage.keyboard.press(Constants.TabKeyboardbutton);
        await this.adminPage.click(Constants.TargetScriptLookupResult);
        await this.adminPage.fill(Constants.TargetScriptLookupResult,Constants.AgentscriptName2);
        await this.adminPage.click(Constants.DummyAgentScriptForm);
        break;
    }
    // Time Delay To save and close the agent script
    await this.adminPage.waitForSelector(Constants.SaveAndCloseButton,{timeout:3000});
    await this.adminPage.click(Constants.SaveAndCloseButton);
    await this.adminPage.click(Constants.RefreshButton);
    //Time Delay for Saving the Agent Script Properly
    await this.adminPage.waitForTimeout(4000);
    await this.adminPage.click(Constants.SaveAndCloseButton);
  }
}

  public async ValidateStepsinAgentScript(adminPage: any, AgentScriptName:string){
    await this.adminPage.waitForSelector(Constants.AgentScriptSearch);
    await this.adminPage.fill(Constants.AgentScriptSearch,AgentScriptName);
    await this.adminPage.click(Constants.SearchThisViewStartBtn);
    await this.adminPage.click(Constants.RefreshBtn);
    //Time Delay for selecting all rows button
    await this.adminPage.waitForSelector(Constants.SelectAllRowsBtn, { timeout: 10000 });
    await this.adminPage.click(Constants.SelectAllRowsBtn);
    await this.adminPage.click(Constants.EditBtn);
    //Time Delay for Visibility of Excecution
    await adminPage.waitForTimeout(4000);
    const ValidateResult = await adminPage.isVisible(Constants.AgentScriptStep, Constants.AgentScriptStep1, Constants.AgentScriptStep2);
    return ValidateResult;
  }

  public async createAgentScriptWithoutSteps(AgentScriptName2:string,AgentScriptUniqueName2: string){
    await this.adminPage.click(Constants.ProductivitySiteMap);
    await this.adminPage.waitForSelector(Constants.ManageAgentScript, {timeout:2000});
    await this.adminPage.click(Constants.ManageAgentScript);
    try{
      await this.adminPage.waitForSelector(`//*[@title="` +AgentScriptName2  + `"]`, { timeout: 3000 });
    }
    catch{
      await this.adminPage.click(Constants.NewButton);
      await this.adminPage.fill(Constants.NameField,AgentScriptName2);
      await this.adminPage.fill(Constants.UniqueNameField,AgentScriptUniqueName2);
      //Time Delay for Saving the Agent Script Properly
      await this.adminPage.waitForTimeout(4000);
      await this.adminPage.click(Constants.SaveAndCloseButton);
    }
  }

  public async deleteAgentScriptwithoutSteps(AgentScriptName2:string){
    await this.adminPage.fill(Constants.AgentScriptSearch, AgentScriptName2);
    await this.adminPage.click(Constants.SearchThisViewStartBtn);
    await this.adminPage.click(Constants.RefreshBtn);
    // Time delay for selecting all rows button
    await this.adminPage.waitForSelector(Constants.SelectAllRowsBtn, { timeout: 10000 });
    await this.adminPage.click(Constants.SelectAllRowsBtn);
    // Time Delay for Edit button to appear
    await this.adminPage.waitForSelector(Constants.DeleteButton, { timeout: 10000 });
    await this.adminPage.click(Constants.DeleteButton);
    await this.adminPage.click(Constants.ConfirmDeleteButton);
  }

  public async createEntitySessionTemplate() {
    await this.adminPage.click(Constants.WorkspaceSiteMap);
    await this.adminPage.click(Constants.ManagedSession);
    await this.adminPage.click(Constants.NewButton);
    await this.adminPage.fill(Constants.NameField, Constants.SessionTemplateName);
    await this.adminPage.fill(Constants.UniqueNameField, Constants.SessionTemplateUniqueName);
    await this.adminPage.click(Constants.EntityField);
    await this.adminPage.click(Constants. CaseEntity);
    await this.adminPage.click(Constants.SaveAndCloseButton);
    await this.adminPage.waitForSelector(Constants.RefreshBtn);
    await this.adminPage.click(Constants.RefreshBtn);
  }
  
  public async addAppTabtoSession(applicationTabName:string, ApplicationTabSearchResult:string){
    await this.adminPage.fill(Constants.SessionSearchThisView,Constants.SessionTemplateName);
    await this.adminPage.click(Constants.SearchThisViewStartBtn);
    await this.adminPage.click(Constants.RefreshBtn);
    await this.adminPage.waitForSelector(Constants.SelectAllRowsBtn);
    await this.adminPage.click(Constants.SelectAllRowsBtn);
    await this.adminPage.waitForSelector(Constants.EditBtn, {timeout: 5000});
    await this.adminPage.click(Constants.EditBtn);
    //Time Delay to load the page
    await this.adminPage.waitForTimeout(3000); 
    await this.adminPage.click(Constants.MoreCommandsForApplicationTab);
    await this.adminPage.click(Constants.AddExistingApplicationTabsBtn);
    await this.adminPage.fill(Constants.LookForRecordsField,applicationTabName);
    await this.adminPage.click(ApplicationTabSearchResult);
    await this.adminPage.waitForTimeout(1000);
    //await this.adminPage.waitForSelector(Constants.SelectedApplicationTabSearchResult);
    await this.adminPage.click(Constants.AddBtn);
    await this.adminPage.waitForTimeout(1000);
    await this.adminPage.click(Constants.SaveAndCloseButton);
    await this.adminPage.click(Constants.RefreshBtn);
  }
  
  public async createApplicationTab(name: String, uniqueName:String, pageTypeOptionValue: any) {
    await this.adminPage.click(Constants.AgentExperience);
    await this.adminPage.click(Constants.WorkspaceSiteMap);
    await this.adminPage.waitForSelector(Constants.ManageApplicationTab);
    await this.adminPage.click(Constants.ManageApplicationTab);
    await this.adminPage.click(Constants.NewButton);
    await this.adminPage.fill(Constants.NameField, name);
    await this.adminPage.fill(Constants.UniqueNameField, uniqueName);
    await this.adminPage.fill(Constants.TitleInputField, name);
    await this.adminPage.click(Constants.PageTypeDropdown);
    (await this.adminPage.$(Constants.PageTypeDropdown))?.selectOption(pageTypeOptionValue);
    await this.adminPage.keyboard.press("Tab");
    await this.adminPage.click(Constants.SaveAndCloseButton);
  }
  
  public async ValidateAppTab(adminPage: any, NewAppTab:any){
    await this.adminPage.waitForSelector(Constants.AutomationCase, {timeout: 20000});
    await this.adminPage.click(Constants.AutomationCase);
    await this.adminPage.waitForSelector(NewAppTab, {timeout: 4000});
    const ValidateResult = await adminPage.isVisible(NewAppTab);
    return ValidateResult;
  }

  public async openAccount(Account:String){
    await this.adminPage.click(Constants.OpenSiteMap);
    await this.adminPage.click(Constants.AccountsSitemapBtn);
    await this.adminPage.click(Constants.ChangeView);
    await this.adminPage.click(Constants.AllAccountsView);
    await this.adminPage.click(Account);
  }
  
  public async deleteApplicationTabWithCSAdminCenter(adminStartPage:any, applicationTabName: string) {
    try {
      await this.openAppLandingPage(this.adminPage);
      await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
      await this.adminPage.click(Constants.WorkspaceSiteMap);
      await this.adminPage.waitForSelector(Constants.ManageApplicationTab, { timeout: 10000 });
      await this.adminPage.click(Constants.ManageApplicationTab);
      await this.adminPage.waitForSelector(Constants.ApplicationTabSearchThisViewInputField);
      await this.adminPage.fill(Constants.ApplicationTabSearchThisViewInputField, applicationTabName);
      await this.adminPage.click(Constants.SearchThisViewStartBtn);
      await this.adminPage.click(Constants.RefreshBtn);
      await this.adminPage.waitForSelector(Constants.SelectAllRowsBtn, { timeout: 10000 });
      await this.adminPage.click(Constants.SelectAllRowsBtn);
      await this.adminPage.click(Constants.DeleteButton);
      await this.adminPage.click(Constants.ConfirmDeleteButton);
    }
    catch (error) {
      console.log(`Delete Application Tab failed with error: ${error.message}`);
    }
  }

  public async AddSlugToDashboardAppTab(adminStartPage:any){
    await this.openAppLandingPage(this.adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    await this.adminPage.click(Constants.WorkspaceSiteMap);
    await this.adminPage.waitForSelector(Constants.ManageApplicationTab, { timeout: 10000 });
    await this.adminPage.click(Constants.ManageApplicationTab);
    await this.adminPage.waitForSelector(Constants.SearchBox);
    await this.adminPage.fill(Constants.SearchBox,Constants.DashboardApplicationTab);
    await this.adminPage.click(Constants.SearchThisViewStartBtn);
    await this.adminPage.click(Constants.EntityListSearch);
    await this.adminPage.waitForSelector(Constants.SearchTextBox1);
    await this.adminPage.click(Constants.SearchTextBox1);
    await this.adminPage.waitForSelector(Constants.SearchTextInputBox);
    await this.adminPage.click(Constants.SearchTextInputBox);
    await this.adminPage.fill(Constants.SearchTextInputBox,Constants.SlugCategoryValue);
    await this.adminPage.click(Constants.Save);
    await this.adminPage.waitForTimeout(3000)
  }
  
  public async AddSlugToEntityListAppTab(adminStartPage:any){
    await this.openAppLandingPage(this.adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    await this.adminPage.click(Constants.WorkspaceSiteMap);
    await this.adminPage.waitForSelector(Constants.ManageApplicationTab, { timeout: 10000 });
    await this.adminPage.click(Constants.ManageApplicationTab);
    await this.adminPage.waitForSelector(Constants.SearchBox);
    await this.adminPage.fill(Constants.SearchBox,Constants.EntityListApplicationTab);
    await this.adminPage.click(Constants.SearchThisViewStartBtn);
    await this.adminPage.click(Constants.EntityListSearch);
    await this.adminPage.waitForSelector(Constants.SearchTextBox1);
    await this.adminPage.click(Constants.SearchTextBox1);
    await this.adminPage.waitForSelector(Constants.SearchTextInputBox);
    await this.adminPage.click(Constants.SearchTextInputBox);
    await this.adminPage.fill(Constants.SearchTextInputBox,Constants.SlugCategoryValue);
    await this.adminPage.click(Constants.Save);
    await this.adminPage.waitForTimeout(3000)
  }

  public async OpenKbSearchAndValidate(agentChat:any){
    //Time Delay for Loading Productivity Pane
    await agentChat.waitForSelector(Constants.KStool,{setTimeout:10000});
    await agentChat.waitForTimeout(4000);
    await agentChat.click(Constants.KStool);
    await agentChat.waitForTimeout(4000);
    await agentChat.fill(Constants.KBSearchOption, Constants.AutomationCaseTitle);
    await agentChat.keyboard.press("Enter");
    await agentChat.waitForTimeout(4000);
    const Validate = await agentChat.isVisible(Constants.CopyUrl2);
    return Validate;
}

  public async MoreActions(){
    await this.adminPage.click(Constants.MoreActions);
    await this.adminPage.waitForTimeout(1000);
}

  public async OpenClosedItem(agentChat:any){
    await agentChat.waitForSelector(Constants.ClickClosedVisiter);
    await agentChat.click(Constants.ClickClosedVisiter);
    await agentChat.waitForTimeout(4000);
}

  public async TurnOnMissedNotifications(){ 
    await this.adminPage.click(Constants.WorkSpaces);
    await this.adminPage.click(Constants.ManageNotification);
    await this.adminPage.click(Constants. MissedNotifications);
    await this.adminPage.click(Constants.EnableMissedNotifications);
    await this.adminPage.click(Constants.SaveAndCloseButton);
    await this.adminPage.waitForTimeout(4000);
  }

  public async StatusPresence(agentChat:any) {
    await agentChat.waitForAgentStatusIcon();
    await agentChat.waitForAgentStatus();
    await agentChat.setAgentStatusToAvailable();
  } 

  public async CreateRoutingRole(RuleName: any, RuleItemName: any, QueueName: any){
    await this.adminPage.click(Constants.RoutingRuleBtn);
    await this.adminPage.click(Constants.NewButton);
    await this.adminPage.fill(Constants.NameField, RuleName);
    await this.adminPage.click(Constants.Save);
    // Time Delay to load the page
    await this.adminPage.waitForTimeout(3000);
    await this.adminPage.click(Constants.MoreCommandsForRule);
    await this.adminPage.click(Constants.NewRuleItemBtn);
    // Time Delay to load the page
    await this.adminPage.waitForTimeout(3000);
    await this.adminPage.fill(Constants.RuleItemTitleField, RuleItemName);
    await this.adminPage.click(Constants.PlusAddBtn);
    await this.adminPage.click(Constants.AddRow);
    await this.adminPage.click(Constants.FieldSelector);
    await this.adminPage.click(Constants.SelectField);
    await this.adminPage.click(Constants.ValueSelector);
    await this.adminPage.click(Constants.SelectValue) ;
    await this.adminPage.click(Constants.RouteTo);
    await this.adminPage.keyboard.press("ArrowDown");
    await this.adminPage.keyboard.press("Enter");
    await this.adminPage.fill(Constants.AddToQueue, QueueName);
    // Time Delay to load the page
    await this.adminPage.waitForTimeout(1000);
    await this.adminPage.click(Constants.SearchResult);
    await this.adminPage.click(Constants.SaveAndCloseButton);
    // Time Delay to load the page
    await this.adminPage.waitForTimeout(1000);
    await this.adminPage.click(Constants.Activate);
    await this.adminPage.click(Constants.ConfirmBtn);
    // Time Delay to load the page
    await this.adminPage.waitForTimeout(2000);
  }

  public async AddPriorityToCase(){
    await this.adminPage.click(Constants.CasePriorityField);
    await this.adminPage.keyboard.press("ArrowUp");
    await this.adminPage.keyboard.press("Enter");
    await this.adminPage.click(Constants.Save);  
    await this.adminPage.click(Constants.RefreshBtn);
    // Time Delay to load the page
    await this.adminPage.waitForTimeout(4000);
  }

  public async SaveAndRoute(InitiateOne:any,Click:any){
    await this.adminPage.click(Constants.SaveAndRoute);
    await this.adminPage.click(Constants.ConfirmRoute);
    // Time Delay to load the page
    await this.adminPage.click(Constants.SearchOption, { timeout: 4000 });
    await this.adminPage.fill(Constants.SearchOption, InitiateOne);
    // Time Delay to load the page
    await this.adminPage.waitForTimeout(3000);
    await this.adminPage.click(Constants.SearchTheView);
    await this.adminPage.click(Click);
    // Time Delay to load the page    
    await this.adminPage.waitForTimeout(4000);
    await this.adminPage.click(Constants.RefreshBtn);
    // Time Delay to load the page
    await this.adminPage.waitForTimeout(4000);
  }

  public async SaveAndRouteInTab(){
    await this.adminPage.click(Constants.SaveAndRoute);
    await this.adminPage.click(Constants.ConfirmRoute);
    // Time Delay to load the page
    await this.adminPage.waitForTimeout(2000);
    await this.adminPage.click(Constants.CaseLink1,{modifiers:['Control']})
    //delay to open the case
    await this.adminPage.waitForTimeout(4000);
    await this.adminPage.click(Constants.RefreshBtn);
    // Time Delay to load the page
    await this.adminPage.waitForTimeout(4000);
  }

  public async deleteRoutingRule(page: Page, startPage:any, RuleName:any){
    await this.openAppLandingPage(page);
    await startPage.goToMyApp(Constants.CustomerServiceHub);
    await this.adminPage.click(Constants.ServiceSiteBtn);
    await this.adminPage.click(Constants.ServiceManagementBtn);
    await page.click(Constants.RoutingRuleBtn);
    await page.fill(Constants.SearchOption,RuleName);
    await page.click(Constants.SearchTheView);
    await page.click(Constants.SelectAllTheRowsBtn);
    await page.click(Constants.DeactivateBtn);
    await page.click(Constants.ConfirmBtn);    
    await page.click(Constants.SelectAllTheRowsBtn);
    await page.click(Constants.DeleteButton);
    await page.click(Constants.ConfirmDeleteCase);
  }

  public async createResolveSessionMacro(macroName: string, ...params: any[]) {
    await this.adminPage.click(Constants.ProductivitySiteMap);
    // Time Delay to load the page
    await this.adminPage.waitForSelector(Constants.ManageMacros, { timeout: 4000 });
    await this.adminPage.click(Constants.ManageMacros);
    await this.adminPage.click(Constants.NewButton);
    // Time Delay to load the page
    await this.adminPage.fill(Constants.NameField, macroName, { timeout:4000});
    const iframeParent = await (await this.adminPage.waitForSelector(Constants.MacroDesignerIFrame)).contentFrame();
    const iframeChild = await (await iframeParent.waitForSelector(Constants.MacroDesignerIFrameChild)).contentFrame();
    await iframeChild.click(Constants.StartMacroExecutionBtn);
    await iframeChild.click(Constants.NewStepBtn);
    await iframeChild.click(Constants.RefreshSessionContext);
    await iframeChild.click(Constants.NewStepBtn);
    await iframeChild.click(Constants.ActionToResolveCase);
    await iframeChild.fill(Constants.IncidentIdInputField, params[0]);
    await iframeChild.fill(Constants.BillableTimeInputField, Constants.Ten);
    await iframeChild.fill(Constants.ResolutionInputField, Constants.CaseResolution);
    await iframeChild.click(Constants.NewStepBtn);
    await iframeChild.click(Constants.GetCurrentTab);
    await iframeChild.click(Constants.NewStepBtn);
    await iframeChild.click(Constants.RefreshTab);
    await iframeChild.click(Constants.TabId);
    // Time Delay to load the page
    await iframeChild.waitForSelector(Constants.SelectTabId,{timeout:4000});
    await iframeChild.click(Constants.SelectTabId);
    await iframeParent.click(Constants.SaveAndCloseButton2);
    // Time Delay to load the page
    await this.adminPage.waitForTimeout(4000);
  }

  public async AgentScriptInCSAdminCenter(AgentScriptName:any, UniqueName:any){
    await this.adminPage.click(Constants.ProductivitySiteMap);
    await this.adminPage.click(Constants.ManagedAgentScript);
    await this.adminPage.click(Constants.NewButton);
    await this.adminPage.fill(Constants.NameField, AgentScriptName);
    await this.adminPage.fill(Constants.UniqueNameField, UniqueName);
    // Time Delay to load the page
    await this.adminPage.waitForTimeout(2000);
    await this.adminPage.click(Constants.Language);
    (await this.adminPage.$(Constants.Language))?.selectOption(Constants.SelectEnglishLanguage);
    await this.adminPage.keyboard.press("Tab");
    await this.adminPage.click(Constants.Save);
    // Time Delay to load the page
    await this.adminPage.waitForTimeout(4000);
  }

  public async AgentScriptStep(AgentScriptStep:any, UniqueName:any, MacroName:any){
    await this.adminPage.click(Constants.AgentScriptStepTitle);
    await this.adminPage.click(Constants.NewAgentScriptStep);
    // Time Delay to load the page
    await this.adminPage.waitForTimeout(3000);
    await this.adminPage.fill(Constants.NameField, AgentScriptStep);
    await this.adminPage.fill(Constants.UniqueNameField, UniqueName);
    // Time Delay to load the page
    await this.adminPage.waitForTimeout(2000);
    await this.adminPage.fill(Constants.AgentscriptStepOrderfield, Constants.AgentscriptStepOrder,{timeout:2000});
    await this.adminPage.click(Constants.ActionType);
    await this.adminPage.keyboard.press("ArrowDown");
    await this.adminPage.keyboard.press("ArrowDown");
    await this.adminPage.keyboard.press("Enter");
    await this.adminPage.fill(Constants.TargetMacro,MacroName);
    // Time Delay to load the page
    await this.adminPage.waitForTimeout(2000);
    await this.adminPage.click(Constants.SearchResultForMacro);
    await this.adminPage.click(Constants.SaveAndCloseButton);
    // Time Delay to load the page
    await this.adminPage.waitForTimeout(4000);
  }

  public async SessionInCSAdminCenter(SessionName:any,UniqueName:any){
    await this.adminPage.click(Constants.WorkspaceSiteMap);
    await this.adminPage.click(Constants.ManagedSession);
    await this.adminPage.click(Constants.NewButton);
    await this.adminPage.fill(Constants.NameField, SessionName);
    await this.adminPage.fill(Constants.UniqueNameField,UniqueName);
    await this.adminPage.click(Constants.EntityRequiredField);
    await this.adminPage.click(Constants.Case);
    await this.adminPage.click(Constants.Save);
    // Time Delay to load the page
    await this.adminPage.waitForTimeout(4000);
  }

  public async AddAgentScriptToSession(AgentScript:any){
    await this.adminPage.click(Constants.Agentscripts);
    await this.adminPage.click(Constants.MoreCommandsForAgentScript);
    await this.adminPage.click(Constants.AddExistingAgentScriptsBtn);
    await this.adminPage.fill(Constants.LookForRecordsField, AgentScript);
    await this.adminPage.click(Constants.AgentScriptNameSearchResult);
    await this.adminPage.keyboard.press("ArrowDown");
    await this.adminPage.keyboard.press("Enter");
    await this.adminPage.click(Constants.Add);
    await this.adminPage.click(Constants.SaveAndCloseButton);
  }

  public async AddSessionToProfile(SessionName:any){
    await this.adminPage.click(Constants.AddEntitySessionTemplate);
    await this.adminPage.click(Constants.ButtonToAddEntity);
    await this.adminPage.click(Constants.EntitySessionField);
    await this.adminPage.click(Constants.Case);
    await this.adminPage.click(Constants.SessionTemplateField);
    await this.adminPage.click(SessionName);
    await this.adminPage.click(Constants.AddSessionToProfile);
    await this.adminPage.click(Constants.SaveAndCloseBtn);
  }

  public async RunMacro(){
    await this.adminPage.click(Constants.MacroRunButton);
    // Time Delay to load the page
    await this.adminPage.waitForTimeout(2000);
  }

  public async DeleteSession(page: Page, startPage:any, SessionName:any){
    await this.openAppLandingPage(page);
    await startPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    await page.click(Constants.WorkspaceSiteMap);
    await page.click(Constants.ManagedSession);
    await page.click(Constants.SearchBox);
    await page.fill(Constants.SearchBox,SessionName);
    await page.click(Constants.SearchTheView);
    await page.click(Constants.SelectAllTheRowsBtn);
    await page.click(Constants.DeleteButton);
    await page.click(Constants.ConfirmDelete);
  }

  public async DeleteAppProfile(page: Page, startPage:any, SessionName:any){
    await this.openAppLandingPage(page);
    await startPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    await page.click(Constants.WorkspaceSiteMap);
    await page.click(Constants.ManageAgentExperience);
    await page.click(Constants.SearchAppProfile);
    await page.fill(Constants.SearchAppProfile,SessionName);
    await page.click(Constants.SelectProfile);
    await page.click(Constants.DeleteCase);
    await page.click(Constants.ConfirmDelete);
  }

  public async CreateCloneCurrentMacro(macroName: string, ...params: any[]){
    await this.adminPage.waitForSelector(Constants.AgentExperience);
    await this.adminPage.click(Constants.AgentExperience);
    await this.adminPage.waitForSelector(Constants.ManageMacros);
    await this.adminPage.click(Constants.ManageMacros);
    await this.adminPage.click(Constants.NewButton);
    await this.adminPage.fill(Constants.NameField, macroName);
    const iframeParent = await (await this.adminPage.waitForSelector(Constants.MacroDesignerIFrame)).contentFrame();
    const iframeChild = await (await iframeParent.waitForSelector(Constants.MacroDesignerIFrameChild)).contentFrame();
    await iframeChild.click(Constants.StartMacroExecutionBtn);
    await iframeChild.click(Constants.NewStepBtn);
    await iframeChild.click(Constants.CurrentRecord);
    // Time Delay to load the page
    await iframeChild.waitForSelector(Constants.RecordTitle,{timeout:4000});
    await iframeChild.click(Constants.RecordTitle);
    await this.adminPage.keyboard.press("Enter");
    await iframeChild.fill(Constants.RecordTitle,params[0]);
    await iframeParent.click(Constants.SaveAndCloseButton2);
    // Time Delay to load the page
    await this.adminPage.waitForTimeout(4000);
  }

  public async SiteMapInAppDesigner(){
    let contexts= await browser.contexts();
    let pages =await contexts[1].pages();
    pages[1].bringToFront();
    await pages[1].click(Constants.SiteMapInAppDesigner);
    await pages[1].click(Constants.ConfirmOk);
    // Time Delay to load the page
    await this.adminPage.waitForTimeout(2000);
    }

  public async ValidateAppDesigner(ValidateEntity:any){
    let contexts= await browser.contexts();
    let pages =await contexts[1].pages();
    pages[1].bringToFront();
    // Time Delay to load the page
    await pages[1].waitForSelector(ValidateEntity,{timeout:3000});
    const PageValidate = await pages[1].isVisible(ValidateEntity);
    expect(PageValidate).toBeTruthy();
  }

  public async GoToLandingPage(){
    let contexts= await browser.contexts();
    let pages =await contexts[1].pages();
    pages[0].bringToFront();
    // Time Delay to load the page
    await this.adminPage.waitForTimeout(2000);
  }

  public async OpenSiteMapInCSW(){
    await this.adminPage.click(Constants.CSWSitemapBtn);
    // Time Delay to load the page
    await this.adminPage.waitForTimeout(2000);
  }

  public async openClosedWorkItems(){
    await this.adminPage.click(Constants.MoreOptions);
    await this.adminPage.keyboard.press("Enter");
  }
  public async createChannel() { 
    await this.adminPage.click(Constants.ChannelEditBtn);
    await this.adminPage.click(Constants.CreateChannel);
    await this.adminPage.fill(Constants.NameOfChannel,Constants. ChannelName);
    await this.adminPage.fill(Constants.UniqueNameField,Constants. UniqueName);
    await this.adminPage.fill(Constants.Label,Constants.LabelNum);
    await this.adminPage.fill( Constants.ChannelUrl,Constants.ThirdPartyUrlValue );
    await this.adminPage.fill( Constants.ChannelOrder,Constants.Order);
    await this.adminPage.click(Constants.SaveAndCloseButton);
    await this.adminPage.waitForTimeout(4000);
  }

  public async thirdPartyChannel() { 
    await this.adminPage.click(Constants.ChannelEditBtn);
    await this.adminPage.click(Constants.ChannelDropDown);
    await this.adminPage.click(Constants.SelectChannel);
    await this.adminPage.click(Constants.SaveAndCloseBtn2);
    await this.adminPage.waitForTimeout(4000);
  }
  
  public async ocDefaultAppProfile(){
    await this.adminPage.click(Constants.WorkspaceSiteMap);
    await this.adminPage.click(Constants.ManageAgentExperienceProfile);
    await this.adminPage.click(Constants.OmnichannelforCustomerServicedefaultprofile);   
  }

  public async cswDefaultAppProfile(){
    await this.adminPage.click(Constants.WorkspaceSiteMap);
    await this.adminPage.click(Constants.ManageAgentExperienceProfile);
    await this.adminPage.click(Constants.CustomerServiceworkspacedefaultprofile);
    await this.adminPage.click(Constants.EntitySession);
  }

  public async cswDefaultChannelAppProfile(){
    await this.adminPage.click(Constants.WorkspaceSiteMap);
    await this.adminPage.click(Constants.ManageAgentExperienceProfile);
    await this.adminPage.click(Constants.CustomerServiceworkspacechannelsdefaultprofile);
    await this.adminPage.click(Constants.EntitySession);
  }

  public async cswDefaultProductivityPane(){
    await this.adminPage.click(Constants.WorkspaceSiteMap);
    await this.adminPage.click(Constants.ManageAgentExperienceProfile);
    await this.adminPage.click(Constants.CustomerServiceworkspacechannelsdefaultprofile);
    await this.adminPage.click(Constants.ProductivityPaneDefaultMode);
  }

  public async cswDefaultChannel(){
    await this.adminPage.click(Constants.WorkspaceSiteMap);
    await this.adminPage.click(Constants.ManageAgentExperienceProfile);
    await this.adminPage.click(Constants.CustomerServiceworkspacechannelsdefaultprofile);
    await this.adminPage.click(Constants.ChannelProvider);
  }

  public async casesLinkedToQueue(queue :any){
    await this.adminPage.click(Constants.CSWSitemapBtn);
    await this.adminPage.click(Constants.Queues);
    await this.adminPage.click(Constants.ItemsDropDown);
    await this.adminPage.click(Constants.AllItems);
    await this.adminPage.click(Constants.SelectQueueFilter);
    await this.adminPage.click(Constants.AllQueues);
    await this.adminPage.click(queue,{modifiers:['Control']});
    await this.adminPage.waitForTimeout(1000);
  }

  public async initiateNewContactTab(agentChat:any){
    await agentChat.waitForSelector(Constants.ClickNewContactBtn);
    await agentChat.click(Constants.ClickNewContactBtn);
    await agentChat.waitForTimeout(4000);
  }

  public async changeValueOfalwaysRender(){
    await this.adminPage.click(Constants.ValueTextBox);
    await this.adminPage.waitForSelector(Constants.ValueTextInputBox);
    await this.adminPage.fill(Constants.ValueTextInputBox, Constants.ValueAsTrue);
    await this.adminPage.click(Constants.SaveEmailBtn);
  }
} 