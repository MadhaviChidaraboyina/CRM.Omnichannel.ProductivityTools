/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/

module MscrmControls.Callscript {
	'use strict';

	export enum CallscriptActionType {
		TextAction,
		MacroAction,
		ReRouteAction
	}

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

    export class Constants {
        public static ControlId = "MscrmControls.Callscript.CallscriptControl";
		public static EmptyString = "";
		public static UninitializedString = "UNINITIALIZED";
        public static ControlStateKey = "CallscriptControlState";
        public static OdataError = "ODATA_ERROR";

		public static CallScriptPaneId = "msdyn_csw_productivitypane_cs_tab";
		public static HomeSessionId = "session-id-0";

		//class names for styling
		public static AccordionRightArrowClassName = "accordionRightArrow";
		public static AccordionDownArrowClassName = "accordionDownArrow";
		public static FailedStepIconClassName = "failedStepIcon";
		public static CompletedStepIconClassName = "completedStepIcon";
		public static TextActionIconClassName = "textActionIcon";
		public static MacroActionIconClassName = "macroActionIcon";
		public static RouteActionIconClassName = "routeActionIcon";

		//keys for icon names
		//accordion icons
        public static expandedAccordionItemIcon = "msdyn_expanded_accordion_arrow_component_icon.svg";
        public static collapsedAccordionItemIcon = "msdyn_collapsed_accordion_arrow_component_icon.svg";
		//step executionstatus indicator icons
        public static executedStepIcon = "msdyn_callscriptcomponent_executed_step_icon.svg";
        public static notExecutedStepIcon = "msdyn_callscriptcomponent_unexecuted_step_icon.svg";
        public static failedStepIcon = "msdyn_callscriptcomponent_failed_step_icon.svg";
        public static inprogressStepIcon = "msdyn_progress_component_spinner.svg";
		//action type icons
        public static textActionIcon = "msdyn_callscriptcomponent_text_action_type_icon.svg";
        public static macroActionIcon = "msdyn_callscriptcomponent_macro_action_type_icon.svg";
        public static routeActionIcon = "msdyn_callscriptcomponent_route_action_type_icon.svg";
		//action button icons
        public static executeBtnIcon = "msdyn_callscriptstepcomponent_executestep_button_icon.svg";
        public static retryBtnIcon = "msdyn_callscriptstepcomponent_retrystep_button_icon.svg";
        public static viewScriptIcon = "msdyn_view_script_component_icon.svg";
        public static markdoneTextIcon = "msdyn_markasdone_component_text_icon.svg";
        public static runMacroIcon = "msdyn_run_macro_component_icon.svg";
		public static slugFailedIcon = "msdyn_slug_fail_icon.svg";
        //agent script header info icon
        public static infoButtonIcon = "msdyn_agent_script_component_header_info_icon.svg";

		// Accessibility ids
		public static stepIdPrefix = "CallscriptStepsListItem-";
		public static stepActionIdPrefix = "CallScriptRunActionIcon-";
		public static idSuffix = "-Id";
	}

	/**
	 * Ids for localized strings from resx file
	 */
	export class LocalizedStrings {
        public static CallscriptHeader = "ControlHeader";
        public static ControlHeaderInfo = "ControlHeaderInfo";     

		public static ScriptComboboxEmptyOptionLabel = "ScriptCombobox_EmptyOption";

		//Accessibility Labels
		public static Accessibility_NotStartedStepLabels: string[] =
			["StepListItem_UnexecutedTextStepAccessibilityLabel", "StepListItem_UnexecutedMacroStepAccessibilityLabel", "StepListItem_UnexecutedRouteStepAccessibilityLabel"];
		public static Accessibility_CompletedStepLabels: string[] =
			["CompletedTextStep_AccessibilityLabel", "CompletedMacroStep_AccessibilityLabel", "CompletedScriptStep_AccessibilityLabel"];
		public static Accessibility_FailedStepLabels: string[] =
			["FailedTextStep_AccessibilityLabel", "FailedMacroStep_AccessibilityLabel", "FailedScriptStep_AccessibilityLabel"];
		public static Accessibility_StartedStepLabel = "StepExecutionBtn_LabelForStepInProgress";

