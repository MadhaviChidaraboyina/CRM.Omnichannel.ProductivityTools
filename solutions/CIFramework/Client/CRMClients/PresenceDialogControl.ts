/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/** @internal */

/// <reference path="InternalMainLibrary.ts" />

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

        public openPresenceDialog(e: any): any {
            const that = this;
            const dialogParams: XrmClientApi.DialogParameters = {};
            dialogParams[Constants.LAST_BUTTON_CLICKED] = "";
            const dialogOptions: XrmClientApi.DialogOptions = { width: 300, height: 300, position: XrmClientApi.Constants.WindowPosition.center };
            Xrm.Navigation.openDialog(Constants.SET_PRESENCE_MDD, dialogOptions, dialogParams).then(function (dialogParams: any) {
                if (dialogParams.parameters[Constants.LAST_BUTTON_CLICKED] === Constants.OK_BUTTON_ID) {
                    that.raiseSetPresenceFromDialog(dialogParams.parameters[Constants.PRESENCE_SELECTED_VALUE]);
                }
            });
        }

        public openPresenceDialogonLoad(e: any): any {
            const presenceControl: XrmClientApi.Controls.OptionSetControl = Xrm.Page.getControl(Constants.presenceSelectControl);
            const presenceOptions_str: string = window.localStorage[Constants.GLOBAL_PRESENCE_LIST];
            if (presenceOptions_str) {
                const presenceOptions = JSON.parse(presenceOptions_str);
                if (presenceControl && presenceOptions) {
                    for (let i: number = 0; i < presenceOptions.length; i++) {
                        const item: XrmClientApi.OptionSetItem = {
                            text: presenceOptions[i][Constants.presenceText],
                            value: i
                        }
                        presenceControl.addOption(item);
                    }
                }
            }
        }

        public openPresenceDialogOKClick(e: any): any {
            const presenceSelectControl: XrmClientApi.Controls.OptionSetControl = Xrm.Page.getControl(Constants.presenceSelectControl);
            const presenceSelectControlAttr = presenceSelectControl ? presenceSelectControl.getAttribute() : console.log("presenceSelectControl is null");
            const presenceValue = presenceSelectControlAttr ? presenceSelectControlAttr.getValue() : console.log("presenceSelectControlAttr is null");
            if (presenceSelectControlAttr && presenceValue) {
                const presenceControlOptions: XrmClientApi.OptionSetItem[] = presenceSelectControl.getOptions();
                for (let i: number = 0; i < presenceControlOptions.length; i++) {
                    if (presenceControlOptions[i].value === presenceValue) {
                        Xrm.Page.data.attributes.get(Constants.PRESENCE_SELECTED_VALUE).setValue(presenceControlOptions[i].text);
                        break;
                    }
                }
            }
            Xrm.Page.data.attributes.get(Constants.LAST_BUTTON_CLICKED).setValue(Constants.OK_BUTTON_ID);
            Xrm.Page.ui.close();
        }

        public openPresenceDialogCancelClick(e: any): any {
            Xrm.Page.data.attributes.get(Constants.LAST_BUTTON_CLICKED).setValue(Constants.CANCEL_BUTTON_ID);
            Xrm.Page.ui.close();
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