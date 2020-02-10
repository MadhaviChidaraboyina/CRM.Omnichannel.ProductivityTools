/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/
/// <reference path="../CommonReferences.ts"/>

module MscrmControls.ProductivityToolPanel {
	export class PanelControlManager {
		public static toggleSidePanelControl(toggleValue: number): void {

			let windowObject = this.getWindowObject();
			windowObject.Xrm.App.panels.getPanel("sidePanel-1").state = toggleValue;
		}

		public static getWindowObject(): any
		{
			return window.top;
		}
	}
}
