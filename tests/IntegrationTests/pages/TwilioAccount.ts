import { ChannelsEventsConstants, Constants, SelectorConstants } from "../Utility/Constants";
import { Page, selectors } from "playwright";

import { AdminPage } from "./AdminPage";
import { TestSettings } from "../configuration/test-settings";
import { WorkStreamsPage } from "./WorkStreams";

export enum TwilioTab {
  AutomatedMessages = "tablist-AutomatedMessages_tab"
}

export class TwilioAccountPage extends WorkStreamsPage {
  private SMSNumber: string;
  private SMSNumberForTwilio: string;
  constructor(page: Page) {
    super(page);
    this.SMSNumber = TestSettings.SMSNumber;
    this.SMSNumberForTwilio = TestSettings.SMSNumberTwilio;
  }

  public async getSMSNumber() {
    return this.SMSNumber;
  }
  public async getTwilioSMSNumber() {
    return this.SMSNumberForTwilio;
  }

  public async navigateToSMSNumberGrid() {
    await this.waitForDomContentLoaded();
    this.Page.click(SelectorConstants.SMSNumberSubGridAddNew);
    await this.waitForDomContentLoaded();
  }

  public async validateSMSData() {
    await this.Page.click(SelectorConstants.ValidateButton);
    await this.waitUntilSelectorIsVisible(SelectorConstants.ValidateButton);
  }

  public async fillSMSNumbersForm() {
    await this.waitForDomContentLoaded();
    await this.fillInputData(SelectorConstants.SMSNumberInput, this.SMSNumber);
    await this.Page.click(SelectorConstants.FormSaveAndCloseButton);
    await this.waitUntilSelectorIsVisible(SelectorConstants.SMSNameTitle);
  }

  public async fillSMSNumbersFormForTwilio() {
    await this.Page.waitForNavigation();
    await this.fillInputData(
      SelectorConstants.SMSNumberInput,
      this.SMSNumberForTwilio
    );
    await this.Page.waitForTimeout(Constants.DefaultTimeout);
    await this.Page.waitForSelector(SelectorConstants.FormSaveAndCloseButton);
    await this.Page.click(SelectorConstants.FormSaveAndCloseButton);
    await this.waitForSaveComplete();
    await this.waitForDomContentLoaded();
    await this.Page.waitForTimeout(Constants.DefaultTimeout);
  }

  public async navigateToTab(tabName: string) {
    await this.Page.click(
      SelectorConstants.WorkStreamTab.replace("{0}", tabName)
    );
  }

  public async validateRESTAPI() {
    const message = Constants.TostValidationMessage as string;
    return await this.waitTillTextChange(
      SelectorConstants.ToastNotificationListRoot,
      message
    );
  }

  public async validateSuccessfulSMSData() {
    const message = Constants.TostSuccessfulMessage as string;
    return await this.waitTillTextChange(
      SelectorConstants.ToastNotificationListRoot,
      message
    );
  }

  public async validateSMSNumberAdd() {
    await this.waitForDomContentLoaded();
    const gridItemSelector = SelectorConstants.SMSNumberGridItem.replace(
      "{0}",
      this.SMSNumber
    );
    const gridItem = await this.Page.waitForSelector(gridItemSelector);
    const gridItemValue = await gridItem.textContent();
    return gridItemValue == this.SMSNumber;
  }

  public async validateSMSNumberAddForTwilio() {
    await this.waitForDomContentLoaded();
    const gridItemSelector = SelectorConstants.SMSNumberGridItem1.replace(
      "{0}",
      this.SMSNumberForTwilio
    );
    const gridItem = await this.Page.waitForSelector(gridItemSelector);
    const gridItemValue = await gridItem.textContent();
    return gridItemValue == this.SMSNumberForTwilio;
  }

  public async SaveSMSData() {
    await this.Page.click(SelectorConstants.FormSaveButton);
    await this.waitForDomContentLoaded();
    await this.Page.waitForTimeout(Constants.DefaultTimeout);
  }

  public async navigateToSMSTabView() {
    await this.Page.click(SelectorConstants.SMSTabMenuItem);
    await this.waitForDomContentLoaded();
    await this.Page.waitForTimeout(Constants.DefaultTimeout);
  }

  public async clickSMSrecord() {
    await this.Page.fill(
      SelectorConstants.QuicksearchSMS,
      this.SMSNumberForTwilio
    );
    await this.Page.click(SelectorConstants.QuicksearchSMSbutton);
    await this.Page.click(SelectorConstants.LineFinalUserSelect);
    await this.Page.click(SelectorConstants.SMSWorkstreamDataID);
    await this.waitForDomContentLoaded();
    await this.Page.click(SelectorConstants.SMSWorkStreamDelete);
    await this.Page.click(SelectorConstants.SMSConfirmDeleteLine);

    const message = Constants.RecordCannotbeDeleted as string;
    return await this.waitTillTextChange(
      SelectorConstants.PopupMessage,
      message
    );
  }

  public async ClickOKButton() {
    await this.Page.click(SelectorConstants.ClickOKButton);
  }

  public async navigateToAutomatedMessagesTab() {
    await this.waitForDomContentLoaded();
    await this.Page.click(
      SelectorConstants.WorkStreamTab.replace("{0}", TwilioTab.AutomatedMessages)
    );
  }

  public async clickNewAutomatedMessageButton() {
    const newAutoMessege = await this.Page.waitForSelector(SelectorConstants.ChatWidgetNew);
    await newAutoMessege.click();
  }

  public async getChannelAutomatedMessageTriggers()
  {
    return ChannelsEventsConstants.SMS;
  }
}
