import { IFrameConstants, MacrosConstants } from "../../../pages/Macros";
import { BasePage } from "../../../pages/BasePage";
import { Constants } from "../../common/constants";
import { Iframe } from "../../../pages/Iframe";
import { Page } from "playwright";
import { SelectorConstants } from "../../../Utility/Constants";
import { OrgDynamicsCrmStartPage } from "../../../pages/org-dynamics-crm-start.page";

export class AgentScript extends BasePage {
  adminPage: any;
  constant: any;
  basepage: any;
  constructor(page: Page) {
    super(page);
    this.adminPage = page;
    this.basepage = new BasePage(this.adminPage);
  }

  public async createSessionTemplate() {
    await this.adminPage.click(Constants.SessionsSitemapOCBtn);
    try {
      await this.adminPage.waitForSelector(Constants.SessionTemplate, { timeout: 3000 });
    }
    catch {
      await this.adminPage.click(Constants.NewButton);
      await this.adminPage.fill(Constants.NameField, Constants.SessionTemplateName);
      await this.adminPage.fill(Constants.UniqueNameField, Constants.SessionTemplateUniqueName);
      await this.adminPage.click(Constants.EntityField);
      await this.adminPage.click(Constants.CaseEntity);
      await this.adminPage.click(Constants.SaveAndCloseButton);
    }
  }

  public async createGenericSessionTemplate(adminPage) {
    let rnd: any;
    rnd = this.RandomNumber();
    await this.adminPage.click(Constants.sessionTemplateLable);
    try {
      await this.adminPage.waitForSelector(Constants.SessionTemplate, { timeout: 3000 });
    }
    catch {
      await this.adminPage.click(Constants.NewButton);
      await this.adminPage.fill(Constants.NameField, Constants.SessionTemplateName);
      await this.adminPage.fill(Constants.UniqueNameField, Constants.SessionTemplateUniqueName + rnd);
      await this.adminPage.selectOption(Constants.TypeField, { label: 'Generic' });
      await this.adminPage.click(Constants.AnchorTabSearchBox);
      await this.adminPage.click(Constants.AnchorTabSearchIcon);
      await this.adminPage.click(Constants.AnchorTabSearchResult);
      await this.adminPage.click(Constants.SaveAndCloseButton);
    }
  }

  public async createSessionTemplateWithApplicationTemplate(applicationTemplate: string) {
    await this.adminPage.click(Constants.SessionsSitemapOCBtn);
    try {
      await this.adminPage.waitForSelector(Constants.SessionTemplate, { timeout: 3000 });
    }
    catch {
      await this.adminPage.click(Constants.NewButton);
      await this.adminPage.fill(Constants.NameField, Constants.SessionTemplateName);
      await this.adminPage.fill(Constants.UniqueNameField, Constants.SessionTemplateUniqueName);
      await this.adminPage.selectOption(Constants.TypeField, { label: 'Generic' });
      await this.adminPage.click(Constants.AnchorTabSearchBox);
      await this.adminPage.fill(Constants.AnchorTabInputBox, applicationTemplate);
      await this.adminPage.click(Constants.AnchorTabSearchIcon);
      await this.adminPage.click(Constants.AnchorTabLookupValue.replace("{0}", applicationTemplate));
      await this.adminPage.click(Constants.SaveAndCloseButton);
    }
  }

  public async verifySessionTemplate(sessionTemplate: string) {
    await this.adminPage.click(Constants.SessionsSitemapOCBtn);
    try {
      await this.adminPage.waitForSelector(Constants.SessionTemplate, { timeout: 3000 });
    }
    catch {
      await this.adminPage.fill(SelectorConstants.QuicksearchSMS, sessionTemplate);
      await this.adminPage.waitForSelector(SelectorConstants.QuicksearchSMSbutton, 2, this.adminPage, Constants.MaxTimeout);
      await this.adminPage.click(SelectorConstants.QuicksearchSMSbutton);
      //await this.adminPage.waitForTimeout(1000);
      const actualTemplateName = await this.adminPage.waitForSelector(SelectorConstants.GridViewFirstRowSecondCell)
      expect(await actualTemplateName.innerText()).toEqual(sessionTemplate);
    }
  }

  public RandomNumber() {
    var minm = 100;
    var maxm = 999;
    return Math.floor(Math.random() * (maxm - minm + 1)) + minm;
  }

