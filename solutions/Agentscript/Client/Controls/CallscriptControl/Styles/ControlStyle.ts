/**
 * @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/

module MscrmControls.CallscriptControl {

	export class ControlStyle {

		public static getMainComponentStyle() {
			return {
				"height": "100%",
				"width": "100%",
				"text-align": "center",
				"vertical-align": "middle",
				"flex-direction": "column",
				overflow: "auto",
				minHeight: "346px",
				paddingTop: "16px"
			};
		}

		public static getProgressWheelStyle() {
			return {
				width: "40px",
				height: "40px",
				margin: "auto",
				position: "inherit !important"
			}
		}

		public static getHeaderContainerStyle() {
			return {
				"align-items": "left",
				marginLeft: "14px",
				marginRight: "14px",
				marginBottom: "12px",
				minWidth: "234px"
			}
		}

		public static getControlHeaderStyle(context: Mscrm.ControlData<IInputBag>) {
			return {
				fontFamily: context.theming.fontfamilies.regular,
				fontSize: "16px",
				fontWeight: 600,
				color: "#323130"
			}
		}

		public static getDropDownArrowComponentStyle() {
			return {
				position: "absolute",
				fontSize: "12px",
				right: 0,
				"text-align": "center",
				height: "8px",
				width: "8px",
				"pointer-events": "none",
				"align-items": "center",
				margin: "12px"
			};
		}

		public static getDropDownArrowIconStyle() {
			return {
				height: "12px",
				width: "12px",
				color: "#000000"
			};
		}

		public static getDropDownComponentStyle() {
			return {
				position: "relative",
				"float": "left",
				width: "calc(100% - 28px)",
				height: "32px",
				marginBottom: "8px",
				marginLeft: "14px",
				marginRight: "14px",
				minWidth: "234px"
			};
		}

		public static getSelectStyle(context: Mscrm.ControlData<IInputBag>): Mscrm.Dictionary {
			const selectStyle: Mscrm.Dictionary =
			{
				"border-color": context.theming.colors.base.white,
				"-webkit-appearance": "none",
				'::-ms-expand': { display: "none" },
				position: "relative",
				fontFamily: context.theming.fontfamilies.regular,
				appearance: "none",
				paddingLeft: "8px",
				paddingRight: "36px",
				paddingTop: "4px",
				paddingBottom: "4px",
				height: "32px",
				width: "100%",
				border: "1px solid #8A8886"
			};

			const optionStyle: Mscrm.Dictionary =
			{
				paddingTop: "16px",
				paddingBottom: "16px",
				paddingLeft: "16px",
				height: "100%",
				width: "100%",
				fontFamily: context.theming.fontfamilies.regular
			};

			return <Mscrm.Dictionary>{
				selectStyle,
				optionStyle
			};
		}

		public static getScriptDescriptionStyle(context: Mscrm.ControlData<IInputBag>) {
			return {
				fontFamily: context.theming.fontfamilies.regular,
				fontSize: "14px",
				color: "#666666",
				textAlign: context.client.isRTL ? "right" : "left"
			}
		}

		public static getScriptDescriptionContainerStyle() {
			return {
				marginLeft: "14px",
				marginRight: "14px",
				marginBottom: "12px",
				height: "auto",
				minWidth: "234px"
			}
		}

		public static getListComponentStyle() {
			return {
				position: "relative",
				"float": "left",
				width: "100%",
				height: "auto",
				minWidth: "266px"
			};
		}

		public static getListStyle() {
			return {
				position: "relative",
				width: "100%",
				flexDirection: "column"
			}
		}

		public static getListItemContainerStyle() {
			return {
				flexDirection: "row",
				width: "100%"
			}
		}

		public static getCollapsedListItemOnHoverStyle() {
			return {
				background: "#EDEBE9",
				cursor: "pointer"
			}
		}

		public static getExpandedListItemOnHoverStyle() {
			return {
				cursor: "pointer"
			}
		}

		public static getListItemStyle(isRTL: boolean, isStepExpanded: boolean, stepExecutionStatus: ExecutionStatus) {
			let backgroundStyle = "inherit";
			if (isStepExpanded) {
				if (stepExecutionStatus === ExecutionStatus.Failed) {
					backgroundStyle = "#F9F0EF";
				}
				else {
					backgroundStyle = "#F3F2F1";
				}
			}
			let onHoverStyle = (isStepExpanded) ? ControlStyle.getExpandedListItemOnHoverStyle() : ControlStyle.getCollapsedListItemOnHoverStyle();
			return {
				width: "calc(100% - 28px)",
				height: "auto",
				flexDirection: "column",
				cursor: "pointer",
				background: backgroundStyle,
				":hover": onHoverStyle,
				paddingLeft: "14px",
				paddingRight: "14px",
				textAlign: isRTL ? "right" : "left",
			}
		}

		public static getArrowIconStyle(context: Mscrm.ControlData<IInputBag>, isExpandedStep: boolean) {
			let arrowIconUrl: string;
			if (isExpandedStep) arrowIconUrl = Utility.getIconUrl(context, Constants.expandedAccordionItemIcon);
			else arrowIconUrl = Utility.getIconUrl(context, Constants.collapsedAccordionItemIcon);
			return {
				width: "14px",
				height: "16px",
				marginTop: "14px",
				marginBottom: "14px",
				"font-family": 'Dyn CRM Symbol',
				"font-size": "10px",
				color: "black",
				fontWeight: 600,
				display: "table"
			};
		}

		public static getActionTypeIconStyle(actionType: CallscriptActionType, context: Mscrm.ControlData<IInputBag>) {
			let actionTypeIconUrl = Utility.getActionIconUrl(context, actionType);
			return {
				width: "16px",
				height: "16px",
				marginLeft: "14px",
				marginRight: "14px",
				marginTop: "14px",
				marginBottom: "14px",
				"font-family": 'Dyn CRM Symbol',
				"font-size": "16px",
				display: "table"
			};
		}

		public static getStepLabelStyle(step: CallScriptStep, context: Mscrm.ControlData<IInputBag>) {
			var labelFontColorStyle = "#333333"; //default
			if (step.isExecuted) labelFontColorStyle = "#107C10";
			else if (step.executionStatus === ExecutionStatus.Failed) labelFontColorStyle = "#A80000";
			return {
				fontFamily: context.theming.fontfamilies.regular,
				fontSize: "14px",
				color: labelFontColorStyle,
				fontWeight: (step.isExecuted) ? 500 : 600,
				"vertical-align": "middle",
				paddingTop: "12px",
				paddingBottom: "12px",
				cursor: "pointer",
				width: "calc(100% - 82px)",
				wordWrap: "break-word"
			};
		}

		public static getProgressIconStyle(context: Mscrm.ControlData<IInputBag>) {
			let backgroundIconUrl = Utility.getIconUrl(context, Constants.inprogressStepIcon);
			let isRTL = context.client.isRTL;
			return {
				width: "16px",
				height: "16px",
				"background-image": "url(" + backgroundIconUrl + ")",
				"background-repeat": "no-repeat",
				"background-position": "center",
				marginLeft: isRTL ? "0px" : "8px",
				marginRight: isRTL ? "8px" : "0px",
				marginTop: "14px",
				marginBottom: "14px"
			};
		}

		public static getRunActionIconStyle(actionType: CallscriptActionType, context: Mscrm.ControlData<IInputBag>) {
			let backgroundIconUrl = "";
			if (actionType === CallscriptActionType.TextAction) {
				backgroundIconUrl = Utility.getIconUrl(context, Constants.markdoneTextIcon);
			}
			else if (actionType === CallscriptActionType.MacroAction) {
				backgroundIconUrl = Utility.getIconUrl(context, Constants.runMacroIcon);
			}
			else {
				backgroundIconUrl = Utility.getIconUrl(context, Constants.viewScriptIcon);
			}
			let isRTL = context.client.isRTL;
			return {
				width: "16px",
				height: "16px",
				"background-image": "url(" + backgroundIconUrl + ")",
				"background-repeat": "no-repeat",
				"background-position": "center",
				padding: "0px",
				marginLeft: isRTL ? "0px" : "8px",
				marginRight: isRTL ? "8px" : "0px",
				marginTop: "14px",
				marginBottom: "14px",
				border: "none",
				backgroundColor: "inherit",
				cursor: "pointer"
			};
		}

		public static getStepActionContainerStyle(isVisible: boolean, stepExecutionStatus: ExecutionStatus) {
			let backgroundColor = (stepExecutionStatus === ExecutionStatus.Failed) ? "#F9F0EF" : "#F3F2F1";
			let displayProperty = isVisible ? "flex" : "none";
			return {
				display: displayProperty,
				"flex-direction": "column",
				"vertical-align": "middle",
				background: backgroundColor,
				marginTop: "-12px",
				paddingBottom: "14px"
			}
		}

		public static getActionTextStyle(stepExecutionStatus: ExecutionStatus, context: Mscrm.ControlData<IInputBag>) {
			let isRTL = context.client.isRTL;
			return {
				fontFamily: context.theming.fontfamilies.regular,
				fontSize: "14px",
				color: (stepExecutionStatus === ExecutionStatus.Completed) ? "#666666" : "#333333",
				"vertical-align": "middle",
				paddingTop: "4px",
				width: "calc(100% - 86px)",
				marginLeft: isRTL ? "0px" : "58px",
				marginRight: isRTL ? "58px" : "0px",
				wordWrap: "break-word",
				"whiteSpace": "pre-wrap"
			}
		}

		public static getActionErrorTextStyle(context: Mscrm.ControlData<IInputBag>) {
			let isRTL = context.client.isRTL;
			return {
				fontFamily: context.theming.fontfamilies.regular,
				fontSize: "12px",
				color: "#A80000",
				paddingTop: "8px",
				width: "calc(100% - 86px)",
				marginLeft: isRTL ? "0px" : "58px",
				marginRight: isRTL ? "58px" : "0px",
				wordWrap: "break-word"
			}
		}

		public static getExecuteActionButtonStyle(step: CallScriptStep, context: Mscrm.ControlData<IInputBag>) {
			let isRTL = context.client.isRTL;
			let buttonWidth: string;
			if (step.action.actionType === CallscriptActionType.TextAction) {
				buttonWidth = "112px";
			}
			else if (step.action.actionType === CallscriptActionType.ReRouteAction) {
				buttonWidth = "62px";
			}
			else {
				if (step.executionStatus === ExecutionStatus.Failed) buttonWidth = "80px";
				else if (step.executionStatus === ExecutionStatus.Completed) buttonWidth = "100px";
				else buttonWidth = "62px";
			}
			return {
				fontFamily: context.theming.fontfamilies.regular,
				fontSize: "14px",
				color: "#FFFFFF",
				background: "#2266E3",
				border: "none",
				borderRadius: "2px",
				minWidth: buttonWidth,
				maxWidth: "calc(100% - 58px)",
				width: "fit-content",
				height: "28px",
				marginTop: "12px",
				display: "inline-block",
				cursor: "pointer",
				marginLeft: isRTL ? "0px" : "58px",
				marginRight: isRTL ? "58px" : "0px",
				":hover": { background: "#FFFFFF", color: "#2266E3"},
				":disabled": { background: "#EDEBE9", color: "#A19F9D", width: "80px" },
				whiteSpace: "nowrap",
				overflow: "hidden",
				textOverflow: "ellipsis"
			}
		}

	}
}