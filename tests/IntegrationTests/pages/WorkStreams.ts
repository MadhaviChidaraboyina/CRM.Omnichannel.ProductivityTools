import { Constants, SelectorConstants } from "../Utility/Constants";

import { AdminPage } from "./AdminPage";
import { ApplicationTab } from "./ApplicationTab";
import { GlobalVariables } from "../Utility/GlobalVariables";
import { Page } from "playwright";
import { TestSettings } from "../configuration/test-settings";
import { TimeoutConstants } from "../constants/timeout-constants";

export enum WorkStreamSelector {
  AllowedPresenceLocator = "//*[@id='msdyn_allowedpresences_ledit']",
  AllowedPresence = "//li/label[@name='msdyn_allowedpresencesmsos-label']/input[@aria-label='{0}' and @type='checkbox']/following::div[1]",
  DisablePushBasedWSOption = "//*[@aria-label='Enable selecting from push-based work streams: No']",
  EnablePushbasedWSOption = "//*[@aria-label='Enable selecting from push-based work streams: Yes']",
  LabelPushBasedWS = "//*[text()='Enable selecting from push-based work streams']",
  PickOption = "//*[@aria-label='Pick']",
  UnsaveDialogDivSelector = "//*[@id='modalDialogContentContainer']",
  UnsaveDialogCancelBtn = "//*[@id='cancelButton']",
  WorkStreamTab = "//li[contains(@id,'sitemap')]//span[contains(text(),'Work Streams')]",
  UsersTab = "//li[contains(@id,'sitemap')]//span[contains(text(),'Users')]",
  UserName = "//*[@title='{0}']",
  SearchRecordTxtBox = "//*[@aria-label='Search this view']",
  UserOmniChannelTab = "//*[@aria-label='Omnichannel']",
  NewRecord = "//*[@aria-label='New']",
  SelectAll = "//*[@data-id='ToggleSelectionMode']",
  SelectCreditCard = "//label[contains(text(),'Credit Card')]/following::span[contains(@data-id,'MaskingRulesInSettings-selectionCheckBox')][1]",
  SelectEmail = "//label[contains(text(),'Email')]/following::span[contains(@data-id,'MaskingRulesInSettings-selectionCheckBox')][1]",
  SelectSSN = "//label[contains(text(),'SSN')]/following::span[contains(@data-id,'MaskingRulesInSettings-selectionCheckBox')][1]",
  AgentAffinityToggle = "//*[@data-id='msdyn_enableagentaffinity.fieldControl_container']",
  AgentAffinityToggleLabel = "//*[@data-id='msdyn_enableagentaffinity.fieldControl_container']//span",
  QuickRepliesMenuItem = "//li[contains(@id,'sitemap')]//span[contains(text(),'Quick replies')]",
  AutoCloseInactivityPeriod = "//input[@aria-label='Auto-close after inactivity']",
  AttributeValue = "//li[contains(@data-id,'MscrmControls.RuleBuilder.RuleBuilderControl-type-ahead-flyout-clickable-listItem')]/label[contains(text(),'{0}')]",
  AgentExperience = "//li[@aria-label='Agent experience']",
}

export enum WorkStreamConstant {
  BusyDNDPresence = "Busy - DND",
  PushOptionValue = "Push",
  ZeroMinuteInactivityPeriod = "0 minute",
  FiveMinuteInactivityPeriod = "5 minute",
}

export enum EngagementContextInRR {
  WhatsApp = "WhatsApp Engagement Context"
}

export enum QueueType {
  Messaging = "192350000",
  Entity = "192350001"
}

export enum WorkStreamChannel {
  SMS = "192340000",
  Facebook = "192330000",
  EntityRecords = "192350000",
  LiveChat = "192360000",
  LINE = "192310000",
  WhatsApp = "192300000",
  WeChat = "192320000",
  Twitter = "192350001",
  Custom = "192350002",
  MicrosoftTeams = "19241000",
}

export enum WorkStreamMode {
  Push = "192350000",
  Pick = "192350001"
}

export enum NotificationTabs {
  Templates = "tablist-tab1_summary",
  MissedNotifications = "tablist-missed_notification_settings",
  RejectNotifications = "tablist-agent_reject_notification_settings",
  Soundnotificationsettings = "tablist-tab_sound_notification_settings",
}

export enum WorkStreamTab {
  WorkDistribution = "tablist-tab1_summary",
  ContextVariables = "tablist-tab_3",
  SkillAttachmentRules = "tablist-SkillAttachmentRulesTab",
  RoutingRuleItems = "tablist-RoutingRuleItems",
  Templates = "tablist-tab_templates",
  SmartAssist = "tablist-BotAssistedAgentGuidance",
  QuickReplies = "tablist-quickReplies",
  SMSSettings = "tablist-smsSettings",
  SMSNumbers = "tablist-smsNumbers",
}

export enum SMSProviderOption {
  Twilio = "192350001",
  TeleSign = "192350000",
}

export interface IWorkStreamsDistributionData {
  Name: string;
  Capacity: string;
  Channel: WorkStreamChannel;
  Duration: string;
}
export class WorkStreamsPage extends AdminPage {

  globalVariables = GlobalVariables.getInstance()

