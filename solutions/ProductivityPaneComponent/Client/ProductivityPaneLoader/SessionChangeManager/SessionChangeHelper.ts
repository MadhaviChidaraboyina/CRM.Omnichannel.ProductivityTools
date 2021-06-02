/**
 * @license Copyright (c) Microsoft Corporation.  All rights reserved.
 */
/// <reference path="../Models/ProductivityToolConfig.ts"/>
/// <reference path="../Utilities/Utils.ts"/>
/// <reference path="../Utilities/XrmAppProxy.ts"/>
module ProductivityPaneLoader {
    export class SessionChangeHelper {
        public static getWindowObject(): any {
            return window.top;
        }

        public static hideAllProductivityTools(toolList: ToolConfig[]): void {
            toolList.forEach((tool: ToolConfig) => {
                if (!Utils.isShownOnHomeSession(tool.toolControlName)) {
                    XrmAppProxy.getAppSidePane(Constants.appSidePaneIdPrefix + tool.toolControlName).hidden = true;
                }
            });
        }

        public static showAllProductivityTools(toolList: ToolConfig[]): void {
            toolList.forEach((tool: ToolConfig) => {
                XrmAppProxy.getAppSidePane(Constants.appSidePaneIdPrefix + tool.toolControlName).hidden = false;
            });
        }

        public static getSessionId(event: any): string {
            return event.getEventArgs()._inputArguments.sessionId;
        }

        public static getPreviousSessionId(event: any): string {
            return event.getEventArgs()._inputArguments.previousSessionId;
        }

        public static getNewSessionId(event: any): string {
            return event.getEventArgs()._inputArguments.newSessionId;
        }

        public static errorMessagesOnRegisterEventHandlers(errorMessages: any): string {
            return `${Constants.productivityToolsLogPrefix} Error occured on registering event handlers: ${errorMessages}`;
        }

        public static errorMessagesOnBeforeSessionSwitch(errorMessages: any): string {
            return `${Constants.productivityToolsLogPrefix} Error occured on before session switch: ${errorMessages}`;
        }

        public static errorMessagesOnAfterSessionSwitch(errorMessages: any): string {
            return `${Constants.productivityToolsLogPrefix} Error occured on after session switch: ${errorMessages}`;
        }

        public static errorMessagesOnSessionClose(errorMessages: any): string {
            return `${Constants.productivityToolsLogPrefix} Error occured on session close: ${errorMessages}`;
        }
    }
}
