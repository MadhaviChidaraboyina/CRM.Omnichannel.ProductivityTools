/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

/// <reference path="Client.ts" />
/// <reference path="Constants.ts" />
/// <reference path="State.ts" />
/// <reference path="../TelemetryHelper.ts" />

namespace Microsoft.CIFramework.Internal
{
	/**
	 * mapping of handlers for each API needed by postMessageWrapper
	 */
	const apiHandlers = new Map<string, any>([
		["setclicktoact", [setClickToAct]],
		["searchandopenrecords", [searchAndOpenRecords]],
		["openform", [openForm]],
		["createrecord", [createRecord]],
		["updaterecord", [updateRecord]],
		["retrieverecord", [retrieveRecord]],
		["deleterecord", [deleteRecord]],
		["search", [search]],
		["setmode", [setMode]],
		["setwidth", [setWidth]],
		["getmode", [getMode]],
		["getenvironment", [getEnvironment]],
		["getwidth", [getWidth]],
		["getclicktoact", [getClickToAct]]
	]);

	/**
	 * Variable that will store all the info needed for library. There should be no other global variables in the library. Any info that needs to be stored should go into this.
	 */
	let state = {} as IState;
	const listenerWindow = window.parent;

	declare var Xrm : any;

	/**
	 * This method will starting point for CI library and perform setup operations. retrieve the providers from CRM and initialize the Panels, if needed.
	 * returns false to disable the button visibility
	 */
	export function initializeCI(clientType: number) : boolean
	{
		if (Xrm.Utility.getGlobalContext().client.getClient() === "UnifiedServiceDesk") {
			return false;
		}
		let startTime = Date.now();
		// set the client implementation.
		state.client = setClient(clientType);

		// Todo - User story - 1083257 - Get the no. of widgets to load based on client & listener window and accordingly set the values.
		const widgetCount = 1;
		const appId = top.location.search.split('appid=')[1].split('&')[0];
		Xrm.WebApi.retrieveMultipleRecords(Constants.providerLogicalName, "?$orderby=msdyn_sortorder asc").then(
		(result : any) => {

			if (result && result.entities) {

					//event listener for the onCliCkToAct event
					listenerWindow.removeEventListener(Constants.CIClickToAct, onClickToAct);
					listenerWindow.addEventListener(Constants.CIClickToAct, onClickToAct);
					state.client.registerHandler(Constants.ModeChangeHandler, onModeChanged);
					state.client.registerHandler(Constants.SizeChangeHandler, onSizeChanged);
					state.client.registerHandler(Constants.NavigationHandler, onPageNavigation);
					// populate ciProviders in state.
					state.ciProviders = new Map<string, any>();
					var roles = Xrm.Utility.getGlobalContext().getUserRoles();

					for (var x of result.entities) {
						var apps = x[Constants.appSelectorFieldName];
						var currRoles = x[Constants.roleSelectorFieldName];
						var foundProvider = false;
						currRoles = (currRoles != null) ? currRoles.split(";") : null;
						for (var role of roles) {
							if (apps && apps.indexOf(appId) !== -1) {
								if (currRoles && currRoles.Length > 2 && currRoles.indexOf(role) === -1) {
									continue;
								}
								state.ciProviders.set(x[Constants.landingUrl], new CIProvider(x));
								foundProvider = true;
							}
						}
						if (foundProvider) break;
					}
					// initialize and set post message wrapper.
					state.messageLibrary = new postMessageNamespace.postMsgWrapper(listenerWindow, Array.from(state.ciProviders.keys()), apiHandlers);
					// load the widgets onto client. 
					for (let [key, value] of state.ciProviders) {
						state.client.loadWidget(key, value.label);
					}
				}

				reportUsage(initializeCI.name + "Executed successfully in" + (Date.now() - startTime) + "ms for providers: " + mapToString(new Map<string, any>().set(Constants.value, result.entities)));
			},
			(error: Error) => {
				reportError(initializeCI.name + "Execution failed  in" + (Date.now() - startTime) + "ms with error as " + error.message);
			}
		);

		return false;
	}

