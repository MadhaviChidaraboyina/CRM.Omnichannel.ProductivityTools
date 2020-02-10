/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/

/// <reference path="privatereferences.ts"/>

module MscrmControls.GridControl {
	'use strict';

	export class MacroSessionAssociatedGridControl implements Mscrm.Control<IInputBag, IOutputBag> {

		private _context: Mscrm.ControlData<IInputBag>;

		private static readonly DEFAULT_SHOW_COUNT: number = 25;
		private static readonly MAX_RECORD_COUNT: number = 5000;
		private XMLConstants: XMLConstants;
		private showCount: number;
		private recordCount: number = -1;
		private layoutXML: string;
		private entityLogicalName: string;
		private entityDisplayName: string;
		private fetchXML: string;
		private guid: string;
		private notifyOutputChanged: () => void;
		private selectedRecords: Mscrm.EntityReference[] = [];
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
		public init(context: Mscrm.ControlData<IInputBag>, notifyOutputChanged: () => void, state: Mscrm.Dictionary): void {
			this._context = context;
			this.notifyOutputChanged = notifyOutputChanged;
			this.showCount = MacroSessionAssociatedGridControl.DEFAULT_SHOW_COUNT;
			this.guid = this.generateGuid();
		}

		/** 
		 * This function will recieve an "Input Bag" containing the values currently assigned to the parameters in your manifest
		 * It will send down the latest values (static or dynamic) that are assigned as defined by the manifest & customization experience
		 * as well as resource, client, and theming info (see mscrm.d.ts)
		 * @params context The "Input Bag" as described above
		 */
		public updateView(context: Mscrm.ControlData<IInputBag>): Mscrm.Component {
			this._context = context;
			this.extractParameters(context);

			return this.renderMainContainer();
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
			return {
				selectedrecords: this.selectedRecords,
			};
		}

		/**
		 * This function will be called when the control is destroyed
		 * It should be used for cleanup and releasing any memory the control is using
		 */
		public destroy(): void {

		}

		private extractParameters(context) {
			this.entityLogicalName = Constants.macroSessionEntityName;
			this.entityDisplayName = Constants.macroSessionEntityDisplayName;
			this.fetchXML = XMLConstants.fetchXML;
			if (context.mode.fullPageParam != null && context.mode.fullPageParam["recID"] != null) {
				this.fetchXML = XMLConstants.fetchXML1 + context.mode.fullPageParam["recID"] + XMLConstants.fetchXML2;
			}
			this.layoutXML = XMLConstants.layoutXML;
		}

