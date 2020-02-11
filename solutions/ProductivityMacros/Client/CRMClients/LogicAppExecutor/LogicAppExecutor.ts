/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

/// <reference path="../../../../../references/external/TypeDefinitions/lib.es6.d.ts" />
/// <reference path="Interfaces.ts" />
/// <reference path="LogicAppExecutorUtils.ts" />
/// <reference path="../MacroActionTemplatesInfra.ts" />

namespace Microsoft.LogicAppExecutor {

	export function ExecuteLogicApp(logicAppJSONstring: string, sourceName ?:string): Promise<string> {
		return new Promise((resolve, reject) => {
			Microsoft.ProductivityMacros.Internal.ProductivityMacroOperation.InitMacroActionTemplates().then(
				function (templates: any) {
					let parsedJson = JSON.parse(logicAppJSONstring);
					let actions = parsedJson.definition.actions;
					var state = new Microsoft.ProductivityMacros.Internal.ProductivityMacroState();
					var runHistoryData = {} as executionJSON;
					if (!Microsoft.ProductivityMacros.Internal.isNullOrUndefined(sourceName)) {
						Microsoft.ProductivityMacros.RunHistory.initializeRunHistoryJSON(runHistoryData, logicAppJSONstring, sourceName);
					}
					let executeActionsPromise = ExecuteActions(actions, state, runHistoryData).then(
						function (result: any) {							
							console.log(result);
							return (result);
						},
						function (error: Error) {
							reject(error);
						}
					);
					executeActionsPromise.then(
						function (success: any) {
							if (!Microsoft.ProductivityMacros.Internal.isNullOrUndefined(sourceName)) {
								var status = Microsoft.ProductivityMacros.Constants.StatusSucceded;
								if (Microsoft.ProductivityMacros.Internal.isNullOrUndefined(success)) {
									status = Microsoft.ProductivityMacros.Constants.StatusFailed;
								}
								Microsoft.ProductivityMacros.RunHistory.createRunHistoryRecord(runHistoryData, status, sourceName);
							}
							console.log(success);
							resolve(success)
						},
						function (error: Error) {
							if (!Microsoft.ProductivityMacros.Internal.isNullOrUndefined(sourceName)) {
								var status = Microsoft.ProductivityMacros.Constants.StatusFailed;
								Microsoft.ProductivityMacros.RunHistory.createRunHistoryRecord(runHistoryData, status, sourceName);
							}
							reject(error);
						});
				},
				function (error: Error) {
					reject(error);
				}
			);
		});
	}

	export function ExecuteActions(actions: IActionItem[], state: any, runHistoryData: executionJSON): Promise<string> {
		return new Promise((resolve, reject) => {
			let sortedActions = getSortedActionsList(actions);
			if (!Microsoft.ProductivityMacros.Internal.isNullOrUndefined(runHistoryData.id)) {
				Microsoft.ProductivityMacros.RunHistory.setActionsInJSON(runHistoryData, sortedActions);
			}
			let executeActionsPromise = sortedActions.reduce((accumulatorPromise, nextId) => {
				return accumulatorPromise.then(
					function (result: any) {
						return getActionExecutorInstance(nextId.type).ExecuteAction(nextId, state, runHistoryData);
					}, function (error: Error) {
						reject(error);
					});
			}, Promise.resolve());
			executeActionsPromise.then(
				function (success: any) {
					return resolve(success)
				},
				function (error: Error) {
					reject(error);
				});
		});
	}
}