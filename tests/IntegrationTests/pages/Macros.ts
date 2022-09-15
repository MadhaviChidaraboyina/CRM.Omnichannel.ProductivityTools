import { Constants, SelectorConstants } from "../Utility/Constants";
import { Iframe, IframeConstants } from "../pages/Iframe";

import { AdminPage } from "./AdminPage";
import { Page } from "playwright";
import { TestSettings } from "../configuration/test-settings";
import { WorkStreamTab } from "../pages/WorkStreams";
import { isNullOrUndefined } from "util";

export enum MacrosConstants {
  MarcrosMenuItem = "//li[contains(@id,'sitemap-entity-NewSubArea')]//span[contains(text(),'Macros')]",
  MarcrosNameInput = "input[data-id='macrosname_id.fieldControl-text-box-text']",
  StartMacroExecution = "//*[@id='Start']",
  MacrosNextStep = "//button[contains(text(),'+ New step')]",
  BuiltInTab = "button[name='Built-in']",
  MacrosControl = "button[aria-labelledby='connectionProviders/control']",
  ControlCondition = "//*[@id='if']",
  DataEditorName = "div[aria-label='Object Name']",
  DataEditorValue = "div[aria-label='Value']",
  AddanAction = "button[aria-label='Add an action for Condition']",
  OpenRecord = "//*[@id='Open_Form']",
  EntityLogicalName = "[aria-label='Entity logical name']",
  EntityRecordID = "[aria-label='Entity record ID']",
  MacrosDesignerParentIframe = "iframe[id='designer_id']",
  MacrosSave = "//*[@id='saveButton']",
  //custom values
  SlugName = "${customerName}",
  DataValue = "Entity",
  LogicalName = "NewEntity",
  RecordID = "12345",
  MacroStatusText = 'Deactivated',
  MacroRecordStatus = "//label[contains(text(),'Activated')]",
  MacroPageControl = "input[title='Search macro Trigger']",
  CustomerName = "Automation Agent",
  IncidentEntityName = "incident",
  CreateRecord = "//*[@id='Create_New']",
  BtnSessionConnector = "button[title='Session Connector']",
  BtnCurrentPage = "//*[@id='Get_current_page']",
  ShowAdvancedOptions = "//*[@id='app']/div/div/div/div/div/div[1]/div/div/div/div/div[2]/div/div/div[2]/div/div[2]/div/div/div[2]/div/div/div[1]/div/div/div/div/div[2]/div/div[2]/div[1]/div/div[2]/div/div[1]/div/div/div[2]/div/div/div[1]/div[2]/div/div/button",
  AttributeOne = "[aria-label='Attribute Name - 1']",
  AttributeOneValue = "[aria-label='Attribute Value - 1']",
  BtnAddNewItem = "[aria-label='Add new item']",
  AttributeTwo = "[aria-label='Attribute Name - 2']",
  AttributeTwoValue = "[aria-label='Attribute Value - 2']",
  Name = "name",
  IncidentTitle = "title",
  IncidentTitleValue = "Case-${customerName}",
  IncidentDescription = "description",
  IncidentDescriptionValue = "CustomerName = ${customerName}  :CustomerEntityName = ${customerEntityName}  :CustomerRecordID = ${customerRecordId} :QueueId = ${queueId} :Entity Name =${Session.AnchorTab.entityName} :Account Name={$Odata.account.name.?$filter=accountid eq '{customerRecordId}'}",
  Three = 3,
  AgentScriptsMenuItem = "//li[contains(@id,'sitemap')]//span[contains(text(),'Agent scripts')]",
  SearchMacroInputSelector = "//*[@data-id='msdyn_macroactionid.fieldControl-LookupResultsDropdown_msdyn_macroactionid_selected_tag_text']",
  RemoveMacrolookUpSelector = "//*[@data-id='msdyn_macroactionid.fieldControl-LookupResultsDropdown_msdyn_macroactionid_selected_tag_delete']",
  MacroLanguageInput = "input[data-id='msdyn_macroactionid.fieldControl-LookupResultsDropdown_msdyn_macroactionid_textInputBox_with_filter_new']",
  MacroLanguageSearch = "button[data-id='msdyn_macroactionid.fieldControl-LookupResultsDropdown_msdyn_macroactionid_search']",
  MacroLanguageLookupValue = "div[data-id='msdyn_macroactionid.fieldControl|__flyoutRootNode_SimpleLookupControlFlyout'] li[aria-label*='{0}']",
  ViewHistorySelector = "//label[contains(text(),'View run history')]",
  AgentScriptName = "TestAgentScript",
  MacroName = "Test",
  SessionsTabSelector = "//li[contains(@id,'sitemap')]//span[contains(text(),'Sessions')]",
  SessionsAgentScriptsTab = "//*[@data-id='tablist-Agent scripts']",
  EnableExpressionBuilderRadioBtnSelector = "//*[@aria-label='Enable build expression: Yes']",
  HideProgressIconSelector = "//*[@class=hideProgressBar]",
  ConditionTabSelector = "//*[@aria-label='Condition']",
  ExpressionBuilderBtnSelector = "//*[@data-id='msdyn_expressiondata.fieldControl-ExpressionBuilder-Button']",
  DisableExpressionBuilderRadioBtnSelector = "//*[@aria-label='Enable build expression: No']",
  DisableExpressionBuilderRadioBtnSelectorSection = "//*[@data-id='msdyn_enablebuildexpression.fieldControl_container']",
  ConditionMenuSelector = "//*[@aria-label='Menu for Condition']",
  DeleteOptionSelector = "//*[@data-icon-name='Delete']",
  OKBtnSelector = "//*[text()='OK']",
  SaveExpresionBuilderBtnSelector = "//*[@id='saveButton']",
  NewStepBtnSelector = "//*[text()='+ New step']",
  ExpressionBuilderOdataQuery = "${$Odata.account.name.?$filter=accountid eq '{customerRecordId}'}",
  ConditionFirstValue = "Automation Agent",
  SelectRowSelector = "//*[@aria-label='Select row']",
  AppTextSelector = "//*[@id='app']",
  GroupTypeSelector = "//*[@aria-label='Group type selector']",
  FalseConditionSelector = "//*[@aria-label='If false']",
  CustomerServiceSelector = "//*[text()='Customer Service']",
  SelectDefaultScriptSelector = "//*[@id='setcallscript']",
  ShowOptionSelector = "//*[@aria-label='Show options']",
  TextSelector = "//*[text()='{0}']",
  TrueConditionSelector = "//*[@aria-label='If true']",
  ConditionSecondValue = "Customer",
  ExpressionBuilderStaticQuery = "CustomerName-${customerName}",
  CustomerNamePrefixValue = "CustomerName",
  ConditionOperatorSelector = "//*[@aria-label='Relationship']",
  ConditionOperatorValueSelector = "//*[text()='starts with']",
  NewAgentScriptName = "NewAgentScript",
  TestMacro = "TestMacro",
  GridViewFirstRecordSelector = "//*[@data-id='cell-0-1']",
  DeleteBtnSelector = "//*[@aria-label='Delete']",
  DeleteConfirmBtnSelector = "//*[@id='confirmButton']",
  CreateNewRecordBtnSelector = "//*[@aria-label='New']",
  Twelve = 12,
  OneThousand = 1000,
  ConditionValueSelector = "//*[text()='is greater than']",
  AgentScriptNameSelector = "//*[contains(@data-id,'msdyn_name.fieldControl-text-box-text')]",
  UniqueNameSelector = "//*[contains(@data-id,'msdyn_uniquename.fieldControl-text-box-text')]",
  AgentScriptStepNameSelector = "//input[contains(@data-id,'msdyn_name.fieldControl-text-box-text')]",
  UniqueNameStepSelector = "//input[contains(@data-id,'msdyn_uniquename.fieldControl-text-box-text')]",
  LanguageSelector = "//*[@aria-label='Language']",
  SaveBtn = "//*[@aria-label='Save']",
  NewAgentScriptStep = "//*[@aria-label='New Agent script step']",
  FirstTestScriptName = "TestScript",
  SecondTestScriptName = "Test",
  One = "1",
  Two = "2",
  Order = "//input[@data-id='msdyn_order.fieldControl-whole-number-text-input']",
  ActionTypeStepSelector = "//select[@data-id='msdyn_actiontype.fieldControl-option-set-select']",
  ActionTypeSelector = "//*[@data-id='msdyn_actiontype.fieldControl-option-set-select']",
  SessionTitle = "{customerName}",
  SessionDescription = "This is the session template for Facebook channel.",
  SessionType = "//*[@data-id='msdyn_sessiontype.fieldControl-option-set-select']",
  Session_AgentScriptsTab = "//*[@data-id='tablist-Agent scripts']",
  Session_AddExistingAgentScriptsBtn = "//*[@aria-label='Add Existing Agent script']",
  Sesion_AgentScriptLookUpName = "//*[@aria-label='Multiple Selection Lookup']",
  Session_SearchAgentScriptBtn = "//*[@aria-label='Search records for Multiple Selection Lookup field']",
  LookUpResultSelector = "//*[contains(@aria-label,'{0}')]",
  AddButton = "button[data-id='lookupDialogSaveBtn']",
  FBDefaultSession = "//*[contains(@data-id,'LookupResultsDropdown_msdyn_facebook_sessionLookupControl_selected_tag_text')]",
  FBDefaultSearch = "//*[contains(@data-id,'LookupResultsDropdown_msdyn_facebook_sessionLookupControl_selected_tag_text')]/following::button[@aria-label='Search all records'][1]",
  FBDeleteSession = "//*[contains(@data-id,'msdyn_sessiontemplate_default.fieldControl.msdyn_facebook_sessionLookupControl_Id-LookupResultsDropdown_msdyn_facebook_sessionLookupControl_selected_tag_delete')]",
  FBNewTemplateInput = "//*[contains(@data-id,'msdyn_sessiontemplate_default.fieldControl.nullLookupControl_Id-LookupResultsDropdown_nullLookupControl_textInputBox_with_filter_new')]",
  FBTemplateLookupValue = "//div[@data-id='msdyn_sessiontemplate_default.fieldControl.nullLookupControl_Id|__flyoutRootNode_SimpleLookupControlFlyout']//li[contains(@aria-label,'{0}')]",
  FBSessionSearch = "//*[@data-id='msdyn_sessiontemplate_default.fieldControl.nullLookupControl_Id-LookupResultsDropdown_nullLookupControl_search']",
  Five = 5,
  MacroDescriptionSelector = "//*[@data-id='macrosdesc_id.fieldControl-text-box-text']",
  AgentScriptFormTitle = "//*[text()='New Agent script']",
  SaveAgentScriptBtnStepBtn = "//*[@id='quickCreateSaveAndCloseBtn']",
  MacroLanguageInputStep = "input[data-id='msdyn_macroactionid.fieldControl-LookupResultsDropdown_msdyn_macroactionid_textInputBox_with_filter_new']",
  MacroLanguageSearchStep = "button[data-id='msdyn_macroactionid.fieldControl-LookupResultsDropdown_msdyn_macroactionid_search']",
  MacroLanguageLookupValueStep = "div[data-id='msdyn_macroactionid.fieldControl|__flyoutRootNode_SimpleLookupControlFlyout'] li[aria-label*='{0}']",
  TextDescriptionSelector = "//*[@data-id='msdyn_textinstruction.fieldControl-text-box-text']",
  SaveAndCloseBtn = "//*[@aria-label='Save & Close']",
  AgentScriptTitleSelector = "//*[@title='{0}']",
  AgentScriptStepTitleSelector = "//h1[@title='{0}']",
  ConfirmBtn = "//*[@id='confirmButton']",
  CustomerSummary = "Customer Summary",
  SessionTitleSelector = "//*[@title='{0}']",
  SessionAdditionalTabSelector = "//*[@aria-label='Add Existing Application Tab Template']",
  FacebookNewSessionWSSelector = "//*[text()='{0}']",
  ActivateBtnSelector = "//*[@aria-label='Activate']",
  ActivateBtnInPopUpSelector = "//*[@data-id='ok_id']",
  Macro_TC1760325 = "Macro_TC1760325",
  Macro_TC1982216 = "Macro_TC1982216",
  Macro_TC1717127 = "Macro_TC1717127",
  MaxTimeout = 8000,
  OpenWsWaitTimeout = 10000,
  AgentScriptNameSearchResult = `//*[text()='AutomationTestAgentScript']`,
  AgentscriptName2 = "AutomationTestAgentScript2",
}

