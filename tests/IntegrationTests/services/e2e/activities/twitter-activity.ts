import { Customer, OCCustomer } from "../../../models/oc-customer.t";
import { AsyncConnectorActivity } from "../../../types/e2e/async-connector-activity.t";
import { Extension, isImageExtension } from "../../../types/e2e/attachment-extension.t";
import { Util } from "../../../Utility/Util";
import { TwitterAttachmentPathResolver } from "../attachment-path-resolver";
import { BaseActivity } from "./async-connector-base-activity";

export class TwitterActivity extends BaseActivity {
  public static readonly defaultCustomerName = "Playwright Twitter";

  private recipientId: string;

  constructor(recipientId: string) {
    super();
    this.recipientId = recipientId;
    this.useCustomer(new Customer(Util.generateNumber(20).toString(), TwitterActivity.defaultCustomerName));
    this.applyToTemplate("for_user_id", recipientId);
    this.applyToTemplate("direct_message_events[0].message_create.target.recipient_id", recipientId);
  }

  public useMessage(msg: string): AsyncConnectorActivity {
    this.apply("direct_message_events[0].message_create.message_data.text", msg);
    return this;
  }

  public useCustomer(customer: OCCustomer): AsyncConnectorActivity {
    const { senderId, displayName } = customer;
    this.applyToTemplate("users", {}); // Clear the users to reset by new IDs
    this.applyToTemplate("direct_message_events[0].message_create.sender_id", senderId);
    this.applyToTemplate(`users.${senderId}`, this.getSenderPayloadSection(senderId, displayName));
    this.applyToTemplate(`users.${this.recipientId}`, this.getRecipientPayloadSection(this.recipientId));

    return this;
  }

  public useAttachment(extension: Extension): AsyncConnectorActivity {
    if (isImageExtension(extension)) {
      this.apply("direct_message_events[0].message_create.message_data.attachment", this.getAttachmentSection(TwitterAttachmentPathResolver.Instance.getFileURL(extension)));
    }

    return this;
  }

  protected getTemplate(): object {
    const stringTemplate = `{
            "for_user_id": "",
            "direct_message_events": [
              {
                "type": "message_create",
                "id": "1204474295503572996",
                "created_timestamp": "1576004024755",
                "message_create": {
                  "target": {
                    "recipient_id": ""
                  },
                  "sender_id": "",
                  "message_data": {
                    "text": "Default Twitter message",
                    "entities": {
                      "hashtags": [],
                      "symbols": [],
                      "user_mentions": [],
                      "urls": []
                    }
                  }
                }
              }
            ],
            "users": {}
          }`;

    return JSON.parse(stringTemplate);
  }

  private getRecipientPayloadSection(recipientId: string): object {
    return {
      id: recipientId,
      created_timestamp: "1513899925390",
      name: "playwrightAutomationUser"
    };
  }

  private getSenderPayloadSection(senderId: string, senderName: string): object {
    return {
      id: senderId,
      created_timestamp: "1556150580171",
      name: senderName
    };
  }

  private getAttachmentSection(url: string): object {
    return {
      type: "photo",
      media: {
        media_url: url,
        type: "photo",
        id: Util.generateNumber(5)
      }
    };
  }
}