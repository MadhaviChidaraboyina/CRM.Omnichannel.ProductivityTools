/**
 * @license Copyright (c) Microsoft Corporation.  All rights reserved.
 */
/// <reference path="../../../../../packages/Crm.ClientApiTypings.1.3.2084/clientapi/XrmClientApiInternal.d.ts" />
/// <reference path="./Constants.ts" />
module ProductivityPaneLoader {
    export class Utils {
        public static isNullOrUndefined(obj: any) {
            return obj === null || obj === undefined;
        }

        public static isEmpty(str: string): boolean {
            return str === '';
        }

        public static isEqual(objOne: any, objTwo: any): boolean {
            return objOne === objTwo;
        }

        public static isHomeSession(sessionId: string) {
            return Utils.isEqual(sessionId, Constants.homeSessionId);
        }

        public static isShownOnAllSessions(controlName: string): boolean {
            // Add OR condition here if there is another tool to be shown on
            // all sessions. Currently there is only Teams Collab control.
            return Utils.isEqual(controlName, Constants.teamsCollabControlName);
        }

        public static keepBadgeOnSelect(controlName: string): boolean {
            // The badge on app side pane will be cleared automatically if the pane is selected and
            // keepBadgeOnSelect is passed false. Teams Collab control wants to keep badge on select.
            return Utils.isEqual(controlName, Constants.teamsCollabControlName);
        }

        /**
         * Indicate if the control is loaded via app side panes.
         */
        public static isUsingAppSidePanes(): boolean {
            return Xrm.Internal.isFeatureEnabled(Constants.fcbProductivityToolsUseAppSidePanes);
        }
    }
}
