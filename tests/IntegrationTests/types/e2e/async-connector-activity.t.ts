import { OCCustomer } from "../../models/oc-customer.t";
import { Extension } from "./attachment-extension.t";

export interface AsyncConnectorActivity {
    build(): string;
    useMessage(msg: string): AsyncConnectorActivity;
    useCustomer(customer: OCCustomer): AsyncConnectorActivity;
    useAttachment(extension: Extension): AsyncConnectorActivity;
}