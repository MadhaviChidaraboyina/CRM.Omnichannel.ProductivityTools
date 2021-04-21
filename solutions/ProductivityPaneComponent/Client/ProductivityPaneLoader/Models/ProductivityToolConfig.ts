/**
 * @license Copyright (c) Microsoft Corporation.  All rights reserved.
 */
module ProductivityPaneLoader {
    export class ToolConfig {
        public toolControlName: string;
        public toolIcon: string;
        public toolPosition: number;
        public isEnabled: boolean;
        public toolName: string;
        public tooltip: string;
        public staticData: string;
        public defaultIcon: string;
        public istoolIconValid: boolean;
        public isDefaultIconValid: boolean;

        constructor(
            toolControlName: string,
            toolIcon: string,
            toolPosition: number,
            isEnabled: boolean,
            toolName: string,
            toolTip: string,
            staticData: string,
            defaultIcon: string,
            istoolIconValid: boolean = false,
            isDefaultIconValid: boolean = false,
        ) {
            this.toolControlName = toolControlName;
            this.toolIcon = toolIcon;
            this.toolPosition = toolPosition;
            this.isEnabled = isEnabled;
            this.toolName = toolName;
            this.tooltip = toolTip;
            this.staticData = staticData;
            this.defaultIcon = defaultIcon;
            this.istoolIconValid = istoolIconValid;
            this.isDefaultIconValid = isDefaultIconValid;
        }
    }
}