  private newSMSProviderData = {
    AccountSID: TestSettings.AccountSID as string,
    AuthToken: TestSettings.AuthToken as string,
    AccountSIDTwilio: TestSettings.AccountSIDTwilio as string,
    AuthTokenTwilio: TestSettings.AuthTokenTwilio as string,
  };

  public liveChatData: IWorkStreamsDistributionData = {
    Name: "TestWorkStream",
    Capacity: "30",
    Channel: WorkStreamChannel.LiveChat,
    Duration: "30 minutes",
  };

  public twitterData: IWorkStreamsDistributionData = {
    Name: "TestWorkStreamTwitter",
    Capacity: "30",
    Channel: WorkStreamChannel.Twitter,
    Duration: "30 minutes",
  };

  public twitterPrerequisiteWorkstreamData: IWorkStreamsDistributionData = {
    Name: "TwitterPWWorkStream",
    Capacity: "1000",
    Channel: WorkStreamChannel.Twitter,
    Duration: "30 minutes",
  };

  public teamsData: IWorkStreamsDistributionData = {
    Name: "TestTeamsWorkStream",
    Capacity: "30",
    Channel: WorkStreamChannel.MicrosoftTeams,
    Duration: "3 days",
  };

  public lineData: IWorkStreamsDistributionData = {
    Name: "LineWorkStream",
    Capacity: "30",
    Channel: WorkStreamChannel.LINE,
    Duration: "3 days",
  };

  public facebookData: IWorkStreamsDistributionData = {
    Name: "FacebookWorkStream",
    Capacity: "30",
    Channel: WorkStreamChannel.Facebook,
    Duration: "3 days",
  };

  public whatsAppData: IWorkStreamsDistributionData = {
    Name: "WhatsAppWorkStream",
    Capacity: "30",
    Channel: WorkStreamChannel.WhatsApp,
    Duration: "3 days",
  }

  public smsChannelData: IWorkStreamsDistributionData = {
    Name: "TestSMSChannel",
    Capacity: "30",
    Channel: WorkStreamChannel.SMS,
    Duration: "30 minutes",
  };

  public customChannelData: IWorkStreamsDistributionData = {
    Name: "TestCustomWorkStream",
    Capacity: "30",
    Channel: WorkStreamChannel.Custom,
    Duration: "30 minutes",
  };

  public facebookChannelData: IWorkStreamsDistributionData = {
    Name: "TestFacebookWorkStream",
    Capacity: "30",
    Channel: WorkStreamChannel.Facebook,
    Duration: "30 minutes",
  };

  public whatsAppChannelData: IWorkStreamsDistributionData = {
    Name: "TestWhatsAppWorkStream",
    Capacity: "30",
    Channel: WorkStreamChannel.WhatsApp,
    Duration: "30 minutes",
  };

  public quickRepliesData: IWorkStreamsDistributionData = {
    Name: "TestQuickReplies",
    Capacity: "30",
    Channel: WorkStreamChannel.LiveChat,
    Duration: "30 minutes",
  };

  public wechatData: IWorkStreamsDistributionData = {
    Name: "TestWechatWorkStream",
    Capacity: "30",
    Channel: WorkStreamChannel.WeChat,
    Duration: "3 days",
  };

  public wechatChannelData: IWorkStreamsDistributionData = {
    Name: TestSettings.WeChatWorkStreamName,
    Capacity: "30",
    Channel: WorkStreamChannel.WeChat,
    Duration: "3 days",
  };

  public skillWorkStreamData: IWorkStreamsDistributionData = {
    Name: "TestSkills",
    Capacity: "30",
    Channel: WorkStreamChannel.MicrosoftTeams,
    Duration: "30 minutes",
  };

  public newWorkStreamName;

  constructor(page: Page) {
    super(page);
  }

  public async navigateToAgentExperience() {
    await this.Page.waitForSelector(WorkStreamSelector.AgentExperience);
    await this.Page.click(WorkStreamSelector.AgentExperience);
    await this.waitForDomContentLoaded();
  }

  public async navigateToSMSView() {
    await this.Page.click(SelectorConstants.SMSMenuItem);
    await this.waitForDomContentLoaded();
    await this.Page.waitForTimeout(Constants.DefaultTimeout);
  }

  public async navigateToWorkStreamsView() {
    await this.Page.waitForSelector(SelectorConstants.WorkStreamsMenuItem);
    await this.Page.click(SelectorConstants.WorkStreamsMenuItem);
    await this.waitForDomContentLoaded();
    await this.Page.waitForTimeout(Constants.DefaultTimeout);
  }

  public async openWorkStream(name: string) {
    await this.navigateToWorkStreamsView();   
    await this.waitForDomContentLoaded();
    await this.searchWorkStreamRecord(name);
    let selector = SelectorConstants.WorkStreamsLinkName.replace("{0}", name);
    var s = await this.Page.$(selector);
    await this.Page.click(selector);
    await this.waitForDomContentLoaded();
  }

  public async createQueue() {
    await this.navigateToQueue();
    await this.openNewLine();
    await this.waitForDomContentLoaded();
    const queuename = await this.fillQueueData();
    await this.waitForDomContentLoaded();
  }

