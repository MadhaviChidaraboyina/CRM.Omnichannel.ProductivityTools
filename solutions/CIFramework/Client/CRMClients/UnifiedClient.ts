/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

/// <reference path="Client.ts" />
/// <reference path="Constants.ts" />
/// <reference path="WidgetIFrame.ts" />
/// <reference path="../../../../references/external/TypeDefinitions/lib.es6.d.ts" />
/// <reference path="../../../../packages/Crm.ClientApiTypings.1.0.2611-manual/clientapi/XrmClientApi.d.ts" />
/// <reference path="../TelemetryHelper.ts" />

/** @internal */
namespace Microsoft.CIFramework.Internal {
	/**
	 * Actual implementation of IClient for web client 
	*/
	export function unifiedClient(): IClient {
		let client = {} as IClient;

		client.registerHandler = (eventName: string, handler: EventHandler): boolean => {
			if (!this.eventHandlers) {
				this.eventHandlers = new Map<string, EventHandler>();
			}
			if (handler) {
				this.eventHandlers.set(eventName, handler);
			}
			return true;
		}

		client.removeHandler = (eventName: string): EventHandler => {
			if (!this.eventHandlers) {
				return null;
			}
			let ret: EventHandler = this.eventHandlers.get(eventName);
			this.eventHandlers.delete(eventName);
			return ret;
		}

		client.createRecord = (entityName: string, entityId?: string, telemetryData?: Object|any, valuesToUpdate?: Map<string, any> | string): Promise<Map<string, any>> => {
			if (!valuesToUpdate) {
				let errorData = {} as IErrorHandler;
				errorData.errorMsg = "Need values to create for createRecord";
				errorData.errorType = errorTypes.InvalidParams;
				errorData.reportTime = new Date().toUTCString();
				errorData.sourceFunc = "client.createRecord";
				return Promise.reject(errorData);
			}
			let data: Map<string, any> = null;
			if (typeof (valuesToUpdate) == "string") {
				data = JSON.parse(valuesToUpdate as string);
			}
			else {
				data = valuesToUpdate;
			}
			return new Promise<Map<string, any>>((resolve, reject) => {
				let startTime = new Date();
				return Xrm.WebApi.createRecord(entityName, Microsoft.CIFramework.Utility.buildEntity(data)).then(
					(result: XrmClientApi.LookupValue) => {
						let timeTaken = Date.now() - startTime.getTime();
						let apiName = "Xrm.WebApi.createRecord";
						logApiData(telemetryData, startTime, timeTaken, apiName);
						return resolve(Microsoft.CIFramework.Utility.buildMap(result)); 
					},
					(error: Error) => {
						let errorData = generateErrorObject(error, "client.createRecord - Xrm.WebApi.createRecord", errorTypes.XrmApiError);
						return reject(errorData);
					});
			});
		}

		client.updateRecord = (entityName: string, entityId: string, telemetryData?: Object|any, valuesToUpdate?: Map<string, any> | string): Promise<Map<string, any>> =>
		{
			if (!valuesToUpdate)
			{
				let errorData = {} as IErrorHandler;
				errorData.errorMsg = "Need values to Update for updateRecord";
				errorData.errorType = errorTypes.InvalidParams;
				errorData.reportTime = new Date().toUTCString();
				errorData.sourceFunc = "client.updateRecord";
				return Promise.reject(errorData);
			}
			let data: Map<string, any> = null;
			if (typeof (valuesToUpdate) == "string") {
				data = JSON.parse(valuesToUpdate as string);
			}
			else {
				data = valuesToUpdate;
			}
			return new Promise<Map<string, any>>((resolve, reject) =>
			{
				let startTime = new Date();
				return Xrm.WebApi.updateRecord(entityName, entityId, Microsoft.CIFramework.Utility.buildEntity(data)).then(
					(result: XrmClientApi.LookupValue) => {
						let timeTaken = Date.now() - startTime.getTime();
						let apiName = "Xrm.WebApi.updateRecord";
						logApiData(telemetryData, startTime, timeTaken, apiName);
						return resolve(Microsoft.CIFramework.Utility.buildMap(result));
					},
					(error: Error) =>
					{
						let errorData = generateErrorObject(error, "client.updateRecord - Xrm.WebApi.updateRecord", errorTypes.XrmApiError);
						return reject(errorData);
					});
			});
		}

		client.retrieveRecord = (entityName: string, entityId: string, telemetryData?: Object|any, query?: string): Promise<Map<string,any>> =>
		{
			return new Promise<Map<string, any>>((resolve, reject) =>
			{
				let startTime = new Date();
				return Xrm.WebApi.retrieveRecord(entityName, entityId, query).then(
					(result: XrmClientApi.WebApi.Entity) =>
					{
						let timeTaken = Date.now() - startTime.getTime();
						let apiName = "Xrm.WebApi.retrieveRecord";
						logApiData(telemetryData, startTime, timeTaken, apiName);
						return resolve(Microsoft.CIFramework.Utility.buildMap(result));
					},
					(error: Error) => {
						let errorData = generateErrorObject(error, "client.retrieveRecord - Xrm.WebApi.retrieveRecord", errorTypes.XrmApiError);
						return reject(errorData);
					});
			});

		}

		client.getEntityMetadata = (entityName: string, attributes?: Array<string>): Promise<string> => {
			var attrs = attributes ? attributes : null;
			return new Promise<string>((resolve, reject) => {
				return Xrm.Utility.getEntityMetadata(entityName, attrs).then(
					(result: Object) => {
						return resolve(JSON.stringify(Microsoft.CIFramework.Utility.flatten(result)));
					},
					(error: Error) => {
						let errorData = generateErrorObject(error, "client.getEntityMetadata - Xrm.Utility.getEntityMetadata", errorTypes.XrmApiError);
						return reject(errorData);
					});
			});
		}

		client.deleteRecord = (entityName: string, entityId: string, telemetryData?: Object|any, valuesToUpdate?: Map<string, any> | string): Promise<Map<string, any>> => {
			return new Promise<Map<string, any>>((resolve, reject) => {
				let startTime = new Date();
				return Xrm.WebApi.deleteRecord(entityName, entityId).then(
					(result: XrmClientApi.LookupValue) => {
						let timeTaken = Date.now() - startTime.getTime();
						let apiName = "Xrm.WebApi.deleteRecord"
						logApiData(telemetryData, startTime, timeTaken, apiName);
						return resolve(Microsoft.CIFramework.Utility.buildMap(result));
					},
					(error: Error) => {
						let errorData = generateErrorObject(error, "client.deleteRecord - Xrm.WebApi.deleteRecord", errorTypes.XrmApiError);
						return reject(errorData);
					});
			});
		}

		client.sizeChanged = (context?: XrmClientApi.EventContext): void => {
			if (!this.eventHandlers) {
				this.eventHandlers = new Map<string, EventHandler>();
			}
			let handler: EventHandler = this.eventHandlers.get(Constants.SizeChangeHandler);
			if (handler) {
				let data: Map<string, any> = new Map<string, any>().set(Constants.value, client.getWidgetWidth());
				let event = new CustomEvent(Constants.SizeChangeHandler, { detail: data });
				handler(event);
			}
		}

		client.modeChanged = (context?: XrmClientApi.EventContext): void => {
			if (!this.eventHandlers) {
				this.eventHandlers = new Map<string, EventHandler>();
			}
			let handler: EventHandler = this.eventHandlers.get(Constants.ModeChangeHandler);
			if (handler) {
				let data: Map<string, any> = new Map<string, any>().set(Constants.value, Xrm.Panel.state);
				let event = new CustomEvent(Constants.ModeChangeHandler, { detail: data });
				handler(event);
			}
		}

		client.navigationHandler = (context?: XrmClientApi.EventContext): void => {
			if (!this.eventHandlers) {
				this.eventHandlers = new Map<string, EventHandler>();
			}
			let handler: EventHandler = this.eventHandlers.get(Constants.NavigationHandler);
			if (handler) {
				let pageURL: string = "";
				try {
					let args = context.getEventArgs() as XrmClientApi.NavigationEventArgs;  //Navigation events is internal API
					pageURL = args.pageUrl;
				}
				catch (error) { }
				let data: Map<string, any> = new Map<string, any>().set(Constants.value, pageURL);
				let event = new CustomEvent(Constants.ModeChangeHandler, { detail: data });
				handler(event);
			}
		}

		client.getUserID = (): string => {
			return Xrm.Utility.getGlobalContext().userSettings.userId;
		}

		client.loadWidgets = (ciProviders: Map<string, CIProvider>): Promise<Map<string, boolean | string>> => {
			const options: XrmClientApi.NewPanelOptions = {
				position: isConsoleAppInternal() ? Constants.left : Constants.right,
				defaultCollapsedBehavior: false,
				url: "/webresources/widgets_container.html"
			};
			return new Promise<Map<string, boolean | string>>((resolve, reject) => {
				return Xrm.Panel.loadPanel(options).then(function () {
					Xrm.Panel.addOnSizeChange(client.sizeChanged);
					Xrm.Panel.addOnStateChange(client.modeChanged);
					Xrm.Navigation.addOnPreNavigation(client.navigationHandler);
					let widgetIFrame = (<HTMLIFrameElement>window.parent.document.getElementById(Constants.widgetIframeId));
					let targetWindow = window.parent;
					let status: Map<string, boolean | string> = new Map<string, boolean | string>();
					let fracHeightForActiveWidget: number = 0.9;
					let minimizedHeight: number = (widgetIFrame.clientHeight * (1 - fracHeightForActiveWidget)) / ciProviders.size;   // TODO: Figure out correct units to use
					widgetIFrame.onload = function () {
						widgetIFrame.contentWindow.document.body.dir = window.parent.document.body.dir;
						var doc = widgetIFrame.contentDocument ? widgetIFrame.contentDocument : widgetIFrame.contentWindow.document;
						for (let [key, value] of ciProviders) {
							//TODO: parallelize these loads; add allow attributes for chrome. Also figure out how to set sizes on these
							var containerDiv = document.createElement("div");
							containerDiv.setAttribute("id", value.providerId);
							containerDiv.setAttribute("tabindex", "-1");    //Needed to receive the focus event
							containerDiv.setAttribute("role", "tabpanel");
							containerDiv.setAttribute("style", "height: 100%");
							var iFrame = document.createElement("iframe");
							iFrame.setAttribute("allow", "microphone; camera; geolocation");    //TODO - should we make these configurable?
							iFrame.setAttribute("sandbox", "allow-forms allow-popups allow-scripts allow-same-origin allow-modals"); //TODO: make configurable?
							widgetIFrame.setAttribute("style", "border-top: 1px solid;border-color: #F5F5F5;");
							iFrame.height = "100%";
							iFrame.width = "100%";
							iFrame.src = key;
							iFrame.title = value.label;     //TODO: We may need to figure out where to put this title based on UX
							value.setContainer(new WidgetIFrameWrapper(iFrame), minimizedHeight);
							containerDiv.appendChild(iFrame);
							doc.getElementById("widgetControlDiv").appendChild(containerDiv);
							status.set(value.name, true);   //TODO: The status should be set once iFrame.src is loaded
							//console.log("AMEYA loading - " + key + " height = " + widgetHeight + " minheight "  + minimizedHeight);

							if (!isConsoleAppInternal()) {
								widgetIFrame.contentDocument.documentElement.style.setProperty('--sessionPanelAreaWidth', "44px");
								(widgetIFrame.contentDocument.getElementsByClassName('innerDiv')[0] as HTMLElement).style.display = "flex";
							}
						}
					}
					return resolve(status);
				}
				);
			});
		}
		
		client.openKBSearchControl = (searchString: string,telemetryData?: Object|any): boolean =>
		{
			try {
				//eval("window.top.Xrm.Page.getControl('KBSearchcontrol').setSearchQuery(+searchString+); use once serachstring is passed
				eval("window.top.Xrm.Page.getControl('KBSearchcontrol').setFocus()");
				return true;
			}
			catch (error) {
				return false;
			}
		}

		client.openForm = (entityFormOptions: string, entityFormParameters?: string): Promise<Map<string, any>> => {
			var fo: XrmClientApi.EntityFormOptions = JSON.parse(entityFormOptions);
			var fp: XrmClientApi.FormParameters = (entityFormParameters ? JSON.parse(entityFormParameters) : null);

			return new Promise<Map<string, any>>((resolve, reject) => {

				return Xrm.Navigation.openForm(fo, fp).then(function (res) {
					return resolve(new Map<string, any>().set(Constants.value, res));
				},
					function (error: Error) {
						let errorData = generateErrorObject(error, "client.openForm - Xrm.Navigation.openForm", errorTypes.XrmApiError);
						return reject(errorData);
					}
				);
			});
		}

		client.refreshForm = (save?: boolean): Promise<Object> => {            
			return new Promise<Object>((resolve, reject) => {
				try {
					let val = eval("window.top.Xrm.Page.data.refresh(" + save + ")");
					return val.then(
						function (res: Object) {
							return resolve(res);
						},
						function (error: Error) {
							let errorData = generateErrorObject(error, "client.openForm - Xrm.Navigation.openForm", errorTypes.XrmApiError);
							return reject(errorData);
						});
				}
				catch (error) {
					return reject(error);
				}
			});
		}

		client.retrieveMultipleAndOpenRecords = (entityName: string, queryParmeters: string, searchOnly: boolean, telemetryData?: Object|any): Promise<Map<string, any>> =>
		{
			return new Promise<Map<string,any>>((resolve, reject) =>
			{
				let retrieveMultipleStartTime = new Date();
				Xrm.WebApi.retrieveMultipleRecords(entityName, queryParmeters).then(
					(result: XrmClientApi.WebApi.RetrieveMultipleResponse) => {
						if (result.entities.length == 1) {
							let resultItem = result.entities[0];
							if (searchOnly == false) {
								var fo: XrmClientApi.EntityFormOptions = { entityName: entityName, entityId: resultItem[entityName + "id"] };
								Xrm.Navigation.openForm(fo);
							}
						}
						else if (searchOnly == false) {
							// Open the Search Page with the Search String from the OData Parameters if the records != 1. Opens blank search page if the $search parameter has no value
							try {
								const searchPageInput: XrmClientApi.PageInput = {
									pageType: "search" as any,
									searchText: Microsoft.CIFramework.Utility.extractParameter(queryParmeters, "$search"),
									searchType: 1,
									EntityNames: [entityName],
									EntityGroupName: "",
								};

								Xrm.Navigation.navigateTo(searchPageInput);
							}
							catch (error) { }
						}

						let retrieveMultipleTimeTaken = Date.now() - retrieveMultipleStartTime.getTime();
						let retrieveMultipleApiName = "Xrm.WebApi.retrieveMultipleRecords"
						logApiData(telemetryData, retrieveMultipleStartTime, retrieveMultipleTimeTaken, retrieveMultipleApiName);
						return resolve(new Map<string, any>().set(Constants.value, result.entities));
					},
					(error: Error) => {
						let errorData = generateErrorObject(error, "client.retrieveMultipleAndOpenRecords - Xrm.WebApi.retrieveMultipleRecords", errorTypes.XrmApiError);
						return reject(errorData);
					}
				);
			});
		}

		client.setPanelMode = (name: string, mode: number, telemetryData?: Object|any): number =>
		{
			let startTime = new Date();
			if (mode == Constants.sidePanelHiddenState && !isConsoleAppInternal()) {
				mode = Constants.sidePanelCollapsedState;
			}
			Xrm.Panel.state = mode;
			let timeTaken = Date.now() - startTime.getTime();
			let apiName = "Xrm.Panel.setState"
			logApiData(telemetryData, startTime, timeTaken, apiName);

			return mode;
		}

		client.setPanelPosition = (name: string, position: number, telemetryData?: Object|any): number =>
		{
			let startTime = new Date();

			Xrm.Panel.position = position;
			let timeTaken = Date.now() - startTime.getTime();
			let apiName = "Xrm.Panel.setPosition";
			logApiData(telemetryData, startTime, timeTaken, apiName);

			return position;
		}

		client.getPanelPosition = (telemetryData?: Object): number =>
		{
			let startTime = new Date();

			let position = Xrm.Panel.position;
			let timeTaken = Date.now() - startTime.getTime();
			let apiName = "Xrm.Panel.getPosition";
			logApiData(telemetryData, startTime, timeTaken, apiName);

			return position;
		}

		client.setWidgetWidth = (name: string, width: number, telemetryData?: Object | any): number => {
			let widgetIFrame = (<HTMLIFrameElement>window.parent.document.getElementById(Constants.widgetIframeId));
			let sessionPanelArea = (<HTMLDivElement>widgetIFrame.contentDocument.getElementById("sessionPanel"));

			client.setPanelWidth("setPanelWidth", width + sessionPanelArea.clientWidth);
			return width;
		}

		client.setPanelWidth = (name: string, width: number, telemetryData?: Object|any): void =>
		{
			let startTime = new Date();

			Xrm.Panel.width = width;
			let timeTaken = Date.now() - startTime.getTime();
			let apiName = "Xrm.Panel.setWidth"
			logApiData(telemetryData, startTime, timeTaken, apiName);
		}

		client.getWidgetMode = (telemetryData?: Object|any): number =>
		{
			let startTime = new Date();
			let state = Xrm.Panel.state;
			let timeTaken = Date.now() - startTime.getTime();
			let apiName = "Xrm.Panel.getState";
			logApiData(telemetryData, startTime, timeTaken, apiName);
			return state;
		}

		client.getEnvironment = (telemetryData?: Object|any): Map<string, any> => {
			//Xrm.Page is deprecated hence definition not available in .d.ts
			//Using eval(...) to avoid compiler error
			var data: Map<string, any> = new Map<string, any>();
			try {
				let startTime = new Date();
				let pageUrl: any = new URL(eval("window.top.Xrm.Page.getUrl()") as string);
				let timeTaken = Date.now() - startTime.getTime();
				let apiName = "Xrm.Page.getUrl"
				logApiData(telemetryData, startTime, timeTaken, apiName);
				
				for (var entry of pageUrl.searchParams.entries()) {
					data.set(entry[0], entry[1]);
				}
			}
			catch (error) {
				//geturl not available on this page
			}

			let startTime = new Date();
			var context: XrmClientApi.GlobalContext = Xrm.Utility.getGlobalContext();
			let timeTaken = Date.now() - startTime.getTime();
			let apiName = "Xrm.Utility.getGlobalContext";
			logApiData(telemetryData, startTime, timeTaken, apiName);
			
			data.set(Constants.ClientUrl, context.getClientUrl());
			data.set(Constants.AppUrl, context.getCurrentAppUrl());
			data.set(Constants.OrgLcid, context.organizationSettings.languageId);
			data.set(Constants.OrgUniqueName, context.organizationSettings.uniqueName);
			data.set(Constants.OrgId, context.organizationSettings.organizationId);
			data.set(Constants.UserId, context.userSettings.userId);
			data.set(Constants.UserLcid, context.userSettings.languageId);
			data.set(Constants.UserName, context.userSettings.userName);
			data.set(Constants.UserRoles, context.userSettings.securityRoles);
			data.set(Constants.crmVersion, context.getVersion());
			return data;
		}

		client.getWidgetWidth = (telemetryData?: Object|any): number =>
		{
			let startTime = new Date();
			//let width = Xrm.Panel.width;
			let widgetIFrame = (<HTMLIFrameElement>window.parent.document.getElementById(Constants.widgetIframeId));
			let widgetArea = (<HTMLDivElement>widgetIFrame.contentDocument.getElementById("widgetArea"));
			let width = 0;
			return widgetArea.clientWidth;
			/*if (this.flapExpanded) {
				width = this.origWidth + Constants.DEFAULT_SIDEPANEL_WIDTH_WITH_BORDER;
			}
			else {
				width = widgetIFrame.clientWidth;   //TODO: temporary fix until plaform fixes the Panel.width getter
			}
			let timeTaken = Date.now() - startTime.getTime();
			let apiName = "Xrm.Panel.getWidth";
			//logApiData(telemetryData, startTime, timeTaken, apiName);
			return width - Constants.DEFAULT_SIDEPANEL_WIDTH_WITH_BORDER;*/
		}

		client.checkCIFCapability = (): boolean => {
			try {
				if ((window.top as any).Xrm.Utility.getGlobalContext().client.getClient() === "UnifiedServiceDesk") {
					return false;
				}
				if (window.top.document.getElementById(Constants.widgetIframeId)) {
					//The side panel already exists. Don't load another
					return false;
				}
			}
			catch (error) {
				//We couldn't access the top level window. Don't load the side-panel
				return false;
			}
			return true;
		}

		client.renderSearchPage = (entityName: string, searchString: string, telemetryData?: Object | any): Promise<void> => {
			let startTime;
			return new Promise<void>((resolve, reject) => {
				try {
					const searchPageInput: XrmClientApi.PageInput = {
						pageType: "search" as any,
						searchText: searchString,
						searchType: 1,
						EntityNames: [entityName],
						EntityGroupName: "",
					};

					startTime = new Date();
					Xrm.Navigation.navigateTo(searchPageInput);
					let timeTaken = Date.now() - startTime.getTime();
					let apiName = "Xrm.Navigation.navigateTo";
					logApiData(telemetryData, startTime, timeTaken, apiName);
					return resolve();
				}
				catch (error) {
					let errorData = generateErrorObject(error, "client.renderSearchPage - Xrm.Navigation.navigateTo", errorTypes.XrmApiError);
					return reject(errorData);
				}
			});
		}

		client.createSession = (id: string, initials: string, sessionColor: string, providerId: string, customerName: string): void => {
			var sidePanelIFrame = (<HTMLIFrameElement>window.parent.document.getElementById(Constants.widgetIframeId));
			let sessionPanel = Utility.getElementFromIframe(sidePanelIFrame, Constants.sessionPanel);
			if (sessionPanel == null)
				return;

			let sessionElementHtml = '<div class="session flexJustify" role="tab" tabindex="-1" aria-controls="' + providerId + '" aria-label="' + initials + '" id="' + id + '"><div class="flexJustify" id="' + id + 'UiSessionIcon"><div class="iconCircle" id="' + id + 'IconCircle" title="' + customerName + '" style="background-color: ' + sessionColor + ';"><span class="initials">' + initials + '</span></div><span class="uiSessionNotification" id="' + id + '_UiSessionNotification" style="display:none"></span></div><div id="' + id + 'CrossIcon" class="flexJustify" title="' + customerName + '" style="display:none"><span class="symbolFont Cancel-symbol crossIconFont"></span></div></div>';
			var parser = new DOMParser();
			var el = parser.parseFromString(sessionElementHtml, "text/html");
			var sessionElement = el.getElementById(id);
			sessionElement.onclick = function (event: MouseEvent) {
				if (id == Microsoft.CIFramework.Internal.state.sessionManager.getFocusedSession()) {
					(Microsoft.CIFramework.Internal.state.sessionManager as SessionPanel).closeSession((event.currentTarget as HTMLElement).id.replace('CrossIcon', ''));
				}
				else {
					Microsoft.CIFramework.Internal.state.sessionManager.focusSession((event.currentTarget as HTMLElement).id);
				}
			};

			sessionElement.onkeydown = function (event: KeyboardEvent) {
				if (event.keyCode == 13) {
					if (id == Microsoft.CIFramework.Internal.state.sessionManager.getFocusedSession()) {
						(Microsoft.CIFramework.Internal.state.sessionManager as SessionPanel).closeSession((event.currentTarget as HTMLElement).id.replace('CrossIcon', ''));
					}
					else {
						Microsoft.CIFramework.Internal.state.sessionManager.focusSession((event.currentTarget as HTMLElement).id);
					}
				}
				else if (event.keyCode == 37) {
					if (sessionElement.previousElementSibling != null) {
						(<HTMLElement>sessionElement.previousElementSibling).focus();
					}
					else {
						let sessions = Utility.getElementsByClassName(sidePanelIFrame, "session");
						(<HTMLElement>sessions[sessions.length - 1]).focus();
					}
				}
				else if (event.keyCode == 39) {
					if (sessionElement.nextElementSibling != null && sessionElement.nextElementSibling.className.indexOf("session") != -1) {
						(<HTMLElement>sessionElement.nextElementSibling).focus();
					}
					else {
						let sessions = Utility.getElementsByClassName(sidePanelIFrame, "session");
						(<HTMLElement>sessions[0]).focus();
					}
				}
			};

			sessionElement.onkeyup = function(e: KeyboardEvent) {
				if (e.altKey && e.keyCode == 88) {
					if (id == Microsoft.CIFramework.Internal.state.sessionManager.getFocusedSession()) {
						Microsoft.CIFramework.Internal.state.sessionManager.closeSession((event.currentTarget as HTMLElement).id.replace('CrossIcon', ''));
					}
				}
			};

			let sessions = Utility.getElementFromIframe(sidePanelIFrame, "sessions");
			sessions.appendChild(sessionElement);
			Utility.blinkBrowserTab(sidePanelIFrame);
		}

		client.closeSession = (id: string): void => {
			var sidePanelIFrame = (<HTMLIFrameElement>window.parent.document.getElementById(Constants.widgetIframeId));
			let sessionElement = Utility.getElementFromIframe(sidePanelIFrame, id);
			if (sessionElement == null)
				return;

			sessionElement.parentNode.removeChild(sessionElement);
		}

		client.getSessionColor = (id: string): string => {
			var sidePanelIFrame = (<HTMLIFrameElement>window.parent.document.getElementById(Constants.widgetIframeId));
			let sessionElementCircle = Utility.getElementFromIframe(sidePanelIFrame, id + "IconCircle");
			if (sessionElementCircle == null)
				return "";

			return Utility.rgb2hex(sessionElementCircle.style.backgroundColor);
		}

		client.updateSession = (id: string, focused: boolean): void => {
			var sidePanelIFrame = (<HTMLIFrameElement>window.parent.document.getElementById(Constants.widgetIframeId));
			let sessionElement = Utility.getElementFromIframe(sidePanelIFrame, id);
			if (sessionElement == null)
				return;

			var providerId = sessionElement.getAttribute("aria-controls");
			let providerElement = Utility.getElementFromIframe(sidePanelIFrame, providerId);
			let sessionIcon = Utility.getElementFromIframe(sidePanelIFrame, id + "UiSessionIcon");
			let sessionNotification = Utility.getElementFromIframe(sidePanelIFrame, id + "_UiSessionNotification");
			let crossIcon = Utility.getElementFromIframe(sidePanelIFrame, id + "CrossIcon");

			if (focused) {
				sessionElement.style.backgroundColor = "#FFFFFF";
				sessionElement.style.boxShadow = "8px 4px 10px rgba(102, 102, 102, 0.2)";
				sessionElement.setAttribute("tabindex", 0);
				providerElement.setAttribute("aria-labelledby", id);
				sessionNotification.style.display = "none";
				sessionNotification.innerText = "";
				sessionElement.focus();
			}
			else {
				sessionElement.style.backgroundColor = "transparent";
				sessionElement.style.boxShadow = "none";
				sessionElement.setAttribute("tabindex", -1);
				providerElement.setAttribute("aria-labelledby", "");
			}

			let sessionOnMouseOverHandler = function() {
				if (focused) {
					sessionElement.style.boxShadow = "0px 4px 8px rgba(102, 102, 102, 0.2)";
					sessionIcon.style.display = "none";
					crossIcon.style.display = "flex";
				}
			};
			let sessionOnMouseOutHandler = function() {
				if (focused) {
					sessionElement.style.boxShadow = "none";
					sessionIcon.style.display = "flex";
					crossIcon.style.display = "none";
				}
			};

			if (focused) {
				sessionElement.onmouseover = sessionOnMouseOverHandler;
				sessionElement.onmouseout = sessionOnMouseOutHandler;
			}
			else {
				sessionElement.onmouseover = null;
				sessionElement.onmouseout = null;
			}

			sessionElement.setAttribute("aria-selected", focused);
		}

		client.notifySession = (id: string, messagesCount: number): void => {
			var sidePanelIFrame = (<HTMLIFrameElement>window.parent.document.getElementById(Constants.widgetIframeId));
			let sessionNotification = Utility.getElementFromIframe(sidePanelIFrame, id + "_UiSessionNotification");

			if (messagesCount != null) {
				if (messagesCount > 99) {
					messagesCount = 99;
				}

				sessionNotification.innerText = messagesCount;
			}

			sessionNotification.style.display = "block";
			Utility.blinkBrowserTab(sidePanelIFrame);
		}

		client.expandFlap = (handler: EventHandler): number => {
			if (this.flapExpanded) {
				return 0;
			}
			//this.savedModeChangeHandler = client.removeHandler(Constants.ModeChangeHandler);
			//this.savedSizeChangeHandler = client.removeHandler(Constants.SizeChangeHandler);
			let widgetIFrame = (<HTMLIFrameElement>window.parent.document.getElementById(Constants.widgetIframeId));
			let sessionPanelArea = (<HTMLDivElement>widgetIFrame.contentDocument.getElementById("sessionPanel"));
			let widgetWidth = client.getWidgetWidth() as number;
			this.origWidth = widgetWidth + sessionPanelArea.clientWidth;
			this.flapExpanded = true;
			client.registerHandler(Constants.CollapseFlapHandler, handler);
			client.setPanelWidth("setPanelWidth", (2 * this.origWidth - sessionPanelArea.clientWidth));
			widgetIFrame.contentDocument.documentElement.style.setProperty('--flapAreaWidth', widgetWidth.toString() + "px");
			return this.origWidth;
		}
		client.collapseFlap = (): number => {
			if (!this.flapExpanded) {
				return 0;
			}
			let handler = this.eventHandlers.get(Constants.CollapseFlapHandler);
			if(handler != null && handler != "undefined"){
				handler();
			}
			client.setPanelWidth("setPanelWidth", this.origWidth);
			let widgetIFrame = (<HTMLIFrameElement>window.parent.document.getElementById(Constants.widgetIframeId));
			widgetIFrame.contentDocument.documentElement.style.setProperty('--flapAreaWidth', "0px");
			this.flapExpanded = false;
			//client.registerHandler(Constants.ModeChangeHandler, this.savedModeChangeHandler);
			//client.registerHandler(Constants.SizeChangeHandler, this.savedSizeChangeHandler);
			//this.savedSizeChangeHandler = null;
			//this.savedModeChangeHandler = null;
			return this.origWidth;
		}
		client.flapInUse = (): boolean => {
			return this.flapExpanded === true;
		}

		return client;
	}

