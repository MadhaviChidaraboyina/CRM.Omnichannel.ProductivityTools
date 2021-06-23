/**
 * @license Copyright (c) Microsoft Corporation.  All rights reserved.
 */
module ProductivityPaneLoader {
    export class ToolConfig {
        public toolControlName: string;
        public stateCode: number;
        public paneId: string;
        public toolIcon: string;
        public toolPosition: number;
        public isEnabled: boolean;
        public toolName: string;
        public toolTip: string;
        public staticData: string;
        public defaultIcon: string;
        public isToolIconValid: boolean;
        public isDefaultIconValid: boolean;

        constructor(
            toolControlName: string,
            stateCode: number,
            toolIcon: string,
            toolPosition: number,
            isEnabled: boolean,
            toolName: string,
            toolTip: string,
            staticData: string,
            defaultIcon: string,
            isToolIconValid: boolean = false,
            isDefaultIconValid: boolean = false,
        ) {
            this.toolControlName = toolControlName;
            this.stateCode = stateCode;
            this.paneId = Constants.appSidePaneIdPrefix + toolControlName;
            this.toolIcon = toolIcon;
            this.toolPosition = toolPosition;
            this.isEnabled = isEnabled;
            this.toolName = toolName;
            this.toolTip = toolTip;
            this.staticData = staticData;
            this.defaultIcon = defaultIcon;
            this.isToolIconValid = isToolIconValid;
            this.isDefaultIconValid = isDefaultIconValid;
        }
    }
}
