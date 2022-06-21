import { Constants, SelectorConstants } from "../Utility/Constants";

import { Page } from "playwright";
import { WorkStreamsPage } from "./WorkStreams";

const Selectors = {
  AddNew: "//button[contains(@data-id,'AddNewStandard')]",
  SaveClose: "//button[@data-id='quickCreateSaveAndCloseBtn']",
  ContextVariableDisplayName: "//input[contains(@data-id,'displayname')]",
  ContextVariableDropdown: "//select[@data-id='msdyn_datatype.fieldControl-option-set-select']",
  AddCondition: "//button[@aria-label='Add Condition']",
  Entity: "//button[contains(@id,'MscrmControls.RuleBuilder.RuleBuilderControl-type-ahead-button-type-ahead-control')]",
  EntityValue: "//li[contains(@data-id,'MscrmControls.RuleBuilder.RuleBuilderControl-type-ahead-flyout-clickable-listItem')]/label[contains(text(),'{0}')]",
  Entity2:"(//button[@aria-label='Select Entity'])[2]",
  Attribute: "//button[@aria-label='Select Attribute']",
  Attribute2: "(//button[@aria-label='Select Attribute'])[2]",
  AttributeValue: "//li[contains(@data-id,'MscrmControls.RuleBuilder.RuleBuilderControl-type-ahead-flyout-clickable-listItem')]/label[contains(text(),'{0}')]",
  Operator: "//button[@aria-label='Select Operator']",
  Operator2: "(//button[@aria-label='Select Operator'])[2]",
  OperatorValue: "//li[contains(@data-id,'MscrmControls.RuleBuilder.RuleBuilderControl-type-ahead-flyout-clickable-listItem')]/label[contains(text(),'{0}')]",
  ValueTextbox: "//input[contains(@data-id, 'MscrmControls.RuleBuilder.RuleBuilderControl-textBox')]",
  ValueTextbox2: "//input[@title='Select to enter data']",
}
export enum RoutingRuleConditionEntity {
  "Account" = "Account (Conversation)",
  "Case" = "Case (Conversation)",
  "Contact" = "Contact (Conversation)",
  "ContextVariable" = "Context variable",
  "TeamsEngagementContext" = "Teams Engagement Context (Conversation)",
  "TwitterEngagementContext" = "Twitter Engagement Context (Conversation)",
  "WhatsAppEngagementContext" = "WhatsApp Engagement Context (Conversation)"
}
export enum RoutingRuleConditionAttribute {
  BotHandoffTopic = "BotHandoffTopic",
  RoutingRulequeueTxt = "- Saved",
  RoutingRuleMessage = "test-message",
  RoutingRuleMessage1 = "test-message1",
  CustomerFirstMesssage = "Customer First Message"
}
export enum RoutingRuleConditionOperator {
  Equals = "Equals",
  ContainsData = "Contains Data",
  DoesNotContainData = "Does Not Contain Data"
}

export class RoutingRulePage extends WorkStreamsPage {
  constructor(page: Page) {
    super(page);
  }
  private newRuleData = {
    Name: "TestRule",
    Queue: "Default Queue",
  };

  private newRuleName = `${this.newRuleData.Name}_${new Date().getTime()}`;

  public async createWorkStreamRoutingRule() {
    await this.navigateToAddNewRoutingRule();
    await this.fillandSaveRoutingRule(this.newRuleName);
    await this.waitForDomContentLoaded();
  }

  public async fillRoutingRuleForm(ruleName: string = this.newRuleName, queueName: string = this.newRuleData.Queue) {
    await this.Page.waitForTimeout(Constants.DefaultAverageTimeout);
    await this.fillInputData(SelectorConstants.NameInput, ruleName);
    // Setting routing rules if blank.
    try {
      await this.fillInputData(
        SelectorConstants.RoutingRuleQueueInput,
        queueName
      );
      await this.Page.click(SelectorConstants.RoutingQueueLookupSearch);
      await this.Page.click(
        SelectorConstants.RoutingQueueLookupValue.replace(
          "{0}",
          queueName
        )
      );
    } catch { }
    await this.fillInputData(SelectorConstants.NameInput, ruleName);
    await this.formSaveButton();
    await this.Page.waitForTimeout(Constants.DefaultMinTimeout);
  }

