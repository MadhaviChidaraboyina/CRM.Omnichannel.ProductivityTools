import * as testData from "./testsettings.json";

import { AgentType, AsyncChannelType, BotChannelType } from "../types/e2e/async-channels.t";

import { AppleMessagesForBusinessConfig } from "../models/apple-config.model";
import { BotChannelConfig } from "../models/bot-connector-channel-config";
import { ConfigHelper } from "./config-helper";
import { FacebookConfig } from "../models/facebook-config.model";
import { OCAgentCredential } from "../types/e2e/oc-agent.t";
import { TeleSignConfig } from "../models/telesign-message.model";
import { TwilioConfig } from "../models/twilio-config-model";
import { TwitterConfig } from "../models/twitter-config.model";
import { WeChatConfig } from "../models/we-chat-config.model";
import { WhatsAppConfig } from "../models/whats-app-config.model";

export class TestSettings {
    public static get Devices(): string[] {
        return process.env.devices
            ? JSON.parse(process.env.devices)
            : testData.devices;
    }

    public static get DefaultPassword(): string {
        return process.env.DefaultPassword || testData.DefaultPassword;
    }

    public static get ADClientId(): string {
        return process.env.ADClientId || testData.ADClientId;
    }

    public static get TenantId(): string {
        return process.env.TenantId || testData.TenantId;
    }

    public static get BotTokenURL(): string {
        return process.env.BotTokenURL || testData.BotTokenURL;
    }

    public static get Browsers(): string[] {
        return process.env.browsers
            ? JSON.parse(process.env.browsers)
            : testData.browsers;
    }

    public static get Browser(): string {
        return process.env.browser ? process.env.browser : testData.browsers[0];
    }

    public static get OrgUrl(): string {
        let orgUrl = process.env.OrgUrl || testData.OrgUrl;
        if (orgUrl.charAt(orgUrl.length - 1) === "/") {
            orgUrl = orgUrl.slice(0, -1);
        }
        return orgUrl;
    }

    public static get PersistentChatUrl(): string {
        return process.env.PesistentChatUrl || testData.PesistentChatUrl;
    }

    public static get PesistentChatNonOperationHoursUrl(): string {
        return process.env.PesistentChatNonOperationHoursUrl || testData.PesistentChatNonOperationHoursUrl;
    }

    public static get AdminAccountEmail(): string {
        return process.env.AdminAccountEmail || testData.AdminAccountEmail;
    }

    public static get AdminAccountEmail1(): string {
        return process.env.AdminAccountEmail1 || testData.AdminAccountEmail1;
    }

    public static get AdminAccountEmail2(): string {
        return process.env.AdminAccountEmail2 || testData.AdminAccountEmail2;
    }

    public static get AdminAccountEmail3(): string {
        return process.env.AdminAccountEmail3 || testData.AdminAccountEmail3;
    }

    public static get AdminAccountEmail4(): string {
        return process.env.AdminAccountEmail4 || testData.AdminAccountEmail4;
    }

    public static get AdminAccountEmail5(): string {
        return process.env.AdminAccountEmail5 || testData.AdminAccountEmail5;
    }

    public static get AdminAccountEmail6(): string {
        return process.env.AdminAccountEmail6 || testData.AdminAccountEmail6;
    }

    public static get AdminAccountPassword(): string {
        return process.env.AdminAccountPassword || testData.AdminAccountPassword;
    }

    public static get AgentAccountEmail(): string {
        return process.env.AgentAccountEmail || testData.AgentAccountEmail;
    }
    public static get AgentAffinityAccountEmail(): string {
        return process.env.AgentAffinityAccountEmail || testData.AgentAffinityAccountEmail;
    }
    public static get AdminAgentAffinityAccountEmail(): string {
        return process.env.AdminAgentAffinityAccountEmail || testData.AdminAgentAffinityAccountEmail;
    }

    public static get SupervisorAccountEmail(): string {
        return (
            process.env.SupervisorAccountEmail || testData.SupervisorAccountEmail
        );
    }

    public static get CustomTelegramAccountEmail(): string {
        return (
            process.env.CustomTelegramAccountEmail || testData.CustomTelegramAccountEmail
        );
    }

    public static get AgentAccountPassword(): string {
        return process.env.DefaultPassword || testData.DefaultPassword;
    }

    public static get LCWSrc(): string {
        return process.env.LCWSrc || testData.LCWSrc;
    }

    public static get SupervisorAccountPassword(): string {
        return (
            (process.env.SupervisorAccountPassword || testData.SupervisorAccountPassword) ||
            (process.env.DefaultPassword || testData.DefaultPassword)
        );
    }

    public static get LaunchBrowserSettings() {
        return testData.launchBrowserSettings;
    }

    public static get PickChatSpanishUrl(): string {
        return process.env.PickChatSpanishUrl || testData.PickChatSpanishUrl;
    }

    public static get LcwPickUrl(): string {
        return process.env.LcwPickUrl || testData.LiveChatLogin.LcwPickUrl;
    }

    public static get LcwCapacityPickUrl(): string {
        return process.env.LcwCapacityPickUrl || testData.LiveChatLogin.LcwCapacityPickUrl;
    }

    public static get LcwCapPickUrl(): string {
        return process.env.LcwCapPickUrl //|| testData.LiveChatLogin.LcwCapPickUrl;
    }

    // This chat queue with agent and supervisor
    public static get LCWUrl(): string {
        return process.env.LcwUrl || testData.LcwUrl;
    }
    public static get AgentAffinityOnUrl(): string {
        return process.env.AgentAffinityOnUrl || testData.AgentAffinityOnUrl;
    }
    public static get AgentAffinityOffUrl(): string {
        return process.env.AgentAffinityOffUrl || testData.AgentAffinityOffUrl;
    }
    public static get AgentAffinityQueueId(): string {
        return process.env.AgentAffinityQueueId || testData.AgentAffinityQueueId;
    }
    //Holiday chat widget
    public static get HolidayLcwUrl(): string {
        return process.env.HolidayLcwUrl || testData.HolidayLcwUrl;
    }

    //Offline chat widget
    public static get OfflineOHUrl(): string {
        return process.env.OfflineOHUrl || testData.OfflineOHUrl;
    }


    //Offline Spanish OOH chat widget
    public static get OfflineSpanishOHUrl(): string {
        return process.env.OfflineOHSpanishUrl || testData.OfflineOHSpanishUrl;
    }

    //Skills chat widget
    public static get SkillsLcwUrl(): string {
        return process.env.SkillsLcwUrl || testData.SkillsLcwUrl;
    }

    //Live chat pick english chat widget
    public static get LcwPickEnglishUrl(): string {
        return process.env.LcwPickEnglishUrl || testData.LcwPickEnglishUrl;
    }

    //Live chat pick spanish chat widget
    public static get LcwPickSpanishUrl(): string {
        return process.env.LcwPickSpanishUrl || testData.LcwPickSpanishUrl;
    }

    public static get LiveChatNoRuleUrl(): string {
        return process.env.LiveChatNoRuleUrl || testData.LiveChatNoRuleUrl;
    }

    public static get ReconnectExhaustedLcwUrl(): string {
        return process.env.ReconnectExhaustedLcwUrl || testData.ReconnectExhaustedLcwUrl;
    }

    // This chat queue with SBRExactMatch widget
    public static get SBRExactMatchLcwUrl(): string {
        return process.env.SBRExactMatchLcwUrl || testData.SBRExactMatchLcwUrl;
    }

    public static get LiveChatAgentEmail(): string {
        return process.env.LiveChatAgentEmail || testData.LiveChat.AgentEmail;
    }

    public static get LiveChatAgentPassword(): string {
        return process.env.DefaultPassword || testData.DefaultPassword;
    }

    public static get LiveChatQueueName(): string {
        return process.env.LiveChatQueueName || testData.LiveChat.QueueName;
    }

    public static get LiveChatWorkStreamName(): string {
        return process.env.LiveChatWorkStreamName || testData.LiveChat.WorkStreamName;
    }

    public static get LiveChatChannelName(): string {
        return process.env.LiveChatChannelName || testData.LiveChat.ChannelName;
    }

    public static get LivePopoutChatUrl(): string {
        return process.env.LivePopoutChatUrl || testData.LiveChatLogin.LivePopoutChatUrl;
    }

    public static get LivePopoutChatPreChatSurveyUrl(): string {
        return process.env.LivePopoutChatPreChatSurveyUrl || testData.LiveChatLogin.LivePopoutChatPreChatSurveyUrl;
    }

    public static get Viewport() {
        return { width: 1900, height: 900 };
    }

    public static get QueueName() {
        return process.env.QueueName || testData.QueueName;
    }

    public static get LineChannelID(): string {
        return process.env.LineChannelID || testData.Line.ChannelID;
    }

    public static get LineChannelSecret(): string {
        return process.env.LineChannelSecret || testData.Line.ChannelSecret;
    }

    public static get LineChannelAccessToken(): string {
        return (
            process.env.LineChannelAccessToken || testData.Line.ChannelAccessToken
        );
    }

    public static get LineBCRClientID(): string {
        return process.env.LineBCRClientID || testData.Line.LineBCRClientID;
    }

    public static get LineBCRClientSecret(): string {
        return process.env.LineBCRClientSecret || testData.Line.LineBCRClientSecret;
    }

    public static get AccountSID() {
        return process.env.AccountSID || testData.SMSsettings.AccountSID;
    }

    public static get SentimentAnalysisConfigTitle() {
        return process.env.SentimentAnalysisConfigTitle || testData.SentimentAnalysisConfigTitle;
    }

    public static get CosmosDBEndpoint() {
        return process.env.CosmosDBEndpoint || testData.CosmosDB.Endpoint;
    }

    public static get ServiceBusEndpoint() {
        return process.env.ServiceBusEndpoint || testData.ServiceBus.Endpoint;
    }

    public static get AuthToken() {
        return process.env.AuthToken || testData.SMSsettings.AuthToken;
    }

    public static get SMSNumber() {
        return process.env.SMSNumber || testData.SMSsettings.SMSNumber;
    }

    public static get SMSNumberTwilio() {
        return process.env.SMSNumber || testData.SMSTwilio.SMSNumberTwilio;
    }

    public static get AccountSIDTwilio() {
        return process.env.AccountSID || testData.SMSTwilio.AccountSIDTwilio;
    }

    public static get AuthTokenTwilio() {
        return process.env.AuthTokenTwilio || testData.SMSTwilio.AuthTokenTwilio;
    }

    public static get SMSTwilio() {
        return {
            AccountSID: process.env.AccountSID || testData.SMSTwilio.AccountSIDTwilio,
            AgentEmail: process.env.AgentEmailTwilio || testData.SMSTwilio.AgentEmail,
            AgentPassword: process.env.DefaultPassword || testData.DefaultPassword,
            AuthTokenTwilio: process.env.AuthTokenTwilio || testData.SMSTwilio.AuthTokenTwilio,
            SMSNumber: process.env.TwilioSMSNumber || testData.SMSTwilio.SMSNumberTwilio,
            QueueName: process.env.TwilioQueueName || testData.SMSTwilio.QueueName,
            WorkStreamName: process.env.TwilioWorkStreamName || testData.SMSTwilio.WorkStreamName
        };
    }