  public async fillQueueData(QueueName: string = null) {
    const queueName = QueueName ?? `Queue_${new Date().getTime()}`;
    await this.Page.waitForSelector(SelectorConstants.FormSaveButton);
    await this.waitForDomContentLoaded();
    await this.fillInputData(
      SelectorConstants.QueueName,
      queueName
    );
    await this.fillInputData(SelectorConstants.QueuePriorityField, SelectorConstants.QueuePriority);
    await this.Page.selectOption(SelectorConstants.QueueType, QueueType.Messaging);

    await this.Page.click(SelectorConstants.FormSaveButton);
    await this.waitForSaveComplete();
    await this.Page.waitForSelector(SelectorConstants.AccountCreated.replace("{0}", queueName));
    await this.waitUntilSelectorIsVisible(SelectorConstants.RecordHeader);
    await this.waitForDomContentLoaded();
    return queueName;
  }

  public async fillQueueDataForEntity() {
    const queueName = `Queue_${new Date().getTime()}`;
    await this.Page.waitForSelector(SelectorConstants.FormSaveButton);
    await this.waitForDomContentLoaded();
    await this.fillInputData(
      SelectorConstants.QueueName,
      queueName
    );
    await this.fillInputData(SelectorConstants.QueuePriorityField, SelectorConstants.QueuePriority);
    await this.Page.selectOption(SelectorConstants.QueueType, QueueType.Entity);

    await this.Page.click(SelectorConstants.FormSaveButton);
    await this.waitForSaveComplete();
    await this.Page.waitForSelector(SelectorConstants.AccountCreated.replace("{0}", queueName));
    await this.waitUntilSelectorIsVisible(SelectorConstants.RecordHeader);
    await this.waitForDomContentLoaded();
    return queueName;
  }

  public async createWorkStream(workstreamSource: IWorkStreamsDistributionData, isPrerequisite: Boolean = false, distributionMode: WorkStreamMode = null) {

    await this.navigateToOrgUrl();
    await this.navigateToWorkStreamsView();
    await this.openNewRecordForm();
    await this.waitForDomContentLoaded();
    await this.fillWorkDistribution(workstreamSource, isPrerequisite, distributionMode);
    await this.waitForDomContentLoaded();
  }

  public async workStreamExists(name: string): Promise<boolean> {
    await this.navigateToWorkStreamsView();
    await this.searchWorkStreamRecord(name);
    await this.waitForTableReload();
    const result = await this.Page.$eval(SelectorConstants.GridCell, x => x.childElementCount > 1);
    return result;
  }

  public async fillWorkDistribution(data: IWorkStreamsDistributionData, isPrerequisite: Boolean = false, distributionMode: WorkStreamMode = null) {
    await this.waitForDomContentLoaded();
    await this.Page.selectOption(
      SelectorConstants.WorkDistributionChannel,
      (data.Channel as unknown) as string
    );

    if (distributionMode != null) {
      await this.Page.selectOption(
        SelectorConstants.WorkDistributionMode,
        (distributionMode as unknown) as string
      );
    }
    await this.Page.waitForTimeout(Constants.DefaultMinTimeout);
    this.newWorkStreamName = isPrerequisite ? data.Name : `${data.Name}_${new Date().getTime()}`;

    await this.fillInputData(
      SelectorConstants.NameInput,
      this.newWorkStreamName
    );
    await this.fillInputData(SelectorConstants.CapacityInput, data.Capacity);
    await this.fillInputData(SelectorConstants.DurationInput, data.Duration);
    await this.Page.waitForTimeout(Constants.DefaultAverageTimeout);
    await this.fillInputData(
      SelectorConstants.NameInput,
      this.newWorkStreamName
    );
    await this.fillInputData(SelectorConstants.DurationInput, data.Duration);
    await this.Page.waitForSelector(SelectorConstants.FormSaveButton);
    await this.Page.click(SelectorConstants.FormSaveButton);
    await this.Page.waitForTimeout(Constants.DefaultTimeout);
    await this.waitForSaveComplete();
    await this.waitForDomContentLoaded();
    await this.Page.reload();
    await this.waitForDomContentLoaded();
    await this.Page.waitForNavigation();
    await this.Page.waitForTimeout(Constants.DefaultAverageTimeout);
  }

  public async validateFormSave() {
    const title = await this.Page.waitForSelector(
      SelectorConstants.FormHeaderTitle
    );
    await this.Page.waitForTimeout(Constants.DefaultTimeout);
    const currentTitle = await title.innerText();
    return await (currentTitle == this.newWorkStreamName);
  }

  public async navigateToTab(tabName: WorkStreamTab) {
    await this.Page.click(
      SelectorConstants.WorkStreamTab.replace("{0}", tabName)
    );
  }

  public async navigateToQuickRepliesTabView() {
    await this.Page.waitForSelector(WorkStreamSelector.QuickRepliesMenuItem);
    await this.Page.click(WorkStreamSelector.QuickRepliesMenuItem);
  }

  public async fillSMSProvider() {
    await this.Page.selectOption(
      SelectorConstants.SMSProvider,
      SMSProviderOption.Twilio as string
    );

    await this.Page.click(SelectorConstants.FormSaveButton);
    await this.waitForSaveComplete();
    await this.waitForDomContentLoaded();
  }

