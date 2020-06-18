/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

module MscrmControls.SmartAssistAnyEntityControl {

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

        //todo: add all props
        public MaxSuggestionCount = "";
        public Order = "";
        public SuggestionControlId = "";
        public SuggestionControlType: SuggestionControlType = SuggestionControlType.AdaptiveCard;
        public SuggestionType: SuggestionType = null;
        public SuggestionWebresourceFunction = "";
        public SuggestionWebResourceName = "";
        public UniqueName = "";
        public ACTemplate = "";
        public StatusCode = SAConfigStatus;
        public SmartassistConfigurationId = "";
    }
}