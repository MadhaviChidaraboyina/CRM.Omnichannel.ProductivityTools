/**
 * @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/

module MscrmControls.Callscript {

	export class ControlStyle {

		public static getMainComponentStyle() {
			return {
				"height": "auto",
				"width": "100%",
				"text-align": "center",
				"vertical-align": "middle",
                "flex-direction": "column",
                "overflow-x": "hidden",
                "overflow-y": "auto",
				minHeight: "auto",
				marginTop: "16px",
				marginBottom: "10px",
				paddingLeft: "14px",
				paddingRight: "14px",
				"::-webkit-scrollbar": {
					width: "7px",
					visibility: "hidden"
			   },
				"::-webkit-scrollbar-thumb": {
					background: "#FFFFFF",
					borderRadius: "4px"
				},
				"::-webkit-scrollbar-track": {
					background: "#FFFFFF"
				},
				":hover::-webkit-scrollbar-thumb": {
					background: "#b5b5b5"
				}
			};
		}

		public static getProgressWheelStyle() {
			return {
				width: "40px",
				height: "40px",
				margin: "auto",
				position: "absolute"
			}
		}

		public static getHeaderContainerStyle() {
            return {
                height: "68px",
				"align-items": "left",
				minWidth: "234px"
			}
		}

		public static getControlHeaderStyle(context: Mscrm.ControlData<IInputBag>) {
			return {
				fontFamily: context.theming.fontfamilies.regular,
                fontSize: "20px",
                fontWeight: 600,
                lineHeight: "28px",
                marginTop: "4px",
				color: "#323130"
			}
        }

        public static getControlHeaderInfoIconStyle(context: Mscrm.ControlData<IInputBag>) {
            let backgroundIconUrl = Utility.getIconUrl(context, Constants.infoButtonIcon);
			return {
				width: "16px",
				height: "16px",
				"background-image": "url(" + backgroundIconUrl + ")",
				"background-repeat": "no-repeat",
				"background-position": "center",
				marginTop: "11px",
                paddingLeft: "15px",

                fontFamily: "Full MDL2 Assets",
                fontSize: "16px",
                lineHeight: "19px",
                textAlign: "center",

                /* Dynamics / DYN Primary #2266E3 */

                color: "#2266E3",
			};
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
				width: "100%",
				height: "32px",
				marginBottom: "12px",
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
			return {
				width: "100%",
				height: "auto",
				flexDirection: "column",
				cursor: "pointer",
				background: backgroundStyle,
				":hover": { background: (isStepExpanded && stepExecutionStatus === ExecutionStatus.Failed) ? "#F9F0EF" : "#F3F2F1" },
				":hover .textActionIcon, .routeActionIcon, .macroActionIcon": { background: "#FFFFFF" },
				textAlign: isRTL ? "right" : "left",
				display: "inline-block" 
			}
		}

		public static getArrowIconStyle(context: Mscrm.ControlData<IInputBag>, isExpandedStep: boolean) {
			let isRTL = context.client.isRTL;
			return {
				width: "14px",
				height: "14px",
				paddingTop: "11px",
				paddingBottom: "11px",
				marginLeft: isRTL ? "6px" : "4px",
				marginRight: isRTL ? "4px" : "6px",
				"font-family": 'Dyn CRM Symbol',
				"font-size": "10px",
				color: "black",
				fontWeight: 600,
				display: "table"
			};
		}

		public static getStepExecutionStatusIconStyle(context: Mscrm.ControlData<IInputBag>, stepExecutionStatus: ExecutionStatus) {
			let isRTL = context.client.isRTL;
			return {
				width: "14px",
				height: "21px",
				paddingTop: "1px",
				"font-family": 'Dyn CRM Symbol',
				"font-size": "14px",
				color: (stepExecutionStatus === ExecutionStatus.Failed) ? "#A80000" : "#107C10",
				marginRight: isRTL ? "0px" : "6px",
				marginLeft: isRTL ? "6px" : "0px",
				float: isRTL ? "right" : "left"
			};
		}

		public static getRunActionIconStyle() {
			return {
				width: "16px",
				height: "16px",
				margin: "4px",
				padding: "6px 6px",
				"font-family": 'Dyn CRM Symbol',
				"font-size": "16px",
				borderRadius: "50%",
				display: "table",
				color: "#333333"
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
				fontWeight: 600,
				"vertical-align": "middle",
				cursor: "pointer",
				width: "calc(100% - 36px)",
				paddingTop: "7px",
				paddingBottom: "7px",
				lineHeight: "1.6",
				wordWrap: "break-word",
				display: "block"
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
				margin: "4px",
				padding: "6px 6px",
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
				marginTop: "-5px",
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
				width: "calc(100% - 28px)",
				marginLeft: isRTL ? "4px" : "24px",
				marginRight: isRTL ? "24px" : "4px",
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
				width: "calc(100% - 28px)",
				marginLeft: isRTL ? "4px" : "24px",
				marginRight: isRTL ? "24px" : "4px",
				wordWrap: "break-word"
			}
		}
	}
}