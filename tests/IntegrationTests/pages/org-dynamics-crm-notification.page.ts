import { AgentChatConstants, Constants } from "../Utility/Constants";
import { BasePage } from "./base.page";
import { Frame, Page } from "playwright";
import { HTMLConstants, TimeoutConstants } from "../constants";
import { IFrameConstants, IFrameHelper } from "../Utility/IFrameHelper";
import { LogChatDetails } from "../helpers/log-helper";
import { SupervisorPageConstants } from "../pages/SupervisorPage";
import { TestHelper } from "../helpers/test-helper";

const OrgDynamicsCrmBasePageConstants = {
  AcceptButtonId: "#acceptButton",
  AvailabilityStatusBusyXPath: '//img[contains(@title, "Available") or contains(@title, "Busy") or contains(@title, "Do Not Disturb")]',
  EndConversationButtonXPath: 'xpath=//*[@class="menu-item-button"]/button[@class="menu-button"]',
  EndConversationButtonDisabledXPath: '//*[@class="menu-item-button"]/button[@class="menu-button end-button-disabled"]',
  RemoveConversationButtonClass: ".RemoveFilter-symbol.symbolFont",
  ConfirmButtonId: "//button[contains(@id,'confirmButton')]",
  MessageXpath: `//*[contains(text(),'${0}')]`,
  SupervisorNotification: "#popupNotificationRoot",
  SupervisorNotificationButtonAccept: "#popupNotificationFooter #acceptButton",
  SupervisorNotificationDeclineButton: "#popupNotificationFooter #declineButton",
  AgentStatusButton: `//*[@data-id="Microsoft.Dynamics.Service.CIFramework.Presence.Dialog"]`,
  SelectStatusElement: `//*[@data-id="presence_id.fieldControl-option-set-select"]`,
  AgentStatusOkButton: `//*[@data-id="ok_id"]`,
  AgentStatusRetries: 3
};

export abstract class OrgDynamicsCrmNotificationPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  public async isSupervisorNotificationAppears(): Promise<boolean> {
    const iframe = await this._page.waitForSelector(OrgDynamicsCrmBasePageConstants.SupervisorNotification)
      .catch((error) => {
        throw new Error(`Supervisor notification doesn't appear. Inner exception: ${error.message}`);
      });
    return !!iframe;
  }

  public async goToChatAsSupervisor() {
    await this._page.waitForSelector(OrgDynamicsCrmBasePageConstants.SupervisorNotificationButtonAccept)
      .catch((error) => {
        throw new Error(`Can't go to chat as supervisor! Inner exception: ${error.message}`);
      });
    await this._page.focus(OrgDynamicsCrmBasePageConstants.SupervisorNotificationButtonAccept);
    await this._page.$eval(OrgDynamicsCrmBasePageConstants.SupervisorNotificationButtonAccept, el => (el as HTMLElement).click());
    // wait till CC is loaded
    await TestHelper.GetIframe(this._page, HTMLConstants.IframeCC);
  }

  public async setAgentStatusToBusyDND() {
    // Without this timeout playwright can't wait and click on this status even with focus, only this helps
    await this._page.waitForTimeout(2000);
    await this._page.waitForSelector(OrgDynamicsCrmBasePageConstants.AgentStatusButton);
    await this._page.focus(OrgDynamicsCrmBasePageConstants.AgentStatusButton);
    await this._page.click(OrgDynamicsCrmBasePageConstants.AgentStatusButton);
    const selectElement = await this._page.waitForSelector(OrgDynamicsCrmBasePageConstants.SelectStatusElement)
      .catch((error) => {
        throw new Error(`Supervisor notification doesn't appear. Inner exception: ${error.message}`);
      });
    selectElement.selectOption({ label: "Do not disturb" });
    await this._page.waitForTimeout(500);
    await this._page.click(OrgDynamicsCrmBasePageConstants.AgentStatusOkButton);
    await this._page.waitForTimeout(5000);
  }

  public async setAgentStatusToAvailable() {
    await this._page.waitForSelector(OrgDynamicsCrmBasePageConstants.AgentStatusButton);
    await this._page.focus(OrgDynamicsCrmBasePageConstants.AgentStatusButton);
    await this._page.click(OrgDynamicsCrmBasePageConstants.AgentStatusButton);
    const selectElement = await this._page.waitForSelector(OrgDynamicsCrmBasePageConstants.SelectStatusElement)
      .catch((error) => {
        throw new Error(`"Set Your Status" window doesn't contain Status drop-down list. Inner exception: ${error.message}`);
      });
    selectElement.selectOption({ label: "Available" });
    await this._page.waitForTimeout(500);
    await this._page.click(OrgDynamicsCrmBasePageConstants.AgentStatusOkButton);
    await this._page.waitForTimeout(5000);
  }

  public async waitForLoadState() {
    if (this._page && !this._page.isClosed()) {
      await this._page.waitForLoadState();
    }
  }

  public async waitForAgentStatus() {
    this.Page.on('dialog', dialog => dialog.accept());
    for (let i = 0; i < OrgDynamicsCrmBasePageConstants.AgentStatusRetries; i++) {
      let result = await this._page.waitForSelector(OrgDynamicsCrmBasePageConstants.AvailabilityStatusBusyXPath,
        { timeout: TimeoutConstants.WaitTimeOutForLoadingOmnichannelForCustomers })
        .catch((error) => {
          if (i < OrgDynamicsCrmBasePageConstants.AgentStatusRetries) {
            this.Page.reload();
          } else {
            throw new Error(`Agent/supervisor status didn't appear! Inner exception: ${error.message}. Retry count: ${OrgDynamicsCrmBasePageConstants.AgentStatusRetries}`);
          }
        });

      if (result) {
        break;
      }
    }
  }

  public async acceptInvitationToChat() {
    await this.acceptChat();
  }

  public async acceptTargetChat(messageText: string) {
    let isTargetChatAccepted = false;
    let retryCount = 0;
    while (!isTargetChatAccepted) {
      await LogChatDetails(this._page, "acceptTargetChat", "Before accepting of chat");
      await this.acceptChat(retryCount);
      isTargetChatAccepted = await this.checkUniqueMessage(messageText);
      if (!isTargetChatAccepted) {
        await LogChatDetails(this._page, "acceptTargetChat", "After accepting of chat");
        await this.closeWrongConversation();
      }
      retryCount++;
    }
  }

  public async acceptChat(retryCount: number = 0) {
    await this._page.waitForSelector(OrgDynamicsCrmBasePageConstants.AcceptButtonId)
      .catch((error) => {
        throw new Error(`Accept invitation to target chat didn't appear! Inner exception: ${error.message}. Retry count: ${retryCount}`);
      });
    await this._page.focus(OrgDynamicsCrmBasePageConstants.AcceptButtonId);
    await this._page.$eval(OrgDynamicsCrmBasePageConstants.AcceptButtonId, el => (el as HTMLElement).click());
    // wait till CC is loaded
    await TestHelper.GetIframe(this._page, HTMLConstants.IframeCC);
  }

  private async checkUniqueMessage(message: string): Promise<boolean> {
    let iframeCC: Frame = await TestHelper.GetIframe(this._page, HTMLConstants.IframeCC);
    let selector = OrgDynamicsCrmBasePageConstants.MessageXpath.replace("0", message);
    let messageElement = await iframeCC.waitForSelector(selector, { timeout: 10000 }).catch(() => null);
    let text = null;
    try {
      text = await (await (messageElement as any).getProperty("textContent")).jsonValue();
    }
    catch (error) {
      return false;
    }
    return text?.includes(message);
  }

  private parseConversationId(message: string): string {
    const result = message.match(/([a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12})/);

    if (!result) {
      throw new Error(`Can't verify that the message "${message}" contains conversation Id`);
    }
    return result[0];
  }

  private async closeWrongConversation() {
    const iframeCC = await TestHelper.GetIframe(this._page, HTMLConstants.IframeCC);
    await iframeCC.$eval(OrgDynamicsCrmBasePageConstants.EndConversationButtonXPath, el => (el as HTMLElement).click());
    await iframeCC.waitForSelector(OrgDynamicsCrmBasePageConstants.EndConversationButtonDisabledXPath)
      .catch((error) => {
        throw new Error(`Can't verify that ConversationControl contains End Conversation Button. Inner exception: ${error.message}`);
      });
    await this._page.$eval(OrgDynamicsCrmBasePageConstants.RemoveConversationButtonClass, el => (el as HTMLElement).click());
    await this._page.waitForSelector(OrgDynamicsCrmBasePageConstants.ConfirmButtonId)
      .catch((error) => {
        throw new Error(`Can't verify that Close this session window on the ConversationControl page has confirm "Close" button. Inner exception: ${error.message}`);
      });
    await Promise.all([
      this._page.$eval(OrgDynamicsCrmBasePageConstants.ConfirmButtonId, el => (el as HTMLElement).click()),
      this._page.waitForRequest(request => request.url().indexOf("clientui/clientsessionevent") !== -1)
    ]);
  }

  public async waitForAgentPresence() {
    return await this.waitUntilSelectorIsVisible(
      AgentChatConstants.AvailabilityStatusBusyXPath,
      AgentChatConstants.Five,
      this._page,
      Constants.MaxTimeout
    );
  }

  public async joinInitiateChat(message: string) {
    await this.waitUntilSelectorIsVisible(SupervisorPageConstants.MessageTextArea, SupervisorPageConstants.Three);
    const iframeCC = await IFrameHelper.GetIframe(this._page, IFrameConstants.IframeCC);
    await iframeCC.waitForSelector(SupervisorPageConstants.JoinChat);
    await this.waitUntilSelectorIsVisible(SupervisorPageConstants.MessageTextArea, SupervisorPageConstants.Three);
    await iframeCC.$eval(SupervisorPageConstants.JoinConversation, el => (el as HTMLElement).click());
    await this.waitUntilSelectorIsVisible(SupervisorPageConstants.Internal, SupervisorPageConstants.Three);
    await iframeCC.$eval(SupervisorPageConstants.Internal, el => (el as HTMLElement).click());
    const textarea = await iframeCC.waitForSelector(SupervisorPageConstants.MessageTextArea);
    await textarea.fill(message);
    await iframeCC.waitForSelector(AgentChatConstants.SendMessageButton);
    await iframeCC.$eval(AgentChatConstants.SendMessageButton, el => (el as HTMLElement).click());
  }

  public async waitForChatLoad() {
    await this.waitForChatControlLoad();
  }

  public async setAgentStatusAsBusyDND() {
    await this.setAgentPresenceAsBusyDND();
  }
}