import { ChannelsEventsConstants, Constants, PageConstants, SelectorConstants } from "../Utility/Constants";

import { AuthenticationSettings } from "../models/channelSettings/authentication-settings.model";
import { BasePage } from "../pages/BasePage";
import { FileAttachmentConstants } from "../pages/FileAttachment"
import { Page } from "playwright";

export const ChatWidgetPageConstants = {
  ToggleValue: "//label[text()='Show average wait time']/following::div[@aria-checked='true']",
  SearchLiveBotInputSelector: "//*[@data-id='msdyn_liveworkstreamid.fieldControl-LookupResultsDropdown_msdyn_liveworkstreamid_selected_tag_text']",
  RemoveLiveBotlookUpSelector: "//*[@data-id='msdyn_macroactionid.fieldControl-LookupResultsDropdown_msdyn_liveworkstreamid_selected_tag_delete']",
  LiveBotLanguageInput: "input[data-id='msdyn_macroactionid.fieldControl-LookupResultsDropdown_msdyn_liveworkstreamid_textInputBox_with_filter_new']",
  BotWorkstreamName: "Bot Queue",
  CustomerFileAttachmentToggle: "//label[contains(@id,'msdyn_enablefileattachmentsforcustomers-field-label')]/following::div[@aria-checked='true'][1]",
  AgentFileAttachmentToggle: "//label[contains(@id,'msdyn_enablefileattachmentsforagents-field-label')]/following::div[@aria-checked='true'][1]",
  Survey: "div[data-id='msdyn_prechatenabled.fieldControl_container']",
  OptionSetValue: "textarea[data-id='chatansweroptions.fieldControl-text-box-text']",
  UpdatedCustomMessage: "Updated Custom message",
  Timeout: 60000,
  TurnOnReconnectChatToPreviousChat: "//div[contains(@class,'ui-flipswitch ui-shadow-inset')]//a",
  ReconnectToPreviousAgent: "//input[@data-id='msdyn_timetoreconnectwithpreviousagent.fieldControl-duration-combobox-text']",
  PortalUrl: "//input[@data-id='msdyn_portalurl.fieldControl-text-box-text']",
  RedirectionUrl: "//input[@data-id='msdyn_redirectionurl.fieldControl-text-box-text']",
  ReconnectTimeLimit: "//input[@data-id='msdyn_autocloseafterinactivity.fieldControl-duration-combobox-text']",
  ReconnectTimeLimit1: "//input[contains(@aria-Label,'Reconnect time limit')]",
  AuthenticationSettingsMenuItem: "//li[contains(@id,'sitemap')]//span[contains(text(),'SMS')]",
};

export enum ChatWidgetTab {
  ConversationOptions = "tablist-tab_8",
  AutomatedMessages = "tablist-AutomatedMessages_tab",
  Survey = "tablist-tab_5",
  ChatRecord = "SampleWidgetforDesign"
}

export enum CallOptions {
  NoCalling = "192350000",
  VideoAndVoiceCalling = "192350001",
  VoiceOnly = "192350002",
  LiveChatTitle = "Let's Start a Conversation!",
  DesignSubtitle = "Available!!"
}

export enum TypeofInput {
  Singleline = "192350000",
  Multiplelines = "192350001",
  Optionset = "192350002",
  UserConsent = "192350004"
}

export enum SurveyQuestion {
  Question1 = "surveyone",
  Question2 = "surveytwo",
  Question3 = "surveythree",
  Question4 = "surveyfour",
  Question1Text = "surveyone",
  Question2Text = "surveytwo",
  Question3Text = "surveythree",
  Question4Text = "surveyfour",
}

export class ChatWidgetPage extends BasePage {
  private newChatWidgetData = {
    Name: "TestChatWidget",
    Language: "English - United States",
  };
  private newAutomatedMessageData = {
    Name: "TestAutomatedMessage",
    Text: "Text",
  };

  public newChatWidgetName;

  constructor(page: Page) {
    super(page);
  }

  public async getExistsChatSnippet(name: string): Promise<string> {
    await this.goToChatByName(name);
    return this.getWidgetSnippet();
  }

  public async fillAutomatedMessage(data = this.newAutomatedMessageData) {
    let newAutomatedMessageName = `${data.Name}_${new Date().getTime()}`;
    await this.fillTextAreaData(
      SelectorConstants.AutomatedMessageName,
      newAutomatedMessageName
    );
    await this.Page.selectOption(
      SelectorConstants.NewAutomatedMessageTrigger,
      SelectorConstants.NewAutomatedMessageTriggerSelect
    );

    let newAutomatedMessageText = `${data.Text}_${new Date().getTime()}`;
    await this.fillTextAreaData(
      SelectorConstants.AutomatedMessage,
      newAutomatedMessageText
    );
  }

