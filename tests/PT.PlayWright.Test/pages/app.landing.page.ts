import { Locator, Page } from "@playwright/test";
import * as selectors from "./selectors.json";
import { AppNames } from "../utils/app.constants";
import { LoadState, stringFormat } from "../utils/test.utils";
import { CustomerServiceAdminAppsPage } from "./livechat/apps/customer.service.admin.center";
import { CustomerServiceWorkspaceAppsPage } from "./livechat/apps/customer.service.workspace";
import { BasePage } from "./base.page";
import { CustomProfilePage } from "./livechat/appprofile/custom.profile.page";
import { ChannelIntegrationFrameworkAppsPage } from "./livechat/apps/channel.integration.framework";

export class AppLandingPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  public getApp(appName: string): Locator {
    return this.page
      .frameLocator(selectors.AppsLandingPage.AppLandingPageIframe)
      .locator(stringFormat(selectors.AppsLandingPage.AppName, appName));
  }

  public async NaviateToApp(appName: string): Promise<BasePage> {
    await Promise.all([
      await this.page.waitForNavigation(),
      await this.waitForDomContentLoaded(),
      await this.getApp(appName).click(),
    ]);
    await this.page.waitForLoadState(LoadState.DomContentLoaded);
    return this.GetAppsPage(appName);
  }

  public GetAppsPage(appName: string) {
    let appsPage: any;
    switch (appName) {
      case AppNames.CSAdminCenterAppName:
        appsPage = new CustomerServiceAdminAppsPage(this.page);
        break;
      case AppNames.CSWorkspaceAppName:
        appsPage = new CustomerServiceWorkspaceAppsPage(this.page);
        break;
      case AppNames.ChannelIntegrationAppName:
        appsPage = new ChannelIntegrationFrameworkAppsPage(this.page);
        break;
    }
    return appsPage;
  }
}
