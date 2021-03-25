/**
 * @license Copyright (c) Microsoft Corporation.  All rights reserved.
 */
import { ProductivityToolsConfig } from './ProductivityToolsConfig';
import { ToolConfig } from './ProductivityToolConfig';
import { Utils } from '../Utilities/Utils';

export class ProductivityPaneConfig {
    public productivityPaneState: boolean;
    public productivityPaneMode: boolean;
    public productivityToolsConfig: ProductivityToolsConfig;

    constructor(
        productivityPaneState: boolean,
        productivityPaneMode: boolean,
        productivityToolsConfig: ProductivityToolsConfig,
    ) {
        this.productivityPaneState = productivityPaneState;
        this.productivityPaneMode = productivityPaneMode;
        this.productivityToolsConfig = productivityToolsConfig;
    }

    public getDefaultTool(): ToolConfig {
        for (let tool of this.productivityToolsConfig.ToolsList) {
            if (tool.isEnabled) {
                return tool;
            }
        }
    }

    public getToolByName(toolname): ToolConfig {
        for (let tool of this.productivityToolsConfig.ToolsList) {
            if (tool.toolName === toolname) {
                return tool;
            }
        }
    }

    public validateConfig(): boolean {
        if (
            Utils.isNullOrUndefined(this.productivityToolsConfig) ||
            Utils.isNullOrUndefined(this.productivityToolsConfig.ToolsList) ||
            this.productivityToolsConfig.ToolsList.length == 0
        ) {
            return false;
        }
        for (let tool of this.productivityToolsConfig.ToolsList) {
            if (tool.isEnabled) {
                return true;
            }
        }
        return false;
    }
}

export class SessionTemplateCriteria {
    public SessionTemplateId: string;
    public IsAgentScriptAvailable: boolean;
    public IsSmartAssistAvailable: boolean;

    constructor(templateId: string, agentScript: boolean, smartAssist: boolean) {
        this.SessionTemplateId = templateId;
        this.IsAgentScriptAvailable = agentScript;
        this.IsSmartAssistAvailable = smartAssist;
    }
}
