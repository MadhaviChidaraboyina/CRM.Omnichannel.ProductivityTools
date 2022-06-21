import { AgentChatConstants, Constants } from "../Utility/Constants";

import { AgentChat } from "./AgentChat";
import { Page } from "playwright";

export enum AgentProductivityPanePageConstants {
    togglePPControlSelector = "//*[@aria-label='Collapse Productivity panel control']",
    toggleAgentPPControlSelector = "//*[@aria-label='Call Script Tab']",
    selectAgentMacroSelector = "//*[contains(@aria-label,'{0} macro step')]/div/div[@title='Run again']",
    btnAgentMacroSelector = "//*[contains(@aria-label,'{0} macro step')]/div/div[@title='Run']",
    CaseTitleSelector = "//*[contains(@value,'Case-')]",
    Case = "Case",
    FirstMacroName = "Test",
    SecondMacroName = "TestMacro",
    Three = 3,
    AgentScriptOptionNameSelector = "//*[@aria-label='{0}']",
    TestScript = "TestScript",
}

export class AgentProductivityPanePage extends AgentChat {
    constructor(page: Page) {
        super(page);
    }

    public async toggleProductivityPane() {
        const togglePPControl = await this._page.waitForSelector(AgentProductivityPanePageConstants.togglePPControlSelector);
        await togglePPControl.click();
        const toggleAgentPPControl = await this._page.waitForSelector(AgentProductivityPanePageConstants.toggleAgentPPControlSelector);
        await toggleAgentPPControl.click();
        const btnMacroSelector = await this._page.waitForSelector(AgentProductivityPanePageConstants.btnAgentMacroSelector.replace("{0}", AgentProductivityPanePageConstants.FirstMacroName));
        btnMacroSelector.click();
    }

    public async validateProductivityPane() {
        await this.waitUntilSelectorIsVisible(AgentProductivityPanePageConstants.selectAgentMacroSelector.replace("{0}", AgentProductivityPanePageConstants.FirstMacroName), Constants.Three, this._page, Constants.MaxTimeout)
        const messageSelector = await (await this.Page.waitForSelector(
            AgentProductivityPanePageConstants.selectAgentMacroSelector.replace("{0}", AgentProductivityPanePageConstants.FirstMacroName)
        ));
        return (messageSelector !== null && messageSelector !== undefined);
    }

    public async validateMacro() {
        return await this.waitUntilSelectorIsVisible(AgentProductivityPanePageConstants.CaseTitleSelector, Constants.Three, this._page, Constants.MaxTimeout)
    }

    public async RunMacroCondition() {
        const togglePPControl = await this._page.waitForSelector(AgentProductivityPanePageConstants.togglePPControlSelector);
        await togglePPControl.click();
        const toggleAgentPPControl = await this._page.waitForSelector(AgentProductivityPanePageConstants.toggleAgentPPControlSelector);
        await toggleAgentPPControl.click();
        const btnMacroSelector = await this._page.waitForSelector(AgentProductivityPanePageConstants.btnAgentMacroSelector.replace("{0}", AgentProductivityPanePageConstants.SecondMacroName));
        btnMacroSelector.click();
    }

    public async validateAgentScriptsForExpressionBuilder(agentScriptName: string) {
        await this.waitUntilSelectorIsVisible(AgentProductivityPanePageConstants.AgentScriptOptionNameSelector.replace("{0}", agentScriptName), AgentProductivityPanePageConstants.Three);
        const agentScript = await (await this.Page.waitForSelector(AgentProductivityPanePageConstants.AgentScriptOptionNameSelector.replace("{0}", agentScriptName))).textContent();
        return (agentScript.includes(agentScriptName))
    }

    public async openProductivityPane() {
        await this.waitUntilSelectorIsVisible(AgentProductivityPanePageConstants.togglePPControlSelector, Constants.Three, this._page, Constants.OpenWsWaitTimeout)
        const togglePPControl = await this._page.waitForSelector(AgentProductivityPanePageConstants.togglePPControlSelector);
        await togglePPControl.click();
        await this.waitUntilSelectorIsVisible(AgentProductivityPanePageConstants.toggleAgentPPControlSelector, Constants.Three, this._page, Constants.OpenWsWaitTimeout)
        const toggleAgentPPControl = await this._page.waitForSelector(AgentProductivityPanePageConstants.toggleAgentPPControlSelector);
        await toggleAgentPPControl.click();
    }
}