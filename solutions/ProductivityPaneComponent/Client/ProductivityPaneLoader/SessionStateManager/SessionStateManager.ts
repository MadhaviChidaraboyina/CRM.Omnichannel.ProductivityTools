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
                Logger.logError(
                    EventType.SET_SESSION_STORAGE_FAILURE,
                    `${Constants.productivityToolsLogPrefix} Failed to set item in session storage`,
                    error,
                );
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
            console.info(
                `${Constants.productivityToolsLogPrefix} Success: cleared session storage data related to app side panes`,
            );
        }

        public static initSessionState(
            isDefaultExpanded: boolean,
            productivityToolList: ToolConfig[],
            newSessionId: string,
        ): void {
            const defaultAppSidePanesState = isDefaultExpanded
                ? Constants.appSidePanesExpanded
                : Constants.appSidePanesCollapsed;
            const defaultSelectedAppSidePaneId = productivityToolList[Constants.firstElement].paneId;
            const defaultSessionStorageData = {
                appSidePanesState: defaultAppSidePanesState,
                selectedAppSidePaneId: defaultSelectedAppSidePaneId,
            };
            SessionStateManager.setSessionStorageData(
                Constants.appSidePaneSessionState + newSessionId,
                defaultSessionStorageData,
            );
            console.info(
                `${Constants.productivityToolsLogPrefix} Success: initialized session state of ${newSessionId}`,
            );
        }

        public static updateSessionState(sessionId: string): void {
            // Selected app side pane will carry over between session switch
            const currentSelectedAppSidePane = XrmAppProxy.getSelectedAppSidePane();
            const currentSelectedAppSidePaneId = currentSelectedAppSidePane
                ? currentSelectedAppSidePane.paneId
                : Constants.emptyString;

            const sessionState: Map<string, string> = Microsoft.AppRuntime.Sessions.getSessionState();
            const appSidePanesState = XrmAppProxy.getAppSidePanesState();
            const sessionStorageData = {
                appSidePanesState: appSidePanesState,
                selectedAppSidePaneId: currentSelectedAppSidePaneId,
                persistenceState: Utils.convertMapToJsonString(sessionState),
            };
            SessionStateManager.setSessionStorageData(
                Constants.appSidePaneSessionState + sessionId,
                sessionStorageData,
            );
            // Clear all the badge before session switch to avoid badge carry over except
            // those tools that do not require session state persistence for badging.
            XrmAppProxy.getAllAppSidePanes().forEach((pane) => {
                pane.badge = false;
            });
            console.info(`${Constants.productivityToolsLogPrefix} Success: updated session state of ${sessionId}`);
        }

        public static restoreSessionState(sessionId: string): void {
            const sessionStorageData = SessionStateManager.getSessionStorageData(
                Constants.appSidePaneSessionState + sessionId,
            );

            if (!Utils.isEmpty(sessionStorageData.selectedAppSidePaneId)) {
                XrmAppProxy.setSelectedAppSidePane(sessionStorageData.selectedAppSidePaneId);
                XrmAppProxy.setAppSidePanesState(sessionStorageData.appSidePanesState);
            }

            if (sessionStorageData.persistenceState) {
                const sessionPersistenceState = Utils.convertJsonStringToMap(sessionStorageData.persistenceState);
                Microsoft.AppRuntime.Sessions.restoreSessionState(sessionPersistenceState);
            }
            console.info(`${Constants.productivityToolsLogPrefix} Success: restored session state of ${sessionId}`);
        }
    }
}
