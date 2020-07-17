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
        private suggestionsSetting: SuggestionsSetting = null;
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
        public async getSAConfigurations() {
            this.getSAConfigurationFromCache();
            if ((this.saConfig.length < 1)) {
                await this.fetchSAConfigurationsData();
            }

            return this.saConfig;
        }

        /**
         * Get Filtered SA config from admin suggestions setting
         * @param saConfig: All active SA config
         */
        public async getFilteredSAConfig() {
            await this.getSuggestionsSetting();
            var configs = await this.getSAConfigurations();
            var result = configs.filter((data) => {
                switch (data.SuggestionType) {
                    case SuggestionType.SimilarCaseSuggestion:
                        return this.suggestionsSetting.CaseIsEnabled;
                    case SuggestionType.KnowledgeArticleSuggestion:
                        return this.suggestionsSetting.KbIsEnable;
                    default:
                        return true;
                }
            });
            return result;
        }

        private getSAConfigurationFromCache() {
            let eventParameters = new TelemetryLogger.EventParameters();
            try {
                var data = window.sessionStorage.getItem(Constants.SAConfigCacheKey);
                if (data) {
                    this.saConfig = JSON.parse(data);
                }
            }
            catch (error) {
                eventParameters.addParameter("Exception Details", error.message);
                SmartassistPanelControl._telemetryReporter.logError(TelemetryComponents.MainComponent, "getSAConfigurationFromCache", "Error occurred while fetching SA Configurations Data from cache", eventParameters);
            }
        };

        /**Fetch SA config from cds */
        private async fetchSAConfigurationsData() {
            let eventParameters = new TelemetryLogger.EventParameters();
            try {
                let fetchXml = await this.getXmlQueryForSAConfig()
                var result = await SmartassistPanelControl._context.webAPI.retrieveMultipleRecords(this.saConfigSchema.EntityName, fetchXml) as any;
                this.saConfig = [];
                for (var i = 0; i < result.entities.length; i++) {
                    this.saConfig.push(new SAConfig(result.entities[i], this.acConfigSchema.AdaptiveCardTemplateAlias))
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
         * Gets xml query to fetch data from two entities
         * @param parentEntity : Parent Entity to join
         * @param parentId : Parent entity unique identifier
         * @param childEntity : Child Entity to join with
         * @param childId : Child entity unique identifier
         */
        private getXmlQueryForSAConfig(): string {
            let filter = `<filter type='and'><condition attribute='${this.saConfigSchema.StatusCode}' operator='eq' value='${SAConfigStatus.Active}' /></filter>`
            let query: string = `?fetchXml=<fetch version="1.0" mapping="logical"><entity name="${this.saConfigSchema.EntityName}"> <all-attributes/>{0} <link-entity name="${this.acConfigSchema.EntityName}" to="${this.saConfigSchema.SuggestionControlConfigUniquename}" from="${this.acConfigSchema.UniqueName}" link-type="inner"><attribute name="${this.acConfigSchema.AdaptiveCardTemplate}" alias="${this.acConfigSchema.AdaptiveCardTemplateAlias}"/></link-entity></entity></fetch>`;
            query = query.Format(filter);
            return query
        }

        /**Get Session Sttings */
        public async getSuggestionsSetting() {
            if (this.suggestionsSetting && !Utility.isNullOrEmptyString(this.suggestionsSetting.SuggestionsSettingId)) {
                return this.suggestionsSetting;
            }
            return this.getSuggestionsSettingFromAPI();
        }

        /**Gets Admin settings for KM and Case suggestions */
        private async getSuggestionsSettingFromAPI() {
            let eventParameters = new TelemetryLogger.EventParameters();
            try {
                var result = await SmartassistPanelControl._context.webAPI.retrieveMultipleRecords(this.suggestionsSettingSchema.EntityName, `?$filter=${this.suggestionsSettingSchema.StatusCode} eq ${SuggestionsSettingState.Active}`) as any;
                if (result && result.entities && result.entities.length > 0) {
                    this.suggestionsSetting = new SuggestionsSetting(result.entities[0]);
                }
                else {
                    this.suggestionsSetting = new SuggestionsSetting(null);
                }
            }
            catch (error) {
                this.suggestionsSetting = new SuggestionsSetting(null);
                eventParameters.addParameter("Exception Details", error.message);
                SmartassistPanelControl._telemetryReporter.logError(TelemetryComponents.MainComponent, "getSuggestionsSetting", "Error occurred while fetching suggestions admin settings", eventParameters);
            }
        }
    }
}