/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/

/// <reference path="privatereferences.ts"/>

module MscrmControls.ProductivityPanel {
	'use strict';

	export class CallscriptStepsListManager {

		private context: Mscrm.ControlData<IInputBag>;
		private stepListitemManager: CallscriptStepListitemManager;

		/**
		 * Constructor.
		 */
		constructor(context: Mscrm.ControlData<IInputBag>, stepListitemManager: CallscriptStepListitemManager) {
			this.context = context;
			this.stepListitemManager = stepListitemManager;
		}

		/**
		 * Returns a container having list of steps in particular callscript
		 * @param currentScript script whose steps is returned
		 * @param controlStyle style class instance to get component styles
		 */
		public getStepsList(currentScript: CallScript): Mscrm.Component {
			var listItems: Mscrm.Component[] = [];

			for (let step of currentScript.steps) {
				listItems.push(this.stepListitemManager.getStepListItemComponent(step));
			}

			var list = this.context.factory.createElement("LIST", {
				key: "CallscriptStepsListKey",
				id: "CallscriptStepsListId",
				role: "list",
				style: ControlStyle.getListStyle()
			}, listItems);

			return this.context.factory.createElement("CONTAINER", {
				key: "CallscriptStepsListContainerKey",
				id: "CallscriptStepsListContainerId",
				style: ControlStyle.getListComponentStyle()
			}, list);
		}
	}
}