import { Page } from "@playwright/test";
import { AppProfileHelper } from "../../../helper/appprofile-helper";
import { AppProfileConstants } from "../../../utils/app.constants";
import { ElementLabel, ElementRoles } from "../../../utils/test.utils";
import { BasePage } from "../../base.page";
import * as selectors from "../../selectors.json";

export class CustomProfilePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  public async searchAppProfile(searchRecord: string) {
    let records;
    await this.page.getByText(AppProfileConstants.Workspaces).click();
    await this.page
      .locator(selectors.AppProfilePage.AgentExperienceProfile)
      .click();
    if (searchRecord !== "") {
      await this.page
        .waitForLoadState("networkidle", { timeout: 2000 })
        .catch(() => {});
      await this.page
        .locator(AppProfileConstants.QuickFindTextBox)
        .fill(searchRecord);
      await this.page.keyboard.press(AppProfileConstants.EnterKey);
    }
    const chatSelector = `//a[@title='${searchRecord}'] | //button[@title='${searchRecord}']`;
    await this.page.locator(chatSelector).click();
  }

  public async addUserToProfile() {
    await this.page.locator(selectors.AppProfilePage.AddUserBtn).click();
    await this.page.locator(selectors.AppProfilePage.AddUserSearch).click();
    await this.page
      .locator(selectors.AppProfilePage.AddUserSearch)
      .fill(AppProfileConstants.AdminUser);
    await this.page
      .getByRole(ElementRoles.Checkbox, { name: AppProfileConstants.User })
      .click();
    await this.page.locator(selectors.AppProfilePage.PanelBtn).click();
  }

  public async enableChannelProvider() {
    await this.page.locator(selectors.AppProfilePage.Edit).click();
    const toggleBtn = await this.page.locator(selectors.AppProfilePage.Toggle);
    if ((await toggleBtn.getAttribute("aria-checked")) === "false") {
      await toggleBtn.click();
    }
    await this.page
      .locator(selectors.AppProfilePage.SaveAndCloseButton)
      .click();
  }

  public async addandEditChannelProvider(channelproviderName: string) {
    await this.page.locator(selectors.AppProfilePage.Edit).click();
    await this.page
      .locator(selectors.AppProfilePage.SelectChannelProvider)
      .click();
    await this.page
      .getByText(AppProfileConstants.ToggleButton + channelproviderName)
      .click();
    await this.page
      .locator(selectors.AppProfilePage.SaveAndCloseButton)
      .click();
  }

  public async validateProvider(channelProviderName: string) {
    if (
      await this.page
        .locator(selectors.AppProfilePage.ChannelProviderContainer)
        .filter({ hasText: channelProviderName })
        .isVisible()
    )
      return true;
    else return false;
  }

  public async CreatePublicQueue(queueName: string) {
    await this.page
      .getByRole("treeitem", { name: selectors.CommonConstants.Queues })
      .locator("div")
      .nth(3)
      .click();
    await this.page.locator(selectors.CommonConstants.BasicQueueManage).click();
    await this.page
      .getByRole("menubar", { name: selectors.CommonConstants.QueueCommands })
      .getByRole("menuitem", { name: selectors.CommonConstants.New })
      .click();
    await this.page.getByLabel(selectors.CommonConstants.Name).click();
    await this.page.getByLabel(selectors.CommonConstants.Name).fill(queueName);
    await this.page.getByRole("menuitem", { name: selectors.CommonConstants.SaveClose }).click();
  }

  public async TurnOnSuggetions() {
    await this.page.getByRole('treeitem', { name: 'Insights' }).getByText('Insights').click();
    await this.page.locator('[data-test-id="Suggestions-for-Agents-manage"]').click();
    const CaseToggle = await this.page.waitForSelector('[data-testid="suggestions-case-feature-toggle"]');
    const Kbtoggle = await this.page.waitForSelector('[data-testid="suggestions-kb-feature-toggle"]');
    const kbToggleEnabled = await Kbtoggle.getAttribute("aria-checked");
    const CaseToggleEnabled = await CaseToggle.getAttribute("aria-checked");
    if ((CaseToggleEnabled.toString().toLowerCase() === false.toString()) && (kbToggleEnabled.toString().toLowerCase() === false.toString()))
    {
      //if(kb.toString().toLowerCase() === false.toString()){
      await CaseToggle.click();
      await Kbtoggle.click();
      await this.page.getByTestId('suggestions-commandbar-saveclose-btn').click();
    await this.page.waitForLoadState("load")
    }
  }
  
  public async TurnOffSuggetions() {
    await this.page.getByRole('treeitem', { name: 'Insights' }).getByText('Insights').click();
    await this.page.locator('[data-test-id="Suggestions-for-Agents-manage"]').click();
    await this.page.getByTestId('suggestions-case-feature-toggle').click();
    await this.page.getByTestId('suggestions-kb-feature-toggle').click();
    await this.page.getByTestId('suggestions-commandbar-save-btn').click();
    await this.page.getByTestId('suggestions-commandbar-saveclose-btn').click();
    await this.page.waitForLoadState("load")
  }
}
