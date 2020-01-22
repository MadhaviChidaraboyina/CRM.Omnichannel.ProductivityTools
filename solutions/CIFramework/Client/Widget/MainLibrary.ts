/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/// <reference path="../Constants.ts" />
/// <reference path="../Analytics/AnalyticsDataModel.ts" />

namespace Microsoft.CIFramework
{
	let targetWindow: Window;
	let postMessage: postMessageNamespace.postMsgWrapper;

	let domains: string[] = [];

	let Constants = Microsoft.CIFramework.Constants;

	/**
	 * utility func to check whether an object is null or undefined
	 */
	/** @internal */
	export function isNullOrUndefined(obj: any) {
		return (obj == null || typeof obj === "undefined");
	}

	/** @internal */
	function initialize()
	{
		let startTime = Date.now();
		targetWindow = window.top;
		var anchorElement = document.createElement("a");
		var anchorDomain = document.referrer;
		var crmUrl: string = "";
		try {
			var scriptTag = document.querySelector('script[' + Constants.ScriptIdAttributeName + '="' + Constants.ScriptIdAttributeValue + '"]');
			var crmDomain: string = scriptTag.getAttribute(Constants.ScriptCRMUrlAttributeName);
			if (crmDomain) {
				anchorDomain = crmDomain;
			}
		}
		catch (error) { }
		try {
			// Get the crmUrl from window.location
			crmUrl = Microsoft.CIFramework.Utility.extractParameter(window.location.search, Constants.UciLib);
		}
		catch (error) { }
		anchorElement.href = anchorDomain;
		domains.push(anchorElement.protocol + "//" + anchorElement.hostname);
		if (crmUrl != "" && crmUrl != null) {
			let anchor = document.createElement("a");
			anchor.href = crmUrl;
			domains.push(anchor.protocol + "//" + anchor.hostname);
		}
		if(domains.length > 1)
		{
			//To-Do Log the Message that more than one domains are present
		}
		postMessage = new postMessageNamespace.postMsgWrapper(window, domains, null, targetWindow);
		var dict: any = {};
		dict["detail"] = domains;
		var event_1 = new CustomEvent(Constants.CIFInitEvent, dict);
		window.setTimeout(function () {
			window.dispatchEvent(event_1);
		}, 0);
	}

	/** @internal */
	function sendMessage<T>(funcName: string, payload: postMessageNamespace.IExternalRequestMessageType, isEvent: boolean, noTimeout?: boolean) : Promise<T>{
		let startTime = Date.now();

		return new Promise<T>((resolve, reject) => {
			//domains contains the domains this widget can talk to , which is the CRM instance, so passing that as target origin.
			return postMessage.postMsg(targetWindow, payload, domains[domains.length - 1], false, noTimeout)
				.then((result: Map<string, any>) => {
					if (result && (!isNullOrUndefined(result.get(Constants.value)))) {
						return resolve(result.get(Constants.value));
					}
					else {
						return resolve(null);
					}
				},
				(error: Map<string, any>) => {
					return reject(error);
				});
		});
	}

	/**
	* API to log telemetry errors for API failures
	*/
	function logErrorsAndReject<T>(errorMsg: string, messageType: string, correlationid?: string): Promise<T>{
		const payload: postMessageNamespace.IExternalRequestMessageType = {
			messageType: MessageType.logErrorsAndReject,
			messageData: new Map().set(Constants.errorMessage, errorMsg).set(Constants.correlationId, correlationid).set(Constants.functionName, messageType)
		}
		sendMessage<T>(logErrorsAndReject.name, payload, false);
		return postMessageNamespace.rejectWithErrorMessage(errorMsg);
	}

	/**
			 * API to initialize the CIF Log Analytics session
			* @param data - Object containing the init data
			* @returns a Promise: JSON String with status message
			*/
	export function initLogAnalytics(data: any, correlationId?: string): Promise<string> {
		if (!isNullOrUndefined(data)) {
			const payload: postMessageNamespace.IExternalRequestMessageType = {
				messageType: MessageType.initLogAnalytics,
				messageData: new Map().set(AnalyticsConstants.analyticsdata, data)
					.set(Constants.correlationId, correlationId)
					.set(AnalyticsConstants.analyticsEventType, EventType.SystemEvent)
			}
			return sendMessage<string>(initLogAnalytics.name, payload, false);
		}
		else {
			let errorMsg = "initLogAnalytics payload is not valid. ";
			return logErrorsAndReject(errorMsg, MessageType.logAnalyticsEvent, correlationId);
		}
	}

	/**
	 * API to to check value of IsConsoleApp for a widget
	 *
	 * @param value. When set to 'true', then it's a console App.
	 *
	*/
	export function isConsoleApp(): Promise<boolean> {
		let startTime = Date.now();
		const payload: postMessageNamespace.IExternalRequestMessageType = {
			messageType: MessageType.isConsoleApp,
			messageData: new Map()
		}

		return sendMessage<boolean>(isConsoleApp.name, payload, false);
	}

	/**
	 * API to set/reset value of ClickToAct for a widget
	 *
	 * @param value. When set to 'true', invoke the registered 'onclicktoact' handler.
	 *
	*/
	export function setClickToAct(value: boolean, correlationId?: string): Promise<void> {
		if (isNullOrUndefined(value)) {
			value = false;
		}
		const payload: postMessageNamespace.IExternalRequestMessageType = {
			messageType: MessageType.setClickToAct,
			messageData: new Map().set(Constants.value, value).set(Constants.correlationId, correlationId)
		}

		return sendMessage<void>(setClickToAct.name, payload, false);
	}

