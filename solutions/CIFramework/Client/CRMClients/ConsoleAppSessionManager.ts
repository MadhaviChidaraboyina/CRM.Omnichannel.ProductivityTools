/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

/// <reference path="../../../../references/external/TypeDefinitions/lib.es6.d.ts" />
/** @internal */
namespace Microsoft.CIFramework.Internal {
	export class ConsoleAppSessionManager extends SessionManager {
		createSession(provider: CIProvider, input: any, context: any, initials: string): Promise<string> {
			return new Promise(function (resolve: any, reject: any) {
				(Xrm as any).App.sessions.createSession(input).then(function (sessionId: string) {
					this.Sessions.set(sessionId, provider);
					resolve(sessionId);
				}.bind(this), function (errorMessage: string) {
					let error = {} as IErrorHandler;
					error.reportTime = new Date().toUTCString();
					error.errorMsg = errorMessage;
					error.errorType = errorTypes.GenericError;
					error.sourceFunc = createSession.name;
					reject(error);
				});
			}.bind(this));
		}

		requestSessionFocus(sessionId: string, messagesCount: number): Promise<void> {
			(Xrm as any).App.sessions.getSession(sessionId).requestFocus();
			return Promise.resolve();
		}

		focusSession(sessionId: string): Promise<void> {
			(Xrm as any).App.sessions.getSession(sessionId).focus();
			this.visibleSession = sessionId;
			return Promise.resolve();
		}

		closeSession(sessionId: string): Promise<boolean> {
			return new Promise(function (resolve: any, reject: any) {
				(Xrm as any).App.sessions.getSession(sessionId).close().then(function (closeStatus: boolean) {
					this.Sessions.delete(sessionId);
					resolve(closeStatus);
				}.bind(this), function (errorMessage: string) {
					let error = {} as IErrorHandler;
					error.reportTime = new Date().toUTCString();
					error.errorMsg = errorMessage;
					error.errorType = errorTypes.GenericError;
					error.sourceFunc = closeSession.name;
					reject(error);
				});
			}.bind(this))
		}

		createSessionTab(sessionId: string, input: any): Promise<string> {
			return new Promise(function (resolve: any, reject: any) {
				(Xrm as any).App.sessions.getSession(sessionId).tabs.createTab(input).then(function (tabId: string) {
					resolve(tabId);
				}, function (errorMessage: string) {
					let error = {} as IErrorHandler;
					error.reportTime = new Date().toUTCString();
					error.errorMsg = errorMessage;
					error.errorType = errorTypes.GenericError;
					error.sourceFunc = "createSessionTab";
					reject(error);
				});
			});
		}

		focusSessionTab(sessionId: string, tabId: string): Promise<void> {
			(Xrm as any).App.sessions.getSession(sessionId).tabs.getTab(tabId).focus();
			return Promise.resolve();
		}

		closeSessionTab(sessionId: string, tabId: string): Promise<boolean> {
			return new Promise(function (resolve: any, reject: any) {
				(Xrm as any).App.sessions.getSession(sessionId).tabs.getTab(tabId).close().then(function (closeStatus: boolean) {
					resolve(closeStatus);
				}, function (errorMessage: string) {
					let error = {} as IErrorHandler;
					error.reportTime = new Date().toUTCString();
					error.errorMsg = errorMessage;
					error.errorType = errorTypes.GenericError;
					error.sourceFunc = "closeSessionTab";
					reject(error);
				});
			});
		}
	}
}