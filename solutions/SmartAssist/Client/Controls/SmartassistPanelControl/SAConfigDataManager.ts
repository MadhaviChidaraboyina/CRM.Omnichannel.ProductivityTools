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
            let environmentData = await Utility.getAppRuntimeEnvironment();
            this.getSAConfigurationFromCache(environmentData.AppConfigName, telemetryHelper);
            if ((this.saConfig.length < 1)) {
                await this.fetchSAConfigurationsData(environmentData.AppConfigName, telemetryHelper);
            }

            return this.saConfig;
        }

        /**
        * Get Filtered SA config from admin suggestions setting
        * @param saConfig: All active SA config
        */
        public async getFilteredSAConfig(sourceEntity: string, telemetryHelper: TelemetryHelper) {
            let sessionId = Utility.getCurrentSessionId();
            await this.getSuggestionsSetting(sessionId, telemetryHelper);
            let configs = await this.getSAConfigurations(telemetryHelper);

            let isSmartbotAvailable = false;
            let botConfig = configs.find(i => i.SuggestionType == SuggestionType.BotSuggestion);
            if (botConfig) {
                isSmartbotAvailable = await this.isSmartbotAvailable(telemetryHelper) as any;
            }

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
            return result;
        }

        private getSAConfigurationFromCache(appConfigName: string, telemetryHelper: TelemetryHelper) {
            let eventParameters = new TelemetryLogger.EventParameters();
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
                telemetryHelper.logTelemetryError(TelemetryEventTypes.ExceptionInFetchingSAConfigFromCache, error, null);
            }
        };

        /**Fetch SA config from cds */
        private async fetchSAConfigurationsData(appConfigName: string, telemetryHelper: TelemetryHelper) {
            let eventParameters = new TelemetryLogger.EventParameters();
            try {
                let fetchXml = this.getXmlQueryForSAConfig(appConfigName)
                var result = await SmartassistPanelControl._context.webAPI.retrieveMultipleRecords(this.saConfigSchema.EntityName, fetchXml) as any;
                if (result.entities.length < 1) {
                    telemetryHelper.logTelemetrySuccess(TelemetryEventTypes.AppProfileAssociationNotFound, null);
                    telemetryHelper.logTelemetrySuccess(TelemetryEventTypes.FetchingDefaultSAConfig, null);
                    let defaultConfigFetchXml = this.getFetchXmlForDefaultSAConfig();
                    result = await SmartassistPanelControl._context.webAPI.retrieveMultipleRecords(this.saConfigSchema.EntityName, defaultConfigFetchXml) as any;
                    if (result && result.entities && result.entities.length < 1) {
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
            } catch (error) {
                telemetryHelper.logTelemetryError(TelemetryEventTypes.ExceptionInFetchingSAConfigData, error, null);
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
            if (this.suggestionsSetting[sessionId] && !Utility.isNullOrEmptyString(this.suggestionsSetting[sessionId].SuggestionsSettingId)) {
                telemetryHelper.logTelemetrySuccess(TelemetryEventTypes.FetchingSuggestionSettingsFromCache, null);
                return this.suggestionsSetting[sessionId];
            }
            return this.getSuggestionsSettingFromAPI(telemetryHelper);
        }

        /**Gets Admin settings for KM and Case suggestions */
        private async getSuggestionsSettingFromAPI(telemetryHelper: TelemetryHelper) {
            telemetryHelper.logTelemetrySuccess(TelemetryEventTypes.FetchingSuggestionSettingsFromAPI, null);
            let eventParameters = new TelemetryLogger.EventParameters();
            var currentSessionId = Utility.getCurrentSessionId();
            try {
                var result = await SmartassistPanelControl._context.webAPI.retrieveMultipleRecords(this.suggestionsSettingSchema.EntityName, `?$filter=${this.suggestionsSettingSchema.StatusCode} eq ${SuggestionsSettingState.Active}`) as any;
                if (result && result.entities && result.entities.length > 0) {
                    var data = new SuggestionsSetting(result.entities[0])
                    this.suggestionsSetting[currentSessionId] = data;
                }
                else {
                    telemetryHelper.logTelemetryError(TelemetryEventTypes.SuggestionSettingsNotFound, new Error("No suggestion settings record found"), null);
                    data = new SuggestionsSetting(null);
                    this.suggestionsSetting[currentSessionId] = data;
                }
            }
            catch (error) {
                data = new SuggestionsSetting(null);
                this.suggestionsSetting[currentSessionId] = data;
                telemetryHelper.logTelemetryError(TelemetryEventTypes.ExceptionInSuggestionSettings, error, null);
            }
        }

        /**Check if Smart assist is added in OC WS */
        public async isSmartbotAvailable(telemetryHelper: TelemetryHelper) {
            var liveworkStreamItem = Utility.getLiveWorkStreamId();
            if (Utility.isNullOrEmptyString(liveworkStreamItem)) {
                telemetryHelper.logTelemetryError(TelemetryEventTypes.LiveWorkStreamIdNotFound, new Error("LiveWorkStreamIdNotFound"), null);
                return false;
            }
            var sessionId = Utility.getCurrentSessionId();
            if (this.smartbotConfig[sessionId + liveworkStreamItem] != undefined) {
                return this.smartbotConfig[sessionId + liveworkStreamItem];
            }
            await this.FetchSmartAssistBotRecordAndSetCriteria(liveworkStreamItem, sessionId, telemetryHelper);
            return this.smartbotConfig[sessionId + liveworkStreamItem];
        }

        /**
         * Fet sa bots set SA rendering criteria
         * @param liveWorkStreamId: Work Stream Unique identifier
         */
        private async FetchSmartAssistBotRecordAndSetCriteria(liveWorkStreamId: string, sessionId: string, telemetryHelper: TelemetryHelper) {
            let eventParameters = new TelemetryLogger.EventParameters();
            try {
                //fetch smart assist bots
                let fetchXml = this.getSmartAssistFetchXml(liveWorkStreamId);
                let fetchXmlQuery = Constants.FetchOperator + encodeURIComponent(fetchXml);
                let dataResponse = await SmartassistPanelControl._context.webAPI.retrieveMultipleRecords(Constants.UserEntityName, fetchXmlQuery) as any;
                let entityRecords: WebApi.Entity[] = dataResponse.entities;
                this.smartbotConfig[sessionId + liveWorkStreamId] = entityRecords.length > 0;
            }
            catch (error) {
                this.smartbotConfig = {};
                telemetryHelper.logTelemetryError(TelemetryEventTypes.ExceptionInFetchingTPBDetails, error, null);
            }
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