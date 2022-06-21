import { AttachmentPathResolver, WhatsAppAttachmentsPathResolver } from "../attachment-path-resolver";
import { Extension, ImageExtension, isImageExtension, isVideoExtension } from "../../../types/e2e/attachment-extension.t";

import { AsyncConnectorActivity } from "../../../types/e2e/async-connector-activity.t";
import { BaseActivity } from "./async-connector-base-activity";
import { OCCustomer } from "../../../models/oc-customer.t";
import { Util } from "../../../Utility/Util";

export class WhatsAppActivity extends BaseActivity {
    constructor(accountSid: string, orgNumber: string) {
        super();
        this.applyToTemplate("AccountSid", accountSid);
        this.applyToTemplate("To", `whatsapp:+${orgNumber}`);
    }

    public useMessage(msg: string): AsyncConnectorActivity {
        this.apply("Body", msg);
        return this;
    }

    public useCustomer(customer: OCCustomer): AsyncConnectorActivity {
        if (customer.displayName !== customer.senderId) {
            throw new Error("WhatsApp customer must have the same value for senderId and displayName both set to phone number");
        }
        this.apply("From", customer.senderId);

        return this;
    }

    public useAttachment(extension: Extension): AsyncConnectorActivity {
        // Unsupported file attachments are converted to the text messages at Twilio side. Skip this step in automation since we are targeting AsyncConnector
        if (isImageExtension(extension) || isVideoExtension(extension)) {
            this.apply("NumMedia", 1);
            this.apply("MediaUrl0", WhatsAppAttachmentsPathResolver.Instance.getFileURL(extension));
            this.apply("MediaContentType0", WhatsAppAttachmentsPathResolver.Instance.getMimeType(extension));
        }

        return this;
    }

    protected getTemplate(): object {
        const customerPhoneNumber = Util.generateNumber(9);
        const stringTemplate = `{
            "MessageSid": "SM6cd3768cac661ef86ac1e29fb323bf77",
            "SmsMessageSid": "SM6cd3768cac661ef86ac1e29fb323bf77",
            "SmsSid": "SM6cd3768cac661ef86ac1e29fb323bf77",
            "AccountSid": "",
            "From": "${customerPhoneNumber}",
            "To": "",
            "Body": "Default WhatsApp message",
            "NumMedia": "0",
            "SmsStatus": "received",
            "NumSegments": "1",
            "ApiVersion": "2010-04-01"
        }`;

        return JSON.parse(stringTemplate);
    }
}