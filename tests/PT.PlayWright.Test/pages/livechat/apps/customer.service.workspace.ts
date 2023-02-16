import { Page } from "@playwright/test";
import { Notifications } from "../agent/notification.popup";
import { PresenseDialog } from "../agent/presence.dialog";
import { BasePage } from "../../base.page";
import { AgentChatPage } from "../../agent/agent.chat.page";
import { AgentDashboardPage } from "../agent/agent.dashboard.page";

export class CustomerServiceWorkspaceAppsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  public get AgentChatPage(): AgentChatPage {
    return new AgentChatPage(this.page);
  }
  
  public get Notifications(): Notifications {
    return new Notifications(this.page);
  }

  public get AgentDashboardPage(): AgentDashboardPage {
    return new AgentDashboardPage(this.page);
  }

  public async VerifyDashoard(dashboard: string) {
    await this.page.getByText(dashboard).isVisible();
  }
}
