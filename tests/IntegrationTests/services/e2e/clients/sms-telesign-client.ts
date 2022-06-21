import { TestSettings } from "../../../configuration/test-settings";
import { AsyncConnectorClient } from "../../../types/e2e/async-connector-client.t";
import * as axios from "axios";
import { SMSTeleSignConnectorError } from "../../../exceptions/async-connector-exception";
import * as CryptoJS from "crypto-js";

export class SMSTeleSignClient implements AsyncConnectorClient {
    private readonly telesignInboundUrl = `${TestSettings.ApiGatewayUrl}/telesign/incoming?orgId=${TestSettings.OrgId}`;
    private readonly axiosDefault = axios.default;
    private readonly apikey: string;
    private readonly customerId: string;

    constructor(apikey: string, customerId: string) {
        this.apikey = apikey;
        this.customerId = customerId;
    }

    public async send(payload: string): Promise<boolean> {
        const requestBodyBytes = CryptoJS.enc.Utf8.parse(payload);
        const apikeyBytes = CryptoJS.enc.Base64.parse(this.apikey);
        const signatureBytes = CryptoJS.HmacSHA256(requestBodyBytes, apikeyBytes);
        const signature = CryptoJS.enc.Base64.stringify(signatureBytes);
        const header = "TSA " + this.customerId + ":" + signature;

        try {
            const response = await this.axiosDefault.post(this.telesignInboundUrl, payload, {
                headers: {
                    "Authorization": header,
                    "Content-Type": "application/json"
                }
            });
            
            if (!!response && response.status === 200) {
                return true;
            }
            else {
                throw new SMSTeleSignConnectorError(response);
            }
        }
        catch (error) {
            throw new Error(`SMS TeleSign message failed. apiKey: ${this.apikey}. Error message: ${error.message}`);
        }
    }

}