export interface TwilioMessage {
    accountSid: string;
    authToken: string;
    customerPhoneNumber: string;
    message: string;
    orgPhoneNumber: string;
}
