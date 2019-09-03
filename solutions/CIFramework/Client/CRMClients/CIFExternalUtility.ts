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
	}

	export class CIFExternalUtilityImpl extends Internal.ConsoleAppSessionManager implements CIFExternalUtility {
		public getSessionInfoObject(sessionId: string): Internal.SessionInfo {
			return this.sessions.get(sessionId);
		}

		public getCurrentSessionInfoObject(): Internal.SessionInfo {
			return this.sessions.get(this.getFocusedSession());
		}
	}
}