import { BasePage } from "../pages/BasePage";
import { Constants } from "../Utility/Constants";
import { Page } from "playwright";
import { SendFacebookMessage } from "../helpers/facebook-client";
import { TestSettings } from "../configuration/test-settings";

export enum FacebookMessangerConstants {
    FacebookUserNameSelector = "//*[@id='email']",
    FacebookPasswordSelector = "//*[@id='pass']",
    FacebookSignInBtnSelector = "//*[@type='submit']",
    FacebookMessageIconSelector = "//*[@name='mercurymessages']",
    FacebookAllMessageSelector = "//*[@href='/messages/t/']",
    FacebookPageTextBoxSelector = "//*[@aria-label='Search Messenger']",
    FacebookSearchPageSelector = "//*[contains(@data-testid,'{0}')]",
    FacebookSendMessageTextBoxSelector = "//*[@aria-label='Type a message...']",
    FacebookSendMessageBtnSelector = "//*[@label='send']",
    FacebookPageOptionSelector = "//*[@aria-label='Conversation actions']",
    FacebookPageDeleteOption = "//*[text()='Delete']",
    Enterkey = 'Enter',
    CustomerMessage = 'Hello!',
    Three = 3,
    SettingBtnSelector = "//*[@aria-label='Settings, help and more']",
    LogOutBtnSelector = "//*[text()='Log Out']",
    MessageToAgent = "Hello!",
    SmallSizeImagePath = "FileResources//SmallSizeImageAttachment.png",
    WideSizeImagePath = "FileResources//WideSizeImageAttachment.png",
    TallSizeImagePath = "FileResources//TallImageAttachment.png",
    LargeSizeImagePath = "FileResources//LargeSizeImageAttachment.png",
    FacebookAttachmentIconSelector = "//*[@aria-label='Choose a sticker']/following-sibling::div/form[@title='Add Files']/div[@role='button']",
    SendBtnSelector = "//*[@aria-label='Send']",
    ImageSentIconSelector = "//*[@aria-label='Sent'][last()]",
    Five = 5,
    One = 1,
    MoreBtnSelector = "//*[@aria-label='Open photo']/parent::div/parent::div//following-sibling::span//span/button[@aria-label='More']",
    RemoveImageAnchorSelector = "//a[text()='Remove']",
    RemoveImageDialogSelector = "//*[@aria-label='Dialogue content']",
    RemoveImageBtnSelector = "//*[@aria-label='Dialogue content']/descendant::button[text()='Remove']",
    ImageReactIconSelector = "//*[@aria-label='React']",
    OpenImageIconSelector = "//*[contains(@href,'messenger') and @aria-label='photo']",
    DownloadImageSelector = "//*[text()='Download']",
    Download = "download",
    CancelImagePopupSelector = "//*[text()='Download']/parent::div/following-sibling::a",
    PVAMessageFromFBCustomer = 'What is PVA',
    PVAEscalateToAgentFBOption = "//*[text()='Yes, Please Escalate']",
    PVAAgentAvailableMsg = "//*[text()='An agent will be with you in a moment.']",
    Message = "Hello!!",
    Push="Push",
    FBAllAttachmentDisabled= "FBAllAttachmentDisabled",
    FBAgentAttachmentDisabled= "FBAgentAttachmentDisabled",
    FBUserAttachmentDisabled="FBUserAttachmentDisabled",
    FBPWPick="FBPWPick",
    EnablePushBasedWSSelection ="EnablePushBasedWSSelection",
    AutomationPlaywrightFacebookPickQueue = "AutomationPlaywrightFacebookPickQueue",
    OOH = "OOH"
}

