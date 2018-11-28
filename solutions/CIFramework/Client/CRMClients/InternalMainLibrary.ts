/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

/// <reference path="Client.ts" />
/// <reference path="Constants.ts" />
/// <reference path="NotificationInfra.ts" />
/// <reference path="NotesInfra.ts" />
/// <reference path="../Constants.ts" />
/// <reference path="State.ts" />
/// <reference path="../TelemetryHelper.ts" />
/// <reference path="aria-webjs-sdk-1.6.2.d.ts" />

/** @internal */
namespace Microsoft.CIFramework.Internal {
	let Constants = Microsoft.CIFramework.Constants;
	/**
	 * mapping of handlers for each API needed by postMessageWrapper
	 */
	const apiHandlers = new Map<string, any>([
		["setclicktoact", [setClickToAct]],
		["notifyEvent", [notifyEvent]],
		["insertNotes", [insertNotes]],
		["searchandopenrecords", [searchAndOpenRecords]],
		["openform", [openForm]],
		["openkbsearchcontrol",[openKBSearchControl]],
		["createrecord", [createRecord]],
		["updaterecord", [updateRecord]],
		["retrieverecord", [retrieveRecord]],
		["deleterecord", [deleteRecord]],
		["search", [search]],
		["setmode", [setMode]],
		["setwidth", [setWidth]],
		["getmode", [getMode]],
		["getEntityMetadata", [getEntityMetadata]],
		["getenvironment", [getEnvironment]],
		["getwidth", [getWidth]],
		["getclicktoact", [getClickToAct]],
		["renderSearchPage", [renderSearchPage]],
		["startUISession", [startUISession]],
		["switchUISession", [switchUISession]],
		["endUISession", [endUISession]],
		["setAgentPresence", [setAgentPresence]],
		["initializeAgentPresenceList", [initializeAgentPresenceList]],
		["addGenericHandler", [addGenericHandler]],
		["removeGenericHandler", [removeGenericHandler]]
	]);

	let genericEventRegistrations = new Map<string, CIProvider[]>();

	/**
	 * Variable that will store all the info needed for library. There should be no other global variables in the library. Any info that needs to be stored should go into this.
	 */
	let state = {} as IState;
	let presence = {} as IPresenceManager;
	const listenerWindow = window.parent;

	declare var Xrm: any;
	declare var appId: string;

