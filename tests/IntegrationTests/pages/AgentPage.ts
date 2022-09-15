import { Constants, Livechannels, SelectorConstants, channels } from "../Utility/Constants";

import { AsyncChannelType } from "../types/e2e/async-channels.t";
import { BasePage } from "../pages/BasePage";
import { Page } from "playwright";
import { TestSettings } from "../configuration/test-settings";
import { TimeoutConstants } from "../constants/timeout-constants";

export enum AgentPageConstants {
  OmnichannelCustomerService = "Omnichannel for Customer Service",
  SwitchAppSelector = "[data-id='navbar-switch-app']",
  NavigateToAgentScreenSelector = "//*[contains(text(),'Omnichannel for Customer Service')]",
  AgentSentimentAlert = "//img[contains(@src,'data:image/svg+xml') and @title='Playwright Twitter. Urgent attention is needed in your conversation.']",
  JoinChat = "//button[@id='join-chat']",
  OngoingDashboardItem = "//label[contains(text(),'{0}')]/preceding::div[@role='gridcell'][4]",
  MyWorkitemsSelectorByWorkitemId = "//li[@data-id='MyItems_OCStreamControl.OCStreamControl-ListItem_{0}']",
}

export class AgentPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  public async loginAndNavigateToAgentApp(channel: string = null) {
    switch (channel) {
      case channels.Twitter: {
        await this.loginAgent(TestSettings.TwitterAgentEmail, TestSettings.TwitterAgentPassword)
        break;
      }
      case channels.FaceBook: {
        await this.loginAgent(TestSettings.FacebookAgentEmail, TestSettings.FacebookAgentPassword)
        break;
      }
      case channels.Custom: {
        await this.loginAgent(TestSettings.CustomAgentEmail, TestSettings.CustomAgentPassword)
        break;
      }
      case channels.WeChat: {
        await this.loginAgent(TestSettings.WeChatChannelAgentEmail, TestSettings.WeChatAgentPassword)
        break;
      }
      case channels.Teams: {
        this.loginAgent(TestSettings.TeamsAgentEmail, TestSettings.DefaultPassword)
        break;
      }
      default: {
        await this.loginAgent(TestSettings.AgentAccountEmail, TestSettings.AgentAccountPassword)
        break;
      }
    }
  }

  public async loginAndNavigateToAgentForLiveChat(channel: string = null) {
    switch (channel) {
      case Livechannels.LiveAgent: {
        await this.loginAgent(TestSettings.LiveAccountAgentEmail, TestSettings.LiveChatAccountPassword);
        break;
      }
      case Livechannels.AgentAffinity: {
        await this.loginAgent(TestSettings.AdminAgentAffinityAccountEmail, TestSettings.LiveChatAccountPassword);
        break;
      }
      case Livechannels.LivePopout: {
        await this.loginAgent(TestSettings.LivePopoutChatUserName, TestSettings.LiveChatAccountPassword);
        break;
      }
      case Livechannels.LiveAttachments: {
        await this.loginAgent(TestSettings.LiveChatAttachmentEmail, TestSettings.LiveChatAccountPassword)
        break;
      }
      case Livechannels.ReconnectChat: {
        await this.loginAgent(TestSettings.LiveChatReconnectUserName, TestSettings.LiveChatAccountPassword);
        break;
      }
      case Livechannels.ReconnectAuthChat: {
        await this.loginAgent(TestSettings.LiveChatReconnectUserName, TestSettings.LiveChatAccountPassword);
        break;
      }
      case Livechannels.LiveChatAutomated: {
        await this.loginAgent(TestSettings.LiveChatAgentEmail, TestSettings.LiveChatAgentPassword);
        break;
      }
      case Livechannels.LiveChatAgent: {
        await this.loginAgent(TestSettings.AgentEmailSecond, TestSettings.LiveChatAccountPassword);
        break;
      }
      case Livechannels.LiveChatUser1: {
        await this.loginAgent(TestSettings.AgentEmailFirst, TestSettings.LiveChatAccountPassword);
        break;
      }
      case Livechannels.OmnichannelAgent: {
        await this.loginAgent(TestSettings.OmnichannelAgentAccountEmail, TestSettings.OmnichannelAgentAccountPassword);
        break;
      }
      case Livechannels.LiveChatSDKUser: {
        await this.loginAgent(TestSettings.LiveChatPickMode.LiveChatPickModeAgentEmail, TestSettings.DefaultPassword);
        break;
      }
      default: {
        await this.loginAgent(TestSettings.LiveChatAccountEmail, TestSettings.LiveChatAccountPassword);
        break;
      }
    }
  }


  public async loginAndNavigateToSanityAgents(channel: string = null) {
    switch (channel) {
      case channels.Line: {
        await this.loginAgent(TestSettings.SanityLineUser, TestSettings.DefaultPassword);
        break;
      }
      case channels.Teams: {
        await this.loginAgent(TestSettings.SanityTeamsUser, TestSettings.DefaultPassword)
        break;
      }
      case channels.WhatsApp: {
        await this.loginAgent(TestSettings.SanityWhatsAppUser, TestSettings.DefaultPassword)
        break;
      }
      case channels.Twitter: {
        await this.loginAgent(TestSettings.SanityTwitterAppUser, TestSettings.DefaultPassword)
        break;
      }
      default: {
        await this.loginAgent(TestSettings.LiveChatAccountEmail, TestSettings.DefaultPassword);
        break;
      }
    }
  }


  public async loginAndNavigateToAgentForLiveChatApp() {
    await this.loginAgent(TestSettings.LiveChatAccountEmail, TestSettings.LiveChatAccountPassword);
  }

  public async loginAndNavigateLiveChatPopoutApp() {
    await this.loginAgent(TestSettings.LivePopoutChatUserName, TestSettings.LivePopoutChatPassword);
  }

  public async loginAndNavigateToAgentForAttachmentsLiveChatApp() {
    await this.loginAgent(TestSettings.LiveChatReconnectUserName, TestSettings.LivePopoutChatPassword);
  }
  public async loginAndNavigateLiveChatReconnectApp() {
    await this.loginAgent(TestSettings.LiveChatReconnectUserName, TestSettings.LivePopoutChatPassword);
  }

  public async loginAndNavigateToMinimumCapacityUser() {
    await this.loginAgent(TestSettings.MinimumCapacityUser, TestSettings.MinimumCapacityPassword);
  }

  public async loginAndNavigateToZeroCapacityUser() {
    await this.loginAgent(TestSettings.ZeroCapacityUser, TestSettings.ZeroCapacityPassword);
  }

  public async loginAndNavigateToTransferAgentApp() {
    this.loginAgent(TestSettings.TransferAgentAccountEmail, TestSettings.TransferAgentAccountPassword);
  }

  public async loginAndNavigateToConsultOrTransferAgentApp() {
    this.loginAgent(TestSettings.LiveChatConsultOrTransferAgentEmail, TestSettings.LiveChatConsultOrTransferAgentPassword);
  }

  public async loginAgent(email: string, password: string, logAgentEmail: boolean = false) {
    try {
      if (logAgentEmail) {
        console.info("Logged in AgentEmail: " + email);
      }
    }
    catch { }
    await this.navigateToOrgUrlAndSignIn(email, password);
    await this.navigateToCustomerService();
    //await this.waitForAgentStatusIcon();
    await this.expandConversationSessionPanel();
    await this.closeGlobalSearchPopUp();
  }

  public async loginChannelAgent(streamSource: AsyncChannelType, agentIndex = 0, logAgentEmail: boolean = false) {
    const { email, password } = TestSettings.GetOCAgentForChannel(streamSource, agentIndex);
    try {
      if (logAgentEmail) {
        console.info("Logged in AgentEmail: " + email);
      }
    }
    catch { }
    await this.loginAgent(email, password);
  }

  public async validateAgentDashboard() {
    const result = await this.Page.textContent(
      SelectorConstants.MyWorkItems
    );
    return result;
  }

  public async validateAgentSmartAssist() {
    await this.Page.click(SelectorConstants.SmartAssistDataPane);
    const result = await this.Page.textContent(
      SelectorConstants.SmartAssistCard
    );
    return result;
  }

  public async validateAgentChatStatus() {
    const result = await this.Page.textContent(
      SelectorConstants.ChatStatus
    );
    return result;
  }

  public async navigateToAgentDashboard() {
    const homeBtnEnable = await this.waitUntilSelectorIsVisible(
      SelectorConstants.AgentDashboardHomeButton,
      Constants.Two,
      null,
      Constants.FiveThousand
    );
    if (homeBtnEnable) {
      await this.Page.click(SelectorConstants.AgentDashboardHomeButton);
      await this.waitUntilSelectorIsVisible(SelectorConstants.MyWorkItemsQueueSelector, Constants.Three, this._page, Constants.FiveThousand);
      await this.waitUntilSelectorIsVisible(SelectorConstants.RefreshAllTab, Constants.Three, this._page, Constants.FiveThousand);
    }
  }

  public async navigateToVisitorDashboard() {
    await this.Page.click(SelectorConstants.VisitorHomeButton);
    await this.Page.waitForTimeout(Constants.DefaultTimeout);
  }

  public async navigateToLatestClosedConversation() {
    await this.Page.click(SelectorConstants.FirstClosedConversation);
    await this.Page.waitForTimeout(Constants.DefaultTimeout);
  }

  public async navigateToAgentScreenFromAdminPage() {
    this._page.goto(TestSettings.OrgUrl);
    await this._page.click(AgentPageConstants.SwitchAppSelector);
    await this._page.click(AgentPageConstants.NavigateToAgentScreenSelector);
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

  public async waitUntilWorkItemIsHidden(selectorVal: string, maxCount = 3, page: Page = null, timeout: number = Constants.DefaultTimeout) {
    let dataCount = 0;
    let pageObject = (page ?? this.Page);
    while (dataCount < maxCount) {
      try {
        await pageObject.click(SelectorConstants.RefreshDashBoard);
        await pageObject.waitForSelector(selectorVal, { timeout, state: "hidden" });
        return true;
      } catch {
        dataCount++;
      }
    }
    return false;
  }

  public async open(openUrl: string) {
    await this._page.goto(openUrl);
    await this.waitForDomContentLoaded();
  }

  public async getInnerHtml(selector: string): Promise<string> {
    return await this.Page.$eval(selector, (el) => (el as HTMLElement).innerHTML.trim());
  }

  //to reject conversation from Customer
  public async tryToRejectConversation(): Promise<boolean> {
    try {
      const rejectButton = await this._page
        .waitForSelector(Constants.RejectButtonId)
        .catch(() => {
          throw new Error(`Can't verify that Chat Request Pop-up has "Reject" button.`);
        });
      await this._page.focus(Constants.RejectButtonId);
      await rejectButton.click();
      return true;
    } catch {
      return false;
    }
  }

  public async validateAgentChatWrapupStatus() {
    const result = await this.Page.waitForSelector(
      SelectorConstants.ChatWrapupStatus
    );
    return result;
  }

  public async openChatItemSelect(selectorVal: string, time: number) {
    let dataCount = 0;
    let timeout = Constants.ThrityFiveThousandMiliSeconds;
    while (dataCount < time) {
      try {
        await this._page.click(SelectorConstants.RefreshDashBoard);
        await this.Page.waitForSelector((selectorVal), { timeout });
      }
      catch { }
      dataCount++;
    }
  }

  public async validateMyLiveworkItemById(liveworkItemId: string) {
    try {
      await this.Page.waitForSelector(AgentPageConstants.MyWorkitemsSelectorByWorkitemId.replace("{0}", liveworkItemId))
        .catch((error) => {
          throw new Error(`Could not validate conversation in agent's my workitems list. Inner exception: ${error.message}`);
        });
      return true;
    } catch (error) {
      console.log(`Method validateMyLiveworkItemById throwing exception with message: ${error.message}`);
      return false;
    };
  }


  public async getAgentChatFrameElementClassName(iframeCC: any, selector: string, timeout: number = TimeoutConstants.ThreeSecondsDelay, retrycount: number = 3) {
    let className: string = await iframeCC.$eval(selector, el => el.className).catch(() => { "" });
    //Retry if the element/class is not found
    let count = 0;
    while (retrycount > count && (className == undefined || className == "")) {
      try {
        //To Avoid intermittent failure in pipeline, retrying by delay with atleast 3 seconds
        await this._page.waitForTimeout(timeout);
        className = await iframeCC.$eval(selector, el => el.className);
      }
      catch (e) {
        count++;
        if (count == retrycount) {
          console.info(`Retried ${count} times and failed to read iframe selector ${selector} class`);
          throw e;
        }
      };
    }
    return className;
  }

  public async navigateToAgentConversationScreen() {
    const homeBtnEnable = await this.waitUntilSelectorIsVisible(
      SelectorConstants.AgentDashboardTab,
      Constants.Two,
      null,
      Constants.FiveThousand
    );
    if (homeBtnEnable) {
      await this.Page.click(SelectorConstants.AgentDashboardTab);
      await this.waitUntilSelectorIsVisible(SelectorConstants.MyWorkItemsQueueSelector, Constants.Three, this._page, Constants.FiveThousand);
      await this.waitUntilSelectorIsVisible(SelectorConstants.RefreshAllTab, Constants.Three, this._page, Constants.FiveThousand);
    }
  }
}