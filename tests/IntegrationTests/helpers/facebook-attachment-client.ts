import * as axios from "axios";
import { BCRClient } from "./bcr-client";
import { TestSettings } from "../configuration/test-settings";
import { Util } from "../Utility/Util";

const axiosDefault = axios.default;
export const FacebookIncomingUrl = `${TestSettings.ApiGatewayUrl}/botchannel/incoming?orgId=${TestSettings.OrgId}`;

export const SendFacebookMessageWithAttachment = async (fromFacebookAppId: string, sendToFBAppId: string, messageText: string, bcrClientId: string, extension: string = "jpg", conversationTitle?: string) => {
    const bcrToken = await BCRClient.getInstance().getToken(bcrClientId);
    const fbAttachmentTemplate = new FacebookAttachmentTemplate();
    let requestBody = {};
    let contentUrl = "";
    let contentName = "";
    let contentType = "";
    let response: any;
    try {
        if (extension !== null && extension !== "") {
            if (extension === "jpg") {
                contentUrl = TestSettings.AttachmentImageBlobUrl;
                contentName = TestSettings.AttachmentImageName;
                contentType = "image/jpeg";
            }
            else if (extension === "dll") {
                contentUrl = TestSettings.AttachmentDllblobUrl;
                contentName = TestSettings.AttachmentDllName;
                contentType = "application/x-msdownload";
            }
            else {
                throw new Error(`FacebookAttachment message failed. Extention value received as: ${extension}`);
            }
            requestBody = await fbAttachmentTemplate.getTemplate(fromFacebookAppId, sendToFBAppId, messageText, contentType, contentUrl, contentName,conversationTitle);
        }
        else {
            throw new Error(`FacebookAttachment message failed. Extention value received as null, empty or undefined.`);
        }
        response = await axiosDefault.post(FacebookIncomingUrl, JSON.stringify(requestBody), {
            headers: {
                "Authorization": `Bearer ${bcrToken}`,
                "Content-Type": "application/json"
            }
        });

        if (!!response && Util.isSuccessfulStatusCode(response.status) && response.data.isSuccessStatusCode === true) {
            return true;
        }
        else {
            return false;
        }
    }
    catch (error) {
        throw new Error(`Facebook BotConnector message failed. BCR MsAppId: ${bcrClientId}. Error message: ${error.message}`);
    }
};

export class FacebookAttachmentTemplate {
    public async getTemplate(fromFacebookAppId: string, sendToFBAppId: string, messageText: string, contentType: string, contentUrl: string, contentName: string, conversationTitle?: string): Promise<object> {
        const stringTemplate = {
            "from": {
                "id": fromFacebookAppId,
                "name": conversationTitle ?? "Automation Agent"
            },
            "recipient": {
                "id": sendToFBAppId
            },
            "conversation": {
                "id": fromFacebookAppId + "-" + sendToFBAppId
            },
            "channelId": "facebook",
            "serviceUrl": "https://facebook.botframework.com/",
            "text": messageText,
            "type": "message",
            "id": "123456",
            "attachments": [
                {
                    "contentType": contentType,
                    "contentUrl": contentUrl,
                    "name": contentName
                }
            ]
        };
        return stringTemplate;
    }
}


