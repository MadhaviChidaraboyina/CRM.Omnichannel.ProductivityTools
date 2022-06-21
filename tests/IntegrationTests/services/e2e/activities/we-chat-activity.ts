import { OCCustomer } from "../../../models/oc-customer.t";
import { AsyncConnectorActivity } from "../../../types/e2e/async-connector-activity.t";
import { Extension, isImageExtension } from "../../../types/e2e/attachment-extension.t";
import { Util } from "../../../Utility/Util";
import { AttachmentPathResolver } from "../attachment-path-resolver";
import { BaseActivity } from "./async-connector-base-activity";

export class WeChatActivity extends BaseActivity {

    constructor(serviceAccountId: string) {
        super();
        this.applyToTemplate("ToUserName", serviceAccountId);
    }

    public useMessage(msg: string): AsyncConnectorActivity {
        this.apply("Content", msg);
        return this;
    }

    public useAttachment(extension: Extension): AsyncConnectorActivity {
        if (isImageExtension(extension)) {
            this.apply("MsgType", "image");
            this.apply("PicUrl", AttachmentPathResolver.Instance.getFileURL(extension));
            this.apply("MediaId", Util.generateString(6).concat(`.${extension}`));
        }

        return this;
    }

    public useCustomer(customer: OCCustomer): AsyncConnectorActivity {
        if (customer.senderId !== customer.displayName) {
            throw new Error("WeChat customer model should has same values for senderId and displayName");
        }
        this.apply("FromUserName", customer.senderId);
        return this;
    }

    protected getTemplate(): object {
        return {
            "xml": {
                // using fixed name for RI testing
                "FromUserName": "testSender",
                "CreateTime": "1588853017",
                "MsgType": "text",
                "Content": "Default WeChat message",
                "MsgId": "22741293403265249"
            }
        };
    }

    protected applyToTemplate(jPath: string, value: any) {
        super.applyToTemplate(this.xmlRootJPath(jPath), value);
    }

    protected apply(jPath: string, value: any) {
        super.apply(this.xmlRootJPath(jPath), value);
    }

    private xmlRootJPath(jPath: string) {
        return "xml.".concat(jPath);
    }
}