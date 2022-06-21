import { AgentChatConstants, Constants } from "../Utility/Constants";
import { IFrameConstants, IFrameHelper } from "../Utility/IFrameHelper";

import { AgentChat } from "../pages/AgentChat";
import { FacebookMessangerConstants } from "../pages/FacebookMessanger";
import { Page } from "playwright";
import { SendFacebookMessageWithAttachment } from "../helpers/facebook-attachment-client";
import { Util } from "../Utility/Util";
import { SendFacebookMessage } from "../helpers/facebook-client";

export enum FacebookAttachmentConstants {
    NotificationPanelOpenBtnSelector = "//*[contains(@id,'webchat__toaster__header')]",
    DllFileMessageSelector = "//*[contains(text(),'dll files are not supported')]",
    DllFilePath = "FileResources//testFile.dll",
    ClosedConversationFileAttachmentSelector = "//*[contains(text(),'Transcript')]",
    DllFileMessage = "dll files are not supported",
}

export class FacebookAttachment extends AgentChat {

    private readonly facebookPageId: string;
    private readonly bcrAppId: string;
    constructor(page: Page, facebookPageId: string, bcrAppId: string) {
        super(page);
        this.facebookPageId = facebookPageId;
        this.bcrAppId = bcrAppId;
    }

    public async toggleNotificationPanel(page: Page) {
        const iframe: Page = await IFrameHelper.GetIframe(
            page,
            IFrameConstants.IframeCC
        );
        const isNotificationPanelVisible = await this.waitUntilSelectorIsVisible(
            FacebookAttachmentConstants.NotificationPanelOpenBtnSelector,
            AgentChatConstants.Two,
            iframe,
            Constants.FourThousandsMiliSeconds
        );
        if (isNotificationPanelVisible) {
            await iframe.$eval(FacebookAttachmentConstants.NotificationPanelOpenBtnSelector, (el) => {
                (el as HTMLElement).scrollIntoView();
                (el as HTMLElement).click();
            });
        }
    }

    public async verifyFileUploadAtAgent(text: string, page: Page) {
        const iFrame: Page = await IFrameHelper.GetIframe(
            page,
            IFrameConstants.IframeCC
        );
        const timeout: number = Constants.FifteenThousand;

        // If CC has two or more notifications it is required to expand the list to verify the expected one.
        if (
            await this.waitUntilSelectorIsVisible(
                "div.webchat__toaster__expandIcon",
                3,
                iFrame
            )
        ) {
            const expandToasts = await iFrame.$("div.webchat__toaster__expandIcon");
            await expandToasts.evaluate((el) => (el as HTMLElement).click());
        }

        const expectedToastExists = await iFrame.waitForFunction(
            (expectedMessage) =>
                [
                    ...document.querySelectorAll("li.webchat__toaster__listItem"),
                ].some((el) => el.textContent.includes(expectedMessage)),
            text,
            { timeout }
        );
        expect(expectedToastExists).toBeTruthy();
    }

    public async verifyFileDownloadAtAgent(page: Page): Promise<boolean> {
        const iframe: Page = await IFrameHelper.GetIframe(
            page,
            IFrameConstants.IframeCC
        );
        const ImageSelectorFlagValue = await this.waitUntilSelectorIsVisible(
            AgentChatConstants.AgentScreenImageBoxSelector,
            AgentChatConstants.Five,
            iframe,
            Constants.FourThousandsMiliSeconds
        );
        if (ImageSelectorFlagValue) {
            const [download] = await Promise.all([
                page.waitForEvent(AgentChatConstants.Download),
                iframe.$eval(AgentChatConstants.AgentScreenImageBoxSelector, (el) =>
                    (el as HTMLElement).click()
                ),
            ]);
            const path = await download.path();
            return path != null && path != undefined && path != "";
        }
        return false;
    }

    public async sendImageAttachmentAgent(filePath: string, page: Page) {
        await this.waitForDomContentLoaded();
        await this.waitUntilSelectorIsVisible(IFrameConstants.IframeCC);
        const iframe: Page = await IFrameHelper.GetIframe(
            page,
            IFrameConstants.IframeCC
        );
        await this.waitForDomContentLoaded();
        await this.waitUntilSelectorIsHidden(
            AgentChatConstants.LiveChatUploadFile,
            AgentChatConstants.Ten,
            iframe
        );
        await this.waitUntilSelectorIsVisible(AgentChatConstants.LiveChatUploadFile, Constants.Five, iframe, Constants.FourThousandsMiliSeconds);
        await iframe.setInputFiles(
            AgentChatConstants.LiveChatUploadFile,
            filePath
        );
        await this.waitForDomContentLoaded();
        await iframe.$eval(AgentChatConstants.SendMessageButton, (el) => {
            (el as HTMLElement).scrollIntoView();
            (el as HTMLElement).click();
        });
        await page.waitForTimeout(Constants.DefaultTimeout);
    }

