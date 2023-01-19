import { Page } from "playwright";
import {
  AgentChatConstants,
  Constants,
  SelectorConstants,
} from "../Utility/Constants";
import { IFrameConstants, IFrameHelper } from "../Utility/IFrameHelper";

export class BasePage {
  protected isBaseClosed = false;
  constructor(protected _page: Page) {}

  public get Page(): Page {
    return this._page;
  }

  public set Page(page: Page) {
    this._page = page;
  }

  public async closePage() {
    if (this.isBaseClosed) {
      return;
    }
    await this._page.close();
    this.isBaseClosed = true;
  }

  public async scrollTo(selector: string) {
    await this.Page.evaluate(
      (param) => {
        document.querySelector(param.selector).scrollIntoView();
      },
      { selector: selector }
    );
  }

  public async waitUntilSelectorIsVisible(
    selectorVal: string,
    maxCount = 3,
    page: Page = null,
    timeout: number = Constants.DefaultTimeout
  ) {
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

  public async retry(cpage: Page, callback, count: number, delayMS: number) {
    await retry(cpage, callback, count, delayMS);
  }

  public async waitUntilChatSelectorIsVisible(
    selector: string,
    maxCount: number = Constants.Three,
    timeout: number = Constants.DefaultTimeout
  ) {
    let dataCount = 0;
    while (dataCount < maxCount) {
      try {
        const liveChatiframeName = await this.Page.$(
          SelectorConstants.liveChatiframeName
        );
        const chatiFrame = await liveChatiframeName.contentFrame();
        await chatiFrame.waitForSelector(selector, { timeout });
        return true;
      } catch {}
      dataCount++;
    }
    return false;
  }

  public async waitForChatControlLoad() {
    await this.waitUntilSelectorIsVisible(
      SelectorConstants.liveChatiframeName,
      Constants.Four,
      null,
      Constants.MaxTimeout
    );
    await this.waitUntilChatSelectorIsVisible(
      SelectorConstants.ChatContentWrapperElementSelector,
      Constants.Two,
      Constants.MaxTimeout
    );
    await this.waitUntilChatSelectorIsVisible(
      SelectorConstants.ChatClose,
      Constants.Five,
      Constants.FourThousandsMiliSeconds
    );
  }

  public async waitForConvControl() {
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

  /// </summary>
  /// This method is used to clear unused chat conversation from agent end which generally remains unclosed if some test case failed.
  /// </summary>
  public async closeUnusedChatSession() {
    try {
      const iframeCC = await IFrameHelper.GetIframe(
        this._page,
        IFrameConstants.IframeCC
      );
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
    } catch {}
  }

  public async setAgentPresenceAsAvailable() {
    await this.waitUntilSelectorIsVisible(
      AgentChatConstants.AvailabilityStatusBusyXPath,
      AgentChatConstants.Five,
      null,
      AgentChatConstants.FourThousand
    );
    await this._page.click(AgentChatConstants.AgentStatusButton);
    const timeout: number = Constants.FiveThousand;
    const selectElement = await this._page.waitForSelector(
      AgentChatConstants.SelectStatusElement,
      { timeout }
    );
    selectElement.selectOption({
      label: AgentChatConstants.Available.toString(),
    });
    await this._page.waitForSelector(AgentChatConstants.AgentStatusOkButton, {
      timeout,
    });
    await this._page.click(AgentChatConstants.AgentStatusOkButton);
  }

  public async clickActiveChatNotification() {
    const activeChat = await this.Page.waitForSelector(
      AgentChatConstants.OpenedActiveChat
    );
    await activeChat.click();
  }

  public async CloseActiveChatSession() {
    while (
      (await this.Page.$$(AgentChatConstants.OpenedActiveChat)).length > 0
    ) {
      try {
        await this.clickActiveChatNotification();
        await this.closeUnusedChatSession();
      } catch {}
    }
  }

  public async setAgentPresenceAsBusyDND() {
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
    await this._page.waitForTimeout(Constants.DefaultAverageTimeout);
    await this._page.waitForSelector(SelectorConstants.AgentStatusOkButton, {
      timeout,
    });
    await this._page.click(SelectorConstants.AgentStatusOkButton);
  }

  public async closeGlobalSearchPopUp() {
    try {
      const popUpVisiable = await this.waitUntilSelectorIsVisible(
        SelectorConstants.CloseGlobalSearchPopUpBtnSelector,
        Constants.Two,
        null,
        Constants.TwoThousand
      );
      if (popUpVisiable)
        await this._page.click(
          SelectorConstants.CloseGlobalSearchPopUpBtnSelector
        );
    } catch (err) {
      console.log(
        `Method closeGlobalSearchPopUp throwing exception with message: ${err.message}`
      );
    }
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

  public async waitForAgentStatusIcon() {
    return await this.waitUntilSelectorIsVisible(
      SelectorConstants.AvailabilityStatusBusyXPath,
      Constants.Twenty,
      this._page,
      Constants.FiveThousand
    );
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
      await iframe.waitForSelector(AgentChatConstants.Translationsclick);
      await iframe.$eval(AgentChatConstants.Translationsclick, (el) => {
        (el as HTMLElement).click();
      });
    } else {
    }
  }
}

// This method required to arbitrarily wait and get all system messages to wait needed system message when it appears
const retry = async (cpage: Page, callback, count: number, delayMS: number) => {
  while (count != 0) {
    try {
      await callback();
      return;
    } catch (error) {
    } finally {
      count--;
      await cpage.waitForTimeout(delayMS);
    }
  }
};
