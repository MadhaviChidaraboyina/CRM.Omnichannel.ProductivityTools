import { IFrameConstants, IFrameHelper } from "../Utility/IFrameHelper";

import { HTMLConstants, TimeoutConstants } from "../constants";
import { OrgDynamicsCrmNotificationPage } from "../pages/org-dynamics-crm-notification.page";
import { Frame, Page } from "playwright";
import { TestHelper } from "../helpers/test-helper";
import { AgentChatConstants, Constants } from "../Utility/Constants";

const AgentConversationPageConstants = {
  EndConversationButtonXPath: 'xpath=//*[@class="menu-item-button"]/button[@class="menu-button"]',
  EndConversationButtonDisabledXPath: '//*[@class="menu-item-button"]/button[@class="menu-button end-button-disabled"]',
  RemoveConversationButtonClass: ".RemoveFilter-symbol.symbolFont",
  ConfirmButtonId: "//button[contains(@id,'confirmButton')]",
  HeaderSentiment: "//*[contains(@class,'header-sentiment')]/label",
  SentimentWaitingTime: 20000,
  TextAreaXPath: "//*[@data-id='webchat-sendbox-input']",
  SendButtonXPath: "//button[@title='Send']",
  ReseivedMessageContainerXPath: "//*[contains(@class, 'received-message')]",
  SentMessageContainerXPath: "//*[contains(@class, 'sent-message')]",
  MessagesXPath: "//*[contains(@class,'webchat__bubble__content')]//*[contains(@class,'markdown')]",
  SaveAsDashboardXpath: '//*[@id="SaveAsDashboard"]',
  MessageXpath: `//*[contains(@class,'webchat__bubble__content')]//*[contains(text(),'${0}')]`,
  TransferQueueCommand: "/tq ",
  TransferAgentCommand: "/t ",
  MessageTextArea: "//*[@data-id='webchat-sendbox-input']",
  TransferChatMenuItem: `//*[@aria-label="{0}"]`,
  SelectDefaultQueueButton: "//*[@id='highlight-text']/li[@aria-label='{0}']/div/div[2]/button",
  TransferAgentChatButton: "//*[@id='transfer-agent-item-container']//button[contains(text(),'Transfer')]",
  TransferAgentMenuItem: "//*[@id='transfer-agent-item-container']//div[contains(@class, 'transfer-chat-menu-items')]",
  ReceivedMessage: "//div[contains(@class,'markdown webchat')]/p[text()='{0}']",
  SessionIdentifier: "//*[@id='sessionContainer-session-id-0']/following::*[contains(@id,'sessionContainer-session-id')]"
};
export type SentimentTypes = "Very negative" | "Slightly negative" | "Neutral" | "Slightly positive" | "Positive" | "Very positive";

export class AgentConversationPage extends OrgDynamicsCrmNotificationPage {
  constructor(page: Page) {
    super(page);
  }

  public async waitingForSentimentUpdate() {
    await this._page.waitForTimeout(AgentConversationPageConstants.SentimentWaitingTime);
  }

  public async waitForTimeout() {
    await this._page.waitForTimeout(TimeoutConstants.FiveSecondsDelay);
  }

  public async transferChatToQueue(queue: string) {
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    const messageTextArea = await iframe.waitForSelector(
      AgentConversationPageConstants.MessageTextArea
    ).catch((error) => {
      throw new Error(`Can't verify that ConversationControl page has input field for writting messages. Inner exception: ${error.message}`);
    });
    await messageTextArea.fill(AgentConversationPageConstants.TransferQueueCommand);
    await messageTextArea.fill(`${AgentConversationPageConstants.TransferQueueCommand} ${queue}`);
    await iframe.waitForSelector(AgentConversationPageConstants.TransferChatMenuItem.replace("{0}", queue))
      .catch((error) => {
        throw new Error(`Can't verify that ConversationControl page contains Transfer Chat button to "${queue}" queue. Inner exception: ${error.message}`);
      });
    await iframe.$eval(AgentConversationPageConstants.TransferChatMenuItem.replace("{0}", queue), (el) => {
      (el as HTMLElement).click();
    });
  }

  public async transferChatToAgent(agentName: string) {
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );

