module MscrmControls.SmartassistPanelControl {

    export class TelemetryHelper {
        private recordId: string;
        private anchorTabEntityLogicalName;

        constructor(recordId: string, entityLogicalName: string) {
            this.recordId = recordId;
            this.anchorTabEntityLogicalName = entityLogicalName;
        }

		/**
		 * Update recordid and entityLogicalName for telemetry.
		 * @param recordId
		 * @param entityLogicalName
		 */
        public updateValues(recordId: string, entityLogicalName: string) {
            this.recordId = recordId;
            this.anchorTabEntityLogicalName = entityLogicalName;
        }

		/**
		 * Log telemetry error
		 * @param eventType
		 * @param error
		 * @param additionalParameter
		 */
        public logTelemetryError(eventType: string, error: any, additionalParameter: Mscrm.EventParameter[]) {
            const params = this.getTelemetryParameter(true, additionalParameter)
            SmartassistPanelControl._context.reporting.reportFailure(eventType, error, "TSG-TODO", params);
        }

		/**
		 * log success event.
		 * @param eventType
		 * @param additionalParameter
		 */
		public logTelemetrySuccess(eventType: string, additionalParameter: Mscrm.EventParameter[]) {
			const params = this.getTelemetryParameter(false, additionalParameter);
			SmartassistPanelControl._context.reporting.reportSuccess(eventType, params);
		}

		/**
		 * Get Telemetry event parameter
		 * @param additionalParameters
		 */
        public getTelemetryParameter(isError: boolean, additionalParameters: Mscrm.EventParameter[]): Mscrm.EventParameter[] {
            var params: Mscrm.EventParameter[] = [
                { name: "SuggestionForEntityId", value: this.recordId },
                { name: "SuggestedForEntityLogicalName", value: this.anchorTabEntityLogicalName },
                { name: "Session-Id", value: Utility.getCurrentSessionId() },
                { name: "IsError", value: isError }
            ]
            if (additionalParameters) {
                params = params.concat(additionalParameters);
            }
            return params;
        }
    }

	/**
	 * All Telemetry event type.
	 * */
    export class TelemetryEventTypes {
        public static componentName = "MscrmControls.SmartassistPanelControl.";
        public static InitFailed = TelemetryEventTypes.componentName + "InitFailed";
        public static InitCompleted = TelemetryEventTypes.componentName + "InitCompleted";
        public static InitStarted = TelemetryEventTypes.componentName + "InitStarted"
        public static UpdateViewStarted = TelemetryEventTypes.componentName + "UpdateViewStarted";
        public static SessionInitStarted = TelemetryEventTypes.componentName + "SessionInitStarted";
        public static RenderSuggestionStarted = TelemetryEventTypes.componentName + "RenderSuggestionStarted";
        public static ConfigNotFound = TelemetryEventTypes.componentName + "ConfigNotFound";
        public static AllConfigsDisabled = TelemetryEventTypes.componentName + "AllConfigsDisabled";
        public static CaseSettingDisabled = TelemetryEventTypes.componentName + "CaseSettingIsDisabled";
        public static KBSettingDisabled = TelemetryEventTypes.componentName + "KBSettingIsDisabled";
        public static ThirdPartyBotDisabled = TelemetryEventTypes.componentName + "ThirdPartyBotIsDisabled";
        public static SAConfigFetchedFromCache = TelemetryEventTypes.componentName + "SAConfigFetchedFromCache";
        public static AppProfileAssociationNotFound = TelemetryEventTypes.componentName + "AppProfileAssociationNotFound";
        public static FetchingDefaultSAConfig = TelemetryEventTypes.componentName + "FetchingDefaultSAConfig";
        public static ExceptionInFetchingSAConfigData = TelemetryEventTypes.componentName + "ExceptionInFetchingSAConfigData";
        public static NoSAConfigFound = TelemetryEventTypes.componentName + "NoSAConfigFound";
        public static DefaultSAConfigNotFound = TelemetryEventTypes.componentName + "DefaultSAConfigNotFound";
        public static InvalidSourceEntityName = TelemetryEventTypes.componentName + "InvalidSourceEntityName";
        public static ExceptionInFetchingSAConfigFromCache = TelemetryEventTypes.componentName + "ExceptionInFetchingSAConfigFromCache";
        public static ThirdPartyBotNotFoundInWorkStream = TelemetryEventTypes.componentName + "ThirdPartyBotNotFoundInWorkStream";
        public static LiveWorkStreamIdNotFound = TelemetryEventTypes.componentName + "LiveWorkStreamIdNotFound";
        public static ExceptionInFetchingTPBDetails = TelemetryEventTypes.componentName + "ExceptionInFetchingTPBDetails";
        public static FetchingSuggestionSettingsFromCache = TelemetryEventTypes.componentName + "FetchingSuggestionSettingsFromCache";
        public static FetchingSuggestionSettingsFromAPI = TelemetryEventTypes.componentName + "FetchingSuggestionSettingsFromAPI";
        public static SuggestionSettingsNotFound = TelemetryEventTypes.componentName + "SuggestionSettingsNotFound";
        public static SuggestionSettingsFailed = TelemetryEventTypes.componentName + "SuggestionSettingsFailed";
        public static ExceptionInSuggestionSettings = TelemetryEventTypes.componentName + "ExceptionInSuggestionSettings";
        public static SessionSwitchDetected = TelemetryEventTypes.componentName + "SessionSwitchDetected";
        public static UnbindingOldSAAnyEntityControl = TelemetryEventTypes.componentName + "UnbindingOldSAAnyEntityControl";
        public static SessionSwitchCECEventReceived = TelemetryEventTypes.componentName + "SessionSwitchCECEventReceived";
        public static WebresourceLoadingFailed = TelemetryEventTypes.componentName + "WebResourceLoadingFailed";
        public static WebresourceLoadedSuccessfully = TelemetryEventTypes.componentName + "WebresourceLoadedSuccessfully";
        public static RenderingSmartAssistAnyEntityControl = TelemetryEventTypes.componentName + "RenderingSmartAssistAnyEntityControl";
        public static ErrorInCheckEmptyStatus = TelemetryEventTypes.componentName + "ErrorInCheckEmptyStatus";
        public static ErrorInCloseSessionHandler = TelemetryEventTypes.componentName + "ErrorInCloseSessionHandler";
        public static EmptyStatusNotEnabled = TelemetryEventTypes.componentName + "EmptyStatusNotEnabled";
        public static NoSuggestionSettings = TelemetryEventTypes.componentName + "NoSuggestionSettings";
    }
}