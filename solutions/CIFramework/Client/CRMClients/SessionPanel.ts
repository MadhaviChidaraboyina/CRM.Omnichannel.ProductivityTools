/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

/// <reference path="../../../../references/external/TypeDefinitions/lib.es6.d.ts" />
/// <reference path="../CIFrameworkUtilities.ts" />
/** @internal */
namespace Microsoft.CIFramework.Internal {
	export class SessionPanel extends SessionManager {
		public counter: number = 0;

		focusSession(sessionId: string): Promise<void> {
			if (this.visibleSession == sessionId || !this.Sessions.has(sessionId)) {
				return Promise.reject("Session Id is wrong or Session is already visible");
			}

			state.client.collapseFlap();
			let switchProvider = true;
			let oldProvider: CIProvider;
			let newProvider: CIProvider = this.Sessions.get(sessionId);
			if (this.visibleSession != '') {
				oldProvider = this.Sessions.get(this.visibleSession);
				if (oldProvider == newProvider) {
					switchProvider = false;
				}

				oldProvider.setInvisibleSession(this.visibleSession, switchProvider);
				state.client.updateSession(this.visibleSession, false);
			}

			this.visibleSession = sessionId;
			newProvider.setVisibleSession(this.visibleSession, switchProvider);
			
			let sessionColor = state.client.getSessionColor(this.visibleSession);
			state.client.updateSession(this.visibleSession, true);

			return Promise.resolve();
		}

		canCreateSession(): boolean {
			if (this.Sessions.size < Constants.MaxSessions) {
				return true;
			}
			else {
				return false;
			}
		}

		createSession(provider: CIProvider, input: any, context: any, initials: string): Promise<string> {
			if (!this.canCreateSession()) {
				return Promise.reject("Cannot add the Session. Maximum Sessions limit reached. Limit: " + Constants.MaxSessions);
			}

			let sessionId: string = state.messageLibrary.getCorrelationId();
			this.Sessions.set(sessionId, provider);

			let sessionColor = Constants.sessionColors[this.counter++ % Constants.sessionColors.length];
			state.client.createSession(sessionId, initials, sessionColor, provider.providerId);

			if (this.visibleSession == '') {
				window.setTimeout(this.focusSession.bind(this), 0, sessionId);
			}

			if (this.Sessions.size == Constants.MaxSessions) {
				//ToDo: postmessagewrapper - raiseEvent(new Map<string, any>().set('Limit', Constants.MaxSessions), MessageType.onMaxSessionsReached);
			}

			provider.raiseEvent(new Map<string, any>().set("sessionId", sessionId).set("visible", this.visibleSession == sessionId).set("context", context), MessageType.onSessionCreated);
			return Promise.resolve(sessionId);
		}

		requestSessionFocus(sessionId: string, messagesCount: number): Promise<void> {
			if (this.visibleSession == sessionId || !this.Sessions.has(sessionId)) {
				return Promise.reject("Session Id is wrong or Session is already visible");
			}

			state.client.notifySession(sessionId, messagesCount);
			return Promise.resolve();
		}

		closeSession(sessionId: string): Promise<boolean> {
			if (!this.Sessions.has(sessionId)) {
				return Promise.reject("Session Id is wrong");
			}

			var provider = this.Sessions.get(sessionId);
			return new Promise(function (resolve: any, reject: any) {
				provider.raiseEvent(new Map<string, any>().set("sessionId", sessionId).set("visible", this.visibleSession == sessionId).set("context", provider.sessions.get(sessionId).context), MessageType.onBeforeSessionClosed, true)
					.then(function () {
						this.Sessions.delete(sessionId);
						state.client.closeSession(sessionId);

						if (this.visibleSession == sessionId) {
							this.visibleSession = '';
							if (this.Sessions.size > 0) {
								//setting last in the Map as visible
								this.focusSession(Array.from(this.Sessions.keys()).pop());
							}
						}

						resolve(true);
					}.bind(this), function () {
						reject("Session not closed");
					});
			}.bind(this));
		}

		closeSessionFromUI(sessionId: string): void {
			if (this.Sessions.has(sessionId)) {
				let provider: CIProvider = this.Sessions.get(sessionId);
				closeSession(new Map().set(Constants.sessionId, sessionId).set(Constants.originURL, provider.landingUrl));
			}
		}

		createSessionTab(sessionId: string, input: any): Promise<string> {
			return Promise.reject("Not implemented");
		}

		focusSessionTab(sessionId: string, tabId: string): Promise<any> {
			return Promise.reject("Not implemented");
		}

		closeSessionTab(sessionId: string, tabId: string): Promise<boolean> {
			return Promise.reject("Not implemented");
		}
	}
}