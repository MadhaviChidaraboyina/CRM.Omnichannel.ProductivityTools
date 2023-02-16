import { expect, Page } from "@playwright/test";
import { agentchatconstants } from "../../../utils/app.constants";
import { ElementRoles } from "../../../utils/test.utils";

export class ChatConversationControl {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }
  private ContactData = {
    ContactName: "Junior",
    ContactLastName: "Sheldon",
  };
  private CustomerFullName = "";
  private CustomerConversationName = "";

  public async AcceptChat() {
    await this.page.waitForSelector(`#popupNotificationRoot`);
    await this.page.getByRole("button", { name: "Accept" }).click();
  }

  public async IsPopupNotificationRootAvailable() {
    return await this.page.locator(`#popupNotificationRoot`).isVisible();
  }

  public async EndChat() {
    await this.page
      .frameLocator("#SidePanelIFrame")
      .frameLocator("iframe")
      .getByRole("button", { name: "End" })
      .click();
  }

  public async ClickOnHomeTab() {
    await this.page.getByAltText("3 new updates").first().click();
  }

  public async ImageClick() {
    await this.page
      .locator(
        'img[src="data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20version%3D%221.1%22%20width%3D%2232%22%20height%3D%2232%22%20id%3D%22SESSION_ID%22%3E%3Cg%20id%3D%22sentiment-overlay-container%22%2F%3E%3Cg%20id%3D%22unread-activity-container%22%3E%3Cg%20id%3D%22unread-activity%22%3E%3Ccircle%20id%3D%22unread-circle%22%20cx%3D%2215%22%20cy%3D%2215%22%20r%3D%2210%22%20fill%3D%22%23006dd1%22%2F%3E%3Ctext%20id%3D%22unread-value%22%20x%3D%2215%22%20y%3D%2219%22%20font-size%3D%2212px%22%20font-family%3D%22Segoe%20UI%22%20font-weight%3D%22semibold%22%20font-style%3D%22normal%22%20letter-spacing%3D%220%22%20text-anchor%3D%22middle%22%20fill%3D%22%23FFF%22%3E9%2B%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E"]'
      )
      .click();
  }

  public async VerifyChatCountUpdates() {
    await this.page.getByAltText("3 new updates").first().click();
  }

  public async validateCountOfUnreadMessages(Count: any) {
    try {
      if (Count < 10) {
        await this.page.locator(
          `img[src*='middle%22%20fill%3D%22%23FFF%22%3E${Count}%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E']`
        );
      } else {
        await this.page.locator(
          "img[src*='middle%22%20fill%3D%22%23FFF%22%3E%2B%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E']"
        );
      }
      return true;
    } catch {
      return false;
    }
  }

  public async VerifyLiveChatIsActive() {
    await this.page.locator("#RefreshDashboard-button").click();

    let isChatVisible = await this.page
      .locator('span[role="presentation"]:has-text("Open")')
      .first()
      .isVisible(); 
    await this.RefreshAllTab();
    await this.page.waitForTimeout(2000);
    console.log("checking no chat is open/Active");
    await this.page.waitForSelector("#ocGridContainerLiveRegion");

    //const count: any = await this.getGridCount();
    // expect(count == actualCount + 1).toBeTruthy(); // await expect(
    //   this.page.getByRole("gridcell", { name: "Live chat" }).isVisible()
    // ).toBeFalsy();
  }

  public async OmnichannelOngoingDashboardClick() {
    await this.page.getByRole("tab", { name: "Home" }).click();
    await this.page
      .getByRole("tab", { name: "Omnichannel Ongoing Conversations Dashboard" })
      .click();
  }

  public async LiveChatClickOnGrid() {
    await this.page.locator("#RefreshDashboard-button").click();
    await this.page
      .getByRole("gridcell", { name: "Live chat" })
      .first()
      .click();
  }

  public async verifyChatInOpenState() {
    await this.page.locator("#RefreshDashboard-button").click();
    await this.page
      .getByRole("gridcell", { name: "Open Open" })
      .getByText("Open")
      .first()
      .isVisible();

    await this.RefreshAllTab();
    await this.page.waitForTimeout(2000);
    console.log("checking no chat is open/Active");
    await this.page.waitForSelector("#ocGridContainerLiveRegion");

    //const count: any = await this.getGridCount();
    // expect(count == actualCount + 1).toBeTruthy(); // await expect(
    //   this.page.getByRole("gridcell", { name: "Live chat" }).isVisible()
    // ).toBeFalsy();
  }

  public async getGridCount() {
    await this.page.locator(
      "div[class='customControl MscrmControls Grid.GridControl MscrmControls.Grid.GridControl']"
    );
    await this.page.locator("//div[@data-row-count]");
    const count: any = await this.page.$eval("//div[@data-row-count]", (el) =>
      el.getAttribute("data-row-count")
    );
    if (parseInt(count) > 0) {
      const title = await this.page.locator(
        "//*[@class='wj-row']//div[@data-id='cell-0-4']"
      );
      const queueName = await title.innerText();
      console.log(queueName);
      expect(queueName === "CustomerSummaryQueue").toBeTruthy();
    }
  }

  public async RefreshAllTab() {
    const refreshbotton = await this.page.locator(
      "//*[@data-id='RefreshDashboard']"
    );
    await refreshbotton.click();
  }

  public async verifyChatIsFlushedOut() {
    await this.page.locator("#RefreshDashboard-button").click();
    const isOpenItemVisible = await this.page
      .getByRole("gridcell", { name: "Open Open" })
      .getByText("Open")
      .first()
      .isVisible();
    expect(isOpenItemVisible).toBeFalsy();
  }

  public async CickOnDontCloseButton() {
    await this.page.getByRole("button", { name: "Customer summary" }).click();

    await this.page
      .getByRole("button", {
        name: "Press Enter to close the session Visitor 1",
      })
      .click();

    await this.page.getByRole("button", { name: "Don’t close" }).click();
  }

  public async CloseSession(visitor: string) {
    await this.page.locator('span:has-text("' + visitor + '")').click();

    await this.page
      .frameLocator("#SidePanelIFrame")
      .frameLocator("iframe")
      .getByRole("button", { name: "End" })
      .click();

    await this.page
      .getByRole("button", {
        name: "Press Enter to close the session " + visitor,
      })
      .click();
    await this.page
      .getByRole("button", { name: "Close" })
      .filter({ hasText: "Close" })
      .click();
  }
  public async MinimizeConversation() {
    await this.waitForDomContentLoaded();
    const collapse = await this.page.locator(
      agentchatconstants.MinimizeConversation
    );
    await collapse.click();
  }
  public async waitForDomContentLoaded() {
    await this.page.waitForLoadState("domcontentloaded");
  }

  public async HomeSession() {
    const homeButton = await this.page.locator(agentchatconstants.HomeButton);
    await homeButton.click();
    await this.waitForDomContentLoaded();
  }

  public async VerifyCustomerNameInsummaryForm() {
    await this.waitForDomContentLoaded();
    const customerSummaryNameselector = await this.page.locator(
      agentchatconstants.CustomerSummaryRecordName
    );
    const customerSummaryName = await customerSummaryNameselector.textContent();
    await expect(customerSummaryNameselector).toContainText("Junior");
    console.log("Contact name verification Successful");
  }

  public async CreateNewContactRecord() {
    await this.page
      .getByRole(ElementRoles.Button, {
        name: agentchatconstants.CreateNewContactBtn,
      })
      .click();
    const name = `${this.ContactData.ContactName}_${new Date().getTime()}`;
    this.CustomerFullName = name;
    await this.page.getByLabel(agentchatconstants.CustomerFirstName).fill(name);
    await this.page
      .getByLabel(agentchatconstants.CustomerLasttName)
      .fill(this.ContactData.ContactLastName);
    this.CustomerConversationName =
      name + " " + this.ContactData.ContactLastName;
    await this.page
      .getByRole(ElementRoles.MenuItem, { name: agentchatconstants.SaveBtn })
      .click();
    await this.page.waitForLoadState("domcontentloaded");
  }

  public async verifyConversationSummaryViewSectionIsPresent() {
    try {
      await this.page.locator(agentchatconstants.ConversationSummery);
      return true;
    } catch {
      return false;
    }
  }

  public async closeOCAgentChatSession() {
    await this.page
      .frameLocator("#SidePanelIFrame")
      .frameLocator("iframe")
      .getByRole("button", { name: "End" })
      .click();
    await this.page
      .getByRole("button", {
        name: "Press Enter to close the session " + "Visitor 1",
      })
      .click();
    await this.page
      .getByRole("button", { name: "Close" })
      .filter({ hasText: "Close" })
      .click();
  }
}
