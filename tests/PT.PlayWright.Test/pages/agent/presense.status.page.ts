import { Page, expect, Locator } from "@playwright/test";

export class PresenseStatusPageToRemove {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  public async setAgentPresenseStatus(presenceStatus: string) {
    const status = await this.page.getByRole("combobox", {
      name: "Status",
    });

    const optionToSelect = await status
      .locator("option", { hasText: presenceStatus })
      .textContent();
    await status.selectOption({ label: optionToSelect?.toString() });
    await this.page
      .getByRole("dialog")
      .getByRole("button", { name: "OK" })
      .click();
    await this.page.waitForTimeout(5000);
    const setStatus = await this.page
      .getByRole("menuitem", {
        name: optionToSelect?.toString() + " Launch presence dialog",
      })
      .isVisible();
    console.log(setStatus);
    expect(setStatus).toBeTruthy();
  }

  protected GetCurrentAgentPresenceStatusLocator(): Locator {
    return this.page.locator("Constants.AgentStatus");
  }

  protected GetAgentPresenceDialogMenuButtonLocator(): Locator {
    return this.page.locator("Constants.PresenceDialog");
  }

  public async IsAgentPresenseLoaded() {
    if (!(await this.GetCurrentAgentPresenceStatusLocator().isVisible())) {
      const response = await this.page.waitForResponse((resp) =>
        resp.url().includes("/presence/GetAllPresences")
      );
      // To load agent presnce, verify if GetAllPresences call is succeeded
      expect(response.status()).toBe(200);
    }
    return await this.GetCurrentAgentPresenceStatusLocator().isVisible();
  }

  public async verifyAgentLoginResponse() {
    let status = await this.IsAgentPresenseLoaded();
    if (!status) {
      status = await this.page.locator(`[data-id="helpLauncher"]`).isVisible();
    }
    expect(status).toBeTruthy();
  }

  public async verifyAgentLoginResponse_WaitForSelector() {
    await this.page.waitForSelector("Constants.AgentStatus");
    let status = await this.page.isVisible("Constants.PresenceDialog");
    if (!status) {
      await this.page.waitForSelector(`[data-id="helpLauncher"]`);
      status = await this.page.isVisible(`[data-id="helpLauncher"]`);
    }
    expect(status).toBeTruthy();
  }
}
