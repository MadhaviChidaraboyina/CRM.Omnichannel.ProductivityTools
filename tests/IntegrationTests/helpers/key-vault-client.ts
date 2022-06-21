import { ClientSecretCredential } from "@azure/identity";
import { SecretClient } from "@azure/keyvault-secrets";
import { TestSettings } from "../configuration/test-settings";

export interface ClientOptions {
    keyVaultUrl: string;
    tenantId: string;
    applicationClientId: string;
    applicationClientSecret: string;
}

export class KeyVaultClient {
    private static instance = new KeyVaultClient();
    private readonly defaultClient: SecretClient;

    constructor() {
        this.defaultClient = new SecretClient(TestSettings.KeyVaultURL, new ClientSecretCredential(TestSettings.AzureADTenantId, TestSettings.ApplicationClientId, TestSettings.ApplicationClientSecret));
    }

    public static getInstance() {
        return this.instance;
    }

    public async getSecret(secretName: string, clientOptions: ClientOptions = null) {
        let client: SecretClient;

        if (!clientOptions) {
            client = this.defaultClient;
        }
        else {
            const { tenantId, applicationClientId, applicationClientSecret, keyVaultUrl } = clientOptions;
            const credential = new ClientSecretCredential(tenantId, applicationClientId, applicationClientSecret);
            client = new SecretClient(keyVaultUrl, credential);
        }

        return this.requestSecret(client, secretName);
    }

    private async requestSecret(keyVaultClient: SecretClient, secretName: string) {
        try {
            const keyVaultSecret = await keyVaultClient.getSecret(secretName);
            if (!keyVaultSecret.value) {
                throw new Error(`Secret: ${secretName} is empty`);
            }

            return keyVaultSecret.value;
        }
        catch (error) {
            throw new Error(`Cannot obtain secret value for secret name: ${secretName} from vault: ${keyVaultClient.vaultUrl}`);
        }
    }
}