/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/

/// <reference path="privatereferences.ts"/>

module MscrmControls.ProductivityPanel {
	'use strict';

	export class CallscriptStepsListManager {

		private context: Mscrm.ControlData<IInputBag>;
		private controlStyle: ControlStyle;
		private stepListitemManager: CallscriptStepListitemManager;

		/**
		 * Constructor.
		 */
		constructor(context: Mscrm.ControlData<IInputBag>, callscriptControl: CallscriptControl) {
			this.context = context;
			this.controlStyle = callscriptControl.controlStyle;
			this.stepListitemManager = callscriptControl.stepListitemManager;
		}

		/**
		 * Returns a container having list of steps in particular callscript
		 * @param currentScript script whose steps is returned
		 * @param controlStyle style class instance to get component styles
		 */
		public getStepsList(currentScript: CallScript, controlStyle: ControlStyle): Mscrm.Component {
			var listItems: Mscrm.Component[] = [];

			for (let step of currentScript.steps) {
				listItems.push(this.stepListitemManager.getStepListItemComponent(step));
			}

			var list = this.context.factory.createElement("LIST", {
				key: "CallscriptStepsListKey",
				id: "CallscriptStepsListId",
				role: "list",
				style: controlStyle.listStyle
			}, listItems);

			return this.context.factory.createElement("CONTAINER", {
				key: "CallscriptStepsListContainerKey",
				id: "CallscriptStepsListContainerId",
				style: controlStyle.listComponentStyle
			}, list);
		}
	}
}