export enum IFrameConstants {
  DesignerIframe = "iframedesigner.html",
  BuildExpressionDesignerIframe = "iframeLogicappDesigner.html",
  BuildExpressionParentIframe = "AgentScriptDesigner",
  MacroParentIframe = "msdyn_ProductivityMacrosComponent_macroDesigner"
}

export enum LanguageMode {
  English = "1033"
}

export enum ActionTypeMode {
  Text = "192350000",
  Macro = "192350001",
  Script = "192350002"
}

const MacroConstants = {
  Generic: 'Generic',
  OcConversationsDashBoard: 'Omnichannel Conversations Dashboard',
}

export class TestHelper {
  public static GetIframe(page1, html): Promise<any> {
    //promise to resolve and fetch the iframe once framenavigated event occurs.
    let FetchIFrame;
    const promise = new Promise((x) => (FetchIFrame = x));
    waitForFrame();
    return promise;

    function waitForFrame() {
      const frame = page1.frames().find((f) => f.url().indexOf(html) > -1);
      if (frame) {
        FetchIFrame(frame);
      } else {
        //waits for framenavigated event to happen and calls waitForFrame to resolve promise and return iframe
      }
    }
  }
}

export class MacrosPage extends AdminPage {
  constructor(page: Page) {
    super(page);
  }

  public async navigateToMacrosTab() {
    await this.Page.click(MacrosConstants.MarcrosMenuItem);
  }

  public async navigateToSiteMapChannel() {  
    await this.Page.click(MacrosConstants.MarcrosMenuItem);
  }

  private newMarcosData = { Name: "NewMacros" };
  public newMarcos = `${this.newMarcosData.Name}_${new Date().getTime()}`;

  public async fillNewMarcosDetails(data = this.newMarcosData) {
    await this.waitForDomContentLoaded();
    await this.waitUntilSelectorIsVisible(MacrosConstants.MarcrosNameInput, MacrosConstants.Three, null, Constants.MaxTimeout);
    const marcrosNameInput = await this.Page.waitForSelector(
      MacrosConstants.MarcrosNameInput
    );
    await this.fillInputData(MacrosConstants.MarcrosNameInput, this.newMarcos);
  }

  public async addConditionforMacrosusingSlug() {
    const iframe: Page = await TestHelper.GetIframe(
      this.Page,
      IFrameConstants.DesignerIframe
    );

    const StartExecution = await iframe.waitForSelector(
      MacrosConstants.StartMacroExecution
    );
    await iframe.$eval(MacrosConstants.StartMacroExecution, (el) => {
      (el as HTMLElement).click();
    });

    const macrosNextStep = await iframe.waitForSelector(
      MacrosConstants.MacrosNextStep
    );
    await iframe.$eval(MacrosConstants.MacrosNextStep, (el) => {
      (el as HTMLElement).click();
    });

    const builtInTab = await iframe.waitForSelector(MacrosConstants.BuiltInTab);
    await iframe.$eval(MacrosConstants.BuiltInTab, (el) => {
      (el as HTMLElement).click();
    });

    const macrosControl = await iframe.waitForSelector(
      MacrosConstants.MacrosControl
    );
    await iframe.$eval(MacrosConstants.MacrosControl, (el) => {
      (el as HTMLElement).click();
    });

    const controlCondition = await iframe.waitForSelector(
      MacrosConstants.ControlCondition
    );
    await iframe.$eval(MacrosConstants.ControlCondition, (el) => {
      (el as HTMLElement).click();
    });

    const chooseName = await iframe.waitForSelector(
      MacrosConstants.DataEditorName
    );
    await chooseName.fill(MacrosConstants.SlugName);

    const chooseValue = await iframe.waitForSelector(
      MacrosConstants.DataEditorValue
    );
    await chooseValue.fill(MacrosConstants.DataValue);

    const addanAction = await iframe.waitForSelector(
      MacrosConstants.AddanAction
    );
    await iframe.$eval(MacrosConstants.AddanAction, (el) => {
      (el as HTMLElement).click();
    });
    await this.waitUntilSelectorIsVisible(MacrosConstants.OpenRecord, MacrosConstants.Twelve, iframe, MacrosConstants.OneThousand);
    const openRecord = await iframe.waitForSelector(MacrosConstants.OpenRecord);
    await iframe.$eval(MacrosConstants.OpenRecord, (el) => {
      (el as HTMLElement).click();
    });

    const entityLogicalName = await iframe.waitForSelector(
      MacrosConstants.EntityLogicalName
    );
    await entityLogicalName.fill(MacrosConstants.LogicalName);

    const entityRecordID = await iframe.waitForSelector(
      MacrosConstants.EntityRecordID
    );
    await entityRecordID.fill(MacrosConstants.RecordID);

    //save Macros
    await this.saveMacros();
  }

  public async saveMacros() {
    //save Macros
    await this.Page.waitForTimeout(Constants.DefaultTimeout);
    const macrosDesignerIDIframe = await this.Page.$(
      MacrosConstants.MacrosDesignerParentIframe
    );
    const macrosDesignerIDFrame = await macrosDesignerIDIframe.contentFrame();
    await macrosDesignerIDFrame.click(MacrosConstants.MacrosSave);
    await this.Page.waitForTimeout(Constants.DefaultTimeout)
  }
  public async validateStatus() {
    const macroStatus = await this.Page.waitForSelector(
      MacrosConstants.MacroRecordStatus
    )
    const status = await macroStatus.innerText();
    return (status != MacrosConstants.MacroStatusText)
  }

