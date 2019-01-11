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

		abstract canCreateSession(): boolean;

		abstract createSession(provider: CIProvider, context: any, initials: string): Promise<any>;

		abstract focusSession(sessionId: string): Promise<any>;

		abstract requestSessionFocus(sessionId: string, messagesCount: number): Promise<any>;

		abstract closeSession(sessionId: string): Promise<any>;
	}

	export function GetSessionManager(clientType: number): SessionManager {
		switch (clientType) {
			case ClientType.WebClient:
				return new SessionPanel();
			default:
				return new SessionPanel();
		}
	}
}