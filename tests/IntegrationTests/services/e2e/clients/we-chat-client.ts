import { AsyncConnectorClient } from "../../../types/e2e/async-connector-client.t";
import { SHA1, enc } from "crypto-js";
import { TestSettings } from "../../../configuration/test-settings";
import { URLSearchParams } from "url";
import { json2xml } from "xml-js";
import * as axios from "axios";
import { AsyncConnectorError } from "../../../exceptions/async-connector-exception";
import { Util } from "../../../Utility/Util";

export class WeChatClient implements AsyncConnectorClient {
    private readonly axiosDefault = axios.default;
    private readonly nonce = "1597625410";
    private readonly configId: string;
    private readonly token: string;

    constructor(token: string, configId: string) {
        this.token = token;
        this.configId = configId;
    }

    public async send(payload: string): Promise<boolean> {
        const { CreateTime, FromUserName } = JSON.parse(payload).xml;
        const signature = this.createSignature(CreateTime);
        const url = this.getWeChatUrl(signature, CreateTime, FromUserName);

        try {
            const response = await this.axiosDefault.post(url, json2xml(payload, { compact: true }), {
                headers: {
                    "Content-Type": "application/xml"
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
            throw new Error(`WeChat message failed. WeChat configId: ${this.configId}. Error message: ${error.message}`);
        }
    }

    private createSignature(timestamp: string): string {
        const raw = [this.token, timestamp, this.nonce].sort().join("");
        return SHA1(raw).toString(enc.Hex);
    }

    private getWeChatUrl(signature: string, timestamp: string, openId: string) {
        const queryString = new URLSearchParams();
        queryString.append("orgId", TestSettings.OrgId);
        queryString.append("wechatconfigurationid", this.configId);
        queryString.append("signature", signature);
        queryString.append("timestamp", timestamp);
        queryString.append("nonce", this.nonce);
        queryString.append("openid", openId);

        return `${TestSettings.ApiGatewayUrl}/botchannel/WeChat?${queryString.toString()}`;
    }
}