  public async fillChatWidget(data = this.newChatWidgetData) {
    this.newChatWidgetName = `${data.Name}_${new Date().getTime()}`;
    await this.fillInputData(
      SelectorConstants.NameInput,
      this.newChatWidgetName
    );

    // Checking if language dropdown is not already filled.
    try {
      const langInput = await this.Page.waitForSelector(
        SelectorConstants.ChatWidgetLanguageInput
      );
      await langInput.fill(data.Language);
      await this.Page.waitForTimeout(Constants.DefaultMinTimeout);
      await this.Page.click(SelectorConstants.ChatWidgetLanguageSearch);
      await this.Page.waitForTimeout(Constants.DefaultMinTimeout);
      await this.Page.click(
        SelectorConstants.ChatWidgetLanguageLookupValue.replace(
          "{0}",
          data.Language
        )
      );
    } catch { }

    const isWorkStreamAvailable = await this.Page.textContent(
      SelectorConstants.ChatWidgetWorkStreamValue
    );
    if (isWorkStreamAvailable === "" || isWorkStreamAvailable === "---") {
      const workStreamInput = await this.Page.waitForSelector(
        SelectorConstants.ChatWidgetWorkStreamInput
      );

      await workStreamInput.hover();
      await this.Page.waitForTimeout(Constants.DefaultMinTimeout);
      await this.Page.click(SelectorConstants.ChatWidgetWorkStreamSearch);
      await this.Page.waitForTimeout(Constants.DefaultMinTimeout);
      await this.Page.click(SelectorConstants.ChatWidgetWorkStreamLookupValue);
    }
    await this.Page.click(SelectorConstants.FileAttachmentsLabel);
    await this.Page.click(SelectorConstants.FormSaveButton);
    await this.waitForSaveComplete();
    await this.waitForDomContentLoaded();
  }

  public async EnableAgentFileAttachment() {
    await this.Page.click(SelectorConstants.EnableFileAttachmentForAgent);
    await this.Page.click(SelectorConstants.FormSaveButton);
    await this.waitForSaveComplete();
  }

  public async DisableFileAttachmentToggle(typeOfUser: string) {
    const getDefaultToggleValue = await this.Page.waitForSelector(typeOfUser);
    const valueBeforeToggle = await getDefaultToggleValue.textContent();
    if (valueBeforeToggle === Constants.ToggleOn) {
      await this.Page.click(typeOfUser);
      await this.Page.click(SelectorConstants.FormSaveButton);
      await this.waitForSaveComplete();
    }
  }

  public async EnableFileAttachmentToggle(typeOfUser: string) {
    const getDefaultToggleValue = await this.Page.waitForSelector(typeOfUser);
    const valueBeforeToggle = await getDefaultToggleValue.textContent();
    if (valueBeforeToggle === Constants.ToggleOff) {
      await this.Page.click(typeOfUser);
      await this.Page.click(SelectorConstants.FormSaveButton);
      await this.waitForSaveComplete();
    }
  }

  public async EnableCustomerFileAttachment() {
    await this.Page.click(SelectorConstants.FileAttachmentsLabel);
    await this.Page.click(SelectorConstants.FormSaveButton);
    await this.waitForSaveComplete();
  }

  public async fillVideoAndVoiceCalling() {
    await this.Page.selectOption(
      SelectorConstants.CallOptions,
      CallOptions.VideoAndVoiceCalling as string
    );
    await this.Page.click(SelectorConstants.FormSaveButton);
    await this.waitForSaveComplete();
    await this.waitForDomContentLoaded();
    await this.Page.reload();
    await this.Page.waitForNavigation();
  }

  public async fillVoiceOnly() {
    await this.Page.selectOption(
      SelectorConstants.CallOptions,
      CallOptions.VoiceOnly as string
    );
    await this.Page.click(SelectorConstants.FormSaveButton);
    await this.waitForSaveComplete();
    await this.waitForDomContentLoaded();
    await this.waitForDomContentLoaded();
    await this.Page.reload();
    await this.Page.waitForNavigation();
  }

  public async fillNoCalling() {
    await this.Page.selectOption(
      SelectorConstants.CallOptions,
      CallOptions.NoCalling as string
    );

    await this.Page.click(SelectorConstants.FormSaveButton);
    await this.waitForSaveComplete();
    await this.waitForDomContentLoaded();
    await this.Page.reload();
    await this.Page.waitForNavigation();
  }