    public static get WhatsApp() {
        return {
            NumberName: process.env.WhatsAppTwilioNewNumberName || testData.WhatsAppTwilio.NewNumberName,
            AccountSIDTwilio: process.env.AccountSIDTwilio || testData.WhatsAppTwilio.AccountSIDTwilio,
            AuthTokenTwilio: process.env.AuthTokenTwilio || testData.WhatsAppTwilio.AuthTokenTwilio,
            SMSNumber: process.env.WhatsAppTwilioInboundPhone || testData.WhatsAppTwilio.TwilioInboundPhone,
            AgentAccountEmail: process.env.WhatsAppTwilioAgentAccountEmail || testData.WhatsAppTwilio.AgentAccountEmail,
            DevAgentAccountEmail: process.env.WhatsAppTwilioDevAgentAccountEmail || testData.WhatsAppTwilio.DevAgentAccountEmail,
            AgentAccountPassword: process.env.WhatsAppTwilioAgentAccountPassword || testData.WhatsAppTwilio.AgentAccountPassword,
            DevAgentAccountPassword: process.env.DefaultPassword || testData.DefaultPassword,
            PushWorkStreamName: process.env.WhatsAppTwilioPushWorkStreamName || testData.WhatsAppTwilio.PushWorkStreamName,
            QueueName: process.env.WhatsAppTwilioQueueName || testData.WhatsAppTwilio.QueueName,
            WhatsAppTwilioName: process.env.WhatsAppTwilioName || testData.WhatsAppTwilio.Name
        };
    }

    public static get LineAgentAccountPassword(): string {
        return process.env.DefaultPassword || testData.DefaultPassword;
    }

    public static get LineAgentAccountEmail(): string {
        return process.env.LineAgentAccountEmail || testData.Line.AgentAccountEmail;
    }

    public static get LineQueueName(): string {
        return process.env.LineQueueName || testData.Line.QueueName;
    }

    public static get LinePushWorkStreamName(): string {
        return (
            process.env.LinePushWorkStreamName || testData.Line.PushWorkStreamName
        );
    }

    public static get LineName(): string {
        return process.env.LineName || testData.Line.Name;
    }

    public static get LineConfigName(): string {
        return process.env.LineConfigName || testData.Line.ConfigName;
    }

    public static get LineConfigValue(): string {
        return process.env.LineConfigValue;
    }

    public static set LineConfigValue(value: string) {
        process.env.LineConfigValue = value;
    }

    public static get TeamsUrl() {
        return process.env.TeamsUrl || testData.MicrosoftTeams.MicrosoftTeamsUrl;
    }

    public static get TeamsWorkStreamName() {
        return process.env.TeamsWorkStreamName || testData.MicrosoftTeams.TeamsWorkStreamName;
    }

    public static get TeamsQueueName() {
        return process.env.TeamsQueueName || testData.MicrosoftTeams.TeamsQueueName;
    }

    public static get TeamsSkillName() {
        return process.env.TeamsSkillName || testData.MicrosoftTeams.TeamsSkillName;
    }

    public static get TeamsBotWorkStreamName() {
        return process.env.TeamsBotWorkStreamName || testData.MicrosoftTeams.TeamsBotWorkStreamName;
    }

    public static get AppStudio() {
        return process.env.App || testData.MicrosoftTeams.MicrosoftAppStudio;
    }

    public static get TwitterChannelAPIKey(): string {
        return (
            process.env.TwitterChannelAPIKey || testData.Twitter.TwitterChannelAPIKey
        );
    }

    public static get TwitterChannelAPISecret(): string {
        return (
            process.env.TwitterChannelAPISecret ||
            testData.Twitter.TwitterChannelAPISecret
        );
    }

    public static get TwitterLoginEmail(): string {
        return process.env.twitterLoginEmail || testData.Twitter.twitterLoginEmail;
    }

    public static get TwitterUserName(): string {
        return process.env.twitterUserName || testData.Twitter.twitterUserName;
    }

    public static get TwitterPassword(): string {
        return process.env.twitterPassword || testData.Twitter.twitterPassword;
    }

    public static get TwitterEnvironmentName(): string {
        return (
            process.env.TwitterEnvironmentName ||
            testData.Twitter.TwitterEnvironmentName
        );
    }

    public static get AppleBusinessAccountId(): string {
        return (
            process.env.AppleBusinessAccountId ||
            testData.AppleMessagesForBusiness.AppleBusinessAccountId
        );
    }

    public static get OrgId(): string {
        return process.env.OrgId || testData.OrgId;
    }

    public static get ApiGatewayUrl(): string {
        let apiGatewayUrl = process.env.ApiGatewayUrl || testData.ApiGatewayUrl;
        if (apiGatewayUrl.charAt(apiGatewayUrl.length - 1) === "/") {
            apiGatewayUrl = apiGatewayUrl.slice(0, -1);
        }
        return apiGatewayUrl;
    }

    public static get TelesignMultipleSessions() {
        return {
            LCWName: process.env.SentimentMultipleSessionsLCWName || testData.LCW.SentimentMultipleSessions.LCWName,
            QueueName: process.env.SentimentMultipleSessionsQueueName || testData.LCW.SentimentMultipleSessions.QueueName,
            WorkStreamName: process.env.SentimentMultipleSessionsWorkStreamName || testData.LCW.SentimentMultipleSessions.WorkStreamName
        };
    }

    public static get SMSTelesign() {
        return {
            AgentEmail: process.env.TelesignAgentEmail || testData.SMSTelesign.AgentEmail,
            AgentPassword: process.env.DefaultPassword || testData.DefaultPassword,
            TelesignSMSNumber: process.env.TelesignSMSNumber || testData.SMSTelesign.TelesignSMSNumber,
            TelesignApikey: process.env.TelesignApikey || testData.SMSTelesign.TelesignApikey,
            TelesignCustomerId: process.env.TelesignCustomerId || testData.SMSTelesign.TelesignCustomerId,
            QueueName: process.env.TelesignQueueName || testData.SMSTelesign.QueueName,
            WorkStreamName: process.env.TelesignWorkStreamName || testData.SMSTelesign.WorkStreamName
        };
    }

    public static get CustomMicrosoftAppID(): string {
        return (
            process.env.CustomMicrosoftAppID || testData.Custom.CustomMicrosoftAppID
        );
    }

    public static get CustomMicrosoftDevAppID(): string {
        return (
            process.env.CustomMicrosoftDevAppID || testData.Custom.CustomMicrosoftDevAppID
        );
    }

    public static get CustomClientSecret(): string {
        return (
            process.env.CustomClientSecret || testData.Custom.CustomClientSecret
        );
    }

    public static get CustomClientDevSecret(): string {
        return (
            process.env.CustomClientDevSecret || testData.Custom.CustomClientDevSecret
        );
    }

    public static get CustomChannelName(): string {
        return (
            process.env.CustomChannelName || testData.Custom.ChannelName
        );
    }

    public static get CustomWorkStreamName(): string {
        return (
            process.env.CustomWorkStreamName || testData.Custom.WorkStreamName
        );
    }

    public static get CustomQueueName(): string {
        return (
            process.env.CustomQueueName || testData.Custom.QueueName
        );
    }

    public static get CustomAgentName(): string {
        return (
            process.env.CustomAgentEmail || testData.Custom.AgentEmail
        );
    }

    public static get CustomAgentEmail(): string {
        return (
            process.env.CustomAgentEmail || testData.Custom.CustomAgentEmail
        );
    }

    public static get CustomAgentPassword(): string {
        return (
            process.env.DefaultPassword || testData.DefaultPassword
        );
    }

    public static get FacebookUrl() {
        return process.env.FacebookUrl || testData.Facebook.FacebookUrl;
    }

    public static get FacebookUserName() {
        return process.env.FacebookUserName || testData.Facebook.FacebookUserName;
    }

    public static get FacebookPassword() {
        return process.env.FacebookPassword || testData.Facebook.FacebookPassword;
    }

    public static get FacebookPageName() {
        return process.env.FacebookPageName || testData.Facebook.FacebookPageName;
    }

    public static get FacebookDevPageName() {
        return process.env.FacebookDevPageName || testData.Facebook.DevPageName;
    }

    public static get FacebookDevAppId() {
        return process.env.FacebookDevAppId || testData.Facebook.DevAppId;
    }

    public static get FacebookSecret() {
        return process.env.FacebookSecret || testData.Facebook.Secret;
    }

    public static get FacebookPageToken() {
        return process.env.FacebookPageToken || testData.Facebook.PageToken;
    }

    public static get FacebookName() {
        return process.env.FacebookName || testData.Facebook.Name;
    }

    public static get FacebookPageId() {
        return process.env.FacebookPageId || testData.Facebook.PageId;
    }

    public static get FacebookDevPageId() {
        return process.env.FacebookDevPageId || testData.Facebook.DevPageId;
    }

    public static get FacebookWS() {
        return process.env.FacebookWS || testData.Facebook.FacebookWS;
    }

    public static get FacebookQueue() {
        return process.env.FacebookQueue || testData.Facebook.FacebookQueue;
    }

    public static get FacebookBCRClientId() {
        return process.env.FacebookBCRClientId || testData.Facebook.FacebookBCRClientID;
    }

    public static get FacebookDevBCRClientId() {
        return process.env.FacebookDevBCRClientId || testData.Facebook.FacebookDevBCRClientId;
    }

    public static get FacebookBCRClientSecret() {
        return process.env.FacebookBCRClientSecret || testData.Facebook.FacebookBCRClientSecret;
    }

    public static get FacebookDevBCRClientSecret() {
        return process.env.FacebookDevBCRClientSecret || testData.Facebook.FacebookDevBCRClientSecret;
    }

    public static get FacebookAgentEmail() {
        return process.env.FacebookAgentEmail || testData.Facebook.FacebookAgentEmail;
    }

    public static get FacebookDevAgentEmail() {
        return process.env.FacebookDevAgentEmail || testData.Facebook.FacebookDevAgentEmail;
    }

    public static get FacebookAgentPassword() {
        return process.env.FacebookAgentPassword || testData.Facebook.FacebookAgentPassword;
    }

    public static get FacebookDevAgentPassword() {
        return process.env.DefaultPassword || testData.DefaultPassword;
    }

    public static get TwitterUrl(): string {
        return process.env.TwitterUrl || testData.Twitter.TwitterUrl;
    }

    public static get TwitterHandleName(): string {
        return process.env.TwitterHandleName || testData.Twitter.TwitterHandleName;
    }

