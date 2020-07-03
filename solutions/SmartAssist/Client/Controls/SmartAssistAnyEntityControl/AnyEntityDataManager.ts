﻿module MscrmControls.SmartAssistAnyEntityControl {
    export class AnyEntityDataManager {
        private Suggestions: { [key: string]: any } = {};
        private _sessionStateManager: SessionStateManager;
        private _localStorageManager: LocalStorageManager;
        private _controlContext: Mscrm.ControlData<IInputBag>;
        private CONSTRUCTOR_CACHE: {
            [name: string]: {
                new(): Microsoft.Smartassist.SuggestionProvider.SuggestionProvider;
            };
        } = {};
        constructor() {
            this._sessionStateManager = SessionStateManager.Instance;
            this._localStorageManager = LocalStorageManager.Instance;
        }

        public initializeContextParameters(context: Mscrm.ControlData<IInputBag>) {
            this._controlContext = context;
        }

        /**
         * Gets suggestion data records.
         * @param saConfig: Smart Assist configuration for suggestion.
         * @param recordId: Record id to find the suggestion upon.
         */
        public async getSuggestionsData(saConfig: SAConfig, recordId: string) {
            const suggestionIdsFromSession = this._sessionStateManager.getAllRecords(recordId) || {};
            const suggestionIdsForSAConfig = suggestionIdsFromSession[saConfig.SmartassistConfigurationId];
            const fromServer = !suggestionIdsForSAConfig;
            if (suggestionIdsForSAConfig) {
                this.getSuggestionsDataFromSessionCache(saConfig, suggestionIdsForSAConfig);
            }

            // call API if the data is not available in cache.
            if (!this.Suggestions || fromServer) {
                await this.getSuggestionsDataFromAPI(saConfig, recordId)

                // Raise PP notification
                var saConfigData = this.Suggestions[saConfig.SmartassistConfigurationId];
                if (saConfigData) {
                    var sessionId = Utility.getCurrentSessionId();
                    var dataCount = saConfigData.length;
                    Utility.DispatchPanelInboundEvent(dataCount, sessionId);
                }
            }
            return this.Suggestions;
        }

        private getSuggestionsDataFromSessionCache(saConfig: SAConfig, suggestionIds: string[]) {
            try {
                const data = suggestionIds.map(id => JSON.parse(this._localStorageManager.getRecord(id)).data);
                if (data) {
                    this.Suggestions[saConfig.SmartassistConfigurationId] = data;
                }
                else {
                    this.Suggestions = null;
                }
            } catch (error) {
                //TODO: Telemetry
                this.Suggestions = null;
            }
        }

        /**
         * Creates an instance for SuggestionProvider.
         * @param saconfig Smartassist configuration record.
         */
        private getSuggestionProvider(saconfig: SAConfig): Microsoft.Smartassist.SuggestionProvider.SuggestionProvider {
                const suggestionProviderName = saconfig.SuggestionWebresourceFunction;
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
                        throw new Error(`Could not find/invoke ${suggestionProviderName}'s constructor`);
                    }

                    ctor = findCtor as {
                        new(): Microsoft.Smartassist.SuggestionProvider.SuggestionProvider;
                    };
                    this.CONSTRUCTOR_CACHE[suggestionProviderName] = ctor;
                    return new ctor();
                }
        }

        /**
         * Gets the suggestion record from provided API.
         * @param saConfig: Smart Assist configuration for suggestion.
         * @param RecordId: Record id to find the suggestion upon.
         */
        private async getSuggestionsDataFromAPI(saConfig: SAConfig, RecordId: string) {
            const suggestionProvider = this.getSuggestionProvider(saConfig);
            var context = Microsoft.AppRuntime.Sessions.getFocusedSession().context;
            let tabcontext;
            if (context) {
                tabcontext = context.getTabContext("anchor");
            }
            const param: Microsoft.Smartassist.SuggestionProvider.SuggestionContext = { controlContext: this._controlContext, tabcontext: tabcontext };
            let suggestionDataFromAPI = [];
            if (suggestionProvider) {
                suggestionDataFromAPI = await suggestionProvider.getSuggestions(param);
            }

            this.Suggestions = {};
            let data = suggestionDataFromAPI;
            data = data.sort((a, b) => a.ConfidenceScore > b.ConfidenceScore ? -1 : 1);
            this.Suggestions[saConfig.SmartassistConfigurationId] = data;
            this.initializeCacheForSuggestions(saConfig, RecordId);
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
                data.forEach(item => this._localStorageManager.createRecord(item.SuggestionId, JSON.stringify({ data: item })));
            } catch (error) {
                // TODO: Telemetry for cache initialization errors.
            }
        }
    }
}