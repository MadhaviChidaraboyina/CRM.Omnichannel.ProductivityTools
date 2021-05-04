/**
 * @license Copyright (c) Microsoft Corporation.  All rights reserved.
 */
/// <reference path="../../../../../packages/Crm.ClientApiTypings.1.3.2084/clientapi/XrmClientApi.d.ts" />
module ProductivityPaneLoader {
    export class XrmAppProxy {
        public static getXrmAppApis(): any {
            return Xrm.App;
        }

        public static getFocusedSessionId(): any {
            return XrmAppProxy.getXrmAppApis().sessions.getFocusedSession().sessionId;
        }

        public static getSelectedAppSidePane(): any {
            return XrmAppProxy.getXrmAppApis().sidePanes.getSelectedPane();
        }

        public static getAppSidePane(paneId: string): any {
            return XrmAppProxy.getXrmAppApis().sidePanes.getPane(paneId);
        }

        public static setSelectedAppSidePane(paneId: string): void {
            XrmAppProxy.getAppSidePane(paneId).select();
        }

        public static getAppSidePanesState(): number {
            // 0: collapsed; 1: expanded.
            return XrmAppProxy.getXrmAppApis().sidePanes.state;
        }

        public static setAppSidePanesState(state: number): void {
            XrmAppProxy.getXrmAppApis().sidePanes.state = state;
        }
    }
}
