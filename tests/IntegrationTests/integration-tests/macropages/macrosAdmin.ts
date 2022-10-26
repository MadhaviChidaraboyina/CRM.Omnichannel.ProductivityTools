import { IFrameConstants, IFrameHelper } from "../../Utility/IFrameHelper";
import { AgentChat } from "../../pages/AgentChat";
import { Page } from "playwright";
import { Constants, EntityAttributes, EntityNames } from "../common/constants";
import { OrgDynamicsCrmStartPage } from "../../pages/org-dynamics-crm-start.page";
import { TestSettings } from "../../configuration/test-settings";
import { AgentChatConstants, stringFormat } from "../../Utility/Constants";
import { Util } from "../../Utility/Util";
import { LogChatDetails } from "../../helpers/log-helper";
import { BasePage } from "../../pages/BasePage";
import { MacrosConstants } from "pages/Macros";

export class Macros extends BasePage {
  adminPage: any;
  constructor(page: Page) {
    super(page)
    this.adminPage = page;
  }

  public async createMacro(macroName: string, ...params: any[]) {
    await this.adminPage.click(Constants.ProductivitySiteMap);
    await this.adminPage.waitForSelector(Constants.ManageMacros, {
      timeout: 10000,
    });
    await this.adminPage.click(Constants.ManageMacros);
    await this.adminPage.click(Constants.NewButton);
    await this.adminPage.fill(Constants.NameField, macroName);
    const iframeParent = await (
      await this.adminPage.waitForSelector(Constants.MacroDesignerIFrame)
    ).contentFrame();
    const iframeChild = await (
      await iframeParent.waitForSelector(Constants.MacroDesignerIFrameChild)
    ).contentFrame();
    await iframeChild.click(Constants.StartMacroExecutionBtn);
    await iframeChild.click(Constants.NewStepBtn);
    switch (macroName) {
      case Constants.OpenAccountGrid:
        await iframeChild.click(Constants.OpenRecordGrid);
        await iframeChild.fill(
          Constants.EntityLogicalNameField,
          Constants.EntityLogicalNameAccount
        );
        await iframeChild.fill(Constants.ViewIDField, Constants.ViewID);
        await iframeChild.fill(Constants.ViewTypeField, Constants.ViewType);
        break;

      case Constants.DoRelevanceSearch:
        await iframeChild.click(Constants.DoARelevanceSearchBasedOnThePhrase);
        await iframeChild.fill(
          Constants.SearchStringField,
          Constants.SearchString
        );
        break;

      case Constants.ResolveCase:
        await iframeChild.click(Constants.ActionToResolveCase);
        await iframeChild.fill(Constants.BillableTimeInputField, Constants.Ten);
        await iframeChild.fill(Constants.IncidentIdInputField, params[0]);
        await iframeChild.fill(
          Constants.ResolutionInputField,
          Constants.CaseResolution
        );
        break;

      case Constants.UpdateAccount:
        await iframeChild.click(Constants.UpdateAnExistingRecord);
        await iframeChild.fill(
          Constants.EntityLogicalNameField,
          Constants.EntityLogicalNameIncident
        );
        await this.checkAndCloseDynamicContentPopUp(iframeChild);
        await iframeChild.fill(Constants.EntityRecordIdInputField, params[0]);
        await this.checkAndCloseDynamicContentPopUp(iframeChild);
        await iframeChild.click(Constants.ShowAdvancedOptions);
        await iframeChild.fill(
          Constants.AttributeName1InputField,
          Constants.AttributeNameDescription
        );
        await iframeChild.fill(
          Constants.AttributeValue1InputField,
          Constants.AttributeValueDescription
        );
        break;

      case Constants.OpenKBSearch:
        await iframeChild.click(Constants.SearchKnowledgeArticleBasedOnPhrase);
        await iframeChild.fill(
          Constants.SearchStringField,
          Constants.SearchString
        );
        break;

      case Constants.OpenKbArticle:
        await iframeChild.click(Constants.OpenKnowledgeBaseArticle);
        await iframeChild.fill(Constants.EntityRecordIdField, params[0]);
        break;

      case Constants.OpenNewAccount:
        await iframeChild.click(Constants.OpenNewForm);
        await iframeChild.fill(
          Constants.EntityLogicalNameField,
          Constants.EntityLogicalNameAccount
        );
        break;

      case Constants.OpenExistingRecord:
        await iframeChild.click(Constants.OpenExistingRecordForm);
        await iframeChild.fill(Constants.EntityRecordIDField, params[0]);
        await iframeChild.fill(
          Constants.EntityLogicalNameField,
          Constants.EntityLogicalNameIncident
        );
        break;

      case Constants.OpenDashboard:
        await iframeChild.click(Constants.OpenApplicationTab);
        await iframeChild.fill(
          Constants.PageTypeInputField,
          Constants.Dashboard
        );
        await this.checkAndCloseDynamicContentPopUp(iframeChild);
        await iframeChild.fill(
          Constants.ApplicationTemplateIdInputField,
          params[0]
        );
        await this.checkAndCloseDynamicContentPopUp(iframeChild);
        await iframeChild.click(Constants.ShowAdvancedOptions);
        await iframeChild.fill(
          Constants.AttributeName1InputField,
          Constants.AttributeNameDashboard
        );
        await iframeChild.fill(Constants.AttributeValue1InputField, params[1]);
        break;

      case Constants.OpenEntityList:
        await iframeChild.click(Constants.OpenApplicationTab);
        await iframeChild.fill(
          Constants.PageTypeInputField,
          Constants.EntityList
        );
        await this.checkAndCloseDynamicContentPopUp(iframeChild);
        await iframeChild.fill(
          Constants.ApplicationTemplateIdInputField,
          params[0]
        );
        await this.checkAndCloseDynamicContentPopUp(iframeChild);
        await iframeChild.click(Constants.ShowAdvancedOptions);
        await iframeChild.fill(
          Constants.AttributeName1InputField,
          Constants.EntityName
        );
        await iframeChild.fill(
          Constants.AttributeValue1InputField,
          Constants.EntityLogicalNameIncident
        );
        break;

      case Constants.OpenWebResource:
        await iframeChild.click(Constants.OpenApplicationTab);
        await iframeChild.fill(
          Constants.PageTypeInputField,
          Constants.WebResource
        );
        await this.checkAndCloseDynamicContentPopUp(iframeChild);
        await iframeChild.fill(
          Constants.ApplicationTemplateIdInputField,
          params[0]
        );
        await this.checkAndCloseDynamicContentPopUp(iframeChild);
        await iframeChild.click(Constants.ShowAdvancedOptions);
        await iframeChild.fill(
          Constants.AttributeName1InputField,
          Constants.WebResourceName
        );
        await iframeChild.fill(
          Constants.AttributeValue1InputField,
          Constants.WebResourceValue
        );
        break;

      case Constants.OpenControl:
        await iframeChild.click(Constants.OpenApplicationTab);
        await iframeChild.fill(Constants.PageTypeInputField, Constants.Control);
        await this.checkAndCloseDynamicContentPopUp(iframeChild);
        await iframeChild.fill(
          Constants.ApplicationTemplateIdInputField,
          params[0]
        );
        await this.checkAndCloseDynamicContentPopUp(iframeChild);
        await iframeChild.click(Constants.ShowAdvancedOptions);
        await iframeChild.fill(
          Constants.AttributeName1InputField,
          Constants.AttributeNameControl
        );
        await iframeChild.fill(
          Constants.AttributeValue1InputField,
          Constants.AttributeValueControl
        );
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
        await iframeChild.fill(
          Constants.ApplicationTemplateIdInputField,
          params[0]
        );
        await this.checkAndCloseDynamicContentPopUp(iframeChild);
        await iframeChild.click(Constants.ShowAdvancedOptions);
        await iframeChild.fill(
          Constants.AttributeName1InputField,
          Constants.AttributeNameControl
        );
        await iframeChild.fill(
          Constants.AttributeValue1InputField,
          Constants.AttributeValueControl
        );
        break;

      case Constants.ExistingRecord:
        await iframeChild.click(Constants.OpenExistingRecordForm);
        await iframeChild.fill(Constants.EntityLogicalName, Constants.Account);
        await this.checkAndCloseDynamicContentPopUp(iframeChild);
        await iframeChild.fill(Constants.EntityRecordID, params[0]);
        break;

      case Constants.CreateDraftEmail:
        await iframeChild.click(Constants.OpenDraftEmailForm);
        await iframeChild.fill(Constants.CaseEmailTemplateId, params[0]);
        await iframeChild.fill(Constants.EntityRecordIDField, params[1]);
        await iframeChild.fill(
          Constants.EmailRecipientsField,
          Constants.EmailID
        );
        await iframeChild.fill(
          Constants.EntityLogicalNameField,
          Constants.EntityLogicalNameIncident
        );
        break;

      case Constants.AutoFillFieldsWithData:
        await iframeChild.click(Constants.OpenNewForm);
        await iframeChild.fill(
          Constants.EntityLogicalNameField,
          Constants.EntityLogicalNameAccount
        );
        await iframeChild.click(Constants.NewStepBtn);
        await iframeChild.click(Constants.AutofillDataForm);
        await iframeChild.fill(
          Constants.EntityLogicalNameField,
          Constants.EntityLogicalNameAccount
        );
        await iframeChild.click(Constants.ShowAdvancedOptions);
        await iframeChild.fill(
          Constants.AttributeName1InputField,
          Constants.AttributeNameValue
        );
        await iframeChild.fill(
          Constants.AttributeValue1InputField,
          Constants.AttributeValue
        );
        break;

      case Constants.ThirdPartyWebsiteAppTabName:
        await iframeChild.click(Constants.OpenApplicationTab);
        await iframeChild.fill(
          Constants.PageTypeInputField,
          Constants.ThirdPartyWebsitePage
        );
        await this.checkAndCloseDynamicContentPopUp(iframeChild);
        await iframeChild.fill(
          Constants.ApplicationTemplateIdInputField,
          params[0]
        );
        await this.checkAndCloseDynamicContentPopUp(iframeChild);
        await iframeChild.click(Constants.ShowAdvancedOptions);
        await iframeChild.fill(
          Constants.AttributeName1InputField,
          Constants.ThirdPartyUrl
        );
        await iframeChild.fill(
          Constants.AttributeValue1InputField,
          Constants.ThirdPartyUrlValue
        );
        break;

      case Constants.SearchPhraseForPopulatedPhrase:
        await iframeChild.click(Constants.SearchPhraseForPopulatedPhraseMacro);
        await iframeChild.fill(
          Constants.SearchPhraseStringField,
          Constants.SearchPhraseValue
        );
        break;

      case Constants.OpenRefreshTab:
        await iframeChild.click(Constants.GetCurrentTab);
        await iframeChild.click(Constants.NewStepBtn);
        await iframeChild.click(Constants.RefreshTab);
        await iframeChild.click(Constants.TabId);
        await iframeChild.waitForSelector(Constants.SelectTabId, {
          timeout: 4000,
        });
        await iframeChild.click(Constants.SelectTabId);
        break;

      case Constants.LinkRecordMacro:
        await iframeChild.click(Constants.OmnichannelConnector);
        await iframeChild.click(Constants.LinkRecord);
        await iframeChild.fill(
          Constants.EntityLogicalNameField,
          Constants.EntityLogicalNameAccount
        );
        await iframeChild.fill(
          Constants.EntityPrimaryNameField,
          Constants.EntityPrimaryName
        );
        await iframeChild.fill(Constants.EntityRecordIdInput, params[0]);
        break;

      case Constants.UnlinkRecordMacro:
        await iframeChild.click(Constants.OmnichannelConnector);
        await iframeChild.click(Constants.UnlinkRecord);
        await iframeChild.fill(
          Constants.EntityLogicalNameField,
          Constants.EntityLogicalNameAccount
        );
        await iframeChild.fill(
          Constants.EntityPrimaryNameField,
          Constants.EntityPrimaryName
        );
        await iframeChild.fill(Constants.EntityRecordIdInput, params[0]);
        break;
    }
    await iframeParent.click(Constants.SaveAndCloseButton2);
    await this.adminPage.waitForTimeout(3000);
  }

  public async deleteMacro(startPage: any, macroName: string) {
    try {
      await this.openAppLandingPage(this.adminPage);
      await startPage.goToMyApp(Constants.CustomerServiceAdminCenter);
      await this.adminPage.click(Constants.ProductivitySiteMap);
      await this.adminPage.waitForSelector(Constants.ManageMacros, {
        timeout: 10000,
      });
      await this.adminPage.click(Constants.ManageMacros);
      await this.adminPage.fill(
        Constants.ProcessSearchThisViewInputField,
        macroName
      );
      await this.adminPage.click(Constants.SearchThisViewStartBtn);
      await this.adminPage.click(Constants.RefreshBtn);
      await this.adminPage.waitForSelector(Constants.SelectAllRowsBtn, {
        timeout: 10000,
      });
      await this.adminPage.click(Constants.SelectAllRowsBtn);
      await this.adminPage.click(Constants.DeleteButton);
      await this.adminPage.click(Constants.ConfirmDelete);
    } catch (error) {
      console.log(`Delete Macro failed with error: ${error.message}`);
    }
  }

  public async deleteApplicationTab(startPage: any, applicationTabName: string) {
    try {
      await this.openAppLandingPage(this.adminPage);
      await startPage.goToMyApp(Constants.CustomerServiceAdminCenter);
      await this.adminPage.click(Constants.WorkspaceSiteMap);
      await this.adminPage.waitForSelector(Constants.ManageApplicationTab, {
        timeout: 10000,
      });
      await this.adminPage.click(Constants.ManageApplicationTab);
      await this.adminPage.fill(
        Constants.SearchThisViewInputField,
        applicationTabName
      );
      await this.adminPage.click(Constants.SearchThisViewStartBtn);
      await this.adminPage.click(Constants.RefreshBtn);
      await this.adminPage.waitForSelector(Constants.SelectAllRowsBtn, {
        timeout: 10000,
      });
      await this.adminPage.click(Constants.SelectAllRowsBtn);
      await this.adminPage.click(Constants.DeleteButton);
      await this.adminPage.click(Constants.ConfirmDeleteButton);
    } catch (error) {
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
    await iframeCC.$eval(Constants.EndConversationButtonXPath, (el) =>
      (el as HTMLElement).click()
    );
    await iframeCC.waitForSelector(
      Constants.EndConversationButtonDisabledXPath
    );
    await page.$eval(Constants.RemoveConversationButtonClass, (el) =>
      (el as HTMLElement).click()
    );
  }

  public async loginAsAdminAndOpenOmnichannelAdministration(adminStartPage: any) {
    await adminStartPage.navigateToOrgUrlAndSignIn(
      TestSettings.AdminAccountEmail,
      TestSettings.AdminAccountPassword
    );
    await adminStartPage.goToOmnichannelAdministration();
  }

  public async initiateLiveChatWithAgent(liveChatPage: any) {
    await liveChatPage.open(TestSettings.LCWUrl);
    await liveChatPage.initiateChat();
    await liveChatPage.sendMessage("Hi", "en");
  }

  public async initiateLiveChatWithMacroAgent(liveChatPage) {
    await liveChatPage.open(TestSettings.MacroBloburl);
    await liveChatPage.initiateChat();
    await liveChatPage.sendMessage("Hi", "en");
  }

  public async loginAsAgentAndOpenOmnichannelForCS(agentAccountEmail, agentStartPage: OrgDynamicsCrmStartPage, agentChat: AgentChat) {
    await agentStartPage.navigateToOrgUrlAndSignIn(
      agentAccountEmail,
      TestSettings.AgentAccountPassword
    );
    await agentStartPage.goToOmnichannelForCustomers();
    // await agentChat.waitForAgentStatusIcon();
    // await agentChat.waitForAgentStatus();
    // await agentChat.setAgentStatusToAvailable();
  }

  public async waitUntilSelectorIsVisible(selectorVal: string, maxCount = 3, page: Page = null, timeout: number = Constants.DefaultTimeout) {
    let dataCount = 0;
    let pageObject = page ?? this.adminPage;
    while (dataCount < maxCount) {
      try {
        await pageObject.waitForSelector(selectorVal, { timeout });
        return true;
      } catch {
        dataCount++;
      }
    }
    return false;
  }


  public async waitForConversationControl() {
    const iframeCC = await IFrameHelper.GetIframe(
      this.adminPage,
      IFrameConstants.IframeCC
    );
    const endBtnLoadFlag = await this.waitUntilSelectorIsVisible(
      AgentChatConstants.EndConversationButtonXPath,
      AgentChatConstants.Ten,
      iframeCC,
      AgentChatConstants.FiveThousandsMiliSecondsWaitTimeout
    );
    const chatInputBoxLoadFlag = await this.waitUntilSelectorIsVisible(
      AgentChatConstants.MessageTextArea,
      AgentChatConstants.Ten,
      iframeCC,
      AgentChatConstants.FiveThousandsMiliSecondsWaitTimeout
    );
    return endBtnLoadFlag && chatInputBoxLoadFlag;
  }

  public async acceptInvitationToChat(
    timeout?: number,
    shouldwaitForConversationControl: boolean = true
  ) {
    await this.adminPage.click(AgentChatConstants.AcceptButtonId);
    if (shouldwaitForConversationControl)
      await this.waitForConversationControl();
    await LogChatDetails(
      this.adminPage,
      "Accept Invitation to Chat",
      "after accept chat"
    );
  }


  public async acceptLiveChatAsAgent(liveChatPage: any, agentChat: AgentChat) {
    await liveChatPage.getUniqueChat(liveChatPage, agentChat);
  }

  public async getUniqueChat(
    senderPage,
    receiverPage,
    uniqueInitialMessage?: string
  ) {
    const sentMessage = uniqueInitialMessage
      ? uniqueInitialMessage
      : Util.newGuid();
    await senderPage.sendMessage(sentMessage);
    await receiverPage.acceptChat(sentMessage);
  }

  public async createCaseAndGetIncidentId() {
    await this.adminPage.click(Constants.CasesSitemapBtn);
    await this.adminPage.click(Constants.NewCaseBtn);
    await this.adminPage.fill(
      Constants.CaseTitleInputField,
      Constants.AutomationCaseTitle
    );
    await this.adminPage.click(Constants.CutomerSearchIcon);
    await this.adminPage.click(Constants.CustomerLooupResult);
    await this.adminPage.click(Constants.SaveButton);
    await this.adminPage.click(Constants.RefreshBtn);
    return this.getAppIdFromUrl(await this.adminPage.url());
  }

  public async getIdFromUrl(url: any) {
    const params = url.split("?")[1].split("&");
    for (let element of params) {
      const pair = element.split("=");
      if (pair[0] === "id") {
        return pair[1];
      }
    }
  }

  public async getAppIdFromUrl(url: string) {
    const params = url.split("?")[1].split("&");
    for (let element of params) {
      const pair = element.split("=");
      if (pair[0] === "appid") {
        return pair[1];
      }
    }
  }

  public async createKbArticleAndGetId() {
    await this.adminPage.click(Constants.KnowledgeArticleSitemapBtn);
    await this.adminPage.click(Constants.NewArticleBtn);
    await this.adminPage.fill(
      Constants.KnowledgeArticlInputField,
      Constants.KnowledgeArticleTitle
    );
    await this.adminPage.click(Constants.SaveKbBtn);
    await this.adminPage.click(Constants.MoreCommandsForKnowledgeArticle);
    await this.adminPage.click(Constants.PublishKbSubGrid);
    await this.adminPage.click(Constants.PublishBtn);
    return this.getAppIdFromUrl(await this.adminPage.url());
  }

  public async createAccountAndGetAccountId(accountName: string) {
    await this.adminPage.click(Constants.AccountSitemapBtn);
    await this.adminPage.click(Constants.NewAccountBtn);
    await this.adminPage.fill(Constants.AccountNameInputField, accountName);
    await this.adminPage.click(Constants.SaveButton);
    await this.adminPage.click(Constants.ThreeDots);
    await this.adminPage.click(Constants.RefreshBtn);
    return this.getAppIdFromUrl(await this.adminPage.url());
  }

  public async deleteAccountLinkUnlink(
    adminPage: Page,
    adminStartPage: any,
    accountName: string
  ) {
    await this.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
    await this.adminPage.click(Constants.AccountsSitemapBtn);
    await this.adminPage.fill(
      Constants.AccountSearchThisViewInputField,
      accountName
    );
    await this.adminPage.click(Constants.SearchThisViewStartBtn);
    await this.adminPage.click(Constants.RefreshBtn);
    await this.adminPage.waitForSelector(Constants.SelectAllRowsBtn, {
      timeout: 10000,
    });
    await this.adminPage.click(Constants.SelectAllRowsBtn);
    await this.adminPage.click(Constants.DeleteButton);
    await this.adminPage.click(Constants.ConfirmDeleteButton);
  }

  public async openAppLandingPage(page: Page) {
    await page.waitForLoadState("domcontentloaded");
    await page.waitForSelector(Constants.LandingPage)
    await page.click(Constants.LandingPage);
  }

  public async verifyResolveCase(adminPage: Page, adminStartPage: any) {
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
    } catch {
      return false;
    }
  }

  public async deleteCase(page: Page, startPage: any, caseName: string) {
    await this.openAppLandingPage(page);
    await startPage.goToMyApp(Constants.CustomerServiceHub);
    await page.click(Constants.CasesSitemapBtn);
    await page.click(Constants.ViewSelector);
    await page.click(Constants.AllCasesView);
    await page.fill(Constants.SearchBox, caseName);
    await page.waitForLoadState("domcontentloaded");
    await page.click(Constants.SearchThisViewStartBtn);
    await page.waitForLoadState("domcontentloaded");
    await page.click(Constants.SelectAllRowsBtn);
    await page.click(Constants.DeleteButton);
    await page.click(Constants.ConfirmDelete);
    await page.waitForSelector(Constants.SearchBox);
  }

  public async deleteAllCase(caseName: string) {
    await page.click(Constants.CasesSitemapBtn);
    await page.click(Constants.ViewSelector);
    await page.click(Constants.AllCasesView);
    await page.fill(Constants.SearchBox, caseName);
    await page.click(Constants.SearchThisViewStartBtn);
    await page.click(Constants.SelectAllRowsBtn);
    await page.click(Constants.DeleteButton);
    await page.click(Constants.ConfirmDelete);
  }

  public async deleteKbArticle(page: Page, startPage: any, kbArticleName: string) {
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

  public async verifyUpdateAccount(adminPage: Page, adminStartPage: any, caseName: string) {
    await this.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
    await adminPage.click(Constants.CasesSitemapBtn);
    await adminPage.click(Constants.ViewSelector);
    await adminPage.click(Constants.AllCasesView);
    await adminPage.fill(Constants.SearchBox, caseName);
    await adminPage.click(Constants.SearchThisViewStartBtn);
    await adminPage.click(Constants.AutomationCaseLink);
    const desription = await (
      await adminPage.waitForSelector(Constants.CaseDescription)
    ).textContent();
    return desription === Constants.AttributeValueDescription ? true : false;
  }

  public async checkAndCloseDynamicContentPopUp(page: Page) {
    try {
      await page.waitForSelector(Constants.DynamicContentPopUpActive, {
        timeout: 1000,
      });
      await page.click(Constants.AddDynamiceContentBtn);
    } catch (error) {
      console.log(`No dynamic content pop up`);
    }
  }

  public async getDashboardId() {
    await this.adminPage.click(Constants.DashboardsStemapBtn);
    return this.getAppIdFromUrl(await this.adminPage.url());
  }

  public async createAccountAndGetId(name: string) {
    await this.adminPage.click(Constants.AccountsSitemapBtn);
    await this.adminPage.click(Constants.NewButton);
    await this.adminPage.click(Constants.AccountFieldName);
    await this.adminPage.fill(Constants.AccountFieldName, name);
    await this.adminPage.keyboard.press("Tab");
    await this.adminPage.click(Constants.SaveButton);
    return this.getAppIdFromUrl(await this.adminPage.url());
  }

  public async createApplicationTabAndGetId(
    name: string,
    uniqueName: string,
    pageTypeOptionValue: string
  ) {
    let rnd: any;
    rnd = this.getRandomNumber();
    await this.adminPage.click(Constants.WorkspaceSiteMap);
    await this.adminPage.waitForTimeout(4000);
    await this.adminPage.click(Constants.ManageApplicationTab);
    await this.adminPage.click(Constants.NewButton);
    await this.adminPage.fill(Constants.NameField, name);
    await this.adminPage.fill(Constants.UniqueNameField, uniqueName + rnd);
    await this.adminPage.fill(Constants.TitleInputField, name);
    await this.adminPage.click(Constants.PageTypeDropdown);
    (await this.adminPage.$(Constants.PageTypeDropdown))?.selectOption(
      pageTypeOptionValue
    );
    await this.adminPage.keyboard.press("Tab");
    await this.adminPage.click(Constants.SaveButton);
    await this.adminPage.click(Constants.RefreshBtn);
    return this.getIdFromUrl(await this.adminPage.url());
  }

  public async verifyOpenedTab(page: Page, tabName: string) {
    try {
      await page.waitForSelector(tabName);
      return true;
    } catch {
      return false;
    }
  }

  public async InsertParametersInSearchApplicationTab(
    startPage: any,
    EntitySearchApplicationTab: string
  ) {
    await this.openAppLandingPage(this.adminPage);
    await startPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    await this.adminPage.click(Constants.WorkspaceSiteMap);
    //Time delay for loading Manage Application Tab
    await this.adminPage.waitForTimeout(4000);
    await this.adminPage.click(Constants.ManageApplicationTab);
    await this.adminPage.fill(
      Constants.SearchThisViewInputField,
      EntitySearchApplicationTab
    );
    await this.adminPage.click(Constants.SearchThisViewStartBtn);
    await this.adminPage.click(Constants.RefreshBtn);
    await this.adminPage.click(Constants.GetSearchApplicationTab);
    //Time delay for Search Text Box
    await this.adminPage.waitForTimeout(4000);
    await this.adminPage.click(Constants.SearchTextBox);
    //Time delay for Search Text Input Box
    await this.adminPage.waitForTimeout(4000);
    await this.adminPage.waitForSelector(Constants.SearchTextInputBox);
    await this.adminPage.fill(
      Constants.SearchTextInputBox,
      Constants.SearchTextValue
    );
    await this.adminPage.click(Constants.SearchTypeBox);
    await this.adminPage.fill(
      Constants.SearchTypeInputBox,
      Constants.SearchTypeValue
    );
    //Time delay for Save EmailBtn
    await this.adminPage.waitForTimeout(4000);
    await this.adminPage.click(Constants.SaveEmailBtn);
  }

  public async deactivateMacro(macroName: string) {
    try {
      await this.adminPage.click(Constants.ProductivitySiteMap);
      await this.adminPage.waitForTimeout(4000);
      await this.adminPage.click(Constants.ManageMacros);
      await this.adminPage.click(Constants.ViewSelector);
      await this.adminPage.click(Constants.ActiveMacrosView);
      await this.adminPage.click(Constants.SearchMacroBtn);
      await this.adminPage.fill(Constants.SearchThisViewInputField, macroName);
      await this.adminPage.click(Constants.SearchThisViewStartBtn);
      await this.adminPage.click(Constants.RefreshBtn);
      await this.adminPage.waitForSelector(Constants.SelectAllRowsBtn, {
        timeout: 10000,
      });
      await this.adminPage.click(Constants.SelectAllRowsBtn);
      await this.adminPage.click(Constants.DeactivateBtn);
      await this.adminPage.click(Constants.ConfirmDeactivateBtn);
    } catch (error) {
      console.log(`Deactivate Macro failed with error: ${error.message}`);
    }
  }

  public async verifyMacroDeactivated(startPage: any, macroName: string) {
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
    } catch {
      return false;
    }
  }

