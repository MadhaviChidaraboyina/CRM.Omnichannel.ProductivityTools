/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

/// <reference path="Client.ts" />
/// <reference path="Constants.ts" />
/// <reference path="NotificationInfra.ts" />
/// <reference path="NotesInfra.ts" />
/// <reference path="../Constants.ts" />
/// <reference path="SessionManager.ts" />
/// <reference path="ConsoleAppSessionManager.ts" />
/// <reference path="SessionPanel.ts" />
/// <reference path="State.ts" />
/// <reference path="../TelemetryHelper.ts" />
/// <reference path="aria-webjs-sdk-1.8.3.d.ts" />

/** @internal */
namespace Microsoft.CIFramework.Internal {
	let Constants = Microsoft.CIFramework.Constants;
	/**
	 * mapping of handlers for each API needed by postMessageWrapper
	 */
	const apiHandlers = new Map<string, any>([
		["setclicktoact", [setClickToAct]],
		["getclicktoact", [getClickToAct]],
		["getEntityMetadata", [getEntityMetadata]],
		["getenvironment", [getEnvironment]],
		["createrecord", [createRecord]],
		["retrieverecord", [retrieveRecord]],
		["updaterecord", [updateRecord]],
		["deleterecord", [deleteRecord]],
		["openform", [openForm]],
		["setmode", [setMode]],
		["setPosition", [setPosition]],
		["getmode", [getMode]],
		["setwidth", [setWidth]],
		["isConsoleApp", [isConsoleApp]],
		["getwidth", [getWidth]],
		["addGenericHandler", [addGenericHandler]],
		["removeGenericHandler", [removeGenericHandler]],
		["setAgentPresence", [setAgentPresence]],
		["initializeAgentPresenceList", [initializeAgentPresenceList]],
		["search", [search]],
		["searchandopenrecords", [searchAndOpenRecords]],
		["renderSearchPage", [renderSearchPage]],
		['getAllSessions', [getAllSessions]],
		['getFocusedSession', [getFocusedSession]],
		['getSession', [getSession]],
		["canCreateSession", [canCreateSession]],
		["createSession", [createSession]],
		["requestFocusSession", [requestFocusSession]],
		["getFocusedTab", [getFocusedTab]],
		["createTab", [createTab]],
		["focusTab", [focusTab]],
		["openkbsearchcontrol", [openKBSearchControl]],
		["notifyEvent", [notifyEvent]],
		["insertNotes", [insertNotes]]
	]);

	let genericEventRegistrations = new Map<string, CIProvider[]>();

	/**
	 * Variable that will store all the info needed for library. There should be no other global variables in the library. Any info that needs to be stored should go into this.
	 */
	export var state = {} as IState;
	let presence = {} as IPresenceManager;
	const listenerWindow = window.parent;

	declare var Xrm: any;
	declare var appId: string;
	declare var cifVersion: string;
	cifVersion = "";
	var navigationType: string;

	/**
	 * This method will starting point for CI library and perform setup operations. retrieve the providers from CRM and initialize the Panels, if needed.
	 * returns false to disable the button visibility
	 */
	export function initializeCI(clientType: string, navigationType: string): boolean {
		let startTime = new Date();

		initializeTelemetry();
		// set the client implementation.
		state.client = setClient(clientType);
		if (!state.client.checkCIFCapability()) {
			return false;
		}

		this.navigationType = navigationType;
		state.sessionManager = GetSessionManager(clientType);
		presence = GetPresenceManager(clientType);

		// Todo - User story - 1083257 - Get the no. of widgets to load based on client & listener window and accordingly set the values.
		appId = top.location.search.split('appid=')[1].split('&')[0];
		Xrm.WebApi.retrieveMultipleRecords("solution", "?$filter=uniquename eq 'ChannelAPIIntegrationFramework'&$select=version").then(
			(response: any) => {
				cifVersion = response.entities[0].version;
				loadProvider();
			},
			(error: Error) => {
				loadProvider();
				let errorData = generateErrorObject(error, "initializeCI - Xrm.WebApi.retrieveMultipleRecords", errorTypes.XrmApiError);
				logFailure(appId, true, errorData, "initializeCI", cifVersion);
			}
		);
		return false;
	}

