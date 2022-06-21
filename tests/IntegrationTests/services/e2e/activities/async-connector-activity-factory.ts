import { AsyncChannelType } from "../../../types/e2e/async-channels.t";
import { AsyncConnectorActivity } from "../../../types/e2e/async-connector-activity.t";
import { AsyncConnectorConstants } from "../../../Utility/Constants";
import { BotConnectorActivity } from "./bot-connector-activity";
import { FacebookActivity } from "./facebook-activity";
import { TeamsActivity } from "./teams-activity";
import { TelegramActivity } from "./telegram-activity";
import { TestSettings } from "../../../configuration/test-settings";
import { TwitterActivity } from "./twitter-activity";
import { WhatsAppActivity } from "./whats-app-activity";
import { WeChatActivity } from "./we-chat-activity";
import { SMSTeleSignActivity } from "./sms-telesign-activity";
import { SMSTwilioActivity } from "./sms-twilio-activity";
import { AppleAppActivity } from "./apple-activity";

export function GetActivityBuilder(streamSource: AsyncChannelType, targetChannel = "Default"): AsyncConnectorActivity {
    switch (streamSource) {
        case AsyncChannelType.AppleMessagesForBusiness:
            const { appleBusinessAccountId } = TestSettings.GetAppleMessagesForBusinessConfig(targetChannel);
            return new AppleAppActivity(appleBusinessAccountId);
        case AsyncChannelType.WhatsApp:
            const { accountSid, orgNumber } = TestSettings.GetWhatsAppE2EConfig(targetChannel);
            return new WhatsAppActivity(accountSid, orgNumber);
        case AsyncChannelType.Teams:
            const { bcrAppId } = TestSettings.GetBotChannelConfig(streamSource, targetChannel);
            return new TeamsActivity(`28:${bcrAppId}`);
        case AsyncChannelType.Telegram:
            return new TelegramActivity(TestSettings.GetBotChannelConfig(streamSource, targetChannel).bcrAppId);
        case AsyncChannelType.DirectLine:
            return new BotConnectorActivity(AsyncConnectorConstants.DirectLineServiceUrl, AsyncConnectorConstants.DirectLineChannelId, TestSettings.GetBotChannelConfig(streamSource, targetChannel).bcrAppId);
        case AsyncChannelType.Kik:
            return new BotConnectorActivity(AsyncConnectorConstants.KikServiceUrl, AsyncConnectorConstants.KikChannelId, TestSettings.GetBotChannelConfig(streamSource, targetChannel).bcrAppId);
        case AsyncChannelType.Line:
            return new BotConnectorActivity(AsyncConnectorConstants.LineServiceUrl, AsyncConnectorConstants.LineChannelId, TestSettings.GetBotChannelConfig(streamSource, targetChannel).bcrAppId);
        case AsyncChannelType.Twitter:
            return new TwitterActivity(TestSettings.GetTwitterConfig(targetChannel).recipientId);
        case AsyncChannelType.Facebook:
            return new FacebookActivity(TestSettings.GetFacebookConfig(targetChannel).facebookPageId);
        case AsyncChannelType.WeChat:
            return new WeChatActivity(TestSettings.GetWeChatConfig(targetChannel).serviceAccountId);
        case AsyncChannelType.SMSTeleSign:
            return new SMSTeleSignActivity(TestSettings.GetSMSTeleSignConfig(targetChannel).telesignSMSNumber);
        case AsyncChannelType.SMSTwilio:
            const acctSid = TestSettings.GetSMSTwilioConfig(targetChannel).accountSid;
            const twilioSMSNumber = TestSettings.GetSMSTwilioConfig(targetChannel).twilioSMSNumber;
            return new SMSTwilioActivity(twilioSMSNumber, acctSid,);
    }
}