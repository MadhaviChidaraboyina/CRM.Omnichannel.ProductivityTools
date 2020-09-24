module MscrmControls.SmartAssistAnyEntityControl {

    export class TelemetryHelper {
        private recordId: string;
		private saconfig: SAConfig;

		constructor(recordId: string, saConfig: SAConfig) {
            this.recordId = recordId;
            this.saconfig = saConfig;
        }

		/**
		 * Log telemetry error
		 * @param eventType
		 * @param error
		 * @param additionalParameter
		 */
		public logTelemetryError(eventType: string, error: any, additionalParameter: Mscrm.EventParameter[]) {
			const params = this.getTelemetryParameter(additionalParameter,)
			SmartAssistAnyEntityControl._context.reporting.reportFailure(eventType, error, "TSG-TODO", params);
		}

		/**
		 * log success event.
		 * @param eventType
		 * @param additionalParameter
		 */
		public logTelemetrySuccess(eventType: string, additionalParameter: Mscrm.EventParameter[]) {
			const params = this.getTelemetryParameter(additionalParameter);
			SmartAssistAnyEntityControl._context.reporting.reportSuccess(eventType, params);
		}

		/**
		 * Get Telemetry event parameter
		 * @param additionalParameters
		 */
		public getTelemetryParameter(additionalParameters: Mscrm.EventParameter[]): Mscrm.EventParameter[] {
			var params: Mscrm.EventParameter[] = [
				{ name: "SuggestionForEntityId", value: this.recordId },
				{ name: "SuggestedForEntityLogicalName", value: this.saconfig.SourceEntityName },
				{ name: "SuggestionProviderName", value: this.saconfig.SuggestionProvider },
				{ name: "SuggestionType", value: this.saconfig.SuggestionType },
				{ name: "IsEnabled", value: `${this.saconfig.IsEnabled}` },
				{ name: "IsDefault", value: `${this.saconfig.IsDefault}` },
				{ name: "Session-Id", value: Utility.getCurrentSessionId() }
			]
			if (additionalParameters) {
				params.concat(additionalParameters);
            }
			return params;
		}
    }

	/**
	 * All Telemetry event type.
	 * */
	export class TelemetryEventTypes {
		public static componentName = "MscrmControls.SmartAssistAnyEntityControl.";
		public static ControlInitializationStarted = TelemetryEventTypes.componentName + "ControlInitializationStarted";
		public static DataFetchedFromAPI = TelemetryEventTypes.componentName + "DataFetchedFromAPI";
		public static ThirdpartyBotNotEnabled = TelemetryEventTypes.componentName + "ThirdpartyBotNotEnabled";
		public static DataFetchedFromCache = TelemetryEventTypes.componentName + "DataFetchedFromCache";
		public static NoDataFound = TelemetryEventTypes.componentName + "NoDataFound";
		public static NoDataFoundFromAPI = TelemetryEventTypes.componentName + "NoDataFoundFromAPI";
		public static NoDataFoundInCache = TelemetryEventTypes.componentName + "NoDataFoundInCache";
		public static CacheInitializationFailed = TelemetryEventTypes.componentName + "CacheInitializationFailed";
		public static FetchingDataFromAPI = TelemetryEventTypes.componentName + "FetchingDataFromAPI";
		public static DataFetchedFromCachePool = TelemetryEventTypes.componentName + "DataFetchedFromCachePool";
		public static ParameterValidationFailed = TelemetryEventTypes.componentName + "ParameterValidationFailed";
		public static ContainerStateIsDisabled = TelemetryEventTypes.componentName + "ContainerStateIsDisabled";
		public static FailedToFetchDataFromAPI = TelemetryEventTypes.componentName + "FailedToFetchDataFromAPI";
		public static FailedToFetchDataFromCache = TelemetryEventTypes.componentName + "FailedToFetchDataFromCache";
		public static FailedToFetchData = TelemetryEventTypes.componentName + "FailedToFetchData";
		public static CachePoolAddOrUpdateFailed = TelemetryEventTypes.componentName + "CachePoolAddOrUpdateFailed";
		public static FailedToFetchDataFromCachePool = TelemetryEventTypes.componentName + "FailedToFetchDataFromCachePool";
		public static CachePoolUpdated = TelemetryEventTypes.componentName + "CachePoolUpdated";
		public static SuggestionProviderNotFound = TelemetryEventTypes.componentName + "SuggestionProviderNotFound";
		public static SuggestionProviderFound = TelemetryEventTypes.componentName + "SuggestionProviderFound";
		public static InitiatingRMControl = TelemetryEventTypes.componentName + "InitiatingRMControl";
		public static DismissPreviousSuggestion = TelemetryEventTypes.componentName + "DismissPreviousSuggestion";
		public static FailedToDismissPreviousSuggestion = TelemetryEventTypes.componentName + "FailedToDismissPreviousSuggestion";
		public static ClearedCacheOnFPBEvent = TelemetryEventTypes.componentName + "ClearedCacheOnFPBEvent";
		public static FPBEventReceived = TelemetryEventTypes.componentName + "FPBEventReceived";
		public static FailedToRenderFPBSuggestion = TelemetryEventTypes.componentName + "FailedToRenderFPBSuggestion";
		public static InitFailed = TelemetryEventTypes.componentName + "InitFailed";
		public static InitStarted = TelemetryEventTypes.componentName + "InitStarted";
		public static NoSuggestionsFoundAfterDismiss = TelemetryEventTypes.componentName + "NoSuggestionsFoundAfterDismiss";
		public static AISuggestionsNotSupportedForNonEnglishUser = TelemetryEventTypes.componentName + "AISuggestionsNotSupportedForNonEnglishUser";
	}
}