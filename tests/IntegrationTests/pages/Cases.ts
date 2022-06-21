import {
  AgentChatConstants,
  AgentConversationPageConstants,
  Constants,
  SelectorConstants,
} from "../Utility/Constants";

import { Page } from "playwright";
import { RoutingRulePage } from "../pages/RoutingRule";
import { TestSettings } from "../configuration/test-settings";
import { IFrameConstants, IFrameHelper } from "../Utility/IFrameHelper";
import { TimeoutConstants } from "../constants";

export enum CustomConstants {
  assign = "//img[contains(@title,'Assign')]",
  select1 = '//div[@data-id="rdoMe_id.fieldControl-checkbox-container"]',
  selectlookup = "//input[@placeholder='Look for records']",
  UsersMenuItem = "//span[contains(.,'Users')]",
  CaseMenuItem = " //li[contains(@id,'sitemap')]//span[contains(text(),'Cases')]",
  CustomEntityMenuItem = " //li[contains(@id,'sitemap')]//span[contains(text(),'Custom Entity')]",
  AccountMenuItem = " //li[contains(@id,'sitemap')]//span[contains(text(),'Accounts')]",
  EntityRecordsMenuItem = " //li[contains(@id,'sitemap')]//span[contains(text(),'Entity Records')]",
  NameInput = "input[data-id='name.fieldControl-text-box-text']",
  CaseTitle = "input[data-id='title.fieldControl-text-box-text']",
  CaseSkill = "input[data-id='new_skill.fieldControl-text-box-text']",
  CaseSkillTwo = "//input[@data-id='new_skilltwo.fieldControl-text-box-text']",
  CustomEntityTitle = "//input[@data-id='new_name.fieldControl-text-box-text']",
  CustomerName = "input[data-id='customerid.fieldControl-LookupResultsDropdown_customerid_textInputBox_with_filter_new']",
  CustomerSearchButton = "button[data-id='customerid.fieldControl-LookupResultsDropdown_customerid_search']",
  CustomerLookupValue = "div[data-id='customerid.fieldControl|__flyoutRootNode_SimpleLookupControlFlyout'] li[aria-label*='{0}']",
  Save = "button[data-id='incident|NoRelationship|Form|Mscrm.Form.incident.Save']",
  CustomEntitySave = "button[aria-label='Save (CTRL+S)']",
  SaveandRoute = "button[data-id='incident|NoRelationship|Form|Mscrm.Form.incident.SaveAndRunRoutingRule']",
  CustomEntitySaveAndRoute = "button[aria-label='Save & Route']",
  ResolveCase = "//li/button[@aria-label='Resolve Case']",
  SelectResolutionType = "select[data-id='resolutionType_id.fieldControl-option-set-select']",
  ResolutionDesciption = "input[data-id='resolution_id.fieldControl-text-box-text']",
  Duration = "input[data-id='totaltime_id.fieldControl-duration-combobox-text']",
  BillableTime = "input[data-id='billabletime_id.fieldControl-duration-combobox-text']",
  ResolveCaseClick = "button[data-lp-id='dialogFooterContainer|ok_id']",
  ResolveSystemMessage = "span[data-id='warningNotification']",
  ConfirmButton = "//button[contains(@id,'confirmButton')]",
  RouteConfirmButton = "#confirmButtonText",
  OkButton = "button[data-id='okButton']",
  EntityName = "input[data-id='msdyn_name.fieldControl-text-box-text']",
  EntityType = "input[data-id='msdyn_entity.fieldControl-activityEnabledEntityListCombobox-text']",
  AddRoutingRuleSet = "button[data-id='routingrule|NoRelationship|SubGridStandard|Mscrm.SubGrid.routingrule.NewRecord']",
  RoutingRuleName = "input[data-id='name.fieldControl-text-box-text']",
  CaseEntity = "input[data-id='msdyn_entitylogicalname.fieldControl-activityEnabledEntityListCombobox-text']",
  CaseClick = "div[aria-label='Entity']",
  RoutingRuleEntity = "input[data-id='msdyn_entitylogicalname.fieldControl-activityEnabledEntityListCombobox-text']",
  NewRuleItem = "button[data-id='routingruleitem|NoRelationship|SubGridStandard|Mscrm.SubGrid.routingruleitem.AddNewStandard']",
  RuleItemName = "div[data-lp-id='MscrmControls.FieldControls.TextBoxControl|name.fieldControl|routingruleitem'] input[aria-label='Name']",
  AddRowButton = "button[name='Add row']",
  AddRowSpan = "span[data-automationid='splitbuttonprimary']",
  FieldSelector = "button[aria-label='Priority']",
  PriorityValue = "input[aria-label='Value']",
  RouteTo = "select[data-id='msdyn_routeto.fieldControl-option-set-select']",
  AddtoQueueInput = "input[data-id='routedqueueid.fieldControl-LookupResultsDropdown_routedqueueid_textInputBox_with_filter_new']",
  AddtoQueueSearch = "button[data-id='routedqueueid.fieldControl-LookupResultsDropdown_routedqueueid_search']",
  AddtoQueueValue = "div[data-id='routedqueueid.fieldControl-LookupResultsDropdown_routedqueueid_tabContainer'] li[aria-label*='{0}']",
  RuleItemSaveandClose = "button[data-id='routingruleitem|NoRelationship|Form|Mscrm.Form.routingruleitem.SaveAndClose']",
  RuleItemSave = "button[data-id='routingruleitem|NoRelationship|Form|Mscrm.Form.routingruleitem.Save']",
  PriorityElementClick = "span[data-automationid='splitbuttonprimary']",
  ActivateRule = "button[data-id='routingrule|NoRelationship|Form|Mscrm.Form.routingrule.Activate']",
  ActivateConfirm = "button[data-lp-id='dialogFooterContainer|ok_id']",
  CasesService = "li[data-lp-id='sitemap-entity-CasesSubArea_8292298e']",
  CasesRoutedContactName = "//label[contains(text(), 'Contact 2')]",
  CasesRoutedAccountName = "//label[contains(text(), 'LiveChatTestAccount2')]",
  CustomEntityService = "li[aria-label='Custom Entity']",
  CaseNewRecord = "button[data-id='incident|NoRelationship|HomePageGrid|Mscrm.HomepageGrid.incident.NewRecord']",
  CustomEntityNewRecord = "button[aria-label='New']",
  FlowButtonClick = "button[data-id='routingrule|NoRelationship|Form|Mscrm.Form.routingrule.Flows.RefreshCommandBar']",
  CreateFlow = "button[data-id='Mscrm.Flows.TriggerFlow.ManageFlows']",
  CreateSolution = "//span[contains(text(),'Solutions')]",
  InputSearchSolution = "input[aria-label='Search solutions']",
  DefaultSolutionSelection = "//div[aria-rowindex='2']",
  SelectFlow = "//i[data-icon-name='ChevronDown']",
  SwitchAppSelector = "[data-id='navbar-switch-app']",
  NavigateToCSHScreenSelector = "//*[contains(text(),'Customer Service Hub')]",
  NavigateToAgentScreenSelector = "//*[contains(text(),'Omnichannel for Customer Service')]",
  NavigateToAdminScreenSelector = "//*[contains(text(),'Omnichannel Administration')]",
  PriorityExpandclick = "button[data-id='header_overflowButton']",
  PriorityType = "select[data-id='header_prioritycode.fieldControl-option-set-select']",
  AcceptButtonId = "#acceptButton",
  AgentPopUpWaitingTimeout = 60000,
  One = 1,
  OverFlowButton = "button[data-lp-id='Form:incident-OverflowButton']",
  QueueItemDetailsClose = "button[data-id='queueitem|NoRelationship|Form|Mscrm.Form.queueitem.SaveAndClose']",
  QueueItemDetails = "button[data-lp-id='Form:incident-incident|NoRelationship|Form|Mscrm.Form.incident.QueueItemDetailOmnichannel']",
  QueueItemDetailsUR = "button[data-lp-id='Form:incident-incident|NoRelationship|Form|Mscrm.Form.incident.QueueItemDetail']",
  QueueItemDetailsURQueueVal = "//div[@role='presentation' and @data-id='queueid.fieldControl-Lookup_queueid']",
  DialogText = "//span[contains(text),'This record was transferred to the Omnichannel queue')]",
  DialogMessageText = "span[data-id='dialogMessageText']",
  CustomEntityRouteTitleText = "//h1[@id='dialogTitleText']",
  NavigateClick = "span[data-id='appBreadCrumbText']",
  ResolveOverFlow = "button[data-id='OverflowButton']",
  ResolveCaseClickButton = "button[data-id='incident|NoRelationship|Form|Mscrm.Form.incident.Resolve']",
  CaseSearchBox = "//input[@data-id='quickFind_text_1']",
  QuickFindBtn = "//button[@aria-label='Start search']",
  DataRowCount = "//div[@data-row-count]",
  DateRowCaseLink = "//div[@data-row-count]//a[@title='{0}']",
  NewRowCaseLink = "//a[@aria-label='{0}']",
  MoreCaseCommands = "//button[@aria-label='More commands for Case']",
  ResolveCaseBtn = "//button[@data-id='incident|NoRelationship|Form|Mscrm.Form.incident.Resolve']",
  ResolveCaseDialog = "//div[@role='dialog' and @data-id='ResolveCase']",
  ResolveCaseDialogAgentDashboard = "//div[@role='presentation'and @data-lp-id='dialogView|ResolveCase|dialogTabsContainer']",
  Resolution = "//input[@data-id='resolution_id.fieldControl-text-box-text']",
  ResolveBtn = "//button[@data-lp-id='dialogFooterContainer|ok_id']",
  WarningNotification = "//div[@id='notificationMessageAndButtons']//span[@data-id='warningNotification']",
  Resolved = "Resolved",
  Solved = "Solved",
  ActivityViewDDL = "//*[@title='Select a view']",
  ActivitiesBtn = "//li[@title='{0}' and @role='option']",
  ActivityStatus = "//div[@role='gridcell' and @title='{0}']",
  ActivityGridBody = "//div[@data-id='data-set-body-container']",
  GridRowCount = "//div[@data-id='grid-cell-container' and @data-row-count]",
  OpenActivity = "Open Activities",
  ClosedActivity = "Closed Activities",
  OpenStatus = "Open",
  CompletedStatus = "Completed",
  CSHAreaSwitchSelector = "//button[@data-id='sitemap-areaSwitcher-expand-btn']",
  ServiceManagementAreaSelector = "//*[@data-id='areaswitcherflyout-Service_Management']",
  CSHAISettingsSelector = "//li[@data-id='sitemap-entity-AnalyticsInsightsAdminSettingsSubArea']",
  CSHAIAISuggestionSettingsSelector = "//button[contains(@aria-label,'Manage Suggestions')]",
  CaseSuggestionToggleLabel = "#casetoggle+label",
  CaseSuggestionToggleBtn = "//button[@id='casetoggle']",
  LabelValNo = "No",
  LabelValYes = "Yes",
  KMSuggestionToggleLabel = "#kbtoggle+label",
  KMSuggestionToggleBtn = "//button[@id='kbtoggle']",
  SaveSuggestionSettings = "//button[@aria-label='Save']",
  AITrainedTimeSelector = "#row-traineddatetime .field-col-value",
  NewTabAgentDashboard = "button[data-id='create-new-tab-button']",
  QueuesView = "//li[@data-lp-id='sitemap-entity-QueueItemsSubArea_847fdf53']",
  FirstItemInQueueItem = "//div[@data-lp-id='MscrmControls.Grid.ReadOnlyGrid|entity_control|queueitem|8ef40d37-0868-440c-af6b-cac0c62e78e3|queueitem|cc-grid|cc-grid-cell|cell-0-1']",
  RouteToButton = "//button[@data-lp-id='HomePageGrid:queueitem-queueitem|NoRelationship|HomePageGrid|Mscrm.HomepageGrid.queueitem.Route']",
  PickButton = "//button[@data-lp-id='HomePageGrid:queueitem-queueitem|NoRelationship|HomePageGrid|Mscrm.HomepageGrid.queueitem.Pick']",
  RouteToTypeSelect = "select[data-id='routeto_id.fieldControl-checkbox-select']",
  RouteToRemoveFromQ = "select[data-id='chkBoxRemoveItem_id.fieldControl-checkbox-select']",
  PickRemoveFromQ = "select[data-id='checkboxpick_id.fieldControl-checkbox-select']",
  RouteToCancel = "//button[@data-lp-id='dialogFooterContainer|cancel_id']",
  AllActiveCases = "//button[@class='cc-ds-headerbtn cc-ds-header-select-all-btn']",
  DeleteCases = "//*[@id='account|NoRelationship|HomePageGrid|Mscrm.HomepageGrid.account.DeleteMenu.Menu$button1']",
  ResolveCaseCasesView = "//button[@data-lp-id='HomePageGrid:incident-incident|NoRelationship|HomePageGrid|Mscrm.HomepageGrid.incident.Resolve']",
  FirstActiveCase = "//div[@data-lp-id='MscrmControls.Grid.ReadOnlyGrid|entity_control|incident|00000000-0000-0000-00aa-000010001030|incident|cc-grid|cc-grid-cell|cell-0-1']",
  DeleteCase = "//button[@data-lp-id='Form:incident-incident|NoRelationship|Form|Mscrm.Form.incident.Delete']",
  ItemCannotRemoveLabel = "//label[@aria-label='The item(s) cannot be removed from the UR queue(s).']",
  CSHRoutingRuleSetSelector = "//li[contains(@data-id,'sitemap-entity-RoutingRule')]",
  CSHRoutingRuleSetNewButtonSelector = "//button[contains(@data-id,'routingrule|NoRelationship|HomePageGrid|Mscrm.HomepageGrid.routingrule.NewRecord')]",
  RoutingRuleSetNameSelector = "//input[@aria-label='Name']",
  CSHRoutingRuleSetSaveButtonSelector = "//button[contains(@data-id,'routingrule|NoRelationship|Form|Mscrm.Form.routingrule.Save')]",
  UnsaveDialogDivSelector = "//*[@id='modalDialogContentContainer']",
  UnsaveDialogCancelBtn = "//*[@id='cancelButton']",
  CSHRoutingRuleSetCloseRuleItemButtonSelector = "//*[contains(@data-id,'routingruleitem|NoRelationship|Form|Mscrm.Form.routingruleitem.CloseMFD')]",
  CSHRoutingRuleSetDeleteButtonSelector = "//*[contains(@data-id,'routingrule|NoRelationship|Form|Mscrm.Form.routingrule.Delete')]",
  SearchQueue = "//*[@data-test-id='queue-list-search-box']",
  SearchRoutingRule = "//input[@aria-label='Routing Rule Set Search this view']",
  NoRoutingRuleRecord = "//div[@title='No data available.']",
  NoQueueRecord = "//*[@data-test-id='queue-list-none-found']",
  SelectGridQueueRecordSelector = "//*[@data-automationid='ListCell']//div[1]//div[@aria-colindex=1]//div[@data-automationid='DetailsRowCheck']",
  DeleteAdvanceQueueRecordSelector = "//*[contains(@data-test-id,'queue-list-delete-queue')]",
  DeleteAdvanceQueueRecordConfirmationBtnSelector = "//*[contains(@data-test-id,'queue-list-delete-queue-confirm-bnt')]",
  CSHAdvanceQueuesSetSelector = "//li[contains(@data-id,'sitemap-entity-AdvancedQueuesSubArea')]",
  NewAdvanceQueueButtonSelector = "//*[contains(@data-test-id,'queue-list-new-queue')]",
  QueueNameSelector = "//*[contains(@data-test-id,'create-queue-name')]",
  GroupNumberSelector = "//*[contains(@data-test-id,'create-queue-priority')]",
  RecordTypeQueueName = "EntityRecordTypeQueue",
  QueueTypeDDSelector = "//*[@data-test-id='create-queue-type']",
  RecordTypeButtonSelector = "//button[@title='Record']",
  CreateQueueButtonSelector = "//*[@data-test-id='create-queue-btn']",
  ConfirmQueueDeletionButton = "//*[contains(@data-id,'confirmButton')]",
  RoutingRulesDeletionButton = "//*[contains(@data-id,'routingrule|NoRelationship|HomePageGrid|Mscrm.HomepageGrid.routingrule.DeleteMenu')]",
  MessagingTypeQueueName = "EntityMessagingTypeQueue",
  MessagingTypeButtonSelector = "//button[@title='Messaging']",
  RecordTypeRoutingRuleSetName = "RecordTypeRoutingRuleSet",
  MessagingTypeRoutingRuleSetName = "MessagingTypeRoutingRuleSet",
  AccountTitle = "//*[@title='Account Name']",
  DeleteAccount = "//button[@data-id='account|NoRelationship|HomePageGrid|Mscrm.HomepageGrid.account.DeleteMenu']",
  Diagnostics = "//span[contains(.,'Diagnostics')]",
  DiagnosticsearchText = "//input[@placeholder='Search this view']",
  Diagnosticsearch = '//button[@aria-label="Start search"]',
  selectcase = "span[aria-label='Select or deselect the row']",
  Route = "//span[@id='confirmButtonText']",
  inbox = "(//img[contains(@title,'Inbox')])",
  openworkitem = "//div[text()='Open work items']/following::button[@aria-label='More options'][1]",
  assigntome = "//div[contains(@data-id,'msdyn_ocliveworkitem.OmniChannelPick')]",
  inboxinside = '//*[@id="msdyn_MscrmControls.InboxShellControl-InboxShellControl_Container"]/div[1]/div/div/div/div[1]/div[1]/button',
  Refresh = "//button[@aria-label='Refresh']",
  popout = "(//i[@data-icon-name='OpenInNewTab'])[1]",
  RefreshOnDashboard = "//button[@aria-label='Refresh All']",
  CSWCaseNumber = "input[data-id='header_ticketnumber.fieldControl-text-box-text']",
  //Inbox customer grouping
  SelectInbox = "//li[@title='Inbox']",
  SelectAssignedConversations = "//button[@aria-label='Assigned conversations']",
  SelectAssignedConversationsDropdownMenuItem = "//*[text()='Assigned conversations']",
  SelectCases = "//*[contains(text(),'Cases')]",
  CasesDropdownMenu = "//button[@aria-label='Cases' and @aria-expanded='false']",
  SelectSort = "//button/div/span[contains(text(),'Sort')]",
  SortByCustomer = "//button/div/span[contains(text(),'Customer')]",
  SortByAscending = "//button/div/span[contains(text(),'Ascending')]",
  Escape = "Escape",
  QuickCreate = "//button[@aria-label='Press CTRL + Enter to open site map item in a new tab' or @data-id='create-new-tab-button']",
  SaveAndClose = "//li/button[@aria-label='Save & Close']",
  TypesofCases = "//span[@data-automationid='splitbuttonprimary']/i[@data-icon-name='ChevronDown']",
  DropdownOption1 = "//div/span[text()='Active Cases']",
  CaseRecordValidation = "//a[@title='{0}']",
}