  public async createAgentScript(AgentScriptName: any, AgentScriptUniqueName: any) {
    let rnd: any;
    rnd = this.RandomNumber();
    await this.adminPage.waitForSelector(Constants.AgentScriptlabel);
    await this.adminPage.click(Constants.AgentScriptlabel);
    try {
      await this.adminPage.waitForSelector(`//*[@title="` + AgentScriptName + `"]`, { timeout: 3000 });
    }
    catch {
      await this.adminPage.click(Constants.NewButton);
      await this.adminPage.fill(Constants.NameField, AgentScriptName);
      await this.adminPage.fill(Constants.UniqueNameField, AgentScriptUniqueName + rnd);
      await this.adminPage.click(Constants.SaveAndCloseButton);
    }
  }

  public async addOdataConditionForExpressionBuilder() {
    const parentIframe: Page = await Iframe.GetIframe(
      this.adminPage,
      IFrameConstants.BuildExpressionParentIframe
    );
    const iframe: Page = await Iframe.GetChildIframeByParentIframe(
      this.adminPage,
      IFrameConstants.BuildExpressionParentIframe
    );
    const builtInTab = await iframe.waitForSelector(MacrosConstants.BuiltInTab);
    await iframe.$eval(MacrosConstants.BuiltInTab, (el) => {
      (el as HTMLElement).click();
    });
    await iframe.$eval(MacrosConstants.ControlCondition, (el) => {
      (el as HTMLElement).click();
    });
    const chooseName = await iframe.waitForSelector(
      MacrosConstants.DataEditorName
    );
    await chooseName.fill(Constants.ExpressionBuilderODataQuery);

    await iframe.$eval(MacrosConstants.ConditionOperatorSelector, (el) => {
      (el as HTMLElement).click();
    });
    await this.basepage.waitUntilSelectorIsVisible(MacrosConstants.ConditionOperatorValueSelector, Constants.Five, iframe, Constants.MaxTimeout);
    await iframe.$eval(MacrosConstants.ConditionOperatorValueSelector, (el) => {
      (el as HTMLElement).click();
    });

    const chooseValue = await iframe.waitForSelector(
      MacrosConstants.DataEditorValue
    );
    await chooseValue.fill("");
    await chooseValue.fill(Constants.ExpressionBuilderODataQuery);
    await iframe.$eval(MacrosConstants.SelectRowSelector, (el) => {
      (el as HTMLElement).click();
    })
    await iframe.$eval(MacrosConstants.AppTextSelector, (el) => {
      (el as HTMLElement).click();
    });
    await iframe.$eval(MacrosConstants.GroupTypeSelector, (el) => {
      (el as HTMLElement).click();
    });
    await iframe.$eval(MacrosConstants.FalseConditionSelector, (el) => {
      (el as HTMLElement).click();
    });
    await iframe.$eval(MacrosConstants.AddanAction, (el) => {
      (el as HTMLElement).click();
    });
    await this.basepage.waitUntilSelectorIsVisible(MacrosConstants.CustomerServiceSelector, MacrosConstants.Three, iframe, Constants.OpenWsWaitTimeout);
    await iframe.$eval(MacrosConstants.CustomerServiceSelector, (el) => {
      (el as HTMLElement).click();
    });
    await iframe.waitForSelector(MacrosConstants.SelectDefaultScriptSelector);
    await iframe.$eval(MacrosConstants.SelectDefaultScriptSelector, (el) => {
      (el as HTMLElement).click();
    });
    await this.basepage.waitUntilSelectorIsVisible(MacrosConstants.ShowOptionSelector, MacrosConstants.Three, iframe, Constants.OpenWsWaitTimeout);
    await iframe.$eval(MacrosConstants.ShowOptionSelector, (el) => {
      (el as HTMLElement).focus();
    });
    await iframe.$eval(MacrosConstants.ShowOptionSelector, (el) => {
      (el as HTMLElement).click();
    });
    await this.basepage.waitUntilSelectorIsVisible(MacrosConstants.TextSelector.replace("{0}", Constants.AgentScriptName), MacrosConstants.Three, iframe);
    await iframe.$eval(MacrosConstants.TextSelector.replace("{0}", Constants.AgentScriptName), (el) => {
      (el as HTMLElement).click();
    });
    await iframe.$eval(MacrosConstants.TrueConditionSelector, (el) => {
      (el as HTMLElement).click();
    });
    await iframe.$eval(MacrosConstants.FalseConditionSelector, (el) => {
      (el as HTMLElement).click();
    });
    await this.basepage.waitUntilSelectorIsVisible(MacrosConstants.AddanAction, MacrosConstants.Three, iframe);
    await iframe.$eval(MacrosConstants.AddanAction, (el) => {
      (el as HTMLElement).click();
    });
    await this.basepage.waitUntilSelectorIsVisible(MacrosConstants.CustomerServiceSelector, MacrosConstants.Three, iframe, Constants.OpenWsWaitTimeout);
    await iframe.waitForSelector(MacrosConstants.CustomerServiceSelector);
    await iframe.$eval(MacrosConstants.CustomerServiceSelector, (el) => {
      (el as HTMLElement).click();
    });
    await iframe.waitForSelector(MacrosConstants.SelectDefaultScriptSelector);
    await iframe.$eval(MacrosConstants.SelectDefaultScriptSelector, (el) => {
      (el as HTMLElement).click();
    });
    await this.basepage.waitUntilSelectorIsVisible(MacrosConstants.ShowOptionSelector, MacrosConstants.Three, iframe, Constants.OpenWsWaitTimeout);
    await iframe.$eval(MacrosConstants.ShowOptionSelector, (el) => {
      (el as HTMLElement).focus();
    });
    await iframe.$eval(MacrosConstants.ShowOptionSelector, (el) => {
      (el as HTMLElement).click();
    });
    await this.basepage.waitUntilSelectorIsVisible(MacrosConstants.TextSelector.replace("{0}", Constants.AgentscriptName2), MacrosConstants.Three, iframe);
    await iframe.$eval(MacrosConstants.TextSelector.replace("{0}", Constants.AgentscriptName2), (el) => {
      (el as HTMLElement).click();
    });
    await parentIframe.waitForSelector(MacrosConstants.SaveExpresionBuilderBtnSelector);
    await parentIframe.$eval(MacrosConstants.SaveExpresionBuilderBtnSelector, (el) => {
      (el as HTMLElement).click();
    });
    await this.adminPage.waitForSelector(Constants.OkId);
    await this.adminPage.click(Constants.OkId);
  }