	/**
	 * API to insert notes control
	 *
	 * @param value. It's a string which contains session,activity details
	 *
	*/
	export function insertNotes(entityName: string, entitySetName: string, entityId: string, annotationId: string, correlationId?: string): Promise<string> {	
		if(!(isNullOrUndefined(entityName) || isNullOrUndefined(entitySetName) || isNullOrUndefined(entityId))){
			const payload: postMessageNamespace.IExternalRequestMessageType = {
				messageType: MessageType.insertNotes,
				messageData: new Map().set(Constants.entityName,entityName).set(Constants.entitySetName,entitySetName).set(Constants.entityId,entityId).set(Constants.annotationId,annotationId).set(Constants.correlationId, correlationId)
			}
			return new Promise((resolve, reject) => {
				return sendMessage<Map<string, any>>(insertNotes.name, payload, false, true).then(
					function (result: Map<string, any>) {
						return resolve(JSON.stringify(Microsoft.CIFramework.Utility.buildEntity(result)));
					},
					function (error: Map<string, any>) {
						return reject(JSON.stringify(Microsoft.CIFramework.Utility.buildEntity(error)));
					});
			});
		}else{
			if (isNullOrUndefined(entityName)) {
				let errorMsg = "The entityName parameter is blank. Provide a value to the parameter.";
				return logErrorsAndReject(errorMsg, MessageType.insertNotes, correlationId);
			}
			if (isNullOrUndefined(entitySetName)) {
				let errorMsg = "The entitySetName parameter is blank. Provide a value to the parameter.";
				return logErrorsAndReject(errorMsg, MessageType.insertNotes, correlationId);
			}
			if (isNullOrUndefined(entityId)) {
				let errorMsg = "The entityId parameter is blank. Provide a value to the parameter.";
				return logErrorsAndReject(errorMsg, MessageType.insertNotes, correlationId);
			}
		}
	}

	/**
	 * API to invoke toast popup widget
	 *
	 * @param value. It's a string which contains header,body of the popup
	 *
	*/
	export function notifyEvent(input: any, correlationId?: string): Promise<string> {	
		if (!isNullOrUndefined(input)) {
			var notificationMap = new Map();
			notificationMap.set(Constants.eventType, input.eventType);
			notificationMap.set(Constants.correlationId, correlationId);
			notificationMap.set(Constants.templateName, input.templateName)
			notificationMap.set(Constants.templateParameters, input.templateParameters);
			notificationMap.set(Constants.templateNameResolver, input.templateNameResolver);
			if (!isNullOrUndefined(input.notificationUXObject) )
			notificationMap.set(Constants.notificationUXObject,Microsoft.CIFramework.Utility.buildMap(JSON.parse(input.notificationUXObject)));

			const payload: postMessageNamespace.IExternalRequestMessageType = {
				messageType: MessageType.notifyEvent,
				messageData: notificationMap
			}
			return new Promise((resolve, reject) => {
				return sendMessage<Map<string, any>>(notifyEvent.name, payload, false, true).then(
					function (result: Map<string, any>) {
						return resolve(JSON.stringify(Microsoft.CIFramework.Utility.buildEntity(result)));
					},
					function (error: Map<string, any>) {
						return reject(JSON.stringify(Microsoft.CIFramework.Utility.buildEntity(error)));
					});
			});
		}
		else {
				let errorMsg = "The Input parameter is blank. Provide a value.";
				return logErrorsAndReject(errorMsg, MessageType.notifyEvent, correlationId);
			}
		}

	/**
	 * API to open the create form for given entity with data passed in pre-populated
	 * Invokes the api Xrm.Navigation.openForm(entityFormOptions, formParameters)
	 * https://docs.microsoft.com/en-us/dynamics365/customer-engagement/developer/clientapi/reference/xrm-navigation/openform
	 *
	 * @param entityFormOptions. A JSON string encoding the entityFormOptions parameter of
	 * the openForm API
	 * @param entityFormParameters. A JSON string encoding the formParameters parameter
	 * of the openForm API
	 *
	 * returns an Object Promise: The returned Object has the same structure as the underlying Xrm.Navigation.openForm() API
	*/
	export function openForm(entityFormOptions: string, entityFormParameters?: string, correlationId?: string): Promise<string> {
		if(!(isNullOrUndefined(entityFormOptions) || entityFormOptions == "")){
			const payload: postMessageNamespace.IExternalRequestMessageType = {
				messageType: MessageType.openForm,
				messageData: new Map().set(Constants.entityFormOptions, entityFormOptions).set(Constants.entityFormParameters, entityFormParameters).set(Constants.correlationId, correlationId)
			}

			return new Promise((resolve, reject) => {
				return sendMessage<Object>(openForm.name, payload, false, true).then(
					function (result: Object) {
						return resolve(JSON.stringify(result));
					},
					function (error: Map<string, any>) {
						return reject(JSON.stringify(Microsoft.CIFramework.Utility.buildEntity(error)));
					});
			});

		}else{
			if (isNullOrUndefined(entityFormOptions) || entityFormOptions == "") {
				let errorMsg = "The EntityFormOptions parameter is blank. Provide a value to the parameter.";
				return logErrorsAndReject(errorMsg, MessageType.openForm, correlationId);
			}
		}
	}

	/**
	 * API to refresh the main page if an entity form is currently opened
	 * 
	 *
	 * @param save. Optional boolean on whether to save the form on refresh	 
	 * returns a boolean Promise
	*/
	export function refreshForm(save?: boolean, correlationId?: string): Promise<string> {
		const payload: postMessageNamespace.IExternalRequestMessageType = {
			messageType: MessageType.refreshForm,
			messageData: new Map().set(Constants.Save, save).set(Constants.correlationId, correlationId)
		}

		return new Promise((resolve, reject) => {
			return sendMessage<Object>(refreshForm.name, payload, false, false).then(
				function (result: Object) {
					return resolve(JSON.stringify(result));
				},
				function (error: Map<string, any>) {
					return reject(JSON.stringify(Microsoft.CIFramework.Utility.buildEntity(error)));
				});
		});
	}

