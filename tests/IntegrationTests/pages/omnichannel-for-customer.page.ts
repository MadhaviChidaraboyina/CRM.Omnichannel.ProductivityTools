import { Frame, Page } from "playwright";
import { HTMLConstants } from "../constants";
import { LogChatDetails } from "../helpers/log-helper";
import { OrgDynamicsCrmNotificationPage } from "./org-dynamics-crm-notification.page";
import { TestHelper } from "../helpers/test-helper";
import { AgentChatConstants, Constants, SelectorConstants } from "../Utility/Constants";
import { IFrameConstants, IFrameHelper } from "../Utility/IFrameHelper";

const OmnichannelForCustomerPageConstants = {
    ConfirmButtonId: "//button[contains(@id,'confirmButton')]",
    AcceptButtonId: "#acceptButton",
    EndConversationButtonXPath: 'xpath=//*[@class="menu-item-button"]/button[@class="menu-button"]',
    EndConversationButtonDisabledXPath: '//*[@class="menu-item-button"]/button[@class="menu-button end-button-disabled"]',
    RemoveConversationButtonClass: ".RemoveFilter-symbol.symbolFont",
    AvailabilityStatusBusyXPath: '//*[@title="Busy" or @title="Available"]',
    RefreshButtonXPath: '//*[@data-id="RefreshDashboard"]',
    FirstFromTopPickChatXPath: '//div[@id="MscrmControls.Containers.DashboardControl-OpenItems_OCStreamControl"]//ul[@aria-label="Open work items"]//li[1]',
    MoreOptionsButtonInFirstPickChatXPath: '//div[@id="MscrmControls.Containers.DashboardControl-OpenItems_OCStreamControl"]//ul[@aria-label="Open work items"]//li[1]//button[@aria-label="More options"]',
    AssignToMeLiXPath: '//div[contains(@data-id, "OpenItems_OCStreamControl.OCStreamControl-CardCommandBarListContainer")]//ul/li[1]',
    AmountWorkItems: `[data-id="MyItems_OCStreamControl-headerRecordCount"]`,
    AmountOpenWorkItems: `[data-id="OpenItems_OCStreamControl-headerRecordCount"]`,
    SendButtonXPath: "//*[@title='Send']",
    ReseivedMessageContainerXPath: "//*[contains(@class, 'received-message')]",
    MessagesXPath: "//*[contains(@class,'webchat__bubble__content')]//*[contains(@class,'markdown')]",
    AlertMessage: `//span[@data-id="notification-message"]`,
    MessageTextArea: "//*[@data-id='webchat-sendbox-input']",
    TransferAgentCommand: "/t ",
    ConsultAgentCommand: "/c ",
    TransferAgentMenuItem: "//*[@id='transfer-agent-item-container']//div[contains(@class, 'transfer-chat-menu-items')]",
    TransferAgentChatButton: "//*[@id='transfer-agent-item-container']//button[contains(text(),'Transfer')]",
    ConsultAgentMenuItem: "//*[@id='consult-agent-item-container']//div[contains(@class, 'consult-chat-menu-items')]",
    ConsultAgentChatButton: "//*[@id='consult-agent-item-container']//button[contains(text(),'Add')]"
};

export class OmnichannelForCustomerPage extends OrgDynamicsCrmNotificationPage {

    constructor(page: Page) {
        super(page);
    }

    public async goToOngoingDashboard() {
        await this._page.waitForTimeout(3000);
        await this._page.waitForSelector(SelectorConstants.AgentDashboardTab)
            .catch((error) => {
                throw new Error(`Can't verify that customer page has "Omnichannel Agent Dashboard" tab. Inner exception: ${error.message}`);
            });
        await this._page.$eval(SelectorConstants.AgentDashboardTab, el => (el as HTMLElement).click());
        await this._page.$eval(SelectorConstants.OngoingTabConversationSelector, el => (el as HTMLElement).click());
    }

    public async waitForAvailabilityStatus() {
        return this._page.waitForSelector(OmnichannelForCustomerPageConstants.AvailabilityStatusBusyXPath)
            .catch((error) => {
                throw new Error(`Can't verify that "Launch presence dialog" at the customer page has "Available" or "Busy" status. Inner exception: ${error.message}`);
            });
    }

