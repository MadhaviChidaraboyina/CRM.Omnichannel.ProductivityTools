/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

/// <reference path="../../../../../../references/external/TypeDefinitions/lib.es6.d.ts" />
/// <reference path="../Interfaces.ts" />
/// <reference path="../LogicAppExecutor.ts" />
/// <reference path="../../ProductivityMacrosRunHistory.ts" />
/// <reference path="../../ProductivityMacroState.ts" />
/// <reference path="../../Constants.ts" />

namespace Microsoft.LogicAppExecutor {

	export class MacroAction implements ActionExecutor {
		private static _instance: ActionExecutor = null;
		private constructor() { }	

		public static get Instance(): ActionExecutor {
			if (!MacroAction._instance) {
				MacroAction._instance = new MacroAction();
			}
			return MacroAction._instance;
		}

		ExecuteAction(action: IActionItem, state: any, runHistoryData: executionJSON): Promise<string> {
			return new Promise((resolve, reject) => {	
				var executeActionsPromise = this.resolveParamsAndExecuteMacroAction(action.type, action.inputs, action.name, state, runHistoryData);						
				executeActionsPromise.then(function (success: any) {					
					resolve(Microsoft.ProductivityMacros.Constants.ActionSuccessfull)
				}.bind(this),
					function (error: Error) {
						reject(error);
					}.bind(this));
			});
		}

		resolveParamsAndExecuteMacroAction(actionType: string, actionInputs: string, actionName: string, macroState: any, runHistoryData: executionJSON): Promise<any> {
			return new Promise<any>(
				function (resolve: (response: any) => void, reject: (error: any) => void) {
					let result = {};
					this.resolveParams(actionType, JSON.stringify(actionInputs), macroState, result).then(
						function (response: any) {
							Promise.all([this.resolveListFlowsActionParams(actionType, response), this.updateSolutionFlowsId(response)]).then(
								function (response: any) {
									this.executeMacroAction(actionType, response[0], actionName, macroState, runHistoryData).then(
										function (response: any) {
											resolve(response);
										}.bind(this),
										function (error: Error) {
											reject(error);
										}
									);
								}.bind(this),
								function (error: Error) {
									reject(error);
								}
							);
						}.bind(this)
					)
				}.bind(this)
			);
		}

