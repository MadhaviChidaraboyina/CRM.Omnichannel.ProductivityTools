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
		getSessionInfoObject(sessionId: string): Internal.SessionInfo;
		getCurrentSessionInfoObject(): Internal.SessionInfo;
		setSessionInfoObject(sessionInfo: Internal.SessionInfo, sessionId?: string): void;
		resolveTemplateString(input: string, templateParams: any, scope: string): Promise<string>;
	}

	export class CIFExternalUtilityImpl extends Internal.ConsoleAppSessionManager implements CIFExternalUtility {
		public getSessionInfoObject(sessionId: string): Internal.SessionInfo {
			if (!Internal.isNullOrUndefined(sessionId) && this.sessions.has(sessionId)) {
				return this.sessions.get(sessionId);
			} else {
				logErrors("Please provide valid session id", "CIFExternalUtility.getSessionInfoObject");
			}
		}

		public getCurrentSessionInfoObject(): Internal.SessionInfo {
			return this.sessions.get(this.getFocusedSession());
		}

		public setSessionInfoObject(sessionInfo: Internal.SessionInfo, sessionId?: string) {
			if (!Internal.isNullOrUndefined(sessionInfo)) {
				if (sessionId) {
					if (this.sessions.has(sessionId)) {
						this.sessions.set(sessionId, sessionInfo);
					} else {
						logErrors("Please provide valid session id", "CIFExternalUtility.setSessionInfoObject");
					}
				} else {
					this.sessions.set(this.getFocusedSession(), sessionInfo);
				}
			} else {
				logErrors("Parameter sessionInfo is required", "CIFExternalUtility.setSessionInfoObject");
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