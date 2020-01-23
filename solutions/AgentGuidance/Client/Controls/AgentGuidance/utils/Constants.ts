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

        //agent guidance control id
        public static agentGuidanceControlKey = "agentguidancecontrol_child1";

        public static customControlProperties = "_customControlProperties";

        public static agentGuidanceResourceKey = "Agent_Guidance";

        public static toolSeparatorId = "toolSeparator";

        public static agentGuidanceDataModel = "AgentGuidanceDataModel";

        public static isSmartCardAvailable = "_IsSmartCardAvailable";
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
}
