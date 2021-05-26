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
         * Get current session context by id.
         * */
        public static async getCurrentSessionContextById(sessionId) {
            return Microsoft.AppRuntime.Sessions.getSession(sessionId).getContext();
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
        public static getRCComponentId(suggestionId: string) {
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
         * Get the key for cachepool
         * */
        public static getCachePoolKey(sessioId: string) {
            if (Utility.isNullOrEmptyString(sessioId)) {
                return "smartassist-" + Utility.getCurrentSessionId() + "-cachepool";
            } else {
                return "smartassist-" + sessioId + "-cachepool"
            }
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

        /**
         * Update app side pane badge
         * @param notificationNumber: notification count
         */
         public static updateBadge(notificationNumber: number) {
            // Don't update badge if current pane is smart assist and is expanded
            if (Xrm.App.sidePanes.getSelectedPane().paneId === StringConstants.SmartAssistPaneId &&
                Xrm.App.sidePanes.state == XrmClientApi.Constants.SidePanesState.Expanded) {
                return;
            }

            const pane = Xrm.App.sidePanes.getPane(StringConstants.SmartAssistPaneId);
            // If app side pane ID does not exist, getPane() returns undefined. 
            if (pane) {
                const badge = pane.badge && typeof(pane.badge) == 'number'
                    ? pane.badge + notificationNumber
                    : notificationNumber;
                pane.badge = badge <= 0 ? false : badge;
            }
        }

        /**
        * Indicate if smart assist control is rendered in app side pane
        * @param context: PCF control context
        */
        public static isUsingAppSidePane(context: any): boolean {
            return context.utils.isFeatureEnabled(StringConstants.FCB_ProductivityTools_UseAppSidePanes);
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
                SmartAssistAnyEntityControl._telemetryReporter.logError("Main Component", "GetLiveWorkStreamId", "Failed to retrieve Live WorkStream id from form param", eventParameters);
            }
            return workStreamId;
        }

        /**Get Anchor tab context */
        public static async getAnchorContext() {
            let tabcontext = null;
            var context = await Microsoft.AppRuntime.Sessions.getFocusedSession().getContext() as any;
            if (context) {
                tabcontext = context.getTabContext("anchor");
            }
            return tabcontext
        }

        /**Parse json string to map object */
        public static getMapObject(jsonInput: string): { [key: string]: string } {
            return JSON.parse(jsonInput) as { [key: string]: string };
        }
    }
}