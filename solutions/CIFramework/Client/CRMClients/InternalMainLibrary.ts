/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

/// <reference path="Client.ts" />
/// <reference path="Constants.ts" />
/// <reference path="NotificationInfra.ts" />
/// <reference path="../Constants.ts" />
/// <reference path="State.ts" />
/// <reference path="../TelemetryHelper.ts" />
/// <reference path="aria-webjs-sdk-1.6.2.d.ts" />

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
		["endUISession", [endUISession]],
		["setAgentPresence", [setAgentPresence]],
		["setAllPresence", [setAllPresence]]
	]);

	/**
	 * Variable that will store all the info needed for library. There should be no other global variables in the library. Any info that needs to be stored should go into this.
	 */
	let state = {} as IState;
	const listenerWindow = window.parent;

	declare var Xrm: any;
	let noOfNotifications = 0;
	let isNotesControl = false;

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
					state.client.registerHandler(Constants.ModeChangeHandler, onModeChanged);
					state.client.registerHandler(Constants.SizeChangeHandler, onSizeChanged);
					state.client.registerHandler(Constants.NavigationHandler, onPageNavigation);
					let telemetryData: any = new Object();
					var defaultMode = state.client.getWidgetMode(telemetryData) as number;
					var first: string = null;

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
						var usageData = new UsageTelemetryData(x[Constants.providerId], x[Constants.name], x[Constants.APIVersion], x[Constants.SortOrder], appId, false, null);
						setUsageData(usageData);
						if (!first) {
							first = x[Constants.landingUrl];
							state.providerManager = new ProviderManager(state.client, provider);
						}
						state.providerManager.addProvider(x[Constants.landingUrl], provider);
					}
					// initialize and set post message wrapper.
					state.messageLibrary = new postMessageNamespace.postMsgWrapper(listenerWindow, Array.from(trustedDomains), apiHandlers);
					// load the widgets onto client. 
					state.client.loadWidgets(state.providerManager.ciProviders).then(function (widgetLoadStatus) {
						reportUsage(initializeCI.name + "Executed successfully in" + (Date.now() - startTime.getTime()) + "ms for providers: " + mapToString(new Map<string, any>().set(Constants.value, result.entities)));
					});
				}
			},
			(error: Error) => {
				reportError(initializeCI.name + "Execution failed  in" + (Date.now() - startTime.getTime()) + "ms with error as " + error.message);
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
					function (result: Map<string, any>) {
						this.result = result.get(Constants.value);
					}.bind(eventStatus),
					function (error: string) {
						//TODO: send error for telemetry
						this.error = error;
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
			error.sourceFunc = getProvider.name;
			return [null, error];
		}
		if (!parameters.get(Constants.originURL)) {
			let error = {} as IErrorHandler;
			error.reportTime = new Date().toUTCString();
			error.errorMsg = "Paramter:url cannot be empty";
			error.errorType = errorTypes.InvalidParams;
			error.sourceFunc = getProvider.name;
			return [null, error];
		}
		if (reqParams) {
			reqParams.forEach(function (param) {
				if (isNullOrUndefined(parameters.get(param))) {
					let error = {} as IErrorHandler;
					error.reportTime = new Date().toUTCString();
					error.errorMsg = "Parameter: " + param + " cannot be empty";
					error.errorType = errorTypes.InvalidParams;
					error.sourceFunc = getProvider.name;
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
			error.sourceFunc = getProvider.name;
			return [null, error];
		}
	}

	function updateProviderSizes(): void {
		if (isNotesControl == false) {
			var width = state.client.getWidgetWidth() as number;
			for (let [key, value] of state.providerManager.ciProviders) {
				value.setWidth(width);
			}
		}
		isNotesControl = false;
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
		updateProviderSizes();
		raiseEvent(event.detail, MessageType.onSizeChanged, onSizeChanged.name + " invoked", state.providerManager.getActiveProvider());
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
		updateProviderSizes();  //TODO: global modeChanged event: this shouldn't be passed to all widgets. WHo should it be passed to?
		raiseEvent(event.detail, MessageType.onModeChanged, onModeChanged.name + " invoked", state.providerManager.getActiveProvider());
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

					var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), setClickToAct.name, telemetryData);
					setPerfData(perfData);
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
			return rejectWithErrorMessage(errorData.errorMsg, setClickToAct.name, appId, true, errorData);
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
			var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), getClickToAct.name);
			setPerfData(perfData);

			return Promise.resolve(new Map().set(Constants.value, provider.clickToAct));
		}
		else
		{
			return rejectWithErrorMessage(errorData.errorMsg, getClickToAct.name, appId, true, errorData);
		}
	}

	/**
	 * setMode API's client side handler that post message library will invoke. 
	*/
	export function setMode(parameters: Map<string, any>): Promise<Map<string, any>> {
		let telemetryData: any = new Object();
		let startTime = new Date();
		const [provider, errorData] = getProvider(parameters, [Constants.value]);
		if (provider) { //TODO: See whether perfData needs to include provider.setMode() call
			var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), setMode.name, telemetryData);
			setPerfData(perfData);
			return provider.setMode(parameters.get(Constants.value) as number);
		}
		else {
			return rejectWithErrorMessage(errorData.errorMsg, setMode.name, appId, true, errorData);
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

		if (provider) {
			//TODO: calculate max width across all widgets and set panel to it
			var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), setWidth.name, telemetryData);
			setPerfData(perfData);

			return provider.setWidth(parameters.get(Constants.value) as number);
		}
		else {
			return rejectWithErrorMessage(errorData.errorMsg, setWidth.name, appId, true, errorData);
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

			var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), getEnvironment.name, telemetryData);
			setPerfData(perfData);
			return Promise.resolve(new Map().set(Constants.value, data));
		}
		else {
			return rejectWithErrorMessage(errorData.errorMsg, getEnvironment.name, appId, true, errorData);
		}
	}

	/**
	 * getMode API's client side handler that post message library will invoke.
	*/
	export function getMode(parameters: Map<string, any>): Promise<Map<string, any>> {
		let telemetryData: any = new Object();
		let startTime = new Date();
		const [provider, errorData] = getProvider(parameters); // if there are multiple widgets then we need this to get the value of particular widget
		if (provider) {
			var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), getMode.name, telemetryData);
			setPerfData(perfData);
			return Promise.resolve(new Map().set(Constants.value, provider.getMode()));
		}
		else {
			return rejectWithErrorMessage(errorData.errorMsg, getMode.name, appId, true, errorData);
		}
	}

	/**
	 * getWidth API's client side handler that post message library will invoke. 
	*/
	export function getWidth(parameters: Map<string, any>): Promise<Map<string, any>> {
		let telemetryData: any = new Object();
		let startTime = new Date();
		const [provider, errorData] = getProvider(parameters);
		if (provider) {
			var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), getWidth.name, telemetryData);
			setPerfData(perfData);
			return Promise.resolve(new Map().set(Constants.value, Number(provider.getWidth())));
		}
		else {
			return rejectWithErrorMessage(errorData.errorMsg, getWidth.name, appId, true, errorData);
		}
	}

	/**
	 * subscriber of onClickToAct event
	*/
	export function onClickToAct(event: CustomEvent): void {
		raiseEvent(Microsoft.CIFramework.Utility.buildMap(event.detail), MessageType.onClickToAct, onClickToAct.name + " event recieved from client with event data as " + JSON.stringify(event.detail));
	}

	/**
	 * subscriber of onSendKBArticle event
	*/
	export function onSendKBArticle(event: CustomEvent): void {
		raiseEvent(Microsoft.CIFramework.Utility.buildMap(event.detail), MessageType.onSendKBArticle, onSendKBArticle.name + " event recieved from client", state.providerManager.getActiveProvider());
	}

	// Time taken by openForm is dependent on User Action. Hence, not logging this in Telemetry
	export function openForm(parameters: Map<string, any>): Promise<Map<string, any>> {
		const [provider, errorData] = getProvider(parameters, [Constants.entityFormOptions, Constants.entityFormParameters]);
		if (provider) {
			return state.client.openForm(parameters.get(Constants.entityFormOptions), parameters.get(Constants.entityFormParameters));
		}
		else {
			return rejectWithErrorMessage(errorData.errorMsg, openForm.name, appId, true, errorData);
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
						var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), retrieveRecord.name, telemetryData);
						setPerfData(perfData);
						return resolve(new Map<string, any>().set(Constants.value, res));
					},
					(error: IErrorHandler) => {
						return rejectWithErrorMessage(error.errorMsg, retrieveRecord.name, appId, true, error);
					}
				);
			});
		}
		else {
			return rejectWithErrorMessage(errorData.errorMsg, retrieveRecord.name, appId, true, errorData);
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
						var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), updateRecord.name, telemetryData);
						setPerfData(perfData);
						return resolve(new Map<string, any>().set(Constants.value, res));
					},
					(error: IErrorHandler) => {
						return rejectWithErrorMessage(error.errorMsg, updateRecord.name, appId, true, error);
					}
				);
			});
		}
		else {
			return rejectWithErrorMessage(errorData.errorMsg, updateRecord.name, appId, true, errorData);
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
						var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), createRecord.name, telemetryData);
						setPerfData(perfData);
						return resolve(new Map<string, any>().set(Constants.value, res));
					},
					(error: IErrorHandler) => {
						return rejectWithErrorMessage(error.errorMsg, createRecord.name, appId, true, error);
					}
				);
			});
		}
		else {
			return rejectWithErrorMessage(errorData.errorMsg, createRecord.name, appId, true, errorData);
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
						var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), deleteRecord.name, telemetryData);
						setPerfData(perfData);
						return resolve(new Map<string, any>().set(Constants.value, res));
					},
					(error: IErrorHandler) => {
						return rejectWithErrorMessage(error.errorMsg, deleteRecord.name, appId, true, error);
					}
				);
			});
		}
		else {
			return rejectWithErrorMessage(errorData.errorMsg, deleteRecord.name, appId, true, errorData);
		}
	}


	export function searchAndOpenRecords(parameters: Map<string, any>) : Promise<Map<string,any>>
	{
		const [provider, errorData] = getProvider(parameters);
		if (provider) {
			return doSearch(parameters, false, searchAndOpenRecords.name);
		}
		else {
			return rejectWithErrorMessage(errorData.errorMsg, searchAndOpenRecords.name, appId, true, errorData);
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

			var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), callerName ? callerName : doSearch.name, telemetryData);
			setPerfData(perfData);
			return searchResult;
		}
		else
		{
			return rejectWithErrorMessage(errorData.errorMsg, doSearch.name, appId, true, errorData);
		}
	}

	export function search(parameters: Map<string, any>) : Promise<Map<string,any>>
	{
		const [provider, errorData] = getProvider(parameters);
		if (provider) {
			return doSearch(parameters, true, search.name);
		}
		else {
			return rejectWithErrorMessage(errorData.errorMsg, search.name, appId, true, errorData);
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
						var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), getEntityMetadata.name, telemetryData);
						setPerfData(perfData);
						return resolve(new Map<string, any>().set(Constants.value, res));
					},
					(error: IErrorHandler) => {
						return rejectWithErrorMessage(error.errorMsg, getEntityMetadata.name, appId, true, error);
					}
				);
			});
		}
		else {
			return rejectWithErrorMessage(errorData.errorMsg, getEntityMetadata.name, appId, true, errorData);
		}
	}

	/**
	 * API to invoke toast popup widget
	 *
	 * @param value. It's a string which contains header,body of the popup
	 *
	*/
	export function notifyEvent(notificationUX: Map<string,Map<string,any>>): Promise<boolean>{
		let widgetIFrame = (<HTMLIFrameElement>listenerWindow.document.getElementById(Constants.widgetIframeId));
		let toastDiv =  widgetIFrame.contentWindow.document.getElementById("toastDiv");
		let i = 0;
		let header,body,actions;
		let waitTime = -1;
		let notificationType: any = [];
		for (let [key, value] of notificationUX) {
			if(key.search(Constants.eventType) != -1){
				console.log(value);
			}
			if(key.search(Constants.notificationUXObject) != -1){
				for(let [key1, value1] of value){
					if(key1.search(Constants.headerDataCIF) != -1){
						header = value1;
					}else if(key1.search(Constants.bodyDataCIF) != -1){
						body = value1;
					}else if(key1.search(Constants.actionsCIF) != -1){
						actions = value1;
					}else if(key1.search(Constants.notificationType) != -1){
						notificationType = value1;
					}
				}
			}
		}
		if(header == null || header == "undefined"){
			return postMessageNamespace.rejectWithErrorMessage("The header value is blank. Provide a value to the parameter.");
		}
		if(notificationType[0].search(MessageType.softNotification) != -1){ //For Soft notification
			if(body == null || body == "undefined"){
				return postMessageNamespace.rejectWithErrorMessage("The body value is blank. Provide a value to the parameter.");
			}
		}
		if(notificationType == null || notificationType == "undefined"  || notificationType.length <= 0){
			return postMessageNamespace.rejectWithErrorMessage("The notificationType value is blank. Provide a value to the parameter.");
		}
		if(notificationType[0].search(MessageType.softNotification) == -1){ //For Soft notification
			noOfNotifications++;
			if(noOfNotifications > 5){
				toastDiv.removeChild(toastDiv.getElementsByClassName("CIFToastDiv")[toastDiv.getElementsByClassName("CIFToastDiv").length-1]);
				noOfNotifications--;
			}
		}
		let map = new Map();
		map = renderEventNotification(header,body,actions,notificationType);
		if(actions != null && actions != "undefined"){
			for( i = 0; i < actions.length; i++){
				for (let key in actions[i]) {
					if(key.search(Constants.Timer) != -1){
						waitTime = actions[i][key];
					}
				}
			}
		}
		let telemetryData: any = new Object();
		let startTime = new Date();
		const [provider, errorData] = getProvider(notificationUX);
		if (provider) {
			return new Promise(function (resolve,reject) {
				var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), notifyEvent.name, telemetryData);
				setPerfData(perfData);
				if(notificationType[0].search(MessageType.softNotification) != -1){
					for(let [key,value] of map){
						key.addEventListener("click", function clickListener() {
							key.removeEventListener("click", clickListener);
							key.parentElement.parentElement.parentElement.removeChild(key.parentElement.parentElement);
							var mapReturn = new Map().set(Constants.value,new Map());
							resolve(mapReturn);
						});
						setTimeout(function(){
							key.parentElement.parentElement.parentElement.removeChild(key.parentElement.parentElement);
							var mapReturn = new Map().set(Constants.value,new Map());
							resolve(mapReturn);
						}, 20000);
					}
				}else{
					for(let [key,value] of map){
						if(key == toastDiv.getElementsByClassName("CIFToastDiv")[toastDiv.getElementsByClassName("CIFToastDiv").length-1]){
							if(waitTime != -1){
								setTimeout(function(){
									if(key != null && key.parentElement != null){
										key.parentElement.removeChild(key);
										noOfNotifications--;
										var childDivs = toastDiv.getElementsByTagName('div');
										if(childDivs != null){
											for( i=0; i< childDivs.length; i++ ){
												let childDiv = childDivs[i];
												if(childDiv.getElementsByClassName("bodyDivCIF")[0] != null){
													childDiv.getElementsByClassName("bodyDivCIF")[0].setAttribute('style', 'display:none;');
												}
											}
											for( i=0; i< childDivs.length; i++ ){
												let childDiv = childDivs[i];
												if(childDiv.getElementsByClassName("bodyDivCIF")[0] != null){
													childDiv.getElementsByClassName("bodyDivCIF")[0].setAttribute('style', 'display:block;');
													break;
												}
											}
										}
									}
									var mapReturn = new Map().set(Constants.value,value);
									resolve(mapReturn);
									}, waitTime);
								}
						}else{
							key.addEventListener("click", function clickListener() {
								key.removeEventListener("click", clickListener);
								key.parentElement.parentElement.style.display = "none";
								key.parentElement.parentElement.parentElement.removeChild(key.parentElement.parentElement);
								noOfNotifications--;
								var childDivs = toastDiv.getElementsByTagName('div');
								if(childDivs != null){
									for( i=0; i< childDivs.length; i++ ){
										let childDiv = childDivs[i];
										if(childDiv.getElementsByClassName("bodyDivCIF")[0] != null){
											childDiv.getElementsByClassName("bodyDivCIF")[0].setAttribute('style', 'display:block;');
											break;
										}
									}
								}
								var mapReturn = new Map().set(Constants.value,value);
								resolve(mapReturn);
							});
						}
					}
				}		
			});
		}else{
			return rejectWithErrorMessage(errorData.errorMsg, setMode.name, appId, true, errorData);
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
						var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), renderSearchPage.name, telemetryData);
						setPerfData(perfData);
						return resolve(new Map<string, any>().set(Constants.value, res));
					},
					(error: IErrorHandler) => {
						return rejectWithErrorMessage(error.errorMsg, renderSearchPage.name, appId, true, error);
					}
				);
			});
		}
		else {
			return rejectWithErrorMessage(errorData.errorMsg, renderSearchPage.name, appId, true, errorData);
		}
	}

	export function startUISession(parameters: Map<string, any>): Promise<Map<string, any>> {
		let telemetryData: any = new Object();
		let startTime = new Date();
		const [provider, errorData] = getProvider(parameters);
		if (provider) {
			var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), startUISession.name, telemetryData);
			setPerfData(perfData);
			return Promise.resolve(new Map<string, any>().set(Constants.value, provider.startUISession(parameters.get(Constants.context), parameters.get(Constants.initials), parameters.get(Constants.entityFormOptions), parameters.get(Constants.entityFormParameters), parameters.get(Constants.isVisible))));
		}
		else {
			return rejectWithErrorMessage(errorData.errorMsg, startUISession.name, appId, true, errorData);
		}
	}

	export function endUISession(parameters: Map<string, any>): Promise<Map<string, any>> {
		let telemetryData: any = new Object();
		let startTime = new Date();
		const [provider, errorData] = getProvider(parameters);
		if (provider) {
			var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), endUISession.name, telemetryData);
			setPerfData(perfData);
			return Promise.resolve(new Map<string, any>().set(Constants.value, provider.endUISession(parameters.get(Constants.sessionId))));
		}
		else {
			return rejectWithErrorMessage(errorData.errorMsg, endUISession.name, appId, true, errorData);
		}
	}

	export function setAgentPresence(parameters: Map<string, any>): Promise<Map<string, any>> {
		let telemetryData: any = new Object();
		let startTime = new Date();
		const [provider, errorData] = getProvider(parameters, [Constants.entityName]);
		if (provider) {
			let agentPresenceStatus = state.client.setAgentPresence(JSON.parse(parameters.get(Constants.presenceInfo)), telemetryData);
			var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), setAgentPresence.name, telemetryData);
			setPerfData(perfData);
			return Promise.resolve(new Map().set(Constants.value, agentPresenceStatus));
		}
		else {
			return rejectWithErrorMessage(errorData.errorMsg, setAgentPresence.name, appId, true, errorData);
		}
	}

	export function setAllPresence(parameters: Map<string, any>): Promise<Map<string, any>> {
		let telemetryData: any = new Object();
		let startTime = new Date();
		const [provider, errorData] = getProvider(parameters, [Constants.entityName]);
		if (provider) {
			let presenceListDivStatus = state.client.setAllPresence(JSON.parse(parameters.get(Constants.presenceList)), telemetryData);
			var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), setAllPresence.name, telemetryData);
			setPerfData(perfData);
			return Promise.resolve(new Map().set(Constants.value, presenceListDivStatus));
		}
		else {
			return rejectWithErrorMessage(errorData.errorMsg, setAllPresence.name, appId, true, errorData);
		}
	}

	/**
	 * API to insert notes
	 *
	 * @param value. It's a map which contains entityName=Transcript, entitySetName=Transcripts and transcriptId
	 *
	*/
	export function insertNotes(notesDetails: Map<string,any>): Promise<boolean>{
		let entityName: string;
		let originURL: string;
		let entityId: string;
		let entitySetName: string;
		for (let [key, value] of notesDetails) {
			if(key.search(Constants.entityName) != -1){
				entityName = value;
			}else if(key.search(Constants.originURL) != -1){
				originURL = value;
			}else if(key.search(Constants.entityId) != -1){
				entityId = value;
			}else if(key.search(Constants.entitySetName) != -1){
				entitySetName = value;
			}
		}
		
		let width: number = 0;
		let panelWidth = state.client.getWidgetWidth();
		width = panelWidth as number;
		notesDetails.set(Constants.value,width);
		state.client.setWidgetWidth("setWidgetWidth", width*2);
		isNotesControl = true;
		return new Promise(function (resolve) {
			let widgetIFrame = (<HTMLIFrameElement>listenerWindow.document.getElementById(Constants.widgetIframeId));
			widgetIFrame.contentWindow.document.getElementsByTagName("iframe")[0].setAttribute('style','position: absolute;right: 0px;');
			let notesDiv =  widgetIFrame.contentWindow.document.getElementById("notesDiv");
			notesDiv.insertAdjacentHTML('beforeend', '<div id="CIFActivityNotes" class="CIFNotes"><div class="notesHeader">Add Notes</div></div>');
			notesDiv.getElementsByClassName("CIFNotes").classList.add("notesDivCIF");
			notesDiv.getElementsByClassName("notesHeader").classList.add("notesHeaderCIF");
			var span = document.createElement("span");
			span.classList.add("closeSoftNotification_CIF");
			span.classList.add("FontIcons-closeSoftNotification_CIF");
			span.setAttribute("aria-label", "Close");
			notesDiv.getElementsByClassName("notesHeader")[0].appendChild(span);
			var newTextArea = document.createElement('TextArea');
			let notesElement = notesDiv.getElementsByClassName("CIFNotes")[0];
			notesElement.appendChild(newTextArea);
			newTextArea.setAttribute('placeholder','Type your note');
			newTextArea.classList.add("newTextAreaCIF");
			var saveBtn = document.createElement("BUTTON");
			notesElement.appendChild(saveBtn);
			saveBtn.classList.add("notesSaveButtonCIF");
			saveBtn.innerText = "Add Note";
			var cancelBtn = document.createElement("BUTTON");
			notesElement.appendChild(cancelBtn);
			cancelBtn.classList.add("notesCancelButtonCIF");
			cancelBtn.innerText = "Cancel";
			saveBtn.addEventListener("click", function clickListener() {
				saveNotes(notesDetails,newTextArea).then(function (retval: Map<string, any>) {
					cancelNotes();
					state.client.setWidgetWidth("setWidgetWidth", width);
					resolve(retval);
				});
			});
			cancelBtn.addEventListener("click", function clickListener() {
				cancelNotes();
				state.client.setWidgetWidth("setWidgetWidth", width);
				resolve(new Map().set(Constants.value,true));
			});
		});
	}

	export function saveNotes(notesDetails: Map<string,any>,newTextArea: any): Promise<Map<string, any>>{		
		let entityName: string;
		let originURL: string;
		let entityId: string;
		let entitySetName: string;
		for (let [key, value] of notesDetails) {
			if(key.search(Constants.entityName) != -1){
				entityName = value;
			}else if(key.search(Constants.originURL) != -1){
				originURL = value;
			}else if(key.search(Constants.entityId) != -1){
				entityId = value;
			}else if(key.search(Constants.entitySetName) != -1){
				entitySetName = value;
			}
		}
		let annotationId: string;
		let textAreaValue = newTextArea.value;
		let map = new Map().set(Constants.notetext,textAreaValue);
		let createMap = new Map().set(Constants.entityName, Constants.annotation).set(Constants.value, map).set(Constants.originURL,originURL);
		const [provider, errorData] = getProvider(notesDetails, [Constants.value]);
		if (provider){
			return new Promise(function (resolve) {
				createRecord(createMap).then(function (returnValue: Map<string, any>) {	
					for(let [key,value] of returnValue){
						if(key.search(Constants.value) != -1){
							for(let [key1,value1] of value){
								if(key1.search(Constants.Id) != -1){
									annotationId = value1;
								}
							}
						}
					}
					var returnUpdateValue = new Map();
					let odataBind = entitySetName+"("+entityId+")";
					let odataBindPropertyName = "objectid_"+entityName+"@odata.bind";
					let notesMap = new Map().set(odataBindPropertyName,odataBind);
					let updateMap = new Map().set(Constants.entityName, Constants.annotation).set(Constants.entityId, annotationId).set(Constants.value, notesMap).set(Constants.originURL,originURL);
					updateRecord(updateMap).then(function (updatedAnnotation: Map<string, any>) {
						for(let [key,value] of updatedAnnotation){
							if(key.search(Constants.value) != -1){
								returnUpdateValue = value;
							}
						}
						var mapReturn = new Map().set(Constants.value,returnUpdateValue);
						resolve(mapReturn);
					});
				});
			});
		}
	}

	export function cancelNotes(): void{	
		let widgetIFrame = (<HTMLIFrameElement>listenerWindow.document.getElementById(Constants.widgetIframeId));
		let notesDiv =  widgetIFrame.contentWindow.document.getElementById("notesDiv");
		if(!isNullOrUndefined(notesDiv)){
			notesDiv.removeChild(notesDiv.getElementsByClassName("CIFNotes")[0]);
		}
	}
}