	/**
	 * This method will starting point for CI library and perform setup operations. retrieve the providers from CRM and initialize the Panels, if needed.
	 * returns false to disable the button visibility
	 */
	export function initializeCI(clientType: number): boolean {
		let startTime = new Date();
		let trustedDomains: string[] = [];

		// set the client implementation.
		state.client = setClient(clientType);
		if (!state.client.checkCIFCapability()) {
			return false;
		}

		SessionPanel.getInstance().setState(state);
		presence = GetPresenceManager(clientType);

		// Todo - User story - 1083257 - Get the no. of widgets to load based on client & listener window and accordingly set the values.
		appId = top.location.search.split('appid=')[1].split('&')[0];
		Xrm.WebApi.retrieveMultipleRecords(Constants.providerLogicalName, "?$filter=contains(" + Constants.appSelectorFieldName + ",'" + appId + "')&$orderby=" + Constants.sortOrderFieldName + " asc").then(
		(result : any) => {

			if (result && result.entities) {

					//event listener for the onCliCkToAct event
					listenerWindow.removeEventListener(Constants.CIClickToAct, onClickToAct);
					listenerWindow.addEventListener(Constants.CIClickToAct, onClickToAct);
					listenerWindow.removeEventListener(Constants.CISendKBArticle, onSendKBArticle);
					listenerWindow.addEventListener(Constants.CISendKBArticle, onSendKBArticle);
					listenerWindow.removeEventListener(Constants.SetPresenceEvent, onSetPresence);
					listenerWindow.addEventListener(Constants.SetPresenceEvent, onSetPresence);
					state.client.registerHandler(Constants.ModeChangeHandler, onModeChanged);
					state.client.registerHandler(Constants.SizeChangeHandler, onSizeChanged);
					state.client.registerHandler(Constants.NavigationHandler, onPageNavigation);
					let telemetryData: any = new Object();
					var defaultMode = state.client.getWidgetMode(telemetryData) as number;
					var first: boolean = true;

					var environmentInfo: any = [];
					environmentInfo["orgId"] = Xrm.Utility.getGlobalContext().organizationSettings.organizationId;
					environmentInfo["orgName"] = Xrm.Utility.getGlobalContext().organizationSettings.uniqueName;
					environmentInfo["crmVersion"] = Xrm.Utility.getGlobalContext().getVersion();
					environmentInfo["appId"] = appId;
					for (var x of result.entities) {
						var currRoles = x[Constants.roleSelectorFieldName];
						currRoles = (currRoles != null) ? currRoles.split(";") : null;
						trustedDomains.push(x[Constants.landingUrl]);
						if (x[Constants.trustedDomain] != "")
							trustedDomains.push(x[Constants.trustedDomain]);

						var provider: CIProvider = new CIProvider(x, state, environmentInfo);
						if (first) {
							// initialize the session manager
							state.providerManager = new ProviderManager(state.client, x[Constants.landingUrl], provider);
							first = false;
						}
						else {
							state.providerManager.addProvider(x[Constants.landingUrl], provider);
						}

						var usageData = new UsageTelemetryData(x[Constants.providerId], x[Constants.name], x[Constants.APIVersion], x[Constants.SortOrder], appId, false, null);
						setUsageData(usageData);
					}
					// initialize and set post message wrapper.
				state.messageLibrary = new postMessageNamespace.postMsgWrapper(listenerWindow, Array.from(trustedDomains), apiHandlers);
					// load the widgets onto client. 
					state.client.loadWidgets(state.providerManager.ciProviders).then(function (widgetLoadStatus) {
						reportUsage("initializeCI Executed successfully in" + (Date.now() - startTime.getTime()) + "ms for providers: " + mapToString(new Map<string, any>().set(Constants.value, result.entities)));
				});
				}
				//reportUsage("initializeCI Executed successfully in" + (Date.now() - startTime.getTime()) + "ms for providers: " + mapToString(new Map<string, any>().set(Constants.value, result.entities)));
			},
			(error: Error) => {
				reportError("initializeCI Execution failed  in" + (Date.now() - startTime.getTime()) + "ms with error as " + error.message);
			}
		);

		return false;
	}



	/*Utility function to raise events registered for the framework*/
	function raiseEvent(data: Map<string, any>, messageType: string, reportMessage: string, provider?: CIProvider): void {
		let startTime = Date.now();
		const payload: postMessageNamespace.IExternalRequestMessageType = {
			messageType: messageType,
			messageData: JSON.stringify(Microsoft.CIFramework.Utility.buildEntity(data))
		}

		//let widgetIFrame = (<HTMLIFrameElement>listenerWindow.document.getElementById(Constants.widgetIframeId));//TO-DO: for multiple widgets, this might be the part of for loop
		if (isNullOrUndefined(provider)) {
			//A Map object iterates in insertion order. If IE11 support is required, ensure this order is preserved
			for (let [key, value] of state.providerManager.ciProviders) {
				var eventStatus: { result?: any, error?: string } = {};
				value.raiseEvent(data, messageType).then(
					function (result: boolean) {
						this.result = result;
					}.bind(eventStatus),
					function (error: IErrorHandler) {
						this.error = error;
						return rejectWithErrorMessage(error.errorMsg, messageType + " - raiseEvent", appId, true, error);
					}.bind(eventStatus));
				if (eventStatus.result) {
					break;
				}
			}
		}
		else {
			provider.raiseEvent(data, messageType);
		}
		reportUsage(reportMessage);
	}