	/**
	 * API to retrieve a given entity record based on entityId and oData query
	 * Invokes the api Xrm.WebApi.retrieveRecord(entityName, entityId, options)
	 * https://docs.microsoft.com/en-us/dynamics365/customer-engagement/developer/clientapi/reference/xrm-webapi/retrieverecord
	 *
	 * @param entityName. The entity name to retrieve
	 * @param entityId. The CRM record Id to retrieve
	 *
	 * @returns a map Promise: the result of the retrieve operation depending upon the query
	*/
	export function retrieveRecord(entityName: string, entityId: string, query?: string, correlationId?: string): Promise<string> {
		if(!(isNullOrUndefined(entityName) || entityName == "") && !(isNullOrUndefined(entityId) || entityId == "")){
			const payload: postMessageNamespace.IExternalRequestMessageType = {
				messageType: MessageType.retrieveRecord,
				messageData: new Map().set(Constants.entityName, entityName).set(Constants.entityId, entityId).set(Constants.queryParameters, query).set(Constants.correlationId, correlationId)
			}
			return new Promise((resolve, reject) => {
				return sendMessage<Map<string, any>>(retrieveRecord.name, payload, false).then(
					function (result: Map<string, any>) {
						return resolve(JSON.stringify(Microsoft.CIFramework.Utility.buildEntity(result)));
					},
					function (error: Map<string, any>) {
						return reject(JSON.stringify(Microsoft.CIFramework.Utility.buildEntity(error)));
					});
			});
		}else{
			if (isNullOrUndefined(entityName) || entityName == "") {
				let errorMsg = "The EntityName parameter is blank.Provide a value to the parameter.";
				return logErrorsAndReject(errorMsg, MessageType.retrieveRecord, correlationId);
			}
			if (isNullOrUndefined(entityId) || entityId == "") {
				let errorMsg = "The EntityId parameter is blank. Provide a value to the parameter.";
				return logErrorsAndReject(errorMsg, MessageType.retrieveRecord, correlationId);
			}
		}
	}

	/**
	 * API to update a given entity record based on entityId
	 * Invokes the api Xrm.WebApi.updateRecord(entityName, entityId, data)
	 * https://docs.microsoft.com/en-us/dynamics365/customer-engagement/developer/clientapi/reference/xrm-webapi/updaterecord
	 *
	 * @param entityName. The entity name to retrieve
	 * @param entityId. The CRM record Id to retrieve
	 * @param data. A JSON string encoding the data parameter of the updateRecord XRM API
	 *
	 * @returns a map Promise: the result of the update operation
	*/
	export function updateRecord(entityName: string, entityId: string, data: string, correlationId?: string): Promise<string> {
		if(!(isNullOrUndefined(entityName) || entityName == "") && !(isNullOrUndefined(entityId) || entityId == "") && !isNullOrUndefined(data)){
			const payload: postMessageNamespace.IExternalRequestMessageType = {
				messageType: MessageType.updateRecord,
				messageData: new Map().set(Constants.entityName, entityName).set(Constants.entityId, entityId).set(Constants.value, Microsoft.CIFramework.Utility.buildMap(JSON.parse(data))).set(Constants.correlationId, correlationId)
			}

			return new Promise((resolve, reject) => {
				return sendMessage<Map<string, any>>(updateRecord.name, payload, false).then(
					function (result: Map<string, any>) {
						return resolve(JSON.stringify(Microsoft.CIFramework.Utility.buildEntity(result)));
					},
					function (error: Map<string, any>) {
						return reject(JSON.stringify(Microsoft.CIFramework.Utility.buildEntity(error)));
					});
			});
		}else{
			if (isNullOrUndefined(entityName) || entityName == "") {
				let errorMsg = "The EntityName parameter is blank. Provide a value to the parameter.";
				return logErrorsAndReject(errorMsg, MessageType.updateRecord, correlationId);
			}
			if (isNullOrUndefined(entityId) || entityId == "") {
				let errorMsg = "The EntityId parameter is blank. Provide a value to the parameter.";
				return logErrorsAndReject(errorMsg, MessageType.updateRecord, correlationId);
			}
			if (isNullOrUndefined(data)) {
				let errorMsg = "The data parameter is blank. Provide a value to the parameter to update the record.";
				return logErrorsAndReject(errorMsg, MessageType.updateRecord, correlationId);
			}
		}
	}

	/**
	 * API to create a new entity record based on passed data
	 * Invokes the api Xrm.WebApi.createRecord(entityName, data)
	 * https://docs.microsoft.com/en-us/dynamics365/customer-engagement/developer/clientapi/reference/xrm-webapi/createrecord
	 *
	 * @param entityName. The entity name to retrieve
	 * @param data. A JSON string encoding the data parameter of the createRecord XRM API
	 *
	 * @returns a map Promise: the result of the create operation
	*/
	export function createRecord(entityName: string, data: string, correlationId?: string): Promise<string> {
		if(!(isNullOrUndefined(entityName) || entityName == "") && !isNullOrUndefined(data)){
			const payload: postMessageNamespace.IExternalRequestMessageType = {
				messageType: MessageType.createRecord,
				messageData: new Map().set(Constants.entityName, entityName).set(Constants.value, Microsoft.CIFramework.Utility.buildMap(JSON.parse(data))).set(Constants.correlationId, correlationId)
			}

			return new Promise((resolve, reject) => {
				return sendMessage<Map<string, any>>(createRecord.name, payload, false).then(
					function (result: Map<string, any>) {
						return resolve(JSON.stringify(Microsoft.CIFramework.Utility.buildEntity(result)));
					},
					function (error: Map<string, any>) {
						return reject(JSON.stringify(Microsoft.CIFramework.Utility.buildEntity(error)));
					});
			});
		}else{
			if (isNullOrUndefined(entityName) || entityName == "") {
				let errorMsg = "The EntityName parameter is blank. Provide a value to the parameter.";
				return logErrorsAndReject(errorMsg, MessageType.createRecord, correlationId);
			}
			if (isNullOrUndefined(data)) {
				let errorMsg = "Provide a value to the data parameter to create record.";
				return logErrorsAndReject(errorMsg, MessageType.createRecord, correlationId);
			}
		}
	}