  public async InitiateSession(InitiateOne: any, Click: any) {
    await this.adminPage.waitForSelector(Constants.SessionsSitemapOCBtn);
    await this.adminPage.click(Constants.SessionsSitemapOCBtn);
    await this.adminPage.waitForTimeout(3000);
    await this.adminPage.click(Constants.SearchOption, { timeout: 5000 });
    await this.adminPage.fill(Constants.SearchOption, InitiateOne);
    await this.adminPage.waitForTimeout(3000);
    await this.adminPage.click(Constants.SearchTheView);
    await this.adminPage.click(Click);
    await this.adminPage.waitForTimeout(8000);
  }

  public async addTwoAgentScriptToSesssionTemplate(AgentScriptName: any, AgentScriptName2: any) {
    await this.adminPage.waitForSelector(Constants.AgentScriptsTab);
    await this.adminPage.click(Constants.AgentScriptsTab);
    await this.adminPage.click(Constants.MoreCommandsForAgentScript);
    await this.adminPage.click(Constants.AddExistingAgentScriptsBtn);
    await this.adminPage.fill(Constants.LookForRecordsField, AgentScriptName);
    await this.adminPage.click(Constants.AgentOneSearchResult);
    await this.adminPage.waitForTimeout(1000);
    await this.adminPage.waitForSelector(Constants.SeleectedAgentScriptSearchResult);
    await this.adminPage.fill(Constants.AddMoreRecords, AgentScriptName2);
    await this.adminPage.click(Constants.AgentTwoSearchResult);
    await this.adminPage.waitForTimeout(1000);
    await this.adminPage.waitForSelector(Constants.SeleectedAgentScriptSearchResult);
    await this.adminPage.waitForTimeout(1000);
    await this.adminPage.click(Constants.AddBtn);
  }

