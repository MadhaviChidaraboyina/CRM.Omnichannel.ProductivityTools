/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

/// <reference path="../../../../references/external/TypeDefinitions/lib.es6.d.ts" />
/** @internal */
namespace Microsoft.CIFramework.Internal {
	export abstract class SessionManager {
		protected sessions: Map<string, CIProvider>;

		constructor() {
			this.sessions = new Map<string, CIProvider>();
		}

		getProvider(sessionId: string) {
			if (this.sessions.has(sessionId)) {
				return this.sessions.get(sessionId);
			}
			else {
				return null;
			}
		}

		abstract getFocusedSession(): string;

		abstract createSession(provider: CIProvider, input: any, context: any, customerName: string): Promise<string>;

		abstract focusSession(sessionId: string): Promise<void>;

		abstract requestFocusSession(sessionId: string, messagesCount: number): Promise<void>;

		abstract closeSession(sessionId: string): Promise<boolean>;

		abstract createSessionTab(sessionId: string, input: any): Promise<string>

		abstract focusSessionTab(sessionId: string, tabId: string): Promise<void>;

		abstract closeSessionTab(sessionId: string, tabId: string): Promise<boolean>;
	}

	export function GetSessionManager(clientType: string, navigationType: string): SessionManager {
		switch (clientType) {
			case ClientType.UnifiedClient:
				if(navigationType == SessionType.MultiSession)
					return new ConsoleAppSessionManager();
				else
					return new SessionPanel();
			default:
				return new ConsoleAppSessionManager();
		}
	}
}