export enum ResolutionType {
  ProblemSolved = "5",
}
export enum RouteTo {
  Value = "1",
}

export enum PriorityType {
  High = "1",
  Medium = "2",
  Low = "3"
}

export enum EntityRecordsTab {
  RoutingRules = "tablist-Routing Rules",
}

export class CasesPage extends RoutingRulePage {
  private newAccountData = {
    Name: "TestAccount",
  };
  private newCSHCaseData = {
    Name: "TestAccount",
    Resolutionsummary: "Case Resolved",
    TotalTime: "30 minutes",
    ResolvedSystemText: "Read-only  This record’s status: Resolved",
  };

  private newCSHCaseDataCase = {
    Name: "Case",
    Resolutionsummary: "Case Resolved",
    TotalTime: "30 minutes",
    ResolvedSystemText: "Read-only  This record’s status: Resolved",
  };

  private newCSHCaseData1 = {
    Name: "TestAccount",
    ContactName: "Contact 1",
    AccountName: "LiveChatTestAccount1"
  };
  private newEntityData = {
    Name: "TestCase",
    type: "incident",
  };

  private newCustomEntityData = {
    Name: "CustomEntityTestCase",
    RouteSystemText: "Do you want to route this customur499?",
    RouteTitleSystemText: "Route CustomUR499",
  };

  private newCaseWorkStream = {
    Name: "Case RI",
    EntityType: "Case",
  };

  private newRuleItemData = {
    Name: "Case Push RI",
    FieldSelector: "Priority",
    Value: "High",
  };

