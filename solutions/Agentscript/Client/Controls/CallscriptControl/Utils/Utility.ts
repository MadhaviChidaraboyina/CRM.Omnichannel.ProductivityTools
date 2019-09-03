/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/

/// <reference path="../privatereferences.ts"/>

module MscrmControls.ProductivityPanel {
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
	}
}