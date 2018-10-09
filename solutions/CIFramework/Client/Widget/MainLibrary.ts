/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/// <reference path="Constants.ts" />
/// <reference path="../PostmsgWrapper.ts" />
/// <reference path="../../../../references/external/TypeDefinitions/lib.es6.d.ts" />
namespace Microsoft.CIFramework
{
	let targetWindow: Window;
	let postMessage: postMessageNamespace.postMsgWrapper;
	let domains : string[] = [];

	function initialize()
	{
		let startTime = Date.now();
		targetWindow = window.top;
		var anchorElement = document.createElement("a");
		var anchorDomain = document.referrer;
		try {
			var crmDomain: string = document.querySelector('script[' + Constants.ScriptIdAttributeName + '="' + Constants.ScriptIdAttributeValue + '"]').getAttribute(Constants.ScriptCRMUrlAttributeName);
			if (crmDomain) {
				anchorDomain = crmDomain;
			}
		}
		catch (error) { }
		anchorElement.href = anchorDomain;
		domains.push(anchorElement.protocol + "//" + anchorElement.hostname);
		if(domains.length > 1)
		{
			//To-Do Log the Message that more than one domains are present
		}
		postMessage = new postMessageNamespace.postMsgWrapper(window, domains, null);
    window.addEventListener("focus", function () {
            setMode(1); //TODO: replace 1 with named constant
        });
	}

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
					return reject(error.get(Constants.message));
				});
		});
	}

	/**
	 * API to set/reset value of ClickToAct for a widget
	 *
	 * @param value. When set to 'true', invoke the registered 'onclicktoact' handler.
	 *
	*/
    export function setClickToAct(value: boolean): Promise<void> {
        if (isNullOrUndefined(value)) {
            value = false;
        }
        const payload: postMessageNamespace.IExternalRequestMessageType = {
            messageType: MessageType.setClickToAct,
            messageData: new Map().set(Constants.value, value)
        }

        return sendMessage<void>(setClickToAct.name, payload, false);
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
	 * returns a boolean Promise: 'true' if openForm API succeeded and 'false' otherwise
	*/
	export function openForm(entityFormOptions: string, entityFormParameters?: string): Promise<boolean> {
		if(!(isNullOrUndefined(entityFormOptions) || entityFormOptions == "")){
			const payload: postMessageNamespace.IExternalRequestMessageType = {
				messageType: MessageType.openForm,
				messageData: new Map().set(Constants.entityFormOptions, entityFormOptions).set(Constants.entityFormParameters, entityFormParameters)
			}

			return sendMessage<boolean>(openForm.name, payload, false, true);
		}else{
			if(isNullOrUndefined(entityFormOptions) || entityFormOptions == ""){
				return postMessageNamespace.rejectWithErrorMessage("The EntityFormOptions parameter is blank. Provide a value to the parameter.");
			}
		}
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
	export function retrieveRecord(entityName: string, entityId: string, query?: string): Promise<Map<string, any>> {
		if(!(isNullOrUndefined(entityName) || entityName == "") && !(isNullOrUndefined(entityId) || entityId == "")){
			const payload: postMessageNamespace.IExternalRequestMessageType = {
				messageType: MessageType.retrieveRecord,
				messageData: new Map().set(Constants.entityName, entityName).set(Constants.entityId, entityId).set(Constants.queryParameters, query)
			}

			return sendMessage<Map<string, any>>(retrieveRecord.name, payload, false);
		}else{
			if(isNullOrUndefined(entityName) || entityName == ""){
				return postMessageNamespace.rejectWithErrorMessage("The EntityName parameter is blank. Provide a value to the parameter.");
			}
			if(isNullOrUndefined(entityId) || entityId == ""){
				return postMessageNamespace.rejectWithErrorMessage("The EntityName parameter is blank. Provide a value to the parameter.");
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
	 * @param data. A map  object representing the modified data to be set
	 *
	 * @returns a map Promise: the result of the update operation
	*/
	export function updateRecord(entityName: string, entityId: string, data: Map<string, any>): Promise<Map<string, any>> {
		if(!(isNullOrUndefined(entityName) || entityName == "") && !(isNullOrUndefined(entityId) || entityId == "") && !(isNullOrUndefined(data)) && data.size > 0){
			const payload: postMessageNamespace.IExternalRequestMessageType = {
				messageType: MessageType.updateRecord,
				messageData: new Map().set(Constants.entityName, entityName).set(Constants.entityId, entityId).set(Constants.value, data)
			}

			return sendMessage<Map<string, any>>(retrieveRecord.name, payload, false);
		}else{
			if(isNullOrUndefined(entityName) || entityName == ""){
				return postMessageNamespace.rejectWithErrorMessage("The EntityName parameter is blank. Provide a value to the parameter.");
			}
			if(isNullOrUndefined(entityId) || entityId == ""){
				return postMessageNamespace.rejectWithErrorMessage("The EntityId parameter is blank. Provide a value to the parameter.");
			}
			if(isNullOrUndefined(data) || data.size == 0){
				return postMessageNamespace.rejectWithErrorMessage("The parameter is blank. Provide a value to the parameter to update the record.");
			}
		}
	}

	/**
	 * API to create a new entity record based on passed data
	 * Invokes the api Xrm.WebApi.createRecord(entityName, data)
	 * https://docs.microsoft.com/en-us/dynamics365/customer-engagement/developer/clientapi/reference/xrm-webapi/createrecord
	 *
	 * @param entityName. The entity name to retrieve
	 * @param data. A map  object representing the entity record data to be set
	 *
	 * @returns a map Promise: the result of the create operation
	*/
	export function createRecord(entityName: string, data: Map<string, any>): Promise<Map<string, any>> {
		if(!(isNullOrUndefined(entityName) || entityName == "") && !(isNullOrUndefined(data)) && data.size > 0){
			const payload: postMessageNamespace.IExternalRequestMessageType = {
				messageType: MessageType.createRecord,
				messageData: new Map().set(Constants.entityName, entityName).set(Constants.value, data)
			}

			return sendMessage<Map<string, any>>(createRecord.name, payload, false);
		}else{
			if(isNullOrUndefined(entityName) || entityName == ""){
				return postMessageNamespace.rejectWithErrorMessage("The EntityName parameter is blank. Provide a value to the parameter.");
			}
			if(isNullOrUndefined(data) || data.size == 0){
				return postMessageNamespace.rejectWithErrorMessage("Provide a value to the parameter to create record.");
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
	export function deleteRecord(entityName: string, entityId: string): Promise<Map<string, any>> {
		if(!(isNullOrUndefined(entityName) || entityName == "") && !(isNullOrUndefined(entityId) || entityId == "")){
			const payload: postMessageNamespace.IExternalRequestMessageType = {
				messageType: MessageType.deleteRecord,
				messageData: new Map().set(Constants.entityName, entityName).set(Constants.entityId, entityId)
			}

			return sendMessage<Map<string, any>>(deleteRecord.name, payload, false);
		}else{
			if(isNullOrUndefined(entityName) || entityName == ""){
				return postMessageNamespace.rejectWithErrorMessage("The EntityName parameter is blank. Provide a value to the parameter.");
			}
			if(isNullOrUndefined(entityId) || entityId == ""){
				return postMessageNamespace.rejectWithErrorMessage("The EntityId parameter is blank. Provide a value to the parameter.");
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
	export function searchAndOpenRecords(entityName: string, queryParmeters: string, searchOnly: boolean) : Promise<Map<string, any>>
	{
		if(!(isNullOrUndefined(entityName) || entityName == "") && !(isNullOrUndefined(queryParmeters) || queryParmeters == "") && !(isNullOrUndefined(searchOnly))){
			const payload: postMessageNamespace.IExternalRequestMessageType = {
				messageType: searchOnly ? MessageType.search : MessageType.searchAndOpenRecords,
				messageData: new Map().set(Constants.entityName, entityName).set(Constants.queryParameters, queryParmeters).set(Constants.searchOnly, searchOnly)
			}
			return sendMessage<Map<string, any>>(searchAndOpenRecords.name, payload, false);
		}else{
			if(isNullOrUndefined(entityName) || entityName == ""){
				return postMessageNamespace.rejectWithErrorMessage("The EntityName parameter is blank. Provide a value to the parameter.");
			}
			if(isNullOrUndefined(queryParmeters) || queryParmeters == ""){
				return postMessageNamespace.rejectWithErrorMessage("The queryParmeters parameter is blank. Provide a value to the parameter.");
			}
			if(isNullOrUndefined(searchOnly)){
				return postMessageNamespace.rejectWithErrorMessage("The searchOnly parameter is blank. Provide a value to the parameter.");
			}
		}
	}

	/**
	 * API to get the Panel State
	 *
	 * @returns a Promise: '0' for minimized and '1' for docked mode
	*/
    export function getMode(): Promise<number> {
        const payload: postMessageNamespace.IExternalRequestMessageType = {
            messageType: MessageType.getMode,
            messageData: new Map()
        }

        return sendMessage<number>(getMode.name, payload, false);
    }

	/**
	 * API to get the current main UCI page details
	 *
	 * @returns a Promise: map with available details of the current page
	 *  'appid', 'pagetype', 'record-id' (if available), 'clientUrl', 'appUrl',
	 * 'orgLcid', 'orgUniqueName', 'userId', 'userLcid', 'username'
	*/
    export function getEnvironment(): Promise<Map<string, any>> {
        const payload: postMessageNamespace.IExternalRequestMessageType = {
            messageType: MessageType.getEnvironment,
            messageData: new Map()
        }

        return sendMessage<Map<string, any>>(getEnvironment.name, payload, false);
    }

	/**
	 * API to get the Panel width
	 *
	 * @returns a Promise with the panel width
	*/
    export function getWidth(): Promise<number> {
        let startTime = Date.now();
        const payload: postMessageNamespace.IExternalRequestMessageType = {
            messageType: MessageType.getWidth,
            messageData: new Map()
        }

        return sendMessage<number>(getWidth.name, payload, false);
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
		}else{
			return postMessageNamespace.rejectWithErrorMessage("The setWidth parameter value is invalid. Provide a positive number to the parameter.");
		}
	}

	/**
	 * API to set the Panel State
	 *
	 * @params value. The mode to set on the panel, '0' - minimized, '1' - docked
	*/
	export function setMode(value : number) : Promise<void>
	{
		let startTime = Date.now();
		if(!isNullOrUndefined(value) && (value == 0 || value == 1)){
			const payload: postMessageNamespace.IExternalRequestMessageType = {
				messageType: MessageType.setMode,
				messageData: new Map().set(Constants.value, value)
			}

			return sendMessage<void>(setMode.name, payload, false);
		}else{
			return postMessageNamespace.rejectWithErrorMessage("The setMode paramter value must be 0 or 1.");
		}
	}

	/**
	 * API to check the whether clickToAct functionality is enabled or not
	 *
	 * @returns a boolean Promise on whether ClickToAct is currently enabled
	*/
    export function getClickToAct(): Promise<boolean> {
        let startTime = Date.now();
        const payload: postMessageNamespace.IExternalRequestMessageType = {
            messageType: MessageType.getClickToAct,
            messageData: new Map()
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
	export function addHandler(eventName: string, handlerFunction: ((eventData:Map<string, any>) => Promise<Map<string, any>>))
	{
		let startTime = Date.now();
		if(!(isNullOrUndefined(eventName) || eventName == "") && !isNullOrUndefined(handlerFunction)){
			postMessage.addHandler(eventName, handlerFunction);
		}else{
			if(isNullOrUndefined(eventName) || eventName == ""){
				return postMessageNamespace.rejectWithErrorMessage("The parameter EventName is blank. Provide a value to the parameter.");
			}
			if(isNullOrUndefined(handlerFunction)){
				return postMessageNamespace.rejectWithErrorMessage("Passing data parameters to addHandler is mandatory.");
			}
		}
	}

	/**
	 * API to remove the subscriber
	 */
	export function removeHandler(eventName: string, handlerFunction: ((eventData:Map<string, any>) => Promise<Map<string, any>>))
	{
		let startTime = Date.now();
		if(!(isNullOrUndefined(eventName) || eventName == "") && !isNullOrUndefined(handlerFunction)){
			postMessage.removeHandler(eventName, handlerFunction);
		}else{
			if(isNullOrUndefined(eventName) || eventName == ""){
				return postMessageNamespace.rejectWithErrorMessage("The EventName parameter is blank. Provide a value to the parameter.");
			}
			if(isNullOrUndefined(handlerFunction)){
				return postMessageNamespace.rejectWithErrorMessage("Passing data parameters to removeHandler is mandatory.");
			}
		}
	}

	/**
	 * API to set the agent presence
	 * Invokes the API setAgentPresence(presenceInfo)
	 * @param presenceInfo - Details of the Presence to be set for the Agent

	 * @returns a Promise: HTMLDivElement after setting the Agent Presence
	 */
	export function setAgentPresence(presenceInfo: any): Promise<HTMLDivElement> {
		if (!(isNullOrUndefined(presenceInfo))) {
			const payload: postMessageNamespace.IExternalRequestMessageType = {
				messageType: MessageType.setAgentPresence,
				messageData: new Map().set(Constants.presenceInfo, presenceInfo)
			}
			return sendMessage<HTMLDivElement>(setAgentPresence.name, payload, false);
		}
		else {
			return postMessageNamespace.rejectWithErrorMessage("The presenceInfo parameter is null. Provide a value to the parameter");
		}
	}

	/**
	 * API to set all the presences
	 * Invokes the API setAllPresence(presenceList)
	 * @param presenceList - Array containing all the available Presences

	 * @returns a Promise: HTMLDivElement after setting the list of presences
	 */
	export function setAllPresence(presenceList: any): Promise<HTMLDivElement> {
		if (!(isNullOrUndefined(presenceList))) {
			const payload: postMessageNamespace.IExternalRequestMessageType = {
				messageType: MessageType.setAllPresence,
				messageData: new Map().set(Constants.presenceList, presenceList)
			}
			return sendMessage<HTMLDivElement>(setAllPresence.name, payload, false);
		}
		else {
			return postMessageNamespace.rejectWithErrorMessage("The presenceList parameter is null. Provide a value to the parameter");
		}
	}

	window.onload = () => {
		initialize();
	}; 
}