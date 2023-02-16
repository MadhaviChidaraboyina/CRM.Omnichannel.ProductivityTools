import { expect, Locator, Page } from "@playwright/test";
import {
  AgentPresenseStatus,
  ChatConstants,
  PresenceAPI,
} from "../../../utils/livechat/livechat.constants";
import { ResponseStatus } from "../../../utils/app.constants";
import {
  Attributes,
  ElementRoles,
  KeyboardKeys,
} from "../../../utils/test.utils";
import * as selectors from "../../selectors.json";

export class PresenseDialog {
  readonly page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  protected GetCurrentAgentPresenceStatusLocator(): Locator {
    return this.page.locator(selectors.PresencePage.AgentStatus);
  }

  protected GetAgentPresenceDialogMenuButtonLocator(): Locator {
    return this.page.locator(selectors.PresencePage.PresenceDialog);
  }

  public async VerifyAgentPresenseStatusLoaded() {
    return await expect(this.IsAgentPresenseLoaded()).toBeTruthy();
  }

  public async closePage() {
    this.page?.close();
  }

  public async IsAgentPresenseLoaded() {
    if (!(await this.GetCurrentAgentPresenceStatusLocator().isVisible())) {
      const response = await this.page.waitForResponse((resp) =>
        resp.url().includes(PresenceAPI.GetPresence)
      );
      // To load agent presnce, verify if GetAllPresences call is succeeded
      expect(response.status()).toBe(ResponseStatus.Success);
    }
    return await this.GetCurrentAgentPresenceStatusLocator().isVisible();
  }

  public async GetAgentPresenseStatus() {
    let agentCurrentPresenceStatus =
      await this.GetCurrentAgentPresenceStatusLocator().getAttribute(
        Attributes.Title
      );
    return agentCurrentPresenceStatus;

    // return await this.page
    //   .getByRole("menuitem", {
    //     name: `${agentPresenseStatus} Launch presence dialog`,
    //   })
    //   .isVisible();
  }

  public async VerifySetAgentPresenseStatus(
    agentPresenseStatus: AgentPresenseStatus
  ) {
    const isPresenceLoaded = await this.IsAgentPresenseLoaded();
    expect(isPresenceLoaded).toBeTruthy();
    await this.GetAgentPresenceDialogMenuButtonLocator().click();
    const statusComboBox = await this.page.getByRole(ElementRoles.Combobox, {
      name: selectors.PresencePage.PresenceStatusComboBoxName,
    });

    await statusComboBox.selectOption({ label: agentPresenseStatus });
    await this.page
      .getByRole(ElementRoles.Dialog)
      .getByRole(ElementRoles.Button, {
        name: selectors.PresencePage.PresenceStatusDialogOkButtonName,
      })
      .click();

    const responseStatus = await this.page.waitForResponse((resp) =>
      resp.url().includes(PresenceAPI.SetPresence)
    );

    if (responseStatus.status() == ResponseStatus.Success) {
      console.log("setStatus");
      let agentCurrentPresenceStatus =
        await this.GetCurrentAgentPresenceStatusLocator().getAttribute(
          Attributes.Title
        );
      expect(agentCurrentPresenceStatus).toEqual(agentPresenseStatus);
    }
  }

  public async verifyAgentLoginResponse() {
    const isPresenceLoaded = await this.IsAgentPresenseLoaded();
    expect(isPresenceLoaded).toBeTruthy();
    let isPresenceStatusPresent =
      await this.GetCurrentAgentPresenceStatusLocator().isVisible();
    if (!isPresenceStatusPresent) {
      isPresenceStatusPresent = await this.page
        .locator(selectors.PresencePage.HelpLauncher)
        .isVisible();
    }
    console.log(isPresenceStatusPresent);
    expect(isPresenceStatusPresent).toBeTruthy();
  }

  public async GetPresenseStatusAfterSet(presenceState: PresenceAPI) {
    const response = await this.page.waitForResponse((resp) =>
      resp.url().includes(presenceState)
    );

    if (response.status() == ResponseStatus.Success) {
      let agentCurrentPresenceStatus =
        await this.GetCurrentAgentPresenceStatusLocator().getAttribute(
          Attributes.Title
        );
      return agentCurrentPresenceStatus;
    }
  }

