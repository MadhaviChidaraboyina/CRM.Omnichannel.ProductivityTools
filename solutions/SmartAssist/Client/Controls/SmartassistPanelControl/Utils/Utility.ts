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
        * Get current AnchorTabContext
        */
         public static async getCurrentAnchorTabContext() {
            var context = await Microsoft.AppRuntime.Sessions.getFocusedSession().getContext();

            //Get anchor context
            return context.getTabContext("anchor");
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
        public static async getLiveWorkStreamId(): Promise<string | undefined> {
			const timer = SmartassistPanelControl._telemetryReporter.startTimer("GetLiveWorkStreamId");
			const params = new TelemetryLogger.EventParameters();
			const eventParameters = new TelemetryLogger.EventParameters();

            let errorCIF, errorAPM;

            let workStreamId: string | undefined;
            try {
                let cifUtil = new Microsoft.CIFramework.External.CIFExternalUtilityImpl();
                let templateParams = cifUtil.getSessionTemplateParams();
                let data = templateParams.data;
                if (typeof data === "string") data = JSON.parse(data);
                workStreamId = data.ocContext.config.sessionParams.LiveWorkStreamId;
				params.addParameter("Source", "CIF");
            } catch (error) {
                errorCIF = error;
                eventParameters.addParameter("ExceptionDetails", error);
                eventParameters.addParameter("Message", "Failed to retrieve Live WorkStream id from form param");
                SmartassistPanelControl._telemetryReporter.logSuccess("GetLiveWorkStreamIdTrace", eventParameters);
            }

            // Fallback to APM to get the workstream ID.
            if (workStreamId == null) {
                eventParameters.addParameter("Message", "Falling back to APM to retrieve the Live WorkStream id");
                SmartassistPanelControl._telemetryReporter.logSuccess("GetLiveWorkStreamIdTrace", eventParameters);
                try {
                    const context = await Microsoft.AppRuntime.Sessions.getFocusedSession().getContext();
                    let data: any = context.parameters["data"];
                    if (typeof data === "string") data = JSON.parse(data);
                    workStreamId = data.ocContext.config.sessionParams.LiveWorkStreamId;
                    params.addParameter("Source", "APM");
                } catch (error) {
                    errorAPM = error;
                    eventParameters.addParameter("ExceptionDetails", error);
                    SmartassistPanelControl._telemetryReporter.logError("GetLiveWorkStreamIdTrace", "Failed to retrieve Live WorkStream id from APM", eventParameters);        
                }
            }

			// Handle timer telemetry.
			params.addParameter("WorkstreamId", workStreamId);
            params.addParameter("ExceptionDetails", JSON.stringify({
                CIF: errorCIF,
                APM: errorAPM
            }));
            if (workStreamId == null) 
				timer.fail("Failed to find workstreamId", params);
			else 
				timer.stop(params);

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