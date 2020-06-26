/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/

/// <reference path="privatereferences.ts"/>

module MscrmControls.CallscriptControl {
	'use strict';

	export class CallscriptStepListitemManager {

		private context: Mscrm.ControlData<IInputBag>;
		private stateManager: StateManager;
		public expandedStepId: string;
		private stepDetailsManager: CallscriptStepDetailsManager;
        private cifUtil: CIFUtil;
        private macroUtil: MacroUtil;
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
            this.macroUtil = new MacroUtil(this.context);
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
                if (stepToExpand.action.actionType === CallscriptActionType.TextAction || stepToExpand.action.actionType === CallscriptActionType.MacroAction) {
                    stepToExpand.action.resolveInstructionText(this.macroUtil).then(
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
		private handleStepListItemKeyDown(step: CallScriptStep, currentStepIndex: number, prevStepId: string,
			nextStepId: string, event: JQueryEventObject) {

			switch (event.keyCode) {
				case Mscrm.KeyCode.Enter:
					this.handleStepListItemClick(step);
					break;

				case Mscrm.KeyCode.UpArrow:
					event.preventDefault();
					this.moveUp(currentStepIndex, step.id, prevStepId, nextStepId);
					break;

				case Mscrm.KeyCode.DownArrow:
					event.preventDefault();
					this.moveDown(currentStepIndex, step.id, prevStepId, nextStepId);
					break;
			}
		}

		/**
		 * Move to previous step in agent script
		 * @param currentStepIndex current step index
		 * @param currStepId current step id
		 * @param prevStepId previous step id
		 * @param nextStepId next step id
		 */
		private moveUp(currentStepIndex: number, currStepId: string, prevStepId: string, nextStepId: string) {
			if (currentStepIndex == 0 || this.context.utils.isNullOrEmptyString(prevStepId)) {
				// No action for first step
				return;
			}

			// Get previous step details
			let prevStepElementId = this.getElementIdForStepId(prevStepId);
			let prevStepDomElement = this.getDomElementForId(prevStepElementId)
			let prevStepActionElementId = this.getActionButtonIdForStepId(prevStepId);
			let prevStepActionDomElement = this.getDomElementForId(prevStepActionElementId);

			this.moveFocus(currStepId, prevStepElementId, prevStepDomElement, prevStepActionDomElement, "moveUp");
		}

		/**
		 * Moves to next step in aget script
		 * @param currentStepIndex current step index
		 * @param currStepId current step id
		 * @param prevStepId previous step id
		 * @param nextStepId next step id
		 */
		private moveDown(currentStepIndex: number, currStepId: string, prevStepId: string, nextStepId: string) {
			if (this.context.utils.isNullOrEmptyString(nextStepId)) {
				// No action for last step
				return;
			}

			// Get next step details
			let nextStepElementId = this.getElementIdForStepId(nextStepId);
			let nextStepDomElement = this.getDomElementForId(nextStepElementId);
			let nextStepActionElementId = this.getActionButtonIdForStepId(nextStepId);
			let nextStepActionDomElement = this.getDomElementForId(nextStepActionElementId);

			this.moveFocus(currStepId, nextStepElementId, nextStepDomElement, nextStepActionDomElement, "moveDown");
		}

		/**
		 * Move focus to new element in list item (Move up and Move down scenario)
		 * @param currStepId current step id
		 * @param newStepElementId new step element id
		 * @param newStepDomElement new step DOM element
		 * @param newStepActionDomElement new step Action button element
		 * @param scenario scenario
		 */
		private moveFocus(currStepId: string, newStepElementId: string, newStepDomElement: HTMLElement,
			newStepActionDomElement: HTMLElement, scenario: string) {

			// Current steps details
			let currStepElementId = this.getElementIdForStepId(currStepId);
			let currStepDomElement = this.getDomElementForId(currStepElementId);
			let currStepActionElementId = this.getActionButtonIdForStepId(currStepId);
			let currStepActionDomElement = this.getDomElementForId(currStepActionElementId);


			try {
				// Adjust tab index
				newStepDomElement.tabIndex = 0;

				if (!this.context.utils.isNullOrUndefined(newStepActionDomElement)) {
					newStepActionDomElement.tabIndex = 0;
				}
				
				currStepDomElement.tabIndex = -1;

				if (!this.context.utils.isNullOrUndefined(currStepActionDomElement)) {
					currStepActionDomElement.tabIndex = -1;
				}

				// Set focus
				this.context.accessibility.focusElementById(newStepElementId);

			} catch (error) {
				let errorMessage = "Error in handling accessibility keys";
				let errorParam = new EventParameters();
				errorParam.addParameter("scenario", scenario);
				errorParam.addParameter("stepId", currStepId);
				this.telemetryLogger.logError(this.telemetryContext, AccessibilityComponents.KeyHandler, errorMessage, errorParam);
			}
		}

		/**
		 * Get dom element for id
		 * @param elementId element id
		 */
		private getDomElementForId(elementId: string): HTMLElement {
			let elementAbsoluteId = this.context.accessibility.getUniqueId(elementId);
			let domElement = document.getElementById(elementAbsoluteId);
			return domElement;
		}

		/**
		 * Returns dom element id for step id
		 * @param stepId
		 */
		private getElementIdForStepId(stepId: string): string {
			return Constants.stepIdPrefix + stepId + Constants.idSuffix;
		}

		/**
		 * Returns action button id for step id
		 * @param stepId
		 */
		private getActionButtonIdForStepId(stepId: string): string {
			return Constants.stepActionIdPrefix + stepId + Constants.idSuffix;
		}

		/**
		 * onclick handler for expanded step details container
		 * @param stepToExpand step object whose expanded container was clicked
		 * @param event mouse click jquery event
		 */
		private preventClickPropagationOnTextSelection(stepToExpand: CallScriptStep, event: JQueryEventObject) {
			//Don't collapse if some text was selected through this click
			let selectedTextOnWindowLength: number = window.getSelection().toString().length;
			if (selectedTextOnWindowLength > 0) {
				event.stopPropagation();
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
				onClick: this.preventClickPropagationOnTextSelection.bind(this, step),
				style: ControlStyle.getStepActionContainerStyle(isExpandedStep, step.executionStatus)
			}, stepDetailsComponents);
		}

		/**
		 * Returns CSS class name for accordion arrow icon
		 * @param isExpandedStep true if current step is expanded
		 */
		public getAccordionIconClassName(isExpandedStep: boolean) {
			if (isExpandedStep) {
				return Constants.AccordionDownArrowClassName;
			}
			else {
				return Constants.AccordionRightArrowClassName;
			}
		}

		/**
		 * Returns CSS class name for run action icon
		 * @param step object of step for which icon is rendered
		 */
		public getActionTypeIconClassName(step: CallScriptStep): string {
			let actionTypeIconClassName: string;
			if (step.action.actionType == CallscriptActionType.MacroAction) {
				actionTypeIconClassName = Constants.MacroActionIconClassName;
			}
			if (step.action.actionType == CallscriptActionType.ReRouteAction) {
				actionTypeIconClassName = Constants.RouteActionIconClassName;
			}
			if (step.action.actionType == CallscriptActionType.TextAction) {
				actionTypeIconClassName = Constants.TextActionIconClassName;
			}
			return actionTypeIconClassName;
		}

		/**
		 * Returns container having components for one list item for callscript step
		 * @param step step whose list item is returned
		 * @param tabIndexValue tab index value for elements in the header
		 */
		private getStepHeaderContainer(step: CallScriptStep, tabIndexValue: number): Mscrm.Component {
			let isExpandedStep = (step.id === this.expandedStepId);
			var listItemBlock: Mscrm.Component[] = [];

			var arrowIcon = this.context.factory.createElement("Container", {
				key: "CallScriptArrowIcon-" + step.id + "-Key",
				id: "CallScriptArrowIcon-" + step.id + "-Id",
				style: ControlStyle.getArrowIconStyle(this.context, isExpandedStep),
				className: this.getAccordionIconClassName(isExpandedStep),
				accessibilityHidden: true
			}, []);

			var stepLabelComponents = [];
			if (step.isExecuted || step.executionStatus === ExecutionStatus.Failed) {
				var stepExecutionStatusIcon = this.context.factory.createElement("CONTAINER", {
					key: "CallscriptStepExecutionIcon" + step.id + "-key",
					id: "CallscriptStepExecutionIcon" + step.id + "-id",
					style: ControlStyle.getStepExecutionStatusIconStyle(this.context, step.executionStatus),
					className: (step.executionStatus == ExecutionStatus.Failed) ? Constants.FailedStepIconClassName : Constants.CompletedStepIconClassName,
					accessibilityHidden: true
				}, []);
				stepLabelComponents.push(stepExecutionStatusIcon);
			}
			stepLabelComponents.push(step.name);
			var stepLabelContainer = this.context.factory.createElement("CONTAINER", {
				key: "CallScriptStepLabelContainer-" + step.id + "-Key",
				id: "CallScriptStepLabelContainer-" + step.id + "-Id",
				style: ControlStyle.getStepLabelStyle(step, this.context)
			}, stepLabelComponents);

			var runActionIcon = this.context.factory.createElement("CONTAINER", {
				key: "CallScriptRunActionIcon-" + step.id + "-Key",
				id: "CallScriptRunActionIcon-" + step.id + "-Id",
				title: this.stepDetailsManager.getActionButtonLabel(step),
				style: ControlStyle.getRunActionIconStyle(),
				className: this.getActionTypeIconClassName(step),
				onClick: this.stepDetailsManager.getActionButtonClickHandler(step),
				onKeyDown: this.stepDetailsManager.getActionButtonKeyDownHandler(step),
				tabIndex: tabIndexValue,
				role: "button"
			}, []);

			var stepInProgressIcon = this.context.factory.createElement("CONTAINER", {
				key: "CallScriptStepProgressIcon-" + step.id + "-Key",
				id: "CallScriptStepProgressIcon-" + step.id + "-Id",
				style: ControlStyle.getProgressIconStyle(this.context)
			}, []);

			let stepListItemComponents: Mscrm.Component[] = [arrowIcon, stepLabelContainer];
			if (step.executionStatus === ExecutionStatus.Started) {
				stepListItemComponents.push(stepInProgressIcon);
			}
			else {
				stepListItemComponents.push(runActionIcon);
			}

			return this.context.factory.createElement("CONTAINER", {
				key: "CallScriptCheckboxRow-" + step.id + "-key",
				id: "CallScriptCheckboxRow-" + step.id + "-id",
				style: { display: "flex", flexDirection: "row" }
			}, stepListItemComponents);
		}

		/**
		 * Get list item in agent script list
		 * @param step current step
		 * @param currentStepIndex current step index
		 * @param prevStepId previous step id
		 * @param nextStepId next step id
		 */
		public getStepListItemComponent(step: CallScriptStep, currentStepIndex: number, prevStepId: string, nextStepId: string): Mscrm.Component {
			let isExpandedStep = (step.id === this.expandedStepId);
			let tabIndexValue = (currentStepIndex == 0) ? 0 : -1;

			return this.context.factory.createElement("LISTITEM", {
				key: "CallscriptStepsListItem-" + step.id + "-Key",
				id: "CallscriptStepsListItem-" + step.id + "-Id",
				style: ControlStyle.getListItemStyle(this.context.client.isRTL, isExpandedStep, step.executionStatus),
				tabIndex: tabIndexValue,
				onClick: this.handleStepListItemClick.bind(this, step),
				onKeyDown: this.handleStepListItemKeyDown.bind(this, step, currentStepIndex, prevStepId, nextStepId),
				accessibilityLabel: step.getAccessibilityLabel(),
				accessibilityExpanded: isExpandedStep
			}, [this.getStepHeaderContainer(step, tabIndexValue), this.getStepDetailsContainer(step)]);
		}
	}
}