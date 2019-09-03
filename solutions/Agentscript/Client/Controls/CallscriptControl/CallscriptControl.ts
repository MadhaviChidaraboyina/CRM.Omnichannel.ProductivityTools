/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/

/// <reference path="privatereferences.ts"/>

module MscrmControls.ProductivityPanel {
	'use strict';

	export class CallscriptControl implements Mscrm.Control<IInputBag, IOutputBag> {

		private context: Mscrm.ControlData<IInputBag>;
		public controlStyle: ControlStyle;
		public stateManager: StateManager;
		public cifUtil: CIFUtil;
		public stepsListManager: CallscriptStepsListManager;
		public stepListitemManager: CallscriptStepListitemManager;
		public stepDetailsManager: CallscriptStepDetailsManager;
		private initCompleted: boolean;
		private telemetryContext: string;
		private telemetryLogger: TelemetryLogger;

		/**
		 * Constructor.
		 */
		constructor() {
			this.initCompleted = false;
			this.telemetryContext = TelemetryComponents.MainComponent;
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
			if (this.initCompleted == false)
			{
				this.context = context;
				this.telemetryLogger = new TelemetryLogger(context);
				this.cifUtil = new CIFUtil(context);
				this.controlStyle = new ControlStyle(context);
				this.stateManager = new StateManager(context);

				this.stepDetailsManager = new CallscriptStepDetailsManager(context, this);
				this.stepListitemManager = new CallscriptStepListitemManager(context, this);
				this.stepsListManager = new CallscriptStepsListManager(context, this);

				this.initCompleted = true;

				let params = new EventParameters();
				this.telemetryLogger.logSuccess(this.telemetryContext, "Init", params);
			}
		}

		/**
		 * This function is called when agent changes selected option in callscript dropdown
		 * @param selectedOption option selected by agent
		 */
		private handleCallscriptOptionChange(selectedOption: ComboBoxItem) {
			for (let script of this.stateManager.callscriptsForCurrentSession) {
				if (selectedOption.id === script.id) {
					script.isCurrent = true;
					this.stateManager.selectedScriptForCurrentSession = script;
				}
				else {
					script.isCurrent = false;
				}
			}
			this.stateManager.updateSessionState();
			this.context.utils.requestRender();
		}

		/*
		 * This function returns options for callscripts to be rendered in dropdown
		 */
		private getScriptOptions(): ComboBoxItem[] {
			let options: ComboBoxItem[] = [];
			let emptyOptionLabel = this.context.resources.getString(LocalizedStrings.ScriptComboboxEmptyOptionLabel);
			let option = new ComboBoxItem("emptyOptionId", "emptyOptionKey", emptyOptionLabel, false);
			options.push(option);

			for (let script of this.stateManager.callscriptsForCurrentSession) {
				let option = new ComboBoxItem(script.id, script.id, script.displayName, script.isCurrent);
				options.push(option);
			}
			return options;
		}

		/**
		 * This function returns the dropdown component for callscripts
		 */
		private getScriptsDropdown(): Mscrm.Component {
			const dropDownArrow = this.context.factory.createElement("MICROSOFTICON", {
				key: "dropDownArrowIconKey",
				id: "dropDownArrowIconId",
				type: 72,
				style: this.controlStyle.dropDownArrowIconStyle
			});

			const dropDownArrowComponent = this.context.factory.createElement("CONTAINER", {
				key: "dropDownArrowContainerKey",
				id: "dropDownArrowContainerId",
				style: this.controlStyle.dropDownArrowComponentStyle
			}, dropDownArrow);

			let scriptOptions = this.getScriptOptions();
			let currentOption = null;
			for (let option of scriptOptions) {
				if (option.isCurrent) currentOption = option;
			}
			if (currentOption === null) currentOption = scriptOptions[0];

			var callscriptComboBox = this.context.factory.createElement("SELECT",
				{
					id: "callscriptCombobox",
					key: "callscriptCombobox",
					accessibilityLabel: currentOption.Label,
					value: currentOption,
					options: scriptOptions,
					style: this.controlStyle.selectStyle(),
					tabIndex: 0,
					onChange: this.handleCallscriptOptionChange.bind(this)
				}
			);

			const dropDownComponent = this.context.factory.createElement("CONTAINER", {
				key: "dropDownContainerKey",
				id: "dropDownContainerId",
				style: this.controlStyle.dropDownComponentStyle,
				title: currentOption.Label
			}, [callscriptComboBox, dropDownArrowComponent]);

			return dropDownComponent;
		}

		/**
		 * This function returns control header component
		 */
		private getControlHeader(): Mscrm.Component {
			var controlHeaderLabel: Mscrm.Component = this.context.factory.createElement("LABEL", {
				key: "CallscriptHeaderKey",
				id: "CallscriptHeaderId",
				style: this.controlStyle.controlHeaderStyle
			}, this.context.resources.getString(LocalizedStrings.CallscriptHeader));

			return this.context.factory.createElement("CONTAINER", {
				key: "CallscriptHeaderContainerKey",
				id: "CallscriptHeaderContainerId",
				style: this.controlStyle.headerContainerStyle
			}, controlHeaderLabel);
		}

		/**
		 * This function returns loading wheel until callscript data fetch is complete
		 */
		private getLoadingWheel() {
			let loadingWheel = this.context.factory.createElement(
				"PROGRESSINDICATOR", {
					id: "CallscriptProgressIndicatorId",
					key: "CallscriptProgressIndicatorKey",
					style: this.controlStyle.progressWheelStyle,
					progressType: "ring",
					active: true
				}, []
			);

			return this.context.factory.createElement(
				"CONTAINER", {
					id: "CallscriptProgressIndicatorContainerId",
					key: "CallscriptProgressIndicatorContainerKey",
					style: this.controlStyle.mainComponentStyle
				}, loadingWheel);
		}

		/** 
		 * This function will recieve an "Input Bag" containing the values currently assigned to the parameters in your manifest
		 * It will send down the latest values (static or dynamic) that are assigned as defined by the manifest & customization experience
		 * as well as resource, client, and theming info (see mscrm.d.ts)
		 * @params context The "Input Bag" as described above
		 */
		public updateView(context: Mscrm.ControlData<IInputBag>): Mscrm.Component
		{
			let isScriptDataInitialized = this.stateManager.initializeCallscriptsForCurrentSession();
			if (isScriptDataInitialized === false) {
				return this.getLoadingWheel();
			}

			let callscriptComponents: Mscrm.Component[] = [];

			callscriptComponents.push(this.getControlHeader());

			callscriptComponents.push(this.getScriptsDropdown());

			if (this.stateManager.selectedScriptForCurrentSession) {
				callscriptComponents.push(this.stepsListManager.getStepsList(this.stateManager.selectedScriptForCurrentSession, this.controlStyle));
			}

			return context.factory.createElement(
				"CONTAINER", {
					id: "CallScriptContainer",
					key: "CallScriptContainer",
					style: this.controlStyle.mainComponentStyle
				}, callscriptComponents);
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