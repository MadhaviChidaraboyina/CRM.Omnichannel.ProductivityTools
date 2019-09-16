/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/

module MscrmControls.ProductivityPanel {
	'use strict';

	export class StateManager {

		private context: Mscrm.ControlData<IInputBag>;
		private dataManager: DataManager;
		private cifUtil: CIFUtil;
		private telemetryContext: string;
		private telemetryLogger: TelemetryLogger;

		private isScriptsDataRequested: boolean;
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
			this.cifUtil = new CIFUtil(context);
			this.callscriptsForCurrentSession = null;
			this.selectedScriptForCurrentSession = null;
			this.telemetryContext = TelemetryComponents.StateManager;
			this.telemetryLogger = new TelemetryLogger(this.context);
			this.isScriptsDataRequested = false;

			this.setCurrentUciSessionId();
			this.initializeControlStateFromCIF();
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
		private initializeControlStateFromCIF(): void {
			this.callscriptsForCurrentSession = this.cifUtil.getValueFromSessionTemplateParams(Constants.ControlStateKey);
		}

		/**
		 *  Updates/Adds control state into CIF session template params
		 */
		public updateControlStateInCIF(): void {
			this.cifUtil.setValueInSessionTemplateParams(Constants.ControlStateKey, this.callscriptsForCurrentSession, this.currentUciSessionId);
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
					this.callscriptsForCurrentSession = callscriptRecords;
					this.context.utils.requestRender();

					let eventParams = new EventParameters();
					eventParams.addParameter("totalScripts", callscriptRecords.length.toString());
					eventParams.addParameter("message", "Call script records retrieved for session");
					this.telemetryLogger.logSuccess(this.telemetryContext, methodName, eventParams);
				},
				(errorString: string) => {
					let errorMessage = "Failed to retrieve call script records";
					let errorParam = new EventParameters();
					errorParam.addParameter("errorDetails", errorString);
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
	}
}