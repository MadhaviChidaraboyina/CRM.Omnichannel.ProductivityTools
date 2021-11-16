/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/

/// <reference path="privatereferences.ts"/>

module MscrmControls.Callscript {
	'use strict';

	export class CallscriptStepDetailsManager {

		private context: Mscrm.ControlData<IInputBag>;
		private stateManager: StateManager;
		private telemetryContext: string;
		private telemetryLogger: TelemetryLogger;
		private macroUtil: MacroUtil;

		/**
		 * Constructor.
		 */
		constructor(context: Mscrm.ControlData<IInputBag>, stateManager: StateManager, logger: TelemetryLogger, macro: MacroUtil) {
			this.context = context;
			this.stateManager = stateManager;
			this.telemetryContext = TelemetryComponents.CallscriptStepListitemManager;
			this.telemetryLogger = logger;
			this.macroUtil = macro;
		}

		private getExecuteActionPromise(step: CallScriptStep) {
			switch (step.action.actionType) {
				case CallscriptActionType.TextAction:
					return step.action.executeAction();
				case CallscriptActionType.MacroAction:
					return step.action.executeAction(this.macroUtil);
				case CallscriptActionType.ReRouteAction:
					return step.action.executeAction(this.stateManager);
				default:
					return step.action.executeAction();
			}
		}

		/**
		 * Returns action button click handler function
		 */
		public getActionButtonClickHandler(step: CallScriptStep): any {
			return this.handleActionButtonClick.bind(this, step);
		}

		/**
		 * Returns action button keydown handler function
		 */
		public getActionButtonKeyDownHandler(step: CallScriptStep): any {
			return this.handleActionButtonKeydown.bind(this, step);
		}


		// /**
		//  * Updates the content of live region on step execution status update
		//  * Comment out this function as for now narrator/NVDA screen reader will announce the complete status twice.
		//  * If we need any further alert content/liveregion update, we can uncomment and make use of this function.
		//  */
		// public updateLiveRegionContent(step: CallScriptStep): void {
		// 	const liveRegion = document.getElementById(this.context.accessibility.getUniqueId(LiveRegion.LiveRegionId));
		// 	if (liveRegion) {
		// 		liveRegion.innerHTML = "";
		// 		liveRegion.innerHTML = step.getAccessibilityLabel();
		// 	}
		// }

		/**
		 * Onclick handler for button on step details
		 * @param step step whose button is clicked
		 * @param event Jquery event object 
		 */
		public handleActionButtonClick(step: CallScriptStep, event: JQueryEventObject): void {
			let methodName = "handleActionButtonClick";
			if (step.executionStatus != ExecutionStatus.Started) {

				let scripts = this.stateManager.callscriptsForCurrentSession;

				step.executionStatus = ExecutionStatus.Started;

				$(event.target).closest("li").focus();

				let executeActionPromise = this.getExecuteActionPromise(step);
				executeActionPromise.then(
					(response) => {
						step.executionStatus = ExecutionStatus.Completed;
						step.isExecuted = true;
						if (step.action.actionType == CallscriptActionType.ReRouteAction) {
							let comboboxId = this.context.accessibility.getUniqueId("callscriptCombobox");
							$(document.getElementById(comboboxId)).focus();
						}

						this.context.utils.requestRender();

						let eventParams = this.addActionExecutionLogs(step);
						eventParams.addParameter("stepId", step.id);
						eventParams.addParameter("message", "Step executed successfully");
						this.telemetryLogger.logSuccess(this.telemetryContext, methodName, eventParams);
					},
					(error) => {
						step.executionStatus = ExecutionStatus.Failed;

						if (step.action.actionType == CallscriptActionType.MacroAction) {
							step.action.errorText = this.context.resources.getString(LocalizedStrings.MacroStepFailureMessage);
						} else if (step.action.actionType == CallscriptActionType.ReRouteAction) {
							step.action.errorText = this.context.resources.getString(LocalizedStrings.ScriptStepFailureMessage);
						}
						this.context.utils.requestRender();

						let eventParams = this.addActionExecutionLogs(step);
						eventParams.addParameter("stepId", step.id);
						eventParams.addParameter("message", "Step execution failed");
						eventParams.addParameter("errorDetails", error);
						let errorMessage = "Failed to execute action";
						this.telemetryLogger.logError(this.telemetryContext, methodName, errorMessage, eventParams);
					});
			}
			this.context.utils.requestRender();
			event.stopPropagation();
		}

		/**
		 * Keydown handler for run action button
		 * @param step step to run
		 * @param event keydown jquery event
		 */
		public handleActionButtonKeydown(step: CallScriptStep, event: JQueryEventObject): void {
			if (event.keyCode === Mscrm.KeyCode.Enter) {
				this.handleActionButtonClick(step, event);
			}
		}