  public async fillSMSProvideData() {
    await this.Page.selectOption(
      SelectorConstants.SMSProvider,
      SMSProviderOption.Twilio as string
    );
    await this.fillInputData(
      SelectorConstants.AccountSIDInput,
      this.newSMSProviderData.AccountSID
    );
    await this.fillInputData(
      SelectorConstants.AuthTokenInput,
      this.newSMSProviderData.AuthToken
    );
    await this.fillInputData(
      SelectorConstants.AccountSIDInput,
      this.newSMSProviderData.AccountSID
    );
    await this.fillInputData(
      SelectorConstants.AuthTokenInput,
      this.newSMSProviderData.AuthToken
    );

    await this.Page.click(SelectorConstants.FormSaveButton);
    await this.waitForSaveComplete();
    await this.waitForDomContentLoaded();
  }

  public async fillSMSProvideDataForTwilio() {
    await this.Page.selectOption(
      SelectorConstants.SMSProvider,
      SMSProviderOption.Twilio as string
    );
    await this.fillInputData(
      SelectorConstants.AccountSIDInput,
      this.newSMSProviderData.AccountSIDTwilio
    );
    await this.fillInputData(
      SelectorConstants.AuthTokenInput,
      this.newSMSProviderData.AuthTokenTwilio
    );
    await this.Page.click(SelectorConstants.FormSaveButton);
    await this.waitForSaveComplete();
    await this.waitForDomContentLoaded();
  }

  public async validateWSOnSMSProviderPage() {
    const currentSMSProviderName = await this.Page.waitForSelector(
      SelectorConstants.SMSProvider
    );
    const isTwilioOption = await (
      await currentSMSProviderName.textContent()
    ).includes(Constants.Twilio);
    return isTwilioOption;
  }

  public async createPickWorkstream() {
    await this.openNewRecordForm();
    await this.waitForDomContentLoaded();
    await this.fillWorkDistribution(this.twitterData);
    await this.Page.selectOption(
      SelectorConstants.WorkDistributionMode,
      (WorkStreamMode.Pick as unknown) as string
    );
    await this.Page.waitForSelector(SelectorConstants.FormSaveButton);
    await this.Page.click(SelectorConstants.FormSaveButton);
  }

  public async createBotQueue() {
    await this.navigateToQueue();
    await this.Page.waitForSelector(SelectorConstants.QuickFindTextBox);
    await this.Page.fill(SelectorConstants.QuickFindTextBox, Constants.BotQueueName);
    await this.Page.click(SelectorConstants.QuickFindButton);
    try {
      await this.Page.waitForSelector(SelectorConstants.NoDataAvailable);
      await this.openNewRecordForm();
      await this.waitForDomContentLoaded();
      await this.Page.waitForSelector(SelectorConstants.FormSaveButton);
      await this.fillInputData(
        SelectorConstants.QueueName,
        Constants.BotQueueName
      );
      await this.fillInputData(SelectorConstants.QueuePriorityField, SelectorConstants.QueuePriority);
      await this.Page.click(SelectorConstants.FormSaveButton);
      await this.waitForSaveComplete();
      await this.waitUntilSelectorIsVisible(SelectorConstants.RecordHeader);
      await this.waitForDomContentLoaded();
      await this.Page.click(SelectorConstants.SelectAllUsers);
      await this.Page.click(SelectorConstants.RemoveUsers);
      await this.Page.click(SelectorConstants.MoreOptions);
      await this.Page.click(SelectorConstants.AddExsistingUser);
      await this.fillLookupField(SelectorConstants.QueueLookupInput, SelectorConstants.QueueLookupSearch, SelectorConstants.QueueLookupResult, Constants.BotLookupValue);
      await this.Page.click(SelectorConstants.SaveLookupValue);
      await this.Page.click(SelectorConstants.FormSaveButton);
      await this.waitForDomContentLoaded();
    }
    catch { }
  }

  public async createQueueForHappypath() {
    await this.navigateToQueue();
    await this.Page.waitForSelector(SelectorConstants.QuickFindTextBox);
    await this.Page.fill(SelectorConstants.QuickFindTextBox, Constants.HappyPathQueueName);
    await this.Page.click(SelectorConstants.QuickFindButton);
    try {
      await this.Page.waitForSelector(SelectorConstants.NoDataAvailable);
      await this.openWSNewForm();
      await this.waitForDomContentLoaded();
      await this.Page.waitForSelector(SelectorConstants.FormSaveButton);
      await this.fillInputData(SelectorConstants.QueueName, Constants.HappyPathQueueName);
      await this.fillInputData(SelectorConstants.QueuePriorityField, SelectorConstants.QueuePriority);
      await this.Page.click(SelectorConstants.FormSaveButton);
      await this.waitForSaveComplete();
      await this.waitForDomContentLoaded();
      await this.Page.waitForSelector(SelectorConstants.SelectAllUsers);
      await this.Page.click(SelectorConstants.SelectAllUsers);
      await this.Page.waitForSelector(SelectorConstants.RemoveUsers);
      await this.Page.click(SelectorConstants.RemoveUsers);
      await this.waitForDomContentLoaded();
      await this.Page.waitForSelector(SelectorConstants.AddExsistingUser);
      await this.Page.click(SelectorConstants.AddExsistingUser);
      await this.fillLookupField(SelectorConstants.QueueLookupInput, SelectorConstants.QueueLookupSearch, SelectorConstants.QueueLookupResult, TestSettings.LiveChatConsultOrTransferAgentEmail);
      await this.Page.click(SelectorConstants.SaveLookupValue);
      await this.Page.click(SelectorConstants.FormSaveButton);
      await this.waitForDomContentLoaded();
    }
    catch { }
  }

