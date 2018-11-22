/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

/// <reference path="Constants.ts" />
/// <reference path="WebClient.ts" />
/// <reference path="WidgetIFrame.ts" />
/// <reference path="SessionPanel.ts" />
/// <reference path="../PostMsgWrapper.ts" />
/// <reference path="../../../../references/external/TypeDefinitions/lib.es6.d.ts" />
/// <reference path="../../../../packages/Crm.ClientApiTypings.1.0.2522-manual/clientapi/XrmClientApi.d.ts" />
/** @internal */
namespace Microsoft.CIFramework.Internal {
	/**
	 * type defined for storing all global information at one place. 
	*/
	export type IState =
		{
			/**
			 * this will refer to the actual IClient implementation based on the type of client CI library is loaded on
			*/
			client: IClient;

			/**
			 *  Information about current active sessions
			*/
			providerManager: ProviderManager;

			/**
			 * Post message wrapper object
			 */
			messageLibrary: postMessageNamespace.postMsgWrapper;
		}

	export class ProviderManager {
		ciProviders: Map<string, CIProvider>;
		_activeProvider: CIProvider;
		_defaultProvider: CIProvider;
		_client: IClient;

		constructor(client: IClient, defaultProviderUrl?: string, defaultProvider?: CIProvider) {
			this._client = client;
			this.ciProviders = new Map<string, CIProvider>();
			this.ciProviders.set(defaultProviderUrl, defaultProvider);
			this._defaultProvider = defaultProvider;
			this._client.setWidgetMode("mode", (defaultProvider ? defaultProvider.getMode() : 0));  //TODO: replace with named constant
		}

		addProvider(url: string, provider: CIProvider) {
			this.ciProviders.set(url, provider);
		}

		setActiveProvider(provider: CIProvider): Promise<Map<string, any>> {
			if (this._activeProvider != provider) {
				//TODO check if it is okay to switch provider
				//if no, reject the promise
				//if yes, switch the providers
				let oldProvider: CIProvider = this._activeProvider;
				this._activeProvider = provider || this._defaultProvider;
				if (oldProvider) {
					oldProvider.raiseEvent(new Map<string, any>().set(Constants.value, 0), MessageType.onModeChanged);    //TODO: replace 0 with named constant
				}
			}
			let mode: number = this._activeProvider ? this._activeProvider.getMode() : 0;   //TODO: replace 0 with named constant
			this._client.setWidgetMode("mode", mode);
			return Promise.resolve(new Map<string, any>().set(Constants.value, true));    //TODO: Session manager needs to eval whether it is feasibile to change session and resolve or reject the promise
		}

		getActiveProvider(): CIProvider {
			return this._activeProvider || this._defaultProvider;
		}
	}

	export type ApplicationTab = {
		applicationTabId: string;
		entityFormOptions: {};
		formParameters: {};
	}

	export type UISession = {
		sessionId: string;
		context: any;
		applicationTabs: Map<string, ApplicationTab>;
		initials: string;
	}

	/*Class to store CI providers information locally*/
	export class CIProvider {
		providerId: string;			//Widget id
		name: string; 				// Widget Providers name
		label: string;					// Label of the Widget
		landingUrl: string;
		_state: IState;
		widgetHeight: number; 	// Height of the widget Panel
		widgetWidth: number;	//Width of the widget Panel
		_minimizedHeight: number;
		clickToAct: boolean;		//Boolean flag to enable or disable Click to act functionality , it can be changed through setClickToAct API
		_widgetContainer: WidgetContainer;  //The iFrame hosting this widget
		currentMode: number;
		sortOrder : string;	//Sort Order
		apiVersion : string;	//API Version
		orgId : string;	//Organization ID
		orgName : string;	//Organization Name
		crmVersion : string;	//CRM version
		appId: string;	//App Id
		trustedDomain: string;	// Domain to be whitelisted
		uiSessions: Map<string, UISession>;
		visibleUISession: string;

