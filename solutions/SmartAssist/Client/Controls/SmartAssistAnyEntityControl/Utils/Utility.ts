/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

module MscrmControls.SmartAssistAnyEntityControl {

    /**Utility methods */
    export class Utility {

		/** Utility function - returns empty string if the value provided is null or Undefined.
	    * @param value: string value to be checked null or undefined.
		*/
        public static GetValue(value: string): any {
            if (SmartAssistAnyEntityControl._context.utils.isNullOrUndefined(value)) {
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
            return SmartAssistAnyEntityControl._context.utils.isNullOrEmptyString(value);
        }

        /**
         * Get current session context.
         * */
        public static getCurrentSessionContext(): AppRuntimeClientSdk.ISessionContext {
            return SmartAssistAnyEntityControl._sessionContext; 
        }

        /**
         * Get current session id.
         */
        public static getCurrentSessionId(): string {
            return Microsoft.AppRuntime.Sessions.getFocusedSession().sessionId;
        }

        /**
         * Get RC Component Id
         * @param suggestionId: suggestion entity record id
         */
        public static getComponentId(suggestionId: string) {
            return "Suggestion_" + suggestionId + "_component";
        }

        /**
         * get Loading Component dynamic id
         * @param saConfigId: smart assist config id
         */
        public static getLoaderComponent(saConfigId: string) {
            return StringConstants.SALoaderCss + "-" + saConfigId;
        }

        /**
         * Get localization string
         * @param resourceName: resource id
         */
        public static getString(resourceName: string): string {
            if (!SmartAssistAnyEntityControl._context) {
                return resourceName;
            }
            return SmartAssistAnyEntityControl._context.resources.getString(resourceName);
        }

        /**
         * Dispatches Productivity Panel In Bound Event
         * @param notificationNumber: Notification Number
         */
        public static DispatchPanelInboundEvent(notificationNumber: number, sesssionId: string) {
            let eventPayload = new MscrmControls.PanelControl.PanelInboundEventDataModel(StringConstants.PPChildControlId, new MscrmControls.PanelControl.PanelNotification(notificationNumber, sesssionId));
            let event = new CustomEvent(MscrmControls.PanelControl.PanelInboundEventName, { "detail": eventPayload });
            window.top.dispatchEvent(event);
        }
    }
}