  public async ocMaskingSettings(toggle: any) {
    const customerStatusLocator = await this.Page.waitForSelector(SelectorConstants.MaskPrivateDataFromCustomer);
    let customerStatus = await customerStatusLocator.getAttribute("aria-checked");
    if (toggle && !JSON.parse(customerStatus)) {
      await this.Page.click(SelectorConstants.MaskPrivateDataFromCustomer);
    }
    const agentStatusLocator = await this.Page.waitForSelector(SelectorConstants.MaskPrivateDataFromAgent);
    let agentStatus = await agentStatusLocator.getAttribute("aria-checked");
    if (toggle && !JSON.parse(agentStatus)) {
      await this.Page.click(SelectorConstants.MaskPrivateDataFromAgent);
    }
    try {
      await this.Page.click(WorkStreamSelector.SelectAll);
      await this.Page.click(WorkStreamSelector.SelectCreditCard);
      await this.Page.click(WorkStreamSelector.SelectEmail);
      await this.Page.click(WorkStreamSelector.SelectSSN);

    }
    catch {
      await this.Page.click(SelectorConstants.SelectAllMaskRules);
    }
    await this.Page.click(SelectorConstants.OverFlowButton);
    await this.Page.click(SelectorConstants.ActivateMaskRule);
    await this.Page.click(SelectorConstants.ConfirmActivation);
    await this.Page.click(SelectorConstants.FormSaveButton);
    await this.waitForSaveComplete();
    await this.waitForDomContentLoaded();
  }

  public async updateAllowedPresence(presence: string) {
    await this.waitForDomContentLoaded();
    await this._page.fill(WorkStreamSelector.AllowedPresenceLocator, presence);
    await this._page.click(WorkStreamSelector.AllowedPresence);
    await this.Page.click(SelectorConstants.FormSaveButton);
    await this.waitForSaveComplete();
    await this.waitForDomContentLoaded();
  }

  public async getWorkstreamName() {
    return this.newWorkStreamName;
  }

  public async fillApplicationTabTemplate(templateName: string, templateTitle: string, templateEntity: string) {
    await this.waitForDomContentLoaded();

    try {
      await this.Page.waitForSelector(SelectorConstants.UniqueName);
      await this.fillInputData(
        SelectorConstants.NameInput,
        templateName
      );
      await this.fillInputData(
        SelectorConstants.ApplicationTitle,
        templateTitle
      );
      await this.fillInputData(SelectorConstants.UniqueName, "new_" + templateName);
      await this.Page.selectOption(SelectorConstants.ApplicationPageType, { label: ApplicationTab.EntityRecord });
      await this.Page.fill(SelectorConstants.Description, ApplicationTab.ApplicationDescription + templateName);
      await this.Page.waitForSelector(SelectorConstants.FormSaveButton);
      await this.Page.click(SelectorConstants.FormSaveButton);
      await this.waitForSaveComplete();
    }
    catch {
      await this.fillInputData(
        SelectorConstants.NameInput,
        templateName
      );
      await this.fillInputData(
        SelectorConstants.ApplicationTitle,
        templateTitle
      );
      await this.fillLookupField(SelectorConstants.ApplicationType, SelectorConstants.ApplicationTypeLookupSearch, SelectorConstants.ApplicationTypeLookUpValue, templateEntity);
      await this.Page.fill(SelectorConstants.Description, ApplicationTab.ApplicationDescription + templateName);
      await this.Page.waitForSelector(SelectorConstants.FormSaveButton);
      await this.Page.click(SelectorConstants.FormSaveButton);
      await this.waitForSaveComplete();
    }
  }

  public async validateApplicationType(expectedApplicationType: string, expectedPageType: string) {
    try {
      const locator = await this.Page.waitForSelector(SelectorConstants.PageType);
      const applicationType = await locator.innerText();
      return applicationType == expectedPageType
    }
    catch {
      const locator = await this.Page.waitForSelector(SelectorConstants.CreatedApplicationType);
      const applicationType = await locator.innerText();
      return applicationType == expectedApplicationType
    }
  }

  public async validatePushBasedWSCheckbox() {
    const pushBasedWSFlag = await this.waitUntilSelectorIsVisible(WorkStreamSelector.DisablePushBasedWSOption, Constants.Two, this.Page, Constants.MaxTimeout);
    if (pushBasedWSFlag) {
      await this.Page.click(WorkStreamSelector.DisablePushBasedWSOption);
      await this.Page.click(WorkStreamSelector.EnablePushbasedWSOption);
    }
    else {
      await this.Page.click(WorkStreamSelector.EnablePushbasedWSOption);
      await this.Page.click(WorkStreamSelector.DisablePushBasedWSOption);
      await this.Page.click(WorkStreamSelector.EnablePushbasedWSOption);
    }
    return await this.waitUntilSelectorIsVisible(WorkStreamSelector.LabelPushBasedWS);
  }

  public async validateWorkDistributionPushMode() {
    await this.waitUntilSelectorIsVisible(SelectorConstants.WorkDistributionMode, Constants.Two, this.Page, Constants.MaxTimeout);
    await this.Page.selectOption(
      SelectorConstants.WorkDistributionMode,
      (WorkStreamConstant.PushOptionValue) as string
    );
    return await this.waitUntilSelectorIsVisible(WorkStreamSelector.DisablePushBasedWSOption);
  }

