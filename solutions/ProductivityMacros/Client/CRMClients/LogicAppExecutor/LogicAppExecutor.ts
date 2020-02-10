/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

/// <reference path="../../../../../references/external/TypeDefinitions/lib.es6.d.ts" />
/// <reference path="Interfaces.ts" />
/// <reference path="LogicAppExecutorUtils.ts" />
/// <reference path="../MacroActionTemplatesInfra.ts" />

namespace Microsoft.LogicAppExecutor {

	export function ExecuteLogicApp(logicAppJSONstring: string): Promise<string> {
		return new Promise((resolve, reject) => {
			Microsoft.ProductivityMacros.Internal.ProductivityMacroOperation.InitMacroActionTemplates().then(
				function (templates: any) {
					let parsedJson = JSON.parse(logicAppJSONstring);
					let actions = parsedJson.definition.actions;
					let executeActionsPromise = ExecuteActions(actions).then(
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
							console.log(success);
							resolve(success)
						},
						function (error: Error) {
							reject(error);
						});
				},
				function (error: Error) {
					reject(error);
				}
			);
		});
	}

	export function ExecuteActions(actions: IActionItem[]): Promise<string> {

		return new Promise((resolve, reject) => {
			let sortedActions = getSortedActionsList(actions);
			let executeActionsPromise = sortedActions.reduce((accumulatorPromise, nextId) => {
				return accumulatorPromise.then(
					function (result: any) {
						return getActionExecutorInstance(nextId.type).ExecuteAction(nextId);
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