  public async formSaveButton() {
    await this.Page.click(SelectorConstants.FormSaveButton);
    await this.waitForSaveComplete();
  }

  public async navigateToAddNewRoutingRule() {
    await this.waitForDomContentLoaded();
    await this.Page.click(SelectorConstants.RoutingRuleSubGridAddNew);
    await this.Page.waitForTimeout(Constants.DefaultAverageTimeout);
  }

  public async validateNewRoutingRuleAdd() {
    await this.waitForDomContentLoaded();
    const isTestRuleCreated = this.waitTillTextChange(
      SelectorConstants.FormHeaderTitle,
      this.newRuleName
    );
    await this.formSaveAndCloseButton();
    return isTestRuleCreated;
  }

  public async validateWorkStreamOnRoutingPage() {
    await this.waitForDomContentLoaded();
    const currentRoutingRuleWorkStreamName = await this.Page.waitForSelector(
      SelectorConstants.RoutingRuleWorkStreamNameHeader
    );
    const currentName = await currentRoutingRuleWorkStreamName.textContent();
    return this.newWorkStreamName == currentName;
  }

  public async validateConditionEntity(
    conditionType: RoutingRuleConditionEntity
  ) {
    const addCondition = await this.Page.waitForSelector(
      SelectorConstants.AddConditionButton
    );
    await addCondition.click();

    const selectEntity = await this.Page.waitForSelector(
      SelectorConstants.SelectEntity
    );
    await selectEntity.click();

    //Get flyout entity list
    const entityListItem = await this.Page.waitForSelector(
      SelectorConstants.RuleBuilderFlyOutTypeAheadListItem.replace(
        "{0}",
        conditionType
      )
    );
    const entityItemText = await entityListItem.textContent();
    return entityItemText == conditionType;
  }

  public async fillRoutingRule(queue: string) {
    await this.Page.waitForSelector(SelectorConstants.NameInput);
    await this.fillInputData(SelectorConstants.NameInput, this.newRuleName);
    await this.fillInputData(
      SelectorConstants.RoutingRuleQueueInput,
      queue
    );
    await this.Page.click(SelectorConstants.RoutingQueueLookupSearch);
    await this.Page.click(
      SelectorConstants.RoutingQueueLookupValue.replace(
        "{0}",
        queue
      )
    );
    await this.fillInputData(SelectorConstants.NameInput, this.newRuleName);
  }
  
  public async fillandSaveRoutingRule(queue: string) {
    await this.Page.waitForSelector(SelectorConstants.NameInput); 
    await this.fillInputData(SelectorConstants.NameInput, this.newRuleName);
    await this.fillInputData(
      SelectorConstants.RoutingRuleQueueInput,
      queue
    );
    await this.Page.click(SelectorConstants.RoutingQueueLookupSearch);
    await this.Page.click(
      SelectorConstants.RoutingQueueLookupValue.replace(
        "{0}",
        queue
      )
    );
    await this.fillInputData(SelectorConstants.NameInput, this.newRuleName);
    await this.formSaveButton();
    await this.waitForDomContentLoaded();
  }

  public async validateQueueAdded() {
    const title = await this.Page.waitForSelector(
      SelectorConstants.FormHeaderTitle
    );
    const currentTitle = await title.innerText();
    return currentTitle === this.newRuleName;
  }

  public async getQueueCapacity() {
    const locateCapacity = await this.Page.waitForSelector(
      SelectorConstants.QueueCapacity
    );
    const capacity = await locateCapacity.innerText();
    return capacity;
  }

