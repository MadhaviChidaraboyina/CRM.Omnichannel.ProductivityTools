/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/
module MscrmControls.CallscriptControl
{
	'use strict';

	/**
	 * Utility class to interact with CIF
	 */
	export class CIFUtil
	{
		// properties
		private context: Mscrm.ControlData<IInputBag>;
        private cifExternalUtil: Microsoft.CIFramework.External.CIFExternalUtilityImpl;
		private telemetryContext: string;
		private telemetryLogger: TelemetryLogger;

		constructor(context: Mscrm.ControlData<IInputBag>)
		{
			this.context = context;
			this.cifExternalUtil = new Microsoft.CIFramework.External.CIFExternalUtilityImpl();
			this.telemetryContext = TelemetryComponents.CIFUtil;
			this.telemetryLogger = new TelemetryLogger(this.context);
		}

		/**
		 * Get session template id for focussed session
		 * @param uciSessionId uci session id
		 * @returns Session template id
		 */
		public getSessionTemplateId(): string
		{
			let methodName = "getSessionTemplateId";
			let sessionTemplateId: string = "";

			try {
				sessionTemplateId = this.cifExternalUtil.getTemplateForSession();
			}
			catch (error) {
				let errorMessage = "Failed to retrieve session template id";
				let errorParam = new EventParameters();
				errorParam.addParameter("errorDetails", error);
				this.telemetryLogger.logError(this.telemetryContext, methodName, errorMessage, errorParam);
			}

			if (this.context.utils.isNullOrUndefined(sessionTemplateId) ||
				this.context.utils.isNullOrEmptyString(sessionTemplateId)) {

				try {
					//couldn't retrieve from CIF, fetch from form query parameters
					let queryStringParameters = (window as any).Xrm.Page.context.getQueryStringParameters();
					sessionTemplateId = queryStringParameters.templateId;
				} catch (error) {
					let errorMsg = "Failed to retrieve session template id from form param";
					let errorParams = new EventParameters();
					errorParams.addParameter("errorDetails", error);
					this.telemetryLogger.logError(this.telemetryContext, methodName, errorMsg, errorParams);
				}
			}
			
			return sessionTemplateId;
		}

		/**
		 * Resolve replaceable parameters
		 * @param inputParam input parameter string
		 * @param uciSessionId uci session id
		 * @returns Resolved replaceable parameter
		 */
		public resolveReplaceableParameters(inputParam: string): Promise<string>
		{
			let methodName = "resolveReplaceableParameters";
			try {
                let templateParams = this.cifExternalUtil.getSessionTemplateParams();
                return this.cifExternalUtil.resolveTemplateString(inputParam, templateParams, "");
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

		/**
		 * Returns value for key in session template params for focussed session
		 * @param key key for entry whose value is returned
		 */
		public getValueFromSessionTemplateParams(key: string): any {
			let methodName = "getValueFromSessionTemplateParams";
			try {
				let sessionTemplateParams = this.cifExternalUtil.getSessionTemplateParams();
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
		public setValueInSessionTemplateParams(key: string, value: any, sessionId: string): void {
			let methodName = "setValueInSessionTemplateParams";
			let input: Mscrm.Dictionary = {};
			input[key] = value;
			try {
				this.cifExternalUtil.setSessionTemplateParams(input, sessionId);
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
        private static isInitMacroActionTemplates: boolean;
        private initMacroActionTemplatesPromise: Promise<boolean>;

		constructor(context: Mscrm.ControlData<IInputBag>)
		{
			this.context = context;
			this.telemetryContext = TelemetryComponents.MacroUtil;
            this.telemetryLogger = new TelemetryLogger(this.context);
            
            this.initMacroActionTemplatesPromise= Microsoft.ProductivityMacros.Internal.ProductivityMacroOperation.InitMacroActionTemplates();
            this.resolveInitMacroTemplate();
        }

		/**
		 * Execute macro using macro api
		 * @param macroName macro name
		 * @param macroParam macro parameter
		 */
		public executeMacro(macroName: string, macroId: string, macroParam?: any): Promise<string>
		{
			let methodName = "executeMacro";
			try {
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

        public resolveInitMacroTemplate() {
            this.initMacroActionTemplatesPromise.then(
                function (value) {
                    MacroUtil.isInitMacroActionTemplates = value;
                },
                function (error) {
                    MacroUtil.isInitMacroActionTemplates = false;
                }
            );
        }

        /**
         * Resolve replaceable parameters
         * @param inputParam input parameter string
         * @returns Resolved replaceable parameter
         */
        public resolveReplaceableParameters(inputParam: string): Promise<string> {
            let methodName = "resolveReplaceableParameters";
            try {
                if (MacroUtil.isInitMacroActionTemplates) {
                    return Microsoft.ProductivityMacros.Internal.resolveTemplateString(inputParam, null, "");
                }
                else {
                    return new Promise((resolve, reject) => {
                        resolve(inputParam);
                    });
                }
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