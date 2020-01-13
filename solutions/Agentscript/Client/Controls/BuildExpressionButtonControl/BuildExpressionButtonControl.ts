/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/

/// <reference path="privatereferences.ts"/>

module MscrmControls.BuildExpressionButtonControl {
	'use strict';

	export class BuildExpressionButtonControl extends MscrmCommon.FieldControlBase<IInputBag, IOutputBag> {

		private _context: Mscrm.ControlData<IInputBag>;
		private buttonDomElement: any;
		private buttonDiv: JQuery;
		private buttonElement: Mscrm.Component;
		private id: string;

		constructor() {
			super();
		}

		protected initCore(context: Mscrm.ControlData<IInputBag>, state?: Mscrm.Dictionary): void {
			this._context = context;
			this.buttonDomElement = this.getButtonContainer();
			let div = document.createElement("div");
			this.buttonDiv = $(div);
			$(this.container).append(this.buttonDiv);
			context.utils.bindDOMElement(this.buttonDomElement, div);

			var enableBuildExpression = Xrm.Page.getAttribute("msdyn_enablebuildexpression");
			this.setButtonProperties(enableBuildExpression.getValue());
			enableBuildExpression.addOnChange(function () {
				this.setButtonProperties(enableBuildExpression.getValue());
			}.bind(this));
		}

		protected updateCore(context: Mscrm.ControlData<IInputBag>): void {
			this._context = context;
		}

		protected destroyCore(): void {

		}

		protected getOutputsCore(): IOutputBag {
			return {
				value: this.buttonDomElement.prop(MscrmCommon.AttributeConstants.Checked)
			}
		}

		private getButtonContainer(): Mscrm.Component {
			this.buttonElement = this.getButton();
			return this._context.factory.createElement(
				"CONTAINER",
				{
					id: "ButtonControlContainer",
					key: "ButtonControlContainer"
				},
				[this.buttonElement]);
		}

		private getButton(): Mscrm.Component {

			return this._context.factory.createElement(
				"BUTTON",
				{
					id: "ExpressionBuilder-Button",
					key: "ExpressionBuilder-Button",
					style: this.getButtonStyle(),
					title: "ExpressionBuilder",
					tabIndex: 0,
					onClick: this.openExpressionbuilder.bind(this)
				}, this._context.resources.getString("CC_Build_Expression"));
		}

		private getButtonStyle(): any {
			var buttonStyle = {};
			buttonStyle["fontSize"] = "14px";
			buttonStyle["color"] = "white";
			buttonStyle["height"] = "35px";
			buttonStyle["width"] = "156px";
			buttonStyle["alignItems"] = "center";
			buttonStyle["display"] = "flex";

			buttonStyle["background"] = "#2975B2";
			buttonStyle["justifyContent"] = "center";
			buttonStyle["border"] = this._context.accessibility.isHighContrastEnabled ? "1px solid rgb(204, 204, 204)" : "none";
			buttonStyle["borderRadius"] = "2px";
			buttonStyle["padding"] = "0px 16px";
			buttonStyle["verticalAlign"] = "middle";
			buttonStyle["boxShadow"] = "0px 2px 4px rgba(0, 0, 0, 0.14)";
			buttonStyle[":hover"] = {
				"boxShadow": "0px 1.2px 3.6px rgba(0, 0, 0, 0.12), 0px 6.4px 7.2px rgba(0, 0, 0, 0.1)"
			};
			buttonStyle[":focus"] = {
				"outline": "2px solid #0066FF !important",
				"border": "2px solid white !important"
			};
			buttonStyle["whiteSpace"] = "nowrap";
			buttonStyle["overflow"] = "hidden";
			buttonStyle["textOverflow"] = "ellipsis";
			buttonStyle[":disabled"] = {
				"background": "#EFEFEF",
				"color": "#666666"
			};
			return buttonStyle;
		}

		private openExpressionbuilder() {
			let vpHeight = (window.top as any).Xrm.Page.ui.getViewPortHeight();
			let vpWidth = (window.top as any).Xrm.Page.ui.getViewPortWidth();
			const dialogOptions: XrmClientApi.DialogOptions = {
				width: vpWidth, height: vpHeight, position: XrmClientApi.Constants.WindowPosition.inline
			};
			const dialogParams: XrmClientApi.DialogParameters = {};
			dialogParams["record_Id"] = Xrm.Page.data.entity.getId();
			this._context.navigation.openDialog("OpenExpressionBuilder", dialogOptions, dialogParams).then(
				function (response: any) {
					this._context.utils.requestRender();
					//context.accessibility.focusElementById(Constants.AddUserButtonKey);
				},
				function (error: any) {
					console.error(error);
					//context.accessibility.focusElementById(Constants.AddUserButtonKey);
				});
		}

		private setButtonProperties(enableBuildExpression: boolean) {
			if (enableBuildExpression) {
				$(this.buttonElement).prop("disabled", false);
			}
			else {
				$(this.buttonElement).prop("disabled", true);
			}
		}
	}
}