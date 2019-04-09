/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

/// <reference path="Constants.ts" />
/// <reference path="UnifiedClient.ts" />
/// <reference path="WidgetIFrame.ts" />
/// <reference path="../PostMsgWrapper.ts" />
/// <reference path="../../../../references/external/TypeDefinitions/lib.es6.d.ts" />
/// <reference path="../../../../packages/Crm.ClientApiTypings.1.0.2611-manual/clientapi/XrmClientApi.d.ts" />
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
			 *  Information about sessions
			*/
			sessionManager: SessionManager;

			/**
			 *  Information about providers
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
		}

		addProvider(url: string, provider: CIProvider) {
			this.ciProviders.set(url, provider);
			if(isNullOrUndefined(this._activeProvider)){
				this._activeProvider = provider;
			}
		}

		setActiveProvider(provider: CIProvider): void {
			this._activeProvider = provider;
		}

		getActiveProvider(): CIProvider {
			return this._activeProvider || this._defaultProvider;
		}
	}

	export type Session = {
		sessionId: string;
		input: any;
		context: string;
		customerName: string;
		notesInfo: NotesInfo;
		focused: boolean;
	}

	export type NotesInfo = {
		notesDetails: Map<string,any>;
		resolve: any;
		reject: any;
	}

	/*Class to store CI providers information locally*/
	export class CIProvider {
		providerId: string;			//Widget id
		name: string; 				// Widget Providers name
		label: string;					// Label of the Widget
		landingUrl: string;
		_state: IState;
		_minimizedHeight: number;
		clickToAct: boolean;		//Boolean flag to enable or disable Click to act functionality , it can be changed through setClickToAct API
		_widgetContainer: WidgetContainer;  //The iFrame hosting this widget
		sortOrder: string;	//Sort Order
		apiVersion: string;	//API Version
		orgId: string;	//Organization ID
		orgName: string;	//Organization Name
		crmVersion: string;	//CRM version
		appId: string;	//App Id
		trustedDomain: string;	// Domain to be whitelisted
		sessions: Map<string, Session>;

		constructor(x: XrmClientApi.WebApi.Entity, state: IState, environmentInfo: any) {
			this._state = state;
			this.name = x[Constants.nameParameter];
			this.providerId = x[Constants.providerId];
			this.label = x[Constants.label];
			this.landingUrl = x[Constants.landingUrl];
			this.clickToAct = x[Constants.clickToActAttributeName];
			this._widgetContainer = null;
			this.sortOrder = x[Constants.SortOrder];
			this.apiVersion = x[Constants.APIVersion];
			this.trustedDomain = x[Constants.trustedDomain];
			this.orgId = environmentInfo["orgId"];
			this.orgName = environmentInfo["orgName"];
			this.crmVersion = environmentInfo["crmVersion"];
			this.appId = environmentInfo["appId"];
			this.sessions = new Map<string, Session>();
		}

		raiseEvent(data: Map<string, any>, messageType: string, noTimeout?: boolean): Promise<Map<string, any>> {
			const payload: postMessageNamespace.IExternalRequestMessageType = {
				messageType: messageType,
				messageData: JSON.stringify(Microsoft.CIFramework.Utility.buildEntity(data))
			}
			switch (messageType) {
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

		setContainer(container: WidgetContainer, minimizedHeight: number): void {
			this._widgetContainer = container;
			this._minimizedHeight = minimizedHeight;
		}

		getAllSessions(): string[] {
			return Array.from(this.sessions.keys());
		}

		getFocusedSession(telemetryData?: Object): string {
			var sessionId = this._state.sessionManager.getFocusedSession(telemetryData);
			if (Array.from(this.sessions.keys()).indexOf(sessionId) == -1) {
				return null;
			}

			return sessionId;
		}

		getSession(sessionId: string, telemetryData?: Object): Promise<Map<string, any>>{
			if (!this.sessions.has(sessionId)) {
				let error = {} as IErrorHandler;
				error.reportTime = new Date().toUTCString();
				error.errorMsg = "Session with ID:" + sessionId + " does not exist";
				error.errorType = errorTypes.GenericError;
				error.sourceFunc = MessageType.getSession;
				return Promise.reject(error);
			}

			var session: Session = this.sessions.get(sessionId);
			return Promise.resolve(new Map<string, any>().set("sessionId", sessionId).set("focused", session.focused).set("context", session.context));
		}

		canCreateSession(telemetryData?: Object): boolean {
			return this._state.sessionManager.canCreateSession(telemetryData);
		}

		createSession(input: any, context: any, customerName: string, telemetryData: Object, appId?: any, cifVersion?: any): Promise<string> {
			let notesInformation: NotesInfo = {
				notesDetails: new Map(),
				resolve: null,
				reject: null,
			}

			return new Promise(function (resolve: any, reject: any) {
				this._state.sessionManager.createSession(this, input, context, customerName, telemetryData, appId, cifVersion).then(function (sessionId: string) {
					let session: Session = {
						sessionId: sessionId,
						input: input,
						context: context,
						customerName: customerName,
						notesInfo: notesInformation,
						focused: true
					};

					this.sessions.set(sessionId, session);
					resolve(sessionId);
				}.bind(this), function (errorMessage: string) {
					let error = {} as IErrorHandler;
					error.reportTime = new Date().toUTCString();
					error.errorMsg = errorMessage;
					error.errorType = errorTypes.GenericError;
					error.sourceFunc = MessageType.createSession;
					reject(error);
				});
			}.bind(this));
		}

		requestFocusSession(sessionId: string, messagesCount: number, telemetryData?: Object): Promise<any> {
			if (!this.sessions.has(sessionId)) {
				let error = {} as IErrorHandler;
				error.reportTime = new Date().toUTCString();
				error.errorMsg = "Session with ID:" + sessionId + " does not exist";
				error.errorType = errorTypes.GenericError;
				error.sourceFunc = MessageType.requestFocusSession;
				return Promise.reject(error);
			}

			return new Promise(function (resolve: any, reject: any) {
				this._state.sessionManager.requestFocusSession(sessionId, messagesCount, telemetryData).then(function () {
					resolve();
				}, function (errorMessage: string) {
					let error = {} as IErrorHandler;
					error.reportTime = new Date().toUTCString();
					error.errorMsg = errorMessage;
					error.errorType = errorTypes.GenericError;
					error.sourceFunc = MessageType.requestFocusSession;
					reject(error);
				});
			}.bind(this));
		}

		setFocusedSession(sessionId: string, showWidget?: boolean): void {
			this.sessions.get(sessionId).focused = true;
			this.raiseEvent(new Map<string, any>().set("sessionId", sessionId).set("focused", true).set("context", this.sessions.get(sessionId).context), MessageType.onSessionSwitched);

			if (showWidget) {
				this._state.providerManager.setActiveProvider(this);
				//update iframe visibility
			}
		}

		setUnfocusedSession(sessionId: string, hideWidget?: boolean): void {
			this.sessions.get(sessionId).focused = false;
			this.raiseEvent(new Map<string, any>().set("sessionId", sessionId).set("focused", false).set("context", this.sessions.get(sessionId).context), MessageType.onSessionSwitched);

			if (hideWidget) {
				this._state.providerManager.setActiveProvider(null);
				//update iframe visibility
			}
		}

		closeSession(sessionId: string, telemetryData?: Object): void {
			this.raiseEvent(new Map<string, any>().set("sessionId", sessionId).set("context", this.sessions.get(sessionId).context), MessageType.onSessionClosed);
			this.sessions.delete(sessionId);
		}

		getFocusedTab(telemetryData?: Object): string {
			var focusedSessionId = this.getFocusedSession();
			if (focusedSessionId == null) {
				return null;
			}

			return this._state.sessionManager.getFocusedTab(focusedSessionId, telemetryData);
		}

		getTabsByTagOrName(name: string, tag: string): Promise<string[]> {
			var focusedSessionId = this.getFocusedSession();
			if (focusedSessionId == null) {
				return Promise.reject("Session not in focus");
			}

			return Promise.resolve(this._state.sessionManager.getTabsByTagOrName(focusedSessionId, name, tag));
		}

		refreshTab(tabId: string): Promise<boolean> {
			var focusedSessionId = this.getFocusedSession();
			if (focusedSessionId == null) {
				let error = {} as IErrorHandler;
				error.reportTime = new Date().toUTCString();
				error.errorMsg = "Focused session does not belong to the provider";
				error.errorType = errorTypes.GenericError;
				error.sourceFunc = MessageType.refreshTab;
				return Promise.reject(error);
			}

			return new Promise(function (resolve: any, reject: any) {
				this._state.sessionManager.refreshTab(focusedSessionId, tabId).then(function (result: boolean) {
					resolve(result);
				}, function (errorMsg: string) {
					let error = {} as IErrorHandler;
					error.reportTime = new Date().toUTCString();
					error.errorMsg = errorMsg;
					error.errorType = errorTypes.GenericError;
					error.sourceFunc = MessageType.refreshTab;
					reject(error);
				});
			}.bind(this));
		}

		setSessionTitle(input: any): Promise<string> {
			var focusedSessionId = this.getFocusedSession();
			if (focusedSessionId == null) {
				let error = {} as IErrorHandler;
				error.reportTime = new Date().toUTCString();
				error.errorMsg = "Focused session does not belong to the provider";
				error.errorType = errorTypes.GenericError;
				error.sourceFunc = MessageType.setSessionTitle;
				return Promise.reject(error);
			}

			return new Promise(function (resolve: any, reject: any) {
				this._state.sessionManager.setSessionTitle(focusedSessionId, input).then(function (result: string) {
					resolve(result);
				}, function (errorMsg: string) {
					let error = {} as IErrorHandler;
					error.reportTime = new Date().toUTCString();
					error.errorMsg = errorMsg;
					error.errorType = errorTypes.GenericError;
					error.sourceFunc = MessageType.setSessionTitle;
					reject(error);
				});
			}.bind(this));
		}

		setTabTitle(tabId: string, input: any): Promise<string> {
			var focusedSessionId = this.getFocusedSession();
			if (focusedSessionId == null) {
				let error = {} as IErrorHandler;
				error.reportTime = new Date().toUTCString();
				error.errorMsg = "Focused session does not belong to the provider";
				error.errorType = errorTypes.GenericError;
				error.sourceFunc = MessageType.setSessionTitle;
				return Promise.reject(error);
			}

			return new Promise(function (resolve: any, reject: any) {
				this._state.sessionManager.setTabTitle(focusedSessionId, tabId, input).then(function (result: string) {
					resolve(result);
				}, function (errorMsg: string) {
					let error = {} as IErrorHandler;
					error.reportTime = new Date().toUTCString();
					error.errorMsg = errorMsg;
					error.errorType = errorTypes.GenericError;
					error.sourceFunc = MessageType.setSessionTitle;
					reject(error);
				});
			}.bind(this));
		}

		createTab(input: any, telemetryData?: Object): Promise<string> {
			var focusedSessionId = this.getFocusedSession();
			if (focusedSessionId == null) {
				let error = {} as IErrorHandler;
				error.reportTime = new Date().toUTCString();
				error.errorMsg = "Focused session does not belong to the provider";
				error.errorType = errorTypes.GenericError;
				error.sourceFunc = MessageType.createTab;
				return Promise.reject(error);
			}

			return new Promise(function (resolve: any, reject: any) {
				this._state.sessionManager.createTab(focusedSessionId, input, telemetryData).then(function (tabId: string) {
					resolve(tabId);
				}, function (errorMsg: string) {
					let error = {} as IErrorHandler;
					error.reportTime = new Date().toUTCString();
					error.errorMsg = errorMsg;
					error.errorType = errorTypes.GenericError;
					error.sourceFunc = MessageType.createTab;
					reject(error);
				});
			}.bind(this));
		}

		focusTab(tabId: string, telemetryData?: Object): Promise<string> {
			var focusedSessionId = this.getFocusedSession();
			if (focusedSessionId == null) {
				let error = {} as IErrorHandler;
				error.reportTime = new Date().toUTCString();
				error.errorMsg = "Focused session does not belong to the provider";
				error.errorType = errorTypes.GenericError;
				error.sourceFunc = MessageType.focusTab;
				return Promise.reject(error);
			}

			return new Promise(function (resolve: any, reject: any) {
				this._state.sessionManager.focusTab(focusedSessionId, tabId, telemetryData).then(function () {
					resolve();
				}, function (errorMsg: string) {
					let error = {} as IErrorHandler;
					error.reportTime = new Date().toUTCString();
					error.errorMsg = errorMsg;
					error.errorType = errorTypes.GenericError;
					error.sourceFunc = MessageType.focusTab;
					reject(error);
				});
			}.bind(this));
		}
	}
}