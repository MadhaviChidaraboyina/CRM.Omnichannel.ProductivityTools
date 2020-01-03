/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

/// <reference path="../../../../../../references/external/TypeDefinitions/lib.es6.d.ts" />
/// <reference path="../Interfaces.ts" />
/// <reference path="../LogicAppExecutor.ts" />

namespace Microsoft.LogicAppExecutor {

	export class SetDefaultCallScriptAction implements ActionExecutor {
		private static _instance: ActionExecutor = null;
		private constructor() { }

		public static get Instance(): ActionExecutor {
			if (!SetDefaultCallScriptAction._instance) {
				SetDefaultCallScriptAction._instance = new SetDefaultCallScriptAction();
			}
			return SetDefaultCallScriptAction._instance;
		}
		ExecuteAction(action: IActionItem): Promise<string> {
			return new Promise((resolve, reject) => {
				console.log(action.inputs);
				return resolve(action.inputs.callscriptId);
			});
		}
	}
}