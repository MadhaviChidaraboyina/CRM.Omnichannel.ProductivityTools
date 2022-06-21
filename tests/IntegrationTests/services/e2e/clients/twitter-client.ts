import { TestSettings } from "../../../configuration/test-settings";
import { AsyncConnectorClient } from "../../../types/e2e/async-connector-client.t";
import { createHmac } from "crypto";
import * as axios from "axios";
import { TwitterConnectorError } from "../../../exceptions/async-connector-exception";
import { Util } from "../../../Utility/Util";

export class TwitterClient implements AsyncConnectorClient {
    private static readonly twitterUrl = `${TestSettings.ApiGatewayUrl}/twitter/${TestSettings.OrgId}/`;
    private readonly axiosDefault = axios.default;
    private readonly twitterAppId: string;
    private readonly consumerSecret: string;

    constructor(twitterAppId: string, twitterConsumerSecret: string) {
        this.twitterAppId = twitterAppId;
        this.consumerSecret = twitterConsumerSecret;
    }

    public async send(payload: string): Promise<boolean> {
        const hmac = createHmac("sha256", this.consumerSecret).update(payload, "utf8").digest("base64");
        const signature = `sha256=${hmac}`;
        const baseUrl = TwitterClient.twitterUrl.concat(this.twitterAppId);

        try {
            const response = await this.axiosDefault.post(baseUrl, payload, {
                headers: {
                    "x-twitter-webhooks-signature": signature,
                    "Content-Type": "application/json"
                }
            });

            if (!!response && Util.isSuccessfulStatusCode(response.status) && response.data.isSuccessStatusCode === true) {
                return true;
            }
            else {
                throw new TwitterConnectorError(response);
            }
        }
        catch (error) {
            throw new Error(`Twitter message failed. Twitter applicationId: ${this.twitterAppId}. Error message: ${error.message}`);
        }
    }

}