import { Customer, OCCustomer } from "../../../models/oc-customer.t";
import { AsyncConnectorConstants } from "../../../Utility/Constants";
import { Util } from "../../../Utility/Util";
import { BotConnectorActivity } from "./bot-connector-activity";

export class TeamsActivity extends BotConnectorActivity {
  public static readonly defaultCustomerName: string = "Playwright Teams";

  constructor(teamsAppId: string) {
    super(AsyncConnectorConstants.TeamsServiceUrl, AsyncConnectorConstants.TeamsChannelId, teamsAppId);
    const defaultText = "Default Teams message";

    this.applyToTemplate("text", defaultText);
  }

  public useMessageWithAttachmentText(text: string, attachmentText: string): TeamsActivity {
    super.useMessage(text);

    this.apply("attachments", this.getTextAttachmentSection(attachmentText));
    return this;
  }

  protected getTextAttachmentSection(text: string): Array<object> {
    const jsonSection = `[
          {
            "Index": 0,
            "ContentType": "text/html",
            "Content": "${text}"
          }
        ]`;

    return JSON.parse(jsonSection);
  }

  protected getDefaultCustomer(): OCCustomer {
    return new Customer(Util.generateNumber(15).toString(), TeamsActivity.defaultCustomerName);
  }
}