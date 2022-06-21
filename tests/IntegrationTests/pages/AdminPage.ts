import { Constants, SelectorConstants } from "../Utility/Constants";
import { BasePage } from "../pages/BasePage";
import { Page } from "playwright";
import { TestSettings } from "../configuration/test-settings";

export enum CustomConstants {
  FormSelector = "span[data-id='form-selector']",
  ApplicationUser = "li[data-id='form-selector-item-0']",
  MessageToAgent = "Hi! ping from Customer",
  AdminInformation = "div[id='mectrl_headerPicture']",
  AdminSignOutBtnSelector = "//*[contains(text(),'Sign out')]",
  CustomPresenceTemplate = "button[data-test-id='custom-presence-manage']",
  CSHAreaSwitchSelector = "//button[@data-id='sitemap-areaSwitcher-expand-btn']",
  One = 1,
  ServiceAreaSelector ="//span[normalize-space()='Service Management']",
  AgentPopUpWaitingTimeout = 60000,
  Users = "//li[@aria-label='Users']",
  SearchInput = "//input[@aria-label='User Search this view']",
  UserName = "ocautopw csmuser1",
  Checkboxselect = "//a[@aria-label='ocautopw csmuser1']",
  NavigateOminichannel ="//li[@aria-label='Omnichannel']",
  UserMouiceOver = "//div[@data-id='default_presence_user.fieldControl-entityIconContainer_selectedRecords']",
  RemoveStatus ="//span[@data-id='default_presence_user.fieldControl-LookupResultsDropdown_msdyn_defaultpresenceiduser_microsoftIcon_cancelButton']",
  InputfiledSelector = "input[data-id='default_presence_user.fieldControl-LookupResultsDropdown_msdyn_defaultpresenceiduser_textInputBox_with_filter_new']",
  SearchbuttonSelector = "//button[@data-id='msdyn_default_presence_user.fieldControl-Lookup_msdyn_defaultpresenceiduser_microsoftIcon_searchButton']",
  SelectResultValue = "default_presence_user.fieldControl-LookupResultsDropdown_msdyn_defaultpresenceiduser_resultsContainer",
  offline = "offline",
  lookValueSelect = "ul[data-id='default_presence_user.fieldControl-LookupResultsDropdown_msdyn_defaultpresenceiduser_tab'] li:first-child",
  SaveAndClose ="//button[@aria-label='Save & Close']"
}
export class AdminPage extends BasePage {
  newQueueType: string;
  constructor(page: Page) {
    super(page);
  }

  //Navigate to Admin App
  public async loginAndNavigateToAdminApp() {
    await this.loginAccountDetails();
    await this.navigateToAdministration();
    await this.waitForDomContentLoaded();
  }
  //Navigate to AdminCenter App
  public async loginAndNavigateToAdminCenterApp() {
    await this.loginAccountDetails();
    await this.navigateToAdminCentre();
    await this.waitForDomContentLoaded();
  }
  //Navigate to Admin App without Credentials
  public async loginAndNavigateToAdminAppWithinSameBrowser() {
    await this.navigateToOrgUrl();
    await this.waitForDomContentLoaded();
  }

  //Navigate to Admin App
  public async loginAndNavigateToAdminAppWithCredentials(
    email: string,
    password: string
  ) {
    await this.loginCustomAccount(email, password);
    await this.navigateToAdministration();
    await this.waitForDomContentLoaded();
  }

  //Navigate to Admin App with LiveChat Login details
  public async loginAndNavigateToAdminAppForLiveChat() {
    await this.liveChatLoginDetails();
    await this.navigateToAdministration();
    await this.waitForDomContentLoaded();
  }

  public async CreateNewWebResource(Webresource: string) {
    await this.navigateToRTT();
    await this.waitForDomContentLoaded();
    await this.fillWebResourceData(Webresource);
    await this.waitForDomContentLoaded();
  }

  //Navigate to Customer service Hub App
  public async loginAndNavigateToCSHApp() {
    await this.loginAccountDetails();
    await this.navigateToCSHApp();
    await this.waitForDomContentLoaded();
  }

  //Navigate to Omnichannel Solution Health Hub
  public async loginAndNavigateToOCSolutionHub() {
    await this.loginAccountDetails();
    await this.navigateToSolutionHealthHub();
    await this.waitForDomContentLoaded();
  }

  //Navigate to Omnichannel Admin Center
  public async loginAndNavigateToOmnichannelAdminCenter() {
    await this.loginAccountDetails();
    await this.navigateToAdminCentre();
    await this.waitForDomContentLoaded();
  }

  //Login email and password for Agent
  public async loginAccountDetails() {
    const email = TestSettings.AgentAccountEmail;
    const pwd = TestSettings.AgentAccountPassword;
    await this.navigateToOrgUrlAndSignIn(email, pwd);
    await this.waitForDomContentLoaded();
  }

