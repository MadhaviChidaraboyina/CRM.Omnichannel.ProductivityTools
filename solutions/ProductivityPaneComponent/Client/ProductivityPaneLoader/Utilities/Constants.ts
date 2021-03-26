/**
 * @license Copyright (c) Microsoft Corporation.  All rights reserved.
 */
module ProductivityPaneLoader {
    export class QueryDataConstants {
        public static SelectOperator = '$select=';
        public static FilterOperator = '$filter=';
        public static ExpandOperator = '$expand=';
    }

    export class ProductivityPaneConfigConstants {
        // Entity constants
        public static entityName = 'msdyn_paneconfiguration';

        // Attributes
        public static productivityPaneState = 'msdyn_panestate';
        public static productivityPaneMode = 'msdyn_panemode';
        public static msdyn_uniqueName = 'msdyn_uniquename';

        //Relationship
        public static paneTabRelationship = 'msdyn_msdyn_paneconfig_msdyn_tabconfig';
    }

    export class AppConfigConstants {
        // Entity constants
        public static entityName = 'msdyn_appconfiguration';

        // Attributes
        public static msdyn_uniqueName = 'msdyn_uniquename';
        public static msdyn_appmoduleuniquename = 'msdyn_appmoduleuniquename';

        //Relationship
        public static appPaneRelationship = 'msdyn_msdyn_paneconfig_msdyn_appconfig';
    }

    export class ToolConfigConstants {
        // Entity constants
        public static entityName = 'msdyn_panetoolconfiguration';
    }

    export class PCFControlConstants {
        public static pageType = 'control';
        public static controlName = 'MscrmControls.PanelControl.PanelControl';
        public static sidePaneKey = 'ProductivityPaneSidePanelId';
    }
}
