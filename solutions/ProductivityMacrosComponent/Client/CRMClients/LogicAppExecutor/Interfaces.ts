/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

namespace Microsoft.LogicAppExecutor {

	export interface IActionItem {
		name: string;
		type: string;
		inputs?: any;
		runAfter: any;
		actions?: IActionItem[];
		else?: any;
		expression?: any;
	}

	export interface ISortByDependency {
		objectMap: Map<string, IActionItem>;
		visited: Map<string, boolean>;
		result: IActionItem[];
	}

	export interface ActionExecutor {
		ExecuteAction(action: IActionItem, state: any, runHistoryData: executionJSON): Promise<string>;
	}

	export interface executionJSON {
		waitEndTime: string,
		startTime: string,
		endTime: string,
		status: string,
		id: string,
		name: string,
		type: string,
		definition: any,
		connectionReferences: any,
		trigger: any,
		macroid: string
	}
}