    const messageTextArea = await iframe.waitForSelector(
      AgentConversationPageConstants.MessageTextArea
    ).catch((error) => {
      throw new Error(`Can't verify that ConversationControl page has input field for writting messages. Inner exception: ${error.message}`);
    });
    await messageTextArea.fill(AgentConversationPageConstants.TransferAgentCommand);
    await messageTextArea.fill(`${AgentConversationPageConstants.TransferAgentCommand} ${agentName}`);

    await iframe.hover(AgentConversationPageConstants.TransferAgentMenuItem);
    await iframe.waitForSelector(AgentConversationPageConstants.TransferAgentChatButton)
      .catch((error) => {
        throw new Error(`Can't verify that ConversationControl page contains Transfer Chat button to "${agentName}" agent. Inner exception: ${error.message}`);
      });
    await iframe.$eval(AgentConversationPageConstants.TransferAgentChatButton, (el) => {
      (el as HTMLElement).click();
    });
  }

  public async getSentiment(): Promise<SentimentTypes> {
    const iframeCC = await TestHelper.GetIframe(this._page, HTMLConstants.IframeCC);
    const headerSentiment = await iframeCC.waitForSelector(AgentConversationPageConstants.HeaderSentiment)
      .catch((error) => {
        throw new Error(`Can't verify that ConversationControl window contains Sentiment status at the header. Inner exception: ${error.message}`);
      });
    const sentimentText = headerSentiment.textContent();
    return sentimentText;
  }

  public async sendMessage(message: string) {
    const iframe: Page = await TestHelper.GetIframe(this._page, HTMLConstants.IframeCC);
    const textarea = await iframe.waitForSelector(AgentConversationPageConstants.TextAreaXPath)
      .catch((error) => {
        throw new Error(`Can't verify that ConversationControl window contains input field for writing messages. Inner exception: ${error.message}`);
      });
    await textarea.fill(message);
    await iframe.waitForSelector(AgentConversationPageConstants.SendButtonXPath)
      .catch((error) => {
        throw new Error(`Can't verify that ConversationControl window contains Send Message button. Inner exception: ${error.message}`);
      });
    await this._page.waitForTimeout(1000);
    await iframe.$eval(AgentConversationPageConstants.SendButtonXPath, el => (el as HTMLElement).click());
    // wait before message will appear in conversetion control chat
    await this._page.waitForTimeout(2000);
  }

  public async getSentMessages(): Promise<string[]> {
    const xpath = AgentConversationPageConstants.SentMessageContainerXPath
      + AgentConversationPageConstants.MessagesXPath;
    return await this.getMessages(xpath);
  }

  public async getReceivedMessages(): Promise<string[]> {
    const xpath = AgentConversationPageConstants.ReseivedMessageContainerXPath
      + AgentConversationPageConstants.MessagesXPath;
    return await this.getMessages(xpath);
  }

  private async getMessages(xpath: string): Promise<string[]> {
    const iframe: Page = await TestHelper.GetIframe(this._page, HTMLConstants.IframeCC);
    await iframe.waitForSelector(xpath)
      .catch((error) => {
        throw new Error(`Can't verify that ConversationControl contains expected message. Inner exception: ${error.message}`);
      });
    const messages = (await iframe.$$(xpath))
      .map(async x => await x.innerText());
    return await Promise.all(messages);
  }


  public async closeConversation() {
    const iframeCC: Frame = await TestHelper.GetIframe(this._page, HTMLConstants.IframeCC);
    await iframeCC.waitForSelector(AgentConversationPageConstants.EndConversationButtonXPath, { timeout: 5000 }).catch(() => { });    
    await iframeCC.$eval(AgentConversationPageConstants.EndConversationButtonXPath, el => (el as HTMLElement).click());
    await iframeCC.waitForSelector(AgentConversationPageConstants.EndConversationButtonDisabledXPath)
      .catch((error) => {
        throw new Error(`Can't verify that ConversationControl contains End Conversation Button. Inner exception: ${error.message}`);
      });
    await this._page.$eval(AgentConversationPageConstants.RemoveConversationButtonClass, el => (el as HTMLElement).click());
    await this._page.waitForSelector(AgentConversationPageConstants.ConfirmButtonId)
      .catch((error) => {
        throw new Error(`Can't verify that Close this session window on the ConversationControl page has confirm "Close" button. Inner exception: ${error.message}`);
      });
    await Promise.all([
      await this._page.$eval(AgentConversationPageConstants.ConfirmButtonId, el => (el as HTMLElement).click()),
      await this._page.waitForRequest(request => request.url().indexOf("clientui/clientsessionevent") !== -1, { timeout: 5000 }).catch(() => { })
    ]);
  }

  public async closeNotEndConversation() {
    await this._page.$eval(AgentConversationPageConstants.RemoveConversationButtonClass, el => (el as HTMLElement).click());
    await this._page.waitForSelector(AgentConversationPageConstants.ConfirmButtonId)
      .catch((error) => {
        throw new Error(`Can't verify that ConversationControl page has Confirm Button. Inner exception: ${error.message}`);
      });
    await this._page.$eval(AgentConversationPageConstants.ConfirmButtonId, el => (el as HTMLElement).click());
    await this._page.waitForSelector(AgentConversationPageConstants.SaveAsDashboardXpath)
      .catch((error) => {
        throw new Error(`Can't verify that Omnichannel Agent Dashboard page contains Save As button. Inner exception: ${error.message}`);
      });
  }

  public async verifyAgentGetNotificationWhenSentimentsIsGoingLow(conversationIndex: number = 1) {
    await this._page.focus("body");
    await this._page.waitForTimeout(5000);
    const sessionItem = await this._page.waitForSelector(`#sessionContainer-session-id-${conversationIndex}`);
    const notificationText = await sessionItem.getAttribute("aria-label");
    expect(notificationText.indexOf("Urgent attention is needed in your conversation")).not.toEqual(-1);
  }

  public async checkMessage(message: string, expectedToMask: boolean = false): Promise<boolean> {
    let iframeCC: Frame = await TestHelper.GetIframe(this._page, HTMLConstants.IframeCC);
    await iframeCC.waitForSelector(AgentConversationPageConstants.TextAreaXPath)
      .catch((error) => {
        throw new Error(`Can't verify that ConversationControl window contains input field for writing messages. Inner exception: ${error.message}`);
      });
    let selector = AgentConversationPageConstants.MessageXpath.replace("0", message);
    if (expectedToMask) {
      const maskedMessage = message.split("").map(() => "#").join("");
      selector = selector + "|" + selector.replace(`${message}`, maskedMessage);
    }
    let messageElement = await iframeCC.waitForSelector(selector, { timeout: 10000 }).catch(() => null);
    let text = null;
    try {
      text = await (await (messageElement as any).getProperty("textContent")).jsonValue();
    }
    catch (error) {
      throw new Error(`Can not find message: "${message}" received on agent side by selector ${selector}. Inner exception: ${error.message}`)
    }
    return text?.includes(message);
  }

  public async waitForSendButtonAvailable() {
    const iframe: Page = await TestHelper.GetIframe(this._page, HTMLConstants.IframeCC);
    await iframe.waitForSelector(AgentConversationPageConstants.SendButtonXPath)
      .catch((error) => {
        throw new Error(`Can't find Send button. Perhaps the chat was not open. Inner exception: ${error.message}`);
      });
  }
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

  public async verifyAgentNotificationWhenSentimentsIsGoingLow(conversationIndex: number) {
    await this._page.focus("body");
    await this._page.waitForTimeout(5000); // Implicit timeout is required as it need to wait for session
    const sessionItem = await this._page.waitForSelector(`#sessionContainer-session-id-${conversationIndex}`);
    const notificationText = await sessionItem.getAttribute("aria-label");
    expect(notificationText.indexOf("Urgent attention is needed in your conversation")).not.toEqual(-1);
  }

  public async validateAgentMessage(textToValidate: string) {
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    const messageSelector = await (
      await iframe.waitForSelector(
        AgentConversationPageConstants.ReceivedMessage.replace("{0}", textToValidate)
      )
    ).textContent();
    return !(messageSelector === null || messageSelector === undefined);
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
  
  public async getSessionId() {
    const session = await this._page.waitForSelector(AgentConversationPageConstants.SessionIdentifier);
    const getSessionId = await session.getAttribute("data-id");
    const activeSessionLength = getSessionId.length;
    const activeChatSessionindex = getSessionId.charAt(activeSessionLength - 1);
    return activeChatSessionindex;
  }
}