/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/

module MscrmControls.ProductivityToolPanel {
	'use strict';

	/**
	 * Key codes used for keyboard accessibility
	 */
	export enum KeyCodes {
		ENTER_KEY = 13,
		ESCAPE_KEY = 27,
		SPACE_KEY = 32,
		UP_ARROW_KEY = 38,
		DOWN_ARROW_KEY = 40
	}

	export enum ExecutionStatus {
		NotStarted,
		Started,
		Completed,
		Failed
    }

    export enum SidePanelControlState {
        Collpase = 0,
        Expand = 1,
        Hidden = 2
    }

	export class Constants {
		public static emptyString = "";
		public static whiteColour = "white";
		public static toolUnselectedBackground = "#efefef";
		public static toolSelectedBackground = "white";
		public static toolLeftBorderColour = "#E1DFDD";
		public static listItemId = "ProductivityPanelListItem-"
		public static toolIndicatorId = "tool-indicator-"
		public static agentGuidanceTooltip = "Agent_Guidance";
		public static productivityMacrosTooltip = "Productivity_Macros";
		public static expandToolTip = "ExpandMessage";
		public static collpaseToolTip = "CollpaseMessage";
		public static FALSE = false;
        public static TRUE = true;
        public static sessionCreated = "sessionCreated";
        public static sessionSwitched = "sessionSwitched";
        public static sessionClosed = "sessionClosed";
        public static toolSeparatorId = "toolSeparator";
        public static homeSessionId = "session-id-0";

		//class names for styling
		public static PanelToggleButton = "symbolFont SiteMap-symbol";

		//icon paths
		public static agentScriptIcon = "/webresources/cra2b_callscript_icon.svg";
		public static productivityMacrosIcon = "/webresources/cra2b_macros_icon.svg";
		public static productivityNotesIcon = "/webresources/cra2b_notes_icon.svg";
		public static panelToggleExpand = "/webresources/cra2b_panel_toggle_collapse_icon.svg";
		public static panelToggleCollpase = "/webresources/cra2b_panel_toggle_expand_icon.svg";

		//icon ids
		public static agentScriptIconId = "agentGuidanceIcon";
		public static macrosIconId = "macrosIcon";
		public static toggleIconId = "toggleIcon";

		//toggle button (buttonId)
		public static toggle = "toggle";

		//productivity tools (buttonId)
		public static agentGuidance = "agentGuidance";
		public static productivityMacros = "macros";

		//panel container id
        public static panelContainerId = "panel-container";

        //agent guidance control ids and keys
        public static agentGuidanceControlId = "MscrmControls.ProductivityToolAgentGuidance.AgentGuidance";
        public static agentGuidanceControlName = "childcontrol1";
        public static agentGuidanceControlKey = "agentguidancecontrol_child1";


	}

	export class ProductivityPaneConfigConstants {
		// Entity constants		
		public static entityName = "msdyn_productivitypaneconfiguration";

		// Attributes
		public static productivityPaneState = "msdyn_productivitypanestate";
		public static productivityPaneMode = "msdyn_productivitypanemode";
		public static applicationName = "msdyn_applicationname";
		public static msdyn_name = "msdyn_name";
    }

    /**
     * Structure for agent script entity
     */
    export class AgentScriptEntity {
        // Attributes
        public static msdyn_agentscriptId = "msdyn_agentscriptid";
        public static msdyn_description = "msdyn_description";
        public static msdyn_language = "msdyn_language";
        public static msdyn_name = "msdyn_name";

        // Entity constants
        public static entitySetName = "msdyn_agentscripts";
        public static entityName = "msdyn_agentscript";
    }

    export class SmartAssistBot {
        //Entity Contants
        public static entitySetName = "Users";
        public static entityName = "systemuser";
    }

	export class TelemetryComponents {
		public static MainComponent = "MainComponent";
        public static DataManager = "DataManager";
        public static CIFUtil = "CIFUtil";
        public static PanelState = "PanelState";

        public static onSessionSwitched = "onSessionSwitched";        
        public static SessionChangeManager = "SessionChangeManager";
        public static registerEventHandler = "registerEventHandler";
        public static onSessionCreated = "onSessionCreated";
        public static onSessionClosed = "onSessionClosed";
        public static getCurrentFocusedSessionId = "getCurrentFocusedSessionId"; checkAgentScript

        public static checkAgentScript = "checkAgentScript";
        public static checkSmartAssist = "checkSmartAssist";
	}

	export class DataManagerComponents {
        public static InitialDataFetch = "InititalDataFetch";
        public static AgentScriptFetch = "AgentScriptFetch";
        public static ProductivityPaneRecordFetch = "ProductivityPaneRecordFetch";
        public static SmartAssistBotRecordFetch = "SmartAssistBotRecordFetch";
	}

	export class QueryDataConstants {
		public static SelectOperator = "?$select=";
		public static FilterOperator = "$filter=";
	}

	export class FetchXmlConstants {
		public static FetchOperator = "?fetchXml=";
    }

    export class LocalStorageKeyConstants {
        public static sessionTemplateId = "_sessionTemplateId";
        public static isAgentScriptFound = "_isAgentScriptFound";
        public static isSmartAssistFound = "_isSmartAssistFound";
        public static liveWorkStreamId = "_liveWorkStreamId";
        public static productivityToolDataModel = "ProductivityToolDataModel";
        public static sessionData = "_sessionData";
        public static dbCall ="DB_call_";
    }

}
