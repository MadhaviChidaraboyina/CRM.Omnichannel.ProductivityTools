/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/

/// <reference path="privatereferences.ts"/>

module MscrmControls.ProductivityPanel {
	'use strict';

	export class CallscriptStepListitemManager {

		private context: Mscrm.ControlData<IInputBag>;
		private controlStyle: ControlStyle;
		private stateManager: StateManager;
		public expandedStepId: string;
		private stepDetailsManager: CallscriptStepDetailsManager;
		private cifUtil: CIFUtil;

		/**
		 * Constructor.
		 */
		constructor(context: Mscrm.ControlData<IInputBag>, callscriptControl: CallscriptControl) {
			this.context = context;
			this.expandedStepId = "";
			this.controlStyle = callscriptControl.controlStyle;
			this.stateManager = callscriptControl.stateManager;
			this.stepDetailsManager = callscriptControl.stepDetailsManager;
			this.cifUtil = callscriptControl.cifUtil;
		}

		/**
		 * This function is called when step list item is clicked
		 * @param stepToExecute the step whose list item was clicked
		 */
		public handleStepListItemClick(stepToExpand: CallScriptStep) {
			let isExpandedStep = (stepToExpand.id === this.expandedStepId);
			if (isExpandedStep) {
				this.expandedStepId = "";
			}
			else {
				this.cifUtil.resolveReplaceableParameters(stepToExpand.action.configuredDisplayText).then(
					(resolvedDisplayText) => {
						stepToExpand.action.resolvedDisplayText = resolvedDisplayText;
						this.context.utils.requestRender();
					},
					(error) => {
						//Handle replacement parameters resolving error
					}
				);
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
				style: this.controlStyle.getStepActionContainerStyle(isExpandedStep, step.executionStatus)
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

			var checkBoxIcon = this.context.factory.createElement("TEXT", {
				key: "CallScriptCheckboxIcon-" + step.id + "-Key",
				id: "CallScriptCheckboxIcon-" + step.id + "-Id",
				style: this.controlStyle.getCheckboxIconStyle(step.executionStatus)
			}, []);

			var stepLabel = this.context.factory.createElement("TEXT", {
				key: "CallScriptStepLabel-" + step.id + "-Key",
				id: "CallScriptStepLabel-" + step.id + "-Id",
				style: this.controlStyle.getStepLabelStyle()
			}, step.displayName);

			var actionTypeIcon = this.context.factory.createElement("TEXT", {
				key: "CallScriptActionTypeIcon-" + step.id + "-Key",
				id: "CallScriptActionTypeIcon-" + step.id + "-Id",
				style: this.controlStyle.getActionTypeIconStyle(step.action.actionType)
			}, []);

			var actionTypeIconContainer = this.context.factory.createElement("CONTAINER", {
				key: "CallScriptActionTypeIconContainer-" + step.id + "-Key",
				id: "CallScriptActionTypeIconContainer-" + step.id + "-Id",
				className: "actionTypeIconClass",
				style: this.controlStyle.getActionTypeIconContainerStyle(isExpandedStep)
			}, actionTypeIcon);

			return this.context.factory.createElement("CONTAINER", {
				key: "CallScriptCheckboxRow-" + step.id + "-key",
				id: "CallScriptCheckboxRow-" + step.id + "-id",
				style: { display: "flex", flexDirection: "row" }
			}, [checkBoxIcon, stepLabel, actionTypeIconContainer]);
		}

		public getStepListItemComponent(step: CallScriptStep): Mscrm.Component {
			let isExpandedStep = (step.id === this.expandedStepId);

			return this.context.factory.createElement("LISTITEM", {
				key: "CallscriptStepsListItem-" + step.id + "-Key",
				id: "CallscriptStepsListItem-" + step.id + "-Id",
				style: this.controlStyle.getListItemStyle(isExpandedStep, step.executionStatus),
				tabIndex: 0,
				onClick: this.handleStepListItemClick.bind(this, step),
				onKeyDown: this.handleStepListItemKeyDown.bind(this, step),
				accessibilityLabel: step.getAccessibilityLabel()
			}, [this.getStepHeaderContainer(step), this.getStepDetailsContainer(step)]);
		}
	}
}