	/*Utility function to raise events registered for the framework*/
	function raiseEvent(data: Map<string, any>, messageType: string, reportMessage: string, eventCheck?: (value: any) => boolean, noTimeout?: boolean): void {
		let startTime = Date.now();
		const payload: postMessageNamespace.IExternalRequestMessageType = {
			messageType: messageType,
			messageData: data
		}

		let widgetIFrame = (<HTMLIFrameElement>listenerWindow.document.getElementById(Constants.widgetIframeId));//TO-DO: for multiple widgets, this might be the part of for loop
		for (let [key, value] of state.ciProviders) {
			if (eventCheck) {
				if (eventCheck(value)) {
					state.messageLibrary.postMsg(widgetIFrame.contentWindow, payload, key, true, noTimeout);
				}
			}
			else {
				state.messageLibrary.postMsg(widgetIFrame.contentWindow, payload, key, true, noTimeout);
			}
		}
		reportUsage(reportMessage);
	}

	function clickToActCheck(value: any): boolean {
		if (!isNullOrUndefined(value) && value.clickToAct) {
			return true;
		}
		return false;
	}

	function getProvider(parameters: Map<string, any>, reqParams?: string[]): [CIProvider, string] {
		if (!parameters) {
			return [null, "Parameter list cant be empty"];
		}
		if (!parameters.get(Constants.originURL)) {
			return [null, "Paramter:url cant be empty"];
		}
		if (reqParams) {
			reqParams.forEach(function (param) {
				if (isNullOrUndefined(parameters.get(param))) {
					return [null, "Parameter: " + param + " cant be empty"];
				}
			});
		}
		let provider = state.ciProviders.get(parameters.get(Constants.originURL));
		return (provider && provider.providerId ? [provider, null] : [null, "Associated Provider record not found"]);
	}
	/**
	 * The handler called by the client for a size-changed event. The client is
	 * expected to pass a CustomEvent event object with details of the event
	 * This handler will pass the sizeChanged message to the widget as an event
	 * resulting in the registered widget-side handler, if any, being invoked
	 *
	 * @param event. event.detail will be set to a map {"value": width} where 'width'
	 * is a number representing the new panel width as passed by the client
	 */
	function onSizeChanged(event: CustomEvent): void {
		raiseEvent(event.detail, MessageType.onSizeChanged, onSizeChanged.name + " invoked");
	}

	/**
	 * The handler called by the client for a mode-changed event. The client is expected
	 * to pass a CustomEvent object with details of the event. This handler will pass the
	 * modeChanged message to the widget as an event resulting in the registered widget-side
	 * handler, if any, being invoked
	 *
	 * @param event. event.detail will be set to a map {"value": mode} where 'mode'
	 * is the numeric value of the current mode as passed by the client
	 */
	function onModeChanged(event: CustomEvent): void {
		raiseEvent(event.detail, MessageType.onModeChanged, onModeChanged.name + " invoked");
	}

	/**
	 * The handler called by the client for a page navigation event. The client is expected
	 * to pass a CustomEvent object with details of the event. This handler will pass the
	 * PageNavigation message to the widget as an event resulting in the registered widget-side
	 * handler, if any, being invoked
	 *
	 * @param event. event.detail will be set to a map {"value": pageURL} where 'pageURL'
	 * is the URL of the page being navigated to
	 */
	function onPageNavigation(event: CustomEvent): void {
		raiseEvent(event.detail, MessageType.onPageNavigate, onPageNavigation.name + " invoked");
	}
	/**
	 * setClickToAct API's client side handler that post message library will invoke. 
	*/
	export function setClickToAct(parameters: Map<string, any>) : Promise<Map<string,any>>
	{
		const [provider, errMsg] = getProvider(parameters, [Constants.value]);
		if(provider)
		{
			return new Promise<Map<string, any>>((resolve, reject) =>
			{
				return state.client.updateRecord(Constants.providerLogicalName, provider.providerId,
										new Map<string, any>([ [Constants.clickToActAttributeName, parameters.get(Constants.value) as boolean] ])).then(
				(result: Map<string, any>) =>
				{
					provider.clickToAct = parameters.get(Constants.value) as boolean;
					state.ciProviders.set(parameters.get(Constants.originURL), provider);
					reportUsage(setClickToAct.name + "Executed successfully with result as " + mapToString(result));
					return resolve(result);
				},
				(error: Map<string, any>) =>
				{
					return reject(error);
				});
			});
		}
		else
		{
			return rejectWithErrorMessage(errMsg, setClickToAct.name);
		}
	}

