import { Page } from "@playwright/test";
import {
  agentchatconstants,
  AppProfileConstants,
} from "../../../utils/app.constants";
import {
  ElementLabel,
  ElementRoles,
  KeyboardKeys,
  LoadState,
} from "../../../utils/test.utils";
import * as selectors from "../../selectors.json";

export class WorkSpacesPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  public async navigateToCustomPresence() {
    await this.page
      .getByRole(ElementRoles.Treeitem, {
        name: AppProfileConstants.Productivity,
      })
      .getByText(AppProfileConstants.Productivity)
      .click();
    await this.page
      .locator(selectors.PresencePage.CustomPresenceManage)
      .click();
  }

  public async createCustomPresence(
    customPresence: string,
    presenceState: string
  ) {

    await this.page.getByRole(AppProfileConstants.RowGroup).first().click();

    if (await this.CheckIfPresenceExists(customPresence)) {
      return;
    }

    await this.page
      .getByRole(ElementRoles.Menubar, {
        name: AppProfileConstants.PresenceCommands,
      })
      .getByRole(ElementRoles.MenuItem, { name: AppProfileConstants.New })
      .click();
    await this.page.getByLabel(ElementLabel.Name).click();
    await this.page.getByLabel(ElementLabel.Name).fill(customPresence);
    await this.page.getByLabel(ElementLabel.PresenceText).click();
    await this.page.getByLabel(ElementLabel.PresenceText).fill(customPresence);
    await this.page
      .getByRole(ElementRoles.Combobox, {
        name: AppProfileConstants.BaseStatus,
      })
      .selectOption(presenceState);
    await this.page
      .getByRole(ElementRoles.MenuItem, { name: AppProfileConstants.SaveClose })
      .click();
      
      await this.page.getByRole(AppProfileConstants.RowGroup).first().click();
  }

  public async deleteCustomPresence(customPresence: string) {
    await this.page
      .getByPlaceholder(AppProfileConstants.FilterByKeyword)
      .click();
    await this.page
      .getByPlaceholder(AppProfileConstants.FilterByKeyword)
      .fill(customPresence);
    await this.page
      .getByPlaceholder(AppProfileConstants.FilterByKeyword)
      .press(KeyboardKeys.Enter);
    await this.page
      .getByRole(ElementRoles.Columnheader, {
        name: AppProfileConstants.Toggle,
      })
      .getByText(AppProfileConstants.ToggleButton)
      .click();
    await this.page.locator(selectors.AppProfilePage.DeleteBtn).click();
    await this.page
      .getByRole(ElementRoles.Button, { name: AppProfileConstants.Delete })
      .click();
    await this.page
      .getByRole(ElementRoles.Button, { name: AppProfileConstants.ClearSearch })
      .click();
  }

  public async waitForResponseProviderUrl() {
    await this.page.waitForResponse(
      (res) =>
        res.url().includes(selectors.ChannelIntegrationPage.ChannelURL) &&
        res.status() == 200
    );
  }

  public async CheckIfPresenceExists(presence: string) {
    await this.page.getByRole('button', { name: AppProfileConstants.Name }).click();
    return await this.page.getByRole('link', { name: presence }).isVisible();
  }
  
  public async modifyQueueInWorkstream() {
    await this.page.getByText(agentchatconstants.Workstreams).click();
    await this.page
      .getByPlaceholder(agentchatconstants.SearchWorkstreams)
      .click();
    await this.page
      .getByPlaceholder(agentchatconstants.SearchWorkstreams)
      .fill(agentchatconstants.EntitysessionWs);
    await this.page
      .getByPlaceholder(agentchatconstants.SearchWorkstreams)
      .press(KeyboardKeys.Enter);
    await this.page
      .getByRole(ElementRoles.Button, {
        name: agentchatconstants.EntitysessionWs,
      })
      .click();
    await this.page.waitForLoadState(LoadState.DomContentLoaded);
    await this.page.locator(selectors.livechatConstants.FallbackQueue).click();
    await this.page.waitForTimeout(3000);
    await this.page
      .locator('[data-test-id="FCQExistingDropdown"]')
      .filter({ hasText: "" })
      .click();
    await this.page.waitForTimeout(3000);
    await this.page
      .getByRole(ElementRoles.Option, { name: agentchatconstants.EntityQueue })
      .click();
    await this.page
      .locator(selectors.livechatConstants.FQPSaveAndClose)
      .click();
    await this.page
      .locator(selectors.livechatConstants.HideAdvancedSettings)
      .click();
    await this.page
      .locator('[data-test-id="session-template-edit-button"]')
      .click();
    await this.page.waitForTimeout(5000);
    await this.page
      .locator('[data-test-id="session-template-dropdown"]')
      .click();
    await this.page.waitForTimeout(5000);
    await this.page
      .getByRole("option", { name: "Entity records session - default" })
      .click();
    await this.page
      .locator('[data-test-id="session-template-confirmation-button"]')
      .click();
    await this.page.waitForTimeout(2000); // to save properly
  }
}
