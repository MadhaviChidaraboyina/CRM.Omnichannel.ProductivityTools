import { AutomatedMessagesPageConstants, Constants, FormConstants, PageConstants, SelectorConstants } from "../Utility/Constants";
import { BrowserContext, ElementHandle, Frame, Page } from "playwright";

import { TestSettings } from "../configuration/test-settings";
import { TimeoutConstants } from "../constants";
import { Util } from "../Utility/Util";
import { constants } from "buffer";

export enum QueueType {
  Messaging = "192350000",
  Entity = "192350001",
}

export class BasePage {
  protected _page: Page;
  private _orgUrl;
  constructor(page: Page) {
    this._page = page;
    this._orgUrl = TestSettings.OrgUrl;
  }
  public get Page(): Page {
    return this._page;
  }
  public set Page(page: Page) {
    this._page = page;
  }
  public async closePage() {
    this.Page?.close();
  }
  public newWSTestData;

  private newWSData = {
    Name: "ActivityWS",
  };

  public newWSRuleTestData;

  private newWSRuleData = {
    Name: "IntakeRule",
  };

  public async waitForDomContentLoaded() {
    await this.Page.waitForLoadState(Constants.DomContentLoaded);
  }

  public async waitForRecordsave() {
    //once capacity is updated, it takes atleast five to six seconds to refelect in chat. Hence, below timeout is required.
    await this.Page.waitForTimeout(Constants.MaxTimeout);
  }

  public async waitForSaveComplete() {
    await this.Page.waitForSelector(SelectorConstants.SavingLoader, {
      state: "hidden",
    });
  }

  public async waitForTableReload() {
    await this.waitForDomContentLoaded();
    await this.Page.waitForSelector(FormConstants.ProgressIndicator, {
      state: "detached",
    });
    await this.Page.waitForSelector(AutomatedMessagesPageConstants.PagingText);
  }

  public async waitForGlobalAppProgressIndicator() {
    try {
      await this.Page.waitForSelector(SelectorConstants.GlobalAppProgressIndicator, {
        state: "hidden",
        timeout: Constants.MaxTimeout as number,
      });
    } catch {
      await this.Page.reload();
      await this.Page.waitForNavigation();
      await this.waitForDomContentLoaded();
    }
  }

  public async navigateToOrgUrl() {
    await Promise.all([this.Page.waitForNavigation(), this.Page.goto(this._orgUrl), this.waitForDomContentLoaded()]);
  }

  public async loginAndNavigateToOCAdminApp() {
    await Promise.all([this.Page.waitForNavigation(), this.Page.goto(this._orgUrl), this.waitForDomContentLoaded()]);
  }

  public async reloadPage() {
    await this.Page.reload();
  }

  public async navigateToOrgUrlAndSignIn(email: string, pwd: string) {
    let retry = 0;
    while (retry <= 3) {
      try {
        await this._signIn(email, pwd);
        retry = 4;
      } catch (e) {
        retry++;
        if (retry >= 4) {
          throw e;
        }
      }
    }
  }

  private async _signIn(email: string, pwd: string) {
    await this.navigateToOrgUrl();
    await this.waitUntilSelectorIsVisible(SelectorConstants.SignInEmailInput, Constants.Three, this.Page, Constants.MaxTimeout);
    await this.Page.fill(SelectorConstants.SignInEmailInput, email, {
      timeout: Number(Constants.MaxTimeout),
    });
    await this.Page.waitForTimeout(Constants.DefaultTimeout);
    await this.Page.fill(SelectorConstants.SignInEmailInput, email);
    await this.Page.waitForTimeout(Constants.DefaultTimeout);
    await this.Page.fill(SelectorConstants.SignInEmailInput, email);
    await this.waitUntilSelectorIsVisible(SelectorConstants.SignInNextButton, Constants.Three, this.Page, Constants.MaxTimeout);
    await this.Page.click(SelectorConstants.SignInNextButton);
    await this.waitUntilSelectorIsVisible(SelectorConstants.SignInPasswordInput, Constants.Three, this.Page, Constants.MaxTimeout);
    await this.Page.fill(SelectorConstants.SignInPasswordInput, pwd);
    await this.Page.waitForTimeout(Constants.DefaultTimeout);
    await this.Page.fill(SelectorConstants.SignInPasswordInput, pwd);
    await this.Page.fill(SelectorConstants.SignInPasswordInput, pwd);
    await this.waitUntilSelectorIsVisible(SelectorConstants.SignInSignInButton, Constants.Three, this.Page, Constants.MaxTimeout);
    const signInButton = await this.Page.waitForSelector(SelectorConstants.SignInSignInButton);
    await signInButton.click();
    await this.navigateToOrgUrl();
    await this.validateLandingPage();
  }

  private async validateLandingPage() {
    await this.waitUntilSelectorIsVisible(SelectorConstants.HomePageButton, Constants.Five, this.Page, Constants.MaxTimeout);
    const homePageButton = await this.Page.waitForSelector(SelectorConstants.HomePageButton);
    const homePageButtonText = await homePageButton.textContent();
    if (homePageButtonText != Constants.HomePageText) {
      throw new Error("unable to sign-in!");
    }
  }

