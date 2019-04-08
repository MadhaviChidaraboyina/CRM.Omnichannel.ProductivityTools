/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/** @internal */

/// <reference path="../../Client/Constants.ts" />
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

        public openPresenceDialog(e: any): any {
            const that = this;
            const dialogParams: XrmClientApi.DialogParameters = {};
            dialogParams[Constants.LAST_BUTTON_CLICKED] = "";
            const dialogOptions: XrmClientApi.DialogOptions = { width: 300, height: 300, position: XrmClientApi.Constants.WindowPosition.center };
            Xrm.Navigation.openDialog(Constants.SET_PRESENCE_MDD, dialogOptions, dialogParams).then(function (dialogParams: any) {
                /*if (dialogParams.parameters[Constants.LAST_BUTTON_CLICKED] === Constants.OK_BUTTON_ID) {
                    that.raiseSetPresenceFromDialog(dialogParams.parameters[Constants.PRESENCE_SELECTED_VALUE]);
                }*/
            });
        }
    }
}