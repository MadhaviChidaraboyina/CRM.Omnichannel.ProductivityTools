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

        public static isBeethovenChatWidgetSession(sessionId: string): boolean {
            // Temporary workaround for disabling app side pane control in chat widget session for early access.
            // This check will be removed after we have solid setVisibility API released.
            try {
                const session = Xrm.App.sessions.getSession(sessionId) as any;
                if (
                    session &&
                    session.anchorTab &&
                    session.anchorTab.currentPageInput &&
                    session.anchorTab.currentPageInput.data
                ) {
                    return JSON.parse(session.anchorTab.currentPageInput.data).pageType === 'chatDemo';
                }
            } catch (e) {}
            return false;
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
            return (
                Xrm.Internal.isFeatureEnabled(Constants.FCB_ProductivityTools_UseAppSidePanes) ||
                Xrm.Internal.isFeatureEnabled(Constants.FCB_October2021Update)
            );
        }

        public static convertMapToJsonString(map: Map<string, string>): string {
            let jsonObject = {};
            map.forEach((value, key) => {
                jsonObject[key] = value;
            });
            return JSON.stringify(jsonObject);
        }

        public static convertJsonStringToMap(jsonString: string): Map<string, string> {
            const map = new Map<string, string>();
            const jsonObj = JSON.parse(jsonString);
            for (var key in jsonObj) {
                map.set(key, jsonObj[key]);
            }
            return map;
        }
    }
}
