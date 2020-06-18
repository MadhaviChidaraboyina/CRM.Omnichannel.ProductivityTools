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
        private logger: TelemetryLogger;

        constructor() {
        }

        /**
         * Set Telemetry logger for SAConfigDataManager
         * @param logger: Telemetry logger instance
         */
        public SetLogger(logger: TelemetryLogger) {
            this.logger = logger;
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
            if (this.saConfig.length < 1) {
                await this.fetchSAConfigurationsData();
            }
            return this.saConfig;
        }

        /**Fetch SA config from cds */
        private async fetchSAConfigurationsData() {
            let eventParameters = new EventParameters();
            try {
                let fetchXml = this.getXmlQueryForSAConfig()
                var result = await SmartassistPanelControl._context.webAPI.retrieveMultipleRecords(this.saConfigSchema.EntityName, fetchXml) as any;             
                for (var i = 0; i < result.entities.length; i++) {
                    this.saConfig.push(new SAConfig(result.entities[i], this.acConfigSchema.AdaptiveCardTemplateAlias))
                }
            } catch (error) {
                eventParameters.addParameter("Exception Details", error.message);
                this.logger.logError(this.logger.baseComponent, "fetchSAConfigurationsData", "Error occurred while fetching SA Configurations Data", eventParameters);
                throw error;
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
            let query: string = `?fetchXml=<fetch version="1.0" mapping="logical"><entity name="${this.saConfigSchema.EntityName}"> <all-attributes/> <link-entity name="${this.acConfigSchema.EntityName}" to="${this.saConfigSchema.SuggestionControlId}" from="${this.acConfigSchema.AdaptiveCardConfigurationId}" link-type="inner"><attribute name="${this.acConfigSchema.AdaptiveCardTemplate}" alias="${this.acConfigSchema.AdaptiveCardTemplateAlias}"/><filter type='and'><condition attribute='${this.saConfigSchema.StatusCode}' operator='eq' value='${SAConfigStatus.Active}' /></filter></link-entity></entity></fetch>`;
            return query
        }
    }
}