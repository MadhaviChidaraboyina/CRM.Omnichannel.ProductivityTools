/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/

/// <reference path="privatereferences.ts"/>

module MscrmControls.Callscript {
	'use strict';

    export class CallscriptControl implements Mscrm.Control<IInputBag, IOutputBag> {

		private context: Mscrm.ControlData<IInputBag>;
		public stateManager: StateManager;
		public macroUtil: MacroUtil;
		public cecUtil: CECUtil;
		public stepsListManager: CallscriptStepsListManager;
		public stepListitemManager: CallscriptStepListitemManager;
		public stepDetailsManager: CallscriptStepDetailsManager;
		private initCompleted: boolean;
		private telemetryContext: string;
		private telemetryLogger: TelemetryLogger;
        private setFocusOnSelector: boolean;
		private loadRetryCount: number;

		/**
		 * Constructor.
		 */
		constructor() {
			this.initCompleted = false;
			this.telemetryContext = TelemetryComponents.MainComponent;
            this.setFocusOnSelector = false;
			this.loadRetryCount = 0;
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
				this.cecUtil = new CECUtil(context, this.telemetryLogger);
				// Initialize the static value in macroUtil
				this.macroUtil = new MacroUtil(context, this.telemetryLogger);
				this.macroUtil.init();
				this.stateManager = new StateManager(context, this.telemetryLogger, this.cecUtil, this.macroUtil);

				this.stepDetailsManager = new CallscriptStepDetailsManager(context, this.stateManager, this.telemetryLogger, this.macroUtil);
				this.stepListitemManager = new CallscriptStepListitemManager(context, this.stateManager, this.stepDetailsManager, this.telemetryLogger, this.cecUtil, this.macroUtil);
				this.stepsListManager = new CallscriptStepsListManager(context, this.stepListitemManager);

				this.initCompleted = true;

				let params = new EventParameters();
				this.telemetryLogger.logSuccess(this.telemetryContext, "Init", params);
            }
            let windowObject = this.getWindowObject();
            Microsoft.AppRuntime.Sessions.addOnAfterSessionSwitch(this.handleSessionSwitch.bind(this));
			Microsoft.AppRuntime.Sessions.addOnSessionRefresh(this.handleSessionRefresh.bind(this));
		}

        private getWindowObject(): any {
            return window.top;
        }

        //This method is registered as a handler for session switch
        private handleSessionSwitch(context: XrmClientApi.EventContext) {
			this.loadRetryCount = 0;
            this.stateManager.onSessionSwitch();
        }

		//This method is registered as a handler for session refresh event
        private handleSessionRefresh(context: XrmClientApi.EventContext) {
			this.loadRetryCount = 0;
			// If eventSource is specified as Macros, skip refreshing callscript
			if (context["eventSource"] !== Constants.EVENTSOURCE_MACROS)
			{
				this.stateManager.onSessionRefresh();
			}           
        }

		/**
		 * This function is called when agent changes selected option in callscript dropdown
		 * @param selectedOption option selected by agent
		 */
		private handleCallscriptOptionChange(selectedOption: ComboBoxItem) {
			let methodName = "handleCallscriptOptionChange";
			for (let script of this.stateManager.callscriptsForCurrentSession) {
				if (selectedOption.id === script.id) {
					script.isCurrent = true;
					this.stateManager.selectedScriptForCurrentSession = script;

					if (!this.stateManager.selectedScriptForCurrentSession.isStepsDataRetrieved) {
						this.setFocusOnSelector = true;
					}
				}
				else {
					script.isCurrent = false;
				}
			}

			this.context.utils.requestRender();

			let eventParams = new EventParameters();
			eventParams.addParameter("callscriptId", selectedOption.id);
			eventParams.addParameter("message", "callscript selected from options");
			this.telemetryLogger.logSuccess(this.telemetryContext, methodName, eventParams);
		}

		/*
		 * This function returns options for callscripts to be rendered in dropdown
		 */
		private getScriptOptions(): ComboBoxItem[] {
			let options: ComboBoxItem[] = [];

			for (let script of this.stateManager.callscriptsForCurrentSession) {
				let option = new ComboBoxItem(script.id, script.id, script.name, script.isCurrent);
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
				style: ControlStyle.getDropDownArrowIconStyle()
			});

			const dropDownArrowComponent = this.context.factory.createElement("CONTAINER", {
				key: "dropDownArrowContainerKey",
				id: "dropDownArrowContainerId",
				style: ControlStyle.getDropDownArrowComponentStyle()
			}, dropDownArrow);

