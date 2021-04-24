/**
 * @license Copyright (c) Microsoft Corporation.  All rights reserved.
 */
/// <reference path="../../../../../packages/Crm.ClientApiTypings.1.3.2084/clientapi/XrmClientApi.d.ts" />
/// <reference path="../Models/ProductivityToolConfig.ts"/>
/// <reference path="../Utilities/Utils.ts"/>
module ProductivityPaneLoader {
    export class SessionChangeHelper {
        public static getWindowObject(): any {
            return window.top;
        }

        public static getXrmAppApis(): any {
            return Xrm.App;
        }

        public static getSelectedAppSidePane(): any {
            return SessionChangeHelper.getXrmAppApis().sidePanes.getSelectedPane();
        }

        public static getAppSidePane(paneId: string): any {
            return SessionChangeHelper.getXrmAppApis().sidePanes.getPane(paneId);
        }

        public static setSelectedAppSidePane(paneId: string): void {
            SessionChangeHelper.getAppSidePane(paneId).select();
        }

        public static setProductivityToolsHidden(toolList: ToolConfig[]): void {
            toolList.forEach((tool: ToolConfig) => {
                SessionChangeHelper.getAppSidePane(tool.toolName).hidden = true;
            });
        }

        public static setProductivityToolsNotHidden(toolList: ToolConfig[]): void {
            toolList.forEach((tool: ToolConfig) => {
                SessionChangeHelper.getAppSidePane(tool.toolName).hidden = false;
            });
        }

        public static collapseSelectedAppSidePane(): void {
            SessionChangeHelper.getSelectedAppSidePane().state = Constants.collapseAppSidePane;
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
            return 'Error occured on register event handlers: ' + errorMessages;
        }

        public static errorMessagesOnBeforeSessionSwitch(errorMessages: any): string {
            return 'Error occured on before session switch: ' + errorMessages;
        }

        public static errorMessagesOnAfterSessionSwitch(errorMessages: any): string {
            return 'Error occured on after session switch: ' + errorMessages;
        }

        public static errorMessagesOnSessionClose(errorMessages: any): string {
            return 'Error occured on session close: ' + errorMessages;
        }

        public static isProductivityToolSelected(toolList: ToolConfig[]): boolean {
            toolList.forEach((tool: ToolConfig) => {
                if (Utils.isEqual(tool.toolName, SessionChangeHelper.getSelectedAppSidePane().paneId)) {
                    return true;
                }
            });
            return false;
        }
    }
}
