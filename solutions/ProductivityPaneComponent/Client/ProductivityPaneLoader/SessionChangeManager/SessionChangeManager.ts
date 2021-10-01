/**
 * @license Copyright (c) Microsoft Corporation.  All rights reserved.
 */
/// <reference path="../utilities/Constants.ts"/>
/// <reference path="../utilities/XrmAppProxy.ts"/>
/// <reference path="../utilities/utils.ts"/>
/// <reference path="./SessionChangeHelper.ts"/>
module ProductivityPaneLoader {
    export class SessionChangeManager {
        private productivityToolList: ToolConfig[];
        private static instance: SessionChangeManager;

        private constructor(toolList: ToolConfig[]) {
            this.productivityToolList = toolList;
            this.registerEventHandlers();
        }

        public static Instantiate(toolList: ToolConfig[]): void {
            if (!SessionChangeManager.instance) {
                SessionChangeManager.instance = new SessionChangeManager(toolList);
            }
        }

        private registerEventHandlers(): void {
            try {
                (window as any).Xrm.App.sessions.addOnBeforeSessionSwitch(this.onBeforeSessionSwitch.bind(this));
                (window as any).Xrm.App.sessions.addOnAfterSessionSwitch(this.onAfterSessionSwitch.bind(this));
                (window as any).Xrm.App.sessions.addOnAfterSessionClose(this.onSessionClose.bind(this));

                Logger.logInfo(
                    EventType.SESSION_CHANGE_MANAGER_SUCCESS,
                    `${Constants.productivityToolsLogPrefix} Success: registered event handlers for on before/after session switch and on after session close`,
                );
            } catch (error) {
                Logger.logError(
                    EventType.SESSION_CHANGE_MANAGER_ERROR,
                    SessionChangeHelper.errorMessagesOnRegisterEventHandlers(error),
                );
            }
        }

        /**
         * Cache session state.
         */
        private onBeforeSessionSwitch(event: any): void {
            try {
                const previousSessionId = SessionChangeHelper.getPreviousSessionId(event);
                if (Microsoft.AppRuntime.Sessions.cacheSessionState) {
                    Microsoft.AppRuntime.Sessions.cacheSessionState(previousSessionId);
                }
            } catch (error) {
                Logger.logError(
                    EventType.SESSION_CHANGE_MANAGER_ERROR,
                    SessionChangeHelper.errorMessagesOnBeforeSessionSwitch(error),
                );
            }
        }

        /**
         * Restore session state and show/hide app side panes accordingly.
         */
        private onAfterSessionSwitch(): void {
            try {
                const newSessionId = XrmAppProxy.getFocusedSessionId();
                if (Microsoft.AppRuntime.Sessions.restoreSessionState) {
                    Microsoft.AppRuntime.Sessions.restoreSessionState(newSessionId);
                }

                Utils.isHomeSession(newSessionId) || Utils.isBeethovenDemoSession(newSessionId)
                    ? SessionChangeHelper.hideAllProductivityTools(this.productivityToolList)
                    : SessionChangeHelper.showAllProductivityTools(this.productivityToolList);
            } catch (error) {
                Logger.logError(
                    EventType.SESSION_CHANGE_MANAGER_ERROR,
                    SessionChangeHelper.errorMessagesOnAfterSessionSwitch(error),
                );
            }
        }

        /*
         * Remove session storage data associated with closed session id.
         */
        private onSessionClose(event: any): void {
            try {
                const closedSessionId = SessionChangeHelper.getSessionId(event);
                if (Microsoft.AppRuntime.Sessions.removeSessionState) {
                    Microsoft.AppRuntime.Sessions.removeSessionState(closedSessionId);
                }
            } catch (error) {
                Logger.logError(
                    EventType.SESSION_CHANGE_MANAGER_ERROR,
                    SessionChangeHelper.errorMessagesOnSessionClose(error),
                );
            }
        }
    }
}
