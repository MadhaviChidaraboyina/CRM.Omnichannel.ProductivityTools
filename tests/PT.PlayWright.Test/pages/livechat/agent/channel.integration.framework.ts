import { Page } from "@playwright/test";
import {
  ElementLabel,
  ElementRoles,
  KeyboardKeys,
  LoadState,
  Timeouts,
} from "../../../utils/test.utils";
import * as selectors from "../../../pages/selectors.json";
import { ChannelIntegrationConstants } from "../../../utils/channel.integrations/channel.integration.constants";
import {
  EntityAttributes,
  EntityLogicalName,
} from "../../../utils/app.constants";
import { ChannelProviderConstants } from "../../../utils/app.constants";

export class ChannelIntegrationFrameworkPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  public async modifyChannelOrder(channelName: string, order: any) {
    await this.page
      .locator(selectors.ChannelIntegrationPage.RefreshBtn)
      .click();
    await this.page
      .getByPlaceholder(ChannelIntegrationConstants.FilterByKeyword)
      .click();
    await this.page
      .getByPlaceholder(ChannelIntegrationConstants.FilterByKeyword)
      .fill(channelName);
    await this.page
      .getByPlaceholder(ChannelIntegrationConstants.FilterByKeyword)
      .press(KeyboardKeys.Enter);
    await this.page
      .getByRole(ElementRoles.Link, { name: channelName })
      .first()
      .click();
    await this.page.waitForLoadState(LoadState.DomContentLoaded);
    await this.page.getByLabel(ElementLabel.ChannelOrder).locator;
    await this.page.getByLabel(ElementLabel.ChannelOrder).click();
    await this.page.getByLabel(ElementLabel.ChannelOrder).fill(order);
    await this.page.waitForTimeout(Timeouts.DefaultTimeout); //Needed to fill order properly
    await this.page
      .locator(selectors.ChannelIntegrationPage.SaveAndCloseButton)
      .click();
    await this.page.waitForTimeout(Timeouts.FiveTimeout); //Needed to save&close properly
    await this.page.locator(selectors.ChannelIntegrationPage.Grid).isVisible();
  }

  public async deleteAllChannelProviders() {
    await this.page.locator("(//i[@data-icon-name='CheckMark'])[1]").click();
    await this.page
      .locator(
        "[data-id='msdyn_ciprovider|NoRelationship|HomePageGrid|Mscrm.HomepageGrid.msdyn_ciprovider.DeleteMenu']"
      )
      .click();
    await this.page.locator("[data-id='confirmButton']").click();
  }
}