export class FacebookMessanger extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    public async searchForFacebookPage(facebookPageName: string) {
        await this.waitUntilSelectorIsVisible(
            FacebookMessangerConstants.FacebookPageTextBoxSelector,
            FacebookMessangerConstants.Three
        );
        await this.Page.fill(
            FacebookMessangerConstants.FacebookPageTextBoxSelector,
            facebookPageName
        );
        const facebookSearchPageLookup = await this.Page.waitForSelector(
            FacebookMessangerConstants.FacebookSearchPageSelector.replace(
                "{0}",
                TestSettings.FacebookPageId
            )
        );
        facebookSearchPageLookup.click();
    }

    public async sendMessage(message: string) {
        const facebookSendMessageInput = await this.Page.waitForSelector(
            FacebookMessangerConstants.FacebookSendMessageTextBoxSelector
        );
        facebookSendMessageInput.type(message);
        await this.Page.waitForTimeout(Constants.DefaultTimeout);//Default timeout required here as we need to wait text data to fill in input selector before passing 'Enter' key command. 
        await this.Page.keyboard.press(FacebookMessangerConstants.Enterkey);
    }

    public async clearConversation() {
        await this.waitUntilSelectorIsVisible(FacebookMessangerConstants.FacebookPageOptionSelector, FacebookMessangerConstants.Three);
        await this.Page.click(
            FacebookMessangerConstants.FacebookPageOptionSelector
        );
        await this.waitUntilSelectorIsVisible(FacebookMessangerConstants.FacebookPageDeleteOption, FacebookMessangerConstants.Three);
        await this.Page.click(
            FacebookMessangerConstants.FacebookPageDeleteOption
        );
        //Used the same selector to close next close facebook chat conversation popup.
        await this.waitUntilSelectorIsVisible(FacebookMessangerConstants.FacebookPageDeleteOption, FacebookMessangerConstants.Three);
        await this.Page.click(
            FacebookMessangerConstants.FacebookPageDeleteOption
        );
    }

    public async facebookSignOut() {
        await this.waitUntilSelectorIsVisible(FacebookMessangerConstants.SettingBtnSelector);
        await this.Page.click(
            FacebookMessangerConstants.SettingBtnSelector
        );
        await this.waitUntilSelectorIsVisible(FacebookMessangerConstants.LogOutBtnSelector);
        await this.Page.click(
            FacebookMessangerConstants.LogOutBtnSelector
        );
    }

    public async messageToAgent(randomFacebookAppId) {
        await SendFacebookMessage(
            randomFacebookAppId,
            TestSettings.FacebookPageId,
            FacebookMessangerConstants.CustomerMessage,
            TestSettings.FacebookBCRClientId,
            TestSettings.FacebookBCRClientSecret);
    }

    public async sendImageFileFromFacebook(filePath: string) {
        await this.waitUntilSelectorIsVisible(
            FacebookMessangerConstants.FacebookAttachmentIconSelector,
            FacebookMessangerConstants.Three
        );
        const fileInputDialogSelector = await this.Page.$(FacebookMessangerConstants.FacebookAttachmentIconSelector);
        this.Page.on('filechooser', async (fileChooser) => {
            await fileChooser.setFiles(filePath);
        });
        await fileInputDialogSelector.click();
        await this.waitUntilSelectorIsVisible(
            FacebookMessangerConstants.SendBtnSelector,
            FacebookMessangerConstants.Three
        );
        const send = await this.Page.$(FacebookMessangerConstants.SendBtnSelector);
        await send.click();
        await this.waitUntilSelectorIsVisible(FacebookMessangerConstants.ImageSentIconSelector, FacebookMessangerConstants.Five, this.Page, Constants.FourThousandsMiliSeconds);
    }

    public async removeCustomerFile() {
        await this.Page.$eval(FacebookMessangerConstants.MoreBtnSelector, el => (el as HTMLElement).click());
        await this.waitUntilSelectorIsVisible(FacebookMessangerConstants.RemoveImageAnchorSelector);
        await this.Page.$eval(FacebookMessangerConstants.RemoveImageAnchorSelector, el => (el as HTMLElement).click());
        var isRemoveItemPopup = await this.waitUntilSelectorIsVisible(FacebookMessangerConstants.RemoveImageDialogSelector, FacebookMessangerConstants.Five);
        if (isRemoveItemPopup) {
            await this.Page.$eval(FacebookMessangerConstants.RemoveImageBtnSelector, el => (el as HTMLElement).click());
        }
    }

    public async verifyFileDownloadAtCustomerEnd() {
        let fileDownloadFlag = false;
        const ImageSelectorFlagValue = await this.waitUntilSelectorIsVisible(FacebookMessangerConstants.ImageReactIconSelector, FacebookMessangerConstants.Five, this.Page, Constants.FourThousandsMiliSeconds);
        if (ImageSelectorFlagValue) {
            const isImageAvailableForPreview = await this.waitUntilSelectorIsVisible(FacebookMessangerConstants.OpenImageIconSelector, FacebookMessangerConstants.Five, this.Page, Constants.FourThousandsMiliSeconds);
            if (isImageAvailableForPreview) {
                await this.Page.$eval(FacebookMessangerConstants.OpenImageIconSelector, el => (el as HTMLElement).click())
                const isdownLoadBtnAvailable = await this.waitUntilSelectorIsVisible(FacebookMessangerConstants.DownloadImageSelector, FacebookMessangerConstants.Five);
                if (isdownLoadBtnAvailable) {
                    const [download] = await Promise.all([
                        this.Page.waitForEvent(FacebookMessangerConstants.Download),
                        await this.Page.$eval(FacebookMessangerConstants.DownloadImageSelector, el => (el as HTMLElement).click())
                    ]);
                    await this.Page.$eval(FacebookMessangerConstants.CancelImagePopupSelector, el => (el as HTMLElement).click());
                    const path = await download.path();
                    if (path != null && path != undefined && path != "") {
                        fileDownloadFlag = true;
                    }
                }
            }
        }
        return fileDownloadFlag;
    }

    public async searchForPVAFacebookPage(facebookPageName: string) {
        await this.waitUntilSelectorIsVisible(
            FacebookMessangerConstants.FacebookPageTextBoxSelector,
            FacebookMessangerConstants.Three
        );
        await this.Page.fill(
            FacebookMessangerConstants.FacebookPageTextBoxSelector,
            facebookPageName
        );
        const facebookSearchPageLookup = await this.Page.waitForSelector(
            FacebookMessangerConstants.FacebookSearchPageSelector.replace(
                "{0}",
                TestSettings.PVAFacebookPageId
            )
        );
        facebookSearchPageLookup.click();
    }

    public async escalateToAgent() {
        await this.waitUntilSelectorIsVisible(
            FacebookMessangerConstants.PVAAgentAvailableMsg,
            FacebookMessangerConstants.Three
        );
        await this.waitUntilSelectorIsVisible(
            FacebookMessangerConstants.PVAEscalateToAgentFBOption,
            FacebookMessangerConstants.Three
        );
        await this.Page.click(FacebookMessangerConstants.PVAEscalateToAgentFBOption);
    }
}
