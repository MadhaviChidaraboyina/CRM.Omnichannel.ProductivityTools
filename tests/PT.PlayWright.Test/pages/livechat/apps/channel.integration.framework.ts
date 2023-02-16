import { Page } from "@playwright/test";
import { BasePage } from "../../base.page";
import { ChannelIntegrationFrameworkPage } from "../agent/channel.integration.framework";

export class ChannelIntegrationFrameworkAppsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  public get ChannelIntegrationFrameworkPage(): ChannelIntegrationFrameworkPage {
    return new ChannelIntegrationFrameworkPage(this.page);
  }
}
