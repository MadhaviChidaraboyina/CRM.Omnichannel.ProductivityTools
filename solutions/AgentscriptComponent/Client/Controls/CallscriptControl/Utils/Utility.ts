﻿/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/

/// <reference path="../privatereferences.ts"/>

module MscrmControls.Callscript {
	'use strict';

	//Utility Class
	export class Utility {

		private static iconsUrlDictionary: { [key: string]: string } = {};

		public static getIconUrl(context: Mscrm.ControlData<IInputBag>, iconName: string) {
			if (context.utils.isNullOrUndefined(this.iconsUrlDictionary[iconName])) {
				this.iconsUrlDictionary[iconName] = context.page.getClientUrl() + "/webresources/" + iconName;
			}
			return this.iconsUrlDictionary[iconName];
		}

		public static getActionIconUrl(context: Mscrm.ControlData<IInputBag>, actionType: CallscriptActionType): string {
			if (actionType == CallscriptActionType.TextAction) {
				return this.getIconUrl(context, Constants.textActionIcon);
			}
			else if (actionType == CallscriptActionType.MacroAction) {
				return this.getIconUrl(context, Constants.macroActionIcon);
			}
			return this.getIconUrl(context, Constants.routeActionIcon);
		}

		/*
		 * Utility function to validate if object is null or undefined
		 * Note: Use this function only if context is not accessible
		 */
		public static isNullOrUndefined(object: any): boolean {
			return typeof (object) == "undefined" || object == null;
        }

        /**
       * Get current session id.
       */
        public static getCurrentSessionId(): string {
            return Microsoft.AppRuntime.Sessions.getFocusedSession().sessionId;
        }

        /**
		 * Replace unresolved slugs with error message
		 */
        public static replaceUnresolvedSlugs(header: string): string {
            let resolvedString = header;
            if (!Utility.isNullOrUndefined(resolvedString)) {
                resolvedString = resolvedString.replace(/[[]]/g, Callscript.Constants.OdataError);
            }

            return resolvedString;
        }

        /**
		 * formatted string with error message
         * .split generates extra "" at first or last index in headerList, if odata_error is at start or end of string
         * "" is not generated if error message is found between no error strings
         * so we dont add error message if headerList length is 1 (no error message found ) or for last index of headerList (generated by .split)
		 */
        public static formattedStringDisplay(context: Mscrm.ControlData<IInputBag>, stepString: string, stepId: string, showIcon: boolean, highlightError: boolean = true): any {
            var stepLabelComponents = [];
            stepString = stepString.replace(/(\[)|(\])/g, "");
            let headerList = stepString.split(Constants.OdataError);
            var slugResolutionErrorIcon = context.factory.createElement("CONTAINER", {
                key: "CallScriptStepResolutionErrorIcon-" + stepId + "-Key",
                id: "CallScriptStepResolutionErrorIcon-" + stepId + "-Id",
                style: ControlStyle.getSlugResolutionErrorMessageIcon(context)
            }, []); 
            headerList.forEach(function (value, index) {
                if (value != "") {
                    let noErrorLabel = context.factory.createElement(
                        "Label",
                        {
                            id: "CallScriptLabel-id" + stepId + "-Id-" + index,
                            key: "CallScriptLabel-id" + stepId + "-Key-" + index,
                        }, value);

                    let noErrorMessageContainer = context.factory.createElement("CONTAINER", {
                        id: "CallScriptStepLabel-" + stepId + "-Id-" + index,
                        key: "CallScriptStepLabel-" + stepId + "-Key-" + index,
                        style: {
                            display: "contents"
                        }
                    }, noErrorLabel);
                    stepLabelComponents.push(noErrorMessageContainer);
                }

                if (index != headerList.length-1) {
                    let errorMessageLabel = context.factory.createElement(
                        "Label",
                        {
                            id: "CallScriptLabelError-" + stepId + "-Id-" + index,
                            key: "CallScriptLabelError-" + stepId + "-Key-" + index,
                            style: ControlStyle.getSlugResolutionErrorMessageLabel(highlightError)
                        }, context.resources.getString(LocalizedStrings.SlugResolutionErrorMessage));

                    let errorMessageContainer = context.factory.createElement("CONTAINER", {
                        id: "CallScriptStepFormattedLErrorabel-" + stepId + "-Id" + index,
                        key: "CallScriptStepFormattedErrorLabel-" + stepId + "-Key" + index,
                        style: {
                            display: "contents"
                        }
                    }, [showIcon ? slugResolutionErrorIcon : [], errorMessageLabel]);

                    stepLabelComponents.push(errorMessageContainer);
                }
            });

            return context.factory.createElement("CONTAINER", {
                key: "CallScriptStepFormattedLabelContainer" + stepId + "-Key",
                id: "CallScriptStepFormattedLabelContainer-" + stepId + "-Id",
            }, stepLabelComponents);
        }

        public static isGuid(value: string): boolean {
            return !!value?.match(/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/);
        }
	}
}