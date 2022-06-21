export enum BotChannelType {
    Teams = "Teams",
    Telegram = "Telegram",
    DirectLine = "DirectLine",
    Kik = "Kik",
    Line = "Line",
    Facebook = "Facebook"
}

enum AsyncConnectorChannels {
    AppleMessagesForBusiness = "AppleMessagesForBusiness",
    Twitter = "Twitter",
    WhatsApp = "WhatsApp",
    WeChat = "WeChat",
    SMSTeleSign = "SMSTeleSign",
    SMSTwilio = "SMSTwilio"
}


export enum AgentType {
    Push = "Push",
    Default = "Default",
    Pick = "Pick",
    Sanity = "Sanity",
    SupervisorAssign = "SupervisorAssign",
    Affinity = "Affinity",
    Inbox ="Inbox",
    AgentAffinity = "AgentAffinity"
}

export enum ChatType {
    Transfer = "Transfer"
}

export const AsyncChannelType = { ...BotChannelType, ...AsyncConnectorChannels };
export type AsyncChannelType = BotChannelType | AsyncConnectorChannels;

export class conversationInfo {
    public subject: string;
    public queue: string;
    public sentiment: string;
    public workstream: string;
    public startedDateTime: string;
    public channel: string;
    public status: string;
}