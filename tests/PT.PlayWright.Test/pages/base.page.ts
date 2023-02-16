import { expect, Page } from "@playwright/test";
import { ChatConversationControl } from "./livechat/agent/chat.conversation.control";
import { PresenseDialog } from "./livechat/agent/presence.dialog";

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  public async ClosePage() {
    await this.page.close();
  }

  public get PresenseDialog(): PresenseDialog {
    return new PresenseDialog(this.page);
  }

  public get ChatConversationControl(): ChatConversationControl {
    return new ChatConversationControl(this.page);
  }

  public async NavigateTo(orgUrl: string) {
    this.page.goto(orgUrl);
  }

  public async ValidateThePageElement(Element: string) {
    const element = await this.page.locator(Element);
    if (element) {
      return true;
    }
  }

  public async ValidateElementVisible(Element: string) {
    await this.page.waitForTimeout(5000);
    const PageValidate = await this.page.locator(Element).isVisible();
    expect(PageValidate).toBeTruthy();
  }

  public async ValidateElementNotVisible(Element: string) {
    const PageValidate = await this.page.locator(Element).isVisible();
    expect(PageValidate).toBeFalsy();
  }

  public async waitForDomContentLoaded() {
    await this.page.waitForLoadState("domcontentloaded");
  }

  public async reload() {
    await this.page.reload();
  }

  public async WaitForTimeout(timeout: number) {
    return this.page.waitForTimeout(timeout);
  }
}