  public async goToMyApp(appName: string) {
    await this.Page.waitForTimeout(Constants.DefaultTimeout);
    await this.Page.waitForSelector("iframe", {
      timeout: TimeoutConstants.Minute,
    });
    const elementHandle = await this.Page.$(SelectorConstants.MainContentFrame);
    const frame = await elementHandle.contentFrame();
    const selector = `div[title='${appName}']`;
    await this.waitUntilFrameSelectorIsVisible(selector, frame, Constants.Three, Constants.MaxTimeout);
    const tile = await frame.waitForSelector(selector);
    await tile.click();
    await this.Page.waitForTimeout(Constants.DefaultTimeout);
    await this.waitForDomContentLoaded();
  }

  public async goToNavigationMyApp(appName: string) {
    const elementHandle = await this.Page.$(SelectorConstants.NavigateFrame);
    const frame = await elementHandle.contentFrame();
    const selector = `div[title='${appName}']`;
    const tile = await frame.waitForSelector(selector);
    await tile.click();
    await this.waitForDomContentLoaded();
  }

  public async fillInputData(selector: string, data: string, defaultValue = "---") {
    await this.fillInputWithData(selector, data, defaultValue, x => x.getAttribute("value"));
  }

  public async fillTextAreaData(selector: string, data: string, defaultValue = "Select to enter data") {
    await this.fillInputWithData(selector, data, defaultValue, x => x.value);
  }

  public async fillInputWithData(selector: string, data: string, defaultValue: string, inputGetterFunc: (x: any) => string) {
    let result = false;
    const input = await this.Page.waitForSelector(selector);
    await this.Page.focus(selector);
    while (!result) {
      const currentData = await this.Page.evaluate(inputGetterFunc, input);
      if (currentData == null || currentData === "" || currentData === defaultValue || currentData === undefined) {
        await this.Page.fill(selector, data);
        await this.Page.waitForTimeout(50);
      } else {
        result = true;
      }
    }
  }

  public async checkInputValue(selector: string, checkValue: string, timeout: number = 2000) {
    let elapsed = 0;
    let result = null;
    const input = await this.Page.waitForSelector(selector);
    await this.Page.focus(selector);
    while (result != checkValue) {
      result = await this.Page.evaluate((x: any) => x.value, input);
      await this.Page.waitForTimeout(50);
      elapsed += 50;
      if (elapsed >= timeout) {
        break;
      }
    }
  }

  public async overwriteInputWithData(selector: string, data: string) {
    await this.Page.focus(selector);
    await this.Page.fill(selector, data);
    await this.Page.waitForTimeout(50);
  }

  public async openNewRecordForm(isFocusOnForm: boolean = true) {
    await this.waitForDomContentLoaded();
    const newForm = await this.Page.waitForSelector(SelectorConstants.NewRecord);
    if (isFocusOnForm) {
      await newForm.focus();
    }
    await this.Page.click(SelectorConstants.NewRecord, {
      force: true,
    });
    await this.waitForDomContentLoaded();
  }

  public async openNewWorkStream(isFocusOnForm: boolean = true) {
    await this.waitForDomContentLoaded();
    const newForm = await this.Page.waitForSelector(SelectorConstants.NewWorkStream);
    if (isFocusOnForm) {
      await newForm.focus();
    }
    await this.Page.click(SelectorConstants.NewWorkStream, {
      force: true,
    });
    await this.waitForDomContentLoaded();
  }

  public async fillWorkstreamInfo() {
    this.newWSTestData = `${this.newWSData.Name}_${new Date().getTime()}`;
    await this.waitForDomContentLoaded();
    await this.fillInputData(SelectorConstants.WSNameInput, this.newWSTestData);
    const WorkStremtype = await this.Page.waitForSelector(SelectorConstants.NewWorkStreamType);
    await WorkStremtype.focus();
    await this.Page.click(SelectorConstants.NewWorkStreamType);
    await this.Page.click(SelectorConstants.NewWorkStreamTypeRecord);
    const newRecordType = await this.Page.waitForSelector(SelectorConstants.NewRecordTypeOption);
    await newRecordType.focus();
    await this.Page.click(SelectorConstants.NewRecordTypeOption);
    await this.Page.click(SelectorConstants.NewRecordTypeOptionEmail);
    const CreateRecord = await this.Page.waitForSelector(SelectorConstants.Createrecordbutton);
    await CreateRecord.focus();
    await this.waitForDomContentLoaded();
    await this.Page.click(SelectorConstants.Createrecordbutton);
    await this.Page.waitForTimeout(Constants.DefaultTimeout);
    await this.waitForDomContentLoaded();
  }

