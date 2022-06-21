import { Customer, OCCustomer } from "../../../models/oc-customer.t";
import { AsyncConnectorConstants } from "../../../Utility/Constants";
import { Util } from "../../../Utility/Util";
import { BotConnectorActivity } from "./bot-connector-activity";

export class FacebookActivity extends BotConnectorActivity {
    public static readonly defaultCustomerName: string = "Playwright Facebook";

    constructor(facebookAppId: string) {
        super(AsyncConnectorConstants.FacebookServiceUrl, AsyncConnectorConstants.FacebookChannelId, facebookAppId);
        this.applyToTemplate("text", "Default FB message");
    }

    public useCustomer(customer: OCCustomer) {
        super.useCustomer(customer);
        this.applyToTemplate("conversation.id", this.getConversationId(customer.senderId));

        return this;
    }

    protected getDefaultCustomer(): OCCustomer {
        return new Customer(Util.generateNumber(15).toString(), FacebookActivity.defaultCustomerName);
    }

    private getConversationId(senderId: string) {
        return `${senderId}-${this.recipient}`;
    }
}