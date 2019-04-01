/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

/// <reference path="../../../../references/external/TypeDefinitions/lib.es6.d.ts" />
/** @internal */
namespace Microsoft.CIFramework.Internal {
	export class SessionInfo {
		private _associatedProvider: CIProvider = null;
		private _tabsByTag: Map<string, string[]>;
		private _tabsByName: Map<string, string[]>;

		public constructor(provider: CIProvider) {
			this._associatedProvider = provider;
			this._tabsByTag = new Map<string, string[]>();
			this._tabsByName = new Map<string, string[]>();
		}

		public get associatedProvider(): CIProvider {
			return this._associatedProvider;
		}

		public setTab(tabid: string, name: string, tags?: string[]): void {
			if (!this._tabsByName.has(name)) {
				this._tabsByName.set(name, []);
			}
			this._tabsByName.get(name).push(tabid);

			tags.forEach(function (tag) {
				if (!this._tabsByTag.has(tag)) {
					this._tabsByTag.set(tag, []);
				}
				this._tabsByTag.get(tag).push(tabid);
			});
		}

		public removeTab(tabid: string): void {
			this._tabsByName.forEach(function (vals) {
				let index = vals.indexOf(tabid);
				if (index > -1) {
					vals.splice(index, 1);
				}
			});

			this._tabsByTag.forEach(function (vals) {
				let index = vals.indexOf(tabid);
				if (index > -1) {
					vals.splice(index, 1);
				}
			});
		}
		public getTabsByTag(tag: string): string[] {
			return this._tabsByTag.get(tag);
		}

		public getTabsByName(name: string): string[] {
			return this._tabsByName.get(name);
		}
	}
	export abstract class SessionManager {
		protected sessions: Map<string, SessionInfo>;

		constructor() {
			this.sessions = new Map<string, SessionInfo>();
		}

		getProvider(sessionId: string): CIProvider {
			if (this.sessions.has(sessionId)) {
				return this.sessions.get(sessionId).associatedProvider;
			}
			else {
				return null;
			}
		}

		associateTabWithSession(sessionId: string, tabId: string, name: string, tags?: string[]) {
			if (this.sessions.has(sessionId)) {
				this.sessions.get(sessionId).setTab(tabId, name, tags);
			}
		}

		dissacoiateTab(sessionId: string, tabId: string) {
			if (this.sessions.has(sessionId)) {
				this.sessions.get(sessionId).removeTab(tabId);
			}
		}
		public getTabsByTagOrName(sessionId: string, name: string, tag: string): string[] {
			if (this.sessions.has(sessionId)) {
				let tabId: string[] = this.sessions.get(sessionId).getTabsByName(name);
				if (!isNullOrUndefined(tabId) && tabId.length > 0) {
					return tabId;
				}
				return this.sessions.get(sessionId).getTabsByTag(tag);
			}
			return null;
		}

		public getTabsByName(sessionId: string, name: string): string[] {
			if (this.sessions.has(sessionId)) {
				return this.sessions.get(sessionId).getTabsByName(name);
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