  public async AcceptNotificationButtonClick() {
    await this.page.getByRole("button", { name: ChatConstants.Accept }).click();
  }

  public async closeSession1() {
    await this.page
      .frameLocator(selectors.PresencePage.SidePanelIFrame)
      .frameLocator(selectors.PresencePage.iframe)
      .getByRole(ElementRoles.Region, {
        name: ChatConstants.CommunicationPanel,
      })
      .getByRole(ElementRoles.Button, { name: ChatConstants.End })
      .click();

    await this.page.locator(selectors.PresencePage.Visitor1).click();

    await this.page
      .getByRole(ElementRoles.Button, {
        name: ChatConstants.Visitor1,
      })
      .click();
    await this.page
      .getByRole(ElementRoles.Button, { name: ChatConstants.Close })
      .filter({ hasText: ChatConstants.Close })
      .click();
  }

  public async closeSession2() {
    await this.page
      .frameLocator(selectors.PresencePage.SidePanelIFrame)
      .frameLocator(selectors.PresencePage.iframe)
      .getByRole(ElementRoles.Region, {
        name: ChatConstants.CommunicationPanel,
      })
      .getByRole(ElementRoles.Button, { name: ChatConstants.End })
      .click();

    await this.page.locator(selectors.PresencePage.Visitor2).click();
    await this.page
      .getByRole(ElementRoles.Button, {
        name: ChatConstants.Visitor2,
      })
      .click();
    await this.page
      .getByRole(ElementRoles.Button, { name: ChatConstants.Close })
      .filter({ hasText: ChatConstants.Close })
      .click();
  }

  public async validateThePage(Element: string) {
    const element = await this.page.locator(Element);
    if (element) {
      return true;
    }
  }

  public async setCustomPresence(agentPresenseStatus: string) {
    const isPresenceLoaded = await this.IsAgentPresenseLoaded();
    expect(isPresenceLoaded).toBeTruthy();
    await this.GetAgentPresenceDialogMenuButtonLocator().click();
    const statusComboBox = await this.page.getByRole(ElementRoles.Combobox, {
      name: selectors.PresencePage.PresenceStatusComboBoxName,
    });

    await statusComboBox.selectOption({ label: agentPresenseStatus });
    await this.page
      .getByRole(ElementRoles.Dialog)
      .getByRole(ElementRoles.Button, {
        name: selectors.PresencePage.PresenceStatusDialogOkButtonName,
      })
      .click();
  }

  public async openChat() {
    const openchatlocator = this.page.getByRole(ElementRoles.Button, {
      name: ChatConstants.Open,
    });
    if (await openchatlocator.isVisible()) openchatlocator.click();
  }

  public async SendKBarticleLinkToCustomer() {
    await this.page
      .getByRole(ElementRoles.Tab, { name: ChatConstants.SendKbArticle })
      .click();
    await this.page
      .getByPlaceholder(selectors.PresencePage.SearchKBArticles)
      .click();
    await this.page
      .getByPlaceholder(selectors.PresencePage.SearchKBArticles)
      .fill(ChatConstants.All);
    await this.page
      .getByPlaceholder(selectors.PresencePage.SearchKBArticles)
      .press(KeyboardKeys.Enter);
    await this.page
      .locator(selectors.PresencePage.KnowledgeArticle)
      .first()
      .click();
    await this.page
      .getByRole(ElementRoles.Button, { name: ChatConstants.SendURL })
      .click();
  }

  public async openOCAgentDashboard() {
    await this.page
      .getByRole(ElementRoles.Tab, { name: selectors.PresencePage.HomeTab })
      .click();
    await this.page
      .getByRole(ElementRoles.Button, {
        name: selectors.PresencePage.CSAgentDB,
      })
      .click();
    await this.page.getByText(selectors.PresencePage.OCAgentDB).click();
  } 

  public async openOmnichannelDashboard() {
    await this.page
      .getByRole("button", { name: "Customer Service Agent Dashboard" })
      .click();
    await this.page.getByText("Omnichannel Agent Dashboard").click();
    await this.page
      .locator(
        "[data-id='OpenItems_OCStreamControl.OCStreamControl-GridListContainer']"
      )
      .isVisible();
    await this.page.locator("#RefreshDashboard-button").click();
  }