  public async validateNoCalling() {
    const currentCallingOption = await this.Page.waitForSelector(
      SelectorConstants.CallOptions
    );
    const isNoCalling = await (
      await currentCallingOption.textContent()
    ).includes(Constants.NoCalling);
    return isNoCalling;
  }

  public async validateVideoAndVoiceCalling() {
    const currentCallingOption = await this.Page.waitForSelector(
      SelectorConstants.CallOptions
    );
    const isVideoAndVoiceCalling = await (
      await currentCallingOption.textContent()
    ).includes(Constants.VideoAndVoiceCalling);
    return isVideoAndVoiceCalling;
  }

  public async validateVoiceOnly() {
    const currentCallingOption = await this.Page.waitForSelector(
      SelectorConstants.CallOptions
    );
    const isVoiceOnly = await (
      await currentCallingOption.textContent()
    ).includes(Constants.VoiceOnly);
    return isVoiceOnly;
  }

  public async navigateToTab(tabName: ChatWidgetTab) {
    await this.waitForDomContentLoaded();
    await this.Page.click(
      SelectorConstants.WorkStreamTab.replace("{0}", tabName)
    );
  }
  public async navigateToChatWidgetView() {
    await this.Page.click(SelectorConstants.ChatWidgetMenuItem);
  }

  public async validateDefaultToggle() {
    const getDefaultToggleValue = await this.Page.waitForSelector(
      ChatWidgetPageConstants.ToggleValue
    );
    const valueBeforeToggle = await getDefaultToggleValue.textContent();
    return valueBeforeToggle === Constants.ToggleOff;
  }

  public async validateToggleValueAfterClick() {
    await this.Page.click(ChatWidgetPageConstants.ToggleValue);
    const getDefaultToggleValue = await this.Page.waitForSelector(
      ChatWidgetPageConstants.ToggleValue
    );
    const valueBeforeToggle = await getDefaultToggleValue.textContent();
    return valueBeforeToggle === Constants.ToggleOn;
  }

  public async openNewChat() {
    await this.waitForDomContentLoaded();
    await this.Page.click(SelectorConstants.NewRecordButton);
  }

  public async createNewAutomatedMessage() {
    await this.waitForDomContentLoaded();
    await this.Page.click(SelectorConstants.ChatWidgetNew);
  }

  public async saveNewAutomatedMessage() {
    await this.waitForDomContentLoaded();
    await this.Page.click(SelectorConstants.NewAutomatedMessageSave);
  }

  public async selectNewlyCreatedAutomationMessage() {
    let labelClicked = false;
    while (!labelClicked) {
      let labels = await this.Page.$$(SelectorConstants.NewlyCreatedAutomatedMessageCell);
      for (let label of labels) {
        let labelText = await label.innerHTML();
        if (labelText.includes("Text_")) {
          await label.click();
          labelClicked = true;
          break;
        }
      }
    }
    await this.Page.click(SelectorConstants.NewlyCreatedAutomatedMessageCellButton);
  }

  public async validateIfResetCustomizationTabExists(shoulExist: Boolean) {
    await this.waitForDomContentLoaded();
    let tab = await this.Page.$(SelectorConstants.AutomatedMessageResetCustomizationTab);
    return (tab != null) == shoulExist;
  }
  public async openSurvey() {
    await this.waitForDomContentLoaded();
    await this.Page.click(SelectorConstants.SurveyOption);
  }

  public async turnOnOffSurvey() {
    await this.waitForDomContentLoaded();
    await this.Page.check(SelectorConstants.TurnOnOffSurvey);
    await this.Page.waitForTimeout(6000);
    await this.Page.click(SelectorConstants.AddQuestion);
    const QuestionName = await this.Page.waitForSelector(SelectorConstants.QuestionName);
    await QuestionName.fill('Survey');
    const QuestionText = await this.Page.waitForSelector(SelectorConstants.QuestionText);
    await QuestionText.fill('Survey Question');
    const SaveQuestion = await this.Page.waitForSelector(SelectorConstants.SaveQuestion);
    await SaveQuestion.click();
    await this.waitUntilSelectorIsHidden(SelectorConstants.QuestionName);
    await this.Page.click(SelectorConstants.FormSaveButton);
    await this.waitForSaveComplete();
    await this.waitForDomContentLoaded();

    //Turn on Pre-Chat survey and waiting until reflect in Live chat
    await this.Page.waitForTimeout(Constants.MaxTimeout);
  }

