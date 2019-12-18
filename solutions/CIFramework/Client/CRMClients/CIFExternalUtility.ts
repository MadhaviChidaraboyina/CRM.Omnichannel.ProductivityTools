/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/// <reference path="../../../../references/external/TypeDefinitions/lib.es6.d.ts" />
/// <reference path="../../../../packages/Crm.ClientApiTypings.1.3.2084/clientapi/XrmClientApi.d.ts" />
/// <reference path="SessionManager.ts" />
/// <reference path="ConsoleAppSessionManager.ts" />

import Internal = Microsoft.CIFramework.Internal;
namespace Microsoft.CIFramework.External {

	export interface CIFExternalUtility {
		getTemplateForSession(sessionId?: string): any;
		getSessionTemplateParams(sessionId?: string): any;
		setSessionTemplateParams(data: any, sessionId?: string): void;
		resolveTemplateString(input: string, templateParams: any, scope: string): Promise<string>;
        createTab(input: XrmClientApi.TabInput): Promise<string>;
        focusTab(tabId: string, sessionId?: string): Promise<string>;
        getCurrentTab(sessionId?: string): any;
        refreshTab(tabId: string, sessionId?: string): Promise<string>;
	}

	export class CIFExternalUtilityImpl implements CIFExternalUtility {
		public getTemplateForSession(sessionId?: string): any {
			try {
				let sessionIdVal: string;
				if (sessionId) {
					sessionIdVal = sessionId;
				} else {
					sessionIdVal = Internal.state.sessionManager.getFocusedSession();
				}
				let sessionConfig: Internal.UCISessionTemplate;
				if (Internal.state.sessionManager.sessions.has(sessionIdVal)) {
					sessionConfig = Internal.state.sessionManager.sessions.get(sessionIdVal).sessionConfig;
				} else {
					logErrors("Please provide valid session id", "CIFExternalUtility.getSessionTemplateId");
					throw new Error("Invalid session Id");
				}
				return sessionConfig.templateId;
			} catch (error) {
				logErrors("Error retrieving sessionTemplateId : " + error, "CIFExternalUtility.getTemplateForSession");
				throw error;
			}
		}

		public getSessionTemplateParams(sessionId?: string): any {
			try {
				let sessionIdVal: string;
				if (sessionId) {
					sessionIdVal = sessionId;
				} else {
					sessionIdVal = Internal.state.sessionManager.getFocusedSession();
				}
				if (Internal.state.sessionManager.sessions.has(sessionIdVal)) {
					return Internal.state.sessionManager.sessions.get(sessionIdVal).templateParams;
				} else {
					logErrors("Please provide valid session id", "CIFExternalUtility.getSessionTemplateParams");
					throw new Error("Invalid session Id");
				}
			} catch (error) {
				logErrors("Error retrieving sessionTemplateParams : " + error, "CIFExternalUtility.getSessionTemplateParams");
				throw error;
			}
		}

		/**
		* API to set key/value pairs in templateparams dictionary
		* @param input set of key/value pairs
		* returns an Object Promise: The returned Object has the same structure as the underlying Xrm.Navigation.openForm() API
		*/
		public setSessionTemplateParams(input: any, sessionId?: string): any {
			try {
				if (!Internal.isNullOrUndefined(input)) {
					let sessionIdVal: string;
					if (sessionId) {
						sessionIdVal = sessionId;
					} else {
						sessionIdVal = Internal.state.sessionManager.getFocusedSession();
					}
					if (Internal.state.sessionManager.sessions.has(sessionIdVal)) {
						Internal.state.sessionManager.sessions.get(sessionIdVal).setTemplateParams(input);
						return Internal.state.sessionManager.sessions.get(sessionIdVal).templateParams;
					} else {
						logErrors("Please provide valid session id", "CIFExternalUtility.setSessionTemplateParams");
						throw new Error("Invalid session Id");
					}
				} else {
					logErrors("Parameter input is required", "CIFExternalUtility.setSessionTemplateParams");
					throw new Error("Parameter required");
				}
			} catch (error) {
				logErrors("Error setting sessionTemplateParams : " + error, "CIFExternalUtility.setSessionTemplateParams");
				throw error;
			}
		}

		public resolveTemplateString(input: string, templateParams: any, scope: string): Promise<string> {
			return Internal.TemplatesUtility.resolveTemplateString(input, templateParams, scope);
		}

		public createTab(input: XrmClientApi.TabInput): Promise<string> {
			return Internal.state.sessionManager.createTabInternal(Internal.state.sessionManager.getFocusedSession(), input);
        }

        focusTab(tabId: string, sessionId?: string): Promise<string> {
            try {
                return new Promise<any>((resolve, reject) => {
                    let sessionIdVal: string;
                    if (sessionId) {
                        sessionIdVal = sessionId;
                    } else {
                        sessionIdVal = Internal.state.sessionManager.getFocusedSession();
                    }
                    Internal.state.sessionManager.focusTab(sessionIdVal, tabId).then((success) => {
                        resolve(success);
                    },
                    (error) => {
                        reject(error);
                    });
                });
            } catch (error) {
                logErrors("Error in focusTab : " + error, "CIFExternalUtility.focusTab");
                Promise.reject(error);
            }
        }

        getCurrentTab(sessionId?: string): any {
            try {
                let sessionIdVal: string;
                if (sessionId) {
                    sessionIdVal = sessionId;
                } else {
                    sessionIdVal = Internal.state.sessionManager.getFocusedSession();
                }
                return Internal.state.sessionManager.getFocusedTab(sessionIdVal);
            } catch (error) {
                logErrors("Error getCurrentTab : " + error, "CIFExternalUtility.getCurrentTab");
                throw error;
            }
        }

        refreshTab(tabId: string, sessionId?: string): Promise<string> {
            try {
                return new Promise<any>((resolve, reject) => {
                    let sessionIdVal: string;
                    if (sessionId) {
                        sessionIdVal = sessionId;
                    } else {
                        sessionIdVal = Internal.state.sessionManager.getFocusedSession();
                    }
                    Internal.state.sessionManager.refreshTab(sessionIdVal, tabId).then((success) => {
                        resolve(success);
                    },
                    (error) => {
                        reject(error);
                    });
                });
            } catch (error) {
                logErrors("Error in refreshTab : " + error, "CIFExternalUtility.refreshTab");
                Promise.reject(error);
            }
        }
	}

	function logErrors(errorMessage: string, functionName: string) {
		console.log(errorMessage);
		let error = {} as Internal.IErrorHandler;
		error.reportTime = new Date().toUTCString();
		error.errorMsg = errorMessage;
		error.errorType = Internal.errorTypes.InvalidParams;
		error.sourceFunc = functionName;
		Internal.logAPIInternalInfo(Internal.appId, true, error, MessageType.logErrorsAndReject, Internal.cifVersion);
	}
}