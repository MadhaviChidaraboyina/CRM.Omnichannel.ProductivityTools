/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/

module MscrmControls.ProductivityPanel {
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
		public static EmptyString = "";
		public static UninitializedString = "UNINITIALIZED";
		public static ControlStateKey = "CallscriptControlState";

		//keys for icon names
		//accordion icons
		public static expandedAccordionItemIcon = "expanded_accordion_arrow_icon.svg";
		public static collapsedAccordionItemIcon = "collapsed_accordion_arrow_icon.svg";
		//step executionstatus indicator icons
		public static executedStepIcon = "callscript_executed_step_icon.svg";
		public static notExecutedStepIcon = "callscript_unexecuted_step_icon.svg";
		public static failedStepIcon = "callscript_failed_step_icon.svg";
		public static inprogressStepIcon = "msdyn_progress_spinner.svg";
		//action type icons
		public static textActionIcon = "callscript_text_action_type_icon.svg";
		public static macroActionIcon = "callscript_macro_action_type_icon.svg";
		public static routeActionIcon = "callscript_route_action_type_icon.svg";
		//action button icons
		public static executeBtnIcon = "callscriptstep_executestep_button_icon.svg";
		public static retryBtnIcon = "callscriptstep_retrystep_button_icon.svg";
	}

	/**
	 * Ids for localized strings from resx file
	 */
	export class LocalizedStrings {
		public static CallscriptHeader = "ControlHeader";
		public static ScriptComboboxEmptyOptionLabel = "ScriptCombobox_EmptyOption";

		//Accessibility Labels
		public static Accessibility_ExecutedTextStepIndicator = "CompletedTextStep_AccessibilityLabel";
		public static Accessibility_ExecutedMacroStepIndicator = "CompletedMacroStep_AccessibilityLabel";
		public static Accessibility_ExecutedRouteStepIndicator = "CompletedScriptStep_AccessibilityLabel";
		public static Accessibility_UnexecutedTextStepIndicator = "StepListItem_UnexecutedTextStepAccessibilityLabel";
		public static Accessibility_UnexecutedMacroStepIndicator = "StepListItem_UnexecutedMacroStepAccessibilityLabel";
		public static Accessibility_UnexecutedRouteStepIndicator = "StepListItem_UnexecutedRouteStepAccessibilityLabel";

		public static TextActionLabel = "StepExeutionBtn_LabelForTextAction";
		public static RouteActionLabel = "StepExeutionBtn_LabelForRouteAction";
		public static NotExecutedStepButtonLabel = "StepExecutionBtn_LabelForNotExecutedStep";
		public static CompletedStepButtonLabel = "StepExecutionBtn_LabelForCompletedStep";
		public static FailedStepButtonLabel = "StepExecutionBtn_LabelForFailedStep";
		public static StartedStepButtonLabel = "StepExecutionBtn_LabelForStepInProgress";
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
		public static msdyn_agentscriptId = "msdyn_agentscriptid";
		public static msdyn_description = "msdyn_description";
		public static msdyn_language = "msdyn_language";
		public static msdyn_name = "msdyn_name";

		// Entity constants
		public static entitySetName = "msdyn_agentscripts";
		public static entityName = "msdyn_agentscript";
	}

	/**
	 * Structure for agent script entity
	 */
	export class AgentScriptStepEntity
	{
		// Attributes
		public static msdyn_agentscriptstepid = "msdyn_agentscriptstepid";
		public static msdyn_name = "msdyn_name";
		public static msdyn_agentscriptid = "msdyn_agentscriptid";
		public static msdyn_order = "msdyn_order";

		public static msdyn_actiontype = "msdyn_actiontype";
		public static msdyn_textinstruction = "msdyn_textinstruction";
		public static msdyn_description = "msdyn_description";

		public static msdyn_macroactionId = "_msdyn_macroactionid_value";
		public static msdyn_macroactionName = "_msdyn_macroactionid_value@OData.Community.Display.V1.FormattedValue";

		public static msdyn_routeactionId = "_msdyn_routeactionid_value";
		public static msdyn_routeactionName = "_msdyn_routeactionid_value@OData.Community.Display.V1.FormattedValue";

		// Entity constants
		public static entitySetName = "msdyn_agentscriptsteps";
		public static entityName = "msdyn_agentscriptstep";
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
}