  public async addStaticValueConditionForExpressionBuilder(LhsValue: any, RhsValue: any) {
    const parentIframe: Page = await Iframe.GetIframe(
      this.adminPage,
      IFrameConstants.BuildExpressionParentIframe
    );
    const iframe: Page = await Iframe.GetChildIframeByParentIframe(
      this.adminPage,
      IFrameConstants.BuildExpressionParentIframe
    );
    const builtInTab = await iframe.waitForSelector(MacrosConstants.BuiltInTab);
    await iframe.$eval(MacrosConstants.BuiltInTab, (el) => {
      (el as HTMLElement).click();
    });
    await iframe.$eval(MacrosConstants.ControlCondition, (el) => {
      (el as HTMLElement).click();
    });
    const chooseName = await iframe.waitForSelector(
      MacrosConstants.DataEditorName
    );
    await chooseName.fill(LhsValue);

    await iframe.$eval(MacrosConstants.ConditionOperatorSelector, (el) => {
      (el as HTMLElement).click();
    });
    await this.basepage.waitUntilSelectorIsVisible(MacrosConstants.ConditionOperatorValueSelector, Constants.Five, iframe, Constants.MaxTimeout);
    await iframe.$eval(MacrosConstants.ConditionOperatorValueSelector, (el) => {
      (el as HTMLElement).click();
    });

    const chooseValue = await iframe.waitForSelector(
      MacrosConstants.DataEditorValue
    );
    await chooseValue.fill("");
    await chooseValue.fill(RhsValue);
    await iframe.$eval(MacrosConstants.SelectRowSelector, (el) => {
      (el as HTMLElement).click();
    })
    await iframe.$eval(MacrosConstants.AppTextSelector, (el) => {
      (el as HTMLElement).click();
    });
    await iframe.$eval(MacrosConstants.GroupTypeSelector, (el) => {
      (el as HTMLElement).click();
    });
    await iframe.$eval(MacrosConstants.FalseConditionSelector, (el) => {
      (el as HTMLElement).click();
    });
    await iframe.$eval(MacrosConstants.AddanAction, (el) => {
      (el as HTMLElement).click();
    });
    await this.basepage.waitUntilSelectorIsVisible(MacrosConstants.CustomerServiceSelector, MacrosConstants.Three, iframe, Constants.OpenWsWaitTimeout);
    await iframe.$eval(MacrosConstants.CustomerServiceSelector, (el) => {
      (el as HTMLElement).click();
    });
    await iframe.waitForSelector(MacrosConstants.SelectDefaultScriptSelector);
    await iframe.$eval(MacrosConstants.SelectDefaultScriptSelector, (el) => {
      (el as HTMLElement).click();
    });
    await this.basepage.waitUntilSelectorIsVisible(MacrosConstants.ShowOptionSelector, MacrosConstants.Three, iframe, Constants.OpenWsWaitTimeout);
    await iframe.$eval(MacrosConstants.ShowOptionSelector, (el) => {
      (el as HTMLElement).focus();
    });
    await iframe.$eval(MacrosConstants.ShowOptionSelector, (el) => {
      (el as HTMLElement).click();
    });
    await this.basepage.waitUntilSelectorIsVisible(MacrosConstants.TextSelector.replace("{0}", Constants.AgentScriptName), MacrosConstants.Three, iframe);
    await iframe.$eval(MacrosConstants.TextSelector.replace("{0}", Constants.AgentScriptName), (el) => {
      (el as HTMLElement).click();
    });
    await iframe.$eval(MacrosConstants.TrueConditionSelector, (el) => {
      (el as HTMLElement).click();
    });
    await iframe.$eval(MacrosConstants.FalseConditionSelector, (el) => {
      (el as HTMLElement).click();
    });
    await this.basepage.waitUntilSelectorIsVisible(MacrosConstants.AddanAction, MacrosConstants.Three, iframe);
    await iframe.$eval(MacrosConstants.AddanAction, (el) => {
      (el as HTMLElement).click();
    });
    await this.basepage.waitUntilSelectorIsVisible(MacrosConstants.CustomerServiceSelector, MacrosConstants.Three, iframe, Constants.OpenWsWaitTimeout);
    await iframe.waitForSelector(MacrosConstants.CustomerServiceSelector);
    await iframe.$eval(MacrosConstants.CustomerServiceSelector, (el) => {
      (el as HTMLElement).click();
    });
    await iframe.waitForSelector(MacrosConstants.SelectDefaultScriptSelector);
    await iframe.$eval(MacrosConstants.SelectDefaultScriptSelector, (el) => {
      (el as HTMLElement).click();
    });
    await this.basepage.waitUntilSelectorIsVisible(MacrosConstants.ShowOptionSelector, MacrosConstants.Three, iframe, Constants.OpenWsWaitTimeout);
    await iframe.$eval(MacrosConstants.ShowOptionSelector, (el) => {
      (el as HTMLElement).focus();
    });
    await iframe.$eval(MacrosConstants.ShowOptionSelector, (el) => {
      (el as HTMLElement).click();
    });
    await this.basepage.waitUntilSelectorIsVisible(MacrosConstants.TextSelector.replace("{0}", Constants.AgentscriptName2), MacrosConstants.Three, iframe);
    await iframe.$eval(MacrosConstants.TextSelector.replace("{0}", Constants.AgentscriptName2), (el) => {
      (el as HTMLElement).click();
    });
    await parentIframe.waitForSelector(MacrosConstants.SaveExpresionBuilderBtnSelector);
    await parentIframe.$eval(MacrosConstants.SaveExpresionBuilderBtnSelector, (el) => {
      (el as HTMLElement).click();
    });
  }