  public async fillWSIntakeRulesInfo() {
    const Intakerule = await this.Page.waitForSelector(SelectorConstants.CreateIntakeRule);
    await Intakerule.focus();
    await this.Page.click(SelectorConstants.CreateIntakeRule);
    this.newWSRuleTestData = `${this.newWSRuleData.Name}_${new Date().getTime()}`;
    await this.waitForDomContentLoaded();
    await this.fillInputData(SelectorConstants.RuleNameInput, this.newWSRuleTestData);
    const IntakeruleWorkstreamtype = await this.Page.waitForSelector(SelectorConstants.IntakeRuleWSType);
    await IntakeruleWorkstreamtype.focus();
    await this.Page.click(SelectorConstants.IntakeRuleWSType);
    await this.Page.click(SelectorConstants.IntakeSelectWorkstream);
    await this.waitForDomContentLoaded();
    await this.Page.click(SelectorConstants.CreateIntakerules);
    await this.Page.click(SelectorConstants.CreateWithoutCondition);
    await this.waitForDomContentLoaded();
  }
  public async waitTillTextChange(selector: string, expectedText: string) {
    try {
      return await this.Page.waitForFunction(param => document.querySelector(param.selector).textContent.includes(param.text), {
        selector: selector,
        text: expectedText,
      });
    } catch (e) {
      return false;
    }
  }

  //To create new line in channel
  public async openNewLine() {
    await this.waitUntilSelectorIsVisible(SelectorConstants.NewRecordButton, Constants.Five, null, Constants.FourThousandsMiliSeconds);
    await this.Page.click(SelectorConstants.NewRecordButton);
    await this.waitForDomContentLoaded();
  }

  public async waitForSelectorAndPerformAction(waitSelector: string, actionSelector: string, timeout = 3000) {
    let popup_is_loaded = true;
    try {
      await this.Page.waitForSelector(waitSelector, { timeout: timeout });
    } catch {
      popup_is_loaded = false;
    }
    if (popup_is_loaded) {
      await this.Page.click(actionSelector);
      await this.waitForDomContentLoaded();
      return true;
    }
    return false;
  }

  public async formSaveAndCloseButton() {
    await this.Page.click(SelectorConstants.FormSaveButton);
    await this.Page.click(SelectorConstants.FormSaveAndCloseButton);
    await this.waitForSaveComplete();
  }

  public async formSaveButton() {
    await this.Page.click(SelectorConstants.FormSaveButton);
    await this.waitForSaveComplete();
  }

  public async formDeleteAndSubmitButton() {
    await this.Page.click(SelectorConstants.FormDeleteButton);
    await this.Page.click(SelectorConstants.ConfirmButtonId);
  }

  public async formClose() {
    await this.Page.click(SelectorConstants.FormBackButton);
    try {
      await this.Page.click(SelectorConstants.CancelButton, { timeout: 2500 });
    } catch { }
  }

  public async searchCaseRecords(searchRecord = "") {
    if (searchRecord !== "") {
      await this._page.waitForLoadState("networkidle", { timeout: 2000 }).catch(() => { });
      await this.Page.fill(SelectorConstants.QuickFindTextBox, searchRecord);
      await this.Page.click(SelectorConstants.QuickFindButton);
    }
    await this.waitForDomContentLoaded();
    await this.Page.waitForTimeout(Constants.DefaultTimeout);
    const selectAll = await this.Page.waitForSelector(SelectorConstants.SelectAllLine);
    await selectAll.click();
    // const casesrecord = await this.Page.waitForSelector(
    //   SelectorConstants.SelectCasesRecord.replace('{0}', searchRecord)
    // );
    //await casesrecord.click();
    await this.waitForDomContentLoaded();
    await this.Page.waitForTimeout(Constants.MaxTimeout);
  }

  public async deleteRecords(searchRecord = "") {
    if (searchRecord !== "") {
      await this._page.waitForLoadState("networkidle", { timeout: 2000 }).catch(() => { });
      await this.Page.fill(SelectorConstants.QuickFindTextBox, searchRecord);
      await this.Page.click(SelectorConstants.QuickFindButton);
    }
    await this.waitForDomContentLoaded();
    await this.Page.waitForTimeout(Constants.DefaultTimeout);
    const selectAll = await this.Page.waitForSelector(SelectorConstants.SelectAllLine);
    await selectAll.click();
    await this.waitForDomContentLoaded();
    await this.Page.waitForTimeout(Constants.MaxTimeout);
    const deleteAll = await this.Page.waitForSelector(SelectorConstants.FormDeleteButton);
    await this.Page.waitForTimeout(Constants.DefaultTimeout);
    await deleteAll.click();
    await this.Page.waitForTimeout(Constants.DefaultTimeout);

    await this.waitForDomContentLoaded();
    const lineData = await this.Page.waitForSelector(SelectorConstants.LineTitleData);
    //Check confirm popup
    const title = await lineData.innerText();
    if (title.toLowerCase() === Constants.LineTitle.toLowerCase()) {
      const lineButton = await this.Page.waitForSelector(SelectorConstants.LineOkButton);
      await lineButton.click();
    } else {
      const deleteAllPageRecords = await this.Page.waitForSelector(SelectorConstants.ConfirmButtonId);
      await deleteAllPageRecords.click();
      await this.waitForDomContentLoaded();
      await this.Page.waitForTimeout(Constants.DefaultTimeout);
      await this.waitForGlobalAppProgressIndicator();
      const result = await this.waitForSelectorAndPerformAction(SelectorConstants.PopupErrorOkButton, SelectorConstants.PopupErrorOkButton, 1000);
      if (result) {
        await this.waitForSelectorAndPerformAction(SelectorConstants.LineOkButton, SelectorConstants.LineOkButton, 2000);
      }
      await this.waitForDomContentLoaded();
      await this.Page.waitForTimeout(Constants.MaxTimeout);
      await this.waitUntilSelectorIsVisible(SelectorConstants.FormDeleteButton);
    }
  }

