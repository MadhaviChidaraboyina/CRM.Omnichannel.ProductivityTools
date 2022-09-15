import {
  AgentChatConstants,
  AgentConversationPageConstants,
  AgentCosultConversationPageConstants,
  AgentPVAConversationPageConstants,
  Constants,
  ConversationStatesConstants,
  DiagnosticData,
  EntityAttributes,
  EntityNames,
  PageConstants,
  SelectorConstants,
  SmartAssistConstants,
  stringFormat,
} from "../Utility/Constants";
import { CustomConstants, ResolutionType } from "../pages/Cases";
import { IFrameConstants, IFrameHelper } from "../Utility/IFrameHelper";
import {
  TimeoutConstants as TMConstant,
  TimeoutConstants,
} from "../constants/timeout-constants";

import { AgentPage } from "../pages/AgentPage";
import { AsyncChannelE2EPage } from "../pages/async-channels-e2e.page";
import { ElementHandle } from "playwright";
import { FacebookMessangerConstants } from "../pages/FacebookMessanger";
import { Frame } from "playwright";
import { HTMLConstants } from "../constants";
import { LogChatDetails } from "../helpers/log-helper";
import { Page } from "playwright";
import { LiveChatConstants, QuickReplies } from "../pages/LiveChat";
import { SentimentTypes } from "../pages/agent-conversation.page";
import { SurveyQuestion } from "../pages/ChatWidget";
import { TestHelper } from "../helpers/test-helper";
import { TestSettings } from "../configuration/test-settings";
import { TwitterAccountConstants } from "../pages/TwitterAccount";
import { Util } from "../Utility/Util";
import { conversationInfo } from "../types/e2e/async-channels.t";
import { isNullOrUndefined } from "util";
import { ConversationConstants } from "../pages/Conversation";

export enum AgentTabs {
  CustomerSummary = "tab-id-3",
  Knowledgearticlesearch = "tab-id-4",
}

export enum SearchOptions {
  CategorizedSearch = "1",
  RelevanceSearch = "0",
}

export enum PositiveSentiment {
  Slightlypositive = "Slightly positive",
  Positive = "Positive",
  VeryPositive = "Very positive",
}

export enum NegativeSentiment {
  SlightlyNegative = "Slightly negative",
  Negative = "Negative",
  VeryNegative = "Very negative",
}

export class AgentChat extends AgentPage {
  private ContactData = {
    ContactName: "Junior",
    ContactLastName: "Sheldon",
  };

  public contactRecordName = `${this.ContactData.ContactName
    }_${new Date().getTime()}`;
  private CustomerFullName = "";
  public customerName = "";
  private ConversationTitleName = "";
  private CustomerConversationName = "";

  private AccountData = {
    AccountName: AgentChatConstants.AccountName,
  };

  private BotMessage = {
    BotMessgaeText: "Voice call ended",
  };

  private Tooltips = {
    VoiceCall: "Call customer",
    VideoCall: "Video call customer",
    CustomMessage: "Custom Messaging Conversation",
  };
  constructor(page: Page) {
    super(page);
  }

  public async fillVoiceCalling(Iframe: any) {
    await this.waitUntilSelectorIsVisible(
      SelectorConstants.ChatMoreOptionsSelector,
      AgentChatConstants.Two,
      this.Page,
      AgentChatConstants.FiveThousandsMiliSecondsWaitTimeout
    );
    await Iframe.click(SelectorConstants.ChatMoreOptionsSelector);
    await Iframe.click(SelectorConstants.VoiceCallSelector);
    await this.waitForDomContentLoaded();
  }

  public async toggleTranslation() {
    const ccIframe = await this.getConvCtrl();
    await ccIframe.waitForSelector(AgentChatConstants.FooterMoreButton);
    await ccIframe.click(AgentChatConstants.FooterMoreButton);
    await ccIframe.waitForSelector(AgentChatConstants.ToggleTranslationButton);
    await ccIframe.click(AgentChatConstants.ToggleTranslationButton);
  }

  public async sendMessage(message: string, language = "en", isWait = false) {
    if (isWait === true) {
      await this.Page.waitForTimeout(Constants.MaxTimeout);
    }
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.MessageTextArea,
      AgentChatConstants.Three,
      iframe
    );
    const textarea = await iframe.waitForSelector(
      AgentChatConstants.MessageTextArea
    );
    await textarea.fill(message);
    await this.delay(5000);
    await iframe.$eval(AgentChatConstants.SendMessageButton, (el) => {
      (el as HTMLElement).scrollIntoView();
      (el as HTMLElement).click();
    });
    await this.delay(5000);
  }

  public async getLiveWorkItemId() {
    const liveWorkItemId = await this.Page.evaluate(() =>
      eval("Microsoft.Omnichannel.getConversationId();")
    );
    return liveWorkItemId;
  }

  public getPageUrl() {
    const url = this.Page.url();
    return url;
  }

  public async acceptInvitationToChat(
    timeout?: number,
    shouldwaitForConversationControl: boolean = true
  ) {
    await this.waitForDomContentLoaded();
    await this.Page.waitForSelector(AgentChatConstants.AcceptButtonId);
    await this._page.click(AgentChatConstants.AcceptButtonId);
    if (shouldwaitForConversationControl)
      await this.waitForConversationControl();
    await LogChatDetails(
      this._page,
      "Accept Invitation to Chat",
      "after accept chat"
    );
  }

  public async acceptInvitationToVoiceChat(
    timeout?: number,
    shouldwaitForConversationControl: boolean = true
  ) {
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.AcceptButtonId,
      AgentChatConstants.Four,
      null,
      timeout || AgentChatConstants.ThrityFiveThousandMiliSeconds
    );
    await this._page.click(AgentChatConstants.AcceptButtonId);
    if (shouldwaitForConversationControl)
      await LogChatDetails(
        this._page,
        "Accept Invitation to Chat",
        "after accept chat"
      );
  }

  public async validateLiveChatGlobalMessage() {
    try {
      await this.Page.waitForSelector(AgentChatConstants.WarningMessageList);
      await this.Page.click(AgentChatConstants.WarningMessageList);
      var message = await this.Page.waitForSelector(
        AgentChatConstants.WarningMessageForLostChat
      );
    } catch {
      var message = await this.Page.waitForSelector(
        AgentChatConstants.WarningMessageForLostChat
      );
    }
    const entityItemText = await message.textContent();
    const text = AgentChatConstants.AgentConnectionLostBlobalMsg;
    if (entityItemText.search(text) != -1) {
      return true;
    }
  }

  public async validateLiveChatGlobalMessagePresent() {
    try {
      await this.Page.waitForSelector(AgentChatConstants.WarningMessageList);
      await this.Page.click(AgentChatConstants.WarningMessageList);
      await this.Page.waitForSelector(
        AgentChatConstants.WarningMessageForLostChat
      );
      return true;
    } catch {
      return false;
    }
  }

  public async validateSMSNotificationTitle() {
    const title = await this.Page.waitForSelector(
      AgentChatConstants.NotificationHeaderTitle
    );
    const currentTitle = await title.innerText();
    return currentTitle.includes(AgentChatConstants.SMS);
  }

  public async rejectInvitationToChat(
    timeout?: number,
    shouldwaitForConversationControl: boolean = true
  ) {
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.DeclineButtonId,
      AgentChatConstants.Four,
      null,
      timeout || AgentChatConstants.ThrityFiveThousandMiliSeconds
    );
    await this._page.click(AgentChatConstants.DeclineButtonId);
    if (shouldwaitForConversationControl)
      await this.waitForConversationControl();
    await LogChatDetails(
      this._page,
      "Reject Invitation to Chat",
      "after reject chat"
    );
  }

  public async acceptAndCloseIncomingChats(
    timeout = 3000,
    shouldwaitForConversationControl = true
  ) {
    // Try to accept popup, and close every accepted chat
    // If there is no active popup exception is thrown, that is all chat closed
    try {
      await this.acceptTargetChat(
        (_) => Promise.resolve(false),
        timeout,
        shouldwaitForConversationControl
      );
    } catch {
      return;
    }
  }

  // Open all coming popups and check for unique message in the conversation. All inappropriate will be closed.
  public acceptChat(uniqueMessage: string) {
    return this.acceptTargetChat(async (agentChatPage) => {
      const ccFrame: Page = await agentChatPage.getConvCtrl();
      try {
        await ccFrame.waitForFunction(
          (expected) =>
            [...document.querySelectorAll("div.received-message")].some(
              (customerMessageEl) =>
                customerMessageEl.textContent.includes(expected)
            ),
          uniqueMessage,
          { timeout: 7000 }
        );
        return true;
      } catch {
        return false;
      }
    });
  }

  public async agentChatIndex(chat: any) {
    const chatIndexSelector = Constants.ChatIndex.replace("{0}", chat);
    const activeChat = await this.Page.waitForSelector(chatIndexSelector);
    const activeChatCustomerName = await activeChat.textContent();
    const activeChatCustomerLength = activeChatCustomerName.length;
    const activeChatindex = activeChatCustomerName.charAt(
      activeChatCustomerLength - 1
    );
    return activeChatindex;
  }

  public async acceptTargetChat(
    checkForExpectedChat: (chatPage: AgentChat) => Promise<boolean>,
    timeout?: number,
    shouldwaitForConversationControl: boolean = true
  ) {
    while (true) {
      // When no active popup is present and expected chat hasn`t been found yet timeout exception will be thrown from accept method
      // so the loop will break and test fails since the correct chat couldn`t be initialized
      await this.acceptInvitationToChat(
        timeout,
        shouldwaitForConversationControl
      );
      const ccFrame: Page = await this.getConvCtrl();
      await ccFrame.waitForSelector(AgentChatConstants.MessageTextArea);

      // If chat validation succeeds the correct chat was accepted.
      // Otherwise, close the accepted chat.
      const isExpectedChat = await checkForExpectedChat(this);
      if (isExpectedChat) {
        break;
      } else {
        await this.closeActiveSessionsWithChats();
      }
    }
  }

  public async declineInvitationToChat() {
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.DeclineButtonId,
      2,
      null,
      AgentChatConstants.AgentPopUpWaitingTimeout
    );
    await this._page.click(AgentChatConstants.DeclineButtonId);
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

  public async setAgentStatus(status: string) {
    await this._page.click(AgentChatConstants.AgentStatusButton);
    const selectElement = await this._page.waitForSelector(
      AgentChatConstants.SelectStatusElement
    );
    selectElement.selectOption({ label: status });
    await this._page.click(AgentChatConstants.AgentStatusOkButton);
    await this.waitForDomContentLoaded();
  }

  public async verifyAgentStatus(statusSelector: string) {
    //Wait for popup notification
    await this.waitUntilSelectorIsVisible(
      statusSelector,
      AgentChatConstants.Five,
      null,
      AgentChatConstants.AgentPopUpWaitingTimeout
    );
    await this._page.waitForTimeout(2000);
  }

  /// </summary>
  /// This method is used for test case 1711809 where when first agent transfer its chat chat to other queue, end chat button will be disabled.
  /// </summary>
  public async closeOCAgentChatSession() {
    const iframeCC = await IFrameHelper.GetIframe(
      this._page,
      IFrameConstants.IframeCC
    );
    await this._page.$eval(
      AgentChatConstants.RemoveConversationButtonClass,
      (el) => (el as HTMLElement).click()
    );
    await this.waitUntilSelectorIsVisible(AgentChatConstants.ConfirmButtonId);
    await this._page.$eval(AgentChatConstants.ConfirmButtonId, (el) =>
      (el as HTMLElement).click()
    );
    await this._page.waitForTimeout(
      AgentChatConstants.ConversationWrapUpTimeout
    ); //Included this wait condition to wait for chat conversation wrapup business process to complete in background, will remove it later by adding wait condition with some linked selector.
  }

  /// </summary>
  /// This method is used to clear chat conversation voice call from agent end.
  /// </summary>
  public async closeOCAgentVoiceChatConversation() {
    const iframeCC = await IFrameHelper.GetIframe(
      this._page,
      IFrameConstants.IframeCC
    );
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.EndConversationVoiceCallButton,
      AgentChatConstants.Three,
      iframeCC
    );
    await iframeCC.$eval(AgentChatConstants.EndConversationVoiceCallButton, (el) =>
      (el as HTMLElement).click()
    );
    await this._page.$eval(
      AgentChatConstants.RemoveConversationButtonClass,
      (el) => (el as HTMLElement).click()
    );
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.ConfirmButtonId,
      Constants.Three,
      this._page,
      Constants.MaxTimeout
    );
    await this._page.$eval(AgentChatConstants.ConfirmButtonId, (el) =>
      (el as HTMLElement).click()
    );
    await this._page.waitForTimeout(
      AgentChatConstants.ConversationWrapUpTimeout
    ); //Included this wait condition to wait for chat conversation wrapup business process to complete in background, will remove it later by adding wait condition with some linked selector.
  }

  /// </summary>
  /// This method is used to clear chat conversation from agent end.
  /// </summary>
  public async closeOCAgentChatConversation() {
    const iframeCC = await IFrameHelper.GetIframe(
      this._page,
      IFrameConstants.IframeCC
    );
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.EndConversationButtonXPath,
      AgentChatConstants.Three,
      iframeCC
    );
    await iframeCC.$eval(AgentChatConstants.EndConversationButtonXPath, (el) =>
      (el as HTMLElement).click()
    );
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.EndConversationButtonDisabledXPath,
      AgentChatConstants.Three,
      iframeCC
    );
    await this._page.$eval(
      AgentChatConstants.RemoveConversationButtonClass,
      (el) => (el as HTMLElement).click()
    );
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.ConfirmButtonId,
      Constants.Three,
      this._page,
      Constants.MaxTimeout
    );
    await this._page.$eval(AgentChatConstants.ConfirmButtonId, (el) =>
      (el as HTMLElement).click()
    );
    await this._page.waitForTimeout(
      AgentChatConstants.ConversationWrapUpTimeout
    ); //Included this wait condition to wait for chat conversation wrapup business process to complete in background, will remove it later by adding wait condition with some linked selector.
  }

  /// </summary>
  /// This method is used to clear chat conversation from second agent end for test case 1711809.
  /// </summary>
  public async closeOCTransferedAgentChatConversation() {
    const iframeCC = await IFrameHelper.GetIframe(
      this._page,
      IFrameConstants.IframeCC
    );
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.EndConversationButtonXPath,
      AgentChatConstants.Three,
      iframeCC
    );
    await iframeCC.$eval(AgentChatConstants.EndConversationButtonXPath, (el) =>
      (el as HTMLElement).click()
    );
    await this._page.$eval(
      AgentChatConstants.RemoveConversationButtonClass,
      (el) => (el as HTMLElement).click()
    );
    await this.waitUntilSelectorIsVisible(AgentChatConstants.ConfirmButtonId);
    await this._page.$eval(AgentChatConstants.ConfirmButtonId, (el) =>
      (el as HTMLElement).click()
    );
    await this._page.waitForTimeout(
      AgentChatConstants.ConversationWrapUpTimeout
    ); //Included this wait condition to wait for chat conversation wrapup business process to complete in background, will remove it later by adding wait condition with some linked selector.
  }

  public async transferChatToQueue(queueName: string) {
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    const messageTextArea = await iframe.waitForSelector(
      AgentChatConstants.MessageTextArea
    );
    await messageTextArea.fill(AgentChatConstants.TransferQueueCommand);
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.SelectDefaultQueueButton.replace("{0}", queueName),
      AgentChatConstants.Five,
      iframe,
      AgentChatConstants.FiveThousandsMiliSecondsWaitTimeout
    );
    await iframe.$eval(
      AgentChatConstants.SelectDefaultQueueButton.replace("{0}", queueName),
      (el) => {
        (el as HTMLElement).click();
      }
    );
  }

  public async ConsultChatWithQueue(queueName: string, agentName: string) {
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    const messageTextArea = await iframe.waitForSelector(
      AgentChatConstants.MessageTextArea
    );
    await messageTextArea.fill("");
    const searchTxt: string = AgentChatConstants.ConsultQueueCommand + AgentChatConstants.Queue1;
    await messageTextArea.type(searchTxt, { delay: 200 });
    await messageTextArea.press(AgentChatConstants.SpaceKeyword);
    await iframe.waitForTimeout(Constants.DefaultTimeout);
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.SelectQueueButton.replace("{0}", queueName),
      AgentChatConstants.Five,
      iframe,
      AgentChatConstants.FiveThousandsMiliSecondsWaitTimeout
    );
    await iframe.$eval(
      AgentChatConstants.SelectQueueButton.replace("{0}", queueName),
      (el) => {
        (el as HTMLElement).click();
      }
    );
    await iframe.waitForTimeout(Constants.DefaultTimeout);
    await this.waitUntilSelectorIsVisible(
      SelectorConstants.AgentToConsult.replace("{0}", agentName),
      AgentChatConstants.Five,
      iframe,
      AgentChatConstants.FiveThousandsMiliSecondsWaitTimeout
    );
    await iframe.$eval(
      SelectorConstants.AgentToConsult.replace("{0}", agentName),
      (el) => (el as HTMLElement).click()
    );
  }

  public async ConsultChatFromConsultPane(queueName: string) {
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    const messageTextArea = await iframe.waitForSelector(
      AgentChatConstants.ConsultMessageTextArea
    );
    await messageTextArea.fill("");
    const searchTxt: string = AgentChatConstants.ConsultQueueCommand + AgentChatConstants.Queue1;
    await messageTextArea.type(searchTxt, { delay: 100 });
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.SelectQueueButton.replace("{0}", queueName),
      AgentChatConstants.Five,
      iframe,
      AgentChatConstants.FiveThousandsMiliSecondsWaitTimeout
    );
  }

  public async transferChatToAgent(liveChatConsultOrTransferAgentName: string) {
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    const messageTextArea = await iframe.waitForSelector(
      AgentChatConstants.MessageTextArea
    );
    await messageTextArea.fill(AgentChatConstants.TransferAgentCommand);
    await iframe.waitForTimeout(Constants.DefaultTimeout);
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.SelectDefaultQueueButton.replace(
        "{0}",
        liveChatConsultOrTransferAgentName
      ),
      AgentChatConstants.Five,
      iframe,
      AgentChatConstants.FiveThousandsMiliSecondsWaitTimeout
    );
    await iframe.$eval(
      AgentChatConstants.SelectDefaultQueueButton.replace(
        "{0}",
        liveChatConsultOrTransferAgentName
      ),
      (el) => {
        (el as HTMLElement).click();
      }
    );
  }

  public async InitiateConsultWithAgent(agentName: string) {
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    await iframe.waitForSelector(SelectorConstants.ConsultButton);
    await iframe.$eval(SelectorConstants.ConsultButton, (el) =>
      (el as HTMLElement).click()
    );
    await iframe.waitForTimeout(Constants.DefaultTimeout);

    await this.waitUntilSelectorIsVisible(
      SelectorConstants.AgentToConsult.replace("{0}", agentName),
      AgentChatConstants.Five,
      iframe,
      AgentChatConstants.FiveThousandsMiliSecondsWaitTimeout
    );

    await iframe.$eval(
      SelectorConstants.AgentToConsult.replace("{0}", agentName),
      (el) => (el as HTMLElement).click()
    );
  }

  public async VerifyAgentConsultSystemMessage(agentName: string) {
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );

    expect(
      iframe.waitForSelector(
        SelectorConstants.SystemMessageAgentConsultIsJoined.replace(
          "{0}",
          agentName
        )
      )
    ).toBeTruthy();
  }

  public async validateSystemMessages(messageXpath: string, text: string) {
    await this.waitForDomContentLoaded();
    const iFrame: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    await this.waitUntilSelectorIsVisible(
      messageXpath,
      AgentChatConstants.Five,
      iFrame,
      AgentChatConstants.AgentMessagesLoadTimeOut
    );
    const systemmessage = await iFrame.waitForSelector(messageXpath);
    const entityItemText = await systemmessage.textContent();
    return entityItemText.startsWith(text);
  }

  public async validateSystemMessageText(text: string, timeout = 5000) {
    const iFrame: Page = await this.getConvCtrl();
    await iFrame.waitForFunction(
      (expected) =>
        [...document.querySelectorAll("div.system-message")].some((el) =>
          el.textContent.includes(expected)
        ),
      text,
      { timeout }
    );
  }

  public async validateTranscriptMessageText(text: string, timeout = 3000) {
    await this.Page.waitForFunction(
      (expectedText) =>
        [...document.querySelectorAll("div.message")].some((msg) =>
          msg.textContent.includes(expectedText)
        ),
      text,
      { timeout }
    );
  }

  public async validateConversationControlToastMessage(
    text: string,
    timeout = 3000
  ) {
    const iFrame: Page = await this.getConvCtrl();

    // If CC has two or more notifications it is required to expand the list to verify the expected one.
    if (
      await this.waitUntilSelectorIsVisible(
        "div.webchat__toaster__expandIcon",
        3,
        iFrame
      )
    ) {
      const expandToasts = await iFrame.$("div.webchat__toaster__expandIcon");
      await expandToasts.evaluate((el) => (el as HTMLElement).click());
    }

    const expectedToastExists = await iFrame.waitForFunction(
      (expectedMessage) =>
        [...document.querySelectorAll("li.webchat__toaster__listItem")].some(
          (el) => el.textContent.includes(expectedMessage)
        ),
      text,
      { timeout }
    );
    expect(expectedToastExists).toBeTruthy();
  }

  public async validateAgentMessage(textToValidate: string) {
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    const messageSelector = await (
      await iframe.waitForSelector(
        AgentChatConstants.ValiadationMessage.replace("{0}", textToValidate)
      )
    ).textContent();
    return !(messageSelector === null || messageSelector === undefined);
  }

  public async validateInternalMessageText(text: string) {
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );

    await iframe.waitForFunction(
      (expectedMessage) =>
        [...document.querySelectorAll("div.internal-message")].some((element) =>
          element.textContent.includes(expectedMessage)
        ),
      text,
      { timeout: 5000 }
    );
  }

  public async validateAgentHtmlMessage(
    messageNumber: number,
    textToValidate: string,
    expectedTag: string
  ) {
    let messageInnerHtml;
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    try {
      messageInnerHtml = await (
        await iframe.waitForSelector(
          AgentChatConstants.AgentHtmlMessageXPath.replace(
            "{0}",
            expectedTag
          ).replace("{1}", messageNumber.toString())
        )
      ).innerHTML();
    } catch {
      messageInnerHtml = await (
        await iframe.waitForSelector(
          AgentChatConstants.AgentHtmlMessageXPathV1.replace(
            "{0}",
            expectedTag
          ).replace("{1}", messageNumber.toString())
        )
      ).innerHTML();
    }

    return messageInnerHtml === textToValidate;
  }

  public async validateAgentHtmlMessageV1(
    messageNumber: number,
    textToValidate: string,
    expectedTag: string
  ) {
    let messageInnerHtml;
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    messageInnerHtml = await (
      await iframe.waitForSelector(
        AgentChatConstants.AgentHtmlMessageXPath.replace(
          "{0}",
          expectedTag
        ).replace("{1}", messageNumber.toString())
      )
    ).innerHTML();
    return messageInnerHtml === textToValidate;
  }

  public async validateAgentHtmlMessageV2(
    messageNumber: number,
    textToValidate: string
  ) {
    this.delay(5000);
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );

    const messageInnerHtml = await (
      await iframe.waitForSelector(
        AgentChatConstants.AgentHtmlMessageXPathV2.replace(
          "{0}",
          messageNumber.toString()
        )
      )
    ).innerHTML();

    return (
      messageInnerHtml === textToValidate ||
      messageInnerHtml === `<p>${textToValidate}</p>`
    );
  }

  public async validateCustomerHtmlMessageV2(
    messageNumber: number,
    textToValidate: string
  ) {
    this.delay(5000);
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );

    const messageInnerHtml = await (
      await iframe.waitForSelector(
        AgentChatConstants.CustomerHtmlMessageXPathV2.replace(
          "{0}",
          messageNumber.toString()
        )
      )
    ).innerHTML();

    if (
      messageInnerHtml === textToValidate ||
      messageInnerHtml === `<p>${textToValidate}</p>`
    ) {
      return true;
    }

    var translatedMessageNumber = messageNumber * 2;
    const translatedMessageInnerHtml = await (
      await iframe.waitForSelector(
        AgentChatConstants.CustomerHtmlMessageXPathV2Translated.replace(
          "{0}",
          translatedMessageNumber.toString()
        )
      )
    ).innerHTML();
    return (
      translatedMessageInnerHtml === `<i>${textToValidate}</i>` ||
      translatedMessageInnerHtml === `<i><p>${textToValidate}</p></i>`
    );
  }

  public async IsNotificationOpen() {
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.AcceptButtonId,
      AgentChatConstants.Two,
      null,
      AgentChatConstants.AgentPopUpWaitingTimeout
    ).catch(() => {
      return false;
    });
    return true;
  }

  public async validatePanelAttachment() {
    const iframeCC = await IFrameHelper.GetIframe(
      this._page,
      IFrameConstants.IframeCC
    );
    return iframeCC.waitForSelector(AgentChatConstants.AttachmentSelector);
  }

  public async sendMessageWithAttachment(
    message: string,
    attachments: string | Array<string> = [
      "FileResources//LiveChatAttachment.txt",
    ],
    language = "en"
  ) {
    await this.waitForDomContentLoaded();
    await this.waitUntilSelectorIsVisible(IFrameConstants.IframeCC);
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    await this.waitForDomContentLoaded();
    const textarea = await iframe.waitForSelector(
      AgentChatConstants.MessageTextArea
    );
    await textarea.fill(message);
    await iframe.setInputFiles(
      AgentChatConstants.LiveChatUploadFile,
      attachments
    );
    await this.waitForDomContentLoaded();
    await iframe.$eval(AgentChatConstants.SendMessageButton, (el) => {
      (el as HTMLElement).scrollIntoView();
      (el as HTMLElement).click();
    });
    await this._page.waitForTimeout(Constants.DefaultTimeout);
  }

  public async sendMessageWithAttachmentForChatSDK(
    message: string,
    attachments: string | Array<string> = [
      "FileResources//LiveChatAttachment.txt",
    ],
    language = "en"
  ) {
    await this.waitForDomContentLoaded();
    await this.waitUntilSelectorIsVisible(IFrameConstants.IframeCC);
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    await this.waitForDomContentLoaded();
    const textarea = await iframe.waitForSelector(
      AgentChatConstants.MessageTextArea
    );
    await textarea.fill(message);
    await iframe.setInputFiles(
      AgentChatConstants.LiveChatSDKUploadFile,
      attachments
    );
    await this.waitForDomContentLoaded();
    await iframe.$eval(AgentChatConstants.SendMessageButton, (el) => {
      (el as HTMLElement).scrollIntoView();
      (el as HTMLElement).click();
    });
  }

  public async sendMessageWithEmptyFileAsAttachment(
    message: string,
    language = "en"
  ) {
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    const textarea = await iframe.waitForSelector(
      AgentChatConstants.MessageTextArea
    );
    await textarea.fill(message);
    await iframe.$eval(AgentChatConstants.SendMessageButton, (el) =>
      (el as HTMLElement).click()
    );
    await iframe.setInputFiles(
      AgentChatConstants.LiveChatUploadFile,
      AgentChatConstants.EmptyFileAttachment
    );
  }

  public async verifyAttachmentMessagesCount(
    expected: number,
    timeout = 10000
  ) {
    const iFrame: Page = await this.getConvCtrl();
    await iFrame.waitForFunction(
      (expectedCount) =>
        document.querySelectorAll("div.cc-web-chat-attachment").length ===
        expectedCount,
      expected,
      { timeout }
    );
  }

  public async validateSystemEmptyFileErrorMessage() {
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );

    const systemMessage = await iframe.waitForSelector(
      AgentChatConstants.EmptyFileAttachmentErrorMessage
    );
    const entityItemText = await systemMessage.textContent();

    if (
      entityItemText.search(
        AgentChatConstants.ExpectedEmptyFileAttachmentErrorMessage
      ) != -1
    ) {
      return true;
    }
  }

  public async validateChatTitle(expectedTitle: string) {
    await this.waitForDomContentLoaded();
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.ChatTitle,
      Constants.Three,
      this._page,
      Constants.MaxTimeout
    );
    const title = await this.Page.waitForSelector(
      AgentChatConstants.ChatTitleSelector
    );
    const question1 = await (await title.getProperty("alt")).jsonValue();
    if (question1.startsWith(expectedTitle)) {
      return true;
    }
    return false;
  }

  public async closeOCAgentChat() {
    const iframeCC = await IFrameHelper.GetIframe(
      this._page,
      IFrameConstants.IframeCC
    );
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.RemoveConversationButtonClass
    );
    await this._page.$eval(
      AgentChatConstants.RemoveConversationButtonClass,
      (el) => (el as HTMLElement).click()
    );
    await this.waitUntilSelectorIsVisible(AgentChatConstants.ConfirmButtonId);
    await this._page.$eval(AgentChatConstants.ConfirmButtonId, (el) =>
      (el as HTMLElement).click()
    );
    await this._page.waitForTimeout(
      AgentChatConstants.ConversationWrapUpTimeout
    ); //Included this wait condition to wait for chat conversation wrapup business process to complete in background, will remove it later by adding wait condition with some linked selector.
  }

  public async VerifyCustomerNameInsummaryForm() {
    await this.waitForDomContentLoaded();
    const customerNameselector = await this.Page.waitForSelector(
      AgentConversationPageConstants.CustomerName
    );
    const customerName = await customerNameselector.textContent();

    const customerSummaryNameselector = await this.Page.waitForSelector(
      AgentConversationPageConstants.CustomerNameSummary
    );
    const customerSummaryName = await customerSummaryNameselector.textContent();
    expect(customerName).toBe(customerSummaryName);
    console.log("Contact name verification Successful");
  }

  public async HomeSession() {
    const homeButton = await this.Page.waitForSelector(
      AgentChatConstants.HomeButton
    );
    await homeButton.click();
    await this.waitForDomContentLoaded();
  }

  public async activeSessionCheck(OngoingChatSessionSelector: string) {
    const sessionButton = await this.Page.waitForSelector(
      OngoingChatSessionSelector
    );
    const sessionButtonText = await sessionButton.textContent();
    expect(sessionButtonText).toBeTruthy();
  }

  public async closeConversation() {
    const iframeCC = await IFrameHelper.GetIframe(
      this._page,
      IFrameConstants.IframeCC
    );
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.EndConversationButtonXPath,
      AgentChatConstants.Three,
      iframeCC
    );
    await iframeCC.$eval(
      AgentConversationPageConstants.EndConversationButtonXPath,
      (el) => (el as HTMLElement).click()
    );
    await iframeCC.waitForSelector(
      AgentConversationPageConstants.EndConversationButtonDisabledXPath
    );
    await this._page.$eval(
      AgentConversationPageConstants.RemoveConversationButtonClass,
      (el) => (el as HTMLElement).click()
    );
    await this._page.waitForSelector(
      AgentConversationPageConstants.ConfirmButtonId
    );
    await this._page.$eval(
      AgentConversationPageConstants.ConfirmButtonId,
      (el) => (el as HTMLElement).click()
    );
  }

  public async checkAutomaticClosureChat() {
    await this.Page.waitForTimeout(Constants.WaitingOneMinute);
    try {
      await this.sendMessage(AgentChatConstants.AgentMessage);
      return true;
    } catch {
      return false;
    }
  }

  public async createNotes() {
    var flag = false;
    let newContact;
    try {
      await this.Page.waitForTimeout(Constants.DefaultTimeout);
      newContact = await this.Page.waitForSelector(
        AgentChatConstants.CreateNewContact
      );
      flag = true;
    } catch {
      flag = false;
    }
    if (flag) {
      await newContact.click();
      const contactName = await this.Page.waitForSelector(
        AgentChatConstants.ContactName
      );
      const name = `${this.ContactData.ContactName}_${new Date().getTime()}`;
      await contactName.fill(name);
      const lastName = await this.Page.waitForSelector(
        AgentChatConstants.ContactLastName
      );
      await lastName.fill(this.ContactData.ContactLastName);
      const saveButton = await this.Page.waitForSelector(
        SelectorConstants.FormSaveAndCloseButton
      );
      await saveButton.click();
      await this.waitForSaveComplete();
      await this.waitUntilSelectorIsVisible(`label[title*=${name}]`);
    }
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    await iframe.waitForSelector(HTMLConstants.BUTTON_ROW_FOOTER);
    await iframe.dispatchEvent(HTMLConstants.MORE_ID, "click");
    await iframe.waitForSelector(HTMLConstants.MORE_MENU_ITEMS_POPUP);
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.MakeNotesButton,
      AgentChatConstants.Five,
      iframe,
      Constants.DefaultTimeout
    );
    await iframe.$eval(AgentChatConstants.MakeNotesButton, (el) => {
      (el as HTMLElement).click();
    });
    const iframeNotesPanel: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeWidgetValue
    );
    await iframeNotesPanel.waitForSelector(
      AgentChatConstants.AgentTextAreaNotes
    );
    await iframeNotesPanel.fill(
      AgentChatConstants.AgentTextAreaNotes,
      Constants.AgentNotesData
    );
    await iframeNotesPanel.click(AgentChatConstants.AgentNotesSaveButton);
  }

  public async createNotesWithoutLinkingRecord() {
    // delaying to wait for record link
    await this.delay(5000);
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    await iframe.waitForSelector(HTMLConstants.BUTTON_ROW_FOOTER);
    await iframe.dispatchEvent(HTMLConstants.MORE_ID, "click");
    await iframe.waitForSelector(HTMLConstants.MORE_MENU_ITEMS_POPUP);
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.MakeNotesButton,
      AgentChatConstants.Five,
      iframe,
      Constants.DefaultTimeout
    );
    await iframe.$eval(AgentChatConstants.MakeNotesButton, (el) => {
      (el as HTMLElement).click();
    });
    const iframeNotesPanel: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeWidgetValue
    );
    await iframeNotesPanel.waitForSelector(
      AgentChatConstants.AgentTextAreaNotes
    );
    await iframeNotesPanel.fill(
      AgentChatConstants.AgentTextAreaNotes,
      Constants.AgentNotesData
    );
    await iframeNotesPanel.click(AgentChatConstants.AgentNotesSaveButton);
  }

  public async verifyTimeLineSectionIsPresent() {
    try {
      await this._page.waitForSelector(
        SelectorConstants.TimeLineSectionSelector,
        { timeout: Number(Constants.DefaultTimeout) }
      );
      return true;
    } catch {
      return false;
    }
  }

  public async verifyConversationSummaryViewSectionIsPresent() {
    try {
      await this._page.waitForSelector(
        SelectorConstants.ConversationSummaryViewSectionSelector,
        { timeout: Number(Constants.DefaultTimeout) }
      );
      return true;
    } catch {
      return false;
    }
  }

  public async verifyConversationSummaryCreateCasePresent() {
    try {
      const caseCreateBtn = await this.waitUntilSelectorIsVisible(
        SelectorConstants.CaseCreatBtnSelector,
        Constants.Two,
        null,
        Constants.MaxTimeout
      );
      return caseCreateBtn;
    } catch {
      return false;
    }
  }

  public async verifyLinkedRecords(selectedEntity) {
    try {
      const option = await this._page.innerText(SelectorConstants.SelectedLinkedRecordSelector);
      return option == selectedEntity;
    } catch (err) {
      return false;
    }
  }

  public async verifyConversationSummaryAllLabels() {
    try {
      const searchPerson = await this.waitUntilSelectorIsVisible(
        SelectorConstants.SearchPerson,
        Constants.Two,
        null,
        Constants.MaxTimeout
      );
      const searchProblem = await this.waitUntilSelectorIsVisible(
        SelectorConstants.SearchProblem,
        Constants.Two,
        null,
        Constants.MaxTimeout
      );
      const newStatement = await this.waitUntilSelectorIsVisible(
        SelectorConstants.NewStatement,
        Constants.Two,
        null,
        Constants.MaxTimeout
      );
      const newTicket = await this.waitUntilSelectorIsVisible(
        SelectorConstants.NewTicket,
        Constants.Two,
        null,
        Constants.MaxTimeout
      );
      const newConnect = await this.waitUntilSelectorIsVisible(
        SelectorConstants.NewConnect,
        Constants.Two,
        null,
        Constants.MaxTimeout
      );
      return searchPerson && searchProblem && newConnect && newTicket && newStatement;
    } catch {
      return false;
    }
  }

  public async verifyConversationSummaryCreateAccountPresent() {
    try {
      const accountCreateBtn = await this._page.waitForSelector(
        SelectorConstants.AccountCreateBtnSelector,
      );
      return accountCreateBtn;
    } catch {
      return false;
    }
  }

  public async verifyConversationSummaryCreateContactPresent() {
    try {
      const contactCreateBtn = await this._page.waitForSelector(
        SelectorConstants.ContactCreateBtnSelector,
      );
      return contactCreateBtn;
    } catch {
      return false;
    }
  }

  public async verifySelfServiceTabIsPresent() {
    try {
      await this._page.waitForSelector(
        AgentConversationPageConstants.SelfServiceTabButtonSelector,
        { timeout: Number(Constants.DefaultTimeout) }
      );
      return true;
    } catch {
      return false;
    }
  }

  public async verifyProductivityToolSidePanelIsPresent() {
    try {
      await this._page.waitForSelector(
        SelectorConstants.ProductivityToolSidePanelSelector,
        { timeout: Number(Constants.DefaultTimeout) }
      );
      return true;
    } catch {
      return false;
    }
  }

  public async verifyRIWorking() {
    let isAccountAvailable: boolean = false;
    await this._page.hover(AgentChatConstants.SearchAccountInputSelector);
    //This try-catch block will help to identify whether any account name is present for this facebook account. If yes then first unlink that account name, create a new account record and link it with this.
    try {
      // re-hover to avoid page scroll impact
      await this._page.hover(AgentChatConstants.SearchAccountInputSelector);
      await this._page.waitForSelector(
        AgentChatConstants.RemoveAccountlookUpSelector,
        { timeout: Number(Constants.DefaultTimeout) }
      );
      return true;
    } catch {
      return false;
    }
  }

  public async createAccount() {
    let isAccountAvailable: boolean = false;
    const customerInputSelectorVisible = await this.waitUntilSelectorIsVisible(
      AgentChatConstants.SearchCustomerInputSelector,
      Constants.Two,
      this._page,
      Constants.MaxTimeout
    );
    if (customerInputSelectorVisible) {
      await this._page.hover(AgentChatConstants.SearchCustomerInputSelector);
      await this._page.focus(AgentChatConstants.SearchCustomerInputSelector);

      isAccountAvailable = await this.waitUntilSelectorIsVisible(
        AgentChatConstants.RemoveAccountlookUpSelector
      );
    } else {
      isAccountAvailable = !(await this.waitUntilSelectorIsVisible(
        AgentChatConstants.NewAccountButtonSelector,
        Constants.One,
        this._page,
        Constants.MaxTimeout
      ));
    }

    if (isAccountAvailable) {
      await this._page.click(AgentChatConstants.RemoveAccountlookUpSelector);
      await this.waitUntilSelectorIsVisible(
        AgentChatConstants.NewAccountButtonSelector
      );
      await this._page.click(AgentChatConstants.NewAccountButtonSelector);
    } else {
      await this._page.click(AgentChatConstants.NewAccountButtonSelector);
    }
    const accountName = `${this.AccountData.AccountName
      }_${new Date().getTime()}`;
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.AccountNameSelector
    );
    await this._page.fill(AgentChatConstants.AccountNameSelector, accountName);
    await this.Page.waitForSelector(SelectorConstants.FormSaveButton);
    await this._page.hover(SelectorConstants.FormSaveButton);
    await this.Page.click(SelectorConstants.FormSaveButton);
    await this.Page.click(SelectorConstants.FormSaveAndCloseButton);
    await this.waitForSaveComplete();
  }

  public async linkAccountToConversation(accountName: string) {
    await this.waitForDomContentLoaded();
    await this._page.hover(AgentChatConstants.SearchAccountInputSelector);

    // Remove existing binding
    if (
      await this.waitUntilSelectorIsVisible(
        AgentChatConstants.RemoveAccountlookUpSelector
      )
    ) {
      await this._page.click(AgentChatConstants.RemoveAccountlookUpSelector);
    }

    await this._page.click(AgentChatConstants.SearchAccountIcon);
    await this._page.fill(
      AgentChatConstants.SearchAccountInputSelector,
      accountName
    );
    await this.waitForDomContentLoaded();

    // If Account doesn't exists create new, else select it
    if (await this.waitUntilSelectorIsVisible(AgentChatConstants.NoRecord)) {
      await this._page.click(AgentChatConstants.NewAccountButtonSelector);
      const nameInput = await this._page.waitForSelector(
        AgentChatConstants.AccountNameSelector
      );
      await nameInput.fill(accountName);
      await this.Page.click(SelectorConstants.FormSaveButton);
      await this.waitForSaveComplete();
      await this.waitForDomContentLoaded();
    } else {
      await this._page.click(Constants.SearchAccountResultDropdown);
    }
  }

  public async validateTimeline() {
    const timeLineElement = await this.Page.waitForSelector(
      AgentChatConstants.TimeLineHeaderSelector
    );
    const timeLineElementValue = await timeLineElement.textContent();
    return timeLineElementValue === AgentChatConstants.TimeLineHeaderName;
  }

  public async endConversation(waitForEndButtonDisabled: boolean = true) {
    const iframeCC = await IFrameHelper.GetIframe(
      this._page,
      IFrameConstants.IframeCC
    );
    await this.waitUntilSelectorIsVisible(
      AgentConversationPageConstants.EndConversationButtonXPath
    );
    await iframeCC.$eval(
      AgentConversationPageConstants.EndConversationButtonXPath,
      (el) => (el as HTMLElement).click()
    );
    if (waitForEndButtonDisabled) {
      const timeout: number = Constants.TenThousand;
      await iframeCC.waitForSelector(
        AgentConversationPageConstants.EndConversationButtonDisabledXPath,
        { timeout }
      );
    }
  }

  public async getElementFromIframe(
    selector: string,
    timeout: number = 3000
  ): Promise<null | ElementHandle> {
    const iframeCC = await IFrameHelper.GetIframe(
      this._page,
      IFrameConstants.IframeCC
    );
    await this.waitUntilSelectorIsVisible(
      selector,
      Constants.Three,
      null,
      Constants.MaxTimeout
    );
    return await iframeCC
      .waitForSelector(selector, { timeout })
      .catch(() => null);
  }

  public async isAudioPlayable(timeout: number = 10000): Promise<boolean> {
    const iframeCC = await IFrameHelper.GetIframe(
      this._page,
      IFrameConstants.IframeCC
    );
    return await super.isAudioPlayable(timeout, iframeCC);
  }

  public async isVideoPlayable(timeout: number = 10000): Promise<boolean> {
    const iframeCC = await IFrameHelper.GetIframe(
      this._page,
      IFrameConstants.IframeCC
    );
    return await super.isVideoPlayable(timeout, iframeCC);
  }

  public async validateChatIsPicked() {
    await this.Page.waitForSelector(
      AgentChatConstants.OpenWorkItemOptionsClick
    );
    await this.Page.click(AgentChatConstants.OpenWorkItemOptionsClick);
    await this.Page.waitForSelector(AgentChatConstants.AssignToMe);
    await this.Page.click(AgentChatConstants.AssignToMe);
    const popUpAccepted = await this.waitUntilSelectorIsVisible(
      AgentChatConstants.PopUpChatPicked,
      5
    );
    return popUpAccepted;
  }

  public async validateChannelConversationIcon(channelIconIndicator: string) {
    const ccFrame = await this.getConvCtrl();
    expect(
      await this.waitUntilSelectorIsVisible(
        AgentChatConstants.ChannelConversationIconSelector.replace(
          "{0}",
          channelIconIndicator
        ),
        Constants.Three,
        ccFrame,
        Constants.MaxTimeout
      )
    ).toBeTruthy();
  }

  public async contactExistence() {
    var existingRecordFlag = false;
    existingRecordFlag = await this.waitUntilSelectorIsVisible(
      AgentChatConstants.SearchCustomerInputSelector,
      Constants.Three,
      null,
      Constants.MaxTimeout
    );
    if (!existingRecordFlag) {
      await this.createNewContact();
    }
    return existingRecordFlag;
  }

  public async createNewContact() {
    await this.Page.click(AgentChatConstants.CreateNewContact);
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.ContactName,
      Constants.Three,
      null,
      Constants.MaxTimeout
    );
    const contactName = await this.Page.waitForSelector(
      AgentChatConstants.ContactName
    );
    await contactName.fill(this.contactRecordName);
    const lastName = await this.Page.waitForSelector(
      AgentChatConstants.ContactLastName
    );
    await lastName.fill(this.ContactData.ContactLastName);
    const saveButton = await this.Page.waitForSelector(
      SelectorConstants.FormSaveAndCloseButton
    );
    await saveButton.click();
    await this.waitForSaveComplete();
    await this.waitUntilSelectorIsVisible(
      `label[title*=${this.contactRecordName}]`
    );
  }

  public async endChatAndSessionAgentConversation(Exists) {
    if (!Exists) {
      const iframeCC = await IFrameHelper.GetIframe(
        this._page,
        IFrameConstants.IframeCC
      );
      await this.waitUntilSelectorIsVisible(
        AgentChatConstants.EndConversationButtonXPath,
        AgentChatConstants.Three,
        iframeCC
      );
      await iframeCC.$eval(
        AgentChatConstants.EndConversationButtonXPath,
        (el) => (el as HTMLElement).click()
      );
      await this._page.$eval(
        AgentChatConstants.RemoveConversationButtonClass,
        (el) => (el as HTMLElement).click()
      );
      await this.waitUntilSelectorIsVisible(AgentChatConstants.ConfirmButtonId);
      await this._page.$eval(AgentChatConstants.ConfirmButtonId, (el) =>
        (el as HTMLElement).click()
      );
    }
  }

  public async closeActiveSessionsWithChats() {
    await this.goToHome();

    while (
      (await this.Page.$$(AgentChatConstants.OpenedActiveChat)).length > 0
    ) {
      await this.clickActiveChat();
      await this.closeOCAgentChatConversation();
    }
  }

  public async acceptChatNotification(Exists) {
    if (!Exists) {
      await this.acceptInvitationToChat();
    }
  }

  public async socialProfileValidation() {
    var isContactBtnAvailable = await this.waitUntilSelectorIsVisible(
      AgentChatConstants.ClickAvailableContact,
      Constants.Five,
      this._page,
      Constants.DefaultTimeout
    );
    if (!isContactBtnAvailable) {
      await this.waitUntilSelectorIsVisible(
        AgentChatConstants.CustomerLanguageInput,
        Constants.Five,
        this._page,
        Constants.DefaultTimeout
      );
      await this._page.hover(AgentChatConstants.CustomerLanguageInput);
      await this._page.focus(AgentChatConstants.CustomerLanguageInput);
      const contactInput = await this.Page.waitForSelector(
        AgentChatConstants.CustomerLanguageInput
      );
      await contactInput.fill(this.contactRecordName);
      await this.Page.click(AgentChatConstants.CustomerLanguageSearch);
      await this.waitUntilSelectorIsVisible(
        AgentChatConstants.CustomerLanguageLookupValue.replace(
          "{0}",
          this.contactRecordName
        ),
        Constants.Five,
        this._page,
        Constants.DefaultTimeout
      );
      await this.Page.click(
        AgentChatConstants.CustomerLanguageLookupValue.replace(
          "{0}",
          this.contactRecordName
        )
      );
    }
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.ClickonLookupSelectedValue,
      Constants.Five,
      this._page,
      Constants.DefaultTimeout
    );
    await this.Page.click(AgentChatConstants.ClickonLookupSelectedValue);
    await this.waitForDomContentLoaded();
    await this.waitUntilSelectorIsVisible(AgentChatConstants.RelatedTab);
    await this.Page.click(AgentChatConstants.RelatedTab);
    const entityListItem = await this.Page.waitForSelector(
      AgentChatConstants.SocialProfile
    );
    await entityListItem.click();
    const customerFlag = await this.waitUntilSelectorIsVisible(
      AgentChatConstants.CustomerName,
      Constants.Three,
      this._page,
      Constants.MaxTimeout
    );
    const sessionProfileTitle = await this.waitUntilSelectorIsVisible(
      AgentChatConstants.SocialProfileTitleSelector,
      Constants.Three,
      this._page,
      Constants.MaxTimeout
    );
    if (customerFlag) {
      const customer = await this.Page.waitForSelector(
        AgentChatConstants.CustomerName
      );
      const customerName = await customer.textContent();
      const sessionTitle = await this.waitUntilSelectorIsVisible(
        AgentChatConstants.SocialProfileCustomerTitleSelector.replace(
          "{0}",
          customerName
        ),
        Constants.Three,
        this._page,
        Constants.MaxTimeout
      );
      const sessionProfileTitle = await this.waitUntilSelectorIsVisible(
        AgentChatConstants.SocialProfileTitleSelector,
        Constants.Three,
        this._page,
        Constants.MaxTimeout
      );
      return sessionTitle || sessionProfileTitle;
    } else if (sessionProfileTitle) {
      return true;
    } else {
      return false;
    }
  }

  public async waitForSmartAssist() {
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.WaitForAgentGuidence
    );
    await this.Page.waitForTimeout(Constants.DefaultTimeout);
  }

  /// </summary>
  /// This method is used for test case 1711809 where when first agent transfer its chat chat to other queue, end chat button will be disabled.
  /// </summary>
  public async refreshAllAfterSessionClose() {
    await this.waitUntilSelectorIsVisible(AgentChatConstants.RefreshAllTab);
    const refreshAll = await this.Page.waitForSelector(
      AgentChatConstants.RefreshAllTab
    );
    await refreshAll.click();
  }

  public async validateRelevanceSearch() {
    const search = await this.Page.waitForSelector(
      AgentChatConstants.SearchButton
    );
    await search.click();
    await this.waitForDomContentLoaded();
    const searchValue = await this.Page.waitForSelector(
      AgentChatConstants.SearchValue
    );
    await searchValue.fill("*");
    const searchButton = await this.Page.waitForSelector(
      AgentChatConstants.SearchButtonClick
    );
    await searchButton.click();
    await this.waitForDomContentLoaded();
    const collapse = await this.Page.waitForSelector(
      AgentChatConstants.CollapseData
    );
    await collapse.click();
    await this.waitForDomContentLoaded();
    const contacts = await this.waitUntilSelectorIsVisible(
      AgentChatConstants.ContactsClick
    );
    await this.Page.click(AgentChatConstants.ContactsClick);
    await this.waitForDomContentLoaded();
    const selectContact = await this.Page.waitForSelector(
      AgentChatConstants.FirstContactSelect
    );
    await selectContact.click();
    const contactTitleValue = await selectContact.innerHTML();
    const linkConversation = await this.Page.waitForSelector(
      AgentChatConstants.LinkConversation
    );
    await linkConversation.click();
    try {
      const sessionTitle = await this.Page.waitForSelector(
        `li[id*=sessionContainer]>span[title='${contactTitleValue}']`
      );
      return true;
    } catch {
      return false;
    }
  }
  public async validateNotification(expectedTitle: string) {
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.PopupNotificationDeclineButton,
      AgentChatConstants.Two,
      this._page,
      AgentChatConstants.AgentPopUpWaitingTimeout
    );
    const title = await this.Page.waitForSelector(
      AgentChatConstants.PopupNotificationDeclineButton
    );
    const currentTitle = await title.innerText();
    return currentTitle === expectedTitle;
  }

  public async validateSession(expectedtitle: string) {
    await this.waitForDomContentLoaded();
    const title = await this.Page.waitForSelector(
      AgentChatConstants.ChatTitleSelector
    );
    const question1 = await (await title.getProperty("alt")).jsonValue();
    if (question1.startsWith(expectedtitle)) {
      return true;
    }
    return false;
  }

  public async validateSessionWhatsApp() {
    await this.waitForDomContentLoaded();
    const title = await this.Page.waitForSelector(AgentChatConstants.ChatTitle);
    const result = await title.innerText();
    return result;
  }

  public async verifySessionsCount(expected: number) {
    await this.Page.waitForFunction(
      (params) =>
        document.querySelectorAll(params.selector).length === params.expected,
      { expected, selector: AgentChatConstants.OpenedActiveChat as string },
      { timeout: 5000 }
    );
  }

  public async clickVoiceandVideoCall() {
    const iframeCC = await IFrameHelper.GetIframe(
      this._page,
      IFrameConstants.IframeCC
    );
    await iframeCC.$eval(AgentConversationPageConstants.EscalateCall, (el) =>
      (el as HTMLElement).click()
    );
    await iframeCC.$eval(AgentConversationPageConstants.VoiceCallClick, (el) =>
      (el as HTMLElement).click()
    );
    await this.Page.waitForTimeout(Constants.DefaultMinTimeout);
  }

  public async escalateAudioVideoOptions() {
    const iframeCC = await IFrameHelper.GetIframe(
      this._page,
      IFrameConstants.IframeCC
    );
    await iframeCC.$eval(AgentConversationPageConstants.EscalateCall, (el) =>
      (el as HTMLElement).click()
    );
    await iframeCC.waitForSelector(
      AgentConversationPageConstants.VoiceCallClick
    );
  }

  public async validateBotMessage() {
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    const messageSelector = await (
      await iframe.waitForSelector(
        AgentConversationPageConstants.BotMessage.replace(
          "{0}",
          this.BotMessage.BotMessgaeText
        )
      )
    ).textContent();
    return !isNullOrUndefined(messageSelector);
    await this.Page.waitForTimeout(Constants.DefaultTimeout);
  }

  public async verifyTooltipsforVoice() {
    const iframeCC = await IFrameHelper.GetIframe(
      this._page,
      IFrameConstants.IframeCC
    );
    const voiceCall = await iframeCC.waitForSelector(
      AgentConversationPageConstants.VoiceCallClick
    );
    const voiceCallhover = await iframeCC.evaluate(
      (x) => x.getAttribute("aria-label"),
      voiceCall
    );
    return this.Tooltips.VoiceCall == voiceCallhover;
  }

  public async verifyTooltipsforVideo() {
    const iframeCC = await IFrameHelper.GetIframe(
      this._page,
      IFrameConstants.IframeCC
    );
    const videoCall = await iframeCC.waitForSelector(
      AgentConversationPageConstants.VideoCallClick
    );
    const videoCallhover = await videoCall.evaluate(
      (x) => x.getAttribute("aria-label"),
      videoCall
    );
    return this.Tooltips.VideoCall == videoCallhover;
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

  public async gotToChat(chatName: string) {
    const chatButton = await this.Page.waitForSelector(
      Constants.ChatSelector.replace("{0}", chatName)
    );
    await chatButton.click();
    await this.waitForDomContentLoaded();
  }

  public async validateCountOfUnreadMessages(Count) {
    try {
      if (Count < 10) {
        await this.waitUntilSelectorIsVisible(
          `img[src*='middle%22%20fill%3D%22%23FFF%22%3E${Count}%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E']`
        );
      } else {
        await this.waitUntilSelectorIsVisible(AgentChatConstants.PlusSymbol);
      }
      return true;
    } catch {
      return false;
    }
  }

  public async clickActiveChat() {
    const activeChat = await this.Page.waitForSelector(
      AgentChatConstants.OpenedActiveChat
    );
    await activeChat.click();
  }

  public async validateUnreadMessagesSessionNotification(
    expectedCount: number,
    sessionName?: string
  ) {
    let chatSelector;
    if (!sessionName) chatSelector = AgentChatConstants.OpenedActiveChat;
    else
      chatSelector = AgentChatConstants.OpenedActiveChatByName.replace(
        "{0}",
        sessionName
      );

    await this.Page.waitForFunction(
      (params) => {
        const sessionImgEl = document.querySelector(params.sessionImgSelector);
        if (!sessionImgEl) {
          return false;
        }

        const bluecolor = "#006dd1";
        const imageSrcString = sessionImgEl.getAttribute("src");
        const svgEncoded = imageSrcString.split(",")[1]; // Take only svg markup
        const svgDecoded = decodeURIComponent(svgEncoded);

        const wrapperElement = document.createElement("span");
        wrapperElement.innerHTML = svgDecoded;
        const unreadValue = wrapperElement.querySelector("#unread-value");
        const unreadCircle = wrapperElement.querySelector("#unread-circle");
        if (unreadValue) {
          return (
            +unreadValue.textContent === params.expectedCount &&
            unreadCircle.getAttribute("fill") === bluecolor
          );
        }

        return params.expectedCount === 0;
      },
      {
        expectedCount,
        sessionImgSelector: chatSelector as string,
      },
      { timeout: 5000 }
    );
  }

  public async validateAgentChatDataMasking(expectedData: string) {
    await this.waitForDomContentLoaded();
    await this.Page.waitForTimeout(Constants.DefaultMinTimeout);
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.AgentChatDataMasking,
      AgentChatConstants.Three,
      iframe
    );
    await iframe.waitForSelector(AgentChatConstants.AgentChatDataMasking, {
      state: "visible",
    });
    const twitterSiteMap = await iframe.$eval(
      AgentChatConstants.AgentChatDataMasking,
      (el) => (el as HTMLElement).innerHTML.trim()
    );
    return twitterSiteMap === expectedData;
  }

  public async clickQuickReplies() {
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    await iframe.waitForSelector(AgentChatConstants.QuickReplies);
    await iframe.$eval(AgentChatConstants.QuickReplies, (el) => {
      (el as HTMLElement).click();
    });
    await iframe.waitForSelector(AgentChatConstants.QuickRepliesItem);
    await iframe.$eval(AgentChatConstants.QuickRepliesItem, (el) => {
      (el as HTMLElement).click();
      (el as HTMLElement).click();
    });
    await iframe.waitForSelector(AgentChatConstants.SendMessageButton);
    await iframe.$eval(AgentChatConstants.SendMessageButton, (el) => {
      (el as HTMLElement).click();
    });
  }

  public async clickKnowledgeArticles() {
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    await iframe.waitForSelector(AgentChatConstants.SeeMore);
    await iframe.$eval(AgentChatConstants.SeeMore, (el) => {
      (el as HTMLElement).click();
    });
    await iframe.waitForSelector(AgentChatConstants.KnowledgeArticles);
    await iframe.$eval(AgentChatConstants.KnowledgeArticles, (el) => {
      (el as HTMLElement).click();
    });
  }

  public async searchKBArticles() {
    await this.Page.waitForTimeout(Constants.DefaultMinTimeout);
    const iframe: Page = await IFrameHelper.GetIframe(this.Page, "main.htm");

    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.SearchBox,
      AgentChatConstants.Three,
      iframe
    );
    await iframe.fill(
      AgentChatConstants.SearchBox,
      AgentChatConstants.KBArticleQuery
    );
    await iframe.press(
      AgentChatConstants.SearchBox,
      AgentChatConstants.KeyEnter
    );
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.SendArticle,
      AgentChatConstants.Three,
      iframe
    );
    await iframe.click(AgentChatConstants.SendArticle);
    const messageFrame: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    await messageFrame.$eval(AgentChatConstants.SendMessageButton, (el) => {
      (el as HTMLElement).scrollIntoView();
      (el as HTMLElement).click();
    });
  }

  public async validateSentiment() {
    const iframeCC = await IFrameHelper.GetIframe(
      this._page,
      IFrameConstants.IframeCC
    );
    const title = await iframeCC.waitForSelector(
      AgentChatConstants.ChatSentiment
    );
    const result = await title.innerText();
    return result;
  }

  public async GetSentimentImageTitle() {
    let frame = await IFrameHelper.GetIframe(
      this._page,
      IFrameConstants.IframeCC
    );
    const li = await frame
      .waitForSelector(AgentConversationPageConstants.HeaderSentiment)
      .catch(() => {
        throw new Error(
          `Can't verify that ConversationControl window contains Sentiment status at the header.`
        );
      });
    const liTitle = await li.textContent();
    return liTitle;
  }

  public async validateSkills() {
    const message = AgentChatConstants.TwitterSkill;
    await this.waitForDomContentLoaded();
    const title = await this.Page.waitForSelector(
      AgentChatConstants.ValidateSkills
    );
    const currentName = (await title.textContent()).toString();
    return message == currentName;
  }

  public async validateAgentSkills(skill: string) {
    const message = skill;
    await this.waitForDomContentLoaded();
    const title = await this.Page.waitForSelector(
      AgentChatConstants.ValidateSkills
    );
    const currentName = (await title.textContent()).toString();
    return message === currentName;
  }

  public async validateAgentQueueName(queueName: string) {
    const checkQueueName = queueName;
    await this.waitForDomContentLoaded();
    const title = await this.Page.waitForSelector(
      AgentChatConstants.ValidateQueueName
    );
    const currentQueueName = (await title.textContent()).toString();
    return checkQueueName === currentQueueName;
  }

  public async ongoingDashBoard(queue: string = "") {
    await this.Page.click(SelectorConstants.AgentDashboardTab);
    const ongoingDashboard = await this.Page.waitForSelector(
      SelectorConstants.OngoingTabConversationSelector
    );
    await ongoingDashboard.click({ timeout: TimeoutConstants.Minute });

    if (queue) {
      const queueFilterCheckBox = await this.Page.waitForSelector(
        Constants.OngoingDashboardFilterByQueue.replace("{queue}", queue)
      );
      await queueFilterCheckBox.click();

      const activateFilterButton = await this.Page.waitForSelector(
        AgentChatConstants.ActivateFilterButton
      );
      await activateFilterButton.click();
    }
  }

  public async VerifyOngoingDashBoardDefaultQueue() {
    try {
      await this.Page.click(SelectorConstants.AgentDashboardTab);
      const ongoingDashboardDefaultQueue = await this.Page.waitForSelector(
        AgentChatConstants.OngoingDashboardDefaultQueue
      );
      const queName = ongoingDashboardDefaultQueue.textContent();
      await expect((await queName).includes(AgentChatConstants.DefaultMessagingQueue)).toBeTruthy();
      return true;
    }
    catch (error) {
      return false;
    }
  }

  public async isChatInStatus(subject: string, status: string) {
    try {
      await this.Page.waitForSelector(
        "//a[contains(@title,'" + subject + "')]"
      );
      return true;
    } catch (error) {
      return false;
    }
  }

  public async ValidateQueueFilter(queueName: string) {
    const queueFilterCheckBox = await this.Page.waitForSelector(
      Constants.ConversationGridQueueItems
    );
    const queue = await queueFilterCheckBox.evaluate(
      (x) => x.getAttribute("title"),
      queueName
    );
    return queueName == queue;
  }

  public async VerifyConversationSubject(subject: string, workstream: string) {
    expect(
      await this.Page.waitForSelector(
        AgentChatConstants.OngoingDashboardCoversationBySubject.replace(
          "{subject}",
          subject
        ).replace("{workstream}", workstream),
        { timeout: Number(Constants.PopupWaiting) }
      )
    ).toBeTruthy();
  }

  public async VerifyConversationChannel(subject: string, channel: string) {
    expect(
      await this.Page.waitForSelector(
        AgentChatConstants.OngoingDashboardCoversationByTitleAndChannel.replace(
          "{subject}",
          subject
        ).replace("{channel}", channel),
        { timeout: Number(Constants.PopupWaiting) }
      )
    ).toBeTruthy();
  }

  public async VerifyConversationStatus(subject: string, status: string) {
    await this.TryFindConversationStatus(subject, status);
    expect(
      await this.Page.waitForSelector(
        AgentChatConstants.OngoingDashboardCoversationByStatus.replace(
          "{subject}",
          subject
        ).replace("{status}", status),
        { timeout: Number(Constants.PopupWaiting) }
      )
    ).toBeTruthy();
  }

  public async TryFindConversationStatus(subject: string, status: string) {
    for (var i = 0; i < 3; i++) {
      await this.refreshDashBoard();
      await this.Page.waitForSelector(
        AgentChatConstants.OngoingDashboardCoversationByTitleAndStatus.replace(
          "{subject}",
          subject
        ).replace("{status}", status),
        { timeout: Number(Constants.MaxTimeout) }
      ).catch(() =>
        console.log("waitForSelector to find conversation status failed")
      );
    }
  }

  public async VerifyConversationSentiment(
    subject: string,
    sentiment: string,
    chatSubjectFromConvControl: string = null
  ) {
    let subjectSelector: string =
      AgentChatConstants.OngoingDashboardCoversationByTitleAndSentiment.replace(
        "{subject}",
        subject
      ).replace("{sentiment}", sentiment);
    let subjectFlag: boolean =
      await this.waitUntilItemVisibleInOngoingDashboard(
        subjectSelector,
        Constants.Two,
        null,
        Constants.FiveThousand
      );
    if (!subjectFlag && chatSubjectFromConvControl !== null) {
      subjectSelector =
        AgentChatConstants.OngoingDashboardCoversationByTitleAndSentiment.replace(
          "{subject}",
          chatSubjectFromConvControl
        ).replace("{sentiment}", sentiment);
      subjectFlag = await this.waitUntilItemVisibleInOngoingDashboard(
        subjectSelector,
        Constants.Two,
        null,
        Constants.FiveThousand
      );
    }
    expect(subjectFlag).toBeTruthy();
  }

  public async VerifyConversationCreatedDateTime(
    subject: string,
    datetime: string
  ) {
    expect(
      await this.Page.waitForSelector(
        AgentChatConstants.OngoingDashboardCoversationByTitleAndCreatedDateTime.replace(
          "{subject}",
          subject
        ).replace("{datetime}", datetime),
        { timeout: Number(Constants.PopupWaiting) }
      )
    ).toBeTruthy();
  }

  public async VerifyConversationWorkStream(
    subject: string,
    workstream: string
  ) {
    expect(
      await this.Page.waitForSelector(
        AgentChatConstants.OngoingDashboardCoversationByTitleAndWorkStream.replace(
          "{subject}",
          subject
        ).replace("{workstream}", workstream),
        { timeout: Number(Constants.PopupWaiting) }
      )
    ).toBeTruthy();
  }

  public async fetchOpenStatusRecord() {
    await this._page.click(AgentChatConstants.RefreshAllTab);
    const selectRecord = await this.Page.waitForSelector(
      SelectorConstants.GridViewFirstCell
    );
    await selectRecord.click();
  }

  public async CheckAssignButtonEnable() {
    const selectRecord = await this.Page.waitForSelector(
      PageConstants.AssignButton
    );
    return expect(selectRecord["disabled"]).toBeFalsy();
  }

  public async IsConversationOpen(subject: string) {
    await this.Page.waitForSelector(
      Constants.OngoingDashboardCoversationByTitle.replace(
        "{subject}",
        subject
      ).replace("{status}", AgentConversationPageConstants.OpenStatus)
    ).catch(() => {
      return false;
    });

    return true;
  }

  public async selectTheConversation(subject: string, status: string = "Open") {
    let conversation = await this.Page.waitForSelector(
      AgentChatConstants.OngoingDashboardCoversationByTitleAndStatus.replace(
        "{subject}",
        subject
      ).replace("{status}", status)
    );
    await conversation.click();
  }

  public async GetQueueNameOfTheSelectedConversation() {
    let queueNode = await this.Page.$eval(
      SelectorConstants.SelectedRow,
      (el) => (el as HTMLElement).innerText
    );
    const queueEl = queueNode.split("\n")[3];
    return queueEl;
  }

  public async AssignConversationToQueueInOnlineConversationTab(
    queueName: string
  ) {
    await this.waitUntilSelectorIsVisible(
      SelectorConstants.OngoingDashboardAssignButton,
      AgentChatConstants.Three,
      this.Page,
      AgentChatConstants.FourThousand
    );
    let assignbutton = await this.Page.waitForSelector(
      SelectorConstants.OngoingDashboardAssignButton
    );
    await assignbutton.click();
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.QueueTab,
      AgentChatConstants.Three,
      this._page,
      AgentChatConstants.FourThousand
    );
    await this._page.click(AgentChatConstants.QueueTab);
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.QueueSearch,
      AgentChatConstants.Three,
      this.Page,
      AgentChatConstants.FourThousand
    );
    const queueSearch = await this.Page.waitForSelector(
      AgentChatConstants.QueueSearch
    );
    await queueSearch.fill(queueName);
    await queueSearch.press("Enter");
    await this._page.click(
      SelectorConstants.AssignChatToQueue.replace("{0}", queueName)
    );
    await this._page.click(SelectorConstants.AssignBtnSelector);
  }

  public async monitorTheConversation(
    queue: string,
    chatSubjectCustomerName: string
  ) {
    await this.NavigateToOnlineConversationTab(queue);
    await this.selectTheConversation(
      chatSubjectCustomerName,
      ConversationStatesConstants.Active
    );
    let button = await this.Page.waitForSelector(
      SelectorConstants.OngoingDashboardMonitorButton
    );
    await button.click();
  }

  public async validateOngoingDashBoard() {
    const title = await this.Page.waitForSelector(
      SelectorConstants.OngoingTabConversationSelector
    );
    const result = await title.innerText();
    return result === Constants.OngoingDashboardTitle;
  }

  public async validateActiveCount() {
    await this.waitForDomContentLoaded();
    await this.waitUntilSelectorIsVisible(
      SelectorConstants.OmniChannelIntradayInsights,
      AgentChatConstants.Two,
      this.Page,
      AgentChatConstants.FiveThousandsMiliSecondsWaitTimeout
    );
    await this.Page.click(SelectorConstants.OmniChannelIntradayInsights);
    await this.waitForDomContentLoaded();
    await this.Page.click(SelectorConstants.IntradayInsightsDropDown);
    await this.Page.click(SelectorConstants.AgentInsights);
    const IFrame1 = await this.Page.$(SelectorConstants.IFrame);
    const IFrame2 = await IFrame1.contentFrame();
    const result = await IFrame2.waitForSelector(SelectorConstants.ActiveCount);
    await result.click();
    await this.Page.close();
    return result;
  }

  public async verifyConversationInAgentDashboard(customerName: string) {
    let reExResult = await this.getRegExResultForTheAgentDashboard(
      customerName
    );
    expect(reExResult).toBeTruthy();
  }

  public async getRegExResultForTheAgentDashboard(customerName: string) {
    let dateTime = new Date();
    const dateTimeRegEx =
      "(" +
      (dateTime.getMonth() + 1) +
      "\\/" +
      dateTime.getDate() +
      "\\/" +
      dateTime.getFullYear() +
      " (\\d{1,2}):\\d\\d (P|A)M)";

    const isAgentDashboardMenuItem = await this.waitUntilSelectorIsVisible(
      SelectorConstants.AgentDashboardTab,
      Constants.Three,
      this.Page,
      Constants.MaxTimeout
    );
    if (isAgentDashboardMenuItem) {
      await this.Page.click(SelectorConstants.AgentDashboardTab);
    }
    const refreshAllTabVisible = await this.waitUntilSelectorIsVisible(
      AgentChatConstants.RefreshAllTab,
      Constants.Two,
      null,
      Constants.MaxTimeout
    );
    if (refreshAllTabVisible) {
      await this.Page.click(AgentChatConstants.RefreshAllTab);
      await this.waitUntilSelectorIsVisible(
        AgentChatConstants.MyWorkItemTabSelector,
        Constants.Two,
        null,
        Constants.MaxTimeout
      );
    }

    const selector = await this.Page.waitForSelector(
      Constants.CustomerSelector.replace("{0}", customerName)
    );
    const innerText = await selector.innerText();
    return innerText;
  }

  public async VerifyConversationInOngoingConversationDashboard(
    conversationInfo: conversationInfo
  ) {
    await this.NavigateToOnlineConversationTab(conversationInfo.queue);

    if (conversationInfo.workstream)
      await this.VerifyConversationSubject(
        conversationInfo.subject,
        conversationInfo.workstream
      );
    if (conversationInfo.channel)
      await this.VerifyConversationChannel(
        conversationInfo.subject,
        conversationInfo.channel
      );
    if (conversationInfo.status)
      await this.VerifyConversationStatus(
        conversationInfo.subject,
        conversationInfo.status
      );
    if (conversationInfo.sentiment)
      await this.VerifyConversationSentiment(
        conversationInfo.subject,
        conversationInfo.sentiment
      );
    if (conversationInfo.startedDateTime)
      await this.VerifyConversationCreatedDateTime(
        conversationInfo.subject,
        conversationInfo.startedDateTime
      );
    if (conversationInfo.workstream)
      await this.VerifyConversationWorkStream(
        conversationInfo.subject,
        conversationInfo.workstream
      );
  }

  public async NavigateToOnlineConversationTab(queue: string = "") {
    const newTabSelector = await this._page.waitForSelector(
      SelectorConstants.CreateNewTabSelector
    );
    await newTabSelector.hover();
    await newTabSelector.click();
    await this._page.waitForSelector(SelectorConstants.DashboardsTabSelector);
    await this._page.click(SelectorConstants.DashboardsTabSelector);
    await this._page.waitForSelector(
      SelectorConstants.DashBoardDropDownSelector
    );
    await this._page.click(SelectorConstants.DashBoardDropDownSelector);
    await this._page.waitForSelector(
      SelectorConstants.OngoingTabConversationSelector
    );
    await this._page.click(SelectorConstants.OngoingTabConversationSelector);

    if (queue) {
      const queueFilterCheckBox = await this.Page.waitForSelector(
        SelectorConstants.OngoingDashboardFilterByQueue.replace(
          "{queue}",
          queue
        )
      );
      await queueFilterCheckBox.click();

      const activateFilterButton = await this.Page.waitForSelector(
        AgentChatConstants.ActivateFilterButton
      );
      await activateFilterButton.click();
    }
  }

  public async SelectOpenChatInOngoingDashboard() {
    await this._page.click(AgentChatConstants.RefreshAllTab);
    await this._page.waitForSelector(
      SelectorConstants.AssignOpenChatCellSelector
    );
    await this._page.click(AgentChatConstants.AssignOpenChatCellSelector);
    await this._page.click(AgentChatConstants.AssignIconSelector);
    await this._page.click(SelectorConstants.AssignOpenChatCellSelector);
  }

  public async AssignChat(agentName: string) {
    await this.waitUntilSelectorIsVisible(SelectorConstants.AssignIconSelector);
    await this._page.click(SelectorConstants.AssignIconSelector);
    await this.waitUntilSelectorIsVisible(
      SelectorConstants.AssignChatToAgent.replace("{0}", agentName),
      AgentChatConstants.Three,
      this._page,
      Constants.MaxTimeout
    );
    await this._page.waitForSelector(
      SelectorConstants.AssignChatToAgent.replace("{0}", agentName)
    );
    await this._page.click(
      SelectorConstants.AssignChatToAgent.replace("{0}", agentName)
    );
    await this._page.click(SelectorConstants.AssignBtnSelector);
  }

  public async NavigateToRelevanceSearch() {
    const url = this.Page.url();
    const advancedsettings = `${url}&flags=FCB.RelevanceSearchSpecialHandlingNoteEntity%3Dtrue`;
    await this.Page.goto(advancedsettings);
  }

  //Login email and password for LiveChat
  public async liveChatLoginDetails() {
    const email = TestSettings.LiveAccountAgentEmail;
    const pwd = TestSettings.LiveChatAccountPassword;
    await this.navigateToOrgUrlAndSignIn(email, pwd);
    await this.waitForDomContentLoaded();
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

  public async setAgentStatusToOffline() {
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.AvailabilityStatusBusyXPath,
      AgentChatConstants.Five,
      null,
      Constants.DefaultMinTimeout
    );
    await this._page.click(AgentChatConstants.AgentStatusButton);
    const selectElement = await this._page.waitForSelector(
      AgentChatConstants.SelectStatusElement
    );
    selectElement.selectOption({
      label: AgentChatConstants.Offline.toString(),
    });
    await this._page.click(AgentChatConstants.AgentStatusOkButton);
  }

  public async OpenCloseWorkItem() {
    await this.Page.click(SelectorConstants.RefreshDashBoard);
    await this.Page.waitForSelector(
      AgentChatConstants.CloseWorkItemOptionsClick
    );
    await this.Page.click(AgentChatConstants.CloseWorkItemOptionsClick);
    await this.Page.waitForSelector(AgentChatConstants.AssignCloseItemSelector);
    await this.Page.click(AgentChatConstants.AssignCloseItemSelector);
  }

  public async validateChatDownload() {
    const [download] = await Promise.all([
      this._page.waitForEvent(AgentChatConstants.Download), // wait for download to start
      this._page.waitForSelector(AgentChatConstants.DownloadChatSelector),
      this._page.click(AgentChatConstants.DownloadChatSelector),
    ]);
    // wait for download to complete
    const path = await download.path();
    return path != null && path != undefined && path != "";
  }

  public async closeSecondCustomerChatConversation() {
    await this._page.$eval(
      AgentChatConstants.SecondCustomerChatTabSelector,
      (el) => (el as HTMLElement).click()
    );
    const iframeCC = await IFrameHelper.GetIframe(
      this._page,
      IFrameConstants.IframeCC
    );
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.EndConversationButtonXPath,
      AgentChatConstants.Three,
      iframeCC
    );
    await iframeCC.$eval(AgentChatConstants.EndConversationButtonXPath, (el) =>
      (el as HTMLElement).click()
    );
    await this._page.$eval(
      AgentChatConstants.CloseConversationForSecondCustomer,
      (el) => (el as HTMLElement).click()
    );
    await this.waitUntilSelectorIsVisible(AgentChatConstants.ConfirmButtonId);
    await this._page.$eval(AgentChatConstants.ConfirmButtonId, (el) =>
      (el as HTMLElement).click()
    );
  }

  public async closeFirstCustomerChatConversation() {
    await this._page.$eval(
      AgentChatConstants.FirstCustomerChatTabSelector,
      (el) => (el as HTMLElement).click()
    );
    const iframeCC = await IFrameHelper.GetIframe(
      this._page,
      IFrameConstants.IframeCC
    );
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.EndConversationButtonXPath,
      AgentChatConstants.Three,
      iframeCC
    );
    await iframeCC.$eval(AgentChatConstants.EndConversationButtonXPath, (el) =>
      (el as HTMLElement).click()
    );
    await this._page.$eval(
      AgentChatConstants.CloseConversationForFirstCustomer,
      (el) => (el as HTMLElement).click()
    );
    await this.waitUntilSelectorIsVisible(AgentChatConstants.ConfirmButtonId);
    await this._page.$eval(AgentChatConstants.ConfirmButtonId, (el) =>
      (el as HTMLElement).click()
    );
    await this._page.waitForTimeout(
      AgentChatConstants.ConversationWrapUpTimeout
    ); //Included this wait condition to wait for chat conversation wrapup business process to complete in background, will remove it later by adding wait condition with some linked selector.
    await this._page.$eval(AgentChatConstants.RefreshAllTab, (el) =>
      (el as HTMLElement).click()
    );
  }

  public async waitForCustomerChatPresence() {
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.CustomerChatPresenceSelector
    );
  }

  public async signOut() {
    const agentInfo = await this.Page.waitForSelector(
      AgentChatConstants.AgentInformation
    );
    await agentInfo.click();
    const signOut = await this.Page.waitForSelector(
      AgentChatConstants.AgentSignOutBtnSelector
    );
    await signOut.click();
  }

  public async UserName() {
    const agentInfo = await this.Page.waitForSelector(
      AgentChatConstants.AgentInformation
    );
    await agentInfo.click();
    const userNameSelector = await this.Page.waitForSelector(
      AgentChatConstants.AgentUserNameSelector
    );
    const userName = await userNameSelector.textContent();
    await agentInfo.click();
    return userName;
  }

  public async searchAndAssignCase(caserecord: string) {
    await this._page.fill(AgentChatConstants.SearchcaseInput, caserecord);
    await this._page.click(AgentChatConstants.SearchcaseButton);
    await this._page.click(AgentChatConstants.SearchcaseValue);
  }

  public async validateToast() {
    const message = AgentChatConstants.ToastMessage;
    return await this.waitTillTextChange(
      SelectorConstants.ToastNotificationListRoot,
      message
    );
  }

  public async supervisorAssignedInvitationToChat() {
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.AcceptButtonId,
      Constants.Two,
      null,
      AgentChatConstants.AgentPopUpWaitingTimeout
    );
    const assigned = await this.Page.waitForSelector(
      AgentChatConstants.SupervisorAssignedChat
    );
    if (
      (await assigned.innerText()).toString() !==
      AgentChatConstants.AssignedBySupervisor
    )
      return false;
    await this._page.click(AgentChatConstants.AcceptButtonId);
    await this.waitForConversationControl();
    await LogChatDetails(
      this._page,
      "supervisor Assigned Invitation To Chat",
      "after accept chat"
    );
    return true;
  }

  public async AssignedInvitationToChatFailed() {
    const assigned = await this.Page.waitForSelector(
      PageConstants.AssignedFailed
    );
    return (
      (await assigned.innerText()).toString() ===
      PageConstants.AssignedFailedText
    );
  }

  public async AssignedInvitationToChatSucceed() {
    const assigned = await this.Page.waitForSelector(
      PageConstants.AssignSucceed
    );
    return (
      (await assigned.innerText()).toString() ===
      PageConstants.AssignSucceedText
    );
  }

  public async AssignChatToQueue(queueName: string) {
    await this._page.click(AgentChatConstants.RefreshAllTab);
    await this._page.waitForSelector(
      SelectorConstants.AssignOpenChatCellSelector
    );
    await this._page.click(SelectorConstants.AssignOpenChatCellSelector);
    await this._page.click(AgentChatConstants.QueueTab);
    const queueSearch = await this.Page.waitForSelector(
      AgentChatConstants.QueueSearch
    );
    await queueSearch.fill(queueName);
    await this._page.waitForSelector(
      SelectorConstants.AssignChatToQueue.replace("{0}", queueName)
    );
    await this._page.click(
      SelectorConstants.AssignChatToQueue.replace("{0}", queueName)
    );
    await this._page.click(SelectorConstants.AssignBtnSelector);
  }

  public async getConvCtrl() {
    return await IFrameHelper.GetIframe(this._page, IFrameConstants.IframeCC);
  }

  public async getSearchFrameCtrl() {
    return await IFrameHelper.GetIframe(
      this._page,
      IFrameConstants.IframeSearchFrame
    );
  }

  public async sendImageAttachmentFromAgent(filePath: string) {
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.MessageTextArea,
      AgentChatConstants.Three,
      iframe
    );
    const handle = await iframe.$(AgentChatConstants.AgentSendFileSelector);
    await handle.setInputFiles(filePath);
    await iframe.$eval(AgentChatConstants.SendMessageButton, (el) => {
      (el as HTMLElement).scrollIntoView();
      (el as HTMLElement).click();
    });
  }

  public static async initAgentForCc(page: Page) {
    let agent = new AgentChat(page);
    await agent.loginAndNavigateToAgentForLiveChatApp();
    await agent.waitForAgentStatus();
    return agent;
  }

  public static async initAgentForCcWithCredentials(
    page: Page,
    login: string,
    password: string
  ) {
    let agent = new AgentChat(page);
    agent.loginAgent(login, password);
    await agent.waitForAgentStatus();
    return agent;
  }

  public static async initAgentForTransfer(page: Page) {
    let agent = new AgentChat(page);
    await agent.loginAndNavigateToTransferAgentApp();
    await agent.waitForAgentStatus();
    return agent;
  }

  public async verifyFileUploadAtAgentScreen(selector: string) {
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    return await this.waitUntilSelectorIsVisible(
      selector,
      AgentChatConstants.Five,
      iframe,
      Constants.FourThousandsMiliSeconds
    );
  }

  public async verifyFileDownloadAtAgentEnd() {
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    const ImageSelectorFlagValue = await this.waitUntilSelectorIsVisible(
      AgentChatConstants.AgentScreenImageBoxSelector,
      AgentChatConstants.Five,
      iframe,
      Constants.FourThousandsMiliSeconds
    );
    if (ImageSelectorFlagValue) {
      const [download] = await Promise.all([
        this.Page.waitForEvent(AgentChatConstants.Download),
        iframe.$eval(AgentChatConstants.AgentScreenImageBoxSelector, (el) =>
          (el as HTMLElement).click()
        ),
      ]);
      const path = await download.path();
      return path != null && path != undefined && path != "";
    }
    return false;
  }

  public async verifyTooltipsforConversation() {
    const iframeCC = await IFrameHelper.GetIframe(
      this._page,
      IFrameConstants.IframeCC
    );
    const customMessaging = await iframeCC.waitForSelector(
      AgentConversationPageConstants.CustomConversationTooltip
    );
    const customMessaginghover = await iframeCC.evaluate(
      (x) => x.getAttribute("title"),
      customMessaging
    );
    return this.Tooltips.CustomMessage == customMessaginghover;
  }

  public async validatePVAFBBotMsg() {
    const pvaEscalateToBotMsgSelector = await this.Page.waitForSelector(
      AgentPVAConversationPageConstants.PVAEscalateToBotMsgSelector
    );
    const pvaEscalateToBotMsgSelectorValue =
      await pvaEscalateToBotMsgSelector.textContent();
    return (
      pvaEscalateToBotMsgSelectorValue ===
      AgentPVAConversationPageConstants.PVAEscalateToBotMsg
    );
  }

  public async validatePVAFBBotInternalMsg() {
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    const pvaInternalMsgSelector = await (
      await iframe.waitForSelector(
        AgentPVAConversationPageConstants.PVABotInternalMsgSelector
      )
    ).textContent();
    return (
      pvaInternalMsgSelector !== null && pvaInternalMsgSelector !== undefined
    );
  }

  public async acceptInvitationToPVAChat() {
    await this._page.click(AgentChatConstants.AcceptButtonId);
  }

  public async waitForPVAAcceptNotification() {
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.AcceptButtonId,
      2,
      null,
      AgentChatConstants.AgentPopUpWaitingTimeout
    );
  }

  public async verifyCustomerFileUploaded() {
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    return await this.waitUntilSelectorIsVisible(
      AgentChatConstants.AgentScreenImageBoxSelector,
      AgentChatConstants.Five,
      iframe,
      Constants.FourThousandsMiliSeconds
    );
  }

  public async clearOCAgentChatSession() {
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.RemoveConversationButtonClass,
      Constants.Three,
      this._page,
      Constants.FourThousandsMiliSeconds
    );
    await this._page.$eval(
      AgentChatConstants.RemoveConversationButtonClass,
      (el) => (el as HTMLElement).click()
    );
    await this.waitUntilSelectorIsVisible(AgentChatConstants.ConfirmButtonId);
    await this._page.$eval(AgentChatConstants.ConfirmButtonId, (el) =>
      (el as HTMLElement).click()
    );
    await this.RefreshAllTab();
  }

  public async verifyRecordMovedToClosedWS() {
    const closedWSRecordCountValue: number =
      await this.getClosedWorkStreamCurrentRecordCount(
        AgentChatConstants.ClosedWSRecordCountSelector
      );
    await this.waitUntilRecordMovedToClosedWorkStream(
      AgentChatConstants.ClosedWSRecordCountSelector,
      closedWSRecordCountValue,
      Constants.Six,
      Constants.OpenWsWaitTimeout
    );
  }

  public async validateAttachmentsInCloseWorkStream() {
    return await this.waitUntilSelectorIsVisible(
      AgentChatConstants.ClosedConversationFileAttachmentSelector,
      Constants.Three,
      this._page,
      Constants.FourThousandsMiliSeconds
    );
  }

  public async RefreshAllTab() {
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.RefreshAllTab,
      Constants.Two,
      this._page,
      Constants.FiveThousand
    );
    await this._page.click(AgentChatConstants.RefreshAllTab);
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.RefreshAllTab,
      Constants.Six,
      this._page,
      Constants.FiveThousand
    );
  }

  public async RefreshTabUntilSelectorAppear(
    selector: string,
    maxRefreshCount: number
  ) {
    for (let i = 0; i < maxRefreshCount; i++) {
      var isSelectorVisible = await this.waitUntilSelectorIsVisible(
        selector,
        5,
        null,
        1000
      );

      if (isSelectorVisible) {
        return await this.Page.waitForSelector(selector);
      }

      await this.RefreshAllTab();
    }

    return null;
  }

  public async CheckTabUntilElementAppear(
    selector: string,
    maxRefreshCount: number
  ) {
    for (let i = 0; i < maxRefreshCount; i++) {
      var element = await this.Page.$(selector);

      if (element != null) {
        return element;
      }

      await this.delay(1000);
    }

    return null;
  }

  public async verifyCustomerName(expected: string) {
    await this.waitForDomContentLoaded();
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    await iframe.waitForSelector(
      AgentChatConstants.AgentChatHeaderTitleSelector.replace("{0}", expected),
      { state: "visible", timeout: TimeoutConstants.Default }
    );
    const params = {
      expectedName: expected,
      selector: AgentChatConstants.ChatHeader as string,
    };
    const nameMatches = await iframe.waitForFunction(
      (params) =>
        document.querySelector(params.selector).innerHTML ===
        params.expectedName,
      params,
      { timeout: 3000 }
    );
    expect(nameMatches).toBeTruthy();
  }

  public async getConversationInfoFromAgentDashboard(
    customerName: string,
    conversation: conversationInfo = null
  ) {
    if (conversation === null) conversation = new conversationInfo();

    let regExResult = await this.getRegExResultForTheAgentDashboard(
      customerName
    );

    conversation.startedDateTime = regExResult[2];
    conversation.workstream = regExResult[1];
    conversation.status = regExResult[5];

    return conversation;
  }

  public async getConversationInfoFromChatPage(
    conversation: conversationInfo = null
  ) {
    const subject = await this.getChatSubject();
    const queue = await this.getChatQueue();
    const sentiment = await this.GetSentimentImageTitle();

    if (conversation === null) conversation = new conversationInfo();

    conversation.subject = subject;
    conversation.queue = queue;
    conversation.sentiment = sentiment;

    return conversation;
  }

  public async getChatSubject() {
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    const chatheader = await iframe.waitForSelector(
      AgentChatConstants.ChatHeader
    );
    return await chatheader.innerText();
  }

  public async getChatQueue() {
    var chatheader = await this._page.waitForSelector(
      AgentChatConstants.ChatQueue
    );
    return await chatheader.innerText();
  }

  public async isMessagesCount(expectedcount) {
    return this.isMessageTypeCount(
      expectedcount,
      AgentChatConstants.CCMessages
    );
  }
  public async isTotalMessagesCount(expectedcount) {
    return this.isMessageTypeCount(
      expectedcount,
      AgentChatConstants.TotalMessages
    );
  }
  public async isInternalMessageCount(expectedcount) {
    return this.isMessageTypeCount(
      expectedcount,
      AgentChatConstants.CCInternalMessages
    );
  }

  public async isMessageTypeCount(expectedCount, messageTypeSelector) {
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    const timeout: number = Constants.TwentyThousand;
    await this.waitUntilSelectorIsVisible(
      messageTypeSelector,
      AgentChatConstants.Two,
      iframe,
      Constants.OpenWsWaitTimeout
    );
    await iframe.waitForFunction(
      (args) => document.querySelectorAll(args[1]).length == args[0],
      [expectedCount, messageTypeSelector],
      { timeout }
    );
    return true;
  }

  public async getClosedWorkStreamCurrentRecordCount(selectorVal: string) {
    let recordCount: number = 0;
    let pageObject = this.Page;
    await this.waitUntilSelectorIsVisible(
      selectorVal,
      Constants.Six,
      pageObject,
      Constants.FiveThousand
    );
    const closedWorkStreamRecordCountSelector =
      await pageObject.waitForSelector(selectorVal);
    const closedWorkStreamRecord =
      closedWorkStreamRecordCountSelector.textContent();
    if (
      closedWorkStreamRecord !== null &&
      closedWorkStreamRecord !== undefined
    ) {
      const str = (await closedWorkStreamRecord).toString();
      if (str !== "") {
        if (!isNaN(+str)) {
          recordCount = +str;
          console.info(
            "Closed Work Item Count Selector Found In Method 'getClosedWorkStreamCurrentRecordCount' with Count: {0}".replace(
              "{0}",
              recordCount.toString()
            )
          );
        }
      }
    }
    return recordCount;
  }

  public async waitUntilRecordMovedToClosedWorkStream(
    selectorVal: string,
    oldClosedWSRecordValue: number = 0,
    maxCount: number = Constants.Five,
    timeout: number = Constants.DefaultTimeout
  ) {
    let dataCount = 0;
    let pageObject = this.Page;
    while (dataCount < maxCount) {
      try {
        await pageObject.click(AgentChatConstants.RefreshAllTab);
        const closedWorkStreamRecordCountSelector =
          await pageObject.waitForSelector(selectorVal, { timeout });
        const closedWorkStreamRecord =
          closedWorkStreamRecordCountSelector.textContent();
        if (
          closedWorkStreamRecord !== null &&
          closedWorkStreamRecord !== undefined
        ) {
          const str = (await closedWorkStreamRecord).toString();
          if (str !== "") {
            if (!isNaN(+str)) {
              const newClosedWSRecordValue: number = +str;
              if (newClosedWSRecordValue - oldClosedWSRecordValue > 0) {
                return true;
              }
            }
          }
        }
      }
      catch (error) {
        console.log(`Method waitUntilRecordMovedToClosedWorkStream throwing exception with message: ${error.message}`);
      }
      dataCount++;
      //wait time is required before every refresh attempt else all retries will complete in a blink and tests are failing
      await pageObject.waitForTimeout(timeout);
    }
    return false;
  }

  public async closeChatAndWaitForRecordMovedToWS() {
    const iframeCC = await IFrameHelper.GetIframe(
      this._page,
      IFrameConstants.IframeCC
    );
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.EndConversationButtonXPath,
      AgentChatConstants.Three,
      iframeCC,
      Constants.OpenWsWaitTimeout
    );
    await iframeCC.$eval(AgentChatConstants.EndConversationButtonXPath, (el) =>
      (el as HTMLElement).click()
    );
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.EndConversationButtonDisabledXPath,
      AgentChatConstants.Three,
      iframeCC
    );
    await this._page.$eval(
      AgentChatConstants.RemoveConversationButtonClass,
      (el) => (el as HTMLElement).click()
    );
    await this.waitUntilSelectorIsVisible(AgentChatConstants.ConfirmButtonId);
    await this._page.$eval(AgentChatConstants.ConfirmButtonId, (el) =>
      (el as HTMLElement).click()
    );
    await this.verifyRecordMovedToClosedWS();
  }

  public async agentStatus() {
    return this.waitUntilSelectorIsVisible(
      AgentChatConstants.AgentStatus,
      AgentChatConstants.Five,
      null,
      AgentChatConstants.AgentPopUpWaitingTimeout
    );
  }

  public async validateAgentDashboardTitle() {
    const dashboardTitle = await this._page.waitForSelector(
      AgentChatConstants.DashboardTitle
    );
    if (
      (await dashboardTitle.innerText()).toString() !==
      AgentChatConstants.DashboardConstant
    ) {
      return true;
    }
    return false;
  }

  public async validateExceedingAgentCapacity(agentName: string) {
    await this._page.click(AgentChatConstants.RefreshAllTab);
    await this._page.waitForSelector(
      SelectorConstants.AssignOpenChatCellSelector
    );
    await this._page.click(SelectorConstants.AssignOpenChatCellSelector);
    await this._page.click(SelectorConstants.AssignIconSelector);
    const agentSearch = await this.Page.waitForSelector(
      AgentChatConstants.QueueSearch
    );
    await agentSearch.fill(agentName);

    await this._page.waitForSelector(
      SelectorConstants.AssignChatToAgent.replace("{0}", agentName)
    );
    await this._page.click(
      SelectorConstants.AssignChatToAgent.replace("{0}", agentName)
    );
    const textCapacitySelector = await this._page.waitForSelector(
      AgentChatConstants.ExceedingCapacity
    );
    const textCapacity = await textCapacitySelector.innerText();
    if (textCapacity === AgentChatConstants.ExceedingConstant) {
      return true;
    }
    return false;
  }
  public async openChatFromMyWorkItems() {
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

  public async CustomerSummary() {
    await this._page.click(AgentConversationPageConstants.CustomerSummary);
  }
  public async CustomerSummaryText() {
    await this.waitForDomContentLoaded();
    const menuItem = await this.Page.waitForSelector(
      AgentConversationPageConstants.CustomerSummary
    );
    const Title = await menuItem.textContent();
    return Title;
  }
  public async validateAssignToMeOnlyForOpenConverstion() {
    await this.Page.waitForSelector(
      AgentChatConstants.OpenWorkItemOptionsClick
    );
    await this.Page.click(AgentChatConstants.OpenWorkItemOptionsClick);
    const openConversationAssign = await this.waitUntilSelectorIsVisible(
      AgentChatConstants.AssignToMeData
    );
    return openConversationAssign;
  }

  public async isSlashCommandFlyOutOpen(iFrame: Page) {
    return await this.waitUntilSelectorIsVisible(
      AgentChatConstants.FlyOutCcPopup,
      AgentChatConstants.Three,
      iFrame
    ).catch(() => {
      return false;
    });
  }

  public async validateNonFlyOutSlashCommands() {
    const nonFlyOutSlashCommands = ["/kb", "/p", "/i"];
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    const textarea = await iframe.waitForSelector(
      AgentChatConstants.MessageTextArea
    );
    for (const command of nonFlyOutSlashCommands) {
      await textarea.fill("");
      await textarea.fill(command);
      await textarea.press(AgentChatConstants.SpaceKeyword);
      //Validate flyOut not open
      expect(await this.isSlashCommandFlyOutOpen(iframe)).toBeFalsy();
    }
  }

  public async validateFlyOutSlashCommands() {
    const flyOutSlashCommands = ["/t", "/c", "/q", "/h"];

    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    const textarea = await iframe.waitForSelector(
      AgentChatConstants.MessageTextArea
    );

    for (const command of flyOutSlashCommands) {
      await textarea.fill("");
      await textarea.fill(command);
      //Validate flyOut not open
      expect(await this.isSlashCommandFlyOutOpen(iframe)).toBeFalsy();

      //Validate flyOut is open
      await textarea.focus();
      await textarea.press(AgentChatConstants.SpaceKeyword);
      expect(await this.isSlashCommandFlyOutOpen(iframe)).toBeTruthy();

      //Validate flyOut is close
      //remove space
      await textarea.press(AgentChatConstants.BackspaceKeyword);
      expect(await this.isSlashCommandFlyOutOpen(iframe)).toBeFalsy();
      //remove command
      await textarea.press(AgentChatConstants.BackspaceKeyword);
      //remove slash
      await textarea.press(AgentChatConstants.BackspaceKeyword);
      await textarea.fill(Constants.ContainsDataRule);
      expect(await this.isSlashCommandFlyOutOpen(iframe)).toBeFalsy();
    }
  }

  public async validateConsultToOtherAgent() {
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    this.waitForDomContentLoaded();
    await this.waitUntilSelectorIsVisible(IFrameConstants.IframeCC);
    await iframe.waitForSelector(AgentChatConstants.ConsultOtherAgent);
    await iframe.$eval(AgentChatConstants.ConsultOtherAgent, (el) => {
      (el as HTMLElement).click();
    });
    this.waitForDomContentLoaded();

    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.AgentList,
      Constants.Five,
      iframe
    );
    await iframe.waitForSelector(AgentChatConstants.AgentList);
    await iframe.$eval(AgentChatConstants.AgentList, (el) => {
      (el as HTMLElement).click();
    });
  }

  public async validateBackToPublicMessage(iframe: Page) {
    await iframe.waitForSelector(AgentChatConstants.AgentPublicButton);
    await iframe.$eval(AgentChatConstants.AgentPublicButton, (el) => {
      (el as HTMLElement).click();
    });
    return this.waitUntilSelectorIsVisible(
      AgentChatConstants.AgentPublicMessage,
      AgentChatConstants.Three,
      iframe
    );
  }

  public async gotToPublicMessaging() {
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    return this.validateBackToPublicMessage(iframe);
  }

  public async getOpenWSCurrentRecordCount(selectorVal: string) {
    let recordCount: number = 0;
    let pageObject = this.Page;
    try {
      const openWorkStreamRecordCountSelector =
        await pageObject.waitForSelector(selectorVal);
      const openWorkStreamRecord =
        openWorkStreamRecordCountSelector.textContent();
      if (openWorkStreamRecord !== null && openWorkStreamRecord !== undefined) {
        const str = (await openWorkStreamRecord).toString();
        if (str !== "") {
          if (!isNaN(+str)) {
            recordCount = +str;
          }
        }
      }
    } catch (error) {
      console.log(
        `Method getOpenWSCurrentRecordCount throwing exception with message: ${error.message}`
      );
    }
    return recordCount;
  }

  public async waitUntilNewRecordAppearsInOpenWS(
    selectorVal: string,
    oldOpenWSRecordValue: number = 0,
    maxCount: number = Constants.Three,
    timeout: number = Constants.OpenWsWaitTimeout
  ) {
    let dataCount = 0;
    let pageObject = this.Page;
    while (dataCount < maxCount) {
      try {
        await pageObject.click(AgentChatConstants.RefreshAllTab);
        const openWorkStreamRecordCountSelector =
          await pageObject.waitForSelector(selectorVal, { timeout });
        const openWorkStreamRecord =
          openWorkStreamRecordCountSelector.textContent();
        if (
          openWorkStreamRecord !== null &&
          openWorkStreamRecord !== undefined
        ) {
          const str = (await openWorkStreamRecord).toString();
          if (str !== "") {
            if (!isNaN(+str)) {
              const newOpenWSRecordValue: number = +str;
              if (newOpenWSRecordValue - oldOpenWSRecordValue > 0) {
                return true;
              }
            }
          }
        }
      } catch (error) {
        console.log(`Method waitUntilNewRecordAppearsInOpenWS throwing exception with message: ${error.message}`);
      }
      dataCount++;
    }
    return false;
  }

  public async verifyNewRecordAppearsInOpenWS(openWSRecordCountValue: number) {
    return await this.waitUntilNewRecordAppearsInOpenWS(
      AgentChatConstants.OpenWsRecordCountSelector,
      openWSRecordCountValue,
      Constants.Three,
      Constants.OpenWsWaitTimeout
    );
  }

  public async getOpenWSRecordCount() {
    return await this.getOpenWSCurrentRecordCount(
      AgentChatConstants.OpenWsRecordCountSelector
    );
  }

  public async pickOpenStateChat() {
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.OpenWorkItemOptionsClick
    );
    await this.Page.click(AgentChatConstants.OpenWorkItemOptionsClick);
    await this.waitUntilSelectorIsVisible(AgentChatConstants.AssignOpenChatBtn);
    await this.Page.click(AgentChatConstants.AssignOpenChatBtn);
    const popUpAccepted = await this.waitUntilSelectorIsVisible(
      AgentChatConstants.PopUpChatPicked
    );
    const iframeCC = await IFrameHelper.GetIframe(
      this._page,
      IFrameConstants.IframeCC
    );
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.EndConversationButtonXPath,
      Constants.Five,
      iframeCC
    );
    return popUpAccepted;
  }

  public async validateWrapUpStatus() {
    await this.navigateToAgentDashboard();
    return await this.waitUntilWorkItemStatusChanged(
      AgentChatConstants.WorkItemStatus,
      Constants.WrapUp,
      Constants.Ten,
      this._page,
      Constants.FiveThousand
    );
  }

  public async navigateToActiveOngoingChat() {
    await this.clickActiveChat();
  }

  public async navigateToOmnichannelConfigurations() {
    await this.Page.click(
      SelectorConstants.OmnichannelConfigurationTabsMenuItem
    );
  }

  public async EnableSupervisorAssignAndSave() {
    await this._page
      .waitForSelector(SelectorConstants.SupervisorAssignEnable, {
        timeout: TimeoutConstants.Minute,
      })
      .catch(async () => {
        const enableButton = await this._page.waitForSelector(
          PageConstants.SupervisorAssignDisable,
          { timeout: TimeoutConstants.Minute }
        );
        await enableButton.click();
      });
    await this.Page.click(SelectorConstants.FormSaveButton);
    await this.waitForSaveComplete();
  }

  public async VerifyAttachmentButton() {
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    expect(
      await this.waitUntilSelectorIsHidden(
        AgentChatConstants.LiveChatUploadFile
      )
    ).toBeTruthy();
  }

  public async validateEndConversationMessage(textToValidate: string) {
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    expect(
      await iframe.waitForSelector(
        AgentChatConstants.validateEndConversationMessage.replace(
          "{0}",
          textToValidate
        ),
        { timeout: TimeoutConstants.Minute }
      )
    ).toBeTruthy();
  }

  public async validateEndConversationMessageforAgent() {
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    const messageSelector = await await iframe.waitForSelector(
      AgentChatConstants.validateEndConversationMessageAgent
    );
    return !isNullOrUndefined(messageSelector);
  }

  public async validatemode() {
    this.Page.waitForSelector(AgentChatConstants.DistributionMode);
    await this.Page.selectOption(
      AgentChatConstants.DistributionMode,
      PageConstants.value
    );
    const consumerSecret = await this.Page.waitForSelector(
      AgentChatConstants.Mode
    );
    const text = await (await consumerSecret.getProperty("title")).jsonValue();

    return text == PageConstants.Mode;
  }

  public async validateAccountLinked() {
    const message = AgentChatConstants.AccountLink;
    return await this.waitTillTextChange(
      SelectorConstants.ToastNotificationListRoot,
      message
    );
  }

  public async unlinkRecord() {
    await this.Page.click(AgentChatConstants.SelectContact);
    await this.Page.click(AgentChatConstants.ContactRecord);
    await this.Page.click(AgentChatConstants.DeleteRecord);
    await this.Page.click(AgentChatConstants.ConfirmButtonId);
  }

  public async validateSessionTitle() {
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    const title = await (
      await iframe.waitForSelector(AgentChatConstants.HeaderTitle)
    ).textContent();

    var text = /Visitor/gi;
    if (title.search(text) != -1) {
      return true;
    }
  }
  public async delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  public async validateGlobalMessage() {
    //Added delay to validate missed notifcation scenerio. waiting to complete the timeout

    await this.delay(115000);

    try {
      await this.Page.waitForSelector(AgentChatConstants.WarningMessageList);
      await this.Page.click(AgentChatConstants.WarningMessageList);

      var message = await this.Page.waitForSelector(
        AgentChatConstants.WarningMessage
      );
    } catch {
      var message = await this.Page.waitForSelector(
        AgentChatConstants.WarningMessage
      );
    }
    const entityItemText = await message.textContent();
    var text = /Your presence was changed to/gi;
    if (entityItemText.search(text) != -1) {
      return true;
    }
  }

  public async validateStatus() {
    const presence = await this.Page.waitForSelector(
      AgentConversationPageConstants.PresenceStatus
    );
    const status = await (await presence.getProperty("title")).jsonValue();
    return status == AgentChatConstants.Away;
  }
  public async validatestatusDND() {
    const presence = await this.Page.waitForSelector(
      AgentConversationPageConstants.PresenceStatus
    );
    const status = await (await presence.getProperty("title")).jsonValue();
    console.log(status);
    return status == AgentChatConstants.DoNotDisturb;
  }

  public async isContactAvailable() {
    return await this.waitUntilSelectorIsVisible(
      AgentChatConstants.CreateNewContact
    );
  }

  public async validatePrechatSurvey(question: string) {
    if (question === "Question1") {
      const SurveyQuestion1 = await this.Page.waitForSelector(
        AgentConversationPageConstants.SurveyOnAgent
      );
      const question1 = await (
        await SurveyQuestion1.getProperty("title")
      ).jsonValue();
      question1 == SurveyQuestion.Question1Text;
    } else if (question === "Question2") {
      const SurveyQuestion2 = await this.Page.waitForSelector(
        AgentConversationPageConstants.SurveyOnAgent1
      );
      const question2 = await (
        await SurveyQuestion2.getProperty("title")
      ).jsonValue();
      question2 == SurveyQuestion.Question2Text;
    } else if (question === "Question3") {
      const SurveyQuestion3 = await this.Page.waitForSelector(
        AgentConversationPageConstants.SurveyOnAgent2
      );
      const question3 = await (
        await SurveyQuestion3.getProperty("title")
      ).jsonValue();
      question3 == SurveyQuestion.Question3Text;
    }
  }

  public async getWorkItemsCurrentRecordCount(selectorVal: string) {
    let recordCount: number = 0;
    let pageObject = this.Page;
    const myWorkItemsRecordCountSelector = await pageObject.waitForSelector(
      selectorVal
    );
    const myWorkItemsRecord = myWorkItemsRecordCountSelector.textContent();
    if (myWorkItemsRecord !== null && myWorkItemsRecord !== undefined) {
      const str = (await myWorkItemsRecord).toString();
      if (str !== "") {
        if (!isNaN(+str)) {
          recordCount = +str;
        }
      }
    }
    return recordCount;
  }

  public async getWorkItemsRecordCount(locator: string) {
    return await this.getWorkItemsCurrentRecordCount(locator);
  }

  public validateMyWorkItemsIsUpdated(
    laterWorkItemCount,
    initialWorkItemCount
  ) {
    return laterWorkItemCount > initialWorkItemCount;
  }

  public async validateWorkItemIsFlushedAndShowingCorrectData(channel) {
    // validate channel
    const channelElement = await this.Page.waitForSelector(
      AgentConversationPageConstants.ChannelElement
    );
    const channelText = await (
      await channelElement.getProperty("title")
    ).jsonValue();
    if (channelText !== channel) {
      return false;
    }

    // validate closed on
    const closedOnElement = await this.Page.waitForSelector(
      AgentConversationPageConstants.ClosedOnElement
    );
    const closedOnValue = await (
      await closedOnElement.getProperty("value")
    ).jsonValue();
    if (channelText === "") {
      return false;
    }

    return true;
  }

  public async SelectChat(selector: string) {
    await this._page.$eval(selector, (el) => (el as HTMLElement).click());
  }

  public async getSentiment() {
    await this.delay(5000);
    const iframeCC = await TestHelper.GetIframe(
      this._page,
      HTMLConstants.IframeCC
    );
    const headerSentiment = await iframeCC
      .waitForSelector(AgentConversationPageConstants.HeaderSentiment)
      .catch((e: any) => {
        throw e;
      });
    const sentimentText = headerSentiment.getAttribute("title");
    return sentimentText;
  }

  public async createTaskActivityRecord() {
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.PostActivityRecordSelector,
      Constants.Three,
      null,
      Constants.MaxTimeout
    );
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.CreateNewTimelineRecord
    );
    await this.Page.click(AgentChatConstants.CreateNewTimelineRecord);
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.CreateNewTaskRecord
    );
    await this.Page.click(AgentChatConstants.CreateNewTaskRecord);
    await this.waitUntilSelectorIsVisible(AgentChatConstants.SubjectSelector);
    await this.Page.fill(
      AgentChatConstants.SubjectSelector,
      AgentChatConstants.TaskActivity
    );
    await this.Page.click(AgentChatConstants.SaveAndCloseRecord);
  }

  public async createAppointmentActivityRecord() {
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.TaskActivityRecordSelector,
      Constants.Three,
      null,
      Constants.MaxTimeout
    );
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.CreateNewTimelineRecord
    );
    await this.Page.click(AgentChatConstants.CreateNewTimelineRecord);
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.CreateNewAppointmentRecord
    );
    await this.Page.click(AgentChatConstants.CreateNewAppointmentRecord);
    await this.waitUntilSelectorIsVisible(AgentChatConstants.SubjectSelector);
    await this.Page.fill(
      AgentChatConstants.SubjectSelector,
      AgentChatConstants.AppointmentActivity
    );
    await this.Page.click(AgentChatConstants.SaveAndCloseRecord);
  }

  public async validateTaskActivity() {
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.TaskActivityRecordSelector,
      Constants.Five,
      null,
      Constants.MaxTimeout
    );
    const taskActivityRecordSelector = await this.Page.waitForSelector(
      AgentChatConstants.TaskActivityRecordSelector
    );
    const taskActivityRecord = await taskActivityRecordSelector.textContent();
    if (taskActivityRecord === AgentChatConstants.TaskActivity) {
      return true;
    }
    return false;
  }

  public async validateAppointmentActivity() {
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.AppointmentActivityRecordSelector,
      Constants.Five,
      null,
      Constants.MaxTimeout
    );
    const appointmentActivityRecordSelector = await this.Page.waitForSelector(
      AgentChatConstants.AppointmentActivityRecordSelector
    );
    const appointmentActivityRecord =
      await appointmentActivityRecordSelector.textContent();
    if (appointmentActivityRecord === AgentChatConstants.AppointmentActivity) {
      return true;
    }
    return false;
  }

  public async validateConversationTitleWhenContactLinked() {
    const title = await this.Page.waitForSelector(
      AgentChatConstants.CustomerConversationTitle
    );
    const result = await title.innerText();
    return result === `${this.ContactData.ContactName}_${new Date().getTime()}`;
  }

  public async openVisitorDetailsTab() {
    const visitorDetailsTabButton = await this.Page.waitForSelector(
      AgentConversationPageConstants.VisitorDetailsTabButtonSelector,
      { timeout: 10000 }
    );
    await visitorDetailsTabButton.click();
  }

  public async isAuthenticatedUser() {
    await this.openVisitorDetailsTab();
    const isAuthenticated = await this.Page.waitForSelector(
      AgentConversationPageConstants.VisitorDetailsIsAuthenticatedValueSelector,
      { timeout: 10000 }
    );
    const isAuthenticatedValue = await isAuthenticated.textContent();
    return isAuthenticatedValue?.toLowerCase() === "yes";
  }

  public async channelValidation() {
    const engagementchannel = await this.Page.waitForSelector(
      AgentChatConstants.Engagementchannel
    );
    const engagementchannelvalue = await engagementchannel.textContent();
    if (engagementchannelvalue === Constants.CustomMessaging) {
      return true;
    }
    return false;
  }

  public async validateCustomCustomerName() {
    const ChatWindowFrame = await this.Page.$(
      SelectorConstants.ChatWindowMainIFrame
    );
    const iFrame1 = await ChatWindowFrame.contentFrame();
    const iFrame2 = await iFrame1.$(SelectorConstants.ChatWindowSubIFrame);
    const iFrame3 = await iFrame2.contentFrame();
    const iFramw4 = await iFrame3.waitForSelector(
      SelectorConstants.CustomCustomerName
    );
    const title = await iFramw4.innerText();
    return title;
  }

  public async validatePopoutMessage(textToValidate: string) {
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );

    let messageSelector = "";

    if (textToValidate == AgentChatConstants.PopupWindowMessage1) {
      messageSelector = await (
        await iframe.waitForSelector(
          AgentChatConstants.ValidateTextForDuplicate
        )
      ).textContent();
    } else if (textToValidate == AgentChatConstants.PopupWindowMessage2) {
      messageSelector = await (
        await iframe.waitForSelector(
          AgentChatConstants.ValidateTextForDuplicate2
        )
      ).textContent();
    } else if (textToValidate == AgentChatConstants.PopupWindowMessage3) {
      messageSelector = await (
        await iframe.waitForSelector(
          AgentChatConstants.ValidateTextForDuplicate3
        )
      ).textContent();
    } else {
      messageSelector = await (
        await iframe.waitForSelector(
          AgentChatConstants.ValidateTextForDuplicate4
        )
      ).textContent();
    }

    if (messageSelector.search(textToValidate) == -1) {
    } else {
      return true;
    }
  }

  public async ValaidateCustomChannelLogoandName() {
    await this.waitForDomContentLoaded();
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );

    await this.waitUntilSelectorIsVisible(AgentChatConstants.CustomChannelLogo);
    const customerName = await iframe.waitForSelector(
      AgentChatConstants.CustomChannelCustomerName
    );
    const customerNameText = await customerName.textContent();
    if (customerNameText.startsWith(this.ContactData.ContactName)) {
      return true;
    }
  }

  public async ValidateSentTimeStamp() {
    try {
      const iframe: Page = await IFrameHelper.GetIframe(
        this.Page,
        IFrameConstants.IframeCC
      );
      await this.waitUntilSelectorIsVisible(
        AgentChatConstants.AgentSentMessageLabel
      );
      await this.waitUntilSelectorIsVisible(
        AgentChatConstants.AgentSentTimeStamp
      );
      return true;
    } catch {
      return false;
    }
  }

  public async validateEngagementChannel(channel: string) {
    const engagementChannelLabel = await this.Page.waitForSelector(
      AgentChatConstants.EngagementChannel
    );
    const engagementChannelText = await engagementChannelLabel.textContent();
    expect(engagementChannelText.includes(channel)).toBeTruthy();
  }

  public async validatequickreplies(message: string = "#q1") {
    await this.waitForDomContentLoaded();
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.MessageTextArea,
      AgentChatConstants.Three,
      iframe,
      Constants.MaxTimeout
    );
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.QuickRepliesBtnSelector,
      AgentChatConstants.Five,
      iframe,
      Constants.MaxTimeout
    );
    await iframe.$eval(AgentChatConstants.QuickRepliesBtnSelector, (el) => {
      (el as HTMLElement).click();
    });
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.QuickReplyDataSelector,
      AgentChatConstants.Five,
      iframe,
      Constants.MaxTimeout
    );
    const textarea = await iframe.waitForSelector(
      AgentChatConstants.MessageTextArea
    );
    await textarea.fill("");
    const searchTxt: string = "/q " + message;
    await textarea.type(searchTxt, { delay: 100 });
    await this._page.keyboard.press(AgentChatConstants.SpaceKeyword);
    await this.waitUntilQuickReplyIsVisible(
      AgentChatConstants.QuickRepliesValSelector,
      AgentChatConstants.NoResultFoundMsgSelector,
      textarea,
      Constants.Five,
      iframe,
      Constants.MaxTimeout
    );

    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.QuickReplyValSelector.replace("{0}", message),
      AgentChatConstants.Five,
      iframe,
      Constants.MaxTimeout
    );

    await iframe.$eval(
      AgentChatConstants.QuickReplyValSelector.replace("{0}", message),
      (el) => {
        (el as HTMLElement).click();
      }
    );

    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.QuickReplyValSelector.replace("{0}", message),
      AgentChatConstants.Five,
      iframe,
      Constants.MaxTimeout
    );

    await iframe.$eval(
      AgentChatConstants.QuickReplyValSelector.replace("{0}", message),
      (el) => {
        (el as HTMLElement).click();
      }
    );

    await iframe.$eval(AgentChatConstants.SendMessageButton, (el) => {
      (el as HTMLElement).scrollIntoView();
      (el as HTMLElement).click();
    });
  }

  public async validatequickrepliesforLCW(message: string = "#q1") {
    const iframeCC = await TestHelper.GetIframe(
      this._page,
      HTMLConstants.IframeCC
    );
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.QuickReplies,
      AgentChatConstants.Five,
      iframeCC,
      Constants.OpenWsWaitTimeout
    );
    await iframeCC.$eval(AgentChatConstants.QuickReplies, (el) => {
      (el as HTMLElement).click();
    });
    const textarea = await iframeCC.waitForSelector(
      AgentChatConstants.MessageTextArea
    );
    await textarea.fill("");
    const searchTxt: string = "/q " + message;
    await textarea.type(searchTxt, { delay: 100 });
    await this._page.keyboard.press(AgentChatConstants.SpaceKeyword);

    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.QuickReplyClass,
      AgentChatConstants.Five,
      iframeCC,
      Constants.OpenWsWaitTimeout
    );

    await iframeCC.$eval(AgentChatConstants.QuickReplyClass, (el) => {
      (el as HTMLElement).click();
    });

    await iframeCC.$eval(AgentChatConstants.QuickReplyClass, (el) => {
      (el as HTMLElement).click();
      (el as HTMLElement).click();
    });

    await iframeCC.waitForSelector(AgentChatConstants.SendMessageButton);
    await iframeCC.$eval(AgentChatConstants.SendMessageButton, (el) => {
      (el as HTMLElement).click();
    });
  }

  public async validatequickrepliesSlugforRedirectionUrl(message: string = "#q1") {
    const iframeCC = await TestHelper.GetIframe(
      this._page,
      HTMLConstants.IframeCC
    );
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.QuickReplies,
      AgentChatConstants.Five,
      iframeCC,
      Constants.OpenWsWaitTimeout
    );
    await iframeCC.$eval(AgentChatConstants.QuickReplies, (el) => {
      (el as HTMLElement).click();
    });
    const textarea = await iframeCC.waitForSelector(
      AgentChatConstants.MessageTextArea
    );
    await textarea.fill("");
    const searchTxt: string = "/q " + message;
    await textarea.type(searchTxt, { delay: 100 });
    await this._page.keyboard.press(AgentChatConstants.SpaceKeyword);

    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.QuickReplyClass,
      AgentChatConstants.Five,
      iframeCC,
      Constants.OpenWsWaitTimeout
    );
  }

  public async ReconnectUrl() {
    await this.Page.waitForTimeout(Constants.DefaultTimeout);
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    await iframe.waitForTimeout(Constants.DefaultTimeout);
    var reconnectUrl = await iframe.waitForSelector(
      AgentChatConstants.ReconnectUrl
    );
    var result = (await reconnectUrl.textContent())
      ?.toString()
      .replace("&#x3A;", ":")
      .substr(23);
    return result;
  }

  public async DisconnectMessage() {
    console.info(
      "Customer Disconnected at: " +
      (await this.GetCurrentDateAndTime()).toString()
    );
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    try {
      await iframe.waitForSelector(AgentChatConstants.DisconnectMessage, {
        timeout: 5 * 60 * 1000,
      });
      console.info(
        "(Reconnect) Disconnected Message Appeared at: " +
        (await this.GetCurrentDateAndTime()).toString()
      );
    } catch (error) {
      throw new Error(
        `Timeout exceeds for (Reconnect) 'DisconnectMessage' method. Error message: ${error.message}`
      );
    }
  }

  public async contactNameExistence() {
    var flag = false;
    try {
      await this.Page.waitForTimeout(Constants.DefaultTimeout);
      await this.Page.waitForSelector(AgentChatConstants.CreateNewContact);
      flag = true;
    } catch {
      flag = false;
      const value = await this.Page.waitForSelector(
        AgentChatConstants.CustomerTitle
      );
      this.customerName = (await value.textContent()).toString();
    }
    if (flag) {
      await this.createNewContact();
      return false;
    }
    return true;
  }

  public async validateCustomerNameAfterLinked() {
    await this.waitUntilSelectorIsVisible(AgentChatConstants.CustomerTitle);
    const customer = await this.Page.waitForSelector(
      AgentChatConstants.CustomerTitle
    );
    const customerName = await customer.textContent();
    await this.waitForDomContentLoaded();
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.ChatTitle,
      Constants.Three,
      this._page,
      Constants.MaxTimeout
    );
    const title = await this.Page.waitForSelector(
      AgentChatConstants.ChatTitleSelector
    );
    const question1 = await (await title.getProperty("alt")).jsonValue();
    if (question1.startsWith(this.ContactData.ContactName)) {
      return true;
    }
    return false;
  }

  public async movetToContact() {
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.SearchAccountInputSelector,
      Constants.Five,
      this._page,
      Constants.MaxTimeout
    );
    await this._page.hover(AgentChatConstants.SearchAccountInputSelector);
    await this._page.click(AgentChatConstants.ContactValueSelector);
  }

  public async linkConversation() {
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.NewLinkToConversation,
      AgentChatConstants.Three,
      iframe,
      Constants.MaxTimeout
    );
    await iframe.$eval(AgentChatConstants.NewLinkToConversation, (el) => {
      (el as HTMLElement).click();
    });
  }

  public async validateContactIsLinked() {
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.SystemAlertMessageSelector
    );
    const contactLinkedMessageSelector = await this.Page.waitForSelector(
      AgentChatConstants.SystemAlertMessageSelector
    );
    const contactLinkedMessage =
      await contactLinkedMessageSelector.textContent();
    if (
      contactLinkedMessage.startsWith(AgentChatConstants.ContactMessageText)
    ) {
      return true;
    }
    return false;
  }

  public async RemoveContactFromConveration(callSaveBtn: boolean = false) {
    if (callSaveBtn) {
      await this._page.click(SelectorConstants.FormSaveAndCloseButton);
    }
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.SearchCustomerInputSelector,
      Constants.Five,
      this._page,
      Constants.MaxTimeout
    );
    await this._page.hover(AgentChatConstants.SearchCustomerInputSelector);
    await this._page.focus(AgentChatConstants.SearchCustomerInputSelector);
    try {
      await this._page.waitForSelector(
        AgentChatConstants.RemoveAccountlookUpSelector,
        { timeout: Number(Constants.DefaultTimeout) }
      );
      await this._page.click(AgentChatConstants.RemoveAccountlookUpSelector);
      await this.waitUntilSelectorIsVisible(
        AgentChatConstants.NewAccountButtonSelector,
        Constants.Five,
        this._page,
        Constants.MaxTimeout
      );
    } catch (error) {
      console.log(`Method waitUntilNewRecordAppearsInOpenWS throwing exception with message: ${error.message}`);
    }
  }

  public async RemoveCaseFromConveration(callSaveBtn: boolean = false) {
    if (
      await this.waitUntilSelectorIsVisible(
        AgentChatConstants.SearchCustomerInputSelector,
        Constants.Five,
        this._page,
        Constants.MaxTimeout
      )
    ) {
      if (callSaveBtn) {
        await this._page.click(SelectorConstants.FormSaveAndCloseButton);
      }
      await this.waitUntilSelectorIsVisible(
        AgentChatConstants.SearchCustomerInputSelector,
        Constants.Five,
        this._page,
        Constants.MaxTimeout
      );
      await this._page.hover(AgentChatConstants.SearchCustomerInputSelector);
      await this._page.focus(AgentChatConstants.SearchCustomerInputSelector);
      try {
        await this._page.waitForSelector(
          AgentChatConstants.RemoveAccountlookUpSelector,
          { timeout: Number(Constants.DefaultTimeout) }
        );
        await this._page.click(AgentChatConstants.RemoveAccountlookUpSelector);
        await this.waitUntilSelectorIsVisible(
          AgentChatConstants.NewAccountButtonSelector,
          Constants.Five,
          this._page,
          Constants.MaxTimeout
        );
      } catch (error) {
        console.log(`Method RemoveCaseFromConveration throwing exception with message: ${error.message}`);
      }
    }
  }

  public async validateChatHeaderForOldValue(message: string) {
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    return await this.waitUntilSelectorIsVisible(
      AgentChatConstants.AgentChatHeaderTitleSelector.replace("{0}", message),
      AgentChatConstants.Five,
      iframe,
      Constants.MaxTimeout
    );
  }

  public async CreateNewCase() {
    var isContactAvailable = this.isContactAvailable();
    if (isContactAvailable) {
      await this.waitUntilSelectorIsVisible(
        AgentChatConstants.CustomerLanguageInput,
        Constants.Five,
        this._page,
        Constants.MaxTimeout
      );
      await this._page.hover(AgentChatConstants.CustomerLanguageInput);
      await this._page.focus(AgentChatConstants.CustomerLanguageInput);
      const contactInput = await this.Page.waitForSelector(
        AgentChatConstants.CustomerLanguageInput
      );
      await contactInput.fill(this.CustomerFullName);
      await this.Page.click(AgentChatConstants.CustomerLanguageSearch);
      await this.Page.waitForSelector(
        AgentChatConstants.CustomerLanguageLookupValue.replace(
          "{0}",
          this.CustomerFullName
        )
      );
      await this.Page.click(
        AgentChatConstants.CustomerLanguageLookupValue.replace(
          "{0}",
          this.CustomerFullName
        )
      );
    }
    await this.Page.waitForTimeout(Constants.DefaultTimeout);
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.CaseBtnSelector,
      Constants.Five,
      this._page,
      Constants.MaxTimeout
    );
    await this.Page.click(AgentChatConstants.CaseBtnSelector);
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.CaseBtnSelector,
      Constants.Five,
      this._page,
      Constants.MaxTimeout
    );
    await this.Page.fill(
      AgentChatConstants.CaseTitleSelector,
      AgentChatConstants.CaseName
    );
    await this.waitUntilSelectorIsVisible(
      SelectorConstants.FormSaveButton,
      Constants.Five,
      this._page,
      Constants.MaxTimeout
    );
    await this._page.click(SelectorConstants.FormSaveButton);
  }

  public async validateCaseIsLinked() {
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.SystemAlertMessageSelector
    );
    const caseLinkedMessageSelector = await this.Page.waitForSelector(
      AgentChatConstants.SystemAlertMessageSelector
    );
    const caseLinkedMessage = await caseLinkedMessageSelector.textContent();
    if (caseLinkedMessage.startsWith(AgentChatConstants.CaseMessageText)) {
      return true;
    }
    return false;
  }

  public async validateChatHeaderForNewValue() {
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    return await this.waitUntilSelectorIsVisible(
      AgentChatConstants.AgentChatHeaderTitleSelector.replace(
        "{0}",
        this.CustomerFullName
      ),
      AgentChatConstants.Five,
      iframe,
      Constants.MaxTimeout
    );
  }

  public async CreateNewContactRecord() {
    const isContactExists = await this.waitUntilSelectorIsVisible(
      AgentChatConstants.SearchCustomerInputSelector,
      Constants.Three,
      this._page,
      Constants.MaxTimeout
    );
    if (isContactExists) {
      await this.RemoveContactFromConveration();
    }

    await this.Page.click(AgentChatConstants.CreateNewContactChat);
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.ContactName,
      Constants.Three,
      this._page,
      Constants.MaxTimeout
    );
    const contactName = await this.Page.waitForSelector(
      AgentChatConstants.ContactName
    );
    const name = `${this.ContactData.ContactName}_${new Date().getTime()}`;
    this.CustomerFullName = name;
    await contactName.fill(name);
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.ContactLastName,
      Constants.Three,
      this._page,
      Constants.MaxTimeout
    );
    const lastName = await this.Page.waitForSelector(
      AgentChatConstants.ContactLastName
    );
    await lastName.fill(this.ContactData.ContactLastName);
    await this.waitUntilSelectorIsVisible(
      SelectorConstants.FormSaveAndCloseButton,
      Constants.Five,
      this._page,
      Constants.MaxTimeout
    );
    const saveButton = await this.Page.waitForSelector(
      SelectorConstants.FormSaveAndCloseButton
    );
    await saveButton.click();
    await this.waitForSaveComplete();
    this.CustomerConversationName =
      name + " " + this.ContactData.ContactLastName;
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.ContactSavedVerficationXpath.replace("{0}", `${name}`),
      Constants.Five,
      this._page,
      Constants.MaxTimeout
    );
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.ContactSavedVerficationXpath.replace("{0}", `${name}`)
    );
  }

  public async GetCustomerFullName() {
    return this.CustomerFullName;
  }

  public async waitForChatLoad() {
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

  public async ConsultWithOtherAgent(consultingAgentName: string) {
    const iframeCC = await TestHelper.GetIframe(
      this._page,
      HTMLConstants.IframeCC
    );
    await this.waitUntilSelectorIsVisible(
      AgentCosultConversationPageConstants.ConsultBtn,
      AgentChatConstants.Five,
      iframeCC,
      Constants.OpenWsWaitTimeout
    );
    await iframeCC.$eval(
      AgentCosultConversationPageConstants.ConsultBtn,
      (el) => {
        (el as HTMLElement).click();
      }
    );
    await this.waitUntilSelectorIsVisible(
      AgentCosultConversationPageConstants.ConsultingAgentNameSelector.replace(
        "{0}",
        consultingAgentName
      ),
      AgentChatConstants.Five,
      iframeCC,
      Constants.OpenWsWaitTimeout
    );
    await iframeCC.$eval(
      AgentCosultConversationPageConstants.ConsultingAgentNameSelector.replace(
        "{0}",
        consultingAgentName
      ),
      (el) => {
        (el as HTMLElement).click();
      }
    );
  }

  public async validateAgentPresenceStatus(consultingAgentName: string) {
    const iframeCC = await TestHelper.GetIframe(
      this._page,
      HTMLConstants.IframeCC
    );
    await this.waitUntilSelectorIsVisible(
      AgentCosultConversationPageConstants.ConsultingAgentNameSelector.replace(
        "{0}",
        consultingAgentName
      ),
      AgentChatConstants.Five,
      iframeCC,
      Constants.OpenWsWaitTimeout
    );
    const presence = await iframeCC.waitForSelector(
      AgentCosultConversationPageConstants.ConsultingAgentSelector.replace(
        "{0}",
        consultingAgentName
      )
    );
    return presence;
  }

  public async InitiateConsultFromConsultPane(consultingAgentName: string) {
    const iframeCC = await TestHelper.GetIframe(
      this._page,
      HTMLConstants.IframeCC
    );
    await this.waitUntilSelectorIsVisible(
      AgentCosultConversationPageConstants.ConsultButtonOnConsultPane,
      AgentChatConstants.Five,
      iframeCC,
      Constants.OpenWsWaitTimeout
    );
    await iframeCC.$eval(
      AgentCosultConversationPageConstants.ConsultButtonOnConsultPane,
      (el) => {
        (el as HTMLElement).click();
      }
    );
    await this.waitUntilSelectorIsVisible(
      AgentCosultConversationPageConstants.ConsultingAgentNameSelector.replace(
        "{0}",
        consultingAgentName
      ),
      AgentChatConstants.Five,
      iframeCC,
      Constants.OpenWsWaitTimeout
    );
    await iframeCC.$eval(
      AgentCosultConversationPageConstants.ConsultingAgentNameSelector.replace(
        "{0}",
        consultingAgentName
      ),
      (el) => {
        (el as HTMLElement).click();
      }
    );
  }

  public async AddConsulteeAgentToC2Conversation(consultingAgentName: string) {
    const iframeCC = await TestHelper.GetIframe(
      this._page,
      HTMLConstants.IframeCC
    );
    await this.waitUntilSelectorIsVisible(
      AgentCosultConversationPageConstants.AddAgentToC2Conversation,
      AgentChatConstants.Five,
      iframeCC,
      Constants.OpenWsWaitTimeout
    );
    await iframeCC.$eval(
      AgentCosultConversationPageConstants.AddAgentToC2Conversation,
      (el) => {
        (el as HTMLElement).click();
      }
    );
    await this.waitUntilSelectorIsVisible(
      AgentCosultConversationPageConstants.ConsultingAgentNameSelector.replace(
        "{0}",
        consultingAgentName
      ),
      AgentChatConstants.Five,
      iframeCC,
      Constants.OpenWsWaitTimeout
    );
    await iframeCC.$eval(
      AgentCosultConversationPageConstants.ConsultingAgentNameSelector.replace(
        "{0}",
        consultingAgentName
      ),
      (el) => {
        (el as HTMLElement).click();
      }
    );
  }

  public async ConsultingOptionMessageConversation(
    agentPage,
    consultingAgent,
    language = "en"
  ) {
    const iframeAgent: Page = await IFrameHelper.GetIframe(
      agentPage.Page,
      IFrameConstants.IframeCC
    );
    const iframeConsultingAgent: Page = await IFrameHelper.GetIframe(
      consultingAgent.Page,
      IFrameConstants.IframeCC
    );

    await this.SendPrivateMessage(
      iframeAgent,
      AgentCosultConversationPageConstants.AgentConsultMessage
    );
    expect(
      await this.validateConsultingMessageInChatBox(
        agentPage.Page,
        AgentCosultConversationPageConstants.AgentConsultMessage
      )
    ).toBeTruthy();
    await this.SendPrivateMessage(
      iframeConsultingAgent,
      AgentCosultConversationPageConstants.ConsultingAgentInternalMessage
    );
    expect(
      await this.validateConsultingMessageInChatBox(
        consultingAgent.Page,
        AgentCosultConversationPageConstants.ConsultingAgentInternalMessage
      )
    ).toBeTruthy();
    await this.SendPublicMessage(
      iframeConsultingAgent,
      AgentCosultConversationPageConstants.ConsultingAgentPublicMessage
    );
    expect(
      await this.validateConsultingMessageInChatBox(
        consultingAgent.Page,
        AgentCosultConversationPageConstants.ConsultingAgentPublicMessage
      )
    ).toBeTruthy();
  }

  public async sendMessageValidateConsultingMessage(
    agentPage,
    consultingAgent,
    Message
  ) {
    const iframeAgent: Page = await IFrameHelper.GetIframe(
      agentPage.Page,
      IFrameConstants.IframeCC
    );
    const iframeConsultingAgent: Page = await IFrameHelper.GetIframe(
      consultingAgent.Page,
      IFrameConstants.IframeCC
    );
    await this.SendPublicMessage(iframeConsultingAgent, Message);
    expect(
      await this.validateConsultingMessageInChatBox(
        consultingAgent.Page,
        Message
      )
    ).toBeTruthy();
  }

  public async validateSendPublicMessageAndConsulting(agentPage) {
    const iframeAgent: Page = await IFrameHelper.GetIframe(
      agentPage.Page,
      IFrameConstants.IframeCC
    );
    await this.SendPublicMessage(
      iframeAgent,
      AgentCosultConversationPageConstants.AgentFinalPublicReply
    );
    expect(
      await this.validateConsultingMessageInChatBox(
        agentPage.Page,
        AgentCosultConversationPageConstants.AgentFinalPublicReply
      )
    ).toBeTruthy();
  }

  public async SendPrivateMessage(iframe, message) {
    await this.waitUntilSelectorIsVisible(
      AgentCosultConversationPageConstants.ConsultPane,
      AgentChatConstants.Five,
      iframe,
      Constants.OpenWsWaitTimeout
    );
    const textarea = await iframe.waitForSelector(
      AgentChatConstants.ConsultMessageTextArea
    );
    await textarea.fill(message);
    await iframe.$eval(AgentChatConstants.ConsultSendMessageButton, (el) => {
      (el as HTMLElement).scrollIntoView();
      (el as HTMLElement).click();
    });
  }

  public async SendPublicMessage(iframe, message) {
    await this.waitUntilSelectorIsVisible(
      AgentCosultConversationPageConstants.C2ConvPane,
      AgentChatConstants.Five,
      iframe,
      Constants.OpenWsWaitTimeout
    );
    await this.SendConsultaionMessage(iframe, message);
  }

  public async SendConsultaionMessage(iframe, message) {
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.MessageTextArea,
      AgentChatConstants.Five,
      iframe,
      Constants.OpenWsWaitTimeout
    );
    const textarea = await iframe.waitForSelector(
      AgentChatConstants.MessageTextArea
    );
    await textarea.fill(message);
    await iframe.$eval(AgentChatConstants.SendMessageButton, (el) => {
      (el as HTMLElement).scrollIntoView();
      (el as HTMLElement).click();
    });
  }

  public async validateConversationTitleInCloseWorkStream(titleName: string) {
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.ClosedConversationTitleSelector,
      AgentChatConstants.Eight,
      this._page,
      Constants.MaxTimeout
    );
    const value = await this.Page.waitForSelector(
      AgentChatConstants.ClosedConversationTitleSelector
    );
    const gridItemValue = await value.textContent();
    if (gridItemValue.startsWith(titleName)) {
      return true;
    } else {
      return false;
    }
  }

  public async getConversationTitle() {
    const iframeCC = await IFrameHelper.GetIframe(
      this._page,
      IFrameConstants.IframeCC
    );
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.ConversationTitleNameSelector,
      AgentChatConstants.Four,
      iframeCC,
      Constants.MaxTimeout
    );
    const conversationTitleSelector = await iframeCC.waitForSelector(
      AgentChatConstants.ConversationTitleNameSelector
    );
    const titleName = await conversationTitleSelector.textContent();
    return titleName;
  }

  public async getMyItemWSRecordCount() {
    return await this.getMyItemWSCurrentRecordCount(
      AgentChatConstants.MyItemsWsRecordCountSelector
    );
  }

  public async getMyItemWSCurrentRecordCount(selectorVal: string) {
    let recordCount: number = 0;
    let pageObject = this.Page;
    const myItemsWorkStreamRecordCountSelector =
      await pageObject.waitForSelector(selectorVal);
    const myItemsWorkStreamRecord =
      myItemsWorkStreamRecordCountSelector.textContent();
    if (
      myItemsWorkStreamRecord !== null &&
      myItemsWorkStreamRecord !== undefined
    ) {
      const str = (await myItemsWorkStreamRecord).toString();
      if (str !== "") {
        if (!isNaN(+str)) {
          recordCount = +str;
        }
      }
    }
    return recordCount;
  }

  public async waitUntilNewRecordAppearsInMyItemsWS(
    selectorVal: string,
    oldMyItemsWSRecordValue: number = 0,
    maxCount: number = Constants.Three,
    timeout: number = Constants.OpenWsWaitTimeout
  ) {
    let dataCount = 0;
    let pageObject = this.Page;
    while (dataCount < maxCount) {
      try {
        await pageObject.click(AgentChatConstants.RefreshAllTab);
        const myItemsWorkStreamRecordCountSelector =
          await pageObject.waitForSelector(selectorVal, { timeout });
        const myItemsWorkStreamRecord =
          myItemsWorkStreamRecordCountSelector.textContent();
        if (
          myItemsWorkStreamRecord !== null &&
          myItemsWorkStreamRecord !== undefined
        ) {
          const str = (await myItemsWorkStreamRecord).toString();
          if (str !== "") {
            if (!isNaN(+str)) {
              const newMyItemsWSRecordValue: number = +str;
              if (newMyItemsWSRecordValue - oldMyItemsWSRecordValue > 0) {
                return true;
              }
            }
          }
        }
      } catch (error) {
        console.log(`Method waitUntilNewRecordAppearsInMyItemsWS throwing exception with message: ${error.message}`);
      }
      dataCount++;
    }
    return false;
  }

  public async verifyNewRecordAppearsInMyItemsWS(
    myItemsWSRecordCountValue: number
  ) {
    return await this.waitUntilNewRecordAppearsInMyItemsWS(
      AgentChatConstants.MyItemsWsRecordCountSelector,
      myItemsWSRecordCountValue,
      Constants.Three,
      Constants.OpenWsWaitTimeout
    );
  }

  public async movetoAgentHomeScreen() {
    const iframeCC = await IFrameHelper.GetIframe(
      this._page,
      IFrameConstants.IframeCC
    );
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.EndConversationButtonXPath,
      AgentChatConstants.Three,
      iframeCC,
      Constants.MaxTimeout
    );

    await this._page.click(
      AgentChatConstants.AgentScreenLeftPanelHomeBtnSelector
    );
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.MyWorkItemsQueueSelector,
      AgentChatConstants.Three,
      iframeCC,
      Constants.MaxTimeout
    );
  }

  public async pickWSItemFromOpenWs() {
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.OpenWorkItemOptionsClick,
      Constants.Five,
      this._page,
      Constants.OpenWsWaitTimeout
    );
    await this.Page.click(AgentChatConstants.OpenWorkItemOptionsClick);
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.AssignToMe,
      Constants.Three,
      this._page,
      Constants.MaxTimeout
    );
    await this.Page.click(AgentChatConstants.AssignToMe);
  }

  public async validateConversationFormTitleInCloseWorkStream() {
    return await this.waitUntilSelectorIsVisible(
      AgentChatConstants.ClosedConversationFormTitleSelector,
      AgentChatConstants.Three,
      this._page,
      Constants.MaxTimeout
    );
  }

  public async selectFirstChatFromAgentLeftPanel() {
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.FirstCustomerChatTabSelector,
      AgentChatConstants.Three,
      this._page,
      Constants.MaxTimeout
    );
    await this._page.$eval(
      AgentChatConstants.FirstCustomerChatTabSelector,
      (el) => (el as HTMLElement).click()
    );
  }

  public async setAgentStatusToDND() {
    // Without this timeout playwright can't wait and click on this status even with focus, only this helps
    await this._page.waitForTimeout(2000);
    await this._page.waitForSelector(AgentChatConstants.AgentStatusButton);
    await this._page.focus(AgentChatConstants.AgentStatusButton);
    await this._page.click(AgentChatConstants.AgentStatusButton);
    const selectElement = await this._page
      .waitForSelector(AgentChatConstants.SelectStatusElement)
      .catch((error) => {
        throw new Error(
          `Unable to find status element. Inner exception: ${error.message}`
        );
      });
    selectElement.selectOption({ label: "Do not disturb" });
    await this._page.waitForTimeout(500);
    await this._page.click(AgentChatConstants.AgentStatusOkButton);
    await this._page.waitForTimeout(5000);
  }

  public async setAgentStatusToBusy() {
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.AvailabilityStatusBusyXPath,
      AgentChatConstants.Five,
      null,
      Constants.DefaultMinTimeout
    );
    await this._page.click(AgentChatConstants.AgentStatusButton);
    const selectElement = await this._page.waitForSelector(
      AgentChatConstants.SelectStatusElement
    );
    selectElement.selectOption({
      label: AgentChatConstants.Busy.toString(),
    });
    await this._page.click(AgentChatConstants.AgentStatusOkButton);
  }

  public async waitForNewItemInOpenWS(
    selectorVal: string,
    oldOpenWSRecordValue: number = 0,
    maxCount: number = Constants.Three,
    timeout: number = Constants.OpenWsWaitTimeout
  ) {
    let dataCount = 0;
    let pageObject = this.Page;
    while (dataCount < maxCount) {
      try {
        await pageObject.click(AgentChatConstants.RefreshAllTab);
        await pageObject.waitForSelector(
          selectorVal.replace("{0}", (oldOpenWSRecordValue + 1).toString()),
          { timeout }
        );
        return true;
      } catch {
        dataCount++;
      }
    }
    return false;
  }

  public async waitForNewItemInClosedWS(
    selectorVal: string,
    oldOpenWSRecordValue: number = 0,
    maxCount: number = Constants.Three,
    timeout: number = Constants.OpenWsWaitTimeout
  ) {
    let dataCount = 0;
    let pageObject = this.Page;
    while (dataCount < maxCount) {
      try {
        await pageObject.click(AgentChatConstants.RefreshAllTab);
        await pageObject.waitForSelector(
          selectorVal.replace("{0}", (oldOpenWSRecordValue + 1).toString()),
          { timeout }
        );
        return true;
      } catch {
        dataCount++;
      }
    }
    return false;
  }

  public async validateAddSessionCommand() {
    await this.Page.waitForSelector(AgentChatConstants.DetailsDiv);
    const ScrolltoTwitterHandle = AgentChatConstants.DetailsDiv as string;
    await this.Page.evaluate(
      (param) => {
        document.querySelector(param.selector).scrollIntoView();
      },
      { selector: ScrolltoTwitterHandle }
    );
    await this.Page.waitForSelector(AgentChatConstants.Overflow);
    await this.Page.click(AgentChatConstants.Overflow);
    expect(await this.hasText(AgentChatConstants.AddSession)).toBeFalsy();
  }

  public async createCase(): Promise<string> {
    await this.Page.waitForSelector(AgentChatConstants.NewCaseBtn);
    await this.Page.click(AgentChatConstants.NewCaseBtn);
    await this.Page.waitForSelector(AgentChatConstants.CaseTitle, {
      timeout: TMConstant.Minutes(2),
    });
    const caseName = `Case + ${Math.floor(Math.random() * Date.now())}`;
    await this.Page.fill(AgentChatConstants.CaseTitle, caseName);
    await this.Page.waitForSelector(AgentChatConstants.CustomerSearchButton);
    await this.fillLookupField(
      AgentChatConstants.CustomerNametbx,
      AgentChatConstants.CustomerSearchButton,
      AgentChatConstants.CustomerLookupValue,
      " "
    );

    await this.Page.click(AgentChatConstants.IncidentSaves);
    await this.waitForSaveComplete();

    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.MessageTextArea,
      AgentChatConstants.Three,
      iframe
    );
    const caseTitleSel = AgentChatConstants.CaseTitleHeader.replace(
      "{0}",
      caseName
    );
    await iframe.waitForSelector(caseTitleSel);
    expect(iframe).toHaveSelector(caseTitleSel);
    return caseName.toString();
  }

  public async refreshDashBoard() {
    await this.Page.waitForSelector(AgentChatConstants.RefreshDashBoard);
    await this.Page.click(AgentChatConstants.RefreshDashBoard);
    await this.Page.waitForSelector(AgentChatConstants.DashBoardScrollView);
  }

  public async sendMp4Attachment(
    message: string,
    attachment: string = "FileResources//videomp4.mp4",
    language = "en"
  ) {
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    const textarea = await iframe.waitForSelector(
      AgentChatConstants.MessageTextArea
    );
    await textarea.fill(message);
    await iframe.setInputFiles(
      AgentChatConstants.LiveChatUploadFile,
      attachment
    );
    await iframe.$eval(AgentChatConstants.SendMessageButton, (el) => {
      (el as HTMLElement).scrollIntoView();
      (el as HTMLElement).click();
    });
  }

  public async createNewCustomerChat(firstName, lastName) {
    await this.Page.click(AgentChatConstants.CreateNewContactChat);
    await this.Page.fill(AgentChatConstants.FirstNameInput, firstName);
    await this.Page.fill(AgentChatConstants.LastNameInput, lastName);
    await this.Page.click(AgentChatConstants.SaveAndCloseButton);
  }

  public async validateActiveTagTimeLine() {
    const activeTagSelector = await this.Page.waitForSelector(
      AgentChatConstants.ActiveTimelineConversation
    );
    const activeTagSelectorValue = await activeTagSelector.textContent();
    return activeTagSelectorValue == ConversationStatesConstants.Active;
  }

  public async closeChatSession() {
    await this._page.$eval(
      AgentChatConstants.RemoveConversationButtonClass,
      (el) => (el as HTMLElement).click()
    );
    await this.waitUntilSelectorIsVisible(AgentChatConstants.ConfirmButtonId);
    await this._page.waitForSelector(
      AgentConversationPageConstants.ConfirmButtonId
    );
    await this._page.$eval(
      AgentConversationPageConstants.ConfirmButtonId,
      (el) => (el as HTMLElement).click()
    );
  }

  public async OpenClosedCoversation(firstName, lastName) {
    const fullName = firstName + " " + lastName;
    const closedTagSelector = await this.Page.waitForSelector(
      '//a[contains(text(), "' + fullName + '")]'
    );
    await closedTagSelector.click();
  }

  public async selectAgent() {
    const selectAgent = await this.Page.waitForSelector(
      AgentChatConstants.Session_01
    );
    await selectAgent.click();
  }

  public async OpenConversationByNameAndStatus(
    fullName: string,
    status: string
  ) {
    var conversation = await this.FindConversationByNameAndStatus(
      fullName,
      status
    );

    await conversation.click();
  }

  public async OpenConversationByStatus(status: string) {
    var conversation = await this.FindConversationByStatus(status);

    await conversation.click();
  }

  public async FindConversationByNameAndStatus(
    fullName: string,
    status: string
  ) {
    let replacedSelector =
      SelectorConstants.ChatByClientNameAndStatusSelector.replace(
        "{fullName}",
        fullName
      ).replace("{status}", status);
    var conversation = await this.RefreshTabUntilSelectorAppear(
      replacedSelector,
      5
    );

    return conversation;
  }

  public async FindConversationByStatus(status: string) {
    let replacedSelector = SelectorConstants.ChatByStatusSelector.replace(
      "{status}",
      status
    );
    var conversation = await this.RefreshTabUntilSelectorAppear(
      replacedSelector,
      5
    );

    return conversation;
  }

  public async validateClosedTagTimeLine() {
    try {
      await this.Page.waitForSelector(
        AgentChatConstants.ClosedTimelineConversation
      );
      return true;
    } catch (error) {
      console.info(error.message);
    }
  }

  public async validateConversationTranscript(message: string) {
    let result: boolean = false;
    await this.waitForDomContentLoaded();
    await this.waitUntilSelectorIsVisible(
      SelectorConstants.TranscriptIFrame,
      AgentChatConstants.Three
    );
    const IFrame1 = await this.Page.$(SelectorConstants.TranscriptIFrame);
    const IFrame2 = await IFrame1.contentFrame();
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.CustomControl,
      AgentChatConstants.Five
    );
    const iFrame3 = await IFrame2.waitForSelector(
      AgentChatConstants.CustomControl
    );
    const transcriptmessage = await iFrame3.waitForSelector(
      AgentChatConstants.TransScriptnewContainertext.replace('{0}', message)
    );
    const value = await transcriptmessage.textContent();
    if (value.includes(message)) {
      return true;
    }
    if (result) {
      console.info(
        "Message '{0}' found in method 'validateConversationTranscript'".replace(
          "{0}",
          message
        )
      );
    } else {
      console.info(
        "Message '{0}' not found in method 'validateConversationTranscript'".replace(
          "{0}",
          message
        )
      );
    }

    return result;
  }

  public async validateMessageInConsultPane(message: string) {
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    return await this.waitUntilSelectorIsVisible(
      AgentChatConstants.ConsultPaneChatMessageSelector.replace("{0}", message),
      AgentChatConstants.Five,
      iframe,
      AgentChatConstants.TwoThousand
    );
  }

  public async validateMessageInChatBox(message: string) {
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    return await this.waitUntilSelectorIsVisible(
      AgentChatConstants.ChatMessageSelector.replace("{0}", message),
      AgentChatConstants.Five,
      iframe,
      AgentChatConstants.TwoThousand
    );
  }

  public async validateFBIconInNotification() {
    return await this.waitUntilSelectorIsVisible(
      AgentChatConstants.FBNotificationIconImgSrcSelector,
      AgentChatConstants.Twelve,
      this._page,
      AgentChatConstants.FiveThousandsMiliSecondsWaitTimeout
    );
  }

  public async validateFbIconInChatHeader() {
    const iframeCC = await IFrameHelper.GetIframe(
      this._page,
      IFrameConstants.IframeCC
    );
    return await this.waitUntilSelectorIsVisible(
      AgentChatConstants.FBIconChatHeaderSelector,
      AgentChatConstants.Three,
      iframeCC,
      Constants.MaxTimeout
    );
  }

  public async validateMiddleColumnForPushOrPick() {
    try {
      const hasPickOrPush = await this._page.waitForSelector(
        AgentChatConstants.PushOrPick
      );
      const openWorkItemData = await this._page.waitForSelector(
        AgentChatConstants.OpenWorkItemData
      );
      if (
        (await hasPickOrPush.innerText()) ===
        (await openWorkItemData.innerText())
      ) {
        return true;
      } else {
        return false;
      }
    } catch {
      return false;
    }
  }

  public async validateMyWorkitemsOnAgentDashboard() {
    await this.waitForAgentStatus();
    const openChatMoreOptions = await this._page.waitForSelector(
      AgentChatConstants.MoreChatOption
    );
    await openChatMoreOptions.click();
    const openChat = await this.waitUntilSelectorIsVisible(
      AgentChatConstants.OpenMyWorkItemChat
    );
    await this.Page.click(AgentChatConstants.OpenMyWorkItemChat);
    return openChat;
  }

  public async navigateToTab(tabName: string) {
    await this.Page.click(AgentChatConstants.AgentTabs.replace("{0}", tabName));
    await this.Page.waitForTimeout(2000);
  }

  public async searchKBArticle() {
    await this.waitUntilSelectorIsVisible(
      PageConstants.FilterIcon,
      AgentChatConstants.Five,
      this.Page,
      Constants.FourThousandsMiliSeconds
    );
    const outerIframe = await this.Page.waitForSelector(
      PageConstants.OuterdivforKB
    );
    const customParentIFrame = await outerIframe.contentFrame();
    const customInnerIFrame = await customParentIFrame.$(
      PageConstants.ChildKBIframe
    );
    const customChildIFrame = await customInnerIFrame.contentFrame();
    await customChildIFrame.fill(
      AgentChatConstants.SearchBox,
      AgentChatConstants.KBArticle
    );
    await customChildIFrame.press(
      AgentChatConstants.SearchBox,
      AgentChatConstants.KeyEnter
    );
  }

  public async copyandvalidateKBArticle() {
    const outerIframe = await this.Page.waitForSelector(
      PageConstants.OuterdivforKB
    );
    const customParentIFrame = await outerIframe.contentFrame();
    const customInnerIFrame = await customParentIFrame.$(
      PageConstants.ChildKBIframe
    );
    const customChildIFrame = await customInnerIFrame.contentFrame();
    await customChildIFrame.click(AgentChatConstants.CopyArticle);
    await customChildIFrame.click(AgentChatConstants.SendArticles);
    const message = Constants.KBArticle as string;
    const kBArticleCopyMessage = await customChildIFrame.waitForSelector(
      SelectorConstants.ToastNotificationListRootdiv
    );
    const kBArticleMessage = await kBArticleCopyMessage.textContent();
    return message == kBArticleMessage;
  }

  public async sendKBArticle() {
    const outerIframe = await this.Page.waitForSelector(
      PageConstants.OuterdivforKB
    );
    const customParentIFrame = await outerIframe.contentFrame();
    const customInnerIFrame = await customParentIFrame.$(
      PageConstants.ChildKBIframe
    );
    const customChildIFrame = await customInnerIFrame.contentFrame();
    await customChildIFrame.click(AgentChatConstants.SendArticles);
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.MessageTextArea,
      AgentChatConstants.Three,
      iframe
    );
    await iframe.$eval(AgentChatConstants.SendMessageButton, (el) => {
      (el as HTMLElement).scrollIntoView();
      (el as HTMLElement).click();
    });
  }

  public async waitforSentimentStatus() {
    const iframeCC = await IFrameHelper.GetIframe(
      this._page,
      IFrameConstants.IframeCC
    );
    await this._page.waitForTimeout(
      AgentConversationPageConstants.SentimentWaitingTime
    );
    const title = await iframeCC.waitForSelector(
      AgentChatConstants.ChatSentimentText
    );
    const result = await title.innerText();
    return result;
  }

  public async validateSentimentCapture(message: string) {
    const iframeCC: Page = await IFrameHelper.GetIframe(
      this._page,
      IFrameConstants.IframeCC
    );
    await this.waitUntilSelectorIsVisible(AgentChatConstants.ChatSentimentText);
    const title = await iframeCC.$(AgentChatConstants.ChatSentimentText);
    const result = await title.textContent();
    return result == message;
  }

  public async copyandsendKBArticle() {
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.MessageTextArea,
      AgentChatConstants.Three,
      iframe
    );
    await iframe.$eval(AgentChatConstants.SendMessageButton, (el) => {
      (el as HTMLElement).scrollIntoView();
      (el as HTMLElement).click();
    });
  }

  public async popOutKBArticle() {
    const outerIframe = await this.Page.waitForSelector(
      PageConstants.OuterdivforKB
    );
    const customParentIFrame = await outerIframe.contentFrame();
    const customInnerIFrame = await customParentIFrame.$(
      PageConstants.ChildKBIframe
    );
    const customChildIFrame = await customInnerIFrame.contentFrame();
    await customChildIFrame.click(AgentChatConstants.PopOutArticles);
  }

  public async openChatFromOpenWorkItems() {
    await this.waitForAgentStatus();
    const openChatMoreOptions = await this._page.waitForSelector(
      AgentChatConstants.OpenWorkItemOptionsClick
    );
    await this.Page.click(AgentChatConstants.OpenWorkItemOptionsClick);
    await this.Page.waitForSelector(AgentChatConstants.AssignToMe);
    await this.Page.click(AgentChatConstants.AssignToMe);
    const popUpAccepted = await this.waitUntilSelectorIsVisible(
      AgentChatConstants.PopUpChatPicked,
      5
    );
    await this.waitForConversationControl();
    return popUpAccepted;
  }

  public async sendFDRatesDetails() {
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.MessageTextArea,
      AgentChatConstants.Three,
      iframe,
      Constants.MaxTimeout
    );
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.QuickRepliesBtnSelector,
      AgentChatConstants.Five,
      iframe,
      Constants.MaxTimeout
    );
    await iframe.$eval(AgentChatConstants.QuickRepliesBtnSelector, (el) => {
      (el as HTMLElement).click();
    });
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.QuickReplyDataSelector,
      AgentChatConstants.Five,
      iframe,
      Constants.MaxTimeout
    );
    const textarea = await iframe.waitForSelector(
      AgentChatConstants.MessageTextArea
    );
    await textarea.fill("");
    const searchTxt: string = "/q " + AgentChatConstants.QuickReplyFDTagName;
    await textarea.type(searchTxt, { delay: 100 });
    await this._page.keyboard.press(AgentChatConstants.SpaceKeyword);

    await this.waitUntilQuickReplyIsVisible(
      AgentChatConstants.QuickRepliesValSelector,
      AgentChatConstants.NoResultFoundMsgSelector,
      textarea,
      Constants.Five,
      iframe,
      Constants.MaxTimeout
    );

    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.QuickReplyValSelector.replace(
        "{0}",
        AgentChatConstants.QuickReplyFDTagName
      ),
      AgentChatConstants.Five,
      iframe,
      Constants.MaxTimeout
    );

    await iframe.$eval(
      AgentChatConstants.QuickReplyValSelector.replace(
        "{0}",
        AgentChatConstants.QuickReplyFDTagName
      ),
      (el) => {
        (el as HTMLElement).click();
      }
    );

    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.QuickReplyValSelector.replace(
        "{0}",
        AgentChatConstants.QuickReplyFDTagName
      ),
      AgentChatConstants.Five,
      iframe,
      Constants.MaxTimeout
    );

    await iframe.$eval(
      AgentChatConstants.QuickReplyValSelector.replace(
        "{0}",
        AgentChatConstants.QuickReplyFDTagName
      ),
      (el) => {
        (el as HTMLElement).click();
      }
    );

    await iframe.$eval(AgentChatConstants.SendMessageButton, (el) => {
      (el as HTMLElement).scrollIntoView();
      (el as HTMLElement).click();
    });
  }

  public async createAgentNotes() {
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    await iframe.waitForSelector(HTMLConstants.BUTTON_ROW_FOOTER);
    await iframe.dispatchEvent(HTMLConstants.MORE_ID, "click");
    await iframe.waitForSelector(HTMLConstants.MORE_MENU_ITEMS_POPUP);
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.MakeNotesButton,
      AgentChatConstants.Five,
      iframe,
      Constants.DefaultTimeout
    );
    await iframe.$eval(AgentChatConstants.MakeNotesButton, (el) => {
      (el as HTMLElement).click();
    });
    const iframeNotesPanel: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeWidgetValue
    );
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.AgentTextAreaNotes,
      AgentChatConstants.Five,
      iframeNotesPanel,
      Constants.MaxTimeout
    );
    await iframeNotesPanel.fill(
      AgentChatConstants.AgentTextAreaNotes,
      Constants.AgentNotesData
    );
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.AddNotesBtn,
      AgentChatConstants.Five,
      iframeNotesPanel,
      Constants.OpenWsWaitTimeout
    );
    await iframeNotesPanel.$eval(AgentChatConstants.AddNotesBtn, (el) => {
      (el as HTMLElement).click();
    });
  }

  public async waitUntilQuickReplyIsVisible(
    firstSelectorVal: string,
    secondSelectorVal: string,
    element: any,
    maxCount,
    page: Page,
    timeout: number = Constants.DefaultTimeout
  ) {
    let dataCount = 1;
    const searchTxt: string = "/q " + AgentChatConstants.QuickReplyFDTagName;
    while (dataCount < maxCount) {
      try {
        await this.waitUntilSelectorIsVisible(
          firstSelectorVal,
          1,
          page,
          timeout
        );
        const noResultFound = await this.waitUntilSelectorIsVisible(
          secondSelectorVal,
          1,
          page,
          timeout
        );
        if (!noResultFound) {
          return true;
        }
      } catch (error) {
        console.log(`Method waitUntilQuickReplyIsVisible throwing exception with message: ${error.message}`);
      }
      dataCount++;
      await element.fill("");
      await element.type(searchTxt, { delay: 100 });
      await this._page.keyboard.press(AgentChatConstants.SpaceKeyword);
    }
    return false;
  }

  public async validateAgentSentFDRatesLinkToCustomer() {
    return await this.validateMessageInChatBox(TestSettings.OrgUrl);
  }

  public async validateNoteCreation() {
    return await this.waitUntilSelectorIsVisible(
      AgentChatConstants.NotesTextSelector.replace(
        "{0}",
        Constants.AgentNotesData
      ),
      AgentChatConstants.Five,
      this._page,
      Constants.MaxTimeout
    );
  }

  public async openContact() {
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.OpenContactRecord,
      Constants.Five,
      this._page,
      Constants.MaxTimeout
    );
    await this._page.click(AgentChatConstants.OpenContactRecord);
  }

  public async navigatetoFCBLink(url: string) {
    const advancedsettings =
      "{0}&flags=FCB.RelevanceSearchSpecialHandlingNoteEntity%3Dtrue";
    await this.Page.goto(advancedsettings.replace("{0}", url));
    await this.waitForAgentStatus();
  }

  public async navigatetoLink(url: string) {
    await this.Page.waitForTimeout(Constants.DefaultTimeout);
    await this.Page.goto(url);
    await this.waitForAgentStatus();
  }

  public async relevancesearchClickOLD() {
    try {
      await this.Page.waitForSelector(AgentChatConstants.RelevanceSearchNew);
      await this.Page.fill(AgentChatConstants.RelevanceSearchNew, "Relevance");
    } catch {
      await this.Page.waitForSelector(AgentChatConstants.RelevanceSearchButtom);
      await this.Page.click(AgentChatConstants.RelevanceSearchButtom);
      await this.Page.fill(
        AgentChatConstants.RelevanceInput,
        AgentChatConstants.RelavenceSearchInput
      );
    }
    await this.Page.click(AgentChatConstants.SearchIconClick);
    await this.Page.click(AgentChatConstants.ConverstionTabClick);
    await this.Page.click(AgentChatConstants.ClickRelevanceRecord);
    await this.waitForDomContentLoaded();
  }

  public async relevancesearchClick() {
    try {
      await this.Page.waitForSelector(AgentChatConstants.RelevanceSearchNew);
      await this.Page.fill(
        AgentChatConstants.RelevanceSearchNew,
        "LiveChatRelevanceWorkstream"
      );
    } catch {
      await this.Page.waitForSelector(AgentChatConstants.RelevanceSearchButtom);
      await this.Page.click(AgentChatConstants.RelevanceSearchButtom);
      await this.Page.fill(
        AgentChatConstants.RelevanceInput,
        AgentChatConstants.RelavenceSearchInput
      );
    }
    await this.Page.keyboard.press(FacebookMessangerConstants.Enterkey);
    await this.Page.waitForSelector(
      AgentChatConstants.RelevanceSearchItemClick
    );
    await this.Page.click(AgentChatConstants.RelevanceSearchItemClick);
    await this.waitForDomContentLoaded();
  }

  public async validateOngoingDashBoardForAgent() {
    const title = await this.Page.waitForSelector(
      SelectorConstants.OngoingTabConversationSelector
    );
    return title.isVisible();
  }

  public async validateoldtranscriptMessage() {
    let message;
    await this.waitForDomContentLoaded();
    try {
      await this.waitUntilSelectorIsVisible(
        AgentChatConstants.TransScriptContainer,
        AgentChatConstants.Five
      );
      message = await this.Page.waitForSelector(
        AgentChatConstants.TransScriptContainer
      );
    } catch {
      await this.waitUntilSelectorIsVisible(
        AgentChatConstants.TransScriptAgentContainer,
        AgentChatConstants.Five
      );
      message = await this.Page.waitForSelector(
        AgentChatConstants.TransScriptAgentContainer
      );
    }
    const transcriptmessage = await message.textContent();
    return transcriptmessage.includes(
      AgentChatConstants.RelavenceSearchMessage
    );
  }

  public async validatenewtranscriptMessage() {
    await this.waitForDomContentLoaded();
    await this.waitUntilSelectorIsVisible(
      SelectorConstants.TranscriptIFrame,
      AgentChatConstants.Three
    );
    const IFrame1 = await this.Page.$(SelectorConstants.TranscriptIFrame);
    const IFrame2 = await IFrame1.contentFrame();
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.CustomControl,
      AgentChatConstants.Five
    );
    const iFrame3 = await IFrame2.waitForSelector(
      AgentChatConstants.CustomControl
    );
    const transcriptmessage = await iFrame3.waitForSelector(
      AgentChatConstants.TransScriptnewContainer
    );
    const value = await transcriptmessage.textContent();
    if (value.includes("Live Chat")) {
      return true;
    }
  }

  public async VerifyProactiveContextVariable(keySelector, KeyName) {
    const context = await this.Page.waitForSelector(keySelector);
    const contextLabel = await context.textContent();
    return contextLabel === KeyName;
  }

  public async OpenAdditionDetailTab() {
    const additionalDetailsTabButton = await this.Page.waitForSelector(
      AgentConversationPageConstants.AdditionalDetailsTabButtonSelector,
      { timeout: 10000 }
    );
    await additionalDetailsTabButton.click();
  }

  public async OpenConversationDetailFlyout() {
    const additionalDetailsTabButton = await this.Page.waitForSelector(
      SelectorConstants.AdditionalDetails
    );
    await additionalDetailsTabButton.click();
    await this.Page.click(SelectorConstants.AdditionalDetails);
  }

  public async validateSentMessage(message: string) {
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    const systemMessage = await iframe.waitForSelector(
      AgentConversationPageConstants.ChatArea
    );
    const entityItemText = await systemMessage.textContent();
    if (entityItemText.search(message) != -1) {
      return true;
    }
  }

  public async messageToAgent(Exists, page: any) {
    if (!Exists) {
      await page.SendMessageToAgent(TwitterAccountConstants.MessageToAgent);
    }
  }

  public async sendMessageRequiredTimes(Count, page: any) {
    while (Count) {
      await page.SendMessageToAgent(TwitterAccountConstants.MessageToAgent);
      Count = Count - 1;
    }
  }

  public async sendSearchedKBArticle() {
    const outerIframe = await this.Page.waitForSelector(
      PageConstants.OuterdivforKB
    );
    const customParentIFrame = await outerIframe.contentFrame();
    const customInnerIFrame = await customParentIFrame.$(
      PageConstants.ChildKBIframe
    );
    const customChildIFrame = await customInnerIFrame.contentFrame();
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.SendArticle,
      AgentChatConstants.Three
    );
    await customChildIFrame.click(AgentChatConstants.SendArticle);
    const messageFrame: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    await messageFrame.$eval(AgentChatConstants.SendMessageButton, (el) => {
      (el as HTMLElement).scrollIntoView();
      (el as HTMLElement).click();
    });
  }

  public async openReconnectQuickReply() {
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.MessageTextArea,
      AgentChatConstants.Three,
      iframe,
      Constants.MaxTimeout
    );
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.QuickRepliesBtnSelector,
      AgentChatConstants.Five,
      iframe,
      Constants.MaxTimeout
    );
    const textarea = await iframe.waitForSelector(
      AgentChatConstants.MessageTextArea
    );
    await textarea.fill("");
    const searchTxt: string = "/q " + QuickReplies.ReconnectQuickTagName;
    await textarea.type(searchTxt, { delay: 100 });
    await this._page.keyboard.press(AgentChatConstants.SpaceKeyword);
    await this.waitUntilQuickReplyIsVisible(
      AgentChatConstants.QuickRepliesValSelector,
      AgentChatConstants.NoResultFoundMsgSelector,
      textarea,
      Constants.Five,
      iframe,
      Constants.MaxTimeout
    );

    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.QuickReplyValSelector.replace(
        "{0}",
        QuickReplies.ReconnectQuickTagName
      ),
      AgentChatConstants.Five,
      iframe,
      Constants.MaxTimeout
    );

    await iframe.$eval(
      AgentChatConstants.QuickReplyValSelector.replace(
        "{0}",
        QuickReplies.ReconnectQuickTagName
      ),
      (el) => {
        (el as HTMLElement).click();
      }
    );

    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.QuickReplyValSelector.replace(
        "{0}",
        QuickReplies.ReconnectQuickTagName
      ),
      AgentChatConstants.Five,
      iframe,
      Constants.MaxTimeout
    );

    await iframe.$eval(
      AgentChatConstants.QuickReplyValSelector.replace(
        "{0}",
        QuickReplies.ReconnectQuickTagName
      ),
      (el) => {
        (el as HTMLElement).click();
      }
    );

    await iframe.$eval(AgentChatConstants.SendMessageButton, (el) => {
      (el as HTMLElement).scrollIntoView();
      (el as HTMLElement).click();
    });
  }

  public async validateReconnectUrlIsNotResolved() {
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    return await this.waitUntilFrameSelectorIsVisible(
      AgentChatConstants.ReconnectURLNotResolveSelector.replace(
        "{0}",
        AgentChatConstants.ReconnectUrlMessage
      ),
      iframe
    );
  }

  public async DisconnectSystemMessage() {
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    await iframe.waitForSelector(
      AgentChatConstants.CustomerEndedConversationXpath
    );
  }

  public async navigateToKBArticle() {
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    await iframe.waitForSelector(AgentChatConstants.KBMoreLink);
    await iframe.$eval(AgentChatConstants.KBMoreLink, (el) => {
      (el as HTMLElement).scrollIntoView();
      (el as HTMLElement).click();
    });
    await iframe.waitForSelector(AgentChatConstants.KBArticleBottomBar);
    await iframe.$eval(AgentChatConstants.KBArticleBottomBar, (el) => {
      (el as HTMLElement).scrollIntoView();
      (el as HTMLElement).click();
    });
  }

  public async validateAgentStatus(stauts: string) {
    const status = await this.Page.waitForSelector(
      AgentChatConstants.Stauts.replace("{0}", stauts)
    );
    return status;
  }

  public async validateWaitingState() {
    await this.waitUntilSelectorIsVisible(AgentChatConstants.RefreshAllTab);
    const refreshAll = await this.Page.waitForSelector(
      AgentChatConstants.RefreshAllTab
    );
    await refreshAll.click();
    const waitingState = await this.Page.waitForSelector(
      AgentChatConstants.WaitingState
    );
    return waitingState;
  }

  public async verifyNewRecordDisappearsInOpenWS(
    openWSRecordCountValue: number
  ) {
    return await this.waitUntilNewRecordDisappearsInOpenWS(
      AgentChatConstants.OpenWsRecordCountSelector,
      openWSRecordCountValue,
      Constants.Three,
      Constants.OpenWsWaitTimeout
    );
  }

  public async waitUntilNewRecordDisappearsInOpenWS(
    selectorVal: string,
    oldOpenWSRecordValue: number = 0,
    maxCount: number = Constants.Three,
    timeout: number = Constants.OpenWsWaitTimeout
  ) {
    let dataCount = 0;
    let pageObject = this.Page;
    while (dataCount < maxCount) {
      try {
        await pageObject.click(AgentChatConstants.RefreshAllTab);
        const openWorkStreamRecordCountSelector =
          await pageObject.waitForSelector(selectorVal, { timeout });
        const openWorkStreamRecord =
          openWorkStreamRecordCountSelector.textContent();
        if (
          openWorkStreamRecord !== null &&
          openWorkStreamRecord !== undefined
        ) {
          const str = (await openWorkStreamRecord).toString();
          if (str !== "") {
            if (!isNaN(+str)) {
              const newOpenWSRecordValue: number = +str;
              if (
                newOpenWSRecordValue == 0 ||
                newOpenWSRecordValue < oldOpenWSRecordValue
              ) {
                return true;
              }
            }
          }
        }
      } catch (error) {
        console.log(`Method waitUntilNewRecordDisappearsInOpenWS throwing exception with message: ${error.message}`);
      }
      dataCount++;
    }
    return false;
  }

  public async sendMessageFromCustomer(
    count: number,
    page: any,
    message: string
  ) {
    for (let i = 0; i <= count; i++) {
      await page.SendMessageToAgent(message);
    }
  }

  public async waitforaudiorendered(timeout: number = 10000) {
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    await iframe.waitForSelector("audio", { timeout });
  }

  public async pagerender() {
    this.Page.keyboard.press(Constants.PageRefresh);
    await this.waitforaudiorendered();
  }

  public async validatedownloadbutton() {
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    const textarea = await iframe.waitForSelector(
      AgentChatConstants.videoControl
    );
    (await textarea.getAttribute("controlslist")) === "nodownload";
  }

  public async createWeChatAgentNotes() {
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.NotesButton,
      AgentChatConstants.Five,
      iframe,
      Constants.MaxTimeout
    );
    await iframe.$eval(AgentChatConstants.NotesButton, (el) => {
      (el as HTMLElement).click();
    });
    const iframeNotesPanel: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeWidgetValue
    );
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.TextAreaNotes,
      AgentChatConstants.Five,
      iframeNotesPanel,
      Constants.MaxTimeout
    );
    await iframeNotesPanel.fill(
      AgentChatConstants.TextAreaNotes,
      Constants.AgentNotesData
    );
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.AddNotesBtn,
      AgentChatConstants.Five,
      iframeNotesPanel,
      Constants.OpenWsWaitTimeout
    );
    await iframeNotesPanel.$eval(AgentChatConstants.AddNotesBtn, (el) => {
      (el as HTMLElement).click();
    });
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.SaveRecord,
      AgentChatConstants.Two,
      this.Page,
      Constants.MaxTimeout
    );
  }

  public async validateSmartAssist() {
    await this.waitForDomContentLoaded();
    await this._page.waitForSelector(
      SmartAssistConstants.SmartAssistTabSelector,
      { timeout: Constants.WaitingHalfMinute as any }
    );
  }

  public async waitForSmartAssistControlToLoad() {
    await this.waitForDomContentLoaded();
    await this._page.waitForSelector(
      SmartAssistConstants.SmartAssistAnyEntityContainerSelector,
      { timeout: Constants.WaitingOneMinute as any }
    );
  }

  public async ClickOnSmartassistTool() {
    try {
      await this._page.waitForSelector(
        SmartAssistConstants.SmartAssistTabSelector,
        { timeout: Constants.DefaultTimeout as any }
      );
    } catch {
    } finally {
      await this._page.waitForSelector(
        SmartAssistConstants.SmartAssistTabSelector
      );
      await this._page.click(SmartAssistConstants.SmartAssistTabSelector);
    }
  }

  public async VeirfyAIDisableMessageAppearing() {
    const label = await this._page.waitForSelector(
      SmartAssistConstants.SmartAssistNoSuggestionSelector
    );
    const text = await label.textContent();
    return text === "AI suggestions not turned on.";
  }

  public async OpenFirstContactInNewSession() {
    await this._page.click(AgentChatConstants.CreateNewTabSelector);
    await this._page.waitForSelector(AgentChatConstants.ContactsTabSelector);
    await this._page.click(AgentChatConstants.ContactsTabSelector);
    await this._page.click(AgentChatConstants.ContactsDropDown);
    await this._page.waitForSelector(
      AgentChatConstants.ContactsDropDownSelector
    );
    await this._page.click(AgentChatConstants.ContactsDropDownSelector);
    await this._page.waitForSelector(SmartAssistConstants.GridRowSelector, {
      timeout: Constants.MaxTimeout as any,
    });
    await this._page.hover(SmartAssistConstants.GridRowSelector);
    await this._page.click(SmartAssistConstants.GridRowSelector, {
      modifiers: ["Shift"],
    });
  }

  public async VeirfyEmptyMessageForCase() {
    try {
      await this.waitForDomContentLoaded();
      await this._page.waitForSelector(
        SmartAssistConstants.SmartAssistEmptyCaseMessageSelector,
        { timeout: Constants.WaitingOneMinute as any }
      );
      return true;
    } catch {
      return false;
    }
  }

  public async VeirfyEmptyMessageForKb() {
    try {
      await this.waitForDomContentLoaded();
      await this._page.waitForSelector(
        SmartAssistConstants.SmartAssistEmptyKBMessageSelector,
        { timeout: Constants.WaitingOneMinute as any }
      );
      return true;
    } catch {
      return false;
    }
  }

  public async verifyFPBEventMessage() {
    try {
      await this._page.waitForSelector(
        SmartAssistConstants.SmartAssistFPBEventSelector,
        { timeout: Constants.DefaultTimeout as any }
      );
      return true;
    } catch {
      return false;
    }
  }

  public async verifyAISuggestionLoaded() {
    try {
      await this.waitForDomContentLoaded();
      await this._page.waitForSelector(
        SmartAssistConstants.SmartAssistCardContainerSelector,
        { timeout: Constants.WaitingOneMinute as any }
      );
      return true;
    } catch (e) {
      return false;
    }
  }

  public async toggleInfoIconForKeywords() {
    await this._page.waitForSelector(
      SmartAssistConstants.SmartAssistInfoIconSelector
    );
    await this._page.click(SmartAssistConstants.SmartAssistInfoIconSelector);
  }

  public async ClickOnElipsisOnSuggestionCard() {
    await this._page.waitForSelector(
      SmartAssistConstants.SmartAssistCardElipsisSelector
    );
    await this._page.click(SmartAssistConstants.SmartAssistCardElipsisSelector);
  }

  public async ClickOnSuggestionCardAction() {
    await this.waitUntilSelectorIsVisible(
      SmartAssistConstants.SmartAssistCardActionSelector,
      Constants.FiveThousand,
      this._page,
      Constants.MaxTimeout
    );
    await this._page.waitForSelector(
      SmartAssistConstants.SmartAssistCardActionSelector
    );
    await this._page.click(SmartAssistConstants.SmartAssistCardActionSelector);
  }

  public async verifySuggestionCardBtnTurnsGreenOnYes() {
    try {
      await this._page.waitForSelector(
        SmartAssistConstants.SmartAssistCardYesFeedbackSelector
      );
      await this._page.click(
        SmartAssistConstants.SmartAssistCardYesFeedbackSelector
      );
      await this._page.waitForSelector(
        SmartAssistConstants.SmartAssistCardYesFeedbackColorSelector
      );
      return true;
    } catch {
      return false;
    }
  }

  public async verifySuggestionDisappearOnNoFeedback() {
    try {
      const firstCardId = await (
        await this._page.waitForSelector(
          SmartAssistConstants.SmartAssistSuggestionSelector
        )
      ).getAttribute("id");
      await this._page.click(
        SmartAssistConstants.SmartAssistCardNoFeedbackSelector
      );
      return await this.waitUntilSuggestionCardIsVisible(
        firstCardId,
        Constants.Six,
        this.Page,
        Constants.DefaultTimeout
      );
    } catch {
      return false;
    }
  }

  public async VerifyAISuggestionTriggered() {
    try {
      await this._page.waitForSelector(
        SmartAssistConstants.SmartAssistCardLoaderSelector,
        { timeout: Constants.WaitingHalfMinute as any }
      );
      return true;
    } catch (e) {
      return false;
    }
  }

  public async VerifyBluebandIsAppearingOnSugestionCards() {
    try {
      await this._page.waitForSelector(
        SmartAssistConstants.SmartAssistCardBlueBandSelector,
        { timeout: Constants.MaxTimeout as any }
      );
      return true;
    } catch (e) {
      return false;
    }
  }

  public async VerifyCaseSAConfigLoaded() {
    try {
      await this._page.waitForSelector(
        SmartAssistConstants.SmartAssistCaseTitleSelector,
        { timeout: Constants.WaitingHalfMinute as any }
      );
      return true;
    } catch (e) {
      return false;
    }
  }

  public async VerifyKBSAConfigLoaded() {
    try {
      await this._page.waitForSelector(
        SmartAssistConstants.SmartAssistKBTitleSelector,
        { timeout: Constants.WaitingHalfMinute as any }
      );
      return true;
    } catch (e) {
      return false;
    }
  }

  public async VerifyContextualMessageAppeared() {
    let result = false;
    try {
      await this._page.waitForSelector(
        SmartAssistConstants.SmartAssistSuccessContextualMsgSelector
      );
      result = true;
    } catch (e) {
      try {
        await this._page.waitForSelector(
          SmartAssistConstants.SmartAssistErrorContextualMsgSelector
        );
        result = true;
      } catch (error) {
        console.log(`Method VerifyContextualMessageAppeared throwing exception with message: ${error.message}`);
      }
    } finally {
      return result;
    }
  }

  public async validateWhatsAppConversationTitle() {
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );

    return await this.waitUntilSelectorIsVisible(
      AgentChatConstants.ConversationTitleSelector.replace(
        "{0}",
        this.ConversationTitleName
      ),
      AgentChatConstants.Three,
      iframe,
      Constants.MaxTimeout
    );
  }

  public async validateWhatsAppConversationTitleInClosedWS(titleName: string) {
    this.ConversationTitleName = this.ConversationTitleName.replace("+", "");
    return await this.waitUntilSelectorIsVisible(
      AgentChatConstants.ClosedConversationTitleSelector.replace(
        "{0}",
        titleName
      ),
      AgentChatConstants.Three,
      this._page,
      Constants.MaxTimeout
    );
  }

  public async validateLiveChatConversationTitleInClosedWS() {
    this.ConversationTitleName = this.ConversationTitleName.substring(0, 6);
    return await this.waitUntilSelectorIsVisible(
      AgentChatConstants.ClosedConversationTitleSelector.replace(
        "{0}",
        this.ConversationTitleName
      ),
      AgentChatConstants.Three,
      this._page,
      Constants.MaxTimeout
    );
  }

  public async validateTwitterChatHeaderForOldValue() {
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    const title = await (
      await iframe.waitForSelector(AgentChatConstants.HeaderTitle)
    ).textContent();
    const text = /Playwright Twitter/gi;
    return title.search(text) != -1;
  }

  public async goBack() {
    await this.waitUntilSelectorIsVisible(AgentChatConstants.BackRecordLink);
    await this.Page.click(AgentChatConstants.BackRecordLink);
  }

  public async validateSocialProfileWeChat() {
    const isContactAvailable = await this.waitUntilSelectorIsVisible(
      AgentChatConstants.SearchCustomerInputSelector,
      Constants.Five,
      this._page,
      Constants.DefaultTimeout
    );
    if (!isContactAvailable) {
      const customerLangInputFlag = await this.waitUntilSelectorIsVisible(
        AgentChatConstants.CustomerLanguageInput,
        Constants.Five,
        this._page,
        Constants.DefaultTimeout
      );
      if (customerLangInputFlag) {
        await this._page.hover(AgentChatConstants.CustomerLanguageInput);
        await this._page.focus(AgentChatConstants.CustomerLanguageInput);
        await this._page.hover(AgentChatConstants.CustomerLanguageInput);
        const contactInput = await this.Page.waitForSelector(
          AgentChatConstants.CustomerLanguageInput
        );
        await contactInput.fill(this.contactRecordName);
        await this.Page.click(AgentChatConstants.CustomerLanguageSearch);
        await this.waitUntilSelectorIsVisible(
          AgentChatConstants.CustomerLanguageLookupValue.replace(
            "{0}",
            this.contactRecordName
          ),
          Constants.Five,
          this._page,
          Constants.DefaultTimeout
        );
        await this.Page.click(
          AgentChatConstants.CustomerLanguageLookupValue.replace(
            "{0}",
            this.contactRecordName
          )
        );
      }
    }
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.ClickAvailableContact,
      Constants.Five,
      this._page,
      Constants.DefaultTimeout
    );
    await this.Page.click(AgentChatConstants.ClickAvailableContact);
    await this.waitUntilSelectorIsVisible(AgentChatConstants.RelatedTab);
    await this.Page.click(AgentChatConstants.RelatedTab);
    const entityListItem = await this.Page.waitForSelector(
      AgentChatConstants.SocialProfile
    );
    await entityListItem.click();
    const customerFlag = await this.waitUntilSelectorIsVisible(
      AgentChatConstants.CustomerName,
      Constants.Three,
      this._page,
      Constants.MaxTimeout
    );
    const sessionProfileTitle = await this.waitUntilSelectorIsVisible(
      AgentChatConstants.SocialProfileTitleSelector,
      Constants.Three,
      this._page,
      Constants.MaxTimeout
    );
    if (customerFlag) {
      const customer = await this.Page.waitForSelector(
        AgentChatConstants.CustomerName
      );
      const customerName = await customer.textContent();
      const sessionTitle = await this.waitUntilSelectorIsVisible(
        AgentChatConstants.SocialProfileCustomerTitleSelector.replace(
          "{0}",
          customerName
        ),
        Constants.Three,
        this._page,
        Constants.MaxTimeout
      );
      const sessionProfileTitle = await this.waitUntilSelectorIsVisible(
        AgentChatConstants.SocialProfileTitleSelector,
        Constants.Three,
        this._page,
        Constants.MaxTimeout
      );
      return sessionTitle || sessionProfileTitle;
    }
    return !!sessionProfileTitle;
  }

  public async unlinkContact() {
    var existingRecordFlag = false;
    existingRecordFlag = await this.waitUntilSelectorIsVisible(
      AgentChatConstants.SearchCustomerInputSelector,
      Constants.Three,
      null,
      Constants.MaxTimeout
    );
    if (existingRecordFlag) {
      await this.RemoveContactFromConveration();
    }
  }

  public async clearAgentChatSession() {
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.RemoveConversationButtonClass,
      Constants.Three,
      this._page,
      Constants.MaxTimeout
    );
    await this._page.$eval(
      AgentChatConstants.RemoveConversationButtonClass,
      (el) => (el as HTMLElement).click()
    );
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.ConfirmButtonId,
      Constants.Three,
      this._page,
      Constants.MaxTimeout
    );
    await this._page.$eval(AgentChatConstants.ConfirmButtonId, (el) =>
      (el as HTMLElement).click()
    );
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.RefreshAllTab,
      Constants.Three,
      this._page,
      Constants.MaxTimeout
    );
  }

  /// </summary>
  /// This method is used to clear unused chat conversation from agent end which generally remains unclosed if some test case failed.
  /// </summary>
  public async closeUnusedOCAgentChat() {
    try {
      const iframeCC = await IFrameHelper.GetIframe(
        this._page,
        IFrameConstants.IframeCC
      );
      let chatEnable: boolean = false;
      const endBtnDisable = await this.waitUntilSelectorIsVisible(
        AgentChatConstants.EndConversationBtnDisabledXPath,
        AgentChatConstants.Three,
        iframeCC,
        Constants.OpenWsWaitTimeout
      );
      if (!endBtnDisable) {
        const endBtnEnable = await this.waitUntilSelectorIsVisible(
          AgentChatConstants.EndConversationBtnXPath,
          AgentChatConstants.Two,
          iframeCC,
          Constants.FourThousandsMiliSeconds
        );
        if (endBtnEnable) {
          await iframeCC.$eval(
            AgentChatConstants.EndConversationBtnXPath,
            (el) => (el as HTMLElement).click()
          );
          chatEnable = true;
        }
      } else {
        chatEnable = true;
      }
      if (chatEnable) {
        await this._page.$eval(
          AgentChatConstants.RemoveConversationBtnClass,
          (el) => (el as HTMLElement).click()
        );
        await this.waitUntilSelectorIsVisible(
          AgentChatConstants.ConfirmButtonId,
          Constants.Three,
          this._page,
          Constants.MaxTimeout
        );
        await this._page.$eval(AgentChatConstants.ConfirmButtonId, (el) =>
          (el as HTMLElement).click()
        );
      }
    } catch (error) {
      console.log(`Method waitUntilNewRecordAppearsInOpenWS throwing exception with message: ${error.message}`);
    }
  }

  public async validateConsultingMessageInChatBox(page: Page, message: string) {
    const iframe: Page = await IFrameHelper.GetIframe(
      page,
      IFrameConstants.IframeCC
    );
    return await this.waitUntilSelectorIsVisible(
      AgentChatConstants.ChatMessageSelector.replace("{0}", message),
      AgentChatConstants.Five,
      iframe,
      AgentChatConstants.TwoThousand
    );
  }

  public async TryGetReconnectBanner(timeout: number = 15000) {
    await this._page
      .waitForSelector(AgentConversationPageConstants.ReconnectBanner, {
        timeout: timeout,
      })
      .catch(() => { });
    return await this._page.$(AgentConversationPageConstants.ReconnectBanner);
  }

  public async waitUntilOpenWorkItemsUpdated(intitalOpenWorkItemCount: number) {
    let openWorkItemCount: number;
    let isCountIncreased: boolean = false;
    await this.Page.click(SelectorConstants.RefreshDashBoard);
    await this.Page.waitForSelector(
      AgentChatConstants.OpenWsRecordCountSelector
    );
    openWorkItemCount = await this.getOpenWSRecordCount();
    if (intitalOpenWorkItemCount >= openWorkItemCount) {
      for (let i = 0; i <= 30; i++) {
        await this.Page.click(SelectorConstants.RefreshDashBoard);
        await this.waitUntilSelectorIsVisible(
          AgentChatConstants.OpenWsRecordCountSelector
        );
        openWorkItemCount = await this.getOpenWSRecordCount();
        if (openWorkItemCount > intitalOpenWorkItemCount) {
          return (isCountIncreased = true);
        }
      }
    } else {
      return true;
    }
    return isCountIncreased;
  }

  public async validateInternalMessage() {
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    await iframe.waitForSelector(AgentChatConstants.ConsultOtherAgent);
    const internalMessage = await this.waitUntilSelectorIsVisible(
      AgentChatConstants.InternalMessage,
      AgentChatConstants.Three,
      iframe
    );
    if (internalMessage === false) return false;
    return await this.validateBackToPublicMessage(iframe);
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
  public async validatePickScenario(
    chatSubjectCustomerName: string,
    userName: string
  ) {
    await this.NavigateToOnlineConversationTab();
    await this.waitUntilSelectorIsVisible(
      SelectorConstants.OngoingDashboardAssignButton,
      AgentChatConstants.Three,
      this.Page,
      AgentChatConstants.FourThousand
    );
    await this.VerifyConversationSentiment(
      chatSubjectCustomerName,
      ConversationStatesConstants.Open
    );
    await this.selectTheConversation(
      chatSubjectCustomerName,
      ConversationStatesConstants.Open
    );
    await this.AssignChat(userName);
    expect(await this.AssignedInvitationToChatSucceed()).toBeTruthy();
  }

  public async validateMonitorScenariobyMessage(
    queue: string,
    chatSubjectCustomerName: string,
    message: string
  ) {
    await this.monitorTheConversation(queue, chatSubjectCustomerName);
    expect(await this.validateAgentMessage(message)).toBeTruthy();
  }

  public async validateMonitorScenariobyMessageCount(
    queue: string,
    chatSubjectCustomerName: string,
    count: number
  ) {
    await this.monitorTheConversation(queue, chatSubjectCustomerName);
  }

  public async monitorConversation(chatSubjectCustomerName: string) {
    await this.selectTheConversation(
      chatSubjectCustomerName,
      ConversationStatesConstants.Active
    );
    const button = await this.Page.waitForSelector(
      SelectorConstants.OngoingDashboardMonitorButton
    );
    await button.click();
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.MessageTextArea,
      AgentChatConstants.Ten
    );
  }

  public async joinConversation() {
    const iframeCC = await IFrameHelper.GetIframe(
      this._page,
      IFrameConstants.IframeCC
    );
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.JoinChat,
      AgentChatConstants.Three,
      iframeCC,
      Constants.MaxTimeout
    );
    await iframeCC.$eval(AgentChatConstants.JoinChat, (el) =>
      (el as HTMLElement).click()
    );
  }

  public async joinConsult() {
    const iframeCC = await IFrameHelper.GetIframe(
      this._page,
      IFrameConstants.IframeCC
    );
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.JoinConsult,
      AgentChatConstants.Three,
      iframeCC,
      Constants.MaxTimeout
    );
    await iframeCC.$eval(AgentChatConstants.JoinConsult, (el) =>
      (el as HTMLElement).click()
    );
  }

  public async validateChatMonitor() {
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.MessageTextArea,
      AgentChatConstants.Three
    );
    const iframeCC = await IFrameHelper.GetIframe(
      this._page,
      IFrameConstants.IframeCC
    );
    const title = await iframeCC.waitForSelector(
      AgentChatConstants.JoinConversation
    );
    const result = await title.innerText();
    return result;
  }

  public async AssignChatToAgent(agentName: string, channel: string) {
    await this._page.click(AgentChatConstants.RefreshAllTab);
    await this.waitUntilSelectorIsVisible(
      SelectorConstants.OngoingDashboardAssignButton,
      AgentChatConstants.Three,
      this.Page,
      AgentChatConstants.FourThousand
    );
    await this.waitUntilSelectorIsVisible(
      SelectorConstants.OngoingDashboardItem.replace("{0}", channel)
    );
    await this.Page.click(
      SelectorConstants.OngoingDashboardItem.replace("{0}", channel)
    );
    await this._page.click(SelectorConstants.AssignIconSelector);
    await this._page.waitForSelector(
      SelectorConstants.AssignChatToAgent.replace("{0}", agentName)
    );
    await this._page.click(
      SelectorConstants.AssignChatToAgent.replace("{0}", agentName)
    );
    await this._page.click(SelectorConstants.AssignBtnSelector);
  }

  public async validateMessage() {
    await this.Page.waitForSelector(AgentChatConstants.WarningMessageList);
    await this.Page.click(AgentChatConstants.WarningMessageList);

    var message = await this.Page.waitForSelector(
      AgentChatConstants.WarningMessage
    );
    const entityItemText = await message.textContent();
    var text = /Your presence was changed to/gi;
    if (entityItemText.search(text) != -1) {
      return true;
    }
  }

  public async validateSocialProfileTwilio() {
    const isContactAvailable = await this.waitUntilSelectorIsVisible(
      AgentChatConstants.SearchCustomerInputSelector,
      Constants.Five,
      this._page,
      Constants.DefaultTimeout
    );
    if (!isContactAvailable) {
      const customerLangInputFlag = await this.waitUntilSelectorIsVisible(
        AgentChatConstants.CustomerLanguageInput,
        Constants.Five,
        this._page,
        Constants.DefaultTimeout
      );
      if (customerLangInputFlag) {
        await this._page.hover(AgentChatConstants.CustomerLanguageInput);
        await this._page.focus(AgentChatConstants.CustomerLanguageInput);
        await this._page.hover(AgentChatConstants.CustomerLanguageInput);
        const contactInput = await this.Page.waitForSelector(
          AgentChatConstants.CustomerLanguageInput
        );
        await contactInput.fill(this.contactRecordName);
        await this.Page.click(AgentChatConstants.CustomerLanguageSearch);
        await this.waitUntilSelectorIsVisible(
          AgentChatConstants.CustomerLanguageLookupValue.replace(
            "{0}",
            this.contactRecordName
          ),
          Constants.Five,
          this._page,
          Constants.DefaultTimeout
        );
        await this.Page.click(
          AgentChatConstants.CustomerLanguageLookupValue.replace(
            "{0}",
            this.contactRecordName
          )
        );
      }
    }
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.ClickAvailableContact,
      Constants.Five,
      this._page,
      Constants.DefaultTimeout
    );
    await this.Page.click(AgentChatConstants.ClickAvailableContact);
    await this.waitUntilSelectorIsVisible(AgentChatConstants.RelatedTab);
    await this.Page.click(AgentChatConstants.RelatedTab);
    const entityListItem = await this.Page.waitForSelector(
      AgentChatConstants.SocialProfile
    );
    await entityListItem.click();
    const customerFlag = await this.waitUntilSelectorIsVisible(
      AgentChatConstants.CustomerName,
      Constants.Three,
      this._page,
      Constants.MaxTimeout
    );
    const sessionProfileTitle = await this.waitUntilSelectorIsVisible(
      AgentChatConstants.SocialProfileTitleSelector,
      Constants.Three,
      this._page,
      Constants.MaxTimeout
    );
    if (customerFlag) {
      const customer = await this.Page.waitForSelector(
        AgentChatConstants.CustomerName
      );
      const customerName = await customer.textContent();
      const sessionTitle = await this.waitUntilSelectorIsVisible(
        AgentChatConstants.SocialProfileCustomerTitleSelector.replace(
          "{0}",
          customerName
        ),
        Constants.Three,
        this._page,
        Constants.MaxTimeout
      );
      const sessionProfileTitle = await this.waitUntilSelectorIsVisible(
        AgentChatConstants.SocialProfileTitleSelector,
        Constants.Three,
        this._page,
        Constants.MaxTimeout
      );
      return sessionTitle || sessionProfileTitle;
    }
    return !!sessionProfileTitle;
  }

  public async validateWhatsAppNumberInNotificationPopUp() {
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.AcceptButtonId,
      AgentChatConstants.Two,
      this._page,
      AgentChatConstants.AgentPopUpWaitingTimeout
    );
    return await this.waitUntilSelectorIsVisible(
      AgentChatConstants.WhatsAppNewTitleSelector.replace(
        "{0}",
        this.CustomerFullName
      ),
      AgentChatConstants.Two,
      this._page,
      AgentChatConstants.FiveThousandsMiliSecondsWaitTimeout
    );
  }

  public async validateSocialProfileWhatsApp() {
    const isContactAvailable = await this.waitUntilSelectorIsVisible(
      AgentChatConstants.SearchCustomerInputSelector,
      Constants.Five,
      this._page,
      Constants.DefaultTimeout
    );
    if (!isContactAvailable) {
      const customerLangInputFlag = await this.waitUntilSelectorIsVisible(
        AgentChatConstants.CustomerLanguageInput,
        Constants.Five,
        this._page,
        Constants.DefaultTimeout
      );
      if (customerLangInputFlag) {
        await this._page.hover(AgentChatConstants.CustomerLanguageInput);
        await this._page.focus(AgentChatConstants.CustomerLanguageInput);
        await this._page.hover(AgentChatConstants.CustomerLanguageInput);
        const contactInput = await this.Page.waitForSelector(
          AgentChatConstants.CustomerLanguageInput
        );
        await contactInput.fill(this.contactRecordName);
        await this.Page.click(AgentChatConstants.CustomerLanguageSearch);
        await this.waitUntilSelectorIsVisible(
          AgentChatConstants.CustomerLanguageLookupValue.replace(
            "{0}",
            this.contactRecordName
          ),
          Constants.Five,
          this._page,
          Constants.DefaultTimeout
        );
        await this.Page.click(
          AgentChatConstants.CustomerLanguageLookupValue.replace(
            "{0}",
            this.contactRecordName
          )
        );
      }
    }
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.ClickAvailableContact,
      Constants.Five,
      this._page,
      Constants.DefaultTimeout
    );
    await this.Page.click(AgentChatConstants.ClickAvailableContact);
    await this.waitUntilSelectorIsVisible(AgentChatConstants.RelatedTab);
    await this.Page.click(AgentChatConstants.RelatedTab);
    const entityListItem = await this.Page.waitForSelector(
      AgentChatConstants.SocialProfile
    );
    await entityListItem.click();
    const customerFlag = await this.waitUntilSelectorIsVisible(
      AgentChatConstants.CustomerName,
      Constants.Three,
      this._page,
      Constants.MaxTimeout
    );
    const sessionProfileTitle = await this.waitUntilSelectorIsVisible(
      AgentChatConstants.SocialProfileTitleSelector,
      Constants.Three,
      this._page,
      Constants.MaxTimeout
    );
    if (customerFlag) {
      const customer = await this.Page.waitForSelector(
        AgentChatConstants.CustomerName
      );
      const customerName = await customer.textContent();
      const sessionTitle = await this.waitUntilSelectorIsVisible(
        AgentChatConstants.SocialProfileCustomerTitleSelector.replace(
          "{0}",
          customerName
        ),
        Constants.Three,
        this._page,
        Constants.MaxTimeout
      );
      const sessionProfileTitle = await this.waitUntilSelectorIsVisible(
        AgentChatConstants.SocialProfileTitleSelector,
        Constants.Three,
        this._page,
        Constants.MaxTimeout
      );
      return sessionTitle || sessionProfileTitle;
    }
    return !!sessionProfileTitle;
  }

  public async executeScript(script: string) {
    return await this.Page.evaluate((scr) => {
      return eval(scr);
    }, script);
  }

  public async linkToConveration(entityName: string, recordId: string) {
    return await this.executeScript(
      `Microsoft.Omnichannel.linkToConversation('${entityName}', '${recordId}');`
    );
  }

  public async unlinkFromConversation(entityName: string, recordId: string) {
    return await this.executeScript(
      `Microsoft.Omnichannel.unlinkFromConversation('${entityName}', '${recordId}');`
    );
  }

  public async createRecord(entityLogicalName: string, data: any) {
    return await this.executeScript(
      `Xrm.WebApi.createRecord('${entityLogicalName}', ${JSON.stringify(data)})`
    );
  }

  public async retrieveMultipleRecords(
    entityName: string,
    queryString: string
  ) {
    const result = await this.executeScript(
      `Xrm.WebApi.retrieveMultipleRecords("${entityName}",${JSON.stringify(
        queryString
      )})`
    );
    expect(result).toBeTruthy();
    return result.entities;
  }

  public async createAccountRecord(name: string) {
    return await this.createRecord(EntityNames.Account, {
      [EntityAttributes.Name]: name,
    });
  }

  public async createContactRecord(lastName: string) {
    return await this.createRecord(EntityNames.Contact, {
      [EntityAttributes.Lastname]: lastName,
    });
  }

  public async getUserByEmailId(userEmailId: string) {
    let query: string =
      "?$select=systemuserid&$filter=internalemailaddress eq '" +
      userEmailId +
      "'";
    return await this.retrieveMultipleRecords(EntityNames.SystemUser, query);
  }
  public async getLatestConversation(queueid: string) {
    let query: string =
      "?$select=statecode,statuscode,_ownerid_value&$orderby=createdon%20desc&$top=1";
    if (Boolean(queueid))
      query += "&$filter=_msdyn_cdsqueueid_value eq '" + queueid + "'";
    return await this.retrieveMultipleRecords("msdyn_ocliveworkitem", query);
  }

  public async getConversations(input: object) {
    return await this.executeScript(
      `Microsoft.Omnichannel.getConversations(${JSON.stringify(input)});`
    );
  }

  public async getConversationsByStatus(agentId: string, status: string[]) {
    let FetchXmlOrderByClause = {
      attributeName: Constants.CreatedOn,
      descending: true,
    };
    let input = {
      attributes: [
        EntityAttributes.Msdyn_Title,
        EntityAttributes.Msdyn_channel,
        EntityAttributes.Msdyn_OCLiveWorkItemId,
      ],
      orderBy: [FetchXmlOrderByClause],
      agentId: agentId,
      createdBeforeDays: 0,
      status: status,
    };
    return await this.getConversations(input);
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

  public async validateSuccessfulData() {
    const message = TestSettings.TeamsSkillName;
    await this.waitForDomContentLoaded();
    const title = await this.Page.waitForSelector(
      AgentChatConstants.ValidateSkills
    );
    const currentName = (await title.textContent()).toString();
    return message == currentName;
  }

  public async closeNotification(maxCount: number, page: Page) {
    let tryCount = 0;
    let pageObject = page ?? this.Page;
    let defaultMaxCount = 20;

    if (maxCount == 0 || maxCount == null) {
      maxCount = defaultMaxCount;
    } else if (maxCount > defaultMaxCount) {
      maxCount = defaultMaxCount;
    }

    while (tryCount < maxCount) {
      try {
        await this.waitForAgentPresence();
        await this.setAvailableStatus();
        const chatAccepted = await this.waitUntilSelectorIsVisible(
          AgentChatConstants.AcceptButtonId,
          Constants.Two,
          pageObject,
          Constants.FiveThousand
        );
        if (chatAccepted) {
          await pageObject.click(AgentChatConstants.AcceptButtonId);
          const iframeCC = await IFrameHelper.GetIframe(
            this._page,
            IFrameConstants.IframeCC
          );
          await this.waitForConversationControl();
          await this.closeUnusedChat();
        } else {
          if (
            (await this.Page.$$(AgentChatConstants.OpenedActiveChat)).length > 0
          ) {
            await this.closeUnusedChat();
          }
        }
      } catch (error) {
        console.log(`Method closeNotification throwing exception with message: ${error.message}`);
      }
      tryCount++;
    }
  }

  public async closeMyWorkItems(
    maxCount: number,
    page: Page,
    timeout: number = Constants.FiveThousand
  ) {
    let tryCount = 0;
    let pageObject = page ?? this.Page;
    let defaultMaxCount = 20;

    if (maxCount == 0 || maxCount == null) {
      const myWorkItemCountVisible = await this.waitUntilSelectorIsVisible(
        AgentChatConstants.MyItemsWsRecordCountSelector,
        AgentChatConstants.Three,
        null,
        timeout
      );
      if (myWorkItemCountVisible) {
        const currentMyWorkItemCount = await this.getMyItemWSRecordCount();
        if (currentMyWorkItemCount <= defaultMaxCount) {
          maxCount = currentMyWorkItemCount;
        } else {
          maxCount = defaultMaxCount;
        }
      } else {
        maxCount = defaultMaxCount;
      }
    } else if (maxCount > defaultMaxCount) {
      maxCount = defaultMaxCount;
    }

    const refreshAllTabVisible = await this.waitUntilSelectorIsVisible(
      AgentChatConstants.RefreshAllTab,
      Constants.Two,
      null,
      timeout
    );
    if (refreshAllTabVisible) {
      await pageObject.click(AgentChatConstants.RefreshAllTab);
      await this.waitUntilSelectorIsVisible(
        AgentChatConstants.MyWorkItemTabSelector,
        Constants.Two,
        null,
        timeout
      );
    }

    while (tryCount < maxCount) {
      try {
        await pageObject.click(AgentChatConstants.RefreshAllTab);
        await this.waitUntilSelectorIsVisible(
          AgentChatConstants.RefreshAllTab,
          Constants.Two,
          pageObject,
          timeout
        );
        await this.waitForAgentPresence();
        await this.setAvailableStatus();
        const workItemVisible = await this.waitUntilSelectorIsVisible(
          AgentChatConstants.MyWorkItemsMoreOptions,
          Constants.Two,
          null,
          timeout
        );
        if (workItemVisible) {
          const closedItemsRecordCount =
            await this.getClosedWorkStreamCurrentRecordCount(
              AgentChatConstants.ClosedWSRecordCountSelector
            );
          await pageObject.waitForSelector(AgentChatConstants.MoreChatOption);
          await pageObject.click(AgentChatConstants.MoreChatOption);
          await pageObject.waitForSelector(
            AgentChatConstants.OpenMyWorkItemChat
          );
          await pageObject.dblclick(AgentChatConstants.OpenMyWorkItemChat);
          const iframeCC = await IFrameHelper.GetIframe(
            this._page,
            IFrameConstants.IframeCC
          );
          await this.waitUntilSelectorIsVisible(
            AgentChatConstants.EndConversationButtonXPath,
            AgentChatConstants.Five,
            iframeCC,
            timeout
          );
          await this.waitUntilSelectorIsVisible(
            AgentChatConstants.MessageTextArea,
            AgentChatConstants.Five,
            iframeCC,
            timeout
          );
          await this.closeUnusedChat();
          await this.waitForNewItemInClosedWS(
            AgentChatConstants.ClosedQueueItemSelector,
            closedItemsRecordCount,
            AgentChatConstants.Three,
            Constants.OpenWsWaitTimeout
          );
        } else {
          const noRecordAvaialble = await this.waitUntilSelectorIsVisible(
            AgentChatConstants.NoRecordAvailableInMyWorkItemGrid,
            Constants.Three,
            null,
            Constants.DefaultTimeout
          );
          if (noRecordAvaialble) {
            break;
          }
        }
      } catch (error) {
        console.log(`Method closeMyWorkItems throwing exception with message: ${error.message}`);
      }
      tryCount++;
    }
  }

  public async CloseInActiveMyWorkItems(maxCount: number) {
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.AgentScreenAvailablitySelector,
      AgentChatConstants.Five,
      this._page,
      Constants.MaxTimeout
    );
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.RefreshAllTab,
      Constants.Three,
      this._page,
      Constants.MaxTimeout
    );
    await this.closeMyWorkItems(maxCount, this._page);
  }

  public async CloseInActiveNotification(maxCount: number) {
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.AgentScreenAvailablitySelector,
      AgentChatConstants.Five,
      this._page,
      Constants.MaxTimeout
    );
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.RefreshAllTab,
      Constants.Three,
      this._page,
      Constants.MaxTimeout
    );
    await this.closeNotification(maxCount, this._page);
  }
  public async clickScreenshare() {
    const iframeCC = await IFrameHelper.GetIframe(
      this._page,
      IFrameConstants.IframeCC
    );
    await iframeCC.$eval(AgentConversationPageConstants.EscalateCall, (el) =>
      (el as HTMLElement).click()
    );
    await iframeCC.$eval(
      AgentConversationPageConstants.ScreenShareClick,
      (el) => (el as HTMLElement).click()
    );
    await this.delay(5000);
  }
  public async clickCoBrowse() {
    const iframeCC = await IFrameHelper.GetIframe(
      this._page,
      IFrameConstants.IframeCC
    );
    await iframeCC.$eval(AgentConversationPageConstants.EscalateCall, (el) =>
      (el as HTMLElement).click()
    );
    await iframeCC.$eval(AgentConversationPageConstants.clickCoBrowse, (el) =>
      (el as HTMLElement).click()
    );
    await this.delay(5000);
  }

  public async enableScreenshare() {
    const iframesc = await IFrameHelper.GetIframe(
      this._page,
      IFrameConstants.IframeScreenShare
    );
    await iframesc.$eval(
      AgentConversationPageConstants.EnableScreenshare,
      (el) => (el as HTMLElement).click()
    );
    await this.delay(5000);
  }

  public async enableCoBrowse() {
    const iframecb = await IFrameHelper.GetIframe(
      this._page,
      IFrameConstants.IframeCoBrowse
    );
    await iframecb.$eval(AgentConversationPageConstants.EnableCoBrowse, (el) =>
      (el as HTMLElement).click()
    );
    await this.delay(5000);
  }

  public async linkContact() {
    const isContactAvailable = await this.waitUntilSelectorIsVisible(
      AgentChatConstants.SearchCustomerInputSelector,
      Constants.Five,
      this._page,
      Constants.DefaultTimeout
    );
    if (!isContactAvailable) {
      const customerLangInputFlag = await this.waitUntilSelectorIsVisible(
        AgentChatConstants.CustomerLanguageInput,
        Constants.Five,
        this._page,
        Constants.DefaultTimeout
      );
      if (customerLangInputFlag) {
        await this._page.hover(AgentChatConstants.CustomerLanguageInput);
        await this._page.focus(AgentChatConstants.CustomerLanguageInput);
        await this._page.hover(AgentChatConstants.CustomerLanguageInput);
        const contactInput = await this.Page.waitForSelector(
          AgentChatConstants.CustomerLanguageInput
        );
        await contactInput.fill(this.contactRecordName);
        await this.Page.click(AgentChatConstants.CustomerLanguageSearch);
        await this.waitUntilSelectorIsVisible(
          AgentChatConstants.CustomerLanguageLookupValue.replace(
            "{0}",
            this.contactRecordName
          ),
          Constants.Five,
          this._page,
          Constants.DefaultTimeout
        );
        await this.Page.click(
          AgentChatConstants.CustomerLanguageLookupValue.replace(
            "{0}",
            this.contactRecordName
          )
        );
      }
    }
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.ClickAvailableContact,
      Constants.Five,
      this._page,
      Constants.DefaultTimeout
    );
    await this.Page.click(AgentChatConstants.ClickAvailableContact);
  }

  public async validateNotificationAssignBySupervisor() {
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.AcceptButtonId,
      AgentChatConstants.Two,
      this._page,
      AgentChatConstants.AgentPopUpWaitingTimeout
    );
  }

  public async clickVoiceCall() {
    const iframeCC = await IFrameHelper.GetIframe(
      this._page,
      IFrameConstants.IframeCC
    );
    await iframeCC.$eval(AgentConversationPageConstants.EscalateCall, (el) =>
      (el as HTMLElement).click()
    );
    await iframeCC.$eval(AgentConversationPageConstants.VoiceCallClick, (el) =>
      (el as HTMLElement).click()
    );
    await this.Page.waitForTimeout(Constants.DefaultTimeout);
  }
  public async clickVideoCall() {
    const iframeCC = await IFrameHelper.GetIframe(
      this._page,
      IFrameConstants.IframeCC
    );
    await iframeCC.$eval(AgentConversationPageConstants.EscalateCall, (el) =>
      (el as HTMLElement).click()
    );
    await iframeCC.$eval(AgentConversationPageConstants.VideoCallClick, (el) =>
      (el as HTMLElement).click()
    );
    await this.Page.waitForTimeout(Constants.DefaultTimeout);
  }
  public async stopCall() {
    const iframeCC = await IFrameHelper.GetIframe(
      this._page,
      IFrameConstants.IframeCC
    );
    await iframeCC.$eval(AgentConversationPageConstants.stopCall, (el) =>
      (el as HTMLElement).click()
    );
    await this.Page.waitForTimeout(Constants.DefaultTimeout);
  }
  public async validateCalltranscriptMessage() {
    const message = await this.Page.waitForSelector(
      AgentChatConstants.VoiceCallTranscript
    );
    const transcriptmessage = await message.textContent();
    return transcriptmessage == AgentChatConstants.VoiceCallTranscriptMessage;
  }
  public async validateVideoCalltranscriptMessage() {
    const message = await this.Page.waitForSelector(
      AgentChatConstants.VideoCallTranscript
    );
    const transcriptmessage = await message.textContent();
    return transcriptmessage == AgentChatConstants.VideoCallTranscriptMessage;
  }
  public async CallDeclinedtranscriptMessage() {
    const message = await this.Page.waitForSelector(
      AgentChatConstants.CallDeclinedTranscript
    );
    const transcriptmessage = await message.textContent();
    return (
      transcriptmessage == AgentChatConstants.CallDeclinedTranscriptMessage
    );
  }

  public async waitForAgentPresence() {
    return await this.waitUntilSelectorIsVisible(
      AgentChatConstants.AvailabilityStatusBusyXPath,
      AgentChatConstants.Five,
      this._page,
      Constants.MaxTimeout
    );
  }

  public async openConversation(
    liveWorkItemID: string,
    sessionId?: string,
    liveWorkStreamID?: string
  ) {
    let script = `Microsoft.Omnichannel.openConversation('${liveWorkItemID}'`;

    if (sessionId) script += `,'${sessionId}'`;

    if (liveWorkStreamID) script += `,'${liveWorkStreamID}'`;

    script += `);`;
    return await this.executeScript(script);
  }

  public async getLinkedRecords() {
    //add 5 second wait for automation stability.
    await this.Page.waitForTimeout(5000);
    return await this.executeScript(`Microsoft.Omnichannel.getLinkedRecords();`);
  }

  public async validateNotificationDetails(
    agentPage: AsyncChannelE2EPage,
    channelType: string
  ) {
    expect(
      await agentPage.waitUntilSelectorIsVisible(
        AgentChatConstants.ChatNotification,
        AgentChatConstants.Five,
        agentPage.Page,
        Constants.FourThousandsMiliSeconds
      )
    ).toBeTruthy();
    expect(
      await agentPage.waitUntilSelectorIsVisible(
        AgentChatConstants.NotificationHeader.replace("{0}", channelType)
      )
    ).toBeTruthy();
    expect(
      await agentPage.waitUntilSelectorIsVisible(AgentChatConstants.TwitterIcon)
    ).toBeTruthy();
    expect(
      await agentPage.waitUntilSelectorIsVisible(
        AgentChatConstants.NotificationTitle
      )
    ).toBeTruthy();
    expect(
      await agentPage.waitUntilSelectorIsVisible(
        AgentChatConstants.NotificationWaitTime
      )
    ).toBeTruthy();
    expect(
      await agentPage.waitUntilSelectorIsVisible(
        AgentChatConstants.PopupNotificationAcceptButton
      )
    ).toBeTruthy();
    expect(
      await agentPage.waitUntilSelectorIsVisible(
        AgentChatConstants.PopupNotificationDeclineButton
      )
    ).toBeTruthy();
  }

  public async validateConversationControlForOpenWorkItems() {
    const message = "#q1";
    await this.waitForDomContentLoaded();
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    await iframe.waitForSelector(AgentChatConstants.QuickRepliesFooter);
    await iframe.$eval(AgentChatConstants.QuickRepliesFooter, (el) => {
      (el as HTMLElement).click();
    });
    await this.waitUntilSelectorIsVisible(AgentChatConstants.QuickTextarea);
    await iframe.fill(AgentChatConstants.QuickTextarea, "/q " + message);
    await this.waitForDomContentLoaded();
    const quickReply = await iframe.waitForSelector(
      AgentChatConstants.QuickReplyItem.replace("{0}", message)
    );
    await quickReply.click();

    await iframe.$eval(
      AgentChatConstants.QuickReplyItem.replace("{0}", message),
      (el) => {
        (el as HTMLElement).click();
        (el as HTMLElement).click();
      }
    );
    await iframe.waitForSelector(AgentChatConstants.SendMessageButton);
    await iframe.$eval(AgentChatConstants.SendMessageButton, (el) => {
      (el as HTMLElement).click();
    });
  }

  public async validateClosedchat() {
    const closeWorkitem = await this.Page.waitForSelector(
      SelectorConstants.CopyCallbackURLMsg
    );
    const title = await closeWorkitem.innerText();
    return title === Constants.CloseChatMessage;
  }

  public async validateVisitorLocation() {
    const visitorDetailsTabButton = await this.Page.waitForSelector(
      AgentConversationPageConstants.VisitorDetailsTabButtonSelector,
      { timeout: 10000 }
    );
    await visitorDetailsTabButton.click();
    expect(
      await this.waitUntilSelectorIsVisible(
        AgentConversationPageConstants.ValidateLocationDetails
      )
    ).toBeTruthy();
  }

  public async validateChatHeaderTitle() {
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    const title = await (
      await iframe.waitForSelector(AgentChatConstants.HeaderTitle)
    ).textContent();
    const sessionIcon = await this.Page.waitForSelector(
      AgentChatConstants.SessionIcon
    );
    const status = await (await sessionIcon.getProperty("title")).jsonValue();
    expect(status == title).toBeTruthy();
  }

  public async validateCustomerTitle() {
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    const title = await (
      await iframe.waitForSelector(AgentChatConstants.HeaderTitle)
    ).textContent();
    const customer = await (
      await this.Page.waitForSelector(AgentChatConstants.CustomerTitle)
    ).textContent();
    expect(customer == title).toBeTruthy();
  }

  public async validateLiveChatIcon() {
    const iframeCC = await IFrameHelper.GetIframe(
      this._page,
      IFrameConstants.IframeCC
    );
    expect(
      await this.waitUntilFrameSelectorIsVisible(
        AgentChatConstants.LiveChatIconClassName,
        iframeCC,
        10
      )
    ).toBeTruthy();
  }

  public async checkSentimentOnGoingDashboard(Sentiment: string) {
    return await this.waitUntilSelectorIsVisible(
      AgentChatConstants.ChatMessageSelector.replace("{0}", Sentiment)
    );
  }

  public async waitForConversationLoad() {
    const iframeCC = await IFrameHelper.GetIframe(
      this._page,
      IFrameConstants.IframeCC
    );
    const endBtnLoadFlag = await this.waitUntilSelectorIsVisible(
      AgentChatConstants.EndConversationButtonXPath,
      AgentChatConstants.Four,
      iframeCC,
      Constants.MaxTimeout
    );
    const chatInputBoxLoadFlag = await this.waitUntilSelectorIsVisible(
      AgentChatConstants.MessageTextArea,
      AgentChatConstants.Three,
      iframeCC,
      Constants.MaxTimeout
    );
    return endBtnLoadFlag && chatInputBoxLoadFlag;
  }

  public async waitForChatInputBoxLoad() {
    const iframeCC = await IFrameHelper.GetIframe(
      this._page,
      IFrameConstants.IframeCC
    );
    return await this.waitUntilSelectorIsVisible(
      AgentChatConstants.MessageTextArea,
      AgentChatConstants.Two,
      iframeCC,
      Constants.MaxTimeout
    );
  }

  public async validateDiagnosticReport() {
    const emptySearchBox = await this.Page.waitForSelector(
      AgentChatConstants.EmptySearchBox
    );
    await emptySearchBox.click();
    await this.Page.keyboard.press("Control+Shift+Alt+d");
    const diagnosticReportSuccess = await this.Page.waitForSelector(
      SelectorConstants.ToastNotificationListRootdiv
    );
    await this.waitUntilSelectorIsHidden(
      SelectorConstants.ToastNotificationListRootdiv
    );
    return (
      (await diagnosticReportSuccess.textContent()).toString() ===
      Constants.DiagnosticReportNotification
    );
  }

  public async checkDiagnosticReport() {
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    await this.Page.keyboard.press("Control+V");
    return await this.waitUntilSelectorIsVisible(
      AgentChatConstants.ClientSessionID,
      AgentChatConstants.Three,
      iframe
    );
  }

  public async checkErrorNotification() {
    await this.Page.keyboard.press("Control+Shift+Alt+D");
    //By default, it always takes atleast two seconds to show the new toast notification ; will try to remove as soon as the issue resolves of two seconds waiting time
    await this.Page.waitForTimeout(Constants.DefaultTimeout);
    const diagnosticReportFailure = await this.Page.waitForSelector(
      SelectorConstants.ToastNotificationListRootdiv
    );
    return (
      (await diagnosticReportFailure.textContent()).toString() ===
      Constants.ErrorNotification
    );
  }

  public async checkCompleteDiagnosticReport() {
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.MessageTextArea,
      AgentChatConstants.Three,
      iframe
    );
    for (let i = 0; i < DiagnosticData.length; i++) {
      if (
        !(await this.waitUntilSelectorIsVisible(
          `//textarea[contains(text(),"${DiagnosticData[i]}")]`,
          AgentChatConstants.Three,
          iframe
        ))
      ) {
        return false;
      }
    }
    return true;
  }

  public async conversationControl() {
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.ConversationControl,
      AgentChatConstants.Three,
      iframe
    );
    await iframe.$eval(AgentChatConstants.ConversationControl, (el) => {
      (el as HTMLElement).click();
      (el as HTMLElement).click();
    });
  }

  public async validateConversationControl(Page) {
    try {
      await Page.sendMessage(
        AgentCosultConversationPageConstants.AgentGreetMessage
      );
      return true;
    } catch {
      return false;
    }
  }

  public async validateChatWithSeparateSession() {
    try {
      const numberOfSessions = (await this.Page.$$(Constants.OpenedActiveChat))
        .length;
      if (numberOfSessions > 1) return true;
      return false;
    } catch {
      return false;
    }
  }

  public async validateChatSessionName() {
    try {
      await this.Page.waitForSelector(SelectorConstants.SessionAccountName);
      return true;
    } catch {
      return false;
    }
  }

  public async validateChangeOfTimeline() {
    expect(
      await this.elementExists(AgentChatConstants.AccountTimeline)
    ).toBeTruthy();
    expect(
      await this.elementExists(AgentChatConstants.CaseTimeline)
    ).toBeTruthy();
  }

  public async createNotesFromTimeline() {
    //adding 2 sec wait time for timeline loading
    await this.Page.waitForTimeout(Constants.DefaultTimeout);
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.AddNotesFromTimeline
    );
    await this.Page.click(AgentChatConstants.AddNotesFromTimeline);
    await this.waitUntilSelectorIsVisible(AgentChatConstants.NotesTitle);
    await this.Page.fill(
      AgentChatConstants.NotesTitle,
      AgentChatConstants.NotesData
    );
    await this.waitUntilSelectorIsVisible(AgentChatConstants.AddingNotes);
    await this.Page.click(AgentChatConstants.AddingNotes);
  }

  public async validateAdditionDeletionOnTimeline() {
    try {
      await this.waitForDomContentLoaded();
      await this.Page.waitForTimeout(Constants.DefaultTimeout);
      await this.waitUntilSelectorIsVisible(AgentChatConstants.TimelineRecords);
      await this.Page.hover(AgentChatConstants.TimelineRecords);
      await this.Page.focus(AgentChatConstants.TimelineRecords);
      const deleteDataFromTimeline = await this.Page.waitForSelector(
        AgentChatConstants.DeleteNotesFromTimeline
      );
      await deleteDataFromTimeline.click();
      await this.waitForDomContentLoaded();
      const deleteConfirm = await this.Page.waitForSelector(
        SelectorConstants.ConfirmButtonId
      );
      await deleteConfirm.click();
      return true;
    } catch {
      return false;
    }
  }

  public async createValidCase() {
    await this.Page.waitForSelector(AgentChatConstants.NewCaseBtn);
    await this.Page.click(AgentChatConstants.NewCaseBtn);
    await this.Page.waitForSelector(AgentChatConstants.CaseTitle, {
      timeout: TMConstant.Minutes(2),
    });
    const caseName = `Case + ${Math.floor(Math.random() * Date.now())}`;
    await this.Page.fill(AgentChatConstants.CaseTitle, caseName);
    await this.Page.waitForSelector(AgentChatConstants.CustomerSearchButton);
    await this.fillLookupField(
      AgentChatConstants.CustomerNametbx,
      AgentChatConstants.CustomerSearchButton,
      AgentChatConstants.CustomerLookupValue,
      " "
    );
    await this.waitUntilSelectorIsVisible(AgentChatConstants.IncidentSave);
    await this.Page.click(AgentChatConstants.IncidentSave);
    await this.waitForSaveComplete();
    await this.Page.click(SelectorConstants.FormSaveAndCloseButton);
    await this.waitForSaveComplete();
  }

  public async validateAuthenticatedControls() {
    const authenticatedLabel = await this.Page.waitForSelector(
      SelectorConstants.AuthenticatedLabel
    );
    const title = await authenticatedLabel.innerText();
    return title === Constants.AssingCheck;
  }

  public async validateVisitorDetails() {
    const browserLabel = await this.Page.waitForSelector(
      SelectorConstants.BrowserLabel
    );
    const browserLabelVariable = await browserLabel.innerText();
    const osLabel = await this.Page.waitForSelector(SelectorConstants.OSLabel);
    const osLabelVariable = await osLabel.innerText();

    const deviceLabel = await this.Page.waitForSelector(
      SelectorConstants.DeviceLabel
    );
    const deviceLabelVariable = await deviceLabel.innerText();

    return (
      browserLabelVariable === Constants.Browser &&
      osLabelVariable === Constants.OS &&
      deviceLabelVariable === Constants.Device
    );
  }
  public async validateAuthChat(authName: string) {
    const customerName = await this.Page.waitForSelector(
      AgentChatConstants.CustomerName
    );
    const name = await customerName.innerText();
    return name === authName;
  }
  public async validateLWIVariables() {
    await this.openVisitorDetailsTab();
    try {
      const additionalDetailsTabButton = await this.Page.waitForSelector(
        SelectorConstants.AdditionalTab
      );
      await additionalDetailsTabButton.click();
      await this.Page.click(SelectorConstants.AdditionalDetails);
    } catch {
      await this.Page.click(SelectorConstants.AdditionalDetails);
    }
    const caseNumberContextVariable = await this.Page.waitForSelector(
      SelectorConstants.CaseNumberContextVariable
    );
    const caseNumber = await caseNumberContextVariable.innerText();

    const caseTitleContextVariable = await this.Page.waitForSelector(
      SelectorConstants.CaseTitleContextVariable
    );
    const caseTitle = await caseTitleContextVariable.innerText();

    const activeSystemContextvariable = await this.Page.waitForSelector(
      SelectorConstants.ActiveSystemContextvariable
    );
    const activeSystem = await activeSystemContextvariable.innerText();

    const currentUserEmailContextVariable = await this.Page.waitForSelector(
      SelectorConstants.CurrentUserEmailContextVariable
    );
    const currentUserEmail = await currentUserEmailContextVariable.innerText();

    return (
      caseNumber === Constants.CaseNumber &&
      caseTitle === Constants.CaseTitle &&
      activeSystem === Constants.ActiveSystem &&
      currentUserEmail === Constants.CurrentUserEmail
    );
  }

  public async validateLWIContextVariablesInfo() {
    await this.Page.click(SelectorConstants.AdditionalDetails);

    const caseNumberLabel = await this.Page.waitForSelector(
      SelectorConstants.CaseNumberLabel
    );
    const caseNumber = await caseNumberLabel.innerText();

    const caseTitleLabel = await this.Page.waitForSelector(
      SelectorConstants.CaseTitleLabel
    );
    const caseTitle = await caseTitleLabel.innerText();

    const activeSystemLabel = await this.Page.waitForSelector(
      SelectorConstants.ActiveSystemLabel
    );
    const activeSystem = await activeSystemLabel.innerText();

    const currentUserEmailLabel = await this.Page.waitForSelector(
      SelectorConstants.CurrentUserEmailLabel
    );
    const currentUserEmail = await currentUserEmailLabel.innerText();

    return (
      caseNumber === Constants.CaseNumberValue &&
      caseTitle === Constants.CaseTitleValue &&
      activeSystem === Constants.ActiveSystemValue &&
      currentUserEmail === Constants.CurrentUserEmailValue
    );
  }

  public async validateNonAvailabilityOfLWIVariable() {
    const caseOwnerEmailContextvariable = await this.Page.waitForSelector(
      SelectorConstants.CaseOwnerEmailContextvariable
    );
    const caseOwnerEmail = await caseOwnerEmailContextvariable.innerText();
    return caseOwnerEmail === Constants.CaseOwnerEmail;
  }

  public async openAgentDashboard() {
    let agentDashBoard = await this.Page.waitForSelector(
      AgentChatConstants.DashboardConstant
    );
    agentDashBoard.click();
  }

  public async openIntradayInsights() {
    await this.waitUntilSelectorIsVisible(
      SelectorConstants.OmniChannelIntradayInsights,
      AgentChatConstants.Two,
      this.Page,
      AgentChatConstants.FiveThousandsMiliSecondsWaitTimeout
    );
    await this.Page.click(SelectorConstants.OmniChannelIntradayInsights);
  }

  public async getConversationStatusFrame() {
    const mainFraim = await this.CheckTabUntilElementAppear(
      SelectorConstants.IFrame,
      20
    );
    const subFrame = await mainFraim.contentFrame();
    const reportEmbedFrame = await subFrame.waitForSelector(
      SelectorConstants.ReportEmbedPowerBI
    );
    return await reportEmbedFrame.contentFrame();
  }

  public async getValueOfConversationStatus(iFrame: Frame, status: string) {
    const diagramElement = await iFrame.waitForSelector(
      SelectorConstants.ConversationStatusPath.replace("{0}", status)
    );
    return await diagramElement.getAttribute("aria-label");
  }

  public async closeAllSessions() {
    await this.RefreshAllTab();
    let activeConversations = await this.Page.$$(
      SelectorConstants.ChatByStatusSelector.replace(
        "{status}",
        ConversationStatesConstants.Active
      )
    );

    let waitingConversations = await this.Page.$$(
      SelectorConstants.ChatByStatusSelector.replace(
        "{status}",
        ConversationStatesConstants.Waiting
      )
    );

    let wrapupConversations = await this.Page.$$(
      SelectorConstants.ChatByStatusSelector.replace(
        "{status}",
        ConversationStatesConstants.Wrapup
      )
    );

    this.CloseNSessionsByStatus(
      activeConversations.length,
      ConversationStatesConstants.Active
    );
    this.CloseNSessionsByStatus(
      waitingConversations.length,
      ConversationStatesConstants.Waiting
    );
    this.CloseNSessionsByStatus(
      wrapupConversations.length,
      ConversationStatesConstants.Wrapup
    );
  }

  public async CloseNSessionsByStatus(
    conversationCount: number,
    status: ConversationStatesConstants
  ) {
    for (let i = 0; i < conversationCount; i++) {
      await this.OpenConversationByStatus(status);
      await this.closeUnusedChat();
      await this.delay(1000);
      await this.RefreshAllTab();
    }
  }

  public async getChatIframe() {
    const ChatWindowFrame = await this.Page.$(
      SelectorConstants.ChatWindowMainIFrame
    );
    return ChatWindowFrame;
  }

  public async copyandvalidateKBArticleForFBChat() {
    const outerIframe = await this.Page.waitForSelector(
      PageConstants.OuterdivforKB
    );
    const customParentIFrame = await outerIframe.contentFrame();
    const customInnerIFrame = await customParentIFrame.$(
      PageConstants.ChildKBIframe
    );
    const customChildIFrame = await customInnerIFrame.contentFrame();
    const copyArticleAvailable = await this.waitUntilIFrameSelectorIsVisible(
      AgentChatConstants.CopyArticle,
      AgentChatConstants.Three,
      customChildIFrame
    );
    const sendArticleAvailable = await this.waitUntilIFrameSelectorIsVisible(
      AgentChatConstants.SendArticles,
      AgentChatConstants.Three,
      customChildIFrame
    );
    const popoutArticleAvailable = await this.waitUntilIFrameSelectorIsVisible(
      AgentChatConstants.PopOutArticle,
      AgentChatConstants.Three,
      customChildIFrame
    );

    if (copyArticleAvailable) {
      await customChildIFrame.click(AgentChatConstants.CopyArticle);
      const message = Constants.KBArticle as string;
      const kBArticleCopyMessage = await customChildIFrame.waitForSelector(
        SelectorConstants.ToastNotificationListRootdiv
      );
      const kBArticleMessage = await kBArticleCopyMessage.textContent();
      return message == kBArticleMessage;
    } else if (popoutArticleAvailable) {
      return true;
    }

    if (sendArticleAvailable) {
      await customChildIFrame.click(AgentChatConstants.SendArticles);
    }

    return false;
  }

  public async sendKBArticleForFBChat() {
    const outerIframe = await this.Page.waitForSelector(
      PageConstants.OuterdivforKB
    );
    const customParentIFrame = await outerIframe.contentFrame();
    const customInnerIFrame = await customParentIFrame.$(
      PageConstants.ChildKBIframe
    );
    const customChildIFrame = await customInnerIFrame.contentFrame();
    const sendArticleAvailable = await this.waitUntilIFrameSelectorIsVisible(
      AgentChatConstants.SendArticles,
      AgentChatConstants.Three,
      customChildIFrame
    );

    if (sendArticleAvailable) {
      await customChildIFrame.click(AgentChatConstants.SendArticles);
    }

    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.MessageTextArea,
      AgentChatConstants.Three,
      iframe
    );
    await iframe.$eval(AgentChatConstants.SendMessageButton, (el) => {
      (el as HTMLElement).scrollIntoView();
      (el as HTMLElement).click();
    });
  }

  public async waitUntilIFrameSelectorIsVisible(
    selectorVal: string,
    maxCount: number = 3,
    iFrame: any = null,
    timeout: number = Constants.DefaultTimeout
  ) {
    let dataCount = 0;
    while (dataCount < maxCount) {
      try {
        await iFrame.waitForSelector(selectorVal);
        return true;
      } catch (e) {
        dataCount++;
        //To avoid intermittent failures in pipeline, explicit wait before every retry.
        await this._page.waitForTimeout(timeout);
        if (dataCount == maxCount) {
          console.info(
            `Retried for ${maxCount} times and failed to read iframe selector- ${selectorVal}`
          );
          throw e;
        }
      }
    }
    return false;
  }

  public async GetUserName() {
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.AgentInformation,
      AgentChatConstants.Two,
      this.Page,
      AgentChatConstants.FiveThousandsMiliSecondsWaitTimeout
    );
    const agentInfo = await this.Page.waitForSelector(
      AgentChatConstants.AgentInformation
    );
    await agentInfo.click();
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.AgentUserNameSelector,
      AgentChatConstants.Two,
      this.Page,
      AgentChatConstants.FiveThousandsMiliSecondsWaitTimeout
    );
    const userNameSelector = await this.Page.waitForSelector(
      AgentChatConstants.AgentUserNameSelector
    );
    const userName = await userNameSelector.textContent();
    await agentInfo.click();
    return userName;
  }

  public async acceptUniqueInvitationToChat(uniqueMessage: string) {
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.AcceptButtonId,
      AgentChatConstants.Two,
      null,
      AgentChatConstants.AgentPopUpWaitingTimeout
    );
    await this._page.click(AgentChatConstants.AcceptButtonId);
    await this.waitForConversationControl();
  }

  public async acceptUniqueInvitationToPickChat(
    uniqueMessage: string,
    maxTryCount: number,
    page: Page
  ) {
    let tryCount = 0;
    let pageObject = page ?? this.Page;

    while (tryCount < maxTryCount) {
      try {
        await pageObject.click(AgentChatConstants.RefreshAllTab);
        await this.waitUntilSelectorIsVisible(
          AgentChatConstants.RefreshAllTab,
          Constants.Three,
          pageObject,
          Constants.FourThousandsMiliSeconds
        );
        await this.waitForAgentPresence();
        await this.setAvailableStatus();
        const workItemVisible = await this.waitUntilSelectorIsVisible(
          AgentChatConstants.OpenWorkItemOptionsClick,
          Constants.Eight,
          pageObject,
          Constants.TenThousand
        );
        if (workItemVisible) {
          const closedItemsRecordCount =
            await this.getClosedWorkStreamCurrentRecordCount(
              AgentChatConstants.ClosedWSRecordCountSelector
            );
          await pageObject.click(AgentChatConstants.OpenWorkItemOptionsClick);
          await this.waitUntilSelectorIsVisible(
            AgentChatConstants.AssignToMe,
            Constants.Three,
            pageObject,
            Constants.MaxTimeout
          );
          await pageObject.click(AgentChatConstants.AssignToMe);
          await this.waitForConversationControl();
          const msgFound = await this.validateUniqueMessage(
            uniqueMessage,
            pageObject
          );
          if (msgFound) {
            return true;
          } else {
            await this.closeUnusedChat();
            await this.waitForNewItemInClosedWS(
              AgentChatConstants.ClosedQueueItemSelector,
              closedItemsRecordCount,
              AgentChatConstants.Six,
              Constants.FiveThousand
            );
          }
        } else {
          const refreshAllTabVisible = await this.waitUntilSelectorIsVisible(
            AgentChatConstants.RefreshAllTab,
            Constants.Two,
            pageObject,
            Constants.FourThousandsMiliSeconds
          );
          if (refreshAllTabVisible) {
            await pageObject.click(AgentChatConstants.RefreshAllTab);
            await this.waitUntilSelectorIsVisible(
              AgentChatConstants.MyWorkItemTabSelector,
              Constants.Two,
              null,
              Constants.MaxTimeout
            );
            const noRecordAvaialble = await this.waitUntilSelectorIsVisible(
              AgentChatConstants.NoRecordAvailableInOpenWorkItemGrid,
              Constants.Three,
              null,
              Constants.DefaultTimeout
            );
            if (noRecordAvaialble) {
              return false;
            }
          } else {
            return false;
          }
        }
      } catch (error) {
        console.log(`Method acceptUniqueInvitationToPickChat throwing exception with message: ${error.message}`);
      }
      tryCount++;
    }
    return false;
  }

  public async acceptUniqueInvitationToPushChat(
    uniqueMessage: string,
    maxTryCount: number,
    page: Page
  ) {
    let tryCount = 0;
    let pageObject = page ?? this.Page;

    while (tryCount < maxTryCount) {
      try {
        await this.waitForAgentPresence();
        await this.setAvailableStatus();
        const notificationVisible = await this.waitUntilSelectorIsVisible(
          AgentChatConstants.AcceptButtonId,
          Constants.Eight,
          pageObject,
          Constants.TenThousand
        );
        if (notificationVisible) {
          await pageObject.click(AgentChatConstants.AcceptButtonId);
          await this.waitForConversationControl();
          const msgFound = await this.validateUniqueMessage(
            uniqueMessage,
            pageObject
          );
          if (msgFound) {
            return true;
          } else {
            await this.closeUnusedChat();
          }
        } else {
          if (
            (await this.Page.$$(AgentChatConstants.OpenedActiveChat)).length > 0
          ) {
            await this.closeUnusedChat();
          }
        }
      } catch (error) {
        console.log(`Method acceptUniqueInvitationToPushChat throwing exception with message: ${error.message}`);
      }
      tryCount++;
    }
    return false;
  }

  public async validateReconnectUrlHavingReconnectId(reconnectUrl: string) {
    if (reconnectUrl.search("reconnectid") != -1) {
      return true;
    }
    return false;
  }

  public async validateAgentSystemMessage(messageXpath: string, text: string) {
    let systemmessage;
    await this.waitForDomContentLoaded();
    const iFrame: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    await this.waitUntilSelectorIsVisible(
      messageXpath,
      AgentChatConstants.Five,
      iFrame,
      AgentChatConstants.AgentMessagesLoadTimeOut
    );
    try {
      systemmessage = await iFrame.waitForSelector(messageXpath);
    } catch {
      systemmessage = await iFrame.waitForSelector(
        AgentChatConstants.AutoCloseMessageXpaths
      );
    }
    const entityItemText = await systemmessage.textContent();
    if (entityItemText.search(text) != -1) {
      return true;
    }
  }

  public async setStatusToAvailable() {
    try {
      await this._page.click(AgentChatConstants.AgentStatusButton);
      const selectElement = await this._page.waitForSelector(
        AgentChatConstants.SelectStatusElement
      );
      selectElement.selectOption({
        label: AgentChatConstants.Available.toString(),
      });
      await this._page.click(AgentChatConstants.AgentStatusOkButton);
    } catch (error) {
      console.log(`Method waitUntilNewRecordAppearsInOpenWS throwing exception with message: ${error.message}`);
    }
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

  public async copyandvalidateKBArticleForTeleSignChat() {
    const outerIframe = await this.Page.waitForSelector(
      PageConstants.OuterdivforKB
    );
    const customParentIFrame = await outerIframe.contentFrame();
    const customInnerIFrame = await customParentIFrame.$(
      PageConstants.ChildKBIframe
    );
    const customChildIFrame = await customInnerIFrame.contentFrame();
    const copyArticleAvailable = await this.waitUntilIFrameSelectorIsVisible(
      AgentChatConstants.CopyArticle,
      AgentChatConstants.Three,
      customChildIFrame
    );
    const sendArticleAvailable = await this.waitUntilIFrameSelectorIsVisible(
      AgentChatConstants.SendArticles,
      AgentChatConstants.Three,
      customChildIFrame
    );
    const popoutArticleAvailable = await this.waitUntilIFrameSelectorIsVisible(
      AgentChatConstants.PopOutArticle,
      AgentChatConstants.Three,
      customChildIFrame
    );

    if (copyArticleAvailable) {
      await customChildIFrame.click(AgentChatConstants.CopyArticle);
      const message = Constants.KBArticle as string;
      const kBArticleCopyMessage = await customChildIFrame.waitForSelector(
        SelectorConstants.ToastNotificationListRootdiv
      );
      const kBArticleMessage = await kBArticleCopyMessage.textContent();
      return message == kBArticleMessage;
    } else if (popoutArticleAvailable) {
      return true;
    }

    if (sendArticleAvailable) {
      await customChildIFrame.click(AgentChatConstants.SendArticles);
    }

    return false;
  }

  public async sendKBArticleForTeleSignChat() {
    const outerIframe = await this.Page.waitForSelector(
      PageConstants.OuterdivforKB
    );
    const customParentIFrame = await outerIframe.contentFrame();
    const customInnerIFrame = await customParentIFrame.$(
      PageConstants.ChildKBIframe
    );
    const customChildIFrame = await customInnerIFrame.contentFrame();
    const sendArticleAvailable = await this.waitUntilIFrameSelectorIsVisible(
      AgentChatConstants.SendArticles,
      AgentChatConstants.Three,
      customChildIFrame
    );

    if (sendArticleAvailable) {
      await customChildIFrame.click(AgentChatConstants.SendArticles);
    }

    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.MessageTextArea,
      AgentChatConstants.Three,
      iframe
    );
    await iframe.$eval(AgentChatConstants.SendMessageButton, (el) => {
      (el as HTMLElement).scrollIntoView();
      (el as HTMLElement).click();
    });
  }

  public async setAgentAvailablePresence() {
    const agentPresence = await this.waitUntilSelectorIsVisible(
      AgentChatConstants.AvailabilityStatusBusyXPath,
      AgentChatConstants.Five,
      null,
      AgentChatConstants.FiveThousandsMiliSecondsWaitTimeout
    );
    if (agentPresence) {
      await this._page.click(AgentChatConstants.AgentStatusButton);
      const selectElement = await this._page.waitForSelector(
        AgentChatConstants.SelectStatusElement
      );
      selectElement.selectOption({
        label: AgentChatConstants.Available.toString(),
      });
      await this._page.click(AgentChatConstants.AgentStatusOkButton);
    }
  }

  public async acceptSupervisorAssignChat() {
    const chatBtn = await this.waitUntilSelectorIsVisible(
      AgentChatConstants.AcceptButtonId,
      AgentChatConstants.Two,
      null,
      AgentChatConstants.ThirtyThousand
    );
    if (chatBtn) {
      await this._page.click(AgentChatConstants.AcceptButtonId);
      await this.waitForConversationControl();
    }
  }

  public async validateSupervisorAssignMessage() {
    let dataCount = 0;
    const timeout: number = Constants.DefaultTimeout;
    const maxcount: number = Constants.Five;
    while (dataCount < maxcount) {
      try {
        const workItemAssignMessageSelector = await this.Page.waitForSelector(
          AgentChatConstants.SystemAlertMessageSelector,
          { timeout }
        );
        const workItemAssignMessage =
          await workItemAssignMessageSelector.textContent();
        if (
          workItemAssignMessage.startsWith(
            AgentChatConstants.WorkItemAssignMessageText
          )
        ) {
          return true;
        }
      } catch {
        dataCount++;
      }
    }
    return false;
  }

  public async waitForUniqueMessage(message: string) {
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.ValiadationMessage.replace("{0}", message),
      AgentChatConstants.Three,
      iframe,
      Constants.MaxTimeout
    );
  }

  /// </summary>
  /// This method is used to clear unused chat conversation from agent end which generally remains unclosed if some test case failed.
  /// </summary>
  public async closeUnusedChat() {
    try {
      const iframeCC = await IFrameHelper.GetIframe(
        this._page,
        IFrameConstants.IframeCC
      );
      //await this.hideConsultPane();
      let chatEnable: boolean = false;
      const endBtnDisable = await this.waitUntilSelectorIsVisible(
        AgentChatConstants.EndConversationBtnDisabledXPath,
        AgentChatConstants.Two,
        iframeCC,
        Constants.DefaultTimeout
      );
      if (!endBtnDisable) {
        const endBtnEnable = await this.waitUntilSelectorIsVisible(
          AgentChatConstants.EndConversationBtnXPath,
          AgentChatConstants.Two,
          iframeCC,
          Constants.DefaultTimeout
        );
        if (endBtnEnable) {
          await iframeCC.$eval(
            AgentChatConstants.EndConversationBtnXPath,
            (el) => (el as HTMLElement).click()
          );
          chatEnable = true;
        }
      } else {
        chatEnable = true;
      }
      if (chatEnable) {
        await this._page.waitForTimeout(Constants.DefaultTimeout);
        await this.waitUntilSelectorIsVisible(
          AgentChatConstants.EndConversationBtnDisabledXPath,
          AgentChatConstants.Three,
          iframeCC,
          Constants.DefaultTimeout
        );
        await this._page.$eval(
          AgentChatConstants.RemoveConversationBtnClass,
          (el) => (el as HTMLElement).click()
        );
        await this.waitUntilSelectorIsVisible(
          AgentChatConstants.ConfirmButtonId,
          Constants.Three,
          this._page,
          Constants.MaxTimeout
        );
        await this._page.$eval(AgentChatConstants.ConfirmButtonId, (el) =>
          (el as HTMLElement).click()
        );
        await this._page.waitForTimeout(Constants.DefaultTimeout);
      }
    } catch (error) {
      console.log(`Method waitUntilNewRecordAppearsInOpenWS throwing exception with message: ${error.message}`);
    }
  }

  public async validateUniqueMessage(text: string, page: Page) {
    const iFrame: Page = await IFrameHelper.GetIframe(
      page,
      IFrameConstants.IframeCC
    );
    return await this.waitUntilSelectorIsVisible(
      AgentChatConstants.ValiadationMessage.replace("{0}", text),
      Constants.Twelve,
      iFrame,
      Constants.DefaultTimeout
    );
  }
  public async isAgentAvailableStatus() {
    const agentAvailableStatus = await this.waitUntilSelectorIsVisible(
      AgentChatConstants.AgentAvailableStatus,
      Constants.Three,
      this._page,
      Constants.DefaultTimeout
    );
    return agentAvailableStatus;
  }
  public async isAgentAwayStatus() {
    const agentAwayStatus = await this.waitUntilSelectorIsVisible(
      AgentChatConstants.AgentAwayStatus,
      Constants.Three,
      this._page,
      Constants.DefaultTimeout
    );
    return agentAwayStatus;
  }
  public async setAvailableStatus() {
    const agentAvailableStatus = await this.waitUntilSelectorIsVisible(
      AgentChatConstants.AgentAvailableStatus,
      Constants.Three,
      this._page,
      Constants.DefaultTimeout
    );

    if (!agentAvailableStatus) {
      await this.waitUntilSelectorIsVisible(
        AgentChatConstants.AgentStatusButton,
        Constants.Two,
        this._page,
        Constants.DefaultTimeout
      );
      await this._page.click(AgentChatConstants.AgentStatusButton);
      const selectElement = await this._page.waitForSelector(
        AgentChatConstants.SelectStatusElement
      );
      selectElement.selectOption({
        label: AgentChatConstants.Available.toString(),
      });
      await this._page.click(AgentChatConstants.AgentStatusOkButton);
    }
  }

  // Open all coming popups and check for unique message in the conversation. All inappropriate will be closed.
  public acceptPushChat(uniqueMessage: string) {
    return this.acceptPushTargetChat(async (agentChatPage) => {
      const ccFrame: Page = await agentChatPage.getConvCtrl();
      try {
        await ccFrame.waitForFunction(
          (expected) =>
            [...document.querySelectorAll("div.received-message")].some(
              (customerMessageEl) =>
                customerMessageEl.textContent.includes(expected)
            ),
          uniqueMessage,
          { timeout: 5000 }
        );

        return true;
      } catch {
        return false;
      }
    });
  }

  // Open all coming popups and check for unique message in the conversation. All inappropriate will be closed.
  public acceptPushChatByTitleAndMessage(
    uniqueMessage: string,
    conversationTitle: string
  ) {
    return this.acceptPushTargetChat(async (agentChatPage) => {
      const ccFrame: Page = await agentChatPage.getConvCtrl();
      try {
        await ccFrame.waitForFunction(
          (expected) =>
            [...document.querySelectorAll("div.received-message")].some(
              (customerMessageEl) =>
                customerMessageEl.textContent.includes(expected)
            ),
          uniqueMessage,
          { timeout: 5000 }
        );
        return true;
      } catch (error) {
        console.log(`Method acceptPushChatByTitleAndMessage throwing exception with message: ${error.message}`);
      }
      return await this.waitUntilFrameSelectorIsVisible(
        AgentChatConstants.ConversationTitle.replace("{0}", conversationTitle),
        ccFrame,
        Constants.Three,
        Constants.DefaultTimeout
      );
    });
  }

  public async acceptPushTargetChat(
    checkForExpectedChat: (chatPage: AgentChat) => Promise<boolean>,
    timeout?: number
  ) {
    while (true) {
      // When no active popup is present and expected chat hasn`t been found yet timeout exception will be thrown from accept method
      // so the loop will break and test fails since the correct chat couldn`t be initialized
      await this.setAgentAvailablePresence();
      await this.acceptInvitationToChat(timeout);
      const ccFrame: Page = await this.getConvCtrl();
      await ccFrame.waitForSelector(AgentChatConstants.MessageTextArea);

      // If chat validation succeeds the correct chat was accepted.
      // Otherwise, close the accepted chat.
      const isExpectedChat = await checkForExpectedChat(this);
      if (isExpectedChat) {
        break;
      } else {
        while (
          (await this.Page.$$(AgentChatConstants.OpenedActiveChat)).length > 0
        ) {
          try {
            await this.clickActiveChat();
            await this.closeUnusedChat();
          } catch (error) {
            console.log(`Method waitUntilNewRecordAppearsInOpenWS throwing exception with message: ${error.message}`);
          }
        }
      }
    }
  }

  public async validateAgentDashboardSystemMessage(textToValidate: string) {
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    await this.waitUntilFrameIsVisible(
      AgentChatConstants.ValiadationAgentDashboardMessage.replace(
        "{0}",
        textToValidate
      ),
      AgentChatConstants.Five,
      iframe,
      AgentChatConstants.AgentMessagesLoadTimeOut
    );
    const messageSelector = await (
      await iframe.waitForSelector(
        AgentChatConstants.ValiadationAgentDashboardMessage.replace(
          "{0}",
          textToValidate
        )
      )
    ).textContent();
    return !(messageSelector === null || messageSelector === undefined);
  }

  public async verifyNewRecordInOpenWS(
    openWSRecordCountValue: number,
    maxCount: number,
    timeout: number
  ) {
    return await this.waitUntilNewRecordAppearsInOpenWS(
      AgentChatConstants.OpenWsRecordCountSelector,
      openWSRecordCountValue,
      maxCount,
      timeout
    );
  }

  public async waitUntilWorkItemStatusChanged(
    selectorVal: string,
    workItemStatus: string,
    maxCount = Constants.Three,
    page: Page = null,
    timeout: number = Constants.DefaultTimeout
  ) {
    let dataCount = 0;
    const pageObject = page ?? this.Page;
    while (dataCount < maxCount) {
      try {
        await this.RefreshAllTab();
        const statusLocator = await pageObject.waitForSelector(selectorVal, {
          timeout,
        });
        const expectedStatus = await statusLocator.innerText();
        if (expectedStatus === workItemStatus) return true;
      } catch (error) {
        console.log(`Method waitUntilWorkItemStatusChanged throwing exception with message: ${error.message}`);
      }
      await pageObject.waitForTimeout(timeout); //wait for provided timeout period to recheck condition
      dataCount++;
    }
    return false;
  }

  public async acceptOpenWorkItem(maxTryCount: number, page: Page) {
    let tryCount = 0;
    const pageObject = page ?? this.Page;
    while (tryCount < maxTryCount) {
      try {
        const workItemVisible = await this.waitUntilSelectorIsVisible(
          AgentChatConstants.OpenWorkItemOptionsClick,
          Constants.One,
          pageObject,
          Constants.TwentyThousand
        );
        if (workItemVisible) {
          await pageObject.click(AgentChatConstants.OpenWorkItemOptionsClick);
          await this.waitUntilSelectorIsVisible(
            AgentChatConstants.AssignToMe,
            Constants.Three,
            pageObject,
            Constants.MaxTimeout
          );
          await pageObject.click(AgentChatConstants.AssignToMe);
          const iframeCC: Page = await IFrameHelper.GetIframe(
            this.Page,
            IFrameConstants.IframeCC
          );
          const chatAccept = await this.waitUntilSelectorIsVisible(
            AgentChatConstants.MessageTextArea,
            AgentChatConstants.Ten,
            iframeCC,
            AgentChatConstants.TwentyThousand
          );
          if (chatAccept) {
            return true;
          }
        }
      } catch (error) {
        console.log(`Method acceptOpenWorkItem throwing exception with message: ${error.message}`);
      }
      tryCount++;
    }
    return false;
  }

  public async closeAllActiveSessionsWithChats() {
    await this.goToHome();
    while (
      (await this.Page.$$(AgentChatConstants.OpenedActiveChat)).length > 0
    ) {
      await this.clickActiveChat();
      await this.closeUnusedChat();
    }
  }

  public async CreateNewContactRecordWithEmail() {
    const doesContactExists = await this.waitUntilSelectorIsVisible(
      AgentChatConstants.SearchCustomerInputSelector,
      Constants.Three,
      this._page,
      Constants.MaxTimeout
    );
    if (doesContactExists) {
      await this.RemoveContactFromConveration();
    }

    await this.Page.click(AgentChatConstants.CreateNewContactChat);
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.ContactName,
      Constants.Three,
      this._page,
      Constants.MaxTimeout
    );
    const contactName = await this.Page.waitForSelector(
      AgentChatConstants.ContactName
    );
    const name = `${this.ContactData.ContactName}_${new Date().getTime()}`;
    this.CustomerFullName = name;
    await contactName.fill(name);
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.ContactLastName,
      Constants.Three,
      this._page,
      Constants.MaxTimeout
    );
    const lastName = await this.Page.waitForSelector(
      AgentChatConstants.ContactLastName
    );
    await lastName.fill(this.ContactData.ContactLastName);
    await this.Page.evaluate(
      (selector) => document.querySelector(selector).scrollIntoView(),
      AgentChatConstants.ContactMobilePhone as string
    );
    await this.Page.evaluate(
      (selector) => document.querySelector(selector).scrollIntoView(),
      AgentChatConstants.ContactAddress as string
    );
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.ContactEmailSelector,
      Constants.Three,
      this._page,
      Constants.MaxTimeout
    );
    const email = await this.Page.waitForSelector(
      AgentChatConstants.ContactEmailSelector
    );
    await email.fill(
      `${new Date().getTime()}_${SelectorConstants.ContactEmail}`
    );
    await this.waitUntilSelectorIsVisible(
      SelectorConstants.FormSaveAndCloseButton,
      Constants.Five,
      this._page,
      Constants.MaxTimeout
    );
    const saveButton = await this.Page.waitForSelector(
      SelectorConstants.FormSaveAndCloseButton
    );
    await saveButton.click();
    await this.waitForSaveComplete();
    this.CustomerConversationName = `${name} ${this.ContactData.ContactLastName}`;
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.ContactSavedVerficationXpath.replace("{0}", `${name}`),
      Constants.Five,
      this._page,
      Constants.MaxTimeout
    );
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.ContactSavedVerficationXpath.replace("{0}", `${name}`)
    );
  }

  public async validateEmail() {
    return this.waitUntilSelectorIsVisible(
      `input[value*='${SelectorConstants.ContactEmail}']`,
      Constants.Four,
      null,
      Constants.FiveThousand
    );
  }

  public openChat(uniqueMessage: string) {
    return this.openTargetChat(async (agentChatPage) => {
      const ccFrame: Page = await agentChatPage.getConvCtrl();
      try {
        await ccFrame.waitForFunction(
          (expected) =>
            [...document.querySelectorAll("div.received-message")].some(
              (customerMessageEl) =>
                customerMessageEl.textContent.includes(expected)
            ),
          uniqueMessage,
          { timeout: 7000 }
        );

        return true;
      } catch {
        return false;
      }
    });
  }

  public async openTargetChat(
    checkForExpectedChat: (chatPage: AgentChat) => Promise<boolean>,
    timeout?: number
  ) {
    while (true) {
      // When no active popup is present and expected chat hasn`t been found yet timeout exception will be thrown from accept method
      // so the loop will break and test fails since the correct chat couldn`t be initialized
      await this.waitUntilWorkItemIsVisible(
        SelectorConstants.AvailableWorkItem,
        12,
        null,
        timeout || Constants.FourThousandsMiliSeconds
      );
      await this.openChatFromOpenWorkItems();
      const ccFrame: Page = await this.getConvCtrl();
      await ccFrame.waitForSelector(AgentChatConstants.MessageTextArea);

      // If chat validation succeeds the correct chat was accepted.
      // Otherwise, close the accepted chat.
      const isExpectedChat = await checkForExpectedChat(this);
      if (isExpectedChat) {
        break;
      } else {
        await this.closeActiveSessionsWithChats();
      }
    }
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

  public async okClick() {
    await this.Page.click(CustomConstants.OkButton);
  }

  public async resolveCase() {
    await this.Page.click(CustomConstants.ResolveCase);
    await this.Page.click(CustomConstants.ConfirmButton);
    await this.Page.selectOption(
      CustomConstants.SelectResolutionType,
      ResolutionType.ProblemSolved as string
    );
    await this.Page.fill(CustomConstants.ResolutionDesciption, "Case Resolved");
    await this.Page.click(CustomConstants.ResolveCaseClick);
    await this.Page.waitForTimeout(Constants.DefaultAverageTimeout);
  }

  public async validateChatTitleAndHeaderWhenContactLinked() {
    const iframe: Page = await IFrameHelper.GetIframe(
      this._page,
      IFrameConstants.IframeCC
    );

    const sessionTitle = await this.waitUntilSelectorIsVisible(
      AgentChatConstants.ChatSessionTitle.replace(
        "{0}",
        this.CustomerConversationName
      ),
      Constants.Three,
      this._page,
      Constants.MaxTimeout
    );

    const chatTitle = await (
      await iframe.waitForSelector(AgentChatConstants.HeaderTitle)
    ).textContent();

    return sessionTitle && chatTitle === this.CustomerConversationName;
  }

  public async validateChatTitleAndHeaderWhenContactUnlinked() {
    const iframe: Page = await IFrameHelper.GetIframe(
      this._page,
      IFrameConstants.IframeCC
    );

    const sessionTitle = await this.waitUntilSelectorIsVisible(
      AgentChatConstants.ChatSessionTitle.replace(
        "{0}",
        this.ConversationTitleName
      ),
      Constants.Three,
      this._page,
      Constants.MaxTimeout
    );

    const chatTitle = await (
      await iframe.waitForSelector(AgentChatConstants.HeaderTitle)
    ).textContent();

    return sessionTitle && chatTitle === this.ConversationTitleName;
  }

  public async validateCustomerSummaryTitleWhenContactLinked() {
    const title = await this.Page.waitForSelector(
      Constants.SearchCustomerInputSelector
    );
    const result = await title.textContent();
    return result === this.CustomerConversationName;
  }

  public async validateCustomerSummaryTitleWhenContactUnLinked() {
    const title = await this.Page.waitForSelector(
      Constants.SearchAccountInputSelector
    );
    const result = await title.textContent();
    return result != this.CustomerConversationName;
  }

  public async validateAgentScreenSystemMessage(textToValidate: string) {
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    try {
      const messageFound = await this.waitUntilFrameIsVisible(
        AgentChatConstants.ValiadationAgentDashboardMessage.replace(
          "{0}",
          textToValidate
        ),
        AgentChatConstants.Seven,
        iframe,
        AgentChatConstants.ThirtyThousand
      );

      if (!messageFound) return false;

      const messageSelector = await (
        await iframe.waitForSelector(
          AgentChatConstants.ValiadationAgentDashboardMessage.replace(
            "{0}",
            textToValidate
          )
        )
      ).textContent();
      return !(messageSelector === null || messageSelector === undefined);
    } catch (error) {
      console.log(
        `Method validateAgentScreenSystemMessage failed to validate text: ${textToValidate}.  Error message: ${error.message}`
      );
    }
    return false;
  }

  public async waitUntilOpenItemCountIncrease(
    selectorVal: string,
    maxCount: number,
    page: Page,
    timeout: number
  ) {
    let dataCount = 0;
    let pageObject = page ?? this.Page;
    while (dataCount < maxCount) {
      try {
        await pageObject.click(AgentChatConstants.RefreshAllTab);
        await this.waitUntilSelectorIsVisible(
          AgentChatConstants.RefreshAllTab,
          Constants.Two,
          null,
          Constants.FiveThousand
        );
        await pageObject.waitForSelector(selectorVal, { timeout });
        return true;
      } catch (error) {
        console.log(`Method waitUntilOpenItemCountIncrease throwing exception with message: ${error.message}`);
      } //This catch statement will handle selector not found error during loop itreation process. This method already return false if selector not found so no need to add logging statements in catch block.
      dataCount++;
      await this.setAgentStatus(AgentChatConstants.Available.toString());
    }
    return false;
  }

  public async waitUntilCloseItemCountIncrease(
    selectorVal: string,
    maxCount: number,
    page: Page,
    timeout: number
  ) {
    let dataCount = 0;
    let pageObject = page ?? this.Page;
    while (dataCount < maxCount) {
      try {
        await pageObject.click(AgentChatConstants.RefreshAllTab);
        await this.waitUntilSelectorIsVisible(
          AgentChatConstants.RefreshAllTab,
          Constants.Two,
          null,
          Constants.FiveThousand
        );
        await pageObject.waitForSelector(selectorVal, { timeout });
        return true;
      } catch (error) {
        console.log(`Method waitUntilCloseItemCountIncrease throwing exception with message: ${error.message}`);
      } //This catch statement will handle selector not found error during loop itreation process. This method already return false if selector not found so no need to add logging statements in catch block.
      dataCount++;
    }
    return false;
  }

  /// </summary>
  /// This method is used to enc chat conversation (not session).
  /// </summary>
  public async closeOnlyChatConversation() {
    const iframeCC = await IFrameHelper.GetIframe(
      this._page,
      IFrameConstants.IframeCC
    );
    const endBtnDisable = await this.waitUntilSelectorIsVisible(
      AgentChatConstants.EndConversationBtnDisabledXPath,
      AgentChatConstants.Two,
      iframeCC,
      Constants.DefaultTimeout
    );
    if (!endBtnDisable) {
      const endBtnEnable = await this.waitUntilSelectorIsVisible(
        AgentChatConstants.EndConversationBtnXPath,
        AgentChatConstants.Two,
        iframeCC,
        Constants.DefaultTimeout
      );
      if (endBtnEnable) {
        await iframeCC.$eval(AgentChatConstants.EndConversationBtnXPath, (el) =>
          (el as HTMLElement).click()
        );
      }
    }
  }

  public async setAgentPresenceStatus(statusName: string) {
    try {
      const agentStatus = await this.waitUntilSelectorIsVisible(
        AgentChatConstants.AvailabilityStatusBusyXPath,
        Constants.Six,
        this._page,
        Constants.TenThousand
      );

      if (!agentStatus) {
        await this.waitUntilSelectorIsVisible(
          AgentChatConstants.AgentStatusButton,
          Constants.Five,
          this._page,
          Constants.DefaultTimeout
        );
        await this._page.click(AgentChatConstants.AgentStatusButton);
        const selectElement = await this._page.waitForSelector(
          AgentChatConstants.SelectStatusElement
        );
        selectElement.selectOption({
          label: statusName,
        });
        await this._page.click(AgentChatConstants.AgentStatusOkButton);
      }
    } catch (error) {
      console.log(`Method waitUntilNewRecordAppearsInOpenWS throwing exception with message: ${error.message}`);
    }
  }

  public async validateSentimentText(expectedSentiment: string) {
    let dataCount = 0;
    const timeout: number = Constants.TenThousand;
    const iframeCC: Page = await IFrameHelper.GetIframe(
      this._page,
      IFrameConstants.IframeCC
    );
    while (dataCount < Constants.Five) {
      try {
        await this.waitUntilFrameSelectorIsVisible(
          AgentChatConstants.SentimentSelector,
          iframeCC,
          Constants.Two,
          Constants.MaxTimeout
        );
        await iframeCC.waitForSelector(
          AgentChatConstants.SentimentSelector.replace(
            "{0}",
            expectedSentiment
          ),
          { timeout }
        );
        return true;
      } catch (error) {
        console.log(`Method validateSentimentText throwing exception with message: ${error.message}`);
      } //This catch statement will handle selector not found error during loop itreation process. This method already return false if selector not found so no need to add logging statements in catch block.
      dataCount++;
    }
    return false;
  }

  public async validateDisonnectSystemMessages() {
    await this.waitForDomContentLoaded();
    const iFrame: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    const systemmessage = await iFrame.waitForSelector(
      AgentChatConstants.DisconnectMessage,
      {
        timeout: 6 * 60 * 1000,
      }
    );
    //const systemmessage = await iFrame.waitForSelector(AgentChatConstants.DisconnectMessage);
    const entityItemText = await systemmessage.textContent();
    return entityItemText.includes("disconnected");
  }

  public async waitForCloseItemCountIncrease(
    oldClosedWSRecordValue: number,
    maxCount: number,
    page: Page,
    timeout: number,
    CloseWSSelector: string
  ) {
    let dataCount = 0;
    let pageObject = page ?? this.Page;
    let result: boolean = false;
    while (dataCount < maxCount) {
      try {
        await pageObject.click(AgentChatConstants.RefreshAllTab);
        await this.waitUntilSelectorIsVisible(
          AgentChatConstants.RefreshAllTab,
          Constants.Two,
          null,
          Constants.FiveThousand
        );
        const newClosedWSRecordValue: number =
          await this.getClosedWorkStreamCurrentRecordCount(
            AgentChatConstants.ClosedWSRecordCountSelector
          );

        if (newClosedWSRecordValue - oldClosedWSRecordValue > 0) {
          console.info(
            "New Item increased in Close WorkItem list: method 'waitForCloseItemCountIncrease'"
          );
          return true;
        } else {
          await pageObject.waitForTimeout(timeout);
        }
      } catch (error) {
        console.log(`Method waitForCloseItemCountIncrease throwing exception with message: ${error.message}`);
      } //This catch statement will handle selector not found error during loop itreation process. This method already return false if selector not found so no need to add logging statements in catch block.
      dataCount++;
      await this.setAgentStatus(AgentChatConstants.Available.toString());
    }

    result = await this.waitUntilSelectorIsVisible(CloseWSSelector);
    console.info(
      "Method 'waitForCloseItemCountIncrease' related selector '{0}' search result: ".replace(
        "{0}",
        CloseWSSelector
      ) + result
    );
    return result;
  }
  public async waitForOpenItemCountIncrease(
    oldOpenWSRecordValue: number,
    maxCount: number,
    page: Page,
    timeout: number,
    OpenWSSelector: string
  ) {
    let dataCount = 0;
    let pageObject = page ?? this.Page;
    let result: boolean = false;
    while (dataCount < maxCount) {
      try {
        await pageObject.click(AgentChatConstants.RefreshAllTab);
        await this.waitUntilSelectorIsVisible(
          AgentChatConstants.RefreshAllTab,
          Constants.Two,
          null,
          Constants.FiveThousand
        );
        const newOpenWSRecordValue: number = await this.getOpenWSRecordCount();
        if (newOpenWSRecordValue - oldOpenWSRecordValue > 0) {
          console.info(
            "New Item increased in Open WorkItem list: method 'waitForOpenItemCountIncrease'"
          );
          return true;
        } else {
          await pageObject.waitForTimeout(timeout);
        }
      } catch (error) {
        console.log(`Method waitForOpenItemCountIncrease throwing exception with message: ${error.message}`);
      } //This catch statement will handle selector not found error during loop itreation process. This method already return false if selector not found so no need to add logging statements in catch block.
      dataCount++;
      await this.setAgentStatus(AgentChatConstants.Available.toString());
    }

    result = await this.waitUntilSelectorIsVisible(OpenWSSelector);
    console.info(
      "Method 'waitForOpenItemCountIncrease' related selector '{0}' search result: ".replace(
        "{0}",
        OpenWSSelector
      ) + result
    );
    return result;
  }

  public async goToOngoingDashboard() {
    await this._page.waitForTimeout(3000);
    await this._page
      .waitForSelector(SelectorConstants.AgentDashboardTab)
      .catch((error) => {
        throw new Error(
          `Can't verify that customer page has "Omnichannel Agent Dashboard" tab. Inner exception: ${error.message}`
        );
      });
    await this._page.$eval(SelectorConstants.AgentDashboardTab, (el) =>
      (el as HTMLElement).click()
    );
    await this._page.$eval(
      SelectorConstants.OngoingTabConversationSelector,
      (el) => (el as HTMLElement).click()
    );
  }

  public async FilterItemsByQueue(frame: any, queueName: string) {
    await this.waitForInfraDayInsightsScreenLoad(frame);
    await this.FilterRecordsByQueueName(
      SelectorConstants.QueurDDSelector,
      frame,
      queueName
    );
    await this.waitForInfraDayInsightsScreenLoad(frame);
  }

  public async closeSessionsWithChats() {
    try {
      while (
        (await this.Page.$$(AgentChatConstants.OpenedActiveChat)).length > 0
      ) {
        await this.clickActiveChat();
        await this.closeUnusedChat();
      }
    } catch (error) {
      console.log(`Method FilterItemsByQueue throwing exception with message: ${error.message}`);
    }
  }

  public async validateActiveConversationCount(
    iFrame: Frame,
    status: string,
    activeConversationCount: number
  ) {
    await this.waitUntilFrameSelectorIsVisible(
      SelectorConstants.ConversationStatusPath.replace("{0}", status),
      iFrame,
      Constants.One,
      Constants.FiveThousand
    );
    const diagramElement = await iFrame.waitForSelector(
      SelectorConstants.ConversationStatusPath.replace("{0}", status)
    );
    const result = await diagramElement.getAttribute("aria-label");
    return result.includes(` ${activeConversationCount} `);
  }

  public async validateWaitingConversationCount(
    iFrame: Frame,
    status: string,
    waitingConversationCount: number
  ) {
    await this.waitUntilFrameSelectorIsVisible(
      SelectorConstants.ConversationStatusPath.replace("{0}", status),
      iFrame,
      Constants.Two,
      Constants.FiveThousand
    );
    const diagramElement = await iFrame.waitForSelector(
      SelectorConstants.ConversationStatusPath.replace("{0}", status)
    );
    const result = await diagramElement.getAttribute("aria-label");

    return result.includes(` ${waitingConversationCount} `);
  }

  public async validateWrapUpConversationCount(
    iFrame: Frame,
    status: string,
    wrapupConversationCount: number
  ) {
    await this.waitUntilFrameSelectorIsVisible(
      SelectorConstants.ConversationStatusPath.replace("{0}", status),
      iFrame,
      Constants.Two,
      Constants.FiveThousand
    );
    const diagramElement = await iFrame.waitForSelector(
      SelectorConstants.ConversationStatusPath.replace("{0}", status)
    );
    const result = await diagramElement.getAttribute("aria-label");

    return result.includes(` ${wrapupConversationCount} `);
  }

  public async getInitialValueOfActiveConversationStatus(
    iFrame: Frame,
    status: string
  ) {
    const zeroValue: number = 0;
    try {
      return this.getInitialValueOfConversationStatus(
        iFrame,
        status,
        SelectorConstants.ActiveConvSearchString
      );
    } catch (error) {
      console.log(
        `Method getInitialValueOfActiveConversationStatus throwing exception with message: ${error.message}`
      );
    }
    return zeroValue;
  }

  public async getInitialValueOfWaitingConversationStatus(
    iFrame: Frame,
    status: string
  ) {
    const zeroValue: number = 0;
    try {
      return this.getInitialValueOfConversationStatus(
        iFrame,
        status,
        SelectorConstants.WaitingConvSearchString
      );
    } catch (error) {
      console.log(
        `Method getInitialValueOfWaitingConversationStatus throwing exception with message: ${error.message}`
      );
    }
    return zeroValue;
  }

  public async getInitialValueOfWrapUpConversationStatus(
    iFrame: Frame,
    status: string
  ) {
    const zeroValue: number = 0;
    try {
      return this.getInitialValueOfConversationStatus(
        iFrame,
        status,
        SelectorConstants.WrapUpConvSearchString
      );
    } catch (error) {
      console.log(
        `Method getInitialValueOfWrapUpConversationStatus throwing exception with message: ${error.message}`
      );
    }
    return zeroValue;
  }

  public async validateWIIsFlushedAndShowingCorrectData(channel) {
    const timeout: number = Constants.OpenWsWaitTimeout;
    await this.waitUntilSelectorIsVisible(
      AgentConversationPageConstants.ClosedChannelElement.replace(
        "{0}",
        channel
      ),
      Constants.Two,
      null,
      Constants.FiveThousand
    );
    // validate channel
    const channelElement = await this.Page.waitForSelector(
      AgentConversationPageConstants.ClosedChannelElement.replace(
        "{0}",
        channel
      ),
      { timeout }
    );
    const channelText = await await channelElement.textContent();
    if (channelText !== channel) {
      return false;
    }

    await this.waitUntilSelectorIsVisible(
      AgentConversationPageConstants.ClosedStatusElement,
      Constants.Two,
      null,
      Constants.FiveThousand
    );
    // validate closed on
    const closedOnElement = await this.Page.waitForSelector(
      AgentConversationPageConstants.ClosedStatusElement,
      { timeout }
    );
    const closedOnValue = await await closedOnElement.textContent();
    if (closedOnValue !== "Closed") {
      return false;
    }

    return true;
  }

  public async getInitialValueOfConversationStatus(
    iFrame: Frame,
    status: string,
    searchString: string
  ) {
    const zeroValue: number = 0;
    try {
      const diagramElement = await iFrame.waitForSelector(
        SelectorConstants.ConversationStatusPath.replace("{0}", status)
      );
      let result = await diagramElement.getAttribute("aria-label");
      if (result !== null && result !== "") {
        result = result.replace(searchString, "").split(" ")[0];
        if (Util.isNumber(result)) {
          return +result;
        }
      }
    } catch (error) {
      console.log(`Method getInitialValueOfConversationStatus throwing exception with message: ${error.message}`);
    }
    return zeroValue;
  }

  public async GetCurrentDateAndTime() {
    const DateAndTimeArray: string[] = new Date().toLocaleString().split(",");
    const date: string =
      "Date: " +
      DateAndTimeArray[0].trim() +
      " Time: " +
      DateAndTimeArray[1].trim();
    return date.toString();
  }

  public async validateReconnectIdMessage(textToValidate: string) {
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    const messageSelector = await (
      await iframe.waitForSelector(
        AgentChatConstants.validateReconnectIdMessage.replace(
          "{0}",
          textToValidate
        )
      )
    ).textContent();
    return !(messageSelector === null || messageSelector === undefined);
  }

  public async validateWaitingStatus() {
    await this.navigateToAgentDashboard();
    return await this.waitUntilWorkItemStatusChanged(
      AgentChatConstants.WorkItemStatus,
      Constants.Waiting,
      Constants.Ten,
      this._page,
      Constants.FiveThousand
    );
  }

  public async waitUntilItemVisibleInOngoingDashboard(
    selectorVal: string,
    maxCount = Constants.Three,
    page: Page = null,
    timeout: number = Constants.DefaultTimeout
  ) {
    let dataCount = 0;
    const pageObject = page ?? this.Page;
    while (dataCount < maxCount) {
      try {
        await this.RefreshAllTab();
        await pageObject.waitForSelector(selectorVal, { timeout });
        return true;
      } catch (error) {
        console.log(`Method waitUntilItemVisibleInOngoingDashboard throwing exception with message: ${error.message}`);
      }
      dataCount++;
    }
    return false;
  }

  public async waitingForSentimentUpdate() {
    await this._page.waitForTimeout(
      AgentConversationPageConstants.SentimentWaitingTime
    );
  }

  public async getSentimentStatus(): Promise<SentimentTypes> {
    const iframeCC = await TestHelper.GetIframe(
      this._page,
      HTMLConstants.IframeCC
    );
    const headerSentiment = await iframeCC
      .waitForSelector(AgentConversationPageConstants.HeaderSentiment)
      .catch((error) => {
        throw new Error(
          `Can't verify that ConversationControl window contains Sentiment status at the header. Inner exception: ${error.message}`
        );
      });
    const sentimentText = headerSentiment.textContent();
    return sentimentText;
  }

  public async waitForSentimentUpdateAndRefresh() {
    await this.Page.waitForTimeout(Constants.SentimentWaitTime); //wait for provided time frame to update sentiment value at ongoing dashboard screen
    await this.RefreshAllTab();
  }

  public async verifyAgentGetNotificationWhenSentimentsIsGoingLow(
    conversationIndex: number = 1
  ) {
    await this._page.focus("body");
    await this._page.waitForTimeout(5000); // Provided timeout to wait for the session Id.
    const sessionItem = await this._page.waitForSelector(
      `#sessionContainer-session-id-${conversationIndex}`
    );
    const notificationText = await sessionItem.getAttribute("aria-label");
    expect(
      notificationText.indexOf(
        "Urgent attention is needed in your conversation"
      )
    ).not.toEqual(-1);
  }

  public async waitForMyWorkItemCountIncrease(
    oldMyWorkItemWSRecordValue: number,
    maxCount: number,
    page: Page,
    timeout: number,
    MyWorkItemWSSelector: string
  ) {
    let dataCount = 0;
    let pageObject = page ?? this.Page;
    while (dataCount < maxCount) {
      try {
        await pageObject.click(AgentChatConstants.RefreshAllTab);
        await this.waitUntilSelectorIsVisible(
          AgentChatConstants.RefreshAllTab,
          Constants.Two,
          null,
          Constants.FiveThousand
        );
        const newMyWorkItemWSRecordValue: number =
          await this.getMyItemWSRecordCount();
        if (newMyWorkItemWSRecordValue - oldMyWorkItemWSRecordValue > 0) {
          console.info(
            "New Item increased in My WorkItem list: method 'waitForMyWorkItemCountIncrease'"
          );
          return true;
        } else {
          await pageObject.waitForTimeout(timeout);
        }
      } catch (error) {
        console.log(`Method waitForMyWorkItemCountIncrease throwing exception with message: ${error.message}`);
      } //This catch statement will handle selector not found error during loop itreation process. This method already return false if selector not found so no need to add logging statements in catch block.
      dataCount++;
      await this.setAgentStatus(AgentChatConstants.Available.toString());
    }
    const result: boolean = await this.waitUntilSelectorIsVisible(
      MyWorkItemWSSelector
    );
    console.info(
      "Method 'waitForMyWorkItemCountIncrease' related selector '{0}' search result: ".replace(
        "{0}",
        MyWorkItemWSSelector
      ) + result
    );
    return result;
  }

  public async enableTranslations() {
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    await iframe.waitForSelector(AgentChatConstants.SeeMore);
    await iframe.$eval(AgentChatConstants.SeeMore, (el) => {
      (el as HTMLElement).click();
    });

    const translation = await iframe.waitForSelector(
      AgentChatConstants.TranslationText
    );
    const text = translation.innerText();
    if ((await text) === AgentChatConstants.TranslationLabel) {
      await iframe.waitForSelector(AgentChatConstants.TranslationText);
      await iframe.$eval(AgentChatConstants.TranslationText, (el) => {
        (el as HTMLElement).click();
      });
    } else {
    }
  }

  public async openAgentDashBoard() {
    const agentDashBoard = await this.Page.waitForSelector(
      SelectorConstants.AgentDashboardTab
    );
    agentDashBoard.click();
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.RefreshAllTab,
      Constants.Two,
      null,
      Constants.MaxTimeout
    );
  }

  public async waitForInfraDayInsightsScreenLoad(frame: any) {
    await this.waitForScreenLoad(frame);
    await this.waitUntilFrameSelectorIsVisible(
      SelectorConstants.ConversationStatusPath.replace(
        "{0}",
        AgentChatConstants.Active
      ),
      frame,
      Constants.One,
      Constants.TenThousand
    );
    await this.waitUntilFrameSelectorIsVisible(
      SelectorConstants.ConversationStatusPath.replace(
        "{1}",
        AgentChatConstants.Closed
      ),
      frame,
      Constants.One,
      Constants.FiveThousand
    );
    await this.waitUntilFrameSelectorIsVisible(
      SelectorConstants.ConversationStatusPath.replace(
        "{2}",
        AgentChatConstants.Open
      ),
      frame,
      Constants.One,
      Constants.FiveThousand
    );
    await this.waitUntilFrameSelectorIsVisible(
      SelectorConstants.ConversationStatusPath.replace(
        "{3}",
        AgentChatConstants.Waiting
      ),
      frame,
      Constants.One,
      Constants.FiveThousand
    );
    await this.waitUntilFrameSelectorIsVisible(
      SelectorConstants.ConversationStatusPath.replace(
        "{4}",
        AgentChatConstants.Wrapup
      ),
      frame,
      Constants.One,
      Constants.FiveThousand
    );
  }

  public async FilterRecordsByQueueName(
    selectorVal: string,
    frame: any,
    queue: string,
    maxCount = Constants.Three,
    timeout: number = Constants.TenThousand
  ) {
    let dataCount = 0;
    while (dataCount < maxCount) {
      try {
        await this.waitUntilFrameSelectorIsVisible(
          SelectorConstants.DurationSelector,
          frame,
          Constants.One,
          Constants.DefaultTimeout
        );
        const omniChanelIntraDayInsightSelector = await frame.waitForSelector(
          SelectorConstants.DurationSelector,
          { timeout }
        );
        await omniChanelIntraDayInsightSelector.click();
        await this._page.waitForTimeout(Constants.DefaultTimeout); //This static timeout required so that if queue selection popup remains in open state during failed run so before retrying queue filtration it will close

        await this.waitUntilFrameSelectorIsVisible(
          AgentChatConstants.IntraDayMonitoringQueueSelector,
          frame,
          Constants.One,
          Constants.FiveThousand
        );
        const intraDayInsightsQueue = await frame.waitForSelector(
          AgentChatConstants.IntraDayMonitoringQueueSelector,
          { timeout }
        );
        await intraDayInsightsQueue.click();
        await this.waitForScreenLoad(frame);
        await this.waitUntilFrameSelectorIsVisible(
          AgentChatConstants.IntraDayInsightQueueSelectionSelector,
          frame,
          Constants.One,
          Constants.FiveThousand
        );
        await this.waitUntilFrameSelectorIsVisible(
          AgentChatConstants.IntraDayInsightQueueTitleSelectionSelector,
          frame,
          Constants.One,
          Constants.FiveThousand
        );
        await this.waitUntilFrameSelectorIsVisible(
          AgentChatConstants.IntraDayInsightQueueCheckboxSelectionSelector,
          frame,
          Constants.One,
          Constants.FiveThousand
        );
        await this.waitUntilFrameSelectorIsVisible(
          AgentChatConstants.IntraDayInsightQueueInputSelector,
          frame,
          Constants.One,
          Constants.FiveThousand
        );
        const intraDayInsightsQueueInput = await frame.waitForSelector(
          AgentChatConstants.IntraDayInsightQueueInputSelector,
          { timeout }
        );
        await intraDayInsightsQueueInput.fill("");
        await intraDayInsightsQueueInput.type(queue, { delay: 100 });

        await this.waitForScreenLoad(frame);
        await this._page.waitForTimeout(Constants.TenThousand); //This static timeout required so that required queue will be populated in intraday insight 'Queue' dropdown

        const intraDayInsightsConversationStatusItem =
          await frame.waitForSelector(
            AgentChatConstants.IntraDayInsightConversationStatusQueueSelector,
            { timeout }
          );
        await intraDayInsightsConversationStatusItem.focus();
        await this._page.waitForTimeout(Constants.DefaultTimeout); //This static timeout required so that queue selection popup will be kept in open state after focus
        await intraDayInsightsConversationStatusItem.click();

        await this.waitForScreenLoad(frame);
        await omniChanelIntraDayInsightSelector.click();
        await this.waitUntilFrameSelectorIsVisible(
          SelectorConstants.DurationSelector,
          frame,
          Constants.One,
          Constants.DefaultTimeout
        );
        await this.waitUntilFrameSelectorIsVisible(
          selectorVal,
          frame,
          Constants.One,
          timeout
        );
        const queueSelector = await frame.waitForSelector(selectorVal, {
          timeout,
        });
        const entityItemText = await queueSelector.textContent();
        if (entityItemText.startsWith(queue)) {
          return true;
        }
      } catch (error) {
        console.log(
          `Method FilterRecordsByQueueName iteration number: ${dataCount}`
        );
        console.log(
          `Method FilterRecordsByQueueName throwing exception with message: ${error.message}`
        );
      }
      dataCount++;
    }
    return false;
  }

  public async waitForScreenLoad(frame: any) {
    await frame.waitForLoadState(Constants.DomContentLoaded).catch(() => { });
    await frame.waitForLoadState("networkidle").catch(() => { });
    await frame.waitForLoadState("load", { timeout: 5000 }).catch(() => { });
  }

  // Create case/incident
  public async CreateCase(): Promise<string> {
    await this.Page.waitForSelector(AgentChatConstants.NewCaseBtn);
    await this.Page.click(AgentChatConstants.NewCaseBtn);
    await this.Page.waitForSelector(AgentChatConstants.CaseTitle, {
      timeout: TMConstant.Minutes(2),
    });
    const caseName = `Case + ${Math.floor(Math.random() * Date.now())}`;
    await this.Page.fill(AgentChatConstants.CaseTitle, caseName);
    await this.Page.waitForSelector(AgentChatConstants.CustomerSearchButton);
    await this.fillLookupField(
      AgentChatConstants.CustomerNametbx,
      AgentChatConstants.CustomerSearchButton,
      AgentChatConstants.CustomerLookupValue,
      " "
    );

    await this.waitUntilSelectorIsVisible(
      SelectorConstants.FormSaveAndCloseButton,
      Constants.Five,
      this._page,
      Constants.MaxTimeout
    );
    const saveButton = await this.Page.waitForSelector(
      SelectorConstants.FormSaveAndCloseButton
    );
    await saveButton.click();
    await this.waitForSaveComplete();
    return caseName.toString();
  }

  // Remove existing account from customer summary
  public async RemoveAccountFromCustomerSummary(callSaveBtn: boolean = false) {
    if (callSaveBtn) {
      await this._page.click(SelectorConstants.FormSaveAndCloseButton);
    }
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.SearchAccountInputSelector,
      Constants.Five,
      this._page,
      Constants.MaxTimeout
    );
    await this._page.hover(AgentChatConstants.SearchAccountInputSelector);
    await this._page.focus(AgentChatConstants.SearchAccountInputSelector);
    try {
      await this._page.waitForSelector(
        AgentChatConstants.RemoveAccountlookUpSelector,
        { timeout: Number(Constants.DefaultTimeout) }
      );
      await this._page.click(AgentChatConstants.RemoveAccountlookUpSelector);
      await this.waitUntilSelectorIsVisible(
        AgentChatConstants.NewAccountButtonSelector,
        Constants.Five,
        this._page,
        Constants.MaxTimeout
      );
    } catch (Exception) {
      Error("Unable to remove account from customer summary");
    }
  }

  // Remove existing case from customer summary
  public async RemoveCaseFromCustomerSummary(callSaveBtn: boolean = false) {
    if (callSaveBtn) {
      await this._page.click(SelectorConstants.FormSaveAndCloseButton);
    }
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.SearchCaseInputSelector,
      Constants.Five,
      this._page,
      Constants.MaxTimeout
    );
    await this._page.hover(AgentChatConstants.SearchCaseInputSelector);
    await this._page.focus(AgentChatConstants.SearchCaseInputSelector);
    try {
      await this._page.waitForSelector(
        AgentChatConstants.RemoveAccountlookUpSelector,
        { timeout: Number(Constants.DefaultTimeout) }
      );
      await this._page.click(AgentChatConstants.RemoveAccountlookUpSelector);
      await this.waitUntilSelectorIsVisible(
        AgentChatConstants.NewCaseBtn,
        Constants.Five,
        this._page,
        Constants.MaxTimeout
      );
    } catch (Exception) {
      console.log(
        `Method RemoveCaseFromCustomerSummary throwing exception with message: ${Exception.message}`
      );
    }
  }

  // Minimize the conversation iframe
  public async MinimizeConversation() {
    await this.waitForDomContentLoaded();
    const collapse = await this.Page.waitForSelector(
      SelectorConstants.CollapseSidePannel
    );
    await collapse.click();
  }

  public async validateToastNotificationMessage() {
    let notification = await this.Page.waitForSelector(
      SelectorConstants.ToastNotificationListRootdiv
    );
    const result = notification.textContent();
    return result;
  }

  public async validateNotificationTitle(expectedTitle: string) {
    const title = await this.Page.waitForSelector(
      AgentChatConstants.NotificationHeaderTitle
    );
    const currentTitle = await title.innerText();
    return currentTitle.includes(expectedTitle);
  }

  public async SelectCustomerContact() {
    const isContactAvailable = await this.waitUntilSelectorIsVisible(
      AgentChatConstants.SearchCustomerInputSelector,
      Constants.Five,
      this._page,
      Constants.DefaultTimeout
    );
    if (!isContactAvailable) {
      console.info("Contact selection from CustomerSummary screen - Start");
      const customerLangInputFlag = await this.waitUntilSelectorIsVisible(
        AgentChatConstants.CustomerLanguageInput,
        Constants.Five,
        this._page,
        Constants.DefaultTimeout
      );
      if (customerLangInputFlag) {
        await this._page.hover(AgentChatConstants.CustomerLanguageInput);
        await this._page.focus(AgentChatConstants.CustomerLanguageInput);
        await this._page.hover(AgentChatConstants.CustomerLanguageInput);
        const contactInput = await this.Page.waitForSelector(
          AgentChatConstants.CustomerLanguageInput
        );
        await contactInput.fill(this.CustomerFullName);
        await this.Page.click(AgentChatConstants.CustomerLanguageSearch);
        await this.waitUntilSelectorIsVisible(
          AgentChatConstants.CustomerLanguageLookupValue.replace(
            "{0}",
            this.CustomerFullName
          ),
          Constants.Five,
          this._page,
          Constants.DefaultTimeout
        );
        await this.Page.click(
          AgentChatConstants.CustomerLanguageLookupValue.replace(
            "{0}",
            this.CustomerFullName
          )
        );
      }
      console.info("Contact selection from CustomerSummary screen - End");
    }
  }
  public async verifyNotificationPopup() {
    try {
      const notification = await this._page.waitForSelector(
        AgentChatConstants.AcceptButtonId
      );
      return !(notification === null);
    } catch {
      console.log(`Notification did not appear`);
    }
    return false;
  }

  public async createNotesRecord() {
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.CreateNewTimelineRecord,
      Constants.Three,
      null,
      Constants.MaxTimeout
    );
    await this.Page.click(AgentChatConstants.CreateNewTimelineRecord);
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.CreateNewNoteRecord,
      Constants.Three,
      null,
      Constants.MaxTimeout
    );
    await this.Page.click(AgentChatConstants.CreateNewNoteRecord);
    await this.waitUntilSelectorIsVisible(AgentChatConstants.NoteTitleSelector);
    await this.Page.fill(
      AgentChatConstants.NoteTitleSelector,
      AgentChatConstants.NoteActivity
    );
    await this.Page.click(AgentChatConstants.AddNoteBtnSelector);
  }

  public async validateNotesActivity() {
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.NoteActivityRecordSelector
    );
    const noteActivityRecordSelector = await this.Page.waitForSelector(
      AgentChatConstants.NoteActivityRecordSelector
    );
    const noteActivityRecord = await noteActivityRecordSelector.textContent();
    if (noteActivityRecord === AgentChatConstants.NoteActivity) {
      return true;
    }
    return false;
  }

  public async createPostActivityRecord() {
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.NoteActivityRecordSelector,
      Constants.Three,
      null,
      Constants.MaxTimeout
    );
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.CreateNewTimelineRecord,
      Constants.Three,
      null,
      Constants.MaxTimeout
    );
    await this.Page.click(AgentChatConstants.CreateNewTimelineRecord);
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.CreateNewPostRecord,
      Constants.Three,
      null,
      Constants.MaxTimeout
    );
    await this.Page.click(AgentChatConstants.CreateNewPostRecord);
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.PostTextAreaSelector
    );
    await this.Page.fill(
      AgentChatConstants.PostTextAreaSelector,
      AgentChatConstants.PostActivity
    );
    await this.Page.click(AgentChatConstants.AddPostBtnSelector);
  }

  public async validatePostActivity() {
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.PostActivityRecordSelector
    );
    const postActivityRecordSelector = await this.Page.waitForSelector(
      AgentChatConstants.PostActivityRecordSelector
    );
    const postActivityRecord = await postActivityRecordSelector.textContent();
    return postActivityRecord === AgentChatConstants.PostActivity;
  }

  // Navigate to Active sessions
  public async navigateToActiveSession(OngoingChatSessionSelector: string) {
    const sessionButton = await this.Page.waitForSelector(
      OngoingChatSessionSelector
    );
    await sessionButton.click();
  }

  // Navigate to inactive session
  public async inActiveSessionToBeVisible() {
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.ActiveOngoingSecondSession,
      Constants.Three,
      this._page,
      Constants.MaxTimeout
    );
  }
  catch(Exception) {
    Error("Session indicators are not loading for unread messages");
  }

  public async setPresenceAsBusyDND() {
    await this._page.waitForSelector(SelectorConstants.AgentStatusButton);
    await this._page.focus(SelectorConstants.AgentStatusButton);
    await this._page.click(SelectorConstants.AgentStatusButton);
    const timeout: number = Constants.FiveThousand;
    const selectElement = await this._page
      .waitForSelector(SelectorConstants.SelectStatusElement, { timeout })
      .catch((error) => {
        throw new Error(
          `Agent Status change icon doesn't appear. Inner exception: ${error.message}`
        );
      });
    selectElement.selectOption({
      label: SelectorConstants.DoNotDisturb.toString(),
    });
    await this.waitUntilSelectorIsVisible(
      SelectorConstants.AgentStatusOkButton
    );
    await this._page.waitForSelector(SelectorConstants.AgentStatusOkButton, {
      timeout,
    });
    await this._page.click(SelectorConstants.AgentStatusOkButton);
  }
  // Create agent notes without saving
  public async createAgentNotesWithOutSaving() {
    var flag = false;
    let newContact;
    try {
      await this.Page.waitForTimeout(Constants.DefaultTimeout);
      newContact = await this.Page.waitForSelector(
        AgentChatConstants.CreateNewContact
      );
      flag = true;
    } catch {
      flag = false;
    }
    if (flag) {
      await newContact.click();
      const contactName = await this.Page.waitForSelector(
        AgentChatConstants.ContactName
      );
      const name = `${this.ContactData.ContactName}_${new Date().getTime()}`;
      await contactName.fill(name);
      const lastName = await this.Page.waitForSelector(
        AgentChatConstants.ContactLastName
      );
      await lastName.fill(this.ContactData.ContactLastName);
      const saveButton = await this.Page.waitForSelector(
        SelectorConstants.FormSaveAndCloseButton
      );
      await saveButton.click();
      await this.waitForSaveComplete();
      await this.waitUntilSelectorIsVisible(`label[title*=${name}]`);
    }
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    await iframe.waitForSelector(HTMLConstants.BUTTON_ROW_FOOTER);
    await iframe.dispatchEvent(HTMLConstants.MORE_ID, "click");
    await iframe.waitForSelector(HTMLConstants.MORE_MENU_ITEMS_POPUP);
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.MakeNotesButton,
      AgentChatConstants.Five,
      iframe,
      Constants.DefaultTimeout
    );
    await iframe.$eval(AgentChatConstants.MakeNotesButton, (el) => {
      (el as HTMLElement).click();
    });
    const iframeNotesPanel: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeWidgetValue
    );
    await iframeNotesPanel.waitForSelector(
      AgentChatConstants.AgentTextAreaNotes
    );
    await iframeNotesPanel.fill(
      AgentChatConstants.AgentTextAreaNotes,
      Constants.AgentNotesData
    );
  }

  public async validateChatWaitingState() {
    let dataCount = 0;
    const maxCount: number = Constants.Ten;
    const timeout: number = Constants.FiveThousand;
    const workItemStatus: string = Constants.Waiting;
    const pageObject = this.Page;
    while (dataCount < maxCount) {
      try {
        const statusLocator = await pageObject.waitForSelector(
          AgentChatConstants.WorkItemStatus,
          {
            timeout,
          }
        );
        const expectedStatus = await statusLocator.innerText();
        if (expectedStatus === workItemStatus) return true;
      } catch (error) {
        console.log(
          `Method validateChatWaitingState iteration number: ${dataCount}`
        );
        console.log(
          `Method validateChatWaitingState throwing exception with message: ${error.message}`
        );
      }
      await this.RefreshAllTab();
      dataCount++;
    }
    return false;
  }

  public async isEndConversationButtonDisabled(iframeCC): Promise<boolean> {
    await iframeCC.waitForTimeout(Constants.DefaultTimeout);
    return await iframeCC.$eval(HTMLConstants.END_CONVERSATION_BUTTON, (el) => {
      return (
        el.getAttribute("aria-disabled") === "true" &&
        el.classList.contains("end-button-disabled")
      );
    });
  }
  public async isPublicButtonDisabled(usedPage): Promise<boolean> {
    return await usedPage.$eval(HTMLConstants.PUBLIC_BUTTON, (el) => {
      return (
        el.getAttribute("aria-disabled") === "true" &&
        el.classList.contains("text-blue")
      );
    });
  }

  public async waitUntilChatTransferToQueue(
    chatSubjectCustomerName: string,
    queuetoAssignName: string,
    maxCount: number = Constants.Three,
    timeout: number = Constants.FourThousandsMiliSeconds
  ) {
    let dataCount = 0;
    while (dataCount < maxCount) {
      try {
        await this.refreshDashBoard();
        const conversation = await this.Page.waitForSelector(
          AgentChatConstants.OngoingDashboardCoversationByTitleAndStatus.replace(
            "{subject}",
            chatSubjectCustomerName
          ).replace("{status}", "Open"),
          { timeout }
        );
        await conversation.click();
        const assignedQueue =
          await this.GetQueueNameOfTheSelectedConversation();
        if (assignedQueue == queuetoAssignName) return true;
      } catch (error) {
        console.log(
          `Method waitUntilChatTransferToQueue iteration number: ${dataCount}`
        );
        console.log(
          `Method waitUntilChatTransferToQueue throwing exception with message: ${error.message}`
        );
      }
      dataCount++;
    }
    return false;
  }

  public async validateTransferNotificationTitle(textToValidate: string) {
    let dataCount = 0;
    const maxCount: number = Constants.Twenty;
    const ExpectedNotificationtitle: string = textToValidate;

    try {
      while (dataCount < maxCount) {
        const title = await this.Page.waitForSelector(
          AgentChatConstants.NotificationHeaderTitle
        );
        const actualNotificationtitle = await title.innerText();
        if (
          ExpectedNotificationtitle === actualNotificationtitle.substring(0, 20)
        ) {
          await this.acceptInvitationToChat();
          return true;
        } else {
          await this._page.click(AgentChatConstants.DeclineButtonId);
        }
        await this.RefreshAllTab();
        await this.setAgentStatusToAvailable();
        await this.waitUntilSelectorIsVisible(
          AgentChatConstants.NotificationHeaderTitle,
          AgentChatConstants.Five,
          this.Page,
          Constants.FourThousandsMiliSeconds
        );
        dataCount++;
      }
    } catch (err) {
      console.info(`validateNotificationTitleErrorMessage: ${err.message}`);
    }
    return false;
  }

  public async validateChatWrapUpState() {
    let dataCount = 0;
    const maxCount: number = Constants.Ten;
    const timeout: number = Constants.FiveThousand;
    const workItemStatus: string = Constants.WrapUp;
    const pageObject = this.Page;
    while (dataCount < maxCount) {
      try {
        const statusLocator = await pageObject.waitForSelector(
          AgentChatConstants.WorkItemStatus,
          {
            timeout,
          }
        );
        const expectedStatus = await statusLocator.innerText();
        if (expectedStatus === workItemStatus) return true;
      } catch (error) {
        console.log(
          `Method validateChatWrapUpState iteration number: ${dataCount}`
        );
        console.log(
          `Method validateChatWrapUpState throwing exception with message: ${error.message}`
        );
      }
      await this.RefreshAllTab();
      dataCount++;
    }
    return false;
  }

  // Verification of existing notes record
  public async verificationOfExistingNotesRecord() {
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.CreateNewTimelineRecord,
      Constants.Three,
      null,
      Constants.MaxTimeout
    );
    await this.validateNoteCreation();
  }

  // Verification of add notes icon visibility
  public async verificationOfAddNotesIconVisibility() {
    try {
      await this.waitUntilSelectorIsVisible(
        AgentChatConstants.AddNotesIcon,
        Constants.Three,
        null,
        Constants.MaxTimeout
      );
    } catch {
      console.log(`Add Notes button not appear`);
    }
  }

  // Miximize the conversation iframe
  public async MiximizeConversation() {
    await this.waitForDomContentLoaded();
    const collapse = await this.Page.waitForSelector(
      SelectorConstants.ExpandSidePannel
    );
    await collapse.click();
  }

  // Collapse side pane
  public async CollapseSidePane() {
    await this.waitForDomContentLoaded();
    const collapse = await this.Page.waitForSelector(
      SelectorConstants.CollapseSidePane
    );
    await collapse.click();
  }

  public async CustomerDisconnectMessage(timeOut: number) {
    console.info(
      "Customer Disconnected at: " +
      (await this.GetCurrentDateAndTime()).toString()
    );
    await this._page.waitForTimeout(timeOut);
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    try {
      await iframe.waitForSelector(AgentChatConstants.DisconnectMessage);
      console.info(
        "(Reconnect) Disconnected Message Appeared at: " +
        (await this.GetCurrentDateAndTime()).toString()
      );
    } catch (error) {
      throw new Error(
        `Timeout exceeds for (Reconnect) 'DisconnectMessage' method. Error message: ${error.message}`
      );
    }
  }

  public async disableTranslations() {
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    await iframe.waitForSelector(AgentChatConstants.SeeMore);
    await iframe.$eval(AgentChatConstants.SeeMore, (el) => {
      (el as HTMLElement).click();
    });
    const translation = await iframe.waitForSelector(
      AgentChatConstants.TranslationText
    );
    const text = translation.innerText();
    if ((await text) === AgentChatConstants.TranslationoffLabel) {
      await iframe.waitForSelector(AgentChatConstants.Translationsclick);
      await iframe.$eval(AgentChatConstants.Translationsclick, (el) => {
        (el as HTMLElement).click();
      });
    } else {
    }
  }
  public async validateWorkDistriButionModeInOpenWorkItemQueue(
    distributionModeText: string
  ) {
    const workdistributionMode = await this.Page.waitForSelector(
      SelectorConstants.WorkDistributionModeSelector
    );
    const workdistributionModeValue = await workdistributionMode.textContent();
    return workdistributionModeValue === distributionModeText;
  }

  public async waitForOpenDistributionModeItemCountIncrease(
    oldOpenWSRecordValue: number,
    maxCount: number,
    page: Page,
    timeout: number,
    OpenWSSelector: string
  ) {
    let dataCount = 0;
    let pageObject = page ?? this.Page;
    let result: boolean = false;
    while (dataCount < maxCount) {
      try {
        await pageObject.click(AgentChatConstants.RefreshAllTab);
        await this.waitUntilSelectorIsVisible(
          AgentChatConstants.RefreshAllTab,
          Constants.Two,
          null,
          Constants.FiveThousand
        );
        const newOpenWSRecordValue: number = await this.getOpenWSRecordCount();
        if (newOpenWSRecordValue - oldOpenWSRecordValue > 0) {
          console.info(
            "New Item increased in Open WorkItem list: method 'waitForOpenDistributionModeItemCountIncrease'"
          );
          return true;
        } else {
          await pageObject.waitForTimeout(timeout);
        }
      } catch (error) {
        console.log(`Method waitForOpenDistributionModeItemCountIncrease throwing exception with message: ${error.message}`);
      } //This catch statement will handle selector not found error during loop itreation process. This method already return false if selector not found so no need to add logging statements in catch block.
      dataCount++;
    }
  }

  public async validatelabel(text: string) {
    if (text === Constants.EndChat || text === Constants.EndConversation) {
      return true;
    } else {
      return false;
    }
  }

  public async ValidateFontStyle() {
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    const fontFamily = await iframe.$eval(
      AgentChatConstants.TextArea,
      (el) => window.getComputedStyle(el).fontFamily
    );
    return fontFamily;
  }

  public async ValidateFontAlign() {
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    const marginLeft = await iframe.$eval(
      AgentChatConstants.TextArea,
      (el) => window.getComputedStyle(el).marginLeft
    );
    return marginLeft;
  }

  public async validateCaseIsLinkedWithConversation() {
    const result = await this.waitUntilSelectorIsVisible(
      AgentChatConstants.CaseLinkedWithConversationSelector,
      Constants.Two,
      this.Page,
      Constants.WaitingOneMinute
    );
    return result;
  }

  public async waitUntilSuggestionCardIsVisible(
    selectorVal: string,
    maxCount: number,
    page: Page,
    timeout: number
  ) {
    let dataCount = 0;
    let pageObject = page ?? this.Page;
    while (dataCount < maxCount) {
      try {
        //We need to explicity wait for the elment to disappear and get next element in the first row, the elememt gets disapear with animation and take some time to vanish.
        await this._page.waitForTimeout(Constants.DefaultTimeout);
        await pageObject.waitForSelector(
          SmartAssistConstants.SmartAssistSuggestionDivSelector.replace(
            "{0}",
            selectorVal
          ),
          { timeout }
        );
        dataCount++;
      } catch {
        return true;
      }
    }
    return false;
  }

  public async NavigateToCustomerSummaryAddtionalTab() {
    await this.waitUntilSelectorIsVisible(
      SelectorConstants.VisitorDetailsTab,
      Constants.Two,
      null,
      Constants.FiveThousand
    );
    await this.Page.click(SelectorConstants.VisitorDetailsTab);
    await this.waitUntilSelectorIsVisible(
      SelectorConstants.AddtionalDetailsTab,
      Constants.Two,
      null,
      Constants.FiveThousand
    );
    await this.Page.click(SelectorConstants.AddtionalDetailsTab);
  }

  public async ValidateNameContextVariable() {
    await this.waitForDomContentLoaded();
    await this.waitUntilSelectorIsVisible(
      SelectorConstants.NameKeyLabelSelector,
      Constants.Two,
      null,
      Constants.FourThousandsMiliSeconds
    );
    await this.waitUntilSelectorIsVisible(
      SelectorConstants.NameValueLabelSelector,
      Constants.Two,
      null,
      Constants.FourThousandsMiliSeconds
    );
    const NameKey = await this.Page.waitForSelector(
      SelectorConstants.NameKeyLabelSelector
    );
    const NameKeyText = await NameKey.textContent();
    const NameVal = await this.Page.waitForSelector(
      SelectorConstants.NameValueLabelSelector
    );
    const NameValText = await NameVal.textContent();
    return (
      NameKeyText.startsWith(Constants.NameKey) &&
      NameValText.startsWith(Constants.NameVal)
    );
  }

  public async ValidateEmailContextVariable() {
    await this.waitForDomContentLoaded();
    await this.waitUntilSelectorIsVisible(
      SelectorConstants.EmailKeyLabelSelector,
      Constants.Two,
      null,
      Constants.FourThousandsMiliSeconds
    );
    await this.waitUntilSelectorIsVisible(
      SelectorConstants.EmailValueLabelSelector,
      Constants.Two,
      null,
      Constants.FourThousandsMiliSeconds
    );
    const EmailKey = await this.Page.waitForSelector(
      SelectorConstants.EmailKeyLabelSelector
    );
    const EmailKeyText = await EmailKey.textContent();
    const EmailVal = await this.Page.waitForSelector(
      SelectorConstants.EmailValueLabelSelector
    );
    const EmailValText = await EmailVal.textContent();
    return (
      EmailKeyText.startsWith(Constants.EmailKey) &&
      EmailValText.startsWith(Constants.EmailVal)
    );
  }

  public async ValidateUserNameContextVariable() {
    await this.waitForDomContentLoaded();
    await this.waitUntilSelectorIsVisible(
      SelectorConstants.UserNameKeyLabelSelector,
      Constants.Two,
      null,
      Constants.FourThousandsMiliSeconds
    );
    await this.waitUntilSelectorIsVisible(
      SelectorConstants.UserNameValueLabelSelector,
      Constants.Two,
      null,
      Constants.FourThousandsMiliSeconds
    );
    const UserNameKey = await this.Page.waitForSelector(
      SelectorConstants.UserNameKeyLabelSelector
    );
    const UserNameKeyText = await UserNameKey.textContent();
    const UserNameVal = await this.Page.waitForSelector(
      SelectorConstants.UserNameValueLabelSelector
    );
    const UserNameValText = await UserNameVal.textContent();
    return (
      UserNameKeyText.startsWith(Constants.UserNameKey) &&
      UserNameValText.startsWith(Constants.UserNameVal)
    );
  }

  public async ClickAccount() {
    await this.waitForDomContentLoaded();
    await this.Page.click(AgentChatConstants.AccName);
  }
  public async title() {
    await this.waitForDomContentLoaded();
    await this.Page.isVisible(AgentChatConstants.AccTitle);
  }
  public async closetab() {
    await this.Page.click(AgentChatConstants.CloseTab);
  }

  // Validate account linking
  public async validateAccountIsLinked() {
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.SystemAlertMessageSelector
    );
    const accountLinkedMessageSelector = await this.Page.waitForSelector(
      AgentChatConstants.SystemAlertMessageSelector
    );
    const accountLinkedMessage =
      await accountLinkedMessageSelector.textContent();
    if (
      accountLinkedMessage.startsWith(AgentChatConstants.AccountMessageText)
    ) {
      return true;
    }
    return false;
  }

  // Verification of personal quick reply buttons
  public async VerifyPersonalQuickReplyButtons() {
    const newRecordButton = await this.Page.waitForSelector(
      SelectorConstants.NewAddTabButton
    );
    await newRecordButton.click();
    await (
      await this.Page.waitForSelector(
        SelectorConstants.PersonalizationTabButton
      )
    ).click();
    await (
      await this.Page.waitForSelector(SelectorConstants.NewQuickReplyButton)
    ).click();
    const saveQuickRepliesButton = await this.Page.waitForSelector(
      SelectorConstants.SavePersonalQuickRepliesButton
    );
    expect(saveQuickRepliesButton).not.toEqual(null);
    const saveandCloseQuickRepliesButton = await this.Page.waitForSelector(
      SelectorConstants.SaveAndCloseQuickRepliesButton
    );
    expect(saveandCloseQuickRepliesButton).not.toEqual(null);

    const newQuickRepliesButton = await this.Page.waitForSelector(
      SelectorConstants.NewPersonalQuickButton
    );
    expect(newQuickRepliesButton).not.toEqual(null);
  }

  public async VerifyAISuggestionCardsTriggered() {
    return await this.waitUntilSelectorIsVisible(
      SmartAssistConstants.SmartAssistAISuggestionCardsTriggeredSelector,
      AgentChatConstants.Three,
      null,
      Constants.MaxTimeout
    );
  }

  // Verification of agent quick reply disabled status
  public async VerifyPersonalQuickReplyDisabledStatus(
    messageXpath: string,
    text: string
  ) {
    const newRecordButton = await this.Page.waitForSelector(
      SelectorConstants.NewAddTabButton
    );
    await newRecordButton.click();
    await (
      await this.Page.waitForSelector(
        SelectorConstants.PersonalizationTabButton
      )
    ).click();
    const systemmessage = await this.Page.waitForSelector(messageXpath);
    const entityItemText = await systemmessage.textContent();
    await entityItemText.startsWith(text);
    const soundSettingsQuickReply = await this.Page.waitForSelector(
      SelectorConstants.SoundSettingsTab
    );
    expect(soundSettingsQuickReply).not.toEqual(null);
  }

  //This method is used to hide consult pane if its in expanded mode.
  public async hideConsultPane() {
    const iframeCC = await IFrameHelper.GetIframe(
      this._page,
      IFrameConstants.IframeCC
    );
    const ConsultPaneBtnVisible = await this.waitUntilSelectorIsVisible(
      AgentChatConstants.CollapseConsultPaneSelector,
      AgentChatConstants.One,
      iframeCC,
      Constants.DefaultTimeout
    );
    if (ConsultPaneBtnVisible) {
      await iframeCC.$eval(
        AgentChatConstants.CollapseConsultPaneSelector,
        (el) => (el as HTMLElement).click()
      );
    }
  }

  public async closeConsultChat() {
    try {
      const iframeCC = await IFrameHelper.GetIframe(
        this._page,
        IFrameConstants.IframeCC
      );
      let chatEnable: boolean = false;

      const ConsultPaneBtnVisible = await this.waitUntilSelectorIsVisible(
        AgentChatConstants.CollapseConsultPaneSelector,
        AgentChatConstants.Two,
        iframeCC,
        Constants.DefaultTimeout
      );
      if (ConsultPaneBtnVisible) {
        await iframeCC.$eval(
          AgentChatConstants.CollapseConsultPaneSelector,
          (el) => (el as HTMLElement).click()
        );
      }
      await this.hideConsultPane();

      const endBtnDisable = await this.waitUntilSelectorIsVisible(
        AgentChatConstants.EndConversationBtnDisabledXPath,
        AgentChatConstants.Two,
        iframeCC,
        Constants.DefaultTimeout
      );
      if (!endBtnDisable) {
        const endBtnEnable = await this.waitUntilSelectorIsVisible(
          AgentChatConstants.LeaveConversationBtnXPath,
          AgentChatConstants.Two,
          iframeCC,
          Constants.DefaultTimeout
        );
        if (endBtnEnable) {
          await iframeCC.$eval(
            AgentChatConstants.LeaveConversationBtnXPath,
            (el) => (el as HTMLElement).click()
          );
          chatEnable = true;
        }
      } else {
        chatEnable = true;
      }
      if (chatEnable) {
        await this._page.waitForTimeout(Constants.DefaultTimeout);
        await this.waitUntilSelectorIsVisible(
          AgentChatConstants.EndConversationBtnDisabledXPath,
          AgentChatConstants.Three,
          iframeCC,
          Constants.DefaultTimeout
        );
        await this._page.$eval(
          AgentChatConstants.RemoveConversationBtnClass,
          (el) => (el as HTMLElement).click()
        );
        await this.waitUntilSelectorIsVisible(
          AgentChatConstants.ConfirmButtonId,
          Constants.Three,
          this._page,
          Constants.MaxTimeout
        );
        await this._page.$eval(AgentChatConstants.ConfirmButtonId, (el) =>
          (el as HTMLElement).click()
        );
        await this._page.waitForTimeout(Constants.DefaultTimeout);
      }
    } catch (error) {
      console.log(`Method closeConsultChat throwing exception with message: ${error.message}`);
    }
  }

  public async navigateToOnlineConversationTabPage(entityType: string = "") {
    const newTabSelector = await this._page.waitForSelector(
      SelectorConstants.CreateNewTabSelector
    );
    await newTabSelector.hover();
    await newTabSelector.click();

    // select Accounts/Contacts/Cases
    const linkToConvSelector = await this._page.waitForSelector(
      stringFormat(SelectorConstants.LinkToConversationEntityButton, entityType)
    );
    await linkToConvSelector.hover();
    await linkToConvSelector.click();
  }

  public async clickLinkToConversation(convType: string) {
    await this.Page.click(
      stringFormat(SelectorConstants.LinkToConversationButton, convType)
    );
  }

  // Validate toast message for account/contact/case
  public async validateLinkConversationMessage(convType: string) {
    const linkAccountSuccess = await this.Page.waitForSelector(
      SelectorConstants.ToastNotificationListRootdiv
    );
    await this.waitUntilSelectorIsHidden(
      SelectorConstants.ToastNotificationListRootdiv
    );
    return (
      (await linkAccountSuccess.textContent()).toString() ===
      stringFormat(SelectorConstants.LinkToConversationNotification, convType)
    );
  }

  public async validateAgentIsRemovedFromConversation() {
    const iframeCC = await IFrameHelper.GetIframe(
      this._page,
      IFrameConstants.IframeCC
    );
    return await this.waitUntilSelectorIsVisible(
      AgentChatConstants.EndConversationBtnDisabledXPath,
      AgentChatConstants.Five,
      iframeCC,
      Constants.DefaultTimeout
    );
  }

  public async DashboardGrids() {
    await this.waitUntilSelectorIsVisible(SelectorConstants.WorkItemsGrid);
    await this.waitUntilSelectorIsVisible(SelectorConstants.OpenWorkItemsGrid);
    await this.waitUntilSelectorIsVisible(
      SelectorConstants.ClosedWorkItemsGrid
    );
  }

  public async getConveIdFromUrl() {
    const btn = await this.Page.waitForSelector(
      SelectorConstants.CopyUrlButtonSelector
    );
    await btn.click();
    const url = await this.Page.evaluate((Y) => navigator.clipboard.readText());
    return url;
  }

  public async verifyCopyUrlButton() {
    const copyurlButton = await this.Page.$(
      SelectorConstants.CopyUrlButtonSelector
    );
    return copyurlButton;
  }

  public async waitForAgentInsightsScreenLoad(frame: any) {
    await this.waitForScreenLoad(frame);
    await this.waitUntilFrameSelectorIsVisible(
      SelectorConstants.AgentStatusPath.replace(
        "{0}",
        AgentChatConstants.Consult
      ),
      frame,
      Constants.One,
      Constants.TenThousand
    );
    await this.waitUntilFrameSelectorIsVisible(
      SelectorConstants.AgentStatusPath.replace(
        "{1}",
        AgentChatConstants.Monitor
      ),
      frame,
      Constants.One,
      Constants.FiveThousand
    );
    await this.waitUntilFrameSelectorIsVisible(
      SelectorConstants.AgentStatusPath.replace(
        "{2}",
        AgentChatConstants.Primary
      ),
      frame,
      Constants.One,
      Constants.FiveThousand
    );
  }

  public async loadIntradayInsights(frame: any) {
    await this.waitForInfraDayInsightsScreenLoad(frame);
    await this.waitUntilFrameSelectorIsVisible(
      SelectorConstants.DurationSelector,
      frame,
      Constants.One,
      Constants.DefaultTimeout
    );
  }

  public async Navigatetoagentinsights() {
    await this.waitUntilSelectorIsVisible(
      SelectorConstants.OmniChannelIntradayInsights,
      AgentChatConstants.Two,
      this.Page,
      AgentChatConstants.FiveThousandsMiliSecondsWaitTimeout
    );
    await this.Page.click(SelectorConstants.IntradayInsightsDropDown);
    await this.Page.click(SelectorConstants.AgentInsights);
  }
  public async verifyAgentInsights(
    frame: any,
    timeout: number = Constants.TenThousand
  ) {
    await this.waitForAgentInsightsScreenLoad(frame);
    await this.waitUntilFrameSelectorIsVisible(
      SelectorConstants.AgentToolTip,
      frame,
      Constants.One,
      Constants.DefaultTimeout
    );
    const Tooltip = await frame.waitForSelector(
      SelectorConstants.AgentToolTip,
      { timeout }
    );
    await Tooltip.hover();
  }

  public async NavigatetoConversationInsights(frame: any) {
    await this.waitUntilSelectorIsVisible(
      SelectorConstants.OmniChannelIntradayInsights,
      AgentChatConstants.Two,
      this.Page,
      AgentChatConstants.FiveThousandsMiliSecondsWaitTimeout
    );
    await this.Page.click(SelectorConstants.IntradayInsightsDropDown);
    await this.Page.click(SelectorConstants.ConversationInsights);
    await this.waitForScreenLoad(frame);
  }

  public async navigateToConversationInsights() {
    await this.waitUntilSelectorIsVisible(
      SelectorConstants.OmniChannelIntradayInsights,
      AgentChatConstants.Two,
      this.Page,
      AgentChatConstants.FiveThousandsMiliSecondsWaitTimeout
    );
    await this.Page.click(SelectorConstants.IntradayInsightsDropDown);
    await this.Page.click(SelectorConstants.ConversationInsights);
  }

  public async verifyConversationInsights(
    frame: any,
    timeout: number = Constants.TenThousand
  ) {
    await this.waitForAgentInsightsScreenLoad(frame);
    await this.waitUntilFrameSelectorIsVisible(
      SelectorConstants.ConversationInsightReportHeading,
      frame,
      Constants.One,
      Constants.DefaultTimeout
    );
    const Tooltip = await frame.waitForSelector(
      SelectorConstants.ConversationInsightReportHeading,
      { timeout }
    );
    await Tooltip.hover();
  }

  public async ValidateToolTipContentStatusSince(frame: any) {
    await this.waitUntilFrameSelectorIsVisible(
      SelectorConstants.AgentToolTip,
      frame,
      Constants.One,
      Constants.DefaultTimeout
    );
    const Tooltip = await frame.waitForSelector(SelectorConstants.AgentToolTip);
    await Tooltip.hover();
    return frame.waitForSelector(SelectorConstants.StatusSince);
  }
  public async ValidateToolTipContentLoggedOnDuration(frame: any) {
    await this.waitUntilFrameSelectorIsVisible(
      SelectorConstants.AgentToolTip,
      frame,
      Constants.One,
      Constants.DefaultTimeout
    );
    const Tooltip = await frame.waitForSelector(SelectorConstants.AgentToolTip);
    await Tooltip.hover();
    return frame.waitForSelector(SelectorConstants.LoggedonDuration);
  }
  public async ValidateToolTipContentOngoingConversation(frame: any) {
    await this.waitUntilFrameSelectorIsVisible(
      SelectorConstants.AgentToolTip,
      frame,
      Constants.One,
      Constants.DefaultTimeout
    );
    const Tooltip = await frame.waitForSelector(SelectorConstants.AgentToolTip);
    await Tooltip.hover();
    return frame.waitForSelector(SelectorConstants.OngoingConversation);
  }
  public async ValidateToolTipContentAvailableCapacity(frame: any) {
    await this.waitUntilFrameSelectorIsVisible(
      SelectorConstants.AgentToolTip,
      frame,
      Constants.One,
      Constants.DefaultTimeout
    );
    const Tooltip = await frame.waitForSelector(SelectorConstants.AgentToolTip);
    await Tooltip.hover();
    return frame.waitForSelector(SelectorConstants.AvailableCapacity);
  }
  public async ValidateToolTipContentSentimentsAndCount(frame: any) {
    await this.waitUntilFrameSelectorIsVisible(
      SelectorConstants.AgentToolTip,
      frame,
      Constants.One,
      Constants.DefaultTimeout
    );
    const Tooltip = await frame.waitForSelector(SelectorConstants.AgentToolTip);
    await Tooltip.hover();
    return frame.waitForSelector(SelectorConstants.SentimentsAndCount);
  }
  public async ValidateToolTipContentCount(frame: any) {
    await this.waitUntilFrameSelectorIsVisible(
      SelectorConstants.AgentToolTip,
      frame,
      Constants.One,
      Constants.DefaultTimeout
    );
    const Tooltip = await frame.waitForSelector(SelectorConstants.AgentToolTip);
    await Tooltip.hover();
    return frame.waitForSelector(SelectorConstants.Count);
  }
  public async ValidateEndButtonDisable() {
    const iframeCC = await IFrameHelper.GetIframe(
      this._page,
      IFrameConstants.IframeCC
    );
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.EndConversationBtnDisabledXPath,
      AgentChatConstants.Three,
      iframeCC,
      Constants.OpenWsWaitTimeout
    );
    return iframeCC.waitForSelector(
      AgentChatConstants.EndConversationBtnDisabledXPath
    );
  }
  public async ValidateDisconnectContentText() {
    let systemmessage;
    const iframeCC = await IFrameHelper.GetIframe(
      this._page,
      IFrameConstants.IframeCC
    );
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.DisconnectMessageText,
      AgentChatConstants.Three,
      iframeCC,
      Constants.OpenWsWaitTimeout
    );
    systemmessage = await iframeCC.waitForSelector(
      AgentChatConstants.DisconnectMessageText
    );

    const ItemText = await systemmessage.textContent();
    return ItemText;
  }
  public async goChatVisitor() {
    const chatWidgetbtn = await this.Page.waitForSelector(
      AgentChatConstants.ChatWidgetButton1
    );
    await chatWidgetbtn.click();
  }
  public async validateWrapUpStatusActive() {
    return await this._page.waitForSelector(
      AgentChatConstants.CheckChatStatusActive
    );
  }

  public async validatequickreplieslanguage(message: string = "#q1") {
    await this.waitForDomContentLoaded();
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.MessageTextArea,
      AgentChatConstants.Three,
      iframe,
      Constants.MaxTimeout
    );
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.QuickRepliesBtnSelector,
      AgentChatConstants.Five,
      iframe,
      Constants.MaxTimeout
    );
    await iframe.$eval(AgentChatConstants.QuickRepliesBtnSelector, (el) => {
      (el as HTMLElement).click();
    });
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.QuickReplyLanguageSelector,
      AgentChatConstants.Five,
      iframe,
      Constants.MaxTimeout
    );
    await iframe.$eval(AgentChatConstants.QuickReplyLanguageSelector, (el) => {
      (el as HTMLElement).click();
    });
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.QuickReplyLanguage,
      AgentChatConstants.Five,
      iframe,
      Constants.MaxTimeout
    );
    await iframe.$eval(AgentChatConstants.QuickReplyLanguage, (el) => {
      (el as HTMLElement).click();
    });
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.QuickReplyDataSelector,
      AgentChatConstants.Five,
      iframe,
      Constants.MaxTimeout
    );
  }

  public async FilterItemsByAgent(
    frame: any,
    agentName: string,
    queueName: string
  ) {
    await this.waitForInfraDayInsightsScreenLoad(frame);
    await this.FilterRecordsByAgentName(
      SelectorConstants.QueurDDSelector,
      frame,
      agentName
    );
    await this.FilterRecordsByQueuesName(
      SelectorConstants.QueurDDSelector,
      frame,
      queueName
    );
    await this.waitForInfraDayInsightsScreenLoad(frame);
  }

  public async FilterRecordsByAgentName(
    selectorVal: string,
    frame: any,
    agentName: string,
    maxCount = Constants.Three,
    timeout: number = Constants.TenThousand
  ) {
    let dataCount = 0;
    while (dataCount < maxCount) {
      try {
        await this.waitUntilFrameSelectorIsVisible(
          AgentChatConstants.DurationSelector,
          frame,
          Constants.One,
          Constants.DefaultTimeout
        );
        const omniChanelAgentInsightSelector = await frame.waitForSelector(
          AgentChatConstants.DurationSelector,
          { timeout }
        );
        await omniChanelAgentInsightSelector.click();
        await this._page.waitForTimeout(Constants.DefaultTimeout); //This static timeout required so that if queue selection popup remains in open state during failed run so before retrying queue filtration it will close

        await this.waitUntilFrameSelectorIsVisible(
          AgentChatConstants.AgentInsightsAgentSelector,
          frame,
          Constants.One,
          Constants.FiveThousand
        );
        const agentInsightsAgentName = await frame.waitForSelector(
          AgentChatConstants.AgentInsightsAgentSelector,
          { timeout }
        );
        await agentInsightsAgentName.click();

        await this.waitForScreenLoad(frame);

        await this.waitUntilFrameSelectorIsVisible(
          AgentChatConstants.IntraDayInsightQueueSelectionSelector,
          frame,
          Constants.One,
          Constants.FiveThousand
        );
        await this.waitUntilFrameSelectorIsVisible(
          AgentChatConstants.IntraDayInsightQueueTitleSelectionSelector,
          frame,
          Constants.One,
          Constants.FiveThousand
        );
        await this.waitUntilFrameSelectorIsVisible(
          AgentChatConstants.IntraDayInsightQueueCheckboxSelectionSelector,
          frame,
          Constants.One,
          Constants.FiveThousand
        );
        await this.waitUntilFrameSelectorIsVisible(
          AgentChatConstants.IntraDayInsightQueueInputSelector,
          frame,
          Constants.One,
          Constants.FiveThousand
        );
        const agentInsightsAgentInput = await frame.waitForSelector(
          AgentChatConstants.AgentInsightAgentInputSelector,
          { timeout }
        );
        await agentInsightsAgentInput.fill("");
        await agentInsightsAgentInput.type(agentName, { delay: 100 });

        await this.waitForScreenLoad(frame);
        await this._page.waitForTimeout(Constants.TenThousand); //This static timeout required so that required queue will be populated in intraday insight 'Queue' dropdown

        const agentInsightsConversationStatusItem = await frame.waitForSelector(
          AgentChatConstants.IntraDayInsightConversationStatusQueueSelector,
          { timeout }
        );
        await agentInsightsConversationStatusItem.focus();
        await this._page.waitForTimeout(Constants.DefaultTimeout); //This static timeout required so that queue selection popup will be kept in open state after focus
        await agentInsightsConversationStatusItem.click();

        await this.waitForScreenLoad(frame);
        await omniChanelAgentInsightSelector.click();
        await this.waitUntilFrameSelectorIsVisible(
          AgentChatConstants.DurationSelector,
          frame,
          Constants.One,
          Constants.DefaultTimeout
        );
        await this.waitUntilFrameSelectorIsVisible(
          selectorVal,
          frame,
          Constants.One,
          timeout
        );
        const queueSelector = await frame.waitForSelector(selectorVal, {
          timeout,
        });
        const entityItemText = await queueSelector.textContent();
        if (entityItemText.startsWith(agentName)) {
          return true;
        }
      } catch (error) {
        console.log(
          `Method FilterRecordsByAgentName iteration number: ${dataCount}`
        );
        console.log(
          `Method FilterRecordsByAgentName throwing exception with message: ${error.message}`
        );
      }
      dataCount++;
    }
    return false;
  }

  public async FilterRecordsByQueuesName(
    selectorVal: string,
    frame: any,
    queueName: string,
    timeout: number = Constants.TenThousand
  ) {
    try {
      await this.waitUntilFrameSelectorIsVisible(
        AgentChatConstants.AgentInsightsAgentSelector,
        frame,
        Constants.One,
        Constants.FiveThousand
      );
      const agentInsightQueuetName = await frame.waitForSelector(
        AgentChatConstants.AgentInsightsQueueSelector,
        { timeout }
      );
      await agentInsightQueuetName.click();

      await this.waitForScreenLoad(frame);
      await this.waitUntilFrameSelectorIsVisible(
        AgentChatConstants.AgentInsightQueueTitleSelectionSelector,
        frame,
        Constants.One,
        Constants.FiveThousand
      );
      await this.waitUntilFrameSelectorIsVisible(
        AgentChatConstants.AgentInsightQueueCheckboxSelectionSelector,
        frame,
        Constants.One,
        Constants.FiveThousand
      );
      await this.waitUntilFrameSelectorIsVisible(
        AgentChatConstants.AgentInsightQueueInputSelector,
        frame,
        Constants.One,
        Constants.FiveThousand
      );
      const agentInsightsQueueInput = await frame.waitForSelector(
        AgentChatConstants.AgentInsightQueueInputSelector,
        { timeout }
      );
      await agentInsightsQueueInput.fill("");
      await agentInsightsQueueInput.type(queueName, { delay: 100 });

      await this.waitForScreenLoad(frame);
      await this._page.waitForTimeout(Constants.TenThousand); //This static timeout required so that required queue will be populated in intraday insight 'Queue' dropdown

      const agentInsightsConversationQueueStatusItem =
        await frame.waitForSelector(
          AgentChatConstants.AgentInsightConversationStatusQueueSelector,
          { timeout }
        );
      await agentInsightsConversationQueueStatusItem.focus();
      await this._page.waitForTimeout(Constants.DefaultTimeout); //This static timeout required so that queue selection popup will be kept in open state after focus
      await agentInsightsConversationQueueStatusItem.click();

      await this.waitForScreenLoad(frame);

      await this.waitUntilFrameSelectorIsVisible(
        AgentChatConstants.DurationSelector,
        frame,
        Constants.One,
        Constants.DefaultTimeout
      );
      const omniChanelAgentInsightSelector = await frame.waitForSelector(
        AgentChatConstants.DurationSelector,
        { timeout }
      );
      await omniChanelAgentInsightSelector.click();
      await this.waitForScreenLoad(frame);
      const queueSelector = await frame.waitForSelector(selectorVal, {
        timeout,
      });
      const entityItemText = await queueSelector.textContent();
      if (entityItemText.startsWith(queueName)) {
        return true;
      }
    } catch (error) {
      console.log(
        `Method FilterRecordsByQueueName throwing exception with message: ${error.message}`
      );
    }
    return false;
  }

  public async verifyParticipationmode(iFrame: any) {
    return await iFrame.waitForSelector(SelectorConstants.AgentPrimaryStatus);
  }

  public async verifyAgentsGride(iFrame: any) {
    await this.waitUntilFrameSelectorIsVisible(
      SelectorConstants.AgentGridNameStatus,
      iFrame,
      Constants.One,
      Constants.DefaultTimeout
    );
    return await iFrame.waitForSelector(SelectorConstants.AgentGridNameStatus);
  }

  // Verification of recent cases message
  public async VerifyResetCasesMessage(messageXpath: string, text: string) {
    const systemmessage = await this.Page.waitForSelector(messageXpath);
    const entityItemText = await systemmessage.textContent();
    await entityItemText.startsWith(text);
  }

  // Verification of agent quick reply disabled status
  public async VerifyResetPresenceGlobalMessage(
    messageXpath: string,
    text: string
  ) {
    const systemmessage = await this.Page.waitForSelector(messageXpath);
    const entityItemText = await systemmessage.textContent();
    await entityItemText.startsWith(text);
  }
  // Verification of Reset Presence Button
  public async VerificationOfResetPresenceButon() {
    await this.waitForDomContentLoaded();
    const resetPresenceButton = await this.Page.waitForSelector(
      SelectorConstants.ResetPresenceButton
    );
    expect(resetPresenceButton).not.toEqual(null);
    await resetPresenceButton.click();
  }
  public async VerificationOfStatusIsAvailable() {
    const presence = await this.Page.waitForSelector(
      AgentConversationPageConstants.PresenceStatus
    );
    const status = await (await presence.getProperty("title")).jsonValue();
    if (
      status == AgentChatConstants.Available ||
      status == AgentChatConstants.Busy
    ) {
      return true;
    }
  }

  public async transferChatToQueueOfMessagingSubtype(queueName: string) {
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    const messageTextArea = await iframe.waitForSelector(
      AgentChatConstants.MessageTextArea
    );
    await iframe.$eval(AgentChatConstants.TransferChatButton, (el) => {
      (el as HTMLElement).click();
    });

    await messageTextArea.type(queueName, { delay: 100 });

    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.TransferQueueButton,
      AgentChatConstants.Five,
      iframe,
      AgentChatConstants.FiveThousandsMiliSecondsWaitTimeout
    );

    await iframe.$eval(AgentChatConstants.TransferQueueButton, (el) =>
      (el as HTMLElement).click()
    );
  }

  public async transferChatToQueueOfotherSubtype(queueName: string) {
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    const messageTextArea = await iframe.waitForSelector(
      AgentChatConstants.MessageTextArea
    );
    await iframe.$eval(AgentChatConstants.TransferChatButton, (el) => {
      (el as HTMLElement).click();
    });
    await messageTextArea.type(queueName, { delay: 100 });
    return iframe.waitForSelector(AgentChatConstants.NoResultFoundMsgSelector);
  }

  public async closePopUpchat() {
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.closeTransferQueueSearch,
      AgentChatConstants.Three,
      iframe
    );
    await iframe.$eval(AgentChatConstants.closeTransferQueueSearch, (el) =>
      (el as HTMLElement).click()
    );
  }

  public async ValidateMsgContentText() {
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.TransferToMessagingQueueMessage,
      AgentChatConstants.Three,
      iframe
    );
    return iframe.waitForSelector(
      AgentChatConstants.TransferToMessagingQueueMessage
    );
  }

  public async validatequickrepliesSearchText(message: string = "#q1") {
    await this.waitForDomContentLoaded();
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );

    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.QuickRepliesBtnSelector,
      AgentChatConstants.Five,
      iframe,
      Constants.MaxTimeout
    );
    await iframe.$eval(AgentChatConstants.QuickRepliesBtnSelector, (el) => {
      (el as HTMLElement).click();
    });

    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.QuickReplyDataSelector,
      AgentChatConstants.Five,
      iframe,
      15000
    );

    const textarea = await iframe.waitForSelector(
      AgentChatConstants.MessageTextArea
    );
    await textarea.fill("");
    const searchTxt: string = "/q " + "Sorry";
    await textarea.type(searchTxt, { delay: 100 });
    await this._page.keyboard.press(AgentChatConstants.SpaceKeyword);

    const markText = await iframe.waitForSelector(
      AgentChatConstants.QuickReplySearchSelector
    );
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.QuickReplyLanguageSelector,
      AgentChatConstants.Five,
      iframe,
      Constants.MaxTimeout
    );
    await iframe.$eval(AgentChatConstants.QuickReplyLanguageSelector, (el) => {
      (el as HTMLElement).click();
    });
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.QuickReplyLanguage,
      AgentChatConstants.Five,
      iframe,
      Constants.MaxTimeout
    );
    await iframe.$eval(AgentChatConstants.QuickReplyLanguage, (el) => {
      (el as HTMLElement).click();
    });

    const noResultFound = await this.waitUntilSelectorIsVisible(
      AgentChatConstants.NoResultFoundMsgSelector,
      AgentChatConstants.Five,
      iframe,
      Constants.MaxTimeout
    );
    if (!noResultFound) {
      return true;
    } else {
      return false;
    }
  }
  public async validateCustomerPersistentChatMessage(textToValidate: string) {
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    const messageSelector = await (
      await iframe.waitForSelector(
        AgentChatConstants.PersistentChatCustomerMsg.replace(
          "{0}",
          textToValidate
        ),
        { timeout: TimeoutConstants.Minute }
      )
    ).textContent();
    return !(messageSelector === null || messageSelector === undefined);
  }

  public async validateConsultPane() {
    await this.waitForDomContentLoaded();
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    const textarea = await iframe.waitForSelector(
      AgentChatConstants.ConsultMessageTextArea
    );
    await textarea.fill("");
    const searchTxt: string = "/c " + "agent";
    await textarea.type(searchTxt, { delay: 100 });
    await this._page.keyboard.press(AgentChatConstants.SpaceKeyword);
    const consultPopUp = await iframe.waitForSelector(
      AgentCosultConversationPageConstants.ConsultPopup
    );
    expect(consultPopUp).not.toEqual(null);
    await this.waitUntilSelectorIsVisible(
      AgentCosultConversationPageConstants.CloseFlyoutXButton,
      AgentChatConstants.Five,
      iframe,
      Constants.MaxTimeout
    );
    await iframe.$eval(
      AgentCosultConversationPageConstants.CloseFlyoutXButton,
      (el) => {
        (el as HTMLElement).click();
      }
    );
    await textarea.fill("");
    const searchTxtpop: string = "/c ";
    await textarea.type(searchTxtpop, { delay: 100 });
    await this._page.keyboard.press(AgentChatConstants.SpaceKeyword);
    await textarea.fill("");
  }
  public async downloadTransriptFile(isOldForm: boolean) {
    await this.waitForDomContentLoaded();
    await this.waitUntilSelectorIsVisible(
      SelectorConstants.TranscriptNewIframe,
      AgentChatConstants.Three
    );
    const downloadButtonSelector = isOldForm
      ? AgentChatConstants.TranscriptControlDownldButton
      : AgentChatConstants.MoreButtonSelector;

    const downloadButton = await this.Page.waitForSelector(downloadButtonSelector);
    if (!isOldForm) {
      await Promise.all([
        this.Page.$eval(AgentChatConstants.MoreButtonSelector, (el) =>
          (el as HTMLElement).click()
        ),
      ]);
      await Promise.all([
        this.Page.$eval(AgentChatConstants.TranscriptControlDownldButton, (el) =>
          (el as HTMLElement).click()
        ),
      ]);
      const [download] = await Promise.all([
        this.Page.waitForEvent(AgentChatConstants.DownloadEvent),
      ]);
      const path = await download.path();
      expect(path != null && path !== undefined && path !== "").toBeTruthy();

      const stream = await download.createReadStream();
      if (stream !== null) {
        return await this.readStream(stream);
      }
    }
    else {
      await Promise.all([
        this.Page.$eval(AgentChatConstants.TranscriptControlDownldButton, (el) =>
          (el as HTMLElement).click()
        ),
      ]);
      const [download] = await Promise.all([
        this.Page.waitForEvent(AgentChatConstants.DownloadEvent),
      ]);
      const path = await download.path();
      expect(path != null && path !== undefined && path !== "").toBeTruthy();

      const stream = await download.createReadStream();
      if (stream !== null) {
        return await this.readStream(stream);
      }
    }
  }

  private async readStream(readable) {
    readable.setEncoding("utf8");
    let data = "";
    for await (const chunk of readable) {
      data += chunk;
    }
    return data;
  }
  public async verifyAgentBannerWhenCustomerCloseChat() {
    try {
      await this.waitForDomContentLoaded();
      const iframe: Page = await IFrameHelper.GetIframe(
        this.Page,
        IFrameConstants.IframeCC
      );
      await this.waitUntilSelectorIsVisible(
        AgentChatConstants.EndConversationButtonDisabledXPath,
        AgentChatConstants.Three,
        iframe
      );
      await this.waitUntilSelectorIsVisible(
        AgentChatConstants.AgentBannerWhenCustomerCloseChatXPATH,
        AgentChatConstants.Five,
        iframe,
        Constants.MaxTimeout
      );
      const menuItem = await iframe.waitForSelector(
        AgentChatConstants.AgentBannerWhenCustomerCloseChatXPATH
      );
      const Title = await menuItem.textContent();
      expect(
        Title.includes(AgentChatConstants.AgentBannerWhenCustomerCloseChat)
      ).toBeTruthy();
      return true;
    } catch {
      return false;
    }
  }
  public async ValidateDisabledButtonsWhileConsult() {
    try {
      await this.waitForDomContentLoaded();
      const iframeCC: Page = await IFrameHelper.GetIframe(
        this.Page,
        IFrameConstants.IframeCC
      );
      await iframeCC.waitForSelector(HTMLConstants.END_CONVER_BUTTON);
      let endButtonClassName = await iframeCC.$eval(
        HTMLConstants.END_CONVER_BUTTON,
        (el) => (el as HTMLElement).className
      );
      expect(endButtonClassName).toContain(HTMLConstants.DISABLED);
      await this.waitUntilSelectorIsVisible(HTMLConstants.CONSULT_BUTTON);
      let consultButtonClassName = await iframeCC.$eval(
        HTMLConstants.CONSULT_BUTTON,
        (el) => (el as HTMLElement).className
      );
      expect(consultButtonClassName).toContain(HTMLConstants.DISABLED);
      await this.waitUntilSelectorIsVisible(HTMLConstants.TRANSFER_BUTTON);
      let transferButtonClassName = await iframeCC.$eval(
        HTMLConstants.TRANSFER_BUTTON,
        (el) => (el as HTMLElement).className
      );
      expect(transferButtonClassName).toContain(HTMLConstants.DISABLED);
      return true;
    } catch {
      return false;
    }
  }
  public async GetSessionName() {
    await this.waitForDomContentLoaded();
    const title = await this.Page.waitForSelector(
      AgentChatConstants.ChatTitleSelector
    );
    const question1 = await (await title.getProperty("alt")).jsonValue();
    return question1;
  }

  public async validateRelevanceSearchClosedConversationForm(
    expectedQueueName: string
  ) {
    await this.waitForDomContentLoaded();
    try {
      await this.waitUntilSelectorIsVisible(
        AgentChatConstants.ClosedConversationFormTitleSelector,
        AgentChatConstants.Three,
        this._page,
        Constants.MaxTimeout
      );
      const QueueName = await this.Page.waitForSelector(
        AgentChatConstants.RelevanceQueue
      );
      const ActualQueueName = await QueueName.innerText();
      return ActualQueueName === expectedQueueName;
    } catch (error) {
      console.log(
        `Method validateRelevanceSearchClosedConversationForm throwing exception with message: ${error.message}`
      );
    }
  }

  public async ClickOnKnowledgeArticleTool() {
    await this._page.waitForSelector(
      SmartAssistConstants.KnowledgeArticleTabSelector,
      { timeout: Constants.DefaultTimeout as any }
    );
    await this._page.waitForSelector(
      SmartAssistConstants.KnowledgeArticleTabSelector
    );
    await this._page.click(SmartAssistConstants.KnowledgeArticleTabSelector);
  }

  public async searchKnowledgeArticle() {
    await this.waitUntilSelectorIsVisible(
      PageConstants.FilterIcon,
      AgentChatConstants.Five,
      this.Page,
      Constants.FourThousandsMiliSeconds
    );
    await this.Page.waitForSelector(AgentChatConstants.SearchBoxContainer);
    await this.Page.fill(
      AgentChatConstants.SearchBox,
      AgentChatConstants.KBArticle
    );
    await this.Page.press(
      AgentChatConstants.SearchBox,
      AgentChatConstants.KeyEnter
    );
  }

  public async copyandsendKnowledgeArticle() {
    await this.waitUntilSelectorIsVisible(
      PageConstants.FilterIcon,
      AgentChatConstants.Five,
      this.Page,
      Constants.FourThousandsMiliSeconds
    );
    await this.Page.click(AgentChatConstants.ClickMoreItems);
    await this.Page.click(AgentChatConstants.SendKBArticles);
    await this.Page.keyboard.press(Constants.EnterKey);
    return await this.waitUntilSelectorIsVisible(
      AgentChatConstants.ChatMessageSelector.replace("{0}", Constants.KnowledgeArticle),
      AgentChatConstants.Five,
      this.Page,
      AgentChatConstants.TwoThousand
    );
  }

  public async openChatFromClosedWorkItems() {
    await this.waitForAgentStatus();
    await this.waitUntilWorkItemIsVisible(AgentChatConstants.ClosedChatOption);
    const openChatMoreOptions = await this._page.waitForSelector(
      AgentChatConstants.ClosedChatOption
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

  public async verifyTranscriptCustomerMessageText(
    messageNumber: number,
    expectedText: string
  ) {
    await this.waitForDomContentLoaded();
    await this.waitUntilSelectorIsVisible(
      SelectorConstants.TranscriptIFrame,
      AgentChatConstants.Three
    );
    const IFrame1 = await this.Page.$(SelectorConstants.TranscriptIFrame);
    const IFrame2 = await IFrame1.contentFrame();
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.CustomControl,
      AgentChatConstants.Five
    );
    const iFrame3 = await IFrame2.waitForSelector(
      AgentChatConstants.CustomControl
    );
    const transcriptmessage = await iFrame3.waitForSelector(
      AgentChatConstants.TransScriptnewContainertext
    );
    const value = await transcriptmessage.textContent();
    if (value.includes(expectedText)) {
      return true;
    }
  }

  public async downloadTransriptControlFile(isOldForm: boolean) {
    await this.waitForDomContentLoaded();
    await this.waitUntilSelectorIsVisible(
      SelectorConstants.TranscriptNewIframe,
      AgentChatConstants.Three
    );
    const downloadButtonSelector = isOldForm
      ? ConversationConstants.TranscriptDownloadButton
      : AgentChatConstants.TranscriptControlDownldButton;
    const downloadButton = await this.Page.waitForSelector(
      downloadButtonSelector
    );
    expect(downloadButton !== null).toBeTruthy();

    const [download] = await Promise.all([
      this.Page.waitForEvent(ConversationConstants.DownloadEvent),
      this.Page.$eval(downloadButtonSelector, (el) =>
        (el as HTMLElement).click()
      ),
    ]);
    const path = await download.path();
    expect(path != null && path !== undefined && path !== "").toBeTruthy();

    const stream = await download.createReadStream();
    if (stream !== null) {
      return await this.readStream(stream);
    }
    return "";
  }
  public async loadAgentInsights(
    frame: any,
    timeout: number = Constants.TenThousand
  ) {
    await this.waitForAgentInsightsScreenLoad(frame);
    await this.waitUntilFrameSelectorIsVisible(
      SelectorConstants.AgentToolTip,
      frame,
      Constants.One,
      Constants.DefaultTimeout
    );
  }

  public async ValidateAgentStatusByAgentName(
    frame: any,
    agentName: string,
    maxCount = Constants.Three,
    timeout: number = Constants.TenThousand
  ) {

    try {
      await this.waitUntilFrameSelectorIsVisible(
        AgentChatConstants.AgentInsightsAgentSelector,
        frame,
        Constants.One,
        Constants.FiveThousand
      );
      const agentInsightsAgentName = await frame.waitForSelector(
        AgentChatConstants.AgentInsightsAgentSelector,
        { timeout }
      );
      await agentInsightsAgentName.click();

      await this.waitForScreenLoad(frame);

      await this.waitUntilFrameSelectorIsVisible(
        AgentChatConstants.IntraDayInsightQueueSelectionSelector,
        frame,
        Constants.One,
        Constants.FiveThousand
      );
      await this.waitUntilFrameSelectorIsVisible(
        AgentChatConstants.IntraDayInsightQueueTitleSelectionSelector,
        frame,
        Constants.One,
        Constants.FiveThousand
      );
      await this.waitUntilFrameSelectorIsVisible(
        AgentChatConstants.IntraDayInsightQueueCheckboxSelectionSelector,
        frame,
        Constants.One,
        Constants.FiveThousand
      );
      await this.waitUntilFrameSelectorIsVisible(
        AgentChatConstants.IntraDayInsightQueueInputSelector,
        frame,
        Constants.One,
        Constants.FiveThousand
      );

      await this.waitUntilFrameSelectorIsVisible(
        SelectorConstants.ConversationStatusPath.replace(
          "{0}",
          AgentChatConstants.Active
        ),
        frame,
        Constants.One,
        Constants.TenThousand
      );
      const agentInsightsAgentInput = await frame.waitForSelector(
        AgentChatConstants.AgentInsightAgentInputSelector,
        { timeout }
      );
      await agentInsightsAgentInput.fill("");
      await agentInsightsAgentInput.type(agentName, { delay: 100 });

      await this.waitForScreenLoad(frame);
      await this._page.waitForTimeout(Constants.TenThousand); //This static timeout required so that required queue will be populated in intraday insight 'Queue' dropdown

      const agentInsightsConversationStatusItem = await frame.waitForSelector(
        AgentChatConstants.IntraDayInsightConversationStatusQueueSelector,
        { timeout }
      );
      await agentInsightsConversationStatusItem.focus();
      await this._page.waitForTimeout(Constants.DefaultTimeout); //This static timeout required so that queue selection popup will be kept in open state after focus
      await agentInsightsConversationStatusItem.click();

      await this.waitForScreenLoad(frame);

      await this.waitUntilFrameSelectorIsVisible(
        AgentChatConstants.DurationSelector,
        frame,
        Constants.One,
        Constants.DefaultTimeout
      );
      const omniChanelAgentInsightSelector = await frame.waitForSelector(
        AgentChatConstants.DurationSelector,
        { timeout }
      );
      await omniChanelAgentInsightSelector.click();
      return true;
    } catch (error) {
      console.log(
        `Method FilterRecordsByAgentName throwing exception with message: ${error.message}`
      );
    }
    return false;
  }

  public async ValidateAgentStatusBusyByAgentName(
    frame: any,
    agentName: string,
    timeout: number = Constants.TenThousand
  ) {
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.RefershButtonSelector,
      AgentChatConstants.Two,
      this.Page,
      AgentChatConstants.FiveThousandsMiliSecondsWaitTimeout
    );
    await this.Page.click(AgentChatConstants.RefershButtonSelector);
    await this.waitForScreenLoad(frame);
    return frame.waitForSelector(AgentChatConstants.BusyStatus);
  }

  public async validateAgentsStatus() {
    const presence = await this.Page.waitForSelector(
      AgentConversationPageConstants.PresenceStatus
    );
    const status = await (await presence.getProperty("title")).jsonValue();
    return status == AgentChatConstants.Busy;
  }

  public async rightClickToNavigateAgent(
    frame: any,
    timeout: number = Constants.TenThousand
  ) {
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.RefershButtonSelector,
      AgentChatConstants.Two,
      this.Page,
      AgentChatConstants.FiveThousandsMiliSecondsWaitTimeout
    );
    await this.Page.click(AgentChatConstants.RefershButtonSelector);
    await this.waitUntilFrameSelectorIsVisible(
      SelectorConstants.AgentToolTip,
      frame,
      Constants.One,
      Constants.DefaultTimeout
    );
    const component = await frame.waitForSelector(
      SelectorConstants.AgentToolTip,
      { timeout }
    );
    await component.click({ button: "right" });
    const Tooltip = await frame.waitForSelector(
      SelectorConstants.DrillthroughSelect
    );
    await Tooltip.hover();
    await frame.click(SelectorConstants.AgentDetailsSelect);
  }

  public async VerifyTotalUser(frame: any) {
    const TotalAvilablityCheck = await frame.waitForSelector(
      SelectorConstants.TotalAgentCapacityselector
    );
    const TOtalAvilablity = await TotalAvilablityCheck.innerText();
    const AvilabaleCpacityCheck = await frame.waitForSelector(
      SelectorConstants.AvailableCapacityselector
    );
    const AvialabaleCpacity = await AvilabaleCpacityCheck.innerText();
    return true;
  }

  public async validateUserReduced(frame: any) {
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.RefershButtonSelector,
      AgentChatConstants.Two,
      this.Page,
      AgentChatConstants.FiveThousandsMiliSecondsWaitTimeout
    );
    await this.Page.click(AgentChatConstants.RefershButtonSelector);
    const TotalAvilablityCheck = await frame.waitForSelector(
      SelectorConstants.TotalAgentCapacityselector
    );
    const TOtalAvilablity = await TotalAvilablityCheck.innerText();
    const AvilabaleCpacityCheck = await frame.waitForSelector(
      SelectorConstants.AvailableCapacityselector
    );
    const AvialabaleCpacity = await AvilabaleCpacityCheck.innerText();
    if (TOtalAvilablity !== AvialabaleCpacity) {
      return false;
    }
  }

  public async expectedFieldsInConversationForm() {
    try {
      expect(
        await this.Page.waitForSelector(AgentChatConstants.PrimaryAgentField)
      ).toBeTruthy();
      expect(
        await this.Page.waitForSelector(AgentChatConstants.CustomerField)
      ).toBeTruthy();
      expect(
        await this.Page.waitForSelector(AgentChatConstants.ChannelField)
      ).toBeTruthy();
      expect(
        await this.Page.waitForSelector(AgentChatConstants.StatusField)
      ).toBeTruthy();
      expect(
        await this.Page.waitForSelector(AgentChatConstants.StatusReasongField)
      ).toBeTruthy();
      expect(
        await this.Page.waitForSelector(AgentChatConstants.QueueField)
      ).toBeTruthy();
      expect(
        await this.Page.waitForSelector(AgentChatConstants.WorkstreamField)
      ).toBeTruthy();
      expect(
        await this.Page.waitForSelector(AgentChatConstants.DurationField)
      ).toBeTruthy();
      expect(
        await this.Page.waitForSelector(AgentChatConstants.SkillsField)
      ).toBeTruthy();
      expect(
        await this.Page.waitForSelector(AgentChatConstants.RegardingField)
      ).toBeTruthy();
      expect(
        await this.Page.waitForSelector(AgentChatConstants.LastModifiedField)
      ).toBeTruthy();
      expect(
        (await this.Page.waitForSelector(AgentChatConstants.Sessiontab)).click
      ).toBeTruthy();
      expect(
        await this.Page.waitForSelector(AgentChatConstants.LivechatField)
      ).toBeTruthy();
      return true;
    } catch (error) {
      console.log(
        `Method expectedFieldsInConversationForm throwing exception with message: ${error.message}`
      );
      return false;
    }
  }
  public async waitforTimeout() {
    await this.Page.waitForTimeout(5000);
  }

  //Sanity Supervisor Transfer waiting status methods
  public async WaitingLivechatItemSelect(channel: string) {
    await this._page.click(AgentChatConstants.RefreshAllTab);
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.OngoingConversationWaitingLiveChatItemSelect.replace(
        "{0}",
        channel
      )
    );
    await this.Page.click(
      AgentChatConstants.OngoingConversationWaitingLiveChatItemSelect.replace(
        "{0}",
        channel
      )
    );
  }

  public async validateIfTransferButtonIsDisabled() {
    const btn = await this.Page.waitForSelector(
      AgentChatConstants.OngoingDashboardAgentTrasferButtonSelector,
      { state: Constants.SelectorStateAttached }
    );
    const result = await btn.evaluate((btn) => btn.getAttribute("disabled"));
    return result;
  }

  public async clickButton(buttonSelector: string) {
    const assign = await this.Page.waitForSelector(buttonSelector);
    assign.click();
    await this.waitForDomContentLoaded();
  }

  public async selectAgentToTransfer(agentUserName: string) {
    await this.searchByAgentWithStatus(agentUserName, "true");
    let radio = await this.Page.waitForSelector(
      AgentChatConstants.OngoingDashboardAgentSelectRadioSelector.replace(
        "{0}",
        agentUserName
      )
    );
    await radio.click();
  }

  public async searchByAgentWithStatus(
    agentUserName: string,
    validate: string
  ) {
    await this.Page.fill(AgentChatConstants.SearchUser, agentUserName);
    if (validate == "true") {
      await this.Page.waitForSelector(
        AgentChatConstants.AgentListOne.replace("{0}", agentUserName)
      );
    }
  }

  public async validateWaitingAgentStatus(statusAvailability: string) {
    const status = await this.Page.$(
      AgentChatConstants.RetrieveWaitingStatus.replace(
        "{0}",
        statusAvailability
      )
    );
    return status;
  }

  public async getActiveAgentNameForConversation1(rowNum: string) {
    let cell = await this.Page.waitForSelector(
      AgentChatConstants.OngoingDashboardConversationActiveAgentSelector.replace(
        "{0}",
        rowNum
      ),
      { state: Constants.SelectorStateAttached }
    );
    const result = await cell.innerText();
    return result;
  }

  public async ValidateLocalisation() {
    await this.Page.click(SelectorConstants.LocalisationSettings);
    await this.waitForDomContentLoaded();
    await this.Page.click(SelectorConstants.PersonalizationSettings);
    await this.waitForDomContentLoaded();
    await this.waitUntilSelectorIsVisible(
      SelectorConstants.BusinessUnitIframe,
      AgentChatConstants.Two,
      this.Page,
      AgentChatConstants.FiveThousandsMiliSecondsWaitTimeout
    );
    const ManageRoleIframe = await this.Page.$(
      SelectorConstants.BusinessUnitIframe
    );
    const languageIframe = await ManageRoleIframe.contentFrame();
    await this.waitUntilSelectorIsVisible(
      SelectorConstants.LanguageSettings,
      AgentChatConstants.Two,
      this.Page,
      AgentChatConstants.FiveThousandsMiliSecondsWaitTimeout
    );
    const languageSelector = await languageIframe.waitForSelector(
      SelectorConstants.LanguageSettings
    );
    await languageSelector.click();
    await this.waitForDomContentLoaded();
    const result = await languageIframe.waitForSelector(
      SelectorConstants.CheckBaseLanguage
    );
    const output = result.innerText();
    await languageIframe.click(SelectorConstants.LanguageOkButton);
    return (await output) === Constants.OrgLanguage;
  }

  public async ValidateLaguage() {
    const result = await this.Page.waitForSelector(
      SelectorConstants.ChatWidgetMenuItem
    );
    const output = result.innerText();
    return (await output) === Constants.ChatChannelName;
  }
  public async ValidateAgentStatusAvailble(frame: any, timeout: number = Constants.TenThousand) {
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.RefershButtonSelector,
      AgentChatConstants.Two,
      this.Page,
      AgentChatConstants.FiveThousandsMiliSecondsWaitTimeout
    );
    await this.Page.click(AgentChatConstants.RefershButtonSelector);
    await this.waitUntilFrameSelectorIsVisible(
      AgentChatConstants.AvailableStatus,
      frame,
      Constants.One,
      Constants.DefaultTimeout
    );
    await frame.waitForSelector(AgentChatConstants.AvailableStatus);
    return true;
  }
  public async NavigateCustomersummray() {
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.CustomerSummaryDropDownSelector,
      Constants.Five,
      this._page,
      Constants.MaxTimeout
    );
    await this._page.click(AgentChatConstants.CustomerSummaryDropDownSelector);
    await this._page.click(AgentChatConstants.CustomerSummarySelector);
  }
  public async closeAgentChatConversation() {
    const iframeCC = await IFrameHelper.GetIframe(
      this._page,
      IFrameConstants.IframeCC
    );

    await this._page.$eval(
      AgentChatConstants.RemoveConversationButtonClass,
      (el) => (el as HTMLElement).click()
    );
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.ConfirmButtonId,
      Constants.Three,
      this._page,
      Constants.MaxTimeout
    );
    await this._page.$eval(AgentChatConstants.ConfirmButtonId, (el) =>
      (el as HTMLElement).click()
    );
    await this._page.waitForTimeout(
      AgentChatConstants.ConversationWrapUpTimeout
    );
  }

  public async FilterItemsByAgentConversation(frame: any, agentName: string, queueName: string) {
    await this.FilterRecordsByAgentName(SelectorConstants.QueurDDSelector, frame, agentName);
    await this.FilterRecordsByQueuesName(SelectorConstants.QueurDDSelector, frame, queueName);
  }
  public async validateAgentAvailableCapacity(frame: any) {
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.RefershButtonSelector,
      AgentChatConstants.Two,
      this.Page,
      AgentChatConstants.FiveThousandsMiliSecondsWaitTimeout
    );
    await this.Page.click(AgentChatConstants.RefershButtonSelector);
    const TotalAvilablityCheck = await frame.waitForSelector(
      SelectorConstants.TotalAgentCapacityselector
    );
    const TOtalAvilablity = await TotalAvilablityCheck.innerText();
    const AvilabaleCpacityCheck = await frame.waitForSelector(
      SelectorConstants.AvailableCapacityselector
    );
    const AvialabaleCpacity = await AvilabaleCpacityCheck.innerText();
    if (TOtalAvilablity > AvialabaleCpacity) {
      return true;
    }
  }

  public async ValidateDurationHr(frame: any, timeout: number = Constants.TenThousand) {
    await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.valueInputSelector, frame, Constants.One, Constants.DefaultTimeout);
    const valueRange = await frame.waitForSelector(AgentChatConstants.valueInputSelector, { timeout });
    await valueRange.fill("");
    await valueRange.type("8", { delay: 100 });
  }

  public async ValidateDurationMin(frame: any, timeout: number = Constants.TenThousand) {
    await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.valueInputSelector, frame, Constants.One, Constants.DefaultTimeout);
    const valueRange = await frame.waitForSelector(AgentChatConstants.valueInputSelector, { timeout });
    await valueRange.fill("");
    await valueRange.type("30", { delay: 100 });
  }

  public async ValidateIntradayHours(selector: any, Iframe: any, timeout: number = Constants.TenThousand) {
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.durationHeader,
      AgentChatConstants.Two,
      this.Page,
      AgentChatConstants.FiveThousandsMiliSecondsWaitTimeout
    );
    const duration1 = await Iframe.waitForSelector(AgentChatConstants.durationHeader, { timeout });
    await duration1.click();
    await this.waitForScreenLoad(Iframe);
    await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.selectHrMin, Iframe, Constants.One, Constants.FiveThousand);
    const duration = await Iframe.waitForSelector(AgentChatConstants.selectHrMin, { timeout });
    await duration.click();
    await this.waitUntilFrameSelectorIsVisible(selector, Iframe, Constants.One, Constants.FiveThousand);
    const hrSelect = await Iframe.waitForSelector(selector, { timeout });
    await hrSelect.click();
    await this.waitForScreenLoad(Iframe);
    await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.AbandoneRateHeader, Iframe, Constants.One, timeout);
    const AbandonheadSelector1 = await Iframe.waitForSelector(AgentChatConstants.AbandoneRateHeader, { timeout });
    const entityItemTextAbandon1 = await AbandonheadSelector1.textContent();
    expect(entityItemTextAbandon1.includes(AgentChatConstants.AbandonHeaderTitle)).toBeTruthy();
  }

  public async ValidateIntradayMin(selector: any, Iframe: any, timeout: number = Constants.TenThousand) {
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.durationHeader,
      AgentChatConstants.Two,
      this.Page,
      AgentChatConstants.FiveThousandsMiliSecondsWaitTimeout
    );
    const duration1 = await Iframe.waitForSelector(AgentChatConstants.durationHeader, { timeout });
    await duration1.click();
    await this.waitForScreenLoad(Iframe);
    await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.selectHrMin, Iframe, Constants.One, Constants.FiveThousand);
    const duration = await Iframe.waitForSelector(AgentChatConstants.selectHrMin, { timeout });
    await duration.click();
    await this.waitUntilFrameSelectorIsVisible(selector, Iframe, Constants.One, Constants.FiveThousand);
    const hrSelect = await Iframe.waitForSelector(selector, { timeout });
    await hrSelect.click();
    await this.waitForScreenLoad(Iframe);
    await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.AbandoneRateHeader, Iframe, Constants.One, timeout);
    const AbandonheadSelector1 = await Iframe.waitForSelector(AgentChatConstants.AbandoneRateHeader, { timeout });
    const entityItemTextAbandon1 = await AbandonheadSelector1.textContent();
    expect(entityItemTextAbandon1.includes(AgentChatConstants.AbandonHeaderTitle)).toBeTruthy();
  }
  public async ValidateResponseTimeAerageTime(frame: any, timeout: number = Constants.TenThousand) {
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.RefershButtonSelector);
    await this.Page.click(AgentChatConstants.RefershButtonSelector);
    await this.waitUntilFrameSelectorIsVisible(SelectorConstants.SLAFirstResponseTime, frame, Constants.One, Constants.DefaultTimeout);
    const FirstResponsetime = await frame.waitForSelector(SelectorConstants.SLAFirstResponseTime, { timeout });
    await FirstResponsetime.click();
    expect(await frame.waitForSelector(SelectorConstants.SLAFirstResponseTime)).toBeTruthy();
    const Responsetime = await frame.waitForSelector(SelectorConstants.SLAResponseTime, { timeout });
    await Responsetime.click();
    expect(await frame.waitForSelector(SelectorConstants.SLAResponseTime)).toBeTruthy();
    return true;
  }

  public async FilterItemsByDigitalMsg(frame: any, queueName: string, agentName: string) {
    await this.FilterRecordsByDigitalMessageQueuesName(SelectorConstants.QueurDDSelector, frame, queueName);
    await this.FilterRecordsByDigitalMessageAgentName(SelectorConstants.QueurDDSelector, frame, agentName);
  }
  public async FilterRecordsByDigitalMessageQueuesName(selectorVal: string, frame: any, queueName: string, timeout: number = Constants.TenThousand) {
    try {
      await this.waitUntilFrameSelectorIsVisible(SelectorConstants.SLAFirstResponseTime, frame, Constants.One, Constants.DefaultTimeout);
      const omniChanelConversationDigitalMsgSelector = await frame.waitForSelector(SelectorConstants.SLAFirstResponseTime, { timeout });
      await omniChanelConversationDigitalMsgSelector.click();
      await this._page.waitForTimeout(Constants.DefaultTimeout);//This static timeout required so that if queue selection popup remains in open state during failed run so before retrying queue filtration it will close

      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.ConversationInsightDigitalMsgQueueSelector, frame, Constants.One, Constants.FiveThousand);
      const agentConversationInsightQueueName = await frame.waitForSelector(AgentChatConstants.ConversationInsightDigitalMsgQueueSelector, { timeout });
      await agentConversationInsightQueueName.click();

      await this.waitForScreenLoad(frame);

      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.IntraDayInsightQueueSelectionSelector, frame, Constants.One, Constants.FiveThousand);
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.IntraDayInsightQueueTitleSelectionSelector, frame, Constants.One, Constants.FiveThousand);
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.IntraDayInsightQueueCheckboxSelectionSelector, frame, Constants.One, Constants.FiveThousand);
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.IntraDayInsightQueueInputSelector, frame, Constants.One, Constants.FiveThousand);
      const ConversationQueueInput = await frame.waitForSelector(AgentChatConstants.ConversationInsightDigitalMsgQueueInputSelector, { timeout });
      await ConversationQueueInput.fill("");
      await ConversationQueueInput.type(queueName, { delay: 100 });

      await this.waitForScreenLoad(frame);
      await this._page.waitForTimeout(Constants.TenThousand);//This static timeout required so that required queue will be populated in intraday insight 'Queue' dropdown

      const agentInsightsConversationStatusItem = await frame.waitForSelector(AgentChatConstants.DigitalQueueSelector.replace("{0}", queueName), { timeout });
      await agentInsightsConversationStatusItem.focus();
      await this._page.waitForTimeout(Constants.DefaultTimeout);//This static timeout required so that queue selection popup will be kept in open state after focus
      await agentInsightsConversationStatusItem.click();

      await this.waitForScreenLoad(frame);
      await omniChanelConversationDigitalMsgSelector.click();
      await this.waitUntilFrameSelectorIsVisible(selectorVal, frame, Constants.One, timeout);
      const queueSelector = await frame.waitForSelector(selectorVal, { timeout });
      const entityItemText = await queueSelector.textContent();
      if (entityItemText.startsWith(queueName)) {
        return true;
      }
    }
    catch (error) {
      console.log(`Method FilterRecordsByAgentName throwing exception with message: ${error.message}`);
    }
    return false;
  }

  public async FilterRecordsByDigitalMessageAgentName(selectorVal: string, frame: any, agentName: string, timeout: number = Constants.TenThousand) {
    try {
      await this.waitUntilFrameSelectorIsVisible(SelectorConstants.SLAFirstResponseTime, frame, Constants.One, Constants.DefaultTimeout);
      const omniChanelAgentInsightSelector = await frame.waitForSelector(SelectorConstants.SLAFirstResponseTime, { timeout });
      await omniChanelAgentInsightSelector.click();
      await this._page.waitForTimeout(Constants.DefaultTimeout);

      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.ConversationInsightDigitalMsgAgentSelector, frame, Constants.One, Constants.FiveThousand);
      const agentInsightQueuetName = await frame.waitForSelector(AgentChatConstants.ConversationInsightDigitalMsgAgentSelector, { timeout });
      await agentInsightQueuetName.click();

      await this.waitForScreenLoad(frame);
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.AgentInsightQueueTitleSelectionSelector, frame, Constants.One, Constants.FiveThousand);
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.AgentInsightQueueCheckboxSelectionSelector, frame, Constants.One, Constants.FiveThousand);
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.AgentInsightQueueInputSelector, frame, Constants.One, Constants.FiveThousand);
      const agentInsightsQueueInput = await frame.waitForSelector(AgentChatConstants.ConversationInsightDigitalMsgAgentInputSelector, { timeout });
      await agentInsightsQueueInput.fill("");
      await agentInsightsQueueInput.type(agentName, { delay: 100 });

      await this.waitForScreenLoad(frame);
      await this._page.waitForTimeout(Constants.TenThousand);//This static timeout required so that required queue will be populated in intraday insight 'Queue' dropdown

      const agentInsightsConversationQueueStatusItem = await frame.waitForSelector(AgentChatConstants.DigitalAgentSelector.replace("{0}", agentName), { timeout });
      await agentInsightsConversationQueueStatusItem.focus();
      await this._page.waitForTimeout(Constants.DefaultTimeout);//This static timeout required so that queue selection popup will be kept in open state after focus
      await agentInsightsConversationQueueStatusItem.click();

      await this.waitForScreenLoad(frame);

      await omniChanelAgentInsightSelector.click();
      await this.waitForScreenLoad(frame);
      const queueSelector = await frame.waitForSelector(selectorVal, { timeout });
      const entityItemText = await queueSelector.textContent();
      if (entityItemText.startsWith(agentName)) {
        return true;
      }
    }
    catch (error) {
      console.log(`Method FilterRecordsByQueueName throwing exception with message: ${error.message}`);
    }
    return false;
  }

  public async ValidateFirstresponsetimeandResponsetime(frame: any, timeout: number = Constants.TenThousand) {
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.RefershButtonSelector,
      AgentChatConstants.Two,
      this.Page,
      AgentChatConstants.FiveThousandsMiliSecondsWaitTimeout
    );
    await this.Page.click(AgentChatConstants.RefershButtonSelector);
    await this.waitUntilFrameSelectorIsVisible(SelectorConstants.SLAFirstResponseTimeAndResponseTime, frame, Constants.One, Constants.DefaultTimeout);
    const FirstResponsetime = await frame.waitForSelector(SelectorConstants.SLAFirstResponseTimeAndResponseTime, { timeout });
    //await FirstResponsetime.click();
    return FirstResponsetime;
  }

  public async NavigatetoConversationInsightsDigitalMsg(frame: any) {
    await this.waitUntilSelectorIsVisible(
      SelectorConstants.ConversationInsightsDigitalMessage,
      AgentChatConstants.Two,
      this.Page,
      AgentChatConstants.FiveThousandsMiliSecondsWaitTimeout
    );
    await frame.click(SelectorConstants.ConversationInsightsDigitalMessage);
    await this.waitForScreenLoad(frame);
  }

  public async FilterItemsByChannel(frame: any, Channel: string) {
    await this.FilterRecordsByChannelName(SelectorConstants.QueurDDSelector, frame, Channel);
  }
  public async FilterRecordsByChannelName(selectorVal: string, frame: any, Channel: string, timeout: number = Constants.TenThousand) {
    try {
      await this.waitUntilFrameSelectorIsVisible(SelectorConstants.SLAFirstResponseTime, frame, Constants.One, Constants.DefaultTimeout);
      const omniChanelConversationDigitalMsgSelector = await frame.waitForSelector(SelectorConstants.SLAFirstResponseTime, { timeout });
      await omniChanelConversationDigitalMsgSelector.click();
      await this._page.waitForTimeout(Constants.DefaultTimeout);//This static timeout required so that if queue selection popup remains in open state during failed run so before retrying queue filtration it will close

      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.DigitalMsgChannelSelector, frame, Constants.One, Constants.FiveThousand);
      const agentConversationInsightQueueName = await frame.waitForSelector(AgentChatConstants.DigitalMsgChannelSelector, { timeout });
      await agentConversationInsightQueueName.click();

      await this.waitForScreenLoad(frame);

      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.IntraDayInsightQueueSelectionSelector, frame, Constants.One, Constants.FiveThousand);
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.IntraDayInsightQueueTitleSelectionSelector, frame, Constants.One, Constants.FiveThousand);
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.IntraDayInsightQueueCheckboxSelectionSelector, frame, Constants.One, Constants.FiveThousand);
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.IntraDayInsightQueueInputSelector, frame, Constants.One, Constants.FiveThousand);
      const agentInsightsAgentInput = await frame.waitForSelector(AgentChatConstants.DigitalMsgChannelInputSelector, { timeout });
      await agentInsightsAgentInput.fill("");
      await agentInsightsAgentInput.type(Channel, { delay: 100 });

      await this.waitForScreenLoad(frame);
      await this._page.waitForTimeout(Constants.TenThousand);//This static timeout required so that required queue will be populated in intraday insight 'Queue' dropdown

      const agentInsightsConversationStatusItem = await frame.waitForSelector(AgentChatConstants.DigitalMessageChannelSelector.replace("{0}", Channel), { timeout });
      await agentInsightsConversationStatusItem.focus();
      await this._page.waitForTimeout(Constants.DefaultTimeout);//This static timeout required so that queue selection popup will be kept in open state after focus
      await agentInsightsConversationStatusItem.click();

      await this.waitForScreenLoad(frame);
      await omniChanelConversationDigitalMsgSelector.click();
      await this.waitUntilFrameSelectorIsVisible(selectorVal, frame, Constants.One, timeout);
      const queueSelector = await frame.waitForSelector(selectorVal, { timeout });
      const entityItemText = await queueSelector.textContent();
      if (entityItemText.startsWith(Channel)) {
        return true;
      }
    }
    catch (error) {
      console.log(`Method FilterRecordsByAgentName throwing exception with message: ${error.message}`);
    }
    return false;
  }

  public async FilterItemsByDigitalMessage(frame: any, queueName: string, agentName: string) {
    await this.FilterRecordsByDigitalMsgQueuesName(SelectorConstants.QueurDDSelector, frame, queueName);
    await this.FilterRecordsByDigitalMsgAgentName(SelectorConstants.QueurDDSelector, frame, agentName);
  }
  public async FilterRecordsByDigitalMsgQueuesName(selectorVal: string, frame: any, queueName: string, timeout: number = Constants.TenThousand) {
    try {
      await this.waitUntilFrameSelectorIsVisible(SelectorConstants.SLAFirstResponseTime, frame, Constants.One, Constants.DefaultTimeout);
      const omniChannelDigitalMsgFirstResponse = await frame.waitForSelector(SelectorConstants.SLAFirstResponseTime, { timeout });
      await omniChannelDigitalMsgFirstResponse.click();
      await this._page.waitForTimeout(Constants.DefaultTimeout);//This static timeout required so that if queue selection popup remains in open state during failed run so before retrying queue filtration it will close

      await this.waitUntilFrameSelectorIsVisible(SelectorConstants.ConversationInsightsQueueSelector, frame, Constants.One, Constants.FiveThousand);
      const agentConversationInsightAgentName = await frame.waitForSelector(SelectorConstants.ConversationInsightsQueueSelector, { timeout });
      await agentConversationInsightAgentName.click();

      await this.waitForScreenLoad(frame);

      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.IntraDayInsightQueueSelectionSelector, frame, Constants.One, Constants.FiveThousand);
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.IntraDayInsightQueueTitleSelectionSelector, frame, Constants.One, Constants.FiveThousand);
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.IntraDayInsightQueueCheckboxSelectionSelector, frame, Constants.One, Constants.FiveThousand);
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.IntraDayInsightQueueInputSelector, frame, Constants.One, Constants.FiveThousand);
      const agentInsightsAgentInput = await frame.waitForSelector(AgentChatConstants.DigitalMessageQueueInputSelector, { timeout });
      await agentInsightsAgentInput.fill("");
      await agentInsightsAgentInput.type(queueName, { delay: 100 });

      await this.waitForScreenLoad(frame);
      await this._page.waitForTimeout(Constants.TenThousand);//This static timeout required so that required queue will be populated in intraday insight 'Queue' dropdown

      const agentInsightsConversationStatusItem = await frame.waitForSelector(AgentChatConstants.DigitalQueueSelector.replace("{0}", queueName), { timeout });
      await agentInsightsConversationStatusItem.focus();
      await this._page.waitForTimeout(Constants.DefaultTimeout);//This static timeout required so that queue selection popup will be kept in open state after focus
      await agentInsightsConversationStatusItem.click();

      await this.waitForScreenLoad(frame);
      await omniChannelDigitalMsgFirstResponse.click();
      await this.waitUntilFrameSelectorIsVisible(selectorVal, frame, Constants.One, timeout);
      const queueSelector = await frame.waitForSelector(selectorVal, { timeout });
      const entityItemText = await queueSelector.textContent();
      if (entityItemText.startsWith(queueName)) {
        return true;
      }
    }
    catch (error) {
      console.log(`Method FilterRecordsByAgentName throwing exception with message: ${error.message}`);
    }
    return false;
  }

  public async FilterRecordsByDigitalMsgAgentName(selectorVal: string, frame: any, agentName: string, timeout: number = Constants.TenThousand) {
    try {
      await this.waitUntilFrameSelectorIsVisible(SelectorConstants.SLAFirstResponseTime, frame, Constants.One, Constants.DefaultTimeout);
      const omniChannelDigitalMsgFirstResponse = await frame.waitForSelector(SelectorConstants.SLAFirstResponseTime, { timeout });
      await omniChannelDigitalMsgFirstResponse.click();
      await this._page.waitForTimeout(Constants.DefaultTimeout);

      await this.waitUntilFrameSelectorIsVisible(SelectorConstants.ConversationInsightsAgentSelector, frame, Constants.One, Constants.FiveThousand);
      const agentInsightQueuetName = await frame.waitForSelector(SelectorConstants.ConversationInsightsAgentSelector, { timeout });
      await agentInsightQueuetName.click();

      await this.waitForScreenLoad(frame);
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.AgentInsightQueueTitleSelectionSelector, frame, Constants.One, Constants.FiveThousand);
      //await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.AgentInsightQueueCheckboxSelectionSelector, frame, Constants.One, Constants.FiveThousand);
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.AgentInsightQueueInputSelector, frame, Constants.One, Constants.FiveThousand);
      const agentInsightsQueueInput = await frame.waitForSelector(AgentChatConstants.DigitalMessageAgentInputSelector, { timeout });
      await agentInsightsQueueInput.fill("");
      await agentInsightsQueueInput.type(agentName, { delay: 100 });

      await this.waitForScreenLoad(frame);
      await this._page.waitForTimeout(Constants.TenThousand);//This static timeout required so that required queue will be populated in intraday insight 'Queue' dropdown

      const agentInsightsConversationQueueStatusItem = await frame.waitForSelector(AgentChatConstants.DigitalAgentSelector.replace("{0}", agentName), { timeout });
      await agentInsightsConversationQueueStatusItem.focus();
      await this._page.waitForTimeout(Constants.DefaultTimeout);//This static timeout required so that queue selection popup will be kept in open state after focus
      await agentInsightsConversationQueueStatusItem.click();

      await omniChannelDigitalMsgFirstResponse.click();
      const queueSelector = await frame.waitForSelector(selectorVal, { timeout });
      const entityItemText = await queueSelector.textContent();
      if (entityItemText.startsWith(agentName)) {
        return true;
      }
    }
    catch (error) {
      console.log(`Method FilterRecordsByQueueName throwing exception with message: ${error.message}`);
    }
    return false;
  }

  public async NavigatetoConversationInsightsDashboard(frame: any) {
    await this.waitUntilSelectorIsVisible(
      SelectorConstants.OmniChannelIntradayInsights,
      AgentChatConstants.Two,
      this.Page,
      AgentChatConstants.FiveThousandsMiliSecondsWaitTimeout
    );
    await this.Page.click(SelectorConstants.IntradayInsightsDropDown);
    await this.Page.click(SelectorConstants.ConversationInsight);
    await this.waitForScreenLoad(frame);
    await frame.click(SelectorConstants.ConversationInsightsLivechat);
    await this.waitForScreenLoad(frame);
  }

  public async ValidateCloseChat(frame: any) {
    try {
      await this.waitUntilFrameSelectorIsVisible(SelectorConstants.CloseChatTitle, frame, Constants.One, Constants.DefaultTimeout);
      expect(await frame.waitForSelector(SelectorConstants.CloseChatTitle)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.CloseChatAgent)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.CloseChatStatus)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.CloseChatAction)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.CloseChatWorkStream)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.CloseChatFirstresponsetime)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.CloseChatAvgresponsetime)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.CloseChatTotalresponsetime)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.CloseChatTotalwaittime)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.CloseChatHandletime)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.CloseChatWraptime)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.CloseChatSentiment)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.CloseChatIncomingmessages)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.CloseChatOutgoingresponses)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.CloseChatTransfers)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.CloseChatEscalations)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.CloseChatCreatedon)).toBeTruthy();
      await this.waitUntilFrameSelectorIsVisible(SelectorConstants.CloseChatClosedon, frame, Constants.One, Constants.DefaultTimeout);
      const CloseChatScroll = await frame.waitForSelector(SelectorConstants.CloseChatClosedon);
      await CloseChatScroll.click();
      expect(await frame.waitForSelector(SelectorConstants.CloseChatClosedon)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.CloseChatConversationID)).toBeTruthy();
      return true;
    } catch (error) {
      console.log(`Method expectedFieldsInConversationForm throwing exception with message: ${error.message}`);
    }
  }

  public async FilterItemsByLiveChatAgent(frame: any, queueName: string, agentName: string) {
    await this.FilterRecordsByLiveChatQueuesName(SelectorConstants.QueurDDSelector, frame, queueName);
    await this.FilterRecordsByLiveChatAgentName(SelectorConstants.QueurDDSelector, frame, agentName);
  }
  public async FilterRecordsByLiveChatQueuesName(selectorVal: string, frame: any, queueName: string, maxCount = Constants.Three, timeout: number = Constants.TenThousand) {
    try {
      await this._page.waitForTimeout(Constants.DefaultTimeout);//This static timeout required so that if queue selection popup remains in open state during failed run so before retrying queue filtration it will close
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.ConversationInsightsQueueSelector, frame, Constants.One, Constants.FiveThousand);
      const agentConversationInsightAgentName = await frame.waitForSelector(AgentChatConstants.ConversationInsightsQueueSelector, { timeout });
      await agentConversationInsightAgentName.click();
      await this.waitForScreenLoad(frame);
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.IntraDayInsightQueueSelectionSelector, frame, Constants.One, Constants.FiveThousand);
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.IntraDayInsightQueueTitleSelectionSelector, frame, Constants.One, Constants.FiveThousand);
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.IntraDayInsightQueueCheckboxSelectionSelector, frame, Constants.One, Constants.FiveThousand);
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.IntraDayInsightQueueInputSelector, frame, Constants.One, Constants.FiveThousand);
      const agentInsightsAgentInput = await frame.waitForSelector(AgentChatConstants.ConversationInsightQueueInputSelector, { timeout });
      await agentInsightsAgentInput.fill("");
      await agentInsightsAgentInput.type(queueName, { delay: 100 });
      await this.waitForScreenLoad(frame);
      await this._page.waitForTimeout(Constants.TenThousand);//This static timeout required so that required queue will be populated in intraday insight 'Queue' dropdown
      const agentInsightsConversationStatusItem = await frame.waitForSelector(AgentChatConstants.FilterSinglevalueSelect.replace("{0}", queueName), { timeout });
      await agentInsightsConversationStatusItem.focus();
      await this._page.waitForTimeout(Constants.DefaultTimeout);//This static timeout required so that queue selection popup will be kept in open state after focus
      await agentInsightsConversationStatusItem.click();
      await this.waitForScreenLoad(frame);
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.OnGoingChatsSelector, frame, Constants.One, Constants.DefaultTimeout);
      await this.waitUntilFrameSelectorIsVisible(selectorVal, frame, Constants.One, timeout);
      const queueSelector = await frame.waitForSelector(selectorVal, { timeout });
      const entityItemText = await queueSelector.textContent();
      if (entityItemText.startsWith(queueName)) {
        return true;
      }
    }
    catch (error) {
      console.log(`Method FilterRecordsByAgentName throwing exception with message: ${error.message}`);
    }
    return false;
  }

  public async FilterItemsByTimezone(frame: any, channel: string, timezone: string, timeout: number = Constants.TenThousand) {
    try {
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.ConversationInsightsTimezoneSelector, frame, Constants.One, Constants.DefaultTimeout);
      const timezoneDropdownSelector = await frame.waitForSelector(AgentChatConstants.ConversationInsightsTimezoneSelector, { timeout });
      await timezoneDropdownSelector.click();
      await this._page.waitForTimeout(Constants.DefaultTimeout);
      await this.waitForScreenLoad(frame);
      if (channel == Constants.LiveChat) {
        const agentInsightsTimezoneInput = await frame.waitForSelector(AgentChatConstants.ConversationInsightTimezoneInputSelector, { timeout });
        await agentInsightsTimezoneInput.fill("");
        await agentInsightsTimezoneInput.type(timezone, { delay: 100 });
      }
      else if (channel == Constants.Digital) {
        const agentInsightsTimezoneInput = await frame.waitForSelector(AgentChatConstants.ConversationInsightTimezoneDigitalInputSelector, { timeout });
        await agentInsightsTimezoneInput.fill("");
        await agentInsightsTimezoneInput.type(timezone, { delay: 100 });
      }
      await this.waitForScreenLoad(frame);
      await this._page.waitForTimeout(Constants.TenThousand);
      if (timezone == Constants.Gmt530Timezone) {
        const timezoneGmt530TimezoneSelector = await frame.waitForSelector(AgentChatConstants.gmt530Timezone, { timeout });
        await timezoneGmt530TimezoneSelector.click();
      }
      else if (timezone == Constants.Gmt600Timezone) {
        const timezoneGmt600TimezoneSelector = await frame.waitForSelector(AgentChatConstants.gmt600Timezone, { timeout });
        await timezoneGmt600TimezoneSelector.click();
      }
      await this.waitForScreenLoad(frame);
    }
    catch (error) {
      console.log(`Method FilterItemsByTimezone throwing exception with message: ${error.message}`);
    }
    return false;
  }
  public async FilterRecordsByLiveChatAgentName(selectorVal: string, frame: any, agentName: string, timeout: number = Constants.TenThousand) {
    try {
      await this._page.waitForTimeout(Constants.DefaultTimeout);

      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.ConversationInsightsAgentSelector, frame, Constants.One, Constants.FiveThousand);
      const agentInsightQueuetName = await frame.waitForSelector(AgentChatConstants.ConversationInsightsAgentSelector, { timeout });
      await agentInsightQueuetName.click();

      await this.waitForScreenLoad(frame);
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.AgentInsightQueueTitleSelectionSelector, frame, Constants.One, Constants.FiveThousand);
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.AgentInsightQueueCheckboxSelectionSelector, frame, Constants.One, Constants.FiveThousand);
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.AgentInsightQueueInputSelector, frame, Constants.One, Constants.FiveThousand);
      const agentInsightsQueueInput = await frame.waitForSelector(AgentChatConstants.ConversationInsightAgentInputSelector, { timeout });
      await agentInsightsQueueInput.fill("");
      await agentInsightsQueueInput.type(agentName, { delay: 100 });

      await this.waitForScreenLoad(frame);
      await this._page.waitForTimeout(Constants.TenThousand);//This static timeout required so that required queue will be populated in intraday insight 'Queue' dropdown

      const agentInsightsConversationQueueStatusItem = await frame.waitForSelector(AgentChatConstants.FilterSinglevalueSelect.replace("{0}", agentName), { timeout });
      await agentInsightsConversationQueueStatusItem.focus();
      await this._page.waitForTimeout(Constants.DefaultTimeout);//This static timeout required so that queue selection popup will be kept in open state after focus
      await agentInsightsConversationQueueStatusItem.click();
      await this.waitForScreenLoad(frame);
      const queueSelector = await frame.waitForSelector(selectorVal, { timeout });
      const entityItemText = await queueSelector.textContent();
      if (entityItemText.startsWith(agentName)) {
        return true;
      }
    }
    catch (error) {
      console.log(`Method FilterRecordsByQueueName throwing exception with message: ${error.message}`);
    }
    return false;
  }

  public async validateChatTransferRate(frame: any, timeout: number = Constants.TenThousand) {
    await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.TransferRateHeader, frame, Constants.One, timeout);
    const headSelector = await frame.waitForSelector(AgentChatConstants.TransferRateHeader, { timeout });
    const entityItemText = await headSelector.textContent();
    expect(entityItemText.includes(AgentChatConstants.TransferRateHeaderTitle)).toBeTruthy();
  }
  public async ValidateOnGoingLiveChatWorkStream(frame: any, WSName: string) {
    await this.waitUntilFrameSelectorIsVisible(SelectorConstants.OngoingLiveChatWorkStream1, frame, Constants.Two, Constants.DefaultTimeout);
    const WorkStreamName1 = await frame.waitForSelector(SelectorConstants.OngoingLiveChatWorkStream1);
    const WorkStream1 = await WorkStreamName1.textContent();
    if (WorkStream1 == WSName) {
      return true;
    }
    return false;
  }

  public async ValidateLiveChatWorkStream(frame: any) {
    await this.waitUntilFrameSelectorIsVisible(SelectorConstants.CloseLiveChatWorkStream, frame, Constants.One, Constants.DefaultTimeout);
    const WorkStreamName1 = await frame.waitForSelector(SelectorConstants.CloseLiveChatWorkStream);
    const WorkStream1 = await WorkStreamName1.innerText();
    if (WorkStream1 == SelectorConstants.LCWAutomatedWS) {
      return true;
    }
    return false;
  }


  public async NavigatetoConversationInsightsDigitalDashboard(frame: any) {
    await this.waitUntilSelectorIsVisible(
      SelectorConstants.OmniChannelIntradayInsights,
      AgentChatConstants.Two,
      this.Page,
      AgentChatConstants.FiveThousandsMiliSecondsWaitTimeout
    );
    await this.Page.click(SelectorConstants.IntradayInsightsDropDown);
    await this.Page.click(SelectorConstants.ConversationInsight);
    await this.waitForScreenLoad(frame);
    await frame.click(SelectorConstants.ConversationInsightsDigital);
    await this.waitForScreenLoad(frame);
  }

  public async NavigatetoConversationInsightsVoiceDashboard(frame: any) {
    await this.waitUntilSelectorIsVisible(
      SelectorConstants.OmniChannelIntradayInsights,
      AgentChatConstants.Two,
      this.Page,
      AgentChatConstants.FiveThousandsMiliSecondsWaitTimeout
    );
    await this.Page.click(SelectorConstants.IntradayInsightsDropDown);
    await this.Page.click(SelectorConstants.ConversationInsight);
    await this.waitForScreenLoad(frame);
    await frame.click(SelectorConstants.ConversationInsightsVoice);
    await this.waitForScreenLoad(frame);
  }

  public async ValidateTimezonesForConversationInsights(zone1: any, zone2: any, zone3: any, zone4: any,) {
    if (zone1 === LiveChatConstants.AM) {
      expect(zone3.includes(LiveChatConstants.PM)).toBeTruthy();
    }
    else if (zone1 === LiveChatConstants.PM) {
      expect(zone3.includes(LiveChatConstants.AM)).toBeTruthy();
    }
    else if (zone2 === LiveChatConstants.PM) {
      expect(zone4.includes(LiveChatConstants.AM)).toBeTruthy();
    }
    else if (zone2 === LiveChatConstants.PM) {
      expect(zone4.includes(LiveChatConstants.AM)).toBeTruthy();
    }
  }

  public async ValidateLiveChatStatus(frame: any) {
    await this.waitUntilFrameSelectorIsVisible(SelectorConstants.CloseLiveChatStatus, frame, Constants.One, Constants.DefaultTimeout);
    const CloseStatus = await frame.waitForSelector(SelectorConstants.CloseLiveChatStatus);
    const ChatTitle1 = await CloseStatus.innerText();
    if (ChatTitle1 == SelectorConstants.CloseChatClosed) {
      return true;
    }
    return false;
  }
  public async VerifyDefaultSortOrder(frame: any) {
    await this.waitUntilFrameSelectorIsVisible(SelectorConstants.CloseChatClosedon, frame, Constants.One, Constants.DefaultTimeout);
    const ClosedOn = await frame.waitForSelector(SelectorConstants.CloseChatClosedon);
    await ClosedOn.click();
    expect(await frame.waitForSelector(SelectorConstants.SortOrderSelector)).toBeTruthy();
    return true;
  }

  public async ValidateOngoingChats(frame: any) {
    try {
      expect(await frame.waitForSelector(SelectorConstants.OnGoingChatTitle)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.OnGoingChatAgent)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.OnGoingChatStatus)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.OnGoingChatTimeincurrentstatus)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.OnGoingChatAction)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.OnGoingChatQueue)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.OnGoingChatWorkStream)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.OnGoingChatFirstresponsetime)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.OnGoingChatAvgresponsetime)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.OnGoingChatTotalresponsetime)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.OnGoingChatTotalwaittime)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.OnGoingCurrentwaittime)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.OnGoingChatHandletime)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.OnGoingChatWraptime)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.OnGoingChatSentiment)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.OnGoingChatIncomingmessages)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.OnGoingChatOutgoingresponses)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.OnGoingChatTransfers)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.OnGoingChatEscalations)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.OnGoingChatCreatedon)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.OnGoingChatConversationID)).toBeTruthy();
      return true;
    } catch (error) {
      console.log(`Method expectedFieldsInConversationForm throwing exception with message: ${error.message}`);
    }
  }

  public async ValidateOnGoingLiveChatStatus(frame: any) {
    await this.waitUntilFrameSelectorIsVisible(SelectorConstants.OngoingLiveChatStatus, frame, Constants.One, Constants.DefaultTimeout);
    const CloseStatus1 = await frame.waitForSelector(SelectorConstants.OngoingLiveChatStatus);
    const ChatTitle1 = await CloseStatus1.innerText();
    if (ChatTitle1 == AgentChatConstants.Active) {
      return true;
    }
    return false;
  }

  public async VerifyDefaultCreateOnSort(frame: any) {
    await this.waitUntilFrameSelectorIsVisible(SelectorConstants.OnGoingChatCreatedon, frame, Constants.One, Constants.DefaultTimeout);
    const ClosedOn = await frame.waitForSelector(SelectorConstants.OnGoingChatCreatedon);
    await ClosedOn.click();
    expect(await frame.waitForSelector(SelectorConstants.CreateOnSort)).toBeTruthy();
    return true;
  }
  public async FilterItemsByChannelOverviewPage(frame: any, Channel: string) {
    await this.FilterRecordsByChannelNameOverviewPage(SelectorConstants.QueurDDSelector, frame, Channel);
  }

  public async FilterRecordsByChannelNameOverviewPage(selectorVal: string, frame: any, Channel: string, timeout: number = Constants.TenThousand) {
    try {
      await this.waitUntilFrameSelectorIsVisible(SelectorConstants.SLAFirstResponseTime, frame, Constants.One, Constants.DefaultTimeout);
      const omniChanelConversationDigitalMsgSelector = await frame.waitForSelector(SelectorConstants.SLAFirstResponseTime, { timeout });
      await omniChanelConversationDigitalMsgSelector.click();
      await this._page.waitForTimeout(Constants.DefaultTimeout);//This static timeout required so that if queue selection popup remains in open state during failed run so before retrying queue filtration it will close
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.DigitalMsgChannelSelector, frame, Constants.One, Constants.FiveThousand);
      const agentConversationInsightQueueName = await frame.waitForSelector(AgentChatConstants.DigitalMsgChannelSelector, { timeout });
      await agentConversationInsightQueueName.click();
      await this.waitForScreenLoad(frame);
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.IntraDayInsightQueueSelectionSelector, frame, Constants.One, Constants.FiveThousand);
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.IntraDayInsightQueueTitleSelectionSelector, frame, Constants.One, Constants.FiveThousand);
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.IntraDayInsightQueueCheckboxSelectionSelector, frame, Constants.One, Constants.FiveThousand);
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.IntraDayInsightQueueInputSelector, frame, Constants.One, Constants.FiveThousand);
      const agentInsightsAgentInput = await frame.waitForSelector(AgentChatConstants.IntraDayInsightQueueInputSelectorOverview, { timeout });
      await agentInsightsAgentInput.fill("");
      await agentInsightsAgentInput.type(Channel, { delay: 100 });
      await this.waitForScreenLoad(frame);
      await this._page.waitForTimeout(Constants.TenThousand);//This static timeout required so that required queue will be populated in intraday insight 'Queue' dropdown
      const agentInsightsConversationStatusItem = await frame.waitForSelector(AgentChatConstants.DigitalMessageChannelSelector.replace("{0}", Channel), { timeout });
      await agentInsightsConversationStatusItem.focus();
      await this._page.waitForTimeout(Constants.DefaultTimeout);//This static timeout required so that queue selection popup will be kept in open state after focus
      await agentInsightsConversationStatusItem.click();
      await this.waitForScreenLoad(frame);
      await omniChanelConversationDigitalMsgSelector.click();
      await this.waitUntilFrameSelectorIsVisible(selectorVal, frame, Constants.One, timeout);
      const queueSelector = await frame.waitForSelector(selectorVal, { timeout });
      const entityItemText = await queueSelector.textContent();
      if (entityItemText.startsWith(Channel)) {
        return true;
      }
    }
    catch (error) {
      console.log(`Method FilterRecordsByAgentName throwing exception with message: ${error.message}`);
    }
    return false;
  }


  public async FilterItemsByLiveChatAgentForAvgHandleTime(frame: any, queueName: string) {
    await this.FilterRecordsByLiveChatQueuesName(SelectorConstants.QueurDDSelector, frame, queueName);
  }

  public async FilterItemsByAgentAtAllOverviewPageForAvgHandleTime(frame: any, QueueName: string) {
    await this.FilterRecordsByConversationOverViewPageLiveChatAvgHandleTime(frame, QueueName);
  }
  public async FilterRecordsByConversationOverViewPageLiveChatAvgHandleTime(frame: any, queueName: string, timeout: number = Constants.TenThousand) {
    try {
      await this.waitUntilFrameSelectorIsVisible(SelectorConstants.SLAFirstResponseTime, frame, Constants.One, Constants.DefaultTimeout);
      const omniChanelConversationDigitalMsgSelector = await frame.waitForSelector(SelectorConstants.SLAFirstResponseTime, { timeout });
      await omniChanelConversationDigitalMsgSelector.click();
      await this._page.waitForTimeout(Constants.DefaultTimeout);//This static timeout required so that if queue selection popup remains in open state during failed run so before retrying queue filtration it will close
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.ConversationInsightLiveChatQueueSelector, frame, Constants.One, Constants.FiveThousand);
      const agentConversationInsightQueueName = await frame.waitForSelector(AgentChatConstants.ConversationInsightLiveChatQueueSelector, { timeout });
      await agentConversationInsightQueueName.click();
      await this.waitForScreenLoad(frame);
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.IntraDayInsightQueueSelectionSelector, frame, Constants.One, Constants.FiveThousand);
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.IntraDayInsightQueueTitleSelectionSelector, frame, Constants.One, Constants.FiveThousand);
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.IntraDayInsightQueueCheckboxSelectionSelector, frame, Constants.One, Constants.FiveThousand);
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.IntraDayInsightQueueInputSelector, frame, Constants.One, Constants.FiveThousand);
      const ConversationQueueInput = await frame.waitForSelector(AgentChatConstants.ConversationInsightLiveChatQueueInputSelector, { timeout });
      await ConversationQueueInput.fill("");
      await ConversationQueueInput.type(queueName, { delay: 100 });
      await this.waitForScreenLoad(frame);
      await this._page.waitForTimeout(Constants.TenThousand);//This static timeout required so that required queue will be populated in intraday insight 'Queue' dropdown
      const agentInsightsConversationStatusItem = await frame.waitForSelector(AgentChatConstants.DigitalQueueSelector.replace("{0}", queueName), { timeout });
      await agentInsightsConversationStatusItem.focus();
      await this._page.waitForTimeout(Constants.DefaultTimeout);//This static timeout required so that queue selection popup will be kept in open state after focus
      await agentInsightsConversationStatusItem.click();
      await this.waitForScreenLoad(frame);
      const omniChanelConversationDigitalMsgSelector1 = await frame.waitForSelector(SelectorConstants.SLAFirstResponseTime, { timeout });
      await omniChanelConversationDigitalMsgSelector1.click();
    }
    catch (error) {
      console.log(`Method FilterRecordsByAgentName throwing exception with message: ${error.message}`);
    }
    return false;
  }
  public async ValidateAvgHandletimeInOverView(frame: any) {
    await this.waitUntilFrameSelectorIsVisible(
      SelectorConstants.AvgHandleTimeTooltip,
      frame,
      Constants.One,
      Constants.DefaultTimeout
    );
    const Tooltip = await frame.waitForSelector(SelectorConstants.AvgHandleTimeTooltip);
    await Tooltip.hover();
    return true;
  }
  public async ValidateAvgHandletimeInLivechat(frame: any) {
    await this.waitUntilFrameSelectorIsVisible(
      SelectorConstants.LivechatAvgHandleTimeToolTip,
      frame,
      Constants.One,
      Constants.DefaultTimeout
    );
    const Tooltip = await frame.waitForSelector(SelectorConstants.LivechatAvgHandleTimeToolTip);
    await Tooltip.hover();
    return true;
  }

  public async initiateVoiceCall() {
    const iframeCC = await IFrameHelper.GetIframe(
      this._page,
      IFrameConstants.IframeCC
    );
    await iframeCC.$eval(AgentConversationPageConstants.EscalateCall, (el) =>
      (el as HTMLElement).click()
    );
    await iframeCC.waitForSelector(
      AgentConversationPageConstants.VoiceCallClick
    );

    await iframeCC.$eval(AgentConversationPageConstants.VoiceCallClick, (el) =>
      (el as HTMLElement).click()
    );
  }

  public async verifyVoiceCallRequest() {
    const iframeCC = await IFrameHelper.GetIframe(
      this._page,
      IFrameConstants.IframeCC
    );
    const voiceCallInitiatedStatus = await iframeCC.waitForSelector(
      AgentConversationPageConstants.VoiceCallStatus
    );
    return voiceCallInitiatedStatus;
  }

  public async verifyVideoCallRequest() {
    const iframeCC = await IFrameHelper.GetIframe(
      this._page,
      IFrameConstants.IframeCC
    );

    const videoCallInitiatedStatus = await iframeCC.waitForSelector(
      AgentConversationPageConstants.VideoCallStatus
    );
    return videoCallInitiatedStatus;
  }

  public async verifyDeclinedCallRequest() {
    const iframeCC = await IFrameHelper.GetIframe(
      this._page,
      IFrameConstants.IframeCC
    );
    const voiceCallInitiatedStatus = await iframeCC.waitForSelector(
      AgentConversationPageConstants.VoiceCallStatus
    );
    return voiceCallInitiatedStatus;
  }

  public async ValidateLiveChatClosedConversation(frame: any) {
    try {
      await this.waitUntilFrameSelectorIsVisible(SelectorConstants.CloseChatTitle, frame, Constants.One, Constants.DefaultTimeout);
      expect(await frame.waitForSelector(SelectorConstants.CloseChatTitle)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.CloseChatAgent)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.CloseChatStatus)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.CloseChatAction)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.CloseChatWorkStream)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.CloseChatFirstresponsetime)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.CloseChatAvgresponsetime)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.CloseChatTotalresponsetime)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.CloseChatHandletime)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.CloseChatWraptime)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.CloseChatSentiment)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.CloseChatIncomingmessages)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.CloseChatOutgoingresponses)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.CloseChatTransfers)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.CloseChatEscalations)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.CloseChatCreatedon)).toBeTruthy();
      await this.waitUntilFrameSelectorIsVisible(SelectorConstants.CloseChatClosedon, frame, Constants.One, Constants.DefaultTimeout);
      const CloseChatScroll = await frame.waitForSelector(SelectorConstants.CloseChatClosedon);
      await CloseChatScroll.click();
      expect(await frame.waitForSelector(SelectorConstants.CloseChatClosedon)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.CloseChatConversationID)).toBeTruthy();
      return true;
    } catch (error) {
      console.log(`Method expectedFieldsInConversationForm throwing exception with message: ${error.message}`);
    }
  }

  public async ValidateOngoingChatsLiveChat(frame: any) {
    try {
      expect(await frame.waitForSelector(SelectorConstants.OnGoingChatTitle)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.OnGoingChatAgent)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.OnGoingChatStatus)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.OnGoingChatTimeincurrentstatus)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.OnGoingChatAction)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.OnGoingChatQueue)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.OnGoingChatWorkStream)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.OnGoingChatFirstresponsetime)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.OnGoingChatAvgresponsetime)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.OnGoingChatTotalresponsetime)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.OnGoingChatTotalwaittime)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.OnGoingChatHandletime)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.OnGoingChatWraptime)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.OnGoingChatSentiment)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.OnGoingChatIncomingmessages)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.OnGoingChatOutgoingresponses)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.OnGoingChatTransfers)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.OnGoingChatEscalations)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.OnGoingChatCreatedon)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.OnGoingChatConversationID)).toBeTruthy();
      return true;
    } catch (error) {
      console.log(`Method expectedFieldsInConversationForm throwing exception with message: ${error.message}`);
    }
  }

  public async validateAgentHtmlMessageFacebook(
    messageNumber: number,
    textToValidate: string
  ) {
    this.delay(5000);
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    const messageInnerHtml = await (
      await iframe.waitForSelector(
        AgentChatConstants.CustomerHtmlMessageXPathV2.replace(
          "{0}",
          messageNumber.toString()
        )
      )
    ).innerHTML();
    return (
      messageInnerHtml === textToValidate ||
      messageInnerHtml === `<p>${textToValidate}</p>`
    );
  }
  public async validateDotNotification(iframe) {
    try {
      const collapse = await iframe.waitForSelector(
        AgentChatConstants.DotNotification
      );
      return collapse;
    }
    catch (error) {
      return false;
    }
  }
  public async validateDotNotificationINSession1(iframe: any) {
    await this.waitUntilFrameSelectorIsVisible(
      AgentConversationPageConstants.Visitor1Name,
      this.Page,
      Constants.One,
      Constants.FiveThousand
    );
    const li = await this._page
      .waitForSelector(AgentConversationPageConstants.Visitor1Name)
      .catch(() => {
        throw new Error(
          `Can't verify that ConversationControl window contains Sentiment status at the header.`
        );
      });
    const liTitle = await li.textContent();
    const chatWidgetbtn = await this.Page.waitForSelector(
      SelectorConstants.VisitorSession1.replace("{0}", liTitle)
    );
    await chatWidgetbtn.click();
    await this.waitForDomContentLoaded();
  }
  public async NavigationToVisitorSession2() {
    await this.waitUntilFrameSelectorIsVisible(
      AgentConversationPageConstants.Visitor2Name,
      this.Page,
      Constants.One,
      Constants.FiveThousand
    );
    const li = await this.Page
      .waitForSelector(AgentConversationPageConstants.Visitor2Name)
      .catch(() => {
        throw new Error(
          `Can't verify that ConversationControl window contains Sentiment status at the header.`
        );
      });
    const liTitle = await li.textContent();
    const selectTable = await this.Page.waitForSelector(
      SelectorConstants.VisitorSession2.replace("{0}", liTitle)
    );
    await selectTable.click();
  }


  public async FilterItemsByConversationInsigitsOverviewPageLiveChatQueueMetrics(frame: any, queueName: string) {
    await this.FilterRecordsByConversationOverViewPageLiveChatQueuesNameMetrics(frame, queueName);
  }

  public async FilterRecordsByConversationOverViewPageLiveChatQueuesNameMetrics(frame: any, queueName: string, timeout: number = Constants.TenThousand) {
    try {
      await this.waitUntilFrameSelectorIsVisible(SelectorConstants.SLAFirstResponseTime, frame, Constants.One, Constants.DefaultTimeout);
      const omniChanelConversationDigitalMsgSelector = await frame.waitForSelector(SelectorConstants.SLAFirstResponseTime, { timeout });
      await omniChanelConversationDigitalMsgSelector.click();
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.ConversationInsightLiveChatQueueSelector, frame, Constants.One, Constants.FiveThousand);
      const agentConversationInsightQueueName = await frame.waitForSelector(AgentChatConstants.ConversationInsightLiveChatQueueSelector, { timeout });
      await agentConversationInsightQueueName.click();
      await this.waitForScreenLoad(frame);
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.IntraDayInsightQueueSelectionSelector, frame, Constants.One, Constants.FiveThousand);
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.IntraDayInsightQueueTitleSelectionSelector, frame, Constants.One, Constants.FiveThousand);
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.IntraDayInsightQueueCheckboxSelectionSelector, frame, Constants.One, Constants.FiveThousand);
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.IntraDayInsightQueueInputSelector, frame, Constants.One, Constants.FiveThousand);
      const ConversationQueueInput = await frame.waitForSelector(AgentChatConstants.ConversationInsightLiveChatQueueInputSelector, { timeout });
      await ConversationQueueInput.fill("");
      await ConversationQueueInput.type(queueName, { delay: 100 });
      await this.waitForScreenLoad(frame);
      const agentInsightsConversationStatusItem = await frame.waitForSelector(AgentChatConstants.DigitalQueueSelector.replace("{0}", queueName), { timeout });
      await agentInsightsConversationStatusItem.focus();
      await agentInsightsConversationStatusItem.click();
      await this.waitForScreenLoad(frame);
      const omniChanelConversationDigitalMsgSelector1 = await frame.waitForSelector(SelectorConstants.SLAFirstResponseTime, { timeout });
      await omniChanelConversationDigitalMsgSelector1.click();

    }
    catch (error) {
      console.log(`Method FilterRecordsByAgentName throwing exception with message: ${error.message}`);
    }
    return false;
  }

  public async FilterItemsByChannelDigitalMsgPage(frame: any, Channel: string) {
    await this.FilterRecordsByChannelNameDigitalMsgPage(SelectorConstants.QueurDDSelector, frame, Channel);
  }

  public async FilterRecordsByChannelNameDigitalMsgPage(selectorVal: string, frame: any, Channel: string, timeout: number = Constants.TenThousand) {
    try {
      await this.waitUntilFrameSelectorIsVisible(SelectorConstants.SLAFirstResponseTime, frame, Constants.One, Constants.DefaultTimeout);
      const omniChanelConversationDigitalMsgSelector = await frame.waitForSelector(SelectorConstants.SLAFirstResponseTime, { timeout });
      await omniChanelConversationDigitalMsgSelector.click();
      await this._page.waitForTimeout(Constants.DefaultTimeout);//This static timeout required so that if queue selection popup remains in open state during failed run so before retrying queue filtration it will close
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.DigitalMsgChannelSelector, frame, Constants.One, Constants.FiveThousand);
      const agentConversationInsightQueueName = await frame.waitForSelector(AgentChatConstants.DigitalMsgChannelSelector, { timeout });
      await agentConversationInsightQueueName.click();
      await this.waitForScreenLoad(frame);
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.IntraDayInsightQueueSelectionSelector, frame, Constants.One, Constants.FiveThousand);
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.IntraDayInsightQueueTitleSelectionSelector, frame, Constants.One, Constants.FiveThousand);
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.IntraDayInsightQueueCheckboxSelectionSelector, frame, Constants.One, Constants.FiveThousand);
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.IntraDayInsightQueueInputSelector, frame, Constants.One, Constants.FiveThousand);
      const agentInsightsAgentInput = await frame.waitForSelector(AgentChatConstants.IntraDayInsightQueueInputSelectorMsg, { timeout });
      await agentInsightsAgentInput.fill("");
      await agentInsightsAgentInput.type(Channel, { delay: 100 });
      await this.waitForScreenLoad(frame);
      await this._page.waitForTimeout(Constants.TenThousand);//This static timeout required so that required queue will be populated in intraday insight 'Queue' dropdown
      const agentInsightsConversationStatusItem = await frame.waitForSelector(AgentChatConstants.DigitalMessageChannelSelector.replace("{0}", Channel), { timeout });
      await agentInsightsConversationStatusItem.focus();
      await this._page.waitForTimeout(Constants.DefaultTimeout);//This static timeout required so that queue selection popup will be kept in open state after focus
      await agentInsightsConversationStatusItem.click();
      await this.waitForScreenLoad(frame);
      await omniChanelConversationDigitalMsgSelector.click();
      await this.waitUntilFrameSelectorIsVisible(selectorVal, frame, Constants.One, timeout);
      const queueSelector = await frame.waitForSelector(selectorVal, { timeout });
      const entityItemText = await queueSelector.textContent();
      if (entityItemText.startsWith(Channel)) {
        return true;
      }
    }
    catch (error) {
      console.log(`Method FilterRecordsByAgentName throwing exception with message: ${error.message}`);
    }
    return false;
  }
  public async ValidateSLAResponseTime(frame: any, timeout: number = Constants.TenThousand) {
    await this.waitUntilFrameSelectorIsVisible(SelectorConstants.SLAFirstResponseTimeMsg, frame, Constants.One, Constants.DefaultTimeout);
    expect(await frame.waitForSelector(SelectorConstants.SLAFirstResponseTimeMsg)).toBeTruthy();
    expect(await frame.waitForSelector(SelectorConstants.SLAResponseTimeMsg)).toBeTruthy();
    expect(await frame.waitForSelector(SelectorConstants.SLAResponseTimeMsgHeader)).toBeTruthy();
    return true;
  }

  public async ValidateAvgResponseTime(frame: any, timeout: number = Constants.TenThousand) {
    await this.waitUntilFrameSelectorIsVisible(SelectorConstants.AvgResponseTimeMsgHeader, frame, Constants.One, Constants.DefaultTimeout);
    expect(await frame.waitForSelector(SelectorConstants.AvgResponseTimeMsgHeader)).toBeTruthy();
    return true;
  }

  public async NavigatetoConversationInsightsLiveChat(frame: any) {
    await this.waitUntilSelectorIsVisible(
      SelectorConstants.ConversationInsightsLivechat,
      AgentChatConstants.Two,
      this.Page,
      AgentChatConstants.FiveThousandsMiliSecondsWaitTimeout
    );
    await frame.click(SelectorConstants.ConversationInsightsLivechat);
    await this.waitForScreenLoad(frame);
  }

  public async ValidateOverViewForVerifyLiveChatrelatedmetrics(frame: any) {
    await this.waitUntilFrameSelectorIsVisible(
      SelectorConstants.AvghandletimeOverView,
      frame,
      Constants.One,
      Constants.DefaultTimeout
    );
    const Tooltip = await frame.waitForSelector(SelectorConstants.AvghandletimeOverView);
    await Tooltip.hover();
    await this.waitUntilFrameSelectorIsVisible(
      SelectorConstants.AvgwaittimeOverView,
      frame,
      Constants.One,
      Constants.DefaultTimeout
    );
    const Tooltip1 = await frame.waitForSelector(SelectorConstants.AvgwaittimeOverView);
    await Tooltip1.hover();
    await this.waitUntilFrameSelectorIsVisible(
      SelectorConstants.ChatabandonrateView,
      frame,
      Constants.One,
      Constants.DefaultTimeout
    );
    const Tooltip2 = await frame.waitForSelector(SelectorConstants.ChatabandonrateView);
    await Tooltip2.hover();
    return true;
  }

  public async ValidateLiveChatPageForVerifyLiveChatrelatedmetrics(frame: any) {
    await this.waitUntilFrameSelectorIsVisible(
      SelectorConstants.AvghandletimeLivechat,
      frame,
      Constants.One,
      Constants.DefaultTimeout
    );
    const Tooltip = await frame.waitForSelector(SelectorConstants.AvghandletimeLivechat);
    await Tooltip.hover();
    await this.waitUntilFrameSelectorIsVisible(
      SelectorConstants.AvgwaittimeLivechat,
      frame,
      Constants.One,
      Constants.DefaultTimeout
    );
    const Tooltip1 = await frame.waitForSelector(SelectorConstants.AvgwaittimeLivechat);
    await Tooltip1.hover();
    await this.waitUntilFrameSelectorIsVisible(
      SelectorConstants.AvgwraptimeLivechat,
      frame,
      Constants.One,
      Constants.DefaultTimeout
    );
    const Tooltip2 = await frame.waitForSelector(SelectorConstants.AvgwraptimeLivechat);
    await Tooltip2.hover();
    await this.waitUntilFrameSelectorIsVisible(
      SelectorConstants.ChatabandonratLivechat,
      frame,
      Constants.One,
      Constants.DefaultTimeout
    );
    const Tooltip3 = await frame.waitForSelector(SelectorConstants.ChatabandonratLivechat);
    await Tooltip3.hover();
    await this.waitUntilFrameSelectorIsVisible(
      SelectorConstants.Transferratebyqueue,
      frame,
      Constants.One,
      Constants.DefaultTimeout
    );
    const Tooltip4 = await frame.waitForSelector(SelectorConstants.Transferratebyqueue);
    await Tooltip4.hover();
    return true;
  }

  public async NavigatetoConversationInsightsDashboardForLivechat(frame: any) {
    await this.waitUntilSelectorIsVisible(
      SelectorConstants.ConversationInsightsLivechat,
      AgentChatConstants.Two,
      this.Page,
      AgentChatConstants.FiveThousandsMiliSecondsWaitTimeout
    );
    await this.Page.click(SelectorConstants.IntradayInsightsDropDown);
    await this.Page.click(SelectorConstants.ConversationInsights);
    await this.waitForScreenLoad(frame);
    await frame.click(SelectorConstants.ConversationInsightsLivechat);
    await this.waitForScreenLoad(frame);
  }

  public async FilterRecordsByLiveChatQueuesNameOverviewPage(selectorVal: string, frame: any, queueName: string, maxCount = Constants.Three, timeout: number = Constants.TenThousand) {
    try {
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.OnGoingChatsSelector, frame, Constants.One, Constants.DefaultTimeout);
      const omniChanelAgentInsightSelector = await frame.waitForSelector(AgentChatConstants.OnGoingChatsSelector, { timeout });
      await omniChanelAgentInsightSelector.click();
      await this._page.waitForTimeout(Constants.DefaultTimeout);//This static timeout required so that if queue selection popup remains in open state during failed run so before retrying queue filtration it will close

      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.ConversationInsightsQueueSelector, frame, Constants.One, Constants.FiveThousand);
      const agentConversationInsightAgentName = await frame.waitForSelector(AgentChatConstants.ConversationInsightsQueueSelector, { timeout });
      await agentConversationInsightAgentName.click();

      await this.waitForScreenLoad(frame);

      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.IntraDayInsightQueueSelectionSelector, frame, Constants.One, Constants.FiveThousand);
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.IntraDayInsightQueueTitleSelectionSelector, frame, Constants.One, Constants.FiveThousand);
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.IntraDayInsightQueueCheckboxSelectionSelector, frame, Constants.One, Constants.FiveThousand);
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.IntraDayInsightQueueInputSelector, frame, Constants.One, Constants.FiveThousand);
      const agentInsightsAgentInput = await frame.waitForSelector(AgentChatConstants.ConversationInsightQueueInputSelectorOverview, { timeout });
      await agentInsightsAgentInput.fill("");
      await agentInsightsAgentInput.type(queueName, { delay: 100 });

      await this.waitForScreenLoad(frame);
      await this._page.waitForTimeout(Constants.TenThousand);//This static timeout required so that required queue will be populated in intraday insight 'Queue' dropdown

      const agentInsightsConversationStatusItem = await frame.waitForSelector(AgentChatConstants.IntraDayInsightConversationStatusQueueSelector, { timeout });
      await agentInsightsConversationStatusItem.focus();
      await this._page.waitForTimeout(Constants.DefaultTimeout);//This static timeout required so that queue selection popup will be kept in open state after focus
      await agentInsightsConversationStatusItem.click();

      await this.waitForScreenLoad(frame);
      await omniChanelAgentInsightSelector.click();
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.OnGoingChatsSelector, frame, Constants.One, Constants.DefaultTimeout);
      await this.waitUntilFrameSelectorIsVisible(selectorVal, frame, Constants.One, timeout);
      const queueSelector = await frame.waitForSelector(selectorVal, { timeout });
      const entityItemText = await queueSelector.textContent();
      if (entityItemText.startsWith(queueName)) {
        return true;
      }
    }
    catch (error) {
      console.log(`Method FilterRecordsByAgentName throwing exception with message: ${error.message}`);
    }
    return false;
  }

  public async FilterItemsConversationByLiveChatAgent(frame: any, queueName: string) {
    await this.FilterRecordsByLiveChatQueuesName(SelectorConstants.QueurDDSelector, frame, queueName)
  }

  public async ValidateOverViewKeyBoardAccesbility(frame: any) {
    await this.waitUntilFrameSelectorIsVisible(
      SelectorConstants.AvghandletimeKeyboard,
      frame,
      Constants.One,
      Constants.DefaultTimeout
    );
    const Tooltip1 = await frame.waitForSelector(SelectorConstants.AvghandletimeKeyboard);
    await Tooltip1.click();
    await this.Page.keyboard.press("Enter");
    await this.Page.keyboard.press("Tab");
    await this.waitUntilFrameSelectorIsVisible(
      SelectorConstants.AvgwaittimeKeyboard,
      frame,
      Constants.One,
      Constants.DefaultTimeout
    );
    const Tooltip2 = await frame.waitForSelector(SelectorConstants.AvgwaittimeKeyboard);
    await Tooltip2.click();
    await this.Page.keyboard.press("Enter");
    await this.Page.keyboard.press("Tab");
    await this.waitUntilFrameSelectorIsVisible(
      SelectorConstants.ChatabandonrateKeyboard,
      frame,
      Constants.One,
      Constants.DefaultTimeout
    );
    const Tooltip3 = await frame.waitForSelector(SelectorConstants.ChatabandonrateKeyboard);
    await Tooltip3.click();
    await this.Page.keyboard.press("Enter");
    return true;
  }

  public async ValidateLivechatKeyBoardAccesbility(frame: any) {
    await this.waitUntilFrameSelectorIsVisible(
      SelectorConstants.AvghandletimeLiveChatKeyboard,
      frame,
      Constants.One,
      Constants.DefaultTimeout
    );
    const Tooltip1 = await frame.waitForSelector(SelectorConstants.AvghandletimeLiveChatKeyboard);
    await Tooltip1.click();
    await this.Page.keyboard.press("Enter");
    await this.Page.keyboard.press("Tab");
    await this.waitUntilFrameSelectorIsVisible(
      SelectorConstants.AvgwaittimeLiveChatKeyboard,
      frame,
      Constants.One,
      Constants.DefaultTimeout
    );
    const Tooltip2 = await frame.waitForSelector(SelectorConstants.AvgwaittimeLiveChatKeyboard);
    await Tooltip2.click();
    await this.Page.keyboard.press("Enter");
    await this.Page.keyboard.press("Tab");
    await this.waitUntilFrameSelectorIsVisible(
      SelectorConstants.AvgwraptimeLiveChatKeyboard,
      frame,
      Constants.One,
      Constants.DefaultTimeout
    );
    const Tooltip3 = await frame.waitForSelector(SelectorConstants.AvgwraptimeLiveChatKeyboard);
    await Tooltip3.click();
    await this.Page.keyboard.press("Enter");
    await this.Page.keyboard.press("Tab");
    await this.waitUntilFrameSelectorIsVisible(
      SelectorConstants.ChatabandonrateLiveChatKeyboard,
      frame,
      Constants.One,
      Constants.DefaultTimeout
    );
    const Tooltip4 = await frame.waitForSelector(SelectorConstants.ChatabandonrateLiveChatKeyboard);
    await Tooltip4.click();
    await this.Page.keyboard.press("Enter");
    await this.Page.keyboard.press("Tab");
    await this.waitUntilFrameSelectorIsVisible(
      SelectorConstants.TransferratebyqueueKeyboard,
      frame,
      Constants.One,
      Constants.DefaultTimeout
    );
    const Tooltip5 = await frame.waitForSelector(SelectorConstants.TransferratebyqueueKeyboard);
    await Tooltip5.click();
    await this.Page.keyboard.press("Enter");
    return true;
  }

  public async NavigatetoagentinsightsAllOverview(frame: any) {
    await this.waitUntilSelectorIsVisible(
      SelectorConstants.AgentInsightsAllOverview,
      AgentChatConstants.Two,
      this.Page,
      AgentChatConstants.FiveThousandsMiliSecondsWaitTimeout
    );
    await frame.click(SelectorConstants.AgentInsightsAllOverview);
    await this.waitForScreenLoad(frame);
  }

  public async NavigatetoagentinsightsLivechat(frame: any) {
    await this.waitUntilSelectorIsVisible(
      SelectorConstants.AgentInsightsLiveChat,
      AgentChatConstants.Two,
      this.Page,
      AgentChatConstants.TenThousand
    );
    await frame.click(SelectorConstants.AgentInsightsLiveChat);
    await this.waitForScreenLoad(frame);
  }

  public async NavigatetoagentinsightsVoice(frame: any) {
    await this.waitUntilSelectorIsVisible(
      SelectorConstants.AgentInsightsVoice,
      AgentChatConstants.Two,
      this.Page,
      AgentChatConstants.FiveThousandsMiliSecondsWaitTimeout
    );
    await frame.click(SelectorConstants.AgentInsightsVoice);
    await this.waitForScreenLoad(frame);
  }

  public async NavigatetoagentinsightsDigitalmessaging(frame: any) {
    await this.waitUntilSelectorIsVisible(
      SelectorConstants.AgentInsightsDigitalMessaging,
      AgentChatConstants.Two,
      this.Page,
      AgentChatConstants.FiveThousandsMiliSecondsWaitTimeout
    );
    await frame.click(SelectorConstants.AgentInsightsDigitalMessaging);
    await this.waitForScreenLoad(frame);
  }

  public async FilterItemsByAgentAtAllOverviewPageForAgent(frame: any, agentName: string) {
    await this.FilterRecordsByAgentNameOverViewall(frame, agentName);
  }

  public async FilterItemsByAgentAtAllOverviewPageForQueue(frame: any, QueueName: string) {
    await this.FilterRecordsByQueuesNameForOverViewPage(frame, QueueName);
  }

  public async FilterItemsByQueueAtAllOverviewPage(frame: any, agentName: string) {
    await this.FilterRecordsByQueuesName(SelectorConstants.QueurDDSelector, frame, agentName);
  }

  public async FilterItemsByAgentLiveChatmethod(frame: any, agentName: string) {
    await this.FilterRecordsByAgentNameLiveChat(SelectorConstants.QueurDDSelector, frame, agentName);
  }

  public async FilterItemsByQueuetLiveChatmethod(frame: any, QueueName: string) {
    await this.FilterRecordsByQueuesNameLiveChat(frame, QueueName);
  }

  public async FilterItemsByAgentDigitalMsgmethod(frame: any, agentName: string) {
    await this.FilterRecordsByAgentNameDigitalMsg(frame, agentName);
  }

  public async FilterItemsByQueueDigitalMsgmethod(frame: any, QueueName: string) {
    await this.FilterRecordsByQueuesNameDigitalMsg(frame, QueueName);
  }

  public async FilterRecordsByAgentNameLiveChat(selectorVal: string, frame: any, agentName: string, timeout: number = Constants.TenThousand) {
    try {
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.DurationSelector, frame, Constants.One, Constants.DefaultTimeout);
      const omniChanelAgentInsightSelector = await frame.waitForSelector(AgentChatConstants.DurationSelector, { timeout });
      await omniChanelAgentInsightSelector.click();
      await this._page.waitForTimeout(Constants.DefaultTimeout);//This static timeout required so that if queue selection popup remains in open state during failed run so before retrying queue filtration it will close

      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.AgentInsightsAgentSelector, frame, Constants.One, Constants.FiveThousand);
      const agentInsightsAgentName = await frame.waitForSelector(AgentChatConstants.AgentInsightsAgentSelector, { timeout });
      await agentInsightsAgentName.click();

      await this.waitForScreenLoad(frame);

      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.IntraDayInsightQueueSelectionSelector, frame, Constants.One, Constants.FiveThousand);
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.IntraDayInsightQueueTitleSelectionSelector, frame, Constants.One, Constants.FiveThousand);
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.IntraDayInsightQueueCheckboxSelectionSelector, frame, Constants.One, Constants.FiveThousand);
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.IntraDayInsightQueueInputSelector, frame, Constants.One, Constants.FiveThousand);
      const agentInsightsAgentInput = await frame.waitForSelector(AgentChatConstants.AgentInsightAgentInputSelectorLivechat, { timeout });
      await agentInsightsAgentInput.fill("");
      await agentInsightsAgentInput.type(agentName, { delay: 100 });
      await this._page.waitForTimeout(Constants.TenThousand);//This static timeout required so that required queue will be populated in intraday insight 'Queue' dropdown

      const agentInsightsConversationStatusItem = await frame.waitForSelector(AgentChatConstants.IntraDayInsightConversationStatusQueueSelector, { timeout });
      await agentInsightsConversationStatusItem.focus();
      await this._page.waitForTimeout(Constants.DefaultTimeout);//This static timeout required so that queue selection popup will be kept in open state after focus
      await agentInsightsConversationStatusItem.click();

      await this.waitForScreenLoad(frame);
      await omniChanelAgentInsightSelector.click();
    }
    catch (error) {
      console.log(`Method FilterRecordsByAgentNameLiveChat throwing exception with message: ${error.message}`);
    }
    return false;
  }

  public async FilterRecordsByQueuesNameLiveChat(frame: any, queueName: string, timeout: number = Constants.TenThousand) {
    try {
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.AgentInsightsQueueSelector, frame, Constants.One, Constants.FiveThousand);
      const agentInsightQueuetName = await frame.waitForSelector(AgentChatConstants.AgentInsightsQueueSelector, { timeout });
      await agentInsightQueuetName.click();
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.AgentInsightQueueTitleSelectionSelector, frame, Constants.One, Constants.FiveThousand);
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.AgentInsightQueueCheckboxSelectionSelector, frame, Constants.One, Constants.FiveThousand);
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.AgentInsightQueueInputSelectorLivechat, frame, Constants.One, Constants.FiveThousand);
      const agentInsightsQueueInput = await frame.waitForSelector(AgentChatConstants.AgentInsightQueueInputSelectorLivechat, { timeout });
      const agentInsightsConversationQueueStatusItem1 = await frame.waitForSelector(AgentChatConstants.AgentInsightLivechatQueueSelectAllSelector, { timeout });
      await agentInsightsConversationQueueStatusItem1.focus();
      await this._page.waitForTimeout(Constants.DefaultTimeout);//This static timeout required so that queue selection popup will be kept in open state after focus
      const agentInsightsQueueInput1 = await frame.waitForSelector(AgentChatConstants.AgentInsightQueueInputSelectorLivechat, { timeout });
      await agentInsightsConversationQueueStatusItem1.click();
      await agentInsightsQueueInput.fill("");
      await agentInsightsQueueInput.type(queueName, { delay: 100 });
      await this._page.waitForTimeout(Constants.TenThousand);//This static timeout required so that required queue will be populated in intraday insight 'Queue' dropdown

      const agentInsightsConversationQueueStatusItem = await frame.waitForSelector(AgentChatConstants.AgentInsightConversationStatusQueueSelector, { timeout });
      await agentInsightsConversationQueueStatusItem.focus();
      await this._page.waitForTimeout(Constants.DefaultTimeout);//This static timeout required so that queue selection popup will be kept in open state after focus
      await agentInsightsConversationQueueStatusItem.click();

      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.DurationSelector, frame, Constants.One, Constants.DefaultTimeout);
      const omniChanelAgentInsightSelector = await frame.waitForSelector(AgentChatConstants.DurationSelector, { timeout });
      await omniChanelAgentInsightSelector.click();
    }
    catch (error) {
      console.log(`Method FilterRecordsByQueuesNameLiveChat throwing exception with message: ${error.message}`);
    }
    return false;
  }

  public async FilterRecordsByAgentNameDigitalMsg(frame: any, agentName: string, timeout: number = Constants.TenThousand) {
    try {
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.DurationSelector, frame, Constants.One, Constants.DefaultTimeout);
      const omniChanelAgentInsightSelector = await frame.waitForSelector(AgentChatConstants.DurationSelector, { timeout });
      await omniChanelAgentInsightSelector.click();
      await this._page.waitForTimeout(Constants.DefaultTimeout);//This static timeout required so that if queue selection popup remains in open state during failed run so before retrying queue filtration it will close

      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.AgentInsightsAgentSelector, frame, Constants.One, Constants.FiveThousand);
      const agentInsightsAgentName = await frame.waitForSelector(AgentChatConstants.AgentInsightsAgentSelector, { timeout });
      await agentInsightsAgentName.click();

      await this.waitForScreenLoad(frame);

      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.IntraDayInsightQueueSelectionSelector, frame, Constants.One, Constants.FiveThousand);
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.IntraDayInsightQueueTitleSelectionSelector, frame, Constants.One, Constants.FiveThousand);
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.IntraDayInsightQueueCheckboxSelectionSelector, frame, Constants.One, Constants.FiveThousand);
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.IntraDayInsightQueueInputSelector, frame, Constants.One, Constants.FiveThousand);
      const agentInsightsAgentInput = await frame.waitForSelector(AgentChatConstants.AgentInsightAgentInputSelectorDigitalmsg, { timeout });
      await agentInsightsAgentInput.fill("");
      await agentInsightsAgentInput.type(agentName, { delay: 100 });
      await this._page.waitForTimeout(Constants.TenThousand);//This static timeout required so that required queue will be populated in intraday insight 'Queue' dropdown

      const agentInsightsConversationStatusItem = await frame.waitForSelector(AgentChatConstants.IntraDayInsightConversationStatusQueueSelector, { timeout });
      await agentInsightsConversationStatusItem.focus();
      await this._page.waitForTimeout(Constants.DefaultTimeout);//This static timeout required so that queue selection popup will be kept in open state after focus
      await agentInsightsConversationStatusItem.click();
      await omniChanelAgentInsightSelector.click();
    }
    catch (error) {
      console.log(`Method FilterRecordsByAgentNameDigitalMsg throwing exception with message: ${error.message}`);
    }
    return false;
  }

  public async FilterRecordsByQueuesNameDigitalMsg(frame: any, queueName: string, timeout: number = Constants.TenThousand) {
    try {
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.AgentInsightsQueueSelector, frame, Constants.One, Constants.FiveThousand);
      const agentInsightQueuetName = await frame.waitForSelector(AgentChatConstants.AgentInsightsQueueSelector, { timeout });
      await agentInsightQueuetName.click();

      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.AgentInsightQueueTitleSelectionSelector, frame, Constants.One, Constants.FiveThousand);
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.AgentInsightQueueCheckboxSelectionSelector, frame, Constants.One, Constants.FiveThousand);
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.AgentInsightQueueInputSelectorDigitalmsg, frame, Constants.One, Constants.FiveThousand);
      const agentInsightsQueueInput = await frame.waitForSelector(AgentChatConstants.AgentInsightQueueInputSelectorDigitalmsg, { timeout });
      const agentInsightsConversationQueueStatusItem1 = await frame.waitForSelector(AgentChatConstants.AgentInsightLivechatQueueSelectAllSelector, { timeout });
      await agentInsightsConversationQueueStatusItem1.focus();
      await this._page.waitForTimeout(Constants.DefaultTimeout);//This static timeout required so that queue selection popup will be kept in open state after focus
      const agentInsightsQueueInput1 = await frame.waitForSelector(AgentChatConstants.AgentInsightQueueInputSelectorDigitalmsg, { timeout });
      await agentInsightsConversationQueueStatusItem1.click();
      await agentInsightsQueueInput.fill("");
      await agentInsightsQueueInput.type(queueName, { delay: 100 });

      await this.waitForScreenLoad(frame);
      await this._page.waitForTimeout(Constants.TenThousand);//This static timeout required so that required queue will be populated in intraday insight 'Queue' dropdown

      const agentInsightsConversationQueueStatusItem = await frame.waitForSelector(AgentChatConstants.AgentInsightLivechatQueueSelectAllSelector, { timeout });
      await agentInsightsConversationQueueStatusItem.focus();
      await this._page.waitForTimeout(Constants.DefaultTimeout);//This static timeout required so that queue selection popup will be kept in open state after focus
      await agentInsightsConversationQueueStatusItem.click();

      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.DurationSelector, frame, Constants.One, Constants.DefaultTimeout);
      const omniChanelAgentInsightSelector = await frame.waitForSelector(AgentChatConstants.DurationSelector, { timeout });
      await omniChanelAgentInsightSelector.click();
    }
    catch (error) {
      console.log(`Method FilterRecordsByQueuesNameDigitalMsg throwing exception with message: ${error.message}`);
    }
    return false;
  }


  public async FilterRecordsByAgentNameOverViewall(frame: any, agentName: string, timeout: number = Constants.TenThousand) {

    try {
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.DurationSelector, frame, Constants.One, Constants.DefaultTimeout);
      const omniChanelAgentInsightSelector = await frame.waitForSelector(AgentChatConstants.DurationSelector, { timeout });
      await omniChanelAgentInsightSelector.click();
      await this._page.waitForTimeout(Constants.DefaultTimeout); //This static timeout required so that if queue selection popup remains in open state during failed run so before retrying queue filtration it will close

      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.AgentInsightsAgentSelector, frame, Constants.One, Constants.FiveThousand);
      const agentInsightsAgentName = await frame.waitForSelector(AgentChatConstants.AgentInsightsAgentSelector, { timeout });
      await agentInsightsAgentName.click();

      await this.waitForScreenLoad(frame);

      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.IntraDayInsightQueueSelectionSelector, frame, Constants.One, Constants.FiveThousand);
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.IntraDayInsightQueueTitleSelectionSelector, frame, Constants.One, Constants.FiveThousand);
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.IntraDayInsightQueueCheckboxSelectionSelector, frame, Constants.One, Constants.FiveThousand);
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.IntraDayInsightQueueInputSelector, frame, Constants.One, Constants.FiveThousand);
      const agentInsightsAgentInput = await frame.waitForSelector(AgentChatConstants.AgentInsightAgentInputSelector, { timeout });
      await agentInsightsAgentInput.fill("");
      await agentInsightsAgentInput.type(agentName, { delay: 100 });

      await this.waitForScreenLoad(frame);
      await this._page.waitForTimeout(Constants.TenThousand); //This static timeout required so that required queue will be populated in intraday insight 'Queue' dropdown

      const agentInsightsConversationStatusItem = await frame.waitForSelector(AgentChatConstants.IntraDayInsightConversationStatusQueueSelector, { timeout });
      await agentInsightsConversationStatusItem.focus();
      await this._page.waitForTimeout(Constants.DefaultTimeout); //This static timeout required so that queue selection popup will be kept in open state after focus
      await agentInsightsConversationStatusItem.click();
      await omniChanelAgentInsightSelector.click();
    } catch (error) {
      console.log(
        `Method FilterRecordsByAgentNameOverViewall throwing exception with message: ${error.message}`
      );
    }
    return false;
  }

  public async FilterRecordsByQueuesNameForOverViewPage(frame: any, QueueName: string, timeout: number = Constants.TenThousand) {
    try {
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.AgentInsightsAgentSelector, frame, Constants.One, Constants.FiveThousand);
      const agentInsightQueuetName = await frame.waitForSelector(AgentChatConstants.AgentInsightsQueueSelector, { timeout });
      await agentInsightQueuetName.click();
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.AgentInsightQueueTitleSelectionSelector, frame, Constants.One, Constants.FiveThousand);
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.AgentInsightQueueCheckboxSelectionSelector, frame, Constants.One, Constants.FiveThousand);
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.AgentInsightQueueInputSelector, frame, Constants.One, Constants.FiveThousand);
      const agentInsightsQueueInput1 = await frame.waitForSelector(AgentChatConstants.AgentInsightQueueInputSelectorLivechat, { timeout });
      await agentInsightsQueueInput1.click();
      const agentInsightsQueueInput = await frame.waitForSelector(AgentChatConstants.AgentInsightQueueInputSelector, { timeout });
      await agentInsightsQueueInput.fill("");
      await agentInsightsQueueInput.type(QueueName, { delay: 100 });
      await this._page.waitForTimeout(Constants.TenThousand); //This static timeout required so that required queue will be populated in intraday insight 'Queue' dropdown
      const agentInsightsConversationQueueStatusItem = await frame.waitForSelector(AgentChatConstants.AgentInsightConversationStatusQueueSelector, { timeout });
      await agentInsightsConversationQueueStatusItem.focus();
      await this._page.waitForTimeout(Constants.DefaultTimeout); //This static timeout required so that queue selection popup will be kept in open state after focus
      await agentInsightsConversationQueueStatusItem.click();

      const omniChanelAgentInsightSelector = await frame.waitForSelector(AgentChatConstants.DurationSelector, { timeout });
      await omniChanelAgentInsightSelector.click();
      await this.waitForScreenLoad(frame);
    } catch (error) {
      console.log(
        `Method FilterRecordsByQueuesNameForOverViewPage throwing exception with message: ${error.message}`
      );
    }
    return false;
  }

  public async VerifyAgentAndQueueSelection(
    frame: any,
    timeout: number = Constants.TenThousand
  ) {

    await this.waitUntilFrameSelectorIsVisible(
      SelectorConstants.AgentToolTip,
      frame,
      Constants.One,
      Constants.DefaultTimeout
    );
    const component = await frame.waitForSelector(
      SelectorConstants.AgentToolTip,
      { timeout }
    );
    return true;
  }

  public async VerifyQueuesMessagingTypeLiveChat(frame: any, queueName: string, timeout: number = Constants.TenThousand) {
    try {
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.AgentInsightsQueueSelector, frame, Constants.One, Constants.FiveThousand);
      const agentInsightQueuetName = await frame.waitForSelector(AgentChatConstants.AgentInsightsQueueSelector, { timeout });
      await agentInsightQueuetName.click();
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.AgentInsightQueueTitleSelectionSelector, frame, Constants.One, Constants.FiveThousand);
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.AgentInsightQueueCheckboxSelectionSelector, frame, Constants.One, Constants.FiveThousand);
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.AgentInsightQueueInputSelectorLivechat, frame, Constants.One, Constants.FiveThousand);
      const agentInsightsQueueInput = await frame.waitForSelector(AgentChatConstants.AgentInsightQueueInputSelectorLivechat, { timeout });
      const agentInsightsConversationQueueStatusItem1 = await frame.waitForSelector(AgentChatConstants.AgentInsightLivechatQueueSelectAllSelector, { timeout });
      await agentInsightsConversationQueueStatusItem1.focus();
      await this._page.waitForTimeout(Constants.DefaultTimeout);//This static timeout required so that queue selection popup will be kept in open state after focus
      const agentInsightsQueueInput1 = await frame.waitForSelector(AgentChatConstants.AgentInsightQueueInputSelectorLivechat, { timeout });
      await agentInsightsConversationQueueStatusItem1.click();
      await agentInsightsQueueInput.fill("");
      await agentInsightsQueueInput.type(queueName, { delay: 100 });
      await this._page.waitForTimeout(Constants.TenThousand);//This static timeout required so that required queue will be populated in intraday insight 'Queue' dropdown
      const agentInsightsConversationQueueStatusItem = await frame.waitForSelector(AgentChatConstants.AgentInsightQueueInputSelectorLivechat, { timeout });
      const agentInsightsConversationQueueItem = await agentInsightsConversationQueueStatusItem.textContent();
      if (agentInsightsConversationQueueItem !== queueName) {
        return false;
      }
    }
    catch (error) {
      console.log(`Method VerifyQueuesMessagingTypeLiveChat throwing exception with message: ${error.message}`);
      return true;
    }
  }

  public async VerifyQueuesMessagingTypeDigitalMsg(frame: any, queueName: string, timeout: number = Constants.TenThousand) {
    try {
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.AgentInsightsQueueSelector, frame, Constants.One, Constants.FiveThousand);
      const agentInsightQueuetName = await frame.waitForSelector(AgentChatConstants.AgentInsightsQueueSelector, { timeout });
      await agentInsightQueuetName.click();
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.AgentInsightQueueTitleSelectionSelector, frame, Constants.One, Constants.FiveThousand);
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.AgentInsightQueueCheckboxSelectionSelector, frame, Constants.One, Constants.FiveThousand);
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.AgentInsightQueueInputSelectorDigitalmsg, frame, Constants.One, Constants.FiveThousand);
      const agentInsightsQueueInput = await frame.waitForSelector(AgentChatConstants.AgentInsightQueueInputSelectorDigitalmsg, { timeout });
      const agentInsightsConversationQueueStatusItem1 = await frame.waitForSelector(AgentChatConstants.AgentInsightLivechatQueueSelectAllSelector, { timeout });
      await agentInsightsConversationQueueStatusItem1.focus();
      await this._page.waitForTimeout(Constants.DefaultTimeout);//This static timeout required so that queue selection popup will be kept in open state after focus
      const agentInsightsQueueInput1 = await frame.waitForSelector(AgentChatConstants.AgentInsightQueueInputSelectorDigitalmsg, { timeout });
      await agentInsightsConversationQueueStatusItem1.click();
      await agentInsightsQueueInput.fill("");
      await agentInsightsQueueInput.type(queueName, { delay: 100 });
      const agentInsightsConversationQueueStatusItem = await frame.waitForSelector(AgentChatConstants.AgentInsightQueueInputSelectorDigitalmsg, { timeout });
      const agentInsightsConversationQueueItem = await agentInsightsConversationQueueStatusItem.textContent();
      if (agentInsightsConversationQueueItem !== queueName) {
        return false;
      }
    }
    catch (error) {
      console.log(`Method VerifyQueuesMessagingTypeDigitalMsg throwing exception with message: ${error.message}`);
      return true;
    }
  }

  public async VerifyQueuesMessagingTypeVoice(frame: any, queueName: string, timeout: number = Constants.TenThousand) {
    try {
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.AgentInsightsQueueSelector, frame, Constants.One, Constants.FiveThousand);
      const agentInsightQueuetName = await frame.waitForSelector(AgentChatConstants.AgentInsightsQueueSelector, { timeout });
      await agentInsightQueuetName.click();
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.AgentInsightQueueTitleSelectionSelector, frame, Constants.One, Constants.FiveThousand);
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.AgentInsightQueueCheckboxSelectionSelector, frame, Constants.One, Constants.FiveThousand);
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.AgentInsightQueueInputSelectorDigitalmsg, frame, Constants.One, Constants.FiveThousand);
      const agentInsightsQueueInput = await frame.waitForSelector(AgentChatConstants.AgentInsightQueueInputSelectorDigitalmsg, { timeout });
      await agentInsightsQueueInput.click();
      const agentInsightsQueueInput1 = await frame.waitForSelector(AgentChatConstants.AgentInsightQueueInputSelectorDigitalmsg, { timeout });
      await agentInsightsQueueInput1.fill("");
      await agentInsightsQueueInput.type(queueName, { delay: 100 });
      await this._page.waitForTimeout(Constants.TenThousand);//This static timeout required so that required queue will be populated in intraday insight 'Queue' dropdown
      const agentInsightsConversationQueueStatusItem = await frame.waitForSelector(AgentChatConstants.AgentInsightLivechatQueueSelectAllSelector, { timeout });
      await agentInsightsConversationQueueStatusItem.focus();
      await this._page.waitForTimeout(Constants.DefaultTimeout);//This static timeout required so that queue selection popup will be kept in open state after focus
      await agentInsightsConversationQueueStatusItem.click();
      const agentInsightsConversationQueueItem = await frame.waitForSelector(AgentChatConstants.AgentInsightLivechatQueueSelectAllSelector, { timeout });
      const agentInsightsConversationQueueItemvoice = await agentInsightsConversationQueueItem.textContent();
      if (agentInsightsConversationQueueItemvoice == queueName) {
        return true;
      }
    }
    catch (error) {
      console.log(`Method VerifyQueuesMessagingTypeVoice throwing exception with message: ${error.message}`);
    }
  }
  public async ValidateOngoingMessage(frame: any) {
    try {
      expect(await frame.waitForSelector(SelectorConstants.OngoingConversationTitle)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.OngoingConversationAgent)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.OngoingConversationStatus)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.OngoingConversationTimeInCurrentStatus)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.OngoingConversationAction)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.OngoingConversationQueue)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.OngoingConversationChannel)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.OngoingConversationWorkStream)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.OngoingConversationFirstresponsetime)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.OngoingConversationAvgresponsetime)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.OngoingConversationTotalresponsetime)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.OngoingConversationtotalwaittime)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.OngoingConversationHandletime)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.OngoingConversationWraptime)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.OngoingConversationSentiment)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.OngoingConversationIncomingmessages)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.OngoingConversationOutgoingresponses)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.OngoingConversationIncomingmessagesOutSideBusinessHours)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.OngoingConversationTransfers)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.OngoingConversationEscalations)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.OngoingConversationCreatedon)).toBeTruthy();
      expect(await frame.waitForSelector(SelectorConstants.OngoingConversationConversationID)).toBeTruthy();
      return true;
    } catch (error) {
      console.log(`Method expectedFieldsInConversationForm throwing exception with message: ${error.message}`);
    }
  }

  public async socialProfileAtachedToChatValidation() {
    var isContactBtnAvailable = await this.waitUntilSelectorIsVisible(
      AgentChatConstants.ClickAvailableContact,
      Constants.Five,
      this._page,
      Constants.DefaultTimeout
    );
    if (!isContactBtnAvailable) {
      await this.waitUntilSelectorIsVisible(
        AgentChatConstants.CustomerLanguageInput,
        Constants.Five,
        this._page,
        Constants.DefaultTimeout
      );
      await this._page.hover(AgentChatConstants.CustomerLanguageInput);
      await this._page.focus(AgentChatConstants.CustomerLanguageInput);
      const contactInput = await this.Page.waitForSelector(
        AgentChatConstants.CustomerLanguageInput
      );
      await contactInput.fill(this.contactRecordName);
      await this.Page.click(AgentChatConstants.CustomerLanguageSearch);
      await this.waitUntilSelectorIsVisible(
        AgentChatConstants.CustomerLanguageLookupValue.replace(
          "{0}",
          this.contactRecordName
        ),
        Constants.Five,
        this._page,
        Constants.DefaultTimeout
      );
      await this.Page.click(
        AgentChatConstants.CustomerLanguageLookupValue.replace(
          "{0}",
          this.contactRecordName
        )
      );
    }
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.ClickonLookupSelectedValue,
      Constants.Five,
      this._page,
      Constants.DefaultTimeout
    );
    await this.Page.click(AgentChatConstants.ClickonLookupSelectedValue);
    await this.waitForDomContentLoaded();
    await this.waitUntilSelectorIsVisible(AgentChatConstants.RelatedTab);
    await this.Page.click(AgentChatConstants.RelatedTab);
    const entityListItem = await this.Page.waitForSelector(
      AgentChatConstants.SocialProfile
    );
    await entityListItem.click();
    const customerFlag = await this.waitUntilSelectorIsVisible(
      AgentChatConstants.SocialProfileFacebookCustomerName,
      Constants.Three,
      this._page,
      Constants.MaxTimeout
    );
    const sessionProfileTitle = await this.waitUntilSelectorIsVisible(
      AgentChatConstants.SocialProfileFaceBookTitleSelector,
      Constants.Three,
      this._page,
      Constants.MaxTimeout
    );
    if (customerFlag) {
      const customer = await this.Page.waitForSelector(
        AgentChatConstants.SocialProfileFacebookCustomerName
      );
      const customerName = await customer.textContent();
      const sessionTitle = await this.waitUntilSelectorIsVisible(
        AgentChatConstants.SocialProfileCustomerTitleSelector.replace(
          "{0}",
          customerName
        ),
        Constants.Three,
        this._page,
        Constants.MaxTimeout
      );
      const sessionProfileTitle = await this.waitUntilSelectorIsVisible(
        AgentChatConstants.SocialProfileFaceBookTitleSelector,
        Constants.Three,
        this._page,
        Constants.MaxTimeout
      );
      return sessionTitle || sessionProfileTitle;
    } else if (sessionProfileTitle) {
      return true;
    } else {
      return false;
    }
  }

  public async VerifyAgentInsightsTabOrder(frame: any) {
    try {
      const AgentInsightsAllTabText = await frame.waitForSelector(SelectorConstants.AgentInsightsAllTab);
      const AgentInsightsAllText = await AgentInsightsAllTabText.textContent();
      expect(AgentInsightsAllText.includes(SelectorConstants.AgentInsightsAllTabText)).toBeTruthy();
      const AgentInsightsLiveChatTabText = await frame.waitForSelector(SelectorConstants.AgentInsightsLiveChatTab);
      const AgentInsightsLiveChatText = await AgentInsightsLiveChatTabText.textContent();
      expect(AgentInsightsLiveChatText.includes(SelectorConstants.AgentInsightsLiveChatTabText)).toBeTruthy();
      const AgentInsightsDigitalMessagingTabText = await frame.waitForSelector(SelectorConstants.AgentInsightsDigitalMessagingTab);
      const AgentInsightsDigitalMessagingText = await AgentInsightsDigitalMessagingTabText.textContent();
      expect(AgentInsightsDigitalMessagingText.includes(SelectorConstants.AgentInsightsDigitalMessagingTabText)).toBeTruthy();
      const AgentInsightsVoiceTabText = await frame.waitForSelector(SelectorConstants.AgentInsightsVoiceTab);
      const AgentInsightsVoiceText = await AgentInsightsVoiceTabText.textContent();
      expect(AgentInsightsVoiceText.includes(SelectorConstants.AgentInsightsVoiceTabText)).toBeTruthy();
    }
    catch (error) {
      console.log(`Method VerifyAgentInsightsTabOrder throwing exception with message: ${error.message}`);
    }
  }

  public async VerifyAgentInsightsTooltipforALL(frame: any) {
    try {
      const AgentsloggedinTooltipText = await frame.waitForSelector(SelectorConstants.AgentInsightsAllAgentsloggedToolTip);
      const AgentsloggedinTooltipValue = await AgentsloggedinTooltipText.getAttribute("aria-label");
      expect(AgentsloggedinTooltipValue.includes(SelectorConstants.AgentInsightsAgentsloggedToolTipText)).toBeTruthy();
      const AgentsAvailableCapacityTooltipText = await frame.waitForSelector(SelectorConstants.AgentInsightsAllAgentsAvailableCapacityToolTip);
      const AgentsAvailableCapacityTooltipValue = await AgentsAvailableCapacityTooltipText.getAttribute("aria-label");
      expect(AgentsAvailableCapacityTooltipValue.includes(SelectorConstants.AgentInsightsAgentsAvailableCapacityToolTipText)).toBeTruthy();
      const AgentsHandleTimeTooltipText = await frame.waitForSelector(SelectorConstants.AgentInsightsAllAgentsHandleTimeToolTip);
      const AgentsHandleTimeTooltipValue = await AgentsHandleTimeTooltipText.getAttribute("aria-label");
      expect(AgentsHandleTimeTooltipValue.includes(SelectorConstants.AgentInsightsAgentsHandleTimeToolTipText)).toBeTruthy();
      const AgentSessionTransferTooltipText = await frame.waitForSelector(SelectorConstants.AgentInsightsAllAgentSessionTransferToolTip);
      const AgentSessionTransferTooltipValue = await AgentSessionTransferTooltipText.getAttribute("aria-label");
      expect(AgentSessionTransferTooltipValue.includes(SelectorConstants.AgentInsightsAgentSessionTransferToolTipText)).toBeTruthy();
      const AgentSessionRejectTooltipText = await frame.waitForSelector(SelectorConstants.AgentInsightsAllAgentSessionRejectToolTip);
      const AgentSessionRejectTooltipValue = await AgentSessionRejectTooltipText.getAttribute("aria-label");
      expect(AgentSessionRejectTooltipValue.includes(SelectorConstants.AgentInsightsAgentSessionRejectToolTipText)).toBeTruthy();
      const AgentSessionTimeoutTooltipText = await frame.waitForSelector(SelectorConstants.AgentInsightsAllAgentSessionTimeoutToolTip);
      const AgentSessionTimeoutTooltipValue = await AgentSessionTimeoutTooltipText.getAttribute("aria-label");
      expect(AgentSessionTimeoutTooltipValue.includes(SelectorConstants.AgentInsightsAgentSessionTimeoutToolTipText)).toBeTruthy();
      return true;
    }
    catch (error) {
      console.log(`Method VerifyAgentInsightsTooltipforALL throwing exception with message: ${error.message}`);
      return false;
    }
  }

  public async VerifyAgentInsightsTooltipforLiveChat(frame: any) {
    try {
      const AgentsloggedinTooltipText = await frame.waitForSelector(SelectorConstants.AgentInsightsAllAgentsloggedToolTip);
      const AgentsloggedinTooltipValue = await AgentsloggedinTooltipText.getAttribute("aria-label");
      expect(AgentsloggedinTooltipValue.includes(SelectorConstants.AgentInsightsAgentsloggedToolTipText)).toBeTruthy();
      const AgentsAvailableCapacityTooltipText = await frame.waitForSelector(SelectorConstants.AgentInsightsAllAgentSessionRejectToolTip);
      const AgentsAvailableCapacityTooltipValue = await AgentsAvailableCapacityTooltipText.getAttribute("aria-label");
      expect(AgentsAvailableCapacityTooltipValue.includes(SelectorConstants.AgentInsightsAgentsAvailableCapacityToolTipText)).toBeTruthy();
      const AgentsHandleTimeTooltipText = await frame.waitForSelector(SelectorConstants.AgentInsightsAllAgentSessionTimeoutToolTip);
      const AgentsHandleTimeTooltipValue = await AgentsHandleTimeTooltipText.getAttribute("aria-label");
      expect(AgentsHandleTimeTooltipValue.includes(SelectorConstants.AgentInsightsAgentsHandleTimeToolTipText)).toBeTruthy();
      const AgentSessionTransferTooltipText = await frame.waitForSelector(SelectorConstants.AgentInsightsAllAgentsAvailableCapacityToolTip);
      const AgentSessionTransferTooltipValue = await AgentSessionTransferTooltipText.getAttribute("aria-label");
      expect(AgentSessionTransferTooltipValue.includes(SelectorConstants.AgentInsightsAgentSessionTransferRateToolTipText)).toBeTruthy();
      const AgentSessionRejectTooltipText = await frame.waitForSelector(SelectorConstants.AgentInsightsAllAgentsHandleTimeToolTip);
      const AgentSessionRejectTooltipValue = await AgentSessionRejectTooltipText.getAttribute("aria-label");
      expect(AgentSessionRejectTooltipValue.includes(SelectorConstants.AgentInsightsAgentSessionRejectedToolTipText)).toBeTruthy();
      const AgentSessionTimeoutTooltipText = await frame.waitForSelector(SelectorConstants.AgentInsightsAllAgentSessionTransferToolTip);
      const AgentSessionTimeoutTooltipValue = await AgentSessionTimeoutTooltipText.getAttribute("aria-label");
      expect(AgentSessionTimeoutTooltipValue.includes(SelectorConstants.AgentInsightsAgentSessionTimeoutRateToolTipText)).toBeTruthy();
      return true;
    }
    catch (error) {
      console.log(`Method VerifyAgentInsightsTooltipforLiveChat throwing exception with message: ${error.message}`);
      return false;
    }
  }

  public async VerifyAgentInsightsTooltipforDigitalMessaging(frame: any) {
    try {
      const AgentsloggedinTooltipText = await frame.waitForSelector(SelectorConstants.AgentInsightsAllAgentsloggedToolTip);
      const AgentsloggedinTooltipValue = await AgentsloggedinTooltipText.getAttribute("aria-label");
      expect(AgentsloggedinTooltipValue.includes(SelectorConstants.AgentInsightsAgentsloggedToolTipText)).toBeTruthy();
      const AgentsAvailableCapacityTooltipText = await frame.waitForSelector(SelectorConstants.AgentInsightsAllAgentSessionTransferToolTip);
      const AgentsAvailableCapacityTooltipValue = await AgentsAvailableCapacityTooltipText.getAttribute("aria-label");
      expect(AgentsAvailableCapacityTooltipValue.includes(SelectorConstants.AgentInsightsAgentsAvailableCapacityToolTipText)).toBeTruthy();
      const AgentsHandleTimeTooltipText = await frame.waitForSelector(SelectorConstants.AgentInsightsAllAgentsAvailableCapacityToolTip);
      const AgentsHandleTimeTooltipValue = await AgentsHandleTimeTooltipText.getAttribute("aria-label");
      expect(AgentsHandleTimeTooltipValue.includes(SelectorConstants.AgentInsightsAgentsHandleTimeToolTipText)).toBeTruthy();
      const AgentSessionTransferTooltipText = await frame.waitForSelector(SelectorConstants.AgentInsightsAllAgentsHandleTimeToolTip);
      const AgentSessionTransferTooltipValue = await AgentSessionTransferTooltipText.getAttribute("aria-label");
      expect(AgentSessionTransferTooltipValue.includes(SelectorConstants.AgentInsightsAgentSessionTransferRateToolTipText)).toBeTruthy();
      const AgentSessionRejectTooltipText = await frame.waitForSelector(SelectorConstants.AgentInsightsAllAgentSessionRejectToolTip);
      const AgentSessionRejectTooltipValue = await AgentSessionRejectTooltipText.getAttribute("aria-label");
      expect(AgentSessionRejectTooltipValue.includes(SelectorConstants.AgentInsightsAgentSessionRejectedToolTipText)).toBeTruthy();
      const AgentSessionTimeoutTooltipText = await frame.waitForSelector(SelectorConstants.AgentInsightsAllAgentSessionTimeoutToolTip);
      const AgentSessionTimeoutTooltipValue = await AgentSessionTimeoutTooltipText.getAttribute("aria-label");
      expect(AgentSessionTimeoutTooltipValue.includes(SelectorConstants.AgentInsightsAgentSessionTimeoutRateToolTipText)).toBeTruthy();
      return true;
    }
    catch (error) {
      console.log(`Method VerifyAgentInsightsTooltipforDigitalMessaging throwing exception with message: ${error.message}`);
      return false;
    }
  }

  public async initiateVideoCall() {
    const iframeCC = await IFrameHelper.GetIframe(
      this._page,
      IFrameConstants.IframeCC
    );
    await iframeCC.$eval(AgentConversationPageConstants.EscalateCall, (el) =>
      (el as HTMLElement).click()
    );
    await iframeCC.waitForSelector(
      AgentConversationPageConstants.VideoCallClick
    );

    await iframeCC.$eval(AgentConversationPageConstants.VideoCallClick, (el) =>
      (el as HTMLElement).click()
    );
  }

  public async verifyVideoEnableStatus(locator: string) {
    const iframeCC = await IFrameHelper.GetIframe(this._page, IFrameConstants.IframeCC);
    const state = await iframeCC.waitForSelector(locator);
    return state;
  }

  public async disableVideoCall() {
    const iframeCC = await IFrameHelper.GetIframe(
      this._page,
      IFrameConstants.IframeCC
    );
    await iframeCC.$eval(AgentConversationPageConstants.VideoWidget, (el) =>
      (el as HTMLElement).click()
    );
    await this.waitForDomContentLoaded();
  }

  public async resolveandDeleteCase() {
    await this.Page.waitForSelector(
      CustomConstants.ResolveCaseClickButton
    );
    await this.Page.click(CustomConstants.ResolveCaseClickButton);
    await this.Page.fill(CustomConstants.ResolutionDesciption, "Case Resolved");
    await this.Page.waitForSelector(CustomConstants.ResolveBtn);
    await this.Page.waitForTimeout(Constants.DefaultTimeout);
    await this.Page.click(CustomConstants.ResolveBtn);
    const DeleteCaseRecord = await this.Page.waitForSelector(CustomConstants.DeleteCase);
    await DeleteCaseRecord.focus();
    await DeleteCaseRecord.click();
    await this.Page.click(CustomConstants.ConfirmButton);
    await this.Page.waitForTimeout(Constants.DefaultTimeout);
  }

  public async RefreshPowerBiDashboard() {
    await this.waitUntilSelectorIsVisible(
      SelectorConstants.PowerBiPageRefresh,
      AgentChatConstants.Two,
      this.Page,
      AgentChatConstants.FiveThousandsMiliSecondsWaitTimeout
    );
    await this.Page.click(SelectorConstants.PowerBiPageRefresh);
  }

  public async ValidateDigitalMessaging(frame: any) {
    await this.waitUntilFrameSelectorIsVisible(SelectorConstants.OngoingConversationStatus, frame, Constants.One, Constants.DefaultTimeout);
    const CloseStatus = await frame.waitForSelector(SelectorConstants.OngoingConversationStatus);
    const ChatTitle1 = await CloseStatus.innerText();
    if (ChatTitle1 !== AgentChatConstants.Closed) {
      return true;
    }
    return false;
  }

  public async NavigatetoConversationInsightDigitalmessageDashboard(frame: any) {
    await this.waitUntilSelectorIsVisible(
      SelectorConstants.OmniChannelIntradayInsights,
      AgentChatConstants.Two,
      this.Page,
      AgentChatConstants.FiveThousandsMiliSecondsWaitTimeout
    );
    await this.Page.click(SelectorConstants.IntradayInsightsDropDown);
    await this.Page.click(SelectorConstants.ConversationInsight);
    await this.waitForScreenLoad(frame);
    await frame.click(SelectorConstants.ConversationInsightsDigitalMessage);
    await this.waitForScreenLoad(frame);
  }
  public async FilterItemsByConversationInsigitsLivechatPageQueueMetrics(frame: any, queueName: string) {
    await this.FilterRecordsByQueuesNameFromLiveChat(frame, queueName);
  }
  public async FilterItemsByConversationInsigitsDigitalMessagePageQueueMetrics(frame: any, queueName: string) {
    await this.FilterRecordsByDigitalMessagePageQueuesName(frame, queueName);
  }
  public async ValidateOverViewPageAvrTimeReponce(frame: any) {
    await this.waitUntilFrameSelectorIsVisible(SelectorConstants.AveragefirstresponsetimeOVLiveChat, frame, Constants.One, Constants.DefaultTimeout);
    const FirstResponsetime = await frame.waitForSelector(SelectorConstants.AveragefirstresponsetimeOVLiveChat);
    const Averagefirstresponsetime = await FirstResponsetime.innerText();
    await this.waitUntilFrameSelectorIsVisible(SelectorConstants.AverageresponsetimeOVLiveChat, frame, Constants.One, Constants.DefaultTimeout);
    const Responsetime = await frame.waitForSelector(SelectorConstants.AverageresponsetimeOVLiveChat);
    const Averageresponsetime = await Responsetime.innerText();
    return true;
  }
  public async ValidateLiveChatPageAvrTimeReponce(frame: any) {
    await this.waitUntilFrameSelectorIsVisible(SelectorConstants.AveragefirstresponsetimeLiveChat, frame, Constants.One, Constants.DefaultTimeout);
    const FirstResponsetime = await frame.waitForSelector(SelectorConstants.AveragefirstresponsetimeLiveChat);
    const Averagefirstresponsetime = await FirstResponsetime.innerText();
    await this.waitUntilFrameSelectorIsVisible(SelectorConstants.AverageresponsetimeLiveChat, frame, Constants.One, Constants.DefaultTimeout);
    const Responsetime = await frame.waitForSelector(SelectorConstants.AverageresponsetimeLiveChat);
    const Averageresponsetime = await Responsetime.innerText();
    return true;
  }
  public async FilterRecordsByQueuesNameFromLiveChat(frame: any, queueName: string, timeout: number = Constants.TenThousand) {
    try {
      await this.waitUntilFrameSelectorIsVisible(SelectorConstants.ConversationInsightsQueueSelector, frame, Constants.One, Constants.FiveThousand);
      const agentInsightQueuetName = await frame.waitForSelector(SelectorConstants.ConversationInsightsQueueSelector, { timeout });
      await agentInsightQueuetName.click();
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.AgentInsightQueueTitleSelectionSelector, frame, Constants.One, Constants.FiveThousand);
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.AgentInsightQueueCheckboxSelectionSelector, frame, Constants.One, Constants.FiveThousand);
      const agentInsightsQueueInput = await frame.waitForSelector(AgentChatConstants.LivechatPageQueueInputselector, { timeout });
      await agentInsightsQueueInput.fill("");
      await agentInsightsQueueInput.type(queueName, { delay: 100 });

      await this._page.waitForTimeout(Constants.TenThousand);//This static timeout required so that required queue will be populated in intraday insight 'Queue' dropdown
      const agentInsightsConversationStatusItem = await frame.waitForSelector(AgentChatConstants.DigitalQueueSelector.replace("{0}", queueName), { timeout });
      await agentInsightsConversationStatusItem.focus();
      await this._page.waitForTimeout(Constants.DefaultTimeout);//This static timeout required so that queue selection popup will be kept in open state after focus
      await agentInsightsConversationStatusItem.click();
      await this.waitUntilFrameSelectorIsVisible(SelectorConstants.LivechatPageIdentitySelector, frame, Constants.One, Constants.DefaultTimeout);
      const omniChanelConversationDigitalMsgSelector1 = await frame.waitForSelector(SelectorConstants.LivechatPageIdentitySelector, { timeout })
      await omniChanelConversationDigitalMsgSelector1.click();
      await this.waitUntilFrameSelectorIsVisible(
        SelectorConstants.AvgFirstandresponceLiveChatselect,
        frame,
        Constants.One,
        Constants.FiveThousand
      );
      const AvgResponcetime = await frame.waitForSelector(
        SelectorConstants.AvgFirstandresponceLiveChatselect);
      await AvgResponcetime.click({ button: "right" });
      const selectTable = await frame.waitForSelector(
        SelectorConstants.SelectTableSelector
      );
      await selectTable.click();
    }
    catch (error) {
      console.log(`Method FilterRecordsByQueueName throwing exception with message: ${error.message}`);
    }
    return false;
  }
  public async FilterRecordsByDigitalMessagePageQueuesName(frame: any, queueName: string, timeout: number = Constants.TenThousand) {
    try {
      await this.waitUntilFrameSelectorIsVisible(SelectorConstants.SLAFirstResponseTime, frame, Constants.One, Constants.DefaultTimeout);
      const omniChanelConversationDigitalMsgSelector = await frame.waitForSelector(SelectorConstants.SLAFirstResponseTime, { timeout });
      await omniChanelConversationDigitalMsgSelector.click();
      await this._page.waitForTimeout(Constants.DefaultTimeout);//This static timeout required so that if queue selection popup remains in open state during failed run so before retrying queue filtration it will close
      await this.waitUntilFrameSelectorIsVisible(SelectorConstants.ConversationInsightsQueueSelector, frame, Constants.One, Constants.FiveThousand);
      const agentConversationInsightQueueName = await frame.waitForSelector(SelectorConstants.ConversationInsightsQueueSelector, { timeout });
      await agentConversationInsightQueueName.click();
      await this.waitForScreenLoad(frame);
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.IntraDayInsightQueueSelectionSelector, frame, Constants.One, Constants.FiveThousand);
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.IntraDayInsightQueueTitleSelectionSelector, frame, Constants.One, Constants.FiveThousand);
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.IntraDayInsightQueueCheckboxSelectionSelector, frame, Constants.One, Constants.FiveThousand);
      await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.IntraDayInsightQueueInputSelector, frame, Constants.One, Constants.FiveThousand);
      const ConversationQueueInput = await frame.waitForSelector(AgentChatConstants.DigitalMessageQueueInputSelector, { timeout });
      await ConversationQueueInput.fill("");
      await ConversationQueueInput.type(queueName, { delay: 100 });
      await this._page.waitForTimeout(Constants.TenThousand);//This static timeout required so that required queue will be populated in intraday insight 'Queue' dropdown
      const agentInsightsConversationStatusItem = await frame.waitForSelector(AgentChatConstants.DigitalQueueSelector.replace("{0}", queueName), { timeout });
      await agentInsightsConversationStatusItem.focus();
      await this._page.waitForTimeout(Constants.DefaultTimeout);//This static timeout required so that queue selection popup will be kept in open state after focus
      await agentInsightsConversationStatusItem.click();
      const omniChanelConversationDigitalMsgSelector1 = await frame.waitForSelector(SelectorConstants.SLAFirstResponseTime, { timeout })
      await omniChanelConversationDigitalMsgSelector1.click();
      await this.waitUntilFrameSelectorIsVisible(
        SelectorConstants.AvgFirstandresponceDigitalPageselect,
        frame,
        Constants.One,
        Constants.FiveThousand
      );
      const AvgResponcetime = await frame.waitForSelector(
        SelectorConstants.AvgFirstandresponceDigitalPageselect);
      await AvgResponcetime.click({ button: "right" });
      const selectTable = await frame.waitForSelector(
        SelectorConstants.SelectTableSelector
      );
      await selectTable.click();
    }
    catch (error) {
      console.log(`Method FilterRecordsByAgentName throwing exception with message: ${error.message}`);
    }
    return false;
  }
  public async ValidateDigitalMsgPageAvrTimeReponce(frame: any) {
    await this.waitUntilFrameSelectorIsVisible(SelectorConstants.AveragefirstresponsetimeDigitalMsg, frame, Constants.One, Constants.DefaultTimeout);
    const FirstResponsetime = await frame.waitForSelector(SelectorConstants.AveragefirstresponsetimeDigitalMsg);
    const Averagefirstresponsetime = await FirstResponsetime.innerText();
    await this.waitUntilFrameSelectorIsVisible(SelectorConstants.AverageresponsetimeDigitalMsg, frame, Constants.One, Constants.DefaultTimeout);
    const Responsetime = await frame.waitForSelector(SelectorConstants.AverageresponsetimeDigitalMsg);
    const Averageresponsetime = await Responsetime.innerText();
    return true;
  }

  public async TriggerandVerifytquickreplies() {
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    await iframe.waitForSelector(AgentChatConstants.QuickReplies);
    await iframe.$eval(AgentChatConstants.QuickReplies, (el) => {
      (el as HTMLElement).click();
    });
    await iframe.waitForSelector(AgentChatConstants.QuickRepliesviewall);
    await iframe.$eval(AgentChatConstants.QuickRepliesviewall, (el) => {
      (el as HTMLElement).click();
      (el as HTMLElement).click();
    });
  }

  public async validateConversationChatSDKTranscript(message: string) {
    let result: boolean = false;
    await this.waitForDomContentLoaded();
    await this.waitUntilSelectorIsVisible(
      SelectorConstants.TranscriptIFrame,
      AgentChatConstants.Three
    );
    const IFrame1 = await this.Page.$(SelectorConstants.TranscriptIFrame);
    const IFrame2 = await IFrame1.contentFrame();
    const transcriptmessage = await IFrame2.waitForSelector(
      AgentChatConstants.ChatSDKTranscriptText
    );
    const value = await transcriptmessage.textContent();
    if (value.includes(message)) {
      return true;
    }
    if (result) {
      console.info(
        "Message '{0}' found in method 'validateConversationTranscript'".replace(
          "{0}",
          message
        )
      );
    } else {
      console.info(
        "Message '{0}' not found in method 'validateConversationTranscript'".replace(
          "{0}",
          message
        )
      );
    }
    return result;
  }

  public async ValidateAgentAverageHandleTime(
    frame: any,
    averageHandleTime: number
  ) {
    await this.waitUntilFrameSelectorIsVisible(
      SelectorConstants.AverageHandleTimeGridSelector,
      frame,
      Constants.One,
      Constants.TenThousand
    );
    const averageHandleTimeSelector = await frame.waitForSelector(SelectorConstants.AverageHandleTimeGridSelector);
    let averageHandleTimeValue = await averageHandleTimeSelector.textContent();
    averageHandleTimeValue = averageHandleTimeValue.replace(",", "");
    if (averageHandleTimeValue >= averageHandleTime) {
      return true;
    }
    return false;
  }
  public async FilterIntraDayRecordsByQueueName(
    selectorVal: string,
    frame: any,
    queueName: string,
    timeout: number = Constants.TenThousand
  ) {
    try {
      await this.waitUntilFrameSelectorIsVisible(
        AgentChatConstants.AgentInsightsAgentSelector,
        frame,
        Constants.One,
        Constants.FiveThousand
      );
      const agentInsightQueuetName = await frame.waitForSelector(
        AgentChatConstants.AgentInsightsQueueSelector,
        { timeout }
      );
      await agentInsightQueuetName.click();
      await this.waitForScreenLoad(frame);
      await this.waitUntilFrameSelectorIsVisible(
        AgentChatConstants.AgentInsightQueueTitleSelectionSelector,
        frame,
        Constants.One,
        Constants.FiveThousand
      );
      await this.waitUntilFrameSelectorIsVisible(
        AgentChatConstants.AgentInsightQueueCheckboxSelectionSelector,
        frame,
        Constants.One,
        Constants.FiveThousand
      );
      await this.waitUntilFrameSelectorIsVisible(
        AgentChatConstants.AgentInsightQueueInputSelector,
        frame,
        Constants.One,
        Constants.FiveThousand
      );
      const agentInsightsQueueInput = await frame.waitForSelector(
        AgentChatConstants.AgentInsightQueueInputSelector,
        { timeout }
      );
      await agentInsightsQueueInput.fill("");
      await agentInsightsQueueInput.type(queueName, { delay: 100 });
      await this.waitForScreenLoad(frame);
      await this._page.waitForTimeout(Constants.TenThousand); //This static timeout required so that required queue will be populated in intraday insight 'Queue' dropdown

      const agentInsightsConversationQueueStatusItem =
        await frame.waitForSelector(
          AgentChatConstants.AgentInsightConversationStatusQueueNameSelector.replace("{0}", queueName),
          { timeout }
        );
      await agentInsightsConversationQueueStatusItem.focus();
      await this._page.waitForTimeout(Constants.DefaultTimeout); //This static timeout required so that queue selection popup will be kept in open state after focus

      await agentInsightsConversationQueueStatusItem.click();
      await this.waitForScreenLoad(frame);
      await this.waitUntilFrameSelectorIsVisible(
        AgentChatConstants.DurationSelector,
        frame,
        Constants.One,
        Constants.DefaultTimeout
      );
      const omniChanelAgentInsightSelector = await frame.waitForSelector(
        AgentChatConstants.DurationSelector,
        { timeout }
      );
      await omniChanelAgentInsightSelector.click();
      await this.waitForScreenLoad(frame);
      const queueSelector = await frame.waitForSelector(selectorVal, {
        timeout,
      });
      const entityItemText = await queueSelector.textContent();
      if (entityItemText.startsWith(queueName)) {
        return true;
      }
    } catch (error) {
      console.log(
        `Method FilterRecordsByQueueName throwing exception with message: ${error.message}`
      );
    }
    return false;
  }

  public async validateUpdatedAccountName(ExpectedAccount: string) {
    const UpdatedContactName = await this._page.waitForSelector(
      AgentChatConstants.UpdatedContactName1
    );
    let title = await UpdatedContactName.innerText();
    return ExpectedAccount === title;
  }

  public async validateAccountCityName(ExpectedCity: string) {
    await this._page.waitForSelector(
      AgentChatConstants.UpdatedContactCity
    );
    const actualCity = await this._page.$eval(AgentChatConstants.UpdatedContactCity, el => (el as HTMLInputElement).value);
    return actualCity === ExpectedCity;
  }

  public async customerDetailsAvailableInCustomerSummary() {
    return await this.waitUntilSelectorIsVisible(
      AgentChatConstants.SearchCustomerInputSelector,
      Constants.Three,
      null,
      Constants.MaxTimeout
    );
  }

  public async caseDetailsAvailableInCustomerSummary() {
    return await this.waitUntilSelectorIsVisible(
      AgentChatConstants.SearchCaseInputSelector,
      Constants.Three,
      null,
      Constants.MaxTimeout
    );
  }

  public async verifyInactiveStatusPresent() {
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.AvailabilityStatusBusyXPath,
      AgentChatConstants.Five,
      null,
      AgentChatConstants.FiveThousandsMiliSecondsWaitTimeout
    );
    await this._page.click(AgentChatConstants.AgentStatusButton);
    let options = [];
    while (options.length < 1) {
      options = await this._page.$$(AgentChatConstants.SelectStatusElementOptions);
    }
    for (let option in options) {
      let value = await options[option].innerText();
      if (value === AgentChatConstants.Inactive.toString()) {
        return true;
      }
    }
    return false;
  }

  public async validateAgentSkill(skill: string) {
    const message = skill;
    await this.waitForDomContentLoaded();
    const title = await this.Page.waitForSelector(
      CustomConstants.CaseSkill
    );
    const currentName = await this._page.$eval(CustomConstants.CaseSkill, el => (el as HTMLInputElement).value);
    return message === currentName;
  }

  public async validateMultipleSkills(skillOne: string, SkillTwo: string) {
    const message = skillOne;
    await this.waitForDomContentLoaded();
    const title = await this.Page.waitForSelector(
      CustomConstants.CaseSkill
    );
    const currentName = await this._page.$eval(CustomConstants.CaseSkill, el => (el as HTMLInputElement).value);
    if (message == currentName) {
      const message1 = SkillTwo;
      const title = await this.Page.waitForSelector(
        CustomConstants.CaseSkillTwo
      );
      const currentName1 = await this._page.$eval(CustomConstants.CaseSkillTwo, el => (el as HTMLInputElement).value);
      return message1 === currentName1;
    }
    else {
      return false;
    }
  }

  public async ValidateQuickReplyPreview() {
    return this.waitUntilSelectorIsVisible(AgentChatConstants.QuickReplyPreview);
  }
  
  public async refreshInbox() {
    await this.Page.waitForSelector(AgentChatConstants.RefreshInbox);
    await this.Page.click(AgentChatConstants.RefreshInbox);
  }

  public async acceptInboxChat(uniqueMessage: string, FooterNotification: boolean, timeout?: number, shouldwaitForConversationControl: boolean = true) {
    await this.waitUntilSelectorIsVisible(AgentChatConstants.AcceptButtonId, AgentChatConstants.Four, null, timeout || AgentChatConstants.ThrityFiveThousandMiliSeconds);
    await this._page.click(AgentChatConstants.AcceptButtonId);
    if (FooterNotification) {
      expect(this.VerifyInboxFooterNotification()).toBeTruthy();
    }
    await this.Page.click(AgentChatConstants.InboxSelector);
    await this.Page.waitForSelector(AgentChatConstants.InboxNotification);
    await this.Page.click(AgentChatConstants.InboxNotification);
  }

  public async VerifyTransferAgent(AgentName: string) {
    if (AgentName === AgentChatConstants.InboxAgentName) {
      return true;
    }
    else {
      return false;
    }
  }

  public async ValidateInboxCardMessages(Messages: string, InboxMessagesSelectors: string) {
    await this.refreshInbox();
    const AgentMessage = await this.Page.waitForSelector(InboxMessagesSelectors);
    const InboxCradMeassage = await AgentMessage.textContent();
    if (InboxCradMeassage === Messages) {
      return true;
    }
    else {
      return false;
    }
  }

  public async CloseInboxchat() {
    const iframeCC = await IFrameHelper.GetIframe(
      this._page,
      IFrameConstants.IframeCC
    );
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.InboxchatEndSelector,
      AgentChatConstants.Three,
      iframeCC
    );
    await iframeCC.$eval(AgentChatConstants.InboxchatEndSelector, (el) =>
      (el as HTMLElement).click()
    );
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.InboxchatcloseSelector,
      AgentChatConstants.Three,
      iframeCC
    );
    await iframeCC.$eval(AgentChatConstants.InboxchatcloseSelector, (el) =>
      (el as HTMLElement).click()
    );
  }

  public async VerifyTransferQueue(QueueName: string) {
    const Inboxqueue = await this.Page.waitForSelector(AgentChatConstants.InboxTeamsPWDefaultTeamsQueue);
    const Inboxqueuename = await Inboxqueue.textContent();
    if (Inboxqueuename.includes(QueueName)) {
      return true;
    }
    else {
      return false;
    }
  }

  public async VerifyInboxFooterNotification() {
    const FooterNotification = await this.Page.waitForSelector(AgentChatConstants.InboxFooterNotificationSelector);
    const InboxNotification = await FooterNotification.textContent();
    if (InboxNotification === AgentChatConstants.InboxchatNotMessage) {
      return true;
    }
    else {
      return false;
    }
  }
  public async inboxSection() {
    await this.Page.waitForLoadState("domcontentloaded");
    await this.Page.click(SelectorConstants.InboxLabel);

  }

  public async HomePageSection() {
    await this.Page.waitForLoadState("domcontentloaded");
    await this.Page.click(SelectorConstants.HomePagelabel);
  }

  public async navigateToUnassignedConversation() {
    await this.waitUntilSelectorIsVisible(
      SelectorConstants.ConversationDropdown,
      AgentChatConstants.Four,
      null, AgentChatConstants.ThrityFiveThousandMiliSeconds);
    await this._page.click(SelectorConstants.ConversationDropdown);

    await this.waitUntilSelectorIsVisible(
      SelectorConstants.UnassignedConversations,
      AgentChatConstants.Four,
      null, AgentChatConstants.ThrityFiveThousandMiliSeconds);
    await this._page.click(SelectorConstants.UnassignedConversations);

  }

  public async navigateToCases() {
    await this.waitUntilSelectorIsVisible(
      SelectorConstants.ConversationDropdown,
      AgentChatConstants.Four,
      null, AgentChatConstants.ThrityFiveThousandMiliSeconds);
    await this._page.click(SelectorConstants.ConversationDropdown);

    await this.waitUntilSelectorIsVisible(
      SelectorConstants.InboxCases,
      AgentChatConstants.Four,
      null, AgentChatConstants.ThrityFiveThousandMiliSeconds);
    await this._page.click(SelectorConstants.InboxCases);

  }

  public async navigateToSearch() {
    await this.waitUntilSelectorIsVisible(
      SelectorConstants.InboxSearch,
      AgentChatConstants.Four,
      null, AgentChatConstants.ThrityFiveThousandMiliSeconds);
    await this._page.click(SelectorConstants.InboxSearch);
  }

  public async navigateToNewOpenSession() {
    await this.waitUntilSelectorIsVisible(
      SelectorConstants.OpenNewSession,
      AgentChatConstants.Four,
      null, AgentChatConstants.ThrityFiveThousandMiliSeconds);
    await this._page.click(SelectorConstants.OpenNewSession);
  }

  public async selTeamsPickRecord() {
    await this.Page.waitForLoadState("domcontentloaded");
    await this.Page.click(SelectorConstants.TeamsInboxPickQueueName);
  }

  public async assignToMeRecord() {
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );

    await iframe.waitForSelector(
      SelectorConstants.AssigntoMeLabel);

    await iframe.waitForLoadState("domcontentloaded");
    await this.waitForRecordsave();

    await iframe.$eval(SelectorConstants.AssigntoMeLabel, (el) => {
      (el as HTMLElement).scrollIntoView();
      (el as HTMLElement).click();
    });
  }

  public async navigateToAssignedConversation() {
    await this._page.click(SelectorConstants.InboxTab)
    await this.waitUntilSelectorIsVisible(
      SelectorConstants.ConversationDropdown,
      AgentChatConstants.Four,
      null, AgentChatConstants.ThrityFiveThousandMiliSeconds);
    await this._page.click(SelectorConstants.ConversationDropdown);
    await this.waitUntilSelectorIsVisible(
      SelectorConstants.AssignedConversations,
      AgentChatConstants.Four,
      null, AgentChatConstants.ThrityFiveThousandMiliSeconds);
    await this._page.click(SelectorConstants.AssignedConversations);
  }

  public async VerifyqueueNameinAssignedConversations() {
    const chhatNam = await this._page.waitForSelector(
      SelectorConstants.TeamsInboxPickQueueName
    );
    const chhatNamText = await chhatNam.textContent();
    expect(chhatNamText).toBeTruthy();
  }
  public async getAgentStatus() {
    const presence = await this.Page.waitForSelector(
      AgentConversationPageConstants.PresenceStatus
    );
    const status = await (await presence.getProperty("title")).jsonValue();
    return status;
  }
}
