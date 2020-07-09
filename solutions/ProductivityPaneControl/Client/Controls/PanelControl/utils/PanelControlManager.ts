/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/
/// <reference path="../CommonReferences.ts"/>

module MscrmControls.ProductivityToolPanel {
	export class PanelControlManager {
		public static toggleSidePanelControl(toggleValue: number): void {

			let windowObject = this.getWindowObject();

			//Loading pane in try catch till we get the API from platform
			try {
				windowObject.Xrm.App.panels.getPanel("sidePanel-1").state = toggleValue;
			} catch (e) {
				windowObject.Xrm.App.panels.getPanel("sidePanel-0").state = toggleValue;
			}
		}

		public static getWindowObject(): any
		{
			return window.top;
		}
	}
}
