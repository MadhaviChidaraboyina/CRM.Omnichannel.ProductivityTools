import { Extension, ImageExtension, isImageExtension, isVideoExtension } from "../../../types/e2e/attachment-extension.t";

import { AsyncConnectorActivity } from "../../../types/e2e/async-connector-activity.t";
import { BaseActivity } from "./async-connector-base-activity";
import { OCCustomer } from "../../../models/oc-customer.t";
import { Util } from "../../../Utility/Util";

export class AppleAppActivity extends BaseActivity {
;
    constructor(appleBusinessAccountId: string) {
        super();
        this.applyToTemplate("DestinationId", appleBusinessAccountId);
    }

    public useMessage(msg: string): AsyncConnectorActivity {
        this.apply("Body", msg);
        return this;
    }

    public useCustomer(customer: OCCustomer): AsyncConnectorActivity {
        const { senderId, displayName } = customer;
        this.apply("SourceId", senderId);
        return this;
    }

    public useAttachment(extension: Extension): AsyncConnectorActivity {
        return this;
    }

    protected getTemplate(): object {
        const stringTemplate = `{
            "DestinationId": "",
            "SourceId":  "",
            "Id": "${Util.newGuid()}",
            "Type": "text",
            "Body": "",
            "V": 1
        }`;

        return JSON.parse(stringTemplate);
    }
}