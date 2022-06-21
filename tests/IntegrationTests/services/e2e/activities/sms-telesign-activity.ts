import { OCCustomer } from "../../../models/oc-customer.t";
import { AsyncConnectorActivity } from "../../../types/e2e/async-connector-activity.t";
import { Extension } from "../../../types/e2e/attachment-extension.t";
import { BaseActivity } from "./async-connector-base-activity";

export class SMSTeleSignActivity extends BaseActivity {
    constructor(senderId: string) {
        super();
        this.applyToTemplate("user_response.sender_id", senderId);
    }

    public useMessage(msg: string): AsyncConnectorActivity {
        this.applyToTemplate("user_response.mo_message", msg);
        return this;
    }

    public useAttachment(extension: Extension): AsyncConnectorActivity {
        return this;
    }

    public useCustomer(customer: OCCustomer): AsyncConnectorActivity {
        if (customer.senderId !== customer.displayName) {
            throw new Error("WeChat customer model should has same values for senderId and displayName");
        }
        this.apply("user_response.phone_number", customer.senderId);
        return this;
    }

    protected getTemplate(): object {
        const phoneNumber = Math.random().toString().slice(2, 13);       
        return  {
            "status":
            {
                "updated_on": "2017-01-27T19:46:55.787464Z",
                "code": 1500,
                "description": "Delivered to customer"
            },
            "submit_timestamp": "2017-01-27T19:46:55.778000Z",
            "errors": [],
            "user_response":
            {
                "phone_number": phoneNumber,
                "sender_id": "",
                "mo_message": "SMS telesign channel default message"
            },
            "sub_resource": "mo_sms",
            "reference_id": "0143D53D86A2030BE20025B600000002"
        };
    }

}