/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/

/// <reference path="../privatereferences.ts"/>

module MscrmControls.CallscriptControl {
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

		public executeAction(executionParam?: any): Promise<any> {
			return new Promise<any>((resolve, reject) => {
				this.errorText = "No execution found for this action type, ActionType=" + this.actionType;
				reject(this.errorText);
			});
		}

		public getErrorText(): string {
			return this.errorText;
		}

        public resolveInstructionText(macroUtil: MacroUtil): Promise<string> {
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

        public resolveInstructionText(macroUtil: MacroUtil): Promise<string> {
            macroUtil.resolveInitMacroTemplate();
            return macroUtil.resolveReplaceableParameters(this.configuredTextInstruction);
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
        public configuredTextInstruction: string;
        public resolvedTextInstruction: string;

        constructor(macroId: string, macroName: string, macroDescription: string) {
			super(CallscriptActionType.MacroAction);
			this.macroId = macroId;
            this.macroName = macroName;
            this.configuredTextInstruction = macroDescription;
            this.resolvedTextInstruction = macroDescription;
		}

		public executeAction(macroUtil: MacroUtil): Promise<any> {
			return macroUtil.executeMacro(this.macroName, this.macroId);
        }

        public resolveInstructionText(macroUtil: MacroUtil): Promise<string> {
            macroUtil.resolveInitMacroTemplate();
            return macroUtil.resolveReplaceableParameters(this.configuredTextInstruction);
        }

        public getResolvedTextInstruction(): string {
            return this.resolvedTextInstruction;
        }

        public setResolvedInstructionText(resolvedText: string): void {
            this.resolvedTextInstruction = resolvedText;
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

		/**
		 * Returns true if route script data is already retrieved
		 * If retrieved it sets current script flag to true
		 * @param stateManager state manager
		 */
		private isRouteScriptRetrieved(stateManager: StateManager): boolean {
			let isScriptAvailable = false;

			for (let script of stateManager.callscriptsForCurrentSession) {
				if (script.id === this.routeCallscriptId) {
					script.isCurrent = true;
					isScriptAvailable = true;
				}
				else {
					script.isCurrent = false;
				}
			}

			return isScriptAvailable;
		}

		/**
		 * Executes script action
		 * @param stateManager state manager
		 */
		public executeAction(stateManager: StateManager): Promise<any> {

			return new Promise<any>((resolve, reject) => {

				if (Utility.isNullOrUndefined(this.routeCallscriptId)) {
					let errorMessage = "Route script id is null";
					reject(errorMessage);
					return;
				}

				let isRouteScriptAvailable = this.isRouteScriptRetrieved(stateManager);

				if (isRouteScriptAvailable == false) {
					// Route script is not associated with session template
					// Retrieve the call script and its records
					let newCallscriptDataPromise = stateManager.fetchCallscriptAndStepsData(this.routeCallscriptId);

					newCallscriptDataPromise.then(
						(routeCallscriptRecord: CallScript) => {
							// mark this call script record as current
							stateManager.updateCurrentCallScript(routeCallscriptRecord);
							resolve();
						},
						(errorResponse: string) => {
							// Telemetry is logged in data manager and state manager
							reject(errorResponse);
						}
					);
				}
				else {
					// Route script is already available and marked as current script
					resolve();
				}
			});
		}
	}
}