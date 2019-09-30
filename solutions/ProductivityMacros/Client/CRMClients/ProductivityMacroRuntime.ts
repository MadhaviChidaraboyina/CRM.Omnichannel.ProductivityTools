/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

/// <reference path="../../../../references/external/TypeDefinitions/lib.es6.d.ts" />
/// <reference path="../../../../Packages/Crm.ClientApiTypings.1.3.2084/clientapi/XrmClientApiInternal.d.ts" />
/// <reference path="Constants.ts" />
/// <reference path="../../TypeDefinitions/msdyn_internal_ci_library.d.ts" />
/// <reference path="MacroActionTemplatesInfra.ts" />

namespace Microsoft.ProductivityMacros {

	var cifExternal: Microsoft.CIFramework.External.CIFExternalUtilityImpl;

	export function runMacro(macroName: string, params?: string): Promise<string> {

		return new Promise((resolve, reject) => {
			Internal.ProductivityMacroActionTemplate.InitMacroActionTemplates().then(
				function (result: any) {
					getMacroInputJSON(macroName).then(
						function (inputJSONstring: string) {
							let actions = getSortedActionsList(JSON.parse(inputJSONstring).properties.definition.actions);
							let executeActionsPromise = actions.reduce((accumulatorPromise, nextId) => {
								return accumulatorPromise.then(function (result: any) {
									return resolveParamsAndExecuteMacroAction(nextId.type, nextId.inputs, nextId.name);
								}, function (error: Error) {
										reject(error);
									});
							}, Promise.resolve());
							executeActionsPromise.then(function (success: any) {
								resolve("Action performed successfully")
							}, function (error: Error) {
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

	function resolveActionInputFromPrevActionOutput(input: string): string {
		let matches = input.match(new RegExp("'(.*?)'", "g"));
		let prefix = matches[0];
		let attribute = matches[1];
		prefix = prefix.substr(1, prefix.length - 2);
		attribute = attribute.substr(1, attribute.length - 2);
		let inputSlug = "{" + prefix + "." + attribute + "}";
		return inputSlug;
	}

	function getCifExternalObject(): Microsoft.CIFramework.External.CIFExternalUtilityImpl {
		if (!cifExternal) {
			cifExternal = new Microsoft.CIFramework.External.CIFExternalUtilityImpl();
		}
		return cifExternal;
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
						resolve(result.entities[0].clientdata);
					}
				},
				function (error: Error) {
					reject(error);
				}
			);
		});
	}

	/** @internal */
	function getSortedActionsList(actionList: IActionItem[]): IActionItem[] {
		//let actions = {} as Map<string, IActionItem>;
		let actions: IActionItem[] = [];
		for (const actionKey in actionList) {
			let action = {} as IActionItem;
			action.name = actionKey;
			action.inputs = actionList[actionKey].inputs;
			action.type = actionList[actionKey].type;
			action.runAfter = actionList[actionKey].runAfter;
			actions.push(action);
		}
		let map = new Map<string, IActionItem>();
		let result = [] as IActionItem[];
		let visited = new Map<string, boolean>();

		var dependecySortObj: ISortByDependency = {
			objectMap: map,
			visited: visited,
			result: result
		};

		actions.forEach(function (obj: IActionItem) { // build the map
			dependecySortObj.objectMap.set(obj.name, obj);
		});

		actions.forEach(
			function (obj: IActionItem) {
				if (!dependecySortObj.visited.get(obj.name)) {
					sortUtil(obj, dependecySortObj);
				}
			}
		);
		return dependecySortObj.result;
	}

	function sortUtil(obj: IActionItem, dependecySortObj: ISortByDependency) {
		dependecySortObj.visited.set(obj.name, true);
		Object.keys(obj.runAfter).forEach(
			function (action: string) {
				if (!dependecySortObj.visited.get(action)) {
					sortUtil(dependecySortObj.objectMap.get(action), dependecySortObj);
				}
			}
		);
		dependecySortObj.result.push(obj);
	}




	function resolveParamsAndExecuteMacroAction(actionType: string, actionInputs: string, actionName: string): Promise<any> {
		return new Promise<any>(
			function (resolve: (response: any) => void, reject: (error: any) => void) {
				let result = {};
				resolveParams(actionType, JSON.stringify(actionInputs), result).then(function (response: any) {
					executeMacroAction(actionType, response, actionName).then(function (response: any) {

						resolve(response);
					}, function (error: Error) {
						resolve(error);
					}
					);
				}, function (error: Error) {
					reject(error);
				});
			}
		);
	}

	/** @internal */
	function resolveParams(actionType: string, actionInputs: string, result?: any): Promise<any> {
		return new Promise<any>(
			function (resolve: (response: any) => void, reject: (error: any) => void) {
				var stringResolversInputs: Promise<string>[] = [];
				var resolvedInputs: any = {};
				if (!actionInputs) {
					resolve("");
				}
				let inputs = JSON.parse(actionInputs);

				for (var input in inputs) {
					if (typeof inputs[input] === 'object') {
						stringResolversInputs.push(resolveParams(actionType, JSON.stringify(inputs[input]), result).then(function (response: any) {
							resolvedInputs[input] = response;
						}.bind(this), function (error: Error) {

						})
						);
					}
					else if (Array.isArray(inputs[input])) {
						var arrayInput = inputs[input];
						for (var i = 0; i < arrayInput.length; i++) {
							stringResolversInputs.push(resolveParams(actionType, arrayInput[i], result).then(function (response: any) {
								resolvedInputs[input] = response;
							}.bind(this), function (error: Error) {

							})
							);
						}
					}
					else if (typeof inputs[input] === 'string' || inputs[input] instanceof String) {
						if (inputs[input].startsWith("@outputs")) {
							inputs[input] = resolveActionInputFromPrevActionOutput(inputs[input]);
						}
						stringResolversInputs.push(getCifExternalObject().resolveTemplateString(inputs[input], getCifExternalObject().getSessionTemplateParams(), "").then(
							function (indexObj: any, result: any) {
								resolvedInputs[indexObj] = result;
								Promise.resolve(resolvedInputs);
							}.bind(this, input),
							function (error: Error) {
								return Promise.reject("Error");
							}
						)
						);
					} else {
						resolvedInputs[input] = inputs[input]
						Promise.resolve(resolvedInputs);
					}
				}
				Promise.all(stringResolversInputs).then(function (response: any) {
					return resolve(resolvedInputs);
				}.bind(this), function (error: Error) {
					return reject(error);
				}
				);
			}.bind(this));
	}

	/** @internal */
	function executeMacroAction(actionType: string, actionInputs: string, actionName: string): Promise<any> {
		let exectuableMethod = Internal.ProductivityMacroActionTemplate.macroActionTemplates.get(actionType)["_runtimeAPI"];
		return new Promise<any>((resolve, reject) => {
			eval(exectuableMethod).then(
				function (success: any) {
					resolve(success);
				},
				function (error: Error) {
					reject(error);
				}
			);
		});
	}
}