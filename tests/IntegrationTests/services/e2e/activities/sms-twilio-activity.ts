import { OCCustomer } from "../../../models/oc-customer.t";
import { AsyncConnectorActivity } from "../../../types/e2e/async-connector-activity.t";
import { Extension } from "../../../types/e2e/attachment-extension.t";
import { AttachmentPathResolver } from "../attachment-path-resolver";
import { BaseActivity } from "./async-connector-base-activity";

export class SMSTwilioActivity extends BaseActivity {
    constructor(senderId: string, accountSid: string) {
        super();
        this.applyToTemplate("To", senderId);
        this.applyToTemplate("AccountSid", accountSid);
    }

    public useMessage(msg: string): AsyncConnectorActivity {
        this.apply("Body", msg);
        return this;
    }

    public useAttachment(extension: Extension): AsyncConnectorActivity {
        const attachmentResolver = AttachmentPathResolver.Instance;
        this.apply("NumMedia", 1);
        this.apply("MediaUrl0", attachmentResolver.getFileURL(extension));
        this.apply("MediaContentType0", attachmentResolver.getMimeType(extension));

        return this;
    }

    public useCustomer(customer: OCCustomer): AsyncConnectorActivity {
        if (customer.senderId !== customer.displayName) {
            throw new Error("WeChat customer model should has same values for senderId and displayName");
        }
        this.apply("From", customer.senderId);
        return this;
    }

    protected getTemplate(): object {
        const customerPhoneNumber = Math.random().toString().slice(3, 13)       
        return  {
            "AccountSid": "",
            "ApiVersion": "2010-04-01",
            "Body": "SMS twilio channel default message",
            "From": customerPhoneNumber,
            "MessageSid": "SM6cd3768cac661ef86ac1e29fb323bf77",
            "NumMedia": "0",
            "NumSegments": "1",
            "SmsMessageSid": "SM6cd3768cac661ef86ac1e29fb323bf77",
            "SmsSid": "SM6cd3768cac661ef86ac1e29fb323bf77",
            "SmsStatus": "received",
            "To": ""
        };
    }

}