	function getProvider(parameters: Map<string, any>, reqParams?: string[]): [CIProvider, IErrorHandler] {
		if (!parameters) {
			let error = {} as IErrorHandler;
			error.reportTime = new Date().toUTCString();
			error.errorMsg = "Parameter list cannot be empty";
			error.errorType = errorTypes.InvalidParams;
			error.sourceFunc = "getProvider";
			return [null, error];
		}
		if (!parameters.get(Constants.originURL)) {
			let error = {} as IErrorHandler;
			error.reportTime = new Date().toUTCString();
			error.errorMsg = "Paramter:url cannot be empty";
			error.errorType = errorTypes.InvalidParams;
			error.sourceFunc = "getProvider";
			return [null, error];
		}
		if (reqParams) {
			reqParams.forEach(function (param) {
				if (isNullOrUndefined(parameters.get(param))) {
					let error = {} as IErrorHandler;
					error.reportTime = new Date().toUTCString();
					error.errorMsg = "Parameter: " + param + " cannot be empty";
					error.errorType = errorTypes.InvalidParams;
					error.sourceFunc = "getProvider";
					return [null, error];
				}
			});
		}
		let provider = state.providerManager.ciProviders.get(parameters.get(Constants.originURL));
		if (provider && provider.providerId) {
			return [provider, null];
		}
		else {
			let error = {} as IErrorHandler;
			error.reportTime = new Date().toUTCString();
			error.errorMsg = "Associated Provider record not found";
			error.errorType = errorTypes.InvalidParams;
			error.sourceFunc = "getProvider";
			return [null, error];
		}
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
		if (!state.client.flapInUse()) {
			raiseEvent(event.detail, MessageType.onSizeChanged, "onSizeChanged invoked", state.providerManager.getActiveProvider());
		}
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
		raiseEvent(event.detail, MessageType.onModeChanged, "onModeChanged invoked");
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
		raiseEvent(event.detail, MessageType.onPageNavigate, "onPageNavigation invoked");
	}
	/**
	 * setClickToAct API's client side handler that post message library will invoke. 
	*/
	export function setClickToAct(parameters: Map<string, any>) : Promise<Map<string,any>>
	{
		let telemetryData: any = new Object();
		let startTime = new Date();
		const [provider, errorData] = getProvider(parameters, [Constants.value]);
		if(provider)
		{
			return new Promise<Map<string, any>>((resolve, reject) =>
			{
				return state.client.updateRecord(Constants.providerLogicalName, provider.providerId, telemetryData,
					new Map<string, any>([[Constants.clickToActAttributeName, parameters.get(Constants.value) as boolean]])).then(
				(result: Map<string, any>) =>
				{
					provider.clickToAct = parameters.get(Constants.value) as boolean;
					state.providerManager.ciProviders.set(parameters.get(Constants.originURL), provider);

					var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), "setClickToAct", telemetryData);
					setPerfData(perfData);
					return resolve(result);
				},
				(error: IErrorHandler) =>
				{
					return rejectWithErrorMessage(error.errorMsg, "setClickToAct", appId, true, error, provider.providerId, provider.name);
				});
			});
		}
		else
		{
			return rejectWithErrorMessage(errorData.errorMsg, "setClickToAct", appId, true, errorData);
		}
	}

	/**
	* API to check ClickToAct is enabled or not
	*/
	export function getClickToAct(parameters: Map<string, any>) : Promise<Map<string, any>>
	{
		let startTime = new Date();
		const [provider, errorData] = getProvider(parameters);
		if(provider)
		{
			var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), "getClickToAct");
			setPerfData(perfData);

			return Promise.resolve(new Map().set(Constants.value, provider.clickToAct));
		}
		else
		{
			return rejectWithErrorMessage(errorData.errorMsg, "getClickToAct", appId, true, errorData);
		}
	}

	/**
	 * setMode API's client side handler that post message library will invoke. 
	*/
	export function setMode(parameters: Map<string, any>): Promise<Map<string, any>> {
		let telemetryData: any = new Object();
		let startTime = new Date();
		const [provider, errorData] = getProvider(parameters, [Constants.value]);
		if(provider)
		{
			let ret = state.client.setWidgetMode("setWidgetMode", parameters.get(Constants.value) as number, telemetryData);

			var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), "setMode", telemetryData);
			setPerfData(perfData);
			return Promise.resolve(new Map().set(Constants.value, ret));
		}
		else
		{
			return rejectWithErrorMessage(errorData.errorMsg, "setMode", appId, true, errorData);
		}
	}
	/**
	 * openKBSearchControl API's client side handler that post message library will invoke. 
	*/
	export function openKBSearchControl(parameters: Map<string, any>): Promise<Map<string, any>> {   
	
	let telemetryData: any = new Object();
		let startTime = new Date();
		const [provider, errorData] = getProvider(parameters, [Constants.SearchString]);

		if (provider) {
			let ret = state.client.openKBSearchControl(parameters.get(Constants.SearchString), telemetryData);
			var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), "openKBSearchControl", telemetryData);
			setPerfData(perfData);
			return Promise.resolve(new Map().set(Constants.value, ret));

		}
		else {
			return rejectWithErrorMessage(errorData.errorMsg, "openKBSearchControl", appId, true, errorData);
		}
		
		
	}

	/**
	 * setWidth API's client side handler that post message library will invoke. 
	*/
	export function setWidth(parameters: Map<string, any>): Promise<Map<string, any>> {   //TODO: This should be reinterpreted to 'only the widget's width changed. Should we even allow this in multi-widget scenario?
		//TODO: if the new width is greater than panel width, what do we do?
		let telemetryData: any = new Object();
		let startTime = new Date();
		const [provider, errorData] = getProvider(parameters, [Constants.value]);
		if(provider)
		{
			let ret = state.client.setWidgetWidth("setWidgetWidth", parameters.get(Constants.value) as number, telemetryData);
			var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), "setWidth", telemetryData);
			setPerfData(perfData);
			
			return Promise.resolve(new Map().set(Constants.value, ret));
		}
		else {
			return rejectWithErrorMessage(errorData.errorMsg, "setWidth", appId, true, errorData);
		}
	}

	/**
	 * getEnvironment API's client side handler that post message library will invoke. 
	*/
	export function getEnvironment(parameters: Map<string, any>): Promise<Map<string, any>> {
		let telemetryData: any = new Object();
		let startTime = new Date();
		const [provider, errorData] = getProvider(parameters); // if there are multiple widgets then we need this to get the value of particular widget 
		if (provider) {
			let data = state.client.getEnvironment(telemetryData);

			var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), "getEnvironment", telemetryData);
			setPerfData(perfData);
			return Promise.resolve(new Map().set(Constants.value, data));
		}
		else {
			return rejectWithErrorMessage(errorData.errorMsg, "getEnvironment", appId, true, errorData);
		}
	}

	/**
	 * getMode API's client side handler that post message library will invoke.
	*/
	export function getMode(parameters: Map<string, any>): Promise<Map<string, any>> {
		let telemetryData: any = new Object();
		let startTime = new Date();
		const [provider, errorData] = getProvider(parameters); // if there are multiple widgets then we need this to get the value of particular widget
		if(provider)
		{
			//let mode = state.client.getWidgetMode(telemetryData);
			var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), "getMode", telemetryData);
			setPerfData(perfData);
			return Promise.resolve(new Map().set(Constants.value, state.client.getWidgetMode()));
		}
		else
		{
			return rejectWithErrorMessage(errorData.errorMsg, "getMode", appId, true, errorData);
		}
	}

	/**
	 * getWidth API's client side handler that post message library will invoke. 
	*/
	export function getWidth(parameters: Map<string, any>): Promise<Map<string, any>> {
		let telemetryData: any = new Object();
		let startTime = new Date();
		const [provider, errorData] = getProvider(parameters);
		if(provider)
		{
			//let width = state.client.getWidgetWidth(telemetryData);
			var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), "getWidth", telemetryData);
			setPerfData(perfData);
			return Promise.resolve(new Map().set(Constants.value, Number(state.client.getWidgetWidth())));
		}
		else
		{
			return rejectWithErrorMessage(errorData.errorMsg, "getWidth", appId, true, errorData);
		}
	}

	/**
	 * subscriber of onClickToAct event
	*/
	export function onClickToAct(event: CustomEvent): void {
		raiseEvent(Microsoft.CIFramework.Utility.buildMap(event.detail), MessageType.onClickToAct, "onClickToAct event recieved from client with event data as " + JSON.stringify(event.detail));
	}

	/**
	 * subscriber of onSendKBArticle event
	*/
	export function onSendKBArticle(event: CustomEvent): void {
		raiseEvent(Microsoft.CIFramework.Utility.buildMap(event.detail), MessageType.onSendKBArticle, "onSendKBArticle event recieved from client");
	}

	/**
	 * subscriber of onSetPresence event
	 */
	export function onSetPresence(event: CustomEvent): void {
		let eventMap = Microsoft.CIFramework.Utility.buildMap(event.detail);
		presence.setAgentPresence(eventMap.get("presenceInfo"));
		raiseEvent(eventMap, MessageType.onSetPresenceEvent, "onSetPresence event received from client");
	}

	// Time taken by openForm is dependent on User Action. Hence, not logging this in Telemetry
	export function openForm(parameters: Map<string, any>): Promise<Map<string, any>> {
		const [provider, errorData] = getProvider(parameters, [Constants.entityFormOptions, Constants.entityFormParameters]);
		if (provider) {
			return state.client.openForm(parameters.get(Constants.entityFormOptions), parameters.get(Constants.entityFormParameters));
		}
		else {
			return rejectWithErrorMessage(errorData.errorMsg, "openForm", appId, true, errorData);
		}
	}

	export function retrieveRecord(parameters: Map<string, any>): Promise<Map<string, any>> {
		let telemetryData: any = new Object();
		let startTime = new Date();
		const [provider, errorData] = getProvider(parameters, [Constants.entityName, Constants.entityId, Constants.queryParameters]);
		if (provider) {
			return new Promise<Map<string, any>>((resolve, reject) => {
				state.client.retrieveRecord(parameters.get(Constants.entityName), parameters.get(Constants.entityId), telemetryData, parameters.get(Constants.queryParameters)).then(
					function (res) {
						var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), "retrieveRecord", telemetryData);
						setPerfData(perfData);
						return resolve(new Map<string, any>().set(Constants.value, res));
					},
					(error: IErrorHandler) => {
						return rejectWithErrorMessage(error.errorMsg, "retrieveRecord", appId, true, error, provider.providerId, provider.name);
					}
				);
			});
		}
		else {
			return rejectWithErrorMessage(errorData.errorMsg, "retrieveRecord", appId, true, errorData);
		}
	}

	export function updateRecord(parameters: Map<string, any>): Promise<Map<string, any>> {
		let telemetryData: any = new Object();
		let startTime = new Date();
		const [provider, errorData] = getProvider(parameters, [Constants.entityName, Constants.entityId, Constants.value]);
		if (provider) {
			return new Promise<Map<string, any>>((resolve, reject) => {
				state.client.updateRecord(parameters.get(Constants.entityName), parameters.get(Constants.entityId), telemetryData, parameters.get(Constants.value)).then(
					function (res) {
						var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), "updateRecord", telemetryData);
						setPerfData(perfData);
						return resolve(new Map<string, any>().set(Constants.value, res));
					},
					(error: IErrorHandler) => {
						return rejectWithErrorMessage(error.errorMsg, "updateRecord", appId, true, error, provider.providerId, provider.name);
					}
				);
			});
		}
		else {
			return rejectWithErrorMessage(errorData.errorMsg, "updateRecord", appId, true, errorData);
		}
	}

	export function createRecord(parameters: Map<string, any>): Promise<Map<string, any>> {
		let telemetryData: any = new Object();
		let startTime = new Date();
		const [provider, errorData] = getProvider(parameters, [Constants.entityName, Constants.value]);
		if (provider) {
			return new Promise<Map<string, any>>((resolve, reject) => {
				state.client.createRecord(parameters.get(Constants.entityName), null, telemetryData, parameters.get(Constants.value)).then(
					function (res) {
						var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), "createRecord", telemetryData);
						setPerfData(perfData);
						return resolve(new Map<string, any>().set(Constants.value, res));
					},
					(error: IErrorHandler) => {
						return rejectWithErrorMessage(error.errorMsg, "createRecord", appId, true, error, provider.providerId, provider.name);
					}
				);
			});
		}
		else {
			return rejectWithErrorMessage(errorData.errorMsg, "createRecord", appId, true, errorData);
		}
	}

	export function deleteRecord(parameters: Map<string, any>): Promise<Map<string, any>> {
		let telemetryData: any = new Object();
		let startTime = new Date();
		const [provider, errorData] = getProvider(parameters, [Constants.entityName, Constants.entityId]);
		if (provider) {
			return new Promise<Map<string, any>>((resolve, reject) => {
				state.client.deleteRecord(parameters.get(Constants.entityName), parameters.get(Constants.entityId), telemetryData).then(
					function (res) {
						var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), "deleteRecord", telemetryData);
						setPerfData(perfData);
						return resolve(new Map<string, any>().set(Constants.value, res));
					},
					(error: IErrorHandler) => {
						return rejectWithErrorMessage(error.errorMsg, "deleteRecord", appId, true, error, provider.providerId, provider.name);
					}
				);
			});
		}
		else {
			return rejectWithErrorMessage(errorData.errorMsg, "deleteRecord", appId, true, errorData);
		}
	}


	export function searchAndOpenRecords(parameters: Map<string, any>) : Promise<Map<string,any>>
	{
		const [provider, errorData] = getProvider(parameters);
		if (provider) {
			return doSearch(parameters, false, "searchAndOpenRecords");
		}
		else {
			return rejectWithErrorMessage(errorData.errorMsg, "searchAndOpenRecords", appId, true, errorData);
		}
	}


	function doSearch(parameters: Map<string, any>, searchOnly: boolean, callerName?: string) : Promise<Map<string,any>>
	{
		let telemetryData: any = new Object();
		let startTime = new Date();
		const [provider, errorData] = getProvider(parameters, [Constants.entityName, Constants.queryParameters]);
		if(provider)
		{
			let searchResult = state.client.retrieveMultipleAndOpenRecords(parameters.get(Constants.entityName), parameters.get(Constants.queryParameters), searchOnly, telemetryData);

			var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), callerName ? callerName : "doSearch", telemetryData);
			setPerfData(perfData);
			return searchResult;
		}
		else
		{
			return rejectWithErrorMessage(errorData.errorMsg, "doSearch", appId, true, errorData);
		}
	}

	export function search(parameters: Map<string, any>) : Promise<Map<string,any>>
	{
		const [provider, errorData] = getProvider(parameters);
		if (provider) {
			return doSearch(parameters, true, "search");
		}
		else {
			return rejectWithErrorMessage(errorData.errorMsg, "search", appId, true, errorData);
		}
	}

	export function getEntityMetadata(parameters: Map<string, any>): Promise<Map<string, any>> {
		let telemetryData: any = new Object();
		let startTime = new Date();
		const [provider, errorData] = getProvider(parameters, [Constants.entityName]);
		if (provider) {
			return new Promise<Object>((resolve, reject) => {
				state.client.getEntityMetadata(parameters.get(Constants.entityName), parameters.get(Constants.Attributes)).then(
					function (res) {
						var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), "getEntityMetadata", telemetryData);
						setPerfData(perfData);
						return resolve(new Map<string, any>().set(Constants.value, res));
					},
					(error: IErrorHandler) => {
						return rejectWithErrorMessage(error.errorMsg, "getEntityMetadata", appId, true, error, provider.providerId, provider.name);
					}
				);
			});
		}
		else {
			return rejectWithErrorMessage(errorData.errorMsg, "getEntityMetadata", appId, true, errorData);
		}
	}

	/**
	 * API to invoke toast popup widget
	 *
	 * @param value. It's a string which contains header,body of the popup
	 *
	*/
	export function notifyEvent(notificationUX: Map<string,Map<string,any>>): Promise<any>{
		let telemetryData: any = new Object();
		let startTime = new Date();
		const [provider, errorData] = getProvider(notificationUX, [Constants.value]);
		if (provider) {
			return new Promise<any>((resolve, reject) => {
				//let panelWidth = state.client.getWidgetWidth();
				notifyEventClient(notificationUX).then(
					function (res) {
						var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), "notifyEvent", telemetryData);
						setPerfData(perfData);
						return resolve(res);
					},
					(error: IErrorHandler) => {
						return rejectWithErrorMessage(error.errorMsg, "notifyEvent", appId, true, error, provider.providerId, provider.name);
					}
				);
			});
		}else{
			return rejectWithErrorMessage(errorData.errorMsg, "notifyEvent", appId, true, errorData);
		}
	}

	export function insertNotes(notesDetails: Map<string,any>): Promise<any>{
		let telemetryData: any = new Object();
		let startTime = new Date();
		const [provider, errorData] = getProvider(notesDetails, [Constants.value]);
		if (provider) {
			return new Promise<any>((resolve, reject) => {
				let width = state.client.expandFlap();
				if (!width) {
					return reject(new Map<string, string>().set(Constants.value, "Flap already expanded"));
				}
				insertNotesClient(notesDetails).then(
					function (res) {
						var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), "insertNotes", telemetryData);
						setPerfData(perfData);
						state.client.collapseFlap();
						return resolve(res);
					},
					(error: IErrorHandler) => {
						state.client.collapseFlap();
						return rejectWithErrorMessage(error.errorMsg, "insertNotes", appId, true, error, provider.providerId, provider.name);
					}
				);
			});
		}else{
			return rejectWithErrorMessage(errorData.errorMsg, "insertNotes", appId, true, errorData);
		}
	}

	export function renderSearchPage(parameters: Map<string, any>, entityName: string, searchString: string): Promise<Map<string, any>> {
		let telemetryData: any = new Object();
		let startTime = new Date();
		const [provider, errorData] = getProvider(parameters, [Constants.entityName]);
		if (provider) {
			return new Promise<Map<string, any>>((resolve, reject) => {
				state.client.renderSearchPage(parameters.get(Constants.entityName), parameters.get(Constants.SearchString)).then(
					function (res) {
						var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), "renderSearchPage", telemetryData);
						setPerfData(perfData);
						return resolve(new Map<string, any>().set(Constants.value, res));
					},
					(error: IErrorHandler) => {
						return rejectWithErrorMessage(error.errorMsg, "renderSearchPage", appId, true, error, provider.providerId, provider.name);
					}
				);
			});
		}
		else {
			return rejectWithErrorMessage(errorData.errorMsg, "renderSearchPage", appId, true, errorData);
		}
	}

	export function startUISession(parameters: Map<string, any>): Promise<Map<string, any>> {
		let telemetryData: any = new Object();
		let startTime = new Date();
		const [provider, errorData] = getProvider(parameters);
		if (provider) {
			const [sessionId, errorData] = provider.startUISession(parameters.get(Constants.context), parameters.get(Constants.initials));
			var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), "startUISession", telemetryData);
			setPerfData(perfData);
			if (sessionId != null) {
				return Promise.resolve(new Map<string, any>().set(Constants.value, sessionId));
			}
			else {
				return rejectWithErrorMessage(errorData.errorMsg, "startUISession", appId, true, errorData, provider.providerId, provider.name);
			}
		}
		else {
			return rejectWithErrorMessage(errorData.errorMsg, "startUISession", appId, true, errorData);
		}
	}

	export function switchUISession(parameters: Map<string, any>): Promise<Map<string, any>> {
		let telemetryData: any = new Object();
		let startTime = new Date();
		const [provider, errorData] = getProvider(parameters);
		if (provider) {
			const [sessionId, errorData] = provider.switchUISession(parameters.get(Constants.sessionId));
			var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), "switchUISession", telemetryData);
			setPerfData(perfData);
			if (sessionId != null) {
				return Promise.resolve(new Map<string, any>().set(Constants.value, sessionId));
			}
			else {
				return rejectWithErrorMessage(errorData.errorMsg, "switchUISession", appId, true, errorData, provider.providerId, provider.name);
			}
		}
		else {
			return rejectWithErrorMessage(errorData.errorMsg, "switchUISession", appId, true, errorData);
		}
	}

	export function endUISession(parameters: Map<string, any>): Promise<Map<string, any>> {
		let telemetryData: any = new Object();
		let startTime = new Date();
		const [provider, errorData] = getProvider(parameters);
		if (provider) {
			const [sessionId, errorData] = provider.endUISession(parameters.get(Constants.sessionId));
			var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), "endUISession", telemetryData);
			setPerfData(perfData);
			if (sessionId != null) {
				return Promise.resolve(new Map<string, any>().set(Constants.value, sessionId));
			}
			else {
				return rejectWithErrorMessage(errorData.errorMsg, "endUISession", appId, true, errorData, provider.providerId, provider.name);
			}
		}
		else {
			return rejectWithErrorMessage(errorData.errorMsg, "endUISession", appId, true, errorData);
		}
	}

	export function setAgentPresence(parameters: Map<string, any>): Promise<Map<string, any>> {
		let telemetryData: any = new Object();
		let startTime = new Date();
		const [provider, errorData] = getProvider(parameters, [Constants.entityName]);
		if (provider) {
			let agentPresenceStatus = presence.setAgentPresence(JSON.parse(parameters.get(Constants.presenceInfo)), telemetryData);
			var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), "setAgentPresence", telemetryData);
			setPerfData(perfData);
			return Promise.resolve(new Map().set(Constants.value, agentPresenceStatus));
		}
		else {
			return rejectWithErrorMessage(errorData.errorMsg, "setAgentPresence", appId, true, errorData);
		}
	}

	export function initializeAgentPresenceList(parameters: Map<string, any>): Promise<Map<string, any>> {
		let telemetryData: any = new Object();
		let startTime = new Date();
		const [provider, errorData] = getProvider(parameters, [Constants.entityName]);
		if (provider) {
			let presenceListDivStatus = presence.initializeAgentPresenceList(JSON.parse(parameters.get(Constants.presenceList)), telemetryData);
			var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), "initializeAgentPresenceList", telemetryData);
			setPerfData(perfData);
			return Promise.resolve(new Map().set(Constants.value, presenceListDivStatus));
		}
		else {
			return rejectWithErrorMessage(errorData.errorMsg, "initializeAgentPresenceList", appId, true, errorData);
		}
	}

	/**
	* The handler will be called for generic event 
	* @param event. event.detail will be the event detail
	*/
	function onGenericEvent(event: CustomEvent): void {
		if (genericEventRegistrations.has(event.type)) {
			for (let i = 0; i < genericEventRegistrations.get(event.type).length; i++) {
				raiseEvent(Microsoft.CIFramework.Utility.buildMap(event.detail), event.type, "Generic event rise", genericEventRegistrations.get(event.type)[i]);
			}
		}
	}

	function isPredefinedMessageType(messageType:string): boolean {
		return Object.keys(MessageType).indexOf(messageType) >= 0;
	}

	export function addGenericHandler(parameters: Map<string, any>): Promise<Map<string, boolean>> {
		let telemetryData: any = new Object();
		let startTime = new Date();
		const [provider, errorData] = getProvider(parameters);
		if (provider) {
			let messageType: string = parameters.get(Constants.eventType);
			var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), "addGenericHandler", telemetryData);
			setPerfData(perfData);
			if (!isPredefinedMessageType(messageType)) {
				if (genericEventRegistrations.has(messageType) && genericEventRegistrations.get(messageType).length > 0) {
					genericEventRegistrations.get(messageType).push(provider);
				}
				else {
					let list: CIProvider[] = new Array<CIProvider>();
					list[0] = provider;
					genericEventRegistrations.set(messageType, list);
					listenerWindow.addEventListener(messageType, onGenericEvent);
				}
			}
			return Promise.resolve(new Map().set(Constants.value, true));
		}
		else {
			return rejectWithErrorMessage(errorData.errorMsg, "addGenericHandler", appId, true, errorData);
		}
	}

	export function removeGenericHandler(parameters: Map<string, any>): Promise<Map<string, boolean>> {
		let telemetryData: any = new Object();
		let startTime = new Date();
		const [provider, errorData] = getProvider(parameters, [Constants.eventType]);

		if (provider) {
			let messageType: string = parameters.get(Constants.eventType);
			var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), "removeGenericHandler", telemetryData);
			setPerfData(perfData);
			if (!isPredefinedMessageType(messageType)) {
				if (genericEventRegistrations.has(messageType)) {
					for (let i = 0; i < genericEventRegistrations.get(messageType).length; i++) {
						if (genericEventRegistrations.get(messageType)[i] == provider)
							genericEventRegistrations.get(messageType).splice(i, 1);
					}
				}
				if (genericEventRegistrations.get(messageType).length == 0) {
					listenerWindow.removeEventListener(messageType, onGenericEvent);//remove after all providers are removed
				}
			}
			return Promise.resolve(new Map().set(Constants.value, true));
		}
		else {
			return rejectWithErrorMessage(errorData.errorMsg, "removeGenericHandler", appId, true, errorData);
		}
	}
}