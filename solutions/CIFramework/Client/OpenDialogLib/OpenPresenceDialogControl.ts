/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/** @internal */

/// <reference path="../Constants.ts" />
/// <reference path="../../../../packages/Crm.ClientApiTypings.1.0.2611-manual/clientapi/XrmClientApi.d.ts" />

namespace Microsoft.CIFramework.Internal {

	declare const Xrm: any;

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
			let presenceButton = (<HTMLButtonElement>window.top.document.querySelector(Constants.PRESENCE_BUTTON_DATA_ID));
			let presence_img = presenceButton.getElementsByTagName("img");
			if (presence_img[0].src.indexOf("/WebResources/msdyn_UnknownStatus.svg") != -1) {
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
							resolve(true);
						} else {
							resolve(false);
						}
					});
			});
		}
	}
}