	/**
	 * API to delete an entity record based on entityId
	 * Invokes the api Xrm.WebApi.deleteRecord(entityName, entityId)
	 * https://docs.microsoft.com/en-us/dynamics365/customer-engagement/developer/clientapi/reference/xrm-webapi/deleterecord
	 *
	 * @param entityName. The entity name to delete
	 * @param entityId. The record id to delete
	 *
	 * @returns a map Promise: the result of the delete operation
	*/
	export function deleteRecord(entityName: string, entityId: string, correlationid?: string): Promise<string> {
		if(!(isNullOrUndefined(entityName) || entityName == "") && !(isNullOrUndefined(entityId) || entityId == "")){
			const payload: postMessageNamespace.IExternalRequestMessageType = {
				messageType: MessageType.deleteRecord,
				messageData: new Map().set(Constants.entityName, entityName).set(Constants.entityId, entityId).set(Constants.correlationId, correlationid)
			}

			return new Promise((resolve, reject) => {
				return sendMessage<Map<string, any>>(deleteRecord.name, payload, false).then(
					function (result: Map<string, any>) {
						return resolve(JSON.stringify(Microsoft.CIFramework.Utility.buildEntity(result)));
					},
					function (error: Map<string, any>) {
						return reject(JSON.stringify(Microsoft.CIFramework.Utility.buildEntity(error)));
					});
			});
		}else{
			if (isNullOrUndefined(entityName) || entityName == "") {
				let errorMsg = "The EntityName parameter is blank. Provide a value to the parameter.";
				return logErrorsAndReject(errorMsg, MessageType.deleteRecord, correlationid);
			}
			if (isNullOrUndefined(entityId) || entityId == "") {
				let errorMsg = "The EntityId parameter is blank. Provide a value to the parameter.";
				return logErrorsAndReject(errorMsg, MessageType.deleteRecord, correlationid);
			}
		}
	}

	/**
	 * API to search records with respect to query parameters and open the respective record
	 *
	 * @param entityName. The name of the entity to search
	 * @param queryParameter. An oData query string as supported by Dynamics CRM defining the search
	 * @param searchOnly. When set to 'false', if the search record was a single record, open the record on the main UCI page
	 * When set to 'true' return the search results but don't perform any navigation on the main page
	 *
	 * Returns a map Promise representing the search results as per the search query
	*/
	export function searchAndOpenRecords(entityName: string, queryParmeters: string, searchOnly: boolean, correlationid?: string) : Promise<string>
	{
		if(!(isNullOrUndefined(entityName) || entityName == "") && !(isNullOrUndefined(queryParmeters) || queryParmeters == "") && !(isNullOrUndefined(searchOnly))){
			const payload: postMessageNamespace.IExternalRequestMessageType = {
				messageType: searchOnly ? MessageType.search : MessageType.searchAndOpenRecords,
				messageData: new Map().set(Constants.entityName, entityName).set(Constants.queryParameters, queryParmeters).set(Constants.searchOnly, searchOnly).set(Constants.correlationId, correlationid)
			}

			return new Promise((resolve, reject) => {
				return sendMessage<Map<string, any>>(searchAndOpenRecords.name, payload, false).then(
					function (result: Map<string, any>) {
						return resolve(JSON.stringify(Microsoft.CIFramework.Utility.buildEntity(result)));
					},
					function (error: Map<string, any>) {
						return reject(JSON.stringify(Microsoft.CIFramework.Utility.buildEntity(error)));
					});
			});
		}else{
			if (isNullOrUndefined(entityName) || entityName == "") {
				let errorMsg = "The EntityName parameter is blank. Provide a value to the parameter.";
				return logErrorsAndReject(errorMsg, MessageType.searchAndOpenRecords, correlationid);
			}
			if (isNullOrUndefined(queryParmeters) || queryParmeters == "") {
				let errorMsg = "The queryParmeters parameter is blank. Provide a value to the parameter.";
				return logErrorsAndReject(errorMsg, MessageType.searchAndOpenRecords, correlationid);
			}
			if (isNullOrUndefined(searchOnly)) {
				let errorMsg = "The searchOnly parameter is blank. Provide a value to the parameter.";
				return logErrorsAndReject(errorMsg, MessageType.searchAndOpenRecords, correlationid);
			}
		}
	}

	/**
	 * API to get the Panel State
	 *
	 * @returns a Promise: '0' for minimized and '1' for docked mode
	*/
	export function getMode(correlationid?: string): Promise<number> {
		const payload: postMessageNamespace.IExternalRequestMessageType = {
			messageType: MessageType.getMode,
			messageData: new Map().set(Constants.correlationId, correlationid)
		}

		return sendMessage<number>(getMode.name, payload, false);
	}

	/**
	 * API to get the current main UCI page details
	 *
	 * @returns a Promise: map with available details of the current page
	 *  'appid', 'pagetype', 'record-id' (if available), 'clientUrl', 'appUrl',
	 * 'orgLcid', 'orgUniqueName', 'userId', 'userLcid', 'username', orgId
	*/
	export function getEnvironment(correlationId?: string): Promise<string> {
		const payload: postMessageNamespace.IExternalRequestMessageType = {
			messageType: MessageType.getEnvironment,
			messageData: new Map().set(Constants.correlationId, correlationId)
		}

		return new Promise((resolve, reject) => {
			return sendMessage<Map<string, any>>(getEnvironment.name, payload, false).then(
				function (result: Map<string, any>) {
					return resolve(JSON.stringify(Microsoft.CIFramework.Utility.buildEntity(result)));
				},
				function (error: Map<string, any>) {
					return reject(JSON.stringify(Microsoft.CIFramework.Utility.buildEntity(error)));
				});
		});
	}

