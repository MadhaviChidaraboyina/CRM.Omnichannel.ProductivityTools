/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/

/// <reference path="privatereferences.ts"/>

module MscrmControls.RunLinkControl {
	'use strict';

	export class RunLinkControlv2 implements Mscrm.Control<IInputBag, IOutputBag> {

		private _context: Mscrm.ControlData<IInputBag>;
		private color: string;
		private guid: string;
		/**
		 * Empty constructor.
		 */
		constructor() {
			
		}

		/**
		 * This function should be used for any initial setup necessary for your control.
		 * @params context The "Input Bag" containing the parameters and other control metadata.
		 * @params notifyOutputchanged The method for this control to notify the framework that it has new outputs
		 * @params state The user state for this control set from setState in the last session
		 * @params container The div element to draw this control in
		 */
		public init(context: Mscrm.ControlData<IInputBag>, notifyOutputChanged: () => void, state: Mscrm.Dictionary): void
		{
			this._context = context;
			this.color = "#2266E3";
			this.guid = this.generateGuid();
		}

		/** 
		 * This function will recieve an "Input Bag" containing the values currently assigned to the parameters in your manifest
		 * It will send down the latest values (static or dynamic) that are assigned as defined by the manifest & customization experience
		 * as well as resource, client, and theming info (see mscrm.d.ts)
		 * @params context The "Input Bag" as described above
		 */
		public updateView(context: Mscrm.ControlData<IInputBag>): Mscrm.Component
		{
			if (window.location.href.search("record_Id") == -1) {
				this.color = "A19F9D";
			}
			
			else {
				this.color = "#2266E3";
			}
			return this._context.factory.createElement(
				"CONTAINER",
				{
					key: "LinkContainer",
					id: "LinkContainer",
					style: {
						marginTop: "12px",
						marginLeft: "23px"
					}
				},
				[this.getRunHistoryLinkIconDiv(this._context), this.getRunHistoryLinkDiv(this._context)] 
				//this.getRunHistoryLink(this._context)
			);
		}

		private getRunHistoryLinkIconDiv(context: Mscrm.ControlData<IInputBag>): Mscrm.Component {
			return this._context.factory.createElement(
				"CONTAINER",
				{
					key: "IconContainer" + this.guid,
					id: "IconContainer" + this.guid,
					style: {
						width: "16px",
						height: "20px"
					}
				},
				this.getIcon(context)
			);
		}

		public getIcon(context: Mscrm.ControlData<IInputBag>) {

			return this._context.factory.createElement(
				"MICROSOFTICON",
				{
					key: "HistoryIcon" + this.guid,
					id: "HistoryIcon" + this.guid,
					style: {
						fontSize: "16px",
						lineHeight: "20px",
						color: this.color
					},
					type: 262,
				},
			);
		}

		private getRunHistoryLinkDiv(context) {
			return this._context.factory.createElement(
				"CONTAINER",
				{
					key: "LinkContainer" + this.guid,
					id: "LinkContainer" + this.guid,
					style: {
						marginLeft: "8px",
						width: "100px",
						height: "20px"
					},
					tabIndex: 0
				},
				this.getRunHistoryLink(context)
			);
		}

		private getRunHistoryLink(context) {
			if (window.location.href.search("record_Id") == -1) {
				return this._context.factory.createElement(
					"LABEL",
					{
						key: "Link" + this.guid,
						id: "Link" + this.guid,
						style: {
							fontFamily: "Segoe UI",
							fontWeight: "normal",
							fontSize: "14px",
							lineHeight: "20px",
							color: this.color
						},
					},
					this.getResourceString(this._context, Constants.linkLabel)
				);
			}
			return this._context.factory.createElement(
				"LABEL",
				{
					key: "Link" + this.guid,
					id: "Link" + this.guid,
					style: {
						fontFamily: "Segoe UI",
						fontWeight: "normal",
						fontSize: "14px",
						lineHeight: "20px",
						cursor: "pointer",
						color: this.color
					},
					role: "link",
					onClick: this.navigateToRunHistoryGrid.bind(this)
				},
				this.getResourceString(this._context, Constants.linkLabel)
			);
		}

		private navigateToRunHistoryGrid(): void {
			let recordIdPresent = window.location.href.search("record_Id")
			let self = this;
			if (recordIdPresent != -1) {
				let id = window.location.href.substring(recordIdPresent + 18, recordIdPresent + 54);

				(window as any).Xrm.WebApi.retrieveMultipleRecords("msdyn_macrosession", "?$filter=_msdyn_macroname_value eq '" + id + "'").then(
					function success(result) {
						if (result.entities == null || typeof result.entities == "undefined" || result.entities.length <= 0) {
							var alertStrings = { confirmButtonLabel: self.getResourceString(self._context, Constants.confirmButtonLabel), text: self.getResourceString(self._context, Constants.noHistoryText), title: self.getResourceString(self._context, Constants.noRunAlertTitile) };
							(window as any).Xrm.Navigation.openAlertDialog(alertStrings).then(
								function success(result) {
									console.log("Alert dialog closed");
								},
								function (error) {
									console.log(error.message);
								}
							);
							return;
						}
						else {
							var pageInput = {} as any;
							pageInput["pageType"] = Constants.pageControlType;
							pageInput["controlName"] = Constants.runLinkControlName;
							pageInput["data"] = { "recID": id };
							(window as any).Xrm.Navigation.navigateTo(pageInput);
							return;
						}
					},
					function (error) {
						console.log(error.message)
					}
				)
			}
		}

		private generateGuid(): string {
			return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
				const r = (Math.random() * 16) | 0,
					v = c == "x" ? r : (r & 0x3) | 0x8;
				return v.toString(16);
			});
		}

		private getResourceString(context: Mscrm.ControlData<IInputBag>, resourceString: string): string {
			return context ? context.resources.getString(resourceString) : resourceString;
		}

		/** 
		 * This function will return an "Output Bag" to the Crm Infrastructure
		 * The ouputs will contain a value for each property marked as "input-output"/"bound" in your manifest 
		 * i.e. if your manifest has a property "value" that is an "input-output", and you want to set that to the local variable "myvalue" you should return:
		 * {
		 *		value: myvalue
		 * };
		 * @returns The "Output Bag" containing values to pass to the infrastructure
		 */
		public getOutputs(): IOutputBag {
			// custom code goes here - remove the line below and return the correct output
			return null;
		}

		/**
		 * This function will be called when the control is destroyed
		 * It should be used for cleanup and releasing any memory the control is using
		 */
		public destroy(): void	{

		}
	}
}