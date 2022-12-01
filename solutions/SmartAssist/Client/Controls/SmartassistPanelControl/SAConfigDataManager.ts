/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/
/// <reference path="CommonReferences.ts"/>

module MscrmControls.SmartassistPanelControl {
    export class SAConfigDataManager {
        private static instance: SAConfigDataManager = null;
        private saConfigSchema: SAConfigSchema = new SAConfigSchema();
        private acConfigSchema: ACConfigSchema = new ACConfigSchema();
        private saConfig: SAConfig[] = [];
        private suggestionsSetting: { [key: string]: any } = {};
        private smartbotConfig: { [key: string]: any } = {};
        private suggestionsSettingSchema: SuggestionsSettingSchema = new SuggestionsSettingSchema();

        constructor() {
        }

        /**Get SAConfigDataManager singleton instance  */
        public static get Instance(): SAConfigDataManager {
            if (!SAConfigDataManager.instance) {
                SAConfigDataManager.instance = new SAConfigDataManager();
            }
            return SAConfigDataManager.instance;
        }

        /**Gets SA configuration from memory if available otherwise from cds */
        public async getSAConfigurations(telemetryHelper: TelemetryHelper) {
            const timer = SmartassistPanelControl._telemetryReporter.startTimer("getSAConfigurations");
            const params = new TelemetryLogger.EventParameters();

            let environmentData = await Utility.getAppRuntimeEnvironment();
            this.getSAConfigurationFromCache(environmentData.AppConfigName, telemetryHelper);
            if ((this.saConfig.length < 1)) {
                params.addParameter("Source", "api");
                await this.fetchSAConfigurationsData(environmentData.AppConfigName, telemetryHelper);
            } else {
                params.addParameter("Source", "cache");
            }

            params.addParameter("NumSAConfigsFound", this.saConfig.length);
            timer.stop(params);
            return this.saConfig;
        }

        public clearSuggestionsSetting(sessionId: string) {
            var keySet=new Set(Object.keys(this.suggestionsSetting));
            if(keySet.has(sessionId)){
                delete this.suggestionsSetting[sessionId];
            }
        }

        /**
        * Get Filtered SA config from admin suggestions setting
        * @param saConfig: All active SA config
        */
        public async getFilteredSAConfig(sourceEntity: string, telemetryHelper: TelemetryHelper) {
            const timer = SmartassistPanelControl._telemetryReporter.startTimer("getFilteredSAConfig");
            const params = new TelemetryLogger.EventParameters();
            params.addParameter("SourceEntity", sourceEntity);

            let sessionId = Utility.getCurrentSessionId();
            await this.getSuggestionsSetting(sessionId, telemetryHelper);
            let configs = await this.getSAConfigurations(telemetryHelper);

            params.addParameter("SessionId", sessionId);
            params.addParameter("NumUnfilteredConfigs", configs.length);

            let isSmartbotAvailable = false;
            let botConfig = configs.find(i => i.SuggestionType == SuggestionType.BotSuggestion);
            if (botConfig) {
                isSmartbotAvailable = await this.isSmartbotAvailable(telemetryHelper) as any;
            }

            params.addParameter("TPBotConfigFound", botConfig != null);
            params.addParameter("IsSmartbotAvailable", isSmartbotAvailable);
            if (!isSmartbotAvailable) {
                telemetryHelper.logTelemetrySuccess(TelemetryEventTypes.ThirdPartyBotNotFoundInWorkStream, null);
            }

            let isDefaultCaseAdded = false;
            let isDefaultKMAdded = false;

            let result = configs.filter((data) => {
                if (data.SuggestionType == SuggestionType.BotSuggestion) return isSmartbotAvailable;

                //Source entity filter for valid source entity
                if (Utility.isValidSourceEntityName(sourceEntity)) {
                    if (sourceEntity != data.SourceEntityName) {
                        return false;
                    }
                }
                else {
                    telemetryHelper.logTelemetryError(TelemetryEventTypes.InvalidSourceEntityName, new Error("Invalid source entityName found"), null);
                    //for invalid session or invalid source entity - select a Case and km config to show no suggestions
                    if (data.IsDefault == true) {
                        let result = false;
                        switch (data.SuggestionType) {
                            case SuggestionType.KnowledgeArticleSuggestion:
                                result = !isDefaultCaseAdded;
                                isDefaultCaseAdded = true;
                                break;
                            case SuggestionType.SimilarCaseSuggestion:
                                result = !isDefaultKMAdded;
                                isDefaultKMAdded = true;
                                break;
                        }
                        return result;
                    }
                    else return false;
                }
                switch (data.SuggestionType) {
                    case SuggestionType.SimilarCaseSuggestion:
                        data.IsEnabled = this.suggestionsSetting[sessionId].CaseIsEnabled;
                        return true
                    case SuggestionType.KnowledgeArticleSuggestion:
                        data.IsEnabled = this.suggestionsSetting[sessionId].KbIsEnable;
                        return true;
                    case SuggestionType.BotSuggestion:
                        return isSmartbotAvailable;
                    default:
                        return true;
                }
            });

            params.addParameter("IsDefaultCaseAdded", isDefaultCaseAdded);
            params.addParameter("IsDefaultKMAdded", isDefaultKMAdded);
            params.addParameter("NumFilteredConfigs", result.length);
            timer.stop(params);

            return result;
        }

