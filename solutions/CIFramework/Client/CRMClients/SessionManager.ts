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

		abstract canCreateSession(): boolean;

		abstract createSession(provider: CIProvider, input: any, context: any, customerName: string): Promise<string>;

		abstract focusSession(sessionId: string): Promise<void>;

		abstract requestFocusSession(sessionId: string, messagesCount: number): Promise<void>;

		abstract closeSession(sessionId: string): Promise<boolean>;

		abstract getFocusedTab(sessionId: string): string;

		abstract createTab(sessionId: string, input: any): Promise<string>

		abstract focusTab(sessionId: string, tabId: string): Promise<void>;

		abstract closeTab(sessionId: string, tabId: string): Promise<boolean>;
	}

	export function GetSessionManager(clientType: string): SessionManager {
		switch (clientType) {
			case ClientType.UnifiedClient:
				if(isConsoleAppInternal() == true)
					return new ConsoleAppSessionManager();
				else
					return new SessionPanel();
			default:
				return new ConsoleAppSessionManager();
		}
	}
}