		private generateGuid(): string {
			return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
				const r = (Math.random() * 16) | 0,
					v = c == "x" ? r : (r & 0x3) | 0x8;
				return v.toString(16);
			});
		}

		// This callback is used to retrieve total result count for the fetchXML query
		private onDataSetUpdate(obj: any) {
			if (!this.isNullOrUndefined(obj) && !this.isNullOrEmptyString(obj.existedPagingString)) {
				const pagStringObj = JSON.parse(obj.existedPagingString);

				if (!this.isNullOrUndefined(pagStringObj.totalResultCount)) {
					this.recordCount = pagStringObj.totalResultCount;

					// When actual total record count is greator than 5000, this callback returns -1 as the record count
					// Todo - Find a better solution to this scenario
					if (this.recordCount == -1) this.recordCount = 5001;
					this._context.utils.requestRender();
				}
			}
		}

		private onRecordSelected(selectedRecords: string[]): void {
			this.selectedRecords = selectedRecords
				? selectedRecords.map(id => {
					return { Id: id, Name: null, LogicalName: this.entityLogicalName };
				})
				: [];
			this.notifyOutputChanged();
		}

		private renderGrid(): Mscrm.Component {
			const idd = this.guid;

			const properties: any = {
				parameters: {
					TargetEntityType: this.entityLogicalName,
					Grid: {
						Type: "Grid",
						onDataSetUpdate: this.onDataSetUpdate.bind(this),
						TargetEntityType: this.entityLogicalName,
						onRecordsSelected: this.onRecordSelected.bind(this),
						BoundViewParams: {
							ViewId: this.guid,
							ViewDisplayName: this.entityDisplayName,
							FetchXml: this.fetchXML,
							LayoutXml: this.layoutXML,
							TargetEntityType: this.entityLogicalName,
						},
						DataSetUIOptions: {
							displayChart: false,
							displayCommandBar: true,
							displayIndex: true,
							displayQuickFind: false,
							displayViewSelector: false,
							displayPaging: true
						}
					},
					EnableGroupBy: {
						Usage: 1,
						Static: true,
						Type: "Enum",
						Value: "No",
						Primary: false,
					},
					EnableFiltering: {
						Usage: 1,
						Static: true,
						Type: "Enum",
						Value: "Yes",
						Primary: false,
					},
					EnableEditing: {
						Usage: 1,
						Static: true,
						Type: "Enum",
						Value: "No",
						Primary: false,
					},
				},
				key: `DynResultsGrid_${idd}`,
				id: `DynResultsGrid_${idd}`,
			};

			const gridC = this._context.factory.createComponent(
				"MscrmControls.Grid.ReadOnlyGrid",
				"gridControl - dynResults" + idd,
				properties
			);

			return this._context.factory.createElement(
				"CONTAINER",
				{
					key: "GridContainer",
					id: "GridContainer",
				},
				[gridC]
			);
		}

		private shouldDisplayShowAllButton(): boolean {
			return false;
			//return (
			//	this.showCount == MacroSessionAssociatedGridControl.DEFAULT_SHOW_COUNT &&
			//	this.recordCount > MacroSessionAssociatedGridControl.DEFAULT_SHOW_COUNT
			//);
		}

		private renderPagingArea(): Mscrm.Component {
			const renderArray = [this.renderStatusArea()];

			if (this.shouldDisplayShowAllButton()) renderArray.push(this.renderShowAllButton());

			return this._context.factory.createElement(
				"CONTAINER",
				{
					key: "PagingControl" + this.guid,
					id: "PagingControl" + this.guid,
					"data-id": "PagingControl",
					style: {
						width: "100%",
						"min-height": "3em",
						"margin-top": "32px",
						"border-top": "solid 1px lightgrey",
					},
				},
				renderArray
			);
		}

		private renderShowAllButton(): Mscrm.Component {
			const showAllString = this._context.resources.getString("Show All");
			const btnElement = this._context.factory.createElement(
				"BUTTON",
				{
					id: "Showall_button",
					key: "Showall_button",
					style: {
						"background-color": "inherit",
						border: "0px",
						"margin-left": "10px",
						width: "fit-content",
						"font-weight": "600",
						color: this._context.theming.colors.defaulttheming,
						cursor: "pointer",
					},
					onClick: this.showAllRecords.bind(this),
					title: showAllString,
				},
				[showAllString]
			);

			this._context.factory.createElement(
				"CONTAINER",
				{
					key: "ShowAllButton",
					id: "ShowAllButton",
					style: {},
				},
				[btnElement]
			);

			return btnElement;
		}

		private renderStatusArea(): Mscrm.Component {
			const textTemplate = this._context.resources.getString("PageStatus_Template");

			const displayingCount = this.recordCount <= this.showCount ? this.recordCount : this.showCount;
			const displayRecordCount = this.recordCount > 5000 ? "5000+" : this.recordCount;

			const statusText = "";//MscrmCommon.ControlUtils.String.Format(textTemplate, displayingCount, displayRecordCount);
			return this._context.factory.createElement(
				"CONTAINER",
				{
					key: "PagingControlStatusArea" + this.guid,
					id: "PagingControlStatusArea" + this.guid,
					style: {
						"vertical-align": "middle",
					},
				},
				[
					this._context.factory.createElement(
						"TEXT",
						{
							id: "PagingText" + this.guid,
							key: "PagingText" + this.guid,
							style: {
								display: this.recordCount > 0 ? "flex" : "none",
								"font-size": this._context.theming.fontsizes.mfontsize,
								"font-family": this._context.theming.fontfamilies.regular,
								color: this._context.theming.colors.control.text,
								"padding-top": "12px",
							},
						},
						[statusText]
					),
				]
			);
		}

		private renderMainContainer(): Mscrm.Component {
			const renderArray = [this.renderGrid(), this.renderPagingArea()];

			const container: Mscrm.Component = this._context.factory.createElement(
				"CONTAINER",
				{
					id: "Container",
					key: "Container",
					style: {
						display: "block",
						width: "100%",
						height: "100%",
						color: this._context.theming.colors.grays.gray05,
						"background-color": this._context.theming.colors.whitebackground,
					},
				},
				renderArray
			);

			return container;
		}

		private showAllRecords() {
			this.showCount = MacroSessionAssociatedGridControl.MAX_RECORD_COUNT;
			this.guid = this.generateGuid();
			this._context.utils.requestRender();
		}

		private isNullOrEmptyString(obj: any): boolean {
			return this._context.utils.isNullOrEmptyString(obj);
		}

		private isNullOrUndefined(obj: any): boolean {
			return this._context.utils.isNullOrUndefined(obj);
		}
	}
}