  public async waitUntilSelectorIsHidden(selectorVal: string, maxCount = 5, page: Page | Frame = null, timeout: number = Constants.DefaultTimeout) {
    let dataCount = 0;
    let pageObject = page ?? this.Page;
    while (dataCount < maxCount) {
      try {
        await pageObject.waitForSelector(selectorVal, {
          state: "hidden",
          timeout,
        });
        return true;
      } catch {
        dataCount++;
      }
    }
    return false;
  }

  public async waitUntilSelectorIsEnabled(selectorVal: string, frame, maxCount = 20, timeout: number = Constants.DefaultMinTimeout) {
    let dataCount = 0;
    while (dataCount < maxCount) {
      let className = await frame.$eval(selectorVal, el => (el as HTMLElement).className);
      if (className.includes("disabled")) {
        return true;
      }
      await this.Page.waitForTimeout(timeout);
      dataCount++;
    }
    return false;
  }

  public async waitUntilSelectorIsVisible(selectorVal: string, maxCount = 3, page: Page = null, timeout: number = Constants.DefaultTimeout) {
    let dataCount = 0;
    let pageObject = page ?? this.Page;
    while (dataCount < maxCount) {
      try {
        await pageObject.waitForSelector(selectorVal, { timeout });
        return true;
      } catch {
        dataCount++;
      }
    }
    return false;
  }

  public async fillLookupField(inputSelector: string, searchSelector: string, lookupSelector: string, lookupValue: string, timeout = 2000) {
    try {
      await this.Page.waitForTimeout(Constants.DefaultTimeout);
      await this.Page.waitForSelector(inputSelector, { timeout: timeout });
      await this.fillInputData(inputSelector, lookupValue);
      await this.Page.click(searchSelector);
      await this.Page.click(lookupSelector.replace("{0}", lookupValue));
    } catch { }
  }

  // Used to search record on grid page and click on record
  public async searchRecord(record: string) {
    await this.waitUntilSelectorIsVisible(SelectorConstants.QuicksearchSMS, Constants.Two, this._page, Constants.MaxTimeout);
    await this.Page.fill(SelectorConstants.QuicksearchSMS, record);
    await this.waitUntilSelectorIsVisible(SelectorConstants.QuicksearchSMSbutton, Constants.Two, this._page, Constants.MaxTimeout);
    await this.Page.click(SelectorConstants.QuicksearchSMSbutton);
  }

  // Used to search record on grid page and click on record
  public async searchPresenceRecord(record: string) {
    await this.waitUntilSelectorIsVisible(SelectorConstants.QuicksearchPresence, Constants.Two, this._page, Constants.MaxTimeout);
    await this.Page.fill(SelectorConstants.QuicksearchPresence, record);
    await this.waitUntilSelectorIsVisible(SelectorConstants.QuicksearchSMSbutton, Constants.Two, this._page, Constants.MaxTimeout);
    await this.Page.click(SelectorConstants.QuicksearchSMSbutton);
  }

  public async searchWorkStreamRecord(record: string) {
    await this.waitUntilSelectorIsVisible(SelectorConstants.QuicksearchWorkStream, Constants.Two, this._page, Constants.MaxTimeout);
    await this.Page.fill(SelectorConstants.QuicksearchWorkStream, record);
  }

  // Used to search record on grid page and click on record
  public async searchRecordAndClick(record: string) {
    await this.waitUntilSelectorIsVisible(SelectorConstants.QuicksearchSMS, Constants.Two, this._page, Constants.MaxTimeout);
    await this.Page.fill(SelectorConstants.QuicksearchSMS, record);
    await this.Page.click(SelectorConstants.QuicksearchSMSbutton);
    await this.waitUntilSelectorIsVisible(SelectorConstants.RecordLink.replace("{0}", record), Constants.Two, this._page, Constants.MaxTimeout);
    await this.Page.click(SelectorConstants.RecordLink.replace("{0}", record));
    await this.waitUntilSelectorIsVisible(SelectorConstants.UserNameTitle.replace("{0}", record), Constants.Three, this._page, Constants.MaxTimeout);
  }

