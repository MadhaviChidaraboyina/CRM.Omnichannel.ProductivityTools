import { TestSettings } from "../../../configuration/test-settings";
import { AppleClient } from "./apple-client";
import { AsyncChannelType } from "../../../types/e2e/async-channels.t";
import { AsyncConnectorClient } from "../../../types/e2e/async-connector-client.t";
import { BotConnectorClient } from "./bot-connector-client";
import { SMSTeleSignClient } from "./sms-telesign-client";
import { SMSTwilioClient } from "./sms-twilio-client";
import { TwitterClient } from "./twitter-client";
import { WeChatClient } from "./we-chat-client";
import { WhatsAppClient } from "./whats-app-client";


export function GetClient(streamSource: AsyncChannelType, targetChannel = "Default"): AsyncConnectorClient {
    switch (streamSource) {
        case AsyncChannelType.AppleMessagesForBusiness:
            const { appleBusinessAccountId, mspId } = TestSettings.GetAppleMessagesForBusinessConfig(targetChannel);
            return new AppleClient(appleBusinessAccountId, mspId);
        case AsyncChannelType.WhatsApp: return new WhatsAppClient(TestSettings.GetWhatsAppE2EConfig(targetChannel).authToken);
        case AsyncChannelType.Teams:
        case AsyncChannelType.Telegram:
        case AsyncChannelType.DirectLine:
        case AsyncChannelType.Kik:
        case AsyncChannelType.Facebook: return new BotConnectorClient(TestSettings.GetBotChannelConfig(streamSource, targetChannel).bcrAppId);
        case AsyncChannelType.Line: return new BotConnectorClient(TestSettings.GetBotChannelConfig(streamSource, targetChannel).bcrAppId);
        case AsyncChannelType.Twitter:
            const { applicationId, consumerSecret } = TestSettings.GetTwitterConfig(targetChannel);
            return new TwitterClient(applicationId, consumerSecret);
        case AsyncChannelType.WeChat:
            const { token, ocConfigId } = TestSettings.GetWeChatConfig(targetChannel);
            return new WeChatClient(token, ocConfigId);
        case AsyncChannelType.SMSTeleSign:
            const { apikey, customerId } = TestSettings.GetSMSTeleSignConfig(targetChannel);
            return new SMSTeleSignClient(apikey, customerId);
        case AsyncChannelType.SMSTwilio:
            const authToken = TestSettings.GetSMSTwilioConfig(targetChannel).authToken;
            return new SMSTwilioClient(authToken);
    }
}

