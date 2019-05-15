/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/** @internal */

/// <reference path="../Constants.ts" />

namespace Microsoft.CIFramework.Internal {

	declare const Xrm: any;

	export class PresenceDialogControl {

		private static instance: PresenceDialogControl;

		// Empty Constructor
		constructor() { }

		public static get Instance(): PresenceDialogControl {
			if (this.instance == null) {
				this.instance = new PresenceDialogControl();
			}
			return this.instance;
		}

		/**
		 * utility func to check whether an object is null or undefined
		 */
		/** @internal */
		public isNullOrUndefined(obj: any) {
			return (obj == null || typeof obj === "undefined");
		}

		public openPresenceDialogonLoad(e: any): any {
			const presenceControl: XrmClientApi.Controls.OptionSetControl = Xrm.Page.getControl(Constants.presenceSelectControl);
			presenceControl.setFocus();
			const presenceOptions_str: string = window.localStorage[Constants.GLOBAL_PRESENCE_LIST];
			const currentPresence_str: string = window.localStorage[Constants.CURRENT_PRESENCE_INFO];
			if (presenceOptions_str && currentPresence_str) {
				const presenceOptions = JSON.parse(presenceOptions_str);
				const currentPresence = JSON.parse(currentPresence_str);
				if (presenceControl && presenceOptions) {
					for (let i: number = 0; i < presenceOptions.length; i++) {
						const item: XrmClientApi.OptionSetItem = {
							text: presenceOptions[i][Constants.presenceText],
							value: i
						}
						presenceControl.addOption(item);
						if (presenceOptions[i][Constants.presenceText] == currentPresence.presenceText) {
							presenceControl.getAttribute().setValue(i);
							let presenceButton = (<HTMLButtonElement>window.top.document.querySelector(Constants.PRESENCE_BUTTON_DATA_ID));
						}
					}
				}
			}
		}

		public openPresenceDialogOKClick(executionContext: any): any {
			const presenceSelectControl: XrmClientApi.Controls.OptionSetControl = Xrm.Page.getControl(Constants.presenceSelectControl);
			const presenceSelectControlAttr = presenceSelectControl ? presenceSelectControl.getAttribute() : console.log("presenceSelectControl is null");
			const presenceValue = presenceSelectControlAttr ? presenceSelectControlAttr.getValue() : console.log("presenceSelectControlAttr is null");
			if (!this.isNullOrUndefined(presenceValue)) {
				const presenceControlOptions: XrmClientApi.OptionSetItem[] = presenceSelectControl.getOptions();
				for (let i: number = 0; i < presenceControlOptions.length; i++) {
					if (presenceControlOptions[i].value === presenceValue) {
						Xrm.Page.data.attributes.get(Constants.PRESENCE_SELECTED_VALUE).setValue(presenceControlOptions[i].text);
						this.raiseSetPresenceFromDialog(presenceControlOptions[i].text);
						break;
					}
				}
			}
			Xrm.Page.data.attributes.get(Constants.LAST_BUTTON_CLICKED).setValue(Constants.OK_BUTTON_ID);
			
			const formContext = executionContext.getFormContext();
			formContext.ui.close();
		}
		
		public openPresenceDialogCancelClick(executionContext: any): any {
			Xrm.Page.data.attributes.get(Constants.LAST_BUTTON_CLICKED).setValue(Constants.CANCEL_BUTTON_ID);
			const formContext = executionContext.getFormContext();
			formContext.ui.close();
		}

		private raiseSetPresenceFromDialog(searchText: string): any {
			const presenceOptions_str: string = window.localStorage[Constants.GLOBAL_PRESENCE_LIST];
			const presenceList = JSON.parse(presenceOptions_str);
			let updatedPresence: any = {};
			let selectedStatus = {};
			if (presenceList && searchText) {
				for (let i: number = 0; i < presenceList.length; i++) {
					if (presenceList[i].presenceText === searchText) {
						selectedStatus = presenceList[i];
						break;
					}
				}
			}
			if (selectedStatus) {
				updatedPresence.presenceId = (<any>selectedStatus).presenceId;
				updatedPresence.presenceText = (<any>selectedStatus).presenceText;
				updatedPresence.presenceColor = (<any>selectedStatus).presenceColor;
				updatedPresence.basePresenceStatus = (<any>selectedStatus).basePresenceStatus;
				var setPresenceEvent = new CustomEvent('setPresenceEvent', {
					detail: { "presenceId": updatedPresence.presenceId, "presenceInfo": updatedPresence }
				});
				window.parent.dispatchEvent(setPresenceEvent);
			}
		}
	}
}