	/**
	* API to check ClickToAct is enabled or not
	*/
	export function getClickToAct(parameters: Map<string, any>) : Promise<Map<string, any>>
	{
		const [provider, errMsg] = getProvider(parameters);
		if(provider)
		{
			reportUsage(getClickToAct.name + "Executed successfully with result as " + provider.clickToAct);
			return Promise.resolve(new Map().set(Constants.value, provider.clickToAct));
		}
		else
		{
			return rejectWithErrorMessage(errMsg, getClickToAct.name);
		}

	}

	/**
	 * setMode API's client side handler that post message library will invoke. 
	*/
	export function setMode(parameters: Map<string, any>) : Promise<Map<string, any>>
	{
		const [provider, errMsg] = getProvider(parameters, [Constants.value]);
		if(provider)
		{
			state.client.setWidgetMode(null, parameters.get(Constants.value) as number);
			reportUsage(setMode.name + "Executed successfully");
			return Promise.resolve(new Map());
		}
		else
		{
			return rejectWithErrorMessage(errMsg, setMode.name);
		}
	}

	/**
	 * setWidth API's client side handler that post message library will invoke. 
	*/
	export function setWidth(parameters: Map<string, any>) : Promise<Map<string, any>>
	{
		const [provider, errMsg] = getProvider(parameters, [Constants.value]);
		if(provider)
		{
			state.client.setWidgetWidth(null, parameters.get(Constants.value) as number);
			reportUsage(setWidth.name + "Executed successfully");
			return Promise.resolve(new Map());
		}
		else
		{
			return rejectWithErrorMessage(errMsg, setWidth.name);
		}
	}

	/**
	 * getEnvironment API's client side handler that post message library will invoke. 
	*/
	export function getEnvironment(parameters: Map<string, any>): Promise<Map<string, any>> {
		const [provider, errMsg] = getProvider(parameters); // if there are multiple widgets then we need this to get the value of particular widget 
		if (provider) {
			let data = state.client.getEnvironment();
			reportUsage(getEnvironment.name + "Executed successfully: " + JSON.stringify(data));
			return Promise.resolve(new Map().set(Constants.value, data));
		}
		else {
			return rejectWithErrorMessage(errMsg, getEnvironment.name);
		}
	}

	/**
	 * getMode API's client side handler that post message library will invoke.
	*/
	export function getMode(parameters: Map<string, any>) : Promise<Map<string, any>>
	{
		const [provider, errMsg] = getProvider(parameters); // if there are multiple widgets then we need this to get the value of particular widget
		if(provider)
		{
			reportUsage(getMode.name + "Executed successfully");
			return Promise.resolve(new Map().set(Constants.value, state.client.getWidgetMode()));
		}
		else
		{
			return rejectWithErrorMessage(errMsg, getMode.name);
		}
	}

	/**
	 * getWidth API's client side handler that post message library will invoke. 
	*/
	export function getWidth(parameters: Map<string, any>) : Promise<Map<string, any>>
	{
		const [provider, errMsg] = getProvider(parameters);
		if(provider)
		{
			reportUsage(getWidth.name + "Executed successfully");
			return Promise.resolve(new Map().set(Constants.value, state.client.getWidgetWidth()));
		}
		else
		{
			return rejectWithErrorMessage(errMsg, getWidth.name);
		}
	}

	/**
	 * subscriber of onClickToAct event
	*/
	export function onClickToAct(event: CustomEvent) : void
	{
		raiseEvent(buildMap(event.detail), MessageType.onClickToAct, onClickToAct.name + " event recieved from client with event data as " + eventToString(event), clickToActCheck);
	}

	export function openForm(parameters: Map<string, any>): Promise<Map<string, any>> {
		const [provider, errMsg] = getProvider(parameters, [Constants.entityFormOptions, Constants.entityFormParameters]);
		if (provider) {
			return state.client.openForm(parameters.get(Constants.entityFormOptions), parameters.get(Constants.entityFormParameters));
		}
		else {
			return rejectWithErrorMessage(errMsg, openForm.name);
		}
	}

