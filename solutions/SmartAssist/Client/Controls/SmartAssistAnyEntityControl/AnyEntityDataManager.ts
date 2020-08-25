module MscrmControls.SmartAssistAnyEntityControl {
    export class AnyEntityDataManager {
        private Suggestions: { [key: string]: any } = {};
        private _sessionStateManager: SessionStateManager;
        private _sessionStorageManager: SessionStorageManager;
        private _controlContext: Mscrm.ControlData<IInputBag>;
        private _isSmartAssistAvailable: boolean = null;
        private _cachePoolManager: CachePoolManager;
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

        public initializeContextParameters(context: Mscrm.ControlData<IInputBag>) {
            this._controlContext = context;
        }

        /**
         * Gets suggestion data records.
         * @param saConfig: Smart Assist configuration for suggestion.
         * @param recordId: Record id to find the suggestion upon.
         */
        public async getSuggestionsData(saConfig: SAConfig, recordId: string) {
            let eventParameters = new TelemetryLogger.EventParameters();
            try {
                const suggestionIdsFromSession = this._sessionStateManager.getAllRecords(recordId) || {};
                const suggestionIdsForSAConfig = suggestionIdsFromSession[saConfig.SmartassistConfigurationId];
                const fromServer = !suggestionIdsForSAConfig;
                if (suggestionIdsForSAConfig) {
                    this.getSuggestionsDataFromSessionCache(saConfig, suggestionIdsForSAConfig);
                }

                // call API if the data is not available in cache.
                if (!this.Suggestions || fromServer) {
                    await this.getSuggestionsDataFromAPI(saConfig, recordId);                    
                }
            }
            catch (error) {
                this.Suggestions = null;
                eventParameters.addParameter("Exception Details", error.message);
                SmartAssistAnyEntityControl._telemetryReporter.logError("Main Component", "getSuggestionsData", "Error occurred while getting suggestions data", eventParameters);
            }
            return this.Suggestions;
        }

        private getSuggestionsDataFromSessionCache(saConfig: SAConfig, suggestionIds: string[]) {
            try {
                const data = suggestionIds.map(id => JSON.parse(this._sessionStorageManager.getRecord(id)).data);
                if (data) {
                    this.Suggestions[saConfig.SmartassistConfigurationId] = data;
                }
                else {
                    this.Suggestions = null;
                }
            } catch (error) {
                this.Suggestions = null;
                let eventParameters = new TelemetryLogger.EventParameters();
                eventParameters.addParameter("Exception Details", error.message);
                SmartAssistAnyEntityControl._telemetryReporter.logError("Main Component", "fetchSAConfigurationsData", "Error occurred while fetching SA Configurations Data from cache", eventParameters);
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
                    throw new Error(message);
                }

                ctor = findCtor as {
                    new(): Microsoft.Smartassist.SuggestionProvider.SuggestionProvider;
                };
                this.CONSTRUCTOR_CACHE[suggestionProviderName] = ctor;
                return new ctor();
            }
            else {
                return new ctor();
            }
        }

        /**
         * Gets the suggestion record from provided API.
         * @param saConfig: Smart Assist configuration for suggestion.
         * @param RecordId: Record id to find the suggestion upon.
         */
        public async getSuggestionsDataFromAPI(saConfig: SAConfig, RecordId: string) {
            let eventParameters = new TelemetryLogger.EventParameters();
            try {
                const suggestionProvider = this.getSuggestionProvider(saConfig);
                var context = await Microsoft.AppRuntime.Sessions.getFocusedSession().getContext() as any;
                let tabcontext;
                if (context) {
                    tabcontext = context.getTabContext("anchor");
                }
                const param: Microsoft.Smartassist.SuggestionProvider.SuggestionContext = { controlContext: this._controlContext, tabcontext: tabcontext };
                let suggestionDataFromAPI: any[] = [];
                if (suggestionProvider) {
                    suggestionDataFromAPI = await suggestionProvider.getSuggestions(param);
                }

                this.Suggestions = {};
                let data = suggestionDataFromAPI;
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

                this._cachePoolManager.addOrUpdateSuggestionsInCachePool(RecordId, saConfig.SmartassistConfigurationId, additionalData);

                // Raise PP notification
                var saConfigData = this.Suggestions;
                if (saConfigData && this.Suggestions[saConfig.SmartassistConfigurationId]) {
                    var sessionId = Utility.getCurrentSessionId();
                    var dataCount = saConfigData[saConfig.SmartassistConfigurationId].length;
                    Utility.DispatchPanelInboundEvent(dataCount, sessionId);
                }

                return this.Suggestions;
            }
            catch (error) {
                this.Suggestions = null;
                eventParameters.addParameter("Exception Details", error.message);
                SmartAssistAnyEntityControl._telemetryReporter.logError("Main Component", "getSuggestionsDataFromAPI", "Error occurred while getting suggestions from API", eventParameters);
                return null;
            }
        }


        /**
         * Stores API data in local storage and suggestionIds in SessionContext.
         * @param saConfig SAConfig for this control instance.
         * @param recordId Caches the data for this record id.
         */
        initializeCacheForSuggestions(saConfig: SAConfig, recordId: string) {
            let eventParameters = new TelemetryLogger.EventParameters();
            try {
                eventParameters.addParameter("recordId", recordId)
                const data = <Array<any>>this.Suggestions[saConfig.SmartassistConfigurationId];
                const suggestionIds = data.map(item => item.SuggestionId);
                let sessionContextCache = {};
                sessionContextCache[saConfig.SmartassistConfigurationId] = suggestionIds;
                this._sessionStateManager.createOrUpdateRecord(recordId, sessionContextCache);
                data.forEach(item => this._sessionStorageManager.createRecord(item.SuggestionId, JSON.stringify({ data: item })));
                this.saveAllSuggestionIdsInSessionStorage(suggestionIds);
            } catch (error) {
                eventParameters.addParameter("Exception Details", error.message);
                SmartAssistAnyEntityControl._telemetryReporter.logError("Main Component", "initializeCacheForSuggestions", "Error occurred while initializing cache suggestions", eventParameters);
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

        /**Check if Smart assist is added in OC WS */
        public async isSmartassistAvailable() {
            var liveworkStreamItem = Utility.getLiveWorkStreamId();
            if (Utility.isNullOrEmptyString(liveworkStreamItem)) {
                return false;
            }
            var sessionId = Utility.getCurrentSessionId();
            let isSmartAssistBotAvailable: any = sessionStorage.getItem(sessionId + liveworkStreamItem + StringConstants.isSmartAssistFound);
            if (isSmartAssistBotAvailable == null) {
                await this.FetchSmartAssistBotRecordAndSetCriteria(liveworkStreamItem, sessionId);
                return this._isSmartAssistAvailable;
            }
            return (isSmartAssistBotAvailable == "true");
        }

        /**
         * Fet sa bots set SA rendering criteria
         * @param liveWorkStreamId: Work Stream Unique identifier
         */
        private async FetchSmartAssistBotRecordAndSetCriteria(liveWorkStreamId: string, sessionId: string) {
            let eventParameters = new TelemetryLogger.EventParameters();
            try {
                //fetch smart assist bots
                let fetchXml = this.getSmartAssistFetchXml(liveWorkStreamId);
                let fetchXmlQuery = StringConstants.FetchOperator + encodeURIComponent(fetchXml);
                let dataResponse = await SmartAssistAnyEntityControl._context.webAPI.retrieveMultipleRecords(StringConstants.UserEntityName, fetchXmlQuery) as any;
                let entityRecords: WebApi.Entity[] = dataResponse.entities;
                this._isSmartAssistAvailable = entityRecords.length > 0;
                sessionStorage.setItem(sessionId + liveWorkStreamId + StringConstants.isSmartAssistFound, this._isSmartAssistAvailable as any)

                eventParameters.addParameter("total SmartAssistBotRecordFetch", entityRecords.length.toString());
                SmartAssistAnyEntityControl._telemetryReporter.logSuccess("Main Component", "SmartAssistBotRecordFetch", eventParameters);
            }
            catch (error) {
                this._isSmartAssistAvailable = null;
                sessionStorage.removeItem(sessionId + liveWorkStreamId + StringConstants.isSmartAssistFound);
                eventParameters.addParameter("Exception Details", error.message);
                SmartAssistAnyEntityControl._telemetryReporter.logError("Main Component", "SmartAssistBotRecordFetch", "Error occurred while fetching smart assist bot", eventParameters);
            }

        }

        /**
         * Xml to fetch sa bots from work stream
         * @param workStreamId: Work Stream Unique identifier
         */
        private getSmartAssistFetchXml(workStreamId: string): string {
            //todo: Resolve- Can we have fetch xml in XML ?
            let fetchXrml = "<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='true'>" +
                "<entity name='systemuser'>" +
                "<attribute name='fullname' />" +
                "<attribute name='businessunitid' />" +
                "<attribute name='systemuserid' />" +
                "<order attribute='fullname' descending='false' />" +
                "<link-entity name='msdyn_msdyn_liveworkstream_systemuser' from='systemuserid' to='systemuserid' visible='false' intersect='true'>" +
                "<link-entity name='msdyn_liveworkstream' from='msdyn_liveworkstreamid' to='msdyn_liveworkstreamid' alias='aa'>" +
                "<filter type='and'>" +
                "<condition attribute='msdyn_liveworkstreamid' operator='eq' uitype='msdyn_liveworkstream' value='{" + workStreamId + "}' />" +
                "</filter>" +
                "</link-entity>" +
                "</link-entity>" +
                "</entity>" +
                "</fetch>";
            return fetchXrml;
        }
    }
}