        private getSAConfigurationFromCache(appConfigName: string, telemetryHelper: TelemetryHelper) {
            try {
                var data = window.sessionStorage.getItem(Constants.SAConfigCacheKey);
                if (data) {
                    var saConfigs = JSON.parse(data) as SAConfig[];
                    if (saConfigs[0].CurrentAppConfigName == appConfigName) {
                        telemetryHelper.logTelemetrySuccess(TelemetryEventTypes.SAConfigFetchedFromCache, null);
                        this.saConfig = saConfigs;
                    }
                }
            }
            catch (error) {
                telemetryHelper.logTelemetryError(
                    TelemetryEventTypes.ExceptionInFetchingSAConfigFromCache,
                    "Failed to get SA config data from the cache",
                    [{ name: "ExceptionDetails", value: error }]
                );
            }
        };

        /**Fetch SA config from cds */
        private async fetchSAConfigurationsData(appConfigName: string, telemetryHelper: TelemetryHelper) {
            const timer = SmartassistPanelControl._telemetryReporter.startTimer("fetchSAConfigurationsData");
            const params = new TelemetryLogger.EventParameters();

            try {
                let fetchXml = this.getXmlQueryForSAConfig(appConfigName)
                var result = await SmartassistPanelControl._context.webAPI.retrieveMultipleRecords(this.saConfigSchema.EntityName, fetchXml) as any;
                
                if (!result || !result.entities) throw `an error occurred when recieving SA Config records from CDS: ${JSON.stringify(result)}`;
                params.addParameter("NumSAConfigsFound", result.entities.length);

                if (result.entities.length < 1) {
                    telemetryHelper.logTelemetrySuccess(TelemetryEventTypes.AppProfileAssociationNotFound, null);
                    telemetryHelper.logTelemetrySuccess(TelemetryEventTypes.FetchingDefaultSAConfig, null);
                    
                    let defaultConfigFetchXml = this.getFetchXmlForDefaultSAConfig();
                    result = await SmartassistPanelControl._context.webAPI.retrieveMultipleRecords(this.saConfigSchema.EntityName, defaultConfigFetchXml) as any;
                    
                    if (!result || !result.entities) throw `an error occurred when recieving default SA Config records from CDS: ${JSON.stringify(result)}`;
                    params.addParameter("NumDefaultSAConfigsFound", result.entities.length);
                    
                    if (result.entities.length < 1) {
                        telemetryHelper.logTelemetryError(TelemetryEventTypes.DefaultSAConfigNotFound, new Error("Default SAConfig not found"), null);
                    }
                }
                this.saConfig = [];
                for (var i = 0; i < result.entities.length; i++) {
                    this.saConfig.push(new SAConfig(result.entities[i], this.acConfigSchema.AdaptiveCardTemplateAlias, appConfigName))
                }
                if (this.saConfig.length == 0) {
                    telemetryHelper.logTelemetryError(TelemetryEventTypes.NoSAConfigFound, new Error("No SAConfig record found"), null);
                }
                window.sessionStorage.setItem(Constants.SAConfigCacheKey, JSON.stringify(this.saConfig));
                timer.stop(params);
            } catch (error) {
                params.addParameter("ExceptionDetails", error);
                timer.fail("failed to fetch SmartAssist config data", params);
                telemetryHelper.logTelemetryError(TelemetryEventTypes.ExceptionInFetchingSAConfigData, "Failed to fetch SA config data", params.getEventParams());
            }
        }

