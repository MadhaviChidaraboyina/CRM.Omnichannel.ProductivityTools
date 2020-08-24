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
        private suggestionsSettingSchema: SuggestionsSettingSchema = new SuggestionsSettingSchema();
        private isSmartbotAvailable: boolean = null;

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
        public async getSAConfigurations() {
            let environmentData = await Utility.getAppRuntimeEnvironment();
            this.getSAConfigurationFromCache(environmentData.AppConfigName);
            if ((this.saConfig.length < 1)) {
                await this.fetchSAConfigurationsData(environmentData.AppConfigName);
            }

            return this.saConfig;
        }

        /**
        * Get Filtered SA config from admin suggestions setting
        * @param saConfig: All active SA config
        */
        public async getFilteredSAConfig(sourceEntity: string) {
            var sessionId = Utility.getCurrentSessionId();
            await this.getSuggestionsSetting(sessionId);
            var configs = await this.getSAConfigurations();

            var isSmartbotAvailable = false;
            var botConfig = configs.find(i => i.SuggestionType == SuggestionType.BotSuggestion)
            if (botConfig) {
                isSmartbotAvailable = await this.isSmartassistAvailable() as any;
            }

            var result = configs.filter((data) => {
                if (data.SuggestionType == SuggestionType.BotSuggestion) return isSmartbotAvailable;

                //Source entity filter
                if (Utility.isValidSourceEntityName(sourceEntity)) {
                    if (sourceEntity != data.SourceEntityName) {
                        return false;
                    }
                }
                else {
                    data.IsValid = false;
                    if (data.CurrentAppConfigName == Constants.ocAppName && data.SourceEntityName != Constants.LWIEntityName) {
                        return false;
                    }
                }
                switch (data.SuggestionType) {
                    case SuggestionType.SimilarCaseSuggestion:
                        data.IsValid = this.suggestionsSetting[sessionId].CaseIsEnabled;
                        return true
                    case SuggestionType.KnowledgeArticleSuggestion:
                        data.IsValid = this.suggestionsSetting[sessionId].KbIsEnable;
                        return true;
                    case SuggestionType.BotSuggestion:
                        return isSmartbotAvailable;
                    default:
                        return true;
                }
            });
            return result;
        }

        private getSAConfigurationFromCache(appConfigName: string) {
            let eventParameters = new TelemetryLogger.EventParameters();
            try {
                var data = window.sessionStorage.getItem(Constants.SAConfigCacheKey);
                if (data) {
                    var saConfigs = JSON.parse(data) as SAConfig[];
                    if (saConfigs[0].CurrentAppConfigName == appConfigName) {
                        this.saConfig = saConfigs;
                    }
                }
            }
            catch (error) {
                eventParameters.addParameter("Exception Details", error.message);
                SmartassistPanelControl._telemetryReporter.logError(TelemetryComponents.MainComponent, "getSAConfigurationFromCache", "Error occurred while fetching SA Configurations Data from cache", eventParameters);
            }
        };

        /**Fetch SA config from cds */
        private async fetchSAConfigurationsData(appConfigName: string) {
            let eventParameters = new TelemetryLogger.EventParameters();
            try {
                let fetchXml = this.getXmlQueryForSAConfig(appConfigName)
                var result = await SmartassistPanelControl._context.webAPI.retrieveMultipleRecords(this.saConfigSchema.EntityName, fetchXml) as any;
                this.saConfig = [];
                for (var i = 0; i < result.entities.length; i++) {
                    this.saConfig.push(new SAConfig(result.entities[i], this.acConfigSchema.AdaptiveCardTemplateAlias, appConfigName))
                }
                try {
                    window.sessionStorage.setItem(Constants.SAConfigCacheKey, JSON.stringify(this.saConfig));
                }
                catch (error) {
                    eventParameters.addParameter("Exception Details", error.message);
                    SmartassistPanelControl._telemetryReporter.logError(TelemetryComponents.MainComponent, "fetchSAConfigurationsData", "Error occurred while to store sa config data in cache.", eventParameters);
                }
            } catch (error) {
                eventParameters.addParameter("Exception Details", error.message);
                SmartassistPanelControl._telemetryReporter.logError(TelemetryComponents.MainComponent, "fetchSAConfigurationsData", "Error occurred while fetching SA Configurations Data", eventParameters);
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

        /**Get Session Sttings */
        public async getSuggestionsSetting(sessionId: string) {
            if (this.suggestionsSetting[sessionId] && !Utility.isNullOrEmptyString(this.suggestionsSetting[sessionId].SuggestionsSettingId)) {
                return this.suggestionsSetting[sessionId];
            }
            return this.getSuggestionsSettingFromAPI();
        }

        /**Gets Admin settings for KM and Case suggestions */
        private async getSuggestionsSettingFromAPI() {
            let eventParameters = new TelemetryLogger.EventParameters();
            var currentSessionId = Utility.getCurrentSessionId();
            try {
                var result = await SmartassistPanelControl._context.webAPI.retrieveMultipleRecords(this.suggestionsSettingSchema.EntityName, `?$filter=${this.suggestionsSettingSchema.StatusCode} eq ${SuggestionsSettingState.Active}`) as any;
                if (result && result.entities && result.entities.length > 0) {
                    var data = new SuggestionsSetting(result.entities[0])
                    this.suggestionsSetting[currentSessionId] = data;
                }
                else {
                    data = new SuggestionsSetting(null);
                    this.suggestionsSetting[currentSessionId] = data;
                }
            }
            catch (error) {
                data = new SuggestionsSetting(null);
                this.suggestionsSetting[currentSessionId] = data;
                eventParameters.addParameter("Exception Details", error.message);
                SmartassistPanelControl._telemetryReporter.logError(TelemetryComponents.MainComponent, "getSuggestionsSetting", "Error occurred while fetching suggestions admin settings", eventParameters);
            }
        }

        /**Check if Smart assist is added in OC WS */
        public async isSmartassistAvailable() {
            var liveworkStreamItem = Utility.getLiveWorkStreamId();
            if (Utility.isNullOrEmptyString(liveworkStreamItem)) {
                return false;
            }
            var sessionId = Utility.getCurrentSessionId();
            let isSmartAssistBotAvailable: any = sessionStorage.getItem(sessionId + liveworkStreamItem + Constants.isSmartAssistFoundName);
            if (isSmartAssistBotAvailable == null) {
                await this.FetchSmartAssistBotRecordAndSetCriteria(liveworkStreamItem, sessionId);
                return this.isSmartbotAvailable;
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
                let fetchXmlQuery = Constants.FetchOperator + encodeURIComponent(fetchXml);
                let dataResponse = await SmartassistPanelControl._context.webAPI.retrieveMultipleRecords(Constants.UserEntityName, fetchXmlQuery) as any;
                let entityRecords: WebApi.Entity[] = dataResponse.entities;
                this.isSmartbotAvailable = entityRecords.length > 0;
                sessionStorage.setItem(sessionId + liveWorkStreamId + Constants.isSmartAssistFoundName, this.isSmartbotAvailable as any)

                eventParameters.addParameter("total SmartAssistBotRecordFetch", entityRecords.length.toString());
                SmartassistPanelControl._telemetryReporter.logSuccess("Main Component", "SmartAssistBotRecordFetch", eventParameters);
            }
            catch (error) {
                this.isSmartbotAvailable = null;
                sessionStorage.removeItem(sessionId + liveWorkStreamId + Constants.isSmartAssistFoundName);
                eventParameters.addParameter("Exception Details", error.message);
                SmartassistPanelControl._telemetryReporter.logError("Main Component", "SmartAssistBotRecordFetch", "Error occurred while fetching smart assist bot", eventParameters);
            }

        }

        /**
         * Get XML for SA binding with LWS
         * @param workStreamId: Word Stream Unique ID
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