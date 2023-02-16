import { Page } from "@playwright/test";
import { AgentDashboardPage } from "../livechat/agent/agent.dashboard.page";
import { ChatConversationControl } from "../livechat/agent/chat.conversation.control";
import { Notifications } from "../livechat/agent/notification.popup";
import { PresenseDialog } from "../livechat/agent/presence.dialog";

export class AgentChatPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  public get Notifications(): Notifications {
    return new Notifications(this.page);
  }

  public get PresenseDialog(): PresenseDialog {
    return new PresenseDialog(this.page);
  }

  public get ChatConversationControl(): ChatConversationControl {
    return new ChatConversationControl(this.page);
  }
}
