﻿/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

/// <reference path="../../../../../references/external/TypeDefinitions/lib.es6.d.ts" />
/// <reference path="Interfaces.ts" />
/// <reference path="Actions/IfAction.ts" />
/// <reference path="Actions/SetDefaultCallScriptAction.ts" />
/// <reference path="../ProductivityMacroSlug.ts" />

namespace Microsoft.LogicAppExecutor {

	export function getSortedActionsList(actionList: IActionItem[]): IActionItem[] {
		//let actions = {} as Map<string, IActionItem>;
		let actions: IActionItem[] = [];
		for (const actionKey in actionList) {
			let action = {} as IActionItem;
			action.name = actionKey;
			action.inputs = actionList[actionKey].inputs;
			action.type = actionList[actionKey].type;
			action.runAfter = actionList[actionKey].runAfter;
			action.actions = actionList[actionKey].actions;
			action.else = actionList[actionKey].else;
			action.expression = actionList[actionKey].expression;
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

	export function getActionExecutorInstance(actionType: string): ActionExecutor {
		switch (actionType) {
			case "If":
				return IfAction.Instance;
			case "setcallscript":
				return SetDefaultCallScriptAction.Instance;
		}
	}

	export function resolveSlug(slug: string): Promise<string> {
		return Microsoft.ProductivityMacros.Internal.resolveTemplateString(slug, null, "");
	}
}