	export function UCIPresenceManager(): IPresenceManager {
		let presence = {} as IPresenceManager;

		presence.setAgentPresence = (presenceInfo: any, telemetryData?: Object | any): boolean => {
			let startTime = new Date();
			let agentPresence = Microsoft.CIFramework.Internal.PresenceControl.Instance.setAgentPresence(presenceInfo);
			let timeTaken = Date.now() - startTime.getTime();
			let apiName = "PresenceControl.setAgentPresence";
			logApiData(telemetryData, startTime, timeTaken, apiName);

			let widgetIFrame = (<HTMLIFrameElement>window.parent.document.getElementById(Constants.widgetIframeId));
			let agentPresenceParent = widgetIFrame.contentWindow.document.getElementById("CurrentStatus");
			if (agentPresenceParent != null) {
				var currentPresenceId = agentPresenceParent.firstElementChild.id;
				if (currentPresenceId != presenceInfo.presenceId) {
					agentPresenceParent.innerHTML = "";
					agentPresenceParent.appendChild(agentPresence);
				}
				return true;
			}
			return false;
		}

		presence.initializeAgentPresenceList = (presenceList: any, telemetryData?: Object | any): boolean => {
			let startTime = new Date();
			let presenceListDiv = Microsoft.CIFramework.Internal.PresenceControl.Instance.setAllPresences(presenceList);
			let timeTaken = Date.now() - startTime.getTime();
			let apiName = "PresenceControl.initializeAgentPresenceList";
			logApiData(telemetryData, startTime, timeTaken, apiName);

			let widgetIFrame = (<HTMLIFrameElement>window.parent.document.getElementById(Constants.widgetIframeId));
			let presenceListParent = widgetIFrame.contentWindow.document.getElementById("PresenceList");
			if (presenceListParent != null) {
				presenceListParent.innerHTML = "";
				presenceListParent.appendChild(presenceListDiv);
				return true;
			}
			return false;
		}

		return presence;
	}