  public newAccountTestData;
  public newEntityTestData;
  public newCasesTestData;
  public newCustomEntityTestData;
  public newCustomerMultiTargetLookUpdata;
  public newMultiTargetCaseTitle;
  public newCustomerAccountMultiTargetLookUpdata;

  private AssignTo: string;
  newAccountTestData1: string;

  constructor(page: Page) {
    super(page);
    this.AssignTo = TestSettings.AgentAccountEmail;
  }

  public async openNewCase() {
    await this.waitForDomContentLoaded();
    await this.Page.click(SelectorConstants.NewRecordButton);
  }

  public async openNewCaseItem() {
    await this.Page.click(CustomConstants.CasesService);
    await this.Page.click(CustomConstants.CaseNewRecord);
    await this.Page.waitForTimeout(Constants.DefaultTimeout);
  }

  public async openNewCustonEntityItem() {
    await this.Page.click(CustomConstants.CustomEntityService);
    await this.Page.click(CustomConstants.CustomEntityNewRecord);
    await this.Page.waitForTimeout(Constants.DefaultTimeout);
  }

  public async navigateToCasesTabView() {
    await this.Page.click(CustomConstants.CaseMenuItem);
    await this.Page.waitForTimeout(Constants.DefaultTimeout);
  }

  public async navigateToCustomeEntityTabView() {
    await this.Page.click(CustomConstants.CustomEntityMenuItem);
    await this.Page.waitForTimeout(Constants.DefaultTimeout);
  }

  public async navigateToAccountTabView() {
    await this.Page.click(CustomConstants.AccountMenuItem);
    await this.Page.waitForTimeout(Constants.DefaultTimeout);
  }

  public async navigateToQueueServiceMGT() {
    await this.openQueue();
    await this.openServiceMGT();
    await this.newQueueProp();
    await this.testQueueFormProp();
  }

  public async openQueue() {
    await this.Page.waitForSelector(AgentChatConstants.CSHQueue);
    await this.Page.focus(AgentChatConstants.CSHQueue);
    await this.Page.click(AgentChatConstants.CSHQueue, { force: true });
    await this.waitForDomContentLoaded();
  }

  public async openServiceMGT() {
    await this.waitUntilSelectorIsVisible(AgentChatConstants.CSHServicedropDown, Constants.Two, this._page, Constants.MaxTimeout);
    await this.Page.click(AgentChatConstants.CSHServicedropDown);
    await this.Page.waitForSelector(AgentChatConstants.CSHServicedropDownAttr);
    await this.Page.click(AgentChatConstants.CSHServicedropDownAttr);
    await this.waitForDomContentLoaded();
  }

  public async newQueueProp() {
    await this.waitUntilSelectorIsVisible(AgentChatConstants.CSHQueueFormProp, Constants.Five, null, Constants.FourThousandsMiliSeconds);
    await this.Page.waitForSelector(AgentChatConstants.CSHQueueFormProp);
    await this.Page.focus(AgentChatConstants.CSHQueueFormProp);
    await this.Page.click(AgentChatConstants.CSHQueueFormProp, { force: true });
    await this.waitForDomContentLoaded();
  }

  public async testQueueFormProp() {
    expect(await this.Page.waitForSelector(AgentChatConstants.CSHQueueFormType)).toBeTruthy();
    await this.waitUntilSelectorIsVisible(AgentChatConstants.CSHQueueFormElements, Constants.Two, this._page, Constants.MaxTimeout);
  }

  public async fillcasesRecord() {
    this.newCasesTestData = `${this.newCSHCaseData.Name
      }_${new Date().getTime()}`;
    await this.waitForDomContentLoaded();
    await this.fillInputData(CustomConstants.CaseTitle, this.newCasesTestData);
    await this.fillLookupField(
      CustomConstants.CustomerName,
      CustomConstants.CustomerSearchButton,
      CustomConstants.CustomerLookupValue,
      this.newAccountTestData
    );

    await this.Page.click(CustomConstants.Save);
    await this.waitForSaveComplete();
    await this.Page.click(CustomConstants.ResolveOverFlow);
    await this.Page.click(CustomConstants.ResolveCaseClickButton);

    await this.Page.selectOption(
      CustomConstants.SelectResolutionType,
      ResolutionType.ProblemSolved as string
    );
    await this.fillInputData(
      CustomConstants.ResolutionDesciption,
      this.newCSHCaseData.Resolutionsummary
    );
    await this.fillInputData(
      CustomConstants.Duration,
      this.newCSHCaseData.TotalTime
    );
    await this.fillInputData(
      CustomConstants.BillableTime,
      this.newCSHCaseData.TotalTime
    );
    await this.Page.click(CustomConstants.ResolveCaseClick);
    await this.Page.waitForTimeout(Constants.DefaultAverageTimeout);
    await this.waitForDomContentLoaded();
    return this.newCasesTestData;
  }

  public async fillCustomEntityRecord() {
    this.newCustomEntityTestData = `${this.newCustomEntityData.Name
      }_${new Date().getTime()}`;
    await this.waitForDomContentLoaded();
    await this.fillInputData(
      CustomConstants.CustomEntityTitle,
      this.newCustomEntityTestData
    );
    await this.Page.click(CustomConstants.CustomEntitySave);
    await this.waitForSaveComplete();
    return this.newCustomEntityTestData;
  }

  public async fillAccountInfo() {
    this.newAccountTestData = `${this.newAccountData.Name
      }_${new Date().getTime()}`;
    await this.waitForDomContentLoaded();
    const AccountName = await this.fillInputData(
      CustomConstants.NameInput,
      this.newAccountTestData
    );
    await this.Page.click(SelectorConstants.FormSaveAndCloseButton);
    await this.waitForSaveComplete();
    await this.waitForDomContentLoaded();
  }

  public async validateCase() {
    await this.waitForDomContentLoaded();
    const resolvedMessage = await this.Page.waitForSelector(
      CustomConstants.ResolveSystemMessage
    );
    const currentName = await resolvedMessage.textContent();
    return this.newCSHCaseData.ResolvedSystemText == currentName;
  }

  public async validateCustomEntity() {
    expect(this.validateCustomEntityRoutingTitle()).toBeTruthy();
    await this.waitForDomContentLoaded();
    const routingMessage = await this.Page.waitForSelector(
      CustomConstants.DialogMessageText
    );
    const currentRouteText = await routingMessage.textContent();
    return this.newCustomEntityData.RouteSystemText == currentRouteText;
  }

  public async validateCustomEntityRoutingTitle() {
    await this.waitForDomContentLoaded();
    const routingTitleMessage = await this.Page.waitForSelector(
      CustomConstants.CustomEntityRouteTitleText
    );
    const currentRouteTitleText = await routingTitleMessage.textContent();
    return (
      this.newCustomEntityData.RouteTitleSystemText == currentRouteTitleText
    );
  }

  public async navigateToEntityRecordsTabView() {
    await this.Page.click(CustomConstants.EntityRecordsMenuItem);
    await this.Page.waitForTimeout(Constants.DefaultTimeout);
  }
  public async fillEntityRecord() {
    this.newEntityTestData = `${this.newEntityData.Name
      }_${new Date().getTime()}`;

    await this.waitForDomContentLoaded();
    await this.fillInputData(
      CustomConstants.EntityName,
      this.newEntityTestData
    );
    await this.Page.fill(CustomConstants.EntityType, "");
    await this.Page.fill(CustomConstants.EntityType, this.newEntityData.type);
    await this.Page.click(SelectorConstants.FormSaveButton);
    await this.Page.waitForTimeout(Constants.MaxTimeout);
    await this.waitForSaveComplete();
    await this.waitForDomContentLoaded();
  }

  public async navigateToRoutingRulesTab() {
    const tabName = EntityRecordsTab.RoutingRules;
    await this.Page.click(
      SelectorConstants.WorkStreamTab.replace("{0}", tabName)
    );
  }

  public async createCaseRoutingRule() {
    await this.Page.click(CustomConstants.AddRoutingRuleSet);
    await this.fillInputData(
      CustomConstants.RoutingRuleName,
      this.newCaseWorkStream.Name
    );
    await this.Page.fill(CustomConstants.RoutingRuleEntity, "");
    await this.Page.fill(
      CustomConstants.RoutingRuleEntity,
      this.newCaseWorkStream.EntityType
    );
    await this.Page.click(SelectorConstants.FormSaveButton);
    await this.waitForSaveComplete();
    await this.waitForDomContentLoaded();
  }

  public async newRuleItem(queue: string) {
    await this.Page.click(CustomConstants.NewRuleItem);

    await this.fillInputData(
      CustomConstants.RuleItemName,
      this.newRuleItemData.Name
    );
    await this.Page.click(CustomConstants.AddRowSpan);
    await this.Page.click(CustomConstants.AddRowButton);
    //await this.Page.waitForSelector(CustomConstants.FieldSelector);
    await this.Page.click(CustomConstants.PriorityElementClick);
    await this.Page.click(CustomConstants.FieldSelector);

    await this.Page.fill(
      CustomConstants.PriorityValue,
      this.newRuleItemData.Value
    );

    await this.Page.selectOption(
      CustomConstants.RouteTo,
      RouteTo.Value as string
    );
    await this.fillLookupField(
      CustomConstants.AddtoQueueInput,
      CustomConstants.AddtoQueueSearch,
      CustomConstants.AddtoQueueValue,
      queue
    );

    await this.Page.click(CustomConstants.RuleItemSave);
    await this.waitForSaveComplete();
    await this.Page.click(CustomConstants.RuleItemSaveandClose);
  }

  public async activateRule() {
    await this.Page.click(CustomConstants.ActivateRule);
    await this.Page.click(CustomConstants.ActivateConfirm);
  }

  public async navigateToCSHScreenFromAdminPage() {
    this.Page.goto(TestSettings.OrgUrl);
    await this.Page.click(CustomConstants.NavigateClick);
    await this.goToNavigationMyApp(SelectorConstants.CustomerServiceHub);
  }

  public async navigateToAgentScreen() {
    this.Page.goto(
      "https://ocdmglauto.crm.dynamics.com/main.aspx?forceUCI=1&pagetype=apps"
    );
    await this.waitForDomContentLoaded();
    await this.goToMyApp(SelectorConstants.OmnichannelCustomerService);
  }

  public async navigateToAgentPageFromAdminPage() {
    this.Page.goto(TestSettings.OrgUrl);
    await this.Page.click(CustomConstants.NavigateClick);
    await this.goToNavigationMyApp(
      SelectorConstants.OmnichannelCustomerService
    );
  }