    public async refreshDashboard() {
        await (await this._page.waitForSelector(OmnichannelForCustomerPageConstants.RefreshButtonXPath)
            .catch((error) => {
                throw new Error(`Cant't verify that customer page has "Refresh All" button. Inner exception: ${error.message}`);
            }));
        await this._page.$eval(OmnichannelForCustomerPageConstants.RefreshButtonXPath, el => (el as HTMLElement).click());
    }

    public async openPickChat(message?: string) {
        try {
            await this.refreshDashboard();
            let currentAmountOfOpenWorkItems = await this.getCurrentAmountOpenWorkItems();
            let isConversationAppropriate = false;

            while (!isConversationAppropriate) {
                if (Number(currentAmountOfOpenWorkItems) > 0) {
                    let moreOptionButton = await this._page.waitForSelector(OmnichannelForCustomerPageConstants.MoreOptionsButtonInFirstPickChatXPath)
                        .catch((error) => {
                            throw new Error(`Can't verify that customer page has "More Option" button. Inner exception: ${error.message}`);
                        });
                    await moreOptionButton.click();
                    await this._page.waitForSelector(OmnichannelForCustomerPageConstants.AssignToMeLiXPath)
                        .catch((error) => {
                            throw new Error(`Can't verify that customer page has "Assign To Me" button. Inner exception: ${error.message}`);
                        });
                    await this._page.$eval(OmnichannelForCustomerPageConstants.AssignToMeLiXPath, el => (el as HTMLElement).click());
                    let assignAlertText = await this.getAssignPickChatAlertText();
                    const iframe: Page = await TestHelper.GetIframe(this._page, HTMLConstants.IframeCC);
                    await iframe.waitForSelector(OmnichannelForCustomerPageConstants.SendButtonXPath)
                        .catch((error) => {
                            throw new Error(`Can't find Send button. Perhaps the chat was not open. Inner exception: ${error.message}`);
                        });

                    let isAssignAlertHasSuccessfulStatus = await this.checkAssignPickChatAlertIsSuccessful(assignAlertText);

                    if (!isAssignAlertHasSuccessfulStatus) {
                        throw new Error(`Pick chat failed to assign.`);
                    }

                    let receivedMessages = await this.getReceivedMessages();

                    if (receivedMessages[0] !== message) {
                        isConversationAppropriate = false;
                        await this.closeConversation();
                        await this.waitUntillCustomerSessionIsOver(3000);
                        await this.refreshDashboard();
                        currentAmountOfOpenWorkItems = await this.getCurrentAmountOpenWorkItems();
                    } else {
                        isConversationAppropriate = true;
                    }
                } else {
                    throw new Error(`There is no suitable pick-chat and the list of available open work items is empty.`);
                }
            }
            return true;
        } catch (error) {
            return false;
        }
    }

    public async getAssignPickChatAlertText() {
        await this._page.waitForSelector(OmnichannelForCustomerPageConstants.AlertMessage);
        const text = await this._page
            .$eval(OmnichannelForCustomerPageConstants.AlertMessage, el => (el as HTMLElement).textContent);
        return text;
    }

    public async checkAssignPickChatAlertIsSuccessful(message: string) {
        const isMessageContainsText = message.includes(`Work item picked successfully.`);
        return isMessageContainsText;
    }

    public async checkPickChat() {
        // there is nothing to wait here, because nothing changes on the page until refresh
        await this._page.waitForTimeout(5000);
        await this.refreshDashboard();
        let result = await this._page.$(OmnichannelForCustomerPageConstants.FirstFromTopPickChatXPath) !== null;
        return result;
    }

    public async waitForPickChatAvailable(timesToRefreshPage: number) {
        for (let tryCount = 0; tryCount <= timesToRefreshPage; tryCount++) {
            let isPickChatAvailable = await this.checkPickChat();
            if (isPickChatAvailable) {
                break;
            }
            isPickChatAvailable = await this.checkPickChat();
        }
    }