  public async sessionBuilder() {
    await this.adminPage.click(Constants.SessionsSitemapOCBtn);
    //await this.adminPage.click(Constants.SessionTemplateForSessionBuilder);
    //await this.adminPage.click(Constants.AgentScriptTabList);
  }

  public async associateSessionTemplateToaWorkStream() {
    await this.adminPage.click(Constants.WorkStreamSitemapOCBtn);
    await this.adminPage.click(Constants.WorkStream);
    await this.adminPage.click(Constants.TemplatesTab);
    await this.adminPage.click(Constants.LookupSessionTemplate);
    await this.adminPage.click(Constants.SessionSearchResult);
    await this.adminPage.click(Constants.SaveAndCloseButton);
    await this.adminPage.waitForTimeout(1000);
  }

  public async addDefaultSessionTemplateToWorkStream() {
    await this.adminPage.click(Constants.WorkStreamSitemapOCBtn);
    await this.adminPage.click(Constants.WorkStream);
    await this.adminPage.click(Constants.TemplatesTab);
    await this.adminPage.click(Constants.LookupSessionTemplate);
    await this.adminPage.click(Constants.SessionSearchResultDefault);
    await this.adminPage.click(Constants.SaveAndCloseButton);
    //await this.adminPage.waitForTimeout(1000);
  }

  public async goToApps() {
    await this.adminPage.click(Constants.LandingPage);
  }

  public async addAgentScriptTitle(agentscriptStepActiontype: string) {
    await this.adminPage.click(Constants.AgentScriptSitemapOCBtn);
    await this.adminPage.click(Constants.AgentScript);
    await this.adminPage.click(Constants.AgentScriptStepTitle);
    await this.adminPage.click(Constants.NewAgentScriptStep);
    //Time Delay for filling AgentScriptName
    await this.adminPage.waitForTimeout(3000);
    await this.adminPage.fill(Constants.AgentScriptStepNameField, Constants.AgentScriptStepName);
    await this.adminPage.waitForSelector(Constants.AgentscriptstepUniquenamefield, { timeout: 3000 });
    await this.adminPage.fill(Constants.AgentscriptstepUniquenamefield, Constants.AgentscriptUniquename);
    //Time Delay for filling Order
    await this.adminPage.waitForTimeout(4000);
    await this.adminPage.click(Constants.AgentscriptStepOrderfield);
    await this.adminPage.fill(Constants.AgentscriptStepOrderfield, Constants.AgentscriptStepOrder);
    //Time Delay for Clicking Selector Step
    await this.adminPage.waitForTimeout(4000);
    switch (agentscriptStepActiontype) {
      case Constants.SelectOptionText:
        await this.adminPage.click(Constants.AgentscriptSelectorStep);
        const textActiontype = await this.adminPage.$(Constants.AgentscriptSelectorStep);
        textActiontype?.selectOption(Constants.SelectOptionText);
        await this.adminPage.keyboard.press(Constants.TabKeyboardbutton);
        await this.adminPage.waitForSelector(Constants.TextAreaInstruction, { timeout: 3000 });
        await this.adminPage.fill(Constants.TextAreaInstruction, Constants.TextInstructionValue);
        break;

      case Constants.SelectOptionMacro:
        const macroActiontype = await this.adminPage.$(Constants.AgentscriptSelectorStep);
        await macroActiontype?.selectOption(Constants.SelectOptionMacro);
        await this.adminPage.keyboard.press(Constants.TabKeyboardbutton);
        await this.adminPage.click(Constants.TargetMacroLookupResult);
        await this.adminPage.keyboard.press("Enter");
        await this.adminPage.click(Constants.SelectTargetMacro);
        await this.adminPage.keyboard.press(Constants.TabKeyboardbutton);
        break;
    }
    await this.adminPage.waitForSelector(Constants.AgentscriptStepSaveAndclose, { timeout: 3000 });
    await this.adminPage.click(Constants.AgentscriptStepSaveAndclose);
  }