	export function UCIConsoleAppManager(): IPresenceManager {
		let presence = {} as IPresenceManager;

		presence.setAgentPresence = (presenceInfo: any, telemetryData?: Object | any): boolean => {
			let startTime = new Date();
			window.localStorage[Constants.CURRENT_PRESENCE_INFO] = JSON.stringify(presenceInfo);
			//let agentPresence = Microsoft.CIFramework.Internal.PresenceControl.Instance.setAgentPresence(presenceInfo);
			let timeTaken = Date.now() - startTime.getTime();
			let apiName = "PresenceControl.setAgentPresence";
			logApiData(telemetryData, startTime, timeTaken, apiName);

			let presenceButton = (<HTMLButtonElement>window.top.document.querySelector(Constants.PRESENCE_BUTTON_DATA_ID));
			let presenceStatus = presenceInfo.basePresenceStatus;
			if (presenceButton) {
				let presence : any;
				switch(presenceStatus){
					case "AWAY" : let awayPresence = presenceButton.getElementsByTagName("img")
									awayPresence[0].src = "/WebResources/msdyn_Away.svg"
									break;
					case "AVAILABLE" : let availablePresence = presenceButton.getElementsByTagName("img")
									availablePresence[0].src = "/WebResources/msdyn_Available.svg"
									break;
					case "OFFLINE" : let offlinePresence = presenceButton.getElementsByTagName("img")
									offlinePresence[0].src = "/WebResources/msdyn_Offline.svg"
									break;
					case "BUSY" : let busyPresence = presenceButton.getElementsByTagName("img")
									busyPresence[0].src = "/WebResources/msdyn_BusyIcon.svg"
									break;
					case "BUSY_DO_NOT_DISTURB" : let dndPresence = presenceButton.getElementsByTagName("img")
									dndPresence[0].src = "/WebResources/msdyn_BusyDND.svg"
									break;
				}
				return true;
			}
			return false;
		}

		presence.initializeAgentPresenceList = (presenceList: any, telemetryData?: Object | any): boolean => {
			let startTime = new Date();
			//let presenceListDiv = Microsoft.CIFramework.Internal.PresenceControl.Instance.setAllPresences(presenceList);
			let timeTaken = Date.now() - startTime.getTime();
			let apiName = "PresenceControl.initializeAgentPresenceList";
			logApiData(telemetryData, startTime, timeTaken, apiName);
			window.localStorage[Constants.GLOBAL_PRESENCE_LIST] = JSON.stringify(presenceList);
			/*let widgetIFrame = (<HTMLIFrameElement>window.parent.document.getElementById(Constants.widgetIframeId));
			let presenceListParent = widgetIFrame.contentWindow.document.getElementById("PresenceList");
			if (presenceListParent != null) {
				presenceListParent.innerHTML = "";
				presenceListParent.appendChild(presenceListDiv);
				return true;
			}
			return false;*/
			return true;
		}
		return presence;
	}
}