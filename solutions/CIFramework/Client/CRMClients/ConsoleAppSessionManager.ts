/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

/// <reference path="../../../../references/external/TypeDefinitions/lib.es6.d.ts" />
/// <reference path="../../../../packages/Crm.ClientApiTypings.1.0.2611-manual/clientapi/XrmClientApi.d.ts" />
/// <reference path="SessionTemplatesInfra.ts" />
/** @internal */
namespace Microsoft.CIFramework.Internal {

	export class ConsoleAppSessionManager extends SessionManager {
		sessionSwitchHandlerID: string;
		sessionCloseHandlerID: string;
		sessionCreateHandlerID: string;

		constructor() {
			super();
			this.sessionSwitchHandlerID = Xrm.App.sessions.addOnAfterSessionSwitch(this.onSessionSwitched);
			this.sessionCloseHandlerID = Xrm.App.sessions.addOnAfterSessionClose(this.onSessionClosed);
			this.sessionCreateHandlerID = Xrm.App.sessions.addOnAfterSessionCreate(this.onSessionCreated);
			UCISessionTemplate.InitSessionTemplates();
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

			if (previousProvider != null) {
				if (previousProvider != newProvider) {
					switchProvider = true;
				}

				previousProvider.setUnfocusedSession(previousSessionId, switchProvider);
			}

			if (newProvider != null) {
				newProvider.setFocusedSession(newSessionId, switchProvider);
				state.client.setPanelMode("setPanelMode", state.sessionManager.getPanelState(newSessionId));
			}
			else {
				state.client.setPanelMode("setPanelMode", Constants.sidePanelHiddenState);
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
				provider.closeSession(sessionId);
			}
		}

		/**
		 * The handler called by the client for SessionCreated event. The client is expected
		* to pass a SessionEventArguments object with details of the event. This handler will collapse
		* the SidePanel which will be expanded on createSession for provider based sessions.
		 * @param event event detail will be set to a map {"sessionId": sessionId} where sessionId is the ID
		 * of the session which was created
		 */
		onSessionCreated(event: any): void {
			state.client.setPanelMode("setPanelMode", Constants.sidePanelHiddenState);
		}

		getFocusedSession(telemetryData?: Object): string {
			let startTime = new Date();
			let apiName = "Xrm.App.sessions.getFocusedSession"
			let res = Xrm.App.sessions.getFocusedSession().sessionId;
			logApiData(telemetryData, startTime, Date.now() - startTime.getTime(), apiName);
			return res;
		}

		canCreateSession(telemetryData?: Object): boolean {
			let startTime = new Date();
			let apiName = "Xrm.App.sessions.canCreateSession"
			let res = Xrm.App.sessions.canCreateSession();
			logApiData(telemetryData, startTime, Date.now() - startTime.getTime(), apiName);
			return res;
		}

		createSession(provider: CIProvider, input: any, context: any, customerName: string, telemetryData?: Object, appId?: any, cifVersion?: any): Promise<string> {
			let startTime = new Date();
			let apiName = "Xrm.App.sessions.createSession"
			return new Promise(function (resolve: any, reject: any) {
				let fetchTask: Promise<UCISessionTemplate> = null;
				if (!isNullOrUndefined(input.templateName)) {
					fetchTask = UCISessionTemplate.getTemplateByName(input.templateName);
				}
				else {
					fetchTask = UCISessionTemplate.getTemplateByTag(input.templateTag)
				}
				let templateParams = input.templateParameters;
				fetchTask.then(
					function (session: UCISessionTemplate) {
						session.instantiateTemplate(templateParams).then(
							function (sessionInput: SessionTemplateSessionInput) {
								Xrm.App.sessions.createSession(sessionInput).then(function (sessionId: string) {
									logApiData(telemetryData, startTime, Date.now() - startTime.getTime(), apiName);
									this.sessions.set(sessionId, new SessionInfo(provider, session));
									state.client.setPanelMode("setPanelMode", session.panelState);
									window.setTimeout(provider.setFocusedSession.bind(provider), 0, sessionId, true);
									this.associateTabWithSession(sessionId, Xrm.App.sessions.getSession(sessionId).tabs.getAll().get(0).tabId, sessionInput.anchorTabTemplate, session.anchorTabName, sessionInput.anchorTabTemplate.tags);
									session.appTabs.then(
										function (appTabs: UCIApplicationTabTemplate[]) {
											let tabsRendered: Promise<string>[] = [];
											appTabs.forEach(
												function (tab: UCIApplicationTabTemplate) {
													tabsRendered.push(new Promise<string>(function (resolve: any, reject: any) {
													tab.instantiateTemplate(templateParams).then(
														function (result: XrmClientApi.TabInput) {
															this.createTab(sessionId, result, telemetryData).then(
																function (result: string) {
																	this.associateTabWithSession(sessionId, result, tab, tab.name, tab.tags);
																	return resolve(result);
																}.bind(this),
																function (error: Error) {
																	return reject(error);
																}.bind(this));
														}.bind(this),
														function (error: Error) {
															let errorData = generateErrorObject(error, "ConsoleAppSessionManager - tab.instantiateTemplate", errorTypes.XrmApiError);
															logAPIFailure(appId, true, errorData, "ConsoleAppSessionManager", cifVersion);
															return reject(error);
														}.bind(this));
												}.bind(this)));
												}.bind(this));
											Promise.all(tabsRendered).then(
												function (result: string) {
													return Xrm.App.sessions.getSession(sessionId).tabs.getAll().get(0).focus();
												}.bind(this),
												function (error: Error) {
													Xrm.App.sessions.getSession(sessionId).tabs.getAll().get(0).focus();
												}.bind(this));
										}.bind(this),
										function (error: Error) {
											let errorData = generateErrorObject(error, "ConsoleAppSessionManager - session.appTabs", errorTypes.XrmApiError);
											logAPIFailure(appId, true, errorData, "ConsoleAppSessionManager", cifVersion);
										}.bind(this));
									resolve(sessionId);
								}.bind(this),
									function (errorMessage: string) {
										reject(errorMessage);
									}.bind(this)
								);
							}.bind(this),
							function (error: Error) {
								let errorData = generateErrorObject(error, "ConsoleAppSessionManager - session.instantiateTemplate", errorTypes.XrmApiError);
								logAPIFailure(appId, true, errorData, "ConsoleAppSessionManager", cifVersion);
								return reject(error);
							}.bind(this)
						);
					}.bind(this),
					function (error: Error) {
						let errorData = generateErrorObject(error, "ConsoleAppSessionManager - UCISessionTemplate.getTemplateByName/Tag", errorTypes.XrmApiError);
						logAPIFailure(appId, true, errorData, "ConsoleAppSessionManager", cifVersion);
						return reject(error);
					}.bind(this)
				);
			}.bind(this)
			);
		}

