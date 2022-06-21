import { BrowserContext } from "playwright";

export interface DataMaskingTest {
    name: string;
    UseExpectedDataMaskingRule: (context: BrowserContext) => Promise<void>;
    expectedAgentResult: string[];
    expectedCustomerResult: string[];
}