/// <reference path="Constants.ts" />
/// <reference path="LogicAppExecutor/Interfaces.ts" />


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

	function setActionsInConditionJSON(data: any, sessionID: string): any {

		let keys = Object.keys(data);

		for (var i = 0; i < keys.length; i++) {

			if (keys[i].startsWith("Condition")) {
				data[keys[i]] = {
					id: sessionID + "/actions/" + keys[i],
					name: keys[i],
					type: data[keys[i]].type,
					runAfter: data[keys[i]].runAfter,
					status: Microsoft.ProductivityMacros.Constants.StatusSkipped,
					actions: data[keys[i]].actions,
					else: data[keys[i]].else,
					expression: data[keys[i]].expression,
					inputs: data[keys[i]].inputs
				};
				data[keys[i]].actions = setActionsInConditionJSON(data[keys[i]].actions, sessionID);
				data[keys[i]].else.actions = setActionsInConditionJSON(data[keys[i]].else.actions, sessionID);
			}
			else {
				data[keys[i]] = {
					id: sessionID + "/actions/" + keys[i],
					name: keys[i],
					type: data[keys[i]].type,
					runAfter: data[keys[i]].runAfter,
					status: Microsoft.ProductivityMacros.Constants.StatusSkipped,
					inputs: data[keys[i]].inputs
				};
			}
		}
		return data;
	}

	export function setActionsInJSON(data: any, actions: Microsoft.LogicAppExecutor.IActionItem[], sessionID: string): any {	
		
		for (var i = 0; i < actions.length; i++) {
			if (actions[i].name.startsWith("Condition")) {
				data[actions[i].name] = {
					id: sessionID + "/actions/" + actions[i].name,
					name: actions[i].name,
					type: actions[i].type,
					runAfter: actions[i].runAfter,
					status: Microsoft.ProductivityMacros.Constants.StatusSkipped,
					actions: actions[i].actions,
					else: actions[i].else,
					expression: actions[i].expression,
					inputs: actions[i].inputs
				};
				data[actions[i].name].actions = setActionsInConditionJSON(data[actions[i].name].actions, sessionID);
				data[actions[i].name].else.actions = setActionsInConditionJSON(data[actions[i].name].else.actions, sessionID);
			}
			else {
				data[actions[i].name] = {
					id: sessionID + "/actions/" + actions[i].name,
					name: actions[i].name,
					type: actions[i].type,
					runAfter: actions[i].runAfter,
					status: Microsoft.ProductivityMacros.Constants.StatusSkipped,
					inputs: actions[i].inputs
				};
			}
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
				parent[keys[i]].else.actions = setActionStatusRecursively(parent[keys[i]].else.actions, status, startTime, outputs, actionName, actionInputs)
			}
		}
		return parent;
	}
}