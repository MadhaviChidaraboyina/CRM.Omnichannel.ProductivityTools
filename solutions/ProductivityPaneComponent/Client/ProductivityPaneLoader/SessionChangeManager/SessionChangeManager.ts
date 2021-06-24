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
         * Set pane.hidden accordingly. Productivity tools are hidden in home session and not hidden in other sessions.
         * Init session storage if it is null. Select and collapse/expande app side pane based on session storage data.
         */
        private onAfterSessionSwitch(event: any): void {
            try {
                const newSessionId = SessionChangeHelper.getNewSessionId(event);
                Utils.isHomeSession(newSessionId) || Utils.isBeethovenChatWidgetSession(newSessionId)
                    ? SessionChangeHelper.hideAllProductivityTools(this.ProductivityToolList)
                    : SessionChangeHelper.showAllProductivityTools(this.ProductivityToolList);

                const sessionStorageData = SessionStateManager.getSessionStorageData(
                    Constants.appSidePaneSessionState + newSessionId,
                );
                if (Utils.isNullOrUndefined(sessionStorageData)) {
                    SessionStateManager.initSessionState(
                        this.isDefaultExpanded,
                        this.ProductivityToolList,
                        newSessionId,
                    );
                }
                SessionStateManager.restoreSessionState(newSessionId);
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
