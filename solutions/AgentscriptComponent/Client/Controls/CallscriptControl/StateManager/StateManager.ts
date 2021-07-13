/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/

module MscrmControls.Callscript {
	'use strict';

	export class StateManager {

		private context: Mscrm.ControlData<IInputBag>;
		private dataManager: DataManager;
		private cecUtil: CECUtil;
		private telemetryContext: string;
		private telemetryLogger: TelemetryLogger;

		private isScriptsDataRequested: boolean;
		public scriptDataFetchFailed: boolean;
		private currentUciSessionId: string;
		public selectedScriptForCurrentSession: CallScript;
		public callscriptsForCurrentSession: CallScript[];

		/**
		 * Constructor
		 * @param context control's input bag
		 */
		constructor(context: Mscrm.ControlData<IInputBag>) {
			this.context = context;
			this.dataManager = new DataManager(context);
			this.cecUtil = new CECUtil(context);
			this.callscriptsForCurrentSession = null;
			this.selectedScriptForCurrentSession = null;
			this.telemetryContext = TelemetryComponents.StateManager;
			this.telemetryLogger = new TelemetryLogger(this.context);
			this.isScriptsDataRequested = false;
			this.scriptDataFetchFailed = false;

			this.setCurrentUciSessionId();
			this.initializeControlStateFromCEC();
        }

        public async onSessionRefresh(): Promise<void> {
			// setting to null removes the previously stored callscripts
			// needed since the sessionID remains the same on SessionRefresh event
			this.callscriptsForCurrentSession = null;
			await this.onSessionSwitch();
        }

		// this method reset the required properties when session switch / create
		public async onSessionSwitch(): Promise<void> {
			this.updateControlStateInCEC();
            this.setCurrentUciSessionId();
            await this.initializeControlStateFromCEC();
            if (this.context.utils.isNullOrUndefined(this.callscriptsForCurrentSession)) {
                this.selectedScriptForCurrentSession = null;
                this.isScriptsDataRequested = false;
                this.scriptDataFetchFailed = false;
                //TODO: need to remove this code once CEC bug is fixed related to null context on
                //session create and session switch
            }
            else {
                this.scriptDataFetchFailed = false;
            }
            this.context.utils.requestRender();
		}

		/**
		 * Sets the value of sessionId to id of focussed session for this control instance
		 */
		private setCurrentUciSessionId(): void {
			let methodName = "setCurrentUciSessionId";
			try {
				this.currentUciSessionId = (window as any).top.Xrm.App.sessions.getFocusedSession().sessionId;
			}
			catch(error) {
				this.currentUciSessionId = "";
				let eventParams = new EventParameters();
				eventParams.addParameter("message", "Failed to retrieve UCI session id");
				this.telemetryLogger.logError(this.telemetryContext, methodName, error, eventParams);
			}
		}

		/**
		 * Initializes control state from CIF session template params
		 */
		private async initializeControlStateFromCEC(): Promise<void> {
			this.callscriptsForCurrentSession = await this.cecUtil.getValueFromSessionTemplateParams(Constants.ControlStateKey);
		}

		/**
		 *  Updates/Adds control state into CIF session template params
		 */
		public updateControlStateInCEC(): void {
			this.cecUtil.setValueInSessionTemplateParams(Constants.ControlStateKey, this.callscriptsForCurrentSession, this.currentUciSessionId);
		}

		/**
		 * Returns active callscript for session by checking values in dictionary
		 * @param sessionId id of session whose current callscript is returned
		 */
		public getCurrentCallScript(): CallScript {
			for (let script of this.callscriptsForCurrentSession) {
				if (script.isCurrent) {
					return script;
				}
			}
			if (this.callscriptsForCurrentSession.length > 0) {
				this.callscriptsForCurrentSession[0].isCurrent = true;
				return this.callscriptsForCurrentSession[0];
			}
			return null;
		}

		/**
		 * Fetch callscript data from CRM config
		*/
		private fetchCallScriptsForCurrentSession(): void {
			let methodName = "fetchCallScriptsForCurrentSession";
			let dataManagerPromise = this.dataManager.retrieveInitialData();

			dataManagerPromise.then(
				(callscriptRecords: CallScript[]) => {
					let retrieveDefaultCallScriptPromise = this.dataManager.retrieveDefaultCallScript();
					retrieveDefaultCallScriptPromise.then(
						function (defaultCallScriptID: string) {
							this.callscriptsForCurrentSession = callscriptRecords;
							if (!this.context.utils.isNullOrUndefined(defaultCallScriptID)) {
								this.updateCurrentCallScriptByID(defaultCallScriptID);
							}
							this.context.utils.requestRender();
						}.bind(this),
						function (errorMessage: string) {
							//TODO : Show Error message 
							this.callscriptsForCurrentSession = callscriptRecords;
							this.context.utils.requestRender();
						}.bind(this)
					);							
										
					let eventParams = new EventParameters();
					eventParams.addParameter("totalScripts", callscriptRecords.length.toString());
					eventParams.addParameter("message", "Call script records retrieved for session");
					this.telemetryLogger.logSuccess(this.telemetryContext, methodName, eventParams);
				},
				(errorString: string) => {
					this.scriptDataFetchFailed = true;
					this.context.utils.requestRender();

					let errorMessage = "Failed to retrieve call script records";
					let errorParam = new EventParameters();
					errorParam.addParameter("errorDetails", errorString);
					errorParam.addParameter("session-id", this.currentUciSessionId);
					this.telemetryLogger.logError(this.telemetryContext, methodName, errorMessage, errorParam);
				}
			);
		}

