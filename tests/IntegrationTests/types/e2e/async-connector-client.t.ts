export interface AsyncConnectorClient {
    send(payload: string): Promise<boolean>;
}