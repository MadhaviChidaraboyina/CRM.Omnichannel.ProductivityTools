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
                const windowObject = SessionChangeHelper.getWindowObject();

                windowObject.Xrm.App.sessions.addOnBeforeSessionSwitch(this.onBeforeSessionSwitch.bind(this));
                windowObject.Xrm.App.sessions.addOnAfterSessionSwitch(this.onAfterSessionSwitch.bind(this));
                windowObject.Xrm.App.sessions.addOnAfterSessionClose(this.onSessionClose.bind(this));
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

        /*
         * Update current selected app side pane and AppSidePanesState in session storage before switching a session.
         * AppSidePanesState = 0: collapsed; AppSidePanesState = 1: expanded. Additionally, init home session.
         */
        private onBeforeSessionSwitch(event: any): void {
            try {
                const previousSessionId = SessionChangeHelper.getPreviousSessionId(event);
                SessionStateManager.updateSessionState(previousSessionId);
            } catch (error) {
                Logger.logError(
                    EventType.SESSION_CHANGE_MANAGER_ERROR,
                    SessionChangeHelper.errorMessagesOnBeforeSessionSwitch(error),
                );
            }
        }

        /*
         * Set pane.hidden accordingly. Productivity tools are hidden in home session and Beethoven chat widget session, and not hidden
         * in other sessions. Init session storage if it is null. Select and collapse/expand app side pane based on session storage data.
         */
        private onAfterSessionSwitch(event: any): void {
            try {
                const newSessionId = XrmAppProxy.getFocusedSessionId();
                const sessionStorageData = SessionStateManager.getSessionStorageData(
                    Constants.appSidePaneSessionState + newSessionId,
                );
                if (Utils.isNullOrUndefined(sessionStorageData)) {
                    SessionStateManager.initSessionState(newSessionId);
                }
                SessionStateManager.restoreSessionState(newSessionId);
                Utils.isHomeSession(newSessionId) || Utils.isBeethovenChatWidgetSession(newSessionId)
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
         * Remove session storage data associated with session id.
         */
        private onSessionClose(event: any): void {
            try {
                const closedSessionId = SessionChangeHelper.getSessionId(event);
                SessionStateManager.deleteSessionStorageData(Constants.appSidePaneSessionState + closedSessionId);
            } catch (error) {
                Logger.logError(
                    EventType.SESSION_CHANGE_MANAGER_ERROR,
                    SessionChangeHelper.errorMessagesOnAfterSessionSwitch(error),
                );
            }
        }
    }
}
