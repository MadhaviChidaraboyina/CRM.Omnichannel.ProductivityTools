/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/

/// <reference path="utils/Constants.ts"/>
/// <reference path="utils/PanelControlManager.ts"/>
/// <reference path="privatereferences.ts"/>

module MscrmControls.ProductivityToolPanel {
	'use strict';

	export class ProductivityPanelControl implements Mscrm.Control<IInputBag, IOutputBag> {

		private initCompleted: boolean;
		private context: Mscrm.ControlData<IInputBag>;
		private productivityToolSelected: string;
		private panelToggle: boolean;
		private telemetryContext: string;
		private telemetryLogger: TelemetryLogger;
		protected notifyOutputChanged: () => void;
		
		/**
		 * Constructor.
		 */
		constructor() {
			this.initCompleted = false;
			this.telemetryContext = TelemetryComponents.MainComponent;
			this.productivityToolSelected = Constants.emptyString;
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
			if (this.initCompleted == false) {
				this.context = context;
				this.telemetryLogger = new TelemetryLogger(context);
				this.notifyOutputChanged = notifyOutputChanged;
				this.initCompleted = true;
				let params = new EventParameters();
				this.telemetryLogger.logSuccess(this.telemetryContext, "Init", params);
			}
			this.panelToggle = false;
		}

		/**
		 * getPanelContainer generates a side panel.
		 */
		private getPanelContainer(): Mscrm.Component
	    {
			const panelContainer = this.context.factory.createElement(
				"CONTAINER",
				{
					id: Constants.panelContainerId,
					key: "panelContainer",
					style: this.panelToggle ? ControlStyle.getProductivityPaneStyle(Constants.TRUE): ControlStyle.getProductivityPaneStyle(Constants.FALSE)
				},
				Constants.emptyString);

			return panelContainer;			
		}

		private getProductivityToolSelectionIndicator(buttonId: string): Mscrm.Component
		{
			const indicatorContainer = this.context.factory.createElement(
				"CONTAINER",
				{
					id: `${Constants.toolIndicatorId}${buttonId}`,
					key: "productivityToolIndicatorContainer",
					style: (this.productivityToolSelected === buttonId && this.panelToggle) ? ControlStyle.getSelectionIndicatorStyle(Constants.TRUE) : ControlStyle.getSelectionIndicatorStyle(Constants.FALSE)
				},
				Constants.emptyString);

		   return indicatorContainer; 
		}
		

		/**
		 * getProductivityToolButton generates the toggle button.
		 */
		private getProductivityToolButton(iconId: string, iconPath: string, buttonId: string, selectionIndicator: boolean, toolTip: string): Mscrm.Component
		{		
			const icon = this.getProductivityToolIcon(iconId, iconPath);
			const toggleButton = this.context.factory.createElement(
				"BUTTON",
				{
					id: buttonId,
					key: buttonId,
					onClick: this.onButtonClick.bind(this, buttonId),
					style: (this.productivityToolSelected === buttonId && this.panelToggle) ? ControlStyle.getProductivityPanelBtnStyle(Constants.TRUE) : ControlStyle.getProductivityPanelBtnStyle(Constants.FALSE)
				},
				[icon, selectionIndicator ? this.getProductivityToolSelectionIndicator(buttonId): Constants.emptyString]);

				const listItem = this.context.factory.createElement(
					"LISTITEM",
					{
						id: `${Constants.listItemId}${buttonId}`,
						key: `${Constants.listItemId}${buttonId}`,
						style: {
							display: "flex"
						},
						title: this.context.resources.getString(toolTip)
					},
					toggleButton);

				return listItem;
		}

		private getNavBarLastContainer(): Mscrm.Component
		{	
			const lastContainer = this.context.factory.createElement(
				"CONTAINER",
				{
					id: "productivity-tools-last-button-container",
					key: "productivityToolLastContainer",
					style: ControlStyle.getNavigationBarLastContainer()
				},
				"");

		   return lastContainer; 
		}

		private getproductivityToolButtons(): Mscrm.Component
		{		
			var listItems: Mscrm.Component[] = [];

			const toggleButton =  this.getProductivityToolButton(Constants.toggleIconId,
				this.panelToggle ? Constants.panelToggleExpand : Constants.panelToggleCollpase,Constants.toggle, false, this.panelToggle ? Constants.collpaseToolTip: Constants.expandToolTip);
			const agentGuidanceButton =  this.getProductivityToolButton(Constants.agentScriptIconId,Constants.agentScriptIcon,Constants.agentGuidance, true, Constants.agentGuidanceTooltip);
			const macrosButton =  this.getProductivityToolButton(Constants.macrosIconId,Constants.productivityMacrosIcon,Constants.productivityMacros, true, Constants.productivityMacrosTooltip);

			listItems.push(toggleButton);
			listItems.push(agentGuidanceButton);
			listItems.push(macrosButton);

			const buttonContainer = this.context.factory.createElement(
				"LIST",
				{
					id: "productivity-tools-button-container",
					key: "productivityToolContainer",
					role: "list"
				},
				listItems);

		   return buttonContainer; 
		}

		/** 
		 * This function will recieve an "Input Bag" containing the values currently assigned to the parameters in your manifest
		 * It will send down the latest values (static or dynamic) that are assigned as defined by the manifest & customization experience
		 * as well as resource, client, and theming info (see mscrm.d.ts)
		 * @params context The "Input Bag" as described above
		 */
		public updateView(context: Mscrm.ControlData<IInputBag>): Mscrm.Component
		{
				const navbarContainer = this.context.factory.createElement(
					"CONTAINER",
					{
						id: "navbar-container-container",
						key: "navbarContainer",
						style: ControlStyle.getProductivityNavBarStyle()
					},
					[this.getproductivityToolButtons(), this.getNavBarLastContainer(), this.getPanelContainer()]);

               return navbarContainer; 
		}

		private setSidePanelControlState(stateId: number): void{
			let methodName = "setSidePanelControlState";
			try {
				PanelControlManager.toggleSidePanelControl(stateId);
			}
			catch(error) {
				let eventParams = new EventParameters();
				eventParams.addParameter("message", "Failed to set sidePanel state");
				this.telemetryLogger.logError(this.telemetryContext, methodName, error, eventParams);
			}
		}

		private toggleButtonClick(): void{
			if(!this.panelToggle){
				if(this.productivityToolSelected === Constants.emptyString){
					this.productivityToolSelected = Constants.agentGuidance;
				}
				this.setSidePanelControlState(1);
			}
			else{
				this.setSidePanelControlState(0);
			}
				this.panelToggle= !this.panelToggle;
				this.context.utils.requestRender();
		}

		private productivityToolButtonClick(buttonId: string): void{
			if(!this.panelToggle){
				this.setSidePanelControlState(1);
				this.panelToggle = !this.panelToggle;
				this.productivityToolSelected = buttonId;
			}
			if(!(this.productivityToolSelected === buttonId)){
				this.productivityToolSelected = buttonId;
			}
			this.context.utils.requestRender();
		}

		private onButtonClick(buttonId: string): void {	
			if(buttonId === Constants.toggle){
				this.toggleButtonClick();
			}
			else{
				this.productivityToolButtonClick(buttonId);
			}
		}

		private  getProductivityToolIcon(iconId: string, iconPath: string): Mscrm.Component {
			const icon =  this.context.factory.createElement("IMG", {
				id: iconId,
				source: iconPath,
				style:{
					verticalAlign: "middle"
				}
			});
			return icon;
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