  public async clickOnOpenWorkitem() {
    await this.page.locator("#RefreshDashboard-button").click();
    await this.page
      .getByRole("list", { name: "Open work items" })
      .getByRole("button", { name: "More options" })
      .first()
      .isVisible();
    await this.page
      .getByRole("list", { name: "Open work items" })
      .getByRole("button", { name: "More options" })
      .first()
      .click();
    await this.page.getByText("Assign to me").click();
    await this.page
      .getByText(
        "Work item picked successfully. Work item: Visitor: livechatpick2ws"
      )
      .nth(1)
      .isVisible();
  }


  public async UpdateLocalStorage(key: string, value: string) {
    await this.page.evaluate(
      'window.localStorage.setItem(' + key + ', ' + value + ')'
    );
  }
  
  public async verifyEntityRecord() {
    await this.page.getByLabel("Case Title").isVisible();
  }

  public async verifyShiftClick(ClickCase: any) {
    await this.page.getByRole('grid', { name: selectors.CommonConstants.MyActiveCase }).getByRole('link', { name: ClickCase }).first().click({modifiers: ['Shift']});
    }

  public async verifySmartAssistTabs(){
      await this.page.locator(selectors.CommonConstants.SmartAssistTab).waitFor();
        expect(
          await this.page.isVisible(selectors.CommonConstants.SmartAssistTab)
        ).toBeTruthy();
        await this.page.locator(selectors.CommonConstants.AgentScriptTab).waitFor();
        expect(
          await this.page.isVisible(selectors.CommonConstants.AgentScriptTab)
        ).toBeTruthy();
        await this.page.locator(selectors.CommonConstants.SAKnowledgeSearchTab).waitFor();
        expect(
          await this.page.isVisible(selectors.CommonConstants.SAKnowledgeSearchTab)
        ).toBeTruthy();
         await this.page.getByRole('tab', { name: 'Home' }).click();
    }

    public async verifyControlClick(ClickCase: any) {
      await this.page.getByRole('textbox', { name: selectors.CommonConstants.CaseFilterSearchCWS }).click();
      await this.page.getByRole('textbox', { name: selectors.CommonConstants.CaseFilterSearchCWS }).press('Enter');
      await this.page.getByRole('grid', { name: selectors.CommonConstants.MyActiveCase }).getByRole('link', { name: ClickCase }).first().click({modifiers: ['Control']});
      await this.page.locator(selectors.CommonConstants.FocusedTab).waitFor();
      await this.page.waitForTimeout(5000);  // Timeout required to load the page
        const tabTitle = await this.page
          .locator(selectors.CommonConstants.FocusedTabText)
          .textContent();
        expect(tabTitle).toContain("Automation Case");
     }

     public async LinkAndUnlinkCase(ClickLinkBtn: string) {
      await this.page.getByRole('link', { name: selectors.CommonConstants.AutomationCase, exact: true }).first().click();
       await this.page.waitForSelector(ClickLinkBtn);
       await this.page.locator(ClickLinkBtn).click();
    }

    public async OpenSuggessionCase() {
      await this.page.locator(selectors.CommonConstants.RelatedTab).click();
      await this.page.getByText(selectors.CommonConstants.Connections).click();
    }

    public async  DeleteAssociatedRecord() {
      await this.page.getByRole('gridcell', { name: selectors.CommonConstants.SelectTheCase}).click();
      await this.page.getByRole('gridcell', { name: selectors.CommonConstants.SelectTheCase}).click();
      await this.page.getByRole('gridcell', { name: selectors.CommonConstants.SelectTheCase}).click();
      await this.page.getByRole('menuitem', { name: selectors.CommonConstants.MoreOption }).click();
      await this.page.getByRole('menuitem', { name: selectors.CommonConstants.DeleteTheConnectionBtn}).click();
      await this.page.locator(selectors.CommonConstants.DeleteBtnConfirmation).click();
      await this.page.getByRole('menuitem', { name: selectors.CommonConstants.Save}).click();
      await this.page.getByRole('menubar', { name: selectors.CommonConstants.CommandsofMenubar, exact: true }).getByRole('menuitem', { name: selectors.CommonConstants.RefreshBtnMenu}).click();
    }
}
    

