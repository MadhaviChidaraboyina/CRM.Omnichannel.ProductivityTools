import { KeyVaultClient } from "./key-vault-client";
import { Constants } from "../Utility/Constants";

export class AppleHelper {
    private static instance = new AppleHelper();

    public static getInstance() {
        return this.instance;
    }

    public async getMspSecretPassphrase(mspId: string) {
        const secretName = this.constructPrimaryMspSecretName(mspId);
        const mspSecretPassphrase = await KeyVaultClient.getInstance().getSecret(secretName);
        return mspSecretPassphrase;
    }

    private constructPrimaryMspSecretName(mspId: string) {
        return `${mspId}-${Constants.AppleMessagesForBusinessPrimary}-${Constants.AppleMessagesForBusinessMspSecretPassphrase}`;
    }

}