		/**
		 * Fetch script steps configured for this script from CRM
		 * @param script whose steps are being retrived
		 */
		private fetchStepsForCallscript(script: CallScript): void {
			let methodName = "fetchStepsForCallscript";
			this.dataManager.retrieveCallScriptStepsData(script.id).then(
				(stepsResponse: CallScriptStep[]) => {
					script.steps = stepsResponse;
					script.isStepsDataRetrieved = true;
					this.context.utils.requestRender();

					let eventParams = new EventParameters();
					eventParams.addParameter("callscriptId", script.id);
					eventParams.addParameter("number of retrieved steps", this.selectedScriptForCurrentSession.steps.length.toString());
					eventParams.addParameter("message", "Data fetch for callscript steps completed successfully");
					this.telemetryLogger.logSuccess(this.telemetryContext, methodName, eventParams);
				},
				(error) => {
					//Log error telemetry
					let eventParams = new EventParameters();
					eventParams.addParameter("callscriptId", script.id);
					eventParams.addParameter("message", "Error in retrieving steps for callscript from CRM config");
					this.telemetryLogger.logError(this.telemetryContext, methodName, error, eventParams);
				}
			);
		}

		/**
		 * Initializes current session callscript variables
		*/
		public initializeCallscriptsForCurrentSession(): boolean {
			let methodName = "initializeCallscriptsForCurrentSession";

			if (this.scriptDataFetchFailed) {
				return true;
			}

			if (!this.context.utils.isNullOrUndefined(this.callscriptsForCurrentSession)) {
				this.selectedScriptForCurrentSession = this.getCurrentCallScript();
				if (!this.context.utils.isNullOrUndefined(this.selectedScriptForCurrentSession)) {
					if (this.selectedScriptForCurrentSession.isStepsDataRetrieved) {
						return true;
					}
					else {
						this.fetchStepsForCallscript(this.selectedScriptForCurrentSession);
						return false;
					}
				}
				return true;
			}
			else {
				if (!this.isScriptsDataRequested) {
					this.isScriptsDataRequested = true;
					this.fetchCallScriptsForCurrentSession();
				}
				return false;
			}
		}

		/**
		 * To retrieve call script record and its steps
		 * Use this function to retrieve call script if it is not retrieved in initial load
		 * @param callscriptId call script record id
		 */
		public fetchCallscriptAndStepsData(callscriptId: string): Promise<CallScript> {

			return new Promise<CallScript>((resolve, reject) => {
				let methodName = "fetchCallscriptAndStepsData";
				let dataFetchPromise = this.dataManager.retrieveCallscriptAndStepsData(callscriptId);

				dataFetchPromise.then(
					(newCallscriptRecord: CallScript) => {
						// Add new call script record in current session record list
						this.callscriptsForCurrentSession.push(newCallscriptRecord);

						resolve(newCallscriptRecord);
					},
					(errorResponse: string) => {
						let errorMessage = "Failed to retrieve call script";
						let errorParam = new EventParameters();
						errorParam.addParameter("recordId", callscriptId);
						this.telemetryLogger.logError(this.telemetryContext, methodName, errorMessage, errorParam);

						reject(errorResponse);
					}
				);
			});
		}

		/**
		 * Updates given call script as current call script for the session
		 * In next re-render updated call script will be loaded
		 * @param newCurrentScript new call script to set as current script
		 */
		public updateCurrentCallScript(newCurrentScript: CallScript) {
			for (let script of this.callscriptsForCurrentSession) {
				if (script.id == newCurrentScript.id) {
					script.isCurrent = true;
				}
				else {
					script.isCurrent = false;
				}
			}
		}

		/**
		 * Updates given call script as current call script for the session
		 * In next re-render updated call script will be loaded
		 * @param newCurrentScriptID new call script id to set as current script
		 */
		public updateCurrentCallScriptByID(newCurrentScriptID: string) {
			for (let script of this.callscriptsForCurrentSession) {
				if (script.id == newCurrentScriptID) {
					script.isCurrent = true;
				}
				else {
					script.isCurrent = false;
				}
			}
		}
	}
}