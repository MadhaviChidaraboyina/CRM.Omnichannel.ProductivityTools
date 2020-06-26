/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/

/// <reference path="../privatereferences.ts"/>

module MscrmControls.CallscriptControl {
	'use strict';

	export class CallScript {
		// Attributes
		public id: string;
		public name: string;
		public description: string;
		public steps: CallScriptStep[];

		// Runtime attributes
		public isCurrent: boolean;
		public isStepsDataRetrieved: boolean;

		/**
		 * Constructor for Call script record
		 * @param id Id for call script
		 * @param name Name of the call script
		 * @param description Description of the call script
		 * @param isStepsDataRetrieved Is steps data retrieved
		 * @param steps Steps
		 */
		constructor(id: string, name: string, description: string, isStepsDataRetrieved: boolean, steps: CallScriptStep[]) {
			this.id = id;
			this.name = name;
			this.description = description;
			this.steps = steps;

			this.isStepsDataRetrieved = isStepsDataRetrieved;
			this.isCurrent = false;
		}
	}

	export class CallScriptStep {
		// Properties
		public id: string;
		public name: string;
		public order: number;
		public action: CallScriptAction;

		
		// Runtime attributes
		public isExecuted: boolean;
		public executionStatus: ExecutionStatus;
		public notStartedAccessibilityLabel: string;
		public startedAccessibilityLabel: string;
		public completedAccessibilityLabel: string;
		public failedAccessibilityLabel: string;
		public stepDescription: string;

		/**
		 * ToDO: Remove context object from constructor. Localized strings can be obtained from utility class.
		 */

		/**
		 * Constructor for call script step
		 * @param id id for the step
		 * @param name name of the step
		 * @param order order of the step
		 * @param stepDescription step description for the step
		 * @param action action for the step
		 * @param context control context
		 */
		constructor(id: string, name: string, order: number, stepDescription: string, action: CallScriptAction, context: Mscrm.ControlData<IInputBag>) {
			this.id = id;
			this.name = name;
			this.order = order;
			this.stepDescription = stepDescription;
			this.action = action;
			
			this.isExecuted = false;
			this.executionStatus = ExecutionStatus.NotStarted;
			this.initializeAccessibilityLabels(context);
		}

		private initializeAccessibilityLabels(context: Mscrm.ControlData<IInputBag>): void {
			var notStartedLocalizedLabel: string;
			var completedLocalizedLabel: string;
			var failedLocalizedLabel: string;

			switch (this.action.actionType) {
				case (CallscriptActionType.TextAction): {
					completedLocalizedLabel = context.resources.getString(LocalizedStrings.Accessibility_CompletedStepLabels[0]);
					failedLocalizedLabel = context.resources.getString(LocalizedStrings.Accessibility_FailedStepLabels[0]);
					notStartedLocalizedLabel = context.resources.getString(LocalizedStrings.Accessibility_NotStartedStepLabels[0]);
					break;
				}
				case (CallscriptActionType.MacroAction): {
					completedLocalizedLabel = context.resources.getString(LocalizedStrings.Accessibility_CompletedStepLabels[1]);
					failedLocalizedLabel = context.resources.getString(LocalizedStrings.Accessibility_FailedStepLabels[1]);
					notStartedLocalizedLabel = context.resources.getString(LocalizedStrings.Accessibility_NotStartedStepLabels[1]);
					break;
				}
				case (CallscriptActionType.ReRouteAction): {
					completedLocalizedLabel = context.resources.getString(LocalizedStrings.Accessibility_CompletedStepLabels[2]);
					failedLocalizedLabel = context.resources.getString(LocalizedStrings.Accessibility_FailedStepLabels[2]);
					notStartedLocalizedLabel = context.resources.getString(LocalizedStrings.Accessibility_NotStartedStepLabels[2]);
					break;
				}
				default: {
					break;
				}
			}

			this.notStartedAccessibilityLabel = StringHelper.Format(notStartedLocalizedLabel, this.name);
			this.startedAccessibilityLabel = context.resources.getString(LocalizedStrings.Accessibility_StartedStepLabel);
			this.completedAccessibilityLabel = StringHelper.Format(completedLocalizedLabel, this.name);
			this.failedAccessibilityLabel = StringHelper.Format(failedLocalizedLabel, this.name);
		}

		public getAccessibilityLabel() {
			if (this.executionStatus == ExecutionStatus.Started) {
				return this.startedAccessibilityLabel;
			}
			else if (this.executionStatus == ExecutionStatus.Completed) {
				return this.completedAccessibilityLabel;
			}
			else if (this.executionStatus == ExecutionStatus.Failed) {
				return this.failedAccessibilityLabel;
			}
			return this.notStartedAccessibilityLabel;
		}
	}
}