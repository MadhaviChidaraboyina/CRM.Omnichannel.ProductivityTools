import { Page } from "playwright";
import { Constants } from "../../common/constants";
import { BasePage } from "pages/BasePage";
import { ConstantsMacros } from "../MacrosTestcases/macrosConstants";

export class FunctionMacros extends BasePage {
  adminPage: any;
  constructor(page: Page) {
    super(page);
    this.adminPage = page;
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

  public async getIdFromUrl(url: any) {
    const params = url.split("?")[1].split("&");
    for (let element of params) {
      const pair = element.split("=");
      if (pair[0] === "id") {
        return pair[1];
      }
    }
  }

  public getRandomNumber() {
    var minm = ConstantsMacros.RadomNumberMin;
    var maxm = ConstantsMacros.RadomNumberMax;
    return Math.floor(Math.random() * (maxm - minm + 1)) + minm;
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

  public async createApplicationTabAndGetId(
    name: string,
    uniqueName: string,
    pageTypeOptionValue: string
  ) {
    let rnd: any;
    rnd = this.getRandomNumber();
    await this.adminPage.waitForSelector(Constants.WorkspaceSiteMap);
    await this.adminPage.locator(Constants.WorkspaceSiteMap).click();
    await this.adminPage.waitForSelector(Constants.ManageApplicationTab);
    await this.adminPage.locator(Constants.ManageApplicationTab).click();
    await this.adminPage.locator(Constants.NewButton).click();
    await this.adminPage.locator(ConstantsMacros.NameField).fill(name);
    await this.adminPage.locator(ConstantsMacros.UniqueNameField).fill(uniqueName + rnd);
    await this.adminPage.locator(ConstantsMacros.PageTypeDropdown).click();
    (await this.adminPage.$(ConstantsMacros.PageTypeDropdown))?.selectOption(
      pageTypeOptionValue
    );
    await this.adminPage.keyboard.press(ConstantsMacros.Tab);
    await this.adminPage.click(Constants.SaveButton);
    // Fill the value of entityName in Entity List
    switch (name) {
      case ConstantsMacros.EntityViewApplicationTab:
        await this.adminPage.waitForSelector(Constants.EntityViewName);
        await this.adminPage.locator(Constants.EntityViewName).click();
        await this.adminPage.waitForSelector(Constants.EntityViewText);
        await this.adminPage.locator(Constants.EntityViewText).fill(Constants.SearchTextValue);
        break;
      case Constants.EntityListApplicationTab:
        await this.adminPage.waitForSelector(ConstantsMacros.EntityListName);
        await this.adminPage.locator(ConstantsMacros.EntityListName).click();
        await this.adminPage.waitForSelector(Constants.EntityListText);
        await this.adminPage.locator(Constants.EntityListText).fill(Constants.EntityListValue);
        break;
      case Constants.WebResourceApplicationTab:
        await this.adminPage.waitForSelector(Constants.WebResourceData);
        await this.adminPage.locator(Constants.WebResourceData).click();
        await this.adminPage.waitForSelector(Constants.WebResourceText);
        await this.adminPage.locator(Constants.WebResourceText).fill(Constants.WebResourceDataValue);
        break;
      case Constants.EntitySearchApplicationTab:
        await this.adminPage.waitForSelector(ConstantsMacros.EntityViewName);
        await this.adminPage.locator(ConstantsMacros.EntityViewName).click();
        await this.adminPage.waitForSelector(Constants.EntityViewText);
        await this.adminPage.locator(Constants.EntityViewText).fill(Constants.SearchTextValue);
        break;
      case Constants.ThirdPartyWebsiteApplicationTab:
        await this.adminPage.waitForSelector(ConstantsMacros.ThirdPartyName);
        await this.adminPage.locator(ConstantsMacros.ThirdPartyName).click();
        await this.adminPage.waitForSelector(Constants.EntityViewText);
        await this.adminPage.locator(Constants.EntityViewText).fill(Constants.SearchTextValue);
        break;
      case Constants.DashboardApplicationTab:
        await this.adminPage.waitForSelector(ConstantsMacros.DashboardName);
        await this.adminPage.locator(ConstantsMacros.DashboardName).click();
        await this.adminPage.waitForSelector(Constants.EntityViewText);
        await this.adminPage.locator(Constants.EntityViewText).fill(Constants.SearchTextValue);
        break;
    }
    await this.adminPage.locator(Constants.SaveButton).click();
    await this.adminPage.click(Constants.RefreshBtn);
    await this.waitForDomContentLoaded();
    return this.getIdFromUrl(await this.adminPage.url());
  }


  public async createMacro(macroName: string, ...params: any[]) {
    const productivityBtn = await this.adminPage.locator(
      Constants.ProductivitySiteMap
    );
    await productivityBtn.waitFor({ state: "visible" });
    await this.adminPage.click(Constants.ProductivitySiteMap);
    const macrosBtn = await this.adminPage.locator(Constants.ManageMacros);
    await macrosBtn.waitFor({ state: "visible" });
    await this.adminPage.click(Constants.ManageMacros);
    const newBtn = await this.adminPage.locator(Constants.NewButton);
    await newBtn.waitFor({ state: "visible" });
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
      case ConstantsMacros.OpenGridMacroName:
        await iframeChild.click(Constants.OpenRecordGrid);
        await iframeChild.fill(
          Constants.EntityLogicalNameField,
          Constants.EntityLogicalNameAccount
        );
        await iframeChild.fill(Constants.ViewIDField, Constants.ViewID);
        await iframeChild.fill(Constants.ViewTypeField, Constants.ViewType);
        break;

      case ConstantsMacros.DoRelevanceSearchMacroName:
        await iframeChild.click(Constants.DoARelevanceSearchBasedOnThePhrase);
        await iframeChild.fill(
          Constants.SearchStringField,
          Constants.SearchString
        );
        break;

      case ConstantsMacros.ResolveCaseMacroName:
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

      case ConstantsMacros.OpenKBSearchMacroName:
        await iframeChild.click(Constants.SearchKnowledgeArticleBasedOnPhrase);
        await iframeChild.fill(
          Constants.SearchStringField,
          Constants.SearchString
        );
        break;

      case ConstantsMacros.OpenKbArticleMacroName:
        await iframeChild.click(Constants.OpenKnowledgeBaseArticle);
        await iframeChild.fill(Constants.EntityRecordIdField, params[0]);
        break;

      case ConstantsMacros.WebResourcesMacroName:
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

      case ConstantsMacros.KBArticleMacroName:
        await iframeChild.click(Constants.OpenKnowledgeBaseArticle);
        await iframeChild.fill(Constants.EntityRecordIdField, params[0]);
        break;

      case Constants.OpenNewFormMacroName:
        await iframeChild.click(Constants.OpenNewForm);
        await iframeChild.fill(
          Constants.EntityLogicalNameField,
          Constants.EntityLogicalNameAccount
        );
        break;

      case Constants.OpenExistingFormMacroName:
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

      case Constants.WebResourceMacroName:
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

      case ConstantsMacros.KBArticlelinkMacroName:
        await iframeChild.click(Constants.SearchKnowledgeArticleBasedOnPhrase);
        await iframeChild.fill(Constants.SearchStringField, Constants.SearchKb);
        await iframeChild.click(Constants.NewStepBtn);
        await iframeChild.click(Constants.OmnichannelConnector);
        await iframeChild.click(Constants.SendKbArticleInChat);
        break;

      case Constants.EntitySearchMacroName:
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

      case Constants.ExistingRecordMacroName:
        await iframeChild.click(Constants.OpenExistingRecordForm);
        await iframeChild.fill(Constants.EntityLogicalName, Constants.Account);
        await this.checkAndCloseDynamicContentPopUp(iframeChild);
        await iframeChild.fill(Constants.EntityRecordID, params[0]);
        break;

      case Constants.DraftEmailMacroName:
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

      case Constants.AutoFillMacroName:
        await iframeChild.click(Constants.OpenNewForm);
        await iframeChild.fill(
          Constants.EntityLogicalNameField,
          Constants.EntityLogicalNameAccount
        );
        await iframeChild.waitForSelector(Constants.NewStepBtn);
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

      case Constants.ExistingRecord:
        await iframeChild.click(Constants.OpenExistingRecordForm);
        await iframeChild.fill(Constants.EntityLogicalName, Constants.Account);
        await this.checkAndCloseDynamicContentPopUp(iframeChild);
        await iframeChild.fill(Constants.EntityRecordID, params[0]);
        break;

      case ConstantsMacros.CreateDraftEmailMacroName:
        await iframeChild.click(Constants.OpenDraftEmailForm);
        await iframeChild.fill(Constants.CaseEmailTemplateId, params[0]);
        await iframeChild.fill(Constants.EntityRecordIDField, params[1]);
        await iframeChild.fill(
          Constants.EmailRecipientsField,
          Constants.EmailID
        );
        await iframeChild.fill(
          Constants.EntityLogicalNameField,
          Constants.EntityLogicalNameAccount
        );
        break;

      case Constants.AutoFillMacroName:
        await iframeChild.waitForSelector(Constants.OpenNewForm);
        await iframeChild.click(Constants.OpenNewForm);
        await iframeChild.fill(
          Constants.EntityLogicalNameField,
          Constants.EntityLogicalNameAccount
        );
        await iframeChild.waitForSelector(Constants.NewStepBtn);
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

      case Constants.ThirdPartyWebsiteMacroName:
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

      case ConstantsMacros.SearchPhraseMacroName:
        await iframeChild.click(Constants.SearchPhraseForPopulatedPhraseMacro);
        await iframeChild.fill(
          Constants.SearchPhraseStringField,
          Constants.SearchPhraseValue
        );
        break;

      case ConstantsMacros.RefreshMacroName:
        await iframeChild.click(Constants.GetCurrentTab);
        await iframeChild.click(Constants.NewStepBtn);
        await iframeChild.click(Constants.RefreshTab);
        await iframeChild.click(Constants.TabId);
        await iframeChild.waitForSelector(Constants.SelectTabId, {
          timeout: 4000,
        });
        await iframeChild.click(Constants.SelectTabId);
        break;

      case ConstantsMacros.LinkRecordMacroName:
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
      case ConstantsMacros.SaveRecordMacroName:
        await iframeChild.click(Constants.OpenNewForm);
        await iframeChild.fill(
          Constants.EntityLogicalNameField,
          Constants.EntityLogicalNameAccount
        );
        await iframeChild.waitForSelector(Constants.ShowAdvancedOptions);
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

      case ConstantsMacros.UnlinkRecordMacroName:
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
      case Constants.ControlMacroName:
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
      case ConstantsMacros.TestMacro:
        await iframeChild.click(Constants.SearchKnowledgeArticleBasedOnPhrase);
        await iframeChild.fill(
          Constants.SearchStringField,
          Constants.SearchString
        );
        break;
      case ConstantsMacros.SaveRecordMacroName:
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
      case Constants.EntityListMacroName:
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
      case ConstantsMacros.FocusTabMacroName:
        await iframeChild.click(ConstantsMacros.FocusApplicationTab);
        await this.checkAndCloseDynamicContentPopUp(iframeChild);
        await iframeChild.fill(ConstantsMacros.TabId, params[0]);
        break;
      case ConstantsMacros.CloneInputMacroName:
        await iframeChild.click(ConstantsMacros.CloneInputApplicationTab);
        await this.checkAndCloseDynamicContentPopUp(iframeChild);
        await iframeChild.fill(Constants.EntityRecordID, params[0]);
        await this.checkAndCloseDynamicContentPopUp(iframeChild);
        await iframeChild.fill(Constants.EntityLogicalName, Constants.Account);
        await iframeChild.fill(Constants.RecordTitle, Constants.RecordName);
        break;
    }
    await iframeParent.click(Constants.SaveAndCloseButton2);
    await this.waitForDomContentLoaded();
    //Time Required to convert Macro from "Draft State" to "Activate State"
    await this.adminPage.waitForTimeout(3000);
  }
}