  public async createContextVariable(displayName: string, variableType: string) {
    await this.Page.click(Selectors.AddNew);
    await this.waitForDomContentLoaded();
    await this.Page.waitForSelector(Selectors.SaveClose);
    await this.fillInputData(Selectors.ContextVariableDisplayName, displayName);
    await this.Page.selectOption(Selectors.ContextVariableDropdown, { label: variableType });
    await this.Page.click(Selectors.SaveClose);
  }

  public async addRoutingRuleCondition(contextVariable: string, attributeVariable: string, operatorVariable: string, valueText?: string) {
    await this.waitForDomContentLoaded();
    await this.Page.click(Selectors.AddCondition);
    await this.Page.waitForSelector(Selectors.Entity);
    await this.Page.click(Selectors.Entity);
    await this.Page.click(Selectors.EntityValue.replace(
      "{0}",
      contextVariable
    ));
    await this.Page.waitForSelector(Selectors.Attribute);
    await this.Page.click(Selectors.Attribute);
    await this.Page.click(Selectors.AttributeValue.replace(
      "{0}",
      attributeVariable
    ));
    await this.Page.waitForSelector(Selectors.Operator);
    await this.Page.click(Selectors.Operator);
    await this.Page.click(Selectors.OperatorValue.replace(
      "{0}",
      operatorVariable
    ));
    if (valueText !== null) {
      this.fillInputData(Selectors.ValueTextbox, valueText);
    }
    await this.Page.waitForSelector(SelectorConstants.FormSaveButton);
    await this.Page.click(SelectorConstants.FormSaveButton);
    await this.waitForSaveComplete();
    await this.waitForDomContentLoaded();
  }


  public async addSecondRoutingRuleCondition(contextVariable: string, attributeVariable: string, operatorVariable: string, valueText?: string) {
    await this.waitForDomContentLoaded();
    await this.Page.click(Selectors.AddCondition);
    
    await this.Page.waitForSelector(Selectors.Entity2);
    await this.Page.click(Selectors.Entity2);
    await this.Page.click(Selectors.EntityValue.replace(
      "{0}",
      contextVariable
    ));
    await this.Page.waitForSelector(Selectors.Attribute2);
    await this.Page.click(Selectors.Attribute2);
    await this.Page.click(Selectors.AttributeValue.replace(
      "{0}",
      attributeVariable
    ));
    await this.Page.waitForSelector(Selectors.Operator2);
    await this.Page.click(Selectors.Operator2);
    await this.Page.click(Selectors.OperatorValue.replace(
      "{0}",
      operatorVariable
    ));
    if (valueText !== null) {
      this.fillInputData(Selectors.ValueTextbox2, valueText);
    }
    await this.Page.waitForSelector(SelectorConstants.FormSaveButton);
    await this.Page.click(SelectorConstants.FormSaveButton);
    await this.waitForSaveComplete();
    await this.waitForDomContentLoaded();
  }


  public async fillBotRule(botQueue: string) {
    await this.Page.waitForSelector(SelectorConstants.NameInput);
    await this.fillInputData(SelectorConstants.NameInput, Constants.BotRule);
    await this.fillInputData(
      SelectorConstants.RoutingRuleQueueInput,
      botQueue
    );
    await this.Page.click(SelectorConstants.RoutingQueueLookupSearch);
    await this.Page.click(
      SelectorConstants.RoutingQueueLookupValue.replace(
        "{0}",
        botQueue
      )
    );
    await this.fillInputData(SelectorConstants.NameInput, Constants.BotRule);
    await this.Page.click(SelectorConstants.FormSaveButton);
    await this.waitForSaveComplete();
    await this.waitForDomContentLoaded();
  }

  public async validateNewPage(key: string) {

    let selector = SelectorConstants.NewMessage.replace(
      "{0}",
      key
    )
    const applicationPage = await this.Page.waitForSelector(
      selector
    );
    return applicationPage;
  }
}