			let scriptOptions = this.getScriptOptions();
			//Add empty option in dropdown if no callscript is configured for this session
			if (scriptOptions.length == 0) {
				let emptyOption = new ComboBoxItem("emptyOptionId", "emptyOptionId", "", true);
				scriptOptions.push(emptyOption);
			}

			let currentOption = null;
			for (let option of scriptOptions) {
				if (option.isCurrent) currentOption = option;
			}
			if (currentOption === null) currentOption = scriptOptions[0];

			var callscriptComboBox = this.context.factory.createElement("SELECT",
				{
					id: "callscriptCombobox",
					key: "callscriptCombobox",
					accessibilityLabel: this.context.resources.getString(LocalizedStrings.SelectAgentScriptComboboxLabel),
					value: currentOption,
					options: scriptOptions,
					style: ControlStyle.getSelectStyle(this.context),
					tabIndex: 0,
					onChange: this.handleCallscriptOptionChange.bind(this)
				}
			);

			const dropDownComponent = this.context.factory.createElement("CONTAINER", {
				key: "dropDownContainerKey",
				id: "dropDownContainerId",
				className: AgentscriptCssClassNames.SelectorElementParentDiv,
				style: ControlStyle.getDropDownComponentStyle(),
				title: this.context.resources.getString(LocalizedStrings.SelectAgentScriptComboboxLabel)
			}, [callscriptComboBox, dropDownArrowComponent]);

