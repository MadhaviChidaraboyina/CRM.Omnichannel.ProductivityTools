module MscrmControls.SmartAssistAnyEntityControl {
    export class AnyEntityDataManager {
        private Suggestions: { [key: string]: any } = {};
        private _sessionStateManager: SessionStateManager;
        private _sessionStorageManager: SessionStorageManager;
        private _controlContext: Mscrm.ControlData<IInputBag>;
        private _isSmartAssistAvailable: boolean = null;
        private _cachePoolManager: CachePoolManager;
        private telemetryHelper: TelemetryHelper;
        private CONSTRUCTOR_CACHE: {
            [name: string]: {
                new(): Microsoft.Smartassist.SuggestionProvider.SuggestionProvider;
            };
        } = {};
        constructor() {
            this._sessionStateManager = SessionStateManager.Instance;
            this._sessionStorageManager = SessionStorageManager.Instance;
            this._cachePoolManager = CachePoolManager.Instance;
        }

        public initializeOtherParameters(context: Mscrm.ControlData<IInputBag>, telemetryHelper: TelemetryHelper) {
            this._controlContext = context;
            this.telemetryHelper = telemetryHelper;
        }

        /**
         * Gets suggestion data records.
         * @param saConfig: Smart Assist configuration for suggestion.
         * @param recordId: Record id to find the suggestion upon.
         */
        public async getSuggestionsData(saConfig: SAConfig, recordId: string): Promise<{[key: string]: any} | string > {
            const timer = SmartAssistAnyEntityControl._telemetryReporter.startTimer("getSuggestionsData");
            const params = new TelemetryLogger.EventParameters();

            try {
                const suggestionIdsFromSession = this._sessionStateManager.getAllRecords(recordId) || {};
                const suggestionIdsForSAConfig = suggestionIdsFromSession[saConfig.SmartassistConfigurationId];
                const fromServer = !suggestionIdsForSAConfig;
                if (suggestionIdsForSAConfig) {
                    this.getSuggestionsDataFromSessionCache(saConfig, suggestionIdsForSAConfig);
                }


                // call API if the data is not available in cache.
                let result;
                if (!this.Suggestions || fromServer) {
                    params.addParameter("Source", "api");
                    result = await this.getSuggestionsDataFromAPI(saConfig, recordId);
                } else params.addParameter("Source", "cache");

                timer.stop(params);
                return result;
            }
            catch (error) {
                this.Suggestions = null;
                params.addParameter("ExceptionDetails", error);
                this.telemetryHelper.logTelemetryError( TelemetryEventTypes.FailedToFetchData, "Failed to fetch suggestions data", params.getEventParams());
                timer.fail("failed to retrieve suggestions data", params);
            }
            return this.Suggestions;
        }

        private getSuggestionsDataFromSessionCache(saConfig: SAConfig, suggestionIds: string[]) {
            try {
                const data = suggestionIds.map(id => JSON.parse(this._sessionStorageManager.getRecord(id)).data);
                if (data) {
                    this.Suggestions[saConfig.SmartassistConfigurationId] = data;
                    this.telemetryHelper.logTelemetrySuccess(TelemetryEventTypes.DataFetchedFromCache, null);
                }
                else {
                    this.Suggestions = null;
                }
            } catch (error) {
                this.Suggestions = null;
                this.telemetryHelper.logTelemetryError(
                    TelemetryEventTypes.FailedToFetchDataFromCache, 
                    "Failed to fetch suggestions from cache",
                    [{ name: "ExceptionDetails", value: error }]
                );
            }
        }

        /**
         * Creates an instance for SuggestionProvider.
         * @param saconfig Smartassist configuration record.
         */
        private getSuggestionProvider(saconfig: SAConfig): Microsoft.Smartassist.SuggestionProvider.SuggestionProvider {
            const suggestionProviderName = saconfig.SuggestionProvider;
            let ctor = this.CONSTRUCTOR_CACHE[suggestionProviderName];
            if (!ctor) {
                let findCtor = window;
                for (const ctorNamePart of suggestionProviderName.split(".")) {
                    findCtor = findCtor[ctorNamePart];
                    if (!findCtor) {
                        break;
                    }
                }

                if (!findCtor || typeof findCtor !== "function") {
                    let message = `Could not find/invoke ${suggestionProviderName}'s constructor`;
                    this.telemetryHelper.logTelemetryError(TelemetryEventTypes.SuggestionProviderNotFound, new Error(message), null);
                    throw new Error(message);
                }

                ctor = findCtor as {
                    new(): Microsoft.Smartassist.SuggestionProvider.SuggestionProvider;
                };
                this.CONSTRUCTOR_CACHE[suggestionProviderName] = ctor;
                this.telemetryHelper.logTelemetrySuccess(TelemetryEventTypes.SuggestionProviderFound, null);
                return new ctor();
            }
            else {
                this.telemetryHelper.logTelemetrySuccess(TelemetryEventTypes.SuggestionProviderFound, null);
                return new ctor();
            }
        }

        /**
         * Gets localization data for the suggestion provider.
         * @param saConfig: Smart Assist configuration for suggestion.
         */
        public async getLocalizationData(saConfig: SAConfig): Promise<{ [key: string]: string }> {
            const timer = SmartAssistAnyEntityControl._telemetryReporter.startTimer("getLocalizationData",);
            const params = new TelemetryLogger.EventParameters();

            let localizationData: { [key: string]: string } = null;
            let languageId: string = this._controlContext.userSettings.languageId.toString();
            let locCacheKey: string = saConfig.SmartassistConfigurationId + StringConstants.LocCacheString + languageId;
            let cachedLocData = this._sessionStorageManager.getRecord(locCacheKey);
            if (cachedLocData) {
                params.addParameter("Source", "cache");
                return Utility.getMapObject(cachedLocData);
            }
            
            params.addParameter("Source", "api");
            try {
                let localizationWebresource: string = await this.getLocalizationProvider(saConfig);
                if (localizationWebresource) {
                    // loc strings fetched only once per config, per loc for the entire session
                    let locStrings = await this.loadLocalizationWebResource(localizationWebresource);
                    this._sessionStorageManager.createRecord(locCacheKey, locStrings);
                    localizationData = Utility.getMapObject(locStrings);
                } else {
                    let message = "Couldn't get suggestion provider localization webresource";
                    throw new Error(message);
                }
                timer.stop(params);
            }
            catch (error) {
                params.addParameter("ExceptionDetails", error);
                this.telemetryHelper.logTelemetryError(TelemetryEventTypes.FailedToFetchLocalizationData, "Failed to fetch localization data", params.getEventParams());
                timer.fail("failed to retrieve localization data", params);
            }
            return localizationData;
        }

         /**
         * Gets localization webresource name for the suggestion provider.
         * @param saConfig: Smart Assist configuration for suggestion.
         */
        public async getLocalizationProvider(saConfig: SAConfig): Promise<string> {
            const suggestionProvider = this.getSuggestionProvider(saConfig);
            let locProvider: string;
            if (suggestionProvider) {
                locProvider = await suggestionProvider.getSuggestionLocalizationProvider();
            }
            return locProvider;
        }

        /**
         * Fetch localization strings for the suggestionprovider webresource and UI setting language code.
         * @param localizationWebresource localization webresource name of suggestion provider
         */
        private async loadLocalizationWebResource(localizationWebresource: string): Promise<string> {
            let locString: string;
            const languageCode: string = this._controlContext.userSettings.languageId.toString();
            if (languageCode && localizationWebresource && localizationWebresource.indexOf(StringConstants.EnglishLanguageCode) != -1) {
                const org = this._controlContext.page.getClientUrl();
                let locWebresource = localizationWebresource.replace(StringConstants.EnglishLanguageCode, languageCode);
                let url = `${org}/api/data/v9.0/webresourceset?$filter=name eq '${locWebresource}' and languagecode eq ${languageCode}&$select=contentjson`;
                let data = await $.getJSON(url);
                if (data && data.value.length > 0) {
                    locString = data.value[0].contentjson;
                }
            }
            return locString;
        }

        /**
         * Gets the suggestion record from provided API.
         * @param saConfig: Smart Assist configuration for suggestion.
         * @param RecordId: Record id to find the suggestion upon.
         */
        public async getSuggestionsDataFromAPI(saConfig: SAConfig, RecordId: string): Promise<{[key: string]: any} | string> {
            const timer = SmartAssistAnyEntityControl._telemetryReporter.startTimer("getSuggestionsDataFromAPI");
            const params = new TelemetryLogger.EventParameters();

            try {
                this.telemetryHelper.logTelemetrySuccess(TelemetryEventTypes.FetchingDataFromAPI, null);
                params.addParameter("SuggestionsProvider", saConfig.SuggestionProvider);
                const suggestionProvider = this.getSuggestionProvider(saConfig);
                if (suggestionProvider == null) throw "no suggestion provider found";

                var context = await Microsoft.AppRuntime.Sessions.getFocusedSession().getContext() as any;
                let tabcontext;
                if (context) {
                    tabcontext = context.getTabContext("anchor");
                }
                
                // Retrieve suggestions, throw if an error is found.
                const param: Microsoft.Smartassist.SuggestionProvider.SuggestionContext = { controlContext: this._controlContext, tabcontext: tabcontext };
                const suggestionDataFromAPI = await suggestionProvider.getSuggestions(param);
                if (this.isSuggestionError(suggestionDataFromAPI)) throw suggestionDataFromAPI;

                params.addParameter("NumSuggestions", (suggestionDataFromAPI as any[]).length);

                this.Suggestions = {};

                // Keep the following telemetry for backwards compatibility with old dashboards.
                const executionTime = (Date.now() - timer.start) + "ms";
                if (suggestionDataFromAPI && suggestionDataFromAPI.length < 1) {
                    this.telemetryHelper.logTelemetrySuccess(TelemetryEventTypes.NoDataFoundFromAPI, [{ name: "ExecutionTime", value: executionTime }]);
                }
                else {
                    this.telemetryHelper.logTelemetrySuccess(TelemetryEventTypes.DataFetchedFromAPI, [
                        { name: "ExecutionTime", value: executionTime },
                        { name: "NoOfSuggestions", value: suggestionDataFromAPI.length }
                    ]);
                }

                let data = suggestionDataFromAPI as any[];
                data = data.sort((a, b) => a.ConfidenceScore > b.ConfidenceScore ? -1 : 1);
                var slicedData = data.slice(0, parseInt(saConfig.MaxSuggestionCount));

                for (let item of data) {
                    // Creating an unique id for UI construct.
                    let suggestionId = RecordId + item.SuggestionId;
                    item.SuggestionId = suggestionId;
                }
                this.Suggestions[saConfig.SmartassistConfigurationId] = slicedData;
                this.initializeCacheForSuggestions(saConfig, RecordId);

                let additionalData = data.slice(parseInt(saConfig.MaxSuggestionCount));

                this._cachePoolManager.addOrUpdateSuggestionsInCachePool(RecordId, saConfig.SmartassistConfigurationId, additionalData, this.telemetryHelper);

                // Raise PP notification
                var saConfigData = this.Suggestions;
                if (saConfigData && this.Suggestions[saConfig.SmartassistConfigurationId]) {
                    var dataCount = saConfigData[saConfig.SmartassistConfigurationId].length;
                    PaneHelper.updateBadge(RecordId, saConfig.SmartassistConfigurationId, dataCount);
                }
            
                timer.stop(params);
                return this.Suggestions;
            }
            catch (error) {
                let message;
                if (this.isSuggestionError(error)) {
                    message = error.displayMessage ? error.displayMessage : this.getErrorMessageFromException(error.exception);
                }
                params.addParameter("ExceptionDetails", error);
                timer.fail(message, params);

                this.Suggestions = null;
                return message;
            }
        }

        private getErrorMessageFromException(exception: any): string {
            return Utility.getMapObject(exception.message)['message'];
        }

        private isSuggestionError(result: any[] | Microsoft.Smartassist.SuggestionProvider.SuggestionError ): result is Microsoft.Smartassist.SuggestionProvider.SuggestionError {
            // Return true if the returned error has either truthy displayMessage or exception object.
            return result && ((result as Microsoft.Smartassist.SuggestionProvider.SuggestionError).exception || (result as Microsoft.Smartassist.SuggestionProvider.SuggestionError).displayMessage);
        }

        /**
         * Stores API data in local storage and suggestionIds in SessionContext.
         * @param saConfig SAConfig for this control instance.
         * @param recordId Caches the data for this record id.
         */
        initializeCacheForSuggestions(saConfig: SAConfig, recordId: string) {
            try {
                const data = <Array<any>>this.Suggestions[saConfig.SmartassistConfigurationId];
                const suggestionIds = data.map(item => item.SuggestionId);
                let sessionContextCache = {};
                sessionContextCache[saConfig.SmartassistConfigurationId] = suggestionIds;
                this._sessionStateManager.createOrUpdateRecord(recordId, sessionContextCache);
                data.forEach(item => this._sessionStorageManager.createRecord(item.SuggestionId, JSON.stringify({ data: item })));
                this.saveAllSuggestionIdsInSessionStorage(suggestionIds);
            } catch (error) {
                const params = new TelemetryLogger.EventParameters();
                params.addParameter("recordId", recordId);
                params.addParameter("ExceptionDetails", error);
                this.telemetryHelper.logTelemetryError(TelemetryEventTypes.CacheInitializationFailed, "Failed to initialize cache for suggestions", params.getEventParams());
            }
        }

        /**
         * Saving all the suggestionIds against session id. This is required to clear the data on session close.
         * @param suggestionIds
         */
        saveAllSuggestionIdsInSessionStorage(suggestionIds: string[]) {
            const sessionId = Utility.getCurrentSessionId();
            let previousSuggestionIds = [];
            if (window.sessionStorage.getItem(sessionId)) {
                previousSuggestionIds = JSON.parse(window.sessionStorage.getItem(sessionId));
            }

            let suggestionIdsToSave = previousSuggestionIds.concat(suggestionIds);
            window.sessionStorage.setItem(sessionId, JSON.stringify(suggestionIdsToSave));
        }
    }
}