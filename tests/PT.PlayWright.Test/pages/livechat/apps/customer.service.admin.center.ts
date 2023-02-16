import { Page } from "@playwright/test";
import { BasePage } from "../../base.page";
import { WorkSpacesPage } from "../admin/workspace.page";
import { CustomProfilePage } from "../appprofile/custom.profile.page";
import { AgentDashboardPage } from "../agent/agent.dashboard.page";
import { InsightsPage } from "../admin/insights.page";

export class CustomerServiceAdminAppsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  public get WorkSpacesPagePage(): WorkSpacesPage {
    return new WorkSpacesPage(this.page);
  }

  public get CustomProfilePage(): CustomProfilePage {
    return new CustomProfilePage(this.page);
  } 

  public get AgentDashboardPage(): AgentDashboardPage {
    return new AgentDashboardPage(this.page);
  }
  
  public get InsightsPagePage(): InsightsPage {
    return new InsightsPage(this.page);
  }
}
