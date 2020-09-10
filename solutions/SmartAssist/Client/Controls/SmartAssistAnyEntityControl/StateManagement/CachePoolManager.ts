/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/

module MscrmControls.SmartAssistAnyEntityControl {
    export class CachePoolManager {

        private static instance: CachePoolManager = null;

        public static get Instance(): CachePoolManager {
            if (!CachePoolManager.instance) {
                CachePoolManager.instance = new CachePoolManager();
            }
            return CachePoolManager.instance;
        }

        /**
         * Add or update records in cachepool
         * @param recordId
         * @param saConfigId
         * @param additionalSuggestionsData
         */
        public addOrUpdateSuggestionsInCachePool(recordId: string, saConfigId: string, additionalSuggestionsData: any[], telemetryHelper: TelemetryHelper) {
            if (!recordId || !saConfigId) {
                // TODO: Telemetry: invalid argument.
                return;
            }
            try {
                var key = Utility.getCachePoolKey(null);
                var additionalCacheData = window.sessionStorage.getItem(key);
                if (!additionalCacheData) {
                    let cachePoolForSession = new SuggestionCachePoolForSession();
                    let cachePoolForEntity = new SuggestionCachePoolForEntity();
                    cachePoolForEntity.suggestionsForConfig[saConfigId] = additionalSuggestionsData;
                    cachePoolForSession.suggestionsForEntityIds[recordId] = cachePoolForEntity;
                    window.sessionStorage.setItem(key, JSON.stringify(cachePoolForSession));
                    telemetryHelper.logTelemetrySuccess(TelemetryEventTypes.CachePoolUpdated, null);
                }
                else {
                    let cachePoolForSession = <SuggestionCachePoolForSession>JSON.parse(additionalCacheData);
                    var suggestions = cachePoolForSession.suggestionsForEntityIds;
                    if (suggestions && suggestions[recordId]) {
                        let suggestionForEntity = suggestions[recordId];
                        suggestionForEntity.suggestionsForConfig[saConfigId] = additionalSuggestionsData;
                        window.sessionStorage.setItem(key, JSON.stringify(cachePoolForSession));
                        telemetryHelper.logTelemetrySuccess(TelemetryEventTypes.CachePoolUpdated, null);
                    }
                    else if (suggestions) {
                        suggestions[recordId] = new SuggestionCachePoolForEntity();
                        suggestions[recordId].suggestionsForConfig[saConfigId] = additionalSuggestionsData;
                        window.sessionStorage.setItem(key, JSON.stringify(cachePoolForSession));
                        telemetryHelper.logTelemetrySuccess(TelemetryEventTypes.CachePoolUpdated, null);
                    }
                }
            } catch (error) {
                telemetryHelper.logTelemetryError(TelemetryEventTypes.CachePoolAddOrUpdateFailed, error, null);
            }
        }

        /**
         * Fetch record from cachepool.
         * @param recordId
         * @param saConfigId
         */
        public fetchSuggestionFromCachePool(recordId: string, saConfigId: string, telemetryHelper: TelemetryHelper): any {
            if (!recordId || !saConfigId) {
                // TODO: Telemetry: invalid argument.
                return null;
            }
            try {
                var key = Utility.getCachePoolKey(null);
                var additionalCacheData = window.sessionStorage.getItem(key);
                if (additionalCacheData) {
                    let cachePoolForSession = <SuggestionCachePoolForSession>JSON.parse(additionalCacheData);
                    var suggestions = cachePoolForSession.suggestionsForEntityIds;
                    if (suggestions && suggestions[recordId]) {
                        const suggestionsForEntity = suggestions[recordId];
                        if (suggestionsForEntity && suggestionsForEntity.suggestionsForConfig) {
                            const suggestionsForConfig = suggestionsForEntity.suggestionsForConfig[saConfigId];
                            if (suggestionsForConfig) {
                                if (suggestionsForConfig.length > 0) {
                                    const suggestionToReturn = suggestionsForConfig[0];
                                    suggestionsForConfig.shift();
                                    this.addOrUpdateSuggestionsInCachePool(recordId, saConfigId, suggestionsForConfig, telemetryHelper);
                                    return suggestionToReturn;
                                }
                            }
                        }
                    }
                }
                else {
                    telemetryHelper.logTelemetryError(TelemetryEventTypes.FailedToFetchDataFromCachePool, new Error("CachePool not found"), null);
                }
            } catch (error) {
                telemetryHelper.logTelemetryError(TelemetryEventTypes.FailedToFetchDataFromCachePool, error, null);
            }
            return null;
        }

        /**
         * Clear cachepool for a given saconfig.
         * @param saConfigId
         * @param recordId
         */
        public clearCachePoolForConfig(saConfigId: string, recordId: string) {
            var key = Utility.getCachePoolKey(null);
            var additionalCacheData = window.sessionStorage.getItem(key);
            if (additionalCacheData) {
                let cachePoolForSession = <SuggestionCachePoolForSession>JSON.parse(additionalCacheData);
                var suggestions = cachePoolForSession.suggestionsForEntityIds;
                if (suggestions && suggestions[recordId]) {
                    const suggestionsForEntity = suggestions[recordId];
                    if (suggestionsForEntity && suggestionsForEntity.suggestionsForConfig) {
                        suggestionsForEntity.suggestionsForConfig[saConfigId] = [];
                        window.sessionStorage.setItem(key, JSON.stringify(cachePoolForSession));
                    }
                }
            }
        }
    }
}