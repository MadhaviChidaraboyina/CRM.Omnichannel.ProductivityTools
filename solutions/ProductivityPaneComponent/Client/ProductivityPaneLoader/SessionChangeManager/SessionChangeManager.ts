/**
 * @license Copyright (c) Microsoft Corporation.  All rights reserved.
 */
/// <reference path="../../../../../packages/Crm.ClientApiTypings.1.3.2084/clientapi/XrmClientApi.d.ts" />
/// <reference path="../SessionStateManager/SessionStateManager.ts"/>
/// <reference path="../utilities/Constants.ts"/>
/// <reference path="../utilities/utils.ts"/>
module ProductivityPaneLoader {
    export class SessionChangeManager {
        private paneMode: boolean;
        private firstEnabledToolName: string;

        constructor(paneMode: boolean, firstEnabledToolName: string) {
            this.paneMode = paneMode;
            this.firstEnabledToolName = firstEnabledToolName;
            this.registerEventHandler();
        }

        private registerEventHandler(): void {
            try {
                const windowObject = this.getWindowObject();

                windowObject.Xrm.App.sessions.addOnAfterSessionCreate(this.onSessionCreate.bind(this));
                windowObject.Xrm.App.sessions.addOnBeforeSessionSwitch(this.onBeforeSessionSwitch.bind(this));
                // windowObject.Xrm.App.sessions.addOnAftereSessionSwitch(this.onAfterSessionSwitch.bind(this));
                windowObject.Xrm.App.sessions.addOnAfterSessionClose(this.onSessionClose.bind(this));
            } catch (error) {
                console.log('error occured' + error);
                // Telemetry here
            }
        }

        /*
         * Init session storage data for each newly created session.
         * Home sesson init happens in onBeforeSessionSwitch().
         */
        private onSessionCreate(event: any): void {
            try {
                const createdSessionId = event.getEventArgs()._inputArguments.sessionId;

                let sessionStateData = {};
                this.paneMode
                    ? (sessionStateData[Constants.selectedAppSidePaneId] = this.firstEnabledToolName)
                    : (sessionStateData[Constants.selectedAppSidePaneId] = Constants.emptyString);

                SessionStateManager.setState(
                    Constants.productivityToolsSessionState + createdSessionId,
                    sessionStateData,
                );
            } catch (error) {
                console.log('Error occured on session create: ' + error);
                // Telemetry here
            }
        }

        /*
         * Update current selected app side pane in session storage before switching a session,
         * including caching the selected app side pane in home sesion.
         */
        private onBeforeSessionSwitch(event: any): void {
            try {
                const previousSessionId = event.getEventArgs()._inputArguments.previousSessionId;
                const xrmApp = this.getXrmAppApis();

                const currentSelectedAppSidePane = xrmApp.sidePanes.getSelectedPane();
                const currentSelectedAppSidePaneId = currentSelectedAppSidePane
                    ? currentSelectedAppSidePane.paneId
                    : Constants.emptyString;

                let sessionStateData = SessionStateManager.getState(
                    Constants.productivityToolsSessionState + previousSessionId,
                );

                // Handle home session init. This only happens once.
                // Notes: addOnBeforeSessionSwitch happens prior to addOnAfterSessionCreate.
                if (Utils.isNullOrUndefined(sessionStateData)) {
                    sessionStateData = {};
                }

                sessionStateData[Constants.selectedAppSidePaneId] = currentSelectedAppSidePaneId;
                SessionStateManager.setState(
                    Constants.productivityToolsSessionState + previousSessionId,
                    sessionStateData,
                );
            } catch (error) {
                console.log('Error occured on before session switch: ' + error);
                // Telemetry here
            }
        }

        // private onAfterSessionSwitch() {}

        /*
         * Remove session storage data associated with session id.
         */
        private onSessionClose(event: any): void {
            try {
                const closedSessionId = event.getEventArgs()._inputArguments.sessionId;
                SessionStateManager.deleteState(Constants.productivityToolsSessionState + closedSessionId);
            } catch (error) {
                console.log('Error occured on session close: ' + error);
                // Telemetry here
            }
        }

        private getWindowObject(): any {
            return window.top;
        }

        private getXrmAppApis(): any {
            return Xrm.App;
        }
    }
}
