/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

/// <reference path="Client.ts" />
/// <reference path="Constants.ts" />
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
		["notifyCIF", [notifyCIF]],
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

	declare var Xrm: any;

	declare var appId: string;

	/**
	 * This method will starting point for CI library and perform setup operations. retrieve the providers from CRM and initialize the Panels, if needed.
	 * returns false to disable the button visibility
	 */
	export function initializeCI(clientType: number): boolean {
		if (Xrm.Utility.getGlobalContext().client.getClient() === "UnifiedServiceDesk") {
			return false;
		}
		let startTime = new Date();
		// set the client implementation.
		state.client = setClient(clientType);

		// Todo - User story - 1083257 - Get the no. of widgets to load based on client & listener window and accordingly set the values.
		appId = top.location.search.split('appid=')[1].split('&')[0];
		Xrm.WebApi.retrieveMultipleRecords(Constants.providerLogicalName, "?$filter=contains(" + Constants.appSelectorFieldName + ",'" + appId + "')&$orderby=" + Constants.sortOrderFieldName + " asc").then(
			(result: any) => {
				if (result && result.entities) {

					//event listener for the onCliCkToAct event
					listenerWindow.removeEventListener(Constants.CIClickToAct, onClickToAct);
					listenerWindow.addEventListener(Constants.CIClickToAct, onClickToAct);
					listenerWindow.removeEventListener(Constants.CISendKBArticle, onSendKBArticle);
					listenerWindow.addEventListener(Constants.CISendKBArticle, onSendKBArticle);
					state.client.registerHandler(Constants.ModeChangeHandler, onModeChanged);
					state.client.registerHandler(Constants.SizeChangeHandler, onSizeChanged);
					state.client.registerHandler(Constants.NavigationHandler, onPageNavigation);
					// populate ciProviders in state.
					state.ciProviders = new Map<string, any>();
					state.sessionManager = new SessionInfo();
					var roles = Xrm.Utility.getGlobalContext().getUserRoles();
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
						for (var role of roles) {
							if (currRoles && currRoles.Length > 2 && currRoles.indexOf(role) === -1) {
								continue;
							}
							var provider: CIProvider = new CIProvider(x, state, environmentInfo);
							state.ciProviders.set(x[Constants.landingUrl], provider);
							var usageData = new UsageTelemetryData(x[Constants.providerId], x[Constants.name], x[Constants.APIVersion], x[Constants.SortOrder], appId, false, null);
							setUsageData(usageData);
							if (!first) {
								first = x[Constants.landingUrl];
							}
							break;
						}
					}
					// initialize and set post message wrapper.
					state.messageLibrary = new postMessageNamespace.postMsgWrapper(listenerWindow, Array.from(state.ciProviders.keys()), apiHandlers);
					// load the widgets onto client. 
					state.client.loadWidgets(state.ciProviders).then(function (widgetLoadStatus) {
						reportUsage(initializeCI.name + "Executed successfully in" + (Date.now() - startTime.getTime()) + "ms for providers: " + mapToString(new Map<string, any>().set(Constants.value, result.entities)));
					});
					if (first) {
						state.sessionManager.setActiveProvider(state.ciProviders.get(first));
					}
				}
			},
			(error: Error) => {
				reportError(initializeCI.name + "Execution failed  in" + (Date.now() - startTime.getTime()) + "ms with error as " + error.message);
			}
		);

		return false;
	}

	/*Utility function to raise events registered for the framework*/
	function raiseEvent(data: Map<string, any>, messageType: string, reportMessage: string): void {
		let startTime = Date.now();
		const payload: postMessageNamespace.IExternalRequestMessageType = {
			messageType: messageType,
			messageData: data
		}

		//let widgetIFrame = (<HTMLIFrameElement>listenerWindow.document.getElementById(Constants.widgetIframeId));//TO-DO: for multiple widgets, this might be the part of for loop
		for (let [key, value] of state.ciProviders) {
			value.raiseEvent(data, messageType);
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
		let provider = state.ciProviders.get(parameters.get(Constants.originURL));
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
		var width = state.client.getWidgetWidth() as number;
		for (let [key, value] of state.ciProviders) {
			value.setWidth(width);
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
		updateProviderSizes();
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
		updateProviderSizes();  //TODO: global modeChanged event: this shouldn't be passed to all widgets. WHo should it be passed to?
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
					state.ciProviders.set(parameters.get(Constants.originURL), provider);

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
		raiseEvent(Microsoft.CIFramework.Utility.buildMap(event.detail), MessageType.onClickToAct, onClickToAct.name + " event recieved from client with event data as " + eventToString(event));
	}

	/**
	 * subscriber of onSendKBArticle event
	*/
	export function onSendKBArticle(event: CustomEvent): void {
		raiseEvent(Microsoft.CIFramework.Utility.buildMap(event.detail), MessageType.onSendKBArticle, onSendKBArticle.name + " event recieved from client");
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
	
	/**
	 * API to invoke toast popup widget
	 *
	 * @param value. It's a string which contains header,body of the popup
	 *
	*/
    export function notifyCIF(notificationUX: Map<string,Map<string,any>>): Promise<boolean>{
       	let widgetIFrame = (<HTMLIFrameElement>listenerWindow.document.getElementById(Constants.widgetIframeId));
		let toastDiv =  widgetIFrame.contentWindow.document.getElementById("toastDiv");
		var childDivs = toastDiv.getElementsByTagName('div');
		let i = 0;
		if(childDivs != null){
			for( i=0; i< childDivs.length; i++ ){
				let childDiv = childDivs[i];
				if(childDiv.getElementsByClassName("bodyDivCIF")[0] != null){
					childDiv.getElementsByClassName("bodyDivCIF")[0].setAttribute('style', 'display:none;');
				}
			}
		}
		toastDiv.insertAdjacentHTML('afterbegin', '<div id="CIFToast" style="position: relative;display:table;background-color: rgba(102, 102, 102, 0.5);width:254px;z-index: 2;cursor: pointer;border: 2px solid #dedede;border-radius: 5px;padding: 10px;margin: 10px 0;background-color: lightblue;"><div id="header_CIF" style="display:block;"></div><div class="bodyDivCIF" style="display:block;"><p id="body_CIF"></p></div></div>');
		let header,body,buttons,icon;
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
					}else if(key1.search(Constants.buttonsCIF) != -1){
						buttons = value1;
					}else if(key1.search(Constants.CIFNotificationIcon) != -1){
						icon = value1;
					}
				}
			}
		}
		let headerVal = "";
		let bodyVal = "";
		for( i = 0; i < header.length; i++){
			for (let key in header[i]) {
				headerVal += key + "  " + header[i][key] + " ";
			}
			headerVal += "\n";
		}
		for( i = 0; i < body.length; i++){
			for (let key in body[i]) {
				bodyVal += key + "  " + body[i][key] + " ";
			}
			bodyVal += "\n";
		}
		widgetIFrame.contentWindow.document.getElementById("header_CIF").innerText = headerVal;
		widgetIFrame.contentWindow.document.getElementById("body_CIF").innerText = bodyVal;
		let chatWindowBody = widgetIFrame.contentWindow.document.getElementById("CIFToast").getElementsByClassName("bodyDivCIF")[0];
		let map = new Map();
		for( i = 0; i < buttons.length; i++){
			var btn = document.createElement("BUTTON");
			chatWindowBody.appendChild(btn);
			let buttonParam = new Map();
			let k = 0;
			let buttonNameCIF,buttonReturnValueCIF;
			for (let key in buttons[i]) {
				if(key.search(Constants.buttonDisplayText) != -1){
					btn.innerText = buttons[i][key];
				}else if(key.search(Constants.buttonName) != -1){
					buttonNameCIF = buttons[i][key];
				}else if(key.search(Constants.buttonReturnValue) != -1){
					buttonReturnValueCIF = buttons[i][key];
				}
			}
			buttonParam.set(Constants.buttonName,buttonNameCIF);
			buttonParam.set(Constants.buttonReturnValue,buttonReturnValueCIF);
			map.set(btn,buttonParam);
		}
		widgetIFrame.contentWindow.document.getElementById("header_CIF").addEventListener("click", function() {
			childDivs = toastDiv.getElementsByTagName('div');
			if(childDivs != null){
				for( i=0; i< childDivs.length; i++ ){
					let childDiv = childDivs[i];
					if(childDiv.getElementsByClassName("bodyDivCIF")[0] != null){
						childDiv.getElementsByClassName("bodyDivCIF")[0].setAttribute('style', 'display:none;');
					}
				}
				this.parentElement.getElementsByClassName("bodyDivCIF")[0].setAttribute('style', 'display:block;');
			}
		});
		return new Promise(function (resolve) {
			for(let [key,value] of map){
				key.addEventListener("click", function clickListener() {
					key.removeEventListener("click", clickListener);
					key.parentElement.parentElement.style.display = "none";
					key.parentElement.remove();
					childDivs = toastDiv.getElementsByTagName('div');
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
		});
    }
}
