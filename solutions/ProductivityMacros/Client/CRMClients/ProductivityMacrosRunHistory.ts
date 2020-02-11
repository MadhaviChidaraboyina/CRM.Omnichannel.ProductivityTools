/// <reference path="Constants.ts" />
/// <reference path="Models.ts" />


namespace Microsoft.ProductivityMacros.RunHistory {

	function newGuid(): string {
		return (
			getRandomGuidSubstr(null) +
			getRandomGuidSubstr(true) +
			getRandomGuidSubstr(true) +
			getRandomGuidSubstr(null)
		);
	}

	function getRandomGuidSubstr(s: boolean): string {
		const p = (Math.random().toString(16) + "000000000").substr(2, 8);
		return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
	}

	export function initializeRunHistoryJSON(data: any, inputJSONstring: any, macroName: string): any{
		data.id = newGuid();
		data.startTime = new Date().toISOString();
		data.waitEndTime = data.startTime;
		data.type = Microsoft.ProductivityMacros.Constants.typeOfExecution;
		data.name = macroName;
		data.definition = {};
		data.definition.triggers = JSON.parse(inputJSONstring).definition.triggers;
		//data.definition.triggers.status = "Succeeded" // TODO: What to do if trigger can also execute
		data.trigger = {
			"name": Object.keys(data.definition.triggers)[0],
			"startTime": data.startTime,
			"status": Microsoft.ProductivityMacros.Constants.StatusSucceded,
			"scheduledTime": data.startTime,
			"endTime": data.startTime
		};
		data.definition.contentVersion = JSON.parse(inputJSONstring).definition.contentVersion;
		data.definition.id = newGuid();
		data.definition.version = data.definition.id;
		data.definition.name = data.definition.id;
		data.definition.type = Microsoft.ProductivityMacros.Constants.typeOfDefinition;
		data.definition.$schema = JSON.parse(inputJSONstring).definition.$schema;
		return data;
	}

	export function initializeDefinition(data: any, result: any) {
		data.definition = {};
		data.definition.createdTime = result.entities[0].createdon;
		data.definition.changedTime = result.entities[0].modifiedon;
	}

	export function setActionsInJSON(data: any, actions: IActionItem[]): any {	
		data.definition.actions = {};
		for (var i = 0; i < actions.length; i++) {
			data.definition.actions[actions[i].name] = {
				id: data.id + "/actions/" + actions[i].name,
				name: actions[i].name,
				type: actions[i].type,
				runAfter: actions[i].runAfter,
				status: Microsoft.ProductivityMacros.Constants.StatusSkipped,
				inputs: actions[i].inputs,
				actions: actions[i].actions,
				else: actions[i].else,
				expression: actions[i].expression
			};
		}
		return data;
	}

	export function createRunHistoryRecord(data: any, status: string, macroName: string): void {
		data.endTime = new Date().toISOString();
		data.status = status;
		let entityLogicalName = Microsoft.ProductivityMacros.EntityName.RunHistoryEntity;
		var workflowid;
		Xrm.WebApi.retrieveMultipleRecords(Microsoft.ProductivityMacros.EntityName.WorkflowEntity, "?$select=workflowid" + "&$filter=name eq '" + macroName + "' and category eq 6").then(function success(result) {
			workflowid = result.entities[0]["workflowid"]; 
			data.macroid = workflowid;
			let finalData = {
				"createdon": data.startTime,
				"msdyn_macrosessionid": "{" + data.id + "}",
				"msdyn_macroname@odata.bind": "workflows(" + workflowid + ")",
				"msdyn_executioncontext": JSON.stringify(data),
				"msdyn_status": data.status,
				"msdyn_name": macroName
			};
			createRecord(entityLogicalName, finalData);
		}, function (error) {
			console.log(error.message + " - Could not retrieve Macro ID");
			workflowid = "error";
		});
	}

	function createRecord(entityLogicalName: string, data: any): void {
		Xrm.WebApi.createRecord(entityLogicalName, data).then(function success(result) {
			console.log("Macro Run created");
		}, function (error) {
			console.log(error.message + " - Error creating entity record");
		});
	}

	export function setActionStatus(data: any, status: string, startTime: any, outputs: any, actionName: string, actionInputs: any): any {
		data.definition.actions = setActionStatusRecursively(data.definition.actions, status, startTime, outputs, actionName, actionInputs)
		return data;
	}

	function setActionStatusRecursively(parent: any, status: string, startTime: any, outputs: any, actionName: string, actionInputs: any): any {
		var endTime = new Date().toISOString();
		var keys = Object.keys(parent);
		for (var i = 0; i < keys.length; i++) {
			if (actionName == keys[i]) {
				parent[actionName].inputs = { "body": actionInputs };
				parent[actionName].outputs = { "body": outputs };
				parent[actionName].startTime = startTime;
				parent[actionName].status = status;
				parent[actionName].endTime = endTime;
				break;
			}
			else if (keys[i].startsWith("Condition")) {
				parent[keys[i]].actions = setActionStatusRecursively(parent[keys[i]].actions, status, startTime, outputs, actionName, actionInputs)
				parent[keys[i]].status = status;
			}
		}
		return parent;
	}
}