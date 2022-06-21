import { AgentChat } from "../pages/AgentChat";
import { AsyncChannelType } from "../types/e2e/async-channels.t";
import { AsyncConnectorActivity } from "../types/e2e/async-connector-activity.t";
import { AsyncConnectorClient } from "../types/e2e/async-connector-client.t";
import { AttachmentPathResolver } from "../services/e2e/attachment-path-resolver";
import { Extension } from "../types/e2e/attachment-extension.t";
import { GetActivityBuilder } from "../services/e2e/activities/async-connector-activity-factory";
import { GetClient } from "../services/e2e/clients/async-connector-clients";
import { LogChatDetails, LogRequestDetails } from "../helpers/log-helper";
import { OCCustomer } from "../models/oc-customer.t";
import { Page } from "playwright";
import { TestSettings } from "../configuration/test-settings";
import { Util } from "../Utility/Util";

export class AsyncChannelE2EPage extends AgentChat {
    public readonly streamSource: AsyncChannelType;
    private readonly client: AsyncConnectorClient;
    private isChatInitialized: boolean = false;
    protected readonly activity: AsyncConnectorActivity;

    constructor(page: Page, streamSource: AsyncChannelType, targetChannel = "Default") {
        super(page);
        this.streamSource = streamSource;
        this.activity = GetActivityBuilder(streamSource, targetChannel);
        this.client = GetClient(streamSource, targetChannel);
    }

    /*
    Replace the default customer in the payload template with the defined one.
    All messages will be sent from the newly provided customer.
    NOTE: For some channels, it could lead to conversation change.
     */
    public setAsyncChannelCustomer(customer: OCCustomer) {
        this.activity.useCustomer(customer);
    }

    public async sendInboundMessage(text: string) {
        await this.SendMessage(this.activity.useMessage(text).build());
    }

    public async loginAsyncChannelAgent(agentIndex: number = 0, logAgentEmail: boolean=false) {
        await this.loginChannelAgent(this.streamSource, agentIndex,logAgentEmail);
        await this.waitForAgentStatus();
    }

    public async getAgentName(userIndex: number = 0) {
        return TestSettings.GetAgentNameForChannel(this.streamSource, userIndex);
    }

    public async InitChat(uniqueInitialMessage?: string) {
        const sentMessage = uniqueInitialMessage ? uniqueInitialMessage : Util.newGuid();
        await this.SendMessage(this.activity.useMessage(sentMessage).build());
        await this.acceptChat(sentMessage);
        this.isChatInitialized = true;
    }

    protected ensureChatInitialized() {
        expect(this.isChatInitialized).toBeTruthy();
    }

    // sends the generated payload to the message sender API
    protected async SendMessage(payload: string) {
        expect(await this.client.send(payload)).toBeTruthy();
        await LogRequestDetails(payload);
    }

    public async SendAttachmentC2(extension: Extension) {
        await this.SendMessage(this.activity.useMessage("").useAttachment(extension).build());
    }

    public async SendAttachmentC1(extension: Extension) {
        await this.sendImageAttachmentFromAgent(AttachmentPathResolver.Instance.getFilePath(extension));
    }

    public async SendInlineAttachmentC2(text: string, extension: Extension) {
        await this.SendMessage(this.activity.useMessage(text).useAttachment(extension).build());
    }

    //Used to send message without Chat Initialization dependency (Ex: For scenarios to validate notificaion title,text before Accept/Reject)
    public async SendMessageToAgent(text: string) {
        await this.SendMessage(this.activity.useMessage(text).build());
    }
    
    public async verifyMessageSendingWithSentimentChanges(messageCount: number)
    {
        const messagesArray = ["Everything is good.", "But then it is bad.", "Now it is terrible.", "It is well again"]

        for(var i = 0; i< messageCount; i++)
        {
            await this.sendInboundMessage(messagesArray[i % 4]);
            await this.delay(500);
        }

        await expect(this.isMessagesCount(messageCount + 1)).toBeTruthy();
    }

    public async InitInboxChat(uniqueInitialMessage?: string) {
        const sentMessage = uniqueInitialMessage ? uniqueInitialMessage : Util.newGuid();
        await this.SendMessage(this.activity.useMessage(sentMessage).build());
        this.isChatInitialized = true;
    }

}