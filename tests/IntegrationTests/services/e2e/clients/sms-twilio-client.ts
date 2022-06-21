import { TestSettings } from "../../../configuration/test-settings";
import { AsyncConnectorClient } from "../../../types/e2e/async-connector-client.t";
import * as axios from "axios";
import { SMSTwilioConnectorError } from "../../../exceptions/async-connector-exception";
import b64_hmac_sha1 from "hmacsha1";

export class SMSTwilioClient implements AsyncConnectorClient {
    private readonly twilioInboundUrl = `${TestSettings.ApiGatewayUrl}/twilio/incoming?orgId=${TestSettings.OrgId}`;
    private readonly axiosDefault = axios.default;
    private readonly authToken: string;

    constructor(authToken: string) {
        this.authToken = authToken;
    }

    public async send(body: string): Promise<boolean> {       
        const payload = JSON.parse(body);       
        const url = this.twilioInboundUrl;
        let request = url.concat(Object.keys(payload).sort().map(key => key + payload[key]).join(""));
        const signature = b64_hmac_sha1(this.authToken, request);
        try {
            const response = await this.axiosDefault.post(url, new URLSearchParams(payload), {
                headers: {
                    "OriginalUrl": url,
                    "X-Twilio-Signature": signature,
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            });

            if (!!response && response.statusText === "OK") {
                return true;
            }
            else {
                throw new SMSTwilioConnectorError(response);
            }
        }
        catch (error) {
            throw new Error(`SMS Twilio message failed. authToken: ${this.authToken}. Error message: ${error.message}`);
        }
    }

}