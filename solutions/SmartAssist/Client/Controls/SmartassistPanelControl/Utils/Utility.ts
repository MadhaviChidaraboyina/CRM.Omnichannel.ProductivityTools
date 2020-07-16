﻿/**
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
         * Returns id for the config div.
         * @param configId
         */
        public static getConfigDivId(configId: string): string {
            return "config-" + configId;
        }

        /**
         * Dispatches Productivity Panel In Bound Event
         * @param rerender: PP Rerender obj
         */
        public static DispatchPanelInboundEvent(rerender: MscrmControls.PanelControl.Rerender | MscrmControls.PanelControl.PanelNotification) {
            let eventPayload = new MscrmControls.PanelControl.PanelInboundEventDataModel(Constants.ControlId, rerender);
            let event = new CustomEvent(MscrmControls.PanelControl.PanelInboundEventName, { "detail": eventPayload });
            window.top.dispatchEvent(event);
        }
    }
}