	/**
	 * API to get the Panel width
	 *
	 * @returns a Promise with the panel width
	*/
	export function getWidth(correlationId?: string): Promise<number> {
		let startTime = Date.now();
		const payload: postMessageNamespace.IExternalRequestMessageType = {
			messageType: MessageType.getWidth,
			messageData: new Map().set(Constants.correlationId, correlationId)
		}

		return sendMessage<number>(getWidth.name, payload, false);
	}
	/**
	 * API to call the openkbsearch control
	 *
	 * @params value. search string
	*/
	export function openKBSearchControl(value : string, correlationId?: string) : Promise<boolean>
	{
		let startTime = Date.now();
		if(!isNullOrUndefined(value)){
			const payload: postMessageNamespace.IExternalRequestMessageType = {
				messageType: MessageType.openKBSearchControl,
				messageData: new Map().set(Constants.SearchString, value).set(Constants.correlationId, correlationId)
			}

			return sendMessage<boolean>(openKBSearchControl.name, payload, false);
		} else {
			let errorMsg = "The openKBSearchControl parameter value is invalid. Provide a positive number to the parameter.";
			return logErrorsAndReject(errorMsg, MessageType.openKBSearchControl, correlationId);
		}
	}

	/**
	 * API to set the Panel width
	 *
	 * @params value. The panel width to be set in pixels
	*/
	export function setWidth(value : number) : Promise<void>
	{
		let startTime = Date.now();
		if(!isNullOrUndefined(value) && value >= 0){
			const payload: postMessageNamespace.IExternalRequestMessageType = {
				messageType: MessageType.setWidth,
				messageData: new Map().set(Constants.value, value)
			}

			return sendMessage<void>(setWidth.name, payload, false);
		} else {
			let errorMsg = "The setWidth parameter value is invalid. Provide a positive number to the parameter.";
			return logErrorsAndReject<void>(errorMsg, MessageType.setWidth, "");
		}
	}

	/**
	 * API to set the Panel State
	 *
	 * @params value. The mode to set on the panel, '0' - minimized, '1' - docked, '2' - hidden
	*/
	export function setMode(value : number, correlationId?: string) : Promise<void>
	{
		let startTime = Date.now();
		if(!isNullOrUndefined(value) && (value == 0 || value == 1 || value == 2)){
			const payload: postMessageNamespace.IExternalRequestMessageType = {
				messageType: MessageType.setMode,
				messageData: new Map().set(Constants.value, value).set(Constants.correlationId, correlationId)
			}

			return sendMessage<void>(setMode.name, payload, false);
		} else {
			let errorMsg = "The setMode paramter value must be 0, 1 or 2.";
			return logErrorsAndReject<void>(errorMsg, MessageType.setMode, correlationId);
		}
	}

	/**
	 * API to check the whether clickToAct functionality is enabled or not
	 *
	 * @returns a boolean Promise on whether ClickToAct is currently enabled
	*/
	export function getClickToAct(correlationId?: string): Promise<boolean> {
		let startTime = Date.now();
		const payload: postMessageNamespace.IExternalRequestMessageType = {
			messageType: MessageType.getClickToAct,
			messageData: new Map().set(Constants.correlationId, correlationId)
		}

		return sendMessage<boolean>(getClickToAct.name, payload, false);
	}


	/**
	 * API to add the subscriber for the named event
	 *
	 * @params eventName. The event for which to set the handler. The currently supported events are
	 *  'onclicktoact' - when a click-to-act enabled field is clicked by the agent
	 *  'onmodechanged' - when the panel mode is manually toggled between 'minimized' and 'docked'
	 *  'onsizechanged' - when the panel size is manually changed by dragging
	 *  'onpagenavigate' - triggered before a navigation event occurs on the main page
	 *  'onsendkbarticle' - triggered when the agent clicks on the 'send KB Article' button on the KB control
	 * @params func. The handler function to invoke on the event
	 */
	export function addHandler(eventName: string, handlerFunction: ((eventData:string) => Promise<Object>), correlationId?: string)
	{
		let startTime = Date.now();
		if(!(isNullOrUndefined(eventName) || eventName == "") && !isNullOrUndefined(handlerFunction)){
			postMessage.addHandler(eventName, handlerFunction);
			const payload: postMessageNamespace.IExternalRequestMessageType = {
				messageType: MessageType.addGenericHandler,
				messageData: new Map().set(Constants.eventType, eventName).set(Constants.correlationId, correlationId)
			}
			sendMessage<boolean>("addGenericHandler", payload, false);
		}else{
			if (isNullOrUndefined(eventName) || eventName == "") {
				let errorMsg = "The parameter EventName is blank. Provide a value to the parameter.";
				return logErrorsAndReject(errorMsg, MessageType.addGenericHandler, correlationId);
			}
			if (isNullOrUndefined(handlerFunction)) {
				let errorMsg = "Passing data parameters to addHandler is mandatory.";
				return logErrorsAndReject(errorMsg, MessageType.addGenericHandler, correlationId);
			}
		}
	}

	/**
	 * API to remove the subscriber
	 */
	export function removeHandler(eventName: string, handlerFunction: ((eventData: string) => Promise<Object>), correlationId?: string)
	{
		let startTime = Date.now();
		if(!(isNullOrUndefined(eventName) || eventName == "") && !isNullOrUndefined(handlerFunction)){
			postMessage.removeHandler(eventName, handlerFunction);
			const payload: postMessageNamespace.IExternalRequestMessageType = {
				messageType: MessageType.removeGenericHandler,
				messageData: new Map().set(Constants.eventType, eventName).set(Constants.correlationId, correlationId)
			}
			sendMessage<boolean>("removeGenericHandler", payload, false);
		}else{
			if (isNullOrUndefined(eventName) || eventName == "") {
				let errorMsg = "The EventName parameter is blank. Provide a value to the parameter.";
				return logErrorsAndReject(errorMsg, MessageType.removeGenericHandler, correlationId);
			}
			if (isNullOrUndefined(handlerFunction)) {
				let errorMsg = "Passing data parameters to removeHandler is mandatory.";
				return logErrorsAndReject(errorMsg, MessageType.removeGenericHandler, correlationId);
			}
		}
	}