    public static get TransferAgentAccountEmail() {
        return process.env.TransferAgentAccountEmail || testData.Twitter.TransferAgentAccountEmail;
    }

    public static get TransferAgentAccountPassword() {
        return process.env.TransferAgentAccountPassword || testData.Twitter.TransferAgentAccountPassword;
    }

    public static get TransferQueueName() {
        return process.env.TransferQueueName || testData.Twitter.TransferQueueName;
    }

    public static get OriginalID(): string {
        return process.env.OriginalID || testData.WeChat.OriginalID;
    }

    public static get WeChatConfigId(): string {
        return "bbf8c8ff-6529-4c5f-82be-b3ac356faf70";
    }

    public static get WeChatName(): string {
        return process.env.WeChatName || testData.WeChat.WeChatName;
    }

    public static get DeveloperID(): string {
        return process.env.DeveloperID || testData.WeChat.DeveloperID;
    }

    public static get WeChatSecret(): string {
        return (
            process.env.WeChatSecret || testData.WeChat.WeChatSecret
        );
    }

    public static get DefaultWeChatSecret(): string {
        return testData.WeChat.DefaultSecret;
    }

    public static get DefaultWeChatToken(): string {
        return testData.WeChat.DefaultToken;
    }

    public static get WeChatToken(): string {
        return (
            process.env.WeChatToken || testData.WeChat.WeChatToken
        );
    }

    public static get WeChatAgentName(): string {
        return (
            process.env.WeChatAgentName || testData.WeChat.AgentEmail
        );
    }

    public static get WeChatAgentEmail(): string {
        return (
            process.env.WeChatAgentEmail || testData.WeChat.AgentEmail
        );
    }

    public static get WeChatAgentPassword(): string {
        return (
            process.env.DefaultPassword || testData.DefaultPassword
        );
    }

    public static get WeChatQueueName(): string {
        return (
            process.env.WeChatQueueName || testData.WeChat.QueueName
        );
    }

    public static get WeChatPushWorkStreamName(): string {
        return (
            process.env.WeChatPushWorkStreamName || testData.WeChat.PushWorkStreamName
        );
    }

    public static get MessageEncryptionkey(): string {
        return (
            process.env.MessageEncryptionkey || testData.WeChat.MessageEncryptionkey
        );
    }

    public static get TelephonyAgentEmail(): string {
        return process.env.TelephonyAgentEmail || testData.Telephony.TelephonyAgentEmail;
    }

    public static get LiveChatAgentName(): string {
        return (
            process.env.LiveChatAgentName || testData.LiveChat.AgentEmail
        );
    }

    public static get LiveChatRuChannelName(): string {
        return (
            process.env.LiveChatRuChannelName || testData.LiveChat.RuChannelName
        );
    }

    public static get LiveChatSupervisorEmail(): string {
        return (
            process.env.LiveChatSupervisorEmail || testData.LiveChat.SupervisorEmail
        );
    }

    public static get LiveChatSupervisorPassword(): string {
        return process.env.DefaultPassword || testData.DefaultPassword;
    }

    public static get LiveChatAccountEmail(): string {
        return (
            process.env.LiveChatAccountEmail || testData.LiveChatLogin.LiveChatAccountEmail
        );
    }

    public static get LiveAccountAgentEmail(): string {
        return (
            process.env.LiveAccountAgentEmail || testData.LiveChatLogin.LiveAccountAgentEmail
        );
    }

    public static get LiveChatAccountPassword(): string {
        return (
            process.env.LiveChatAccountPassword || testData.LiveChatLogin.LiveChatAccountPassword
        );
    }

    public static get LiveChatConsultOrTransferAgentEmail(): string {
        return (
            process.env.LiveChatConsultOrTransferAgentEmail || testData.LiveChatLogin.LiveChatConsultOrTransferAgentEmail
        );
    }

    public static get LiveChatConsultOrTransferAgentPassword(): string {
        return (
            process.env.LiveChatConsultOrTransferAgentPassword || testData.LiveChatLogin.LiveChatConsultOrTransferAgentPassword
        );
    }

    public static get LiveChatSentimentAlertingWS(): string {
        return (
            process.env.LiveChatSentimentAlertingWS || testData.LiveChat.SentimentAlertingWS
        );
    }

    public static get LiveChatSentimentAlertingQueue(): string {
        return (
            process.env.LiveChatSentimentAlertingQueue || testData.LiveChat.SentimentAlertingQueue
        );
    }

    public static get LiveChatSentimentAlertingChatName(): string {
        return (
            process.env.LiveChatSentimentAlertingChatName || testData.LiveChat.SentimentAlertingChatName
        );
    }

    public static get LiveChatSentimentAlertingAgentEmail(): string {
        return (
            process.env.LiveChatSentimentAlertingAgentEmail || testData.LiveChat.SentimentAlertingAgentEmail
        );
    }

    public static get LiveChatSentimentAlertingSupervisorEmail(): string {
        return (
            process.env.LiveChatSentimentAlertingSupervisorEmail || testData.LiveChat.SentimentAlertingSupervisorEmail
        );
    }

    public static get LiveChatSentimentAlertingTelesignWS(): string {
        return (
            process.env.LiveChatSentimentAlertingTelesignWS || testData.LiveChat.SentimentAlertingTelesignWS
        );
    }

    public static get LiveChatSentimentAlertingTelesignNumber(): string {
        return (
            process.env.LiveChatSentimentAlertingTelesignNumber || testData.LiveChat.SentimentAlertingTelesignNumber
        );
    }

    public static get LiveChatSentimentAlertingTwilioWS(): string {
        return (
            process.env.LiveChatSentimentAlertingTwilioWS || testData.LiveChat.SentimentAlertingTwilioWS
        );
    }

    public static get LiveChatSentimentAlertingTwilioNumber(): string {
        return (
            process.env.LiveChatSentimentAlertingTwilioNumber || testData.LiveChat.SentimentAlertingTwilioNumber
        );
    }

    public static get WhatsAppAccountSIDTwilio(): string {
        return process.env.WhatsAppAccountSIDTwilio || testData.WhatsAppTwilio.AccountSIDTwilio;
    }

    public static get WhatsAppAuthTokenTwilio(): string {
        return process.env.WhatsAppAuthTokenTwilio || testData.WhatsAppTwilio.AuthTokenTwilio;
    }

    public static get WhatsAppTwilioInboundPhone(): string {
        return process.env.WhatsAppTvilioInboundPhone || testData.WhatsAppTwilio.TwilioInboundPhone;
    }

    public static get LiveChatTransferQueueName() {
        return process.env.LiveChatTransferQueueName || testData.LiveChatLogin.LiveChatTransferQueueName;
    }

    public static get QPTestWSChat(): string {
        return (
            process.env.QPTestWSChat || testData.QPTestWSChat
        );
    }

    public static get LiveChatQPThirdWSChatName(): string {
        return (
            process.env.LiveChatQPThirdWSChatName || testData.LiveChat.QPThirdWSChatName
        );
    }

    public static get LiveChatPickMode() {
        return {
            LiveChatPickModeNameEnglish: process.env.LiveChatPickModeNameEnglish || testData.LiveChatPickMode.EnglishChatName,
            LiveChatPickModeNameSpanish: process.env.LiveChatPickModeNameSpanish || testData.LiveChatPickMode.SpanishChatName,
            LiveChatPickModeAgentEmail: process.env.LiveChatPickModeAgentEmail || testData.LiveChatPickMode.AgentEmail,
            LiveChatPickModeAgentPassword: process.env.DefaultPassword || testData.DefaultPassword,
            LiveChatPickModeQueueName: process.env.LivechatPickModeQueueName || testData.LiveChatPickMode.QueueName,
            LiveChatPickModeWorkStreamName: process.env.LiveChatPickModeWorkStreamName || testData.LiveChatPickMode.WorkStreamName
        };
    }

    public static get LiveChatQPFirstWSName(): string {
        return (
            process.env.LiveChatQPFirstWSName || testData.LiveChat.QPFirstWSName
        );
    }

    public static get LiveChatQPSecondWSName(): string {
        return (
            process.env.LiveChatQPSecondWSName || testData.LiveChat.QPSecondWSName
        );
    }

    public static get LiveChatQPThirdWSName(): string {
        return (
            process.env.LiveChatQPThirdWSName || testData.LiveChat.QPThirdWSName
        );
    }

    public static get LiveChatQPFirstQueueName(): string {
        return (
            process.env.LiveChatQPFirstQueueName || testData.LiveChat.QPFirstQueueName
        );
    }

    public static get LiveChatQPSecondQueueName(): string {
        return (
            process.env.LiveChatQPSecondQueueName || testData.LiveChat.QPSecondQueueName
        );
    }

    public static get LiveChatQPFirstWSChatName(): string {
        return (
            process.env.LiveChatQPFirstWSChatName || testData.LiveChat.QPFirstWSChatName
        );
    }

    public static get LiveChatQPFirstWSSecondChatName(): string {
        return (
            process.env.LiveChatQPFirstWSSecondChatName || testData.LiveChat.QPFirstWSSecondChatName
        );
    }

    public static get LiveChatQPSecondWSChatName(): string {
        return (
            process.env.LiveChatQPSecondWSChatName || testData.LiveChat.QPSecondWSChatName
        );
    }

    public static get LiveChatZeroCapacityAgentEmail(): string {
        return (
            process.env.LiveChatZeroCapacityAgentEmail || testData.LiveChat.ZeroCapacityAgentEmail
        );
    }

    public static get LiveChatZeroCapacityAgentName(): string {
        return (
            process.env.LiveChatZeroCapacityAgentName || testData.LiveChat.ZeroCapacityAgentEmail
        );
    }

    public static get SDKPreChatQuestion() {
        return {
            Name: process.env.SDKPreChatQuestionName || testData.LiveChat.SDKPreChatQuestion.Name,
            Text: process.env.SDKPreChatQuestionText || testData.LiveChat.SDKPreChatQuestion.Text
        };
    }

    public static get LiveChatSDKChatName(): string {
        return (
            process.env.LiveChatSDKChatName || testData.LiveChat.SDKChatName
        );
    }

    public static get LiveChatSDKQueue(): string {
        return (
            process.env.LiveChatSDKQueue || testData.LiveChat.SDKQueue
        );
    }

    public static get LiveChatSDKWorkstream(): string {
        return (
            process.env.LiveChatSDKWorkstream || testData.LiveChat.SDKWorkstream
        );
    }

    public static get DataMaskingSettings() {
        return {
            UserEmailForDataMaskingTests: process.env.UserEmailForDataMaskingTests || testData.DataMaskingSettings.UserEmail,
            UserPasswordForDataMaskingTests: process.env.DefaultPassword || testData.DefaultPassword
        };
    }

    public static get LiveChatZeroCapacityAgentPassword(): string {
        return (
            process.env.DefaultPassword || testData.DefaultPassword
        );
    }