  public async navigateToAdminPageFromCSHPage() {
    this.Page.goto(TestSettings.OrgUrl);
    await this.Page.click(CustomConstants.NavigateClick);
    await this.goToNavigationMyApp(Constants.OmnichannelAdministration);
  }

  public async navigateToOCAdminApp() {
    await this.navigateToAdminCentre();
    await this.waitForDomContentLoaded();
  }

  public async fillcasesDetails() {
    this.newCasesTestData = `${this.newCSHCaseData.Name
      }_${new Date().getTime()}`;

    await this.waitForDomContentLoaded();
    await this.fillInputData(CustomConstants.CaseTitle, this.newCasesTestData);

    await this.fillLookupField(
      CustomConstants.CustomerName,
      CustomConstants.CustomerSearchButton,
      CustomConstants.CustomerLookupValue,
      this.newAccountTestData
    );
    await this.Page.click(CustomConstants.PriorityExpandclick);
    await this.Page.selectOption(
      CustomConstants.PriorityType,
      PriorityType.High as string
    );
    await this.Page.click(CustomConstants.Save);
    await this.waitForSaveComplete();
    await this.Page.waitForTimeout(Constants.DefaultAverageTimeout);
    await this.waitForDomContentLoaded();
  }

  public async fillcasesDetailsForUR(CaseName: string = null) {
    CaseName = CaseName != null ? CaseName : this.newCSHCaseData.Name;
    this.newCasesTestData = `${CaseName}_${new Date().getTime()}`;

    await this.waitForDomContentLoaded();
    await this.fillInputData(CustomConstants.CaseTitle, this.newCasesTestData);

    await this.fillLookupField(
      CustomConstants.CustomerName,
      CustomConstants.CustomerSearchButton,
      CustomConstants.CustomerLookupValue,
      this.newAccountTestData
    );
    await this.Page.click(CustomConstants.Save);
    await this.waitForSaveComplete();
    await this.waitForDomContentLoaded();
  }

  public async saveandRoute() {
    await this.Page.click(CustomConstants.SaveandRoute);
    await this.Page.click(CustomConstants.RouteConfirmButton);
  }

  public async customEntitySaveandRoute() {
    await this.Page.click(CustomConstants.CustomEntitySaveAndRoute);
    expect(this.validateCustomEntity()).toBeTruthy();
    await this.Page.click(CustomConstants.RouteConfirmButton);
  }

  public async acceptInvitationToChat() {
    await this.waitUntilSelectorIsVisible(
      CustomConstants.AcceptButtonId,
      CustomConstants.One,
      null,
      CustomConstants.AgentPopUpWaitingTimeout
    );
    await this._page.click(CustomConstants.AcceptButtonId);
  }

  public async resolveCase() {
    await this.Page.click(CustomConstants.ResolveCase);
    await this.Page.click(CustomConstants.ConfirmButton);
    await this.Page.selectOption(
      CustomConstants.SelectResolutionType,
      ResolutionType.ProblemSolved as string
    );
    await this.Page.fill(
      CustomConstants.ResolutionDesciption,
      this.newCSHCaseData.Resolutionsummary
    );
    await this.Page.click(CustomConstants.ResolveCaseClick);
    await this.Page.waitForTimeout(Constants.DefaultAverageTimeout);
  }

  public async validateQueueItemDetails() {
    await this.Page.click(CustomConstants.OverFlowButton);
    await this.Page.click(CustomConstants.QueueItemDetails);

    const systemmessage = await this.Page.waitForSelector(
      CustomConstants.DialogMessageText
    );
    const entityItemText = await systemmessage.textContent();
    var text = /This record was transferred to the Omnichannel/gi;
    if (entityItemText.search(text) == -1) {
    } else {
      return true;
    }
    await this.Page.waitForTimeout(Constants.DefaultTimeout);
  }

  public async validateQueueItemDetailsForUR() {
    await this.Page.click(CustomConstants.QueueItemDetailsUR);
    const queueName = await this.Page.waitForSelector(
      CustomConstants.QueueItemDetailsURQueueVal
    );
    const entityItemText = await queueName.textContent();

    const text = /EntityQ/gi;
    return !(entityItemText.search(text) == -1);
  }

  public async okClick() {
    await this.Page.click(CustomConstants.OkButton);
  }

  // Retrieve record Name
  public async getRecordName() {
    return this.newCasesTestData;
  }

  public async searchCaseByTitle(title: string) {
    await this.Page.waitForSelector(CustomConstants.CaseSearchBox);
    await this.Page.fill(CustomConstants.CaseSearchBox, title);
    await this.Page.click(CustomConstants.QuickFindBtn);
    await this.Page.waitForSelector(
      CustomConstants.NewRowCaseLink.replace("{0}", title));

    await this.Page.click(
      CustomConstants.NewRowCaseLink.replace("{0}", title)
    );
  }

  public async navigateToActivity() {
    this.Page.waitForNavigation();
    await this.Page.click(SelectorConstants.ActivityMenuItem);
  }

  public async selectActivityView(
    viewName: string,
    status: string,
    notAvailableStatus: string
  ) {
    await this.Page.waitForSelector(CustomConstants.ActivityViewDDL);
    await this.Page.click(CustomConstants.ActivityViewDDL);
    await this.Page.waitForSelector(
      CustomConstants.ActivitiesBtn.replace("{0}", viewName)
    );
    await this.Page.click(
      CustomConstants.ActivitiesBtn.replace("{0}", viewName)
    );
    await this.Page.waitForSelector(CustomConstants.ActivityGridBody);
    await this.Page.waitForSelector(
      CustomConstants.ActivityStatus.replace("{0}", status)
    );
    const statusRow = await this.Page.$$(
      CustomConstants.ActivityStatus.replace("{0}", status)
    );
    const notAvailableStatusRow = await this.Page.$$(
      CustomConstants.ActivityStatus.replace("{0}", notAvailableStatus)
    );
    const allRowCount = await this.Page.$eval(
      CustomConstants.GridRowCount,
      (el) => {
        return el.getAttribute("data-row-count");
      }
    );
    expect(parseInt(allRowCount)).toBeGreaterThan(0);
    expect(statusRow.length).toBeGreaterThan(0);
    expect(notAvailableStatusRow.length).toEqual(0);
  }

  public async NevigateCSHServiceManagement() {
    const areaSwitch = await this.Page.waitForSelector(
      CustomConstants.CSHAreaSwitchSelector
    );
    await areaSwitch.click();
    const serviceManagement = await this.Page.waitForSelector(
      CustomConstants.ServiceManagementAreaSelector
    );
    await serviceManagement.click();
  }

  public async GotoCSHAISetting() {
    const aiSetting = await this.Page.waitForSelector(
      CustomConstants.CSHAISettingsSelector
    );
    await aiSetting.click();
  }

  public async GotoCSHAISuggestionsSettings() {
    const suggestionSetting = await this.Page.waitForSelector(
      CustomConstants.CSHAIAISuggestionSettingsSelector
    );
    await suggestionSetting.click();
  }

  public async EnableCaseAISuggestions() {
    const caseToggleSpan = await this.Page.waitForSelector(
      CustomConstants.CaseSuggestionToggleLabel
    );
    const text = await caseToggleSpan.textContent();
    if (text === CustomConstants.LabelValNo) {
      const caseToggle = await this.Page.waitForSelector(
        CustomConstants.CaseSuggestionToggleBtn
      );
      caseToggle.click();
    }
  }

  public async DisableCaseAISuggestions() {
    const caseToggleSpan = await this.Page.waitForSelector(
      CustomConstants.CaseSuggestionToggleLabel
    );
    const text = await caseToggleSpan.textContent();
    if (text === CustomConstants.LabelValYes) {
      const caseToggle = await this.Page.waitForSelector(
        CustomConstants.CaseSuggestionToggleBtn
      );
      caseToggle.click();
    }
  }

  public async EnableKBAISuggestions() {
    const kbToggleSpan = await this.Page.waitForSelector(
      CustomConstants.KMSuggestionToggleLabel
    );
    const text = await kbToggleSpan.textContent();
    if (text === CustomConstants.LabelValNo) {
      const kbToggle = await this.Page.waitForSelector(
        CustomConstants.KMSuggestionToggleBtn
      );
      kbToggle.click();
    }
  }

  public async DisableKBAISuggestions() {
    const kbToggleSpan = await this.Page.waitForSelector(
      CustomConstants.KMSuggestionToggleLabel
    );
    const text = await kbToggleSpan.textContent();
    if (text === CustomConstants.LabelValYes) {
      const kbToggle = await this.Page.waitForSelector(
        CustomConstants.KMSuggestionToggleBtn
      );
      kbToggle.click();
    }
  }

  public async SaveAISuggestionSettings() {
    await this.Page.waitForSelector(CustomConstants.SaveSuggestionSettings);
    await this.Page.click(CustomConstants.SaveSuggestionSettings);
  }

  public async getTrainedDateTime() {
    const trainedDate = await this.Page.waitForSelector(
      CustomConstants.AITrainedTimeSelector
    );
    const result = await trainedDate.textContent();
    return result;
  }

  public async closeQueueItemDetails() {
    await this.Page.click(CustomConstants.QueueItemDetailsClose);
  }
  public async bringToFront() {
    await this.Page.bringToFront();
  }
  public async openQueuesView() {
    await this.Page.click(CustomConstants.QueuesView);
  }

  public async openCaseInQueuesView(caseName: string) {
    await this.Page.click(CustomConstants.FirstItemInQueueItem);
  }

  public async verifyRemoveItemDisable() {
    const routeToButton = await this.Page.waitForSelector(
      CustomConstants.RouteToButton
    );
    routeToButton.click();
    await this.Page.selectOption(CustomConstants.RouteToTypeSelect, "1");
    const removeItemFromQueueOption = await this.Page.waitForSelector(
      CustomConstants.RouteToRemoveFromQ
    );
    const val = await removeItemFromQueueOption.textContent();
    return removeItemFromQueueOption.isDisabled;
  }

  public async verifyRemoveItemBanner() {
    const banner = await this.Page.waitForSelector(
      CustomConstants.ItemCannotRemoveLabel
    );
    const bannerText = await banner.textContent();
    return bannerText == "The item(s) cannot be removed from the UR queue(s).";
  }