  public async validateWorkDistributionPickMode() {
    await this.waitUntilSelectorIsVisible(SelectorConstants.WorkDistributionMode, Constants.Two, this.Page, Constants.MaxTimeout);
    await this.Page.selectOption(
      SelectorConstants.WorkDistributionMode,
      (WorkStreamMode.Pick as unknown) as string
    );
    await this.waitUntilSelectorIsVisible(WorkStreamSelector.PickOption);
    const pushBasedWSFlag = await this.waitUntilSelectorIsVisible(WorkStreamSelector.LabelPushBasedWS);
    return !pushBasedWSFlag;
  }

  public async closeUnsaveChangesDialog() {
    const unsaveChangesDialogVisiblityFlag = await this.waitUntilSelectorIsVisible(WorkStreamSelector.UnsaveDialogDivSelector, Constants.Two, this.Page, Constants.MaxTimeout);
    if (unsaveChangesDialogVisiblityFlag) {
      await this.Page.waitForSelector(WorkStreamSelector.UnsaveDialogCancelBtn);
      await this.Page.click(WorkStreamSelector.UnsaveDialogCancelBtn);
    }
  }

  public async togglePushBasedWSOption(pushBasedWSOption: boolean) {
    await this.waitUntilSelectorIsVisible(SelectorConstants.FormSaveButton, Constants.Two, this.Page, Constants.MaxTimeout);
    if (pushBasedWSOption) {
      const pushBasedWSFlag = await this.waitUntilSelectorIsVisible(WorkStreamSelector.DisablePushBasedWSOption, Constants.Two, this.Page, Constants.MaxTimeout);
      if (pushBasedWSFlag) {
        await this.Page.click(WorkStreamSelector.DisablePushBasedWSOption);
      }
    }
    else {
      const pushBasedWSFlag = await this.waitUntilSelectorIsVisible(WorkStreamSelector.EnablePushbasedWSOption, Constants.Two, this.Page, Constants.MaxTimeout);
      if (pushBasedWSFlag) {
        await this.Page.click(WorkStreamSelector.EnablePushbasedWSOption);
      }
    }
    await this.waitUntilSelectorIsVisible(SelectorConstants.FormSaveButton, Constants.Two, this.Page, Constants.MaxTimeout);
    await this.Page.click(SelectorConstants.FormSaveButton);
    await this.waitForDomContentLoaded();
  }

  public async navigateToWSView() {
    await this.waitUntilSelectorIsVisible(WorkStreamSelector.WorkStreamTab);
    await this.Page.click(WorkStreamSelector.WorkStreamTab);
    await this.waitForDomContentLoaded();
  }

  public async openWSNewForm() {
    await this.waitUntilSelectorIsVisible(WorkStreamSelector.NewRecord, Constants.Two, this.Page, Constants.MaxTimeout);
    await this.Page.click(WorkStreamSelector.NewRecord);
    await this.waitForDomContentLoaded();
  }

  public async ChangeWSCapacity(capacity: string) {
    await this.waitUntilSelectorIsVisible(SelectorConstants.FormSaveButton, Constants.Two, this.Page, Constants.MaxTimeout);
    await this.waitUntilSelectorIsVisible(SelectorConstants.CapacityInput);
    await this.Page.fill(SelectorConstants.CapacityInput, "");
    await this.Page.fill(SelectorConstants.CapacityInput, capacity);
    await this.waitUntilSelectorIsVisible(SelectorConstants.FormSaveButton, Constants.Two, this.Page, Constants.MaxTimeout);
    await this.Page.click(SelectorConstants.FormSaveButton);
    await this.waitForSaveComplete();
    await this.waitForDomContentLoaded();
  }

  public async navigateToUserView() {
    await this.waitUntilSelectorIsVisible(WorkStreamSelector.UsersTab, Constants.Two, this.Page, Constants.MaxTimeout);
    await this.Page.click(WorkStreamSelector.UsersTab);
    await this.waitForDomContentLoaded();
  }

  public async searchUserRecordAndClick(userName: string) {
    await this.Page.waitForSelector(SelectorConstants.QuicksearchSMS);
    await this.Page.fill(SelectorConstants.QuicksearchSMS, userName);
    await this.Page.click(SelectorConstants.QuicksearchSMSbutton);
    await this.waitUntilSelectorIsVisible(SelectorConstants.UserNameLink.replace("{0}", userName), Constants.Five, this._page, Constants.MaxTimeout);
    await this.Page.click(SelectorConstants.GridViewFirstCell);
    await this.waitUntilSelectorIsVisible(SelectorConstants.EnableBtnSelector, Constants.Three, this._page, Constants.MaxTimeout);
    await this.Page.keyboard.press(Constants.EnterKey, { delay: Number(Constants.DefaultMinTimeout) });
    await this.waitUntilSelectorIsVisible(WorkStreamSelector.UserName.replace("{0}", userName), Constants.Five, this._page, Constants.MaxTimeout);
  }

