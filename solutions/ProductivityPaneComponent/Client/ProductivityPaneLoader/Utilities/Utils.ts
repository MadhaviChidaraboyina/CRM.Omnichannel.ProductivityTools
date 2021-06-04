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

        public static isEqual(str1: string, str2: string): boolean {
            return str1 === str2;
        }

        public static isHomeSession(sessionId: string) {
            return Utils.isEqual(sessionId, Constants.homeSessionId);
        }

        public static isShownOnAllSessions(controlName: string): boolean {
            // Add OR condition here if there is another tool to be shown on
            // home session. Currently there is only Teams Collab control.
            return Utils.isEqual(controlName, Constants.teamsCollabControlName);
        }

        /**
         * Indicate if the control is loaded via app side panes
         */
        public static isUsingAppSidePanes(): boolean {
            return Xrm.Internal.isFeatureEnabled(Constants.fcbProductivityToolsUseAppSidePanes);
        }
    }
}
