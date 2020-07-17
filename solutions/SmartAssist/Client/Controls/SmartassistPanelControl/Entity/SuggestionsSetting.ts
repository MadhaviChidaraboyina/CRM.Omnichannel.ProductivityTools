/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

module MscrmControls.SmartassistPanelControl {

    /**msdyn_suggestionssetting Entity Schema */
    export class SuggestionsSettingSchema {
        public SuggestionsSettingId: string;
        public StatusCode: string;
        public CaseIsEnabled: string;
        public KbIsEnable: string;
        public EntityName: string;

        constructor() {
            this.SuggestionsSettingId = "msdyn_suggestionssettingid";
            this.StatusCode = "statecode";
            this.CaseIsEnabled = "msdyn_caseisenabled";
            this.KbIsEnable = "msdyn_kbisenabled";
            this.EntityName = "msdyn_suggestionssetting";

        }
    }

    /**Define SuggestionsSetting busines object*/
    export class SuggestionsSetting {
        public AttributeName: SuggestionsSettingSchema = new SuggestionsSettingSchema();
        public SuggestionsSettingId = "";
        public StatusCode: number = SuggestionsSettingState.Inactive;
        public CaseIsEnabled: boolean = false;
        public KbIsEnable: boolean = false;

        constructor(response: any) {
            if (!SmartassistPanelControl._context.utils.isNullOrUndefined(response)) {
                this.SuggestionsSettingId = Utility.GetValue(response[this.AttributeName.SuggestionsSettingId]);
                this.StatusCode = Utility.GetValue(response[this.AttributeName.StatusCode]) as SuggestionsSettingState;
                this.CaseIsEnabled = Utility.GetValue(response[this.AttributeName.CaseIsEnabled]);
                this.KbIsEnable = Utility.GetValue(response[this.AttributeName.KbIsEnable]);
            }
        }
    }
}