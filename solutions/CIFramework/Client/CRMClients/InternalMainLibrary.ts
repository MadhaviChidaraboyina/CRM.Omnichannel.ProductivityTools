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
/// <reference path="../Analytics/AnalyticsDataModel.ts" />

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
		["refreshform", [refreshForm]],
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
		["getTabsByTagOrName", [getTabsByTagOrName]],
		["refreshTab", [refreshTab]],
		["setSessionTitle", [setSessionTitle]],
		["setTabTitle", [setTabTitle]],
		["createTab", [createTab]],
		["focusTab", [focusTab]],
		["openkbsearchcontrol", [openKBSearchControl]],
		["notifyEvent", [notifyEvent]],
		["insertNotes", [insertNotes]],
		["logErrorsAndReject", [logErrorsAndReject]],
		["initLogAnalytics", [raiseInitAnalyticsEvent]],
		["logAnalyticsEvent", [raiseCustomAnalyticsEvent]],
		["updateContext", [updateContext]]
	]);

	let genericEventRegistrations = new Map<string, CIProvider[]>();

	/**
	 * Variable that will store all the info needed for library. There should be no other global variables in the library. Any info that needs to be stored should go into this.
	 */
	export var state = {} as IState;
	let presence = {} as IPresenceManager;
	const listenerWindow = window.parent;

	declare var Xrm: any;
	export declare var appId: string;
	export var cifVersion: string;
	cifVersion = "";
	declare var navigationType: string;
	navigationType = "";
	export var crmVersion: string = "";
	export var IsPlatformNotificationTimeoutInfra: boolean = false;

	/**
	 * utility func to check whether an object is null or undefined
	 */
	/** @internal */
	export function isNullOrUndefined(obj: any) {
		return (obj == null || typeof obj === "undefined");
	}

	/**
	 * utility func to check whether a string is null or empty
	 */
	/** @internal */
	function isNullOrEmpty(value: string): boolean {
		return value == null || value === "";
	}

	/**
	 * utility func to get provider based on a provider name and message type
	 */
	/** @internal */
	function getProviderFromProviderName(providerName: string, messageType: string): CIProvider {
		let providersForMessage: CIProvider[] = genericEventRegistrations.has(messageType) ? genericEventRegistrations.get(messageType) : [];
		for (let provider of providersForMessage) {
			if (provider.name === providerName) {
				return provider;
			}
		}
		return null;
	}

	/**
	 * This method will starting point for CI library and perform setup operations. retrieve the providers from CRM and initialize the Panels, if needed.
	 * returns false to disable the button visibility
	 */
	export function initializeCI(clientType: string, navigationTypeValue: string): boolean {
		let startTime = new Date();

		initializeTelemetry();
		// set the client implementation.
		state.client = setClient(clientType);
		if (!state.client.checkCIFCapability()) {
			return false;
		}
		var flags = Utility.extractParameter(window.top.location.search, "flags");
		if (flags) {
			let lflags = flags.toLowerCase();
			if (lflags.includes("navigationtype=multisession")) {
				navigationType = SessionType.MultiSession;
			}
			else if (lflags.includes("navigationtype=singlesession")) {
				navigationType = SessionType.SingleSession;
			}
			else {
				navigationType = navigationTypeValue;
			}
		}
		else {
			navigationType = navigationTypeValue;
		}
		state.sessionManager = GetSessionManager(clientType);
		presence = GetPresenceManager(clientType);

		// Todo - User story - 1083257 - Get the no. of widgets to load based on client & listener window and accordingly set the values.
		appId = top.location.search.split('appid=')[1].split('&')[0];

		try {
			let macrosLibScript = document.createElement("script");
			macrosLibScript.src = Xrm.Page.context.getClientUrl() + "/" + "/WebResources/CRMClients/msdyn_ProductivityMacros_internal_library.js";
			document.getElementsByTagName("body")[0].appendChild(macrosLibScript);
		} catch (error) {
			console.log("Failed to load msdyn_ProductivityMacros_internal_library.js");
		}

		try {
			let cifAnalyticsLibScript = document.createElement("script");
			cifAnalyticsLibScript.src = Xrm.Page.context.getClientUrl() + "/" + "/WebResources/CRMClients/msdyn_CIFAnalytics_internal_library.js";
			document.getElementsByTagName("body")[0].appendChild(cifAnalyticsLibScript);
		} catch (error) {
			console.log("Failed to load msdyn_CIFAnalytics_internal_library.js");
		}
		
		loadProvider();
		setNotificationTimeoutVersion();
		return false;
	}

	function setNotificationTimeoutVersion() {
		crmVersion = Xrm.Utility.getGlobalContext().getVersion();
		if (IsNotificationTimeoutInfraPresent()) {
			IsPlatformNotificationTimeoutInfra = true;
		}
	}

	function IsNotificationTimeoutInfraPresent() {
		return Utility.compareVersion(crmVersion, "9.1.0000.5911");
	}

	function loadProvider() {
		let trustedDomains: string[] = [];
		Xrm.WebApi.retrieveMultipleRecords(Constants.providerLogicalName, "?$filter=statecode eq 0 and contains(" + Constants.appSelectorFieldName + ",'" + appId + "')&$orderby=" + Constants.sortOrderFieldName + " asc").then(
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
					//let telemetryData: any = new Object();
					//var defaultMode = state.client.getWidgetMode(telemetryData) as number;
					var first: boolean = true;

					var environmentInfo: any = [];
					environmentInfo["orgId"] = Xrm.Utility.getGlobalContext().organizationSettings.organizationId;
					environmentInfo["orgName"] = Xrm.Utility.getGlobalContext().organizationSettings.uniqueName;
					environmentInfo["crmVersion"] = Xrm.Utility.getGlobalContext().getVersion();
					environmentInfo["appId"] = appId;
					for (var x of result.entities) {
						cifVersion = x[Constants.cifSolVersion];
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

						var usageData = new UsageTelemetryData(x[Constants.providerId], x[Constants.nameParameter], x[Constants.APIVersion], "loadProvider", x[Constants.SortOrder], appId, cifVersion, false, null);
						setUsageData(usageData);
					}
					// initialize and set post message wrapper.
					state.messageLibrary = new postMessageNamespace.postMsgWrapper(listenerWindow, Array.from(trustedDomains), apiHandlers);
					// load the widgets onto client. 
					state.client.loadWidgets(state.providerManager.ciProviders).then(function (widgetLoadStatus) {
						var usageData = new UsageTelemetryData(provider.providerId, provider.name, provider.apiVersion, "loadProvider - loadWidgets", provider.sortOrder, appId, cifVersion, false, null);
						setUsageData(usageData);
					});
				}
			},
			(error: Error) => {
				let errorData = generateErrorObject(error, "loadProvider - Xrm.WebApi.retrieveMultipleRecords - providerRecords", errorTypes.XrmApiError);
				logFailure(appId, true, errorData, MessageType.loadProvider, cifVersion);
			}
		);
	}

	/**
	 * IsConsoleApp API's client side handler that post message library will invoke.
	*/
	export function isConsoleAppInternal(): boolean {
		return navigationType == SessionType.MultiSession;
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
			ret = isConsoleAppInternal();
			var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), MessageType.isConsoleApp, cifVersion, telemetryData, parameters.get(Constants.correlationId));
			setPerfData(perfData);
			var paramData = new APIUsageTelemetry(provider.providerId, provider.name, provider.apiVersion, MessageType.isConsoleApp, provider.sortOrder, appId, cifVersion, false, null, "", parameters.get(Constants.correlationId));
			-			setAPIUsageTelemetry(paramData);
			return Promise.resolve(new Map().set(Constants.value, ret));
		}
		else {
			return logAPIFailure(appId, true, errorData, MessageType.isConsoleApp, cifVersion, "", "", "", parameters.get(Constants.correlationId));
		}
	}

	/**
	 * setPosition API's client side handler that post message library will invoke. 
	*/
	export function setPosition(parameters: Map<string, any>): Promise<Map<string, any>> {
		let telemetryData: any = new Object();
		let startTime = new Date();
		const [provider, errorData] = getProvider(parameters, [Constants.value]);
		if (provider) {
			let ret = state.client.setPanelPosition("setPanelPosition", parameters.get(Constants.value) as number, telemetryData);
			var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), MessageType.setPosition, cifVersion, telemetryData, parameters.get(Constants.correlationId));
			setPerfData(perfData);
			var paramData = new APIUsageTelemetry(provider.providerId, provider.name, provider.apiVersion, MessageType.setPosition, provider.sortOrder, appId, cifVersion, false, null, "", parameters.get(Constants.correlationId));
			setAPIUsageTelemetry(paramData);
			return Promise.resolve(new Map().set(Constants.value, ret));
		}
		else {
			return logAPIFailure(appId, true, errorData, MessageType.setPosition, cifVersion, "", "", "", parameters.get(Constants.correlationId));
		}
	}

	/**
	 * getPosition API's client side handler that post message library will invoke.
	*/
	export function getPosition(provider: CIProvider): number {
		let telemetryData: any = new Object();
		let startTime = new Date();
		let ret = state.client.getPanelPosition(telemetryData);
		//TODO: pass telemetry correlationId once this API is exposed
		var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), MessageType.getPosition, telemetryData);
		setPerfData(perfData);
		return ret as number;
	}

	/* Utility function to raise events registered for the framework and get back the response */
	function sendMessage(parameters: Map<string, any>, messageType: string, provider?: CIProvider): Promise<any> {
		if (isNullOrUndefined(provider)) {
			provider = state.providerManager.getActiveProvider();
			if (isNullOrUndefined(provider)) {
				const error = generateErrorObject(new Map().set("message", "No active provider found"), "sendGenericMessage", errorTypes.GenericError);
				return logAPIFailure(appId, true, error, messageType + " - sendGenericMessage", cifVersion, "", "");
			}
		}
		return new Promise<string>((resolve, reject) => {
			provider.raiseEvent(parameters, messageType).then(
				function (result: any) {
					resolve(result);
				},
				function (error: Error) {
					let errorData = generateErrorObject(error, messageType + " - sendMessage", errorTypes.GenericError);
					logAPIFailure(appId, true, errorData, messageType + " - sendMessage", cifVersion, provider.providerId, provider.name);
					reject(error);
				}
			);
		});
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
			let data = state.client.getEnvironment(provider, telemetryData);
			var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), MessageType.getEnvironment, cifVersion, telemetryData, parameters.get(Constants.correlationId));
			setPerfData(perfData);
			var paramData = new APIUsageTelemetry(provider.providerId, provider.name, provider.apiVersion, MessageType.getEnvironment, provider.sortOrder, appId, cifVersion, false, null, "", parameters.get(Constants.correlationId));
			setAPIUsageTelemetry(paramData);
			return Promise.resolve(new Map().set(Constants.value, data));
		}
		else {
			return logAPIFailure(appId, true, errorData, MessageType.getEnvironment, cifVersion, "", "", "", parameters.get(Constants.correlationId));
		}
	}

	function isPredefinedMessageType(messageType: string): boolean {
		return Object.keys(MessageType).indexOf(messageType) >= 0;
	}

	export function addGenericHandler(parameters: Map<string, any>): Promise<Map<string, boolean>> {
		let telemetryData: any = new Object();
		let telemetryParameter: any = new Object();
		let startTime = new Date();
		const [provider, errorData] = getProvider(parameters);
		if (provider) {
			let messageType: string = parameters.get(Constants.eventType);
			var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), MessageType.addGenericHandler, cifVersion, telemetryData, parameters.get(Constants.correlationId));
			setPerfData(perfData);
			logParameterData(telemetryParameter, MessageType.addGenericHandler, { "eventType": parameters.get(Constants.eventType) });
			var paramData = new APIUsageTelemetry(provider.providerId, provider.name, provider.apiVersion, MessageType.addGenericHandler, provider.sortOrder, appId, cifVersion, false, null, telemetryParameter, parameters.get(Constants.correlationId));
			setAPIUsageTelemetry(paramData);
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
			return logAPIFailure(appId, true, errorData, MessageType.addGenericHandler, cifVersion, "", "", telemetryParameter, parameters.get(Constants.correlationId));
		}
	}

	export function removeGenericHandler(parameters: Map<string, any>): Promise<Map<string, boolean>> {
		let telemetryData: any = new Object();
		let telemetryParameter: any = new Object();
		let startTime = new Date();
		const [provider, errorData] = getProvider(parameters, [Constants.eventType]);

		if (provider) {
			let messageType: string = parameters.get(Constants.eventType);
			var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), MessageType.removeGenericHandler, cifVersion, telemetryData, parameters.get(Constants.correlationId));
			setPerfData(perfData);
			logParameterData(telemetryParameter, MessageType.removeGenericHandler, { "eventType": parameters.get(Constants.eventType) });
			var paramData = new APIUsageTelemetry(provider.providerId, provider.name, provider.apiVersion, MessageType.removeGenericHandler, provider.sortOrder, appId, cifVersion, false, null, telemetryParameter, parameters.get(Constants.correlationId));
			setAPIUsageTelemetry(paramData);
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
			return logAPIFailure(appId, true, errorData, MessageType.removeGenericHandler, cifVersion, "", "", telemetryParameter, parameters.get(Constants.correlationId));
		}
	}

	/**
	* The handler will be called for generic event 
	* @param event. event.detail will be the event detail containing provider name
	*/
	function onGenericEvent(event: CustomEvent): void {
		if (genericEventRegistrations.has(event.type)) {
			for (let i = 0; i < genericEventRegistrations.get(event.type).length; i++) {
				sendGenericMessage(Microsoft.CIFramework.Utility.buildMap(event.detail), event.type);
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
			sendMessage(event.detail, MessageType.onSizeChanged, state.providerManager.getActiveProvider());
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
		sendMessage(event.detail, MessageType.onModeChanged);
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
		sendMessage(event.detail, MessageType.onPageNavigate);
	}

	/**
	 * subscriber of onClickToAct event
	*/
	export function onClickToAct(event: CustomEvent): void {
		sendMessage(Microsoft.CIFramework.Utility.buildMap(event.detail), MessageType.onClickToAct, state.providerManager.getActiveProvider());
	}

	/**
	 * subscriber of onSendKBArticle event
	*/
	export function onSendKBArticle(event: CustomEvent): void {
		sendMessage(Microsoft.CIFramework.Utility.buildMap(event.detail), MessageType.onSendKBArticle, state.providerManager.getActiveProvider());
	}

	/**
	 * method to send a generic message
	 */
	export function sendGenericMessage(parameters: Map<string, any>, messageType: string): Promise<any> {
		let provider: CIProvider;
		//Take the provider name if present in event.detail arg, otherwise take the current active provider
		if (!isNullOrUndefined(parameters) && !isNullOrUndefined(parameters.get("providerName"))) {
			provider = getProviderFromProviderName(parameters.get("providerName"), messageType);
		}
		else {
			provider = state.providerManager.getActiveProvider();
		}
		if (isNullOrUndefined(provider)) {
			const error = generateErrorObject(new Map().set("message", 'No active provider found'), "sendGenericMessage", errorTypes.InvalidParams);
			return logAPIFailure(appId, true, error, messageType + " - sendGenericMessage", cifVersion, "", parameters.get("providerName"));
		}
		var paramData = new APIUsageTelemetry(provider.providerId, provider.name, provider.apiVersion, messageType, provider.sortOrder, appId, cifVersion, false, null, "", parameters.get(Constants.correlationId));
		setAPIUsageTelemetry(paramData);
		return sendMessage(parameters, messageType, provider);
	}

	/**
	 * subscriber of onSetPresence event
	 */
	export function onSetPresence(event: CustomEvent): void {
		let eventMap = Microsoft.CIFramework.Utility.buildMap(event.detail);
		presence.setAgentPresence(eventMap.get("presenceInfo"));
		sendMessage(eventMap, MessageType.onSetPresenceEvent);
	}

	/**
	 * setClickToAct API's client side handler that post message library will invoke. 
	*/
	export function setClickToAct(parameters: Map<string, any>): Promise<Map<string, any>> {
		let telemetryData: any = new Object();
		let startTime = new Date();
		const [provider, errorData] = getProvider(parameters, [Constants.value]);
		if (provider) {
			return new Promise<Map<string, any>>((resolve, reject) => {
				return state.client.updateRecord(Constants.providerLogicalName, provider.providerId, telemetryData,
					new Map<string, any>([[Constants.clickToActAttributeName, parameters.get(Constants.value) as boolean]])).then(
						(result: Map<string, any>) => {
							provider.clickToAct = parameters.get(Constants.value) as boolean;
							state.providerManager.ciProviders.set(parameters.get(Constants.originURL), provider);

							var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), MessageType.setClickToAct, cifVersion, telemetryData, parameters.get(Constants.correlationId));
							setPerfData(perfData);
							var paramData = new APIUsageTelemetry(provider.providerId, provider.name, provider.apiVersion, MessageType.setClickToAct, provider.sortOrder, appId, cifVersion, false, null, "", parameters.get(Constants.correlationId));
							setAPIUsageTelemetry(paramData);
							return resolve(result);
						},
						(error: IErrorHandler) => {
							logAPIFailure(appId, true, error as IErrorHandler, MessageType.setClickToAct, cifVersion, provider.providerId, provider.name, "", parameters.get(Constants.correlationId));
							return reject(new Map().set(Constants.value, error));
						});
			});
		}
		else {
			return logAPIFailure(appId, true, errorData, MessageType.setClickToAct, cifVersion, "", "", "", parameters.get(Constants.correlationId));
		}
	}

	/**
	* API to check ClickToAct is enabled or not
	*/
	export function getClickToAct(parameters: Map<string, any>): Promise<Map<string, any>> {
		let startTime = new Date();
		const [provider, errorData] = getProvider(parameters);
		if (provider) {
			var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), MessageType.getClickToAct, cifVersion, null, parameters.get(Constants.correlationId));
			setPerfData(perfData);
			var paramData = new APIUsageTelemetry(provider.providerId, provider.name, provider.apiVersion, MessageType.getClickToAct, provider.sortOrder, appId, cifVersion, false, null, "", parameters.get(Constants.correlationId));
			setAPIUsageTelemetry(paramData);
			return Promise.resolve(new Map().set(Constants.value, provider.clickToAct));
		}
		else {
			return logAPIFailure(appId, true, errorData, MessageType.getClickToAct, cifVersion, "", "", "", parameters.get(Constants.correlationId));
		}
	}

	/**
	 * setMode API's client side handler that post message library will invoke. 
	*/
	export function setMode(parameters: Map<string, any>): Promise<Map<string, any>> {
		let telemetryData: any = new Object();
		let telemetryParameter: any = new Object();
		let startTime = new Date();
		const [provider, errorData] = getProvider(parameters, [Constants.value]);
		if (provider) {
			if (isConsoleAppInternal() && provider != state.providerManager.getActiveProvider()) {
				let error = {} as IErrorHandler;
				error.reportTime = new Date().toUTCString();
				error.errorMsg = "This operation can be performed from the active provider";
				error.errorType = errorTypes.GenericError;
				error.sourceFunc = "setMode";
				return logAPIFailure(appId, true, error, MessageType.setMode, cifVersion, "", "", telemetryParameter, parameters.get(Constants.correlationId));
			}
			else {
				state.client.collapseFlap();
				let mode: number = parameters.get(Constants.value) as number;
				let ret = state.client.setPanelMode("setPanelMode", mode, telemetryData);
				var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), MessageType.setMode, cifVersion, telemetryData, parameters.get(Constants.correlationId));
				setPerfData(perfData);
				logParameterData(telemetryParameter, MessageType.setMode, { "value": parameters.get(Constants.value) });
				var paramData = new APIUsageTelemetry(provider.providerId, provider.name, provider.apiVersion, MessageType.setMode, provider.sortOrder, appId, cifVersion, false, null, telemetryParameter, parameters.get(Constants.correlationId));
				setAPIUsageTelemetry(paramData);
				return Promise.resolve(new Map().set(Constants.value, ret));
			}
		}
		else {
			return logAPIFailure(appId, true, errorData, MessageType.setMode, cifVersion, "", "", telemetryParameter, parameters.get(Constants.correlationId));
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
			var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), MessageType.getMode, cifVersion, telemetryData, parameters.get(Constants.correlationId));
			setPerfData(perfData);
			var paramData = new APIUsageTelemetry(provider.providerId, provider.name, provider.apiVersion, MessageType.getMode, provider.sortOrder, appId, cifVersion, false, null, "", parameters.get(Constants.correlationId));
			setAPIUsageTelemetry(paramData);
			return Promise.resolve(new Map().set(Constants.value, state.client.getWidgetMode()));
		}
		else {
			return logAPIFailure(appId, true, errorData, MessageType.getMode, cifVersion, "", "", "", parameters.get(Constants.correlationId));
		}
	}

	/**
	 * setWidth API's client side handler that post message library will invoke. 
	*/
	export function setWidth(parameters: Map<string, any>): Promise<Map<string, any>> {   //TODO: This should be reinterpreted to 'only the widget's width changed. Should we even allow this in multi-widget scenario?
		//TODO: if the new width is greater than panel width, what do we do?
		let telemetryData: any = new Object();
		let telemetryParameter: any = new Object();
		let startTime = new Date();
		const [provider, errorData] = getProvider(parameters, [Constants.value]);
		if (provider) {
			if (isConsoleAppInternal() && provider != state.providerManager.getActiveProvider()) {
				let error = {} as IErrorHandler;
				error.reportTime = new Date().toUTCString();
				error.errorMsg = "This operation can be performed from the active provider";
				error.errorType = errorTypes.GenericError;
				error.sourceFunc = "setWidth";
				return logAPIFailure(appId, true, error, MessageType.setWidth, cifVersion, "", "", telemetryParameter, parameters.get(Constants.correlationId));
			}
			else {
				let ret = state.client.setWidgetWidth("setWidgetWidth", parameters.get(Constants.value) as number, telemetryData);
				var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), MessageType.setWidth, cifVersion, telemetryData, parameters.get(Constants.correlationId));
				setPerfData(perfData);
				logParameterData(telemetryParameter, MessageType.setWidth, { "value": parameters.get(Constants.value) });
				var paramData = new APIUsageTelemetry(provider.providerId, provider.name, provider.apiVersion, MessageType.setWidth, provider.sortOrder, appId, cifVersion, false, null, telemetryParameter, parameters.get(Constants.correlationId));
				setAPIUsageTelemetry(paramData);
				return Promise.resolve(new Map().set(Constants.value, ret));
			}
		}
		else {
			return logAPIFailure(appId, true, errorData, MessageType.setWidth, cifVersion, "", "", telemetryParameter, parameters.get(Constants.correlationId));
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
			var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), MessageType.getWidth, cifVersion, telemetryData, parameters.get(Constants.correlationId));
			setPerfData(perfData);
			var paramData = new APIUsageTelemetry(provider.providerId, provider.name, provider.apiVersion, MessageType.getWidth, provider.sortOrder, appId, cifVersion, false, null, "", parameters.get(Constants.correlationId));
			setAPIUsageTelemetry(paramData);
			return Promise.resolve(new Map().set(Constants.value, Number(state.client.getWidgetWidth())));
		}
		else {
			return logAPIFailure(appId, true, errorData, MessageType.getWidth, cifVersion, "", "", "", parameters.get(Constants.correlationId));
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
			if (isConsoleAppInternal() && provider != state.providerManager.getActiveProvider()) {
				let error = {} as IErrorHandler;
				error.reportTime = new Date().toUTCString();
				error.errorMsg = "This operation can be performed from the active provider";
				error.errorType = errorTypes.GenericError;
				error.sourceFunc = "openKBSearchControl";
				return logAPIFailure(appId, true, error, MessageType.openKBSearchControl, cifVersion, "", "", "", parameters.get(Constants.correlationId));
			}
			else {
				let ret = state.client.openKBSearchControl(parameters.get(Constants.SearchString), telemetryData);
				var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), MessageType.openKBSearchControl, cifVersion, telemetryData, parameters.get(Constants.correlationId));
				setPerfData(perfData);
				var paramData = new APIUsageTelemetry(provider.providerId, provider.name, provider.apiVersion, MessageType.openKBSearchControl, provider.sortOrder, appId, cifVersion, false, null, "", parameters.get(Constants.correlationId));
				setAPIUsageTelemetry(paramData);
				return Promise.resolve(new Map().set(Constants.value, ret));
			}
		}
		else {
			return logAPIFailure(appId, true, errorData, MessageType.openKBSearchControl, cifVersion, "", "", "", parameters.get(Constants.correlationId));
		}
	}

	export function searchAndOpenRecords(parameters: Map<string, any>): Promise<Map<string, any>> {
		const [provider, errorData] = getProvider(parameters);
		if (provider) {
			return doSearch(parameters, false, MessageType.searchAndOpenRecords);
		}
		else {
			return logAPIFailure(appId, true, errorData, MessageType.searchAndOpenRecords, cifVersion, "", "", "", parameters.get(Constants.correlationId));
		}
	}

	function doSearch(parameters: Map<string, any>, searchOnly: boolean, callerName?: string): Promise<Map<string, any>> {
		let telemetryData: any = new Object();
		let telemetryParameter: any = new Object();
		let startTime = new Date();
		const [provider, errorData] = getProvider(parameters, [Constants.entityName, Constants.queryParameters]);
		if (provider) {
			if (isConsoleAppInternal() && provider != state.providerManager.getActiveProvider()) {
				let error = {} as IErrorHandler;
				error.reportTime = new Date().toUTCString();
				error.errorMsg = "This operation can be performed from the active provider";
				error.errorType = errorTypes.GenericError;
				error.sourceFunc = "doSearch";
				return logAPIFailure(appId, true, error, MessageType.doSearch, cifVersion, "", "", telemetryParameter, parameters.get(Constants.correlationId));
			}
			else {
				let searchResult = state.client.retrieveMultipleAndOpenRecords(parameters.get(Constants.entityName), parameters.get(Constants.queryParameters), searchOnly, telemetryData);
				var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), callerName ? callerName : MessageType.doSearch, cifVersion, telemetryData, parameters.get(Constants.correlationId));
				setPerfData(perfData);
				logParameterData(telemetryParameter, MessageType.doSearch, { "searchOnly": searchOnly });
				var paramData = new APIUsageTelemetry(provider.providerId, provider.name, provider.apiVersion, callerName ? callerName : MessageType.doSearch, provider.sortOrder, appId, cifVersion, false, null, telemetryParameter, parameters.get(Constants.correlationId));
				setAPIUsageTelemetry(paramData);
				return searchResult;
			}
		}
		else {
			return logAPIFailure(appId, true, errorData, callerName ? callerName : MessageType.doSearch, cifVersion, "", "", telemetryParameter, parameters.get(Constants.correlationId));
		}
	}

	export function search(parameters: Map<string, any>): Promise<Map<string, any>> {
		const [provider, errorData] = getProvider(parameters);
		if (provider) {
			return doSearch(parameters, true, MessageType.search);
		}
		else {
			return logAPIFailure(appId, true, errorData, MessageType.search, cifVersion, "", "", "", parameters.get(Constants.correlationId));
		}
	}

	export function renderSearchPage(parameters: Map<string, any>, entityName: string, searchString: string): Promise<Map<string, any>> {
		let telemetryData: any = new Object();
		let telemetryParameter: any = new Object();
		let startTime = new Date();
		const [provider, errorData] = getProvider(parameters, [Constants.entityName]);
		if (provider) {
			if (isConsoleAppInternal() && provider != state.providerManager.getActiveProvider()) {
				let error = {} as IErrorHandler;
				error.reportTime = new Date().toUTCString();
				error.errorMsg = "This operation can be performed from the active provider";
				error.errorType = errorTypes.GenericError;
				error.sourceFunc = "renderSearchPage";
				return logAPIFailure(appId, true, error, MessageType.renderSearchPage, cifVersion, "", "", telemetryParameter, parameters.get(Constants.correlationId));
			}
			else {
				return new Promise<Map<string, any>>((resolve, reject) => {
					state.client.renderSearchPage(parameters.get(Constants.entityName), parameters.get(Constants.SearchString)).then(
						function (res) {
							var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), MessageType.renderSearchPage, cifVersion, telemetryData, parameters.get(Constants.correlationId));
							setPerfData(perfData);
							logParameterData(telemetryParameter, MessageType.renderSearchPage, { "entityName": parameters.get(Constants.entityName) });
							var paramData = new APIUsageTelemetry(provider.providerId, provider.name, provider.apiVersion, MessageType.renderSearchPage, provider.sortOrder, appId, cifVersion, false, null, telemetryParameter, parameters.get(Constants.correlationId));
							setAPIUsageTelemetry(paramData);
							return resolve(new Map<string, any>().set(Constants.value, res));
						},
						(error: IErrorHandler) => {
							logAPIFailure(appId, true, error as IErrorHandler, MessageType.renderSearchPage, cifVersion, provider.providerId, provider.name, telemetryParameter, parameters.get(Constants.correlationId));
							return reject(new Map<string, any>().set(Constants.value, error));
						}
					);
				});
			}
		}
		else {
			return logAPIFailure(appId, true, errorData, MessageType.renderSearchPage, cifVersion, "", "", telemetryParameter, parameters.get(Constants.correlationId));
		}
	}

	export function createRecord(parameters: Map<string, any>): Promise<Map<string, any>> {
		let telemetryData: any = new Object();
		let telemetryParameter: any = new Object();
		let startTime = new Date();
		const [provider, errorData] = getProvider(parameters, [Constants.entityName, Constants.value]);
		if (provider) {
			return new Promise<Map<string, any>>((resolve, reject) => {
				state.client.createRecord(parameters.get(Constants.entityName), null, telemetryData, parameters.get(Constants.value)).then(
					function (res) {
						var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), MessageType.createRecord, cifVersion, telemetryData, parameters.get(Constants.correlationId));
						setPerfData(perfData);
						logParameterData(telemetryParameter, MessageType.createRecord, { "entityName": parameters.get(Constants.entityName) });
						var paramData = new APIUsageTelemetry(provider.providerId, provider.name, provider.apiVersion, MessageType.createRecord, provider.sortOrder, appId, cifVersion, false, null, telemetryParameter, parameters.get(Constants.correlationId));
						setAPIUsageTelemetry(paramData);
						return resolve(new Map<string, any>().set(Constants.value, res));
					},
					(error: IErrorHandler) => {
						logAPIFailure(appId, true, error as IErrorHandler, MessageType.createRecord, cifVersion, provider.providerId, provider.name, telemetryParameter, parameters.get(Constants.correlationId));
						return reject(new Map<string, any>().set(Constants.value, error));
					}
				);
			});
		}
		else {
			return logAPIFailure(appId, true, errorData, MessageType.createRecord, cifVersion, "", "", telemetryParameter, parameters.get(Constants.correlationId));
		}
	}

	export function retrieveRecord(parameters: Map<string, any>): Promise<Map<string, any>> {
		let telemetryData: any = new Object();
		let telemetryParameter: any = new Object();
		let startTime = new Date();
		const [provider, errorData] = getProvider(parameters, [Constants.entityName, Constants.entityId, Constants.queryParameters]);
		if (provider) {
			return new Promise<Map<string, any>>((resolve, reject) => {
				state.client.retrieveRecord(parameters.get(Constants.entityName), parameters.get(Constants.entityId), telemetryData, parameters.get(Constants.queryParameters)).then(
					function (res) {
						var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), MessageType.retrieveRecord, cifVersion, telemetryData, parameters.get(Constants.correlationId));
						setPerfData(perfData);
						logParameterData(telemetryParameter, MessageType.retrieveRecord, { "entityName": parameters.get(Constants.entityName), "entityId": parameters.get(Constants.entityId) });
						var paramData = new APIUsageTelemetry(provider.providerId, provider.name, provider.apiVersion, MessageType.retrieveRecord, provider.sortOrder, appId, cifVersion, false, null, telemetryParameter, parameters.get(Constants.correlationId));
						setAPIUsageTelemetry(paramData);
						return resolve(new Map<string, any>().set(Constants.value, res));
					},
					(error: IErrorHandler) => {
						logAPIFailure(appId, true, error as IErrorHandler, MessageType.retrieveRecord, cifVersion, provider.providerId, provider.name, telemetryParameter, parameters.get(Constants.correlationId));
						return reject(new Map<string, any>().set(Constants.value, error));
					}
				);
			});
		}
		else {
			return logAPIFailure(appId, true, errorData, MessageType.retrieveRecord, cifVersion, "", "", telemetryParameter, parameters.get(Constants.correlationId));
		}
	}

	export function updateRecord(parameters: Map<string, any>): Promise<Map<string, any>> {
		let telemetryData: any = new Object();
		let telemetryParameter: any = new Object();
		let startTime = new Date();
		const [provider, errorData] = getProvider(parameters, [Constants.entityName, Constants.entityId, Constants.value]);
		if (provider) {
			return new Promise<Map<string, any>>((resolve, reject) => {
				state.client.updateRecord(parameters.get(Constants.entityName), parameters.get(Constants.entityId), telemetryData, parameters.get(Constants.value)).then(
					function (res) {
						var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), MessageType.updateRecord, cifVersion, telemetryData, parameters.get(Constants.correlationId));
						setPerfData(perfData);
						logParameterData(telemetryParameter, MessageType.updateRecord, { "entityName": parameters.get(Constants.entityName), "entityId": parameters.get(Constants.entityId) });
						var paramData = new APIUsageTelemetry(provider.providerId, provider.name, provider.apiVersion, MessageType.updateRecord, provider.sortOrder, appId, cifVersion, false, null, telemetryParameter, parameters.get(Constants.correlationId));
						setAPIUsageTelemetry(paramData);
						return resolve(new Map<string, any>().set(Constants.value, res));
					},
					(error: IErrorHandler) => {
						logAPIFailure(appId, true, error as IErrorHandler, MessageType.updateRecord, cifVersion, provider.providerId, provider.name, telemetryParameter, parameters.get(Constants.correlationId));
						return reject(new Map<string, any>().set(Constants.value, error));
					}
				);
			});
		}
		else {
			return logAPIFailure(appId, true, errorData, MessageType.updateRecord, cifVersion, "", "", telemetryParameter, parameters.get(Constants.correlationId));
		}
	}

	export function deleteRecord(parameters: Map<string, any>): Promise<Map<string, any>> {
		let telemetryData: any = new Object();
		let telemetryParameter: any = new Object();
		let startTime = new Date();
		const [provider, errorData] = getProvider(parameters, [Constants.entityName, Constants.entityId]);
		if (provider) {
			return new Promise<Map<string, any>>((resolve, reject) => {
				state.client.deleteRecord(parameters.get(Constants.entityName), parameters.get(Constants.entityId), telemetryData).then(
					function (res) {
						var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), MessageType.deleteRecord, cifVersion, telemetryData, parameters.get(Constants.correlationId));
						setPerfData(perfData);
						logParameterData(telemetryParameter, MessageType.deleteRecord, { "entityName": parameters.get(Constants.entityName), "entityId": parameters.get(Constants.entityId) });
						var paramData = new APIUsageTelemetry(provider.providerId, provider.name, provider.apiVersion, MessageType.deleteRecord, provider.sortOrder, appId, cifVersion, false, null, telemetryParameter, parameters.get(Constants.correlationId));
						setAPIUsageTelemetry(paramData);
						return resolve(new Map<string, any>().set(Constants.value, res));
					},
					(error: IErrorHandler) => {
						logAPIFailure(appId, true, error as IErrorHandler, MessageType.deleteRecord, cifVersion, provider.providerId, provider.name, telemetryParameter, parameters.get(Constants.correlationId));
						return reject(new Map<string, any>().set(Constants.value, error));
					}
				);
			});
		}
		else {
			return logAPIFailure(appId, true, errorData, MessageType.deleteRecord, cifVersion, "", "", telemetryParameter, parameters.get(Constants.correlationId));
		}
	}

	// Time taken by openForm is dependent on User Action. Hence, not logging this in Telemetry
	export function openForm(parameters: Map<string, any>): Promise<Map<string, any>> {
		const [provider, errorData] = getProvider(parameters, [Constants.entityFormOptions, Constants.entityFormParameters]);
		let telemetryParameter: any = new Object();
		if (provider) {
			if (isConsoleAppInternal() && provider != state.providerManager.getActiveProvider()) {
				let error = {} as IErrorHandler;
				error.reportTime = new Date().toUTCString();
				error.errorMsg = "This operation can be performed from the active provider";
				error.errorType = errorTypes.GenericError;
				error.sourceFunc = "openForm";
				return logAPIFailure(appId, true, error, MessageType.openForm, cifVersion, "", "", telemetryParameter, parameters.get(Constants.correlationId));
			}
			else { 
				let res = state.client.openForm(parameters.get(Constants.entityFormOptions), parameters.get(Constants.entityFormParameters));
				logParameterData(telemetryParameter, MessageType.openForm, { "entityFormOptions": parameters.get(Constants.entityFormOptions) });
				var paramData = new APIUsageTelemetry(provider.providerId, provider.name, provider.apiVersion, MessageType.openForm, provider.sortOrder, appId, cifVersion, false, null, telemetryParameter, parameters.get(Constants.correlationId));
				setAPIUsageTelemetry(paramData);
				return res;
			}
		}
		else {
			return logAPIFailure(appId, true, errorData, MessageType.openForm, cifVersion, "", "", telemetryParameter, parameters.get(Constants.correlationId));
		}
	}

	export function refreshForm(parameters: Map<string, any>): Promise<Map<string, any>> {
		const [provider, errorData] = getProvider(parameters, [Constants.Save]);
		if (provider) {
			return new Promise<Map<string, any>>((resolve, reject) => {
				state.client.refreshForm(parameters.get(Constants.Save)).then(function (res) {
					return resolve(new Map<string, any>().set(Constants.value, res));
				}, function (error) {
					return reject(new Map<string, any>().set(Constants.value, error));
				});
			});
		}
		else {
			return logFailure(appId, true, errorData, MessageType.refreshForm, cifVersion, "", "", "", parameters.get(Constants.correlationId));
		}
	}
	export function getEntityMetadata(parameters: Map<string, any>): Promise<Map<string, any>> {
		let telemetryData: any = new Object();
		let telemetryParameter: any = new Object();
		let startTime = new Date();
		const [provider, errorData] = getProvider(parameters, [Constants.entityName]);
		if (provider) {
			return new Promise<Map<string, any>>((resolve, reject) => {
				state.client.getEntityMetadata(parameters.get(Constants.entityName), parameters.get(Constants.Attributes)).then(
					function (res) {
						var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), MessageType.getEntityMetadata, cifVersion, telemetryData, parameters.get(Constants.correlationId));
						setPerfData(perfData);
						logParameterData(telemetryParameter, MessageType.getEntityMetadata, { "entityName": parameters.get(Constants.entityName), "Attributes": parameters.get(Constants.Attributes) });
						var paramData = new APIUsageTelemetry(provider.providerId, provider.name, provider.apiVersion, MessageType.getEntityMetadata, provider.sortOrder, appId, cifVersion, false, null, telemetryParameter, parameters.get(Constants.correlationId));
						setAPIUsageTelemetry(paramData);
						return resolve(new Map<string, any>().set(Constants.value, res));
					},
					(error: IErrorHandler) => {
						logAPIFailure(appId, true, error as IErrorHandler, MessageType.getEntityMetadata, cifVersion, provider.providerId, provider.name, telemetryParameter, parameters.get(Constants.correlationId));
						return reject(new Map<string, any>().set(Constants.value, error));
					}
				);
			});
		}
		else {
			return logAPIFailure(appId, true, errorData, MessageType.getEntityMetadata, cifVersion, "", "", telemetryParameter, parameters.get(Constants.correlationId));
		}
	}

	/**
	 * API to invoke toast popup widget
	 *
	 * @param value. It's a string which contains header,body of the popup
	 *
	*/
	export function notifyEvent(notificationObject: Map<string, any>): Promise<any> {
		let telemetryData: any = new Object();
		let startTime = new Date();
		const [provider, errorData] = getProvider(notificationObject, [Constants.value]);
		if (provider) {
			raiseSystemAnalyticsEvent(CIFramework.InternalEventName.NotificationReceived, notificationObject);
			return new Promise<any>((resolve, reject) => {
				//let panelWidth = state.client.getWidgetWidth();
				notifyEventClient(notificationObject).then(
					function (res) {
						var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), MessageType.notifyEvent, cifVersion, telemetryData, notificationObject.get(Constants.correlationId));
						setPerfData(perfData);
						var paramData = new APIUsageTelemetry(provider.providerId, provider.name, provider.apiVersion, MessageType.notifyEvent, provider.sortOrder, appId, cifVersion, false, null, "", notificationObject.get(Constants.correlationId));
						setAPIUsageTelemetry(paramData);
						return resolve(res);
					},
					(error: IErrorHandler) => {
						logAPIFailure(appId, true, error as IErrorHandler, MessageType.notifyEvent, cifVersion, provider.providerId, provider.name, "", notificationObject.get(Constants.correlationId));
						return reject(Microsoft.CIFramework.Utility.createErrorMap(error.errorMsg, MessageType.notifyEvent));
					}
				);
			});
		}
		else {
			return logAPIFailure(appId, true, errorData, MessageType.notifyEvent, cifVersion, "", "", "", notificationObject.get(Constants.correlationId));
		}
	}

	export function insertNotes(notesDetails: Map<string, any>): Promise<any> {
		let telemetryData: any = new Object();
		let startTime = new Date();
		const [provider, errorData] = getProvider(notesDetails, [Constants.value]);
		if (provider) {
			return new Promise<any>((resolve, reject) => {
				let width = state.client.expandFlap(intermediateSaveNotes);
				if (!width) {
					return reject(new Map<string, any>().set(Constants.value, "Flap already expanded").set(Constants.ErrorCode, ErrorCode.Notes_Flap_Already_Expanded));
				}
				insertNotesClient(notesDetails).then(
					function (res) {
						var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), MessageType.insertNotes, cifVersion, telemetryData, notesDetails.get(Constants.correlationId));
						setPerfData(perfData);
						var paramData = new APIUsageTelemetry(provider.providerId, provider.name, provider.apiVersion, MessageType.insertNotes, provider.sortOrder, appId, cifVersion, false, null, "", notesDetails.get(Constants.correlationId));
						setAPIUsageTelemetry(paramData);
						state.client.collapseFlap();
						return resolve(res);
					},
					(error: IErrorHandler) => {
						state.client.collapseFlap();
						logAPIFailure(appId, true, error as IErrorHandler, MessageType.insertNotes, cifVersion, provider.providerId, provider.name, "", notesDetails.get(Constants.correlationId));
						return reject(new Map<string, any>().set(Constants.value, error));
					}
				);
			});
		}
		else {
			return logAPIFailure(appId, true, errorData, MessageType.insertNotes, cifVersion, "", "", "", notesDetails.get(Constants.correlationId));
		}
	}

	export function setAgentPresence(parameters: Map<string, any>): Promise<Map<string, any>> {
		/*if (parameters && parameters.has(Constants.presenceInfo)) {
			window.localStorage[Constants.CURRENT_PRESENCE_INFO] = parameters.get(Constants.presenceInfo);
		}*/
		let telemetryData: any = new Object();
		let telemetryParameter: any = new Object();
		let startTime = new Date();
		const [provider, errorData] = getProvider(parameters, [Constants.entityName]);
		if (provider) {
			let agentPresenceStatus = presence.setAgentPresence(JSON.parse(parameters.get(Constants.presenceInfo)), telemetryData);
			var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), MessageType.setAgentPresence, cifVersion, telemetryData, parameters.get(Constants.correlationId));
			setPerfData(perfData);
			logParameterData(telemetryParameter, MessageType.setAgentPresence, { "presenceInfo": parameters.get(Constants.presenceInfo) });
			var paramData = new APIUsageTelemetry(provider.providerId, provider.name, provider.apiVersion, MessageType.setAgentPresence, provider.sortOrder, appId, cifVersion, false, null, telemetryParameter, parameters.get(Constants.correlationId));
			setAPIUsageTelemetry(paramData);
			return Promise.resolve(new Map().set(Constants.value, agentPresenceStatus));
		}
		else {
			return logAPIFailure(appId, true, errorData, MessageType.setAgentPresence, cifVersion, "", "", telemetryParameter, parameters.get(Constants.correlationId));
		}
	}

	export function initializeAgentPresenceList(parameters: Map<string, any>): Promise<Map<string, any>> {
		/*if (parameters && parameters.has(Constants.presenceList)) {
			window.localStorage[Constants.GLOBAL_PRESENCE_LIST] = parameters.get(Constants.presenceList);
		}*/
		let telemetryData: any = new Object();
		let telemetryParameter: any = new Object();
		let startTime = new Date();
		const [provider, errorData] = getProvider(parameters, [Constants.entityName]);
		if (provider) {
			let presenceListDivStatus = presence.initializeAgentPresenceList(JSON.parse(parameters.get(Constants.presenceList)), telemetryData);
			var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), MessageType.initializeAgentPresenceList, cifVersion, telemetryData, parameters.get(Constants.correlationId));
			setPerfData(perfData);
			logParameterData(telemetryParameter, MessageType.initializeAgentPresenceList, { "presenceList": parameters.get(Constants.presenceList) });
			var paramData = new APIUsageTelemetry(provider.providerId, provider.name, provider.apiVersion, MessageType.initializeAgentPresenceList, provider.sortOrder, appId, cifVersion, false, null, telemetryParameter, parameters.get(Constants.correlationId));
			setAPIUsageTelemetry(paramData);
			return Promise.resolve(new Map().set(Constants.value, presenceListDivStatus));
		}
		else {
			return logAPIFailure(appId, true, errorData, MessageType.initializeAgentPresenceList, cifVersion, "", "", telemetryParameter, parameters.get(Constants.correlationId));
		}
	}

	export function getAllSessions(parameters: Map<string, any>): Promise<Map<string, any>> {
		let telemetryData: any = new Object();
		let startTime = new Date();
		const [provider, errorData] = getProvider(parameters, [Constants.entityName]);
		if (provider) {
			var sessionIds = provider.getAllSessions();
			var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), MessageType.getAllSessions, cifVersion, telemetryData, parameters.get(Constants.correlationId));
			setPerfData(perfData);
			var paramData = new APIUsageTelemetry(provider.providerId, provider.name, provider.apiVersion, MessageType.getAllSessions, provider.sortOrder, appId, cifVersion, false, null, "", parameters.get(Constants.correlationId));
			setAPIUsageTelemetry(paramData);
			return Promise.resolve(new Map<string, any>().set(Constants.value, sessionIds));
		}
		else {
			return logAPIFailure(appId, true, errorData, MessageType.getAllSessions, cifVersion, "", "", "", parameters.get(Constants.correlationId));
		}
	}

	export function getFocusedSession(parameters: Map<string, any>): Promise<Map<string, any>> {
		let telemetryData: any = new Object();
		let startTime = new Date();
		const [provider, errorData] = getProvider(parameters);
		if (provider) {
			var sessionId = provider.getFocusedSession(telemetryData);
			var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), MessageType.getFocusedSession, cifVersion, telemetryData, parameters.get(Constants.correlationId));
			setPerfData(perfData);
			var paramData = new APIUsageTelemetry(provider.providerId, provider.name, provider.apiVersion, MessageType.getFocusedSession, provider.sortOrder, appId, cifVersion, false, null, "", parameters.get(Constants.correlationId));
			setAPIUsageTelemetry(paramData);
			return Promise.resolve(new Map<string, any>().set(Constants.value, sessionId));
		}
		else {
			return logAPIFailure(appId, true, errorData, MessageType.getFocusedSession, cifVersion, "", "", "", parameters.get(Constants.correlationId));
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
					var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), MessageType.getSession, cifVersion, telemetryData, parameters.get(Constants.correlationId));
					setPerfData(perfData);
					logParameterData(telemetryParameter, MessageType.getSession, { "sessionId": parameters.get(Constants.sessionId) });
					var paramData = new APIUsageTelemetry(provider.providerId, provider.name, provider.apiVersion, MessageType.getSession, provider.sortOrder, appId, cifVersion, false, null, telemetryParameter, parameters.get(Constants.correlationId));
					setAPIUsageTelemetry(paramData);
					return resolve(new Map<string, any>().set(Constants.value, session));
				}, function (error) {
					logAPIFailure(appId, true, error, MessageType.getSession, cifVersion, provider.providerId, provider.name, telemetryParameter, parameters.get(Constants.correlationId));
					return reject(Microsoft.CIFramework.Utility.createErrorMap(error.errorMsg, MessageType.getSession))
				});
			});
		}
		else {
			return logAPIFailure(appId, true, errorData, MessageType.getSession, cifVersion, "", "", telemetryParameter, parameters.get(Constants.correlationId));
		}
	}

	export function canCreateSession(parameters: Map<string, any>): Promise<Map<string, any>> {
		let telemetryData: any = new Object();
		let startTime = new Date();
		const [provider, errorData] = getProvider(parameters);
		if (provider) {
			var canCreate = provider.canCreateSession(telemetryData);
			var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), MessageType.canCreateSession, cifVersion, telemetryData, parameters.get(Constants.correlationId));
			setPerfData(perfData);
			var paramData = new APIUsageTelemetry(provider.providerId, provider.name, provider.apiVersion, MessageType.canCreateSession, provider.sortOrder, appId, cifVersion, false, null, "", parameters.get(Constants.correlationId));
			setAPIUsageTelemetry(paramData);
			return Promise.resolve(new Map<string, any>().set(Constants.value, canCreate));
		}
		else {
			return logAPIFailure(appId, true, errorData, MessageType.canCreateSession, cifVersion, "", "", "", parameters.get(Constants.correlationId));
		}
	}

	export function createSession(parameters: Map<string, any>): Promise<Map<string, any>> {
		let telemetryData: any = new Object();
		let startTime = new Date();
		const [provider, errorData] = getProvider(parameters);
		if (provider) {
			return new Promise<Map<string, any>>((resolve, reject) => {
				provider.createSession(parameters.get(Constants.input), parameters.get(Constants.context), parameters.get(Constants.customerName), telemetryData, appId, cifVersion, parameters.get(Constants.correlationId)).then(function (sessionId) {
					raiseSystemAnalyticsEvent(InternalEventName.SessionStarted, parameters, new Map<string, any>().set(AnalyticsConstants.clientSessionId, sessionId));
					var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), MessageType.createSession, cifVersion, telemetryData, parameters.get(Constants.correlationId));
					setPerfData(perfData);
					var paramData = new APIUsageTelemetry(provider.providerId, provider.name, provider.apiVersion, MessageType.createSession, provider.sortOrder, appId, cifVersion, false, null, "", parameters.get(Constants.correlationId));
					setAPIUsageTelemetry(paramData);
					return resolve(new Map<string, any>().set(Constants.value, sessionId));
				}, function (error) {
					logAPIFailure(appId, true, error, MessageType.createSession, cifVersion, provider.providerId, provider.name, "", parameters.get(Constants.correlationId));
					return reject(Microsoft.CIFramework.Utility.createErrorMap(error.errorMsg, MessageType.createSession))
				});
			});
		}
		else {
			return logAPIFailure(appId, true, errorData, MessageType.createSession, cifVersion, "", "", "", parameters.get(Constants.correlationId));
		}
	}

	export function setSessionTitle(parameters: Map<string, any>): Promise<Map<string, any>> {
		let telemetryData: any = new Object();
		let startTime = new Date();
		const [provider, errorData] = getProvider(parameters);
		if (provider) {
			return new Promise<Map<string, any>>((resolve, reject) => {
				provider.setSessionTitle(parameters.get(Constants.input)).then(function (result: string) {
					var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), MessageType.setSessionTitle, cifVersion, telemetryData, parameters.get(Constants.correlationId));
					setPerfData(perfData);
					var usageData = new UsageTelemetryData(provider.providerId, provider.name, provider.apiVersion, MessageType.setSessionTitle, provider.sortOrder, appId, cifVersion, false, null, "", parameters.get(Constants.correlationId));
					setUsageData(usageData);
					return resolve(new Map<string, any>().set(Constants.value, result));
				}, function (errorData: IErrorHandler) {
					logFailure(appId, true, errorData, MessageType.setSessionTitle, cifVersion, provider.providerId, provider.name, "", parameters.get(Constants.correlationId));
					return reject(Microsoft.CIFramework.Utility.createErrorMap(errorData.errorMsg, MessageType.setSessionTitle))
				});
			});
		}
		else {
			return logFailure(appId, true, errorData, MessageType.setSessionTitle, cifVersion, "", "", "", parameters.get(Constants.correlationId));
		}
	}

	export function setTabTitle(parameters: Map<string, any>): Promise<Map<string, any>> {
		let telemetryData: any = new Object();
		let startTime = new Date();
		const [provider, errorData] = getProvider(parameters);
		if (provider) {
			return new Promise<Map<string, any>>((resolve, reject) => {
				provider.setTabTitle(parameters.get(Constants.tabId), parameters.get(Constants.input)).then(function (result: string) {
					var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), MessageType.setTabTitle, cifVersion, telemetryData, parameters.get(Constants.correlationId));
					setPerfData(perfData);
					var usageData = new UsageTelemetryData(provider.providerId, provider.name, provider.apiVersion, MessageType.setTabTitle, provider.sortOrder, appId, cifVersion, false, null, "", parameters.get(Constants.correlationId));
					setUsageData(usageData);
					return resolve(new Map<string, any>().set(Constants.value, result));
				}, function (errorData: IErrorHandler) {
					logFailure(appId, true, errorData, MessageType.setTabTitle, cifVersion, provider.providerId, provider.name, "", parameters.get(Constants.correlationId));
					return reject(Microsoft.CIFramework.Utility.createErrorMap(errorData.errorMsg, MessageType.setTabTitle))
				});
			});
		}
		else {
			return logFailure(appId, true, errorData, MessageType.setTabTitle, cifVersion, "", "", "", parameters.get(Constants.correlationId));
		}
	}

	export function requestFocusSession(parameters: Map<string, any>): Promise<Map<string, any>> {
		let telemetryData: any = new Object();
		let telemetryParameter: any = new Object();
		let startTime = new Date();
		const [provider, errorData] = getProvider(parameters);
		if (provider) {
			return new Promise<Map<string, any>>((resolve, reject) => {
				provider.requestFocusSession(parameters.get(Constants.sessionId), parameters.get(Constants.messagesCount), telemetryData).then(function () {
					var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), MessageType.requestFocusSession, cifVersion, telemetryData, parameters.get(Constants.correlationId));
					setPerfData(perfData);
					logParameterData(telemetryParameter, MessageType.requestFocusSession, { "sessionId": parameters.get(Constants.sessionId) });
					var paramData = new APIUsageTelemetry(provider.providerId, provider.name, provider.apiVersion, MessageType.requestFocusSession, provider.sortOrder, appId, cifVersion, false, null, telemetryParameter, parameters.get(Constants.correlationId));
					setAPIUsageTelemetry(paramData);
					return resolve(new Map<string, any>());
				}, function (error) {
					logAPIFailure(appId, true, error, MessageType.requestFocusSession, cifVersion, provider.providerId, provider.name, telemetryParameter, parameters.get(Constants.correlationId));
					return reject(Microsoft.CIFramework.Utility.createErrorMap(error.errorMsg, MessageType.requestFocusSession))
				});
			});
		}
		else {
			return logAPIFailure(appId, true, errorData, MessageType.requestFocusSession, cifVersion, "", "", telemetryParameter, parameters.get(Constants.correlationId));
		}
	}

	export function getFocusedTab(parameters: Map<string, any>): Promise<Map<string, any>> {
		let telemetryData: any = new Object();
		let startTime = new Date();
		const [provider, errorData] = getProvider(parameters);
		if (provider) {
			var tabId = provider.getFocusedTab(telemetryData);
			var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), MessageType.getFocusedTab, cifVersion, telemetryData, parameters.get(Constants.correlationId));
			setPerfData(perfData);
			var paramData = new APIUsageTelemetry(provider.providerId, provider.name, provider.apiVersion, MessageType.getFocusedTab, provider.sortOrder, appId, cifVersion, false, null, "", parameters.get(Constants.correlationId));
			setAPIUsageTelemetry(paramData);
			return Promise.resolve(new Map<string, any>().set(Constants.value, tabId));
		}
		else {
			return logAPIFailure(appId, true, errorData, MessageType.getFocusedTab, cifVersion, "", "", "", parameters.get(Constants.correlationId));
		}
	}

	export function getTabsByTagOrName(parameters: Map<string, any>): Promise<Map<string, any>> {
		let telemetryData: any = new Object();
		let telemetryParameter: any = new Object();
		let startTime = new Date();
		const [provider, errorData] = getProvider(parameters);
		if (provider) {
			return new Promise<Map<string, any>>((resolve, reject) => {
				provider.getTabsByTagOrName(parameters.get(Constants.nameParameter), parameters.get(Constants.templateTag)).then(function (tabIds: string[]) {
					var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), MessageType.getTabsByTagOrName, cifVersion, telemetryData, parameters.get(Constants.correlationId));
					setPerfData(perfData);
					logParameterData(telemetryParameter, MessageType.getTabsByTagOrName, { "input": parameters.get(Constants.templateTag) });
					var usageData = new UsageTelemetryData(provider.providerId, provider.name, provider.apiVersion, MessageType.getTabsByTagOrName, provider.sortOrder, appId, cifVersion, false, null, telemetryParameter, parameters.get(Constants.correlationId));
					setUsageData(usageData);
					return resolve(new Map<string, any>().set(Constants.value, tabIds));
				}, function (errorData: IErrorHandler) {
					logFailure(appId, true, errorData, MessageType.getTabsByTagOrName, cifVersion, provider.providerId, provider.name, telemetryParameter, parameters.get(Constants.correlationId));
					return reject(Microsoft.CIFramework.Utility.createErrorMap(errorData.errorMsg, MessageType.getTabsByTagOrName))
				});
			});
		}
		else {
			return logFailure(appId, true, errorData, MessageType.getTabsByTagOrName, cifVersion, "", "", telemetryParameter, parameters.get(Constants.correlationId));
		}
	}

	export function refreshTab(parameters: Map<string, any>): Promise<Map<string, any>> {
		let telemetryData: any = new Object();
		let telemetryParameter: any = new Object();
		let startTime = new Date();
		const [provider, errorData] = getProvider(parameters);
		if (provider) {
			return new Promise<Map<string, any>>((resolve, reject) => {
				provider.refreshTab(parameters.get(Constants.tabId)).then(function () {
					var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), MessageType.refreshTab, cifVersion, telemetryData, parameters.get(Constants.correlationId));
					setPerfData(perfData);
					logParameterData(telemetryParameter, MessageType.refreshTab, { "tabId": parameters.get(Constants.tabId) });
					var usageData = new UsageTelemetryData(provider.providerId, provider.name, provider.apiVersion, MessageType.refreshTab, provider.sortOrder, appId, cifVersion, false, null, telemetryParameter, parameters.get(Constants.correlationId));
					setUsageData(usageData);
					return resolve(new Map<string, any>());
				}, function (errorData: IErrorHandler) {
					logFailure(appId, true, errorData, MessageType.refreshTab, cifVersion, provider.providerId, provider.name, telemetryParameter, parameters.get(Constants.correlationId));
					return reject(Microsoft.CIFramework.Utility.createErrorMap(errorData.errorMsg, MessageType.refreshTab))
				});
			});
		}
		else {
			return logFailure(appId, true, errorData, MessageType.refreshTab, cifVersion, "", "", telemetryParameter, parameters.get(Constants.correlationId));
		}
	}

	export function createTab(parameters: Map<string, any>): Promise<Map<string, any>> {
		let telemetryData: any = new Object();
		let startTime = new Date();
		const [provider, errorData] = getProvider(parameters);
		if (provider) {
			return new Promise<Map<string, any>>((resolve, reject) => {
				provider.createTab(parameters.get(Constants.input), telemetryData, appId, cifVersion, parameters.get(Constants.correlationId)).then(function (tabId) {
					raiseSystemAnalyticsEvent(InternalEventName.NewTabOpened, parameters, new Map<string, any>().set(Constants.tabId, tabId));
					var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), MessageType.createTab, cifVersion, telemetryData, parameters.get(Constants.correlationId));
					setPerfData(perfData);
					var paramData = new APIUsageTelemetry(provider.providerId, provider.name, provider.apiVersion, MessageType.createTab, provider.sortOrder, appId, cifVersion, false, null, "", parameters.get(Constants.correlationId));
					setAPIUsageTelemetry(paramData);
					return resolve(new Map<string, any>().set(Constants.value, tabId));
				}, function (error) {
					logAPIFailure(appId, true, error, MessageType.createTab, cifVersion, provider.providerId, provider.name, "", parameters.get(Constants.correlationId));
					return reject(Microsoft.CIFramework.Utility.createErrorMap(error.errorMsg, MessageType.createTab))
				});
			});
		}
		else {
			return logAPIFailure(appId, true, errorData, MessageType.createTab, cifVersion, "", "", "", parameters.get(Constants.correlationId));
		}
	}

	export function focusTab(parameters: Map<string, any>): Promise<Map<string, any>> {
		let telemetryData: any = new Object();
		let startTime = new Date();
		const [provider, errorData] = getProvider(parameters);
		if (provider) {
			return new Promise<Map<string, any>>((resolve, reject) => {
				provider.focusTab(parameters.get(Constants.tabId), telemetryData).then(function () {
					var perfData = new PerfTelemetryData(provider, startTime, Date.now() - startTime.getTime(), MessageType.focusTab, cifVersion, telemetryData, parameters.get(Constants.correlationId));
					setPerfData(perfData);
					var paramData = new APIUsageTelemetry(provider.providerId, provider.name, provider.apiVersion, MessageType.focusTab, provider.sortOrder, appId, cifVersion, false, null, "", parameters.get(Constants.correlationId));
					setAPIUsageTelemetry(paramData);
					return resolve(new Map<string, any>());
				}, function (error) {
					logAPIFailure(appId, true, error, MessageType.focusTab, cifVersion, provider.providerId, provider.name, "", parameters.get(Constants.correlationId));
					return reject(Microsoft.CIFramework.Utility.createErrorMap(error.errorMsg, MessageType.focusTab))
				});
			});
		}
		else {
			return logAPIFailure(appId, true, errorData, MessageType.focusTab, cifVersion, "", "", "", parameters.get(Constants.correlationId));
		}
	}

	export function updateContext(parameters: Map<string, any>): Promise<any> {
		let sessionId: string;
		if (parameters.get(Constants.sessionId)) {
			sessionId = parameters.get(Constants.sessionId);
		} else {
			sessionId = state.sessionManager.getFocusedSession();
		}
		const [provider, errorData] = getProvider(parameters);
		if (provider && provider.sessions.has(sessionId)) {
			return new Promise<any>((resolve, reject) => {
				if (state.sessionManager.sessions.has(sessionId)) {
					if (parameters.get(Constants.isDelete)) {
						state.sessionManager.sessions.get(sessionId).removeTemplateParams(parameters.get(Constants.input));
					} else {
						state.sessionManager.sessions.get(sessionId).setTemplateParams(parameters.get(Constants.input));
					}
					resolve(new Map<string, any>().set(Constants.value, state.sessionManager.sessions.get(sessionId).templateParams));
				} else {
					reject(Microsoft.CIFramework.Utility.createErrorMap("Please provide valid session id", MessageType.updateContext))
				}
			});
		}
		else {
			return Promise.reject(Microsoft.CIFramework.Utility.createErrorMap("Please provide valid session id", MessageType.updateContext))
		}
	}


	export function logErrorsAndReject(parameters: Map<string, any>): Promise<any> {
		let error = {} as IErrorHandler;
		error.reportTime = new Date().toUTCString();
		error.errorMsg = parameters.get(Constants.errorMessage);
		error.errorType = errorTypes.InvalidParams;
		error.sourceFunc = parameters.get(Constants.functionName);
		logAPIInternalInfo(appId, true, error, MessageType.logErrorsAndReject, cifVersion, "", "", "", parameters.get(Constants.correlationId));
		return Promise.resolve();
	}

	/**
	 * InitLogAnalyticsEvent handler that post message library will invoke.
	*/
	export function raiseInitAnalyticsEvent(parameters: Map<string, any>): Promise<Map<string, any>> {
		parameters.set(AnalyticsConstants.telemetryApiName, AnalyticsConstants.telemetryInitApiName);

		return new Promise(function (resolve, reject) {
			if (raiseAnalyticsEventInternal(AnalyticsConstants.initAnalyticsPlatformEventName, parameters)) {
				resolve(new Map().set(Constants.value, "Success"));
			}
			else {
				reject(new Map().set(Constants.value, "Failure"));
			}
		});
	}

	/**
	 * LogAnalyticsEvent handler that post message library will invoke.
	*/
	export function raiseSystemAnalyticsEvent(eventName: InternalEventName, parameters: Map<string, any>, additionalParams?: Map<string, any>): Promise<Map<string, any>> {
		if (!isNullOrUndefined(additionalParams)) {
			additionalParams.forEach((value, key) => parameters.set(key, value));
		}
		parameters.set(AnalyticsConstants.telemetryApiName, AnalyticsConstants.telemetryLogSystemEventApiName);
		if (parameters.get(AnalyticsConstants.analyticsEventType) !== EventType.CustomEvent) {
			parameters.set(AnalyticsConstants.analyticsEventType, EventType.SystemEvent)
		}
		let sessionId = state.sessionManager.getFocusedSession();
		let eventNameStr = InternalEventName[eventName];
		parameters.set(AnalyticsConstants.analyticsEventName, eventNameStr).set(AnalyticsConstants.focussedSession, sessionId);
		let ret = raiseAnalyticsEventInternal(AnalyticsConstants.logAnalyticsPlatformEventName, parameters);
		return Promise.resolve(new Map().set(Constants.value, ret));
	}

	/**
	 * LogAnalyticsEvent handler that post message library will invoke.
	*/
	export function raiseCustomAnalyticsEvent(parameters: Map<string, any>): Promise<Map<string, any>> {
		let sessionId = state.sessionManager.getFocusedSession();
		parameters.set(AnalyticsConstants.focussedSession, sessionId);
		parameters.set(AnalyticsConstants.telemetryApiName, AnalyticsConstants.telemetryLogCustomEventApiName);
		return new Promise(function (resolve, reject) {
			if (raiseAnalyticsEventInternal(AnalyticsConstants.logAnalyticsPlatformEventName, parameters)) {
				resolve(new Map().set(Constants.value, "Success"));
			}
			else {
				reject(new Map().set(Constants.value, "Failure"));
			}
		});
	}

	/**
	* Internal method to raise the lLogAnalyticsEvent to Analytics js
	*/
	export function raiseAnalyticsEventInternal(eventName: string, parameters: Map<string, any>): boolean {
		let providerName = "", providerId = "", apiVersion = "", sortOrder = "";
		const [provider, errorData] = getProvider(parameters, [Constants.SearchString]);
		if (!isNullOrUndefined(provider)) {
			providerName = provider.name;
			providerId = provider.providerId;
			apiVersion = provider.apiVersion;
			sortOrder = provider.sortOrder;
			parameters.set(AnalyticsConstants.channelProviderName, provider.name);
			parameters.set(AnalyticsConstants.channelProviderId, provider.providerId);
			parameters.set(AnalyticsConstants.enableAnalytics, provider.enableAnalytics);
		}
		try {
			logAPIFailure(appId, true, errorData, MessageType.isConsoleApp, cifVersion, "", "", "", parameters.get(Constants.correlationId));
		} catch (error) {
			console.log("Error in method logAPIFailure.");
		}

		let apiName = parameters.get(AnalyticsConstants.telemetryApiName);
		var paramData = new AnalyticsAPIUsageTelemetry(providerId, providerName, apiVersion, apiName, eventName, sortOrder, appId, cifVersion, false, null, "", parameters.get(Constants.correlationId));
		setAnalyticsAPIUsageTelemetry(paramData);
		var eventParams = { bubbles: false, cancelable: false, detail: parameters };
		var event = new CustomEvent(eventName, eventParams);
		return window.dispatchEvent(event);
	}
}