  //Login with custom email and password
  public async loginCustomAccount(login: string, password: string) {
    await this.navigateToOrgUrlAndSignIn(login, password);
    await this.waitForDomContentLoaded();
  }

  //Login email and password for LiveChat
  public async liveChatLoginDetails() {
    const email = TestSettings.LiveChatAccountEmail;
    const pwd = TestSettings.LiveChatAccountPassword;
    await this.navigateToOrgUrlAndSignIn(email, pwd);
    await this.waitForDomContentLoaded();
  }

  //OMNI Channel Apps
  public async navigateToAdministration() {
    await this.goToMyApp(Constants.OmnichannelAdministration);
  }

  public async navigateToAdminCentre() {
    this.Page.goto(TestSettings.OrgUrl + "/main.aspx?forceUCI=1&pagetype=apps");
    await this.goToMyApp(Constants.OmnichannelAdminCentre);
  }

  public async navigateToCSHApp() {
    await this.goToMyApp(Constants.CSHApp);
  }

  public async navigateToSolutionHealthHub() {
    await this.goToMyApp(Constants.OmnichannelSolutionHealthHub);
  }

  //Set required capacity for Agent or Bot users to prioritize/deprioritize for chats
  public async SetCapacityToUserOrBot(
    searchWithString: string,
    capacity: string
  ) {
    await this.waitForDomContentLoaded();
    await this.navigateToSiteMap(Constants.Users);
    await this.searchAndOpenFirstRecord(searchWithString);
    await this.Page.keyboard.press(Constants.EnterKey);
    await this.Page.waitForTimeout(Constants.DefaultMinTimeout);
    await this.Page.waitForSelector(CustomConstants.FormSelector);
    await this.Page.click(CustomConstants.FormSelector);
    await this.Page.waitForSelector(CustomConstants.ApplicationUser);
    await this.Page.click(CustomConstants.ApplicationUser);
    await this.waitForDomContentLoaded();
    await this.Page.click(SelectorConstants.OmniChannelTab);
    await this.waitForDomContentLoaded();
    await this.Page.waitForSelector(SelectorConstants.CapacityInput);
    await this.Page.click(SelectorConstants.CapacityInput);
    await this.Page.fill(SelectorConstants.CapacityInput, capacity);
    await this.Page.click(SelectorConstants.FormSaveButton);
    await this.waitForSaveComplete();
  }

  public async signOut() {
    const agentInfo = await this.Page.waitForSelector(
      CustomConstants.AdminInformation
    );
    await agentInfo.click();
    const signOut = await this.Page.waitForSelector(
      CustomConstants.AdminSignOutBtnSelector
    );
    await signOut.click();
  }

  //Navigate to Customer service Hub App with LiveChat
  public async loginAndNavigateToCSHApp1() {
    await this.loginAccountDetails1();
    await this.navigateToCSHApp();
    await this.waitForDomContentLoaded();
  }

  //Login email and password for Agent
  public async loginAccountDetails1() {
    const email = TestSettings.LiveAccountAgentEmail;
    const pwd = TestSettings.LiveChatAccountPassword;
    await this.navigateToOrgUrlAndSignIn(email, pwd);
    await this.waitForDomContentLoaded();
  }

  public async navigateToWorkStreamsView() {
    await this.Page.waitForSelector(SelectorConstants.AdminCenterWorkStreamsMenuItem);
    await this.Page.click(SelectorConstants.AdminCenterWorkStreamsMenuItem);
    await this.waitForOperationCompletion();
  }

  public async openWorkStream(name: string) {
    await this.navigateToWorkStreamsView();
    const serachWSInput = await this.Page.waitForSelector(SelectorConstants.SearchWorkStreamsInput);
    await serachWSInput.type(name, { delay: 100 });
    let wsGridBtnSelector = SelectorConstants.WSNameBtnGridSelector.replace("{0}", name);
    await this.Page.click(wsGridBtnSelector);
    await this.waitForOperationCompletion();
    await this.waitUntilSelectorIsVisible(SelectorConstants.WSNameDetailsSelector, Constants.Two, this._page, Constants.MaxTimeout);
  }