		/**
		 * Add telemetry event parameters when action is executed
		 * @param step call script step
		 */
		private addActionExecutionLogs(step: CallScriptStep): EventParameters {
			let eventParams = new EventParameters();
			try {
				eventParams.addParameter("actionType", step.action.actionType.toString());

				switch (step.action.actionType) {
					case CallscriptActionType.MacroAction:
						eventParams.addParameter("macroActionId", (step.action as MacroAction).macroId);
						break;

					case CallscriptActionType.ReRouteAction:
						eventParams.addParameter("routeActionId", (step.action as RouteAction).routeCallscriptId);
						break;

					case CallscriptActionType.TextAction:
						// TBD
						break;
				}
			} catch (error) {
				eventParams.addParameter("parameterError", "Error occured in adding parameter details");
			}

			return eventParams;
		}

		/**
		 * Returns tooltip to show on run action icons
		 * @param step step to get tooltip for
		 */
		public getActionButtonLabel(step: CallScriptStep): string {
			let buttonLabel: string;
			if (step.action.actionType === CallscriptActionType.TextAction) {
				buttonLabel = this.context.resources.getString(LocalizedStrings.TextActionLabel);
			}
			else if (step.action.actionType === CallscriptActionType.ReRouteAction) {
				buttonLabel = this.context.resources.getString(LocalizedStrings.RouteActionLabel);
			}
			else {
				buttonLabel = step.executionStatus === ExecutionStatus.Started ?
					this.context.resources.getString(LocalizedStrings.Accessibility_StartedStepLabel) :
					this.context.resources.getString(LocalizedStrings.NotExecutedStepButtonLabel);
			}
			return buttonLabel;
		}

		/**
		 * Returns container containing error component for failed step
		 * @param step object of failed step whose error is returned
		 */
		private getErrorTextComponent(step: CallScriptStep): Mscrm.Component {
			return this.context.factory.createElement("TEXT", {
				key: "CallScriptStepError-" + step.id + "-Key",
				id: "CallScriptStepError-" + step.id + "-Id",
				style: ControlStyle.getActionErrorTextStyle(this.context)
			}, step.action.getErrorText());
		}

		/**
		 * Returns container with description of step
		 * @param step step object whose description is contained in returned container
		 */
		private getStepDescriptionContainer(step: CallScriptStep) {
			// This will be changed to return step descrption as per updated UX specs
            let formattedLabel = !this.context.utils.isNullOrUndefined(step.action.getResolvedTextInstruction()) ?
                    Utility.formattedStringDisplay(this.context, step.action.getResolvedTextInstruction(), step.id, true) : Constants.EmptyString;
            
			return this.context.factory.createElement("CONTAINER", {
				key: "CallScriptStepDescription-" + step.id + "-Key",
				id: "CallScriptStepDescription-" + step.id + "-Id",
				style: ControlStyle.getActionTextStyle(step.executionStatus, this.context)
            }, formattedLabel);
		}

		/**
		 * Returns container with instruction of text action step - to be called only for text action step
		 * @param step step object whose description is contained in returned container
		 */
        private getTextInstructionContainer(step: CallScriptStep) {
            let formattedLabel = !this.context.utils.isNullOrUndefined(step.action.getResolvedTextInstruction()) ?
                Utility.formattedStringDisplay(this.context, step.action.getResolvedTextInstruction(), step.id, true) : Constants.EmptyString;

			return this.context.factory.createElement("CONTAINER", {
				key: "CallScriptStepDescription-" + step.id + "-Key",
				id: "CallScriptStepDescription-" + step.id + "-Id",
				style: ControlStyle.getActionTextStyle(step.executionStatus, this.context)
            }, formattedLabel);
		}

		/**
		 * Returns container with details of text action step - to be called only for text action step
		 * @param step step object whose expanded container is returned
		 */
		public getTextActionDetailsComponents(step: CallScriptStep): Mscrm.Component[] {
			let textActionDetailsComponents: Mscrm.Component[] = [];

			textActionDetailsComponents.push(this.getTextInstructionContainer(step));
			if (step.executionStatus === ExecutionStatus.Failed) {
				textActionDetailsComponents.push(this.getErrorTextComponent(step));
			}
			/*Removing the action button, since action icon is present upfront now
			textActionDetailsComponents.push(this.getActionButton(step));
			*/

			return textActionDetailsComponents;
		}

		/**
		 * Returns container with details of macro/route action step - to be called only for macro/route action step
		 * @param step step object whose expanded container is returned
		 */
		public getMacroAndRouteActionDetailsComponents(step: CallScriptStep): Mscrm.Component[] {
			let macroAndRouteActionDetailsComponents: Mscrm.Component[] = [];

			macroAndRouteActionDetailsComponents.push(this.getStepDescriptionContainer(step));
			if (step.executionStatus === ExecutionStatus.Failed) {
				macroAndRouteActionDetailsComponents.push(this.getErrorTextComponent(step));
			}

			return macroAndRouteActionDetailsComponents;
		}

	}
}