  public async ChangeUserCapacity(userCapacity: string) {
    const isOmniChannelTabFlag = await this.waitUntilSelectorIsVisible(WorkStreamSelector.UserOmniChannelTab, Constants.Three, this.Page, Constants.MaxTimeout);
    if (isOmniChannelTabFlag) {
      await this.Page.click(WorkStreamSelector.UserOmniChannelTab);
      await this.waitUntilSelectorIsVisible(SelectorConstants.CapacityInput);
      await this.Page.fill(SelectorConstants.CapacityInput, "");
      await this.Page.fill(SelectorConstants.CapacityInput, userCapacity);
      await this.waitUntilSelectorIsVisible(SelectorConstants.FormSaveButton, Constants.Three, this.Page, Constants.MaxTimeout);
      await this.Page.click(SelectorConstants.FormSaveButton);
      await this.waitForDomContentLoaded();
    }
  }

  public async navigateToNotificationsTab(tabName: NotificationTabs) {
    await this.Page.click(
      SelectorConstants.WorkStreamTab.replace("{0}", tabName)
    );
  }


  public async IsAgentAffinityToggleHidden() {
    return await this.waitUntilSelectorIsHidden(WorkStreamSelector.AgentAffinityToggle);
  }

  public async SelectPickModeWorkStream() {
    await this.Page.selectOption(
      SelectorConstants.WorkDistributionMode,
      (WorkStreamMode.Pick as unknown) as string
    );
  }

  public async SelectPushModeWorkStream() {
    await this.Page.selectOption(
      SelectorConstants.WorkDistributionMode,
      (WorkStreamMode.Push as unknown) as string
    );
  }

  public async EnableAgentAffinity() {
    await this.Page.click(WorkStreamSelector.AgentAffinityToggle);
  }

  public async changeAutoCloseInactivity(value: string) {
    await this.waitUntilSelectorIsVisible(WorkStreamSelector.AutoCloseInactivityPeriod, Constants.Three, this.Page, Constants.MaxTimeout);
    await this.fillInputData(WorkStreamSelector.AutoCloseInactivityPeriod, value);
    await this.waitUntilSelectorIsVisible(SelectorConstants.FormSaveButton, Constants.Two, this.Page, Constants.MaxTimeout);
    await this.Page.click(SelectorConstants.FormSaveButton);
    await this.waitForSaveComplete();
  }

  public async openUserRecordAndChangeCapacity(user: string, userCapacity: string) {
    await this.waitUntilSelectorIsVisible(SelectorConstants.UserNameLink.replace("{0}", user), Constants.Five, this._page, Constants.MaxTimeout);
    await this.Page.click(SelectorConstants.GridViewFirstCell);
    await this.waitUntilSelectorIsVisible(SelectorConstants.EnableBtnSelector, Constants.Three, this._page, Constants.MaxTimeout);
    await this.Page.keyboard.press(Constants.EnterKey, { delay: TimeoutConstants.Default });
    await this.waitUntilSelectorIsVisible(WorkStreamSelector.UserName.replace("{0}", user), Constants.Five, this._page, Constants.MaxTimeout);
    await this.ChangeUserCapacity(userCapacity);
  }

  public async wsPreReq(pushBasedWSOption: boolean, capacity: string) {
    await this.adminLoginAndNavigateToWS(TestSettings.FacebookWorkStreamName);
    await this.waitUntilSelectorIsVisible(SelectorConstants.FormSaveButton, Constants.Three, this.Page, Constants.MaxTimeout);
    if (pushBasedWSOption) {
      const pushBasedWSFlag = await this.waitUntilSelectorIsVisible(WorkStreamSelector.DisablePushBasedWSOption, Constants.Three, this.Page, Constants.MaxTimeout);
      if (pushBasedWSFlag) {
        await this.Page.click(WorkStreamSelector.DisablePushBasedWSOption);
      }
    }
    else {
      const pushBasedWSFlag = await this.waitUntilSelectorIsVisible(WorkStreamSelector.EnablePushbasedWSOption, Constants.Three, this.Page, Constants.MaxTimeout);
      if (pushBasedWSFlag) {
        await this.Page.click(WorkStreamSelector.EnablePushbasedWSOption);
      }
    }
    await this.waitUntilSelectorIsVisible(SelectorConstants.CapacityInput, Constants.Three, this.Page, Constants.MaxTimeout);
    await this.Page.fill(SelectorConstants.CapacityInput, "");
    await this.Page.fill(SelectorConstants.CapacityInput, capacity);
    await this.waitUntilSelectorIsVisible(SelectorConstants.FormSaveButton, Constants.Three, this.Page, Constants.MaxTimeout);
    await this.Page.click(SelectorConstants.FormSaveButton);
    await this.waitForDomContentLoaded();
  }

  public async adminLoginAndNavigateToWS(wsName: string) {
    await this.loginAccountDetails();
    await this.navigateToAdministration();
    await this.waitForDomContentLoaded();
    await this.navigateToWSView();
    await this.searchRecordAndClick(wsName);
  }

  public async NavigateToRRTab() {
    await (await this.Page.waitForSelector(SelectorConstants.RouringRuleTab)).click();
  }

  public async CheckIfEngagementContextIsPresentOnDropDown(channel: EngagementContextInRR) {
    await this.Page.click(SelectorConstants.AddRRButton);
    await this.waitForDomContentLoaded();
    await this.Page.click(SelectorConstants.AddConditionButton);
    await this.Page.click(SelectorConstants.SelectEntity);
    let element = await this.Page.waitForSelector(WorkStreamSelector.AttributeValue.replace(
      "{0}",
      EngagementContextInRR.WhatsApp
    ));
    expect(element).toBeTruthy();

  }