		resolveParams(actionType: string, actionInputs: string, macroState: any, result?: any): Promise<any> {
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
							let val = inputs[input];
							resolvedInputs[input] = val;
							Object.keys(val).forEach(function (propName: any) {
								stringResolversInputs.push(this.resolveParams(actionType, JSON.stringify(val[propName]), macroState, result).then(function (response: any) {
									resolvedInputs[input][propName] = response;
								}.bind(this)));
							}.bind(this));
						}
						else if (Array.isArray(inputs[input])) {
							var arrayInput = inputs[input];
							resolvedInputs[input] = arrayInput;
							for (var i = 0; i < arrayInput.length; i++) {
								stringResolversInputs.push(this.resolveParams(actionType, arrayInput[i], macroState, result).then(function (response: any) {
									resolvedInputs[input][i] = response;
								}.bind(this), function (error: Error) {

								})
								);
							}
						}
						else if (typeof inputs[input] === 'string' || inputs[input] instanceof String) {
							if (inputs[input].startsWith("@outputs")) {
								inputs[input] = resolveActionInputFromPrevActionOutput(inputs[input]);
							}
							stringResolversInputs.push(Microsoft.ProductivityMacros.Internal.resolveTemplateString(inputs[input], macroState.stateParams, "").then(
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

		resolveListFlowsActionParams(actionType: string, inputs: any): Promise<any> {
			return new Promise<any>((resolve)=> {
				try {
					// the entityLogicalName in workflow entity is actually entity's LogicalCollectionName.
					// it is used to fetch the flows from api.flow.microsoft.com
					// but flow execution need entity's LogicalName
					// resolveEntityLogicalName method is used to replace the LogicalCollectionName to LogicalName
					const entityCollectionName = inputs[Microsoft.ProductivityMacros.Constants.ENTITY_LOGICAL_NAME];
					if (actionType !== Microsoft.ProductivityMacros.ActionTypes.LIST_FLOWS || !entityCollectionName) {
						return resolve(inputs);
					}

					const queryString = `/api/data/v9.0/EntityDefinitions?$filter=LogicalCollectionName%20eq%20%27${entityCollectionName}%27&$select=LogicalName`;

					var req = new XMLHttpRequest();
					req.open("GET", Xrm.Utility.getGlobalContext().getClientUrl() + queryString, false);
					req.setRequestHeader("OData-MaxVersion", "4.0");
					req.setRequestHeader("OData-Version", "4.0");
					req.setRequestHeader("Accept", "application/json");
					req.setRequestHeader("Content-Type", "application/json; charset=utf-8");

					req.onreadystatechange = function () {
						if (req.readyState === 4) {
							req.onreadystatechange = null;
							if (req.status === 200) {
								const entity = JSON.parse(req.response);
								if (entity && entity.value && entity.value.length == 1) {
									inputs[Microsoft.ProductivityMacros.Constants.ENTITY_LOGICAL_NAME] = entity.value[0].LogicalName;
									inputs[Microsoft.ProductivityMacros.Constants.ENTITY_LOGICAL_COLLECTION_NAME] = entityCollectionName;
								}
								return resolve(inputs);
							}
						}
					};
					req.send();
				}
				catch (error) {
					return resolve(inputs);
				}
			});
		}

		updateSolutionFlowsId(inputs: any): Promise<any> {
			return new Promise<any>((resolve)=> {
				try {
					// For flows within imported solution, flowId retrieved from inputs is workflowid of the flow,
					// which cannot be used to identify flow by the execution method
					// Need to retrieve workflowidunique of the flow to allow execution method idenfity the flow
					const workFlowId = inputs[Microsoft.ProductivityMacros.Constants.FLOW_ID];
					if (!workFlowId) {
						return resolve(inputs);
					}

					const queryString = `/api/data/v9.0/workflows?$filter=workflowid%20eq%20%27${workFlowId}%27&$select=workflowidunique`;
					
					var req = new XMLHttpRequest();
					req.open("GET", Xrm.Utility.getGlobalContext().getClientUrl() + queryString, false);
					req.setRequestHeader("OData-MaxVersion", "4.0");
					req.setRequestHeader("OData-Version", "4.0");
					req.setRequestHeader("Accept", "application/json");
					req.setRequestHeader("Content-Type", "application/json; charset=utf-8");

					req.onreadystatechange = function() {
						if (req.readyState === 4) {
							req.onreadystatechange = null;
							if (req.status === 200) {
								const entity = JSON.parse(req.response);
								if (entity && entity.value && entity.value.length == 1) {
									inputs[Microsoft.ProductivityMacros.Constants.FLOW_ID] = entity.value[0].workflowidunique;
								}
								return resolve(inputs);
							}
						}
					}
					req.send();
				}
				catch (error) {
					return resolve(inputs);
				}
			});
		}

		private executeMacroAction(actionType: string, actionInputs: any, actionName: string, macroState: any, runHistoryData: executionJSON): Promise<any> {
			let exectuableMethod = Microsoft.ProductivityMacros.Internal.ProductivityMacroOperation.macroActionTemplates.get(actionType)["_runtimeAPI"];
			var status, outputs = {}, startTime = new Date().toISOString();
			return new Promise<any>((resolve, reject) => {
			eval(exectuableMethod).then(
				function (success: any) {
					updateActionOutputInSessionContext(success, macroState);
					status = Microsoft.ProductivityMacros.Constants.StatusSucceded;
					outputs = this.generateOutputJSON(success[Microsoft.ProductivityMacros.Constants.OutputResult]);
					Microsoft.ProductivityMacros.RunHistory.setActionStatus(runHistoryData, status, startTime, outputs, actionName, actionInputs);
					resolve(success);
				}.bind(this),
				function (error: Error) {	
					status = Microsoft.ProductivityMacros.Constants.StatusFailed;
					outputs = {};
					Microsoft.ProductivityMacros.RunHistory.setActionStatus(runHistoryData, status, startTime, outputs, actionName, actionInputs);
					reject(error);
				}
			);
		});
		}		

		private generateOutputJSON(output: any) {
			let keys = Object.keys(output);
			var finalOutput: any = {};
			for (var i = 0; i < keys.length; i++) {
				var newKey = keys[i].split(Microsoft.ProductivityMacros.Constants.SplitByDot, 2)[1];
				finalOutput[newKey] = output[keys[i]];
			}
			return finalOutput;
		}
	}
}