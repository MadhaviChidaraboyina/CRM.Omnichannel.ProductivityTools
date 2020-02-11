/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/** @internal */
namespace Microsoft.ProductivityMacros {

	export interface IActionItem {
		name: string;
		type: string,
		inputs: any,
		runAfter: any
	}

	export interface IMacroActions {
		actionName: IActionItem;
	}

	export interface ISortByDependency {
		objectMap: Map<string, IActionItem>,
		visited: Map<string, boolean>,
		result: IActionItem[];
	}
}