    public static get AgentNameToAssignChat(): string {
        return process.env.AgentNameToAssignChat || testData.Twitter.AgentNameToAssignChat;
    }

    public static get TwitterAgentEmail(): string {
        return process.env.TwitterAgentEmail || testData.Twitter.TwitterAgentEmail;
    }

    public static get TwitterAgentPassword(): string {
        return process.env.TwitterAgentPassword || testData.Twitter.TwitterAgentPassword;
    }

    public static get TwitterAgentSupervisorEmail(): string {
        return process.env.TwitterAgentSupervisorEmail || testData.Twitter.TwitterAgentSupervisorEmail;
    }

    public static get TwitterAgentSupervisorPassword(): string {
        return process.env.TwitterAgentSupervisorPassword || testData.Twitter.TwitterAgentSupervisorPassword;
    }

    public static get TeamsAgentEmail(): string {
        return process.env.TeamsAgentEmail || testData.MicrosoftTeams.TeamsAgentEmail;
    }

    public static get TeamsAgentPassword(): string {
        return process.env.TeamsAgentPassword || testData.MicrosoftTeams.TeamsAgentPassword;
    }

    public static get TeamsSupervisorEmail(): string {
        return process.env.TeamsSupervisorEmail || testData.MicrosoftTeams.TeamsSupervisorEmail;
    }

    public static get TeamsSupervisorPassword(): string {
        return process.env.TeamsSupervisorPassword || testData.MicrosoftTeams.TeamsSupervisorPassword;
    }

    public static get QueueNameToAssignChat(): string {
        return process.env.QueueNameToAssignChat || testData.QueueNameToAssignChat;
    }

    public static get PreChatSurveyUrl(): string {
        return process.env.PreChatSurveyUrl || testData.PreChatSurveyUrl;
    }
    public static get FacebookSessionName() {
        return process.env.FacebookSessionName || testData.Facebook.FacebookSessionName;
    }

    public static get ExpressionBuilderFirstAgentScriptName() {
        return process.env.ExpressionBuilderFirstAgentScriptName || testData.Facebook.ExpressionBuilderFirstAgentScriptName;
    }

    public static get ExpressionBuilderSecondAgentScriptName() {
        return process.env.ExpressionBuilderSecondAgentScriptName || testData.Facebook.ExpressionBuilderSecondAgentScriptName;
    }

    public static get FacebookAccountName() {
        return process.env.FacebookAccountName || testData.Facebook.FacebookAccountName;
    }

    public static get PVAFacebookPageName() {
        return process.env.PVAFacebookPageName || testData.Facebook.PVAFacebookPageName;
    }

    public static get PVAFacebookPageId() {
        return process.env.PVAFacebookPageId || testData.Facebook.PVAFacebookPageId;
    }

    public static get PVAFacebookUserName() {
        return process.env.PVAFacebookUserName || testData.Facebook.PVAFacebookUserName;
    }

    public static get PVAFacebookPassword() {
        return process.env.PVAFacebookPassword || testData.Facebook.PVAFacebookPassword;
    }

    public static get DirectLineBlob() {
        return process.env.DirectLineBlob || testData.Custom.DirectLineBlob;
    }

    public static get MSTeams() {
        return {
            MSTeamsChatName: process.env.MSTeamsChatName || testData.MicrosoftTeams.TeamsChatName,
            MSTeamsAgentEmail: process.env.MSTeamsAgentEmail || testData.MicrosoftTeams.TeamsAgentEmail,
            MSTeamsAgentPassword: process.env.DefaultPassword || testData.DefaultPassword,
            MSTeamsQueueName: process.env.MSTeamsQueueName || testData.MicrosoftTeams.TeamsQueueName,
            MSTeamsWorkStreamName: process.env.MSTeamsWorkStreamName || testData.MicrosoftTeams.TeamsWorkStreamName,
            MSTeamsBCRClientId: process.env.MSTeamsBCRClientId || testData.MicrosoftTeams.TeamsBCRClientId,
            MSTeamsBCRClientSecret: process.env.MSTeamsBCRClientSecret || testData.MicrosoftTeams.TeamsBCRClientSecret
        };
    }

    public static get PersistentChat() {
        return {
            PersistentChatChannelName: process.env.PersistentChatChannelName || testData.LiveChatPersistentMode.ChatName,
            PersistentChatAgentEmail: process.env.PersistentChatAgentEmail || testData.LiveChatPersistentMode.AgentEmail,
            PersistentChatAgentPassword: process.env.DefaultPassword || testData.DefaultPassword,
            PersistentChatClientPassword: process.env.DefaultPassword || testData.DefaultPassword,
            PersistentChatQueueName: process.env.PersistentChatQueueName || testData.LiveChatPersistentMode.QueueName,
            PersistentChatWorkStreamName: process.env.PersistentChatWorkStreamName || testData.LiveChatPersistentMode.WorkStreamName
        };
    }

    public static get AuthenticationSettingsName(): string {
        return process.env.AuthenticationSettingsName || testData.LiveChatPersistentMode.AuthSettingsName;
    }

    public static get PublicKeyURL(): string {
        return process.env.PublicKeyURL || testData.LiveChatPersistentMode.PublicKeyURL;
    }

    public static get JavaScriptClientFunction(): string {
        return process.env.JavaScriptClientFunction || testData.LiveChatPersistentMode.JavaScriptClientFunction;
    }

    public static get AzureFunctionEndpoint(): string {
        return process.env.AzureFunctionEndpoint || testData.LiveChatPersistentMode.AzureFunctionEndpoint;
    }

    public static get QueuePositionTransfer() {
        return {
            LCWName: process.env.QueuePositionTransferLCWName || testData.LCW.QueuePositionTransfer.LCWName,
            LCWAppId: process.env.QueuePositionTransferLCWAppId || testData.LCW.QueuePositionTransfer.LCWAppId,
            Queue1: {
                QueueName: process.env.QueuePositionTransferQueue1Name || testData.LCW.QueuePositionTransfer.Queue1.QueueName,
                AgentEmail: process.env.QueuePositionTransferQueue1AgentEmail || testData.LCW.QueuePositionTransfer.Queue1.AgentEmails[0],
                AgentName: process.env.QueuePositionTransferQueue1AgentEmail || testData.LCW.QueuePositionTransfer.Queue1.AgentEmails[0],
                AgentPassword: process.env.DefaultPassword || testData.DefaultPassword,
                AgentEmail2: process.env.QueuePositionTransferQueue1AgentEmail2 || testData.LCW.QueuePositionTransfer.Queue1.AgentEmails[1],
                AgentPassword2: process.env.DefaultPassword || testData.DefaultPassword,
                AgentName1: process.env.QueuePositionTransferQueue1AgentName1 || testData.LCW.QueuePositionTransfer.Queue1.AgentName1,
                AgentName2: process.env.QueuePositionTransferQueue1AgentName2 || testData.LCW.QueuePositionTransfer.Queue1.AgentName2
            },
            Queue2: {
                QueueName: process.env.QueuePositionTransferQueue2Name || testData.LCW.QueuePositionTransfer.Queue2.QueueName,
                AgentEmail: process.env.QueuePositionTransferQueue2AgentEmail || testData.LCW.QueuePositionTransfer.Queue2.AgentEmail,
                AgentName: process.env.QueuePositionTransferQueue2AgentEmail || testData.LCW.QueuePositionTransfer.Queue2.AgentEmail,
                AgentPassword: process.env.DefaultPassword || testData.DefaultPassword
            },
            Workstream: {
                Name: process.env.QueuePositionTransferWorkstreamName || testData.LCW.QueuePositionTransfer.Workstream.Name
            }
        };
    }

    public static get AutomatedMessages() {
        return {
            LCWName: process.env.AutomatedMessageLCWName || testData.LCW.AutomatedMessages.LCWName,
            QueueName: process.env.AutomatedMessageQueueName || testData.LCW.AutomatedMessages.QueueName,
            WorkstreamName: process.env.AutomatedMessageWorkstreamName || testData.LCW.AutomatedMessages.WorkstreamName,
            AutomatedMessageName: process.env.AutomatedMessageName || testData.LCW.AutomatedMessages.AutomatedMessageName,
            AutomatedMessageText: process.env.AutomatedMessageText || testData.LCW.AutomatedMessages.AutomatedMessageText,
            AutomatedMessagesBlobURL: process.env.AutomatedMessagesBlobURL || testData.LCW.AutomatedMessages.AutomatedMessagesBlobURL,
        };
    }

    public static get BYOBUserName() {
        return process.env.BYOBUserName || testData.LiveChatLogin.BYOBUserName;
    }

    public static get PVAUserName() {
        return process.env.PVAUserName || testData.LiveChatLogin.PVAUserName;
    }

    public static get FacebookWorkStreamName() {
        return process.env.FacebookWorkStreamName || testData.Facebook.FacebookWorkStreamName;
    }

    public static get FacebookAgentName() {
        return process.env.FacebookAgentName || testData.Facebook.FacebookAgentName;
    }

    public static get DBEndPoint() {
        return process.env.DBEndPoint || testData.DBEndPoint;
    }

    public static get DBKey() {
        return process.env.DBKey || testData.DBKey;
    }

    public static get FacebookOldBCRClientId() {
        return process.env.FacebookOldBCRClientId || testData.Facebook.FacebookOldBCRClientId;
    }

    public static get TwitterAttachmentsSource() {
        return process.env.TwitterAttachmentsSourceURL || testData.TwitterAttachmentsSourceURL;
    }

    public static get BlobURL() {
        return process.env.BlobURL || testData.BlobURL;
    }

    public static get KeyVaultURL() {
        return process.env.KeyVaultURL || testData.KeyVaultURL;
    }

    public static get ApplicationClientId() {
        return process.env.ApplicationClientId || testData.ApplicationClientId;
    }

    public static get ApplicationClientSecret() {
        return process.env.ApplicationClientSecret || testData.ApplicationClientSecret;
    }

    public static get AzureADTenantId() {
        return process.env.AzureADTenantId || testData.AzureADTenantId;
    }

    // Use different config names for every channel provisioned on the org and used in automation.
    // We cannot modify and use a single channel within one test and need different channels to be created for each config scenarious.
    // These channels are created by AdminSimulator.
    public static GetAppleMessagesForBusinessConfig(configName: string): AppleMessagesForBusinessConfig {
        const configPrefix = ConfigHelper.getChannelConfigPrefix(AsyncChannelType.AppleMessagesForBusiness, configName);
        if (process.env[configPrefix]) {
            return ConfigHelper.readPipelineConfig(configPrefix, ConfigHelper.isAppleMessagesForBusinessConfig);
        }
        else {
            return testData.AsyncChannelsE2EConfigs[AsyncChannelType.AppleMessagesForBusiness].Channels[configName];
        }
    }

