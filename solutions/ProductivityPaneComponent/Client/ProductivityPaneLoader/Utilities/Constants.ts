/**
 * @license Copyright (c) Microsoft Corporation.  All rights reserved.
 */
module ProductivityPaneLoader {
    export class QueryDataConstants {
        public static SelectOperator = '$select=';
        public static FilterOperator = '$filter=';
        public static ExpandOperator = '$expand=';
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
    export class ToolConfigConstants {
        // Entity constants
        public static entityName = 'msdyn_panetoolconfiguration';
    }

    export class PcfControlConstants {
        public static pageType = 'control';

        public static smartAssist = 'MscrmControls.SmartassistPanelControl.SmartassistPanelControl';
        public static agentScript = 'MscrmControls.Callscript.CallscriptControl';
        public static knowledgeSearch = 'MscrmControls.KnowledgeControl.KnowledgeControl';

        public static PcfControlProps = {
            parameters: {
                SessionContext: {
                    Usage: 1,
                    Static: true,
                    Value: '{}',
                    Primary: false,
                },
                AnchorTabContext: {
                    Usage: 1,
                    Static: true,
                    Value: null,
                    Primary: false,
                },
                IsLoadedInPanel: {
                    Usage: 1,
                    Static: true,
                    Value: true,
                    Primary: false,
                },
                StaticData: {
                    Usage: 1,
                    Static: true,
                    Value: '{}',
                    Primary: false,
                },
                IsSelected: {
                    Usage: 1,
                    Static: true,
                    Value: true,
                    Primary: false,
                },
            },
        };

        // Serve legacy productivity pane. Will be removed post Oct 2021 release
        public static sidePaneKey = 'ProductivityPaneSidePanelId';
        public static paneControlName = 'MscrmControls.PanelControl.PanelControl';
    }

    export class Constants {
        // FCB
        public static fcbProductivityToolsUseAppSidePanes = 'FCB.ProductivityTools.UseAppSidePanes';

        // Style
        public static appSidePaneWidth = 296;

        // Session storage
        public static appSidePaneSessionState = 'appSidePaneSessionState_';
        public static selectedAppSidePaneId = 'selectedPaneId';
        public static emptyString = '';

        // Numbers
        public static firstElement = 0;
        public static collapseAppSidePane = 0;
        public static expandAppSidePane = 1;

        // Session id
        public static homeSessionId = 'session-id-0';
    }
}
