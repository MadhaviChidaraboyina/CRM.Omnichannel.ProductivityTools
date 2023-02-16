
export type user = {
    userName: string;
    password: string;
};

export type orgSettings = {
    orgUrl: string;
    tenantId: string;
    clientId: string;
    orgUniqueName: string;
};

export type loginSettings = {
    adminUser: user;
    agentUser: user;
    orgSetting: orgSettings;
    serverAddress: string;
    environmentType: environmentType;
};

/**
* Different environment types.
*/
export enum environmentType {
    OnPrem = "onprem",
    Online = "online",
};