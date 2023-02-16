import { Browser, FrameLocator, Locator, Page } from "@playwright/test";
import { ChatConstants } from "../../../utils/livechat/livechat.constants";
import { ElementRoles, KeyboardKeys } from "../../../utils/test.utils";
import { BasePage } from "../../base.page";
import * as selectors from "../../../pages/selectors.json";

export class LiveChatWidgetPage extends BasePage {
  readonly blobUrl: string;

  constructor(page: Page, blobUrl: string) {
    super(page);
    this.blobUrl = blobUrl;
  }

  public getLCWFrameLocator(): FrameLocator {
    return this.page.frameLocator(selectors.PresencePage.LCWFrame);
  }

  public getLetsChatButtonLocator(): Locator {
    return this.getLCWFrameLocator().getByRole(ElementRoles.Button, {
      name: selectors.PresencePage.LetsChatButtonName,
    });
  }

  public getCloseChatButtonLocator(): Locator {
    return this.getLCWFrameLocator().getByRole(ElementRoles.Button, {
      name: selectors.PresencePage.CloseChatButtonName,
    });
  }

  public getConfirmCloseChatButtonLocator(): Locator {
    return this.getLCWFrameLocator().getByRole(ElementRoles.Button, {
      name: selectors.PresencePage.ConfirmClose,
    });
  }

  public async OpenLCWUrl(widgetName: string) {
    await this.page.goto(`${this.blobUrl}/${widgetName}.html`);
  }

  public async startChat() {
    await this.getLetsChatButtonLocator().click();
  }

  public async closeChat() {
    await this.page
      .frameLocator(selectors.PresencePage.LCWFrame)
      .getByRole(ElementRoles.Button, { name: ChatConstants.Close })
      .click();
    await this.page
      .frameLocator(selectors.PresencePage.LCWFrame)
      .locator(selectors.PresencePage.ConfirmClose)
      .click();
    await this.page.waitForTimeout(2000);
  }

  public async closeChat1() {
    const liveChatiframeName = await this.page.$(
      selectors.livechatConstants.liveChatiframeName
    );
    const iFrame = await liveChatiframeName?.contentFrame();
    await iFrame?.waitForSelector(selectors.livechatConstants.closeChat);
    await iFrame?.$eval(selectors.livechatConstants.closeChat, (el) =>
      (el as HTMLElement).click()
    );
    await iFrame?.waitForSelector(
      selectors.livechatConstants.confirmaCloseChat
    );
    await iFrame?.$eval(selectors.livechatConstants.confirmaCloseChat, (el) =>
      (el as HTMLElement).click()
    );
  }

  public async sendMsg() {
    await this.page
      .frameLocator(selectors.PresencePage.LCWFrame)
      .getByPlaceholder(ChatConstants.TypeMsg)
      .click();
    await this.page
      .frameLocator(selectors.PresencePage.LCWFrame)
      .getByPlaceholder(ChatConstants.TypeMsg)
      .fill(ChatConstants.Msg);
    await this.page
      .frameLocator(selectors.PresencePage.LCWFrame)
      .getByPlaceholder(ChatConstants.TypeMsg)
      .press(KeyboardKeys.Enter);
  }

  public async SendMessage(message: string) {
    await this.page
      .frameLocator("#Microsoft_Omnichannel_LCWidget_Chat_Iframe_Window")
      .getByPlaceholder("Type your message")
      .click();
    await this.page
      .frameLocator("#Microsoft_Omnichannel_LCWidget_Chat_Iframe_Window")
      .getByPlaceholder("Type your message")
      .fill(message);
    await this.page
      .frameLocator("#Microsoft_Omnichannel_LCWidget_Chat_Iframe_Window")
      .getByRole("button", { name: "Send" })
      .click();
  }

  public async sendMessageRequiredTimes(count: any) {
    for (let i = 0; i < count; i++) {
      await this.sendMsg();
    }
  }

  public async SendMultipleMessages(count: number) {
    var i: number = 0;
    for (i = 1; i <= count; i++) {
      await this.page
        .frameLocator("#Microsoft_Omnichannel_LCWidget_Chat_Iframe_Window")
        .getByPlaceholder("Type your message")
        .click();
      await this.page
        .frameLocator("#Microsoft_Omnichannel_LCWidget_Chat_Iframe_Window")
        .getByPlaceholder("Type your message")
        .fill("test message " + i);
      await this.page
        .frameLocator("#Microsoft_Omnichannel_LCWidget_Chat_Iframe_Window")
        .getByRole("button", { name: "Send" })
        .click();
    }
  }
}
