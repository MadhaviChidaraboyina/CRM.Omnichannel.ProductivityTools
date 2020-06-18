﻿/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

module MscrmControls.SmartassistPanelControl {

    /**SAConfig Entity Schema */
    export class SAConfigSchema {
        public MaxSuggestionCount: string;
        public Order: string;
        public SuggestionControlId: string;
        public SuggestionControlType: string;
        public SuggestionType: string;
        public SuggestionWebresourceFunction: string;
        public SuggestionWebResourceName: string;
        public UniqueName: string;
        public SmartassistConfigurationId: string;
        public StatusCode: string;
        public EntityName: string;

        /**Define SAConfig Entity props schema*/
        constructor() {
            this.MaxSuggestionCount = "msdyn_maximumsuggestioncount";
            this.Order = "msdyn_order";
            this.SuggestionControlId = "msdyn_suggestioncontrolid";
            this.SuggestionControlType = "msdyn_suggestioncontroltype";
            this.SuggestionType = "msdyn_suggestiontype";
            this.SuggestionWebresourceFunction = "msdyn_suggestionwebresourcemethodname";
            this.SuggestionWebResourceName = "msdyn_suggestionwebresourcename";
            this.UniqueName = "msdyn_uniquename";
            this.SmartassistConfigurationId = "msdyn_saconfigid";
            this.StatusCode = "statuscode";
            this.EntityName = "msdyn_saconfig";
        }
    }

    /**SAConfig entity busines object*/
    export class SAConfig {
        public MaxSuggestionCount = "";
        public Order = "";
        public SuggestionControlId = "";
        public SuggestionControlType: SuggestionControlType = null;
        public SuggestionType: number = null;
        public SuggestionWebresourceFunction = "";
        public SuggestionWebResourceName = "";
        public UniqueName = "";
        public ACTemplate = "";
        public StatusCode: number = null;
        public SmartassistConfigurationId = "";
        public AttributeName: SAConfigSchema = new SAConfigSchema();

        /**
         * Sets SAConfig Model Values.
         * @param response: Response from server call.
         * @param context:The "Input Bag" containing the parameters and other control metadata.
         */
        constructor(response: any, AdaptiveCardTemplateAlias: string) {
            if (SmartassistPanelControl._context.utils.isNullOrUndefined(response)) {
                this.MaxSuggestionCount = Utility.GetValue(response[this.AttributeName.MaxSuggestionCount]);
                this.Order = Utility.GetValue(response[this.AttributeName.Order]);
                this.SuggestionControlId = Utility.GetValue(response[this.AttributeName.SuggestionControlId]);
                this.SuggestionControlType = Utility.GetValue(response[this.AttributeName.SuggestionControlType]) as SuggestionControlType;
                this.SuggestionType = Utility.GetValue(response[this.AttributeName.SuggestionType]) as SuggestionType;
                this.StatusCode = Utility.GetValue(response[this.AttributeName.StatusCode]) as SAConfigStatus;
                this.SuggestionWebresourceFunction = Utility.GetValue(response[this.AttributeName.SuggestionWebresourceFunction]);
                this.SuggestionWebResourceName = Utility.GetValue(response[this.AttributeName.SuggestionWebResourceName]);
                this.UniqueName = Utility.GetValue(response[this.AttributeName.UniqueName]);
                this.ACTemplate = Utility.GetValue(response[AdaptiveCardTemplateAlias]);
                this.SmartassistConfigurationId = Utility.GetValue(response[this.AttributeName.SmartassistConfigurationId]);
            }
        }
    }
}