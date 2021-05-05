/**
 * @license Copyright (c) Microsoft Corporation.  All rights reserved.
 */
/// <reference path="../utilities/Constants.ts"/>
/// <reference path="../Models/ProductivityToolConfig.ts"/>
/// <reference path="../utilities/XrmAppProxy.ts"/>
module ProductivityPaneLoader {
    export class SessionStateManager {
        public static setSessionStorageData(key: string, value: any): void {
            try {
                sessionStorage.setItem(key, JSON.stringify(value));
            } catch (error) {
                // setItem() may throw an exception if the storage is full. Particularly, in Mobile Safari.
                console.log('Failed to set item in session storage: ' + error);
                // Telemetry
            }
        }

        public static getSessionStorageData(key: string): any {
            return JSON.parse(sessionStorage.getItem(key));
        }

        public static deleteSessionStorageData(key: string): void {
            sessionStorage.removeItem(key);
        }

        public static async initSessionState(
            isDefaultExpanded: boolean,
            productivityToolList: ToolConfig[],
            newSessionId: string,
        ): Promise<void> {
            return new Promise<void>((resolve) => {
                const defaultAppSidePanesState = isDefaultExpanded
                    ? Constants.appSidePanesExpanded
                    : Constants.appSidePanesCollapsed;
                const defaultSelectedAppSidePaneId = productivityToolList[Constants.firstElement].toolName;
                const defaultSessionStorageData = {
                    appSidePanesState: defaultAppSidePanesState,
                    selectedAppSidePaneId: defaultSelectedAppSidePaneId,
                };
                SessionStateManager.setSessionStorageData(
                    Constants.appSidePaneSessionState + newSessionId,
                    defaultSessionStorageData,
                );
                resolve();
            });
        }

        public static updateSessionState(sessionId: string): void {
            // Selected app side pane will carry over between session switch
            const currentSelectedAppSidePane = XrmAppProxy.getSelectedAppSidePane();
            const currentSelectedAppSidePaneId = currentSelectedAppSidePane
                ? currentSelectedAppSidePane.paneId
                : Constants.emptyString;
            const appSidePanesState = XrmAppProxy.getAppSidePanesState();
            const sessionStorageData = {
                appSidePanesState: appSidePanesState,
                selectedAppSidePaneId: currentSelectedAppSidePaneId,
            };
            SessionStateManager.setSessionStorageData(
                Constants.appSidePaneSessionState + sessionId,
                sessionStorageData,
            );
        }

        public static restoreSessionState(sessionId: string): void {
            const sessionStorageData = SessionStateManager.getSessionStorageData(
                Constants.appSidePaneSessionState + sessionId,
            );

            if (!Utils.isEmpty(sessionStorageData.selectedAppSidePaneId)) {
                XrmAppProxy.setSelectedAppSidePane(sessionStorageData.selectedAppSidePaneId);
                XrmAppProxy.setAppSidePanesState(sessionStorageData.appSidePanesState);
            }
        }
    }
}