		requestFocusSession(sessionId: string, messagesCount: number, telemetryData?: Object): Promise<void> {
			let startTime = new Date();
			let apiName = "Xrm.App.sessions.getSession(sessionId).requestFocus"
			Xrm.App.sessions.getSession(sessionId).requestFocus();
			logApiData(telemetryData, startTime, Date.now() - startTime.getTime(), apiName);
			return Promise.resolve();
		}

		focusSession(sessionId: string): Promise<void> {
			Xrm.App.sessions.getSession(sessionId).focus();
			return Promise.resolve();
		}

		closeSession(sessionId: string): Promise<boolean> {
			return new Promise(function (resolve: any, reject: any) {
				Xrm.App.sessions.getSession(sessionId).close().then(function (closeStatus: boolean) {
					this.sessions.delete(sessionId);
					resolve(closeStatus);
				}.bind(this), function (errorMessage: string) {
					reject(errorMessage);
				});
			}.bind(this))
		}

		getFocusedTab(sessionId: string, telemetryData?: Object): string {
			let startTime = new Date();
			let apiName = "Xrm.App.sessions.getSession(sessionId).tabs.getFocusedTab"
			let res = Xrm.App.sessions.getSession(sessionId).tabs.getFocusedTab().tabId;
			logApiData(telemetryData, startTime, Date.now() - startTime.getTime(), apiName);
			return res;
		}

		createTab(sessionId: string, input: any, telemetryData?: Object): Promise<string> {
			let startTime = new Date();
			let apiName = "Xrm.App.sessions.getSession(sessionId).tabs.createTab(input)"
			return new Promise(function (resolve: any, reject: any) {
				Xrm.App.sessions.getSession(sessionId).tabs.createTab(input).then(function (tabId: string) {
					logApiData(telemetryData, startTime, Date.now() - startTime.getTime(), apiName);
					if (!isNullOrUndefined(input.tag)) {
						this.associateTabWithSession(sessionId, tabId, input.name, input.tags);
					}
					resolve(tabId);
				}.bind(this), function (errorMessage: string) {
					reject(errorMessage);
				}.bind(this));
			});
		}

		focusTab(sessionId: string, tabId: string, telemetryData?: Object): Promise<void> {
			let startTime = new Date();
			let apiName = "Xrm.App.sessions.getSession(sessionId).tabs.getTab(tabId).focus"
			Xrm.App.sessions.getSession(sessionId).tabs.getTab(tabId).focus();
			logApiData(telemetryData, startTime, Date.now() - startTime.getTime(), apiName);
			return Promise.resolve();
		}

		closeTab(sessionId: string, tabId: string): Promise<boolean> {
			return new Promise(function (resolve: any, reject: any) {
				Xrm.App.sessions.getSession(sessionId).tabs.getTab(tabId).close().then(function (closeStatus: boolean) {
					resolve(closeStatus);
				}, function (errorMessage: string) {
					reject(errorMessage);
				});
			});
		}

		refreshTab(sessionId: string, tabId: string): Promise<boolean> {
			return new Promise(function (resolve: any, reject: any) {
				Xrm.App.sessions.getSession(sessionId).tabs.getTab(tabId).refresh().then(function () {
					resolve(true);
				}, function (errorMessage: string) {
					reject(errorMessage);
				});
			});
		}
	}
}