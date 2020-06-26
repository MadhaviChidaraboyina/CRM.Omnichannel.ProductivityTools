/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/
/// <reference path="../CommonReferences.ts"/>

module MscrmControls.PanelControl {
	export class PanelControlManager {
		public static toggleSidePanelControl(toggleValue: number): void {

            let windowObject = this.getWindowObject();
            const sidePanelId = sessionStorage.getItem(SessionStorageKeyConstants.sidePaneKey);

            if (!Utils.isNullOrUndefined(sidePanelId)) {
                windowObject.Xrm.App.panels.getPanel(sidePanelId).state = toggleValue;
            }
		}

		public static getWindowObject(): any
		{
			return window.top;
		}
	}
}
