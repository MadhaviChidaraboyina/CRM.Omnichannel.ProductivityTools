/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/

/// <reference path="privatereferences.ts"/>

module MscrmControls.ProductivityPanel {
	'use strict';

	export class CallscriptStepDetailsManager {

		private context: Mscrm.ControlData<IInputBag>;
		private stateManager: StateManager;
		private telemetryContext: string;
		private telemetryLogger: TelemetryLogger;

		/**
		 * Constructor.
		 */
		constructor(context: Mscrm.ControlData<IInputBag>, stateManager: StateManager) {
			this.context = context;
			this.stateManager = stateManager;
			this.telemetryContext = TelemetryComponents.CallscriptStepListitemManager;
			this.telemetryLogger = new TelemetryLogger(this.context);
		}

		/**
		 * Onclick handler for button on step details
		 * @param step step whose button is clicked
		 * @param event Jquery event object 
		 */
		private handleActionButtonClick(step: CallScriptStep, event: JQueryEventObject): void {
			let methodName = "handleActionButtonClick";
			if (step.executionStatus != ExecutionStatus.Started) {

				let scripts = this.stateManager.callscriptsForCurrentSession;

				step.executionStatus = ExecutionStatus.Started;
				step.action.executeAction(this.stateManager).then(
					(response) => {
						step.executionStatus = ExecutionStatus.Completed;
						step.isExecuted = true;
						this.context.utils.requestRender();

						let eventParams = new EventParameters();
						eventParams.addParameter("stepId", step.id);
						eventParams.addParameter("message", "Step executed successfully");
						this.telemetryLogger.logSuccess(this.telemetryContext, methodName, eventParams);
					},
					(error) => {
						step.executionStatus = ExecutionStatus.Failed;
						this.context.utils.requestRender();

						let eventParams = new EventParameters();
						eventParams.addParameter("stepId", step.id);
						eventParams.addParameter("message", "Step execution failed");
						this.telemetryLogger.logError(this.telemetryContext, methodName, error, eventParams);
					});
			}
			this.context.utils.requestRender();
			event.stopPropagation();
		}

		/**
		 * Returns button for apply/retry option for step based on step execution status
		 * @param step step whose button is returned
		 */
		public getActionButton(step: CallScriptStep): Mscrm.Component {
			let buttonLabel: string;
			if (step.action.actionType === CallscriptActionType.TextAction) {
				buttonLabel = this.context.resources.getString(LocalizedStrings.TextActionLabel);
			}
			else if (step.action.actionType === CallscriptActionType.ReRouteAction) {
				buttonLabel = this.context.resources.getString(LocalizedStrings.RouteActionLabel);
			}
			else {
				buttonLabel = this.context.resources.getString(LocalizedStrings.NotExecutedStepButtonLabel); //default
				if (step.executionStatus === ExecutionStatus.Completed) {
					buttonLabel = this.context.resources.getString(LocalizedStrings.CompletedStepButtonLabel);
				}
				else if (step.executionStatus === ExecutionStatus.Failed) {
					buttonLabel = this.context.resources.getString(LocalizedStrings.FailedStepButtonLabel);
				}
				else if (step.executionStatus === ExecutionStatus.Started) {
					buttonLabel = this.context.resources.getString(LocalizedStrings.StartedStepButtonLabel);
				}
			}

			var isDisabled = (step.executionStatus === ExecutionStatus.Started);

			return this.context.factory.createElement("BUTTON", {
				key: "CallScriptStepExecuteBtn" + step.id + "-Key",
				id: "CallScriptStepExecuteBtn" + step.id + "-id",
				style: ControlStyle.getExecuteActionButtonStyle(step, this.context),
				title: buttonLabel,
				disabled: isDisabled,
				onClick: this.handleActionButtonClick.bind(this, step)
			}, buttonLabel);
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
			return this.context.factory.createElement("CONTAINER", {
				key: "CallScriptStepDescription-" + step.id + "-Key",
				id: "CallScriptStepDescription-" + step.id + "-Id",
				style: ControlStyle.getActionTextStyle(step.executionStatus, this.context)
			}, step.stepDescription);
		}

		/**
		 * Returns container with instruction of text action step - to be called only for text action step
		 * @param step step object whose description is contained in returned container
		 */
		private getTextInstructionContainer(step: CallScriptStep) {
			return this.context.factory.createElement("CONTAINER", {
				key: "CallScriptStepDescription-" + step.id + "-Key",
				id: "CallScriptStepDescription-" + step.id + "-Id",
				style: ControlStyle.getActionTextStyle(step.executionStatus, this.context)
			}, step.action.getResolvedTextInstruction());
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
			textActionDetailsComponents.push(this.getActionButton(step));

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
			macroAndRouteActionDetailsComponents.push(this.getActionButton(step));

			return macroAndRouteActionDetailsComponents;
		}

	}
}