  // Used to search record on grid page and click on record
  public async searchAndOpenFirstRecord(record: string) {
    await this.Page.waitForSelector(SelectorConstants.QuicksearchSMS);
    await this.Page.fill(SelectorConstants.QuicksearchSMS, record);
    await this.Page.click(SelectorConstants.QuicksearchSMSbutton);
    await this.Page.waitForTimeout(Constants.DefaultMinTimeout);
    await this.Page.click(SelectorConstants.GridViewFirstCell);
    await this.Page.waitForTimeout(Constants.DefaultMinTimeout);
    await this.Page.keyboard.press(Constants.EnterKey, {
      delay: TimeoutConstants.Default,
    });
  }

  // Used to quick find on grid page and click on record
  public async trySearchAndOpenFirstRecord(record: string): Promise<boolean> {
    try {
      await this._page.waitForLoadState("networkidle", { timeout: 2000 }).catch(() => { });
      await this.Page.fill(PageConstants.SearchView, record);
      await this.Page.click(PageConstants.ClickSearch);
      const chatSelector = `//a[@title='${record}'] | //button[@title='${record}']`;
      const chatToGo = await this._page.waitForSelector(chatSelector, { timeout: 5000 })
      if (chatToGo) {
        await this._page.click(chatSelector);
      }
    } catch {
      return false;
    }

    return true;
  }

  public async openFirstRecord() {
    await this.Page.click(SelectorConstants.GridViewFirstRowSecondCell);
  }

  //Validate record title
  public async validateRecordTitle(recordTitle: string) {
    return this.waitTillTextChange(SelectorConstants.FormHeaderTitle, recordTitle);
  }

  // Retrieve record Name
  public async getRecordName() {
    const recordHeader = await this.Page.textContent(SelectorConstants.RecordHeader);
    return recordHeader;
  }

  //Validate Delete Message
  public async validateDeleteRecordMessage(message: string) {
    await this.waitForDomContentLoaded();
    const title = await this.Page.waitForSelector(SelectorConstants.ErrorMessageTitle);
    const currentTitle = await title.innerText();
    return currentTitle === message;
  }

  //To delete record
  public async deleteRecord() {
    const recordDelete = await this.Page.waitForSelector(SelectorConstants.LineTryDeleteRecord);
    await recordDelete.click();
    const deleteConfirm = await this.Page.waitForSelector(SelectorConstants.ConfirmDeleteLine);
    await deleteConfirm.click();
  }

  public async clickAgree() {
    try {
      await this.waitUntilSelectorIsVisible(SelectorConstants.AgreeButton);
      const btnAggree = await this.Page.waitForSelector(SelectorConstants.AgreeButton, { timeout: TimeoutConstants.FiveSecondsDelay });
      await btnAggree.click();
      await this.waitForDomContentLoaded();
    } catch { }
  }

  public async ValidateChannels(ChannelNames: string, ExpectedChannel: string) {
    const CustomChannel = await this.Page.waitForSelector(ChannelNames);
    let title = await CustomChannel.innerText();
    return ExpectedChannel === title;
  }
  public async selectSearchedRecord(searchRecord = "") {
    if (searchRecord !== "") {
      await this.Page.fill(SelectorConstants.QuickFindTextBox, searchRecord);
      await this.Page.click(SelectorConstants.QuickFindButton);
      await this.waitForDomContentLoaded();
      await this.Page.waitForTimeout(Constants.DefaultTimeout);
    }
    const selectAll = await this.Page.waitForSelector(SelectorConstants.SelectAllLine);
    await selectAll.click();
    await this.waitForDomContentLoaded();
    await this.Page.waitForTimeout(Constants.DefaultTimeout);
    const deactivateAll = await this.Page.waitForSelector(SelectorConstants.DeactivateAll);
    await this.Page.waitForTimeout(Constants.DefaultTimeout);
    await deactivateAll.click();
    await this.Page.waitForTimeout(Constants.DefaultTimeout);
    const DeactivateConfirm = await this.Page.waitForSelector(SelectorConstants.DeactivateConfirm);
    await DeactivateConfirm.click();
  }

  public async scrollDownPage(ScrolltoTwitterHandle: string) {
    await this.Page.evaluate(
      param => {
        document.querySelector(param.selector).scrollIntoView();
      },
      { selector: ScrolltoTwitterHandle }
    );
  }

  //to delete the record available within WorkStreams in Channel for a particular account
  public async tryDeleteRecord() {
    const recordDelete = await this.Page.waitForSelector(SelectorConstants.LineTryDeleteRecord);
    await recordDelete.click();
    const deleteConfirm = await this.Page.waitForSelector(SelectorConstants.ConfirmDeleteLine);
    await deleteConfirm.click();
  }

  public async validateErrorMessage() {
    await this.waitForDomContentLoaded();
    const title = await this.Page.waitForSelector(SelectorConstants.LineErrorMessageHeading);
    const currentTitle = await title.innerText();
    return currentTitle === Constants.RecordCannotbeDeleted;
  }

  public async validateErrorWithCustomMessage(message: string) {
    await this.waitForDomContentLoaded();
    const title = await this.Page.waitForSelector(SelectorConstants.LineErrorMessageHeading);
    const currentTitle = await title.innerText();
    return currentTitle === message;
  }