    public static GetWhatsAppE2EConfig(configName: string): WhatsAppConfig {
        const configPrefix = ConfigHelper.getChannelConfigPrefix(AsyncChannelType.WhatsApp, configName);
        if (process.env[configPrefix]) {
            return ConfigHelper.readPipelineConfig(configPrefix, ConfigHelper.isWhatsAppConfig);
        }
        else {
            return testData.AsyncChannelsE2EConfigs[AsyncChannelType.WhatsApp].Channels[configName];
        }
    }

    public static GetBotChannelConfig(channel: BotChannelType, configName: string): BotChannelConfig {
        const configPrefix = ConfigHelper.getChannelConfigPrefix(channel, configName);
        if (process.env[configPrefix]) {
            return ConfigHelper.readPipelineConfig(configPrefix, ConfigHelper.isBotChannelConfig);
        }
        else {
            return testData.AsyncChannelsE2EConfigs[channel].Channels[configName];
        }
    }

    public static GetTwitterConfig(configName: string): TwitterConfig {
        let configPrefix = ConfigHelper.getChannelConfigPrefix(AsyncChannelType.Twitter, configName);
        configPrefix = configPrefix.replace(".", "_");
        if (process.env[configPrefix]) {
            return ConfigHelper.readPipelineConfig(configPrefix, ConfigHelper.isTwitterConfig);
        }
        else {
            return testData.AsyncChannelsE2EConfigs[AsyncChannelType.Twitter].Channels[configName];
        }
    }

    public static GetFacebookConfig(configName: string): FacebookConfig {
        const configPrefix = ConfigHelper.getChannelConfigPrefix(AsyncChannelType.Facebook, configName);
        if (process.env[configPrefix]) {
            return ConfigHelper.readPipelineConfig(configPrefix, ConfigHelper.isFacebookConfig);
        }
        else {
            return testData.AsyncChannelsE2EConfigs[AsyncChannelType.Facebook].Channels[configName];
        }
    }

    public static GetWeChatConfig(configName: string): WeChatConfig {
        const configPrefix = ConfigHelper.getChannelConfigPrefix(AsyncChannelType.WeChat, configName);
        if (process.env[configPrefix]) {
            return ConfigHelper.readPipelineConfig(configPrefix, ConfigHelper.isWeChatConfig);
        }
        else {
            return testData.AsyncChannelsE2EConfigs[AsyncChannelType.WeChat].Channels[configName];
        }
    }

    // Use different agents for each channel to run TCs in parallel due to the channel.
    // Resolves the chat conflicts from different channels on the same agent
    public static GetOCAgentForChannel(channel: AsyncChannelType, userIndex: number = 0): OCAgentCredential {
        const { emailPrefix, passwordPrefix, namePrefix } = ConfigHelper.getChannelAgentConfigPrefix(channel, userIndex);
        if (process.env[emailPrefix] && process.env[passwordPrefix] && process.env[namePrefix]) {
            return { email: process.env[emailPrefix], password: process.env[passwordPrefix], name: process.env[namePrefix] };
        }
        else {
            return testData.AsyncChannelsE2EConfigs[channel as any].Agent[userIndex];
        }
    }

    public static GetAgentNameForChannel(channel: AsyncChannelType, userIndex: number = 0): string {
        return TestSettings.GetOCAgentForChannel(channel, userIndex).name;
    }

    public static GetAgentIndexConfig(channel: AsyncChannelType, configName: AgentType): any {
        const { configPrefix } = ConfigHelper.getChannelAgentIndexConfigPrefix(channel, configName);
        if (process.env[configPrefix]) {
            const agentIndex = JSON.parse(process.env[configPrefix]);
            return agentIndex;
        }
        else {
            return testData.AsyncChannelsE2EConfigs[channel as any].AgentIndex[configName];
        }
    }

    public static get MacroConditionCustomerName() {
        return process.env.MacroConditionCustomerName || testData.MacroConditionCustomerName;
    }

    public static get DynamicBlob() {
        return process.env.DynamicBlob || testData.DynamicBlob;
    }

    public static get AuthDynamicBlob(): string {
        return process.env.AuthDynamicBlob || testData.AuthDynamicBlob;
    }

    public static get LCWAuthToken(): string {
        return process.env.LCWAuthToken || testData.LCWAuthToken;
    }

    public static get BYOBBlobURL() {
        return process.env.BYOBBlobURL || testData.BYOBBlobURL;
    }

    public static get BYOBEndBlobURL() {
        return process.env.BYOBEndBlobURL || testData.BYOBEndBlobURL;
    }

    public static get PVABlobURL() {
        return process.env.PVABlobURL || testData.PVABlobURL;
    }

    public static get ZeroCapacityUser() {
        return process.env.ZeroCapacityUser || testData.LiveChatLogin.ZeroCapacityUser;
    }

    public static get ZeroCapacityPassword() {
        return process.env.ZeroCapacityPassword || testData.LiveChatLogin.ZeroCapacityPassword;
    }

    public static get MinimumCapacityUser() {
        return process.env.MinimumCapacityUser || testData.LiveChatLogin.MinimumCapacityUser;
    }

    public static get MinimumCapacityPassword() {
        return process.env.MinimumCapacityPassword || testData.LiveChatLogin.MinimumCapacityPassword;
    }

    public static get SupervisorBlob() {
        return process.env.SupervisorBlob || testData.LiveChatLogin.SupervisorBlob;
    }

    public static get FacebookConsultingAgentName(): string {
        return process.env.FacebookConsultingAgentName || testData.Facebook.FacebookConsultingAgentName;
    }

    public static get PublicKeyValidUrl() {
        return process.env.PublicKeyValidUrl || testData.PublicKeyValidUrl;
    }

    public static get PublicKeyEmptyUrl() {
        return process.env.PublicKeyEmptyUrl || testData.PublicKeyEmptyUrl;
    }

    public static get PublicKeyInvalidUrl() {
        return process.env.PublicKeyInvalidUrl || testData.PublicKeyInvalidUrl;
    }

    public static get MultiPublicKeysArrayWithoutKidUrl() {
        return process.env.MultiPublicKeysArrayWithoutKidUrl || testData.MultiPublicKeysArrayWithoutKidUrl;
    }

    public static get MultiPublicKeysArrayWithEmptyPublicKeyUrl() {
        return process.env.MultiPublicKeysArrayWithEmptyPublicKeyUrl || testData.MultiPublicKeysArrayWithEmptyPublicKeyUrl;
    }

    public static get MultiPublicKeysArrayWithInvalidPublicKeyUrl() {
        return process.env.MultiPublicKeysArrayWithInvalidPublicKeyUrl || testData.MultiPublicKeysArrayWithInvalidPublicKeyUrl;
    }

    public static get MultiPublicKeysArrayValidUrl() {
        return process.env.MultiPublicKeysArrayValidUrl || testData.MultiPublicKeysArrayValidUrl;
    }

    public static get LiveChatProactiveChatEnabledWidget(): string {
        return process.env.LiveChatProactiveChatEnabledWidget || testData.LiveChat.ProactiveChatEnabledWidget;
    }

    public static get TeamsAgentNameToAssignChat(): string {
        return process.env.TeamsAgentNameToAssignChat || testData.MicrosoftTeams.TeamsAgentNameToAssignChat;
    }

    public static get LiveChatPCSLinkModeEnabledWidget(): string {
        return process.env.LiveChatPCSLinkModeEnabledWidget || testData.LiveChat.PCSLinkModeEnabledWidget;
    }

    public static get LiveChatPCSEmbedModeEnabledWidget(): string {
        return process.env.LiveChatPCSEmbedModeEnabledWidget || testData.LiveChat.PCSEmbedModeEnabledWidget;
    }

    public static get LCWAuthURL(): string {
        return process.env.LCWAuthURL || testData.LiveChatLogin.LCWAuthURL;
    }

    public static get LCWAuthUser(): string {
        return process.env.LCWAuthUser || testData.LiveChatLogin.LCWAuthUser;
    }

    public static get LCWAuthPwd(): string {
        return process.env.LCWAuthPwd || testData.LiveChatLogin.LCWAuthPwd;
    }

    public static get LCWAuthPickURL(): string {
        return process.env.LCWAuthPickURL || testData.LiveChatLogin.LCWAuthPickURL;
    }

    public static get PortalURL(): string {
        return process.env.PortalURL || testData.LiveChatLogin.PortalURL;
    }

    public static get ReconnectBlob() {
        return process.env.ReconnectBlob || testData.ReconnectBlob;
    }

    public static get ReconnectPopoutBlob() {
        return process.env.ReconnectPopoutBlob || testData.ReconnectPopoutBlob;
    }

    public static get ReconnectPopoutSurveyQuestionWithoutRedirectionBlob() {
        return process.env.ReconnectPopoutSurveyQuestionWithoutRedirectionBlob || testData.ReconnectPopoutSurveyQuestionWithoutRedirectionBlob;
    }

    public static get ReconnectPopoutWithoutRedirectionBlob() {
        return process.env.ReconnectPopoutWithoutRedirectionBlob || testData.ReconnectPopoutWithoutRedirectionBlob;
    }

    public static get ReconnectConsultTransferSurveyQuestionBlob() {
        return process.env.ReconnectConsultTransferSurveyQuestionBlob || testData.ReconnectConsultTransferSurveyQuestionBlob;
    }

    public static get AuthenticationSettingsEmptyKeyUrl() {
        return process.env.AuthenticationSettingsEmptyKeyUrl || testData.AuthenticationSettings.KeyUrls.EmptyKey;
    }

    public static get AuthenticationSettingsMultiInvalidKeyUrl() {
        return process.env.AuthenticationSettingsMultiInvalidKeyUrl || testData.AuthenticationSettings.KeyUrls.MultiInvalid;
    }

    public static get AuthenticationSettingsMultiNoKeyKeyUrl() {
        return process.env.AuthenticationSettingsMultiNoKeyKeyUrl || testData.AuthenticationSettings.KeyUrls.MultiNoKey;
    }

    public static get AuthenticationSettingsMultiNullValueKeyUrl() {
        return process.env.AuthenticationSettingsMultiNullValueKeyUrl || testData.AuthenticationSettings.KeyUrls.MultiNullValue;
    }

    public static get AuthenticationSettingsMultiEmptyKeyUrl() {
        return process.env.AuthenticationSettingsMultiEmptyKeyUrl || testData.AuthenticationSettings.KeyUrls.MultiEmpty;
    }

    public static get AuthenticationSettingsInvalidKeyUrl() {
        return process.env.AuthenticationSettingsInvalidKeyKeyUrl || testData.AuthenticationSettings.KeyUrls.InvalidKey;
    }

    public static get AuthenticationSettingsInvalidEndpointKeyUrl() {
        return process.env.AuthenticationSettingsInvalidEndpointKeyUrl || testData.AuthenticationSettings.KeyUrls.InvalidEndpoint;
    }

    public static get WeChatAccountName(): string {
        return process.env.WeChatAccountName || testData.WeChat.WeChatChannel.WeChatAccountName;
    }

