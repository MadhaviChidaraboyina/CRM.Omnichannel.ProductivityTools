/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/

/// <reference path="privatereferences.ts"/>

module MscrmControls.ProductivityPanel {
	'use strict';

	export class CallscriptStepDetailsManager {

		private context: Mscrm.ControlData<IInputBag>;
		private stateManager: StateManager;
		private controlStyle: ControlStyle;

		/**
		 * Constructor.
		 */
		constructor(context: Mscrm.ControlData<IInputBag>, callscriptControl: CallscriptControl) {
			this.context = context;
			this.controlStyle = callscriptControl.controlStyle;
			this.stateManager = callscriptControl.stateManager;
		}

		/**
		 * Onclick handler for button on step details
		 * @param step step whose button is clicked
		 * @param event Jquery event object 
		 */
		private handleActionButtonClick(step: CallScriptStep, event: JQueryEventObject): void {
			if (step.executionStatus != ExecutionStatus.Started) {

				let sessionid = this.stateManager.currentUciSessionId;
				let scripts = this.stateManager.callscriptsForCurrentSession;

				step.executionStatus = ExecutionStatus.Started;
				step.action.executeAction().then(
					(response) => {
						step.executionStatus = ExecutionStatus.Completed;
						step.isExecuted = true;
						this.stateManager.updateSessionState(sessionid, scripts);
						this.context.utils.requestRender();
					},
					(error) => {
						step.executionStatus = ExecutionStatus.Failed;
						this.stateManager.updateSessionState(sessionid, scripts);
						this.context.utils.requestRender();
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
			//change based on step execution status
			let actionTypeIconUrl: string;
			let labelText: string;
			if (step.executionStatus === ExecutionStatus.Failed) {
				actionTypeIconUrl = Utility.getIconUrl(this.context, Constants.retryBtnIcon);
				labelText = "Retry";
			}
			else {
				actionTypeIconUrl = Utility.getIconUrl(this.context, Constants.executeBtnIcon);
				labelText = "Apply";
			}

			var buttonIcon = this.context.factory.createElement("TEXT", {
				key: "CallScriptStepExecuteBtnIcon-" + step.id + "-Key",
				id: "CallScriptStepExecuteBtnIcon-" + step.id + "-Id",
				style: this.controlStyle.getExecuteActionBtnIconStyle(actionTypeIconUrl)
			}, []);

			var buttonLabel = this.context.factory.createElement("TEXT", {
				key: "CallScriptStepExecuteBtnLabel-" + step.id + "-Key",
				id: "CallScriptStepExecuteBtnLabel-" + step.id + "-Id",
				style: this.controlStyle.executeActionBtnLabelStyle
			}, labelText);

			return this.context.factory.createElement("BUTTON", {
				key: "CallScriptStepExecuteBtn" + step.id + "-Key",
				id: "CallScriptStepExecuteBtn" + step.id + "-id",
				style: this.controlStyle.executeActionButtonStyle,
				onClick: this.handleActionButtonClick.bind(this, step)
			}, [buttonIcon, buttonLabel]);
		}

		/**
		 * Returns container containing error component for failed step
		 * @param step object of failed step whose error is returned
		 */
		private getErrorContainer(step: CallScriptStep): Mscrm.Component {
			var errorText = this.context.factory.createElement("TEXT", {
				key: "CallScriptStepError-" + step.id + "-Key",
				id: "CallScriptStepError-" + step.id + "-Id",
				style: this.controlStyle.actionErrorTextStyle
			}, step.action.getErrorText());

			return this.context.factory.createElement("CONTAINER", {
				key: "CallScriptStepErrorContainer-" + step.id + "-Key",
				id: "CallScriptStepErrorContainer-" + step.id + "-Id",
				style: { display: "flex" }
			}, errorText);
		}

		/**
		 * Returns container with description of step
		 * @param step step object whose description is contained in returned container
		 */
		private getStepDescriptionContainer(step: CallScriptStep) {
			// This will be changed to return step descrption as per updated UX specs
			return this.context.factory.createElement("TEXT", {
				key: "CallScriptStepDescription-" + step.id + "-Key",
				id: "CallScriptStepDescription-" + step.id + "-Id",
				style: this.controlStyle.actionTextStyle
			}, step.action.getDisplayText());
		}

		/**
		 * Returns container with instruction of text action step - to be called only for text action step
		 * @param step step object whose description is contained in returned container
		 */
		private getTextInstructionContainer(step: CallScriptStep) {
			return this.context.factory.createElement("TEXT", {
				key: "CallScriptStepDescription-" + step.id + "-Key",
				id: "CallScriptStepDescription-" + step.id + "-Id",
				style: this.controlStyle.actionTextStyle
			}, step.action.getDisplayText());
		}

		/**
		 * Returns container with details of text action step - to be called only for text action step
		 * @param step step object whose expanded container is returned
		 */
		public getTextActionDetailsComponents(step: CallScriptStep): Mscrm.Component[] {
			let textActionDetailsComponents: Mscrm.Component[] = [];

			textActionDetailsComponents.push(this.getTextInstructionContainer(step));
			if (step.executionStatus === ExecutionStatus.Failed) {
				textActionDetailsComponents.push(this.getErrorContainer(step));
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
				macroAndRouteActionDetailsComponents.push(this.getErrorContainer(step));
			}
			macroAndRouteActionDetailsComponents.push(this.getActionButton(step));

			return macroAndRouteActionDetailsComponents;
		}

	}
}