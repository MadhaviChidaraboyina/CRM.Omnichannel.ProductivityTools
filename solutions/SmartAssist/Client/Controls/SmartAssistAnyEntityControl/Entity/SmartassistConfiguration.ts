/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

module MscrmControls.SmartAssistAnyEntityControl {

    /**SAConfig Entity Schema */
    export class SAConfigSchema {
        public EntityName: string;

        public MaxSuggestionCount: string;
        public Order: string;
        public SuggestionControlId: string;
        public SuggestionControlType: string;
        public SuggestionType: string;
        public SuggestionProvider: string;
        public SuggestionWebResourceUrl: string;
        public SAConfigTitle: string;
        public SmartassistConfigurationId: string;
        public StatusCode: string;
        public TitleIconePath: string;
        public SuggestionControlConfigUniquename: string;
        public UniqueName: string;
        public SourceEntityName: string;

        /**Define SAConfig Entity props schema*/
        constructor() {
            this.MaxSuggestionCount = "msdyn_maxsuggestioncount";
            this.Order = "msdyn_order";            
            this.SuggestionControlType = "msdyn_suggestioncontroltype";
            this.SuggestionType = "msdyn_suggestiontype";
            this.SuggestionProvider = "msdyn_suggestionprovider";
            this.SuggestionWebResourceUrl = "msdyn_suggestionwebresourceurl";
            this.UniqueName = "msdyn_uniquename";
            this.SAConfigTitle = "msdyn_suggestioncontainertitle";
            this.SmartassistConfigurationId = "msdyn_smartassistconfigid";
            this.StatusCode = "statuscode";
            this.TitleIconePath = "msdyn_iconurl";
            this.SuggestionControlConfigUniquename = "msdyn_suggestioncontrolconfiguniquename";
            this.EntityName = "msdyn_smartassistconfig";
            this.SourceEntityName = "msdyn_sourceentityname";            
        }
    }

    /**SAConfig entity busines object*/
    export class SAConfig {
        public ACTemplate = "";
        public MaxSuggestionCount = "";
        public Order = "";        
        public SuggestionControlType: SuggestionControlType = null;
        public SuggestionType: number = null;
        public SuggestionProvider = "";
        public SuggestionWebResourceUrl = "";
        public SAConfigTitle = "";
        public UniqueName = "";
        public StatusCode: number = null;
        public SmartassistConfigurationId = "";
        public SourceEntityName = "";
        public SuggestionControlConfigUniquename = "";
        public CurrentAppConfigName = "";
        public TitleIconePath = "";
        public IsEnabled: boolean = true;
    }
}