  public async deleteChatChannel() {
    await this.Page.click(SelectorConstants.FormDeleteButton);
    const deleteConfirm = await this.Page.waitForSelector(
      SelectorConstants.ConfirmButtonId
    );
    await deleteConfirm.click();
    await this.waitUntilSelectorIsHidden(SelectorConstants.SurveyOption);
  }

  public async designSurvey() {
    await this.waitForDomContentLoaded();
    await this.Page.click(SelectorConstants.DesignOption);
  }

  public async updateDesignDetails() {
    await this.waitForDomContentLoaded();
    await this.Page.selectOption(
      SelectorConstants.ThemeColor, { label: 'Purple' }
    );
    const DesignTitle = await this.Page.waitForSelector(SelectorConstants.DesignTitle);
    await DesignTitle.fill(CallOptions.LiveChatTitle);
    const SubTitle = await this.Page.waitForSelector(SelectorConstants.SubTitle);
    await SubTitle.fill(CallOptions.DesignSubtitle);
    await this.Page.click(SelectorConstants.FormSaveButton);
    await this.waitForSaveComplete();
    await this.waitForDomContentLoaded();
  }

  public async enableSurvey() {
    await this.waitForDomContentLoaded();
    await this.Page.check(SelectorConstants.TurnOnOffSurvey);
  }

  public async createSurveyQuestions(questioname: string, questionText: string, type) {
    await this.Page.click(SelectorConstants.AddQuestion);

    const QuestionName = await this.Page.waitForSelector(SelectorConstants.QuestionName);
    await QuestionName.fill(questioname);

    const QuestionText = await this.Page.waitForSelector(SelectorConstants.QuestionText);
    await QuestionText.fill(questionText);

    await this.Page.selectOption(
      SelectorConstants.QuestionType,
      type
    );
    const SaveQuestion = await this.Page.waitForSelector(SelectorConstants.SaveQuestion);
    await SaveQuestion.click();
    await this.waitUntilSelectorIsHidden(SelectorConstants.QuestionName);
    await this.Page.click(SelectorConstants.FormSaveButton);
    await this.waitForSaveComplete();
    await this.waitForDomContentLoaded();
  }

  public async getWidgetSnippet() {
    await this.Page.waitForTimeout(Constants.DefaultTimeout);
    const snippetValue = await this.Page.waitForSelector(SelectorConstants.SelectWidgetSnippet);
    const codesnippet = await snippetValue.textContent();
    return codesnippet;
  }

  public async goToAuthenticationSettings() {
    await this.Page.click(SelectorConstants.AuthenticationSettingsMenuItemXPath);
  }

  public async updateAuthenticationSettings(authSettings: AuthenticationSettings) {
    await this.fillAuthenticationSettingValues(authSettings);
    await this.Page.click(SelectorConstants.FormSaveButton);
  }

  public async updateAuthenticationSettingsLCW(authSettings: AuthenticationSettings) {
    await this.fillAuthenticationSettingValues(authSettings);
    await this.formSaveAndCloseButton();
  }

  public async navigateToAuthenticationSettingsView() {
    await this.Page.click(SelectorConstants.AuthenticationSettingMenuItem);
    await this.waitForDomContentLoaded();
    await this.Page.waitForTimeout(Constants.DefaultTimeout);
  }


  public async findAuthenticationSettingsLCW(name: string): Promise<void> {
    await this.goToAuthenticationSettings();
    await this.trySearchAndOpenFirstRecord(name);
  }

  public async findAuthenticationSettings(authSettings: AuthenticationSettings) {
    await this.goToAuthenticationSettings();
    await this.trySearchAndOpenFirstRecord(authSettings.authSettingName);
  }

  public async deleteAuthenticationSettingsIfExist(name: string): Promise<void> {
    await this.goToAuthenticationSettings();
    if (await this.trySearchAndOpenFirstRecord(name)) {
      await this.formDeleteAndSubmitButton();
    }
  }

  public async deleteAuthenticationSettings(name: string): Promise<void> {
    await this.goToAuthenticationSettings();
    if (await this.trySearchAndOpenFirstRecord(name)) {
    }
  }

  public async goToCreateNewAuthenticationSettings() {
    await this.goToAuthenticationSettings();
    await this.Page.waitForSelector(SelectorConstants.AuthenticationSettingsCreateNewXPath);
    await this.Page.click(SelectorConstants.AuthenticationSettingsCreateNewXPath);
  }

