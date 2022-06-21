import { BasePage } from "../pages/BasePage";
import { Constants } from "../Utility/Constants";
import { Page } from "playwright";

export enum CustomConstants {
    ValidateLabel = "Custom Messaging",
    ValidateCustomMessage = "//label[contains(text(),'Custom Messaging')]",
    MessageToAgent = "Hi! Ping from customer to agent",
    NewCustomMessagingChannelTitle = "h1[title='New Custom messaging channel']",
    CustomChannelPageRecordXpath = "//div[@title='{0}']",
    CustomChannelRecord = "TestCustomDirect",
    CustomChannelPageRecord = "TestCustomChannel",
    BotMessageLoad = "//p[contains(text(),'Here are your itinerary details')]",
    AdaptiveCard = "//p[contains(text(),'Adaptive Card')]",
    AdaptiveCardSubmitAction = "//p[contains(text(),'Adaptive Card Submit Action')]",
    HeroCardButton = "button[aria-label='Seattle']",
    ReceiptCardButton = "button[aria-label='More information']",
    Signincard = "//p[contains(text(),'BotFramework Sign-in Card')]",
    ThumbnailCardButton = "button[aria-label='Get Started']",
    AudioCardButton = "button[aria-label='Read More']",

}

export enum ChatConstants {
    ChatMessage = "input[data-id='webchat-sendbox-input']",
    SendButton = "//button[contains(@title, 'Send')]",
    Engagementchannel = "label[data-id='msdyn_conversationsummaryfield.fieldControl-msdyn_channelValueLabel']",
    UploadFile = "//button[@title='Upload file']",
    CustomerScreenImageBoxSelector = "(//*[@class='webchat__fileContent__buttonLink'])[last()]",
}

export class CustomChatPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    private newCardsData = {
        HeroCard: "Seattle",
        RecepitCard: "More information",
        ThumbnailCard: "Get Started",
        AudioCard: "Read More",
    };

    public async open(directLine: string) {
        await this._page.goto(directLine);
        await this._page.waitForTimeout(Constants.MaxTimeout);
    }

    public async initiateChat() {
        await this.fillInputData(
            ChatConstants.ChatMessage, "Hi");
        await this.Page.click(ChatConstants.SendButton);
    }

    public async validationCoversationControl() {
        const message = CustomConstants.ValidateLabel as string;
        await this.waitForDomContentLoaded();
        const title = await this.Page.waitForSelector(
            CustomConstants.ValidateCustomMessage
        );
        const currentName = (await title.textContent()).toString();
        return message == currentName;
    }

    public async sendMessageWithAttachment() {
        await this.fillInputData(ChatConstants.ChatMessage, "Hi");
        await this.Page.setInputFiles(ChatConstants.UploadFile, "FileResources//LiveChatAttachment.txt");
        await this.Page.click(ChatConstants.SendButton);
    }

    public async verifyFileDownloadAtCustomerEnd() {
        let ImageSelectorFlagValue = await this.Page.waitForSelector(ChatConstants.CustomerScreenImageBoxSelector);
        if (ImageSelectorFlagValue) {
            const [download] = await Promise.all([
                this.Page.waitForEvent("download"),
                this.Page.$eval(ChatConstants.CustomerScreenImageBoxSelector, el => (el as HTMLElement).click())
            ]);
            const path = await download.path();
            return (path != null && path != undefined && path != "");
        }
        return false;
    }

    public async VerifyAttachmentButton() {
        expect(await this.waitUntilSelectorIsHidden(ChatConstants.UploadFile)).toBeTruthy();
    }

    public async loadBotMessages(message: string) {
        const systemmessage = await this.Page.waitForSelector(CustomConstants.BotMessageLoad);
        const entityItemText = await systemmessage.textContent();
        var text = /itinerary/gi;
        if (entityItemText.search(text) == -1) {
            await this.loadMessages(message);
        }
    }

    public async loadMessages(message: string) {
        const textarea = await this.Page.waitForSelector(ChatConstants.ChatMessage);
        await textarea.fill(message);
        await this.Page.click(ChatConstants.SendButton);
    }
    public async sendBotMessage(message: string) {
        await this.fillInputData(
            ChatConstants.ChatMessage, message);
        await this.Page.click(ChatConstants.SendButton);
    }

    public async validateHeroCard() {
        const herocard = await this.Page.waitForSelector(CustomConstants.HeroCardButton);
        const herocardValue = await herocard.textContent();
        herocardValue == this.newCardsData.HeroCard;
    }

    public async validateReceiptCard() {
        const recepitCard = await this.Page.waitForSelector(CustomConstants.ReceiptCardButton);
        const recepitCardValue = await recepitCard.textContent();
        recepitCardValue == this.newCardsData.RecepitCard;
    }
    public async validateSigninCard() {
        const systemmessage = await this.Page.waitForSelector(CustomConstants.Signincard);
        const entityItemText = await systemmessage.textContent();
        var text = /BotFramework/gi;
        if (entityItemText.search(text) != -1) {
            return true;
        }
    }
    public async validateThumbnailCard() {
        const systemmessage = await this.Page.waitForSelector(CustomConstants.ThumbnailCardButton);
        const thumbnailCardValue = await systemmessage.textContent();
        thumbnailCardValue == this.newCardsData.ThumbnailCard;
    }
    public async validateAudioCard() {
        const systemmessage = await this.Page.waitForSelector(CustomConstants.AudioCardButton);
        const audioCardValue = await systemmessage.textContent();
        audioCardValue == this.newCardsData.AudioCard;
    }
}
