import { ChannelType } from "./enums/channel-type.enum";
import { SmsProvider } from "./enums/sms-provider.enum";
import { WorkDistributionMode } from "./enums/work-distribution-mode.enum";

export interface WorkStreamModel {
    name: string;
    channelType: ChannelType;
    workDistributionMode?: WorkDistributionMode;
    queueName: string;
    smsProvider?: SmsProvider;
    smsProviderId?: string;
    smsProviderSecret?: string;
}
