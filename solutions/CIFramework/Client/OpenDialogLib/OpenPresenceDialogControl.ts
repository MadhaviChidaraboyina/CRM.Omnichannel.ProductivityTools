/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/** @internal */

/// <reference path="../Constants.ts" />
/// <reference path="../../../../packages/Crm.ClientApiTypings.1.3.1937/clientapi/XrmClientApi.d.ts" />

namespace Microsoft.CIFramework.Internal {

	declare const Xrm: any;
	const emptyString: string = "";

	export class OpenPresenceDialogControl {

		private static instance: OpenPresenceDialogControl;

		// Empty Constructor
		constructor() { }
		
		public static get Instance(): OpenPresenceDialogControl {
			if (this.instance == null) {
				this.instance = new OpenPresenceDialogControl();
			}
			return this.instance;
		}

		public openPresenceDialog(e: any): void {
			if (!window.localStorage[Constants.CURRENT_PRESENCE_INFO]) {
				return;
			}
			const that = this;
			const dialogParams: XrmClientApi.DialogParameters = {};
			dialogParams[Constants.LAST_BUTTON_CLICKED] = "";
			const dialogOptions: XrmClientApi.DialogOptions = { width: 300, height: 300, position: XrmClientApi.Constants.WindowPosition.center };
			Xrm.Navigation.openDialog(Constants.SET_PRESENCE_MDD, dialogOptions, dialogParams).then(function (dialogParams: any) {
			});
		}

		public addPresenceCommand(e: any): any {
			var appUniqueName: any = "";
			return new Promise((resolve, reject) => {
				var globalContext = Xrm.Utility.getGlobalContext();
				globalContext.getCurrentAppProperties().then(
					(response: any) => {
						appUniqueName = response.uniqueName;
						if (appUniqueName === "OmniChannelEngagementHub") {
							window.localStorage[Constants.CURRENT_PRESENCE_INFO] = emptyString;
							resolve(true);
						} else {
							resolve(false);
						}
					});
			});
		}
	}
}