/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

/// <reference path="../../../../references/external/TypeDefinitions/lib.es6.d.ts" />
/** @internal */
namespace Microsoft.CIFramework.Internal {
	declare var Xrm: any;

	export class ConsoleAppSessionManager extends SessionManager {
		sessionSwitchHandlerID: string;
		sessionCloseHandlerID: string;
		sessionCreateHandlerID: string;

		constructor() {
			super();
			this.sessionSwitchHandlerID = Xrm.App.sessions.addOnAfterSessionSwitch(this.onSessionSwitched);
			this.sessionCloseHandlerID = Xrm.App.sessions.addOnAfterSessionClose(this.onSessionClosed);
			this.sessionCreateHandlerID = Xrm.App.sessions.addOnAfterSessionCreate(this.onSessionCreated);
		}

		getVisibleSession(): string {
			return Xrm.App.Sessions.GetFocusedSession();
		}

		/**
		* The handler called by the client for SessionSwitched event. The client is expected
		* to pass a SessionEventArguments object with details of the event. This handler will pass the
		* sessionSwitch message to the widget as an event resulting in the registered widget-side
		* handler, if any, being invoked
		* @param event event detail will be set to a map {"oldSessionId": oldSessionId, "newSessionId": newSessionId} where
		* 'oldSessionId is the ID of the Session which is currently focussed and the newSessionId is the ID of the Session
		* which is to be focussed now
		*/
		onSessionSwitched(event: any): void {
			let eventMap = Microsoft.CIFramework.Utility.buildMap(event.getEventArgs().getInputArguments());
			let previousSessionId = eventMap.get(Constants.previousSessionId);
			let newSessionId = eventMap.get(Constants.newSessionId);
			let previousProvider = state.sessionManager.getProvider(previousSessionId);
			let newProvider = state.sessionManager.getProvider(newSessionId);
			let switchProvider = false;
			
			if (previousProvider != newProvider) {
				switchProvider = true;
			}

			if (previousProvider != null) {
				previousProvider.setInvisibleSession(previousSessionId, switchProvider);
			}
			if (newProvider != null) {
				newProvider.setVisibleSession(newSessionId, switchProvider);
				(window.top as any).Xrm.Panel.state = 1;
			}
			else {
				(window.top as any).Xrm.Panel.state = 0;
			}
		}

		/**
		 * The handler called by the client for SessionClosed event. The client is expected
		* to pass a SessionEventArguments object with details of the event. This handler will pass the
		* sessionClosed message to the widget as an event resulting in the registered widget-side
		* handler, if any, being invoked.
		 * @param event event detail will be set to a map {"sessionId": sessionId} where sessionId is the ID
		 * of the session which is being closed
		 */
		onSessionClosed(event: any): void {
			let eventMap = Microsoft.CIFramework.Utility.buildMap(event.getEventArgs().getInputArguments());
			let sessionId = eventMap.get(Constants.sessionId);
			let provider = state.sessionManager.getProvider(sessionId);
			if (provider != null) {
				provider.closeSessionListener(sessionId);
			}
		}

		/**
		 * The handler called by the client for SessionCreated event. The client is expected
		* to pass a SessionEventArguments object with details of the event. This handler will collapse
		* the SidePanel if the created session does not have an attached conversation
		 * @param event event detail will be set to a map {"sessionId": sessionId} where sessionId is the ID
		 * of the session which was created
		 */
		onSessionCreated(event: any): void {
			(window.top as any).Xrm.Panel.state = 0;
		}

		createSession(provider: CIProvider, input: any, context: any, customerName: string): Promise<string> {
			return new Promise(function (resolve: any, reject: any) {
				Xrm.App.sessions.createSession(input).then(function (sessionId: string) {
					this.Sessions.set(sessionId, provider);
					(window.top as any).Xrm.Panel.state = 1;
					resolve(sessionId);
				}.bind(this), function (errorMessage: string) {
					let error = {} as IErrorHandler;
					error.reportTime = new Date().toUTCString();
					error.errorMsg = errorMessage;
					error.errorType = errorTypes.GenericError;
					error.sourceFunc = createSession.name;
					reject(error);
				});
			}.bind(this));
		}

		requestSessionFocus(sessionId: string, messagesCount: number): Promise<void> {
			Xrm.App.sessions.getSession(sessionId).requestFocus();
			return Promise.resolve();
		}

		focusSession(sessionId: string): Promise<void> {
			Xrm.App.sessions.getSession(sessionId).focus();
			this.visibleSession = sessionId;
			return Promise.resolve();
		}

		closeSession(sessionId: string): Promise<boolean> {
			return new Promise(function (resolve: any, reject: any) {
				Xrm.App.sessions.getSession(sessionId).close().then(function (closeStatus: boolean) {
					this.Sessions.delete(sessionId);
					resolve(closeStatus);
				}.bind(this), function (errorMessage: string) {
					let error = {} as IErrorHandler;
					error.reportTime = new Date().toUTCString();
					error.errorMsg = errorMessage;
					error.errorType = errorTypes.GenericError;
					error.sourceFunc = closeSession.name;
					reject(error);
				});
			}.bind(this))
		}

		createSessionTab(sessionId: string, input: any): Promise<string> {
			return new Promise(function (resolve: any, reject: any) {
				Xrm.App.sessions.getSession(sessionId).tabs.createTab(input).then(function (tabId: string) {
					resolve(tabId);
				}, function (errorMessage: string) {
					let error = {} as IErrorHandler;
					error.reportTime = new Date().toUTCString();
					error.errorMsg = errorMessage;
					error.errorType = errorTypes.GenericError;
					error.sourceFunc = "createSessionTab";
					reject(error);
				});
			});
		}

		focusSessionTab(sessionId: string, tabId: string): Promise<void> {
			Xrm.App.sessions.getSession(sessionId).tabs.getTab(tabId).focus();
			return Promise.resolve();
		}

		closeSessionTab(sessionId: string, tabId: string): Promise<boolean> {
			return new Promise(function (resolve: any, reject: any) {
				Xrm.App.sessions.getSession(sessionId).tabs.getTab(tabId).close().then(function (closeStatus: boolean) {
					resolve(closeStatus);
				}, function (errorMessage: string) {
					let error = {} as IErrorHandler;
					error.reportTime = new Date().toUTCString();
					error.errorMsg = errorMessage;
					error.errorType = errorTypes.GenericError;
					error.sourceFunc = "closeSessionTab";
					reject(error);
				});
			});
		}
	}
}