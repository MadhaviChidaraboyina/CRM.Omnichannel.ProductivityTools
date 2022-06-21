import { AgentConversationPage } from "../pages/agent-conversation.page";
import { BrowserContext } from "playwright";
import { OmnichannelForCustomerPage } from "../pages/omnichannel-for-customer.page";
import { channels } from "../Utility/Constants";

export interface TestChannel {
    ChannelName: channels;
    testCaseNumber: string;
    StartConversationAndSendMessages: (
        messages: string[],
        omnichannelAgent: OmnichannelForCustomerPage,
        customerContext: BrowserContext,
        agentConversation: AgentConversationPage) => Promise<void>;
}