  public async addAgentScripttoDefaultChatSession() {
    await this.adminPage.click(Constants.SessionsSitemapOCBtn);
    await this.adminPage.click(Constants.ChatSession);
    await this.adminPage.click(Constants.AgentScriptsTab);
    await this.adminPage.click(Constants.AddExistingAgentScriptsBtn);
    await this.adminPage.fill(Constants.LookForRecordsField, Constants.AgentScriptName);
    await this.adminPage.click(Constants.AgentScriptSearchResult);
    await this.adminPage.waitForSelector(Constants.SeleectedAgentScriptSearchResult);
    await this.adminPage.click(Constants.AddBtn);
    await this.adminPage.waitForSelector(Constants.AgentScript);
    const visible = await this.adminPage.isVisible(Constants.AgentScript);
    //Time Delay for Checking The Visibility of AgentScript
    await this.adminPage.waitForTimeout(4000);
    expect(visible).toBeTruthy();
    await this.adminPage.click(Constants.SaveAndCloseButton);
  }

  public async validateAgentScriptsForExpressionBuilder(agentScriptName: string) {
    await this.adminPage.click(Constants.NavigateToAgentScript);
    const option = await this.adminPage.innerText(Constants.AgentScriptVerification);
    expect(option == agentScriptName).toBeTruthy();
  }

  public async validateSlugName() {
    await this.openAgentScriptInProductivityPane();
    try {
      await this.adminPage.waitForSelector(Constants.VisitorLabel, { timeout: 8000 });
      const visitorText = await (await this.adminPage.waitForSelector(Constants.VisitorLabel)).textContent();
      return (visitorText.startsWith(Constants.CustomerName)) ? true : false;
    }
    catch {
      return false;
    }
  }

  public async openAgentScriptInProductivityPane() {
    await this.adminPage.click(Constants.NavigateToAgentScript);
  }

  public async deleteSessionTemplate() {
    await this.adminPage.waitForSelector(Constants.SessionsSitemapOCBtn, { timeout: 3000 });
    await this.adminPage.click(Constants.SessionsSitemapOCBtn);
    try {
      await this.adminPage.waitForSelector(Constants.SessionTemplateName, { timeout: 3000 });
    }
    finally {
      const element = await this.adminPage.isVisible(Constants.SessionTemplateName);
      if (element) {
        await this.adminPage.click(Constants.SessionTemplateName);
        await this.adminPage.click(Constants.DeleteButton);
        await this.adminPage.click(Constants.ConfirmDeleteButton);
      }
    }
  }

  public async openAppLandingPage(page: Page) {
    await page.click(Constants.LandingPage);
  }

  public async deleteSession(SessionTemplateName: string) {
    await this.openAppLandingPage(page);
    await this.adminPage.goToCustomerServiceAdmincenter();
    await this.adminPage.waitForSelector(Constants.WorkspaceSiteMap);
    await this.adminPage.click(Constants.WorkspaceSiteMap);
    await this.adminPage.click(Constants.ManagedSession);
    await this.adminPage.waitForSelector(Constants.SessionSearchThisView);
    await this.adminPage.fill(
      Constants.SessionSearchThisView,
      SessionTemplateName
    );
    await this.adminPage.click(Constants.SearchThisViewStartBtn);
    await this.adminPage.click(Constants.RefreshBtn);
    await this.adminPage.waitForSelector(Constants.SelectAllRowsBtn, {
      timeout: 10000,
    });
    await this.adminPage.click(Constants.SelectAllRowsBtn);
    await this.adminPage.click(Constants.DeleteButton);
    await this.adminPage.click(Constants.ConfirmDeleteButton);
  }

