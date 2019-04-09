/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

/// <reference path="../../../../references/external/TypeDefinitions/lib.es6.d.ts" />
/** @internal */
namespace Microsoft.CIFramework.Internal {
	export interface AppConfig {
		resolveTitle(input: any): Promise<string>;
	}
	export class SessionInfo {
		private _associatedProvider: CIProvider = null;
		private _tabsByTag: Map<string, string[]>;
		private _tabsByName: Map<string, string[]>;
		private _tabConfigs: Map<string, AppConfig>;
		private _sessionConfig: AppConfig;

		public constructor(provider: CIProvider, config?: AppConfig) {
			this._associatedProvider = provider;
			this._tabsByTag = new Map<string, string[]>();
			this._tabsByName = new Map<string, string[]>();
			this._tabConfigs = new Map<string, AppConfig>();
			this._sessionConfig = config;
		}

		public get associatedProvider(): CIProvider {
			return this._associatedProvider;
		}

		public setTab(tabConfig: AppConfig, tabid: string, name: string, tags?: string[]): void {
			if (!this._tabsByName.has(name)) {
				this._tabsByName.set(name, []);
			}
			this._tabsByName.get(name).push(tabid);
			this._tabConfigs.set(tabid, tabConfig);
			tags.forEach(function (tag: string) {
				if (!this._tabsByTag.has(tag)) {
					this._tabsByTag.set(tag, []);
				}
				this._tabsByTag.get(tag).push(tabid);
			}.bind(this));
		}

		public removeTab(tabid: string): void {
			this._tabsByName.forEach(function (vals) {
				let index = vals.indexOf(tabid);
				if (index > -1) {
					vals.splice(index, 1);
				}
			});
			this._tabConfigs.delete(tabid);
			this._tabsByTag.forEach(function (vals: string[]) {
				let index = vals.indexOf(tabid);
				if (index > -1) {
					vals.splice(index, 1);
				}
			}.bind(this));
		}
		public getTabsByTag(tag: string): string[] {
			return this._tabsByTag.get(tag);
		}

		public getTabsByName(name: string): string[] {
			return this._tabsByName.get(name);
		}
		public resolveTitle(input: any): Promise<string> {
			if (isNullOrUndefined(this._sessionConfig)) {
				return Promise.reject("No string resolver configured");
			}
			return this._sessionConfig.resolveTitle(input);
		}
		public resolveTabTitle(tabid: string, input: any): Promise<string> {
			if (!this._tabConfigs.has(tabid)) {
				return Promise.reject("No string resolver configured");
			}
			return this._tabConfigs.get(tabid).resolveTitle(input);
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

		associateTabWithSession(sessionId: string, tabId: string, tabConfig: AppConfig, name: string, tags?: string[]) {
			if (this.sessions.has(sessionId)) {
				this.sessions.get(sessionId).setTab(tabConfig, tabId, name, tags);
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
		abstract getFocusedSession(telemetryData?: Object): string;

		abstract canCreateSession(telemetryData?: Object): boolean;

		abstract createSession(provider: CIProvider, input: any, context: any, customerName: string ,telemetryData?: Object, appId?: any, cifVersion?: any): Promise<string>;

		abstract focusSession(sessionId: string): Promise<void>;

		abstract requestFocusSession(sessionId: string, messagesCount: number, telemetryData?: Object): Promise<void>;

		abstract closeSession(sessionId: string): Promise<boolean>;

		abstract getFocusedTab(sessionId: string, telemetryData?: Object): string;

		abstract createTab(sessionId: string, input: any, telemetryData?: Object): Promise<string>

		abstract focusTab(sessionId: string, tabId: string, telemetryData?: Object): Promise<void>;

		abstract closeTab(sessionId: string, tabId: string): Promise<boolean>;

		abstract refreshTab(sessionId: string, tabId: string): Promise<boolean>;

		setSessionTitle(sessionId: string, input: any): Promise<string> {
			if (!this.sessions.has(sessionId)) {
				let error = {} as IErrorHandler;
				error.reportTime = new Date().toUTCString();
				error.errorMsg = "Session Id " + sessionId + " not found";
				error.errorType = errorTypes.GenericError;
				error.sourceFunc = this.setSessionTitle.name;
				return Promise.reject(error);
			}
			let sessionInfo = this.sessions.get(sessionId);
			return sessionInfo.resolveTitle(input).then(
				function (result: string) {
					Xrm.App.sessions.getSession(sessionId).title = result;
					return Promise.resolve(result);
				},
				function (error) {
					return Promise.reject(error);
				});
		}

		setTabTitle(sessionId: string, tabId: string, input: any): Promise<string> {
			if (!this.sessions.has(sessionId)) {
				let error = {} as IErrorHandler;
				error.reportTime = new Date().toUTCString();
				error.errorMsg = "Session Id " + sessionId + " not found";
				error.errorType = errorTypes.GenericError;
				error.sourceFunc = this.setSessionTitle.name;
				return Promise.reject(error);
			}
			let sessionInfo = this.sessions.get(sessionId);
			return sessionInfo.resolveTabTitle(tabId, input).then(
				function (result: string) {
					Xrm.App.sessions.getSession(sessionId).tabs.getTab(tabId).title = result;
					return Promise.resolve(result);
				}, function (error) {
					return Promise.reject(error);
				});
		}
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