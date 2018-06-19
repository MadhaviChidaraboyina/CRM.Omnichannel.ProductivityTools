/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/// <reference path="Constants.ts" />
/// <reference path="../TelemetryHelper.ts" />

namespace Microsoft.CIFramework
{
	let targetWindow: Window;
	let postMessage: postMessageNamespace.postMsgWrapper;
	let domains : string[] = [];

	function initialize()
	{
		let startTime = Date.now();
		targetWindow = window.parent;
		var anchorElement = document.createElement("a");
		anchorElement.href = document.referrer;
		domains.push(anchorElement.protocol + "//" + anchorElement.hostname);
		if(domains.length > 1)
		{
			//To-Do Log the Message that more than one domains are present
		}
		postMessage = new postMessageNamespace.postMsgWrapper(window, domains, null);
		reportUsage(initialize.name + "Executed successfully in " + (Date.now() - startTime) + " Ms");
	}

	/**
	 * API to set/reset value of ClickToAct for a widget. Only when set to true, the widget's clickToAct handlers will be invoked
	*/
	export function setClickToAct(value : boolean) : Promise<void>
	{
		let startTime = Date.now();
		const payload: postMessageNamespace.IExternalRequestMessageType = {
			messageType: MessageType.setClickToAct,
			messageData: new Map().set(Constants.value, value)
		}
		
		return new Promise<void>((resolve, reject) =>
		{
			//domains contains the domains this widgte can talk to , which is the CRM instance, so passing that as target origin.
			return postMessage.postMsg(targetWindow, payload, domains[domains.length-1], false)
			.then(() =>
			{
				reportUsage(setClickToAct.name + "Executed successfully in " + (Date.now() - startTime) + " Ms");
				return resolve();
			},
			(error: Map<string, any>) => 
			{
				reportError(setClickToAct.name + "Execution failed in " + (Date.now() - startTime) + " Ms with error as " + error.get(Constants.message));
				return reject(error.get(Constants.message));
			});
		});
	}

	/**
	 * API to search records with respect to query parameters and open the respective record  
	*/
	export function searchAndOpenRecords(entityName: string, queryParmeters: string, searchOnly: boolean) : Promise<Map<string, any>>
	{
		let startTime = Date.now();
		const payload: postMessageNamespace.IExternalRequestMessageType = {
			messageType: MessageType.searchAndOpenRecords,
			messageData: new Map().set(Constants.entityName, entityName).set(Constants.queryParameters, queryParmeters).set(Constants.searchOnly, searchOnly)
		}
		
		return new Promise<Map<string, any>>((resolve, reject) =>
		{
			//domains contains the domains this widgte can talk to , which is the CRM instance, so passing that as target origin.
			return postMessage.postMsg(targetWindow, payload, domains[domains.length - 1], false)
			.then((result: Map<string, any>) =>
			{
				if(result && (!isNullOrUndefined(result.get(Constants.value))))
				{
					reportUsage(searchAndOpenRecords.name + "Executed successfully in " + (Date.now() - startTime) + " Ms with result as " + mapToString(result.get(Constants.value)));
					return resolve(result.get(Constants.value));
				}
				else
				{
					reportUsage(searchAndOpenRecords.name + "Executed successfully in " + (Date.now() - startTime) + " Ms with result as " + mapToString(result));
					return resolve(null);
				}
			},
			(error:  Map<string, any>) => 
			{
				reportError(searchAndOpenRecords.name + "Execution failed in " + (Date.now() - startTime) + " Ms with error as " + error.get(Constants.message));
				return reject(error.get(Constants.message));
			});
		});
	}

	/**
	 * API to get the Panel State
	*/
	export function getMode() : Promise<number>
	{
		let startTime = Date.now();
		const payload: postMessageNamespace.IExternalRequestMessageType = {
			messageType: MessageType.getMode,
			messageData: new Map()
		}

		return new Promise<number>((resolve, reject) =>
		{
			return postMessage.postMsg(targetWindow, payload, domains[domains.length-1], false)
			.then((result: Map<string, any>) =>
			{
				if(result && (!isNullOrUndefined(result.get(Constants.value))))
				{
					reportUsage(getMode.name + "Executed successfully in " + (Date.now() - startTime) + " Ms with result as " + result.get(Constants.value));
					return resolve(result.get(Constants.value));
				}
				else
				{
					reportUsage(getMode.name + "Executed successfully in " + (Date.now() - startTime) + " Ms with result as " + mapToString(result));
					return resolve(null);
				}
			},
			(error: Map<string, any>) => 
			{
				reportError(getMode.name + "Execution failed in " + (Date.now() - startTime) + " Ms with error as " + error.get(Constants.message));
				return reject(error.get(Constants.message));
			});
		});
	}

