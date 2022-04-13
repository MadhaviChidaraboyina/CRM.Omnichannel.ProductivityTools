/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/
module MscrmControls.Callscript
{
	'use strict';

	/**
	 * Utility class to interact with CIF
	 */
	export class CECUtil
	{
		// properties
        private context: Mscrm.ControlData<IInputBag>;
        private appRuntime: AppRuntimeClientSdk.ISessionContext;
		private telemetryContext: string;
        private telemetryLogger: TelemetryLogger;

		constructor(context: Mscrm.ControlData<IInputBag>, logger: TelemetryLogger)
		{
            this.context = context;
			this.telemetryContext = TelemetryComponents.CIFUtil;
            this.telemetryLogger = logger;
        }

		/**
		 * Get session template name for focussed session
		 * @returns Session template name
		 */
		public async getSessionTemplateName(): Promise<string>
		{
            let methodName = "getSessionTemplateName";
            let sessionTemplateName: string = "";

            try {
                let context = await Microsoft.AppRuntime.Sessions.getFocusedSession().getContext();
                if (!this.context.utils.isNullOrUndefined(context)) {
                    sessionTemplateName = context.templateName;
                }
			}
			catch (error) {
				let errorMessage = "Failed to retrieve session template name";
				let errorParam = new EventParameters();
				errorParam.addParameter("errorDetails", error);
				this.telemetryLogger.logError(this.telemetryContext, methodName, errorMessage, errorParam);
			}

            return sessionTemplateName;
		}

		/**
		 * Returns value for key in session template params for focussed session
		 * @param key key for entry whose value is returned
		 */
        public async getValueFromSessionTemplateParams(key: string): Promise<any> {
			let methodName = "getValueFromSessionTemplateParams";
			try {
                //let sessionTemplateParams = this.cifExternalUtil.getSessionTemplateParams();
                let sessionId = Microsoft.AppRuntime.Sessions.getFocusedSession().sessionId;
                let sessionTemplateParams;
                var context = await Microsoft.AppRuntime.Sessions.getSession(sessionId).getContext();
                if (!this.context.utils.isNullOrUndefined(context)) {
                    sessionTemplateParams = context.get(sessionId);
                }
				if (!this.context.utils.isNullOrUndefined(sessionTemplateParams) && !this.context.utils.isNullOrUndefined(sessionTemplateParams[key])) {
					return sessionTemplateParams[key];
				}
			}
			catch (error) {
				let errorMessage = "Failed to get value from session template params";
				let errorParam = new EventParameters();
				errorParam.addParameter("errorDetails", error);
				errorParam.addParameter("lookupKey", key);
				this.telemetryLogger.logError(this.telemetryContext, methodName, errorMessage, errorParam);
				return null;
			}
		}

		/**
		 * Updates value in session template params for specified session
		 * @param key key for the new/updated entry in session template params
		 * @param value value for the new/updated entry in session template params
		 * @param sessionId id of session whose params are updated
		 */
        public async setValueInSessionTemplateParams(key: string, value: any, sessionId: string): Promise<void> {
			let methodName = "setValueInSessionTemplateParams";
			let input: Mscrm.Dictionary = {};
			input[key] = value;
            try {
                var context = await Microsoft.AppRuntime.Sessions.getSession(sessionId).getContext();
                if (!this.context.utils.isNullOrUndefined(context)) {
                    context.set(sessionId, input);
                }
			}
			catch (error) {
				let errorMessage = "Failed to add/update key-value pair in session template params";
				let errorParam = new EventParameters();
				errorParam.addParameter("errorDetails", error);
				errorParam.addParameter("uciSessionId", sessionId);
				this.telemetryLogger.logError(this.telemetryContext, methodName, errorMessage, errorParam);
			}
		}
	}

	/**
	 * Utility class to interact with Macros
	 */
	export class MacroUtil
	{
		// properties
		private context: Mscrm.ControlData<IInputBag>;
		private telemetryContext: string;
        private telemetryLogger: TelemetryLogger;

		constructor(context: Mscrm.ControlData<IInputBag>, logger: TelemetryLogger)
		{
			this.context = context;
			this.telemetryContext = TelemetryComponents.MacroUtil;
            this.telemetryLogger = logger;
        }

		public async init() {
			await this.resolveInitMacroTemplate();
		}

		/**
		 * Execute macro using macro api
		 * @param macroName macro name
		 * @param macroParam macro parameter
		 */
		public async executeMacro(macroName: string, macroId: string, macroParam?: any): Promise<string>
		{
			let methodName = "executeMacro";
			try {
				await this.resolveInitMacroTemplate();
				return Microsoft.ProductivityMacros.runMacro(macroName);
			}
			catch (error) {
				let errorMessage = "Failed to execute run macro api";
				let errorParam = new EventParameters();
				errorParam.addParameter("errorDetails", error);
				errorParam.addParameter("macroId", macroId);
				this.telemetryLogger.logError(this.telemetryContext, methodName, errorMessage, errorParam);

				return new Promise<string>((resolve, reject) => {
					reject(error);
				});
			}
        }

        public async resolveInitMacroTemplate() {
			let methodName = "resolveInitMacroTemplate";
			let _this = this;
			let eventParams = new EventParameters();
			eventParams.addParameter("message", "Start resolve init macro template");
			_this.telemetryLogger.logSuccess(_this.telemetryContext, methodName, eventParams);
			// Set 10s time out if the InitMacroActionTemplates does not finish and pend for loading.
			const timeoutPromise = new Promise((resolve, reject) => {
				setTimeout(resolve, 10000, 'time out triggered');
			});
			const initMacroPromise = Microsoft.ProductivityMacros.Internal.ProductivityMacroOperation.InitMacroActionTemplates();
			await Promise.race([timeoutPromise, initMacroPromise]).then((value) => {
				if (_this.telemetryLogger)
				{
					eventParams.addParameter("message", value == 'time out triggered' ? "Resolve init macro template over time limit" : "Macro template init is finished");
					_this.telemetryLogger.logSuccess(_this.telemetryContext, methodName, eventParams);
				}
			}, function (error) {
				if (_this.telemetryLogger)
				{
					let errorMessage = "Failed to initiate macro template";
					let errorParam = new EventParameters();
					errorParam.addParameter("errorDetails", error);
					_this.telemetryLogger.logError(_this.telemetryContext, methodName, errorMessage, errorParam);
				}
			})
        }

        /**
         * Resolve replaceable parameters
         * @param inputParam input parameter string
         * @returns Resolved replaceable parameter
         */
        public async resolveReplaceableParameters(inputParam: string): Promise<string> {
            let methodName = "resolveReplaceableParameters";
            try {
				await this.resolveInitMacroTemplate();
                return Microsoft.ProductivityMacros.Internal.resolveTemplateString(inputParam, null, "");
            }
            catch (error) {
                let errorMessage = "Failed to resolve replaceable parameters in text";
                let errorParam = new EventParameters();
                errorParam.addParameter("errorDetails", error);
                this.telemetryLogger.logError(this.telemetryContext, methodName, errorMessage, errorParam);
                return new Promise((resolve, reject) => {
                    resolve(inputParam);
                });
            }
        }
	}
}