/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

module MscrmControls.SmartassistPanelControl {

    /**msdyn_adaptivecardconfiguration Entity Schema */
    export class ACConfigSchema {
        public AdaptiveCardTemplate: string;
        public AdaptiveCardTemplateAlias: string;
        public AdaptiveCardConfigurationId: string;
        public UniqueName: string;
        public EntityName: string;

        constructor() {
            this.AdaptiveCardTemplate = "msdyn_adaptivecardtemplate"
            //for fetchXml
            this.AdaptiveCardTemplateAlias = "AdaptiveCardTemplate"
            this.AdaptiveCardConfigurationId = "msdyn_adaptivecardconfigurationid"
            this.UniqueName = "msdyn_uniquename"
            this.EntityName = "msdyn_adaptivecardconfiguration"            
        }
    }
}