    public static get WeChatOriginalID(): string {
        return process.env.WeChatOriginalID || testData.WeChat.WeChatChannel.WeChatOriginalID;
    }

    public static get WeChatTokenID(): string {
        return process.env.WeChatTokenID || testData.WeChat.WeChatChannel.WeChatTokenID;
    }

    public static get WeChatWorkStreamName(): string {
        return process.env.WeChatWorkStreamName || testData.WeChat.WeChatChannel.WeChatWorkStreamName;
    }

    public static get WeChatDeveloperID(): string {
        return process.env.WeChatDeveloperID || testData.WeChat.WeChatChannel.WeChatDeveloperID;
    }

    public static get WeChatSecretKey(): string {
        return process.env.WeChatSecretKey || testData.WeChat.WeChatChannel.WeChatSecretKey;
    }

    public static get WeChatMessageEncryptionkey(): string {
        return process.env.WeChatMessageEncryptionkey || testData.WeChat.WeChatChannel.WeChatMessageEncryptionkey;
    }

    public static get WeChatQueue(): string {
        return process.env.WeChatQueue || testData.WeChat.WeChatChannel.WeChatQueue;
    }

    public static get WeChatAgent(): string {
        return process.env.WeChatAgent || testData.WeChat.WeChatChannel.WeChatAgent;
    }

    public static get WeChatConfigurationId(): string {
        return process.env.WeChatConfigurationId;
    }

    public static set WeChatConfigurationId(value: string) {
        process.env.WeChatConfigurationId = value;
    }

    public static get WeChatGLTeamSettings() {
        return {
            WeChatGLTeamOriginalId: process.env.WeChatGLTeamOriginalId || testData.WeChat.GLTeamSettings.OriginalId,
            WeChatGLTeamToken: process.env.WeChatGLTeamToken || testData.WeChat.GLTeamSettings.Token,
            WeChatGLTeamConfigId: process.env.WeChatGLTeamConfigId || testData.WeChat.GLTeamSettings.ConfigId
        };
    }

    public static get AuthChatPortalLink(): string {
        return process.env.AuthChatPortalLink || testData.AuthChatPortalLink;
    }

    public static get AuthPortalUser1(): string {
        return process.env.AuthPortalUser1 || testData.AuthPortalUser1;
    }

    public static get AuthPortalUserPassword1(): string {
        return process.env.AuthPortalUserPassword1 || testData.AuthPortalUserPassword1;
    }

    public static get AuthPortalUser2(): string {
        return process.env.AuthPortalUser2 || testData.AuthPortalUser2;
    }

    public static get AuthPortalUserPassword2(): string {
        return process.env.AuthPortalUserPassword2 || testData.AuthPortalUserPassword2;
    }

    public static get LivePopoutChatUserName(): string {
        return process.env.LivePopoutChatUserName || testData.LiveChatLogin.LivePopoutChatUserName;
    }
    public static get LiveChatAttachmentEmail(): string {
        return process.env.LiveChatAttachmentEmail || testData.LiveChatLogin.LiveChatAttachmentEmail;
    }

    public static get LivePopoutChatPassword(): string {
        return process.env.DefaultPassword || testData.DefaultPassword;
    }
    public static get LiveChatReconnectUserName(): string {
        return process.env.LiveChatReconnectUserName || testData.LiveChatLogin.LiveChatReconnectUserName;
    }

    public static get LiveChatAISuggestionChatWidgetFirst(): string {
        return process.env.LiveChatAISuggestionChatWidgetFirst || testData.LiveChat.AISuggestionChatWidgetFirst;
    }

    public static get LiveChatAISuggestionChatWidgetSecond(): string {
        return process.env.LiveChatAISuggestionChatWidgetSecond || testData.LiveChat.AISuggestionChatWidgetSecond;
    }

    public static get WhatsAppAccountName(): string {
        return process.env.WhatsAppAccountName || testData.WhatsAppTwilio.WhatsAppChannel.WhatsAppAccountName;
    }

    public static get WhatsAppWorkStreamName(): string {
        return process.env.WhatsAppWorkStreamName || testData.WhatsAppTwilio.WhatsAppChannel.WhatsAppWorkStreamName;
    }

    public static get WhatsAppQueueName(): string {
        return process.env.WhatsAppQueueName || testData.WhatsAppTwilio.WhatsAppChannel.WhatsAppQueueName;
    }

    public static get WhatsAppNewNumberName(): string {
        return process.env.WhatsAppNewNumberName || testData.WhatsAppTwilio.WhatsAppChannel.WhatsAppNewNumberName;
    }

    public static get WhatsAppAgentName(): string {
        return process.env.WhatsAppAgentName || testData.WhatsAppTwilio.WhatsAppChannel.WhatsAppAgentName;
    }

    public static get WhatsAppAgentAccountEmail(): string {
        return process.env.WhatsAppTwilioAgentAccountEmail || testData.WhatsAppTwilio.AgentAccountEmail;
    }

    public static get AttachmentImageBlobUrl(): string {
        return process.env.AttachmentImageBlobUrl || testData.Facebook.AttachmentImageBlobUrl;
    }

    public static get AttachmentImageName(): string {
        return process.env.AttachmentImageName || testData.Facebook.AttachmentImageName;
    }

    public static get AttachmentDllblobUrl(): string {
        return process.env.AttachmentDllblobUrl || testData.Facebook.AttachmentDllblobUrl;
    }

    public static get AttachmentDllName(): string {
        return process.env.AttachmentDllName || testData.Facebook.AttachmentDllName;
    }

    public static get ReconnectPopoutSurveyQuestionBlob() {
        return process.env.ReconnectPopoutSurveyQuestionBlob || testData.ReconnectPopoutSurveyQuestionBlob;
    }

    public static get FacebookConsultingAgentEmail(): string {
        return process.env.FacebookConsultingAgentEmail || testData.Facebook.FacebookConsultingAgentEmail;
    }

    public static get LCWAuthPopURL(): string {
        return process.env.LCWAuthPopURL || testData.LiveChatLogin.LCWAuthPopURL;
    }

    public static get AuthReconnectPopoutSurveyQuestionBlobURL(): string {
        return process.env.AuthReconnectPopoutSurveyQuestionBlobURL || testData.LiveChatLogin.AuthReconnectPopoutSurveyQuestionBlobURL;
    }

    public static get AuthReconnectPopoutSurveyQuestionWithOutRedirectionBlobURL(): string {
        return process.env.AuthReconnectPopoutSurveyQuestionWithOutRedirectionBlobURL || testData.LiveChatLogin.AuthReconnectPopoutSurveyQuestionWithOutRedirectionBlobURL;
    }

    public static get AuthReconnectWithOutRedirectionURL(): string {
        return process.env.AuthReconnectWithOutRedirectionURL || testData.LiveChatLogin.AuthReconnectWithOutRedirectionURL;
    }

    public static GetSMSTeleSignConfig(configName: string): TeleSignConfig {
        const configPrefix = ConfigHelper.getChannelConfigPrefix(AsyncChannelType.SMSTeleSign, configName);
        if (process.env[configPrefix]) {
            return ConfigHelper.readPipelineConfig(configPrefix, ConfigHelper.isSMSTeleSignConfig);
        }
        else {
            return testData.AsyncChannelsE2EConfigs[AsyncChannelType.SMSTeleSign].Channels[configName];
        }
    }

    public static get TeleSignWorkStreamName(): string {
        return process.env.TeleSignWorkStreamName || testData.SMSTelesign.TeleSign.TeleSignWorkStreamName;
    }

    public static GetSMSTwilioConfig(configName: string): TwilioConfig {
        const configPrefix = ConfigHelper.getChannelConfigPrefix(AsyncChannelType.SMSTwilio, configName);
        if (process.env[configPrefix]) {
            return ConfigHelper.readPipelineConfig(configPrefix, ConfigHelper.isSMSTwilioConfig);
        }
        else {
            return testData.AsyncChannelsE2EConfigs[AsyncChannelType.SMSTwilio].Channels[configName];
        }
    }

    public static get TwilioWorkStreamName(): string {
        return process.env.TwilioWorkStreamName || testData.SMSTwilio.Twilio.TwilioWorkStreamName;
    }

    public static get WeChatChannelAgentEmail(): string {
        return (
            process.env.WeChatChannelAgentEmail || testData.WeChat.WeChatChannel.WeChatAgentEmail
        );
    }

    public static get SMSTeleSignAgentEmail(): string {
        return (
            process.env.SMSTeleSignAgentEmail || testData.SMSTelesign.TeleSign.SMSTeleSignAgentEmail
        );
    }

    public static get SMSTwilioAgentEmail(): string {
        return (
            process.env.SMSTwilioAgentEmail || testData.SMSTwilio.Twilio.SMSTwilioAgentEmail
        );
    }

    public static get WhatsAppSupervisorAssignWS(): string {
        return process.env.WhatsAppSupervisorAssignWS || testData.WhatsAppTwilio.WhatsAppChannel.WhatsAppSupervisorAssignWS;
    }

    public static get WeChatSupervisorAssignWS(): string {
        return process.env.WeChatSupervisorAssignWS || testData.WeChat.WeChatChannel.WeChatSupervisorAssignWS;
    }

    public static get WeChatSupervisorAssignEmail(): string {
        return process.env.WeChatSupervisorAssignEmail || testData.WeChat.WeChatChannel.WeChatSupervisorAssignEmail;
    }

    public static get WeChatSupervisorAssignName(): string {
        return process.env.WeChatSupervisorAssignName || testData.WeChat.WeChatChannel.WeChatSupervisorAssignName;
    }

    public static get LiveChatAttachmentsYYBloburl(): string {
        return process.env.LiveChatAttachmentsYYBloburl || testData.LiveChatLogin.LiveChatAttachments.LiveChatAttachmentsYYBloburl;
    }

    public static get LiveChatAttachmentsYNBloburl(): string {
        return process.env.LiveChatAttachmentsYNBloburl || testData.LiveChatLogin.LiveChatAttachments.LiveChatAttachmentsYNBloburl;
    }

    public static get LiveChatAttachmentsNYBloburl(): string {
        return process.env.LiveChatAttachmentsNYBloburl || testData.LiveChatLogin.LiveChatAttachments.LiveChatAttachmentsNYBloburl;
    }

    public static get LiveChatAttachmentsNNBloburl(): string {
        return process.env.LiveChatAttachmentsNNBloburl || testData.LiveChatLogin.LiveChatAttachments.LiveChatAttachmentsNNBloburl;
    }

    public static get Prechatcombinations(): string {
        return process.env.PrechatCombinations || testData.LiveChatLogin.Prechatcombinations;
    }

    public static get CobrowseScreenshareBlob(): string {
        return process.env.CobrowseScreenshareBlob || testData.LiveChatLogin.CobrowseScreenshareBlob;
    }

    public static get ModernAdminEmail(): string {
        return process.env.ModernAdminEmail || testData.ModernAdmin.ModernAdminEmail;
    }

