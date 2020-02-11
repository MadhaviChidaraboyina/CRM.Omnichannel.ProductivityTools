/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

/// <reference path="../../../../references/external/TypeDefinitions/lib.es6.d.ts" />
/// <reference path="../../../../Packages/Crm.ClientApiTypings.1.3.2084/clientapi/XrmClientApiInternal.d.ts" />
/// <reference path="Constants.ts" />
/// <reference path="Models.ts" />
/// <reference path="../TelemetryHelper.ts" />
/// <reference path="./ProductivityMacrosRunHistory.ts" />
/// <reference path="./LogicAppExecutor/LogicAppExecutor.ts" />

namespace Microsoft.ProductivityMacros {
	
	

	export function initializeMacrosRuntime() {
		Microsoft.ProductivityMacros.Internal.initializeTelemetry();
	}

	export function runMacro(macroName: string, params?: string): Promise<string> {

		return new Promise((resolve, reject) => {
            Internal.ProductivityMacroOperation.InitMacroActionTemplates().then(
				function (templates: any) {
					getMacroInputJSON(macroName).then(
						function (inputJSONstring: string) {
							let logicAppJSON = JSON.parse(inputJSONstring).properties;
							Microsoft.LogicAppExecutor.ExecuteLogicApp(JSON.stringify(logicAppJSON), macroName).then(
								function (success) {
									resolve(success);
								},
								function (error: Error) {
									reject(error);
								});
						},
						function (error: Error) {
							reject(error);
						}
					);
				},
                function (error: Error) {
					reject(error);
				}
			);
		});
	}

	/** @internal */
	function getMacroInputJSON(macroName: string): Promise<string> {
		return new Promise((resolve, reject) => {
			let entityName = "workflow";
			let query = "?$select=name,clientdata" + "&$filter=name eq '" + macroName + "' and category eq 6";
			Xrm.WebApi.retrieveMultipleRecords(entityName, query).then(
				function (result: any) {
					if (Internal.isNullOrUndefined(result.entities) || result.entities.length <= 0 || (Internal.isNullOrUndefined(result.entities[0].clientdata))) {
						reject("Macro not found");
					}
					else {
						//Microsoft.ProductivityMacros.RunHistory.initializeDefinition(data, result);
						resolve(result.entities[0].clientdata);
					}
				},
				function (error: Error) {
					reject(error);
				}
			);
		});
	}



	



    
	
	initializeMacrosRuntime();

	
}