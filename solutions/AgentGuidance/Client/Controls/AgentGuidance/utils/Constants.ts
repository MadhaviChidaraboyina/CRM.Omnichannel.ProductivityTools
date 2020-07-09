/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/

module MscrmControls.ProductivityToolAgentGuidance {
	'use strict';

	export class Constants {
        public static EmptyString = "";

        //agent script / call script control ids and keys
        public static callScriptControlId = "MscrmControls.CallscriptControl.CallscriptControl";
        public static callScriptControlName = "childcontrol1";
        public static callScriptControlKey = "CallScriptContainer";
        public static callScriptChildId = "callscriptchild1";

        //smart assist control ids and keys
        public static smartAssistControlId = "MscrmControls.ProductivityPanel.SmartassistControl";
        public static smartAssistControlName = "childcontrol2";
        public static smartAssistControlKey = "SmartassistControl_child2";
        public static smartScriptChildId = "Smartassistchild2";

        // agent guidance Label id
        public static AgentGuidanceLabel = "AgentGuidanceLabel";

        // agent guidance control id 
        public static agentGuidanceControlId = "MscrmControls.ProductivityToolAgentGuidance.AgentGuidance";

        //agent guidance control id
        public static agentGuidanceControlKey = "agentguidancecontrol_child1";

        public static customControlProperties = "_customControlProperties";

        public static agentGuidanceResourceKey = "Agent_Guidance";

        public static noConfigHeaderResourceKey = "No_items_configured";

        public static noConfigMessageResourceKey = "No_items_configured_message";

        public static toolSeparatorId = "toolSeparator";

        public static isSmartCardAvailable = "_IsSmartCardAvailable";

        public static agentGuidanceTools = "agent-guidance-tools";

        public static eventArgs = "_eventArgs";

        public static inputArguments = "_inputArguments"

        public static agentGuidance_no_item = "agentGuidance_no_item";

        public static agentGuidance_error_container = "agentGuidance_error_container";

        public static agentGuidance_not_configured = "agentGuidance_not_configured";

        public static agentGuidance_error_icon = "/webresources/msdyn_error_emptystate_icon.svg";

        public static agentGuidance_error_icon_id = "agentGuidance_error_icon_id";
    }

    /**
     * Structure for agent script entity
     */
    export class AgentScriptEntity {

        // Entity constants
        public static entitySetName = "msdyn_agentscripts";
        public static entityName = "msdyn_agentscript";
    }

    export class SmartAssistBot {
        //Entity Contants
        public static entitySetName = "Users";
        public static entityName = "systemuser";
    }

    export class DataManagerComponents {
        public static AgentScriptFetch = "AgentScriptFetch";
        public static SmartAssistBotRecordFetch = "SmartAssistBotRecordFetch";
    }

    export class FetchXmlConstants {
        public static FetchOperator = "?fetchXml=";
    }

    export class LocalStorageKeyConstants {
        public static sessionTemplateId = "_sessionTemplateId";
        public static isAgentScriptFound = "_isAgentScriptFound";
        public static isSmartAssistFound = "_isSmartAssistFound";
        public static liveWorkStreamId = "_liveWorkStreamId";
        public static agentGuidanceDataModel = "AgentGuidanceDataModel";
        public static sessionData = "_sessionData";
        public static dbCall = "DB_call_";
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
        public static getCurrentFocusedSessionId = "getCurrentFocusedSessionId"; 

        public static checkAgentScript = "checkAgentScript";
        public static checkSmartAssist = "checkSmartAssist";
    }
}
