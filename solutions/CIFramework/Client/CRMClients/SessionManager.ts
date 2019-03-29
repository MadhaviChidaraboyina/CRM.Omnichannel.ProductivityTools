/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

/// <reference path="../../../../references/external/TypeDefinitions/lib.es6.d.ts" />
/** @internal */
namespace Microsoft.CIFramework.Internal {
	export class SessionInfo {
		private _associatedProvider: CIProvider = null;
		private _tabsByTag: Map<string, string[]>;

		public constructor(provider: CIProvider) {
			this._associatedProvider = provider;
			this._tabsByTag = new Map<string, string[]>();
		}

		public get accociatedProvider(): CIProvider {
			return this._associatedProvider;
		}

		public setTab(tag: string, tabid: string): void {
			if (!this._tabsByTag.has(tag)) {
				this._tabsByTag.set(tag, []);
			}
			this._tabsByTag.get(tag).push(tabid);
		}

		public getTab(tag: string): string[] {
			return this._tabsByTag.get(tag);
		}
	}
	export abstract class SessionManager {
		protected sessions: Map<string, SessionInfo>;

		constructor() {
			this.sessions = new Map<string, SessionInfo>();
		}

		getProvider(sessionId: string): CIProvider {
			if (this.sessions.has(sessionId)) {
				return this.sessions.get(sessionId).accociatedProvider;
			}
			else {
				return null;
			}
		}

		associateTabWithSession(sessionId: string, tag: string, tabId: string) {
			if (this.sessions.has(sessionId)) {
				this.sessions.get(sessionId).setTab(tag, tabId);
			}
		}

		public getTabsByTag(sessionId: string, tag: string): string[] {
			if (this.sessions.has(sessionId)) {
				return this.sessions.get(sessionId).getTab(tag);
			}
			return null;
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