/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */


module MscrmControls.SmartassistPanelControl {
	/*
	* utility methods
	*/
    export class Utility {

		/** 
		*  Utility function - returns empty string if the value provided is null or Undefined
	    * @param value: string value to be checked null or undefined.
		*/
        public static GetValue(value: string): any {
            if (SmartassistPanelControl._context.utils.isNullOrUndefined(value)) {
                return "";
            }
            return value;
        }

        /**
         * Check if string is null or empty
         * @returns boolean
         * @param value
         */
        public static isNullOrEmptyString(value: string): boolean {
            return SmartassistPanelControl._context.utils.isNullOrEmptyString(value);
        }

        /**
         * Removes special chars {} and returns lowercase guid
         * @returns formated guid
         * @param value: guid to format
         */
        public static FormatGuid(value: string): string {
            if (!value) return value;
            return value.replace(/[{}]/g, "").toLowerCase();
        }

        /**
         * Check if string is valid json
         * @param str: json string
         */
        public static IsValidJsonString(str: string) {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        }

        /**
         * Get localization string
         * @param resourceName: resource id
         */
        public static getString(resourceName: string): string {
            if (!SmartassistPanelControl._context) {
                return resourceName;
            }
            return SmartassistPanelControl._context.resources.getString(resourceName);
        }

        /**
        * Get current session id.
        */
         public static getCurrentSessionId(): string {
            return Microsoft.AppRuntime.Sessions.getFocusedSession().sessionId;
        }

        /**
        * Get current session id.
        */
         public static async getCurrentAnchorTabContext() {
            var context = await Microsoft.AppRuntime.Sessions.getFocusedSession().getContext();

            //Get anchor context
            return context.getTabContext("anchor");
        }
        
        public static isHomeSession() {
            return Utility.getCurrentSessionId() == "session-id-0";
        }

        /**
         * Update badge number
         * @param notificationNumber: notification count
         */
        public static UpdateBadge(notificationNumber: number) {
            const pane = Xrm.App.sidePanes.getPane(Constants.SmartAssistPaneId);
            notificationNumber == 0 ? pane.clearBadge() : pane.setBadge(notificationNumber);
        }

        public static SetSidePaneHidden(value: boolean) {
            Xrm.App.sidePanes.getPane(Constants.SmartAssistPaneId).hidden = value;
        }

        /**
         * Returns id for the config div.
         * @param configId
         */
        public static getConfigDivId(configId: string): string {
            return "config-" + configId;
        }

        /**
         * Check if provided entity name is valid
         * @param entityName: source entity name
         */
        public static isValidSourceEntityName(entityName: string): boolean {
            if (Constants.ValidSourceEntities.indexOf(entityName) == -1 || Utility.isNullOrEmptyString(entityName)) {
                return false;
            }
            return true;
        }

        /** Get App runtime envirnonment data */
        public static async getAppRuntimeEnvironment() {
            return await Microsoft.AppRuntime.Utility.getEnvironment();
        }

        /**Get live work stream id */
        public static getLiveWorkStreamId(): string {
            let eventParameters = new TelemetryLogger.EventParameters();
            let workStreamId: string = null;
            try {
                let cifUtil = new Microsoft.CIFramework.External.CIFExternalUtilityImpl();
                let templateParams = cifUtil.getSessionTemplateParams();
                let data = templateParams.data;
                workStreamId = data.ocContext.config.sessionParams.LiveWorkStreamId;
            } catch (error) {
                eventParameters.addParameter("Exception Details", error.message);
                SmartassistPanelControl._telemetryReporter.logError("Main Component", "GetLiveWorkStreamId", "Failed to retrieve Live WorkStream id from form param", eventParameters);
            }
            return workStreamId;
        }

        /**Toggle tooltip icon */
        public static toggleTooltip() {
            var popup = document.getElementById('IconPopOutId');
            popup.classList.toggle('show');
            if (popup.classList.contains('show')) {
                popup.focus();
            } else {
                document.getElementById('sapanel-info-icon').focus();
            }
        }
    }
}