    public async validateSystemMessage(text: string, page: Page) {
        const iFrame: Page = await IFrameHelper.GetIframe(
            page,
            IFrameConstants.IframeCC
        );
        return await this.waitUntilSelectorIsVisible(
            AgentChatConstants.ValiadationMessage.replace("{0}", text),
            Constants.Twelve,
            iFrame,
            Constants.DefaultTimeout
        );
    }

    public async verifyCustomerFileUpload(page: Page): Promise<boolean> {
        const iframe: Page = await IFrameHelper.GetIframe(
            page,
            IFrameConstants.IframeCC
        );
        return await this.waitUntilSelectorIsVisible(
            AgentChatConstants.AgentScreenImageBoxSelector,
            AgentChatConstants.Twelve,
            iframe,
            Constants.DefaultTimeout
        );
    }

    public async validateAttachmentsInCloseWS(page: Page): Promise<boolean> {
        return await this.waitUntilSelectorIsVisible(
            FacebookAttachmentConstants.ClosedConversationFileAttachmentSelector,
            Constants.Five,
            page,
            Constants.FourThousandsMiliSeconds
        );
    }


    public async verifySystemMessages(page: AgentChat, senderId: string): Promise<boolean> {
        const uniqueMsg = Math.random().toString(16).substr(2, 4);
        const conversationTitle = Math.random().toString(16).substr(2, 4);
        const response = await SendFacebookMessage(
            senderId,
            this.facebookPageId,
            uniqueMsg,
            this.bcrAppId, null, conversationTitle);

        if (!!response && Util.isSuccessfulStatusCode(response.status) && response.data.isSuccessStatusCode === true) {
            await page.acceptPushChatByTitleAndMessage(uniqueMsg, conversationTitle);
            const customerSendFileFlag = await SendFacebookMessageWithAttachment(
                senderId,
                this.facebookPageId,
                uniqueMsg,
                this.bcrAppId,
                "jpg", conversationTitle);

            const attachmentFirstFlag = (customerSendFileFlag || (await this.verifyFileDownloadAtAgent(page.Page)));

            await SendFacebookMessageWithAttachment(
                senderId,
                this.facebookPageId,
                FacebookMessangerConstants.CustomerMessage,
                this.bcrAppId,
                "dll", conversationTitle);
            await this.validateSystemMessage(AgentChatConstants.CustomerSentUnsupportedTypeMessage, page.Page);

            await this.sendImageAttachmentAgent(FacebookMessangerConstants.SmallSizeImagePath, page.Page);

            await this.sendImageAttachmentAgent(FacebookMessangerConstants.LargeSizeImagePath, page.Page);
            await this.verifyFileUploadAtAgent(AgentChatConstants.ImageSizeExceedMessage, page.Page);

            await this.sendImageAttachmentAgent(FacebookAttachmentConstants.DllFilePath, page.Page);
            await this.verifyFileUploadAtAgent(FacebookAttachmentConstants.DllFileMessage, page.Page);

            return attachmentFirstFlag;
        }
        else {
            return false;
        }
    }


    public async verifyFileUploadFromAgentAndCustomer(page: AgentChat, senderId: string): Promise<boolean> {
        const uniqueMsg = Math.random().toString(16).substr(2, 4);
        const conversationTitle = Math.random().toString(16).substr(2, 4);
        const response = await SendFacebookMessage(
            senderId,
            this.facebookPageId,
            uniqueMsg,
            this.bcrAppId, null, conversationTitle);

        if (!!response && Util.isSuccessfulStatusCode(response.status) && response.data.isSuccessStatusCode === true) {
            await page.acceptPushChatByTitleAndMessage(uniqueMsg, conversationTitle);
            const customerSendFileFlag = await SendFacebookMessageWithAttachment(
                senderId,
                this.facebookPageId,
                uniqueMsg,
                this.bcrAppId,
                "jpg", conversationTitle);

            const attachmentFirstFlag = (customerSendFileFlag || (await this.verifyFileDownloadAtAgent(page.Page)));

            await this.sendImageAttachmentAgent(FacebookMessangerConstants.SmallSizeImagePath, page.Page);
            const attachmentSecondFlag = (await this.verifyFileDownloadAtAgent(page.Page));
            return (attachmentFirstFlag || attachmentSecondFlag);
        }
        else {
            return false;
        }
    }