  public async closeErrorMessage() {
    await this.Page.click(SelectorConstants.ErrorOK);
  }

  public async navigateToQueue() {
    this.Page.waitForNavigation();
    await this.Page.click(SelectorConstants.QueuesTabsMenuItem);
  }

  public async navigateToRTT() {
    this.Page.waitForNavigation();
    await this.Page.click(SelectorConstants.RttTabsMenuItem);
  }

  public async fillWebResourceData(WebResource: string) {
    const webResource = WebResource;
    await this.Page.waitForSelector(SelectorConstants.FormSaveButton);
    await this.waitForDomContentLoaded();
    await this.overwriteInputWithData(SelectorConstants.WebResourceName, webResource);
    await this.Page.click(SelectorConstants.FormSaveAndCloseButton);
  }

  //To search the desired value within list
  public async searchMethod(queueName: string) {
    const search = await this.Page.waitForSelector(PageConstants.SearchView);
    await search.fill(queueName);
    const clickSearch = await this.Page.waitForSelector(PageConstants.ClickSearch);
    await clickSearch.click();
  }

  public async validateQueueWithSingleQueue() {
    var queueGridValue = await this.Page.waitForSelector(PageConstants.QueueAgentGrid, { timeout: TimeoutConstants.Default });
    const queueCount = await queueGridValue.getAttribute(PageConstants.QueueDataRowCountAttribute);
    return queueCount === SelectorConstants.First;
  }

  public async abortRequest(url: string | RegExp, errorCode: string = "failed") {
    await this.Page.route(url, async route => {
      route.abort(errorCode);
    });
  }

  public async navigateToSiteMap(Menu: any) {
    await this.Page.waitForSelector(SelectorConstants.SiteMapMenu.replace("{0}", Menu));
    await this.Page.click(SelectorConstants.SiteMapMenu.replace("{0}", Menu));
    await this.waitForDomContentLoaded();
  }

  public async navigateToCustomerService() {
    await this.goToMyApp(SelectorConstants.OmnichannelCustomerService);
    await this.waitForDomContentLoaded();
  }

  public async navigateToOCCustomerService() {
    this.Page.goto(TestSettings.OrgUrl + "/main.aspx?forceUCI=1&pagetype=apps");
    await this.waitForDomContentLoaded();
    await this.goToMyApp(SelectorConstants.OmnichannelCustomerService);
  }

  //This method searches for a record and returns boolean flag based on availability
  public async searchForRecordAvailability(SearchRecordTitle: string) {
    await this.waitForDomContentLoaded();
    await this.Page.waitForSelector(SelectorConstants.QuicksearchSMS);
    await this.Page.fill(SelectorConstants.QuicksearchSMS, SearchRecordTitle);
    await this.Page.click(SelectorConstants.QuicksearchSMSbutton);
    await this.waitForDomContentLoaded();
    let title;
    try {
      const recordTitleField = await this.Page.waitForSelector(SelectorConstants.RecordLink.replace("{0}", SearchRecordTitle));
      title = (await recordTitleField).innerText();
    } catch { }
    return (await title)?.toString() == SearchRecordTitle;
  }

  protected async isAudioPlayable(timeout: number = 10000, iframe: Frame): Promise<boolean> {
    return this.isMediaPlayable(timeout, iframe, "audio");
  }

  protected async isVideoPlayable(timeout: number = 10000, iframe: Frame): Promise<boolean> {
    return this.isMediaPlayable(timeout, iframe, "video");
  }

  private async isMediaPlayable(timeout: number = 10000, iframe: Frame, tagName: 'audio' | 'video'): Promise<boolean> {
    await iframe.waitForSelector(tagName, { timeout });
    return await iframe.evaluate(async (tagName: 'audio' | 'video') => {
      try {
        const player = document.getElementsByTagName(tagName)[0];
        player.play();
        const isPlaying = !!player.duration && !player.paused;
        player.pause();

        return isPlaying;
      } catch (e) {
        return false;
      }
    }, tagName);
  }

  public async getWidgetSnippet() {
    const snippetValue = await this.Page.waitForSelector(SelectorConstants.SelectWidgetSnippet);
    const codesnippet = await snippetValue.textContent();
    return codesnippet;
  }

  public async waitUntilFrameSelectorIsVisible(selectorVal: string, frame: any, maxCount = Constants.Three, timeout: number = Constants.MaxTimeout) {
    let dataCount = 0;
    while (dataCount < maxCount) {
      try {
        await frame.waitForSelector(selectorVal, { timeout });
        return true;
      } catch {
        dataCount++;
      }
    }
    return false;
  }

  public async waitUntilSelectorIsDisabled(selectorVal: string, frame, maxCount = 20, timeout: number = Constants.DefaultMinTimeout) {
    let dataCount = 0;
    while (dataCount < maxCount) {
      let className = await frame.$eval(selectorVal, el => (el as HTMLElement).className);
      if (!className.includes("disabled")) {
        return true;
      }
      await this.Page.waitForTimeout(timeout);
      dataCount++;
    }
    return false;
  }

