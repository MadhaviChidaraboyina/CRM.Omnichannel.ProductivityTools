/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/

module MscrmControls.ProductivityPanel {
	'use strict';

	export class StateManager {

		private context: Mscrm.ControlData<IInputBag>;
		private sessions: { [id: string]: CallScript[] };
		private requestedSessionIds: string[];
		private dataManager: DataManager;

		public selectedScriptForCurrentSession: CallScript;
		public callscriptsForCurrentSession: CallScript[];
		public currentUciSessionId: string;

		/**
		 * Constructor
		 * @param context control's input bag
		 */
		constructor(context: Mscrm.ControlData<IInputBag>) {
			this.context = context;
			this.sessions = {};
			this.currentUciSessionId = "";
			this.dataManager = new DataManager(context);
			this.selectedScriptForCurrentSession = null;
			this.requestedSessionIds = [];
		}

		/**
		 * Returns boolean value indicating whether session data is available in state
		 * @param sessionId id of session whose data is to be checked
		 */
		private isSessionDataAvailable(sessionId: string): boolean {
			let callScriptData = this.sessions[sessionId];
			if (this.context.utils.isNullOrUndefined(callScriptData)) {
				return false;
			}
			return true;
		}

		/**
		 * Returns callscript array for session 
		 * @param sessionId id of session whose callscripts are returned
		 */
		public getCallScriptForSession(sessionId: string): CallScript[] {
			if (this.isSessionDataAvailable(sessionId) == false) {
				return null;
			}

			let callScriptToRender = this.sessions[sessionId];
			return callScriptToRender;
		}

		/**
		 * Updated/Adds callscripts for session in dictionary
		 * @param sessionId id of session as key in dictionary
		 * @param callScripts callscripts for session as value in dictionary
		 */
		public setCallScriptForSession(sessionId: string, callScripts: CallScript[]): void {
			this.sessions[sessionId] = callScripts;
		}

		/**
		 * Removes closed session data from dictionary
		 * @param sessionId id of closed session whose value is removed
		 */
		public removeClosedSession(sessionId: string): void {
			if (this.isSessionDataAvailable(sessionId) == false) {
				console.log("Invalid session closed");
				return;
			}

			delete this.sessions[sessionId];
		}

		/**
		 * Returns active callscript for session by checking values in dictionary
		 * @param sessionId id of session whose current callscript is returned
		 */
		public getCurrentCallScriptForSession(sessionId: string) {
			if (this.isSessionDataAvailable(sessionId)) {
				for (let script of this.sessions[sessionId]) {
					if (script.isCurrent) {
						return script;
					}
				}
			}
			return null;
		}

		/**
		 * Fetch callscript data from CRM config
		*/
		private fetchCallScriptsDataForSession(sessionId: string): void {
			this.dataManager.retrieveCallScriptsForSession(sessionId).then(
				(callscriptsResponse: CallScript[]) => {
					let sessionIdIndex = this.requestedSessionIds.indexOf(sessionId);
					this.requestedSessionIds.splice(sessionIdIndex, 1);
					this.setCallScriptForSession(sessionId, callscriptsResponse);
					this.context.utils.requestRender();
				},
				(error) => {
					//Log error telemetry
				}
			);
		}

		/**
		 * Returns true if data fetch for session has already been initiated
		 * @param sessionId session id for the query
		 */
		public isSessionDataRequested(sessionId: string): boolean {
			let sessionIdIndex = this.requestedSessionIds.indexOf(sessionId);
			return (sessionIdIndex !== -1);
		}

		/**
		 * Initializes current session callscript variables
		*/
		public initializeCallscriptsForCurrentSession(): boolean {
			if (this.isSessionDataAvailable(this.currentUciSessionId)) {
				this.callscriptsForCurrentSession = this.getCallScriptForSession(this.currentUciSessionId);
				this.selectedScriptForCurrentSession = this.getCurrentCallScriptForSession(this.currentUciSessionId);
				return true;
			}
			else {
				if (!this.isSessionDataRequested(this.currentUciSessionId)) {
					this.requestedSessionIds.push(this.currentUciSessionId);
					this.fetchCallScriptsDataForSession(this.currentUciSessionId);
				}
				return false;
			}
		}

		/**
		 * Update callscripts for session in dictionary
		 * Will update the dictionary with updated scripts of current session if no session is specified
		 * @param sessionId id of session whose state has to be updated
		 * @param scripts value of updated scripts
		 */
		public updateSessionState(sessionId?: string, scripts?: CallScript[]): void {
			if (this.context.utils.isNullOrUndefined(sessionId)) {
				sessionId = this.currentUciSessionId;
				scripts = this.callscriptsForCurrentSession;
			}
			this.setCallScriptForSession(sessionId, scripts);
		}

	}
}