	/**
	 * API to get the EntityMetadata
	 * Invokes the API Xrm.Utility.getEntityMetadata(entityName, attributes)
	 * https://docs.microsoft.com/en-us/dynamics365/customer-engagement/developer/clientapi/reference/xrm-utility/getentitymetadata
	 * @params entityName - Name of the Entity whose metadata is to be fetched
	 * attributes - The attributes to get metadata for
	 * 
	 * @returns a Promise: JSON String with available metadata of the current entity
	*/
	export function getEntityMetadata(entityName: string, attributes?: Array<string>, correlationId?: string): Promise<string> {
		if (!(isNullOrUndefined(entityName) || entityName == "")) {
			const payload: postMessageNamespace.IExternalRequestMessageType = {
				messageType: MessageType.getEntityMetadata,
				messageData: new Map().set(Constants.entityName, entityName).set(Constants.Attributes, attributes).set(Constants.correlationId, correlationId)
			}
			return sendMessage<string>(getEntityMetadata.name, payload, false);
		}
		else {
			if (isNullOrUndefined(entityName) || entityName == "") {
				let errorMsg = "The EntityName parameter is blank. Provide a value to the parameter";
				return logErrorsAndReject(errorMsg, MessageType.getEntityMetadata, correlationId);
			}
		}
	}

	/**
	 * API to search based on the Search String
	 * Invokes the API Xrm.Navigation.navigateTo(PageInput)
	 * @param entityName -Name of the Entity for which the records are to be fetched
	 * @param searchString - String based on which the search is to be made
	 */
	export function renderSearchPage(entityName: string, searchString: string, correlationId?: string): Promise<void> {
		if (!(isNullOrUndefined(entityName) || entityName == "") && !(isNullOrUndefined(searchString))) {
			const payload: postMessageNamespace.IExternalRequestMessageType = {
				messageType: MessageType.renderSearchPage,
				messageData: new Map().set(Constants.entityName, entityName).set(Constants.SearchString, searchString).set(Constants.correlationId, correlationId)
			}
			return sendMessage<void>(renderSearchPage.name, payload, false);
		}
		else {
			if (isNullOrUndefined(entityName) || entityName == "") {
				let errorMsg = "The EntityName Parameter is blank. Provide a value to the parameter";
				return logErrorsAndReject<void>(errorMsg, MessageType.renderSearchPage, correlationId);
			}
			if (isNullOrUndefined(searchString)) {
				let errorMsg = "The SearchString Parameter cannot be NULL";
				return logErrorsAndReject<void>(errorMsg, MessageType.renderSearchPage, correlationId);
			}
		}
	}

	/**
	 * API to set the agent presence
	 * Invokes the API setAgentPresence(presenceInfo)
	 * @param presenceInfo - Details of the Presence to be set for the Agent

	 * @returns a Promise: Boolean Status after setting the Agent Presence
	 */
	export function setAgentPresence(presenceInfo: string, correlationId?: string): Promise<boolean> {
		if (!(isNullOrUndefined(presenceInfo))) {
			const payload: postMessageNamespace.IExternalRequestMessageType = {
				messageType: MessageType.setAgentPresence,
				messageData: new Map().set(Constants.presenceInfo, presenceInfo).set(Constants.correlationId, correlationId)
			}
			return sendMessage<boolean>(setAgentPresence.name, payload, false);
		}
		else {
			let errorMsg = "The presenceInfo parameter is null. Provide a value to the parameter";
			return logErrorsAndReject(errorMsg, MessageType.setAgentPresence, correlationId);
		}
	}

	/**
	 * API to get all Sessions
	 */
	export function getAllSessions(correlationId?: string): Promise<string[]> {
		const payload: postMessageNamespace.IExternalRequestMessageType = {
			messageType: MessageType.getAllSessions,
			messageData: new Map().set(Constants.correlationId, correlationId)
		}
		return sendMessage<string[]>(getAllSessions.name, payload, false);
	}

	/**
	 * API to get focused Session
	 */
	export function getFocusedSession(correlationid?: string): Promise<string> {
		const payload: postMessageNamespace.IExternalRequestMessageType = {
			messageType: MessageType.getFocusedSession,
			messageData: new Map().set(Constants.correlationId, correlationid)
		}
		return sendMessage<string>(getFocusedSession.name, payload, false);
	}

	/**
	 * API to get Session details
	 */
	export function getSession(sessionId: string, correlationid?: string): Promise<any> {
		if (!(isNullOrUndefined(sessionId) || sessionId == "")) {
			const payload: postMessageNamespace.IExternalRequestMessageType = {
				messageType: MessageType.getSession,
				messageData: new Map().set(Constants.sessionId, sessionId).set(Constants.correlationId, correlationid)
			}
			return sendMessage<any>(getSession.name, payload, false);
		}
		else {
			let errorMsg = "The sessionId parameter is null. Provide a value to the parameter";
			return logErrorsAndReject(errorMsg, MessageType.getSession, correlationid);
		}	
	}

	/**
	 * API to check if a new Session can be created
	 */
	export function canCreateSession(correlationId?: string): Promise<boolean> {
		const payload: postMessageNamespace.IExternalRequestMessageType = {
			messageType: MessageType.canCreateSession,
			messageData: new Map().set(Constants.correlationId, correlationId)
		}
		return sendMessage<boolean>(canCreateSession.name, payload, false);
	}

