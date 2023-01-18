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
            // auto-turn on the case and KB suggestion for the org, based on FCS
            let isSuggestionsAutoProvisionChecked  = localStorage[StringConstants.SuggestionsModelingStatusKey];
            if (!isSuggestionsAutoProvisionChecked) {
                try {
                    let enableSuggestionsDefaultOn: boolean = false;
                    // FCS to auto enable case/KB suggestion
                    const isFCSEnabled: boolean = (Xrm.Utility.getGlobalContext() as any).getFeatureControlSetting(StringConstants.suggestionFcsNameSpace, StringConstants.suggestionFcsKey);
                    if (!!isFCSEnabled) {
                        enableSuggestionsDefaultOn = true;
                    }

                    if (enableSuggestionsDefaultOn) {
                        let shouldEnableFeatures = await this.shouldEnableCaseKbSuggestion(telemetryHelper);
                        telemetryHelper.logTelemetrySuccess(TelemetryEventTypes.AISuggestionFeaturesToAutoEnable, 
                            [{ name: "CaseSuggestion", value: shouldEnableFeatures.enableCaseSuggestion }, { name: "CaseSuggestionFeatureId", value: StringConstants.CaseSuggestionFeatureId },
                            { name: "KBSuggestion", value: shouldEnableFeatures.enableKBSuggestion }, { name: "KBSuggestionFeatureId", value: StringConstants.KbSuggestionFeatureId }]);
                        
                        if (shouldEnableFeatures.enableCaseSuggestion) {
                            this.enableAISuggestionsViaInitializeAnalytics(SmartAssistAnyEntityControl._context, StringConstants.CaseSuggestionFeatureId, telemetryHelper);
                        }

                        if (shouldEnableFeatures.enableKBSuggestion) {
                            this.enableAISuggestionsViaInitializeAnalytics(SmartAssistAnyEntityControl._context, StringConstants.KbSuggestionFeatureId, telemetryHelper);
                        }
                    }
                } catch (error) {
                    telemetryHelper.logTelemetryError(
                        TelemetryEventTypes.FailedToAutoEnableAISuggestion,
                        "An error occurred when checking/turning on suggestion modeling",
                        [{ name: "ExceptionDetails", value: error }]
                    );
                }  
                localStorage.setItem(StringConstants.SuggestionsModelingStatusKey, "true");
            }     
        }

        public static enableAISuggestionsViaInitializeAnalytics(context: Mscrm.ControlData<IInputBag>, featureId: string, telemetryHelper: TelemetryHelper): void {
            var msdyn_InitializeAnalyticsRequest = {
                featureIds: `${featureId}`,

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
                        telemetryHelper.logTelemetrySuccess(TelemetryEventTypes.AutoEnablingSuggestionAPICallSuccess,  [{ name: "FeatureId", value: featureId }]);
                    } else throw response;
                })
                .catch((error) => {
                    telemetryHelper.logTelemetryError(
                        TelemetryEventTypes.AutoEnablingSuggestionAPICallFailure,
                        "An error occurred when enabling suggestions (initializing analytics request)",
                        [{ name: "ExceptionDetails", value: error }, { name: "FeatureId", value: featureId }]
                    );
                });
        }

        public static shouldEnableCaseKbSuggestion = async(telemetryHelper): Promise<{enableCaseSuggestion:boolean, enableKBSuggestion:boolean}> => {
            // Check if case suggestion and KB suggestion are enabled
            let enableCaseSuggestion = false;
            let enableKBSuggestion = false;
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
                    let i: number;
                    for (i = 0; i < 2; i++) {
                        if (featureRecords.entities[i].msdyn_datainsightsandanalyticsfeatureid == StringConstants.CaseSuggestionFeatureId)
                        {
                            enableCaseSuggestion = !featureRecords.entities[i].msdyn_analyticschecksum;
                        }
                        else if (featureRecords.entities[i].msdyn_datainsightsandanalyticsfeatureid == StringConstants.KbSuggestionFeatureId)
                        {
                            enableKBSuggestion = !featureRecords.entities[i].msdyn_analyticschecksum;
                        }
                    }
                }
            } catch(error) {
                telemetryHelper.logTelemetryError(
                    TelemetryEventTypes.FailedToAutoEnableAISuggestion,
                    "Failed to determine if Case/KB suggestions are enabled",
                    [{ name: "ExceptionDetails", value: error }]);
            }

            return {enableCaseSuggestion, enableKBSuggestion};
        }
    }
}