  public async waitForOperationCompletion() {
    await this.waitForDomContentLoaded();
    await this._page.waitForLoadState("load", { timeout: 10000 }).catch(() => { });
    await this._page.waitForLoadState("domcontentloaded", { timeout: 10000 }).catch(() => { });
    await this._page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => { });
  }

  public async loginAndNavigateToOCAdminAppNew() {
    await this.navigateToAdminCentre();
    await this.waitForDomContentLoaded();
  }

  public async OpenQueueTypeDashBoard() {
    await this.Page.waitForSelector(SelectorConstants.Queues);
    await this.Page.click(SelectorConstants.Queues);
    await this.waitForDomContentLoaded();
  }

  public async openNewQueueType() {
    await this.Page.waitForSelector(
      SelectorConstants.NewQueue
    );
    await this.Page.focus(
      SelectorConstants.NewQueue
    );
    await this.Page.click(SelectorConstants.NewQueue, {
      force: true
    });
    await this.waitForDomContentLoaded();
  }

  public async CreateQueueType() {
    await this.Page.click(SelectorConstants.InputQueueType);
    await this.waitForDomContentLoaded();
    await this.Page.waitForTimeout(Constants.MaxTimeout);
  }

  public async CreateQueueForDashBoard(QueueType: string) {
    this.newQueueType= QueueType;
    await this.fillInputData(SelectorConstants.InputQueueName, this.newQueueType);
    await this.waitUntilSelectorIsVisible(SelectorConstants.InputQueueType, Constants.Two, this._page, Constants.MaxTimeout);
    await this.Page.click(SelectorConstants.InputQueueType);
    await this.Page.waitForSelector(SelectorConstants.DropdownQueueType);
    await this.Page.click(SelectorConstants.DropdownQueueType);
    await this.waitForDomContentLoaded();
    await this.waitUntilSelectorIsVisible(SelectorConstants.InputGroupNumber, Constants.Two, this._page, Constants.MaxTimeout);
    await this.Page.fill(SelectorConstants.InputGroupNumber, SelectorConstants.GroupNumber);
    await this.waitForDomContentLoaded();
    await this.Page.click(SelectorConstants.SaveQueuebtn);
    await this.waitForDomContentLoaded();
    await this.Page.waitForSelector(SelectorConstants.QueueEditButton);
    await this.Page.click(SelectorConstants.QueueEditButton);
    await this.waitForDomContentLoaded();
    await this.Page.waitForSelector(SelectorConstants.QueueCancel);
    await this.waitForDomContentLoaded();
    await this.Page.click(SelectorConstants.QueueCancel);
    await this.waitForDomContentLoaded();
    }

  public async DeleteQueuetype()
   {
    this.OpenQueueTypeDashBoard();
    await this.fillInputData(SelectorConstants.QueueSearchSelector,this.newQueueType);
    await this.Page.waitForSelector(SelectorConstants.SelectQueueSelector);
    await this.Page.click(SelectorConstants.SelectQueueSelector);
    await this.Page.waitForSelector(SelectorConstants.DeleteQueuebuttonSelector);
    await this.Page.click(SelectorConstants.DeleteQueuebuttonSelector);
    await this.waitForDomContentLoaded();
    await this.Page.waitForSelector(SelectorConstants.DeleteQueueConfirmButtonSelector);
    await this.waitForDomContentLoaded();
    await this.Page.click(SelectorConstants.DeleteQueueConfirmButtonSelector);
    await this.waitForDomContentLoaded();
   }

   public async selectAutomatedMessage(channel: string, messageTrigger: string) {
    const selector = SelectorConstants.AutomatedMessagesTableSelectRecord
    .replace("{channel}", channel)
    .replace("{messageTrigger}", messageTrigger);
    let automatedMessage = await this.Page.waitForSelector(
      selector
    );
    try {
      await this.Page.$eval(
        selector,
        (el) => (el as HTMLElement).click()
      );
    } catch(error) {
    }
  }

  //Go to the workstream and add a bot
  public async addABotToWorkStream(workStreamName: string, botName: string) {
    await this.openWorkStream(workStreamName);
    if (await this.Page.isVisible(SelectorConstants.AddBotButton)) {
      await this.Page.click(SelectorConstants.AddBotButton);
      await this.Page.click(SelectorConstants.SelectBotDropdown);
      await this.Page.click('text=' + botName);
      await this.Page.click(SelectorConstants.AddBotConfirmButton);
    }
  }

  //Remove a bot from the workstream page
  public async removeABotFromWorkstream() {
    await this.Page.click(SelectorConstants.BotMoreOptionsButton);
    await this.Page.click(SelectorConstants.RemoveBotButton);
    await this.Page.click(SelectorConstants.RemoveBotConfirmButton);
  }

  public async fillandSaveworkstream(streamname:string) {
    await this.waitForDomContentLoaded();
    await this.Page.waitForSelector(SelectorConstants.WorkstreamName);
    await this.fillInputData(SelectorConstants.WorkstreamName,streamname)
    await this.Page.click(SelectorConstants.WorkstreamType);
    await this.Page.click(SelectorConstants.WorkstreamTypeValue);
    await this.waitForDomContentLoaded();
    await this.Page.click(SelectorConstants.WorkstreamChannelType);
    await this.Page.click(SelectorConstants.WorkstreamChannelTypeValue);
    await this.Page.click(SelectorConstants.WorkstreamCreateButton);
    await this.waitForSaveComplete();
    await this.waitForDomContentLoaded();
  }

  public async loginInboxAccountDetails() {
    const email = TestSettings.InboxUser;
    const pwd = TestSettings.DefaultPassword;
    await this.navigateToOrgUrlAndSignIn(email, pwd);
    await this.waitForDomContentLoaded();
  }

  public async loginAndNavigateToCSHAppforInbox() {
    await this.loginInboxAccountDetails();
    await this.navigateToCSHApp();
    await this.waitForDomContentLoaded();
  }

  public async navigateToCSWApp() {
    await this.goToMyApp(Constants.CustomerServiceWorkspace);
  }

  public async goToCustomerServiceWorkspace() {
    await this.loginInboxAccountDetails();
    await this.navigateToCSWApp();
    await this.waitForDomContentLoaded();
  }

  public async NavigateCSHService() {
    await this.waitUntilSelectorIsVisible(CustomConstants.CSHAreaSwitchSelector, CustomConstants.One, null, CustomConstants.AgentPopUpWaitingTimeout);
     const areaSwitch = await this.Page.waitForSelector(CustomConstants.CSHAreaSwitchSelector);
     await areaSwitch.click();
     await this.waitUntilSelectorIsVisible(CustomConstants.ServiceAreaSelector, CustomConstants.One, null, CustomConstants.AgentPopUpWaitingTimeout);
     const service = await this.Page.waitForSelector(CustomConstants.ServiceAreaSelector);
     await service.click();
   }

  public async NavigateUnifiedRouting() {
    await this.waitUntilSelectorIsVisible(CustomConstants.Users, CustomConstants.One, null, CustomConstants.AgentPopUpWaitingTimeout);
    const areaSwitch = await this.Page.waitForSelector(CustomConstants.Users);
    await areaSwitch.click();
    await this.fillInputData(
      CustomConstants.SearchInput,
      CustomConstants.UserName
    );
    await this.Page.keyboard.press(Constants.EnterKey, { delay: Number(Constants.DefaultMinTimeout) });
    await this.waitForDomContentLoaded();
    await this.Page.waitForTimeout(Constants.WaitingHalfMinute);
    await this.waitUntilSelectorIsVisible(CustomConstants.Checkboxselect, CustomConstants.One, null, CustomConstants.AgentPopUpWaitingTimeout);
    const CHeckbox = await this.Page.waitForSelector(CustomConstants.Checkboxselect);
    await CHeckbox.click();
    await this.waitForDomContentLoaded();
    await this.Page.waitForTimeout(Constants.MaxTimeout);
    await this.waitUntilSelectorIsVisible(CustomConstants.NavigateOminichannel, CustomConstants.One, null, CustomConstants.AgentPopUpWaitingTimeout);
    const NavigateOminichannel = await this.Page.waitForSelector(CustomConstants.NavigateOminichannel);
    await NavigateOminichannel.click();
    await this.Page.waitForTimeout(Constants.MaxTimeout);
    await this.waitUntilSelectorIsVisible(CustomConstants.UserMouiceOver, CustomConstants.One, null, CustomConstants.AgentPopUpWaitingTimeout);
    await this._page.hover(CustomConstants.UserMouiceOver);
    const Removeuser = await this.Page.waitForSelector(CustomConstants.RemoveStatus);
    await Removeuser.click();
    await this.Page.fill(CustomConstants.InputfiledSelector, CustomConstants.offline);
    await this.Page.click(CustomConstants.SearchbuttonSelector);
    await this.Page.click(CustomConstants.SelectResultValue);
    await this.waitUntilSelectorIsVisible(CustomConstants.SaveAndClose, Constants.Three, this._page, Constants.MaxTimeout);
    await this.Page.click(CustomConstants.SaveAndClose);
    await this.waitForSaveComplete();
    await this.waitForDomContentLoaded();
  }

public async validateDryrunSlidingPage(frame: any) {
  await this.waitUntilFrameSelectorIsVisible(
    SelectorConstants.DryrunSlidingButton,
    frame,
    Constants.One,
    Constants.DefaultTimeout
   );
   const Tooltip = await frame.waitForSelector(SelectorConstants.DryrunSlidingButton);
    return true;
}
public async navigateToUserAttributesview() {
  await this.Page.waitForSelector(SelectorConstants.UserAttributesMenuItems);
  await this.Page.click(SelectorConstants.UserAttributesMenuItems);
  await this.waitForDomContentLoaded();
}
public async navigateToSentimentbasedrouting() {
  await this.Page.waitForSelector(SelectorConstants.Sentimentbasedrouting);
  await this.Page.click(SelectorConstants.Sentimentbasedrouting);
  await this.waitForDomContentLoaded();
  await this.Page.click(SelectorConstants.ManageButton);
  await this.Page.click(SelectorConstants.DryrunButton);
}
}