	/**
	 * API to create Session
	 */
	export function createSession(input: any, correlationId?: string, providerSessionId?: string): Promise<string> {
		if (!isNullOrUndefined(input)) {
			let customerName = input.customerName;
			if (isNullOrUndefined(customerName) && !isNullOrUndefined(input.templateParameters)) {
				customerName = input.templateParameters.customerName;
			}
			const payload: postMessageNamespace.IExternalRequestMessageType = {
				messageType: MessageType.createSession,
				messageData: new Map().set(Constants.input, input).set(Constants.context, input.context).set(Constants.customerName, customerName).set(Constants.correlationId, correlationId).set(Constants.providerSessionId, providerSessionId)
			}
			return sendMessage<string>(createSession.name, payload, false);
		}
		else {
			let errorMsg = "Some of required parameters are null";
			return logErrorsAndReject(errorMsg, MessageType.createSession, correlationId);
		}
	}

	/**
	 * API to notify incoming on an invisible Session
	 */
	export function requestFocusSession(sessionId: string, messagesCount?: number, correlationId?: string): Promise<string> {
		if (!isNullOrUndefined(sessionId)) {
			const payload: postMessageNamespace.IExternalRequestMessageType = {
				messageType: MessageType.requestFocusSession,
				messageData: new Map().set(Constants.sessionId, sessionId).set(Constants.messagesCount, messagesCount).set(Constants.correlationId, correlationId)
			}
			return sendMessage<string>(requestFocusSession.name, payload, false);
		}
		else {
			let errorMsg = "SessionID is null or undefined";
			return logErrorsAndReject(errorMsg, MessageType.requestFocusSession, correlationId);
		}
	}

	/**
* API to notify the KPI Breach
*/
	export function notifyKpiBreach(sessionId: string, shouldReset: boolean, details?: string, correlationId?: string): Promise<string> {
		const payload: postMessageNamespace.IExternalRequestMessageType = {
			messageType: MessageType.notifyKpiBreach,
			messageData: new Map().set(Constants.correlationId, correlationId)
		}
		return sendMessage<string>(notifyKpiBreach.name, payload, false);
	}

	/**
* API to notify the new activity on the session 
*/
	export function notifyNewActivity(sessionId: string, count: boolean, correlationId?: string): Promise<string> {
		const payload: postMessageNamespace.IExternalRequestMessageType = {
			messageType: MessageType.notifyNewActivity,
			messageData: new Map().set(Constants.correlationId, correlationId)
		}
		return sendMessage<string>(notifyNewActivity.name, payload, false);
	}

	/**
	 * API to get the focused tab in focused Session
	 */
	export function getFocusedTab(correlationId?: string): Promise<string> {
		const payload: postMessageNamespace.IExternalRequestMessageType = {
			messageType: MessageType.getFocusedTab,
			messageData: new Map().set(Constants.correlationId, correlationId)
		}
		return sendMessage<string>(getFocusedTab.name, payload, false);
	}

	/**
	 * API to get the focused tab in focused Session
	 */
	export function getTabs(name: string, tag?: string, correlationId?: string): Promise<string[]> {
		if (!isNullOrUndefined(name)) {
			const payload: postMessageNamespace.IExternalRequestMessageType = {
				messageType: MessageType.getTabsByTagOrName,
				messageData: new Map().set(Constants.templateTag, tag).set(Constants.nameParameter, name).set(Constants.correlationId, correlationId)
			}
			return sendMessage<string[]>(getTabs.name, payload, false);
		}
		else {
			if (isNullOrUndefined(name)) {
				let errorMsg = "The name parameter is null. Provide a value to the parameter";
				return logErrorsAndReject(errorMsg, MessageType.getTabsByTagOrName, correlationId);
			}
		}
	}

	export function refreshTab(tabId: string, correlationId?: string): Promise<void> {
		if (!isNullOrUndefined(tabId)) {
			const payload: postMessageNamespace.IExternalRequestMessageType = {
				messageType: MessageType.refreshTab,
				messageData: new Map().set(Constants.tabId, tabId).set(Constants.correlationId, correlationId)
			}
			return sendMessage<void>(refreshTab.name, payload, false);
		}
		else {
			let errorMsg = "The tabId Parameter is blank. Provide a value to the parameter";
			return logErrorsAndReject<void>(errorMsg, MessageType.refreshTab, correlationId);
		}
	}

	export function setSessionTitle(input: any, correlationId?: string): Promise<string> {
		if (!isNullOrUndefined(input)) {
			const payload: postMessageNamespace.IExternalRequestMessageType = {
				messageType: MessageType.setSessionTitle,
				messageData: new Map().set(Constants.input, input).set(Constants.correlationId, correlationId)
			}
			return sendMessage<string>(setSessionTitle.name, payload, false);
		}
		else {
			let errorMsg = "The input Parameter is blank. Provide a value to the parameter";
			return logErrorsAndReject(errorMsg, MessageType.setSessionTitle, correlationId);
		}
	}

	export function setTabTitle(tabId: string, input: any, correlationId?: string): Promise<string> {
		if (!isNullOrUndefined(input) && !isNullOrUndefined(tabId)) {
			const payload: postMessageNamespace.IExternalRequestMessageType = {
				messageType: MessageType.setTabTitle,
				messageData: new Map().set(Constants.input, input).set(Constants.tabId, tabId).set(Constants.correlationId, correlationId)
			}
			return sendMessage<string>(setTabTitle.name, payload, false);
		}
		else {
			if (isNullOrUndefined(tabId)) {
				let errorMsg = "The tabId Parameter is blank. Provide a value to the parameter";
				return logErrorsAndReject(errorMsg, MessageType.setTabTitle, correlationId);
			}
			if (isNullOrUndefined(input)) {
				let errorMsg = "The input Parameter cannot be NULL";
				return logErrorsAndReject(errorMsg, MessageType.setTabTitle, correlationId);
			}
		}
	}
	/**
	 * API to create a Tab in focused Session
	 */
	export function createTab(input: any, correlationId?: string): Promise<string> {
		if (!isNullOrUndefined(input)) {
			const payload: postMessageNamespace.IExternalRequestMessageType = {
				messageType: MessageType.createTab,
				messageData: new Map().set(Constants.input, input).set(Constants.correlationId, correlationId)
			}
			return sendMessage<string>(createTab.name, payload, false);
		}
		else {
			let errorMsg = "Some of the required parameters are Null";
			return logErrorsAndReject(errorMsg, MessageType.createTab, correlationId);
		}
	}

