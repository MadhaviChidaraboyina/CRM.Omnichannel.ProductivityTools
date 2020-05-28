/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/

module MscrmControls.ProductivityToolPanel {
    'use strict';

    export class ProductivityToolsConfig {
        // Attributes
        private toolsList: ToolConfig[];

        constructor(toolsList?: ToolConfig[]) {
            this.toolsList = toolsList;
            if (!Utils.isNullOrUndefined(this.toolsList) && this.toolsList.length > 1) {
                this.toolsList.sort((a: ToolConfig, b: ToolConfig) => (a.toolPosition > b.toolPosition) ? 1 : -1);
            }
        }

        public get ToolsList() {
            return this.toolsList;
        }

        public set ToolsList(toolsList: ToolConfig[]) {
            this.toolsList = toolsList;
            if (!Utils.isNullOrUndefined(this.toolsList) && this.toolsList.length > 1) {
                this.toolsList.sort((a: ToolConfig, b: ToolConfig) => (a.toolPosition > b.toolPosition) ? 1 : -1);
            }
        }

    }

    export class ToolConfig {
        public toolControlName: string;
        public toolIcon: string;
        public toolPosition: number;
        public isEnabled: boolean;
        public toolName: string;
        public tooltip: string;

        constructor(toolControlName: string, toolIcon: string, toolPosition: number, isEnabled: boolean, toolName: string, toolTip: string) {
            this.toolControlName = toolControlName;
            this.toolIcon = toolIcon;
            this.toolPosition = toolPosition;
            this.isEnabled = isEnabled;
            this.toolName = toolName;
            this.tooltip = toolTip;
        }
    }
}