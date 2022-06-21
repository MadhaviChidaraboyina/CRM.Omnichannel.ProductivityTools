import { TestSettings } from "../../../configuration/test-settings";
import { AppleHelper } from "../../../helpers/apple-helper";
import { AsyncConnectorClient } from "../../../types/e2e/async-connector-client.t";
import { AsyncConnectorError } from "../../../exceptions/async-connector-exception";
import * as axios from "axios";
import { Util } from "../../../Utility/Util";
import * as CryptoJS from "crypto-js";
import pako from "pako";
import base64url from "base64url";

export class AppleClient implements AsyncConnectorClient {
    private readonly appleAppUrl = `${TestSettings.ApiGatewayUrl}/applemessagesforbusiness/message`;
    private readonly axiosDefault = axios.default;
    private readonly header = { "alg": "HS256" };
    private readonly destinationId: string;
    private readonly mspId: string;

    constructor(destinationId: string, mspId: string) {
        this.destinationId = destinationId;
        this.mspId = mspId;
    }

    public async send(payload: string): Promise<boolean> {
        const apiPassphrase = await AppleHelper.getInstance().getMspSecretPassphrase(this.mspId);
        const jwtToken = this.generateInboundToken(this.mspId, apiPassphrase);
        const gzipBody = pako.gzip(payload);

        const payloadObj = JSON.parse(payload);
        try {
            const response = await this.axiosDefault.post(this.appleAppUrl, gzipBody, {
                headers: {
                    "Authorization": `Bearer ${jwtToken}`,
                    "Destination-Id": this.destinationId,
                    "Source-Id": payloadObj.SourceId,
                    "Id": payloadObj.Id,
                    "Content-Encoding": "gzip",
                    'Content-Type': 'application/json',
                    "CapabilityList": ""
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
            throw new Error(`Apple message failed`);
        }
    }

    private generateInboundToken(mspId: string, apiPassphrase: string) {
        const headerPart = base64url(JSON.stringify(this.header));
        const payload = {
            "iat": Math.floor(Date.now() / 1000),
            "aud": mspId
        };

        return this.GenerateToken(headerPart, payload, apiPassphrase);
    }

    private GenerateToken(headerPart: string, payload: object, apiPassphrase: string) {
        const payloadPart = base64url(JSON.stringify(payload));
        const token = `${headerPart}.${payloadPart}`;

        const secret = CryptoJS.enc.Base64.parse(apiPassphrase);
        const resp = CryptoJS.HmacSHA256(token, secret);
        const signature = CryptoJS.enc.Base64.stringify(resp);
        const hash = base64url.fromBase64(signature);

        return `${headerPart}.${payloadPart}.${hash}`;
    }

}