    public async verifyFileUploadFromFacebook(page: AgentChat, senderId: string): Promise<boolean> {
        const uniqueMsg = Math.random().toString(16).substr(2, 4);
        const conversationTitle = Math.random().toString(16).substr(2, 4);
        const response = await SendFacebookMessage(
            senderId,
            this.facebookPageId,
            uniqueMsg,
            this.bcrAppId, null, conversationTitle);

        if (!!response && Util.isSuccessfulStatusCode(response.status) && response.data.isSuccessStatusCode === true) {
            await page.acceptPushChatByTitleAndMessage(uniqueMsg, conversationTitle);
            const customerSendFileFlag = await SendFacebookMessageWithAttachment(
                senderId,
                this.facebookPageId,
                uniqueMsg,
                this.bcrAppId,
                "jpg", conversationTitle);

            const attachmentFirstFlag = (customerSendFileFlag || (await this.verifyFileDownloadAtAgent(page.Page)));
            await this.sendImageAttachmentAgent(FacebookMessangerConstants.SmallSizeImagePath, page.Page);
            const attachmentSecondFlag = await this.verifyCustomerFileUpload(page.Page);

            return (attachmentFirstFlag || attachmentSecondFlag);
        }
        else {
            return false;
        }
    }

    public async verifyAttachmentIsDisabled(page: AgentChat, senderId: string): Promise<boolean> {
        const uniqueMsg = Math.random().toString(16).substr(2, 4);
        const conversationTitle = Math.random().toString(16).substr(2, 4);
        const response = await SendFacebookMessage(
            senderId,
            this.facebookPageId,
            uniqueMsg,
            this.bcrAppId, null, conversationTitle);

        if (!!response && Util.isSuccessfulStatusCode(response.status) && response.data.isSuccessStatusCode === true) {
            await page.acceptPushChatByTitleAndMessage(uniqueMsg, conversationTitle);
            await SendFacebookMessageWithAttachment(
                senderId,
                this.facebookPageId,
                uniqueMsg,
                this.bcrAppId,
                "jpg", conversationTitle);

            await this.validateSystemMessage(AgentChatConstants.CustomerSentUnsupportedTypeMessage, page.Page);
            const attachmentFlag = await this.verifySendFileBtnIsDisable(page.Page);
            return (!attachmentFlag);
        }
        else {
            return false;
        }
    }

    public async verifyAgentAttachmentIsDisabled(page: AgentChat, senderId: string): Promise<boolean> {
        const uniqueMsg = Math.random().toString(16).substr(2, 4);
        const conversationTitle = Math.random().toString(16).substr(2, 4);
        const response = await SendFacebookMessage(
            senderId,
            this.facebookPageId,
            uniqueMsg,
            this.bcrAppId, null, conversationTitle);

        if (!!response && Util.isSuccessfulStatusCode(response.status) && response.data.isSuccessStatusCode === true) {
            await page.acceptPushChatByTitleAndMessage(uniqueMsg, conversationTitle);
            const customerSendFileFlag = await SendFacebookMessageWithAttachment(
                senderId,
                this.facebookPageId,
                uniqueMsg,
                this.bcrAppId,
                "jpg", conversationTitle);

            const attachmentFirstFlag = (customerSendFileFlag || (await this.verifyFileDownloadAtAgent(page.Page)));
            const attachmentSecondFlag = await this.verifySendFileBtnIsDisable(page.Page);
            return (attachmentFirstFlag && !attachmentSecondFlag);
        }
        else {
            return false;
        }
    }

    public async verifyCustomerAttachmentIsDisabled(page: AgentChat, senderId: string): Promise<boolean> {
        const uniqueMsg = Math.random().toString(16).substr(2, 4);
        const conversationTitle = Math.random().toString(16).substr(2, 4);
        const response = await SendFacebookMessage(
            senderId,
            this.facebookPageId,
            uniqueMsg,
            this.bcrAppId, null, conversationTitle);

        if (!!response && Util.isSuccessfulStatusCode(response.status) && response.data.isSuccessStatusCode === true) {
            await page.acceptPushChatByTitleAndMessage(uniqueMsg, conversationTitle);
            await SendFacebookMessageWithAttachment(
                senderId,
                this.facebookPageId,
                uniqueMsg,
                this.bcrAppId,
                "jpg", conversationTitle);

            await this.validateSystemMessage(AgentChatConstants.CustomerSentUnsupportedTypeMessage, page.Page);
            await this.sendImageAttachmentAgent(FacebookMessangerConstants.SmallSizeImagePath, page.Page);
            const attachmentFlag = await this.verifyFileDownloadAtAgent(page.Page);
            return attachmentFlag;
        }
        else {
            return false;
        }
    }

    public async verifySendFileBtnIsDisable(page: Page) {
        const iframe: Page = await IFrameHelper.GetIframe(
            page,
            IFrameConstants.IframeCC
        );
        await this.waitUntilSelectorIsVisible(
            AgentChatConstants.MessageTextArea,
            AgentChatConstants.Three,
            iframe
        );
        await this.waitUntilSelectorIsHidden(
            AgentChatConstants.LiveChatUploadFile,
            AgentChatConstants.Ten,
            iframe
        );
        return await this.waitUntilSelectorIsVisible(
            AgentChatConstants.LiveChatUploadFile,
            AgentChatConstants.Three,
            iframe
        );
    }
}