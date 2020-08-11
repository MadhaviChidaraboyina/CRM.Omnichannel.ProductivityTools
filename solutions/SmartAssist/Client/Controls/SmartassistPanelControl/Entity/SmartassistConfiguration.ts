/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

module MscrmControls.SmartassistPanelControl {

    /**SAConfig Entity Schema */
    export class SAConfigSchema {
        public EntityName: string;

        public MaxSuggestionCount: string;
        public Order: string;        
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
            this.SourceEntityName = "msdyn_sourceentityname";
            this.EntityName = "msdyn_smartassistconfig";            
        }
    }

    /**SAConfig entity busines object*/
    export class SAConfig {
        public AttributeName: SAConfigSchema = new SAConfigSchema();

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
        public TitleIconePath = "";
        public SuggestionControlConfigUniquename = "";
        public SourceEntityName = "";

        /**
         * Sets SAConfig Model Values.
         * @param response: Response from server call.
         * @param context:The "Input Bag" containing the parameters and other control metadata.
         */
        constructor(response: any, AdaptiveCardTemplateAlias: string) {
            if (!SmartassistPanelControl._context.utils.isNullOrUndefined(response)) {
                this.ACTemplate = Utility.GetValue(response[AdaptiveCardTemplateAlias]);
                this.MaxSuggestionCount = Utility.GetValue(response[this.AttributeName.MaxSuggestionCount]);
                this.Order = Utility.GetValue(response[this.AttributeName.Order]);
                this.SuggestionControlType = Utility.GetValue(response[this.AttributeName.SuggestionControlType]) as SuggestionControlType;
                this.SuggestionType = Utility.GetValue(response[this.AttributeName.SuggestionType]) as SuggestionType;
                this.StatusCode = Utility.GetValue(response[this.AttributeName.StatusCode]) as SAConfigStatus;
                this.SuggestionProvider = Utility.GetValue(response[this.AttributeName.SuggestionProvider]);
                this.SuggestionWebResourceUrl = Utility.GetValue(response[this.AttributeName.SuggestionWebResourceUrl]);
                this.UniqueName = Utility.GetValue(response[this.AttributeName.UniqueName]);                
                this.SmartassistConfigurationId = Utility.GetValue(response[this.AttributeName.SmartassistConfigurationId]);
                this.SAConfigTitle = Utility.GetValue(response[this.AttributeName.SAConfigTitle]);
                this.TitleIconePath = Utility.GetValue(response[this.AttributeName.TitleIconePath]);
                this.SuggestionControlConfigUniquename = Utility.GetValue(response[this.AttributeName.SuggestionControlConfigUniquename]);
                this.SourceEntityName = Utility.GetValue(response[this.AttributeName.SourceEntityName]);
            }
        }
    }
}