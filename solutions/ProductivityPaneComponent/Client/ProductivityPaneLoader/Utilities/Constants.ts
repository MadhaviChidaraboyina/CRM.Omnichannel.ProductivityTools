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

        // Attributes
        public static msdyn_icon = 'msdyn_icon';
    }

    export class WebresourceConstants {
        // Attributes
        public static webresourceName = 'name';

        public static pathPrefix = 'WebResources/';
    }

    export class PcfControlConstants {
        public static pageType = 'control';

        public static smartAssist = 'MscrmControls.SmartassistPanelControl.SmartassistPanelControl';
        public static agentScript = 'MscrmControls.Callscript.CallscriptControl';
        public static knowledgeSearch = 'MscrmControls.KnowledgeControl.KnowledgeControl';

        public static PcfControlProps = {
            parameters: {
                IsLoadedInPanel: {
                    Usage: 1,
                    Static: true,
                    Value: true,
                    Primary: false,
                },
            },
        };
    }

    export class CustomPageConstants {
        public static pageType = 'custom';
    }

    export class LocalizedStringKeys {
        public static CustomPageNameLabel = 'CustomPage_Name_Label'
        public static ControlNameLabel = 'Control_Name_Label';
    }

    export class Constants {
        // App side pane
        public static teamsCollabControlName = 'MscrmControls.OfficeProductivity.CollabControl';
        public static teamsCallsControlName = 'TeamsDialerLayoutHostControl.LayoutHostControl';
        public static appSidePaneIdPrefix = 'AppSidePane_';
        public static SmartAssistPaneId = 'AppSidePane_MscrmControls.SmartassistPanelControl.SmartassistPanelControl';

        // Session storage
        public static appSidePaneSessionState = 'appSidePaneSessionState_';
        public static selectedAppSidePaneId = 'selectedAppSidePaneId';
        public static appSidePanesState = 'appSidePanesState';
        public static emptyString = '';

        // Numbers
        public static firstElement = 0;
        public static appSidePanesCollapsed = 0;
        public static appSidePanesExpanded = 1;
        public static stateCodeActive = 0;

        // Session id
        public static homeSessionId = 'session-id-0';

        // Log prefix
        public static productivityToolsLogPrefix = '[ProductivityToolsLog]';

        // Log Constants
        public static StartingMessage = 'Starting';
        public static SuccessMessage = 'Success';

        // Error
        public static Error = 'Error';
    }

    export class ToolUniqueNames {
        public static smartAssist = "msdyn_smartassist_tool_config";
        public static agentScript = "msdyn_callscript_tool_config";
        public static knowledgeSearch = "msdyn_knowledgesearch_tool_config";
        public static teamsCollab = "msdyn_teamscollab_tool_config";
    }

    export class ProductivityPaneLoggerConstants {
        public static productivityPaneLoaderPrefix = "ProductivityPaneLoader";
        public static loadPanesHelperloadAppSidePanesPrefix = "LoadPanesHelper_loadAppSidePanes";

    }

    export class CustomParameterConstants {
        public static EventType = "EventType";
        public static PaneId = "PaneId";
        public static ToolUniqueName = "ToolUniqueName";
        public static ToolControlName = "ToolControlName";
        public static ToolType = "ToolType";
        public static ControlToolCount = "ControlToolCount";
        public static DefaultToolCount = "DefaultToolCount";
        public static CustomPageToolCount = "CustomPageToolCount";
        public static CustomToolCount = "CustomToolCount";
        public static IsCustomTool = "IsCustomTool";
        public static PaneMode = "PaneMode";
    }

    export enum EventType {
        PRODUCTIVITY_TOOLS_LOAD_SUCCESS,
        PRODUCTIVITY_TOOLS_LOAD_FAILURE,
        APP_SIDE_PANE_LOAD_SUCCESS,
        APP_SIDE_PANE_LOAD_FAILURE,
        SESSION_CHANGE_MANAGER_SUCCESS,
        SESSION_CHANGE_MANAGER_ERROR,
        SCRIPT_LOAD_SUCCESS,
        SCRIPT_LOAD_FAILURE,
        SET_SESSION_STORAGE_FAILURE,
        APM_CONFIG_EXTRACTOR_FAILURE,
        APM_CONFIG_EXTRACTOR_XRM_API_FAILURE,
        APP_SIDE_PANE_LOAD,
        PRODUCTIVITY_TOOLS_LOAD
    }

    export enum ToolType {
        CONTROL,
        CUSTOM_PAGE
    }
}