  public async verifyRemoveItemDisableForPick() {
    const pickButton = await this.Page.waitForSelector(
      CustomConstants.PickButton
    );
    pickButton.click();
    const removeItemFromQueueOption = await this.Page.waitForSelector(
      CustomConstants.PickRemoveFromQ
    );
    const val = await removeItemFromQueueOption.textContent();
    return removeItemFromQueueOption.isDisabled;
  }

  public async cancelOption() {
    await this.Page.click(CustomConstants.RouteToCancel);
    await this.Page.waitForTimeout(Constants.DefaultTimeout);
  }

  public async clearAllActiveCases() {
    try {
      await this.Page.click(CustomConstants.AllActiveCases);
      await this.Page.waitForSelector(CustomConstants.DeleteCases);
      await this.Page.click(CustomConstants.DeleteCases);
      await this.Page.waitForSelector(CustomConstants.ConfirmButton);
      await this.Page.click(CustomConstants.ConfirmButton);
      await this.Page.waitForTimeout(Constants.DefaultTimeout);
    } catch {
      try {
        await this.Page.click(CustomConstants.OkButton);
      } catch { }
    }
  }

  public async resolveAndDeleteCase() {
    await this.Page.waitForSelector(CustomConstants.ResolveCaseBtn);
    await this.Page.click(CustomConstants.ResolveCaseBtn);
    await this.Page.waitForSelector(
      CustomConstants.ResolveCaseDialogAgentDashboard
    );
    await this.Page.waitForSelector(CustomConstants.Resolution);
    await this.Page.fill(CustomConstants.Resolution, CustomConstants.Solved);
    await this.Page.click(CustomConstants.ResolveBtn);
    await this.Page.waitForSelector(CustomConstants.WarningNotification);
    await this.Page.click(CustomConstants.DeleteCase);
    await this.Page.click(CustomConstants.ConfirmButton);
  }

  public async fillcasesRecordSaveandRoute() {
    this.newCasesTestData = `${this.newCSHCaseData.Name}_${new Date().getTime()}`;
    await this.waitForDomContentLoaded();
    await this.fillInputData(CustomConstants.CaseTitle, this.newCasesTestData);
    await this.fillLookupField(
      CustomConstants.CustomerName,
      CustomConstants.CustomerSearchButton,
      CustomConstants.CustomerLookupValue,
      this.newAccountTestData
    );
    await this.Page.click(CustomConstants.SaveandRoute);
    await this.Page.click(CustomConstants.ConfirmButton);
  }

  public async GotoCSHRoutingRuleSet() {
    await this.waitUntilSelectorIsVisible(CustomConstants.CSHRoutingRuleSetSelector, Constants.Five, this._page, Constants.FourThousandsMiliSeconds);
    await this.Page.click(CustomConstants.CSHRoutingRuleSetSelector);
  }

  public async GotoCSHAdvanceQueue() {
    await this.waitUntilSelectorIsVisible(CustomConstants.CSHAdvanceQueuesSetSelector, Constants.Five, this._page, Constants.FourThousandsMiliSeconds);
    await this.Page.click(CustomConstants.CSHAdvanceQueuesSetSelector);
  }

  public async CreateNewCSHRoutingRuleRecord(routingRuleRecordName: string) {
    await this.NevigateToCSHServiceManagement();
    await this.GotoCSHRoutingRuleSet();
    await this.waitUntilSelectorIsVisible(CustomConstants.CSHRoutingRuleSetNewButtonSelector, Constants.Five, this._page, Constants.FourThousandsMiliSeconds);
    await this.waitUntilSelectorIsVisible(CustomConstants.SearchRoutingRule, Constants.Five, this._page, Constants.FourThousandsMiliSeconds);
    const queueSearchBox = await this.Page.waitForSelector(CustomConstants.SearchRoutingRule);
    await queueSearchBox.type(routingRuleRecordName);
    await this.waitUntilSelectorIsVisible(CustomConstants.QuickFindBtn, Constants.Five, this._page, Constants.FourThousandsMiliSeconds);
    await this.Page.click(CustomConstants.QuickFindBtn);
    await this._page.waitForLoadState("load").catch((ex) => { console.info(ex.Message) });
    await this._page.waitForLoadState("domcontentloaded").catch((ex) => { console.info(ex.Message) });
    await this._page.waitForLoadState("networkidle").catch((ex) => { console.info(ex.Message) });
    const noRoutingRuleRecordFound = await this.waitUntilSelectorIsVisible(CustomConstants.NoRoutingRuleRecord, Constants.One, this._page, Constants.DefaultTimeout);
    if (!noRoutingRuleRecordFound) {
      await this.waitUntilSelectorIsVisible(SelectorConstants.GridViewFirstCell, Constants.Five, this._page, Constants.FourThousandsMiliSeconds);
      await this.Page.click(SelectorConstants.GridViewFirstCell);
      await this.waitUntilSelectorIsVisible(CustomConstants.RoutingRulesDeletionButton, Constants.Five, this._page, Constants.FourThousandsMiliSeconds);
      await this.Page.click(CustomConstants.RoutingRulesDeletionButton);
      await this.waitUntilSelectorIsVisible(CustomConstants.ConfirmButton, Constants.Five, this._page, Constants.FourThousandsMiliSeconds);
      await this.Page.click(CustomConstants.ConfirmButton);
      await this._page.waitForLoadState("load").catch((ex) => { console.info(ex.Message) });
      await this._page.waitForLoadState("domcontentloaded").catch((ex) => { console.info(ex.Message) });
      await this._page.waitForLoadState("networkidle").catch((ex) => { console.info(ex.Message) });
      await this.waitUntilSelectorIsVisible(CustomConstants.SearchRoutingRule, Constants.Five, this._page, Constants.FourThousandsMiliSeconds);
      await this.Page.waitForTimeout(Constants.DefaultTimeout);
    }
    await this.waitUntilSelectorIsVisible(CustomConstants.CSHRoutingRuleSetNewButtonSelector, Constants.Five, this._page, Constants.FourThousandsMiliSeconds);
    await this.Page.click(CustomConstants.CSHRoutingRuleSetNewButtonSelector);
    await this.waitUntilSelectorIsVisible(CustomConstants.RoutingRuleSetNameSelector, Constants.Five, this._page, Constants.FourThousandsMiliSeconds);
    await this.Page.fill(CustomConstants.RoutingRuleSetNameSelector, routingRuleRecordName);
    await this.waitUntilSelectorIsVisible(CustomConstants.CSHRoutingRuleSetSaveButtonSelector, Constants.Five, this._page, Constants.FourThousandsMiliSeconds);
    await this.Page.click(CustomConstants.CSHRoutingRuleSetSaveButtonSelector);
  }

  public async validateRecordTypeQueue(queue: string) {
    await this.waitUntilSelectorIsVisible(CustomConstants.NewRuleItem, Constants.Five, this._page, Constants.FourThousandsMiliSeconds);
    await this.Page.click(CustomConstants.NewRuleItem);
    await this.Page.selectOption(
      CustomConstants.RouteTo,
      RouteTo.Value as string
    );
    await this.Page.waitForTimeout(Constants.DefaultTimeout);
    await this.Page.waitForSelector(CustomConstants.AddtoQueueInput);
    await this.fillInputData(CustomConstants.AddtoQueueInput, queue);
    await this.Page.click(CustomConstants.AddtoQueueSearch);
    await this.waitUntilSelectorIsVisible(CustomConstants.AddtoQueueValue.replace("{0}", queue), Constants.One, this._page, Constants.DefaultTimeout);
    return await this.Page.isVisible(CustomConstants.AddtoQueueValue.replace("{0}", queue));

  }

  public async closeRulesItemDialog() {
    await this.waitUntilSelectorIsVisible(CustomConstants.CSHRoutingRuleSetCloseRuleItemButtonSelector, Constants.Five, this._page, Constants.FourThousandsMiliSeconds);
    await this.Page.click(CustomConstants.CSHRoutingRuleSetCloseRuleItemButtonSelector);
    const unsaveChangesDialogVisiblityFlag = await this.waitUntilSelectorIsVisible(CustomConstants.UnsaveDialogDivSelector, Constants.Two, this.Page, Constants.MaxTimeout);
    if (unsaveChangesDialogVisiblityFlag) {
      await this.Page.waitForSelector(CustomConstants.UnsaveDialogCancelBtn);
      await this.Page.click(CustomConstants.UnsaveDialogCancelBtn);
    }
    await this.waitUntilSelectorIsVisible(CustomConstants.CSHRoutingRuleSetDeleteButtonSelector, Constants.Five, this._page, Constants.FourThousandsMiliSeconds);
  }

  public async clearRoutingRuleItem(routingRuleRecordName: string) {
    await this.GotoCSHRoutingRuleSet();
    await this.waitUntilSelectorIsVisible(CustomConstants.CSHRoutingRuleSetNewButtonSelector, Constants.Five, this._page, Constants.FourThousandsMiliSeconds);
    await this.waitUntilSelectorIsVisible(CustomConstants.SearchRoutingRule, Constants.Five, this._page, Constants.FourThousandsMiliSeconds);
    const queueSearchBox = await this.Page.waitForSelector(CustomConstants.SearchRoutingRule);
    await queueSearchBox.type(routingRuleRecordName);
    await this.waitUntilSelectorIsVisible(CustomConstants.QuickFindBtn, Constants.Five, this._page, Constants.FourThousandsMiliSeconds);
    await this.Page.click(CustomConstants.QuickFindBtn);
    await this._page.waitForLoadState("load").catch((ex) => { console.info(ex.Message) });
    await this._page.waitForLoadState("domcontentloaded").catch((ex) => { console.info(ex.Message) });
    await this._page.waitForLoadState("networkidle").catch((ex) => { console.info(ex.Message) });
    const noRoutingRuleRecordFound = await this.waitUntilSelectorIsVisible(CustomConstants.NoRoutingRuleRecord, Constants.One, this._page, Constants.DefaultTimeout);
    if (!noRoutingRuleRecordFound) {
      await this.waitUntilSelectorIsVisible(SelectorConstants.GridViewFirstCell, Constants.Five, this._page, Constants.FourThousandsMiliSeconds);
      await this.Page.click(SelectorConstants.GridViewFirstCell);
      await this.waitUntilSelectorIsVisible(CustomConstants.RoutingRulesDeletionButton, Constants.Five, this._page, Constants.FourThousandsMiliSeconds);
      await this.Page.click(CustomConstants.RoutingRulesDeletionButton);
      await this.waitUntilSelectorIsVisible(CustomConstants.ConfirmButton, Constants.Five, this._page, Constants.FourThousandsMiliSeconds);
      await this.Page.click(CustomConstants.ConfirmButton);
      await this._page.waitForLoadState("load").catch((ex) => { console.info(ex.Message) });
      await this._page.waitForLoadState("domcontentloaded").catch((ex) => { console.info(ex.Message) });
      await this._page.waitForLoadState("networkidle").catch((ex) => { console.info(ex.Message) });
      await this.waitUntilSelectorIsVisible(CustomConstants.SearchRoutingRule, Constants.Five, this._page, Constants.FourThousandsMiliSeconds);
      await this.Page.waitForTimeout(Constants.DefaultTimeout);
    }
  }

