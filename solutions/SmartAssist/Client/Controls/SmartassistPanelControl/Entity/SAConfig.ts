/**
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

        /**
         * Sets SAConfig Model Values.
         * @param response: Response from server call.
         * @param AttributeName: SA Config Schema.
         * @param _util: Utility reference.
         * @param context:The "Input Bag" containing the parameters and other control metadata.
         */
        constructor(response: any, AttributeName: SAConfigSchema, AdaptiveCardTemplateAlias: string, _util: Utility, context: Mscrm.ControlData<IInputBag>) {
            if (!context.utils.isNullOrUndefined(response)) {
                this.MaxSuggestionCount = _util.GetValue(response[AttributeName.MaxSuggestionCount]);
                this.Order = _util.GetValue(response[AttributeName.Order]);
                this.SuggestionControlId = _util.GetValue(response[AttributeName.SuggestionControlId]);
                this.SuggestionControlType = _util.GetValue(response[AttributeName.SuggestionControlType]) as SuggestionControlType;
                this.SuggestionType = _util.GetValue(response[AttributeName.SuggestionType]) as SuggestionType;
                this.StatusCode = _util.GetValue(response[AttributeName.StatusCode]) as SAConfigStatus;
                this.SuggestionWebresourceFunction = _util.GetValue(response[AttributeName.SuggestionWebresourceFunction]);
                this.SuggestionWebResourceName = _util.GetValue(response[AttributeName.SuggestionWebResourceName]);
                this.UniqueName = _util.GetValue(response[AttributeName.UniqueName]);
                this.ACTemplate = _util.GetValue(response[AdaptiveCardTemplateAlias]);
                this.SmartassistConfigurationId = _util.GetValue(response[AttributeName.SmartassistConfigurationId]);
            }
        }
    }
}