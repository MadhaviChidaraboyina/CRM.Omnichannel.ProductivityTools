import * as axios from "axios";

import { BCRClient } from "./bcr-client";
import { TestSettings } from "../configuration/test-settings";

const axiosDefault = axios.default;
export const FacebookIncomingUrl = `${TestSettings.ApiGatewayUrl}/botchannel/incoming?orgId=${TestSettings.OrgId}`;

export const SendFacebookMessage = async (fromFacebookAppId: string, sendToFBAppId: string, messageText: string, bcrClientId: string, bcrClientSecret: string, conversationTitle?: string) => {
    const bcrToken = await BCRClient.getInstance().getToken(bcrClientId, bcrClientSecret);
    const requestBody = {
        from: {
            id: fromFacebookAppId,
            name: conversationTitle ?? "Automation Agent"
        },
        recipient: {
            id: sendToFBAppId
        },
        conversation: {
            id: fromFacebookAppId + "-" + sendToFBAppId
        },
        channelId: "facebook",
        serviceUrl: "https://facebook.botframework.com/",
        text: messageText,
        type: "message",
        id: "123456"
    };
    const response = await axiosDefault.post(FacebookIncomingUrl, JSON.stringify(requestBody), {
        headers: {
            "Authorization": `Bearer ${bcrToken}`,
            "Content-Type": "application/json"
        }
    });
    expect(response.status).toEqual(200);
    return response;
};
