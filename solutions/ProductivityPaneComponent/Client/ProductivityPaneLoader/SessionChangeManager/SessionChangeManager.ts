/**
 * @license Copyright (c) Microsoft Corporation.  All rights reserved.
 */
/// <reference path="../SessionStateManager/SessionStateManager.ts"/>
/// <reference path="../utilities/Constants.ts"/>
/// <reference path="../utilities/XrmAppProxy.ts"/>
/// <reference path="../utilities/utils.ts"/>
/// <reference path="./SessionChangeHelper.ts"/>
module ProductivityPaneLoader {
    export class SessionChangeManager {
        private isDefaultExpanded: boolean;
        private ProductivityToolList: ToolConfig[];

        constructor(isDefaultExpanded: boolean, toolList: ToolConfig[]) {
            this.isDefaultExpanded = isDefaultExpanded;
            this.ProductivityToolList = toolList;
            this.registerEventHandlers();
        }

        private registerEventHandlers(): void {
            try {
                const windowObject = SessionChangeHelper.getWindowObject();

                windowObject.Xrm.App.sessions.addOnBeforeSessionSwitch(this.onBeforeSessionSwitch.bind(this));
                windowObject.Xrm.App.sessions.addOnAfterSessionSwitch(this.onAfterSessionSwitch.bind(this));
                windowObject.Xrm.App.sessions.addOnAfterSessionClose(this.onSessionClose.bind(this));
            } catch (error) {
                console.log(SessionChangeHelper.errorMessagesOnRegisterEventHandlers(error));
                // Telemetry here
            }
        }

        /*
         * Update current selected app side pane and AppSidePanesState in session storage before switching a session.
         * AppSidePanesState = 0: collapsed; AppSidePanesState = 1: expanded. Additionally, init home session.
         */
        private onBeforeSessionSwitch(event: any): void {
            try {
                const previousSessionId = SessionChangeHelper.getPreviousSessionId(event);

                const currentSelectedAppSidePane = XrmAppProxy.getSelectedAppSidePane();
                const currentSelectedAppSidePaneId = currentSelectedAppSidePane
                    ? currentSelectedAppSidePane.paneId
                    : Constants.emptyString;
                const appSidePanesState = XrmAppProxy.getAppSidePanesState();
                let sessionStorageData = SessionStateManager.getSessionStorageData(
                    Constants.appSidePaneSessionState + previousSessionId,
                );

                // Handle home session init. This only happens once.
                // Notes: addOnBeforeSessionSwitch happens prior to addOnAfterSessionCreate.
                if (Utils.isNullOrUndefined(sessionStorageData)) {
                    sessionStorageData = {};
                }

                sessionStorageData[Constants.selectedAppSidePaneId] = currentSelectedAppSidePaneId;
                sessionStorageData[Constants.appSidePanesState] = appSidePanesState;
                SessionStateManager.setSessionStorageData(
                    Constants.appSidePaneSessionState + previousSessionId,
                    sessionStorageData,
                );
            } catch (error) {
                console.log(SessionChangeHelper.errorMessagesOnBeforeSessionSwitch(error));
                // Telemetry here
            }
        }

        /*
         * Set pane.hidden accordingly. Productivity tools are hidden in home session and not hidden in other sessions.
         * Init session storage if it is null. Select and collapse/expande app side pane based on session storage data.
         */
        private onAfterSessionSwitch(event: any): void {
            try {
                const newSessionId = SessionChangeHelper.getNewSessionId(event);
                Utils.isEqual(newSessionId, Constants.homeSessionId)
                    ? SessionChangeHelper.hideAllProductivityTools(this.ProductivityToolList)
                    : SessionChangeHelper.showAllProductivityTools(this.ProductivityToolList);

                let sessionStorageData = SessionStateManager.getSessionStorageData(
                    Constants.appSidePaneSessionState + newSessionId,
                );
                // Init session storage if sessionStorageData is null, which only happens when creating a new session.
                if (Utils.isNullOrUndefined(sessionStorageData)) {
                    const appSidePanesState = this.isDefaultExpanded
                        ? Constants.appSidePanesExpanded
                        : Constants.appSidePanesCollapsed;
                    const selectedAppSidePaneId = this.ProductivityToolList[Constants.firstElement].toolName;
                    sessionStorageData = {};
                    sessionStorageData[Constants.selectedAppSidePaneId] = selectedAppSidePaneId;
                    sessionStorageData[Constants.appSidePanesState] = appSidePanesState;
                    SessionStateManager.setSessionStorageData(
                        Constants.appSidePaneSessionState + newSessionId,
                        sessionStorageData,
                    );
                }

                if (!Utils.isEmpty(sessionStorageData.selectedAppSidePaneId)) {
                    XrmAppProxy.setSelectedAppSidePane(sessionStorageData.selectedAppSidePaneId);
                    XrmAppProxy.setAppSidePanesState(sessionStorageData.appSidePanesState);
                }
            } catch (error) {
                console.log(SessionChangeHelper.errorMessagesOnAfterSessionSwitch(error));
                // Telemetry here
            }
        }

        /*
         * Remove session storage data associated with session id.
         */
        private onSessionClose(event: any): void {
            try {
                const closedSessionId = SessionChangeHelper.getSessionId(event);
                SessionStateManager.deleteSessionStorageData(Constants.appSidePaneSessionState + closedSessionId);
            } catch (error) {
                console.log(SessionChangeHelper.errorMessagesOnSessionClose(error));
                // Telemetry here
            }
        }
    }
}
