/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/

/// <reference path="../privatereferences.ts"/>

module MscrmControls.ProductivityPanel {
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
		public executedAccessibilityLabel: string;
		public notExecutedAccessibilityLabel: string;
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
			var executedLocalizedLabel: string;
			var notExecutedLocalizedLabel: string;

			switch (this.action.actionType) {
				case (CallscriptActionType.TextAction): {
					executedLocalizedLabel = context.resources.getString(LocalizedStrings.Accessibility_ExecutedTextStepIndicator);
					notExecutedLocalizedLabel = context.resources.getString(LocalizedStrings.Accessibility_UnexecutedTextStepIndicator);
					break;
				}
				case (CallscriptActionType.MacroAction): {
					executedLocalizedLabel = context.resources.getString(LocalizedStrings.Accessibility_ExecutedMacroStepIndicator);
					notExecutedLocalizedLabel = context.resources.getString(LocalizedStrings.Accessibility_UnexecutedMacroStepIndicator);
					break;
				}
				case (CallscriptActionType.ReRouteAction): {
					executedLocalizedLabel = context.resources.getString(LocalizedStrings.Accessibility_ExecutedRouteStepIndicator);
					notExecutedLocalizedLabel = context.resources.getString(LocalizedStrings.Accessibility_UnexecutedRouteStepIndicator);
					break;
				}
				default: {
					break;
				}
			}

			this.executedAccessibilityLabel = StringHelper.Format(executedLocalizedLabel, this.name);
			this.notExecutedAccessibilityLabel = StringHelper.Format(notExecutedLocalizedLabel, this.name);
		}

		public getAccessibilityLabel() {
			if (this.isExecuted) {
				return this.executedAccessibilityLabel;
			}
			else {
				return this.notExecutedAccessibilityLabel;
			}
		}
	}
}