  public async EnableKbUrlLink() {
    await this.adminPage.click(Constants.ServiceSiteBtn);
    await this.adminPage.click(Constants.ServiceManagementBtn);
    await this.adminPage.click(Constants.KnowledgeSettingBtn);
    try {
      await this.adminPage.waitForSelector(Constants.EnableExternalPortalYes, {
        timeout: 3000,
      });
    } catch {
      await this.adminPage.click(Constants.EnableExternalPortalNo);
      await this.adminPage.fill(Constants.UrlTextBox, Constants.KbUrl);
      await this.adminPage.click(Constants.SaveBtn);
    }
  }

  public async VerifyKbUrlLink(page: Page) {
    const iframeParent = await (
      await page.waitForSelector(Constants.ChatPageDesignerIframe)
    ).contentFrame();
    const iframeChild = iframeParent.childFrames()[0];
    const description = await (
      await iframeChild.waitForSelector(Constants.MessageInputBox)
    ).textContent();
    return description.startsWith("http") ? true : false;
  }

  public async deleteAccount(
    adminPage: Page,
    adminStartPage: any,
    accountName: string
  ) {
    await this.openAppLandingPage(adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceHub);
    await this.adminPage.click(Constants.AccountsSitemapBtn);
    await this.adminPage.fill(Constants.SearchThisViewInputField, accountName);
    await this.adminPage.click(Constants.SearchThisViewStartBtn);
    await this.adminPage.click(Constants.RefreshBtn);
    await this.adminPage.waitForSelector(Constants.SelectAllRowsBtn, {
      timeout: 10000,
    });
    await this.adminPage.click(Constants.SelectAllRowsBtn);
    await this.adminPage.click(Constants.DeleteButton);
    await this.adminPage.click(Constants.ConfirmDeleteButton);
  }

  public async CreateEmailTemplateAndGetId() {
    await this.adminPage.click(Constants.EmailTemplateSiteMapBtn);
    await this.adminPage.click(Constants.NewEmailTemplateBtn);
    await this.adminPage.fill(
      Constants.EmailTemplateNameInputField,
      Constants.EmailTemplateName
    );
    await this.adminPage.click(Constants.Category);
    (await this.adminPage.$(Constants.Category))?.selectOption(
      Constants.CategoryValue
    );
    await this.adminPage.keyboard.press("Tab");
    await this.adminPage.waitForSelector(Constants.SelectedCategoryTitle);
    await this.adminPage.click(Constants.CreateBtn);
    const iframeParent = await (
      await this.adminPage.waitForSelector('[title="Designer"]')
    ).contentFrame();
    const iframeChild = await (
      await iframeParent.waitForSelector(Constants.EmailIFrame)
    ).contentFrame();
    await iframeChild.fill(
      Constants.EmailTemplateSubjectInputField,
      Constants.EmailTemplateSubject
    );
    await this.adminPage.keyboard.press("Enter");
    await this.adminPage.click(Constants.SaveEmailBtn);
    const url = await this.adminPage.url();
    const params = url.split("?")[1].split("&");
    for (var element of params) {
      const pair = element.split("=");
      if (pair[0] === "id") {
        return pair[1];
      }
    }
  }

  public async deleteEmailTemplate(page: Page, startPage: any, emailTemplateName: string) {
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
    const iframeParent = await (
      await page.waitForSelector(Constants.ChatPageDesignerIframe)
    ).contentFrame();
    const iframeChild = iframeParent.childFrames()[0];
    try {
      await iframeChild.waitForSelector(Constants.ChatHeaderTitle);
      return true;
    } catch {
      return false;
    }
  }
  public async createMacroFromOmnichannelAdminCenterApp(
    macroName: string,
    ...params: any[]
  ) {
    await this.adminPage.waitForSelector(Constants.AgentExperience);
    await this.adminPage.click(Constants.AgentExperience);
    await this.adminPage.waitForSelector(Constants.ManageMacros);
    await this.adminPage.click(Constants.ManageMacros);
    await this.adminPage.click(Constants.NewButton);
    await this.adminPage.fill(Constants.NameField, macroName);
    const iframeParent = await (
      await this.adminPage.waitForSelector(Constants.MacroDesignerIFrame)
    ).contentFrame();
    const iframeChild = await (
      await iframeParent.waitForSelector(Constants.MacroDesignerIFrameChild)
    ).contentFrame();
    await iframeChild.click(Constants.StartMacroExecutionBtn);
    await iframeChild.click(Constants.NewStepBtn);
    switch (macroName) {
      case Constants.SaveRecord:
        await iframeChild.click(Constants.OpenNewForm);
        await iframeChild.fill(
          Constants.EntityLogicalNameField,
          Constants.EntityLogicalNameAccount
        );
        await iframeChild.click(Constants.ShowAdvancedOptions);
        await iframeChild.fill(
          Constants.AttributeName1InputField,
          Constants.AttributeNameValue
        );
        await iframeChild.fill(
          Constants.AttributeValue1InputField,
          Constants.AttributeValue
        );
        await iframeChild.click(Constants.NewStepBtn);
        await iframeChild.click(Constants.SaveRecordAction);
        break;
      case Constants.DashboardMacroName:
        await iframeChild.click(Constants.OpenApplicationTab);
        await iframeChild.fill(
          Constants.PageTypeInputField,
          Constants.Dashboard
        );
        await this.checkAndCloseDynamicContentPopUp(iframeChild);
        await iframeChild.fill(
          Constants.ApplicationTemplateIdInputField,
          params[0]
        );
        break;
      case Constants.ControlMacro:
        await iframeChild.click(Constants.OpenApplicationTab);
        await iframeChild.fill(Constants.PageTypeInputField, Constants.Control);
        await this.checkAndCloseDynamicContentPopUp(iframeChild);
        await iframeChild.fill(
          Constants.ApplicationTemplateIdInputField,
          params[0]
        );
        break;
      case Constants.EntityListMacro:
        await iframeChild.click(Constants.OpenApplicationTab);
        await iframeChild.fill(
          Constants.PageTypeInputField,
          Constants.EntityList
        );
        await this.checkAndCloseDynamicContentPopUp(iframeChild);
        await iframeChild.fill(
          Constants.ApplicationTemplateIdInputField,
          params[0]
        );
        break;
      case Constants.ThirdPartyWebsiteMacroName:
        await iframeChild.click(Constants.OpenApplicationTab);
        await iframeChild.fill(
          Constants.PageTypeInputField,
          Constants.ThirdPartyWebsite
        );
        await this.checkAndCloseDynamicContentPopUp(iframeChild);
        await iframeChild.fill(
          Constants.ApplicationTemplateIdInputField,
          params[0]
        );
        break;
      case Constants.WebResourceMacro:
        await iframeChild.click(Constants.OpenApplicationTab);
        await iframeChild.fill(
          Constants.PageTypeInputField,
          Constants.WebResource
        );
        await this.checkAndCloseDynamicContentPopUp(iframeChild);
        await iframeChild.fill(
          Constants.ApplicationTemplateIdInputField,
          params[0]
        );
        break;
      case Constants.EntityRecordMacro:
        await iframeChild.click(Constants.OpenApplicationTab);
        await iframeChild.fill(
          Constants.PageTypeInputField,
          Constants.EntityRecord
        );
        await this.checkAndCloseDynamicContentPopUp(iframeChild);
        await iframeChild.fill(
          Constants.ApplicationTemplateIdInputField,
          params[0]
        );
        break;
      case Constants.SearchMacroName:
        await iframeChild.click(Constants.OpenApplicationTab);
        await iframeChild.fill(
          Constants.PageTypeInputField,
          Constants.Search
        );
        await this.checkAndCloseDynamicContentPopUp(iframeChild);
        await iframeChild.fill(
          Constants.ApplicationTemplateIdInputField,
          params[0]
        );
        break;
      case Constants.MacroFails:
        await iframeChild.click(Constants.OpenApplicationTab);
        await iframeChild.fill(
          Constants.PageTypeInputField,
          Constants.MacroFail
        );
        await this.checkAndCloseDynamicContentPopUp(iframeChild);
        await iframeChild.fill(
          Constants.ApplicationTemplateIdInputField,
          params[0]
        );
        await this.checkAndCloseDynamicContentPopUp(iframeChild);
        break;
    }
    await iframeParent.click(Constants.SaveAndCloseButton2);
    //Macro is saved in draft form that's why added some delay to save it in a activated form.
    await this.adminPage.waitForTimeout(3000);
  }

  public async deleteMacroFromOmnichannelAdminCenterApp(
    macroName: string
  ) {
    await this.adminPage.waitForSelector(Constants.AgentExperience);
    await this.adminPage.click(Constants.AgentExperience);
    await this.adminPage.waitForSelector(Constants.ManageMacros);
    await this.adminPage.click(Constants.ManageMacros);
    await this.adminPage.waitForSelector(Constants.SearchMacro);
    await this.adminPage.fill(Constants.SearchMacro, macroName);
    await this.adminPage.click(Constants.SearchThisViewStartBtn);
    await this.adminPage.click(Constants.RefreshBtn);
    await this.adminPage.waitForSelector(Constants.SelectAllRowsBtn, {
      timeout: 10000,
    });
    await this.adminPage.click(Constants.SelectAllRowsBtn);
    await this.adminPage.click(Constants.ASDeactivate);
    await this.adminPage.waitForTimeout(2000);
    await this.adminPage.click(Constants.ConfirmASDeactivate);
  }

  public async VerifyUnlinkedMacro(page: Page) {
    const iframeParent = await (
      await page.waitForSelector(Constants.ChatPageDesignerIframe)
    ).contentFrame();
    const iframeChild = iframeParent.childFrames()[0];
    try {
      await iframeChild.waitForSelector(Constants.ChatHeaderTitle);
      return true;
    } catch {
      return false;
    }
  }

  public async GetDashboardId() {
    await this.adminPage.click(Constants.DashboardSitemap);
    return await this.getAppIdFromUrl(await this.adminPage.url());
  }

  public async updateTitleOfApplicationTab(
    name: string,
    selectapplicationtab: string,
    selectapplicationtab1: string,
    searchapplicationtab: string
  ) {
    await this.adminPage.click(Constants.AgentExperience);
    await this.adminPage.click(Constants.ManageApplicationTab);
    await this.adminPage.click(Constants.SearchBox);
    await this.adminPage.fill(Constants.SearchBox, searchapplicationtab);
    await this.adminPage.click(Constants.SearchThisViewStartBtn);
    const isavail = await this.adminPage.isVisible(selectapplicationtab);
    if (isavail) {
      await this.adminPage.click(selectapplicationtab);
    } else {
      await this.adminPage.click(selectapplicationtab1);
    }
    await this.adminPage.click(Constants.TitleInputField);
    await this.adminPage.keyboard.press(Constants.ControlPlusAPlusDelete);
    await this.adminPage.fill(Constants.TitleInputField, name);
    await this.adminPage.click(Constants.SaveButton);
  }

  public async insertDashboardParameters(urlId: string) {
    await this.adminPage.click(Constants.AgentExperience);
    await this.adminPage.click(Constants.ManageApplicationTab);
    await this.adminPage.fill(Constants.SearchBox, Constants.DashboardName);
    await this.adminPage.click(Constants.SearchThisViewStartBtn);
    await this.adminPage.click(Constants.DashboardSearch);
    await this.adminPage.click(Constants.SearchTextBox);
    await this.adminPage.waitForSelector(Constants.SearchTextInputBox);
    await this.adminPage.waitForTimeout(2000);
    await this.adminPage.click(Constants.SearchTextInputBox);
    await this.adminPage.fill(Constants.SearchTextInputBox, urlId);
    await this.adminPage.waitForTimeout(4000);
    await this.adminPage.click(Constants.Save);
    await this.adminPage.waitForTimeout(4000);
  }

  public async openOmnichannelForCS(
    agentStartPage: OrgDynamicsCrmStartPage,
    agentPage: Page,
    agentChat: AgentChat
  ) {
    await this.openAppLandingPage(agentPage);
    await agentStartPage.goToOmnichannelForCustomers();
    // await agentChat.waitForAgentStatusIcon();
    // await agentChat.waitForAgentStatus();
    // await agentChat.setAgentStatusToAvailable();
  }

  public async runScriptAndValidate(agentChat: any, entitylisttitle: string) {
    //Time Delay for Loading Productivity Pane
    await agentChat.waitForTimeout(4000);
    await agentChat.waitForSelector(Constants.NavigateToAgentScript, { setTimeout: 10000 });
    await agentChat.click(Constants.RunScript);
    //time delar for run
    await agentChat.waitForTimeout(4000);
    const MacroValidate = await agentChat.isVisible(entitylisttitle);
    return MacroValidate;
  }