  public async hasText(text: string) {
    try {
      await expect(this.Page).toHaveText(text);
      return true;
    } catch (error) {
      return false;
      throw error;
    }
  }

  public async getElementAttribute(selector: string, attributeName: string) {
    await this.Page.waitForSelector(selector);
    const attributeValue = await this.Page.getAttribute(selector, attributeName);
    return attributeValue;
  }

  public async getErrorModalDialog(timeout: number = 10000): Promise<ElementHandle<HTMLElement | SVGElement>> {
    return await this.Page.waitForSelector(SelectorConstants.ModelPopupDiv, {
      timeout,
    });
  }

  public async getModalDialogMessage(timeout: number = 10000): Promise<string> {
    return await this.Page.waitForSelector(SelectorConstants.ModalDialogSubtitle, { timeout }).then(el => el.textContent());
  }

  public async navigateToChannelByName(name: string) {
    await this.waitForDomContentLoaded();
    const selectedChannel = await this.Page.waitForSelector(SelectorConstants.ChannelName.replace("{0}", name).replace("{0}", name));
    await selectedChannel.click();
  }

  //Run it only when you are editing or creating an automation message
  public async GetAutomatedMessageTriggerValues() {
    await this.waitForDomContentLoaded();
    let options = [];
    while (options.length < 1 || options.length > 43) {
      //waiting while the options are loading
      options = await this.Page.$$(SelectorConstants.NewAutomatedMessageTriggerOption);
    }
    let optionvalues = [];
    for (let option in options) {
      optionvalues.push(await options[option].getAttribute("value"));
    }
    return optionvalues;
  }

  public async goToChatByName(chatName: string) {
    await this.filterChatByName(chatName);
    const chatSelector = `//button[@title='${chatName}']`;
    await this.Page.waitForSelector("#progressIndicatorContainer", {
      state: "hidden",
    }).catch(e => {
      throw new Error(`Can't verify that Active Chat Widgets page contains progress indicator while searching. - ${e}`);
    });
    const chatToGo = await this.Page.waitForSelector(chatSelector, {
      timeout: 5000,
    }).catch(e => {
      throw new Error(`Omnichannel Administration - Chat - current ${chatName} chat was not found or was removed. - ${e}`);
    });
    if (chatToGo) {
      await this.Page.click(chatSelector);
    }
  }

  public async filterChatByName(chatName: string) {
    await this.Page.waitForSelector(`xpath=//input[starts-with(@id,'quickFind_text')]`).catch(e => {
      throw new Error(`Can't verify that Active Chat Widgets page contains Input field for fast chat searching. - ${e}`);
    });
    await this.Page.fill(`xpath=//input[starts-with(@id,'quickFind_text')]`, chatName);
    await Promise.all([
      this.Page.$eval(`xpath=//button[starts-with(@id,'quickFind_button')]`, el => (el as HTMLElement).click()),
      this.Page.waitForRequest(req => req.url().indexOf("msdyn_livechatconfigs") !== -1, { timeout: 5000 }).catch(() => { }),
    ]);
  }

  public async navigateToWorkStreamsView() {
    await this.Page.waitForSelector(SelectorConstants.WorkStreamsMenuItem);
    await this.Page.click(SelectorConstants.WorkStreamsMenuItem);
    await this.waitForDomContentLoaded();

    //Adding timeout to navigate to workstream view.
    await this.Page.waitForTimeout(Constants.DefaultTimeout);
  }

  public async closePageAndSession(pageArray: Page[], sessionContextArray: BrowserContext[]) {
    for (const page of pageArray) {
      page?.close();
    }
    for (const sessionContext of sessionContextArray) {
      sessionContext?.close();
    }
  }

  public async elementExists(selector: string, page?: Page | Frame, allowedWait = 3000) {
    page = page || this.Page;
    try {
      await page.waitForSelector(selector, {
        state: "attached",
        timeout: allowedWait,
      });
      return true;
    } catch {
      return false;
    }
  }

  public async createNewRecord() {
    await this.Page.click(SelectorConstants.NewRecordButton);
  }

  public async verifyDownloadNotStarted(downloadTrigger: (page: Page) => Promise<void>, timeout = 5000) {
    const downloadEvent = this.Page.waitForEvent("download", { timeout });
    await downloadTrigger(this.Page);

    try {
      const download = await downloadEvent;
      if (!Util.isNullOrEmptyString(await download.path())) {
        return false; // File is downloaded
      } else {
        return true;
      }
    } catch {
      return true; // Timeout exceed, that is file is not downloaded
    }
  }

  public async waitUntilFrameIsVisible(selectorVal: string, maxCount: number, frame: any, timeout: number) {
    let dataCount = 0;
    while (dataCount < maxCount) {
      try {
        await frame.waitForSelector(selectorVal, { timeout });
        return true;
      } catch {
        dataCount++;
      }
    }
    return false;
  }

