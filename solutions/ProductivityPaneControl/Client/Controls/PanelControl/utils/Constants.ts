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
	}

	export class TelemetryComponents {
		public static MainComponent = "MainComponent";
	}
}
