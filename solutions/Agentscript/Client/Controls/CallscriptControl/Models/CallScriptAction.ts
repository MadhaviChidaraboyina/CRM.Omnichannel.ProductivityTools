/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/

/// <reference path="../privatereferences.ts"/>

module MscrmControls.ProductivityPanel {
	'use strict';

	export class CallScriptAction {
		public id: string;
		public name: string;
		public actionType: CallscriptActionType
		public configuredDisplayText: string;
		public resolvedDisplayText: string;
		public errorText: string;

		constructor(id: string, name: string, actionType: CallscriptActionType, displayText: string) {
			this.id = id;
			this.name = name;
			this.actionType = actionType;
			this.configuredDisplayText = displayText;
			this.resolvedDisplayText = displayText;
			this.errorText = "";
		}

		public executeAction(cifUtil?: CIFUtil): Promise<any> {
			return new Promise<any>((resolve, reject) => {
				this.errorText = "No implementation found for macro/route action";
				reject("Cannot find child class");
			});
		}

		public getDisplayText(): string {
			return this.resolvedDisplayText;
		}

		public getErrorText(): string {
			return this.errorText;
		}
	}

	export class TextAction extends CallScriptAction {

		constructor(id: string, name: string, displayText: string) {
			super(id, name, CallscriptActionType.TextAction, displayText);
		}

		public executeAction(cifUtil: CIFUtil): Promise<any> {
			return new Promise<any>((resolve, reject) => {
				resolve(); //do nothing
			});
		}
	}

	export class MacroAction extends CallScriptAction {
		public macroId: string;

		constructor(id: string, name: string, macroId: string, displayText: string) {
			super(id, name, CallscriptActionType.MacroAction, displayText);
			this.macroId = macroId;
		}
	}

	export class RouteAction extends CallScriptAction {
		public routeCallscriptId: string;

		constructor(id: string, name: string, routeCallscriptId: string, displayText: string) {
			super(id, name, CallscriptActionType.ReRouteAction, displayText);
			this.routeCallscriptId = routeCallscriptId;
		}
	}
}