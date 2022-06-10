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
            return context.utils.isFeatureEnabled(StringConstants.FCB_ProductivityTools_UseAppSidePanes) ||
                context.utils.isFeatureEnabled(StringConstants.FCB_October2021Update);
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

        public static async checkAndTurnOnSuggestionModeling(telemetryHelper: TelemetryHelper) {
            // auto-turn on the case and KB suggestion for the org, based on FCS AND
            // either FCB for October 2022 Update is ON or org created after May 20, 2022
            let isSuggestionsAutoProvisionChecked  = localStorage[StringConstants.SuggestionsModelingStatusKey];
            if (!isSuggestionsAutoProvisionChecked) {
                try {
                    let enableSuggestionsDefaultOn: boolean = false;
                    // FCS to auto enable case/KB suggestion
                    const isFCSEnabled: boolean = (Xrm.Utility.getGlobalContext() as any).getFeatureControlSetting(StringConstants.suggestionFcsNameSpace, StringConstants.suggestionFcsKey);
                    if (!!isFCSEnabled) {
                        // Check FCB for October 2022 Update
                        enableSuggestionsDefaultOn = SmartAssistAnyEntityControl._context.utils.isFeatureEnabled(StringConstants.FCB_October2022Update);

                        // If FCB for October 2022 Update is OFF, keep existing logic to check for new org created after 20 May 2022
                        if (!enableSuggestionsDefaultOn) {
                            enableSuggestionsDefaultOn = await this.isNewOrg(telemetryHelper);                      
                        }
                    }

                    if (enableSuggestionsDefaultOn) {
                        const shouldEnableCaseKbSuggestion = await this.shouldEnableCaseKbSuggestion(telemetryHelper);
                        if (shouldEnableCaseKbSuggestion) {
                            this.enableAISuggestionsForCaseAndKb(SmartAssistAnyEntityControl._context, telemetryHelper);
                            telemetryHelper.logTelemetrySuccess(TelemetryEventTypes.AISuggestionAutoEnabled, null);
                        } else {
                            telemetryHelper.logTelemetrySuccess(TelemetryEventTypes.AISuggestionNotAutoEnabled, null);
                        }
                    } 
                } catch (error) {
                    telemetryHelper.logTelemetryError(TelemetryEventTypes.FailedToAutoEnableAISuggestion, error, null);
                }  
                localStorage.setItem(StringConstants.SuggestionsModelingStatusKey, "true");
            }     
        }

        public static enableAISuggestionsForCaseAndKb(context: Mscrm.ControlData<IInputBag>, telemetryHelper: TelemetryHelper): void {
            var msdyn_InitializeAnalyticsRequest = {
                featureIds: `${StringConstants.CaseSuggestionFeatureId},${StringConstants.KbSuggestionFeatureId}`,

                getMetadata: function() {
                    return {
                        boundParameter: null,
                        parameterTypes: {
                            "featureIds": {
                                "typeName": "Edm.String",
                                "structuralProperty": 1
                            }
                        },
                        operationType: 0,
                        operationName: StringConstants.InitializeAnalytics
                    };
                }
            };

            context.webAPI.execute(msdyn_InitializeAnalyticsRequest)
                .then(function (response) {
                    if (response.status === 204 || response.status === 200) {
                        this.telemetryHelper.logTelemetrySuccess(TelemetryEventTypes.AISuggestionEnabled,  null);
                    } else {
                        this.telemetryHelper.logTelemetryError(TelemetryEventTypes.FailedToTriggerAISuggestionModeling, response.status, null);
                    }
                })
                .catch((error) => {
                    telemetryHelper.logTelemetryError(TelemetryEventTypes.FailedToTriggerAISuggestionModeling, error, null);
                });
        }

        public static isNewOrg = async(telemetryHelper: TelemetryHelper): Promise<boolean> => {
            // Only auto turn on suggestion for org creation date is after May 20, 2022
            let isNewOrg: boolean = false;
            try {
                const orgEntity = await SmartAssistAnyEntityControl._context.webAPI.retrieveMultipleRecords(
                    'organization', 
                    '?$top=1&$select=createdon'
                ) as any;

                if (orgEntity && orgEntity.entities && orgEntity.entities.length == 1) {
                    isNewOrg = Date.parse(orgEntity.entities[0].createdon) > Date.parse(StringConstants.date);
                }
            } catch(error) {
                telemetryHelper.logTelemetryError(TelemetryEventTypes.FailedToAutoEnableAISuggestion, error, null);
            }
            return isNewOrg;
        }

        public static shouldEnableCaseKbSuggestion = async(telemetryHelper): Promise<boolean> => {
            // Check if case suggestion and KB suggestion are enabled
            let isNotEnabled = false;
            try {
                const fetchXmlQuery = 
                    "<fetch version='1.0' output-format='xml-platform' mapping='logical'>" + 
                    `<entity name='${StringConstants.DataInsightsAndAnalyticsFeature}'>` + 
                    `<attribute name = 'msdyn_datainsightsandanalyticsfeatureid'/>` + 
                    `<attribute name = 'msdyn_analyticschecksum'/>` + 
                    "<filter type = 'or'>" + 
                    `<condition attribute = 'msdyn_datainsightsandanalyticsfeatureid' operator = 'eq' value = '${StringConstants.CaseSuggestionFeatureId}'/>` + 
                    `<condition attribute = 'msdyn_datainsightsandanalyticsfeatureid' operator = 'eq' value = '${StringConstants.KbSuggestionFeatureId}'/>` + 
                    "</filter>" + 
                    "</entity>" + 
                    "</fetch>"
                const featureRecords = await SmartAssistAnyEntityControl._context.webAPI.retrieveMultipleRecords(
                    StringConstants.DataInsightsAndAnalyticsFeature,
                    "?fetchXml=" + fetchXmlQuery
                ) as any;

                if (featureRecords && featureRecords.entities && featureRecords.entities.length === 2) {
                    isNotEnabled = !featureRecords.entities[0].msdyn_analyticschecksum && !featureRecords.entities[1].msdyn_analyticschecksum;
                }
            } catch(error) {
                telemetryHelper.logTelemetryError(TelemetryEventTypes.FailedToAutoEnableAISuggestion, error, null);
            }

            return isNotEnabled;
        }
    }
}