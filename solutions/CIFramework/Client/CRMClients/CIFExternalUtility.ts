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
	}

	export class CIFExternalUtilityImpl extends Internal.ConsoleAppSessionManager implements CIFExternalUtility {

		public getTemplateForSession(sessionId?: string): any {
			try {
				let sessionConfig: Internal.UCISessionTemplate;
				if (sessionId) {
					if (this.sessions.has(sessionId)) {
						sessionConfig = this.sessions.get(sessionId).sessionConfig;
					} else {
						logErrors("Please provide valid session id", "CIFExternalUtility.getSessionTemplateId");
					}
				} else {
					sessionConfig = this.sessions.get(this.getFocusedSession()).sessionConfig;
				}
				return sessionConfig.templateId;
			} catch (error) {
				logErrors("Error retrieving sessionTemplateId : " + error, "CIFExternalUtility.getSessionTemplateId");
			}
		}

		public getSessionTemplateParams(sessionId?: string): any {
			try {
				if (sessionId) {
					if (this.sessions.has(sessionId)) {
						return this.sessions.get(sessionId).templateParams;
					} else {
						logErrors("Please provide valid session id", "CIFExternalUtility.getSessionTemplateParams");
					}
				} else {
					return this.sessions.get(this.getFocusedSession()).templateParams;
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
					if (this.sessions.has(sessionId)) {
						this.sessions.get(sessionId).setTemplateParams(input);
						return this.sessions.get(sessionId).templateParams;
					} else {
						logErrors("Please provide valid session id", "CIFExternalUtility.setSessionTemplateParams");
					}
				} else {
					this.sessions.get(this.getFocusedSession()).setTemplateParams(input);
					return this.sessions.get(this.getFocusedSession()).templateParams;
				}
			} else {
				logErrors("Parameter input is required", "CIFExternalUtility.setSessionTemplateParams");
				return null;
			}
		}

		public resolveTemplateString(input: string, templateParams: any, scope: string): Promise<string> {
			return Internal.TemplatesUtility.resolveTemplateString(input, templateParams, scope);
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