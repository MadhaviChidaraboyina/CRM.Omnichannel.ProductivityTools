/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

/// <reference path="../../../../references/external/TypeDefinitions/lib.es6.d.ts" />
/** @internal */
namespace Microsoft.CIFramework.Internal {
	export abstract class SessionManager {
		protected Sessions: Map<string, CIProvider>;
		protected visibleSession: string;

		constructor() {
			this.Sessions = new Map<string, CIProvider>();
			this.visibleSession = '';
		}

		getVisibleSession() {
			return this.visibleSession;
		}

		getProvider(sessionId: string) {
			return this.Sessions.get(sessionId);
		}

		abstract createSession(provider: CIProvider, input: any, context: any, initials: string): Promise<string>;

		abstract focusSession(sessionId: string): Promise<void>;

		abstract requestSessionFocus(sessionId: string, messagesCount: number): Promise<void>;

		abstract closeSession(sessionId: string): Promise<boolean>;

		abstract createSessionTab(sessionId: string, input: any): Promise<string>

		abstract focusSessionTab(sessionId: string, tabId: string): Promise<void>;

		abstract closeSessionTab(sessionId: string, tabId: string): Promise<boolean>;
	}

	export function GetSessionManager(clientType: string): SessionManager {
		switch (clientType) {
			case ClientType.UnifiedClient:
				return new ConsoleAppSessionManager();
			default:
				return new ConsoleAppSessionManager();
		}
	}
}