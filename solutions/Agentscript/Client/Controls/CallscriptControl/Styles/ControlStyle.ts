/**
 * @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/

module MscrmControls.ProductivityPanel {

	export class ControlStyle {

		private _context: Mscrm.ControlData<IInputBag>;

		public constructor(context: Mscrm.ControlData<IInputBag>) {
			this._context = context;
		}

		public get mainComponentStyle() {
			return {
				"height": "100%",
				"width": "calc(100% - 16px)",
				"text-align": "center",
				"vertical-align": "middle",
				"flex-direction": "column",
				paddingLeft: "8px",
				paddingRight: "8px",
				overflow: "auto"
			};
		}

		public get progressWheelStyle() {
			return {
				width: "40px",
				height: "40px",
				margin: "auto"
			}
		}

		public get headerContainerStyle() {
			return {
				"align-items": "left",
				marginLeft: "8px",
				marginRight: "8px",
				marginBottom: "20px",
				marginTop: "16px",
				minWidth: "234px"
			}
		}

		public get controlHeaderStyle() {
			return {
				fontFamily: this._context.theming.fontfamilies.regular,
				fontSize: "16px",
				fontWeight: 600,
				color: "#323130"
			}
		}

		public get dropDownArrowComponentStyle() {
			return {
				position: "absolute",
				fontSize: "8px",
				right: 0,
				"text-align": "center",
				height: "8px",
				width: "8px",
				"pointer-events": "none",
				"align-items": "center",
				margin: "12px"
			};
		}

		public get dropDownArrowIconStyle() {
			return {
				height: "8px",
				width: "8px",
				color: "#323130"
			};
		}

		public get dropDownComponentStyle() {
			return {
				position: "relative",
				"float": "left",
				width: "calc(100% - 16px)",
				height: "32px",
				marginBottom: "12px",
				marginLeft: "8px",
				marginRight: "8px",
				minWidth: "234px"
			};
		}

		public selectStyle(): Mscrm.Dictionary {
			const selectStyle: Mscrm.Dictionary =
			{
				"border-color": this._context.theming.colors.base.white,
				"-webkit-appearance": "none",
				'::-ms-expand': { display: "none" },
				position: "relative",
				fontFamily: this._context.theming.fontfamilies.regular,
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
				fontFamily: this._context.theming.fontfamilies.regular
			};

			return <Mscrm.Dictionary>{
				selectStyle,
				optionStyle
			};
		}

		public get listComponentStyle() {
			return {
				position: "relative",
				"float": "left",
				width: "100%",
				height: "calc(100% - 73px)",
				minWidth: "250px"
			};
		}

		public get listStyle() {
			return {
				position: "relative",
				width: "100%",
				flexDirection: "column"
			}
		}

		public get listItemContainerStyle() {
			return {
				flexDirection: "row",
				width: "100%"
			}
		}

		public get collapsedListItemOnHoverStyle() {
			return {
				background: "#F3F2F1",
				cursor: "pointer"
			}
		}

		public get expandedListItemOnHoverStyle() {
			return {
				cursor: "pointer"
			}
		}

		public getListItemStyle(isStepExpanded: boolean, stepExecutionStatus: ExecutionStatus) {
			let backgroundStyle = "inherit";
			if (isStepExpanded) {
				if (stepExecutionStatus === ExecutionStatus.Failed) {
					backgroundStyle = "#F9F0EF";
				}
				else {
					backgroundStyle = "#EDEBE9";
				}
			}
			let onHoverStyle = (isStepExpanded) ? this.expandedListItemOnHoverStyle : this.collapsedListItemOnHoverStyle;
			return {
				width: "100%",
				height: "auto",
				flexDirection: "column",
				cursor: "pointer",
				background: backgroundStyle,
				":hover": onHoverStyle,
				":hover .actionTypeIconClass": { "display": "flex" }
			}
		}

		public getCheckboxIconStyle(stepExecutionStatus: ExecutionStatus) {
			let statusIconUrl;
			if (stepExecutionStatus === ExecutionStatus.Completed) {
				statusIconUrl = Utility.getIconUrl(this._context, Constants.executedStepIcon);
			}
			else if (stepExecutionStatus === ExecutionStatus.NotStarted) {
				statusIconUrl = Utility.getIconUrl(this._context, Constants.notExecutedStepIcon);
			}
			else if (stepExecutionStatus === ExecutionStatus.Failed) {
				statusIconUrl = Utility.getIconUrl(this._context, Constants.failedStepIcon);
			}
			return {
				width: "18px",
				height: "18px",
				"background-image": "url(" + statusIconUrl + ")",
				"background-repeat": "no-repeat",
				marginLeft: "8px",
				marginRight: "8px",
				marginTop: "12px",
				marginBottom: "12px"
			};
		}

		public getStepLabelStyle() {
			return {
				fontFamily: this._context.theming.fontfamilies.regular,
				fontSize: "14px",
				color: "#1F2126",
				fontWeight: 600,
				"vertical-align": "middle",
				"text-align": "justify",
				paddingTop: "11px",
				paddingBottom: "11px",
				cursor: "pointer",
				width: "calc(100% - 62px)",
				wordWrap: "break-word"
			};
		}

		public getActionTypeIconStyle(actionType: CallscriptActionType) {
			let actionTypeIconUrl = Utility.getActionIconUrl(this._context, actionType);
			return {
				width: "16px",
				height: "16px",
				"background-image": "url(" + actionTypeIconUrl + ")",
				"background-repeat": "no-repeat",
				"background-position": "center",
				marginLeft: "4px",
				marginRight: "8px",
				marginTop: "12px",
				marginBottom: "12px"
			};
		}

		public getActionTypeIconContainerStyle(isVisible: boolean) {
			let displayProperty = isVisible ? "flex" : "none";
			return {
				display: displayProperty,
				"text-align": "center",
				"vertical-align": "middle"
			};
		}

		public get actionTextStyle() {
			return {
				fontFamily: this._context.theming.fontfamilies.regular,
				fontSize: "14px",
				color: "#333333",
				"vertical-align": "middle",
				"text-align": "justify",
				paddingTop: "4px",
				paddingBottom: "8px",
				width: "calc(100% - 34px)",
				marginLeft: "26px",
				wordWrap: "break-word"
			}
		}

		public get actionErrorTextStyle() {
			return {
				fontFamily: this._context.theming.fontfamilies.regular,
				fontSize: "12px",
				color: "#A80000",
				"text-align": "justify",
				paddingTop: "2px",
				paddingBottom: "8px",
				width: "calc(100% - 34px)",
				marginLeft: "26px",
				wordWrap: "break-word"
			}
		}

		public getStepActionContainerStyle(isVisible: boolean, stepExecutionStatus: ExecutionStatus) {
			let backgroundColor = (stepExecutionStatus === ExecutionStatus.Failed) ? "#F9F0EF" : "#EDEBE9";
			let displayProperty = isVisible ? "flex" : "none";
			return {
				display: displayProperty,
				"flex-direction": "column",
				"text-align": "justify",
				"vertical-align": "middle",
				background: backgroundColor,
				paddingLeft: "8px",
				paddingRight: "8px",
				marginTop: "-7px"
			}
		}

		public get executeActionButtonStyle() {
			return {
				"flex-direction": "row",
				width: "75px", //check
				height: "28px",
				background: "inherit",
				border: "none",
				marginBottom: "10px",
				padding: "0px 4px",
				cursor: "pointer",
				marginLeft: "18px", //check
				":hover": { background: "#FFFFFF"}
			}
		}

		public getExecuteActionBtnIconStyle(actionTypeIconUrl: string) {
			return {
				width: "14px",
				height: "14px",
				"background-image": "url(" + actionTypeIconUrl + ")",
				"background-repeat": "no-repeat",
				"background-position": "center",
				margin: "7px 4px"
			};
		}

		public get executeActionBtnLabelStyle() {
			return {
				color: "#1F2126",
				fontSize: "14px",
				fontFamily: this._context.theming.fontfamilies.regular,
				height: "20px",
				marginTop: "3px",
				marginBottom: "5px",
				marginLeft: "4px",
				marginRight: "4px"
			}
		}

	}
}