  public async addAgentScriptToSesssionTemplate() {
    await this.adminPage.click(Constants.SessionsSitemapOCBtn);
    await this.adminPage.click(Constants.SessionTemplate);
    await this.adminPage.click(Constants.AgentScriptsTab);
    await this.adminPage.click(Constants.AddExistingAgentScriptsBtn);
    await this.adminPage.fill(Constants.LookForRecordsField, Constants.AgentScriptName);
    await this.adminPage.click(Constants.AgentScriptSearchResult);
    await this.adminPage.waitForSelector(Constants.SeleectedAgentScriptSearchResult);
    await this.adminPage.click(Constants.AddBtn);
    await this.adminPage.click(Constants.MoreCommandsForAgentScript);
    await this.adminPage.click(Constants.RefreshAgentScriptsSubGrid);
    await this.adminPage.waitForSelector(Constants.AgentScript);
    const visible = await this.adminPage.isVisible(Constants.AgentScript);
    expect(visible).toBeTruthy();
    await this.adminPage.click(Constants.SaveAndCloseButton);
  }

  public async deleteAgentScript(AgentScript: any) {
    await this.adminPage.click(Constants.AgentScriptSitemapOCBtn);
    try {
      await this.adminPage.waitForSelector(AgentScript, { timeout: 8000 });
    }
    finally {
      const element = await this.adminPage.isVisible(AgentScript);
      if (element) {
        await this.adminPage.click(AgentScript);
        await this.adminPage.click(Constants.DeleteButton);
        await this.adminPage.click(Constants.ConfirmDeleteButton);
      }
    }
  }

  public async deleteAgentScriptTemplate(agentScript: string, agentStartPage: OrgDynamicsCrmStartPage,) {
    await this.openAppLandingPage(page);
    await agentStartPage.goToOmnichannelForCustomers();
    await this.adminPage.waitForSelector(Constants.AgentScriptSitemapOCBtn);
    await this.adminPage.click(Constants.AgentScriptSitemapOCBtn);
    await this.adminPage.click(Constants.SearchBox);
    await this.adminPage.fill(Constants.SearchBox, agentScript);
    await this.adminPage.click(Constants.SearchThisViewStartBtn);
    await this.adminPage.waitForSelector(Constants.SelectAllRowsBtn, {
      timeout: 10000,
    });
    await this.adminPage.click(Constants.SelectAllRowsBtn);
    await this.adminPage.click(Constants.OCADelete);
    await this.adminPage.waitForTimeout(2000);
    await this.adminPage.click(Constants.OCAConfirmDelete);
    await this.adminPage.waitForTimeout(2000);
  }

