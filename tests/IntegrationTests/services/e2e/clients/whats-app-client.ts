import { TestSettings } from "../../../configuration/test-settings";
import { AsyncConnectorClient } from "../../../types/e2e/async-connector-client.t";
import * as axios from "axios";
import hmacsha1 from "hmacsha1";
import qs from "querystring";
import { Util } from "../../../Utility/Util";
import { AsyncConnectorError } from "../../../exceptions/async-connector-exception";

export class WhatsAppClient implements AsyncConnectorClient {
    private static readonly whatsAppUrl = `${TestSettings.ApiGatewayUrl}/whatsapp-twilio/incoming?orgId=${TestSettings.OrgId}`;
    private readonly axiosDefault = axios.default;
    private readonly authToken: string;

    constructor(authToken: string) {
        this.authToken = authToken;
    }

    public async send(payload: string): Promise<boolean> {
        const body = JSON.parse(payload);
        const signature = this.createSignature(body);

        try {
            const response = await this.axiosDefault.post(WhatsAppClient.whatsAppUrl, qs.stringify(body), {
                headers: {
                    "OriginalUrl": WhatsAppClient.whatsAppUrl,
                    "X-Twilio-Signature": signature,
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            });

            if (!!response && Util.isSuccessfulStatusCode(response.status)) {
                return true;
            }
            else {
                throw new AsyncConnectorError(response);
            }
        }
        catch (error) {
            throw new Error(`WhatsApp message failed, orgNumber: ${body.To.slice(10)}. Error message: ${error.message}`);
        }
    }

    private createSignature(payloadObj: object): string {
        const keys = [];
        for (let k in payloadObj) {
            keys.push(k);
        }

        keys.sort();
        const data = WhatsAppClient.whatsAppUrl.concat("", keys.map(k => k + payloadObj[k]).join(""));
        return hmacsha1(this.authToken, data);
    }

}