		constructor(x: XrmClientApi.WebApi.Entity, state: IState, environmentInfo: any) {
			this._state = state;
			this.name = x[Constants.name];
			this.providerId = x[Constants.providerId];
			this.label = x[Constants.label];
			this.landingUrl = x[Constants.landingUrl];
			this.widgetHeight = x[Constants.widgetHeight] || 0;
			this.widgetWidth = x[Constants.widgetWidth] || 0;
			this.clickToAct = x[Constants.clickToActAttributeName];
			this._widgetContainer = null;
			this.currentMode = 0;
			this.sortOrder = x[Constants.SortOrder];
			this.apiVersion = x[Constants.APIVersion];
			this.trustedDomain = x[Constants.trustedDomain];
			this.orgId = environmentInfo["orgId"];
			this.orgName = environmentInfo["orgName"];
			this.crmVersion = environmentInfo["crmVersion"];
			this.appId = environmentInfo["appId"];
			this.uiSessions = new Map<string, UISession>();
		}

		raiseEvent(data: Map<string, any>, messageType: string, noTimeout?: boolean): Promise<Map<string, any>> {
			const payload: postMessageNamespace.IExternalRequestMessageType = {
				messageType: messageType,
				messageData: JSON.stringify(Microsoft.CIFramework.Utility.buildEntity(data))
			}
			switch (messageType) {
				case MessageType.onModeChanged:
					this.setMode(data.get(Constants.value) as number);
					break;
				case MessageType.onClickToAct:
					if (!this.clickToAct) {
						return Promise.resolve(new Map().set(Constants.value, false));
					}
			}
			if (!this.getContainer()) {
				return Promise.resolve(new Map().set(Constants.value, false));
			}
			return this._state.messageLibrary.postMsg(this.getContainer().getContentWindow(), payload, this.trustedDomain || this.landingUrl, true, noTimeout);
		}

		getContainer(): WidgetContainer {
			return this._widgetContainer;
		}

		setContainer(container: WidgetContainer, defaultWidth: number, defaultHeight: number, minimizedHeight: number): void {
			this._widgetContainer = container;
			this._minimizedHeight = minimizedHeight;
			if (!this.widgetWidth) {
				this.setWidth(defaultWidth);
			}
			if (!this.widgetHeight) {
				this.setHeight(defaultHeight);
			}
		}

		updateContainerSize(): Promise<Map<string, any>> {
			let container = this.getContainer();
			let ret: boolean = false;
			if (container) {
				let visibility: boolean = this.getMode() == 1;  //TODO: replace with named constant
				ret = container.setVisibility(visibility) && container.setHeight(this.getHeight()) && container.setWidth(this.getWidth());
			}
			return Promise.resolve(new Map<string, any>().set(Constants.value, ret));
			/*if (ret) {
				return Promise.resolve(new Map<string, any>());
			}
			else {
				return Promise.reject(new Map<string, any>().set(Constants.message, "Attempting to set size of a null widget container"));
			}*/
		}

		setMode(mode: number): Promise<Map<string, any>> {
			if (this.currentMode == mode) {
				return Promise.resolve(new Map<string, any>().set(Constants.value, true));
			}
			this.currentMode = mode;
			switch (mode) {
				case 1: //TODO - replace with named constant. We have the focus
					/*if (this._state.providerManager.getActiveProvider() == this) {
						//this.currentMode = mode;
						return this.updateContainerSize();
					}*/
					return this._state.providerManager.setActiveProvider(this).then(
						function (result: Map<string, any>) {
							if (result.get(Constants.value)) {
								//this.currentMode = mode;
								return this.updateContainerSize();
							}
							return Promise.resolve(result);
						}.bind(this),
						function (error) {
							return Promise.reject(error);
						});
				case 0://TODO - replace with named constant. We lost the focus
					/*if (this._state.providerManager.getActiveProvider() != this) {
						//this.currentMode = mode;
						return this.updateContainerSize();
					}*/
					return this._state.providerManager.setActiveProvider(null).then(
						function (result: Map<string, any>) {
							if (result.get(Constants.value)) {
								//this.currentMode = mode;
								return this.updateContainerSize();
							}
							return Promise.resolve(result);
						}.bind(this),
						function (error) {
							return Promise.reject(error);
						});
			}
			return Promise.reject(new Map<string, any>().set(Constants.message, "Invalid mode value"));  
		}

