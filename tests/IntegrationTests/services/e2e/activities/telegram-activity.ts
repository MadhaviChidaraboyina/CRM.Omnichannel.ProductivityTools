import { AsyncConnectorConstants } from "../../../Utility/Constants";
import { BotConnectorActivity } from "./bot-connector-activity";
import { Util } from "../../../Utility/Util";
import { Customer, OCCustomer } from "../../../models/oc-customer.t";
import { AsyncConnectorActivity } from "../../../types/e2e/async-connector-activity.t";
import { Extension } from "../../../types/e2e/attachment-extension.t";

export class TelegramActivity extends BotConnectorActivity {
    public static readonly defaultCustomerName: string = "Playwright Telegram";

    constructor(telegramAppId: string) {
        super(AsyncConnectorConstants.TelegramServiceUrl, AsyncConnectorConstants.TelegramChannelId, telegramAppId);
    }

    public useMessageWithMarkdown(text: string, offset: number, length: number, type: string, url?: string): TelegramActivity {
        this.useMessage(text);
        this.apply("channelData.message.entities", this.getEntitiesSection(offset, length, type, url));
        return this;
    }

    public useMessage(text: string): TelegramActivity {
        super.useMessage(text);
        this.apply("channelData.message.text", text);

        return this;
    }

    public useCustomer(customer: OCCustomer): AsyncConnectorActivity {
        const { displayName, senderId } = customer;
        this.applyToTemplate("channelData.message.from.id", senderId);
        this.applyToTemplate("channelData.message.chat.id", senderId);
        this.applyToTemplate("channelData.message.from.username", displayName);
        this.applyToTemplate("channelData.message.chat.username", displayName);

        return super.useCustomer(customer);
    }

    protected getDefaultCustomer(): OCCustomer {
        return new Customer(Util.generateNumber(15).toString(), TelegramActivity.defaultCustomerName);
    }

    protected getTemplate(): object {
        const defaultText = "Default Telegram message";
        const botTemplate = super.getTemplate();
        botTemplate["text"] = defaultText;
        botTemplate["channelData"] = this.getChannelDataSection(defaultText);

        return botTemplate;
    }

    private getEntitiesSection(offset: number, length: number, type: string, url?: string): Array<object> {
        let entity = {
            "offset": offset,
            "length": length,
            "type": type
        };

        if (url) {
            entity["url"] = url;
        }

        return [entity];
    }

    private getChannelDataSection(text: string): object {
        const updateId = Util.generateNumber();
        const name = Util.generateNumber(5);

        return {
            "update_id": updateId,
            "message": {
                "message_id": 386,
                "from": {
                    "id": "",
                    "is_bot": false,
                    "first_name": name,
                    "username": "",
                    "language_code": "en"
                },
                "chat": {
                    "id": "",
                    "first_name": name,
                    "username": "",
                    "type": "private"
                },
                "date": 1604507569,
                "text": text
            }
        };
    }

    protected getAttachmentSection(extension: Extension) {
        const attachmentsSection = super.getAttachmentSection(extension);
        attachmentsSection[0]["AttachmentSize"] = 1024;
        return attachmentsSection;
    }
}