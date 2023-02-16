import { Page } from "@playwright/test";
import * as selectors from "../../selectors.json";
import { NotificationMessageButtonNameRegex } from "../../../utils/livechat/livechat.constants";
import { ElementRoles } from "../../../utils/test.utils";

export class Notifications {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  public async performResetPresence() {
    await this.GetResetPresenceButtonLocator().click();
  }

  public async verifyNotificationPopup() {
    try {
      const acceptBtn = await this.GetAcceptButtonLocator();
      await acceptBtn.waitFor({ state: "visible" });
      const notification = await acceptBtn.isVisible();
      return notification;
    } catch {
      console.log(`Notification did not appear`);
    }
    return false;
  }

  private GetAcceptButtonLocator() {
    return this.page.locator(selectors.PresencePage.AcceptButtonId);
  }

  private GetResetPresenceButtonLocator() {
    return this.page.getByRole(ElementRoles.Button, {
      name: selectors.PresencePage.ResetPresenceButtonName,
    });
  }

  private GetNotificationMessageButtonLocator() {
    return this.page.getByRole(ElementRoles.Button, {
      name: NotificationMessageButtonNameRegex,
    });
  }
}
