import { AppleMessagesForBusinessConfig } from "../models/apple-config.model";
import { stringify } from "querystring";
import { BotChannelConfig } from "../models/bot-connector-channel-config";
import { FacebookConfig } from "..//models/facebook-config.model";
import { TeleSignConfig } from "../models/telesign-message.model";
import { TwilioConfig } from "..//models/twilio-config-model";
import { TwitterConfig } from "../models/twitter-config.model";
import { WeChatConfig } from "../models/we-chat-config.model";
import { WhatsAppConfig } from "../models/whats-app-config.model";
import { AgentType, AsyncChannelType } from "../types/e2e/async-channels.t";
import { OCAgentCredential } from "../types/e2e/oc-agent.t";

export class ConfigHelper {
    public static getChannelConfigPrefix(channel: AsyncChannelType, channelName: string) {
        return channel.concat('_', channelName).toLowerCase();
    }

    public static getChannelAgentConfigPrefix(channel: AsyncChannelType, userIndex: number = 0) {
        return {
            emailPrefix: [channel, `agent${userIndex}`, "email"].join("_").toLowerCase(),
            passwordPrefix: [channel, `agent${userIndex}`, "password"].join("_").toLowerCase(),
            namePrefix: [channel, `agent${userIndex}`, "name"].join("_").toLowerCase(),
        };
    }

    public static readPipelineConfig<T>(configPrefix: string, configGuard: (any) => any is T): T {
        const config = JSON.parse(process.env[configPrefix]);
        if (!configGuard(config)) {
            throw new Error(`Provided config is incorrect. Config prefix: ${configPrefix}`);
        }
        return config;
    }

    public static isAgentConfig(obj: any): obj is OCAgentCredential {
        return obj.email && obj.password;
    }

    public static isBotChannelConfig(obj: any): obj is BotChannelConfig {
        return obj.bcrAppId;
    }

    public static isTwitterConfig(obj: any): obj is TwitterConfig {
        return obj.applicationId && obj.recipientId && obj.consumerSecret;
    }

    public static isWhatsAppConfig(obj: any): obj is WhatsAppConfig {
        return obj.orgNumber && obj.authToken && obj.accountSid;
    }

    public static isAppleMessagesForBusinessConfig(obj: any): obj is AppleMessagesForBusinessConfig {
        return obj.mspId && obj.appleBusinessAccountId;
    }

    public static isFacebookConfig(obj: any): obj is FacebookConfig {
        return obj.facebookPageId && obj.bcrAppId;
    }

    public static isWeChatConfig(obj: any): obj is WeChatConfig {
        return obj.token && obj.ocConfigId && obj.serviceAccountId;
    }

    public static isSMSTeleSignConfig(obj: any): obj is TeleSignConfig {
        return obj.apikey && obj.customerId && obj.telesignSMSNumber;
    }

    public static isSMSTwilioConfig(obj: any): obj is TwilioConfig {
        return obj.accountSid && obj.authToken && obj.twilioSMSNumber;
    }

    public static getChannelAgentIndexConfigPrefix(channel: AsyncChannelType, agentType: AgentType) {
        return {
            configPrefix: [channel, `agentindex`, agentType].join("_").toLowerCase(),
        };
    }
}