			return dropDownComponent;
		}

		/**
		 * This function returns control header component
		 */
        private getControlHeader(): Mscrm.Component {
            
            var controlHeader = [];

			var controlHeaderLabel: Mscrm.Component = this.context.factory.createElement("LABEL", {
				key: "CallscriptHeaderKey",
                id: "CallscriptHeaderId",               
				style: ControlStyle.getControlHeaderStyle(this.context)
			}, this.context.resources.getString(LocalizedStrings.CallscriptHeader));

            controlHeader.push(controlHeaderLabel);

            var controlHeaderInfoIcon: Mscrm.Component =  this.context.factory.createElement("CONTAINER", {
                key: "CallscriptHeaderInfoIconKey",
                id: "CallscriptHeaderInfoIconId",
                className: "tooltip",
                style: ControlStyle.getControlHeaderInfoIconStyle(this.context)
            }, [this.getInfoMessage()]);

            controlHeader.push(controlHeaderInfoIcon);

			return this.context.factory.createElement("CONTAINER", {
				key: "CallscriptHeaderContainerKey",
				id: "CallscriptHeaderContainerId",
				style: ControlStyle.getHeaderContainerStyle()
			}, controlHeader);
        }

        /**
		 * This function returns the information when mouse over on info icon in call script header
		 */
        private getInfoMessage() {
            return this.context.factory.createElement(
                "CONTAINER", {
                id: "CallscriptInfoMessageId",
                key: "CallscriptInfoMessageKey",
                className: "tooltiptext",
            }, this.context.resources.getString(LocalizedStrings.ControlHeaderInfo));
        }

		/**
		 * This function returns loading wheel until callscript data fetch is complete
		 */
		private getLoadingWheel() {
			let loadingWheel = this.context.factory.createElement(
				"PROGRESSINDICATOR", {
					id: "CallscriptProgressIndicatorId",
					key: "CallscriptProgressIndicatorKey",
					style: ControlStyle.getProgressWheelStyle(),
					progressType: "ring",
					active: true
				}, []
			);

			return this.context.factory.createElement(
				"CONTAINER", {
					id: "CallscriptProgressIndicatorContainerId",
					key: "CallscriptProgressIndicatorContainerKey",
					style: ControlStyle.getMainComponentStyle()
				}, loadingWheel);
		}

		/**
		 * Returns a container with script description
		 * @param currentScript script whose description container is returned
		 */
        private getScriptDescriptionContainer(currentScript: CallScript): Mscrm.Component {
            let formattedLabel = !this.context.utils.isNullOrUndefined(currentScript.description) ?
                    Utility.formattedStringDisplay(this.context, currentScript.description, currentScript.id, true) : Constants.EmptyString;
			var scriptDescriptionComponent = this.context.factory.createElement("TEXT", {
				key: "CallScriptDescription-" + currentScript.id + "-Key",
				id: "CallScriptDescription-" + currentScript.id + "-Id",
				style: ControlStyle.getScriptDescriptionStyle(this.context)
            }, formattedLabel);
			return this.context.factory.createElement("CONTAINER", {
				key: "CallScriptDescriptionContainer-" + currentScript.id + "-Key",
				id: "CallScriptDescriptionContainer-" + currentScript.id + "-Id",
				style: ControlStyle.getScriptDescriptionContainerStyle()
			}, scriptDescriptionComponent);
		}

		/**
		 * Returns error container if current session is not valid OC session or there was a failure in script data fetch call
		 * @param isInvalidSession flag indicating if this is invalid session or not
		 */
		private getScriptLoadErrorContainer(errorResourceKey: string): Mscrm.Component {
			let displayErrorMessage = this.context.resources.getString(errorResourceKey);
			var errorComponent = this.context.factory.createElement("TEXT", {
				key: "CallScriptLoadErrorId",
				id: "CallScriptLoadErrorId",
				style: ControlStyle.getScriptDescriptionStyle(this.context)
			}, displayErrorMessage);
			return this.context.factory.createElement("CONTAINER", {
				key: "CallScriptLoadErrorContainerKey",
				id: "CallScriptLoadErrorContainerId",
				style: ControlStyle.getScriptDescriptionContainerStyle()
			}, errorComponent);
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
				this.reloadCallScript();
				return this.getLoadingWheel();
            }

			let callscriptComponents: Mscrm.Component[] = [];

            if (!this.stateManager.scriptDataFetchFailed) {
                callscriptComponents.push(this.getScriptsDropdown());
            }

			if (this.stateManager.selectedScriptForCurrentSession) {
				callscriptComponents.push(this.getScriptDescriptionContainer(this.stateManager.selectedScriptForCurrentSession));
				callscriptComponents.push(this.stepsListManager.getStepsList(this.stateManager.selectedScriptForCurrentSession));
			}

			callscriptComponents.push(LiveRegion.getLiveRegion(this.context));

			if (this.setFocusOnSelector) {
				this.setFocus();
			}

			let controlStyles = ControlStyle.getMainComponentStyle();
			if (!this.context.utils.isNullOrUndefined(context.parameters["style"])) {
				let styleProps = context.parameters["style"]["raw"];
				if (Object.keys(styleProps).length != 0) {
					for (let i in styleProps)
						controlStyles[i] = styleProps[i];
				}
			}

            if (this.stateManager.scriptDataFetchFailed) {
                callscriptComponents.push(this.getScriptLoadErrorContainer(LocalizedStrings.InitialScriptDataLoadFailure));
            }
            else if (this.stateManager.callscriptsForCurrentSession.length == 0) {
                callscriptComponents.push(this.getScriptLoadErrorContainer(LocalizedStrings.NoDataCallScriptMessage));
            }

			return context.factory.createElement(
				"CONTAINER", {
					id: "CallScriptContainer",
					key: "CallScriptContainer",
					style: controlStyles
				}, callscriptComponents);
        }

		private async reloadCallScript() { 
			let methodName = 'reloadCallScript';
			let eventParams = new EventParameters();
			// Home session is expected to have undefined call scripts. We need to record session id in telemetry.
			eventParams.addParameter("Current Session Id: ", Utility.getCurrentSessionId());
			// We give one initial load and three reload retry times.
			while (this.loadRetryCount < 4 && this.context.utils.isNullOrUndefined(this.stateManager.callscriptsForCurrentSession)) {
				this.loadRetryCount++;
				await this.macroUtil.init();
				await this.stateManager.fetchCallScriptsForCurrentSession();
				eventParams.addParameter("The count of loading CallScript: ", this.loadRetryCount.toString());
				this.telemetryLogger.logSuccess(this.telemetryContext, methodName, eventParams);
			}
			// After three times retry, we still failed to get call scripts. Log Error.
			if (this.context.utils.isNullOrUndefined(this.stateManager.callscriptsForCurrentSession)) {
				let errorMessage = 'Exceeded three retry times and still fail to retrieve call scripts';
				this.telemetryLogger.logError(this.telemetryContext, methodName, errorMessage, eventParams);
			}
		}  

		/**
		 * Set focus on script selector
		 */
		private setFocus() {
			setTimeout(() => {
				try {
					let selectorId = "callscriptCombobox";
					let selectorAbsoluteId = this.context.accessibility.getUniqueId(selectorId);
					let domElement = document.getElementById(selectorAbsoluteId);

					if (this.context.utils.isNullOrUndefined(domElement)) {
						return;
					}

					domElement.focus();
					this.setFocusOnSelector = false;
				}
				catch (error) {
					let errorMessage = "Failed to set focus on script selector";
					let errorParam = new EventParameters();
					this.telemetryLogger.logError(this.telemetryContext, "SetFocus", errorMessage, errorParam);
				}
			}, 300)
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
			this.stateManager.updateControlStateInCEC();
		}
	}
}