    public static get ModernAdminPassword(): string {
        return process.env.ModernAdminPassword || testData.ModernAdmin.ModernAdminPassword;
    }

    public static get ModernAdminUrl(): string {
        return process.env.ModernAdminUrl || testData.ModernAdmin.ModernAdminUrl;
    }

    public static get SMSTwilioSupervisorAssignEmail(): string {
        return process.env.SMSTwilioSupervisorAssignEmail || testData.SMSTwilio.Twilio.SMSTwilioSupervisorAssignEmail;
    }
    public static get SMSTwilioQueue(): string {
        return process.env.SMSTwilioQueue || testData.SMSTwilio.Twilio.SMSTwilioQueue;
    }

    public static get LiveInliveVideosBlobUrl(): string {
        return process.env.LiveInliveVideosBlobUrl || testData.LiveChatLogin.LiveInliveVideosBlobUrl;
    }

    public static get JWTPortalUrl(): string {
        return process.env.JWTPortalUrl || testData.JWTPortalUrl;
    }

    public static get PVAPWChat(): string {
        return process.env.PVAPWChat || testData.LiveChat.PVAPWChat;
    }

    public static get LiveChatDesignPopoutbloburl(): string {
        return process.env.LiveChatDesignPopoutbloburl || testData.LiveChatLogin.LiveChatDesignPopoutbloburl;
    }

    public static get PVAPreChatSurveybloburl(): string {
        return process.env.PVAPreChatSurveybloburl || testData.LiveChatLogin.PVAPreChatSurveybloburl;
    }

    public static get ReconnectDisabledBlob() {
        return process.env.ReconnectDisabledBlob || testData.ReconnectDisabledBlob;
    }

    public static get UaUserMail() {
        return process.env.UaUserMail || testData.UaUserMail;
    }

    public static get UaUserPassword() {
        return process.env.UaUserPassword || testData.UaUserPassword;
    }

    public static get LCWAutomatedChatblobUrl(): string {
        return process.env.LCWAutomatedChatblobUrl || testData.LiveChatLogin.LCWAutomatedChatblobUrl;
    }

    public static get LCWAutomatedChatBypassCacheblobUrl(): string {
        return process.env.LCWAutomatedChatBypassCacheblobUrl || testData.LiveChatLogin.LCWAutomatedChatBypassCacheblobUrl;
    }

    public static get TestLiveChatPersistentAutomatedBlobUrl(): string {
        return process.env.TestLiveChatPersistentAutomatedBlobUrl || testData.TestLiveChatPersistentAutomatedBlobUrl;
    }

    public static get AgentEmailFirst(): string {
        return process.env.AgentEmailFirst || testData.LiveChatLogin.AgentEmailFirst;
    }

    public static get AgentEmailSecond(): string {
        return process.env.AgentEmailSecond || testData.LiveChatLogin.AgentEmailSecond;
    }


    public static get LiveChatAutomatedTestChannelblobUrl(): string {
        return process.env.LiveChatAutomatedTestChannelblobUrl || testData.LiveChatLogin.LiveChatAutomatedTestChannelblobUrl;
    }

    public static get SentimentAlertingChatBlobUrl(): string {
        return process.env.SentimentAlertingChatBlobUrl || testData.LiveChat.SentimentAlertingChatBlobUrl;
    }

    public static get LiveChatRuAutomatedBlobUrl(): string {
        return process.env.LiveChatRuAutomatedBlobUrl || testData.LiveChat.LiveChatRuAutomatedBlobUrl;
    }

    public static get CustomDirectLineAgentEmail(): string {
        return process.env.CustomDirectLineAgentEmail || testData.Custom.CustomDirectLineAgentEmail;
    }

    public static get CustomTelegramAgentEmail(): string {
        return process.env.CustomTelegramAgentEmail || testData.Custom.CustomTelegramAgentEmail;
    }

    public static get CustomTelegramAppID(): string {
        return (
            process.env.CustomTelegramAppID || testData.Custom.CustomTelegramAppID
        );
    }

    public static get CustomTelegramAppSecret(): string {
        return (
            process.env.CustomTelegramAppSecret || testData.Custom.CustomTelegramAppSecret
        );
    }

    public static get LiveChatReconnectCapacityHoldZeroAccountBlob(): string {
        return process.env.LiveChatReconnectCapacityHoldZeroAccountBlob || testData.LiveChatReconnectCapacityHoldZeroAccountBlob;
    }

    public static get LCWAutomatedChatPopOutblobUrl(): string {
        return process.env.LCWAutomatedChatPopOutblobUrl || testData.LiveChatLogin.LCWAutomatedChatPopOutblobUrl;
    }

    public static get LCWAutomatedChatPopOutInvalidLocationBlobUrl(): string {
        return process.env.LCWAutomatedChatPopOutInvalidLocationBlobUrl || testData.LiveChatLogin.LCWAutomatedChatPopOutInvalidLocationBlobUrl;
    }

    public static get LiveChatAutomatedTestTranscriptBlobUrl(): string {
        return process.env.LiveChatAutomatedTestTranscriptBlobUrl || testData.LiveChatLogin.LiveChatAutomatedTestTranscriptBlobUrl;
    }

    public static get EmptyFontStyleBlobUrl(): string {
        return process.env.EmptyFontStyleBlobUrl || testData.LiveChat.EmptyFontStyleBlobUrl;
    }
    public static get WrongFontStyleBlobUrl(): string {
        return process.env.WrongFontStyleBlobUrl || testData.LiveChat.WrongFontStyleBlobUrl;
    }

    public static get QueuePositionTransferAutomatedBlobURL() {
        return process.env.QueuePositionTransferAutomatedBlobURL || testData.QueuePositionTransfer.QueuePositionTransferAutomatedBlobURL;
    }

    public static get QueuePositionFirstChatBlobURL() {
        return process.env.QueuePositionFirstChatBlobURL || testData.QueuePositionTransfer.QueuePositionFirstChatBlobURL;
    }

    public static get QueuePositionFirstSecondChatBlobURL() {
        return process.env.QueuePositionFirstSecondChatBlobURL || testData.QueuePositionTransfer.QueuePositionFirstSecondChatBlobURL;
    }

    public static get QueuePositionSecondChatBlobURL() {
        return process.env.QueuePositionSecondChatBlobURL || testData.QueuePositionTransfer.QueuePositionSecondChatBlobURL;
    }

    public static get QueuePositionThirdChatBlobURL() {
        return process.env.QueuePositionThirdChatBlobURL || testData.QueuePositionTransfer.QueuePositionThirdChatBlobURL;
    }

    public static get ReconnectCapacityReservePopoutBlob() {
        return process.env.ReconnectCapacityReservePopoutBlob || testData.ReconnectCapacityReservePopoutBlob;
    }

    public static get ReconnectWaitingConversationPopoutBlob() {
        return process.env.ReconnectWaitingConversationPopoutBlob || testData.ReconnectWaitingConversationPopoutBlob;
    }

    public static get TwilioSentimentAccountSID() {
        return process.env.TwilioSentimentAccountSID || testData.TwilioSentimentAccountSID;
    }

    public static get TwilioSentimentAuthToken() {
        return process.env.TwilioSentimentAuthToken || testData.TwilioSentimentAuthToken;
    }

    public static get LCWE2EAuthUser(): string {
        return process.env.LCWE2EAuthUser || testData.LiveChatLogin.LCWE2EAuthUser;
    }

    public static get LCWE2EAuthPassword(): string {
        return process.env.LCWE2EAuthPassword || testData.LiveChatLogin.LCWE2EAuthPassword;
    }

    public static get SDKChatGuid() {
        return process.env.SDKChatGuid || testData.LiveChatLogin.SDKChatGuid;
    }

    public static get LiveChatACSAccountBlobUrl() {
        return process.env.LiveChatACSAccountBlobUrl || testData.LiveChatLogin.LiveChatACSAccountBlobUrl;
    }

    public static get LiveChatAutomatedFontTestUrl(): string {
        return process.env.LiveChatAutomatedFontTestUrl || testData.LiveChatLogin.LiveChatAutomatedFontTestUrl;
    }

    public static get LCWAuthBlobUrl() {
        return process.env.LCWAuthBlobUrl || testData.LCWAuthBlobUrl;
    }

    public static get LiveChatAvgWaitQueuePositionBlobUrl(): string {
        return process.env.LiveChatAvgWaitQueuePositionBlobUrl || testData.LiveChatLogin.LiveChatAvgWaitQueuePositionBlobUrl;
    }

    public static get LiveChatRelevanceAccountBlobUrl(): string {
        return process.env.LiveChatRelevanceAccountBlobUrl || testData.LiveChatLogin.LiveChatRelevanceAccountBlobUrl;
    }

    public static get LiveChatPWLinkAccountBlobUrl(): string {
        return process.env.LiveChatPWLinkAccountBlobUrl || testData.LiveChatLogin.LiveChatPWLinkAccountBlobUrl;
    }

    public static get LiveChatProfileBasedCapacityWSBlobUrl(): string {
        return process.env.LiveChatProfileBasedCapacityWSBlobUrl || testData.LiveChatLogin.LiveChatProfileBasedCapacityWSBlobUrl;
    }

    public static get LiveChatSupervisorExperienceblobUrl() {
        return process.env.LiveChatSupervisorExperienceblobUrl || testData.LiveChatSupervisorExperienceblobUrl;
    }

    public static get AdaptiveCardBlobURL() {
        return process.env.AdaptiveCardBlobURL || testData.AdaptiveCardBlobURL;
    }

    public static get ProactiveChatEnabledblobUrl(): string {
        return process.env.ProactiveChatEnabledblobUrl || testData.ProactiveChatEnabledblobUrl;
    }

    public static get ProactiveChatEnabledWithoutMessageblobUrl(): string {
        return process.env.ProactiveChatEnabledWithoutMessageblobUrl || testData.ProactiveChatEnabledWithoutMessageblobUrl;
    }

    public static get ProactiveChatEnabledWithoutMessagePopOutblobUrl(): string {
        return process.env.ProactiveChatEnabledWithoutMessagePopOutblobUrl || testData.ProactiveChatEnabledWithoutMessagePopOutblobUrl;
    }

    public static get ReconnectCapacityBlob() {
        return process.env.ReconnectCapacityBlob || testData.ReconnectCapacityBlob;
    }

    public static get LiveChatAutomatedPopOutBlobURL() {
        return process.env.LiveChatAutomatedPopOutBlobURL || testData.LiveChatAutomatedPopOutBlobURL;
    }

    public static get LiveChatAutomatedMonotypeFontPopUpBlobURL() {
        return process.env.LiveChatAutomatedMonotypeFontPopUpBlobURL || testData.LiveChatAutomatedMonotypeFontPopUpBlobURL;
    }