  /// <summary>
  /// This method is used to verify Slugs, Session connectors, Odata queries, static value are working in conditions in Macros.
  /// This method is used to validate Test Cases 1760325 & 1982216.
  /// </summary>
  public async addConditionForMacro() {
    const iframe: Page = await TestHelper.GetIframe(
      this.Page,
      IFrameConstants.DesignerIframe
    );
    await this.waitUntilSelectorIsVisible(MacrosConstants.StartMacroExecution, MacrosConstants.Three, iframe, Constants.MaxTimeout);

    await iframe.$eval(MacrosConstants.StartMacroExecution, (el) => {
      (el as HTMLElement).click();
    });
    await this.waitUntilSelectorIsVisible(MacrosConstants.MacrosNextStep, MacrosConstants.Three, iframe, Constants.MaxTimeout);

    await iframe.$eval(MacrosConstants.MacrosNextStep, (el) => {
      (el as HTMLElement).click();
    });
    await this.waitUntilSelectorIsVisible(MacrosConstants.BtnSessionConnector, MacrosConstants.Three, iframe, Constants.MaxTimeout);
    await iframe.$eval(MacrosConstants.BtnSessionConnector, (el) => {
      (el as HTMLElement).click();
    });
    await this.waitUntilSelectorIsVisible(MacrosConstants.BtnCurrentPage, MacrosConstants.Three, iframe, Constants.MaxTimeout);
    await iframe.$eval(MacrosConstants.BtnCurrentPage, (el) => {
      (el as HTMLElement).click();
    });
    await this.waitUntilSelectorIsVisible(MacrosConstants.MacrosNextStep, MacrosConstants.Three, iframe, Constants.MaxTimeout);

    await iframe.$eval(MacrosConstants.MacrosNextStep, (el) => {
      (el as HTMLElement).click();
    });
    await this.waitUntilSelectorIsVisible(MacrosConstants.BuiltInTab, MacrosConstants.Three, iframe, Constants.MaxTimeout);

    await iframe.$eval(MacrosConstants.BuiltInTab, (el) => {
      (el as HTMLElement).click();
    });
    await this.waitUntilSelectorIsVisible(MacrosConstants.MacrosControl, MacrosConstants.Three, iframe, Constants.MaxTimeout);

    await iframe.$eval(MacrosConstants.MacrosControl, (el) => {
      (el as HTMLElement).click();
    });
    await this.waitUntilSelectorIsVisible(MacrosConstants.ControlCondition, MacrosConstants.Three, iframe, Constants.MaxTimeout);

    await iframe.$eval(MacrosConstants.ControlCondition, (el) => {
      (el as HTMLElement).click();
    });
    await this.waitUntilSelectorIsVisible(MacrosConstants.DataEditorName, MacrosConstants.Three, iframe, Constants.MaxTimeout);
    const chooseName = await iframe.waitForSelector(
      MacrosConstants.DataEditorName
    );
    await chooseName.fill("");
    await chooseName.fill(MacrosConstants.SlugName);
    await this.waitUntilSelectorIsVisible(MacrosConstants.DataEditorValue, MacrosConstants.Three, iframe, Constants.MaxTimeout);
    const chooseValue = await iframe.waitForSelector(
      MacrosConstants.DataEditorValue
    );
    await chooseValue.fill("");
    await chooseValue.fill(TestSettings.MacroConditionCustomerName);

    await iframe.$eval(MacrosConstants.SelectRowSelector, (el) => {
      (el as HTMLElement).click();
    })
    await iframe.$eval(MacrosConstants.AppTextSelector, (el) => {
      (el as HTMLElement).click();
    });
    await iframe.$eval(MacrosConstants.GroupTypeSelector, (el) => {
      (el as HTMLElement).click();
    });

    await this.waitUntilSelectorIsVisible(MacrosConstants.AddanAction, MacrosConstants.Three, iframe, Constants.MaxTimeout);

    await iframe.$eval(MacrosConstants.AddanAction, (el) => {
      (el as HTMLElement).click();
    });
    await this.waitUntilSelectorIsVisible(MacrosConstants.CreateRecord, MacrosConstants.Three, iframe, Constants.MaxTimeout);
    await iframe.$eval(MacrosConstants.CreateRecord, (el) => {
      (el as HTMLElement).click();
    });

    await this.waitUntilSelectorIsVisible(MacrosConstants.EntityLogicalName, MacrosConstants.Three, iframe, Constants.MaxTimeout);
    const entityLogicalName = await iframe.waitForSelector(
      MacrosConstants.EntityLogicalName
    );
    await entityLogicalName.fill(MacrosConstants.IncidentEntityName);
    await iframe.$eval(MacrosConstants.ShowAdvancedOptions, (el) => {
      (el as HTMLElement).click();
    });
    this.FillAttributeWithValue(iframe, MacrosConstants.AttributeOne, MacrosConstants.IncidentTitle, MacrosConstants.AttributeOneValue, MacrosConstants.IncidentTitleValue);
    await this.waitUntilSelectorIsVisible(MacrosConstants.BtnAddNewItem, MacrosConstants.Three, iframe, Constants.MaxTimeout);
    await iframe.$eval(MacrosConstants.BtnAddNewItem, (el) => {
      (el as HTMLElement).click();
    });
    this.FillAttributeWithValue(iframe, MacrosConstants.AttributeTwo, MacrosConstants.IncidentDescription, MacrosConstants.AttributeTwoValue, MacrosConstants.IncidentDescriptionValue);
    //save Macros
    await this.saveMacros();
  }

  public async FillAttributeWithValue(page: Page, attributeNameSelector: string, attributeName: string, attributeValueSelector: string, attributeValue: string) {
    await this.waitUntilSelectorIsVisible(attributeNameSelector, MacrosConstants.Three, page);
    const attNameSelector = await page.waitForSelector(attributeNameSelector);
    attNameSelector.fill(attributeName);
    await this.Page.waitForTimeout(Constants.DefaultAverageTimeout);// This timeout is required to wait till the textbox populated with data completely.
    await this.waitUntilSelectorIsVisible(attributeValueSelector, MacrosConstants.Three, page);
    const attrValueSelector = await page.waitForSelector(attributeValueSelector);
    attrValueSelector.fill(attributeValue);
    await this.Page.waitForTimeout(Constants.DefaultAverageTimeout);// This timeout is required to wait till the textbox populated with data completely.
  }

  public async navigateToAgentScripts() {
    await this.waitUntilSelectorIsVisible(MacrosConstants.AgentScriptsMenuItem,Constants.Three, this._page, Constants.FourThousandsMiliSeconds);
    await this.Page.click(MacrosConstants.AgentScriptsMenuItem);
    await this.waitUntilSelectorIsVisible(SelectorConstants.AgentScriptWSPage,Constants.Three, this._page, Constants.FourThousandsMiliSeconds);
  }

  public async editScriptStep(searchRecord: string) {
    await this.Page.click(SelectorConstants.RecordLink.replace("{0}", searchRecord));
    await this._page.hover(MacrosConstants.SearchMacroInputSelector);
    await this._page.click(MacrosConstants.RemoveMacrolookUpSelector);
    const macroInput = await this.Page.waitForSelector(
      MacrosConstants.MacroLanguageInput
    );
    await macroInput.fill(MacrosConstants.Macro_TC1717127);
    await this.Page.click(MacrosConstants.MacroLanguageSearch);
    await this.waitUntilSelectorIsVisible(
      MacrosConstants.MacroLanguageLookupValue.replace(
        "{0}",
        MacrosConstants.Macro_TC1717127
      ), Constants.Three, this._page, Constants.FourThousandsMiliSeconds
    );
    await this.Page.click(
      MacrosConstants.MacroLanguageLookupValue.replace(
        "{0}",
        MacrosConstants.Macro_TC1717127
      )
    );
    await this.formSaveAndCloseButton();
  }

  public async searchMacroRecordAndClick() {
    await this.searchRecordAndClick(MacrosConstants.Macro_TC1717127);
  }

  public async openViewHistory() {
    await this.waitUntilSelectorIsVisible(MacrosConstants.ViewHistorySelector, Constants.Three, null, Constants.OpenWsWaitTimeout);
    await this.Page.click(MacrosConstants.ViewHistorySelector);
  }

  public async validateMacroRunHistory() {
    await this.waitUntilSelectorIsVisible(SelectorConstants.RecordLink.replace("{0}", MacrosConstants.Macro_TC1717127), Constants.Three, null, Constants.OpenWsWaitTimeout);
    const macroNameSelector = await (await this.Page.waitForSelector(
      SelectorConstants.RecordLink.replace("{0}", MacrosConstants.Macro_TC1717127)
    ));
    return (!isNullOrUndefined(macroNameSelector))
  }

  public async navigateToSessionTab() {
    await this.Page.click(MacrosConstants.SessionsTabSelector);
  }

  public async searchSessionRecordAndClick(facebookSessionName: string) {
    await this.searchRecordAndClick(facebookSessionName);
  }

  public async navigateToExpressionBuilder() {
    await this.Page.click(MacrosConstants.SessionsAgentScriptsTab);
  }

  public async IsExpressionBuilderEnable() {
    return await this.waitUntilSelectorIsVisible(
      MacrosConstants.EnableExpressionBuilderRadioBtnSelector, Constants.Five, this._page, Constants.MaxTimeout
    );
  }

  public async IsExpressionBuilderConditionExists() {
    await this.waitUntilSelectorIsVisible(MacrosConstants.HideProgressIconSelector, Constants.Five, this._page, Constants.MaxTimeout);
    const parentIframe: Page = await Iframe.GetIframe(
      this.Page,
      IFrameConstants.BuildExpressionParentIframe
    );
    const iframe: Page = await Iframe.GetChildIframeByParentIframe(
      this.Page,
      IFrameConstants.BuildExpressionParentIframe
    );
    return await this.waitUntilSelectorIsVisible(MacrosConstants.ConditionTabSelector, Constants.Three, iframe, Constants.MaxTimeout);
  }

