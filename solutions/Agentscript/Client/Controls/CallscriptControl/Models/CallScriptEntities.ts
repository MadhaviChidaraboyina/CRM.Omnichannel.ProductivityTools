/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/

/// <reference path="../privatereferences.ts"/>

module MscrmControls.ProductivityPanel {
	'use strict';

	export class CallScript {
		public id: string;
		public name: string;
		public displayName: string;
		public instructionText: string;
		public steps: CallScriptStep[];

		// Runtime attribute
		public isCurrent: boolean;

		constructor(id: string, name: string, displayName: string, instructionText: string, steps: CallScriptStep[]) {
			this.id = id;
			this.name = name;
			this.displayName = displayName;
			this.instructionText = instructionText;
			this.steps = steps;

			this.isCurrent = false;
		}
	}

	export class CallScriptStep {
		public id: string;
		public name: string;
		public displayName: string;
		public order: number;
		public action: CallScriptAction;
		public executedAccessibilityLabel: string;
		public notExecutedAccessibilityLabel: string;

		// Runtime attributes
		public isExecuted: boolean;
		public executionStatus: ExecutionStatus;

		constructor(id: string, name: string, displayName: string, order: number, action: CallScriptAction, context: Mscrm.ControlData<IInputBag>) {
			this.id = id;
			this.name = name;
			this.displayName = displayName;
			this.order = order;
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

			this.executedAccessibilityLabel = MscrmCommon.ControlUtils.String.Format(executedLocalizedLabel, this.displayName);
			this.notExecutedAccessibilityLabel = MscrmCommon.ControlUtils.String.Format(notExecutedLocalizedLabel, this.displayName);
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