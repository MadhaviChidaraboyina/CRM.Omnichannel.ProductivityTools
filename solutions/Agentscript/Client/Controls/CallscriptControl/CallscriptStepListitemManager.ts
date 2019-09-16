/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/

/// <reference path="privatereferences.ts"/>

module MscrmControls.ProductivityPanel {
	'use strict';

	export class CallscriptStepListitemManager {

		private context: Mscrm.ControlData<IInputBag>;
		private stateManager: StateManager;
		public expandedStepId: string;
		private stepDetailsManager: CallscriptStepDetailsManager;
		private cifUtil: CIFUtil;
		private telemetryContext: string;
		private telemetryLogger: TelemetryLogger;

		/**
		 * Constructor.
		 */
		constructor(context: Mscrm.ControlData<IInputBag>, stateManager: StateManager, stepDetailsManager: CallscriptStepDetailsManager) {
			this.context = context;
			this.expandedStepId = Constants.EmptyString;
			this.stateManager = stateManager;
			this.stepDetailsManager = stepDetailsManager;
			this.cifUtil = new CIFUtil(this.context);
			this.telemetryContext = TelemetryComponents.CallscriptStepListitemManager;
			this.telemetryLogger = new TelemetryLogger(this.context);
		}

		/**
		 * This function is called when step list item is clicked
		 * @param stepToExecute the step whose list item was clicked
		 */
		public handleStepListItemClick(stepToExpand: CallScriptStep) {
			let methodName = "handleStepListItemClick";
			let isExpandedStep = (stepToExpand.id === this.expandedStepId);
			if (isExpandedStep) {
				this.expandedStepId = Constants.EmptyString;
			}
			else {
				if (stepToExpand.action.actionType === CallscriptActionType.TextAction) {
					stepToExpand.action.resolveInstructionText(this.cifUtil).then(
						(resolvedInstructionText) => {
							stepToExpand.action.setResolvedInstructionText(resolvedInstructionText);
							this.context.utils.requestRender();
						},
						(error) => {
							let eventParams = new EventParameters();
							eventParams.addParameter("stepId", stepToExpand.id);
							eventParams.addParameter("message", "Error in resolving text instruction for text step");
							this.telemetryLogger.logError(this.telemetryContext, methodName, error, eventParams);
						}
					);
				}
				this.expandedStepId = stepToExpand.id;
			}
			this.context.utils.requestRender();
		}

		/**
		 * This function is called when a key is pressed on step list item
		 * @param step step on which key is pressed
		 * @param event JQuery event containing details of pressed key
		 */
		private handleStepListItemKeyDown(step: CallScriptStep, event: JQueryEventObject) {
			if (event.keyCode === KeyCodes.ENTER_KEY) {
				this.handleStepListItemClick(step);
			}
		}

		/**
		 * Returns container for step list item expanded view
		 * @param step
		 * @param controlStyle
		 */
		private getStepDetailsContainer(step: CallScriptStep): Mscrm.Component {
			let isExpandedStep = (step.id === this.expandedStepId);

			let stepDetailsComponents: Mscrm.Component[];

			if (step.action.actionType === CallscriptActionType.TextAction) {
				stepDetailsComponents = this.stepDetailsManager.getTextActionDetailsComponents(step);
			}
			else if (step.action.actionType === CallscriptActionType.MacroAction || step.action.actionType === CallscriptActionType.ReRouteAction) {
				stepDetailsComponents = this.stepDetailsManager.getMacroAndRouteActionDetailsComponents(step);
			}

			return this.context.factory.createElement("CONTAINER", {
				key: "CallScriptTextActionContainer-" + step.id + "-Key",
				id: "CallScriptTextActionContainer-" + step.id + "-Id",
				style: ControlStyle.getStepActionContainerStyle(isExpandedStep, step.executionStatus)
			}, stepDetailsComponents);
		}

		/**
		 * Returns container having components for one list item for callscript step
		 * @param step step whose list item is returned
		 * @param this.controlStyle style class instance to get component styles
		 */
		private getStepHeaderContainer(step: CallScriptStep): Mscrm.Component {
			let isExpandedStep = (step.id === this.expandedStepId);
			var listItemBlock: Mscrm.Component[] = []

			var arrowIcon = this.context.factory.createElement("TEXT", {
				key: "CallScriptArrowIcon-" + step.id + "-Key",
				id: "CallScriptArrowIcon-" + step.id + "-Id",
				style: ControlStyle.getArrowIconStyle(this.context, isExpandedStep)
			}, []);

			var actionTypeIcon = this.context.factory.createElement("TEXT", {
				key: "CallScriptActionTypeIcon-" + step.id + "-Key",
				id: "CallScriptActionTypeIcon-" + step.id + "-Id",
				style: ControlStyle.getActionTypeIconStyle(step.action.actionType, this.context)
			}, []);

			var stepLabel = this.context.factory.createElement("TEXT", {
				key: "CallScriptStepLabel-" + step.id + "-Key",
				id: "CallScriptStepLabel-" + step.id + "-Id",
				style: ControlStyle.getStepLabelStyle(step.executionStatus, this.context)
			}, step.name);

			var checkBoxIcon = this.context.factory.createElement("TEXT", {
				key: "CallScriptCheckboxIcon-" + step.id + "-Key",
				id: "CallScriptCheckboxIcon-" + step.id + "-Id",
				style: ControlStyle.getCheckboxIconStyle(step.executionStatus, this.context)
			}, []);

			return this.context.factory.createElement("CONTAINER", {
				key: "CallScriptCheckboxRow-" + step.id + "-key",
				id: "CallScriptCheckboxRow-" + step.id + "-id",
				style: { display: "flex", flexDirection: "row" }
			}, [arrowIcon, actionTypeIcon, stepLabel, checkBoxIcon]);
		}

		public getStepListItemComponent(step: CallScriptStep): Mscrm.Component {
			let isExpandedStep = (step.id === this.expandedStepId);

			return this.context.factory.createElement("LISTITEM", {
				key: "CallscriptStepsListItem-" + step.id + "-Key",
				id: "CallscriptStepsListItem-" + step.id + "-Id",
				style: ControlStyle.getListItemStyle(isExpandedStep, step.executionStatus),
				tabIndex: 0,
				onClick: this.handleStepListItemClick.bind(this, step),
				onKeyDown: this.handleStepListItemKeyDown.bind(this, step),
				accessibilityLabel: step.getAccessibilityLabel()
			}, [this.getStepHeaderContainer(step), this.getStepDetailsContainer(step)]);
		}
	}
}