  public async updateKBSettings() {
    await this.waitUntilSelectorIsVisible(SelectorConstants.RecordTypes);
    const serviceButton = await this.Page.waitForSelector(SelectorConstants.ServiceButton);
    await serviceButton.click();
    const serviceManagement = await this.Page.waitForSelector(SelectorConstants.ServiceManagement);
    await serviceManagement.click();
    const settingsForKB = await this.Page.waitForSelector(SelectorConstants.SettingsForKB);
    await settingsForKB.click();
    await this.waitForDomContentLoaded();
    await this.Page.selectOption(
      SelectorConstants.ExternalPortal,
      SelectorConstants.First
    );
    const URLFormat = await this.Page.waitForSelector(SelectorConstants.URLFormat);
    await URLFormat.click();
    await URLFormat.fill(Constants.URLFormatLink);
    const saveKB = await this.Page.waitForSelector(SelectorConstants.SaveKBSettings);
    await saveKB.click();
    await this.waitUntilSelectorIsVisible(Constants.SettingsSaved);
  }

  public async expandConversationSessionPanel() {
    try {
      const chatBtnCollapse = await this.waitUntilSelectorIsVisible(
        SelectorConstants.ExpandChatSessionBtnSelector,
        Constants.Four,
        this._page,
        Constants.FiveThousand
      );
      if (chatBtnCollapse) {
        await this._page.click(SelectorConstants.ExpandChatSessionBtnSelector);
        await this.waitUntilSelectorIsVisible(
          SelectorConstants.CollapseChatSessionBtnSelector,
          Constants.Two,
          this._page,
          Constants.FiveThousand
        );
      }
    }
    catch (error) {
      console.log(`Method expandConversationSessionPanel failed with error message: ${error.message}`);
    }
  }

  public async waitForAgentStatusIcon() {
    return await this.waitUntilSelectorIsVisible(
      SelectorConstants.AvailabilityStatusBusyXPath,
      Constants.Twenty,
      this._page,
      Constants.FiveThousand
    );
  }

  public async waitForChatWidgetLoad() {
    await this.waitUntilSelectorIsVisible(SelectorConstants.liveChatiframeName, Constants.Three, null, Constants.MaxTimeout);
    await this.waitUntilLetsChatIconIsVisible(Constants.Three, Constants.MaxTimeout);
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const chatiFrame = await liveChatiframeName.contentFrame();
    await this.waitForDomContentLoaded();
    chatiFrame.waitForSelector(SelectorConstants.Letschat, { timeout: TimeoutConstants.Minutes(2) });
  }

  public async openJWTAuthChatWidget() {
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const chatiFrame = await liveChatiframeName.contentFrame();
    await this.waitForDomContentLoaded();
    chatiFrame.waitForSelector(SelectorConstants.Letschat, { timeout: TimeoutConstants.Minutes(2) });
    await Promise.all([
      chatiFrame.$eval(SelectorConstants.Letschat, el => (el as HTMLElement).click()),
    ]);
    await this.waitForDomContentLoaded();
    await this.waitUntilSelectorIsVisible(SelectorConstants.ChatClose, Constants.Four, null, Constants.MaxTimeout);
  }

  public async waitUntilLetsChatIconIsVisible(maxCount: number = Constants.Three, timeout: number = Constants.DefaultTimeout) {
    let dataCount = 0;
    while (dataCount < maxCount) {
      try {
        const liveChatiframeName = await this.Page.$(SelectorConstants.liveChatiframeName);
        const chatiFrame = await liveChatiframeName.contentFrame();
        await chatiFrame.waitForSelector(SelectorConstants.Letschat, { timeout });
        return true;
      }
      catch (error) {
        console.log(`Method waitUntilLetsChatIconIsVisible iteration number: ${dataCount}`);
        console.log(`Method waitUntilLetsChatIconIsVisible throwing exception with message: ${error.message}`);
      }
      dataCount++;
      await this.Page.waitForTimeout(timeout);// wait for provided timeout if chat widget is not visible with in given time frame and causes an exception, post this time frame it will recheck condition to see if chat widget is visible.
    }
    return false;
  }

  public async closeGlobalSearchPopUp() {
    try {
      const popUpVisiable = await this.waitUntilSelectorIsVisible(SelectorConstants.CloseGlobalSearchPopUpBtnSelector, Constants.Two, null, Constants.TwoThousand);
      if (popUpVisiable)
        await this._page.click(SelectorConstants.CloseGlobalSearchPopUpBtnSelector);
    }
    catch (err) {
      console.log(`Method closeGlobalSearchPopUp throwing exception with message: ${err.message}`);
    }
  }

  public async getWorkStreamIdValueFromUrl(url: string, propertyName: string) {
    const params = url.split('?')[1].split('&');
    for (let element of params) {
      const pair = element.split('=');
      if (pair[0] === "data") {
        const obj = JSON.parse(decodeURIComponent(pair[1]));
        return obj.workstreamId;
      }
    }
  }
}
