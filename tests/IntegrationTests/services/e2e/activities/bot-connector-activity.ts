import { Customer, OCCustomer } from "../../../models/oc-customer.t";
import { AsyncConnectorActivity } from "../../../types/e2e/async-connector-activity.t";
import { Extension } from "../../../types/e2e/attachment-extension.t";
import { Util } from "../../../Utility/Util";
import { AttachmentPathResolver } from "../attachment-path-resolver";
import { BaseActivity } from "./async-connector-base-activity";

export class BotConnectorActivity extends BaseActivity {
  public static readonly defaultCustomerName: string = "Playwright BotChannel";

  protected recipient: string;

  constructor(serviceUrl: string, channelId: string, recipientId: string) {
    super();
    this.recipient = recipientId;
    this.applyToTemplate("channelId", channelId);
    this.applyToTemplate("serviceUrl", serviceUrl);
    this.applyToTemplate("recipient.id", recipientId);
    this.useCustomer(this.getDefaultCustomer());
  }

  public useMessage(msg: string): AsyncConnectorActivity {
    this.apply("text", msg);
    return this;
  }

  public useCustomer(customer: OCCustomer): AsyncConnectorActivity {
    this.applyToTemplate("from.id", customer.senderId);
    this.applyToTemplate("from.name", customer.displayName);
    return this;
  }

  public useAttachment(extension: Extension): AsyncConnectorActivity {
    this.apply("attachments", this.getAttachmentSection(extension));
    return this;
  }

  protected getTemplate(): object {
    const stringTemplate = `{
      "from": {
        "id": "",
        "name": ""
      },
      "recipient": {
        "id": ""
      },
      "conversation": {
        "id": "${Util.newGuid()}"
      },
      "channelId": "",
      "type": "message",
      "serviceUrl": "",
      "id": "35-283048246-f",
      "text": "Bot channel default message",
      "timestamp": "2020-09-15T11:16:02.8999269+03:00"
    }`;

    return JSON.parse(stringTemplate);
  }

  protected getAttachmentSection(extension: Extension): Array<object> {
    const attachmentResolver = AttachmentPathResolver.Instance;
    const attachmentObject = {
      Id: Util.generateNumber(5),
      Name: `testFile.${extension}`,
      ContentType: attachmentResolver.getMimeType(extension),
      ContentUrl: attachmentResolver.getFileURL(extension)
    }
    
    return [attachmentObject];
  }

  protected getDefaultCustomer(): OCCustomer {
    return new Customer(Util.newGuid(), BotConnectorActivity.defaultCustomerName);
  }
}