	export function retrieveRecord(parameters: Map<string, any>): Promise<Map<string, any>> {
		const [provider, errMsg] = getProvider(parameters, [Constants.entityName, Constants.entityId, Constants.queryParameters]);
		if (provider) {
			return new Promise<Map<string, any>>((resolve, reject) => {
				state.client.retrieveRecord(parameters.get(Constants.entityName), parameters.get(Constants.entityId), parameters.get(Constants.queryParameters)).then(
					function (res) {
						return resolve(new Map<string, any>().set(Constants.value, res));
					},
					(error: Error) => {
						return rejectWithErrorMessage(error.message, retrieveRecord.name);
					}
				);
			});
		}
		else {
			return rejectWithErrorMessage(errMsg, retrieveRecord.name);
		}
	}

	export function updateRecord(parameters: Map<string, any>): Promise<Map<string, any>> {
		const [provider, errMsg] = getProvider(parameters, [Constants.entityName, Constants.entityId, Constants.value]);
		if (provider) {
			return new Promise<Map<string, any>>((resolve, reject) => {
				state.client.updateRecord(parameters.get(Constants.entityName), parameters.get(Constants.entityId), parameters.get(Constants.value)).then(
					function (res) {
						return resolve(new Map<string, any>().set(Constants.value, res));
					},
					(error: Error) => {
						return rejectWithErrorMessage(error.message, updateRecord.name);
					}
				);
			});
		}
		else {
			return rejectWithErrorMessage(errMsg, updateRecord.name);
		}
	}

	export function createRecord(parameters: Map<string, any>): Promise<Map<string, any>> {
		const [provider, errMsg] = getProvider(parameters, [Constants.entityName, Constants.value]);
		if (provider) {
			return new Promise<Map<string, any>>((resolve, reject) => {
				state.client.createRecord(parameters.get(Constants.entityName), null, parameters.get(Constants.value)).then(
					function (res) {
						return resolve(new Map<string, any>().set(Constants.value, res));
					},
					(error: Error) => {
						return rejectWithErrorMessage(error.message, createRecord.name);
					}
				);
			});
		}
		else {
			return rejectWithErrorMessage(errMsg, createRecord.name);
		}
	}

	export function deleteRecord(parameters: Map<string, any>): Promise<Map<string, any>> {
		const [provider, errMsg] = getProvider(parameters, [Constants.entityName, Constants.entityId]);
		if (provider) {
			return new Promise<Map<string, any>>((resolve, reject) => {
				state.client.deleteRecord(parameters.get(Constants.entityName), parameters.get(Constants.entityId)).then(
					function (res) {
						return resolve(new Map<string, any>().set(Constants.value, res));
					},
					(error: Error) => {
						return rejectWithErrorMessage(error.message, deleteRecord.name);
					}
				);
			});
		}
		else {
			return rejectWithErrorMessage(errMsg, deleteRecord.name);
		}
	}

	export function searchAndOpenRecords(parameters: Map<string, any>) : Promise<Map<string,any>>
	{
		const [provider, errMsg] = getProvider(parameters);
		if (provider) {
			return doSearch(parameters, false);
		}
		else {
			return rejectWithErrorMessage(errMsg, searchAndOpenRecords.name);
		}
	}


	function doSearch(parameters: Map<string, any>, searchOnly: boolean) : Promise<Map<string,any>>
	{
		const [provider, errMsg] = getProvider(parameters, [Constants.entityName, Constants.queryParameters]);
		if(provider)
		{
			return state.client.retrieveMultipleAndOpenRecords(parameters.get(Constants.entityName), parameters.get(Constants.queryParameters), searchOnly);
		}
		else
		{
			return rejectWithErrorMessage(errMsg, doSearch.name);
		}
	}

	export function search(parameters: Map<string, any>) : Promise<Map<string,any>>
	{
		const [provider, errMsg] = getProvider(parameters);
		if (provider) {
			return doSearch(parameters, true);
		}
		else {
			return rejectWithErrorMessage(errMsg, search.name);
		}
	}
}