  public async goToCreateNewAuthenticationSettingsAuth() {
    await this.Page.waitForSelector(SelectorConstants.AuthenticationSettingsCreateNewXPath);
    await this.Page.click(SelectorConstants.AuthenticationSettingsCreateNewXPath);
  }

  public async createNewAuthenticationSetting(authSettings: AuthenticationSettings): Promise<void> {
    await this.goToCreateNewAuthenticationSettings();
    await this.fillAndSaveAuthenticationSetting(authSettings);
  }

  public async createNewAuthenticationSettingAuth(authSettings: AuthenticationSettings): Promise<void> {
    await this.fillAndSaveAuthenticationSetting(authSettings);
  }

  public async createNewAuthenticationSettingLCW(authSettings: AuthenticationSettings): Promise<void> {
    await this.goToCreateNewAuthenticationSettings();
    await this.fillAndSaveAuthenticationSettingLCW(authSettings);
  }

  public async fillAndSaveAuthenticationSettingLCW(authSettings: AuthenticationSettings) {
    await this.fillAuthenticationSettingValues(authSettings);
    await this.formSaveButton();
    await this.waitForSaveComplete();
    await this.formSaveAndCloseButton();
    await this.waitForDomContentLoaded();
  }
  public async fillAndSaveAuthenticationSetting(authSettings: AuthenticationSettings) {
    await this.fillAuthenticationSettingValues(authSettings);
    await this.formSaveButton();
  }

  private async fillAuthenticationSettingValues(authSettings: AuthenticationSettings): Promise<void> {
    await this._page.fill(SelectorConstants.AuthenticationSettingsNameXPath, authSettings.authSettingName);
    await this._page.fill(SelectorConstants.AuthenticationSettingsPublicKeyUrlXPath, authSettings.publicKeyUrl);
    await this._page.fill(SelectorConstants.AuthenticationSettingsJSClietnFuncXPath, authSettings.jsClientFunction);
  }

  public async enableFileAttachmentOption(agentOption: boolean, customerOption: boolean) {
    await this.Page.click(FileAttachmentConstants.GeneralSettingsTab);

    //Agent File Upload Button
    const agentYesOption = await this.waitUntilSelectorIsVisible(FileAttachmentConstants.FileUploadLabelForAgentYesOption, 1, this.Page, Constants.FourThousandsMiliSeconds);
    if (agentYesOption == agentOption) {
      await this.Page.click(FileAttachmentConstants.FileUploadRadioButtonForAgentNoOption);
    }

    //Customer File Upload Button
    const customerYesOption = await this.waitUntilSelectorIsVisible(FileAttachmentConstants.FileUploadLabelForCustomerYesOption, 1, this.Page, Constants.FourThousandsMiliSeconds);
    if (customerYesOption == customerOption) {
      await this.Page.click(FileAttachmentConstants.FileUploadRadioButtonForCustomerNoOption);
    }
    await this.Page.click(SelectorConstants.FormSaveButton);
    await this.waitForSaveComplete();
    await this.waitForDomContentLoaded();
  }

  public async validateIfDefaultOOBMessagesAreCreated() {
    await this.Page.waitForTimeout(Constants.WaitingOneMinute);
    await this.Page.click(SelectorConstants.RefreshButton);
    await this.navigateToTab(ChatWidgetTab.AutomatedMessages);
    await this.waitForDomContentLoaded();
    let holidayMessage = this.Page.waitForSelector(SelectorConstants.DefaultAutomatedHolidayMessage, { timeout: ChatWidgetPageConstants.Timeout })
    let ooohMessage = this.Page.waitForSelector(SelectorConstants.DefaultAutomatedOOOHMessage, { timeout: ChatWidgetPageConstants.Timeout })
    return holidayMessage && ooohMessage;
  }

  public async updateSystemMessage() {
    await this.Page.dblclick(SelectorConstants.NavigateToFirstSystemMessage);
    await this.Page.fill(SelectorConstants.SystemMessageLocalizedText, ChatWidgetPageConstants.UpdatedCustomMessage);
    await this.Page.click(SelectorConstants.FormSaveButton);
    await this.Page.click(SelectorConstants.GoBackButon);
    await this.waitForDomContentLoaded();
    await this.Page.waitForSelector(SelectorConstants.CustomisedSystemMessage, { timeout: ChatWidgetPageConstants.Timeout });
  }