  public async DiscardChanges() {
    await this.Page.click(SelectorConstants.ModelPopupCancel);
  }

  // Used to search record on grid page and click on record
  public async searchWSRecordAndClick(record: string) {
    await this.waitUntilSelectorIsVisible(SelectorConstants.QuicksearchSMS, Constants.Two, this._page, Constants.MaxTimeout);
    await this.Page.fill(SelectorConstants.QuicksearchSMS, record);
    await this.Page.click(SelectorConstants.QuicksearchSMSbutton);
    await this.waitUntilSelectorIsVisible(SelectorConstants.UserNameLink.replace("{0}", record), Constants.Five, this._page, Constants.MaxTimeout);
    await this.Page.click(SelectorConstants.GridViewFirstCell);
    await this.waitUntilSelectorIsVisible(SelectorConstants.EditBtnSelector, Constants.Three, this._page, Constants.MaxTimeout);
    await this.Page.keyboard.press(Constants.EnterKey, { delay: TimeoutConstants.Default });
    await this.waitUntilSelectorIsVisible(WorkStreamSelector.UserName.replace("{0}", record), Constants.Five, this._page, Constants.MaxTimeout);
  }

  public async wsCapacityPreReq(pushBasedWSOption: boolean, capacity: string) {
    await this.waitUntilSelectorIsVisible(SelectorConstants.FormSaveButton, Constants.Three, this.Page, Constants.MaxTimeout);
    if (pushBasedWSOption) {
      const pushBasedWSFlag = await this.waitUntilSelectorIsVisible(WorkStreamSelector.DisablePushBasedWSOption, Constants.Three, this.Page, Constants.MaxTimeout);
      if (pushBasedWSFlag) {
        await this.Page.click(WorkStreamSelector.DisablePushBasedWSOption);
      }
    }
    else {
      const pushBasedWSFlag = await this.waitUntilSelectorIsVisible(WorkStreamSelector.EnablePushbasedWSOption, Constants.Three, this.Page, Constants.MaxTimeout);
      if (pushBasedWSFlag) {
        await this.Page.click(WorkStreamSelector.EnablePushbasedWSOption);
      }
    }
    await this.waitUntilSelectorIsVisible(SelectorConstants.CapacityInput, Constants.Three, this.Page, Constants.MaxTimeout);
    await this.Page.fill(SelectorConstants.CapacityInput, "");
    await this.Page.fill(SelectorConstants.CapacityInput, capacity);
    await this.waitUntilSelectorIsVisible(SelectorConstants.FormSaveButton, Constants.Three, this.Page, Constants.MaxTimeout);
    await this.Page.click(SelectorConstants.FormSaveButton);
    await this.waitForSaveComplete();
  }

  public async navigateToWS(wsName: string) {
    await this.navigateToWSView();
    await this.searchRecordAndClick(wsName);
  }

  //create new application template with Page type as Third Party Website
  public async fillApplicationTabTemplateThirdPartyType(templateName: string, templateTitle: string, templateEntity: string) {
    await this.waitForDomContentLoaded();

    try {
      await this.Page.waitForSelector(SelectorConstants.UniqueName);
      await this.fillInputData(
        SelectorConstants.NameInput,
        templateName
      );
      await this.fillInputData(
        SelectorConstants.ApplicationTitle,
        templateTitle
      );
      await this.fillInputData(SelectorConstants.UniqueName, "new_" + templateName);
      await this.Page.selectOption(SelectorConstants.ApplicationPageType, { label: ApplicationTab.ThirdParty });
      await this.Page.fill(SelectorConstants.Description, ApplicationTab.ApplicationDescription + templateName);
      await this.Page.waitForSelector(SelectorConstants.FormSaveButton);
      await this.Page.click(SelectorConstants.FormSaveButton);
      await this.waitForSaveComplete();
    }
    catch {
      await this.fillInputData(
        SelectorConstants.NameInput,
        templateName
      );
      await this.fillInputData(
        SelectorConstants.ApplicationTitle,
        templateTitle
      );
      await this.fillLookupField(SelectorConstants.ApplicationType, SelectorConstants.ApplicationTypeLookupSearch, SelectorConstants.ApplicationTypeLookUpValue, templateEntity);
      await this.Page.fill(SelectorConstants.Description, ApplicationTab.ApplicationDescription + templateName);
      await this.Page.waitForSelector(SelectorConstants.FormSaveButton);
      await this.Page.click(SelectorConstants.FormSaveButton);
      await this.waitForSaveComplete();
    }
  }

  //This method searches for a record and returns boolean flag based on availability
  public async searchApplicationTemplate(SearchRecordTitle: string) {
    await this.waitForDomContentLoaded();
    await this.Page.waitForSelector(SelectorConstants.ApplicatiomTemplateSearch);
    await this.Page.fill(SelectorConstants.ApplicatiomTemplateSearch, SearchRecordTitle);
    await this.Page.click(SelectorConstants.QuicksearchSMSbutton);
    await this.waitForDomContentLoaded();
    let title;
    try {
      const recordTitleField = await this.Page.waitForSelector(SelectorConstants.RecordLink.replace("{0}", SearchRecordTitle));
      title = (await recordTitleField).innerText();
    } catch { }
    return (await title)?.toString() == SearchRecordTitle;
  }
}