  public async addSlugOrSessionConditionForExpressionBuilder(LhsValue: any, RhsValue: any) {
    const parentIframe: Page = await Iframe.GetIframe(
      this.adminPage,
      IFrameConstants.BuildExpressionParentIframe
    );
    const iframe: Page = await Iframe.GetChildIframeByParentIframe(
      this.adminPage,
      IFrameConstants.BuildExpressionParentIframe
    );
    const builtInTab = await iframe.waitForSelector(MacrosConstants.BuiltInTab);
    await iframe.$eval(MacrosConstants.BuiltInTab, (el) => {
      (el as HTMLElement).click();
    });
    await iframe.$eval(MacrosConstants.ControlCondition, (el) => {
      (el as HTMLElement).click();
    });
    const chooseName = await iframe.waitForSelector(
      MacrosConstants.DataEditorName
    );
    await chooseName.fill(LhsValue);

    await iframe.$eval(MacrosConstants.ConditionOperatorSelector, (el) => {
      (el as HTMLElement).click();
    });
    await this.basepage.waitUntilSelectorIsVisible(MacrosConstants.ConditionOperatorValueSelector, Constants.Five, iframe, Constants.MaxTimeout);
    await iframe.$eval(MacrosConstants.ConditionOperatorValueSelector, (el) => {
      (el as HTMLElement).click();
    });

    const chooseValue = await iframe.waitForSelector(
      MacrosConstants.DataEditorValue
    );
    await chooseValue.fill("");
    await chooseValue.fill(RhsValue);
    await iframe.$eval(MacrosConstants.SelectRowSelector, (el) => {
      (el as HTMLElement).click();
    })
    await iframe.$eval(MacrosConstants.AppTextSelector, (el) => {
      (el as HTMLElement).click();
    });
    await iframe.$eval(MacrosConstants.GroupTypeSelector, (el) => {
      (el as HTMLElement).click();
    });
    await iframe.$eval(MacrosConstants.FalseConditionSelector, (el) => {
      (el as HTMLElement).click();
    });
    await iframe.$eval(MacrosConstants.AddanAction, (el) => {
      (el as HTMLElement).click();
    });
    await this.basepage.waitUntilSelectorIsVisible(MacrosConstants.CustomerServiceSelector, MacrosConstants.Three, iframe, Constants.OpenWsWaitTimeout);
    await iframe.$eval(MacrosConstants.CustomerServiceSelector, (el) => {
      (el as HTMLElement).click();
    });
    await iframe.waitForSelector(MacrosConstants.SelectDefaultScriptSelector);
    await iframe.$eval(MacrosConstants.SelectDefaultScriptSelector, (el) => {
      (el as HTMLElement).click();
    });
    await this.basepage.waitUntilSelectorIsVisible(MacrosConstants.ShowOptionSelector, MacrosConstants.Three, iframe, Constants.OpenWsWaitTimeout);
    await iframe.$eval(MacrosConstants.ShowOptionSelector, (el) => {
      (el as HTMLElement).focus();
    });
    await iframe.$eval(MacrosConstants.ShowOptionSelector, (el) => {
      (el as HTMLElement).click();
    });
    await this.basepage.waitUntilSelectorIsVisible(MacrosConstants.TextSelector.replace("{0}", Constants.AgentScriptName), MacrosConstants.Three, iframe);
    await iframe.$eval(MacrosConstants.TextSelector.replace("{0}", Constants.AgentScriptName), (el) => {
      (el as HTMLElement).click();
    });
    await iframe.$eval(MacrosConstants.TrueConditionSelector, (el) => {
      (el as HTMLElement).click();
    });
    await iframe.$eval(MacrosConstants.FalseConditionSelector, (el) => {
      (el as HTMLElement).click();
    });
    await this.basepage.waitUntilSelectorIsVisible(MacrosConstants.AddanAction, MacrosConstants.Three, iframe);
    await iframe.$eval(MacrosConstants.AddanAction, (el) => {
      (el as HTMLElement).click();
    });
    await this.basepage.waitUntilSelectorIsVisible(MacrosConstants.CustomerServiceSelector, MacrosConstants.Three, iframe, Constants.OpenWsWaitTimeout);
    await iframe.waitForSelector(MacrosConstants.CustomerServiceSelector);
    await iframe.$eval(MacrosConstants.CustomerServiceSelector, (el) => {
      (el as HTMLElement).click();
    });
    await iframe.waitForSelector(MacrosConstants.SelectDefaultScriptSelector);
    await iframe.$eval(MacrosConstants.SelectDefaultScriptSelector, (el) => {
      (el as HTMLElement).click();
    });
    await this.basepage.waitUntilSelectorIsVisible(MacrosConstants.ShowOptionSelector, MacrosConstants.Three, iframe, Constants.OpenWsWaitTimeout);
    await iframe.$eval(MacrosConstants.ShowOptionSelector, (el) => {
      (el as HTMLElement).focus();
    });
    await iframe.$eval(MacrosConstants.ShowOptionSelector, (el) => {
      (el as HTMLElement).click();
    });
    await this.basepage.waitUntilSelectorIsVisible(MacrosConstants.TextSelector.replace("{0}", Constants.AgentscriptName2), MacrosConstants.Three, iframe);
    await iframe.$eval(MacrosConstants.TextSelector.replace("{0}", Constants.AgentscriptName2), (el) => {
      (el as HTMLElement).click();
    });
    await parentIframe.waitForSelector(MacrosConstants.SaveExpresionBuilderBtnSelector);
    await parentIframe.$eval(MacrosConstants.SaveExpresionBuilderBtnSelector, (el) => {
      (el as HTMLElement).click();
    });
  }

  public async deleteAgentScripthavingSteps(AgentScript: any) {
    await this.adminPage.click(Constants.AgentScriptSitemapOCBtn);
    try {
      await this.adminPage.waitForSelector(AgentScript, { timeout: 8000 });
    }
    finally {
      const element = await this.adminPage.isVisible(AgentScript);
      if (element) {
        await this.adminPage.click(AgentScript);
        await this.adminPage.click(Constants.StepTitleCheckbox);
        await this.adminPage.click(Constants.AgentScriptStepTitle);
        await this.adminPage.click(Constants.DeleteAgentScriptStepTitle);
        await this.adminPage.click(Constants.DeleteStepTitle);
        await this.adminPage.click(Constants.DeleteButton);
        await this.adminPage.click(Constants.ConfirmDeleteButton);
      }
    }
  }
}