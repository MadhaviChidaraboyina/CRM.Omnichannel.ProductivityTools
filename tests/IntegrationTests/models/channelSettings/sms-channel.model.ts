import { Languages } from "../languages";

export interface SmsChannelSettings {
    smsNumber: string;
    smsNumberLanguage: Languages;
    operatingHours?: string;
}