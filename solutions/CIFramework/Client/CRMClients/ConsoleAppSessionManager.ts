﻿/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

/// <reference path="../../../../references/external/TypeDefinitions/lib.es6.d.ts" />
/// <reference path="../../../../packages/Crm.ClientApiTypings.1.3.2084/clientapi/XrmClientApi.d.ts" />
/// <reference path="SessionTemplatesInfra.ts" />
/// <reference path="NotificationTemplatesInfra.ts" />
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
			UCINotificationTemplate.InitTemplates();
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
			let originUrl = null;
			let previousSessionId = eventMap.get(Constants.previousSessionId);
			let newSessionId = eventMap.get(Constants.newSessionId);
			let previousProvider = state.sessionManager.getProvider(previousSessionId);
			let newProvider = state.sessionManager.getProvider(newSessionId);
			if (previousProvider != null) {
				originUrl = previousProvider.landingUrl;
			}
			if (newProvider != null) {
				originUrl = newProvider.landingUrl;
			}

			if(state.isAnalyticsEnabledForAnyProvider)
			{
				raiseSystemAnalyticsEvent(InternalEventName.SessionFocusOut, eventMap, new Map<string, any>().set(Constants.originURL, originUrl));
				raiseSystemAnalyticsEvent(InternalEventName.SessionFocusIn, eventMap, new Map<string, any>().set(Constants.originURL, originUrl));
			}
			
			let switchProvider = false;
			
			if (previousProvider != null) {
				//Persist and close the Notes flap before switching the session, only if the previous session was a provider session
				state.client.collapseFlap(previousSessionId);
				if (previousProvider != newProvider) {
					switchProvider = true;
				}
				previousProvider.setUnfocusedSession(previousSessionId, switchProvider);
			}
			if (newProvider != null) {
				newProvider.setFocusedSession(newSessionId, switchProvider);
				state.client.setPanelMode("setPanelMode", state.sessionManager.getPanelState(newSessionId));
				state.client.setProviderVisibility(state.providerManager.ciProviders, newProvider.providerId);
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
			let originUrl = null;
			let sessionId = eventMap.get(Constants.sessionId);
			let provider = state.sessionManager.getProvider(sessionId);
			if (provider != null) {
				originUrl = provider.landingUrl;
			}
			raiseSystemAnalyticsEvent(InternalEventName.SessionClosed, eventMap, new Map<string, any>().set(Constants.originURL, originUrl));

			//Persist and close the Notes flap before closing the session
			state.client.collapseFlap(sessionId);

			let sessionInfo = state.sessionManager.sessions.get(sessionId);
			if (provider != null) {
				if (provider.shouldCreateLiveWorkItem && !isNullOrUndefined(sessionInfo)) {
					let valueMap = new Map().set(Constants.entityStateCode, Constants.stateCodeClose).set(Constants.entityStatusCode, Constants.statusCodeClose);
					let updateMap = new Map().set(Constants.entityName, Constants.liveWorkItemEntity).set(Constants.entityId, sessionInfo.conversationId).set(Constants.value, valueMap).set(Constants.originURL, originUrl);
					updateConversation(updateMap);
				}
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
			//state.client.setPanelMode("setPanelMode", Constants.sidePanelHiddenState);  
			let eventMap = Microsoft.CIFramework.Utility.buildMap(event.getEventArgs().getInputArguments());
			let newSessionId = eventMap.get(Constants.newSessionId);
			let newProvider = state.sessionManager.getProvider(newSessionId);
			if (newProvider != null) {             
				state.client.setPanelMode("setPanelMode", state.sessionManager.getPanelState(newSessionId));
			}
			else {
				state.client.setPanelMode("setPanelMode", Constants.sidePanelHiddenState);
			}
		}

		getFocusedSession(telemetryData?: Object): string {
			let startTime = new Date();
			let apiName = "Xrm.App.sessions.getFocusedSession"
			let res = Xrm.App.sessions.getFocusedSession().sessionId;
			logApiData(telemetryData, startTime, Date.now() - startTime.getTime(), apiName);
			return res;
		}

		isDefaultSession(sessionId: string, telemetryData?: Object): boolean {
			let startTime = new Date();
			let apiName = "Xrm.App.sessions.getSession"
			let res = Xrm.App.sessions.getSession(sessionId).isDefault;
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

		createSession(provider: CIProvider, input : any, context: any, customerName: string, telemetryData?: Object, appId?: any, cifVersion?: any, correlationId?: string , providerSessionId ? : string): Promise<Map<string ,string>> {
			//Before we create the new session, we persist the current notes if any and close the flap
			var currentSessionId: string = state.sessionManager.getFocusedSession();
			state.client.collapseFlap(currentSessionId);

			return new Promise(function (resolve: any, reject: any) {
				// Consumer can pass either templatename or templatename resolver.
				// Template name resolver should contain webresourcename , functionname and parameters(if any).
				let templateNameResolver: Promise<TemplateNameResolverResult> = TemplatesUtility.resolveTemplateName(input.templateNameResolver, input.templateName);
				templateNameResolver.then(function (response: TemplateNameResolverResult) {
					let templateName = input.templateName;
					if (response.isFoundByResolver && !isNullOrUndefined(response.templateName)) {
						templateName = response.templateName;
					}
				let fetchTask: Promise<UCISessionTemplate> = null;
				if (!isNullOrUndefined(templateName)) {
					fetchTask = UCISessionTemplate.getTemplateByName(templateName);
				}
				else {
					fetchTask = UCISessionTemplate.getTemplateByTag(input.templateTag)
				}
				let templateParams = input.templateParameters;
				fetchTask.then(
					function (session: UCISessionTemplate) {
						session.instantiateTemplate(templateParams, correlationId).then(
							function (sessionInput: SessionTemplateSessionInput) {
								let startTime = new Date();
								let resultMap = new Map<string, string>();
								let apiName = "Xrm.App.sessions.createSession";
								let conversationId = null;
								sessionInput.options.isFocused = true;  //Switch focus to the newly created session by default
								Xrm.App.sessions.createSession(sessionInput).then(function (sessionId: string) {
									logApiData(telemetryData, startTime, Date.now() - startTime.getTime(), apiName);

									if (provider && provider.name != ChannelProvider.Omnichannel && provider.enableAnalytics == true && provider.shouldCreateLiveWorkItem == true && state.isOmnichannelInstalled)
									{
										conversationId =  Microsoft.CIFramework.Utility.newGuid();
										this.createLiveworkitem(provider, conversationId, cifVersion, correlationId);
									}
									else
									{
										conversationId = correlationId;
									}

									this.sessions.set(sessionId, new SessionInfo(provider, session, templateParams, correlationId, Microsoft.CIFramework.Utility.newGuid(), providerSessionId, conversationId));
									state.client.setPanelMode("setPanelMode", session.panelState);
									state.client.setProviderVisibility(state.providerManager.ciProviders, provider.providerId);
									var inputObject: any = {};
									let tabId = Xrm.App.sessions.getSession(sessionId).tabs.getAll().get(0).tabId;
									inputObject[tabId] = { "pageType": sessionInput.pageInput.pageType, "entityName": (sessionInput.pageInput as any).entityName, "entityId": (sessionInput.pageInput as any).entityId };
									this.updateTabContextInCurrentSession(inputObject, sessionId);
									window.setTimeout(provider.setFocusedSession.bind(provider), 0, sessionId, true);
									sessionInput.anchorTabTemplate.resolveTitle(templateParams).then(
										function (result: string) {
											this.setTabTitleInternal(sessionId, Xrm.App.sessions.getSession(sessionId).tabs.getAll().get(0).tabId, result);
										}.bind(this),
										function (error: Error) {
											this.setTabTitleInternal(sessionId, Xrm.App.sessions.getSession(sessionId).tabs.getAll().get(0).tabId, sessionInput.anchorTabTemplate.title);
										}.bind(this));
									this.associateTabWithSession(sessionId, Xrm.App.sessions.getSession(sessionId).tabs.getAll().get(0).tabId, sessionInput.anchorTabTemplate, session.anchorTabName, sessionInput.anchorTabTemplate.tags);
									resultMap.set("sessionId" , sessionId);
									resultMap.set("conversationId" , conversationId);
									
									resolve(resultMap); //Tell the caller the anchor tab is ready; other tabs loaded in the background
									
									session.appTabs.then(
										function (appTabs: UCIApplicationTabTemplate[]) {
											let tabsRendered: Promise<string>[] = [];
											appTabs.forEach(
												function (tab: UCIApplicationTabTemplate) {
													tabsRendered.push(new Promise<string>(function (resolve: any, reject: any) {
														tab.instantiateTemplate(templateParams, correlationId).then(
														function (tabInput: XrmClientApi.TabInput) {
																tabInput.options.isFocused = false; //All app-tabs rendered in the background
																this.createTabInternal(sessionId, tabInput, telemetryData).then(
																	function (tabId: string) {
																		this.associateTabWithSession(sessionId, tabId, tab, tab.name, tab.tags);
																		return resolve(tabId);
																	}.bind(this),
																	function (error: Error) {
																		return reject(error);
																	}.bind(this));
															}.bind(this),
															function (error: Error) {
																let errorData = generateErrorObject(error, "ConsoleAppSessionManager - tab.instantiateTemplate", errorTypes.XrmApiError);
																logAPIFailure(appId, true, errorData, "ConsoleAppSessionManager", cifVersion, "", "", "", correlationId);
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
											logAPIFailure(appId, true, errorData, "ConsoleAppSessionManager", cifVersion, "", "", "", correlationId);
										}.bind(this));
								}.bind(this),
									function (errorMessage: string) {
										let error = {} as Error;
										error.message = errorMessage;
										error.name = "createSession";
										let errorData = generateErrorObject(error, "ConsoleAppSessionManager - Xrm.App.sessions.createSession", errorTypes.XrmApiError);
										logAPIFailure(appId, true, errorData, "ConsoleAppSessionManager", cifVersion, "", "", "", correlationId);
										reject(errorMessage);
									}.bind(this)
								);
							}.bind(this),
							function (error: Error) {
								let errorData = generateErrorObject(error, "ConsoleAppSessionManager - session.instantiateTemplate", errorTypes.XrmApiError);
								logAPIFailure(appId, true, errorData, "ConsoleAppSessionManager", cifVersion, "", "", "", correlationId);
								return reject(error);
							}.bind(this)
						);
					}.bind(this),
					function (error: Error) {
						let errorData = generateErrorObject(error, "ConsoleAppSessionManager - UCISessionTemplate.getTemplateByName/Tag", errorTypes.XrmApiError);
						logAPIFailure(appId, true, errorData, "ConsoleAppSessionManager", cifVersion, "", "", "", correlationId);
						return reject(error);
					}.bind(this)
				);
				}.bind(this),
					function (error: Error) {
						let errorData = generateErrorObject(error, "ConsoleAppSessionManager - UCISessionTemplate.getTemplateByName/Tag", errorTypes.XrmApiError);
						logAPIFailure(appId, true, errorData, "ConsoleAppSessionManager", cifVersion, "", "", "", correlationId);
						return reject(error);
					});
			}.bind(this)
			);
		}

		createLiveworkitem(provider: CIProvider  , liveworkitemId : string , cifVersion:string  , correlationId : string) 
		{
				let entity: XrmClientApi.WebApi.Entity = {};
				entity[LiveWorkItemEntity.ocLiveWorkItemId] = liveworkitemId;
				entity[LiveWorkItemEntity.subject] =  Microsoft.CIFramework.Utility.getResourceString("VISITOR_TEXT")+ " : "  + provider.name;
				entity[LiveWorkItemEntity.title] = Microsoft.CIFramework.Utility.getResourceString("VISITOR_TEXT") + " : " + provider.name;
				entity[LiveWorkItemEntity.activityId] = liveworkitemId;
				entity[LiveWorkItemEntity.providerName] = liveworkitemId;
				entity[LiveWorkItemEntity.isThirdPartyConversation] = true;
	
			Xrm.WebApi.createRecord(LiveWorkItemEntity.entityName, entity).then(
				function success(result: any) {
						console.log("Conversation Data record created with ID: " + result.id);
					},
					function (error: any) {
						let errorData = generateErrorObject(error, "ConsoleAppSessionManager - CreateSession.createLiveworkitem/Tag", errorTypes.XrmApiError);
						logAPIFailure(appId, true, errorData, "ConsoleAppSessionManager", cifVersion, "", "", "", correlationId);
						
					}
				);
		}

		requestFocusSession(sessionId: string, messagesCount: number, telemetryData?: Object): Promise<void> {
			let startTime = new Date();
			let apiName = "Xrm.App.sessions.getSession(sessionId).requestFocus";
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
			let apiName = "Xrm.App.sessions.getSession(sessionId).tabs.getFocusedTab";
			let res = Xrm.App.sessions.getSession(sessionId).tabs.getFocusedTab().tabId;
			logApiData(telemetryData, startTime, Date.now() - startTime.getTime(), apiName);
			return res;
		}

		createTab(sessionId: string, input: any, telemetryData?: Object, appId?: any, cifVersion?: any, correlationId?: string): Promise<string> {
			return new Promise(function (resolve: any, reject: any) {
				let fetchTask: Promise<UCIApplicationTabTemplate> = null;
				if (!isNullOrUndefined(input.templateName)) {
					fetchTask = UCIApplicationTabTemplate.getTemplate(input.templateName);
				}
				let templateParams = input.templateParameters;
				if (isNullOrUndefined(input.templateParameters)) {
					templateParams = {};
				}
				fetchTask.then(
					function (tab: UCIApplicationTabTemplate) {
						tab.instantiateTemplate(templateParams, correlationId).then(
							function (tabInput: XrmClientApi.TabInput) {
								tabInput.options.isFocused = input.isFocused || false;
								this.createTabInternal(sessionId, tabInput, telemetryData).then(
									function (tabId: string) {
										this.associateTabWithSession(sessionId, tabId, tab, tab.name, tab.tags);
										if (input.injectOnSave) {
											(window.top as any).Xrm.Page.data.entity.addOnSave(Microsoft.CIFramework.Utility.onFormSaveHandler);
										}
										return resolve(tabId);
									}.bind(this),
									function (error: Error) {
										return reject(error);
									}.bind(this));
							}.bind(this),
							function (error: Error) {
								let errorData = generateErrorObject(error, "ConsoleAppSessionManager - tab.instantiateTemplate", errorTypes.XrmApiError);
								logAPIFailure(appId, true, errorData, "ConsoleAppSessionManager", cifVersion, "", "", "", correlationId);
								return reject(error);
							}.bind(this));
					}.bind(this),
					function (error: Error) {
						let errorData = generateErrorObject(error, "ConsoleAppSessionManager - UCIApplicationTabTemplate.getTemplate", errorTypes.XrmApiError);
						logAPIFailure(appId, true, errorData, "ConsoleAppSessionManager", cifVersion, "", "", "", correlationId);
					}.bind(this));
			}.bind(this));
		}

		createTabInternal(sessionId: string, input: any, telemetryData?: Object): Promise<string> {
			let startTime = new Date();
			let apiName = "Xrm.App.sessions.getSession(sessionId).tabs.createTab";
			return new Promise(function (resolve: any, reject: any) {
				Xrm.App.sessions.getSession(sessionId).tabs.createTab(input).then(function (tabId: string) {
					let additionalData: any = {};
					additionalData["applicationType"] = input.pageInput.pageType;
					logApiData(telemetryData, startTime, Date.now() - startTime.getTime(), apiName, additionalData);
					var inputObject: any = {};
					inputObject[tabId] = { "pageType": input.pageInput.pageType, "entityName": input.pageInput.entityName, "entityId": input.pageInput.entityId };
					this.updateTabContextInCurrentSession(inputObject, sessionId);
					resolve(tabId);
				}.bind(this), function (errorMessage: string) {
					reject(errorMessage);
				}.bind(this));
			}.bind(this));
		}

		focusTab(sessionId: string, tabId: string, telemetryData?: Object): Promise<void> {
			let startTime = new Date();
			let apiName = "Xrm.App.sessions.getSession(sessionId).tabs.getTab(tabId).focus";
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