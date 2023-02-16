import { Page } from "@playwright/test";
import { InsightsConstants } from "../../../utils/app.constants";
import { LoadState } from "../../../utils/test.utils";
import * as selectors from "../../selectors.json";

export class InsightsPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }
 
  public async navigateToSuggestionsForAgents() {
    await this.page
      .getByText( InsightsConstants.Insights, { exact: true })
      .click();
    await this.page
      .locator(selectors.CustomerServiceAdminPage.SuggestionsForAgentsManage)
      .click();     
    await this.page.waitForLoadState(LoadState.DomContentLoaded);
  }
}