		public static TextActionLabel = "StepExeutionBtn_LabelForTextAction";
		public static RouteActionLabel = "StepExeutionBtn_LabelForRouteAction";
		public static NotExecutedStepButtonLabel = "StepExecutionBtn_LabelForNotExecutedStep";
		public static CompletedStepButtonLabel = "StepExecutionBtn_LabelForCompletedStep";
		public static FailedStepButtonLabel = "StepExecutionBtn_LabelForFailedStep";

		//Error Strings
		public static InitialScriptDataLoadFailure = "InitialScriptDataLoadFailure";
		public static NoCallScriptFoundErrorMessage = "NoCallScriptFoundErrorMessage";
		public static MacroStepFailureMessage = "MacroStepFailure_ErrorMessageWithoutError";
        public static ScriptStepFailureMessage = "ScriptStepsDataLoadFailure";
        public static NoDataCallScriptMessage = "NoDataCallScriptMessage";
        public static SlugResolutionErrorMessage = "SlugResolutionErrorMessage"

	}

	/**
	 * Telemetry main component names
	 */
	export class TelemetryComponents {
		public static MainComponent = "MainComponent";
		public static StateManager = "StateManager";
		public static DataManager = "DataManager";
		public static ListGenerator = "ListGenerator";
		public static Utils = "Utils";
		public static CIFUtil = "CIFUtil";
		public static MacroUtil = "MacroUtil";
		public static CallscriptStepListitemManager = "CallscriptStepListitemManager";
		public static CallscriptStepDetailsManager = "CallscriptStepDetailsManager";
	}

	/**
	 * Sub-components for DataManager telemetry component
	 */
	export class DataManagerComponents
	{
		public static InitialDataFetch = "InititalDataFetch";
		public static StepsDataFetch = "StepsDataFetch";
		public static CallscriptRecordFetch = "CallscriptRecordFetch";
		public static RetrieveDefaultCallScript = "RetrieveDefaultCallScript";
	}

	/**
	 * Sub-components for accessibility telemetry messages
	 */
	export class AccessibilityComponents
	{
		public static KeyHandler = "KeyHandler";
	}

	/**
	 * Fetchxml related constants
	 */
	export class FetchXmlConstants
	{
		public static FetchOperator = "?fetchXml=";
	}

	/**
	 * Structure for agent script entity
	 */
	export class AgentScriptEntity
	{
		// Attributes
        public static msdyn_agentscriptId = "msdyn_productivityagentscriptid";
		public static msdyn_description = "msdyn_description";
		public static msdyn_language = "msdyn_language";
		public static msdyn_name = "msdyn_name";

		// Entity constants
        public static entitySetName = "msdyn_productivityagentscripts";
        public static entityName = "msdyn_productivityagentscript";
	}

	/**
	 * Structure for agent script entity
	 */
	export class AgentScriptStepEntity
	{
		// Attributes
        public static msdyn_agentscriptstepid = "msdyn_productivityagentscriptstepid";
		public static msdyn_name = "msdyn_name";
        public static msdyn_agentscriptid = "msdyn_productivityagentscriptid";
		public static msdyn_order = "msdyn_order";

		public static msdyn_actiontype = "msdyn_actiontype";
		public static msdyn_textinstruction = "msdyn_textinstruction";
		public static msdyn_description = "msdyn_description";

		public static msdyn_macroactionId = "_msdyn_macroactionid_value";
		public static msdyn_macroactionName = "_msdyn_macroactionid_value@OData.Community.Display.V1.FormattedValue";

		public static msdyn_routeactionId = "_msdyn_routeactionid_value";
		public static msdyn_routeactionName = "_msdyn_routeactionid_value@OData.Community.Display.V1.FormattedValue";

		// Entity constants
        public static entitySetName = "msdyn_productivityagentscriptsteps";
        public static entityName = "msdyn_productivityagentscriptstep";
	}

	/**
	 * Option set values for action type fields
	 */
	export class AgentScriptStepActionType
	{
		public static TextAction = 192350000;
		public static MacroAction = 192350001;
		public static RouteAction = 192350002;
	}

	/**
	 * Css class names
	 */
	export class AgentscriptCssClassNames
	{
		public static SelectorElementParentDiv = "mscrm-agentscript-selectContainer";
	}
}
