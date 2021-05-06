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
                console.error(Constants.toolsLog + 'Failed to set item in session storage: ' + error);
                // Telemetry
            }
        }

        public static getSessionStorageData(key: string): any {
            return JSON.parse(sessionStorage.getItem(key));
        }

        public static deleteSessionStorageData(key: string): void {
            sessionStorage.removeItem(key);
        }

        public static cleanSessionState(): void {
            Object.keys(sessionStorage)
                .filter((sessionStorageKey: string) => {
                    return sessionStorageKey.startsWith(Constants.appSidePaneSessionState);
                })
                .forEach((appSidePaneSessionStateKey) => {
                    SessionStateManager.deleteSessionStorageData(appSidePaneSessionStateKey);
                });
            console.info(Constants.toolsLog + 'Success: cleared session storage data related to app side panes.');
        }

        public static initSessionState(
            isDefaultExpanded: boolean,
            productivityToolList: ToolConfig[],
            newSessionId: string,
        ): void {
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
            console.info(Constants.toolsLog + 'Success: initialized session state of ' + newSessionId);
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
            console.info(Constants.toolsLog + 'Success: updated session state of ' + sessionId);
        }

        public static restoreSessionState(sessionId: string): void {
            const sessionStorageData = SessionStateManager.getSessionStorageData(
                Constants.appSidePaneSessionState + sessionId,
            );

            if (!Utils.isEmpty(sessionStorageData.selectedAppSidePaneId)) {
                XrmAppProxy.setSelectedAppSidePane(sessionStorageData.selectedAppSidePaneId);
                XrmAppProxy.setAppSidePanesState(sessionStorageData.appSidePanesState);
            }
            console.info(Constants.toolsLog + 'Success: restored session state of ' + sessionId);
        }
    }
}