        /**
         *  Gets xml query to fetch sa Configs
         * @param appConfigName: App  Config Unique name
         */
        private getXmlQueryForSAConfig(appConfigName: string): string {
            let filter = `<filter type='and'><condition attribute='${this.saConfigSchema.StatusCode}' operator='eq' value='${SAConfigStatus.Active}' /></filter>`
            let appConfigfilter = ` <filter type='and'><condition attribute='${Constants.uniqueNameSchema}' operator='eq' value='${appConfigName}' /></filter>`
            let query: string = `?fetchXml=<fetch version="1.0"><entity name="${this.saConfigSchema.EntityName}"><all-attributes/>{0}
                                    <link-entity name="${Constants.saAppRealtionName}" from="${this.saConfigSchema.SmartassistConfigurationId}" to="${this.saConfigSchema.SmartassistConfigurationId}" link-type="inner">
                                      <link-entity name="${Constants.appConfigEntityName}" from="${Constants.appIdSchema}" to="${Constants.appIdSchema}" link-type="inner">{1}
                                      </link-entity>
                                    </link-entity>
                                    <link-entity name="${this.acConfigSchema.EntityName}" to="${this.saConfigSchema.SuggestionControlConfigUniquename}" from="${this.acConfigSchema.UniqueName}" link-type="outer">
                                      <attribute name="${this.acConfigSchema.AdaptiveCardTemplate}" alias="${this.acConfigSchema.AdaptiveCardTemplateAlias}"/>
                                    </link-entity>
                                  </entity>
                                </fetch>`;
            query = query.Format(filter, appConfigfilter);
            return query
        }

        /**Fetches all default SA Configs */
        private getFetchXmlForDefaultSAConfig(): string {
            let query: string = `?fetchXml=<fetch version="1.0"><entity name="${this.saConfigSchema.EntityName}">
                                    <all-attributes/>
                                    <filter type='and'><condition attribute='${this.saConfigSchema.StatusCode}' operator='eq' value='${SAConfigStatus.Active}' /></filter>
                                    <filter type='and'><condition attribute='${this.saConfigSchema.IsDefault}' operator='eq' value='1' /></filter>
                                    <link-entity name="${this.acConfigSchema.EntityName}" to="${this.saConfigSchema.SuggestionControlConfigUniquename}" from="${this.acConfigSchema.UniqueName}" link-type="outer">
                                      <attribute name="${this.acConfigSchema.AdaptiveCardTemplate}" alias="${this.acConfigSchema.AdaptiveCardTemplateAlias}"/>
                                    </link-entity>
                                </entity>
                                </fetch>`
            return query;
        }

        /**Get Session Sttings */
        public async getSuggestionsSetting(sessionId: string, telemetryHelper: TelemetryHelper) {
            const timer = SmartassistPanelControl._telemetryReporter.startTimer("getSuggestionsSetting");
            const params = new TelemetryLogger.EventParameters();

            if (this.suggestionsSetting[sessionId] == null || this.suggestionsSetting[sessionId].SuggestionsSettingId == null) {
                await this.getSuggestionsSettingFromAPI(telemetryHelper);
                params.addParameter("Source", "api");
            } else params.addParameter("Source", "cache");

            timer.stop(params);
            return this.suggestionsSetting[sessionId];
        }

