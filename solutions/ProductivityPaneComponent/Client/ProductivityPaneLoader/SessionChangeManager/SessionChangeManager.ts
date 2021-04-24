/**
 * @license Copyright (c) Microsoft Corporation.  All rights reserved.
 */
/// <reference path="../SessionStateManager/SessionStateManager.ts"/>
/// <reference path="../utilities/Constants.ts"/>
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
         * Update current selected app side pane in session storage before switching a session,
         * including caching the selected app side pane in home sesion.
         */
        private onBeforeSessionSwitch(event: any): void {
            try {
                const previousSessionId = SessionChangeHelper.getPreviousSessionId(event);

                const currentSelectedAppSidePane = SessionChangeHelper.getSelectedAppSidePane();
                const currentSelectedAppSidePaneId = currentSelectedAppSidePane
                    ? currentSelectedAppSidePane.paneId
                    : Constants.emptyString;

                let sessionStateData = SessionStateManager.getState(
                    Constants.appSidePaneSessionState + previousSessionId,
                );

                // Handle home session init. This only happens once.
                // Notes: addOnBeforeSessionSwitch happens prior to addOnAfterSessionCreate.
                if (Utils.isNullOrUndefined(sessionStateData)) {
                    sessionStateData = {};
                }

                sessionStateData[Constants.selectedAppSidePaneId] = currentSelectedAppSidePaneId;
                SessionStateManager.setState(Constants.appSidePaneSessionState + previousSessionId, sessionStateData);
            } catch (error) {
                console.log(SessionChangeHelper.errorMessagesOnBeforeSessionSwitch(error));
                // Telemetry here
            }
        }

        /*
         * Set pane.hidden accordingly. Productivity tools are hidden in home session and not hidden in other sessions.
         * Init session storage if it is null. And Select or collapse app side pane based on session storage data.
         */
        private onAfterSessionSwitch(event: any): void {
            try {
                const newSessionId = SessionChangeHelper.getNewSessionId(event);
                Utils.isEqual(newSessionId, Constants.homeSessionId)
                    ? SessionChangeHelper.setProductivityToolsHidden(this.ProductivityToolList)
                    : SessionChangeHelper.setProductivityToolsNotHidden(this.ProductivityToolList);

                // Init session storage if sessionStateData is null, which only happens when creating a new session.
                let sessionStateData = SessionStateManager.getState(Constants.appSidePaneSessionState + newSessionId);
                let selectedAppSidePaneId = sessionStateData ? sessionStateData[Constants.selectedAppSidePaneId] : null;
                if (Utils.isNullOrUndefined(selectedAppSidePaneId)) {
                    selectedAppSidePaneId = this.isDefaultExpanded
                        ? this.ProductivityToolList[Constants.firstElement].toolName
                        : Constants.emptyString;
                    sessionStateData = {};
                    sessionStateData[Constants.selectedAppSidePaneId] = selectedAppSidePaneId;
                    SessionStateManager.setState(Constants.appSidePaneSessionState + newSessionId, sessionStateData);
                }

                if (!Utils.isEmpty(selectedAppSidePaneId)) {
                    SessionChangeHelper.setSelectedAppSidePane(selectedAppSidePaneId);
                } else if (SessionChangeHelper.isProductivityToolSelected(this.ProductivityToolList)) {
                    SessionChangeHelper.collapseSelectedAppSidePane();
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
                SessionStateManager.deleteState(Constants.appSidePaneSessionState + closedSessionId);
            } catch (error) {
                console.log(SessionChangeHelper.errorMessagesOnSessionClose(error));
                // Telemetry here
            }
        }
    }
}
