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
		}

		addProvider(url: string, provider: CIProvider) {
			this.ciProviders.set(url, provider);
		}

		setActiveProvider(provider: CIProvider): void {
			this._activeProvider = provider;
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
		notesInfo: NotesInfo;
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
			this.clickToAct = x[Constants.clickToActAttributeName];
			this._widgetContainer = null;
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

		startUISession(context: any, initials: string, customerName:string): [string, IErrorHandler] {
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
			let notesInformation: NotesInfo = {
				notesDetails: new Map(),
				resolve: null,
				reject: null,
			}
			let session: UISession = {
				sessionId: sessionId,
				context: context,
				applicationTabs: null,
				initials: initials,
				notesInfo: notesInformation,
			};

			this.uiSessions.set(sessionId, session);
			SessionPanel.getInstance().addUISession(sessionId, this, initials, customerName);

			this.raiseEvent(new Map<string, any>().set("sessionId", sessionId).set("visible", this.visibleUISession == sessionId).set("context", context), MessageType.onUISessionStarted);
			return [sessionId, null];
		}

		notifyIncoming(sessionId: string, messagesCount: number): [string, IErrorHandler] {
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
				error.errorMsg = "Session with ID:" + sessionId + " is already visible. Notifications are rendered only for invisible UISessions";
				error.errorType = errorTypes.GenericError;
				error.sourceFunc = switchUISession.name;
				return [null, error];
			}

			SessionPanel.getInstance().notifyIncoming(sessionId, messagesCount);
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
				this._state.providerManager.setActiveProvider(this);
				//update iframe visibility
			}
		}

		setInvisibleUISession(sessionId: string, hideWidget?: boolean): void {
			this.raiseEvent(new Map<string, any>().set("sessionId", sessionId).set("visible", false).set("context", this.uiSessions.get(sessionId).context), MessageType.onUISessionVisibilityChanged);
			this.visibleUISession = '';

			if (hideWidget) {
				this._state.providerManager.setActiveProvider(null);
				//update iframe visibility
			}
		}
	}
}