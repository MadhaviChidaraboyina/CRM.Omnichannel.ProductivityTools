import { Page } from "playwright";
import { Constants } from "../../common/constants";
import { BasePage } from "pages/BasePage";
import { ConstantMS } from "../MultiSessionTestcases/msConstants";

export class FunctionMS extends BasePage {
  adminPage: any;
  constructor(page: Page) {
    super(page);
    this.adminPage = page;
  }

  public async GoToServiceTerms() {
    await this.adminPage.waitForSelector(ConstantMS.ServiceTermsSiteMapBtn);
    await this.adminPage.click(ConstantMS.ServiceTermsSiteMapBtn);
    await this.adminPage.waitForSelector(ConstantMS.ManageEntitlements);
    await this.adminPage.click(ConstantMS.ManageEntitlements);
  }
}