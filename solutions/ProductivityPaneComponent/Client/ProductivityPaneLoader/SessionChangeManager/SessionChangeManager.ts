/**
 * @license Copyright (c) Microsoft Corporation.  All rights reserved.
 */
/// <reference path="../SessionStateManager/SessionStateManager.ts"/>
/// <reference path="../utilities/Constants.ts"/>
module ProductivityPaneLoader {
    export class SessionChangeManager {
        private paneMode: boolean;
        private firstEnabledToolName: string;

        constructor(paneMode: boolean, firstEnabledToolName: string) {
            this.paneMode = paneMode;
            this.firstEnabledToolName = firstEnabledToolName;
            this.registerEventHandler();
        }

        private registerEventHandler() {
            try {
                const windowObject = this.getWindowObject();
                windowObject.Xrm.App.sessions.addOnAfterSessionCreate(this.onSessionCreated.bind(this));
                // windowObject.Xrm.App.sessions.addOnAfterSessionSwitch(this.onBeforeSessionSwitched.bind(this));
                // windowObject.Xrm.App.sessions.addOnBeforeSessionSwitch(this.onAfterSessionSwitched.bind(this));
                windowObject.Xrm.App.sessions.addOnAfterSessionClose(this.onSessionClosed.bind(this));
            } catch (error) {
                console.log('error occured' + error);
                // Telemetry here
            }
        }

        private onSessionCreated(event: any) {
            try {
                const newSessionId = event.getEventArgs()._inputArguments.SessionId;
                let sessionStateData = {};
                this.paneMode
                    ? (sessionStorage[Constants.selectedTool] = this.firstEnabledToolName)
                    : (sessionStorage[Constants.selectedTool] = Constants.emptyString);
                SessionStateManager.setState(
                    Constants.productivityToolsSessionState + newSessionId,
                    JSON.stringify(sessionStateData),
                );
            } catch (error) {
                console.log('Error occured on session created: ' + error);
                // Telemetry here
            }
        }

        // private onBeforeSessionSwitched() {}

        // private onAfterSessionSwitched() {}

        private onSessionClosed(event: any) {
            try {
                const closedSessionId = event.getEventArgs()._inputArguments.SessionId;
                SessionStateManager.destroy(Constants.productivityToolsSessionState + closedSessionId);
            } catch (error) {
                console.log('Error occured on session created: ' + error);
                // Telemetry here
            }
        }

        private getWindowObject(): any {
            return window.top;
        }
    }
}