    public static get LiveChatPushHeaderBlob() {
        return process.env.LiveChatPushHeaderBlob || testData.LiveChatPushHeaderBlob;
    }

    public static get LiveChatPickHeaderBlob() {
        return process.env.LiveChatPickHeaderBlob || testData.LiveChatPickHeaderBlob;
    }

    public static get LiveChatContextVariableBlob() {
        return process.env.LiveChatContextVariableBlob || testData.LiveChatContextVariableBlob;
    }

    public static get LiveChatContextVariablePopOutBlob() {
        return process.env.LiveChatContextVariablePopOutBlob || testData.LiveChatContextVariablePopOutBlob;
    }

    public static get LiveChatAutoOpenContextVariableBlob() {
        return process.env.LiveChatAutoOpenContextVariableBlob || testData.LiveChatAutoOpenContextVariableBlob;
    }

    public static get LiveChatAutoOpenContextVariableNewWindowBlob() {
        return process.env.LiveChatAutoOpenContextVariableNewWindowBlob || testData.LiveChatAutoOpenContextVariableNewWindowBlob;
    }

    public static get LiveChatHideChatWidgetBlob() {
        return process.env.LiveChatHideChatWidgetBlob || testData.LiveChatHideChatWidgetBlob;
    }

    public static get LiveChatSDKNewWindowBlob() {
        return process.env.LiveChatSDKNewWindowBlob || testData.LiveChatSDKNewWindowBlob;
    }

    public static get ConsultAndTransferVerificationBlob() {
        return process.env.ConsultAndTransferVerificationBlob || testData.ConsultAndTransferVerificationBlob;
    }
    public static get PVAPreChatSurveyMultibloburl(): string {
        return process.env.PVAPreChatSurveyMultibloburl || testData.LiveChatLogin.PVAPreChatSurveyMultibloburl;
    }

    public static get LiveChatBotUrl(): string {
        return process.env.LiveChatBotUrl || testData.LiveChatBotUrl;
    }

    public static get LcwPWPickUrl() {
        return process.env.LcwPWPickUrl || testData.LcwPWPickUrl;
    }

    public static get SanityLineUser() {
        return process.env.SanityLineUser || testData.Line.SanityLineUser;
    }

    public static get SanityLineQueueName() {
        return process.env.SanityLineQueueName || testData.Line.SanityLineQueueName;
    }

    public static get SanityWhatsAppQueueName() {
        return process.env.SanityWhatsAppQueueName || testData.WhatsAppTwilio.SanityWhatsAppQueueName;
    }

    public static get SanityWhatsAppUser() {
        return process.env.SanityWhatsAppUser || testData.WhatsAppTwilio.SanityWhatsAppUser;
    }

    public static get SanityTeamsUser() {
        return process.env.SanityTeamsUser || testData.MicrosoftTeams.SanityTeamsUser;
    }

    public static get SanityTeamsQueueName() {
        return process.env.SanityTeamsQueueName || testData.MicrosoftTeams.SanityTeamsQueueName;
    }

    public static get SanityTwitterAppUser() {
        return process.env.SanityTwitterAppUser || testData.Twitter.SanityTwitterAppUser;
    }

    public static get SanityTwitterQueuename() {
        return process.env.SanityTwitterQueuename || testData.Twitter.SanityTwitterQueuename;
    }

    public static get InsideOperatingHourUrl(): string {
        return process.env.InsideOperatingHourUrl || testData.InsideOperatingHourUrl;
    }

    public static get TelegramOperatingHourAppId(): string {
        return (
            process.env.TelegramOperatingHourAppId || testData.Custom.TelegramOperatingHourAppId
        );
    }

    public static get TelegramOperatingHourAppSecret(): string {
        return (
            process.env.TelegramOperatingHourAppSecret || testData.Custom.TelegramOperatingHourAppSecret
        );
    }

    public static get SDKLiveChatBlobURL() {
        return process.env.SDKLiveChatBlobURL || testData.SDKLiveChatBlobURL;
    }

    public static get ChatSDKBlobURL() {
        return process.env.ChatSDKBlobURL || testData.ChatSDKBlobURL;
    }

    public static get PVAHorizontalBlobUrl() {
        return process.env.PVAHorizontalBlobUrl || testData.LiveChatLogin.PVAHorizontalBlobUrl;
    }

    public static get PVAVerticalBlobUrl() {
        return process.env.PVAHorizontalBlobUrl || testData.LiveChatLogin.PVAVerticalBlobUrl;
    }

    public static get SanityCustomQueueName() {
        return process.env.SanityCustomQueueName || testData.Custom.SanityCustomQueueName;
    }

    public static get SanityCustomUserName() {
        return process.env.SanityCustomUserName || testData.Custom.SanityCustomUserName;
    }

    public static get LCWPersistentAuthURL(): string {
        return process.env.LCWPersistentAuthURL || testData.LCWPersistentAuthURL;
    }

    public static get LCWAuthPersistentUser(): string {
        return process.env.LCWAuthPersistentUser || testData.LCWAuthPersistentUser;
    }

    public static get LCWAuthPersistentPwd(): string {
        return process.env.LCWAuthPersistentPwd || testData.LCWAuthPersistentPwd;
    }

    public static get LiveChatConsultRedesignUser1(): string {
        return process.env.LiveChatConsultRedesignUser1 || testData.LiveChatLogin.LiveChatConsultRedesignUser1;
    }

    public static get LiveChatAutomatedQueueTransfer(): string {
        return process.env.LiveChatAutomatedQueueTransfer || testData.LiveChatLogin.LiveChatAutomatedQueueTransfer;
    }

    public static get LiveChatConsultRedesignUser2(): string {
        return process.env.LiveChatConsultRedesignUser2 || testData.LiveChatLogin.LiveChatConsultRedesignUser2;
    }

    public static get LiveChatConsultRedesignUser3(): string {
        return process.env.LiveChatConsultRedesignUser3 || testData.LiveChatLogin.LiveChatConsultRedesignUser3;
    }

    public static get LiveChatConsultRedesignSupervisor(): string {
        return process.env.LiveChatConsultRedesignSupervisor || testData.LiveChatLogin.LiveChatConsultRedesignSupervisor;
    }

    public static get LiveChatConsultRedesignPassword(): string {
        return process.env.DefaultPassword || testData.DefaultPassword;
    }

    public static get LiveChatConsultRedesignBlobUrl(): string {
        return process.env.LiveChatConsultRedesignBlobUrl || testData.LiveChatLogin.LiveChatConsultRedesignBlobUrl;
    }

    public static get LiveChatAWTBlobUrl() {
        return process.env.LiveChatAWTBlobUrl || testData.LiveChatLogin.LiveChatAWTBlobUrl;
    }

    public static get PVAContextVariableAuthURL(): string {
        return process.env.PVAContextVariableAuthURL || testData.LiveChatLogin.PVAContextVariableAuthURL;
    }

    public static get EscalationPostQueue() {
        return process.env.EscalationPostQueue || testData.LiveChat.EscalationPostQueue;
    }

    public static get SentimentSupervisorAffinityAccountEmail(): string {
        return process.env.SentimentSupervisorAffinityAccountEmail || testData.LiveChat.SentimentSupervisorAffinityAccountEmail;
    }

    public static get SupervisorRoleAgentAffinityBlobUrl(): string {
        return process.env.SupervisorRoleAgentAffinityBlobUrl || testData.LiveChat.SupervisorRoleAgentAffinityBlobUrl;
    }

    public static get LiveChatPrechatTranscriptBlobUrl(): string {
        return process.env.LiveChatPrechatTranscriptBlobUrl || testData.LiveChatLogin.LiveChatPrechatTranscriptBlobUrl;
    }

    public static get PersistentChatOOHBlobUrl() {
        return process.env.PersistentChatOOHBlobUrl || testData.LiveChatPersistentMode.PersistentChatOOHBlobUrl;
    }

    public static get ExactSkillsMatchBlobUrl(): string {
        return process.env.ExactSkillsMatchBlobUrl //|| testData.LiveChatLogin.ExactSkillMatchBlobUrl;
    }

    public static get ExactMostSkillsMatchBlobUrl(): string {
        return process.env.ExactMostSkillsMatchBlobUrl //|| testData.LiveChatLogin.ExactMostSkillMatchBlobUrl;
    }
    public static get OmnichannelAgentAccountEmail(): string {
        return process.env.OmnichannelAgentEmail || testData.OmnichannelAgentLogin.OmnichannelAgentEmail;
    }

    public static get OmnichannelAgentAccountPassword(): string {
        return process.env.OmnichannelAgentPassword || testData.OmnichannelAgentLogin.OmnichannelAgentPassword;
    }

    public static get RoutingRulesQueueUrl(): string {
        return process.env.RoutingRulesQueueUrl || testData.RoutingRulesQueueUrl;
    }
    public static get InboxUser(): string {
        return process.env.InboxUser || testData.InboxUser;
    }

    public static get InboxUser1(): string {
        return process.env.InboxUser1 || testData.InboxUser1;
    }

    public static get InboxUser2(): string {
        return process.env.InboxUser2 || testData.InboxUser2;
    }

    public static get InboxUser3(): string {
        return process.env.InboxUser3 || testData.InboxUser3;
    }
    public static get InboxUser4(): string {
        return process.env.InboxUser4 || testData.InboxUser4;
    }

    public static get PVAPreChatSDKBlobUrl(): string {
        return process.env.PVAPreChatSDKBlobUrl || testData.PVAPreChatSDKBlobUrl;
    }


    public static get CustomSkillBYOSEBlobUrl() {
        return process.env.CustomSkillBYOSEBlobUrl || testData.LiveChatPersistentMode.CustomSkillBYOSEBlobUrl;
    }

    public static get MacroAccountEmail() {
        return process.env.MacroAccountEmail || testData.ProductivityPane.MacroAccountEmail;
    }

    public static get MacroBloburl() {
        return process.env.MacroBloburl || testData.ProductivityPane.MacroBloburl;
    }

    public static get LivechatBloburl() {
        return process.env.LivechatBloburl || testData.ProductivityPane.LivechatBloburl;
    }

    public static get LiveChatPTEAccountEmail() {
        return process.env.LiveChatPTEAccountEmail || testData.ProductivityPane.LiveChatPTEAccountEmail;
    }

    public static get AgentScriptEmail() {
        return process.env.AgentScriptEmail || testData.ProductivityPane.AgentScriptEmail;
    }
    public static get ApplicationSetupEmail() {
        return process.env.ApplicationSetupEmail || testData.ProductivityPane.ApplicationSetupEmail;
    }
    public static get MacrosAgentEmail() {
        return process.env.MacrosAgentEmail || testData.ProductivityPane.MacrosAgentEmail;
    }
    public static get MultiSessionEmail() {
        return process.env.MultiSessionEmail || testData.ProductivityPane.MultiSessionEmail;
    }
    public static get InboxUser5() {
        return process.env.InboxUser5 || testData.InboxUser5;
    }
}