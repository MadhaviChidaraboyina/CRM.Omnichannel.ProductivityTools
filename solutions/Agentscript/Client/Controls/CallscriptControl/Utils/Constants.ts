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

		//keys for icon names
		//step executionstatus indicator icons
		public static executedStepIcon = "callscript_executed_step_icon.svg";
		public static notExecutedStepIcon = "callscript_unexecuted_step_icon.svg";
		public static failedStepIcon = "callscript_failed_step_icon.svg";
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
		public static Accessibility_ExecutedTextStepIndicator = "StepListItem_ExecutedTextStepAccessibilityLabel";
		public static Accessibility_ExecutedMacroStepIndicator = "StepListItem_ExecutedMacroStepAccessibilityLabel";
		public static Accessibility_ExecutedRouteStepIndicator = "StepListItem_ExecutedRouteStepAccessibilityLabel";
		public static Accessibility_UnexecutedTextStepIndicator = "StepListItem_UnexecutedTextStepAccessibilityLabel";
		public static Accessibility_UnexecutedMacroStepIndicator = "StepListItem_UnexecutedMacroStepAccessibilityLabel";
		public static Accessibility_UnexecutedRouteStepIndicator = "StepListItem_UnexecutedRouteStepAccessibilityLabel";
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
	}
}