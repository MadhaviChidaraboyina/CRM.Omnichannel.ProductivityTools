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
            return value.replace(/[{}]/g, "").toLowerCase();
        }

        /** Get Anchor tab context from CEC*/
        public static GetAnchorTabContext() {
            var context = Microsoft.AppRuntime.Sessions.getFocusedSession().context;
            var anchorContext: any = null;
            if (context) {
                anchorContext = context.getTabContext("anchor") as any;
            }
            return anchorContext;
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
    }
}