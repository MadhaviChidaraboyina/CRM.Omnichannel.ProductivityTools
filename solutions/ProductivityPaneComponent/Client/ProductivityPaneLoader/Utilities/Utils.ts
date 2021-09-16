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

        /**
         * Temporary workaround for disabling app side pane control in chat widget session or voice demo session for early access.
         * This check will be removed after we have solid setVisibility API released.
         */
        public static isBeethovenDemoSession(sessionId: string): boolean {
            try {
                const session = Xrm.App.sessions.getSession(sessionId) as any;
                if (
                    session &&
                    session.anchorTab &&
                    session.anchorTab.currentPageInput &&
                    session.anchorTab.currentPageInput.data
                ) {
                    let pageType = JSON.parse(session.anchorTab.currentPageInput.data).pageType;
                    return pageType === 'chatDemo' || pageType === 'voiceDemo';
                }
            } catch (e) {}
            return false;
        }

        public static isHomeSession(sessionId: string) {
            return Utils.isEqual(sessionId, Constants.homeSessionId);
        }

        /**
         * Add OR condition here if there is another tool to be shown on
         * all sessions. Currently there is only Teams Collab control.
         */
        public static isShownOnAllSessions(controlName: string): boolean {
            return Utils.isEqual(controlName, Constants.teamsCollabControlName);
        }

        /**
         * The badge on app side pane will be cleared automatically if the pane is selected and
         * keepBadgeOnSelect is passed false. Teams Collab control wants to keep badge on select.
         */
        public static keepBadgeOnSelect(controlName: string): boolean {
            return Utils.isEqual(controlName, Constants.teamsCollabControlName);
        }

        /**
         * Return true if the app side pane header needs to be removed for certain controls.
         */
        public static hideHeader(controlName: string): boolean {
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

        /**
         * Push more pane here if it requires session state persistence.
         * @returns An Array that consist of panes that requires session state persistence.
         */
        public static getSessionSidePanes(): any {
            let sessionSidePanes = new Array();
            sessionSidePanes.push(XrmAppProxy.getAppSidePane(Constants.SmartAssistPaneId));
            return sessionSidePanes;
        }
    }
}
