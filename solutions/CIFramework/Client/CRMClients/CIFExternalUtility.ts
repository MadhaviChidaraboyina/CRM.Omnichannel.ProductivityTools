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
	}

	export class CIFExternalUtilityImpl implements CIFExternalUtility {
		public getTemplateForSession(sessionId?: string): any {
			try {
				let sessionConfig: Internal.UCISessionTemplate;
				if (sessionId) {
					if (Internal.state.sessionManager.sessions.has(sessionId)) {
						sessionConfig = Internal.state.sessionManager.sessions.get(sessionId).sessionConfig;
					} else {
						logErrors("Please provide valid session id", "CIFExternalUtility.getSessionTemplateId");
					}
				} else {
					sessionConfig = Internal.state.sessionManager.sessions.get(Internal.state.sessionManager.getFocusedSession()).sessionConfig;
				}
				return sessionConfig.templateId;
			} catch (error) {
				logErrors("Error retrieving sessionTemplateId : " + error, "CIFExternalUtility.getSessionTemplateId");
			}
		}

		public getSessionTemplateParams(sessionId?: string): any {
			try {
				if (sessionId) {
					if (Internal.state.sessionManager.sessions.has(sessionId)) {
						return Internal.state.sessionManager.sessions.get(sessionId).templateParams;
					} else {
						logErrors("Please provide valid session id", "CIFExternalUtility.getSessionTemplateParams");
					}
				} else {
					return Internal.state.sessionManager.sessions.get(Internal.state.sessionManager.getFocusedSession()).templateParams;
				}
			} catch (error) {
				logErrors("Error retrieving sessionTemplateParams : " + error, "CIFExternalUtility.getSessionTemplateParams");
			}
		}

		/**
		* API to set key/value pairs in templateparams dictionary
		* @param input set of key/value pairs
		* returns an Object Promise: The returned Object has the same structure as the underlying Xrm.Navigation.openForm() API
		*/
		public setSessionTemplateParams(input: any, sessionId?: string): any {
			if (!Internal.isNullOrUndefined(input)) {
				if (sessionId) {
					if (Internal.state.sessionManager.sessions.has(sessionId)) {
						Internal.state.sessionManager.sessions.get(sessionId).setTemplateParams(input);
						return Internal.state.sessionManager.sessions.get(sessionId).templateParams;
					} else {
						logErrors("Please provide valid session id", "CIFExternalUtility.setSessionTemplateParams");
					}
				} else {
					Internal.state.sessionManager.sessions.get(Internal.state.sessionManager.getFocusedSession()).setTemplateParams(input);
					return Internal.state.sessionManager.sessions.get(Internal.state.sessionManager.getFocusedSession()).templateParams;
				}
			} else {
				logErrors("Parameter input is required", "CIFExternalUtility.setSessionTemplateParams");
				return null;
			}
		}

		public resolveTemplateString(input: string, templateParams: any, scope: string): Promise<string> {
			return Internal.TemplatesUtility.resolveTemplateString(input, templateParams, scope);
		}

		public createTab(input: XrmClientApi.TabInput): Promise<string> {
			return Internal.state.sessionManager.createTabInternal(Internal.state.sessionManager.getFocusedSession(), input);
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