  public async runMacroAndValidate(agentChat: any, entitylisttitle: string) {
    //Time Delay for Loading Productivity Pane
    await agentChat.waitForSelector(Constants.NavigateToAgentScript, {
      setTimeout: 10000,
    });
    await agentChat.waitForTimeout(4000);
    await agentChat.click(Constants.NavigateToAgentScript);
    await agentChat.waitForTimeout(4000);
    await agentChat.click(Constants.MacroRunButton);
    await agentChat.waitForTimeout(4000);
    const MacroValidate = await agentChat.isVisible(entitylisttitle);
    return MacroValidate;
  }
  public async insertMacroParameter(
    macroSearch: string,
    macroSearch1: string,
    macroname: string,
    ...params: any[]
  ) {
    await this.adminPage.waitForSelector(Constants.AgentExperience);
    await this.adminPage.click(Constants.AgentExperience);
    await this.adminPage.waitForSelector(Constants.ManageMacros);
    await this.adminPage.click(Constants.ManageMacros);
    await this.adminPage.fill(Constants.SearchBox, macroname);
    await this.adminPage.click(Constants.SearchThisViewStartBtn);
    const isavail = await this.adminPage.isVisible(macroSearch);
    if (isavail) {
      await this.adminPage.click(macroSearch);
    } else {
      await this.adminPage.click(macroSearch1);
    }
    const iframeParent = await (
      await this.adminPage.waitForSelector(Constants.MacroDesignerIFrame)
    ).contentFrame();
    const iframeChild = await (
      await iframeParent.waitForSelector(Constants.MacroDesignerIFrameChild)
    ).contentFrame();
    switch (macroname) {
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

  public async removeSlugFromAgentScript(agentScript: string, click: string) {
    await this.adminPage.waitForSelector(Constants.AgentExperience);
    await this.adminPage.click(Constants.AgentExperience);
    await this.adminPage.click(Constants.ManagedAgentScript);
    await this.adminPage.click(Constants.SearchBox);
    await this.adminPage.fill(Constants.SearchBox, agentScript);
    await this.adminPage.click(Constants.SearchThisViewStartBtn);
    await this.adminPage.click(click);
    await this.adminPage.click(Constants.SelectAllAgentScriptStep);
    await this.adminPage.click(Constants.MoreCommandsForAgentScript);
    await this.adminPage.click(Constants.DeleteAllAgentScriptStep);
    await this.adminPage.waitForTimeout(2000);
    await this.adminPage.click(Constants.DeleteConfirmation);
    await this.adminPage.waitForTimeout(2000);
  }

  public async deleteAgentScript(agentScript: string) {
    await this.adminPage.waitForSelector(Constants.AgentExperience);
    await this.adminPage.click(Constants.AgentExperience);
    await this.adminPage.click(Constants.ManagedAgentScript);
    await this.adminPage.click(Constants.SearchBox);
    await this.adminPage.fill(Constants.SearchBox, agentScript);
    await this.adminPage.click(Constants.SearchThisViewStartBtn);
    await this.adminPage.waitForSelector(Constants.SelectAllCheck, {
      timeout: 10000,
    });
    await this.adminPage.click(Constants.SelectAllCheck);
    await this.adminPage.click(Constants.ASDeactivate);
    await this.adminPage.waitForTimeout(2000);
    await this.adminPage.click(Constants.ConfirmASDeactivate);
    await this.adminPage.waitForTimeout(2000);
  }

  public async createAgentScriptWithoutMacro(
    AgentScriptName: string,
    AgentScriptUniqueName: string
  ) {
    let rnd: any;
    rnd = this.getRandomNumber();
    await this.adminPage.waitForSelector(Constants.AgentExperience);
    await this.adminPage.click(Constants.AgentExperience);
    await this.adminPage.waitForSelector(Constants.ManagedAgentScript);
    await this.adminPage.click(Constants.ManagedAgentScript);
    try {
      await this.adminPage.waitForSelector(
        `//*[@title="` + AgentScriptName + `"]`,
        { timeout: 3000 }
      );
    } catch {
      await this.adminPage.click(Constants.NewButton);
      await this.adminPage.fill(Constants.NameField, AgentScriptName);
      await this.adminPage.fill(
        Constants.UniqueNameField,
        AgentScriptUniqueName + rnd
      );
      await this.adminPage.click(Constants.SaveAndCloseButton);
    }
  }

  public getRandomNumber() {
    var minm = 1000;
    var maxm = 9999;
    return Math.floor(Math.random() * (maxm - minm + 1)) + minm;
  }

  public async createAgentScript(
    AgentScriptName: string,
    AgentScriptUniqueName: string,
    MacroName: string
  ) {
    let rnd: any;
    rnd = this.getRandomNumber();
    await this.adminPage.waitForSelector(Constants.AgentExperience);
    await this.adminPage.click(Constants.AgentExperience);
    await this.adminPage.waitForSelector(Constants.ManagedAgentScript);
    await this.adminPage.click(Constants.ManagedAgentScript);
    try {
      await this.adminPage.waitForSelector(
        `//*[@title="` + AgentScriptName + `"]`,
        { timeout: 3000 }
      );
    } catch {
      await this.adminPage.click(Constants.NewButton);
      await this.adminPage.fill(Constants.NameField, AgentScriptName);
      await this.adminPage.fill(
        Constants.UniqueNameField,
        AgentScriptUniqueName + rnd
      );
      await this.adminPage.click(Constants.SaveEmailBtn);
      await this.adminPage.click(Constants.AgentScriptStepTitle);
      await this.adminPage.click(Constants.NewAgentScriptStep);
      //Time Delay for filling AgentScriptName
      await this.adminPage.waitForTimeout(3000);
      await this.adminPage.fill(Constants.NameField, MacroName);
      //Time Delay for AgentScriptUniqueName
      await this.adminPage.waitForTimeout(3000);
      await this.adminPage.waitForSelector(Constants.UniqueNameField, {
        timeout: 3000,
      });
      await this.adminPage.fill(
        Constants.UniqueNameField,
        Constants.AgentscriptUniquename + rnd
      );
      //Time Delay for filling Order
      await this.adminPage.waitForSelector(Constants.AgentscriptStepOrderfield);
      await this.adminPage.click(Constants.AgentscriptStepOrderfield);
      await this.adminPage.fill(
        Constants.AgentscriptStepOrderfield,
        Constants.AgentscriptStepOrder
      );
      //Time Delay for Clicking Selector Step
      await this.adminPage.waitForTimeout(4000);
      //Select macro for all
      const Actiontype = await this.adminPage.$(
        Constants.AgentscriptSelectorStep
      );
      await Actiontype?.selectOption(Constants.SelectOptionMacro);
      await this.adminPage.keyboard.press(Constants.TabKeyboardbutton);
      await this.adminPage.click(Constants.TargetMacroLookupResult);
      await this.adminPage.fill(Constants.TargetMacroLookupResult, MacroName);
      const macroSelector = `//*[text()='${MacroName}']`;
      await this.adminPage.click(macroSelector);

      await this.adminPage.waitForSelector(Constants.SaveAndCloseButton, {
        timeout: 3000,
      });
      await this.adminPage.click(Constants.SaveAndCloseButton);
      await this.adminPage.click(Constants.SaveAndCloseButton);
    }
  }

  public async waitForTimeout() {
    await this.adminPage.waitForTimeout(4000);
  }

  public async addAgentScripttoDefaultChatSession() {
    await this.adminPage.click(Constants.WorkspaceSiteMap);
    await this.adminPage.waitForTimeout(4000);
    await this.adminPage.waitForSelector(Constants.ManagedSession);
    await this.adminPage.click(Constants.ManagedSession);
    await this.adminPage.click(Constants.CaseEntitySession);
    await this.adminPage.waitForSelector(Constants.AgentScriptsTab);
    await this.adminPage.click(Constants.AgentScriptsTab);
    await this.adminPage.waitForSelector(Constants.MoreCommandsForAgentScript)
    await this.adminPage.click(Constants.MoreCommandsForAgentScript);
    await this.adminPage.waitForSelector(Constants.AddExistingAgentScriptsBtn)
    await this.adminPage.click(Constants.AddExistingAgentScriptsBtn);
    await this.adminPage.click(Constants.LookForRecordsField);
    await this.adminPage.fill(
      Constants.LookForRecordsField,
      Constants.AgentScriptName
    );
    await this.adminPage.keyboard.press("ArrowDown");
    await this.adminPage.keyboard.press("Enter");
    await this.adminPage.waitForSelector(Constants.AddBtn);
    await this.adminPage.click(Constants.AddBtn);
    // await this.adminPage.waitForSelector(Constants.AgentScript);
    // const visible = await this.adminPage.isVisible(Constants.AgentScript);
    // //Time Delay for Checking The Visibility of AgentScript
    // await this.adminPage.waitForTimeout(4000);
    // expect(visible).toBeTruthy();
    // await this.adminPage.click(Constants.SaveAndCloseButton);
  }


  public async addAgentScripttoDefaultChatSessionbyParameterization(AgentScriptName: string) {
    await this.adminPage.click(Constants.WorkspaceSiteMap);
    await this.adminPage.waitForTimeout(4000);
    await this.adminPage.waitForSelector(Constants.ManagedSession);
    await this.adminPage.click(Constants.ManagedSession);
    await this.adminPage.click(Constants.CaseEntitySession);
    await this.adminPage.waitForSelector(Constants.AgentScriptsTab);
    await this.adminPage.click(Constants.AgentScriptsTab);
    await this.adminPage.waitForSelector(Constants.MoreCommandsForAgentScript)
    await this.adminPage.click(Constants.MoreCommandsForAgentScript);
    await this.adminPage.waitForSelector(Constants.AddExistingAgentScriptsBtn)
    await this.adminPage.click(Constants.AddExistingAgentScriptsBtn);
    await this.adminPage.click(Constants.LookForRecordsField);
    await this.adminPage.fill(
      Constants.LookForRecordsField,
      AgentScriptName
    );
    await this.adminPage.waitForLoadState();
    await this.adminPage.waitForSelector(Constants.Recordsvisible);
    // await this.adminPage.waitForTimeout(4000);// we are using keyboard commands 2seconds wait is needed.
    await this.adminPage.keyboard.press("ArrowDown");
    await this.adminPage.waitForTimeout(2000); // we are using keyboard commands 2seconds wait is needed.
    await this.adminPage.keyboard.press("Enter");
    await this.adminPage.waitForTimeout(2000);
    await this.adminPage.waitForSelector(Constants.AddBtn);
    await this.adminPage.click(Constants.AddBtn);
    await this.adminPage.waitForSelector(Constants.DashboardAgentScript);
    const visible = await this.adminPage.isVisible(Constants.DashboardAgentScript);
    // //Time Delay for Checking The Visibility of AgentScript
    await this.adminPage.waitForTimeout(4000);
    expect(visible).toBeTruthy();
    await this.adminPage.click(Constants.SaveAndCloseButton);
  }

  public async addAgentScripttoDefaultChatSessionbyParameterization2(AgentScriptName: string, agscriptvalidation: string) {
    await this.adminPage.click(Constants.WorkspaceSiteMap);
    await this.adminPage.waitForTimeout(4000);
    await this.adminPage.waitForSelector(Constants.ManagedSession);
    await this.adminPage.click(Constants.ManagedSession);
    await this.adminPage.click(Constants.CaseEntitySession);
    await this.adminPage.waitForSelector(Constants.AgentScriptsTab);
    await this.adminPage.click(Constants.AgentScriptsTab);
    await this.adminPage.waitForSelector(Constants.MoreCommandsForAgentScript)
    await this.adminPage.click(Constants.MoreCommandsForAgentScript);
    await this.adminPage.waitForSelector(Constants.AddExistingAgentScriptsBtn)
    await this.adminPage.click(Constants.AddExistingAgentScriptsBtn);
    await this.adminPage.click(Constants.LookForRecordsField);
    await this.adminPage.fill(
      Constants.LookForRecordsField,
      AgentScriptName
    );
    await this.adminPage.waitForLoadState();
    await this.adminPage.waitForSelector(Constants.Recordsvisible);
    // await this.adminPage.waitForTimeout(4000);// we are using keyboard commands 2seconds wait is needed.
    await this.adminPage.keyboard.press("ArrowDown");
    await this.adminPage.waitForTimeout(2000); // we are using keyboard commands 2seconds wait is needed.
    await this.adminPage.keyboard.press("Enter");
    await this.adminPage.waitForTimeout(2000);
    await this.adminPage.waitForSelector(Constants.AddBtn);
    await this.adminPage.click(Constants.AddBtn);
    await this.adminPage.waitForSelector(agscriptvalidation);
    const visible = await this.adminPage.isVisible(agscriptvalidation);
    // //Time Delay for Checking The Visibility of AgentScript
    await this.adminPage.waitForTimeout(4000);
    expect(visible).toBeTruthy();
    await this.adminPage.click(Constants.SaveAndCloseButton);
  }

  public async insertControlParameters() {
    await this.adminPage.click(Constants.AgentExperience);
    await this.adminPage.click(Constants.ManageApplicationTab);
    await this.adminPage.fill(
      Constants.SearchBox,
      Constants.ControlApplicationTab
    );
    await this.adminPage.click(Constants.SearchThisViewStartBtn);
    await this.adminPage.click(Constants.SearchControlApplicationTab);
    await this.adminPage.waitForSelector(Constants.SearchTextBox);
    await this.adminPage.click(Constants.SearchTextBox);
    await this.adminPage.waitForSelector(Constants.SearchTextInputBox);
    await this.adminPage.waitForTimeout(2000);
    await this.adminPage.click(Constants.SearchTextInputBox);
    await this.adminPage.fill(
      Constants.SearchTextInputBox,
      Constants.AttributeValueControl
    );
    await this.adminPage.waitForTimeout(4000);
    await this.adminPage.click(Constants.Save);
    await this.adminPage.waitForTimeout(3000);
  }

  public async deleteApplicationTabusingOmnichannelAdminCenter(
    dashboardapplicationtab: string
  ) {
    await this.adminPage.waitForSelector(Constants.WorkspaceSiteMap);
    await this.adminPage.click(Constants.WorkspaceSiteMap);
    await this.adminPage.waitForSelector(Constants.ManageApplicationTab);
    await this.adminPage.click(Constants.ManageApplicationTab);
    await this.adminPage.waitForSelector(Constants.SearchMacro);
    await this.adminPage.fill(Constants.SearchMacro, dashboardapplicationtab);
    await this.adminPage.click(Constants.SearchThisViewStartBtn);
    await this.adminPage.click(Constants.RefreshBtn);
    await this.adminPage.waitForSelector(Constants.SelectAllRowsBtn, {
      timeout: 10000,
    });
    await this.adminPage.click(Constants.SelectAllRowsBtn);
    await this.adminPage.click(Constants.ASDeactivate);
    await this.adminPage.waitForTimeout(2000);
    await this.adminPage.click(Constants.ConfirmASDeactivate);
  }

  public async insertEntityListParameters() {
    await this.adminPage.click(Constants.AgentExperience);
    await this.adminPage.click(Constants.ManageApplicationTab);
    await this.adminPage.fill(
      Constants.SearchBox,
      Constants.EntityListApplicationTab
    );
    await this.adminPage.click(Constants.SearchThisViewStartBtn);
    await this.adminPage.click(Constants.EntityListSearch);
    await this.adminPage.waitForSelector(Constants.SearchTextBox);
    await this.adminPage.click(Constants.SearchTextBox);
    await this.adminPage.waitForSelector(Constants.SearchTextInputBox);
    await this.adminPage.waitForTimeout(2000);
    await this.adminPage.click(Constants.SearchTextInputBox);
    await this.adminPage.fill(
      Constants.SearchTextInputBox,
      Constants.CategoryValue
    );
    await this.adminPage.waitForTimeout(4000);
    await this.adminPage.click(Constants.Save);
    await this.adminPage.waitForTimeout(3000);
  }

  public async insertThirdPartyParameters() {
    await this.adminPage.click(Constants.AgentExperience);
    await this.adminPage.click(Constants.ManageApplicationTab);
    await this.adminPage.fill(
      Constants.SearchBox,
      Constants.EntitySearchApplicationTab
    );
    await this.adminPage.click(Constants.SearchThisViewStartBtn);
    await this.adminPage.click(Constants.EntitySearchTabTitle);
    await this.adminPage.waitForSelector(Constants.SearchTextBox);
    await this.adminPage.click(Constants.SearchTextBox);
    await this.adminPage.waitForSelector(Constants.SearchTextInputBox);
    await this.adminPage.waitForTimeout(2000);
    await this.adminPage.click(Constants.SearchTextInputBox);
    await this.adminPage.fill(
      Constants.SearchTextInputBox,
      Constants.SearchTextValue
    );
    await this.adminPage.waitForSelector(Constants.SearchTypeBox);
    await this.adminPage.click(Constants.SearchTypeBox);
    await this.adminPage.waitForSelector(Constants.SearchTypeInputBox);
    await this.adminPage.waitForTimeout(2000);
    await this.adminPage.click(Constants.SearchTypeInputBox);
    await this.adminPage.fill(
      Constants.SearchTypeInputBox,
      Constants.SearchTypeValue
    );
    await this.adminPage.waitForTimeout(4000);
    await this.adminPage.click(Constants.Save);
    await this.adminPage.waitForTimeout(3000);
  }

  public async insertEntitySearchParameters() {
    await this.adminPage.click(Constants.AgentExperience);
    await this.adminPage.click(Constants.ManageApplicationTab);
    await this.adminPage.fill(
      Constants.SearchBox,
      Constants.EntitySearchApplicationTab
    );
    await this.adminPage.click(Constants.SearchThisViewStartBtn);
    await this.adminPage.click(Constants.EntitySearchTabTitle);
    await this.adminPage.waitForSelector(Constants.SearchTextBox);
    await this.adminPage.click(Constants.SearchTextBox);
    await this.adminPage.waitForSelector(Constants.SearchTextInputBox);
    await this.adminPage.waitForTimeout(2000);
    await this.adminPage.click(Constants.SearchTextInputBox);
    await this.adminPage.fill(
      Constants.SearchTextInputBox,
      Constants.ThirdPartyUrlValue
    );
    await this.adminPage.waitForTimeout(4000);
    await this.adminPage.click(Constants.Save);
    await this.adminPage.waitForTimeout(3000);
  }

  public async insertWebResourceParameters() {
    await this.adminPage.click(Constants.AgentExperience);
    await this.adminPage.click(Constants.ManageApplicationTab);
    await this.adminPage.fill(
      Constants.SearchBox,
      Constants.WebResourceApplicationTab
    );
    await this.adminPage.click(Constants.SearchThisViewStartBtn);
    await this.adminPage.click(Constants.WebResourceTabTitle);
    await this.adminPage.waitForSelector(Constants.SearchTypeBox);
    await this.adminPage.click(Constants.SearchTypeBox);
    await this.adminPage.waitForSelector(Constants.SearchTypeInputBox);
    await this.adminPage.waitForTimeout(2000);
    await this.adminPage.click(Constants.SearchTypeInputBox);
    await this.adminPage.fill(
      Constants.SearchTypeInputBox,
      Constants.WebResourceValue
    );
    await this.adminPage.waitForTimeout(4000);
    await this.adminPage.click(Constants.Save);
    await this.adminPage.waitForTimeout(3000);
  }

  public async insertEntityRecordParameters() {
    await this.adminPage.click(Constants.AgentExperience);
    await this.adminPage.click(Constants.ManageApplicationTab);
    await this.adminPage.fill(
      Constants.SearchBox,
      Constants.EntityRecordApplicationTab
    );
    await this.adminPage.click(Constants.SearchThisViewStartBtn);
    await this.adminPage.click(Constants.EntityRecordTabTitleSelect);
    await this.adminPage.waitForSelector(Constants.EntityNameBox);
    await this.adminPage.click(Constants.EntityNameBox);
    await this.adminPage.waitForSelector(Constants.EntityNameInputBox);
    await this.adminPage.waitForTimeout(2000);
    await this.adminPage.click(Constants.EntityNameInputBox);
    await this.adminPage.fill(
      Constants.EntityNameInputBox,
      Constants.EntityLogicalNameIncident
    );
    await this.adminPage.waitForTimeout(4000);
    await this.adminPage.click(Constants.Save);
    await this.adminPage.waitForTimeout(3000);
  }

  public async createCase(CaseName: string) {
    await this.adminPage.click(Constants.CaseSitemapBtn);
    await this.adminPage.click(Constants.NewCaseBtn);
    await this.adminPage.fill(Constants.CaseTitleInputField, CaseName);
    await this.adminPage.click(Constants.CutomerNameSearchIcon);
    await this.adminPage.click(Constants.CustomerNameLooupResult);
    const SaveBtn = await this.adminPage.locator(Constants.CaseSaveBtn);
    await SaveBtn.waitFor({ state: "visible" });
    await this.adminPage.click(Constants.CaseSaveBtn);
    await this.adminPage.click(Constants.RefreshTheBtn);
  }

  public async createCaseForNandG(CaseName: string) {
    let rnd: any;
    rnd = this.getRandomNumber();
    let CaseTitle = CaseName + rnd;
    await this.adminPage.click(Constants.CaseSitemapBtn);
    await this.adminPage.click(Constants.NewCaseBtn);
    await this.adminPage.fill(Constants.CaseTitleInputField, CaseTitle);
    await this.adminPage.click(Constants.CutomerNameSearchIcon);
    await this.adminPage.click(Constants.CustomerNameLooupResult);
    const SaveBtn = await this.adminPage.locator(Constants.CaseSaveBtn);
    await SaveBtn.waitFor({ state: "visible" });
    await this.adminPage.click(Constants.CaseSaveBtn);
    await this.adminPage.click(Constants.RefreshTheBtn);
    return CaseTitle;
  }

  public async EnableMSTeamChat() {
    await this.adminPage.waitForSelector(Constants.MSTeamChatSitemabtn);
    await this.adminPage.click(Constants.MSTeamChatSitemabtn);
    const IsEnable1 = await this.adminPage.isVisible(
      Constants.IsDisableMSTeamChat
    );
    if (IsEnable1) {
      await this.adminPage.click(Constants.DisableMSTeamChat);
      await this.adminPage.click(Constants.MSTeamChatSave);
    }
  }

  public async DisableMSTeamChat(page: Page, startPage) {
    await this.openAppLandingPage(page);
    await startPage.goToMyApp(Constants.CustomerServiceHub);
    await this.adminPage.waitForSelector(Constants.ServiceSiteBtn);
    await this.adminPage.click(Constants.ServiceSiteBtn);
    await this.adminPage.click(Constants.ServiceManagementBtn);
    await this.adminPage.waitForSelector(Constants.MSTeamChatSitemabtn);
    await this.adminPage.click(Constants.MSTeamChatSitemabtn);
    const IsEnable1 = await this.adminPage.isVisible(
      Constants.IsEnableMSTeamChat
    );
    if (IsEnable1) {
      await this.adminPage.click(Constants.EnableMSTeamChat);
      await this.adminPage.click(Constants.MSTeamChatSave);
    }
  }

  public async deleteCaseInCSH(page: Page, startPage: any, caseName: string) {
    await this.openAppLandingPage(page);
    await startPage.goToMyApp(Constants.CustomerServiceHub);
    await page.click(Constants.CaseSitemapBtn);
    await page.waitForSelector(Constants.SearchOption);
    await page.fill(Constants.SearchOption, caseName);
    await page.click(Constants.SearchTheView);
    await page.click(Constants.SelectAllTheRowsBtn);
    await page.waitForSelector(Constants.DeleteButton);
    await page.click(Constants.DeleteButton);
    await page.waitForSelector(Constants.ConfirmDeleteButton);
    await page.click(Constants.ConfirmDeleteButton);
    await page.waitForSelector(Constants.SearchOption);
  }


  public async InitiateSession(InitiateOne: string, Click: string) {
    await this.adminPage.click(Constants.SearchOption, { timeout: 50000 });
    await this.adminPage.fill(Constants.SearchOption, InitiateOne);
    await this.adminPage.waitForTimeout(Constants.FourThousandsMiliSeconds);
    await this.adminPage.click(Constants.SearchTheView);
    await this.adminPage.click(Click);
    await this.adminPage.waitForTimeout(Constants.MaxTimeout);
  }

  public async InitiateNandGSession(InitiateOne: string, Click: string) {
    let CaseLink1 = `//*[text()="{0}"]`;
    const chatIndexSelector = CaseLink1.replace("{0}", Click);
    await this.adminPage.click(Constants.SearchOption, { timeout: 50000 });
    await this.adminPage.fill(Constants.SearchOption, InitiateOne);
    await this.adminPage.waitForTimeout(3000);
    await this.adminPage.click(Constants.SearchTheView);
    await this.adminPage.waitForSelector(chatIndexSelector);
    await this.adminPage.click(chatIndexSelector);
    await this.adminPage.waitForTimeout(8000);
  }

  public async associateSessionTemplateToaWorkStream() {
    await this.adminPage.click(Constants.WorkStreamSitemapOCBtn);
    await this.adminPage.click(Constants.WorkStream);
    await this.adminPage.click(Constants.TemplatesTab);
    await this.adminPage.click(Constants.LookupSessionTemplate);
    await this.adminPage.click(Constants.SessionSearchResult);
    await this.adminPage.click(Constants.SaveAndCloseButton);
    await this.adminPage.waitForTimeout(1000);
  }

  public async InitiateSessionTemplate(InitiateOne: string, Click: string) {
    await this.adminPage.waitForSelector(Constants.AgentExperience);
    await this.adminPage.click(Constants.AgentExperience);
    await this.adminPage.click(Constants.ManagedSession);
    await this.adminPage.click(Constants.SearchOption, { timeout: 50000 });
    await this.adminPage.fill(Constants.SearchOption, InitiateOne);
    await this.adminPage.waitForTimeout(3000);
    await this.adminPage.click(Constants.SearchTheView);
    await this.adminPage.click(Click);
    await this.adminPage.waitForTimeout(3000);
  }

  public async CloseSession(closeSession: string) {
    await this.adminPage.click(closeSession);
    await this.adminPage.click(Constants.ClickCloseSession);
    await this.adminPage.click(Constants.CloseSessionConfirmation);
  }

  public async CloseSessions(closeSession: string, gotocloseSession: string) {
    await this.adminPage.click(closeSession);
    await this.adminPage.waitForSelector(gotocloseSession, { timeout: 3000 });
    await this.adminPage.click(gotocloseSession);
    await this.adminPage.click(Constants.ClickCloseSession);
  }
  public async CloseTab(closeTab: string) {
    await this.adminPage.click(closeTab);
  }

  public async ValidateThePage(ValidateHome: string) {
    // Added constants.five as of now to wait for selector to load
    await this.waitUntilSelectorIsVisible(ValidateHome, Constants.Five, this.adminPage);
    const PageValidate = await this.adminPage.isVisible(ValidateHome);
    expect(PageValidate).toBeTruthy();
  }

  public async ValidateNandGThePage(ValidateHome: string) {
    //Time delay to perform the action
    const CloseSession1 =
      'div[aria-label="{0}"]';
    //let CaseLink1 = `//*[text()="{0}"]`;
    const chatIndexSelector = CloseSession1.replace("{0}", ValidateHome);
    await this.adminPage.waitForSelector(chatIndexSelector, { timeout: 3000 });
    const PageValidate = await this.adminPage.isVisible(chatIndexSelector);
    expect(PageValidate).toBeTruthy();
  }

  public async ValidateTheQueueTitle(ValidateHome: string) {
    //Time delay to perform the action
    const CloseSession1 =
      '[aria-label="{0}. Press the DELETE Key to close the tab"]';
    //let CaseLink1 = `//*[text()="{0}"]`;
    const chatIndexSelector = CloseSession1.replace("{0}", ValidateHome);
    await this.adminPage.waitForSelector(chatIndexSelector, { timeout: 3000 });
    const PageValidate = await this.adminPage.isVisible(chatIndexSelector);
    await this.adminPage.waitForTimeout(10000);

    expect(PageValidate).toBeTruthy();
  }

  public async ValidateClosePage(ValidateHome: string) {
    //Time delay to perform the action
    const CloseTab =
      '[aria-label="Press Enter to close the tab {0}"]';
    const chatIndexSelector = CloseTab.replace("{0}", ValidateHome);
    await this.adminPage.waitForSelector(chatIndexSelector, { timeout: 3000 });
    const PageValidate = await this.adminPage.isVisible(chatIndexSelector);
    expect(PageValidate).toBeTruthy();
  }

  public async ValidateClosePageinTab(ValidateHome: string) {
    //Time delay to perform the action
    const CloseSession1 =
      '(//*[@aria-label="{0}"])[2]';
    //let CaseLink1 = `//*[text()="{0}"]`;
    const chatIndexSelector = CloseSession1.replace("{0}", ValidateHome);
    await this.adminPage.waitForSelector(chatIndexSelector, { timeout: 3000 });
    const PageValidate = await this.adminPage.isVisible(chatIndexSelector);
    expect(PageValidate).toBeTruthy();
  }

  public async ValidateNotPage(ValidateHome: string) {
    //Time delay to perform the action
    const PageValidate = await this.adminPage.isVisible(ValidateHome);
    expect(PageValidate).toBeFalsy();
  }

  public async MinimizeProductivityPane() {
    await this.adminPage.waitForSelector(Constants.TurnOn, { timeout: 10000 });
    await this.adminPage.click(Constants.TurnOn);
    await this.adminPage.click(Constants.TurnonProductivityPane);
    const IsEnable1 = await this.adminPage.isVisible(Constants.isPPDisable);
    if (!IsEnable1) {
      await this.adminPage.click(Constants.DefaultMode);
    }
    await this.adminPage.click(Constants.TurnOnAgentScript);
    await this.adminPage.click(Constants.TurnOnKnowledgeSearch);
    await this.adminPage.click(Constants.TurnOnSmartAssist);
    await this.adminPage.click(Constants.SaveAndCloseButton2);
  }

  public async GoToHome() {
    await this.adminPage.waitForSelector(Constants.Home);
    await this.adminPage.click(Constants.Home);
    await this.adminPage.waitForTimeout(Constants.DefaultTimeout);
  }

  public async ClickProductivityPaneTool(OpenTool: string) {
    await this.adminPage.click(OpenTool);
    await this.adminPage.waitForTimeout(Constants.DefaultTimeout);
  }

  public async InitiateTab(InitiateOne: string, ClickTab: string) {
    await this.adminPage.click(Constants.SearchOption, { timeout: 50000 });
    await this.adminPage.fill(Constants.SearchOption, InitiateOne);
    await this.adminPage.waitForTimeout(Constants.FourThousandsMiliSeconds);
    await this.adminPage.click(Constants.SearchTheView);
    await this.adminPage.waitForTimeout(Constants.FourThousandsMiliSeconds);
    await this.adminPage.click(ClickTab, { modifiers: ["Control"] });
    await this.adminPage.waitForTimeout(Constants.DefaultTimeout);
  }

  public async InitiateNandGTab(InitiateOne: string, ClickTab: string) {
    let CaseLink1 = `//*[text()="{0}"]`;
    const chatIndexSelector = CaseLink1.replace("{0}", ClickTab);
    await this.adminPage.click(Constants.SearchOption, { timeout: 50000 });
    await this.adminPage.fill(Constants.SearchOption, InitiateOne);
    await this.adminPage.waitForTimeout(3000);
    await this.adminPage.click(Constants.SearchTheView);
    await this.adminPage.waitForTimeout(3000);
    await this.adminPage.click(chatIndexSelector, { modifiers: ["Control"] });
    await this.adminPage.waitForTimeout(2000);
  }

  public async OpenSuggestionCard(ClickTool: string) {
    await this.adminPage.click(ClickTool);
    await this.adminPage.waitForTimeout(3000);
  }

  public async CollapseExpandPane() {
    await this.adminPage.click(Constants.SAtool);
    await this.adminPage.click(Constants.SAtool);
    await this.adminPage.waitForTimeout(Constants.FourThousandsMiliSeconds);
  }

  public async OpenSuggestionLink(ClickTool: string) {
    await this.adminPage.waitForSelector(ClickTool);
    await this.adminPage.click(ClickTool);
    await this.adminPage.waitForTimeout(3000);
  }

  public async EmailEditor() {
    await this.adminPage.click(Constants.AddButton, { timeout: 50000 });
    await this.adminPage.click(Constants.EmailField, { timeout: 50000 });
    await this.adminPage.waitForTimeout(3000);
    await this.adminPage.fill(Constants.SubjectField, Constants.SubjectData);
    await this.adminPage.waitForTimeout(3000);
  }

  public async SwitchBackToPreviousSession(PreviousSession: string) {
    await this.adminPage.click(PreviousSession);
    await this.adminPage.waitForTimeout(Constants.FourThousandsMiliSeconds);
  }

  public async LinkAndUnlinkCase(ClickLinkBtn: string) {
    await this.adminPage.click(ClickLinkBtn);
    await this.adminPage.waitForTimeout(5000);
  }

  public async RelatedPage() {
    await this.adminPage.click(Constants.Related);
    await this.adminPage.waitForTimeout(3000);
    await this.adminPage.click(Constants.Connections);
  }

  public async ValidateDashboard(ValidateAgentDashboard: string) {
    //Delay for app tab to be visible
    await this.adminPage.waitForSelector(ValidateAgentDashboard, {
      timeout: 4000,
    });
    const PageValidate = await this.adminPage.isVisible(ValidateAgentDashboard);
    expect(PageValidate).toBeTruthy();
  }

  public async ValidateOCCSDashboard(ValidateAgentDashboard: string) {
    //Delay for app tab to be visible
    await this.adminPage.waitForSelector(ValidateAgentDashboard, {
      timeout: 20000,
    });
    const PageValidate = await this.adminPage.isVisible(ValidateAgentDashboard);
    expect(PageValidate).toBeTruthy();
  }

  public async ClickDropDown(Click: string) {
    await this.adminPage.click(Click);
    await this.adminPage.waitForTimeout(8000);
  }

  public async CloseDropDown(Click: string) {
    await this.adminPage.click(Click);
    await this.adminPage.waitForTimeout(8000);
  }

  public async CreateTask(TaskName: string) {
    await this.adminPage.click(Constants.TimelineAddButton);
    await this.adminPage.click(Constants.TimelineTaskButton);
    await this.adminPage.waitForSelector(Constants.TaskSubjectField);
    await this.adminPage.fill(Constants.TaskSubjectField, TaskName);
    await this.adminPage.click(Constants.AgentscriptStepSaveAndclose);
    //Time delay to save the task page
    await this.adminPage.waitForTimeout(Constants.FourThousandsMiliSeconds);
  }

  public async ConvertTaskToCase() {
    await this.adminPage.click(Constants.OpenRecordInTask);
    await this.adminPage.click(Constants.MoreOptionInTask);
    await this.adminPage.click(Constants.ConvertTo);
    await this.adminPage.click(Constants.ToCase);
    //Time delay to convert case
    await this.adminPage.waitForSelector(Constants.LookupCustomerField);
    await this.adminPage.click(Constants.LookupCustomerField);
    await this.adminPage.click(Constants.TaskCustomer);
    await this.adminPage.click(Constants.Convert);
    await this.adminPage.waitForTimeout(Constants.FourThousandsMiliSeconds);
  }

  public async ResolveCase(ResolutionName: String) {
    await this.adminPage.click(Constants.MoreOptionInCase);
    await this.adminPage.click(Constants.ResolveCaseBtn);
    //Time delay to load reslove page
    await this.adminPage.waitForSelector(Constants.Resolution, {
      timeout: 10000,
    });
    await this.adminPage.fill(Constants.Resolution, ResolutionName);
    await this.adminPage.click(Constants.SaveResolveCase);
    await this.adminPage.waitForTimeout(Constants.FourThousandsMiliSeconds);
  }

  public async ReactivateCase() {
    await this.adminPage.click(Constants.ReactivateCase);
    await this.adminPage.click(Constants.ConfirmReactivate);
    await this.adminPage.waitForTimeout(Constants.FourThousandsMiliSeconds);
  }

  public async CancelCase() {
    await this.adminPage.click(Constants.MoreOptionInCase);
    await this.adminPage.click(Constants.CancelCase);
    //Time delay to load cancel page
    await this.adminPage.waitForSelector(Constants.ConfirmCancelCase, {
      timeout: Constants.OpenWsWaitTimeout,
    });
    await this.adminPage.click(Constants.ConfirmCancelCase);
    await this.adminPage.waitForTimeout(Constants.FourThousandsMiliSeconds);
  }

  public async DeleteCase() {
    await this.adminPage.click(Constants.MoreOptionInCase);
    await this.adminPage.click(Constants.DeleteCase);
    await this.adminPage.click(Constants.ConfirmDeleteCase);
    await this.adminPage.waitForTimeout(Constants.FourThousandsMiliSeconds);
  }

  public async CreateCaseInCSW(CaseName: any) {
    await this.adminPage.click(Constants.CreateCaseBtn, { timeout: 50000 });
    await this.adminPage.click(Constants.CutomerNameSearchIcon);
    await this.adminPage.click(Constants.CustomerNameLooupResult);
    //time delay to load customer
    await this.adminPage.waitForSelector(Constants.CaseTitleField, {
      timeout: 10000,
    });
    await this.adminPage.fill(Constants.CaseTitleField, CaseName);
    //await this.adminPage.click(Constants.CasePriorityField, Priority);
    await this.adminPage.click(Constants.SaveAndClose);
    await this.adminPage.waitForTimeout(4000);
  }

  public async AddNote(ClickAddButton: string, Data: string) {
    await this.adminPage.click(ClickAddButton, { timeout: 50000 });
    await this.adminPage.click(Data, { timeout: 50000 });
    await this.adminPage.fill(Constants.NoteTitle, Constants.NoteTitleData);
    await this.adminPage.click(Constants.AddNoteBtn);
    await this.adminPage.click(Constants.RefreshBtn);
  }

  public async AddPost(ClickAddButton: string, Data: string) {
    await this.adminPage.click(ClickAddButton, { timeout: 5000 });
    await this.adminPage.click(Data, { timeout: 50000 });
    await this.adminPage.fill(Constants.PostField, Constants.PostData);
    await this.adminPage.click(Constants.AddPostBtn);
    await this.adminPage.click(Constants.RefreshBtn);
  }

  public async AddTask(ClickAddButton: string, Data: string) {
    await this.adminPage.click(ClickAddButton, { timeout: 5000 });
    await this.adminPage.click(Data, { timeout: 50000 });
    await this.adminPage.fill(Constants.Subject, Constants.SubjectForTask);
    await this.adminPage.click(Constants.SaveSubject);
    await this.adminPage.click(Constants.RefreshBtn);
  }

  public async GoToCases() {
    await this.adminPage.waitForSelector(Constants.AddBtnInCase, {
      timeout: 5000,
    });
    await Promise.all([
      this.adminPage.$eval(Constants.AddBtnInCase, (el) =>
        (el as HTMLElement).click()
      ),
    ]);
    //Time delay to load case grid
    await this.adminPage.click(Constants.CSWCases);
    await this.adminPage.waitForTimeout(3000);
  }

  public async AssociateCases(SelectCase: string, Validate: string) {
    await this.adminPage.click(Constants.SearchOption, { timeout: 50000 });
    await this.adminPage.fill(Constants.SearchOption, SelectCase);
    await this.adminPage.click(Constants.StartSearch);
    //Time delay to load search content
    await this.adminPage.waitForSelector(Constants.SelectAllRowsBtn, {
      timeout: 10000,
    });
    await this.adminPage.click(Constants.SelectAllRowsBtn);
    await this.adminPage.click(Constants.ClickAssociateBtn);
    //Time delay to associate page
    await this.adminPage.waitForSelector(Constants.SelectRelation, {
      timeout: 10000,
    });
    await this.adminPage.click(Constants.SelectRelation);
    await this.adminPage.click(Constants.SetBtn);
    //Time delay to load associated page
    await this.adminPage.waitForTimeout(10000);
    const visible = await this.adminPage.isVisible(Validate, "20000");
    expect(visible).toBeTruthy();
    await this.adminPage.click(Constants.Confirmation);
    await this.adminPage.waitForTimeout(3000);
  }

  public async MergeCases(SelectCase: string) {
    await this.adminPage.click(Constants.SearchOption, { timeout: 50000 });
    await this.adminPage.fill(Constants.SearchOption, SelectCase);
    await this.adminPage.click(Constants.StartSearch, { timeout: 50000 });
    //Time delay to load search content
    await this.adminPage.waitForSelector(Constants.SelectAll, {
      timeout: 10000,
    });
    await this.adminPage.click(Constants.SelectAll);
    await this.adminPage.click(Constants.OtherCaseOption);
    await this.adminPage.click(Constants.MergeCaseBtn);
    //Case Sorting
    await this.adminPage.waitForSelector(Constants.SortByCreatedOn, { state: "attached" });
    //Time delay to merge page
    await this.adminPage.waitForSelector(Constants.SelectRelation, {
      timeout: 10000,
    });
    await this.adminPage.click(Constants.SelectRelation);
    await this.adminPage.click(Constants.MergeBtn);
    //Time delay to load merged page
    await this.adminPage.waitForSelector(Constants.Confirmation, { state: "attached" });
    await this.adminPage.click(Constants.Confirmation);
    await this.adminPage.waitForTimeout(3000);
  }

  public async ParentCaseDetails(SelectCase: string) {
    await this.adminPage.click(Constants.SearchOption, { timeout: 50000 });
    await this.adminPage.fill(Constants.SearchOption, SelectCase);
    await this.adminPage.keyboard.press("Enter");
    //Time delay to load search content
    await this.adminPage.waitForSelector(Constants.ClickParent, {
      timeout: 10000,
    });
    await this.adminPage.click(Constants.ClickParent);
    await this.adminPage.waitForTimeout(3000);
  }

  public async VerifyParentCase() {
    await this.adminPage.click(Constants.DetailsBtn);
    const singleRowFieldControl = await this.adminPage.waitForSelector(
      Constants.MergedCases
    );
    const singleRowHeight = await singleRowFieldControl.boundingBox();
    await this.adminPage.mouse.move(singleRowHeight.x, singleRowHeight.y);
    await this.adminPage.mouse.wheel(0, 4000);
    const visible1 = await this.adminPage.locator(
      stringFormat(Constants.PostValidate, TestSettings.InboxUser1)
    );
    await visible1.waitFor({ state: "visible" });
    expect(visible1).toBeTruthy();
    await this.adminPage.click(Constants.FirstCase1);
    const visible2 = await this.adminPage.locator(Constants.CaseCancelled);
    await visible2.waitFor({ state: "visible" });
    expect(visible2).toBeTruthy();
    await this.adminPage.click(Constants.FirstCase2);
    const visible3 = await this.adminPage.locator(Constants.CaseCancelled);
    await visible3.waitFor({ state: "visible" });
    expect(visible3).toBeTruthy();
  }

  public async GoToServiceManagement() {
    await this.adminPage.waitForTimeout(3000);
    await this.adminPage.click(Constants.ServiceSiteBtn);
    await this.adminPage.click(Constants.ServiceManagementBtn);
  }

  public async CreateSubjectsFromHub(
    TitleName: string,
    TitleName2: string,
    TitleName3: string
  ) {
    await this.adminPage.click(Constants.Subjects);
    await this.adminPage.click(Constants.NewSubjectBtn);
    await this.adminPage.fill(Constants.TitleField, TitleName);
    await this.adminPage.click(Constants.SaveAndCloseBtn);
    await this.adminPage.click(Constants.NewSubjectBtn);
    await this.adminPage.fill(Constants.TitleField, TitleName2);
    //Time delay to load search content
    await this.adminPage.click(Constants.SubjectSearchIcon, { timeout: 4000 });
    await this.adminPage.fill(Constants.LooupForSubject, Constants.SubjectName);
    await this.adminPage.keyboard.press("ArrowDown");
    await this.adminPage.keyboard.press("Enter");
    //await this.adminPage.click(Constants.SubName);
    await this.adminPage.click(Constants.SaveAndCloseBtn);
    await this.adminPage.click(Constants.NewSubjectBtn);
    await this.adminPage.fill(Constants.TitleField, TitleName3);
    //Time delay to load search content
    await this.adminPage.click(Constants.SubjectSearchIcon, { timeout: 4000 });
    await this.adminPage.fill(
      Constants.LooupForSubject,
      Constants.SubjectName2,
      { timeout: 4000 }
    );
    await this.adminPage.click(Constants.SelectSubject2);
    await this.adminPage.click(Constants.SaveAndCloseBtn);
    await this.adminPage.waitForTimeout(4000);
  }

  public async CreateCaseForSubjectsInCSW(CaseName: string, SubName: string) {
    await this.adminPage.click(Constants.NewCaseBtn);
    await this.adminPage.fill(Constants.CaseTitleInputField, CaseName);
    await this.adminPage.click(Constants.CutomerNameSearchIcon);
    await this.adminPage.click(Constants.CustomerLooupResult);
    await this.adminPage.click(Constants.CSWSubjectField);
    //Time delay to load search content
    await this.adminPage.fill(Constants.SubjectSearchIcon, SubName, {
      timeout: 4000,
    });
    //Time delay to fill in search content
    await this.adminPage.waitForTimeout(2000);
    await this.adminPage.keyboard.press("Enter");
    await this.adminPage.click(Constants.ChooseParent);
    await this.adminPage.click(Constants.SaveTheBtn2);
    await this.adminPage.click(Constants.RefreshTheBtn);
  }

  public async ValidateSubjectField() {
    await this.adminPage.click(Constants.CSWSubjectField);
    await this.adminPage.click(Constants.Parent);
    await this.adminPage.click(Constants.Child1);
    //Time delay to load search content
    await this.adminPage.waitForSelector(Constants.CSWSubjectField, {
      timeout: 4000,
    });
    const PageValidate = await this.adminPage.isVisible(
      Constants.Parent,
      Constants.Child1
    );
    expect(PageValidate).toBeTruthy();
  }

  public async DeleteSubject(page: Page, startPage: any) {
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
    await this.adminPage.fill(
      Constants.SearchBoxinSub,
      Constants.SubjectName2,
      { timeout: 4000 }
    );
    await this.adminPage.click(Constants.ChooseChild1);
    await this.adminPage.click(Constants.SubDeleteBtn);
    await this.adminPage.click(Constants.ConfirmDeleteBtn);
    await this.adminPage.waitForTimeout(3000);
    //Time delay to load search content
    await this.adminPage.click(Constants.SearchBtn, { timeout: 4000 });
    //Time delay to fill in search content
    await this.adminPage.fill(
      Constants.SearchBoxinSub,
      Constants.SubjectName3,
      { timeout: 4000 }
    );
    await this.adminPage.click(Constants.ChooseChild2);
    await this.adminPage.click(Constants.SubDeleteBtn);
    await this.adminPage.click(Constants.ConfirmDeleteBtn);
  }

  public async CreateEntitlements(ENT: string) {
    await this.adminPage.click(Constants.Entitlements);
    await this.adminPage.click(Constants.NewButton);
    await this.adminPage.fill(Constants.EntitlementName, ENT);
    const primaryCustomer = await this.adminPage.locator(
      Constants.PrimaryCustomer
    );
    await primaryCustomer.waitFor({ state: "visible" });
    await this.adminPage.click(Constants.PrimaryCustomer);
    const customername = await this.adminPage.locator(
      Constants.CustomerNameResult
    );
    await customername.waitFor({ state: "visible" });
    await this.adminPage.click(Constants.CustomerNameResult);
    var date = new Date();
    var newdate =
      date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();
    const startDate = await this.adminPage.locator(Constants.StartDate);
    await startDate.waitFor({ state: "visible" });
    await this.adminPage.dblclick(Constants.StartDate);
    // Added  delay to fill the date field
    await this.adminPage.waitForTimeout(2000);
    await this.adminPage.fill(Constants.StartDate, newdate);
    const endDate = await this.adminPage.locator(Constants.EndDate);
    await endDate.waitFor({ state: "visible" });
    await this.adminPage.dblclick(Constants.EndDate);
    // Added  delay to fill the date field
    await this.adminPage.waitForTimeout(2000);
    await this.adminPage.fill(Constants.EndDate, newdate);
    await this.adminPage.click(Constants.Save);
  }

  public async DecRemainingOnForCaseCreation() {
    await this.adminPage.click(Constants.DecRemainingOn);
    await this.adminPage.click(Constants.CaseResolution1);
    await this.adminPage.keyboard.press("ArrowDown");
    await this.adminPage.keyboard.press("Enter");
    await this.adminPage.click(Constants.Save);
  }

  public async Totalterms(totalTerms: string) {
    await this.adminPage.click(Constants.TotalTerms);
    await this.adminPage.fill(Constants.TotalTerms, totalTerms);
    await this.adminPage.click(Constants.Save);
    await this.adminPage.click(Constants.Activate);
    await this.adminPage.click(Constants.ConfirmActivate);
  }

  public async createCaseFromCSWSiteMap(CaseName: string) {
    await this.adminPage.waitForSelector(Constants.CSWSitemapBtn);
    await this.adminPage.click(Constants.CSWSitemapBtn);
    await this.adminPage.click(Constants.CSWCases);
    await this.adminPage.click(Constants.NewCaseBtn);
    await this.adminPage.fill(Constants.CaseTitleInputField, CaseName);
    await this.adminPage.click(Constants.CutomerNameSearchIcon);
    await this.adminPage.waitForSelector(Constants.CustomerNameLooupResult);
    await this.adminPage.click(Constants.CustomerNameLooupResult);
    await this.adminPage.click(Constants.CSWCasePriority);
    await this.adminPage.keyboard.press("ArrowUp");
    await this.adminPage.keyboard.press("Enter");
    const IsEnable1 = await this.adminPage.isVisible(
      Constants.OpenCustomerServiceAgentDashboard
    );
    if (IsEnable1) {
      await this.adminPage.waitForSelector(Constants.CSWSaveAndCloseButton);
      await this.adminPage.click(Constants.CSWSaveAndCloseButton);
    } else {
      await this.adminPage.waitForSelector(
        Constants.CSWIncidentSaveAndCloseButton
      );
      await this.adminPage.click(Constants.CSWIncidentSaveAndCloseButton);
    }
    await this.adminPage.waitForTimeout(4000);
    await this.adminPage.click(Constants.RefreshTheBtn);
  }

  public async GoToEntField() {
    await this.adminPage.click(Constants.Detais);
    await this.adminPage.click(Constants.EntField);
  }

  public async ChooseEntitlement(ENT: string, chooseEnt: string) {
    await this.adminPage.click(Constants.EntField);
    await this.adminPage.click(Constants.SearchEntFeild);
    await this.adminPage.fill(Constants.EntField, ENT);
    await this.adminPage.click(chooseEnt);
    await this.adminPage.click(Constants.SaveAndCloseButton);
    await this.adminPage.click(Constants.RefreshTheBtn);
  }

  public async OpenEntitlement(EntName: string, Ent: string) {
    await this.adminPage.click(Constants.Entitlements);
    await this.adminPage.fill(Constants.EntSearchBox, EntName);
    await this.adminPage.click(Constants.SearchThisViewStartBtn);
    await this.adminPage.click(Ent);
    await this.adminPage.waitForTimeout(3000);// for loading elements this static wait is required.
    await this.adminPage.click(Constants.RefreshTheBtn);
  }

  public async ChooseEnt1ToEnt2(chooseEnt: string) {
    await this.adminPage.click(Constants.Detais);
    await this.adminPage.click(Constants.SearchEntFeild);
    //Time delay to perform action
    await this.adminPage.click(chooseEnt, { timeout: 4000 });
    await this.adminPage.click(Constants.SaveButton);
  }

  public async OpenAllCases() {
    await this.adminPage.click(Constants.MyActiveCases);
    await this.adminPage.click(Constants.AllCases);
  }

  public async DoNotDecrementEntitlementTerms() {
    await this.adminPage.click(Constants.MoreCommandsForCase);
    await this.adminPage.click(Constants.DoNotDecrementEntitlementTerms);
    await this.adminPage.click(Constants.Ok);
  }

  public async DeleteEntitlement(EntName: string) {
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

  public async CreatePublicQueue(QueueName: string) {
    await this.adminPage.click(Constants.QueueBtn);
    await this.adminPage.click(Constants.NewBtn);
    await this.adminPage.fill(Constants.TitleField, QueueName);
    await this.adminPage.waitForTimeout(3000);
    await this.adminPage.click(Constants.SaveAndCloseButton);
    await this.adminPage.waitForTimeout(3000);
    const UnsavedChanges = await this.waitUntilSelectorIsVisible(Constants.ConfirmaDialog, Constants.Two, this.adminPage);
    if (UnsavedChanges) {
      await this.adminPage.click(Constants.ConfirmButton);
    }
    await this.waitUntilSelectorIsVisible(Constants.QueueBtn, Constants.Two, this.adminPage);
  }

  public async AddCaseToQueue(Queue: string) {
    await this.adminPage.click(Constants.MoreCommandsForCase);
    await this.adminPage.click(Constants.AddQueue);
    await this.adminPage.fill(Constants.SearchIcon, Queue);
    //Time delay to fill in search content
    await this.adminPage.waitForTimeout(3000);
    await this.adminPage.click(Constants.QueueSearchResult);
    await this.adminPage.click(Constants.Add);
    await this.adminPage.click(Constants.RefreshBtn);
  }

  public async OpenQueueFromCSWSiteMap() {
    await this.adminPage.click(Constants.CSWSitemapBtn);
    await this.adminPage.click(Constants.QueueFromCSW);
    //Time delay to perform the action
    await this.adminPage.waitForTimeout(4000);
  }

  public async SelectAllItemsAllQueues() {
    await this.adminPage.click(Constants.ItemImWorkingOnDropDown);
    await this.adminPage.click(Constants.AllItems);
    await this.adminPage.click(Constants.SelectQueueFilter);
    await this.adminPage.click(Constants.AllQueues);
  }

  public async OpenQueueItem(Queue: string, Click: string) {
    //Time delay to load search content
    await this.adminPage.click(Constants.QueueSearchBox, { timeout: 4000 });
    await this.adminPage.fill(Constants.QueueSearchBox, Queue);
    //Time delay to fill in search content
    await this.adminPage.waitForTimeout(3000);
    await this.adminPage.click(Click, { modifiers: ["Control"] });
    //Time delay to perform action
    await this.adminPage.waitForTimeout(4000);
  }

  public async DeleteQueue(page: Page, startPage: any, Que: string) {
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

  public async SetupSmartAssist() {
    const SettingsBtn = await this.adminPage.locator(Constants.SettingBtn);
    await SettingsBtn.waitFor({ state: "visible" });
    await this.adminPage.click(Constants.SettingBtn);
    const manageSuggestions = await this.adminPage.locator(Constants.ManageSuggestions);
    await manageSuggestions.waitFor({ state: "visible" });
    await this.adminPage.click(Constants.ManageSuggestions);
    await this.adminPage.waitForTimeout(2000);
  }

  public async EnableSuggestionsInCSH() {
    const IsEnable1 = await this.adminPage.isVisible(
      Constants.IsEnableSimilarSuggestions
    );
    if (IsEnable1) {
      await this.adminPage.click(Constants.EnableSimilarSuggestions);
      //Time delay to perform action
      const visibleLandingpage = await this.adminPage.locator(Constants.EnableKBSuggestions);
      await visibleLandingpage.waitFor({ state: "visible" });
      await this.adminPage.click(Constants.EnableKBSuggestions);
    }
    //Time delay to perform action
    const visibleLandingpage1 = await this.adminPage.locator(Constants.SaveAndCloseButton);
    await visibleLandingpage1.waitFor({ state: "visible" });
    await this.adminPage.click(Constants.SaveAndCloseButton);
    //Time delay to perform action
    await this.adminPage.waitForDomcontentLoaded();
  }

  public async EmailURL() {
    const MoreOptionBtn = await this.adminPage.locator(Constants.MoreOption);
    await MoreOptionBtn.waitFor({ state: "visible" });
    await this.adminPage.click(Constants.MoreOption);
    const EMailBtn = await this.adminPage.locator(Constants.EmailURL);
    await EMailBtn.waitFor({ state: "visible" });
    await this.adminPage.click(Constants.EmailURL);
  }

  public async ValidateTheEmailBody(Email: string) {
    await this.adminPage.waitForSelector(Email, { timeout: 4000 });
    const PageValidate = await this.adminPage.isVisible(
      Constants.Emailform,
      Constants.Body
    );
    expect(PageValidate).toBeTruthy();
  }

  public async TurnOffSuggestions(page: Page, startPage: any) {
    await this.openAppLandingPage(page);
    await startPage.goToMyApp(Constants.CustomerServiceHub);
    await page.click(Constants.ServiceSiteBtn);
    await page.click(Constants.ServiceManagementBtn);
    await page.click(Constants.SettingBtn);
    await page.waitForSelector(Constants.ManageSuggestions);
    await page.click(Constants.ManageSuggestions);
    const IsEnable1 = await this.adminPage.isVisible(
      Constants.IsEnableSimilarSuggestions
    );
    if (IsEnable1 == false) {
      await page.click(Constants.SimilarSuggestions);
      await page.click(Constants.KBSuggestions);
    }
    await page.click(Constants.SaveAndCloseButton);
    await page.waitForTimeout(4000);
  }

  public async EmailContent() {
    await this.adminPage.click(Constants.MoreOption);
    await this.adminPage.click(Constants.EmailContent);
  }

  public async CopylURL() {
    await this.adminPage.click(Constants.MoreOption);
    await this.adminPage.click(Constants.CopyURL);
  }

  public async ValidateTimeLine(Status: string) {
    await this.adminPage.waitForTimeout(Constants.DefaultTimeout);
    await this.adminPage.click(Constants.FirstAutoPost);
    //Time delay to perform the action
    await this.adminPage.waitForSelector(Status, { timeout: 4000 });
    const PageValidate = await this.adminPage.isVisible(Status);
    expect(PageValidate).toBeTruthy();
  }

  public async ResolvecaseAsInformation(
    SelectResolutionType: string,
    Resolution: string
  ) {
    await this.adminPage.click(Constants.MoreCommands);
    await this.adminPage.click(Constants.ResolveCaseButton);
    await this.adminPage.click(SelectResolutionType);
    await this.adminPage.keyboard.press("ArrowDown");
    await this.adminPage.keyboard.press("Enter");
    await this.adminPage.fill(Constants.ResolutionInputField, Resolution);
    await this.adminPage.click(Constants.ResolveBtn);
    await this.adminPage.waitForTimeout(Constants.DefaultTimeout);
  }

  public async GoToMoreCommands() {
    await this.adminPage.click(Constants.MoreCommands);
    //Time delay to perform the action
    await this.adminPage.waitForTimeout(500);
  }

  public async ValidateNotPresent(tabName: string) {
    try {
      await page.waitForSelector(tabName);
      return false;
    } catch {
      return true;
    }
  }

  public async ClearTimeLine(Status: string) {
    await this.adminPage.click(Status);
    //Time delay to perform the action
    await this.adminPage.click(Constants.Delete, { timeout: 4000 });
    //Time delay to perform the action
    await this.adminPage.waitForTimeout(500);
    await this.adminPage.click(Constants.ConfirmDeleteCase);
  }

  public async deleteQueue(page: Page, startPage: any, QueueName: string) {
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

  public async SaveAndClose(SaveAndClose: string) {
    await this.adminPage.click(SaveAndClose);
  }

  public async AddTaskToQueue(Queue: string) {
    await this.adminPage.click(Constants.MoreOptionInTask);
    await this.adminPage.click(Constants.AddQueue);
    await this.adminPage.fill(Constants.SearchIcon, Queue);
    //Time delay to perform the action
    await this.adminPage.waitForTimeout(1000);
    await this.adminPage.click(Constants.QueueSearchResult);
    await this.adminPage.click(Constants.Add);
    await this.adminPage.click(Constants.RefreshBtn);
  }

  public async GoToServices() {
    await this.adminPage.click(Constants.ServiceManagement);
    await this.adminPage.click(Constants.Services);
  }

  public async AddQueueToExistingCases(Case: string, Queue: string) {
    await this.adminPage.click(Constants.CaseSitemapBtn);
    await this.adminPage.click(Constants.SearchBox);
    await this.adminPage.fill(Constants.SearchBox, Case);
    await this.adminPage.click(Constants.SearchTheView);
    await this.adminPage.click(Constants.SelectAllTheRowsBtn);
    await this.adminPage.click(Constants.MoreCommands);
    await this.adminPage.click(Constants.AddQueue);
    await this.adminPage.fill(Constants.SearchIcon, Queue);
    //Time delay to perform the action
    await this.adminPage.waitForTimeout(3000);
    await this.adminPage.keyboard.press("ArrowDown");
    await this.adminPage.keyboard.press("Enter");
    await this.adminPage.click(Constants.Add);
  }

  public async OpenCasesLinkedToQueue(Queue: string) {
    await this.adminPage.click(Constants.CSWSitemapBtn);
    await this.adminPage.click(Constants.Queues);
    await this.adminPage.click(Constants.ItemsDropDown);
    await this.adminPage.click(Constants.AllItems);
    await this.adminPage.click(Constants.SelectQueueFilter);
    await this.adminPage.click(Queue);
  }

  public async CopyURL() {
    const MoreOption = await this.adminPage.locator(Constants.MoreOption);
    await MoreOption.waitFor({ state: "visible" });
    await this.adminPage.click(Constants.MoreOption);
    const copyurl = await this.adminPage.locator(Constants.CopyURL);
    await copyurl.waitFor({ state: "visible" });
    await this.adminPage.click(Constants.CopyURL);
  }

  public async OpenSiteMapCasesFromCSW() {
    await this.adminPage.click(Constants.CSWSitemapBtn);
    await this.adminPage.click(Constants.Cases);
  }

  public async OpenSimilarCard(card: string) {
    await this.adminPage.click(card);
    //Time delay to perform the action
    await this.adminPage.waitForTimeout(1000);
  }

  public async NewCaseFromNewSession() {
    await this.adminPage.click(Constants.NewButton);
    //Time delay to perform the action
    await this.adminPage.waitForTimeout(1000);
  }

  public async CreateTabInApplicationTab(
    name: string,
    uniqueName: string,
    pageTypeOptionValue: string
  ) {
    let rnd: any;
    rnd = this.getRandomNumber();
    await this.adminPage.click(Constants.ApplicationTabsSitemapBtn);
    await this.adminPage.click(Constants.NewButton);
    await this.adminPage.fill(Constants.NameField, name + rnd);
    await this.adminPage.fill(Constants.UniqueNameField, uniqueName + rnd);
    await this.adminPage.click(Constants.PageTypeDropdown);
    (await this.adminPage.$(Constants.PageTypeDropdown))?.selectOption(
      pageTypeOptionValue
    );
    await this.adminPage.keyboard.press("Tab");
    await this.adminPage.click(Constants.SaveButton);
    await this.adminPage.click(Constants.RefreshBtn);
  }

  public async AddParametersToAppTab(
    Parameter: string,
    UniqueName: string,
    Value: string
  ) {
    let rnd: any;
    rnd = this.getRandomNumber();
    await this.adminPage.click(Constants.MoreCommandsForParameters);
    await this.adminPage.click(Constants.NewTemplateParameter);
    await this.adminPage.fill(Constants.NameField, Parameter + rnd);
    await this.adminPage.fill(Constants.UniqueNameField, UniqueName + rnd);
    await this.adminPage.fill(Constants.ValueSelector, Value);
    await this.adminPage.click(Constants.SaveAndCloseButton);
  }

  public RandomNumber() {
    var minm = 100;
    var maxm = 999;
    return Math.floor(Math.random() * (maxm - minm + 1)) + minm;
  }

  public async DeleteApplicationTabInCSH(
    page: Page,
    startPage: any,
    ApplicationTab: string
  ) {
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

  public async CreatePrivateQueue(QueueName: any) {
    await this.adminPage.click(Constants.QueueBtn);
    await this.adminPage.click(Constants.NewButton);
    await this.adminPage.fill(Constants.NameField, QueueName);
    await this.adminPage.waitForTimeout(1000);
    const typeField = await this.adminPage.locator(Constants.TypeField);
    await typeField.waitFor({ state: "visible" });
    await this.adminPage.click(Constants.TypeField);
    await this.adminPage.keyboard.press("ArrowDown");
    await this.adminPage.keyboard.press("Enter");
    await this.adminPage.waitForSelector(Constants.SaveAndCloseButton)
    await this.adminPage.click(Constants.SaveAndCloseButton);
    const UnsavedChanges = await this.waitUntilSelectorIsVisible(Constants.ConfirmaDialog, Constants.Two, this.adminPage);
    if (UnsavedChanges) {
      await this.adminPage.click(Constants.ConfirmButton);
    }
    await this.waitUntilSelectorIsVisible(Constants.QueueBtn, Constants.Two, this.adminPage);
  }

  public async QueueItemDetails() {
    await this.adminPage.click(Constants.MoreCommands);
    await this.adminPage.click(Constants.QueueItemDetails);
  }

  public async OpenQueuesFromCWS(AllQueues: string) {
    await this.adminPage.click(Constants.CSWSitemapBtn);
    await this.adminPage.click(Constants.Queues);
    await this.adminPage.click(Constants.ItemsDropDown);
    await this.adminPage.click(Constants.AllItems);
    await this.adminPage.click(Constants.SelectQueueFilter);
    await this.adminPage.click(AllQueues);
  }

  public async SelectRow(TaskName: string) {
    //Time delay to perform the action
    await this.adminPage.click(Constants.SearchBox, { timeout: 4000 });
    await this.adminPage.fill(Constants.SearchBox, TaskName);
    //delay to enter the case
    await this.adminPage.waitForTimeout(2000);
    await this.adminPage.click(Constants.SearchThisViewStartBtn);
    await this.adminPage.click(Constants.SelectTheItem);
  }

  public async ClickRouteOperation(Queue: string) {
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

  public async ClickOperation(OperationBtn: string, ConfirmBtn: string) {
    await this.adminPage.click(OperationBtn);
    await this.adminPage.click(ConfirmBtn);
    //Time delay to perform the action
    await this.adminPage.waitForTimeout(2000);
    await this.adminPage.click(Constants.SelectRow);
  }

  public async ClickReleaseOperation(OperationBtn: string, ConfirmBtn: string) {
    await this.adminPage.click(OperationBtn);
    await this.adminPage.click(ConfirmBtn);
    //Time delay to perform the action
    await this.adminPage.waitForTimeout(2000);
    await this.adminPage.click(Constants.CloseSearch);
  }

  public async deleteTask(page: Page, startPage: any, TaskName: string) {
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

  public async createAppProfile() {
    let rnd: any;
    rnd = this.getRandomNumber();
    await this.adminPage.click(Constants.WorkspaceSiteMap);
    await this.adminPage.click(Constants.ManageAgentExperienceProfile);
    await this.adminPage.click(Constants.NewAppProfile);
    await this.adminPage.fill(Constants.NameBox, Constants.AppProfileName1);
    await this.adminPage.fill(
      Constants.UniqueNameBox,
      Constants.UniqueName + rnd
    );
    await this.adminPage.click(Constants.CreateAppProfile);
    await this.adminPage.waitForTimeout(5000);
  }

  public async AddUsers(User: String) {
    await this.adminPage.waitForSelector(Constants.AddUsers);
    await this.adminPage.click(Constants.AddUsers);
    await this.adminPage.waitForSelector(Constants.SearchUser);
    await this.adminPage.click(Constants.SearchUser);
    await this.adminPage.fill(Constants.SearchUser, User);
    await this.adminPage.waitForSelector(Constants.SelectAllBtn);
    await this.adminPage.waitForTimeout(3000);
    await this.adminPage.click(Constants.SelectAllBtn);
    await this.adminPage.click(Constants.AddUser);
  }

  public async AddEntitySession(SessionTemplateName: string) {
    await this.adminPage.waitForSelector(Constants.AddEntitySessionTemplate, {
      timeout: 10000,
    });
    await this.adminPage.click(Constants.AddEntitySessionTemplate);
    await this.adminPage.click(Constants.AddSession);
    await this.adminPage.click(Constants.SessionTemplateEntity);
    await this.adminPage.click(Constants.Case);
    await this.adminPage.click(Constants.SessionTemplateDropDown);
    await this.adminPage.click(SessionTemplateName);
    await this.adminPage.click(Constants.AddSessionTemplate);
    await this.adminPage.click(Constants.SaveAndCloseButton2);
  }

  public async CreateSessionTemplate(SessionTemplateName: string) {
    let rnd: any;
    rnd = this.getRandomNumber();
    await this.adminPage.waitForSelector(Constants.AgentExperience);
    await this.adminPage.click(Constants.AgentExperience);
    await this.adminPage.click(Constants.ManagedSession);
    await this.adminPage.waitForSelector(Constants.NewButton);
    await this.adminPage.click(Constants.NewButton);
    await this.adminPage.fill(
      Constants.NameField,
      Constants.SessionTemplateName
    );
    await this.adminPage.fill(
      Constants.UniqueNameField,
      Constants.SessionTemplateUniqueName + rnd
    );
    await this.adminPage.selectOption(Constants.TypeField, {
      label: "Generic",
    });
    await this.adminPage.click(Constants.AnchorTabSearchBox);
    await this.adminPage.click(Constants.AnchorTabSearchIcon);
    await this.adminPage.click(Constants.AnchorTabSearchResult);
    await this.adminPage.click(Constants.SaveAndCloseButton);
  }

  public async EnableProductivityPane() {
    await this.adminPage.waitForSelector(Constants.TurnOn, { timeout: 10000 });
    await this.adminPage.click(Constants.TurnOn);
    await this.adminPage.click(Constants.TurnonProductivityPane);
    await this.adminPage.click(Constants.DefaultMode);
    await this.adminPage.click(Constants.TurnOnAgentScript);
    await this.adminPage.click(Constants.TurnOnKnowledgeSearch);
    await this.adminPage.click(Constants.TurnOnSmartAssist);
    await this.adminPage.click(Constants.SaveAndCloseButton2);
  }

  public async MaximizeProductivityPane() { }

  public async deleteAppProfile(page: Page, startPage) {
    await this.openAppLandingPage(page);
    await startPage.goToMyApp(Constants.CustomerServiceAdmincenter);
    await this.adminPage.click(Constants.WorkspaceSiteMap);
    await this.adminPage.click(Constants.ManageAgentExperienceProfile);
    await this.adminPage.waitForSelector(Constants.SearchAppProfile, {
      timeout: 10000,
    });
    await this.adminPage.waitForSelector(Constants.SearchAppProfile);
    await this.adminPage.fill(Constants.SearchAppProfile, Constants.Name);
    await this.adminPage.click(Constants.SortProfile);
    await this.adminPage.click(Constants.SortProfile);
    await this.adminPage.click(Constants.OpenAppProfile);
    await this.adminPage.click(Constants.DeleteProfile);
    await this.adminPage.click(Constants.ConfirmDelete, {
      waitUntil: "networkidle",
    });
    await this.adminPage.waitForSelector(Constants.NewAppProfile);
    await this.adminPage.waitForTimeout(2000); // to ensure delete the record added 2sec wait time
    const visiblenew = await this.adminPage.locator(Constants.NewAppProfile);
    await visiblenew.waitFor({ state: "visible" }); // added comand bcz of deleted operation is not doing completely
  }

  public async deleteAllAppProfile() {
    await this.adminPage.click(Constants.WorkspaceSiteMap);
    await this.adminPage.click(Constants.ManageAgentExperienceProfile);
    await this.adminPage.waitForSelector(Constants.SearchAppProfile, {
      timeout: 10000,
    });
    await this.adminPage.waitForSelector(Constants.SearchAppProfile);
    await this.adminPage.fill(Constants.SearchAppProfile, Constants.Name);
    await this.adminPage.click(Constants.SortProfile);
    await this.adminPage.click(Constants.SortProfile);
    await this.adminPage.click(Constants.OpenAppProfile);
    await this.adminPage.click(Constants.DeleteProfile);
    await this.adminPage.click(Constants.ConfirmDelete);
  }

  public async deleteSessionTemplate(
    page: Page,
    startPage: any,
    SessionTemplateName: string
  ) {
    await this.openAppLandingPage(page);
    await startPage.goToMyApp(Constants.OmnichannelAdminCenter);
    await this.adminPage.waitForSelector(Constants.AgentExperience);
    await this.adminPage.click(Constants.AgentExperience);
    await this.adminPage.click(Constants.ManagedSession);
    await this.adminPage.waitForSelector(Constants.SessionSearchThisView);
    await this.adminPage.fill(
      Constants.SessionSearchThisView,
      SessionTemplateName
    );
    await this.adminPage.click(Constants.SearchThisViewStartBtn);
    //await this.adminPage.click(Constants.RefreshBtn);
    await this.adminPage.waitForSelector(Constants.SelectAllRowsBtn, {
      timeout: 10000,
    });
    await this.adminPage.click(Constants.SelectAllRowsBtn);
    await this.adminPage.click(Constants.DeleteButton);
    await this.adminPage.click(Constants.ConfirmDeleteButton);
  }

  public async EnableOneAppsInProductivityPane() {
    await this.adminPage.waitForSelector(Constants.TurnOn, { timeout: 10000 });
    await this.adminPage.click(Constants.TurnOn);
    await this.adminPage.click(Constants.TurnonProductivityPane);
    await this.adminPage.click(Constants.DefaultMode);
    await this.adminPage.click(Constants.TurnOnAgentScript);
    await this.adminPage.click(Constants.SaveAndCloseButton2);
  }

  public async EnableTwoAppsInProductivityPane() {
    await this.adminPage.waitForSelector(Constants.TurnOn, { timeout: 10000 });
    await this.adminPage.click(Constants.TurnOn);
    await this.adminPage.click(Constants.TurnonProductivityPane);
    await this.adminPage.click(Constants.DefaultMode);
    await this.adminPage.click(Constants.TurnOnAgentScript);
    await this.adminPage.click(Constants.TurnOnSmartAssist);
    await this.adminPage.click(Constants.SaveAndCloseButton2);
    await page.waitForLoadState("domcontentloaded");
  }

  public async EnableMSTeamsAppsInProductivityPane() {
    await this.adminPage.waitForSelector(Constants.TurnOn, { timeout: 10000 });
    await this.adminPage.click(Constants.TurnOn);
    await this.adminPage.click(Constants.TurnonProductivityPane);
    await this.adminPage.click(Constants.DefaultMode);
    await this.adminPage.click(Constants.TurnOnMSTeams);
    await this.adminPage.click(Constants.SaveAndCloseButton2);
  }

  public async ValidateTheStausOwnerTitleConfidenceAndResolution() {
    expect(Constants.SimilarCaseTitle).toContain("Open similar case");
    expect(Constants.SimilarCaseConfidenceLevel).toContain("confidence");
    expect(Constants.CheckResolution).toContain("a");
    expect(Constants.CaseStatusAndOwner).toContain("Resolved");
    expect(Constants.CaseStatusAndOwner).toContain(
      "CustomerService Web Staging"
    );
  }

  public async VerifyReloadSuggestionsInCSW() {
    const caseSuggestion = await this.adminPage.isVisible(
      Constants.CaseSuggestion
    );
    if (caseSuggestion == true) {
      expect(caseSuggestion).toBeTruthy();
    }
    const kbSuggestion = await this.adminPage.isVisible(
      Constants.CaseSuggestion
    );
    if (kbSuggestion == true) {
      expect(kbSuggestion).toBeTruthy();
    }
  }

  public async VerifySuggestionsInCSW() {
    const caseSuggestion = await this.adminPage.isVisible(
      Constants.CaseSuggestion
    );
    expect(caseSuggestion).toBeTruthy();
    const kbSuggestion = await this.adminPage.isVisible(
      Constants.CaseSuggestion
    );
    expect(kbSuggestion).toBeTruthy();
  }

  public async TurnOnSuggestions() {
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

  public async VerifyCopyResolution() {
    await this.adminPage.click(Constants.MoreCommandsInCaseSuggestion);
    await this.adminPage.click(Constants.CopyResolution);
    const copyResolution = await this.adminPage.isVisible(
      Constants.MessageForCopyResolution
    );
    expect(copyResolution).toBeTruthy();
  }

  public async createAgentScriptforMultipleSteps(
    AgentScriptName1: string,
    AgentScriptUniqueName1: string,
    MacroName: string,
    agentscriptTexttype: string,
    agentscriptScripttype: string
  ) {
    let rnd: any;
    rnd = this.getRandomNumber();
    await this.adminPage.click(Constants.ProductivitySiteMap);
    await this.adminPage.waitForSelector(Constants.ManageAgentScript, {
      timeout: 2000,
    });
    await this.adminPage.click(Constants.ManageAgentScript);
    try {
      await this.adminPage.waitForSelector(
        `//*[@title="` + AgentScriptName1 + `"]`,
        { timeout: 3000 }
      );
    } catch {
      await this.adminPage.click(Constants.NewButton);
      await this.adminPage.fill(Constants.NameField, AgentScriptName1);
      await this.adminPage.fill(
        Constants.UniqueNameField,
        AgentScriptUniqueName1 + rnd
      );
      await this.adminPage.click(Constants.SaveEmailBtn);
      await this.adminPage.click(Constants.AgentScriptStepTitle);
      await this.adminPage.click(Constants.NewAgentScriptStep);
      //Time Delay for filling AgentScriptName
      await this.adminPage.waitForTimeout(3000);
      await this.adminPage.fill(
        Constants.AgentScriptStepNameBox,
        Constants.AgentScriptStepName
      );
      //Time Delay for AgentScriptUniqueName
      await this.adminPage.waitForTimeout(3000);
      await this.adminPage.waitForSelector(
        Constants.AgentscriptstepUniquenameBox,
        { timeout: 3000 }
      );
      await this.adminPage.fill(
        Constants.AgentscriptstepUniquenameBox,
        Constants.AgentscriptUniquename0 + rnd
      );
      //Time Delay for filling Order
      await this.adminPage.waitForSelector(Constants.AgentscriptStepOrderfield);
      await this.adminPage.click(Constants.AgentscriptStepOrderfield);
      await this.adminPage.fill(
        Constants.AgentscriptStepOrderfield,
        Constants.AgentscriptStepOrderforMacro
      );
      //Time Delay for Clicking Selector Step
      await this.adminPage.waitForTimeout(4000);
      switch (MacroName) {
        case Constants.SearchPhraseForPopulatedPhrase:
          const macroActiontype = await this.adminPage.$(
            Constants.AgentscriptSelectorStep
          );
          await macroActiontype?.selectOption(Constants.SelectOptionMacro);
          await this.adminPage.keyboard.press(Constants.TabKeyboardbutton);
          await this.adminPage.click(Constants.TargetMacroLookupResult);
          await this.adminPage.fill(
            Constants.TargetMacroLookupResult,
            Constants.SearchPhraseForPopulatedPhrase
          );
          await this.adminPage.click(
            Constants.SearchPhraseForPopulatedPhraseForm
          );
          break;
      }
      // Time Delay To save and close the agent script
      await this.adminPage.waitForSelector(Constants.SaveAndCloseButton, {
        timeout: 3000,
      });
      await this.adminPage.click(Constants.SaveAndCloseButton);
      await this.adminPage.click(Constants.AgentScriptStepTitle);
      await this.adminPage.click(Constants.NewAgentScriptStep);
      //Time Delay for filling AgentScriptName
      await this.adminPage.waitForTimeout(3000);
      await this.adminPage.fill(
        Constants.AgentScriptStepNameBox,
        Constants.AgentScriptStepName1
      );
      //Time Delay for AgentScriptUniqueName
      await this.adminPage.waitForTimeout(3000);
      await this.adminPage.waitForSelector(
        Constants.AgentscriptstepUniquenameBox,
        { timeout: 3000 }
      );
      await this.adminPage.fill(
        Constants.AgentscriptstepUniquenameBox,
        Constants.AgentscriptUniquename1 + rnd
      );
      //Time Delay for filling Order
      await this.adminPage.waitForTimeout(4000);
      await this.adminPage.click(Constants.AgentscriptStepOrderfield);
      await this.adminPage.fill(
        Constants.AgentscriptStepOrderfield,
        Constants.AgentscriptStepOrderforText
      );
      //Time Delay for Clicking Selector Step
      await this.adminPage.waitForTimeout(4000);
      //await this.adminPage.click(Constants.SaveAndCloseButton);
      switch (agentscriptTexttype) {
        case Constants.SelectOptionText:
          await this.adminPage.click(Constants.AgentscriptSelectorStep);
          const textActiontype = await this.adminPage.$(
            Constants.AgentscriptSelectorStep
          );
          textActiontype?.selectOption(Constants.SelectOptionText);
          await this.adminPage.keyboard.press(Constants.TabKeyboardbutton);
          await this.adminPage.waitForSelector(Constants.TextAreaInstruction, {
            timeout: 3000,
          });
          await this.adminPage.fill(
            Constants.TextAreaInstruction,
            Constants.TextInstructionValue
          );
          break;
      }
      // Time Delay To save and close the agent script
      await this.adminPage.waitForSelector(Constants.SaveAndCloseButton, {
        timeout: 3000,
      });
      await this.adminPage.click(Constants.SaveAndCloseButton);
      await this.adminPage.click(Constants.AgentScriptStepTitle);
      await this.adminPage.click(Constants.NewAgentScriptStep);
      //Time Delay for filling AgentScriptName
      await this.adminPage.waitForTimeout(3000);
      await this.adminPage.fill(
        Constants.AgentScriptStepNameBox,
        Constants.AgentScriptStepName2
      );
      //Time Delay for AgentScriptUniqueName
      await this.adminPage.waitForTimeout(3000);
      await this.adminPage.waitForSelector(
        Constants.AgentscriptstepUniquenameBox,
        { timeout: 3000 }
      );
      await this.adminPage.fill(
        Constants.AgentscriptstepUniquenameBox,
        Constants.AgentscriptUniquename2 + rnd
      );
      //Time Delay for filling Order
      await this.adminPage.waitForTimeout(4000);
      await this.adminPage.click(Constants.AgentscriptStepOrderfield);
      await this.adminPage.fill(
        Constants.AgentscriptStepOrderfield,
        Constants.AgentscriptStepOrderforScript
      );
      //Time Delay for Clicking Selector Step
      await this.adminPage.waitForTimeout(4000);
      //await this.adminPage.click(Constants.SaveAndCloseButton);
      switch (agentscriptScripttype) {
        case Constants.SelectOptionScript:
          await this.adminPage.click(Constants.AgentscriptSelectorStep);
          const textActiontype = await this.adminPage.$(
            Constants.AgentscriptSelectorStep
          );
          textActiontype?.selectOption(Constants.SelectOptionScript);
          await this.adminPage.keyboard.press(Constants.TabKeyboardbutton);
          await this.adminPage.click(Constants.TargetScriptLookupResult);
          await this.adminPage.fill(
            Constants.TargetScriptLookupResult,
            Constants.AgentscriptName2
          );
          await this.adminPage.click(Constants.DummyAgentScriptForm);
          break;
      }
      // Time Delay To save and close the agent script
      await this.adminPage.waitForSelector(Constants.SaveAndCloseButton, {
        timeout: 3000,
      });
      await this.adminPage.click(Constants.SaveAndCloseButton);
      await this.adminPage.click(Constants.RefreshButton);
      //Time Delay for Saving the Agent Script Properly
      await this.adminPage.waitForTimeout(4000);
      await this.adminPage.click(Constants.SaveAndCloseButton);
    }
  }

  public async ValidateStepsinAgentScript(
    adminPage: any,
    AgentScriptName: string
  ) {
    await this.adminPage.waitForSelector(Constants.AgentScriptSearch);
    await this.adminPage.fill(Constants.AgentScriptSearch, AgentScriptName);
    await this.adminPage.click(Constants.SearchThisViewStartBtn);
    await this.adminPage.click(Constants.RefreshBtn);
    //Time Delay for selecting all rows button
    await this.adminPage.waitForSelector(Constants.SelectAllRowsBtn, {
      timeout: 10000,
    });
    await this.adminPage.click(Constants.SelectAllRowsBtn);
    await this.adminPage.click(Constants.EditBtn);
    //Time Delay for Visibility of Excecution
    await adminPage.waitForTimeout(4000);
    const ValidateResult = await adminPage.isVisible(
      Constants.AgentScriptStep,
      Constants.AgentScriptStep1,
      Constants.AgentScriptStep2
    );
    return ValidateResult;
  }

  public async createAgentScriptWithoutSteps(
    AgentScriptName2: string,
    AgentScriptUniqueName2: string
  ) {
    let rnd: any;
    rnd = this.getRandomNumber();
    await this.adminPage.click(Constants.ProductivitySiteMap);
    await this.adminPage.waitForSelector(Constants.ManageAgentScript, {
      timeout: 2000,
    });
    await this.adminPage.click(Constants.ManageAgentScript);
    try {
      await this.adminPage.waitForSelector(
        `//*[@title="` + AgentScriptName2 + `"]`,
        { timeout: 3000 }
      );
    } catch {
      await this.adminPage.click(Constants.NewButton);
      await this.adminPage.fill(Constants.NameField, AgentScriptName2);
      await this.adminPage.fill(
        Constants.UniqueNameField,
        AgentScriptUniqueName2 + rnd
      );
      //Time Delay for Saving the Agent Script Properly
      await this.adminPage.waitForTimeout(4000);
      await this.adminPage.click(Constants.SaveAndCloseButton);
    }
  }

  public async deleteAgentScriptwithoutSteps(AgentScriptName2: string) {
    await this.adminPage.fill(Constants.AgentScriptSearch, AgentScriptName2);
    await this.adminPage.click(Constants.SearchThisViewStartBtn);
    await this.adminPage.click(Constants.RefreshBtn);
    // Time delay for selecting all rows button
    await this.adminPage.waitForSelector(Constants.SelectAllRowsBtn, {
      timeout: 10000,
    });
    await this.adminPage.click(Constants.SelectAllRowsBtn);
    // Time Delay for Edit button to appear
    await this.adminPage.waitForSelector(Constants.DeleteButton, {
      timeout: 10000,
    });
    await this.adminPage.click(Constants.DeleteButton);
    await this.adminPage.click(Constants.ConfirmDeleteButton);
  }

  public async createEntitySessionTemplate() {
    await this.adminPage.click(Constants.WorkspaceSiteMap);
    await this.adminPage.click(Constants.ManagedSession);
    await this.adminPage.click(Constants.NewButton);
    await this.adminPage.fill(
      Constants.NameField,
      Constants.SessionTemplateName
    );
    await this.adminPage.fill(
      Constants.UniqueNameField,
      Constants.SessionTemplateUniqueName
    );
    await this.adminPage.click(Constants.EntityField);
    await this.adminPage.click(Constants.CaseEntity);
    await this.adminPage.click(Constants.SaveAndCloseButton);
    await this.adminPage.waitForSelector(Constants.RefreshBtn);
    await this.adminPage.click(Constants.RefreshBtn);
  }

  public async addAppTabtoSession(
    applicationTabName: string,
    ApplicationTabSearchResult: string
  ) {
    await this.adminPage.fill(
      Constants.SessionSearchThisView,
      Constants.SessionTemplateName
    );
    await this.adminPage.click(Constants.SearchThisViewStartBtn);
    await this.adminPage.click(Constants.RefreshBtn);
    await this.adminPage.waitForSelector(Constants.SelectAllRowsBtn);
    await this.adminPage.click(Constants.SelectAllRowsBtn);
    await this.adminPage.waitForSelector(Constants.EditBtn, { timeout: 5000 });
    await this.adminPage.click(Constants.EditBtn);
    //Time Delay to load the page
    await this.adminPage.waitForTimeout(3000);
    await this.adminPage.click(Constants.MoreCommandsForApplicationTab);
    await this.adminPage.click(Constants.AddExistingApplicationTabsBtn);
    await this.adminPage.fill(
      Constants.LookForRecordsField,
      applicationTabName
    );
    await this.adminPage.click(ApplicationTabSearchResult);
    await this.adminPage.waitForTimeout(1000);
    //await this.adminPage.waitForSelector(Constants.SelectedApplicationTabSearchResult);
    await this.adminPage.click(Constants.AddBtn);
    await this.adminPage.waitForTimeout(1000);
    await this.adminPage.click(Constants.SaveAndCloseButton);
    await this.adminPage.click(Constants.RefreshBtn);
  }

  public async createApplicationTab(
    name: string,
    uniqueName: string,
    pageTypeOptionValue: string
  ) {
    let rnd: any;
    rnd = this.getRandomNumber();
    await this.adminPage.click(Constants.AgentExperience);
    await this.adminPage.click(Constants.WorkspaceSiteMap);
    await this.adminPage.waitForSelector(Constants.ManageApplicationTab);
    await this.adminPage.click(Constants.ManageApplicationTab);
    await this.adminPage.click(Constants.NewButton);
    await this.adminPage.fill(Constants.NameField, name);
    await this.adminPage.fill(Constants.UniqueNameField, uniqueName + rnd);
    await this.adminPage.fill(Constants.TitleInputField, name);
    await this.adminPage.click(Constants.PageTypeDropdown);
    (await this.adminPage.$(Constants.PageTypeDropdown))?.selectOption(
      pageTypeOptionValue
    );
    await this.adminPage.keyboard.press("Tab");
    await this.adminPage.click(Constants.SaveAndCloseButton);
  }

  public async ValidateAppTab(adminPage: any, NewAppTab: string) {
    await this.adminPage.waitForSelector(Constants.AutomationCase, {
      timeout: 20000,
    });
    await this.adminPage.click(Constants.AutomationCase);
    await this.adminPage.waitForSelector(NewAppTab, { timeout: 4000 });
    const ValidateResult = await adminPage.isVisible(NewAppTab);
    return ValidateResult;
  }

  public async openAccount(Account: string) {
    await this.adminPage.click(Constants.OpenSiteMap);
    await this.adminPage.click(Constants.AccountsSitemapBtn);
    await this.adminPage.click(Constants.ChangeView);
    await this.adminPage.click(Constants.AllAccountsView);
    await this.adminPage.click(Account);
  }

  public async deleteApplicationTabWithCSAdminCenter(
    adminStartPage: any,
    applicationTabName: string
  ) {
    try {
      await this.openAppLandingPage(this.adminPage);
      await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
      await this.adminPage.click(Constants.WorkspaceSiteMap);
      await this.adminPage.waitForSelector(Constants.ManageApplicationTab, {
        timeout: 10000,
      });
      await this.adminPage.click(Constants.ManageApplicationTab);
      await this.adminPage.waitForSelector(
        Constants.ApplicationTabSearchThisViewInputField
      );
      await this.adminPage.fill(
        Constants.ApplicationTabSearchThisViewInputField,
        applicationTabName
      );
      await this.adminPage.click(Constants.SearchThisViewStartBtn);
      await this.adminPage.click(Constants.RefreshBtn);
      await this.adminPage.waitForSelector(Constants.SelectAllRowsBtn, {
        timeout: 10000,
      });
      await this.adminPage.click(Constants.SelectAllRowsBtn);
      await this.adminPage.click(Constants.DeleteButton);
      await this.adminPage.click(Constants.ConfirmDeleteButton);
    } catch (error) {
      console.log(`Delete Application Tab failed with error: ${error.message}`);
    }
  }

  public async AddSlugToDashboardAppTab(adminStartPage: any) {
    await this.openAppLandingPage(this.adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    await this.adminPage.click(Constants.WorkspaceSiteMap);
    await this.adminPage.waitForSelector(Constants.ManageApplicationTab, {
      timeout: 10000,
    });
    await this.adminPage.click(Constants.ManageApplicationTab);
    await this.adminPage.waitForSelector(Constants.SearchBox);
    await this.adminPage.fill(
      Constants.SearchBox,
      Constants.DashboardApplicationTab
    );
    await this.adminPage.click(Constants.SearchThisViewStartBtn);
    await this.adminPage.click(Constants.EntityListSearch);
    await this.adminPage.waitForSelector(Constants.SearchTextBox1);
    await this.adminPage.click(Constants.SearchTextBox1);
    await this.adminPage.waitForSelector(Constants.SearchTextInputBox);
    await this.adminPage.click(Constants.SearchTextInputBox);
    await this.adminPage.fill(
      Constants.SearchTextInputBox,
      Constants.SlugCategoryValue
    );
    await this.adminPage.click(Constants.Save);
    await this.adminPage.waitForTimeout(3000);
  }

  public async AddSlugToEntityListAppTab(adminStartPage: any) {
    await this.openAppLandingPage(this.adminPage);
    await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    await this.adminPage.click(Constants.WorkspaceSiteMap);
    await this.adminPage.waitForSelector(Constants.ManageApplicationTab, {
      timeout: 10000,
    });
    await this.adminPage.click(Constants.ManageApplicationTab);
    await this.adminPage.waitForSelector(Constants.SearchBox);
    await this.adminPage.fill(
      Constants.SearchBox,
      Constants.EntityListApplicationTab
    );
    await this.adminPage.click(Constants.SearchThisViewStartBtn);
    await this.adminPage.click(Constants.EntityListSearch);
    await this.adminPage.waitForSelector(Constants.SearchTextBox1);
    await this.adminPage.click(Constants.SearchTextBox1);
    await this.adminPage.waitForSelector(Constants.SearchTextInputBox);
    await this.adminPage.click(Constants.SearchTextInputBox);
    await this.adminPage.fill(
      Constants.SearchTextInputBox,
      Constants.SlugCategoryValue
    );
    await this.adminPage.click(Constants.Save);
    await this.adminPage.waitForTimeout(3000);
  }

  public async OpenKbSearchAndValidate(agentChat: any) {
    //Time Delay for Loading Productivity Pane
    await agentChat.waitForSelector(Constants.KStool, { setTimeout: 10000 });
    await agentChat.waitForTimeout(4000);
    await agentChat.click(Constants.KStool);
    await agentChat.waitForTimeout(4000);
    await agentChat.fill(
      Constants.KBSearchOption,
      Constants.AutomationCaseTitle
    );
    await agentChat.keyboard.press("Enter");
    await agentChat.waitForTimeout(4000);
    const Validate = await agentChat.isVisible(Constants.CopyUrl2);
    return Validate;
  }

  public async MoreActions() {
    await this.adminPage.click(Constants.MoreActions);
    await this.adminPage.waitForTimeout(1000);
  }

  public async OpenClosedItem(agentChat: any) {
    await agentChat.waitForSelector(Constants.ClickClosedVisiter);
    await agentChat.click(Constants.ClickClosedVisiter);
    await agentChat.waitForTimeout(4000);
  }

  public async TurnOnMissedNotifications() {
    await this.adminPage.click(Constants.WorkSpaces);
    await this.adminPage.click(Constants.ManageNotification);
    await this.adminPage.click(Constants.MissedNotifications);
    await this.adminPage.click(Constants.EnableMissedNotifications);
    await this.adminPage.click(Constants.SaveAndCloseButton);
    await this.adminPage.waitForTimeout(4000);
  }

  public async StatusPresence(agentChat: AgentChat) {
    await agentChat.waitForAgentStatusIcon();
    await agentChat.waitForAgentStatus();
    await agentChat.setAgentStatusToAvailable();
  }

  public async CreateRoutingRole(
    RuleName: string,
    RuleItemName: string,
    QueueName: string
  ) {
    await this.adminPage.click(Constants.RoutingRuleBtn);
    await this.adminPage.click(Constants.NewButton);
    await this.adminPage.fill(Constants.NameField, RuleName);
    await this.adminPage.click(Constants.Save);
    await this.adminPage.waitForSelector(Constants.MoreCommandsForRule);
    await this.adminPage.click(Constants.MoreCommandsForRule);
    await this.adminPage.click(Constants.NewRuleItemBtn);
    await this.adminPage.waitForSelector(Constants.RuleItemTitleField);
    await this.adminPage.fill(Constants.RuleItemTitleField, RuleItemName);
    await this.adminPage.click(Constants.PlusAddBtn);
    await this.adminPage.click(Constants.AddRow);
    await this.adminPage.click(Constants.FieldSelector);
    await this.adminPage.click(Constants.SelectField);
    await this.adminPage.click(Constants.ValueSelector);
    await this.adminPage.click(Constants.SelectValue);
    await this.adminPage.click(Constants.RouteTo);
    await this.adminPage.keyboard.press("ArrowDown");
    await this.adminPage.keyboard.press("Enter");
    await this.adminPage.fill(Constants.AddToQueue, QueueName);
    await this.adminPage.waitForSelector(Constants.SearchResult);
    await this.adminPage.click(Constants.SearchResult);
    await this.adminPage.click(Constants.SaveAndCloseButton);
    await this.adminPage.waitForSelector(Constants.Activate);
    await this.adminPage.click(Constants.Activate);
    await this.adminPage.click(Constants.ConfirmBtn);
    await this.adminPage.waitForTimeout(2000);
  }

  public async AddPriorityToCase() {
    await this.adminPage.click(Constants.CasePriorityField);
    await this.adminPage.keyboard.press("ArrowUp");
    await this.adminPage.keyboard.press("Enter");
    await this.adminPage.click(Constants.RefreshBtn);
    await this.adminPage.waitForTimeout(4000);
  }

  public async SaveAndRoute(InitiateOne: string, Click: string) {
    await this.adminPage.click(Constants.SearchOption, { timeout: 4000 });
    await this.adminPage.fill(Constants.SearchOption, InitiateOne);
    await this.adminPage.waitForSelector(Constants.SearchTheView);
    await this.adminPage.click(Constants.SearchTheView);
    await this.adminPage.click(Click);
    await this.adminPage.waitForSelector(Constants.RefreshBtn);
    await this.adminPage.click(Constants.RefreshBtn);
    await this.adminPage.waitForSelector(Constants.SaveAndRoute);
    await this.adminPage.click(Constants.SaveAndRoute);
    await this.adminPage.waitForSelector(Constants.ConfirmRoute);
    await this.adminPage.click(Constants.ConfirmRoute);
    await this.adminPage.waitForTimeout(4000);
    const searchOption = await this.adminPage.locator(Constants.SearchOption);
    await searchOption.waitFor({ state: "visible" });
    await this.adminPage.waitForSelector(Constants.SearchOption);
    await this.adminPage.click(Constants.SearchOption, { timeout: 4000 });
    await this.adminPage.fill(Constants.SearchOption, InitiateOne);
    await this.adminPage.waitForSelector(Constants.SearchTheView);
    await this.adminPage.click(Constants.SearchTheView);
    await this.adminPage.click(Click, { timeout: 4000 });
    const moreCommand = await this.adminPage.locator(Constants.MoreCommand);
    await moreCommand.waitFor({ state: "visible" });
    await this.adminPage.click(Constants.MoreCommand);
    const refreshTimeline = await this.adminPage.locator(Constants.RefreshTimeline);
    await refreshTimeline.waitFor({ state: "visible" });
    await this.adminPage.click(Constants.RefreshTimeline);
  }

  public async SaveAndRouteInTab() {
    await this.adminPage.click(Constants.SaveAndRoute);
    await this.adminPage.click(Constants.ConfirmRoute);
    // Time Delay to load the page
    await this.adminPage.waitForTimeout(2000);
    await this.adminPage.click(Constants.CaseLink1, { modifiers: ["Control"] });
    //delay to open the case
    await this.adminPage.waitForTimeout(4000);
    await this.adminPage.click(Constants.RefreshBtn);
    // Time Delay to load the page
    await this.adminPage.waitForTimeout(4000);
  }

  public async deleteRoutingRule(page: Page, startPage: any, RuleName: string) {
    await this.openAppLandingPage(page);
    await startPage.goToMyApp(Constants.CustomerServiceHub);
    await this.adminPage.click(Constants.ServiceSiteBtn);
    await this.adminPage.click(Constants.ServiceManagementBtn);
    await page.click(Constants.RoutingRuleBtn);
    await page.fill(Constants.SearchOption, RuleName);
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
    await this.adminPage.waitForSelector(Constants.ManageMacros, {
      timeout: 4000,
    });
    await this.adminPage.click(Constants.ManageMacros);
    await this.adminPage.click(Constants.NewButton);
    // Time Delay to load the page
    await this.adminPage.fill(Constants.NameField, macroName, {
      timeout: 4000,
    });
    const iframeParent = await (
      await this.adminPage.waitForSelector(Constants.MacroDesignerIFrame)
    ).contentFrame();
    const iframeChild = await (
      await iframeParent.waitForSelector(Constants.MacroDesignerIFrameChild)
    ).contentFrame();
    await iframeChild.click(Constants.StartMacroExecutionBtn);
    await iframeChild.click(Constants.NewStepBtn);
    await iframeChild.click(Constants.RefreshSessionContext);
    await iframeChild.click(Constants.NewStepBtn);
    await iframeChild.click(Constants.ActionToResolveCase);
    await iframeChild.fill(Constants.IncidentIdInputField, params[0]);
    await iframeChild.fill(Constants.BillableTimeInputField, Constants.Ten);
    await iframeChild.fill(
      Constants.ResolutionInputField,
      Constants.CaseResolution
    );
    await iframeChild.click(Constants.NewStepBtn);
    await iframeChild.click(Constants.GetCurrentTab);
    await iframeChild.click(Constants.NewStepBtn);
    await iframeChild.click(Constants.RefreshTab);
    await iframeChild.click(Constants.TabId);
    // Time Delay to load the page
    await iframeChild.waitForSelector(Constants.SelectTabId, { timeout: 4000 });
    await iframeChild.click(Constants.SelectTabId);
    await iframeParent.click(Constants.SaveAndCloseButton2);
    // Time Delay to load the page
    await this.adminPage.waitForTimeout(4000);
  }

  public async AgentScriptInCSAdminCenter(
    AgentScriptName: string,
    UniqueName: string
  ) {
    let rnd: any;
    rnd = this.getRandomNumber();
    await this.adminPage.click(Constants.ProductivitySiteMap);
    await this.adminPage.click(Constants.ManagedAgentScript);
    await this.adminPage.click(Constants.NewButton);
    await this.adminPage.fill(Constants.NameField, AgentScriptName + rnd);
    await this.adminPage.fill(Constants.UniqueNameField, UniqueName + rnd);
    // Time Delay to load the page
    await this.adminPage.waitForTimeout(2000);
    await this.adminPage.keyboard.press("Tab");
    await this.adminPage.click(Constants.Save);
    // Time Delay to load the page
    await this.adminPage.waitForTimeout(4000);
  }

  public async AgentScriptStep(
    AgentScriptStep: string,
    UniqueName: string,
    MacroName: string
  ) {
    let rnd: any;
    rnd = this.RandomNumber();
    await this.adminPage.waitForDomContentLoaded();
    await this.adminPage.click(Constants.AgentScriptStepTitle);
    await this.adminPage.click(Constants.NewAgentScriptStep);
    // Time Delay to load the page
    await this.adminPage.waitForTimeout(3000);
    await this.adminPage.fill(Constants.NameField, AgentScriptStep);
    await this.adminPage.fill(Constants.UniqueNameField, UniqueName + rnd);
    // Time Delay to load the page
    await this.adminPage.waitForTimeout(2000);
    await this.adminPage.fill(
      Constants.AgentscriptStepOrderfield,
      Constants.AgentscriptStepOrder,
      { timeout: 2000 }
    );
    await this.adminPage.waitForDomContentLoaded();
    await this.adminPage.click(Constants.ActionType);
    await this.adminPage.keyboard.press("ArrowDown");
    await this.adminPage.keyboard.press("ArrowDown");
    await this.adminPage.keyboard.press("Enter");
    await this.adminPage.waitForDomContentLoaded();
    await this.adminPage.fill(Constants.TargetMacro, MacroName);
    // Time Delay to load the page
    await this.adminPage.waitForTimeout(2000);
    await this.adminPage.click(Constants.SearchResultForMacro);
    await this.adminPage.waitForDomContentLoaded();
    await this.adminPage.click(Constants.SaveAndCloseButton);
    // Time Delay to load the page
    await this.adminPage.waitForTimeout(4000);
  }

  public async SessionInCSAdminCenter(SessionName: string, UniqueName: string) {
    let rnd: any;
    rnd = this.getRandomNumber();
    await this.adminPage.click(Constants.WorkspaceSiteMap);
    await this.adminPage.click(Constants.ManagedSession);
    await this.adminPage.click(Constants.NewButton);
    await this.adminPage.fill(Constants.NameField, SessionName);
    await this.adminPage.fill(Constants.UniqueNameField, UniqueName + rnd);
    await this.adminPage.click(Constants.EntityRequiredField);
    await this.adminPage.click(Constants.Case);
    await this.adminPage.click(Constants.Save);
    // Time Delay to load the page
    await this.adminPage.waitForTimeout(4000);
  }

  public async AddAgentScriptToSession(AgentScript: string) {
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

  public async AddSessionToProfile(SessionName: string) {
    await this.adminPage.click(Constants.AddEntitySessionTemplate);
    await this.adminPage.click(Constants.ButtonToAddEntity);
    await this.adminPage.click(Constants.EntitySessionField);
    await this.adminPage.click(Constants.Case);
    await this.adminPage.click(Constants.SessionTemplateField);
    await this.adminPage.click(SessionName);
    await this.adminPage.click(Constants.AddSessionToProfile);
    await this.adminPage.click(Constants.SaveAndCloseBtn);
  }

  public async RunMacro() {
    await this.adminPage.click(Constants.MacroRunButton);
    // Time Delay to load the page
    await this.adminPage.waitForTimeout(2000);
  }

  public async DeleteSession(page: Page, startPage: any, SessionName: string) {
    await this.openAppLandingPage(page);
    await startPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    await page.click(Constants.WorkspaceSiteMap);
    await page.click(Constants.ManagedSession);
    await page.click(Constants.SearchBox);
    await page.fill(Constants.SearchBox, SessionName);
    await page.click(Constants.SearchTheView);
    await page.click(Constants.SelectAllTheRowsBtn);
    await page.click(Constants.DeleteButton);
    await page.click(Constants.ConfirmDelete);
  }

  public async DeleteAppProfile(page: Page, startPage: any, SessionName: string) {
    await this.openAppLandingPage(page);
    await startPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    await page.click(Constants.WorkspaceSiteMap);
    await page.click(Constants.ManageAgentExperience);
    await page.click(Constants.SearchAppProfile);
    await page.fill(Constants.SearchAppProfile, SessionName);
    await page.click(Constants.SelectProfile);
    await page.click(Constants.DeleteCase);
    await page.click(Constants.ConfirmDelete);
  }

  public async CreateCloneCurrentMacro(macroName: string, ...params: any[]) {
    await this.adminPage.waitForSelector(Constants.AgentExperience);
    await this.adminPage.click(Constants.AgentExperience);
    await this.adminPage.waitForSelector(Constants.ManageMacros);
    await this.adminPage.click(Constants.ManageMacros);
    await this.adminPage.click(Constants.NewButton);
    await this.adminPage.fill(Constants.NameField, macroName);
    const iframeParent = await (
      await this.adminPage.waitForSelector(Constants.MacroDesignerIFrame)
    ).contentFrame();
    const iframeChild = await (
      await iframeParent.waitForSelector(Constants.MacroDesignerIFrameChild)
    ).contentFrame();
    await iframeChild.click(Constants.StartMacroExecutionBtn);
    await iframeChild.click(Constants.NewStepBtn);
    await iframeChild.click(Constants.CurrentRecord);
    // Time Delay to load the page
    await iframeChild.waitForSelector(Constants.RecordTitle, { timeout: 4000 });
    await iframeChild.click(Constants.RecordTitle);
    await this.adminPage.keyboard.press("Enter");
    await iframeChild.fill(Constants.RecordTitle, params[0]);
    await iframeParent.click(Constants.SaveAndCloseButton2);
    // Time Delay to load the page
    await this.adminPage.waitForTimeout(4000);
  }

  public async SiteMapInAppDesigner() {
    let contexts = await browser.contexts();
    let pages = await contexts[1].pages();
    pages[1].bringToFront();
    await pages[1].click(Constants.SiteMapInAppDesigner);
    await pages[1].click(Constants.ConfirmOk);
    // Time Delay to load the page
    await this.adminPage.waitForTimeout(2000);
  }

  public async ValidateAppDesigner(ValidateEntity: string) {
    let contexts = await browser.contexts();
    let pages = await contexts[1].pages();
    pages[1].bringToFront();
    // Added constants.five as of now to wait for selector to load
    await this.waitUntilSelectorIsVisible(ValidateEntity, Constants.Five, pages[1])
    const PageValidate = await pages[1].isVisible(ValidateEntity);
    expect(PageValidate).toBeTruthy();
  }

  public async GoToLandingPage() {
    let contexts = await browser.contexts();
    let pages = await contexts[1].pages();
    pages[0].bringToFront();
    // Time Delay to load the page
    await this.adminPage.waitForTimeout(2000);
  }

  public async OpenSiteMapInCSW() {
    await this.adminPage.click(Constants.CSWSitemapBtn);
    // Time Delay to load the page
    await this.adminPage.waitForTimeout(2000);
  }

  public async openClosedWorkItems() {
    await this.adminPage.click(Constants.MoreOptions);
    await this.adminPage.keyboard.press("Enter");
  }
  public async createChannel() {
    let rnd: any;
    rnd = this.getRandomNumber();
    await this.adminPage.click(Constants.ChannelEditBtn);
    await this.adminPage.click(Constants.CreateChannel);
    await this.adminPage.fill(Constants.NameOfChannel, Constants.ChannelName);
    await this.adminPage.fill(
      Constants.UniqueNameField,
      Constants.UniqueName + rnd
    );
    await this.adminPage.fill(Constants.Label, Constants.LabelNum);
    await this.adminPage.fill(
      Constants.ChannelUrl,
      Constants.ThirdPartyUrlValue
    );
    await this.adminPage.fill(Constants.ChannelOrder, Constants.Order);
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

  public async ocDefaultAppProfile() {
    await this.adminPage.click(Constants.WorkspaceSiteMap);
    await this.adminPage.click(Constants.ManageAgentExperienceProfile);
    await this.adminPage.click(
      Constants.OmnichannelforCustomerServicedefaultprofile
    );
  }

  public async cswDefaultAppProfile() {
    await this.adminPage.click(Constants.WorkspaceSiteMap);
    await this.adminPage.click(Constants.ManageAgentExperienceProfile);
    await this.adminPage.click(
      Constants.CustomerServiceworkspacedefaultprofile
    );
    await this.adminPage.click(Constants.EntitySession);
  }

  public async cswDefaultChannelAppProfile() {
    await this.adminPage.click(Constants.WorkspaceSiteMap);
    await this.adminPage.click(Constants.ManageAgentExperienceProfile);
    await this.adminPage.click(
      Constants.CustomerServiceworkspacechannelsdefaultprofile
    );
    await this.adminPage.click(Constants.EntitySession);
  }

  public async cswDefaultProductivityPane() {
    await this.adminPage.click(Constants.WorkspaceSiteMap);
    await this.adminPage.click(Constants.ManageAgentExperienceProfile);
    await this.adminPage.click(
      Constants.CustomerServiceworkspacechannelsdefaultprofile
    );
    await this.adminPage.click(Constants.ProductivityPaneDefaultMode);
  }

  public async cswDefaultChannel() {
    await this.adminPage.click(Constants.WorkspaceSiteMap);
    await this.adminPage.click(Constants.ManageAgentExperienceProfile);
    await this.adminPage.click(
      Constants.CustomerServiceworkspacechannelsdefaultprofile
    );
    await this.adminPage.click(Constants.ChannelProvider);
  }

  public async casesLinkedToQueue(queue: string) {
    await this.adminPage.click(Constants.CSWSitemapBtn);
    await this.adminPage.click(Constants.Queues);
    await this.adminPage.click(Constants.ItemsDropDown);
    await this.adminPage.click(Constants.AllItems);
    await this.adminPage.click(Constants.SelectQueueFilter);
    await this.adminPage.click(Constants.AllQueues);
    await this.adminPage.click(queue, { modifiers: ["Control"] });
    await this.adminPage.waitForTimeout(1000);
  }

  public async initiateNewContactTab(agentChat: any) {
    await agentChat.waitForSelector(Constants.ClickNewContactBtn);
    await agentChat.click(Constants.ClickNewContactBtn);
    await agentChat.waitForTimeout(4000);
  }

  public async OpenValidateArticle(Click: string) {
    //Time delay to perform the action
    await this.adminPage.waitForSelector(Constants.KAContainer, {
      timeout: 3000,
    });
    await this.adminPage.waitForSelector(Click, { timeout: 3000 });
    await this.adminPage.click(Click);
    await this.adminPage.waitForTimeout(3000);
    const PageValidate = await this.adminPage.isVisible(Constants.KArticlePage);
    expect(PageValidate).toBeTruthy();
  }

  public async OpenCaseSession(Click: any) {
    //Time delay to perform the action
    await this.adminPage.waitForSelector(Click, { timeout: 3000 });
    await this.adminPage.click(Click);
  }

  public async maximizeDeleteAppProfile(
    page: Page,
    startPage,
    appName,
    applink
  ) {
    await this.openAppLandingPage(page);
    await startPage.goToMyApp(Constants.CustomerServiceAdmincenter);
    await this.adminPage.click(Constants.WorkspaceSiteMap);
    await this.adminPage.click(Constants.ManageAgentExperienceProfile);
    await this.adminPage.waitForSelector(Constants.SearchAppProfile, {
      timeout: 10000,
    });
    await this.adminPage.fill(Constants.SearchAppProfile, appName);
    await this.adminPage.click(applink);
    await this.adminPage.waitForSelector(Constants.EditTurnOn, {
      timeout: 10000,
    });
    await this.adminPage.click(Constants.EditTurnOn);
    const IsEnable1 = await this.adminPage.isVisible(Constants.isPPDisable);
    if (IsEnable1 == true) {
      await this.adminPage.click(Constants.DefaultMode);
    }
    await this.adminPage.click(Constants.SaveAndCloseButton2);
    //Delete AppProfile
    await this.adminPage.click(Constants.WorkspaceSiteMap);
    await this.adminPage.click(Constants.ManageAgentExperienceProfile);
    await this.adminPage.waitForSelector(Constants.SearchAppProfile, {
      timeout: 10000,
    });
    await this.adminPage.fill(Constants.SearchAppProfile, appName);
    await this.adminPage.click(Constants.OpenAppProfile);
    await this.adminPage.click(Constants.DeleteProfile);
    await this.adminPage.click(Constants.ConfirmDelete);
    await this.adminPage.waitForSelector(Constants.NewAppProfile)
    const visiblenew = await this.adminPage.locator(Constants.NewAppProfile);
    await visiblenew.waitFor({ state: "visible" });// added comand bcz of deleted operation is not doing completely
  }

  public async changeValueOfalwaysRender() {
    await this.adminPage.click(Constants.ValueTextBox);
    await this.adminPage.waitForSelector(Constants.ValueTextInputBox);
    await this.adminPage.fill(
      Constants.ValueTextInputBox,
      Constants.ValueAsTrue
    );
    await this.adminPage.click(Constants.SaveEmailBtn);
  }

  public async goToCaseSession() {
    const IsProductBug = await this.adminPage.isVisible(Constants.CSWDropDown);
    if (IsProductBug) {
      await this.adminPage.click(Constants.CSWDropDown);
      await this.adminPage.click(Constants.CSWDropDownSelector);
      await this.adminPage.waitForTimeout(1000);
    }
  }

  public async NavigateToCustomerServiceAgentDashboard() {
    const DashboardBtn = await this.adminPage.locator(Constants.ValidateServiceAgentDashboard);
    await DashboardBtn.waitFor({ state: "visible" });
    await this.adminPage.click(Constants.ValidateServiceAgentDashboard);
    await page.waitForLoadState("domcontentloaded");
  }
  public async skipCSWBug() {
    await this.adminPage.waitForSelector(Constants.CSWDropDown, { timeout: 5000 });
    await this.adminPage.click(Constants.CSWDropDown);
    await this.adminPage.click(Constants.CSWDropDownSelector);
    await this.adminPage.waitForTimeout(1000);
  }

  public async runMacroInSession(entitylisttitle: string) {
    //Time Delay for Loading Productivity Pane
    await this.adminPage.waitForSelector(Constants.NavigateToAgentScript, {
      setTimeout: 1000,
    });
    await this.adminPage.waitForTimeout(4000);
    await this.adminPage.click(Constants.NavigateToAgentScript);
    await this.adminPage.waitForTimeout(4000);
    await this.adminPage.click(Constants.MacroRunButton);
    await this.adminPage.waitForTimeout(4000);
    const MacroValidate = await this.adminPage.isVisible(entitylisttitle);
    return MacroValidate;
  }

  public async runMacroInSessionAndValidate(agentScriptName: string, entitylisttitle: string) {
    //Time Delay for Loading Productivity Pane
    await this.adminPage.waitForSelector(Constants.NavigateToAgentScript, {
      setTimeout: 10000,
    });
    await this.adminPage.waitForTimeout(4000);
    await this.adminPage.click(Constants.NavigateToAgentScript);
    await this.adminPage.waitForTimeout(4000);

    await this.adminPage.selectOption(
      Constants.AgentScriptDropDown, { label: agentScriptName }
    );

    await this.adminPage.waitForTimeout(4000);
    await this.adminPage.waitForSelector(Constants.MacroRunButton);
    await this.adminPage.click(Constants.MacroRunButton);
    await this.adminPage.waitForTimeout(4000);
    await this.adminPage.waitForSelector(entitylisttitle);
    const MacroValidate = await this.adminPage.isVisible(entitylisttitle);
    return MacroValidate;
  }

  public async runDashboardMacroInSessionAndValidate(entitylisttitle: string, dashboardtitle: string) {
    //Time Delay for Loading Productivity Pane
    await this.adminPage.waitForSelector(Constants.NavigateToAgentScript, {
      setTimeout: 1000,
    });
    await this.adminPage.waitForTimeout(4000);
    await this.adminPage.click(Constants.NavigateToAgentScript);
    await this.adminPage.waitForSelector(Constants.MacroDropdown)
    await this.adminPage.selectOption(Constants.MacroDropdown, { label: entitylisttitle })
    await this.adminPage.click(Constants.MacroRunButton);
    await this.adminPage.waitForSelector(dashboardtitle)
    const MacroValidate = await this.adminPage.isVisible(dashboardtitle);
    return MacroValidate;
  }
  public async deleteAgentScriptnNew(page: Page, startPage: any, agentScript: string) {
    await this.openAppLandingPage(page);
    await startPage.goToMyApp(Constants.CustomerServiceAdminCenter);
    await this.adminPage.waitForSelector(Constants.ProductivitySiteMap);
    await this.adminPage.click(Constants.ProductivitySiteMap);
    await this.adminPage.click(Constants.ManagedAgentScript);
    await this.adminPage.click(Constants.SearchBox);
    await this.adminPage.fill(Constants.SearchBox, agentScript);
    await this.adminPage.click(Constants.SearchThisViewStartBtn);
    await this.adminPage.waitForSelector(Constants.SelectAllCheck, {
      timeout: 10000,
    });
    await this.adminPage.click(Constants.SelectAllCheck);
    await this.adminPage.click(Constants.ASDeactivate);
    await this.adminPage.waitForTimeout(2000);
    await this.adminPage.click(Constants.ConfirmASDeactivate);
    await this.adminPage.waitForTimeout(2000);
  }

  public async deleteInactiveAgentScript(delRecord: string) {
    await this.adminPage.click(Constants.Agentscriptdropdown);
    await this.adminPage.click(Constants.Inactiveagentscripvalue);
    await this.adminPage.click(Constants.SearchBox);
    await this.adminPage.fill(Constants.SearchBox, delRecord);
    await this.adminPage.click(Constants.SearchThisViewStartBtn);
    await this.adminPage.waitForSelector(Constants.SelectAllCheck, {
      timeout: 10000,
    });
    await this.adminPage.click(Constants.SelectAllCheck);
    await this.adminPage.click(Constants.OCADelete);
    await this.adminPage.waitForTimeout(2000);
    await this.adminPage.click(Constants.OCAConfirmDelete);
    await this.adminPage.waitForTimeout(2000);
  }

  public async agentScriptStepforText(AgentScriptStep: string, UniqueName: any, TargetVal: string, Actiontype: any) {
    await this.adminPage.click(Constants.AgentScriptStepTitle);
    await this.adminPage.click(Constants.NewAgentScriptStep);
    await this.adminPage.fill(Constants.NameField, AgentScriptStep);
    await this.adminPage.fill(Constants.UniqueNameField, UniqueName);
    await this.adminPage.fill(Constants.AgentscriptStepOrderfield, Constants.Ordervalue1);
    await this.adminPage.click(Constants.ActionType, Actiontype);
    await this.adminPage.keyboard.press('ArrowDown');
    await this.adminPage.keyboard.press('Enter');
    await this.adminPage.fill(Constants.TextInstruction, TargetVal);
    await this.adminPage.click(Constants.SaveAndCloseButton);
    await this.adminPage.waitForTimeout(4000);
  }

  public async agentScriptStepforScript(AgentScriptStep: string, UniqueName: any, TargetVal: string, Actiontype: any) {
    await this.adminPage.click(Constants.AgentScriptStepTitle);
    await this.adminPage.click(Constants.NewAgentScriptStep);
    await this.adminPage.fill(Constants.NameField, AgentScriptStep);
    await this.adminPage.fill(Constants.UniqueNameField, UniqueName);
    await this.adminPage.fill(Constants.AgentscriptStepOrderfield, Constants.Ordervalue3);
    await this.adminPage.click(Constants.ActionType, Actiontype);
    // time delay for action perform
    await this.adminPage.fill(Constants.TargetScriptLookUpField, TargetVal);
    await this.adminPage.click(Constants.AgentScriptSearchIcon);
    await this.adminPage.keyboard.press('ArrowDown');
    await this.adminPage.keyboard.press('Enter');
    await this.adminPage.click(Constants.SaveAndCloseButton);
    await this.adminPage.waitForTimeout(4000);
  }

  public async genericSession(SessionName: any, UniqueName: any) {
    await this.adminPage.click(Constants.AgentExperience);
    await this.adminPage.click(Constants.ManagedSession);
    await this.adminPage.click(Constants.NewButton);
    await this.adminPage.fill(Constants.NameField, SessionName);
    await this.adminPage.fill(Constants.UniqueNameField, UniqueName);
    await this.adminPage.click(Constants.GenericSessionType);
    await this.adminPage.click(Constants.GenericSessionValue);
    await this.adminPage.fill(Constants.AnchorTab, Constants.CustomerSummary);
    await this.adminPage.keyboard.press('ArrowDown');
    await this.adminPage.keyboard.press('Enter');
    await this.adminPage.click(Constants.Save);
    // Time Delay to load the page
    await this.adminPage.waitForTimeout(4000);
  }

  public async runFlowMacroAndValidate(agentChat: any) {
    //Time Delay for Loading Productivity Pane
    await agentChat.waitForSelector(Constants.NavigateToAgentScript, { setTimeout: 10000 });
    //time delar for loading page
    await agentChat.waitForTimeout(4000);
    await agentChat.click(Constants.NavigateToAgentScript);
    //time delar for action perform
    await agentChat.waitForTimeout(4000);
    await agentChat.click(Constants.MacroRunButton);
    //time delar for run
    await agentChat.waitForTimeout(4000);
    const iframe = await (await agentChat.waitForSelector(Constants.FlowIframe)).contentFrame();
    const iframeChild = await (await iframe.waitForSelector(Constants.FlowChildIframe)).contentFrame();
    await iframeChild.click(Constants.RunFlow1);
    const FlowValidate = await iframeChild.isVisible(Constants.Done);
    return FlowValidate;
    await iframeChild.click(Constants.Done1);
  }

  public async runTextAndValidate(agentChat: any, entitylisttitle: string) {
    //Time Delay for Loading Productivity Pane
    await agentChat.waitForSelector(Constants.NavigateToAgentScript, { setTimeout: 10000 });
    //time delar for loading page
    await agentChat.waitForTimeout(4000);
    await agentChat.click(Constants.RunText);
    //time delar for run
    await agentChat.waitForTimeout(4000);
    await agentChat.click(Constants.Text);
    const MacroValidate = await agentChat.isVisible(entitylisttitle);
    return MacroValidate;
  }

  public async parentChildCase(PCOption: any) {
    await this.adminPage.click(Constants.ServiceSiteBtn);
    await this.adminPage.click(Constants.ServiceManagementBtn);
    await this.adminPage.click(Constants.ParentChildSetting);
    await this.adminPage.waitForTimeout(2000);
    await this.adminPage.click(Constants.ParentChildDropdown);
    await this.adminPage.click(PCOption);
    await this.adminPage.waitForTimeout(2000);
    await this.adminPage.click(Constants.PCSave);
  }
  public async createChildCase() {
    await this.adminPage.click(Constants.MoreOptionInCase);
    await this.adminPage.click(Constants.CreateChildCase);
    await this.adminPage.waitForTimeout(2000);
    await this.adminPage.fill(Constants.CaseTitleField, Constants.CaseTitleName);
    await this.adminPage.click(Constants.SaveAndClose);
    await this.adminPage.waitForTimeout(2000);
  }

  public async mergeCase(SelectCase: any) {
    await this.adminPage.click(Constants.SearchBox, { timeout: 50000 });
    await this.adminPage.fill(Constants.SearchBox, SelectCase);
    await this.adminPage.click(Constants.StartSearch);
    //Time delay to load search content
    await this.adminPage.waitForSelector(Constants.SelectAll, { timeout: 10000 });
    //await this.adminPage.click(Constants.SelectAll);
    await this.adminPage.click(Constants.SelectMergeP1);
    await this.adminPage.click(Constants.SelectMergeP2);
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

  public async createAdvancedQueue(queueName: string) {
    await this.adminPage.click(Constants.QueueBtn);
    await this.adminPage.click(Constants.AdvancedQueue);
    await this.adminPage.click(Constants.NewQueue);
    await this.adminPage.fill(Constants.QueueField, queueName);
    await this.adminPage.click(Constants.SelectQueueType);
    await this.adminPage.click(Constants.SelectRecord);
    await this.adminPage.fill(Constants.GroupNumber, Constants.LabelNum);
    await this.adminPage.click(Constants.CreateQueue);
  }

  public async insertParametersInOldSustumersummary() {
    await this.adminPage.click(Constants.AgentExperience);
    await this.adminPage.click(Constants.ManageApplicationTab);
    await this.adminPage.fill(Constants.SearchBox, Constants.OldCustomerSummary);
    await this.adminPage.click(Constants.SearchThisViewStartBtn);
    await this.adminPage.click(Constants.OldCusytomerSummaryTitleSelect);
    await this.adminPage.waitForSelector(Constants.EntityNameBox);
    await this.adminPage.click(Constants.EntityNameBox);
    await this.adminPage.waitForSelector(Constants.EntityNameInputBox);
    //time delar for action
    await this.adminPage.waitForTimeout(2000);
    await this.adminPage.click(Constants.EntityNameInputBox);
    await this.adminPage.fill(Constants.EntityNameInputBox, Constants.EntityNameOclive);
    //time delar for action
    await this.adminPage.waitForTimeout(4000);
    await this.adminPage.waitForSelector(Constants.NextPage);
    await this.adminPage.click(Constants.NextPage);
    await this.adminPage.waitForSelector(Constants.FormIdBox);
    await this.adminPage.click(Constants.FormIdBox);
    await this.adminPage.waitForSelector(Constants.FormIdInputBox);
    //time delar for loading page
    await this.adminPage.waitForTimeout(2000);
    await this.adminPage.click(Constants.FormIdInputBox);
    await this.adminPage.fill(Constants.FormIdInputBox, Constants.FormIdInputvalue);
    await this.adminPage.click(Constants.Save);
    await this.adminPage.waitForTimeout(3000);
  }
  public async createApplicationTabInOC(name: String, uniqueName: String, pageTypeOptionValue: any) {
    await this.adminPage.click(Constants.AgentExperience);
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

  public async closeSearchresult() {
    await this.adminPage.click(Constants.CloseSearch);
    await this.adminPage.waitForTimeout(1000);
  }
  public async details() {
    await this.adminPage.click(Constants.Details);
    await this.adminPage.waitForTimeout(2000);
  }

  public async selectTheRow() {
    await this.adminPage.click(Constants.SelectTheItem);
    await this.adminPage.waitForTimeout(1000);
  }

  public async openGenericSession(applicationTabName: string, ApplicationTabSearchResult: string) {
    await this.adminPage.click(Constants.AgentExperience);
    await this.adminPage.click(Constants.ManagedSession);
    await this.adminPage.fill(Constants.SessionSearchThisView, Constants.SessionTemplateName);
    await this.adminPage.click(Constants.SearchThisViewStartBtn);
    await this.adminPage.click(Constants.RefreshBtn);
    await this.adminPage.waitForSelector(Constants.SelectAllRowsBtn);
    await this.adminPage.click(Constants.SelectAllRowsBtn);
    await this.adminPage.waitForSelector(Constants.EditBtn, { timeout: 5000 });
    await this.adminPage.click(Constants.EditBtn);
    //Time Delay to load the page
    await this.adminPage.waitForTimeout(3000);
    await this.adminPage.click(Constants.MoreCommandsForApplicationTab);
    await this.adminPage.click(Constants.AddExistingApplicationTabsBtn);
    await this.adminPage.fill(Constants.LookForRecordsField, applicationTabName);
    await this.adminPage.click(ApplicationTabSearchResult);
    await this.adminPage.waitForTimeout(1000);
    await this.adminPage.click(Constants.AddBtn);
    await this.adminPage.waitForTimeout(1000);
    await this.adminPage.click(Constants.SaveAndCloseButton);
    await this.adminPage.click(Constants.RefreshBtn);
  }

  public async chooseSecondAnchorTab() {
    await this.adminPage.click(Constants.AgentExperience);
    await this.adminPage.click(Constants.ManagedSession);
    await this.adminPage.fill(Constants.SessionSearchThisView, Constants.SessionTemplateName);
    await this.adminPage.click(Constants.SearchThisViewStartBtn);
    await this.adminPage.click(Constants.RefreshBtn);
    await this.adminPage.waitForSelector(Constants.SelectAllRowsBtn);
    await this.adminPage.click(Constants.SelectAllRowsBtn);
    await this.adminPage.waitForSelector(Constants.EditBtn, { timeout: 5000 });
    await this.adminPage.click(Constants.EditBtn);
    //Time Delay for action
    await this.adminPage.waitForTimeout(3000);
    await this.adminPage.click(Constants.AnchorTabLookupResult);
    await this.adminPage.click(Constants.AnchorTabSearchbtn);
    await this.adminPage.click(Constants.AppTabSearchReasult);
    await this.adminPage.click(Constants.Save);
    await this.adminPage.waitForTimeout(3000);
  }

  public async anchorTabKnowledgeSearch() {
    await this.adminPage.click(Constants.WorkspaceSiteMap);
    await this.adminPage.click(Constants.ManagedSession);
    await this.adminPage.click(Constants.NewButton);
    await this.adminPage.fill(Constants.NameField, Constants.SessionTemplateName);
    await this.adminPage.fill(Constants.UniqueNameField, Constants.SessionTemplateUniqueName);
    await this.adminPage.click(Constants.GenericSessionType);
    await this.adminPage.keyboard.press('ArrowDown');
    await this.adminPage.keyboard.press('Enter');
    await this.adminPage.click(Constants.AnchorTabSearchBox);
    await this.adminPage.click(Constants.AnchorTabInputBox);
    await this.adminPage.click(Constants.AnchorTabSearchIcon);
    await this.adminPage.click(Constants.AnchorTabSearchResult1);
    await this.adminPage.click(Constants.SaveAndCloseButton);
    //Time Delay to load the page
    await this.adminPage.waitForTimeout(4000);
  }

  public async notification(notificationName: string) {
    await this.adminPage.click(Constants.WorkspaceSiteMap);
    await this.adminPage.click(Constants.ManageNotificationBtn);
    await this.adminPage.click(Constants.NewNotificationTemplate);
    await this.adminPage.waitForSelector(Constants.NameField, { setTimeout: 2000 });
    await this.adminPage.fill(Constants.NameField, notificationName);
    await this.adminPage.click(Constants.UniqueNameField);
    await this.adminPage.fill(Constants.UniqueNameField, Constants.NotificationUniqueName);
    await this.adminPage.click(Constants.TitleInputField);
    await this.adminPage.fill(Constants.TitleInputField, notificationName)
    await this.adminPage.click(Constants.SaveEmailBtn);
    await this.adminPage.click(Constants.MoreCommandsForNotificationField);
    await this.adminPage.click(Constants.AddExistingNotificationField);
    await this.adminPage.click(Constants.LookUpField);
    await this.adminPage.fill(Constants.LookUpField, Constants.Title);
    await this.adminPage.waitForSelector(Constants.TitleOfTheCase, { setTimeout: 2000 });
    await this.adminPage.click(Constants.TitleOfTheCase)
    await this.adminPage.click(Constants.TitleOfTheEntity);
    await this.adminPage.click(Constants.Add);
    await this.adminPage.click(Constants.SaveEmailBtn);
  }

  public async createIntakeRule(ruleName: string) {
    await this.adminPage.click(Constants.CreateRuleBtn);
    await this.adminPage.fill(Constants.RuleNameField, ruleName);
    await this.adminPage.click(Constants.MapToType);
    await this.adminPage.click(Constants.WorkStreamType);
    await this.adminPage.click(Constants.WorkStreamValue);
    await this.adminPage.click(Constants.SelectWorkStream);
    await this.adminPage.click(Constants.CreateAppProfile);
    await this.adminPage.click(Constants.CretaeWithoutCondition)
  }

  public async createRecordWorkStream(workStreamName: string) {
    await this.adminPage.click(Constants.WorkStreamSitemap);
    await this.adminPage.click(Constants.NewWorkStreamBtn);
    await this.adminPage.fill(Constants.WSNameField, workStreamName);
    await this.adminPage.click(Constants.SelectWorkStreamType);
    await this.adminPage.click(Constants.SelectRecord);
    await this.adminPage.click(Constants.QueueChooseExistingDropdown);
    await this.adminPage.click(Constants.Queue);
    await this.adminPage.click(Constants.CreateWorkStream);
    await this.adminPage.waitForTimeout(4000);
  }

  public async addNotificationInWorkStream() {
    await this.adminPage.waitForSelector(Constants.ShowAdvancedSettings, { setTimeout: 4000 });
    await this.adminPage.click(Constants.ShowAdvancedSettings);
    await this.adminPage.click(Constants.NotificationEditBtn);
    await this.adminPage.click(Constants.SelectNotification);
    await this.adminPage.click(Constants.TestNotification);
    await this.adminPage.click(Constants.NotificationSaveAndClose);
  }


  public async deleteRoutingRuleSet() {
    await this.adminPage.click(Constants.RoutingSiteMap);
    await this.adminPage.click(Constants.SetUpRecordRouting);
    await this.adminPage.click(Constants.Case);
    await this.adminPage.click(Constants.SeeMoreBasicRoutingButton);
    await this.adminPage.click(Constants.StepCheckbox);
    await this.adminPage.click(Constants.Deactivate);
    await this.adminPage.click(Constants.ConfirmDeactivation);
    await this.adminPage.click(Constants.StepCheckbox);
    await this.adminPage.click(Constants.DeleteButton);
    await this.adminPage.click(Constants.ConfirmDelete);
  }

  public async deleteRecordRouting() {
    await this.adminPage.click(Constants.RoutingSiteMap);
    await this.adminPage.click(Constants.SetUpRecordRouting);
    await this.adminPage.click(Constants.SelectAllBtn);
    await this.adminPage.click(Constants.DeleteButton);
    await this.adminPage.click(Constants.DeleteRecordType);
  }

  public async deleteAdvanceQueue(queueName: string) {
    await this.adminPage.click(Constants.QueueBtn);
    await this.adminPage.click(Constants.AdvancedQueue);
    await this.adminPage.waitForSelector(Constants.SearchQueue)
    await this.adminPage.fill(Constants.SearchQueue, queueName);
    await this.adminPage.click(Constants.SelectQueue);
    await this.adminPage.click(Constants.DeleteQueue);
    await this.adminPage.click(Constants.DeleteQueueConfirmBtn);
  }

  public async deleteRecordWorkstream(workstreamName: string) {
    await this.adminPage.click(Constants.WorkStreamSitemap);
    await this.adminPage.waitForSelector(Constants.SearchWS);
    await this.adminPage.fill(Constants.SearchWS, workstreamName);
    await this.adminPage.click(Constants.SelectWorkstream);
    await this.adminPage.click(Constants.EditWS);
    await this.adminPage.click(Constants.SeeMore);
    await this.adminPage.click(Constants.SelectAllBtn);
    await this.adminPage.click(Constants.DeleteIntakeRule);
    await this.adminPage.click(Constants.WorkStreamSitemap);
    await this.adminPage.waitForSelector(Constants.SearchWS);
    await this.adminPage.fill(Constants.SearchWS, workstreamName);
    await this.adminPage.click(Constants.SelectWorkstream);
    await this.adminPage.click(Constants.DeleteCase);
    await this.adminPage.click(Constants.ConfirmDeleteWS);
  }

  public async deleteNotification(notificationName: string) {
    await this.adminPage.click(Constants.WorkspaceSiteMap);
    await this.adminPage.click(Constants.ManageNotification);
    await this.adminPage.waitForSelector(Constants.SearchBox);
    await this.adminPage.fill(Constants.SearchBox, notificationName);
    await this.adminPage.click(Constants.SearchThisViewStartBtn);
    await this.adminPage.click(Constants.SelectAllBtn);
    await this.adminPage.click(Constants.MoreCommandsForNotificationTemplate);
    await this.adminPage.click(Constants.DeleteNotificationTemplate);
    await this.adminPage.click(Constants.DeleteButton);
  }

  public async createRecordRouting(recordType: string) {
    await this.adminPage.click(Constants.RoutingSiteMap);
    await this.adminPage.click(Constants.SetUpRecordRouting);
    await this.adminPage.click(Constants.AddRecordType);
    await this.adminPage.waitForTimeout(1000);
    await this.adminPage.fill(Constants.RecordTypeField, recordType);
    await this.adminPage.keyboard.press("Enter");
    await this.adminPage.click(Constants.AddRecord);
    await this.adminPage.click(Constants.Case);
  }

  public async createRoutingRuleSet(ruleName: string, ruleItemName: string, queueName: string) {
    await this.adminPage.click(Constants.CreateRoutingRuleSet);
    await this.adminPage.fill(Constants.NameField, ruleName);
    await this.adminPage.click(Constants.Save);
    // Time Delay to load the page
    await this.adminPage.waitForTimeout(3000);
    await this.adminPage.click(Constants.MoreCommandsForRule);
    await this.adminPage.click(Constants.NewRuleItemBtn);
    // Time Delay to load the page
    await this.adminPage.waitForTimeout(3000);
    await this.adminPage.fill(Constants.RuleItemTitleField, ruleItemName);
    await this.adminPage.click(Constants.RouteTo);
    // await this.adminPage.click(Constants.RouteToQueue);
    await this.adminPage.keyboard.press("ArrowDown");
    await this.adminPage.keyboard.press("Enter");
    await this.adminPage.fill(Constants.AddToQueue, queueName);
    // Time Delay to load the page
    await this.adminPage.waitForTimeout(1000);
    await this.adminPage.click(Constants.Queue);
    await this.adminPage.click(Constants.SaveAndCloseButton);
    // Time Delay to load the page
    await this.adminPage.waitForTimeout(1000);
    await this.adminPage.click(Constants.Activate);
    await this.adminPage.click(Constants.ConfirmBtn);
    // Time Delay to load the page
    await this.adminPage.waitForTimeout(2000);
  }

  public async applyRoutingRuleToCase(Case: string) {
    await this.adminPage.click(Constants.CasesSitemapBtn);
    await this.adminPage.click(Constants.SearchBox);
    await this.adminPage.fill(Constants.SearchBox, Case);
    await this.adminPage.click(Constants.SearchTheView);
    await this.adminPage.click(Constants.SelectAllTheRowsBtn);
    await this.adminPage.click(Constants.ApplyRoutingRule);
    await this.adminPage.click(Constants.RouteBtn);
  }

  public async validateTheNotification(agentChat: any, validateNotification: string) {
    //Time delay to perform the action
    await agentChat.waitForSelector(validateNotification, { timeout: 3000 });
    const PageValidate = await agentChat.isVisible(validateNotification);
    expect(PageValidate).toBeTruthy();
  }

  public async verifyOpenedTabBySorting(tabName: string) {
    try {
      await this.adminPage.click(Constants.NavigateToAgentScript)
      await this.adminPage.waitForSelector(Constants.CreatedOn);
      await this.adminPage.click(Constants.CreatedOn);
      await this.adminPage.click(Constants.SortNewerToOlder);
      await this.adminPage.waitForSelector(tabName);
      return true;
    } catch {
      return false;
    }
  }

  public async addAgentScripttoDefaultChatSessionWithParameter(
    agentScriptName: string
  ) {
    await this.adminPage.waitForSelector(Constants.WorkspaceSiteMap);
    await this.adminPage.click(Constants.WorkspaceSiteMap);
    await this.adminPage.waitForSelector(Constants.ManagedSession);
    await this.adminPage.click(Constants.ManagedSession);
    await this.adminPage.waitForSelector(Constants.CaseEntitySession);
    await this.adminPage.click(Constants.CaseEntitySession);
    await this.adminPage.waitForSelector(Constants.AgentScriptsTab);
    await this.adminPage.click(Constants.AgentScriptsTab);
    await this.adminPage.locator(Constants.MoreCommandsForAgentScript).click();
    await this.adminPage.locator(Constants.AddExistingAgentScriptsBtn).click();
    await this.adminPage.locator(Constants.LookForRecordsField).click();
    await this.adminPage.locator(Constants.LookForRecordsField).fill(agentScriptName);
    await this.adminPage.waitForTimeout(2000); // we are using keyboard commands 2seconds wait is needed.
    await this.adminPage.keyboard.press("ArrowDown");
    await this.adminPage.waitForTimeout(2000); // we are using keyboard commands 2seconds wait is needed.
    await this.adminPage.keyboard.press("Enter");
    await this.adminPage.waitForTimeout(2000); // we are using keyboard commands 2seconds wait is needed.
    await this.adminPage.waitForSelector(Constants.AddBtn);
    await this.adminPage.click(Constants.AddBtn);
    await this.adminPage.waitForTimeout(Constants.FourThousandsMiliSeconds);//Needed to add agent script
  }

  public async removeAgentScripttoDefaultCaseSession() {
    await this.adminPage.click(Constants.WorkspaceSiteMap);
    await this.adminPage.waitForTimeout(4000);
    await this.adminPage.waitForSelector(Constants.ManagedSession);
    await this.adminPage.click(Constants.ManagedSession);
    await this.adminPage.click(Constants.ChatSession);
    await this.adminPage.waitForSelector(Constants.AgentScriptsTab);
    await this.adminPage.click(Constants.AgentScriptsTab);

    const Isavailable = await this.adminPage.isVisible(Constants.SelectAllCheck);
    if (Isavailable) {
      await this.adminPage.click(Constants.SelectAllCheck);
      await this.adminPage.click(Constants.MoreCommandsForAgentScript);
      await this.adminPage.click(Constants.RemoveAll);
    }
  }

  public async CSWAppDesignerPage() {
    await this.adminPage.click(Constants.LandingPage);
    const selector = await this.adminPage.waitForSelector(Constants.ApplandingIframe);
    const iframe = await selector.contentFrame();
    await iframe.waitForSelector(Constants.CSWMoreOptions);
    await iframe.click(Constants.CSWMoreOptions);
    await iframe.waitForSelector(Constants.OpenAppDesigner);
    await iframe.click(Constants.OpenAppDesigner);
  }

  public async enableInAppNotificatiosAndValidate(title: string) {
    const [page1] = await Promise.all([
      await this.adminPage.waitForEvent('popup'),
    ]);
    const welcomePopup = await this.waitUntilSelectorIsVisible(Constants.Getstarted, Constants.Five, page1);
    if (welcomePopup) {
      await page1.click(Constants.Getstarted);
    }
    await page1.waitForSelector(Constants.settingsinAppDesigner);
    await page1.click(Constants.settingsinAppDesigner);
    await page1.waitForSelector(Constants.FeaturesButton);
    await page1.click(Constants.FeaturesButton);
    await page.waitForLoadState();
    const notificationIsEnabled = await page1.isVisible(Constants.NotificationEnabled);
    if (!notificationIsEnabled) {
      await page1.waitForSelector(Constants.InAppNotification);
      await page1.click(Constants.InAppNotification);
      const isenabled = await this.waitUntilSelectorIsVisible(Constants.InappNotificationEnabled, Constants.Five, page1);
      expect(isenabled).toBeTruthy();
      await page1.waitForSelector(Constants.PCSave);
      await page1.click(Constants.PCSave);
      await this.waitUntilSelectorIsHidden(Constants.Spinner, Constants.Five, page1);
      await page1.isVisible(Constants.PublishInAppDesigner);
      await page1.waitForSelector(Constants.PublishInAppDesigner);
      await page1.click(Constants.PublishInAppDesigner);
      await page1.waitForSelector(Constants.PlayButton);
      await page1.click(Constants.PlayButton);
    }
    else {
      await page1.waitForSelector(Constants.CloseSettings);
      await page1.click(Constants.CloseSettings);
      await page1.waitForSelector(Constants.PublishInAppDesigner);
      await page1.click(Constants.PublishInAppDesigner);
      await page1.waitForSelector(Constants.PlayButton);
      await page1.click(Constants.PlayButton);
    }

    // Validation
    const [page2] = await Promise.all([
      await page1.waitForEvent('popup'),
    ]);
    await page2.waitForLoadState();
    await page2.reload();
    await this.waitUntilSelectorIsVisible(Constants.NotificationButton, Constants.Five, page2);
    await page2.click(Constants.NotificationButton);
    await this.waitUntilSelectorIsVisible(Constants.OpenRecord, Constants.Five, page2);
    await page2.click(Constants.OpenRecord);
    await this.waitUntilSelectorIsVisible(Constants.HomeButton, Constants.Five, page2);
    await page2.click(Constants.HomeButton);
    await page2.click(Constants.NotificationButton);
    await page2.click(Constants.OpenRecord);
    await this.waitUntilSelectorIsVisible(stringFormat(Constants.CaseTitle, title), Constants.Five, page2);
  }

  public async incidentId(entityName: string): Promise<string> {
    return await this.adminPage.evaluate(
      async (title) => {
        var record = await (window as any).Xrm.WebApi.retrieveMultipleRecords("incident",
          "?$select=incidentid&$filter=title eq '" + title + "'"
        );
        return await record.entities[0].incidentid;
      }, [entityName]
    );
  }

  public async enableNewLayout() {
    await this.adminPage.evaluate(
      async () => {
        var context = await (window as any).Xrm.Utility.getGlobalContext().saveSettingValue("msdyn_MultiSessionLayoutImprovements", true);
        return await context;
      }
    );
  }

  public async enableNotificationText() {
    await this.adminPage.evaluate(
      async () => {
        await fetch(window.origin + "/api/data/v9.0/SaveSettingValue()", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            AppUniqueName: "msdyn_CustomerServiceWorkspace",
            SettingName: "AllowNotificationsEarlyAccess",
            Value: "true",
          }),
        });
      }
    );
  }

  public async enableNotificationIcon(userId: string,IncidentId: string) {
    await this.adminPage.evaluate(
      async ([userid, incidentid]) => {
        var systemuserid = userid;
        var incidentid = incidentid;
        var notificationRecord =
        {
          "title": "Cases demo with link [here](?pagetype=entityrecord&etn=incident&id=" + incidentid + ")",
          "body": "cases demo [here](?pagetype=entityrecord&etn=incident&id=" + incidentid + ")",
          "ownerid@odata.bind": "/systemusers(" + systemuserid + ")",
          "icontype": 100000000, // info
          "data": JSON.stringify({
            "actions": [
              {
                "title": "Open record",
                "data": { "url": "?pagetype=entityrecord&etn=incident&id=" + incidentid }
              },
              {
                "title": "Open record inline",
                "data": { "url": "?pagetype=entityrecord&etn=incident&id=" + incidentid, "navigationTarget": "inline" }
              },
              {
                "title": "Open record newWindow",
                "data": { "url": "?pagetype=entityrecord&etn=incident&id=" + incidentid, "navigationTarget": "newWindow" }
              },
              {
                "title": "Open record dialog", "data": { "url": "?pagetype=entityrecord&etn=incident&id=" + incidentid, "navigationTarget": "dialog" }
              }
            ]
          })
        }
        await (window as any).Xrm.WebApi.createRecord("appnotification", notificationRecord).
          then(
            function success(result) {
              console.log("notification created with multiple actions: " + result.id);
            },
            function (error) {
              console.log(error.message);
            });
      }, [userId, IncidentId]
    );
  }

  public async disableNewLayout() {
    await this.adminPage.evaluate(
      async () => {
        var context = await (window as any).Xrm.Utility.getGlobalContext().saveSettingValue("msdyn_MultiSessionLayoutImprovements", false);
        return await context;
      }
    );
  }

  public async createUpdateMacro(macroName: string, passingStr: string) {
    await this.adminPage.waitForSelector(Constants.ProductivitySiteMap);
    await this.adminPage.click(Constants.ProductivitySiteMap);
    await this.adminPage.waitForSelector(Constants.ManageMacros);
    await this.adminPage.click(Constants.ManageMacros);
    await this.adminPage.click(Constants.NewButton);
    await this.adminPage.fill(Constants.NameField, macroName);
    const iframeParent = await (
      await this.adminPage.waitForSelector(Constants.MacroDesignerIFrame)
    ).contentFrame();
    const iframeChild = await (
      await iframeParent.waitForSelector(Constants.MacroDesignerIFrameChild)
    ).contentFrame();
    await iframeChild.waitForSelector(Constants.StartMacroExecutionBtn);
    await iframeChild.click(Constants.StartMacroExecutionBtn);
    await iframeChild.waitForSelector(Constants.NewStepBtn);
    await iframeChild.click(Constants.NewStepBtn);
    await iframeChild.click(Constants.SearchPhraseForPopulatedPhraseMacro);
    await iframeChild.fill(
    Constants.SearchPhraseLabelField,
    passingStr
    );
    await iframeChild.fill(
    Constants.SearchPhraseStringField,
    Constants.SearchPhraseValue
    );
    await iframeParent.click(Constants.SaveAndCloseButton2);
    await this.adminPage.waitForTimeout(3000);
    await this.waitForDomContentLoaded();
  }

  public async CreateSessionTemplatefromCSA() {
    let rnd: any;
    rnd = this.getRandomNumber();
    await this.adminPage.waitForSelector(Constants.SessionTemplateInOverview);
    await this.adminPage.click(Constants.SessionTemplateInOverview);
    await this.adminPage.waitForSelector(Constants.NewButton);
    await this.adminPage.click(Constants.NewButton);
    await this.adminPage.fill(
      Constants.NameField,
      Constants.SessionTemplateName
    );
    await this.adminPage.fill(
      Constants.UniqueNameField,
      Constants.SessionTemplateUniqueName + rnd
    );
    await this.adminPage.selectOption(Constants.TypeField, {
      label: "Generic",
    });
    await this.adminPage.click(Constants.AnchorTabSearchBox);
    await this.adminPage.click(Constants.AnchorTabSearchIcon);
    await this.adminPage.click(Constants.AnchorTabSearchResult);
    await this.adminPage.click(Constants.SaveAndCloseButton);
    const UnsavedChanges = await this.waitUntilSelectorIsVisible(Constants.ConfirmaDialog, Constants.Two, this.adminPage);
        if (UnsavedChanges) {
            await this.adminPage.click(Constants.ConfirmButton);
        }
  }

  public async createAgentScriptFromCSA(
    AgentScriptName: string,
    AgentScriptUniqueName: string,
  ) {
    let rnd: any;
    rnd = this.getRandomNumber();
    await this.adminPage.waitForSelector(Constants.AgentScriptInOverview);
    await this.adminPage.click(Constants.AgentScriptInOverview);
    await this.adminPage.click(Constants.NewButton);
      await this.adminPage.fill(Constants.NameField, AgentScriptName);
      await this.adminPage.fill(
        Constants.UniqueNameField,
        AgentScriptUniqueName + rnd
      );
      await this.adminPage.click(Constants.SaveAndCloseButton);
      const UnsavedChanges = await this.waitUntilSelectorIsVisible(Constants.ConfirmaDialog, Constants.Two, this.adminPage);
        if (UnsavedChanges) {
            await this.adminPage.click(Constants.ConfirmButton);
        }
  }

  public async addTwoAgentScriptToSesssionTemplateFromCSA(AgentScriptName: any, AgentScriptName2: any) {
    await this.adminPage.waitForSelector(Constants.SessionTemplateInOverview);
    await this.adminPage.click(Constants.SessionTemplateInOverview);
    await this.adminPage.waitForSelector(Constants.SessionSearchThisView);
    await this.adminPage.click(Constants.SessionSearchThisView);
    await this.adminPage.fill(Constants.SessionSearchThisView,Constants.SessionTemplateName);
    await this.adminPage.keyboard.press("Enter");
    await this.adminPage.waitForSelector(stringFormat(Constants.AriaLabel,Constants.SessionTemplateName));
    await this.adminPage.click(stringFormat(Constants.AriaLabel,Constants.SessionTemplateName));
    await this.adminPage.waitForSelector(Constants.AgentScriptsTab);
    await this.adminPage.click(Constants.AgentScriptsTab);
    await this.adminPage.click(Constants.MoreCommandsForAgentScript);
    await this.adminPage.click(Constants.AddExistingAgentScriptsBtn);
    await this.adminPage.fill(Constants.LookForRecordsField, AgentScriptName);
    await this.adminPage.click(Constants.AgentOneSearchResult);
    await this.adminPage.waitForSelector(Constants.SeleectedAgentScriptSearchResult);
    await this.adminPage.fill(Constants.AddMoreRecords, AgentScriptName2);
    await this.adminPage.click(Constants.AgentTwoSearchResult);
    await this.adminPage.waitForSelector(Constants.SeleectedAgentScriptSearchResult);
    await this.adminPage.waitForSelector(Constants.AddBtn)
    await this.adminPage.click(Constants.AddBtn);
    await this.adminPage.click(Constants.MoreCommandsForAgentScript);
    await this.adminPage.click(Constants.RefreshAgentScriptsSubGrid);
  }

  public async EnablingExpressionBuilder() {
    const section = await this.Page.waitForSelector(MacrosConstants.DisableExpressionBuilderRadioBtnSelectorSection);
    await (await section.waitForSelector(MacrosConstants.DisableExpressionBuilderRadioBtnSelector)).click();

    const isExpressionBuilderFlag: boolean = await this.IsExpressionBuilderEnable();
    if (isExpressionBuilderFlag) {
      await this.waitUntilSelectorIsVisible(MacrosConstants.ExpressionBuilderBtnSelector, Constants.Three, this._page, Constants.MaxTimeout);
      await this.Page.click(MacrosConstants.ExpressionBuilderBtnSelector);
    }
    else {
      const section = await this.Page.waitForSelector(MacrosConstants.DisableExpressionBuilderRadioBtnSelectorSection);
      await (await section.waitForSelector(MacrosConstants.DisableExpressionBuilderRadioBtnSelector)).click();
      await this.waitUntilSelectorIsVisible(MacrosConstants.EnableExpressionBuilderRadioBtnSelector, Constants.Five, this._page, Constants.FourThousandsMiliSeconds);
      await this.waitUntilSelectorIsVisible(MacrosConstants.ExpressionBuilderBtnSelector, Constants.Three, this._page, Constants.MaxTimeout);
      await this.Page.click(MacrosConstants.ExpressionBuilderBtnSelector);
    }
  }

  public async IsExpressionBuilderEnable() {
    return await this.waitUntilSelectorIsVisible(
      MacrosConstants.EnableExpressionBuilderRadioBtnSelector, Constants.Five, this.adminPage, Constants.MaxTimeout
    );
  }

  public async addOdataConditionForExpressionBuilderForSessionTemplate() {
    const pIframe = await this.adminPage.waitForSelector(Constants.ExpressionBuilderParentIframe);
    const parentIframe = await pIframe.contentFrame();
    const cIframe = await parentIframe.waitForSelector(Constants.ExpressionBuilderChildIframe);
    const childIframe = await cIframe.contentFrame();
    await childIframe.waitForSelector(Constants.ExpressionBuilderConditionButton);
    await childIframe.click(Constants.ExpressionBuilderConditionButton);
    await childIframe.click(Constants.ExpressionBuilderConditionField1);
    await childIframe.fill(Constants.ExpressionBuilderConditionField1,"{$odata.incident.prioritycode.?$filter=incidentid eq '{caseId}'&$select=prioritycode}");
    await childIframe.click(Constants.ExpressionBuilderConditionFiled2);
    await childIframe.fill(Constants.ExpressionBuilderConditionFiled2,"last name");
    await  parentIframe.click(Constants.ExpressionBuilderSaveAndClose);
    const text = await this.adminPage.waitForSelector(Constants.ExpressionBuilderDialogText);
    expect(await text.textContent()).toContain('Unable to create macro definition');
    await this.waitUntilSelectorIsVisible(Constants.AlertPopUp, Constants.Five, this.adminPage, Constants.MaxTimeout);
    await this.adminPage.click(Constants.OKButton);
  }

  public async deleteSessionTemplateFromCSA() {
    await this.adminPage.waitForSelector(Constants.SessionTemplateInOverview);
    await this.adminPage.click(Constants.SessionTemplateInOverview);
    await this.adminPage.waitForSelector(Constants.SessionSearchThisView);
    await this.adminPage.click(Constants.SessionSearchThisView);
    await this.adminPage.fill(Constants.SessionSearchThisView,Constants.SessionTemplateName);
    await this.adminPage.keyboard.press("Enter");
    await this.adminPage.keyboard.press("Escape");
    await this.adminPage.click(Constants.SelectAllCheck);
    await this.adminPage.click(Constants.DeleteButton);
    await this.adminPage.click(Constants.ConfirmDeleteButton);
  }

  public async deleteAgentScriptFromCSA(AgentScript: string) {
    await this.adminPage.waitForSelector(Constants.AgentScriptInOverview);
    await this.adminPage.click(Constants.AgentScriptInOverview);
    await this.adminPage.waitForSelector(Constants.AgentScriptSearch);
    await this.adminPage.click(Constants.AgentScriptSearch);
    await this.adminPage.fill(Constants.AgentScriptSearch,AgentScript);
    await this.adminPage.keyboard.press("Enter");
    await this.adminPage.keyboard.press("Escape");
    await this.adminPage.hover(stringFormat(Constants.AriaLabel,AgentScript));
    await this.adminPage.click(Constants.SelectFirstCheck);
    await this.adminPage.click(Constants.DeleteButton);
    await this.adminPage.click(Constants.ConfirmDeleteButton);
  }

  public async closeTaskTab() {
    await this.adminPage.click(Constants.CloseTaskTab);
  }

  public async createIncidents(agentChat: any, caseNameList: string[]) {
    let contact = await agentChat.createContactRecord(Constants.XRMContact);
    var count = caseNameList.length;
    for (let i = 0; i < count; i++) {
      await agentChat.createIncidentRecord(caseNameList[i], contact[EntityAttributes.Id], EntityNames.Contact);
    }
  }

  public async enableLayoutImprovements(adminPage) {
    await adminPage.evaluate(
      async () => {
        await (window as any).Xrm.Utility.getGlobalContext().saveSettingValue(
          "msdyn_MultiSessionLayoutImprovements",
          true
        );
        const ctrl = await (
          window as any
        ).Xrm.Utility.getGlobalContext().getCurrentAppSettings()[
          "msdyn_MultiSessionLayoutImprovements"
        ];
        return ctrl;
      }
    );
  }

  public async disableLayoutImprovements(adminPage) {
    await adminPage.evaluate(
      async () => {
        await (window as any).Xrm.Utility.getGlobalContext().saveSettingValue(
          "msdyn_MultiSessionLayoutImprovements",
          false
        );
        const ctrl = await (
          window as any
        ).Xrm.Utility.getGlobalContext().getCurrentAppSettings()[
          "msdyn_MultiSessionLayoutImprovements"
        ];
        return ctrl;
      }
    );
  }

  public async getLatestMacro(agentChat: any, macroName: string) {
    const getMacro = await agentChat.getLatestMacro(macroName);
    var workflowid = getMacro[0].workflowid
    return workflowid;
  }

  public async OpenAgentScriptandSave(
    AgentScriptName: string,
  ) {
    await this.adminPage.waitForSelector(Constants.AgentExperience);
    await this.adminPage.click(Constants.AgentExperience);
    await this.adminPage.waitForSelector(Constants.ManagedAgentScript);
    await this.adminPage.click(Constants.ManagedAgentScript);
    await this.adminPage.locator(Constants.SearchBox).fill(AgentScriptName);
    await this.adminPage.locator(Constants.SearchBox).press('Enter');
    let selctor = "//*[text()='" + AgentScriptName + "']";
    await this.adminPage.waitForSelector(selctor)
    await this.adminPage.click(selctor);
    await this.adminPage.click(Constants.SaveAndCloseButton);
  }

  
  public async executeScript(script: string) {
    return await this.Page.evaluate((scr) => {
      return eval(scr);
    }, script);
  }

  public async createRecord(entityLogicalName: string, data: any) {
    return await this.executeScript(
      `Xrm.WebApi.createRecord('${entityLogicalName}', ${JSON.stringify(data)})`
    );
  }

  public async createContactRecord(lastName: string) {
    return await this.createRecord(EntityNames.Contact, {
      [EntityAttributes.Lastname]: lastName,
    });
  }

  public async createCaseWithAPI(CaseName: string) {
    let rnd = this.getRandomNumber();
    await this.adminPage.waitForSelector(Constants.Home);
    await this.waitForDomContentLoaded();
    // Start case creation using API
    const CaseTitleName = CaseName + rnd;
    const userNamePrefix = Constants.AutomationContact + rnd;
    let contact = await this.createContactRecord(userNamePrefix);
    await this.createIncidentRecord(CaseTitleName, contact[EntityAttributes.Id], EntityNames.Contact);
    return (CaseName + rnd);
    // End of case creation using API
  }

  public async createIncidentRecord(
    title: string,
    customerRecordId: string,
    customerEntityType: string
  ) {
    let createRequestObj = {};
    createRequestObj[EntityAttributes.Title] = title;
    if (customerEntityType === EntityNames.Account) {
      createRequestObj[EntityAttributes.IncidentAccountBindAttribute] =
        "/accounts(" + customerRecordId.toUpperCase() + ")";
    } else if (customerEntityType === EntityNames.Contact) {
      createRequestObj[EntityAttributes.IncidentContactBindAttribute] =
        "/contacts(" + customerRecordId.toUpperCase() + ")";
    }
    return await this.createRecord(EntityNames.Incident, createRequestObj);
  }

}
