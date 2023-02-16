import { Page, expect } from "@playwright/test";
import { ElementRoles } from "../../../utils/test.utils";
import * as selectors from "../.././selectors.json";

export class PresenseStatusPageToRemove {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  public async setAgentPresenseStatus(setToStatus: string, statusText: string) {
    await this.page.locator(selectors.PresencePage.AgentStatus).isVisible();

    const response = await this.page.waitForResponse((resp) =>
      resp.url().includes("Constants.GetPresence")
    );
    if (response.status() == 200) {
      let isPresenceStatus = await this.page
        .getByRole(ElementRoles.MenuItem, { name: setToStatus })
        .isVisible();
      if (!isPresenceStatus) {
        await this.page.click(selectors.PresencePage.PresenceDialog);
        const status = await this.page.getByRole(ElementRoles.Combobox, {
          name: "Constants.Status",
        });
        const optionToSelect = await status
          .locator(ElementRoles.Option, { hasText: statusText })
          .textContent();
        await status.selectOption({ label: optionToSelect || "" });
        await this.page
          .getByRole(ElementRoles.Dialog)
          .getByRole(ElementRoles.Button, { name: "Constants.OK" })
          .click();
        const responseStatus = await this.page.waitForResponse((resp) =>
          resp.url().includes("Constants.SetPresence")
        );
        if (responseStatus.status() == 200) {
          console.log("setStatus");
          const setStatus = await this.page
            .getByRole(ElementRoles.MenuItem, {
              name: setToStatus,
            })
            .isVisible();
          console.log(setStatus);
        } else {
          console.log(responseStatus.status());
        }
      }
    }
  }

  public async verifyAgentPresenseStatus(agentStatus: string) {
    let status = await this.page.locator(agentStatus).isVisible();
    expect(status).toBeTruthy();
  }

  public async verifyAgentLoginResponse() {
    await this.page.locator(selectors.PresencePage.AgentStatus).isVisible();
    let status = await this.page
      .locator(selectors.PresencePage.PresenceDialog)
      .isVisible();
    if (!status) {
      status = await this.page
        .locator(selectors.PresencePage.HelpLauncher)
        .isVisible();
    }
    expect(status).toBeTruthy();
  }

  public async validateThePage(Element: string) {
    const PageValidate = await this.page.locator(Element).isVisible();
    expect(PageValidate).toBeTruthy();
  }
}
