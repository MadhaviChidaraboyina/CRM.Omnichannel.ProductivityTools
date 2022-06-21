import { AuthenticationSettings } from "../channelSettings/authentication-settings.model";
import { BrowserContext } from "playwright";
import { WorkStreamModel } from "..";

export interface ChannelSettings {
    browserContext: BrowserContext;
    agentEmail: string;
    agentPassword: string;
    agentNames: string[];
    queueName: string;
    workStreamModel: WorkStreamModel;
    authSettingsModel?: AuthenticationSettings;
}