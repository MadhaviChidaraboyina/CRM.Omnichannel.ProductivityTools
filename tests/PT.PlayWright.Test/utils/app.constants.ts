/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

export const AppsOrgUrl = process.env.OrgUrl + "/apps";

/**
 * Dynamics 365 app name and link
 */
export interface AppInfo {
  appLink: string;
  appName: string | null;
}

/**
 * Type of the entity
 */
export const enum EntityType {
  CustomActivity = "customActivity",
  CustomEntity = "customEntity",
  OOBEntity = "OOBEntity",
}

/**
 * Type of the Apps
 */
export const enum AppNames {
  ConsoleAppName = "Console App",
  CSWorkspaceAppName = "Customer Service workspace",
  CSAdminCenterAppName = "Customer Service admin center",
  ChannelIntegrationAppName = "Channel Integration Framework",
}

/**
 * Odata Response Status
 */
export const enum ResponseStatus {
  Success = 200,
}

export const enum PageType {
  EntityList = "entitylist",
}

/**
 * Entity logical name
 */
export const enum EntityLogicalName {
  Account = "account",
  Contact = "contact",
  Incident = "incident",
  SystemUser = "systemuser",
  ChannelProvider = "msdyn_channelprovider",
  PTProvider = "msdyn_ciprovider",
}

export const enum StorageStatePath {
  adminStorageState = "adminStorageState.json",
  agentStorageState = "agentStorageState.json",
}

export const enum EntityAttributes {
  Id = "id",
  Name = "msdyn_name",
  Lastname = "lastname",
  UniqueName = "msdyn_uniquename",
  Label = "msdyn_label",
  ChannelUrl = "msdyn_channelurl",
  Sort = "msdyn_sortorder",
  LandingUrl = "msdyn_landingurl",
  AppSelect = "msdyn_appselector",
  ClickAct = "msdyn_clicktoact",
  EnableAnalytics = "msdyn_enableanalytics",
  RoleSelector = "msdyn_roleselector",
  AppVersion = "msdyn_ciproviderapiversion",
  EnableOutBound = "msdyn_enableoutbound",
  IncidentAccountBindAttribute = 'customerid_account@odata.bind',
  IncidentContactBindAttribute = 'customerid_contact@odata.bind',
}

export const enum ChannelProviderConstants {
  TestChannelProvider = "TestChannelProvider",
  TestChannelProviderUniqueName = "msdyn_TestChannelProvider",
  AppendChannelUrl = "//WebResources/CEC_Test_Case_Helper_File_V2_for_APM",
  AppSelect = "77e7dba9-528c-ed11-aad1-000d3a5bcf98",
  RoleSelector = "9d990a1a-108c-ed11-aad1-000d3a5bcf98;2c9e0a1a-108c-ed11-aad1-000d3a5bcf98",
  ApiVersion = "162450000",
}

export const enum AppProfileConstants {
  TestAppProfile = "TestAppProfile",
  Workspaces = "Workspaces",
  CustomProfileUniqueName = "msdyn_TestAppProfile",
  User = "Select user Jamie Campbell",
  AdminUser = "Jamie Campbell",
  Productivity = "Productivity",
  PresenceCommands = "Presence Commands",
  New = "New",
  BaseStatus = "Base status",
  SaveClose = "Save & Close",
  Toggle = "Toggle selection of all rows",
  Delete = "Delete",
  ClearSearch = "Clear search",
  FilterByKeyword = "Filter by keyword",
  ToggleButton = "",
  QuickFindTextBox = "input[data-test-id='appprofile-list-search-box']",
  QuickFindButton = "button[aria-label='Start search']",
  EnterKey = "Enter",
  SelectAllLine = "div[data-automationid='DetailsRowCell'] div span button",
  NoRecordsFound = "span[data-test-id='appprofile-list-none-found']",
  ChannelProviderTest = "test2",
  TestAppProfileName = "AppProfileUser2",
  CSApps = "CustomerServiceApps",
  dsOData = "ds odata",
  msdyn_uniquename = "msdyn_99",
  Name = "Name",
  RowGroup = "rowgroup"
}

export const enum agentchatconstants {
  MinimizeConversation = "button[aria-label='Collapse Communication Panel']",
  ConversationSummery = "//*[contains(@aria-label,'Customer Summary')]",
  SaveandClose = "//li/button[@aria-label='Save & Close']",
  ContactRecord = "//*[@data-id='SimpleLookup-LookupResultsDropdown__selected_tag_text']",
  ContactRecordDelete = "//*[contains(@data-id,'SimpleLookup-LookupResultsDropdown__selected_tag_delete')]",
  HomeButton = "//*[@id='session-id-0']",
  SavingRecord = "//span[contains(text(),'Saving...')]",
  CreateNewContact = "//button[contains(@data-id,'msdyn_customer.fieldControl-CreateNewButton_contact')]",
  CustomerSummaryRecordName = "//*[contains(@data-id,'CustomerProfile-associatedEntityRecordName')]",
  FirstName = "//*[@aria-label='First Name']",
  LastName = "//*[@aria-label='Last Name']",
  SaveButton = "//li/button[@aria-label='Save (CTRL+S)']",
  CreateNewContactBtn = "+ New Contact",
  CustomerFirstName = "First Name",
  CustomerLasttName = "Last Name",
  SaveBtn = "Save (CTRL+S)",
  Workstreams = "Workstreams",
  SearchWorkstreams = "Search workstreams",
  EntitysessionWs = "entitysessionws",
  EntityRecordsSessionAutomation = "Entity records session - default",
  EntityQueue = "entityqueue 1 user",
}

export enum EntityNames {
  Account = 'account',
  Contact = 'contact',
  Incident = 'incident',
  SystemUser = 'systemuser',
  Subject = "subject",
  LiveWorkStream = 'msdyn_liveworkstream',
  EmailTemplate = `template`,
  Macros = `workflow`,
  AgentScript = 'msdyn_productivityagentscript',
  AgentScriptStep = `msdyn_productivityagentscriptstep`
}
