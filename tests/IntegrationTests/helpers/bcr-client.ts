import * as axios from "axios";
import { Util } from "../Utility/Util";
import { KeyVaultClient } from "./key-vault-client";

interface BCRTokenResponse {
    access_token: string;
    ext_expires_in: number;
    expires_in: number;
    token_type: string;
}

interface BCRToken {
    access_token: string;
    expires_in: number;
    recieved_at: Date;
}

export class BCRClient {
    private static readonly AUTH_URL = "https://login.microsoftonline.com/botframework.com/oauth2/v2.0/token";
    private static instance = new BCRClient();
    private axios = axios.default;
    private accessTokens: Map<string, BCRToken>;
    private bcrSecrets: Map<string, string>;

    private constructor() {
        this.accessTokens = new Map<string, BCRToken>();
        this.bcrSecrets = new Map<string, string>();
    }

    public static getInstance() {
        return this.instance;
    }

    public async getToken(clientId: string, clientSecret: string = null) {
        if (this.accessTokens.has(clientId) && !this.tokenExpired(this.accessTokens.get(clientId))) {
            return this.accessTokens.get(clientId).access_token;
        }

        const tokenObj = await this.acquireToken(clientId, Util.isNullOrEmptyString(clientSecret) ? await this.getSecret(clientId) : clientSecret);
        this.accessTokens.set(clientId, tokenObj);
        return tokenObj.access_token;
    }

    public async getSecret(clientId: string) {
        if (this.bcrSecrets.has(clientId))
            return this.bcrSecrets.get(clientId);

        const clientSecret = await KeyVaultClient.getInstance().getSecret(`automation-bcr-${clientId}`);
        this.bcrSecrets.set(clientId, clientSecret);
        return clientSecret;
    }

    private async acquireToken(clientId: string, clientSecret: string): Promise<BCRToken> {
        try {
            const requestBody = `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}&scope=https%3A%2F%2Fapi.botframework.com%2F.default`;
            const response = await this.axios.post<BCRTokenResponse>(BCRClient.AUTH_URL, requestBody, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            })

            if (response.status !== 200) {
                throw new Error(`Token request failed. Status: ${response.statusText}`);
            }

            return {
                access_token: response.data.access_token,
                expires_in: response.data.expires_in,
                recieved_at: new Date()
            }
        }
        catch (error) {
            throw new Error(`Cannot obtain access token for BCR: ${clientId}. Inner exception: ${error.message}`);
        }
    }

    private tokenExpired(token: BCRToken) {
        const elapsed = ((new Date().getTime() - token.recieved_at.getTime()) / 1000) + 5;
        return elapsed > token.expires_in;
    }
}