	/**
	 * API to focus a Tab in focused Session
	 */
	export function focusTab(tabId: string, correlationId?: string): Promise<string> {
		if (!isNullOrUndefined(tabId)) {
			const payload: postMessageNamespace.IExternalRequestMessageType = {
				messageType: MessageType.focusTab,
				messageData: new Map().set(Constants.tabId, tabId).set(Constants.correlationId, correlationId)
			}
			return sendMessage<string>(focusTab.name, payload, false);
		}
		else {
			let errorMsg = "tabId is null or undefined";
			return logErrorsAndReject(errorMsg, MessageType.focusTab, correlationId);
		}
	}

	/**
	 * API to set all the presences
	* Invokes the API initializeAgentPresenceList(presenceList)
	* @param presenceList - Array containing all the available Presences

	* @returns a Promise: Boolean Status after setting the list of presences
	*/
	export function initializeAgentPresenceList(presenceList: any, correlationId?: string): Promise<boolean> {
		if (!(isNullOrUndefined(presenceList))) {
			const payload: postMessageNamespace.IExternalRequestMessageType = {
				messageType: MessageType.initializeAgentPresenceList,
				messageData: new Map().set(Constants.presenceList, presenceList).set(Constants.correlationId, correlationId)
			}
			return sendMessage<boolean>(initializeAgentPresenceList.name, payload, false);
		}
		else {
			let errorMsg = "The presenceList parameter is null. Provide a value to the parameter";
			return logErrorsAndReject(errorMsg, MessageType.initializeAgentPresenceList, correlationId);
		}
	}

	/**
	 * API to update conversation data
	* @param data - Object containing the conversation data
	* @returns a Promise: JSON String with status message
	*/
	export function updateConversation(entityId: string , data: any, correlationId?: string): Promise<string>
	{
		if (!(isNullOrUndefined(entityId) || entityId == "") && !isNullOrUndefined(data)) {
			const payload: postMessageNamespace.IExternalRequestMessageType = {
				messageType: MessageType.updateConversation,
				messageData: new Map().set(Constants.entityName, Constants.liveWorkItemEntity ).set(Constants.entityId, entityId).set(Constants.value, Microsoft.CIFramework.Utility.buildMap(JSON.parse(data))).set(Constants.correlationId, correlationId)
			}
			return new Promise((resolve, reject) => {
				return sendMessage<Map<string, any>>(updateConversation.name, payload, false).then(
					function (result: Map<string, any>) {
						return resolve(JSON.stringify(Microsoft.CIFramework.Utility.buildEntity(result)));
					},
					function (error: Map<string, any>) {
						return reject(JSON.stringify(Microsoft.CIFramework.Utility.buildEntity(error)));
					});
			});
		}else{
			if (isNullOrUndefined(entityId) || entityId == "") {
				let errorMsg = "The EntityId parameter is blank. Provide a value to the parameter.";
				return logErrorsAndReject(errorMsg, MessageType.updateConversation, correlationId);
			}
			if (isNullOrUndefined(data)) {
				let errorMsg = "The data parameter is blank. Provide a value to the parameter to update the record.";
				return logErrorsAndReject(errorMsg, MessageType.updateConversation, correlationId);
			}
		}
		
	}

	/**
	 * API to log a custom analytics event
	* @param data - Object containing the event data
	* @returns a Promise: JSON String with status message
	*/
	export function logAnalyticsEvent(data: any, eventName: string, correlationId?: string): Promise<string> {
		if (!isNullOrUndefined(data) || !isNullOrUndefined(eventName)) {
			const payload: postMessageNamespace.IExternalRequestMessageType = {
				messageType: MessageType.logAnalyticsEvent,
				messageData: new Map().set(AnalyticsConstants.analyticsdata, data)
					.set(Constants.correlationId, correlationId)
					.set(AnalyticsConstants.analyticsEventName, eventName)
					.set(AnalyticsConstants.analyticsEventType, EventType.CustomEvent)
			}
			return sendMessage<string>(logAnalyticsEvent.name, payload, false);
		}
		else {
			let errorMsg = "logAnalyticsEvent payload data or eventType is not valid. ";
			return logErrorsAndReject(errorMsg, MessageType.logAnalyticsEvent, correlationId);
		}
	}

	/**
	 * API to set automation dictionary
	* Invokes the API updateContext
	* @param input - List of parameters to be updated in form of json input, array of strings for deleting parameters
	* @returns a Promise with template parameters
	*/
	export function updateContext(input: any, sessionId?: string, isDelete?: boolean, correlationId?: string): Promise<any> {
		if (!isNullOrUndefined(input)) {
			const payload: postMessageNamespace.IExternalRequestMessageType = {
				messageType: MessageType.updateContext,
				messageData: new Map().set(Constants.input, input).set(Constants.sessionId, sessionId).set(Constants.isDelete, isDelete).set(Constants.correlationId, correlationId)
			}
			return sendMessage<any>(updateContext.name, payload, false);
		} else {
			let errorMsg = "The input parameter is null. Provide a value to the parameter";
			return logErrorsAndReject(errorMsg, MessageType.updateContext, correlationId);
		}
	}

	initialize();
}