	function loadProvider() {
		let trustedDomains: string[] = [];
		Xrm.WebApi.retrieveMultipleRecords(Constants.providerLogicalName, "?$filter=contains(" + Constants.appSelectorFieldName + ",'" + appId + "')&$orderby=" + Constants.sortOrderFieldName + " asc").then(
			(result: any) => {

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

						var usageData = new UsageTelemetryData(x[Constants.providerId], x[Constants.name], x[Constants.APIVersion], "loadProvider", x[Constants.SortOrder], appId, cifVersion, false, null);
						setUsageData(usageData);
					}
					// initialize and set post message wrapper.
					state.messageLibrary = new postMessageNamespace.postMsgWrapper(listenerWindow, Array.from(trustedDomains), apiHandlers);
					let panelPosition = getPosition(provider);
					// load the widgets onto client. 
					state.client.loadWidgets(state.providerManager.ciProviders, panelPosition as number).then(function (widgetLoadStatus) {
						var usageData = new UsageTelemetryData(provider.providerId, provider.name, provider.apiVersion, "loadProvider - loadWidgets", provider.sortOrder, appId, cifVersion, false, null);
						setUsageData(usageData);
					});
				}
			},
			(error: Error) => {
				let errorData = generateErrorObject(error, "loadProvider - Xrm.WebApi.retrieveMultipleRecords - providerRecords", errorTypes.XrmApiError);
				logFailure(appId, true, errorData, "loadProvider", cifVersion);
			}
		);
	}

	/**
	 * IsConsoleApp API's client side handler that post message library will invoke.
	*/
	export function isConsoleAppInternal(): boolean {
		let ret: boolean;
		if(this.navigationType == SessionType.MultiSession)
		{
			ret = true;
		}
		else
		{
			ret = false;
		}
		return ret;
	}

	/**
	 * IsConsoleApp API's client side handler that post message library will invoke.
	*/
	export function isConsoleApp(parameters: Map<string, any>): Promise<Map<string, any>> {
		let ret: boolean;
		let telemetryData: any = new Object();
		let startTime = new Date();
		const [provider, errorData] = getProvider(parameters, [Constants.SearchString]);
		if (provider) {
			if(this.navigationType == SessionType.MultiSession)
			{
				ret = true;
			}
			else
			{
				ret = false;
			}
			var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), MessageType.isConsoleApp, cifVersion, telemetryData);
			setPerfData(perfData);
			return Promise.resolve(new Map().set(Constants.value, ret));
		}
		else {
			return logFailure(appId, true, errorData, MessageType.isConsoleApp, cifVersion);
		}
	}

	/**
	 * setPosition API's client side handler that post message library will invoke. 
	*/
	export function setPosition(parameters: Map<string, any>): Promise<Map<string, any>> {
		let telemetryData: any = new Object();
		let startTime = new Date();
		const [provider, errorData] = getProvider(parameters, [Constants.value]);
		if(provider)
		{
			let ret = state.client.setPanelPosition("setPanelPosition", parameters.get(Constants.value) as number, telemetryData);
			var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), "setPosition", cifVersion, telemetryData);
			setPerfData(perfData);
			return Promise.resolve(new Map().set(Constants.value, ret));
		}
		else
		{
			return logFailure(appId, true, errorData, "setPosition", cifVersion);
		}
	}

	/**
	 * getPosition API's client side handler that post message library will invoke.
	*/
	export function getPosition(provider: CIProvider): number {
		let telemetryData: any = new Object();
		let startTime = new Date();
		let ret = state.client.getPanelPosition(telemetryData);
		var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), "getPosition", telemetryData);
		setPerfData(perfData);
		return ret as number;
	}

	/* Utility function to raise events registered for the framework */
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
					function (error: Error) {
						this.error = error;
						let errorData = generateErrorObject(error, messageType + " - raiseEvent", errorTypes.GenericError);
						logFailure(appId, true, errorData, messageType + " - raiseEvent", cifVersion, value.providerId, value.name);
					}.bind(eventStatus));
				if (eventStatus.result) {
					break;
				}
			}
		}
		else {
			provider.raiseEvent(data, messageType);
		}
	}

	/* Utility function to get the Provider out of the parameters */
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
	 * getEnvironment API's client side handler that post message library will invoke. 
	*/
	export function getEnvironment(parameters: Map<string, any>): Promise<Map<string, any>> {
		let telemetryData: any = new Object();
		let startTime = new Date();
		const [provider, errorData] = getProvider(parameters); // if there are multiple widgets then we need this to get the value of particular widget 
		if (provider) {
			let data = state.client.getEnvironment(telemetryData);

			var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), "getEnvironment", cifVersion, telemetryData);
			setPerfData(perfData);
			return Promise.resolve(new Map().set(Constants.value, data));
		}
		else {
			return logFailure(appId, true, errorData, "getEnvironment", cifVersion);
		}
	}

	function isPredefinedMessageType(messageType: string): boolean {
		return Object.keys(MessageType).indexOf(messageType) >= 0;
	}

	export function addGenericHandler(parameters: Map<string, any>): Promise<Map<string, boolean>> {
		let telemetryData: any = new Object();
		let startTime = new Date();
		const [provider, errorData] = getProvider(parameters);
		if (provider) {
			let messageType: string = parameters.get(Constants.eventType);
			var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), "addGenericHandler", cifVersion, telemetryData);
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
			return logFailure(appId, true, errorData, "addGenericHandler", cifVersion);
		}
	}

	export function removeGenericHandler(parameters: Map<string, any>): Promise<Map<string, boolean>> {
		let telemetryData: any = new Object();
		let startTime = new Date();
		const [provider, errorData] = getProvider(parameters, [Constants.eventType]);

		if (provider) {
			let messageType: string = parameters.get(Constants.eventType);
			var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), "removeGenericHandler", cifVersion, telemetryData);
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
			return logFailure(appId, true, errorData, "removeGenericHandler", cifVersion);
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

					var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), "setClickToAct", cifVersion, telemetryData);
					setPerfData(perfData);
					return resolve(result);
				},
				(error: IErrorHandler) =>
				{
					logFailure(appId, true, error as IErrorHandler, "setClickToAct", cifVersion, provider.providerId, provider.name);
					return reject(new Map().set(Constants.value, error));
				});
			});
		}
		else
		{
			return logFailure(appId, true, errorData, "setClickToAct", cifVersion);
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
			var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), "getClickToAct", cifVersion);
			setPerfData(perfData);

			return Promise.resolve(new Map().set(Constants.value, provider.clickToAct));
		}
		else
		{
			return logFailure(appId, true, errorData, "getClickToAct", cifVersion);
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
			cancelNotes();
			state.client.collapseFlap();
			let ret = state.client.setPanelMode("setPanelMode", parameters.get(Constants.value) as number, telemetryData);
			var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), "setMode", cifVersion, telemetryData);
			setPerfData(perfData);
			return Promise.resolve(new Map().set(Constants.value, ret));
		}
		else
		{
			return logFailure(appId, true, errorData, "setMode", cifVersion);
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
			//let mode = state.client.getWidgetMode(telemetryData);
			var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), "getMode", cifVersion, telemetryData);
			setPerfData(perfData);
			return Promise.resolve(new Map().set(Constants.value, state.client.getWidgetMode()));
		}
		else {
			return logFailure(appId, true, errorData, "getMode", cifVersion);
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
			let ret = state.client.setWidgetWidth("setWidgetWidth", parameters.get(Constants.value) as number, telemetryData);
			var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), "setWidth", cifVersion, telemetryData);
			setPerfData(perfData);

			return Promise.resolve(new Map().set(Constants.value, ret));
		}
		else {
			return logFailure(appId, true, errorData, "setWidth", cifVersion);
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
			//let width = state.client.getWidgetWidth(telemetryData);
			var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), "getWidth", cifVersion, telemetryData);
			setPerfData(perfData);
			return Promise.resolve(new Map().set(Constants.value, Number(state.client.getWidgetWidth())));
		}
		else {
			return logFailure(appId, true, errorData, "getWidth", cifVersion);
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
			var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), "openKBSearchControl", cifVersion, telemetryData);
			setPerfData(perfData);
			return Promise.resolve(new Map().set(Constants.value, ret));
		}
		else {
			return logFailure(appId, true, errorData, "openKBSearchControl", cifVersion);
		}
	}

	export function searchAndOpenRecords(parameters: Map<string, any>): Promise<Map<string, any>> {
		const [provider, errorData] = getProvider(parameters);
		if (provider) {
			return doSearch(parameters, false, "searchAndOpenRecords");
		}
		else {
			return logFailure(appId, true, errorData, "searchAndOpenRecords", cifVersion);
		}
	}

	function doSearch(parameters: Map<string, any>, searchOnly: boolean, callerName?: string): Promise<Map<string, any>> {
		let telemetryData: any = new Object();
		let startTime = new Date();
		const [provider, errorData] = getProvider(parameters, [Constants.entityName, Constants.queryParameters]);
		if (provider) {
			let searchResult = state.client.retrieveMultipleAndOpenRecords(parameters.get(Constants.entityName), parameters.get(Constants.queryParameters), searchOnly, telemetryData);

			var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), callerName ? callerName : "doSearch", cifVersion, telemetryData);
			setPerfData(perfData);
			return searchResult;
		}
		else {
			return logFailure(appId, true, errorData, "doSearch", cifVersion);
		}
	}

	export function search(parameters: Map<string, any>): Promise<Map<string, any>> {
		const [provider, errorData] = getProvider(parameters);
		if (provider) {
			return doSearch(parameters, true, "search");
		}
		else {
			return logFailure(appId, true, errorData, "search", cifVersion);
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
						var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), "renderSearchPage", cifVersion, telemetryData);
						setPerfData(perfData);
						return resolve(new Map<string, any>().set(Constants.value, res));
					},
					(error: IErrorHandler) => {
						logFailure(appId, true, error as IErrorHandler, "renderSearchPage", cifVersion, provider.providerId, provider.name);
						return reject(new Map<string, any>().set(Constants.value, error));
					}
				);
			});
		}
		else {
			return logFailure(appId, true, errorData, "renderSearchPage", cifVersion);
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
						var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), "createRecord", cifVersion, telemetryData);
						setPerfData(perfData);
						return resolve(new Map<string, any>().set(Constants.value, res));
					},
					(error: IErrorHandler) => {
						logFailure(appId, true, error as IErrorHandler, "createRecord", cifVersion, provider.providerId, provider.name);
						return reject(new Map<string, any>().set(Constants.value, error));
					}
				);
			});
		}
		else {
			return logFailure(appId, true, errorData, "createRecord", cifVersion);
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
						var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), "retrieveRecord", cifVersion, telemetryData);
						setPerfData(perfData);
						return resolve(new Map<string, any>().set(Constants.value, res));
					},
					(error: IErrorHandler) => {
						logFailure(appId, true, error as IErrorHandler, "retrieveRecord", cifVersion, provider.providerId, provider.name);
						return reject(new Map<string, any>().set(Constants.value, error));
					}
				);
			});
		}
		else {
			return logFailure(appId, true, errorData, "retrieveRecord", cifVersion);
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
						var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), "updateRecord", cifVersion, telemetryData);
						setPerfData(perfData);
						return resolve(new Map<string, any>().set(Constants.value, res));
					},
					(error: IErrorHandler) => {
						logFailure(appId, true, error as IErrorHandler, "updateRecord", cifVersion, provider.providerId, provider.name);
						return reject(new Map<string, any>().set(Constants.value, error));
					}
				);
			});
		}
		else {
			return logFailure(appId, true, errorData, "updateRecord", cifVersion);
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
						var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), "deleteRecord", cifVersion, telemetryData);
						setPerfData(perfData);
						return resolve(new Map<string, any>().set(Constants.value, res));
					},
					(error: IErrorHandler) => {
						logFailure(appId, true, error as IErrorHandler, "deleteRecord", cifVersion, provider.providerId, provider.name);
						return reject(new Map<string, any>().set(Constants.value, error));
					}
				);
			});
		}
		else {
			return logFailure(appId, true, errorData, "deleteRecord", cifVersion);
		}
	}

	// Time taken by openForm is dependent on User Action. Hence, not logging this in Telemetry
	export function openForm(parameters: Map<string, any>): Promise<Map<string, any>> {
		const [provider, errorData] = getProvider(parameters, [Constants.entityFormOptions, Constants.entityFormParameters]);
		if (provider) {
			return state.client.openForm(parameters.get(Constants.entityFormOptions), parameters.get(Constants.entityFormParameters));
		}
		else {
			return logFailure(appId, true, errorData, "openForm", cifVersion);
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
						var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), "getEntityMetadata", cifVersion, telemetryData);
						setPerfData(perfData);
						return resolve(new Map<string, any>().set(Constants.value, res));
					},
					(error: IErrorHandler) => {
						logFailure(appId, true, error as IErrorHandler, "getEntityMetadata", cifVersion, provider.providerId, provider.name);
						return reject(new Map<string, any>().set(Constants.value, error));
					}
				);
			});
		}
		else {
			return logFailure(appId, true, errorData, "getEntityMetadata", cifVersion);
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
						var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), "notifyEvent", cifVersion, telemetryData);
						setPerfData(perfData);
						return resolve(res);
					},
					(error: IErrorHandler) => {
						logFailure(appId, true, error as IErrorHandler, "notifyEvent", cifVersion, provider.providerId, provider.name);
						return reject(error);
					}
				);
			});
		}
		else {
			return logFailure(appId, true, errorData, "notifyEvent", cifVersion);
		}
	}

	export function insertNotes(notesDetails: Map<string,any>): Promise<any>{
		let telemetryData: any = new Object();
		let startTime = new Date();
		const [provider, errorData] = getProvider(notesDetails, [Constants.value]);
		if (provider) {
			return new Promise<any>((resolve, reject) => {
				let width = state.client.expandFlap(intermediateSaveNotes);
				if (!width) {
					return reject(new Map<string, string>().set(Constants.value, "Flap already expanded"));
				}
				insertNotesClient(notesDetails).then(
					function (res) {
						var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), "insertNotes", cifVersion, telemetryData);
						setPerfData(perfData);
						state.client.collapseFlap();
						return resolve(res);
					},
					(error: IErrorHandler) => {
						state.client.collapseFlap();
						logFailure(appId, true, error as IErrorHandler, "insertNotes", cifVersion, provider.providerId, provider.name);
						return reject(new Map<string, any>().set(Constants.value, error));
					}
				);
			});
		}
		else {
			return logFailure(appId, true, errorData, "insertNotes", cifVersion);
		}
	}

	export function setAgentPresence(parameters: Map<string, any>): Promise<Map<string, any>> {
		let telemetryData: any = new Object();
		let startTime = new Date();
		const [provider, errorData] = getProvider(parameters, [Constants.entityName]);
		if (provider) {
			let agentPresenceStatus = presence.setAgentPresence(JSON.parse(parameters.get(Constants.presenceInfo)), telemetryData);
			var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), "setAgentPresence", cifVersion, telemetryData);
			setPerfData(perfData);
			return Promise.resolve(new Map().set(Constants.value, agentPresenceStatus));
		}
		else {
			return logFailure(appId, true, errorData, "setAgentPresence", cifVersion);
		}
	}

	export function initializeAgentPresenceList(parameters: Map<string, any>): Promise<Map<string, any>> {
		if (parameters && parameters.has(Constants.presenceList)) {
			window.localStorage[Constants.GLOBAL_PRESENCE_LIST] = parameters.get(Constants.presenceList);
		}
		let telemetryData: any = new Object();
		let startTime = new Date();
		const [provider, errorData] = getProvider(parameters, [Constants.entityName]);
		if (provider) {
			let presenceListDivStatus = presence.initializeAgentPresenceList(JSON.parse(parameters.get(Constants.presenceList)), telemetryData);
			var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), "initializeAgentPresenceList", cifVersion, telemetryData);
			setPerfData(perfData);
			return Promise.resolve(new Map().set(Constants.value, presenceListDivStatus));
		}
		else {
			return logFailure(appId, true, errorData, "initializeAgentPresenceList", cifVersion);
		}
	}

	export function getAllSessions(parameters: Map<string, any>): Promise<Map<string, any>> {
		let telemetryData: any = new Object();
		let startTime = new Date();
		const [provider, errorData] = getProvider(parameters, [Constants.entityName]);
		if (provider) {
			var sessionIds = provider.getAllSessions();
			var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), MessageType.getAllSessions, cifVersion, telemetryData);
			setPerfData(perfData);
			var usageData = new UsageTelemetryData(provider.providerId, provider.name, provider.apiVersion, MessageType.getAllSessions, provider.sortOrder, appId, cifVersion, false, null);
			setUsageData(usageData);
			return Promise.resolve(new Map<string, any>().set(Constants.value, sessionIds));
		}
		else {
			return logFailure(appId, true, errorData, MessageType.getAllSessions, cifVersion);
		}
	}

	export function getFocusedSession(parameters: Map<string, any>): Promise<Map<string, any>> {
		let telemetryData: any = new Object();
		let startTime = new Date();
		const [provider, errorData] = getProvider(parameters);
		if (provider) {
			var sessionId = provider.getFocusedSession();
			var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), MessageType.getFocusedSession, cifVersion, telemetryData);
			setPerfData(perfData);
			var usageData = new UsageTelemetryData(provider.providerId, provider.name, provider.apiVersion, MessageType.getFocusedSession, provider.sortOrder, appId, cifVersion, false, null);
			setUsageData(usageData);
			return Promise.resolve(new Map<string, any>().set(Constants.value, sessionId));
		}
		else {
			return logFailure(appId, true, errorData, MessageType.getFocusedSession, cifVersion);
		}
	}

	export function getSession(parameters: Map<string, any>): Promise<Map<string, any>> {
		let telemetryData: any = new Object();
		let telemetryParameter: any = new Object();
		let startTime = new Date();
		const [provider, errorData] = getProvider(parameters);
		if (provider) {
			return new Promise<Map<string, any>>((resolve, reject) => {
				provider.getSession(parameters.get(Constants.sessionId)).then(function (session) {
					var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), MessageType.getSession, cifVersion, telemetryData);
					setPerfData(perfData);
					logParameterData(telemetryParameter, MessageType.getSession, {"sessionId": parameters.get(Constants.sessionId)});
					var usageData = new UsageTelemetryData(provider.providerId, provider.name, provider.apiVersion, MessageType.getSession, provider.sortOrder, appId, cifVersion, false, null, telemetryParameter);
					setUsageData(usageData);
					return resolve(new Map<string, any>().set(Constants.value, session));
				}, function (errorData) {
					logFailure(appId, true, errorData, MessageType.getSession, cifVersion, provider.providerId, provider.name, telemetryParameter);
					return reject(Microsoft.CIFramework.Utility.createErrorMap(errorData.errorMsg, MessageType.getSession))
				});
			});
		}
		else {
			return logFailure(appId, true, errorData, MessageType.getSession, cifVersion, "", "", telemetryParameter);
		}
	}

	export function canCreateSession(parameters: Map<string, any>): Promise<Map<string, any>> {
		let telemetryData: any = new Object();
		let startTime = new Date();
		const [provider, errorData] = getProvider(parameters);
		if (provider) {
			var canCreate = provider.canCreateSession();
			var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), MessageType.canCreateSession, cifVersion, telemetryData);
			setPerfData(perfData);
			var usageData = new UsageTelemetryData(provider.providerId, provider.name, provider.apiVersion, MessageType.canCreateSession, provider.sortOrder, appId, cifVersion, false, null);
			setUsageData(usageData);
			return Promise.resolve(new Map<string, any>().set(Constants.value, canCreate));
		}
		else {
			return logFailure(appId, true, errorData, MessageType.canCreateSession, cifVersion);
		}
	}

	export function createSession(parameters: Map<string, any>): Promise<Map<string, any>> {
		let telemetryData: any = new Object();
		let telemetryParameter: any = new Object();
		let startTime = new Date();
		const [provider, errorData] = getProvider(parameters);
		if (provider) {
			return new Promise<Map<string, any>>((resolve, reject) => {
				provider.createSession(parameters.get(Constants.input), parameters.get(Constants.context), parameters.get(Constants.customerName)).then(function (sessionId) {
					var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), MessageType.createSession, cifVersion, telemetryData);
					setPerfData(perfData);
					logParameterData(telemetryParameter, MessageType.createSession, {"input": parameters.get(Constants.input), "context": parameters.get(Constants.context)});
					var usageData = new UsageTelemetryData(provider.providerId, provider.name, provider.apiVersion, MessageType.createSession, provider.sortOrder, appId, cifVersion, false, null, telemetryParameter);
					setUsageData(usageData);
					return resolve(new Map<string, any>().set(Constants.value, sessionId));
				}, function (errorData) {
					logFailure(appId, true, errorData, MessageType.createSession, cifVersion, provider.providerId, provider.name, telemetryParameter);
					return reject(Microsoft.CIFramework.Utility.createErrorMap(errorData.errorMsg, MessageType.createSession))
				});
			});
		}
		else {
			return logFailure(appId, true, errorData, MessageType.createSession, cifVersion, "", "", telemetryParameter);
		}
	}

	export function requestFocusSession(parameters: Map<string, any>): Promise<Map<string, any>> {
		let telemetryData: any = new Object();
		let telemetryParameter: any = new Object();
		let startTime = new Date();
		const [provider, errorData] = getProvider(parameters);
		if (provider) {
			return new Promise<Map<string, any>>((resolve, reject) => {
				provider.requestFocusSession(parameters.get(Constants.sessionId), parameters.get(Constants.messagesCount)).then(function () {
					var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), MessageType.requestFocusSession, cifVersion, telemetryData);
					setPerfData(perfData);
					logParameterData(telemetryParameter, MessageType.requestFocusSession, {"sessionId": parameters.get(Constants.sessionId), "messagesCount": parameters.get(Constants.messagesCount)});
					var usageData = new UsageTelemetryData(provider.providerId, provider.name, provider.apiVersion, MessageType.requestFocusSession, provider.sortOrder, appId, cifVersion, false, null, telemetryParameter);
					setUsageData(usageData);
					return resolve(new Map<string, any>());
				}, function (errorData) {
					logFailure(appId, true, errorData, MessageType.requestFocusSession, cifVersion, provider.providerId, provider.name, telemetryParameter);
					return reject(Microsoft.CIFramework.Utility.createErrorMap(errorData.errorMsg, MessageType.requestFocusSession))
				});
			});
		}
		else {
			return logFailure(appId, true, errorData, MessageType.requestFocusSession, cifVersion, "", "", telemetryParameter);
		}
	}

	export function getFocusedTab(parameters: Map<string, any>): Promise<Map<string, any>> {
		let telemetryData: any = new Object();
		let startTime = new Date();
		const [provider, errorData] = getProvider(parameters);
		if (provider) {
			var tabId = provider.getFocusedTab();
			var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), MessageType.getFocusedTab, cifVersion, telemetryData);
			setPerfData(perfData);
			var usageData = new UsageTelemetryData(provider.providerId, provider.name, provider.apiVersion, MessageType.getFocusedTab, provider.sortOrder, appId, cifVersion, false, null);
			setUsageData(usageData);
			return Promise.resolve(new Map<string, any>().set(Constants.value, tabId));
		}
		else {
			return logFailure(appId, true, errorData, MessageType.getFocusedTab, cifVersion);
		}
	}

	export function createTab(parameters: Map<string, any>): Promise<Map<string, any>> {
		let telemetryData: any = new Object();
		let telemetryParameter: any = new Object();
		let startTime = new Date();
		const [provider, errorData] = getProvider(parameters);
		if (provider) {
			return new Promise<Map<string, any>>((resolve, reject) => {
				provider.createTab(parameters.get(Constants.input)).then(function (tabId) {
					var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), MessageType.createTab, cifVersion, telemetryData);
					setPerfData(perfData);
					logParameterData(telemetryParameter, MessageType.createTab, {"input": parameters.get(Constants.input)});
					var usageData = new UsageTelemetryData(provider.providerId, provider.name, provider.apiVersion, MessageType.createTab, provider.sortOrder, appId, cifVersion, false, null, telemetryParameter);
					setUsageData(usageData);
					return resolve(new Map<string, any>().set(Constants.value, tabId));
				}, function (errorData) {
					logFailure(appId, true, errorData, MessageType.createTab, cifVersion, provider.providerId, provider.name, telemetryParameter);
					return reject(Microsoft.CIFramework.Utility.createErrorMap(errorData.errorMsg, MessageType.createTab))
				});
			});
		}
		else {
			return logFailure(appId, true, errorData, MessageType.createTab, cifVersion, "", "", telemetryParameter);
		}
	}

	export function focusTab(parameters: Map<string, any>): Promise<Map<string, any>> {
		let telemetryData: any = new Object();
		let telemetryParameter: any = new Object();
		let startTime = new Date();
		const [provider, errorData] = getProvider(parameters);
		if (provider) {
			return new Promise<Map<string, any>>((resolve, reject) => {
				provider.focusTab(parameters.get(Constants.tabId)).then(function () {
					var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), MessageType.focusTab, cifVersion, telemetryData);
					setPerfData(perfData);
					logParameterData(telemetryParameter, MessageType.focusTab, {"tabId": parameters.get(Constants.tabId)});
					var usageData = new UsageTelemetryData(provider.providerId, provider.name, provider.apiVersion, MessageType.focusTab, provider.sortOrder, appId, cifVersion, false, null, telemetryParameter);
					setUsageData(usageData);
					return resolve(new Map<string, any>());
				}, function (errorData) {
					logFailure(appId, true, errorData, MessageType.focusTab, cifVersion, provider.providerId, provider.name, telemetryParameter);
					return reject(Microsoft.CIFramework.Utility.createErrorMap(errorData.errorMsg, MessageType.focusTab))
				});
			});
		}
		else {
			return logFailure(appId, true, errorData, MessageType.focusTab, cifVersion, "", "", telemetryParameter);
		}
	}
}