  public async clearAdvanceQueueRecord(queueName: string) {
    await this.GotoCSHAdvanceQueue();
    await this.waitUntilSelectorIsVisible(CustomConstants.SearchQueue, Constants.Two, this._page, Constants.MaxTimeout);
    const queueSearchBox = await this.Page.waitForSelector(CustomConstants.SearchQueue);
    await queueSearchBox.type(queueName);
    await this._page.waitForLoadState("load").catch((ex) => { console.info(ex.Message) });
    await this._page.waitForLoadState("domcontentloaded").catch((ex) => { console.info(ex.Message) });
    await this._page.waitForLoadState("networkidle").catch((ex) => { console.info(ex.Message) });
    const noQueueRecordFound = await this.waitUntilSelectorIsVisible(CustomConstants.NoQueueRecord, Constants.One, this._page, Constants.DefaultTimeout);

    if (!noQueueRecordFound) {
      await this.waitUntilSelectorIsVisible(CustomConstants.SelectGridQueueRecordSelector, Constants.Two, this._page, Constants.DefaultTimeout);
      await this.Page.click(CustomConstants.SelectGridQueueRecordSelector);
      await this.waitUntilSelectorIsVisible(CustomConstants.DeleteAdvanceQueueRecordSelector, Constants.Two, this._page, Constants.DefaultTimeout);
      await this.Page.click(CustomConstants.DeleteAdvanceQueueRecordSelector);
      await this.waitUntilSelectorIsVisible(CustomConstants.DeleteAdvanceQueueRecordConfirmationBtnSelector, Constants.Two, this._page, Constants.DefaultTimeout);
      await this.Page.click(CustomConstants.DeleteAdvanceQueueRecordConfirmationBtnSelector);
      await this._page.waitForLoadState("load").catch((ex) => { console.info(ex.Message) });
      await this._page.waitForLoadState("domcontentloaded").catch((ex) => { console.info(ex.Message) });
      await this._page.waitForLoadState("networkidle").catch((ex) => { console.info(ex.Message) });
      await this.waitUntilSelectorIsVisible(CustomConstants.SearchQueue, Constants.Two, this._page, Constants.MaxTimeout);
      await this.Page.waitForTimeout(Constants.DefaultTimeout);
    }
  }

  public async createAdvanceQueueRecord(queueName: string, queueType: string) {
    await this.NevigateToCSHServiceManagement();
    await this.GotoCSHAdvanceQueue();
    await this.waitUntilSelectorIsVisible(CustomConstants.SearchQueue, Constants.Two, this._page, Constants.MaxTimeout);
    const queueSearchBox = await this.Page.waitForSelector(CustomConstants.SearchQueue);
    await queueSearchBox.type(queueName);
    await this._page.waitForLoadState("load").catch((ex) => { console.info(ex.Message) });
    await this._page.waitForLoadState("domcontentloaded").catch((ex) => { console.info(ex.Message) });
    await this._page.waitForLoadState("networkidle").catch((ex) => { console.info(ex.Message) });
    const noQueueRecordFound = await this.waitUntilSelectorIsVisible(CustomConstants.NoQueueRecord, Constants.One, this._page, Constants.DefaultTimeout);

    if (noQueueRecordFound) {
      await this.waitUntilSelectorIsVisible(CustomConstants.NewAdvanceQueueButtonSelector, Constants.Two, this._page, Constants.DefaultTimeout);
      await this.Page.click(CustomConstants.NewAdvanceQueueButtonSelector);
      await this.waitUntilSelectorIsVisible(CustomConstants.QueueNameSelector, Constants.Two, this._page, Constants.DefaultTimeout);
      await this.Page.fill(CustomConstants.QueueNameSelector, queueName);
      await this.waitUntilSelectorIsVisible(CustomConstants.GroupNumberSelector, Constants.Two, this._page, Constants.DefaultTimeout);
      await this.Page.fill(CustomConstants.GroupNumberSelector, "1");
      await this.waitUntilSelectorIsVisible(CustomConstants.QueueTypeDDSelector, Constants.Two, this._page, Constants.DefaultTimeout);
      await this.Page.click(CustomConstants.QueueTypeDDSelector);
      await this.waitUntilSelectorIsVisible(queueType, Constants.Two, this._page, Constants.DefaultTimeout);
      await this.Page.click(queueType);
      await this.waitUntilSelectorIsVisible(CustomConstants.CreateQueueButtonSelector, Constants.Two, this._page, Constants.DefaultTimeout);
      await this.Page.click(CustomConstants.CreateQueueButtonSelector);
    }
  }

  public async NevigateToCSHServiceManagement() {
    await this.waitUntilSelectorIsVisible(CustomConstants.CSHAreaSwitchSelector, Constants.Two, this._page, Constants.MaxTimeout);
    await this.Page.click(CustomConstants.CSHAreaSwitchSelector);
    const test = await this.waitUntilSelectorIsVisible(CustomConstants.ServiceManagementAreaSelector, Constants.Two, this._page, Constants.DefaultTimeout);
    await this.Page.click(CustomConstants.ServiceManagementAreaSelector);
    await this.waitForDomContentLoaded();
  }
  public async validateTheConversation(subject: string, status: string = "Open") {
    await this.Page.waitForSelector(
      AgentChatConstants.OngoingDashboardCoversationByTitleAndStatus.replace(
        "{subject}",
        subject
      ).replace("{status}", status)
    );
  }