  public async EnableChatReconnect(lcwUrl: string, reconnectTimeLimit: string) {
    let reconnectToggle = await this.Page.waitForSelector(ChatWidgetPageConstants.TurnOnReconnectChatToPreviousChat);
    var isReconnect = await reconnectToggle.getAttribute("aria-checked");
    if (JSON.parse(isReconnect) === false) {
      await this.Page.click(ChatWidgetPageConstants.TurnOnReconnectChatToPreviousChat);
      await this.Page.waitForSelector(ChatWidgetPageConstants.ReconnectToPreviousAgent);
      await this.Page.fill(ChatWidgetPageConstants.ReconnectToPreviousAgent, "3 minutes");
      await this.Page.waitForSelector(ChatWidgetPageConstants.PortalUrl);
      await this.Page.fill(ChatWidgetPageConstants.PortalUrl, lcwUrl);
      await this.Page.waitForSelector(ChatWidgetPageConstants.RedirectionUrl);
      await this.Page.fill(ChatWidgetPageConstants.RedirectionUrl, "https://www.microsoft.com");
      let reconnectTime = await this.Page.waitForSelector(ChatWidgetPageConstants.ReconnectTimeLimit);
      let reconnectTimeLimitValue = await reconnectTime.getAttribute("title");
      expect(reconnectTimeLimitValue).toStrictEqual(reconnectTimeLimit);
      await this.Page.click(SelectorConstants.FormSaveButton);
      await this.waitForSaveComplete();
    }
  }

  public async fillChatWidgetWithWorkstream(workstream: string, data = this.newChatWidgetData) {
    this.newChatWidgetName = `${data.Name}_${new Date().getTime()}`;
    await this.fillInputData(
      SelectorConstants.NameInput,
      this.newChatWidgetName
    );

    // Checking if language dropdown is not already filled.
    try {
      const langInput = await this.Page.waitForSelector(
        SelectorConstants.ChatWidgetLanguageInput
      );
      await langInput.fill(data.Language);
      await this.waitUntilSelectorIsVisible(SelectorConstants.ChatWidgetLanguageSearch);
      await this.Page.click(SelectorConstants.ChatWidgetLanguageSearch);
      await this.waitUntilSelectorIsVisible(SelectorConstants.ChatWidgetLanguageLookupValue.replace(
        "{0}",
        data.Language
      ));
      await this.Page.click(
        SelectorConstants.ChatWidgetLanguageLookupValue.replace(
          "{0}",
          data.Language
        )
      );
    } catch { }

    const isWorkStreamAvailable = await this.Page.textContent(
      SelectorConstants.ChatWidgetWorkStreamValue
    );
    if (isWorkStreamAvailable === "" || isWorkStreamAvailable === "---") {
      const workStreamInput = await this.Page.waitForSelector(
        SelectorConstants.ChatWidgetWorkStreamInput
      );

      await workStreamInput.hover();
      await this.waitUntilSelectorIsVisible(SelectorConstants.ChatWidgetWorkStreamSearch);
      await this.Page.click(SelectorConstants.ChatWidgetWorkStreamSearch);
      await this.waitUntilSelectorIsVisible(SelectorConstants.ChatWidgetWorkStreamLookupValue);
      await this.Page.click(SelectorConstants.ChatWidgetWorkStreamLookupValue);
    }
    await this.Page.click(SelectorConstants.FileAttachmentsLabel);
    const selectedWS = await this.Page.waitForSelector(PageConstants.SelectedWS);
    await selectedWS.hover();
    const removeExistingWS = await this.Page.waitForSelector(PageConstants.RemoveExistingWS);
    await removeExistingWS.click();
    const fillWorkstream = await this.Page.waitForSelector(PageConstants.FillWorkstream);
    await fillWorkstream.fill(workstream);
    await this.Page.click(
      PageConstants.WorkstreamLookUpValue.replace(
        "{0}",
        workstream
      )
    );
    await this.Page.click(SelectorConstants.FormSaveButton);
    await this.waitForSaveComplete();
    await this.waitForDomContentLoaded();
  }

  public async getChannelAutomatedMessageTriggers() {
    return ChannelsEventsConstants.LiveChat
  }

  public async setResetRedirectionURL(redirectionURL: string = "") {
    await this.Page.waitForSelector(ChatWidgetPageConstants.RedirectionUrl);
    await this.Page.fill(ChatWidgetPageConstants.RedirectionUrl, redirectionURL);
    await this.Page.click(SelectorConstants.FormSaveButton);
    await this.waitForSaveComplete();
    await this.waitForDomContentLoaded();
  }
}