        /**Gets Admin settings for KM and Case suggestions */
        private async getSuggestionsSettingFromAPI(telemetryHelper: TelemetryHelper) {
            const timer = SmartassistPanelControl._telemetryReporter.startTimer("getSuggestionSettingFromAPI");
            const params = new TelemetryLogger.EventParameters();
            
            telemetryHelper.logTelemetrySuccess(TelemetryEventTypes.FetchingSuggestionSettingsFromAPI, null);
            
            try {
                var currentSessionId = Utility.getCurrentSessionId();
                var result = await SmartassistPanelControl._context.webAPI.retrieveMultipleRecords(this.suggestionsSettingSchema.EntityName, `?$filter=${this.suggestionsSettingSchema.StatusCode} eq ${SuggestionsSettingState.Active}`) as any;
                if (result && result.entities && result.entities.length > 0) {
                    var data = new SuggestionsSetting(result.entities[0])
                    this.suggestionsSetting[currentSessionId] = data;
                }
                else throw "no suggestion settings record found";

                timer.stop(params);
            }
            catch (error) {
                data = new SuggestionsSetting(null);
                this.suggestionsSetting[currentSessionId] = data;
                
                params.addParameter("ExceptionDetails", error);
                timer.fail("failed to retrieve Suggestion Settings", params);
                telemetryHelper.logTelemetryError(TelemetryEventTypes.SuggestionSettingsFailed, error, params.getEventParams());
            }
            return this.suggestionsSetting[currentSessionId];
        }

        /**Check if Smart assist is added in OC WS */
        public async isSmartbotAvailable(telemetryHelper: TelemetryHelper) {
            const timer = SmartassistPanelControl._telemetryReporter.startTimer("isSmartbotAvailable");
            const params = new TelemetryLogger.EventParameters();

            var liveworkStreamItem = await Utility.getLiveWorkStreamId();
            if (Utility.isNullOrEmptyString(liveworkStreamItem)) {
                params.addParameter("IsSmartbotAvailable", false);
                telemetryHelper.logTelemetryError(TelemetryEventTypes.LiveWorkStreamIdNotFound, new Error("LiveWorkStreamIdNotFound"), params.getEventParams());
                timer.fail("live workstream ID not found", params);
                return false;
            }
            params.addParameter("LiveWorkstreamId", liveworkStreamItem);
            
            const result = await this.FetchSmartAssistBotRecordAndSetCriteria(liveworkStreamItem, telemetryHelper);
            params.addParameter("IsSmartbotAvailable", result);

            timer.stop(params);
            return result;
        }

        /**
         * Fet sa bots set SA rendering criteria
         * @param liveWorkStreamId: Work Stream Unique identifier
         */
        private async FetchSmartAssistBotRecordAndSetCriteria(liveWorkStreamId: string, telemetryHelper: TelemetryHelper) {
            const timer = SmartassistPanelControl._telemetryReporter.startTimer("FetchSmartAssistBotRecordAndSetCriteria");
            const params = new TelemetryLogger.EventParameters();
            params.addParameter("LiveWorkstreamId", liveWorkStreamId);

            try {
                var sessionId = Utility.getCurrentSessionId();
                params.addParameter("SessionId", sessionId);

                // Check if this value is already in the cache. If so, use it.
                if (this.smartbotConfig[sessionId + liveWorkStreamId] != null) {
                    params.addParameter("Source", "cache");
                } else {
                    params.addParameter("Source", "api");

                    //fetch smart assist bots
                    let fetchXml = this.getSmartAssistFetchXml(liveWorkStreamId);
                    let fetchXmlQuery = Constants.FetchOperator + encodeURIComponent(fetchXml);
                    let dataResponse = await SmartassistPanelControl._context.webAPI.retrieveMultipleRecords(Constants.UserEntityName, fetchXmlQuery) as any;
                    let entityRecords: WebApi.Entity[] = dataResponse.entities;
                    this.smartbotConfig[sessionId + liveWorkStreamId] = entityRecords.length > 0;
                }

                params.addParameter("Result", this.smartbotConfig[sessionId + liveWorkStreamId]);
                timer.stop(params);
            }
            catch (error) {
                this.smartbotConfig = {};
                telemetryHelper.logTelemetryError(TelemetryEventTypes.ExceptionInFetchingTPBDetails, error, []);
                params.addParameter("ExceptionDetails", error);
                timer.fail("failed to fetch SmartBot users", params);
            }

            return this.smartbotConfig[sessionId + liveWorkStreamId];
        }

        /**
         * Get XML for SA binding with LWS
         * @param workStreamId: Work Stream Unique ID
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