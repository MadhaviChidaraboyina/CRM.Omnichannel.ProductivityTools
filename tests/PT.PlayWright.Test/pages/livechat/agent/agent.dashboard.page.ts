import { Page } from "@playwright/test";
import * as selectors from "../../selectors.json";
import { ElementRoles } from "../../../utils/test.utils";
import {
  AppProfileConstants,
  EntityNames,
  EntityAttributes,
  CustomerServiceAgentConstants,
  agentchatconstants
} from "../../../utils/app.constants";
import { LoadState } from "../../../utils/test.utils";

export class AgentDashboardPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
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

  public async AddQueueToExistingCases(queueName: string, caseName: string) {
    await this.page.locator(selectors.CommonConstants.SearchCase).click();
    await this.page
      .locator(selectors.CommonConstants.SearchCase)
      .fill(caseName);
    await this.page
      .locator(selectors.CommonConstants.SearchCaseArrow)
      .click();
    await this.page
      .locator(selectors.CommonConstants.SearchCaseCheckbox)
      .getByTitle(selectors.CommonConstants.SelectAll)
      .click();
    await this.page
      .getByRole("menuitem", { name: selectors.CommonConstants.MoreCommandsForCase })
      .click();
    await this.page.getByRole("menuitem", { name: selectors.CommonConstants.AddToQueue }).click();
    await this.page.getByRole("combobox", { name: selectors.CommonConstants.QueueLookup }).click();
    await this.page.getByPlaceholder(selectors.CommonConstants.LookForQueue).fill(queueName);
    await this.page.getByRole("treeitem", { name: queueName }).click();
    await this.page.getByRole("button", { name: selectors.CommonConstants.Add }).click();
  }

  public async OpenCasesLinkedToQueue(queueName: string) {
    await this.page.getByRole("button", { name: selectors.CommonConstants.SiteMap }).click();
    await this.page
      .getByRole("treeitem", { name: selectors.CommonConstants.Queues })
      .locator("div")
      .nth(3)
      .click();
    await this.page
      .getByRole("heading", { name: selectors.CommonConstants.ItemsWorkingOn })
      .getByRole("button", { name: selectors.CommonConstants.ItemsWorkingOn })
      .click();
    await this.page.getByRole("menuitemradio", { name: selectors.CommonConstants.AllItems }).click();
    await this.page
      .getByRole("combobox", { name: selectors.CommonConstants.SelectQueueFilter })
      .click();
    await this.page
      .getByRole("combobox", { name: selectors.CommonConstants.SelectQueueFilter })
      .fill(queueName);
    await this.page.getByRole("option", { name: queueName }).click();
  }

  public async executeScript(script: string) {
    return await this.page.evaluate((scr) => {
      return eval(scr);
    }, script);
  }

  public async createRecord(entityLogicalName: string, data: any) {
    return await this.executeScript(
      `Xrm.WebApi.createRecord('${entityLogicalName}', ${JSON.stringify(data)})`
    );
  }

  public async createContactRecord(lastName: string) {
    return await this.createRecord(EntityNames.Contact, {
      [EntityAttributes.Lastname]: lastName,
    });
  }

  public async createIncidentRecord(
    casetitle: string,
    customerRecordId: string,
    customerEntityType: string
  ) {
    let createRequestObj: { [key: string]: any } = { title: casetitle };
    if (customerEntityType === EntityNames.Account) {
      createRequestObj[EntityAttributes.IncidentAccountBindAttribute] =
        "/accounts(" + customerRecordId.toUpperCase() + ")";
    } else if (customerEntityType === EntityNames.Contact) {
      createRequestObj[EntityAttributes.IncidentContactBindAttribute] =
        "/contacts(" + customerRecordId.toUpperCase() + ")";
    }
    return await this.createRecord(EntityNames.Incident, createRequestObj);
  }

  public async createIncidents(caseNameList: string[]) {
    let contact = await this.createContactRecord(
      selectors.CommonConstants.AutomationContact
    );
    var count = caseNameList.length;
    for (let i = 0; i < count; i++) {
      await this.createIncidentRecord(
        caseNameList[i],
        contact[EntityAttributes.Id],
        EntityNames.Contact
      );
    }
  }

  public async InitiateSessionUsingCodegen(InitiateOne: string) {
    await this.page.getByRole('textbox', { name: 'Case Filter by keyword' }).click();
    await this.page.getByRole('textbox', { name: 'Case Filter by keyword' }).fill(InitiateOne);
    await this.page.getByRole('textbox', { name: 'Case Filter by keyword' }).press('Enter');
    await this.page.getByRole('link', { name: InitiateOne }).click();
  }

  public async runMacroInSessionAndValidateUsingCodegen(
    agentScriptName: string,
    entitylisttitle: string
  ) {
    await this.page.getByRole('tab', { name: 'Agent scripts' }).click();
    await this.page.getByRole('combobox', { name: 'Select Agent Script' }).selectOption(agentScriptName);
    await this.page.getByRole('button', { name: '' }).click();
    // Added constants.five as of now to wait for selector to load
    await this.page.locator(entitylisttitle).waitFor();
    const PageValidate = await this.page.isVisible(entitylisttitle);
    return PageValidate;
  }  

  public async InitiateSessionUsingLink(InitiateOne: string,Link: string) {
    await this.page.locator(selectors.CommonConstants.SearchCaseOption).waitFor();
    await this.page.locator(selectors.CommonConstants.SearchCaseOption).click();
    await this.page.fill(selectors.CommonConstants.SearchCaseOption, InitiateOne);
    await this.page.waitForSelector(selectors.CommonConstants.SearchTheView);
    await this.page.click(selectors.CommonConstants.SearchTheView);
    await this.page.locator(Link).click();
  }

  public async LinkAction() {
    await this.page
      .locator(selectors.CustomerServiceWorkspace.ClickLinkcase)
      .click();
    await this.page.waitForLoadState(LoadState.DomContentLoaded);   
  }

  public async ClickSaveCase() {
    await this.page
      .locator(selectors.CustomerServiceWorkspace.ClickSaveCase)
      .click();
    await this.page.waitForLoadState(LoadState.DomContentLoaded);   
  }

  public async NavigateToDetailsTab() {
    await this.page
      .getByRole(ElementRoles.Tab, { name: CustomerServiceAgentConstants.Details })
      .click();
    await this.page.waitForLoadState(LoadState.DomContentLoaded);   
  }

  public async ValidateHome() {
    await this.page
      .locator(agentchatconstants.HomeButton).isVisible();
    await this.page.waitForLoadState(LoadState.DomContentLoaded);   
  }
}
