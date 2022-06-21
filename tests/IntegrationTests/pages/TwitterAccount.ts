import { Constants, SelectorConstants } from "../Utility/Constants";

import { BasePage } from "./BasePage";
import { Page } from "playwright";

export enum TwitterAccountConstants {
  SignInTwitterUserNameInput = "input[name='session[username_or_email]']",
  SignInTwitterPasswordInput = "input[name='session[password]']",
  SignInTwitterNextButton = "div[data-testid='LoginForm_Login_Button']",
  TwitterMessageTab = "//*[@id='react-root']/div/div/div[2]/header/div/div/div/div[1]/div[2]/nav/a[@aria-label='Direct Messages']",
  TwitterPeopleOrGroupNameInput = "//*[@id='react-root']/div/div/div[2]/main/div/div/div/section[1]/div[2]/div/div/div[2]/div/div/div[2]/input",
  TwitterChatBoxInput = "//*[@id='react-root']/div/div/div[2]/main/div/div/div/section[2]/div[2]/div/div/div/div/aside/div[2]/div[2]/div/div/div/div/div[1]/div/div/div/div[2]/div/div/div/div",
  TwitterChatBoxButton = "div[data-testid='dmComposerSendButton']",
  TwitterPeopleOrGroupNameLookup = "//*[@id='react-root']/div/div/div[2]/main/div/div/div/section[1]/div[2]/div/div/div[3]/section/div/div/div/div[1]/div/div[1]/div/div[2]/div/div[1]/div[1]/div/div[2]/div/span[contains(text(),{0})]",
  TwitterDMbutton = "a[data-testid='NewDM_Button']",
  TwitterPeopleOrGroupNameInputDM = "input[data-testid='searchPeople']",
  TwitterPeopleOrGroupNameLookupDM = "li[data-testid='TypeaheadUser']/*//span[contains(text(),'{0}')][1]",
  TwitterDMNextButton = "//*[@data-testid='nextButton']",
  OmnichannelCustomerService = "Omnichannel for Customer Service",
  EndChatIconSelector = "a[aria-label='Conversation info']",
  LeaveConversationBtnSelector = "//*[@id='react-root']/div/div/div[2]/main/div/div/div/section[2]/div[2]/div/div/div/div[3]/div[4]/div",
  EndChatPopUpSelector = "//*[@id='layers']/div[2]/div/div/div/div/div/div[2]/div[2]/div[3]/div[2]",
  SignOutIconSelector = "//*[@id='react-root']/div/div/div[2]/header/div/div/div/div[2]/div/div",
  SignOutAnchorSelector = "//*[@id='layers']/div[2]/div/div/div[2]/div/div[2]/div/div/div/div/div/a[2]",
  SignChatPopUpSelector = "//*[@id='layers']/div[2]/div/div/div/div/div/div[2]/div[2]/div[3]/div[2]",
  MessageSelector = "//*[text()='{0}']",
  MessageToAgent = "Hello!",
  CustomerPositiveWord = "Very Happy with the service",
  NewMessageSelector = "//*[text()='New message']",
  TwitterCloseConversationTimeout = 5000,
  ChildBusinessUnit = 'ChildBU',
  NestedBusinessUnit = 'NestedBU',
  CustomerChatDataMasking = "//*[@data-testid='dmComposerTextInput']/preceding::*[@role='presentation'][1]/div/span",
  Email = "Hi,Provided mail: oc@outlook.com",
  EmailMaskedValue = "Hi,Provided mail: ##############",
  CCNo = "Hi,Provided card: 4648788956451226",
  CCMaskedValue = "Hi,Provided card: ################",
  SSNNo = "Hi,Provided SSN: 409522002",
  SSNMaskedValue = "Hi,Provided SSN: #########",
  ReceivedMessage = "//*[@data-testid='dmComposerTextInput']/preceding::*[@role='presentation'][1]/div/a",
  RequiredCapacity = "110",
  Push = "Push",
  Pick = "Pick",
  SadSentiment = "sad",
  GoodSentiment = "good",
  OOH = "OOH",
  AgentAffinity= "AgentAffinity"
}