    public async getCurrentAmountWorkItems() {
        await this._page.waitForSelector(OmnichannelForCustomerPageConstants.AmountWorkItems);
        const amount = await this._page
            .$eval(OmnichannelForCustomerPageConstants.AmountWorkItems, el => (el as HTMLElement).textContent);
        return amount;
    }

    public async getCurrentAmountOpenWorkItems() {
        await this._page.waitForSelector(OmnichannelForCustomerPageConstants.AmountOpenWorkItems);
        const amount = await this._page
            .$eval(OmnichannelForCustomerPageConstants.AmountOpenWorkItems, el => (el as HTMLElement).textContent);
        return amount;
    }

    private async getReceivedMessages(): Promise<string[]> {
        const xpath = OmnichannelForCustomerPageConstants.ReseivedMessageContainerXPath
          + OmnichannelForCustomerPageConstants.MessagesXPath;
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

    public async waitUntillCustomerSessionIsOver(autoCloseAfterInactivityTime: number) {
        // Check that predefined customer session value is gone
        await this._page.waitForTimeout(autoCloseAfterInactivityTime);
    }

    private async closeConversation() {
        const iframeCC: Frame = await TestHelper.GetIframe(this._page, HTMLConstants.IframeCC);
        await iframeCC.waitForSelector(OmnichannelForCustomerPageConstants.EndConversationButtonXPath, { timeout: 5000 }).catch(() => { });
        await iframeCC.$eval(OmnichannelForCustomerPageConstants.EndConversationButtonXPath, el => (el as HTMLElement).click());
        await iframeCC.waitForSelector(OmnichannelForCustomerPageConstants.EndConversationButtonDisabledXPath)
          .catch((error) => {
            throw new Error(`Can't verify that ConversationControl contains End Conversation Button. Inner exception: ${error.message}`);
          });
        await this._page.$eval(OmnichannelForCustomerPageConstants.RemoveConversationButtonClass, el => (el as HTMLElement).click());
        await this._page.waitForSelector(OmnichannelForCustomerPageConstants.ConfirmButtonId)
          .catch((error) => {
            throw new Error(`Can't verify that Close this session window on the ConversationControl page has confirm "Close" button. Inner exception: ${error.message}`);
          });
        await Promise.all([
          await this._page.$eval(OmnichannelForCustomerPageConstants.ConfirmButtonId, el => (el as HTMLElement).click()),
          await this._page.waitForRequest(request => request.url().indexOf("clientui/clientsessionevent") !== -1, { timeout: 5000 }).catch(() => { })
        ]);
    }

  
// Open all coming popups and check for unique message in the conversation. All inappropriate will be closed.
public acceptPushChatNotification(uniqueMessage: string) {
    return this.acceptPushTargetChatNotification(async (agentChatPage) => {
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
  
  public async acceptPushTargetChatNotification(
    checkForExpectedChat: (chatPage: OmnichannelForCustomerPage) => Promise<boolean>,
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
          } catch { }
        }
      }
    }
  }

  public async acceptInvitationToChat(timeout?: number) {
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.AcceptButtonId,
      AgentChatConstants.Four,
      null,
      timeout || AgentChatConstants.ThrityFiveThousandMiliSeconds
    );
    await this._page.click(AgentChatConstants.AcceptButtonId);
    await this.waitForConversationControl();
    await LogChatDetails(this._page, "Accept Invitation to Chat", "after accept chat");
  }

  public async setAgentAvailablePresence() {
    await this.setAgentPresenceAsAvailable();
  }

  public async getConvCtrl() {
    return await IFrameHelper.GetIframe(this._page, IFrameConstants.IframeCC);
  }

  public async clickActiveChat() {
    await this.clickActiveChatNotification();
  }

  /// </summary>
  /// This method is used to clear unused chat conversation from agent end which generally remains unclosed if some test case failed.
  /// </summary>
  public async closeUnusedChat() {
    await this.closeUnusedChatSession();
  }

  public async waitForConversationControl() {
    await this.waitForConvControl();
  }

  public async CloseActiveChats() {
    await this.CloseActiveChatSession();
  }


  // Open all coming popups and check for unique message in the conversation. All inappropriate will be closed.
