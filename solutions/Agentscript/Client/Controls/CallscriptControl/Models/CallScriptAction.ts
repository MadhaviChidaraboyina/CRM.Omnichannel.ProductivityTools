/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/

/// <reference path="../privatereferences.ts"/>

module MscrmControls.ProductivityPanel {
	'use strict';

	/**
	 * Generic action class
	 */
	export class CallScriptAction {
		// Properties
		public actionType: CallscriptActionType;

		// Runtime attributes
		public errorText: string;

		constructor(actionType: CallscriptActionType) {
			this.actionType = actionType;
			this.errorText = "";
		}

		public executeAction(stateManager?: StateManager): Promise<any> {
			return new Promise<any>((resolve, reject) => {
				this.errorText = "No execution found for this action type, ActionType=" + this.actionType;
				reject(this.errorText);
			});
		}

		public getErrorText(): string {
			return this.errorText;
		}

		public resolveInstructionText(cifUtil: CIFUtil): Promise<string> {
			return new Promise<any>((resolve, reject) => {
				resolve(""); //No slug resolution for macro and route actions
			});
		}

		public getResolvedTextInstruction(): string {
			return ""; //No text instruction for macro and route actions
		}

		public setResolvedInstructionText(resolvedText: string): void {
			return; //No text instruction for macro and route actions
		}
	}

	/**
	 * Text action
	 */
	export class TextAction extends CallScriptAction {
		// Properties
		public configuredTextInstruction: string;
		public resolvedTextInstruction: string;

		constructor(textInstruction: string) {
			super(CallscriptActionType.TextAction);
			this.configuredTextInstruction = textInstruction;
			this.resolvedTextInstruction = textInstruction;
		}

		public executeAction(): Promise<any> {
			return new Promise<any>((resolve, reject) => {
				resolve(); //No background processing for text action
			});
		}

		public resolveInstructionText(cifUtil: CIFUtil): Promise<string> {
			return cifUtil.resolveReplaceableParameters(this.configuredTextInstruction);
		}

		public getResolvedTextInstruction(): string {
			return this.resolvedTextInstruction;
		}

		public setResolvedInstructionText(resolvedText: string): void {
			this.resolvedTextInstruction = resolvedText;
		}
	}

	/**
	 * Macro Action
	 */
	export class MacroAction extends CallScriptAction {
		public macroId: string;
		private macroName: string;

		constructor(macroId: string, macroName: string) {
			super(CallscriptActionType.MacroAction);
			this.macroId = macroId;
			this.macroName = macroName;
		}

		public executeAction(): Promise<any> {
			return new Promise<any>((resolve, reject) => {
				//added a delay to simulate time taken for macro execution
				window.setTimeout(() => resolve(), 5000);
			});
		}
	}

	/**
	 * Route action
	 */
	export class RouteAction extends CallScriptAction {
		public routeCallscriptId: string;
		private routeCallscriptName: string;

		constructor(routeCallscriptId: string, routeCallscriptName: string) {
			super(CallscriptActionType.ReRouteAction);
			this.routeCallscriptId = routeCallscriptId;
			this.routeCallscriptName = routeCallscriptName;
		}

		public executeAction(stateManager: StateManager): Promise<any> {
			for (let script of stateManager.callscriptsForCurrentSession) {
				if (script.id === this.routeCallscriptId) {
					script.isCurrent = true;
				}
				else {
					script.isCurrent = false;
				}
			}
			return new Promise<any>((resolve, reject) => {
				resolve(); //No background processing for route action
			});
		}
	}
}