export class TwitterAccount extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  public async navigateToTwitterMessageTab() {
    await this.Page.waitForSelector(TwitterAccountConstants.TwitterMessageTab);
    await this.Page.click(TwitterAccountConstants.TwitterMessageTab);
    await this.Page.click(TwitterAccountConstants.TwitterMessageTab);// if test case fails and it retries itself then message tab won't appear until we click on it second time.
  }

  public async clickOnTwitterDMButton() {
    await this.waitUntilSelectorIsVisible(TwitterAccountConstants.TwitterDMbutton);
    await this.Page.click(TwitterAccountConstants.TwitterDMbutton);
  }

  public async searchForPeopleAndGroupsDM(peopleOrGroupName: string) {
    const twitterMessageInput = await this.Page.waitForSelector(
      TwitterAccountConstants.TwitterPeopleOrGroupNameInputDM
    );
    await twitterMessageInput.fill(peopleOrGroupName);
    await this.Page.waitForTimeout(Constants.DefaultTimeout); //Included this wait condition to wait for some business process to complete, will remove it later by adding wait condition for some linked selector.
    const twitterMessageLookup = await this.Page.waitForSelector(
      TwitterAccountConstants.TwitterPeopleOrGroupNameLookupDM.replace(
        "{0}",
        peopleOrGroupName
      )
    );
    await this.Page.waitForTimeout(Constants.DefaultTimeout);//Included this wait condition to wait for some business process to complete, will remove it later by adding wait condition for some linked selector.
    await twitterMessageLookup.click();
    await this.Page.waitForSelector(TwitterAccountConstants.TwitterDMNextButton);
    await this.Page.click(TwitterAccountConstants.TwitterDMNextButton);
  }

  public async sendMessage(message: string) {
    await this.waitUntilSelectorIsVisible(TwitterAccountConstants.TwitterChatBoxInput);
    const twitterChatBoxInput = await this.Page.fill(
      TwitterAccountConstants.TwitterChatBoxInput,
      message
    );
    await this.Page.click(TwitterAccountConstants.TwitterChatBoxButton);
  }

  public async closeTwitterChatConversation() {
    await this.waitUntilSelectorIsVisible(TwitterAccountConstants.EndChatIconSelector, 2, null, TwitterAccountConstants.TwitterCloseConversationTimeout);
    const endChatIconSelector = await this.Page.click(TwitterAccountConstants.EndChatIconSelector);
    await this.waitUntilSelectorIsVisible(TwitterAccountConstants.LeaveConversationBtnSelector, 2, null, TwitterAccountConstants.TwitterCloseConversationTimeout);
    const leaveConversationBtnSelector = await this.Page.click(TwitterAccountConstants.LeaveConversationBtnSelector);
    await this.waitUntilSelectorIsVisible(TwitterAccountConstants.EndChatPopUpSelector, 2, null, TwitterAccountConstants.TwitterCloseConversationTimeout);
    const endChatPopUpSelector = await this.Page.click(TwitterAccountConstants.EndChatPopUpSelector);
    await this.waitUntilSelectorIsVisible(TwitterAccountConstants.NewMessageSelector, 2, null, TwitterAccountConstants.TwitterCloseConversationTimeout);
  }

  public async signOutTwitter() {
    await this.waitUntilSelectorIsVisible(TwitterAccountConstants.SignOutIconSelector, 2, null, TwitterAccountConstants.TwitterCloseConversationTimeout);
    const signOutIconSelector = await this.Page.click(TwitterAccountConstants.SignOutIconSelector);
    await this.waitUntilSelectorIsVisible(TwitterAccountConstants.SignOutAnchorSelector, 2, null, TwitterAccountConstants.TwitterCloseConversationTimeout);
    const signOutAnchorSelector = await this.Page.click(TwitterAccountConstants.SignOutAnchorSelector);
    await this.waitUntilSelectorIsVisible(TwitterAccountConstants.SignChatPopUpSelector, 2, null, TwitterAccountConstants.TwitterCloseConversationTimeout);
    const signChatPopUpSelector = await this.Page.click(TwitterAccountConstants.SignChatPopUpSelector);
  }

  public async validateCustomerChatDataMasking(expectedData: string) {
    await this.waitUntilSelectorIsVisible(TwitterAccountConstants.CustomerChatDataMasking);
    const twitterSiteMap = await this.Page.$eval(TwitterAccountConstants.CustomerChatDataMasking, (el) => (el as HTMLElement).innerHTML.trim());
    return twitterSiteMap === expectedData;
  }

  public async verifyReceivedMessage(locator: string) {
    const receivedMessage = await this.waitUntilSelectorIsVisible(locator);
    return receivedMessage;
  }
}