  public async prerequisiteForExpressionBuilder() {
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
      //await section.click("//*[@aria-label='Enable build expression: No']");
      await this.waitUntilSelectorIsVisible(MacrosConstants.EnableExpressionBuilderRadioBtnSelector, Constants.Five, this._page, Constants.FourThousandsMiliSeconds);
      await this.waitUntilSelectorIsVisible(MacrosConstants.ExpressionBuilderBtnSelector, Constants.Three, this._page, Constants.MaxTimeout);
      await this.Page.click(MacrosConstants.ExpressionBuilderBtnSelector);
    }
    const isExpressionBuilderConditionFlag: boolean = await this.IsExpressionBuilderConditionExists();
    if (isExpressionBuilderConditionFlag) {
      const parentIframe: Page = await Iframe.GetIframe(
        this.Page,
        IFrameConstants.BuildExpressionParentIframe
      );
      const iframe: Page = await Iframe.GetChildIframeByParentIframe(
        this.Page,
        IFrameConstants.BuildExpressionParentIframe
      );
      await iframe.$eval(MacrosConstants.ConditionMenuSelector, (el) => {
        (el as HTMLElement).click();
      });
      await iframe.waitForSelector(MacrosConstants.DeleteOptionSelector);
      await iframe.$eval(MacrosConstants.DeleteOptionSelector, (el) => {
        (el as HTMLElement).click();
      });
      await iframe.waitForSelector(MacrosConstants.OKBtnSelector);
      await iframe.$eval(MacrosConstants.OKBtnSelector, (el) => {
        (el as HTMLElement).click();
      });
      await parentIframe.waitForSelector(MacrosConstants.SaveExpresionBuilderBtnSelector);
      await parentIframe.$eval(MacrosConstants.SaveExpresionBuilderBtnSelector, (el) => {
        (el as HTMLElement).click();
      });
      await this.waitUntilSelectorIsVisible(MacrosConstants.ExpressionBuilderBtnSelector, Constants.Five, this._page, Constants.MaxTimeout);
      await this.Page.click(MacrosConstants.ExpressionBuilderBtnSelector);
      await this.waitUntilSelectorIsVisible(MacrosConstants.HideProgressIconSelector, Constants.Five, this._page, Constants.MaxTimeout);
      const newIframe: Page = await Iframe.GetChildIframeByParentIframe(
        this.Page,
        IFrameConstants.BuildExpressionParentIframe
      );
      await newIframe.waitForSelector(MacrosConstants.NewStepBtnSelector);
      await newIframe.$eval(MacrosConstants.NewStepBtnSelector, (el) => {
        (el as HTMLElement).click();
      });
    }
    else {
      const iframe: Page = await Iframe.GetChildIframeByParentIframe(
        this.Page,
        IFrameConstants.BuildExpressionParentIframe
      );
      await iframe.waitForSelector(MacrosConstants.NewStepBtnSelector);
      await iframe.$eval(MacrosConstants.NewStepBtnSelector, (el) => {
        (el as HTMLElement).click();
      });
    }
  }

  public async addConditionForExpressionBuilder() {
    const parentIframe: Page = await Iframe.GetIframe(
      this.Page,
      IFrameConstants.BuildExpressionParentIframe
    );
    const iframe: Page = await Iframe.GetChildIframeByParentIframe(
      this.Page,
      IFrameConstants.BuildExpressionParentIframe
    );
    const builtInTab = await iframe.waitForSelector(MacrosConstants.BuiltInTab);
    await iframe.$eval(MacrosConstants.BuiltInTab, (el) => {
      (el as HTMLElement).click();
    });
    await iframe.$eval(MacrosConstants.ControlCondition, (el) => {
      (el as HTMLElement).click();
    });
    const chooseName = await iframe.waitForSelector(
      MacrosConstants.DataEditorName
    );
    await chooseName.fill(MacrosConstants.ExpressionBuilderOdataQuery);
    const chooseValue = await iframe.waitForSelector(
      MacrosConstants.DataEditorValue
    );
    await chooseValue.fill("");
    await chooseValue.fill(TestSettings.MacroConditionCustomerName);
    await iframe.$eval(MacrosConstants.SelectRowSelector, (el) => {
      (el as HTMLElement).click();
    })
    await iframe.$eval(MacrosConstants.AppTextSelector, (el) => {
      (el as HTMLElement).click();
    });
    await iframe.$eval(MacrosConstants.GroupTypeSelector, (el) => {
      (el as HTMLElement).click();
    });
    await iframe.$eval(MacrosConstants.FalseConditionSelector, (el) => {
      (el as HTMLElement).click();
    });
    await iframe.$eval(MacrosConstants.AddanAction, (el) => {
      (el as HTMLElement).click();
    });
    await this.waitUntilSelectorIsVisible(MacrosConstants.CustomerServiceSelector, MacrosConstants.Three, iframe);
    await iframe.$eval(MacrosConstants.CustomerServiceSelector, (el) => {
      (el as HTMLElement).click();
    });
    await iframe.waitForSelector(MacrosConstants.SelectDefaultScriptSelector);
    await iframe.$eval(MacrosConstants.SelectDefaultScriptSelector, (el) => {
      (el as HTMLElement).click();
    });
    await this.waitUntilSelectorIsVisible(MacrosConstants.ShowOptionSelector, MacrosConstants.Three, iframe);
    await iframe.$eval(MacrosConstants.ShowOptionSelector, (el) => {
      (el as HTMLElement).focus();
    });
    await iframe.$eval(MacrosConstants.ShowOptionSelector, (el) => {
      (el as HTMLElement).click();
    });
    await this.waitUntilSelectorIsVisible(MacrosConstants.TextSelector.replace("{0}", TestSettings.ExpressionBuilderFirstAgentScriptName), MacrosConstants.Three, iframe);
    await iframe.$eval(MacrosConstants.TextSelector.replace("{0}", TestSettings.ExpressionBuilderFirstAgentScriptName), (el) => {
      (el as HTMLElement).click();
    });
    await iframe.$eval(MacrosConstants.TrueConditionSelector, (el) => {
      (el as HTMLElement).click();
    });
    await iframe.$eval(MacrosConstants.FalseConditionSelector, (el) => {
      (el as HTMLElement).click();
    });
    await this.waitUntilSelectorIsVisible(MacrosConstants.AddanAction, MacrosConstants.Three, iframe);
    await iframe.$eval(MacrosConstants.AddanAction, (el) => {
      (el as HTMLElement).click();
    });
    await this.waitUntilSelectorIsVisible(MacrosConstants.CustomerServiceSelector, MacrosConstants.Three, iframe);
    await iframe.waitForSelector(MacrosConstants.CustomerServiceSelector);
    await iframe.$eval(MacrosConstants.CustomerServiceSelector, (el) => {
      (el as HTMLElement).click();
    });
    await iframe.waitForSelector(MacrosConstants.SelectDefaultScriptSelector);
    await iframe.$eval(MacrosConstants.SelectDefaultScriptSelector, (el) => {
      (el as HTMLElement).click();
    });
    await this.waitUntilSelectorIsVisible(MacrosConstants.ShowOptionSelector, MacrosConstants.Three, iframe);
    await iframe.$eval(MacrosConstants.ShowOptionSelector, (el) => {
      (el as HTMLElement).focus();
    });
    await iframe.$eval(MacrosConstants.ShowOptionSelector, (el) => {
      (el as HTMLElement).click();
    });
    await this.waitUntilSelectorIsVisible(MacrosConstants.TextSelector.replace("{0}", TestSettings.ExpressionBuilderSecondAgentScriptName), MacrosConstants.Three, iframe);
    await iframe.$eval(MacrosConstants.TextSelector.replace("{0}", TestSettings.ExpressionBuilderSecondAgentScriptName), (el) => {
      (el as HTMLElement).click();
    });
    await parentIframe.waitForSelector(MacrosConstants.SaveExpresionBuilderBtnSelector);
    await parentIframe.$eval(MacrosConstants.SaveExpresionBuilderBtnSelector, (el) => {
      (el as HTMLElement).click();
    });
  }

  public async modifyConditionForExpressionBuilder() {
    const isExpressionBuilderFlag: boolean = await this.IsExpressionBuilderEnable();
    if (isExpressionBuilderFlag) {
      await this.Page.click(MacrosConstants.ExpressionBuilderBtnSelector);
    }
    else {
      await this.Page.click(MacrosConstants.DisableExpressionBuilderRadioBtnSelector);
      await this.waitUntilSelectorIsVisible(MacrosConstants.EnableExpressionBuilderRadioBtnSelector);
      await this.Page.click(MacrosConstants.ExpressionBuilderBtnSelector);
    }
    const isExpressionBuilderConditionFlag: boolean = await this.IsExpressionBuilderConditionExists();
    const parentIframe: Page = await Iframe.GetIframe(
      this.Page,
      IFrameConstants.BuildExpressionParentIframe
    );
    const iframe: Page = await Iframe.GetChildIframeByParentIframe(
      this.Page,
      IFrameConstants.BuildExpressionParentIframe
    );
    if (isExpressionBuilderConditionFlag) {
      await iframe.$eval(MacrosConstants.ConditionTabSelector, (el) => {
        (el as HTMLElement).click();
      });
      const chooseValue = await iframe.waitForSelector(
        MacrosConstants.DataEditorValue
      );
      await chooseValue.fill("");
      await chooseValue.fill(MacrosConstants.ConditionSecondValue);
      await parentIframe.waitForSelector(MacrosConstants.SaveExpresionBuilderBtnSelector);
      await parentIframe.$eval(MacrosConstants.SaveExpresionBuilderBtnSelector, (el) => {
        (el as HTMLElement).click();
      });
    }
    else {
      await iframe.$eval(MacrosConstants.NewStepBtnSelector, (el) => {
        (el as HTMLElement).click();
      });
      const builtInTab = await iframe.waitForSelector(MacrosConstants.BuiltInTab);
      await iframe.$eval(MacrosConstants.BuiltInTab, (el) => {
        (el as HTMLElement).click();
      });
      await iframe.$eval(MacrosConstants.ControlCondition, (el) => {
        (el as HTMLElement).click();
      });
      const chooseName = await iframe.waitForSelector(
        MacrosConstants.DataEditorName
      );
      await chooseName.fill(MacrosConstants.ExpressionBuilderOdataQuery);

      const chooseValue = await iframe.waitForSelector(
        MacrosConstants.DataEditorValue
      );
      await chooseValue.fill("");
      await chooseValue.fill(MacrosConstants.ConditionSecondValue);
      await iframe.$eval(MacrosConstants.SelectRowSelector, (el) => {
        (el as HTMLElement).click();
      })
      await iframe.$eval(MacrosConstants.AppTextSelector, (el) => {
        (el as HTMLElement).click();
      });
      await iframe.$eval(MacrosConstants.GroupTypeSelector, (el) => {
        (el as HTMLElement).click();
      });
      await iframe.$eval(MacrosConstants.FalseConditionSelector, (el) => {
        (el as HTMLElement).click();
      });
      await iframe.$eval(MacrosConstants.AddanAction, (el) => {
        (el as HTMLElement).click();
      });
      await this.waitUntilSelectorIsVisible(MacrosConstants.CustomerServiceSelector, MacrosConstants.Three, iframe);
      await iframe.$eval(MacrosConstants.CustomerServiceSelector, (el) => {
        (el as HTMLElement).click();
      });
      await iframe.waitForSelector(MacrosConstants.SelectDefaultScriptSelector);
      await iframe.$eval(MacrosConstants.SelectDefaultScriptSelector, (el) => {
        (el as HTMLElement).click();
      });
      await this.waitUntilSelectorIsVisible(MacrosConstants.ShowOptionSelector, MacrosConstants.Three, iframe);
      await iframe.$eval(MacrosConstants.ShowOptionSelector, (el) => {
        (el as HTMLElement).focus();
      });
      await iframe.$eval(MacrosConstants.ShowOptionSelector, (el) => {
        (el as HTMLElement).click();
      });
      await this.waitUntilSelectorIsVisible(MacrosConstants.TextSelector.replace("{0}", TestSettings.ExpressionBuilderFirstAgentScriptName), MacrosConstants.Three, iframe);
      await iframe.$eval(MacrosConstants.TextSelector.replace("{0}", TestSettings.ExpressionBuilderFirstAgentScriptName), (el) => {
        (el as HTMLElement).click();
      });
      await iframe.$eval(MacrosConstants.TrueConditionSelector, (el) => {
        (el as HTMLElement).click();
      });
      await iframe.$eval(MacrosConstants.FalseConditionSelector, (el) => {
        (el as HTMLElement).click();
      });
      await this.waitUntilSelectorIsVisible(MacrosConstants.AddanAction, MacrosConstants.Three, iframe);
      await iframe.$eval(MacrosConstants.AddanAction, (el) => {
        (el as HTMLElement).click();
      });
      await this.waitUntilSelectorIsVisible(MacrosConstants.CustomerServiceSelector, MacrosConstants.Three, iframe);
      await iframe.$eval(MacrosConstants.CustomerServiceSelector, (el) => {
        (el as HTMLElement).click();
      });
      await iframe.waitForSelector(MacrosConstants.SelectDefaultScriptSelector);
      await iframe.$eval(MacrosConstants.SelectDefaultScriptSelector, (el) => {
        (el as HTMLElement).click();
      });
      await this.waitUntilSelectorIsVisible(MacrosConstants.ShowOptionSelector, MacrosConstants.Three, iframe);
      await iframe.$eval(MacrosConstants.ShowOptionSelector, (el) => {
        (el as HTMLElement).focus();
      });
      await iframe.$eval(MacrosConstants.ShowOptionSelector, (el) => {
        (el as HTMLElement).click();
      });
      await this.waitUntilSelectorIsVisible(MacrosConstants.TextSelector.replace("{0}", TestSettings.ExpressionBuilderSecondAgentScriptName), MacrosConstants.Three, iframe);
      await iframe.$eval(MacrosConstants.TextSelector.replace("{0}", TestSettings.ExpressionBuilderSecondAgentScriptName), (el) => {
        (el as HTMLElement).click();
      });
      await parentIframe.waitForSelector(MacrosConstants.SaveExpresionBuilderBtnSelector);
      await parentIframe.$eval(MacrosConstants.SaveExpresionBuilderBtnSelector, (el) => {
        (el as HTMLElement).click();
      });
    }
  }

  public async removeConditionForExpressionBuilder() {
    const isExpressionBuilderFlag: boolean = await this.IsExpressionBuilderEnable();
    if (isExpressionBuilderFlag) {
      await this.Page.click(MacrosConstants.ExpressionBuilderBtnSelector);
    }
    else {
      await this.Page.click(MacrosConstants.DisableExpressionBuilderRadioBtnSelector);
      await this.waitUntilSelectorIsVisible(MacrosConstants.EnableExpressionBuilderRadioBtnSelector);
      await this.Page.click(MacrosConstants.ExpressionBuilderBtnSelector);
    }
    const isExpressionBuilderConditionFlag: boolean = await this.IsExpressionBuilderConditionExists();
    const parentIframe: Page = await Iframe.GetIframe(
      this.Page,
      IFrameConstants.BuildExpressionParentIframe
    );
    const iframe: Page = await Iframe.GetChildIframeByParentIframe(
      this.Page,
      IFrameConstants.BuildExpressionParentIframe
    );
    if (isExpressionBuilderConditionFlag) {
      await iframe.$eval(MacrosConstants.ConditionMenuSelector, (el) => {
        (el as HTMLElement).click();
      });
      await iframe.waitForSelector(MacrosConstants.DeleteOptionSelector);
      await iframe.$eval(MacrosConstants.DeleteOptionSelector, (el) => {
        (el as HTMLElement).click();
      });
      await iframe.waitForSelector(MacrosConstants.OKBtnSelector);
      await iframe.$eval(MacrosConstants.OKBtnSelector, (el) => {
        (el as HTMLElement).click();
      });
      await parentIframe.waitForSelector(MacrosConstants.SaveExpresionBuilderBtnSelector);
      await parentIframe.$eval(MacrosConstants.SaveExpresionBuilderBtnSelector, (el) => {
        (el as HTMLElement).click();
      });
    }
  }

  public async addStaticValueConditionForExpressionBuilder() {
    const parentIframe: Page = await Iframe.GetIframe(
      this.Page,
      IFrameConstants.BuildExpressionParentIframe
    );
    const iframe: Page = await Iframe.GetChildIframeByParentIframe(
      this.Page,
      IFrameConstants.BuildExpressionParentIframe
    );
    const builtInTab = await iframe.waitForSelector(MacrosConstants.BuiltInTab);
    await iframe.$eval(MacrosConstants.BuiltInTab, (el) => {
      (el as HTMLElement).click();
    });
    await iframe.$eval(MacrosConstants.ControlCondition, (el) => {
      (el as HTMLElement).click();
    });
    const chooseName = await iframe.waitForSelector(
      MacrosConstants.DataEditorName
    );
    await chooseName.fill(MacrosConstants.ExpressionBuilderStaticQuery);

    await iframe.$eval(MacrosConstants.ConditionOperatorSelector, (el) => {
      (el as HTMLElement).click();
    });
    await this.waitUntilSelectorIsVisible(MacrosConstants.ConditionOperatorValueSelector, Constants.Five, iframe, Constants.MaxTimeout);
    await iframe.$eval(MacrosConstants.ConditionOperatorValueSelector, (el) => {
      (el as HTMLElement).click();
    });

    const chooseValue = await iframe.waitForSelector(
      MacrosConstants.DataEditorValue
    );
    await chooseValue.fill("");
    await chooseValue.fill(MacrosConstants.CustomerNamePrefixValue);
    await iframe.$eval(MacrosConstants.SelectRowSelector, (el) => {
      (el as HTMLElement).click();
    })
    await iframe.$eval(MacrosConstants.AppTextSelector, (el) => {
      (el as HTMLElement).click();
    });
    await iframe.$eval(MacrosConstants.GroupTypeSelector, (el) => {
      (el as HTMLElement).click();
    });
    await iframe.$eval(MacrosConstants.FalseConditionSelector, (el) => {
      (el as HTMLElement).click();
    });
    await iframe.$eval(MacrosConstants.AddanAction, (el) => {
      (el as HTMLElement).click();
    });
    await this.waitUntilSelectorIsVisible(MacrosConstants.CustomerServiceSelector, MacrosConstants.Three, iframe, Constants.OpenWsWaitTimeout);
    await iframe.$eval(MacrosConstants.CustomerServiceSelector, (el) => {
      (el as HTMLElement).click();
    });
    await iframe.waitForSelector(MacrosConstants.SelectDefaultScriptSelector);
    await iframe.$eval(MacrosConstants.SelectDefaultScriptSelector, (el) => {
      (el as HTMLElement).click();
    });
    await this.waitUntilSelectorIsVisible(MacrosConstants.ShowOptionSelector, MacrosConstants.Three, iframe, Constants.OpenWsWaitTimeout);
    await iframe.$eval(MacrosConstants.ShowOptionSelector, (el) => {
      (el as HTMLElement).focus();
    });
    await iframe.$eval(MacrosConstants.ShowOptionSelector, (el) => {
      (el as HTMLElement).click();
    });
    await this.waitUntilSelectorIsVisible(MacrosConstants.TextSelector.replace("{0}", TestSettings.ExpressionBuilderFirstAgentScriptName), MacrosConstants.Three, iframe);
    await iframe.$eval(MacrosConstants.TextSelector.replace("{0}", TestSettings.ExpressionBuilderFirstAgentScriptName), (el) => {
      (el as HTMLElement).click();
    });
    await iframe.$eval(MacrosConstants.TrueConditionSelector, (el) => {
      (el as HTMLElement).click();
    });
    await iframe.$eval(MacrosConstants.FalseConditionSelector, (el) => {
      (el as HTMLElement).click();
    });
    await this.waitUntilSelectorIsVisible(MacrosConstants.AddanAction, MacrosConstants.Three, iframe);
    await iframe.$eval(MacrosConstants.AddanAction, (el) => {
      (el as HTMLElement).click();
    });
    await this.waitUntilSelectorIsVisible(MacrosConstants.CustomerServiceSelector, MacrosConstants.Three, iframe, Constants.OpenWsWaitTimeout);
    await iframe.waitForSelector(MacrosConstants.CustomerServiceSelector);
    await iframe.$eval(MacrosConstants.CustomerServiceSelector, (el) => {
      (el as HTMLElement).click();
    });
    await iframe.waitForSelector(MacrosConstants.SelectDefaultScriptSelector);
    await iframe.$eval(MacrosConstants.SelectDefaultScriptSelector, (el) => {
      (el as HTMLElement).click();
    });
    await this.waitUntilSelectorIsVisible(MacrosConstants.ShowOptionSelector, MacrosConstants.Three, iframe, Constants.OpenWsWaitTimeout);
    await iframe.$eval(MacrosConstants.ShowOptionSelector, (el) => {
      (el as HTMLElement).focus();
    });
    await iframe.$eval(MacrosConstants.ShowOptionSelector, (el) => {
      (el as HTMLElement).click();
    });
    await this.waitUntilSelectorIsVisible(MacrosConstants.TextSelector.replace("{0}", TestSettings.ExpressionBuilderSecondAgentScriptName), MacrosConstants.Three, iframe);
    await iframe.$eval(MacrosConstants.TextSelector.replace("{0}", TestSettings.ExpressionBuilderSecondAgentScriptName), (el) => {
      (el as HTMLElement).click();
    });
    await parentIframe.waitForSelector(MacrosConstants.SaveExpresionBuilderBtnSelector);
    await parentIframe.$eval(MacrosConstants.SaveExpresionBuilderBtnSelector, (el) => {
      (el as HTMLElement).click();
    });
  }

  public async saveExistingMacroStep(searchRecord: string) {
    await this.Page.click(SelectorConstants.RecordLink.replace("{0}", searchRecord));
    await this._page.hover(MacrosConstants.SearchMacroInputSelector);
    await this._page.click(MacrosConstants.RemoveMacrolookUpSelector);
    const macroInput = await this.Page.waitForSelector(
      MacrosConstants.MacroLanguageInput
    );
    await macroInput.fill(MacrosConstants.TestMacro);
    await this.Page.click(MacrosConstants.MacroLanguageSearch);
    await this.Page.waitForSelector(
      MacrosConstants.MacroLanguageLookupValue.replace(
        "{0}",
        MacrosConstants.TestMacro
      )
    );
    await this.Page.click(
      MacrosConstants.MacroLanguageLookupValue.replace(
        "{0}",
        MacrosConstants.TestMacro
      )
    );
    await this.formSaveAndCloseButton();
  }

  // Used to search record on grid page and click on record
  public async searchMacroRecordAndDelete() {
    await this.waitUntilSelectorIsVisible(SelectorConstants.QuicksearchSMS, Constants.Five, this._page, Constants.OpenWsWaitTimeout);
    await this.Page.fill(SelectorConstants.QuicksearchSMS, this.newMarcos);
    await this.Page.click(SelectorConstants.QuicksearchSMSbutton);
    await this.waitUntilSelectorIsVisible(MacrosConstants.GridViewFirstRecordSelector, Constants.Five, this._page, Constants.FourThousandsMiliSeconds);
    await this.Page.click(MacrosConstants.GridViewFirstRecordSelector);
    await this.waitUntilSelectorIsVisible(MacrosConstants.DeleteBtnSelector, Constants.Five, this._page, Constants.FourThousandsMiliSeconds);
    await this.Page.click(MacrosConstants.DeleteBtnSelector);
    await this.waitUntilSelectorIsVisible(MacrosConstants.DeleteConfirmBtnSelector, Constants.Five, this._page, Constants.FourThousandsMiliSeconds);
    await this.Page.click(MacrosConstants.DeleteConfirmBtnSelector);
    await this.waitUntilSelectorIsVisible(MacrosConstants.CreateNewRecordBtnSelector, Constants.Five, this._page, Constants.OpenWsWaitTimeout);
  }

  public async checkRecordAvailable(recordName: string) {
    await this.searchRecord(recordName);
    return await this.waitUntilSelectorIsVisible(SelectorConstants.NoDataFoundSelector, Constants.Two, this._page, Constants.MaxTimeout);
  }

  // Used to search record on grid page and click on record
  public async searchRecord(record: string) {
    await this.waitUntilSelectorIsVisible(SelectorConstants.QuicksearchSMS, Constants.Two, this._page, Constants.MaxTimeout);
    await this.Page.fill(SelectorConstants.QuicksearchSMS, record);
    await this.waitUntilSelectorIsVisible(SelectorConstants.QuicksearchSMSbutton, Constants.Two, this._page, Constants.MaxTimeout);
    await this.Page.click(SelectorConstants.QuicksearchSMSbutton);
  }

  public async fillMacroNameAndDescription() {
    await this.Page.waitForSelector(
      MacrosConstants.MarcrosNameInput
    );
    await this.Page.fill(MacrosConstants.MarcrosNameInput, MacrosConstants.TestMacro);
    await this.Page.waitForSelector(
      MacrosConstants.MacroDescriptionSelector
    );
    await this.Page.fill(MacrosConstants.MacroDescriptionSelector, MacrosConstants.TestMacro);
    await this.waitForDomContentLoaded();
  }


  /// <summary>
  /// This method is used to create test macro
  /// </summary>
  public async createMacroSteps() {
    const iframe: Page = await Iframe.GetChildIframeByParentIframe(
      this.Page,
      IFrameConstants.MacroParentIframe
    );
    await this.waitUntilSelectorIsVisible(MacrosConstants.MacroPageControl, MacrosConstants.Five, iframe, Constants.MaxTimeout);
    await this.waitUntilSelectorIsVisible(MacrosConstants.StartMacroExecution, MacrosConstants.Three, iframe, Constants.MaxTimeout);
    await iframe.$eval(MacrosConstants.StartMacroExecution, (el) => {
      (el as HTMLElement).click();
    });
    await this.waitUntilSelectorIsVisible(MacrosConstants.MacrosNextStep, MacrosConstants.Three, iframe, Constants.MaxTimeout);
    await iframe.$eval(MacrosConstants.MacrosNextStep, (el) => {
      (el as HTMLElement).click();
    });
    await this.waitUntilSelectorIsVisible(MacrosConstants.BtnSessionConnector, MacrosConstants.Three, iframe, Constants.MaxTimeout);
    await iframe.$eval(MacrosConstants.BtnSessionConnector, (el) => {
      (el as HTMLElement).click();
    });
    await this.waitUntilSelectorIsVisible(MacrosConstants.BtnCurrentPage, MacrosConstants.Three, iframe, Constants.MaxTimeout);
    await iframe.$eval(MacrosConstants.BtnCurrentPage, (el) => {
      (el as HTMLElement).click();
    });
    await this.waitUntilSelectorIsVisible(MacrosConstants.MacrosNextStep, MacrosConstants.Three, iframe, Constants.MaxTimeout);
    await iframe.$eval(MacrosConstants.MacrosNextStep, (el) => {
      (el as HTMLElement).click();
    });
    await this.waitUntilSelectorIsVisible(MacrosConstants.BuiltInTab, MacrosConstants.Three, iframe, Constants.MaxTimeout);
    await iframe.$eval(MacrosConstants.BuiltInTab, (el) => {
      (el as HTMLElement).click();
    });
    await this.waitUntilSelectorIsVisible(MacrosConstants.MacrosControl, MacrosConstants.Three, iframe, Constants.MaxTimeout);
    await iframe.$eval(MacrosConstants.MacrosControl, (el) => {
      (el as HTMLElement).click();
    });
    await this.waitUntilSelectorIsVisible(MacrosConstants.ControlCondition, MacrosConstants.Three, iframe, Constants.MaxTimeout);
    await iframe.$eval(MacrosConstants.ControlCondition, (el) => {
      (el as HTMLElement).click();
    });
    await this.waitUntilSelectorIsVisible(MacrosConstants.DataEditorName, MacrosConstants.Three, iframe, Constants.MaxTimeout);
    const chooseName = await iframe.waitForSelector(
      MacrosConstants.DataEditorName
    );
    await chooseName.fill("");
    await chooseName.fill(MacrosConstants.SlugName);

    await iframe.$eval(MacrosConstants.ConditionOperatorSelector, (el) => {
      (el as HTMLElement).click();
    });
    await this.waitUntilSelectorIsVisible(MacrosConstants.ConditionValueSelector, Constants.Five, iframe, Constants.MaxTimeout);
    await iframe.$eval(MacrosConstants.ConditionValueSelector, (el) => {
      (el as HTMLElement).click();
    });
    await this.waitUntilSelectorIsVisible(MacrosConstants.DataEditorValue, MacrosConstants.Three, iframe, Constants.MaxTimeout);
    const chooseValue = await iframe.waitForSelector(
      MacrosConstants.DataEditorValue
    );
    await chooseValue.fill("");
    await chooseValue.fill("0");
    await iframe.$eval(MacrosConstants.SelectRowSelector, (el) => {
      (el as HTMLElement).click();
    })
    await iframe.$eval(MacrosConstants.AppTextSelector, (el) => {
      (el as HTMLElement).click();
    });
    await iframe.$eval(MacrosConstants.GroupTypeSelector, (el) => {
      (el as HTMLElement).click();
    });
    await this.waitUntilSelectorIsVisible(MacrosConstants.AddanAction, MacrosConstants.Three, iframe, Constants.MaxTimeout);
    await iframe.$eval(MacrosConstants.AddanAction, (el) => {
      (el as HTMLElement).click();
    });
    await this.waitUntilSelectorIsVisible(MacrosConstants.CreateRecord, MacrosConstants.Three, iframe, Constants.MaxTimeout);
    await iframe.$eval(MacrosConstants.CreateRecord, (el) => {
      (el as HTMLElement).click();
    });
    const entityLogicalName = await iframe.waitForSelector(
      MacrosConstants.EntityLogicalName
    );
    await entityLogicalName.fill(MacrosConstants.IncidentEntityName);
    await iframe.$eval(MacrosConstants.ShowAdvancedOptions, (el) => {
      (el as HTMLElement).click();
    });
    this.FillAttributeWithValue(iframe, MacrosConstants.AttributeOne, MacrosConstants.IncidentTitle, MacrosConstants.AttributeOneValue, MacrosConstants.IncidentTitleValue);
    await this.waitUntilSelectorIsVisible(MacrosConstants.BtnAddNewItem, MacrosConstants.Three, iframe, Constants.MaxTimeout);
    await iframe.$eval(MacrosConstants.BtnAddNewItem, (el) => {
      (el as HTMLElement).click();
    });
    this.FillAttributeWithValue(iframe, MacrosConstants.AttributeTwo, MacrosConstants.IncidentDescription, MacrosConstants.AttributeTwoValue, MacrosConstants.IncidentDescriptionValue);
    //save Macros
    await this.saveMacros();
  }

  public async createAgentScripts(agentScriptName: string) {
    await this.waitUntilSelectorIsVisible(MacrosConstants.AgentScriptFormTitle, MacrosConstants.Five, null, Constants.MaxTimeout);
    await this.waitUntilSelectorIsVisible(MacrosConstants.AgentScriptNameSelector, MacrosConstants.Three, null, Constants.MaxTimeout);
    await this._page.fill(MacrosConstants.AgentScriptNameSelector, agentScriptName);

    await this.waitUntilSelectorIsVisible(MacrosConstants.UniqueNameSelector, MacrosConstants.Three, null, Constants.MaxTimeout);
    var uniqueName = `msdyn_${new Date().getTime()}`;
    await this._page.fill(MacrosConstants.UniqueNameSelector, uniqueName);
    await this.waitUntilSelectorIsVisible(MacrosConstants.LanguageSelector, MacrosConstants.Three, null, Constants.MaxTimeout);
    await this.Page.selectOption(
      MacrosConstants.LanguageSelector,
      (LanguageMode.English as unknown) as string
    );
    await this.waitUntilSelectorIsVisible(MacrosConstants.SaveBtn, MacrosConstants.Three, null, Constants.MaxTimeout);
    await this._page.click(MacrosConstants.SaveBtn);

    await this.createAgentScriptStep(MacrosConstants.FirstTestScriptName, MacrosConstants.One, MacrosConstants.TestMacro);
    await this.createAgentScriptStep(MacrosConstants.SecondTestScriptName, MacrosConstants.Two, MacrosConstants.TestMacro);
    await this._page.click(MacrosConstants.SaveAndCloseBtn);
  }

  public async createAgentScriptStep(scriptStepName: string, order: string, macroName: string) {
    await this.waitUntilSelectorIsVisible(MacrosConstants.NewAgentScriptStep, MacrosConstants.Three, null, Constants.MaxTimeout);
    await this.Page.click(MacrosConstants.NewAgentScriptStep);
    await this.waitUntilSelectorIsVisible(MacrosConstants.AgentScriptStepNameSelector, MacrosConstants.Three, null, Constants.MaxTimeout);
    await this.Page.focus(MacrosConstants.AgentScriptStepNameSelector);
    await this.Page.fill(MacrosConstants.AgentScriptStepNameSelector, "");
    await this.Page.fill(MacrosConstants.AgentScriptStepNameSelector, scriptStepName);
    await this.waitUntilSelectorIsVisible(MacrosConstants.UniqueNameStepSelector, MacrosConstants.Three, null, Constants.MaxTimeout);
    var uniqueName = `msdyn_${new Date().getTime()}`;
    await this.Page.focus(MacrosConstants.UniqueNameStepSelector);
    await this.Page.fill(MacrosConstants.UniqueNameStepSelector, "");
    await this.Page.fill(MacrosConstants.UniqueNameStepSelector, uniqueName);
    await this.waitUntilSelectorIsVisible(MacrosConstants.Order, MacrosConstants.Three, null, Constants.MaxTimeout);
    await this.Page.focus(MacrosConstants.Order);
    await this.Page.fill(MacrosConstants.Order, "");
    await this.Page.fill(MacrosConstants.Order, order);
    await this.waitUntilSelectorIsVisible(MacrosConstants.ActionTypeStepSelector, MacrosConstants.Three, null, Constants.MaxTimeout);
    await this.Page.selectOption(
      MacrosConstants.ActionTypeStepSelector,
      (ActionTypeMode.Text as unknown) as string
    );
    await this.waitUntilSelectorIsVisible(MacrosConstants.TextDescriptionSelector, MacrosConstants.Three, null, Constants.MaxTimeout);
    await this.Page.focus(MacrosConstants.TextDescriptionSelector);
    await this.Page.fill(MacrosConstants.TextDescriptionSelector, "");
    await this.Page.fill(MacrosConstants.TextDescriptionSelector, macroName);
    await this.Page.click(MacrosConstants.SaveAgentScriptBtnStepBtn);
    await this.waitUntilSelectorIsVisible(MacrosConstants.NewAgentScriptStep, MacrosConstants.Three, null, Constants.MaxTimeout);
    await this.waitUntilSelectorIsVisible(SelectorConstants.RecordLink.replace("{0}", scriptStepName), MacrosConstants.Three, null, Constants.MaxTimeout);
    await this.Page.click(SelectorConstants.RecordLink.replace("{0}", scriptStepName));
    await this.waitUntilSelectorIsVisible(MacrosConstants.ActionTypeSelector, MacrosConstants.Three, null, Constants.MaxTimeout);
    await this.Page.selectOption(
      MacrosConstants.ActionTypeSelector,
      (ActionTypeMode.Macro as unknown) as string
    );
    await this.waitUntilSelectorIsVisible(MacrosConstants.MacroLanguageInputStep, MacrosConstants.Three, null, Constants.MaxTimeout);
    await this.Page.focus(MacrosConstants.MacroLanguageInputStep);
    await this.Page.hover(MacrosConstants.MacroLanguageInputStep);
    await this.Page.fill(MacrosConstants.MacroLanguageInputStep, macroName);
    await this.Page.click(MacrosConstants.MacroLanguageSearchStep);
    await this.waitUntilSelectorIsVisible(MacrosConstants.MacroLanguageLookupValueStep.replace("{0}", macroName), MacrosConstants.Three, null, Constants.MaxTimeout);
    await this.Page.click(MacrosConstants.MacroLanguageLookupValueStep.replace("{0}", macroName));
    await this.Page.click(MacrosConstants.SaveAndCloseBtn);
  }

  public async recreateAgentScriptSteps(firstScriptStepName: string, secondScriptStepName: string) {
    await this.waitUntilSelectorIsVisible(MacrosConstants.NewAgentScriptStep, MacrosConstants.Three, null, Constants.MaxTimeout);
    const isFirstScriptStepAvailable = await this.waitUntilSelectorIsVisible(SelectorConstants.RecordLink.replace("{0}", firstScriptStepName), MacrosConstants.Three, null, Constants.MaxTimeout);
    if (isFirstScriptStepAvailable) {
      const isFirstScriptAsMacro = await this.waitUntilSelectorIsVisible(SelectorConstants.MacroRecordLink.replace("{0}", firstScriptStepName), MacrosConstants.Three, null, Constants.MaxTimeout);
      if (!isFirstScriptAsMacro) {
        await this.Page.click(SelectorConstants.RecordLink.replace("{0}", firstScriptStepName));
        await this.waitUntilSelectorIsVisible(MacrosConstants.AgentScriptStepTitleSelector.replace("{0}", firstScriptStepName), MacrosConstants.Five, null, Constants.MaxTimeout);
        await this.Page.click(MacrosConstants.DeleteBtnSelector);
        await this.waitUntilSelectorIsVisible(MacrosConstants.ConfirmBtn, MacrosConstants.Three, null, Constants.MaxTimeout);
        await this.Page.click(MacrosConstants.ConfirmBtn);
        await this.createAgentScriptStep(firstScriptStepName, MacrosConstants.One, MacrosConstants.TestMacro);
      }
    }
    else {
      await this.createAgentScriptStep(firstScriptStepName, MacrosConstants.One, MacrosConstants.TestMacro);
    }

    const isSecondScriptStepAvailable = await this.waitUntilSelectorIsVisible(SelectorConstants.RecordLink.replace("{0}", secondScriptStepName), MacrosConstants.Three, null, Constants.MaxTimeout);
    if (isSecondScriptStepAvailable) {
      const isSecondScriptAsMacro = await this.waitUntilSelectorIsVisible(SelectorConstants.MacroRecordLink.replace("{0}", secondScriptStepName), MacrosConstants.Three, null, Constants.MaxTimeout);
      if (!isSecondScriptAsMacro) {
        await this.Page.click(SelectorConstants.RecordLink.replace("{0}", secondScriptStepName));
        await this.waitUntilSelectorIsVisible(MacrosConstants.AgentScriptStepTitleSelector.replace("{0}", secondScriptStepName), MacrosConstants.Five, null, Constants.MaxTimeout);
        await this.Page.click(MacrosConstants.DeleteBtnSelector);
        await this.waitUntilSelectorIsVisible(MacrosConstants.ConfirmBtn, MacrosConstants.Three, null, Constants.MaxTimeout);
        await this.Page.click(MacrosConstants.ConfirmBtn);
        await this.createAgentScriptStep(secondScriptStepName, MacrosConstants.Two, MacrosConstants.TestMacro);
      }
    }
    else {
      await this.createAgentScriptStep(secondScriptStepName, MacrosConstants.Two, MacrosConstants.TestMacro);
    }
    await this.Page.click(MacrosConstants.SaveAndCloseBtn);
  }

  public async navigateToSessions() {
    await this.Page.click(SelectorConstants.SessionsTabsMenuItem);
  }


  public async fillSessionTab() {
    try {
      await this.waitUntilSelectorIsVisible(MacrosConstants.UniqueNameSelector, MacrosConstants.Three, null, Constants.MaxTimeout);
      await this.fillInputData(
        SelectorConstants.NameInput,
        TestSettings.FacebookSessionName
      );
      await this.fillInputData(
        SelectorConstants.ApplicationTitle,
        MacrosConstants.SessionTitle
      );
      await this.Page.fill(
        SelectorConstants.Description,
        MacrosConstants.SessionDescription
      );

      await this.Page.selectOption(
        MacrosConstants.SessionType,
        { label: MacroConstants.Generic }
      );
      var uniqueName = `msdyn_${new Date().getTime()}`;
      await this.fillInputData(
        MacrosConstants.UniqueNameSelector,
        uniqueName
      );

      await this.fillInputData(SelectorConstants.AncorTab, MacrosConstants.CustomerSummary);
      await this.Page.click(SelectorConstants.AnchorTypeLookupSearch);
      await this.waitUntilSelectorIsVisible(SelectorConstants.AnchorTabLookUpValue.replace("{0}", MacrosConstants.CustomerSummary), MacrosConstants.Three, null, Constants.MaxTimeout);
      await this.Page.click(SelectorConstants.AnchorTabLookUpValue.replace("{0}", MacrosConstants.CustomerSummary));
    }
    catch (error) {
      throw new Error(`FaceBook session creation fails. Error message: ${error.message}`);
    }
    await this.Page.click(SelectorConstants.FormSaveButton);
    await this.waitForSaveComplete();
  }

  public async fillExistingAgentScripts() {
    await this.waitUntilSelectorIsVisible(MacrosConstants.SessionTitleSelector.replace("{0}", TestSettings.FacebookSessionName), MacrosConstants.Three, null, Constants.MaxTimeout);
    await this.waitUntilSelectorIsVisible(MacrosConstants.SessionAdditionalTabSelector, MacrosConstants.Three, null, Constants.MaxTimeout);
    await this.waitUntilSelectorIsVisible(MacrosConstants.Session_AgentScriptsTab, MacrosConstants.Three, null, Constants.MaxTimeout);
    await this.Page.click(MacrosConstants.Session_AgentScriptsTab);

    await this.waitUntilSelectorIsVisible(MacrosConstants.Session_AddExistingAgentScriptsBtn, MacrosConstants.Three, null, Constants.MaxTimeout);
    await this.Page.click(MacrosConstants.Session_AddExistingAgentScriptsBtn);

    await this.waitUntilSelectorIsVisible(MacrosConstants.Sesion_AgentScriptLookUpName, MacrosConstants.Three, null, Constants.MaxTimeout);
    await this.Page.fill(MacrosConstants.Sesion_AgentScriptLookUpName, TestSettings.ExpressionBuilderFirstAgentScriptName);

    await this.waitUntilSelectorIsVisible(MacrosConstants.Session_SearchAgentScriptBtn, MacrosConstants.Three, null, Constants.MaxTimeout);
    await this.Page.click(MacrosConstants.Session_SearchAgentScriptBtn);

    await this.waitUntilSelectorIsVisible(MacrosConstants.LookUpResultSelector.replace("{0}", TestSettings.ExpressionBuilderFirstAgentScriptName), Constants.Three, this._page, Constants.MaxTimeout);
    await this.Page.click(MacrosConstants.LookUpResultSelector.replace("{0}", TestSettings.ExpressionBuilderFirstAgentScriptName));

    await this.waitUntilSelectorIsVisible(MacrosConstants.Sesion_AgentScriptLookUpName, MacrosConstants.Three, null, Constants.MaxTimeout);
    await this.Page.fill(MacrosConstants.Sesion_AgentScriptLookUpName, TestSettings.ExpressionBuilderSecondAgentScriptName);

    await this.waitUntilSelectorIsVisible(MacrosConstants.Session_SearchAgentScriptBtn, MacrosConstants.Three, null, Constants.MaxTimeout);
    await this.Page.click(MacrosConstants.Session_SearchAgentScriptBtn);

    await this.waitUntilSelectorIsVisible(MacrosConstants.LookUpResultSelector.replace("{0}", TestSettings.ExpressionBuilderSecondAgentScriptName), Constants.Three, this._page, Constants.MaxTimeout);
    await this.Page.click(MacrosConstants.LookUpResultSelector.replace("{0}", TestSettings.ExpressionBuilderSecondAgentScriptName));

    await this.Page.click(MacrosConstants.AddButton);
    await this.waitForSaveComplete();
  }

  public async navigateToWorkStreamsView() {
    await this.Page.waitForSelector(SelectorConstants.WorkStreamsMenuItem);
    await this.Page.click(SelectorConstants.WorkStreamsMenuItem);
    await this.waitForDomContentLoaded();
  }

  public async navigateToTab(tabName: WorkStreamTab) {
    await this.Page.waitForSelector(SelectorConstants.WorkStreamTab.replace("{0}", tabName));
    await this.Page.click(
      SelectorConstants.WorkStreamTab.replace("{0}", tabName)
    );
  }

  public async fillFacebookTemplateData() {
    const sessionExistsInWS = await this.waitUntilSelectorIsVisible(MacrosConstants.FacebookNewSessionWSSelector.replace("{0}", TestSettings.FacebookSessionName), Constants.Three, this._page, Constants.MaxTimeout);
    if (!sessionExistsInWS) {
      await this._page.hover(MacrosConstants.FBDefaultSession);
      await this._page.click(MacrosConstants.FBDeleteSession);
      const macroInput = await this.Page.waitForSelector(
        MacrosConstants.FBNewTemplateInput
      );
      await macroInput.fill(TestSettings.FacebookSessionName);
      await this.Page.click(MacrosConstants.FBSessionSearch);
      await this.waitUntilSelectorIsVisible(MacrosConstants.FBTemplateLookupValue.replace("{0}", TestSettings.FacebookSessionName), Constants.Three, this._page, Constants.MaxTimeout);
      await this.Page.click(MacrosConstants.FBTemplateLookupValue.replace("{0}", TestSettings.FacebookSessionName));
      await this.waitUntilSelectorIsVisible(MacrosConstants.FBDefaultSession, Constants.Two, this._page, Constants.MaxTimeout);
      await this.Page.click(SelectorConstants.FormSaveButton);
      await this.waitForSaveComplete();
    }
  }

  public async openAgentScriptRecord(record: string) {
    await this.waitUntilSelectorIsVisible(SelectorConstants.UserNameLink.replace("{0}", record), Constants.Five, this._page, Constants.MaxTimeout);
    await this.Page.click(SelectorConstants.GridViewFirstCell);
    await this.waitUntilSelectorIsVisible(SelectorConstants.EnableBtnSelector, Constants.Three, this._page, Constants.MaxTimeout);
    await this.Page.keyboard.press(Constants.EnterKey);
    await this.waitUntilSelectorIsVisible(MacrosConstants.AgentScriptTitleSelector.replace("{0}", record), Constants.Five, this._page, Constants.MaxTimeout);
  }

  public async ActivateMacro(macroName:string){
    await this.navigateToMacrosTab();
    await this.searchRecord(macroName);
    await this.waitUntilSelectorIsVisible(MacrosConstants.GridViewFirstRecordSelector, Constants.Five, this._page, Constants.FourThousandsMiliSeconds);
    await this.Page.click(MacrosConstants.GridViewFirstRecordSelector);
    const activateBtnEnable = await this.waitUntilSelectorIsVisible(MacrosConstants.ActivateBtnSelector, Constants.Five, this._page, Constants.FourThousandsMiliSeconds);
    if(activateBtnEnable){
      await this.Page.click(MacrosConstants.ActivateBtnSelector);
      await this.waitUntilSelectorIsVisible(MacrosConstants.ActivateBtnInPopUpSelector, Constants.Five, this._page, Constants.FourThousandsMiliSeconds);
      await this.Page.click(MacrosConstants.ActivateBtnInPopUpSelector);
    }
  }

  public async createMacro(macroName:string) {
    await this.waitForDomContentLoaded();
    await this.waitUntilSelectorIsVisible(MacrosConstants.MarcrosNameInput, MacrosConstants.Three, null, Constants.MaxTimeout);
    const marcrosNameInput = await this.Page.waitForSelector(
      MacrosConstants.MarcrosNameInput
    );
    await this.fillInputData(MacrosConstants.MarcrosNameInput, macroName);
  }

  public async validateDataIsAvailable() {
    return await this.waitUntilSelectorIsVisible(SelectorConstants.NoDataFoundSelector,Constants.Two,this._page,Constants.MaxTimeout);
  }
}