public acceptSingleChatNotification(uniqueMessage: string) {
  return this.acceptSinglePushTargetChatNotification(async (agentChatPage) => {
    const ccFrame: Page = await agentChatPage.getConvCtrl();
    try {
      await ccFrame.waitForFunction(
        (expected) =>
          [...document.querySelectorAll("div.received-message")].some(
            (customerMessageEl) =>
              customerMessageEl.textContent.includes(expected)
          ),
        uniqueMessage,
        { timeout: 4000 }
      );

      return true;
    } catch {
      return false;
    }
  });
}  

  public async acceptSinglePushTargetChatNotification(
    checkForExpectedChat: (chatPage: OmnichannelForCustomerPage) => Promise<boolean>,
    timeout?: number
  ) {
    while (true) {
      // When no active popup is present and expected chat hasn`t been found yet timeout exception will be thrown from accept method
      // so the loop will break and test fails since the correct chat couldn`t be initialized
      await this.setAgentAvailablePresence();
      const isAcceptBtnVisible = await this.waitUntilSelectorIsVisible(
        AgentChatConstants.AcceptButtonId,
        AgentChatConstants.Four,
        null,
        timeout || AgentChatConstants.ThrityFiveThousandMiliSeconds
      );
      if (isAcceptBtnVisible) {
        await this.setAgentPresenceAsBusyDND();
        await this._page.click(AgentChatConstants.AcceptButtonId);
        await this.waitForConversationControl();
        await LogChatDetails(this._page, "Accept Invitation to Chat", "after accept chat");

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
            } catch { }
          }
        }
      }
      else {
        console.log("Method acceptSingleChat: Chat notification is not visible");
      }
    }
  }


  public async transferChat(agentName: string) {
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );

    const messageTextArea = await iframe.waitForSelector(
      OmnichannelForCustomerPageConstants.MessageTextArea
    ).catch((error) => {
      throw new Error(`Can't verify that ConversationControl page has input field for writting messages. Inner exception: ${error.message}`);
    });
    await messageTextArea.fill(OmnichannelForCustomerPageConstants.TransferAgentCommand);
    await messageTextArea.fill(`${OmnichannelForCustomerPageConstants.TransferAgentCommand} ${agentName}`);

    await iframe.hover(OmnichannelForCustomerPageConstants.TransferAgentMenuItem);
    await iframe.waitForSelector(OmnichannelForCustomerPageConstants.TransferAgentChatButton)
      .catch((error) => {
        throw new Error(`Can't verify that ConversationControl page contains Transfer Chat button to "${agentName}" agent. Inner exception: ${error.message}`);
      });
    await iframe.$eval(OmnichannelForCustomerPageConstants.TransferAgentChatButton, (el) => {
      (el as HTMLElement).click();
    });
  } 

  public async consultChat(agentName: string) {
    const iframe: Page = await IFrameHelper.GetIframe(
      this.Page,
      IFrameConstants.IframeCC
    );
    
    const messageTextArea = await iframe.waitForSelector(
      OmnichannelForCustomerPageConstants.MessageTextArea
    ).catch((error) => {
      throw new Error(`Can't verify that ConversationControl page has input field for writting messages. Inner exception: ${error.message}`);
    });
    await messageTextArea.fill(OmnichannelForCustomerPageConstants.ConsultAgentCommand);
    await messageTextArea.fill(`${OmnichannelForCustomerPageConstants.ConsultAgentCommand} ${agentName}`);

    await iframe.hover(OmnichannelForCustomerPageConstants.ConsultAgentMenuItem);
    await iframe.waitForSelector(OmnichannelForCustomerPageConstants.ConsultAgentChatButton)
      .catch((error) => {
        throw new Error(`Can't verify that ConversationControl page contains Add Chat button to "${agentName}" agent. Inner exception: ${error.message}`);
      });
    await iframe.$eval(OmnichannelForCustomerPageConstants.ConsultAgentChatButton, (el) => {
      (el as HTMLElement).click();
    });
  } 
}