  public async openChatFromMyWorkItems() {
    const refreshAll = await this._page.waitForSelector(AgentChatConstants.BtnRefreshAll);
    await refreshAll.click();
    await this.waitForAgentStatus();
    await this.waitUntilWorkItemIsVisible(AgentChatConstants.MoreChatOption);
    const openChatMoreOptions = await this._page.waitForSelector(
      AgentChatConstants.MoreChatOption
    );
    await openChatMoreOptions.click();
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.OpenMyWorkItemChat
    );
    const openChat = await this._page.waitForSelector(
      AgentChatConstants.OpenMyWorkItemChat
    );
    await openChat.dblclick();
    await this._page.waitForTimeout(Constants.DefaultTimeout);
    await this.waitForConversationControl();
  }

  public async waitUntilSelectorIsVisible(selectorVal: string, maxCount = 3, page: Page = null, timeout: number = Constants.DefaultTimeout) {
    let dataCount = 0;
    let pageObject = page ?? this.Page;
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
      this._page,
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

  public async waitUntilWorkItemIsVisible(selectorVal: string, maxCount = 3, page: Page = null, timeout: number = Constants.DefaultTimeout) {
    let dataCount = 0;
    let pageObject = (page ?? this.Page);
    while (dataCount < maxCount) {
      try {
        await pageObject.click(SelectorConstants.RefreshDashBoard);
        await pageObject.waitForSelector(selectorVal, { timeout });
        return true;
      } catch {
        dataCount++;
      }
    }
    return false;
  }

  public async goToHome() {
    const homeButton = await this.Page.waitForSelector(
      AgentChatConstants.HomeButton
    );
    await homeButton.click();
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.MyWorkItemsQueueSelector
    );
  }

  public async validateCustomer() {
    await this._page.waitForSelector(
      CustomConstants.CasesRoutedContactName
    );
  }

  public async validateCustomerAccount() {
    await this._page.waitForSelector(
      CustomConstants.CasesRoutedAccountName
    );
  }

  public async OpenExistingCase(caseTitle: string) {
    await this.Page.click(CustomConstants.CasesService);
    await this.Page.click(caseTitle);

    await this.Page.waitForTimeout(Constants.DefaultTimeout);
  }

  public async fillcasesDetails1() {
    this.newMultiTargetCaseTitle = `${this.newCSHCaseData1.Name
      }_${new Date().getTime()}`;

    this.newCustomerMultiTargetLookUpdata = `${this.newCSHCaseData1.ContactName
      }`;

    await this.waitForDomContentLoaded();
    await this.fillInputData(CustomConstants.CaseTitle, this.newMultiTargetCaseTitle);

    await this.fillLookupField(
      CustomConstants.CustomerName,
      CustomConstants.CustomerSearchButton,
      CustomConstants.CustomerLookupValue,
      this.newCustomerMultiTargetLookUpdata
    );
    await this.Page.click(CustomConstants.PriorityExpandclick);
    await this.Page.selectOption(
      CustomConstants.PriorityType,
      PriorityType.Medium as string
    );
    return this.newMultiTargetCaseTitle;
  }

  public async fillcasesDetails2() {
    this.newMultiTargetCaseTitle = `${this.newCSHCaseData1.Name
      }_${new Date().getTime()}`;

    this.newCustomerAccountMultiTargetLookUpdata = `${this.newCSHCaseData1.AccountName
      }`;

    await this.waitForDomContentLoaded();
    await this.fillInputData(CustomConstants.CaseTitle, this.newMultiTargetCaseTitle);

    await this.fillLookupField(
      CustomConstants.CustomerName,
      CustomConstants.CustomerSearchButton,
      CustomConstants.CustomerLookupValue,
      this.newCustomerAccountMultiTargetLookUpdata
    );
    await this.Page.click(CustomConstants.PriorityExpandclick);
    await this.Page.selectOption(
      CustomConstants.PriorityType,
      PriorityType.Medium as string
    );
    return this.newMultiTargetCaseTitle;
  }

  public async navigateToOngoingConversationsDashBoard() {
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.AgentDashboardDropDownSelector,
      AgentChatConstants.Five,
      this._page,
      AgentChatConstants.FourThousand
    );
    await this._page.waitForSelector(
      AgentChatConstants.AgentDashboardDropDownSelector
    );
    await this._page.click(AgentChatConstants.AgentDashboardDropDownSelector);
    await this._page.waitForSelector(
      SelectorConstants.OngoingTabConversationSelector
    );
    await this._page.click(SelectorConstants.OngoingTabConversationSelector);
  }

  public async setAgentStatusToAvailable() {
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.AvailabilityStatusBusyXPath,
      AgentChatConstants.Five,
      null,
      AgentChatConstants.FiveThousandsMiliSecondsWaitTimeout
    );
    await this._page.click(AgentChatConstants.AgentStatusButton);
    const selectElement = await this._page.waitForSelector(
      AgentChatConstants.SelectStatusElement
    );
    selectElement.selectOption({
      label: AgentChatConstants.Available.toString(),
    });
    await this._page.click(AgentChatConstants.AgentStatusOkButton);
    await this._page.waitForTimeout(Constants.DefaultAverageTimeout);
  }

  public async waitForAgentStatus() {
    //Wait for popup notification
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.AvailabilityStatusBusyXPath,
      AgentChatConstants.Five,
      null,
      AgentChatConstants.AgentPopUpWaitingTimeout
    );
    await this._page.waitForTimeout(2000);
  }

  public async navigateToQueueTypes() {
    await this.openQueueType();
    await this.checkQueueType();
  }

  public async openQueueType() {
    await this.Page.waitForSelector(AgentChatConstants.CSHQueue);
    await this.Page.focus(AgentChatConstants.CSHQueue);
    await this.Page.click(AgentChatConstants.CSHQueue, { force: true });
    await this.waitForDomContentLoaded();
  }

  public async checkQueueType() {
    await this.waitForDomContentLoaded();
    await this.Page.waitForSelector(SelectorConstants.SortQueueType);
    await this.Page.focus(SelectorConstants.SortQueueType);
    await this.Page.click(SelectorConstants.SortQueueType, { force: true });
    await this.waitForDomContentLoaded();
    expect(await this.Page.waitForSelector(SelectorConstants.MessagingQueue)).toBeTruthy();
    expect(await this.Page.waitForSelector(SelectorConstants.EntityQueue)).toBeTruthy();
    expect(await this.Page.waitForSelector(SelectorConstants.VoiceQueue)).toBeTruthy();
  }

  public async fillcasesDetailsPresenceAvailble() {
    this.newCasesTestData = `${this.newCSHCaseData.Name
      }_${new Date().getTime()}`;
    await this.waitForDomContentLoaded();
    await this.fillInputData(CustomConstants.CaseTitle, this.newCasesTestData);
  }

  public async SelectCreatedCaseItem(CaseName: string) {
    await this.Page.click(SelectorConstants.CSHDashboardSelector);
    await this.Page.waitForSelector(SelectorConstants.RefreshAllTab);
    await this.Page.click(SelectorConstants.RefreshAllTab);
    const const1 = SelectorConstants.CaseItemSelector + `/following::a[text()='${CaseName}']`;
    await this.Page.click(SelectorConstants.CaseItemSelector + `/following::a[text()='${CaseName}']`);
    await this.Page.click(SelectorConstants.CaseRefreshSelector);
  }

  public async VerifyParentCase(CaseName: string, Parentcase: string) {
    await this.Page.waitForTimeout(TimeoutConstants.FiveSecondsDelay);// waiting for the rule getting updated in parent case field
    await this.Page.click(SelectorConstants.CaseRefreshSelector);
    await this.Page.waitForTimeout(TimeoutConstants.FiveSecondsDelay);// waiting for the rule getting updated in parent case field
    await this.Page.click(SelectorConstants.CaseRefreshSelector);
    await this.Page.click(SelectorConstants.CaseDetailsTabSelector);
    const ParentCaseName = await this.Page.waitForSelector(SelectorConstants.ParentCaseText);
    const currentName = await ParentCaseName.textContent();
    if (currentName == Parentcase) {
      return true;
    }
  }

  public async FillParentcase() {
    await this.Page.waitForSelector(SelectorConstants.CaseDetailsTabSelector);
    await this.Page.click(SelectorConstants.CaseDetailsTabSelector);
    await this.Page.waitForSelector(SelectorConstants.ParentCaseSelector);
    await this.fillLookupField(SelectorConstants.ParentCaseSelector, SelectorConstants.ParentCaseSearchSelector, SelectorConstants.ParentLookUpvalueTake, AgentChatConstants.ParentCaseName1);
  }

  public async fillcasesDetailsForSkill(skill: string) {
    this.newCasesTestData = `${this.newCSHCaseData.Name
      }_${new Date().getTime()}`;
      await this.waitForDomContentLoaded();
      await this.fillInputData(CustomConstants.CaseTitle, this.newCasesTestData);
      await this.fillLookupField(
        CustomConstants.CustomerName,
        CustomConstants.CustomerSearchButton,
        CustomConstants.CustomerLookupValue,
        this.newAccountTestData
      );
      await this.Page.click(CustomConstants.Save);
      await this.waitForSaveComplete();
      await this.Page.click(CustomConstants.SaveandRoute);
      await this.waitForDomContentLoaded();
      await this.Page.click(CustomConstants.Route);
  }

  public async fillcasesDetailsNewCase() {
    this.newCasesTestData = `${this.newCSHCaseDataCase.Name
      }_${new Date().getTime()}`;
    await this.waitForDomContentLoaded();
    await this.fillInputData(CustomConstants.CaseTitle, this.newCasesTestData);
    await this.fillLookupField(
      CustomConstants.CustomerName,
      CustomConstants.CustomerSearchButton,
      CustomConstants.CustomerLookupValue,
      this.newAccountTestData
    );
    await this.Page.click(CustomConstants.Save);
    await this.waitForSaveComplete();
    await this.Page.click(CustomConstants.SaveandRoute);
    await this.waitForDomContentLoaded();
    await this.Page.click(CustomConstants.Route);
    await this.waitForDomContentLoaded();
    await this.Page.waitForTimeout(60000);
  }

  public async navigatetodiagnostics() {
    await this.Page.click(CustomConstants.Diagnostics);
    await this.waitForSaveComplete();
    await this.fillInputData(CustomConstants.DiagnosticsearchText, this.newCasesTestData);
    await this.Page.waitForTimeout(Constants.DefaultAverageTimeout);
    await this.waitForDomContentLoaded();
    await this.Page.click(CustomConstants.Diagnosticsearch);
    await this.Page.waitForSelector(CustomConstants.selectcase);
    await this.Page.click(CustomConstants.selectcase);
    await this.Page.click(SelectorConstants.DiagnosticsEdit);
    await this.Page.waitForSelector(SelectorConstants.RouteToQueue);
    await this.Page.click(SelectorConstants.RouteToQueue);
    await this.Page.hover(SelectorConstants.RouteToQueueHover);
  }
  public async fillcasesDetailsForMultipleSkills(skillOne: string, SkillTwo: string) {
    this.newCasesTestData = `${this.newCSHCaseData.Name
      }_${new Date().getTime()}`;

    await this.waitForDomContentLoaded();
    await this.fillInputData(CustomConstants.CaseTitle, this.newCasesTestData);

    await this.fillLookupField(
      CustomConstants.CustomerName,
      CustomConstants.CustomerSearchButton,
      CustomConstants.CustomerLookupValue,
      this.newAccountTestData
    );
    await this.Page.click(CustomConstants.PriorityExpandclick);
    await this.Page.selectOption(
      CustomConstants.PriorityType,
      PriorityType.High as string
    );
    await this.fillInputData(CustomConstants.CaseSkill, skillOne);
    await this.fillInputData(CustomConstants.CaseSkillTwo, SkillTwo);
    await this.Page.click(CustomConstants.Save);
    await this.waitForSaveComplete();
    await this.Page.waitForTimeout(Constants.DefaultAverageTimeout);
    await this.waitForDomContentLoaded();
  }

  public async navigateToUsersTabViewNew() {
    await this.Page.click(SelectorConstants.UsersMenuItem);
    await this.Page.waitForTimeout(Constants.DefaultTimeout);
    await this.fillInputData(SelectorConstants.UserInputUsers, SelectorConstants.TransferUserAgent);
    await this.Page.click(SelectorConstants.UserSearchIconUsers);
    await this.Page.keyboard.press(Constants.EnterKey);
    await this.waitForDomContentLoaded();
    await this.Page.click(SelectorConstants.selectuser);
    await this.Page.click(SelectorConstants.omnichanneltab);
    await this.Page.hover(SelectorConstants.availablemouseover)
    await this.Page.click(SelectorConstants.availablecancel);
    await this.fillInputData(SelectorConstants.UserInput1, SelectorConstants.available);
    await this.Page.waitForTimeout(180000);
  }

  public async ValidateInboxCaseDateandLatestonTopSorting() {
    await this.waitUntilSelectorIsVisible(SelectorConstants.ConversationDropdown, AgentChatConstants.Four, null, AgentChatConstants.ThrityFiveThousandMiliSeconds);
    await this._page.click(SelectorConstants.ConversationDropdown);
    const caseitem = await this.Page.waitForSelector(SelectorConstants.InboxCaseItem);
    await this.waitUntilSelectorIsVisible(SelectorConstants.InboxSortItem, AgentChatConstants.Four,
      null, AgentChatConstants.ThrityFiveThousandMiliSeconds);
    await this.Page.hover(SelectorConstants.InboxSortItem);
    expect(await this.Page.waitForSelector(SelectorConstants.InboxSortLatestonTop)).toBeTruthy();
    expect(await this.Page.waitForSelector(SelectorConstants.InboxSortDate)).toBeTruthy();
    await this._page.click(SelectorConstants.ConversationDropdown);
    return true;
  }

  public async navigateToInboxCaseItem() {
    await this.waitUntilSelectorIsVisible(SelectorConstants.ConversationDropdown, AgentChatConstants.Four, null, AgentChatConstants.ThrityFiveThousandMiliSeconds);
    await this._page.click(SelectorConstants.ConversationDropdown);
    await this.waitUntilSelectorIsVisible(SelectorConstants.InboxCaseItem, AgentChatConstants.Four,
      null, AgentChatConstants.ThrityFiveThousandMiliSeconds);
    await this._page.click(SelectorConstants.InboxCaseItem);
  }

  public async ValidateInboxCategoryToday() {
    const category = await this.Page.waitForSelector(SelectorConstants.InboxTodayCategory);
    const Todaycategory = await category.textContent();
    if (Todaycategory == "Today") { return true }
  }

  public async ValidateInboxFooterTime() {
    const timefooter = await this.Page.waitForSelector(SelectorConstants.InboxFooterTime);
    const inboxtime = await timefooter.textContent();
    if (inboxtime.includes("Last updated at"))
      return true;
  }

  public async ValidateInboxFooterItemCount() {
    const countfooter = await this.Page.waitForSelector(SelectorConstants.InboxFooterItemCount);
    const inboxcount = await countfooter.textContent();
    return /\d/.test(inboxcount);
  }

  public async GetCaseNumber() {
    await this.waitUntilSelectorIsVisible(SelectorConstants.InboxCaseNumber, AgentChatConstants.Four, null, AgentChatConstants.ThrityFiveThousandMiliSeconds);
    const casenumber = await this._page.$eval(SelectorConstants.InboxCaseNumber, el => (el as HTMLInputElement).value);
    return casenumber;
  }

  public async GetCasePriority() {
    const priority = await this.Page.waitForSelector(SelectorConstants.CasePriority);
    const casepriority = priority.textContent();
    return casepriority;
  }

  public async GetCustomerName() {
    return this.newAccountTestData;
  }

  public async GetCaseName() {
    return this.newAccountTestData;
  }

  public async ValidateInboxCardStyling(casenumber: string, casepriority: string, customerName: string, casename: string) {
    expect(await this.Page.$eval(SelectorConstants.InboxCardCase, e => getComputedStyle(e).backgroundColor)).toBeTruthy();
    const casenameInitial = await this.Page.waitForSelector(SelectorConstants.InboxCardCase);
    const inboxcasenameInitial = casenameInitial.textContent();
    expect(inboxcasenameInitial).toBeTruthy();
    expect(await this.Page.waitForSelector(SelectorConstants.InboxCardline2Wrench)).toBeTruthy();
    const casenumberstring = await this.Page.waitForSelector(SelectorConstants.InboxCardline2CaseNumber);
    const inboxcasenumber = await casenumberstring.textContent();
    expect((inboxcasenumber == casenumber) ? true : false).toBeTruthy();
    const casecustomer = await this.Page.waitForSelector(SelectorConstants.InboxCustomer);
    const inboxcasecustomer = await casecustomer.textContent();
    expect(((await inboxcasecustomer).includes(customerName)) ? true : false).toBeTruthy();
    const inboxcasepriority = await this.Page.waitForSelector(SelectorConstants.InboxCardCasePriority);
    const priority = await inboxcasepriority.textContent();
    expect((priority == casepriority) ? true : false).toBeTruthy();
    const dot = await this.Page.waitForSelector(SelectorConstants.InboxdotSeperator);
    const dotseperator = await dot.innerText();
    expect(dotseperator).toBeTruthy();
    const inboxcasestatus = await this.Page.waitForSelector(SelectorConstants.InboxCardCasePriority);
    expect(await inboxcasestatus.textContent()).toBeTruthy();
    const inboxcaseModified = await this.Page.waitForSelector(SelectorConstants.InboxCaseModified);
    expect(await inboxcaseModified.textContent()).toBeTruthy();
    const caseellipsis = await this.Page.waitForSelector(`${SelectorConstants.InboxstyleEllipsis}//span[contains(text(),"${casename}")]`);
    expect(caseellipsis).toBeTruthy();
  }

  public async ValidateInboxCardSelectionStyles() {
    await this._page.hover(SelectorConstants.InboxCustomer);
    expect(await this.Page.waitForSelector(SelectorConstants.InboxOpenNewTab)).toBeTruthy();
    await this.Page.click(SelectorConstants.InboxCustomer);
    await this.Page.click(SelectorConstants.InboxOpenNewTab);
    await this.waitUntilSelectorIsVisible(SelectorConstants.CaseInboxPriorityField, AgentChatConstants.Four, null, AgentChatConstants.ThrityFiveThousandMiliSeconds);
    await this._page.click(SelectorConstants.CaseInboxPriorityField);
    await this.Page.selectOption(
      SelectorConstants.CaseInboxPriorityField,
      SelectorConstants.InboxCasePriorityNone as string
    );
    await this.Page.click(SelectorConstants.SavePersonalQuickRepliesButton);
    await this.waitForSaveComplete();
    await this.inboxSection();
    await this.Page.waitForSelector(AgentChatConstants.RefreshInbox);
    await this.Page.click(AgentChatConstants.RefreshInbox);
    const inboxcasestatus = await this.Page.waitForSelector(SelectorConstants.InboxCardCasePriority);
    expect(await inboxcasestatus.textContent()).toBeTruthy();
    const inboxcaseModified = await this.Page.waitForSelector(SelectorConstants.InboxCaseModified);
    expect(await inboxcaseModified.textContent()).toBeTruthy();
    await this.ValidateInboxFooterItemCount();
    await this.ValidateInboxFooterTime();
  }

  public async inboxSection() {
    await this.Page.waitForSelector(SelectorConstants.Inbox);
    await this.Page.click(SelectorConstants.Inbox);
  }

  public async fillcasesDetailsNew() {
    this.newCasesTestData = `${this.newCSHCaseData.Name
      }_${new Date().getTime()}`;
    await this.waitForDomContentLoaded();
    await this.fillInputData(CustomConstants.CaseTitle, this.newCasesTestData);
    await this.fillLookupField(
      CustomConstants.CustomerName,
      CustomConstants.CustomerSearchButton,
      CustomConstants.CustomerLookupValue,
      this.newAccountTestData
    );
    await this.Page.click(CustomConstants.Save);
    await this.waitForSaveComplete();
    await this.Page.waitForSelector(SelectorConstants.UserAssignCasebutton);
    await this.Page.focus(SelectorConstants.UserAssignCasebutton);
    await this.Page.click(SelectorConstants.UserAssignCasebutton, { force: true });
    await this.Page.selectOption(
      SelectorConstants.AssignSelectToOption, "1"
    );
    await this.fillInputData(SelectorConstants.UserInput, SelectorConstants.TransferUserAgentOffline);
    await this.Page.click(SelectorConstants.UserSearchIcon);
    await this.waitForDomContentLoaded();
    await this.Page.waitForTimeout(5000);
    await this.Page.keyboard.press('Tab');
    await this.Page.waitForTimeout(Constants.DefaultAverageTimeout)
    await this.Page.keyboard.press('Tab');
    await this.Page.waitForTimeout(Constants.DefaultAverageTimeout)
    await this.Page.keyboard.press('Tab');
    await this.Page.keyboard.press('Tab');
    await this.Page.waitForTimeout(Constants.DefaultAverageTimeout)
    await this.Page.keyboard.press('Enter');
    await this.Page.click(SelectorConstants.Assignpopbtn);
  }

  public async navigateToUsersTabView() {
    await this.Page.click(SelectorConstants.UsersMenuItem);
    await this.Page.waitForTimeout(Constants.DefaultTimeout);
    await this.fillInputData(SelectorConstants.UserInputUsers, SelectorConstants.TransferUserAgentOffline);
    await this.Page.click(SelectorConstants.UserSearchIconUsers);
    await this.waitForDomContentLoaded();
    await this.Page.click(SelectorConstants.selectuserOffline);
    await this.Page.click(SelectorConstants.omnichanneltab);
    await this.Page.hover(SelectorConstants.availablemouseover)
    await this.Page.click(SelectorConstants.availablecancel);
    await this.fillInputData(SelectorConstants.UserInput1, SelectorConstants.Offline);
    await this.Page.keyboard.press('Tab');
    await this.Page.waitForTimeout(Constants.DefaultAverageTimeout)
    await this.Page.keyboard.press('Tab');
    await this.Page.waitForTimeout(Constants.DefaultAverageTimeout)
    await this.Page.keyboard.press('Enter');
    await this.Page.click(SelectorConstants.userssave);
    await this.Page.waitForTimeout(180000);
  }

  public async fillInboxCustomerGroupingCasesDetails() {
    this.newCasesTestData = `${this.newCSHCaseData.Name
      }_${new Date().getTime()}`;
    await this.waitForDomContentLoaded();
    await this.fillInputData(CustomConstants.CaseTitle, this.newCasesTestData);
    await this.fillLookupField(
      CustomConstants.CustomerName,
      CustomConstants.CustomerSearchButton,
      CustomConstants.CustomerLookupValue,
      this.newAccountTestData
    );
    await this.Page.click(CustomConstants.PriorityExpandclick);
    await this.Page.selectOption(
      CustomConstants.PriorityType,
      PriorityType.Medium as string
    );
    await this.Page.click(CustomConstants.Save);
    await this.waitForSaveComplete();
    await this.Page.waitForTimeout(Constants.DefaultAverageTimeout);
    await this.waitForDomContentLoaded();
  }

  public async fillcasesDetailswithCaseNbr(CaseName: string) {
    //this method wont create case nbr, here we just parameterise the casenbr instead of creation

    await this.waitForDomContentLoaded();
    await this.fillInputData(CustomConstants.CaseTitle, CaseName);

    await this.fillLookupField(
      CustomConstants.CustomerName,
      CustomConstants.CustomerSearchButton,
      CustomConstants.CustomerLookupValue,
      this.newAccountTestData
    );
    await this.Page.click(CustomConstants.Save);
    await this.waitForSaveComplete();
    await this.waitForDomContentLoaded();
  }

  public async getCaseName() {
    await this.fillInboxCustomerGroupingCasesDetails();
    return this.newCasesTestData;
  }

  //loginToInboxUserDetails
  public async loginAndNavigateToCSHAppForInboxCustomerGrouping() {
    await this.loginToInboxUserDetails();
    await this.navigateToCSHApp();
    await this.waitForDomContentLoaded();
  }

  //Login email and password for Agent
  public async loginToInboxUserDetails() {
    const email = TestSettings.InboxUser;
    const pwd = TestSettings.DefaultPassword;
    await this.navigateToOrgUrlAndSignIn(email, pwd);
    await this.waitForDomContentLoaded();
  }


  public async changePriorityToHigh() {
    await this.Page.click(CustomConstants.PriorityExpandclick);
    await this.Page.selectOption(
      CustomConstants.PriorityType,
      PriorityType.High as string
    );
  }

  public async changeToActieCasesinDropdown() {
    await this.Page.click(CustomConstants.TypesofCases);
    await this.Page.waitForSelector(CustomConstants.DropdownOption1)
    await this.Page.click(CustomConstants.DropdownOption1);
  }

}