		getMode(): number {
			return this.currentMode;
		}

		setHeight(height: number): Promise<Map<string, any>> {
			this.widgetHeight = height;
			return this.updateContainerSize();
		}

		getHeight(): number {
			if (!this.getMode()) {
				return this._minimizedHeight;  //TODO: figure out what to use as minimized width We are minimized
			}
			return this.widgetHeight;
		}

		setWidth(width: number): Promise<Map<string, any>> {
			this.widgetWidth = width;
			return this.updateContainerSize();
		}

		getWidth(): number {
			return this.widgetWidth;
		}

		startUISession(context: any, initials: string): [string, IErrorHandler] {
			if (!SessionPanel.getInstance().canAddUISession()) {
				//raise notification

				let error = {} as IErrorHandler;
				error.reportTime = new Date().toUTCString();
				error.errorMsg = "Cannot add the UISession. Maximum UISessions limit reached. Limit: " + Constants.MaxUISessions;
				error.errorType = errorTypes.GenericError;
				error.sourceFunc = startUISession.name;
				return [null, error];
			}

			let sessionId: string = this._state.messageLibrary.getCorrelationId();
			let session: UISession = {
				sessionId: sessionId,
				context: context,
				applicationTabs: null,
				initials: initials
			};

			this.uiSessions.set(sessionId, session);
			SessionPanel.getInstance().addUISession(sessionId, this, initials);

			this.raiseEvent(new Map<string, any>().set("sessionId", sessionId).set("visible", this.visibleUISession == sessionId).set("context", context), MessageType.onUISessionStarted);
			return [sessionId, null];
		}

		switchUISession(sessionId: string): [string, IErrorHandler] {
			if (!this.uiSessions.has(sessionId)) {
				let error = {} as IErrorHandler;
				error.reportTime = new Date().toUTCString();
				error.errorMsg = "Session with ID:" + sessionId + " does not exist";
				error.errorType = errorTypes.GenericError;
				error.sourceFunc = switchUISession.name;
				return [null, error];
			}

			if (SessionPanel.getInstance().getvisibleUISession() == sessionId) {
				let error = {} as IErrorHandler;
				error.reportTime = new Date().toUTCString();
				error.errorMsg = "Session with ID:" + sessionId + " is already visible";
				error.errorType = errorTypes.GenericError;
				error.sourceFunc = switchUISession.name;
				return [null, error];
			}

			SessionPanel.getInstance().switchUISession(sessionId);
			return [sessionId, null];
		}

		endUISession(sessionId: string): [string, IErrorHandler] {
			if (!this.uiSessions.has(sessionId)) {
				let error = {} as IErrorHandler;
				error.reportTime = new Date().toUTCString();
				error.errorMsg = "Session with ID:" + sessionId + "does not exist";
				error.errorType = errorTypes.GenericError;
				error.sourceFunc = endUISession.name;
				return [null, error];
			}

			this.raiseEvent(new Map<string, any>().set("sessionId", sessionId).set("visible", this.visibleUISession == sessionId).set("context", this.uiSessions.get(sessionId).context), MessageType.onUISessionEnded, true)
				.then(function () {
					this.uiSessions.delete(sessionId);
					SessionPanel.getInstance().removeUISession(sessionId);
				}.bind(this));

			return [sessionId, null];
		}

		setVisibleUISession(sessionId: string, showWidget?: boolean): void {
			this.raiseEvent(new Map<string, any>().set("sessionId", sessionId).set("visible", true).set("context", this.uiSessions.get(sessionId).context), MessageType.onUISessionVisibilityChanged);
			this.visibleUISession = sessionId;

			if (showWidget) {
				//Todo
			}
		}

		setInvisibleUISession(sessionId: string, hideWidget?: boolean): void {
			this.raiseEvent(new Map<string, any>().set("sessionId", sessionId).set("visible", false).set("context", this.uiSessions.get(sessionId).context), MessageType.onUISessionVisibilityChanged);
			this.visibleUISession = '';

			if (hideWidget) {
				//Todo
			}
		}
	}
}