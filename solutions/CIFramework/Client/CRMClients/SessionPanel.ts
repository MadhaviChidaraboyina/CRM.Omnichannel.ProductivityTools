/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

/// <reference path="../../../../references/external/TypeDefinitions/lib.es6.d.ts" />
/// <reference path="../CIFrameworkUtilities.ts" />
/** @internal */
namespace Microsoft.CIFramework.Internal {
	export class SessionPanel extends SessionManager {
		public counter: number = 0;
		protected focusedSession: string;

		focusSession(sessionId: string): Promise<void> {
			let switchProvider = true;
			let oldProvider: CIProvider;
			let newProvider: CIProvider = this.getProvider(sessionId);
			if (isNullOrUndefined(newProvider)) {
				return Promise.reject("Session Id is wrong");
			}

			if (this.focusedSession == sessionId) {
				return Promise.resolve();
			}

			state.client.collapseFlap();
			if (!isNullOrUndefined(this.focusedSession)) {
				oldProvider = this.getProvider(this.focusedSession);
				if (oldProvider != null) {
					if (oldProvider == newProvider) {
						switchProvider = false;
					}

					oldProvider.setUnfocusedSession(this.focusedSession, switchProvider);
					state.client.updateSession(this.focusedSession, false);
				}
			}

			this.focusedSession = sessionId;
			newProvider.setFocusedSession(this.focusedSession, switchProvider);

			state.client.updateSession(this.focusedSession, true);

			return Promise.resolve();
		}

		getFocusedSession(): string {
			return this.focusedSession;
		}

		canCreateSession(): boolean {
			if (this.sessions.size < Constants.MaxSessions) {
				return true;
			}
			else {
				return false;
			}
		}

		createSession(provider: CIProvider, input: any, context: any, customerName: string): Promise<string> {
			if (!this.canCreateSession()) {
				return Promise.reject("Cannot add the Session. Maximum sessions limit reached. Limit: " + Constants.MaxSessions);
			}

			let sessionId: string = state.messageLibrary.getCorrelationId();
			this.sessions.set(sessionId, provider);

			let sessionColor = Constants.sessionColors[this.counter++ % Constants.sessionColors.length];
			let initials = "";
			var splittedName = customerName.split(" ");
			if (splittedName.length == 1) {
				initials = splittedName[0][0] + splittedName[0][1];
			}
			else {
				initials = splittedName[0][0] + splittedName[splittedName.length - 1][0];
			}

			state.client.createSession(sessionId, initials, sessionColor, provider.providerId, customerName);
			window.setTimeout(this.focusSession.bind(this), 0, sessionId);

			provider.raiseEvent(new Map<string, any>().set("sessionId", sessionId).set("focused", this.focusedSession == sessionId).set("context", context), MessageType.onSessionCreated);
			return Promise.resolve(sessionId);
		}

		requestFocusSession(sessionId: string, messagesCount: number): Promise<void> {
			var provider = this.getProvider(sessionId);
			if (isNullOrUndefined(provider)) {
				return Promise.reject("Session Id is wrong");
			}

			if (this.focusedSession != sessionId) {
				state.client.notifySession(sessionId, messagesCount);
			}

			return Promise.resolve();
		}

		closeSession(sessionId: string): Promise<boolean> {
			var provider = this.getProvider(sessionId);
			if (isNullOrUndefined(provider)) {
				return Promise.reject("Session Id is wrong");
			}

			return new Promise(function (resolve: any, reject: any) {
				provider.raiseEvent(new Map<string, any>().set("sessionId", sessionId).set("focused", this.focusedSession == sessionId).set("context", provider.sessions.get(sessionId).context), MessageType.onBeforeSessionClosed, true)
					.then(function () {
						this.sessions.delete(sessionId);
						state.client.closeSession(sessionId);

						if (this.focusedSession == sessionId) {
							this.focusedSession = null;
							if (this.sessions.size > 0) {
								//setting last in the Map as focused
								this.focusSession(Array.from(this.sessions.keys()).pop());
							}
						}

						provider.closeSession(sessionId);
						resolve(true);
					}.bind(this, provider), function () {
						reject("Session not closed");
					});
			}.bind(this));
		}

		getFocusedTab(sessionId: string): string {
			return null;
		}

		createTab(sessionId: string, input: any): Promise<string> {
			return Promise.reject("Not implemented");
		}

		focusTab(sessionId: string, tabId: string): Promise<any> {
			return Promise.reject("Not implemented");
		}

		closeTab(sessionId: string, tabId: string): Promise<boolean> {
			return Promise.reject("Not implemented");
		}
	}
}