import * as axios from "axios";
import { TestSettings } from "../../../configuration/test-settings";
import { BotConnectorError } from "../../..//exceptions/async-connector-exception";
import { BCRClient } from "../../../helpers/bcr-client";
import { AsyncConnectorClient } from "../../../types/e2e/async-connector-client.t";
import { Util } from "../../../Utility/Util";

export class BotConnectorClient implements AsyncConnectorClient {
    private static readonly BotConnectorUrl = `${TestSettings.ApiGatewayUrl}/botchannel/incoming?orgId=${TestSettings.OrgId}`;
    private readonly axios = axios.default;
    private readonly bcrClientId: string;

    constructor(bcrClientId: string) {
        this.bcrClientId = bcrClientId;
    }

    public async send(payload: string): Promise<boolean> {
        const bcrToken = await BCRClient.getInstance().getToken(this.bcrClientId);

        try {
            const response = await this.axios.post(BotConnectorClient.BotConnectorUrl, payload, {
                headers: {
                    "Authorization": `Bearer ${bcrToken}`,
                    "Content-Type": "application/json"
                }
            });

            if (!!response && Util.isSuccessfulStatusCode(response.status) && response.data.isSuccessStatusCode === true) {
                return true;
            }
            else {
                throw new BotConnectorError(response);
            }
        }
        catch (error) {
            throw new Error(`BotConnector message failed. BCR MsAppId: ${this.bcrClientId}. Error message: ${error.message}`);
        }
    }
}