	/**
	 * API to get the Panel width 
	*/
	export function getWidth() : Promise<number>
	{
		let startTime = Date.now();
		const payload: postMessageNamespace.IExternalRequestMessageType = {
			messageType: MessageType.getWidth,
			messageData: new Map()
		}

		return new Promise<number>((resolve, reject) =>
		{
			return postMessage.postMsg(targetWindow, payload, domains[domains.length-1], false)
			.then((result: Map<string, any>) =>
			{
				if(result && (!isNullOrUndefined(result.get(Constants.value))))
				{
					reportUsage(getWidth.name + "Executed successfully in " + (Date.now() - startTime) + " Ms with result as " + result.get(Constants.value));
					return resolve(result.get(Constants.value));
				}
				else
				{
					reportUsage(getWidth.name + "Executed successfully in " + (Date.now() - startTime) + " Ms with result as " + mapToString(result));
					return resolve(null);
				}
			},
			(error: Map<string, any>) => 
			{
				reportError(getWidth.name + "Execution failed in " + (Date.now() - startTime) + " Ms with error as " + error.get(Constants.message));
				return reject(error.get(Constants.message));
			});
		});
	}

	/**
	 * API to set the Panel width
	*/
	export function setWidth(value : number) : Promise<void>
	{
		let startTime = Date.now();
		const payload: postMessageNamespace.IExternalRequestMessageType = {
			messageType: MessageType.setWidth,
			messageData: new Map().set(Constants.value, value)
		}

		return new Promise<void>((resolve, reject) =>
		{
			return postMessage.postMsg(targetWindow, payload, domains[domains.length-1], false)
			.then(() =>
			{
				reportUsage(setWidth.name + "Executed successfully in " + (Date.now() - startTime) + " Ms");
				return resolve();
			},
			(error: Map<string, any>) => 
			{
				reportError(setWidth.name + "Execution failed in " + (Date.now() - startTime) + " Ms with error as " + error.get(Constants.message));
				return reject(error.get(Constants.message));
			});
		});
	}

	/**
	 * API to set the Panel State 
	*/
	export function setMode(value : number) : Promise<void>
	{
		let startTime = Date.now();
		const payload: postMessageNamespace.IExternalRequestMessageType = {
			messageType: MessageType.setMode,
			messageData: new Map().set(Constants.value, value)
		}

		return new Promise<void>((resolve, reject) =>
		{
			return postMessage.postMsg(targetWindow, payload, domains[domains.length-1], false)
			.then(() =>
			{
				reportUsage(setMode.name + "Executed successfully in " + (Date.now() - startTime) + " Ms");
				return resolve();
			},
			(error: Map<string, any>) => 
			{
				reportError(setMode.name + "Execution failed in " + (Date.now() - startTime) + " Ms with error as " + error.get(Constants.message));
				return reject(error.get(Constants.message));
			});
		});
	}

	/**
	 * API to check the whether clickToAct functionality is enabled or not
	*/
	export function getClickToAct() : Promise<boolean>
	{
		let startTime = Date.now();
		const payload: postMessageNamespace.IExternalRequestMessageType = {
			messageType: MessageType.getClickToAct,
			messageData: new Map()
		}

		return new Promise<boolean>((resolve, reject) =>
		{
			return postMessage.postMsg(targetWindow, payload, domains[domains.length-1], false)
			.then((result: Map<string, any>) =>
			{
				if(result && (!isNullOrUndefined(result.get(Constants.value))))
				{
					reportUsage(getClickToAct.name + "Executed successfully in " + (Date.now() - startTime) + " Ms with result as " + result.get(Constants.value));
					return resolve(result.get(Constants.value));
				}
				else
				{
					reportUsage(getClickToAct.name + "Executed successfully in " + (Date.now() - startTime) + " Ms with result as " + mapToString(result));
					return resolve(null);
				}
			},
			(error: Map<string, any>) => 
			{
				reportError(getClickToAct.name + "Execution failed in " + (Date.now() - startTime) + " Ms with error as " + error.get(Constants.message));
				return reject(error.get(Constants.message));
			});
		});
	}

	/**
	 * API to add the subscriber for the onClickToAct event
	 */
	export function addHandler(eventName: string, func: ((eventData:Map<string, any>) => Promise<Map<string, any>>))
	{
		let startTime = Date.now();
		postMessage.addHandler(eventName, func);
		reportUsage(addHandler.name + " executed successfully in "+ (Date.now() - startTime));
	}

	/**
	 * API to remove the subscriber
	 */
	export function removeHandler(eventName: string, func: ((eventData:Map<string, any>) => Promise<Map<string, any>>))
	{
		let startTime = Date.now();
		postMessage.removeHandler(eventName, func);
		reportUsage(removeHandler.name + " executed successfully in "+ (Date.now() - startTime));
	}

	window.onload = () => {
		initialize();
	}; 
}